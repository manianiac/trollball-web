import { match_progress, player, ZONE } from "@/utils/types";
import { calculateSuccess, advanceZone, handleScore, getAlcoholNarration } from "./utils";

export const run = (
    gameState: match_progress,
    activePlayer: player
): match_progress => {
    if (calculateSuccess(activePlayer.stats.run, activePlayer)) {
        // successful run

        // Check for Touchdown
        if (
            (activePlayer.team === gameState.awayTeam.name && gameState.currentZone === ZONE["Home 2-Point"]) ||
            (activePlayer.team === gameState.homeTeam.name && gameState.currentZone === ZONE["Away 2-Point"])
        ) {
            const points = 1;
            const description = `${activePlayer.name} ${getAlcoholNarration(activePlayer)}runs into the End Zone and DUNKS THE BALL INTO THE GOAL!`;
            gameState = handleScore(gameState, activePlayer.team === gameState.homeTeam.name ? "home" : "away", points, description);
        } else {
            gameState.plays.push(
                `${activePlayer.name} ${getAlcoholNarration(activePlayer)}runs with the ball and advances towards the goal!`
            );
            gameState.latestAction = `${activePlayer.name} ${getAlcoholNarration(activePlayer)}runs with the ball and advances towards the goal!`;
            // log for advancing zone
            gameState = advanceZone(gameState);
        }
    } else {
        // failed run
        gameState.plays.push(
            `${activePlayer.name} ${getAlcoholNarration(activePlayer)}tries to run with the ball but is stopped by the defense!`
        );
        gameState.latestAction = `${activePlayer.name} ${getAlcoholNarration(activePlayer)}tries to run with the ball but is stopped by the defense!`;
    }

    return gameState;
};
