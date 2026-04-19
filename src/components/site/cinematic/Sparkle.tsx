type Props = { className?: string; size?: number };

export function Sparkle({ className = "", size = 28 }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`text-svc ${className}`}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M12 0c.6 5.5 5.4 10.4 12 11-6.6.6-11.4 5.5-12 11-.6-5.5-5.4-10.4-12-11C6.6 10.4 11.4 5.5 12 0Z"
      />
    </svg>
  );
}
