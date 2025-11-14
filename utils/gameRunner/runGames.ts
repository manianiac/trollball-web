import { TEAMS } from "../teams";
import { TEAM_NAMES, TROLLBALL_CONTEXT, ZONE, match_progress } from "../consts";

import { gameLoop } from "./gameFiles/gameRunner";

let gameState: match_progress = {} as match_progress;

gameState.awayTeam = TEAMS["The Confluence Captains"];
gameState.homeTeam = TEAMS["The South Pole Yetis"];
gameState.currentZone = ZONE["Center Field"];
gameState.possessionTeam = TEAM_NAMES["No Team"];
gameState.plays = [];
gameState.awayScore = 0;
gameState.homeScore = 0;
gameState.date = 0;

gameLoop(gameState);
