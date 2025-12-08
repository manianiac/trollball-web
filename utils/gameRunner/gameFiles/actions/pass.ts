import { match_progress, player, TEAM_NAMES, ZONE } from "@/utils/types";
import { getRandomInt, selectRandomPlayer } from "@/utils/utils";
import { calculateSuccess, handleScore, getAlcoholNarration } from "./utils";

export const pass = (
    gameState: match_progress,
    activePlayer: player
): match_progress => {
    const attackingTeam =
        activePlayer.team === gameState.homeTeam.name
            ? gameState.homeTeam
            : gameState.awayTeam;
    const defendingTeam =
        activePlayer.team === gameState.homeTeam.name
            ? gameState.awayTeam
            : gameState.homeTeam;

    // determine receiver
    const receiver = selectRandomPlayer(attackingTeam.activePlayers!);

    if (calculateSuccess(activePlayer.stats.pass, activePlayer)) {
        // successful pass
        if (calculateSuccess(receiver.stats.catch, receiver)) {
            // successful catch
            gameState.possession = receiver;

            // Check for potential Score if passing into endzone logic?
            // Simplified logic: If in 2-Point Zone and pass succeeds, does it count as advancing to Goal?
            // "Home 2-Point" -> Next is Goal.

            if (
                (activePlayer.team === gameState.awayTeam.name && gameState.currentZone === ZONE["Home 2-Point"]) ||
                (activePlayer.team === gameState.homeTeam.name && gameState.currentZone === ZONE["Away 2-Point"])
            ) {
                const points = 1;
                const description = `${activePlayer.name} passes to ${receiver.name} in the End Zone, who dunks the ball into the goal!`;
                gameState = handleScore(gameState, activePlayer.team === gameState.homeTeam.name ? "home" : "away", points, description);
            } else {
                gameState.plays.push(
                    `${activePlayer.name} ${getAlcoholNarration(activePlayer)}passes the ball to ${receiver.name}!`
                );
                gameState.latestAction = `${activePlayer.name} ${getAlcoholNarration(activePlayer)}passes the ball to ${receiver.name}!`;
            }
        } else {
            // failed catch
            gameState.possession = null;
            gameState.possessionTeam = TEAM_NAMES["No Team"];
            gameState.plays.push(
                `${activePlayer.name} ${getAlcoholNarration(activePlayer)}passes the ball to ${receiver.name}, but they drop it!`
            );
            gameState.latestAction = `${activePlayer.name} ${getAlcoholNarration(activePlayer)}passes the ball to ${receiver.name}, but they drop it!`;
        }
    } else {
        // failed pass / interception chance
        const defender = selectRandomPlayer(defendingTeam.activePlayers!);
        if (calculateSuccess(defender.stats.luck)) {
            // interception
            gameState.possession = defender;
            gameState.possessionTeam = defender.team;
            gameState.plays.push(
                `${activePlayer.name} ${getAlcoholNarration(activePlayer)}throws a wild pass and it is INTERCEPTED by ${defender.name}!`
            );
            gameState.latestAction = `${activePlayer.name} ${getAlcoholNarration(activePlayer)}throws a wild pass and it is INTERCEPTED by ${defender.name}!`;
        } else {
            // fumble
            gameState.possession = null;
            gameState.possessionTeam = TEAM_NAMES["No Team"];
            gameState.plays.push(
                `${activePlayer.name} ${getAlcoholNarration(activePlayer)}throws a wild pass and it lands on the ground!`
            );
            gameState.latestAction = `${activePlayer.name} ${getAlcoholNarration(activePlayer)}throws a wild pass and it lands on the ground!`;
        }
    }

    return gameState;
};
