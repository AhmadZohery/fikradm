import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff, ArrowUp, ArrowDown } from "lucide-react";
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

export const Route = createFileRoute("/admin/locations")({
  component: LocationsAdmin,
});

type Loc = {
  id: string; slug: string;
  city_ar: string; city_en: string;
  region_ar: string | null; region_en: string | null;
  intro_ar: string | null; intro_en: string | null;
  description_ar: string | null; description_en: string | null;
  highlights_ar: string[]; highlights_en: string[];
  meta_title_ar: string | null; meta_title_en: string | null;
  meta_description_ar: string | null; meta_description_en: string | null;
  og_image_url: string | null; is_published: boolean; sort_order: number;
};

function asArr(v: unknown): string[] { return Array.isArray(v) ? (v as string[]) : []; }

function LocationsAdmin() {
  const [items, setItems] = useState<Loc[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Loc | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("locations").select("*").order("sort_order");
    setItems(((data ?? []) as unknown as Loc[]).map((s) => ({
      ...s, highlights_ar: asArr(s.highlights_ar), highlights_en: asArr(s.highlights_en),
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
      supabase.from("locations").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("locations").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    void load();
  };
  const togglePublish = async (s: Loc) => {
    await supabase.from("locations").update({ is_published: !s.is_published }).eq("id", s.id);
    void load();
  };
  const remove = async (id: string) => {
    if (!confirm("حذف الموقع؟")) return;
    const { error } = await supabase.from("locations").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("تم"); void load(); }
  };
  const create = async () => {
    const sort = items.length ? Math.max(...items.map((i) => i.sort_order)) + 10 : 10;
    const { data, error } = await supabase.from("locations").insert({
      slug: `city-${Date.now()}`, city_ar: "مدينة جديدة", city_en: "New City",
      sort_order: sort, is_published: false,
    }).select().single();
    if (error) return toast.error(error.message);
    await load();
    setEditing({ ...(data as unknown as Loc), highlights_ar: [], highlights_en: [] });
  };

  return (
    <div className="space-y-4 max-w-6xl">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">المواقع الجغرافية</h1>
          <p className="text-sm text-muted-foreground mt-1">صفحات المدن للسيو المحلي (Local SEO).</p>
        </div>
        <Button onClick={create}><Plus className="w-4 h-4 ml-2" /> إضافة موقع</Button>
      </div>
      <Card className="p-0 overflow-hidden">
        {loading ? <div className="p-10 text-center"><Loader2 className="w-4 h-4 animate-spin inline" /></div> :
          items.length === 0 ? <div className="p-10 text-center text-muted-foreground">لا مواقع بعد</div> : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-right"><tr>
              <th className="p-3">المدينة</th><th className="p-3">المنطقة</th><th className="p-3">Slug</th><th className="p-3">الترتيب</th><th className="p-3">الحالة</th><th className="p-3 text-left">إجراءات</th>
            </tr></thead>
            <tbody>
              {items.map((s, idx) => (
                <tr key={s.id} className="border-t hover:bg-muted/20">
                  <td className="p-3"><div className="font-medium">{s.city_ar}</div><div className="text-xs text-muted-foreground" dir="ltr">{s.city_en}</div></td>
                  <td className="p-3 text-xs">{s.region_ar ?? "—"}</td>
                  <td className="p-3 font-mono text-xs" dir="ltr">{s.slug}</td>
                  <td className="p-3"><div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => move(s.id, -1)} disabled={idx === 0}><ArrowUp className="w-3.5 h-3.5" /></Button>
                    <span className="text-xs w-6 text-center">{s.sort_order}</span>
                    <Button variant="ghost" size="icon" onClick={() => move(s.id, 1)} disabled={idx === items.length - 1}><ArrowDown className="w-3.5 h-3.5" /></Button>
                  </div></td>
                  <td className="p-3"><Badge variant={s.is_published ? "default" : "secondary"}>{s.is_published ? "منشور" : "مسودة"}</Badge></td>
                  <td className="p-3"><div className="flex items-center gap-1 justify-end">
                    <Button variant="ghost" size="icon" onClick={() => togglePublish(s)}>{s.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</Button>
                    <Button variant="ghost" size="icon" onClick={() => setEditing(s)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(s.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      {editing && <LocationEditor loc={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); void load(); }} />}
    </div>
  );
}

function LocationEditor({ loc, onClose, onSaved }: { loc: Loc; onClose: () => void; onSaved: () => void }) {
  const [s, setS] = useState<Loc>(loc);
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("locations").update({
      slug: s.slug, city_ar: s.city_ar, city_en: s.city_en,
      region_ar: s.region_ar, region_en: s.region_en,
      intro_ar: s.intro_ar, intro_en: s.intro_en,
      description_ar: s.description_ar, description_en: s.description_en,
      highlights_ar: s.highlights_ar as never, highlights_en: s.highlights_en as never,
      meta_title_ar: s.meta_title_ar, meta_title_en: s.meta_title_en,
      meta_description_ar: s.meta_description_ar, meta_description_en: s.meta_description_en,
      og_image_url: s.og_image_url, is_published: s.is_published,
    }).eq("id", s.id);
    setSaving(false);
    if (error) toast.error(error.message); else { toast.success("تم"); onSaved(); }
  };
  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="left" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader><SheetTitle>تعديل الموقع</SheetTitle></SheetHeader>
        <Tabs defaultValue="ar" className="mt-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="ar">عربي</TabsTrigger><TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger><TabsTrigger value="meta">إعدادات</TabsTrigger>
          </TabsList>
          <TabsContent value="ar" className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>المدينة</Label><Input value={s.city_ar} onChange={(e) => setS({ ...s, city_ar: e.target.value })} /></div>
              <div><Label>المنطقة</Label><Input value={s.region_ar ?? ""} onChange={(e) => setS({ ...s, region_ar: e.target.value })} /></div>
            </div>
            <div><Label>مقدمة</Label><Textarea rows={2} value={s.intro_ar ?? ""} onChange={(e) => setS({ ...s, intro_ar: e.target.value })} /></div>
            <div><Label>الوصف</Label><Textarea rows={5} value={s.description_ar ?? ""} onChange={(e) => setS({ ...s, description_ar: e.target.value })} /></div>
            <div><Label>النقاط</Label><StringArrayEditor value={s.highlights_ar} onChange={(v) => setS({ ...s, highlights_ar: v })} /></div>
          </TabsContent>
          <TabsContent value="en" className="space-y-3 mt-4" dir="ltr">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>City</Label><Input value={s.city_en} onChange={(e) => setS({ ...s, city_en: e.target.value })} /></div>
              <div><Label>Region</Label><Input value={s.region_en ?? ""} onChange={(e) => setS({ ...s, region_en: e.target.value })} /></div>
            </div>
            <div><Label>Intro</Label><Textarea rows={2} value={s.intro_en ?? ""} onChange={(e) => setS({ ...s, intro_en: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea rows={5} value={s.description_en ?? ""} onChange={(e) => setS({ ...s, description_en: e.target.value })} /></div>
            <div><Label>Highlights</Label><StringArrayEditor value={s.highlights_en} onChange={(v) => setS({ ...s, highlights_en: v })} dir="ltr" /></div>
          </TabsContent>
          <TabsContent value="seo" className="space-y-3 mt-4">
            <div><Label>Meta Title (AR)</Label><Input value={s.meta_title_ar ?? ""} onChange={(e) => setS({ ...s, meta_title_ar: e.target.value })} /></div>
            <div><Label>Meta Description (AR)</Label><Textarea rows={2} value={s.meta_description_ar ?? ""} onChange={(e) => setS({ ...s, meta_description_ar: e.target.value })} /></div>
            <Separator />
            <div dir="ltr"><Label>Meta Title (EN)</Label><Input value={s.meta_title_en ?? ""} onChange={(e) => setS({ ...s, meta_title_en: e.target.value })} /></div>
            <div dir="ltr"><Label>Meta Description (EN)</Label><Textarea rows={2} value={s.meta_description_en ?? ""} onChange={(e) => setS({ ...s, meta_description_en: e.target.value })} /></div>
            <div><Label>OG Image</Label><Input dir="ltr" value={s.og_image_url ?? ""} onChange={(e) => setS({ ...s, og_image_url: e.target.value })} /></div>
          </TabsContent>
          <TabsContent value="meta" className="space-y-3 mt-4">
            <div><Label>Slug</Label><Input dir="ltr" value={s.slug} onChange={(e) => setS({ ...s, slug: e.target.value })} className="font-mono text-sm" /></div>
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