import { useEffect, useState } from "react";
import { X, Sparkles, Phone, Gift, Megaphone, Star, Bell, Zap, type LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLocale } from "@/i18n/useLocale";
import { useSiteSetting } from "@/hooks/useSiteSettings";

const ICON_MAP: Record<string, LucideIcon> = {
  Gift, Sparkles, Phone, Megaphone, Star, Bell, Zap,
};

export function AnnouncementBar() {
  const { locale, buildHref } = useLocale();
  const isAr = locale === "ar";
  const [dismissed, setDismissed] = useState(true);
  const [idx, setIdx] = useState(0);

  const announcement = useSiteSetting("announcement", {
    enabled: true,
    messages: [
      { icon: "Gift", ar: "استشارة مجانية + Audit شامل لموقعك", en: "Free consultation + full website Audit", cta_ar: "احجز الآن", cta_en: "Book now", href: "/contact" },
      { icon: "Sparkles", ar: "خصم 15% للعملاء الجدد على باقة الإطلاق", en: "15% off launch bundle for new clients", cta_ar: "اعرف أكثر", cta_en: "Learn more", href: "/services" },
      { icon: "Phone", ar: "تواصل واتساب مباشر مع خبراء فكرة", en: "Direct WhatsApp chat with our experts", cta_ar: "تواصل", cta_en: "Chat", href: "/contact" },
    ],
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDismissed(window.localStorage.getItem("fikra:ann:v1") === "1");
  }, []);

  // Sync --ann-h CSS var on root so layout can offset main and header
  useEffect(() => {
    if (typeof document === "undefined") return;
    const visible = !dismissed && announcement.enabled && announcement.messages.length > 0;
    document.documentElement.style.setProperty("--ann-h", visible ? "36px" : "0px");
  }, [dismissed, announcement.enabled, announcement.messages.length]);

  const items = (announcement.messages || []).map((m) => ({
    icon: ICON_MAP[m.icon] ?? Sparkles,
    text: isAr ? m.ar : m.en,
    cta: isAr ? m.cta_ar ?? "" : m.cta_en ?? "",
    href: m.href || "/contact",
  }));

  useEffect(() => {
    // Respect reduced-motion: do not auto-rotate
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce || items.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 4500);
    return () => clearInterval(t);
  }, [items.length]);

  if (dismissed || !announcement.enabled || items.length === 0) return null;
  const cur = items[idx % items.length];
  const Icon = cur.icon;

  return (
    <div
      style={{ ["--ann-h" as string]: "2.25rem" }}
      className="fixed inset-x-0 top-0 z-50 isolate overflow-hidden bg-gradient-to-r from-primary via-primary-glow to-primary text-primary-foreground shadow-soft motion-reduce:[&_*]:!animate-none"
      role="region"
      aria-label={isAr ? "شريط إعلانات" : "Announcements"}
    >
      <div className="container-app flex h-9 items-center justify-between gap-2 text-[11px] sm:text-sm">
        <Link
          to={buildHref(locale, cur.href)}
          className="flex min-w-0 flex-1 items-center justify-center gap-2 font-medium transition hover:opacity-90"
          data-cta="announcement_link"
          data-cta-placement="announcement_bar"
        >
          <Icon className="h-3.5 w-3.5 shrink-0 animate-pulse" />
          <span key={idx} className="truncate animate-fade-in" aria-live="polite">
            {cur.text}
          </span>
          {cur.cta && (
            <span className="hidden shrink-0 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide sm:inline-block">
              {cur.cta} <span aria-hidden>{isAr ? "←" : "→"}</span>
            </span>
          )}
        </Link>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => {
            setDismissed(true);
            try { window.localStorage.setItem("fikra:ann:v1", "1"); } catch { /* noop */ }
            // Notify header to recalc top offset
            try { window.dispatchEvent(new CustomEvent("fikra:ann:dismissed")); } catch { /* noop */ }
          }}
          className="shrink-0 rounded-full p-1 transition hover:bg-white/15"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}