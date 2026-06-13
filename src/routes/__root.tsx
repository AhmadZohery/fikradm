import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  useLocation,
} from "@tanstack/react-router";
import { useMemo } from "react";

import appCss from "@/styles.css?url";
import { isLocale, DEFAULT_LOCALE } from "@/i18n/types";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SITE_ORIGIN, SITE_NAME, organizationLd, localBusinessLd, siteNavigationLd } from "@/lib/seo";

function NotFoundComponent() {
  const quickLinks: Array<{ href: string; label: string }> = [
    { href: "/services", label: "الخدمات" },
    { href: "/industries", label: "القطاعات" },
    { href: "/case-studies", label: "قصص النجاح" },
    { href: "/blog", label: "المدونة" },
    { href: "/about", label: "من نحن" },
    { href: "/contact", label: "تواصل معنا" },
  ];
  return (
    <SiteLayout>
      <div className="container-app section text-center" dir="rtl">
        <p className="text-sm font-semibold text-primary">404 — الصفحة غير موجودة</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
          الصفحة غير موجودة أو تم نقلها
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          الرابط الذي حاولت فتحه لم نتمكن من الوصول إليه. قد يكون قديمًا أو
          مكتوبًا بشكل غير صحيح. اختر من الأقسام التالية، أو ابدأ بتشخيص نمو مجاني لعملك.
        </p>

        <form action="/search" method="get" className="mx-auto mt-6 flex max-w-md gap-2">
          <input
            name="q"
            type="search"
            placeholder="ابحث في الموقع…"
            aria-label="ابحث في الموقع"
            className="h-11 flex-1 rounded-full border border-border bg-surface px-4 text-sm outline-none focus:border-primary"
          />
          <button type="submit" className="h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            بحث
          </button>
        </form>

        <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2 text-sm">
          {quickLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full border border-border bg-surface px-4 py-2 transition hover:border-primary hover:text-primary"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:bg-primary/90"
          >
            احجز تشخيص نمو مجاني
          </a>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold transition hover:border-primary hover:text-primary"
          >
            العودة للرئيسية
          </a>
        </div>
      </div>
    </SiteLayout>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "فكرة للتسويق الرقمي | Fikra Digital Marketing" },
      {
        name: "description",
        content:
          "وكالة تسويق رقمي مرخّصة في السعودية. سيو، إعلانات، تصميم، تطوير مواقع وحلول نمو متكاملة لشركات الخليج.",
      },
      { name: "author", content: "Fikra Digital Marketing" },
      { name: "theme-color", content: "#5b4fe0" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@FikraDM" },
      { name: "format-detection", content: "telephone=no" },
      { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      // dns-prefetch fallback for older browsers
      { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
      { rel: "dns-prefetch", href: "https://fonts.gstatic.com" },
      // Preload critical Arabic font weight to accelerate LCP text paint
      {
        rel: "preload",
        as: "style",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;700&family=Tajawal:wght@400;700;800&family=Space+Grotesk:wght@600;700&display=swap",
      },
      {
        rel: "stylesheet",
        // Trim weights & enforce display=swap for faster LCP and zero invisible-text CLS
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;700&family=Tajawal:wght@400;700;800&family=Space+Grotesk:wght@600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            organizationLd(),
            localBusinessLd(),
            {
              "@type": "WebSite",
              "@id": `${SITE_ORIGIN}#website`,
              url: SITE_ORIGIN,
              name: SITE_NAME,
              inLanguage: ["ar", "en"],
              publisher: { "@id": `${SITE_ORIGIN}#org` },
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_ORIGIN}/ar/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            },
            siteNavigationLd("ar"),
            siteNavigationLd("en"),
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const segments = (location.pathname || "/").split("/").filter(Boolean);
  const first = segments[0];
  const locale = isLocale(first) ? first : DEFAULT_LOCALE;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const location = useLocation();

  const localeInfo = useMemo(() => {
    const segments = (location.pathname || "/").split("/").filter(Boolean);
    const first = segments[0];
    const locale = isLocale(first) ? first : DEFAULT_LOCALE;
    return { locale, dir: locale === "ar" ? "rtl" : "ltr" } as const;
  }, [location.pathname]);

  if (typeof document !== "undefined") {
    document.documentElement.lang = localeInfo.locale;
    document.documentElement.dir = localeInfo.dir;
  }

  return <Outlet />;
}
