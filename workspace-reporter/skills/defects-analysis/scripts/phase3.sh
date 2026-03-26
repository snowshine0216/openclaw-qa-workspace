#!/usr/bin/env bash
set -euo pipefail

RAW_INPUT="${1:-}"
RUN_DIR="${2:-}"
CONTEXT_DIR="$RUN_DIR/context"
TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
RUNS_ROOT="$(cd "$RUN_DIR/.." && pwd)"
ORCHESTRATE_SCRIPT="${ORCHESTRATE_SCRIPT:-$SCRIPT_DIR/orchestrate.sh}"

[[ -n "$RAW_INPUT" && -n "$RUN_DIR" ]] || { echo "Usage: phase3.sh <input> <run-dir>" >&2; exit 1; }
mkdir -p "$CONTEXT_DIR/jira_issues"

route_kind=""
if [[ -f "$CONTEXT_DIR/route_decision.json" ]]; then
  route_kind="$(jq -r '.route_kind // empty' "$CONTEXT_DIR/route_decision.json")"
fi

if [[ "$route_kind" == "reporter_scope_release" ]]; then
  [[ -f "$CONTEXT_DIR/feature_state_matrix.json" ]] || { echo "Missing feature_state_matrix.json" >&2; exit 1; }
  feature_runs='[]'
  while IFS= read -r feature; do
    [[ -n "$feature" ]] || continue
    feature_key="$(printf '%s\n' "$feature" | jq -r '.feature_key')"
    selected_action="$(printf '%s\n' "$feature" | jq -r '.selected_action // .default_action')"
    effective_action="$selected_action"
    canonical_run_dir="$RUNS_ROOT/$feature_key"
    report_final_path="$canonical_run_dir/${feature_key}_REPORT_FINAL.md"
    feature_summary_path="$canonical_run_dir/context/feature_summary.json"
    summary_plan_json='{}'
    summary_status=''

    if [[ -f "$report_final_path" ]]; then
      summary_plan_json="$(node "$SCRIPT_DIR/lib/feature_summary_recovery_plan.mjs" "$canonical_run_dir" "$effective_action")"
      summary_status="$(printf '%s\n' "$summary_plan_json" | jq -r '.status')"
    fi

    if [[ ! -f "$report_final_path" || "$summary_status" == "refresh" || "$summary_status" == "error" ]]; then
      child_output="$(SUPPRESS_NOTIFICATION=1 INVOKED_BY=defects-analysis-release-parent RELEASE_VERSION_CONTEXT="$RAW_INPUT" bash "$ORCHESTRATE_SCRIPT" "$feature_key" "$effective_action" 2>&1)" || {
        echo "$child_output"
        exit 1
      }
      echo "$child_output"
      [[ -f "$report_final_path" ]] || { echo "Missing final report for $feature_key" >&2; exit 1; }
      summary_plan_json="$(node "$SCRIPT_DIR/lib/feature_summary_recovery_plan.mjs" "$canonical_run_dir" "$effective_action")"
      summary_status="$(printf '%s\n' "$summary_plan_json" | jq -r '.status')"
    else
      effective_action='use_existing'
    fi

    if [[ "$summary_status" == "refresh" ]]; then
      effective_action="$(printf '%s\n' "$summary_plan_json" | jq -r '.refresh_mode')"
      child_output="$(SUPPRESS_NOTIFICATION=1 INVOKED_BY=defects-analysis-release-parent RELEASE_VERSION_CONTEXT="$RAW_INPUT" bash "$ORCHESTRATE_SCRIPT" "$feature_key" "$effective_action" 2>&1)" || {
        echo "$child_output"
        exit 1
      }
      echo "$child_output"
      [[ -f "$report_final_path" ]] || { echo "Missing final report for $feature_key after refresh" >&2; exit 1; }
      summary_plan_json="$(node "$SCRIPT_DIR/lib/feature_summary_recovery_plan.mjs" "$canonical_run_dir" "$effective_action")"
      summary_status="$(printf '%s\n' "$summary_plan_json" | jq -r '.status')"
    fi

    if [[ "$summary_status" == "synthesize" ]]; then
      node "$SCRIPT_DIR/lib/build_feature_summary.mjs" "$canonical_run_dir" "$feature_key" >/dev/null
    elif [[ "$summary_status" == "error" ]]; then
      echo "Unable to produce feature summary for $feature_key: $(printf '%s\n' "$summary_plan_json" | jq -r '.reason')" >&2
      exit 1
    fi
    [[ -f "$feature_summary_path" ]] || { echo "Missing feature summary for $feature_key" >&2; exit 1; }

    feature_runs="$(printf '%s\n' "$feature_runs" | jq \
      --arg feature_key "$feature_key" \
      --arg selected_action "$effective_action" \
      --arg canonical_run_dir "$canonical_run_dir" \
      --arg report_final_path "$report_final_path" \
      --arg feature_summary_path "$feature_summary_path" \
      --arg release_packet_dir "$RUN_DIR/features/$feature_key" \
      '. + [{
        feature_key: $feature_key,
        selected_action: $selected_action,
        canonical_run_dir: $canonical_run_dir,
        report_final_path: $report_final_path,
        feature_summary_path: $feature_summary_path,
        release_packet_dir: $release_packet_dir
      }]')"
  done < <(jq -c '.features[]' "$CONTEXT_DIR/feature_state_matrix.json")

  printf '%s\n' "$(jq -n --argjson features "$feature_runs" '{features: $features}')" >"$CONTEXT_DIR/feature_runs.json"
  feature_count="$(printf '%s\n' "$feature_runs" | jq 'length')"
  if [[ -f "$RUN_DIR/task.json" ]]; then
    jq '.processed_features = '"$feature_count"' | .current_phase = "phase3_release_child_runs" | .updated_at = "'"$TS"'"' "$RUN_DIR/task.json" >"$RUN_DIR/task.json.tmp"
    mv "$RUN_DIR/task.json.tmp" "$RUN_DIR/task.json"
  fi
  echo "PHASE3_DONE"
  exit 0
fi

[[ -f "$CONTEXT_DIR/jira_raw.json" ]] || { echo "Missing jira_raw.json" >&2; exit 1; }

RAW_INPUT="$RAW_INPUT" RUN_DIR="$RUN_DIR" node --input-type=module <<'EOF'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const runDir = process.env.RUN_DIR;
const rawInput = process.env.RAW_INPUT;
const contextDir = join(runDir, 'context');
const raw = JSON.parse(readFileSync(join(contextDir, 'jira_raw.json'), 'utf8'));
const prPattern = /https:\/\/github\.com\/[^\s)]+\/pull\/\d+/g;
const seen = new Set();
const defects = [];

function detectArea(fields) {
  return (
    fields.components?.[0]?.name ??
    fields.labels?.[0] ??
    fields.issuetype?.name ??
    'General'
  );
}

for (const issue of raw.issues ?? []) {
  const fields = issue.fields ?? {};
  const links = new Set();
  const description = typeof fields.description === 'string' ? fields.description : JSON.stringify(fields.description ?? '');
  for (const match of description.match(prPattern) ?? []) {
    links.add(match);
    seen.add(match);
  }
  for (const comment of fields.comment?.comments ?? []) {
    const body = typeof comment.body === 'string' ? comment.body : JSON.stringify(comment.body ?? '');
    for (const match of body.match(prPattern) ?? []) {
      links.add(match);
      seen.add(match);
    }
  }

  const normalized = {
    key: issue.key,
    summary: fields.summary ?? '',
    status: fields.status?.name ?? 'Unknown',
    priority: fields.priority?.name ?? 'Unknown',
    assignee: fields.assignee?.displayName ?? 'Unassigned',
    resolutiondate: fields.resolutiondate ?? null,
    area: detectArea(fields),
    description,
    pr_links: [...links],
  };
  defects.push(normalized);
  mkdirSync(join(contextDir, 'jira_issues'), { recursive: true });
  writeFileSync(join(contextDir, 'jira_issues', `${issue.key}.json`), `${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
}

writeFileSync(join(contextDir, 'defect_index.json'), `${JSON.stringify({ defects }, null, 2)}\n`, 'utf8');
writeFileSync(join(contextDir, 'pr_links.json'), `${JSON.stringify([...seen], null, 2)}\n`, 'utf8');
EOF

node "$SCRIPT_DIR/lib/extract_feature_metadata.mjs" "$RUN_DIR" "$(basename "$RUN_DIR")" >/dev/null

pr_count="$(jq 'length' "$CONTEXT_DIR/pr_links.json")"
if [[ -f "$RUN_DIR/task.json" ]]; then
  jq '.processed_prs = '"$pr_count"' | .current_phase = "phase3_triage" | .updated_at = "'"$TS"'"' "$RUN_DIR/task.json" >"$RUN_DIR/task.json.tmp"
  mv "$RUN_DIR/task.json.tmp" "$RUN_DIR/task.json"
fi

echo "PHASE3_DONE"
