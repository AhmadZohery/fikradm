import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, FileText, Briefcase, Building2, Newspaper, Image as ImageIcon, Settings, Users, Inbox, MapPin, Package, LayoutDashboard, SearchCheck } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Action = {
  label: string;
  hint?: string;
  to: string;
  icon: typeof Search;
  group: "تنقل" | "إنشاء" | "إدارة";
};

const ACTIONS: Action[] = [
  { label: "لوحة التحكم", to: "/admin", icon: LayoutDashboard, group: "تنقل" },
  { label: "الصفحات", to: "/admin/pages", icon: FileText, group: "تنقل" },
  { label: "المقالات", to: "/admin/blog", icon: Newspaper, group: "تنقل" },
  { label: "الخدمات", to: "/admin/services", icon: Briefcase, group: "تنقل" },
  { label: "الصناعات", to: "/admin/industries", icon: Building2, group: "تنقل" },
  { label: "المواقع", to: "/admin/locations", icon: MapPin, group: "تنقل" },
  { label: "الباقات", to: "/admin/packages", icon: Package, group: "تنقل" },
  { label: "مكتبة الوسائط", to: "/admin/media", icon: ImageIcon, group: "تنقل" },
  { label: "الرسائل والاستفسارات", to: "/admin/forms", icon: Inbox, group: "تنقل" },
  { label: "فحص SEO", to: "/admin/seo-audit", icon: SearchCheck, group: "تنقل" },
  { label: "المستخدمين", to: "/admin/users", icon: Users, group: "إدارة" },
  { label: "إعدادات الموقع", to: "/admin/settings", icon: Settings, group: "إدارة" },
  { label: "صفحة جديدة", hint: "Pages → جديد", to: "/admin/pages", icon: FileText, group: "إنشاء" },
  { label: "مقال جديد", hint: "Blog → جديد", to: "/admin/blog", icon: Newspaper, group: "إنشاء" },
];

/**
 * Cmd+K command palette for the admin panel. Quick navigation across
 * all admin sections + create shortcuts. Keyboard-first.
 */
export function AdminCommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return ACTIONS;
    return ACTIONS.filter((a) => a.label.toLowerCase().includes(ql) || a.hint?.toLowerCase().includes(ql));
  }, [q]);

  useEffect(() => {
    if (!open) return;
    setQ("");
    setActive(0);
  }, [open]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
      else if (e.key === "Enter") {
        const sel = filtered[active];
        if (sel) { navigate({ to: sel.to }); onClose(); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, filtered, active, navigate, onClose]);

  const groups = useMemo(() => {
    const out = new Map<string, Action[]>();
    filtered.forEach((a) => {
      const arr = out.get(a.group) ?? [];
      arr.push(a);
      out.set(a.group, arr);
    });
    return [...out.entries()];
  }, [filtered]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="p-0 overflow-hidden max-w-xl gap-0" dir="rtl">
        <DialogTitle className="sr-only">بحث سريع في لوحة التحكم</DialogTitle>
        <div className="flex items-center gap-2 border-b px-3 py-2.5">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="بحث: صفحات، مقالات، إعدادات…"
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <kbd className="hidden md:inline-flex text-[10px] bg-muted px-1.5 py-0.5 rounded border">ESC</kbd>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground p-6 text-center">لا نتائج</div>
          ) : (
            groups.map(([group, items]) => (
              <div key={group} className="mb-2">
                <div className="text-[10px] uppercase font-semibold text-muted-foreground px-2 mb-1">{group}</div>
                {items.map((a) => {
                  const idx = filtered.indexOf(a);
                  const isActive = idx === active;
                  return (
                    <button
                      key={a.to + a.label}
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => { navigate({ to: a.to }); onClose(); }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-right transition-colors ${
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      <a.icon className="w-4 h-4" />
                      <span className="flex-1">{a.label}</span>
                      {a.hint && <span className={`text-[10px] ${isActive ? "opacity-80" : "text-muted-foreground"}`}>{a.hint}</span>}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
        <div className="border-t px-3 py-2 text-[10px] text-muted-foreground flex items-center justify-between bg-muted/30">
          <span>↑↓ للتنقل · Enter للفتح</span>
          <span>⌘K للفتح بأي وقت</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}