import { useState } from "react";
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  buildTemplateCsv,
  downloadTemplate,
  mapRow,
  parseCsvFile,
  validateRow,
  type CsvRow,
  type ImportColumn,
} from "./csvImport";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  columns: ImportColumn[];
  templateExample?: CsvRow;
  templateFilename?: string;
  onImport: (rows: Record<string, unknown>[]) => Promise<{ inserted: number; failed: number }>;
  onDone?: () => void;
};

type ParsedRow = { raw: CsvRow; mapped: Record<string, unknown>; ok: boolean; errors: string[] };

export function BulkImportDialog({
  open,
  onClose,
  title,
  description,
  columns,
  templateExample,
  templateFilename = "import-template.csv",
  onImport,
  onDone,
}: Props) {
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [filename, setFilename] = useState<string | null>(null);

  const reset = () => {
    setRows([]);
    setFilename(null);
  };

  const handleFile = async (file: File) => {
    try {
      const parsed = await parseCsvFile(file);
      const next: ParsedRow[] = parsed.map((raw) => {
        const v = validateRow(raw, columns);
        return { raw, mapped: mapRow(raw, columns), ok: v.ok, errors: v.errors };
      });
      setRows(next);
      setFilename(file.name);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل قراءة الملف");
    }
  };

  const okRows = rows.filter((r) => r.ok);
  const badRows = rows.filter((r) => !r.ok);

  const runImport = async () => {
    if (!okRows.length) return;
    setImporting(true);
    try {
      const res = await onImport(okRows.map((r) => r.mapped));
      toast.success(`تم استيراد ${res.inserted} صف${res.failed ? ` — فشل ${res.failed}` : ""}`);
      onDone?.();
      reset();
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل الاستيراد");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && (reset(), onClose())}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" /> {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="flex flex-col gap-3 overflow-y-auto">
          <Card className="p-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="text-sm">
              <div className="font-medium">قالب الاستيراد</div>
              <div className="text-xs text-muted-foreground">حمّل قالب CSV جاهز ثم املأه وارفعه. القوائم تُفصل بـ <span className="font-mono">|</span></div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadTemplate(templateFilename, buildTemplateCsv(columns, templateExample))}
            >
              <Download className="w-4 h-4 ml-1" /> تحميل القالب
            </Button>
          </Card>

          <Card className="p-3">
            <div className="text-sm font-medium mb-2">الأعمدة المطلوبة</div>
            <div className="flex flex-wrap gap-1.5">
              {columns.map((c) => (
                <Badge key={c.key} variant={c.required ? "default" : "secondary"} className="text-[10px]">
                  {c.key}
                  {c.required && " *"}
                </Badge>
              ))}
            </div>
          </Card>

          <label className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/30 transition-colors">
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleFile(f);
              }}
            />
            <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-1.5" />
            <div className="text-sm font-medium">{filename ?? "اختر ملف CSV"}</div>
            <div className="text-xs text-muted-foreground mt-0.5">UTF-8 — أول صف عناوين الأعمدة</div>
          </label>

          {rows.length > 0 && (
            <Card className="p-3 space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" /> {okRows.length} صالح
                </span>
                {badRows.length > 0 && (
                  <span className="flex items-center gap-1 text-amber-600">
                    <AlertTriangle className="w-4 h-4" /> {badRows.length} به أخطاء
                  </span>
                )}
              </div>
              {badRows.length > 0 && (
                <div className="text-xs space-y-1 max-h-40 overflow-y-auto">
                  {badRows.slice(0, 10).map((r, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <span className="text-muted-foreground">صف {rows.indexOf(r) + 2}:</span>
                      <span className="text-amber-600">{r.errors.join("، ")}</span>
                    </div>
                  ))}
                  {badRows.length > 10 && <div className="text-muted-foreground">… و{badRows.length - 10} صف آخر</div>}
                </div>
              )}
            </Card>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => (reset(), onClose())}>إلغاء</Button>
          <Button onClick={runImport} disabled={!okRows.length || importing}>
            {importing && <Loader2 className="w-4 h-4 ml-1 animate-spin" />}
            استيراد {okRows.length} صف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}