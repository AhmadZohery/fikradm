import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Inbox,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Package,
  Briefcase,
  Building2,
  MapPin,
  Newspaper,
  SearchCheck,
  GripVertical,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import {
  DndContext,
  closestCenter,
  PointerSensor,
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

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean; group: "main" | "content" | "system" };

const NAV_ITEMS: NavItem[] = [
  { to: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, exact: true, group: "main" },
  { to: "/admin/pages", label: "الصفحات", icon: FileText, group: "content" },
  { to: "/admin/packages", label: "الباقات", icon: Package, group: "content" },
  { to: "/admin/services", label: "الخدمات", icon: Briefcase, group: "content" },
  { to: "/admin/industries", label: "الصناعات", icon: Building2, group: "content" },
  { to: "/admin/locations", label: "المواقع", icon: MapPin, group: "content" },
  { to: "/admin/blog", label: "المدونة", icon: Newspaper, group: "content" },
  { to: "/admin/media", label: "مكتبة الوسائط", icon: ImageIcon, group: "content" },
  { to: "/admin/seo-audit", label: "فحص SEO", icon: SearchCheck, group: "system" },
  { to: "/admin/forms", label: "الرسائل", icon: Inbox, group: "system" },
  { to: "/admin/users", label: "المستخدمين", icon: Users, group: "system" },
  { to: "/admin/settings", label: "الإعدادات", icon: Settings, group: "system" },
];

const NAV_ORDER_KEY = "fikra:admin:nav_order:v1";

function loadNavOrder(): string[] {
  if (typeof window === "undefined") return NAV_ITEMS.map((n) => n.to);
  try {
    const raw = window.localStorage.getItem(NAV_ORDER_KEY);
    if (!raw) return NAV_ITEMS.map((n) => n.to);
    const arr = JSON.parse(raw) as string[];
    const known = new Set(NAV_ITEMS.map((n) => n.to));
    const filtered = arr.filter((to) => known.has(to));
    NAV_ITEMS.forEach((n) => { if (!filtered.includes(n.to)) filtered.push(n.to); });
    return filtered;
  } catch {
    return NAV_ITEMS.map((n) => n.to);
  }
}

function SortableNavItem({
  item,
  active,
  unread,
}: {
  item: NavItem;
  active: boolean;
  unread: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.to,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <SidebarMenuItem ref={setNodeRef} style={style} className="group/nav">
      <SidebarMenuButton asChild isActive={active}>
        <Link to={item.to} className="transition-all duration-200 hover:translate-x-0.5 rtl:hover:-translate-x-0.5">
          <span
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing opacity-0 group-hover/nav:opacity-60 transition-opacity"
            onClick={(e) => e.preventDefault()}
            aria-label="إعادة ترتيب"
          >
            <GripVertical className="w-3 h-3" />
          </span>
          <item.icon className="w-4 h-4" />
          <span className="flex-1">{item.label}</span>
          {unread > 0 && (
            <Badge className="bg-primary text-primary-foreground h-5 px-1.5 text-[10px] animate-scale-in">
              {unread}
            </Badge>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function AdminLayout() {
  const { user, isStaff, loading } = useAuth();
  const { isAdmin, isViewer, canAccessAdmin } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);
  const [navOrder, setNavOrder] = useState<string[]>(() => loadNavOrder());
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const visibleItems = NAV_ITEMS.filter((i) => {
    // Only admins see Users + Settings
    if (i.to === "/admin/users" || i.to === "/admin/settings") return isAdmin;
    return true;
  });
  const visibleSet = new Set(visibleItems.map((i) => i.to));
  const orderedItems = navOrder
    .filter((to) => visibleSet.has(to))
    .map((to) => NAV_ITEMS.find((n) => n.to === to))
    .filter((x): x is NavItem => !!x);
  const grouped = {
    main: orderedItems.filter((i) => i.group === "main"),
    content: orderedItems.filter((i) => i.group === "content"),
    system: orderedItems.filter((i) => i.group === "system"),
  };
  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setNavOrder((prev) => {
      const oldIdx = prev.indexOf(String(active.id));
      const newIdx = prev.indexOf(String(over.id));
      if (oldIdx < 0 || newIdx < 0) return prev;
      const next = arrayMove(prev, oldIdx, newIdx);
      try { window.localStorage.setItem(NAV_ORDER_KEY, JSON.stringify(next)); } catch { /* noop */ }
      return next;
    });
  };

  const isLoginRoute = location.pathname === "/admin/login";

  useEffect(() => {
    if (isLoginRoute) return;
    if (loading) return;
    if (!user) {
      navigate({ to: "/admin/login" });
      return;
    }
  }, [user, isStaff, loading, navigate, isLoginRoute]);

  // Live unread badge
  useEffect(() => {
    if (!user || !isStaff) return;
    const fetchCount = async () => {
      const { count } = await supabase
        .from("form_submissions")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false)
        .eq("is_archived", false);
      setUnread(count ?? 0);
    };
    fetchCount();
    const channel = supabase
      .channel("admin_unread_badge")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "form_submissions" },
        () => { fetchCount(); },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, isStaff]);

  // Login page is rendered standalone (no sidebar / no auth gate).
  if (isLoginRoute) return <Outlet />;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground text-sm">جاري التحميل...</div>
      </div>
    );
  }

  if (!user) return null; // navigation kicks in

  if (!canAccessAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-destructive/10 text-destructive grid place-items-center">!</div>
          <h1 className="text-xl font-bold">لا توجد لديك صلاحية وصول</h1>
          <p className="text-sm text-muted-foreground">
            حسابك ({user.email}) لا يملك أي صلاحية. تواصل مع المسؤول لمنحك دور viewer / editor / admin.
          </p>
          <Button
            variant="outline"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/admin/login" });
            }}
          >
            تسجيل الخروج
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/20" dir="rtl">
        <Sidebar side="right" collapsible="icon">
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-2 py-2">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                ف
              </div>
              <div className="font-semibold">فكرة CMS</div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              {(["main", "content", "system"] as const).map((g) => (
                <SidebarGroup key={g}>
                  <SidebarGroupLabel className="flex items-center gap-1.5">
                    {g === "main" && <><Sparkles className="w-3 h-3" /> الرئيسية</>}
                    {g === "content" && <>المحتوى</>}
                    {g === "system" && <>النظام</>}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SortableContext items={grouped[g].map((i) => i.to)} strategy={verticalListSortingStrategy}>
                        {grouped[g].map((item) => {
                          const active = item.exact
                            ? location.pathname === item.to
                            : location.pathname.startsWith(item.to);
                          return (
                            <SortableNavItem
                              key={item.to}
                              item={item}
                              active={active}
                              unread={item.to === "/admin/forms" ? unread : 0}
                            />
                          );
                        })}
                      </SortableContext>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </DndContext>
          </SidebarContent>
          <SidebarFooter className="border-t">
            <div className="px-2 py-2 space-y-2">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                عرض الموقع
              </a>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
              <div className="flex items-center gap-1.5">
                <Badge
                  variant={isAdmin ? "default" : isViewer ? "outline" : "secondary"}
                  className="text-[10px]"
                >
                  {isAdmin ? "admin" : isViewer ? "viewer" : "editor"}
                </Badge>
                {isViewer && (
                  <span className="text-[10px] text-muted-foreground">قراءة فقط</span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate({ to: "/admin/login" });
                }}
              >
                <LogOut className="w-4 h-4 ml-2" />
                تسجيل الخروج
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <AdminTopbar
            email={user.email ?? ""}
            role={isAdmin ? "admin" : isViewer ? "viewer" : "editor"}
            unread={unread}
          />
          <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
