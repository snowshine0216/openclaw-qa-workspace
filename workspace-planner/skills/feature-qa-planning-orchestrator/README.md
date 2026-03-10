# Feature QA Planning Orchestrator

Human-facing guide for the skill package. This file is intentionally short.

## Start Here

- Skill entrypoint: `SKILL.md`
- Runtime and artifact contract: `reference.md`
- Writer and reviewer rules: `references/*.md`
- Active design/governance docs: `docs/`
- Historical design docs: `docs/archive/`

## What This Skill Produces

- source evidence saved under `context/`
- `artifact_lookup_<feature-id>.md` under `context/`
- versioned phase-scoped draft QA plans under `drafts/` (`qa_plan_phase4a_r<round>.md`, `qa_plan_phase4b_r<round>.md`, `qa_plan_phase5a_r<round>.md`, `qa_plan_phase5b_r<round>.md`, `qa_plan_phase6_r<round>.md`)
- phase spawn manifests under the project root
- a promoted `qa_plan_final.md` only after user approval

## Active Contract Files

- `reference.md`
- `references/phase4a-contract.md`
- `references/phase4b-contract.md`
- `references/context-coverage-contract.md`
- `references/review-rubric-phase5a.md`
- `references/review-rubric-phase5b.md`
- `references/review-rubric-phase6.md`
- `references/context-index-schema.md`
- `references/e2e-coverage-rules.md`
- `docs/DOCS_GOVERNANCE.md`

## Phase-to-Reference Mapping

Each spawned subagent receives explicit instructions in its task text to read these files before starting.

| Phase   | References                                                                                                                       | Purpose                                                  |
| ------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Phase 1 | `reference.md`, `references/context-coverage-contract.md`                                                                          | Source routing, approved collection paths                |
| Phase 3 | `references/context-coverage-contract.md`, `references/context-index-schema.md`                                                   | Coverage ledger rules, artifact lookup structure         |
| Phase 4a | `references/phase4a-contract.md`                                                                                                  | Subcategory-only draft, atomic nested steps, few shots   |
| Phase 4b | `references/phase4b-contract.md`                                                                                                  | Canonical top-layer grouping and exception rules         |
| Phase 5a | `references/review-rubric-phase5a.md`                                                                                             | Full-context audit, section checklist, review refactor   |
| Phase 5b | `references/review-rubric-phase5b.md`                                                                                             | Shipment checkpoints, checkpoint audit, release verdict  |
| Phase 6 | `references/review-rubric-phase6.md`, `references/e2e-coverage-rules.md`                                                           | Final layering, few-shot cleanup, quality delta          |
