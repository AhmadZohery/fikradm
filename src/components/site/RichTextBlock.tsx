import DOMPurify from "dompurify";
import { useMemo } from "react";
import { Reveal } from "@/components/site/Reveal";

type Props = {
  data?: {
    html?: string;
    container?: "narrow" | "default" | "wide";
    align?: "right" | "center" | "left";
  };
};

const CONTAINER: Record<NonNullable<Props["data"]>["container"] & string, string> = {
  narrow: "max-w-2xl",
  default: "max-w-4xl",
  wide: "max-w-6xl",
};

/**
 * Renders rich HTML produced by the Tiptap editor. Sanitized with
 * DOMPurify before injection. Used by the `rich_text` block.
 */
export function RichTextBlock({ data }: Props) {
  const html = data?.html ?? "";
  const align = data?.align ?? "right";
  const container = CONTAINER[data?.container ?? "default"];

  const safe = useMemo(() => {
    if (typeof window === "undefined") return html;
    return DOMPurify.sanitize(html, {
      ADD_ATTR: ["target", "rel"],
    });
  }, [html]);

  if (!safe.trim()) {
    return (
      <section className="py-12">
        <div className={`${container} mx-auto px-4 text-center text-sm text-muted-foreground`}>
          (بلوك Rich Text فارغ — افتح الـ Inspector وأضف محتوى)
        </div>
      </section>
    );
  }

  return (
    <Reveal>
      <section className="py-12 md:py-16">
        <div className={`${container} mx-auto px-4`}>
          <div
            className={`prose prose-lg dark:prose-invert max-w-none text-${align}`}
            dangerouslySetInnerHTML={{ __html: safe }}
          />
        </div>
      </section>
    </Reveal>
  );
}
