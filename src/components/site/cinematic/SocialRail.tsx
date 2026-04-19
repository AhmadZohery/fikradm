import { Facebook, Linkedin, Instagram, Twitter } from "lucide-react";

const items = [
  { Icon: Facebook, href: "#", label: "Facebook" },
  { Icon: Linkedin, href: "#", label: "LinkedIn" },
  { Icon: Twitter, href: "#", label: "X" },
  { Icon: Instagram, href: "#", label: "Instagram" },
];

export function SocialRail() {
  return (
    <div className="pointer-events-auto absolute start-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
      {items.map(({ Icon, href, label }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white/80 text-muted-foreground shadow-soft backdrop-blur transition hover:scale-110 hover:border-primary/40 hover:text-primary"
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}
