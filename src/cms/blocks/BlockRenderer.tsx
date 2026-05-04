import { Fragment, Suspense, type ComponentType } from "react";
import { BLOCK_REGISTRY, isKnownBlock, type BlockInstance } from "./registry";

type Props = {
  blocks: BlockInstance[] | null | undefined;
};

/**
 * Lightweight skeleton that reserves vertical space while a lazy block
 * is fetched. Using a fixed min-height prevents Cumulative Layout Shift
 * (CLS) — the most common Core Web Vitals regression caused by code-splitting.
 */
function BlockFallback() {
  return (
    <div
      className="container-app py-16"
      aria-hidden
      style={{ minHeight: "20rem" }}
    />
  );
}

/**
 * Renders an ordered list of blocks coming from `pages.blocks` JSONB.
 * Unknown or hidden blocks are skipped silently. Each block is rendered
 * with no extra wrapper to preserve existing animation/layout — components
 * already include their own Reveal/Section markup.
 *
 * Below-the-fold blocks marked `lazy: true` in the registry are wrapped in
 * Suspense so their JS is fetched only when needed (better LCP / TBT).
 */
export function BlockRenderer({ blocks }: Props) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block) => {
        if (block.visible === false) return null;
        if (!isKnownBlock(block.type)) {
          if (import.meta.env.DEV) {
            console.warn(`[CMS] Unknown block type: ${block.type}`);
          }
          return null;
        }
        const Entry = BLOCK_REGISTRY[block.type];
        // Components have heterogeneous prop signatures; the registry guarantees
        // the type is valid. Cast to a permissive component to allow optional data injection.
        const Component = Entry.component as ComponentType<Record<string, unknown>>;
        const props: Record<string, unknown> = block.data ? { data: block.data } : {};
        const isLazy = (Entry as { lazy?: boolean }).lazy === true;
        const node = <Component {...props} />;
        return (
          <Fragment key={block.id}>
            {isLazy ? <Suspense fallback={<BlockFallback />}>{node}</Suspense> : node}
          </Fragment>
        );
      })}
    </>
  );
}
