# QA Summary Skill Enhancement Plan
## Fix: Background & Solution Section + Draft-First Pending Sections

**Date:** 2026-03-17  
**Author:** Atlas Reporter  
**Status:** Draft — For Review  
**Scope:** `workspace-reporter/skills/qa-summary` and `workspace-reporter/skills/qa-summary-review`

---

## 1. Problem Statement

Two gaps were identified in the current QA Summary output:

### Problem 1 — Missing Background & Solution Section

The current QA Summary contains no section that communicates **what the feature is, why it was built, and how it was implemented**. This context is critical for reviewers and stakeholders reading the summary in isolation (e.g. on Confluence without access to the full QA plan).

The planner artifact (`qa_plan_final.md` and `confluence_design_<KEY>.md`) contains rich background and solution context, but Phase 3 does not extract or surface it. As a result, the summary jumps directly from "Feature Overview" metadata into "Code Changes Summary" with no narrative bridge.

**Observed impact (BCIN-150):**  
The Confluence design doc (`confluence_design_BCIN-150.md`) contains a clear Introduction ("As customers migrate from Web to Library, Cloud Report users cannot edit report in Library") and a complete design table of privilege changes by release. None of this appeared in the generated summary.

### Problem 2 — Placeholder-Only Pending Sections

Sections 7 (Performance), 8 (Security / Compliance), 9 (Regression Testing), and 10 (Automation Coverage) currently emit a bare `[PENDING — No data available.]` when execution data is missing. This gives reviewers nothing to react to — they must wait until after testing to populate these fields.

The correct behaviour is **draft-first**: generate a planner-informed draft (expected outcomes, known risks, planned coverage areas) that the user can review, correct, or promote. If a section is genuinely inapplicable (e.g. no performance requirements exist), it should state a concise justification rather than an opaque `[PENDING]`.

---

## 2. Proposed Changes

### 2.1 New Section: "2. Background & Solution" (inserted between Feature Overview and Code Changes Summary)

#### 2.1.1 Content

The new section must contain:

| Sub-item | Source |
|---|---|
| **Feature Background** | Introduction / purpose extracted from `confluence_design_<KEY>.md` or planner `deep_research_synthesis_<KEY>.md` |
| **Problem Statement** | The customer pain point or gap (e.g. "Cloud Reporter users could not edit reports in Library while BI Web allowed this") |
| **Solution Summary** | High-level description of the design change (e.g. "Privilege checks for edit mode were removed in Library Web and Workstation for 26.04") |
| **Scope / Exclusions** | What was explicitly excluded from the change (e.g. "BI Web privilege behaviour unchanged; Create Report flow unchanged") |

#### 2.1.2 Format

```markdown
### 2. Background & Solution

**Background:** <one or two sentences from Introduction section of design doc or deep research synthesis>

**Problem:** <customer pain point>

**Solution:** <what changed and how>

**Out of Scope:** <explicit exclusions from design doc or QA plan "Out of Scope" section>
```

This section uses **prose bullets** (no table required). It must be present in every summary. If planner artifacts contain no narrative context, use: `[PENDING — No background or solution context found in planner artifacts. Please provide manually.]`

#### 2.1.3 Section Re-numbering Impact

Inserting Section 2 shifts all existing sections:

| Old | New | Title |
|---|---|---|
| 1 | 1 | Feature Overview |
| — | **2** | **Background & Solution** *(new)* |
| 2 | 3 | Code Changes Summary |
| 3 | 4 | Overall QA Status |
| 4 | 5 | Defect Status Summary |
| 5 | 6 | Resolved Defects Detail |
| 6 | 7 | Test Coverage |
| 7 | 8 | Performance |
| 8 | 9 | Security / Compliance |
| 9 | 10 | Regression Testing |
| 10 | 11 | Automation Coverage |

All formatting contracts, review checks (F2, F3), and script section references must be updated to reflect 11 sections.

---

### 2.2 Draft-First Pending Sections

#### Principle

When execution data is missing, sections must emit a **planner-informed draft** rather than a bare `[PENDING]`. The draft serves as a pre-filled checklist that the human reviewer can promote to final during or after testing. If a section is not applicable, it must provide a **one-sentence concise justification** (not a generic placeholder).

#### Section-Specific Rules

##### Section 8 — Performance (formerly 7)

**Draft mode (no execution data):**

Generate a table of expected performance characteristics drawn from the QA plan or design doc. If the QA plan has no performance scenarios, check the "Out of Scope / Assumptions" section for a performance exclusion.

```markdown
### 8. Performance

> ⚠️ Draft — No execution data yet. Review expected targets below.

| Scenario | Expected Behaviour | Threshold | Evidence Source |
|---|---|---|---|
| Edit mode open latency | Report opens in edit mode without noticeable lag | < 3 s (informal) | QA plan assumption |
| Save to My Reports | Save completes without timeout | Standard server timeout | QA plan assumption |

```

If QA plan explicitly marks performance as out of scope:

```markdown
### 8. Performance

- Not applicable: No performance requirements are defined for this feature. The change removes privilege checks on the client and Modeling Service; no new network calls or data processing paths are introduced.
```

##### Section 9 — Security / Compliance (formerly 8)

**Draft mode:** Extract planned security checks from QA plan (e.g. privilege boundary tests, role boundary tests).

```markdown
### 9. Security / Compliance

> ⚠️ Draft — Planned coverage, not yet executed.

- Privilege boundary: Verify that removing edit-mode privileges does not expose object creation to Cloud Reporter users (QA plan — Security section).
- Role boundary: Verify that users without Library Web access role cannot see the Edit entry (QA plan — Security section).
```

If no security scenarios exist in the QA plan and the feature is purely UI/workflow: `- Not applicable: Feature involves UI privilege removal only; no authentication, data access, or compliance scope identified in design.`

##### Section 10 — Regression Testing (formerly 9)

**Draft mode:** List regression scenarios from the QA plan "Regression / Known Risks" section.

```markdown
### 10. Regression Testing

> ⚠️ Draft — Planned regression scenarios, not yet executed.

- Create Report workflow still requires privileges (edit-only change, create unaffected) — P1
- BI Web privilege enforcement unchanged after 26.04 upgrade — P1
- Save to Public Objects blocked for users without object-creation privileges — P1
```

If no regression section exists in the QA plan: `- [PENDING — No regression scenarios identified in QA plan. Please provide regression test results or confirm no regression testing was planned.]`

##### Section 11 — Automation Coverage (formerly 10)

**Draft mode:** Extract automation-relevant scenarios from the QA plan (EndToEnd / P1 scenarios) and generate a planned coverage table.

```markdown
### 11. Automation Coverage

> ⚠️ Draft — Planned automation targets, not yet confirmed.

| Scenario | Priority | Automation Candidate | Notes |
|---|---|---|---|
| Cloud Reporter completes full edit workflow in Workstation | P1 | Yes — E2E | Primary regression guard |
| Edit entry visible in Library Web toolbar | P1 | Yes — E2E | Entry-point smoke |
| Save to My Reports without privileges | P1 | Yes — E2E | Core save path |
| Save to Public Objects blocked | P1 | Yes — negative test | Regression guard |
```

If no scenarios qualify: `- Not applicable: No automation scenarios identified in QA plan. Manual-only coverage confirmed.`

---

## 3. Implementation Plan

### 3.1 Files to Modify

| File | Change |
|---|---|
| `skills/qa-summary/references/summary-formatting.md` | Add Section 2 ("Background & Solution") spec; renumber sections 2–10 → 3–11; add draft-first rules for sections 8–11; update placeholder policy |
| `skills/qa-summary/references/planner-and-defects.md` | Add "Background & Solution Extraction" sub-section documenting source priority (`confluence_design_<KEY>.md` → `deep_research_synthesis_<KEY>.md` → `qa_plan_final.md` intro) |
| `skills/qa-summary/SKILL.md` | Update phase descriptions and section counts (10 → 11); add background extraction to Phase 1 output contract; add draft-first generation rules to Phase 3 |
| `skills/qa-summary/scripts/lib/buildSummaryDraft.mjs` | Add background/solution section builder; update section numbering; implement draft-first generation for sections 8–11 |
| `skills/qa-summary/scripts/lib/buildFeatureOverviewTable.mjs` | No change required |
| `skills/qa-summary/scripts/lib/phase1.mjs` | Extract background/solution seed from planner artifacts into `context/background_solution_seed.md` |
| `skills/qa-summary/scripts/lib/phase3.mjs` | Read `context/background_solution_seed.md` and inject into Section 2 of draft |
| `skills/qa-summary-review/SKILL.md` | Add C6 (Background & Solution section present); update F2 to check 1–11 numbering; add F3 rules for Section 2 (prose only); add draft-first warning check for sections 8–11 |

### 3.2 New Artifacts

| Artifact | Description |
|---|---|
| `context/background_solution_seed.md` | Extracted background, problem, solution, and scope text from planner artifacts, ready for Phase 3 injection |

### 3.3 Phase Impact Summary

| Phase | Impact |
|---|---|
| Phase 1 | Add step: extract background/solution seed from planner design artifacts into `context/background_solution_seed.md` |
| Phase 3 | Add step: inject Section 2 from seed; implement draft-first generation for sections 8–11 using QA plan scenario data |
| Phase 4 / qa-summary-review | Add C6 coverage check; update F2/F3 for 11 sections; add draft-mode surface warnings |

---

## 4. Review Skill Changes (qa-summary-review)

### New Check: C6 — Background & Solution Section Present

- **Pass:** Section 2 "Background & Solution" is present and contains at least one non-placeholder bullet.
- **Fail:** Section missing or entirely `[PENDING]`. Auto-fix: insert a `[PENDING — Background and solution context not found in planner artifacts. Please provide manually.]` placeholder and log.

### Updated Check: F2 — Subsection Numbering

Updated to validate sequential numbering 1–11 (was 1–10).

### Updated Check: F3 — Table Usage Compliance

| Section | Required format |
|---|---|
| 1 | Table |
| 2 | Prose bullets (no table) |
| 3 | Table |
| 4 | Bullets |
| 5 | Table |
| 6 | Table |
| 7 | Bullets |
| 8 | Bullets or Table (draft mode) |
| 9 | Bullets |
| 10 | Bullets |
| 11 | Bullets or Table (draft mode) |

### New Check: C7 — Draft-Mode Sections Labeled

When a section contains a draft (generated from planner context, not execution data), it must include the `> ⚠️ Draft — …` blockquote label. The reviewer warns (does not auto-fix) if the label is missing.

---

## 5. Acceptance Criteria

1. **Section 2 present in all new summaries.** When planner design doc is available, background/solution text is extracted and rendered. When not available, a specific `[PENDING]` message is used.
2. **No bare `[PENDING — No data available.]` in sections 8–11.** Either a planner-informed draft is rendered, or a concise not-applicable justification is provided.
3. **Draft sections are clearly labeled** with `⚠️ Draft —` so reviewers know data is pre-execution.
4. **Section count updates to 11** throughout all skill contracts, review checks, and formatting references.
5. **qa-summary-review passes** on a summary containing the new Section 2 and draft-mode sections 8–11.

---

## 6. Out of Scope

- Changes to the defects-analysis skill
- Changes to the QA plan orchestrator (planner side)
- Confluence publish logic (Phase 5/6 unchanged)
- Feishu notification format

---

_End of fix plan._
