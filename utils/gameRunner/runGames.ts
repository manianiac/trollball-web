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

const runMatch = async (
  homeTeam: team,
  awayTeam: team,
  week: number,
  openBar: boolean,
) => {
  let gameState: match_progress = {} as match_progress;

  gameState.awayTeam = awayTeam;
  gameState.homeTeam = homeTeam;
  gameState.currentZone = ZONE["Center Field"];
  gameState.possessionTeam = TEAM_NAMES["No Team"];
  gameState.plays = [];
  gameState.awayScore = 0;
  gameState.homeScore = 0;
  gameState.week = week;
  gameState.openBar = openBar;

  await gameLoop(gameState);
};

// runMatch(
//   TEAMS["The Brimstone Fire Eaters"],
//   TEAMS["The Confluence Captains"],
//   0,
//   true
// );

const matchesToSimulate = STATIC_LEAGUE_SCHEDULE.filter(
  (match) => match.week === 7,
);
matchesToSimulate.forEach((match) => {
  console.log(match.homeTeam.name + " vs " + match.awayTeam.name);
});
// Calculate how many games should be Open Bar (25%)
const totalGames = matchesToSimulate.length;
const openBarCount = Math.floor(totalGames * 0.25);

// Create an array of indices [0, 1, 2, ... totalGames-1]
const indices = Array.from({ length: totalGames }, (_, i) => i);

// Shuffle the indices (Fisher-Yates shuffle)
for (let i = indices.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [indices[i], indices[j]] = [indices[j], indices[i]];
}

// Select the first 'openBarCount' indices to be Open Bar games
const openBarIndices = new Set(indices.slice(0, openBarCount));

const runAllMatches = async () => {
  for (let i = 0; i < matchesToSimulate.length; i++) {
    const baseMatch = matchesToSimulate[i];
    const index = i;
    baseMatch.week++;
    // Run the game simulation
    console.log(
      "generating match for " +
        baseMatch.homeTeam.name +
        " vs " +
        baseMatch.awayTeam.name +
        (openBarIndices.has(index) ? " (Open Bar)" : ""),
    );
    await runMatch(
      baseMatch.homeTeam,
      baseMatch.awayTeam,
      baseMatch.week,
      openBarIndices.has(index),
    );

    // Wait 5 seconds between matches to avoid rate limits
    console.log("Waiting 5 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
};

runAllMatches();
