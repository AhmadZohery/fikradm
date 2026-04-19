import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Translate distance in px (default 16) */
  y?: number;
};

/**
 * Lightweight scroll-reveal using IntersectionObserver + CSS transitions.
 * No animation library, runs once, and respects prefers-reduced-motion.
 */
export function Reveal({ children, as, className, delay = 0, y = 16 }: RevealProps) {
  const Comp = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setShown(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <Comp
      ref={ref as never}
      style={{
        transform: shown ? "translate3d(0,0,0)" : `translate3d(0,${y}px,0)`,
        opacity: shown ? 1 : 0,
        transition: `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
      className={cn(className)}
    >
      {children}
    </Comp>
  );
}
