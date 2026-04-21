import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { useLocale } from "@/i18n/useLocale";
import { ArrowRight, ArrowLeft, Check, Mail, Phone, MapPin, Loader2, Sparkles, Clock, Award, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/{-$locale}/contact")({
  head: ({ params }) => ({
    meta: [
      { title: (params.locale ?? "ar") === "ar" ? "احجز استشارتك المجانية | فكرة" : "Book a Free Consultation | Fikra" },
      { name: "description", content: (params.locale ?? "ar") === "ar" ? "احجز استشارة مجانية مع خبراء فكرة — حدد خدماتك وميزانيتك ونصلك خلال 24 ساعة بخطة عمل مخصصة." : "Book a free consultation — pick your services and budget, and we'll send a tailored plan within 24 hours." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  services: z.array(z.string()).min(1, "اختر خدمة واحدة على الأقل"),
  industry: z.string().min(1),
  goal: z.string().min(1),
  timeline: z.string().min(1),
  budget: z.string().min(1),
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(8).max(30),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  city: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().max(800).optional().or(z.literal("")),
});

const TOTAL_STEPS = 5;

function ContactPage() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState({
    services: [] as string[],
    industry: "",
    goal: "",
    timeline: "",
    budget: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const services = [
    { id: "seo", label: isAr ? "تحسين محركات البحث (SEO)" : "Search Engine Optimization", emoji: "🔍" },
    { id: "ads", label: isAr ? "إعلانات Meta وGoogle" : "Meta & Google Ads", emoji: "📣" },
    { id: "social", label: isAr ? "إدارة السوشيال ميديا" : "Social Media Management", emoji: "📱" },
    { id: "content", label: isAr ? "محتوى وUGC" : "Content & UGC", emoji: "🎬" },
    { id: "design", label: isAr ? "تصميم وهوية بصرية" : "Design & Branding", emoji: "🎨" },
    { id: "web", label: isAr ? "تطوير موقع/متجر" : "Website / Store Development", emoji: "💻" },
    { id: "email", label: isAr ? "تسويق بالبريد والـ CRM" : "Email & CRM Marketing", emoji: "📧" },
    { id: "consulting", label: isAr ? "استشارة استراتيجية" : "Strategy Consulting", emoji: "🧠" },
  ];

  const industriesList = [
    { id: "ecom", label: isAr ? "متجر إلكتروني" : "E-commerce" },
    { id: "health", label: isAr ? "عيادة / صحة" : "Healthcare / Clinic" },
    { id: "realestate", label: isAr ? "عقارات" : "Real Estate" },
    { id: "logistics", label: isAr ? "لوجستيات / شحن" : "Logistics / Shipping" },
    { id: "education", label: isAr ? "تعليم / تدريب" : "Education / Training" },
    { id: "restaurant", label: isAr ? "مطاعم / كافيهات" : "Restaurants / Cafés" },
    { id: "saas", label: isAr ? "تقنية / SaaS" : "Tech / SaaS" },
    { id: "other", label: isAr ? "قطاع آخر" : "Other" },
  ];

  const goals = [
    { id: "leads", label: isAr ? "زيادة عدد العملاء المحتملين" : "Generate more leads", desc: isAr ? "نموذج تسجيل، اتصالات، طلبات استشارة" : "Forms, calls, consultation requests" },
    { id: "sales", label: isAr ? "رفع مبيعات المتجر" : "Lift online sales", desc: isAr ? "ROAS أعلى وتحويل أفضل" : "Higher ROAS and conversion" },
    { id: "brand", label: isAr ? "بناء وعي بالعلامة" : "Build brand awareness", desc: isAr ? "وصول واسع وتفاعل" : "Wider reach and engagement" },
    { id: "retention", label: isAr ? "ولاء العملاء الحاليين" : "Customer retention", desc: isAr ? "تكرار الشراء وLTV أعلى" : "Repeat purchase, higher LTV" },
    { id: "launch", label: isAr ? "إطلاق منتج / خدمة جديدة" : "Launch new product/service", desc: isAr ? "حملة إطلاق متكاملة" : "Full launch campaign" },
  ];

  const timelines = [
    { id: "asap", label: isAr ? "خلال أسبوع" : "Within a week", icon: "🔥" },
    { id: "2-4w", label: isAr ? "خلال شهر" : "Within a month", icon: "⚡" },
    { id: "1-3m", label: isAr ? "خلال 1-3 أشهر" : "1-3 months", icon: "📅" },
    { id: "explore", label: isAr ? "أستكشف الخيارات حالياً" : "Just exploring", icon: "🤔" },
  ];

  // Saudi-market realistic budget ranges (SAR/month)
  const budgets = [
    { id: "starter", label: isAr ? "أقل من 5,000 ر.س / شهر" : "< SAR 5,000 / mo", desc: isAr ? "مناسب للأعمال الصغيرة والناشئة" : "For small businesses & startups" },
    { id: "growth", label: isAr ? "5,000 – 15,000 ر.س / شهر" : "SAR 5,000 – 15,000 / mo", desc: isAr ? "أعمال متوسطة بنمو نشط" : "Mid-size growing businesses" },
    { id: "scale", label: isAr ? "15,000 – 35,000 ر.س / شهر" : "SAR 15,000 – 35,000 / mo", desc: isAr ? "علامات راسخة تحتاج توسعاً" : "Established brands scaling up" },
    { id: "enterprise", label: isAr ? "35,000 – 75,000 ر.س / شهر" : "SAR 35,000 – 75,000 / mo", desc: isAr ? "شركات كبيرة بمتطلبات متعددة" : "Large companies, multi-channel" },
    { id: "custom", label: isAr ? "أكثر من 75,000 ر.س / شهر" : "SAR 75,000+ / mo", desc: isAr ? "حسب التخصيص — تواصل معنا" : "Custom enterprise — contact us" },
    { id: "project", label: isAr ? "ميزانية مشروع ثابتة" : "Fixed project budget", desc: isAr ? "موقع / حملة إطلاق واحدة" : "Website / one-off launch" },
  ];

  const toggleService = (id: string) => {
    setData((d) => ({
      ...d,
      services: d.services.includes(id) ? d.services.filter((s) => s !== id) : [...d.services, id],
    }));
  };

  const next = () => {
    if (step === 0 && data.services.length === 0) {
      setErrors({ services: isAr ? "اختر خدمة واحدة على الأقل" : "Pick at least one service" });
      return;
    }
    setErrors({});
    setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  };
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const submit = async () => {
    const result = schema.safeParse(data);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      // jump back to first failing step
      if (errs.services) setStep(0);
      else if (errs.industry || errs.goal) setStep(1);
      else if (errs.timeline || errs.budget) setStep(2);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const { error } = await supabase.from("form_submissions").insert({
        form_name: "contact_consultation_v2",
        locale: isAr ? "ar" : "en",
        source_page: typeof window !== "undefined" ? window.location.pathname : null,
        payload: data,
      });
      if (error) throw error;
      setDone(true);
    } catch (err) {
      console.error(err);
      toast.error(isAr ? "حدث خطأ، حاول مرة أخرى" : "Error, please try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <Breadcrumbs trail={[{ label: isAr ? "تواصل معنا" : "Contact" }]} />

      <section className="bg-gradient-hero">
        <div className="container-app py-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {isAr ? "استشارة مجانية بدون التزام" : "Free, no-commitment consultation"}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold md:text-5xl">
            {isAr ? "خلّ شغلك يوصل أبعد — معانا" : "Take your business further — with us"}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            {isAr
              ? "جاوب على ٥ أسئلة قصيرة وتوصلك خطة عمل مخصصة من خبراء فكرة خلال ٢٤ ساعة."
              : "Answer 5 short questions and receive a tailored action plan within 24 hours."}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary" />{isAr ? "أقل من دقيقتين" : "Under 2 minutes"}</span>
            <span className="inline-flex items-center gap-1.5"><Award className="h-3.5 w-3.5 text-primary" />{isAr ? "وكالة مرخّصة بالسعودية" : "Licensed in KSA"}</span>
            <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-primary" />{isAr ? "+150 عميل خليجي" : "150+ Gulf clients"}</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-app grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-elegant md:p-10">
            {done ? (
              <div className="py-12 text-center animate-fade-in">
                <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-success/15 text-success animate-scale-in">
                  <Check className="h-10 w-10" />
                </div>
                <h2 className="mt-6 text-3xl font-extrabold">{isAr ? "وصلنا طلبك ✓" : "Got it ✓"}</h2>
                <p className="mt-3 text-muted-foreground">
                  {isAr
                    ? "خبير من فريق فكرة بيرسلك خطة مبدئية على الإيميل خلال ٢٤ ساعة، وبيتواصل معاك على الجوال للتنسيق."
                    : "A Fikra expert will send you an initial plan via email within 24h and call you to coordinate."}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  {isAr ? "تابع بريدك الإلكتروني (تأكد من Spam)" : "Check your inbox (and spam folder)"}
                </div>
              </div>
            ) : (
              <>
                {/* Stepper */}
                <div className="mb-7">
                  <div className="mb-3 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                    <span>{isAr ? `الخطوة ${step + 1} من ${TOTAL_STEPS}` : `Step ${step + 1} of ${TOTAL_STEPS}`}</span>
                    <span>{Math.round(((step + 1) / TOTAL_STEPS) * 100)}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1.5 flex-1 rounded-full transition-all duration-500",
                          i < step ? "bg-success" : i === step ? "bg-gradient-primary" : "bg-border",
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div key={step} className="animate-fade-in">
                  {/* Step 0: Services (multi-select) */}
                  {step === 0 && (
                    <div>
                      <h3 className="text-xl font-bold md:text-2xl">{isAr ? "وش الخدمات اللي تهمك؟" : "Which services interest you?"}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{isAr ? "تقدر تختار أكثر من خدمة" : "Pick as many as you want"}</p>
                      {errors.services && <p className="mt-2 text-xs text-destructive">{errors.services}</p>}
                      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                        {services.map((s) => {
                          const active = data.services.includes(s.id);
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => toggleService(s.id)}
                              className={cn(
                                "group flex items-center gap-3 rounded-2xl border-2 p-3.5 text-start text-sm transition-all hover:scale-[1.02]",
                                active
                                  ? "border-primary bg-primary/5 shadow-soft"
                                  : "border-border hover:border-primary/50",
                              )}
                            >
                              <span className="text-xl">{s.emoji}</span>
                              <span className="flex-1 font-medium">{s.label}</span>
                              <span
                                className={cn(
                                  "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all",
                                  active ? "border-primary bg-primary text-primary-foreground" : "border-border",
                                )}
                              >
                                {active && <Check className="h-3 w-3" />}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      {data.services.length > 0 && (
                        <p className="mt-3 text-xs text-primary">
                          {isAr ? `اخترت ${data.services.length} خدمة` : `${data.services.length} selected`}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Step 1: Industry + Goal */}
                  {step === 1 && (
                    <div className="space-y-7">
                      <div>
                        <h3 className="text-xl font-bold md:text-2xl">{isAr ? "وش قطاع شغلك؟" : "What's your industry?"}</h3>
                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                          {industriesList.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => setData({ ...data, industry: s.id })}
                              className={cn(
                                "rounded-xl border-2 p-3 text-start text-sm font-medium transition-all hover:scale-[1.02]",
                                data.industry === s.id
                                  ? "border-primary bg-primary/5 shadow-soft"
                                  : "border-border hover:border-primary/50",
                              )}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold md:text-2xl">{isAr ? "وش هدفك الأساسي؟" : "What's your main goal?"}</h3>
                        <div className="mt-4 space-y-2">
                          {goals.map((g) => (
                            <button
                              key={g.id}
                              type="button"
                              onClick={() => setData({ ...data, goal: g.id })}
                              className={cn(
                                "flex w-full items-start gap-3 rounded-xl border-2 p-3 text-start transition-all hover:scale-[1.01]",
                                data.goal === g.id
                                  ? "border-primary bg-primary/5 shadow-soft"
                                  : "border-border hover:border-primary/50",
                              )}
                            >
                              <span
                                className={cn(
                                  "mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                                  data.goal === g.id ? "border-primary bg-primary" : "border-border",
                                )}
                              />
                              <div>
                                <div className="text-sm font-bold">{g.label}</div>
                                <div className="text-xs text-muted-foreground">{g.desc}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Timeline + Budget */}
                  {step === 2 && (
                    <div className="space-y-7">
                      <div>
                        <h3 className="text-xl font-bold md:text-2xl">{isAr ? "متى تبي تبدأ؟" : "When do you want to start?"}</h3>
                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                          {timelines.map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setData({ ...data, timeline: t.id })}
                              className={cn(
                                "flex items-center gap-2.5 rounded-xl border-2 p-3 text-start text-sm font-medium transition-all hover:scale-[1.02]",
                                data.timeline === t.id
                                  ? "border-primary bg-primary/5 shadow-soft"
                                  : "border-border hover:border-primary/50",
                              )}
                            >
                              <span className="text-lg">{t.icon}</span>
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold md:text-2xl">{isAr ? "كم ميزانيتك التسويقية؟" : "What's your marketing budget?"}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {isAr
                            ? "أرقام واقعية للسوق السعودي — ساعدنا نرشّح لك الأنسب."
                            : "Saudi-market realistic ranges — helps us recommend the right fit."}
                        </p>
                        <div className="mt-4 space-y-2">
                          {budgets.map((b) => (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => setData({ ...data, budget: b.id })}
                              className={cn(
                                "flex w-full items-start gap-3 rounded-xl border-2 p-3.5 text-start transition-all hover:scale-[1.01]",
                                data.budget === b.id
                                  ? "border-primary bg-primary/5 shadow-soft"
                                  : "border-border hover:border-primary/50",
                              )}
                            >
                              <span
                                className={cn(
                                  "mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                                  data.budget === b.id ? "border-primary bg-primary" : "border-border",
                                )}
                              />
                              <div>
                                <div className="text-sm font-bold">{b.label}</div>
                                <div className="text-xs text-muted-foreground">{b.desc}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Name + Email + Phone (basic) */}
                  {step === 3 && (
                    <div>
                      <h3 className="text-xl font-bold md:text-2xl">{isAr ? "بياناتك للتواصل" : "Your contact details"}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{isAr ? "بنستخدمها فقط للرد عليك." : "Used only to reply."}</p>
                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <Field label={isAr ? "الاسم الكامل" : "Full name"} value={data.name} onChange={(v) => setData({ ...data, name: v })} error={errors.name} required />
                        <Field label={isAr ? "البريد الإلكتروني" : "Email"} type="email" dir="ltr" value={data.email} onChange={(v) => setData({ ...data, email: v })} error={errors.email} required />
                        <Field label={isAr ? "رقم الجوال" : "Mobile"} type="tel" dir="ltr" placeholder="+9665XXXXXXXX" value={data.phone} onChange={(v) => setData({ ...data, phone: v })} error={errors.phone} required />
                        <Field label={isAr ? "اسم الشركة (اختياري)" : "Company (optional)"} value={data.company} onChange={(v) => setData({ ...data, company: v })} />
                      </div>
                    </div>
                  )}

                  {/* Step 4: City + Message */}
                  {step === 4 && (
                    <div>
                      <h3 className="text-xl font-bold md:text-2xl">{isAr ? "تفاصيل أخيرة" : "Last details"}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{isAr ? "اختياري — يساعدنا نخصّص أفضل." : "Optional — helps us tailor better."}</p>
                      <div className="mt-5 grid gap-4">
                        <Field label={isAr ? "المدينة" : "City"} value={data.city} onChange={(v) => setData({ ...data, city: v })} placeholder={isAr ? "الرياض، جدة، الدمام..." : "Riyadh, Jeddah..."} />
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                            {isAr ? "اخبرنا أكثر عن مشروعك" : "Tell us about your project"}
                          </label>
                          <textarea
                            rows={5}
                            maxLength={800}
                            value={data.message}
                            onChange={(e) => setData({ ...data, message: e.target.value })}
                            placeholder={isAr ? "وش التحديات الحالية؟ وش جربت قبل؟" : "What are the current challenges? What have you tried before?"}
                            className="w-full rounded-xl border-2 border-border bg-background p-4 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                          <p className="mt-1 text-end text-xs text-muted-foreground">{data.message.length} / 800</p>
                        </div>

                        {/* Summary chip */}
                        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs">
                          <p className="font-bold text-primary">{isAr ? "ملخص طلبك:" : "Your request summary:"}</p>
                          <ul className="mt-2 space-y-1 text-foreground/80">
                            <li>• <strong>{isAr ? "خدمات:" : "Services:"}</strong> {data.services.length} {isAr ? "خدمة" : "selected"}</li>
                            <li>• <strong>{isAr ? "ميزانية:" : "Budget:"}</strong> {budgets.find((b) => b.id === data.budget)?.label ?? "—"}</li>
                            <li>• <strong>{isAr ? "البدء:" : "Start:"}</strong> {timelines.find((t) => t.id === data.timeline)?.label ?? "—"}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Nav */}
                <div className="mt-8 flex items-center justify-between gap-3">
                  <button
                    onClick={prev}
                    disabled={step === 0 || submitting}
                    className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-muted disabled:opacity-40"
                  >
                    {isAr ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                    {isAr ? "السابق" : "Back"}
                  </button>
                  {step === TOTAL_STEPS - 1 ? (
                    <button
                      onClick={submit}
                      disabled={submitting}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-elegant transition hover:scale-105 active:scale-95 disabled:opacity-60"
                    >
                      {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                      {isAr ? "إرسال الطلب" : "Submit"}
                    </button>
                  ) : (
                    <button
                      onClick={next}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:scale-105 active:scale-95"
                    >
                      {isAr ? "التالي" : "Next"}
                      {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h4 className="text-sm font-bold">{isAr ? "للتواصل المباشر" : "Direct contact"}</h4>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  <a href="tel:+966500000000" dir="ltr" className="hover:text-primary">+966 50 000 0000</a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <a href="mailto:hello@fikra-dm.com" className="hover:text-primary">hello@fikra-dm.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-primary" />
                  {isAr ? "الرياض، السعودية" : "Riyadh, KSA"}
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
              <h4 className="text-sm font-bold text-primary">{isAr ? "ليش تختار فكرة؟" : "Why Fikra?"}</h4>
              <ul className="mt-3 space-y-2.5 text-sm text-foreground/85">
                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-primary" />{isAr ? "وكالة مرخّصة بالسعودية" : "Licensed agency in KSA"}</li>
                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-primary" />{isAr ? "تقارير شفافة شهرية" : "Transparent monthly reports"}</li>
                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-primary" />{isAr ? "مدير حساب مخصّص لك" : "Dedicated account manager"}</li>
                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-primary" />{isAr ? "خبرة بالسوق السعودي والخليجي" : "Saudi & Gulf market expertise"}</li>
                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-primary" />{isAr ? "بدون عقود طويلة المدى" : "No long-term lock-in"}</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  dir,
  placeholder,
  error,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  dir?: "ltr" | "rtl";
  placeholder?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type={type}
        dir={dir}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-11 w-full rounded-xl border-2 bg-background px-4 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/20",
          error ? "border-destructive" : "border-border focus:border-primary",
        )}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
