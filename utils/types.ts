
export enum TEAM_NAMES {
    "Oak & Onslaught" = "Oak & Onslaught",
    "The Brimstone Fire Eaters" = "The Brimstone Fire Eaters",
    "The Confluence Captains" = "The Confluence Captains",
    "The Desert Spectres" = "The Desert Spectres",
    "The Ebon Gate Corruptors" = "The Ebon Gate Corruptors",
    "The Greenwatch" = "The Greenwatch",
    "The Haven Lights" = "The Haven Lights",
    "The Kerlauger Runeguard" = "The Kerlauger Runeguard",
    "The New Monteforte Chaos Creatures" = "The New Monteforte Chaos Creatures",
    "The New Prosperity Profits" = "The New Prosperity Profits",
    "The New Ravenfall Commanders" = "The New Ravenfall Commanders",
    "The Oread's Summit Tamers" = "The Oread's Summit Tamers",
    "The South Pole Yetis" = "The South Pole Yetis",
    "The Southport Narwhals" = "The Southport Narwhals",
    "The Starlight Bazaar Bizarres" = "The Starlight Bazaar Bizarres",
    "The Tortell Privateers" = "The Tortell Privateers",
    "The Wyrmwood Stronghammers" = "The Wyrmwood Stronghammers",
    "The Zmeigorod Snessengers" = "The Zmeigorod Snessengers",
    "No Team" = "No Team",
}

export enum ALL_ACTIONS {
    Run = "Run",
    Pass = "Pass",
    Shoot = "Shoot",
    Heal = "Heal",
    Fight = "Fight",
    "No Action" = "No Action",
}

export const PRONOUNS = [
    "He/Him",
    "She/Her",
    "They/Them"
] as const;

export type Pronoun = typeof PRONOUNS[number];

export enum ZONE {
    "Home End Zone" = "Home End Zone",
    "Home Field" = "Home Field",
    "Center Field" = "Center Field",
    "Away Field" = "Away Field",
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

export interface team {
    name: TEAM_NAMES;
    slug: string;
    losses: number;
    wins: number;
    score: number;
    luck: number;
    stadium: {
        name: string;
        location: string;
        description: string;
        modifiers: string[];
    };
    healer: player;
    players: player[];
    activePlayers?: player[];
    inactivePlayers?: player[];
}

export interface match {
    homeTeam: team;
    awayTeam: team;
    homeScore: number;
    awayScore: number;
    week: number;
    plays: string[];
}

export interface match_progress extends match {
    openBar?: boolean;
    possession: player;
    possessionTeam: TEAM_NAMES | string;
    currentZone: ZONE;
    latestAction?: string;
}
