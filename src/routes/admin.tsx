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
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
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
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const navItems = [
  { to: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, exact: true },
  { to: "/admin/pages", label: "الصفحات", icon: FileText },
  { to: "/admin/media", label: "مكتبة الوسائط", icon: ImageIcon },
  { to: "/admin/forms", label: "الرسائل", icon: Inbox },
  { to: "/admin/users", label: "المستخدمين", icon: Users },
  { to: "/admin/settings", label: "الإعدادات", icon: Settings },
];

function AdminLayout() {
  const { user, isStaff, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);

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

  if (!isStaff) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-destructive/10 text-destructive grid place-items-center">!</div>
          <h1 className="text-xl font-bold">لا توجد لديك صلاحية وصول</h1>
          <p className="text-sm text-muted-foreground">
            حسابك ({user.email}) ليس لديه دور admin أو editor. تواصل مع المسؤول لمنحك الصلاحية، أو سجّل خروج وادخل بحساب آخر.
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
            <SidebarGroup>
              <SidebarGroupLabel>الإدارة</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => {
                    const active = item.exact
                      ? location.pathname === item.to
                      : location.pathname.startsWith(item.to);
                    return (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton asChild isActive={active}>
                          <Link to={item.to}>
                            <item.icon className="w-4 h-4" />
                            <span className="flex-1">{item.label}</span>
                            {item.to === "/admin/forms" && unread > 0 && (
                              <Badge className="bg-primary text-primary-foreground h-5 px-1.5 text-[10px]">
                                {unread}
                              </Badge>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
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
          <header className="h-14 border-b bg-background flex items-center px-4 gap-2 sticky top-0 z-10">
            <SidebarTrigger />
            <div className="flex-1" />
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
