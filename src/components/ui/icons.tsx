import type { IconProps as P } from "solid-icons";
import { TbBrightnessHalf, TbSunHigh, TbMoonStars } from "solid-icons/tb";

export default {
  sun: (p: P) => <TbSunHigh {...p} />,
  moon: (p: P) => <TbMoonStars {...p} />,
  system: (p: P) => <TbBrightnessHalf {...p} />,
} as const;
