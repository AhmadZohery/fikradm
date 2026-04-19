import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBand } from "@/components/site/CtaBand";
import { useLocale } from "@/i18n/useLocale";

export const Route = createFileRoute("/$locale/blog/")({
  head: ({ params }) => ({
    meta: [{ title: params.locale === "ar" ? "المدونة | فكرة" : "Blog | Fikra" }],
  }),
  component: () => {
    const { locale } = useLocale();
    return (
      <SiteLayout>
        <Breadcrumbs trail={[{ label: locale === "ar" ? "المدونة" : "Blog" }]} />
        <section className="section">
          <div className="container-app text-center">
            <h1 className="text-4xl font-extrabold md:text-5xl">{locale === "ar" ? "مدونة فكرة" : "Fikra Blog"}</h1>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{locale === "ar" ? "مقالات وأدلة تسويقية تنشر قريباً." : "Marketing guides and articles coming soon."}</p>
          </div>
        </section>
        <CtaBand />
      </SiteLayout>
    );
  },
});
