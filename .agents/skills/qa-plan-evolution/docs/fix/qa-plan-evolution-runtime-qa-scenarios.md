# QA Plan Evolution Runtime QA Scenarios

Use this checklist to verify runtime, resume, and generalization behavior without reading implementation code.

## Scenario 1: Fresh canonical run

1. Start a new run with `scripts/orchestrate.sh --with-phase0`.
2. Confirm artifacts are created under `.agents/skills/qa-plan-evolution/runs/<run-key>/`.
3. Confirm `task.json` includes `canonical_run_root`, `runtime_root_mode`, and `next_action`.

## Scenario 2: Blocked async prerequisite

1. Start a qa-plan run that requires defects-analysis refresh.
2. Confirm `task.json` shows `next_action=await_async_completion`.
3. Confirm `blocking_reason` explains the missing prerequisite.
4. Confirm `progress.sh` lists the pending job and expected artifact paths.

## Scenario 3: Resume after async completion

1. Complete the spawned prerequisite so `spawn_results.json` and expected artifacts are present and fresh.
2. Re-run `scripts/orchestrate.sh` with the same `run-key`.
3. Confirm the owning phase re-enters with `--post` once and the run advances to the next phase.

## Scenario 4: Expired async job

1. Create or simulate a job whose `timeout_at` is in the past.
2. Run `progress.sh` or `check_resume.sh`.
3. Confirm the job becomes `expired`, `overall_status=blocked`, and `next_action=operator_retry_required`.

## Scenario 5: Awaiting approval after accept

1. Run a candidate through Phase 6 without `--finalize`.
2. Confirm the run stops in `awaiting_approval`.
3. Confirm `pending_finalization_iteration` is populated and no promotion commit is created yet.

## Scenario 6: Rejected iteration restore

1. Reject an iteration in Phase 6.
2. Confirm the candidate snapshot is restored to champion baseline.
3. Confirm `rejection_restore_<run-key>_i<n>.json` exists.

## Scenario 7: Finalized acceptance

1. Finalize an accepted iteration with `--finalize`.
2. Confirm `evolution_final.md`, archive artifacts, and git promotion metadata are coherent.
3. Confirm accepted gap ids and accepted mutation summaries are written when applicable.

## Scenario 8: Markdown fallback cannot drive promotion-grade mutation

1. Provide defects markdown without a structured gap bundle.
2. Run Phase 2.
3. Confirm the fallback observations are advisory-only and do not produce promotion-grade shared rubric mutations.
