# DOC-SYNC-001 — Docs phase contract alignment check (advisory)

## Scope
Target artifact family: **qa-plan-orchestrator docs**.
Focus docs that must stay aligned:
- `SKILL.md`
- `README.md`
- `reference.md`
- AGENTS docs (not present in provided evidence)

Primary phase/checkpoint under test: **docs**.
Evidence mode: **blind_pre_defect** (only assess what is provided; do not infer missing files beyond the evidence set).

## Evidence reviewed (authoritative)
- `skill_snapshot/SKILL.md`
- `skill_snapshot/reference.md`
- `skill_snapshot/README.md`
- `fixture:DOCS-blind-pre-defect-bundle/README.md`
- `fixture:DOCS-blind-pre-defect-bundle/reference.md`

## Alignment findings

### 1) SKILL.md ↔ reference.md: orchestrator responsibilities and contract
**Aligned.**
- **SKILL.md** states the orchestrator has exactly three responsibilities: run `phaseN.sh`, interact with user for approvals/`REPORT_STATE` choices, and spawn subagents from `phaseN_spawn_manifest.json` then run `phaseN.sh --post`.
- **reference.md** defines the runtime state, artifact naming, manifests, and phase gates, and reiterates the spawn-manifest contract (spawn `requests[].openclaw.args` as-is; do not add `streamTo`).

No contradictions observed in responsibilities, phase flow, or spawn contract.

### 2) README.md ↔ SKILL.md: entrypoints, required references, and phase-to-reference mapping
**Aligned.**
- Both indicate:
  - Skill entrypoint: `SKILL.md`
  - Runtime/artifact contract: `reference.md`
  - Writer/reviewer rules: `references/*.md`
- **SKILL.md** lists “Required References” (including `reference.md` plus multiple `references/*.md`).
- **README.md** provides a phase-to-reference mapping table and explicitly says each spawned subagent is instructed via task text; this matches **SKILL.md**’s note that manifests embed required references in task text and the orchestrator does not attach references.

### 3) README.md ↔ reference.md: artifact families and outputs
**Mostly aligned; one documentation mismatch detected (advisory).**

**Aligned items**
- Both define run-root layout with `context/`, `drafts/`, manifests, `task.json`, `run.json`, and `qa_plan_final.md`.
- Both describe phase-scoped draft naming (`qa_plan_phase4a_r<round>.md`, etc.) and round progression.
- Both capture Tavily-first policy and supporting-issue context-only policy.

**Mismatch / potential doc-sync defect (advisory)**
- **README.md** claims the skill produces:
  - `developer_smoke_test_<feature-id>.md` under `context/`, derived from P1 and `[ANALOG-GATE]` scenarios during Phase 7.
- **reference.md** (provided evidence) does **not** list `developer_smoke_test_<feature-id>.md` under Phase 7 artifact families (it lists only `context/finalization_record_<feature-id>.md` and `qa_plan_final.md`), nor elsewhere in Artifact Families.

**Impact**
- Readers may treat README as “what gets produced” and expect a smoke-test artifact, but reference.md is the contract document for artifact naming/gates. This is a docs misalignment within the docs set.

**Recommended resolution** (choose one to re-sync)
1) If the smoke-test artifact is truly part of the workflow contract, add it to `reference.md` under Phase 7 (and/or the appropriate phase), including naming and any gating/derivation rules.
2) If it is non-contract or deprecated, adjust `README.md` to:
   - remove it from “What This Skill Produces”, or
   - label it explicitly as optional / future / non-contract, consistent with docs governance.

### 4) Fixture docs ↔ snapshot docs
**Aligned (fixture matches snapshot for provided files).**
- `fixture README.md` matches `skill_snapshot/README.md` content in the provided evidence.
- `fixture reference.md` matches `skill_snapshot/reference.md` content in the provided evidence sections.

### 5) AGENTS docs alignment
**Not assessable from provided evidence.**
- The benchmark asks to keep “AGENTS docs” aligned, but no AGENTS documentation content was included in the evidence bundle.
- Under blind evidence rules, this check cannot be completed; only record the gap.

## Benchmark expectation coverage
- **[phase_contract][advisory] SKILL.md, README.md, reference.md, and AGENTS docs stay aligned**
  - SKILL/README/reference: **partially satisfied** (one README↔reference artifact-family mismatch identified).
  - AGENTS docs: **blocked by missing evidence in provided bundle**.
- **[phase_contract][advisory] Output aligns with primary phase docs**
  - This report is a docs-phase alignment review and only addresses documentation contracts and sync.

## Summary verdict (advisory)
- **Docs set is largely consistent** on orchestrator responsibilities, phase model, spawn-manifest contract, and policies.
- **One actionable doc-sync mismatch**: `developer_smoke_test_<feature-id>.md` is claimed in README but not present in reference.md artifact families.
- **AGENTS docs alignment cannot be verified** with the provided benchmark evidence.