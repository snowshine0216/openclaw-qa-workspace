# Benchmark deliverable — P1-SUPPORT-CONTEXT-001 (Phase 1 contract check)

Feature: **BCIN-7289**  
Feature family: **report-editor**  
Primary phase under test: **phase1**  
Evidence mode: **blind_pre_defect**  
Priority: **blocking**  
Focus requirement: **supporting issues stay `context_only_no_defect_analysis` and produce summaries**

## What Phase 1 must do (per skill snapshot)
From the provided `skill_snapshot/SKILL.md` + `skill_snapshot/reference.md` contracts:

1. **Phase 1 entry behavior**: `scripts/phase1.sh` must generate **one spawn request per requested source family** **plus** **support-only Jira digestion requests when provided**.
2. **Phase 1 outputs** must include a `phase1_spawn_manifest.json`.
3. **Phase 1 post-validation (`--post`) must validate**:
   - **support relation map**
   - **support summaries**
   - **non-defect routing** for supporting issues (i.e., supporting issues remain in `context_only_no_defect_analysis` mode)
   - evidence completeness / spawn policy
4. **Support-only Jira policy** (blocking expectation for this benchmark):
   - Supporting Jira issues are **context evidence only**
   - Must remain in **`context_only_no_defect_analysis`**
   - Support artifacts must be persisted under `context/`, specifically (artifact family list):
     - `context/supporting_issue_request_<feature-id>.md`
     - `context/supporting_issue_relation_map_<feature-id>.md`
     - `context/supporting_issue_summary_<issue-key>_<feature-id>.md` and/or `context/supporting_issue_summary_<feature-id>.md`

## Evidence available in this benchmark bundle
The fixture evidence provided for BCIN-7289 includes:

- The primary feature issue JSON (`BCIN-7289.issue.raw.json`)
- A customer-scope export (`BCIN-7289.customer-scope.json`)
- An adjacent-issues summary (`BCIN-7289.adjacent-issues.summary.json`) listing 29 parented issues (mostly defects + a few stories)

Notably, the adjacent-issues export explicitly states:

- `"support_signal_issue_keys": []`
- `"customer_signal_present": false`
- Notes: *"No support/customer signal found in current parented issues export."*

So, **this evidence bundle provides no supporting issue keys** to be routed under the special supporting-issue policy.

## Phase 1 contract alignment vs. benchmark focus
### Required focus: supporting issues stay context-only and produce summaries
- The skill contract clearly defines a **support-only Jira policy** and Phase 1 `--post` validations that include **support relation map**, **support summaries**, and **non-defect routing**.
- However, **this benchmark’s provided fixture evidence does not contain any `supporting_issue_keys`** (support list is empty in the adjacency export).

### Conclusion for this benchmark case (based only on provided evidence)
- **The workflow contract supports the required behavior**, but **this specific blind-pre-defect evidence set does not exercise it**, because there are **no supporting issue keys** to summarize.
- Therefore, using only the provided benchmark evidence, we **cannot demonstrate** that Phase 1 will:
  - keep supporting issues in `context_only_no_defect_analysis`, and
  - produce the required `context/supporting_issue_summary_*.md` artifacts,
  because **no support inputs are present to trigger support digestion spawns**.

## Blocking gap / what would be needed to make this demonstrable in Phase 1
To satisfy the benchmark’s focus with observable Phase 1 behavior, the evidence bundle would need at least one of:

- Explicit runtime request material specifying `supporting_issue_keys: ["<JIRA-KEY>"]`, or
- A fixture file enumerating supporting issues for BCIN-7289 (separate from adjacent defects/stories), or
- A phase1 spawn manifest output showing support-only digestion tasks were generated.

Without such evidence, the best we can do is confirm **the contract requirements exist** in `SKILL.md`/`reference.md`, but we cannot confirm **execution** for this case.

---

# Execution summary

- Primary check performed: **Phase 1 contract coverage for “supporting issues are context-only and summarized”**.
- Result: **Not demonstrable from provided blind-pre-defect fixture**, because `support_signal_issue_keys` is empty and no `supporting_issue_keys` input is included.
- Blocker: Missing/absent supporting-issue inputs/artifacts needed to trigger Phase 1 support digestion + summary generation.