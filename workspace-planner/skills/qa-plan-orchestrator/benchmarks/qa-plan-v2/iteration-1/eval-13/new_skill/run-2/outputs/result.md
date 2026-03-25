# HOLDOUT-REGRESSION-001 — BCIN-6709 (report-editor) — Holdout Regression Gate

## Scope
This benchmark validates the **holdout** checkpoint for the `qa-plan-orchestrator` skill, specifically the regression risk called out in the case focus:

- **Case focus (blocking):** skill improvements for **report-editor** **do not regress a different feature planning flow**.

## Evidence evaluated (holdout_regression mode)
Only the provided fixture evidence was used:

- `fixture:embedding-dashboard-editor-compare-result/compare-result.md`

## Holdout regression assessment
### What the evidence demonstrates
The fixture is a comparison write-up between two QA plan styles:
- **Plan 1:** deeper **report-editor** capability coverage and more executable manual steps.
- **Plan 2:** stronger **embedding/migration shell** and regression framing, but weaker report-editor breadth.

This evidence is **about plan quality differences** across report-editor vs embedding/migration emphasis.

### What is required to pass this benchmark (holdout)
To show “report-editor improvements do not regress a different feature planning flow,” the holdout checkpoint needs evidence that the orchestrator:
- still follows the **script-driven phase model** (phase scripts + spawn manifests + `--post` validation), and
- still produces (or can produce) correct artifacts for a **non-report-editor planning flow** (e.g., an embedding/dashboard-editor feature), not only report-editor.

### Gap vs requirement
The provided evidence **does not contain orchestrator-run outputs** (no phase logs, no spawn manifests, no produced artifacts, no cross-feature run comparison). It only contains a narrative comparison of two plans.

Therefore, from the holdout regression perspective:
- We **cannot verify** that report-editor-oriented improvements to the orchestrator **did not** change behavior for another feature family/flow.
- We also **cannot verify** phase alignment at the runtime level (e.g., whether a holdout checkpoint gate was satisfied by the orchestrator in an actual run).

## Verdict (blocking)
**FAIL (blocked by missing holdout regression evidence).**

Reason: The fixture does not provide the necessary cross-feature orchestration evidence to demonstrate that report-editor improvements did not regress a different feature planning flow.

## Minimal evidence needed to convert to PASS (for this holdout gate)
One of the following, using the orchestrator contract artifacts (script-driven run outputs) for a **non-report-editor** feature flow:

- A non-report-editor run directory excerpt showing:
  - `task.json` / `run.json` with phase progression, and
  - at least one `phaseN_spawn_manifest.json` + confirmation that `phaseN.sh --post` validations passed

**or**

- A controlled A/B holdout comparison showing that for a non-report-editor feature, the generated planning artifacts and phase gates remain consistent before/after report-editor improvements.

(Any such evidence must be provided as benchmark evidence; it is not present in this case.)