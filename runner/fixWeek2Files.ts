import fs from "fs";
import path from "path";

const resultsDir = path.join(__dirname, "results");
if (!fs.existsSync(resultsDir)) {
  console.error("Results directory not found!");
  process.exit(1);
}

const files = fs.readdirSync(resultsDir);

const stringifyIfNeeded = (val: any): string => {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (Array.isArray(val)) {
    return val.map((item) => stringifyIfNeeded(item)).join("\n\n");
  }
  if (typeof val === "object") {
    return Object.entries(val)
      .map(([key, value]) => {
        const heading = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())
          .replace(/_/g, " ")
          .trim();
        if (typeof value === "object") {
          return `### ${heading}\n${stringifyIfNeeded(value)}`;
        }
        return `### ${heading}\n\n${value}`;
      })
      .join("\n\n");
  }
  return String(val);
};

for (const file of files) {
  if (!file.endsWith(".json")) continue;
  const filePath = path.join(resultsDir, file);
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(content);

    let modified = false;
    if (data.preGame && typeof data.preGame !== "string") {
      data.preGame = stringifyIfNeeded(data.preGame);
      modified = true;
    }
    if (data.postGame && typeof data.postGame !== "string") {
      data.postGame = stringifyIfNeeded(data.postGame);
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
      console.log(`Fixed formatting in: ${file}`);
    }
  } catch (err) {
    console.error(`Error processing ${file}:`, err);
  }
}
