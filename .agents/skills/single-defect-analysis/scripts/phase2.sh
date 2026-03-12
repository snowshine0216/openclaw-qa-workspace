#!/usr/bin/env bash
set -euo pipefail

ISSUE_KEY="${1:-}"
RUN_DIR="${2:-}"
MODE="${3:-}"
CONTEXT_DIR="$RUN_DIR/context"
PR_DIR="$CONTEXT_DIR/prs"
MANIFEST="$RUN_DIR/phase2_spawn_manifest.json"
mkdir -p "$PR_DIR"

[[ -n "$ISSUE_KEY" && -n "$RUN_DIR" ]] || { echo "Usage: phase2.sh <issue_key> <run_dir> [--post]" >&2; exit 1; }

if [[ "$MODE" == "--post" ]]; then
  [[ -f "$MANIFEST" ]] || { echo "Missing manifest for --post" >&2; exit 1; }
  if command -v jq >/dev/null 2>&1; then
    while IFS= read -r rel; do
      [[ -f "$RUN_DIR/$rel" ]] || { echo "Missing output: $rel" >&2; exit 1; }
    done < <(jq -r '.requests[].openclaw.args.output_file // empty' "$MANIFEST")
    jq -n --argjson domains "$(ls "$PR_DIR"/*_impact.md >/dev/null 2>&1 && grep -hEo '(auth|api|ui|db|other)' "$PR_DIR"/*_impact.md | jq -R -s 'split("\n") | map(select(length>0)) | unique' || echo '[]')" '{domains:$domains}' >"$CONTEXT_DIR/affected_domains.json"
  else
    echo '{"domains":[]}' >"$CONTEXT_DIR/affected_domains.json"
  fi
  echo "PHASE2_POST_DONE"
  exit 0
fi

PR_LINKS="$CONTEXT_DIR/pr_links.json"
if [[ ! -f "$PR_LINKS" ]]; then
  echo "[]" >"$PR_LINKS"
fi

COUNT=0
if command -v jq >/dev/null 2>&1; then
  COUNT="$(jq 'length' "$PR_LINKS" 2>/dev/null || echo 0)"
fi

if [[ "$COUNT" == "0" ]]; then
  echo "No PR links" >"$CONTEXT_DIR/no_pr_links.md"
  echo '{"domains":[]}' >"$CONTEXT_DIR/affected_domains.json"
  echo "PHASE2_DONE"
  exit 0
fi

if command -v jq >/dev/null 2>&1; then
  jq -n --argjson links "$(cat "$PR_LINKS")" '
    {requests: ($links | to_entries | map({
      openclaw: {
        args: {
          task: ("Analyze PR " + .value + " for FC risk and output markdown."),
          label: ("pr-" + ((.key + 1)|tostring)),
          output_file: ("context/prs/pr-" + ((.key + 1)|tostring) + "_impact.md")
        }
      }
    }))}' >"$MANIFEST"
else
  cat >"$MANIFEST" <<EOF
{"requests":[]}
EOF
fi

echo "SPAWN_MANIFEST: $MANIFEST"

