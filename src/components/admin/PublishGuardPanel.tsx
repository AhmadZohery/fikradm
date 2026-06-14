import { useMemo } from "react";
import { AlertTriangle, CheckCircle2, XCircle, Sparkles, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { evaluatePublishGuard, type GuardInput, type GuardIssue } from "@/lib/publishGuard";

/** Map each field/blocker key → concrete remediation tip (Arabic). */
const SUGGESTIONS: Record<string, string> = {
  title: "أضف عنوانًا واضحًا بالعربية والإنجليزية يحتوي على الكلمة المفتاحية.",
  meta_description: "اكتب وصف ميتا بين 70-160 حرف يلخّص المقال ويحفّز على النقر.",
  meta_description_ar: "اضبط طول الوصف بالعربية بين 70 و160 حرف.",
  meta_description_en: "Adjust EN meta description to be between 70-160 chars.",
  meta_title_ar: "اختصر عنوان الميتا بالعربية لأقل من 60 حرف.",
  meta_title_en: "Shorten EN meta title to under 60 chars.",
  cover_image_url: "ارفع صورة غلاف 1200×630 على الأقل لظهور Rich Result.",
  author: "أضف اسم الكاتب بالعربية والإنجليزية.",
  published_at: "حدّد تاريخ النشر قبل تفعيل الحالة منشور.",
  last_reviewed: "أضف تاريخ آخر مراجعة لرفع EEAT وتحديث dateModified.",
  author_bio: "أضف نبذة عن الكاتب (1-3 جمل) — مهمة لـ EEAT.",
  tldr: "أضف 3+ نقاط TL;DR لتفعيل AEO/AIO وتلخيص محرّكات الذكاء الاصطناعي.",
  sources: "أضف مرجعًا موثوقًا واحدًا على الأقل (Article.citation).",
  faq: "أضف 3+ أسئلة شائعة لتفعيل FAQPage Rich Result.",
  readability_ar: "قسّم الجمل الطويلة واستخدم عناوين فرعية H2/H3.",
  readability_en: "Break long sentences, add H2/H3 subheadings.",
  eeat: "حسّن EEAT: bio + مصادر + روابط داخلية + FAQ + تاريخ مراجعة.",
  ymyl_author_bio: "محتوى YMYL يستلزم نبذة كاتب موثّقة بالخبرة.",
  ymyl_sources: "محتوى YMYL يستلزم مصادر علمية موثّقة.",
  ymyl_last_reviewed: "أضف تاريخ مراجعة حديث لمحتوى YMYL.",
};

function tip(field: string): string {
  return SUGGESTIONS[field] ?? SUGGESTIONS[field.replace(/_(ar|en)$/, "")] ?? "راجع هذا الحقل قبل النشر.";
}

function IssueRow({ issue }: { issue: GuardIssue }) {
  const Icon = issue.level === "error" ? XCircle : AlertTriangle;
  const color = issue.level === "error" ? "text-destructive" : "text-amber-500";
  return (
    <li className="flex gap-2 rounded-md border border-border/60 bg-surface/40 p-2.5 text-sm">
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${color}`} />
      <div className="flex-1">
        <div className="font-medium">{issue.message}</div>
        <div className="mt-0.5 flex items-start gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="mt-0.5 h-3 w-3 shrink-0" />
          <span>{tip(issue.field)}</span>
        </div>
      </div>
    </li>
  );
}

export function PublishGuardPanel({ input }: { input: GuardInput }) {
  const guard = useMemo(() => evaluatePublishGuard(input), [input]);
  const verdict = guard.ok ? (guard.warnings.length === 0 ? "ready" : "ready-warn") : "blocked";
  const verdictBadge =
    verdict === "ready" ? { label: "جاهز للنشر", variant: "default" as const, icon: CheckCircle2 } :
    verdict === "ready-warn" ? { label: `يمكن النشر مع تحذيرات (${guard.warnings.length})`, variant: "secondary" as const, icon: AlertTriangle } :
    { label: `النشر متعذّر (${guard.blockers.length})`, variant: "destructive" as const, icon: XCircle };
  const V = verdictBadge.icon;

  return (
    <Card className="space-y-4 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-semibold">حارس جودة النشر</h3>
        </div>
        <Badge variant={verdictBadge.variant} className="gap-1">
          <V className="h-3.5 w-3.5" />
          {verdictBadge.label}
        </Badge>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>جودة المحتوى الإجمالية</span>
          <span className="font-mono">{guard.score}/100</span>
        </div>
        <Progress value={guard.score} className="h-2" />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-md border border-border/60 p-2">
          <div className="text-muted-foreground">Readability</div>
          <div className="font-mono text-sm">{Math.round((guard.readability.ar + guard.readability.en) / 2) || 0}</div>
        </div>
        <div className="rounded-md border border-border/60 p-2">
          <div className="text-muted-foreground">EEAT</div>
          <div className="font-mono text-sm">{guard.eeat}</div>
        </div>
        <div className={`rounded-md border p-2 ${guard.ymyl ? "border-amber-500/40 bg-amber-500/5" : "border-border/60"}`}>
          <div className="text-muted-foreground">YMYL</div>
          <div className="font-mono text-sm">{guard.ymyl ? "نعم" : "لا"}</div>
        </div>
      </div>

      {guard.blockers.length > 0 && (
        <div>
          <div className="mb-2 text-xs font-semibold text-destructive">عناصر تمنع النشر ({guard.blockers.length})</div>
          <ul className="space-y-1.5">
            {guard.blockers.map((b, i) => <IssueRow key={`b-${i}`} issue={b} />)}
          </ul>
        </div>
      )}

      {guard.warnings.length > 0 && (
        <div>
          <div className="mb-2 text-xs font-semibold text-amber-500">تحذيرات قبل النشر ({guard.warnings.length})</div>
          <ul className="space-y-1.5">
            {guard.warnings.map((w, i) => <IssueRow key={`w-${i}`} issue={w} />)}
          </ul>
        </div>
      )}

      {guard.ok && guard.warnings.length === 0 && (
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs text-emerald-700 dark:text-emerald-400">
          ممتاز — كل عناصر السيو والـ EEAT والـ Schema جاهزة. يمكنك النشر بثقة.
        </div>
      )}
    </Card>
  );
}