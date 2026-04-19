import { MessageCircle } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";

export function WhatsAppButton() {
  const { locale } = useLocale();
  const text = locale === "ar"
    ? "مرحباً، أرغب في استشارة مع فكرة للتسويق الرقمي"
    : "Hi, I'd like a consultation with Fikra Digital Marketing";
  const href = `https://wa.me/966500000000?text=${encodeURIComponent(text)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-elegant transition hover:scale-105 active:scale-95"
      style={{ insetInlineEnd: "1.25rem" }}
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
