import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search as SearchIcon, Briefcase, Factory, Newspaper, Globe, ArrowUpRight } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import { buildIndex, searchIndex, type SearchHit } from "@/lib/searchIndex";
import { Input } from "@/components/ui/input";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { buildSeoLinks } from "@/lib/seo";

type SearchParams = { q?: string; type?: string };

export const Route = createFileRoute("/{-$locale}/search")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    q: typeof s.q === "string" ? s.q : "",
    type: typeof s.type === "string" ? s.type : "all",
  }),
  head: () => ({
    meta: [
      { title: "البحث في فكرة | Search" },
      { name: "description", content: "ابحث في خدمات، صناعات، ومقالات وكالة فكرة." },
      { name: "robots", content: "noindex,follow" },
    ],
    links: buildSeoLinks({ path: "/search", locale: "ar" }),
  }),
  component: SearchPage,
});

const TYPES: Array<{ id: string; ar: string; en: string; icon: typeof SearchIcon }> = [
  { id: "all", ar: "الكل", en: "All", icon: SearchIcon },
  { id: "service", ar: "خدمات", en: "Services", icon: Briefcase },
  { id: "industry", ar: "صناعات", en: "Industries", icon: Factory },
  { id: "blog", ar: "مقالات", en: "Articles", icon: Newspaper },
  { id: "page", ar: "صفحات", en: "Pages", icon: Globe },
];

function SearchPage() {
  const { q: initialQ, type: initialType } = Route.useSearch();
  const { locale, buildHref } = useLocale();
  const navigate = Route.useNavigate();
  const isAr = locale === "ar";
  const [q, setQ] = useState(initialQ ?? "");
  const [type, setType] = useState(initialType ?? "all");

  // Sync URL on input change (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      navigate({ search: { q, type }, replace: true });
    }, 250);
    return () => clearTimeout(t);
  }, [q, type, navigate]);

  const index = useMemo(() => buildIndex(locale), [locale]);
  const results = useMemo(() => {
    const base = q.trim() ? searchIndex(index, q, 100) : index;
    if (type === "all") return base;
    return base.filter((h) => h.type === type || (type === "service" && h.type === "sub-service") || (type === "industry" && h.type === "sub-industry"));
  }, [index, q, type]);

  return (
    <SiteLayout>
      <section className="bg-gradient-soft py-12 md:py-16">
        <div className="container-app">
          <Reveal>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3">
              {isAr ? "ابحث في فكرة" : "Search Fikra"}
            </h1>
            <p className="text-muted-foreground mb-6">
              {isAr ? "خدمات، صناعات، ومقالات في مكان واحد." : "Services, industries, and articles in one place."}
            </p>
            <div className="relative max-w-2xl">
              <SearchIcon className="absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={isAr ? "ابحث..." : "Search..."}
                className="ps-12 h-14 text-base rounded-2xl shadow-soft"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {TYPES.map((t) => {
                const Icon = t.icon;
                const active = type === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                      active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface hover:border-primary"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {isAr ? t.ar : t.en}
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-app">
          <p className="mb-4 text-sm text-muted-foreground">
            {isAr ? `${results.length} نتيجة` : `${results.length} results`}
          </p>
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              {isAr ? "لا توجد نتائج مطابقة." : "No matching results."}
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {results.map((hit, i) => (
                <ResultCard key={hit.href + i} hit={hit} buildHref={buildHref} locale={locale} isAr={isAr} />
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function ResultCard({ hit, buildHref, locale, isAr }: { hit: SearchHit; buildHref: (l: typeof locale, p?: string) => string; locale: typeof Route.useSearch extends never ? never : "ar" | "en"; isAr: boolean }) {
  return (
    <Link
      to={buildHref(locale, hit.href)}
      className="group flex gap-4 rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elegant"
    >
      {hit.image && (
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
          <img src={hit.image} alt="" className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
          {hit.type}
        </div>
        <h3 className="line-clamp-1 text-base font-bold text-foreground transition group-hover:text-primary">{hit.title}</h3>
        {hit.subtitle && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{hit.subtitle}</p>}
        <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">
          {isAr ? "افتح" : "Open"} <ArrowUpRight className="h-3 w-3 rtl:rotate-90" />
        </div>
      </div>
    </Link>
  );
}