import { match_progress, TEAM_NAMES, ZONE } from "@/utils/types";
import { getRandomInt } from "@/utils/utils";

export const calculateSuccess = (skill: number): boolean => {
    return getRandomInt(0, 100) < skill;
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
