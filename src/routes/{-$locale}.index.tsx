import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BlockRenderer } from "@/cms/blocks/BlockRenderer";
import { DEFAULT_HOME_BLOCKS } from "@/cms/blocks/registry";
import { fetchPage, type CmsPage } from "@/cms/loadPage";

export const Route = createFileRoute("/$locale/")({
  loader: async ({ params }) => {
    // Fetch from DB; fall back to static defaults on miss.
    const page = await fetchPage("home", params.locale);
    return { page };
  },
  head: ({ params, loaderData }) => {
    const isAr = params.locale === "ar";
    const page: CmsPage | null | undefined = loaderData?.page;
    const title =
      page?.meta_title ??
      (isAr
        ? "فكرة | وكالة تسويق رقمي مرخّصة في السعودية"
        : "Fikra | Licensed Digital Marketing Agency in KSA");
    const description =
      page?.meta_description ??
      (isAr
        ? "وكالة تسويق رقمي مرخّصة في السعودية. سيو، إعلانات، تصميم، وتطوير مواقع لشركات الخليج. باقات تسويق متكاملة. احجز استشارتك المجانية اليوم."
        : "Licensed digital marketing agency in KSA. SEO, ads, creative and web for Gulf brands. Integrated marketing bundles. Book your free consultation today.");

    const meta = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:locale", content: isAr ? "ar_SA" : "en_US" },
    ];
    if (page?.no_index) meta.push({ name: "robots", content: "noindex,nofollow" });
    if (page?.og_image_url)
      meta.push({ property: "og:image", content: page.og_image_url });

    return {
      meta,
      links: [
        { rel: "alternate", hrefLang: "ar", href: "https://fikra-dm.com/ar" },
        { rel: "alternate", hrefLang: "en", href: "https://fikra-dm.com/en" },
        {
          rel: "canonical",
          href: page?.canonical_url ?? `https://fikra-dm.com/${params.locale}`,
        },
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
