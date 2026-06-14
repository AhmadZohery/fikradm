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

  // ---- Before/After comparison ----
  const [cmpA, setCmpA] = useState<string>("");
  const [cmpB, setCmpB] = useState<string>("");
  const [affected, setAffected] = useState<{ url: string; before: number; after: number; delta: number; n: number }[]>([]);

  useEffect(() => {
    if (snaps.length >= 2 && !cmpA && !cmpB) {
      setCmpB(snaps[0].id);
      setCmpA(snaps[1].id);
    }
  }, [snaps, cmpA, cmpB]);

  // Auto-snapshot if last snapshot is older than 24h and enough data exists
  useEffect(() => {
    if (loading || vitals.length < 20) return;
    const latest = snaps[0];
    const tooOld = !latest || (Date.now() - new Date(latest.created_at).getTime()) > 24 * 60 * 60 * 1000;
    if (!tooOld) return;
    const metrics = Object.fromEntries(METRICS.map((m) => [m, summary[m]]));
    void supabase
      .from("performance_snapshots")
      .insert({ label: `auto-baseline ${new Date().toISOString().slice(0, 16).replace("T", " ")}`, notes: "تم إنشاؤها تلقائياً", metrics })
      .then(({ error }) => { if (!error) load(); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const computeAffected = async () => {
    const a = snaps.find((s) => s.id === cmpA);
    const b = snaps.find((s) => s.id === cmpB);
    if (!a || !b) return toast.error("اختر لقطتين للمقارنة");
    const t1 = new Date(Math.min(new Date(a.created_at).getTime(), new Date(b.created_at).getTime()));
    const t2 = new Date(Math.max(new Date(a.created_at).getTime(), new Date(b.created_at).getTime()));
    const windowMs = Math.max(2 * 60 * 60 * 1000, t2.getTime() - t1.getTime());
    const beforeStart = new Date(t1.getTime() - windowMs).toISOString();
    const [beforeRes, afterRes] = await Promise.all([
      supabase.from("web_vitals").select("url,value").eq("metric", "LCP").gte("created_at", beforeStart).lte("created_at", t1.toISOString()).limit(10000),
      supabase.from("web_vitals").select("url,value").eq("metric", "LCP").gte("created_at", t2.toISOString()).limit(10000),
    ]);
    const groupP75 = (rows: { url: string; value: number }[]) => {
      const m = new Map<string, number[]>();
      for (const r of rows) { const arr = m.get(r.url) || []; arr.push(Number(r.value)); m.set(r.url, arr); }
      return new Map([...m.entries()].map(([u, arr]) => [u, { p75: percentile(arr, 75), n: arr.length }]));
    };
    const beforeMap = groupP75((beforeRes.data || []) as { url: string; value: number }[]);
    const afterMap = groupP75((afterRes.data || []) as { url: string; value: number }[]);
    const urls = new Set([...beforeMap.keys(), ...afterMap.keys()]);
    const rows: { url: string; before: number; after: number; delta: number; n: number }[] = [];
    for (const u of urls) {
      const bef = beforeMap.get(u); const aft = afterMap.get(u);
      if (!bef || !aft || bef.n < 2 || aft.n < 2) continue;
      const delta = bef.p75 ? ((aft.p75 - bef.p75) / bef.p75) * 100 : 0;
      rows.push({ url: u, before: bef.p75, after: aft.p75, delta, n: bef.n + aft.n });
    }
    rows.sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta));
    setAffected(rows.slice(0, 12));
    if (!rows.length) toast.message("لا توجد صفحات بعينات كافية في الفترتين");
  };

  const cmpDiff = useMemo(() => {
    const a = snaps.find((s) => s.id === cmpA);
    const b = snaps.find((s) => s.id === cmpB);
    if (!a || !b) return null;
    return METRICS.map((m) => {
      const va = Number(a.metrics?.[m]?.p75 ?? 0);
      const vb = Number(b.metrics?.[m]?.p75 ?? 0);
      const delta = va ? ((vb - va) / va) * 100 : 0;
      return { metric: m, before: va, after: vb, delta };
    });
  }, [cmpA, cmpB, snaps]);

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

      <Card className="p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold inline-flex items-center gap-2"><GitCompareArrows className="h-4 w-4" /> مقارنة قبل/بعد</h3>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={cmpA} onValueChange={setCmpA}>
              <SelectTrigger className="h-8 w-56"><SelectValue placeholder="اللقطة الأقدم (Before)" /></SelectTrigger>
              <SelectContent>{snaps.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={cmpB} onValueChange={setCmpB}>
              <SelectTrigger className="h-8 w-56"><SelectValue placeholder="اللقطة الأحدث (After)" /></SelectTrigger>
              <SelectContent>{snaps.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}</SelectContent>
            </Select>
            <Button size="sm" variant="outline" onClick={computeAffected}>احسب الصفحات المتأثرة</Button>
          </div>
        </div>
        {!cmpDiff ? (
          <p className="py-6 text-center text-sm text-muted-foreground">احفظ لقطتين على الأقل ثم اختر اللقطة القديمة والجديدة للمقارنة. (لقطة auto-baseline تنشأ تلقائياً كل 24 ساعة)</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground"><tr><th className="p-2 text-start">المؤشر</th><th className="p-2 text-start">قبل</th><th className="p-2 text-start">بعد</th><th className="p-2 text-start">الفرق</th></tr></thead>
                <tbody>
                  {cmpDiff.map((r) => {
                    const fmt = (v: number) => r.metric === "CLS" ? v.toFixed(3) : `${Math.round(v)} ${UNIT[r.metric]}`;
                    const positive = r.delta < 0;
                    return (
                      <tr key={r.metric} className="border-t border-border">
                        <td className="p-2 font-semibold">{r.metric}</td>
                        <td className="p-2">{fmt(r.before)}</td>
                        <td className="p-2">{fmt(r.after)}</td>
                        <td className={`p-2 font-semibold ${positive ? "text-emerald-600" : r.delta > 0 ? "text-red-600" : "text-muted-foreground"}`}>
                          {positive ? <TrendingDown className="me-1 inline h-3 w-3" /> : r.delta > 0 ? <TrendingUp className="me-1 inline h-3 w-3" /> : null}
                          {r.delta > 0 ? "+" : ""}{r.delta.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold text-muted-foreground">أهم الصفحات المتأثرة (LCP p75)</h4>
              {affected.length === 0 ? (
                <p className="rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">اضغط "احسب الصفحات المتأثرة" لعرض أعلى التغيرات.</p>
              ) : (
                <div className="space-y-1 max-h-72 overflow-y-auto">
                  {affected.map((r) => (
                    <a key={r.url} href={r.url} target="_blank" rel="noreferrer" className="block rounded-md border border-border p-2 hover:bg-muted/50">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-mono text-[11px]">{r.url}</span>
                        <span className={`text-xs font-semibold ${r.delta < 0 ? "text-emerald-600" : "text-red-600"}`}>{r.delta > 0 ? "+" : ""}{r.delta.toFixed(0)}%</span>
                      </div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">{Math.round(r.before)} → {Math.round(r.after)} ms · {r.n} عينة</div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      {loading && <p className="text-center text-xs text-muted-foreground">جاري التحميل…</p>}
    </div>
  );
}