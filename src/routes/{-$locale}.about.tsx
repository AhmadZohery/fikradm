import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { StatsBand } from "@/components/site/StatsBand";
import { CtaBand } from "@/components/site/CtaBand";
import { Testimonials } from "@/components/site/Testimonials";
import { useLocale } from "@/i18n/useLocale";
import { Target, Heart, Award, Users } from "lucide-react";

export const Route = createFileRoute("/{-$locale}/about")({
  head: ({ params }) => ({
    meta: [
      { title: params.locale === "ar" ? "من نحن | فكرة للتسويق الرقمي" : "About | Fikra Digital Marketing" },
      { name: "description", content: params.locale === "ar" ? "تعرّف على فكرة، وكالة تسويق رقمي مرخّصة في السعودية ورؤيتنا في النمو." : "Meet Fikra — a licensed KSA digital marketing agency and our vision for growth." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { locale } = useLocale();
  const values = [
    { icon: Target, title: { ar: "نتائج قابلة للقياس", en: "Measurable results" }, desc: { ar: "كل قرار مبني على بيانات.", en: "Every decision is data-driven." } },
    { icon: Heart, title: { ar: "شراكة حقيقية", en: "True partnership" }, desc: { ar: "نمو عميلنا = نموّنا.", en: "Our client's growth is ours." } },
    { icon: Award, title: { ar: "جودة لا تتنازل", en: "Uncompromising quality" }, desc: { ar: "كل تسليم بمعايير عالمية.", en: "Every delivery to global standards." } },
    { icon: Users, title: { ar: "فريق متخصص", en: "Specialist team" }, desc: { ar: "خبراء، لا generalists.", en: "Experts, not generalists." } },
  ];
  return (
    <SiteLayout>
      <Breadcrumbs trail={[{ label: locale === "ar" ? "من نحن" : "About" }]} />
      <section className="bg-gradient-hero">
        <div className="container-app py-16 md:py-24 text-center">
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight md:text-5xl">
            {locale === "ar" ? "نبني فكرة، فنبني نمواً" : "We build ideas — and grow brands"}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            {locale === "ar"
              ? "فكرة وكالة تسويق رقمي مرخّصة في المملكة العربية السعودية، نخدم العلامات التجارية والمتاجر الإلكترونية في الخليج بحلول متكاملة من السيو والإعلانات إلى الكرييتيف والتطوير."
              : "Fikra is a licensed digital marketing agency in Saudi Arabia, serving brands and e-commerce across the Gulf with integrated solutions from SEO and ads to creative and development."}
          </p>
        </div>
      </section>
      <StatsBand />
      <section className="section">
        <div className="container-app">
          <h2 className="text-center text-3xl font-extrabold md:text-4xl">{locale === "ar" ? "قيمنا" : "Our values"}</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground"><Icon className="h-6 w-6" /></div>
                  <h3 className="mt-4 text-base font-bold">{v.title[locale]}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.desc[locale]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <Testimonials />
      <CtaBand />
    </SiteLayout>
  );
}
