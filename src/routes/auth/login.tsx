import { createFileRoute } from "@tanstack/solid-router";
import Sign from "~/components/sign-[in-up]";

export const Route = createFileRoute("/auth/login")({
  component: () => <Sign type="login" />,
  head: () => ({
    meta: [{ title: "Iniciar sesión | Questor" }],
  }),
});
