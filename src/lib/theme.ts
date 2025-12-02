import z from "zod";
import { createIsomorphicFn } from "@tanstack/solid-start";
import { UserThemeSchema, type UserTheme } from "~/contexts/theme/provider";
import { createClientOnlyFn } from "@tanstack/solid-start";

export const themeStorageKey = "ui-theme";

const postThemeValidator = z.union([z.literal("true"), z.literal("false")]);
const AppThemeSchema = z.enum(["light", "dark"]).catch("light");

export type Theme = z.infer<typeof postThemeValidator>;
export type AppTheme = z.infer<typeof AppThemeSchema>;

export const setStoredTheme = createClientOnlyFn((theme: UserTheme) => {
  const validatedTheme = UserThemeSchema.parse(theme);
  localStorage.setItem(themeStorageKey, validatedTheme);
});

const change = (theme: UserTheme) => {
  const root = document.documentElement;
  root.classList.remove("light", "dark", "system");

  if (theme === "system") {
    const systemTheme = getSystemTheme();
    root.classList.add(systemTheme, "system");
  } else {
    root.classList.add(theme);
  }
};

export const handleThemeChange = createClientOnlyFn((userTheme: UserTheme) => {
  const validatedTheme = UserThemeSchema.parse(userTheme);

  document.startViewTransition
    ? document.startViewTransition(() => {
        change(validatedTheme);
      })
    : change(validatedTheme);
});

export const setupPreferredListener = createClientOnlyFn(() => {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => handleThemeChange("system");
  media.addEventListener("change", handler);
  return () => media.removeEventListener("change", handler);
});

export const getStoredUserTheme = createIsomorphicFn()
  .server((): UserTheme => "system")
  .client((): UserTheme => {
    const stored = localStorage.getItem(themeStorageKey);
    return UserThemeSchema.parse(stored);
  });

export const getSystemTheme = createIsomorphicFn()
  .server((): AppTheme => "light")
  .client((): AppTheme => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

export const themeScript = (function () {
  function themeFn() {
    const storedTheme = localStorage.getItem("ui-theme") || "system";
    const validTheme = ["light", "dark", "system"].includes(storedTheme)
      ? storedTheme
      : "system";

    const isDark =
      (validTheme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches) ||
      validTheme === "dark";

    document.documentElement.classList.add(isDark ? "dark" : "light");
  }
  return `(${themeFn.toString()})();`;
})();
