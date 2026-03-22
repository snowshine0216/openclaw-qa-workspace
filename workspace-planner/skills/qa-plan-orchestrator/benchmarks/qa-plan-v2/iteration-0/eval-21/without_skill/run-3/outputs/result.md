# GRID-P4A-HYPERLINK-STYLE-001 — Phase 4a (Advisory) QA Plan Output  
Feature: **BCIN-7547**  
Feature family: **modern-grid**  
Primary phase under test: **phase4a**  
Evidence mode: **blind_pre_defect** (customer-issues-only; exclude non-customer issues)  
Configuration: **without_skill**  
Priority: **advisory**  
Benchmark profile: **global-cross-feature-v1**  
Fixture reference: **BCIN-7547-blind-pre-defect-bundle** (no local path provided)

## 1) Phase 4a Objective (Checkpoint Contract)
Phase 4a deliverable is a **focused test coverage contract** for the specified feature/phase that:
- explicitly covers the case focus: **modern grid hyperlink-style coverage separates contextual-link styling from ordinary element rendering**, and
- stays within **blind_pre_defect** constraints (use customer issues only; exclude non-customer issues).

## 2) Evidence Gating (Blind Pre-Defect)
### Evidence available to use
- **None provided in the prompt** (no customer issues content included).
- Fixture bundle referenced but **not accessible locally** (“no local path”).

### Impact
- Cannot derive scenario specifics from customer issues.
- Must produce a **baseline phase4a coverage contract** that is feature-focused and explicitly tests the separation between:
  1) *contextual-link* styling, and  
  2) *ordinary element* rendering within modern grid.

## 3) Phase 4a Coverage: Hyperlink Style Separation (Modern Grid)

### 3.1 Scope statement (what this checkpoint must cover)
Ensure the modern grid renders and styles hyperlinks such that:
- **Contextual-link styling logic** (e.g., link color/underline/visited/hover/focus treatment that is specific to a “contextual link” pattern) is applied **only** to genuine hyperlink instances and intended “contextual link” variants.
- **Ordinary element rendering** (text spans, divs, plain cell content, non-link interactive elements) is not inadvertently styled/treated as a contextual link.

This separation must hold across common grid states: default, hover, focus, selection, and high-contrast/forced-colors (where applicable).

---

## 4) Test Design Contract (Phase 4a)

> Note: This is a **baseline** contract because no customer-issue evidence details were provided.

### 4.1 Core rendering matrix (cell content types)
For a single grid column and row set, validate styling and semantics for each cell content type:

1. **True hyperlink**: `<a href="...">Label</a>`
   - Expected: hyperlink semantics present (anchor role by default), link styling rules applied per design.
2. **Contextual link variant** (if distinct from ordinary link in design system)
   - Expected: contextual-link-specific styling applied only here (not to ordinary content).
3. **Plain text**: `Label` in a `<span>` or text node
   - Expected: no link styling (no underline/link color), no link semantics.
4. **Button-like element**: `<button>Label</button>`
   - Expected: button styling/semantics; must not inherit contextual-link styling.
5. **Non-interactive element**: `<div>Label</div>`
   - Expected: ordinary rendering only.

**Assertions (visual + computed style)**  
- Compare computed CSS for `color`, `text-decoration`, `cursor`, and any contextual-link class tokens between:
  - contextual link vs plain text
  - hyperlink vs button
- Ensure no “link-like” styling leaks to non-link elements.

### 4.2 State coverage (interaction states)
Run the above matrix under these states:

- **Default** (no hover/focus/selection)
- **Hover** (pointer hover on link, and separately hover on non-link cell content)
- **Focus** (keyboard focus on link, and focus on other focusable elements)
- **Active/pressed** (mouse down on link)
- **Visited** (if applicable; can be simulated via browser settings or controlled test harness)
- **Row/Cell selection** (selected row/cell; confirm selection styles don’t turn plain content into link styling)

**Assertions**
- Contextual-link styling changes (hover/focus/visited/active) occur only for link elements.
- Selection highlight does not override link styling in a way that makes plain text appear as a link (or vice versa).

### 4.3 Grid-specific contexts (to prevent style leakage)
Validate the same separation in these grid contexts:

- **Virtualized rows** (scrolling causes DOM reuse)
  - Ensure recycled cells don’t retain contextual-link classes/styles when content type changes.
- **Sorting/filtering rerender**
  - Ensure rerender does not misapply link styles to ordinary cells.
- **Cell editing mode**
  - When entering edit mode (e.g., input appears), ensure link styling is not applied to editor text.
- **Pinned columns / header cells**
  - Ensure header text doesn’t inherit contextual-link styling unless it is an actual link.
- **Custom cell renderer vs default cell renderer**
  - Ensure styling logic distinguishes renderer outputs (link vs non-link).

### 4.4 Accessibility and semantics checks
- **Role/Name**
  - Links should expose correct accessible name and link semantics.
  - Non-links must not expose link role.
- **Focus indicators**
  - Focus ring/outline should appear for focusable elements; contextual-link focus styles should not appear on plain text.
- **Contrast**
  - Link style should meet contrast requirements; ensure ordinary text is not forced into link colors that reduce readability.

### 4.5 Negative / regression-style checks (separation failures)
- Plain text cell must not:
  - show underline on hover
  - show pointer cursor
  - adopt visited color
- Button/icon inside a cell must not:
  - inherit link underline/color tokens
- Switching a cell renderer from link → plain text (and vice versa) must not leave stale styling.

---

## 5) Phase 4a Acceptance Criteria (Advisory)
This phase4a checkpoint is satisfied when the plan/test contract explicitly demonstrates:

- A **clear separation** between contextual-link styling and ordinary element rendering in modern grid cells.
- Coverage includes **cell content matrix + state matrix + grid-specific contexts** sufficient to catch style leakage, especially under virtualization/rerender.
- Blind evidence constraints are honored (no non-customer issues used).  
  - Given no customer evidence was provided, the contract remains **baseline** and does not reference external defect details.

## 6) Gaps / Blockers (due to evidence constraints)
- No accessible **customer issue evidence** or fixture contents were provided; therefore:
  - cannot tailor assertions to a specific reported symptom, CSS token, or reproduction steps,
  - cannot confirm environment/browser/theme specifics from the defect context.

Recommended next input to finalize beyond baseline (still customer-issues-only):
- The customer issue description(s) tied to BCIN-7547 (symptom, expected/actual, screenshots, environment), or
- Access to the referenced fixture bundle contents.

---