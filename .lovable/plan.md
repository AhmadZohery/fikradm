## الهدف
تنفيذ 4 منظومات متكاملة: نموذج طلب عرض سعر ذكي + Dashboard إداري + مراقبة SEO Decay + تحسين Core Web Vitals.

---

## 1) نموذج Multi-Step Quote Request مع UTM

**الواجهة (`/quote` + Drawer قابل للفتح من أي CTA):**
- 4 خطوات: (1) نوع الخدمة → (2) تفاصيل المشروع (حقول شرطية حسب الخدمة) → (3) الميزانية والجدول الزمني → (4) بيانات التواصل
- Progress bar + حفظ تلقائي في `localStorage` (استرجاع تلقائي)
- Validation بـ Zod على كل خطوة قبل الانتقال
- حقول شرطية: مثلاً لو اختار "تطوير متجر" يظهر اختيار المنصة (سلة/زد/شوبيفاي/مخصص)، لو SEO يظهر "الموقع الحالي" و"الكلمات المستهدفة"

**UTM Tracking:**
- Hook `useUtmCapture` يلتقط `utm_source/medium/campaign/term/content` + `gclid/fbclid` من URL ويحفظها في `sessionStorage` + cookie لمدة 30 يوم
- يُرفق تلقائياً مع كل submission + referrer + landing_page + device

**Backend:**
- Server Function `submitQuoteRequest` (createServerFn) → `form_submissions` table (موجود) مع `form_type='quote_request'` و `payload` JSON يحوي كل الحقول + UTM
- Anti-spam: honeypot field + rate limit بسيط (IP-based via cookie)
- Toast نجاح + redirect لصفحة شكر `/thank-you`

---

## 2) Admin Dashboard (`/admin/dashboard`)

تحت `_authenticated` بصلاحية staff (موجود `is_staff`).

**Cards علوية:**
- إجمالي Leads هذا الشهر / الشهر الماضي (مع % تغيير)
- Conversion Rate تقديري
- متوسط Lead Score
- Active Pages count

**Sections:**
1. **Leads by Source** — Pie/Donut chart حسب `utm_source` (Organic/Paid/Direct/Social/Referral)
2. **Top Performing Services** — Bar chart: عدد الـ leads لكل خدمة
3. **Top Pages** — جدول: أعلى الصفحات زيارةً من `page_views` (موجود) مع views/unique/bounce
4. **CTR Trends** — Line chart 30/90 يوم (من بيانات GSC المخزنة)
5. **Monthly Report** — زر "تصدير PDF/CSV" للتقرير الشهري

**Data Sources:**
- `form_submissions` (Leads) — group by utm + service
- `page_views` (Top pages + trends)
- جدول جديد `seo_metrics` لتخزين snapshots من GSC (يومي عبر cron)

استخدام Recharts (موجود في shadcn).

---

## 3) SEO Decay Monitoring

**جدول جديد `seo_metrics`:**
```
id, url, date, impressions, clicks, ctr, position,
captured_at
UNIQUE(url, date)
```

**جدول `seo_alerts`:**
```
id, url, alert_type (rank_drop|stale_content|high_impressions_low_ctr),
severity, details JSONB, status (open|acknowledged|resolved), created_at
```

**Cron Job (pg_cron يومي 3 صباحاً):**
يستدعي `/api/public/cron/seo-decay-scan` الذي:
1. يقارن آخر 7 أيام بـ 28 يوم سابقة لكل URL
2. لو position نزل بـ 3+ مراكز → alert `rank_drop`
3. لو blog_post.updated_at > 6 شهور وله traffic → alert `stale_content`
4. لو impressions > 100 و CTR < 1% → alert `high_impressions_low_ctr`

**واجهة `/admin/seo-decay`:**
- 3 tabs (Rank Drops / Stale Content / Low CTR)
- لكل alert: URL + المقاييس + زر "Mark Resolved" + اقتراح إجراء

**ملاحظة:** بيانات GSC الحقيقية تتطلب ربط Google Search Console connector. سأبني المنظومة كاملة وأترك adapter جاهز للربط لاحقاً، مع إمكانية إدخال يدوي عبر CSV import.

---

## 4) Core Web Vitals Optimization

**تحسينات الكود:**
- إضافة `loading="lazy"` و `decoding="async"` لكل الصور غير الـ above-the-fold
- `fetchpriority="high"` للـ LCP image في الـ Hero + preload في `head()`
- استخدام `vite-imagetools` للصور المحلية → AVIF/WebP variants
- Cache headers في server routes للأصول الثابتة
- Code splitting إضافي للروتس الثقيلة

**Web Vitals Tracking:**
- مكتبة `web-vitals` تجمع LCP/CLS/INP/FCP/TTFB من زوار حقيقيين
- إرسالها إلى `/api/public/vitals` → جدول جديد `web_vitals`
- صفحة `/admin/performance` تعرض:
  - متوسط/p75/p95 لكل metric لآخر 7/30 يوم
  - Trend line قبل/بعد كل deployment
  - أبطأ 10 صفحات
  - زر "Take Snapshot" لحفظ baseline يدوي قبل أي تغيير كبير

**جدول `web_vitals`:**
```
id, url, metric (LCP|CLS|INP|FCP|TTFB), value, rating, 
device, deployment_id, created_at
```

**جدول `performance_snapshots`:**
```
id, label, notes, metrics JSONB, created_by, created_at
```

---

## التقنيات والملفات الرئيسية

**Migrations جديدة:**
- `seo_metrics`, `seo_alerts`, `web_vitals`, `performance_snapshots`
- مع GRANTs + RLS (staff فقط للقراءة، service_role للكتابة)
- pg_cron job للـ SEO decay scan

**Server Functions:**
- `src/lib/quote.functions.ts` — `submitQuoteRequest`
- `src/lib/dashboard.functions.ts` — `getDashboardMetrics`, `getLeadsBySource`, `getTopPages`, `getCtrTrends`
- `src/lib/seo-decay.functions.ts` — `getSeoAlerts`, `resolveAlert`, `importGscCsv`
- `src/lib/performance.functions.ts` — `recordVital`, `getVitalsSummary`, `createSnapshot`

**Server Routes (public):**
- `/api/public/vitals` POST — يستقبل web-vitals من المتصفح
- `/api/public/cron/seo-decay-scan` POST — يستدعيه pg_cron

**Components:**
- `QuoteFormDrawer` + 4 step components
- `useUtmCapture` hook
- `DashboardOverview`, `LeadsBySourceChart`, `TopPagesTable`, `CtrTrendsChart`
- `SeoDecayPanel`, `AlertCard`
- `PerformancePanel`, `VitalsChart`, `SnapshotsList`
- `WebVitalsReporter` (mounted في `__root.tsx`)

**Routes:**
- `/quote`, `/thank-you`
- `/_authenticated/admin/dashboard`
- `/_authenticated/admin/seo-decay`
- `/_authenticated/admin/performance`

**حزم جديدة:** `web-vitals`, `recharts` (موجودة غالباً)، `date-fns` (موجودة)

---

## خطة التنفيذ على دفعات
1. **Migration واحدة** بكل الجداول الجديدة + GRANTs + RLS
2. **Quote form** كاملاً (Drawer + steps + UTM + server fn)
3. **Web Vitals Reporter** + route عام + تحسينات الصور/preload
4. **Dashboard** + sub-routes تحت `_authenticated/admin/`
5. **SEO Decay** + cron + CSV import

كل دفعة قابلة للاختبار منفصلة، ولن تكسر بعضها.