import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/solid-router";
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools";
import TanStackQueryProvider from "~/integrations/tanstack-query/provider.tsx";
import { HydrationScript, Portal } from "solid-js/web";
import { Suspense } from "solid-js";
import { ThemeProvider } from "~/contexts/theme/provider";
import { Toast } from "@kobalte/core/toast";

import "virtual:uno.css";
import indexCss from "~/index.css?url";
import themeCss from "~/theme.css?url";
import compStylesCss from "~/components/ui/styles/index.css?url";

if (import.meta.env.DEV && !("sleep" in Promise))
  Object.defineProperty(Promise, "sleep", {
    value: (time: number) =>
      new Promise((res) => setTimeout(() => res(1), time)),
  });

declare global {
  interface PromiseConstructor {
    sleep(time: number): Promise<1>;
  }
}

export const Route = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { title: "Questor" },
      { name: "charset", content: "UTF-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      {
        name: "theme-color",
        content: "#e25720ff",
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
              {/* <TanStackRouterDevtools /> */}
            </TanStackQueryProvider>
          </Suspense>
          <Portal>
            <Toast.Region
              swipeDirection="down"
              translations={{
                notifications: (hotkeyPlaceholder: string) =>
                  `Notificaciones (${hotkeyPlaceholder})`,
              }}
            >
              <Toast.List class="col gap-2 z-15 fixed bottom-2 left-0 right-0 ma w-90% max-w-400px" />
            </Toast.Region>
          </Portal>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
