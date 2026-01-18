// Import the Google GenAI package
import {
  GoogleGenAI,
  SafetySetting,
  HarmCategory,
  HarmBlockThreshold,
  Type,
} from "@google/genai";

import { match, match_progress, TEAM_NAMES } from "@/utils/types";
import { old_popularity, popularity } from "./popularity";
import { heroesOfTheRealm } from "./heroes";
import { STATIC_LEAGUE_SCHEDULE } from "../schedule";
import { TEAMS } from "@/utils/teams";

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
        "The pre-game report, written in character as Nok the Corrupter. Should build anticipation and introduce the teams, referencing their pre-game rituals or stats from the provided data. If the game is an open bar, hype up the drinking. Write several paragraphs",
    },
    postGameReport: {
      type: Type.STRING, // <-- USE THE ENUM
      description:
        "The post-game report, written in character as Nok the Corrupter. Should summarize the game's key plays (from the 'plays' array), state the final score, and celebrate the action. Can throw shade at heroes if relevant. If the game is an open bar, comment on the drunkenness of the players. Write at least 10 paragraphs",
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

const generateContentHelper = async (
  prompt: string,
  schema?: any,
  mimeType: string = "text/plain",
  temperature: number = 1.0,
): Promise<string | null> => {
  try {
    const result = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        safetySettings: safetySettings,
        responseMimeType: mimeType,
        responseSchema: schema,
        systemInstruction: NOK_THE_CORRUPTER_PERSONA,
        temperature: temperature,
      },
    });
    const candidate = result.candidates?.[0];

    if (candidate && candidate.content?.parts?.[0]?.text) {
      return candidate.content.parts[0].text;
    } else {
      if (result.promptFeedback) {
        console.error(
          "Error: Prompt was blocked.",
          JSON.stringify(result.promptFeedback, null, 2),
        );
      }
      if (candidate?.finishReason) {
        console.error(
          "Error: Generation finished early.",
          candidate.finishReason,
          candidate.safetyRatings,
        );
      }
      return null;
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return null;
  }
};

export async function generateRecapSummary(pastRecaps: any[]): Promise<string> {
  const pastRecapsData = `{results:${pastRecaps
    .map((val) => JSON.stringify(val))
    .join(",")}}`;

  const userQuery = `
      Analyze the following past weekly recaps for the fantasy sport Trollball.
      Extract the writing style and "voice" of the announcer, Nok the Corrupter.
      Summarize the key ongoing storylines, rivalries, recurring jokes, and character arcs that have been established.
      Create a "Tone and Storyline Guide" that I can pass to an AI to generate the next week's recap in the exact same style and continuing these stories.
      
    Make sure to include the following:
    - Announcer Voice
    - Catchphrases
    - Teams(each team)
    -- Ongoing Storylines & Rivalries between teams
    -- Don't include specific heroes here, as those are tracked in a separate document


      <past_recaps>
      ${pastRecapsData}
      </past_recaps>

      <teams>
      ${Object.entries(TEAMS)
      .map(([key, value]) =>
        JSON.stringify({
          ...value,
          players: [],
        }),
      )
      .join(",")}
      </teams>
    `;

  const result = await generateContentHelper(
    userQuery,
    undefined,
    "application/json",
    1.0,
  );

  return result || "";
}

export async function generateWeeklyReport(
  allGamesData: match[],
  pastRecapsSummary: string,
  week: number,
): Promise<string> {
  const jsonData = `{results:${allGamesData.map((val) => JSON.stringify(val))}}`;

  const userQuery = `
      Here is are all of the Trollball matches this season. Please generate a lengthy recap covering the highlites of the latest week(week ${week}). This is the final week of the season before we head into the playoffs.

      Format the "content" as a blog post, adding markdown headers and other formatting, including but not limited to emojii
      Don't go over every game, but instead group similar games and comment on spectacular plays.
      For example, group any shutouts or close matches, or any games that went into overtime.
      Comment on the drunkenness of the players if the game was an open bar, reveling in the chaos.

      Make sure to leave the "date" to be a "TODO" so that I can fill it in later

      <game_data>
      ${jsonData}
      </game_data>

      Here is a summary of the past weeks' storylines and the specific tone/voice of Nok the Corrupter you MUST emulate.
      Use this guide to ensure continuity with previous posts.
      <past_context>
      ${pastRecapsSummary}
      </past_context>

      Here is the current popularity of each team, which you can reference to comment on fan reactions and attendance
      These are relative popularity scores based off of discord votes, with 0(no votes) being the least popular.
      Don't mention numbers directly, but use them to guide your commentary on fan engagement.
      <current popularity>
      ${JSON.stringify(popularity)}
      </current popularity>
      <historical popularity>
      ${JSON.stringify(old_popularity)}
      </historical popularity>

      This is a list of some of the Heroes of the Realm. Feel free to riff and mock/praise these characters
      <hero_data>
      ${JSON.stringify(heroesOfTheRealm)}
      </hero_data>
    `;

  const result = await generateContentHelper(
    userQuery,
    BLOG_POST_SCHEMA,
    "application/json",
    1.3,
  );

  try {
    return result ? JSON.parse(result) : "";
  } catch (error) {
    console.error("Failed to parse JSON result:", error);
    if (result) {
      console.log("Result snippet (start):", result.substring(0, 500));
      console.log(
        "Result snippet (end):",
        result.substring(result.length - 500),
      );
    }
    return "";
  }
}

export async function generateGameReports(
  gameData: match_progress,
  seriesGames?: match[],
): Promise<GameReport | null> {
  const userQuery = `
      Here is the full game data for a Trollball match. Please generate the pre-game and post-game reports.
      
      This is the playoffs, in the ${gameData.bracket || "Winners"} Bracket, so make sure to comment on the playoff atmosphere. These are played Best of 5, and you will be given each past game in a series(including possible past matchups). The loser of the BO3 will be sent to the loser's bracket
      
      Use markdown formatting(like headers or lists) and use emojii as needed

      <game_data>
      ${JSON.stringify(gameData)}
      </game_data>

      Here is the current popularity of each team, which you can reference to comment on fan reactions and attendance
      These are relative popularity scores based off of discord votes, with 0(no votes) being the least popular.
      Don't mention numbers directly, but use them to guide your commentary on fan engagement.
      <current popularity>
      ${JSON.stringify(popularity)}
      </current popularity>
      <historical popularity>
      ${JSON.stringify(old_popularity)}
      </historical popularity>

      This is a list of some of the Heroes of the Realm. Feel free to riff and mock/praise these characters.
      If the game is an open bar, comment on the drunkenness of the players.
      Comment on how the stadium is influencing the game as well.
      <hero_data>
      ${JSON.stringify(heroesOfTheRealm)}
      </hero_data>
      
      Here are all the games in this series that have already been played
      This is currently game ${gameData.week} of 5
      <past_games>
      ${JSON.stringify(seriesGames)}
      </past_games>

      If the same team won both the first and second games, don't generate a report for the third game.
    `;

  const result = await generateContentHelper(
    userQuery,
    GAME_REPORT_SCHEMA,
    "application/json",
    1.0,
  );

  return result ? (JSON.parse(result) as GameReport) : null;
}

export async function generateDiscordAnnouncement(
  allGamesData: match[],
  pastRecaps: any[],
  week: number,
): Promise<string> {
  const jsonData = `{results:${allGamesData.map((val) => JSON.stringify(val))}}`;
  const pastRecapsData = `{results:${pastRecaps
    .map((val) => JSON.stringify(val))
    .join(",")}}`;

  // [Celebrate the results of the previous vote, Unnatural Intervention! Give hints at what this might change, but be cryptic and don't promise anything]
  // [Call to action to vote for the Future of Trollball, where the audience gets to have an influence over how the game evolves. I will provide the choices separately, so don't give suggestions or options here]

  const userQuery = `
      Here is are all of the Trollball matches, as well as your recaps this season. Please generate an announcement post for the LARP Discord Server for week(week ${week}). This is the final week of the season before we head into the playoffs.

      Format the "content" as an announcement, using Discord formatting, including but not limited to emojii. Feel free to insert Faction or Team emojii, even if one doesn't exist as there are custom emojii for all factions.
      Don't spoil any results, but instead build hype for the past week, mentioning any rivalries or anticipated matchups.

      Format it into a text file(no JSON formatting at all) with appropriate line breaks.

      A sample format is as follows:
        [Celebrate Tuesday Night Trollball!]
        [Hint at any exciting plays or rivalries that happened this week, but DO NOT hint at who won or lost]
        [Encourage fans to check out the full recap on the Trollball Website]
        [Call to action to vote for their favorite team in the popularity contest next time it appears] 

      For this week's announcement, it is the season finale! Next week begins the Playoffs, so encourage people to put in their prediction brackets. Entry cost is 1(one) tooth.

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
      <historical popularity>
      ${JSON.stringify(old_popularity)}
      </historical popularity>

      This is a list of some of the Heroes of the Realm. Feel free to riff and mock/praise these characters
      <hero_data>
      ${JSON.stringify(heroesOfTheRealm)}
      </hero_data>
    `;

  const result = await generateContentHelper(
    userQuery,
    undefined,
    "text/plain",
    1.3,
  );

  return result || "";
}

export async function generatePopularityPost(
  allGamesData: match[],
  pastRecaps: any[],
  week: number,
): Promise<string> {
  const nextWeekMatches = STATIC_LEAGUE_SCHEDULE.filter(
    (match) => match.week === week + 1,
  );

  const scheduleText = nextWeekMatches
    .map(
      (match) => `
          ${match.homeTeam.name}
          vs
          ${match.awayTeam.name}
          @ ${match.homeTeam.stadium.name}`,
    )
    .join("\n");

  const jsonData = `{results:${allGamesData.map((val) => JSON.stringify(val))}}`;
  const pastRecapsData = `{results:${pastRecaps
    .map((val) => JSON.stringify(val))
    .join(",")}}`;

  const userQuery = `
      Here is are all of the Trollball matches, as well as your recaps this season. Please generate an popularity post for the LARP Discord Server for week(${week}). This is the final week of the season before we head into the playoffs.

      Format the "content" using Discord formatting, including but not limited to emojii. Feel free to insert Faction or Team emojii, even if one doesn't exist as there are custom emojii for all factions.
Mention any rivalries or anticipated matchups for the upcoming week.
      Format it into a text file(no JSON formatting at all) with appropriate line breaks.

      A sample format is as follows:
        [Celebrate the past week of Tuesday Night Trollball]
        [Reveal the results of the previous feature vote, celebrating the winning choice and teasing how it will impact future games]
        [Call to action to vote for their favorite team in the popularity contest]
        [List the matchings for the next week, hyping up any rivalries or anticipated matchups]

      <game_data>
      ${jsonData}
      </game_data>

      If you made fun of a character recently, try to avoid repeating the same jokes as well as pick on other characters.
      <past_recaps>
      ${pastRecapsData}
      </past_recaps>

      Here is the previous popularity of each team, which you can reference to comment on fan reactions and attendance
      These are relative popularity scores based off of discord votes, with 0(no votes) being the least popular.
      Don't mention numbers directly, but use them to guide your commentary on fan engagement.
      <current popularity>
      ${JSON.stringify(popularity)}
      </current popularity>
      <historical popularity>
      ${JSON.stringify(old_popularity)}
      </historical popularity>

      This is a list of some of the Heroes of the Realm. Feel free to riff and mock/praise these characters
      <hero_data>
      ${JSON.stringify(heroesOfTheRealm)}
      </hero_data>

      <schedule>
${scheduleText}
      </schedule>
    `;

  const result = await generateContentHelper(
    userQuery,
    undefined,
    "text/plain",
    1.3,
  );

  return result || "";
}

export async function generateCelebrityPost(
  pastRecaps: any[],
): Promise<string> {
  // const jsonData = `{results:${allGamesData.map((val) => JSON.stringify(val))}}`;
  const pastRecapsData = `{results:${pastRecaps
    .map((val) => JSON.stringify(val))
    .join(",")}}`;

  const userQuery = `
      Please generate a blog post for the Celebrity Game at Trollmas 2025.
      This is a game where the Heroes of the Realm play Trollball, with much more violence than regulation games.
      The reporting was performed by Nok, Chairman Brennen, and Oenotheera the Necromancer
      
      Format the "content" as a blog post, adding markdown headers and other formatting, including but not limited to emojii
      // Don't go over every game, but instead group similar games and comment on spectacular plays.
      // For example, group any shutouts or close matches, or any games that went into overtime.
      // Comment on the drunkenness of the players if the game was an open bar, reveling in the chaos.

      Make sure to leave the "date" to be a "TODO" so that I can fill it in later

      <game_data>
      Here is the updated, comprehensive report for **Trollball 25 - Oenotheera**, incorporating the handwritten notes, the written play-by-play, and the transcripts from the on-field audio recordings.

### **Match Overview**
* **Event:** Trollball 25 - Oenotheera
* **Matchup:** Geth (Yellow) vs. The Order of the Black Sky / "Gribmle's Team" (Red)
* **Winner:** **Geth** (Final Score: 12 - 11)
    * *Note:* This marks Geth's **6th Championship victory**, which he described as "Amazing."

---

### **Team Rosters & Strategy**

**Team Geth (Yellow)**
* **Captain:** Geth
* **Roster:** Vidarians, Color Guard(Violet, Orange), Yarp, Kython, Maple, Geth Incorporated Incorporeal.
* **Pre-Game Strategy:** "Just go onto the battlefield in whatever order, we will figure it out later."
* **Vibe:** Chaotic. "We are Geth."

**Team Order (Red)**
* **Captain:** Grimble
* **Roster:** Black Sky(Cyfnerth), Bruni (w/ Sword of Sylvia), Dinosaur Rider, Quinn, Gribmle.
* **Motto:** "Best defense is murder."
* **Goal:** "Bring down tyranny of 5 years."

---

### **Game Narrative**

#### **First Half**
* **Early Game Chaos:** The match began with immediate confusion. Grimble scored the opener (1 point) for Order because Team Geth forgot they needed to retrieve the ball.
* **Trading Blows:**
    * Bruni (Order) scores.
    * Colm (Geth) answers with a valiant score.
    * Bellocq (White Raven Healer) scores for Order after a bounce-out from Maple.
    * **The "Air Death":** The guy who looks suspiciously like the Late Vidar Khan(rest in violence) attempts a score but "died valiantly in the air" (No Goal).
* **Geth Rallies:** Maple scores, followed by Gribmle (Order) failing a throw-in but recovering to score anyway.
* **"Inflate Gate":** Maple lodges a formal complaint that the Trollball felt light and "floated in the goal."
* **Late 2nd Quarter:** Arden makes a beautiful toss (2 points). Flax sneaks behind the front line to score.

#### **Halftime Report & Interviews**

**The Great Bakeoff**
* **Reporter:** Cinnemon
* **Status:** "Fantastic." There were 9 entries submitted with 3 of the 4 judges having reviewed them.
* **Winner:** Albert Cline (Dragon Cookie).
* **Quote:** *"It'll never be too late. Cookies are in your heart."* — Cinnamon.

**Captain Interviews (The Locker Room)**
* **Geth (Yellow):** Geth appeared exhausted but in high spirits, stating he missed the community. He felt his performance was strong, specifically citing that the **"new rules updated"** and **"clarifications from previous years"** were helping the game flow better.
* **Grimble (Red):** When asked for his mid-game outlook, Grimble revealed a psychological strategy: *"I want to let Geth think that he still has the trophy in his hands so I can get the satisfaction of ripping it from him... let him get a little bit up, and then we go in, finish him off."*

#### **Second Half**
* **The Violet Factor:** Violet scores at least 3 times for Geth. Despite written notes that *"Jingle Jingle Jingle"* was heard and *"She is wearing bells, people!"*, the defense failed to track her.
* **Order Pushes Back:** Lo scores for Order (fighting through his own team to do so). Coriander adds 2 points.
* **Defensive Stands:** Kython is noted for goaltending.
* **Fatalities:** The Red Wizard Kay kills someone with a spell ball "for no reason" and fights off the police, only to be killed later by Grimble.
* **The Finish:** Quartermaster walks it in gracefully for Geth. Lycaenious scores the closer.

#### **Post-Game Aftermath**
* **The Result:** Geth wins 12-11.
* **The Skirmish:** Immediately following the win, Order charged Team Geth and "slaughtered them," though the loss stood.

**Post-Game Comments:**
* **Geth (Winner):** *"Six times is amazing... There [were] a bit of mistakes but... I gotta go celebrate with my team."*
* **Grimble (Loser):** Refused to speak to reporters, shouting, *"No comment! No media!"* while walking away.

---

### **Official Scoreboard**

| Period | Geth (Yellow) | Order/Skippy (Red) | Notes |
| :--- | :--- | :--- | :--- |
| **1st** | 5 | 2 | Geth dominates early despite confusion. |
| **2nd** | 3 | 4 | Order rallies. |
| **3rd** | 4 | 0 | **Running Total: Geth 11 - Order 7.** |
| **4th** | 1 | 4 | Order mounts a comeback. |
| **FINAL**| **12** | **11** | **Geth Victory.** |

---

### **Match Highlights & Marginalia**

* **Physicality:** 2 swords to the face; 2 ball punches by swords; lots of "out of bounds" calls.
* **Notable Quotes:**
    * *"I'm getting blessed so I can SMITE Geth"* — Grimble
    * *"Are you eating a damn sandwich right now?"* — Colm (referencing a Grilled Cheese incident).
    * *"Rhiannon is a suck up"* — Boxed note on score sheet.
* **Doodles:** "Sir K" in a Santa hat wishing everyone a "Happy Trollmas."
      </game_data>

      This is a list of some of the Heroes of the Realm. Feel free to riff and mock/praise these characters
      <hero_data>
      ${JSON.stringify(heroesOfTheRealm)}
      </hero_data>
      
      Here are past weekly recaps for reference, so you can maintain a consistent tone and style, as well as track any storylines
      // If you made fun of a character recently, try to avoid repeating the same jokes as well as pick on other characters.
      <past_recaps>
      ${pastRecapsData}
      </past_recaps>

      Here is the current popularity of each team, which you can reference to comment on fan reactions and attendance
      These are relative popularity scores based off of discord votes, with 0(no votes) being the least popular.
      Don't mention numbers directly, but use them to guide your commentary on fan engagement.
      <current popularity>
      ${JSON.stringify(popularity)}
      </current popularity>


    `;

  const result = await generateContentHelper(
    userQuery,
    BLOG_POST_SCHEMA,
    "application/json",
    1.3,
  );

  return result ? JSON.parse(result) : "";
}
