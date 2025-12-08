export enum TEAM_NAMES {
    "No Team" = "No Team",
    "The Tortell Privateers" = "The Tortell Privateers",
    "The South Pole Yetis" = "The South Pole Yetis",
    "The Confluence Captains" = "The Confluence Captains",
    "The New Prosperity Profits" = "The New Prosperity Profits",
    "The Southport Narwhals" = "The Southport Narwhals",
    "The New Ravenfall Commanders" = "The New Ravenfall Commanders",
    "The Brimstone Fire Eaters" = "The Brimstone Fire Eaters",
    "The Zmeigorod Snessengers" = "The Zmeigorod Snessengers",
    "The Haven Lights" = "The Haven Lights",
    "The Desert Spectres" = "The Desert Spectres",
    "The Ebon Gate Corruptors" = "The Ebon Gate Corruptors",
    "The Wyrmwood Stronghammers" = "The Wyrmwood Stronghammers",
    "The New Monteforte Chaos Creatures" = "The New Monteforte Chaos Creatures",
    "The Kerlauger Runeguard" = "The Kerlauger Runeguard",
    "The Starlight Bazaar Bizarres" = "The Starlight Bazaar Bizarres",
    "The Oread's Summit Tamers" = "The Oread's Summit Tamers",
    "The Greenwatch" = "The Greenwatch",
    "Oak & Onslaught" = "Oak & Onslaught",
}

export enum PRONOUNS {
    "He/Him" = "He/Him",
    "He/Them" = "He/Them",
    "She/Her" = "She/Her",
    "She/Them" = "She/Them",
    "They/Them" = "They/Them",
}

export enum ZONE {
    "Home Goal" = "Home Goal",
    "Home 2-Point" = "Home 2-Point",
    "Home Field" = "Home Field",
    "Center Field" = "Center Field",
    "Away Field" = "Away Field",
    "Away 2-Point" = "Away 2-Point",
    "Away Goal" = "Away Goal",
}

export enum ALL_ACTIONS {
    "No Action" = -1,
    "Run",
    "Pass",
    "Shoot",
    "Heal",
    "Fight",
}

export interface stats {
    // stats that matter
    pass: number;
    catch: number;
    run: number;
    block: number;
    fight: number;
    throw: number;
    luck: number;
    // player details
    pronouns: PRONOUNS | string;
    // silly stats
    literate: boolean;
    alcohol_tolerance: number;
    civic_engagement: number;
    pregame_ritual: string;
    favorite_weapon: string;
}

export interface player {
    name: string;
    team: TEAM_NAMES | string;
    stats: stats;
}

export interface stadium {
    name: string;
    location: string;
    description: string;
    modifiers: string[];
}

export interface team {
    name: TEAM_NAMES | string;
    players?: player[];
    stadium: stadium;
    luck: number;
    wins: number;
    losses: number;
    healer: player;
    activePlayers?: player[];
    inactivePlayers?: player[];
    score: number;
    slug: string;
}

export interface activePlayers {
    homeTeamActive: player[];
    homeTeamDisabled: player[];
    awayTeamActive: player[];
    awayTeamDisabled: player[];
}

export interface match {
    homeTeam: team;
    awayTeam: team;
    preGame: string;
    postGame: string;
    week: number;
    homeScore: number;
    awayScore: number;
    slug: string;
}

export interface match_progress {
    homeTeam: team;
    awayTeam: team;
    week: number;
    homeScore: number;
    awayScore: number;
    possession: player | null;
    possessionTeam: TEAM_NAMES | string;
    currentZone: ZONE;
    plays: string[];
    latestAction?: string;
}
