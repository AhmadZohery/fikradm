import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { buildSeoMeta, buildSeoLinks, jsonLdScript, breadcrumbLd } from "@/lib/seo";

export const Route = createFileRoute("/{-$locale}/privacy")({
  head: ({ params }) => {
    const locale = (params.locale ?? "ar") as "ar" | "en";
    const isAr = locale === "ar";
    const title = isAr
      ? "سياسة الخصوصية | فكرة للتسويق الرقمي"
      : "Privacy Policy | Fikra Digital Marketing";
    const description = isAr
      ? "كيف تجمع فكرة بيانات الزوار والعملاء، وكيف تُستخدم في النماذج والتحليلات والتسويق، وحقوقك في الوصول والحذف وفق نظام حماية البيانات الشخصية في السعودية (PDPL)."
      : "How Fikra collects, uses, and protects visitor and client data across forms, analytics, and marketing — including your access and deletion rights under Saudi PDPL.";
    const path = locale === "ar" ? "/privacy" : "/en/privacy";
    return {
      meta: buildSeoMeta({ title, description, path, locale }),
      links: buildSeoLinks({ path: locale === "ar" ? "/privacy" : "/en/privacy", locale }),
      scripts: [
        jsonLdScript(breadcrumbLd([
          { name: isAr ? "الرئيسية" : "Home", url: locale === "ar" ? "/" : "/en" },
          { name: isAr ? "سياسة الخصوصية" : "Privacy Policy", url: path },
        ])),
      ],
    };
  },
  component: PrivacyPage,
});

function PrivacyPage() {
  const { locale } = Route.useParams();
  const isAr = (locale ?? "ar") === "ar";
  const updated = "2026-06-13";

  if (!isAr) {
    return (
      <SiteLayout>
        <article className="container-app section prose prose-slate dark:prose-invert max-w-3xl">
          <Breadcrumbs trail={[{ label: "Privacy Policy" }]} />
          <h1>Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: {updated}</p>
          <p>
            This policy describes how Fikra Digital Marketing (“Fikra”, “we”) collects, uses, and
            protects personal data of website visitors and clients. By using fikradm.lovable.app you
            consent to the practices described here.
          </p>
          <h2>1. Data we collect</h2>
          <ul>
            <li>Form data: name, business email, phone number, company, service interest, budget range, and any message you submit.</li>
            <li>Technical data: IP address, browser type, device, referring URL, pages viewed, time on page.</li>
            <li>Marketing data: UTM parameters, ad click identifiers, and conversion events.</li>
            <li>Cookies and similar technologies used by analytics and advertising pixels.</li>
          </ul>
          <h2>2. How we use data</h2>
          <ul>
            <li>Respond to consultation requests and prepare proposals.</li>
            <li>Improve site content, performance, and conversion paths.</li>
            <li>Measure marketing performance and attribution.</li>
            <li>Comply with legal and contractual obligations.</li>
          </ul>
          <h2>3. Sharing</h2>
          <p>We may share data with processors that operate our infrastructure (hosting, analytics, email, CRM). We do not sell personal data.</p>
          <h2>4. Retention</h2>
          <p>Lead data is retained for as long as needed to follow up and meet legal obligations, then deleted or anonymized.</p>
          <h2>5. Your rights</h2>
          <p>You can request access, correction, or deletion of your personal data, and object to certain processing, by emailing <a href="mailto:hello@fikra.sa">hello@fikra.sa</a>. Saudi residents have additional rights under the Personal Data Protection Law (PDPL).</p>
          <h2>6. Contact</h2>
          <p>Fikra Digital Marketing — Riyadh, Saudi Arabia. Phone: <a href="tel:+966569629773" dir="ltr">+966 56 962 9773</a>.</p>
          <p className="text-xs text-muted-foreground">This document is provided for transparency and is not legal advice. Final terms should be reviewed by qualified counsel.</p>
        </article>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <article className="container-app section prose prose-slate dark:prose-invert max-w-3xl">
        <Breadcrumbs trail={[{ label: "سياسة الخصوصية" }]} />
        <h1>سياسة الخصوصية</h1>
        <p className="text-sm text-muted-foreground">آخر تحديث: {updated}</p>
        <p>
          توضح هذه السياسة كيف تقوم <strong>فكرة للتسويق الرقمي</strong> (يشار إليها بـ "فكرة"
          أو "نحن") بجمع البيانات الشخصية للزوار والعملاء، وكيف تُستخدم وتُحمى. باستخدامك
          للموقع فإنك توافق على الممارسات الموضحة هنا.
        </p>

        <h2>١. البيانات التي نجمعها</h2>
        <ul>
          <li>بيانات النماذج: الاسم، البريد الإلكتروني للعمل، رقم الجوال، اسم الشركة، الخدمة المطلوبة، الميزانية التقريبية، ونص الرسالة.</li>
          <li>بيانات تقنية: عنوان IP، نوع المتصفح والجهاز، الرابط المُحيل، الصفحات التي تمت زيارتها، ووقت التصفح.</li>
          <li>بيانات التسويق: معاملات UTM، معرفات النقر الإعلاني، وأحداث التحويل.</li>
          <li>ملفات تعريف الارتباط (Cookies) والبكسلات التي تستخدمها أدوات التحليل والإعلان.</li>
        </ul>

        <h2>٢. كيف نستخدم البيانات</h2>
        <ul>
          <li>الرد على طلبات الاستشارة وإعداد العروض المخصصة.</li>
          <li>تحسين محتوى الموقع وسرعته ومسارات التحويل.</li>
          <li>قياس أداء الحملات التسويقية والإسناد (Attribution).</li>
          <li>الالتزام بالواجبات القانونية والتعاقدية.</li>
        </ul>

        <h2>٣. مشاركة البيانات</h2>
        <p>
          قد نشارك البيانات مع مزودي خدمات يقومون بتشغيل بنيتنا التقنية (الاستضافة، التحليلات،
          البريد، CRM) وفق اتفاقيات معالجة بيانات. <strong>لا نبيع بياناتك الشخصية لأي طرف ثالث.</strong>
        </p>

        <h2>٤. مدة الاحتفاظ</h2>
        <p>نحتفظ ببيانات الليدز للفترة اللازمة للمتابعة التجارية والوفاء بالالتزامات القانونية، ثم تُحذف أو تُجعل مجهولة الهوية.</p>

        <h2>٥. حقوقك</h2>
        <p>
          يحق لك طلب الوصول إلى بياناتك أو تصحيحها أو حذفها، أو الاعتراض على بعض أنواع المعالجة،
          بمراسلتنا على <a href="mailto:hello@fikra.sa">hello@fikra.sa</a>. للمقيمين في المملكة
          العربية السعودية حقوق إضافية بموجب <strong>نظام حماية البيانات الشخصية (PDPL)</strong>.
        </p>

        <h2>٦. الأمان</h2>
        <p>نطبق إجراءات تقنية وتنظيمية معقولة لحماية البيانات من الفقد أو الوصول غير المصرح به، مع التأكيد أنه لا توجد وسيلة نقل عبر الإنترنت آمنة بنسبة 100%.</p>

        <h2>٧. التواصل</h2>
        <p>
          فكرة للتسويق الرقمي — الرياض، المملكة العربية السعودية.<br />
          الهاتف: <a href="tel:+966569629773" dir="ltr">+966 56 962 9773</a><br />
          البريد: <a href="mailto:hello@fikra.sa">hello@fikra.sa</a>
        </p>

        <p className="text-xs text-muted-foreground">
          هذه الوثيقة تُقدَّم لأغراض الشفافية ولا تُعد استشارة قانونية. تُراجَع الصياغة النهائية من قبل مستشار قانوني مختص.
        </p>
      </article>
    </SiteLayout>
  );
}