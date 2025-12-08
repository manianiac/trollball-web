import { match_progress, player, TEAM_NAMES } from "@/utils/types";
import { getRandomInt, selectRandomPlayer } from "@/utils/utils";
import { calculateSuccess } from "./utils";

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

    if (calculateSuccess(activePlayer.stats.pass)) {
        // successful pass
        if (calculateSuccess(receiver.stats.catch)) {
            // successful catch
            gameState.possession = receiver;
            gameState.plays.push(
                `${activePlayer.name} passes the ball to ${receiver.name}!`
            );
            gameState.latestAction = `${activePlayer.name} passes the ball to ${receiver.name}!`;
        } else {
            // failed catch
            gameState.possession = null;
            gameState.possessionTeam = TEAM_NAMES["No Team"];
            gameState.plays.push(
                `${activePlayer.name} passes the ball to ${receiver.name}, but they drop it!`
            );
            gameState.latestAction = `${activePlayer.name} passes the ball to ${receiver.name}, but they drop it!`;
        }
    } else {
        // failed pass / interception chance
        const defender = selectRandomPlayer(defendingTeam.activePlayers!);
        if (calculateSuccess(defender.stats.luck)) {
            // interception
            gameState.possession = defender;
            gameState.possessionTeam = defender.team;
            gameState.plays.push(
                `${activePlayer.name} throws a wild pass and it is INTERCEPTED by ${defender.name}!`
            );
            gameState.latestAction = `${activePlayer.name} throws a wild pass and it is INTERCEPTED by ${defender.name}!`;
        } else {
            // fumble
            gameState.possession = null;
            gameState.possessionTeam = TEAM_NAMES["No Team"];
            gameState.plays.push(
                `${activePlayer.name} throws a wild pass and it lands on the ground!`
            );
            gameState.latestAction = `${activePlayer.name} throws a wild pass and it lands on the ground!`;
        }
    }

    return gameState;
};
