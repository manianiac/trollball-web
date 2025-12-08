import { match_progress, player, TEAM_NAMES, ZONE } from "@/utils/types";
import { calculateSuccess, calculateGoalDistance, handleScore, getAlcoholNarration } from "./utils";

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

    const difficulty = distance * 10;

    if (calculateSuccess(activePlayer.stats.throw - difficulty, activePlayer)) {
        // successful goal
        const points = 2;
        const description = `${activePlayer.name} ${getAlcoholNarration(activePlayer)}shoots from ${gameState.currentZone} and SCORES!`

        gameState = handleScore(gameState, attackingTeam.name === gameState.homeTeam.name ? "home" : "away", points, description);
    } else {
        // missed goal
        gameState.plays.push(
            `${activePlayer.name} ${getAlcoholNarration(activePlayer)}shoots from ${gameState.currentZone} but misses the goal!`
        );
        gameState.latestAction = `${activePlayer.name} ${getAlcoholNarration(activePlayer)}shoots from ${gameState.currentZone} but misses the goal!`;

        gameState.possession = null;
        gameState.possessionTeam = TEAM_NAMES["No Team"];
    }

    return gameState;
};
