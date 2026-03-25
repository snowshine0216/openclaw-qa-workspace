# QA Plan Orchestrator — Runtime Knowledge Pack Leverage Design V2

> **Design ID:** `qa-plan-orchestrator-knowledge-pack-runtime-v2-2026-03-23`
> **Date:** 2026-03-23
> **Status:** Draft v2
> **Scope:** `workspace-planner/skills/qa-plan-orchestrator`
> **Decision:** Preserve `qmd`-based retrieval, but make BM25 the deterministic baseline and keep current planner contracts migration-compatible.

---

## Overview

`qa-plan-orchestrator` already has knowledge-pack-aware review rules, but runtime leverage is still weak:

- the active pack is not a first-class runtime field in the planner
- no Phase 0 artifact summarizes the pack for downstream phases
- Phase 3 does not retrieve against pack rows
- later phases require pack-backed coverage, but the runtime does not generate a machine-traceable mapping artifact that proves that coverage

V2 closes that gap without replacing the current script-driven phase model. The core change is localized:

1. resolve the active pack once in Phase 0
2. summarize it into explicit runtime artifacts
3. normalize pack content into retrievable rows
4. use `qmd` BM25 as the required retrieval engine when a pack is active
5. optionally augment retrieval semantically, but never make semantic success a gate
6. feed pack-backed matches into coverage mapping, review, and release gating

This is not a redesign of the planner. It is a runtime-leverage upgrade for the existing planner.

## Why V2

V1 would keep all matching logic as hand-written direct rules. That is simpler, but it will underperform on real pack content because:

- exact issue IDs, SDK contract names, and interaction-pair wording are better handled by indexed search than by ad hoc string checks
- heterogeneous pack content benefits from a normalized retrieval corpus
- future packs will add more rows faster than direct-rule matching can stay maintainable

V2 keeps the deterministic runtime contract from V1, but upgrades Phase 3 retrieval to indexed search:

- `qmd` BM25 is the required baseline
- semantic search is optional
- acceptance gates still depend on explicit mapping artifacts, not on opaque ranking

## Goals

1. Resolve a single active knowledge pack per run and persist it in runtime state.
2. Keep one canonical runtime field model that is compatible with existing benchmark and pack-aware planner terminology.
3. Introduce explicit pack summary and retrieval artifacts under `context/`.
4. Keep `coverage_ledger_<feature-id>.md` as a required contract artifact while adding structured companion JSON.
5. Preserve current report-editor deep-research contracts during migration rather than breaking validators mid-flight.
6. Make later phases prove that retrieved pack-backed obligations became scenarios, gates, or explicit exclusions.

## Non-Goals

1. Do not replace the current phase shell wrappers. Phase entrypoints remain `phaseN.sh` delegating to `runPhase.mjs`.
2. Do not require an external vector database.
3. Do not require semantic search for a run to pass.
4. Do not introduce freeform deep-research topic generation that current validators cannot understand.

## Current Baseline And Constraints

The current planner already assumes pack-backed coverage in these places:

- [phase4a-contract.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/references/phase4a-contract.md)
- [review-rubric-phase5a.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase5a.md)
- [review-rubric-phase5b.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase5b.md)
- [README.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/README.md)

The current runtime also hardcodes report-editor deep-research topic handling in:

- [workflowState.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/scripts/lib/workflowState.mjs)
- [qaPlanValidators.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/scripts/lib/qaPlanValidators.mjs)
- [runPhase.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/scripts/lib/runPhase.mjs)

V2 must therefore be additive and migration-safe:

- keep existing topic slugs valid
- keep the current `coverage_ledger_<feature-id>.md` artifact alive
- add structured companions and pack-aware state without removing contract artifacts prematurely

## Canonical Runtime Model

### Goal

Use one field vocabulary everywhere. The planner should not alternate between "resolved pack key" in one file and "knowledge pack key" in another without defining which is canonical.

### `task.json`

Add or preserve these fields in `defaultTask()`:

```json
{
  "feature_family": null,
  "knowledge_pack_key": null,
  "requested_knowledge_pack_key": null,
  "resolved_knowledge_pack_key": null,
  "knowledge_pack_resolution_source": null,
  "knowledge_pack_version": null,
  "knowledge_pack_path": null,
  "knowledge_pack_row_count": 0,
  "knowledge_pack_deep_research_topics": []
}
```

Field rules:

- `knowledge_pack_key` is the canonical active key used by downstream planner code.
- `requested_knowledge_pack_key` is raw user/runtime input before resolution.
- `resolved_knowledge_pack_key` must equal `knowledge_pack_key` after Phase 0 succeeds.
- `knowledge_pack_resolution_source` records `provided`, `feature_family`, `cases_lookup`, `default_general`, or `null_pack`.
- `knowledge_pack_deep_research_topics` is the deterministic list of planner topic slugs derived from the pack after validation.

### `run.json`

Add these fields in `defaultRun()`:

```json
{
  "knowledge_pack_loaded_at": null,
  "knowledge_pack_summary_generated_at": null,
  "knowledge_pack_retrieval_generated_at": null,
  "knowledge_pack_retrieval_mode": null,
  "knowledge_pack_semantic_mode": "disabled",
  "knowledge_pack_semantic_warning": null,
  "knowledge_pack_summary_artifact": null,
  "knowledge_pack_retrieval_artifact": null,
  "knowledge_pack_index_artifact": null
}
```

Field rules:

- `knowledge_pack_retrieval_mode` is `disabled`, `bm25_only`, or `bm25_plus_semantic`.
- `knowledge_pack_semantic_mode` is `disabled`, `qmd`, or `openclaw_memory`.
- `knowledge_pack_index_artifact` points to `context/knowledge_pack_qmd.sqlite` when a pack is active.

## Pack Schema Contract

### Existing Pack Fields

The existing pack schema already contains these top-level families:

- `required_capabilities`
- `required_outcomes`
- `state_transitions`
- `analog_gates`
- `sdk_visible_contracts`
- `interaction_pairs`
- `interaction_matrices`
- `anti_patterns`
- `evidence_refs`

### V2 Additive Fields

Add these optional fields to pack schema:

```json
{
  "deep_research_topics": [],
  "retrieval_notes": []
}
```

Rules:

- `deep_research_topics` is a list of planner topic slugs already understood by current runtime contracts.
- For the current planner, valid values are the existing report-editor slugs:
  - `report_editor_workstation_functionality`
  - `report_editor_library_vs_workstation_gap`
- `retrieval_notes` is freeform operator guidance only. It does not affect gating.

Why this is necessary:

- deriving arbitrary topic names from `evidence_refs.topic` would break current validators
- explicit topic slugs in the pack keep runtime behavior deterministic and migration-safe

### Pack Validation Policy

`knowledgePackLoader.mjs` must:

1. hard-fail on invalid JSON, missing `pack_key`, or missing `version`
2. hard-fail when an explicitly requested pack is missing
3. warn, not fail, when optional content families are absent
4. normalize absent optional arrays to `[]`
5. validate `deep_research_topics` against the currently supported topic slug allowlist

## Active Pack Resolution

Reuse the shared resolver:

- [.agents/skills/qa-plan-evolution/scripts/lib/knowledgePackResolver.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/qa-plan-evolution/scripts/lib/knowledgePackResolver.mjs)

Resolution precedence:

1. `requested_knowledge_pack_key`
2. `feature_family`
3. benchmark case lookup by `feature_id`
4. `general`

Post-resolution rules:

- if the key resolves and the pack file exists, load it and persist all pack metadata
- if the key was explicitly requested and the file does not exist, Phase 0 blocks
- if the key was inferred and the file does not exist:
  - try `general`
  - if `general` also does not exist, continue in `null_pack` mode and record a warning in runtime setup

## Retrieval Architecture

### Retrieval Design Summary

When a pack is active:

1. Phase 0 loads and summarizes the pack
2. Phase 3 normalizes the pack into retrieval rows
3. Phase 3 projects those rows into a qmd corpus
4. Phase 3 runs BM25 retrieval against gathered planner evidence
5. Phase 3 optionally augments with semantic retrieval
6. Phase 3 writes retrieval artifacts and coverage-ledger artifacts

When no pack is active:

- the planner skips qmd retrieval entirely
- Phase 3 still writes the standard coverage ledger

### Why BM25 Is The Baseline

The pack contains many exact-match signals:

- Jira IDs like `BCIN-7730`
- SDK contracts like `setWindowTitle`
- specific behavior labels like `save-as-overwrite`
- interaction-pair names

BM25 is the right mandatory baseline for these inputs. Semantic search is useful only as a secondary recall booster.

### Semantic Mode Policy

Use one explicit environment variable:

| Variable | Values | Default | Meaning |
|---|---|---|---|
| `QA_PLAN_SEMANTIC_MODE` | `disabled` / `qmd` / `openclaw_memory` | `disabled` | Optional semantic augmentation mode |

Rules:

- `disabled`: BM25 only
- `qmd`: use qmd vector query only if embeddings exist locally; otherwise warn and fall back to BM25 only
- `openclaw_memory`: only valid when `OPENCLAW_SESSION=1`; otherwise warn and fall back to BM25 only

Important:

- semantic failure never blocks the run
- qmd BM25 failure does block the run when a pack is active

### qmd Runtime Contract

Add `@tobilu/qmd` to [package.json](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/package.json), but do not use `"latest"`.

Implementation rule:

- pin an exact tested version during implementation
- check in the resulting lockfile change
- document the tested version in README

The planner uses qmd in-process from Node.js. The intended shape is:

```js
import { join } from 'node:path';
import { createStore } from '@tobilu/qmd';

const projectedDir = join(runDir, 'context', 'knowledge_pack_projection');
const store = await createStore({
  dbPath: join(runDir, 'context', 'knowledge_pack_qmd.sqlite'),
  config: {
    collections: {
      pack: { path: projectedDir, pattern: '*.md' },
    },
  },
});

await store.update();
const results = await store.searchLex(queryText, { limit: 20 });
await store.close();
```

Implementation note: the qmd SDK may expose `searchLex`, `search`, or `structuredSearch` for BM25. Verify against the installed qmd version and use the appropriate API; the runtime contract is BM25-first retrieval, not a specific method name.

If the exact SDK surface differs, the implementation must adjust the helper module but keep the runtime contract described here.

## Normalized Retrieval Row Model

The pack schema is heterogeneous. V2 therefore introduces a normalized row model before indexing.

### Row Shape

Every normalized row must have:

```json
{
  "row_id": "outcome:outcome-window-title",
  "row_type": "required_outcome",
  "pack_key": "report-editor",
  "pack_version": "2026-03-23",
  "title": "window title correctness",
  "keywords": ["window title correctness", "setWindowTitle"],
  "search_text": "window title correctness setWindowTitle window title reflects current report context",
  "source_issue_refs": [],
  "declared_in": ["required_outcomes"],
  "required_gate": false,
  "status": "unmapped"
}
```

### Normalization Rules

| Pack source | Row type | `row_id` rule | `title` rule |
|---|---|---|---|
| `required_capabilities[]` string | `required_capability` | `capability:<slug>` | original string |
| `required_outcomes[]` object | `required_outcome` | `outcome:<id>` | `keywords?.[0]` or `id` or `observable_outcome` |
| `state_transitions[]` object | `state_transition` | `transition:<id>` | `<from> -> <to>` |
| `analog_gates[]` object | `analog_gate` | `analog:<source_issue>` | `behavior` |
| `sdk_visible_contracts[]` string | `sdk_visible_contract` | `sdk:<slug>` | original string |
| `interaction_pairs[]` pair | `interaction_pair` | `interaction:<a>__<b>` | `<a> <-> <b>` |
| `interaction_matrices[].pairs[]` pair | `interaction_pair` | same canonical pair rule | same canonical pair rule |
| `anti_patterns[]` string | `anti_pattern` | `anti_pattern:<slug>` | original string |
| `evidence_refs[]` object | `evidence_ref` | `evidence_ref:<type>:<id>` | `topic` or `id` |

### Slug Normalization Rule

For `row_id` prefixes that require a `<slug>` from a free-form string (e.g. `required_capabilities`, `sdk_visible_contracts`, `anti_patterns`):

```
slug = original.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
```

Examples: `"template-based creation"` → `capability:template-based-creation`; `"setWindowTitle"` → `sdk:setwindowtitle`.

### Dedupe Rules

1. direct `interaction_pairs` and matrix-expanded pairs normalize to the same canonical pair ID
2. canonical pair ordering is lexical after trim/lowercase normalization
3. deduped rows must retain provenance in `declared_in`

### Retrieval Projection

Each normalized row becomes one projected markdown file under:

```text
<run-dir>/context/knowledge_pack_projection/
```

Example file:

```md
# Row: outcome:outcome-window-title

- row_type: required_outcome
- pack_key: report-editor
- pack_version: 2026-03-23
- title: window title correctness
- keywords: window title correctness, setWindowTitle
- source_issue_refs: none

window title correctness
setWindowTitle
window title reflects current report context
```

The qmd corpus indexes the projection directory, not the raw `pack.json`.

## Deep Research Topic Handling

This is where the previous design was underspecified. V2 makes it explicit.

### Rules

1. `DEFAULT_DEEP_RESEARCH_TOPICS` remains `[]`.
2. Regex-based auto-injection in `parseRawRequestText()` is removed.
3. The only automatic topic derivation allowed in V2 is:
   - read `deep_research_topics` from the resolved pack
   - merge with explicit task topics
   - normalize and dedupe
4. `evidence_refs` are retrieval/query inputs, not topic slugs.

### Why

This preserves compatibility with existing report-editor validators while still allowing packs to inject known topic obligations deterministically.

## Artifact Contract

### Phase 0 Artifacts

- `context/runtime_setup_<feature-id>.md`
- `context/runtime_setup_<feature-id>.json`
- `context/knowledge_pack_summary_<feature-id>.md`
- `context/knowledge_pack_summary_<feature-id>.json`

### Phase 3 Artifacts

- `context/knowledge_pack_retrieval_<feature-id>.md`
- `context/knowledge_pack_retrieval_<feature-id>.json`
- `context/coverage_ledger_<feature-id>.md`
- `context/coverage_ledger_<feature-id>.json`
- `context/knowledge_pack_qmd.sqlite`

### Artifact Ownership

- `knowledge_pack_summary_*` is Phase 0 output
- `knowledge_pack_retrieval_*` and `coverage_ledger_*.json` are Phase 3 output
- `coverage_ledger_<feature-id>.md` remains the required compatibility artifact used by existing contracts

### Coverage Ledger JSON Schema

The `coverage_ledger_<feature-id>.json` structure:

```json
{
  "feature_id": "BCIN-7289",
  "generated_at": "<iso>",
  "knowledge_pack_key": "report-editor",
  "knowledge_pack_version": "2026-03-23",
  "candidates": [
    {
      "knowledge_pack_row_id": "outcome:outcome-window-title",
      "row_type": "required_outcome",
      "title": "window title correctness",
      "status": "unmapped",
      "match_method": "bm25",
      "query_source": "jira_summary",
      "score": 14.2
    }
  ]
}
```

- `knowledge_pack_row_id` is the same value as `row_id` from the normalized retrieval row; the ledger uses this field name for mapping traceability.
- Allowed `status`: `unmapped`, `scenario_mapped`, `gate_mapped`, `explicitly_excluded`.

### Coverage Ledger Migration Rule

V2 uses this rule:

- JSON is the structured generator source for pack-aware mapping data
- Markdown remains the required contract rendering during migration

That avoids breaking current validation logic while still giving machine-readable state to new validators.

## Phase-By-Phase Design

### Phase 0 — Resolve And Summarize

### Goal

Make the active pack explicit in runtime state and produce a stable summary artifact every later phase can consume.

### Required Changes

- call shared pack resolver from `runPhase.mjs`
- load `knowledge-packs/<key>/pack.json`
- validate and normalize the pack
- write summary artifacts
- merge pack-declared `deep_research_topics` into task state
- persist task/run state

### Required Runtime Effects

On success:

- `task.knowledge_pack_key` is final for the run
- `task.resolved_knowledge_pack_key` equals `task.knowledge_pack_key`
- `run.knowledge_pack_loaded_at` is set
- `run.knowledge_pack_summary_generated_at` is set

On failure:

- explicit missing pack blocks Phase 0
- inferred missing pack attempts `general`
- unresolved fallback enters `null_pack` mode and records a warning

### Phase 1 — Evidence Gathering

### Goal

Do not retrieve yet, but expose the active pack summary to spawned evidence workers.

### Required Changes

- add pack identity and summary path to Phase 1 `source` blocks
- add a short pack-awareness note to worker tasks
- do not ask Phase 1 workers to read raw `pack.json`

### Required Output Changes

None beyond manifest/source metadata.

### Phase 2 — Artifact Index

### Goal

Make summary artifacts visible to downstream phases through the artifact lookup.

### Required Changes

- add `knowledge_pack_summary_*` detection rules to `artifactLookup.mjs`
- classify these as workflow/context artifacts, not primary evidence
- keep request-artifact validation behavior unchanged

### Artifact Lookup Rows

Add detection rules for these path patterns. Phase 2 runs before Phase 3, so at Phase 2 time only `knowledge_pack_summary_*` exists; retrieval and ledger rules enable downstream phases (4a onward) to resolve those artifacts after Phase 3 creates them.

- `context/knowledge_pack_summary_<feature-id>.md`
- `context/knowledge_pack_summary_<feature-id>.json`
- `context/knowledge_pack_retrieval_<feature-id>.md`
- `context/knowledge_pack_retrieval_<feature-id>.json`
- `context/coverage_ledger_<feature-id>.md`
- `context/coverage_ledger_<feature-id>.json`

### Phase 3 — Retrieve And Seed Coverage

### Goal

Generate explicit pack-backed candidate matches using `qmd` BM25 and write retrieval + coverage artifacts.

### Required Changes

- normalize pack rows
- project pack rows into markdown
- build/update qmd index
- collect query inputs from existing context artifacts
- run BM25 retrieval
- optionally run semantic augmentation
- write retrieval artifacts
- render both ledger JSON and ledger markdown

### Query Sources

Query inputs must be built from available artifacts, in this order:

1. Jira primary issue summary and description
2. Jira related issues
3. Confluence design
4. support-only issue summaries
5. deep research synthesis
6. request requirements and materials

### Retrieval Output Contract

Every matched row must record:

- `row_id`
- `row_type`
- `match_method`
- `query_source`
- `score`
- `status`

Allowed `status` values:

- `unmapped`
- `scenario_mapped`
- `gate_mapped`
- `explicitly_excluded`

### Failure Policy

- if pack is active and qmd BM25 fails, Phase 3 blocks
- if semantic augmentation fails, continue with BM25 and record a warning
- if no pack is active, skip pack retrieval and write the standard coverage ledger only

### Phase 4a — Draft Mapping

### Goal

Require the first draftable mapping from retrieved pack rows into scenarios, gates, or explicit exclusions.

### Required Changes

- update the Phase 4a contract so every required pack-backed row category is traceable
- require ledger mapping rows to carry `knowledge_pack_row_id` when the row is pack-backed (this field holds the same value as the retrieval `row_id`)
- allow explicit exclusions only with evidence

### Required Coverage Types

The planner must account for:

- required capabilities
- required outcomes
- state transitions
- interaction pairs
- analog gates
- SDK-visible contracts

### Phase 4b — Preserve Through Grouping

### Goal

Prevent top-layer grouping from silently erasing pack-backed scenario chains.

### Required Changes

- extend coverage-preservation checks to pack-backed scenario IDs
- update the Phase 4b contract to forbid silent drop of pack-backed nodes

### Phase 5a — Audit Pack Coverage

### Goal

Make `Knowledge Pack Coverage Audit` and `Cross-Section Interaction Audit` machine-traceable against actual retrieved row IDs.

### Required Changes

- extend validator and rubric language to require pack-row traceability
- update acceptance gate logic in `qaPlanValidators.mjs`
- pass pack-aware context into `validatePhase5aAcceptanceGate()`

### Gate Rules

`accept` is forbidden when any required pack-backed row remains `unmapped`, including:

- required capabilities
- interaction pairs
- state transitions

### Phase 5b — Release Gating

### Goal

Tie `[ANALOG-GATE]` release entries to retrieved analog rows rather than treating analog coverage as free text.

### Required Changes

- require checkpoint audit to reference analog row IDs
- require release recommendation to enumerate unresolved blocking analog rows before ship

### Phase 6 — Final Cleanup

### Goal

Allow wording and layering cleanup without collapsing distinct pack-backed scenarios.

### Required Changes

- add pack-backed preservation requirements to Phase 6 quality delta language
- update validators to require explicit preservation notes when pack-backed scenarios are involved

### Phase 7 — Finalization

### Goal

Optionally derive developer smoke follow-up from unresolved high-risk pack-backed rows.

### Required Changes

- do not block finalization on developer smoke generation
- allow Phase 7 to summarize unresolved analog gates and critical P1 pack-backed scenarios into developer smoke guidance

## Spawn Manifest Changes

Update `spawnManifestBuilders.mjs` so each request `source` block can carry:

```json
{
  "knowledge_pack_key": "report-editor",
  "knowledge_pack_version": "2026-03-23",
  "knowledge_pack_summary_path": "context/knowledge_pack_summary_BCIN-7289.md",
  "knowledge_pack_retrieval_path": "context/knowledge_pack_retrieval_BCIN-7289.md",
  "knowledge_pack_active": true
}
```

Rules:

- Phase 1 gets `knowledge_pack_summary_path`
- Phase 3 gets both summary and retrieval destination paths
- Phases 4a through 6 get retrieval path and pack-active flag

## Implementation Files

### New Files

Under `scripts/lib/`:

- `knowledgePackLoader.mjs`
- `knowledgePackSummarizer.mjs`
- `knowledgePackRowNormalizer.mjs`
- `knowledgePackRetrieval.mjs`
- `coverageLedger.mjs`

Under `scripts/test/`:

- `knowledgePackLoader.test.mjs`
- `knowledgePackRowNormalizer.test.mjs`
- `knowledgePackRetrieval.test.mjs`
- `knowledgePackSummarizer.test.mjs`
- `coverageLedger.test.mjs`

### Changed Runtime Files

- [scripts/lib/workflowState.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/scripts/lib/workflowState.mjs)
  - add canonical pack fields
  - remove regex-based topic injection
  - merge pack-declared topic slugs
- [scripts/lib/runPhase.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/scripts/lib/runPhase.mjs)
  - Phase 0 resolve/load/summarize
  - Phase 3 retrieve/render ledger
  - Phase 5a/5b/6 pack-aware validation wiring
- [scripts/lib/spawnManifestBuilders.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/scripts/lib/spawnManifestBuilders.mjs)
  - include pack metadata in source blocks
  - add pack-aware task instructions
- [scripts/lib/qaPlanValidators.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/scripts/lib/qaPlanValidators.mjs)
  - validate pack-aware coverage ledger content
  - validate pack-aware Phase 5a acceptance
  - validate pack-aware Phase 6 preservation notes
- [scripts/lib/artifactLookup.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/scripts/lib/artifactLookup.mjs)
  - detect new pack artifacts
- [scripts/lib/applyUserChoice.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/scripts/lib/applyUserChoice.mjs)
  - delete new pack artifacts on smart refresh
  - remove qmd sqlite and sidecar files
- [package.json](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/package.json)
  - add pinned qmd dependency

### Changed Contract Docs

- [reference.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/reference.md)
  - add task/run fields
  - add new artifact families
- [README.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/README.md)
  - add qmd runtime section
  - document semantic mode policy and tested dependency version
- [references/context-coverage-contract.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/references/context-coverage-contract.md)
  - mention pack summary/retrieval artifacts
  - mention pack-backed candidate obligations
- [references/context-index-schema.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/references/context-index-schema.md)
  - add pack-backed candidate and retrieval metadata guidance
- [references/phase4a-contract.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/references/phase4a-contract.md)
  - require row-level pack mapping
- [references/review-rubric-phase5a.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase5a.md)
  - require traceability to pack row IDs
- [references/review-rubric-phase5b.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase5b.md)
  - require analog gate row mapping
- [references/review-rubric-phase6.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase6.md)
  - require preservation statements for pack-backed scenarios

## Cleanup And Refresh Rules

`applyUserChoice.mjs` must delete these on `smart_refresh` (in addition to the existing Phase 2+ artifacts already cleared by `clearPhase2PlusContextArtifacts`, which includes `coverage_ledger_<feature-id>.md`):

- `context/knowledge_pack_summary_<feature-id>.md`
- `context/knowledge_pack_summary_<feature-id>.json`
- `context/knowledge_pack_retrieval_<feature-id>.md`
- `context/knowledge_pack_retrieval_<feature-id>.json`
- `context/coverage_ledger_<feature-id>.md`
- `context/coverage_ledger_<feature-id>.json`
- `context/knowledge_pack_qmd.sqlite`
- `context/knowledge_pack_qmd.sqlite-shm`
- `context/knowledge_pack_qmd.sqlite-wal`
- `context/knowledge_pack_projection/`

Rationale:

- smart refresh keeps Phase 1 evidence
- pack summary and retrieval outputs are Phase 0/3 derived artifacts and must be regenerated

## Testing Plan

## Unit Tests

### Loader

- explicit requested pack resolves and loads
- inferred pack falls back to `general`
- missing explicit pack blocks
- missing inferred pack enters `null_pack` mode when `general` is absent
- invalid `deep_research_topics` values are rejected or warned according to policy

### Row Normalizer

- string arrays become canonical row IDs via slug normalization
- slug normalization produces deterministic `row_id` for arbitrary strings (e.g. `"template-based creation"` → `capability:template-based-creation`)
- outcome and transition objects preserve IDs
- interaction pairs dedupe correctly across direct and matrix declarations
- evidence refs preserve source IDs and topic text

### Retrieval

- BM25 hits exact issue IDs
- BM25 hits SDK-visible contracts
- BM25 hits interaction-pair terms
- stable retrieval results for same input and pack version
- semantic mode fallbacks record warnings and preserve BM25 output

### Ledger Rendering

- JSON ledger conforms to coverage ledger schema (`feature_id`, `candidates`, `knowledge_pack_row_id`, `status`)
- JSON ledger renders markdown ledger with matching candidate rows
- pack-backed candidate rows preserve row IDs (as `knowledge_pack_row_id`) and statuses

## Integration Tests

### Phase 0

- writes summary artifacts
- persists canonical pack fields into task/run state
- merges pack-declared deep-research topics

### Phase 2

- artifact lookup indexes pack summary artifacts

### Phase 3

- writes retrieval artifacts
- writes coverage ledger JSON and markdown
- blocks when qmd BM25 fails for an active pack
- skips retrieval cleanly in null-pack mode

### Phase 4a

- rejects drafts that omit required pack-backed mappings

### Phase 5a

- rejects `accept` when required pack-backed rows remain unmapped

### Phase 5b

- rejects release recommendations that omit blocking analog gates

### Phase 6

- rejects quality delta when pack-backed preservation statements are missing

### Smart Refresh

- removes derived pack artifacts and sqlite files
- preserves Phase 1 evidence

## Regression Tests

- existing runs without a pack still succeed
- existing report-editor topic slugs remain valid
- request-fulfillment behavior remains unchanged
- benchmark metadata using `knowledge_pack_key` remains compatible

## Implementation Checklist

1. Add canonical pack fields to runtime state and reference docs.
2. Add pack loader, summary writer, row normalizer, retrieval module, and ledger renderer.
3. Update Phase 0 and Phase 3 in `runPhase.mjs`.
4. Update manifest builders to pass pack metadata.
5. Update artifact lookup rules.
6. Update validators and phase contracts.
7. Update smart refresh cleanup.
8. Add tests for loader, normalizer, retrieval, ledger, and phase integration.
9. Add README setup for qmd dependency and semantic-mode policy.
10. Run the full skill test suite after implementation.

## Risks And Mitigations

### Risk 1: qmd SDK surface differs from this draft

Mitigation:

- keep qmd usage isolated behind `knowledgePackRetrieval.mjs`
- treat this document's code snippet as interface intent, not exact SDK law
- during implementation, verify the installed qmd version's BM25 API (`searchLex`, `search`, or `structuredSearch`) and adapt the retrieval module accordingly

### Risk 2: report-editor validators still expect old topic slugs

Mitigation:

- do not derive arbitrary topic names from `evidence_refs`
- add `deep_research_topics` explicitly to pack schema

### Risk 3: JSON/markdown ledger drift

Mitigation:

- one renderer owns markdown output
- tests assert JSON-to-markdown parity for required fields

### Risk 4: smart refresh leaves stale sqlite state

Mitigation:

- explicitly delete sqlite, shm, wal, and projection directory

## Acceptance Criteria

This design is considered implemented correctly only if all of the following are true:

1. a run with an active pack records canonical pack metadata in `task.json` and `run.json`
2. Phase 0 writes pack summary artifacts
3. Phase 3 writes pack retrieval artifacts and both ledger formats
4. BM25 is the required retrieval baseline for active-pack runs
5. semantic augmentation is optional and non-blocking
6. Phase 5a cannot accept while required pack-backed rows remain unmapped
7. Phase 5b release recommendation traces blocking analog gates to retrieved analog rows
8. smart refresh removes all derived pack artifacts

## References

- [.agents/skills/qa-plan-evolution/scripts/lib/knowledgePackResolver.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/qa-plan-evolution/scripts/lib/knowledgePackResolver.mjs)
- [reference.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/reference.md)
- [README.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/README.md)
- [workflowState.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/scripts/lib/workflowState.mjs)
- [runPhase.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/scripts/lib/runPhase.mjs)
- [spawnManifestBuilders.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/scripts/lib/spawnManifestBuilders.mjs)
- [qaPlanValidators.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/scripts/lib/qaPlanValidators.mjs)
- [artifactLookup.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/scripts/lib/artifactLookup.mjs)
- [applyUserChoice.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/scripts/lib/applyUserChoice.mjs)
- [pack.json](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/knowledge-packs/report-editor/pack.json)
