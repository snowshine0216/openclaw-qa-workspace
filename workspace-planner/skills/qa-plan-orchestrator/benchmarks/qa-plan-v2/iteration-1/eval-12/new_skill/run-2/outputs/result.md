# DOC-SYNC-001 — Docs phase contract alignment check (qa-plan-orchestrator)

## Scope (per benchmark focus)
Verify that the **docs** artifacts stay aligned with the current **qa-plan-orchestrator phase model and contract**, specifically across:

- `SKILL.md`
- `README.md`
- `reference.md`
- AGENTS docs (not provided in evidence bundle)

Evidence mode is **blind_pre_defect**: only provided snapshot/fixture evidence is used.

---

## Alignment results

### 1) `SKILL.md` ↔ `reference.md` (contract + phase model)
**Status: Aligned on the core orchestrator contract and phase sequencing.**

**Matched contract points (consistent across docs):**
- Orchestrator responsibilities: run `phaseN.sh`, handle user approvals / `REPORT_STATE` choice, spawn subagents from `phaseN_spawn_manifest.json`, then run `phaseN.sh --post`.
- Runtime root convention: artifacts live under `<skill-root>/runs/<feature-id>/`.
- Spawn manifest contract: orchestrator spawns `requests[].openclaw.args` **as-is** and must **not add `streamTo`**.
- Phase model enumerated consistently (0 through 7) with per-phase entry script, spawn behavior, and `--post` validation gates.

**Notable drift/risks observed (advisory):**
- `SKILL.md` “Required References” list includes several `references/*.md` files (e.g., `references/phase4a-contract.md`, `references/review-rubric-phase6.md`, etc.). `reference.md` also lists “Active Runtime References”, but the sets are not identical in the provided evidence (SKILL.md’s list is broader). This is not necessarily a defect, but it is a documentation alignment risk if “Always read” is interpreted as a strict required set.

---

### 2) `README.md` ↔ `SKILL.md` / `reference.md` (human guide vs contract)
**Status: Largely aligned; one clear contract mismatch.**

**Strong alignment:**
- `README.md` correctly points to `SKILL.md` as entrypoint and `reference.md` as runtime/artifact contract.
- `README.md` “Phase-to-Reference Mapping” is consistent with the general phase decomposition described in `SKILL.md` and `reference.md` (Phase 1/3/4a/4b/5a/5b/6 mapping to contract/rubric files).
- `README.md` guardrails match contract language (support-only issues remain context-only; Tavily-first before Confluence fallback; context artifacts must appear in `artifact_lookup`).

**Mismatch (advisory but material):**
- `README.md` claims the skill produces:
  - `developer_smoke_test_<feature-id>.md` under `context/`, derived during Phase 7.
- In the provided `SKILL.md` Phase 7 output list and `reference.md` Phase 7 artifact families, **`developer_smoke_test_<feature-id>.md` is not listed**.

**Why this matters for DOC-SYNC-001:**
The benchmark requires docs (`SKILL.md`, `README.md`, `reference.md`, AGENTS docs) to “stay aligned”. Here, `README.md` asserts an additional produced artifact not reflected in the contract documents.

**Recommended resolution (choose one to re-align):**
1) If `developer_smoke_test_<feature-id>.md` is truly produced by Phase 7, update:
   - `SKILL.md` Phase 7 “Output” section to include it, and
   - `reference.md` Phase 7 “Artifact Families” to include it.
2) If it is no longer produced, remove it from `README.md` “What This Skill Produces”.

---

### 3) Fixture bundle vs snapshot (README/reference)
**Status: Fixture and snapshot content for `README.md` and `reference.md` appear consistent in the provided evidence excerpts.**
No additional drift detected between the snapshot and fixture versions for those two files.

---

### 4) AGENTS docs alignment
**Status: Not verifiable from provided evidence.**

The benchmark focus includes “AGENTS docs stay aligned”, but no AGENTS document content is included in the evidence bundle. In blind evidence mode, this cannot be assessed.

**Blocker (evidence limitation):** Missing AGENTS docs content in provided evidence.

---

## Conclusion (DOC-SYNC-001)
- **Pass (partial) on core phase model and orchestrator contract alignment** between `SKILL.md` and `reference.md`, and generally with `README.md`.
- **Advisory doc-sync issue found:** `README.md` lists `developer_smoke_test_<feature-id>.md` as a produced artifact, but `SKILL.md` and `reference.md` do not include it in Phase 7 outputs/artifact families.
- **AGENTS docs alignment cannot be validated** with the provided evidence.