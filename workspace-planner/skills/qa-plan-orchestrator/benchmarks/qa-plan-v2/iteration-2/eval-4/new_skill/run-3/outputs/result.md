# P4A-SDK-CONTRACT-001 — Phase4a Contract Benchmark Verdict (BCIN-7289)

## Benchmark Metadata
- **Benchmark case:** P4A-SDK-CONTRACT-001  
- **Primary feature:** **BCIN-7289** — Embed Library Report Editor into the Workstation Report Authoring  
- **Feature family / knowledge pack:** report-editor / report-editor  
- **Primary phase under test:** **phase4a**  
- **Case family:** defect replay  
- **Evidence mode:** retrospective_replay  
- **Priority:** blocking  
- **Profile:** global-cross-feature-v1  
- **Fixture:** BCIN-7289-defect-analysis-run  
- **Focus (must be explicit):** SDK/API visible outcomes (e.g., *window title*) become **explicit scenarios** with **observable verification leaves**

---

## Authoritative Phase4a Contract Requirement (what must be satisfied)
From `skill_snapshot/references/phase4a-contract.md`:

> “**SDK/API visible outcomes declared in the active knowledge pack (e.g. `setWindowTitle`, `errorHandler`) must each map to at least one scenario with a testable, observable verification leaf. Implicit mentions without explicit observable outcomes are insufficient.**”

Also required in Phase 4a:
- subcategory-first structure (no top-layer categories)
- atomic step chain with observable verification leaves
- state transitions must appear as scenario chains (from-state → trigger → to-state → observable outcome)

---

## Retrospective Defect Replay Evidence (what was missed historically)
The provided fixture evidence documents the concrete miss pattern relevant to this benchmark:

### 1) Observable outcomes missed in Phase 4a (explicitly called out)
- **Evidence:** `fixture:BCIN-7289-defect-analysis-run/BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md`
  - “**Observable Outcomes (Loading, Titles)** — *Missed In Phase 4a*”
  - “`pack.json` lacked `required_outcomes` … The LLM generated the generic scenario but **abbreviated the verification leaves**.”

### 2) Window title must be verified explicitly (defect taxonomy + concrete defects)
- **Evidence:** `fixture:BCIN-7289-defect-analysis-run/BCIN-7289_SELF_TEST_GAP_ANALYSIS.md`
  - Observable Outcome Omission includes:
    - **BCIN-7733 (Wrong title on double-click):** “lacks the verification leaf ensuring the **window title exactly matches** the clicked report’s context.”
- **Evidence:** `fixture:BCIN-7289-defect-analysis-run/BCIN-7289_REPORT_DRAFT.md` / `_FINAL.md`
  - Defects directly about window title:
    - **BCIN-7674** (Done): window title shows `"newReportWithApplication"` when creating blank report.
    - **BCIN-7719** (Done): Intelligent Cube new report title should be `"New Intelligent Cube Report"`.
    - **BCIN-7721** (Open): i18n window title not translated for Chinese users.
    - **BCIN-7733** (Open): double-click edit shows wrong title.

These are **SDK/API-visible outcomes** in the benchmark sense because they are explicit, user-visible contract surfaces (and called out in the benchmark prompt as canonical examples).

---

## Phase4a Alignment Check (artifact-level)
### Blocking limitation of this retrospective replay
The benchmark asks to demonstrate whether the skill satisfies the case, aligned to **phase4a** output validation (`drafts/qa_plan_phase4a_r<round>.md`).  
However, the provided evidence **does not include any Phase 4a draft artifact** (no `drafts/qa_plan_phase4a_r1.md` or equivalent), nor a `coverage_ledger`/`knowledge_pack_retrieval` output that would show pack-declared required outcomes mapped to scenarios.

Therefore, we cannot audit an actual phase4a output file for:
- existence of explicit scenarios for each SDK-visible required outcome
- presence of window-title verification leaves
- state-transition scenario chains

---

## Verdict Against Benchmark Expectations

### Expectation A (blocking)
**“SDK/API visible outcomes like window title become explicit scenarios.”**

- **Result:** **FAIL (blocking), per retrospective defect replay evidence.**
- **Why (evidence-based):**
  - `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` explicitly states **Observable Outcomes (Loading, Titles) were missed in Phase 4a**.
  - `BCIN-7289_SELF_TEST_GAP_ANALYSIS.md` states the plan lacked an explicit verification leaf that the **window title exactly matches** the report context (BCIN-7733).

This demonstrates the benchmark’s focus area was not satisfied in the replayed run lineage.

### Expectation B (blocking)
**“Output aligns with primary phase phase4a.”**

- **Result:** **INCONCLUSIVE due to missing phase4a artifact in provided evidence (treated as blocking for this benchmark run).**
- **What’s missing (within the evidence set):**
  - `drafts/qa_plan_phase4a_r<round>.md` for BCIN-7289 is not present in the fixture listing.
- **Impact:**
  - We cannot verify phase4a-format compliance (subcategory-first, atomic steps, observable leaves) at the artifact level.
  - We also cannot verify that the phase4a contract’s SDK-outcome mapping rule was met or repaired.

Given this benchmark is **priority: blocking** and phase4a is the primary phase under test, absence of the phase4a draft output prevents demonstrating compliance.

---

## Minimal Remediation Guidance (within Phase4a contract scope; evidence-driven)
To satisfy the benchmark focus for BCIN-7289-like report-editor features, Phase 4a must include explicit scenarios whose verification leaves assert:

- **Window title contract scenarios**
  - Create blank report → **title is localized human string** (not a key like `newReportWithApplication`) (BCIN-7674).
  - Convert to Intelligent Cube → title equals `"New Intelligent Cube Report"` (BCIN-7719) and is **translated** under zh-CN (BCIN-7721).
  - Double-click to edit existing report → title equals the clicked report’s name/context (BCIN-7733).

- **Loading indicator observable outcome**
  - Create/edit report cycle → verify **exactly one** loading indicator (BCIN-7668).

These must be written as **explicit Phase4a scenarios** with **testable, observable leaves** (not implied).

---

## Evidence Used
- `skill_snapshot/references/phase4a-contract.md`
- `fixture:BCIN-7289-defect-analysis-run/BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md`
- `fixture:BCIN-7289-defect-analysis-run/BCIN-7289_SELF_TEST_GAP_ANALYSIS.md`
- `fixture:BCIN-7289-defect-analysis-run/BCIN-7289_REPORT_DRAFT.md`
- `fixture:BCIN-7289-defect-analysis-run/BCIN-7289_REPORT_FINAL.md` (content mirrors draft in relevant parts)

---

## Final Benchmark Outcome
- **Overall:** **FAIL (blocking)**  
- **Primary reason:** Retrospective replay evidence shows Phase 4a missed explicit observable-outcome coverage (titles/loading), violating the Phase4a contract requirement that SDK/API visible outcomes map to explicit scenarios with observable verification leaves.
- **Secondary blocker:** Phase4a draft artifact is not present in evidence; phase alignment cannot be demonstrated at the artifact level.