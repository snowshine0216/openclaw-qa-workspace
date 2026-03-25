#!/usr/bin/env bash
set -euo pipefail

RAW_INPUT="${1:-}"
RUN_DIR="${2:-}"
MODE="${3:-}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONTEXT_DIR="$RUN_DIR/context"
MANIFEST="$RUN_DIR/phase4_spawn_manifest.json"
TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

[[ -n "$RAW_INPUT" && -n "$RUN_DIR" ]] || { echo "Usage: phase4.sh <input> <run-dir> [--post]" >&2; exit 1; }
mkdir -p "$CONTEXT_DIR/prs"

route_kind=""
if [[ -f "$CONTEXT_DIR/route_decision.json" ]]; then
  route_kind="$(jq -r '.route_kind // empty' "$CONTEXT_DIR/route_decision.json" 2>/dev/null || true)"
fi

if [[ "$route_kind" == "reporter_scope_release" && "$MODE" != "--post" ]]; then
  [[ -f "$CONTEXT_DIR/feature_runs.json" ]] || { echo "Missing feature_runs.json for release packet materialization" >&2; exit 1; }
  feature_runs_json="$(jq -c '.features' "$CONTEXT_DIR/feature_runs.json")"
  node "$SCRIPT_DIR/lib/collect_feature_summaries.mjs" "$RUN_DIR" "$feature_runs_json" >/dev/null
  node "$SCRIPT_DIR/lib/materialize_release_packets.mjs" "$RUN_DIR" "$feature_runs_json" >/dev/null
  if [[ -f "$RUN_DIR/task.json" ]]; then
    jq '.current_phase = "phase4_release_packets" | .updated_at = "'"$TS"'"' "$RUN_DIR/task.json" >"$RUN_DIR/task.json.tmp"
    mv "$RUN_DIR/task.json.tmp" "$RUN_DIR/task.json"
  fi
  if [[ -f "$RUN_DIR/run.json" ]]; then
    jq '.pr_analysis_completed_at = "'"$TS"'" | .updated_at = "'"$TS"'"' "$RUN_DIR/run.json" >"$RUN_DIR/run.json.tmp"
    mv "$RUN_DIR/run.json.tmp" "$RUN_DIR/run.json"
  fi
  echo "PHASE4_DONE"
  exit 0
fi

selected_mode=""
if [[ -f "$RUN_DIR/task.json" ]]; then
  selected_mode="$(jq -r '.selected_mode // empty' "$RUN_DIR/task.json" 2>/dev/null || true)"
fi

write_pr_summary() {
  RUN_DIR="$RUN_DIR" node --input-type=module <<'EOF'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const runDir = process.env.RUN_DIR;
const prsDir = join(runDir, 'context', 'prs');
const files = readdirSync(prsDir).filter((file) => file.endsWith('_impact.md'));
const domains = new Set();
const repos = new Set();
const topRiskyPrs = [];
let mergedCount = 0;
let openCount = 0;

function parseRiskLevel(content) {
  const match = content.match(/(?:Regression\s+)?Risk(?:\s+Level)?\s*:\s*(Critical|High|Medium|Low)/i);
  return (match?.[1] ?? 'Medium').toUpperCase();
}

function parseRepository(content) {
  return (
    content.match(/Repository:\s*([^\n]+)/i)?.[1]?.trim() ??
    content.match(/github\.com\/[^/\s]+\/([^/\s]+)\/pull\/\d+/i)?.[1]?.trim() ??
    null
  );
}

for (const file of files) {
  const content = readFileSync(join(prsDir, file), 'utf8');
  const lowered = content.toLowerCase();
  for (const domain of ['auth', 'api', 'ui', 'db', 'prompt', 'save-flow', 'i18n', 'other']) {
    if (lowered.includes(domain)) domains.add(domain);
  }
  const repository = parseRepository(content);
  if (repository) repos.add(repository);
  const riskLevel = parseRiskLevel(content);
  topRiskyPrs.push({
    repository,
    number: content.match(/PR\s*#?(\d+)/i)?.[1] ? Number(content.match(/PR\s*#?(\d+)/i)[1]) : null,
    risk_level: riskLevel,
    summary: content.split('\n').find((line) => line.trim() && !line.startsWith('#'))?.trim() ?? 'Risk summary not captured.',
  });
  if (lowered.includes('merged')) {
    mergedCount += 1;
  } else {
    openCount += 1;
  }
}
writeFileSync(
  join(runDir, 'context', 'pr_impact_summary.json'),
  `${JSON.stringify({
    pr_count: files.length,
    repos_changed: [...repos],
    merged_count: mergedCount,
    open_count: openCount,
    top_risky_prs: topRiskyPrs,
    top_changed_domains: [...domains],
    domains: [...domains]
  }, null, 2)}\n`,
  'utf8',
);
EOF
}

if [[ "$MODE" == "--post" ]]; then
  [[ -f "$MANIFEST" ]] || { echo "Missing manifest for phase4 --post" >&2; exit 1; }
  while IFS= read -r output_file; do
    [[ -f "$RUN_DIR/$output_file" ]] || { echo "Missing output: $output_file" >&2; exit 1; }
  done < <(jq -r '.requests[].openclaw.args.output_file // empty' "$MANIFEST")

  write_pr_summary

  if [[ -f "$RUN_DIR/task.json" ]]; then
    jq '.current_phase = "phase4_pr_analysis" | .updated_at = "'"$TS"'"' "$RUN_DIR/task.json" >"$RUN_DIR/task.json.tmp"
    mv "$RUN_DIR/task.json.tmp" "$RUN_DIR/task.json"
  fi
  if [[ -f "$RUN_DIR/run.json" ]]; then
    jq '.pr_analysis_completed_at = "'"$TS"'" | .updated_at = "'"$TS"'"' "$RUN_DIR/run.json" >"$RUN_DIR/run.json.tmp"
    mv "$RUN_DIR/run.json.tmp" "$RUN_DIR/run.json"
  fi
  echo "PHASE4_POST_DONE"
  exit 0
fi

[[ -f "$CONTEXT_DIR/pr_links.json" ]] || printf '[]\n' >"$CONTEXT_DIR/pr_links.json"
count="$(jq 'length' "$CONTEXT_DIR/pr_links.json")"

if [[ "$count" == "0" ]]; then
  printf 'No PR links were discovered for this run.\n' >"$CONTEXT_DIR/no_pr_links.md"
  printf '{ "pr_count": 0, "repos_changed": [], "merged_count": 0, "open_count": 0, "top_risky_prs": [], "top_changed_domains": [], "domains": [] }\n' >"$CONTEXT_DIR/pr_impact_summary.json"
  echo "PHASE4_DONE"
  exit 0
fi

if [[ "$selected_mode" == "smart_refresh" ]]; then
  expected_count="$count"
  cached_count="$(find "$CONTEXT_DIR/prs" -maxdepth 1 -name '*_impact.md' -type f | wc -l | tr -d ' ')"
  if [[ "$cached_count" == "$expected_count" ]]; then
    write_pr_summary
    if [[ -f "$RUN_DIR/task.json" ]]; then
      jq '.current_phase = "phase4_pr_analysis" | .updated_at = "'"$TS"'"' "$RUN_DIR/task.json" >"$RUN_DIR/task.json.tmp"
      mv "$RUN_DIR/task.json.tmp" "$RUN_DIR/task.json"
    fi
    if [[ -f "$RUN_DIR/run.json" ]]; then
      jq '.pr_analysis_completed_at = "'"$TS"'" | .updated_at = "'"$TS"'"' "$RUN_DIR/run.json" >"$RUN_DIR/run.json.tmp"
      mv "$RUN_DIR/run.json.tmp" "$RUN_DIR/run.json"
    fi
    echo "PHASE4_DONE"
    exit 0
  fi
fi

jq -n --argjson links "$(cat "$CONTEXT_DIR/pr_links.json")" '{
  requests: ($links | to_entries | map({
    openclaw: {
      args: {
        task: ("Analyze PR " + .value + " for QA regression risk and write markdown output."),
        label: ("pr-" + ((.key + 1) | tostring)),
        mode: "run",
        runtime: "subagent",
        output_file: ("context/prs/pr-" + ((.key + 1) | tostring) + "_impact.md")
      }
    }
  }))
}' >"$MANIFEST"

echo "SPAWN_MANIFEST: $MANIFEST"
