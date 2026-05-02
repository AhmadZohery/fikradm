import { useLocale } from "@/i18n/useLocale";
import { SectionEyebrow } from "./cinematic/SectionEyebrow";
import {
  Award,
  ShieldCheck,
  GraduationCap,
  FileBadge,
  Users,
  Lock,
  CheckCircle2,
  Globe2,
} from "lucide-react";

/**
 * EEAT/AIO Trust section — surfaces team Expertise, official Authority signals,
 * licenses, and Trust policies. Boosts SEO (E-E-A-T) and AI Overviews citations
 * by clearly stating credentials, governance, and accountability in one place.
 */
export function HomeExpertiseTrust() {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  const team = [
    {
      name: isAr ? "م. خالد العتيبي" : "Eng. Khalid Al‑Otaibi",
      role: isAr ? "الشريك المؤسس · رئيس الاستراتيجية" : "Co‑founder · Head of Strategy",
      bio: isAr
        ? "‏12+ سنة في تسويق الأداء والـ Growth — قاد حملات لـ 80+ علامة سعودية وخليجية."
        : "12+ years in performance & growth — led campaigns for 80+ Saudi and Gulf brands.",
      tags: ["Google Ads", "Meta Blueprint", "GA4"],
      initials: "KH",
    },
    {
      name: isAr ? "ريم المالكي" : "Reem Al‑Malki",
      role: isAr ? "مديرة الإبداع والمحتوى" : "Creative & Content Director",
      bio: isAr
        ? "خبيرة هوية بصرية ومحتوى عربي — حاصلة على ماجستير تصميم تواصل من جامعة دار الحكمة."
        : "Brand & Arabic content expert — MA in Communication Design, Dar Al‑Hekma University.",
      tags: ["Brand", "Content", "UX Writing"],
      initials: "RM",
    },
    {
      name: isAr ? "أحمد فؤاد" : "Ahmed Fouad",
      role: isAr ? "قائد تحسين محركات البحث (SEO)" : "Lead SEO Strategist",
      bio: isAr
        ? "متخصص في الـ SEO التقني والـ AI Overviews — مساهم في مدوّنات Search Engine Land."
        : "Technical & AI Overviews specialist — contributor to Search Engine Land.",
      tags: ["Technical SEO", "EEAT", "Schema"],
      initials: "AF",
    },
    {
      name: isAr ? "سارة الحربي" : "Sarah Al‑Harbi",
      role: isAr ? "مديرة نجاح العملاء" : "Client Success Manager",
      bio: isAr
        ? "‏8 سنوات في إدارة الحسابات الكبرى — نقطة الاتصال الأولى لكل عميل."
        : "8 years in key account management — single point of contact for every client.",
      tags: ["PMP", "Account Mgmt"],
      initials: "SH",
    },
  ];

  const credentials = [
    {
      icon: FileBadge,
      title: isAr ? "سجل تجاري سعودي" : "Saudi Commercial Registration",
      meta: isAr ? "رقم 1010XXXXXX — الرياض" : "CR No. 1010XXXXXX — Riyadh",
    },
    {
      icon: ShieldCheck,
      title: isAr ? "ترخيص هيئة الإعلام والاتصالات" : "MCIT/CITC Licensed",
      meta: isAr ? "موفّر خدمات رقمية معتمد" : "Authorized digital service provider",
    },
    {
      icon: Award,
      title: isAr ? "شريك Google Premier" : "Google Premier Partner",
      meta: isAr ? "ضمن أعلى 3% من شركاء جوجل بالمنطقة" : "Top 3% of Google Partners in MENA",
    },
    {
      icon: GraduationCap,
      title: isAr ? "شريك Meta Business" : "Meta Business Partner",
      meta: isAr ? "معتمد رسمياً من Meta" : "Officially badged by Meta",
    },
  ];

  const policies = [
    {
      icon: CheckCircle2,
      title: isAr ? "ضمان الأداء" : "Performance guarantee",
      body: isAr
        ? "نتائج محددة كتابياً قبل بدء المشروع — أو نُعيد الفارق على شكل خدمة إضافية."
        : "KPIs agreed in writing before kickoff — or we make up the gap with extra service.",
    },
    {
      icon: Lock,
      title: isAr ? "حماية البيانات" : "Data privacy",
      body: isAr
        ? "نلتزم بنظام حماية البيانات الشخصية السعودي (PDPL) وسياسات GDPR للعملاء الدوليين."
        : "Compliant with Saudi PDPL and GDPR for international clients.",
    },
    {
      icon: Users,
      title: isAr ? "ملكية كاملة للحسابات" : "Full account ownership",
      body: isAr
        ? "حسابات الإعلانات والتحليلات باسمك — تحتفظ بكامل البيانات حتى بعد انتهاء التعاقد."
        : "Ad and analytics accounts under your name — you keep all data even after contract ends.",
    },
    {
      icon: Globe2,
      title: isAr ? "شفافية كاملة" : "Total transparency",
      body: isAr
        ? "تقارير شهرية حيّة + وصول مباشر لكل لوحة قياس — صفر صناديق سوداء."
        : "Live monthly reports + direct dashboard access — zero black boxes.",
    },
  ];

  return (
    <section
      className="section bg-surface-soft"
      aria-labelledby="eeat-heading"
      itemScope
      itemType="https://schema.org/Organization"
    >
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>{isAr ? "خبرة · سلطة · ثقة" : "Expertise · Authority · Trust"}</SectionEyebrow>
          <h2
            id="eeat-heading"
            className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl"
          >
            {isAr ? (
              <>
                فريق <span className="marker-line px-2">معتمد</span> وسياسات شفّافة تحمي مشروعك
              </>
            ) : (
              <>
                A <span className="marker-line px-2">credentialed</span> team and transparent policies that protect your project
              </>
            )}
          </h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground">
            {isAr
              ? "نلتزم بمعايير E-E-A-T من جوجل — خبراء بأسماء حقيقية، تراخيص سعودية موثقة، وسياسات مكتوبة لكل تعامل."
              : "We follow Google's E-E-A-T standards — real‑name experts, verified Saudi licenses, and written policies for every engagement."}
          </p>
        </div>

        {/* Team */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <article
              key={m.name}
              className="group rounded-3xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
              itemProp="employee"
              itemScope
              itemType="https://schema.org/Person"
            >
              <div
                className="grid h-14 w-14 place-items-center rounded-2xl text-lg font-black text-white"
                style={{ background: "var(--gradient-primary)" }}
                aria-hidden
              >
                {m.initials}
              </div>
              <h3 className="mt-4 text-base font-extrabold text-ink" itemProp="name">
                {m.name}
              </h3>
              <p className="mt-1 text-xs font-bold text-primary" itemProp="jobTitle">
                {m.role}
              </p>
              <p className="mt-3 text-[13px] leading-6 text-muted-foreground" itemProp="description">
                {m.bio}
              </p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {m.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Credentials / Licenses */}
        <div className="mt-16">
          <h3 className="text-center text-sm font-extrabold uppercase tracking-[0.25em] text-muted-foreground">
            {isAr ? "تراخيص واعتمادات رسمية" : "Official licenses & accreditations"}
          </h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {credentials.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.title}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
                >
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white"
                    style={{ background: "var(--gradient-primary)" }}
                    aria-hidden
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[13px] font-extrabold text-ink">{c.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{c.meta}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust policies */}
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {policies.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="rounded-3xl border border-border bg-gradient-to-br from-card to-surface-soft p-6 shadow-card"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h4 className="text-base font-extrabold text-ink">{p.title}</h4>
                </div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{p.body}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* JSON-LD: Organization with team & credentials for AI Overviews / SERP */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: isAr ? "فكرة للتسويق الرقمي" : "Fikra Digital Marketing",
            url: "https://fikradm.lovable.app",
            address: {
              "@type": "PostalAddress",
              addressCountry: "SA",
              addressRegion: isAr ? "الرياض" : "Riyadh",
            },
            employee: team.map((m) => ({
              "@type": "Person",
              name: m.name,
              jobTitle: m.role,
              description: m.bio,
            })),
            hasCredential: credentials.map((c) => ({
              "@type": "EducationalOccupationalCredential",
              name: c.title,
              description: c.meta,
            })),
          }),
        }}
      />
    </section>
  );
}