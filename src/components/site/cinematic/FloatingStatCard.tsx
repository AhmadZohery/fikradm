import type { ReactNode } from "react";

type Stat = { label: string; value: string };

type Props = {
  title: string;
  stats: Stat[];
  className?: string;
  badge?: ReactNode;
};

export function FloatingStatCard({ title, stats, className = "", badge }: Props) {
  return (
    <div
      className={`rounded-3xl border border-white/40 bg-white/90 p-5 shadow-pop backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-bold text-ink">{title}</h4>
        {badge}
      </div>
      <div className="mt-4 space-y-3">
        {stats.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <span
              className="grid h-9 w-9 place-items-center rounded-full text-[11px] font-extrabold text-white tabular-nums"
              style={{ background: "var(--svc, var(--primary))" }}
            >
              {s.value}
            </span>
            <span className="text-sm font-semibold text-ink">{s.label}</span>
          </div>
        ))}
      </div>
      {/* Connector dots */}
      <svg
        aria-hidden
        className="absolute -end-6 top-1/2 hidden h-24 w-24 -translate-y-1/2 lg:block"
        viewBox="0 0 80 80"
        fill="none"
      >
        <path
          d="M0 40 Q 40 0 80 40"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 4"
          className="text-primary/40"
        />
      </svg>
    </div>
  );
}
