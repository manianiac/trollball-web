export interface team {
  name: TEAM_NAMES;
  players: player[];
  stadium: stadium;
  luck: number;
  wins: number;
  losses: number;
  healer: player;
  activePlayers?: player[];
  inactivePlayers?: player[];
  score: number;
  slug: string;
}

export interface player {
  name: string;
  team: TEAM_NAMES;
  stats: stats;
}

export interface stats {
  // stats that matter
  pass: number;
  catch: number;
  run: number;
  block: number;
  fight: number;
  throw: number;
  luck: number;
  // player details
  pronouns: PRONOUNS | string;
  // silly stats
  literate: boolean;
  alcohol_tolerance: number;
  civic_engagement: number;
  pregame_ritual: string;
  favorite_weapon: string;
}

export interface stadium {
  name: string;
  location: string;
  description: string;
  modifiers: string[];
}

export interface activePlayers {
  homeTeamActive: player[];
  homeTeamDisabled: player[];
  awayTeamActive: player[];
  awayTeamDisabled: player[];
}

export interface match {
  homeTeam: team;
  awayTeam: team;
  preGame: string;
  postGame: string;
  week: number;
  homeScore: number;
  awayScore: number;
  slug: string;
}

export interface match_progress {
  homeTeam: team;
  awayTeam: team;
  week: number;
  homeScore: number;
  awayScore: number;
  possession: player | null;
  possessionTeam: TEAM_NAMES;
  currentZone: ZONE;
  plays: string[];
  latestAction?: string;
}

export enum ZONE {
  "Home Goal" = "Home Goal",
  "Home 2-Point" = "Home 2-Point",
  "Home Field" = "Home Field",
  "Center Field" = "Center Field",
  "Away Field" = "Away Field",
  "Away 2-Point" = "Away 2-Point",
  "Away Goal" = "Away Goal",
}

export const FAVORITE_WEAPON = [
  "Arming Sword",
  "Axe",
  "Bardiche",
  "Bastard Sword",
  "Battle Axe",
  "Billhook",
  "Blackjack",
  "Boar Spear",
  "Broadsword",
  "Buckler",
  "Cestus",
  "Chain Whip",
  "Claymore",
  "Club",
  "Cudgel",
  "Cutlass",
  "Dagger",
  "Dane Axe",
  "Dirk",
  "Estoc",
  "Falchion",
  "Flail",
  "Glaive",
  "Goedendag",
  "Great Axe",
  "Greatsword",
  "Halberd",
  "Hammer",
  "Hand Axe",
  "Hatchet",
  "Horseman's Pick",
  "Katar",
  "Kirkhammer",
  "Kriegsmesser",
  "Lance",
  "Longsword",
  "Mace",
  "Machete",
  "Main-gauche",
  "Mallet",
  "Maul",
  "Military Fork",
  "Morning Star",
  "Partisan",
  "Pike",
  "Pollaxe",
  "Quarterstaff",
  "Rapier",
  "Rondel Dagger",
  "Sap",
  "Scimitar",
  "Scythe",
  "Seax",
  "Shortsword",
  "Shovel",
  "Sickle",
  "Spear",
  "Spiked Gauntlet",
  "Stiletto",
  "Swordstaff",
  "Tabar",
  "Talwar",
  "Trident",
  "Voulge",
  "War Pick",
  "War Scythe",
  "Warhammer",
  "Whip",
  "Woodsman's Axe",
  "Zweihander",
];

export enum TEAM_NAMES {
  "No Team" = "No Team",
  "The Tortell Privateers" = "The Tortell Privateers",
  "The South Pole Yetis" = "The South Pole Yetis",
  "The Confluence Captains" = "The Confluence Captains",
  "The New Prosperity Profits" = "The New Prosperity Profits",
  "The Southport Narwhals" = "The Southport Narwhals",
  "The New Ravenfall Commanders" = "The New Ravenfall Commanders",
  "The Brimstone Fire Eaters" = "The Brimstone Fire Eaters",
  "The Zmeigorod Snessengers" = "The Zmeigorod Snessengers",
  "The Haven Lights" = "The Haven Lights",
  "The Desert Spectres" = "The Desert Spectres",
  "The Ebon Gate Corruptors" = "The Ebon Gate Corruptors",
  "The Wyrmwood Stronghammers" = "The Wyrmwood Stronghammers",
  "The New Monteforte Chaos Creatures" = "The New Monteforte Chaos Creatures",
  "The Kerlauger Runeguard" = "The Kerlauger Runeguard",
  "The Starlight Bazaar Bizarres" = "The Starlight Bazaar Bizarres",
  "The Oread's Summit Tamers" = "The Oread's Summit Tamers",
}

export const PREGAME_RITUAL = [
  "Meticulously cleaning each stud on their boots with a special brush.",
  "Going over the game plan drawn in the dirt with the team captain.",
  "Stretching their hamstrings for exactly seven minutes.",
  "Wrapping their knuckles with worn leather strips.",
  "Drinking a full waterskin of lukewarm water.",
  "Eating a specific, bland pre-game meal of boiled potatoes.",
  "Meditating silently in the corner of the locker room.",
  "Jogging three laps around the perimeter of the field.",
  "Getting a teammate to punch them in the shoulder, hard.",
  "Sharpening the edges of their blunted weapon (an exercise in futility).",
  "Doing a series of loud, guttural breathing exercises.",
  "Reviewing hand signals for secret plays.",
  "Applying a pungent liniment to their sore muscles.",
  "Weighing themselves on a large, inaccurate stone scale.",
  "Braiding their hair into tight, battle-ready rows.",
  "Chewing on a piece of tough, salted meat.",
  "Fasting for the six hours leading up to the match.",
  "Tapping each piece of their armor in a specific sequence.",
  "Staring at their reflection in a bucket of water until they feel 'ready'.",
  "Practicing their victory pose in front of a teammate for critique.",
  "Brewing and drinking a tea made from the grass of the playing field.",
  "Polishing their helmet with a live snail for good luck.",
  "Whispering a secret fear to the Trollball before the game.",
  "Arranging their gear in a perfect, aesthetically pleasing spiral.",
  "Trying to balance a wooden spoon on their nose for as long as possible.",
  "Drinking a shot of hot gravy from a dented tin cup.",
  "Having a staring contest with the largest player on their team.",
  "Singing a sea shanty completely out of tune.",
  "Eating a raw onion, layer by layer, without crying.",
  "Wearing their boots on the wrong feet during the warm-up.",
  "Insisting on being the last player to leave the locker room.",
  "Spitting on a specific patch of dirt near their own goal basket.",
  "Carrying a 'lucky' rock that they refuse to let anyone else touch.",
  "Muttering a nonsensical rhyme to ward off bad spirits.",
  "Tracing an invisible, complex sigil over their heart.",
  "Never washing their game-day tunic, no matter how foul it gets.",
  "Wearing a specific, garishly colored pair of undergarments.",
  "Tying a red string around their pinky finger.",
  "Turning their helmet around three times before putting it on.",
  "Burying a chicken bone near the opponent's sideline.",
  "Always putting on their left gauntlet before their right.",
  "Refusing to step on any lines on the field before the whistle blows.",
  "Collecting a pebble from every field they've ever played on.",
  "Clapping their hands a prime number of times.",
  "Chewing on a splinter of wood from a past goal basket.",
  "Kissing the Trollball on its stitched 'nose'.",
  "Headbutting their own team's goal post (gently).",
  "Telling a terrible joke to the Trollball to 'loosen it up'.",
  "Decorating their blunted weapon with a fresh, wild daisy.",
  "Balancing the Trollball on their head for a full minute.",
  "Giving the Trollball a heroic backstory before each game.",
  "Making sure their weapon has a specific, lucky number of dents.",
  "Rubbing the Trollball on their armpits for 'grip'.",
  "Performing a dramatic soliloquy for the Trollball.",
  "Asking the Trollball for advice, and pretending to listen to its response.",
  "Chewing a specific, bitter root said to improve night vision.",
  "Rubbing a foul-smelling local mushroom on their elbows for flexibility.",
  "Making a small offering of bread and salt to a local field spirit.",
  "Mimicking the call of the regional 'Gloom-Lark' for courage.",
  "Anointing their forehead with morning dew.",
  "Searching for a four-leaf clover near the sidelines.",
  "Wearing a necklace of polished river stones.",
  "Sticking a specific type of feather in their helmet's plume.",
  "Eating a piece of honeycomb to 'sweeten' their victory.",
  "Consulting a folk rhyme about the weather to predict the game's outcome.",
  "Leading the team in a synchronized chant that slowly gets louder.",
  "Tapping their weapons together in a rhythmic pattern.",
  "Sharing a ceremonial, non-alcoholic grog from a communal cup.",
  "Giving a rambling, often nonsensical 'pump-up' speech.",
  "A team-wide moment of absolute silence to 'gather their thoughts'.",
  "Lining up and slapping each other on the back, from smallest to largest player.",
  "Creating a human pyramid, with the team's lightest player on top.",
  "Reciting the names of legendary Trollball players of the past.",
  "Painting a single, matching stripe of mud on each player's face.",
  "Huddling so tightly that no light can be seen between them.",
  "Polishing their boots with bacon grease.",
  "Gargling with saltwater and then spitting it towards the opponent's side.",
  "Arm-wrestling the player who plays the same position on their team.",
  "Telling each other exaggerated lies about their own strength.",
  "Smelling a piece of burnt wood from a campfire.",
  "Filing down a single fingernail into a sharp point.",
  "Licking their own elbow (or attempting to).",
  "Cracking every knuckle in their hands, twice.",
  "Shaving one half of their mustache for important games.",
  "Plucking a single hair from a teammate's beard for luck.",
  "Trying to catch a fly with their bare hands.",
  "Seeing how many dried beans they can fit in their nostril.",
  "Insisting their armor has to be put on by two other people.",
  "Rubbing dirt from the center of the field onto their biceps.",
  "Finding the oldest player on the team and asking for a blessing.",
  "Chugging a small bottle of vinegar.",
  "Doing a terrible, clumsy dance to 'loosen the joints'.",
  "Slapping their own helmet until their ears ring.",
  "Hanging upside down from a tree branch for a minute.",
  "Yelling a compliment at the meanest-looking player on the opposing team.",
  "Tying their bootlaces together and hopping to the starting line.",
  "Eating a dandelion, stem and all.",
  "Lying completely flat on the ground, trying to 'feel the field's energy'.",
  "Inspecting their blunted weapon for imaginary cracks.",
  "Using a whetstone to polish, not sharpen, their weapon's flat edge.",
  "Checking the fit of their helmet a dozen times.",
  "Adjusting their codpiece with theatrical importance.",
  "Re-taping their shield's handle with fresh leather.",
  "Making sure their shin guards are perfectly symmetrical.",
  "Staring intently at their gauntlets, as if for the first time.",
  "Testing the heft of their weapon with a series of slow, deliberate swings.",
  "Bouncing a small leather ball against a wall.",
  "Arguing with the quartermaster over the quality of the team's water.",
  "Reciting a short, epic poem about a past victory.",
  "Having a 'lucky child' from the village touch their shield.",
  "Bribing a local oracle with a meat pie for a vague prophecy.",
  "Reading their own fortune in a scattering of knuckle bones.",
  "Patting every beast of burden they see on the way to the match.",
  "Finding a beetle and setting it on its back, then flipping it over to 'earn a favor'.",
  "Tying a small, hand-carved wooden bird to their gear.",
  "Avoiding eye contact with anyone wearing the color green.",
  "Humming a tune they believe only they know.",
  "Tugging on their left earlobe three times.",
  "Asking a teammate to tell them a story, but only the beginning.",
  "Scratching their initials into the dirt with their boot heel.",
  "Eating a hard-boiled egg and putting the shell in their pocket.",
  "Counting the number of clouds in the sky.",
  "Wiggling their fingers in a complex, magical-looking pattern.",
  "Biting down on a leather strap until the first whistle.",
  "Clenching and unclenching their jaw to a silent rhythm.",
  "Pacing in a perfect square in the locker room.",
  "Attempting to perfectly mimic the stance of a statue in the town square.",
  "Listening to the wind for a sign of which way the game will turn.",
  "Methodically tearing a large leaf into tiny, identical pieces.",
  "Focusing on the sound of their own heartbeat.",
  "Staring at a single blade of grass until their eyes water.",
  "Reciting their grocery list backward to clear their mind.",
  "Tensing every muscle in their body at once, then releasing.",
  "Dipping their hands in a bucket of ice-cold well water.",
  "Applying mud to their face in a pattern resembling their team's sigil.",
  "Chugging a raw egg, shell and all.",
  "Getting a teammate to pour a bucket of cold water over their head.",
  "Licking a whetstone.",
  "Smelling their own game-worn socks from the previous match.",
  "Chewing on tree bark.",
  "Spitting into their own hand and then slapping their face with it.",
  "Sharing a piece of fermented fish with a teammate.",
  "Seeing who on the team can belch the loudest.",
  "Daring a teammate to eat a live worm.",
  "Lighting a small piece of parchment on fire and inhaling the smoke.",
  "Wiping a teammate's sweat onto their own forehead.",
  "Finding the muddiest puddle and stomping in it with bare feet.",
  "Painting their teeth with a mixture of charcoal and water.",
  "Braiding a teammate's nose hair.",
  "Covering their forearms in a sticky tree sap for 'grip'.",
  "A quiet, personal prayer to a minor god of bruises.",
  "A toast of goat's milk to the health of their rivals.",
  "Leaving a small, carved turnip at the base of the goal basket.",
  "Confessing a minor, recent sin to a teammate.",
  "Exchanging well-wishes with their direct opponent before the game starts.",
  "Thanking their armor for the protection it's about to offer.",
  "A group hug that lasts a little too long.",
  "Passing a 'team luckstone' from player to player without speaking.",
  "Looking each teammate in the eye and giving a single, firm nod.",
  "Organizing a small betting pool on who will score first.",
  "Applying a liberal amount of lard to their exposed skin to 'deflect blows'.",
  "Sticking leeches to their legs to 'lighten their step'.",
  "Drinking a tonic made from boiled nettles and goat's blood.",
  "Screaming at a wall until they are hoarse.",
  "Kissing their biceps and whispering words of encouragement to them.",
  "Performing a series of aggressive, theatrical poses.",
  "Painting a crude, snarling face on their stomach.",
  "Arguing with a tree.",
  "Tying a live chicken to the goal post (it is removed before the game starts).",
  "Trying to start a 'slow clap' with the audience before the game has begun.",
  "Trying to teach a stray dog a complicated and useless new trick.",
  "Insisting on wearing a ridiculously oversized, floppy hat during warm-ups.",
  "Speaking only in rhymes for the hour before the game.",
  "Challenging a spectator to a game of tic-tac-toe in the dirt.",
  "Pretending to be a statue until the first whistle blows.",
  "Attempting to communicate with birds.",
  "Drawing a detailed, anatomically incorrect diagram of a troll's head.",
  "Washing their hands with dirt.",
  "Burying their helmet in the ground and then digging it back up.",
  "Asking the referee to bless their weapon.",
  "Peeling a potato with their teeth.",
  "Combing their hair with a fish skeleton.",
];

export enum PRONOUNS {
  "He/Him" = "He/Him",
  "He/Them" = "He/Them",
  "She/Her" = "She/Her",
  "She/Them" = "She/Them",
  "They/Them" = "They/Them",
}

export const STADIUM_MODIFIERS = [""];

export const GAME_DURATION = 60; //rounds

export const STARTING_ROSTER_SIZE = 10;

export enum ALL_ACTIONS {
  "No Action" = -1,
  "Run",
  "Pass",
  "Shoot",
  "Heal",
  "Fight",
}

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

export const ANNOUNCER_INSTRUCTIONS =
  "You are describing the play-by-play phases of a game of Trollball, a fantasy mix between rugby and Bloodbowl, played with a leather facsimile of a troll head." +
  "\nDon't mention stats or other details, as this is an in-universe retelling, but feel free to comment on general levels(like a team being particularly lucky if their luck stat is above 70)." +
  "\nDo not describe any additional game actions." +
  "\nYou will describe these play-by-plays as though you are a radio announcer, styled after Ernie Harwell" +
  "\nEach round is 20 seconds, so keep your narration very brief while staying descriptive. Try not to repeat descriptions used previously in the fiction array";

export const AUDIO_INSTRUCTIONS =
  "In the style and pacing of a sports radio announcer, rushing to finish his words before the next action happens.";

export const TROLLBALL_CONTEXT =
  "Trollball is a game where 2 teams fight over possession of a leather mimickry of a Troll head. The teams are equipped with blunted weapons and armor, and fighting is encouraged. The game is similar to Basketball where there is a large field divided into halves, with a basket on the ground at each end that the Trollball needs to be deposited into. There is a 2 point line around it, where getting the ball into the basket scores an additional point. The game is similar to rugby in that you carry the ball and run with it, trying to get to the opposing basket while fighting off your enemies. There is a lot of waiting for an opening to try and break through a defensive line.";
