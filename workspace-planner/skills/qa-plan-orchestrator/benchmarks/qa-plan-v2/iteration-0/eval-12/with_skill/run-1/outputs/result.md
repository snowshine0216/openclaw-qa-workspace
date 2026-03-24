# DOC-SYNC-001 Result

## Verdict

Advisory gap: the snapshot does not fully satisfy this docs-phase case.

## Summary

- The blind fixture copies of `README.md` and `reference.md` are identical to the authoritative snapshot versions, so there is no blind-fixture drift.
- `SKILL.md`, `README.md`, and `reference.md` are aligned on the current script-driven phase model and artifact naming.
- The case is still not explicitly satisfied because the active docs do not define or enforce AGENTS-doc sync, and the active governance doc still points at a removed contract file.

## Evidence

### 1. Blind fixture parity

- `inputs/fixtures/DOCS-blind-pre-defect-bundle/materials/README.md` and `skill_snapshot/README.md` have no diff.
- `inputs/fixtures/DOCS-blind-pre-defect-bundle/materials/reference.md` and `skill_snapshot/reference.md` have no diff.

### 2. Main entry docs are internally aligned on the current phase model

- `skill_snapshot/SKILL.md` documents the script-driven workflow with Phases 0, 1, 2, 3, 4a, 4b, 5a, 5b, 6, and 7, plus phase-scoped manifests and outputs.
- `skill_snapshot/README.md` advertises the same phase-scoped draft artifacts (`qa_plan_phase4a_r<round>.md` through `qa_plan_phase6_r<round>.md`) and phase-to-reference mapping.
- `skill_snapshot/reference.md` uses the same phase split, manifest names, round naming, and phase gates.

### 3. Active docs do not explicitly cover AGENTS sync

- `skill_snapshot/docs/DOCS_GOVERNANCE.md` defines freshness and ownership for `SKILL.md`, `reference.md`, `README.md`, `references/*.md`, and `docs/*.md`, but not AGENTS docs.
- `find -L skill_snapshot -iname 'AGENTS.md'` returned no files in the snapshot.
- `skill_snapshot/tests/docsContract.test.mjs` enforces `SKILL.md`, `README.md`, `reference.md`, `references/*.md`, and active docs, but it contains no AGENTS-sync assertion.
- AGENTS-sync requirements appear only in archived design material, not in the active docs contract. That means the benchmark focus is not explicitly covered by the active package.

### 4. The active governance doc is stale against the current contract split

- `skill_snapshot/docs/DOCS_GOVERNANCE.md` still lists `references/qa-plan-contract.md` as a live contract owner.
- The snapshot has no `skill_snapshot/references/qa-plan-contract.md`.
- The active contract is instead split across `phase4a-contract.md`, `phase4b-contract.md`, `review-rubric-phase5a.md`, `review-rubric-phase5b.md`, `review-rubric-phase6.md`, `context-coverage-contract.md`, `context-index-schema.md`, `e2e-coverage-rules.md`, and `subagent-quick-checklist.md`.

## Assessment Against Expectations

- `[phase_contract][advisory] Case focus is explicitly covered: SKILL.md, README.md, reference.md, and AGENTS docs stay aligned`
  Result: Not met. The active package does not explicitly define or test AGENTS-doc alignment.
- `[phase_contract][advisory] Output aligns with primary phase docs`
  Result: Met. The reviewed entry docs are internally aligned on the current script-driven phase model.

## Minimal Remediation

- Update `docs/DOCS_GOVERNANCE.md` to replace the stale `references/qa-plan-contract.md` pointer with the current phase-specific contract set.
- Add an explicit active-doc rule naming the AGENTS doc or docs that must stay aligned with `SKILL.md`, `README.md`, and `reference.md`.
- Extend the docs contract test surface to assert that AGENTS-sync rule.
