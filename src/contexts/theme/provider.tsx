import {
  type ParentProps,
  useContext,
  createEffect,
  createSignal,
} from "solid-js";
import * as z from "zod";
import ThemeContext from "./context";
import {
  setStoredTheme,
  handleThemeChange,
  setupPreferredListener,
  themeScript,
} from "~/lib/theme";
import { ScriptOnce } from "@tanstack/solid-router";
import { getStoredUserTheme, getSystemTheme } from "~/lib/theme";

export const UserThemeSchema = z
  .enum(["light", "dark", "system"])
  .catch("system");

export type UserTheme = z.infer<typeof UserThemeSchema>;

export function ThemeProvider(props: ParentProps) {
  const [userTheme, setUserTheme] =
    createSignal<UserTheme>(getStoredUserTheme());

  createEffect(() => {
    if (userTheme() !== "system") return;
    return setupPreferredListener();
  });

  const theme = userTheme();
  const appTheme = theme === "system" ? getSystemTheme() : theme;

  const setTheme = (newUserTheme: UserTheme) => {
    const validatedTheme = UserThemeSchema.parse(newUserTheme);
    setUserTheme(validatedTheme);
    setStoredTheme(validatedTheme);
    handleThemeChange(validatedTheme);
  };

  return (
    <ThemeContext.Provider value={{ userTheme, appTheme, setTheme }}>
      <ScriptOnce children={themeScript} />
      {props.children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
