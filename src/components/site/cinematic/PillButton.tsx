import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  to?: string;
  href?: string;
  children: ReactNode;
  variant?: "solid" | "outline";
  className?: string;
  iconLeft?: boolean;
};

export function PillButton({ to, href, children, variant = "solid", className = "", iconLeft = false }: Props) {
  const baseSolid =
    "btn-pill group magnetic ripple focus-ring";
  const baseOutline =
    "group magnetic ripple focus-ring inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-3.5 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:shadow-soft";

  const inner = (
    <>
      {iconLeft && variant === "solid" && (
        <span className="pill-icon order-first">
          <ArrowUpRight className="h-4 w-4 text-white rtl:rotate-90" />
        </span>
      )}
      <span className={variant === "solid" ? "px-2" : ""}>{children}</span>
      {!iconLeft && variant === "solid" && (
        <span className="pill-icon">
          <ArrowUpRight className="h-4 w-4 text-white rtl:rotate-90" />
        </span>
      )}
      {variant === "outline" && (
        <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-0.5 rtl:-translate-x-0 rtl:rotate-90" />
      )}
    </>
  );

  const cls = `${variant === "solid" ? baseSolid : baseOutline} ${className}`;
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  return <a href={href ?? "#"} className={cls}>{inner}</a>;
}
