# DOC-SYNC-001 — Docs phase contract alignment check (SKILL.md / README.md / reference.md / AGENTS)

## Scope (per benchmark)
Primary phase/checkpoint under test: **docs**.

Case focus: ensure **SKILL.md**, **README.md**, **reference.md**, and **AGENTS docs** stay aligned.

Evidence mode: **blind_pre_defect** (use only provided snapshot/fixture evidence).

## Evidence reviewed
From the provided benchmark evidence:

- `skill_snapshot/SKILL.md`
- `skill_snapshot/README.md`
- `skill_snapshot/reference.md`
- `fixture:DOCS-blind-pre-defect-bundle/README.md`
- `fixture:DOCS-blind-pre-defect-bundle/reference.md`

No AGENTS documentation was provided in the evidence bundle.

## Alignment findings

### 1) SKILL.md ↔ reference.md ↔ README.md are **not fully aligned**

#### A. Knowledge-pack / qmd runtime content appears in fixture README/reference but not in snapshot SKILL.md/README/reference
- Fixture `README.md` contains a **“qmd Runtime”** section describing:
  - `@tobilu/qmd` BM25-first runtime index
  - pinned version `2.0.1`
  - explicit statement **no `qmd collection add` step**
  - semantic augmentation modes including `openclaw_memory`
  - block/allow semantics (BM25 failure blocks Phase 3 when pack active)
- Fixture `reference.md` expands the contract with **knowledge-pack fields** in `task.json`/`run.json` and adds **knowledge-pack artifacts** in Phase 0 and Phase 3, including:
  - `context/knowledge_pack_summary_<feature-id>.md/.json`
  - `context/knowledge_pack_retrieval_<feature-id>.md/.json`
  - `context/coverage_ledger_<feature-id>.json`
  - `context/knowledge_pack_qmd.sqlite`
  - spawn-manifest `source` metadata rules for pack identity and paths

But the snapshot docs differ:
- `skill_snapshot/README.md` “What This Skill Produces” does **not** mention knowledge-pack artifacts, coverage ledger JSON, qmd sqlite, etc.
- `skill_snapshot/reference.md` `task.json`/`run.json` additive fields do **not** include any knowledge-pack fields.
- `skill_snapshot/reference.md` artifact families do **not** list knowledge-pack summary/retrieval artifacts or coverage ledger JSON.

Result: the contract surface described by README/reference is inconsistent across snapshot vs fixture.

#### B. Phase 0 output set is inconsistent between snapshot SKILL.md vs snapshot reference.md vs fixture reference.md
- `skill_snapshot/SKILL.md` Phase 0 outputs include:
  - `context/runtime_setup_<feature-id>.md/.json`
  - `context/supporting_issue_request_<feature-id>.md`
  - `context/request_fulfillment_<feature-id>.md/.json`
- `skill_snapshot/reference.md` Phase 0 lists only:
  - `context/runtime_setup_<feature-id>.md/.json`
- `fixture reference.md` Phase 0 lists (adds pack summary artifacts):
  - `context/runtime_setup_<feature-id>.md/.json`
  - `context/knowledge_pack_summary_<feature-id>.md/.json`

At minimum, snapshot SKILL.md and snapshot reference.md disagree on whether Phase 0 is responsible for generating supporting-issue request + request fulfillment artifacts.

#### C. Spawn manifest contract differs between snapshot reference.md and fixture reference.md
- Snapshot `reference.md` describes a fixed manifest shape and orchestrator behavior.
- Fixture `reference.md` adds a contract extension: every `source` block **may additionally expose pack-aware runtime metadata**, plus per-phase rules about which pack paths appear.

This is a contract expansion that is not reflected in snapshot docs.

#### D. README “Active Contract Files” list differs from SKILL.md “Required References”
- `skill_snapshot/SKILL.md` “Required References” list includes:
  - `references/phase4a-contract.md`, `references/phase4b-contract.md`, `references/context-coverage-contract.md`, review rubrics, `references/e2e-coverage-rules.md`, `references/subagent-quick-checklist.md`, plus `reference.md`
- `skill_snapshot/README.md` “Active Contract Files” list includes additional references not present in SKILL.md required list:
  - `references/context-index-schema.md`
  - `references/docs-governance.md`
  - `knowledge-packs/` mention

This is not necessarily wrong (SKILL “Always read” vs README “Active contract files”), but it is an alignment risk because it implies differing “must read” sets.

### 2) AGENTS docs alignment cannot be verified from evidence
The benchmark expectation explicitly includes **AGENTS docs** alignment, but no AGENTS documentation was included in the provided evidence. Under the benchmark constraint “use only provided evidence”, this portion is **unverifiable**.

## Pass/Fail (advisory)
- **[phase_contract][advisory] Case focus explicitly covered (SKILL.md, README.md, reference.md, AGENTS stay aligned):**
  - **Not satisfied** as demonstrated by multiple contract mismatches (knowledge-pack/qmd additions; Phase 0 outputs; spawn manifest metadata extensions) and missing AGENTS evidence.
- **[phase_contract][advisory] Output aligns with primary phase docs:**
  - This check’s output is docs-focused and limited to documentation alignment, so **yes** (output aligns to docs phase intent), but the underlying docs set is **not aligned**.

## Recommended doc sync actions (to restore alignment)
1. Decide whether knowledge-pack/qmd support is part of the current contract. If yes, update **snapshot** `SKILL.md`, `README.md`, and `reference.md` to include:
   - knowledge-pack artifacts and Phase 0/3 outputs
   - `task.json`/`run.json` additive fields
   - spawn-manifest `source` metadata rules
   - the qmd runtime behavior and failure policy
2. If knowledge-pack/qmd support is **not** intended, remove or relocate the fixture README/reference additions so they do not appear as contract.
3. Reconcile Phase 0 outputs across `SKILL.md` and `reference.md`:
   - either add missing Phase 0 artifacts into `reference.md`, or move them to their correct phases in `SKILL.md`.
4. Provide/verify **AGENTS** documentation and ensure it reflects the same phase model, artifact naming, and pack behavior as `reference.md`.