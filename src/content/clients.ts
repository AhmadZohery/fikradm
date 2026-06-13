/**
 * Single source of truth for all clients shown across the site
 * (ClientsWall, LogosStrip, footer trust marks, etc.).
 *
 * HOW TO ADD A REAL LOGO IMAGE
 * 1. Drop the file into `src/assets/clients/` using kebab-case:
 *      src/assets/clients/maticauto.svg   (SVG preferred — scales crisply)
 *      src/assets/clients/garage-90.png   (PNG with transparent bg also fine)
 * 2. Import it at the top of this file and set it on `logo`:
 *      import maticauto from "@/assets/clients/maticauto.svg";
 *      { slug: "maticauto", logo: maticauto, ... }
 * 3. If no `logo` is provided, the UI auto-falls back to the typographic
 *    wordmark using `name` + `style`. So you can add a brand now and
 *    upload the logo later without breaking anything.
 */

export type ClientIndustry =
  | "automotive"
  | "real_estate"
  | "healthcare"
  | "retail"
  | "fb"
  | "services"
  | "fashion"
  | "tech";

export type ClientWordmarkStyle = "serif" | "sans" | "italic" | "wide" | "ar";

export type Client = {
  /** Stable identifier used in URLs, analytics events, etc. */
  slug: string;
  /** Display name (AR users see this as-is for Arabic brands). */
  name: string;
  /** Optional latin/english name to render in EN locale. */
  nameEn?: string;
  /** Optional brand color used for accents (hex). */
  color?: string;
  /** One or more industries — drives the wall filter. */
  industries: ClientIndustry[];
  /** Typography variant when no `logo` image is provided. */
  style?: ClientWordmarkStyle;
  /**
   * Imported logo image (SVG/PNG). When set, the UI renders this image
   * instead of the typographic wordmark. Leave undefined to use the
   * automatic wordmark fallback.
   */
  logo?: string;
  /** Optional small secondary badge (e.g. "BOSCH partner"). */
  tag?: string;
  /** Set true to feature on the homepage strip (top 8 recommended). */
  featured?: boolean;
};

export const CLIENTS: Client[] = [
  { slug: "maticauto", name: "MaTicAuto", industries: ["automotive"], style: "sans", color: "#1a1a1a", featured: true },
  { slug: "garage-90", name: "GARAGE 90", industries: ["automotive"], style: "wide", color: "#1e3a8a", featured: true },
  { slug: "al-amin", name: "AL AMIN", tag: "BOSCH", industries: ["automotive"], style: "sans", color: "#dc2626", featured: true },
  { slug: "ksr-motors", name: "KSR Motors", industries: ["automotive"], style: "wide", color: "#dc2626" },
  { slug: "fix-it", name: "FIX IT", industries: ["automotive"], style: "wide", color: "#b45309" },
  { slug: "car-care", name: "Car Care", industries: ["automotive"], style: "italic", color: "#1d4ed8" },
  { slug: "part-tech", name: "PartTech", industries: ["automotive"], style: "sans", color: "#ea580c" },
  { slug: "cardoo", name: "cardoO", industries: ["automotive", "tech"], style: "sans", color: "#0f172a", featured: true },
  { slug: "altamayoz", name: "التميّز العقارية", nameEn: "Al-Tamayoz Real Estate", industries: ["real_estate"], style: "ar", color: "#0f766e" },
  { slug: "new-city", name: "NEW CITY", industries: ["real_estate"], style: "wide", color: "#0f172a" },
  { slug: "shs", name: "SHS", industries: ["real_estate", "services"], style: "serif", color: "#0f172a", featured: true },
  { slug: "artistry-living", name: "Artistry Living", industries: ["real_estate"], style: "serif", color: "#a16207" },
  { slug: "crystal-dental", name: "Crystal Dental", industries: ["healthcare"], style: "sans", color: "#10b981", featured: true },
  { slug: "dr-rafa", name: "د. رفا القاضي", nameEn: "Dr. Rafa Al-Qadi", industries: ["healthcare"], style: "ar", color: "#0d9488" },
  { slug: "la-beaute", name: "La Béauté", industries: ["healthcare"], style: "italic", color: "#be185d" },
  { slug: "dr-amir", name: "Dr. Amir Magdy", industries: ["healthcare"], style: "serif", color: "#0f172a" },
  { slug: "tulip", name: "TULIP", industries: ["fashion", "retail"], style: "wide", color: "#0f172a" },
  { slug: "kervano", name: "KERVANO", industries: ["retail", "fashion"], style: "wide", color: "#0f172a" },
  { slug: "bassant", name: "BASSANT", industries: ["fashion", "retail"], style: "wide", color: "#9f1239" },
  { slug: "nba-outlet", name: "NBA Outlet", industries: ["retail"], style: "sans", color: "#ea580c" },
  { slug: "eco-clean", name: "ECO CLEAN", industries: ["services"], style: "sans", color: "#16a34a", featured: true },
  { slug: "egypt-career", name: "Egypt Career", industries: ["services"], style: "sans", color: "#0284c7" },
  { slug: "mcc", name: "MCC", industries: ["services", "tech"], style: "serif", color: "#1e3a8a" },
  { slug: "yshot", name: "YShot", industries: ["tech"], style: "italic", color: "#dc2626" },
  { slug: "al-nadi", name: "النادي", nameEn: "Al-Nadi", industries: ["fb", "services"], style: "ar", color: "#0f766e" },
  { slug: "kobba-shamia", name: "الكبة الشامية", nameEn: "Al-Kobba Al-Shamia", industries: ["fb"], style: "ar", color: "#b45309" },
];

export const CLIENT_INDUSTRIES: { id: ClientIndustry | "all"; ar: string; en: string }[] = [
  { id: "all", ar: "كل القطاعات", en: "All industries" },
  { id: "automotive", ar: "السيارات والصيانة", en: "Automotive" },
  { id: "real_estate", ar: "العقارات", en: "Real estate" },
  { id: "healthcare", ar: "الرعاية الصحية", en: "Healthcare" },
  { id: "retail", ar: "التجزئة", en: "Retail" },
  { id: "fashion", ar: "الأزياء", en: "Fashion" },
  { id: "fb", ar: "المطاعم والأغذية", en: "F&B" },
  { id: "services", ar: "خدمات الأعمال", en: "Business services" },
  { id: "tech", ar: "التقنية", en: "Tech" },
];

export function getFeaturedClients(): Client[] {
  return CLIENTS.filter((c) => c.featured);
}