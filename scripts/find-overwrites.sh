#!/usr/bin/env bash
set -euo pipefail

FILE="${1:-}"

if [ -z "$FILE" ]; then
  echo "Usage: scripts/find-overwrites.sh <path>"
  echo "Example: scripts/find-overwrites.sh src/app/api/investors/deck/route.ts"
  exit 1
fi

echo "== git history (last 20) =="
git log -n 20 --date=short --pretty=format:'%h %ad %an %s' -- "$FILE" || true

echo
echo "== full file rename/track history (follow) =="
git log --follow --name-status -- "$FILE" | sed -n '1,120p' || true

echo
echo "== current file preview =="
sed -n '1,120p' "$FILE" || true
