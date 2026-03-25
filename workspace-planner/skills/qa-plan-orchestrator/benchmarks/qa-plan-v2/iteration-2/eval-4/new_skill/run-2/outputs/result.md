# P4A-SDK-CONTRACT-001 — Phase4a Contract Alignment Check (BCIN-7289)

**Benchmark case:** P4A-SDK-CONTRACT-001  
**Primary feature:** BCIN-7289  
**Feature family / knowledge pack:** report-editor / report-editor  
**Primary phase under test:** **phase4a**  
**Evidence mode:** retrospective_replay (fixture: `BCIN-7289-defect-analysis-run`)  
**Priority:** blocking  
**Benchmark focus:** **SDK/API-visible outcomes (e.g., window title) must become explicit Phase 4a scenarios with testable observable verification leaves.**

---

## 1) Benchmark Expectations → Evidence Mapping (Phase4a)

### Expectation A (blocking)
**“SDK/API visible outcomes like window title become explicit scenarios.”**

**Authoritative phase rule (Phase 4a contract):**
- Phase 4a must map **SDK/API visible outcomes** declared by the active knowledge pack to **at least one scenario** with a **testable, observable verification leaf**; implicit mentions are insufficient.  
Source: `skill_snapshot/references/phase4a-contract.md`  
> “SDK/API visible outcomes… must each map to at least one scenario with a testable, observable verification leaf. Implicit mentions without explicit observable outcomes are insufficient.”

**Fixture evidence that this is exactly what was missed in BCIN-7289:**
- Cross-analysis explicitly attributes misses to **Phase 4a** for “Observable Outcomes (Loading, Titles)”.  
  Source: `fixture:BCIN-7289-defect-analysis-run/BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md`
  > “Observable Outcomes (Loading, Titles) — Missed In Phase 4a … abbreviated the verification leaves.”

- Self-test gap analysis classifies multiple open defects as **Observable Outcome Omission**, including window title.  
  Source: `fixture:BCIN-7289-defect-analysis-run/BCIN-7289_SELF_TEST_GAP_ANALYSIS.md`
  > “BCIN-7733 (Wrong title on double-click): … lacks the verification leaf ensuring the window title exactly matches the clicked report’s context.”

- Defect report includes multiple **window title** defects (both resolved and open), reinforcing that “window title” is an externally observable contract that must be scenario-explicit:
  - **BCIN-7674**: Window title shows `newReportWithApplication` when creating blank report (Done).  
  - **BCIN-7719**: New Intelligent Cube Report title requirement (Done).  
  - **BCIN-7721**: i18n: window title not translated for Chinese users (Open).  
  - **BCIN-7733**: double-click edit shows wrong title (Open).  
  Source: `fixture:BCIN-7289-defect-analysis-run/BCIN-7289_REPORT_FINAL.md`

**Retrospective verdict for Expectation A:** **NOT SATISFIED (blocking)**
- The fixture evidence documents that, for BCIN-7289, Phase 4a output **did not** consistently render **window-title and other observable outcomes** as explicit scenarios with concrete verification leaves, leading directly to defects such as BCIN-7733 (wrong title) and related title/i18n issues.

---

### Expectation B (blocking)
**“Output aligns with primary phase phase4a.”**

**Authoritative phase4a output contract:**
- Phase 4a produces `drafts/qa_plan_phase4a_r<round>.md` and must remain subcategory-only (no top-layer canonical categories), with atomic steps and observable verification leaves.  
Source: `skill_snapshot/references/phase4a-contract.md`

**Available fixture limitations:**
- The fixture package does **not** include any `drafts/qa_plan_phase4a_r*.md` artifact to directly verify structure/content (e.g., explicit scenarios for setWindowTitle/window title outcomes).
- The fixture instead provides retrospective analyses indicating what Phase 4a missed.

**Retrospective verdict for Expectation B:** **INDETERMINATE FROM PROVIDED ARTIFACTS**  
- We can confirm the **phase4a contract requirement exists and is explicit**, and we can confirm the **BCIN-7289 run’s gaps were attributed to Phase 4a** (observable outcomes, state transitions).  
- But we cannot directly validate that an actual phase4a draft artifact was produced and conforms to the structure rules because the required draft file is not present in the provided fixture evidence.

---

## 2) What Phase4a Should Have Contained (explicit scenario examples required by the contract)

Based strictly on the fixture’s identified misses (titles/loading) and the phase4a contract requirement that SDK/API-visible outcomes be explicit and observable, Phase 4a coverage should have included scenarios whose **verification leaves assert the title text precisely** (and, where relevant, localized strings):

- **Window title on create blank report**
  - Verification leaf: title is **not** `newReportWithApplication`; matches expected “New Report” naming.  
  Evidence driver: BCIN-7674 (Done), cross-analysis “Titles”.

- **Window title on Intelligent Cube conversion / new cube report**
  - Verification leaf: title equals **“New Intelligent Cube Report”** (and locale-specific translation where applicable).  
  Evidence driver: BCIN-7719 (Done), BCIN-7721 (Open i18n).

- **Window title on double-click edit**
  - Verification leaf: title exactly matches the report opened (no stale/wrong context).  
  Evidence driver: BCIN-7733 (Open), self-test gap analysis.

These are representative of the benchmark’s “SDK/API visible outcomes like window title” focus: they are externally observable UI/API outcomes and must be explicit in Phase 4a scenarios.

---

## 3) Blocking Issues (benchmark-level)

1. **Benchmark focus not met in the BCIN-7289 defect replay:** the retrospective evidence states Phase 4a missed or weakened explicit verification leaves for observable outcomes including **window title**.  
   Sources:
   - `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md`
   - `BCIN-7289_SELF_TEST_GAP_ANALYSIS.md`

2. **Cannot directly validate “phase4a output alignment” due to missing phase4a draft artifact in the fixture evidence set**, so phase4a structural compliance cannot be confirmed from artifacts.  
   (This is an evidence limitation within the benchmark package, not a claim about the skill repository.)

---

## 4) Final Benchmark Verdict

**Overall result for P4A-SDK-CONTRACT-001:** **FAIL (blocking)**

- **Reason:** The retrospective replay evidence explicitly indicates Phase 4a failed to ensure SDK/API-visible outcomes—specifically **window title** (and similarly loading indicator behavior)—were represented as **explicit scenarios with testable observable verification leaves**, which is a hard requirement in the Phase 4a contract and the benchmark focus for this case.

---