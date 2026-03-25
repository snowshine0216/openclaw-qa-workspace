# QA Plan Orchestrator Knowledge Pack Runtime

> Status: current implementation
> Canonical owner for: knowledge-pack runtime resolution, summary, retrieval, and coverage-ledger behavior in `workspace-planner/skills/qa-plan-orchestrator`
> Last verified against code: 2026-03-25

## Purpose

This document is the single active long-form reference for how knowledge packs work at runtime in `qa-plan-orchestrator`.

Use this file for:

- Phase 0 and Phase 3 runtime behavior
- knowledge-pack state fields and derived artifacts
- qmd/BM25 retrieval behavior
- null-pack fallback behavior
- current implementation limits

Do not use archived versioned design docs as active guidance.

## Current Runtime Flow

### Phase 0

Phase 0 resolves one active knowledge pack for the run through the shared resolver path:

- explicit `requested_knowledge_pack_key`
- `feature_family`
- benchmark case lookup by `feature_id`
- fallback `general`

Resolver behavior today:

- an explicitly requested missing pack blocks the run
- an inferred missing pack falls back to `general`
- if no pack can be loaded, the run continues in `null_pack` mode

The runtime then:

1. writes canonical pack metadata onto `task.json`
2. merges pack-declared deep-research topics through the normal request model
3. writes `knowledge_pack_summary_<feature-id>.md/.json`
4. records `knowledge_pack_loaded_at` only when a real pack was loaded

### Phase 3

Phase 3 re-resolves the pack, rewrites the summary artifact, and then:

- clears stale retrieval/index artifacts when the run is in `null_pack` mode
- writes an empty `coverage_ledger_<feature-id>.md/.json` when no pack is active
- projects normalized pack rows into `context/knowledge_pack_projection/*.md`
- builds `context/knowledge_pack_qmd.sqlite`
- runs qmd lexical search across collected query inputs
- writes `knowledge_pack_retrieval_<feature-id>.md/.json`
- writes `coverage_ledger_<feature-id>.md/.json`

If qmd BM25 retrieval fails while a pack is active, Phase 3 blocks.

## Canonical State Fields

### `task.json`

The active task model owns these knowledge-pack fields:

- `knowledge_pack_key`
- `requested_knowledge_pack_key`
- `resolved_knowledge_pack_key`
- `knowledge_pack_resolution_source`
- `knowledge_pack_version`
- `knowledge_pack_path`
- `knowledge_pack_row_count`
- `knowledge_pack_deep_research_topics`

`knowledge_pack_key` is the canonical active key used by downstream planner code.

### `run.json`

The runtime status model owns these derived fields:

- `knowledge_pack_loaded_at`
- `knowledge_pack_summary_generated_at`
- `knowledge_pack_retrieval_generated_at`
- `knowledge_pack_retrieval_mode`
- `knowledge_pack_semantic_mode`
- `knowledge_pack_semantic_warning`
- `knowledge_pack_summary_artifact`
- `knowledge_pack_retrieval_artifact`
- `knowledge_pack_index_artifact`

## Pack Loading And Normalization

`scripts/lib/knowledgePackLoader.mjs` loads `knowledge-packs/<key>/pack.json` and enforces:

- `pack_key` is required
- `version` is required
- optional content families normalize to empty arrays
- `deep_research_topics` must stay within the current allowlist

The current allowed pack-declared deep-research topics are:

- `report_editor_workstation_functionality`
- `report_editor_library_vs_workstation_gap`

Pack content is normalized into retrieval rows before Phase 3 indexing. The runtime currently supports rows derived from:

- `required_capabilities`
- `required_outcomes`
- `state_transitions`
- `analog_gates`
- `sdk_visible_contracts`
- `interaction_pairs`
- `interaction_matrices`
- `anti_patterns`
- `evidence_refs`

## Retrieval Behavior

`scripts/lib/knowledgePackRetrieval.mjs` is the current runtime implementation.

What it does today:

- uses `@tobilu/qmd` in-process
- writes one markdown projection file per normalized row
- builds a qmd SQLite index under `context/knowledge_pack_qmd.sqlite`
- runs lexical search only
- keeps the best BM25 hit per row across all query inputs
- emits every normalized row into the ledger, with unmatched rows left as `unmapped`

Current query input sources:

- `jira_issue_<feature-id>.md`
- `jira_related_issues_<feature-id>.md`
- `confluence_design_<feature-id>.md`
- `supporting_issue_summary_*.md`
- `deep_research_synthesis_report_editor_<feature-id>.md`
- request requirements and request materials carried in `task.json`

### Semantic Modes

The runtime accepts `QA_PLAN_SEMANTIC_MODE` values:

- `disabled`
- `qmd`
- `openclaw_memory`

Current implementation detail:

- both non-`disabled` modes only record warnings and fall back to BM25-only behavior
- no semantic augmentation path is actually executed in `knowledgePackRetrieval.mjs` yet
- semantic failure never blocks the run

`knowledge_pack_retrieval_mode` therefore currently resolves to:

- `disabled` for null-pack runs
- `bm25_only` for active-pack runs

## Derived Artifacts

### Always written for Phase 0

- `context/knowledge_pack_summary_<feature-id>.md`
- `context/knowledge_pack_summary_<feature-id>.json`

For `null_pack` runs, the summary still exists and records the mode as `null_pack`.

### Written for active-pack Phase 3 runs

- `context/knowledge_pack_retrieval_<feature-id>.md`
- `context/knowledge_pack_retrieval_<feature-id>.json`
- `context/coverage_ledger_<feature-id>.md`
- `context/coverage_ledger_<feature-id>.json`
- `context/knowledge_pack_qmd.sqlite`
- `context/knowledge_pack_projection/`

### Phase 3 null-pack cleanup

When a rerun no longer has an active pack, the runtime removes stale:

- retrieval markdown/json
- qmd sqlite, shm, wal files
- `knowledge_pack_projection/`

It then rewrites an empty coverage ledger.

## Coverage And Review Contract

Knowledge-pack retrieval rows become coverage candidates that later phases must preserve, map, gate, or exclude explicitly.

Important downstream behavior already enforced in code and contract docs:

- Phase 5a rejects `accept` while required pack-backed rows remain `unmapped`
- required analog-gate rows stay traceable in the ledger
- Phase 4 and Phase 6 contracts require pack-backed traceability to survive regrouping and cleanup

This document does not replace the normative contract files. For exact reviewer rules, use:

- `reference.md`
- `references/context-coverage-contract.md`
- `references/context-index-schema.md`
- `references/phase4a-contract.md`
- `references/phase4b-contract.md`
- `references/review-rubric-phase5a.md`
- `references/review-rubric-phase5b.md`
- `references/review-rubric-phase6.md`

## Source Files

Current implementation lives in:

- `scripts/lib/workflowState.mjs`
- `scripts/lib/runPhase.mjs`
- `scripts/lib/knowledgePackLoader.mjs`
- `scripts/lib/knowledgePackRowNormalizer.mjs`
- `scripts/lib/knowledgePackSummarizer.mjs`
- `scripts/lib/knowledgePackRetrieval.mjs`
- `scripts/lib/coverageLedger.mjs`
- `scripts/lib/spawnManifestBuilders.mjs`

Regression coverage lives in:

- `scripts/test/phase0.test.sh`
- `scripts/test/phase3.test.sh`
- `scripts/test/knowledgePackLoader.test.mjs`
- `scripts/test/knowledgePackSummarizer.test.mjs`
- `scripts/test/knowledgePackRowNormalizer.test.mjs`
- `scripts/test/knowledgePackRetrieval.test.mjs`
- `scripts/test/coverageLedger.test.mjs`

## Documentation Ownership

This file supersedes the older split between versioned design proposals and a separate implementation-status note for the same topic.

Archived predecessors:

- `docs/archive/KNOWLEDGE_PACK_RUNTIME_LEVERAGE_DESIGN.md`
- `docs/archive/KNOWLEDGE_PACK_RUNTIME_LEVERAGE_DESIGN_V2.md`
- `docs/archive/KNOWLEDGE_PACK_V2_IMPLEMENTATION_STATUS.md`
