import { TEAM_NAMES } from "@/utils/consts";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
  team?: TEAM_NAMES | string;
};
