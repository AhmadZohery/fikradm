import { Link } from "@tanstack/react-router";
import { useLocale } from "@/i18n/useLocale";
import { SectionEyebrow } from "./cinematic/SectionEyebrow";
import { getAllPostsSorted } from "@/content/blog";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";

export function HomeBlogTeaser() {
  const { locale, buildHref } = useLocale();
  const isAr = locale === "ar";
  const posts = getAllPostsSorted().slice(0, 3);

  if (!posts.length) return null;

  return (
    <section className="section relative overflow-hidden">
      <div className="container-app">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <SectionEyebrow>{isAr ? "من المدونة" : "From the blog"}</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">
              {isAr ? (
                <>
                  دليلك العميق في
                  <span className="marker-line px-2"> التسويق الرقمي</span>
                </>
              ) : (
                <>
                  Your deep guide to{" "}
                  <span className="marker-line px-2">digital marketing</span>
                </>
              )}
            </h2>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              {isAr
                ? "مقالات يكتبها فريقنا من تجاربه الحقيقية مع أكثر من 200 علامة تجارية."
                : "Articles written by our teams from real experience with 200+ brands."}
            </p>
          </div>
          <Link
            to={buildHref(locale, "/blog")}
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-primary shadow-card transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
          >
            {isAr ? "كل المقالات" : "View all articles"}
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-0.5 rtl:rotate-90" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.map((p, i) => (
            <Link
              key={p.slug}
              to={buildHref(locale, `/blog/${p.slug}`)}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-elegant"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={p.image}
                  alt={p.title[locale]}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-60" />
                <span className="absolute start-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur">
                  0{i + 1}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(p.publishedAt).toLocaleDateString(isAr ? "ar-SA" : "en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {p.readingMinutes} {isAr ? "د" : "min"}
                  </span>
                </div>
                <h3 className="mt-3 line-clamp-2 text-lg font-extrabold leading-snug text-ink transition group-hover:text-primary">
                  {p.title[locale]}
                </h3>
                <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {p.excerpt[locale]}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  {isAr ? "اقرأ المقال" : "Read article"}
                  <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-1 group-hover:-translate-y-0.5 rtl:rotate-90" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
