import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Search, Upload, Check, X, AlertCircle, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { uploadMediaFile, formatBytes, type UploadedMedia } from "@/lib/uploadMedia";

type MediaItem = UploadedMedia & {
  created_at?: string;
  alt_text?: string | null;
  caption?: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onPick: (item: MediaItem) => void;
  imagesOnly?: boolean;
  /** When true, alt_text becomes mandatory before insertion (recommended for SEO/OG/Twitter). */
  requireAlt?: boolean;
};

export function MediaPickerDialog({
  open,
  onClose,
  onPick,
  imagesOnly = true,
  requireAlt = true,
}: Props) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [altDraft, setAltDraft] = useState("");
  const [captionDraft, setCaptionDraft] = useState("");
  const [savingMeta, setSavingMeta] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    let q = supabase
      .from("media_library")
      .select("id, public_url, storage_path, filename, mime_type, size_bytes, width, height, created_at, alt_text, caption")
      .order("created_at", { ascending: false })
      .limit(200);
    if (imagesOnly) q = q.like("mime_type", "image/%");
    const { data, error } = await q;
    if (error) toast.error(error.message);
    setItems((data ?? []) as MediaItem[]);
    setLoading(false);
  }, [imagesOnly]);

  useEffect(() => {
    if (open) {
      setSelected(null);
      setQuery("");
      setAltDraft("");
      setCaptionDraft("");
      void load();
    }
  }, [open, load]);

  // Sync alt/caption draft when selection changes
  useEffect(() => {
    if (selected) {
      setAltDraft(selected.alt_text ?? "");
      setCaptionDraft(selected.caption ?? "");
    } else {
      setAltDraft("");
      setCaptionDraft("");
    }
  }, [selected]);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      let last: MediaItem | null = null;
      for (const file of Array.from(files)) {
        if (imagesOnly && !file.type.startsWith("image/")) {
          toast.error(`${file.name}: ليست صورة`);
          continue;
        }
        const item = await uploadMediaFile(file);
        last = item;
      }
      toast.success("تم الرفع");
      await load();
      if (last) setSelected(last);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل الرفع");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const filtered = query.trim()
    ? items.filter((i) => i.filename.toLowerCase().includes(query.toLowerCase()))
    : items;

  const altMissing = requireAlt && !altDraft.trim();
  const ogReady = !!selected && (selected.width ?? 0) >= 1200 && (selected.height ?? 0) >= 630;

  const persistMetaIfNeeded = async (item: MediaItem) => {
    const altChanged = altDraft.trim() !== (item.alt_text ?? "");
    const captionChanged = captionDraft.trim() !== (item.caption ?? "");
    if (!altChanged && !captionChanged) return item;
    setSavingMeta(true);
    try {
      const { error } = await supabase
        .from("media_library")
        .update({ alt_text: altDraft.trim() || null, caption: captionDraft.trim() || null })
        .eq("id", item.id);
      if (error) throw error;
      return { ...item, alt_text: altDraft.trim() || null, caption: captionDraft.trim() || null };
    } finally {
      setSavingMeta(false);
    }
  };

  const handleInsert = async () => {
    if (!selected) return;
    if (altMissing) {
      toast.error("النص البديل (alt) مطلوب — مهم للـ SEO وقارئات الشاشة");
      return;
    }
    try {
      const finalItem = await persistMetaIfNeeded(selected);
      onPick(finalItem);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل حفظ الـ alt");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl max-h-[88vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>اختر صورة</DialogTitle>
        </DialogHeader>

        <div className="p-4 border-b flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="ابحث..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-8"
            />
          </div>
          <input
            ref={fileRef}
            type="file"
            accept={imagesOnly ? "image/*" : undefined}
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button onClick={() => fileRef.current?.click()} disabled={uploading} size="sm">
            {uploading ? (
              <Loader2 className="w-4 h-4 ml-1 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 ml-1" />
            )}
            رفع جديد
          </Button>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_280px] min-h-0">
          <div className="overflow-auto p-4 min-h-0">
            {loading ? (
            <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin ml-2" /> جاري التحميل...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-sm text-muted-foreground">
              لا توجد ملفات. ارفع صورة جديدة للبدء.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map((item) => {
                const isSel = selected?.id === item.id;
                const hasAlt = !!item.alt_text;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelected(item)}
                    className={`group relative aspect-square rounded-md overflow-hidden border-2 transition-all bg-muted ${
                      isSel ? "border-primary ring-2 ring-primary/30" : "border-transparent hover:border-border"
                    }`}
                  >
                    <img
                      src={item.public_url}
                      alt={item.filename}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    {!hasAlt && (
                      <div
                        title="لا يوجد alt text"
                        className="absolute top-1.5 left-1.5 bg-amber-500 text-white rounded-full w-5 h-5 grid place-items-center"
                      >
                        <AlertCircle className="w-3 h-3" />
                      </div>
                    )}
                    {isSel && (
                      <div className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent text-white text-[10px] px-1.5 py-1 truncate text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.filename}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          </div>

          {/* Right: metadata editor */}
          <aside className="border-r bg-muted/10 overflow-y-auto p-4 space-y-3 hidden md:block">
            <div className="text-xs font-semibold flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" /> بيانات الصورة
            </div>
            {!selected ? (
              <div className="text-xs text-muted-foreground py-8 text-center">اختر صورة لتحرير بياناتها</div>
            ) : (
              <>
                <div className="rounded border bg-background overflow-hidden aspect-video">
                  <img src={selected.public_url} alt={selected.alt_text ?? ""} className="w-full h-full object-contain" />
                </div>
                <div className="text-[10px] text-muted-foreground space-y-0.5" dir="ltr">
                  <div className="truncate">{selected.filename}</div>
                  <div>
                    {formatBytes(selected.size_bytes)}
                    {selected.width && selected.height ? ` · ${selected.width}×${selected.height}` : ""}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Badge variant={ogReady ? "default" : "secondary"} className="text-[9px]">
                    {ogReady ? "✓ OG/Twitter جاهزة" : "OG: <1200×630"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-[11px] flex items-center gap-1">
                    Alt Text {requireAlt && <span className="text-destructive">*</span>}
                  </Label>
                  <Textarea
                    rows={2}
                    value={altDraft}
                    onChange={(e) => setAltDraft(e.target.value)}
                    placeholder="وصف الصورة لمحركات البحث وقارئات الشاشة"
                    className={altMissing ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  <p className="text-[9px] text-muted-foreground mt-0.5">
                    يستخدم لـ &lt;img alt&gt; وog:image:alt وtwitter:image:alt
                  </p>
                </div>
                <div>
                  <Label className="text-[11px]">Caption (اختياري)</Label>
                  <Input value={captionDraft} onChange={(e) => setCaptionDraft(e.target.value)} />
                </div>
              </>
            )}
          </aside>
        </div>

        <DialogFooter className="p-4 border-t flex-row sm:justify-between gap-2">
          <div className="text-xs text-muted-foreground">
            {selected ? (
              <span dir="ltr">
                {selected.filename} · {formatBytes(selected.size_bytes)}
                {selected.width && selected.height ? ` · ${selected.width}×${selected.height}` : ""}
              </span>
            ) : (
              "اختر ملفاً ثم أضف Alt Text"
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4 ml-1" /> إلغاء
            </Button>
            <Button size="sm" disabled={!selected || altMissing || savingMeta} onClick={handleInsert}>
              {savingMeta ? <Loader2 className="w-4 h-4 ml-1 animate-spin" /> : <Check className="w-4 h-4 ml-1" />}
              إدراج
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
