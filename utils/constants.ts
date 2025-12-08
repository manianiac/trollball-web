import { ALL_ACTIONS } from "./types";

export const GAME_DURATION = 60; //rounds

export const STARTING_ROSTER_SIZE = 10;

export const OFFENSIVE_ACTIONS = [
    { name: ALL_ACTIONS.Run, chance: 35 },
    { name: ALL_ACTIONS.Pass, chance: 20 },
    { name: ALL_ACTIONS.Shoot, chance: 15 },
    { name: ALL_ACTIONS.Heal, chance: 15 },
    { name: ALL_ACTIONS.Fight, chance: 15 },
];

export const DEFENSIVE_ACTIONS = [
    { name: ALL_ACTIONS.Fight, chance: 90 },
    { name: ALL_ACTIONS.Heal, chance: 10 },
];
