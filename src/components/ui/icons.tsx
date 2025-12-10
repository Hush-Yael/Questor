import type { IconProps as P } from "solid-icons";
import type { NavLinkName } from "~/components/header";
import { TbBrightnessHalf, TbSunHigh, TbMoonStars } from "solid-icons/tb";
import { FaSolidCircleCheck } from "solid-icons/fa";
import { AiFillWarning } from "solid-icons/ai";
import { FaSolidCircleInfo } from "solid-icons/fa";
import { RiDocumentBook3Line, RiDocumentBook3Fill } from "solid-icons/ri";
import { RiDocumentFileTextLine, RiDocumentFileTextFill } from "solid-icons/ri";
import { BiRegularHomeAlt2, BiSolidHomeAlt2 } from "solid-icons/bi";
import { RiUserFacesGroupLine, RiUserFacesGroupFill } from "solid-icons/ri";
import type { JSX } from "solid-js";

export default {
  sun: (p?: P) => <TbSunHigh {...p} />,
  moon: (p?: P) => <TbMoonStars {...p} />,
  system: (p?: P) => <TbBrightnessHalf {...p} />,
  msg: {
    success: (p?: P) => <FaSolidCircleCheck {...p} />,
    error: (p?: P) => <AiFillWarning {...p} />,
    info: (p?: P) => <FaSolidCircleInfo {...p} />,
  },
  nav: {
    outline: {
      home: (p?: P) => <BiRegularHomeAlt2 {...p} />,
      subjects: (p?: P) => <RiDocumentBook3Line {...p} />,
      exams: (p?: P) => <RiDocumentFileTextLine {...p} />,
      users: (p?: P) => <RiUserFacesGroupLine {...p} />,
    },
    solid: {
      home: (p?: P) => <BiSolidHomeAlt2 {...p} />,
      subjects: (p?: P) => <RiDocumentBook3Fill {...p} />,
      exams: (p?: P) => <RiDocumentFileTextFill {...p} />,
      users: (p?: P) => <RiUserFacesGroupFill {...p} />,
    },
  } as {
    outline: Record<NavLinkName, (p: P) => JSX.Element>;
    solid: Record<NavLinkName, (p: P) => JSX.Element>;
  },
} as const;
