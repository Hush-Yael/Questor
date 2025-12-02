import {
  defineConfig,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";
import appTheme from "./presets/theme";

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: true,
      },
    }),
  ],
  theme: appTheme,
  transformers: [transformerVariantGroup(), transformerDirectives()],
});
