import { match_progress, player, ZONE } from "@/utils/types";
import { calculateSuccess, advanceZone } from "./utils";

export const run = (
    gameState: match_progress,
    activePlayer: player
): match_progress => {
    if (calculateSuccess(activePlayer.stats.run)) {
        // successful run
        gameState.plays.push(
            `${activePlayer.name} runs with the ball and advances towards the goal!`
        );
        gameState.latestAction = `${activePlayer.name} runs with the ball and advances towards the goal!`;
        // logic for advancing zone
        gameState = advanceZone(gameState);
    } else {
        // failed run
        gameState.plays.push(
            `${activePlayer.name} tries to run with the ball but is stopped by the defense!`
        );
        gameState.latestAction = `${activePlayer.name} tries to run with the ball but is stopped by the defense!`;
    }

    return gameState;
};
