import { supabase } from "@/integrations/supabase/client";

export type UploadedMedia = {
  id: string;
  public_url: string;
  storage_path: string;
  filename: string;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
};

const BUCKET = "cms-uploads";

function sanitizeFilename(name: string) {
  const dot = name.lastIndexOf(".");
  const base = (dot > -1 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "file";
  const ext = dot > -1 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  return ext ? `${base}.${ext}` : base;
}

async function readImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  if (!file.type.startsWith("image/")) return null;
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

export async function uploadMediaFile(file: File, folder = "general"): Promise<UploadedMedia> {
  const safeName = sanitizeFilename(file.name);
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (uploadError) throw uploadError;

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const dims = await readImageDimensions(file);

  const { data: row, error: insertError } = await supabase
    .from("media_library")
    .insert({
      filename: file.name,
      folder,
      storage_path: path,
      public_url: pub.publicUrl,
      mime_type: file.type || null,
      size_bytes: file.size,
      width: dims?.width ?? null,
      height: dims?.height ?? null,
    })
    .select("id, public_url, storage_path, filename, mime_type, size_bytes, width, height")
    .single();
  if (insertError) throw insertError;

  return row as UploadedMedia;
}

export async function deleteMediaItem(id: string, storagePath: string) {
  const { error: storageError } = await supabase.storage.from(BUCKET).remove([storagePath]);
  if (storageError) throw storageError;
  const { error } = await supabase.from("media_library").delete().eq("id", id);
  if (error) throw error;
}

export function formatBytes(bytes: number | null | undefined) {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}
