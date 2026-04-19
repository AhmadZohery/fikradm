import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Globe, ChevronDown, ArrowUpRight } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import { LOCALE_LABELS, type Locale } from "@/i18n/types";
import { services as allServices, industries as allIndustries, getSubServicesFor, getSubIndustriesFor } from "@/content/data";
// blog dropdown removed by design — Blog is now a direct link
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
  const [scrolled, setScrolled] = useState(false);
  const loc = locale === "en" ? "en" : "ar";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/90 shadow-soft backdrop-blur-xl supports-[backdrop-filter]:bg-background/75"
          : "border-b border-transparent bg-background/60 backdrop-blur",
      )}
    >
      <div className={cn("container-app flex items-center justify-between gap-4 transition-all duration-300", scrolled ? "h-16" : "h-16 md:h-20")}>
        {/* Logo */}
        <Link to={buildHref(locale, "/")} className="group flex items-center gap-3" aria-label={t("brand.full")}>
          <div className="relative">
            <span className="absolute inset-0 -z-10 rounded-xl bg-gradient-primary opacity-0 blur-md transition group-hover:opacity-60" aria-hidden />
            <img
              src={logo}
              alt="فكرة"
              className="h-9 w-9 rounded-lg object-cover transition group-hover:scale-105 md:h-10 md:w-10"
            />
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-bold text-foreground transition group-hover:text-primary">{t("brand.name")}</span>
            <span className="text-[11px] text-muted-foreground">{t("brand.tagline")}</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
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
                      "group relative inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                      active ? "text-primary" : "text-foreground/80 hover:text-primary",
                    )}
                  >
                    <span className="relative">
                      {label}
                      <span className={cn(
                        "absolute -bottom-1 start-1/2 h-0.5 -translate-x-1/2 rounded-full bg-primary transition-all duration-300",
                        active || isOpen ? "w-6 opacity-100" : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-60",
                      )} />
                    </span>
                    <ChevronDown className={cn("h-4 w-4 opacity-70 transition-transform duration-300", isOpen && "rotate-180")} />
                  </Link>
                  {isOpen && (
                    <div className="absolute start-1/2 top-full z-50 -translate-x-1/2 pt-3">
                      <div className="grid w-[860px] grid-cols-2 gap-1 rounded-3xl border border-border bg-popover/95 p-3 shadow-elegant backdrop-blur-xl animate-fade-in">
                        {item.mega.map((g) => (
                          <div key={g.groupKey} className="rounded-2xl p-2">
                            <Link
                              to={buildHref(locale, g.href)}
                              className="group/grp flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-bold uppercase tracking-wider text-primary transition hover:bg-primary/10"
                            >
                              {g.groupLabel}
                              <ArrowUpRight className="h-3 w-3 opacity-0 transition group-hover/grp:opacity-100 rtl:rotate-90" />
                            </Link>
                            <div className="mt-1 grid gap-0.5">
                              {g.items.slice(0, 5).map((c) => (
                                <Link
                                  key={c.key}
                                  to={buildHref(locale, c.href)}
                                  className="group/i block rounded-xl px-2.5 py-2 transition hover:bg-accent"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="text-sm font-semibold text-foreground transition group-hover/i:text-primary">{c.label}</div>
                                    <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 text-primary opacity-0 transition group-hover/i:translate-x-0 group-hover/i:opacity-100 rtl:rotate-90" />
                                  </div>
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
                      "group inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                      active ? "text-primary" : "text-foreground/80 hover:text-primary",
                    )}
                  >
                    <span className="relative">
                      {label}
                      <span className={cn(
                        "absolute -bottom-1 start-1/2 h-0.5 -translate-x-1/2 rounded-full bg-primary transition-all duration-300",
                        active || isOpen ? "w-6 opacity-100" : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-60",
                      )} />
                    </span>
                    <ChevronDown className={cn("h-4 w-4 opacity-70 transition-transform duration-300", isOpen && "rotate-180")} />
                  </Link>
                  {isOpen && (
                    <div className="absolute start-0 top-full z-50 min-w-[320px] pt-3">
                      <div className="rounded-2xl border border-border bg-popover/95 p-2 shadow-elegant backdrop-blur-xl animate-fade-in">
                        {item.children.map((c) => (
                          <Link
                            key={c.key}
                            to={buildHref(locale, c.href)}
                            className="group block rounded-xl px-3 py-2.5 transition hover:bg-accent"
                          >
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-semibold text-foreground transition group-hover:text-primary">{c.label}</div>
                              <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 text-primary opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 rtl:rotate-90" />
                            </div>
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
                  "group relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  active ? "text-primary" : "text-foreground/80 hover:text-primary",
                )}
              >
                <span className="relative">
                  {label}
                  <span className={cn(
                    "absolute -bottom-1 start-1/2 h-0.5 -translate-x-1/2 rounded-full bg-primary transition-all duration-300",
                    active ? "w-6 opacity-100" : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-60",
                  )} />
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            to={buildHref(otherLocale)}
            className="group inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 text-xs font-semibold text-foreground/80 backdrop-blur transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            aria-label={`Switch to ${LOCALE_LABELS[otherLocale]}`}
          >
            <Globe className="h-3.5 w-3.5 transition group-hover:rotate-180 duration-500" />
            {LOCALE_LABELS[otherLocale]}
          </Link>
          <Link
            to={buildHref(locale, "/contact")}
            className="group hidden h-10 items-center gap-1.5 rounded-full bg-gradient-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:scale-[1.03] hover:shadow-glow md:inline-flex"
          >
            {t("nav.cta")}
            <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:rotate-45 rtl:rotate-90 rtl:group-hover:rotate-[135deg]" />
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/60 backdrop-blur transition hover:border-primary/40 hover:bg-primary/5 lg:hidden"
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
        <div className="border-t border-border bg-background/95 backdrop-blur-xl lg:hidden animate-fade-in">
          <nav className="container-app flex max-h-[80vh] flex-col gap-1 overflow-y-auto py-4" aria-label="Mobile">
            {navItems.map((item) => (
              <div key={item.key} className="animate-fade-up" style={{ animationDelay: `${navItems.indexOf(item) * 40}ms` }}>
                <Link
                  to={buildHref(locale, item.href)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground transition hover:bg-accent hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  {t(`nav.${item.key}`)}
                </Link>
                {item.mega && (
                  <div className="ms-3 border-s-2 border-primary/20 ps-3">
                    {item.mega.map((g) => (
                      <div key={g.groupKey} className="mt-1">
                        <Link
                          to={buildHref(locale, g.href)}
                          className="block rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary"
                          onClick={() => setMobileOpen(false)}
                        >
                          {g.groupLabel}
                        </Link>
                        {g.items.slice(0, 4).map((c) => (
                          <Link
                            key={c.key}
                            to={buildHref(locale, c.href)}
                            className="block rounded-lg px-4 py-1.5 text-sm text-muted-foreground transition hover:text-primary"
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
                  <div className="ms-3 border-s-2 border-primary/20 ps-3">
                    {item.children.map((c) => (
                      <Link
                        key={c.key}
                        to={buildHref(locale, c.href)}
                        className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:text-primary"
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
              className="mt-3 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 text-sm font-bold text-primary-foreground shadow-soft"
              onClick={() => setMobileOpen(false)}
            >
              {t("nav.cta")}
              <ArrowUpRight className="h-4 w-4 rtl:rotate-90" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
