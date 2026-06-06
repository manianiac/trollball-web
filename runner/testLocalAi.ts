import { generateGameReports } from "../simulator/gameReportGenerator";
import fs from "fs";
import path from "path";

const main = async () => {
  // Set local AI env vars
  process.env.USE_LOCAL_AI = "true";
  process.env.LOCAL_AI_URL = "http://192.168.1.19:8033/v1/chat/completions";

  const resultsDir = path.join(process.cwd(), "runner", "results");
  const sampleFile = path.join(resultsDir, "0-brimstone-desert.json");
  if (!fs.existsSync(sampleFile)) {
    console.error("Sample match file not found!");
    process.exit(1);
  }

  const sampleMatch = JSON.parse(fs.readFileSync(sampleFile, "utf-8"));

  console.log("Calling local AI with sample match...");
  const report = await generateGameReports(sampleMatch as any);

  console.log("\n=== Resulting parsed report object ===");
  console.log(JSON.stringify(report, null, 2));
};

main();
