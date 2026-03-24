# Benchmark Assessment — VIZ-P4A-HEATMAP-HIGHLIGHT-001 (BCVE-6797)

## Phase under test
- **Primary phase/checkpoint:** **Phase 4a** (subcategory-only QA draft writer)
- **Feature family / knowledge pack:** visualization
- **Evidence mode:** blind_pre_defect
- **Priority:** advisory

## Case focus required by benchmark
Heatmap highlighting effect scenarios explicitly covering:
1. **Activation** (how highlight is triggered)
2. **Persistence** (how highlight remains across interactions / state changes)
3. **Reset behavior** (how highlight clears / returns to default)

## What can be concluded from the provided evidence (blind)
### Evidence observed
- The feature **BCVE-6797** is a Visualization-related feature.
- BCVE-6797 has clone links to:
  - **BCDA-8396 — “iOS mobile - Optimize the highlight effect for Visualizations - Heatmap”**
  - BCIN-7329 — “iOS Mobile - Optimize the highlight effect for Visualizations Bar Chart”

### Phase 4a contract alignment check (advisory)
Under the Phase 4a contract, the orchestrator must:
- spawn the Phase 4a subagent writer (via `phase4a_spawn_manifest.json`)
- produce and validate `drafts/qa_plan_phase4a_r<round>.md`
- ensure Phase 4a output is **subcategory-first** (no canonical top categories)

### Benchmark expectation coverage determination
- **Cannot be demonstrated as satisfied from the provided benchmark evidence.**
- The provided bundle includes **only Jira export metadata** (feature issue + linked-issue summary) and **phase contract documentation**, but **does not include any Phase 4a runtime artifacts**, specifically:
  - no `phase4a_spawn_manifest.json`
  - no `drafts/qa_plan_phase4a_r1.md` (or any Phase 4a draft)
  - no `context/coverage_ledger_<feature-id>.md` or `context/artifact_lookup_<feature-id>.md`

Because the benchmark’s pass condition requires that the Phase 4a output explicitly covers heatmap highlight **activation/persistence/reset** scenarios, and no Phase 4a draft is available to inspect, **this case cannot confirm coverage**.

## Advisory: Phase 4a scenario set that must exist (to satisfy this benchmark)
If Phase 4a were produced correctly for this feature focus (heatmap highlight effect), the draft should include (at minimum) a heatmap-highlight subcategory with scenarios like:

- **Heatmap — Highlight effect**
  - **Activation — tap a cell highlights it**
    - Open a dashboard with a Heatmap visualization
      - Tap a single heatmap cell
        - The tapped cell enters highlighted state
        - Non-selected cells update per design (e.g., dim/retain) <!-- exact effect per spec/evidence -->
  - **Activation — tap row/column header highlights corresponding cells** (if supported)
  - **Persistence — highlight remains after scrolling**
    - Highlight a cell
      - Scroll the dashboard / visualization
        - The same data point remains highlighted
  - **Persistence — highlight remains after interacting with other UI (non-resetting)**
    - Highlight a cell
      - Open and close an overlay (e.g., tooltip/details) <!-- if applicable -->
        - Highlight remains
  - **Persistence — highlight behavior across orientation change / app background-foreground** (mobile)
  - **Reset — tap blank area clears highlight**
    - Highlight a cell
      - Tap outside the visualization (or on blank area)
        - Highlight is cleared
  - **Reset — selecting a different cell switches highlight**
    - Highlight cell A
      - Tap cell B
        - Cell A is no longer highlighted
        - Cell B is highlighted
  - **Reset — apply a filter / change page resets highlight appropriately**
    - Highlight a cell
      - Apply a filter that changes the heatmap data
        - Highlight clears OR rebinds deterministically (must be asserted from evidence)

(These are examples of the *required focus coverage*; Phase 4a must keep a subcategory-first structure per contract.)

## Verdict (for this benchmark run)
- **Status:** **Blocked / Not verifiable with provided evidence**
- **Reason:** Missing Phase 4a output artifacts; cannot validate that activation/persistence/reset scenarios are explicitly covered, nor that the output aligns with Phase 4a gates.