import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  isKnownBlock,
  type BlockInstance,
  type BlockType,
} from "@/cms/blocks/registry";
import { useUndoRedo } from "@/cms/editor/useUndoRedo";
import { BlockLibrary } from "@/cms/editor/BlockLibrary";
import { BlockCanvas } from "@/cms/editor/BlockCanvas";
import { BlockInspector } from "@/cms/editor/BlockInspector";
import { EditorToolbar } from "@/cms/editor/EditorToolbar";

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

type Device = "desktop" | "tablet" | "mobile";

function EditPage() {
  const { pageId } = Route.useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState<PageRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [device, setDevice] = useState<Device>("desktop");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState<string>("[]");
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  const history = useUndoRedo<BlockInstance[]>([]);
  const blocks = history.state;
  const setBlocks = history.set;
  const resetBlocks = history.reset;

  // Load
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("id, slug, locale, title, status, blocks")
        .eq("id", pageId)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        toast.error("تعذر تحميل الصفحة");
        navigate({ to: "/admin/pages" });
        return;
      }
      const row = data as unknown as PageRow;
      const initial = Array.isArray(row.blocks) ? row.blocks : [];
      setPage(row);
      resetBlocks(initial);
      setSavedSnapshot(JSON.stringify(initial));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [pageId, navigate, resetBlocks]);

  const dirty = useMemo(
    () => JSON.stringify(blocks) !== savedSnapshot,
    [blocks, savedSnapshot],
  );

  const selected = useMemo(
    () => blocks.find((b) => b.id === selectedId) ?? null,
    [blocks, selectedId],
  );

  const addBlock = useCallback(
    (type: BlockType) => {
      if (!isKnownBlock(type)) return;
      const id = `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
      setBlocks((prev) => [...prev, { id, type }]);
      setSelectedId(id);
    },
    [setBlocks],
  );

  const updateBlock = useCallback(
    (next: BlockInstance) => {
      setBlocks((prev) => prev.map((b) => (b.id === next.id ? next : b)));
    },
    [setBlocks],
  );

  const save = useCallback(async () => {
    if (!page) return;
    const snapshot = JSON.stringify(blocks);
    if (snapshot === savedSnapshot) return;
    setSaving(true);
    try {
      // Snapshot previous state for revisions
      await supabase.from("page_revisions").insert({
        page_id: page.id,
        snapshot: { blocks: JSON.parse(savedSnapshot) } as never,
      });
      const { error } = await supabase
        .from("pages")
        .update({ blocks: blocks as never })
        .eq("id", page.id);
      if (error) throw error;
      setSavedSnapshot(snapshot);
      setLastSavedAt(Date.now());
    } catch (e) {
      const msg = e instanceof Error ? e.message : "خطأ في الحفظ";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }, [page, blocks, savedSnapshot]);

  // Auto-save every 30s if dirty
  const saveRef = useRef(save);
  saveRef.current = save;
  useEffect(() => {
    const id = window.setInterval(() => {
      if (dirty) saveRef.current();
    }, 30000);
    return () => window.clearInterval(id);
  }, [dirty]);

  // Warn on unload if dirty
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // Keyboard shortcuts: Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z, Ctrl/Cmd+S
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (!meta) return;
      const key = e.key.toLowerCase();
      if (key === "z" && !e.shiftKey) {
        e.preventDefault();
        history.undo();
      } else if ((key === "z" && e.shiftKey) || key === "y") {
        e.preventDefault();
        history.redo();
      } else if (key === "s") {
        e.preventDefault();
        saveRef.current();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [history]);

  if (loading || !page) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
        <Loader2 className="w-4 h-4 animate-spin ml-2" /> جاري التحميل...
      </div>
    );
  }

  const previewUrl = `/${page.locale}${page.slug === "home" ? "" : `/${page.slug}`}`;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-4 md:-m-6">
      <EditorToolbar
        title={page.title}
        status={page.status}
        previewUrl={previewUrl}
        device={device}
        onDeviceChange={setDevice}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        onUndo={history.undo}
        onRedo={history.redo}
        onSave={save}
        saving={saving}
        dirty={dirty}
        lastSavedAt={lastSavedAt}
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[260px_1fr_300px] min-h-0">
        <aside className="border-l bg-background hidden lg:block min-h-0">
          <BlockLibrary onAdd={addBlock} />
        </aside>
        <main className="min-h-0">
          <BlockCanvas
            blocks={blocks}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onChange={setBlocks}
            device={device}
          />
        </main>
        <aside className="border-r bg-background hidden lg:block min-h-0">
          <BlockInspector block={selected} onChange={updateBlock} />
        </aside>
      </div>

      {/* Mobile fallback library */}
      <div className="lg:hidden border-t bg-background">
        <details>
          <summary className="px-4 py-2 text-sm font-medium cursor-pointer">
            مكتبة البلوكات
          </summary>
          <div className="h-64">
            <BlockLibrary onAdd={addBlock} />
          </div>
        </details>
      </div>
    </div>
  );
}
