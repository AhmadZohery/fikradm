import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, FileText, Globe, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReadOnlyBanner } from "@/components/admin/PermissionGate";

export const Route = createFileRoute("/admin/pages")({
  component: PagesList,
});

type PageRow = {
  id: string;
  slug: string;
  locale: string;
  title: string;
  status: "draft" | "published" | "archived";
  page_type: string;
  updated_at: string;
};

function PagesList() {
  const [rows, setRows] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("pages")
      .select("id, slug, locale, title, status, page_type, updated_at")
      .order("updated_at", { ascending: false })
      .then(({ data }) => {
        setRows((data ?? []) as PageRow[]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <ReadOnlyBanner />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">الصفحات</h1>
          <p className="text-sm text-muted-foreground mt-1">
            إدارة كل صفحات الموقع. بلوكات الصفحة الرئيسية يتم تحميلها من قاعدة البيانات.
          </p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-right">
            <tr>
              <th className="p-3 font-medium">العنوان</th>
              <th className="p-3 font-medium">المسار</th>
              <th className="p-3 font-medium">اللغة</th>
              <th className="p-3 font-medium">النوع</th>
              <th className="p-3 font-medium">الحالة</th>
              <th className="p-3 font-medium">آخر تعديل</th>
              <th className="p-3 font-medium text-left">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  جاري التحميل...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  لا توجد صفحات بعد
                </td>
              </tr>
            ) : (
              rows.map((p) => (
                <tr key={p.id} className="border-t hover:bg-muted/20">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{p.title}</span>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-xs text-muted-foreground" dir="ltr">
                    /{p.locale}/{p.slug === "home" ? "" : p.slug}
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Globe className="w-3 h-3" />
                      {p.locale.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-xs">
                      {p.page_type}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={p.status === "published" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {p.status === "published"
                        ? "منشور"
                        : p.status === "draft"
                          ? "مسودة"
                          : "مؤرشف"}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">
                    {new Date(p.updated_at).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={`/${p.locale}${p.slug === "home" ? "" : `/${p.slug}`}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          to="/admin/pages/$pageId"
                          params={{ pageId: p.id }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
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
