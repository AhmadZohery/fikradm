import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BlockRenderer } from "@/cms/blocks/BlockRenderer";
import { DEFAULT_HOME_BLOCKS } from "@/cms/blocks/registry";
import { fetchPage, type CmsPage } from "@/cms/loadPage";
import heroSaudiMarketer from "@/assets/hero-saudi-marketer.jpg";
import {
  buildSeoMeta,
  buildSeoLinks,
  jsonLdScript,
  organizationLd,
  localBusinessLd,
  breadcrumbLd,
  serviceLd,
  SITE_ORIGIN,
} from "@/lib/seo";

export const Route = createFileRoute("/{-$locale}/")({
  loader: async ({ params }) => {
    // Fetch from DB; fall back to static defaults on miss.
    const page = await fetchPage("home", (params.locale ?? "ar"));
    return { page };
  },
  head: ({ params, loaderData }) => {
    const isAr = (params.locale ?? "ar") === "ar";
    const locale = (params.locale ?? "ar") as "ar" | "en";
    const page: CmsPage | null | undefined = loaderData?.page;
    const title =
      page?.meta_title ??
      (isAr
        ? "فكرة • وكالة تسويق رقمي مرخّصة في السعودية ٢٠٢٥"
        : "Fikra • Licensed Digital Marketing Agency in KSA 2025");
    const description =
      page?.meta_description ??
      (isAr
        ? "نمو حقيقي بأرقام واضحة: سيو، إعلانات Google/Meta/TikTok، تصميم وتطوير مواقع. ضمان نتائج خلال ٩٠ يوم. احجز استشارتك المجانية الآن."
        : "Real growth, clear numbers: SEO, Google/Meta/TikTok ads, web design & dev. 90-day results guarantee. Book your free strategy call today.");

    const meta = buildSeoMeta({
      title,
      description,
      path: `/${locale}`,
      locale,
      image: page?.og_image_url || heroSaudiMarketer,
      noIndex: page?.no_index ?? false,
    });

    const breadcrumbs = breadcrumbLd([
      { name: isAr ? "الرئيسية" : "Home", url: `/${locale}` },
    ]);

    const serviceSchema = serviceLd({
      name: isAr ? "خدمات التسويق الرقمي المتكاملة" : "Integrated Digital Marketing Services",
      description,
      url: `/${locale}`,
      image: heroSaudiMarketer,
      serviceType: "Digital Marketing Agency",
    });

    return {
      meta,
      links: [
        ...buildSeoLinks({ path: `/${locale}`, locale, canonical: page?.canonical_url ?? undefined }),
        // Preload LCP hero image for faster first paint
        {
          rel: "preload",
          as: "image",
          href: heroSaudiMarketer,
          fetchpriority: "high",
        } as any,
      ],
      scripts: [
        jsonLdScript({
          "@context": "https://schema.org",
          "@graph": [organizationLd(), localBusinessLd(), serviceSchema],
        }),
        jsonLdScript(breadcrumbs),
      ],
    };
  },
  component: HomePage,
});

function HomePage() {
  const { page } = Route.useLoaderData();
  // Use DB blocks when present, otherwise the built-in default order.
  const blocks =
    page && Array.isArray(page.blocks) && page.blocks.length > 0
      ? page.blocks
      : DEFAULT_HOME_BLOCKS;

  return (
    <SiteLayout>
      <BlockRenderer blocks={blocks} />
    </SiteLayout>
  );
}
