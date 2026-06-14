import { readStored } from "./utm";

export type ResolvedAttribution = {
  source: string;
  medium: string;
  campaign: string | null;
  click_id: string | null;
  click_platform: "google" | "facebook" | "microsoft" | "tiktok" | null;
  first_touch_at: string | null;
  last_touch_at: string | null;
  raw: Record<string, unknown>;
};

/**
 * Unified last-click attribution within a 30-day window.
 * Precedence (highest first):
 *   1) gclid → google / cpc
 *   2) fbclid → facebook / paid_social
 *   3) msclkid → microsoft / cpc
 *   4) ttclid → tiktok / paid_social
 *   5) utm_source / utm_medium
 *   6) referrer host (organic / referral)
 *   7) direct
 */
export function resolveAttribution(): ResolvedAttribution {
  const stored = readStored();
  const now = Date.now();
  const last = stored.last_seen_at ? Date.parse(stored.last_seen_at) : 0;
  const within30d = last && now - last <= 30 * 86400000;

  const referrer =
    stored.referrer ||
    (typeof document !== "undefined" ? document.referrer : "") ||
    "";

  let source = "direct";
  let medium = "(none)";
  let campaign: string | null = null;
  let click_id: string | null = null;
  let click_platform: ResolvedAttribution["click_platform"] = null;

  if (within30d) {
    if (stored.gclid) {
      source = "google"; medium = "cpc"; click_id = stored.gclid; click_platform = "google";
    } else if (stored.fbclid) {
      source = "facebook"; medium = "paid_social"; click_id = stored.fbclid; click_platform = "facebook";
    } else if (stored.msclkid) {
      source = "bing"; medium = "cpc"; click_id = stored.msclkid; click_platform = "microsoft";
    } else if (stored.ttclid) {
      source = "tiktok"; medium = "paid_social"; click_id = stored.ttclid; click_platform = "tiktok";
    } else if (stored.utm_source) {
      source = stored.utm_source;
      medium = stored.utm_medium || "referral";
    }
    campaign = stored.utm_campaign || null;
  }

  if (source === "direct" && referrer) {
    try {
      const host = new URL(referrer).hostname.replace(/^www\./, "");
      const ownHost = typeof window !== "undefined" ? window.location.hostname.replace(/^www\./, "") : "";
      if (host && host !== ownHost) {
        if (/google\.|bing\.|yahoo\.|duckduckgo\.|yandex\./.test(host)) {
          source = host.split(".")[0];
          medium = "organic";
        } else {
          source = host;
          medium = "referral";
        }
      }
    } catch {}
  }

  return {
    source,
    medium,
    campaign,
    click_id,
    click_platform,
    first_touch_at: stored.first_seen_at || null,
    last_touch_at: stored.last_seen_at || null,
    raw: { ...stored, referrer },
  };
}