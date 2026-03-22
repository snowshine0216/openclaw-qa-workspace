```md
# GRID-P4A-BANDING-001 — Phase 4a Contract Output (Advisory)
Feature: **BCIN-7231**  
Feature family: **modern-grid**  
Primary phase under test: **phase4a**  
Evidence mode: **blind_pre_defect** (customer-issues-only; exclude non-customer issues)  
Configuration: **without_skill**  
Benchmark profile: **global-cross-feature-v1**  
Fixture reference: **BCIN-7231-blind-pre-defect-bundle** (no local path provided)

## Phase 4a — Evidence-Gated Cross-Feature Checks (Advisory)

### 4a.0 Evidence availability gate (blind pre-defect)
**Required for this phase:** customer issue evidence from `all_customer_issues_only` within the referenced fixture bundle.

**Observed evidence provided to this run:** none.  
- The fixture is listed but has **no accessible local path/content**.
- No customer issues were included in the prompt.

**Result:** **BLOCKED** — Phase 4a execution cannot be completed without customer-issue evidence.

---

## 4a.1 Case focus coverage (planned, evidence-required)
Focus required by benchmark: **modern grid banding scenarios** that distinguish:
1) **Styling variants**  
2) **Interactions**  
3) **Backward-compatible rendering outcomes**

Because evidence is unavailable, the following items are **the Phase 4a checklist that would be executed** once customer issues are accessible.

### A) Banding styling variants (evidence-derived validation targets)
For each customer-reported banding scenario, confirm:
- Variant identity: row banding vs column banding vs group/section banding (if applicable).
- Theme/skin differences (e.g., light/dark/high-contrast) impacting band colors.
- State overlays: hover, focus, selected, active/pressed states and their precedence vs banding.
- Density/compact mode and its effect on band application (row heights, zebra pattern continuity).
- Pinned/frozen areas: banding continuity across pinned + scrollable regions.
- Hierarchical/grouped rows: banding reset or continuation rules at group boundaries.

**Expected Phase 4a artifact:** a scenario table mapping each customer issue → expected banding rules → observed outcome.

### B) Interaction-sensitive outcomes
Validate banding does not regress under:
- Sorting and filtering: banding recalculation rules (based on visible order vs original index).
- Virtualization/infinite scroll: banding consistency while recycling rows/cells.
- Row expand/collapse (detail panels, tree data): band index stability.
- Editing: cell edit mode styling precedence (editor background vs banding).
- Selection modes: single/multi-select; checkbox selection; range selection; keyboard navigation focus ring.

**Expected Phase 4a artifact:** interaction matrix with pass/fail per customer issue scenario.

### C) Backward-compatible rendering outcomes
Validate parity/compat rules against legacy/previous grid rendering:
- Rendering engine parity: banding patterns match prior behavior where compatibility is promised.
- CSS/class naming: banding hooks remain stable enough for customer custom CSS (if compatibility is required).
- Export/print/snapshot behaviors (if referenced in customer issues): banding presence and correctness.
- Server-side rendering or hydration (if applicable in customer issues): no flash/shift of banding.

**Expected Phase 4a artifact:** compatibility findings per issue, explicitly marking “no regression” vs “intentional difference” (with rationale).

---

## Phase 4a Deliverable Status
- **Overall:** **BLOCKED (No customer issue evidence available)**
- **Advisory note:** To proceed, provide the customer issues from `BCIN-7231-blind-pre-defect-bundle` (customer-issues-only set). Once available, execute the matrices above and record observed vs expected outcomes per issue.

---

## Evidence used (blind policy compliant)
- **None provided** (fixture not accessible; no customer issues included)

## Files to be produced by orchestrator contract (this run)
- `./outputs/result.md` (this document)
- `./outputs/execution_notes.md` (run notes)
```

---

Execution summary:
- Created `./outputs/result.md` with a Phase 4a advisory output aligned to the banding-focused case contract, but marked **BLOCKED** due to missing customer-issue evidence (fixture listed with no accessible content).
- Created `./outputs/execution_notes.md` noting evidence used (none), files produced, and blocker (no customer issues / no fixture access).