import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  Inbox,
  Eye,
  Users as UsersIcon,
  TrendingUp,
  Bug,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { requestPreviewHardReload } from "@/lib/previewRuntime";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

type Stats = {
  pages: number;
  media: number;
  submissions: number;
  views: number;
  sessions: number;
  viewsPrev: number;
};

type ViewRow = {
  created_at: string;
  page_slug: string;
  device: string | null;
  country: string | null;
  session_id: string | null;
  locale: string | null;
};

type Range = "7d" | "30d" | "90d";

const DEVICE_COLORS: Record<string, string> = {
  desktop: "hsl(var(--primary))",
  mobile: "hsl(220 70% 60%)",
  tablet: "hsl(280 60% 60%)",
  unknown: "hsl(var(--muted-foreground))",
};

function formatDay(d: Date) {
  return d.toISOString().slice(0, 10);
}

function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    pages: 0,
    media: 0,
    submissions: 0,
    views: 0,
    sessions: 0,
    viewsPrev: 0,
  });
  const [views, setViews] = useState<ViewRow[]>([]);
  const [range, setRange] = useState<Range>("30d");
  const [loading, setLoading] = useState(true);

  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const since = new Date();
      since.setDate(since.getDate() - days);
      const sincePrev = new Date();
      sincePrev.setDate(sincePrev.getDate() - days * 2);

      const [pagesRes, mediaRes, submissionsRes, viewsCountRes, viewsPrevRes, viewsRowsRes] =
        await Promise.all([
          supabase.from("pages").select("*", { count: "exact", head: true }),
          supabase.from("media_library").select("*", { count: "exact", head: true }),
          supabase.from("form_submissions").select("*", { count: "exact", head: true }),
          supabase
            .from("page_views")
            .select("*", { count: "exact", head: true })
            .gte("created_at", since.toISOString()),
          supabase
            .from("page_views")
            .select("*", { count: "exact", head: true })
            .gte("created_at", sincePrev.toISOString())
            .lt("created_at", since.toISOString()),
          supabase
            .from("page_views")
            .select("created_at,page_slug,device,country,session_id,locale")
            .gte("created_at", since.toISOString())
            .order("created_at", { ascending: true })
            .limit(10000),
        ]);

      if (cancelled) return;

      const rows = (viewsRowsRes.data ?? []) as ViewRow[];
      const sessions = new Set(rows.map((r) => r.session_id).filter(Boolean)).size;

      setStats({
        pages: pagesRes.count ?? 0,
        media: mediaRes.count ?? 0,
        submissions: submissionsRes.count ?? 0,
        views: viewsCountRes.count ?? 0,
        sessions,
        viewsPrev: viewsPrevRes.count ?? 0,
      });
      setViews(rows);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [days]);

  // Time series
  const series = useMemo(() => {
    const map = new Map<string, { day: string; views: number; sessions: Set<string> }>();
    const start = new Date();
    start.setDate(start.getDate() - days + 1);
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = formatDay(d);
      map.set(key, { day: key, views: 0, sessions: new Set() });
    }
    for (const r of views) {
      const key = r.created_at.slice(0, 10);
      const bucket = map.get(key);
      if (!bucket) continue;
      bucket.views++;
      if (r.session_id) bucket.sessions.add(r.session_id);
    }
    return [...map.values()].map((b) => ({
      day: b.day.slice(5),
      views: b.views,
      sessions: b.sessions.size,
    }));
  }, [views, days]);

  // Top pages
  const topPages = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of views) counts.set(r.page_slug, (counts.get(r.page_slug) ?? 0) + 1);
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([slug, count]) => ({ slug, count }));
  }, [views]);

  // Devices
  const deviceData = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of views) {
      const k = r.device || "unknown";
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    return [...counts.entries()].map(([name, value]) => ({ name, value }));
  }, [views]);

  // Countries
  const countryData = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of views) {
      const k = r.country || "—";
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([country, count]) => ({ country, count }));
  }, [views]);

  const trend =
    stats.viewsPrev === 0
      ? stats.views > 0
        ? 100
        : 0
      : Math.round(((stats.views - stats.viewsPrev) / stats.viewsPrev) * 100);

  const cards = [
    {
      label: "المشاهدات",
      value: stats.views,
      icon: Eye,
      color: "text-emerald-500",
      hint: `${trend >= 0 ? "+" : ""}${trend}% عن الفترة السابقة`,
    },
    { label: "الزوار (sessions)", value: stats.sessions, icon: UsersIcon, color: "text-blue-500" },
    { label: "الصفحات", value: stats.pages, icon: FileText, color: "text-violet-500" },
    { label: "الوسائط", value: stats.media, icon: ImageIcon, color: "text-purple-500" },
    { label: "الرسائل", value: stats.submissions, icon: Inbox, color: "text-amber-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <p className="text-sm text-muted-foreground mt-1">
            تحليلات الزيارات والمحتوى — تم استثناء البوتات والـ DNT.
          </p>
        </div>
        <Tabs value={range} onValueChange={(v) => setRange(v as Range)}>
          <TabsList>
            <TabsTrigger value="7d">٧ أيام</TabsTrigger>
            <TabsTrigger value="30d">٣٠ يوم</TabsTrigger>
            <TabsTrigger value="90d">٩٠ يوم</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-5">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">{c.label}</div>
                <div className="text-2xl font-bold mt-2">
                  {loading ? "—" : c.value.toLocaleString("ar-EG")}
                </div>
                {c.hint && (
                  <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {c.hint}
                  </div>
                )}
              </div>
              <c.icon className={`w-5 h-5 ${c.color}`} />
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 font-semibold">
              <Bug className="h-4 w-4 text-primary" />
              أدوات QA السريعة
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              افتح الهوم بوضع بصري يبرز الحدود والـ clipping، أو نفّذ hard reload للمعاينة لتجاوز أخطاء الكاش القديمة.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => window.open("/?qa=visual", "_blank", "noopener,noreferrer")}>
              <ExternalLink className="ms-2 h-4 w-4" />
              Visual QA للهوم
            </Button>
            <Button type="button" onClick={() => requestPreviewHardReload()}>
              <RotateCcw className="ms-2 h-4 w-4" />
              Hard Reload للمعاينة
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">المشاهدات والزوار يومياً</h2>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(220 70% 60%)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="hsl(220 70% 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="views"
                name="مشاهدات"
                stroke="hsl(var(--primary))"
                fill="url(#gv)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="sessions"
                name="زوار"
                stroke="hsl(220 70% 60%)"
                fill="url(#gs)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <h2 className="font-semibold mb-4">الأجهزة</h2>
          <div className="h-64">
            {deviceData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                لا توجد بيانات
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={2}
                  >
                    {deviceData.map((entry, idx) => (
                      <Cell
                        key={idx}
                        fill={DEVICE_COLORS[entry.name] || "hsl(var(--muted-foreground))"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h2 className="font-semibold mb-4">الدول</h2>
          <div className="h-64">
            {countryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                لا توجد بيانات
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="country"
                    tick={{ fontSize: 11 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    stroke="hsl(var(--muted-foreground))"
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" name="مشاهدات" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="font-semibold mb-4">أكثر الصفحات زيارة</h2>
        {topPages.length === 0 ? (
          <div className="text-sm text-muted-foreground py-6 text-center">لا توجد بيانات بعد</div>
        ) : (
          <div className="space-y-2">
            {topPages.map((p) => {
              const max = topPages[0].count;
              const pct = Math.round((p.count / max) * 100);
              return (
                <div key={p.slug} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-mono text-xs truncate">/{p.slug}</span>
                    <span className="text-muted-foreground">{p.count.toLocaleString("ar-EG")}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
