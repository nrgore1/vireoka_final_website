#!/usr/bin/env bash
set -euo pipefail

# UI authority = production snapshot baseline (commit 7f103b31).
# Rule: these files must NOT change unless we're merging into production intentionally.

AUTHORITY_PATHS=(
  "src/app/layout.tsx"
  "src/app/globals.css"
  "src/components"
  "src/app/page.tsx"
)

BASE_BRANCH="${1:-production}"

echo "Checking UI authority drift vs ${BASE_BRANCH}..."

git fetch origin "${BASE_BRANCH}" >/dev/null 2>&1 || true

CHANGED="$(git diff --name-only "origin/${BASE_BRANCH}...HEAD" -- "${AUTHORITY_PATHS[@]}" || true)"

if [[ -n "${CHANGED}" ]]; then
  echo "❌ UI authority files changed vs ${BASE_BRANCH}:"
  echo "${CHANGED}"
  echo
  echo "If this is intentional, merge via production branch workflow."
  exit 1
fi

echo "✅ UI authority unchanged."
