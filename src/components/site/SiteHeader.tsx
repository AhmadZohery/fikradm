import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Globe, ChevronDown, ArrowUpRight, Sparkles, Search } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import { LOCALE_LABELS, type Locale } from "@/i18n/types";
import { services as allServices, industries as allIndustries, getSubServicesFor, getSubIndustriesFor } from "@/content/data";
import logo from "@/assets/fikra-logo.jpg";
import { cn } from "@/lib/utils";
import { CommandPalette } from "./CommandPalette";

type SubLink = { key: string; label: string; href: string; desc?: string };
type NavItem = {
  key: string;
  href: string;
  mega?: { groupKey: string; groupLabel: string; href: string; items: SubLink[] }[];
};

export function SiteHeader() {
  const { locale, t, buildHref, pathWithoutLocale } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const loc = locale === "en" ? "en" : "ar";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathWithoutLocale]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close menus on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpenMenu(null); setMobileOpen(false); }
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      // "/" anywhere (when not typing) to open
      if (e.key === "/" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
    <>
      {/* Mega menu backdrop */}
      <div
        className={cn(
          "pointer-events-none fixed inset-0 z-30 bg-ink/30 backdrop-blur-[3px] transition-opacity duration-500",
          openMenu ? "opacity-100" : "opacity-0",
        )}
        aria-hidden
      />

      <header
        style={{ ["--header-h" as string]: scrolled ? "4rem" : "5rem" }}
        className={cn(
          "fixed inset-x-0 top-0 z-40 w-full transition-all duration-500 ease-out",
          scrolled ? "py-2" : "py-3 md:py-4",
        )}
      >
        <div
          className={cn(
            "container-app transition-all duration-500 ease-out",
          )}
        >
          <div
            className={cn(
              "flex items-center justify-between gap-4 rounded-full border transition-all duration-500 ease-out",
              scrolled
                ? "header-glass border-border/60 px-3 py-2 shadow-elegant md:px-4"
                : "border-white/40 bg-white/55 px-4 py-2.5 shadow-soft backdrop-blur-xl md:px-5",
            )}
          >
          {/* Logo */}
          <Link to={buildHref(locale, "/")} className="group flex items-center gap-3" aria-label={t("brand.full")}>
            <div className="relative">
              <span className="absolute inset-0 -z-10 rounded-2xl bg-gradient-primary opacity-0 blur-lg transition-all duration-500 group-hover:opacity-70 group-hover:blur-xl" aria-hidden />
              <img
                src={logo}
                alt="فكرة"
                className="h-9 w-9 rounded-xl object-cover ring-2 ring-transparent transition-all duration-300 group-hover:scale-110 group-hover:ring-primary/40 md:h-10 md:w-10"
              />
            </div>
            <div className="hidden flex-col leading-tight sm:flex">
              <span className="text-sm font-extrabold tracking-tight text-foreground transition group-hover:text-primary">{t("brand.name")}</span>
              <span className="text-[11px] font-medium text-muted-foreground">{t("brand.tagline")}</span>
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
                      data-active={active || isOpen}
                      className={cn(
                        "nav-link-fx group relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold tracking-tight transition-colors duration-300",
                        active || isOpen ? "text-primary" : "text-foreground/75 hover:text-primary",
                      )}
                    >
                      {label}
                      <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-300", isOpen && "rotate-180")} />
                    </Link>
                    {isOpen && (
                      <div className="absolute end-0 top-full z-50 pt-3 lg:start-1/2 lg:end-auto lg:-translate-x-1/2 rtl:lg:translate-x-1/2">
                        <div className="grid w-[min(92vw,860px)] grid-cols-1 gap-0 overflow-hidden rounded-3xl border border-border bg-popover/98 shadow-pop backdrop-blur-xl animate-mega-in lg:grid-cols-[1fr_2fr]">
                          {/* Sidebar promo */}
                          <div className="relative flex flex-col justify-between bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
                            <div>
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                                <Sparkles className="h-3 w-3" />
                                {item.key === "services" ? (loc === "ar" ? "خدماتنا" : "Services") : (loc === "ar" ? "قطاعاتنا" : "Industries")}
                              </span>
                              <h3 className="mt-3 text-lg font-extrabold leading-tight">
                                {item.key === "services"
                                  ? (loc === "ar" ? "حلول نمو متكاملة" : "Integrated growth solutions")
                                  : (loc === "ar" ? "خبرة في كل قطاع" : "Deep industry expertise")}
                              </h3>
                              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                {item.key === "services"
                                  ? (loc === "ar" ? "اختر التخصص المناسب لمشروعك واكتشف ما يمكننا تقديمه." : "Pick the discipline that fits your goals and explore what we deliver.")
                                  : (loc === "ar" ? "تجربتنا تمتد عبر قطاعات متعددة بفهم عميق لكل سوق." : "We work across many industries with deep market understanding.")}
                              </p>
                            </div>
                            <Link
                              to={href}
                              className="group/cta mt-6 inline-flex items-center gap-2 self-start rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-soft transition hover:scale-105 hover:shadow-glow"
                            >
                              {loc === "ar" ? "عرض الكل" : "View all"}
                              <ArrowUpRight className="h-3 w-3 transition group-hover/cta:rotate-45 rtl:rotate-90 rtl:group-hover/cta:rotate-[135deg]" />
                            </Link>
                          </div>

                          {/* Groups */}
                          <div className="grid grid-cols-2 gap-1 p-3">
                            {item.mega.map((g, gi) => (
                              <div
                                key={g.groupKey}
                                className="animate-mega-item rounded-2xl p-2"
                                style={{ animationDelay: `${gi * 50}ms` }}
                              >
                                <Link
                                  to={buildHref(locale, g.href)}
                                  className="group/grp flex items-center justify-between rounded-xl px-2.5 py-2 text-[11px] font-bold uppercase tracking-widest text-primary transition hover:bg-primary/10"
                                >
                                  {g.groupLabel}
                                  <ArrowUpRight className="h-3 w-3 -translate-x-1 opacity-0 transition group-hover/grp:translate-x-0 group-hover/grp:opacity-100 rtl:rotate-90" />
                                </Link>
                                <div className="mt-1 grid gap-0.5">
                                  {g.items.slice(0, 4).map((c) => (
                                    <Link
                                      key={c.key}
                                      to={buildHref(locale, c.href)}
                                      className="group/i block rounded-xl px-2.5 py-2 transition-all duration-200 hover:bg-accent hover:translate-x-1 rtl:hover:-translate-x-1"
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
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.key}
                  to={href}
                  data-active={active}
                  className={cn(
                    "nav-link-fx group relative rounded-full px-4 py-2 text-sm font-semibold tracking-tight transition-colors duration-300",
                    active ? "text-primary" : "text-foreground/75 hover:text-primary",
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={loc === "ar" ? "بحث" : "Search"}
              className="group inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 text-xs font-bold text-foreground/80 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-primary hover:shadow-soft"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{loc === "ar" ? "بحث" : "Search"}</span>
              <kbd className="hidden rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground md:inline">⌘K</kbd>
            </button>
            <Link
              to={buildHref(otherLocale)}
              className="group inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 text-xs font-bold text-foreground/80 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-primary hover:shadow-soft"
              aria-label={`Switch to ${LOCALE_LABELS[otherLocale]}`}
            >
              <Globe className="h-3.5 w-3.5 transition duration-500 group-hover:rotate-180" />
              {LOCALE_LABELS[otherLocale]}
            </Link>
            <Link
              to={buildHref(locale, "/contact")}
              className="group relative hidden h-10 items-center gap-1.5 overflow-hidden rounded-full bg-gradient-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition-all duration-300 hover:scale-[1.04] hover:shadow-glow md:inline-flex"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">{t("nav.cta")}</span>
              <ArrowUpRight className="relative h-3.5 w-3.5 transition group-hover:rotate-45 rtl:rotate-90 rtl:group-hover:rotate-[135deg]" />
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

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="mt-2 overflow-hidden rounded-3xl border border-border/60 bg-background/95 shadow-elegant backdrop-blur-xl lg:hidden animate-mega-in">
              <nav className="flex max-h-[75vh] flex-col gap-1 overflow-y-auto p-4" aria-label="Mobile">
                {navItems.map((item, idx) => (
                  <div key={item.key} className="animate-fade-up" style={{ animationDelay: `${idx * 40}ms` }}>
                    <Link
                      to={buildHref(locale, item.href)}
                      className="block rounded-xl px-3 py-2.5 text-sm font-bold text-foreground transition hover:bg-accent hover:text-primary"
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
                              className="block rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary"
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
        </div>
        </div>
      </header>
      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
