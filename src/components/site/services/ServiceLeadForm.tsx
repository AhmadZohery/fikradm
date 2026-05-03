import { useState } from "react";
import { z } from "zod";
import { Loader2, Check, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { trackLead } from "@/lib/analytics";
import { useLocale } from "@/i18n/useLocale";
import { cn } from "@/lib/utils";

type Props = {
  serviceSlug: string;
  serviceName: string;
  /** tailwind gradient class string e.g. "from-violet-600 via-violet-500 to-indigo-500" */
  gradient?: string;
};

const schema = z.object({
  name: z.string().trim().min(2, "اسم قصير جداً").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{6,18}$/i, "رقم غير صحيح"),
  email: z.string().trim().email("بريد غير صحيح").max(200).optional().or(z.literal("")),
  message: z.string().trim().max(400).optional().or(z.literal("")),
});

type FormState = z.infer<typeof schema>;

export function ServiceLeadForm({ serviceSlug, serviceName, gradient = "from-primary via-primary to-primary" }: Props) {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const [data, setData] = useState<FormState>({ name: "", phone: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof FormState, v: string) => setData((d) => ({ ...d, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(data);
    if (!result.success) {
      const errs: Partial<Record<keyof FormState, string>> = {};
      result.error.issues.forEach((i) => {
        errs[i.path[0] as keyof FormState] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const { error } = await supabase.from("form_submissions").insert({
        form_name: "service_lead_short",
        locale: isAr ? "ar" : "en",
        source_page: typeof window !== "undefined" ? window.location.pathname : null,
        payload: { service: serviceSlug, ...data },
      });
      if (error) throw error;
      trackLead({ source: "service_page", service: serviceSlug });
      setDone(true);
    } catch (err) {
      console.error(err);
      setErrors({ name: isAr ? "حدث خطأ، حاول مرة أخرى" : "Error, please try again" });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-card">
        <div className={cn("mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full text-white bg-gradient-to-br", gradient)}>
          <Check className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-xl font-extrabold">{isAr ? "وصلنا طلبك ✓" : "Got it ✓"}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {isAr
            ? "هنتواصل معاك خلال أقل من 24 ساعة لتحديد جلسة الاستشارة."
            : "We'll reach out within 24 hours to schedule your consultation."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8"
      aria-labelledby="service-lead-title"
    >
      <div className="mb-5">
        <h3 id="service-lead-title" className="text-xl font-extrabold md:text-2xl">
          {isAr ? `احجز استشارة مجانية لخدمة ${serviceName}` : `Book a free consultation for ${serviceName}`}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {isAr ? "خبير من فكرة هيتواصل معاك خلال 24 ساعة." : "A Fikra expert will contact you within 24 hours."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={isAr ? "الاسم" : "Name"}
          value={data.name}
          onChange={(v) => set("name", v)}
          error={errors.name}
          autoComplete="name"
          required
        />
        <Field
          label={isAr ? "رقم الجوال" : "Phone"}
          value={data.phone}
          onChange={(v) => set("phone", v)}
          error={errors.phone}
          type="tel"
          dir="ltr"
          autoComplete="tel"
          required
        />
        <div className="sm:col-span-2">
          <Field
            label={isAr ? "البريد الإلكتروني (اختياري)" : "Email (optional)"}
            value={data.email ?? ""}
            onChange={(v) => set("email", v)}
            error={errors.email}
            type="email"
            dir="ltr"
            autoComplete="email"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-bold text-foreground">
            {isAr ? "اكتب طلبك بإيجاز (اختياري)" : "Briefly describe your need (optional)"}
          </label>
          <textarea
            value={data.message ?? ""}
            onChange={(e) => set("message", e.target.value)}
            rows={3}
            maxLength={400}
            className="w-full resize-none rounded-2xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={cn(
          "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:shadow-elegant disabled:opacity-60 bg-gradient-to-br",
          gradient,
        )}
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {isAr ? "أرسل طلب الاستشارة" : "Send my request"}
      </button>
      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        {isAr ? "بإرسال الطلب، أنت توافق على سياسة الخصوصية." : "By submitting, you agree to our privacy policy."}
      </p>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  required,
  autoComplete,
  dir,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        dir={dir}
        className={cn(
          "w-full rounded-2xl border bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2",
          error
            ? "border-destructive/60 focus:border-destructive focus:ring-destructive/20"
            : "border-border focus:border-primary focus:ring-primary/20",
        )}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}