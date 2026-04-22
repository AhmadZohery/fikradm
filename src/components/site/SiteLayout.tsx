import { type ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteHeaderBoundary } from "./SiteHeaderBoundary";
import { SiteFooter } from "./SiteFooter";
import { WhatsAppButton } from "./WhatsAppButton";
import { CookieBanner } from "./CookieBanner";
import { ScrollProgress } from "./cinematic/ScrollProgress";
import { ScrollToTop } from "./cinematic/ScrollToTop";
import { PageViewTracker } from "./PageViewTracker";
import { AnnouncementBar } from "./AnnouncementBar";

export function SiteLayout({ children }: { children: ReactNode }) {
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
