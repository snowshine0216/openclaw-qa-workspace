# MEMORY.md - QA Test Execution Agent Long-Term Memory

_Test execution patterns, runtime state map, and automation tips._

## Tester Flow v2 State Map

Canonical state root:

1. `memory/tester-flow/runs/<work_item_key>/`

Primary files:

1. `task.json` (control-plane status)
2. `run.json` (data-plane artifacts and logs)
3. `context/spec_manifest.json` (phase-1 intake manifest)
4. `reports/execution-summary.md` (phase-5 summary)
5. `healing/healing_report.md` (only if unresolved after round 3)

Key invariants:

1. `task.json.execution_mode` and `run.json.execution_mode` must match.
2. `task.json.healing.max_rounds` must stay `3`.
3. `run.json.pre_route_decision_log` must have at least one entry.
4. `run.json.legacy_path_used` must remain `false` in canonical flow.

## Migration Notes (March 3, 2026)

1. Planner-spec generation/healing runtime moved to `src/tester-flow/`.
2. Project-local scripts under `projects/library-automation/.agents/scripts/` are deprecated for this flow.
3. Canonical discovery is workspace-root `.agents/workflows/` only.
4. Canonical writes target `memory/tester-flow/runs/*`; no mirror writes to project-local `runs/*`.

## Common Failure Patterns

### UI Timing Issues

1. Element not found: increase wait and verify page state before interaction.
2. Stale element reference: re-query after DOM updates.
3. Click intercepted: wait for overlays/loaders to clear.

### Workflow Input Issues

1. Missing planner artifacts (`qa_plan_final.md` or `specs/`): run R0 with `PLANNER_PRESOLVE_CMD` configured.
2. Missing `**Seed:**` in markdown: block `planner_first` and `provided_plan` until fixed.
3. Invalid mode transition: requires `new_run_on_mode_change=true`.

### Healing Loop Issues

1. Ensure failed-only reruns each round.
2. Never exceed 3 rounds.
3. If unresolved at round 3, write `healing_report.md` and stop.

## Browser Automation Tips

1. Use explicit waits over implicit waits.
2. Capture screenshots before and after key actions.
3. Capture console output immediately on errors.
4. Prefer stable selectors and semantic locators.

## Test Data Best Practices

1. Use consistent test accounts.
2. Reset test data before each run when possible.
3. Document required data in plan/spec markdown.
4. Keep credentials out of code and read from configured env/files.

## Site Knowledge Search Activity

When site knowledge search yields useful results, append entries:

```
- [YYYY-MM-DD] Site search: "<query>" → <file>: <key findings>
```

Example: `- [2026-03-04] Site search: "CalendarFilter" → filter.md: calendarFilterPanel, dateRangePicker`

## Lessons Learned

### What Works Well

1. Deterministic manifest generation (sorted, deduped inputs).
2. Canonical state writes with explicit phase transitions.
3. Strict seed validation before generation.
4. Failed-only healing reruns to reduce noise and runtime.

### Common Pitfalls to Avoid

1. Mixing workspace-root and project-local workflow entrypoints.
2. Running baseline execution with retries > 0 (hides flaky behavior).
3. Silent mode changes without creating mode-shift namespace.
4. Clearing `notification_pending` before actual resend success.

---

_Last updated: 2026-03-03_
