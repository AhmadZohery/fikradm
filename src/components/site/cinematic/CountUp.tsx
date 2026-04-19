import { useCountUp, useInViewOnce } from "@/hooks/useCountUp";

type Props = {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
};

export function CountUp({ to, suffix = "", prefix = "", duration, className = "" }: Props) {
  const { ref, inView } = useInViewOnce<HTMLSpanElement>();
  const value = useCountUp(to, duration, inView);
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}
