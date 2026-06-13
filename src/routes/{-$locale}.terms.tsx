import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { buildSeoMeta, buildSeoLinks, jsonLdScript, breadcrumbLd } from "@/lib/seo";

export const Route = createFileRoute("/{-$locale}/terms")({
  head: ({ params }) => {
    const locale = (params.locale ?? "ar") as "ar" | "en";
    const isAr = locale === "ar";
    const title = isAr
      ? "الشروط والأحكام | فكرة للتسويق الرقمي"
      : "Terms & Conditions | Fikra Digital Marketing";
    const description = isAr
      ? "نطاق خدمات فكرة، الاستشارات، الدفع، مسؤولية الميزانية الإعلانية، التقارير، الملكية الفكرية، السرية، وحدود المسؤولية."
      : "Scope of Fikra services, consultations, payments, ad budget responsibility, reporting, IP, confidentiality, and liability limits.";
    const path = locale === "ar" ? "/terms" : "/en/terms";
    return {
      meta: buildSeoMeta({ title, description, path, locale }),
      links: buildSeoLinks({ path, locale }),
      scripts: [
        jsonLdScript(breadcrumbLd([
          { name: isAr ? "الرئيسية" : "Home", url: locale === "ar" ? "/" : "/en" },
          { name: isAr ? "الشروط والأحكام" : "Terms", url: path },
        ])),
      ],
    };
  },
  component: TermsPage,
});

function TermsPage() {
  const { locale } = Route.useParams();
  const isAr = (locale ?? "ar") === "ar";
  const updated = "2026-06-13";

  if (!isAr) {
    return (
      <SiteLayout>
        <article className="container-app section prose prose-slate dark:prose-invert max-w-3xl">
          <Breadcrumbs trail={[{ label: "Terms & Conditions" }]} />
          <h1>Terms &amp; Conditions</h1>
          <p className="text-sm text-muted-foreground">Last updated: {updated}</p>
          <p>These Terms govern your use of fikradm.lovable.app and any engagement with Fikra Digital Marketing.</p>
          <h2>1. Scope of services</h2>
          <p>Fikra provides digital marketing services including SEO, paid media, content, creative, websites, and CRM enablement. The exact scope of any engagement is defined in a signed proposal or SOW.</p>
          <h2>2. Consultations and proposals</h2>
          <p>Free strategy calls are non-binding. Proposals are valid for 14 days unless stated otherwise.</p>
          <h2>3. Payments and billing</h2>
          <p>Fees, milestones, and currency are defined in the SOW. Late payments may pause delivery until settled.</p>
          <h2>4. Ad budget responsibility</h2>
          <p>Advertising spend (Google, Meta, TikTok, etc.) is paid by the client to the platform, not to Fikra, unless otherwise agreed in writing. Fikra is not liable for platform billing disputes.</p>
          <h2>5. Third-party platforms</h2>
          <p>Performance and availability depend on third-party platforms (Google, Meta, Salla, Shopify, etc.). Fikra is not responsible for outages or policy changes outside its control.</p>
          <h2>6. No guaranteed results</h2>
          <p>No agency can guarantee specific rankings, ROAS, or revenue outcomes. Fikra commits to documented methodology, KPI targets, and transparent reporting — not fixed results.</p>
          <h2>7. Reporting</h2>
          <p>Reporting cadence (weekly/monthly) and KPIs are agreed per engagement.</p>
          <h2>8. Intellectual property</h2>
          <p>Deliverables paid for in full transfer to the client upon settlement. Fikra retains the right to display non-confidential work in its portfolio unless agreed otherwise.</p>
          <h2>9. Confidentiality</h2>
          <p>Both parties commit to protecting confidential business information shared during the engagement.</p>
          <h2>10. Limitation of liability</h2>
          <p>Fikra’s aggregate liability for any claim is limited to fees paid in the three (3) months preceding the claim.</p>
          <h2>11. Cancellation</h2>
          <p>Either party may terminate with 30 days written notice. Outstanding work performed up to termination is billable.</p>
          <h2>12. Governing law</h2>
          <p>These terms are governed by the laws of the Kingdom of Saudi Arabia. Final wording is reviewed by qualified counsel.</p>
          <h2>13. Contact</h2>
          <p>Riyadh, Saudi Arabia — <a href="tel:+966569629773" dir="ltr">+966 56 962 9773</a> — <a href="mailto:hello@fikra.sa">hello@fikra.sa</a></p>
          <p className="text-xs text-muted-foreground">This document is provided for transparency and is not legal advice.</p>
        </article>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <article className="container-app section prose prose-slate dark:prose-invert max-w-3xl">
        <Breadcrumbs trail={[{ label: "الشروط والأحكام" }]} />
        <h1>الشروط والأحكام</h1>
        <p className="text-sm text-muted-foreground">آخر تحديث: {updated}</p>
        <p>تنظم هذه الشروط استخدامك لموقع fikradm.lovable.app وأي تعامل مع <strong>فكرة للتسويق الرقمي</strong>.</p>

        <h2>١. نطاق الخدمات</h2>
        <p>تقدم فكرة خدمات التسويق الرقمي بما يشمل: تحسين محركات البحث (SEO)، الإعلانات الممولة، المحتوى، الهوية والإبداع، المواقع والصفحات، وتكامل CRM. يُحدَّد نطاق كل ارتباط تجاري في عرض/عقد موقّع (SOW).</p>

        <h2>٢. الاستشارات والعروض</h2>
        <p>الجلسات الاستشارية المجانية غير ملزمة. تكون العروض المقدمة سارية لمدة <strong>14 يومًا</strong> ما لم يُذكر خلاف ذلك.</p>

        <h2>٣. الدفع والفوترة</h2>
        <p>تُحدَّد الأتعاب والمراحل والعملة في العقد. قد يُعلَّق التنفيذ في حال تأخر السداد حتى التسوية.</p>

        <h2>٤. مسؤولية الميزانية الإعلانية</h2>
        <p>يتحمل العميل دفع ميزانية الإعلانات (Google، Meta، TikTok، …) مباشرة للمنصة وليس لفكرة، ما لم يُتفق على ذلك خطيًا. لا تتحمل فكرة أي مسؤولية تجاه نزاعات الفوترة مع المنصات.</p>

        <h2>٥. المنصات الخارجية</h2>
        <p>يعتمد الأداء على منصات خارجية (Google، Meta، سلة، Shopify …). فكرة غير مسؤولة عن أي أعطال أو تغييرات في سياسات هذه المنصات خارج نطاق تحكمها.</p>

        <h2>٦. لا توجد ضمانات نتائج</h2>
        <p>
          لا يمكن لأي وكالة ضمان ترتيب محدد في محركات البحث أو ROAS أو حجم مبيعات بعينه. تلتزم فكرة بـ:
        </p>
        <ul>
          <li>منهجية موثقة.</li>
          <li>مؤشرات أداء (KPIs) متفق عليها.</li>
          <li>تقارير شفافة دورية.</li>
        </ul>
        <p>وليس بنتائج ثابتة مضمونة. تختلف النتائج حسب الميزانية، السوق، جودة العرض، سرعة المتابعة، وقوة المنتج.</p>

        <h2>٧. التقارير</h2>
        <p>تُتفق دورية التقارير (أسبوعية/شهرية) ومؤشرات الأداء لكل ارتباط على حدة.</p>

        <h2>٨. الملكية الفكرية</h2>
        <p>تنتقل ملكية المخرجات المدفوعة بالكامل إلى العميل عند السداد. تحتفظ فكرة بحق عرض الأعمال غير السرية في معرض أعمالها ما لم يُتفق خلاف ذلك.</p>

        <h2>٩. السرية</h2>
        <p>يلتزم الطرفان بحماية المعلومات التجارية السرية المتبادلة خلال فترة التعاون.</p>

        <h2>١٠. حدود المسؤولية</h2>
        <p>تقتصر المسؤولية الإجمالية لفكرة عن أي مطالبة على ما تم دفعه من أتعاب خلال الثلاثة (٣) أشهر السابقة للمطالبة.</p>

        <h2>١١. الإلغاء</h2>
        <p>يحق لأي طرف إنهاء التعاقد بإشعار خطي قبل <strong>30 يومًا</strong>. تُحتسب الأعمال المنجزة حتى تاريخ الإنهاء.</p>

        <h2>١٢. القانون الحاكم</h2>
        <p>تخضع هذه الشروط لأنظمة المملكة العربية السعودية، وتُراجَع الصياغة النهائية من مستشار قانوني مختص.</p>

        <h2>١٣. التواصل</h2>
        <p>
          الرياض، المملكة العربية السعودية —{" "}
          <a href="tel:+966569629773" dir="ltr">+966 56 962 9773</a> —{" "}
          <a href="mailto:hello@fikra.sa">hello@fikra.sa</a>
        </p>

        <p className="text-xs text-muted-foreground">
          هذه الوثيقة تُقدَّم لأغراض الشفافية ولا تُعد استشارة قانونية. تخضع الصياغة النهائية لمراجعة مستشار قانوني مختص.
        </p>
      </article>
    </SiteLayout>
  );
}