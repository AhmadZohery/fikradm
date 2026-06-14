import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

async function callAI(system: string, user: string, json = false) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY not configured");
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (res.status === 429) throw new Error("AI rate limit — حاول لاحقاً");
  if (res.status === 402) throw new Error("AI credits نفدت — أضف رصيد للـ workspace");
  if (!res.ok) throw new Error(`AI error ${res.status}`);
  const j = await res.json();
  return j?.choices?.[0]?.message?.content ?? "";
}

async function assertStaff(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
  if (error || !data) throw new Error("Forbidden");
}

/** Generate SEO meta (title + description) for a topic / content. */
export const generateSEOMeta = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { topic: string; lang: "ar" | "en"; context?: string }) => d)
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const sys = `You are an SEO expert. Return JSON: { "title": "...", "description": "...", "keywords": ["..."] }. Title <= 60 chars. Description 140-160 chars. Language: ${data.lang === "ar" ? "Arabic" : "English"}. Make it click-worthy, include the primary keyword, avoid clickbait.`;
    const user = `Topic: ${data.topic}\n\nContext:\n${(data.context || "").slice(0, 4000)}`;
    const out = await callAI(sys, user, true);
    try { return JSON.parse(out); } catch { return { title: "", description: "", keywords: [] }; }
  });

/** Generate JSON-LD schema suggestion for a page. */
export const generateSchema = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { kind: "Article" | "Service" | "FAQPage" | "Product"; data: Record<string, any> }) => d)
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const sys = `You output a single valid JSON-LD object for schema.org type ${data.kind}. No commentary, only JSON.`;
    const out = await callAI(sys, `Generate schema. Source fields:\n${JSON.stringify(data.data).slice(0, 4000)}`, true);
    try { return JSON.parse(out); } catch { return null; }
  });

/** Suggest internal links based on a draft + available pages. */
export const suggestInternalLinks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { text: string; lang: "ar" | "en"; limit?: number }) => d)
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const limit = data.limit ?? 8;
    // Pull candidate pages from blog + services
    const [{ data: posts }, { data: services }] = await Promise.all([
      context.supabase.from("blog_posts").select(`slug,title_${data.lang},excerpt_${data.lang}`).eq("status", "published").limit(80),
      context.supabase.from("services").select(`slug,title_${data.lang},intro_${data.lang}`).eq("is_published", true).limit(60),
    ]);
    const cand = [
      ...(posts || []).map((p: any) => ({ url: `/blog/${p.slug}`, title: p[`title_${data.lang}`], summary: p[`excerpt_${data.lang}`] })),
      ...(services || []).map((s: any) => ({ url: `/services/${s.slug}`, title: s[`title_${data.lang}`], summary: s[`intro_${data.lang}`] })),
    ];
    const sys = `You are an internal linking expert. Pick the most relevant ${limit} pages from the candidates that the draft should link to. Return JSON: { "links": [{ "url": "...", "anchor": "...", "reason": "..." }] }. Anchor must be natural language from the draft (Arabic or English depending on input).`;
    const out = await callAI(sys, `Draft:\n${data.text.slice(0, 4000)}\n\nCandidates:\n${JSON.stringify(cand).slice(0, 6000)}`, true);
    try { return JSON.parse(out); } catch { return { links: [] }; }
  });

/** AI rewrite/improve selected text (used by TipTap inline AI). */
export const improveText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { text: string; instruction: string; lang?: "ar" | "en" }) => d)
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const sys = `You are a senior content editor. Apply the user's instruction to the provided text. Output ONLY the rewritten text, no preface, no quotes. Keep HTML tags if present. Default language: ${data.lang === "en" ? "English" : "Arabic"}.`;
    const user = `Instruction: ${data.instruction}\n\nText:\n${data.text.slice(0, 6000)}`;
    const out = await callAI(sys, user, false);
    return { text: (out || "").trim() };
  });

/** Generate FAQ items from the article body. */
export const generateFAQ = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { text: string; lang: "ar" | "en"; count?: number }) => d)
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const sys = `Generate ${data.count ?? 5} concise FAQ items derived from the article. Each answer 1-3 sentences. Return JSON: { "faq": [{ "q": "...", "a": "..." }] }. Language: ${data.lang === "ar" ? "Arabic" : "English"}.`;
    const out = await callAI(sys, data.text.slice(0, 6000), true);
    try { return JSON.parse(out); } catch { return { faq: [] }; }
  });