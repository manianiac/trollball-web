import {
  ALL_ACTIONS,
  match_progress,
  player,
} from "@/utils/types";
import { fight } from "./actions/fight";
import { pass } from "./actions/pass";
import { run } from "./actions/run";
import { shoot } from "./actions/shoot";
import { heal } from "./actions/heal";

export const actionHandler = (
  gameState: match_progress,
  activePlayer: player,
  chosenAction: ALL_ACTIONS
): match_progress => {
  switch (chosenAction) {
    case ALL_ACTIONS.Fight: {
      gameState = fight(gameState, activePlayer);
      break;
    }
    case ALL_ACTIONS.Pass: {
      gameState = pass(gameState, activePlayer);
      break;
    }
    case ALL_ACTIONS.Run: {
      gameState = run(gameState, activePlayer);
      break;
    }
    case ALL_ACTIONS.Shoot: {
      gameState = shoot(gameState, activePlayer);
      break;
    }
    case ALL_ACTIONS.Heal: {
      gameState = heal(gameState, activePlayer);
      break;
    }
    default: {
      break;
    }
  }

  return gameState;
};
