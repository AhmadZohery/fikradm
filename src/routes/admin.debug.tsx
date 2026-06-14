import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Trash2, RefreshCw, Activity, Clock, Link2, AlertTriangle, RotateCcw, Shield, Link as LinkIcon, Download,
} from "lucide-react";
import {
  getInvalidationEvents, clearInvalidationEvents, subscribeInvalidations, invalidationStats,
  getPublishEvents, clearPublishEvents, subscribePublishEvents,
  type CacheInvalidationEvent, type PublishGuardEvent,
} from "@/lib/cacheMetrics";
import { toPrometheusText } from "@/lib/metricsExporter";

export const Route = createFileRoute("/admin/debug")({
  head: () => ({ meta: [{ name: "robots", content: "noindex" }, { title: "Admin Debug — Cache & Publish Metrics" }] }),
  component: AdminDebugPage,
});

function StatCard({ icon: Icon, label, value, hint }: { icon: typeof Activity; label: string; value: string | number; hint?: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />{label}
      </div>
      <div className="mt-1 font-mono text-2xl">{value}</div>
      {hint && <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>}
    </Card>
  );
}

function AdminDebugPage() {
  const [events, setEvents] = useState<CacheInvalidationEvent[]>([]);
  const [pubEvents, setPubEvents] = useState<PublishGuardEvent[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterCid, setFilterCid] = useState<string | null>(null);

  useEffect(() => {
    setEvents(getInvalidationEvents());
    setPubEvents(getPublishEvents());
    const u1 = subscribeInvalidations(setEvents);
    const u2 = subscribePublishEvents(setPubEvents);
    return () => { u1(); u2(); };
  }, []);

  const filteredEvents = filterCid ? events.filter((e) => e.correlationId === filterCid) : events;
  const filteredPub = filterCid ? pubEvents.filter((e) => e.correlationId === filterCid) : pubEvents;
  const stats = invalidationStats(filteredEvents);

  const exportProm = () => {
    const text = toPrometheusText(events.map((e) => ({ type: "cache_invalidation", durationMs: e.durationMs, ok: e.ok, kind: e.kind })));
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `fikra-metrics-${Date.now()}.prom`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Admin Debug — Cache & Publish Metrics</h1>
          <p className="text-sm text-muted-foreground">
            سجل عمليات إبطال الكاش وأحداث Publish Guard (محلي، آخر 200) مربوطة بـ Correlation ID.
            {filterCid && (
              <span className="ml-2 inline-flex items-center gap-1">
                <Badge variant="outline" className="font-mono text-[10px]">{filterCid}</Badge>
                <Button variant="ghost" size="sm" className="h-6" onClick={() => setFilterCid(null)}>إزالة الفلتر</Button>
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportProm}>
            <Download className="ml-1 h-3.5 w-3.5" /> Prometheus
          </Button>
          <Button variant="outline" size="sm" onClick={() => { setEvents(getInvalidationEvents()); setPubEvents(getPublishEvents()); }}>
            <RefreshCw className="ml-1 h-3.5 w-3.5" /> تحديث
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { clearInvalidationEvents(); clearPublishEvents(); }}>
            <Trash2 className="ml-1 h-3.5 w-3.5" /> مسح الكل
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
        <StatCard icon={Activity} label="إجمالي العمليات" value={stats.total} />
        <StatCard icon={Clock} label="متوسط الزمن" value={`${stats.avgDurationMs}ms`} />
        <StatCard icon={Clock} label="P95 الزمن" value={`${stats.p95DurationMs}ms`} />
        <StatCard icon={Link2} label="URLs محدّثة" value={stats.urlsPurged} />
        <StatCard icon={RotateCcw} label="إعادات المحاولة" value={stats.retries} />
        <StatCard icon={AlertTriangle} label="أخطاء" value={stats.errors} hint={stats.errors > 0 ? "راجع السجل" : "كل العمليات نجحت"} />
      </div>

      {(Object.keys(stats.byKind).length > 0 || Object.keys(stats.byPhase).length > 0) && (
        <Card className="p-4">
          <div className="mb-2 text-sm font-semibold">حسب النوع والمرحلة</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.byKind).map(([k, v]) => (
              <Badge key={k} variant="secondary" className="gap-1">{k} <span className="font-mono">{v}</span></Badge>
            ))}
            {Object.entries(stats.byPhase).map(([k, v]) => (
              <Badge key={`p-${k}`} variant="outline" className="gap-1">phase:{k} <span className="font-mono">{v}</span></Badge>
            ))}
          </div>
        </Card>
      )}

      {filteredPub.length > 0 && (
        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 border-b p-3 text-sm font-semibold">
            <Shield className="h-4 w-4" /> أحداث Publish Guard
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الوقت</TableHead>
                <TableHead>المرحلة</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead>الأسباب</TableHead>
                <TableHead>cid</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPub.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-mono text-xs">{new Date(e.at).toLocaleTimeString()}</TableCell>
                  <TableCell>
                    <Badge variant={e.phase === "blocked" ? "destructive" : e.phase === "allowed" ? "default" : "secondary"}>{e.phase}</Badge>
                  </TableCell>
                  <TableCell><Badge variant="outline">{e.kind}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{e.slug}</TableCell>
                  <TableCell className="text-center font-mono">{e.score}</TableCell>
                  <TableCell className="text-xs">
                    {e.blockerReasons.length > 0 && (
                      <div className="text-destructive">🚫 {e.blockerReasons.slice(0, 2).join(" • ")}{e.blockerReasons.length > 2 ? ` (+${e.blockerReasons.length - 2})` : ""}</div>
                    )}
                    {e.warningReasons.length > 0 && (
                      <div className="text-amber-600">⚠ {e.warningReasons.slice(0, 2).join(" • ")}{e.warningReasons.length > 2 ? ` (+${e.warningReasons.length - 2})` : ""}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-6 gap-1 font-mono text-[10px]" onClick={() => setFilterCid(e.correlationId)}>
                      <LinkIcon className="h-3 w-3" />{e.correlationId.slice(-8)}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 border-b p-3 text-sm font-semibold">
          <Activity className="h-4 w-4" /> أحداث Cache Invalidation
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الوقت</TableHead>
              <TableHead>Phase</TableHead>
              <TableHead>النوع</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-center">URLs</TableHead>
              <TableHead className="text-center">Retries</TableHead>
              <TableHead>ISR/CDN</TableHead>
              <TableHead className="text-center">الزمن</TableHead>
              <TableHead className="text-center">الحالة</TableHead>
              <TableHead>cid</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="py-8 text-center text-sm text-muted-foreground">
                  لا توجد عمليات مطابقة. احفظ/انشر أي مقال لرؤية السجلات هنا.
                </TableCell>
              </TableRow>
            )}
            {filteredEvents.map((e) => (
              <Fragment key={e.id}>
                <TableRow className="cursor-pointer" onClick={() => setExpanded(expanded === e.id ? null : e.id)}>
                  <TableCell className="font-mono text-xs">{new Date(e.at).toLocaleTimeString()}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-[10px]">{e.phase ?? "-"}</Badge></TableCell>
                  <TableCell><Badge variant="outline">{e.kind}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{e.slug}</TableCell>
                  <TableCell className="text-center font-mono">{e.urlsPurged.length}</TableCell>
                  <TableCell className="text-center font-mono">{e.retries}</TableCell>
                  <TableCell className="font-mono text-[10px]">{e.isrHint ?? "—"}</TableCell>
                  <TableCell className="text-center font-mono">{e.durationMs}ms</TableCell>
                  <TableCell className="text-center">
                    {e.ok ? <Badge variant="default">OK</Badge> : <Badge variant="destructive">ERR</Badge>}
                  </TableCell>
                  <TableCell>
                    {e.correlationId ? (
                      <Button variant="ghost" size="sm" className="h-6 font-mono text-[10px]"
                        onClick={(ev) => { ev.stopPropagation(); setFilterCid(e.correlationId!); }}>
                        {e.correlationId.slice(-8)}
                      </Button>
                    ) : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                </TableRow>
                {expanded === e.id && (
                  <TableRow className="bg-muted/30">
                    <TableCell colSpan={10} className="space-y-2 p-3 text-xs">
                      <div>
                        <div className="mb-1 font-semibold">URLs المخدومة (per-URL purge result):</div>
                        <ul className="space-y-0.5 font-mono">
                          {(e.purgeResults ?? e.urlsPurged.map((u) => ({ url: u, ok: true, attempts: 1 } as any))).map((p) => (
                            <li key={p.url} className="flex flex-wrap items-center gap-2">
                              <span className={p.ok ? "text-emerald-600" : "text-destructive"}>{p.ok ? "✓" : "✗"}</span>
                              <span>{p.url}</span>
                              {p.status !== undefined && <span className="text-muted-foreground">[{p.status}]</span>}
                              {p.cacheHint && <Badge variant="outline" className="text-[9px]">{p.cacheHint}</Badge>}
                              {p.attempts > 1 && <Badge variant="secondary" className="text-[9px]">{p.attempts}x</Badge>}
                              {p.error && <span className="text-destructive">— {p.error}</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="mb-1 font-semibold">Query keys المحدّثة:</div>
                        <div className="flex flex-wrap gap-1">
                          {e.queryKeysInvalidated.map((k) => <Badge key={k} variant="outline" className="font-mono text-[10px]">{k}</Badge>)}
                        </div>
                      </div>
                      {e.error && <div className="text-destructive">خطأ: {e.error}</div>}
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="p-4 text-xs text-muted-foreground">
        <div className="mb-1 font-semibold text-foreground">تنبيهات مقترحة (Prometheus / Grafana / Sentry)</div>
        <ul className="list-inside list-disc space-y-1 font-mono">
          <li>{`rate(fikra_cache_invalidation_total{status="error"}[5m]) > 0.1`}</li>
          <li>{`histogram_quantile(0.95, fikra_cache_invalidation_duration_ms) > 1500`}</li>
          <li>{`rate(fikra_publish_guard_total{phase="blocked"}[15m]) > 0.5`}</li>
        </ul>
        <div className="mt-2">
          Sentry: استدعاءات <code>captureMessage</code> تلقائية عند فشل invalidation أو تجاوز
          <code> VITE_METRICS_SLOW_MS</code> (افتراضي 1500ms). نقطة Prometheus على
          <code> https://fikradm.com/api/public/metrics/ingest</code> (GET برأس <code>X-Metrics-Token</code>).
        </div>
      </Card>
    </div>
  );
}