export type Locale = "ar" | "en";

export const LOCALES: Locale[] = ["ar", "en"];
export const DEFAULT_LOCALE: Locale = "ar";

export const LOCALE_LABELS: Record<Locale, string> = {
  ar: "العربية",
  en: "English",
};

export const LOCALE_DIR: Record<Locale, "rtl" | "ltr"> = {
  ar: "rtl",
  en: "ltr",
};

export function isLocale(value: string | undefined): value is Locale {
  return value === "ar" || value === "en";
}

export function normalizeLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
