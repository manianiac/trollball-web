import path from "path";
import fs from "fs";

import { match, match_progress, ZONE } from "@/utils/types";
import {
  generateDiscordAnnouncement,
  generatePopularityPost,
  generateWeeklyReport,
  generateCelebrityPost,
  generateRecapSummary,
  generateGameReports,
} from "./gameFiles/gameReportGenerator";

export const generateGamesTS = () => {
  // Define the directory where your game data JSON files are stored
  // This MUST match the DATA_DIR in 'scripts/buildGameData.ts'
  const GAMES_DIR = path.join(process.cwd(), "utils", "gameRunner", "results");

  console.log(GAMES_DIR);

  // Create a simple in-memory cache to avoid re-reading files during build
  /**
   * Reads all .json files from the game data directory,
   * parses them, and returns them as an array of 'match' objects.
   * This function is intended to be used ONLY in server-side code
   * (like getStaticProps, getStaticPaths, or API routes).
   */
  function loadAllGames(): match[] {
    // If cache exists, return it

    if (!fs.existsSync(GAMES_DIR)) {
      console.warn(`Directory not found: ${GAMES_DIR}. Returning empty array.`);

      return [];
    }

    const filenames = fs.readdirSync(GAMES_DIR);

    const games = filenames
      .filter(
        (filename: string) =>
          filename.endsWith(".json") &&
          !filename.includes("weeklyRecap") &&
          filename.startsWith("po-"),
      )
      .map((filename: string) => {
        const filePath = path.join(GAMES_DIR, filename);
        const fileContents = fs.readFileSync(filePath, "utf-8");
        const gameData: match = JSON.parse(fileContents);

        if (filename.startsWith("po-")) {
          gameData.slug = filename.replace(".json", "");
        }

        return {
          ...gameData,
          plays: gameData.plays || [],
        };
      });

    // Sort games by week, descending (newest first)
    games.sort((a: { week: number }, b: { week: number }) => b.week - a.week);

    // Custom sorting for Round 4 games (po-3)
    // We want Runeguard (kerlauger) vs Snessenger (zmeigorod) and Greenwatch (greenwatch) vs Commanders (new-ravenfall) at the bottom
    games.sort((a, b) => {
      // Only affect games that are from Round 4 (checked via slug starting with "po-3")
      if (a.slug?.startsWith("po-3") && b.slug?.startsWith("po-3")) {
        const isBottomGame = (game: match) => {
          const s = game.slug || "";
          if (s.includes("kerlauger") && s.includes("zmeigorod")) return true;
          if (s.includes("greenwatch") && s.includes("new-ravenfall"))
            return true;
          return false;
        };

        const aIsBottom = isBottomGame(a);
        const bIsBottom = isBottomGame(b);

        if (aIsBottom && !bIsBottom) return 1; // a goes after b
        if (!aIsBottom && bIsBottom) return -1; // a goes before b
        return 0;
      }
      return 0; // Maintain existing order for others
    });

    // Obscure specific teams in Round 4
    games.forEach((game) => {
      if (game.slug?.startsWith("po-3")) {
        // Obscure Zmeigorod (Snessengers) against Kerlauger
        if (
          game.slug.includes("kerlauger") &&
          game.slug.includes("zmeigorod")
        ) {
          const obscureTeam = (team: any) => {
            if (team.slug === "zmeigorod") {
              team.name = "???";
              team.stadium = { ...team.stadium, name: "???", description: "???" };
              team.players = [];
              team.healer = { ...team.healer, name: "???" };
            }
          };
          obscureTeam(game.homeTeam);
          obscureTeam(game.awayTeam);
        }

        // Obscure Greenwatch against New Ravenfall (Commanders)
        if (
          game.slug.includes("greenwatch") &&
          game.slug.includes("new-ravenfall")
        ) {
          const obscureTeam = (team: any) => {
            if (team.slug === "greenwatch") {
              team.name = "???";
              team.stadium = { ...team.stadium, name: "???", description: "???" };
              team.players = [];
              team.healer = { ...team.healer, name: "???" };
            }
          };
          obscureTeam(game.homeTeam);
          obscureTeam(game.awayTeam);
        }
      }
    });

    console.log(`Loaded ${games.length} games.`);

    return games;
  }

  // REMOVED the line that executed the function:
  //   const GAMES: match[] = loadAllGames();
  //   console.log(GAMES);
  return loadAllGames();
};

// Create a simple in-memory cache to avoid re-reading files during build
const loadAllRecaps = () => {
  const GAMES_DIR = path.join(process.cwd(), "results");

  console.log(GAMES_DIR);
  if (!fs.existsSync(GAMES_DIR)) {
    console.log(`Directory not found: ${GAMES_DIR}. Returning empty array.`);
    return [];
  }
  const filenames = fs.readdirSync(GAMES_DIR);

  const recaps = filenames
    .filter(
      (filename: string) =>
        filename.endsWith(".json") &&
        (filename.includes("weeklyRecap") ||
          filename.includes("celebrityPost") ||
          filename.includes("runeReading")),
    )
    .map((filename: string) => {
      const filePath = path.join(GAMES_DIR, filename);
      const fileContents = fs.readFileSync(filePath, "utf-8");
      const gameData: match = JSON.parse(fileContents);

      return {
        ...gameData,
        plays: gameData.plays || [],
      };
    });
  return recaps;
};

function writeGeneratedTSFile(games: match[]) {
  if (!games || games.length === 0) {
    console.log("No games found to write. Skipping file generation.");

    return;
  }

  games.forEach((game) => {
    if ("name" in game.awayTeam) {
      game.awayTeam.players = [];
      game.awayTeam.activePlayers = undefined;
      game.awayTeam.inactivePlayers = undefined;
    }
    if ("name" in game.homeTeam) {
      game.homeTeam.players = [];
      game.homeTeam.activePlayers = undefined;
      game.homeTeam.inactivePlayers = undefined;
    }
  });

  // This is the content that will be written to the file
  const fileContent = `
// THIS FILE IS AUTO-GENERATED BY 'utils/gameRunner/runGames.ts'
// DO NOT EDIT THIS FILE MANUALLY

import { match } from './types';

export const GAMES: match[] = ${JSON.stringify(games, null, 2)};
`;

  // Define the output path robustly
  const OUTPUT_FILE = path.join(process.cwd(), "utils", "games.generated.ts");
  const outputDir = path.dirname(OUTPUT_FILE);

  try {
    // Ensure the 'utils' directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the file synchronously
    fs.writeFileSync(OUTPUT_FILE, fileContent, "utf8");
    console.log(`Successfully generated: ${OUTPUT_FILE}`);
  } catch (err) {
    console.error("Error writing games.generated.ts file:", err);
  }
}

async function makeWeeklyRecap(allGamesData: match[]) {
  const week = Math.max(...allGamesData.map((game) => game.week));
  const pastRecaps = loadAllRecaps();

  // Generate or load the summary of past context
  const SUMMARY_FILE = path.join(process.cwd(), "results", "recapSummary.json");
  let pastRecapsSummary = "";

  if (fs.existsSync(SUMMARY_FILE)) {
    console.log("Loading summary from existing file...");
    pastRecapsSummary = fs.readFileSync(SUMMARY_FILE, "utf-8");
    console.log("Summary loaded.");
  } else {
    console.log("Generating summary of past recaps...");
    pastRecapsSummary = await generateRecapSummary(pastRecaps);
    fs.writeFileSync(SUMMARY_FILE, pastRecapsSummary, "utf-8");
    console.log("Summary generated and saved to results/recapSummary.txt");
  }

  const recap = await generateWeeklyReport(
    allGamesData,
    pastRecapsSummary,
    week,
  );

  const OUTPUT_FILE = path.join(
    process.cwd(),
    "results",
    `weeklyRecap-${week}.json`,
  );
  const outputDir = path.dirname(OUTPUT_FILE);

  try {
    // Ensure the 'utils' directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the file synchronously
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(recap), "utf8");
    console.log(`Successfully generated: ${OUTPUT_FILE}`);
  } catch (err) {
    console.error("Error writing games.generated.ts file:", err);
  }
}

async function makeDiscordAnnouncement(allGamesData: match[]) {
  const week = Math.max(...allGamesData.map((game) => game.week));
  const pastRecaps = loadAllRecaps();
  const recap = await generateDiscordAnnouncement(
    allGamesData,
    pastRecaps,
    week,
  );
  const OUTPUT_FILE = path.join(
    process.cwd(),
    "results",
    `discordAnnouncement.md`,
  );
  const outputDir = path.dirname(OUTPUT_FILE);

  try {
    // Ensure the 'utils' directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the file synchronously
    fs.writeFileSync(OUTPUT_FILE, recap.replace(/\n/g, "\r\n"), "utf8");
    console.log(`Successfully generated: ${OUTPUT_FILE}`);
  } catch (err) {
    console.error("Error writing games.generated.ts file:", err);
  }
}

async function makePopularityPost(allGamesData: match[]) {
  const week = Math.max(...allGamesData.map((game) => game.week));
  const pastRecaps = loadAllRecaps();
  const recap = await generatePopularityPost(allGamesData, pastRecaps, week);
  const OUTPUT_FILE = path.join(
    process.cwd(),
    "results",
    `popularityAnnouncement.md`,
  );
  const outputDir = path.dirname(OUTPUT_FILE);

  try {
    // Ensure the 'utils' directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the file synchronously
    fs.writeFileSync(OUTPUT_FILE, recap.replace(/\n/g, "\r\n"), "utf8");
    console.log(`Successfully generated: ${OUTPUT_FILE}`);
  } catch (err) {
    console.error("Error writing games.generated.ts file:", err);
  }
}

async function makeCelebrityPost(allGamesData: match[]) {
  const week = Math.max(...allGamesData.map((game) => game.week));
  const pastRecaps = loadAllRecaps();
  const recap = await generateCelebrityPost(pastRecaps);
  const OUTPUT_FILE = path.join(process.cwd(), "results", `celebrityPost.json`);
  const outputDir = path.dirname(OUTPUT_FILE);

  try {
    // Ensure the 'utils' directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the file synchronously
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(recap), "utf8");
    console.log(`Successfully generated: ${OUTPUT_FILE}`);
  } catch (err) {
    console.error("Error writing games.generated.ts file:", err);
  }
}

async function regenerateWeeklyWriteups(week: number) {
  const GAMES_DIR = path.join(process.cwd(), "utils", "gameRunner", "results");

  if (!fs.existsSync(GAMES_DIR)) {
    console.warn(`Directory not found: ${GAMES_DIR}.`);
    return;
  }

  const filenames = fs.readdirSync(GAMES_DIR);

  const weekFiles = filenames.filter(
    (filename) =>
      filename.startsWith(`${week}-`) &&
      filename.endsWith(".json") &&
      !filename.includes("weeklyRecap"),
  );

  console.log(`Found ${weekFiles.length} games for week ${week}.`);

  for (const filename of weekFiles) {
    const filePath = path.join(GAMES_DIR, filename);
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const gameData: match = JSON.parse(fileContents);

    console.log(`Regenerating writeups for ${filename}...`);

    // Construct a match_progress object for the generator
    // We provide placeholder values for missing match_progress fields since the game is already finished
    const matchProgress: match_progress = {
      ...gameData,
      homeTeam: gameData.homeTeam as any,
      awayTeam: gameData.awayTeam as any,
      possession: null,
      possessionTeam: "No Team",
      currentZone: ZONE["Center Field"],
    };

    const report = await generateGameReports(matchProgress);

    if (report) {
      gameData.preGame = report.preGameReport;
      gameData.postGame = report.postGameReport;

      fs.writeFileSync(filePath, JSON.stringify(gameData, null, 2), "utf8");
      console.log(`Successfully updated ${filename}`);
    } else {
      console.error(`Failed to regenerate report for ${filename}`);
    }
  }
}

// --- Main Execution ---
const run = async () => {
  const allGamesData = generateGamesTS();
  const week = Math.max(...allGamesData.map((game) => game.week));

  const trimmedGamesData = allGamesData.map((game) => {
    const trimmedGame = { ...game };
    if (trimmedGame.week !== week) {
      trimmedGame.preGame = "";
      trimmedGame.postGame = "";
    }

    const simplifyPlayers = (players: any[]) => {
      return players.map((p) => ({
        name: p.name,
        stats: {
          pregame_ritual: p.stats.pregame_ritual,
          pronouns: p.stats.pronouns,
        },
      }));
    };

    if ("players" in trimmedGame.awayTeam) {
      (trimmedGame.awayTeam as any).players = simplifyPlayers(
        (trimmedGame.awayTeam as any).players,
      );
    }
    if ("players" in trimmedGame.homeTeam) {
      (trimmedGame.homeTeam as any).players = simplifyPlayers(
        (trimmedGame.homeTeam as any).players,
      );
    }

    // aggressive delete
    delete (trimmedGame.homeTeam as any).activePlayers;
    delete (trimmedGame.homeTeam as any).inactivePlayers;
    delete (trimmedGame.awayTeam as any).activePlayers;
    delete (trimmedGame.awayTeam as any).inactivePlayers;

    return trimmedGame;
  });

  writeGeneratedTSFile(allGamesData);
  // await makeCelebrityPost(trimmedGamesData);
  // makeWeeklyRecap(trimmedGamesData);

  // makeDiscordAnnouncement(trimmedGamesData);
  // await makePopularityPost(trimmedGamesData);

  // To regenerate writeups for a specific week without rerunning games:
  // await regenerateWeeklyWriteups(7);
};

run();
