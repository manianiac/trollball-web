
import fs from 'fs';
import path from 'path';

const GAMES_DIR = path.join(process.cwd(), "utils", "gameRunner", "results");

const fixFormatting = () => {
    const filenames = fs.readdirSync(GAMES_DIR);

    filenames.forEach(filename => {
        // Target po-9 and po-10 for now, or maybe all?
        // User specifically asked about "eacch pre/post game", implying maybe recent ones are bad.
        // I'll target po-9 and po-10 specifically to verify the fix first.
        if ((filename.startsWith("po-9-") || filename.startsWith("po-10-")) && filename.endsWith(".json")) {
            const filePath = path.join(GAMES_DIR, filename);
            const content = fs.readFileSync(filePath, "utf-8");
            const game = JSON.parse(content);

            let changed = false;

            const fixText = (text: string) => {
                if (!text) return text;
                // If it already has \n\n, assume it's fine?
                if (text.includes("\n\n") || text.includes("\r\n\r\n")) return text;

                // Replace double spaces with \n\n
                // Also handle potential single spaces if it looks like a paragraph break?
                // The pattern seemed to be "  "
                if (text.includes("  ")) {
                    return text.replace(/  /g, "\n\n");
                }
                return text;
            };

            if (game.preGame) {
                const newPre = fixText(game.preGame);
                if (newPre !== game.preGame) {
                    game.preGame = newPre;
                    changed = true;
                }
            }
            if (game.postGame) {
                const newPost = fixText(game.postGame);
                if (newPost !== game.postGame) {
                    game.postGame = newPost;
                    changed = true;
                }
            }

            if (changed) {
                console.log(`Fixing formatting for ${filename}`);
                fs.writeFileSync(filePath, JSON.stringify(game, null, 2), "utf-8"); // Also pretty print the JSON
            }
        }
    });
};

fixFormatting();
