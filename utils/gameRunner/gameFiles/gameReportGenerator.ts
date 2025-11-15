// Import the Google GenAI package
import {
  GoogleGenAI,
  GenerationConfig,
  SafetySetting,
  HarmCategory,
  HarmBlockThreshold,
  Schema,
  Type,
} from "@google/genai";

import { match_progress, TEAM_NAMES } from "@/utils/consts";

// --- API Key Setup ---
// The package will automatically find the GOOGLE_API_KEY environment variable
const genAI = new GoogleGenAI({});

// This is the JSON structure we will force the model to return.
// It includes the pre/post-game reports and extracts the final score.
interface GameReport {
  preGameReport: string;
  postGameReport: string;
  finalScore: {
    homeTeam: string;
    homeScore: number;
    awayTeam: string;
    awayScore: number;
  };
}

const GAME_REPORT_SCHEMA = {
  type: Type.OBJECT, // <-- USE THE ENUM
  properties: {
    preGameReport: {
      type: Type.STRING, // <-- USE THE ENUM
      description:
        "The pre-game report, written in character as Nok the Corrupter. Should build anticipation and introduce the teams, referencing their pre-game rituals or stats from the provided data. Write several paragraphs",
    },
    postGameReport: {
      type: Type.STRING, // <-- USE THE ENUM
      description:
        "The post-game report, written in character as Nok the Corrupter. Should summarize the game's key plays (from the 'plays' array), state the final score, and celebrate the action. Can throw shade at heroes if relevant. Write at least 10 paragraphs",
    },
  },
  required: ["preGameReport", "postGameReport"],
};
const NOK_THE_CORRUPTER_PERSONA = `
You are Nok the Corrupter, a demon announcer for the fantasy sport Trollball.
You speak with the over-the-top enthusiasm of a 1950's baseball radio announcer.
You are very positive about Trollball and the brutal action of the game.
You will be given a JSON object containing all the data for a completed game.
Your task is to generate a pre-game and a post-game report based *only* on the data provided.

RULES:
- You MUST write in character at all times.
- Pre-game: Build hype, mention the teams, and maybe a player's pre-game ritual (found in their stats).
- Post-game: Summarize the action using the 'plays' array. Announce the final score and winner.
- Throw shade at the "heroes" of the realm when possible, but don't be repetitive.
- Your response MUST be in the specified JSON format.
`;

// Set safety settings to allow for fantasy violence descriptions
const safetySettings: SafetySetting[] = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    // Allow descriptions of the in-game fighting
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

const heroesOfTheRealm = [
  {
    faction: "Eponore",
    associatedTeams: [
      TEAM_NAMES["The New Ravenfall Commanders"],
      TEAM_NAMES["The Brimstone Fire Eaters"],
    ],
    characters: [
      "Sir Tanos, the Bold, wielder of the cursed Sunbringer",
      "God King Sir Artorias the Moonslayer, Friend of the Fey, Former Chairman, Osterra's Celebrity, slayer of monsters",
      "Morgwae, the Warlock, Chief Arcanist",
      "Dima, the shadow king and assassin",
      "Governer-King Zenku, who is ashamed of his face",
      "Notable Fey Hater Linaeus",
      "Sawyer, the rogueiest rogue, circus escapee",
    ],
  },
  {
    faction: "The Grove",
    associatedTeams: [
      TEAM_NAMES["The Zmeigorod Snessengers"],
      TEAM_NAMES["The Wyrmwood Stronghammers"],
    ],
    characters: [
      "Count Trez Arrigo, the former pirate, captain of commerce, who wooed his high priestess",
      "Oona, High Priestess of the Green Goddess, executor of my corrupted friends",
      "Valos the Eternal, Bog Queen of Zmeigorod, self proclaimed god",
      "Dame Gwion, Absent but still feared",
      "Dane, peddler of cursed anti-corruption",
    ],
  },
  {
    faction: "The Guild of the Black Sky",
    associatedTeams: [
      TEAM_NAMES["The Confluence Captains"],
      TEAM_NAMES["The New Prosperity Profits"],
    ],
    characters: [
      "Chairman Sir Garon Ironrock of the People, Door Enjoyer",
      "Chairman High Venture Brennen Farno, money priest, kissless virgin, strangely beautiful",
      "Chairman Toland, Necromancer Archaeologist, cheese enthusiast, decent baker",
      "Nikos Thanae the Benevolent, who shoots people in the streets, my least friend",
      "Cyfnerth the Butcher of Confluece, a man after my own stomach, dedicated recycler",
    ],
  },
  {
    faction: "Geth",
    associatedTeams: [TEAM_NAMES["The Desert Spectres"]],
    characters: ["Geth the Gravelord, the realm's best frenemy"],
  },
  {
    faction: "The White Ravens",
    associatedTeams: [
      TEAM_NAMES["The Kerlauger Runeguard"],
      TEAM_NAMES["The New Monteforte Chaos Creatures"],
    ],
    characters: [
      "Dame Terra Monteforte, dirt wizard, kidnapper of prophets",
      "Colm, warrior of the White Ravens, Osterra's most cursed man, excellent handshake",
    ],
  },
  {
    faction: "The Prismatic Troups",
    associatedTeams: [
      TEAM_NAMES["The Oread's Summit Tamers"],
      TEAM_NAMES["The Starlight Bazaar Bizarres"],
    ],
    characters: [
      "Kython, the ringleader of the fey circus, fun guy",
      "Caenis the Fatebreaker, but maybe the Oathbreaker,but maybe the Morrigan? She's going through it",
    ],
  },
  {
    faction: "Cedar Hill",
    associatedTeams: [
      TEAM_NAMES["The South Pole Yetis"],
      TEAM_NAMES["The Tortell Privateers"],
    ],
    characters: [
      "Imra, Master of Elixers, Dust Afficionado. Seriously, pay your bar tab",
      "Elspeth Ortell, Osterra's friendliest Disintegrate Dealer, makes a mean ritual sangria, almost money priestess",
      "Joslyn, who runs that contemptible greenhouse",
    ],
  },
  {
    faction: "Grimfrost",
    associatedTeams: [TEAM_NAMES["The Southport Narwhals"]],
    characters: [
      "King Nezmear, of the north(but not the north pole), breeder of werewolves",
    ],
  },
  {
    faction: "The Wardens",
    associatedTeams: [
      TEAM_NAMES["Oak & Onslaught"],
      TEAM_NAMES["The Greenwatch"],
    ],
    characters: [
      "Sir Randy, the ranger with the FANCY bow",
      "Falric, thief of hearts, backbone of the economy, Saint of the Church of Pecune",
      "Levania, who loves shiny things, the reason Falric is broke",
    ],
  },
];

/**
 * Generates game reports by calling the Gemini API.
 * @param gameData The full JSON object of the game progress file (like testOut.json).
 * @returns A promise that resolves to the structured GameReport object.
 */
export async function generateGameReports(
  gameData: match_progress
): Promise<GameReport | null> {
  try {
    // The User Prompt: This is the specific task and the data to use.
    // We stringify the game data and pass it in the prompt.
    const userQuery = `
      Here is the full game data for a Trollball match. Please generate the pre-game and post-game reports.

      This is a pre-season batch of games

      <game_data>
      ${JSON.stringify(gameData)}
      </game_data>

      This is a list of some of the Heroes of the Realm. Feel free to riff and mock these characters
      <hero_data>
      ${JSON.stringify(heroesOfTheRealm)}
      </hero_data>
    `;

    // Generate the content
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-pro",
      contents: userQuery,
      config: {
        safetySettings: safetySettings,
        responseMimeType: "application/json",
        responseSchema: GAME_REPORT_SCHEMA,
        systemInstruction: NOK_THE_CORRUPTER_PERSONA,
        temperature: 1.0,
      }, // Pass the JSON config here
    });
    const candidate = result.candidates?.[0];

    if (candidate && candidate.content?.parts?.[0]?.text) {
      // The model's response is a *string* of JSON. We need to parse it.
      const jsonResponseText = candidate.content.parts[0].text;

      return JSON.parse(jsonResponseText) as GameReport;
    } else {
      // Log the reason if it was blocked
      if (result.promptFeedback) {
        console.error(
          "Error: Prompt was blocked.",
          JSON.stringify(result.promptFeedback, null, 2)
        );
      }
      if (candidate?.finishReason) {
        console.error(
          "Error: Generation finished early.",
          candidate.finishReason,
          candidate.safetyRatings
        );
      }

      return null;
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);

    return null;
  }
}
