#!/usr/bin/env bash
set -euo pipefail

echo "== Route usage signals (href/router/redirect) =="
rg -n "href=|router\.push\(|redirect\(|NextResponse\.redirect|Link\s+href" src/app src/components src/lib 2>/dev/null | tee /tmp/route-usage-signals.txt >/dev/null

echo "Wrote /tmp/route-usage-signals.txt"
