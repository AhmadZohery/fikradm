import { createFileRoute, Outlet, notFound } from "@tanstack/react-router";
import { isLocale } from "@/i18n/types";

export const Route = createFileRoute("/{-$locale}")({
  beforeLoad: ({ params }) => {
    // Locale is optional. When present it must be valid (ar/en).
    // When absent, it defaults to Arabic (no prefix in URL).
    if (params.locale !== undefined && !isLocale(params.locale)) throw notFound();
  },
  component: () => <Outlet />,
});
