import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter, ArrowUpRight, Send, Award, Shield, Sparkles, Clock } from "lucide-react";
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
    { label: isAr ? "إدارة السوشيال" : "Social Media", href: "/services/performance/social-ads" },
    { label: isAr ? "كتابة المحتوى" : "Content Writing", href: "/services/creative/content-writing" },
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
    { label: isAr ? "جدة" : "Jeddah", href: "/locations/seo-agency-riyadh" },
    { label: isAr ? "دبي" : "Dubai", href: "/locations/digital-marketing-dubai" },
    { label: isAr ? "أبوظبي" : "Abu Dhabi", href: "/locations/digital-marketing-dubai" },
    { label: isAr ? "القاهرة" : "Cairo", href: "/locations/web-design-cairo" },
    { label: isAr ? "الكويت" : "Kuwait", href: "/locations/digital-marketing-dubai" },
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
      <div className="pointer-events-none absolute -end-32 -top-32 h-[28rem] w-[28rem] rounded-full opacity-25 blur-3xl" style={{ background: "var(--gradient-brand)" }} aria-hidden />
      <div className="pointer-events-none absolute -start-32 bottom-20 h-96 w-96 rounded-full opacity-15 blur-3xl" style={{ background: "var(--gold)" }} aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.04]" aria-hidden />

      {/* Top CTA banner */}
      <div className="container-app relative pt-16">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-8 backdrop-blur-xl md:p-12">
          <div className="pointer-events-none absolute -end-20 -top-20 h-72 w-72 rounded-full bg-primary/40 blur-3xl" aria-hidden />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-gold">
                <Sparkles className="h-3 w-3" />
                {isAr ? "استشارة مجانية" : "Free consultation"}
              </div>
              <h3 className="mt-4 text-3xl font-black leading-[1.15] md:text-4xl">
                {isAr ? "جاهز لتنمية أعمالك؟ تحدث مع خبير اليوم." : "Ready to grow your business? Talk to an expert today."}
              </h3>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-success" /> {isAr ? "ردّ خلال 24 ساعة" : "Reply within 24h"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-success" /> {isAr ? "بدون التزام" : "No commitment"}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                to={buildHref(locale, "/contact")}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-ink transition hover:scale-[1.02] hover:bg-white/90"
              >
                {t("cta.primary")}
                <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45 rtl:rotate-90 rtl:group-hover:rotate-[135deg]" />
              </Link>
              <a
                href="https://wa.me/966500000000"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-success/40 bg-success/10 px-6 text-sm font-semibold text-success transition hover:bg-success/20"
                dir="ltr"
              >
                <Phone className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="container-app relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
        {/* Brand + newsletter */}
        <div className="lg:col-span-4">
          <Link to={buildHref(locale, "/")} className="group inline-flex items-center gap-3">
            <div className="relative">
              <span className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 blur-md transition group-hover:opacity-60" aria-hidden />
              <img src={logo} alt={t("brand.full")} className="relative h-12 w-12 rounded-xl object-cover ring-2 ring-white/10 transition group-hover:ring-white/40" />
            </div>
            <div className="leading-tight">
              <div className="text-base font-extrabold">{t("brand.name")}</div>
              <div className="text-[11px] text-white/60">{t("brand.tagline")}</div>
            </div>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/70">{t("footer.about")}</p>

          {/* Newsletter */}
          <div className="mt-7">
            <p className="text-xs font-bold uppercase tracking-widest text-white/60">
              {isAr ? "نشرة الرؤى الأسبوعية" : "Weekly insights newsletter"}
            </p>
            <p className="mt-1 text-xs text-white/50">
              {isAr ? "بدون سبام — فقط ما يهم نمو عملك." : "No spam — only what grows your business."}
            </p>
            <form onSubmit={onSubmit} className="mt-3 flex overflow-hidden rounded-full border border-white/15 bg-white/5 backdrop-blur transition focus-within:border-primary-glow/60 focus-within:ring-2 focus-within:ring-primary-glow/30">
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
                className="group grid h-12 w-12 shrink-0 place-items-center bg-gradient-primary text-white transition hover:opacity-90"
                aria-label={isAr ? "اشترك" : "Subscribe"}
              >
                <Send className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </button>
            </form>
            {submitted && (
              <p className="mt-2 text-xs font-semibold text-success animate-fade-in">
                ✓ {isAr ? "تم الاشتراك! شكراً لك." : "Subscribed! Thank you."}
              </p>
            )}
          </div>

          {/* Trust badges */}
          <div className="mt-7 grid grid-cols-2 gap-2">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-white/80">
              <Shield className="h-4 w-4 text-success" />
              {isAr ? "وكالة مرخّصة" : "Licensed agency"}
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-white/80">
              <Award className="h-4 w-4 text-gold" />
              {isAr ? "Meta Partner" : "Meta Partner"}
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-white/80">
              <Award className="h-4 w-4 text-gold" />
              {isAr ? "Google Partner" : "Google Partner"}
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-white/80">
              <Award className="h-4 w-4 text-gold" />
              {isAr ? "TikTok Partner" : "TikTok Partner"}
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="lg:col-span-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white/50">{t("footer.services")}</h4>
          <ul className="mt-5 grid gap-3">
            {services.map((s) => (
              <li key={s.href}>
                <Link
                  to={buildHref(locale, s.href)}
                  className="group inline-flex items-center gap-2 text-sm text-white/80 transition hover:text-white"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-glow opacity-50 transition group-hover:scale-150 group-hover:opacity-100" />
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div className="lg:col-span-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white/50">{t("footer.quicklinks")}</h4>
          <ul className="mt-5 grid gap-3">
            {company.map((q) => (
              <li key={q.href}>
                <Link
                  to={buildHref(locale, q.href)}
                  className="group inline-flex items-center gap-2 text-sm text-white/80 transition hover:text-white"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gold opacity-50 transition group-hover:scale-150 group-hover:opacity-100" />
                  {q.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="lg:col-span-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white/50">{t("footer.contact")}</h4>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-primary-glow">
                <MapPin className="h-4 w-4" />
              </span>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-white/50">{isAr ? "المقر" : "HQ"}</div>
                <div className="text-white/85">{isAr ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia"}</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-primary-glow">
                <Phone className="h-4 w-4" />
              </span>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-white/50">{isAr ? "اتصل" : "Call"}</div>
                <a href="tel:+966500000000" className="text-white/85 transition hover:text-white" dir="ltr">+966 50 000 0000</a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-primary-glow">
                <Mail className="h-4 w-4" />
              </span>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-white/50">{isAr ? "راسلنا" : "Email"}</div>
                <a href="mailto:hello@fikra-dm.com" className="text-white/85 transition hover:text-white">hello@fikra-dm.com</a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-primary-glow">
                <Clock className="h-4 w-4" />
              </span>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-white/50">{isAr ? "ساعات العمل" : "Hours"}</div>
                <div className="text-white/85">{isAr ? "الأحد - الخميس · 9 ص - 6 م" : "Sun - Thu · 9 AM - 6 PM"}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Locations strip */}
      <div className="container-app relative">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur">
          <div className="flex flex-wrap items-center gap-3">
            <h5 className="me-2 text-xs font-bold uppercase tracking-widest text-white/50">
              {t("footer.locations")}:
            </h5>
            {locations.map((l) => (
              <Link
                key={l.label}
                to={buildHref(locale, l.href)}
                className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/75 transition hover:border-primary-glow/40 hover:text-white"
              >
                <MapPin className="h-3 w-3" />
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container-app relative mt-10 border-t border-white/10 py-6">
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-white/55 md:flex-row">
          <p>© {year} {t("footer.rights")}</p>
          <div className="flex items-center gap-3">
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
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:scale-110 hover:border-primary-glow/40 hover:bg-primary-glow/10 hover:text-white"
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
