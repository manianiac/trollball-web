import { generateGamesTS } from "./createGames";
import fs from "fs";
import path from "path";

const games = generateGamesTS();
const outputPath = path.join(
  process.cwd(),
  "runner",
  "results",
  "games.generated.ts",
);

const fileContent = `// THIS FILE IS AUTO-GENERATED\nimport { match } from '@/shared/types';\nexport const GAMES: match[] = ${JSON.stringify(games, null, 2)};\n`;

fs.writeFileSync(outputPath, fileContent, "utf-8");

console.log(
  `Successfully regenerated games.generated.ts with ${games.length} games.`,
);
