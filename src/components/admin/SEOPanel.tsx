import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Sparkles, Search, Link2, ScanText, ShieldCheck, AlertTriangle,
  FileJson2, Loader2, Copy, CheckCircle2, ListTree,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  articleSchema, serviceSchema, faqSchema, breadcrumbSchema,
  readabilityScore, scoreEEAT, detectYMYL, slugify, type BreadcrumbItem,
} from "@/lib/schemaGen";
import {
  generateSEOMeta, generateSchema, suggestInternalLinks, generateFAQ,
} from "@/lib/seo-ai.functions";

export type SEOPanelValue = {
  slug: string;
  meta_title: string;
  meta_description: string;
  keywords: string[];
  faq?: { q: string; a: string }[];
  internal_links?: { url: string; anchor: string }[];
  schema_jsonld?: any;
  /** EEAT */
  author?: string;
  author_bio?: string;
  last_reviewed?: string | null;
  sources?: { label: string; url: string }[];
};

type Props = {
  kind: "Article" | "Service" | "Page";
  lang: "ar" | "en";
  title: string;
  body: string; // raw text or html
  breadcrumbs: BreadcrumbItem[];
  baseUrl: string; // canonical base e.g. /blog or /services
  value: SEOPanelValue;
  onChange: (next: Partial<SEOPanelValue>) => void;
};

export function SEOPanel({ kind, lang, title, body, breadcrumbs, baseUrl, value, onChange }: Props) {
  const genMeta = useServerFn(generateSEOMeta);
  const genSchema = useServerFn(generateSchema);
  const sugLinks = useServerFn(suggestInternalLinks);
  const genFaq = useServerFn(generateFAQ);

  const [busy, setBusy] = useState<string | null>(null);
  const readability = useMemo(() => readabilityScore(`${title}\n${body}`), [title, body]);
  const ymyl = useMemo(() => detectYMYL(`${title} ${body}`), [title, body]);

  const eeat = useMemo(() => ({
    hasAuthor: !!value.author,
    hasAuthorBio: !!value.author_bio,
    hasLastReviewed: !!value.last_reviewed,
    hasSources: (value.sources || []).length > 0,
    hasInternalLinks: (value.internal_links || []).length > 0,
    hasFaq: (value.faq || []).length > 0,
  }), [value]);
  const eeatScore = scoreEEAT(eeat);

  const titleLen = value.meta_title?.length || 0;
  const descLen = value.meta_description?.length || 0;
  const titleOK = titleLen >= 30 && titleLen <= 60;
  const descOK = descLen >= 120 && descLen <= 160;

  const previewSchema = useMemo(() => {
    const url = `https://fikradm.lovable.app${baseUrl}/${value.slug || slugify(title)}`;
    if (value.schema_jsonld) return value.schema_jsonld;
    if (kind === "Article") return articleSchema({
      title: value.meta_title || title,
      description: value.meta_description,
      url, image: undefined,
      author: value.author, authorRole: undefined,
      lastReviewed: value.last_reviewed || undefined,
      keywords: value.keywords, ymyl,
    });
    if (kind === "Service") return serviceSchema({
      name: value.meta_title || title, description: value.meta_description, url,
    });
    return null;
  }, [kind, value, title, baseUrl, ymyl]);

  const allSchemas = useMemo(() => {
    const list = [];
    if (previewSchema) list.push(previewSchema);
    if (breadcrumbs.length) list.push(breadcrumbSchema(breadcrumbs));
    if ((value.faq || []).length) list.push(faqSchema(value.faq!));
    return list;
  }, [previewSchema, breadcrumbs, value.faq]);

  const run = async (key: string, fn: () => Promise<void>) => {
    setBusy(key);
    try { await fn(); } catch (e: any) { toast.error(e?.message || "خطأ"); } finally { setBusy(null); }
  };

  return (
    <Card className="p-4 space-y-4" dir="rtl">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold"><Search className="h-4 w-4 text-primary" /> قسم SEO المتكامل</h3>
        <div className="flex items-center gap-2 text-xs">
          <Badge variant={ymyl ? "destructive" : "outline"}>{ymyl ? "YMYL" : "Non-YMYL"}</Badge>
          <Badge variant="outline">EEAT {eeatScore}%</Badge>
          <Badge variant={readability.score >= 60 ? "default" : "outline"}>قراءة {readability.score}</Badge>
        </div>
      </div>

      <Tabs defaultValue="basics">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="eeat">EEAT/SXO</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-3 pt-3">
          <div>
            <Label className="text-xs">SEO URL (slug)</Label>
            <div className="flex gap-2">
              <Input value={value.slug} onChange={(e) => onChange({ slug: e.target.value })} placeholder="my-page-slug" className="font-mono text-sm" />
              <Button type="button" variant="outline" size="sm" onClick={() => onChange({ slug: slugify(title) })}>Auto</Button>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">{baseUrl}/{value.slug || slugify(title) || "…"}</p>
          </div>
          <div>
            <Label className="text-xs flex justify-between">SEO Title <span className={titleOK ? "text-green-600" : "text-amber-600"}>{titleLen}/60</span></Label>
            <Input value={value.meta_title} onChange={(e) => onChange({ meta_title: e.target.value })} placeholder="عنوان جذاب 30-60 حرف" />
          </div>
          <div>
            <Label className="text-xs flex justify-between">Meta Description <span className={descOK ? "text-green-600" : "text-amber-600"}>{descLen}/160</span></Label>
            <Textarea value={value.meta_description} onChange={(e) => onChange({ meta_description: e.target.value })} rows={3} placeholder="وصف 120-160 حرف يشمل CTA والكلمة المفتاحية" />
          </div>
          <div>
            <Label className="text-xs">Keywords (افصل بفاصلة)</Label>
            <Input value={(value.keywords || []).join(", ")} onChange={(e) => onChange({ keywords: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
          </div>

          {/* SERP preview */}
          <div className="rounded border bg-muted/30 p-3 text-sm" dir="ltr">
            <div className="text-xs text-muted-foreground">{baseUrl}/{value.slug || slugify(title)}</div>
            <div className="truncate text-blue-700">{value.meta_title || title || "Title"}</div>
            <div className="line-clamp-2 text-xs text-muted-foreground">{value.meta_description || "Meta description preview…"}</div>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-3 pt-3">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" disabled={busy !== null} onClick={() => run("meta", async () => {
              const r: any = await genMeta({ data: { topic: title, lang, context: body.slice(0, 4000) } });
              if (r?.title) onChange({ meta_title: r.title, meta_description: r.description, keywords: r.keywords || value.keywords });
              toast.success("AI ولّد عناوين SEO");
            })}>
              {busy === "meta" ? <Loader2 className="me-1 h-3.5 w-3.5 animate-spin" /> : <Sparkles className="me-1 h-3.5 w-3.5" />}
              ولّد SEO Meta
            </Button>
            <Button size="sm" variant="outline" disabled={busy !== null} onClick={() => run("faq", async () => {
              const r: any = await genFaq({ data: { text: body, lang, count: 5 } });
              if (r?.faq?.length) onChange({ faq: r.faq });
              toast.success("AI ولّد FAQ");
            })}>
              {busy === "faq" ? <Loader2 className="me-1 h-3.5 w-3.5 animate-spin" /> : <Sparkles className="me-1 h-3.5 w-3.5" />}
              ولّد FAQ (AEO)
            </Button>
            <Button size="sm" variant="outline" disabled={busy !== null} onClick={() => run("schema", async () => {
              const r: any = await genSchema({ data: { kind: kind === "Service" ? "Service" : "Article", data: { title: value.meta_title || title, description: value.meta_description, keywords: value.keywords, author: value.author, lang } } });
              if (r) onChange({ schema_jsonld: r });
              toast.success("AI ولّد Schema");
            })}>
              {busy === "schema" ? <Loader2 className="me-1 h-3.5 w-3.5 animate-spin" /> : <FileJson2 className="me-1 h-3.5 w-3.5" />}
              ولّد Schema (AIO/GEO)
            </Button>
            <Button size="sm" variant="outline" disabled={busy !== null} onClick={() => run("links", async () => {
              const r: any = await sugLinks({ data: { text: `${title}\n${body}`, lang, limit: 8 } });
              if (r?.links?.length) onChange({ internal_links: r.links });
              toast.success(`AI اقترح ${r?.links?.length || 0} روابط داخلية`);
            })}>
              {busy === "links" ? <Loader2 className="me-1 h-3.5 w-3.5 animate-spin" /> : <Link2 className="me-1 h-3.5 w-3.5" />}
              اقترح Internal Links (LLMO)
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            ✨ ولّد عناصر SEO/AEO/AIO/GEO/LLMO تلقائياً مدمجة مع EEAT وYMYL. النتائج تتحرّر داخل نفس النموذج.
          </p>
        </TabsContent>

        <TabsContent value="schema" className="space-y-3 pt-3">
          <div className="text-xs text-muted-foreground">Schemas المُنتجة تلقائياً ({allSchemas.length}):</div>
          {allSchemas.map((s, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px]">{s["@type"]}</Badge>
                <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(JSON.stringify(s, null, 2)); toast.success("تم النسخ"); }}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <pre className="max-h-48 overflow-auto rounded bg-muted/50 p-2 text-[10px]" dir="ltr">{JSON.stringify(s, null, 2)}</pre>
            </div>
          ))}
          {value.schema_jsonld && (
            <Button size="sm" variant="outline" onClick={() => onChange({ schema_jsonld: null })}>إعادة لـ Auto Schema</Button>
          )}

          <div className="mt-3 rounded border p-3">
            <div className="mb-2 flex items-center gap-1 text-xs font-semibold"><ListTree className="h-3 w-3" /> Breadcrumb</div>
            <ol className="flex flex-wrap gap-1 text-xs" dir="ltr">
              {breadcrumbs.map((b, i) => (
                <li key={i} className="flex items-center gap-1">
                  <span className="text-primary">{b.name}</span>
                  {i < breadcrumbs.length - 1 && <span className="text-muted-foreground">›</span>}
                </li>
              ))}
            </ol>
          </div>
        </TabsContent>

        <TabsContent value="links" className="space-y-2 pt-3">
          {(value.internal_links || []).length === 0 && <p className="text-xs text-muted-foreground">لا توجد روابط داخلية بعد — استخدم تبويب AI لاقتراح روابط ذكية.</p>}
          {(value.internal_links || []).map((l, i) => (
            <div key={i} className="flex items-center gap-2 rounded border p-2 text-xs">
              <Link2 className="h-3 w-3 text-primary" />
              <span className="font-semibold">{l.anchor}</span>
              <span className="text-muted-foreground" dir="ltr">→ {l.url}</span>
              <Button size="sm" variant="ghost" className="ms-auto" onClick={() => {
                const next = (value.internal_links || []).filter((_, j) => j !== i);
                onChange({ internal_links: next });
              }}>حذف</Button>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="eeat" className="space-y-3 pt-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <EEATRow ok={eeat.hasAuthor} label="مؤلف (Author)" />
            <EEATRow ok={eeat.hasAuthorBio} label="Author Bio (Expertise)" />
            <EEATRow ok={eeat.hasLastReviewed} label="Last Reviewed (Trust)" />
            <EEATRow ok={eeat.hasSources} label="Sources / References" />
            <EEATRow ok={eeat.hasInternalLinks} label="Internal Links" />
            <EEATRow ok={eeat.hasFaq} label="FAQ (AEO)" />
          </div>

          <div className="rounded border p-3 text-xs">
            <div className="mb-1 flex items-center gap-1 font-semibold"><ScanText className="h-3 w-3" /> Readability & SXO</div>
            <div className="flex items-center justify-between">
              <span>درجة القراءة: <b>{readability.score}</b> ({readability.level})</span>
              <span className="text-muted-foreground">{readability.words} كلمة · {readability.sentences} جملة</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded bg-muted">
              <div className="h-full bg-primary transition-all" style={{ width: `${readability.score}%` }} />
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground">
              SXO: تأكد من سرعة الصفحة (Performance dashboard)، عنوان مطابق لنية البحث، وCTA واضح أعلى الطية.
            </div>
          </div>

          {ymyl && (
            <div className="flex items-start gap-2 rounded border border-destructive/40 bg-destructive/5 p-2 text-xs">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
              <div>
                <b>محتوى YMYL مُكتشف</b> — تأكد من: مؤلف خبير، مصادر طبية/مالية موثقة، تاريخ مراجعة حديث، إخلاء مسؤولية.
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}

function EEATRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded border p-2">
      {ok ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> : <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />}
      <span className={ok ? "" : "text-muted-foreground"}>{label}</span>
    </div>
  );
}