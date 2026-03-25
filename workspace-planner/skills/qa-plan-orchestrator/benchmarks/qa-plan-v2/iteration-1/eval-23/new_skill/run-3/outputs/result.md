# Benchmark RE-P5B-SHIP-GATE-001 — Phase 5b Shipment Checkpoint Enforcement (BCIN-7289)

## Verdict (blocking)
**FAIL — benchmark not satisfied (Phase 5b checkpoint enforcement cannot be demonstrated from provided evidence).**

The benchmark requires demonstrating that the **phase5b shipment checkpoint** explicitly covers the case focus:
- prompt lifecycle
- template flow
- builder loading
- close or save decision safety

and that outputs align with the **Phase 5b** model (checkpoint audit + checkpoint delta + phase5b draft; with correct dispositions).

Only the workflow package (skill snapshot) and a Jira fixture bundle are provided. There is **no Phase 5b runtime output evidence** (no checkpoint audit/delta/draft artifacts, no phase5b manifest, no run state), so checkpoint enforcement cannot be verified.

## What Phase 5b must produce/validate (contract)
From the skill snapshot rubric/contract, Phase 5b requires:
- `context/checkpoint_audit_<feature-id>.md`
  - Must contain: `## Checkpoint Summary`, `## Blocking Checkpoints`, `## Advisory Checkpoints`, `## Release Recommendation`
  - Must include explicit `supporting_context_and_gap_readiness` row
  - Must route back to **phase5a** when supporting context / report-editor gap coverage is not release-ready
- `context/checkpoint_delta_<feature-id>.md`
  - Must contain: `## Blocking Checkpoint Resolution`, `## Advisory Checkpoint Resolution`, `## Final Disposition`
  - Final disposition must end with one of: `accept` / `return phase5a` / `return phase5b`
- `drafts/qa_plan_phase5b_r<round>.md`
- plus: checkpoint audit/delta validators and reviewed-coverage-preservation validation against Phase 5a input draft

## Case focus mapping (what should be checked in Phase 5b for this benchmark)
Using only the fixture adjacent issues list as blind pre-defect signals, the Phase 5b checkpoint audit should explicitly force coverage for:

### Prompt lifecycle
Evidence signals in adjacent issues:
- BCIN-7730: template + prompt + pause mode not prompting
- BCIN-7685: cannot pass prompt answer in workstation new report editor
- BCIN-7677: save as + prompt set to “do not prompt” still prompts
- BCIN-7707: save as + prompt, discard current answer, answers still kept
- BCIN-7727: builder fails to load elements in prompt after double click folder

### Template flow
Evidence signals:
- BCIN-7730: create report by template with prompt using pause mode
- BCIN-7667: create report by template, save directly overrides rather than creating new

### Builder loading
Evidence signals:
- BCIN-7727: report builder fails to load elements in prompt
- BCIN-7668: two loading icons when create/edit report
- BCIN-7693: session out => unknown error; dismiss => loading forever

### Close / save decision safety
Evidence signals:
- BCIN-7709: clicking X multiple times opens multiple confirm-to-close popups
- BCIN-7708: confirm-to-close not shown when prompt editor open
- BCIN-7691: after create report + choose data retrieval mode + save; click X still prompts confirm-to-save
- BCIN-7669: override existing report save throws null saveAs error
- BCIN-7724: 400 error when replacing report

These are precisely the kinds of risks Phase 5b shipment checkpoints should gate under:
- Checkpoint 2 (Black-Box Behavior Validation)
- Checkpoint 3 (Integration Validation)
- Checkpoint 5 (Regression Impact)
- Checkpoint 7 (Test Data Quality)
- Checkpoint 8 (Exploratory Testing)
- Checkpoint 15 (Final Release Gate)
- Checkpoint 16 (i18n Dialog Coverage) (supported by adjacent i18n defects)

## Why this benchmark fails with provided evidence
To pass, we would need Phase 5b artifacts showing that the orchestrator:
1. ran Phase 5b via `scripts/phase5b.sh` and spawned the phase5b reviewer/refactor request
2. produced the required Phase 5b outputs (`checkpoint_audit`, `checkpoint_delta`, `qa_plan_phase5b_r*`)
3. explicitly audited shipment readiness checkpoints and ensured the case focus areas are covered in the plan (prompt lifecycle, template flow, builder loading, close/save decision safety)
4. ended `checkpoint_delta` with a valid disposition (`accept`/`return phase5a`/`return phase5b`)

None of those runtime artifacts are included in the benchmark evidence.

## Required next evidence to re-evaluate (not provided)
- `context/checkpoint_audit_BCIN-7289.md`
- `context/checkpoint_delta_BCIN-7289.md`
- `drafts/qa_plan_phase5b_r1.md` (or later round)
- `phase5b_spawn_manifest.json` and/or `run.json` validation history indicating Phase 5b post-validation passed

---

# Short execution summary
Reviewed only the provided benchmark evidence (skill snapshot contracts + BCIN-7289 blind pre-defect fixture bundle). Phase 5b checkpoint enforcement requires specific Phase 5b output artifacts and dispositions; these are not present, so the benchmark’s blocking expectations cannot be demonstrated and is marked **FAIL**.