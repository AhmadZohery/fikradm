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
import { SeoPanel, type SeoData } from "@/cms/editor/SeoPanel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  keywords: string[] | null;
  no_index: boolean;
};

type Device = "desktop" | "tablet" | "mobile";

type EditorState = {
  blocks: BlockInstance[];
  seo: SeoData;
};

const EMPTY_STATE: EditorState = {
  blocks: [],
  seo: {
    meta_title: "",
    meta_description: "",
    slug: "",
    locale: "ar",
    focus_keyword: "",
    og_image_url: "",
    canonical_url: "",
    keywords: [],
    no_index: false,
  },
};

function EditPage() {
  const { pageId } = Route.useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState<PageRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [device, setDevice] = useState<Device>("desktop");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState<string>(JSON.stringify(EMPTY_STATE));
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  const history = useUndoRedo<EditorState>(EMPTY_STATE);
  const state = history.state;
  const blocks = state.blocks;
  const seo = state.seo;

  const setBlocks = useCallback(
    (next: BlockInstance[] | ((prev: BlockInstance[]) => BlockInstance[])) => {
      history.set((prev) => ({
        ...prev,
        blocks: typeof next === "function" ? (next as (p: BlockInstance[]) => BlockInstance[])(prev.blocks) : next,
      }));
    },
    [history],
  );

  const setSeo = useCallback(
    (next: SeoData) => {
      history.set((prev) => ({ ...prev, seo: next }));
    },
    [history],
  );

  // Load
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("pages")
        .select(
          "id, slug, locale, title, status, blocks, meta_title, meta_description, og_image_url, canonical_url, keywords, no_index",
        )
        .eq("id", pageId)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        toast.error("تعذر تحميل الصفحة");
        navigate({ to: "/admin/pages" });
        return;
      }
      const row = data as unknown as PageRow;
      const initial: EditorState = {
        blocks: Array.isArray(row.blocks) ? row.blocks : [],
        seo: {
          meta_title: row.meta_title ?? "",
          meta_description: row.meta_description ?? "",
          slug: row.slug,
          locale: row.locale,
          focus_keyword: "",
          og_image_url: row.og_image_url ?? "",
          canonical_url: row.canonical_url ?? "",
          keywords: row.keywords ?? [],
          no_index: row.no_index,
        },
      };
      setPage(row);
      history.reset(initial);
      setSavedSnapshot(JSON.stringify(initial));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId, navigate]);

  const dirty = useMemo(
    () => JSON.stringify(state) !== savedSnapshot,
    [state, savedSnapshot],
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
    const snapshot = JSON.stringify(state);
    if (snapshot === savedSnapshot) return;
    setSaving(true);
    try {
      const prevState = JSON.parse(savedSnapshot) as EditorState;
      await supabase.from("page_revisions").insert({
        page_id: page.id,
        snapshot: { blocks: prevState.blocks, seo: prevState.seo } as never,
      });
      const { error } = await supabase
        .from("pages")
        .update({
          blocks: state.blocks as never,
          slug: state.seo.slug,
          meta_title: state.seo.meta_title || null,
          meta_description: state.seo.meta_description || null,
          og_image_url: state.seo.og_image_url || null,
          canonical_url: state.seo.canonical_url || null,
          keywords: state.seo.keywords.length ? state.seo.keywords : null,
          no_index: state.seo.no_index,
        })
        .eq("id", page.id);
      if (error) throw error;
      setSavedSnapshot(snapshot);
      setLastSavedAt(Date.now());
      // Sync local page slug for preview URL
      setPage((p) => (p ? { ...p, slug: state.seo.slug } : p));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "خطأ في الحفظ";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }, [page, state, savedSnapshot]);

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

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] min-h-0">
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
        <aside className="border-r bg-background hidden lg:flex flex-col min-h-0">
          <Tabs defaultValue="block" className="flex-1 flex flex-col min-h-0">
            <TabsList className="m-2 mb-0 grid grid-cols-2">
              <TabsTrigger value="block" className="text-xs">البلوك</TabsTrigger>
              <TabsTrigger value="seo" className="text-xs">SEO</TabsTrigger>
            </TabsList>
            <TabsContent value="block" className="flex-1 min-h-0 mt-0">
              <BlockInspector block={selected} onChange={updateBlock} />
            </TabsContent>
            <TabsContent value="seo" className="flex-1 min-h-0 mt-0">
              <SeoPanel data={seo} onChange={setSeo} />
            </TabsContent>
          </Tabs>
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
