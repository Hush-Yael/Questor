// utils/session.ts
import { useSession } from "@tanstack/solid-start/server";

type SessionData = {
  userId?: string;
  role?: string;
};

export function useAppSession() {
  return useSession<SessionData>({
    name: "app-session",
    password: process.env.SESSION_SECRET!,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
    },
  });
}
