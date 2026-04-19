type Props = { children: React.ReactNode; className?: string };

export function SectionEyebrow({ children, className = "" }: Props) {
  return <span className={`section-eyebrow ${className}`}>{children}</span>;
}
