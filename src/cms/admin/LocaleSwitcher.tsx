import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AdminLocale = "ar" | "en";

interface LocaleSwitcherProps {
  value: AdminLocale;
  onChange: (l: AdminLocale) => void;
  className?: string;
  size?: "sm" | "default";
}

/**
 * Global AR/EN toggle for admin editors.
 * Switches all bilingual fields + auto-applies dir="rtl|ltr".
 */
export function LocaleSwitcher({ value, onChange, className, size = "sm" }: LocaleSwitcherProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border bg-background/50 p-0.5 backdrop-blur",
        className,
      )}
      role="group"
      aria-label="Editor language"
    >
      <Languages className="ms-1 me-0.5 h-3.5 w-3.5 text-muted-foreground" />
      {(["ar", "en"] as const).map((l) => (
        <Button
          key={l}
          type="button"
          size={size}
          variant={value === l ? "default" : "ghost"}
          className={cn("h-7 px-2.5 text-xs font-semibold", value === l && "shadow-sm")}
          onClick={() => onChange(l)}
          aria-pressed={value === l}
        >
          {l === "ar" ? "العربية" : "English"}
        </Button>
      ))}
    </div>
  );
}

/**
 * Helper to read the right field based on the active locale.
 */
export function pickField<T extends object, K extends string>(
  obj: T,
  base: K,
  loc: AdminLocale,
): string {
  const key = `${base}_${loc}` as keyof T;
  const v = obj[key];
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

export function dirFor(loc: AdminLocale): "rtl" | "ltr" {
  return loc === "ar" ? "rtl" : "ltr";
}