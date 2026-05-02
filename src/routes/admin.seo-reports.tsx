import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, XCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type ReportRow = {
  id: string;
  ran_at: string;
  total_pages: number;
  total_warnings: number;
  total_errors: number;
  summary: {
    pagesWithoutSchema?: number;
    fixMap?: Record<string, string>;
  };
  details: Array<{
    url: string;
    status: number;
    schemaCount: number;
    issues: Array<{ url: string; level: "error" | "warning"; type: string; message: string }>;
  }>;
};

export const Route = createFileRoute("/admin/seo-reports")({
  component: SeoReportsPage,
});

function SeoReportsPage() {
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("seo_audit_reports")
      .select("id, ran_at, total_pages, total_warnings, total_errors, summary, details")
      .order("ran_at", { ascending: false })
      .limit(30);
    if (error) toast.error(error.message);
    setRows((data ?? []) as unknown as ReportRow[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const runNow = async () => {
    setRunning(true);
    try {
      const res = await fetch("/api/public/hooks/seo-audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: "{}",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("Audit ran successfully");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="container-app section">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">JSON-LD Audit Reports</h1>
          <p className="text-sm text-muted-foreground">
            Daily snapshot of every important page's structured data + fix guidance.
          </p>
        </div>
        <Button onClick={runNow} disabled={running}>
          {running ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <RefreshCw className="me-2 h-4 w-4" />}
          Run now
        </Button>
      </div>

      {loading ? (
        <div className="mt-8 flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : rows.length === 0 ? (
        <Card className="mt-8 p-6 text-sm text-muted-foreground">
          No reports yet. Click "Run now" to generate the first one.
        </Card>
      ) : (
        <div className="mt-8 space-y-4">
          {rows.map((r) => {
            const isOpen = open === r.id;
            return (
              <Card key={r.id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">
                      {new Date(r.ran_at).toLocaleString()}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{r.total_pages} pages</span>
                      {r.total_errors > 0 ? (
                        <Badge variant="destructive">
                          <XCircle className="me-1 h-3 w-3" />
                          {r.total_errors} errors
                        </Badge>
                      ) : (
                        <Badge className="bg-success/20 text-success">
                          <CheckCircle2 className="me-1 h-3 w-3" /> No errors
                        </Badge>
                      )}
                      {r.total_warnings > 0 && (
                        <Badge variant="secondary">
                          <AlertTriangle className="me-1 h-3 w-3" />
                          {r.total_warnings} warnings
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setOpen(isOpen ? null : r.id)}>
                    {isOpen ? "Hide details" : "View details"}
                  </Button>
                </div>

                {isOpen && (
                  <div className="mt-5 space-y-4">
                    {r.summary?.fixMap && Object.keys(r.summary.fixMap).length > 0 && (
                      <div className="rounded-lg border border-border bg-surface/40 p-4">
                        <div className="text-xs font-bold uppercase text-muted-foreground">Fix map</div>
                        <ul className="mt-2 space-y-1 text-sm">
                          {Object.entries(r.summary.fixMap).map(([type, hint]) => (
                            <li key={type}>
                              <span className="font-semibold text-primary">{type}</span> — {hint}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="space-y-2">
                      {r.details.map((d) => (
                        <details key={d.url} className="rounded border border-border p-3 text-sm">
                          <summary className="cursor-pointer">
                            <span className="font-mono text-xs">{d.url}</span>
                            <span className="ms-2 text-xs text-muted-foreground">
                              ({d.schemaCount} schemas, {d.issues.length} issues, HTTP {d.status})
                            </span>
                          </summary>
                          {d.issues.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {d.issues.map((i, idx) => (
                                <li
                                  key={idx}
                                  className={`text-xs ${i.level === "error" ? "text-destructive" : "text-warning"}`}
                                >
                                  [{i.level}] {i.type}: {i.message}
                                </li>
                              ))}
                            </ul>
                          )}
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
