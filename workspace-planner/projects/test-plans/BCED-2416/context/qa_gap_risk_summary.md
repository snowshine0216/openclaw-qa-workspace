# BCED-2416 — QA-Focused Gap and Risk Summary

Saved: 2026-03-10
Purpose: normalized background summary for later coverage mapping; not a QA plan

## Executive summary
BCED-2416 follows the same general migration pattern already documented for Workstation dashboard parity: move from a separate/classic Workstation authoring path toward an embedded Library/Web authoring path, while retaining selected Workstation-native shell integrations and legacy fallback behavior.

For report-editor QA, the most important risk is **not** simply whether a Library feature appears in Workstation. The main risk is whether the Workstation shell, embedded Library editor, and legacy fallback all preserve the correct report state across create/edit/save/cancel/recovery/auth transitions.

## Normalized gap model

### A. Parity gaps that embedding is intended to close
These are the areas where Library historically led and Workstation/classic paths lagged:
- feature availability drift
- prompt and cancel-flow behavior drift
- export/menu/dialog inconsistency
- formatting/property coverage drift caused by older native/XML/API limitations
- toolbar/icon/menu inconsistency
- repeated reimplementation cost for new Library features

### B. Gaps that remain even after parity migration
These remain active QA risks:
- slower first open / first create than legacy editor
- scroll/input responsiveness degradation
- auth popup and embedded-window context failures
- close/cancel/session-timeout lifecycle mismatches
- stale title/menu/object-tree refresh state
- supported-server vs unsupported-server routing/fallback errors
- platform-specific shell differences (Windows vs Mac)

### C. Differences that should be treated as intentional, not failures
These are Workstation-only or desktop-native behaviors that should be validated separately rather than forced into Library parity:
- local mode / local file workflows
- Intelligent Cube conversion
- plugin-based integrations
- change journal
- multi-window desktop management
- admin-console behavior

## Coverage dimensions that later QA mapping should preserve

### 1. Parity dimension
Compare equivalent report-editor behavior across:
- embedded/new Workstation path
- legacy Workstation fallback path
- Library Web behavior where relevant

Key expectation:
- same user intent should reach a safe, understandable, state-consistent result even if exact UI chrome differs.

### 2. Fallback dimension
Must verify routing and downgrade safety for:
- supported server + enabled preference
- unsupported/older server
- environment switching
- restart/reconnect after preference changes

Key expectation:
- fallback is transparent and safe; no mixed menus, stale commands, or stranded editor windows.

### 3. Save/edit workflow dimension
Highest-risk workflow continuity checks:
- create → edit → save
- existing object → save as → folder visibility refresh
- edit without data / pause-mode save path
- unsaved changes on close
- title/name update after save
- post-save execution/pause-state handling

Key expectation:
- save workflows preserve object identity, visible state, and shell metadata consistently.

### 4. ACL / privilege / auth dimension
Must cover:
- read-only versus edit-capable users
- execute allowed but save denied
- save target folder denied
- restricted objects/datasets/prompts
- session timeout in embedded flow
- OAuth / SDK / connector authentication popups

Key expectation:
- no privilege escalation; behavior matches Library authorization, but recovery remains Workstation-safe.

### 5. Performance dimension
Must separately observe:
- cold first open
- cold first create
- warm reopen
- scroll responsiveness
- manipulation latency
- prompt / pause-resume latency
- large-report behavior
- Windows vs Mac differences

Key expectation:
- even if slower than legacy, behavior stays usable and predictable; no severe regressions in first-run or high-interaction paths.

### 6. Report-state and recovery dimension
Most important report-editor-specific area:
- pause mode vs running mode
- prompt / reprompt / nested prompt
- cancel execution
- recoverable execution failures
- document-view rerender correctness
- undo/redo preservation or reset semantics
- post-recovery follow-up edit/save behavior

Key expectation:
- the user remains in the intended report context and can continue safely after recoverable failures or cancels.

## Priority risk inventory

### P0 research-backed risks
1. **Wrong-surface navigation after cancel/error**
   - user may be dumped to Library home, login page, or an unusable embedded state instead of returning to the intended report context.
2. **Close/cancel lifecycle failure**
   - editor cannot close, closes incorrectly, or fails to cancel running work.
3. **Auth / popup / connector breakage in embedded context**
   - OAuth or related auth windows do not hand control back correctly.
4. **Save workflow regressions**
   - missing template/certify controls, stale title, object not visible after save, wrong unsaved-change flow.
5. **Cold-start performance regression**
   - first create/open significantly slower than expected.
6. **Privilege mismatch**
   - edit/save behavior differs from Library ACL expectations.

### P1 research-backed risks
1. duplicate or stale menu entries when toggle/fallback logic changes
2. scroll smoothness and input responsiveness degradation
3. prompt/dataset replacement or apply/cancel dialog failures
4. export behavior changes under embedded mode
5. state corruption after link/navigation/object-editor interactions
6. platform-specific shell issues on Mac vs Windows

## Recommended normalization for later testcase generation
Use these test buckets when mapping coverage later:
- `parity-routing`
- `fallback-compatibility`
- `save-edit-continuity`
- `acl-auth-embedded-context`
- `performance-cold-vs-warm`
- `pause-prompt-recovery-state`
- `close-cancel-window-lifecycle`
- `title-menu-refresh-shell-sync`

## Source basis used for this summary
This normalized summary was derived from existing local evidence already saved under:
- `projects/feature-plan/BCED-2416/context/`
- related prior report-editor recovery research under `projects/feature-plan/BCIN-6709/`

No browser or web-search collection was used in this task.
