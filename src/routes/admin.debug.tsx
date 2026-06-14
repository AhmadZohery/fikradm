import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, RefreshCw, Activity, Clock, Link2, AlertTriangle } from "lucide-react";
import {
  getInvalidationEvents,
  clearInvalidationEvents,
  subscribeInvalidations,
  invalidationStats,
  type CacheInvalidationEvent,
} from "@/lib/cacheMetrics";

export const Route = createFileRoute("/admin/debug")({
  head: () => ({ meta: [{ name: "robots", content: "noindex" }, { title: "Admin Debug — Cache Metrics" }] }),
  component: AdminDebugPage,
});

function StatCard({ icon: Icon, label, value, hint }: { icon: typeof Activity; label: string; value: string | number; hint?: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-1 font-mono text-2xl">{value}</div>
      {hint && <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>}
    </Card>
  );
}

function AdminDebugPage() {
  const [events, setEvents] = useState<CacheInvalidationEvent[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setEvents(getInvalidationEvents());
    return subscribeInvalidations(setEvents);
  }, []);

  const stats = invalidationStats(events);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Admin Debug — Cache Invalidations</h1>
          <p className="text-sm text-muted-foreground">سجل أحدث عمليات إبطال الكاش (محلي، آخر 100 حدث).</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEvents(getInvalidationEvents())}>
            <RefreshCw className="ml-1 h-3.5 w-3.5" /> تحديث
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { clearInvalidationEvents(); }}>
            <Trash2 className="ml-1 h-3.5 w-3.5" /> مسح السجل
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatCard icon={Activity} label="إجمالي العمليات" value={stats.total} />
        <StatCard icon={Clock} label="متوسط الزمن" value={`${stats.avgDurationMs}ms`} />
        <StatCard icon={Clock} label="P95 الزمن" value={`${stats.p95DurationMs}ms`} />
        <StatCard icon={Link2} label="إجمالي URLs محدّثة" value={stats.urlsPurged} />
        <StatCard icon={AlertTriangle} label="أخطاء" value={stats.errors} hint={stats.errors > 0 ? "راجع السجل" : "كل العمليات نجحت"} />
      </div>

      {Object.keys(stats.byKind).length > 0 && (
        <Card className="p-4">
          <div className="mb-2 text-sm font-semibold">حسب نوع المحتوى</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.byKind).map(([k, v]) => (
              <Badge key={k} variant="secondary" className="gap-1">
                {k} <span className="font-mono">{v}</span>
              </Badge>
            ))}
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الوقت</TableHead>
              <TableHead>النوع</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-center">URLs</TableHead>
              <TableHead className="text-center">Query keys</TableHead>
              <TableHead className="text-center">الزمن</TableHead>
              <TableHead className="text-center">الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                  لا توجد عمليات إبطال مسجّلة بعد. احفظ/انشر أي مقال أو خدمة لرؤية السجلات هنا.
                </TableCell>
              </TableRow>
            )}
            {events.map((e) => (
              <>
                <TableRow
                  key={e.id}
                  className="cursor-pointer"
                  onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                >
                  <TableCell className="font-mono text-xs">{new Date(e.at).toLocaleTimeString()}</TableCell>
                  <TableCell><Badge variant="outline">{e.kind}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{e.slug}</TableCell>
                  <TableCell className="text-center font-mono">{e.urlsPurged.length}</TableCell>
                  <TableCell className="text-center font-mono">{e.queryKeysInvalidated.length}</TableCell>
                  <TableCell className="text-center font-mono">{e.durationMs}ms</TableCell>
                  <TableCell className="text-center">
                    {e.ok ? <Badge variant="default">OK</Badge> : <Badge variant="destructive">ERR</Badge>}
                  </TableCell>
                </TableRow>
                {expanded === e.id && (
                  <TableRow key={`${e.id}-detail`} className="bg-muted/30">
                    <TableCell colSpan={7} className="space-y-2 p-3 text-xs">
                      <div>
                        <div className="mb-1 font-semibold">URLs المخدومة (soft purge):</div>
                        <ul className="space-y-0.5 font-mono">
                          {e.urlsPurged.map((u) => <li key={u}>• {u}</li>)}
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
              </>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}