import { createFileRoute } from "@tanstack/solid-router";
import { useServerFn } from "@tanstack/solid-start";
import { logoutFn } from "~/lib/server/auth";

export const Route = createFileRoute("/__authed/")({ component: App });

function App() {
  const context = Route.useRouteContext();
  const { user } = context();
  const logout = useServerFn(logoutFn);

  return (
    <main>
      Hola, {user?.username || "<usuario>"}
      <button onClick={[logout, undefined]}>Cerrar sesión</button>
    </main>
  );
}
