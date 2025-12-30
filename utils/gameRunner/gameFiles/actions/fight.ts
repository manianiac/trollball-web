import { match_progress, player, TEAM_NAMES } from "@/utils/types";
import { getRandomInt } from "@/utils/utils";
import { calculateSuccess, getAlcoholNarration } from "./utils";

export const fight = (
  gameState: match_progress,
  activePlayer: player,
): match_progress => {
  const attackingTeam =
    activePlayer.team === gameState.homeTeam.name
      ? gameState.homeTeam
      : gameState.awayTeam;
  const defendingTeam =
    activePlayer.team === gameState.homeTeam.name
      ? gameState.awayTeam
      : gameState.homeTeam;

  const defender =
    defendingTeam.activePlayers![
    getRandomInt(0, defendingTeam.activePlayers!.length - 1)
    ];

  if (calculateSuccess(activePlayer.stats.fight, activePlayer)) {
    // successful fight
    if (calculateSuccess(defender.stats.block, defender)) {
      // successful block
      gameState.plays.push(
        `${activePlayer.name} tries to Tackle ${defender.name}, but ${defender.name} blocks it!`,
      );
      gameState.latestAction = `${activePlayer.name} ${getAlcoholNarration(activePlayer)}tries to Tackle ${defender.name}, but ${defender.name} blocks it!`;
    } else {
      // successful tackle / injury
      gameState.plays.push(
        `${activePlayer.name} ${getAlcoholNarration(activePlayer)}Tackles ${defender.name} and INJURES THEM!`,
      );
      gameState.latestAction = `${activePlayer.name} ${getAlcoholNarration(activePlayer)}Tackles ${defender.name} and INJURES THEM!`;

      // handle injury
      if (defendingTeam.name === gameState.homeTeam.name) {
        gameState.homeTeam.activePlayers =
          gameState.homeTeam.activePlayers!.filter(
            (p) => p.name !== defender.name,
          );
        gameState.homeTeam.inactivePlayers!.push(defender);
      } else {
        gameState.awayTeam.activePlayers =
          gameState.awayTeam.activePlayers!.filter(
            (p) => p.name !== defender.name,
          );
        gameState.awayTeam.inactivePlayers!.push(defender);
      }

      // Check for game ending condition is delegated to gameRunner
    }
  } else {
    // failed fight
    gameState.plays.push(
      `${activePlayer.name} ${getAlcoholNarration(activePlayer)}tries to Tackle ${defender.name}, but misses!`,
    );
    gameState.latestAction = `${activePlayer.name} ${getAlcoholNarration(activePlayer)}tries to Tackle ${defender.name}, but misses!`;
  }

  return gameState;
};
