import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Gauge, Camera, RefreshCw, GitCompareArrows, TrendingDown, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/admin/performance")({
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  component: PerformancePage,
});

type Vital = { id: number; url: string; metric: string; value: number; rating: string | null; device: string | null; created_at: string };
type Snapshot = { id: string; label: string; notes: string | null; metrics: any; created_at: string };
type Range = "7d" | "30d";

const METRICS = ["LCP", "CLS", "INP", "FCP", "TTFB"] as const;
const UNIT: Record<string, string> = { LCP: "ms", FCP: "ms", TTFB: "ms", INP: "ms", CLS: "" };

function percentile(arr: number[], p: number) {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const i = Math.min(s.length - 1, Math.floor((p / 100) * s.length));
  return s[i];
}

function PerformancePage() {
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [snaps, setSnaps] = useState<Snapshot[]>([]);
  const [range, setRange] = useState<Range>("7d");
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [notes, setNotes] = useState("");
  const days = range === "7d" ? 7 : 30;

  const load = async () => {
    setLoading(true);
    const since = new Date(); since.setDate(since.getDate() - days);
    const [vRes, sRes] = await Promise.all([
      supabase.from("web_vitals").select("*").gte("created_at", since.toISOString()).order("created_at", { ascending: true }).limit(20000),
      supabase.from("performance_snapshots").select("*").order("created_at", { ascending: false }).limit(50),
    ]);
    setVitals((vRes.data as Vital[]) || []);
    setSnaps((sRes.data as Snapshot[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [days]);

  const summary = useMemo(() => {
    const out: Record<string, { p75: number; avg: number; count: number }> = {};
    for (const m of METRICS) {
      const arr = vitals.filter((v) => v.metric === m).map((v) => Number(v.value));
      const avg = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
      out[m] = { p75: percentile(arr, 75), avg, count: arr.length };
    }
    return out;
  }, [vitals]);

  const trend = useMemo(() => {
    const byDay = new Map<string, Record<string, number[]>>();
    for (const v of vitals) {
      const day = v.created_at.slice(0, 10);
      const d = byDay.get(day) || {};
      d[v.metric] = d[v.metric] || [];
      d[v.metric].push(Number(v.value));
      byDay.set(day, d);
    }
    return [...byDay.entries()].sort().map(([date, m]) => {
      const row: any = { date };
      for (const k of METRICS) row[k] = m[k] ? Number((m[k].reduce((a, b) => a + b, 0) / m[k].length).toFixed(2)) : 0;
      return row;
    });
  }, [vitals]);

  const slowestPages = useMemo(() => {
    const lcp = vitals.filter((v) => v.metric === "LCP");
    const map = new Map<string, number[]>();
    for (const v of lcp) {
      const arr = map.get(v.url) || [];
      arr.push(Number(v.value));
      map.set(v.url, arr);
    }
    return [...map.entries()]
      .map(([url, arr]) => ({ url, p75: percentile(arr, 75), n: arr.length }))
      .filter((x) => x.n >= 3)
      .sort((a, b) => b.p75 - a.p75)
      .slice(0, 10);
  }, [vitals]);

  const takeSnapshot = async () => {
    if (!label.trim()) return toast.error("اكتب اسم اللقطة");
    const metrics = Object.fromEntries(METRICS.map((m) => [m, summary[m]]));
    const { error } = await supabase.from("performance_snapshots").insert({ label: label.trim(), notes: notes || null, metrics });
    if (error) return toast.error(error.message);
    toast.success("تم حفظ اللقطة");
    setLabel(""); setNotes("");
    load();
  };

  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Core Web Vitals — مراقبة الأداء</h1>
          <p className="text-sm text-muted-foreground">قياسات حقيقية من المتصفحات للزوار</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={range} onValueChange={(v) => setRange(v as Range)}>
            <TabsList>
              <TabsTrigger value="7d">7 أيام</TabsTrigger>
              <TabsTrigger value="30d">30 يوم</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button size="sm" variant="outline" onClick={load}><RefreshCw className="me-1 h-4 w-4" /> تحديث</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {METRICS.map((m) => {
          const s = summary[m];
          return (
            <Card key={m} className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{m}</span>
                <Gauge className="h-4 w-4 text-primary" />
              </div>
              <div className="mt-2 text-2xl font-bold">
                {m === "CLS" ? s.p75.toFixed(3) : Math.round(s.p75)}<span className="ms-1 text-xs text-muted-foreground">{UNIT[m]}</span>
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">p75 — {s.count} عينة</div>
            </Card>
          );
        })}
      </div>

      <Card className="p-4">
        <h3 className="mb-3 font-semibold">اتجاه المؤشرات</h3>
        {trend.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">لا توجد بيانات بعد — تصفّح الموقع لتجميع قياسات.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="LCP" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="INP" stroke="hsl(160 60% 50%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="FCP" stroke="hsl(40 90% 55%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="TTFB" stroke="hsl(280 60% 60%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h3 className="mb-3 font-semibold">أبطأ الصفحات (LCP p75)</h3>
          {slowestPages.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">لا توجد عينات كافية</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground"><tr><th className="p-2 text-start">الصفحة</th><th className="p-2 text-start">LCP p75</th><th className="p-2 text-start">عينات</th></tr></thead>
                <tbody>
                  {slowestPages.map((p) => (
                    <tr key={p.url} className="border-t border-border">
                      <td className="p-2 font-mono text-xs">{p.url}</td>
                      <td className="p-2 font-semibold">{Math.round(p.p75)} ms</td>
                      <td className="p-2">{p.n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">لقطات الأداء (Baselines)</h3>
          </div>
          <div className="space-y-2">
            <Input placeholder="اسم اللقطة (مثل: قبل تحسين الصور)" value={label} onChange={(e) => setLabel(e.target.value)} />
            <Input placeholder="ملاحظات (اختياري)" value={notes} onChange={(e) => setNotes(e.target.value)} />
            <Button size="sm" onClick={takeSnapshot}><Camera className="me-1 h-4 w-4" /> احفظ لقطة الآن</Button>
          </div>
          <div className="mt-4 max-h-72 space-y-2 overflow-y-auto">
            {snaps.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">لا توجد لقطات بعد</p>
            ) : snaps.map((s) => (
              <div key={s.id} className="rounded-md border border-border p-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{s.label}</span>
                  <Badge variant="outline">{new Date(s.created_at).toLocaleDateString("ar-SA")}</Badge>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                  {METRICS.map((m) => {
                    const v = s.metrics?.[m]?.p75;
                    if (v == null) return null;
                    return <span key={m}>{m}: <b>{m === "CLS" ? Number(v).toFixed(3) : Math.round(Number(v))}{UNIT[m]}</b></span>;
                  })}
                </div>
                {s.notes && <p className="mt-1 text-xs text-muted-foreground">{s.notes}</p>}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {loading && <p className="text-center text-xs text-muted-foreground">جاري التحميل…</p>}
    </div>
  );
}