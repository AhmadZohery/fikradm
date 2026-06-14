import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, TrendingDown, FileClock, MousePointerClick, Upload, RefreshCw, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/seo-decay")({
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  component: SeoDecayPage,
});

type Alert = {
  id: string;
  url: string;
  alert_type: "rank_drop" | "stale_content" | "high_impressions_low_ctr" | "traffic_drop";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  details: any;
  status: "open" | "new" | "in_progress" | "acknowledged" | "resolved" | "dismissed";
  created_at: string;
  owner_note?: string | null;
  task_url?: string | null;
};

type Note = { id: string; alert_id: string; body: string; kind: "note" | "task" | "status_change"; is_done: boolean; created_at: string };

const STATUS_LABEL: Record<string, string> = {
  open: "جديد",
  new: "جديد",
  in_progress: "قيد المعالجة",
  acknowledged: "تمت المعاينة",
  resolved: "تم الحل",
  dismissed: "تجاهل",
};

const TYPE_META = {
  rank_drop: { label: "هبوط الترتيب", icon: TrendingDown, color: "text-destructive" },
  stale_content: { label: "محتوى قديم", icon: FileClock, color: "text-warning" },
  high_impressions_low_ctr: { label: "Impressions عالية / CTR منخفض", icon: MousePointerClick, color: "text-primary" },
  traffic_drop: { label: "هبوط الزيارات", icon: TrendingDown, color: "text-destructive" },
} as const;

const SEV_COLOR: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-warning/15 text-warning",
  high: "bg-destructive/15 text-destructive",
  critical: "bg-destructive text-destructive-foreground",
};

function SeoDecayPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("seo_alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    setAlerts((data as Alert[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const grouped = useMemo(() => {
    const open = alerts.filter((a) => a.status === "open");
    return {
      rank_drop: open.filter((a) => a.alert_type === "rank_drop"),
      stale_content: open.filter((a) => a.alert_type === "stale_content"),
      high_impressions_low_ctr: open.filter((a) => a.alert_type === "high_impressions_low_ctr"),
      all_resolved: alerts.filter((a) => a.status === "resolved").length,
    };
  }, [alerts]);

  const resolve = async (id: string) => {
    const { error } = await supabase
      .from("seo_alerts")
      .update({ status: "resolved", resolved_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return toast.error("فشل التحديث");
    toast.success("تم التحديد كمحلول");
    load();
  };

  const setStatus = async (id: string, status: Alert["status"]) => {
    const patch: any = { status };
    if (status === "in_progress") patch.started_at = new Date().toISOString();
    if (status === "resolved") patch.resolved_at = new Date().toISOString();
    const { error } = await supabase.from("seo_alerts").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    await supabase.from("seo_alert_notes").insert({ alert_id: id, body: `الحالة → ${STATUS_LABEL[status]}`, kind: "status_change" } as any);
    load();
  };

  const runScan = async () => {
    setScanning(true);
    try {
      // Compare last 7 days vs prior 28 days from seo_metrics
      const today = new Date();
      const d7 = new Date(today); d7.setDate(d7.getDate() - 7);
      const d35 = new Date(today); d35.setDate(d35.getDate() - 35);

      const { data: metrics } = await supabase
        .from("seo_metrics")
        .select("url,date,impressions,clicks,ctr,position")
        .gte("date", d35.toISOString().slice(0, 10))
        .limit(20000);

      const byUrl = new Map<string, { recent: any[]; prior: any[] }>();
      for (const m of metrics || []) {
        const u = (m as any).url;
        const d = new Date((m as any).date);
        const bucket = byUrl.get(u) || { recent: [], prior: [] };
        if (d >= d7) bucket.recent.push(m);
        else bucket.prior.push(m);
        byUrl.set(u, bucket);
      }

      const newAlerts: Omit<Alert, "id" | "created_at" | "status">[] = [];
      const avg = (arr: any[], k: string) => arr.length ? arr.reduce((s, x) => s + Number(x[k] || 0), 0) / arr.length : 0;
      const sum = (arr: any[], k: string) => arr.reduce((s, x) => s + Number(x[k] || 0), 0);

      for (const [url, { recent, prior }] of byUrl) {
        if (!recent.length) continue;
        const posR = avg(recent, "position");
        const posP = avg(prior, "position");
        if (posP > 0 && posR - posP >= 3) {
          newAlerts.push({
            url, alert_type: "rank_drop",
            severity: posR - posP >= 8 ? "high" : "medium",
            title: `هبط الترتيب من ${posP.toFixed(1)} إلى ${posR.toFixed(1)}`,
            details: { position_prior: posP, position_recent: posR, delta: posR - posP },
          });
        }
        const imp = sum(recent, "impressions");
        const clk = sum(recent, "clicks");
        const ctr = imp ? clk / imp : 0;
        if (imp >= 100 && ctr < 0.01) {
          newAlerts.push({
            url, alert_type: "high_impressions_low_ctr",
            severity: imp >= 1000 ? "high" : "medium",
            title: `${imp} impressions و CTR ${(ctr * 100).toFixed(2)}%`,
            details: { impressions: imp, clicks: clk, ctr },
          });
        }
      }

      // Stale content: blog posts older than 180 days
      const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 180);
      const { data: oldPosts } = await supabase
        .from("blog_posts")
        .select("slug,title,updated_at")
        .lt("updated_at", cutoff.toISOString())
        .eq("status", "published")
        .limit(200);
      for (const p of oldPosts || []) {
        newAlerts.push({
          url: `/blog/${(p as any).slug}`,
          alert_type: "stale_content",
          severity: "low",
          title: `لم يُحدّث منذ ${Math.floor((Date.now() - new Date((p as any).updated_at).getTime()) / 86400000)} يوم`,
          details: { title: (p as any).title, updated_at: (p as any).updated_at },
        });
      }

      // Avoid duplicates: skip URLs that already have open alert of same type
      const existingKeys = new Set(alerts.filter((a) => a.status === "open").map((a) => `${a.url}::${a.alert_type}`));
      const toInsert = newAlerts.filter((a) => !existingKeys.has(`${a.url}::${a.alert_type}`));
      if (toInsert.length) {
        const { error } = await supabase.from("seo_alerts").insert(toInsert as any);
        if (error) throw error;
      }
      toast.success(`تم الفحص: ${toInsert.length} تنبيه جديد`);
      load();
    } catch (e: any) {
      toast.error(e?.message || "فشل الفحص");
    } finally {
      setScanning(false);
    }
  };

  const importCsv = async (file: File) => {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return toast.error("ملف فارغ");
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/^"|"$/g, ""));
    const idx = {
      url: headers.findIndex((h) => h.includes("page") || h.includes("url") || h.includes("landing")),
      impressions: headers.findIndex((h) => h.includes("impression")),
      clicks: headers.findIndex((h) => h.includes("click")),
      ctr: headers.findIndex((h) => h.includes("ctr")),
      position: headers.findIndex((h) => h.includes("position")),
    };
    if (idx.url < 0) return toast.error("لم يتم العثور على عمود URL");
    const today = new Date().toISOString().slice(0, 10);
    const rows: any[] = [];
    for (let i = 1; i < lines.length && i < 5000; i++) {
      const parts = lines[i].split(",").map((c) => c.replace(/^"|"$/g, ""));
      const url = parts[idx.url];
      if (!url) continue;
      const ctrRaw = idx.ctr >= 0 ? parts[idx.ctr] : "0";
      const ctr = Number(ctrRaw.replace("%", "")) / (ctrRaw.includes("%") ? 100 : 1);
      rows.push({
        url: url.slice(0, 500),
        date: today,
        impressions: Number(parts[idx.impressions] || 0) || 0,
        clicks: Number(parts[idx.clicks] || 0) || 0,
        ctr: isFinite(ctr) ? Number(ctr.toFixed(4)) : 0,
        position: Number(parts[idx.position] || 0) || 0,
        source: "gsc_csv",
      });
    }
    const { error } = await supabase.from("seo_metrics").upsert(rows, { onConflict: "url,date,query" });
    if (error) return toast.error(error.message);
    toast.success(`تم استيراد ${rows.length} صف`);
  };

  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">مراقبة SEO Decay</h1>
          <p className="text-sm text-muted-foreground">تنبيهات لما يفقد ترتيبه، يحتاج تحديث، أو impressions عالية بدون نقرات</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:border-primary">
            <Upload className="h-4 w-4" />
            استيراد GSC CSV
            <input type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files?.[0] && importCsv(e.target.files[0])} />
          </label>
          <Button size="sm" onClick={runScan} disabled={scanning}>
            <RefreshCw className={`me-1 h-4 w-4 ${scanning ? "animate-spin" : ""}`} /> فحص الآن
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4"><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">هبوط الترتيب</span><TrendingDown className="h-4 w-4 text-destructive" /></div><div className="mt-2 text-3xl font-bold">{grouped.rank_drop.length}</div></Card>
        <Card className="p-4"><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">محتوى قديم</span><FileClock className="h-4 w-4 text-warning" /></div><div className="mt-2 text-3xl font-bold">{grouped.stale_content.length}</div></Card>
        <Card className="p-4"><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">CTR منخفض</span><MousePointerClick className="h-4 w-4 text-primary" /></div><div className="mt-2 text-3xl font-bold">{grouped.high_impressions_low_ctr.length}</div></Card>
      </div>

      <Tabs defaultValue="rank_drop">
        <TabsList>
          <TabsTrigger value="rank_drop">هبوط الترتيب</TabsTrigger>
          <TabsTrigger value="stale_content">محتوى قديم</TabsTrigger>
          <TabsTrigger value="high_impressions_low_ctr">CTR منخفض</TabsTrigger>
        </TabsList>
        {(["rank_drop", "stale_content", "high_impressions_low_ctr"] as const).map((t) => {
          const Meta = TYPE_META[t];
          const list = (grouped as any)[t] as Alert[];
          return (
            <TabsContent key={t} value={t} className="space-y-3">
              {list.length === 0 ? (
                <Card className="p-8 text-center text-sm text-muted-foreground">
                  <Check className="mx-auto mb-2 h-6 w-6 text-success" /> لا توجد تنبيهات نشطة
                </Card>
              ) : (
                list.map((a) => {
                  const Icon = Meta.icon;
                  return (
                    <Card key={a.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${Meta.color}`} />
                            <Badge className={SEV_COLOR[a.severity]}>{a.severity}</Badge>
                            <a href={a.url} target="_blank" rel="noreferrer" className="font-mono text-xs text-primary hover:underline">{a.url}</a>
                          </div>
                          <h4 className="mt-2 font-semibold">{a.title}</h4>
                          <p className="mt-1 text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString("ar-SA")}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => resolve(a.id)}>
                          <Check className="me-1 h-4 w-4" /> تم الحل
                        </Button>
                      </div>
                    </Card>
                  );
                })
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      {loading && <p className="text-center text-xs text-muted-foreground">جاري التحميل…</p>}
    </div>
  );
}