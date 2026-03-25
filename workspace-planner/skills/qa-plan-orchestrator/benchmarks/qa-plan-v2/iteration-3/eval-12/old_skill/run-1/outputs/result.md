# DOC-SYNC-001 — Docs phase contract sync check (qa-plan-orchestrator)

## Scope
Target artifact family: **qa-plan-orchestrator documentation set**.

Focus files (as requested):
- `SKILL.md`
- `README.md`
- `reference.md`
- “AGENTS docs” (not provided in evidence)

Primary phase/checkpoint under test: **docs** (phase contract alignment across docs).

Evidence mode: **blind_pre_defect** (use only provided evidence; do not assume missing unless contradicted by snapshot rule).

---

## Findings: alignment status across SKILL / README / reference

### 1) Orchestrator responsibilities and script-driven contract
**Status: aligned (SKILL ↔ reference ↔ README)**

- **SKILL.md (snapshot)** states the orchestrator has exactly three responsibilities: run `phaseN.sh`, interact for approvals/`REPORT_STATE`, spawn subagents from manifests and then run `--post`. It explicitly says the orchestrator **does not** do phase logic inline.
- **reference.md (snapshot + fixture)** defines the runtime/phase gates and the spawn-manifest execution contract (pass `sessions_spawn` args “as-is”, no `streamTo`).
- **README.md (snapshot + fixture)** describes the package at a high level and points to `SKILL.md` / `reference.md` as the active contract sources.

No conflict detected on this contract.

---

### 2) Phase model and outputs (Phase 0–7)
**Status: partially misaligned (README/fixture vs SKILL+reference snapshot)**

**Mismatch: README fixture introduces knowledge-pack artifacts not present in SKILL snapshot and not present in reference snapshot, but present in reference fixture.**

- **README (snapshot)** “What This Skill Produces” does **not** mention:
  - knowledge-pack summary/retrieval artifacts
  - `coverage_ledger_<feature-id>.json`
  It does mention deep research + support artifacts, manifests, drafts, and final.

- **README (fixture)** adds additional production outputs:
  - “knowledge-pack summary and retrieval artifacts saved under `context/`”
  - “machine-readable `coverage_ledger_<feature-id>.json` plus the migration-safe markdown ledger”
  - a dedicated “qmd Runtime” section describing `@tobilu/qmd` and semantic augmentation modes.

- **reference.md (snapshot)** Phase 0 outputs are only:
  - `context/runtime_setup_<feature-id>.md/.json`
  No knowledge-pack summary artifacts.

- **reference.md (fixture)** expands the contract:
  - Phase 0 includes `context/knowledge_pack_summary_<feature-id>.md/.json`
  - Phase 3 includes `context/knowledge_pack_retrieval_<feature-id>.md/.json`, `context/coverage_ledger_<feature-id>.json`, and `context/knowledge_pack_qmd.sqlite`
  - Also expands `task.json` and `run.json` required/additive fields for pack identity and retrieval mode.

**Conclusion:** The documentation set is not currently “staying aligned” across the three core docs in evidence:
- The **fixture README** and **fixture reference** describe a knowledge-pack + qmd + JSON-ledger capable system.
- The **skill snapshot SKILL.md** and **skill snapshot reference.md** do not include those additions.

Under a docs-phase contract check, this is a sync failure unless the repository is explicitly in a transition state (not stated in evidence).

---

### 3) Phase-to-reference mapping table
**Status: aligned (README snapshot ↔ README fixture)**

The phase mapping table appears consistent between snapshot README and fixture README for phases 1, 3, 4a, 4b, 5a, 5b, 6.

---

### 4) Required references list
**Status: aligned with minor emphasis differences**

- **SKILL.md** lists a “Required References” set including:
  - `reference.md`
  - phase contracts and review rubrics
  - `references/e2e-coverage-rules.md`, `references/subagent-quick-checklist.md`

- **README.md** “Active Contract Files” list includes the same plus:
  - `references/context-index-schema.md`
  - `knowledge-packs/` when mandatory
  - `references/docs-governance.md`

This is not a strict contradiction, but it does suggest README is the superset index. No explicit conflict.

---

### 5) AGENTS docs alignment
**Status: cannot be verified from provided evidence**

No “AGENTS” documentation content was included in the benchmark evidence. Per constraints, this check cannot be completed.

---

## Benchmark expectations evaluation

### Expectation 1: Case focus explicitly covered (SKILL.md, README.md, reference.md, AGENTS docs stay aligned)
**Result: Not satisfied (based on evidence)**

- SKILL/README/reference are **not aligned** regarding knowledge-pack + qmd runtime and JSON ledger artifacts (fixture vs snapshot divergence).
- AGENTS docs alignment cannot be verified (missing from evidence bundle).

### Expectation 2: Output aligns with primary phase docs
**Result: Satisfied (this output is a docs-phase contract sync review)**

This deliverable is strictly a documentation alignment/phase-contract check across the specified docs.

---

## Actionable doc-sync remediation (advisory)

1) **Pick the authoritative contract set** (snapshot vs fixture) for:
   - knowledge-pack lifecycle
   - qmd runtime behavior
   - additional Phase 0/3 artifacts
   - JSON forms of `coverage_ledger`

2) If knowledge-pack support is real/desired:
   - Update **SKILL.md** “What this skill does / required references / phase outputs” to mention knowledge-pack summary/retrieval and qmd constraints (or explicitly defer to `reference.md`).
   - Update **skill snapshot reference.md** Phase 0/3 artifact families and `task.json`/`run.json` additive fields to match the fixture reference.
   - Ensure **README.md** and **reference.md** agree on which artifacts are required vs optional.

3) If knowledge-pack support is not part of the current contract:
   - Remove or clearly mark as non-contract/experimental in **README.md** (and corresponding reference sections) to avoid claiming outputs the orchestrator does not produce.

4) Add/ensure an explicit **AGENTS documentation** pointer and keep it in the “Active Contract Files” list (or document why it is excluded), so the “AGENTS docs stay aligned” requirement is auditable.