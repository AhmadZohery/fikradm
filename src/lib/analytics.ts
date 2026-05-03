import { supabase } from "@/integrations/supabase/client";

const BOT_REGEX =
  /bot|crawler|spider|crawling|facebookexternalhit|slurp|mediapartners|googleother|bingpreview|chatgpt|gptbot|ahrefs|semrush|petal|yandex|baidu|duckduckbot|applebot|whatsapp|telegrambot|linkedinbot|twitterbot|discordbot/i;

const SESSION_KEY = "fk_session_id";
const TRACKED_KEY = "fk_tracked_paths";

function getSessionId(): string {
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return "anon";
  }
}

function detectDevice(ua: string): "mobile" | "tablet" | "desktop" {
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android.*mobile|blackberry|iemobile|opera mini/i.test(ua))
    return "mobile";
  return "desktop";
}

async function detectCountry(): Promise<string | null> {
  try {
    const cached = sessionStorage.getItem("fk_country");
    if (cached) return cached;
    const res = await fetch("https://ipapi.co/country/", { cache: "force-cache" });
    if (!res.ok) return null;
    const country = (await res.text()).trim().slice(0, 2).toUpperCase();
    if (country && /^[A-Z]{2}$/.test(country)) {
      sessionStorage.setItem("fk_country", country);
      return country;
    }
    return null;
  } catch {
    return null;
  }
}

function getTrackedPaths(): Set<string> {
  try {
    const raw = sessionStorage.getItem(TRACKED_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function markTracked(path: string) {
  try {
    const set = getTrackedPaths();
    set.add(path);
    sessionStorage.setItem(TRACKED_KEY, JSON.stringify([...set]));
  } catch {
    /* noop */
  }
}

export async function trackPageView(opts: { path: string; locale?: string; pageSlug?: string }) {
  if (typeof window === "undefined") return;
  const ua = navigator.userAgent || "";
  if (BOT_REGEX.test(ua)) return;

  // Honor DNT
  if (navigator.doNotTrack === "1") return;

  // Dedupe per session+path
  if (getTrackedPaths().has(opts.path)) return;
  markTracked(opts.path);

  const country = await detectCountry();

  const { error } = await supabase.from("page_views").insert({
    page_slug: opts.pageSlug ?? opts.path,
    path: opts.path,
    locale: opts.locale ?? null,
    session_id: getSessionId(),
    device: detectDevice(ua),
    country,
    user_agent: ua.slice(0, 500),
    referrer: document.referrer ? document.referrer.slice(0, 500) : null,
  });

  if (error && import.meta.env.DEV) {
    console.warn("[analytics] insert failed", error.message);
  }
}

/**
 * Lightweight CTA click tracker — pushes to window.dataLayer (GA/GTM-friendly)
 * and emits a custom DOM event for any listener. Zero network. Safe in SSR.
 */
export function trackCtaClick(label: string, meta?: Record<string, string | number | boolean | null>) {
  if (typeof window === "undefined") return;
  try {
    const payload = {
      event: "cta_click",
      cta_label: label,
      cta_path: window.location.pathname,
      cta_locale: document.documentElement.lang || "ar",
      ...meta,
    };
    // GTM/GA4-friendly dataLayer push
    type DataLayerWindow = Window & { dataLayer?: Array<Record<string, unknown>> };
    const w = window as DataLayerWindow;
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push(payload);
    // Custom event for in-app listeners
    window.dispatchEvent(new CustomEvent("fikra:cta", { detail: payload }));
    if (import.meta.env.DEV) {
      console.debug("[cta]", label, payload);
    }
  } catch {
    /* noop */
  }
}

/**
 * Track a lead conversion to GA4 (dataLayer/gtag) and Meta Pixel (fbq) if loaded.
 * Falls back to dataLayer-only when scripts are absent. Safe in SSR.
 */
type GtagWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

export function trackLead(opts: {
  source: string; // e.g. "service_page"
  service?: string;
  value?: number;
  currency?: string;
  meta?: Record<string, string | number | boolean | null>;
}) {
  if (typeof window === "undefined") return;
  const w = window as GtagWindow;
  const payload = {
    event: "generate_lead",
    lead_source: opts.source,
    service: opts.service ?? null,
    value: opts.value ?? 1,
    currency: opts.currency ?? "SAR",
    page_path: window.location.pathname,
    locale: document.documentElement.lang || "ar",
    ...opts.meta,
  };
  try {
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push(payload);
    if (typeof w.gtag === "function") {
      w.gtag("event", "generate_lead", payload);
    }
    if (typeof w.fbq === "function") {
      w.fbq("track", "Lead", { content_name: opts.service, value: opts.value ?? 1, currency: opts.currency ?? "SAR" });
    }
    window.dispatchEvent(new CustomEvent("fikra:lead", { detail: payload }));
  } catch {
    /* noop */
  }
}
