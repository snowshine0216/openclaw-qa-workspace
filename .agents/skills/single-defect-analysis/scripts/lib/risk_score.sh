#!/usr/bin/env bash
set -euo pipefail

ISSUE_SUMMARY_FILE="${1:-}"
DOMAINS_FILE="${2:-}"
[[ -f "$ISSUE_SUMMARY_FILE" ]] || { echo "missing issue summary: $ISSUE_SUMMARY_FILE" >&2; exit 1; }
[[ -f "$DOMAINS_FILE" ]] || { echo '{"domains":[]}' >"$DOMAINS_FILE"; }

if ! command -v jq >/dev/null 2>&1; then
  echo '{"risk_level":"medium","score":3,"fc_steps_count":3,"rationale":[{"signal":"fallback","value":"no-jq","contribution":3}]}' 
  exit 0
fi

PRIORITY="$(jq -r '.priority // "" | ascii_downcase' "$ISSUE_SUMMARY_FILE")"
DESCRIPTION_LEN="$(jq -r '.description // "" | tostring | length' "$ISSUE_SUMMARY_FILE")"
DOMAIN_COUNT="$(jq -r '.domains // [] | length' "$DOMAINS_FILE")"

case "$PRIORITY" in
  critical) P_SCORE=4 ;;
  high) P_SCORE=3 ;;
  medium) P_SCORE=2 ;;
  low) P_SCORE=1 ;;
  *) P_SCORE=2 ;;
esac

D_SCORE=$(( DOMAIN_COUNT > 6 ? 3 : DOMAIN_COUNT / 2 ))
L_SCORE=$(( DESCRIPTION_LEN > 500 ? 1 : 0 ))
SCORE=$((P_SCORE + D_SCORE + L_SCORE))

if (( SCORE >= 6 )); then RISK="critical";
elif (( SCORE >= 5 )); then RISK="high";
elif (( SCORE >= 3 )); then RISK="medium";
else RISK="low"; fi

if [[ "$RISK" == "critical" || "$RISK" == "high" ]]; then
  FC_STEPS=$(( (SCORE * 3 + 1) / 2 ))
elif [[ "$RISK" == "medium" ]]; then
  FC_STEPS=$SCORE
else
  FC_STEPS=2
fi

jq -n \
  --arg risk "$RISK" \
  --argjson score "$SCORE" \
  --argjson steps "$FC_STEPS" \
  --arg priority "$PRIORITY" \
  --argjson domains "$DOMAIN_COUNT" \
  --argjson dlen "$DESCRIPTION_LEN" \
  --argjson p_score "$P_SCORE" \
  --argjson d_score "$D_SCORE" \
  '{
    risk_level: $risk,
    score: $score,
    fc_steps_count: $steps,
    rationale: [
      {signal: "priority", value: $priority, contribution: $p_score},
      {signal: "domain_count", value: ($domains|tostring), contribution: $d_score},
      {signal: "description_length", value: ($dlen|tostring), contribution: (if $dlen > 500 then 1 else 0 end)}
    ]
  }'

