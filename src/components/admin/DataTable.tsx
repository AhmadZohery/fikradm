import { useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, ArrowUp, ArrowDown, ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export type Column<T> = {
  key: string;
  label: string;
  /** Cell renderer. */
  render: (row: T) => ReactNode;
  /** Sortable accessor; if omitted, column is not sortable. */
  sort?: (row: T) => string | number | null | undefined;
  className?: string;
  /** Hide on mobile. */
  hideOnMobile?: boolean;
};

type Props<T> = {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  /** Optional global text accessor for the search box. */
  searchAccessor?: (row: T) => string;
  searchPlaceholder?: string;
  /** Bulk actions appear when selection > 0. */
  bulkActions?: (selectedIds: string[], clearSelection: () => void) => ReactNode;
  /** Filter buttons row (status, etc.) */
  toolbar?: ReactNode;
  /** Trailing buttons next to search (e.g., "Create new"). */
  trailing?: ReactNode;
  pageSize?: number;
  emptyMessage?: string;
};

/**
 * Reusable admin table with search, sort, pagination, and bulk selection.
 * Mobile-aware: columns flagged with `hideOnMobile` collapse to truncated rows.
 */
export function DataTable<T>({
  rows,
  columns,
  rowKey,
  searchAccessor,
  searchPlaceholder = "بحث…",
  bulkActions,
  toolbar,
  trailing,
  pageSize = 20,
  emptyMessage = "لا توجد عناصر",
}: Props<T>) {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    if (!q.trim() || !searchAccessor) return rows;
    const ql = q.toLowerCase();
    return rows.filter((r) => searchAccessor(r).toLowerCase().includes(ql));
  }, [rows, q, searchAccessor]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sort) return filtered;
    const arr = [...filtered].sort((a, b) => {
      const av = col.sort!(a);
      const bv = col.sort!(b);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") return av - bv;
      return String(av).localeCompare(String(bv));
    });
    return sortDir === "asc" ? arr : arr.reverse();
  }, [filtered, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);
  const allOnPageSelected = pageRows.length > 0 && pageRows.every((r) => selected.has(rowKey(r)));

  const toggleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
    }
  };

  const togglePageSelection = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) pageRows.forEach((r) => next.delete(rowKey(r)));
      else pageRows.forEach((r) => next.add(rowKey(r)));
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());
  const selectedIds = [...selected];

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {toolbar}
        </div>
        <div className="flex items-center gap-2">
          {searchAccessor && (
            <div className="relative">
              <Search className="pointer-events-none absolute start-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1); }}
                placeholder={searchPlaceholder}
                className="h-8 w-44 sm:w-56 ps-7"
              />
            </div>
          )}
          {trailing}
        </div>
      </div>

      {/* Bulk actions bar */}
      {bulkActions && selectedIds.length > 0 && (
        <div className="flex items-center gap-2 rounded-md border bg-primary/5 px-3 py-2 text-sm">
          <span className="font-medium">{selectedIds.length} محدد</span>
          <span className="text-muted-foreground">·</span>
          <div className="flex items-center gap-1.5">
            {bulkActions(selectedIds, clearSelection)}
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs ms-auto" onClick={clearSelection}>
            إلغاء التحديد
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-md overflow-x-auto bg-background">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-right">
            <tr>
              {bulkActions && (
                <th className="p-3 w-10">
                  <Checkbox
                    checked={allOnPageSelected}
                    onCheckedChange={togglePageSelection}
                    aria-label="تحديد الكل"
                  />
                </th>
              )}
              {columns.map((c) => {
                const isSorted = sortKey === c.key;
                return (
                  <th
                    key={c.key}
                    className={`p-3 font-medium text-xs uppercase tracking-wide text-muted-foreground ${c.hideOnMobile ? "hidden md:table-cell" : ""} ${c.className ?? ""}`}
                  >
                    {c.sort ? (
                      <button
                        onClick={() => toggleSort(c.key)}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        {c.label}
                        {isSorted ? (
                          sortDir === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3 opacity-40" />
                        )}
                      </button>
                    ) : (
                      c.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (bulkActions ? 1 : 0)} className="p-8 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pageRows.map((row) => {
                const id = rowKey(row);
                const isSelected = selected.has(id);
                return (
                  <tr
                    key={id}
                    className={`border-t transition-colors ${isSelected ? "bg-primary/5" : "hover:bg-muted/30"}`}
                  >
                    {bulkActions && (
                      <td className="p-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => {
                            setSelected((prev) => {
                              const next = new Set(prev);
                              if (next.has(id)) next.delete(id); else next.add(id);
                              return next;
                            });
                          }}
                          aria-label="تحديد الصف"
                        />
                      </td>
                    )}
                    {columns.map((c) => (
                      <td key={c.key} className={`p-3 ${c.hideOnMobile ? "hidden md:table-cell" : ""} ${c.className ?? ""}`}>
                        {c.render(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {sorted.length > pageSize && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, sorted.length)} من {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled={safePage === 1} onClick={() => setPage(safePage - 1)} className="h-7 px-2">
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
            <span className="px-2">{safePage} / {totalPages}</span>
            <Button variant="outline" size="sm" disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)} className="h-7 px-2">
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}