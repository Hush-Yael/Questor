import type { IconProps as P } from "solid-icons";
import { TbBrightnessHalf, TbSun, TbMoonStars } from "solid-icons/tb";

export default {
  sun: (p: P) => <TbSun {...p} />,
  moon: (p: P) => <TbMoonStars {...p} />,
  system: (p: P) => <TbBrightnessHalf {...p} />,
} as const;
