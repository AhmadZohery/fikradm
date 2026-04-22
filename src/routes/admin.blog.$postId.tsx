import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Loader2,
  Save,
  Eye,
  EyeOff,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ListTree,
  History,
  Copy,
  ExternalLink,
  Clock,
  Calendar,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/cms/editor/RichTextEditor";
import { MediaPickerDialog } from "@/cms/editor/MediaPickerDialog";
import { StringArrayEditor } from "@/cms/admin/StringArrayEditor";
import { LocaleSwitcher } from "@/cms/admin/LocaleSwitcher";
import { SchedulePublishField } from "@/cms/admin/SchedulePublishField";
import { BlogRevisionsDialog, type BlogSnapshot } from "@/cms/admin/BlogRevisionsDialog";
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
  analyzeBlog,
  extractToc,
  inferFocusKeyword,
  stripHtml,
  type BlogTocItem,
} from "@/cms/admin/blogAnalysis";

export const Route = createFileRoute("/admin/blog/$postId")({
  component: BlogPostEditorPage,
});

type Lang = "ar" | "en";

type Faq = { q: string; a: string };
type CategoryRow = { id: string; name_ar: string; name_en: string };

type PostState = {
  id: string;
  slug: string;
  status: string;
  category_id: string | null;
  cover_image_url: string | null;
  cover_alt: string;
  reading_minutes: number;
  published_at: string | null;
  scheduled_publish_at: string | null;
  scheduled_unpublish_at: string | null;
  title_ar: string;
  title_en: string;
  excerpt_ar: string;
  excerpt_en: string;
  body_html_ar: string;
  body_html_en: string;
  meta_title_ar: string;
  meta_title_en: string;
  meta_description_ar: string;
  meta_description_en: string;
  keywords_ar: string[];
  keywords_en: string[];
  focus_keyword_ar: string;
  focus_keyword_en: string;
  toc_ar: BlogTocItem[];
  toc_en: BlogTocItem[];
  faq: Faq[];
  author_ar: string;
  author_en: string;
};

function htmlFromBody(body: unknown, lang: Lang): string {
  if (!Array.isArray(body)) return "";
  // Legacy structure: array of { heading, body }. Concatenate to HTML.
  return body
    .map((s) => {
      const o = s as { heading?: string; body?: string; html?: string; lang?: Lang };
      if (o.html && (!o.lang || o.lang === lang)) return o.html;
      const h = o.heading ? `<h2>${o.heading}</h2>` : "";
      const b = o.body ? `<p>${o.body}</p>` : "";
      return h + b;
    })
    .join("\n");
}

function BlogPostEditorPage() {
  const { postId } = Route.useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cats, setCats] = useState<CategoryRow[]>([]);
  const [post, setPost] = useState<PostState | null>(null);
  const [lang, setLang] = useState<Lang>("ar");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [revisionsOpen, setRevisionsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const lastTocAutoUpdate = useRef<{ ar: string; en: string }>({ ar: "", en: "" });
  const [dirty, setDirty] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [autoSaveOn, setAutoSaveOn] = useState(true);
  const dirtyRef = useRef(false);
  const postRef = useRef<PostState | null>(null);
  useEffect(() => { postRef.current = post; }, [post]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [postRes, catsRes] = await Promise.all([
        supabase.from("blog_posts").select("*").eq("id", postId).maybeSingle(),
        supabase.from("blog_categories").select("id, name_ar, name_en").order("sort_order"),
      ]);
      if (cancelled) return;
      if (postRes.error || !postRes.data) {
        toast.error("المقال غير موجود");
        navigate({ to: "/admin/blog" });
        return;
      }
      const r = postRes.data as Record<string, unknown>;
      const bodyVal = r.body as unknown;
      const ar = htmlFromBody(bodyVal, "ar");
      const en = htmlFromBody(bodyVal, "en");
      // body might be { ar, en } object instead of legacy array
      const finalAr =
        bodyVal && typeof bodyVal === "object" && !Array.isArray(bodyVal) && "ar" in (bodyVal as object)
          ? String((bodyVal as { ar?: string }).ar ?? "")
          : ar;
      const finalEn =
        bodyVal && typeof bodyVal === "object" && !Array.isArray(bodyVal) && "en" in (bodyVal as object)
          ? String((bodyVal as { en?: string }).en ?? "")
          : en;
      setPost({
        id: String(r.id),
        slug: String(r.slug ?? ""),
        status: String(r.status ?? "draft"),
        category_id: (r.category_id as string) ?? null,
        cover_image_url: (r.cover_image_url as string) ?? null,
        cover_alt: "",
        reading_minutes: Number(r.reading_minutes ?? 5),
        published_at: (r.published_at as string) ?? null,
        scheduled_publish_at: (r.scheduled_publish_at as string) ?? null,
        scheduled_unpublish_at: (r.scheduled_unpublish_at as string) ?? null,
        title_ar: String(r.title_ar ?? ""),
        title_en: String(r.title_en ?? ""),
        excerpt_ar: String(r.excerpt_ar ?? ""),
        excerpt_en: String(r.excerpt_en ?? ""),
        body_html_ar: finalAr,
        body_html_en: finalEn,
        meta_title_ar: String(r.meta_title_ar ?? ""),
        meta_title_en: String(r.meta_title_en ?? ""),
        meta_description_ar: String(r.meta_description_ar ?? ""),
        meta_description_en: String(r.meta_description_en ?? ""),
        keywords_ar: Array.isArray(r.keywords_ar) ? (r.keywords_ar as string[]) : [],
        keywords_en: Array.isArray(r.keywords_en) ? (r.keywords_en as string[]) : [],
        focus_keyword_ar: Array.isArray(r.keywords_ar) && r.keywords_ar.length ? String((r.keywords_ar as string[])[0]) : "",
        focus_keyword_en: Array.isArray(r.keywords_en) && r.keywords_en.length ? String((r.keywords_en as string[])[0]) : "",
        toc_ar: Array.isArray(r.table_of_contents_ar) ? (r.table_of_contents_ar as BlogTocItem[]) : [],
        toc_en: Array.isArray(r.table_of_contents_en) ? (r.table_of_contents_en as BlogTocItem[]) : [],
        faq: Array.isArray(r.faq) ? (r.faq as Faq[]) : [],
        author_ar: String(r.author_ar ?? ""),
        author_en: String(r.author_en ?? ""),
      });
      setCats((catsRes.data ?? []) as CategoryRow[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [postId, navigate]);

  // Auto-extract TOC (debounced) — DOES NOT rewrite body HTML, only updates toc list
  // to avoid breaking cursor position inside the editor on every keystroke.
  useEffect(() => {
    if (!post) return;
    const html = lang === "ar" ? post.body_html_ar : post.body_html_en;
    if (lastTocAutoUpdate.current[lang] === html) return;
    const t = setTimeout(() => {
      const { toc } = extractToc(html);
      lastTocAutoUpdate.current[lang] = html;
      setPost((prev) => {
        if (!prev) return prev;
        const tocKey = lang === "ar" ? "toc_ar" : "toc_en";
        if (JSON.stringify(prev[tocKey]) === JSON.stringify(toc)) return prev;
        return { ...prev, [tocKey]: toc };
      });
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?.body_html_ar, post?.body_html_en, lang]);

  const report = useMemo(() => {
    if (!post) return null;
    return analyzeBlog({
      title: lang === "ar" ? post.title_ar : post.title_en,
      slug: post.slug,
      excerpt: lang === "ar" ? post.excerpt_ar : post.excerpt_en,
      metaTitle: lang === "ar" ? post.meta_title_ar : post.meta_title_en,
      metaDescription: lang === "ar" ? post.meta_description_ar : post.meta_description_en,
      bodyHtml: lang === "ar" ? post.body_html_ar : post.body_html_en,
      focusKeyword: lang === "ar" ? post.focus_keyword_ar : post.focus_keyword_en,
      coverImageUrl: post.cover_image_url ?? "",
      coverImageAlt: post.cover_alt,
    });
  }, [post, lang]);

  const save = async () => {
    if (!post) return;
    setSaving(true);
    const body = { ar: post.body_html_ar, en: post.body_html_en };
    const reading =
      report?.readingMinutes && report.readingMinutes > 0
        ? report.readingMinutes
        : post.reading_minutes;
    const { error } = await supabase
      .from("blog_posts")
      .update({
        slug: post.slug,
        category_id: post.category_id,
        cover_image_url: post.cover_image_url,
        reading_minutes: reading,
        scheduled_publish_at: post.scheduled_publish_at as never,
        scheduled_unpublish_at: post.scheduled_unpublish_at as never,
        title_ar: post.title_ar,
        title_en: post.title_en,
        excerpt_ar: post.excerpt_ar,
        excerpt_en: post.excerpt_en,
        meta_title_ar: post.meta_title_ar,
        meta_title_en: post.meta_title_en,
        meta_description_ar: post.meta_description_ar,
        meta_description_en: post.meta_description_en,
        keywords_ar: post.keywords_ar,
        keywords_en: post.keywords_en,
        author_ar: post.author_ar,
        author_en: post.author_en,
        body: body as never,
        table_of_contents_ar: post.toc_ar as never,
        table_of_contents_en: post.toc_en as never,
        faq: post.faq as never,
      })
      .eq("id", post.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      setDirty(false);
      dirtyRef.current = false;
      setLastSavedAt(new Date());
      // Snapshot to revisions (best-effort, ignore failures)
      void supabase.from("blog_revisions" as never).insert({
        post_id: post.id,
        snapshot: post as never,
      } as never);
    }
  };

  // Auto-save every 30s when dirty
  const saveRef = useRef(save);
  useEffect(() => { saveRef.current = save; });
  useEffect(() => {
    if (!autoSaveOn) return;
    const id = window.setInterval(() => {
      if (dirtyRef.current && !saving) void saveRef.current();
    }, 30_000);
    return () => window.clearInterval(id);
  }, [autoSaveOn, saving]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const before = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) { e.preventDefault(); e.returnValue = ""; }
    };
    window.addEventListener("beforeunload", before);
    return () => window.removeEventListener("beforeunload", before);
  }, []);

  const duplicate = async () => {
    if (!post) return;
    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        slug: `${post.slug}-copy-${Date.now().toString(36).slice(-4)}`,
        title_ar: `${post.title_ar} (نسخة)`,
        title_en: `${post.title_en} (Copy)`,
        excerpt_ar: post.excerpt_ar,
        excerpt_en: post.excerpt_en,
        cover_image_url: post.cover_image_url,
        reading_minutes: post.reading_minutes,
        category_id: post.category_id,
        body: { ar: post.body_html_ar, en: post.body_html_en } as never,
        keywords_ar: post.keywords_ar,
        keywords_en: post.keywords_en,
        author_ar: post.author_ar,
        author_en: post.author_en,
        meta_title_ar: post.meta_title_ar,
        meta_title_en: post.meta_title_en,
        meta_description_ar: post.meta_description_ar,
        meta_description_en: post.meta_description_en,
        faq: post.faq as never,
        status: "draft",
      })
      .select("id")
      .single();
    if (error || !data) return toast.error(error?.message ?? "فشل النسخ");
    toast.success("تم النسخ كمسودة جديدة");
    navigate({ to: "/admin/blog/$postId", params: { postId: data.id } });
  };

  const togglePublish = async () => {
    if (!post) return;
    const next = post.status === "published" ? "draft" : "published";
    const published_at = next === "published" ? new Date().toISOString() : null;
    const { error } = await supabase
      .from("blog_posts")
      .update({ status: next, published_at })
      .eq("id", post.id);
    if (error) return toast.error(error.message);
    setPost({ ...post, status: next, published_at });
    toast.success(next === "published" ? "تم النشر" : "أصبح مسودة");
  };

  const inferKw = () => {
    if (!post) return;
    const html = lang === "ar" ? post.body_html_ar : post.body_html_en;
    const title = lang === "ar" ? post.title_ar : post.title_en;
    const text = stripHtml(html);
    const kw = inferFocusKeyword(title, text);
    if (!kw) return toast.info("لا يوجد محتوى كافٍ للاستنتاج");
    if (lang === "ar") setPost({ ...post, focus_keyword_ar: kw });
    else setPost({ ...post, focus_keyword_en: kw });
    toast.success(`اقتراح: ${kw}`);
  };

  const handleRestore = (snap: BlogSnapshot) => {
    setPost((prev) => {
      if (!prev) return prev;
      return { ...prev, ...(snap as Partial<PostState>), id: prev.id };
    });
    setDirty(true);
    dirtyRef.current = true;
  };

  const handleDelete = async () => {
    if (!post) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", post.id);
    if (error) return toast.error(error.message);
    toast.success("تم حذف المقال");
    navigate({ to: "/admin/blog" });
  };

  if (loading || !post) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin ml-2" /> جاري التحميل...
      </div>
    );
  }

  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const titleVal = lang === "ar" ? post.title_ar : post.title_en;
  const excerptVal = lang === "ar" ? post.excerpt_ar : post.excerpt_en;
  const metaTitleVal = lang === "ar" ? post.meta_title_ar : post.meta_title_en;
  const metaDescVal = lang === "ar" ? post.meta_description_ar : post.meta_description_en;
  const bodyVal = lang === "ar" ? post.body_html_ar : post.body_html_en;
  const tocVal = lang === "ar" ? post.toc_ar : post.toc_en;
  const focusKw = lang === "ar" ? post.focus_keyword_ar : post.focus_keyword_en;
  const keywordsVal = lang === "ar" ? post.keywords_ar : post.keywords_en;

  const setField = <K extends keyof PostState>(k: K, v: PostState[K]) => {
    setPost({ ...post, [k]: v });
    if (!dirty) setDirty(true);
    dirtyRef.current = true;
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <Button asChild variant="ghost" size="icon">
            <Link to="/admin/blog"><ArrowRight className="w-4 h-4" /></Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl font-bold truncate">{post.title_ar || "مقال جديد"}</h1>
            <div className="text-xs text-muted-foreground font-mono truncate" dir="ltr">/{post.slug}</div>
          </div>
          <Badge variant={post.status === "published" ? "default" : "secondary"}>
            {post.status === "published" ? "منشور" : post.status === "scheduled" ? "مجدول" : "مسودة"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <LocaleSwitcher value={lang} onChange={setLang} />
          {dirty ? (
            <span className="text-[11px] text-amber-600 flex items-center gap-1">
              <Clock className="w-3 h-3" /> غير محفوظ
            </span>
          ) : lastSavedAt ? (
            <span className="text-[11px] text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> محفوظ {lastSavedAt.toLocaleTimeString("ar-EG")}
            </span>
          ) : null}
          <Button asChild variant="ghost" size="icon" title="معاينة">
            <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4" /></a>
          </Button>
          <Button variant="ghost" size="icon" title="نسخ المقال" onClick={duplicate}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={togglePublish}>
            {post.status === "published" ? <EyeOff className="w-4 h-4 ml-1" /> : <Eye className="w-4 h-4 ml-1" />}
            {post.status === "published" ? "إخفاء" : "نشر"}
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 ml-1 animate-spin" /> : <Save className="w-4 h-4 ml-1" />}
            حفظ
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
        {/* Main editor column */}
        <div className="space-y-4 min-w-0">
          <Card className="p-4 space-y-3">
            <div>
              <Label>{t("العنوان (عربي)", "Title (English)")}</Label>
              <Input
                dir={lang === "ar" ? "rtl" : "ltr"}
                value={titleVal}
                onChange={(e) => setField(lang === "ar" ? "title_ar" : "title_en", e.target.value)}
                className="text-lg font-bold"
                placeholder={t("اكتب عنوان جذاب…", "Catchy title…")}
              />
              <Hint text={t("بين 40-60 حرف يحقق أعلى CTR في Google.", "40-60 chars give the highest CTR in Google.")} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Slug</Label>
                <Input dir="ltr" className="font-mono text-sm" value={post.slug} onChange={(e) => setField("slug", e.target.value)} />
                <Hint text="حروف صغيرة وأرقام وشَرْطَة فقط، يفضّل احتواء الكلمة المفتاحية." />
              </div>
              <div>
                <Label>التصنيف</Label>
                <Select value={post.category_id ?? ""} onValueChange={(v) => setField("category_id", v || null)}>
                  <SelectTrigger><SelectValue placeholder="بدون" /></SelectTrigger>
                  <SelectContent>
                    {cats.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name_ar}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>{t("مقدمة قصيرة", "Excerpt")}</Label>
              <Textarea
                rows={2}
                dir={lang === "ar" ? "rtl" : "ltr"}
                value={excerptVal}
                onChange={(e) => setField(lang === "ar" ? "excerpt_ar" : "excerpt_en", e.target.value)}
                placeholder={t("ملخّص يظهر في القوائم وفي SERP لو ما عندكش Meta Description.", "Shown in listings and SERP fallback.")}
              />
              <Hint text={t(`المُفضّل 120-160 حرف. الحالي: ${excerptVal.length}`, `Best 120-160 chars. Now: ${excerptVal.length}`)} />
            </div>
            <div>
              <Label>{t("صورة الغلاف (Featured)", "Cover Image (Featured)")}</Label>
              <div className="flex items-center gap-3 mt-1">
                {post.cover_image_url ? (
                  <img src={post.cover_image_url} alt={post.cover_alt} className="w-32 h-20 object-cover rounded border" />
                ) : (
                  <div className="w-32 h-20 rounded border bg-muted flex items-center justify-center text-xs text-muted-foreground">لا يوجد</div>
                )}
                <div className="flex flex-col gap-2 flex-1">
                  <Button variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
                    <ImageIcon className="w-4 h-4 ml-1" /> {post.cover_image_url ? "تغيير" : "اختر من المكتبة"}
                  </Button>
                  {post.cover_image_url && (
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setField("cover_image_url", null)}>إزالة</Button>
                  )}
                </div>
              </div>
              <Hint text="1200×630 يفضّل لـ OG. لا تنسَ الـ alt للوصول والـ SEO." />
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="px-3 py-2 border-b text-xs text-muted-foreground bg-muted/30 flex justify-between">
              <span>{t("استخدم H2/H3 لبناء جدول المحتويات تلقائياً.", "Use H2/H3 to build the TOC automatically.")}</span>
              <span>{report?.wordCount ?? 0} كلمة · ~{report?.readingMinutes ?? 0} د قراءة</span>
            </div>
            <RichTextEditor
              key={lang}
              value={bodyVal}
              onChange={(html) => setField(lang === "ar" ? "body_html_ar" : "body_html_en", html)}
              minHeight={420}
              dir={lang === "ar" ? "rtl" : "ltr"}
              placeholder={t("ابدأ كتابة المقال هنا… استخدم Slash أو شريط الأدوات.", "Start writing here…")}
            />
          </Card>

          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2"><ListTree className="w-4 h-4" /> جدول المحتويات (تلقائي)</h3>
              <Badge variant="outline">{tocVal.length} عنصر</Badge>
            </div>
            {tocVal.length === 0 ? (
              <div className="text-xs text-muted-foreground">أضف عناوين H2/H3 في النص ليُبنى TOC تلقائياً.</div>
            ) : (
              <ol className="text-sm space-y-1">
                {tocVal.map((item) => (
                  <li key={item.id} className={item.level === 3 ? "pr-5" : ""}>
                    <a href={`#${item.id}`} className="text-primary hover:underline">{item.label}</a>
                  </li>
                ))}
              </ol>
            )}
          </Card>

          <Card className="p-4 space-y-3">
            <h3 className="font-semibold">إعدادات SEO</h3>
            <div>
              <Label>{t("Meta Title", "Meta Title")}</Label>
              <Input
                value={metaTitleVal}
                onChange={(e) => setField(lang === "ar" ? "meta_title_ar" : "meta_title_en", e.target.value)}
                placeholder={titleVal}
              />
              <Hint text={`30-60 حرف · الحالي: ${metaTitleVal.length}`} status={metaTitleVal.length === 0 ? "bad" : metaTitleVal.length < 30 || metaTitleVal.length > 60 ? "warn" : "good"} />
            </div>
            <div>
              <Label>{t("Meta Description", "Meta Description")}</Label>
              <Textarea
                rows={3}
                value={metaDescVal}
                onChange={(e) => setField(lang === "ar" ? "meta_description_ar" : "meta_description_en", e.target.value)}
                placeholder={excerptVal}
              />
              <Hint text={`70-160 حرف · الحالي: ${metaDescVal.length}`} status={metaDescVal.length === 0 ? "bad" : metaDescVal.length < 70 || metaDescVal.length > 160 ? "warn" : "good"} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="flex items-center justify-between">
                  الكلمة المفتاحية الأساسية
                  <Button type="button" variant="ghost" size="sm" className="h-6 text-xs" onClick={inferKw}>
                    <Sparkles className="w-3 h-3 ml-1" /> استنتاج تلقائي
                  </Button>
                </Label>
                <Input
                  value={focusKw}
                  onChange={(e) => setField(lang === "ar" ? "focus_keyword_ar" : "focus_keyword_en", e.target.value)}
                  placeholder="مثال: تصميم مواقع"
                />
                <Hint text="ضعها في العنوان، الـ slug، أول 100 كلمة، وعنوان فرعي واحد على الأقل." />
              </div>
              <div>
                <Label>كلمات مفتاحية إضافية</Label>
                <StringArrayEditor
                  value={keywordsVal}
                  onChange={(arr) => setField(lang === "ar" ? "keywords_ar" : "keywords_en", arr)}
                  placeholder="أضف ثم Enter"
                />
              </div>
            </div>
          </Card>

          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">FAQ (اختياري)</h3>
              <Button size="sm" variant="outline" onClick={() => setField("faq", [...post.faq, { q: "", a: "" }])}>+ سؤال</Button>
            </div>
            {post.faq.length === 0 && <div className="text-xs text-muted-foreground">إضافة 3-5 أسئلة شائعة يحسّن ظهورك في FAQ Rich Results.</div>}
            {post.faq.map((f, i) => (
              <div key={i} className="space-y-1 border rounded p-3">
                <Input placeholder="السؤال" value={f.q} onChange={(e) => setField("faq", post.faq.map((x, idx) => idx === i ? { ...x, q: e.target.value } : x))} />
                <Textarea rows={2} placeholder="الإجابة" value={f.a} onChange={(e) => setField("faq", post.faq.map((x, idx) => idx === i ? { ...x, a: e.target.value } : x))} />
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setField("faq", post.faq.filter((_, idx) => idx !== i))}>حذف</Button>
              </div>
            ))}
          </Card>
        </div>

        {/* Sidebar: SEO score live */}
        <div className="space-y-3">
          <Card className="p-4 sticky top-16">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">نتيجة SEO</h3>
              <ScoreRing score={report?.score ?? 0} />
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              {report && report.score >= 80 ? "ممتاز ✨ جاهز للنشر." : report && report.score >= 50 ? "جيد، فيه نقاط للتحسين." : "محتاج شغل قبل النشر."}
            </div>
            <div className="mt-3 space-y-1.5 max-h-[60vh] overflow-y-auto pl-1">
              {report?.checks.map((c) => {
                const Icon = c.status === "good" ? CheckCircle2 : c.status === "warn" ? AlertTriangle : XCircle;
                const color = c.status === "good" ? "text-emerald-600" : c.status === "warn" ? "text-amber-600" : "text-rose-600";
                return (
                  <div key={c.id} className="flex items-start gap-2 text-xs">
                    <Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${color}`} />
                    <div className="min-w-0">
                      <div className="font-medium leading-tight">{c.label}</div>
                      {c.hint && <div className="text-[10px] text-muted-foreground">{c.hint}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      <MediaPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={(item) => {
          setField("cover_image_url", item.public_url);
          setField("cover_alt", item.filename);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}

function Hint({ text, status }: { text: string; status?: "good" | "warn" | "bad" }) {
  const cls =
    status === "good"
      ? "text-emerald-600"
      : status === "warn"
        ? "text-amber-600"
        : status === "bad"
          ? "text-rose-600"
          : "text-muted-foreground";
  return <div className={`text-[11px] mt-1 ${cls}`}>{text}</div>;
}

function ScoreRing({ score }: { score: number }) {
  const tone = score >= 80 ? "text-emerald-600 bg-emerald-500/10" : score >= 50 ? "text-amber-600 bg-amber-500/10" : "text-rose-600 bg-rose-500/10";
  return (
    <div className={`w-12 h-12 rounded-full grid place-items-center font-bold ${tone}`}>
      {score}
    </div>
  );
}
