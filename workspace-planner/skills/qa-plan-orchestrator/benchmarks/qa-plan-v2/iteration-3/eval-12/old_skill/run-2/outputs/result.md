# DOC-SYNC-001 — Docs sync check (SKILL.md, README.md, reference.md, AGENTS)

## Scope (per benchmark)
Verify that the **qa-plan-orchestrator** documentation set stays aligned across:
- `SKILL.md`
- `README.md`
- `reference.md`
- AGENTS docs (not present in provided evidence)

Primary phase/checkpoint under test: **docs**.

## Evidence-based alignment findings

### 1) `SKILL.md` ↔ `README.md` (skill responsibilities + phase model)
**Status: Mostly aligned (PASS with notes)**

**Aligned points (confirmed)**
- Script-driven model and orchestrator responsibilities are consistent:
  - `SKILL.md` states orchestrator only: run `phaseN.sh`, manage user approvals/`REPORT_STATE`, spawn from manifests and run `--post`.
  - `README.md` positions `SKILL.md` as entrypoint and `reference.md` as runtime contract; it does not contradict responsibilities.
- Phase-to-reference mapping is present in `README.md` and is compatible with `SKILL.md`’s “required references are embedded in spawn task text” guidance.

**Potential doc-sync gap (advisory)**
- `SKILL.md` “Required References” list does **not** mention `references/docs-governance.md`, `references/context-index-schema.md`, or `references/docs-governance.md`, while `README.md` lists them under “Active Contract Files”. This is not necessarily a contract violation (SKILL vs README roles differ), but it is a sync risk because both sections look like “authoritative required docs” lists.

### 2) `SKILL.md` ↔ `reference.md` (runtime/phase contracts)
**Status: Not aligned between snapshot vs fixture (FAIL; pre-defect signal)**

There are **material differences** between the two provided versions of `reference.md`:

**Knowledge-pack support**
- **Fixture `reference.md`** includes knowledge-pack fields and artifacts:
  - `task.json` additive fields: `feature_family`, `knowledge_pack_key`, resolution metadata, pack version/path/row counts, `knowledge_pack_deep_research_topics`, etc.
  - `run.json` additive fields: `knowledge_pack_loaded_at`, summary/retrieval timestamps, retrieval/semantic modes, index artifact pointers.
  - Phase 0 outputs include `context/knowledge_pack_summary_<feature-id>.md/.json`.
  - Phase 3 outputs include `context/knowledge_pack_retrieval_<feature-id>.md/.json`, `context/coverage_ledger_<feature-id>.json`, and `context/knowledge_pack_qmd.sqlite`.
  - Spawn manifest contract includes a pack-aware `source` metadata block and per-phase rules for including summary/retrieval paths.

- **Snapshot `reference.md`** (provided in skill snapshot evidence) does **not** include these knowledge-pack additions; it stops at deep research and coverage ledger in markdown form and lacks pack-specific runtime fields and artifacts.

**README mismatch mirroring fixture**
- Fixture `README.md` also contains a **qmd runtime section** and mentions:
  - knowledge-pack summary/retrieval artifacts under `context/`
  - machine-readable `coverage_ledger_<feature-id>.json`
- Snapshot `README.md` does **not** include the qmd runtime section and does not mention the JSON ledger or pack retrieval artifacts.

**Resulting sync conclusion**
- The documentation set is **not consistently aligned** across `SKILL.md`, `README.md`, and `reference.md` as presented in the evidence bundle:
  - Snapshot docs describe a workflow without explicit knowledge-pack runtime/indexing artifacts.
  - Fixture docs describe a workflow with pack resolution, qmd indexing, and additional artifacts and manifest metadata.

This is exactly the kind of cross-doc drift this benchmark targets.

### 3) AGENTS documentation
**Status: Cannot verify (BLOCKER)**

The benchmark requires checking alignment with “AGENTS docs”, but **no AGENTS* files** (e.g., `AGENTS.md`, `docs/AGENTS.md`, etc.) are included in the provided evidence. Under the benchmark rules (“use only the benchmark evidence”), alignment with AGENTS documentation cannot be assessed.

## Benchmark expectations mapping

- **[phase_contract][advisory] Case focus explicitly covered: SKILL.md, README.md, reference.md, and AGENTS docs stay aligned**
  - Partially met: alignment checks for SKILL/README/reference performed, but **AGENTS cannot be verified** (missing in evidence).
  - Cross-doc drift detected between snapshot vs fixture for README/reference.

- **[phase_contract][advisory] Output aligns with primary phase docs**
  - Met: this deliverable is a docs-phase sync review of the specified files.

## Recommended doc-sync actions (advisory)
(Recommendations are limited to what can be inferred from evidence; no new files are modified here.)

1) Decide which reference model is authoritative:
   - If knowledge-pack/qmd support is now part of the contract, update **snapshot `SKILL.md`** (and snapshot `README.md`) to reflect:
     - knowledge-pack artifacts (Phase 0 summary, Phase 3 retrieval/index)
     - spawn-manifest `source` metadata rules
     - `task.json`/`run.json` additive knowledge-pack fields
   - If not, remove/relocate the fixture’s knowledge-pack sections (or clearly mark them as non-contract design notes) to avoid contract confusion.

2) Normalize “Required/Active Contract Files” lists:
   - Make `SKILL.md` “Required References” and `README.md` “Active Contract Files” consistent, or explicitly explain why they differ (e.g., orchestrator must read X, writers must read Y).

3) Add AGENTS documentation into the doc set (or include it in evidence bundles) and explicitly state how it must stay in sync with SKILL/README/reference.

---

## Short execution summary
- Checked provided evidence for `SKILL.md`, `README.md`, and `reference.md` across **skill snapshot** and **fixture**.
- Found a major drift: fixture docs include **knowledge-pack/qmd runtime** and additional artifacts/fields; snapshot docs largely do not.
- Could not evaluate “AGENTS docs” alignment because no AGENTS files were provided in evidence.