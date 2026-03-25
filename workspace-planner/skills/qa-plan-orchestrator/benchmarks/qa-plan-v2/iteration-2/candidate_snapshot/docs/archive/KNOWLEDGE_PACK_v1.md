# QA Plan Orchestrator — Runtime Knowledge Pack Leverage Design
      2 -
      3 -> **Design ID:** `qa-plan-orchestrator-knowledge-pack-runtime-2026-03-23`
      4 -> **Date:** 2026-03-23
      5 -> **Status:** Proposed implementation design
      6 -> **Scope:** `workspace-planner/skills/qa-plan-orchestrator`, additive reuse of sh
         ared resolver logic from `.agents/skills/qa-plan-evolution`
      7 ->
      8 -> **Constraint:** Keep knowledge packs as reviewable text/JSON artifacts under `kn
         owledge-packs/`. Do not make opaque retrieval or an external vector database manda
         tory.
      9 -
     10 ----
     11 -
     12 -## Overview
     13 -
     14 -`qa-plan-orchestrator` already treats knowledge packs as important planning inputs
         , but today that leverage is mostly indirect:
     15 -
     16 -- contracts mention pack-backed coverage obligations
     17 -- review rubrics block acceptance when pack-backed coverage is missing
     18 -- evals and benchmarks carry `knowledge_pack_key`
     19 -
     20 -What is still missing is first-class runtime handling:
     21 -
     22 -- the active knowledge pack is not resolved into orchestrator state
     23 -- phase manifests do not carry pack identity or pack paths
     24 -- no live phase code loads or summarizes the pack
     25 -- no retrieval pipeline turns pack rows into deterministic coverage candidates
     26 -
     27 -This design closes that gap while preserving the current script-driven phase model
         .
     28 -
     29 -## Goals
     30 -
     31 -1. Resolve one active knowledge pack per run and record it in runtime state.
     32 -2. Make the active pack a real input to Phase 0 through Phase 7 artifacts and prom
         pts.
     33 -3. Improve coverage recall with staged retrieval instead of dumping the whole pack
          into prompts.
     34 -4. Keep acceptance gates deterministic and reviewable.
     35 -5. Reuse existing repo patterns and shared resolver logic instead of creating a se
         cond pack-resolution system.
     36 -
     37 -## Summary Recommendation
     38 -
     39 -Use **`qmd` as the BM25 and semantic retrieval backend** for knowledge pack rows:
     40 -
     41 -1. **BM25 via `qmd search`** (`@tobilu/qmd` SDK `store.searchLex()`)
     42 -   - exact capability names
     43 -   - exact issue IDs
     44 -   - exact interaction-pair language
     45 -   - SDK/API contract names such as `setWindowTitle`
     46 -2. **Semantic search — runtime-mode-aware**
     47 -   - **OpenClaw mode** (`OPENCLAW_SESSION=1`): invoke the agent's built-in `memory
         _search` tool for semantic augmentation — no external model download required, wor
         ks with existing OpenClaw memory config
     48 -   - **Standalone mode** (no `OPENCLAW_SESSION`): use `qmd query` (BM25 + vector +
          reranking) via the `@tobilu/qmd` SDK when `QA_PLAN_SEMANTIC_MODE=qmd` is set; oth
         erwise skip semantic and use BM25 only
     49 -3. **Deterministic output**
     50 -   - retrieval produces explicit matched pack items
     51 -   - later phases must map each matched item to a scenario, a release gate, or an
         explicit exclusion
     52 -
     53 -### Why qmd
     54 -
     55 -- qmd ships BM25 (SQLite FTS5) natively with zero model download — exact-match con
         tract terms land correctly every time
     56 -- qmd already has workspace setup instructions in `README.md` (see "Enable QMD and
          Memory Search for OpenClaw")
     57 -- the SDK library API (`createStore`, `store.searchLex()`) lets the retrieval modu
         le run programmatically inside Node.js without spawning a subprocess
     58 -- when semantic search is wanted, `qmd query` adds local vector reranking without
         a cloud dependency
     59 -
     60 -### Retrieval mode summary
     61 -
     62 -| `OPENCLAW_SESSION` | `QA_PLAN_SEMANTIC_MODE` | BM25 | Semantic |
     63 -|---|---|---|---|
     64 -| `1` | any | `qmd searchLex` | `memory_search` tool |
     65 -| unset | `qmd` | `qmd searchLex` | `qmd query` (local GGUF) |
     66 -| unset | `disabled` (default) | `qmd searchLex` | skipped |
     67 -
     68 -## Existing Baseline
     69 -
     70 -Current behavior already provides three leverage points:
     71 -
     72 -1. **Phase contracts** — Phase 4a requires knowledge-pack capabilities, SDK-visibl
         e outcomes, transitions, and i18n implications to map to scenarios, gates, or excl
         usions.
     73 -2. **Review gates** — Phase 5a forbids `accept` when pack-backed capability, inter
         action-pair, or state-transition coverage is missing.
     74 -3. **Checkpoint release gating** — Phase 5b requires relevant historical analogs t
         o appear as `[ANALOG-GATE]` entries.
     75 -
     76 -The missing piece is runtime plumbing that makes those obligations explicit, machi
         ne-traceable, and retrieval-backed.
     77 -
     78 -## Architecture
     79 -
     80 -### Active Knowledge Pack Resolution
     81 -
     82 -The orchestrator resolves the active pack once in Phase 0 using the same precedenc
         e already implemented in the shared evolution skill:
     83 -
     84 -1. `requested_knowledge_pack_key`
     85 -2. `feature_family`
     86 -3. benchmark case lookup by `feature_id`
     87 -4. `general`
     88 -
     89 -Reuse the resolver directly — do not reimplement:
     90 -
     91 -```
     92 -.agents/skills/qa-plan-evolution/scripts/lib/knowledgePackResolver.mjs
     93 -```
     94 -
     95 -### Runtime State Changes
     96 -
     97 -**`task.json` — new fields (add to `defaultTask()` in `workflowState.mjs`):**
     98 -
     99 -```json
    100 -{
    101 -  "requested_knowledge_pack_key": null,
    102 -  "resolved_knowledge_pack_key": null,
    103 -  "knowledge_pack_resolution_source": null,
    104 -  "knowledge_pack_version": null,
    105 -  "knowledge_pack_path": null
    106 -}
    107 -```
    108 -
    109 -**`run.json` — new fields (add to `defaultRun()` in `workflowState.mjs`):**
    110 -
    111 -```json
    112 -{
    113 -  "knowledge_pack_loaded_at": null,
    114 -  "knowledge_pack_summary_generated_at": null,
    115 -  "knowledge_pack_retrieval_mode": null,
    116 -  "knowledge_pack_semantic_enabled": false,
    117 -  "knowledge_pack_retrieval_artifact": null
    118 -}
    119 -```
    120 -
    121 -### Deep Research Topics
    122 -
    123 -`DEFAULT_DEEP_RESEARCH_TOPICS` is now an empty array. Topics are no longer auto-in
         jected by regex pattern matching on the request text. They must be passed explicit
         ly via the task input or derived from the resolved knowledge pack's `evidence_refs
         ` during Phase 0.
    124 -
    125 -`workflowState.mjs` — removed:
    126 -- the `report_editor_workstation_functionality` / `report_editor_library_vs_workst
         ation_gap` regex detection block in `parseRawRequestText()`
    127 -- the hardcoded topic strings in `DEFAULT_DEEP_RESEARCH_TOPICS`
    128 -
    129 -The `topicRequirements` map in `buildRequestRequirements()` is retained as a conve
         nience alias — it produces nicer artifact names when those topic strings are expli
         citly provided, and falls back to a generic pattern for any other topic.
    130 -
    131 -### New Artifact Family
    132 -
    133 -Phase 0 writes:
    134 -
    135 -- `context/knowledge_pack_summary_${featureId}.md` — human-readable summary (pack
         key, version, all item types)
    136 -- `context/knowledge_pack_summary_${featureId}.json` — machine-readable companion
    137 -
    138 -Phase 3 writes:
    139 -
    140 -- `context/knowledge_pack_retrieval_${featureId}.md` — retrieval report with match
         ed rows, query sources, and match methods
    141 -- `context/knowledge_pack_retrieval_${featureId}.json` — optional structured compa
         nion
    142 -
    143 -Phase 3 also appends pack-backed candidates to:
    144 -
    145 -- `context/coverage_ledger_${featureId}.json` — structured coverage ledger (JSON,
         primary)
    146 -- `context/coverage_ledger_${featureId}.md` — human-readable view (derived from JS
         ON)
    147 -
    148 -## New Module Files
    149 -
    150 -All under `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/`:
    151 -
    152 -| File | Purpose |
    153 -|---|---|
    154 -| `knowledgePackLoader.mjs` | Resolves pack path, loads `pack.json`, validates sch
         ema, returns structured pack object |
    155 -| `knowledgePackSummarizer.mjs` | Phase 0 — writes `knowledge_pack_summary_${featu
         reId}.md/.json` |
    156 -| `knowledgePackRetrieval.mjs` | Phase 3 — BM25 via qmd SDK, semantic via OpenClaw
          or qmd, writes retrieval artifacts |
    157 -| `coverageLedger.mjs` | Reads/writes `coverage_ledger_${featureId}.json` and its
         `.md` companion |
    158 -
    159 -## Retrieval Design
    160 -
    161 -### `qmd` SDK Usage
    162 -
    163 -The retrieval module uses `@tobilu/qmd` SDK directly in-process:
    164 -
    165 -```js
    166 -import { createStore } from '@tobilu/qmd';
    167 -
    168 -const store = await createStore({
    169 -  dbPath: join(runDir, 'context', 'knowledge_pack_qmd.sqlite'),
    170 -  config: {
    171 -    collections: {
    172 -      pack: { path: packDir, pattern: 'pack.md' },
    173 -    },
    174 -  },
    175 -});
    176 -
    177 -await store.update();
    178 -const results = await store.searchLex(queryText, { limit: 20 });
    179 -await store.close();
    180 -```
    181 -
    182 -Each knowledge pack item is projected into a flat markdown document (`pack.md`) al
         ongside `pack.json` before indexing so qmd can chunk and FTS-index it.
    183 -
    184 -### Retrieval Units
    185 -
    186 -Each pack item becomes a retrievable row with:
    187 -
    188 -| Field | Description |
    189 -|---|---|
    190 -| `item_id` | Unique within the pack (e.g. `outcome-window-title`) |
    191 -| `item_type` | `required_capability` / `required_outcome` / `state_transition` /
         `analog_gate` / `sdk_visible_contract` / `interaction_pair` / `anti_pattern` / `ev
         idence_ref` |
    192 -| `pack_key` | Pack identifier |
    193 -| `pack_version` | Pack version string |
    194 -| `title` | Short label |
    195 -| `search_text` | Concatenated text used for indexing |
    196 -| `keywords` | Keyword array |
    197 -| `source_issue_refs` | Issue IDs from `evidence_refs` |
    198 -| `priority` | Blocking flag from pack schema |
    199 -
    200 -### Query Inputs
    201 -
    202 -Build retrieval queries from:
    203 -
    204 -- `feature_id`
    205 -- `feature_family`
    206 -- Jira issue summary and description
    207 -- related issue summaries
    208 -- Confluence design text
    209 -- deep research synthesis
    210 -- support-only issue summaries
    211 -- explicit user request requirements
    212 -
    213 -### Search Pipeline
    214 -
    215 -1. Project pack items into `pack.md` and create qmd SQLite store in `context/`.
    216 -2. Run `store.searchLex(queryText)` for BM25 candidates (top-N).
    217 -3. If `OPENCLAW_SESSION=1`: emit a `memory_search` invocation in the Phase 3 spawn
          manifest context block for semantic augmentation.
    218 -4. If `QA_PLAN_SEMANTIC_MODE=qmd`: run `store.search(queryText)` (hybrid BM25 + ve
         ctor + rerank) — requires qmd embed to have been run first.
    219 -5. Merge and deduplicate candidates. Preserve BM25 candidates even when semantic r
         anking disagrees.
    220 -6. Write retrieval report artifacts under `context/`.
    221 -7. Seed coverage ledger with matched rows.
    222 -
    223 -### Semantic Toggle Interface
    224 -
    225 -Controlled by two environment variables. No config in `task.json` — retrieval mode
          is an infrastructure concern, not a per-run concern:
    226 -
    227 -| Variable | Values | Default | Meaning |
    228 -|---|---|---|---|
    229 -| `OPENCLAW_SESSION` | `1` or unset | unset | Set automatically by OpenClaw launch
         er; enables `memory_search` semantic path |
    230 -| `QA_PLAN_SEMANTIC_MODE` | `disabled` / `qmd` | `disabled` | Enables qmd vector s
         earch in standalone mode |
    231 -
    232 -The retrieval module reads these at startup and selects the appropriate pipeline b
         ranch. Acceptance gates remain deterministic regardless of which semantic mode is
         active.
    233 -
    234 -## Files to Create or Change
    235 -
    236 -### New files
    237 -
    238 -| Path | Description |
    239 -|---|---|
    240 -| `scripts/lib/knowledgePackLoader.mjs` | Pack resolver + loader |
    241 -| `scripts/lib/knowledgePackSummarizer.mjs` | Phase 0 summary writer |
    242 -| `scripts/lib/knowledgePackRetrieval.mjs` | qmd-backed BM25 + semantic retrieval
         |
    243 -| `scripts/lib/coverageLedger.mjs` | Coverage ledger read/write |
    244 -| `scripts/test/knowledgePackRetrieval.test.mjs` | Unit + integration tests for re
         trieval module |
    245 -| `scripts/test/knowledgePackSummarizer.test.mjs` | Unit tests for summarizer |
    246 -
    247 -### Changed files
    248 -
    249 -| Path | Change |
    250 -|---|---|
    251 -| `scripts/lib/workflowState.mjs` | Add pack fields to `defaultTask()` and `defaul
         tRun()`; remove hardcoded `report_editor` topics and regex detection |
    252 -| `scripts/lib/spawnManifestBuilders.mjs` | Add pack identity fields to spawn mani
         fest `source` blocks |
    253 -| `scripts/phase0.sh` | Call new `knowledgePackLoader` + `knowledgePackSummarizer`
          helpers after existing runtime setup |
    254 -| `package.json` | Add `@tobilu/qmd` as a dependency |
    255 -
    256 -### Artifact naming convention
    257 -
    258 -All new artifacts follow the existing `_${featureId}.md` / `_${featureId}.json` su
         ffix pattern:
    259 -
    260 -```
    261 -context/knowledge_pack_summary_${featureId}.md
    262 -context/knowledge_pack_summary_${featureId}.json
    263 -context/knowledge_pack_retrieval_${featureId}.md
    264 -context/knowledge_pack_retrieval_${featureId}.json
    265 -context/coverage_ledger_${featureId}.json
    266 -context/coverage_ledger_${featureId}.md
    267 -context/knowledge_pack_qmd.sqlite   ← ephemeral, gitignored
    268 -```
    269 -
    270 -## Phase-by-Phase Changes
    271 -
    272 -### Phase 0
    273 -
    274 -- resolve active knowledge pack via `knowledgePackResolver.mjs`
    275 -- load `pack.json` via `knowledgePackLoader.mjs`
    276 -- record pack metadata in `task.json` and `run.json`
    277 -- write `knowledge_pack_summary_${featureId}.md` and `.json`
    278 -- if user explicitly requested a pack and it is missing, block the run
    279 -- if pack is inferred and missing, record a warning and fall back to `general` if
         available; otherwise continue in null-pack mode
    280 -- derive any research topics from pack `evidence_refs` rather than hard-coded rege
         x
    281 -
    282 -### Phase 1
    283 -
    284 -- no direct pack retrieval required
    285 -- include active pack summary path in evidence-gathering context so subagents know
          which capabilities and analogs matter
    286 -
    287 -### Phase 2
    288 -
    289 -- include `knowledge_pack_summary_${featureId}.md` and `.json` in `artifact_lookup
         _${featureId}.md`
    290 -- record pack path, version, and retrieval artifact path
    291 -
    292 -### Phase 3
    293 -
    294 -- call `knowledgePackRetrieval.mjs` with gathered evidence as query input
    295 -- write `knowledge_pack_retrieval_${featureId}.md` and `.json`
    296 -- call `coverageLedger.mjs` to create `coverage_ledger_${featureId}.json` with pac
         k-derived candidates
    297 -
    298 -Coverage candidates must include:
    299 -- required capabilities
    300 -- required outcomes
    301 -- state transitions
    302 -- interaction pairs (direct + matrix-sourced)
    303 -- analog gates
    304 -- SDK visible contracts
    305 -
    306 -### Phase 4a
    307 -
    308 -- require each retrieved pack item to land in one of:
    309 -  - mapped scenario (with `knowledge_pack_item_id` in the row)
    310 -  - mapped release gate
    311 -  - explicit exclusion with evidence
    312 -- include pack item IDs in the coverage mapping rows
    313 -
    314 -### Phase 4b
    315 -
    316 -- preserve pack-backed coverage during top-layer grouping
    317 -- forbid canonical grouping changes that silently drop pack-backed scenario chains
    318 -
    319 -### Phase 5a
    320 -
    321 -- make `## Knowledge Pack Coverage Audit` traceable against pack item IDs
    322 -- make `## Cross-Section Interaction Audit` explicitly cover retrieved `interactio
         n_pair` rows
    323 -- block `accept` when any retrieved pack-backed capability, interaction pair, or t
         ransition is unmapped
    324 -
    325 -### Phase 5b
    326 -
    327 -- require `[ANALOG-GATE]` entries to map back to retrieved `analog_gate` rows
    328 -- require release recommendation text to enumerate unresolved analog gates before
         ship
    329 -
    330 -### Phase 6
    331 -
    332 -- preserve reviewed pack-backed coverage during final cleanup
    333 -- forbid quality refactors that collapse distinct pack-backed scenarios into vague
          merged nodes
    334 -
    335 -### Phase 7
    336 -
    337 -- optionally derive developer smoke rows from:
    338 -  - unresolved or high-priority analog gates
    339 -  - critical P1 pack-backed scenarios
    340 -
    341 -## Interfaces And Data Shape
    342 -
    343 -### Spawn Manifest Additions (`spawnManifestBuilders.mjs`)
    344 -
    345 -Add to each request `source` block:
    346 -
    347 -```json
    348 -{
    349 -  "knowledge_pack_key": "report-editor",
    350 -  "knowledge_pack_path": "knowledge-packs/report-editor/pack.json",
    351 -  "knowledge_pack_version": "2026-03-23",
    352 -  "knowledge_pack_summary_path": "context/knowledge_pack_summary_BCIN-7289.md",
    353 -  "knowledge_pack_retrieval_path": "context/knowledge_pack_retrieval_BCIN-7289.md"
    354 -}
    355 -```
    356 -
    357 -### Coverage Ledger Schema (`coverage_ledger_${featureId}.json`)
    358 -
    359 -```json
    360 -{
    361 -  "feature_id": "BCIN-7289",
    362 -  "generated_at": "<iso>",
    363 -  "knowledge_pack_key": "report-editor",
    364 -  "knowledge_pack_version": "2026-03-23",
    365 -  "items": [
    366 -    {
    367 -      "knowledge_pack_item_id": "outcome-window-title",
    368 -      "knowledge_pack_item_type": "required_outcome",
    369 -      "knowledge_pack_match_source": "bm25",
    370 -      "knowledge_pack_status": "unmapped",
    371 -      "title": "window title correctness",
    372 -      "query_match_score": 0.82
    373 -    }
    374 -  ]
    375 -}
    376 -```
    377 -
    378 -Allowed `knowledge_pack_status` values: `scenario_mapped` / `gate_mapped` / `expli
         citly_excluded` / `unmapped`.
    379 -
    380 -### Retrieval Artifact Schema (`knowledge_pack_retrieval_${featureId}.json`)
    381 -
    382 -```json
    383 -{
    384 -  "feature_id": "BCIN-7289",
    385 -  "retrieval_mode": "bm25_only",
    386 -  "semantic_backend": null,
    387 -  "generated_at": "<iso>",
    388 -  "queries": [
    389 -    {
    390 -      "query_source": "jira_summary",
    391 -      "query_text": "save-as overwrite JS error report editor",
    392 -      "matched_items": [
    393 -        {
    394 -          "item_id": "outcome-save-as-overwrite-no-crash",
    395 -          "item_type": "required_outcome",
    396 -          "match_method": "bm25",
    397 -          "score": 14.2,
    398 -          "downstream_mapping_status": "unmapped"
    399 -        }
    400 -      ]
    401 -    }
    402 -  ]
    403 -}
    404 -```
    405 -
    406 -## `package.json` Dependency
    407 -
    408 -Add to `workspace-planner/skills/qa-plan-orchestrator/package.json`:
    409 -
    410 -```json
    411 -{
    412 -  "dependencies": {
    413 -    "@tobilu/qmd": "latest"
    414 -  }
    415 -}
    416 -```
    417 -
    418 -Note: BM25-only mode requires no model download and no `qmd embed` step. The qmd S
         QLite index for knowledge packs is created at runtime in `context/knowledge_pack_q
         md.sqlite` and can be regenerated on each run (packs are small).
    419 -
    420 -## Testing Plan
    421 -
    422 -### Test files
    423 -
    424 -- `scripts/test/knowledgePackRetrieval.test.mjs`
    425 -- `scripts/test/knowledgePackSummarizer.test.mjs`
    426 -
    427 -### Resolution tests
    428 -
    429 -- explicit request key overrides inferred values
    430 -- `feature_family` resolves pack when request key is absent
    431 -- benchmark-case lookup resolves by `feature_id`
    432 -- inferred missing pack falls back to `general` or null-pack mode with warning
    433 -- explicit missing pack blocks the run
    434 -
    435 -### Retrieval tests
    436 -
    437 -- BM25 returns exact hits for capability names, issue IDs, SDK visible contracts,
         and interaction labels
    438 -- `interaction_matrices` pairs are included alongside `interaction_pairs` (no dupl
         icates)
    439 -- `required_outcomes` keyword + observable_outcome terms are matched
    440 -- `state_transitions` from/to/trigger/observable_outcome terms are matched
    441 -- retrieval output is stable for the same input and same pack version
    442 -- `QA_PLAN_SEMANTIC_MODE=disabled` keeps exact-match BM25 behavior (no embedding m
         odel loaded)
    443 -
    444 -### Phase integration tests
    445 -
    446 -- Phase 0 writes `knowledge_pack_summary_${featureId}.md` and `.json`
    447 -- Phase 2 indexes those artifacts in `artifact_lookup_${featureId}.md`
    448 -- Phase 3 produces retrieval artifacts and `coverage_ledger_${featureId}.json`
    449 -- Phase 4a rejects drafts with unmapped pack-backed obligations
    450 -- Phase 5a rejects `accept` when interaction pairs or transitions remain unmapped
    451 -- Phase 5b rejects release recommendations missing required analog gates
    452 -
    453 -### Regression tests
    454 -
    455 -- runs without a pack still work in controlled null-pack mode
    456 -- existing benchmark metadata remains compatible
    457 -- deep research topics are no longer auto-injected by regex; they must be passed e
         xplicitly or derived from pack `evidence_refs`
    458 -
    461 -1. The qmd SQLite store for a knowledge pack is ephemeral and per-run. Create it i
         n `context/knowledge_pack_qmd.sqlite` and regenerate on each Phase 3 run. Do not c
         ommit it.
    462 -2. Keep the raw `pack.json` as the source of truth. Treat the qmd index and all re
         trieval artifacts as derived cacheable state.
    463 -3. Every phase reads `knowledge_pack_summary_${featureId}.md` — not the raw pack.
         Only the retrieval module reads `pack.json` directly.
    464 -4. The OpenClaw `memory_search` semantic path emits a note in the spawn manifest c
         ontext block so the planning subagent can invoke `memory_search` natively. The ret
         rieval module does not subprocess into OpenClaw — it signals intent via manifest.
    465 -5. `knowledgePackLoader.mjs` must validate that all required top-level fields are
         present (`required_capabilities`, `required_outcomes`, `state_transitions`, `analo
         g_gates`, `sdk_visible_contracts`, `interaction_pairs`). Missing fields are logged
          as warnings, not hard failures — packs may be partially populated during bootstra
         pping.
    466 -
    467 -## Assumptions And Defaults
    468 -
    469 -- Default retrieval mode is `bm25_only` (`QA_PLAN_SEMANTIC_MODE` not set).
    470 -- `OPENCLAW_SESSION=1` is set by the OpenClaw launcher automatically; the retrieva
         l module does not set it.
    471 -- Semantic via qmd requires `qmd embed` to have been run against the knowledge-pac
         k collection before Phase 3 — this is a pre-condition documented in the operator g
         uide, not enforced at runtime (falls back to BM25 if no vectors exist).
    472 -- Pack files remain workspace-local under `knowledge-packs/`.
    473 -- `general` is the default fallback key when a qa-plan target has no explicit or i
         nferred pack key.
    474 -- Acceptance gates remain deterministic and contract-backed regardless of retrieva
         l mode.
    475 -
    476 -## Practical Guidance
    477 -
    478 -Use knowledge packs in this order:
    479 -
    480 -1. **Resolve** — decide which pack applies to the run
    481 -2. **Summarize** — turn raw pack content into a compact runtime artifact
    482 -3. **Retrieve** — use qmd BM25 first; semantic via OpenClaw memory_search or qmd q
         uery second
    483 -4. **Map** — force every relevant pack row into a scenario, gate, or explicit excl
         usion
    484 -5. **Audit** — make review artifacts prove that coverage stayed intact
    485 -6. **Gate** — block release recommendations when analog gates or critical interact
         ions are missing
    486 -
    487 -That is the difference between "the pack exists in the repo" and "the pack actuall
         y changes what the orchestrator produces."
    488 -
    489 -## References
    490 -
    491 -- `README.md` — "Enable QMD and Memory Search for OpenClaw" section
    492 -- `https://github.com/tobi/qmd` — qmd SDK and CLI
    493 -- `.agents/skills/qa-plan-evolution/scripts/lib/knowledgePackResolver.mjs`
    494 -- `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/knowledgePackCoverage.m
         js`
    495 -- `workspace-planner/skills/qa-plan-orchestrator/knowledge-packs/report-editor/pac
         k.json`
    496 -- `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/workflowState.mjs`
    497 -- `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/spawnManifestBuilders
         .mjs`