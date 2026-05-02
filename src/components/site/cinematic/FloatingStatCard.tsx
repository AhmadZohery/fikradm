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
      className={`relative w-[15rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-white/70 bg-white/95 p-3 shadow-pop backdrop-blur-xl sm:w-[16rem] md:w-[17rem] md:p-4 ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-[12px] font-bold leading-5 text-ink md:text-[13px]">{title}</h4>
        {badge}
      </div>
      <div className="mt-2.5 space-y-1.5 md:mt-3 md:space-y-2">
        {stats.map((s, i) => (
          <div key={i} className="flex items-center gap-2 rounded-xl bg-surface/70 px-2 py-1.5">
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-extrabold text-white tabular-nums shadow-soft"
              style={{ background: "var(--svc, var(--primary))" }}
            >
              {s.value}
            </span>
            <span className="text-[11px] font-semibold leading-4 text-ink md:text-[12.5px]">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
