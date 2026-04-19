import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import logo from "@/assets/fikra-logo.jpg";

export function SiteFooter() {
  const { locale, t, buildHref } = useLocale();
  const year = new Date().getFullYear();

  const services = [
    { label: t("menu.services.seo"), href: "/services/seo" },
    { label: t("menu.services.performance"), href: "/services/performance" },
    { label: t("menu.services.creative"), href: "/services/creative" },
    { label: t("menu.services.web"), href: "/services/web" },
  ];

  const quick = [
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.industries"), href: "/industries" },
    { label: t("nav.cases"), href: "/case-studies" },
    { label: t("nav.blog"), href: "/blog" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  const locations = [
    { label: locale === "ar" ? "تسويق رقمي في دبي" : "Digital Marketing in Dubai", href: "/locations/digital-marketing-dubai" },
    { label: locale === "ar" ? "وكالة سيو في الرياض" : "SEO Agency in Riyadh", href: "/locations/seo-agency-riyadh" },
    { label: locale === "ar" ? "تصميم مواقع في القاهرة" : "Web Design in Cairo", href: "/locations/web-design-cairo" },
  ];

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-app py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to={buildHref(locale, "/")} className="flex items-center gap-3">
              <img src={logo} alt={t("brand.full")} className="h-10 w-10 rounded-lg object-cover" />
              <div className="leading-tight">
                <div className="text-sm font-bold">{t("brand.name")}</div>
                <div className="text-[11px] text-muted-foreground">{t("brand.tagline")}</div>
              </div>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">{t("footer.about")}</p>
            <div className="mt-5 flex items-center gap-3">
              <a href="https://twitter.com/" target="_blank" rel="noreferrer" aria-label="Twitter" className="rounded-full border border-border p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full border border-border p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-full border border-border p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground">{t("footer.services")}</h4>
            <ul className="mt-4 space-y-2.5">
              {services.map((s) => (
                <li key={s.href}>
                  <Link to={buildHref(locale, s.href)} className="text-sm text-muted-foreground transition hover:text-primary">{s.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground">{t("footer.quicklinks")}</h4>
            <ul className="mt-4 space-y-2.5">
              {quick.map((q) => (
                <li key={q.href}>
                  <Link to={buildHref(locale, q.href)} className="text-sm text-muted-foreground transition hover:text-primary">{q.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground">{t("footer.contact")}</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span>{locale === "ar" ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia"}</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 text-primary" />
                <a href="tel:+966500000000" className="transition hover:text-primary" dir="ltr">+966 50 000 0000</a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 text-primary" />
                <a href="mailto:hello@fikra-dm.com" className="transition hover:text-primary">hello@fikra-dm.com</a>
              </li>
            </ul>

            <h4 className="mt-6 text-sm font-bold text-foreground">{t("footer.locations")}</h4>
            <ul className="mt-3 space-y-2">
              {locations.map((l) => (
                <li key={l.href}>
                  <Link to={buildHref(locale, l.href)} className="text-xs text-muted-foreground transition hover:text-primary">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
          <p>© {year} {t("footer.rights")}</p>
          <div className="flex items-center gap-4">
            <Link to={buildHref(locale, "/privacy")} className="transition hover:text-primary">{t("footer.privacy")}</Link>
            <Link to={buildHref(locale, "/terms")} className="transition hover:text-primary">{t("footer.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
