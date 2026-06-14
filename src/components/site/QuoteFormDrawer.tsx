import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, ArrowRight, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { captureUtm, getAttribution } from "@/lib/utm";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultService?: string;
  locale?: "ar" | "en";
};

const SERVICES = [
  { id: "seo", ar: "تحسين محركات البحث (SEO)", en: "SEO" },
  { id: "ads", ar: "إعلانات مدفوعة", en: "Paid Ads" },
  { id: "social", ar: "إدارة سوشيال ميديا", en: "Social Media" },
  { id: "content", ar: "تسويق المحتوى", en: "Content Marketing" },
  { id: "design", ar: "تصميم وهوية بصرية", en: "Branding & Design" },
  { id: "web", ar: "تطوير موقع/متجر", en: "Web / Store" },
  { id: "ecommerce", ar: "تطوير متجر إلكتروني", en: "E-commerce Store" },
  { id: "other", ar: "غير ذلك", en: "Other" },
];

const PLATFORMS = [
  { id: "salla", label: "سلة Salla" },
  { id: "zid", label: "زد Zid" },
  { id: "shopify", label: "Shopify" },
  { id: "custom", label: "مخصص" },
];

const BUDGETS = [
  { id: "lt5", ar: "أقل من 5,000 ر.س", en: "Under SAR 5,000" },
  { id: "5-15", ar: "5,000 – 15,000 ر.س", en: "SAR 5,000 – 15,000" },
  { id: "15-50", ar: "15,000 – 50,000 ر.س", en: "SAR 15,000 – 50,000" },
  { id: "50p", ar: "أكثر من 50,000 ر.س", en: "SAR 50,000+" },
  { id: "unsure", ar: "لست متأكد", en: "Not sure yet" },
];

const TIMELINES = [
  { id: "asap", ar: "بأسرع وقت", en: "ASAP" },
  { id: "1m", ar: "خلال شهر", en: "Within 1 month" },
  { id: "3m", ar: "خلال 3 شهور", en: "Within 3 months" },
  { id: "flex", ar: "مرن", en: "Flexible" },
];

const DRAFT_KEY = "fikra_quote_draft_v1";

type Data = {
  service: string;
  platform?: string;
  current_site?: string;
  target_keywords?: string;
  industry?: string;
  goal?: string;
  budget?: string;
  timeline?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  honeypot?: string;
};

const baseSchema = z.object({
  service: z.string().min(1, "اختر خدمة"),
  goal: z.string().min(5, "اكتب هدفك بإيجاز"),
  budget: z.string().min(1, "اختر الميزانية"),
  timeline: z.string().min(1, "اختر الإطار الزمني"),
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("بريد غير صحيح"),
  phone: z.string().min(7, "رقم الجوال مطلوب").max(20),
  honeypot: z.string().max(0).optional(),
});

const STEPS = 4;

export function QuoteFormDrawer({ open, onOpenChange, defaultService, locale = "ar" }: Props) {
  const isAr = locale === "ar";
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [data, setData] = useState<Data>(() => {
    if (typeof window === "undefined") return { service: defaultService || "" };
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) return { ...(JSON.parse(raw) as Data), service: defaultService || JSON.parse(raw).service || "" };
    } catch {}
    return { service: defaultService || "" };
  });

  useEffect(() => {
    if (open) captureUtm();
  }, [open]);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    } catch {}
  }, [data]);

  const isStore = data.service === "web" || data.service === "ecommerce";
  const isSeo = data.service === "seo";

  const set = <K extends keyof Data>(k: K, v: Data[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const validateStep = (s: number): boolean => {
    const errs: Record<string, string> = {};
    if (s === 0 && !data.service) errs.service = isAr ? "اختر خدمة" : "Pick a service";
    if (s === 1) {
      if (!data.goal || data.goal.length < 5)
        errs.goal = isAr ? "اكتب الهدف بإيجاز (٥ أحرف+)" : "Describe your goal";
      if (isStore && !data.platform) errs.platform = isAr ? "اختر المنصة" : "Pick a platform";
    }
    if (s === 2) {
      if (!data.budget) errs.budget = isAr ? "اختر الميزانية" : "Pick budget";
      if (!data.timeline) errs.timeline = isAr ? "اختر الإطار الزمني" : "Pick timeline";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(STEPS - 1, s + 1));
  };
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const submit = async () => {
    const parsed = baseSchema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      if (errs.service) setStep(0);
      else if (errs.goal) setStep(1);
      else if (errs.budget || errs.timeline) setStep(2);
      else setStep(3);
      return;
    }
    if (data.honeypot) return; // bot
    setSubmitting(true);
    try {
      const attribution = getAttribution();
      const { error } = await supabase.from("form_submissions").insert({
        form_name: "quote_request_v1",
        locale: isAr ? "ar" : "en",
        source_page: typeof window !== "undefined" ? window.location.pathname : null,
        payload: {
          ...data,
          honeypot: undefined,
          attribution,
        },
      });
      if (error) throw error;
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {}
      setDone(true);
      toast.success(isAr ? "تم استلام طلبك بنجاح" : "Request received");
    } catch (e) {
      console.error(e);
      toast.error(isAr ? "حدث خطأ، حاول لاحقاً" : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const progress = useMemo(() => Math.round(((step + (done ? 1 : 0)) / STEPS) * 100), [step, done]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isAr ? "left" : "right"} className="w-full sm:max-w-xl overflow-y-auto" dir={isAr ? "rtl" : "ltr"}>
        <SheetHeader className="text-start">
          <Badge variant="outline" className="w-fit gap-1">
            <Sparkles className="h-3 w-3" /> {isAr ? "طلب عرض سعر" : "Get a Quote"}
          </Badge>
          <SheetTitle className="text-2xl">
            {isAr ? "خطة مخصصة لمشروعك في أقل من دقيقتين" : "Custom plan in under 2 minutes"}
          </SheetTitle>
          <SheetDescription>
            {isAr
              ? "جاوب على أسئلة سريعة وفريقنا يتواصل معك خلال ٢٤ ساعة بعرض مخصص."
              : "Answer a few quick questions and our team will reach out within 24 hours."}
          </SheetDescription>
        </SheetHeader>

        <Progress value={progress} className="mt-4" />

        {done ? (
          <div className="py-10 text-center">
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-xl font-bold">
              {isAr ? "وصل طلبك ✓" : "Got it ✓"}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {isAr
                ? "هنرسلك خطة مبدئية على بريدك خلال ٢٤ ساعة."
                : "Initial plan in your inbox within 24h."}
            </p>
            <Button className="mt-6" onClick={() => onOpenChange(false)}>
              {isAr ? "إغلاق" : "Close"}
            </Button>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {/* honeypot */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
              value={data.honeypot || ""}
              onChange={(e) => set("honeypot", e.target.value)}
              aria-hidden="true"
            />

            {step === 0 && (
              <div className="space-y-3">
                <Label>{isAr ? "أي خدمة تهمك؟" : "Which service?"}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {SERVICES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => set("service", s.id)}
                      className={`rounded-xl border p-3 text-start text-sm transition ${
                        data.service === s.id
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {isAr ? s.ar : s.en}
                    </button>
                  ))}
                </div>
                {errors.service && <p className="text-xs text-destructive">{errors.service}</p>}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                {isStore && (
                  <div className="space-y-2">
                    <Label>{isAr ? "المنصة المفضلة" : "Preferred platform"}</Label>
                    <div className="flex flex-wrap gap-2">
                      {PLATFORMS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => set("platform", p.id)}
                          className={`rounded-full border px-4 py-1.5 text-sm transition ${
                            data.platform === p.id
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                    {errors.platform && <p className="text-xs text-destructive">{errors.platform}</p>}
                  </div>
                )}
                {isSeo && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="current_site">{isAr ? "الموقع الحالي (إن وجد)" : "Current website"}</Label>
                      <Input
                        id="current_site"
                        placeholder="https://"
                        value={data.current_site || ""}
                        onChange={(e) => set("current_site", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kw">{isAr ? "كلمات مستهدفة (اختياري)" : "Target keywords"}</Label>
                      <Input
                        id="kw"
                        value={data.target_keywords || ""}
                        onChange={(e) => set("target_keywords", e.target.value)}
                      />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label htmlFor="industry">{isAr ? "مجال العمل" : "Industry"}</Label>
                  <Input
                    id="industry"
                    value={data.industry || ""}
                    onChange={(e) => set("industry", e.target.value)}
                    placeholder={isAr ? "مثال: عقارات، صحة، تجزئة..." : "e.g. real estate, health, retail"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal">{isAr ? "هدفك من المشروع" : "Your main goal"}</Label>
                  <Textarea
                    id="goal"
                    rows={3}
                    value={data.goal || ""}
                    onChange={(e) => set("goal", e.target.value)}
                    placeholder={isAr ? "مثال: زيادة الـ leads ٣٠٪ خلال ٣ شهور" : "e.g. +30% leads in 3 months"}
                  />
                  {errors.goal && <p className="text-xs text-destructive">{errors.goal}</p>}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{isAr ? "الميزانية الشهرية التقريبية" : "Approx. monthly budget"}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {BUDGETS.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => set("budget", b.id)}
                        className={`rounded-xl border p-3 text-sm transition ${
                          data.budget === b.id
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {isAr ? b.ar : b.en}
                      </button>
                    ))}
                  </div>
                  {errors.budget && <p className="text-xs text-destructive">{errors.budget}</p>}
                </div>
                <div className="space-y-2">
                  <Label>{isAr ? "متى تريد البدء؟" : "When to start?"}</Label>
                  <div className="flex flex-wrap gap-2">
                    {TIMELINES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => set("timeline", t.id)}
                        className={`rounded-full border px-4 py-1.5 text-sm transition ${
                          data.timeline === t.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {isAr ? t.ar : t.en}
                      </button>
                    ))}
                  </div>
                  {errors.timeline && <p className="text-xs text-destructive">{errors.timeline}</p>}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">{isAr ? "الاسم" : "Name"}*</Label>
                    <Input id="name" value={data.name || ""} onChange={(e) => set("name", e.target.value)} />
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">{isAr ? "الشركة" : "Company"}</Label>
                    <Input id="company" value={data.company || ""} onChange={(e) => set("company", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{isAr ? "البريد" : "Email"}*</Label>
                    <Input id="email" type="email" value={data.email || ""} onChange={(e) => set("email", e.target.value)} />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{isAr ? "الجوال" : "Phone"}*</Label>
                    <Input id="phone" value={data.phone || ""} onChange={(e) => set("phone", e.target.value)} />
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{isAr ? "تفاصيل إضافية (اختياري)" : "Additional notes"}</Label>
                  <Textarea id="message" rows={3} value={data.message || ""} onChange={(e) => set("message", e.target.value)} />
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between gap-2 border-t border-border pt-4">
              <Button variant="outline" onClick={prev} disabled={step === 0 || submitting}>
                {isAr ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                <span className="ms-1">{isAr ? "السابق" : "Back"}</span>
              </Button>
              <span className="text-xs text-muted-foreground">
                {isAr ? `الخطوة ${step + 1} من ${STEPS}` : `Step ${step + 1} of ${STEPS}`}
              </span>
              {step < STEPS - 1 ? (
                <Button onClick={next}>
                  {isAr ? "التالي" : "Next"}
                  {isAr ? <ArrowLeft className="ms-1 h-4 w-4" /> : <ArrowRight className="ms-1 h-4 w-4" />}
                </Button>
              ) : (
                <Button onClick={submit} disabled={submitting}>
                  {submitting && <Loader2 className="me-1 h-4 w-4 animate-spin" />}
                  {isAr ? "إرسال الطلب" : "Submit"}
                </Button>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}