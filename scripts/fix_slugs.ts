import fs from "fs";
import path from "path";

const resultsDir = path.join(process.cwd(), "utils", "gameRunner", "results");

if (fs.existsSync(resultsDir)) {
  const files = fs.readdirSync(resultsDir);
  let updatedCount = 0;

  files.forEach((file) => {
    if (file.endsWith(".json") && file.startsWith("po-")) {
      const filePath = path.join(resultsDir, file);
      try {
        const content = fs.readFileSync(filePath, "utf8");
        const json = JSON.parse(content);

        const filenameSlug = file.replace(".json", "");

        if (json.slug !== filenameSlug) {
          console.log(
            `Updating slug for ${file}: ${json.slug} -> ${filenameSlug}`,
          );
          json.slug = filenameSlug;
          fs.writeFileSync(filePath, JSON.stringify(json, null, 2), "utf8");
          updatedCount++;
        }
      } catch (err) {
        console.error(`Error processing ${file}:`, err);
      }
    }
  });
  console.log(`Updated ${updatedCount} files.`);
} else {
  console.log("Results directory not found.");
}
