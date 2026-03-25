# P0-IDEMPOTENCY-001 — Phase 0 phase-contract check (BCIN-976, report-editor)

## Scope of this benchmark
- **Feature:** BCIN-976
- **Feature family / knowledge pack:** report-editor
- **Primary phase under test:** **phase0**
- **Case family:** phase contract
- **Evidence mode:** blind_pre_defect
- **Priority:** blocking
- **Case focus (must cover):** **`REPORT_STATE` and resume semantics remain stable**

## Phase 0 contract requirements (from snapshot)
Phase 0 is responsible for:
1. Initialize runtime state.
2. Check requested source access.
3. **Classify `REPORT_STATE`.**
4. Normalize request materials / requirements / commands.
5. Lock support/research policy.

Phase 0 must produce these artifacts under `context/`:
- `runtime_setup_<feature-id>.md`
- `runtime_setup_<feature-id>.json`
- `supporting_issue_request_<feature-id>.md`
- `request_fulfillment_<feature-id>.md`
- `request_fulfillment_<feature-id>.json`

**Required `REPORT_STATE` semantics** (phase0-driven behavior):
- `FRESH`: continue without prompt.
- `DRAFT_EXISTS`: user chooses **resume** / smart_refresh / full_regenerate.
- `FINAL_EXISTS`: user chooses reuse / smart_refresh / full_regenerate.
- `CONTEXT_ONLY`: user chooses generate from cache / smart_refresh / full_regenerate.

**Resume semantics stability requirement (benchmark focus):**
- If `DRAFT_EXISTS`, the stable/contracted behavior is that the orchestrator prompts for **resume** (aka reuse/resume) vs reset modes, and then applies the selection via `scripts/apply_user_choice.sh <mode> <feature-id> <run-dir>`.
- After mode selection:
  - `full_regenerate` ⇒ next: Phase 0 (reset to beginning)
  - `smart_refresh` ⇒ next: Phase 2 (keep context evidence; clear drafts and phase2+ artifacts)
  - `reuse` / `resume` ⇒ continue from current state (no reset)

## Evidence available in this benchmark bundle
Only fixture evidence is provided for BCIN-976 (Jira export JSON + customer-scope JSON). There is **no provided run directory state**, no `task.json`, no `run.json`, no `context/` artifacts, and no `qa_plan_final.md`/drafts. Therefore:
- We can confirm the **contract definition** for `REPORT_STATE` and resume semantics from the skill snapshot.
- We **cannot** verify observed behavior (idempotency / stability across reruns) because no execution logs or runtime artifacts are provided.

## Phase 0 alignment verdict (blocking)
### Coverage of case focus: `REPORT_STATE` + resume semantics stability
- **Contract-level coverage: PASS (documented).**
  - The snapshot explicitly defines `REPORT_STATE` values and user-choice driven resume/reuse/smart-refresh/full-regenerate semantics.
- **Evidence-level demonstration: BLOCKED.**
  - The benchmark evidence does not include any phase0 outputs (`context/runtime_setup_BCIN-976.json` etc.) or any runtime state (`task.json`) that would demonstrate:
    - which `REPORT_STATE` was classified for BCIN-976
    - that resume semantics remain stable across repeated phase0 invocations

### Output aligns with primary phase: phase0
- **Contract alignment: PASS (phase0 outputs and gating are defined).**
- **Produced-artifact verification for BCIN-976: BLOCKED (no run artifacts in evidence).**

## What would be required to complete the phase0 verification (not present in evidence)
To demonstrate this benchmark’s idempotency/resume stability using only artifacts/logs, we would need at least one of:
- `context/runtime_setup_BCIN-976.json` showing `report_state` classification and `ok: true`
- `task.json` reflecting stable `report_state` and `selected_mode` after user choice
- evidence that `apply_user_choice.sh` was applied and that the resulting `current_phase` transitions match the contract (phase0 vs phase2 vs resume)
- a second invocation trace (or updated task/run json timestamps) showing stability across reruns

## Final benchmark status (based on provided evidence only)
- **[phase_contract][blocking] Case focus explicitly covered (REPORT_STATE + resume semantics stable):** **PASS at contract-definition level; BLOCKED for evidence demonstration**
- **[phase_contract][blocking] Output aligns with primary phase phase0:** **PASS at contract-definition level; BLOCKED for BCIN-976 artifact verification**