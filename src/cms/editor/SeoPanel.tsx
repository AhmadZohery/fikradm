import { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { analyzeSeo, type SeoCheck, type SeoFields } from "./seoAnalysis";

export type SeoData = {
  meta_title: string;
  meta_description: string;
  slug: string;
  locale: string;
  focus_keyword: string;
  og_image_url: string;
  canonical_url: string;
  keywords: string[];
  no_index: boolean;
};

type Props = {
  data: SeoData;
  onChange: (next: SeoData) => void;
};

const SITE_ORIGIN = "https://fikradm.lovable.app";

export function SeoPanel({ data, onChange }: Props) {
  const fields: SeoFields = {
    meta_title: data.meta_title,
    meta_description: data.meta_description,
    slug: data.slug,
    focus_keyword: data.focus_keyword,
    og_image_url: data.og_image_url,
    canonical_url: data.canonical_url,
    no_index: data.no_index,
  };
  const report = useMemo(() => analyzeSeo(fields), [
    data.meta_title,
    data.meta_description,
    data.slug,
    data.focus_keyword,
    data.og_image_url,
    data.canonical_url,
    data.no_index,
  ]);

  const set = <K extends keyof SeoData>(k: K, v: SeoData[K]) => onChange({ ...data, [k]: v });

  const url = `${SITE_ORIGIN}/${data.locale}${data.slug === "home" ? "" : `/${data.slug}`}`;

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pt-3 pb-2 border-b flex items-center justify-between">
        <div className="text-xs font-semibold">SEO Score</div>
        <ScoreBadge score={report.score} />
      </div>
      <Tabs defaultValue="basic" className="flex-1 flex flex-col min-h-0">
        <TabsList className="m-3 mb-0 grid grid-cols-4 h-8">
          <TabsTrigger value="basic" className="text-[11px] px-1">أساسي</TabsTrigger>
          <TabsTrigger value="social" className="text-[11px] px-1">Social</TabsTrigger>
          <TabsTrigger value="advanced" className="text-[11px] px-1">متقدم</TabsTrigger>
          <TabsTrigger value="analysis" className="text-[11px] px-1">تحليل</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <TabsContent value="basic" className="space-y-3 mt-0">
            <Field label={`Meta Title (${data.meta_title.length}/60)`}>
              <Input
                value={data.meta_title}
                onChange={(e) => set("meta_title", e.target.value)}
                maxLength={120}
              />
            </Field>
            <Field label={`Meta Description (${data.meta_description.length}/160)`}>
              <Textarea
                value={data.meta_description}
                onChange={(e) => set("meta_description", e.target.value)}
                rows={3}
                maxLength={300}
              />
            </Field>
            <Field label="URL Slug">
              <Input
                value={data.slug}
                onChange={(e) => set("slug", e.target.value)}
                dir="ltr"
                className="font-mono text-xs"
              />
            </Field>
            <Field label="الكلمة المفتاحية الأساسية">
              <Input
                value={data.focus_keyword}
                onChange={(e) => set("focus_keyword", e.target.value)}
                placeholder="مثال: تسويق رقمي"
              />
            </Field>
            <Field label="كلمات مفتاحية إضافية (مفصولة بفاصلة)">
              <Input
                value={data.keywords.join(", ")}
                onChange={(e) =>
                  set(
                    "keywords",
                    e.target.value
                      .split(",")
                      .map((k) => k.trim())
                      .filter(Boolean),
                  )
                }
              />
              {data.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {data.keywords.map((k) => (
                    <Badge key={k} variant="secondary" className="text-[10px]">{k}</Badge>
                  ))}
                </div>
              )}
            </Field>

            <SerpPreview title={data.meta_title} description={data.meta_description} url={url} />
          </TabsContent>

          <TabsContent value="social" className="space-y-3 mt-0">
            <Field label="Open Graph Image URL">
              <Input
                value={data.og_image_url}
                onChange={(e) => set("og_image_url", e.target.value)}
                placeholder="https://..."
                dir="ltr"
                className="text-xs"
              />
              <p className="text-[10px] text-muted-foreground mt-1">يُفضل 1200×630 بكسل</p>
            </Field>
            <SocialPreview
              title={data.meta_title}
              description={data.meta_description}
              image={data.og_image_url}
              url={url}
            />
          </TabsContent>

          <TabsContent value="advanced" className="space-y-3 mt-0">
            <Field label="Canonical URL">
              <Input
                value={data.canonical_url}
                onChange={(e) => set("canonical_url", e.target.value)}
                placeholder={url}
                dir="ltr"
                className="text-xs font-mono"
              />
            </Field>
            <div className="flex items-center justify-between p-2.5 border rounded-md">
              <div>
                <div className="text-sm font-medium">No-Index</div>
                <div className="text-[11px] text-muted-foreground">منع محركات البحث من فهرسة الصفحة</div>
              </div>
              <Switch
                checked={data.no_index}
                onCheckedChange={(v) => set("no_index", v)}
              />
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-2 mt-0">
            <div className="text-xs text-muted-foreground mb-2">
              {report.checks.filter((c) => c.status === "good").length} من {report.checks.length} فحوصات ناجحة
            </div>
            <ul className="space-y-1.5">
              {report.checks.map((c) => <CheckRow key={c.id} c={c} />)}
            </ul>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const tone =
    score >= 80
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
      : score >= 50
        ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
        : "bg-rose-500/15 text-rose-700 dark:text-rose-400";
  return <span className={`text-xs font-bold rounded-md px-2 py-0.5 ${tone}`}>{score}/100</span>;
}

function CheckRow({ c }: { c: SeoCheck }) {
  const Icon = c.status === "good" ? CheckCircle2 : c.status === "warn" ? AlertTriangle : XCircle;
  const color =
    c.status === "good" ? "text-emerald-600" : c.status === "warn" ? "text-amber-600" : "text-rose-600";
  return (
    <li className="flex items-start gap-2 p-2 rounded-md border bg-background text-xs">
      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${color}`} />
      <div className="min-w-0">
        <div className="font-medium">{c.label}</div>
        {c.hint && <div className="text-[10px] text-muted-foreground mt-0.5">{c.hint}</div>}
      </div>
    </li>
  );
}

function SerpPreview({ title, description, url }: { title: string; description: string; url: string }) {
  return (
    <div className="border rounded-md p-3 bg-background space-y-1" dir="ltr">
      <div className="text-[10px] text-muted-foreground uppercase">Google SERP Preview</div>
      <div className="text-[11px] text-emerald-700 dark:text-emerald-500 truncate">{url}</div>
      <div className="text-[15px] text-blue-700 dark:text-blue-400 truncate hover:underline cursor-pointer leading-tight">
        {title || "عنوان الصفحة هنا"}
      </div>
      <div className="text-[12px] text-muted-foreground line-clamp-2 leading-snug">
        {description || "وصف الصفحة سيظهر هنا في نتائج البحث..."}
      </div>
    </div>
  );
}

function SocialPreview({
  title,
  description,
  image,
  url,
}: {
  title: string;
  description: string;
  image: string;
  url: string;
}) {
  let host = "";
  try {
    host = new URL(url).hostname;
  } catch {
    host = url;
  }
  return (
    <div className="border rounded-md overflow-hidden bg-background" dir="ltr">
      <div className="text-[10px] text-muted-foreground uppercase px-3 pt-2">Social Card Preview</div>
      <div className="aspect-[1.91/1] bg-muted flex items-center justify-center text-xs text-muted-foreground overflow-hidden">
        {image ? (
          <img src={image} alt="" className="w-full h-full object-cover" />
        ) : (
          "لا توجد صورة OG"
        )}
      </div>
      <div className="p-3 space-y-1 border-t">
        <div className="text-[10px] uppercase text-muted-foreground">{host}</div>
        <div className="text-sm font-semibold line-clamp-1">{title || "عنوان الصفحة"}</div>
        <div className="text-[11px] text-muted-foreground line-clamp-2">
          {description || "وصف الصفحة"}
        </div>
      </div>
    </div>
  );
}
