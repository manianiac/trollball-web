import { player } from "./types";

export const generateNormalRandom = (mean: number, stdDev: number): number => {
  let u1 = Math.random();
  let u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

  return Math.round(z0 * stdDev + mean);
};

export const boundedNumber = (
  number: number,
  maxBound: number,
  minNumber: number,
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

export const formatText = (text: string) => {
  // 1. Clean up outer quotes (if they exist from the mock data)
  const cleanText = text.replace(/^"|"$/g, "");

  return cleanText.replaceAll("\n\n", "\n\n&nbsp;\n\n");
};

/**
 * Creates a "hash" from a string to be used as a seed.
 * This is a simple algorithm to turn a string (like team names) into a number.
 */
function cyrb128(str: string): number {
  let h1 = 1779033703,
    h2 = 3144134277,
    h3 = 1013904242,
    h4 = 2773480762;

  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);

  return (h1 ^ h2 ^ h3 ^ h4) >>> 0;
}

/**
 * Creates a new, deterministic pseudo-random number generator (PRNG) based on a seed.
 * This uses the mulberry32 algorithm.
 * @param seed A string or number to seed the generator.
 * @returns A function that, when called, returns a random number between 0 and 1.
 */
export function createSeededRandom(seed: number | string): () => number {
  let a: number;

  if (typeof seed === "string") {
    a = cyrb128(seed);
  } else {
    a = seed;
  }

  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);

    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Shuffles an array in place using a seed (Fisher-Yates algorithm).
 * @param array The array to shuffle.
 * @param seed The seed to use for randomization.
 * @returns The *same* array, now shuffled.
 */
export function seededShuffle<T>(array: T[], seed: number | string): T[] {
  const prng = createSeededRandom(seed);
  let m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(prng() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}
