# BCIN-6709 Execution SOP

**Issue:** BCIN-6709  
**Owner:** Atlas Tester  
**Environment:** `https://tec-l-1183620.labs.microstrategy.com/MicroStrategyLibrary/app`  
**User:** `bxu` (empty password; click login directly)  
**Last updated:** 2026-03-18

---

## 1. Purpose

This SOP documents how the BCIN-6709 execution effort reached the current stage, what preparation work has already been completed, and the standard operating procedure for continuing execution.

It is intended to help future reruns start faster, avoid repeated setup mistakes, and preserve lessons learned in the workspace `docs/` folder.

---

## 2. Current Stage Reached

At the time of writing, the BCIN-6709 effort has reached the **execution-preparation / controlled execution** stage.

Completed so far:
1. The correct QA plan location was identified.
2. A feature-execution approach was defined.
3. Execution templates were created under `projects/test-cases/BCIN-6709/reports/`.
4. Known prior blocker context was recovered from workspace memory.
5. Site-knowledge prework was started for actual execution.

---

## 3. How We Reached This Stage

### Step 1 — Skill selection
For this feature, the primary testing skill selected was:
- `microstrategy-ui-test`

Supporting execution guidance used:
- `site-knowledge-search` (mandatory before execution)
- `test-report` (for final report formatting)

### Step 2 — QA plan path correction
The originally referenced QA plan path did not exist.

**Incorrect path provided earlier:**
- `/Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/runs/BCIN-6709/qa-plan-final.md`

**Resolved correct path:**
- `/Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-planner/projects/feature-plan/BCIN-6709/qa_plan_final.md`

This correction was necessary before any valid execution planning could proceed.

### Step 3 — QA plan review
The QA plan was reviewed and grouped into practical execution buckets:
- running mode recovery
- pause mode / resume data retrieval
- prompt flow
- reprompt
- prompt-in-prompt
- UI messaging
- cross-surface parity
- scope / authoring vs consumption
- locale

### Step 4 — Execution approach decision
The user selected **Option B: full BCIN-6709 feature execution**.

Because the user also required exploration of bxu's Library report-by-report, the chosen approach became:
- **exploratory-first, but QA-plan-traceable feature execution**

Meaning:
1. inventory the reports,
2. identify usable test objects,
3. execute only valid scenarios on actual candidate objects,
4. mark missing-fixture scenarios as `BLOCKED` instead of guessing.

### Step 5 — Report template creation
Ready-to-use execution templates were created under:
- `projects/test-cases/BCIN-6709/reports/report-inventory.md`
- `projects/test-cases/BCIN-6709/reports/object-results.md`
- `projects/test-cases/BCIN-6709/reports/execution-summary.md`

These templates establish:
- report-by-report inventory,
- object-based execution logging,
- final summary and scenario traceability.

### Step 6 — Recovery of prior execution context
Workspace memory and `task.json` showed that a previous BCIN-6709 run had already hit a configuration problem in PM-01.

Known prior state:
- workflow: `feature-test`
- phase: `phase_3_execute_tests`
- status: `test_config_error`
- current test case: `PM-01`
- blocking reason: wrong error type encountered

Recovered memory confirms the previous attempt produced an **attribute aggregation error** instead of the expected **max rows exceeded** style error.  
Source: `memory/2026-03-05-resume-button-test.md#L101-L162`

This is important because it means at least one prior report / setup was not suitable for the intended validation path.

### Step 7 — Site knowledge prework started
Before actual execution, the `site-knowledge-search` flow was started.

Completed inputs gathered so far:
- sitemap reviewed from `memory/site-knowledge/SITEMAP.md`
- memory search attempted for relevant report-authoring terms
- BM25 (`qmd search`) performed for execution-relevant terms

Useful hits found included:
- authoring domain coverage
- report domain coverage
- pause mode grid hint
- reprompt locator hints
- login button selector in auth knowledge

---

## 4. Files Created So Far

### Execution artifacts
- `projects/test-cases/BCIN-6709/reports/report-inventory.md`
- `projects/test-cases/BCIN-6709/reports/object-results.md`
- `projects/test-cases/BCIN-6709/reports/execution-summary.md`

### SOP / learning docs
- `docs/workflows/BCIN-6709_EXECUTION_SOP.md`
- `docs/troubleshooting/BCIN-6709_EXECUTION_LEARNINGS.md`

---

## 5. Standard Procedure From This Point Forward

### Phase A — Pre-execution
1. Read the QA plan from the corrected path.
2. Read this SOP and troubleshooting notes.
3. Generate / refresh `projects/test-cases/BCIN-6709/site_context.md`.
4. Ensure `task.json` points to the latest site context path.

### Phase B — Environment access
1. Open the target environment.
2. Confirm the username is `bxu`.
3. Leave password empty.
4. Directly click login / hit enter.
5. Confirm Library loads.
6. Capture setup screenshots.

### Phase C — Report inventory
1. Review bxu's Library report-by-report.
2. Record exact object names.
3. Determine whether each object is:
   - authorable,
   - prompted,
   - reprompt-capable,
   - pause-mode capable,
   - useful for BCIN-6709.
4. Capture at least one screenshot per object.
5. Fill `report-inventory.md`.

### Phase D — Candidate selection
Select the strongest objects for:
- running-mode scenarios
- prompt scenarios
- reprompt scenarios
- pause mode / resume scenarios
- scope comparison

### Phase E — Scenario execution
Execute only what is genuinely supported by the chosen object.
For each scenario:
1. record the starting state,
2. perform the action,
3. capture error / recovery UI,
4. validate expected copy and behavior,
5. record outcome in `object-results.md`.

### Phase F — Summary and closeout
1. update `execution-summary.md`
2. classify results as PASS / FAIL / BLOCKED / N/A
3. clearly list missing fixtures or repro gaps
4. preserve new learnings in docs when execution issues arise

---

## 6. Operating Rules

- Do **not** guess repro steps.
- If the wrong error path appears, treat it as a configuration / object suitability issue until proven otherwise.
- Distinguish `Not suitable` from `FAIL`.
- Capture screenshots before and after major actions.
- Record exact report names and exact observed UI copy.
- Any important problem encountered during execution must be documented in `docs/` for reuse.

---

## 7. Definition of “Current Stage”

BCIN-6709 is currently at:
- **planning complete**
- **reporting templates complete**
- **known blocker context recovered**
- **site knowledge in progress**
- **ready to start live environment inventory and execution**

---

## 8. Next Immediate Actions

1. Finish writing `projects/test-cases/BCIN-6709/site_context.md`.
2. Update `task.json` with the site context path.
3. Access the environment as `bxu`.
4. Start bxu Library inventory.
5. Document every new blocker or workaround in `docs/troubleshooting/BCIN-6709_EXECUTION_LEARNINGS.md`.
