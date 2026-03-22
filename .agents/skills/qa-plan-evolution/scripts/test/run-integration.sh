#!/usr/bin/env bash
# End-to-end smoke: phases 0–6 using the minimal target fixture (no external qa-plan npm test).
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# DIR = .../qa-plan-evolution/scripts
REPO="$(cd "$DIR/../../../.." && pwd)"
RK="integration-$(date +%s)"
TMP="$(mktemp -d)"
RUN_ROOT="$TMP/$RK"
mkdir -p "$RUN_ROOT"
FIXTURE=".agents/skills/qa-plan-evolution/scripts/test/fixtures/minimal-target-skill"
"$DIR/phase0.sh" \
  --run-key "$RK" \
  --run-root "$RUN_ROOT" \
  --repo-root "$REPO" \
  --target-skill-path "$FIXTURE" \
  --target-skill-name minimal-fixture \
  --benchmark-profile generic-skill-regression
"$DIR/phase1.sh" --run-key "$RK" --run-root "$RUN_ROOT" --repo-root "$REPO"
"$DIR/phase2.sh" --run-key "$RK" --run-root "$RUN_ROOT" --repo-root "$REPO"
"$DIR/phase3.sh" --run-key "$RK" --run-root "$RUN_ROOT" --repo-root "$REPO" --iteration 1
printf '\n# integration mutation\n' >> "$RUN_ROOT/candidates/iteration-1/candidate_snapshot/reference.md"
"$DIR/phase3.sh" --run-key "$RK" --run-root "$RUN_ROOT" --repo-root "$REPO" --iteration 1 --post
"$DIR/phase4.sh" --run-key "$RK" --run-root "$RUN_ROOT" --repo-root "$REPO" --iteration 1
"$DIR/phase5.sh" --run-key "$RK" --run-root "$RUN_ROOT" --repo-root "$REPO" --iteration 1
"$DIR/phase6.sh" --run-key "$RK" --run-root "$RUN_ROOT" --repo-root "$REPO" --iteration 1 --finalize --skip-git-promotion
test -f "$RUN_ROOT/evolution_final.md"
echo "integration ok: $RUN_ROOT"
