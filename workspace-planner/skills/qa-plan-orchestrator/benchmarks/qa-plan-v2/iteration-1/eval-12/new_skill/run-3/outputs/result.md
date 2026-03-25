# DOC-SYNC-001 — DOCS phase contract alignment check (advisory)

## Scope
Verify that the qa-plan-orchestrator documentation set stays aligned across the required docs:
- `SKILL.md`
- `README.md`
- `reference.md`
- AGENTS docs (not provided in this evidence bundle)

Primary phase under test: **docs** (documentation/phase-contract consistency).

## Evidence reviewed (authoritative)
- `skill_snapshot/SKILL.md`
- `skill_snapshot/README.md`
- `skill_snapshot/reference.md`
- `fixture:DOCS-blind-pre-defect-bundle/README.md`
- `fixture:DOCS-blind-pre-defect-bundle/reference.md`

## Alignment findings

### 1) Orchestrator responsibilities and non-goals are consistently stated
- `SKILL.md` defines the orchestrator’s **exact three responsibilities** (run `phaseN.sh`; handle user interactions for approval/`REPORT_STATE`; spawn from `phaseN_spawn_manifest.json` and then run `--post`) and explicitly states it **does not** perform phase logic inline or write artifacts/validators directly.
- `reference.md` complements this by specifying runtime state, artifact naming, manifests, phase gates, and the spawn manifest contract (including `sessions_spawn` args passthrough and the explicit “no `streamTo`” rule).
- `README.md` positions `SKILL.md` as entrypoint and `reference.md` as runtime/artifact contract; this matches the ownership section in `reference.md`.

**Result:** Aligned.

### 2) Phase model consistency (SKILL.md ↔ reference.md ↔ README.md)
- **Phases 0–7** are described in `SKILL.md` with entry scripts, responsibilities, outputs, and key user-interaction gates.
- `reference.md` enumerates artifacts by phase and defines runtime state fields (`task.json`, `run.json`), `REPORT_STATE` handling, round progression, coverage preservation rules, and validator names.
- `README.md` provides the phase-to-reference mapping table for spawned subagents; this supports the “Spawn Task Reference Instructions” section in `SKILL.md`.

Noted minor nuance:
- `SKILL.md` “Required References” list includes several `references/*` files (including `references/context-coverage-contract.md` and `references/e2e-coverage-rules.md`) and says “Always read”.
- `README.md` “Active Contract Files” list includes `references/docs-governance.md` and `references/context-index-schema.md`, which are not explicitly called out in `SKILL.md`’s “Always read” list (though `SKILL.md` does refer readers to `README.md` for mapping).

**Result:** Substantively aligned on phase model and contracts; minor “list completeness” differences are advisory-only.

### 3) Knowledge-pack + deep research policy consistency
- `SKILL.md` and `README.md` both encode **Tavily-first** deep research with **Confluence fallback** and require fallback reason recording.
- `reference.md` defines the deep research policy values and the concrete artifacts created under `context/`.
- `README.md`’s qmd runtime notes (no `qmd collection add`, collection created programmatically in Phase 3) are consistent with `SKILL.md` Phase 3 description and `reference.md` Phase 3 artifacts.

**Result:** Aligned.

### 4) Spawn manifest contract is consistently defined and anchored
- `reference.md` clearly defines manifest shape, pack-aware metadata, and the `sessions_spawn` passthrough rule (no added fields like `streamTo`).
- `SKILL.md` reiterates the same `openclaw.args` spawning behavior and the “do not add `streamTo`” constraint.

**Result:** Aligned.

### 5) README fixture vs skill_snapshot README/reference
- `fixture` `README.md` matches `skill_snapshot/README.md` content for the sections provided.
- `fixture` `reference.md` matches `skill_snapshot/reference.md` content for the sections provided (both show the same truncation at the end in this evidence).

**Result:** Aligned within provided evidence.

### 6) AGENTS docs alignment status
The benchmark focus includes “AGENTS docs stay aligned”, but **no AGENTS documentation content is present** in the provided evidence bundle.

**Result:** Cannot be validated from provided evidence (blocker for full coverage of the case focus).

## Advisory outcomes
- Documentation set (`SKILL.md`, `README.md`, `reference.md`) appears **internally consistent** on the orchestrator contract, runtime layout, phase model, spawn manifest contract, and research/support guardrails.
- **Open gap:** AGENTS docs alignment cannot be assessed without the AGENTS documents.

## Suggested doc-sync checks (non-invasive, no edits made)
If AGENTS docs exist in the repo, verify they match these contract anchors:
1. Orchestrator has only the three responsibilities from `SKILL.md`.
2. Phases 0–7 entrypoints and gating (including Phase 7 approval) match `SKILL.md`/`reference.md`.
3. Spawn contract: pass `requests[].openclaw.args` as-is; no `streamTo`.
4. Deep research ordering: `tavily-search` before any Confluence fallback; fallback reason recorded.
5. Artifact paths under `<skill-root>/runs/<feature-id>/` and per-phase artifact families match `reference.md`.

---

# Execution summary
- Checked consistency between `SKILL.md`, `README.md`, and `reference.md` using only the provided snapshot + fixture evidence.
- Found no contradictions affecting the phase contract for docs.
- Blocked on validating “AGENTS docs stay aligned” because AGENTS docs were not included in the evidence.