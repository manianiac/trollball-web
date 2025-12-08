import { match_progress, player, TEAM_NAMES, ZONE } from "@/utils/types";
import { getRandomInt } from "@/utils/utils";

export const calculateSuccess = (skill: number, activePlayer?: player): boolean => {
    let modifiedSkill = skill;

    if (activePlayer && activePlayer.stats.current_alcohol > 0) {
        const tolerance = activePlayer.stats.alcohol_tolerance;
        const current = activePlayer.stats.current_alcohol;

        if (current <= tolerance) {
            // Ballmer Peak: Improve performance closer to tolerance
            // Max bonus of 30% when exactly at tolerance
            const bonus = (current / tolerance) * 30;
            modifiedSkill += bonus;
        } else {
            // Over tolerance: Penalty
            // Penalty is percentage based, up to 75% reduction
            const over = current - tolerance;
            // 3% penalty per point over tolerance, maxing at 75%
            const penaltyPercent = Math.min(over * 0.03, 0.75);
            modifiedSkill = skill * (1 - penaltyPercent);
        }
    }

    return getRandomInt(0, 100) < modifiedSkill;
};

export const calculateGoalDistance = (
    activeTeam: string,
    currentZone: ZONE
): number => {
    let distance = -1;

    if (activeTeam === "home") {
        switch (currentZone) {
            case ZONE["Home 2-Point"]: {
                distance++;
            }
            case ZONE["Home Field"]: {
                distance++;
            }
            case ZONE["Center Field"]: {
                distance++;
            }
            case ZONE["Away Field"]: {
                distance++;
            }
            case ZONE["Away 2-Point"]: {
                distance++;
            }
        }
    } else {
        switch (currentZone) {
            case ZONE["Away 2-Point"]: {
                distance++;
            }
            case ZONE["Away Field"]: {
                distance++;
            }
            case ZONE["Center Field"]: {
                distance++;
            }
            case ZONE["Home Field"]: {
                distance++;
            }
            case ZONE["Home 2-Point"]: {
                distance++;
            }
        }
    }

    return distance;
};

export const advanceZone = (gameState: match_progress): match_progress => {
    if (gameState.awayTeam.name === gameState.possessionTeam) {
        switch (gameState.currentZone) {
            case ZONE["Home Field"]: {
                gameState.currentZone = ZONE["Home 2-Point"];
                break;
            }
            case ZONE["Center Field"]: {
                gameState.currentZone = ZONE["Home Field"];
                break;
            }
            case ZONE["Away Field"]: {
                gameState.currentZone = ZONE["Center Field"];
                break;
            }
            case ZONE["Away 2-Point"]: {
                gameState.currentZone = ZONE["Away Field"];
                break;
            }
        }
    } else {
        switch (gameState.currentZone) {
            case ZONE["Home 2-Point"]: {
                gameState.currentZone = ZONE["Home Field"];
                break;
            }
            case ZONE["Home Field"]: {
                gameState.currentZone = ZONE["Center Field"];
                break;
            }
            case ZONE["Center Field"]: {
                gameState.currentZone = ZONE["Away Field"];
                break;
            }
            case ZONE["Away Field"]: {
                gameState.currentZone = ZONE["Away 2-Point"];
                break;
            }
        }
    }

    return gameState;
};

export const handleScore = (
    gameState: match_progress,
    scoringTeam: string,
    points: number,
    scoreDescription: string
): match_progress => {
    if (scoringTeam === "home") {
        gameState.homeScore += points;
    } else {
        gameState.awayScore += points;
    }

    gameState.plays.push(scoreDescription);
    gameState.latestAction = scoreDescription;

    // Open Bar Logic: Everyone drinks!
    if (gameState.openBar) {
        gameState.plays.push("Goal scored! Immense amounts of alcohol are consumed!");

        // Helper to drink
        const drink = (p: player) => {
            p.stats.current_alcohol = (p.stats.current_alcohol || 0) + getRandomInt(15, 30);
        };

        if (gameState.homeTeam.activePlayers) {
            gameState.homeTeam.activePlayers.forEach(drink);
        }
        if (gameState.awayTeam.activePlayers) {
            gameState.awayTeam.activePlayers.forEach(drink);
        }
        if (gameState.homeTeam.inactivePlayers) {
            gameState.homeTeam.inactivePlayers.forEach(drink);
        }
        if (gameState.awayTeam.inactivePlayers) {
            gameState.awayTeam.inactivePlayers.forEach(drink);
        }

        // Add Flavor Text for Alcohol Status
        const checkStatus = (players: player[]) => {
            if (!players || players.length === 0) return;
            const randomPlayer = players[getRandomInt(0, players.length - 1)];
            const alcohol = randomPlayer.stats.current_alcohol;
            const tolerance = randomPlayer.stats.alcohol_tolerance;

            if (alcohol > tolerance) {
                gameState.plays.push(`${randomPlayer.name} is stumbling around DRUNK!`);
            } else if (alcohol > 0.5 * tolerance) {
                gameState.plays.push(`${randomPlayer.name} is looking a bit tipsy.`);
            } else {
                gameState.plays.push(`${randomPlayer.name} still looks sober.`);
            }
        };

        // Check one player from each team to report on
        if (gameState.homeTeam.activePlayers) checkStatus(gameState.homeTeam.activePlayers);
        if (gameState.awayTeam.activePlayers) checkStatus(gameState.awayTeam.activePlayers);
    }

    gameState.possession = null;
    gameState.possessionTeam = TEAM_NAMES["No Team"];
    gameState.currentZone = ZONE["Center Field"];

    return gameState;
};

export const getAlcoholNarration = (player: player): string => {
    if (!player.stats.current_alcohol || player.stats.current_alcohol === 0) return "";

    const alcohol = player.stats.current_alcohol;
    const tolerance = player.stats.alcohol_tolerance;

    if (alcohol > tolerance) {
        return "DRUNKENLY ";
    } else if (alcohol > 0.5 * tolerance) {
        return "tipsily ";
    }
    return "";
};
