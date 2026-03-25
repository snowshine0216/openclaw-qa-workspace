# DOC-SYNC-001 — DOCS phase contract (advisory)

Target: **qa-plan-orchestrator** documentation set

Focus: **SKILL.md, README.md, reference.md, and AGENTS docs stay aligned**

Primary phase under test: **docs**

Evidence mode: **blind_pre_defect**

## Findings (alignment check)

### 1) SKILL.md ↔ reference.md (skill snapshot)
**Status: Misaligned**

- **Knowledge-pack fields/artifacts:**
  - **SKILL snapshot `SKILL.md`** does **not** mention knowledge packs, qmd, pack-related runtime state fields, or pack artifacts.
  - **Fixture `reference.md`** adds knowledge-pack state (`knowledge_pack_*` fields in `task.json` and `run.json`) and artifacts (Phase 0 `knowledge_pack_summary_*`, Phase 3 `knowledge_pack_retrieval_*`, `coverage_ledger_*.json`, and `context/knowledge_pack_qmd.sqlite`).
  - This creates a contract mismatch between orchestrator behavior described in SKILL.md (what the orchestrator must support/expect) and the reference contract (what scripts and artifacts now require).

- **Required references list drift:**
  - **SKILL snapshot `SKILL.md`** lists required references (including `references/phase4a-contract.md`, `references/phase4b-contract.md`, `references/context-coverage-contract.md`, review rubrics, `references/e2e-coverage-rules.md`, `references/subagent-quick-checklist.md`).
  - **Fixture `README.md`** “Active Contract Files” includes the above plus **`references/context-index-schema.md`** and **`references/docs-governance.md`** and knowledge packs; SKILL.md’s “Always read” list does **not** include those.

### 2) README.md ↔ reference.md (fixture)
**Status: Misaligned**

- **README fixture claims additional outputs not reflected in reference fixture (or differs from snapshot reference):**
  - README fixture “What This Skill Produces” includes:
    - “knowledge-pack summary and retrieval artifacts saved under `context/`”
    - “machine-readable `coverage_ledger_<feature-id>.json` plus the migration-safe markdown ledger”
  - Reference fixture does include these artifacts under Phase 0 and Phase 3 (good), but **skill snapshot `README.md`** does **not** mention knowledge-pack summary/retrieval nor coverage-ledger JSON.

Net: README fixture and reference fixture appear mutually aligned on knowledge-pack additions, but **skill snapshot docs are behind**.

### 3) Spawn-manifest contract: SKILL.md ↔ reference.md
**Status: Partially aligned, with drift**

- Both the **skill snapshot `reference.md`** and **fixture `reference.md`** include the **sessions_spawn “pass args as-is; no streamTo for subagent runtime”** rule.
- **Fixture `reference.md`** adds a **pack-aware `source` block** schema and per-phase rules for pack metadata propagation. **SKILL snapshot `reference.md`** does not mention pack-aware `source` metadata.

This matters for “docs stay aligned” because SKILL.md instructs users to “See README.md for the phase-to-reference mapping table,” but the manifest contract that subagents/orchestrator rely on is now richer than SKILL.md implies.

### 4) AGENTS docs alignment
**Status: Blocked by missing evidence**

No AGENTS documentation content was provided in the benchmark evidence bundle.

Per benchmark instruction, we cannot claim AGENTS docs are missing; we can only state that **alignment cannot be assessed from provided evidence**.

## Advisory remediation (docs-only)

To restore alignment across the docs set:

1) **Update SKILL.md** to acknowledge knowledge-pack capability and the doc contract ownership split.
   - Minimal additions:
     - mention pack-aware runtime inputs/outputs (summary/retrieval/index) at a high level
     - add `references/context-index-schema.md` and `references/docs-governance.md` to the “Always read” list if they are truly contract-active

2) **Update skill snapshot `README.md`** “What This Skill Produces” to match fixture/reference:
   - include knowledge-pack summary/retrieval artifacts
   - include `coverage_ledger_<feature-id>.json`
   - include qmd runtime notes if they remain supported/required

3) **Update (or cross-link) skill snapshot `reference.md`** to include the pack-aware spawn-manifest `source` block additions if they are part of the current contract.

4) **AGENTS docs:** once available, ensure they reflect:
   - the same “Active Contract Files” set
   - the same phase-to-reference mapping
   - the same knowledge-pack and qmd runtime constraints

## Benchmark verdict

- **[phase_contract][advisory] SKILL.md, README.md, reference.md, and AGENTS docs stay aligned:** **NOT DEMONSTRATED / MISALIGNED** (misalignment found among provided docs; AGENTS not assessable from evidence)
- **[phase_contract][advisory] Output aligns with primary phase docs:** **Yes** (this deliverable is a docs-phase alignment check)