import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Lock, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Admin · Login" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("تم إنشاء الحساب! جاري تسجيل الدخول...");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("مرحباً بك");
      }
      navigate({ to: "/admin" });
    } catch (err: any) {
      toast.error(err.message ?? "حدث خطأ");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-2xl border-border/60">
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <p className="text-sm text-muted-foreground">
            {mode === "signin" ? "سجّل الدخول للمتابعة" : "إنشاء حساب جديد"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                required
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pr-10"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
            {mode === "signin" ? "تسجيل الدخول" : "إنشاء حساب"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-primary hover:underline"
          >
            {mode === "signin" ? "إنشاء حساب جديد" : "لدي حساب بالفعل"}
          </button>
        </div>

        <div className="text-center text-xs text-muted-foreground border-t pt-4">
          <Link to="/{-$locale}" params={{ locale: "ar" }} className="hover:text-foreground">
            ← العودة إلى الموقع
          </Link>
        </div>
      </Card>
    </div>
  );
}
