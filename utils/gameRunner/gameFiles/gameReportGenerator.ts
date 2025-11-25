// Import the Google GenAI package
import {
  GoogleGenAI,
  SafetySetting,
  HarmCategory,
  HarmBlockThreshold,
  Type,
} from "@google/genai";

import { match, match_progress, TEAM_NAMES } from "@/utils/consts";
import { popularity } from "./popularity";
import { heroesOfTheRealm } from "./heroes";

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

export const BLOG_POST_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    id: {
      type: Type.STRING,
      description:
        "A unique, URL-friendly slug for the post, like 'preseason-recap'.",
    },
    title: {
      type: Type.STRING,
      description:
        "The title of the blog post, written in an enthusiastic, in-character headline style.",
    },
    date: {
      type: Type.STRING,
      description:
        "The publish date of the blog post, formatted as 'Month DD, YYYY' (e.g., 'November 14, 2025').",
    },
    author: {
      type: Type.STRING,
      description:
        "The author of the post, which should always be 'Nok the Corrupter'.",
    },
    content: {
      type: Type.STRING,
      description:
        "The full text content of the blog post, written in character as Nok the Corrupter. This should be several paragraphs long, written in Markdown format (using \\n\\n for paragraph breaks).",
    },
  },
  required: ["id", "title", "date", "author", "content"],
};

const NOK_THE_CORRUPTER_PERSONA = `
You are Nok the Corrupter, a demon announcer for the fantasy sport Trollball, giving the weekly reports for Tuesday Night Trollball.
You speak with the over-the-top enthusiasm of a 1950's baseball radio announcer.
You are very positive about Trollball and the brutal action of the game.
You will be given a JSON object containing all the data for a completed game.
Your favorite team is the Ebon Gate Corruptors, and you hate the Haven Lights. You try to stay neutral, but your favoritism shows through.
Your task is to generate a pre-game and a post-game report based *only* on the data provided.

SETTING INFORMATION:
The current plane is Osterra, where native Osterrans exist alongside adventurers that have been pulled from other realities to fight in the Everwar, a conflict that prevents the participants from staying dead, instead regenerating with the memory of their death lost.
You were previously trapped in the Demon Prison, and were set free by a group of Adventurers led by Morgwae and Artorias in a successful effort to rescue Sir Tanos
Trollball is a sport played by all, and is a mixture of football and rugby where the goal is to get a leather troll head into a basket on the floor of the opposing team's territory
The players are allowed and encouraged to fight, with injuries being a regular occurence.

TROLLBALL RULES
Trollball is a chaotic, violent fantasy sport played on a linear field divided into five zones. The objective is to score more points than the opposition while physically incapacitating their players.
Scoring: Teams score 1 point by carrying or passing the ball into the opponent's end zone ("Touchdown"), or 2 points by throwing the ball through the goal from a distance ("Shoot").
Combat: Violence is a core mechanic. Players use weapons to attack opponents. If a player loses a fight, they are Knocked Out and removed from the field immediately. If the ball carrier is KO'd, the ball is dropped.
Healing: Each team has a dedicated Healer. They can revive Knocked Out players and return them to active play. If a team is completely wiped out, a Healer must intervene.
Possession: There are no organized turns. Initiative is random. The ball is frequently dropped during tackles and failed passes, leading to frantic scrambles to pick it up.
Game Flow: The match includes a Halftime break (where all KO'd players are fully healed and returned to the field) and goes into Overtime if the score is tied.

RULES:
- You MUST write in character at all times.
- Pre-game: Build hype, mention the teams, and maybe a player's pre-game ritual (found in their stats).
- Post-game: Summarize the action using the 'plays' array. Announce the final score and winner.
- Throw shade at the "heroes" of the realm when possible, but don't be repetitive.
- Avoid phrases such as :"So Called Heroes" or "slobbernocker"
- If there is a specified format, your response MUST be in the specified JSON format.
- If there is no specified format, respond in markdown only.
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

/**
 * Generates game reports by calling the Gemini API.
 * @param gameData The full JSON object of the game progress file (like testOut.json).
 * @returns A promise that resolves to the structured GameReport object.
 */
export async function generateWeeklyReport(
  allGamesData: match[],
  pastRecaps: any[],
  week: number
): Promise<string> {
  const jsonData = `{results:${allGamesData.map((val) => JSON.stringify(val))}}`;
  const pastRecapsData = `{results:${pastRecaps
    .map((val) => JSON.stringify(val))
    .join(",")}}`;

  try {
    // The User Prompt: This is the specific task and the data to use.
    // We stringify the game data and pass it in the prompt.
    const userQuery = `
      Here is are all of the Trollball matches this season. Please generate a lengthy recap covering the highlites of the latest week(week ${week}).

      Format the "content" as a blog post, adding markdown headers and other formatting, including but not limited to emojii
      Don't go over every game, but instead group similar games and comment on spectacular plays.
      For example, group any shutouts or close matches, or any games that went into overtime.

      Make sure to leave the "date" to be a "TODO" so that I can fill it in later

      <game_data>
      ${jsonData}
      </game_data>

      Here are past weekly recaps for reference, so you can maintain a consistent tone and style, as well as track any storylines
      If you made fun of a character recently, try to avoid repeating the same jokes as well as pick on other characters.
      <past_recaps>
      ${pastRecapsData}
      </past_recaps>

      Here is the current popularity of each team, which you can reference to comment on fan reactions and attendance
      These are relative popularity scores based off of discord votes, with 0(no votes) being the least popular.
      Don't mention numbers directly, but use them to guide your commentary on fan engagement.
      <current popularity>
      ${JSON.stringify(popularity)}
      </current popularity>

      This is a list of some of the Heroes of the Realm. Feel free to riff and mock/praise these characters
      <hero_data>
      ${JSON.stringify(heroesOfTheRealm)}
      </hero_data>
    `;

    // Generate the content
    const result = await genAI.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: userQuery,
      config: {
        safetySettings: safetySettings,
        responseMimeType: "application/json",
        responseSchema: BLOG_POST_SCHEMA,
        systemInstruction: NOK_THE_CORRUPTER_PERSONA,
        temperature: 1.3,
      }, // Pass the JSON config here
    });
    const candidate = result.candidates?.[0];

    if (candidate && candidate.content?.parts?.[0]?.text) {
      // The model's response is a *string* of JSON. We need to parse it.
      const jsonResponseText = candidate.content.parts[0].text;

      return JSON.parse(jsonResponseText);
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

      return "";
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);

    return "";
  }
}

export async function generateGameReports(
  gameData: match_progress
): Promise<GameReport | null> {
  try {
    // The User Prompt: This is the specific task and the data to use.
    // We stringify the game data and pass it in the prompt.
    const userQuery = `
      Here is the full game data for a Trollball match. Please generate the pre-game and post-game reports.
      Use markdown formatting(like headers or lists) and use emojii as needed

      <game_data>
      ${JSON.stringify(gameData)}
      </game_data>

      This is a list of some of the Heroes of the Realm. Feel free to riff and mock/praise these characters
      <hero_data>
      ${JSON.stringify(heroesOfTheRealm)}
      </hero_data>
    `;

    // Generate the content
    const result = await genAI.models.generateContent({
      model: "gemini-3-pro-preview",
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

export async function generateDiscordAnnouncement(
  allGamesData: match[],
  pastRecaps: any[],
  week: number
): Promise<string> {
  const jsonData = `{results:${allGamesData.map((val) => JSON.stringify(val))}}`;
  const pastRecapsData = `{results:${pastRecaps
    .map((val) => JSON.stringify(val))
    .join(",")}}`;

  try {
    // The User Prompt: This is the specific task and the data to use.
    // We stringify the game data and pass it in the prompt.
    const userQuery = `
      Here is are all of the Trollball matches, as well as your recaps this season. Please generate an announcement post for the LARP Discord Server for week(week ${week}).

      Format the "content" as an announcement, using Discord formatting, including but not limited to emojii. Feel free to insert Faction or Team emojii, even if one doesn't exist as there are custom emojii for all factions.
      Don't spoil any results, but instead build hype for the past week, mentioning any rivalries or anticipated matchups.

      Format it into a text file(no JSON formatting at all) with appropriate line breaks.

      A sample format is as follows:
        [Celebrate Tuesday Night Trollball!]
        [Hint at any exciting plays or rivalries that happened this week, but DO NOT hint at who won or lost]
        [Encourage fans to check out the full recap on the Trollball Website]
        [Call to action to vote for their favorite team in the popularity contest next time it appears] 
        [Call to action to vote for the Future of Trollball, where the audience gets to have an influence over how the game evolves. I will provide the choices separately, so don't give suggestions or options here]

      <game_data>
      ${jsonData}
      </game_data>

      If you made fun of a character recently, try to avoid repeating the same jokes as well as pick on other characters.
      <past_recaps>
      ${pastRecapsData}
      </past_recaps>

      Here is the current popularity of each team, which you can reference to comment on fan reactions and attendance
      These are relative popularity scores based off of discord votes, with 0(no votes) being the least popular.
      Don't mention numbers directly, but use them to guide your commentary on fan engagement.
      <current popularity>
      ${JSON.stringify(popularity)}
      </current popularity>

      This is a list of some of the Heroes of the Realm. Feel free to riff and mock/praise these characters
      <hero_data>
      ${JSON.stringify(heroesOfTheRealm)}
      </hero_data>
    `;

    // Generate the content
    const result = await genAI.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: userQuery,
      config: {
        safetySettings: safetySettings,
        responseMimeType: "text/plain",
        // responseSchema: BLOG_POST_SCHEMA,
        systemInstruction: NOK_THE_CORRUPTER_PERSONA,
        temperature: 1.3,
      },
    });
    const candidate = result.candidates?.[0];

    if (candidate && candidate.content?.parts?.[0]?.text) {
      // The model's response is a *string* of JSON. We need to parse it.
      const jsonResponseText = candidate.content.parts[0].text;

      return jsonResponseText;
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

      return "";
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);

    return "";
  }
}
