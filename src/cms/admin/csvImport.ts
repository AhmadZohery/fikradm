import Papa from "papaparse";

export type CsvRow = Record<string, string>;

export type ImportColumn = {
  /** Column header expected in the CSV (case-insensitive). */
  key: string;
  /** Friendly label shown in template/help. */
  label: string;
  required?: boolean;
  /** json | string[] | bool | number | string (default) */
  type?: "string" | "number" | "bool" | "list" | "json";
  hint?: string;
};

export function parseCsvFile(file: File): Promise<CsvRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      complete: (res) => resolve(res.data.filter((r) => Object.keys(r).length > 0)),
      error: (err) => reject(err),
    });
  });
}

export function buildTemplateCsv(columns: ImportColumn[], example?: CsvRow): string {
  const headers = columns.map((c) => c.key);
  const sample = headers.map((h) => example?.[h] ?? "");
  return Papa.unparse([headers, sample]);
}

export function downloadTemplate(filename: string, csv: string) {
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function coerceValue(raw: string | undefined, type: ImportColumn["type"]) {
  const v = (raw ?? "").trim();
  if (!v) return type === "list" ? [] : type === "bool" ? false : null;
  switch (type) {
    case "number": {
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    }
    case "bool":
      return /^(1|true|yes|y|نعم)$/i.test(v);
    case "list":
      // Pipe-separated to keep commas inside items working.
      return v.split("|").map((s) => s.trim()).filter(Boolean);
    case "json":
      try {
        return JSON.parse(v);
      } catch {
        return null;
      }
    default:
      return v;
  }
}

export type RowValidation = { ok: boolean; errors: string[] };

export function validateRow(row: CsvRow, columns: ImportColumn[]): RowValidation {
  const errors: string[] = [];
  for (const c of columns) {
    const v = (row[c.key] ?? "").trim();
    if (c.required && !v) errors.push(`${c.label} مطلوب`);
  }
  return { ok: errors.length === 0, errors };
}

export function mapRow(row: CsvRow, columns: ImportColumn[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const c of columns) out[c.key] = coerceValue(row[c.key], c.type);
  return out;
}