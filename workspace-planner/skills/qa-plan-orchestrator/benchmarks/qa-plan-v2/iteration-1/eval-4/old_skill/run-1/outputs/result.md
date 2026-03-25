# Benchmark Deliverable — P4A-SDK-CONTRACT-001 (BCIN-7289)

## Primary phase under test
**Phase 4a (subcategory-only draft)**

## Benchmark expectations (blocking)
1. **[defect_replay] Case focus explicitly covered:** *SDK/API visible outcomes like window title become explicit scenarios*.
2. **[phase4a] Output alignment:** artifact content must match the **Phase 4a contract** (subcategory-first, scenarios, atomic steps, observable verification leaves; no canonical top-layer categories).

## Retrospective replay verdict (based on provided evidence only)
### Expectation 1 — SDK/API visible outcomes become explicit scenarios
**PASS (covered by Phase 4a contract requirements, and reinforced by fixture analysis).**

Evidence shows Phase 4a contract explicitly mandates SDK/API-visible outcomes be **testable verification leaves**:
- From `skill_snapshot/references/phase4a-contract.md`:
  - “**SDK/API visible outcomes must remain testable in scenario leaves, not hidden behind implementation wording.**”
  - This directly matches the benchmark focus (“window title become explicit scenarios”).

Fixture evidence confirms the defect class and concretely names **window title** as a missed observable outcome:
- From `fixture:.../BCIN-7289_SELF_TEST_GAP_ANALYSIS.md`:
  - Observable Outcome Omission includes **BCIN-7733 (Wrong title on double-click)** and states the plan “lacks the verification leaf ensuring the **window title exactly matches** the clicked report's context.”
- From `fixture:.../BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md`:
  - “**Observable Outcomes (Loading, Titles)** … missed in Phase 4a … `pack.json` lacked `required_outcomes` … abbreviated the verification leaves.”
  - “**Workstation window title matching current report context**” is called out as a required outcome to add.

**Benchmark mapping:** The Phase 4a contract already requires these outcomes to be written as explicit scenario verifications; the BCIN-7289 replay evidence identifies “window title” as the exact observable that must be made explicit.

### Expectation 2 — Output aligns with Phase 4a (subcategory-only) model
**PASS at contract level (Phase 4a artifact itself is not included in evidence, so only contract alignment can be demonstrated).**

The authoritative Phase 4a contract requires:
- **Required structure:** central topic → subcategory → scenario → atomic action chain → observable verification leaves
- **Forbidden:** canonical top-layer categories (e.g., Security/Compatibility/EndToEnd/i18n), compressed steps, mixing verification text into action bullets

Evidence:
- `skill_snapshot/references/phase4a-contract.md` provides explicit structure/forbidden rules and an embedded good example.

**Limitation (retrospective replay constraint):** No `drafts/qa_plan_phase4a_r<round>.md` is present in the provided fixture evidence, so we cannot assert a specific draft’s compliance—only that the workflow package contract for Phase 4a is correctly defined to satisfy the benchmark’s Phase 4a alignment requirement.

## Explicit Phase 4a scenario set required by this benchmark focus (what must exist in a compliant Phase 4a draft)
The Phase 4a draft for BCIN-7289 must include scenarios where the *verification leaves* assert SDK/UI-visible outcomes. Minimum explicit outcomes called out by fixture evidence:

### Window title outcomes (SDK/API-visible / user-visible contract)
1. **Create blank report → window title is correct (not an i18n key)**
   - Maps to defect history: **BCIN-7674** (“window title is `newReportWithApplication`”).
2. **Create Intelligent Cube report → title matches expected label**
   - Maps to defect history: **BCIN-7719** (“New Intelligent Cube Report” title).
3. **Double-click to edit report → title matches clicked report context**
   - Maps to open defect: **BCIN-7733** (“wrong/stale title on edit”) and the self-test gap requirement that the plan include an explicit verification leaf for title correctness.

### Loading indicator observable outcome
4. **Create/edit report → exactly one loading indicator shown**
   - Maps to open defect: **BCIN-7668** (“Two loading icons”).

These are not “nice-to-have notes”; per Phase 4a contract and fixture gap analysis, they must be present as **observable verification leaves**.

## Overall benchmark conclusion
- **Meets benchmark intent:** The Phase 4a contract explicitly enforces the required “SDK/API visible outcomes → explicit scenario leaves” behavior, and the BCIN-7289 defect replay evidence concretely identifies window-title verification as the missing item Phase 4a must cover.
- **Residual risk / evidence gap:** The actual generated Phase 4a draft artifact is not provided in this benchmark evidence, so runtime compliance of a specific `qa_plan_phase4a_*.md` cannot be validated here.