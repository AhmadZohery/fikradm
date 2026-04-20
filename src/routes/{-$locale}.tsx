import { createFileRoute, Outlet, notFound } from "@tanstack/react-router";
import { isLocale } from "@/i18n/types";

export const Route = createFileRoute("/{-$locale}")({
  beforeLoad: ({ params }) => {
    if (params.locale !== undefined && !isLocale(params.locale)) throw notFound();
  },
  component: () => <Outlet />,
});
