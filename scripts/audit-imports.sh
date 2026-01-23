#!/usr/bin/env bash
set -euo pipefail

ROOT="src"

echo "== 1) Missing @/ imports =="
node <<'NODE'
const fs = require("fs");
const path = require("path");

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|js|jsx)$/.test(ent.name)) out.push(p);
  }
  return out;
}

function resolveAlias(spec) {
  if (!spec.startsWith("@/")) return null;
  return path.join("src", spec.slice(2));
}

function existsAny(base) {
  const exts = ["", ".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx"];
  return exts.some(e => fs.existsSync(base + e));
}

const files = walk("src");
let missing = [];

const re = /from\s+["'](@\/[^"']+)["']/g;

for (const f of files) {
  const s = fs.readFileSync(f, "utf8");
  let m;
  while ((m = re.exec(s))) {
    const spec = m[1];
    const base = resolveAlias(spec);
    if (base && !existsAny(base)) {
      missing.push({ file: f, spec });
    }
  }
}

if (!missing.length) {
  console.log("OK: no missing @/ imports");
} else {
  for (const x of missing) {
    console.log(`${x.file} -> ${x.spec}`);
  }
  process.exitCode = 1;
}
NODE

echo
echo "== 2) Potential stub files (<= 30 lines) =="
find src/lib src/content -type f \( -name "*.ts" -o -name "*.tsx" \) 2>/dev/null | while read -r f; do
  L=$(wc -l < "$f")
  if [ "$L" -le 30 ]; then
    echo "$L  $f"
  fi
done | sort -n

echo
echo "== 3) Duplicate filenames (overwrite risk) =="
node <<'NODE'
const fs = require("fs");
const path = require("path");

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    ent.isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}

const files = walk("src");
const map = new Map();

for (const f of files) {
  const b = path.basename(f);
  if (!map.has(b)) map.set(b, []);
  map.get(b).push(f);
}

for (const [b, arr] of map.entries()) {
  if (arr.length > 1) {
    console.log(`\n${b}`);
    for (const p of arr) console.log("  -", p);
  }
}
NODE
