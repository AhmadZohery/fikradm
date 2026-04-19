import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { HeroSlider } from "@/components/site/HeroSlider";
import { StatsBand } from "@/components/site/StatsBand";
import { LogosStrip } from "@/components/site/LogosStrip";
import { ServicesGrid } from "@/components/site/ServicesGrid";
import { IndustriesShowcase } from "@/components/site/IndustriesShowcase";
import { Testimonials } from "@/components/site/Testimonials";
import { CtaBand } from "@/components/site/CtaBand";

export const Route = createFileRoute("/$locale/")({
  head: ({ params }) => {
    const isAr = params.locale === "ar";
    return {
      meta: [
        { title: isAr ? "فكرة | وكالة تسويق رقمي مرخّصة في السعودية" : "Fikra | Licensed Digital Marketing Agency in KSA" },
        {
          name: "description",
          content: isAr
            ? "وكالة تسويق رقمي مرخّصة في السعودية. سيو، إعلانات، تصميم، وتطوير مواقع لشركات الخليج. احجز استشارتك المجانية اليوم."
            : "Licensed digital marketing agency in KSA. SEO, ads, creative and web for Gulf brands. Book your free consultation today.",
        },
        { property: "og:title", content: isAr ? "فكرة | وكالة تسويق رقمي مرخّصة في السعودية" : "Fikra | Licensed Digital Marketing Agency in KSA" },
        { property: "og:description", content: isAr ? "حلول تسويق رقمي متكاملة للشركات في الخليج." : "Integrated digital marketing solutions for Gulf brands." },
        { property: "og:locale", content: isAr ? "ar_SA" : "en_US" },
      ],
      links: [
        { rel: "alternate", hrefLang: "ar", href: "https://fikra-dm.com/ar" },
        { rel: "alternate", hrefLang: "en", href: "https://fikra-dm.com/en" },
        { rel: "canonical", href: `https://fikra-dm.com/${params.locale}` },
      ],
    };
  },
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      <HeroSlider />
      <StatsBand />
      <LogosStrip />
      <ServicesGrid />
      <IndustriesShowcase />
      <Testimonials />
      <CtaBand />
    </SiteLayout>
  );
}
