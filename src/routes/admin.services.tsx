import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, ChevronRight, Eye, EyeOff, ArrowUp, ArrowDown, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StringArrayEditor } from "@/cms/admin/StringArrayEditor";
import { BulkImportDialog } from "@/cms/admin/BulkImportDialog";
import { SchedulePublishField } from "@/cms/admin/SchedulePublishField";
import type { ImportColumn } from "@/cms/admin/csvImport";
import { LocaleSwitcher, dirFor, type AdminLocale } from "@/cms/admin/LocaleSwitcher";

export const Route = createFileRoute("/admin/services")({
  component: ServicesAdmin,
});

type Service = {
  id: string;
  slug: string;
  icon: string;
  title_ar: string;
  title_en: string;
  intro_ar: string | null;
  intro_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  highlights_ar: string[];
  highlights_en: string[];
  meta_title_ar: string | null;
  meta_title_en: string | null;
  meta_description_ar: string | null;
  meta_description_en: string | null;
  og_image_url: string | null;
  is_published: boolean;
  sort_order: number;
  scheduled_publish_at?: string | null;
  scheduled_unpublish_at?: string | null;
};

type SubService = {
  id: string;
  service_id: string;
  slug: string;
  title_ar: string;
  title_en: string;
  intro_ar: string | null;
  intro_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  highlights_ar: string[];
  highlights_en: string[];
  meta_title_ar: string | null;
  meta_title_en: string | null;
  meta_description_ar: string | null;
  meta_description_en: string | null;
  og_image_url: string | null;
  is_published: boolean;
  sort_order: number;
};

function asArr(v: unknown): string[] {
  return Array.isArray(v) ? (v as string[]) : [];
}

const SERVICE_COLUMNS: ImportColumn[] = [
  { key: "slug", label: "Slug", required: true, type: "string" },
  { key: "icon", label: "Icon (Lucide)", type: "string" },
  { key: "title_ar", label: "العنوان (AR)", required: true, type: "string" },
  { key: "title_en", label: "Title (EN)", required: true, type: "string" },
  { key: "intro_ar", label: "مقدمة (AR)", type: "string" },
  { key: "intro_en", label: "Intro (EN)", type: "string" },
  { key: "description_ar", label: "الوصف (AR)", type: "string" },
  { key: "description_en", label: "Description (EN)", type: "string" },
  { key: "highlights_ar", label: "نقاط (AR)", type: "list", hint: "افصل بـ |" },
  { key: "highlights_en", label: "Highlights (EN)", type: "list" },
  { key: "is_published", label: "منشور", type: "bool" },
  { key: "sort_order", label: "الترتيب", type: "number" },
];

function ServicesAdmin() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [subFor, setSubFor] = useState<Service | null>(null);
  const [importing, setImporting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("services").select("*").order("sort_order");
    if (error) toast.error("فشل التحميل");
    setItems(((data ?? []) as unknown as Service[]).map((s) => ({
      ...s,
      highlights_ar: asArr(s.highlights_ar),
      highlights_en: asArr(s.highlights_en),
    })));
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const move = async (id: string, dir: -1 | 1) => {
    const idx = items.findIndex((i) => i.id === id);
    const next = idx + dir;
    if (next < 0 || next >= items.length) return;
    const a = items[idx], b = items[next];
    await Promise.all([
      supabase.from("services").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("services").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    void load();
  };

  const togglePublish = async (s: Service) => {
    const { error } = await supabase.from("services").update({ is_published: !s.is_published }).eq("id", s.id);
    if (error) toast.error("فشل التحديث");
    else { toast.success(!s.is_published ? "نُشر" : "أُخفي"); void load(); }
  };

  const remove = async (id: string) => {
    if (!confirm("حذف الخدمة وكل الخدمات الفرعية المرتبطة بها؟")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) toast.error("فشل الحذف: " + error.message);
    else { toast.success("تم الحذف"); void load(); }
  };

  const create = async () => {
    const sort = items.length ? Math.max(...items.map((i) => i.sort_order)) + 10 : 10;
    const { data, error } = await supabase.from("services").insert({
      slug: `service-${Date.now()}`, icon: "Search",
      title_ar: "خدمة جديدة", title_en: "New Service", sort_order: sort, is_published: false,
    }).select().single();
    if (error) return toast.error("فشل الإنشاء: " + error.message);
    await load();
    setEditing({ ...(data as unknown as Service), highlights_ar: [], highlights_en: [] });
  };

  return (
    <div className="space-y-4 max-w-6xl">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">إدارة الخدمات</h1>
          <p className="text-sm text-muted-foreground mt-1">CRUD كامل للخدمات الرئيسية والفرعية مع SEO ثنائي اللغة.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setImporting(true)}><FileSpreadsheet className="w-4 h-4 ml-2" /> استيراد CSV</Button>
          <Button onClick={create}><Plus className="w-4 h-4 ml-2" /> إضافة خدمة</Button>
        </div>
      </div>

      <BulkImportDialog
        open={importing}
        onClose={() => setImporting(false)}
        title="استيراد خدمات من CSV"
        description="ارفع ملف CSV. يتم استخدام | لفصل عناصر القوائم."
        templateFilename="services-template.csv"
        columns={SERVICE_COLUMNS}
        templateExample={{
          slug: "seo-services",
          icon: "Search",
          title_ar: "خدمات SEO",
          title_en: "SEO Services",
          intro_ar: "تحسين ظهورك في جوجل",
          intro_en: "Boost your Google ranking",
          description_ar: "وصف تفصيلي…",
          description_en: "Detailed description…",
          highlights_ar: "تحليل الكلمات|بناء الروابط|تقارير شهرية",
          highlights_en: "Keyword research|Link building|Monthly reports",
          is_published: "true",
          sort_order: "10",
        }}
        onImport={async (rows) => {
          const insertRows = rows.map((r) => ({
            slug: String(r.slug),
            icon: (r.icon as string) || "Search",
            title_ar: String(r.title_ar),
            title_en: String(r.title_en),
            intro_ar: (r.intro_ar as string) || null,
            intro_en: (r.intro_en as string) || null,
            description_ar: (r.description_ar as string) || null,
            description_en: (r.description_en as string) || null,
            highlights_ar: (r.highlights_ar as string[]) ?? [],
            highlights_en: (r.highlights_en as string[]) ?? [],
            is_published: !!r.is_published,
            sort_order: (r.sort_order as number) ?? 0,
          }));
          const { error, data } = await supabase.from("services").insert(insertRows as never).select("id");
          if (error) throw error;
          return { inserted: data?.length ?? 0, failed: rows.length - (data?.length ?? 0) };
        }}
        onDone={load}
      />

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin inline ml-2" /> تحميل...</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">لا توجد خدمات بعد. اضغط "إضافة خدمة".</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-right">
              <tr>
                <th className="p-3 font-medium">العنوان</th>
                <th className="p-3 font-medium">Slug</th>
                <th className="p-3 font-medium">الترتيب</th>
                <th className="p-3 font-medium">الحالة</th>
                <th className="p-3 font-medium text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s, idx) => (
                <tr key={s.id} className="border-t hover:bg-muted/20">
                  <td className="p-3">
                    <div className="font-medium">{s.title_ar}</div>
                    <div className="text-xs text-muted-foreground" dir="ltr">{s.title_en}</div>
                  </td>
                  <td className="p-3 font-mono text-xs text-muted-foreground" dir="ltr">{s.slug}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => move(s.id, -1)} disabled={idx === 0}><ArrowUp className="w-3.5 h-3.5" /></Button>
                      <span className="text-xs text-muted-foreground w-6 text-center">{s.sort_order}</span>
                      <Button variant="ghost" size="icon" onClick={() => move(s.id, 1)} disabled={idx === items.length - 1}><ArrowDown className="w-3.5 h-3.5" /></Button>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge variant={s.is_published ? "default" : "secondary"}>{s.is_published ? "منشور" : "مسودة"}</Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => setSubFor(s)}>
                        <ChevronRight className="w-4 h-4 ml-1" /> الفرعية
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => togglePublish(s)} title={s.is_published ? "إخفاء" : "نشر"}>
                        {s.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setEditing(s)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(s.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {editing && (
        <ServiceEditor
          service={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); void load(); }}
        />
      )}
      {subFor && (
        <SubServicesSheet service={subFor} onClose={() => setSubFor(null)} />
      )}
    </div>
  );
}

function ServiceEditor({ service, onClose, onSaved }: { service: Service; onClose: () => void; onSaved: () => void }) {
  const [s, setS] = useState<Service>(service);
  const [saving, setSaving] = useState(false);
  const [loc, setLoc] = useState<AdminLocale>("ar");

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("services").update({
      slug: s.slug, icon: s.icon,
      title_ar: s.title_ar, title_en: s.title_en,
      intro_ar: s.intro_ar, intro_en: s.intro_en,
      description_ar: s.description_ar, description_en: s.description_en,
      highlights_ar: s.highlights_ar as never, highlights_en: s.highlights_en as never,
      meta_title_ar: s.meta_title_ar, meta_title_en: s.meta_title_en,
      meta_description_ar: s.meta_description_ar, meta_description_en: s.meta_description_en,
      og_image_url: s.og_image_url, is_published: s.is_published,
      scheduled_publish_at: s.scheduled_publish_at ?? null,
      scheduled_unpublish_at: s.scheduled_unpublish_at ?? null,
    }).eq("id", s.id);
    setSaving(false);
    if (error) toast.error("فشل الحفظ: " + error.message);
    else { toast.success("تم الحفظ"); onSaved(); }
  };

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="left" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between gap-3">
            <SheetTitle>{loc === "ar" ? "تعديل الخدمة" : "Edit service"}</SheetTitle>
            <LocaleSwitcher value={loc} onChange={setLoc} />
          </div>
        </SheetHeader>
        <Tabs defaultValue="content" className="mt-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="content">{loc === "ar" ? "المحتوى" : "Content"}</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="meta">{loc === "ar" ? "إعدادات" : "Settings"}</TabsTrigger>
          </TabsList>
          <TabsContent value="content" className="space-y-3 mt-4" dir={dirFor(loc)}>
            <div className="rounded-md border-l-2 border-primary/50 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
              {loc === "ar" ? "تحرّر النسخة العربية الآن" : "You are editing the English version"}
            </div>
            <div>
              <Label>{loc === "ar" ? "العنوان" : "Title"}</Label>
              <Input
                dir={dirFor(loc)}
                value={loc === "ar" ? s.title_ar : s.title_en}
                onChange={(e) => setS({ ...s, [loc === "ar" ? "title_ar" : "title_en"]: e.target.value })}
              />
            </div>
            <div>
              <Label>{loc === "ar" ? "مقدمة قصيرة" : "Intro"}</Label>
              <Textarea
                rows={2}
                dir={dirFor(loc)}
                value={(loc === "ar" ? s.intro_ar : s.intro_en) ?? ""}
                onChange={(e) => setS({ ...s, [loc === "ar" ? "intro_ar" : "intro_en"]: e.target.value })}
              />
            </div>
            <div>
              <Label>{loc === "ar" ? "الوصف الكامل" : "Description"}</Label>
              <Textarea
                rows={5}
                dir={dirFor(loc)}
                value={(loc === "ar" ? s.description_ar : s.description_en) ?? ""}
                onChange={(e) => setS({ ...s, [loc === "ar" ? "description_ar" : "description_en"]: e.target.value })}
              />
            </div>
            <div>
              <Label>{loc === "ar" ? "النقاط البارزة" : "Highlights"}</Label>
              <StringArrayEditor
                value={loc === "ar" ? s.highlights_ar : s.highlights_en}
                onChange={(v) => setS({ ...s, [loc === "ar" ? "highlights_ar" : "highlights_en"]: v })}
                dir={dirFor(loc)}
              />
            </div>
          </TabsContent>
          <TabsContent value="seo" className="space-y-3 mt-4">
            <div><Label>Meta Title (عربي)</Label><Input value={s.meta_title_ar ?? ""} onChange={(e) => setS({ ...s, meta_title_ar: e.target.value })} /></div>
            <div><Label>Meta Description (عربي)</Label><Textarea rows={2} value={s.meta_description_ar ?? ""} onChange={(e) => setS({ ...s, meta_description_ar: e.target.value })} /></div>
            <Separator />
            <div dir="ltr"><Label>Meta Title (English)</Label><Input value={s.meta_title_en ?? ""} onChange={(e) => setS({ ...s, meta_title_en: e.target.value })} /></div>
            <div dir="ltr"><Label>Meta Description (English)</Label><Textarea rows={2} value={s.meta_description_en ?? ""} onChange={(e) => setS({ ...s, meta_description_en: e.target.value })} /></div>
            <div><Label>OG Image URL</Label><Input dir="ltr" value={s.og_image_url ?? ""} onChange={(e) => setS({ ...s, og_image_url: e.target.value })} /></div>
          </TabsContent>
          <TabsContent value="meta" className="space-y-3 mt-4">
            <div><Label>Slug</Label><Input dir="ltr" value={s.slug} onChange={(e) => setS({ ...s, slug: e.target.value })} className="font-mono text-sm" /></div>
            <div><Label>Icon (Lucide)</Label><Input dir="ltr" value={s.icon} onChange={(e) => setS({ ...s, icon: e.target.value })} /></div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div><div className="text-sm font-medium">منشور</div><div className="text-xs text-muted-foreground">يظهر للزوار</div></div>
              <Switch checked={s.is_published} onCheckedChange={(v) => setS({ ...s, is_published: v })} />
            </div>
            <SchedulePublishField
              publishAt={s.scheduled_publish_at ?? null}
              unpublishAt={s.scheduled_unpublish_at ?? null}
              hidePublishAt={s.is_published}
              onChange={({ publishAt, unpublishAt }) =>
                setS({ ...s, scheduled_publish_at: publishAt, scheduled_unpublish_at: unpublishAt })
              }
            />
          </TabsContent>
        </Tabs>
        <div className="flex justify-end gap-2 mt-6 sticky bottom-0 bg-background pt-3 border-t">
          <Button variant="outline" onClick={onClose}>إلغاء</Button>
          <Button onClick={save} disabled={saving}>{saving && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}حفظ</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SubServicesSheet({ service, onClose }: { service: Service; onClose: () => void }) {
  const [subs, setSubs] = useState<SubService[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SubService | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("sub_services").select("*").eq("service_id", service.id).order("sort_order");
    setSubs(((data ?? []) as unknown as SubService[]).map((s) => ({
      ...s,
      highlights_ar: asArr(s.highlights_ar), highlights_en: asArr(s.highlights_en),
    })));
    setLoading(false);
  };
  useEffect(() => { void load(); }, [service.id]);

  const create = async () => {
    const sort = subs.length ? Math.max(...subs.map((i) => i.sort_order)) + 10 : 10;
    const { data, error } = await supabase.from("sub_services").insert({
      service_id: service.id, slug: `sub-${Date.now()}`,
      title_ar: "خدمة فرعية جديدة", title_en: "New Sub-Service",
      sort_order: sort, is_published: false,
    }).select().single();
    if (error) return toast.error("فشل: " + error.message);
    await load();
    setEditing({ ...(data as unknown as SubService), highlights_ar: [], highlights_en: [] });
  };

  const remove = async (id: string) => {
    if (!confirm("حذف الخدمة الفرعية؟")) return;
    const { error } = await supabase.from("sub_services").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("تم"); void load(); }
  };

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="left" className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>الخدمات الفرعية لـ: {service.title_ar}</SheetTitle>
        </SheetHeader>
        <div className="flex justify-end mt-4">
          <Button onClick={create}><Plus className="w-4 h-4 ml-2" /> إضافة فرعية</Button>
        </div>
        <div className="mt-4 space-y-2">
          {loading ? (
            <div className="text-center text-muted-foreground py-6"><Loader2 className="w-4 h-4 animate-spin inline ml-2" /> تحميل...</div>
          ) : subs.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground text-sm">لا توجد خدمات فرعية بعد.</Card>
          ) : subs.map((sub) => (
            <Card key={sub.id} className="p-3 flex items-center justify-between">
              <div className="min-w-0">
                <div className="font-medium truncate">{sub.title_ar}</div>
                <div className="text-xs text-muted-foreground font-mono truncate" dir="ltr">/{service.slug}/{sub.slug}</div>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant={sub.is_published ? "default" : "secondary"} className="text-[10px]">{sub.is_published ? "منشور" : "مسودة"}</Badge>
                <Button variant="ghost" size="icon" onClick={() => setEditing(sub)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => remove(sub.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </Card>
          ))}
        </div>
        {editing && (
          <SubServiceEditor
            sub={editing}
            parentSlug={service.slug}
            onClose={() => setEditing(null)}
            onSaved={() => { setEditing(null); void load(); }}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

function SubServiceEditor({ sub, parentSlug, onClose, onSaved }: { sub: SubService; parentSlug: string; onClose: () => void; onSaved: () => void }) {
  const [s, setS] = useState<SubService>(sub);
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("sub_services").update({
      slug: s.slug, title_ar: s.title_ar, title_en: s.title_en,
      intro_ar: s.intro_ar, intro_en: s.intro_en,
      description_ar: s.description_ar, description_en: s.description_en,
      highlights_ar: s.highlights_ar as never, highlights_en: s.highlights_en as never,
      meta_title_ar: s.meta_title_ar, meta_title_en: s.meta_title_en,
      meta_description_ar: s.meta_description_ar, meta_description_en: s.meta_description_en,
      og_image_url: s.og_image_url, is_published: s.is_published,
    }).eq("id", s.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else { toast.success("تم"); onSaved(); }
  };
  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="left" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>تعديل الفرعية</SheetTitle>
          <div className="text-xs text-muted-foreground font-mono" dir="ltr">/{parentSlug}/{s.slug}</div>
        </SheetHeader>
        <Tabs defaultValue="ar" className="mt-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="ar">عربي</TabsTrigger>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>
          <TabsContent value="ar" className="space-y-3 mt-4">
            <div><Label>العنوان</Label><Input value={s.title_ar} onChange={(e) => setS({ ...s, title_ar: e.target.value })} /></div>
            <div><Label>مقدمة</Label><Textarea rows={2} value={s.intro_ar ?? ""} onChange={(e) => setS({ ...s, intro_ar: e.target.value })} /></div>
            <div><Label>الوصف</Label><Textarea rows={5} value={s.description_ar ?? ""} onChange={(e) => setS({ ...s, description_ar: e.target.value })} /></div>
            <div><Label>النقاط</Label><StringArrayEditor value={s.highlights_ar} onChange={(v) => setS({ ...s, highlights_ar: v })} /></div>
          </TabsContent>
          <TabsContent value="en" className="space-y-3 mt-4" dir="ltr">
            <div><Label>Title</Label><Input value={s.title_en} onChange={(e) => setS({ ...s, title_en: e.target.value })} /></div>
            <div><Label>Intro</Label><Textarea rows={2} value={s.intro_en ?? ""} onChange={(e) => setS({ ...s, intro_en: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea rows={5} value={s.description_en ?? ""} onChange={(e) => setS({ ...s, description_en: e.target.value })} /></div>
            <div><Label>Highlights</Label><StringArrayEditor value={s.highlights_en} onChange={(v) => setS({ ...s, highlights_en: v })} dir="ltr" /></div>
          </TabsContent>
          <TabsContent value="seo" className="space-y-3 mt-4">
            <div><Label>Slug</Label><Input dir="ltr" value={s.slug} onChange={(e) => setS({ ...s, slug: e.target.value })} className="font-mono text-sm" /></div>
            <div><Label>Meta Title (AR)</Label><Input value={s.meta_title_ar ?? ""} onChange={(e) => setS({ ...s, meta_title_ar: e.target.value })} /></div>
            <div><Label>Meta Description (AR)</Label><Textarea rows={2} value={s.meta_description_ar ?? ""} onChange={(e) => setS({ ...s, meta_description_ar: e.target.value })} /></div>
            <Separator />
            <div dir="ltr"><Label>Meta Title (EN)</Label><Input value={s.meta_title_en ?? ""} onChange={(e) => setS({ ...s, meta_title_en: e.target.value })} /></div>
            <div dir="ltr"><Label>Meta Description (EN)</Label><Textarea rows={2} value={s.meta_description_en ?? ""} onChange={(e) => setS({ ...s, meta_description_en: e.target.value })} /></div>
            <div><Label>OG Image</Label><Input dir="ltr" value={s.og_image_url ?? ""} onChange={(e) => setS({ ...s, og_image_url: e.target.value })} /></div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="text-sm font-medium">منشور</div>
              <Switch checked={s.is_published} onCheckedChange={(v) => setS({ ...s, is_published: v })} />
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end gap-2 mt-6 sticky bottom-0 bg-background pt-3 border-t">
          <Button variant="outline" onClick={onClose}>إلغاء</Button>
          <Button onClick={save} disabled={saving}>{saving && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}حفظ</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}