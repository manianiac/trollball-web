export const TEAM_NAMES = {
  "Oak & Onslaught": "Oak & Onslaught",
  "The Brimstone Slayers": "The Brimstone Slayers",
  "The Confluence Captains": "The Confluence Captains",
  "The Dark Tree Demon Kids": "The Dark Tree Demon Kids",
  "The Desert Spectres": "The Desert Spectres",
  "The Ebon Gate Corruptors": "The Ebon Gate Corruptors",
  "The Haven Lights": "The Haven Lights",
  "The New Monteforte Chaos Creatures": "The New Monteforte Chaos Creatures",
  "The New Noxus Thorns": "The New Noxus Thorns",
  "The New Prosperity Profits": "The New Prosperity Profits",
  "The New Ravenfall Commanders": "The New Ravenfall Commanders",
  "The Southport Narwhals": "The Southport Narwhals",
  "The Tortell Privateers": "The Tortell Privateers",
  "The Zmeigorod Snessengers": "The Zmeigorod Snessengers",
  "No Team": "No Team",
} as const;

export type TEAM_NAMES = (typeof TEAM_NAMES)[keyof typeof TEAM_NAMES];

export enum ALL_ACTIONS {
  Run = "Run",
  Pass = "Pass",
  Shoot = "Shoot",
  Heal = "Heal",
  Fight = "Fight",
  "No Action" = "No Action",
}

export const PRONOUNS = ["He/Him", "She/Her", "They/Them"] as const;

export type Pronoun = (typeof PRONOUNS)[number];

export enum ZONE {
  "Home End Zone" = "Home End Zone",
  "Home 2-Point" = "Home 2-Point",
  "Home Field" = "Home Field",
  "Center Field" = "Center Field",
  "Away Field" = "Away Field",
  "Away 2-Point" = "Away 2-Point",
  "Away End Zone" = "Away End Zone",
}

export interface player {
  name: string;
  team: TEAM_NAMES;
  stats: stats;
}

export interface stats {
  pass: number;
  catch: number;
  run: number;
  block: number;
  fight: number;
  throw: number;
  luck: number;
  pronouns: string;
  civic_engagement: number;
  alcohol_tolerance: number;
  favorite_weapon: string;
  pregame_ritual: string;
  literate: boolean;
  current_alcohol?: number; // Added based on usage in generatePlayer.ts
}

export interface stadium {
  name: string;
  location: string;
  description: string;
  modifiers: string[];
}

export interface team {
  name: TEAM_NAMES;
  slug: string;
  losses: number;
  wins: number;
  score: number;
  luck: number;
  stadium: stadium;
  healer: player;
  players: player[];
  activePlayers?: player[];
  inactivePlayers?: player[];
  sponsor?: string;
}

export interface match {
  // trimmedGame property removed as it caused build errors and isn't populated

  homeTeam: team | {};
  awayTeam: team | {};
  homeScore: number;
  awayScore: number;
  week: number;
  slug: string;
  preGame: string;
  postGame: string;
  plays: string[];
  openBar?: boolean;
  bracket?: string;
  activeModifiers?: string[];
}

export interface match_progress extends match {
  homeTeam: team;
  awayTeam: team;
  openBar?: boolean;
  possession: player | null;
  possessionTeam: TEAM_NAMES | string;
  currentZone: ZONE;
  latestAction?: string;
  bracket?: string; // e.g. "Winners", "Losers"
  forfeit?: boolean;
  activeModifiers?: string[];
}
