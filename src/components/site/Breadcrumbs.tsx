import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";

export function Breadcrumbs({ trail }: { trail: { label: string; href?: string }[] }) {
  const { locale, buildHref } = useLocale();
  return (
    <nav aria-label="Breadcrumb" className="border-b border-border bg-surface/60">
      <div className="container-app flex items-center gap-2 py-3 text-xs text-muted-foreground">
        <Link to={buildHref(locale, "/")} className="hover:text-primary">
          {locale === "ar" ? "الرئيسية" : "Home"}
        </Link>
        {trail.map((t, i) => (
          <span key={i} className="flex items-center gap-2">
            <ChevronLeft className="h-3 w-3 opacity-60 rtl:rotate-180" />
            {t.href ? (
              <Link to={buildHref(locale, t.href)} className="hover:text-primary">{t.label}</Link>
            ) : (
              <span className="font-medium text-foreground">{t.label}</span>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}
