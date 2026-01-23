import fs from "fs";
import path from "path";

const ROOT = "src";

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|js|jsx)$/.test(ent.name)) out.push(p);
  }
  return out;
}

function parseImports(code) {
  const out = [];
  const re = /from\s+["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(code))) out.push(m[1]);
  return out;
}

function resolve(spec, fromFile) {
  if (spec.startsWith("@/")) return path.join("src", spec.slice(2));
  if (spec.startsWith(".")) return path.resolve(path.dirname(fromFile), spec);
  return null;
}

function existsAny(base) {
  const exts = ["", ".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx"];
  for (const e of exts) {
    if (fs.existsSync(base + e)) return base + e;
  }
  return null;
}

const all = new Set(walk(ROOT));
const entries = [...all].filter((f) =>
  f.includes("src/app/") && (f.endsWith("page.tsx") || f.endsWith("route.ts"))
);

const seen = new Set();
const q = [...entries];

while (q.length) {
  const f = q.pop();
  if (!f || seen.has(f) || !fs.existsSync(f)) continue;
  seen.add(f);

  const code = fs.readFileSync(f, "utf8");
  for (const spec of parseImports(code)) {
    const base = resolve(spec, f);
    if (!base) continue;
    const hit = existsAny(base);
    if (!hit) continue;
    if (!seen.has(hit)) q.push(hit);
  }
}

const reachableLib = [...seen].filter((f) => f.startsWith("src/lib/"));
reachableLib.sort();

const stubCandidates = reachableLib.filter((f) => {
  try {
    const lines = fs.readFileSync(f, "utf8").split("\n").length;
    return lines <= 30;
  } catch {
    return false;
  }
});

fs.writeFileSync("/tmp/reachable-lib.txt", reachableLib.join("\n"));
fs.writeFileSync("/tmp/reachable-stubs.txt", stubCandidates.join("\n"));

console.log("Wrote:");
console.log("  /tmp/reachable-lib.txt");
console.log("  /tmp/reachable-stubs.txt");
console.log(`Reachable lib files: ${reachableLib.length}`);
console.log(`Reachable <=30-line stubs: ${stubCandidates.length}`);
