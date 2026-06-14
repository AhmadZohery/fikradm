import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, ShieldCheck, Clock, Users } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { QuoteFormDrawer } from "@/components/site/QuoteFormDrawer";
import { isLocale, DEFAULT_LOCALE } from "@/i18n/types";

export const Route = createFileRoute("/{-$locale}/quote")({
  head: () => ({
    meta: [
      { title: "اطلب عرض سعر مخصص — فكرة" },
      { name: "description", content: "نموذج ذكي من ٤ خطوات يوصلك بخطة عمل مخصصة وعرض سعر شفاف خلال ٢٤ ساعة." },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "/quote" }],
  }),
  component: QuotePage,
});

function QuotePage() {
  const params = useParams({ strict: false }) as { locale?: string };
  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  const isAr = locale === "ar";
  const [open, setOpen] = useState(true);

  return (
    <SiteLayout>
      <Breadcrumbs trail={[{ label: isAr ? "طلب عرض سعر" : "Get a Quote" }]} />
      <section className="bg-gradient-hero">
        <div className="container-app py-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {isAr ? "خطة مخصصة مجانية" : "Free custom plan"}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold md:text-5xl">
            {isAr ? "احصل على عرض سعر شفاف خلال ٢٤ ساعة" : "Get a transparent quote in 24 hours"}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            {isAr
              ? "جاوب على أسئلة بسيطة عن مشروعك، وفريق فكرة يحضّر لك خطة عمل وعرض سعر مخصص بدون أي التزام."
              : "Answer a few simple questions and our team will prepare a tailored plan and quote with zero obligation."}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary" />{isAr ? "أقل من دقيقتين" : "Under 2 minutes"}</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" />{isAr ? "بدون التزام" : "No obligation"}</span>
            <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-primary" />{isAr ? "خبرة خليجية" : "Gulf-wide expertise"}</span>
          </div>
          <div className="mt-8">
            <Button size="lg" onClick={() => setOpen(true)}>
              {isAr ? "ابدأ الآن" : "Start now"}
            </Button>
          </div>
        </div>
      </section>
      <QuoteFormDrawer open={open} onOpenChange={setOpen} locale={locale} />
    </SiteLayout>
  );
}