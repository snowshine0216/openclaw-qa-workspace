# Simplified QA Plan Evolution Model

This document outlines the **3-Phase Simplified Evolution Model** for `qa-plan-orchestrator`. 

You should use this simplified model instead of the full 7-phase automated pipeline when you are working with only 1 or 2 feature families and your defect evidence is gathered manually.

## When to use which model?

| Condition | 3-Phase Simplified Model (You are here) | 7-Phase Automated Pipeline |
|---|---|---|
| **Feature Families** | 1-2 active families | 3+ active families |
| **Evidence Gathering** | Manual defect reports / stubs | Automated `defects-analysis` subagent |
| **Pacing** | Ad-hoc, when gaps are noticed | Scheduled continuous evolution |
| **Evals Profile** | `qa-plan-pack-only` | `qa-plan-defect-recall` |

---

## The 3-Phase Workflow

### Phase A: Collect Evidence (Manual)

When a QA plan ships with gaps, or a feature family has a cluster of missed defects:

1. Read the defect report (e.g., `BCIN-7289_REPORT_FINAL.md`).
2. Identify the root cause for each missed defect. Was an outcome missed? A state transition undocumented? Two features interacting surprisingly?
3. Document these findings in the gap analysis stubs:
   - `BCIN-XXXX_SELF_TEST_GAP_ANALYSIS.md` (for the taxonomy bucket)
   - `BCIN-XXXX_QA_PLAN_CROSS_ANALYSIS.md` (for the knowledge pack delta recommendation)

### Phase B: Apply Mutation (Manual Edit)

Translate the findings from Phase A into structural rules that the `qa-plan-orchestrator` will obey in future runs.

Before editing, keep these terms separate:

- `evidence source`: the defect report or gap-analysis artifact you read
- `generalized rule`: the reusable rule you extracted from that evidence
- `target mutation surface`: the narrowest place that should change

**Option 1: Enrich the Knowledge Pack (Most Common)**
- Edit `workspace-planner/skills/qa-plan-orchestrator/knowledge-packs/<family>/pack.json`
- Edit the corresponding `pack.md`
- Add new `required_capabilities`, `required_outcomes`, `state_transitions`, or `interaction_pairs`.
- For specific historical bugs, add an `analog_gate` to prevent regression.

**Option 2: Edit Phase Rubrics (Rare)**
- If the gap wasn't a domain knowledge miss, but a structural rule miss (e.g., "the planner didn't include SDK outcomes"), edit the rubric contracts in `references/`.
- Phase 4a: `phase4a-contract.md` (Scenario Generation)
- Phase 5a: `review-rubric-phase5a.md` (Coverage Audit)
- Phase 5b: `review-rubric-phase5b.md` (Release Checkpoints)

### Generalization Guard

Good mutation:

- Evidence source: `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md`
- Generalized rule: `Audit interaction-pair completeness for save dialog flows.`
- Target mutation surface: `workspace-planner/skills/qa-plan-orchestrator/knowledge-packs/report-editor/`

Blocked mutation:

- Evidence source: `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md`
- Generalized rule: `Fix BCIN-7289`
- Target mutation surface: shared rubric text

Do not write defect keys into rubric text. If the evidence only supports one feature family, default to a feature-family knowledge-pack change instead of a shared rubric update.

### Phase C: Benchmark Gate (Automated)

Validate that your manual edits in Phase B actually fixed the problem without breaking other features.

1. Ensure your run uses the `qa-plan-pack-only` profile in `evals.json` to skip the complex defect-replay machinery.
2. Run the established benchmark v2 suite:
   ```bash
   cd workspace-planner/skills/qa-plan-orchestrator
   npm run benchmark:v2:run
   ```
3. Read the resulting scorecard.
   - Did the gap scenario improve from FAIL to PASS?
   - Did the `HOLDOUT-REGRESSION` cases remain PASS?
4. If yes, **Accept** the mutation and commit the knowledge pack/rubric edits. If no, discard and try again.

---

## Operator Note on State Tracking

When using this 3-phase model, you do not need to strictly adhere to the `REPORT_STATE` state machine expected by the full 7-phase flow. It is entirely expected and normal that your run states will show `CONTEXT_ONLY` because you are bypassing the automated extraction and backlog-generation phases.
