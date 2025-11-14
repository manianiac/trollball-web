import { TEAMS } from "../teams";
import { TEAM_NAMES, ZONE, match_progress, team } from "../consts";

import { gameLoop } from "./gameFiles/gameRunner";

// gameState.awayTeam = TEAMS["The Confluence Captains"];
// gameState.homeTeam = TEAMS["The South Pole Yetis"];
// gameState.currentZone = ZONE["Center Field"];
// gameState.possessionTeam = TEAM_NAMES["No Team"];
// gameState.plays = [];
// gameState.awayScore = 0;
// gameState.homeScore = 0;
// gameState.week = 0;

// gameLoop(gameState);

const runMatch = (homeTeam: team, awayTeam: team, week: number) => {
  let gameState: match_progress = {} as match_progress;

  gameState.awayTeam = awayTeam;
  gameState.homeTeam = homeTeam;
  gameState.currentZone = ZONE["Center Field"];
  gameState.possessionTeam = TEAM_NAMES["No Team"];
  gameState.plays = [];
  gameState.awayScore = 0;
  gameState.homeScore = 0;
  gameState.week = week;

  gameLoop(gameState);
};

runMatch(
  TEAMS["The Kerlauger Runeguard"],
  TEAMS["The Zmeigorod Snessengers"],
  1
);
