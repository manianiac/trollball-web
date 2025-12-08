import { SVGProps } from "react";

import { TEAM_NAMES } from "@/utils/types";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
  team?: TEAM_NAMES | string;
};
