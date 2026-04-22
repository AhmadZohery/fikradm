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
import { performPreviewHardReload, PREVIEW_RELOAD_EVENT_KEY } from "@/lib/previewRuntime";

export function SiteLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== PREVIEW_RELOAD_EVENT_KEY) return;
      void performPreviewHardReload();
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
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
