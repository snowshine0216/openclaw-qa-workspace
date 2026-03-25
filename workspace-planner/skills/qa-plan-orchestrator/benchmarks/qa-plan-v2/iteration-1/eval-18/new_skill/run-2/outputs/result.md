# SELECTOR-P4A-CONFIRMATION-001 — Phase 4a (advisory)

Feature: **BCDA-8653**  
Feature family: **search-box-selector**  
Primary phase under test: **phase4a**  
Evidence mode: **blind_pre_defect**  
Priority: **advisory**  
Focus: **search box selector dropdown planning covers OK or Cancel confirmation, pending selection, and dismissal outcomes**

## Phase 4a deliverable (what the Phase 4a draft must cover)

Below is the **Phase 4a subcategory-only** scenario coverage that must be present in `drafts/qa_plan_phase4a_r1.md` for BCDA-8653 to satisfy this benchmark’s focus.

Central topic:

- Feature QA Plan (BCDA-8653)

Subcategory (Phase 4a allowed):

- Search box selector — multi-select popover confirmation

### Required scenarios (explicitly covering OK/Cancel, pending selection, dismissal)

* OK confirms selection (baseline)
    - Open a page with the multi-selection search box
        - Click the search box to open the dropdown/popover
            - Select multiple items
                - Click **OK**
                    - Popover closes
                    - Selected items are committed/applied (visible in the field / chips / applied filter state)
                    - No additional unintended selections are committed

* Cancel discards pending selection
    - Open the dropdown/popover
        - Note the currently committed selection state
            - Select additional items (creating a pending/unconfirmed delta)
                - Click **Cancel**
                    - Popover closes
                    - Selection state reverts to the previously committed state (no new items applied)

* Dismissal outside the popover does not incorrectly commit pending selection
    - Open the dropdown/popover
        - Select additional items (pending/unconfirmed)
            - Click outside the popover (or press `Esc`, whichever is supported)
                - Popover closes
                - Pending/unconfirmed changes are **not** committed (either discarded, or a defined behavior is observed)
                - No unexpected intermediate apply occurs

* Popover must not dismiss unexpectedly while selection is loading/pending
    - Open the dropdown/popover on a long list
        - Scroll the list
            - Rapidly select multiple items
                - While the UI indicates loading/pending (spinner/disabled OK/etc., if applicable)
                    - Continue interacting (scroll, select)
                        - Popover remains open (no unexpected dismissal)
                        - UI remains responsive enough to continue selection

* Pending selection state is clearly represented and gated by OK
    - Open the dropdown/popover
        - Select/deselect items
            - Observe the UI state before pressing OK
                - Pending changes are visually represented (e.g., checkmarks) but not applied outside the popover
                - OK is the explicit commit action

* OK behavior when selection is still pending/loading
    - Open the dropdown/popover
        - Trigger a pending state (e.g., select many items quickly / scroll+select)
            - Click **OK** during pending/loading (or attempt to)
                - If OK is disabled while pending, it cannot be clicked
                - If OK is clickable, commit result is correct (no partial/incorrect apply)
                - Popover close timing is consistent with commit completion (no silent loss)

* Cancel behavior during pending/loading
    - Open the dropdown/popover
        - Trigger a pending state
            - Click **Cancel**
                - Popover closes
                - No committed selection change occurs
                - No background apply happens after close

### Optional-but-aligned dismissal variants (include if supported by product)

* Keyboard dismissal (`Esc`) with pending changes
    - Open the dropdown/popover
        - Make pending changes
            - Press `Esc`
                - Popover closes
                - Pending changes are not committed

* Focus loss (tabbing away) with pending changes
    - Open the dropdown/popover
        - Make pending changes
            - Move focus away (Tab / click another control)
                - Popover closes or remains open per spec
                - Pending changes are not incorrectly committed

## Phase 4a contract alignment notes

- This content is **subcategory-first** and does **not** introduce canonical top-level categories (per Phase 4a forbidden structure rules).
- Each scenario is written as an **atomic nested action chain** with **observable verification leaves**.
- The scenarios directly map to the benchmark focus:
  - **OK confirmation**: covered
  - **Cancel confirmation**: covered
  - **Pending selection**: covered (including OK/Cancel under pending)
  - **Dismissal outcomes**: covered (outside click / Esc / focus loss variants)

## Evidence anchor (blind pre-defect)

This Phase 4a coverage is anchored to the fixture Jira text for BCDA-8653, which states:

- Users need an **“OK” button** to confirm selection.
- The popover **dismisses unexpectedly** when selection is still loading (debounce / long list scrolling / multi-select).

(See execution notes for exact evidence files used.)