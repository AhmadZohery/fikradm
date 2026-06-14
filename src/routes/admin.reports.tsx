import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarRange, FileBarChart2, Mail, MessageSquare, Send, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  component: MonthlyReportsPage,
});

function monthRange(offset = 0) {
  const d = new Date();
  d.setDate(1); d.setMonth(d.getMonth() - offset);
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  return { start, end, label: start.toLocaleDateString("ar-SA", { year: "numeric", month: "long" }) };
}

type Report = {
  id: string;
  period_start: string;
  period_end: string;
  payload: any;
  summary: string | null;
  delivery_status: string;
  delivery_channels: any;
  delivered_at: string | null;
  created_at: string;
};

function MonthlyReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("monthly_reports").select("*").order("period_start", { ascending: false }).limit(24);
    setReports((data as any) || []);
  };
  useEffect(() => { load(); }, []);

  const generate = async (offset: number) => {
    setBusy(true);
    try {
      const { start, end, label } = monthRange(offset);
      const s = start.toISOString();
      const e = end.toISOString();

      const [{ data: views }, { data: leads }, { data: metrics }] = await Promise.all([
        supabase.from("page_views").select("path,created_at").gte("created_at", s).lt("created_at", e).limit(50000),
        supabase.from("form_submissions").select("attribution_source,attribution_medium,created_at,spam_status").gte("created_at", s).lt("created_at", e).in("spam_status", ["approved", "auto_approved"]).limit(10000),
        supabase.from("seo_metrics").select("url,clicks,impressions,ctr,position,date").gte("date", s.slice(0, 10)).lt("date", e.slice(0, 10)).limit(50000),
      ]);

      // Top pages
      const pageMap = new Map<string, number>();
      (views || []).forEach((v: any) => pageMap.set(v.path, (pageMap.get(v.path) || 0) + 1));
      const top_pages = [...pageMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([path, count]) => ({ path, count }));

      // Leads by source
      const srcMap = new Map<string, number>();
      (leads || []).forEach((l: any) => {
        const key = `${l.attribution_source || "direct"} / ${l.attribution_medium || "(none)"}`;
        srcMap.set(key, (srcMap.get(key) || 0) + 1);
      });
      const leads_by_source = [...srcMap.entries()].sort((a, b) => b[1] - a[1]).map(([source, count]) => ({ source, count }));

      // CTR trends
      const urlAgg = new Map<string, { c: number; i: number }>();
      (metrics || []).forEach((m: any) => {
        const a = urlAgg.get(m.url) || { c: 0, i: 0 };
        a.c += Number(m.clicks || 0); a.i += Number(m.impressions || 0);
        urlAgg.set(m.url, a);
      });
      const ctr_top = [...urlAgg.entries()].map(([url, v]) => ({ url, clicks: v.c, impressions: v.i, ctr: v.i ? v.c / v.i : 0 })).sort((a, b) => b.clicks - a.clicks).slice(0, 10);

      const payload = {
        label,
        totals: {
          page_views: views?.length || 0,
          leads: leads?.length || 0,
          unique_pages: pageMap.size,
          gsc_urls: urlAgg.size,
        },
        top_pages,
        leads_by_source,
        ctr_top,
      };
      const summary = `${label} — ${payload.totals.page_views} مشاهدة، ${payload.totals.leads} lead، أعلى مصدر: ${leads_by_source[0]?.source || "—"}`;

      const { error } = await supabase.from("monthly_reports").upsert({
        period_start: s.slice(0, 10),
        period_end: end.toISOString().slice(0, 10),
        payload, summary, delivery_status: "draft",
      } as any, { onConflict: "period_start,period_end" });
      if (error) throw error;
      toast.success("تم توليد التقرير");
      load();
    } catch (e: any) {
      toast.error(e?.message || "فشل التوليد");
    } finally { setBusy(false); }
  };

  const queueSend = async (r: Report, channel: "email" | "slack") => {
    const channels = Array.isArray(r.delivery_channels) ? r.delivery_channels : [];
    if (!channels.includes(channel)) channels.push(channel);
    await supabase.from("monthly_reports").update({
      delivery_status: "queued",
      delivery_channels: channels,
    } as any).eq("id", r.id);
    toast.info(`تم وضع التقرير في قائمة الإرسال (${channel}). الـ adapter جاهز للربط لاحقاً.`);
    load();
  };

  const months = useMemo(() => [0, 1, 2].map((o) => monthRange(o)), []);

  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold"><FileBarChart2 className="h-6 w-6 text-primary" /> التقارير الشهرية</h1>
        <p className="text-sm text-muted-foreground">أعلى الصفحات، أفضل المصادر، اتجاهات CTR — مع adapter جاهز لـ Email/Slack</p>
      </div>

      <Card className="space-y-3 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold"><CalendarRange className="h-4 w-4" /> توليد تقرير</div>
        <div className="flex flex-wrap gap-2">
          {months.map((m, i) => (
            <Button key={i} size="sm" variant={i === 0 ? "default" : "outline"} disabled={busy} onClick={() => generate(i)}>
              {busy ? <RefreshCw className="me-1 h-3 w-3 animate-spin" /> : null}
              {m.label}
            </Button>
          ))}
        </div>
      </Card>

      <div className="space-y-3">
        {reports.length === 0 && <Card className="p-8 text-center text-sm text-muted-foreground">لا توجد تقارير بعد — ولّد أول تقرير</Card>}
        {reports.map((r) => (
          <Card key={r.id} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{r.payload?.label || r.period_start}</h3>
                  <Badge variant={r.delivery_status === "sent" ? "default" : "outline"}>{r.delivery_status}</Badge>
                  {(r.delivery_channels || []).map((c: string) => <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>)}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{r.summary}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3 text-xs">
                  <ReportColumn title="أعلى الصفحات" rows={(r.payload?.top_pages || []).slice(0, 5).map((p: any) => `${p.path} · ${p.count}`)} />
                  <ReportColumn title="Leads حسب المصدر" rows={(r.payload?.leads_by_source || []).slice(0, 5).map((p: any) => `${p.source} · ${p.count}`)} />
                  <ReportColumn title="أعلى CTR" rows={(r.payload?.ctr_top || []).slice(0, 5).map((p: any) => `${p.url} · ${(p.ctr * 100).toFixed(1)}%`)} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button size="sm" variant="outline" onClick={() => queueSend(r, "email")}><Mail className="me-1 h-4 w-4" /> Email</Button>
                <Button size="sm" variant="outline" onClick={() => queueSend(r, "slack")}><MessageSquare className="me-1 h-4 w-4" /> Slack</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="border-dashed p-4 text-xs text-muted-foreground">
        <Send className="me-1 inline h-3.5 w-3.5" />
        الـ adapter الحالي يضع التقرير في قائمة الإرسال فقط. لربط الإرسال الفعلي ضع SLACK_WEBHOOK_URL أو فعّل Lovable Emails وسنوصل التقرير تلقائياً.
      </Card>
    </div>
  );
}

function ReportColumn({ title, rows }: { title: string; rows: string[] }) {
  return (
    <div>
      <div className="mb-1 font-semibold">{title}</div>
      {rows.length === 0 ? <span className="text-muted-foreground">—</span> : (
        <ul className="space-y-0.5">
          {rows.map((r, i) => <li key={i} className="truncate text-muted-foreground">{r}</li>)}
        </ul>
      )}
    </div>
  );
}