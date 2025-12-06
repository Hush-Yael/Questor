import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/solid-router";
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools";
import TanStackQueryProvider from "~/integrations/tanstack-query/provider.tsx";
import { HydrationScript } from "solid-js/web";
import { Suspense } from "solid-js";
import { ThemeProvider } from "~/contexts/theme/provider";

import "virtual:uno.css";
import indexCss from "~/index.css?url";
import themeCss from "~/theme.css?url";
import compStylesCss from "~/components/ui/styles/index.css?url";

export const Route = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { title: "Questor" },
      { name: "charset", content: "UTF-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      {
        name: "theme-color",
        content: "#f3f2ecff",
        media: "(prefers-color-scheme: light)",
      },
    ],
    links: [
      { rel: "stylesheet", href: indexCss },
      { rel: "stylesheet", href: themeCss },
      { rel: "stylesheet", href: compStylesCss },
    ],
    scripts: import.meta.env.DEV
      ? [
          {
            type: "module",
            children: `
              if (
                /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone|webOS/i.test(
                  navigator.userAgent
                ) ||
                "ontouchstart" in window ||
                navigator.maxTouchPoints > 0
              ) {
                await import("/node_modules/eruda/eruda.js");

                // @ts-expect-error: eruda se añade a window
                if (window.eruda) window.eruda.init();
                else throw new Error("eruda not found");
              }
            `,
          },
        ]
      : undefined,
  }),
  shellComponent: RootComponent,
});

function RootComponent() {
  return (
    <html lang="es">
      <head>
        <HydrationScript />
      </head>
      <body>
        <HeadContent />
        <ThemeProvider>
          <Suspense>
            <TanStackQueryProvider>
              <Outlet />
              <TanStackRouterDevtools />
            </TanStackQueryProvider>
          </Suspense>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
