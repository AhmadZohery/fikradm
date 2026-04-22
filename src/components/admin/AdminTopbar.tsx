import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Search, Bell, ExternalLink, LogOut, User, Settings, Moon, Sun, Inbox } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";
import { AdminCommandPalette } from "./AdminCommandPalette";

type Crumb = { label: string; to?: string };

const ROUTE_LABELS: Record<string, string> = {
  admin: "لوحة التحكم",
  pages: "الصفحات",
  blog: "المدونة",
  services: "الخدمات",
  industries: "الصناعات",
  locations: "المواقع",
  packages: "الباقات",
  media: "مكتبة الوسائط",
  forms: "الرسائل",
  users: "المستخدمين",
  settings: "الإعدادات",
  "seo-audit": "فحص SEO",
};

function buildCrumbs(pathname: string): Crumb[] {
  const parts = pathname.split("/").filter(Boolean);
  const out: Crumb[] = [];
  let acc = "";
  parts.forEach((p, i) => {
    acc += `/${p}`;
    const label = ROUTE_LABELS[p] ?? (p.length > 14 ? p.slice(0, 14) + "…" : p);
    out.push({ label, to: i < parts.length - 1 ? acc : undefined });
  });
  return out;
}

type Props = {
  email: string;
  role: "admin" | "editor" | "viewer";
  unread: number;
};

/**
 * Rich admin header with breadcrumbs, search (⌘K), notifications,
 * theme toggle, and user menu. Always sticky at the top.
 */
export function AdminTopbar({ email, role, unread }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });
  const crumbs = buildCrumbs(location.pathname);

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    try { window.localStorage.setItem("fikra:admin:theme", next ? "dark" : "light"); } catch { /* noop */ }
    setDark(next);
  };

  // Restore theme on mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("fikra:admin:theme");
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
        setDark(true);
      }
    } catch { /* noop */ }
  }, []);

  const initials = email
    .split("@")[0]
    .split(/[._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("") || "م";

  return (
    <>
      <header className="h-14 border-b bg-background/95 backdrop-blur flex items-center px-3 md:px-4 gap-2 sticky top-0 z-20">
        <SidebarTrigger className="md:hidden" />

        {/* Breadcrumbs */}
        <nav className="hidden md:flex items-center gap-1 text-sm text-muted-foreground min-w-0 flex-1">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1 truncate">
              {i > 0 && <span className="text-muted-foreground/50 mx-0.5">/</span>}
              {c.to ? (
                <Link to={c.to} className="hover:text-foreground transition-colors truncate">{c.label}</Link>
              ) : (
                <span className="text-foreground font-medium truncate">{c.label}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="flex-1 md:hidden" />

        {/* Search trigger (⌘K) */}
        <button
          onClick={() => setPaletteOpen(true)}
          className="hidden sm:flex items-center gap-2 h-8 px-2.5 rounded-md border bg-muted/30 hover:bg-muted text-xs text-muted-foreground transition-colors min-w-[180px]"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="flex-1 text-right">بحث سريع…</span>
          <kbd className="hidden md:inline text-[10px] bg-background border rounded px-1 py-0.5">⌘K</kbd>
        </button>
        <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setPaletteOpen(true)} aria-label="بحث">
          <Search className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Theme toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="تبديل الوضع">
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        {/* Notifications */}
        <Link to="/admin/forms" className="relative">
          <Button variant="ghost" size="icon" aria-label="الإشعارات">
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold grid place-items-center animate-pulse">
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </Button>
        </Link>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 h-9 px-1.5 rounded-md hover:bg-muted transition-colors">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground grid place-items-center text-xs font-bold">
                {initials}
              </div>
              <div className="hidden lg:block text-right leading-tight">
                <div className="text-xs font-medium truncate max-w-[140px]">{email}</div>
                <Badge variant="outline" className="text-[9px] h-3.5 px-1">{role}</Badge>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="text-xs truncate">{email}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">دور: {role}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/" target="_blank" rel="noreferrer">
                <ExternalLink className="w-3.5 h-3.5 ms-2" /> عرض الموقع
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/forms">
                <Inbox className="w-3.5 h-3.5 ms-2" /> الرسائل {unread > 0 && <Badge className="ms-auto h-4 px-1 text-[10px]">{unread}</Badge>}
              </Link>
            </DropdownMenuItem>
            {role === "admin" && (
              <DropdownMenuItem asChild>
                <Link to="/admin/settings">
                  <Settings className="w-3.5 h-3.5 ms-2" /> الإعدادات
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/admin/login" });
              }}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="w-3.5 h-3.5 ms-2" /> تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <AdminCommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}

// Re-exports kept for tree-shaking
export { User };