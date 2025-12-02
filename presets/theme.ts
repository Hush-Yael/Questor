import type { Theme } from "unocss/preset-wind4";

const theme: Theme = {
  radius: {
    selector: "1rem",
    field: "0",
    box: "0.5rem",
  },
  colors: {
    base: {
      DEFAULT: "var(--base-background)",
      text: "var(--base-text)",
    },
    elevated: {
      DEFAULT: "var(--elevated-background)",
    },
    primary: {
      DEFAULT: "var(--primary)",
      hover: "var(--primary-hover)",
      text: "var(--primary-text)",
    },
    secondary: {
      DEFAULT: "var(--secondary)",
      hover: "var(--secondary-hover)",
      text: "var(--secondary-text)",
    },
    highlight: {
      DEFAULT: "var(--highlight)",
      text: "var(--highlight-text)",
    },
    muted: {
      DEFAULT: "var(--muted)",
      text: "var(--muted-text)",
    },
    danger: {
      DEFAULT: "var(--danger)",
      text: "var(--danger-text)",
    },
    info: {
      DEFAULT: "var(--info)",
      text: "var(--info-text)",
    },
    success: {
      DEFAULT: "var(--success)",
      text: "var(--success-text)",
    },
    warning: {
      DEFAULT: "var(--warning)",
      text: "var(--warning-text)",
    },
    border: "var(--border)",
    input: "var(--input)",
    ring: "var(--ring)",
  },
};
export default theme;
