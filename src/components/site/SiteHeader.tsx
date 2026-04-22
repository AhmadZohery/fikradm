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
  const [annVisible, setAnnVisible] = useState(false);
  const loc = locale === "en" ? "en" : "ar";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track announcement bar visibility (it's fixed at top-0 above the header)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => {
      try {
        setAnnVisible(window.localStorage.getItem("fikra:ann:v1") !== "1");
      } catch {
        setAnnVisible(true);
      }
    };
    check();
    const onDismiss = () => setAnnVisible(false);
    window.addEventListener("fikra:ann:dismissed", onDismiss);
    return () => window.removeEventListener("fikra:ann:dismissed", onDismiss);
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
        style={{
          ["--header-h" as string]: scrolled ? "4rem" : "5rem",
          top: annVisible ? "2.25rem" : "0",
        }}
        className={cn(
          "fixed inset-x-0 z-40 w-full transition-all duration-500 ease-out",
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
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search — icon only on mobile, full pill on md+ */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={loc === "ar" ? "بحث" : "Search"}
              className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/60 text-foreground/80 backdrop-blur transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:text-primary md:h-9 md:w-auto md:gap-1.5 md:px-3 md:text-xs md:font-bold"
            >
              <Search className="h-4 w-4 md:h-3.5 md:w-3.5" />
              <span className="hidden md:inline">{loc === "ar" ? "بحث" : "Search"}</span>
              <kbd className="hidden rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground md:inline">⌘K</kbd>
            </button>
            {/* Language toggle — icon only on mobile */}
            <Link
              to={buildHref(otherLocale)}
              className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/60 text-foreground/80 backdrop-blur transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:text-primary md:h-9 md:w-auto md:gap-1.5 md:px-3 md:text-xs md:font-bold"
              aria-label={`Switch to ${LOCALE_LABELS[otherLocale]}`}
            >
              <Globe className="h-4 w-4 transition duration-500 group-hover:rotate-180 md:h-3.5 md:w-3.5" />
              <span className="hidden md:inline">{LOCALE_LABELS[otherLocale]}</span>
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
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/60 text-foreground backdrop-blur transition hover:border-primary/40 hover:bg-primary/5 active:scale-95 lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={t("nav.menu")}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu-drawer"
            >
             {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
        </div>
      </header>
      {/* Mobile off-canvas drawer (full-screen) */}
      <div
        id="mobile-menu-drawer"
        className={cn(
          "fixed inset-0 z-[60] lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-ink/60 backdrop-blur-sm transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMobileOpen(false)}
        />
        {/* Panel */}
        <div
          className={cn(
            "absolute inset-y-0 end-0 flex h-full w-[88%] max-w-sm flex-col bg-background shadow-elegant transition-transform duration-300 ease-out",
            mobileOpen
              ? "translate-x-0"
              : (locale === "ar" ? "-translate-x-full" : "translate-x-full"),
          )}
          role="dialog"
          aria-modal="true"
          aria-label={t("nav.menu")}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <img src={logo} alt="" className="h-8 w-8 rounded-lg object-cover" />
              <span className="text-sm font-extrabold">{t("brand.name")}</span>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label={loc === "ar" ? "إغلاق" : "Close"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/80 transition hover:bg-accent active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search shortcut */}
          <button
            type="button"
            onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
            className="mx-4 mt-3 flex items-center gap-2 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-start text-sm text-muted-foreground transition active:scale-[0.98]"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1">{loc === "ar" ? "ابحث في الموقع…" : "Search the site…"}</span>
          </button>

          {/* Nav list */}
          <nav className="mt-2 flex-1 overflow-y-auto overscroll-contain px-2 pb-6" aria-label="Mobile">
            {navItems.map((item) => {
              const label = t(`nav.${item.key}`);
              const href = buildHref(locale, item.href);
              const active = pathWithoutLocale === item.href || (item.href !== "/" && pathWithoutLocale.startsWith(item.href));
              const isOpen = openMenu === item.key;

              if (!item.mega) {
                return (
                  <Link
                    key={item.key}
                    to={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex min-h-12 items-center rounded-2xl px-4 py-3 text-base font-bold transition active:scale-[0.98]",
                      active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent",
                    )}
                  >
                    {label}
                  </Link>
                );
              }
              return (
                <div key={item.key} className="mb-1">
                  <button
                    type="button"
                    onClick={() => setOpenMenu(isOpen ? null : item.key)}
                    aria-expanded={isOpen}
                    className={cn(
                      "flex min-h-12 w-full items-center justify-between rounded-2xl px-4 py-3 text-base font-bold transition active:scale-[0.98]",
                      active || isOpen ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent",
                    )}
                  >
                    <span>{label}</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isOpen && "rotate-180")} />
                  </button>
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-out",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="ms-3 mt-1 border-s-2 border-primary/20 ps-3">
                        <Link
                          to={href}
                          onClick={() => setMobileOpen(false)}
                          className="flex min-h-11 items-center rounded-xl px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5"
                        >
                          {loc === "ar" ? "عرض الكل" : "View all"} ←
                        </Link>
                        {item.mega.map((g) => (
                          <div key={g.groupKey} className="mt-1">
                            <Link
                              to={buildHref(locale, g.href)}
                              onClick={() => setMobileOpen(false)}
                              className="flex min-h-11 items-center rounded-xl px-3 py-2 text-sm font-bold text-foreground hover:bg-accent"
                            >
                              {g.groupLabel}
                            </Link>
                            {g.items.slice(0, 4).map((c) => (
                              <Link
                                key={c.key}
                                to={buildHref(locale, c.href)}
                                onClick={() => setMobileOpen(false)}
                                className="flex min-h-10 items-center rounded-xl px-5 py-1.5 text-sm text-muted-foreground transition hover:text-primary"
                              >
                                {c.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Drawer footer CTA + lang */}
          <div className="border-t border-border/60 bg-background/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <Link
              to={buildHref(locale, "/contact")}
              onClick={() => setMobileOpen(false)}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground shadow-soft active:scale-[0.98]"
            >
              {t("nav.cta")}
              <ArrowUpRight className="h-4 w-4 rtl:rotate-90" />
            </Link>
            <Link
              to={buildHref(otherLocale)}
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border text-xs font-bold text-foreground/80"
            >
              <Globe className="h-3.5 w-3.5" />
              {LOCALE_LABELS[otherLocale]}
            </Link>
          </div>
        </div>
      </div>
      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
