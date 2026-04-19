import { useLocale } from "@/i18n/useLocale";
import { SectionEyebrow } from "./cinematic/SectionEyebrow";
import { VideoEmbed } from "./cinematic/VideoEmbed";
import { Quote } from "lucide-react";

const VIDEOS = [
  {
    youtubeId: "",
    nameAr: "خالد العتيبي",
    nameEn: "Khalid Al-Otaibi",
    roleAr: "مؤسس Luxe & Co",
    roleEn: "Founder, Luxe & Co",
    quoteAr: "نمو 240% خلال 6 شهور — وأخيراً فهمت لماذا التسويق الاحترافي يستحق.",
    quoteEn: "240% growth in 6 months — finally I understand why pro marketing is worth it.",
  },
  {
    youtubeId: "",
    nameAr: "نوف الزهراني",
    nameEn: "Nouf Al-Zahrani",
    roleAr: "مدير تسويق سلسلة عيادات",
    roleEn: "Marketing Director, Clinic Network",
    quoteAr: "ROAS 5.8x مع شفافية كاملة. الفرق ملحوظ من اليوم الأول.",
    quoteEn: "5.8x ROAS with full transparency. The difference was clear from day one.",
  },
  {
    youtubeId: "",
    nameAr: "محمد القرني",
    nameEn: "Mohammed Al-Qarni",
    roleAr: "Co-founder عقاري",
    roleEn: "Co-founder, Real Estate",
    quoteAr: "الموقع الجديد ضاعف الحجوزات ثلاث مرات. تجربة استثنائية.",
    quoteEn: "Our new site tripled bookings. An exceptional experience.",
  },
];

export function HomeVideoTestimonials() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  return (
    <section className="section relative overflow-hidden">
      <div className="container-app">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <SectionEyebrow>{isAr ? "بصوت العملاء" : "In their words"}</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">
              {isAr ? (
                <>
                  شهادات
                  <span className="marker-line px-2"> فيديو </span>
                  من عملاء حقيقيين
                </>
              ) : (
                <>
                  Real <span className="marker-line px-2">video testimonials</span> from clients
                </>
              )}
            </h2>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            {isAr
              ? "اضغط على أي فيديو لتسمع القصة كاملة — بدون سيناريو."
              : "Tap any video to hear the full unscripted story."}
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {VIDEOS.map((v, i) => (
            <div key={i} className="group">
              <VideoEmbed
                youtubeId={v.youtubeId || undefined}
                title={isAr ? v.nameAr : v.nameEn}
                ratio="vertical"
                className="md:aspect-[3/4]"
              />
              <div className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-card">
                <Quote className="h-5 w-5 text-primary" />
                <p className="mt-2 text-sm leading-relaxed text-foreground">
                  "{isAr ? v.quoteAr : v.quoteEn}"
                </p>
                <div className="mt-3 border-t border-border pt-3">
                  <div className="text-sm font-bold text-ink">{isAr ? v.nameAr : v.nameEn}</div>
                  <div className="text-xs text-muted-foreground">{isAr ? v.roleAr : v.roleEn}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
