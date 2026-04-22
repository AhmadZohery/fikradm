import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Eye, FileText, Globe, Pencil, Plus, Copy, Trash2, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const navigate = useNavigate();
  const [rows, setRows] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [localeFilter, setLocaleFilter] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<PageRow | null>(null);

  const reload = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("pages")
      .select("id, slug, locale, title, status, page_type, updated_at")
      .order("updated_at", { ascending: false });
    setRows((data ?? []) as PageRow[]);
    setLoading(false);
  };

  useEffect(() => {
    void reload();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (localeFilter !== "all" && p.locale !== localeFilter) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.page_type.toLowerCase().includes(q)
      );
    });
  }, [rows, query, statusFilter, localeFilter]);

  const handleDuplicate = async (p: PageRow) => {
    const { data: full, error: e1 } = await supabase
      .from("pages")
      .select("*")
      .eq("id", p.id)
      .maybeSingle();
    if (e1 || !full) {
      toast.error("تعذر النسخ");
      return;
    }
    const src = full as Record<string, unknown> & { slug: string; title: string };
    const newSlug = `${src.slug}-copy-${Math.random().toString(36).slice(2, 5)}`;
    const rest: Record<string, unknown> = { ...src };
    delete rest.id;
    delete rest.created_at;
    delete rest.updated_at;
    delete rest.published_at;
    const { data: ins, error: e2 } = await supabase
      .from("pages")
      .insert({ ...rest, slug: newSlug, status: "draft", title: `${src.title} (نسخة)` } as never)
      .select("id")
      .single();
    if (e2 || !ins) {
      toast.error("فشل النسخ: " + (e2?.message ?? ""));
      return;
    }
    toast.success("تم نسخ الصفحة كمسودة");
    void reload();
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const { error } = await supabase.from("pages").delete().eq("id", confirmDelete.id);
    if (error) {
      toast.error("فشل الحذف: " + error.message);
    } else {
      toast.success("تم حذف الصفحة");
      setRows((prev) => prev.filter((r) => r.id !== confirmDelete.id));
    }
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-6">
      <ReadOnlyBanner />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">الصفحات</h1>
          <p className="text-sm text-muted-foreground mt-1">
            إدارة كل صفحات الموقع — إنشاء، نسخ، حذف، نشر، وتحرير البلوكات.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4 ml-1" /> إنشاء صفحة
        </Button>
      </div>

      <Card className="p-3 flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="بحث بالعنوان أو المسار..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pr-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الحالات</SelectItem>
            <SelectItem value="published">منشور</SelectItem>
            <SelectItem value="draft">مسودة</SelectItem>
            <SelectItem value="archived">مؤرشف</SelectItem>
          </SelectContent>
        </Select>
        <Select value={localeFilter} onValueChange={setLocaleFilter}>
          <SelectTrigger className="w-full md:w-[120px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل اللغات</SelectItem>
            <SelectItem value="ar">العربية</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <div className="text-xs text-muted-foreground">
        {filtered.length} من {rows.length} صفحة
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
                  <Loader2 className="w-4 h-4 animate-spin inline ml-2" /> جاري التحميل...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  {rows.length === 0 ? "لا توجد صفحات بعد — ابدأ بإنشاء صفحة جديدة" : "لا نتائج مطابقة"}
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
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
                      <Button variant="ghost" size="sm" asChild title="معاينة">
                        <a
                          href={`/${p.locale}${p.slug === "home" ? "" : `/${p.slug}`}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" asChild title="تعديل">
                        <Link
                          to="/admin/pages/$pageId"
                          params={{ pageId: p.id }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="نسخ"
                        onClick={() => void handleDuplicate(p)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="حذف"
                        onClick={() => setConfirmDelete(p)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      <CreatePageDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(id) => navigate({ to: "/admin/pages/$pageId", params: { pageId: id } })}
      />

      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>حذف الصفحة؟</AlertDialogTitle>
            <AlertDialogDescription>
              هتحذف صفحة "{confirmDelete?.title}" نهائياً. الإجراء ده لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ---------- Create page dialog ---------- */
function CreatePageDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [locale, setLocale] = useState("ar");
  const [pageType, setPageType] = useState("custom");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!open) {
      setTitle("");
      setSlug("");
      setLocale("ar");
      setPageType("custom");
    }
  }, [open]);

  const slugify = (s: string) =>
    s.toLowerCase().trim().replace(/[^a-z0-9\u0600-\u06FF]+/g, "-").replace(/^-+|-+$/g, "");

  const create = async () => {
    if (!title.trim() || !slug.trim()) {
      toast.error("العنوان والمسار مطلوبان");
      return;
    }
    setCreating(true);
    const { data, error } = await supabase
      .from("pages")
      .insert({
        title: title.trim(),
        slug: slug.trim(),
        locale,
        page_type: pageType as never,
        status: "draft",
        blocks: [] as never,
      } as never)
      .select("id")
      .single();
    setCreating(false);
    if (error || !data) {
      toast.error("فشل الإنشاء: " + (error?.message ?? ""));
      return;
    }
    toast.success("تم إنشاء الصفحة");
    onClose();
    onCreated((data as { id: string }).id);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent dir="rtl" className="max-w-md">
        <DialogHeader>
          <DialogTitle>صفحة جديدة</DialogTitle>
          <DialogDescription>أنشئ صفحة فارغة وابدأ التعديل فوراً</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">العنوان</Label>
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slug || slug === slugify(title)) setSlug(slugify(e.target.value));
              }}
              placeholder="مثال: من نحن"
            />
          </div>
          <div>
            <Label className="text-xs">المسار (Slug)</Label>
            <Input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder="about-us" dir="ltr" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">اللغة</Label>
              <Select value={locale} onValueChange={setLocale}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">النوع</Label>
              <Select value={pageType} onValueChange={setPageType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">مخصصة</SelectItem>
                  <SelectItem value="about">من نحن</SelectItem>
                  <SelectItem value="contact">تواصل</SelectItem>
                  <SelectItem value="case_studies">دراسات حالة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>إلغاء</Button>
          <Button onClick={create} disabled={creating}>
            {creating && <Loader2 className="w-4 h-4 animate-spin ml-1" />}
            إنشاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
