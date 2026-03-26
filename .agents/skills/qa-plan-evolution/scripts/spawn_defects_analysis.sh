#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT=""
RUN_KEY=""
DEFECT_ANALYSIS_RUN_KEY=""
FEATURE_ID=""
FEATURE_FAMILY=""
REFRESH_MODE="smart_refresh"
PHASE=""

while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --repo-root) REPO_ROOT="$2"; shift 2 ;;
    --run-key) RUN_KEY="$2"; shift 2 ;;
    --defect-analysis-run-key) DEFECT_ANALYSIS_RUN_KEY="$2"; shift 2 ;;
    --feature-id) FEATURE_ID="$2"; shift 2 ;;
    --feature-family) FEATURE_FAMILY="$2"; shift 2 ;;
    --refresh-mode) REFRESH_MODE="$2"; shift 2 ;;
    --phase) PHASE="$2"; shift 2 ;;
    *) echo "Unknown arg: $1" >&2; exit 1 ;;
  esac
done

[[ -n "$REPO_ROOT" ]] || REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
[[ -n "$RUN_KEY" ]] || RUN_KEY="${DEFECT_ANALYSIS_RUN_KEY:-${FEATURE_ID:-}}"
[[ -n "$RUN_KEY" ]] || { echo "Missing run key context" >&2; exit 1; }
REPORTER_RUN_KEY="${DEFECT_ANALYSIS_RUN_KEY:-$RUN_KEY}"

REPORTER_ROOT="$REPO_ROOT/workspace-reporter/skills/defects-analysis"
ARTIFACT_ROOT_RESOLVER="$REPO_ROOT/.agents/skills/lib/artifactRoots.mjs"
REPORTER_RUN_ROOT="$(node --input-type=module -e "import { getRunRoot } from '$ARTIFACT_ROOT_RESOLVER'; console.log(getRunRoot('workspace-reporter', 'defects-analysis', process.argv[1]));" "$REPORTER_RUN_KEY")"
ORCHESTRATE_SH="$REPORTER_ROOT/scripts/orchestrate.sh"
GAP_BUNDLE_SH="$REPORTER_ROOT/scripts/phase_gap_bundle.sh"
SPAWN_FROM_MANIFEST="$REPORTER_ROOT/scripts/spawn_from_manifest.mjs"

run_gap_bundle_phase() {
  local output
  output="$(INVOKED_BY=qa-plan-evolution FEATURE_FAMILY="$FEATURE_FAMILY" \
    bash "$GAP_BUNDLE_SH" "$REPORTER_RUN_KEY" "$REPORTER_RUN_ROOT" 2>&1)" || {
    echo "$output"
    exit 1
  }
  echo "$output"

  if [[ "$output" == *"SPAWN_MANIFEST:"* ]]; then
    local manifest_path
    manifest_path="$(echo "$output" | sed -n 's/^SPAWN_MANIFEST:[[:space:]]*//p' | head -n1)"
    node "$SPAWN_FROM_MANIFEST" "$manifest_path" --cwd "$REPORTER_RUN_ROOT"
    output="$(INVOKED_BY=qa-plan-evolution FEATURE_FAMILY="$FEATURE_FAMILY" \
      bash "$GAP_BUNDLE_SH" "$REPORTER_RUN_KEY" "$REPORTER_RUN_ROOT" --post 2>&1)" || {
      echo "$output"
      exit 1
    }
    echo "$output"
  fi
}

if [[ "$PHASE" == "gap-bundle" ]]; then
  run_gap_bundle_phase
  exit 0
fi

INVOKED_BY=qa-plan-evolution \
FEATURE_FAMILY="$FEATURE_FAMILY" \
bash "$ORCHESTRATE_SH" "${DEFECT_ANALYSIS_RUN_KEY:-${FEATURE_ID:-$RUN_KEY}}" "$REFRESH_MODE"

run_gap_bundle_phase
