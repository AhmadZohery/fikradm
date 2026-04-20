import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Eye,
  Loader2,
  Monitor,
  Redo2,
  Save,
  Smartphone,
  Tablet,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Device = "desktop" | "tablet" | "mobile";

type Props = {
  title: string;
  status: string;
  previewUrl: string;
  device: Device;
  onDeviceChange: (d: Device) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  saving: boolean;
  dirty: boolean;
  lastSavedAt: number | null;
};

export function EditorToolbar(p: Props) {
  return (
    <div className="border-b bg-background px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-3 min-w-0">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/admin/pages">
            <ArrowLeft className="w-4 h-4 ml-1" />
            الصفحات
          </Link>
        </Button>
        <div className="min-w-0">
          <div className="font-semibold text-sm truncate">{p.title}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-2" dir="ltr">
            <span className="font-mono">{p.previewUrl}</span>
            <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{p.status}</Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 border rounded-md p-0.5">
        <Button
          variant={p.device === "desktop" ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => p.onDeviceChange("desktop")}
          title="ديسكتوب"
        >
          <Monitor className="w-4 h-4" />
        </Button>
        <Button
          variant={p.device === "tablet" ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => p.onDeviceChange("tablet")}
          title="تابلت"
        >
          <Tablet className="w-4 h-4" />
        </Button>
        <Button
          variant={p.device === "mobile" ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => p.onDeviceChange("mobile")}
          title="موبايل"
        >
          <Smartphone className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5 border rounded-md p-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={p.onUndo}
            disabled={!p.canUndo}
            title="تراجع"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={p.onRedo}
            disabled={!p.canRedo}
            title="إعادة"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>
        <span className="text-[11px] text-muted-foreground hidden md:inline">
          {p.saving
            ? "جاري الحفظ..."
            : p.dirty
              ? "تغييرات غير محفوظة"
              : p.lastSavedAt
                ? `محفوظ ${formatTime(p.lastSavedAt)}`
                : "محفوظ"}
        </span>
        <Button variant="outline" size="sm" asChild>
          <a href={p.previewUrl} target="_blank" rel="noreferrer">
            <Eye className="w-4 h-4 ml-1" /> معاينة
          </a>
        </Button>
        <Button onClick={p.onSave} disabled={p.saving || !p.dirty} size="sm">
          {p.saving ? (
            <Loader2 className="w-4 h-4 ml-1 animate-spin" />
          ) : (
            <Save className="w-4 h-4 ml-1" />
          )}
          حفظ
        </Button>
      </div>
    </div>
  );
}

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
}
