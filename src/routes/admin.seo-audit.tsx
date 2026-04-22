import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, ExternalLink, CheckCircle2, AlertTriangle, XCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { loadPageAudits, type PageAudit, type AuditLevel } from "@/cms/admin/seoAudit";

export const Route = createFileRoute("/admin/seo-audit")({
  component: SeoAuditPage,
});

function SeoAuditPage() {
  const [audits, setAudits] = useState<PageAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "issues" | "ctr" | "schema">("all");

  const load = async () => {
    setLoading(true);
    try {
      const list = await loadPageAudits();
      setAudits(list);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل التحميل");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    let list = audits;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(q) || a.slug.includes(q));
    }
    if (filter === "issues") list = list.filter((a) => a.score < 80);
    if (filter === "ctr") list = list.filter((a) => a.ctrSignal !== "good");
    if (filter === "schema")
      list = list.filter((a) => a.checks.find((c) => c.id === "schema")?.level !== "good");
    return list;
  }, [audits, query, filter]);

  const stats = useMemo(() => {
    const total = audits.length;
    const avg = total ? Math.round(audits.reduce((s, a) => s + a.score, 0) / total) : 0;
    const issues = audits.filter((a) => a.score < 80).length;
    const ctrLow = audits.filter((a) => a.ctrSignal !== "good").length;
    const noSchema = audits.filter(
      (a) => a.checks.find((c) => c.id === "schema")?.level !== "good",
    ).length;
    return { total, avg, issues, ctrLow, noSchema };
  }, [audits]);

  return (
    <div className="space-y-4 max-w-7xl">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">فحص SEO الشامل</h1>
          <p className="text-sm text-muted-foreground mt-1">
            تحليل تلقائي لكل الصفحات: العناوين، Schema، CTR، الروابط الداخلية…
          </p>
        </div>
        <Button variant="outline" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ml-2 ${loading ? "animate-spin" : ""}`} /> إعادة فحص
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard label="إجمالي الصفحات" value={stats.total} />
        <StatCard label="متوسط النتيجة" value={`${stats.avg}/100`} tone={stats.avg >= 80 ? "good" : stats.avg >= 50 ? "warn" : "bad"} />
        <StatCard label="بها مشاكل" value={stats.issues} tone={stats.issues ? "warn" : "good"} />
        <StatCard label="High CTR ضعيف" value={stats.ctrLow} tone={stats.ctrLow ? "warn" : "good"} />
        <StatCard label="بدون Schema" value={stats.noSchema} tone={stats.noSchema ? "warn" : "good"} />
      </div>

      <Card className="p-3 flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث بالعنوان أو الـ slug" className="pr-9" />
        </div>
        <div className="flex items-center gap-1 border rounded-md p-0.5">
          {(["all", "issues", "ctr", "schema"] as const).map((k) => (
            <Button
              key={k}
              variant={filter === k ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setFilter(k)}
            >
              {k === "all" ? "الكل" : k === "issues" ? "بها مشاكل" : k === "ctr" ? "CTR ضعيف" : "بدون Schema"}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin inline ml-2" /> جاري الفحص...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">لا نتائج</div>
        ) : (
          <div className="divide-y">
            {filtered.map((a) => (
              <details key={a.id} className="group">
                <summary className="cursor-pointer p-4 hover:bg-muted/30 flex items-center gap-3 flex-wrap">
                  <ScorePill score={a.score} />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{a.title}</div>
                    <div className="text-xs text-muted-foreground font-mono truncate" dir="ltr">{a.url}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="text-[10px]">{a.page_type}</Badge>
                    <Badge variant={a.status === "published" ? "default" : "secondary"} className="text-[10px]">
                      {a.status}
                    </Badge>
                    <SignalBadge signal={a.ctrSignal} label="CTR" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
                      <Link to="/admin/pages/$pageId" params={{ pageId: a.id }}>تعديل</Link>
                    </Button>
                    <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                      <a href={a.url} target="_blank" rel="noreferrer"><ExternalLink className="w-3.5 h-3.5" /></a>
                    </Button>
                  </div>
                </summary>
                <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {a.checks.map((c) => (
                    <CheckRow key={c.id} level={c.level} label={c.label} hint={c.hint} />
                  ))}
                </div>
              </details>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string | number; tone?: AuditLevel }) {
  const cls =
    tone === "good"
      ? "text-emerald-600"
      : tone === "warn"
        ? "text-amber-600"
        : tone === "bad"
          ? "text-rose-600"
          : "";
  return (
    <Card className="p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${cls}`}>{value}</div>
    </Card>
  );
}

function ScorePill({ score }: { score: number }) {
  const cls =
    score >= 80
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
      : score >= 50
        ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
        : "bg-rose-500/15 text-rose-700 dark:text-rose-400";
  return <span className={`text-sm font-bold rounded-md px-2.5 py-1 min-w-[48px] text-center ${cls}`}>{score}</span>;
}

function SignalBadge({ signal, label }: { signal: AuditLevel; label: string }) {
  const cls =
    signal === "good"
      ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : signal === "warn"
        ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
        : "bg-rose-500/15 text-rose-700 border-rose-500/30";
  return <Badge variant="outline" className={`text-[10px] ${cls}`}>{label}: {signal === "good" ? "✓" : signal === "warn" ? "متوسط" : "ضعيف"}</Badge>;
}

function CheckRow({ level, label, hint }: { level: AuditLevel; label: string; hint?: string }) {
  const Icon = level === "good" ? CheckCircle2 : level === "warn" ? AlertTriangle : XCircle;
  const color = level === "good" ? "text-emerald-600" : level === "warn" ? "text-amber-600" : "text-rose-600";
  return (
    <div className="flex items-start gap-2 p-2 rounded-md border bg-background text-xs">
      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${color}`} />
      <div className="min-w-0">
        <div className="font-medium">{label}</div>
        {hint && <div className="text-[10px] text-muted-foreground mt-0.5">{hint}</div>}
      </div>
    </div>
  );
}