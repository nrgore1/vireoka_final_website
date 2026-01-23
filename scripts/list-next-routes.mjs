import fs from "fs";

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

// App Router manifests (varies by Next version)
const candidates = [
  ".next/server/app-paths-manifest.json",
  ".next/server/app-path-routes-manifest.json",
  ".next/server/pages-manifest.json",
];

const found = candidates.find((p) => fs.existsSync(p));
if (!found) {
  console.error("No route manifest found. Run: npm run build");
  process.exit(1);
}

const m = loadJSON(found);
const keys = Object.keys(m).sort();

console.log(`Manifest: ${found}`);
console.log(keys.join("\n"));
