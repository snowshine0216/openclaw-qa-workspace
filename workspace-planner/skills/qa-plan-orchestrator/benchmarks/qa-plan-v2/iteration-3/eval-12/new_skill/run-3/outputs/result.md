# DOC-SYNC-001 — Docs Phase Contract Alignment Check (SKILL.md / README.md / reference.md / AGENTS)

## Scope (per benchmark)
Verify the **docs** artifact family stays aligned across:
- `SKILL.md`
- `README.md`
- `reference.md`
- **AGENTS docs** (not present in provided evidence bundle)

Primary phase/checkpoint under test: **docs**.

---

## Evidence-backed alignment findings

### 1) Orchestrator responsibilities and “script-driven only” contract
**SKILL.md states (authoritative):**
- Orchestrator has *exactly three responsibilities*: call `phaseN.sh`, interact for approval / `REPORT_STATE` choice, spawn subagents from `phaseN_spawn_manifest.json` then run `--post`.
- Orchestrator **does not** do phase logic inline, write artifacts, run validators directly, or make per-phase decisions outside the script contract.

**reference.md and README.md alignment:**
- `reference.md` reinforces script/manifest contract and spawn behavior, including the **sessions_spawn** “pass args as-is; do not add `streamTo`” rule.
- `README.md` positions `SKILL.md` as the entrypoint and `reference.md` as the runtime/artifact contract.

**Result:** Aligned between `SKILL.md`, `reference.md`, and `README.md`.

---

### 2) Phase model and artifact naming (phase gates / outputs)
**SKILL.md provides a phase-by-phase contract** (Phase 0 through 7), including outputs and interactions.

**reference.md provides the detailed artifact families per phase**, including:
- Run-root conventions (`runs/<feature-id>/context`, `drafts`, manifests, `qa_plan_final.md`)
- `REPORT_STATE` and `selected_mode` behavior
- Required `task.json` and `run.json` fields
- Artifact families for each phase

**README.md alignment:**
- “What this skill produces” list matches the artifact families described in `reference.md` at a high level (context evidence, deep research, coverage ledger, artifact lookup, versioned drafts, manifests, final plan after approval).
- “Phase-to-reference mapping” table is consistent with `SKILL.md`’s instruction that spawn manifests embed required references and that `README.md` contains the mapping table.

**Result:** Aligned across the three docs provided.

---

### 3) Research and support guardrails
**SKILL.md highlights:**
- Supporting issues must remain `context_only_no_defect_analysis`.
- Report-editor research must be **Tavily-first** with Confluence as recorded fallback.

**reference.md + README.md alignment:**
- `reference.md` defines:
  - `supporting_issue_policy` = `context_only_no_defect_analysis`
  - `deep_research_policy` = `tavily_first_confluence_second`
  - Tavily-first ordering and fallback recording requirements
- `README.md` reiterates these guardrails.

**Result:** Aligned across provided docs.

---

### 4) Known docs coverage gap (AGENTS)
The benchmark requires alignment checks including **AGENTS docs**.

**Evidence limitation:** The provided evidence bundle contains:
- `SKILL.md` (snapshot)
- `README.md` (snapshot + fixture)
- `reference.md` (snapshot + fixture)

No **AGENTS** documentation content is included in the evidence. Under the benchmark rule “use only the benchmark evidence,” we cannot verify whether any AGENTS docs:
- exist,
- are current,
- or are aligned with the phase model / contracts.

**Result:** **Blocker** for full compliance demonstration: AGENTS alignment cannot be assessed with the provided evidence.

---

## Advisory doc-sync conclusions

### Pass conditions met (within available evidence)
- `SKILL.md`, `README.md`, and `reference.md` are consistent on:
  - script-driven orchestrator role
  - phase sequencing and gates
  - artifact families and naming conventions
  - spawn manifest/sessions_spawn contract (`args` passed as-is; no `streamTo`)
  - Tavily-first and support-only policies

### Not verifiable in this benchmark run
- Alignment with **AGENTS docs** cannot be verified because AGENTS docs were not provided in the benchmark evidence bundle.