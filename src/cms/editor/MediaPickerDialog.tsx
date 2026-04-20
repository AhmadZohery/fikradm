import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Search, Upload, Check, X } from "lucide-react";
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
import { uploadMediaFile, formatBytes, type UploadedMedia } from "@/lib/uploadMedia";

type MediaItem = UploadedMedia & { created_at?: string };

type Props = {
  open: boolean;
  onClose: () => void;
  onPick: (item: MediaItem) => void;
  imagesOnly?: boolean;
};

export function MediaPickerDialog({ open, onClose, onPick, imagesOnly = true }: Props) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    let q = supabase
      .from("media_library")
      .select("id, public_url, storage_path, filename, mime_type, size_bytes, width, height, created_at")
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
      void load();
    }
  }, [open, load]);

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

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 gap-0">
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

        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin ml-2" /> جاري التحميل...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-sm text-muted-foreground">
              لا توجد ملفات. ارفع صورة جديدة للبدء.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filtered.map((item) => {
                const isSel = selected?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelected(item)}
                    onDoubleClick={() => onPick(item)}
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

        <DialogFooter className="p-4 border-t flex-row sm:justify-between gap-2">
          <div className="text-xs text-muted-foreground">
            {selected ? (
              <span dir="ltr">
                {selected.filename} · {formatBytes(selected.size_bytes)}
                {selected.width && selected.height ? ` · ${selected.width}×${selected.height}` : ""}
              </span>
            ) : (
              "اختر ملف أو اضغط مرتين للإدراج"
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4 ml-1" /> إلغاء
            </Button>
            <Button size="sm" disabled={!selected} onClick={() => selected && onPick(selected)}>
              <Check className="w-4 h-4 ml-1" /> إدراج
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
