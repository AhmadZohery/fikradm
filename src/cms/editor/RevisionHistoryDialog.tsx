import { useEffect, useState } from "react";
import { Loader2, History, RotateCcw, Clock } from "lucide-react";
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

type Revision = {
  id: string;
  created_at: string;
  snapshot: Snapshot;
};

type Props = {
  open: boolean;
  onClose: () => void;
  pageId: string;
  onRestore: (snapshot: Snapshot) => void;
};

export function RevisionHistoryDialog({ open, onClose, pageId, onRestore }: Props) {
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState<Revision | null>(null);

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
      setRevisions((data ?? []) as Revision[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, pageId]);

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
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" /> سجل المراجعات
            </DialogTitle>
            <DialogDescription>
              النسخ السابقة من الصفحة. الاستعادة تستبدل المحتوى الحالي (مش بتحفظ تلقائياً).
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto -mx-6 px-6">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin ml-2" /> جاري التحميل...
              </div>
            ) : revisions.length === 0 ? (
              <div className="text-center py-12 text-sm text-muted-foreground">
                لا توجد مراجعات بعد. كل حفظ بينشئ snapshot جديد.
              </div>
            ) : (
              <div className="space-y-2">
                {revisions.map((rev, i) => {
                  const blocksCount = Array.isArray(rev.snapshot?.blocks)
                    ? rev.snapshot.blocks.length
                    : 0;
                  return (
                    <div
                      key={rev.id}
                      className="flex items-center justify-between border rounded-md p-3 hover:bg-muted/40 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="font-medium text-sm flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          {formatDate(rev.created_at)}
                          {i === 0 && (
                            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                              الأحدث
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {blocksCount} بلوك
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => setConfirm(rev)}>
                        <RotateCcw className="w-3.5 h-3.5 ml-1" /> استعادة
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>استعادة هذه النسخة؟</AlertDialogTitle>
            <AlertDialogDescription>
              هيتم استبدال المحتوى الحالي بنسخة {confirm && formatDate(confirm.created_at)}. لازم
              تضغط حفظ بعدها لتثبيت التغيير.
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
