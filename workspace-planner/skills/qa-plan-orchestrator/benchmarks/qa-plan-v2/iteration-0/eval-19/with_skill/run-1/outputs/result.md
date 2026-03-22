Saved to `./outputs/result.md`:

---

# VIZ-P4A-HEATMAP-HIGHLIGHT-001 — Phase 4a (Phase Contract) QA Plan Output  
**Primary feature:** BCVE-6797  
**Feature family / knowledge pack:** Visualization / visualization  
**Primary phase under test:** phase4a  
**Evidence mode:** blind_pre_defect (customer issues only; exclude non-customer issues)  
**Priority:** Advisory  
**Benchmark profile:** global-cross-feature-v1  
**Focus:** Heatmap highlighting effect scenarios covering **activation, persistence, and reset** behavior  
**Fixture reference:** BCVE-6797-blind-pre-defect-bundle (not locally available)

## Phase 4a Deliverable: Highlighting Effect Scenarios (Heatmap)
Phase 4a requires producing the phase-appropriate test scenario coverage for the focus area. The following scenarios explicitly cover the required behaviors: **activation**, **persistence**, and **reset**.

### 1) Activation behavior (highlight turns on correctly)
**Scenario 4a-HM-HL-ACT-01: Hover highlights target cell (and only intended target)**
- **Preconditions:** Heatmap rendered with multiple cells; no highlight active.
- **Action:** Hover mouse over a single heatmap cell.
- **Expected:**  
  - The hovered cell enters the highlight state (visual emphasis per spec/theme).  
  - No unrelated cells highlight unless a documented rule exists (e.g., row/column group highlight).
  - Tooltip behavior (if applicable) does not prevent highlight activation.

**Scenario 4a-HM-HL-ACT-02: Click selects/highlights cell and shows selection affordance**
- **Preconditions:** Heatmap rendered; no selection active.
- **Action:** Click a single heatmap cell.
- **Expected:**  
  - Cell is selected/highlighted per interaction design.  
  - Any linked highlight overlays (borders, opacity change) appear consistently.  
  - If both hover and selection exist: selection state is distinguishable and not lost on mouseout.

**Scenario 4a-HM-HL-ACT-03: Keyboard activation (accessibility)**
- **Preconditions:** Keyboard navigation enabled for chart elements (if supported).
- **Action:** Tab/focus into the heatmap; move focus between cells; activate via Enter/Space.
- **Expected:**  
  - Focus ring and highlight activation operate on the focused cell.  
  - Activation triggers same highlight state as pointer click.

### 2) Persistence behavior (highlight remains when it should)
**Scenario 4a-HM-HL-PER-01: Click highlight persists after mouseout**
- **Preconditions:** Heatmap rendered.
- **Action:** Click a cell to highlight; move mouse away from heatmap.
- **Expected:**  
  - Selection highlight remains active until an explicit reset action occurs (per product behavior).  
  - Hovering elsewhere does not clear the click selection unless documented.

**Scenario 4a-HM-HL-PER-02: Highlight persists across tooltip interactions**
- **Preconditions:** Heatmap with tooltip on hover; selection supported.
- **Action:** Click to select a cell; hover to show tooltip; move cursor within tooltip area if interactive.
- **Expected:**  
  - Selection highlight persists while interacting with tooltip.  
  - No flicker/clearing of highlight due to tooltip DOM overlays.

**Scenario 4a-HM-HL-PER-03: Highlight persistence across minor view updates**
- **Preconditions:** Heatmap supports updates that do not change the underlying data identity (e.g., resizing container, theme toggle if available).
- **Action:** Select a cell; resize window/container slightly (or trigger a redraw that should preserve state).
- **Expected:**  
  - Selected highlight persists if the product is designed to maintain selection across redraws.  
  - If state is not intended to persist across redraw: verify consistent, documented clearing behavior (must not be intermittent).

### 3) Reset behavior (highlight clears when it should)
**Scenario 4a-HM-HL-RST-01: Clicking empty space clears highlight**
- **Preconditions:** A cell is selected/highlighted.
- **Action:** Click on heatmap background / whitespace area not corresponding to a cell (or chart canvas area).
- **Expected:**  
  - Highlight selection clears (or behaves per documented rule).  
  - No “stuck” highlight remains.

**Scenario 4a-HM-HL-RST-02: Esc clears highlight (keyboard reset)**
- **Preconditions:** A cell is selected; keyboard events supported.
- **Action:** Press Escape.
- **Expected:**  
  - Selection highlight clears (if Esc is the standard reset gesture in the product).  
  - Focus remains in a predictable location (chart or previously focused cell).

**Scenario 4a-HM-HL-RST-03: New selection replaces previous highlight**
- **Preconditions:** Cell A selected/highlighted.
- **Action:** Click cell B.
- **Expected:**  
  - Cell A returns to non-highlight state.  
  - Cell B becomes highlighted.  
  - No dual-selection unless multi-select is explicitly supported (if multi-select exists, verify modifier-key behavior separately).

**Scenario 4a-HM-HL-RST-04: Data/filter change clears or remaps highlight deterministically**
- **Preconditions:** A cell is selected; filters or data updates supported.
- **Action:** Apply a filter or data refresh that changes the heatmap cell set.
- **Expected:**  
  - Either: highlight clears (if selection cannot be mapped), OR it remaps to the same logical cell identity (if stable IDs exist).  
  - No highlight stuck on an incorrect cell after update.

## Evidence handling (blind pre-defect constraint)
- **Customer-issue evidence required** to confirm intended vs. faulty behavior in blind_pre_defect mode.  
- The referenced fixture bundle is **not locally available**, so no customer-issue excerpts could be incorporated here.  
- This output therefore provides phase4a scenario coverage aligned to the focus area, but does **not** validate against customer-issue evidence within this run.

## Phase 4a Contract Check (Advisory)
- **Focus explicitly covered:** Yes — scenarios are grouped and explicitly cover **activation**, **persistence**, and **reset** behaviors for heatmap highlighting.  
- **Alignment with phase4a:** Yes — this is a phase4a scenario-level deliverable (what to test / acceptance expectations), not later-phase execution results.

---

Saved to `./outputs/execution_notes.md`:

---

## Execution Notes — VIZ-P4A-HEATMAP-HIGHLIGHT-001
### Evidence used
- None. No customer-issue evidence was accessible from the provided fixtures.  
- Fixture reference listed by benchmark: `BCVE-6797-blind-pre-defect-bundle` (no local path available).

### Files produced
- `./outputs/result.md`
- `./outputs/execution_notes.md`

### Blockers
- Could not access `./skill_snapshot/SKILL.md` or any companion references (not present in provided evidence set).  
- Customer-issue-only requirement could not be satisfied because the referenced blind bundle was not available locally; therefore no evidence excerpts could be used.

---

Execution summary:
- Produced a phase4a-aligned scenario set explicitly covering heatmap highlight activation, persistence, and reset.  
- No customer-issue evidence or skill snapshot content was available from the provided fixtures, recorded as blockers in execution notes.