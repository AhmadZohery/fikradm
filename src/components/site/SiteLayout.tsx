import { type ReactNode, useEffect } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteHeaderBoundary } from "./SiteHeaderBoundary";
import { SiteFooter } from "./SiteFooter";
import { WhatsAppButton } from "./WhatsAppButton";
import { CookieBanner } from "./CookieBanner";
import { ScrollProgress } from "./cinematic/ScrollProgress";
import { ScrollToTop } from "./cinematic/ScrollToTop";
import { PageViewTracker } from "./PageViewTracker";
import { AnnouncementBar } from "./AnnouncementBar";
import { useSiteSetting } from "@/hooks/useSiteSettings";
import { performPreviewHardReload, PREVIEW_RELOAD_EVENT_KEY } from "@/lib/previewRuntime";

export function SiteLayout({ children }: { children: ReactNode }) {
  const brand = useSiteSetting("brand", {} as Record<string, string>);
  useEffect(() => {
    const color = (brand as Record<string, string>).primary_color;
    if (!color) return;
    document.documentElement.style.setProperty("--brand-primary-override", color);
    // Apply to common token if user provided a valid color
    const root = document.documentElement.style;
    root.setProperty("--primary-runtime", color);
  }, [brand]);

  useEffect(() => {
    const applyQaClass = () => {
      const qaVisual = new URLSearchParams(window.location.search).get("qa") === "visual";
      document.body.classList.toggle("qa-visualize", qaVisual);
    };

    applyQaClass();

    const onStorage = (event: StorageEvent) => {
      if (event.key !== PREVIEW_RELOAD_EVENT_KEY) return;
      void performPreviewHardReload();
    };

    window.addEventListener("popstate", applyQaClass);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("popstate", applyQaClass);
      window.removeEventListener("storage", onStorage);
      document.body.classList.remove("qa-visualize");
    };
  }, []);

  // One-time client redirect honoring the visitor's saved language preference.
  // SSR still serves the URL as-is (so hreflang/canonical stay correct); we
  // only redirect on the client when the user previously chose the *other*
  // locale and has not been redirected this session yet.
  useEffect(() => {
    try {
      if (sessionStorage.getItem("fikra:locale:redirected") === "1") return;
      const saved = localStorage.getItem("fikra:locale");
      if (saved !== "ar" && saved !== "en") return;
      const path = window.location.pathname;
      const segs = path.split("/").filter(Boolean);
      const current = segs[0] === "en" ? "en" : "ar";
      if (current === saved) return;
      const rest = current === "en" ? segs.slice(1) : segs;
      const restPath = rest.length ? `/${rest.join("/")}` : "";
      const target = saved === "ar" ? restPath || "/" : `/en${restPath}`;
      sessionStorage.setItem("fikra:locale:redirected", "1");
      window.location.replace(`${target}${window.location.search}${window.location.hash}`);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PageViewTracker />
      <ScrollProgress />
      <AnnouncementBar />
      <SiteHeaderBoundary>
        <SiteHeader />
      </SiteHeaderBoundary>
      <main className="flex-1 pt-[calc(var(--header-h,4.5rem)+var(--ann-h,0px))]">{children}</main>
      <SiteFooter />
      <WhatsAppButton />
      <ScrollToTop />
      <CookieBanner />
    </div>
  );
}
