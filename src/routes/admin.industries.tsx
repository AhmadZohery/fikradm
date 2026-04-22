import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, ChevronRight, Eye, EyeOff, ArrowUp, ArrowDown } from "lucide-react";
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

export const Route = createFileRoute("/admin/industries")({
  component: IndustriesAdmin,
});

type Industry = {
  id: string; slug: string; icon: string;
  title_ar: string; title_en: string;
  intro_ar: string | null; intro_en: string | null;
  description_ar: string | null; description_en: string | null;
  highlights_ar: string[]; highlights_en: string[];
  meta_title_ar: string | null; meta_title_en: string | null;
  meta_description_ar: string | null; meta_description_en: string | null;
  og_image_url: string | null; is_published: boolean; sort_order: number;
};
type SubIndustry = Omit<Industry, "icon"> & { industry_id: string };

function asArr(v: unknown): string[] { return Array.isArray(v) ? (v as string[]) : []; }

function IndustriesAdmin() {
  const [items, setItems] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Industry | null>(null);
  const [subFor, setSubFor] = useState<Industry | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("industries").select("*").order("sort_order");
    setItems(((data ?? []) as unknown as Industry[]).map((s) => ({
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
      supabase.from("industries").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("industries").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    void load();
  };
  const togglePublish = async (s: Industry) => {
    await supabase.from("industries").update({ is_published: !s.is_published }).eq("id", s.id);
    void load();
  };
  const remove = async (id: string) => {
    if (!confirm("حذف الصناعة وكل الفرعية؟")) return;
    const { error } = await supabase.from("industries").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("تم"); void load(); }
  };
  const create = async () => {
    const sort = items.length ? Math.max(...items.map((i) => i.sort_order)) + 10 : 10;
    const { data, error } = await supabase.from("industries").insert({
      slug: `industry-${Date.now()}`, icon: "Building2",
      title_ar: "صناعة جديدة", title_en: "New Industry", sort_order: sort, is_published: false,
    }).select().single();
    if (error) return toast.error(error.message);
    await load();
    setEditing({ ...(data as unknown as Industry), highlights_ar: [], highlights_en: [] });
  };

  return (
    <div className="space-y-4 max-w-6xl">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">إدارة الصناعات</h1>
          <p className="text-sm text-muted-foreground mt-1">صناعات + صناعات فرعية مع SEO ثنائي اللغة.</p>
        </div>
        <Button onClick={create}><Plus className="w-4 h-4 ml-2" /> إضافة صناعة</Button>
      </div>
      <Card className="p-0 overflow-hidden">
        {loading ? <div className="p-10 text-center"><Loader2 className="w-4 h-4 animate-spin inline" /></div> :
          items.length === 0 ? <div className="p-10 text-center text-muted-foreground">لا صناعات بعد</div> : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-right"><tr>
              <th className="p-3">العنوان</th><th className="p-3">Slug</th><th className="p-3">الترتيب</th><th className="p-3">الحالة</th><th className="p-3 text-left">إجراءات</th>
            </tr></thead>
            <tbody>
              {items.map((s, idx) => (
                <tr key={s.id} className="border-t hover:bg-muted/20">
                  <td className="p-3"><div className="font-medium">{s.title_ar}</div><div className="text-xs text-muted-foreground" dir="ltr">{s.title_en}</div></td>
                  <td className="p-3 font-mono text-xs" dir="ltr">{s.slug}</td>
                  <td className="p-3"><div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => move(s.id, -1)} disabled={idx === 0}><ArrowUp className="w-3.5 h-3.5" /></Button>
                    <span className="text-xs w-6 text-center">{s.sort_order}</span>
                    <Button variant="ghost" size="icon" onClick={() => move(s.id, 1)} disabled={idx === items.length - 1}><ArrowDown className="w-3.5 h-3.5" /></Button>
                  </div></td>
                  <td className="p-3"><Badge variant={s.is_published ? "default" : "secondary"}>{s.is_published ? "منشور" : "مسودة"}</Badge></td>
                  <td className="p-3"><div className="flex items-center gap-1 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setSubFor(s)}><ChevronRight className="w-4 h-4 ml-1" /> الفرعية</Button>
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
      {editing && <IndustryEditor industry={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); void load(); }} />}
      {subFor && <SubIndustriesSheet industry={subFor} onClose={() => setSubFor(null)} />}
    </div>
  );
}

function IndustryEditor({ industry, onClose, onSaved }: { industry: Industry; onClose: () => void; onSaved: () => void }) {
  const [s, setS] = useState<Industry>(industry);
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("industries").update({
      slug: s.slug, icon: s.icon, title_ar: s.title_ar, title_en: s.title_en,
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
        <SheetHeader><SheetTitle>تعديل الصناعة</SheetTitle></SheetHeader>
        <Tabs defaultValue="ar" className="mt-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="ar">عربي</TabsTrigger><TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger><TabsTrigger value="meta">إعدادات</TabsTrigger>
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
            <div><Label>Meta Title (AR)</Label><Input value={s.meta_title_ar ?? ""} onChange={(e) => setS({ ...s, meta_title_ar: e.target.value })} /></div>
            <div><Label>Meta Description (AR)</Label><Textarea rows={2} value={s.meta_description_ar ?? ""} onChange={(e) => setS({ ...s, meta_description_ar: e.target.value })} /></div>
            <Separator />
            <div dir="ltr"><Label>Meta Title (EN)</Label><Input value={s.meta_title_en ?? ""} onChange={(e) => setS({ ...s, meta_title_en: e.target.value })} /></div>
            <div dir="ltr"><Label>Meta Description (EN)</Label><Textarea rows={2} value={s.meta_description_en ?? ""} onChange={(e) => setS({ ...s, meta_description_en: e.target.value })} /></div>
            <div><Label>OG Image</Label><Input dir="ltr" value={s.og_image_url ?? ""} onChange={(e) => setS({ ...s, og_image_url: e.target.value })} /></div>
          </TabsContent>
          <TabsContent value="meta" className="space-y-3 mt-4">
            <div><Label>Slug</Label><Input dir="ltr" value={s.slug} onChange={(e) => setS({ ...s, slug: e.target.value })} className="font-mono text-sm" /></div>
            <div><Label>Icon (Lucide)</Label><Input dir="ltr" value={s.icon} onChange={(e) => setS({ ...s, icon: e.target.value })} /></div>
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

function SubIndustriesSheet({ industry, onClose }: { industry: Industry; onClose: () => void }) {
  const [subs, setSubs] = useState<SubIndustry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SubIndustry | null>(null);
  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("sub_industries").select("*").eq("industry_id", industry.id).order("sort_order");
    setSubs(((data ?? []) as unknown as SubIndustry[]).map((s) => ({
      ...s, highlights_ar: asArr(s.highlights_ar), highlights_en: asArr(s.highlights_en),
    })));
    setLoading(false);
  };
  useEffect(() => { void load(); }, [industry.id]);
  const create = async () => {
    const sort = subs.length ? Math.max(...subs.map((i) => i.sort_order)) + 10 : 10;
    const { data, error } = await supabase.from("sub_industries").insert({
      industry_id: industry.id, slug: `sub-${Date.now()}`,
      title_ar: "فرعية جديدة", title_en: "New Sub", sort_order: sort, is_published: false,
    }).select().single();
    if (error) return toast.error(error.message);
    await load();
    setEditing({ ...(data as unknown as SubIndustry), highlights_ar: [], highlights_en: [] });
  };
  const remove = async (id: string) => {
    if (!confirm("حذف؟")) return;
    await supabase.from("sub_industries").delete().eq("id", id); void load();
  };
  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="left" className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader><SheetTitle>الفرعية لـ: {industry.title_ar}</SheetTitle></SheetHeader>
        <div className="flex justify-end mt-4"><Button onClick={create}><Plus className="w-4 h-4 ml-2" /> إضافة</Button></div>
        <div className="mt-4 space-y-2">
          {loading ? <div className="text-center py-6"><Loader2 className="w-4 h-4 animate-spin inline" /></div> :
            subs.length === 0 ? <Card className="p-6 text-center text-muted-foreground text-sm">لا فرعية بعد</Card> :
            subs.map((sub) => (
              <Card key={sub.id} className="p-3 flex items-center justify-between">
                <div><div className="font-medium">{sub.title_ar}</div><div className="text-xs text-muted-foreground font-mono" dir="ltr">/{industry.slug}/{sub.slug}</div></div>
                <div className="flex items-center gap-1">
                  <Badge variant={sub.is_published ? "default" : "secondary"} className="text-[10px]">{sub.is_published ? "منشور" : "مسودة"}</Badge>
                  <Button variant="ghost" size="icon" onClick={() => setEditing(sub)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(sub.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </Card>
            ))}
        </div>
        {editing && <SubIndustryEditor sub={editing} parentSlug={industry.slug} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); void load(); }} />}
      </SheetContent>
    </Sheet>
  );
}

function SubIndustryEditor({ sub, parentSlug, onClose, onSaved }: { sub: SubIndustry; parentSlug: string; onClose: () => void; onSaved: () => void }) {
  const [s, setS] = useState<SubIndustry>(sub);
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("sub_industries").update({
      slug: s.slug, title_ar: s.title_ar, title_en: s.title_en,
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
      <SheetContent side="left" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader><SheetTitle>تعديل الفرعية</SheetTitle><div className="text-xs text-muted-foreground font-mono" dir="ltr">/{parentSlug}/{s.slug}</div></SheetHeader>
        <Tabs defaultValue="ar" className="mt-4">
          <TabsList className="grid grid-cols-3"><TabsTrigger value="ar">عربي</TabsTrigger><TabsTrigger value="en">English</TabsTrigger><TabsTrigger value="seo">SEO</TabsTrigger></TabsList>
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