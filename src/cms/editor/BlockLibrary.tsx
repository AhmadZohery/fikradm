import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BLOCK_REGISTRY, type BlockType } from "@/cms/blocks/registry";

const CATEGORY_LABELS: Record<string, string> = {
  hero: "Hero",
  content: "محتوى",
  social: "Social Proof",
  conversion: "تحويل",
  layout: "تخطيط",
};

type Props = {
  onAdd: (type: BlockType) => void;
};

export function BlockLibrary({ onAdd }: Props) {
  const [q, setQ] = useState("");

  const grouped = useMemo(() => {
    const entries = (Object.keys(BLOCK_REGISTRY) as BlockType[])
      .map((k) => ({ key: k, ...BLOCK_REGISTRY[k] }))
      .filter((e) => {
        if (!q.trim()) return true;
        const s = q.trim().toLowerCase();
        return (
          e.label.toLowerCase().includes(s) ||
          e.key.toLowerCase().includes(s) ||
          (e.description ?? "").toLowerCase().includes(s)
        );
      });
    const map: Record<string, typeof entries> = {};
    for (const e of entries) {
      (map[e.category] ??= []).push(e);
    }
    return map;
  }, [q]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="ابحث عن بلوك..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pr-8 h-9"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <div className="text-xs font-semibold text-muted-foreground uppercase mb-2 px-1">
              {CATEGORY_LABELS[cat] ?? cat}
            </div>
            <div className="space-y-1.5">
              {items.map((it) => (
                <button
                  key={it.key}
                  onClick={() => onAdd(it.key)}
                  className="w-full text-right p-2.5 rounded-md border bg-background hover:bg-accent hover:border-primary/40 transition-colors group"
                  title="انقر للإضافة"
                >
                  <div className="font-medium text-sm group-hover:text-primary truncate">
                    {it.label}
                  </div>
                  {it.description && (
                    <div className="text-xs text-muted-foreground truncate mt-0.5">
                      {it.description}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
        {Object.keys(grouped).length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">لا نتائج</p>
        )}
      </div>
    </div>
  );
}
