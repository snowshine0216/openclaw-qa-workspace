# DOC-SYNC-001 — Docs phase contract alignment check (qa-plan-orchestrator)

## Scope (required by benchmark)
Verify that these docs stay aligned:
- `SKILL.md`
- `README.md`
- `reference.md`
- AGENTS docs (not present in provided evidence; cannot be evaluated)

Primary phase under test: **docs**. Evidence mode: **blind_pre_defect**.

## Findings: alignment status

### 1) `SKILL.md` ↔ `reference.md`: **Not aligned** (contract drift)
**Knowledge-pack / docs governance awareness present in `SKILL.md` and `README.md`, but missing from the `skill_snapshot/reference.md`.**

Evidence:
- `skill_snapshot/README.md` declares active contract files include **`references/docs-governance.md`** and **`knowledge-packs/` when a feature family has a mandatory pack**.
- `fixture` docs expand on knowledge-pack runtime details and add many knowledge-pack fields/artifacts in `reference.md`.
- `skill_snapshot/reference.md` (authoritative snapshot) does **not** include:
  - any `task.json` knowledge-pack fields (e.g., `knowledge_pack_key`, resolution metadata)
  - any `run.json` knowledge-pack fields
  - knowledge-pack artifacts in Phase 0 / Phase 3 families
  - spawn-manifest `source` metadata rules for knowledge-pack activation

Impact:
- If users follow `README.md` (or fixtures), they will expect knowledge-pack behaviors and artifacts that the snapshot `reference.md` does not contractually specify.
- This violates the “docs stay aligned” expectation across the required doc set.

### 2) `README.md` ↔ `reference.md`: **Not aligned** (What This Skill Produces)
**Mismatch in produced artifacts.**

Evidence:
- `skill_snapshot/README.md` “What This Skill Produces” includes:
  - `developer_smoke_test_<feature-id>.md` under `context/`, derived during Phase 7
- `skill_snapshot/reference.md` Artifact Families **do not include** `developer_smoke_test_<feature-id>.md` under any phase.

Impact:
- The README promises an artifact not present in the runtime artifact contract.

### 3) `SKILL.md` ↔ `README.md`: **Mostly aligned**, with one notable omission risk
Aligned items (both support):
- Script-driven orchestration, spawn/--post loop, and “orchestrator does not perform phase logic inline”.
- Tavily-first deep research policy with Confluence fallback.
- Phase-to-reference mapping table exists in `README.md` consistent with `SKILL.md` “Spawn Task Reference Instructions”.

Omission risk:
- `SKILL.md` “Required References” list does **not** mention `references/docs-governance.md` or `references/context-index-schema.md`, both listed in `README.md` active contract set.
  - This could be acceptable if “Required References” in `SKILL.md` is intentionally minimal, but as written it reads as an “always read” list.

### 4) AGENTS docs: **Cannot be verified from provided evidence**
The benchmark requires checking that “AGENTS docs stay aligned,” but no AGENTS documentation content was included in the evidence bundle.
- Per benchmark instruction: do not claim they are missing.
- With evidence-only restriction, alignment cannot be assessed.

## Conclusion (docs phase checkpoint)
- The documentation set is **not fully aligned** across `SKILL.md`, `README.md`, and `reference.md`.
- Primary drifts:
  1) Knowledge-pack contract material appears in `README.md`/fixture `reference.md` but not in snapshot `reference.md`.
  2) `README.md` promises `developer_smoke_test_<feature-id>.md`, but snapshot `reference.md` does not contract it.
  3) `SKILL.md` “Always read” reference list does not include all docs that `README.md` marks as active contract.

## Advisory remediation targets (to restore alignment)
(Advisory only; no code changes executed)
1) Decide which contract is authoritative for knowledge-pack support:
   - If supported: update snapshot `reference.md` to include the knowledge-pack fields/artifacts/manifest metadata rules reflected in the fixture.
   - If not supported: remove/soften knowledge-pack claims in `README.md` and any other docs.
2) Reconcile `developer_smoke_test_<feature-id>.md`:
   - Either add it to `reference.md` Artifact Families (likely Phase 7) or remove it from README “What This Skill Produces”.
3) Reconcile `SKILL.md` “Required References” vs `README.md` “Active Contract Files”:
   - Either expand `SKILL.md` list or clarify that phase manifests embed additional required references.

---

# Execution summary
- Checked cross-document consistency using only the provided snapshot/fixture evidence.
- Determined the docs are not fully synchronized: knowledge-pack and produced-artifact claims diverge between `README.md` and `reference.md` in the authoritative snapshot.
- AGENTS alignment could not be evaluated with the provided evidence.