#!/usr/bin/env bash
set -e

if grep -R "PrismaClient" src 2>/dev/null; then
  echo "❌ PrismaClient detected — build blocked"
  exit 1
fi

echo "✅ No PrismaClient detected"
