# Client logos

Drop client logo files here and register them in `src/content/clients.ts`.

## File naming
- Use the client `slug` from `src/content/clients.ts` (kebab-case).
- Examples: `maticauto.svg`, `garage-90.png`, `crystal-dental.svg`.

## Format
- **SVG** preferred (vector, crisp, smallest payload).
- **PNG** with transparent background also fine. Max width ~600px.
- Avoid JPG — opaque background looks bad on the wall cards.

## Wiring it up
```ts
// src/content/clients.ts
import maticauto from "@/assets/clients/maticauto.svg";

export const CLIENTS: Client[] = [
  { slug: "maticauto", name: "MaTicAuto", logo: maticauto, /* ... */ },
];
```

Skip `logo` and the UI renders the brand name as a styled wordmark
automatically. You can add the image later without touching components.