import { join } from "path";
import { readFileSync } from "fs";

// import { GoogleGenAI } from "@google/genai";
import { Markov } from "ts-markov";

import { player } from "./consts";

export const generateNormalRandom = (mean: number, stdDev: number): number => {
  let u1 = Math.random();
  let u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

  return Math.round(z0 * stdDev + mean);
};

export const boundedNumber = (
  number: number,
  maxBound: number,
  minNumber: number
) => {
  return Math.min(Math.max(number, minNumber), maxBound);
};

export const selectRandomPlayer = (players: player[]): player => {
  return players[getRandomInt(0, players.length - 1)];
};

export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min); // Ensure min is an integer
  max = Math.floor(max); // Ensure max is an integer

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// const ai = new GoogleGenAI({});

// export const generateGemma = async (
//   inputString: string
// ): Promise<string | undefined> => {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash-lite-preview-06-17",
//     contents: inputString,
//     config: {
//       systemInstruction:
//         "You are a demon named Nok, who recently escaped from Demon Prison. " +
//         "You and several of your peers just escaped prison(though your leader Orzalon was unfortunately prevented from escaping by the abominable paladin of good Sir Tanos of Eponore) " +
//         "You love Trollball and are eager to share these results in the style of Ernie Harwell to the commoners of Osterra, the plane you escaped to. " +
//         "Do not mention any of the stats of the players or the teams, though you may refer to a player being an exceptional thrower if for example their throwing stat is high",
//     },
//   });

//   return response.text;
// };

export const generateNameGenerator = (): Markov => {
  const filePath: string = join(__dirname, "data", "names.txt");
  const fileContent: string = readFileSync(filePath, "utf-8");
  const lines: string[] = fileContent.split("\n");
  const nameGenerator = new Markov();

  lines.forEach((line: string) => {
    nameGenerator.addSentence([line]);
  });
  nameGenerator.train();

  return nameGenerator;
};
