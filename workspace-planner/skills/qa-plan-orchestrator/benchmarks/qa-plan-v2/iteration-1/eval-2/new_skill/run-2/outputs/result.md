# Benchmark artifact: Phase 1 contract check — BCIN-7289 (report-editor)

## Case
- Benchmark: **P1-SUPPORT-CONTEXT-001**
- Feature: **BCIN-7289**
- Feature family / knowledge pack: **report-editor**
- Primary phase under test: **phase1**
- Evidence mode: **blind_pre_defect**
- Focus (blocking): **supporting issues stay `context_only_no_defect_analysis` and produce summaries**

## What Phase 1 must do (per skill snapshot)
From `skill_snapshot/SKILL.md` + `skill_snapshot/reference.md`:
- Phase 1 work: **generate one spawn request per requested source family** **plus** **support-only Jira digestion requests when provided**.
- Phase 1 outputs:
  - `phase1_spawn_manifest.json`
  - support artifacts under `context/` including:
    - `context/supporting_issue_request_<feature-id>.md`
    - `context/supporting_issue_relation_map_<feature-id>.md`
    - `context/supporting_issue_summary_<issue-key>_<feature-id>.md` (per issue)
    - `context/supporting_issue_summary_<feature-id>.md` (aggregate)
- Phase 1 `--post` must validate: spawn policy, evidence completeness, **support relation map**, **support summaries**, and **non-defect routing**; if validation fails it exits 2 with `REMEDIATION_REQUIRED: <source_family>`.
- Support-only Jira policy: supporting Jira issues are **context evidence only** and must remain **`context_only_no_defect_analysis`**.

## Evidence available in this benchmark bundle
The provided fixture evidence contains:
- `BCIN-7289.issue.raw.json`: the primary feature issue payload.
- `BCIN-7289.customer-scope.json`: indicates **no customer signal present** at export time.
- `BCIN-7289.adjacent-issues.summary.json`: lists 29 adjacent issues (mostly **Defect** type) and explicitly reports:
  - `"support_signal_issue_keys": []`
  - `"customer_signal_present": false`

## Phase 1 compliance assessment for this case focus
### Supporting-issue handling requirement
This benchmark case is specifically about behavior **when supporting issues are provided**:
- They must be routed as **support-only context** (`context_only_no_defect_analysis`).
- They must produce **supporting issue summaries** and a **relation map** under `context/`.

### What can be verified with the provided evidence (blind pre-defect)
- The fixture’s adjacent-issue summary shows **no support-signal issues** (`support_signal_issue_keys` is empty).
- The fixture does **not** provide any `supporting_issue_keys` input for the orchestrator run, nor any Phase 1 runtime artifacts (no `phase1_spawn_manifest.json`, no `context/supporting_issue_*` artifacts).

### Blocking gap relative to the benchmark expectation
Because this benchmark run is **evidence-mode blind_pre_defect** and only fixture exports are provided (not an actual orchestrator run output), there is **no evidence** that Phase 1:
- generated support-only Jira digestion spawn requests,
- enforced `context_only_no_defect_analysis`,
- produced required `context/supporting_issue_relation_map_<feature-id>.md`,
- produced required `context/supporting_issue_summary_*.md` artifacts.

Therefore, **the benchmark expectation cannot be demonstrated as satisfied** using only the provided evidence.

## Required Phase 1 artifacts to demonstrate pass (not present in evidence)
To satisfy this benchmark case focus, the evidence set would need to include (at minimum):
- `phase1_spawn_manifest.json` showing at least one request corresponding to supporting-issue digestion (when `supporting_issue_keys` are provided).
- `context/supporting_issue_relation_map_BCIN-7289.md`
- `context/supporting_issue_summary_<issue-key>_BCIN-7289.md` (per supporting issue)
- and/or `context/supporting_issue_summary_BCIN-7289.md` (aggregate)
- plus confirmation in the Phase 1 contract outputs/validation that these were routed under **support-only context** with **no defect analysis**.

---

# Short execution summary
- Primary phase targeted: **Phase 1**.
- Case focus checked: **supporting issues must remain `context_only_no_defect_analysis` and produce summaries**.
- Outcome: **Blocked / not provable from provided blind-pre-defect fixture evidence**, because no Phase 1 runtime artifacts (spawn manifest or `context/supporting_issue_*` outputs) and no `supporting_issue_keys` input were included in the evidence bundle.