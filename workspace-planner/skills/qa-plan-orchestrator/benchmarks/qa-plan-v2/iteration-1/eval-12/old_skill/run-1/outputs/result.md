# DOC-SYNC-001 — Docs phase contract alignment check (qa-plan-orchestrator)

## Scope / focus
This benchmark checks whether the **docs** artifact family stays aligned across:

- `SKILL.md`
- `README.md`
- `reference.md`
- (and any AGENTS docs — not provided in evidence)

Primary phase under test: **docs** (documentation consistency / contract sync).

## Evidence-based findings

### 1) `README.md` is **not aligned** with `reference.md` on knowledge-pack outputs

**Fixture `README.md` claims additional outputs not present in the skill snapshot `README.md`:**

- Fixture `README.md` “What This Skill Produces” includes:
  - “knowledge-pack summary and retrieval artifacts saved under `context/`”
  - “machine-readable `coverage_ledger_<feature-id>.json` plus the migration-safe markdown ledger”
- Skill snapshot `README.md` “What This Skill Produces” **does not** mention:
  - knowledge-pack summary/retrieval artifacts
  - `coverage_ledger_<feature-id>.json`

**`reference.md` fixture expands the contract to include knowledge-pack artifacts and fields:**

- Adds `task.json` fields such as `knowledge_pack_key`, `knowledge_pack_version`, etc.
- Adds Phase 0 artifacts:
  - `context/knowledge_pack_summary_<feature-id>.md/.json`
- Adds Phase 3 artifacts:
  - `context/knowledge_pack_retrieval_<feature-id>.md/.json`
  - `context/coverage_ledger_<feature-id>.json`
  - `context/knowledge_pack_qmd.sqlite`
- Adds manifest `source` metadata for knowledge pack identity

But the **skill snapshot `reference.md` does not include those knowledge-pack additions** (it lists only the markdown ledger; no knowledge-pack artifacts/fields; no `coverage_ledger_<feature-id>.json`; no pack-aware manifest additions).

**Conclusion:** Within the evidence set, the docs are split between two different contract versions:

- Skill snapshot: contract without the knowledge-pack runtime additions in `reference.md`.
- Fixture: contract with knowledge-pack runtime additions in `reference.md` and `README.md`.

This is a docs sync failure for the benchmark focus (“SKILL.md, README.md, reference.md … stay aligned”).

### 2) `SKILL.md` “Required References” list is not aligned with `README.md` “Active Contract Files”

Skill snapshot `SKILL.md` “Required References” includes:

- `references/phase4a-contract.md`
- `references/phase4b-contract.md`
- `references/context-coverage-contract.md`
- `references/review-rubric-phase5a.md`
- `references/review-rubric-phase5b.md`
- `references/review-rubric-phase6.md`
- `references/e2e-coverage-rules.md`
- `references/subagent-quick-checklist.md`

But skill snapshot `README.md` “Active Contract Files” includes items not listed in `SKILL.md`:

- `references/context-index-schema.md`
- `knowledge-packs/` (conditional)
- `references/docs-governance.md`

This is not necessarily wrong (a “required” list can be smaller than an “active” list), but the benchmark’s “docs stay aligned” advisory expectation suggests these lists should either:

- match, or
- be explicitly defined as different scopes (e.g., “orchestrator must always read” vs “repo contains additional active contracts”).

No such explicit differentiation is present in the provided evidence.

### 3) AGENTS docs alignment cannot be verified from provided evidence

The benchmark focus includes “AGENTS docs”, but no AGENTS-related documentation was included in the evidence bundle. Under the benchmark rule “Use only the benchmark evidence listed below,” this check cannot be completed.

## Benchmark verdict (advisory)

- **[phase_contract][advisory] SKILL.md, README.md, reference.md stay aligned:** **FAIL (evidence indicates misalignment)**
  - Knowledge-pack contract additions appear in fixture `README.md` + fixture `reference.md` but not in skill snapshot `reference.md` and not in skill snapshot `README.md`.
  - `SKILL.md` required references list does not clearly reconcile with `README.md` active contract list.
- **[phase_contract][advisory] Output aligns with primary phase docs:** **PARTIAL**
  - This output is a docs-phase sync check and stays within “docs” scope.
  - However, AGENTS alignment cannot be assessed.

## Minimal remediation recommendations (docs-only)

1) Choose the authoritative contract version and sync all three files:
   - If knowledge packs are now part of the contract, update **skill snapshot** `reference.md` and `README.md` accordingly.
   - If not, remove/relocate the knowledge-pack section from the fixture docs.

2) Clarify scope of “Required References” vs “Active Contract Files”:
   - Add a short note in `SKILL.md` and/or `README.md` stating whether the lists must match, or why some are “active but not always required.”

3) Include AGENTS docs in the docs governance set or explicitly state where AGENTS guidance lives and how it stays in sync.