import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBand } from "@/components/site/CtaBand";
import { useLocale } from "@/i18n/useLocale";
import { buildSeoMeta, buildSeoLinks, jsonLdScript, breadcrumbLd } from "@/lib/seo";

const titles: Record<string, { ar: string; en: string }> = {
  "digital-marketing-dubai": { ar: "تسويق رقمي في دبي", en: "Digital Marketing in Dubai" },
  "seo-agency-riyadh": { ar: "وكالة سيو في الرياض", en: "SEO Agency in Riyadh" },
  "web-design-cairo": { ar: "تصميم مواقع في القاهرة", en: "Web Design in Cairo" },
};

export const Route = createFileRoute("/{-$locale}/locations/$slug")({
  head: ({ params }) => {
    const t = titles[params.slug];
    if (!t) return { meta: [{ title: "Location" }] };
    const loc = (params.locale ?? "ar") === "en" ? "en" : "ar";
    const isAr = loc === "ar";
    const path = `/${loc}/locations/${params.slug}`;
    const title = `${t[loc]} | Fikra`;
    return {
      meta: buildSeoMeta({ title, description: t[loc], path, locale: loc }),
      links: buildSeoLinks({ path, locale: loc }),
      scripts: [
        jsonLdScript(
          breadcrumbLd([
            { name: isAr ? "الرئيسية" : "Home", url: `/${loc}` },
            { name: isAr ? "المواقع" : "Locations", url: `/${loc}/locations` },
            { name: t[loc], url: path },
          ]),
        ),
      ],
    };
  },
  component: () => {
    const { locale } = useLocale();
    const { slug } = Route.useParams();
    const t = titles[slug];
    if (!t) {
      return (
        <SiteLayout>
          <section className="section container-app text-center"><h1 className="text-3xl font-bold">Not found</h1></section>
        </SiteLayout>
      );
    }
    return (
      <SiteLayout>
        <Breadcrumbs trail={[{ label: t[locale] }]} />
        <section className="section bg-gradient-hero">
          <div className="container-app text-center">
            <h1 className="text-4xl font-extrabold md:text-5xl">{t[locale]}</h1>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              {locale === "ar"
                ? "خدماتنا التسويقية متاحة في هذه المنطقة بفريق محلي يفهم سوقك."
                : "Our marketing services are available locally with a team that understands your market."}
            </p>
          </div>
        </section>
        <CtaBand />
      </SiteLayout>
    );
  },
});
