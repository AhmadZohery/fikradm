import { Calendar, CalendarOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type Props = {
  publishAt: string | null;
  unpublishAt: string | null;
  onChange: (next: { publishAt: string | null; unpublishAt: string | null }) => void;
  /**
   * If true, disable the publish-at field (the current item is already published
   * via a non-scheduled flow — only "hide at" is meaningful).
   */
  hidePublishAt?: boolean;
};

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 16);
}

function fromLocalInput(local: string): string | null {
  if (!local) return null;
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export function SchedulePublishField({ publishAt, unpublishAt, onChange, hidePublishAt }: Props) {
  return (
    <Card className="p-3 space-y-3">
      <div className="text-sm font-medium flex items-center gap-1.5">
        <Calendar className="w-4 h-4" /> جدولة النشر
      </div>
      {!hidePublishAt && (
        <div>
          <Label className="text-xs flex items-center gap-1">
            <Calendar className="w-3 h-3" /> ينشر تلقائياً في
          </Label>
          <Input
            type="datetime-local"
            value={toLocalInput(publishAt)}
            onChange={(e) => onChange({ publishAt: fromLocalInput(e.target.value), unpublishAt })}
          />
          <p className="text-[10px] text-muted-foreground mt-0.5">يحول العنصر إلى "منشور" تلقائياً عند الموعد.</p>
        </div>
      )}
      <div>
        <Label className="text-xs flex items-center gap-1">
          <CalendarOff className="w-3 h-3" /> يخفي تلقائياً في
        </Label>
        <Input
          type="datetime-local"
          value={toLocalInput(unpublishAt)}
          onChange={(e) => onChange({ publishAt, unpublishAt: fromLocalInput(e.target.value) })}
        />
        <p className="text-[10px] text-muted-foreground mt-0.5">يحوّل العنصر إلى مسودة في الموعد. اتركه فارغاً للنشر دائم.</p>
      </div>
    </Card>
  );
}