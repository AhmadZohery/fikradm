import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
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

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/admin/login" });
      return;
    }
    if (!isStaff) {
      // Logged in but no staff role
      navigate({ to: "/admin/login" });
    }
  }, [user, isStaff, loading, navigate]);

  if (loading || !user || !isStaff) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground text-sm">جاري التحميل...</div>
      </div>
    );
  }

  // Skip layout for the login page itself (it's a sibling route, but just in case)
  if (location.pathname === "/admin/login") return <Outlet />;

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
                            <span>{item.label}</span>
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
