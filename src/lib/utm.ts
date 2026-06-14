const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "msclkid",
  "ttclid",
] as const;

export type UtmData = Partial<Record<(typeof UTM_KEYS)[number], string>> & {
  landing_page?: string;
  referrer?: string;
  first_seen_at?: string;
  last_seen_at?: string;
};

const STORAGE_KEY = "fikra_utm_v1";
const COOKIE_DAYS = 30;

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const d = new Date();
  d.setTime(d.getTime() + days * 86400000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

export function captureUtm(): UtmData {
  if (typeof window === "undefined") return {};
  const url = new URL(window.location.href);
  const fresh: UtmData = {};
  let hasNew = false;
  for (const k of UTM_KEYS) {
    const v = url.searchParams.get(k);
    if (v) {
      fresh[k] = v.slice(0, 200);
      hasNew = true;
    }
  }
  const stored = readStored();
  const now = new Date().toISOString();
  if (hasNew) {
    const merged: UtmData = {
      ...fresh,
      landing_page: window.location.pathname + window.location.search,
      referrer: document.referrer || stored.referrer,
      first_seen_at: stored.first_seen_at || now,
      last_seen_at: now,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      setCookie(STORAGE_KEY, JSON.stringify(merged), COOKIE_DAYS);
    } catch {}
    return merged;
  }
  return stored;
}

export function readStored(): UtmData {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || getCookie(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as UtmData;
  } catch {
    return {};
  }
}

export function getAttribution() {
  if (typeof window === "undefined") return {};
  const utm = readStored();
  return {
    ...utm,
    referrer: utm.referrer || (typeof document !== "undefined" ? document.referrer : ""),
    landing_page:
      utm.landing_page ||
      (typeof window !== "undefined" ? window.location.pathname : ""),
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 300) : "",
    screen: typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "",
    locale: typeof navigator !== "undefined" ? navigator.language : "",
    submitted_at: new Date().toISOString(),
  };
}