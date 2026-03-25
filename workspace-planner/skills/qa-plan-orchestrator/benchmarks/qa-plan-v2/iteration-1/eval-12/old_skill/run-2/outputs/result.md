# DOC-SYNC-001 — Docs sync check (qa-plan-orchestrator)

## Scope (as requested)
Verify that **SKILL.md**, **README.md**, **reference.md**, and **AGENTS docs** stay aligned, and that outputs align with the **primary phase: `docs`**.

Evidence provided includes `SKILL.md`, `README.md`, and `reference.md` (two variants: skill snapshot vs fixture). **No AGENTS documentation is included in the evidence**, so AGENTS alignment cannot be verified in this benchmark run.

## Findings

### 1) SKILL.md ↔ README.md alignment
**Status: Mostly aligned; one mismatch identified.**

Aligned points (present in snapshot SKILL.md and snapshot README.md):
- Script-driven orchestration responsibilities: run `phaseN.sh`, handle user approval/`REPORT_STATE`, spawn subagents from `phaseN_spawn_manifest.json`, then run `--post`.
- Orchestrator does not do phase logic inline.
- Tavily-first deep research, Confluence fallback only as recorded.
- Spawn contract: pass `requests[].openclaw.args` as-is; do not add `streamTo`.
- Phase-to-reference mapping table exists in README.

Mismatch:
- Snapshot README.md **does not mention** knowledge-pack artifacts, qmd runtime, or coverage ledger JSON. Fixture README.md **adds**:
  - knowledge-pack summary/retrieval artifacts
  - machine-readable `coverage_ledger_<feature-id>.json`
  - qmd runtime section and semantic mode behavior

This indicates the docs set is **not fully synchronized** across variants.

### 2) SKILL.md ↔ reference.md alignment
**Status: Not aligned between snapshot vs fixture; knowledge-pack contract drift.**

- Snapshot `reference.md` defines:
  - Phase 0 outputs only `runtime_setup_<feature-id>.md/.json`
  - Phase 3 outputs only markdown coverage ledger and deep-research artifacts (no knowledge-pack artifacts, no coverage ledger JSON)
  - No knowledge-pack fields in `task.json` / `run.json`

- Fixture `reference.md` expands the contract materially:
  - Adds knowledge-pack identity and resolution fields to `task.json`.
  - Adds knowledge-pack timestamps and artifact pointers to `run.json`.
  - Adds Phase 0 knowledge-pack summary artifacts.
  - Adds Phase 3 knowledge-pack retrieval artifacts (`.md/.json`), coverage ledger JSON, and `knowledge_pack_qmd.sqlite`.
  - Adds spawn-manifest `source` metadata for knowledge-pack awareness.

Given DOC-SYNC-001’s goal (“docs stay aligned”), the evidence shows a **clear inconsistency**: the fixture `reference.md` and README describe pack/qmd functionality that is **not reflected** in the snapshot `reference.md` and snapshot README.

### 3) README.md ↔ reference.md alignment
**Status: Depends on which pair; snapshot pair aligns, fixture pair aligns, but snapshot vs fixture diverge.**

- Snapshot README.md and snapshot reference.md are consistent with each other (no knowledge-pack/qmd/ledger JSON contract described).
- Fixture README.md and fixture reference.md are consistent with each other (both describe knowledge-pack/qmd/ledger JSON).

So the doc set appears to have **two competing versions** of the contract.

### 4) AGENTS docs alignment
**Status: Cannot be assessed with provided evidence.**

No AGENTS documentation was included in the benchmark evidence bundle. Per benchmark rules, we cannot infer its contents or claim its presence/absence beyond the evidence.

## Conclusion (phase-contract advisory)
- **Expectation: “SKILL.md, README.md, reference.md, and AGENTS docs stay aligned”** → **Not satisfied** based on:
  - demonstrable contract drift between snapshot vs fixture for README/reference (knowledge packs, qmd runtime, coverage-ledger JSON)
  - inability to verify AGENTS docs alignment due to missing evidence

- **Expectation: “Output aligns with primary phase docs”** → This benchmark run produces only a docs-sync assessment. It is aligned to the `docs` checkpoint in the sense that it evaluates documentation consistency; however, **the underlying docs are not consistent** across provided evidence.

## Recommended doc-sync remediation (advisory)
1. Choose the authoritative contract version (with or without knowledge-pack/qmd/ledger-JSON support).
2. Update **all** of: `SKILL.md`, `README.md`, `reference.md`, and AGENTS docs to reflect the same:
   - artifact families
   - `task.json` / `run.json` fields
   - Phase 0/3 outputs
   - spawn-manifest metadata
3. Add a small “Docs version / last synced” note (or a single source-of-truth section) to prevent future drift.