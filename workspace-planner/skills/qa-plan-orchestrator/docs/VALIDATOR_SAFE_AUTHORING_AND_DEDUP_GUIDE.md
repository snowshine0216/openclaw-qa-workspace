# Validator-Safe Authoring and Deduplication Guide

This guide captures improvements learned from a full BCIN-7289 run.

It exists for two reasons:
1. prevent subagents from producing semantically good artifacts that still fail validator contracts
2. reduce duplicate scenarios and duplicate grouping nodes in the final QA plan

---

## 1. Why this guide is needed

During the BCIN-7289 run, the orchestrator repeatedly hit avoidable validation failures caused by:
- review artifacts using the wrong row shape
- checkpoint artifacts using human-readable prose instead of validator-readable rows
- grouping nodes being tagged like executable scenarios
- summary nodes being duplicated as both a grouping layer and a testcase node
- deferred stubs surviving after the user explicitly promoted a coverage area
- scenario wording that was technically correct but not executable or user-observable enough

The goal of this guide is to make future runs:
- faster
- more validator-safe
- easier to review
- less repetitive
- less likely to overproduce overlapping scenarios

---

## 2. Core rule: validator-safe beats prose-pretty

When an artifact has a contract, prefer the contract shape over nice prose.

A phase artifact can be semantically correct and still fail if:
- a required section is missing
- rows are not in the exact expected format
- dispositions are not one of the accepted values
- checkpoints are named informally instead of canonically
- scenario/grouping hierarchy is structurally wrong

### Practical implication
When writing or refactoring any phase artifact:
- follow the exact section names from the phase rubric
- follow the exact row format the validator expects
- preserve exact canonical labels where required
- keep freeform commentary outside the required validator rows

---

## 3. Artifact-format rules that should be treated as hard requirements

## 3.1 Coverage ledger

### Required rule
`## Scenario Mapping Table` must use row format, not markdown tables.

Use bullet rows like:
- MCC-01 | EndToEnd | Editor selection gate routes correctly | standalone | planned

Do not use markdown table syntax there.

### Required rule
If coverage candidates exist, every candidate id must appear in the mapping section.

### Required rule
Do not classify Security or Performance as out of scope if the user explicitly promoted them.

---

## 3.2 Phase 4a draft

### Required rule
Phase 4a stays below canonical top-layer grouping.

Do not introduce canonical layers such as:
- EndToEnd
- Security
- Compatibility
- Out of Scope / Assumptions
- Performance / Resilience

These belong later.

### Required rule
Do not use compressed arrow wording.

Bad:
- Save As -> title updates
- Preference ON -> embedded editor loads

Good:
- Save As updates the title shown in the Workstation shell
- Enabling the preference loads the embedded editor

### Required rule
Do not use implementation-heavy wording in executable scenario bullets.

Bad:
- errorHandler bridge API opens a native dialog
- selectedObject is passed into the editor
- WorkstationLoad global variable path

Good:
- Unhandled embedded-editor errors show the expected Workstation error dialog
- Dataset entry uses the currently selected cube context
- Blank-page regression with custom plugin condition is surfaced and recoverable

---

## 3.3 Phase 4b draft

### Required rule
Canonical top layers must be actual top-layer nodes, not just markdown headings.

The top-layer nodes must be:
- EndToEnd
- Core Functional Flows
- Error Handling / Recovery
- Regression / Known Risks
- Compatibility
- Security
- i18n
- Accessibility
- Performance / Resilience
- Out of Scope / Assumptions

### Required rule
Every canonical top layer that appears must contain:
- a subcategory layer
- a scenario layer

A stub top layer with prose only will fail.

### Required rule
Subcategory/grouping bullets must **not** carry `<P1>` / `<P2>` priority tags.

Reason:
The validator interprets any bullet with a priority tag as a scenario node.
If a grouping node is tagged like a scenario, round-to-round preservation logic breaks and creates false regressions.

#### Correct pattern
- Core Functional Flows
    - Editor Selection & Routing
        * Preference Toggle & Version Gating <P1>

#### Wrong pattern
- Core Functional Flows
    - Editor Selection & Routing <P1>
        * Enable preference loads the editor <P1>

---

## 3.4 Review notes (Phase 5a)

### Required rule
`## Context Artifact Coverage Audit` must enumerate artifact headings explicitly.
Do not write `all sections`.

Bad:
- context/confluence_design_BCIN-7289.md | all sections | consumed | ...

Good:
- context/confluence_design_BCIN-7289.md | ## 1. Introduction | consumed | ...
- context/confluence_design_BCIN-7289.md | ## 2. Design | consumed | ...
- context/confluence_design_BCIN-7289.md | ## 3. Non-Functional Requirements | consumed | ...

### Required rule
`## Coverage Preservation Audit` must include rows for any prior-round scenario that:
- was preserved
- was clarified
- was replaced by richer executable coverage
- was enriched from a stub into executable scenarios

### Required rule
If a finding is blocking, the `required action` text in `## Blocking Findings` should match the corresponding rewrite request closely enough for validator linkage.

Example:
- Blocking finding required action: `add C-58 cancel during template retrieval and cleanup verification`
- Rewrite request action: `add C-58 cancel during template retrieval and cleanup verification`

Do not use unrelated shorthand in one place and long-form wording in the other.

### Required rule
A Phase 5a verdict cannot be `accept` while any coverage-preservation row still says `rewrite_required`.
Once the draft is fixed, resolved rows must be updated to `pass`.

---

## 3.5 Checkpoint audit (Phase 5b)

### Required rule
`## Checkpoint Summary` must use rows keyed by exact checkpoint labels:
- Checkpoint 1
- Checkpoint 2
- ...
- Checkpoint 15

Do not use just `1`, `2`, `3`.

### Recommended row shape
- Shipment Readiness | Checkpoint 1 | pass | evidence summary | none

---

## 3.6 Checkpoint delta (Phase 5b)

### Required rule
`## Blocking Checkpoint Resolution` and `## Advisory Checkpoint Resolution` must contain row-like bullet entries, not only prose paragraphs.

### Required rule
`## Final Disposition` must end with one exact bullet:
- accept
or
- return phase5a
or
- return phase5b

---

## 4. Deduplication: why duplicates happen

Duplicates happened in BCIN-7289 for three main reasons.

### 4.1 Grouping node duplicated as testcase node
Example pattern:
- a subcategory called `Workstation–Library Bridge APIs`
- plus a scenario node also called `Workstation–Library Bridge APIs`

Why this happens:
- the orchestrator needs round-to-round preservation of prior titles
- the writer tries to preserve the old title
- but Phase 4b also introduces a new grouping layer
- result: one label is used twice for two different purposes

### 4.2 Summary scenario plus child scenarios with same scope
Example pattern:
- one scenario says `Performance & Resilience`
- then several child scenarios restate first-open, first-create, repeated-open, etc.

Why this happens:
- summary nodes are used to preserve a prior reviewed title
- but they overlap too much with the executable children
- result: apparent duplication and bloated scenario counts

### 4.3 Multiple evidence sources independently generate overlapping scenarios
Example pattern:
- Jira defect source suggests blank-page regression scenario
- precedent analysis suggests environment regression scenario
- performance addendum suggests first-open regression scenario

Without normalization, several artifacts generate near-duplicates that differ only in wording.

---

## 5. How to deduplicate correctly

Deduplication must not silently shrink coverage.
That means dedup is allowed only when the resulting scenario still preserves all distinct:
- triggers
n- risks
- expected outcomes
- user-visible behaviors

### 5.1 Dedup rule: preserve one executable node per unique trigger + risk + outcome combination

If two scenarios have the same:
- entry trigger
- user action
- expected visible outcome
- risk rationale

then they should usually be merged into one scenario with clearer wording.

If they differ in any of those in a meaningful way, keep them separate.

### 5.2 Dedup rule: use subcategories for grouping, not extra summary scenarios

If you need a preserved label such as `Workstation–Library Bridge APIs`, do **not** make it both:
- a subcategory label
- and a scenario that merely summarizes the children

Preferred approach:
- use a renamed subcategory for grouping
- preserve the old label as one lightweight scenario only if the validator truly requires it
- if preserved this way, the preserved scenario must add value by explicitly naming the retained child coverage, not just restating the heading

### 5.3 Dedup rule: merge by scenario family only when the plan stays executable

Allowed:
- merge three almost-identical locale smoke checks into one locale smoke scenario with explicit observed outputs

Not allowed:
- merge `blank page on open` and `cancel during retrieval mode` just because both are “error handling”

Reason:
They differ in trigger, root risk, and recovery expectations.

### 5.4 Dedup rule: convert loops into explicit branches only when branches are materially different

Bad bloating pattern:
- separate scenarios for Save, Save As, Set as Template when one scenario can capture a shared version-comment dialog and only branch where behavior differs

Good pattern:
- one scenario family with explicit branches if:
  - Save uses direct persistence
  - Save As opens native rename dialog
  - Set as Template has a different permission or metadata effect

### 5.5 Dedup rule: keep one scenario for one bug family unless a distinct user path exists

Example:
- BCIN-6519 hover affordance loss
- BCIN-6661 drag/drop regression

If hover visibility is part of the same drag/drop interaction path, it may be enriched into the same executable scenario.
If hover visibility can fail independently from drag/drop, split them.

### 5.6 Dedup rule: do not preserve stubs after explicit promotion

If the user promotes a section from deferred to active coverage:
- remove or replace the deferred stub
- do not keep both the old stub and the new executable scenarios unless the stub itself is needed for preservation auditing and clearly marked as replaced

Reason:
Otherwise the plan appears to contain both:
- “no requirement defined”
- and actual executable coverage
which is confusing and duplicative.

---

## 6. Practical dedup workflow for future runs

Use this sequence before finalizing any draft round.

### Step 1: Identify duplicate candidates
Flag any pair where:
- titles are highly similar
- one node is a summary of the other
- both point to the same source evidence
- both validate the same visible outcome

### Step 2: Classify the duplicate type
Label it as one of:
- grouping-vs-scenario duplication
- stub-vs-executable duplication
- same-trigger same-outcome duplication
- bug-family overlap
- summary-vs-child duplication

### Step 3: Choose the action
- **merge** if trigger + outcome + risk are materially the same
- **rename grouping layer** if a preserved title is colliding with a grouping node
- **replace stub** if executable coverage now exists
- **keep separate** if trigger, outcome, or risk differ materially

### Step 4: Document preservation cleanly
If a summary or stub was replaced by richer scenarios:
- reflect that explicitly in the coverage-preservation audit
- mark the old concern as preserved via richer executable coverage
- avoid leaving both the old stub and the new scenarios in the final plan unless strictly necessary

---

## 7. Recommended future enhancements to the orchestrator docs and templates

## 7.1 Add a dedicated deduplication subsection to phase4b and phase5a references
Add rules like:
- prefer one executable scenario per unique trigger/outcome/risk tuple
- avoid heading duplication
- if preserving a prior title causes a duplicate, rename the grouping layer rather than duplicating the scenario

## 7.2 Add template comments for grouping vs scenario usage
In plan templates, annotate:
- top layer = canonical label only
- subcategory = grouping only, no priority tag
- scenario = executable node, priority tag required

## 7.3 Add a final summary artifact
Generate something like:
- `context/final_plan_summary_<feature-id>.md`

Include:
- total scenarios
- P1/P2 counts
- counts by top-layer section
- duplicate-candidate review results
- preserved-title replacements

This makes executive summary delivery and dedup review much easier.

## 7.4 Add an explicit “user-promoted coverage overrides deferred stubs” rule
If the user explicitly asks for Security or Performance to be added, later phases must not preserve a deferred-only stub for that same area except as an audit-history note.

---

## 8. Short version: what to do next time

1. write validator-shaped artifacts first
2. never put priority tags on grouping bullets
3. never use `all sections` in context audits
4. use exact checkpoint labels (`Checkpoint 1` ... `Checkpoint 15`)
5. preserve prior scenario titles carefully, but do not duplicate them as both headings and testcases unless truly required
6. deduplicate by unique trigger + risk + outcome, not by shared theme alone
7. replace deferred stubs once executable coverage is added
8. record any replacement explicitly in preservation audit rows

These rules should make future runs both cleaner and significantly faster.

---

## 9. Implementation Progress

This section tracks the status of each recommendation from this guide.

### 9.1 Commit `a0a6473` (2026-03-11) — Initial documentation and contract hardening

| Guide Section | Recommendation | Status | Where |
|---|---|---|---|
| §3.2 | No compressed arrow wording in Phase 4a | ✅ done | `SUBAGENT_QUICK_CHECKLIST.md`, preflight in `spawnManifestBuilders.mjs` |
| §3.2 | No implementation-heavy wording | ✅ done | `SUBAGENT_QUICK_CHECKLIST.md`, preflight |
| §3.3 | Canonical top layers must be real top-level bullets | ✅ done | `references/phase4b-contract.md` |
| §3.3 | No priority tags on grouping/subcategory bullets | ✅ done | `references/phase4b-contract.md`, `SUBAGENT_QUICK_CHECKLIST.md`, `templates/qa-plan-template.md` |
| §3.3 | No duplicate label as both grouping and scenario | ✅ done | `references/phase4b-contract.md` |
| §3.4 | Context audit must enumerate headings — not `all sections` | ✅ done | `references/review-rubric-phase5a.md` |
| §3.4 | Coverage Preservation Audit row requirements | ✅ done | `references/review-rubric-phase5a.md` |
| §3.4 | Blocking findings ↔ rewrite requests linkage rule | ✅ done | `references/review-rubric-phase5a.md` |
| §3.4 | `accept` forbidden while `rewrite_required` rows exist | ✅ done | `references/review-rubric-phase5a.md` |
| §3.5 | Exact checkpoint labels (`Checkpoint 1`…`Checkpoint 15`) | ✅ done | `references/review-rubric-phase5b.md` (new file) |
| §3.6 | Resolution sections must be row-like, not prose-only | ✅ done | `references/review-rubric-phase5b.md` |
| §3.6 | `Final Disposition` must end with exact single bullet | ✅ done | `references/review-rubric-phase5b.md` |
| §4–5 | Dedup only when trigger + risk + outcome match | ✅ done | `references/phase4b-contract.md`, `references/context-coverage-contract.md` |
| §7.1 | Dedup subsection in phase4b and phase5a references | ✅ done | `references/phase4b-contract.md`, `references/review-rubric-phase5a.md` |
| §7.2 | Template comments for grouping vs. scenario | ✅ done | `templates/qa-plan-template.md` (complete rewrite) |
| §7.4 | User-promoted coverage overrides deferred stubs | ✅ done | `references/context-coverage-contract.md`, preflight |
| §7.3 | Final plan summary artifact | ⏳ stub only | `reference.md` §Phase 7 stub entry added; generator not yet implemented |

### 9.2 Post-`a0a6473` follow-up fixes (2026-03-11)

These gaps were identified after the initial commit and resolved in the follow-up:

| Gap | Fix | Where |
|---|---|---|
| `docs/VALIDATOR_SAFE_AUTHORING_AND_DEDUP_GUIDE.md` and `docs/SUBAGENT_QUICK_CHECKLIST.md` not registered as required docs | Added to `REQUIRED_FILES` in `docsContract.test.mjs` | `tests/docsContract.test.mjs` |
| No contract assertions for new phase4b / phase5b / phase5a rules | Added 4 new contract tests | `tests/docsContract.test.mjs` |
| `buildPhaseTaskText` preflight injection untested | Added 3 manifest tests (phase4b, phase5a, phase5b) verifying checklist path, preflight block, and grouping-tag rule appear in generated task text | `scripts/test/spawnManifestBuilders.test.mjs` |
| No test for grouping bullet carrying priority tag (§3.3 wrong pattern) | Added `validatePhase4bCategoryLayering rejects grouping bullets that carry priority tags` | `tests/planValidators.test.mjs` |
| No test for `all sections` prohibition in context audit (§3.4) | Added `validateContextCoverageAudit` rejects/accepts tests + enforcement check in validator | `scripts/lib/qaPlanValidators.mjs`, `tests/planValidators.test.mjs` |

### 9.3 Still open

| Recommendation | Status | Notes |
|---|---|---|
| §7.3 Final plan summary artifact generator | ⏳ not yet implemented | Stub documented in `reference.md`. Requires Phase 7 script update to emit `context/final_plan_summary_<feature-id>.md` with scenario counts, P1/P2 split, section distribution, and dedup/preservation log. |
