import { TEAMS } from "@/shared/teams";
import { TEAM_NAMES, ZONE, match, match_progress, team } from "@/shared/types";

import { gameLoop } from "@/simulator/gameRunner";
import path from "path";
import fs from "fs";
import { STATIC_LEAGUE_SCHEDULE } from "@/shared/schedule";

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
  gameState.openBar = openBar;

  await gameLoop(gameState, seriesGames);
};

// Helper to find previous games in the series
const findPreviousSeriesGames = (homeTeam: team, awayTeam: team): match[] => {
  const resultsDir = path.join(process.cwd(), "runner", "results");

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

const runAllMatches = async () => {
  const resultsDir = path.join(process.cwd(), "runner", "results");
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  // 1. Group the static regular season schedule by week
  const matchesByWeek: Record<number, typeof STATIC_LEAGUE_SCHEDULE> = {};
  STATIC_LEAGUE_SCHEDULE.forEach((match) => {
    if (!matchesByWeek[match.week]) {
      matchesByWeek[match.week] = [];
    }
    matchesByWeek[match.week].push(match);
  });

  // Find the first regular season week that has at least one unsimulated match
  const weeks = Object.keys(matchesByWeek)
    .map(Number)
    .sort((a, b) => a - b);
  let targetWeek: number | null = null;
  let unsimulatedMatchesInTargetWeek: typeof STATIC_LEAGUE_SCHEDULE = [];

  for (const week of weeks) {
    const weekMatches = matchesByWeek[week];
    const unsimulated = weekMatches.filter((m) => {
      if (m.homeTeam.slug === "bye" || m.awayTeam.slug === "bye") {
        return false;
      }
      const filename = `${week}-${m.homeTeam.slug}-${m.awayTeam.slug}.json`;
      const filePath = path.join(resultsDir, filename);
      return !fs.existsSync(filePath);
    });

    if (unsimulated.length > 0) {
      targetWeek = week;
      unsimulatedMatchesInTargetWeek = unsimulated;
      break;
    }
  }

  // 2. If all regular season matches are simulated, run the playoffs!
  if (targetWeek === null) {
    console.log("All regular season matches have already been simulated!");
    console.log("Checking for unsimulated playoff matches...");

    const playoffMatches = [
      {
        homeTeam: TEAMS["Oak & Onslaught"],
        awayTeam: TEAMS["The New Monteforte Chaos Creatures"],
        week: 1,
        openBar: false,
        bracket: "Grand Finals",
      },
      {
        homeTeam: TEAMS["The New Monteforte Chaos Creatures"],
        awayTeam: TEAMS["Oak & Onslaught"],
        week: 2,
        openBar: false,
        bracket: "Grand Finals",
      },
      {
        awayTeam: TEAMS["The New Monteforte Chaos Creatures"],
        homeTeam: TEAMS["Oak & Onslaught"],
        week: 3,
        openBar: true,
        bracket: "Grand Finals",
      },
      {
        homeTeam: TEAMS["The New Monteforte Chaos Creatures"],
        awayTeam: TEAMS["Oak & Onslaught"],
        week: 4,
        openBar: true,
        bracket: "Grand Finals",
      },
      {
        awayTeam: TEAMS["The New Monteforte Chaos Creatures"],
        homeTeam: TEAMS["Oak & Onslaught"],
        week: 5,
        openBar: false,
        bracket: "Losers",
      },
      {
        homeTeam: TEAMS["The New Monteforte Chaos Creatures"],
        awayTeam: TEAMS["The Confluence Captains"],
        week: 4,
        openBar: true,
        bracket: "Losers",
      },
      {
        awayTeam: TEAMS["The New Monteforte Chaos Creatures"],
        homeTeam: TEAMS["The Confluence Captains"],
        week: 5,
        openBar: false,
        bracket: "Losers",
      },
    ];

    const unsimulatedPlayoffs = playoffMatches.filter((m) => {
      const potentialSlug = `po-10-${m.week}-${m.homeTeam.slug}-${m.awayTeam.slug}`;
      const potentialPath = path.join(resultsDir, `${potentialSlug}.json`);
      return !fs.existsSync(potentialPath);
    });

    if (unsimulatedPlayoffs.length === 0) {
      console.log(
        "All regular season and playoff matches have been simulated!",
      );
      return;
    }

    console.log(`\n==================================================`);
    console.log(`Simulating Playoff Matches`);
    console.log(
      `Found ${unsimulatedPlayoffs.length} unsimulated playoff matches.`,
    );
    console.log(`==================================================\n`);

    for (let i = 0; i < unsimulatedPlayoffs.length; i++) {
      const baseMatch = unsimulatedPlayoffs[i];
      console.log(
        `[Playoff Match ${i + 1}/${unsimulatedPlayoffs.length}] Simulating ${baseMatch.homeTeam.name} vs ${baseMatch.awayTeam.name} (Round ${baseMatch.week}, Bracket: ${baseMatch.bracket})`,
      );

      const allSeriesGames = findPreviousSeriesGames(
        baseMatch.homeTeam,
        baseMatch.awayTeam,
      );

      await runMatch(
        baseMatch.homeTeam,
        baseMatch.awayTeam,
        baseMatch.week,
        baseMatch.openBar,
        baseMatch.bracket,
        allSeriesGames,
      );

      if (i < unsimulatedPlayoffs.length - 1) {
        console.log("Waiting 5 seconds to avoid API rate limits...");
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
    return;
  }

  // 3. Simulating target regular season week matches
  console.log(`\n==================================================`);
  console.log(`Simulating Week ${targetWeek} of the Regular Season`);
  console.log(
    `Found ${unsimulatedMatchesInTargetWeek.length} unsimulated matches.`,
  );
  console.log(`==================================================\n`);

  // Sort the target week's matches alphabetically by homeTeam slug for consistent openBar indices
  const allTargetWeekMatches = [...matchesByWeek[targetWeek]];
  allTargetWeekMatches.sort((a, b) =>
    a.homeTeam.slug.localeCompare(b.homeTeam.slug),
  );

  // Determine openBar indices (approx 25% of matches, e.g. first 2 matches of the week)
  const openBarCount = Math.max(
    1,
    Math.floor(allTargetWeekMatches.length * 0.25),
  );
  const openBarMatches = new Set(
    allTargetWeekMatches
      .slice(0, openBarCount)
      .map((m) => `${m.homeTeam.slug}-${m.awayTeam.slug}`),
  );

  for (let i = 0; i < unsimulatedMatchesInTargetWeek.length; i++) {
    const baseMatch = unsimulatedMatchesInTargetWeek[i];
    const matchupKey = `${baseMatch.homeTeam.slug}-${baseMatch.awayTeam.slug}`;
    const openBar = openBarMatches.has(matchupKey);

    console.log(
      `[Match ${i + 1}/${unsimulatedMatchesInTargetWeek.length}] Simulating ${baseMatch.homeTeam.name} vs ${baseMatch.awayTeam.name} (Week ${targetWeek}, Open Bar: ${openBar})`,
    );

    const allSeriesGames = findPreviousSeriesGames(
      baseMatch.homeTeam,
      baseMatch.awayTeam,
    );

    await runMatch(
      baseMatch.homeTeam,
      baseMatch.awayTeam,
      baseMatch.week,
      openBar,
      "Regular Season",
      allSeriesGames,
    );

    if (i < unsimulatedMatchesInTargetWeek.length - 1) {
      console.log("Waiting 5 seconds to avoid API rate limits...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  console.log(`\nSuccessfully simulated all matches for Week ${targetWeek}!`);
};

runAllMatches();
