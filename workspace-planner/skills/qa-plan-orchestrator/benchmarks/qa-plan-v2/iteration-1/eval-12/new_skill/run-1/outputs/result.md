# DOC-SYNC-001 — DOCS phase contract alignment check (advisory)

## Target
Validate that the **docs set stays aligned** across:
- `SKILL.md`
- `README.md`
- `reference.md`
- AGENTS docs (not provided in evidence; see Blockers)

Primary phase under test: **docs** (phase contract / documentation alignment).

## Evidence reviewed (authoritative per benchmark)
- `skill_snapshot/SKILL.md`
- `skill_snapshot/README.md`
- `skill_snapshot/reference.md`
- `fixture:DOCS-blind-pre-defect-bundle/README.md`
- `fixture:DOCS-blind-pre-defect-bundle/reference.md`

## Alignment findings

### 1) Orchestrator responsibilities and script-driven contract
**SKILL.md** defines exactly three orchestrator responsibilities:
1) Call `phaseN.sh`
2) Interact with user for approval / `REPORT_STATE` choices
3) Spawn subagents from `phaseN_spawn_manifest.json`, wait, then run `phaseN.sh --post`

**reference.md** reinforces this via the spawn manifest contract and the `sessions_spawn` “pass args as-is / do not add `streamTo`” rule.

**README.md** is consistent: it points users to `SKILL.md` for entry behavior and `reference.md` for the runtime/artifact contract.

**Result:** Aligned.

### 2) Phase model consistency (0–7) and gates
Across **SKILL.md** and **reference.md**:
- Phase 0 initializes runtime state and manages `REPORT_STATE` / `selected_mode`.
- Phase 1 produces `phase1_spawn_manifest.json` and has a special `record_spawn_completion.sh` requirement before `--post`.
- Phase 2 builds `context/artifact_lookup_<feature-id>.md`.
- Phase 3 deep research (Tavily-first; Confluence fallback recorded) and coverage ledger.
- Phases 4a–6 are spawn-driven drafting/reviewing rounds with round progression and validators.
- Phase 7 finalizes (archive prior final, promote draft, generate summary, attempt notification) and requires explicit user approval.

**README.md** matches this phase model at a high level (what the skill produces + the phase-to-reference mapping table).

**Result:** Aligned at the docs-contract level.

### 3) Phase-to-reference mapping (README) matches “Required References” (SKILL) and runtime references (reference)
- **SKILL.md**: “Always read” list includes `reference.md` plus multiple `references/*.md` contracts.
- **README.md**: provides a phase-to-reference mapping table, including:
  - Phase 1 → `reference.md`, `references/context-coverage-contract.md`
  - Phase 4a/4b/5a/5b/6 → their respective contracts + `references/subagent-quick-checklist.md` (and Phase 6 adds `references/e2e-coverage-rules.md`)
- **reference.md**: “Active Runtime References” lists 4a/4b/5a/5b/6 rubrics (subset), and the broader set appears as artifact/contract references elsewhere.

**Result:** No conflicts detected; README’s mapping complements SKILL/reference without contradicting them.

### 4) Runtime layout and artifact naming consistency
- **SKILL.md** specifies run root layout under `<skill-root>/runs/<feature-id>/` including `context/`, `drafts/`, manifests, `task.json`, `run.json`, and `qa_plan_final.md`.
- **reference.md** matches and expands artifact families per phase.
- **README.md** “What This Skill Produces” matches key artifacts in `context/` and `drafts/` and mentions manifests at project root.

**Result:** Aligned.

### 5) Research/support guardrails consistency
- **SKILL.md** and **README.md** both state:
  - Supporting issues must remain `context_only_no_defect_analysis`.
  - Report-editor deep research must be Tavily-first with recorded Confluence fallback.
- **reference.md** codifies this in `supporting_issue_policy` and `deep_research_policy` and in “Bounded Supplemental Research” rules.

**Result:** Aligned.

## Doc-sync risks / minor gaps (advisory)
1) **AGENTS docs not verifiable from provided evidence.** The benchmark requires AGENTS docs stay aligned, but no AGENTS content is included in the evidence bundle.
2) **Truncation in `reference.md` validators list** appears in both snapshot and fixture (ends at `validate_unresol…`). This prevents confirming the complete validator set and whether README/SKILL mention any validators that might be missing/renamed later in the truncated section.

## Conclusion (benchmark expectations)
- **[phase_contract][advisory] Case focus explicitly covered:** Partially met. Alignment across `SKILL.md`, `README.md`, and `reference.md` is demonstrated from evidence; **AGENTS docs alignment cannot be assessed** with provided evidence.
- **[phase_contract][advisory] Output aligns with primary phase docs:** Met. This output is a docs-phase contract alignment check and does not introduce non-docs artifacts.

---

## Short execution summary
Reviewed the provided snapshot + fixture docs for cross-file contract consistency (orchestrator responsibilities, phase model, spawn/manifest contract, runtime layout, guardrails). Found the three primary docs (`SKILL.md`, `README.md`, `reference.md`) aligned within evidence. Blocked from assessing AGENTS docs due to absence in evidence; also noted `reference.md` validator list truncation limits completeness checks.