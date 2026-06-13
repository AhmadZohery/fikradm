# Case study covers

Drop cover images here and register them in `src/content/caseStudies.ts`.

## File naming
- Use the case study `slug` (kebab-case).
- Examples: `luxury-ecommerce.jpg`, `dental-network.jpg`.

## Format & size
- **JPG** for photos (smaller).
- **PNG** only when the image has transparency.
- Recommended dimensions: **1600 × 1000** (16:10).

## Wiring it up
```ts
// src/content/caseStudies.ts
import luxuryEcommerce from "@/assets/case-studies/luxury-ecommerce.jpg";

export const CASE_STUDIES: CaseStudy[] = [
  { slug: "luxury-ecommerce", cover: luxuryEcommerce, /* ... */ },
];
```

If `cover` is missing, the card falls back to a branded gradient
placeholder using `accent` — safe to ship before the photo is ready.