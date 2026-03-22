# BCIN-7289 — Self-Testing Gap Analysis & QA Plan Workflow Enhancements

**Prepared:** 2026-03-21  
**Based on:** BCIN-7289_REPORT_FINAL.md, BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md, qa_plan_phase6_r1.md, coverage_ledger, deep_research_synthesis, bced_2416_lessons, qa-plan-orchestrator SKILL.md + reference.md + all review rubrics

---

## Part 1 — Why 16 of 26 Defects Were Missed in Self-Testing

### Overview

The 16 missed defects are not random carelessness. They cluster into **5 distinct root cause patterns**, each pointing to a different structural gap between how the QA plan is produced and how it is consumed (or not consumed) by developers.

---

### Root Cause A — The QA Plan Was Never Converted Into a Developer Artifact (7 defects)

**Defects:** BCIN-7667, BCIN-7677, BCIN-7685, BCIN-7687, BCIN-7675, BCIN-7707, BCIN-7724

The QA plan `qa_plan_phase6_r1.md` is a **QA team artifact** — layered XMindMark with nested atomic steps, observable outcomes, fixture requirements, and exploratory charters. It is well-structured for QA engineers planning test execution. It is **not** formatted for a developer to run through before pushing a PR.

There is no lightweight "Developer Smoke Test" derived from the plan. When BCIN-7667's developer worked on template ID fetching, there was no 5-line checklist that said: *"1. Create from template. 2. Hit Save. 3. Confirm new report created — NOT template overwritten."* The full scenario exists in the plan, but it is buried in a 400-line nested document.

Each of these 7 defects is a P1 scenario requiring ≤5 minutes to reproduce with a test environment already set up. The barrier was access to a digestible checklist, not engineering effort.

---

### Root Cause B — Known Analog Risks Were Documented But Not Enforced as Executable Gates (3 defects)

**Defects:** BCIN-7691 (folder not refreshed = DE332260 analog), BCIN-7688 (checkbox disabled = DE331555 analog), BCIN-7675 (80% perf regression = DE332080 analog)

The `deep_research_confluence_bced_2416_lessons_BCIN-7289.md` and `deep_research_synthesis` files both explicitly name these three F43445/BCED-2416 defect patterns as high-risk analogs. They appear in the QA plan's Regression section. The coverage ledger flags them as `must_stand_alone` scenarios.

But the plan treats them as **advisory context** ("watch out for this") rather than **mandatory executable gates** ("this scenario must pass before you ship"). There is no mechanism that differentiates "P1 scenario with an exact historical analog" from "P1 scenario that is new and speculative."

Historical defect knowledge was captured in context artifacts but never operationalized into a reinforced test requirement.

---

### Root Cause C — The QA Plan Has Scenario Gaps (3 defects)

**Defects:** BCIN-7669 (save-override crash), BCIN-7727 (Report Builder element loading), BCIN-7730 (template + prompt pause mode)

These three defects hit code paths that have no scenario in the QA plan (Gaps 1, 2, 4 in the Cross-Analysis document). No amount of self-testing discipline helps here — the scenario was not written.

- **BCIN-7669/7724 (save-override):** The plan covers "Save" and "Save-As" as entry points but maps them to the happy-path dialog appearance, not the overwrite-conflict resolution path. The design doc (§2.2.4) mentions `openSaveAsDialog` but the overwrite confirmation path is implied, not explicit.
- **BCIN-7727 (Report Builder double-click):** The coverage ledger lists "Report Builder" only as a fixture type, not as an interaction scenario. Phase 3 deep research focused on Workstation-Library gap analysis at the save/dialog level, missing in-editor authoring interactions.
- **BCIN-7730:** Combination scenarios (template × prompt pause mode) are hard to derive from per-capability analysis alone; they emerge from integration paths that span two independently implemented behaviors.

---

### Root Cause D — `setWindowTitle` SDK Integration Was Treated as Trivial (3 defects)

**Defects:** BCIN-7674, BCIN-7719, BCIN-7733

`setWindowTitle` is listed in the design doc's SDK function table. The coverage ledger and synthesis both capture it under "SDK Functions Exposed to Library." But because it is a one-line call and not a "behavior," it was never translated into a verifiable outcome in any scenario. The plan checks "the editor opens" — it never checks what text appears in the window title bar.

Window title is a **rendered integration contract** between the Library editor and Workstation's native window management. Three different defects hit it via three different paths (blank create, IC create, edit mode), meaning the SDK call was incorrectly wired in multiple code paths. One "check window title" scenario covering all modes would have caught all three.

The underlying pattern: the Phase 4a subcategory-draft writer translated coverage ledger scenario units into executable scenarios, but SDK functions that appeared only in prose (not named SUs) were silently dropped.

---

### Root Cause E — PR-Level Coverage Is Not Verified Against QA Plan (remaining defects)

**Defects:** BCIN-7673, BCIN-7680, BCIN-7704, BCIN-7695, BCIN-7708

These are all in areas where the QA plan has explicit scenarios — but there is no PR review step that asks "which QA plan scenarios are affected by this change?" A PR fixing BCIN-7704 (FORMAT/VIEW menus) touches `workstation.json` and `main.js`. The reviewer does not know to ask: *"Did you run the Compatibility / UI Parity scenario before merging?"*

The QA plan exists in isolation from the PR workflow. No traceability link exists between a changed file and the QA scenarios that exercise it.

---

### Defect Distribution by Root Cause

| Root Cause | Defects | Count |
|-----------|---------|-------|
| A — No developer-facing checklist | BCIN-7667, BCIN-7677, BCIN-7685, BCIN-7687, BCIN-7675, BCIN-7707, BCIN-7724 | 7 |
| B — Analog risks not hard-gated | BCIN-7691, BCIN-7688, BCIN-7675* | 3 |
| C — Missing scenarios | BCIN-7669, BCIN-7727, BCIN-7730 | 3 |
| D — SDK integration not verified | BCIN-7674, BCIN-7719, BCIN-7733 | 3 |
| E — No QA plan ↔ PR traceability | BCIN-7673, BCIN-7680, BCIN-7704, BCIN-7695, BCIN-7708 | 5 |

*BCIN-7675 spans Root Causes A and B.

---

### Preventive Work That Can Be Done

#### Prevention 1 — Developer Smoke Test Extraction (highest leverage)

After the QA plan is finalized, automatically extract a **Developer Smoke Test checklist**: all P1 scenarios + analog-risk scenarios, stripped of their full nested step tree, formatted as a 1-page table:

| Scenario Name | Entry Point | Acceptance Signal | Est. Time |

This lives in the PR template or as a `SMOKE_TEST.md` in the feature branch.

**Rule:** No PR merges without the author reviewing each row. For non-affected paths, they mark N/A with reasoning. The act of reviewing forces engagement with the coverage before QA even starts.

#### Prevention 2 — Analog Risk Promotion to Hard Gates

When a QA plan detects a historical analog (via `bced_2416_lessons` or equivalent deep research artifact), those scenarios must be tagged `[ANALOG-GATE]` and treated the same as P0 release criteria — not advisory. The release recommendation currently has a "risk areas to watch" list; analogs should be promoted from "watch" to "gate."

Concretely:
- DE332260 analog = "Save-as folder visibility" → **must pass before any save-related PR merges**
- DE331555 analog = "Dialog completeness" → **must pass before any dialog integration PR merges**
- DE334755 analog = "Dialog dismiss after window close" → **must pass before close/cancel PR merges**

#### Prevention 3 — QA Plan Handoff to Dev at PR Creation Time, Not Post-QA

Currently the QA plan is created by the planner workspace and consumed by the QA workspace. The dev team likely never sees it. The plan should be shared at the **start of implementation**, not after:
- Coverage ledger scenario units (SU-01 to SU-38) linked in the Jira feature description
- P1 scenarios shared in dev-readable format when the feature enters development sprint

#### Prevention 4 — SDK Integration Point Scenario Generation

Any SDK function in the design doc that carries a user-visible outcome (window title, dialog appearance, folder visibility, error display) should automatically generate an integration scenario. Pattern: **design doc SDK table row → mandatory scenario**. Currently SDK functions are captured in coverage ledger prose but not systematically promoted to named scenario units.

---

## Part 2 — How to Enhance the QA Plan Skill Workflow

Enhancements are tied to specific phases and artifacts in the `qa-plan-orchestrator` skill.

---

### Enhancement 1 — Phase 4a: SDK/API Contract Scenario Generator

**Where:** Phase 4a subcategory-draft writer contract (`references/phase4a-contract.md`)

**Current behavior:** Phase 4a spawns a writer using coverage ledger scenario units (SU-01 to SU-38). SDK functions appear in synthesis prose but are not promoted to SUs and are silently dropped by the writer.

**Enhancement:** Require the Phase 4a writer to scan the synthesis artifact for any **SDK/API table** (e.g., `## SDK Functions Exposed to Library`) and generate an explicit scenario for each function that has a user-visible outcome. The scenario must verify the **rendered result** of the SDK call, not just the action that triggers it.

Example rule to add to `phase4a-contract.md`:
```
For every SDK function or override property listed in the synthesis artifact:
  IF the function produces a user-visible rendered outcome (text, dialog, title, folder state):
    GENERATE a dedicated scenario verifying that outcome
    ADD the scenario to the relevant capability family section
    DO NOT rely on the action scenario to implicitly cover the rendered output
```

For BCIN-7289:
- `setWindowTitle` → "Window title is correct for each creation and edit mode" scenario
- `errorHandler` → "Error dialog text is human-readable and actionable" scenario
- `getUserComments` → verified through existing save dialog scenarios (already covered)

**Prevents:** Root Cause D (3 window-title defects), reduces future API-integration blind spots broadly.

---

### Enhancement 2 — Phase 5b: Analog Gate Classification + Validator

**Where:** Phase 5b checkpoint audit format and `review-rubric-phase5b.md`; Phase 5b `--post` validator

**Current behavior:** Phase 5b adds shipment checkpoints. The checkpoint audit tracks whether checkpoints are resolved. The release recommendation says "risk areas to watch." Analog-risk scenarios are P1 scenarios like any other — no special classification or enforcement.

**Enhancement:** Add an `[ANALOG-GATE]` classification to the checkpoint audit format:

```markdown
## Analog Gates
| Analog Source | Defect Referenced | Scenario in Plan | Gate Status |
|---|---|---|---|
| DE332260 (F43445) | folder not visible after save | "Save As folder visibility is immediate" | REQUIRED_BEFORE_SHIP |
| DE331555 (F43445) | checkbox missing in save dialog | "Save Dialog Completeness" | REQUIRED_BEFORE_SHIP |
| DE334755 (F43445) | dialog persists after window close | "Error dialog dismisses after source closes" | REQUIRED_BEFORE_SHIP |
```

These gates appear as their own section in the Release Recommendation, listed before "Advisory items."

Add a validator rule to `validate_checkpoint_audit`:
- When a `bced_*/deep_research_*lessons*.md` artifact is present in `context/`, at least one `REQUIRED_BEFORE_SHIP` gate must exist in the checkpoint audit.
- The Release Recommendation section must list each gate explicitly.

**Prevents:** Root Cause B (3 defects), ensures analog risk is never just a prose note again.

---

### Enhancement 3 — Phase 7: Developer Smoke Test Output Artifact

**Where:** Phase 7 finalization (`scripts/phase7.sh`, `scripts/lib/finalPlanSummary.mjs`)

**Current behavior:** Phase 7 archives, promotes `qa_plan_final.md`, generates `final_plan_summary_<feature-id>.md` (scenario counts, P1/P2 split, section distribution), sends Feishu notification.

**Enhancement:** Phase 7 produces a second output: `developer_smoke_test_<feature-id>.md`.

Generation rule:
1. Take all P1 scenarios + all `[ANALOG-GATE]` scenarios from `qa_plan_final.md`
2. Strip nested atomic steps — keep only: scenario name, single-sentence trigger, single-sentence acceptance signal, estimated time (default 5 min unless performance/exploratory)
3. Format as a flat markdown checklist table with a checkbox column
4. Save under `runs/<feature-id>/developer_smoke_test_<feature-id>.md`
5. Include in Feishu notification alongside the existing summary

The checklist is the artifact that lands in the Jira feature description or PR template.

Example output row:
```
| [ ] | Save overrides existing report | Click Save on a report that already exists in the target folder | Report saved without error; no JS crash; updated version visible in folder | 5 min |
```

**Prevents:** Root Cause A (7 defects — the single largest cluster). Requires zero changes to QA plan content, only a new output from an existing phase.

---

### Enhancement 4 — Phase 5a: Cross-Section Interaction Audit

**Where:** Phase 5a review rubric (`references/review-rubric-phase5a.md`), Section Review Checklist

**Current behavior:** Phase 5a audits each section independently (EndToEnd, Core Functional Flows, Error Handling, etc.) for coverage, executable steps, and preservation. It checks whether scenarios exist within each section.

**Gap:** The rubric never checks for **cross-section interaction coverage** — scenarios that combine behaviors from two different sections. BCIN-7730 (template × prompt pause mode) and BCIN-7708 (close × prompt-editor-open) are both intersection defects that sit at the boundary between two independently-covered capability families.

**Enhancement:** Add a mandatory review item to Phase 5a `## Section Review Checklist`:

```markdown
## Cross-Section Interaction Audit
For each pair of P1 capability families where both are independently covered:
  Identify the most likely user-observable interaction between them
  Confirm at least one scenario in the plan covers the joint state
  If no joint scenario exists, flag as advisory finding with suggested combination
```

Required pairs to check for any embedded editor feature:
- Save × Prompt (save behavior when a prompt is active)
- Save × Template (save path when report is template-sourced)
- Close × Active Dialog (close behavior when a sub-dialog is open)
- Error × Session State (error handling during different session states)
- Convert × i18n (convert dialog in non-English locale)

**Prevents:** Root Cause C (combination scenarios), directly catches Gaps 4 and 9 at plan-creation time.

---

### Enhancement 5 — Defect Feedback Loop: Gap Injection Between Features

**Where:** New post-execution step — either a `phase8` in qa-plan-orchestrator or a standalone `defect-feedback` skill in workspace-reporter

**Current behavior:** `defects-analysis` (reporter workspace) and `qa-plan-orchestrator` (planner workspace) are completely siloed. Defect analysis produces a final report that humans read. There is no mechanism to feed found defects back into the QA plan to close gaps for the next feature or the next sprint.

**Enhancement:** A `defect-feedback` step runnable after defect analysis completes:

1. Reads `<run-key>_REPORT_FINAL.md` + `<run-key>_QA_PLAN_CROSS_ANALYSIS.md` from reporter workspace
2. Maps each open/filed defect to a scenario in `qa_plan_final.md` by capability family
3. For defects with no matching scenario (Root Cause C gaps), emits `gap_injection_<feature-id>.md` under the planner context directory
4. On the next QA plan run for the same or a related feature, Phase 3 reads all available `gap_injection_*.md` as additional evidence sources alongside design doc and BCED analog research
5. The coverage ledger Phase 3 pass treats gap-injection entries as `must_stand_alone` scenario units with the source tag `gap_injection`

This closes the learning loop: **defects found this sprint become scenarios enforced next sprint**, without requiring a human to manually update the plan template.

---

### Enhancement 6 — Phase 3 Coverage Ledger: Combination Dependencies Column

**Where:** Phase 3 coverage mapping output, `coverage_ledger_<feature-id>.md` scenario unit table schema

**Current behavior:** Each scenario unit (SU-XX) maps to a single capability family, has a `Merge Policy` column (`must_stand_alone` / `may_merge_with_same_outcome`), and an evidence source column. There is no concept of a scenario that depends on another capability family being in a specific state.

**Enhancement:** Add a `Combination Dependencies` column to the scenario unit table:

```
| SU-12 | Template ops | File → Set as Template | Template flag set | Functional | P2 | ... | must_stand_alone | SU-10 (save flow), SU-19 if prompt-based |
| SU-16 | Close/Cancel | Close with unsaved changes | Confirm dialog | Functional | P1 | ... | must_stand_alone | SU-24 if prompt editor open |
```

**Rule for Phase 4a writer:** When `Combination Dependencies` is non-empty, the writer must produce a separate combined-scenario in addition to each standalone scenario. The combined scenario is tagged `[COMBINATION]` and appears as a sub-scenario under the primary capability family.

**Prevents:** Root Cause C (structural fix) — combination blind spots are identified at the ledger level and enforced at the draft level.

---

### Enhancement Summary Table

| # | Enhancement | Phase | Type | Root Cause Addressed | Defects It Would Prevent |
|---|-------------|-------|------|---------------------|--------------------------|
| 1 | SDK contract scenario generator | Phase 4a | Contract addition | Root Cause D | BCIN-7674, BCIN-7719, BCIN-7733 + future SDK gaps |
| 2 | Analog Gate classification + validator | Phase 5b | Format + validator | Root Cause B | BCIN-7691, BCIN-7688, BCIN-7675 analog class |
| 3 | Developer Smoke Test output artifact | Phase 7 | New output artifact | Root Cause A | BCIN-7667, BCIN-7677, BCIN-7685, BCIN-7687, BCIN-7707, BCIN-7724 (7 defects) |
| 4 | Cross-section interaction audit | Phase 5a | Rubric section addition | Root Cause C (combinations) | BCIN-7730, BCIN-7708 + future intersection defects |
| 5 | Defect feedback loop / gap injection | New step | New workflow artifact | Root Cause C (all gaps) | Prevents gap recurrence across features |
| 6 | Combination dependencies column | Phase 3 | Coverage ledger schema | Root Cause C (structural) | Systematically surfaces combination scenarios |

### Priority Order for Implementation

1. **Enhancement 3 (Developer Smoke Test)** — highest ROI, addresses 7 defects, zero changes to plan content, new output only from an existing phase
2. **Enhancement 2 (Analog Gates)** — one rubric section + one validator, prevents the most predictable defect class every time an embedding feature ships
3. **Enhancement 1 (SDK Scenarios)** — Phase 4a contract change, catches a systematic blind spot in all integration-heavy features
4. **Enhancement 4 (Cross-Section Audit)** — Phase 5a rubric addition, catches combination scenarios at plan-creation time
5. **Enhancement 6 (Combination Dependencies Column)** — Phase 3 schema change, structural fix enabling Enhancement 4
6. **Enhancement 5 (Defect Feedback Loop)** — largest scope, highest long-term value, closes the learning loop permanently
