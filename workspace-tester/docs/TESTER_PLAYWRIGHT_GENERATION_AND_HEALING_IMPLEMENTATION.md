# Workspace-Tester Playwright Generation + Healing Implementation (Enhanced Review Draft)

## 1. Objective

Enable `workspace-tester` to support both capabilities in one concrete workflow:

1. Generate executable Playwright tests from planner-provided Markdown specs.
2. Heal failing Playwright tests with bounded retries (max 3 rounds).

This design aligns with orchestration order:

1. `playwright-test-planner` creates plan/spec Markdown.
2. `playwright-test-generator` consumes plan/specs and writes `.spec.ts`.
3. `playwright-test-healer` executes/fixes failing specs with max 3 rounds.

---

## 2. Scope and Non-Goals

### In scope

- Add tester-side workflow for planner spec intake -> test generation -> execution -> healing.
- Define artifact paths, state files, retry policy, and handoff contracts.
- Keep existing WDIO migration workflows operational.
- Generalize flow from one Jira issue to any `work_item_key`.

### Out of scope

- Replacing existing migration workflows:
  - `projects/library-automation/.agents/workflows/script-migration.md`
  - `projects/library-automation/.agents/workflows/script-migration-quality-check.md`
- Forcing one execution mode (planner-first vs direct vs provided-plan).

---

## 3. OpenClaw/Clawddocs Findings

### 3.1 Clawddocs refresh

Used `clawddocs` skill (`sitemap`, `search`, `fetch-doc`) to refresh conventions. In this repository checkout, the skill scripts are lightweight wrappers, so local repo evidence was also used for runtime behavior conclusions.

### 3.2 `.agents` discovery conclusion

From local evidence:

1. `workspace-tester/AGENTS.md` explicitly references workflow files by path.
2. Existing skills/workflows reference `.agents/workflows` explicitly.
3. No authoritative local evidence confirms implicit auto-discovery of arbitrary `.agents/*` paths.

Design decision:

- Treat `.agents` as explicit-path convention, not guaranteed implicit discovery.
- Always keep explicit workflow/script paths in `AGENTS.md` and user-facing docs.

---

## 4. Pathing and Workspace Rules (Enhanced)

### 4.1 No hardcoded user-home paths

Do not hardcode `/Users/<name>/...` in the design.

Use workspace-relative resolution:

1. tester workspace root: `workspace-tester/`
2. planner workspace root from tester: `../workspace-planner/`

### 4.2 Generic work-item key

Use `work_item_key` instead of fixed `BCIN-6709`.

Examples:

- `BCIN-6709`
- `BCED-4198`
- `feature-report-filter-v2`

### 4.3 Canonical relative paths (from `workspace-tester`)

1. planner specs source (default):
   - `../workspace-planner/projects/feature-plan/<work_item_key>/specs/`
2. tester project root:
   - `projects/library-automation/`
3. tester intake specs:
   - `projects/library-automation/specs/feature-plan/<work_item_key>/`
4. generated executable specs:
   - `projects/library-automation/tests/specs/feature-plan/<work_item_key>/`

---

## 5. Folder Placement Revision (Per your requirement)

### 5.1 Scripts location (revised target)

Move orchestration scripts to workspace-level source tree:

- `workspace-tester/src/tester-flow/`

Planned script entrypoints:

1. `workspace-tester/src/tester-flow/check_resume_spec_flow.sh`
2. `workspace-tester/src/tester-flow/sync_planner_specs.sh`
3. `workspace-tester/src/tester-flow/write_run_state.sh`
4. `workspace-tester/src/tester-flow/generate_framework_profile.mjs`

### 5.2 Context/state location (revised target)

Store workflow JSON/state as tester memory artifacts:

- `workspace-tester/memory/tester-flow/`

Proposed structure:

1. framework profile:
   - `workspace-tester/memory/tester-flow/framework-profile/library-automation.json`
2. per-work-item run state:
   - `workspace-tester/memory/tester-flow/runs/<work_item_key>/task.json`
   - `workspace-tester/memory/tester-flow/runs/<work_item_key>/run.json`
   - `workspace-tester/memory/tester-flow/runs/<work_item_key>/context/spec_manifest.json`
   - `workspace-tester/memory/tester-flow/runs/<work_item_key>/reports/execution-summary.md`
   - `workspace-tester/memory/tester-flow/runs/<work_item_key>/healing/healing_report.md` (if unresolved)

### 5.3 Compatibility note

Current draft implementation used project-local `.agents/scripts` and `.agents/context` under `projects/library-automation`. Keep temporary compatibility wrappers during migration, then retire legacy paths after validation.

---

## 6. Execution Mode Gate (Added)

Before Phase 0, choose one mode explicitly:

1. `planner_draft_then_run`
- invoke planner to draft QA plan/specs first,
- then tester generates/runs/heals.

2. `direct_generate_and_run`
- skip planner drafting,
- tester generates tests from provided requirement context.

3. `use_provided_plan`
- use user-provided plan/spec files,
- tester only executes generate/run/heal.

If plan location is ambiguous (planner vs tester workspace), resolve mode and source with user before proceeding.

---

## 7. Required Workflow Artifacts

### 7.1 Workflow docs

1. `projects/library-automation/.agents/workflows/planner-spec-generation-healing.md`

### 7.2 Script artifacts (current impl path)

1. `projects/library-automation/.agents/scripts/check_resume_spec_flow.sh`
2. `projects/library-automation/.agents/scripts/sync_planner_specs.sh`
3. `projects/library-automation/.agents/scripts/write_run_state.sh`
4. `projects/library-automation/.agents/scripts/generate_framework_profile.mjs`

### 7.3 Target migration path (workspace-level)

1. `src/tester-flow/check_resume_spec_flow.sh`
2. `src/tester-flow/sync_planner_specs.sh`
3. `src/tester-flow/write_run_state.sh`
4. `src/tester-flow/generate_framework_profile.mjs`

---

## 8. Handoff Contracts (Planner -> Tester -> Generator -> Healer)

### 8.1 Planner -> Tester

Required inputs:

1. `work_item_key`
2. planner specs directory containing `**/*.md`

Optional input:

1. planner summary path (traceability)

Tester output:

1. spec manifest JSON with:
- source relative path,
- hash,
- modified timestamp,
- inferred scenario name,
- target `.spec.ts` path.

### 8.2 Tester -> Generator

For each markdown spec in `specs/feature-plan/<work_item_key>/`:

1. invoke `playwright-test-generator`,
2. pass source plan path,
3. pass seed reference (`**Seed:**`),
4. pass target output path under `tests/specs/feature-plan/<work_item_key>/...`,
5. pass framework profile path.

### 8.3 Tester -> Healer

On execution failure:

1. invoke `playwright-test-healer`,
2. pass failing spec paths, command, failure logs,
3. pass optional `wdioSourcePath` if applicable,
4. pass spec markdown path,
5. pass framework profile path.

Healer constraints:

1. max 3 rounds,
2. preserve test intent,
3. do not silently remove/skip steps,
4. preserve shared auth/session patterns using existing fixture + POM helpers.

---

## 9. State Model (task.json + run.json)

### 9.1 `task.json` (control-plane)

Minimum fields:

1. `work_item_key`
2. `overall_status`
3. `current_phase`
4. phase status map:
- `phase_0_idempotency`
- `phase_1_intake`
- `phase_2_generate`
- `phase_3_execute`
- `phase_4_heal`
- `phase_5_finalize`
5. healing:
- `max_rounds=3`
- `current_round`
- `status`

### 9.2 `run.json` (data-plane)

Minimum fields:

1. `report_state`
2. `data_fetched_at`
3. `output_generated_at`
4. `planner_specs_source`
5. `tester_specs_dir`
6. `generated_specs[]`
7. `failed_specs[]`
8. `notification_pending`

`notification_pending` stores full message text when Feishu delivery fails.

---

## 10. Phase-by-Phase Workflow

## Phase 0: Preflight + Idempotency

1. generate/load framework profile,
2. classify state:
- `FINAL_EXISTS`
- `DRAFT_EXISTS`
- `CONTEXT_ONLY`
- `FRESH`
3. apply resume/refresh decision.

## Phase 1: Intake + Manifest

1. sync planner specs into tester intake path,
2. generate spec manifest,
3. update run-state timestamps and source metadata.

## Phase 2: Generation

1. run generator per markdown spec,
2. enforce output template and fixture import from framework profile,
3. reuse existing auth/session helper patterns,
4. update generated spec list.

## Phase 3: Execution

1. run generated suite with `--retries=0`,
2. capture failures for healing input.

## Phase 4: Healing (max 3 rounds)

1. run healer on current failed set,
2. rerun only failed specs,
3. stop when pass or round 3 exhausted,
4. if unresolved after round 3, write healing report.

## Phase 5: Finalize + Notification

1. write execution summary,
2. set final state,
3. send Feishu notification.

### Phase 5.1 Feishu notification rule (requested)

1. Feishu Chat-id: look up in `workspace-tester/TOOLS.md`.
2. if send fails: write full message to `run.json.notification_pending`.

### Phase 5.2 Notification verification command (requested)

```bash
jq -r '.notification_pending // empty' workspace-tester/memory/tester-flow/runs/<work_item_key>/run.json
```

---

## 11. Retry and Failure Policy

1. generation retry:
- retry one time per failed generation,
- then mark blocked and continue other scenarios.

2. execution retry:
- no implicit retries in baseline execution phase (`--retries=0`).

3. healing retry:
- max 3 rounds,
- rerun failed specs only per round,
- unresolved => mandatory healing report.

4. hard blockers:
- missing planner specs path,
- missing seed file required by scenario,
- missing critical environment configuration.

---

## 12. Tests Required for This Workflow (Added)

### 12.1 Script-level tests

1. `check_resume_spec_flow.sh` state matrix coverage,
2. `sync_planner_specs.sh` copy+manifest correctness,
3. `write_run_state.sh` action matrix,
4. `generate_framework_profile.mjs` detection correctness.

### 12.2 Integration tests

1. preflight -> intake -> state transition flow,
2. generation output path coherence,
3. healing max-round enforcement,
4. notification pending fallback verification.

### 12.3 Regression tests

1. ensure migration workflows remain unchanged:
- `script-migration.md`
- `script-migration-quality-check.md`

---

## 13. Documentation Deliverables (Added)

### 13.1 User-facing README (required)

Create:

- `workspace-tester/README_TESTER_FLOW.md`

Must include:

1. execution mode selection guidance,
2. required inputs,
3. key commands,
4. artifact locations,
5. troubleshooting and Feishu replay flow.

### 13.2 AGENTS update (required)

Update `workspace-tester/AGENTS.md` with:

1. new capability summary,
2. 3-mode decision gate,
3. entry script/workflow paths,
4. Feishu chat-id lookup rule.

### 13.3 MEMORY update (required)

Update `workspace-tester/MEMORY.md` with:

1. tester-flow memory map,
2. framework profile location,
3. run-state persistence policy by phase.

---

## 14. Rollout Plan

1. finalize this design review,
2. migrate script/state paths to workspace-level (`src` + `memory`),
3. add docs updates (`AGENTS`, `MEMORY`, user README),
4. run script + integration tests,
5. enable as default for supported work-item modes.

---

## 15. Review Checklist

Approve when all are true:

1. original implementation detail level is preserved,
2. no hardcoded user-home paths,
3. pathing uses tester-local + sibling planner references,
4. scripts target `workspace-tester/src/tester-flow/`,
5. state/context target `workspace-tester/memory/tester-flow/`,
6. flow is generic for any `work_item_key`,
7. `.agents` recognition risk and explicit invocation policy documented,
8. tests plan is defined,
9. user-facing README requirement is defined,
10. AGENTS/MEMORY update requirements are defined,
11. planner-vs-direct-vs-provided-plan gate is defined.

