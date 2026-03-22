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
- support-only Jira relation maps and summaries saved under `context/`
- Tavily-first report-editor deep research artifacts, optional Confluence fallback artifacts, and a synthesis artifact saved under `context/`
- `request_fulfillment_<feature-id>.md` and `.json` under `context/`
- `artifact_lookup_<feature-id>.md` under `context/`
- versioned phase-scoped draft QA plans under `drafts/` (`qa_plan_phase4a_r<round>.md`, `qa_plan_phase4b_r<round>.md`, `qa_plan_phase5a_r<round>.md`, `qa_plan_phase5b_r<round>.md`, `qa_plan_phase6_r<round>.md`)
- `developer_smoke_test_<feature-id>.md` under `context/`, derived from P1 and `[ANALOG-GATE]` scenarios during Phase 7
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
- `knowledge-packs/` when a feature family has a mandatory pack
- `references/docs-governance.md`

## Phase-to-Reference Mapping

Each spawned subagent receives explicit instructions in its task text to read these files before starting.

| Phase   | References                                                                                                                       | Purpose                                                  |
| ------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Phase 1 | `reference.md`, `references/context-coverage-contract.md`                                                                          | Source routing, approved collection paths                |
| Phase 3 | `references/context-coverage-contract.md`, `references/context-index-schema.md`                                                   | Tavily-first deep research, coverage ledger rules, artifact lookup structure         |
| Phase 4a | `references/phase4a-contract.md`, `references/subagent-quick-checklist.md`                                                       | Subcategory-only draft, atomic nested steps, few shots   |
| Phase 4b | `references/phase4b-contract.md`, `references/subagent-quick-checklist.md`                                                       | Canonical top-layer grouping, bounded research, no few-shot cleanup |
| Phase 5a | `references/review-rubric-phase5a.md`, `references/subagent-quick-checklist.md`                                                  | Full-context audit, section checklist, rerun disposition |
| Phase 5b | `references/review-rubric-phase5b.md`, `references/subagent-quick-checklist.md`                                                  | Shipment checkpoints, checkpoint audit, release verdict, rerun disposition |
| Phase 6 | `references/review-rubric-phase6.md`, `references/e2e-coverage-rules.md`, `references/subagent-quick-checklist.md`                | Final layering, few-shot cleanup, quality delta          |

## Support And Research Guardrails

- Supporting issues remain `context_only_no_defect_analysis` evidence inputs. They are never defect-analysis triggers in this workflow.
- Report-editor deep research must record the `tavily-search` pass before any `confluence` fallback for the same topic.
- Every support or deep-research artifact that influences drafting must live under `context/` and appear in `artifact_lookup_<feature-id>.md`.
- When `knowledge-packs/report-editor/` is in scope, required capabilities, analog gates, SDK-visible contracts, and interaction pairs must map to scenarios, review gates, or explicit exclusions.
