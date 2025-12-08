import { match_progress, player } from "@/utils/types";

export const heal = (
    gameState: match_progress,
    activePlayer: player
): match_progress => {
    const team =
        activePlayer.team === gameState.homeTeam.name
            ? gameState.homeTeam
            : gameState.awayTeam;

    if (!!team.activePlayers && !!team.inactivePlayers && team.inactivePlayers.length > 0) {
        const healedPlayer = team.inactivePlayers.shift();

        if (!!healedPlayer) {
            team.activePlayers.push(healedPlayer);
            gameState.latestAction =
                team.healer.name +
                " has returned " +
                healedPlayer.name +
                " to play";
            // Note: original code didn't push to gameState.plays? 
            // Check original: only set latestAction.
            // Usually latestAction is pushed to plays in gameRunner.
        }
    } else {
        // Fallback if no one to heal but action was selected?
        // Original code did nothing if conditions weren't met?
        // It checked `activePlayer.team === ...` and `gameState.awayTeam.inactivePlayers`.
        // If no inactive players, it did nothing.
    }

    return gameState;
};
