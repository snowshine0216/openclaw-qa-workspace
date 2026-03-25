#!/usr/bin/env bash
# Run one evolution cycle. Use --with-phase0 on first run; later runs omit phase0 and pass --choice resume to phase0 when re-init is needed.
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DIR/.." && pwd)"
DEFAULT_REPO_ROOT="$(cd "$ROOT/../../.." && pwd)"
WITH_PHASE0=false
STOP_RUN=false
if [[ "${1:-}" == "--with-phase0" ]]; then
  WITH_PHASE0=true
  shift
fi

RUN_KEY=""
RUN_ROOT=""
REPO_ROOT_ARG=""
ARGS=("$@")
for ((i=0; i<${#ARGS[@]}; i+=1)); do
  case "${ARGS[i]}" in
    --run-key) RUN_KEY="${ARGS[i+1]}"; i=$((i+1)) ;;
    --run-root) RUN_ROOT="${ARGS[i+1]}"; i=$((i+1)) ;;
    --repo-root) REPO_ROOT_ARG="${ARGS[i+1]}"; i=$((i+1)) ;;
  esac
done

resolve_run_root() {
  local canonical_run_root="$ROOT/runs/$RUN_KEY"
  if [[ -n "$REPO_ROOT_ARG" && "$REPO_ROOT_ARG" != "$DEFAULT_REPO_ROOT" && -n "$RUN_ROOT" ]]; then
    echo "$RUN_ROOT"
    return
  fi
  if [[ -n "$RUN_KEY" && -f "$canonical_run_root/task.json" ]]; then
    echo "$canonical_run_root"
    return
  fi
  if [[ -n "$RUN_ROOT" && -f "$RUN_ROOT/.canonical-run-root" ]]; then
    cat "$RUN_ROOT/.canonical-run-root"
    return
  fi
  if [[ -n "$RUN_ROOT" ]]; then
    echo "$RUN_ROOT"
    return
  fi
  echo "$canonical_run_root"
}

start_phase_from_task() {
  local resolved_run_root="$1"
  if [[ ! -f "$resolved_run_root/task.json" ]]; then
    echo "1"
    return
  fi
  local next_action
  next_action="$(jq -r '.next_action // empty' "$resolved_run_root/task.json")"
  case "$next_action" in
    run_phase1) echo "1" ;;
    run_phase2) echo "2" ;;
    run_phase3) echo "3" ;;
    run_phase4) echo "4" ;;
    run_phase5) echo "5" ;;
    run_phase6|finalize) echo "6" ;;
    await_final_approval|operator_retry_required|stop_no_blocking_gaps) echo "stop" ;;
    *) echo "1" ;;
  esac
}

run_post_phase() {
  local phase_name="$1"
  shift
  local phase_script="$DIR/${phase_name}.sh"
  local output
  output="$("$phase_script" "$@" --post 2>&1)" || {
    echo "$output"
    return 1
  }
  echo "$output"
  if [[ "$output" == *"STOP_RUN:"* ]]; then
    STOP_RUN=true
  fi
}

reconcile_pending_posts() {
  if [[ -z "$RUN_KEY" ]]; then
    return
  fi
  local resolved_run_root
  resolved_run_root="$(resolve_run_root)"
  if [[ ! -f "$resolved_run_root/task.json" ]]; then
    return
  fi
  while true; do
    node "$DIR/lib/asyncJobStore.mjs" refresh --run-root "$resolved_run_root" >/dev/null
    local next_post
    next_post="$(node "$DIR/lib/asyncJobStore.mjs" next-post --run-root "$resolved_run_root" | jq -r '.phase // empty')"
    if [[ -z "$next_post" ]]; then
      break
    fi
    run_post_phase "$next_post" "$@"
    if [[ "$STOP_RUN" == true ]]; then
      break
    fi
  done
}

run_phase() {
  local phase_script="$1"
  shift
  local output
  local phase_name
  phase_name="$(basename "$phase_script" .sh)"
  output="$("$phase_script" "$@" 2>&1)" || {
    local status=$?
    echo "$output"
    if [[ "$output" == *"SPAWN_MANIFEST:"* ]]; then
      local manifest_path
      manifest_path="$(echo "$output" | sed -n 's/^SPAWN_MANIFEST:[[:space:]]*//p' | head -n1)"
      node "$DIR/lib/manifestRunner.mjs" "$manifest_path" --cwd "$(pwd)" || return 1
      local post_output
      post_output="$("$phase_script" "$@" --post 2>&1)" || {
        echo "$post_output"
        return 1
      }
      echo "$post_output"
      return 0
    fi
    return $status
  }
  echo "$output"
  if [[ "$output" == *"STOP_RUN:"* ]]; then
    STOP_RUN=true
    return 0
  fi
  if [[ "$output" == *"SPAWN_MANIFEST:"* ]]; then
    local manifest_path
    manifest_path="$(echo "$output" | sed -n 's/^SPAWN_MANIFEST:[[:space:]]*//p' | head -n1)"
    node "$DIR/lib/manifestRunner.mjs" "$manifest_path" --cwd "$(pwd)" || return 1
    if [[ -n "$RUN_KEY" ]]; then
      local resolved_run_root
      resolved_run_root="$(resolve_run_root)"
      node "$DIR/lib/asyncJobStore.mjs" refresh --run-root "$resolved_run_root" --phase "$phase_name" >/dev/null
      local next_post
      next_post="$(node "$DIR/lib/asyncJobStore.mjs" next-post --run-root "$resolved_run_root" --phase "$phase_name" | jq -r '.phase // empty')"
      if [[ "$next_post" == "$phase_name" ]]; then
        run_post_phase "$phase_name" "$@"
      else
        STOP_RUN=true
      fi
    else
      STOP_RUN=true
    fi
  fi
}

if [[ "$WITH_PHASE0" == true ]]; then
  run_phase "$DIR/phase0.sh" "$@"
  if [[ "$STOP_RUN" == true ]]; then
    exit 0
  fi
fi
reconcile_pending_posts "$@"
if [[ "$STOP_RUN" == true ]]; then
  exit 0
fi

START_PHASE=1
if [[ -n "$RUN_KEY" ]]; then
  START_PHASE="$(start_phase_from_task "$(resolve_run_root)")"
fi
if [[ "$START_PHASE" == "stop" ]]; then
  exit 0
fi

for p in $(seq "$START_PHASE" 6); do
  run_phase "$DIR/phase${p}.sh" "$@"
  if [[ "$STOP_RUN" == true ]]; then
    break
  fi
done
