import type { ReactNode } from "react";
import { TrendingUp } from "lucide-react";
import { CountUp } from "./CountUp";

type Stat = { label: string; value: string };

type Props = {
  title: string;
  stats: Stat[];
  className?: string;
  badge?: ReactNode;
};

function parseNumeric(v: string): { num: number | null; prefix: string; suffix: string } {
  const m = v.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);
  if (!m) return { num: null, prefix: "", suffix: "" };
  const num = Number(m[2].replace(",", "."));
  return { num: Number.isFinite(num) ? num : null, prefix: m[1], suffix: m[3] };
}

export function FloatingStatCard({ title, stats, className = "", badge }: Props) {
  return (
    <div
      className={`relative w-[16rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/60 bg-white/75 p-3.5 shadow-pop backdrop-blur-2xl sm:w-[17rem] md:w-[18rem] md:p-4 ${className}`}
      style={{
        boxShadow:
          "0 24px 60px -28px color-mix(in oklab, var(--primary) 40%, transparent), 0 6px 20px -12px rgb(0 0 0 / 0.12), inset 0 1px 0 rgb(255 255 255 / 0.6)",
      }}
    >
      {/* Soft tinted highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-12 -end-10 h-32 w-32 rounded-full opacity-50 blur-2xl"
        style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 55%, transparent), transparent)" }}
      />
      <div className="flex items-center justify-between gap-2">
        <h4 className="inline-flex items-center gap-1.5 text-[12px] font-bold leading-5 text-ink md:text-[13px]">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
          {title}
        </h4>
        {badge}
      </div>
      <div className="relative mt-3 space-y-2">
        {stats.map((s, i) => (
          <Row key={i} value={s.value} label={s.label} delay={120 + i * 110} />
        ))}
      </div>
    </div>
  );
}

function Row({ value, label, delay }: { value: string; label: string; delay: number }) {
  const { num, prefix, suffix } = parseNumeric(value);
  return (
    <div
      className="hs-card-rise flex items-center gap-2.5 rounded-xl border border-white/40 bg-white/55 px-2.5 py-1.5 backdrop-blur"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[11px] font-extrabold text-white tabular-nums shadow-soft"
        style={{ background: "var(--gradient-primary, var(--primary))" }}
      >
        {num != null ? <CountUp to={num} suffix={suffix} prefix={prefix} duration={1200} /> : value}
      </span>
      <span className="text-[12px] font-semibold leading-4 text-ink md:text-[12.5px]">{label}</span>
    </div>
  );
}
