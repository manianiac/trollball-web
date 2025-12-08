import { TEAMS } from "../teams";
import { team, TEAM_NAMES } from "@/utils/types"; // Ensure team interface is correct

/**
 * Defines the structure for a pre-season match in the hard-coded schedule.
 */
interface BaseMatch {
  homeTeam: team;
  awayTeam: team;
  week: number;
}

// --- The Week 7 (Now New Week 0) Matches ---
const NEW_WEEK_0_MATCHES: BaseMatch[] = [
  {
    homeTeam: TEAMS[TEAM_NAMES["The Brimstone Fire Eaters"]],
    awayTeam: TEAMS[TEAM_NAMES["The Desert Spectres"]],
    week: 0, // NEW Week 0
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Confluence Captains"]],
    awayTeam: TEAMS[TEAM_NAMES["The New Ravenfall Commanders"]],
    week: 0, // NEW Week 0
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Ebon Gate Corruptors"]],
    awayTeam: TEAMS[TEAM_NAMES["The Zmeigorod Snessengers"]],
    week: 0, // NEW Week 0
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Haven Lights"]],
    awayTeam: TEAMS[TEAM_NAMES["The Wyrmwood Stronghammers"]],
    week: 0, // NEW Week 0
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The New Monteforte Chaos Creatures"]],
    awayTeam: TEAMS[TEAM_NAMES["The Kerlauger Runeguard"]],
    week: 0, // NEW Week 0
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The New Prosperity Profits"]],
    awayTeam: TEAMS[TEAM_NAMES["The Greenwatch"]],
    week: 0, // NEW Week 0
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["Oak & Onslaught"]],
    awayTeam: TEAMS[TEAM_NAMES["The South Pole Yetis"]],
    week: 0, // NEW Week 0
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Oread's Summit Tamers"]],
    awayTeam: TEAMS[TEAM_NAMES["The Starlight Bazaar Bizarres"]],
    week: 0, // NEW Week 0
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Tortell Privateers"]],
    awayTeam: TEAMS[TEAM_NAMES["The Southport Narwhals"]],
    week: 0, // NEW Week 0
  },
];

/**
 * The official, hard-coded schedule for the league.
 * Generated from the round-robin list provided by the user.
 */
export const STATIC_LEAGUE_SCHEDULE: BaseMatch[] = [
  // --- NEW WEEK 0 ---
  ...NEW_WEEK_0_MATCHES,

  // --- WEEKS 1-7 (Shifted from 0-6) ---

  // Former Week 0 (Now Week 1)
  {
    homeTeam: TEAMS[TEAM_NAMES["The Tortell Privateers"]],
    awayTeam: TEAMS[TEAM_NAMES["The New Ravenfall Commanders"]],
    week: 1,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Desert Spectres"]],
    awayTeam: TEAMS[TEAM_NAMES["The Starlight Bazaar Bizarres"]],
    week: 1,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Southport Narwhals"]],
    awayTeam: TEAMS[TEAM_NAMES["The South Pole Yetis"]],
    week: 1,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Brimstone Fire Eaters"]],
    awayTeam: TEAMS[TEAM_NAMES["The Wyrmwood Stronghammers"]],
    week: 1,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Confluence Captains"]],
    awayTeam: TEAMS[TEAM_NAMES["The Zmeigorod Snessengers"]],
    week: 1,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Oread's Summit Tamers"]],
    awayTeam: TEAMS[TEAM_NAMES["The Kerlauger Runeguard"]],
    week: 1,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["Oak & Onslaught"]],
    awayTeam: TEAMS[TEAM_NAMES["The Greenwatch"]],
    week: 1,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Haven Lights"]],
    awayTeam: TEAMS[TEAM_NAMES["The New Prosperity Profits"]],
    week: 1,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Ebon Gate Corruptors"]],
    awayTeam: TEAMS[TEAM_NAMES["The New Monteforte Chaos Creatures"]],
    week: 1,
  },

  // Former Week 1 (Now Week 2)
  {
    homeTeam: TEAMS[TEAM_NAMES["The Starlight Bazaar Bizarres"]],
    awayTeam: TEAMS[TEAM_NAMES["The Tortell Privateers"]],
    week: 2,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The New Ravenfall Commanders"]],
    awayTeam: TEAMS[TEAM_NAMES["The South Pole Yetis"]],
    week: 2,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Desert Spectres"]],
    awayTeam: TEAMS[TEAM_NAMES["The Wyrmwood Stronghammers"]],
    week: 2,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Southport Narwhals"]],
    awayTeam: TEAMS[TEAM_NAMES["The Zmeigorod Snessengers"]],
    week: 2,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Brimstone Fire Eaters"]],
    awayTeam: TEAMS[TEAM_NAMES["The Kerlauger Runeguard"]],
    week: 2,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Confluence Captains"]],
    awayTeam: TEAMS[TEAM_NAMES["The Greenwatch"]],
    week: 2,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Oread's Summit Tamers"]],
    awayTeam: TEAMS[TEAM_NAMES["The New Prosperity Profits"]],
    week: 2,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["Oak & Onslaught"]],
    awayTeam: TEAMS[TEAM_NAMES["The New Monteforte Chaos Creatures"]],
    week: 2,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Haven Lights"]],
    awayTeam: TEAMS[TEAM_NAMES["The Ebon Gate Corruptors"]],
    week: 2,
  },

  // Former Week 2 (Now Week 3)
  {
    homeTeam: TEAMS[TEAM_NAMES["The Tortell Privateers"]],
    awayTeam: TEAMS[TEAM_NAMES["The South Pole Yetis"]],
    week: 3,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Starlight Bazaar Bizarres"]],
    awayTeam: TEAMS[TEAM_NAMES["The Wyrmwood Stronghammers"]],
    week: 3,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The New Ravenfall Commanders"]],
    awayTeam: TEAMS[TEAM_NAMES["The Zmeigorod Snessengers"]],
    week: 3,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Desert Spectres"]],
    awayTeam: TEAMS[TEAM_NAMES["The Kerlauger Runeguard"]],
    week: 3,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Southport Narwhals"]],
    awayTeam: TEAMS[TEAM_NAMES["The Greenwatch"]],
    week: 3,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Brimstone Fire Eaters"]],
    awayTeam: TEAMS[TEAM_NAMES["The New Prosperity Profits"]],
    week: 3,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Confluence Captains"]],
    awayTeam: TEAMS[TEAM_NAMES["The New Monteforte Chaos Creatures"]],
    week: 3,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Oread's Summit Tamers"]],
    awayTeam: TEAMS[TEAM_NAMES["The Ebon Gate Corruptors"]],
    week: 3,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["Oak & Onslaught"]],
    awayTeam: TEAMS[TEAM_NAMES["The Haven Lights"]],
    week: 3,
  },

  // Former Week 3 (Now Week 4)
  {
    homeTeam: TEAMS[TEAM_NAMES["The Wyrmwood Stronghammers"]],
    awayTeam: TEAMS[TEAM_NAMES["The Tortell Privateers"]],
    week: 4,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The South Pole Yetis"]],
    awayTeam: TEAMS[TEAM_NAMES["The Zmeigorod Snessengers"]],
    week: 4,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Starlight Bazaar Bizarres"]],
    awayTeam: TEAMS[TEAM_NAMES["The Kerlauger Runeguard"]],
    week: 4,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The New Ravenfall Commanders"]],
    awayTeam: TEAMS[TEAM_NAMES["The Greenwatch"]],
    week: 4,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Desert Spectres"]],
    awayTeam: TEAMS[TEAM_NAMES["The New Prosperity Profits"]],
    week: 4,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Southport Narwhals"]],
    awayTeam: TEAMS[TEAM_NAMES["The New Monteforte Chaos Creatures"]],
    week: 4,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Brimstone Fire Eaters"]],
    awayTeam: TEAMS[TEAM_NAMES["The Ebon Gate Corruptors"]],
    week: 4,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Confluence Captains"]],
    awayTeam: TEAMS[TEAM_NAMES["The Haven Lights"]],
    week: 4,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Oread's Summit Tamers"]],
    awayTeam: TEAMS[TEAM_NAMES["Oak & Onslaught"]],
    week: 4,
  },

  // Former Week 4 (Now Week 5)
  {
    homeTeam: TEAMS[TEAM_NAMES["The Tortell Privateers"]],
    awayTeam: TEAMS[TEAM_NAMES["The Zmeigorod Snessengers"]],
    week: 5,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Wyrmwood Stronghammers"]],
    awayTeam: TEAMS[TEAM_NAMES["The Kerlauger Runeguard"]],
    week: 5,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The South Pole Yetis"]],
    awayTeam: TEAMS[TEAM_NAMES["The Greenwatch"]],
    week: 5,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Starlight Bazaar Bizarres"]],
    awayTeam: TEAMS[TEAM_NAMES["The New Prosperity Profits"]],
    week: 5,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The New Ravenfall Commanders"]],
    awayTeam: TEAMS[TEAM_NAMES["The New Monteforte Chaos Creatures"]],
    week: 5,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Desert Spectres"]],
    awayTeam: TEAMS[TEAM_NAMES["The Ebon Gate Corruptors"]],
    week: 5,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Southport Narwhals"]],
    awayTeam: TEAMS[TEAM_NAMES["The Haven Lights"]],
    week: 5,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Brimstone Fire Eaters"]],
    awayTeam: TEAMS[TEAM_NAMES["Oak & Onslaught"]],
    week: 5,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Confluence Captains"]],
    awayTeam: TEAMS[TEAM_NAMES["The Oread's Summit Tamers"]],
    week: 5,
  },

  // Former Week 5 (Now Week 6)
  {
    homeTeam: TEAMS[TEAM_NAMES["The Kerlauger Runeguard"]],
    awayTeam: TEAMS[TEAM_NAMES["The Tortell Privateers"]],
    week: 6,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Zmeigorod Snessengers"]],
    awayTeam: TEAMS[TEAM_NAMES["The Greenwatch"]],
    week: 6,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Wyrmwood Stronghammers"]],
    awayTeam: TEAMS[TEAM_NAMES["The New Prosperity Profits"]],
    week: 6,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The South Pole Yetis"]],
    awayTeam: TEAMS[TEAM_NAMES["The New Monteforte Chaos Creatures"]],
    week: 6,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Starlight Bazaar Bizarres"]],
    awayTeam: TEAMS[TEAM_NAMES["The Ebon Gate Corruptors"]],
    week: 6,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The New Ravenfall Commanders"]],
    awayTeam: TEAMS[TEAM_NAMES["The Haven Lights"]],
    week: 6,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Desert Spectres"]],
    awayTeam: TEAMS[TEAM_NAMES["Oak & Onslaught"]],
    week: 6,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Southport Narwhals"]],
    awayTeam: TEAMS[TEAM_NAMES["The Oread's Summit Tamers"]],
    week: 6,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Brimstone Fire Eaters"]],
    awayTeam: TEAMS[TEAM_NAMES["The Confluence Captains"]],
    week: 6,
  },

  // Former Week 6 (Now Week 7)
  {
    homeTeam: TEAMS[TEAM_NAMES["The Tortell Privateers"]],
    awayTeam: TEAMS[TEAM_NAMES["The Greenwatch"]],
    week: 7,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Kerlauger Runeguard"]],
    awayTeam: TEAMS[TEAM_NAMES["The New Prosperity Profits"]],
    week: 7,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Zmeigorod Snessengers"]],
    awayTeam: TEAMS[TEAM_NAMES["The New Monteforte Chaos Creatures"]],
    week: 7,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Wyrmwood Stronghammers"]],
    awayTeam: TEAMS[TEAM_NAMES["The Ebon Gate Corruptors"]],
    week: 7,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The South Pole Yetis"]],
    awayTeam: TEAMS[TEAM_NAMES["The Haven Lights"]],
    week: 7,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Starlight Bazaar Bizarres"]],
    awayTeam: TEAMS[TEAM_NAMES["Oak & Onslaught"]],
    week: 7,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The New Ravenfall Commanders"]],
    awayTeam: TEAMS[TEAM_NAMES["The Oread's Summit Tamers"]],
    week: 7,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Desert Spectres"]],
    awayTeam: TEAMS[TEAM_NAMES["The Confluence Captains"]],
    week: 7,
  },
  {
    homeTeam: TEAMS[TEAM_NAMES["The Southport Narwhals"]],
    awayTeam: TEAMS[TEAM_NAMES["The Brimstone Fire Eaters"]],
    week: 7,
  },
];
