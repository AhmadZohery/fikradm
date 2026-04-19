import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import { LOCALE_LABELS, type Locale } from "@/i18n/types";
import { services as allServices, industries as allIndustries, getSubServicesFor, getSubIndustriesFor } from "@/content/data";
import logo from "@/assets/fikra-logo.jpg";
import { cn } from "@/lib/utils";

type SubLink = { key: string; label: string; href: string; desc?: string };
type NavItem = {
  key: string;
  href: string;
  children?: SubLink[];
  mega?: { groupKey: string; groupLabel: string; href: string; items: SubLink[] }[];
};

export function SiteHeader() {
  const { locale, t, buildHref, pathWithoutLocale } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const loc = locale === "en" ? "en" : "ar";

  const servicesMega = allServices.map((svc) => ({
    groupKey: svc.slug,
    groupLabel: svc.title[loc],
    href: `/services/${svc.slug}`,
    items: getSubServicesFor(svc.slug).map((sub) => ({
      key: sub.slug,
      label: sub.shortLabel[loc],
      href: `/services/${svc.slug}/${sub.slug}`,
      desc: sub.intro[loc],
    })),
  }));

  const industriesMega = allIndustries.map((ind) => ({
    groupKey: ind.slug,
    groupLabel: ind.title[loc],
    href: `/industries/${ind.slug}`,
    items: getSubIndustriesFor(ind.slug).map((sub) => ({
      key: sub.slug,
      label: sub.shortLabel[loc],
      href: `/industries/${ind.slug}/${sub.slug}`,
      desc: sub.intro[loc],
    })),
  }));

  const navItems: NavItem[] = [
    { key: "home", href: "/" },
    { key: "about", href: "/about" },
    { key: "services", href: "/services", mega: servicesMega },
    { key: "industries", href: "/industries", mega: industriesMega },
    { key: "cases", href: "/case-studies" },
    { key: "blog", href: "/blog" },
    { key: "contact", href: "/contact" },
  ];

  const otherLocale: Locale = locale === "ar" ? "en" : "ar";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container-app flex h-16 items-center justify-between gap-4 md:h-20">
        {/* Logo */}
        <Link to={buildHref(locale, "/")} className="flex items-center gap-3" aria-label={t("brand.full")}>
          <img src={logo} alt="فكرة" className="h-9 w-9 rounded-lg object-cover md:h-10 md:w-10" />
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-bold text-foreground">{t("brand.name")}</span>
            <span className="text-[11px] text-muted-foreground">{t("brand.tagline")}</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navItems.map((item) => {
            const label = t(`nav.${item.key}`);
            const href = buildHref(locale, item.href);
            const active = pathWithoutLocale === item.href || (item.href !== "/" && pathWithoutLocale.startsWith(item.href));
            if (item.mega) {
              const isOpen = openMenu === item.key;
              return (
                <div
                  key={item.key}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(item.key)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <Link
                    to={href}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                      active ? "text-primary" : "text-foreground/80 hover:text-foreground",
                    )}
                  >
                    {label}
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  </Link>
                  {isOpen && (
                    <div className="absolute start-0 top-full z-50 pt-2">
                      <div className="grid w-[860px] grid-cols-2 gap-1 rounded-2xl border border-border bg-popover p-3 shadow-elegant">
                        {item.mega.map((g) => (
                          <div key={g.groupKey} className="rounded-xl p-2">
                            <Link
                              to={buildHref(locale, g.href)}
                              className="block rounded-lg px-2 py-1.5 text-xs font-bold uppercase tracking-wide text-primary hover:bg-accent"
                            >
                              {g.groupLabel}
                            </Link>
                            <div className="mt-1 grid gap-0.5">
                              {g.items.map((c) => (
                                <Link
                                  key={c.key}
                                  to={buildHref(locale, c.href)}
                                  className="block rounded-lg px-2 py-1.5 transition hover:bg-accent"
                                >
                                  <div className="text-sm font-semibold text-foreground">{c.label}</div>
                                  {c.desc && (
                                    <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                                      {c.desc}
                                    </div>
                                  )}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            if (item.children) {
              const isOpen = openMenu === item.key;
              return (
                <div
                  key={item.key}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(item.key)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <Link
                    to={href}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                      active ? "text-primary" : "text-foreground/80 hover:text-foreground",
                    )}
                  >
                    {label}
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  </Link>
                  {isOpen && (
                    <div className="absolute start-0 top-full z-50 min-w-[320px] pt-2">
                      <div className="rounded-2xl border border-border bg-popover p-2 shadow-elegant">
                        {item.children.map((c) => (
                          <Link
                            key={c.key}
                            to={buildHref(locale, c.href)}
                            className="block rounded-xl px-3 py-2.5 transition hover:bg-accent"
                          >
                            <div className="text-sm font-semibold text-foreground">{c.label}</div>
                            {c.desc && <div className="mt-0.5 text-xs text-muted-foreground">{c.desc}</div>}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={item.key}
                to={href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  active ? "text-primary" : "text-foreground/80 hover:text-foreground",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            to={buildHref(otherLocale)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold text-foreground/80 transition hover:bg-accent hover:text-foreground"
            aria-label={`Switch to ${LOCALE_LABELS[otherLocale]}`}
          >
            <Globe className="h-3.5 w-3.5" />
            {LOCALE_LABELS[otherLocale]}
          </Link>
          <Link
            to={buildHref(locale, "/contact")}
            className="hidden h-10 items-center rounded-full bg-gradient-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95 md:inline-flex"
          >
            {t("nav.cta")}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={t("nav.menu")}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container-app flex flex-col gap-1 py-4" aria-label="Mobile">
            {navItems.map((item) => (
              <div key={item.key}>
                <Link
                  to={buildHref(locale, item.href)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-accent"
                  onClick={() => setMobileOpen(false)}
                >
                  {t(`nav.${item.key}`)}
                </Link>
                {item.mega && (
                  <div className="ms-3 border-s border-border ps-3">
                    {item.mega.map((g) => (
                      <div key={g.groupKey} className="mt-1">
                        <Link
                          to={buildHref(locale, g.href)}
                          className="block rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary"
                          onClick={() => setMobileOpen(false)}
                        >
                          {g.groupLabel}
                        </Link>
                        {g.items.map((c) => (
                          <Link
                            key={c.key}
                            to={buildHref(locale, c.href)}
                            className="block rounded-lg px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                            onClick={() => setMobileOpen(false)}
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
                {item.children && (
                  <div className="ms-3 border-s border-border ps-3">
                    {item.children.map((c) => (
                      <Link
                        key={c.key}
                        to={buildHref(locale, c.href)}
                        className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setMobileOpen(false)}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              to={buildHref(locale, "/contact")}
              className="mt-3 inline-flex h-11 items-center justify-center rounded-full bg-gradient-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft"
              onClick={() => setMobileOpen(false)}
            >
              {t("nav.cta")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
