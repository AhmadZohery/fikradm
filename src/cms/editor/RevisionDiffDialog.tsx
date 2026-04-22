import { useEffect, useMemo, useState } from "react";
import { Loader2, History, RotateCcw, Clock, GitCompare, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { BlockInstance } from "@/cms/blocks/registry";
import type { SeoData } from "./SeoPanel";

type Snapshot = { blocks: BlockInstance[]; seo?: SeoData };
type Revision = { id: string; created_at: string; snapshot: Snapshot };

type Props = {
  open: boolean;
  onClose: () => void;
  pageId: string;
  currentState: Snapshot;
  onRestore: (snapshot: Snapshot) => void;
};

export function RevisionDiffDialog({ open, onClose, pageId, currentState, onRestore }: Props) {
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState<Revision | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<"side" | "diff">("side");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("page_revisions")
        .select("id, created_at, snapshot")
        .eq("page_id", pageId)
        .order("created_at", { ascending: false })
        .limit(50);
      if (cancelled) return;
      if (error) toast.error(error.message);
      const list = (data ?? []) as Revision[];
      setRevisions(list);
      setSelectedId(list[0]?.id ?? null);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, pageId]);

  const selected = useMemo(
    () => revisions.find((r) => r.id === selectedId) ?? null,
    [revisions, selectedId],
  );

  const diff = useMemo(() => (selected ? diffBlocks(selected.snapshot.blocks ?? [], currentState.blocks) : null), [selected, currentState]);

  const handleRestore = () => {
    if (!confirm) return;
    onRestore(confirm.snapshot);
    setConfirm(null);
    onClose();
    toast.success("تم استعادة النسخة. اضغط حفظ لتثبيتها.");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 gap-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" /> سجل المراجعات + المقارنة
            </DialogTitle>
            <DialogDescription className="text-xs">
              قارن النسخة المختارة مع المحتوى الحالي قبل الاستعادة.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-[260px_1fr] min-h-0">
            <aside className="border-l overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin ml-2" /> تحميل...
                </div>
              ) : revisions.length === 0 ? (
                <div className="text-center py-12 text-xs text-muted-foreground px-4">
                  لا توجد مراجعات بعد.
                </div>
              ) : (
                <ul className="divide-y">
                  {revisions.map((rev, i) => (
                    <li key={rev.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(rev.id)}
                        className={`w-full text-right p-3 text-xs hover:bg-muted/40 transition-colors ${
                          selectedId === rev.id ? "bg-primary/5 border-r-2 border-primary" : ""
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          {formatDate(rev.created_at)}
                          {i === 0 && <Badge variant="secondary" className="text-[9px] h-4">الأحدث</Badge>}
                        </div>
                        <div className="text-muted-foreground mt-0.5">
                          {Array.isArray(rev.snapshot?.blocks) ? rev.snapshot.blocks.length : 0} بلوك
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </aside>

            <section className="flex flex-col min-h-0">
              <div className="p-3 border-b flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1 border rounded-md p-0.5">
                  <Button
                    variant={view === "side" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setView("side")}
                  >
                    <FileText className="w-3.5 h-3.5 ml-1" /> جنباً لجنب
                  </Button>
                  <Button
                    variant={view === "diff" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setView("diff")}
                  >
                    <GitCompare className="w-3.5 h-3.5 ml-1" /> الفرق
                  </Button>
                </div>
                <Button
                  size="sm"
                  disabled={!selected}
                  onClick={() => selected && setConfirm(selected)}
                >
                  <RotateCcw className="w-3.5 h-3.5 ml-1" /> استعادة هذه النسخة
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 text-xs">
                {!selected ? (
                  <div className="text-center py-12 text-muted-foreground">اختر نسخة من اليمين</div>
                ) : view === "side" ? (
                  <div className="grid grid-cols-2 gap-3 min-h-full">
                    <Pane title="النسخة المختارة" blocks={selected.snapshot.blocks ?? []} />
                    <Pane title="المحتوى الحالي" blocks={currentState.blocks} />
                  </div>
                ) : diff ? (
                  <DiffView diff={diff} />
                ) : null}
              </div>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>استعادة هذه النسخة؟</AlertDialogTitle>
            <AlertDialogDescription>
              هيتم استبدال المحتوى الحالي. لازم تضغط حفظ بعدها لتثبيت التغيير.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestore}>استعادة</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Pane({ title, blocks }: { title: string; blocks: BlockInstance[] }) {
  return (
    <div className="border rounded-md overflow-hidden bg-background">
      <div className="px-2.5 py-1.5 border-b bg-muted/30 font-medium text-[11px]">{title}</div>
      <div className="p-2 space-y-1">
        {blocks.length === 0 && <div className="text-muted-foreground text-center py-4">— فارغ —</div>}
        {blocks.map((b, i) => (
          <div key={b.id} className="flex items-center gap-2 px-2 py-1 rounded bg-muted/40">
            <span className="text-[10px] text-muted-foreground w-5">{i + 1}</span>
            <span className="font-mono text-[11px]">{b.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type DiffEntry =
  | { kind: "added"; type: string; index: number }
  | { kind: "removed"; type: string; index: number }
  | { kind: "moved"; type: string; from: number; to: number }
  | { kind: "unchanged"; type: string; index: number };

function diffBlocks(prev: BlockInstance[], next: BlockInstance[]): DiffEntry[] {
  const prevMap = new Map(prev.map((b, i) => [b.id, i] as const));
  const nextMap = new Map(next.map((b, i) => [b.id, i] as const));
  const entries: DiffEntry[] = [];

  for (const [i, b] of next.entries()) {
    if (!prevMap.has(b.id)) entries.push({ kind: "added", type: b.type, index: i });
    else {
      const from = prevMap.get(b.id) ?? -1;
      if (from !== i) entries.push({ kind: "moved", type: b.type, from, to: i });
      else entries.push({ kind: "unchanged", type: b.type, index: i });
    }
  }
  for (const [i, b] of prev.entries()) {
    if (!nextMap.has(b.id)) entries.push({ kind: "removed", type: b.type, index: i });
  }
  return entries;
}

function DiffView({ diff }: { diff: DiffEntry[] }) {
  const summary = {
    added: diff.filter((d) => d.kind === "added").length,
    removed: diff.filter((d) => d.kind === "removed").length,
    moved: diff.filter((d) => d.kind === "moved").length,
    unchanged: diff.filter((d) => d.kind === "unchanged").length,
  };
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 text-[11px]">
        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-0">+ {summary.added} مضاف</Badge>
        <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-0">− {summary.removed} محذوف</Badge>
        <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-0">↕ {summary.moved} منقول</Badge>
        <Badge variant="secondary">= {summary.unchanged} ثابت</Badge>
      </div>
      <ul className="space-y-1">
        {diff.map((d, i) => {
          const cls =
            d.kind === "added"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
              : d.kind === "removed"
                ? "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300"
                : d.kind === "moved"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300"
                  : "bg-background border-border text-muted-foreground";
          const sign = d.kind === "added" ? "+" : d.kind === "removed" ? "−" : d.kind === "moved" ? "↕" : "=";
          return (
            <li key={i} className={`border rounded px-2 py-1 flex items-center gap-2 ${cls}`}>
              <span className="font-mono w-4">{sign}</span>
              <span className="font-mono text-[11px]">{d.type}</span>
              <span className="text-[10px] mr-auto">
                {d.kind === "moved" ? `${d.from + 1} → ${d.to + 1}` : ""}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}