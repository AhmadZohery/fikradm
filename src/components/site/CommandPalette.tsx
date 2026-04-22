import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, X, FileText, Briefcase, Factory, Newspaper, Globe, ArrowUpRight, CornerDownLeft } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import { buildIndex, searchIndex, type SearchHit } from "@/lib/searchIndex";

const TYPE_META: Record<SearchHit["type"], { icon: typeof Search; labelAr: string; labelEn: string; color: string }> = {
  service:       { icon: Briefcase,  labelAr: "خدمة",       labelEn: "Service",     color: "text-primary bg-primary/10" },
  "sub-service": { icon: Briefcase,  labelAr: "خدمة فرعية", labelEn: "Sub-service", color: "text-primary bg-primary/10" },
  industry:      { icon: Factory,    labelAr: "صناعة",      labelEn: "Industry",    color: "text-amber-600 bg-amber-500/10" },
  "sub-industry":{ icon: Factory,    labelAr: "تخصص",       labelEn: "Niche",       color: "text-amber-600 bg-amber-500/10" },
  blog:          { icon: Newspaper,  labelAr: "مقال",       labelEn: "Article",     color: "text-emerald-600 bg-emerald-500/10" },
  page:          { icon: Globe,      labelAr: "صفحة",       labelEn: "Page",        color: "text-blue-600 bg-blue-500/10" },
};

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { locale, buildHref } = useLocale();
  const navigate = useNavigate();
  const isAr = locale === "ar";
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const index = useMemo(() => buildIndex(locale), [locale]);
  const results = useMemo(() => searchIndex(index, q, 20), [index, q]);

  // Suggested when empty
  const suggested = useMemo(() => index.filter((h) => h.type === "service" || h.type === "blog").slice(0, 6), [index]);
  const list = q.trim() ? results : suggested;

  useEffect(() => { if (open) setQ(""); setActive(0); }, [open]);
  useEffect(() => { setActive(0); }, [q]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, list.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      if (e.key === "Enter") {
        const sel = list[active];
        if (sel) { onClose(); navigate({ to: buildHref(locale, sel.href) }); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, list, active, navigate, locale, buildHref, onClose]);

  if (!open) return null;

  const seeAll = () => {
    onClose();
    navigate({ to: buildHref(locale, "/search"), search: { q } as { q?: string } });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-ink/40 backdrop-blur-sm p-4 pt-[10vh] animate-fade-in"
      onClick={onClose}
      dir={isAr ? "rtl" : "ltr"}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-popover shadow-pop animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={isAr ? "ابحث في الخدمات، الصناعات، المقالات..." : "Search services, industries, articles..."}
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <button onClick={onClose} aria-label="close" className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {list.length === 0 && q.trim() && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              {isAr ? "لا توجد نتائج. جرّب كلمات أخرى." : "No results. Try other terms."}
            </div>
          )}
          {!q.trim() && (
            <div className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              {isAr ? "اقتراحات سريعة" : "Quick suggestions"}
            </div>
          )}
          <ul className="p-2">
            {list.map((hit, i) => {
              const meta = TYPE_META[hit.type];
              const Icon = meta.icon;
              return (
                <li key={hit.href + i}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => { onClose(); navigate({ to: buildHref(locale, hit.href) }); }}
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition ${
                      i === active ? "bg-accent" : "hover:bg-accent/60"
                    }`}
                  >
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${meta.color}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-foreground">{hit.title}</span>
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                          {isAr ? meta.labelAr : meta.labelEn}
                        </span>
                      </span>
                      {hit.subtitle && (
                        <span className="mt-0.5 line-clamp-1 block text-xs text-muted-foreground">
                          {hit.subtitle}
                        </span>
                      )}
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100 rtl:rotate-90" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center justify-between border-t border-border bg-surface px-4 py-2 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">↑↓</kbd> {isAr ? "تنقّل" : "Navigate"}</span>
            <span className="flex items-center gap-1"><CornerDownLeft className="h-3 w-3" /> {isAr ? "فتح" : "Open"}</span>
            <span className="flex items-center gap-1"><kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd> {isAr ? "إغلاق" : "Close"}</span>
          </div>
          {q.trim() && (
            <button onClick={seeAll} className="font-semibold text-primary hover:underline">
              {isAr ? "عرض كل النتائج →" : "See all results →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}