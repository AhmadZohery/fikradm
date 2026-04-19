import { Link } from "@tanstack/react-router";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import type { BlogPost, BlogCategory } from "@/content/blog";
import { getCategoryBySlug } from "@/content/blog";
import { Reveal } from "./Reveal";

export function BlogCard({ post, index = 0 }: { post: BlogPost; index?: number }) {
  const { locale, buildHref } = useLocale();
  const loc = locale === "en" ? "en" : "ar";
  const cat = getCategoryBySlug(post.categorySlug);
  const dateLocale = locale === "ar" ? "ar-SA" : "en-US";
  const dateText = new Date(post.publishedAt).toLocaleDateString(dateLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Reveal delay={index * 80}>
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant">
        <Link
          to={buildHref(locale, `/blog/${post.slug}`)}
          className="relative block aspect-[16/9] overflow-hidden bg-muted"
        >
          <img
            src={post.image}
            alt={post.title[loc]}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {cat && (
            <span className="absolute start-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-[11px] font-semibold text-primary-foreground backdrop-blur">
              {cat.name[loc]}
            </span>
          )}
        </Link>
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {dateText}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readingMinutes} {locale === "ar" ? "د قراءة" : "min read"}
            </span>
          </div>
          <h3 className="mb-2 line-clamp-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
            <Link to={buildHref(locale, `/blog/${post.slug}`)}>{post.title[loc]}</Link>
          </h3>
          <p className="mb-4 line-clamp-3 flex-1 text-sm text-muted-foreground">{post.excerpt[loc]}</p>
          <Link
            to={buildHref(locale, `/blog/${post.slug}`)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5"
          >
            {locale === "ar" ? "اقرأ المقال" : "Read article"}
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

export function CategoryChip({ cat, active = false }: { cat: BlogCategory | { slug: string; name: { ar: string; en: string } }; active?: boolean }) {
  const { locale, buildHref } = useLocale();
  const loc = locale === "en" ? "en" : "ar";
  return (
    <Link
      to={buildHref(locale, `/blog/category/${cat.slug}`)}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-surface text-foreground/80 hover:border-primary hover:text-primary"
      }`}
    >
      {cat.name[loc]}
    </Link>
  );
}
