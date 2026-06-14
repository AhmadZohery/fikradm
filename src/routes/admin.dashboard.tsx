import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Inbox, TrendingUp, MousePointerClick, Eye, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  component: ReportsDashboard,
});

type Range = "30d" | "90d";

type Submission = {
  id: string;
  created_at: string;
  form_name: string;
  payload: any;
};

const COLORS = [
  "hsl(var(--primary))",
  "hsl(220 70% 60%)",
  "hsl(160 60% 50%)",
  "hsl(40 90% 55%)",
  "hsl(340 70% 60%)",
  "hsl(280 60% 60%)",
  "hsl(var(--muted-foreground))",
];

function classifySource(s?: string, ref?: string): string {
  const src = (s || "").toLowerCase();
  if (src) {
    if (/google|bing|yahoo|duckduck/.test(src)) return "Organic";
    if (/facebook|fb|meta/.test(src)) return "Facebook";
    if (/instagram|ig/.test(src)) return "Instagram";
    if (/tiktok/.test(src)) return "TikTok";
    if (/twitter|x\.com/.test(src)) return "Twitter/X";
    if (/linkedin/.test(src)) return "LinkedIn";
    if (/email|newsletter/.test(src)) return "Email";
    if (/cpc|ads|adwords|paid/.test(src)) return "Paid";
    return src;
  }
  if (!ref) return "Direct";
  try {
    const h = new URL(ref).hostname.replace("www.", "");
    if (/google|bing|yahoo|duckduck/.test(h)) return "Organic";
    if (/facebook|instagram|tiktok|twitter|linkedin/.test(h)) return "Social";
    return h;
  } catch {
    return "Referral";
  }
}

function ReportsDashboard() {
  const [range, setRange] = useState<Range>("30d");
  const [subs, setSubs] = useState<Submission[]>([]);
  const [topPages, setTopPages] = useState<{ slug: string; views: number }[]>([]);
  const [ctrTrend, setCtrTrend] = useState<{ date: string; ctr: number; clicks: number; impressions: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const days = range === "30d" ? 30 : 90;

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      const since = new Date();
      since.setDate(since.getDate() - days);

      const [subsRes, viewsRes, seoRes] = await Promise.all([
        supabase
          .from("form_submissions")
          .select("id,created_at,form_name,payload")
          .gte("created_at", since.toISOString())
          .order("created_at", { ascending: false })
          .limit(2000),
        supabase
          .from("page_views")
          .select("page_slug")
          .gte("created_at", since.toISOString())
          .limit(20000),
        supabase
          .from("seo_metrics")
          .select("date,impressions,clicks,ctr")
          .gte("date", since.toISOString().slice(0, 10))
          .order("date", { ascending: true })
          .limit(5000),
      ]);
      if (cancel) return;

      setSubs((subsRes.data as Submission[]) || []);

      const pageMap = new Map<string, number>();
      for (const r of viewsRes.data || []) {
        pageMap.set((r as any).page_slug, (pageMap.get((r as any).page_slug) || 0) + 1);
      }
      const tp = [...pageMap.entries()]
        .map(([slug, views]) => ({ slug, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);
      setTopPages(tp);

      const daily = new Map<string, { i: number; c: number }>();
      for (const r of seoRes.data || []) {
        const k = (r as any).date;
        const cur = daily.get(k) || { i: 0, c: 0 };
        cur.i += Number((r as any).impressions || 0);
        cur.c += Number((r as any).clicks || 0);
        daily.set(k, cur);
      }
      const ct = [...daily.entries()]
        .map(([date, v]) => ({
          date,
          impressions: v.i,
          clicks: v.c,
          ctr: v.i ? Number(((v.c / v.i) * 100).toFixed(2)) : 0,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
      setCtrTrend(ct);

      setLoading(false);
    })();
    return () => {
      cancel = true;
    };
  }, [days]);

  const leadsBySource = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of subs) {
      const att = s.payload?.attribution || {};
      const src = classifySource(att.utm_source, att.referrer);
      m.set(src, (m.get(src) || 0) + 1);
    }
    return [...m.entries()].map(([name, value]) => ({ name, value }));
  }, [subs]);

  const leadsByService = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of subs) {
      const svc = s.payload?.service || s.payload?.services?.[0] || "other";
      m.set(svc, (m.get(svc) || 0) + 1);
    }
    return [...m.entries()]
      .map(([service, leads]) => ({ service, leads }))
      .sort((a, b) => b.leads - a.leads)
      .slice(0, 8);
  }, [subs]);

  const monthly = useMemo(() => {
    const now = new Date();
    const startThis = new Date(now.getFullYear(), now.getMonth(), 1);
    const startPrev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    let cur = 0, prev = 0;
    for (const s of subs) {
      const d = new Date(s.created_at);
      if (d >= startThis) cur++;
      else if (d >= startPrev) prev++;
    }
    const delta = prev ? Math.round(((cur - prev) / prev) * 100) : null;
    return { cur, prev, delta };
  }, [subs]);

  function exportCsv() {
    const headers = ["created_at", "form_name", "service", "source", "name", "email", "phone"];
    const rows = subs.map((s) => {
      const p = s.payload || {};
      const att = p.attribution || {};
      return [
        s.created_at,
        s.form_name,
        p.service || "",
        classifySource(att.utm_source, att.referrer),
        p.name || "",
        p.email || "",
        p.phone || "",
      ];
    });
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">تقارير شهرية — SEO و Leads</h1>
          <p className="text-sm text-muted-foreground">نظرة شاملة على الأداء والتحويلات حسب المصدر</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={range} onValueChange={(v) => setRange(v as Range)}>
            <TabsList>
              <TabsTrigger value="30d">30 يوم</TabsTrigger>
              <TabsTrigger value="90d">90 يوم</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <Download className="me-1 h-4 w-4" /> تصدير Leads
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Leads هذا الشهر</span><Inbox className="h-4 w-4 text-primary" /></div>
          <div className="mt-2 text-3xl font-bold">{monthly.cur}</div>
          <div className="mt-1 text-xs text-muted-foreground">الشهر السابق: {monthly.prev}{monthly.delta !== null && (<span className={`ms-2 ${monthly.delta >= 0 ? "text-success" : "text-destructive"}`}>{monthly.delta >= 0 ? "+" : ""}{monthly.delta}%</span>)}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">إجمالي Leads ({range})</span><TrendingUp className="h-4 w-4 text-primary" /></div>
          <div className="mt-2 text-3xl font-bold">{subs.length}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">مصادر فريدة</span><MousePointerClick className="h-4 w-4 text-primary" /></div>
          <div className="mt-2 text-3xl font-bold">{leadsBySource.length}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">صفحات نشطة</span><Eye className="h-4 w-4 text-primary" /></div>
          <div className="mt-2 text-3xl font-bold">{topPages.length}</div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h3 className="mb-3 font-semibold">Leads حسب المصدر</h3>
          {leadsBySource.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">لا توجد بيانات بعد</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={leadsBySource} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {leadsBySource.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
        <Card className="p-4">
          <h3 className="mb-3 font-semibold">أفضل الخدمات أداءً (Leads)</h3>
          {leadsByService.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">لا توجد بيانات بعد</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={leadsByService}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="service" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="leads" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="mb-3 font-semibold">CTR Trend (من Search Console)</h3>
        {ctrTrend.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            لا توجد بيانات SEO بعد. ارفع CSV من Google Search Console من صفحة مراقبة SEO.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={ctrTrend}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ctr" name="CTR %" stroke="hsl(var(--primary))" strokeWidth={2} />
              <Line type="monotone" dataKey="clicks" name="Clicks" stroke="hsl(160 60% 50%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card className="p-4">
        <h3 className="mb-3 font-semibold">أعلى الصفحات زيارةً</h3>
        {topPages.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">لا توجد بيانات</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-start text-xs text-muted-foreground">
                <tr><th className="p-2 text-start">الصفحة</th><th className="p-2 text-start">المشاهدات</th></tr>
              </thead>
              <tbody>
                {topPages.map((p) => (
                  <tr key={p.slug} className="border-t border-border">
                    <td className="p-2 font-mono text-xs">{p.slug}</td>
                    <td className="p-2 font-semibold">{p.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {loading && <p className="text-center text-xs text-muted-foreground">جاري التحميل…</p>}
    </div>
  );
}