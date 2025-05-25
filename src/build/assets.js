import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basePath = path.join(__dirname, "../assets");

const distPath = path.join(__dirname, "../../dist");

if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

function walk(dir) {
  const result = {
    name: path.basename(dir),
    children: [],
  };

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.children.push(walk(fullPath));
    } else {
      const content = fs.readFileSync(fullPath, "utf-8");
      result.children.push({ name: entry.name, content });
    }
  }

  return result;
}

const tree = walk(basePath);

fs.writeFileSync(
  path.join(distPath, "assets.json"),
  JSON.stringify(tree, null, 2)
);