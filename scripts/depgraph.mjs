import fs from "fs";
import path from "path";

const ROOT = "src";
const include = [
  "src/app/api/",
  "src/app/investors/",
  "src/app/admin/",
  "src/lib/invest",
  "src/lib/supabase/",
  "src/lib/notify/",
];

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|js|jsx)$/.test(ent.name)) out.push(p);
  }
  return out;
}

function shouldInclude(file) {
  return include.some((p) => file.startsWith(p));
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
  return null; // ignore node_modules
}

function existsAny(base) {
  const exts = ["", ".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx"];
  return exts.find((e) => fs.existsSync(base + e)) || null;
}

const files = walk(ROOT).filter(shouldInclude);
const graph = new Map();

for (const f of files) {
  const code = fs.readFileSync(f, "utf8");
  const imps = parseImports(code);
  const deps = [];
  for (const s of imps) {
    const r = resolve(s, f);
    if (!r) continue;
    const hit = existsAny(r);
    if (!hit) continue;
    deps.push((r + hit).replace(process.cwd() + path.sep, ""));
  }
  graph.set(f, deps);
}

const lines = [];
for (const [k, deps] of graph.entries()) {
  for (const d of deps) lines.push(`"${k}" -> "${d}"`);
}

const dot = `digraph G {
  rankdir=LR;
  node [shape=box, fontsize=10];
  ${lines.join("\n  ")}
}`;

fs.writeFileSync("/tmp/vireoka-depgraph.dot", dot);
console.log("Wrote /tmp/vireoka-depgraph.dot");
console.log("Render with: dot -Tpng /tmp/vireoka-depgraph.dot -o /tmp/vireoka-depgraph.png");
