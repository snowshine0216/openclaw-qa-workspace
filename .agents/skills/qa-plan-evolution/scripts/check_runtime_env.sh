#!/usr/bin/env bash
set -euo pipefail
ok=true
command -v node >/dev/null 2>&1 || { echo "node missing"; ok=false; }
command -v jq >/dev/null 2>&1 || { echo "jq missing (optional but recommended)"; }
node -e "const [a]=process.versions.node.split('.');if(+a<18)process.exit(1)" 2>/dev/null || { echo "node 18+ required"; ok=false; }
if [[ "$ok" != true ]]; then
  exit 1
fi
echo "runtime env ok"
