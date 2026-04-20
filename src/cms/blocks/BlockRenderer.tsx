import { Fragment } from "react";
import { BLOCK_REGISTRY, isKnownBlock, type BlockInstance } from "./registry";

type Props = {
  blocks: BlockInstance[] | null | undefined;
};

/**
 * Renders an ordered list of blocks coming from `pages.blocks` JSONB.
 * Unknown or hidden blocks are skipped silently. Each block is rendered
 * with no extra wrapper to preserve existing animation/layout — components
 * already include their own Reveal/Section markup.
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
        const Component = Entry.component as React.ComponentType<Record<string, unknown>>;
        const props: Record<string, unknown> = block.data ? { data: block.data } : {};
        return (
          <Fragment key={block.id}>
            <Component {...props} />
          </Fragment>
        );
      })}
    </>
  );
}
