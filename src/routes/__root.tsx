import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  useLocation,
  Link,
} from "@tanstack/react-router";
import { useMemo } from "react";

import appCss from "@/styles.css?url";
import { isLocale, DEFAULT_LOCALE } from "@/i18n/types";
import { SiteLayout } from "@/components/site/SiteLayout";

function NotFoundComponent() {
  return (
    <SiteLayout>
      <div className="container-app section text-center">
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-6xl">
          الصفحة غير موجودة / Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          الرابط الذي تبحث عنه غير متاح. عُد إلى الرئيسية لاكتشاف خدماتنا.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:bg-primary/90"
          >
            الرئيسية / Home
          </Link>
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
      { property: "og:site_name", content: "Fikra Digital Marketing" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@FikraDM" },
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
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Tajawal:wght@400;500;700;800&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Fikra Digital Marketing",
          alternateName: "فكرة للتسويق الرقمي",
          url: "https://fikra-dm.com",
          logo: "https://fikra-dm.com/logo.png",
          sameAs: [
            "https://twitter.com/FikraDM",
            "https://www.linkedin.com/company/fikra-dm",
            "https://www.instagram.com/fikra.dm",
          ],
          address: {
            "@type": "PostalAddress",
            addressCountry: "SA",
            addressLocality: "Riyadh",
          },
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
