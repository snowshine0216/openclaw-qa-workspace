#!/usr/bin/env bash
#
# Post-run: aggregate benchmark and generate eval viewer.
#
# Run after spawning evals, completing runs, and grading each run with grading.json.
#
# Usage:
#   ./evals/post_run.sh <iteration-dir> [--static OUTPUT_HTML]
#
# Example:
#   ./evals/post_run.sh qa-plan-orchestrator-workspace/iteration-1
#   ./evals/post_run.sh qa-plan-orchestrator-workspace/iteration-1 --static /tmp/eval-review.html
#
# Requires: skill-creator (aggregate_benchmark.py, generate_review.py)
#   Default path: ~/.agents/skills/skill-creator

set -e

ITER_DIR="${1:?Usage: post_run.sh <iteration-dir> [--static OUTPUT_HTML]}"
shift || true

STATIC_OUTPUT=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --static)
      STATIC_OUTPUT="$2"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

SKILL_CREATOR="${SKILL_CREATOR:-$HOME/.agents/skills/skill-creator}"
SKILL_NAME="qa-plan-orchestrator"

if [[ ! -d "$SKILL_CREATOR" ]]; then
  echo "Error: skill-creator not found at $SKILL_CREATOR"
  echo "Set SKILL_CREATOR to the skill-creator directory, or install it."
  exit 1
fi

if [[ ! -d "$ITER_DIR" ]]; then
  echo "Error: iteration dir not found: $ITER_DIR"
  exit 1
fi

echo "Aggregating benchmark..."
python3 "$SKILL_CREATOR/scripts/aggregate_benchmark.py" "$ITER_DIR" --skill-name "$SKILL_NAME"

BENCHMARK_JSON="$ITER_DIR/benchmark.json"
if [[ ! -f "$BENCHMARK_JSON" ]]; then
  echo "Warning: benchmark.json not produced. Grading may be incomplete."
  echo "Ensure each run has grading.json with expectations (text, passed, evidence)."
fi

echo "Generating review viewer..."
if [[ -n "$STATIC_OUTPUT" ]]; then
  python3 "$SKILL_CREATOR/eval-viewer/generate_review.py" "$ITER_DIR" \
    --skill-name "$SKILL_NAME" \
    --benchmark "${BENCHMARK_JSON:-}" \
    --static "$STATIC_OUTPUT"
  echo "Static HTML written to: $STATIC_OUTPUT"
else
  python3 "$SKILL_CREATOR/eval-viewer/generate_review.py" "$ITER_DIR" \
    --skill-name "$SKILL_NAME" \
    --benchmark "${BENCHMARK_JSON:-}"
  echo "Viewer started. Check your browser."
fi
