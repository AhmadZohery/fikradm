import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { trackPageView, trackCtaClick } from "@/lib/analytics";

export function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const seg = path.split("/").filter(Boolean);
    const locale = seg[0] === "ar" || seg[0] === "en" ? seg[0] : "ar";
    const slug = seg.slice(1).join("/") || "home";
    // Fire-and-forget
    void trackPageView({ path, locale, pageSlug: slug });
  }, [location.pathname]);

  // Single delegated click listener for [data-cta] elements (zero per-button JS)
  useEffect(() => {
    if (typeof document === "undefined") return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const el = target.closest<HTMLElement>("[data-cta]");
      if (!el) return;
      const label = el.getAttribute("data-cta") || "unknown";
      const placement = el.getAttribute("data-cta-placement") || undefined;
      trackCtaClick(label, placement ? { placement } : undefined);
    };
    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", onClick, { capture: true } as EventListenerOptions);
  }, []);

  return null;
}
