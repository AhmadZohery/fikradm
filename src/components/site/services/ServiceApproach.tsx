import { useLocale } from "@/i18n/useLocale";
import { SectionEyebrow } from "../cinematic/SectionEyebrow";
import { Sparkles, Target, BarChart3 } from "lucide-react";

type Pillar = {
  icon: React.ComponentType<{ className?: string }>;
  title: { ar: string; en: string };
  desc: { ar: string; en: string };
};

// "What we actually do differently" — sells the value behind the service
const PILLARS: Record<string, Pillar[]> = {
  seo: [
    { icon: Target, title: { ar: "نية البحث أولاً", en: "Search intent first" }, desc: { ar: "نُحلل ما يبحث عنه عميلك فعلاً، لا الكلمات الفارغة. كل صفحة تُجيب سؤالاً حقيقياً.", en: "We analyze what your customer truly searches — every page answers a real question." } },
    { icon: Sparkles, title: { ar: "محتوى يُحب من الإنسان قبل جوجل", en: "Content humans love first" }, desc: { ar: "نكتب لجمهورك بلغته، ثم نُهيكله ليحبه جوجل. نتائج تدوم.", en: "We write for your audience, then structure it for Google. Results that last." } },
    { icon: BarChart3, title: { ar: "تقارير شفافة لا تكذب", en: "Transparent reports" }, desc: { ar: "تعرف بالضبط أي كلمة صعدت وأي صفحة تجلب الزوار. لا غموض.", en: "Know exactly which keyword climbed and which page brings traffic. Zero opacity." } },
  ],
  performance: [
    { icon: Target, title: { ar: "كرييتيف يُختبر كل أسبوع", en: "Weekly creative testing" }, desc: { ar: "نُنتج وننشر إعلانات جديدة باستمرار، لا نعتمد على إعلان واحد أبداً.", en: "We continuously produce and ship new ads — never riding one creative." } },
    { icon: BarChart3, title: { ar: "تتبع تحويلات لا يكذب", en: "Truthful conversion tracking" }, desc: { ar: "نُثبت كل بكسل وحدث وندمج Conversions API. كل ريال يُحسب.", en: "Every pixel and event tracked, with Conversions API. Every dollar accounted for." } },
    { icon: Sparkles, title: { ar: "Funnels مبنية بذكاء", en: "Smart funnels" }, desc: { ar: "تذكير، إعادة استهداف، Lookalikes — نخرج كل قطرة من الميزانية.", en: "Reminders, retargeting, Lookalikes — we squeeze every drop from your budget." } },
  ],
  creative: [
    { icon: Sparkles, title: { ar: "هوية تخدم الأعمال", en: "Identity that serves business" }, desc: { ar: "تصاميم مدروسة استراتيجياً لتُذكر وتُباع، ليست مجرد جمالية.", en: "Strategically designed to be remembered and to convert — not just pretty." } },
    { icon: Target, title: { ar: "محتوى بصري جاهز للأداء", en: "Performance-ready visuals" }, desc: { ar: "كل تصميم مُنتج وفق متطلبات منصات الإعلان والـ engagement.", en: "Every asset built for ad platforms and engagement." } },
    { icon: BarChart3, title: { ar: "إنتاج فيديو قصير على نطاق واسع", en: "Short-form video at scale" }, desc: { ar: "ريلز وتيك توك بشكل ثابت لإطعام الخوارزمية.", en: "Consistent reels & TikToks to feed the algorithm." } },
  ],
  web: [
    { icon: Sparkles, title: { ar: "أداء يفوق 95/100", en: "95+ Lighthouse" }, desc: { ar: "كل موقع نُسلمه يُنافس بسرعته. لا templates مُتخمة بالـ plugins.", en: "Every site competes on speed. No bloated plugin templates." } },
    { icon: Target, title: { ar: "تصميم يُحول الزائر لعميل", en: "Conversion-driven design" }, desc: { ar: "دراسة UX حقيقية وCRO، ليس فقط عرض جميل.", en: "Real UX study and CRO — not just a beautiful showcase." } },
    { icon: BarChart3, title: { ar: "جاهز للسيو والإعلانات", en: "SEO + Ads ready" }, desc: { ar: "Schema، Pixels، GTM، Open Graph — كل شيء مُهيّأ منذ اليوم الأول.", en: "Schema, Pixels, GTM, Open Graph — wired from day one." } },
  ],
  social: [
    { icon: Sparkles, title: { ar: "محتوى لكل منصة بشخصيتها", en: "Native content per platform" }, desc: { ar: "إنستجرام لا يُشبه تويتر ولا تيك توك. ننتج لكل منصة بلغتها.", en: "Instagram ≠ Twitter ≠ TikTok. We produce in each platform's voice." } },
    { icon: Target, title: { ar: "Community management حقيقي", en: "Real community management" }, desc: { ar: "نرد على التعليقات والرسائل بلغة علامتك خلال ساعات.", en: "We respond to DMs and comments in your brand voice within hours." } },
    { icon: BarChart3, title: { ar: "تحليل وتعديل أسبوعي", en: "Weekly analytics & tweaks" }, desc: { ar: "نراجع ما نجح وما لم ينجح ونُعدّل الخطة كل أسبوع.", en: "We review what worked weekly and adapt the plan." } },
  ],
  content: [
    { icon: Target, title: { ar: "بحث موضوعات يبني سلطة", en: "Topical authority research" }, desc: { ar: "نُغطي مجالك بعمق حتى تصبح المرجع.", en: "We cover your topic deeply until you become the reference." } },
    { icon: Sparkles, title: { ar: "كتّاب متخصصون بالقطاع", en: "Industry-specialist writers" }, desc: { ar: "ليس content mill — كتّاب يفهمون قطاعك.", en: "Not a content mill — writers who get your industry." } },
    { icon: BarChart3, title: { ar: "محتوى يُحدَّث ويتطور", en: "Content that evolves" }, desc: { ar: "نراجع المقالات القديمة ونُحدّثها لتبقى في القمة.", en: "We refresh old articles to keep them on top." } },
  ],
};

export function ServiceApproach({ slug }: { slug: string }) {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const pillars = PILLARS[slug] ?? PILLARS.seo;

  return (
    <section className="section">
      <div className="container-app">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <div>
            <SectionEyebrow>{isAr ? "ما الذي نفعله بشكل مختلف" : "What we do differently"}</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
              {isAr ? "ليس وعوداً — منهجية مُثبتة" : "Not promises — a proven method"}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {isAr
                ? "كل خدمة لدينا مبنية على ثلاث ركائز نطبقها بانضباط على كل عميل."
                : "Every service is built on three pillars we apply with discipline for every client."}
            </p>
          </div>

          <div className="grid gap-5">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
                >
                  <div className="flex items-start gap-5">
                    <div
                      className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white shadow-svc transition group-hover:rotate-[-8deg] group-hover:scale-110"
                      style={{ background: "var(--gradient-svc)" }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-ink">{isAr ? p.title.ar : p.title.en}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                        {isAr ? p.desc.ar : p.desc.en}
                      </p>
                    </div>
                  </div>
                  <span
                    className="absolute -end-12 -bottom-12 h-32 w-32 rounded-full opacity-0 blur-3xl transition group-hover:opacity-30"
                    style={{ background: "var(--svc)" }}
                    aria-hidden
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
