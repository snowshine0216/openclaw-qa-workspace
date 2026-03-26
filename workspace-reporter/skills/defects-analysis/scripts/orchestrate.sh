#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
RAW_INPUT="${1:-}"
shift || true
REFRESH_MODE=""
if [[ $# -gt 0 && "${1:-}" != --* ]]; then
  REFRESH_MODE="$1"
  shift
fi

FEATURE_KEY_INPUT="${FEATURE_KEY_INPUT:-}"
RELEASE_VERSION_INPUT="${RELEASE_VERSION_INPUT:-}"
JQL_QUERY_INPUT="${JQL_QUERY_INPUT:-}"
QA_OWNER_INPUT="${QA_OWNER_INPUT:-${QA_OWNER:-}}"
QA_OWNER_FIELD_INPUT="${QA_OWNER_FIELD_INPUT:-${QA_OWNER_FIELD:-}}"

require_option_value() {
  local flag="$1"
  local value="${2:-}"
  if [[ -z "$value" || "$value" == --* ]]; then
    echo "Missing value for $flag" >&2
    exit 1
  fi
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --feature-key)
      require_option_value "$1" "${2:-}"
      FEATURE_KEY_INPUT="${2:-}"
      shift 2
      ;;
    --release-version)
      require_option_value "$1" "${2:-}"
      RELEASE_VERSION_INPUT="${2:-}"
      shift 2
      ;;
    --jql-query)
      require_option_value "$1" "${2:-}"
      JQL_QUERY_INPUT="${2:-}"
      shift 2
      ;;
    --qa-owner)
      require_option_value "$1" "${2:-}"
      QA_OWNER_INPUT="${2:-}"
      shift 2
      ;;
    --qa-owner-field)
      require_option_value "$1" "${2:-}"
      QA_OWNER_FIELD_INPUT="${2:-}"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1" >&2
      echo "Usage: orchestrate.sh <input> [refresh_mode] [--feature-key <key>] [--release-version <version>] [--jql-query <query>] [--qa-owner <value>] [--qa-owner-field <field>]" >&2
      exit 1
      ;;
  esac
done

[[ -n "$RAW_INPUT" ]] || { echo "Usage: orchestrate.sh <input> [refresh_mode]" >&2; exit 1; }

export FEATURE_KEY_INPUT RELEASE_VERSION_INPUT JQL_QUERY_INPUT QA_OWNER_INPUT QA_OWNER_FIELD_INPUT

derive_release_run_key() {
  local release_version="$1"
  local qa_owner="$2"
  local qa_owner_field="$3"
  node "$SCRIPT_DIR/lib/classify_input.mjs" \
    "$release_version" \
    "" \
    "" \
    "$release_version" \
    "" \
    "$qa_owner" \
    "$qa_owner_field" | jq -r '.run_key'
}

derive_run_key() {
  local raw="$1"
  if [[ -n "$FEATURE_KEY_INPUT" ]]; then
    echo "$FEATURE_KEY_INPUT"
    return
  fi
  if [[ -n "$RELEASE_VERSION_INPUT" ]]; then
    derive_release_run_key "$RELEASE_VERSION_INPUT" "$QA_OWNER_INPUT" "$QA_OWNER_FIELD_INPUT"
    return
  fi
  if [[ -n "$JQL_QUERY_INPUT" ]]; then
    node --input-type=module -e "import { createHash } from 'node:crypto'; console.log('jql_' + createHash('sha1').update(process.argv[1]).digest('hex').slice(0, 12));" "$JQL_QUERY_INPUT"
    return
  fi
  if [[ "$raw" =~ ^[A-Z][A-Z0-9]{1,10}-[0-9]+$ ]]; then
    echo "$raw"
    return
  fi
  if [[ "$raw" =~ /browse/([A-Z][A-Z0-9]{1,10}-[0-9]+)(\?.*)?$ ]]; then
    echo "${BASH_REMATCH[1]}"
    return
  fi
  if [[ "$raw" =~ ^[0-9]+(\.[0-9]+)*$ ]]; then
    derive_release_run_key "$raw" "$QA_OWNER_INPUT" "$QA_OWNER_FIELD_INPUT"
    return
  fi
  if [[ "$raw" == *"project"* || "$raw" == *"AND"* || "$raw" == *"OR"* || "$raw" == *"="* ]]; then
    node --input-type=module -e "import { createHash } from 'node:crypto'; console.log('jql_' + createHash('sha1').update(process.argv[1]).digest('hex').slice(0, 12));" "$raw"
    return
  fi
  echo "$raw"
}

RUN_KEY="$(derive_run_key "$RAW_INPUT")"
RUN_DIR="$SKILL_ROOT/runs/$RUN_KEY"
mkdir -p "$RUN_DIR/context" "$RUN_DIR/drafts" "$RUN_DIR/reports" "$RUN_DIR/archive"

export SELECTED_MODE="$REFRESH_MODE"

for phase in 0 1 2 3 4 5; do
  phase_script="$SCRIPT_DIR/phase${phase}.sh"
  output="$("$phase_script" "$RAW_INPUT" "$RUN_DIR" 2>&1)" || {
    echo "$output"
    exit 1
  }
  echo "$output"

  if [[ "$phase" == "0" && "$output" == *"PHASE0_USE_EXISTING"* ]]; then
    exit 0
  fi

  if [[ "$output" == *"DELEGATED_RUN:"* ]]; then
    exit 0
  fi

  if [[ "$output" == *"SPAWN_MANIFEST:"* ]]; then
    manifest_path="$(echo "$output" | sed -n 's/^SPAWN_MANIFEST:[[:space:]]*//p' | head -n1)"
    node "$SCRIPT_DIR/spawn_from_manifest.mjs" "$manifest_path" --cwd "$RUN_DIR"
    post_output="$("$phase_script" "$RAW_INPUT" "$RUN_DIR" --post 2>&1)" || {
      echo "$post_output"
      exit 1
    }
    echo "$post_output"
    if [[ "$post_output" == *"DELEGATED_RUN:"* ]]; then
      exit 0
    fi
  fi
done
