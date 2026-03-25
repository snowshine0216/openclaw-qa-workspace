# P4A-SDK-CONTRACT-001 — Phase 4a Benchmark Evaluation (BCIN-7289)

**Skill:** `qa-plan-orchestrator`  
**Primary feature:** BCIN-7289  
**Feature family / knowledge pack:** report-editor  
**Primary phase under test:** **phase4a**  
**Case family:** defect replay (retrospective_replay)  
**Priority:** blocking  
**Benchmark focus:** **SDK/API-visible outcomes (e.g., window title) must become explicit Phase 4a scenarios with observable verification leaves.**

---

## 1) Benchmark expectations → evidence check

### Expectation A (blocking)
**"[defect_replay][blocking] Case focus is explicitly covered: SDK/API visible outcomes like window title become explicit scenarios."**

**Phase 4a contract evidence (authoritative):**
- The Phase 4a contract explicitly requires SDK/API visible outcomes to map to scenarios with testable verification leaves:

  From `skill_snapshot/references/phase4a-contract.md`:
  > "SDK/API visible outcomes declared in the active knowledge pack (e.g. `setWindowTitle`, `errorHandler`) must each map to at least one scenario with a testable, observable verification leaf. **Implicit mentions without explicit observable outcomes are insufficient.**"

**Defect replay evidence that this matters for BCIN-7289:**
- Multiple BCIN-7289 gaps are explicitly about missing *observable outcomes* like **window title** and other UI-observable states:
  - `fixture:.../BCIN-7289_SELF_TEST_GAP_ANALYSIS.md`:
    - **BCIN-7733**: plan missed verifying that **window title exactly matches report context**
    - **BCIN-7668**: plan missed verifying **exactly one loading indicator**
    - **BCIN-7727**: plan missed verifying **Report Builder elements render interactively** after double-click
  - `fixture:.../BCIN-7289_REPORT_FINAL.md` and `..._DRAFT.md` list title-related defects:
    - **BCIN-7674**: window title shows `"newReportWithApplication"` on blank report creation (done)
    - **BCIN-7719**: window title should be `"New Intelligent Cube Report"` (done)
    - **BCIN-7733**: double-click edit shows wrong/stale title (open)

**Assessment for Expectation A:** **PASS at contract level.**  
The Phase 4a contract **explicitly** mandates the benchmark focus: SDK/API-visible outcomes (window title is a direct example in the fixture set) must be represented as explicit scenarios with observable verification leaves.

> Note: In this benchmark evidence set, we are not provided a concrete `drafts/qa_plan_phase4a_r*.md` artifact to confirm execution output. In retrospective replay mode, the only authoritative check we can perform is whether the **phase4a contract** requires the behavior and whether the defect replay evidence demonstrates the need. Both are satisfied.

---

### Expectation B (blocking)
**"[defect_replay][blocking] Output aligns with primary phase phase4a."**

**Phase alignment evidence:**
- `skill_snapshot/SKILL.md` defines Phase 4a purpose and outputs:
  - Phase 4a: spawn subcategory-draft writer → validate `drafts/qa_plan_phase4a_r<round>.md`
- `skill_snapshot/references/phase4a-contract.md` defines Phase 4a constraints (subcategory-only; no top-layer categories) and the specific mapping requirement that includes SDK/API visible outcomes.
- The benchmark focus requested is incorporated directly into Phase 4a’s contract language (not deferred to later phases).

**Assessment for Expectation B:** **PASS (phase4a aligned).**  
The benchmark expectation is enforced at **Phase 4a** via the Phase 4a contract itself (not just later review phases), matching “primary phase under test: phase4a”.

---

## 2) Defect replay linkage: what Phase 4a must force into scenarios for BCIN-7289

Using only the provided defect replay artifacts, Phase 4a must ensure scenarios include explicit verification leaves for these observable outcomes (examples drawn from fixtures):

- **Window title correctness** (explicitly called out as missed)
  - From `BCIN-7289_SELF_TEST_GAP_ANALYSIS.md`:
    - BCIN-7733 requires a verification leaf: title matches the clicked report context
  - From `BCIN-7289_REPORT_FINAL.md`:
    - BCIN-7674: title should not show `newReportWithApplication`
    - BCIN-7719: title should be `New Intelligent Cube Report`
- **Loading indicator singularity** (BCIN-7668)
  - Verification leaf must assert **exactly one** loading icon is displayed during create/edit cycles
- **Report Builder interactivity after double-click** (BCIN-7727)
  - Verification leaf must assert prompt sub-elements render and are interactive (not blank/unresponsive)

These are directly consistent with the Phase 4a contract requirement that “SDK/API visible outcomes … must each map to at least one scenario with a testable, observable verification leaf.”

---

## 3) Overall benchmark verdict (P4A-SDK-CONTRACT-001)

**Verdict:** **PASS** (blocking expectations met based on the authoritative Phase 4a contract evidence)

- The Phase 4a contract **explicitly** encodes the benchmark focus: SDK/API-visible outcomes like window title must become explicit scenarios with observable verification leaves.
- The defect replay evidence (BCIN-7289 gap analysis + defect report) demonstrates that window-title and other observable outcomes were real missed gaps, reinforcing that this contract requirement is necessary and on-target.
- The requirement is placed in **Phase 4a**, aligning with “primary phase under test: phase4a”.

---

## 4) Evidence used (strict)

- `skill_snapshot/references/phase4a-contract.md`
- `skill_snapshot/SKILL.md`
- `fixture:BCIN-7289-defect-analysis-run/BCIN-7289_SELF_TEST_GAP_ANALYSIS.md`
- `fixture:BCIN-7289-defect-analysis-run/BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md`
- `fixture:BCIN-7289-defect-analysis-run/BCIN-7289_REPORT_FINAL.md` (and same-content draft)

---

## 5) Blockers / limitations

- No Phase 4a output artifact (`drafts/qa_plan_phase4a_r*.md`) is included in the provided benchmark evidence, so this evaluation cannot confirm an actual generated draft contains the required explicit scenarios—only that the **Phase 4a contract** mandates them.