import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

function getDevice(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/Tablet|iPad/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone/i.test(ua)) return "mobile";
  return "desktop";
}

function getSession(): string {
  try {
    const k = "fikra_vitals_sid";
    let s = sessionStorage.getItem(k);
    if (!s) {
      s = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem(k, s);
    }
    return s;
  } catch {
    return "";
  }
}

export function WebVitalsReporter() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    const device = getDevice();
    const session = getSession();
    const url = window.location.pathname;

    const send = (m: { name: string; value: number; rating?: string; navigationType?: string }) => {
      if (cancelled) return;
      const metric = m.name as "LCP" | "CLS" | "INP" | "FCP" | "TTFB";
      if (!["LCP", "CLS", "INP", "FCP", "TTFB"].includes(metric)) return;
      // Cap to schema (<= 100000) and round
      const value = Math.min(100000, Math.max(0, Number(m.value.toFixed(4))));
      supabase
        .from("web_vitals")
        .insert({
          url: url.slice(0, 512),
          metric,
          value,
          rating: m.rating ?? null,
          device,
          navigation_type: m.navigationType ?? null,
          session_id: session,
        })
        .then(() => {}, () => {});
    };

    import("web-vitals").then(({ onLCP, onCLS, onINP, onFCP, onTTFB }) => {
      if (cancelled) return;
      onLCP(send);
      onCLS(send);
      onINP(send);
      onFCP(send);
      onTTFB(send);
    }).catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}