import { createStart, createMiddleware } from '@tanstack/react-start';
import { setResponseHeader } from '@tanstack/react-start/server';
import { attachSupabaseAuth } from '@/integrations/supabase/auth-attacher';

/**
 * HTTP cache policy for the edge runtime.
 *  - /assets/* (hashed Vite bundles) → 1 year immutable
 *  - /blog/*, /services/*, /industries/*, /locations/*    → SWR 5min / 1h
 *  - homepage + listing pages                              → SWR 1min / 10min
 *  - /admin/*, /api/*                                      → no-store
 */
const cacheHeadersMiddleware = createMiddleware().server(async ({ next, request }) => {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method.toUpperCase();
  const result = await next();
  if (method !== 'GET' && method !== 'HEAD') return result;

  try {
    if (path.startsWith('/admin') || path.startsWith('/api')) {
      setResponseHeader('Cache-Control', 'private, no-store');
    } else if (/\.(?:js|css|woff2?|ttf|otf|png|jpg|jpeg|webp|avif|svg|ico|gif|mp4|webm)$/i.test(path) || path.startsWith('/assets/')) {
      setResponseHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (/^\/(?:ar|en)?\/?(?:blog|services|industries|locations|case-studies)\/.+/.test(path)) {
      setResponseHeader('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600');
    } else {
      setResponseHeader('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=600');
    }
  } catch {
    /* outside request context — ignore */
  }
  return result;
});

export const startInstance = createStart(() => ({
  requestMiddleware: [cacheHeadersMiddleware],
  functionMiddleware: [attachSupabaseAuth],
}));