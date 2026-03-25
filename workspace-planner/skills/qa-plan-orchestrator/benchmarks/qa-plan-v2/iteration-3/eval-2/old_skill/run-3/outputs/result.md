# Benchmark P1-SUPPORT-CONTEXT-001 — Phase 1 Contract Check (BCIN-7289)

## Scope / checkpoint
- **Primary feature:** BCIN-7289
- **Feature family / knowledge pack:** report-editor
- **Primary phase under test:** **phase1**
- **Evidence mode:** blind_pre_defect
- **Case focus (blocking):** **supporting issues must stay `context_only_no_defect_analysis` and produce summaries**

## Phase 1 orchestrator contract (from snapshot)
Phase 1 is script-driven and must:
1. Run `scripts/phase1.sh <feature-id> <run-dir>`
2. If `SPAWN_MANIFEST: <path>` is emitted:
   - Spawn all `requests[].openclaw.args` **exactly as-is** via `sessions_spawn`
   - Wait for completion
   - **Phase 1 only:** run `scripts/record_spawn_completion.sh phase1 <feature-id> <run-dir>`
   - Run `scripts/phase1.sh <feature-id> <run-dir> --post`
3. `--post` must validate (per SKILL snapshot) that:
   - spawn policy + evidence completeness pass
   - **support relation map exists**
   - **support summaries exist**
   - **support issues are routed as non-defect (`context_only_no_defect_analysis`)**

## Evidence available in this benchmark bundle
- BCIN-7289 feature issue export (`BCIN-7289.issue.raw.json`)
  - Feature goal described: embed Library report editor into Workstation report authoring.
  - No explicit `issuelinks` present in the export (`issuelinks: []`).
- Adjacent issues snapshot (`BCIN-7289.adjacent-issues.summary.json`)
  - 29 parented issues listed; includes many **Defect** issues.
  - `support_signal_issue_keys: []` (explicitly none detected).
- Customer scope snapshot (`BCIN-7289.customer-scope.json`)
  - `customer_signal_present: false`

## Phase 1 focus evaluation: supporting issues context-only + summaries
### What Phase 1 would be required to produce *if supporting issues were provided*
Per `reference.md` Phase 1 artifacts for supporting issues:
- `context/supporting_issue_request_<feature-id>.md`
- `context/supporting_issue_relation_map_<feature-id>.md`
- `context/supporting_issue_summary_<issue-key>_<feature-id>.md` (per issue)
- `context/supporting_issue_summary_<feature-id>.md` (aggregate)
And they must be handled under policy:
- `supporting_issue_policy = context_only_no_defect_analysis`

### What we can assert from provided evidence (blind_pre_defect)
- This fixture bundle **does not provide any `supporting_issue_keys`** input.
- The adjacent issue set explicitly reports **no support-signal issues** (`support_signal_issue_keys: []`).

### Blocking contract coverage determination for this benchmark
- The case focus requires demonstrating that **supporting issues stay `context_only_no_defect_analysis` and produce summaries**.
- With the provided evidence, there are **no supporting issues designated** (no keys supplied; no support-signal keys detected).
- Therefore, **the phase1 supporting-issue summarization and context-only routing path cannot be exercised or verified** from this bundle alone.

## Result (phase_contract / blocking)
- **FAIL (blocked by missing required benchmark inputs/evidence):** Unable to verify the benchmark’s required behavior (“supporting issues stay context_only_no_defect_analysis and produce summaries”) because the provided fixture evidence contains **no supporting_issue_keys** and reports **no support-signal issue keys**.
- **Phase alignment:** This report stays strictly within **Phase 1** requirements and does not assess later phases.

## What would be needed to pass this benchmark (within Phase 1)
To validate the focus behavior in Phase 1, the evidence bundle would need at least one supporting issue key designated as support-only context, plus the resulting Phase 1 context artifacts:
- Input: `supporting_issue_keys: ["<JIRA-KEY>", ...]`
- Outputs under `context/`:
  - `supporting_issue_relation_map_BCIN-7289.md`
  - `supporting_issue_summary_<JIRA-KEY>_BCIN-7289.md`
  - `supporting_issue_summary_BCIN-7289.md`
And Phase 1 `--post` validation output showing the non-defect routing policy passed.