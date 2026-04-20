import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
});

type Row = { user_id: string; role: string; created_at: string };

function UsersPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("user_roles")
      .select("user_id, role, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setRows((data ?? []) as Row[]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">المستخدمين والصلاحيات</h1>
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-right">
            <tr>
              <th className="p-3 font-medium">User ID</th>
              <th className="p-3 font-medium">الصلاحية</th>
              <th className="p-3 font-medium">تاريخ الإنشاء</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="p-6 text-center text-muted-foreground">جاري التحميل...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={3} className="p-6 text-center text-muted-foreground">لا يوجد مستخدمون</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={`${r.user_id}-${r.role}`} className="border-t">
                  <td className="p-3 font-mono text-xs">{r.user_id.slice(0, 8)}…</td>
                  <td className="p-3">
                    <Badge variant={r.role === "admin" ? "default" : "secondary"}>{r.role}</Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString("ar-EG")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
