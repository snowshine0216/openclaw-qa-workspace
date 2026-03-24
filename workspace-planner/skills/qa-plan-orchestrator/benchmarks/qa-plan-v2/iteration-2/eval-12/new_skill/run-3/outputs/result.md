# DOC-SYNC-001 — Docs Phase Contract Alignment Check (qa-plan-orchestrator)

## Scope (as required by case)
This check is limited to **documentation alignment** across:
- `SKILL.md`
- `README.md`
- `reference.md`
- “AGENTS docs” (not present in provided evidence; see Blockers)

Primary phase/checkpoint under test: **docs**.

## Evidence-based alignment findings

### 1) Orchestrator responsibilities and “script-driven only” contract
**Aligned between `SKILL.md` and the docs set shown.**
- `SKILL.md` clearly states the orchestrator only:
  1) calls `phaseN.sh`,
  2) interacts for approvals / `REPORT_STATE` choice,
  3) spawns subagents from `phaseN_spawn_manifest.json` then calls `--post`.
- `reference.md` reinforces this with concrete spawn-manifest rules and the `sessions_spawn` “pass args as-is” constraint.
- `README.md` positions `SKILL.md` as the entrypoint and `reference.md` as the runtime/artifact contract.

**No contradictions detected** within the provided snapshot/fixture copies.

### 2) Phase model and artifact naming
**Broadly aligned across `SKILL.md`, `reference.md`, and `README.md` for phases 0–7 and the artifact families.**
- `SKILL.md` defines phases 0–7 with entry scripts and phase outputs.
- `reference.md` provides the canonical artifact families per phase and runtime state fields.
- `README.md` “What this skill produces” matches the core artifact families described in `reference.md` (context artifacts, drafts, manifests, final).

#### Notable mismatch (docs drift)
- `README.md` lists `developer_smoke_test_<feature-id>.md` as a produced artifact “during Phase 7”, derived from P1 and `[ANALOG-GATE]` scenarios.
- In the provided `reference.md` (snapshot + fixture), Phase 7 artifact families list only:
  - `context/finalization_record_<feature-id>.md`
  - `qa_plan_final.md`
- In the provided `SKILL.md`, Phase 7 describes finalization record, final plan summary generation, and Feishu notification attempt; it **does not mention** `developer_smoke_test_<feature-id>.md`.

**Impact:** readers following `reference.md`/`SKILL.md` would not expect the smoke test artifact that `README.md` claims is produced. This is an **alignment issue within the docs set**.

### 3) Required references and phase-to-reference mapping
**Aligned in intent, but not identical in expression (no hard conflict).**
- `SKILL.md` has a global “Required References: Always read …” list (includes `reference.md`, several contracts/rubrics).
- `README.md` provides a phase-to-reference mapping table (which is compatible with the idea that manifests embed phase-specific references).
- `reference.md` defines “Active Runtime References” and other reference rules.

No direct contradictions were found; the docs complement each other.

### 4) Tavily-first / Confluence fallback policy
**Aligned across `SKILL.md`, `reference.md`, and `README.md`.**
- All emphasize Tavily-first ordering and explicitly-recorded Confluence fallback rationale.

### 5) Support-only Jira policy (`context_only_no_defect_analysis`)
**Aligned across `SKILL.md`, `reference.md`, and `README.md`.**
- All emphasize support issues are context evidence only and not defect-analysis triggers.

## AGENTS documentation alignment
Unable to assess. No AGENTS/agents documentation was included in the provided benchmark evidence bundle.

## Conclusion for DOC-SYNC-001
- **Pass (partial) for SKILL.md / README.md / reference.md alignment** on core orchestrator contract and phase model.
- **Docs drift identified**: `README.md` claims an additional output artifact (`developer_smoke_test_<feature-id>.md`) not reflected in `reference.md` Phase 7 artifact families nor described in `SKILL.md`.
- **AGENTS docs alignment cannot be verified** with the provided evidence.

## Recommended doc fixes (to restore alignment)
Choose one approach (evidence does not indicate which is correct):
1) If `developer_smoke_test_<feature-id>.md` is real contract output:
   - Add it to `reference.md` Phase 7 artifact families and (optionally) to `SKILL.md` Phase 7 description.
2) If it is legacy/aspirational:
   - Remove it from `README.md` or mark it explicitly as non-contract / optional.

---

# Execution summary
Reviewed the provided snapshot/fixture copies of `SKILL.md`, `README.md`, and `reference.md` for phase-model and artifact-contract consistency, focusing on the benchmark’s “docs” phase contract requirement that these docs stay aligned. Identified one concrete artifact-list mismatch and a missing-evidence blocker for AGENTS docs.