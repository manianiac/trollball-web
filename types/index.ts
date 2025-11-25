import { SVGProps } from "react";

import { TEAM_NAMES } from "@/utils/consts";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
  team?: TEAM_NAMES | string;
};
