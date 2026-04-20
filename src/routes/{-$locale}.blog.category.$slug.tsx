import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBand } from "@/components/site/CtaBand";
import { BlogCard, CategoryChip } from "@/components/site/BlogCard";
import { Reveal } from "@/components/site/Reveal";
import { useLocale } from "@/i18n/useLocale";
import { blogCategories, getCategoryBySlug, getPostsByCategory } from "@/content/blog";

export const Route = createFileRoute("/$locale/blog/category/$slug")({
  head: ({ params }) => {
    const cat = getCategoryBySlug(params.slug);
    const ar = params.locale === "ar";
    const loc = ar ? "ar" : "en";
    if (!cat) {
      return { meta: [{ title: ar ? "تصنيف غير موجود | فكرة" : "Category not found | Fikra" }] };
    }
    const title = ar ? `${cat.name.ar} | مدونة فكرة` : `${cat.name.en} | Fikra Blog`;
    return {
      meta: [
        { title },
        { name: "description", content: cat.description[loc] },
        { property: "og:title", content: title },
        { property: "og:description", content: cat.description[loc] },
      ],
    };
  },
  loader: ({ params }) => {
    const cat = getCategoryBySlug(params.slug);
    if (!cat) throw notFound();
    return { categorySlug: params.slug };
  },
  notFoundComponent: () => {
    const { locale, buildHref } = useLocale();
    return (
      <SiteLayout>
        <section className="section">
          <div className="container-app text-center">
            <h1 className="text-3xl font-bold">{locale === "ar" ? "التصنيف غير موجود" : "Category not found"}</h1>
            <Link to={buildHref(locale, "/blog")} className="mt-4 inline-block text-primary underline">
              {locale === "ar" ? "العودة للمدونة" : "Back to Blog"}
            </Link>
          </div>
        </section>
      </SiteLayout>
    );
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug: categorySlug } = Route.useParams();
  const { locale } = useLocale();
  const loc = locale === "en" ? "en" : "ar";
  const cat = getCategoryBySlug(categorySlug)!;
  const posts = getPostsByCategory(categorySlug);

  return (
    <SiteLayout>
      <Breadcrumbs
        trail={[
          { label: locale === "ar" ? "المدونة" : "Blog", href: "/blog" },
          { label: cat.name[loc] },
        ]}
      />
      <section className="section-tight bg-gradient-to-b from-primary/5 to-background">
        <div className="container-app text-center">
          <Reveal>
            <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-primary">
              {locale === "ar" ? "تصنيف" : "Category"}
            </span>
            <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold md:text-5xl">{cat.name[loc]}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{cat.description[loc]}</p>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-surface/40">
        <div className="container-app flex flex-wrap items-center justify-center gap-2 py-5">
          {blogCategories.map((c) => (
            <CategoryChip key={c.slug} cat={c} active={c.slug === categorySlug} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container-app">
          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {locale === "ar" ? "لا توجد مقالات بعد في هذا التصنيف." : "No articles in this category yet."}
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => (
                <BlogCard key={p.slug} post={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
      <CtaBand />
    </SiteLayout>
  );
}
