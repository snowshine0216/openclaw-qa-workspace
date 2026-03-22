# GRID-P4A-HYPERLINK-STYLE-001 — Phase 4a Output (Baseline, Blind Pre-Defect)

## Benchmark metadata
- **Case ID:** GRID-P4A-HYPERLINK-STYLE-001  
- **Primary feature:** **BCIN-7547**  
- **Feature family / knowledge pack:** modern-grid  
- **Primary phase under test:** **phase4a**  
- **Case family:** phase contract  
- **Evidence mode:** blind_pre_defect  
- **Priority:** advisory  
- **Benchmark profile:** global-cross-feature-v1  
- **Fixture reference:** BCIN-7547-blind-pre-defect-bundle (no local path provided)  
- **Blind evidence policy:** **all_customer_issues_only** (exclude non-customer issues)

---

## Phase 4a — Coverage/Assertions for the Case Focus (Hyperlink Style vs Ordinary Rendering)

### Case focus to cover (explicit)
**Modern grid hyperlink-style coverage must separate contextual-link styling from ordinary element rendering.**

In phase4a terms (contract-level, advisory), the plan/output must contain **distinct checks** for:

1) **Contextual link styling** (content intended to behave/look like a link within modern grid context), and  
2) **Ordinary element rendering** (non-link text/elements that must not inherit link styling)

This separation is required so failures can be attributed to **link-style rules** rather than general cell rendering.

---

## Proposed phase4a checks (baseline, evidence-blind)

> Note: No customer-issue evidence content was provided in the fixtures, and non-customer sources are disallowed by policy. The following are contract-level checks that satisfy the phase4a requirement to explicitly cover the stated focus.

### A. Contextual-link styling checks (hyperlink-specific)
Validate, for cells/contents that are recognized as links in the modern grid:

- **A1. Link visual style applies only to link content**
  - Link content shows the expected hyperlink styling (e.g., underline/color/visited state per product spec).
  - Styling is stable across typical grid interactions (hover/focus/selection) without reverting to plain text styling.

- **A2. Link interaction states are link-scoped**
  - Hover/focus styles apply to the link text itself and do not “bleed” to the entire cell unless explicitly intended.
  - Keyboard focus indicators (if any) are present on the link target, not only on the cell container.

- **A3. Link semantics vs styling alignment**
  - Content that is semantically a link (e.g., rendered as an anchor/interactive link element) must be styled as a link.
  - Conversely, content styled as a link must have link semantics (avoid “fake links” unless the design explicitly calls for it).

### B. Ordinary element rendering checks (non-link)
Validate, for cells/contents that are **not** links:

- **B1. No unintended hyperlink styling**
  - Plain text, labels, non-interactive spans/divs, and other ordinary renderers do **not** show hyperlink styling (no underlines/blue color/visited state cues).
  - Selection/hover states do not introduce link-like styling to non-link content.

- **B2. Renderer boundaries are respected**
  - Mixed content cells (e.g., some text + a link) only style the link segment as a link; the surrounding text remains ordinary.
  - Row/cell-level styling does not force link styling onto non-link children.

### C. Separation/diagnostic checks (explicitly proving separation)
These checks are included specifically to ensure the plan distinguishes link-style behavior from general rendering:

- **C1. A/B paired scenario**
  - Compare two otherwise-identical cells:
    - one rendered as a contextual link,
    - one rendered as ordinary text.
  - Confirm only the link version exhibits hyperlink styling and link interaction states.

- **C2. Regression guard for “ordinary renderer inherits link CSS”**
  - Ensure that shared CSS classes / inherited styles from grid containers do not inadvertently apply hyperlink rules to ordinary renderers.

---

## Evidence and traceability (blind pre-defect constraints)
- **Customer issue evidence:** Not available in provided fixtures (bundle has no local path and no issue text/logs were provided).  
- **Non-customer issues:** Excluded by policy; none used.  

Given the blind evidence constraints, the above checks are expressed at the **phase4a contract level** to ensure the **case focus is explicitly covered** even without defect-specific reproduction details.

---

## Phase4a alignment statement
This output is aligned to **phase4a** by:
- Explicitly asserting the **coverage separation** required by the case focus (contextual-link styling vs ordinary element rendering).
- Providing **check-level structure** that can be mapped to phase4a expectations (what must be covered/verified), without relying on unprovided fixture data or non-customer evidence.