import { Markov } from "ts-markov";
import fs from "fs";
import path from "path";
import { generateTeam } from "./utils/generateTeam";
import { TEAM_NAMES } from "@/shared/types";

const generateNameGenerator = (): Markov => {
  const filePath = path.join(process.cwd(), "shared", "names.txt");
  if (!fs.existsSync(filePath)) {
    console.error(`Error: names.txt not found at ${filePath}`);
    process.exit(1);
  }
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const lines = fileContent
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const nameGenerator = new Markov();

  lines.forEach((line) => {
    nameGenerator.addSentence([line]);
  });
  nameGenerator.train();

  return nameGenerator;
};

const formatTeamToTs = (teamObj: any): string => {
  const jsonStr = JSON.stringify(teamObj, null, 2);
  let tsStr = jsonStr
    .replace(/"name":\s*"([^"]+)"/g, (match, name) => {
      if (name === teamObj.name) {
        return `name: TEAM_NAMES["${name}"]`;
      }
      return `name: "${name}"`;
    })
    .replace(/"team":\s*"([^"]+)"/g, (match, name) => {
      return `team: TEAM_NAMES["${name}"]`;
    })
    .replace(
      /"(slug|losses|wins|score|luck|stadium|location|description|modifiers|healer|stats|pass|catch|run|block|fight|throw|pronouns|civic_engagement|alcohol_tolerance|current_alcohol|favorite_weapon|pregame_ritual|literate|players)":/g,
      "$1:",
    );

  return `  [TEAM_NAMES["${teamObj.name}"]]: ${tsStr},`;
};

const main = () => {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log(`
Usage: npx tsx runner/generateTeamCli.ts "<Team Name>" "[Faction]" "[Stadium Name]" "[Location]" "[Description]" "[Modifiers]"

Arguments:
  1. Team Name    (e.g., "The Mellondor Meadows")
  2. Faction      (e.g., "Mellondor") - defaults to "Unaligned"
  3. Stadium Name (e.g., "The Canopy Colosseum") - defaults to "The [Team Name without 'The'] Stadium"
  4. Location     (e.g., "Mellondor (The High Canopy)") - defaults to "[Faction]"
  5. Description  (e.g., "A stadium built among the ancient boughs...") - defaults to a generic description
  6. Modifiers    (e.g., "Thick Mud,High Winds,Forest Canopy") - comma-separated list of modifiers

Example:
  npx tsx runner/generateTeamCli.ts "The Mellondor Meadows" "Mellondor" "The Canopy Arena" "Mellondor (The Heart of the Forest)" "A beautiful field surrounded by ancient whispering trees." "Thick Mud,Forest Canopy"
`);
    process.exit(0);
  }

  const [
    teamName,
    faction = "Unaligned",
    stadiumNameInput,
    locationInput,
    descriptionInput,
    modifiersInput,
  ] = args;

  const cleanTeamName = teamName.replace(/^The\s+/i, "");
  const slug = teamName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const stadiumName = stadiumNameInput || `The ${cleanTeamName} Stadium`;
  const location = locationInput || faction;
  const description =
    descriptionInput ||
    `The home field of the ${teamName}, constructed specifically for their Trollball matches.`;
  const modifiers = modifiersInput
    ? modifiersInput.split(",").map((m) => m.trim())
    : ["Thick Mud", "Uneven Ground"];

  console.log(`\n=== Trollball Team Generator ===`);
  console.log(`Team Name:   "${teamName}"`);
  console.log(`Slug:        "${slug}"`);
  console.log(`Faction:     "${faction}"`);
  console.log(`Stadium:     "${stadiumName}"`);
  console.log(`Location:    "${location}"`);
  console.log(`Modifiers:   ${JSON.stringify(modifiers)}`);
  console.log(`---------------------------------\n`);

  console.log(`Training Markov name generator...`);
  const nameGenerator = generateNameGenerator();

  console.log(`Generating roster and healer stats...`);
  const generatedTeam = generateTeam(teamName as any, nameGenerator);

  generatedTeam.stadium = {
    name: stadiumName,
    location: location,
    description: description,
    modifiers: modifiers,
  };

  // Convert to TypeScript code block
  const tsCode = formatTeamToTs(generatedTeam);

  // Print results
  console.log(`\n🎉 Success! Team generated.\n`);
  console.log(`===================================================`);
  console.log(`1. Add to shared/types/game.ts (inside TEAM_NAMES):`);
  console.log(`===================================================`);
  console.log(`  "${teamName}": "${teamName}",\n`);

  console.log(`===================================================`);
  console.log(
    `2. Add to simulator/heroes.ts (inside "${faction}" associatedTeams):`,
  );
  console.log(`===================================================`);
  console.log(`      TEAM_NAMES["${teamName}"],\n`);

  console.log(`===================================================`);
  console.log(`3. Add to shared/teams.ts (inside TEAMS):`);
  console.log(`===================================================`);
  console.log(tsCode);
  console.log(`\n===================================================`);

  // Write to a temporary JSON file for convenience
  const outputDir = path.join(process.cwd(), "runner", "utils");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const jsonPath = path.join(outputDir, `generated-${slug}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(generatedTeam, null, 2), "utf-8");
  console.log(`💾 Raw JSON copy saved to: ${jsonPath}\n`);
};

main();
