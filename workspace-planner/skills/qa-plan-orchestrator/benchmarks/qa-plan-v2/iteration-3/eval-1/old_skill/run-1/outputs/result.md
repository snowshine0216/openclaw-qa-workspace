# Benchmark result: P0-IDEMPOTENCY-001 (BCIN-976) — phase0 phase contract

## Verdict (blocking)
**FAIL** — Based on the provided snapshot evidence, Phase 0 defines user-choice semantics that are **not fully stable/consistent** for the `DRAFT_EXISTS` report state (resume vs reuse). This is a **blocking phase-contract risk** for the benchmark focus: **`REPORT_STATE` and resume semantics remain stable**.

## What phase0 must cover (authoritative contract)
From `skill_snapshot/SKILL.md` and `skill_snapshot/reference.md`, Phase 0 is responsible for:

- Initialize runtime state
- Check requested source access
- **Classify `REPORT_STATE`**
- Normalize request materials/requirements/commands
- Lock support/research policy
- Emit Phase 0 artifacts:
  - `context/runtime_setup_<feature-id>.md`
  - `context/runtime_setup_<feature-id>.json`
  - `context/supporting_issue_request_<feature-id>.md`
  - `context/request_fulfillment_<feature-id>.md`
  - `context/request_fulfillment_<feature-id>.json`

And **when `REPORT_STATE` is `FINAL_EXISTS`, `DRAFT_EXISTS`, or `CONTEXT_ONLY`**, the orchestrator must:

1. Present options to the user.
2. After user chooses, run: `scripts/apply_user_choice.sh <mode> <feature-id> <run-dir>`.
3. Follow the routing rules:
   - `full_regenerate` → rerun Phase 0
   - `smart_refresh` → proceed to Phase 2
   - `reuse`/`resume` → continue from current phase

## Benchmark focus check: REPORT_STATE + resume semantics stability
### Expected (for this benchmark)
- The workflow must define **stable, non-contradictory** semantics for:
  - `REPORT_STATE` values (`FINAL_EXISTS`, `DRAFT_EXISTS`, `CONTEXT_ONLY`, `FRESH`)
  - The **resume/reuse** user choice behavior when prior artifacts exist

### Observed inconsistency (blocking)
The snapshot evidence contains a mismatch in the user-choice labels for `DRAFT_EXISTS`:

- `skill_snapshot/SKILL.md` (Phase 0 section) says:
  - When `REPORT_STATE` is `FINAL_EXISTS`, `DRAFT_EXISTS`, or `CONTEXT_ONLY`, present options:
    - **full_regenerate, smart_refresh, reuse**

- `skill_snapshot/reference.md` (`REPORT_STATE` table) says:
  - `DRAFT_EXISTS` → user chooses:
    - **resume / smart_refresh / full_regenerate**

This creates a contract ambiguity:
- Is the correct user option called **`reuse`** or **`resume`** for `DRAFT_EXISTS`?
- If the orchestrator is required to “present options” exactly as specified, then it cannot be simultaneously compliant with both documents.
- Because this benchmark case is about **idempotency and stable resume semantics**, this naming/semantic inconsistency is a **direct violation risk**: the orchestrator may prompt with different choices depending on which contract source it follows.

### Why this is considered blocking in phase0
Phase 0 is the only phase that:
- classifies `REPORT_STATE`
- gates user interaction on that classification
- maps the user’s selection into `selected_mode` and executes `apply_user_choice.sh`

Therefore, inconsistencies in the Phase 0 user-choice contract are **phase0-level contract failures** for this benchmark.

## Alignment with primary phase (phase0)
This benchmark assessment is **strictly phase0-scoped**:
- It evaluates the Phase 0 contract section and the `REPORT_STATE`/user-choice semantics specified as Phase 0 responsibilities.
- No Phase 1+ behavior is asserted or required for this benchmark artifact.

## Minimal remediation (contract-level)
To satisfy the benchmark requirement (“REPORT_STATE and resume semantics remain stable”), the workflow package must make Phase 0 consistent by doing one of:

- Standardize on **`resume`** vs **`reuse`** for `DRAFT_EXISTS` across `SKILL.md` and `reference.md`, and ensure `apply_user_choice.sh` accepts the standardized token.
- Or explicitly define that `resume` and `reuse` are synonyms and confirm that:
  - the prompt text
  - `selected_mode` value
  - `apply_user_choice.sh <mode>`
  are all stable and documented.

Until that consistency exists in the authoritative snapshot, the benchmark’s phase0 idempotency/resume-stability expectation is not met.

---

## Short execution summary
- Checked Phase 0 `REPORT_STATE` and user-choice contract in `skill_snapshot/SKILL.md` and `skill_snapshot/reference.md`.
- Found a blocking inconsistency for `DRAFT_EXISTS` choice naming (**reuse** vs **resume**), which undermines stable resume semantics.