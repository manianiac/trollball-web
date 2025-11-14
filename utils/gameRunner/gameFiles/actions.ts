import {
  ALL_ACTIONS,
  match_progress,
  player,
  TEAM_NAMES,
  ZONE,
} from "../../consts";
import { getRandomInt, selectRandomPlayer } from "../../utils";

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

const run = (
  gameState: match_progress,
  activePlayer: player
): match_progress => {
  if (!!gameState.possession) activePlayer = gameState.possession;
  let blockingPlayer: player = {} as player;

  //pick a player
  if (activePlayer.team === gameState.awayTeam.name) {
    blockingPlayer = selectRandomPlayer(
      !!gameState.homeTeam.activePlayers ? gameState.homeTeam.activePlayers : []
    );
  } else {
    blockingPlayer = selectRandomPlayer(
      !!gameState.awayTeam.activePlayers ? gameState.awayTeam.activePlayers : []
    );
  }
  let runSuccess = calculateSuccess(activePlayer.stats.run);
  let blockSuccess = calculateSuccess(blockingPlayer.stats.block);

  if (runSuccess) {
    // if they are close enough to score
    if (
      (activePlayer.team === gameState.awayTeam.name &&
        gameState.currentZone === ZONE["Home 2-Point"]) ||
      (activePlayer.team === gameState.homeTeam.name &&
        gameState.currentZone === ZONE["Away 2-Point"])
    ) {
      gameState.latestAction =
        activePlayer.name +
        " scores! " +
        blockingPlayer.name +
        " tried to block them but failed";
      gameState.currentZone = ZONE["Center Field"];
      if (activePlayer.team === gameState.awayTeam.name) {
        gameState.awayScore++;
      } else {
        gameState.homeScore++;
      }
      gameState.possession = {} as player;
      gameState.possessionTeam = TEAM_NAMES["No Team"];
    }
    // Advance zone
    else {
      gameState = advanceZone(gameState);
      gameState.latestAction =
        activePlayer.name +
        " runs the ball forward into " +
        gameState.currentZone +
        ". " +
        blockingPlayer.name +
        " tries to block but they slip through.";
    }
  } else if (blockSuccess) {
    gameState.latestAction =
      activePlayer.name +
      " attempts to run the ball forward a zone, but is blocked by " +
      blockingPlayer.name +
      ", who takes possession of the ball";
    gameState.possession = blockingPlayer;
    gameState.possessionTeam = blockingPlayer.team;
  }
  // fail on both sides
  else {
    gameState.latestAction =
      activePlayer.name +
      " attempts to run the ball forward a zone, but is blocked by " +
      blockingPlayer.name +
      ". In the scuffle the ball is dropped.";
    gameState.possession = {} as player;
    gameState.possessionTeam = TEAM_NAMES["No Team"];
  }

  return gameState;
};
const fight = (
  gameState: match_progress,
  activePlayer: player
): match_progress => {
  let defendingPlayer = {} as player;
  let activeTeam = "";

  if (
    activePlayer.team === gameState.awayTeam.name &&
    !!gameState.homeTeam.activePlayers
  ) {
    defendingPlayer = selectRandomPlayer(gameState.homeTeam.activePlayers);
    activeTeam = "away";
  } else if (!!gameState.awayTeam.activePlayers) {
    defendingPlayer = selectRandomPlayer(gameState.awayTeam.activePlayers);
    activeTeam = "home";
  }
  const activeFight = calculateSuccess(activePlayer.stats.fight);
  const defendingFight = calculateSuccess(defendingPlayer.stats.fight);
  const activeHasPossession = gameState.possession?.name === activePlayer.name;
  const defenseHasPossession =
    gameState.possession?.name === defendingPlayer.name;
  let result = "";

  if (activeFight) {
    if (activeTeam === "away") {
      gameState.homeTeam.activePlayers =
        gameState.homeTeam.activePlayers?.filter(
          (player) => player.name != defendingPlayer.name
        );
      gameState.homeTeam.inactivePlayers?.push(defendingPlayer);
    } else {
      gameState.awayTeam.activePlayers =
        gameState.awayTeam.activePlayers?.filter(
          (player) => player.name != defendingPlayer.name
        );
      gameState.awayTeam.inactivePlayers?.push(defendingPlayer);
    }
    result +=
      activePlayer.name +
      " knocks " +
      defendingPlayer.name +
      " out of play with their " +
      activePlayer.stats.favorite_weapon +
      "\n";
    if (defenseHasPossession) {
      result += "The trollball is dropped and free to pick up";
      gameState.possession = {} as player;
      gameState.possessionTeam = TEAM_NAMES["No Team"];
    }
  }
  if (defendingFight) {
    if (activeTeam === "away") {
      gameState.homeTeam.activePlayers =
        gameState.homeTeam.activePlayers?.filter(
          (player) => player.name != activePlayer.name
        );
      gameState.homeTeam.inactivePlayers?.push(activePlayer);
    } else {
      gameState.awayTeam.activePlayers =
        gameState.awayTeam.activePlayers?.filter(
          (player) => player.name != activePlayer.name
        );
      gameState.awayTeam.inactivePlayers?.push(activePlayer);
    }
    result +=
      defendingPlayer.name +
      " knocks " +
      activePlayer.name +
      " out of play with their " +
      defendingPlayer.stats.favorite_weapon +
      "\n";
    if (activeHasPossession) {
      result += "The trollball is dropped and free to pick up";
      gameState.possession = {} as player;
      gameState.possessionTeam = TEAM_NAMES["No Team"];
    }
  }
  if (!(activeFight || defendingFight)) {
    result =
      activePlayer.name +
      " and " +
      defendingPlayer.name +
      " are locked in battle, neither defeating the other with their preferred weapons";
  }
  gameState.latestAction = result;

  return gameState;
};

const pass = (
  gameState: match_progress,
  activePlayer: player
): match_progress => {
  if (!!gameState.possession) activePlayer = gameState.possession;
  let catchingPlayer: player = { name: "none" } as player;

  //pick a player
  if (activePlayer.team === gameState.awayTeam.name) {
    while (
      catchingPlayer.name === activePlayer.name ||
      catchingPlayer.name === "none"
    ) {
      catchingPlayer = selectRandomPlayer(
        !!gameState.awayTeam.activePlayers
          ? gameState.awayTeam.activePlayers
          : []
      );
    }
  } else {
    while (
      catchingPlayer.name === activePlayer.name ||
      catchingPlayer.name === "none"
    ) {
      catchingPlayer = selectRandomPlayer(
        !!gameState.homeTeam.activePlayers
          ? gameState.homeTeam.activePlayers
          : []
      );
    }
  }
  let throwSuccess = calculateSuccess(activePlayer.stats.pass);
  let catchSuccess = calculateSuccess(catchingPlayer.stats.catch);

  if (throwSuccess) {
    gameState = advanceZone(gameState);
    if (catchSuccess) {
      gameState.possession = catchingPlayer;
      if (
        gameState.currentZone === ZONE["Away Goal"] ||
        gameState.currentZone === ZONE["Home Goal"]
      ) {
        gameState.latestAction =
          activePlayer.name +
          " throws from " +
          gameState.currentZone +
          " to " +
          catchingPlayer.name +
          " and they successfully catch, scoring a point!";
        gameState.currentZone = ZONE["Center Field"];
        if (activePlayer.team === gameState.awayTeam.name) {
          gameState.awayScore++;
        } else {
          gameState.homeScore++;
        }
        gameState.possession = {} as player;
        gameState.possessionTeam = TEAM_NAMES["No Team"];
      } else {
        gameState.latestAction =
          activePlayer.name +
          " throws to  from " +
          gameState.currentZone +
          " to" +
          catchingPlayer.name +
          " and they successfully catch, advancing a zone!";
      }
    } else {
      gameState.latestAction =
        activePlayer.name +
        " throws from " +
        gameState.currentZone +
        " to " +
        catchingPlayer.name +
        " but they fumble the catch!";
      gameState.possession = {} as player;
      gameState.possessionTeam = TEAM_NAMES["No Team"];
    }
  } else {
    gameState.latestAction =
      activePlayer.name +
      " tries to throw to " +
      catchingPlayer.name +
      " but they can't find an opening!";
  }

  return gameState;
};

const shoot = (
  gameState: match_progress,
  activePlayer: player
): match_progress => {
  if (!!gameState.possession) activePlayer = gameState.possession;
  let team = activePlayer.team === gameState.homeTeam.name ? "home" : "away";
  let distance = calculateGoalDistance(team, gameState.currentZone);

  const shootSuccess = calculateSuccess(
    activePlayer.stats.throw + distance * -10
  );

  if (shootSuccess) {
    if (team === "home") {
      gameState.homeScore += 2;
    } else {
      gameState.awayScore += 2;
    }
    gameState.latestAction =
      activePlayer.name +
      " shoots from " +
      gameState.currentZone +
      " and scores 2 points!";
    gameState.possession = {} as player;
    gameState.possessionTeam = TEAM_NAMES["No Team"];
    gameState.currentZone = ZONE["Center Field"];
  } else {
    gameState.latestAction =
      activePlayer.name +
      " tries to score from " +
      gameState.currentZone +
      " but falls short, landing in the opposing team's 2 point zone";
    if (team === "home") {
      gameState.currentZone = ZONE["Away 2-Point"];
    } else {
      gameState.currentZone = ZONE["Home 2-Point"];
    }
    gameState.possession = {} as player;
    gameState.possessionTeam = TEAM_NAMES["No Team"];
  }

  return gameState;
};

const heal = (
  gameState: match_progress,
  activePlayer: player
): match_progress => {
  if (
    activePlayer.team === gameState.awayTeam.name &&
    !!gameState.awayTeam.activePlayers &&
    !!gameState.awayTeam.inactivePlayers
  ) {
    const healedPlayer = gameState.awayTeam.inactivePlayers.shift();

    if (!!healedPlayer) {
      gameState.awayTeam.activePlayers.push(healedPlayer);
      gameState.latestAction =
        gameState.awayTeam.healer.name +
        " has returned " +
        healedPlayer.name +
        " to play";
    }
  } else if (
    activePlayer.team === gameState.homeTeam.name &&
    !!gameState.homeTeam.activePlayers &&
    !!gameState.homeTeam.inactivePlayers
  ) {
    const healedPlayer = gameState.homeTeam.inactivePlayers.shift();

    if (!!healedPlayer) {
      gameState.homeTeam.activePlayers.push(healedPlayer);
      gameState.latestAction =
        gameState.homeTeam.healer.name +
        " has returned " +
        healedPlayer.name +
        " to play";
    }
  }

  return gameState;
};

const calculateSuccess = (skill: number): boolean => {
  return getRandomInt(0, 100) < skill;
};
const advanceZone = (gameState: match_progress): match_progress => {
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

const calculateGoalDistance = (
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
