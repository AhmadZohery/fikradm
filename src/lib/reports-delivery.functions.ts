import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertStaff(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
  if (error || !data) throw new Error("Forbidden");
}

function formatSlack(report: any) {
  const p = report.payload || {};
  const top = (p.top_pages || []).slice(0, 5).map((x: any, i: number) => `${i + 1}. ${x.path} — *${x.count}*`).join("\n") || "—";
  const src = (p.leads_by_source || []).slice(0, 5).map((x: any) => `• ${x.source}: *${x.count}*`).join("\n") || "—";
  const ctr = (p.ctr_top || []).slice(0, 5).map((x: any) => `• ${x.url}: ${(x.ctr * 100).toFixed(1)}%`).join("\n") || "—";
  return {
    text: `📊 تقرير ${p.label}`,
    blocks: [
      { type: "header", text: { type: "plain_text", text: `📊 تقرير ${p.label || ""}` } },
      { type: "section", text: { type: "mrkdwn", text: report.summary || "" } },
      { type: "section", fields: [
        { type: "mrkdwn", text: `*Page views*\n${p.totals?.page_views ?? 0}` },
        { type: "mrkdwn", text: `*Leads*\n${p.totals?.leads ?? 0}` },
      ]},
      { type: "section", text: { type: "mrkdwn", text: `*أعلى الصفحات*\n${top}` } },
      { type: "section", text: { type: "mrkdwn", text: `*Leads حسب المصدر*\n${src}` } },
      { type: "section", text: { type: "mrkdwn", text: `*أعلى CTR*\n${ctr}` } },
    ],
  };
}

function formatEmailHtml(report: any) {
  const p = report.payload || {};
  const rows = (arr: any[], cols: (r: any) => string) =>
    arr.map((r) => `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee">${cols(r)}</td></tr>`).join("");
  return `<!doctype html><html dir="rtl"><body style="font-family:system-ui;background:#f7f7fb;padding:24px">
    <div style="max-width:640px;margin:auto;background:#fff;border-radius:12px;padding:24px">
      <h1 style="margin:0 0 8px">📊 تقرير ${p.label || ""}</h1>
      <p style="color:#666">${report.summary || ""}</p>
      <h3>أعلى الصفحات</h3>
      <table style="width:100%;border-collapse:collapse">${rows((p.top_pages || []).slice(0, 10), (r: any) => `${r.path} — <b>${r.count}</b>`)}</table>
      <h3>Leads حسب المصدر</h3>
      <table style="width:100%;border-collapse:collapse">${rows((p.leads_by_source || []).slice(0, 10), (r: any) => `${r.source} — <b>${r.count}</b>`)}</table>
      <h3>أعلى CTR</h3>
      <table style="width:100%;border-collapse:collapse">${rows((p.ctr_top || []).slice(0, 10), (r: any) => `${r.url} — <b>${(r.ctr * 100).toFixed(1)}%</b>`)}</table>
    </div></body></html>`;
}

export const deliverReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { reportId: string; channels: ("slack" | "email")[] }) => d)
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { data: report, error } = await context.supabase.from("monthly_reports").select("*").eq("id", data.reportId).single();
    if (error || !report) throw new Error("Report not found");

    // Load notification config from site_settings
    const { data: cfg } = await context.supabase.from("site_settings").select("data").eq("key", "admin_notifications").maybeSingle();
    const settings = (cfg?.data || {}) as { slack_webhook_url?: string; report_email?: string };

    const results: Record<string, { ok: boolean; message: string }> = {};

    if (data.channels.includes("slack")) {
      if (!settings.slack_webhook_url) {
        results.slack = { ok: false, message: "SLACK_WEBHOOK_URL غير مهيأ — اضبطه في إعدادات الإشعارات" };
      } else {
        try {
          const r = await fetch(settings.slack_webhook_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formatSlack(report)),
          });
          results.slack = { ok: r.ok, message: r.ok ? "تم الإرسال إلى Slack" : `Slack ${r.status}` };
        } catch (e: any) {
          results.slack = { ok: false, message: e?.message || "فشل Slack" };
        }
      }
    }

    if (data.channels.includes("email")) {
      const to = settings.report_email;
      if (!to) {
        results.email = { ok: false, message: "report_email غير مهيأ في إعدادات الإشعارات" };
      } else {
        // Enqueue via the email queue if available; otherwise mark as queued
        try {
          const payload: any = report.payload || {};
          const { error: qErr } = await (context.supabase as any).rpc("enqueue_email", {
            queue: "transactional_emails",
            payload: {
              to,
              subject: `📊 ${payload.label || "Monthly Report"}`,
              html: formatEmailHtml(report),
              template_name: "monthly_report",
              message_id: `report-${report.id}`,
            },
          });
          results.email = qErr
            ? { ok: false, message: `email queue: ${qErr.message}` }
            : { ok: true, message: `تم وضعه في طابور الإرسال إلى ${to}` };
        } catch (e: any) {
          results.email = { ok: false, message: e?.message || "فشل enqueue" };
        }
      }
    }

    const allOk = Object.values(results).every((r) => r.ok);
    const sentChannels = Object.entries(results).filter(([, v]) => v.ok).map(([k]) => k);

    await context.supabase.from("monthly_reports").update({
      delivery_status: allOk ? "sent" : "partial",
      delivery_channels: sentChannels,
      delivered_at: allOk ? new Date().toISOString() : null,
    }).eq("id", data.reportId);

    return { results, allOk };
  });

export const saveNotificationSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { slack_webhook_url?: string; report_email?: string }) => d)
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { data: existing } = await context.supabase.from("site_settings").select("data").eq("key", "admin_notifications").maybeSingle();
    const merged = { ...((existing?.data as Record<string, unknown>) || {}), ...data };
    const { error } = await context.supabase.from("site_settings").upsert({
      key: "admin_notifications",
      label: "Admin Notifications",
      data: merged,
    }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });