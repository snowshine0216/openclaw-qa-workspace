# Benchmark Result — P4A-MISSING-SCENARIO-001 (BCIN-7289)

Primary phase under test: **Phase 4a** (subcategory-only draft generation)

Priority: **advisory** • Evidence mode: **retrospective replay**

## Verdict
**PASS (with advisory)** — The Phase 4a contract and provided defect-replay evidence clearly require Phase 4a to generate (or ensure inclusion of) the missing scenario coverage for:

1. **template-save / template creation save behavior**
2. **report-builder loading (double-click → elements load/interactivity)**

However, the benchmark evidence also indicates these were historically missed due to thin knowledge-pack requirements and Phase 4a not forcing explicit state-transition and observable-outcome mapping. This case demonstrates the benchmark focus is explicitly captured as a Phase 4a responsibility, but also highlights why it previously failed.

---

## Phase 4a alignment (what Phase 4a must produce)
Per **references/phase4a-contract.md** Phase 4a must produce a **subcategory-only** plan where each scenario is an atomic step chain with explicit observable verification leaves, and it must keep **support-derived risks visible**.

### Focus area A — Missing scenario generation for **template-save**
**Evidence of required scenario (defect replay):**
- **BCIN-7667 (Done, High):** “Template report save incorrectly overwrites source template instead of creating new report” (core template-save behavior).
- **BCIN-7688 (Open, Low):** “Set as template checkbox disabled when saving newly created report” (template-save dialog/state edge case).

**Phase 4a required scenario coverage (subcategory examples; no top-layer categories):**
- **Template-based report creation → Save creates a new report (does not overwrite template)**
  - Create a report
    - Choose a template
      - Click Save
        - A new report object is created (template remains unchanged)
        - Save target name/location matches new report (not template)
- **Newly created report → Save dialog allows ‘Set as template’ when applicable**
  - Create a blank report
    - Open Save dialog
      - Verify “Set as template” checkbox enabled/disabled follows spec
        - If disabled, an explanatory state/reason is visible (or behavior is explicitly excluded with evidence)

**State-transition explicitly required by the benchmark focus (overwrite path):**
- **Save-As initiated → overwrite-conflict → overwrite-confirmation → result**
  - This is directly called out as a Phase 4a miss in the cross-analysis.
  - Defect evidence: **BCIN-7669 (Open, High)** crash when overriding existing report during save/overwrite.

### Focus area B — Missing scenario generation for **report-builder loading**
**Evidence of required scenario (defect replay):**
- **BCIN-7727 (Open, High):** “Report Builder: fails to load elements in prompt after double-clicking”

**Phase 4a required scenario coverage (subcategory examples; explicit observable outcomes):**
- **Report Builder prompt editor → double-click element → elements render and are interactive**
  - Open a report with prompts
    - Enter Report Builder / prompt editor
      - Double-click an element (attribute/metric prompt element)
        - Element list/sub-elements render (not empty)
        - Elements are interactive (selectable/clickable)
        - No error state is shown

**Related observable outcome omissions that should be verification leaves in Phase 4a (to prevent abbreviated checks):**
- **Single loading indicator** during create/edit load cycle
  - Evidence: **BCIN-7668 (Open, Low)** “Two loading icons when create/edit report”
- **Window title matches current report context** after load/edit
  - Evidence: **BCIN-7733 (Open, High)** wrong title on double-click edit

---

## Why this benchmark is Phase 4a-specific
The fixture analysis explicitly assigns these misses to Phase 4a:
- **State transitions (Save-As / overwrite-conflict; pause mode)** missed in Phase 4a.
- **Observable outcomes (loading indicator, titles, interactivity)** abbreviated/missed in Phase 4a.

Therefore, for this benchmark, success means Phase 4a must *explicitly* draft scenarios that:
- represent the **Save-As overwrite** state transition chain (not just “save as works”)
- verify **Report Builder loading + interactivity** after double-click (not just “open builder”)

---

## Advisory (gap mechanism identified by evidence)
The retrospective evidence indicates the orchestrator previously missed these because:
- required state transitions and required observable outcomes were **not explicitly mandated by the active knowledge pack**, causing Phase 4a drafts to omit them.

This benchmark case is satisfied insofar as Phase 4a’s contract and the defect-replay evidence together clearly define that these scenarios belong in Phase 4a and must be generated with explicit verification leaves.