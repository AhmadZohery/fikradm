import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff, FolderOpen, Calendar } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StringArrayEditor } from "@/cms/admin/StringArrayEditor";
import { ReadOnlyBanner } from "@/components/admin/PermissionGate";

export const Route = createFileRoute("/admin/blog")({
  component: BlogAdmin,
});

type Category = {
  id: string; slug: string;
  name_ar: string; name_en: string;
  description_ar: string | null; description_en: string | null;
  is_published: boolean; sort_order: number;
};

type TocItem = { id: string; label: string };
type Section = { id: string; heading: string; body: string };
type Faq = { q: string; a: string };

type Post = {
  id: string; slug: string;
  category_id: string | null;
  status: string;
  title_ar: string; title_en: string;
  excerpt_ar: string | null; excerpt_en: string | null;
  cover_image_url: string | null;
  reading_minutes: number;
  author_ar: string | null; author_en: string | null;
  body: Section[];
  table_of_contents_ar: TocItem[];
  table_of_contents_en: TocItem[];
  faq: Faq[];
  internal_links: { label: string; href: string }[];
  cta: { label?: string; href?: string } | null;
  keywords_ar: string[] | null; keywords_en: string[] | null;
  meta_title_ar: string | null; meta_title_en: string | null;
  meta_description_ar: string | null; meta_description_en: string | null;
  published_at: string | null;
};

function asArr<T>(v: unknown): T[] { return Array.isArray(v) ? (v as T[]) : []; }

function BlogAdmin() {
  const [tab, setTab] = useState<"posts" | "cats">("posts");
  return (
    <div className="space-y-4 max-w-6xl">
      <ReadOnlyBanner />
      <div>
        <h1 className="text-2xl font-bold">المدونة</h1>
        <p className="text-sm text-muted-foreground mt-1">إدارة المقالات والتصنيفات بكل حقول الـ SEO والمحتوى المنظم.</p>
      </div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as "posts" | "cats")}>
        <TabsList>
          <TabsTrigger value="posts">المقالات</TabsTrigger>
          <TabsTrigger value="cats"><FolderOpen className="w-4 h-4 ml-1" /> التصنيفات</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-4"><PostsList /></TabsContent>
        <TabsContent value="cats" className="mt-4"><CategoriesList /></TabsContent>
      </Tabs>
    </div>
  );
}

function CategoriesList() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("blog_categories").select("*").order("sort_order");
    setItems((data ?? []) as Category[]); setLoading(false);
  };
  useEffect(() => { void load(); }, []);
  const create = async () => {
    const sort = items.length ? Math.max(...items.map((i) => i.sort_order)) + 10 : 10;
    const { data, error } = await supabase.from("blog_categories").insert({
      slug: `cat-${Date.now()}`, name_ar: "تصنيف جديد", name_en: "New Category", sort_order: sort,
    }).select().single();
    if (error) return toast.error(error.message);
    await load(); setEditing(data as Category);
  };
  const remove = async (id: string) => {
    if (!confirm("حذف التصنيف؟")) return;
    const { error } = await supabase.from("blog_categories").delete().eq("id", id);
    if (error) toast.error(error.message); else void load();
  };
  return (
    <div className="space-y-3">
      <div className="flex justify-end"><Button onClick={create}><Plus className="w-4 h-4 ml-2" /> تصنيف جديد</Button></div>
      <Card className="p-0 overflow-hidden">
        {loading ? <div className="p-8 text-center"><Loader2 className="w-4 h-4 animate-spin inline" /></div> :
          items.length === 0 ? <div className="p-8 text-center text-muted-foreground text-sm">لا تصنيفات بعد</div> : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-right"><tr>
              <th className="p-3">الاسم</th><th className="p-3">Slug</th><th className="p-3">الحالة</th><th className="p-3 text-left">إجراءات</th>
            </tr></thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-t hover:bg-muted/20">
                  <td className="p-3"><div className="font-medium">{c.name_ar}</div><div className="text-xs text-muted-foreground" dir="ltr">{c.name_en}</div></td>
                  <td className="p-3 font-mono text-xs" dir="ltr">{c.slug}</td>
                  <td className="p-3"><Badge variant={c.is_published ? "default" : "secondary"}>{c.is_published ? "منشور" : "مخفي"}</Badge></td>
                  <td className="p-3"><div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setEditing(c)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(c.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      {editing && <CategoryEditor cat={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); void load(); }} />}
    </div>
  );
}

function CategoryEditor({ cat, onClose, onSaved }: { cat: Category; onClose: () => void; onSaved: () => void }) {
  const [c, setC] = useState<Category>(cat);
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("blog_categories").update({
      slug: c.slug, name_ar: c.name_ar, name_en: c.name_en,
      description_ar: c.description_ar, description_en: c.description_en, is_published: c.is_published,
    }).eq("id", c.id);
    setSaving(false);
    if (error) toast.error(error.message); else { toast.success("تم"); onSaved(); }
  };
  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="left" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader><SheetTitle>تعديل التصنيف</SheetTitle></SheetHeader>
        <div className="space-y-3 mt-4">
          <div><Label>Slug</Label><Input dir="ltr" value={c.slug} onChange={(e) => setC({ ...c, slug: e.target.value })} className="font-mono text-sm" /></div>
          <div><Label>الاسم بالعربي</Label><Input value={c.name_ar} onChange={(e) => setC({ ...c, name_ar: e.target.value })} /></div>
          <div dir="ltr"><Label>Name (English)</Label><Input value={c.name_en} onChange={(e) => setC({ ...c, name_en: e.target.value })} /></div>
          <div><Label>وصف عربي</Label><Textarea rows={3} value={c.description_ar ?? ""} onChange={(e) => setC({ ...c, description_ar: e.target.value })} /></div>
          <div dir="ltr"><Label>Description (EN)</Label><Textarea rows={3} value={c.description_en ?? ""} onChange={(e) => setC({ ...c, description_en: e.target.value })} /></div>
          <div className="flex items-center justify-between p-3 border rounded">
            <div className="text-sm font-medium">منشور</div>
            <Switch checked={c.is_published} onCheckedChange={(v) => setC({ ...c, is_published: v })} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6 sticky bottom-0 bg-background pt-3 border-t">
          <Button variant="outline" onClick={onClose}>إلغاء</Button>
          <Button onClick={save} disabled={saving}>{saving && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}حفظ</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Post | null>(null);
  const navigate = useNavigate();
  const load = async () => {
    setLoading(true);
    const [postsRes, catsRes] = await Promise.all([
      supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
      supabase.from("blog_categories").select("*").order("sort_order"),
    ]);
    setPosts(((postsRes.data ?? []) as unknown as Post[]).map((p) => ({
      ...p,
      body: asArr<Section>(p.body),
      table_of_contents_ar: asArr<TocItem>(p.table_of_contents_ar),
      table_of_contents_en: asArr<TocItem>(p.table_of_contents_en),
      faq: asArr<Faq>(p.faq),
      internal_links: asArr<{ label: string; href: string }>(p.internal_links),
    })));
    setCats((catsRes.data ?? []) as Category[]);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const create = async () => {
    const { data, error } = await supabase.from("blog_posts").insert({
      slug: `post-${Date.now()}`, title_ar: "مقال جديد", title_en: "New Post", status: "draft",
    }).select().single();
    if (error) return toast.error(error.message);
    await load();
    navigate({ to: "/admin/blog/$postId", params: { postId: (data as { id: string }).id } });
  };
  const remove = async (id: string) => {
    if (!confirm("حذف المقال نهائياً؟")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) toast.error(error.message); else void load();
  };
  const togglePublish = async (p: Post) => {
    const next = p.status === "published" ? "draft" : "published";
    await supabase.from("blog_posts").update({
      status: next, published_at: next === "published" ? new Date().toISOString() : null,
    }).eq("id", p.id);
    void load();
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end"><Button onClick={create}><Plus className="w-4 h-4 ml-2" /> مقال جديد</Button></div>
      <Card className="p-0 overflow-hidden">
        {loading ? <div className="p-8 text-center"><Loader2 className="w-4 h-4 animate-spin inline" /></div> :
          posts.length === 0 ? <div className="p-8 text-center text-muted-foreground text-sm">لا مقالات بعد</div> : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-right"><tr>
              <th className="p-3">العنوان</th><th className="p-3">التصنيف</th><th className="p-3">الحالة</th><th className="p-3">النشر</th><th className="p-3 text-left">إجراءات</th>
            </tr></thead>
            <tbody>
              {posts.map((p) => {
                const cat = cats.find((c) => c.id === p.category_id);
                return (
                  <tr key={p.id} className="border-t hover:bg-muted/20">
                    <td className="p-3"><div className="font-medium">{p.title_ar}</div><div className="text-xs text-muted-foreground font-mono" dir="ltr">/{p.slug}</div></td>
                    <td className="p-3 text-xs">{cat?.name_ar ?? "—"}</td>
                    <td className="p-3"><Badge variant={p.status === "published" ? "default" : "secondary"}>{p.status === "published" ? "منشور" : p.status === "scheduled" ? "مجدول" : "مسودة"}</Badge></td>
                    <td className="p-3 text-xs text-muted-foreground">{p.published_at ? new Date(p.published_at).toLocaleDateString("ar-EG") : "—"}</td>
                    <td className="p-3"><div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => togglePublish(p)}>{p.status === "published" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</Button>
                      <Button asChild variant="ghost" size="icon"><Link to="/admin/blog/$postId" params={{ postId: p.id }}><Pencil className="w-4 h-4" /></Link></Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
      {editing && <PostEditor post={editing} categories={cats} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); void load(); }} />}
    </div>
  );
}

function PostEditor({ post, categories, onClose, onSaved }: { post: Post; categories: Category[]; onClose: () => void; onSaved: () => void }) {
  const [p, setP] = useState<Post>(post);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("blog_posts").update({
      slug: p.slug, category_id: p.category_id, status: p.status,
      title_ar: p.title_ar, title_en: p.title_en,
      excerpt_ar: p.excerpt_ar, excerpt_en: p.excerpt_en,
      cover_image_url: p.cover_image_url, reading_minutes: p.reading_minutes,
      author_ar: p.author_ar, author_en: p.author_en,
      body: p.body as never,
      table_of_contents_ar: p.table_of_contents_ar as never,
      table_of_contents_en: p.table_of_contents_en as never,
      faq: p.faq as never,
      internal_links: p.internal_links as never,
      cta: (p.cta ?? null) as never,
      keywords_ar: p.keywords_ar, keywords_en: p.keywords_en,
      meta_title_ar: p.meta_title_ar, meta_title_en: p.meta_title_en,
      meta_description_ar: p.meta_description_ar, meta_description_en: p.meta_description_en,
      published_at: p.published_at,
    }).eq("id", p.id);
    setSaving(false);
    if (error) toast.error(error.message); else { toast.success("تم الحفظ"); onSaved(); }
  };

  const addSection = () => setP({ ...p, body: [...p.body, { id: `s_${Date.now()}`, heading: "", body: "" }] });
  const updSection = (i: number, patch: Partial<Section>) => setP({ ...p, body: p.body.map((s, idx) => idx === i ? { ...s, ...patch } : s) });
  const delSection = (i: number) => setP({ ...p, body: p.body.filter((_, idx) => idx !== i) });

  const addToc = (lang: "ar" | "en") => {
    const key = lang === "ar" ? "table_of_contents_ar" : "table_of_contents_en";
    setP({ ...p, [key]: [...p[key], { id: `t_${Date.now()}`, label: "" }] });
  };
  const updToc = (lang: "ar" | "en", i: number, label: string) => {
    const key = lang === "ar" ? "table_of_contents_ar" : "table_of_contents_en";
    setP({ ...p, [key]: p[key].map((t, idx) => idx === i ? { ...t, label } : t) });
  };
  const delToc = (lang: "ar" | "en", i: number) => {
    const key = lang === "ar" ? "table_of_contents_ar" : "table_of_contents_en";
    setP({ ...p, [key]: p[key].filter((_, idx) => idx !== i) });
  };

  const addFaq = () => setP({ ...p, faq: [...p.faq, { q: "", a: "" }] });
  const updFaq = (i: number, patch: Partial<Faq>) => setP({ ...p, faq: p.faq.map((f, idx) => idx === i ? { ...f, ...patch } : f) });
  const delFaq = (i: number) => setP({ ...p, faq: p.faq.filter((_, idx) => idx !== i) });

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="left" className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader><SheetTitle>محرر المقال</SheetTitle></SheetHeader>
        <Tabs defaultValue="content" className="mt-4">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="content">المحتوى</TabsTrigger>
            <TabsTrigger value="toc">TOC</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="meta">إعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>العنوان (عربي)</Label><Input value={p.title_ar} onChange={(e) => setP({ ...p, title_ar: e.target.value })} /></div>
              <div dir="ltr"><Label>Title (EN)</Label><Input value={p.title_en} onChange={(e) => setP({ ...p, title_en: e.target.value })} /></div>
            </div>
            <div><Label>مقدمة قصيرة (AR)</Label><Textarea rows={2} value={p.excerpt_ar ?? ""} onChange={(e) => setP({ ...p, excerpt_ar: e.target.value })} /></div>
            <div dir="ltr"><Label>Excerpt (EN)</Label><Textarea rows={2} value={p.excerpt_en ?? ""} onChange={(e) => setP({ ...p, excerpt_en: e.target.value })} /></div>
            <div><Label>صورة الغلاف URL</Label><Input dir="ltr" value={p.cover_image_url ?? ""} onChange={(e) => setP({ ...p, cover_image_url: e.target.value })} /></div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="font-medium text-sm">أقسام المقال</div>
              <Button size="sm" variant="outline" onClick={addSection}><Plus className="w-3.5 h-3.5 ml-1" /> قسم</Button>
            </div>
            {p.body.length === 0 && <div className="text-xs text-muted-foreground text-center py-4">لا أقسام — اضغط "قسم"</div>}
            <div className="space-y-3">
              {p.body.map((s, i) => (
                <Card key={s.id} className="p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Input placeholder="عنوان القسم" value={s.heading} onChange={(e) => updSection(i, { heading: e.target.value })} />
                    <Button variant="ghost" size="icon" onClick={() => delSection(i)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                  <Textarea rows={5} placeholder="محتوى القسم (Markdown)" value={s.body} onChange={(e) => updSection(i, { body: e.target.value })} />
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="toc" className="space-y-4 mt-4">
            {(["ar", "en"] as const).map((lang) => (
              <div key={lang} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{lang === "ar" ? "جدول المحتويات (عربي)" : "TOC (English)"}</div>
                  <Button size="sm" variant="outline" onClick={() => addToc(lang)}><Plus className="w-3.5 h-3.5 ml-1" /> عنصر</Button>
                </div>
                {p[lang === "ar" ? "table_of_contents_ar" : "table_of_contents_en"].map((t, i) => (
                  <div key={t.id} className="flex gap-2" dir={lang === "ar" ? "rtl" : "ltr"}>
                    <Input value={t.label} onChange={(e) => updToc(lang, i, e.target.value)} placeholder={lang === "ar" ? "نص العنصر" : "Item label"} />
                    <Button variant="ghost" size="icon" onClick={() => delToc(lang, i)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                ))}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="faq" className="space-y-3 mt-4">
            <div className="flex justify-end"><Button size="sm" variant="outline" onClick={addFaq}><Plus className="w-3.5 h-3.5 ml-1" /> سؤال</Button></div>
            {p.faq.length === 0 && <div className="text-xs text-muted-foreground text-center py-4">لا أسئلة بعد</div>}
            {p.faq.map((f, i) => (
              <Card key={i} className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Input placeholder="السؤال" value={f.q} onChange={(e) => updFaq(i, { q: e.target.value })} />
                  <Button variant="ghost" size="icon" onClick={() => delFaq(i)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
                <Textarea rows={3} placeholder="الإجابة" value={f.a} onChange={(e) => updFaq(i, { a: e.target.value })} />
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="seo" className="space-y-3 mt-4">
            <div><Label>Meta Title (AR)</Label><Input value={p.meta_title_ar ?? ""} onChange={(e) => setP({ ...p, meta_title_ar: e.target.value })} /></div>
            <div><Label>Meta Description (AR)</Label><Textarea rows={2} value={p.meta_description_ar ?? ""} onChange={(e) => setP({ ...p, meta_description_ar: e.target.value })} /></div>
            <div><Label>كلمات مفتاحية (AR)</Label><StringArrayEditor value={p.keywords_ar ?? []} onChange={(v) => setP({ ...p, keywords_ar: v })} /></div>
            <Separator />
            <div dir="ltr"><Label>Meta Title (EN)</Label><Input value={p.meta_title_en ?? ""} onChange={(e) => setP({ ...p, meta_title_en: e.target.value })} /></div>
            <div dir="ltr"><Label>Meta Description (EN)</Label><Textarea rows={2} value={p.meta_description_en ?? ""} onChange={(e) => setP({ ...p, meta_description_en: e.target.value })} /></div>
            <div dir="ltr"><Label>Keywords (EN)</Label><StringArrayEditor value={p.keywords_en ?? []} onChange={(v) => setP({ ...p, keywords_en: v })} dir="ltr" /></div>
          </TabsContent>

          <TabsContent value="meta" className="space-y-3 mt-4">
            <div><Label>Slug</Label><Input dir="ltr" value={p.slug} onChange={(e) => setP({ ...p, slug: e.target.value })} className="font-mono text-sm" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>الكاتب (AR)</Label><Input value={p.author_ar ?? ""} onChange={(e) => setP({ ...p, author_ar: e.target.value })} /></div>
              <div dir="ltr"><Label>Author (EN)</Label><Input value={p.author_en ?? ""} onChange={(e) => setP({ ...p, author_en: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>دقائق القراءة</Label><Input type="number" value={p.reading_minutes} onChange={(e) => setP({ ...p, reading_minutes: Number(e.target.value) || 1 })} /></div>
              <div>
                <Label>التصنيف</Label>
                <Select value={p.category_id ?? "_none"} onValueChange={(v) => setP({ ...p, category_id: v === "_none" ? null : v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">— بدون —</SelectItem>
                    {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name_ar}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>الحالة</Label>
              <Select value={p.status} onValueChange={(v) => setP({ ...p, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">مسودة</SelectItem>
                  <SelectItem value="scheduled">مجدول</SelectItem>
                  <SelectItem value="published">منشور</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> تاريخ النشر</Label>
              <Input
                type="datetime-local"
                value={p.published_at ? new Date(p.published_at).toISOString().slice(0, 16) : ""}
                onChange={(e) => setP({ ...p, published_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
              />
              <p className="text-[10px] text-muted-foreground mt-1">اتركه فارغ للنشر الفوري عند تغيير الحالة لـ "منشور"</p>
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