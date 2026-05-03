import type { ReactNode } from "react";

export type InlineLinkSpec = { phrase: string; href: string };

/**
 * Replace the first occurrence of each phrase in `text` with a React link node.
 * Mutates a shared `used` set so each phrase only links once across the article.
 */
export function linkifyParagraph(
  text: string,
  links: InlineLinkSpec[],
  used: Set<string>,
  renderLink: (href: string, label: string, key: string) => ReactNode,
): ReactNode[] {
  if (!links.length) return [text];
  // sort by length desc to match longest phrases first
  const candidates = [...links]
    .filter((l) => l.phrase && !used.has(l.phrase))
    .sort((a, b) => b.phrase.length - a.phrase.length);

  let parts: ReactNode[] = [text];
  for (const { phrase, href } of candidates) {
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
      used.add(phrase);
    }
    parts = next;
  }
  return parts;
}