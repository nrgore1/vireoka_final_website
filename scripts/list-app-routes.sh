#!/usr/bin/env bash
set -euo pipefail

echo "== App Router routes (filesystem derived) =="

find src/app -type f \( -name "page.tsx" -o -name "route.ts" \) | \
  sed 's|^src/app||' | \
  sed 's|/page.tsx$||' | \
  sed 's|/route.ts$||' | \
  sed 's|/index$||' | \
  sort
