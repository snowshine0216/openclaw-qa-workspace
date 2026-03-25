# QA Plan Orchestrator — Runtime Knowledge Pack Leverage Design

> **Design ID:** `qa-plan-orchestrator-knowledge-pack-runtime-2026-03-23`
> **Date:** 2026-03-23
> **Status:** Proposed implementation design
> **Scope:** `workspace-planner/skills/qa-plan-orchestrator`, additive reuse of shared resolver logic from `.agents/skills/qa-plan-evolution`
>
> **Constraint:** Keep knowledge packs as reviewable text/JSON artifacts under `knowledge-packs/`. Do not make opaque retrieval or an external vector database mandatory.

---

## Overview

`qa-plan-orchestrator` already treats knowledge packs as important planning inputs, but today that leverage is mostly indirect:

- contracts mention pack-backed coverage obligations
- review rubrics block acceptance when pack-backed coverage is missing
- evals and benchmarks carry `knowledge_pack_key`

What is still missing is first-class runtime handling:

- the active knowledge pack is not resolved into orchestrator state
- phase manifests do not carry pack identity or pack paths
- no live phase code loads or summarizes the pack
- no retrieval pipeline turns pack rows into deterministic coverage candidates

This design closes that gap while preserving the current script-driven phase model.

## Goals

1. Resolve one active knowledge pack per run and record it in runtime state.
2. Make the active pack a real input to Phase 0 through Phase 7 artifacts and prompts.
3. Improve coverage recall with staged retrieval instead of dumping the whole pack into prompts.
4. Keep acceptance gates deterministic and reviewable.
5. Reuse existing repo patterns and shared resolver logic instead of creating a second pack-resolution system.

## Summary Recommendation

Use **`qmd` as the BM25 and semantic retrieval backend** for knowledge pack rows:

1. **BM25 via `qmd search`** (`@tobilu/qmd` SDK `store.searchLex()`)
   - exact capability names
   - exact issue IDs
   - exact interaction-pair language
   - SDK/API contract names such as `setWindowTitle`
2. **Semantic search — runtime-mode-aware**
   - **OpenClaw mode** (`OPENCLAW_SESSION=1`): invoke the agent's built-in `memory_search` tool for semantic augmentation — no external model download required, works with existing OpenClaw memory config
   - **Standalone mode** (no `OPENCLAW_SESSION`): use `qmd query` (BM25 + vector + reranking) via the `@tobilu/qmd` SDK when `QA_PLAN_SEMANTIC_MODE=qmd` is set; otherwise skip semantic and use BM25 only
3. **Deterministic output**
   - retrieval produces explicit matched pack items
   - later phases must map each matched item to a scenario, a release gate, or an explicit exclusion

### Why qmd

- qmd ships BM25 (SQLite FTS5) natively with zero model download — exact-match contract terms land correctly every time
- qmd already has workspace setup instructions in `README.md` (see "Enable QMD and Memory Search for OpenClaw")
- the SDK library API (`createStore`, `store.searchLex()`) lets the retrieval module run programmatically inside Node.js without spawning a subprocess
- when semantic search is wanted, `qmd query` adds local vector reranking without a cloud dependency

### Retrieval mode summary

| `OPENCLAW_SESSION` | `QA_PLAN_SEMANTIC_MODE` | BM25 | Semantic |
|---|---|---|---|
| `1` | any | `qmd searchLex` | `memory_search` tool |
| unset | `qmd` | `qmd searchLex` | `qmd query` (local GGUF) |
| unset | `disabled` (default) | `qmd searchLex` | skipped |

## Existing Baseline

Current behavior already provides three leverage points:

1. **Phase contracts** — Phase 4a requires knowledge-pack capabilities, SDK-visible outcomes, transitions, and i18n implications to map to scenarios, gates, or exclusions.
2. **Review gates** — Phase 5a forbids `accept` when pack-backed capability, interaction-pair, or state-transition coverage is missing.
3. **Checkpoint release gating** — Phase 5b requires relevant historical analogs to appear as `[ANALOG-GATE]` entries.

The missing piece is runtime plumbing that makes those obligations explicit, machine-traceable, and retrieval-backed.

## Architecture

### Active Knowledge Pack Resolution

The orchestrator resolves the active pack once in Phase 0 using the same precedence already implemented in the shared evolution skill:

1. `requested_knowledge_pack_key`
2. `feature_family`
3. benchmark case lookup by `feature_id`
4. `general`

Reuse the resolver directly — do not reimplement:

```
.agents/skills/qa-plan-evolution/scripts/lib/knowledgePackResolver.mjs
```

### Runtime State Changes

**`task.json` — new fields (add to `defaultTask()` in `workflowState.mjs`):**

```json
{
  "requested_knowledge_pack_key": null,
  "resolved_knowledge_pack_key": null,
  "knowledge_pack_resolution_source": null,
  "knowledge_pack_version": null,
  "knowledge_pack_path": null
}
```

**`run.json` — new fields (add to `defaultRun()` in `workflowState.mjs`):**

```json
{
  "knowledge_pack_loaded_at": null,
  "knowledge_pack_summary_generated_at": null,
  "knowledge_pack_retrieval_mode": null,
  "knowledge_pack_semantic_enabled": false,
  "knowledge_pack_retrieval_artifact": null
}
```

### Deep Research Topics

`DEFAULT_DEEP_RESEARCH_TOPICS` is now an empty array. Topics are no longer auto-injected by regex pattern matching on the request text. They must be passed explicitly via the task input or derived from the resolved knowledge pack's `evidence_refs` during Phase 0.

`workflowState.mjs` — removed:
- the `report_editor_workstation_functionality` / `report_editor_library_vs_workstation_gap` regex detection block in `parseRawRequestText()`
- the hardcoded topic strings in `DEFAULT_DEEP_RESEARCH_TOPICS`

The `topicRequirements` map in `buildRequestRequirements()` is retained as a convenience alias — it produces nicer artifact names when those topic strings are explicitly provided, and falls back to a generic pattern for any other topic.

### New Artifact Family

Phase 0 writes:

- `context/knowledge_pack_summary_${featureId}.md` — human-readable summary (pack key, version, all item types)
- `context/knowledge_pack_summary_${featureId}.json` — machine-readable companion

Phase 3 writes:

- `context/knowledge_pack_retrieval_${featureId}.md` — retrieval report with matched rows, query sources, and match methods
- `context/knowledge_pack_retrieval_${featureId}.json` — optional structured companion

Phase 3 also appends pack-backed candidates to:

- `context/coverage_ledger_${featureId}.json` — structured coverage ledger (JSON, primary)
- `context/coverage_ledger_${featureId}.md` — human-readable view (derived from JSON)

## New Module Files

All under `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/`:

| File | Purpose |
|---|---|
| `knowledgePackLoader.mjs` | Resolves pack path, loads `pack.json`, validates schema, returns structured pack object |
| `knowledgePackSummarizer.mjs` | Phase 0 — writes `knowledge_pack_summary_${featureId}.md/.json` |
| `knowledgePackRetrieval.mjs` | Phase 3 — BM25 via qmd SDK, semantic via OpenClaw or qmd, writes retrieval artifacts |
| `coverageLedger.mjs` | Reads/writes `coverage_ledger_${featureId}.json` and its `.md` companion |

## Retrieval Design

### `qmd` SDK Usage

The retrieval module uses `@tobilu/qmd` SDK directly in-process:

```js
import { createStore } from '@tobilu/qmd';

const store = await createStore({
  dbPath: join(runDir, 'context', 'knowledge_pack_qmd.sqlite'),
  config: {
    collections: {
      pack: { path: packDir, pattern: 'pack.md' },
    },
  },
});

await store.update();
const results = await store.searchLex(queryText, { limit: 20 });
await store.close();
```

Each knowledge pack item is projected into a flat markdown document (`pack.md`) alongside `pack.json` before indexing so qmd can chunk and FTS-index it.

### Retrieval Units

Each pack item becomes a retrievable row with:

| Field | Description |
|---|---|
| `item_id` | Unique within the pack (e.g. `outcome-window-title`) |
| `item_type` | `required_capability` / `required_outcome` / `state_transition` / `analog_gate` / `sdk_visible_contract` / `interaction_pair` / `anti_pattern` / `evidence_ref` |
| `pack_key` | Pack identifier |
| `pack_version` | Pack version string |
| `title` | Short label |
| `search_text` | Concatenated text used for indexing |
| `keywords` | Keyword array |
| `source_issue_refs` | Issue IDs from `evidence_refs` |
| `priority` | Blocking flag from pack schema |

### Query Inputs

Build retrieval queries from:

- `feature_id`
- `feature_family`
- Jira issue summary and description
- related issue summaries
- Confluence design text
- deep research synthesis
- support-only issue summaries
- explicit user request requirements

### Search Pipeline

1. Project pack items into `pack.md` and create qmd SQLite store in `context/`.
2. Run `store.searchLex(queryText)` for BM25 candidates (top-N).
3. If `OPENCLAW_SESSION=1`: emit a `memory_search` invocation in the Phase 3 spawn manifest context block for semantic augmentation.
4. If `QA_PLAN_SEMANTIC_MODE=qmd`: run `store.search(queryText)` (hybrid BM25 + vector + rerank) — requires qmd embed to have been run first.
5. Merge and deduplicate candidates. Preserve BM25 candidates even when semantic ranking disagrees.
6. Write retrieval report artifacts under `context/`.
7. Seed coverage ledger with matched rows.

### Semantic Toggle Interface

Controlled by two environment variables. No config in `task.json` — retrieval mode is an infrastructure concern, not a per-run concern:

| Variable | Values | Default | Meaning |
|---|---|---|---|
| `OPENCLAW_SESSION` | `1` or unset | unset | Set automatically by OpenClaw launcher; enables `memory_search` semantic path |
| `QA_PLAN_SEMANTIC_MODE` | `disabled` / `qmd` | `disabled` | Enables qmd vector search in standalone mode |

The retrieval module reads these at startup and selects the appropriate pipeline branch. Acceptance gates remain deterministic regardless of which semantic mode is active.

## Files to Create or Change

### New files

| Path | Description |
|---|---|
| `scripts/lib/knowledgePackLoader.mjs` | Pack resolver + loader |
| `scripts/lib/knowledgePackSummarizer.mjs` | Phase 0 summary writer |
| `scripts/lib/knowledgePackRetrieval.mjs` | qmd-backed BM25 + semantic retrieval |
| `scripts/lib/coverageLedger.mjs` | Coverage ledger read/write |
| `scripts/test/knowledgePackRetrieval.test.mjs` | Unit + integration tests for retrieval module |
| `scripts/test/knowledgePackSummarizer.test.mjs` | Unit tests for summarizer |

### Changed files

| Path | Change |
|---|---|
| `scripts/lib/workflowState.mjs` | Add pack fields to `defaultTask()` and `defaultRun()`; remove hardcoded `report_editor` topics and regex detection |
| `scripts/lib/spawnManifestBuilders.mjs` | Add pack identity fields to spawn manifest `source` blocks |
| `scripts/phase0.sh` | Call new `knowledgePackLoader` + `knowledgePackSummarizer` helpers after existing runtime setup |
| `package.json` | Add `@tobilu/qmd` as a dependency |

### Artifact naming convention

All new artifacts follow the existing `_${featureId}.md` / `_${featureId}.json` suffix pattern:

```
context/knowledge_pack_summary_${featureId}.md
context/knowledge_pack_summary_${featureId}.json
context/knowledge_pack_retrieval_${featureId}.md
context/knowledge_pack_retrieval_${featureId}.json
context/coverage_ledger_${featureId}.json
context/coverage_ledger_${featureId}.md
context/knowledge_pack_qmd.sqlite   ← ephemeral, gitignored
```

## Phase-by-Phase Changes

### Phase 0

- resolve active knowledge pack via `knowledgePackResolver.mjs`
- load `pack.json` via `knowledgePackLoader.mjs`
- record pack metadata in `task.json` and `run.json`
- write `knowledge_pack_summary_${featureId}.md` and `.json`
- if user explicitly requested a pack and it is missing, block the run
- if pack is inferred and missing, record a warning and fall back to `general` if available; otherwise continue in null-pack mode
- derive any research topics from pack `evidence_refs` rather than hard-coded regex

### Phase 1

- no direct pack retrieval required
- include active pack summary path in evidence-gathering context so subagents know which capabilities and analogs matter

### Phase 2

- include `knowledge_pack_summary_${featureId}.md` and `.json` in `artifact_lookup_${featureId}.md`
- record pack path, version, and retrieval artifact path

### Phase 3

- call `knowledgePackRetrieval.mjs` with gathered evidence as query input
- write `knowledge_pack_retrieval_${featureId}.md` and `.json`
- call `coverageLedger.mjs` to create `coverage_ledger_${featureId}.json` with pack-derived candidates

Coverage candidates must include:
- required capabilities
- required outcomes
- state transitions
- interaction pairs (direct + matrix-sourced)
- analog gates
- SDK visible contracts

### Phase 4a

- require each retrieved pack item to land in one of:
  - mapped scenario (with `knowledge_pack_item_id` in the row)
  - mapped release gate
  - explicit exclusion with evidence
- include pack item IDs in the coverage mapping rows

### Phase 4b

- preserve pack-backed coverage during top-layer grouping
- forbid canonical grouping changes that silently drop pack-backed scenario chains

### Phase 5a

- make `## Knowledge Pack Coverage Audit` traceable against pack item IDs
- make `## Cross-Section Interaction Audit` explicitly cover retrieved `interaction_pair` rows
- block `accept` when any retrieved pack-backed capability, interaction pair, or transition is unmapped

### Phase 5b

- require `[ANALOG-GATE]` entries to map back to retrieved `analog_gate` rows
- require release recommendation text to enumerate unresolved analog gates before ship

### Phase 6

- preserve reviewed pack-backed coverage during final cleanup
- forbid quality refactors that collapse distinct pack-backed scenarios into vague merged nodes

### Phase 7

- optionally derive developer smoke rows from:
  - unresolved or high-priority analog gates
  - critical P1 pack-backed scenarios

## Interfaces And Data Shape

### Spawn Manifest Additions (`spawnManifestBuilders.mjs`)

Add to each request `source` block:

```json
{
  "knowledge_pack_key": "report-editor",
  "knowledge_pack_path": "knowledge-packs/report-editor/pack.json",
  "knowledge_pack_version": "2026-03-23",
  "knowledge_pack_summary_path": "context/knowledge_pack_summary_BCIN-7289.md",
  "knowledge_pack_retrieval_path": "context/knowledge_pack_retrieval_BCIN-7289.md"
}
```

### Coverage Ledger Schema (`coverage_ledger_${featureId}.json`)

```json
{
  "feature_id": "BCIN-7289",
  "generated_at": "<iso>",
  "knowledge_pack_key": "report-editor",
  "knowledge_pack_version": "2026-03-23",
  "items": [
    {
      "knowledge_pack_item_id": "outcome-window-title",
      "knowledge_pack_item_type": "required_outcome",
      "knowledge_pack_match_source": "bm25",
      "knowledge_pack_status": "unmapped",
      "title": "window title correctness",
      "query_match_score": 0.82
    }
  ]
}
```

Allowed `knowledge_pack_status` values: `scenario_mapped` / `gate_mapped` / `explicitly_excluded` / `unmapped`.

### Retrieval Artifact Schema (`knowledge_pack_retrieval_${featureId}.json`)

```json
{
  "feature_id": "BCIN-7289",
  "retrieval_mode": "bm25_only",
  "semantic_backend": null,
  "generated_at": "<iso>",
  "queries": [
    {
      "query_source": "jira_summary",
      "query_text": "save-as overwrite JS error report editor",
      "matched_items": [
        {
          "item_id": "outcome-save-as-overwrite-no-crash",
          "item_type": "required_outcome",
          "match_method": "bm25",
          "score": 14.2,
          "downstream_mapping_status": "unmapped"
        }
      ]
    }
  ]
}
```

## `package.json` Dependency

Add to `workspace-planner/skills/qa-plan-orchestrator/package.json`:

```json
{
  "dependencies": {
    "@tobilu/qmd": "latest"
  }
}
```

Note: BM25-only mode requires no model download and no `qmd embed` step. The qmd SQLite index for knowledge packs is created at runtime in `context/knowledge_pack_qmd.sqlite` and can be regenerated on each run (packs are small).

## Testing Plan

### Test files

- `scripts/test/knowledgePackRetrieval.test.mjs`
- `scripts/test/knowledgePackSummarizer.test.mjs`

### Resolution tests

- explicit request key overrides inferred values
- `feature_family` resolves pack when request key is absent
- benchmark-case lookup resolves by `feature_id`
- inferred missing pack falls back to `general` or null-pack mode with warning
- explicit missing pack blocks the run

### Retrieval tests

- BM25 returns exact hits for capability names, issue IDs, SDK visible contracts, and interaction labels
- `interaction_matrices` pairs are included alongside `interaction_pairs` (no duplicates)
- `required_outcomes` keyword + observable_outcome terms are matched
- `state_transitions` from/to/trigger/observable_outcome terms are matched
- retrieval output is stable for the same input and same pack version
- `QA_PLAN_SEMANTIC_MODE=disabled` keeps exact-match BM25 behavior (no embedding model loaded)

### Phase integration tests

- Phase 0 writes `knowledge_pack_summary_${featureId}.md` and `.json`
- Phase 2 indexes those artifacts in `artifact_lookup_${featureId}.md`
- Phase 3 produces retrieval artifacts and `coverage_ledger_${featureId}.json`
- Phase 4a rejects drafts with unmapped pack-backed obligations
- Phase 5a rejects `accept` when interaction pairs or transitions remain unmapped
- Phase 5b rejects release recommendations missing required analog gates

### Regression tests

- runs without a pack still work in controlled null-pack mode
- existing benchmark metadata remains compatible
- deep research topics are no longer auto-injected by regex; they must be passed explicitly or derived from pack `evidence_refs`

## Implementation Notes

1. The qmd SQLite store for a knowledge pack is ephemeral and per-run. Create it in `context/knowledge_pack_qmd.sqlite` and regenerate on each Phase 3 run. Do not commit it.
2. Keep the raw `pack.json` as the source of truth. Treat the qmd index and all retrieval artifacts as derived cacheable state.
3. Every phase reads `knowledge_pack_summary_${featureId}.md` — not the raw pack. Only the retrieval module reads `pack.json` directly.
4. The OpenClaw `memory_search` semantic path emits a note in the spawn manifest context block so the planning subagent can invoke `memory_search` natively. The retrieval module does not subprocess into OpenClaw — it signals intent via manifest.
5. `knowledgePackLoader.mjs` must validate that all required top-level fields are present (`required_capabilities`, `required_outcomes`, `state_transitions`, `analog_gates`, `sdk_visible_contracts`, `interaction_pairs`). Missing fields are logged as warnings, not hard failures — packs may be partially populated during bootstrapping.

## Assumptions And Defaults

- Default retrieval mode is `bm25_only` (`QA_PLAN_SEMANTIC_MODE` not set).
- `OPENCLAW_SESSION=1` is set by the OpenClaw launcher automatically; the retrieval module does not set it.
- Semantic via qmd requires `qmd embed` to have been run against the knowledge-pack collection before Phase 3 — this is a pre-condition documented in the operator guide, not enforced at runtime (falls back to BM25 if no vectors exist).
- Pack files remain workspace-local under `knowledge-packs/`.
- `general` is the default fallback key when a qa-plan target has no explicit or inferred pack key.
- Acceptance gates remain deterministic and contract-backed regardless of retrieval mode.

## Practical Guidance

Use knowledge packs in this order:

1. **Resolve** — decide which pack applies to the run
2. **Summarize** — turn raw pack content into a compact runtime artifact
3. **Retrieve** — use qmd BM25 first; semantic via OpenClaw memory_search or qmd query second
4. **Map** — force every relevant pack row into a scenario, gate, or explicit exclusion
5. **Audit** — make review artifacts prove that coverage stayed intact
6. **Gate** — block release recommendations when analog gates or critical interactions are missing

That is the difference between "the pack exists in the repo" and "the pack actually changes what the orchestrator produces."

## References

- `README.md` — "Enable QMD and Memory Search for OpenClaw" section
- `https://github.com/tobi/qmd` — qmd SDK and CLI
- `.agents/skills/qa-plan-evolution/scripts/lib/knowledgePackResolver.mjs`
- `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/knowledgePackCoverage.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/knowledge-packs/report-editor/pack.json`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/workflowState.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/spawnManifestBuilders.mjs`
