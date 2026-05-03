import type { ReactNode } from "react";

export type InlineLinkSpec = { phrase: string; href: string };

export type LinkBudget = {
  /** phrases already used (deduped across the article). */
  used: Set<string>;
  /** hrefs already used (avoid pointing to the same URL twice). */
  usedHref: Set<string>;
  /** how many links remain to place in the current section. */
  perSection: number;
  /** absolute cap to avoid spammy linking. */
  remainingTotal: number;
};

export function makeBudget(opts: { perSection?: number; total?: number } = {}): LinkBudget {
  return {
    used: new Set(),
    usedHref: new Set(),
    perSection: opts.perSection ?? 2,
    remainingTotal: opts.total ?? 8,
  };
}

/**
 * Distribute and inject inline anchor links across the article.
 *
 * Rules (UX + SEO):
 * - Each phrase appears at most once globally.
 * - Each href is used at most once (no duplicate links to same URL).
 * - Max `perSection` links per section, max `total` overall.
 * - Skips first paragraph of a section so reading flow isn't broken at the top.
 * - Longest phrases match first (more specific anchors).
 */
export function linkifyParagraph(
  text: string,
  links: InlineLinkSpec[],
  budget: LinkBudget,
  renderLink: (href: string, label: string, key: string) => ReactNode,
  opts: { allowReplace?: boolean } = {},
): ReactNode[] {
  if (!links.length || budget.remainingTotal <= 0 || budget.perSection <= 0) return [text];
  const allowReplace = opts.allowReplace ?? true;
  if (!allowReplace) return [text];

  const candidates = [...links]
    .filter((l) => l.phrase && !budget.used.has(l.phrase) && !budget.usedHref.has(l.href))
    .sort((a, b) => b.phrase.length - a.phrase.length);

  let parts: ReactNode[] = [text];
  for (const { phrase, href } of candidates) {
    if (budget.perSection <= 0 || budget.remainingTotal <= 0) break;
    let replaced = false;
    const next: ReactNode[] = [];
    for (const part of parts) {
      if (replaced || typeof part !== "string") {
        next.push(part);
        continue;
      }
      const idx = part.toLowerCase().indexOf(phrase.toLowerCase());
      if (idx === -1) {
        next.push(part);
        continue;
      }
      const before = part.slice(0, idx);
      const match = part.slice(idx, idx + phrase.length);
      const after = part.slice(idx + phrase.length);
      if (before) next.push(before);
      next.push(renderLink(href, match, `${phrase}-${idx}`));
      if (after) next.push(after);
      replaced = true;
      budget.used.add(phrase);
      budget.usedHref.add(href);
      budget.perSection -= 1;
      budget.remainingTotal -= 1;
    }
    parts = next;
  }
  return parts;
}