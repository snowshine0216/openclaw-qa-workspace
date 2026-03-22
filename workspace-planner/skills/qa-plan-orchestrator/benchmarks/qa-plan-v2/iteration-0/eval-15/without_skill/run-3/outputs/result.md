<!-- ./outputs/result.md -->

# NE-P4A-COMPONENT-STACK-001 — Phase4a QA Plan (Baseline, Blind Pre‑Defect)
**Feature:** BCED-1719  
**Feature family / knowledge pack:** native-embedding  
**Primary phase under test:** phase4a  
**Case family:** phase contract (advisory)  
**Evidence mode:** blind_pre_defect (customer issues only; exclude non-customer issues)  
**Configuration:** without_skill  
**Focus:** Single embedding component planning that covers:
- panel-stack composition
- embedding lifecycle
- regression-sensitive integration states

---

## 1) Phase4a Intent (what this checkpoint must deliver)
Produce an integration-focused, regression-sensitive QA plan for **a single embedding component** within the **panel-stack** UI composition, covering **embedding lifecycle** and **key integration states** that historically regress.

This is **planning output** (not execution logs). It should be sufficient for a QA owner to implement/execute and to gate release readiness for BCED-1719 changes.

---

## 2) Scope: Component + Composition Under Test
### 2.1 Embedding component under test
A single “native-embedding” component instance embedded inside an application surface that uses a **panel-stack** pattern (stacked panels, navigation, focus management).

### 2.2 Composition surface: panel-stack
The embedding component must behave correctly when:
- it is hosted in a panel that is pushed/popped in a stack
- sibling panels exist (previous/next panels)
- panel transitions occur (animate in/out, lazy mount, preserve state, etc.)
- panel focus and input routing changes across stack operations

---

## 3) Key Quality Risks to Cover (regression-sensitive integration states)
Phase4a requires prioritizing cross-component and lifecycle regressions. The plan must explicitly cover at least:

### 3.1 Panel-stack composition risks
- Incorrect sizing/constraints when panel pushes/pops (clipping, overflow, wrong bounds)
- Z-order / layering issues (overlay, modal, popover conflicts)
- Focus/keyboard navigation conflicts between host panel and embedded content
- Scroll chaining issues (embedded scroll vs panel scroll)
- Event propagation conflicts (touch/mouse/gesture routed to wrong layer)

### 3.2 Embedding lifecycle risks
- Mount/unmount correctness when panel is created/destroyed or shown/hidden
- Suspended/resumed states when panel is backgrounded within stack
- State persistence vs reset on re-entry (depending on product contract)
- Resource cleanup on unmount (listeners, timers, observers, native handles)
- Multiple lifecycle transitions in quick succession (race conditions)

### 3.3 Regression-sensitive integration states
- Rapid navigation: push/pop repeatedly while embedded content is loading
- Host app background/foreground transitions during embedding
- Orientation/viewport changes while embedded panel is not topmost
- Network loss/retry during embedded load while panel changes
- Accessibility mode changes (e.g., screen reader on/off) affecting focus order
- Host-level back navigation vs embedded back handling arbitration

---

## 4) Phase4a Test Matrix (minimum gating set)
> This matrix is deliberately integration-heavy and panel-stack aware. It is the baseline set to demonstrate phase4a coverage for BCED-1719.

### 4.1 Panel-stack navigation & composition
1. **Initial push**: push panel containing embedding component; verify correct render, sizing, and input.
2. **Push over embedded panel**: push a new panel on top; embedded panel becomes backgrounded:
   - ensure embedded content stops receiving input
   - ensure visuals do not bleed through (z-order)
3. **Pop back to embedded panel**:
   - embedded regains focus correctly
   - no stale overlay artifacts
   - state matches expected persistence contract
4. **Replace panel**: replace embedded panel with another panel and back:
   - verify correct unmount/remount behavior
5. **Stack depth stress**: embedding panel at depth N (e.g., 3–5 panels deep):
   - ensure performance remains acceptable (no exponential re-renders)
   - correct bounds on deep stack

### 4.2 Embedding lifecycle transitions
6. **Mount → ready**: from creation to interactive-ready:
   - validate “loading → loaded” transition is visible and stable
7. **Mount → unmount (early)**: pop the panel before ready:
   - no crash; no leaked listeners; no late callbacks altering UI
8. **Suspend/resume**: push another panel on top, wait, then pop:
   - embedded resumes correctly without duplicated subscriptions
9. **App background/foreground** while embedding panel is top:
   - resumes to correct state; no blank content
10. **App background/foreground** while embedding panel is *not* topmost:
   - on returning and then navigating back, embedding is still correct

### 4.3 Input, focus, and accessibility (integration hot-spots)
11. **Keyboard focus traversal**: host controls ↔ embedded content focus order:
   - no focus trap; correct initial focus on entry
12. **Back navigation arbitration**:
   - verify which layer handles back (host panel vs embedded) and that it is consistent
13. **Screen reader enabled**:
   - focus announcements do not break panel transitions; no invisible focus

### 4.4 Layout, scrolling, and viewport changes
14. **Scroll behavior**: embedded scroll vs panel scroll:
   - no scroll chaining bugs; scroll lock behaviors correct
15. **Resize/orientation change** while embedded panel visible:
   - content reflows; no clipped region
16. **Resize/orientation change** while embedded panel backgrounded:
   - on return to embedded panel, layout is correct

### 4.5 Reliability & race conditions (regression-focused)
17. **Rapid push/pop** during load:
   - no crash; no UI corruption
18. **Network loss/retry** while embedded is loading and then panel is pushed/popped:
   - deterministic final state; no zombie loading spinner
19. **Multiple embed instances sanity (guardrail)**:
   - open embedding panel, navigate away, open again; ensure prior instance fully disposed

---

## 5) Observability & Acceptance Criteria (phase4a gate)
### 5.1 Acceptance criteria (must pass)
- No crashes/hangs across all matrix scenarios.
- No persistent UI artifacts after panel transitions (overlays, ghost frames, wrong z-order).
- Focus returns correctly on pop; embedded content does not receive input when backgrounded.
- Layout bounds remain correct across stack operations and viewport changes.
- Lifecycle transitions do not produce duplicated event handlers or stale callbacks updating unmounted UI.
- Behavior is stable under rapid navigation and load races.

### 5.2 What to capture during execution (so failures are diagnosable)
- Timestamps around panel push/pop and embed lifecycle events (mount/ready/unmount)
- UI state snapshots before/after transitions (visual + focus target)
- Any host/embedded navigation handler decisions for back events
- Memory/resource signals if available (listener counts, native handle lifecycle) — optional but recommended

---

## 6) Out-of-scope (to preserve “single embedding component” constraint)
- Full multi-embed orchestration across multiple simultaneous embedded components on the same panel
- Non-panel-stack navigation paradigms (tabs-only, split view) unless panel-stack is layered within them
- Feature-specific content validation inside the embedded payload beyond lifecycle & integration behavior

---

## 7) Traceability to Benchmark Expectations
- **Panel-stack composition:** Explicit scenarios in §4.1 and related acceptance criteria in §5.1.
- **Embedding lifecycle:** Explicit scenarios in §4.2 plus race/early-unmount in §4.5.
- **Regression-sensitive integration states:** Rapid navigation, background/foreground, orientation/resize, network loss, focus/back arbitration covered in §4.3–§4.5.
- **Phase alignment (phase4a):** Plan is integration/regression oriented, suitable for gating and cross-component stability validation rather than unit-level checks.

---

## 8) Evidence Constraints Acknowledgement (Blind Pre‑Defect)
No customer issue evidence was provided in the fixtures for this benchmark run (bundle path not available). This phase4a plan is therefore a **baseline** derived from the benchmark focus and required integration risk coverage, without referencing non-customer issues.