# DOC-SYNC-001 — Docs phase contract alignment check (qa-plan-orchestrator)

## Scope (as required by case)
Focus files to keep aligned:
- `SKILL.md`
- `README.md`
- `reference.md`
- AGENTS docs (not included in provided evidence)

Primary phase under test: **docs**.

Evidence mode: **blind_pre_defect** (use only provided snapshot/fixture evidence; do not assume other repo files).

## Alignment verdict
### SKILL.md ↔ reference.md ↔ README.md
**Status: Aligned on core orchestrator contract (no contradictions found in provided evidence).**

The three docs consistently describe the same phase model and orchestrator responsibilities:

1) **Orchestrator responsibilities**
- `SKILL.md` states the orchestrator only:
  1. calls `phaseN.sh`
  2. interacts with user for approval / `REPORT_STATE` choice
  3. spawns subagents from `phaseN_spawn_manifest.json`, waits, then calls `phaseN.sh --post`
- `reference.md` reinforces this with the spawn-manifest contract and “pass `openclaw.args` exactly as-is” requirement.
- `README.md` stays high-level and does not introduce conflicting responsibilities.

2) **Phase model and outputs**
- `SKILL.md` enumerates phases 0–7 with entry scripts and key outputs.
- `reference.md` provides the authoritative artifact-family tables per phase (0–7) and runtime state fields.
- `README.md` describes “What This Skill Produces” in a way that matches the phase outputs described in the other two (e.g., context artifacts, drafts, spawn manifests, final promotion after approval).

3) **Spawn / sessions_spawn contract**
- `SKILL.md` explicitly warns not to add `streamTo` when spawning subagents.
- `reference.md` contains the same rule under **sessions_spawn contract**.
- `README.md` does not contradict it.

4) **Phase-to-reference mapping for spawned subagents**
- `SKILL.md` says: “See `README.md` for the phase-to-reference mapping table.”
- `README.md` contains a phase-to-reference mapping table.
- `reference.md` lists “Active Runtime References” and also defines many referenced contract files; no mismatch observed with README’s mapping.

5) **Support-only Jira and Tavily-first deep research policies**
- `SKILL.md` and `reference.md` both require:
  - supporting issues remain `context_only_no_defect_analysis`
  - Tavily-first, Confluence only as recorded fallback
- `README.md` repeats both guardrails.

## Notable doc-sync observations (advisory)
These are not necessarily defects, but are doc-sync risks or places where alignment could drift:

1) **AGENTS documentation cannot be verified with provided evidence**
- The benchmark requires ensuring “SKILL.md, README.md, reference.md, and AGENTS docs stay aligned.”
- No AGENTS doc content is present in the provided snapshot/fixture evidence.
- Therefore, alignment with AGENTS docs cannot be demonstrated from evidence.

2) **README claims an output that is not described in SKILL.md / reference.md**
- `README.md` includes: `developer_smoke_test_<feature-id>.md` “derived from P1 and `[ANALOG-GATE]` scenarios during Phase 7”.
- This artifact is **not mentioned** in the provided `SKILL.md` Phase 7 output list, and is **not listed** under Phase 7 artifact families in the provided `reference.md` excerpt.
- With current evidence, this is a **potential doc mismatch**: either README is ahead, or SKILL/reference are missing this output.

(Advisory note: because the `reference.md` validator list is truncated in the evidence, we cannot confirm whether later sections mention this artifact; we can only state it is not present in the shown Phase 7 artifact family list.)

## Conclusion for DOC-SYNC-001 (phase contract, advisory)
- **Pass (partial):** `SKILL.md`, `README.md`, and `reference.md` are broadly aligned on the orchestrator contract and phase model.
- **Blocker to full pass:** AGENTS docs were not included in the evidence bundle, so the required “stay aligned” check cannot be completed for that portion.
- **Advisory mismatch to investigate:** README’s `developer_smoke_test_<feature-id>.md` output is not reflected in the provided SKILL/reference phase outputs.

---

## Execution summary
Produced `./outputs/result.md` with a docs-alignment review limited strictly to provided benchmark evidence (skill snapshot + fixture bundle). Identified one unverifiable requirement (AGENTS docs not present) and one potential cross-doc output mismatch (`developer_smoke_test_<feature-id>.md`).