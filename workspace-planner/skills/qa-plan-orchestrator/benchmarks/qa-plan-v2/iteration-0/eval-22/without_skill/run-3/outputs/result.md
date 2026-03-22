# BCIN-7289 Phase4a Scenario Draft

## Phase alignment
- Primary phase: `phase4a`
- Artifact type: blind scenario draft
- Feature: `BCIN-7289`
- Feature family: `report-editor`
- Evidence mode: `blind_pre_defect`
- Priority: advisory

This artifact is limited to phase4a scenario drafting. It proposes draft scenario coverage and does not claim execution results, defect confirmation, or later-phase prioritization.

## Blind evidence contract
- Allowed evidence used:
  - `inputs/fixtures/BCIN-7289-blind-pre-defect-bundle/materials/BCIN-7289.issue.raw.json`
  - `inputs/fixtures/BCIN-7289-blind-pre-defect-bundle/materials/BCIN-7289.customer-scope.json`
- Excluded from scenario derivation:
  - `inputs/fixtures/BCIN-7289-blind-pre-defect-bundle/materials/BCIN-7289.adjacent-issues.summary.json`
- Reason for exclusion:
  - Blind policy says `all_customer_issues_only`
  - Customer-scope export says `customer_signal_present: false`
  - Adjacent issue export says `customer_signal_present: false`
  - The adjacent set is therefore non-customer evidence and cannot be used to shape the draft scenarios

## Evidence snapshot
- The feature summary is `Embed Library Report Editor into the Workstation report authoring.`
- The feature description says the current Workstation report editor has overhead and older prompt technology, and that embedding the Library report editor should improve support for prompt enhancements.
- The customer-scope export shows no explicit customer references, no linked customer issues, and no subtasks carrying customer signal at the blind cutoff.

## Coverage map
| Focus area | Draft scenario coverage |
| --- | --- |
| Prompt handling | `P4A-SD-01`, `P4A-SD-04` |
| Template save | `P4A-SD-02` |
| Report builder loading | `P4A-SD-01`, `P4A-SD-03`, `P4A-SD-04` |
| Visible report title outcomes | `P4A-SD-02`, `P4A-SD-03` |

## Draft scenarios

### P4A-SD-01: Prompted template enters prompt flow and continues into the embedded report builder
- Objective:
  - Cover prompt handling when report authoring starts from a template that requires prompt input.
- Preconditions:
  - Workstation can launch the embedded Library report editor for report authoring.
  - A report template exists with at least one prompt that blocks normal report loading until answered.
- Draft flow:
  1. Start report creation from the prompted template in Workstation.
  2. Observe whether the prompt UI appears before the report content loads.
  3. Enter valid answers and continue.
  4. Wait for the editor to transition into the report builder.
- Expected visible outcomes:
  - The prompt is surfaced instead of being skipped or silently deferred.
  - Prompt submission is accepted without leaving the editor stuck in loading.
  - The embedded report builder becomes visible after prompt completion.
- Why this belongs in phase4a:
  - The feature description explicitly calls out prompt support as a reason for embedding the Library editor.
- Evidence basis:
  - Feature description only; no customer-signal issue available.

### P4A-SD-02: Report created from a template can be saved as a distinct report with the intended save path and visible name
- Objective:
  - Cover template-save behavior from the embedded authoring flow.
- Preconditions:
  - A user starts from a report template in the embedded editor and has permission to save a new report object.
- Draft flow:
  1. Create a report from a template in Workstation.
  2. Make a small report change so the draft has unsaved work.
  3. Invoke save or save-as from the embedded editor flow.
  4. Choose a target folder and provide a new report name.
  5. Complete the save action.
- Expected visible outcomes:
  - The save flow creates or names the intended report object rather than silently overwriting the source template.
  - The editor remains attached to the saved report after completion.
  - The visible report title reflects the chosen saved name.
- Why this belongs in phase4a:
  - Template-origin authoring is a primary adoption path for the embedded editor and must be drafted before execution planning.
- Evidence basis:
  - Benchmark-required focus plus feature context; no customer-signal issue available.

### P4A-SD-03: Blank or newly created report loads into the embedded report builder with a usable visible title
- Objective:
  - Cover the initial builder load and top-level title outcome for a newly created report.
- Preconditions:
  - Workstation can create a new report through the embedded Library editor path.
- Draft flow:
  1. Start a new blank report from Workstation.
  2. Wait for the embedded authoring experience to initialize.
  3. Observe the first visible title shown to the user.
  4. Confirm the report builder is usable once loading completes.
- Expected visible outcomes:
  - The embedded report builder loads rather than remaining on a spinner or empty container.
  - The first visible title is human-readable and consistent with report creation, not a raw key or placeholder.
  - The title and builder state appear synchronized to the same newly created draft.
- Why this belongs in phase4a:
  - It validates baseline builder entry and visible naming before deeper scenario expansion.
- Evidence basis:
  - Feature summary plus benchmark-required title coverage; no customer-signal issue available.

### P4A-SD-04: Reopening or continuing a prompted draft preserves prompt completion state and returns to the builder
- Objective:
  - Extend prompt handling coverage to the continue-authoring path after a prompt-governed report has already been started.
- Preconditions:
  - A prompted report draft exists and can be reopened in Workstation through the embedded editor path.
- Draft flow:
  1. Open or resume a prompted report draft.
  2. If prompts are required again, provide valid answers.
  3. Continue into the report builder.
  4. Verify the report remains editable after the transition.
- Expected visible outcomes:
  - Prompt handling remains coherent on resume or reopen.
  - The user returns to the embedded report builder rather than an indefinite loading state.
  - The visible title still matches the report being edited.
- Why this belongs in phase4a:
  - It broadens the draft beyond first-open behavior while staying inside the benchmark focus.
- Evidence basis:
  - Feature description plus benchmark-required prompt and builder coverage; no customer-signal issue available.

## Phase4a conclusion
- The draft explicitly covers the benchmark focus areas:
  - prompt handling
  - template save
  - report builder loading
  - visible report title outcomes
- Because the blind bundle contains no customer-signal issues, these scenarios are advisory draft coverage anchored to feature intent and benchmark focus, not to customer-derived issue evidence.
- No non-customer adjacent defects were used to shape this artifact.
