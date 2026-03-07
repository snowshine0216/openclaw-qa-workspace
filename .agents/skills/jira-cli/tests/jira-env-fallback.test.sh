#!/usr/bin/env bash
set -euo pipefail

ROOT=$(cd "$(dirname "$0")/.." && pwd)
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

cat > "$TMPDIR/.env" <<'EOF'
JIRA_API_TOKEN=test-token
JIRA_SERVER=https://strategyagile.atlassian.net
EOF

source "$ROOT/scripts/lib/jira-env.sh"
export OPENCLAW_WORKSPACE="$TMPDIR"
unset JIRA_BASE_URL || true
unset JIRA_API_TOKEN || true

load_jira_env

[[ "$JIRA_API_TOKEN" == "test-token" ]]
[[ "$JIRA_BASE_URL" == "https://strategyagile.atlassian.net" ]]

echo PASS
