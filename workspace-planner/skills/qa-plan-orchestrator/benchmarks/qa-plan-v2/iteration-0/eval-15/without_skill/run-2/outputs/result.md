# ./outputs/result.md

## Benchmark: NE-P4A-COMPONENT-STACK-001  
**Primary feature:** BCED-1719  
**Feature family / knowledge pack:** native-embedding  
**Primary phase under test:** phase4a  
**Evidence mode:** blind_pre_defect (customer issues only; exclude non-customer issues)  
**Priority:** advisory  
**Benchmark profile:** global-cross-feature-v1  
**Fixture reference:** BCED-1719-blind-pre-defect-bundle *(no local path provided)*

---

## Phase 4a Deliverable: Component Stack QA Planning (Single Embedding Component)

### 4a.1 Scope & Objective (phase4a)
Plan QA coverage for **a single embedding component** where correctness depends on:
1) **Panel-stack composition** (how the embedded component participates in a stacked panel UI and transitions)  
2) **Embedding lifecycle** (mount/unmount, attach/detach, activation/deactivation, focus, resize)  
3) **Regression-sensitive integration states** (app-shell integration boundaries that historically regress: navigation, z-order, event routing, state restoration)

This phase4a output is **planning-focused**: define testable integration states, checkpoints, and minimal contracts that must be verified.

---

### 4a.2 System Under Test (SUT) Model (single embedded component in a panel stack)
**Component:** “Embedding component” (native-embedding) rendered within an application “panel stack”.

**Key integration surfaces**
- **Panel stack container**: manages stacked panels (push/pop, switch, overlay, split, etc.).
- **Embedding host**: creates/owns the embedded native view/surface and mediates lifecycle + input.
- **Navigation/state**: routes between panels and preserves/restores panel state.
- **Event pipeline**: focus, keyboard, pointer, gesture, back navigation.
- **Layout pipeline**: constraints, safe areas, resizing, rotations, DPI/scale changes.
- **Render/z-order**: clipping, occlusion, transparency, interop layers.

**Primary risks in this case focus**
- Misordered lifecycle calls when panel stack composition changes.
- Input/focus leaks across panels or incorrect event capture by embedded surface.
- Visual stacking regressions (embedded view always-on-top/under).
- State restoration issues on navigation or process/host lifecycle transitions.

---

### 4a.3 Panel-Stack Composition Coverage (must be explicit)
Plan coverage for these composition scenarios (at minimum):

1) **Single panel with embedded component**
   - Baseline composition: embedded component is present and interactive.
   - Verify correct layout/clipping within panel bounds.

2) **Push panel over embedded panel (embedded becomes background)**
   - Embedded panel remains in stack but not visible.
   - Expected: embedded content pauses appropriately (or continues if contract says so), and input is not received while obscured.

3) **Pop back to embedded panel**
   - Embedded panel becomes visible again.
   - Expected: content resumes/refreshes correctly, focus restored, no black frame.

4) **Switch between sibling panels (tab-like or stack switching)**
   - Embedded panel toggled visible/invisible repeatedly.
   - Regression-sensitive: repeated attach/detach, resource leaks.

5) **Overlay/Modal panel on top of embedded panel**
   - Embedded panel partially or fully covered by overlay.
   - Expected: correct z-order/clipping; overlay receives input; embedded does not intercept.

6) **Panel resize due to stack changes**
   - Split view, pane collapse/expand, or container resizing.
   - Expected: embedded surface resizes with no flicker, correct aspect behavior.

**Composition assertions/checkpoints**
- Z-order correctness: embedded surface does not “float above” overlays unless explicitly designed.
- Clipping correctness: no draw outside panel bounds.
- Input routing: only topmost active panel receives input.
- Focus: focus transitions on push/pop/switch are deterministic and restorable.

---

### 4a.4 Embedding Lifecycle Coverage (mount → active → inactive → unmount)
Define a lifecycle matrix aligned to panel stack transitions:

**Lifecycle states**
- **Created**: host allocates embedding resources.
- **Attached**: native surface/view attached to UI tree.
- **Visible/Active**: on-screen and interactive.
- **Occluded/Inactive**: in stack but not visible or covered.
- **Detached**: removed from UI tree but component instance may persist.
- **Destroyed**: resources released.

**Lifecycle transitions to validate**
- Created → Attached → Visible (initial navigation to embedded panel)
- Visible → Occluded (push new panel / overlay)
- Occluded → Visible (return / dismiss overlay)
- Visible → Detached (remove embedded panel from stack)
- Detached → Attached (re-add panel without full recreation if supported)
- Any → Destroyed (app shutdown / host teardown)

**Lifecycle checkpoints**
- No crashes on rapid transitions (push/pop quickly).
- No leaked resources (surfaces, handles, listeners) across repeated cycles.
- Deterministic call ordering (no “resume before attach”, no input before visible).
- State retention behavior is consistent with product expectations (either preserved or reset; explicitly asserted).

---

### 4a.5 Regression-Sensitive Integration States (must be explicitly covered)
Plan checks for historically fragile integration boundaries:

1) **Navigation integration**
   - Back navigation when embedded panel is active vs occluded.
   - Deep link to embedded panel then navigate away and back.
   - Verify stack state is correct; no duplicate embedded instances.

2) **Focus & input integration**
   - Keyboard focus entering/leaving embedded view.
   - Pointer/gesture routing when overlay is present.
   - IME/soft keyboard interactions if applicable (open/close while switching panels).

3) **Render & z-order integration**
   - Overlay dialogs, tooltips, context menus above embedded surface.
   - Transparent/rounded corners/clipping scenarios.
   - Screenshot/thumbnail generation for recent-panels if applicable (ensure embedded view doesn’t render stale/blank).

4) **Layout & resize integration**
   - Rotation / window resize / split-screen.
   - DPI scaling changes.
   - Safe area / inset changes (notches, system UI).

5) **State restoration & process lifecycle**
   - Background/foreground transitions while embedded panel is active and while occluded.
   - Restore after host recreation (if supported) with correct stack composition.
   - Confirm embedded component doesn’t break restoration of adjacent panels.

**Regression checkpoints**
- No black frames, stale frames, or wrong surface size after resume.
- No “always on top” rendering bugs during overlays/modals.
- No stuck focus (keyboard events going to hidden embedded view).
- No duplicate resource allocation on restore.

---

### 4a.6 Minimal Phase4a Test Set (advisory)
A compact set intended to prove the above coverage:

**T1: Baseline embed in single panel**
- Navigate to embedded panel; interact; verify layout, input, focus.

**T2: Push/pop stack transition**
- From embedded panel push another panel; verify embedded becomes inactive (no input).
- Pop back; verify resume and focus restoration.

**T3: Overlay modal over embedded**
- Open modal overlay on top; verify overlay z-order and input capture.
- Dismiss; ensure embed visuals and input remain correct.

**T4: Rapid switch stress**
- Switch away/back repeatedly (N times); assert no crash, no progressive slowdown, no duplicated instances.

**T5: Resize/rotation**
- Resize container (split view) and/or rotate; verify correct embedded surface resize and clipping.

**T6: Background/foreground while occluded and while active**
- With embed active: background/foreground; verify resume.
- With embed occluded (another panel on top): background/foreground; return; verify correctness.

---

### 4a.7 Entry/Exit Criteria (phase4a planning checkpoints)

**Entry**
- Feature under test identified (BCED-1719).
- Panel stack composition patterns identified for the product surface.
- Lifecycle contract points (attach/detach/active/inactive) enumerated.

**Exit**
- A single-component plan includes explicit coverage of:
  - panel-stack composition scenarios,
  - embedding lifecycle transitions,
  - regression-sensitive integration states (navigation, focus/input, z-order, resize, restoration).
- Minimal test set mapped to those risks (T1–T6).

---

## Evidence Usage Statement (blind pre-defect compliance)
No customer-issue evidence content was provided in the available fixtures (fixture has no local path and no issue text). Therefore, this phase4a plan is produced **without incorporating any non-customer issues** and **without inventing customer issue details**.

---

# ./outputs/execution_notes.md

## Evidence used
- Fixture reference only: **BCED-1719-blind-pre-defect-bundle** *(no local path; no accessible contents provided)*

## Files produced
- `./outputs/result.md` (this deliverable)
- `./outputs/execution_notes.md`

## Blockers
- Fixture content not accessible (“no local path provided”), so no customer-issue specifics could be used under the blind evidence policy.

---

## Execution summary
Produced a phase4a-aligned single embedding component QA plan explicitly covering panel-stack composition, embedding lifecycle, and regression-sensitive integration states. No fixture evidence content was available to incorporate while complying with customer-issues-only constraints.