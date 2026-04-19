import { Image as ImageIcon, Play } from "lucide-react";

type Props = {
  src?: string;
  alt?: string;
  ratio?: "video" | "square" | "portrait" | "wide";
  caption?: string;
  badge?: string;
  type?: "image" | "video";
  rounded?: "lg" | "xl" | "2xl" | "3xl";
  className?: string;
};

const ratios: Record<NonNullable<Props["ratio"]>, string> = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  wide: "aspect-[16/9]",
};

const radii: Record<NonNullable<Props["rounded"]>, string> = {
  lg: "rounded-xl",
  xl: "rounded-2xl",
  "2xl": "rounded-[1.75rem]",
  "3xl": "rounded-[2.25rem]",
};

/**
 * MediaSlot — reusable placeholder/frame for screenshots, photos, and short videos.
 * Pass a real `src` or it renders a labeled placeholder so layout is preserved
 * until real media (screenshots, demo videos) is uploaded.
 */
export function MediaSlot({
  src,
  alt = "",
  ratio = "video",
  caption,
  badge,
  type = "image",
  rounded = "2xl",
  className = "",
}: Props) {
  const Icon = type === "video" ? Play : ImageIcon;
  return (
    <figure className={`group relative overflow-hidden border border-border bg-surface-soft shadow-card ${radii[rounded]} ${ratios[ratio]} ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" loading="lazy" />
      ) : (
        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-surface-soft via-card to-surface">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-card shadow-soft" style={{ color: "var(--svc)" }}>
              <Icon className="h-5 w-5" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-widest">
              {type === "video" ? "Video slot" : "Screenshot slot"}
            </span>
            {alt && <span className="max-w-[80%] text-center text-xs text-muted-foreground/80">{alt}</span>}
          </div>
        </div>
      )}
      {/* Soft gradient frame */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/5" aria-hidden />
      {badge && (
        <span className="absolute end-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-soft" style={{ color: "var(--svc)" }}>
          {badge}
        </span>
      )}
      {caption && (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent px-4 py-3 text-xs font-semibold text-white">
          {caption}
        </figcaption>
      )}
      {type === "video" && src && (
        <span className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 text-ink shadow-elegant transition group-hover:scale-110">
            <Play className="h-6 w-6 translate-x-0.5 fill-current" />
          </span>
        </span>
      )}
    </figure>
  );
}
