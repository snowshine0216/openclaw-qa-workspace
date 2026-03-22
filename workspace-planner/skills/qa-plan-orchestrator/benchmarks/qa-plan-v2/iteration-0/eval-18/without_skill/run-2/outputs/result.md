# Phase 4a — Confirmation & dismissal outcomes coverage (BCDA-8653)

- **Benchmark case:** SELECTOR-P4A-CONFIRMATION-001  
- **Primary feature:** BCDA-8653  
- **Feature family / knowledge pack:** search-box-selector  
- **Primary phase under test:** phase4a  
- **Evidence mode:** blind_pre_defect (customer issues only; exclude non-customer issues)  
- **Priority:** advisory  
- **Profile:** global-cross-feature-v1  
- **Focus (must be covered in plan):** search box selector dropdown planning covers **OK / Cancel confirmation**, **pending selection**, and **dismissal outcomes**.

## Evidence available in this benchmark run
- Fixture reference provided: **BCDA-8653-blind-pre-defect-bundle**
- **No customer-issue evidence content was provided in the prompt**, and the fixture has **no local path / no accessible contents** in this run.

Because the blind evidence bundle contents are not available here, **no customer-issue-backed behaviors can be extracted** to demonstrate phase4a planning coverage for:
- OK confirmation
- Cancel confirmation
- Pending selection state
- Dismissal outcomes (e.g., clicking outside, Escape, blur)

## Phase 4a contract check (advisory)
### Requirement: Case focus explicitly covered
- **Not demonstrable from the provided evidence.**
- Blocked: the benchmark requires relying on *customer issues only*, but none are included/accessible in this run.

### Requirement: Output aligns with phase4a
- This artifact is scoped to **phase4a confirmation/dismissal outcomes**, but **cannot assert coverage** without the missing evidence.

## What is needed to complete phase4a verification for this case
To evaluate whether phase4a planning satisfies the case focus using *customer issues only*, provide at least one of the following from the **BCDA-8653-blind-pre-defect-bundle**:
- Customer issue text describing confirmation flows (OK/Cancel) or pending selection behavior.
- Repro steps / expected vs actual that mention dismissal (outside click/Escape/blur) and whether selection commits or reverts.
- Any customer-reported acceptance criteria tied to dropdown selection confirmation/dismissal.

Once evidence is available, phase4a output should enumerate planned checks for:
- **OK**: selection commits; dropdown closes; input reflects committed option; no stale pending state.
- **Cancel**: selection does not commit; prior committed value preserved; dropdown closes; pending highlight cleared.
- **Pending selection**: navigation/highlight does not immediately commit; commit only on OK/Enter/click (as per evidence).
- **Dismissal outcomes**: outside click/Escape/blur closes dropdown; commit-or-revert behavior matches customer evidence; focus behavior consistent.

---
**Status:** **Blocked (insufficient benchmark evidence provided).**