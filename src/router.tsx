import { createRouter } from "@tanstack/solid-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import ErrorComponent from "~/components/error-component";
import { QueryClient } from "@tanstack/solid-query";
import { setupRouterSsrQueryIntegration } from "@tanstack/solid-router-ssr-query";

// Create a new router instance
export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: {
      queryClient,
    },
    scrollRestoration: true,
    defaultNotFoundComponent: () => <h1>No se encontró la ruta solicitada</h1>,
    defaultErrorComponent: (e) => <ErrorComponent {...e} />,
    defaultPendingComponent: () => (
      <div
        class="box col items-center gap-y-4 fixed z-50 inset-0 size-max ma p-4 pt-6 font-bold text-xl"
        role="status"
      >
        <div class="loader size-7" />
        Cargando...
      </div>
    ),
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });
  return router;
};
