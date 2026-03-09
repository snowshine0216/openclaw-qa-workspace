# Design Review: Feature QA Planning Orchestrator Enhancement Plan

**Reviewer:** Design self-consistency and guardrail audit  
**Date:** 2026-03-10  
**Document under review:** `FEATURE_QA_PLANNING_ORCHESTRATOR_ENHANCEMENT_PLAN.md`

---

## Executive Summary

The design is **substantial and well-structured**, with strong coverage of contract enforcement, context traceability, and phase gates. However, several **phase-numbering inconsistencies**, **missing edge-case definitions**, and **ambiguous guardrail thresholds** should be fixed before implementation. Overall assessment: **pass with advisories** — address P0/P1 items before finalization.

---

## 1. Self-Consistency Issues

### P0 — Phase numbering errors (blocking)

The design introduces 8 phases (0–7) but several sections use incorrect phase numbers:

| Location | Current text | Correct text | Reason |
|----------|--------------|--------------|--------|
| Line 349 | "Phase 3 must fail if..." | "Phase 5 must fail if..." | Reviewer runs in Phase 5 (Structured review), not Phase 3 (Coverage mapping). |
| Line 372 | "before Phase 4 starts" | "before Phase 6 starts" | Reviewer outputs are consumed by Phase 6 (Refactor). Phase 4 is draft writing. |
| Line 472 | "Phase 4 addressed blocking findings from Phase 3" | "Phase 6 addressed blocking findings from Phase 5" | Refactor (Phase 6) addresses review (Phase 5) findings. |

**Action:** Replace all incorrect phase references with the correct phase numbers.

### P1 — Coverage ledger column numbering (Section 4.3)

Lines 234–245: Column "3" is used twice (Coverage type and Planned scenario name). Correct numbering:

```
1. Context item
2. Source artifact
3. Coverage type: E2E | Functional | Error | Regression | Compatibility | OutOfScope
4. Planned scenario name
5. Priority
6. Reason if excluded or deferred
```

### P1 — Coverage type enum inconsistency

- **Section 4.3** (lines 236–241): Lists 6 types including `OutOfScope`.
- **Section 4.8** (lines 656–664): Lists 8 types including `Security`, `Performance`, `OutOfScope`.

**Action:** Align both sections. The Phase 3 ledger schema (4.8) is more complete — update 4.3 to reference the canonical list or state that 4.8 is authoritative.

### P2 — Section 5.3 title vs content

Section 5.3 is titled "Files to remove" but includes:
- Items to remove (xmind-refactor-plan-merged, priority-assignment-rules)
- Items to replace (qa-plan-contract-simple)
- Items to refactor in place (README.md)
- Items to sync (reference.md)

**Action:** Rename to "Files to remove, replace, or refactor" or split into clearer subsections.

---

## 2. Self-Sufficiency Gaps

### P1 — AGENTS.md phase sync not explicit

The design expands from 6 phases (current AGENTS.md) to 8 phases. Section 5.5 "AGENTS.md sync" is mentioned in the openclaw-agent-design-review checklist, but the design does not explicitly state:

- The new phase list that AGENTS.md must display
- The exact workflow string to replace the current 5-phase summary

**Action:** Add an "AGENTS.md sync" subsection under 5.5 with the exact replacement text for the Core Workflow section.

### P1 — Spawn threshold undefined

Line 369: Coverage mapper spawns "when context is large or multi-family" — no definition of:
- "large" (e.g., >N sources, >M KB of context, >K capability families)
- "multi-family" (e.g., ≥2 source families)

**Action:** Add explicit spawn criteria, e.g.:
- Spawn coverage-mapper when: `|requested_source_families| ≥ 2` OR `|Mandatory Coverage Candidates| > N` (suggest N=10).

### P2 — One-shot research bound

Section 4.4 and 4.4.1: "One bounded research pass" / "one bounded research attempt" — no bound on:
- Number of Confluence/Tavily queries per step
- Time or token limit
- When to stop and mark unresolved

**Action:** Add a concrete bound, e.g. "at most 2 queries per unresolved step; if both fail, mark unresolved and proceed."

### P2 — Validator invocation order

Section 4.7 lists validators but does not specify:
- When each validator runs (which phase)
- Whether they run sequentially or in parallel
- Whether a single failure blocks the phase

**Action:** Add a validator-to-phase mapping table, e.g. `validate_context_index` after Phase 2, `validate_e2e_minimum` after Phase 4, etc.

---

## 3. Edge Cases and Boundary Conditions

### P0 — Required source fetch/auth failure must block and require user decision

**Scenario:** Requested source families fail to fetch because of auth issues, access issues, network/tool failures, or all-source fetch failure.

- Phase 1 must not treat a saved missing-source note as sufficient when the missing source is still required for the run.
- If a required source fails due to auth/access/fetch reasons, later phases should not continue on partial assumptions.

**Required behavior:** Define all of the following:

1. save a failure artifact such as `context/source_fetch_failures_<feature-id>.md`
2. set `task.json.overall_status = blocked`
3. append the blocking failure to `run.json.blocking_issues`
4. keep the workflow at Phase 1
5. stop before Phase 2
6. ask the user whether to:
   - fix the source issue and continue
   - explicitly reduce scope and continue with a changed requested-source set
   - stop the run

The workflow must not silently continue when a required source family failed to fetch because of auth, access, or other blocking reasons.

### P1 — Empty requested_source_families

**Scenario:** `requested_source_families` is empty.

- Source-model neutrality (4.2) says "Requested source families are mandatory for that run" — implies non-empty.
- Phase 1 gate is vacuously true when empty.

**Action:** Add an explicit rule: "`requested_source_families` must not be empty. Phase 0 must fail or prompt for at least one source family before proceeding."

### P1 — Empty context index (no capabilities)

**Scenario:** Context normalization produces a context index with no Primary User Journeys, no Core Capability Families, and no Mandatory Coverage Candidates.

- Phase 2 gate only checks "all required headings" exist.
- Phase 3 requires "every mandatory coverage candidate is classified" — if there are zero, this is vacuously true.
- Result: A plan could be generated with no real coverage.

**Action:** Add a gate: "If Mandatory Coverage Candidates is empty and the feature is user-facing, do not enter Phase 4. Record in coverage_gaps and require user confirmation to proceed with a minimal plan."

### P1 — Non-user-facing feature determination

**Scenario:** Who decides "explicitly non-user-facing"?

- Line 877: "EndToEnd is mandatory unless the feature is explicitly non-user-facing."
- No rule says where this classification comes from (context_index? user input? heuristic?).

**Action:** Add: "Non-user-facing classification must appear in `context_index` under `## Unsupported / Deferred / Ambiguous` or a dedicated `## Feature Classification` field, with a source artifact or user confirmation."

### P2 — User rejects final approval

**Scenario:** Phase 7 asks for approval; user says "No" or "Needs more work."

- Design does not specify: Does the workflow stop? Loop back to Phase 5/6? Save state for resume?
- Current SKILL.md implies "don't promote" but not the full state transition.

**Action:** Add: "On user rejection: do not promote; set `overall_status` to `awaiting_approval`; persist current draft path in `task.json`; allow user to request another refactor round (Phase 6) or exit."

### P2 — Phase 0 runtime failure

**Scenario:** Node missing, markxmind validator not found, or `deploy_runtime_context_tools.sh` fails.

- `runtime_capabilities` has "Blocking Issues" but the design does not say the workflow must stop when blocking issues exist.

**Action:** Add: "If `context/runtime_capabilities_<feature-id>.md` lists any Blocking Issues, do not enter Phase 1. Set `overall_status` to `blocked` and record in `blocking_issues`."

### P2 — Concurrent runs for same feature_id

**Scenario:** Two orchestrator runs for the same feature_id (e.g., different run_keys) writing to the same `context/` and `drafts/`.

- No locking or run isolation is specified.
- `run_key` distinguishes runs, but artifact paths use `feature-id` not `run_key`.

**Action:** Either (a) document that concurrent runs are not supported and recommend single-run-per-feature, or (b) require artifact paths to include `run_key` when concurrent runs are allowed.

### P2 — Review loop max rounds

Current SKILL.md: "Allow at most one retry after the initial refactor pass within a single round."

- Design does not specify max review→refactor rounds.
- Risk: unbounded loops.

**Action:** Add: "Maximum review→refactor rounds: 3. After 3 rounds, if verdict is still `reject`, set `overall_status` to `blocked` and require user intervention."

---

## 4. Guardrails Assessment

### Correctly set guardrails

| Guardrail | Location | Assessment |
|-----------|----------|------------|
| Banned vague phrases | 4.4, Enhancement B | Well-defined; list is explicit and extensible |
| Reviewer fail conditions | 4.5 (lines 348–361) | Comprehensive; covers coverage, executability, delta |
| Phase gates | 4.8, each phase | Clear "do not enter unless" conditions |
| Silent-drop prohibition | Enhancement C | Strong rule: no context item disappears without ledger entry |
| E2E minimum | 4.1, 4.8, Enhancement F | Clear: happy path + interruption + error/recovery when applicable |
| Feature-shape neutrality | 4.1 | Good: avoids hardcoding create/edit/save |
| Source-model neutrality | 4.2 | Good: requested vs unrequested sources |
| Spawn policy | 4.6 | Clear: no spawn for final write, review verdict, refactor acceptance |

### Guardrails needing tightening

| Guardrail | Issue | Recommendation |
|-----------|-------|----------------|
| One-shot research | Unbounded | Add max 2 queries per step; then mark unresolved |
| Coverage-mapper spawn | "Large or multi-family" vague | Add numeric or structural criteria |
| Validators | No phase mapping | Add validator-to-phase table |
| User approval rejection | No state transition | Define blocked state and resume path |
| Empty capabilities | Can produce empty plan | Add gate when Mandatory Coverage Candidates is empty |

### Missing guardrails

1. **Idempotency on resume:** When resuming from Phase N, does the design guarantee that re-running Phase N produces compatible artifacts? The agent-idempotency skill should be invoked; the design references Phase 0 state but does not explicitly call out idempotency rules for each phase.

2. **Notification contract:** Design mentions Feishu notify in passing (Phase 7) but does not specify:
   - When notification is sent (only on success? on blocked?)
   - `notification_pending` handling in `run.json`
   - Fallback if Feishu fails

3. **Evals as guardrails:** Section 7 defines evals but does not say whether eval failure blocks promotion or is advisory. Recommend: "Eval failures must be documented; P0 eval failures block finalization."

---

## 5. Cross-Reference Consistency

| Doc | Design reference | Status |
|-----|------------------|--------|
| AGENTS.md | Phase list | Mismatch: design has 8 phases, AGENTS has 6 |
| reference.md | task.json, run.json | Design adds many new fields; 5.5 requires sync |
| SKILL.md | Phase overview | Design changes phases 2–5 substantially |
| qa-plan-contract-simple.md | To be replaced | Design correctly replaces with qa-plan-contract.md |

---

## 6. Recommendations Summary

### Before implementation (P0)

1. Fix phase numbering in lines 349, 372, 472.
2. Ensure the design keeps the Phase 1 blocked-state behavior for required source auth/access/fetch failure and user decision before continuing.

### Before implementation (P1)

1. Fix coverage ledger column numbering (Section 4.3).
2. Align coverage type enum between 4.3 and 4.8.
3. Add AGENTS.md sync subsection with exact replacement text.
4. Add explicit spawn criteria for coverage-mapper.
5. Add gate for empty Mandatory Coverage Candidates.
6. Define non-user-facing classification source.
7. Add rule for empty requested_source_families.

### Advisories (P2)

1. Add validator-to-phase mapping table.
2. Define user-rejection state transition.
3. Add Phase 0 blocking-issues gate.
4. Document concurrent-run policy.
5. Add max review→refactor rounds (e.g., 3).
6. Rename Section 5.3 for clarity.
7. Add notification contract (Feishu + notification_pending).
8. Add idempotency rules per phase.
9. Define eval failure policy (block vs advisory).

---

## 7. Verdict

| Dimension | Result |
|-----------|--------|
| Self-consistency | **Fail** — phase numbering errors must be fixed |
| Self-sufficiency | **Pass with advisories** — spawn thresholds and validator mapping still need tightening |
| Edge/boundary coverage | **Pass with advisories** — Phase 1 source-failure blocking is now covered; empty-context and user-rejection still need tightening |
| Guardrails | **Pass with advisories** — mostly correct; tighten spawn/validator/idempotency guardrails |

**Overall:** **Pass with advisories** — address P0 and P1 items before implementation. The design is implementation-ready once these corrections are applied.
