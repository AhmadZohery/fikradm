import { useState } from "react";
import { Play } from "lucide-react";

type Props = {
  /** YouTube video ID (e.g. "dQw4w9WgXcQ") */
  youtubeId?: string;
  /** Optional thumbnail override */
  thumbnail?: string;
  title?: string;
  className?: string;
  ratio?: "video" | "vertical";
};

/**
 * Lightweight YouTube embed. Renders a clickable poster first, only loads the
 * iframe after the user clicks — keeps performance high.
 */
export function VideoEmbed({ youtubeId, thumbnail, title = "Video", className = "", ratio = "video" }: Props) {
  const [active, setActive] = useState(false);
  const poster = thumbnail ?? (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : undefined);
  const aspect = ratio === "vertical" ? "aspect-[9/16]" : "aspect-video";

  return (
    <div className={`group relative overflow-hidden rounded-3xl border border-border bg-ink shadow-elegant ${aspect} ${className}`}>
      {!active ? (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={title}
          className="absolute inset-0 grid place-items-center"
        >
          {poster ? (
            <img src={poster} alt={title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
          ) : (
            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-ink via-primary-deep to-ink text-white/60">
              <span className="text-xs font-bold uppercase tracking-widest">Video preview</span>
            </div>
          )}
          <span className="absolute inset-0 bg-ink/30 transition group-hover:bg-ink/15" />
          <span className="relative grid h-20 w-20 place-items-center rounded-full bg-white/95 text-ink shadow-pop transition duration-300 group-hover:scale-110">
            <span className="absolute inset-0 animate-ping rounded-full bg-white/60" aria-hidden />
            <Play className="relative h-7 w-7 translate-x-0.5 fill-current" />
          </span>
        </button>
      ) : youtubeId ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : null}
    </div>
  );
}
