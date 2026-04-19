import { useEffect, useState } from "react";
import { useLocale } from "@/i18n/useLocale";

const KEY = "fikra-cookie-consent";

export function CookieBanner() {
  const { t } = useLocale();
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      // ignore
    }
  }, []);

  if (!show) return null;

  const decide = (v: "accept" | "decline") => {
    try {
      localStorage.setItem(KEY, v);
    } catch {
      // ignore
    }
    setShow(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-6 sm:pb-6">
      <div className="mx-auto flex max-w-3xl flex-col items-start justify-between gap-3 rounded-2xl border border-border bg-popover/95 p-4 shadow-elegant backdrop-blur sm:flex-row sm:items-center">
        <p className="text-sm text-muted-foreground">{t("cookie.text")}</p>
        <div className="flex shrink-0 gap-2">
          <button onClick={() => decide("decline")} className="rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground/80 hover:bg-accent">
            {t("cookie.decline")}
          </button>
          <button onClick={() => decide("accept")} className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
            {t("cookie.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
