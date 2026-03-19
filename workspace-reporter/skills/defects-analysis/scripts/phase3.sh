#!/usr/bin/env bash
set -euo pipefail

RAW_INPUT="${1:-}"
RUN_DIR="${2:-}"
CONTEXT_DIR="$RUN_DIR/context"
TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

[[ -n "$RAW_INPUT" && -n "$RUN_DIR" ]] || { echo "Usage: phase3.sh <input> <run-dir>" >&2; exit 1; }
[[ -f "$CONTEXT_DIR/jira_raw.json" ]] || { echo "Missing jira_raw.json" >&2; exit 1; }
mkdir -p "$CONTEXT_DIR/jira_issues"

RUN_DIR="$RUN_DIR" node --input-type=module <<'EOF'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const runDir = process.env.RUN_DIR;
const contextDir = join(runDir, 'context');
const raw = JSON.parse(readFileSync(join(contextDir, 'jira_raw.json'), 'utf8'));
const prPattern = /https:\/\/github\.com\/[^\s)]+\/pull\/\d+/g;
const seen = new Set();
const defects = [];

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

pr_count="$(jq 'length' "$CONTEXT_DIR/pr_links.json")"
if [[ -f "$RUN_DIR/task.json" ]]; then
  jq '.processed_prs = '"$pr_count"' | .current_phase = "phase3_triage" | .updated_at = "'"$TS"'"' "$RUN_DIR/task.json" >"$RUN_DIR/task.json.tmp"
  mv "$RUN_DIR/task.json.tmp" "$RUN_DIR/task.json"
fi

echo "PHASE3_DONE"
