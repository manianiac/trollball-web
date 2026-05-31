import { ALL_ACTIONS, match_progress, player } from "@/shared/types";

export interface GameModifier {
  name: string;
  category: "stadium" | "weather" | "blessing" | "curse" | "other";
  description: string; // Purely thematic description
  modifySkill?: (
    skill: number,
    action: ALL_ACTIONS,
    activePlayer: player | undefined,
    gameState: match_progress,
  ) => number;
  getNarration?: (
    activePlayer: player | undefined,
    action: ALL_ACTIONS,
    success: boolean,
    gameState: match_progress,
  ) => string | null;
}

// A helper to easily define basic skill modifications
const adjustForActions = (
  skill: number,
  action: ALL_ACTIONS,
  targetActions: ALL_ACTIONS[],
  penalty: number,
): number => {
  return targetActions.includes(action) ? skill + penalty : skill;
};

// Global Registry of all Stadium Modifiers
export const GAME_MODIFIERS: Record<string, GameModifier> = {
  "Noxious Fumes": {
    name: "Noxious Fumes",
    category: "stadium",
    description:
      "Thick, choking sulfur fumes make breathing difficult, exhausting players quickly.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Run, ALL_ACTIONS.Fight], -5),
    getNarration: (player) =>
      `${player?.name} coughs on the thick sulfur fumes!`,
  },
  "Crumbling Walls": {
    name: "Crumbling Walls",
    category: "stadium",
    description:
      "Loose masonry and crumbling stones make defending and blocking positions unstable.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Fight], -8), // Block skill is checked under Fight action
    getNarration: (player) =>
      `${player?.name} nearly trips on a crumbling piece of masonry!`,
  },
  "Uneven Ground": {
    name: "Uneven Ground",
    category: "stadium",
    description:
      "The field is filled with hidden divots and tufts of overgrown sod, making running and passing tricky.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Run, ALL_ACTIONS.Pass], -5),
    getNarration: (player) =>
      `${player?.name} loses footing slightly on a patch of uneven grass.`,
  },
  "Glowstone Glare": {
    name: "Glowstone Glare",
    category: "stadium",
    description:
      "The polished glowstone pitch reflects stadium light intensely, blinding anyone trying to track the ball.",
    modifySkill: (skill, action) =>
      adjustForActions(
        skill,
        action,
        [ALL_ACTIONS.Pass, ALL_ACTIONS.Shoot],
        -8,
      ),
    getNarration: (player) =>
      `${player?.name} shields their eyes from the blinding glowstone glare.`,
  },
  "Mountain Wind": {
    name: "Mountain Wind",
    category: "stadium",
    description:
      "High mountain gusts blow unpredictably through the open stadium terraces.",
    modifySkill: (skill, action) =>
      adjustForActions(
        skill,
        action,
        [ALL_ACTIONS.Pass, ALL_ACTIONS.Shoot],
        -10,
      ),
    getNarration: (player) =>
      `A sudden gust of mountain wind sweeps across the pitch.`,
  },
  "Market Day Crowd": {
    name: "Market Day Crowd",
    category: "stadium",
    description:
      "The high-spirited market crowd watches eagerly, cheering on lucky plays.",
    modifySkill: (skill, action) =>
      adjustForActions(
        skill,
        action,
        [
          ALL_ACTIONS.Pass,
          ALL_ACTIONS.Shoot,
          ALL_ACTIONS.Run,
          ALL_ACTIONS.Fight,
          ALL_ACTIONS.Heal,
        ],
        5,
      ), // General luck/morale boost
    getNarration: (player) =>
      `The roaring market day crowd cheers enthusiastically for ${player?.name}!`,
  },
  "Intense Heat": {
    name: "Intense Heat",
    category: "stadium",
    description:
      "The blistering desert sun drains players' energy, hampering all physical exertions.",
    modifySkill: (skill, action) =>
      adjustForActions(
        skill,
        action,
        [ALL_ACTIONS.Run, ALL_ACTIONS.Fight, ALL_ACTIONS.Pass],
        -5,
      ),
    getNarration: (player) =>
      `${player?.name} wipes sweat from their eyes in the oppressive heat.`,
  },
  Sandstorm: {
    name: "Sandstorm",
    category: "stadium",
    description:
      "A sudden sandstorm obscures visibility and makes throwing or shooting the ball a wild guess.",
    modifySkill: (skill, action) =>
      adjustForActions(
        skill,
        action,
        [ALL_ACTIONS.Pass, ALL_ACTIONS.Shoot],
        -15,
      ),
    getNarration: (player) =>
      `Stinging sand particles blind the players as a sandstorm blows through!`,
  },
  Dehydration: {
    name: "Dehydration",
    category: "stadium",
    description:
      "The dry desert air dehydrates players, dragging down all their physical actions.",
    modifySkill: (skill) => skill - 5,
    getNarration: (player) =>
      `${player?.name} gasps for water, visibly fatigued by dehydration.`,
  },
  "Hallowed Ground": {
    name: "Hallowed Ground",
    category: "stadium",
    description:
      "Sanctified energy protects the field, bolstering defensive play and healing prayers.",
    modifySkill: (skill, action) =>
      adjustForActions(
        skill,
        action,
        [ALL_ACTIONS.Heal, ALL_ACTIONS.Fight],
        10,
      ), // Boosts healing and blocking (fight)
    getNarration: (player) =>
      `A serene sense of peace and strength washes over ${player?.name} from the hallowed ground.`,
  },
  "Shield's Watch": {
    name: "Shield's Watch",
    category: "stadium",
    description:
      "The presence of holy temple protectors inspires players to stand strong in combat.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Fight], 5),
    getNarration: (player) =>
      `${player?.name} rallies under the watchful gaze of the Shield's protectors.`,
  },
  "Twinlight's Glow": {
    name: "Twinlight's Glow",
    category: "stadium",
    description:
      "Twin beacon lights cast clear beams across the pitch, aiding pathfinding and precise passing.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Pass], 8),
    getNarration: (player) =>
      `The beacon light perfectly illuminates ${player?.name}'s target path.`,
  },
  "Thick Mud": {
    name: "Thick Mud",
    category: "stadium",
    description:
      "A waterlogged pitch turned to thick, sticky clay makes running and catching the ball messy.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Run, ALL_ACTIONS.Pass], -10),
    getNarration: (player) =>
      `${player?.name} gets bogged down in the thick, squelching mud.`,
  },
  Sinkhole: {
    name: "Sinkhole",
    category: "stadium",
    description:
      "Dreaded structural collapses create sudden drops on the pitch that players must avoid.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Run], -15),
    getNarration: (player) =>
      `${player?.name} jumps to the side to avoid a sudden dip in the field!`,
  },
  "Ancient Ruins": {
    name: "Ancient Ruins",
    category: "stadium",
    description:
      "Stone pillars and sacred debris litter the outskirts of the field, blocking clear lines of sight.",
    modifySkill: (skill, action) =>
      adjustForActions(
        skill,
        action,
        [ALL_ACTIONS.Pass, ALL_ACTIONS.Shoot],
        -5,
      ),
    getNarration: (player) =>
      `${player?.name} navigates around a crumbling mossy pillar.`,
  },
  "Dense Fog": {
    name: "Dense Fog",
    category: "stadium",
    description:
      "A heavy, supernatural mist cloaks the stadium, severely reducing visibility for passes.",
    modifySkill: (skill, action) =>
      adjustForActions(
        skill,
        action,
        [ALL_ACTIONS.Pass, ALL_ACTIONS.Shoot],
        -12,
      ),
    getNarration: (player) =>
      `${player?.name} peers into the dense fog, unable to see more than a few feet.`,
  },
  "Uneven Footing": {
    name: "Uneven Footing",
    category: "stadium",
    description:
      "Cracked stone tiles and gravel patches make sprint starts dangerous.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Run], -5),
    getNarration: (player) =>
      `${player?.name} slips slightly on the loose gravel.`,
  },
  "Rowdy Crowd": {
    name: "Rowdy Crowd",
    category: "stadium",
    description:
      "Drunken shouts and rowdy fans fuel player aggression but make communication and passing difficult.",
    modifySkill: (skill, action) => {
      if (action === ALL_ACTIONS.Fight) return skill + 5;
      if (action === ALL_ACTIONS.Pass) return skill - 5;
      return skill;
    },
    getNarration: (player) =>
      `A thunderous roar from the rowdy crowd fires up the teams!`,
  },
  "Unstable Scaffolding": {
    name: "Unstable Scaffolding",
    category: "stadium",
    description:
      "The creaking wooden stands shake under the fans' weight, distracting players trying to block.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Fight], -8),
    getNarration: (player) =>
      `A creaking groan from the scaffolding makes ${player?.name} look up nervously.`,
  },
  "Street Performer": {
    name: "Street Performer",
    category: "stadium",
    description:
      "Buskers and jugglers perform right along the touchlines, occasionally distracting players.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Pass], -5),
    getNarration: (player) =>
      `${player?.name} glances over at a fire-breather on the sidelines.`,
  },
  "Hostile Takeover": {
    name: "Hostile Takeover",
    category: "stadium",
    description:
      "Tense corporate standoff vibes hover over the stadium, adding pressure and bad luck.",
    modifySkill: (skill) => skill - 5,
    getNarration: (player) =>
      `The corporate tension in the air weighs heavily on ${player?.name}.`,
  },
  "Hired Hecklers": {
    name: "Hired Hecklers",
    category: "stadium",
    description:
      "Jeers targeted at specific players disrupt coordinate plays like passing.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Pass], -8),
    getNarration: (player) =>
      `Hired hecklers direct a chorus of insults at ${player?.name}.`,
  },
  "Market Fluctuation": {
    name: "Market Fluctuation",
    category: "stadium",
    description:
      "Erratic cheers and sighs from the crowd match the shifting stock markets, affecting player focus.",
    modifySkill: (skill, action) => {
      if (action === ALL_ACTIONS.Fight) return skill + 5;
      if (action === ALL_ACTIONS.Run) return skill - 8;
      return skill;
    },
    getNarration: (player) =>
      `A strange murmur sweeps the crowd as stock ticker flags are waved.`,
  },
  "Cobblestone Pitch": {
    name: "Cobblestone Pitch",
    category: "stadium",
    description:
      "The hard stone surface makes running painful but makes tackles feel impactfully solid.",
    modifySkill: (skill, action) => {
      if (action === ALL_ACTIONS.Run) return skill - 8;
      if (action === ALL_ACTIONS.Fight) return skill + 5;
      return skill;
    },
    getNarration: (player) =>
      `${player?.name} stomps heavily on the unyielding cobblestones.`,
  },
  "Rampart Shadows": {
    name: "Rampart Shadows",
    category: "stadium",
    description:
      "Deep shadows cast by high stone battlements make it hard to spot the flying ball.",
    modifySkill: (skill, action) =>
      adjustForActions(
        skill,
        action,
        [ALL_ACTIONS.Pass, ALL_ACTIONS.Shoot],
        -8,
      ),
    getNarration: (player) =>
      `${player?.name} searches the deep rampart shadows for the ball.`,
  },
  "Castle Echo": {
    name: "Castle Echo",
    category: "stadium",
    description:
      "Sounds echo off the fortress walls, confusing players attempting to coordinate passes.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Pass], -5),
    getNarration: (player) =>
      `The deafening echo of the horn scrambles communication.`,
  },
  "Thin Air": {
    name: "Thin Air",
    category: "stadium",
    description:
      "High altitude leaves players short of breath, penalizing physical runs and combat.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Run, ALL_ACTIONS.Fight], -8),
    getNarration: (player) =>
      `${player?.name} gasps for air in the thin mountain atmosphere.`,
  },
  "Sudden Blizzard": {
    name: "Sudden Blizzard",
    category: "stadium",
    description:
      "Freezing winds and heavy snow reduce visibility and freeze fingers, hindering passing.",
    modifySkill: (skill, action) =>
      adjustForActions(
        skill,
        action,
        [ALL_ACTIONS.Pass, ALL_ACTIONS.Shoot, ALL_ACTIONS.Run],
        -15,
      ),
    getNarration: (player) =>
      `A freezing blast of snow sweeps across the pitch, blinding the players.`,
  },
  Vertigo: {
    name: "Vertigo",
    category: "stadium",
    description:
      "The sheer drops surrounding the cliffside stadium trigger mild dizziness in players.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Run, ALL_ACTIONS.Pass], -10),
    getNarration: (player) =>
      `${player?.name} glances down the cliffside and feels a wave of vertigo.`,
  },
  "Freezing Rain": {
    name: "Freezing Rain",
    category: "stadium",
    description:
      "Cold rain freezes on contact, making the ball slippery and fingers numb.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Pass, ALL_ACTIONS.Run], -10),
    getNarration: (player) =>
      `${player?.name} tries to wipe freezing rain from their eyes.`,
  },
  "Icy Field": {
    name: "Icy Field",
    category: "stadium",
    description:
      "A sheet of ice covering the pitch makes sudden turns and blocking slippery.",
    modifySkill: (skill, action) =>
      adjustForActions(
        skill,
        action,
        [ALL_ACTIONS.Run, ALL_ACTIONS.Fight],
        -12,
      ),
    getNarration: (player) =>
      `${player?.name} slides uncontrollably across the icy field!`,
  },
  "Wolf Pack Howling": {
    name: "Wolf Pack Howling",
    category: "stadium",
    description:
      "Disturbing howls from the surrounding dark pine woods shake player concentration.",
    modifySkill: (skill) => skill - 6,
    getNarration: (player) =>
      `An eerie chorus of wolf howls echoes through the stadium, chilling ${player?.name}.`,
  },
  "Gale-Force Winds": {
    name: "Gale-Force Winds",
    category: "stadium",
    description:
      "Violent winds off the ocean blow passes and shots completely off target.",
    modifySkill: (skill, action) =>
      adjustForActions(
        skill,
        action,
        [ALL_ACTIONS.Pass, ALL_ACTIONS.Shoot],
        -15,
      ),
    getNarration: (player) =>
      `A powerful gust of wind catches the ball and pushes it off-course.`,
  },
  "Sea Spray": {
    name: "Sea Spray",
    category: "stadium",
    description:
      "Salty sea mist coats the ball, making it slick and hard to grip.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Pass], -8),
    getNarration: (player) =>
      `${player?.name} struggles to grip the ball coated in salty sea spray.`,
  },
  "Rocky Outcropping": {
    name: "Rocky Outcropping",
    category: "stadium",
    description:
      "Natural rock formations jut out of the pitch, requiring nimble dodging.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Run], -10),
    getNarration: (player) =>
      `${player?.name} has to detour to avoid a jagged rock formation.`,
  },
  "Lagoon Splash": {
    name: "Lagoon Splash",
    category: "stadium",
    description:
      "Splashes from the adjacent lagoon water park occasionally drench players on the field.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Pass, ALL_ACTIONS.Run], -5),
    getNarration: (player) =>
      `A wave splashes over the side barrier, wetting ${player?.name}!`,
  },
  "Troupe Distraction": {
    name: "Troupe Distraction",
    category: "stadium",
    description:
      "Performers rehearsing theatrical pieces nearby draw players' attention away from the game.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Pass], -8),
    getNarration: (player) =>
      `${player?.name} is momentarily distracted by the theater troupe's dramatic shouting.`,
  },
  "Unstable Footing": {
    name: "Unstable Footing",
    category: "stadium",
    description:
      "Loose sand and shifting soil underfoot makes sprinting difficult.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Run], -5),
    getNarration: (player) => `${player?.name}'s foot slips in the loose soil.`,
  },
  "Distracted Tourists": {
    name: "Distracted Tourists",
    category: "stadium",
    description:
      "Sightseers occasionally wander onto the field, causing players to swerve around them.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Run, ALL_ACTIONS.Pass], -5),
    getNarration: (player) =>
      `${player?.name} has to dodge a confused tourist who wandered onto the pitch.`,
  },
  "Blinding Sun": {
    name: "Blinding Sun",
    category: "stadium",
    description:
      "The intense brightness makes looking upward to catch or shoot the ball difficult.",
    modifySkill: (skill, action) =>
      adjustForActions(
        skill,
        action,
        [ALL_ACTIONS.Pass, ALL_ACTIONS.Shoot],
        -10,
      ),
    getNarration: (player) =>
      `${player?.name} is momentarily blinded by the bright sun.`,
  },
  "Resort Security": {
    name: "Resort Security",
    category: "stadium",
    description:
      "Heavy resort security keeps a close eye on violence, making players hesitant during tackles.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Fight], -6),
    getNarration: (player) =>
      `${player?.name} hesitates on a tackle, feeling the security guards' eyes.`,
  },
  "Humming Earth": {
    name: "Humming Earth",
    category: "stadium",
    description:
      "Deep subterranean resonances seem to guide and steady the players' stances.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Fight], 5),
    getNarration: (player) =>
      `A strange vibration in the ground gives ${player?.name} a feeling of stability.`,
  },
  "Tangled Vines": {
    name: "Tangled Vines",
    category: "stadium",
    description:
      "Creeping weeds and thick vines wrap around ankles, slowing down runners.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Run], -8),
    getNarration: (player) =>
      `${player?.name} has to kick free from some clinging vines.`,
  },
  "Mine Draft": {
    name: "Mine Draft",
    category: "stadium",
    description:
      "Cold drafts from abandoned mine shafts blow across the field, chilling players' hands.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Pass], -5),
    getNarration: (player) =>
      `A chilly breeze from the mineshaft draft sweeps the pitch.`,
  },
  "Altitude Sickness": {
    name: "Altitude Sickness",
    category: "stadium",
    description:
      "The mountain height causes minor fatigue and headaches, slowing down reactions.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Run, ALL_ACTIONS.Fight], -8),
    getNarration: (player) =>
      `${player?.name} shakes their head, fighting off a wave of altitude fatigue.`,
  },
  "Sudden Downpour": {
    name: "Sudden Downpour",
    category: "stadium",
    description:
      "Heavy rain waterlogs the pitch, turning it into a giant mud puddle.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Pass, ALL_ACTIONS.Run], -10),
    getNarration: (player) =>
      `The rain pours down, soaking ${player?.name} and turning the field to mud.`,
  },
  Rockslide: {
    name: "Rockslide",
    category: "stadium",
    description:
      "Small pebbles and rocks occasionally slide onto the field from the cliffs above.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Run], -12),
    getNarration: (player) =>
      `${player?.name} sidesteps a shower of gravel sliding down from the slopes.`,
  },
  "Shifting Terrain": {
    name: "Shifting Terrain",
    category: "stadium",
    description:
      "Magically unstable earth moves underfoot, disrupting solid footing and blocking stances.",
    modifySkill: (skill, action) =>
      adjustForActions(
        skill,
        action,
        [ALL_ACTIONS.Run, ALL_ACTIONS.Fight],
        -10,
      ),
    getNarration: (player) =>
      `The soil shifts under ${player?.name}'s boots, throwing them off balance.`,
  },
  "Warden's Watch": {
    name: "Warden's Watch",
    category: "stadium",
    description:
      "The intimidating gaze of watch wardens makes players nervous about committing fouls.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Fight], -8),
    getNarration: (player) =>
      `${player?.name} pulls back slightly under the watchful gaze of the warden.`,
  },
  "Natural Advantages": {
    name: "Natural Advantages",
    category: "stadium",
    description:
      "Familiarity with the field's quirks gives the home team a slight combat advantage.",
    modifySkill: (skill, action, activePlayer, gameState) => {
      if (
        action === ALL_ACTIONS.Fight &&
        activePlayer &&
        gameState &&
        activePlayer.team === gameState.homeTeam.name
      ) {
        return skill + 5;
      }
      return skill;
    },
    getNarration: (player, action, success, gameState) => {
      if (player && player.team === gameState.homeTeam.name) {
        return `${player.name} capitalizes on their familiarity with the home terrain.`;
      }
      return null;
    },
  },
  "Ritual Focus": {
    name: "Ritual Focus",
    category: "stadium",
    description:
      "Leyline nodes bolster healing magic and lucky plays on the field.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Heal], 10),
    getNarration: (player) =>
      `${player?.name} feels energized by the proximity of the ritual focus point.`,
  },
  "Scarred Oak's Shadow": {
    name: "Scarred Oak's Shadow",
    category: "stadium",
    description:
      "The ancient tree's shadow casts an eerie gloom, distracting catches but fueling aggression.",
    modifySkill: (skill, action) => {
      if (action === ALL_ACTIONS.Pass) return skill - 5;
      if (action === ALL_ACTIONS.Fight) return skill + 5;
      return skill;
    },
    getNarration: (player) =>
      `The dark shadow of the Scarred Oak looms over ${player?.name}.`,
  },
  "Sewer Poison": {
    name: "Sewer Poison",
    category: "stadium",
    description:
      "Lingering toxic waste poisons and slows players when they go out of bounds, reducing Run and Fight skills.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Run, ALL_ACTIONS.Fight], -8),
    getNarration: (player) =>
      `${player?.name} wanders near the edge and inhales the toxic sewer runoff, leaving them poisoned and visibly slowed!`,
  },
  "Slippery Condensation": {
    name: "Slippery Condensation",
    category: "stadium",
    description:
      "The damp stone floor is slick with condensation, making footing unstable.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Run, ALL_ACTIONS.Pass], -5),
    getNarration: (player) =>
      `${player?.name} slips on the condensation-covered stone, barely maintaining balance!`,
  },
  "Abandoned Reservoir": {
    name: "Abandoned Reservoir",
    category: "stadium",
    description:
      "The eerie echoes and shadows of the massive cistern distort perception, throwing off passes and blocks.",
    modifySkill: (skill, action) =>
      adjustForActions(
        skill,
        action,
        [ALL_ACTIONS.Fight, ALL_ACTIONS.Pass],
        -5,
      ),
    getNarration: (player) =>
      `A hollow echo rebounds off the stone ceiling, momentarily distracting ${player?.name}.`,
  },
  "Grasping Roots": {
    name: "Grasping Roots",
    category: "stadium",
    description:
      "Gnarled roots reach out from the dark soil, wrapping around players' ankles and tripping them.",
    modifySkill: (skill, action) =>
      adjustForActions(skill, action, [ALL_ACTIONS.Run, ALL_ACTIONS.Fight], -8),
    getNarration: (player) =>
      `${player?.name} is briefly held back by a grasping root reaching from the forest floor!`,
  },
  "Eerie Whispers": {
    name: "Eerie Whispers",
    category: "stadium",
    description:
      "Fey whispers echo from the trees, distracting players and breaking their concentration.",
    modifySkill: (skill, action) =>
      adjustForActions(
        skill,
        action,
        [ALL_ACTIONS.Pass, ALL_ACTIONS.Shoot],
        -8,
      ),
    getNarration: (player) =>
      `Eerie whispers echo from the dark canopy, distracting ${player?.name}.`,
  },
  "Dark Forest": {
    name: "Dark Forest",
    category: "stadium",
    description:
      "The oppressive shadows of the deep forest canopy obscure visibility, making passes and throws difficult.",
    modifySkill: (skill, action) =>
      adjustForActions(
        skill,
        action,
        [ALL_ACTIONS.Pass, ALL_ACTIONS.Shoot],
        -8,
      ),
    getNarration: (player) =>
      `${player?.name} struggles to track the Trollball in the heavy shadows of the dark forest.`,
  },
};

// Aggregator helper to apply all active modifiers
export const applyActiveModifiers = (
  gameState: match_progress,
  activePlayer: player | undefined,
  action: ALL_ACTIONS,
  skill: number,
): { modifiedSkill: number; narrations: string[] } => {
  let modifiedSkill = skill;
  const narrations: string[] = [];

  if (!gameState.activeModifiers || gameState.activeModifiers.length === 0) {
    return { modifiedSkill, narrations };
  }

  for (const modName of gameState.activeModifiers) {
    const modifier = GAME_MODIFIERS[modName];
    if (modifier) {
      // Apply skill adjustment
      if (modifier.modifySkill) {
        modifiedSkill = modifier.modifySkill(
          modifiedSkill,
          action,
          activePlayer,
          gameState,
        );
      }
      // Check for play log narration (e.g. 20% chance to trigger narration so we don't spam the logs)
      if (modifier.getNarration && Math.random() < 0.2) {
        const narr = modifier.getNarration(
          activePlayer,
          action,
          false,
          gameState,
        );
        if (narr) {
          narrations.push(narr);
        }
      }
    }
  }

  return { modifiedSkill, narrations };
};
