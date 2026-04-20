import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  BLOCK_REGISTRY,
  isKnownBlock,
  type BlockInstance,
  type BlockType,
} from "@/cms/blocks/registry";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/pages/$pageId")({
  component: EditPage,
});

type PageRow = {
  id: string;
  slug: string;
  locale: string;
  title: string;
  status: "draft" | "published" | "archived";
  blocks: BlockInstance[];
};

function EditPage() {
  const { pageId } = Route.useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState<PageRow | null>(null);
  const [blocks, setBlocks] = useState<BlockInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [newType, setNewType] = useState<BlockType | "">("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("id, slug, locale, title, status, blocks")
        .eq("id", pageId)
        .maybeSingle();
      if (error || !data) {
        toast.error("تعذر تحميل الصفحة");
        navigate({ to: "/admin/pages" });
        return;
      }
      const row = data as unknown as PageRow;
      setPage(row);
      setBlocks(Array.isArray(row.blocks) ? row.blocks : []);
      setLoading(false);
    })();
  }, [pageId, navigate]);

  const blockOptions = useMemo(
    () =>
      (Object.keys(BLOCK_REGISTRY) as BlockType[]).map((k) => ({
        value: k,
        label: BLOCK_REGISTRY[k].label,
      })),
    [],
  );

  function move(idx: number, dir: -1 | 1) {
    const next = [...blocks];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setBlocks(next);
  }

  function toggle(idx: number) {
    const next = [...blocks];
    next[idx] = { ...next[idx], visible: next[idx].visible === false };
    setBlocks(next);
  }

  function remove(idx: number) {
    setBlocks(blocks.filter((_, i) => i !== idx));
  }

  function addBlock() {
    if (!newType || !isKnownBlock(newType)) return;
    const id = `b_${Date.now().toString(36)}`;
    setBlocks([...blocks, { id, type: newType }]);
    setNewType("");
    setPickerOpen(false);
  }

  async function save() {
    if (!page) return;
    setSaving(true);
    try {
      // Snapshot current state to revisions before overwriting
      await supabase.from("page_revisions").insert({
        page_id: page.id,
        snapshot: { blocks: page.blocks } as never,
      });
      const { error } = await supabase
        .from("pages")
        .update({ blocks: blocks as never })
        .eq("id", page.id);
      if (error) throw error;
      setPage({ ...page, blocks });
      toast.success("تم الحفظ");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "خطأ في الحفظ";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  if (loading || !page) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
        <Loader2 className="w-4 h-4 animate-spin ml-2" /> جاري التحميل...
      </div>
    );
  }

  const previewUrl = `/${page.locale}${page.slug === "home" ? "" : `/${page.slug}`}`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link to="/admin/pages">
              <ArrowLeft className="w-4 h-4 ml-1" /> الصفحات
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{page.title}</h1>
          <p className="text-sm text-muted-foreground mt-1" dir="ltr">
            {previewUrl} · {page.locale.toUpperCase()} ·{" "}
            <Badge
              variant={page.status === "published" ? "default" : "secondary"}
              className="text-xs"
            >
              {page.status}
            </Badge>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={previewUrl} target="_blank" rel="noreferrer">
              <Eye className="w-4 h-4 ml-1" /> معاينة
            </a>
          </Button>
          <Button onClick={save} disabled={saving} size="sm">
            {saving ? (
              <Loader2 className="w-4 h-4 ml-1 animate-spin" />
            ) : (
              <Save className="w-4 h-4 ml-1" />
            )}
            حفظ
          </Button>
        </div>
      </div>

      <Card className="p-4 space-y-2">
        <div className="text-sm font-medium mb-2">
          ترتيب البلوكات ({blocks.length})
        </div>
        {blocks.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            لا توجد بلوكات بعد
          </p>
        ) : (
          <ul className="space-y-2">
            {blocks.map((b, i) => {
              const known = isKnownBlock(b.type);
              const label = known ? BLOCK_REGISTRY[b.type].label : b.type;
              const hidden = b.visible === false;
              return (
                <li
                  key={b.id}
                  className={`flex items-center gap-2 p-3 rounded-lg border bg-background ${
                    hidden ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex flex-col">
                    <button
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className="text-muted-foreground hover:text-foreground disabled:opacity-30 leading-none"
                      aria-label="رفع"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => move(i, 1)}
                      disabled={i === blocks.length - 1}
                      className="text-muted-foreground hover:text-foreground disabled:opacity-30 leading-none"
                      aria-label="إنزال"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{label}</div>
                    <div className="text-xs text-muted-foreground font-mono">{b.type}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggle(i)}
                    title={hidden ? "إظهار" : "إخفاء"}
                  >
                    {hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(i)}
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}

        <div className="pt-3 border-t mt-3">
          {!pickerOpen ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPickerOpen(true)}
              className="w-full"
            >
              <Plus className="w-4 h-4 ml-1" /> إضافة بلوك
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Select value={newType} onValueChange={(v) => setNewType(v as BlockType)}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="اختر نوع البلوك..." />
                </SelectTrigger>
                <SelectContent>
                  {blockOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" onClick={addBlock} disabled={!newType}>
                إضافة
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPickerOpen(false);
                  setNewType("");
                }}
              >
                إلغاء
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-4 text-xs text-muted-foreground">
        💡 محرر متكامل بـ drag &amp; drop والـ inline editing هيتوفر في Phase 3.
        دلوقتي تقدر ترتب وتُخفي وتضيف وتحذف البلوكات. كل حفظ بيعمل snapshot في
        page_revisions تلقائياً.
      </Card>
    </div>
  );
}
