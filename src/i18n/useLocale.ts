import { useLocation } from "@tanstack/react-router";
import { useMemo } from "react";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./types";
import { t as translate } from "./dictionary";

/**
 * Detects current locale from URL path: /ar/... or /en/...
 * Falls back to default if not present.
 */
export function useLocale(): {
  locale: Locale;
  dir: "rtl" | "ltr";
  t: (key: string, vars?: Record<string, string | number>) => string;
  pathWithoutLocale: string;
  buildHref: (locale: Locale, path?: string) => string;
} {
  const location = useLocation();
  const pathname = location.pathname || "/";

  return useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const first = segments[0];
    const locale: Locale = isLocale(first) ? first : DEFAULT_LOCALE;
    const rest = isLocale(first) ? segments.slice(1) : segments;
    const pathWithoutLocale = "/" + rest.join("/");
    const dir = locale === "ar" ? "rtl" : "ltr";

    const buildHref = (target: Locale, path?: string) => {
      const p = path ?? pathWithoutLocale;
      const clean = p.startsWith("/") ? p : `/${p}`;
      if (clean === "/" || clean === "") return `/${target}`;
      return `/${target}${clean}`;
    };

    return {
      locale,
      dir,
      t: (key, vars) => translate(locale, key, vars),
      pathWithoutLocale: pathWithoutLocale === "" ? "/" : pathWithoutLocale,
      buildHref,
    };
  }, [pathname]);
}
