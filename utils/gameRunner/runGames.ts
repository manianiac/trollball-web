import { TEAMS } from "../teams";
import { TEAM_NAMES, ZONE, match, match_progress, team } from "@/utils/types";

import { gameLoop } from "./gameFiles/gameRunner";
import path from "path";
import fs from "fs";
import { STATIC_LEAGUE_SCHEDULE } from "./schedule";
import { TeamIcon } from "@/components/icons";

// let ng = generateNameGenerator();
// let oo = generateTeam(TEAM_NAMES["Oak & Onslaught"], ng);

// let gw = generateTeam(TEAM_NAMES["The Greenwatch"], ng);

// fs.writeFile(`./Oak.json`, JSON.stringify(oo), "utf8", (err) => {
//   if (err) {
//     console.error("Error writing to file", err);
//   } else {
//     console.log(`Data written to JSON.`);
//   }
// });
// fs.writeFile(`./green.json`, JSON.stringify(gw), "utf8", (err) => {
//   if (err) {
//     console.error("Error writing to file", err);
//   } else {
//     console.log(`Data written to JSON.`);
//   }
// });

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

// runMatch(
//   TEAMS["The Brimstone Fire Eaters"],
//   TEAMS["The Confluence Captains"],
//   0
// );

STATIC_LEAGUE_SCHEDULE.filter((match) => match.week === 3).forEach(
  (baseMatch) => {
    baseMatch.week++;
    // Run the game simulation
    console.log(
      "generating match for " +
        baseMatch.homeTeam.name +
        " vs " +
        baseMatch.awayTeam.name
    );
    runMatch(baseMatch.homeTeam, baseMatch.awayTeam, baseMatch.week);
  }
);
