import { MessageCircle, Phone } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import { useSiteSetting } from "@/hooks/useSiteSettings";

/**
 * Floating contact dock — WhatsApp + Call.
 * Uses the unified .btn-cta system for hover/focus/active states.
 * CTR tracked via [data-cta] (delegated listener in PageViewTracker).
 */
export function WhatsAppButton() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const contact = useSiteSetting("contact", {
    whatsapp: "+966500000000",
    phone: "+966500000000",
    email: "hello@fikra.sa",
  });
  const text = isAr
    ? "مرحباً، أرغب في استشارة مع فكرة للتسويق الرقمي"
    : "Hi, I'd like a consultation with Fikra Digital Marketing";
  const waNumber = (contact.whatsapp || "+966500000000").replace(/[^\d+]/g, "").replace(/^\+/, "");
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
  const telHref = `tel:${contact.phone || "+966500000000"}`;

  return (
    <div
      className="fixed bottom-5 z-40 flex flex-col items-end gap-2.5"
      style={{ insetInlineEnd: "1.1rem" }}
      aria-label={isAr ? "تواصل سريع" : "Quick contact"}
    >
      <a
        href={telHref}
        aria-label={isAr ? "اتصل بنا" : "Call us"}
        data-cta="floating_call"
        data-cta-placement="floating_dock"
        className="btn-cta btn-cta--ghost h-12 w-12 !p-0 shadow-soft"
      >
        <Phone className="h-5 w-5" aria-hidden />
      </a>
      <a
        href={waHref}
        target="_blank"
        rel="noreferrer"
        aria-label={isAr ? "محادثة واتساب" : "WhatsApp chat"}
        data-cta="floating_whatsapp"
        data-cta-placement="floating_dock"
        className="btn-cta h-14 w-14 !p-0 shadow-elegant"
        style={{ ["--cta-bg" as string]: "#25D366", ["--cta-fg" as string]: "#fff", ["--cta-ring" as string]: "rgba(37, 211, 102, 0.45)" }}
      >
        <MessageCircle className="h-6 w-6" aria-hidden />
      </a>
    </div>
  );
}
