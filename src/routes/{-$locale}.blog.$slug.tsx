import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBand } from "@/components/site/CtaBand";
import { BlogCard } from "@/components/site/BlogCard";
import { Reveal } from "@/components/site/Reveal";
import { AutoInternalLinks } from "@/components/site/AutoInternalLinks";
import { findService } from "@/content/cities";
import { useLocale } from "@/i18n/useLocale";
import { getPostBySlug, getCategoryBySlug, getRelatedPosts } from "@/content/blog";
import { Calendar, Clock, User, Share2, Twitter, Facebook, Linkedin, MessageCircle, Send, Link2, ArrowLeft, ArrowRight, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  buildSeoMeta,
  buildSeoLinks,
  jsonLdScript,
  breadcrumbLd as breadcrumbLdGen,
  articleLd,
  faqLd,
  absUrl,
} from "@/lib/seo";

export const Route = createFileRoute("/{-$locale}/blog/$slug")({
  head: ({ params }) => {
    const post = getPostBySlug(params.slug);
    const ar = (params.locale ?? "ar") === "ar";
    if (!post) {
      return { meta: [{ title: ar ? "مقال غير موجود | فكرة" : "Article not found | Fikra" }] };
    }
    const loc: "ar" | "en" = ar ? "ar" : "en";
    const path = `/${loc}/blog/${params.slug}`;
    const cat = getCategoryBySlug(post.categorySlug);
    const meta = buildSeoMeta({
      title: post.metaTitle[loc],
      description: post.metaDescription[loc],
      path,
      locale: loc,
      image: post.image,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
    });
    meta.push({ name: "keywords", content: post.keywords[loc].join(", ") });
    meta.push({ property: "article:author", content: post.author[loc] });
    if (cat) meta.push({ property: "article:section", content: cat.name[loc] });

    const breadcrumbItems = [
      { name: ar ? "الرئيسية" : "Home", url: `/${loc}` },
      { name: ar ? "المدونة" : "Blog", url: `/${loc}/blog` },
      ...(cat ? [{ name: cat.name[loc], url: `/${loc}/blog/category/${cat.slug}` }] : []),
      { name: post.title[loc], url: path },
    ];

    return {
      meta,
      links: buildSeoLinks({ path, locale: loc }),
      scripts: [
        jsonLdScript({
          ...articleLd({
            headline: post.title[loc],
            description: post.metaDescription[loc],
            url: path,
            image: post.image,
            datePublished: post.publishedAt,
            dateModified: post.publishedAt,
            authorName: post.author[loc],
          }),
          inLanguage: loc,
          articleSection: cat?.name[loc],
          keywords: post.keywords[loc].join(", "),
        }),
        jsonLdScript(breadcrumbLdGen(breadcrumbItems)),
        ...(post.faq && post.faq.length > 0
          ? [jsonLdScript(faqLd(post.faq.map((f) => ({ question: f.q[loc], answer: f.a[loc] }))))]
          : []),
        jsonLdScript({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": absUrl(path),
          speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: ["h1", ".prose-fikra h2", ".prose-fikra p"],
          },
        }),
      ],
    };
  },
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return { slug: params.slug };
  },
  notFoundComponent: () => {
    const { locale, buildHref } = useLocale();
    return (
      <SiteLayout>
        <section className="section">
          <div className="container-app text-center">
            <h1 className="text-3xl font-bold">{locale === "ar" ? "المقال غير موجود" : "Article not found"}</h1>
            <Link to={buildHref(locale, "/blog")} className="mt-4 inline-block text-primary underline">
              {locale === "ar" ? "العودة للمدونة" : "Back to Blog"}
            </Link>
          </div>
        </section>
      </SiteLayout>
    );
  },
  component: PostPage,
});

function PostPage() {
  const { slug } = Route.useParams();
  const { locale, buildHref } = useLocale();
  const loc = locale === "en" ? "en" : "ar";
  const post = getPostBySlug(slug)!;
  const cat = getCategoryBySlug(post.categorySlug);
  const related = getRelatedPosts(slug, 3);
  const [readingProgress, setReadingProgress] = useState(0);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setShareUrl(window.location.href);
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setReadingProgress(total > 0 ? Math.min(100, (h.scrollTop / total) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dateText = new Date(post.publishedAt).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const encShare = encodeURIComponent(shareUrl);
  const encTitle = encodeURIComponent(post.title[loc]);
  const shareLinks = [
    { id: "twitter", label: "X / Twitter", icon: Twitter, href: `https://twitter.com/intent/tweet?url=${encShare}&text=${encTitle}`, color: "hover:text-[#1DA1F2]" },
    { id: "facebook", label: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encShare}`, color: "hover:text-[#1877F2]" },
    { id: "linkedin", label: "LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encShare}`, color: "hover:text-[#0A66C2]" },
    { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${encTitle}%20${encShare}`, color: "hover:text-[#25D366]" },
    { id: "telegram", label: "Telegram", icon: Send, href: `https://t.me/share/url?url=${encShare}&text=${encTitle}`, color: "hover:text-[#26A5E4]" },
  ];

  const copyLink = () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success(locale === "ar" ? "تم نسخ الرابط ✓" : "Link copied ✓");
    });
  };

  return (
    <SiteLayout>
      {/* Reading progress bar */}
      <div className="fixed left-0 right-0 top-0 z-40 h-1 bg-transparent">
        <div
          className="h-full bg-gradient-primary transition-[width] duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <Breadcrumbs
        trail={[
          { label: locale === "ar" ? "المدونة" : "Blog", href: "/blog" },
          ...(cat ? [{ label: cat.name[loc], href: `/blog/category/${cat.slug}` }] : []),
          { label: post.title[loc] },
        ]}
      />

      {/* Hero */}
      <section className="section-tight">
        <div className="container-app max-w-4xl">
          <Reveal>
            {cat && (
              <Link
                to={buildHref(locale, `/blog/category/${cat.slug}`)}
                className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-primary hover:bg-primary/20"
              >
                {cat.name[loc]}
              </Link>
            )}
            <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-5xl">{post.title[loc]}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{post.excerpt[loc]}</p>
            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4" /> {post.author[loc]}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> {dateText}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {post.readingMinutes} {locale === "ar" ? "دقيقة قراءة" : "min read"}
              </span>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-8 overflow-hidden rounded-3xl border border-border shadow-elegant">
              <img
                src={post.image}
                alt={post.title[loc]}
                loading="lazy"
                decoding="async"
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Body + TOC */}
      <section className="pb-16">
        <div className="container-app grid max-w-6xl gap-10 lg:grid-cols-[1fr_280px]">
          <article className="prose-fikra">
            {post.body.map((section, i) => (
              <Reveal key={i} delay={i * 60}>
                <section id={`section-${i}`} className="mb-10 scroll-mt-24">
                  <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">{section.heading[loc]}</h2>
                  {section.paragraphs[loc].map((p, j) => (
                    <p key={j} className="mb-4 text-base leading-relaxed text-foreground/80">
                      {p}
                    </p>
                  ))}
                </section>
              </Reveal>
            ))}

            {/* Tags */}
            <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-border pt-6">
              <span className="text-sm font-semibold text-muted-foreground">
                {locale === "ar" ? "الكلمات المفتاحية:" : "Keywords:"}
              </span>
              {post.keywords[loc].map((k) => (
                <span key={k} className="rounded-full bg-muted px-3 py-1 text-xs text-foreground/80">
                  #{k}
                </span>
              ))}
            </div>

            {/* Inline CTA */}
            {post.cta && (
              <Reveal>
                <div className="my-10 overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-7 md:p-10">
                  <h3 className="text-2xl font-extrabold text-foreground md:text-3xl">{post.cta.title[loc]}</h3>
                  <p className="mt-3 text-base text-foreground/80 md:text-lg">{post.cta.description[loc]}</p>
                  <Link
                    to={buildHref(locale, post.cta.href)}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-elegant transition-transform hover:scale-105 active:scale-95"
                  >
                    {post.cta.buttonLabel[loc]}
                    {locale === "ar" ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                  </Link>
                </div>
              </Reveal>
            )}

            {/* FAQ Section */}
            {post.faq && post.faq.length > 0 && (
              <Reveal>
                <section id="faq" className="mt-12 scroll-mt-24">
                  <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground md:text-3xl">
                    <HelpCircle className="h-6 w-6 text-primary" />
                    {locale === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
                  </h2>
                  <div className="space-y-3">
                    {post.faq.map((f, i) => (
                      <details
                        key={i}
                        className="group rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-soft open:shadow-elegant"
                      >
                        <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-base font-semibold text-foreground">
                          <span>{f.q[loc]}</span>
                          <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-open:rotate-45">
                            +
                          </span>
                        </summary>
                        <p className="mt-3 text-sm leading-relaxed text-foreground/75">{f.a[loc]}</p>
                      </details>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {/* Internal links */}
            {post.internalLinks && post.internalLinks.length > 0 && (
              <Reveal>
                <section className="mt-12">
                  <h2 className="mb-5 text-2xl font-bold text-foreground md:text-3xl">
                    {locale === "ar" ? "اقرأ أيضاً" : "Read also"}
                  </h2>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {post.internalLinks.map((l, i) => (
                      <li key={i}>
                        <Link
                          to={buildHref(locale, l.href)}
                          className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground transition-all hover:border-primary hover:bg-primary/5 hover:shadow-soft"
                        >
                          <span className="line-clamp-2">{l.label[loc]}</span>
                          <span className="shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100">
                            {locale === "ar" ? "←" : "→"}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            )}

            {/* Social Share Bar (bottom) */}
            <div className="mt-12 rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
                <Share2 className="h-4 w-4 text-primary" />
                {locale === "ar" ? "شارك المقال" : "Share this article"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {shareLinks.map((s) => (
                  <a
                    key={s.id}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground/70 transition-all hover:scale-110 hover:border-primary hover:shadow-soft ${s.color}`}
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
                <button
                  type="button"
                  onClick={copyLink}
                  aria-label={locale === "ar" ? "نسخ الرابط" : "Copy link"}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground/70 transition-all hover:scale-110 hover:border-primary hover:text-primary hover:shadow-soft"
                >
                  <Link2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">
                {locale === "ar" ? "محتويات المقال" : "Table of Contents"}
              </h3>
              <ol className="space-y-2 text-sm">
                {post.tableOfContents[loc].map((item, i) => (
                  <li key={i}>
                    <a
                      href={`#section-${i}`}
                      className="block rounded-lg px-2 py-1.5 text-foreground/80 transition hover:bg-accent hover:text-primary"
                    >
                      {i + 1}. {item}
                    </a>
                  </li>
                ))}
              </ol>
              <button
                type="button"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-accent"
                onClick={() => {
                  if (typeof window === "undefined") return;
                  const nav = window.navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
                  if (nav.share) {
                    nav.share({ title: post.title[loc], url: window.location.href }).catch(() => {});
                  } else {
                    nav.clipboard?.writeText(window.location.href);
                  }
                }}
              >
                <Share2 className="h-4 w-4" />
                {locale === "ar" ? "مشاركة المقال" : "Share article"}
              </button>

              {/* Quick share icons in sidebar */}
              <div className="mt-4 flex flex-wrap justify-center gap-1.5 border-t border-border pt-4">
                {shareLinks.slice(0, 4).map((s) => (
                  <a
                    key={s.id}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground/60 transition-transform hover:scale-110 ${s.color}`}
                  >
                    <s.icon className="h-3.5 w-3.5" />
                  </a>
                ))}
                <button
                  type="button"
                  onClick={copyLink}
                  aria-label={locale === "ar" ? "نسخ الرابط" : "Copy link"}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground/60 transition-transform hover:scale-110 hover:text-primary"
                >
                  <Link2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-border bg-surface/40 py-16">
          <div className="container-app">
            <Reveal>
              <h2 className="mb-8 text-2xl font-extrabold md:text-3xl">
                {locale === "ar" ? "مقالات ذات صلة" : "Related articles"}
              </h2>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <BlogCard key={p.slug} post={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </SiteLayout>
  );
}
