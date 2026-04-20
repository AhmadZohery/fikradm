import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Copy, Eye, EyeOff, GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BLOCK_REGISTRY, isKnownBlock, type BlockInstance } from "@/cms/blocks/registry";

type Props = {
  blocks: BlockInstance[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onChange: (next: BlockInstance[]) => void;
  device: "desktop" | "tablet" | "mobile";
};

const DEVICE_WIDTH: Record<Props["device"], string> = {
  desktop: "w-full",
  tablet: "max-w-3xl mx-auto",
  mobile: "max-w-sm mx-auto",
};

export function BlockCanvas({ blocks, selectedId, onSelect, onChange, device }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = blocks.findIndex((b) => b.id === active.id);
    const newIdx = blocks.findIndex((b) => b.id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    onChange(arrayMove(blocks, oldIdx, newIdx));
  }

  function toggle(id: string) {
    onChange(blocks.map((b) => (b.id === id ? { ...b, visible: b.visible === false } : b)));
  }
  function remove(id: string) {
    onChange(blocks.filter((b) => b.id !== id));
  }
  function duplicate(id: string) {
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const copy: BlockInstance = {
      ...blocks[idx],
      id: `b_${Date.now().toString(36)}`,
    };
    const next = [...blocks];
    next.splice(idx + 1, 0, copy);
    onChange(next);
  }

  return (
    <div className="h-full overflow-y-auto bg-muted/30 p-4">
      <div className={`transition-all duration-200 ${DEVICE_WIDTH[device]}`}>
        {blocks.length === 0 ? (
          <div className="border-2 border-dashed rounded-lg py-20 text-center text-muted-foreground bg-background">
            ابدأ بإضافة بلوك من المكتبة على اليمين
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              <ul className="space-y-2">
                {blocks.map((b) => (
                  <SortableBlock
                    key={b.id}
                    block={b}
                    selected={selectedId === b.id}
                    onSelect={() => onSelect(b.id)}
                    onToggle={() => toggle(b.id)}
                    onRemove={() => remove(b.id)}
                    onDuplicate={() => duplicate(b.id)}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}

function SortableBlock({
  block,
  selected,
  onSelect,
  onToggle,
  onRemove,
  onDuplicate,
}: {
  block: BlockInstance;
  selected: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onRemove: () => void;
  onDuplicate: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });
  const known = isKnownBlock(block.type);
  const label = known ? BLOCK_REGISTRY[block.type].label : block.type;
  const hidden = block.visible === false;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : hidden ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`flex items-center gap-2 p-3 rounded-lg border bg-background cursor-pointer transition-colors ${
        selected ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/40"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
        aria-label="سحب"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{label}</div>
        <div className="text-xs text-muted-foreground font-mono truncate">{block.type}</div>
      </div>
      <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon" onClick={onToggle} title={hidden ? "إظهار" : "إخفاء"}>
          {hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={onDuplicate} title="نسخ">
          <Copy className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onRemove} title="حذف">
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </div>
    </li>
  );
}
