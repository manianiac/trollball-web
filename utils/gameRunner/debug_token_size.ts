import path from "path";
import fs from "fs";
import { match } from "../types";
import { popularity } from "./gameFiles/popularity";
import { heroesOfTheRealm } from "./gameFiles/heroes";

// --- Mocking load functions from createGames.ts ---

function loadAllGames(): match[] {
  const GAMES_DIR = path.join(process.cwd(), "utils", "gameRunner", "results");
  if (!fs.existsSync(GAMES_DIR)) return [];
  const filenames = fs.readdirSync(GAMES_DIR);
  const games = filenames
    .filter(
      (filename) =>
        filename.endsWith(".json") && !filename.includes("weeklyRecap"),
    )
    .map((filename) => {
      const filePath = path.join(GAMES_DIR, filename);
      const fileContents = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(fileContents);
    });
  games.sort((a: any, b: any) => b.week - a.week);
  return games;
}

const loadAllRecaps = () => {
  const GAMES_DIR = path.join(process.cwd(), "results");
  if (!fs.existsSync(GAMES_DIR)) return [];
  const filenames = fs.readdirSync(GAMES_DIR);
  const recaps = filenames
    .filter(
      (filename) =>
        filename.endsWith(".json") && filename.includes("weeklyRecap"),
    )
    .map((filename) => {
      const filePath = path.join(GAMES_DIR, filename);
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    });
  return recaps;
};

// --- Analysis Logic ---

const analyze = () => {
  const allGamesData = loadAllGames();
  const pastRecaps = loadAllRecaps();
  const week = Math.max(...allGamesData.map((game) => game.week));

  console.log(`Analyzing for Week: ${week}`);

  // Apply the trimming logic the user used
  const trimmedGamesData = allGamesData
    .map((game) => {
      // Create a shallow copy to simulate what map does (though user used direct mutation in their map)
      // To be safe and emulate their code:
      const trimmedGame = { ...game }; // User did 'const trimmedGame = game' which is reference, but let's assume they might fix it or we want to see the effect.
      // ACTUALLY, let's replicate their exact logic:
      /*
         allGamesData.map((game) => {
            const trimmedGame = game;
            if (trimmedGame.week < week) {
            trimmedGame.awayTeam = {};
            trimmedGame.homeTeam = {};
            }
            return trimmedGame
        })
        */
      // Since I loaded fresh data, treating it mutably is fine for this script.
      // Strategy: Filter to ONLY current week
      if (trimmedGame.week < week) {
        return null;
      }

      // Strategy: Current week optimization
      (trimmedGame as any).preGame = "";
      (trimmedGame as any).postGame = "";

      const simplifyPlayers = (players: any[]) => {
        return players.map((p) => ({
          name: p.name,
          // Keep only essential stats for flavor
          stats: {
            pregame_ritual: p.stats.pregame_ritual,
            pronouns: p.stats.pronouns,
            // maybe favorite_weapon?
            favorite_weapon: p.stats.favorite_weapon,
          },
        }));
      };

      if ((trimmedGame.homeTeam as any).players) {
        (trimmedGame.homeTeam as any).players = simplifyPlayers(
          (trimmedGame.homeTeam as any).players,
        );
      }
      if ((trimmedGame.awayTeam as any).players) {
        (trimmedGame.awayTeam as any).players = simplifyPlayers(
          (trimmedGame.awayTeam as any).players,
        );
      }

      // Also remove activePlayers/inactivePlayers etc if they exist and are large
      delete (trimmedGame.homeTeam as any).activePlayers;
      delete (trimmedGame.homeTeam as any).inactivePlayers;
      delete (trimmedGame.awayTeam as any).activePlayers;
      delete (trimmedGame.awayTeam as any).inactivePlayers;

      return trimmedGame;
    })
    .filter(Boolean); // Remove nulls

  // Calculate Sizes
  const gamesJson = JSON.stringify(trimmedGamesData);
  const recapsJson = JSON.stringify(pastRecaps);
  const popJson = JSON.stringify(popularity);
  const heroesJson = JSON.stringify(heroesOfTheRealm);

  const totalChars =
    gamesJson.length + recapsJson.length + popJson.length + heroesJson.length;

  // Heuristic: 1 token ~= 4 chars (cl100k_base is closer to 3.5-4 for code/json)
  const tokenEstimate = Math.ceil(totalChars / 4);

  console.log("--- Breakdown ---");
  console.log(
    `Games Data (Trimmed): ${gamesJson.length} chars (~${Math.ceil(gamesJson.length / 4)} tokens)`,
  );
  console.log(
    `Past Recaps:          ${recapsJson.length} chars (~${Math.ceil(recapsJson.length / 4)} tokens)`,
  );
  console.log(
    `Popularity:           ${popJson.length} chars (~${Math.ceil(popJson.length / 4)} tokens)`,
  );
  console.log(
    `Heroes:               ${heroesJson.length} chars (~${Math.ceil(heroesJson.length / 4)} tokens)`,
  );
  console.log("-----------------");
  console.log(
    `TOTAL ESTIMATE:       ${totalChars} chars (~${tokenEstimate} tokens)`,
  );

  // Let's identify the largest chunk in games
  if (gamesJson.length > 50000) {
    console.log("\nWARNING: Games data is still large. Checking details...");
    trimmedGamesData.forEach((g: any, i) => {
      const playsLen = JSON.stringify(g.plays).length;
      const playersLenHome = JSON.stringify(g.homeTeam.players).length;
      const playersLenAway = JSON.stringify(g.awayTeam.players).length;
      console.log(
        `- Game ${i} (Week ${g.week}): Plays: ${playsLen} chars. Players: ${playersLenHome + playersLenAway} chars.`,
      );
    });
  }

  if (recapsJson.length > 50000) {
    console.log("\nWARNING: Past recaps data is large.");
    pastRecaps.forEach((r, i) => {
      console.log(`- Recap ${i}: ${JSON.stringify(r).length} chars`);
    });
  }
};

analyze();
