import { createFileRoute, Outlet, notFound, redirect } from "@tanstack/react-router";
import { isLocale } from "@/i18n/types";

export const Route = createFileRoute("/{-$locale}")({
  beforeLoad: ({ params, location }) => {
    if (params.locale !== undefined && !isLocale(params.locale)) throw notFound();
    // Arabic is the default URL with NO prefix. 301 any /ar/* to /*
    if (params.locale === "ar") {
      const restPath = location.pathname.replace(/^\/ar(?=\/|$)/, "") || "/";
      throw redirect({ href: restPath, replace: true, statusCode: 301 });
    }
  },
  component: () => <Outlet />,
});
