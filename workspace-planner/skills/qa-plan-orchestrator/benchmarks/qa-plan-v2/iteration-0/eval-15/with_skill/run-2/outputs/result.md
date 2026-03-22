## ./outputs/result.md

### Benchmark: NE-P4A-COMPONENT-STACK-001  
**Primary feature:** BCED-1719  
**Feature family / Knowledge pack:** native-embedding  
**Primary phase under test:** phase4a  
**Evidence mode:** blind_pre_defect (customer issues only; exclude non-customer issues)  
**Priority:** advisory  
**Benchmark profile:** global-cross-feature-v1  
**Fixture reference:** BCED-1719-blind-pre-defect-bundle (not locally available)

---

## Phase 4a Deliverable: Component-Level QA Plan (Single Embedding Component in Panel-Stack)

### 1) Scope & Intent (Phase4a alignment)
This phase4a artifact specifies **component-level test planning** for a **single native embedding component** when used in a **panel-stack composition**, covering:
- **Panel-stack composition correctness**
- **Embedding lifecycle behavior**
- **Regression-sensitive integration states** (especially where container/panel navigation interacts with embed)

This plan is designed to be executed later with concrete fixture evidence; **no non-customer evidence** is used here, and no customer-issue details were available in the provided environment.

---

## 2) Component Under Test (CUT)
**CUT:** Native Embedding “single embedding component” rendered inside a **panel-stack** container.

**Key interactions:**
- Panel-stack navigation (push/pop/replace/switch panels)
- Embed mount/unmount
- Visibility changes (foreground/background, covered/uncovered by panels)
- Layout changes (resizing, safe area/insets, orientation)
- State synchronization between host container and embedded content

---

## 3) Test Dimensions Required by Case Focus

### A. Panel-Stack Composition (host container + embed)
**Goal:** Validate that embedding behaves correctly when panels are stacked and navigated.

Planned checks:
1. **Embed in root panel**
   - Embed renders correctly on initial panel.
   - No visual clipping; correct z-order relative to panel chrome.
2. **Embed in non-root panel (pushed panel)**
   - Push panel containing embed; verify correct initialization timing.
3. **Embed persists across panel transitions**
   - Push another panel over embed panel; then pop back.
   - Validate embed resumes correctly (no blank, no stale UI).
4. **Multiple panels with embeds (composition stress)**
   - Panel A has embed; push Panel B with embed; pop back to A.
   - Ensure independent lifecycle handling (no cross-contamination of state).
5. **Panel replace/switch**
   - Replace current panel with another containing embed.
   - Switch between tabs/sections if panel-stack supports it.

**Pass/Fail signals:**
- No blank/black embed surface after transitions
- No duplicated embeds or leaked views
- Correct stacking order and input routing (touch/scroll goes to correct surface)

---

### B. Embedding Lifecycle (mount/unmount/visibility)
**Goal:** Ensure embedding lifecycle is correct under stack navigation and app lifecycle events.

Planned checks:
1. **Mount**
   - Verify initialization order: host container ready → embed attaches → content visible.
2. **Unmount**
   - Pop/dismiss panel; ensure embed detaches cleanly (no crash, no lingering resource usage observable via logs/telemetry in later execution).
3. **Visibility toggles**
   - Embed panel covered by another panel: embed should pause rendering if designed, or remain stable without consuming excessive resources.
4. **App lifecycle**
   - Background app while embed visible; resume.
   - Background app while embed covered by another panel; resume and return.
5. **Orientation / size class changes**
   - Rotate while embed visible; rotate while embed is in covered panel; then return.
6. **Memory pressure / recreate**
   - If platform recreates views (or host recreates panel), verify embed rebinds correctly.

**Pass/Fail signals:**
- No crashes on mount/unmount
- No missing content after resume/return
- Deterministic re-attachment (no “stuck loading”)

---

### C. Regression-Sensitive Integration States
**Goal:** Catch cross-feature regressions that commonly appear at integration boundaries.

Planned checks:
1. **Navigation race conditions**
   - Rapid push/pop of embed panel.
   - Push panel and immediately background app; resume; pop.
2. **Input handling and gestures**
   - Scroll inside embed while panel transitions.
   - Back-swipe/back gesture vs embed internal gesture conflicts.
3. **Focus and accessibility**
   - Focus enters embed correctly after panel push.
   - Back navigation restores focus appropriately.
4. **Rendering surface / compositing**
   - Verify embed doesn’t render behind/above unexpected layers when panel changes.
5. **State restoration**
   - Navigate away and back; ensure embed state is consistent (no partial restore).
6. **Error/timeout handling**
   - If embed content fails to load, ensure panel-stack navigation remains stable (no “locked” panel).

**Pass/Fail signals:**
- No dead UI or frozen panel-stack
- Consistent back navigation behavior
- No visual artifacts after rapid transitions

---

## 4) Minimal Phase4a Test Matrix (What must exist)
This is the minimal set of scenarios that demonstrate the case focus is covered.

| Category | Scenario | Expected |
|---|---|---|
| Panel-stack composition | Embed in root panel | Renders correctly; correct layering |
| Panel-stack composition | Push panel with embed; pop back | No blank surface; no crash |
| Lifecycle | Cover embed panel with another panel; uncover | Stable resume; no stale content |
| Lifecycle | Background/foreground while embed visible | Restores correctly |
| Regression-sensitive | Rapid push/pop of embed panel | No crash, no stuck states |
| Regression-sensitive | Gesture conflicts (back vs embed) | Predictable navigation/input routing |

---

## 5) Instrumentation & Evidence Collection Plan (Execution-ready later)
Because fixture evidence is not locally provided, this phase4a plan defines what evidence should be collected when executing:
- **Host navigation logs**: panel push/pop/replace timestamps
- **Embed lifecycle events**: attach/detach/visible/hidden/resume/pause
- **Rendering status**: first-frame rendered, blank-frame detection if available
- **Crash and error logs**
- **Performance counters (optional)**: CPU/GPU spikes on transitions

**Acceptance evidence:** screen recordings for each matrix row + logs correlating navigation and embed lifecycle.

---

## 6) Open Items / Blockers (due to blind evidence constraints)
- The fixture bundle `BCED-1719-blind-pre-defect-bundle` is referenced but **not available locally**, so:
  - No customer-issue reproduction steps can be derived.
  - No customer-issue specifics can be mapped into targeted regression cases.
- `./skill_snapshot/SKILL.md` is not available in the provided environment here, so phase-model specifics cannot be cross-verified beyond the benchmark’s stated “phase4a” requirement.

---

## 7) Phase4a Exit Criteria (Advisory)
This component plan satisfies the benchmark case if:
- The plan explicitly covers **panel-stack composition**, **embedding lifecycle**, and **regression-sensitive integration states** for a **single embedding component** (done above).
- The artifact remains **phase4a-aligned** (component-level planning; not execution results).

---

---

## ./outputs/execution_notes.md

### Evidence used
- Only the benchmark prompt text (no additional fixtures accessible).
- No customer issues provided locally; none referenced beyond fixture name.
- `./skill_snapshot/SKILL.md` not accessible in this environment (blocker).

### Files produced
- `./outputs/result.md`
- `./outputs/execution_notes.md`

### Blockers
- Fixture `BCED-1719-blind-pre-defect-bundle` has no local path / not accessible.
- `./skill_snapshot/SKILL.md` not accessible; cannot validate exact orchestrator phase4a contract wording.

---

## Execution summary
Created a phase4a component-level QA plan for BCED-1719 focused on a single native embedding component within a panel-stack, explicitly covering panel-stack composition, embedding lifecycle, and regression-sensitive integration states. Noted blockers: missing fixture bundle and unavailable SKILL.md for strict contract verification.