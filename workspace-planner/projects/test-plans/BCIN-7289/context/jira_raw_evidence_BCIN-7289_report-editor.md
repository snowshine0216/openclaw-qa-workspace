# Jira raw evidence notes — BCIN-7289 report editor

## Scope and method
- Source of truth: Jira CLI (`jira issue view --raw`, `jira issue list -q ...`)
- Authoritative feature: `BCIN-7289`
- Explicit instruction applied: treat `BCED-2416` as supporting / lessons-learned context only, not authoritative scope.

## Access check
- `jira me` succeeded for the configured account.

## Formal hierarchy discovered
- `BCIN-7289` — type `Feature`, status `In Progress`, **no formal parent field populated**.
- Direct child found via JQL `parent = BCIN-7289`:
  - `BCIN-7603` — `Enhancements in Workstation` (`Story`, `To Do`)

## Raw issue facts

### BCIN-7289
- Summary: `Embed Library Report Editor into the Workstation report authoring.`
- Type: `Feature`
- Status: `In Progress`
- Priority: `High`
- Parent: `None`
- Links: `0 formal issue links`
- Description excerpt:
  - Current Workstation report editor has high overhead and uses old tech.
  - Prompt enhancements require separate effort vs Library prompt.
  - Goal is to embed the Library report editor into Workstation authoring similar to dashboard embedding.

### BCIN-7603
- Summary: `Enhancements in Workstation`
- Type: `Story`
- Status: `To Do`
- Parent: `BCIN-7289`
- Description excerpt:
  - Add a new preference to adopt the new report editor.
  - If multiple editors are registered for the same object type and the first fails, fall back to the next registered editor in sequence.

## Related Jira issues found by report-editor history search
These are **not formally linked** from `BCIN-7289`, but they materially affect QA scope because they cover adjacent report-editor behaviors that are likely to regress or require parity validation once Workstation switches to the embedded Library editor.

### BCIN-7044
- Summary: `Add view mode option for user to select when create report based on report template.`
- Type: `Feature`
- Status: `Done`
- Parent: `None`
- Raw evidence points:
  - Introduces pause/design mode vs execution/data-retrieval mode selection.
  - Calls out prompt resolution behavior and parity gaps versus BI Web / Developer.
  - Contains embedded QA-plan style notes describing prompt-first flows and report-template entry behavior.

### BCIN-7073
- Summary: `Spike | Report Editor support prompt resolve in pause mode`
- Type: `Story`
- Status: `Done`
- Parent: `BCIN-7044`
- Raw evidence points:
  - Title directly indicates design investigation for prompt resolution while staying in pause mode.

### BCIN-7074
- Summary: `Implementation | Report Editor enhancement`
- Type: `Story`
- Status: `Done`
- Parent: `BCIN-7044`
- Raw evidence points:
  - Title indicates implementation follow-through for report editor enhancement related to the above feature.

### BCIN-7126
- Summary: `Spike | Report Editor support prompt resolve in pause mode`
- Type: `Test Set`
- Status: `To Do`
- Parent: `None`
- Raw evidence points:
  - Same problem space as `BCIN-7073`, but still open as a test-set artifact.
  - Useful as evidence that prompt/pause-mode support remains QA-sensitive.

### BCIN-1017
- Summary: `Library web | Enhance library web and report editor to respect both feature flag and application setting for report view filter`
- Type: `Story`
- Status: `Done`
- Parent: `BCIN-1008`
- Raw evidence points:
  - Placeholder description, but title explicitly ties report editor behavior to feature-flag and application-setting gating.

### BCIN-7218
- Summary: `implement on report editor to show/hide view filter by application setting and feature flag`
- Type: `Task`
- Status: `Done`
- Parent: `BCIN-1017`
- Raw evidence points:
  - Concrete implementation task for report-editor behavior behind app setting / feature flag.

### BCIN-7049
- Summary: `[Report editor] Attribute metric icon in report page by section is old`
- Type: `Defect`
- Status: `Done`
- Parent: `BCED-3541`
- Priority: `Low`
- Raw evidence points:
  - Defect in report-editor UI iconography / section rendering.
  - Relevant as a visual parity regression indicator for embedded editor rollout.

## Supporting-only context

### BCED-2416
- Summary: `Enhance Workstation dashboard authoring experience with Library capability parity`
- Type: `Feature`
- Status: `Done`
- Parent: `PRD-126`
- Instruction handling: **supporting context only; not treated as scope authority**.
- Raw evidence points:
  - Same architectural direction for dashboard authoring: enable new editor via Workstation preference toggle.
  - Includes compatibility rule: newer server uses embedded web editor; older server falls back to legacy editor.
  - Includes explicit security note: privileges / ACL should match Library Web behavior.
  - Strong lessons-learned analog for rollout, fallback, compatibility, and parity testing.

## Relationship assessment
- Formal hierarchy for this feature is sparse in Jira.
- Material QA scope is driven by:
  1. the main feature objective (`BCIN-7289`),
  2. the only formal child / implementation hook (`BCIN-7603`), and
  3. precedent report-editor issues covering prompt mode, feature-flag gating, and UI parity (`BCIN-7044`, `BCIN-7073`, `BCIN-7074`, `BCIN-7126`, `BCIN-1017`, `BCIN-7218`, `BCIN-7049`).
- `BCED-2416` is relevant for rollout/test heuristics only.

## Raw files saved
JSON snapshots saved under `projects/test-plans/BCIN-7289/context/raw/` for:
- `BCIN-7289`
- `BCIN-7603`
- `BCIN-7044`
- `BCIN-7073`
- `BCIN-7074`
- `BCIN-7126`
- `BCIN-1017`
- `BCIN-7218`
- `BCIN-7049`
- `BCED-2416`
- supporting parent context: `BCED-3541`, `PRD-126`
