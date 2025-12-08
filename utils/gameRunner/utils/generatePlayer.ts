import { Markov } from "ts-markov";

import { boundedNumber, generateNormalRandom, getRandomInt } from "../../utils";

import { player, PRONOUNS, stats, TEAM_NAMES } from "@/utils/types";
import { FAVORITE_WEAPON, PREGAME_RITUAL } from "@/utils/flavor";
export const generatePlayer = (team: TEAM_NAMES, nameGenerator: Markov) => {
    let newPlayer: player = {} as player;

    newPlayer.name =
        nameGenerator.generate().toString() +
        " " +
        nameGenerator.generate().toString();
    newPlayer.team = team;
    newPlayer.stats = generateStats();

    return newPlayer;
};

const generateStats = () => {
    let stats: stats = {} as stats;

    stats.pass = generateIndividualStat();
    stats.catch = generateIndividualStat();
    stats.run = generateIndividualStat();
    stats.block = generateIndividualStat();
    stats.fight = generateIndividualStat();
    stats.throw = generateIndividualStat();
    stats.luck = generateIndividualStat();

    stats.pronouns = generatePronoun();
    stats.civic_engagement = generateIndividualStat();
    stats.alcohol_tolerance = generateIndividualStat();
    stats.current_alcohol = 0;
    stats.favorite_weapon = random(FAVORITE_WEAPON);
    stats.pregame_ritual = random(PREGAME_RITUAL);
    stats.literate = getRandomInt(0, 10) >= 4 ? true : false;

    return stats;
};

const generateIndividualStat = () => {
    const mean = 55;
    const stdDev = 6.5;
    const upperBound = 80;
    const lowerBound = 20;

    return boundedNumber(
        generateNormalRandom(mean, stdDev),
        upperBound,
        lowerBound
    );
};

const generatePronoun = (): string => {
    return PRONOUNS[getRandomInt(0, PRONOUNS.length)];
};

const random = (array: string[]): string => {
    return array[getRandomInt(0, array.length)];
};
