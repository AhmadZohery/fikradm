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
        const Component = Entry.component;
        // Pass `data` prop only when present — components keep their static defaults otherwise.
        return (
          <Fragment key={block.id}>
            {block.data ? <Component data={block.data} /> : <Component />}
          </Fragment>
        );
      })}
    </>
  );
}
