type Props = {
  text: string;
  variant?: "stroke" | "fill";
  className?: string;
  bottom?: boolean;
};

export function HugeWordBackdrop({ text, variant = "stroke", className = "", bottom = true }: Props) {
  const cls = variant === "fill" ? "huge-word-fill" : "huge-word";
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 ${bottom ? "bottom-0" : "top-1/2 -translate-y-1/2"} overflow-hidden text-center ${className}`}
    >
      <span className={cls}>{text}</span>
    </div>
  );
}
