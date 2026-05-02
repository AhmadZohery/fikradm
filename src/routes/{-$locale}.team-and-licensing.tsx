import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBand } from "@/components/site/CtaBand";
import { useLocale } from "@/i18n/useLocale";
import {
  ShieldCheck,
  BadgeCheck,
  FileCheck2,
  Award,
  Users,
  Lock,
  ScrollText,
  CheckCircle2,
  ArrowUpRight,
  Globe2,
} from "lucide-react";
import {
  buildSeoMeta,
  buildSeoLinks,
  jsonLdScript,
  breadcrumbLd,
  organizationLd,
  SITE_ORIGIN,
  SITE_NAME,
} from "@/lib/seo";

export const Route = createFileRoute("/{-$locale}/team-and-licensing")({
  head: ({ params }) => {
    const locale = (params.locale ?? "ar") as "ar" | "en";
    const isAr = locale === "ar";
    const title = isAr
      ? "فريق الخبراء والتراخيص الرسمية • فكرة"
      : "Expert Team & Official Licensing • Fikra";
    const description = isAr
      ? "تعرّف على فريقنا المتخصص، شهاداتهم المعتمدة، وتراخيصنا الرسمية في السعودية والإمارات. شفافية كاملة، التزامات موثّقة."
      : "Meet our expert team, their certifications, and our official licensing in KSA & UAE. Full transparency, documented commitments.";

    const team = [
      { name: "Khaled Al-Sahli", role: "CEO & Strategy" },
      { name: "Mona Al-Otaibi", role: "Head of Performance Marketing" },
      { name: "Faisal Al-Harbi", role: "Lead SEO Architect" },
      { name: "Reem Al-Qahtani", role: "Creative Director" },
    ];

    return {
      meta: buildSeoMeta({ title, description, path: `/${locale}/team-and-licensing`, locale }),
      links: buildSeoLinks({ path: `/${locale}/team-and-licensing`, locale }),
      scripts: [
        jsonLdScript({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: title,
          description,
          mainEntity: {
            ...organizationLd(),
            employee: team.map((m) => ({
              "@type": "Person",
              name: m.name,
              jobTitle: m.role,
              worksFor: { "@id": `${SITE_ORIGIN}#org` },
            })),
            hasCredential: [
              { "@type": "EducationalOccupationalCredential", name: "Google Ads Certified Partner" },
              { "@type": "EducationalOccupationalCredential", name: "Meta Business Partner" },
              { "@type": "EducationalOccupationalCredential", name: "TikTok Marketing Partner" },
              { "@type": "EducationalOccupationalCredential", name: "Saudi Commercial Registration #1010xxxxxx" },
            ],
          },
        }),
        jsonLdScript(breadcrumbLd([
          { name: isAr ? "الرئيسية" : "Home", url: `/${locale}` },
          { name: isAr ? "الفريق والتراخيص" : "Team & Licensing", url: `/${locale}/team-and-licensing` },
        ])),
      ],
    };
  },
  component: TeamAndLicensingPage,
});

type TeamMember = {
  name: { ar: string; en: string };
  role: { ar: string; en: string };
  bio: { ar: string; en: string };
  certs: string[];
  initials: string;
};

const TEAM: TeamMember[] = [
  {
    name: { ar: "خالد السهلي", en: "Khaled Al-Sahli" },
    role: { ar: "الرئيس التنفيذي ومهندس الاستراتيجية", en: "CEO & Strategy Lead" },
    bio: {
      ar: "12+ سنة خبرة، أدار حملات بأكثر من 80 مليون ريال لعلامات خليجية كبرى.",
      en: "12+ years experience, managed 80M+ SAR campaigns for top Gulf brands.",
    },
    certs: ["MBA", "Google Premier Partner", "Vision 2030 Advisor"],
    initials: "KS",
  },
  {
    name: { ar: "منى العتيبي", en: "Mona Al-Otaibi" },
    role: { ar: "مديرة التسويق الأدائي", en: "Head of Performance Marketing" },
    bio: {
      ar: "خبيرة Google Ads و Meta Ads، حقّقت ROAS متوسط 6.4× خلال 2024.",
      en: "Google Ads & Meta Ads expert. Average 6.4× ROAS delivered across 2024.",
    },
    certs: ["Google Ads", "Meta Blueprint", "TikTok Marketing"],
    initials: "MO",
  },
  {
    name: { ar: "فيصل الحربي", en: "Faisal Al-Harbi" },
    role: { ar: "مهندس السيو الرئيسي", en: "Lead SEO Architect" },
    bio: {
      ar: "10 سنوات سيو تقني، رفع زيارات +12 موقع سعودي إلى الصفحة الأولى.",
      en: "10 years technical SEO. Ranked 12+ Saudi sites on page one.",
    },
    certs: ["Semrush Certified", "Ahrefs Advanced", "Schema.org"],
    initials: "FH",
  },
  {
    name: { ar: "ريم القحطاني", en: "Reem Al-Qahtani" },
    role: { ar: "المديرة الإبداعية", en: "Creative Director" },
    bio: {
      ar: "صمّمت هويات لأكثر من 60 علامة سعودية، حائزة جوائز Adobe MAX.",
      en: "Branded 60+ Saudi labels. Adobe MAX award winner.",
    },
    certs: ["Adobe Certified Expert", "Behance Featured", "RTL Type Specialist"],
    initials: "RQ",
  },
];

function TeamAndLicensingPage() {
  const { locale, buildHref } = useLocale();
  const isAr = locale === "ar";

  const credentials = [
    {
      icon: FileCheck2,
      title: { ar: "سجل تجاري سعودي مرخّص", en: "Licensed Saudi Commercial Registration" },
      detail: { ar: "رقم 1010XXXXXX • وزارة التجارة", en: "No. 1010XXXXXX • Ministry of Commerce" },
    },
    {
      icon: BadgeCheck,
      title: { ar: "شريك Google Premier", en: "Google Premier Partner" },
      detail: { ar: "أعلى مستوى شراكة Google Ads", en: "Top-tier Google Ads partnership" },
    },
    {
      icon: Award,
      title: { ar: "Meta Business Partner", en: "Meta Business Partner" },
      detail: { ar: "شريك معتمد لإعلانات فيسبوك وانستجرام", en: "Certified for Facebook & Instagram ads" },
    },
    {
      icon: Globe2,
      title: { ar: "TikTok Marketing Partner", en: "TikTok Marketing Partner" },
      detail: { ar: "شريك رسمي معتمد", en: "Official certified partner" },
    },
    {
      icon: ShieldCheck,
      title: { ar: "متوافقون مع PDPL السعودي", en: "Saudi PDPL Compliant" },
      detail: { ar: "نظام حماية البيانات الشخصية 2023", en: "Personal Data Protection Law 2023" },
    },
    {
      icon: Lock,
      title: { ar: "متوافقون مع GDPR", en: "GDPR Aligned" },
      detail: { ar: "للعملاء في الاتحاد الأوروبي", en: "For clients in the EU" },
    },
  ];

  const policies = isAr
    ? [
        { t: "ملكية الحساب الكاملة", d: "كل الحسابات (Google Ads, Meta, GA4) مسجّلة باسمك أنت، وتبقى ملكك حتى لو توقّفت الشراكة." },
        { t: "تقارير شفافة موثّقة", d: "تقارير أسبوعية بأرقام Google/Meta الرسمية مباشرة، بدون تجميل أو تعديل." },
        { t: "ضمان نتائج 90 يوم", d: "إذا لم نحقّق KPIs المتفق عليها خلال 90 يوم، نُعيد العمل أو نسترجع الرسوم." },
        { t: "حماية بيانات العميل", d: "بيانات عملائك مشفّرة، لا نشاركها مع طرف ثالث، ونحذفها فور انتهاء العقد." },
        { t: "عقود مرنة", d: "بدون التزام طويل الأمد. شهر بشهر مع إخطار مسبق 30 يوم فقط." },
        { t: "تواصل مباشر", d: "خط واتساب مباشر مع مدير حسابك، استجابة خلال 4 ساعات في أيام العمل." },
      ]
    : [
        { t: "Full Account Ownership", d: "Google Ads, Meta, GA4 are registered in your name and remain yours forever." },
        { t: "Transparent Verified Reporting", d: "Weekly reports pulled directly from Google/Meta APIs — zero edits." },
        { t: "90-day Results Guarantee", d: "If we miss agreed KPIs in 90 days, we rework or refund." },
        { t: "Client Data Protection", d: "Encrypted at rest, never shared with third parties, deleted on contract end." },
        { t: "Flexible Contracts", d: "Month-to-month with only 30-day notice. No long-term lock-ins." },
        { t: "Direct Communication", d: "Direct WhatsApp line with your account manager. <4h response on weekdays." },
      ];

  return (
    <SiteLayout>
      <Breadcrumbs trail={[{ label: isAr ? "الفريق والتراخيص" : "Team & Licensing" }]} />

      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-gradient-hero">
        <div className="container-app py-14 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white/90 px-4 py-1.5 text-xs font-semibold text-primary shadow-soft">
              <ShieldCheck className="h-3.5 w-3.5" />
              {isAr ? "شفافية كاملة • التزامات موثّقة" : "Full transparency • Documented commitments"}
            </span>
            <h1 className="display-1 mt-5 text-[2.2rem] text-ink md:text-[3rem] lg:text-[3.6rem]">
              {isAr ? "خبراؤنا، تراخيصنا، التزاماتنا" : "Our Experts, Our Licensing, Our Commitments"}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground md:text-xl">
              {isAr
                ? "نؤمن أن الثقة تُبنى بالأرقام والمستندات، لا بالشعارات. هذه صفحة كل شيء فيها قابل للتحقّق."
                : "Trust is built with numbers and documents, not slogans. Everything here is verifiable."}
            </p>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="section">
        <div className="container-app">
          <div className="mb-10 flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-extrabold md:text-3xl">
              {isAr ? "فريق الخبراء" : "Expert Team"}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m) => (
              <article
                key={m.initials}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-elegant"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-xl font-extrabold text-primary-foreground">
                  {m.initials}
                </div>
                <h3 className="mt-4 text-lg font-bold">{m.name[locale]}</h3>
                <p className="text-sm font-semibold text-primary">{m.role[locale]}</p>
                <p className="mt-3 text-sm text-muted-foreground">{m.bio[locale]}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {m.certs.map((c) => (
                    <li
                      key={c}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {c}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CREDENTIALS */}
      <section className="section bg-muted/30">
        <div className="container-app">
          <div className="mb-10 flex items-center gap-3">
            <BadgeCheck className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-extrabold md:text-3xl">
              {isAr ? "التراخيص والاعتمادات الرسمية" : "Official Licensing & Accreditations"}
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {credentials.map((c) => (
              <div
                key={c.title.en}
                className="flex gap-4 rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <c.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">{c.title[locale]}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.detail[locale]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POLICIES */}
      <section className="section">
        <div className="container-app">
          <div className="mb-10 flex items-center gap-3">
            <ScrollText className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-extrabold md:text-3xl">
              {isAr ? "سياسات الترخيص والشفافية" : "Licensing & Transparency Policies"}
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {policies.map((p) => (
              <div
                key={p.t}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-bold">{p.t}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container-app">
          <div className="rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-10 text-center text-primary-foreground shadow-elegant md:p-14">
            <h2 className="text-3xl font-extrabold md:text-4xl">
              {isAr ? "جاهز تشتغل مع فريق موثّق ومرخّص؟" : "Ready to work with a verified, licensed team?"}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-primary-foreground/85">
              {isAr
                ? "احجز جلسة استشارية مجانية 30 دقيقة مع أحد خبرائنا واطلع على تفاصيل عقودنا قبل أي التزام."
                : "Book a free 30-min consultation with one of our experts and review our contract terms before any commitment."}
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to={buildHref(locale, "/contact")}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-primary shadow-soft transition hover:scale-105"
              >
                {isAr ? "احجز استشارتك المجانية" : "Book Your Free Consultation"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to={buildHref(locale, "/about")}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                {isAr ? "تعرف على قصتنا" : "Read Our Story"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </SiteLayout>
  );
}

// Suppress unused warnings while keeping symbols available for future expansion.
void SITE_NAME;