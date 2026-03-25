#!/usr/bin/env bash
# Usage: check_resume.sh --run-key <key> [--run-root path]
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DIR/.." && pwd)"
RUN_KEY=""
RUN_ROOT=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --run-key) RUN_KEY="$2"; shift 2 ;;
    --run-root) RUN_ROOT="$2"; shift 2 ;;
    *) shift ;;
  esac
done
if [[ -z "$RUN_KEY" ]]; then
  echo "usage: $0 --run-key <key> [--run-root path]" >&2
  exit 1
fi
CANONICAL_RUN_ROOT="$ROOT/runs/$RUN_KEY"
if [[ -f "$CANONICAL_RUN_ROOT/task.json" ]]; then
  RUN_ROOT="$CANONICAL_RUN_ROOT"
elif [[ -n "$RUN_ROOT" && -f "$RUN_ROOT/.canonical-run-root" ]]; then
  RUN_ROOT="$(cat "$RUN_ROOT/.canonical-run-root")"
elif [[ -z "$RUN_ROOT" ]]; then
  RUN_ROOT="$CANONICAL_RUN_ROOT"
fi
if [[ -f "$RUN_ROOT/task.json" ]]; then
  SUMMARY_JSON="$(node "$DIR/lib/asyncJobStore.mjs" refresh --run-root "$RUN_ROOT")"
  echo "task.json present: resume possible"
  SUMMARY_JSON="$SUMMARY_JSON" node -e '
const summary = JSON.parse(process.env.SUMMARY_JSON || "{}");
const task = summary.task || {};
function previousPhase(phase) {
  const match = /^phase([1-6])$/.exec(String(phase || ""));
  if (!match) return null;
  const index = Number(match[1]);
  return index > 0 ? `phase${index - 1}` : null;
}
function inferLastCompletedPhase() {
  if (task.next_action === "run_phase1") return "phase0";
  if (task.next_action === "await_async_completion") return previousPhase(task.current_phase) || task.current_phase || "unknown";
  if (task.next_action === "await_final_approval" || task.next_action === "finalize" || task.next_action === "iterate_phase2") return task.current_phase || "phase6";
  const nextPhaseMatch = /^run_phase([1-6])$/.exec(String(task.next_action || ""));
  if (nextPhaseMatch) return `phase${Math.max(Number(nextPhaseMatch[1]) - 1, 0)}`;
  return task.current_phase || "unknown";
}
function inferNextRequiredCommand() {
  const runKey = task.run_key || "'"$RUN_KEY"'";
  const scriptRoot = "./.agents/skills/qa-plan-evolution/scripts";
  if (task.next_action === "await_final_approval" || task.next_action === "finalize") {
    return `${scriptRoot}/phase6.sh --run-key "${runKey}" --finalize`;
  }
  if (task.next_action === "operator_retry_required") {
    return `${scriptRoot}/progress.sh --run-key "${runKey}"`;
  }
  return `${scriptRoot}/orchestrate.sh --run-key "${runKey}"`;
}
const pending = Array.isArray(task.pending_job_ids) ? task.pending_job_ids.length : 0;
console.log(`last completed phase: ${inferLastCompletedPhase()}`);
console.log(`pending async jobs: ${pending}`);
console.log(`next required command: ${inferNextRequiredCommand()}`);
'
  printf '%s\n' "$SUMMARY_JSON"
else
  echo "no task.json: fresh run"
fi
