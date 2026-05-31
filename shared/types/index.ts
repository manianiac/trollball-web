import { SVGProps } from "react";

import { TEAM_NAMES } from "./game";

export * from "./game";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
  team?: TEAM_NAMES | string;
};
