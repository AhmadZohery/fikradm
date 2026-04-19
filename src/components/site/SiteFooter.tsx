import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter, ArrowUpRight, Send, Award, Shield, Sparkles } from "lucide-react";
import { useState } from "react";
import { useLocale } from "@/i18n/useLocale";
import logo from "@/assets/fikra-logo.jpg";

export function SiteFooter() {
  const { locale, t, buildHref } = useLocale();
  const isAr = locale === "ar";
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const services = [
    { label: t("menu.services.seo"), href: "/services/seo" },
    { label: t("menu.services.performance"), href: "/services/performance" },
    { label: t("menu.services.creative"), href: "/services/creative" },
    { label: t("menu.services.web"), href: "/services/web" },
  ];

  const company = [
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.industries"), href: "/industries" },
    { label: t("nav.cases"), href: "/case-studies" },
    { label: t("nav.blog"), href: "/blog" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  const locations = [
    { label: isAr ? "الرياض" : "Riyadh", href: "/locations/seo-agency-riyadh" },
    { label: isAr ? "دبي" : "Dubai", href: "/locations/digital-marketing-dubai" },
    { label: isAr ? "القاهرة" : "Cairo", href: "/locations/web-design-cairo" },
  ];

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setEmail("");
  };

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -end-32 -top-32 h-96 w-96 rounded-full opacity-20 blur-3xl" style={{ background: "var(--gradient-brand)" }} aria-hidden />
      <div className="pointer-events-none absolute -start-32 bottom-0 h-80 w-80 rounded-full opacity-15 blur-3xl" style={{ background: "var(--gold)" }} aria-hidden />

      {/* CTA banner — top of footer */}
      <div className="container-app relative pt-16">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-12">
          <div className="pointer-events-none absolute inset-0 bg-gradient-primary opacity-20" aria-hidden />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white/90">
                <Sparkles className="h-3 w-3" />
                {isAr ? "استشارة مجانية" : "Free consultation"}
              </div>
              <h3 className="mt-4 text-3xl font-black leading-tight md:text-4xl">
                {isAr ? "جاهز لتنمية أعمالك؟ تحدث مع خبير اليوم." : "Ready to grow your business? Talk to an expert today."}
              </h3>
              <p className="mt-3 max-w-lg text-sm text-white/70">
                {isAr ? "30 دقيقة مجانية مع استراتيجي تسويق — بلا التزام." : "30 free minutes with a marketing strategist — no commitment."}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                to={buildHref(locale, "/contact")}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-ink transition hover:scale-[1.02] hover:bg-white/90"
              >
                {t("cta.primary")}
                <ArrowUpRight className="h-4 w-4 rtl:rotate-90" />
              </Link>
              <a
                href="tel:+966500000000"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
                dir="ltr"
              >
                <Phone className="h-4 w-4" />
                +966 50 000 0000
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="container-app relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
        {/* Brand + newsletter */}
        <div className="lg:col-span-4">
          <Link to={buildHref(locale, "/")} className="inline-flex items-center gap-3 group">
            <img src={logo} alt={t("brand.full")} className="h-11 w-11 rounded-xl object-cover ring-2 ring-white/10 transition group-hover:ring-white/30" />
            <div className="leading-tight">
              <div className="text-base font-extrabold">{t("brand.name")}</div>
              <div className="text-[11px] text-white/60">{t("brand.tagline")}</div>
            </div>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/70">{t("footer.about")}</p>

          {/* Newsletter */}
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-white/60">
              {isAr ? "اشترك في النشرة" : "Join our newsletter"}
            </p>
            <form onSubmit={onSubmit} className="mt-3 flex overflow-hidden rounded-full border border-white/15 bg-white/5 backdrop-blur transition focus-within:border-white/40">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isAr ? "بريدك الإلكتروني" : "your@email.com"}
                className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none"
                dir="ltr"
              />
              <button
                type="submit"
                className="grid h-12 w-12 shrink-0 place-items-center bg-white text-ink transition hover:bg-white/80"
                aria-label={isAr ? "اشترك" : "Subscribe"}
              >
                <Send className="h-4 w-4 rtl:rotate-180" />
              </button>
            </form>
            {submitted && (
              <p className="mt-2 text-xs font-semibold text-success animate-fade-in">
                ✓ {isAr ? "تم الاشتراك! شكراً لك." : "Subscribed! Thank you."}
              </p>
            )}
          </div>

          {/* Trust badges */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/70">
              <Shield className="h-3.5 w-3.5 text-success" />
              {isAr ? "وكالة مرخّصة" : "Licensed agency"}
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/70">
              <Award className="h-3.5 w-3.5 text-gold" />
              {isAr ? "Meta Business Partner" : "Meta Business Partner"}
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="lg:col-span-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white/50">{t("footer.services")}</h4>
          <ul className="mt-5 space-y-3">
            {services.map((s) => (
              <li key={s.href}>
                <Link
                  to={buildHref(locale, s.href)}
                  className="group inline-flex items-center gap-1.5 text-sm text-white/80 transition hover:text-white"
                >
                  <span className="h-px w-0 bg-white transition-all group-hover:w-3" />
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div className="lg:col-span-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white/50">{t("footer.quicklinks")}</h4>
          <ul className="mt-5 space-y-3">
            {company.map((q) => (
              <li key={q.href}>
                <Link
                  to={buildHref(locale, q.href)}
                  className="group inline-flex items-center gap-1.5 text-sm text-white/80 transition hover:text-white"
                >
                  <span className="h-px w-0 bg-white transition-all group-hover:w-3" />
                  {q.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="lg:col-span-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white/50">{t("footer.contact")}</h4>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 text-primary-glow">
                <MapPin className="h-4 w-4" />
              </span>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-white/50">{isAr ? "المقر" : "HQ"}</div>
                <div className="text-white/85">{isAr ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia"}</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 text-primary-glow">
                <Phone className="h-4 w-4" />
              </span>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-white/50">{isAr ? "اتصل" : "Call"}</div>
                <a href="tel:+966500000000" className="text-white/85 transition hover:text-white" dir="ltr">+966 50 000 0000</a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 text-primary-glow">
                <Mail className="h-4 w-4" />
              </span>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-white/50">{isAr ? "راسلنا" : "Email"}</div>
                <a href="mailto:hello@fikra-dm.com" className="text-white/85 transition hover:text-white">hello@fikra-dm.com</a>
              </div>
            </li>
          </ul>

          <div className="mt-7">
            <h5 className="text-xs font-bold uppercase tracking-widest text-white/50">{t("footer.locations")}</h5>
            <div className="mt-3 flex flex-wrap gap-2">
              {locations.map((l) => (
                <Link
                  key={l.href}
                  to={buildHref(locale, l.href)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 transition hover:border-white/30 hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container-app relative border-t border-white/10 py-6">
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-white/55 md:flex-row">
          <p>© {year} {t("footer.rights")}</p>
          <div className="flex items-center gap-5">
            {[
              { label: "Twitter", icon: Twitter, href: "https://twitter.com/" },
              { label: "Instagram", icon: Instagram, href: "https://instagram.com/" },
              { label: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:scale-110 hover:border-white/30 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
          <div className="flex items-center gap-4">
            <Link to={buildHref(locale, "/privacy")} className="transition hover:text-white">{t("footer.privacy")}</Link>
            <span className="opacity-40">·</span>
            <Link to={buildHref(locale, "/terms")} className="transition hover:text-white">{t("footer.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
