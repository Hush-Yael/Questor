import { createFileRoute } from "@tanstack/solid-router";
import Sign from "~/components/sign-[in-up]";

export const Route = createFileRoute("/auth/signup")({
  component: () => <Sign type="signup" />,
  head: () => ({
    meta: [{ title: "Crear cuenta | Questor" }],
  }),
});
