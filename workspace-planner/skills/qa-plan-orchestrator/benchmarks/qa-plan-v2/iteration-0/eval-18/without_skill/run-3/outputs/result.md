<!-- ./outputs/result.md -->

# QA Plan Orchestrator — Phase 4a Output (Advisory)
**Benchmark case:** SELECTOR-P4A-CONFIRMATION-001  
**Primary feature:** BCDA-8653  
**Feature family / knowledge pack:** search-box-selector  
**Primary phase under test:** phase4a  
**Evidence mode:** blind_pre_defect (customer issues only; exclude non-customer issues)  
**Configuration:** without_skill  
**Priority:** advisory  
**Profile:** global-cross-feature-v1  
**Fixture reference:** BCDA-8653-blind-pre-defect-bundle (no local path provided)

## Phase 4a — Confirmation / Commit Semantics for Search-Box Selector Dropdown
### Objective (Phase 4a contract focus)
Define the **commit/confirmation**, **pending selection**, and **dismissal** behaviors for the search-box selector dropdown—explicitly covering **OK**, **Cancel**, and non-explicit dismissal outcomes—so tests can verify correct state transitions and user-visible results.

---

## 1. State Model (selection lifecycle)
### Key states
- **Committed selection**
  - The value currently applied to the field/model (what other parts of the UI/queries should use).
- **Pending selection**
  - A candidate selection highlighted/temporarily chosen in the open dropdown, **not yet committed**.
- **No selection / cleared**
  - No committed value (if the component supports clearing).

### Events that change state
- **Open dropdown**
  - Pending selection initializes to either:
    - the currently committed item (if exists), or
    - none (if no committed item).
- **Navigate within dropdown (mouse/keyboard)**
  - Updates **pending selection only**.
- **Confirm (OK / Apply / Enter depending on UI)**
  - Copies **pending → committed**, closes dropdown.
- **Cancel**
  - Reverts **pending** to the last committed value (no commit), closes dropdown.
- **Dismiss (click outside, Escape, blur, close icon, etc.)**
  - Must be defined: either behaves like **Cancel** or behaves like **Confirm**.
  - This benchmark case requires explicit planning for dismissal outcomes.

---

## 2. Confirmation controls and expected behaviors
### 2.1 OK / Confirm behavior
**When user selects an item and presses OK:**
- **Commit:** committed value becomes the pending selection.
- **UI updates:** input/display reflects committed value.
- **Side effects:** any dependent behavior that relies on committed value triggers **after OK** (e.g., filtering/search triggers if applicable).
- **Dropdown closes** and focus behavior is consistent (returns to input or next defined target).

**Acceptance checks (Phase 4a):**
- Before OK: pending changes do **not** affect committed-dependent behaviors.
- After OK: committed-dependent behaviors match the newly selected option.

### 2.2 Cancel behavior
**When user changes pending selection and presses Cancel:**
- **No commit:** committed value remains unchanged.
- **UI updates:** input/display returns to committed value (or remains unchanged if it never changed).
- **Dropdown closes**.

**Acceptance checks (Phase 4a):**
- Pending selection changes are discarded.
- No search/filter/model update occurs that would imply commit.

---

## 3. Pending selection rules (while dropdown is open)
Plan must treat “highlighted/previewed choice” as non-committal unless explicitly confirmed.

### 3.1 Keyboard interactions (planning-level)
- Arrow key navigation changes **pending**.
- Enter (if used as OK) must be treated as **Confirm**.
- Escape must be treated as **Cancel** (or mapped to defined dismissal rule; see §4).

### 3.2 Mouse interactions (planning-level)
Define whether a click on an option:
- sets **pending only**, requiring OK to commit, **or**
- immediately commits (in which case OK/Cancel may be absent or redundant).

**For this benchmark’s focus**, if OK/Cancel exist, clicking an option should be planned as **pending update** unless product spec says otherwise; tests must verify the actual intended contract.

---

## 4. Dismissal outcomes (non-explicit close)
Phase 4a requires a defined policy for closing without OK/Cancel.

### 4.1 Dismissal triggers to cover
- Click outside dropdown
- Blur (tab away)
- Close icon (if present)
- Escape (if not already mapped to Cancel)
- Programmatic close (e.g., route change, modal close)

### 4.2 Required explicit decision: Dismiss = Cancel vs Dismiss = Confirm
Plan must choose one of the two consistent patterns:

**Option A — Dismiss behaves like Cancel (recommended for OK/Cancel UX):**
- Any dismissal without OK discards pending changes.
- Committed remains unchanged.
- Rationale: prevents accidental commits.

**Option B — Dismiss behaves like Confirm:**
- Any dismissal commits pending selection.
- Rationale: “selection is the action”; OK is redundant.

**Phase 4a deliverable requirement:** whichever policy applies, tests must assert it across all dismissal triggers listed in §4.1.

---

## 5. Test coverage checklist (Phase 4a)
This checklist is the minimum planning coverage to satisfy the benchmark case focus.

### 5.1 OK confirmation path
- Start with committed = A.
- Open dropdown; change pending to B.
- Press OK.
- Expect committed = B; dropdown closed; dependent behavior uses B.

### 5.2 Cancel path
- Start with committed = A.
- Open dropdown; change pending to B.
- Press Cancel.
- Expect committed = A; dropdown closed; dependent behavior still uses A.

### 5.3 Dismissal path (each dismissal trigger)
For each trigger in §4.1:
- Start with committed = A.
- Open dropdown; change pending to B.
- Dismiss without OK/Cancel.
- Expect outcome matches chosen policy (Cancel-like or Confirm-like), consistently.

### 5.4 Pending selection does not leak
- While dropdown open with pending = B and committed = A:
  - verify any “committed-driven” external behavior still reflects A until confirm (unless spec says live-preview is intended, in which case define it explicitly as part of commit semantics).

---

## 6. Notes / Constraints (blind pre-defect)
- No customer-issue evidence was provided in the accessible fixtures (bundle referenced but not available locally).
- Therefore, the above is a **baseline phase4a contract-aligned plan** for the stated focus area, without incorporating external issue-driven specifics.