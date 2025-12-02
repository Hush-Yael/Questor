import { createContext, type Accessor } from "solid-js";
import type { UserTheme } from "./provider";
import type { AppTheme } from "~/lib/theme";

type ThemeContextProps = {
  userTheme: Accessor<UserTheme>;
  appTheme: AppTheme;
  setTheme: (theme: UserTheme) => void;
};

export default createContext<ThemeContextProps | undefined>(undefined);
