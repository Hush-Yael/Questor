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
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
    },
  });
}
