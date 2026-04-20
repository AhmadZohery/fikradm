import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { useLocale } from "@/i18n/useLocale";
import { ArrowRight, ArrowLeft, Check, Mail, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/{-$locale}/contact")({
  head: ({ params }) => ({
    meta: [
      { title: params.locale === "ar" ? "احجز استشارتك | فكرة" : "Book a Consultation | Fikra" },
      { name: "description", content: params.locale === "ar" ? "احجز استشارة مجانية مع خبرائنا — نحلل وضعك ونعطيك خطة عمل." : "Book a free consultation — we analyze your situation and deliver an action plan." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  service: z.string().min(1),
  industry: z.string().min(1),
  budget: z.string().min(1),
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(6).max(30),
  message: z.string().trim().max(800).optional().or(z.literal("")),
});

function ContactPage() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [data, setData] = useState({
    service: "", industry: "", budget: "",
    name: "", email: "", phone: "", message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const services = [
    { id: "seo", label: isAr ? "تحسين محركات البحث (SEO)" : "Search Engine Optimization" },
    { id: "performance", label: isAr ? "إعلانات ممولة" : "Paid Ads" },
    { id: "creative", label: isAr ? "إنتاج إبداعي" : "Creative" },
    { id: "web", label: isAr ? "تطوير موقع/متجر" : "Web/Store" },
    { id: "all", label: isAr ? "حل متكامل" : "Integrated" },
  ];
  const industriesList = [
    { id: "ecom", label: isAr ? "متجر إلكتروني" : "E-commerce" },
    { id: "health", label: isAr ? "عيادة/صحة" : "Healthcare" },
    { id: "realestate", label: isAr ? "عقار" : "Real Estate" },
    { id: "logistics", label: isAr ? "لوجستيات" : "Logistics" },
    { id: "other", label: isAr ? "أخرى" : "Other" },
  ];
  const budgets = [
    { id: "low", label: isAr ? "أقل من 5,000 ر.س/شهر" : "< SAR 5,000/mo" },
    { id: "mid", label: "5,000 – 15,000 SAR" },
    { id: "high", label: "15,000 – 50,000 SAR" },
    { id: "ent", label: isAr ? "أكثر من 50,000 ر.س" : "50,000+ SAR" },
  ];

  const next = () => setStep((s) => Math.min(3, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const submit = () => {
    const result = schema.safeParse(data);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => { errs[String(i.path[0])] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setDone(true);
    // TODO: webhook integration in Phase 2
  };

  return (
    <SiteLayout>
      <Breadcrumbs trail={[{ label: isAr ? "تواصل معنا" : "Contact" }]} />
      <section className="bg-gradient-hero">
        <div className="container-app py-14 text-center">
          <h1 className="text-3xl font-extrabold md:text-5xl">{isAr ? "احجز استشارتك المجانية" : "Book your free consultation"}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{isAr ? "أجب على 4 أسئلة سريعة وسنتواصل معك خلال 24 ساعة." : "Answer 4 quick questions and we'll reach out within 24 hours."}</p>
        </div>
      </section>

      <section className="section">
        <div className="container-app grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant md:p-10">
            {done ? (
              <div className="py-10 text-center">
                <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check className="h-8 w-8" />
                </div>
                <h2 className="mt-5 text-2xl font-extrabold">{isAr ? "تم استلام طلبك ✓" : "Request received ✓"}</h2>
                <p className="mt-2 text-muted-foreground">{isAr ? "سنتواصل معك خلال 24 ساعة." : "We'll be in touch within 24 hours."}</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center gap-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={cn("h-1.5 flex-1 rounded-full", i <= step ? "bg-gradient-primary" : "bg-border")} />
                  ))}
                </div>

                {step === 0 && (
                  <div>
                    <h3 className="text-xl font-bold">{isAr ? "ما الخدمة التي تهتم بها؟" : "Which service interests you?"}</h3>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {services.map((s) => (
                        <button key={s.id} onClick={() => { setData({ ...data, service: s.id }); next(); }}
                          className={cn("rounded-xl border p-4 text-start text-sm transition hover:border-primary", data.service === s.id ? "border-primary bg-primary/5" : "border-border")}>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h3 className="text-xl font-bold">{isAr ? "ما قطاع عملك؟" : "What's your industry?"}</h3>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {industriesList.map((s) => (
                        <button key={s.id} onClick={() => { setData({ ...data, industry: s.id }); next(); }}
                          className={cn("rounded-xl border p-4 text-start text-sm transition hover:border-primary", data.industry === s.id ? "border-primary bg-primary/5" : "border-border")}>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h3 className="text-xl font-bold">{isAr ? "ما ميزانيتك الشهرية المتوقعة؟" : "Your expected monthly budget?"}</h3>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {budgets.map((s) => (
                        <button key={s.id} onClick={() => { setData({ ...data, budget: s.id }); next(); }}
                          className={cn("rounded-xl border p-4 text-start text-sm transition hover:border-primary", data.budget === s.id ? "border-primary bg-primary/5" : "border-border")}>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h3 className="text-xl font-bold">{isAr ? "بياناتك للتواصل" : "Your contact details"}</h3>
                    <div className="mt-5 grid gap-4">
                      {(["name", "email", "phone"] as const).map((field) => (
                        <div key={field}>
                          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                            {field === "name" ? (isAr ? "الاسم الكامل" : "Full name") : field === "email" ? (isAr ? "البريد الإلكتروني" : "Email") : (isAr ? "رقم الجوال" : "Phone")}
                          </label>
                          <input
                            type={field === "email" ? "email" : "text"}
                            value={data[field]}
                            onChange={(e) => setData({ ...data, [field]: e.target.value })}
                            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm focus:border-primary focus:outline-none"
                          />
                          {errors[field] && <p className="mt-1 text-xs text-destructive">{errors[field]}</p>}
                        </div>
                      ))}
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">{isAr ? "أخبرنا عن مشروعك (اختياري)" : "Tell us about your project (optional)"}</label>
                        <textarea
                          rows={4}
                          maxLength={800}
                          value={data.message}
                          onChange={(e) => setData({ ...data, message: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background p-4 text-sm focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between">
                  <button onClick={prev} disabled={step === 0} className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-medium disabled:opacity-40">
                    <ArrowRight className="h-4 w-4 rtl:hidden" />
                    <ArrowLeft className="hidden h-4 w-4 rtl:inline" />
                    {isAr ? "السابق" : "Back"}
                  </button>
                  {step === 3 ? (
                    <button onClick={submit} className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft">
                      {isAr ? "إرسال الطلب" : "Submit"}
                    </button>
                  ) : (
                    <button onClick={next} className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft">
                      {isAr ? "التالي" : "Next"}
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
                <li className="flex gap-2"><Phone className="h-4 w-4 text-primary" /><a href="tel:+966500000000" dir="ltr">+966 50 000 0000</a></li>
                <li className="flex gap-2"><Mail className="h-4 w-4 text-primary" />hello@fikra-dm.com</li>
                <li className="flex gap-2"><MapPin className="h-4 w-4 text-primary" />{isAr ? "الرياض، السعودية" : "Riyadh, KSA"}</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <h4 className="text-sm font-bold text-primary">{isAr ? "لماذا فكرة؟" : "Why Fikra?"}</h4>
              <ul className="mt-3 space-y-2 text-sm text-foreground/85">
                <li className="flex gap-2"><Check className="h-4 w-4 text-primary" />{isAr ? "وكالة مرخّصة بالسعودية" : "Licensed agency in KSA"}</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-primary" />{isAr ? "تقارير شفافة شهرية" : "Transparent monthly reports"}</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-primary" />{isAr ? "مدير حساب مخصص" : "Dedicated account manager"}</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
