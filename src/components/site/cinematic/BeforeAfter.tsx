import { useEffect, useMemo, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";
import { MediaSlot } from "./MediaSlot";

type Props = {
  beforeSrc?: string;
  afterSrc?: string;
  beforeAlt?: string;
  afterAlt?: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
};

/**
 * Before/After image slider. Drag the divider to reveal the "after" state.
 * Works with placeholders too — perfect for case study sections.
 */
export function BeforeAfter({
  beforeSrc,
  afterSrc,
  beforeAlt = "Before",
  afterAlt = "After",
  beforeLabel = "Before",
  afterLabel = "After",
  className = "",
}: Props) {
  const [pos, setPos] = useState(50);
  const [width, setWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const isRtl = useMemo(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.dir === "rtl";
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const move = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = isRtl ? rect.right - clientX : clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPos(pct);
  };

  const startDrag = () => {
    dragging.current = true;
  };

  const stopDrag = () => {
    dragging.current = false;
  };

  return (
    <div
      ref={containerRef}
      className={`relative aspect-video overflow-hidden rounded-3xl border border-border bg-surface-soft shadow-elegant select-none ${className}`}
      onMouseMove={(e) => dragging.current && move(e.clientX)}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onTouchMove={(e) => move(e.touches[0].clientX)}
      onTouchEnd={stopDrag}
      onPointerMove={(e) => dragging.current && move(e.clientX)}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
    >
      {/* After (full) */}
      <div className="absolute inset-0">
        <MediaSlot src={afterSrc} alt={afterAlt} ratio="video" rounded="3xl" badge={afterLabel} />
      </div>
      {/* Before (clipped to pos%). Inner wrapper keeps full container width so
          the image stays perfectly aligned with the "after" layer underneath. */}
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <div
          className="absolute inset-y-0 left-0 h-full"
          style={{ width: width || "100%" }}
        >
          <MediaSlot src={beforeSrc} alt={beforeAlt} ratio="video" rounded="3xl" badge={beforeLabel} />
        </div>
      </div>
      {/* Divider */}
      <div
        className="absolute inset-y-0 z-10 w-0.5 bg-white shadow-elegant will-change-transform"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
        aria-hidden
      >
        <button
          type="button"
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          onPointerDown={startDrag}
          aria-label="Drag to compare"
          className="absolute top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize touch-none place-items-center rounded-full bg-white text-ink shadow-pop transition-transform duration-150 hover:scale-110"
        >
          <MoveHorizontal className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
