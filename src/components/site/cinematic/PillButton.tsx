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
  const cls = `btn-cta btn-cta--lg ${variant === "outline" ? "btn-cta--ghost" : ""} ${className}`.trim();
  const ctaLabel = typeof children === "string" ? children : "pill_cta";
  const inner = (
    <>
      {iconLeft && <ArrowUpRight className="cta-arrow order-first" aria-hidden />}
      <span>{children}</span>
      {!iconLeft && <ArrowUpRight className="cta-arrow" aria-hidden />}
    </>
  );
  if (to) return <Link to={to} className={cls} data-cta={ctaLabel}>{inner}</Link>;
  return <a href={href ?? "#"} className={cls} data-cta={ctaLabel}>{inner}</a>;
}
