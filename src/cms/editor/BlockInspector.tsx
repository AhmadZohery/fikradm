import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BLOCK_REGISTRY, isKnownBlock, type BlockInstance } from "@/cms/blocks/registry";
import { RichTextEditor } from "./RichTextEditor";

type Props = {
  block: BlockInstance | null;
  onChange: (next: BlockInstance) => void;
};

export function BlockInspector({ block, onChange }: Props) {
  if (!block) {
    return (
      <div className="p-6 text-sm text-muted-foreground text-center">
        اختر بلوك من الـ canvas لعرض إعداداته
      </div>
    );
  }

  const known = isKnownBlock(block.type);
  const label = known ? BLOCK_REGISTRY[block.type].label : block.type;
  const settings = block.settings ?? {};

  function setSettings(patch: Partial<NonNullable<BlockInstance["settings"]>>) {
    onChange({ ...block!, settings: { ...settings, ...patch } });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <div className="text-xs text-muted-foreground">البلوك المحدد</div>
        <div className="font-semibold text-sm truncate">{label}</div>
        <div className="text-xs font-mono text-muted-foreground truncate">{block.type}</div>
      </div>
      <Tabs defaultValue="content" className="flex-1 flex flex-col">
        <TabsList className="m-3 mb-0 grid grid-cols-3">
          <TabsTrigger value="content" className="text-xs">المحتوى</TabsTrigger>
          <TabsTrigger value="style" className="text-xs">التنسيق</TabsTrigger>
          <TabsTrigger value="visibility" className="text-xs">الظهور</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <TabsContent value="content" className="space-y-3 mt-0">
            {block.type === "rich_text" ? (
              <div className="space-y-3">
                <Label className="text-xs">المحتوى</Label>
                <RichTextEditor
                  value={(block.data?.html as string) ?? ""}
                  onChange={(html) =>
                    onChange({ ...block, data: { ...(block.data ?? {}), html } })
                  }
                  placeholder="ابدأ الكتابة هنا..."
                  minHeight={260}
                />
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">العرض</Label>
                    <Select
                      value={(block.data?.container as string) ?? "default"}
                      onValueChange={(v) =>
                        onChange({ ...block, data: { ...(block.data ?? {}), container: v } })
                      }
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="narrow">ضيق</SelectItem>
                        <SelectItem value="default">افتراضي</SelectItem>
                        <SelectItem value="wide">واسع</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">المحاذاة</Label>
                    <Select
                      value={(block.data?.align as string) ?? "right"}
                      onValueChange={(v) =>
                        onChange({ ...block, data: { ...(block.data ?? {}), align: v } })
                      }
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="right">يمين</SelectItem>
                        <SelectItem value="center">وسط</SelectItem>
                        <SelectItem value="left">يسار</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground p-3 bg-muted/40 rounded-md leading-relaxed">
                💡 هذا البلوك يستخدم بياناته الافتراضية من الكود. حقول التحرير المخصصة لكل بلوك هتتفعل تدريجياً.
                ضيف بلوك "نص حر (Rich Text)" من المكتبة لتحرير محتوى نصي حر.
              </p>
            )}
          </TabsContent>

          <TabsContent value="style" className="space-y-4 mt-0">
            <div className="space-y-1.5">
              <Label className="text-xs">المسافة العمودية</Label>
              <Select
                value={settings.paddingY ?? "md"}
                onValueChange={(v) => setSettings({ paddingY: v as never })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون</SelectItem>
                  <SelectItem value="sm">صغيرة</SelectItem>
                  <SelectItem value="md">متوسطة</SelectItem>
                  <SelectItem value="lg">كبيرة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">الخلفية</Label>
              <Select
                value={settings.background ?? "default"}
                onValueChange={(v) => setSettings({ background: v as never })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">افتراضية</SelectItem>
                  <SelectItem value="muted">رمادية خفيفة</SelectItem>
                  <SelectItem value="primary">لون أساسي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">عرض الحاوية</Label>
              <Select
                value={settings.container ?? "default"}
                onValueChange={(v) => setSettings({ container: v as never })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="narrow">ضيق</SelectItem>
                  <SelectItem value="default">افتراضي</SelectItem>
                  <SelectItem value="wide">واسع</SelectItem>
                  <SelectItem value="full">كامل العرض</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-[11px] text-muted-foreground">
              ⚠ إعدادات الـ wrapper هتتطبق فعلياً لما نضيف الـ wrapper في BlockRenderer (Phase 3.1).
            </p>
          </TabsContent>

          <TabsContent value="visibility" className="space-y-4 mt-0">
            <div className="flex items-center justify-between">
              <Label className="text-sm">إظهار البلوك</Label>
              <Switch
                checked={block.visible !== false}
                onCheckedChange={(v) => onChange({ ...block!, visible: v })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">معرّف البلوك (ID)</Label>
              <Input value={block.id} readOnly className="font-mono text-xs" />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
