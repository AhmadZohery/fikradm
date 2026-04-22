import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      style={{ insetInlineEnd: "1.6rem" }}
      className={`fixed bottom-[10.5rem] z-50 grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-white shadow-elegant transition-all duration-300 hover:scale-110 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 pointer-events-none opacity-0"
      }`}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
