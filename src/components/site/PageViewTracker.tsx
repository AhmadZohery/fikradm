import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { trackPageView } from "@/lib/analytics";

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

  return null;
}
