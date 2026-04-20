import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBand } from "@/components/site/CtaBand";
import { services } from "@/content/data";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";

export const Route = createFileRoute("/{-$locale}/services/")({
  head: ({ params }) => {
    const isAr = params.locale === "ar";
    return {
      meta: [
        { title: isAr ? "خدماتنا | فكرة للتسويق الرقمي" : "Our Services | Fikra Digital Marketing" },
        { name: "description", content: isAr ? "ترسانة خدمات التسويق الرقمي: سيو، إعلانات، كرييتيف، ومواقع." : "Our digital marketing arsenal: SEO, ads, creative, and web." },
      ],
    };
  },
  component: ServicesIndex,
});

function ServicesIndex() {
  const { locale, buildHref } = useLocale();
  return (
    <SiteLayout>
      <Breadcrumbs trail={[{ label: locale === "ar" ? "خدماتنا" : "Services" }]} />
      <section className="section">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-extrabold md:text-5xl">{locale === "ar" ? "كل ما تحتاجه لنمو علامتك" : "Everything you need to grow your brand"}</h1>
            <p className="mt-4 text-muted-foreground">{locale === "ar" ? "خدمات متكاملة بأيدي متخصصين، تحت سقف واحد." : "Integrated services delivered by specialists under one roof."}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {services.map((s) => (
              <Link key={s.slug} to={buildHref(locale, `/services/${s.slug}`)} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-elegant">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={s.image} alt={s.title[locale]} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold">{s.title[locale]}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.intro[locale]}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    {locale === "ar" ? "اكتشف الخدمة" : "Explore"}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </SiteLayout>
  );
}
