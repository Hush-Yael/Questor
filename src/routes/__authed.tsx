// routes/_authed.tsx - Layout route for protected pages
import { createFileRoute, redirect } from "@tanstack/solid-router";
import { getCurrentUserFn } from "~/lib/server/auth";

export const Route = createFileRoute("/__authed")({
  beforeLoad: async ({ location }) => {
    const user = await getCurrentUserFn();

    if (!user) {
      throw redirect({
        to: "/auth/login",
        search: { redirect: location.href },
      });
    }

    // Pass user to child routes
    return { user };
  },
});
