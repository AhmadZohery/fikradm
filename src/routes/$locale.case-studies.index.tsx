import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBand } from "@/components/site/CtaBand";
import { useLocale } from "@/i18n/useLocale";

export const Route = createFileRoute("/$locale/case-studies/")({
  head: ({ params }) => ({
    meta: [{ title: params.locale === "ar" ? "قصص النجاح | فكرة" : "Case Studies | Fikra" }],
  }),
  component: () => {
    const { locale } = useLocale();
    return (
      <SiteLayout>
        <Breadcrumbs trail={[{ label: locale === "ar" ? "قصص النجاح" : "Case Studies" }]} />
        <section className="section">
          <div className="container-app text-center">
            <h1 className="text-4xl font-extrabold md:text-5xl">{locale === "ar" ? "قصص نجاح حقيقية" : "Real success stories"}</h1>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{locale === "ar" ? "ننشر قريباً مجموعة من دراسات الحالة المفصّلة." : "Detailed case studies coming soon."}</p>
          </div>
        </section>
        <CtaBand />
      </SiteLayout>
    );
  },
});
