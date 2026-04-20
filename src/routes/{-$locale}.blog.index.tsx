import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBand } from "@/components/site/CtaBand";
import { BlogCard, CategoryChip } from "@/components/site/BlogCard";
import { Reveal } from "@/components/site/Reveal";
import { useLocale } from "@/i18n/useLocale";
import { blogCategories, getAllPostsSorted } from "@/content/blog";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

export const Route = createFileRoute("/$locale/blog/")({
  head: ({ params }) => {
    const ar = params.locale === "ar";
    const title = ar ? "مدونة فكرة | أدلة التسويق الرقمي والسيو" : "Fikra Blog | Digital Marketing & SEO Guides";
    const desc = ar
      ? "أدلة عملية وعميقة في السيو، إعلانات Meta وGoogle، نمو المتاجر الإلكترونية، والمحتوى الإبداعي."
      : "Deep, practical guides on SEO, Meta & Google ads, e-commerce growth, and creative content.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
      ],
    };
  },
  component: BlogIndex,
});

function BlogIndex() {
  const { locale, buildHref } = useLocale();
  const loc = locale === "en" ? "en" : "ar";
  const posts = getAllPostsSorted();
  const featured = posts[0];
  const rest = posts.slice(1);

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: locale === "ar" ? "مدونة فكرة" : "Fikra Blog",
    inLanguage: locale,
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title[loc],
      datePublished: p.publishedAt,
      author: { "@type": "Organization", name: p.author[loc] },
      image: p.image,
    })),
  };

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <Breadcrumbs trail={[{ label: locale === "ar" ? "المدونة" : "Blog" }]} />

      {/* Hero */}
      <section className="section-tight bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container-app text-center">
          <Reveal>
            <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-primary">
              {locale === "ar" ? "مدونة فكرة" : "Fikra Blog"}
            </span>
            <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold leading-tight md:text-5xl">
              {locale === "ar" ? "أدلة عميقة لكل تحدٍ تسويقي تواجهه" : "Deep guides for every marketing challenge you face"}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
              {locale === "ar"
                ? "مقالات تكتبها فرقنا من تجاربها الحقيقية مع أكثر من 200 علامة تجارية في الخليج."
                : "Articles written by our teams from real experience with 200+ Gulf brands."}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Categories */}
      <section className="border-y border-border bg-surface/40">
        <div className="container-app flex flex-wrap items-center justify-center gap-2 py-5">
          <span className="me-2 text-sm font-semibold text-muted-foreground">
            {locale === "ar" ? "التصنيفات:" : "Categories:"}
          </span>
          {blogCategories.map((c) => (
            <CategoryChip key={c.slug} cat={c} />
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="section">
          <div className="container-app">
            <Reveal>
              <Link
                to={buildHref(locale, `/blog/${featured.slug}`)}
                className="group grid overflow-hidden rounded-3xl border border-border bg-card shadow-elegant md:grid-cols-2"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted md:aspect-auto">
                  <img
                    src={featured.image}
                    alt={featured.title[loc]}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute start-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                    {locale === "ar" ? "مقال مميّز" : "Featured"}
                  </span>
                </div>
                <div className="flex flex-col justify-center p-7 md:p-10">
                  <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(featured.publishedAt).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {featured.readingMinutes} {locale === "ar" ? "د" : "min"}
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold leading-tight transition-colors group-hover:text-primary md:text-3xl">
                    {featured.title[loc]}
                  </h2>
                  <p className="mt-3 text-muted-foreground">{featured.excerpt[loc]}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    {locale === "ar" ? "اقرأ المقال كاملاً" : "Read full article"}
                    <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* Grid */}
      <section className="section-tight">
        <div className="container-app">
          <Reveal>
            <h2 className="mb-8 text-2xl font-extrabold md:text-3xl">
              {locale === "ar" ? "أحدث المقالات" : "Latest articles"}
            </h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <BlogCard key={p.slug} post={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </SiteLayout>
  );
}
