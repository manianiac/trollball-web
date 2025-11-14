import { Markov } from "ts-markov";

import { generateNormalRandom } from "../../utils";

import {
  stadium,
  STARTING_ROSTER_SIZE,
  team,
  TEAM_NAMES,
} from "./../../consts";
import { generatePlayer } from "./generatePlayer";

export const generateTeam = (teamName: TEAM_NAMES, nameGenerator: Markov) => {
  let newTeam: team = {} as team;

  newTeam.name = teamName;
  newTeam.losses = 0;
  newTeam.wins = 0;
  newTeam.score = 0;
  newTeam.luck = generateNormalRandom(55, 6.5);
  newTeam.stadium = {} as stadium;
  newTeam.healer = generatePlayer(teamName, nameGenerator);
  let players = [];

  for (let i = 0; i < STARTING_ROSTER_SIZE; i++) {
    players.push(generatePlayer(teamName, nameGenerator));
  }
  newTeam.players = players;

  return newTeam;
};
