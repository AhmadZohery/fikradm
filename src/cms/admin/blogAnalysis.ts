/**
 * Live blog analysis: extract TOC from H2/H3, infer focus keyword
 * from title+content, and compute a Rank-Math-style score 0..100.
 */

export type BlogTocItem = { id: string; level: 2 | 3; label: string };

export type BlogSeoInput = {
  title: string;
  slug: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  bodyHtml: string;
  focusKeyword: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
};

export type BlogCheck = {
  id: string;
  label: string;
  status: "good" | "warn" | "bad";
  hint?: string;
};

export type BlogReport = {
  score: number;
  checks: BlogCheck[];
  wordCount: number;
  readingMinutes: number;
};

const STOP_AR = new Set([
  "في","من","على","إلى","عن","مع","هذا","هذه","ذلك","تلك","التي","الذي","ما","لا","لم","لن","قد",
  "كما","أو","أن","إن","كان","كانت","يكون","هو","هي","نحن","انت","أنت","انتم","أنتم","هم","هن",
  "ثم","حتى","بين","بعد","قبل","عند","لكن","ايضا","أيضا","كل","بعض","غير","فقط","حيث","لذلك",
]);
const STOP_EN = new Set([
  "the","and","for","with","that","this","from","have","has","will","your","you","are","was","were",
  "but","not","can","all","any","our","their","they","them","its","into","over","more","than","when",
  "what","how","why","which","who","there","here","also","just","such","most",
]);

export function stripHtml(html: string): string {
  if (typeof document === "undefined") return html.replace(/<[^>]+>/g, " ");
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent ?? "").replace(/\s+/g, " ").trim();
}

export function slugifyHeading(s: string): string {
  return s
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

/**
 * Extract H2/H3 headings from HTML and ensure each has a stable id
 * (returns the cleaned-up HTML alongside the TOC for storage).
 */
export function extractToc(html: string): { html: string; toc: BlogTocItem[] } {
  if (!html) return { html: "", toc: [] };
  if (typeof document === "undefined") return { html, toc: [] };
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  const used = new Set<string>();
  const toc: BlogTocItem[] = [];
  wrapper.querySelectorAll("h2, h3").forEach((node) => {
    const level = node.tagName === "H2" ? 2 : 3;
    const text = (node.textContent ?? "").trim();
    if (!text) return;
    let id = node.getAttribute("id") || slugifyHeading(text) || `h-${toc.length + 1}`;
    let i = 2;
    while (used.has(id)) id = `${id}-${i++}`;
    used.add(id);
    node.setAttribute("id", id);
    toc.push({ id, level: level as 2 | 3, label: text });
  });
  return { html: wrapper.innerHTML, toc };
}

/**
 * Infer the most likely focus keyword from title + body. Picks the most
 * frequent meaningful 1-2 word phrase, biased by title presence.
 */
export function inferFocusKeyword(title: string, bodyText: string): string {
  const text = `${title} ${title} ${bodyText}`.toLowerCase();
  const words = text
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOP_AR.has(w) && !STOP_EN.has(w));
  const freq = new Map<string, number>();
  for (let i = 0; i < words.length; i++) {
    freq.set(words[i], (freq.get(words[i]) ?? 0) + 1);
    if (i < words.length - 1) {
      const bi = `${words[i]} ${words[i + 1]}`;
      freq.set(bi, (freq.get(bi) ?? 0) + 2);
    }
  }
  let best = "";
  let max = 0;
  freq.forEach((v, k) => {
    if (v > max && k.length > 3) {
      max = v;
      best = k;
    }
  });
  return best;
}

function inc(haystack: string, needle: string): boolean {
  if (!needle) return false;
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

export function analyzeBlog(input: BlogSeoInput): BlogReport {
  const checks: BlogCheck[] = [];
  const text = stripHtml(input.bodyHtml || "");
  const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const readingMinutes = Math.max(1, Math.round(wordCount / 200));
  const kw = (input.focusKeyword || "").trim();

  // Title
  const tlen = (input.metaTitle || input.title || "").length;
  checks.push({
    id: "title_len",
    label: `طول الـ Title (${tlen})`,
    status: tlen === 0 ? "bad" : tlen < 30 || tlen > 60 ? "warn" : "good",
    hint: "المُفضّل 30–60 حرف لظهور كامل في نتائج Google",
  });

  // Description
  const dlen = (input.metaDescription || input.excerpt || "").length;
  checks.push({
    id: "desc_len",
    label: `طول الـ Description (${dlen})`,
    status: dlen === 0 ? "bad" : dlen < 70 || dlen > 160 ? "warn" : "good",
    hint: "70–160 حرف. لا تكرر العنوان حرفياً.",
  });

  // Slug
  const slugOk = /^[a-z0-9-]+$/.test(input.slug || "");
  checks.push({
    id: "slug",
    label: "Slug نظيف",
    status: !input.slug ? "bad" : slugOk ? "good" : "warn",
    hint: "حروف صغيرة وأرقام وشَرْطَة فقط، بدون مسافات",
  });

  // Word count
  checks.push({
    id: "wc",
    label: `عدد الكلمات (${wordCount})`,
    status: wordCount < 300 ? "bad" : wordCount < 600 ? "warn" : "good",
    hint: "≥600 كلمة يفضّلها Google لمواضيع تنافسية",
  });

  // Headings
  const h2 = (input.bodyHtml.match(/<h2/gi) ?? []).length;
  const h3 = (input.bodyHtml.match(/<h3/gi) ?? []).length;
  checks.push({
    id: "headings",
    label: `عناوين فرعية H2:${h2} · H3:${h3}`,
    status: h2 >= 2 ? "good" : h2 >= 1 ? "warn" : "bad",
    hint: "≥2 عناوين H2 لتنظيم المحتوى وتفعيل TOC",
  });

  // Images
  const imgs = (input.bodyHtml.match(/<img\b/gi) ?? []).length;
  const imgsNoAlt = (input.bodyHtml.match(/<img\b(?![^>]*\balt=)/gi) ?? []).length;
  checks.push({
    id: "images",
    label: `صور (${imgs})${imgsNoAlt ? ` · ${imgsNoAlt} بدون alt` : ""}`,
    status: imgs === 0 ? "warn" : imgsNoAlt > 0 ? "warn" : "good",
    hint: "أضف alt وصفي لكل صورة (مفيد للـ SEO وقارئات الشاشة)",
  });

  // Internal links
  const internal = (input.bodyHtml.match(/href=["']\/(?!\/)/gi) ?? []).length;
  checks.push({
    id: "internal_links",
    label: `روابط داخلية (${internal})`,
    status: internal >= 2 ? "good" : internal === 1 ? "warn" : "bad",
    hint: "أضف ≥2 رابط داخلي لمقالات/صفحات ذات صلة",
  });

  // Cover image
  checks.push({
    id: "cover",
    label: "صورة الغلاف",
    status: input.coverImageUrl ? (input.coverImageAlt ? "good" : "warn") : "bad",
    hint: input.coverImageUrl && !input.coverImageAlt ? "أضف نص بديل للغلاف" : "1200×630 يفضل",
  });

  // Focus keyword checks
  if (kw) {
    checks.push({
      id: "kw_title",
      label: "الكلمة المفتاحية في الـ Title",
      status: inc(input.metaTitle || input.title, kw) ? "good" : "warn",
      hint: "ضع الكلمة في بداية العنوان لو ممكن",
    });
    checks.push({
      id: "kw_desc",
      label: "الكلمة المفتاحية في الـ Description",
      status: inc(input.metaDescription || input.excerpt, kw) ? "good" : "warn",
    });
    checks.push({
      id: "kw_slug",
      label: "الكلمة المفتاحية في الـ URL",
      status: inc(input.slug, kw.replace(/\s+/g, "-")) ? "good" : "warn",
    });
    checks.push({
      id: "kw_h",
      label: "الكلمة المفتاحية في عنوان فرعي (H2/H3)",
      status: /<h[23][^>]*>([^<]*)<\/h[23]>/gi.test(input.bodyHtml)
        ? Array.from(input.bodyHtml.matchAll(/<h[23][^>]*>([^<]*)<\/h[23]>/gi)).some((m) =>
            inc(m[1] ?? "", kw),
          )
          ? "good"
          : "warn"
        : "bad",
    });
    const occurrences = (text.toLowerCase().match(new RegExp(escapeRe(kw.toLowerCase()), "g")) ?? [])
      .length;
    const density = wordCount ? (occurrences / wordCount) * 100 : 0;
    checks.push({
      id: "kw_density",
      label: `كثافة الكلمة المفتاحية (${density.toFixed(1)}%)`,
      status: density < 0.5 ? "warn" : density > 3 ? "warn" : "good",
      hint: "0.5%–3% طبيعي. تجنّب الحشو.",
    });
    checks.push({
      id: "kw_intro",
      label: "الكلمة المفتاحية في أول 100 كلمة",
      status: inc(text.split(/\s+/).slice(0, 100).join(" "), kw) ? "good" : "warn",
    });
  } else {
    checks.push({
      id: "kw_missing",
      label: "حدد كلمة مفتاحية أساسية",
      status: "warn",
      hint: "اضغط ‘استنتاج تلقائي’ لاقتراح كلمة من المحتوى",
    });
  }

  // CTR signals: power word in title
  const powerWords = ["أفضل","مجاني","حصري","جديد","سريع","خصم","مضمون","احصل","اكتشف","best","free","new","get","ultimate"];
  const hasPower = powerWords.some((p) => inc(input.metaTitle || input.title, p));
  checks.push({
    id: "ctr_power",
    label: hasPower ? "العنوان به كلمة جاذبة" : "أضف كلمة جاذبة للعنوان",
    status: hasPower ? "good" : "warn",
    hint: "أمثلة: أفضل، مجاني، احصل، best, ultimate",
  });

  const totals = checks.reduce(
    (s, c) => s + (c.status === "good" ? 1 : c.status === "warn" ? 0.5 : 0),
    0,
  );
  const score = Math.round((totals / checks.length) * 100);

  return { score, checks, wordCount, readingMinutes };
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
