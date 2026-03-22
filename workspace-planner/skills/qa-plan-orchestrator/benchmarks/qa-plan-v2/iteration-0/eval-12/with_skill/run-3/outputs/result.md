# DOC-SYNC-001

Verdict: the current `qa-plan-orchestrator` documentation set does not satisfy this benchmark case.

## Findings

### 1. Case-focus coverage is missing because AGENTS sync is not present in the authoritative package and is not enforced by the active docs contract

This case requires `SKILL.md`, `README.md`, `reference.md`, and AGENTS docs to stay aligned. The authoritative snapshot does not contain an `AGENTS.md`, and the active docs contract does not require or test AGENTS sync.

Evidence:
- `skill_snapshot/tests/docsContract.test.mjs:11-29` defines the required docs set and does not include any AGENTS document.
- `skill_snapshot/references/docs-governance.md:7-11` tracks `SKILL.md`, `reference.md`, `templates/qa-plan-template.md`, `references/qa-plan-contract.md`, and `evals/evals.json`, but no AGENTS doc.
- `skill_snapshot/references/script-driven-phase0-phase1-design.md:1-7` is only a placeholder; the explicit AGENTS sync rule appears only in the archived design at `skill_snapshot/docs/archive/SCRIPT_DRIVEN_PHASE0_PHASE1_DESIGN.md:88-90`.

Impact:
- The benchmark expectation "SKILL.md, README.md, reference.md, and AGENTS docs stay aligned" is not explicitly covered by the active documentation package.
- Because AGENTS sync is neither present nor checked, the package cannot demonstrate the required docs-phase contract.

### 2. Phase 0 ownership of support/request artifacts is inconsistent across `SKILL.md`, `reference.md`, and the runtime package

`SKILL.md` says Phase 0 writes support/request artifacts. `reference.md` omits those artifacts from Phase 0, moves `supporting_issue_request_<feature-id>.md` to Phase 1, and does not list `request_fulfillment_<feature-id>.md` or `.json` in Phase 0 at all. The scripts side with `SKILL.md`.

Evidence:
- `skill_snapshot/SKILL.md:83-88` lists Phase 0 outputs:
  - `context/supporting_issue_request_<feature-id>.md`
  - `context/request_fulfillment_<feature-id>.md`
  - `context/request_fulfillment_<feature-id>.json`
- `skill_snapshot/reference.md:142-155` lists only runtime setup files in Phase 0, then places `context/supporting_issue_request_<feature-id>.md` under Phase 1.
- `skill_snapshot/scripts/lib/runPhase.mjs:626-645` writes `supporting_issue_request_<feature-id>.md` and both `request_fulfillment` artifacts during Phase 0.
- `skill_snapshot/scripts/lib/workflowState.mjs:531-536` marks `req-support-only-mode` as a Phase 0 requirement backed by `context/supporting_issue_request_<feature-id>.md`.

Impact:
- The main docs do not agree on the current phase contract.
- This directly violates the docs-sync goal for `SKILL.md`, `README.md`, and `reference.md`.

### 3. Phase 7 artifact and archive behavior drift across `README.md`, `SKILL.md`, `reference.md`, and implementation

The docs disagree on what Phase 7 produces, and `reference.md` also disagrees with the implementation about where archived finals are stored.

Evidence:
- `skill_snapshot/README.md:15-23` advertises `developer_smoke_test_<feature-id>.md`.
- `skill_snapshot/SKILL.md:153-157` advertises `context/final_plan_summary_<feature-id>.md`.
- `skill_snapshot/reference.md:205-208` lists only `context/finalization_record_<feature-id>.md` and `qa_plan_final.md`.
- `skill_snapshot/scripts/lib/finalPlanSummary.mjs:202-205` writes both `context/final_plan_summary_<feature-id>.md` and `context/developer_smoke_test_<feature-id>.md`.
- `skill_snapshot/reference.md:21-34` says archived finals live under `archive/`, but `skill_snapshot/scripts/lib/runPhase.mjs:157-159` renames an existing final into the run root instead.

Impact:
- A reader cannot derive a single authoritative Phase 7 artifact contract from the docs set.
- The runtime/package map in `README.md`, `SKILL.md`, and `reference.md` is not aligned.

### 4. Docs governance is stale and still points at an obsolete contract file, which explains why the current drift is not caught

The governance doc still names a contract file that is no longer part of the active docs model.

Evidence:
- `skill_snapshot/references/docs-governance.md:7-11` says `references/qa-plan-contract.md` is the hard planning contract.
- The active docs/test contract instead centers on phase-scoped references plus `references/context-index-schema.md`; see `skill_snapshot/README.md:27-37` and `skill_snapshot/tests/docsContract.test.mjs:11-29`.

Impact:
- The stated freshness/update rule in `skill_snapshot/references/docs-governance.md:23-25` is under-specified for the current package.
- This weakens the package’s ability to keep docs synchronized as the phase model evolves.

## Expectation Assessment

- `[phase_contract][advisory] Case focus is explicitly covered: SKILL.md, README.md, reference.md, and AGENTS docs stay aligned`
  - Not met.
- `[phase_contract][advisory] Output aligns with primary phase docs`
  - Met for this review artifact, but the package under review contains docs-phase contract drift.

## Assumptions

- I treated the `skill_snapshot` package as the authoritative source of truth because the benchmark prompt says to use it as the authoritative workflow package.
- I used the current scripts as the tiebreaker when `SKILL.md`, `README.md`, and `reference.md` disagreed about runtime behavior.
- I treated the absence of any AGENTS doc in the authoritative package as a case failure, not as a mere fixture omission, because the benchmark focus explicitly requires AGENTS alignment.

## Minimal Remediation

- Add the authoritative AGENTS document(s) to the package, or add an active doc that names the canonical AGENTS paths, then extend `references/docs-governance.md` and `tests/docsContract.test.mjs` to enforce AGENTS sync.
- Reconcile Phase 0 artifact ownership across `SKILL.md`, `README.md`, and `reference.md` with `scripts/lib/runPhase.mjs` and `scripts/lib/workflowState.mjs`.
- Reconcile Phase 7 outputs and archive-path behavior across `README.md`, `SKILL.md`, `reference.md`, and `scripts/lib/finalPlanSummary.mjs`.
