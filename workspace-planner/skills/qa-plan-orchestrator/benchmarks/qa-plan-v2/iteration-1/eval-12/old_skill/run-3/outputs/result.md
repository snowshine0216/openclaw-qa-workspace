# DOC-SYNC-001 — DOCS phase contract alignment check (blind pre-defect)

## Scope (per case focus)
Verify that the **docs set stays aligned** across:
- `SKILL.md`
- `README.md`
- `reference.md`
- AGENTS docs (not provided in evidence bundle)

Primary phase under test: **docs** (documentation/contract sync).

## Evidence used
Authoritative snapshot (skill package):
- `skill_snapshot/SKILL.md`
- `skill_snapshot/README.md`
- `skill_snapshot/reference.md`

Fixture bundle (blind pre-defect):
- `fixture:DOCS-blind-pre-defect-bundle/README.md`
- `fixture:DOCS-blind-pre-defect-bundle/reference.md`

## Alignment findings

### 1) `README.md` vs `reference.md` (fixture bundle): **NOT aligned**
The fixture `README.md` claims **knowledge-pack retrieval artifacts and a machine-readable JSON coverage ledger** are produced:
- “knowledge-pack summary and retrieval artifacts saved under `context/`”
- “machine-readable `coverage_ledger_<feature-id>.json` plus the migration-safe markdown ledger”
- Also includes a dedicated “qmd Runtime” section (qmd BM25-first runtime index; semantic mode flags; failure behavior).

The fixture `reference.md` *does* include knowledge-pack fields and artifacts (Phase 0 includes `knowledge_pack_summary_*`; Phase 3 includes `knowledge_pack_retrieval_*` and `coverage_ledger_*.json`, plus `context/knowledge_pack_qmd.sqlite`).

However, the **authoritative snapshot** `reference.md` and `README.md` do **not** include these knowledge-pack expansions (see below), creating a **doc-set split** between snapshot vs fixture.

### 2) Snapshot `SKILL.md`/`README.md`/`reference.md`: **internally aligned**, but diverge from fixture
Within the snapshot:
- `SKILL.md` describes required references, script-driven responsibilities, phase loop, and artifacts like `context/coverage_ledger_<feature-id>.md` (markdown) and various deep research artifacts.
- Snapshot `reference.md` enumerates artifact families and **does not** list knowledge-pack summary/retrieval artifacts, `coverage_ledger_*.json`, or qmd runtime/index artifacts.
- Snapshot `README.md` likewise does **not** mention knowledge-pack summary/retrieval, JSON coverage ledger, or qmd runtime.

So the snapshot docs are mutually consistent, but the **fixture bundle introduces additional contract surface** not reflected in the snapshot.

### 3) Specific contract mismatches: fixture introduces new additive fields/artifacts absent from snapshot
Compared to snapshot `reference.md`, fixture `reference.md` adds:
- `task.json` additive fields: `feature_family`, `knowledge_pack_key`, `requested_knowledge_pack_key`, `resolved_knowledge_pack_key`, resolution source, pack version/path/row count, pack deep research topics, etc.
- `run.json` additive fields: `knowledge_pack_loaded_at`, `knowledge_pack_summary_generated_at`, retrieval timestamps/modes, semantic warnings, summary/retrieval/index artifact pointers.
- Artifact families:
  - Phase 0: `context/knowledge_pack_summary_<feature-id>.md/.json`
  - Phase 3: `context/knowledge_pack_retrieval_<feature-id>.md/.json`, `context/coverage_ledger_<feature-id>.json`, `context/knowledge_pack_qmd.sqlite`
- Spawn manifest `source` metadata with knowledge-pack identity and paths, plus phase-specific rules.

None of these appear in snapshot `SKILL.md`/`README.md`/`reference.md`.

## AGENTS docs status
AGENTS documentation was **not provided in the benchmark evidence**, so alignment involving AGENTS docs **cannot be verified** under “use only provided evidence” constraints.

## Conclusion (phase_contract, advisory)
- **Expectation: “SKILL.md, README.md, reference.md, and AGENTS docs stay aligned” → NOT demonstrated / currently failing** based on provided evidence.
  - Snapshot docs are aligned with each other.
  - Fixture docs (README/reference) include expanded knowledge-pack + qmd + JSON ledger contract that is not present in snapshot docs.
  - AGENTS docs cannot be assessed.

## Advisory remediation (docs sync actions)
To restore alignment, choose one coherent contract line and update *all* docs accordingly:
1) If knowledge-pack + qmd + JSON ledger are **real current contract**:
   - Add the knowledge-pack artifacts/fields/manifest metadata to snapshot `reference.md` and summarize in snapshot `README.md` and/or `SKILL.md` where appropriate.
2) If those are **not part of current contract**:
   - Remove or clearly mark as non-contract/experimental from fixture `README.md` and fixture `reference.md` (or ensure fixture reflects snapshot).
3) Provide/align AGENTS docs:
   - Ensure AGENTS guidance references the same phase-to-reference mapping and artifact lists, and does not contradict the active contract files.