import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

/**
 * Daily SEO / JSON-LD audit.
 *
 * Crawls a curated list of important URLs, parses every <script type="application/ld+json">
 * block, validates required fields per @type, and stores a report row in seo_audit_reports.
 *
 * Triggered by pg_cron (see cron config). Auth: requires the Supabase anon key
 * via `apikey` header (matches /api/public/* convention used elsewhere).
 */

type SchemaIssue = {
  url: string;
  level: "error" | "warning";
  type: string;
  message: string;
};

const REQUIRED_FIELDS: Record<string, string[]> = {
  Organization: ["name", "url", "logo"],
  LocalBusiness: ["name", "address", "telephone"],
  ProfessionalService: ["name", "address"],
  Service: ["name", "provider"],
  Article: ["headline", "author", "datePublished", "image", "publisher"],
  BreadcrumbList: ["itemListElement"],
  FAQPage: ["mainEntity"],
  WebSite: ["url", "name"],
  SiteNavigationElement: ["name", "url"],
  Person: ["name"],
};

function getOrigin(): string {
  // Build absolute URLs for the crawler. Hard-coded to the published origin
  // because the audit runs on a schedule with no incoming Host header.
  return "https://fikradm.lovable.app";
}

function curatedPaths(): string[] {
  // Keep this list small (cron must finish quickly). Expand as needed.
  return [
    "/ar",
    "/en",
    "/ar/about",
    "/ar/services",
    "/ar/services/seo",
    "/ar/services/performance-marketing",
    "/ar/services/creative",
    "/ar/services/web-development",
    "/ar/blog",
    "/ar/contact",
    "/ar/team-and-licensing",
    "/ar/locations",
    "/ar/locations/riyadh/seo",
    "/ar/locations/dubai/performance-marketing",
    "/ar/locations/cairo/creative",
  ];
}

function extractJsonLd(html: string): unknown[] {
  const blocks: unknown[] = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim();
    if (!raw) continue;
    try {
      blocks.push(JSON.parse(raw));
    } catch {
      blocks.push({ __parseError: true, raw: raw.slice(0, 200) });
    }
  }
  return blocks;
}

function flattenGraph(node: unknown): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];
  const walk = (n: unknown) => {
    if (!n || typeof n !== "object") return;
    const obj = n as Record<string, unknown>;
    if (Array.isArray(obj)) {
      obj.forEach(walk);
      return;
    }
    if ("@graph" in obj && Array.isArray(obj["@graph"])) {
      (obj["@graph"] as unknown[]).forEach(walk);
    }
    if ("@type" in obj) out.push(obj);
  };
  walk(node);
  return out;
}

function validateBlocks(url: string, blocks: unknown[]): SchemaIssue[] {
  const issues: SchemaIssue[] = [];
  for (const block of blocks) {
    if (block && typeof block === "object" && (block as { __parseError?: boolean }).__parseError) {
      issues.push({
        url,
        level: "error",
        type: "JSON",
        message: "Invalid JSON inside an application/ld+json script block.",
      });
      continue;
    }
    const flat = flattenGraph(block);
    for (const node of flat) {
      const type = String(node["@type"] ?? "Unknown");
      const required = REQUIRED_FIELDS[type];
      if (!required) continue;
      for (const field of required) {
        if (node[field] === undefined || node[field] === null || node[field] === "") {
          issues.push({
            url,
            level: "error",
            type,
            message: `Missing required field "${field}" on ${type}.`,
          });
        }
      }
    }
  }
  return issues;
}

async function auditPath(origin: string, path: string): Promise<{
  url: string;
  status: number;
  schemaCount: number;
  issues: SchemaIssue[];
  error?: string;
}> {
  const url = `${origin}${path}`;
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "FikraSeoAudit/1.0 (+https://fikradm.lovable.app)" },
    });
    const html = await res.text();
    const blocks = extractJsonLd(html);
    const issues = validateBlocks(url, blocks);

    if (blocks.length === 0) {
      issues.push({
        url,
        level: "warning",
        type: "Coverage",
        message: "No application/ld+json schema found on this URL.",
      });
    }
    return { url, status: res.status, schemaCount: blocks.length, issues };
  } catch (e) {
    return {
      url,
      status: 0,
      schemaCount: 0,
      issues: [{ url, level: "error", type: "Fetch", message: String(e) }],
      error: String(e),
    };
  }
}

export const Route = createFileRoute("/api/public/hooks/seo-audit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Validate apikey header matches the project anon key (cron sends it).
        const apikey = request.headers.get("apikey");
        const expected = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!expected || apikey !== expected) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }

        const origin = getOrigin();
        const paths = curatedPaths();

        const results = [];
        for (const p of paths) {
          // Sequential to keep memory + bandwidth gentle.
          // eslint-disable-next-line no-await-in-loop
          results.push(await auditPath(origin, p));
        }

        const totalErrors = results.reduce(
          (a, r) => a + r.issues.filter((i) => i.level === "error").length,
          0,
        );
        const totalWarnings = results.reduce(
          (a, r) => a + r.issues.filter((i) => i.level === "warning").length,
          0,
        );

        const summary = {
          totalPages: results.length,
          totalErrors,
          totalWarnings,
          pagesWithoutSchema: results.filter((r) => r.schemaCount === 0).length,
          fixMap: buildFixMap(results),
        };

        // Persist with service-role so RLS doesn't block the cron.
        const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (supabaseUrl && serviceKey) {
          const supa = createClient(supabaseUrl, serviceKey, {
            auth: { autoRefreshToken: false, persistSession: false },
          });
          await supa.from("seo_audit_reports").insert({
            total_pages: results.length,
            total_warnings: totalWarnings,
            total_errors: totalErrors,
            summary,
            details: results,
          });
        }

        return new Response(
          JSON.stringify({ ok: true, summary, sampleIssues: results.flatMap((r) => r.issues).slice(0, 10) }),
          { status: 200, headers: { "content-type": "application/json" } },
        );
      },
    },
  },
});

/** Map issue type → human-readable fix guidance, for the report. */
function buildFixMap(results: Array<{ issues: SchemaIssue[] }>): Record<string, string> {
  const guidance: Record<string, string> = {
    Coverage: "Add a JSON-LD <script> with at least Organization or WebPage schema.",
    JSON: "JSON-LD body is not valid JSON — escape inner quotes and remove trailing commas.",
    Article: "Article schema needs headline, author, datePublished, image, publisher.",
    LocalBusiness: "LocalBusiness needs name, address (with addressCountry), and telephone.",
    ProfessionalService: "ProfessionalService needs name and a PostalAddress.",
    Service: "Service must reference a provider (Organization).",
    BreadcrumbList: "BreadcrumbList needs itemListElement with position+name+item.",
    FAQPage: "FAQPage requires mainEntity[] of Question/Answer pairs.",
    Organization: "Organization should have name, url, and logo (ImageObject).",
    Person: "Person needs at least a name.",
    SiteNavigationElement: "SiteNavigationElement should expose name[] and url[] arrays.",
    WebSite: "WebSite needs url and name; consider adding a SearchAction.",
    Fetch: "URL did not respond — check route exists and SSR is healthy.",
  };
  const present = new Set<string>();
  for (const r of results) for (const i of r.issues) present.add(i.type);
  const map: Record<string, string> = {};
  for (const t of present) if (guidance[t]) map[t] = guidance[t];
  return map;
}
