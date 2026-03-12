#!/usr/bin/env bash
set -euo pipefail

ISSUE_KEY="${1:-}"
RUN_DIR="${2:-}"
CONTEXT_DIR="$RUN_DIR/context"
ISSUE_SUMMARY="$CONTEXT_DIR/issue_summary.json"
FC_RISK="$CONTEXT_DIR/fc_risk.json"

[[ -n "$ISSUE_KEY" && -n "$RUN_DIR" ]] || { echo "Usage: plan_render.sh <issue_key> <run_dir>" >&2; exit 1; }
[[ -f "$ISSUE_SUMMARY" ]] || { echo "Missing issue_summary.json" >&2; exit 1; }
[[ -f "$FC_RISK" ]] || { echo "Missing fc_risk.json" >&2; exit 1; }

if command -v jq >/dev/null 2>&1; then
  SUMMARY="$(jq -r '.summary // ""' "$ISSUE_SUMMARY")"
  STATUS="$(jq -r '.status // ""' "$ISSUE_SUMMARY")"
  PRIORITY="$(jq -r '.priority // ""' "$ISSUE_SUMMARY")"
  RISK_LEVEL="$(jq -r '.risk_level // "medium"' "$FC_RISK")"
  FC_STEPS_COUNT="$(jq -r '.fc_steps_count // 3' "$FC_RISK")"
else
  SUMMARY=""
  STATUS=""
  PRIORITY=""
  RISK_LEVEL="medium"
  FC_STEPS_COUNT=3
fi

echo "# Testing Plan: ${ISSUE_KEY} - ${SUMMARY}"
echo
echo "## Overview"
echo "- Issue: ${ISSUE_KEY}"
echo "- Status: ${STATUS}"
echo "- Priority: ${PRIORITY}"
echo "- Risk Level: ${RISK_LEVEL}"
echo
echo "## Functional Coverage (FC) Steps"
i=1
while [[ "$i" -le "$FC_STEPS_COUNT" ]]; do
  echo "${i}. Validate core behavior path ${i} for ${ISSUE_KEY}."
  i=$((i+1))
done

if [[ "$RISK_LEVEL" == "medium" || "$RISK_LEVEL" == "high" || "$RISK_LEVEL" == "critical" ]]; then
  echo
  echo "## Exploratory Testing"
  if [[ "$RISK_LEVEL" == "medium" ]]; then
    echo "- Smoke test core flows; targeted exploratory on affected areas."
  else
    echo "- Validate adjacent modules for regression risk."
    echo "- Focus on boundary and error states."
  fi
fi

echo
echo "## PR Impact Summary"
if ls "$CONTEXT_DIR"/prs/*_impact.md >/dev/null 2>&1; then
  cat "$CONTEXT_DIR"/prs/*_impact.md
else
  echo "- No PR impact artifacts found."
fi

