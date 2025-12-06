import type { IconProps as P } from "solid-icons";
import { TbBrightnessHalf, TbSunHigh, TbMoonStars } from "solid-icons/tb";
import { FaSolidCircleCheck } from "solid-icons/fa";
import { AiFillWarning } from "solid-icons/ai";
import { FaSolidCircleInfo } from "solid-icons/fa";

export default {
  sun: (p?: P) => <TbSunHigh {...p} />,
  moon: (p?: P) => <TbMoonStars {...p} />,
  system: (p?: P) => <TbBrightnessHalf {...p} />,
  msg: {
    success: (p?: P) => <FaSolidCircleCheck {...p} />,
    error: (p?: P) => <AiFillWarning {...p} />,
    info: (p?: P) => <FaSolidCircleInfo {...p} />,
  },
} as const;
