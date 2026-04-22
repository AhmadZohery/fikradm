export const PREVIEW_RELOAD_EVENT_KEY = "fikra:preview:reload";

export function buildPreviewUrl(options?: { qaVisual?: boolean; hardReload?: boolean }) {
  const url = new URL("/", window.location.origin);
  if (options?.qaVisual) url.searchParams.set("qa", "visual");
  if (options?.hardReload) url.searchParams.set("_reload", String(Date.now()));
  return url;
}

export async function performPreviewHardReload() {
  if (typeof window === "undefined") return;

  try {
    if ("caches" in window) {
      const cacheKeys = await window.caches.keys();
      await Promise.all(cacheKeys.map((key) => window.caches.delete(key)));
    }
  } catch {
    // Best effort only.
  }

  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set("_reload", String(Date.now()));
  window.location.replace(nextUrl.toString());
}

export function requestPreviewHardReload(options?: { qaVisual?: boolean }) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(PREVIEW_RELOAD_EVENT_KEY, String(Date.now()));
  } catch {
    // noop
  }

  const url = buildPreviewUrl({ qaVisual: options?.qaVisual, hardReload: true });
  window.open(url.toString(), "_blank", "noopener,noreferrer");
}