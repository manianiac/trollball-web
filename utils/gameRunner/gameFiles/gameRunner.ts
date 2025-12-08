/**
 * Game Runner Module
 * 
 * Handles the main game loop, phase management, and player actions for a Trollball match.
 */

import fs from "fs";
import {
  ALL_ACTIONS,
  match_progress,
  player,
  TEAM_NAMES,
} from "@/utils/types";
import {
  DEFENSIVE_ACTIONS,
  GAME_DURATION,
  OFFENSIVE_ACTIONS,
} from "../../constants";
import { getRandomInt, selectRandomPlayer } from "../../utils";
import { actionHandler } from "./actions";
import { generateGameReports } from "./gameReportGenerator";

/**
 * Executes the main game loop for a match.
 * Simulates the game round by round, handling halftime and overtime breaks.
 * 
 * @param gameState - The current state of the match.
 */
export const gameLoop = async (gameState: match_progress) => {
  let fiction: string[] = [];

  // Set up initial team data
  initializeTeamData(gameState);

  // 25% chance for Open Bar
  gameState.openBar = getRandomInt(0, 100) < 25;
  if (gameState.openBar) {
    gameState.plays.push("🍻 IT'S AN OPEN BAR MATCH! DRINKS ARE ON THE HOUSE! 🍻");
  }

  for (
    let round = 0;
    round < GAME_DURATION || gameState.awayScore === gameState.homeScore;
    round++
  ) {
    gameState = await handleGamePhase(gameState);

    // Handle Halftime
    if (round === GAME_DURATION / 2) {
      handleBreak(gameState, "HALFTIME", fiction);
      fiction = gameState.plays;
      gameState.plays = [
        "HALFTIME - Each team has a quick break, and all injured players are returned to play"
      ];
    }
    // Handle Overtime
    else if (round === GAME_DURATION) {
      handleBreak(gameState, "OVERTIME", fiction);
      fiction = gameState.plays;
      gameState.plays = [
        "OVERTIME - Each team has a quick break, and all injured players are returned to play"
      ];
    }
  }

  // Combine all narrative plays
  gameState.plays = [...fiction, ...gameState.plays];
  console.log("Finished match");

  await saveGameResult(gameState);
};

/**
 * Initializes team rosters at the start of the game.
 * 
 * @param gameState - The current state of the match.
 */
const initializeTeamData = (gameState: match_progress) => {
  gameState.homeTeam.activePlayers = [...(gameState.homeTeam.players ?? [])];
  gameState.homeTeam.inactivePlayers = [];
  gameState.awayTeam.activePlayers = [...(gameState.awayTeam.players ?? [])];
  gameState.awayTeam.inactivePlayers = [];
};

/**
 * Handles logic for mid-game breaks (Halftime, Overtime).
 * Resets players and possession.
 * 
 * @param gameState - The current state of the match.
 * @param type - The type of break (e.g., "HALFTIME").
 * @param previousFiction - The accumulated fiction/narrative so far.
 */
const handleBreak = (gameState: match_progress, type: string, previousFiction: string[]) => {
  gameState.homeTeam.activePlayers = gameState.homeTeam.players;
  gameState.homeTeam.inactivePlayers = [];
  gameState.awayTeam.inactivePlayers = gameState.awayTeam.players;
  gameState.awayTeam.inactivePlayers = [];
  gameState.possession = {} as player;
  gameState.possessionTeam = TEAM_NAMES["No Team"];
};

/**
 * Simulates a single phase of the game (one round).
 * Determines player actions, resolves them, and updates game state.
 * 
 * @param gameState - The current state of the match.
 * @returns The updated game state.
 */
const handleGamePhase = async (
  gameState: match_progress
): Promise<match_progress> => {
  let chosenAction = ALL_ACTIONS["No Action"];
  let activePlayer = {} as player;

  // Check if either team needs a full team heal (all players injured)
  const healAction = determineTeamHeal(gameState);

  if (healAction) {
    activePlayer = healAction.player;
    chosenAction = healAction.action;
  } else if (
    !!gameState.awayTeam.activePlayers &&
    !!gameState.homeTeam.activePlayers
  ) {
    // Both teams have active players
    const allPlayers = [
      ...gameState.awayTeam.activePlayers,
      ...gameState.homeTeam.activePlayers,
    ];

    // Select a player at random to be active
    activePlayer = selectRandomPlayer(allPlayers);

    // If the ball is dropped (No Team possession), someone picks it up
    if (gameState.possessionTeam === TEAM_NAMES["No Team"]) {
      handleBallPickup(gameState, activePlayer);
    } else {
      // Determine action based on possession and random chance
      chosenAction = determinePlayerAction(gameState, activePlayer);
    }
  }

  // Execute the chosen action via the action handler
  gameState = actionHandler(gameState, activePlayer, chosenAction);

  if (gameState.latestAction !== "") {
    gameState.plays.push(gameState.latestAction + "");
    gameState.latestAction = "";
  }

  if (
    (gameState.homeTeam.activePlayers &&
      gameState.homeTeam.activePlayers.length < 3) ||
    (gameState.awayTeam.activePlayers &&
      gameState.awayTeam.activePlayers.length < 3)
  ) {
    gameState.plays.push("One of the teams has too few players to continue!");
    await gameLoop(gameState);
  }

  return gameState;
};

/**
 * Checks if a team is fully exhausted (no active players) and requires a team heal.
 * 
 * @param gameState - The current state of the match.
 * @returns An object with the healer and action, or null if no team heal is needed.
 */
const determineTeamHeal = (gameState: match_progress): { player: player, action: ALL_ACTIONS } | null => {
  if (
    !!gameState.awayTeam.activePlayers &&
    gameState.awayTeam.activePlayers.length === 0
  ) {
    // Away team needs healing
    return { player: gameState.awayTeam.healer, action: ALL_ACTIONS.Heal };
  } else if (
    !!gameState.homeTeam.activePlayers &&
    gameState.homeTeam.activePlayers.length === 0
  ) {
    // Home team needs healing
    return { player: gameState.homeTeam.healer, action: ALL_ACTIONS.Heal };
  }
  return null;
}

/**
 * Handles the logic when a player picks up a dropped Trollball.
 * 
 * @param gameState - The current state of the match.
 * @param activePlayer - The player picking up the ball.
 */
const handleBallPickup = (gameState: match_progress, activePlayer: player) => {
  gameState.possession = activePlayer;
  gameState.possessionTeam = gameState.possession.team;
  const fiction =
    "The Trollball is picked up by " +
    gameState.possession.name +
    " in zone " +
    gameState.currentZone;

  gameState.plays.push(fiction);
}

/**
 * Determines the action a player should take based on their team's possession status.
 * 
 * @param gameState - The current state of the match.
 * @param activePlayer - The active player.
 * @returns The chosen action from ALL_ACTIONS enum.
 */
const determinePlayerAction = (gameState: match_progress, activePlayer: player): ALL_ACTIONS => {
  const randomSeed = getRandomInt(0, 100);
  let weightedSum = 0;
  let chosenAction: ALL_ACTIONS = ALL_ACTIONS["No Action"];
  let actionNotFound = true;

  const isOffense = activePlayer.team === gameState.possessionTeam;
  const actionsList = isOffense ? OFFENSIVE_ACTIONS : DEFENSIVE_ACTIONS;

  actionsList.forEach((action) => {
    weightedSum += action.chance;
    if (actionNotFound && randomSeed <= weightedSum) {
      if (action.name === ALL_ACTIONS.Heal) {
        chosenAction = handleHealDecision(gameState, activePlayer, action.name);
      } else {
        chosenAction = action.name;
      }
      actionNotFound = false;
    }
  });

  return chosenAction;
}

/**
 * Decides whether to proceed with a Heal action or switch to Fighting.
 * Players only heal if their teammates are injured; otherwise, they fight.
 * 
 * @param gameState - The current state of the match.
 * @param activePlayer - The player attempting to heal.
 * @param healActionName - The heal action (should be ALL_ACTIONS.Heal).
 * @returns Either ALL_ACTIONS.Heal or ALL_ACTIONS.Fight.
 */
const handleHealDecision = (gameState: match_progress, activePlayer: player, healActionName: ALL_ACTIONS): ALL_ACTIONS => {
  const teamName = activePlayer.team;
  const myTeam = teamName === gameState.homeTeam.name ? gameState.homeTeam : gameState.awayTeam;

  if (!!myTeam.inactivePlayers && myTeam.inactivePlayers.length > 0) {
    return healActionName; // Should actually execute Heal
  } else {
    return ALL_ACTIONS.Fight;
  }
}

/**
 * Generates game reports and saves the match result to a JSON file.
 * 
 * @param gameState - The final state of the match.
 */
const saveGameResult = async (gameState: match_progress) => {
  try {
    console.log("Generating reports with Gemini API...");
    const report = await generateGameReports(gameState);

    if (report) {
      const outputPath = `./utils/gameRunner/results/${gameState.homeTeam.slug}-${gameState.awayTeam.slug}-${gameState.week}.json`;

      fs.writeFile(
        outputPath,
        JSON.stringify({
          homeTeam: gameState.homeTeam,
          awayTeam: gameState.awayTeam,
          preGame: report.preGameReport,
          postGame: report.postGameReport,
          week: gameState.week,
          homeScore: gameState.homeScore,
          awayScore: gameState.awayScore,
          slug: `${gameState.homeTeam.slug}-${gameState.awayTeam.slug}-${gameState.week}`,
        }),
        "utf8",
        (err) => {
          if (err) {
            console.error("Error writing to file", err);
            // Fallback to simpler path if nested path fails (backward compatibility/safety)
            const fallbackPath = `./results/${gameState.homeTeam.slug}-${gameState.awayTeam.slug}-${gameState.week}.json`;
            fs.writeFile(
              fallbackPath,
              JSON.stringify({
                homeTeam: gameState.homeTeam,
                awayTeam: gameState.awayTeam,
                preGame: report.preGameReport,
                postGame: report.postGameReport,
                week: gameState.week,
                homeScore: gameState.homeScore,
                awayScore: gameState.awayScore,
                slug: `${gameState.homeTeam.slug}-${gameState.awayTeam.slug}-${gameState.week}`,
              }),
              "utf8",
              (err2) => {
                if (err2) {
                  console.error("Retry failed too", err2);
                } else {
                  console.log(`Written to ${fallbackPath} (fallback)`);
                }
              }
            )
          } else {
            console.log(`Data written to JSON at ${outputPath}.`);
          }
        }
      );
    } else {
      console.log("Failed to generate reports.");
    }
  } catch (error) {
    console.error("Error loading or parsing game data:", error);
  }
}
