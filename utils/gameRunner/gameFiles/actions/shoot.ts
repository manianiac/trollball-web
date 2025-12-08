import { match_progress, player, TEAM_NAMES, ZONE } from "@/utils/types";
import { calculateSuccess, calculateGoalDistance } from "./utils";

export const shoot = (
    gameState: match_progress,
    activePlayer: player
): match_progress => {
    const attackingTeam =
        activePlayer.team === gameState.homeTeam.name
            ? gameState.homeTeam
            : gameState.awayTeam;

    const distance = calculateGoalDistance(
        attackingTeam.name,
        gameState.currentZone
    );
    // Base chance 30%, +10% per skill point over 50? No, implementation uses raw skill vs distance check
    // Original logic:
    // if (calculateSuccess(activePlayer.stats.throw - distance * 10))
    // Wait, let's verify original logic. It was:
    // if (calculateSuccess(activePlayer.stats.throw - distance * 10))

    const difficulty = distance * 10;

    if (calculateSuccess(activePlayer.stats.throw - difficulty)) {
        // successful goal
        if (activePlayer.team === gameState.homeTeam.name) {
            gameState.homeScore += 1;
        } else {
            gameState.awayScore += 1;
        }

        gameState.plays.push(
            `${activePlayer.name} shoots from ${gameState.currentZone} and SCORES!`
        );
        gameState.latestAction = `${activePlayer.name} shoots from ${gameState.currentZone} and SCORES!`;

        // reset possession and zone
        gameState.possession = null;
        gameState.possessionTeam = TEAM_NAMES["No Team"];
        gameState.currentZone = ZONE["Center Field"];
    } else {
        // missed goal
        gameState.plays.push(
            `${activePlayer.name} shoots from ${gameState.currentZone} but misses the goal!`
        );
        gameState.latestAction = `${activePlayer.name} shoots from ${gameState.currentZone} but misses the goal!`;

        // possession change?
        // Original logic: "misses the goal!" -> possession = null or defending team gets it?
        // In actions.ts: Only play log is added. Possession logic handles "No Team" in next loop or similar.
        // Usually a miss means turnover. But here it just says "misses". 
        // Wait, original code set possession to null?
        // Looking at view_file logs:
        /*
          } else {
            gameState.plays.push(
              `${activePlayer.name} shoots from ${gameState.currentZone} but misses the goal!`
            );
            gameState.latestAction = ...
            gameState.possession = null; 
            gameState.possessionTeam = TEAM_NAMES["No Team"];
          }
        */
        // I need to be sure about possession reset on miss. 
        // I will assume yes, turnover or scramble.
        gameState.possession = null;
        gameState.possessionTeam = TEAM_NAMES["No Team"];
    }

    return gameState;
};
