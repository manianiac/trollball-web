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
  bracket: string = "Winners",
  seriesGames?: match[],
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
  gameState.bracket = bracket;

  await gameLoop(gameState, seriesGames);
};

// Helper to find previous games in the series
const findPreviousSeriesGames = (homeTeam: team, awayTeam: team): match[] => {
  const resultsDir = path.join(process.cwd(), "utils", "gameRunner", "results");

  if (!fs.existsSync(resultsDir)) {
    return [];
  }

  const allFiles = fs.readdirSync(resultsDir);

  const relevantGames: match[] = [];

  for (const file of allFiles) {
    if (!file.endsWith(".json")) continue;

    try {
      const filePath = path.join(resultsDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const gameData = JSON.parse(fileContent);

      // Check if this game involves the same two teams (in either order)
      const isSameMatchup =
        (gameData.homeTeam.slug === homeTeam.slug &&
          gameData.awayTeam.slug === awayTeam.slug) ||
        (gameData.homeTeam.slug === awayTeam.slug &&
          gameData.awayTeam.slug === homeTeam.slug);

      if (isSameMatchup) {
        relevantGames.push(gameData);
      }
    } catch (err) {
      console.warn(`Error parsing file ${file}:`, err);
    }
  }

  // Sort by week/index (ascending)
  relevantGames.sort((a, b) => a.week - b.week);

  return relevantGames;
};

let matchesToSimulate =
  [
    /* Matchup 1: Confluence vs Oread's Summit */
    // {
    //   "homeTeam": TEAMS["The Confluence Captains"],
    //   "awayTeam": TEAMS["The New Monteforte Chaos Creatures"],
    //   "week": 1,
    //   "openBar": true,
    //   "bracket": "Losers"
    // },
    // {
    //   "homeTeam": TEAMS["The New Monteforte Chaos Creatures"],
    //   "awayTeam": TEAMS["The Confluence Captains"],
    //   "week": 2,
    //   "openBar": true,
    //   "bracket": "Losers"
    // },
    // {
    //   "homeTeam": TEAMS["The Confluence Captains"],
    //   "awayTeam": TEAMS["The New Monteforte Chaos Creatures"],
    //   "week": 3,
    //   "openBar": false,
    //   "bracket": "Losers"
    // },

    /* Matchup 2: Haven Lights vs Oak & Onslaught */
    {
      "homeTeam": TEAMS["The Haven Lights"],
      "awayTeam": TEAMS["The Starlight Bazaar Bizarres"],
      "week": 1,
      "openBar": true,
      "bracket": "Losers"
    },
    {
      "homeTeam": TEAMS["The Starlight Bazaar Bizarres"],
      "awayTeam": TEAMS["The Haven Lights"],
      "week": 2,
      "openBar": true,
      "bracket": "Losers"
    },
    {
      "awayTeam": TEAMS["The Starlight Bazaar Bizarres"],
      "homeTeam": TEAMS["The Haven Lights"],
      "week": 3,
      "openBar": false,
      "bracket": "Losers"
    },
  ];

// runMatch(
//   TEAMS["The Desert Spectres"],
//   TEAMS["The New Monteforte Chaos Creatures"],
//   -1,
//   true
// );

// const matchesToSimulate = STATIC_LEAGUE_SCHEDULE.filter(
//   (match) => match.week === 7,
// );
// matchesToSimulate.forEach((match) => {
//   console.log(match.homeTeam.name + " vs " + match.awayTeam.name);
// });
// // Calculate how many games should be Open Bar (25%)
// const totalGames = matchesToSimulate.length;
// const openBarCount = Math.floor(totalGames * 0.25);

// // Create an array of indices [0, 1, 2, ... totalGames-1]
// const indices = Array.from({ length: totalGames }, (_, i) => i);

// // Shuffle the indices (Fisher-Yates shuffle)
// for (let i = indices.length - 1; i > 0; i--) {
//   const j = Math.floor(Math.random() * (i + 1));
//   [indices[i], indices[j]] = [indices[j], indices[i]];
// }

// // Select the first 'openBarCount' indices to be Open Bar games
// const openBarIndices = new Set(indices.slice(0, openBarCount));

const runAllMatches = async () => {
  for (let i = 0; i < matchesToSimulate.length; i++) {
    const baseMatch = matchesToSimulate[i];
    // baseMatch.week++;
    // Run the game simulation
    console.log(
      "generating match for " +
      baseMatch.homeTeam.name +
      " vs " +
      baseMatch.awayTeam.name,
    );

    const seriesGames = findPreviousSeriesGames(
      baseMatch.homeTeam,
      baseMatch.awayTeam,
    );
    console.log(`Found ${seriesGames.length} previous games in this series.`);

    // Check for Series Win (2 wins needed)
    let homeWins = 0;
    let awayWins = 0;
    // Determine wins based on slug or saved score data in 'seriesGames'
    seriesGames.forEach((g) => {
      // Identify the winner of the stored game
      let winnerSlug = "";
      const gh = g.homeTeam as any; // Cast to any to avoid Partial<Team> issues
      const ga = g.awayTeam as any;

      if (g.homeScore > g.awayScore) winnerSlug = gh.slug;
      else if (g.awayScore > g.homeScore) winnerSlug = ga.slug;

      const baseHome = baseMatch.homeTeam as any;
      const baseAway = baseMatch.awayTeam as any;

      if (winnerSlug === baseHome.slug) homeWins++;
      if (winnerSlug === baseAway.slug) awayWins++;
    });

    if (homeWins >= 2 || awayWins >= 2) {
      console.log(
        `Skipping match ${baseMatch.homeTeam.name} vs ${baseMatch.awayTeam.name} (Week ${baseMatch.week}) - Series already decided (${Math.max(homeWins, awayWins)}-${Math.min(homeWins, awayWins)}).`,
      );
      continue;
    }

    // Check if THIS specific game file already exists to avoid re-simulating
    const potentialSlug = `po-5-${baseMatch.week}-${baseMatch.homeTeam.slug}-${baseMatch.awayTeam.slug}`;
    const potentialPath = path.join(
      process.cwd(),
      "utils",
      "gameRunner",
      "results",
      `${potentialSlug}.json`,
    );

    if (fs.existsSync(potentialPath)) {
      console.log(
        `Skipping match ${baseMatch.homeTeam.slug} vs ${baseMatch.awayTeam.slug} (Week ${baseMatch.week}) - File already exists.`,
      );
      continue;
    }

    await runMatch(
      baseMatch.homeTeam,
      baseMatch.awayTeam,
      baseMatch.week,
      baseMatch.openBar,
      (baseMatch as any).bracket || "Winners",
      seriesGames,
    );

    // Wait 5 seconds between matches to avoid rate limits
    console.log("Waiting 5 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
};

runAllMatches();
