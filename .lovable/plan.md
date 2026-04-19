# خطة بناء CMS كامل لموقع فكرة (Phase 2 — Backend & Builder)

> **الهدف:** لوحة تحكم احترافية تتحكم في كل تفاصيل الموقع (الصفحة الرئيسية، الخدمات، الصناعات، About، Contact، Locations) مع Block Builder بـ drag-and-drop، Tiptap editor، SEO panel متقدم، وداشبورد analytics تفاعلية.
>
> **خارج النطاق:** المقالات (تفضل بالكود الحالي/Static).

---

## 🏗️ المعمارية العامة

```
┌────────────────── Lovable Cloud (Supabase) ──────────────────┐
│  Auth (admins) │ Database │ Storage │ Edge Funcs (analytics) │
└──────────────────────────────────────────────────────────────┘
            ▲                                  ▲
            │                                  │
   Public Site (DB-driven)          /admin Dashboard (drag-drop)
```

---

## 📅 المراحل (6 مراحل، كل واحدة قابلة للتنفيذ مستقلة)

### **Phase 1 — البنية الأساسية (Auth + Schema + Admin Shell)**

#### 1.1 تفعيل Lovable Cloud
- Auth: email/password (Google لاحقاً لو لزم)
- Storage bucket `cms-uploads` (public read, authenticated write)

#### 1.2 Database Schema
- `app_role` enum: `admin | editor | viewer`
- `user_roles` (منفصل عن profiles لتجنب privilege escalation) + `has_role()` SECURITY DEFINER function
- `pages` — slug, locale, page_type, parent_slug, title, status, SEO meta (meta_title, meta_description, og_image_url, canonical_url, keywords[], no_index), `blocks jsonb`, audit fields
- `page_revisions` — تاريخ نسخ كامل للتراجع
- `shared_blocks` — بلوكات معاد استخدامها (Trusted by, Testimonials)
- `media_library` — كل الـ uploads مع alt text، dimensions
- `page_views` — analytics (page_slug, locale, referrer, UA, country, device, session)
- `form_submissions` — رسائل الفورم contact/lead

#### 1.3 RLS Policies
- `pages`: read public لـ published، write لـ admin/editor
- باقي الجداول الإدارية: admin/editor فقط
- `page_views` & `form_submissions`: insert public، select admin

#### 1.4 Admin Shell
- `/admin` route محمي بـ `_authenticated` + `has_role`
- Sidebar: Dashboard, Pages, Media, Forms, Settings, Users
- Responsive (desktop sidebar, mobile drawer)

#### 1.5 Login & First Admin
- `/admin/login`
- أول signup يبقى admin تلقائياً (لو الجدول فاضي)

---

### **Phase 2 — Block System & Renderer**

#### 2.1 Block Registry (`src/cms/blocks/registry.ts`)
كل بلوك له: `component, editor, schema (zod), label, icon, defaultData`.

البلوكات المخططة:
- Layout: `hero`, `service_hero`, `cta_band`, `spacer`, `rich_text`, `custom_html`
- Content: `stats`, `services_grid`, `packages`, `before_after`, `showcase`, `industries`, `process`, `faq`
- Social proof: `testimonials`, `logos_strip`
- Service-specific: `service_approach`, `service_results`, `service_market_signals`

#### 2.2 Block Schema المشترك
```ts
type BlockInstance = {
  id: string;
  type: keyof typeof BLOCK_REGISTRY;
  data: Record<string, unknown>;
  visible: boolean;
  settings?: { paddingY?, background?, container? };
};
```

#### 2.3 Public Renderer
`<BlockRenderer blocks={page.blocks} locale={locale} />` — كل بلوك ملفوف بـ `<Reveal>`.

#### 2.4 Dynamic Routes
- استبدال `$locale.index.tsx`, `about`, `contact`, `services.$slug`, إلخ بـ DB loader
- Fallback للـ static data القديمة لو الصفحة مش موجودة في DB
- SEO meta من `page.meta_*`
- 404 لو غير موجودة أو draft

#### 2.5 Migration Script
سكريبت لمرة واحدة يحوّل `src/content/data.ts` لـ rows في `pages`.

---

### **Phase 3 — Block Builder (Drag & Drop)**

#### 3.1 المكتبات
`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `react-hook-form`, `zod`, `@tanstack/react-query`.

#### 3.2 صفحة `/admin/pages/[id]/edit` — 3 أعمدة

| Block Library (left) | Live Canvas (center) | Inspector (right) |
|---|---|---|
| Search + categorized | Sortable, click to select | Form للبلوك المختار |
| Drag to canvas | Hover toolbar (move/dup/del/hide) | Tabs: Content/Style/Visibility/SEO |

#### 3.3 مزايا الـ Canvas
- Real preview، Inline editing، Undo/Redo (last 50)، Device preview (Desktop/Tablet/Mobile)، Locale switcher (AR/EN)، Auto-save (30s) + Publish + Preview، Revision history.

#### 3.4 Block Inspector
Tabs: **Content** | **Style** (padding, bg, container) | **Visibility** (mobile/desktop, schedule) | **Advanced** (id, custom class)

---

### **Phase 4 — Tiptap Editor + SEO Panel**

#### 4.1 Tiptap
**Extensions:** StarterKit, Link, Image, Table, TaskList, Highlight, Underline, TextAlign, Color, FontFamily, Placeholder, CharacterCount, CodeBlockLowlight, Typography. Custom: MediaPicker, ButtonNode, EmbedNode.

**Toolbar:** كل التنسيقات + headings + lists + tables + alignment + colors + markdown shortcuts + RTL/LTR.

#### 4.2 SEO Panel (4 tabs)
1. **Basic:** meta title/desc (counters), URL slug, focus keyword, secondary keywords
2. **Social (OG):** OG title/desc/image, Twitter card type
3. **Advanced:** canonical, noindex/nofollow, JSON-LD (auto + editable)
4. **SEO Analysis (real-time):**
   - Title/desc length checks
   - Focus keyword in title/H1/first paragraph/URL
   - H1 count, internal/external links count
   - Images without alt
   - Word count, readability (Flesch simplified)
   - Keyword density (0.5-3%)
   - **Score 0-100** + suggestions

#### 4.3 SEO Live Preview
Google SERP + Facebook + Twitter card previews live.

---

### **Phase 5 — Dashboard & Analytics**

#### 5.1 Tracker
Edge function أو client beacon → page_view كل route change. يحسب: slug, locale, referrer, country (Cloudflare headers), device, session_id (cookie). Bot filtering. GDPR friendly.

#### 5.2 `/admin/dashboard`
- **Cards:** total visitors (30d) + sparkline + %∆, page views, avg pages/session, form submissions, top page
- **Charts:** visitors over time (line), top pages (bar), traffic sources (pie), device (donut), locale split, top countries
- **Live activity:** آخر 10 زوّار + آخر 10 form submissions
- **Quick actions:** Edit homepage, Create page, Pending submissions

#### 5.3 Pages list / Forms inbox / Media library / Users / Settings
كل واحدة بصفحة مستقلة بـ CRUD كامل.

---

### **Phase 6 — Polish, Performance & QA**
React Query caching، optimistic updates، image webp variants، SSR، Postgres FTS search، backup/restore JSON، audit log، keyboard shortcuts، responsive admin، accessibility، inline help.

---

## 📦 المكتبات المطلوبة

```
@dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
@tiptap/react @tiptap/starter-kit
@tiptap/extension-link @tiptap/extension-image
@tiptap/extension-table @tiptap/extension-table-row
@tiptap/extension-table-cell @tiptap/extension-table-header
@tiptap/extension-text-align @tiptap/extension-color
@tiptap/extension-text-style @tiptap/extension-underline
@tiptap/extension-highlight @tiptap/extension-placeholder
@tiptap/extension-character-count @tiptap/extension-typography
@tanstack/react-query react-hook-form @hookform/resolvers zod
recharts date-fns
```

---

## ⏱️ تقدير الوقت

| Phase | الحجم | تقدير |
|---|---|---|
| 1. Foundation | متوسط | 1 يوم |
| 2. Block System + Renderer | كبير | 2-3 أيام |
| 3. Drag-Drop Builder | كبير جداً | 3-4 أيام |
| 4. Tiptap + SEO | كبير | 2 أيام |
| 5. Dashboard + Analytics | كبير | 2-3 أيام |
| 6. Polish | متوسط | 1-2 يوم |
| **Total** | | **~12-15 يوم شغل** |

---

## 🚦 الخطوة التالية
لو الخطة موافق عليها → نبدأ **Phase 1** فوراً:
1. تفعيل Lovable Cloud
2. كل الـ schema (migration واحدة)
3. `/admin/login` و layout dashboard
4. First-admin auto-bootstrap
