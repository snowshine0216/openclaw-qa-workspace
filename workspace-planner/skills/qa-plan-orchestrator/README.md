# Feature QA Planning Orchestrator

Human-facing guide for the skill package. This file is intentionally short.

## Start Here

- Skill entrypoint: `SKILL.md`
- Runtime and artifact contract: `reference.md`
- Writer and reviewer rules: `references/*.md`
- Long-form design docs: `docs/` (`docs/KNOWLEDGE_PACK_RUNTIME.md` is the canonical knowledge-pack runtime doc)
- Historical design docs: `docs/archive/`
- Benchmark execution contract: `benchmarks/qa-plan-v2/README.md` and `benchmarks/qa-plan-v2/scripts/lib/benchmarkSkillPaths.mjs`
- Artifact root convention: `docs/WORKSPACE_ARTIFACT_ROOT_CONVENTION.md`

## Benchmark Paths

- **Benchmark definition root:** `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/` (source-owned, versioned)
- **Benchmark archive root:** `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/archive/` (frozen baselines, versioned, read-only)
- **Benchmark runtime root:** `workspace-artifacts/skills/workspace-planner/qa-plan-orchestrator/benchmarks/qa-plan-v2/` (active iterations, gitignored)

Frozen baseline evidence lives under `archive/` and is read-only. Active benchmark iterations and snapshots live under the runtime root.

## What This Skill Produces

All runtime artifacts live under `workspace-artifacts/skills/workspace-planner/qa-plan-orchestrator/runs/<feature-id>/`:

- source evidence saved under `context/`
- support-only Jira relation maps and summaries saved under `context/`
- Tavily-first report-editor deep research artifacts, optional Confluence fallback artifacts, and a synthesis artifact saved under `context/`
- knowledge-pack summary and retrieval artifacts saved under `context/`
- machine-readable `coverage_ledger_<feature-id>.json` plus the migration-safe markdown ledger
- `request_fulfillment_<feature-id>.md` and `.json` under `context/`
- `artifact_lookup_<feature-id>.md` under `context/`
- versioned phase-scoped draft QA plans under `drafts/` (`qa_plan_phase4a_r<round>.md`, `qa_plan_phase4b_r<round>.md`, `qa_plan_phase5a_r<round>.md`, `qa_plan_phase5b_r<round>.md`, `qa_plan_phase6_r<round>.md`)
- `developer_smoke_test_<feature-id>.md` under `context/`, derived from P1 and `[ANALOG-GATE]` scenarios during Phase 7
- phase spawn manifests under the project root
- a promoted `qa_plan_final.md` only after user approval

**Artifact Root Convention**: Runtime state lives under `workspace-artifacts/` per the workspace artifact root convention documented in `docs/WORKSPACE_ARTIFACT_ROOT_CONVENTION.md`.

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

## qmd Runtime

- Knowledge-pack retrieval uses `@tobilu/qmd` as the BM25-first runtime index (in-process SDK; no qmd CLI required).
- Tested pinned version: `2.0.1`
- **No `qmd collection add` step** — the collection is created programmatically during Phase 3 from `context/knowledge_pack_projection/`. Run `npm install` in this package; the index is built automatically when a pack is active.
- Semantic augmentation is optional and controlled by `QA_PLAN_SEMANTIC_MODE`:
  - `disabled`
  - `qmd`
  - `openclaw_memory`
- Semantic failure never blocks the run. BM25 failure blocks Phase 3 when a pack is active.
