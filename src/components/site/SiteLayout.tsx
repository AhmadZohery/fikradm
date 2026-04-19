import { type ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { WhatsAppButton } from "./WhatsAppButton";
import { CookieBanner } from "./CookieBanner";
import { ScrollProgress } from "./cinematic/ScrollProgress";
import { ScrollToTop } from "./cinematic/ScrollToTop";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <ScrollProgress />
      <SiteHeader />
      <main className="flex-1 pt-[var(--header-h,4.5rem)]">{children}</main>
      <SiteFooter />
      <WhatsAppButton />
      <ScrollToTop />
      <CookieBanner />
    </div>
  );
}
