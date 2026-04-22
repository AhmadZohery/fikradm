import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Trash2, Plus, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
});

type Role = "admin" | "editor" | "viewer";
type UserRow = {
  id: string;
  email: string | null;
  role: Role;
  created_at: string;
  last_sign_in_at: string | null;
};

async function callAdminUsers<T = unknown>(payload: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke<T>("admin-users", { body: payload });
  if (error) throw new Error(error.message);
  if (data && typeof data === "object" && "error" in (data as Record<string, unknown>)) {
    throw new Error((data as { error: string }).error);
  }
  return data as T;
}

function UsersPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("editor");
  const [inviting, setInviting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await callAdminUsers<{ users: UserRow[] }>({ action: "list" });
      setRows(data.users ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذّر تحميل المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const updateRole = async (user: UserRow, role: Role) => {
    setBusyId(user.id);
    try {
      await callAdminUsers({ action: "update_role", user_id: user.id, role });
      toast.success("تم تحديث الصلاحية");
      setRows((prev) => prev.map((r) => (r.id === user.id ? { ...r, role } : r)));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل التحديث");
    } finally {
      setBusyId(null);
    }
  };

  const removeUser = async (user: UserRow) => {
    if (!confirm(`حذف المستخدم ${user.email ?? user.id}؟`)) return;
    setBusyId(user.id);
    try {
      await callAdminUsers({ action: "delete", user_id: user.id });
      toast.success("تم الحذف");
      setRows((prev) => prev.filter((r) => r.id !== user.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل الحذف");
    } finally {
      setBusyId(null);
    }
  };

  const invite = async () => {
    if (!inviteEmail.includes("@")) {
      toast.error("بريد غير صالح");
      return;
    }
    setInviting(true);
    try {
      await callAdminUsers({ action: "invite", email: inviteEmail.trim(), role: inviteRole });
      toast.success("تم إرسال الدعوة");
      setInviteOpen(false);
      setInviteEmail("");
      setInviteRole("editor");
      void load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل إرسال الدعوة");
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">المستخدمين والصلاحيات</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            ادعُ مستخدمين جدد، عدّل صلاحياتهم (admin / editor / viewer)، أو احذفهم بأمان.
          </p>
        </div>
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="ms-2 h-4 w-4" />
              مستخدم جديد
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>دعوة مستخدم جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>البريد الإلكتروني</Label>
                <Input
                  dir="ltr"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="user@domain.com"
                />
              </div>
              <div>
                <Label>الصلاحية</Label>
                <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as Role)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">admin — صلاحية كاملة</SelectItem>
                    <SelectItem value="editor">editor — تحرير المحتوى</SelectItem>
                    <SelectItem value="viewer">viewer — قراءة فقط</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={invite} disabled={inviting}>
                {inviting && <Loader2 className="ms-2 h-4 w-4 animate-spin" />}
                <Mail className="ms-2 h-4 w-4" />
                إرسال الدعوة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-right">
            <tr>
              <th className="p-3 font-medium">البريد</th>
              <th className="p-3 font-medium">الصلاحية</th>
              <th className="p-3 font-medium">آخر دخول</th>
              <th className="p-3 text-end font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  <Loader2 className="ms-2 inline h-4 w-4 animate-spin" /> تحميل...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  لا يوجد مستخدمون
                </td>
              </tr>
            ) : (
              rows.map((u) => (
                <tr key={u.id} className="border-t hover:bg-muted/20">
                  <td className="p-3">
                    <div className="font-medium" dir="ltr">
                      {u.email ?? "—"}
                    </div>
                    <div className="font-mono text-[11px] text-muted-foreground" dir="ltr">
                      {u.id.slice(0, 8)}…
                    </div>
                  </td>
                  <td className="p-3">
                    <Select
                      value={u.role}
                      disabled={busyId === u.id}
                      onValueChange={(v) => updateRole(u, v as Role)}
                    >
                      <SelectTrigger className="h-8 w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">admin</SelectItem>
                        <SelectItem value="editor">editor</SelectItem>
                        <SelectItem value="viewer">viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {u.last_sign_in_at
                      ? new Date(u.last_sign_in_at).toLocaleString("ar-EG")
                      : "—"}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={busyId === u.id}
                        onClick={() => removeUser(u)}
                      >
                        {busyId === u.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-destructive" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      <Card className="p-4 text-xs leading-6 text-muted-foreground">
        <Badge variant="secondary" className="ms-2">ملاحظة</Badge>
        المستخدمون المدعوون يستلمون رسالة بريد إلكتروني لتعيين كلمة السر. لو ما وصلتش
        يفضل التحقق من spam folder أو إعدادات SMTP.
      </Card>
    </div>
  );
}
