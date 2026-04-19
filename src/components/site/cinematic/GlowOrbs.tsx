type Props = {
  variant?: "primary" | "svc" | "mixed";
  className?: string;
};

export function GlowOrbs({ variant = "mixed", className = "" }: Props) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="absolute -top-32 start-1/4 h-[28rem] w-[28rem] rounded-full blur-[140px] animate-glow-pulse"
        style={{
          background:
            variant === "svc"
              ? "color-mix(in oklab, var(--svc) 28%, transparent)"
              : "color-mix(in oklab, var(--primary) 24%, transparent)",
        }}
      />
      <div
        className="absolute -bottom-40 end-0 h-[26rem] w-[26rem] rounded-full blur-[120px] animate-glow-pulse"
        style={{
          animationDelay: "1.5s",
          background:
            variant === "primary"
              ? "color-mix(in oklab, var(--primary-glow) 22%, transparent)"
              : variant === "svc"
                ? "color-mix(in oklab, var(--svc-soft) 60%, transparent)"
                : "color-mix(in oklab, var(--gold) 18%, transparent)",
        }}
      />
      <div
        className="absolute top-1/3 -start-20 h-[20rem] w-[20rem] rounded-full blur-[110px] animate-glow-pulse"
        style={{
          animationDelay: "0.8s",
          background: "color-mix(in oklab, var(--primary) 14%, transparent)",
        }}
      />
    </div>
  );
}
