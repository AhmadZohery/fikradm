import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ClipboardCopy, Check, AlertTriangle, Wand2 } from "lucide-react";
import { SITE_ORIGIN, SITE_NAME } from "@/lib/seo";

export const Route = createFileRoute("/admin/schema-fixes")({
  component: SchemaFixesPage,
});

type SchemaKey =
  | "Breadcrumbs"
  | "Navigation"
  | "Article"
  | "LocalBusiness"
  | "Service"
  | "FAQPage"
  | "Organization"
  | "Person";

type Field = {
  key: string;
  label: string;
  default: string;
  multiline?: boolean;
  hint?: string;
};

type FixDef = {
  key: SchemaKey;
  title: string;
  description: string;
  whenItFails: string;
  fix: string;
  fields: Field[];
  build: (values: Record<string, string>) => unknown;
};

const FIX_DEFS: FixDef[] = [
  {
    key: "Breadcrumbs",
    title: "BreadcrumbList",
    description: "تسلسل الفتات الذي يظهر تحت العنوان في نتائج Google.",
    whenItFails: "غياب itemListElement أو position أو item URL مطلق.",
    fix: "تأكد من إعطاء كل عنصر position متسلسل وروابط مطلقة (ابدأ بـ https://).",
    fields: [
      { key: "trail", label: "الفتات (label|path في كل سطر)", multiline: true,
        default: "الرئيسية|/ar\nالخدمات|/ar/services\nSEO|/ar/services/seo",
        hint: "كل سطر: الاسم الظاهر | المسار النسبي ابتداءً بـ /" },
    ],
    build: (v) => {
      const items = v.trail.split("\n").filter((l) => l.trim()).map((line, i) => {
        const [name, path] = line.split("|").map((s) => s.trim());
        return {
          "@type": "ListItem",
          position: i + 1,
          name: name ?? `Item ${i + 1}`,
          item: `${SITE_ORIGIN}${path?.startsWith("/") ? path : `/${path ?? ""}`}`,
        };
      });
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items,
      };
    },
  },
  {
    key: "Navigation",
    title: "SiteNavigationElement",
    description: "يصف عناصر القائمة الرئيسية للموقع لمحركات البحث.",
    whenItFails: "الـ name أو url غير مصفوفات، أو الروابط نسبية.",
    fix: "صدّر name كـ مصفوفة من النصوص و url كـ مصفوفة موازية من روابط مطلقة.",
    fields: [
      { key: "items", label: "عناصر القائمة (name|/path في كل سطر)", multiline: true,
        default: "الرئيسية|/ar\nالخدمات|/ar/services\nالمدونة|/ar/blog\nتواصل|/ar/contact" },
    ],
    build: (v) => {
      const lines = v.items.split("\n").filter((l) => l.trim());
      return {
        "@context": "https://schema.org",
        "@type": "SiteNavigationElement",
        name: lines.map((l) => l.split("|")[0]?.trim() ?? ""),
        url: lines.map((l) => `${SITE_ORIGIN}${(l.split("|")[1] ?? "").trim()}`),
      };
    },
  },
  {
    key: "Article",
    title: "Article",
    description: "بيانات المقال — تظهر في Discover وفي بطاقات الأخبار.",
    whenItFails: "نقص publisher.logo أو author أو image أو datePublished.",
    fix: "زوّد كل الحقول الإلزامية: headline, image, author (Person), datePublished, publisher (Organization with logo).",
    fields: [
      { key: "headline", label: "العنوان", default: "كيف تتصدر نتائج Google في 2026" },
      { key: "description", label: "الوصف", multiline: true, default: "دليل عملي مختصر للـ SEO الحديث في 2026." },
      { key: "url", label: "رابط المقال", default: "/ar/blog/topic-slug" },
      { key: "image", label: "صورة الغلاف (مطلق أو نسبي)", default: "/og-cover.jpg" },
      { key: "author", label: "اسم الكاتب", default: "فريق فكرة" },
      { key: "datePublished", label: "تاريخ النشر (ISO)", default: new Date().toISOString().slice(0, 10) },
    ],
    build: (v) => ({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: v.headline,
      description: v.description,
      mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_ORIGIN}${v.url}` },
      image: v.image.startsWith("http") ? v.image : `${SITE_ORIGIN}${v.image}`,
      datePublished: v.datePublished,
      dateModified: v.datePublished,
      author: { "@type": "Person", name: v.author },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        logo: { "@type": "ImageObject", url: `${SITE_ORIGIN}/logo.png`, width: 512, height: 512 },
      },
    }),
  },
  {
    key: "LocalBusiness",
    title: "LocalBusiness / ProfessionalService",
    description: "بطاقة العمل المحلية — أساسية لظهور الخدمات في خرائط Google.",
    whenItFails: "غياب address (مع addressCountry) أو telephone أو geo coordinates.",
    fix: "أضف PostalAddress كاملاً + GeoCoordinates + ساعات العمل.",
    fields: [
      { key: "name", label: "اسم الفرع", default: "Fikra — SEO Riyadh" },
      { key: "url", label: "رابط الصفحة", default: "/ar/locations/riyadh/seo" },
      { key: "phone", label: "الهاتف", default: "+966-50-000-0000" },
      { key: "city", label: "المدينة (إنجليزي)", default: "Riyadh" },
      { key: "region", label: "المنطقة", default: "Riyadh Province" },
      { key: "country", label: "كود الدولة (ISO2)", default: "SA" },
      { key: "lat", label: "خط العرض", default: "24.7136" },
      { key: "lng", label: "خط الطول", default: "46.6753" },
    ],
    build: (v) => ({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${SITE_ORIGIN}${v.url}#localbusiness`,
      name: v.name,
      url: `${SITE_ORIGIN}${v.url}`,
      telephone: v.phone,
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: v.city,
        addressRegion: v.region,
        addressCountry: v.country,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: parseFloat(v.lat),
        longitude: parseFloat(v.lng),
      },
      openingHoursSpecification: [{
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "09:00", closes: "18:00",
      }],
    }),
  },
  {
    key: "Service",
    title: "Service",
    description: "وصف خدمة بمزود (Organization).",
    whenItFails: "غياب provider أو areaServed.",
    fix: "اربط الخدمة بـ provider وحدّد serviceType + areaServed.",
    fields: [
      { key: "name", label: "اسم الخدمة", default: "Search Engine Optimization" },
      { key: "description", label: "الوصف", multiline: true, default: "خدمات SEO تقنية ومحلية." },
      { key: "url", label: "الرابط", default: "/ar/services/seo" },
      { key: "serviceType", label: "نوع الخدمة", default: "Search Engine Optimization" },
    ],
    build: (v) => ({
      "@context": "https://schema.org",
      "@type": "Service",
      name: v.name,
      description: v.description,
      url: `${SITE_ORIGIN}${v.url}`,
      serviceType: v.serviceType,
      provider: { "@type": "Organization", name: SITE_NAME, url: SITE_ORIGIN },
      areaServed: ["SA", "AE", "KW", "QA", "BH", "OM", "EG"],
    }),
  },
  {
    key: "FAQPage",
    title: "FAQPage",
    description: "أسئلة شائعة تظهر كـ Rich Result بسؤال/جواب.",
    whenItFails: "mainEntity فارغ أو لا يحتوي Question/Answer.",
    fix: "كل سطر زوج 'سؤال::جواب'.",
    fields: [
      { key: "qas", label: "الأسئلة (سؤال::جواب في كل سطر)", multiline: true,
        default: "ما هو SEO؟::تحسين محركات البحث لرفع الترتيب العضوي.\nكم يستغرق ظهور النتائج؟::عادة 60-90 يوم." },
    ],
    build: (v) => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: v.qas.split("\n").filter((l) => l.includes("::")).map((line) => {
        const [q, a] = line.split("::");
        return {
          "@type": "Question",
          name: q?.trim() ?? "",
          acceptedAnswer: { "@type": "Answer", text: a?.trim() ?? "" },
        };
      }),
    }),
  },
  {
    key: "Organization",
    title: "Organization",
    description: "بيانات الشركة الرئيسية — تظهر في Knowledge Panel.",
    whenItFails: "غياب logo أو sameAs.",
    fix: "أضف logo (ImageObject) + sameAs لحسابات السوشيال.",
    fields: [
      { key: "name", label: "الاسم", default: SITE_NAME },
      { key: "url", label: "الرابط", default: SITE_ORIGIN },
      { key: "logo", label: "رابط الشعار", default: `${SITE_ORIGIN}/logo.png` },
      { key: "sameAs", label: "روابط السوشيال (سطر لكل واحد)", multiline: true,
        default: "https://twitter.com/FikraDM\nhttps://www.linkedin.com/company/fikra-dm" },
    ],
    build: (v) => ({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: v.name,
      url: v.url,
      logo: { "@type": "ImageObject", url: v.logo, width: 512, height: 512 },
      sameAs: v.sameAs.split("\n").map((s) => s.trim()).filter(Boolean),
    }),
  },
  {
    key: "Person",
    title: "Person",
    description: "بيانات شخص (مثل عضو فريق أو مؤلف مقال).",
    whenItFails: "غياب name.",
    fix: "أضف على الأقل name، ويُفضّل jobTitle و worksFor.",
    fields: [
      { key: "name", label: "الاسم", default: "Sara Al-Qahtani" },
      { key: "jobTitle", label: "المسمى الوظيفي", default: "Head of SEO" },
    ],
    build: (v) => ({
      "@context": "https://schema.org",
      "@type": "Person",
      name: v.name,
      jobTitle: v.jobTitle,
      worksFor: { "@type": "Organization", name: SITE_NAME, url: SITE_ORIGIN },
    }),
  },
];

function FixCard({ def }: { def: FixDef }) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(def.fields.map((f) => [f.key, f.default])),
  );
  const [copied, setCopied] = useState(false);

  const json = useMemo(() => {
    try {
      return JSON.stringify(def.build(values), null, 2);
    } catch (e) {
      return `// Error: ${e instanceof Error ? e.message : String(e)}`;
    }
  }, [def, values]);

  const snippet = `<script type="application/ld+json">\n${json}\n</script>`;

  const copy = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    toast.success("تم نسخ كود JSON-LD ✓");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge>{def.key}</Badge>
            <h2 className="text-xl font-extrabold">{def.title}</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{def.description}</p>
        </div>
        <Button onClick={copy} variant={copied ? "default" : "outline"}>
          {copied ? <Check className="me-2 h-4 w-4" /> : <ClipboardCopy className="me-2 h-4 w-4" />}
          {copied ? "تم النسخ" : "نسخ JSON-LD"}
        </Button>
      </div>

      <div className="mt-4 grid gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4">
        <div className="flex items-start gap-2 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <div>
            <div className="font-semibold text-foreground">متى يفشل؟</div>
            <div className="text-muted-foreground">{def.whenItFails}</div>
          </div>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <Wand2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <div className="font-semibold text-foreground">كيف نصلحه؟</div>
            <div className="text-muted-foreground">{def.fix}</div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          {def.fields.map((f) => (
            <div key={f.key}>
              <label className="mb-1 block text-xs font-bold text-muted-foreground">{f.label}</label>
              {f.multiline ? (
                <Textarea
                  rows={5}
                  value={values[f.key] ?? ""}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                  className="font-mono text-xs"
                />
              ) : (
                <Input
                  value={values[f.key] ?? ""}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                />
              )}
              {f.hint && <p className="mt-1 text-[11px] text-muted-foreground">{f.hint}</p>}
            </div>
          ))}
        </div>
        <pre className="max-h-[420px] overflow-auto rounded-lg border border-border bg-ink/95 p-4 text-[11px] leading-relaxed text-emerald-200">
          {snippet}
        </pre>
      </div>
    </Card>
  );
}

function SchemaFixesPage() {
  return (
    <div className="container-app section">
      <h1 className="text-3xl font-extrabold">خريطة إصلاحات Schema</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        لكل نوع schema هنا: متى يفشل، كيف يتم إصلاحه، ومولِّد جاهز ينتج كود
        JSON-LD صالح يمكنك لصقه مباشرة في الصفحة.
      </p>
      <div className="mt-8 space-y-6">
        {FIX_DEFS.map((d) => <FixCard key={d.key} def={d} />)}
      </div>
    </div>
  );
}
