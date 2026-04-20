import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Upload, Trash2, Copy, Search, ImageOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { uploadMediaFile, deleteMediaItem, formatBytes, type UploadedMedia } from "@/lib/uploadMedia";

export const Route = createFileRoute("/admin/media")({
  component: MediaLibraryPage,
});

type MediaItem = UploadedMedia & { created_at: string };

function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<MediaItem | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("media_library")
      .select("id, public_url, storage_path, filename, mime_type, size_bytes, width, height, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) toast.error(error.message);
    setItems((data ?? []) as MediaItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    let ok = 0;
    let failed = 0;
    for (const file of Array.from(files)) {
      try {
        await uploadMediaFile(file);
        ok++;
      } catch (e) {
        failed++;
        toast.error(`${file.name}: ${e instanceof Error ? e.message : "خطأ"}`);
      }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    if (ok) toast.success(`تم رفع ${ok} ملف${failed ? ` (فشل ${failed})` : ""}`);
    await load();
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteMediaItem(confirmDelete.id, confirmDelete.storage_path);
      toast.success("تم الحذف");
      setItems((prev) => prev.filter((i) => i.id !== confirmDelete.id));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل الحذف");
    } finally {
      setConfirmDelete(null);
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("تم نسخ الرابط");
    } catch {
      toast.error("تعذر النسخ");
    }
  };

  const filtered = query.trim()
    ? items.filter((i) => i.filename.toLowerCase().includes(query.toLowerCase()))
    : items;

  const totalSize = items.reduce((s, i) => s + (i.size_bytes ?? 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">مكتبة الوسائط</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {items.length} ملف · {formatBytes(totalSize)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? (
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 ml-2" />
            )}
            رفع ملفات
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ابحث بالاسم..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-9"
        />
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={`rounded-lg border-2 border-dashed transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-border"
        } p-4 min-h-[300px]`}
      >
        {loading ? (
          <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin ml-2" /> جاري التحميل...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-sm text-muted-foreground">
            <ImageOff className="w-10 h-10 mx-auto mb-3 opacity-40" />
            {query ? "لا نتائج للبحث" : "اسحب وأفلت ملفات هنا أو اضغط زر الرفع"}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filtered.map((item) => {
              const isImg = item.mime_type?.startsWith("image/");
              return (
                <Card key={item.id} className="overflow-hidden group">
                  <div className="aspect-square bg-muted relative">
                    {isImg ? (
                      <img
                        src={item.public_url}
                        alt={item.filename}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                        {item.mime_type ?? "ملف"}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => copyUrl(item.public_url)}
                        title="نسخ الرابط"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8"
                        onClick={() => setConfirmDelete(item)}
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-2 text-[11px]">
                    <div className="truncate font-medium" dir="ltr">
                      {item.filename}
                    </div>
                    <div className="text-muted-foreground flex justify-between mt-0.5">
                      <span>{formatBytes(item.size_bytes)}</span>
                      {item.width && item.height && (
                        <span>
                          {item.width}×{item.height}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف الملف؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف <span className="font-mono">{confirmDelete?.filename}</span> نهائياً ولا يمكن
              التراجع. تأكد إنه غير مستخدم في أي صفحة.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
