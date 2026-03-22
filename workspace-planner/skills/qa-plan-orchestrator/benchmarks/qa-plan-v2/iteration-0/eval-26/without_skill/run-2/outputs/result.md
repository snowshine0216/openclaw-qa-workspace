```md
# GRID-P1-CONTEXT-INTAKE-001 — Phase 1 (Context Intake) Contract Check
Feature: **BCIN-7231**  
Feature family / knowledge pack: **modern-grid**  
Primary phase under test: **phase1 (context intake)**  
Evidence mode: **blind_pre_defect** (customer issues only; exclude non-customer issues)  
Priority: **advisory**  
Benchmark profile: **global-cross-feature-v1**  
Fixture reference: **BCIN-7231-blind-pre-defect-bundle** (not locally accessible in this run)

---

## 1) Phase 1 Goal (what this artifact must achieve)
Capture and preserve **banding requirements**, **style constraints**, and **rendering assumptions** *before* any scenario drafting. This output is restricted to **context intake** and should not include test scenarios or step-by-step test cases.

---

## 2) Evidence available for intake (blind pre-defect policy)
### Evidence provided in this benchmark run
- Fixture bundle referenced: **BCIN-7231-blind-pre-defect-bundle**
- Local access: **none** (no local path; no contents provided)

### Blind evidence policy compliance
- Customer-issues-only requirement: **cannot be satisfied or evaluated** because **no customer issue content** was provided in the accessible evidence set.
- Exclusion of non-customer issues: **no non-customer issues were used** (none were provided).

**Resulting constraint:** No feature-specific facts (banding, styling, rendering) can be asserted without violating the “use only provided evidence” rule.

---

## 3) Context Intake Output (Phase 1 artifact)
### 3.1 Feature intent (from accessible evidence)
- **Unknown / not evidenced**: The benchmark does not provide any textual description of BCIN-7231, its UI behavior, or acceptance criteria in the accessible fixtures.

### 3.2 Banding requirements to preserve (Phase 1)
- **Not available in evidence.**
- **Intake placeholders (to be filled when customer issue evidence is available):**
  - Banding triggers (e.g., alternating rows, grouped bands, conditional bands)
  - Banding scope (rows / columns / groups / pinned sections)
  - Banding precedence vs selection/hover/focus states
  - Banding behavior under virtualization, sorting, filtering, grouping, and pagination
  - Banding persistence across re-render and data refresh

### 3.3 Style constraints to preserve (Phase 1)
- **Not available in evidence.**
- **Intake placeholders:**
  - Theme variables/tokens affecting grid cells and bands
  - Contrast/accessibility constraints for band colors
  - Interaction state styling (hover/active/selected/focused) vs banding
  - Header vs body styling constraints, pinned column styling constraints
  - Cross-browser rendering constraints (if stated by customer issues)

### 3.4 Rendering assumptions to preserve (Phase 1)
- **Not available in evidence.**
- **Intake placeholders:**
  - Rendering model (virtualized rows, partial DOM, canvas vs DOM—if applicable)
  - Expected behavior during fast scroll / resize
  - Reconciliation expectations (no flicker, stable band alignment)
  - RTL/LTR assumptions
  - Zoom / fractional pixel rounding assumptions, high-DPI assumptions

### 3.5 Explicit non-goals for Phase 1 (guardrails)
- Do **not** draft scenarios, test cases, or execution steps in this phase.
- Do **not** infer requirements absent evidence.
- Do **not** introduce non-customer sources.

---

## 4) Contract evaluation against benchmark expectations
### Expectation A
**[phase_contract][advisory] Case focus is explicitly covered: context intake preserves banding requirements, style constraints, and rendering assumptions before scenario drafting**

- **Partially satisfied (structure only).**
- The output explicitly enumerates the three required areas and preserves placeholders, but **cannot preserve actual requirements** due to missing evidence content.

### Expectation B
**[phase_contract][advisory] Output aligns with primary phase phase1**

- **Satisfied.**
- Output remains in **context intake** and avoids scenario drafting.

---

## 5) Required follow-ups / blockers to proceed
To complete Phase 1 intake for BCIN-7231 under blind-pre-defect rules, provide **customer issue evidence** contained in **BCIN-7231-blind-pre-defect-bundle** (or its text excerpts), such as:
- Customer-reported description of banding behavior/regressions
- Screenshots or rendering artifacts descriptions
- Styling/theming constraints mentioned by customers
- Browser/device conditions and reproduction notes from customers

Until then, Phase 1 can only be a **template intake** and cannot capture feature-specific constraints.
```

## Execution summary
Produced `./outputs/result.md` containing a Phase 1 context-intake artifact focused on banding, style constraints, and rendering assumptions, without drafting scenarios. Evidence bundle `BCIN-7231-blind-pre-defect-bundle` was referenced but not accessible (no local path/contents), which blocks extracting any customer-issue-derived requirements. Also produced `./outputs/execution_notes.md` noting evidence used, files produced, and the missing-fixture blocker.