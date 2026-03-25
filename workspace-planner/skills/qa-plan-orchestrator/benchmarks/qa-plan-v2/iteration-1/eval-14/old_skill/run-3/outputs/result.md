# HOLDOUT-REGRESSION-002 — Holdout Regression Check (BCIN-976)

## Benchmark intent
Validate that **promotion/finalization behavior remains stable on another feature** (primary benchmark feature: **BCIN-976**, feature family: **report-editor**) and that the skill output aligns to the **holdout** phase/checkpoint.

## What “pass” means for this benchmark
Under the **qa-plan-orchestrator** contract, “promotion/finalization behavior” is governed by **Phase 7** (explicit approval, archive-if-overwrite, promote best draft to `qa_plan_final.md`, write finalization record, generate final summary, attempt notification). For a **holdout**-phase regression, we should be able to verify—using only provided evidence—that:

1. The workflow still defines and constrains finalization/promotion via **Phase 7**, not earlier phases.
2. Promotion requires **explicit user approval** before running Phase 7.
3. Final overwrite behavior is stable: existing `qa_plan_final.md` is archived prior to overwrite.
4. Finalization produces the specified artifacts (`context/finalization_record_<feature-id>.md`, `qa_plan_final.md`, and summary generation as described).

## Evidence-based verification (holdout)
### Phase alignment: holdout
The skill snapshot establishes the authoritative phase model and places promotion/finalization logic exclusively in **Phase 7**:

- **SKILL.md (Phase 7):** “archive any existing final plan, promote the best available draft, write the finalization record, … generate `context/final_plan_summary_<feature-id>.md` … attempt Feishu notification. … **explicit approval before running the script**.”
- **reference.md (Phase 7 artifact contract):**
  - `context/finalization_record_<feature-id>.md`
  - `qa_plan_final.md`
- **reference.md (Failure and Recovery Examples):** “Final overwrite with archive … moves existing `qa_plan_final.md` to `archive/qa_plan_final_<timestamp>.md` before promoting.”

This is consistent with the benchmark’s required focus (promotion/finalization stability) and is correctly mapped to the **holdout** checkpoint (Phase 7 behavior definition and gating).

### Applicability to BCIN-976
Fixture evidence confirms **BCIN-976** exists as a Feature in Jira and is within the **report-editor** family context by labels:

- `fixture:BCIN-976.issue.raw.json` labels include: `Library_and_Dashboards`, `Report`.
- `fixture:BCIN-976.customer-scope.json` confirms feature id and customer-signal presence.

No run artifacts (e.g., `runs/BCIN-976/...`) are provided in the benchmark evidence bundle, so this holdout regression check is necessarily limited to **contract stability** rather than an executed promotion.

## Verdict (holdout regression)
**PASS (contract-level holdout regression):** The provided authoritative workflow package explicitly preserves stable promotion/finalization behavior via Phase 7, including explicit approval gating and archive-on-overwrite semantics. This satisfies the benchmark focus for holdout regression using only provided evidence.

## Gaps / limits (due to evidence constraints)
- No `runs/BCIN-976/` runtime directory artifacts were provided (e.g., no `qa_plan_final.md`, `context/finalization_record_BCIN-976.md`, or archive evidence). Therefore we cannot confirm a live execution; we can only confirm the **workflow contract** governing promotion/finalization remains stable.