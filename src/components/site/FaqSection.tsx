import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import type { FaqItem } from "@/content/types";
import { cn } from "@/lib/utils";

export function FaqSection({ items, title }: { items: FaqItem[]; title?: string }) {
  const { locale } = useLocale();
  const [open, setOpen] = useState<number | null>(0);

  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q[locale],
      acceptedAnswer: { "@type": "Answer", text: it.a[locale] },
    })),
  };

  return (
    <section className="section">
      <div className="container-app grid gap-10 lg:grid-cols-[1fr_2fr]">
        <div>
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">FAQ</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
            {title ?? (locale === "ar" ? "أسئلة شائعة" : "Frequently asked questions")}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {locale === "ar" ? "كل ما تحتاج معرفته قبل البدء معنا." : "Everything you need to know before getting started."}
          </p>
        </div>
        <div className="space-y-3">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <button
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-foreground md:text-base">{it.q[locale]}</span>
                  <ChevronDown className={cn("h-5 w-5 shrink-0 text-primary transition-transform", isOpen && "rotate-180")} />
                </button>
                <div className={cn("grid transition-all", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-7 text-muted-foreground">{it.a[locale]}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </section>
  );
}
