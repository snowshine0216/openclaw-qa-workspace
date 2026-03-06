# QA Plan Quality Gate — Design Document

**Feature**: Fix the `feature-qa-planning` pipeline so re-running it produces user-executable Test Key Points  
**Problem Reference**: `QA_PLAN_KEY_TEST_POINTS_GAP_ANALYSIS.md`  
**Date**: 2026-03-05  
**Status**: Design — No code changes yet

---

> [!IMPORTANT]
> This document is a **design-only** spec. No skill or workflow files are modified here.
> The goal: after implementing this design, re-running the `feature-qa-planning` workflow
> on any feature (including BCIN-6709 full regenerate) will produce a QA plan whose
> Test Key Points pass all 7 root-cause quality checks automatically (RC-1 through RC-7).

---

## 1. Problem Statement

The `feature-qa-planning` workflow produces QA plans whose **Test Key Points section is systematically flawed**. A human expert review of BCIN-6709 found 7 recurring root causes across 20+ rows (including upstream context failure):

| ID | Root Cause | Example of the Flaw |
|----|------------|---------------------|
| RC-1 | Engineer-level vocabulary in Test Key Points | `"Verify cancelRequests complete callback calls cmdMgr.reset()"` |
| RC-2 | Invisible verification steps (internal state / function calls) | `"cmdMgr.reset() NOT called (undo/redo preserved)"` |
| RC-3 | Missing user action sequence in Test Key Points | `"Resume for report exceeding max rows"` (label only, no executable steps) |
| RC-4 | Expected Results describe implementation, not UI outcomes | `"isModelingServiceManipulation=true → undo/redo cleared"` |
| RC-5 | Missing FAIL criteria / multi-path scenarios collapsed | OK path and Cancel path merged into one row |
| RC-6 | Missing test object setup instructions | Row references BCIN-6706 report with no access/location note |
| RC-7 | Empty GitHub diff (upstream context failure) | `context/github_*.diff` empty → qa-plan-github cannot produce meaningful Code Changes analysis; workflow proceeds anyway |

The automated review (`qa-plan-review` skill) **did not catch any of these** — it scored the flawed plan 9.5/10 and approved it for publication.

---

## 2. Root Cause in the Pipeline

```
Phase 1: Information gathering
  → gh pr diff, jira, confluence fetched
  → RC-7: No validation if github_diff.md or github_<repo>.diff is empty
  → Workflow proceeds even when diff(s) are 0 bytes; qa-plan-github has no code to analyze

Phase 2a: Context gathering
  → qa-plan-atlassian: extracts ACs ✅
  → qa-plan-github: extracts code-level facts (functions, flags, Java methods) ✅
  → Output uses engineering language; no Test Scope (COMP/XFUNC); no E2E Scenarios to Add

Phase 2b: Synthesis  ← RC-1 to RC-6 are INJECTED here
  → qa-plan-synthesize: maps ACs to Code Changes
    The GitHub context is written in engineering language.
    The skill has no rules to TRANSLATE code facts into observable user outcomes.
    Result: code facts flow straight into Expected Results column.

Phase 3: Review  ← RC-1 to RC-6 are NOT CAUGHT here
  → qa-plan-review: checks 6 criteria (structure, depth, coverage, risk, traceability, completeness)
    "Technical Depth" criterion *rewards* function names and flag references — exactly the RC-1/RC-2 anti-patterns.
    There is no "User Executability" criterion.
    Result: flawed plan is approved.
```

---

## 3. Design: What to Change

### 3.1 Target Files

| File | Change Type | Priority |
|------|-------------|----------|
| `skills/qa-plan-synthesize/SKILL.md` | Add quality rules + soft-warning self-healing + Step 3b translation pass + scope/E2E routing | P0 — root cause fix |
| `skills/qa-plan-review/SKILL.md` | Add new mandatory review axis | P0 — catching gate |
| `skills/qa-plan-github/SKILL.md` | Add Step 5b, Test Scope column, E2E Scenarios to Add, separate traceability file | P0 — source-side guard |
| `skills/feature-qa-planning-orchestrator/SKILL.md` | Phase 1 Step 1b (empty diff); synthesis enhancements; review/refactor wiring on FAIL | P0 — orchestrator guard |
| `skills/qa-plan-refactor/SKILL.md` | Add UE-1..UE-6 → refactor action mapping; wire into workflow | P0 — post-review fix |
| `AGENTS.md` | No change — already delegates to skill files | — |

---

### 3.2 Change 1 — `qa-plan-synthesize/SKILL.md`

**Location to insert**: after the existing `Step 3: Consolidate Information` table, before `Step 4: Generate Comprehensive Plan`.

**What to add**: A new section titled `## Test Key Points Quality Rules` containing:

#### 3.2.1 The 6 Anti-Pattern Guards

A mandatory rules block the agent must internalize before writing any Test Key Points row. Each rule pairs a **WRONG** pattern with the **RIGHT** pattern, using real BCIN-6709 examples.

```
Rule R1 — No internal function/flag names in Test Key Points or Expected Results
  WRONG: "Verify cancelRequests complete callback calls cmdMgr.reset()"
  RIGHT: "After clicking Resume a second time, the Undo/Redo toolbar buttons remain
          in the same enabled/disabled state as before the error"

Rule R2 — Every Expected Result must be manually observable (UI first, Network tab allowed)
  WRONG: "isModelingServiceManipulation=true → undo/redo history cleared"
  RIGHT: "Open Edit menu → Undo is greyed out (no undo history)"

Rule R2 definition:
  PASS if the sentence can be verified from browser UI, OR from the browser Network tab.
  FAIL if verification requires breakpoints, console.log injection, source code reading,
       or internal runtime state inspection.

Rule R3 — Every manual P0/P1 Test Key Point must contain a numbered user action sequence
  WRONG: "Resume for report exceeding max rows" (a label)
  RIGHT: "(1) Open a report whose row limit is exceeded. (2) Click 'Resume Data Retrieval'.
          (3) Click OK in the error dialog."
Rule R4 — Each distinct user path is a separate row
  WRONG: one row covering both OK and Cancel button paths
  RIGHT: Row 4.1a — click Cancel → returns to prompt with previous answers
         Row 4.1b — click OK → dismissed, returns to pause mode

Rule R5 — Every P0/P1 row has a FAIL criterion
  WRONG: Expected result with no failure signal
  RIGHT: Append "FAILS if: user is navigated to Library home page, OR error dialog
          does not appear, OR 'Resume Data Retrieval' button is permanently disabled"

Rule R6 — Unit/API-only tests go in an AUTO sub-section, not in manual key points
  WRONG: Row in manual table: "Pass NaN, negative ints, hex strings to toHex()"
  RIGHT: Moved to "### AUTO: Automation-Only Tests" with note "unit test — no browser observable"
```

#### 3.2.2 Pre-Save Self-Check Checklist (Soft Warning + Self-Healing)

Before writing the draft file, the agent must verify every row passes. **Behavior**: soft warning with **self-healing** — do not hard-abort. If violations are found, the agent must attempt to fix them automatically, then re-run the checklist until clean or max 2 iterations.

```
For each row in Test Key Points (manual sections only):
  [ ] Test Key Points column: zero occurrences of JS function names, Java method names,
      Redux flag names, or class names from the code diff
  [ ] Expected Results column: every sentence describes something visible in the
      browser UI or observable in the Network tab; no debugger/console/source-code checks
      (no "flag set", "returns {…}", "IS called")
  [ ] P0 or P1 manual row: contains at least one numbered step sequence
  [ ] If multiple user paths exist (e.g., OK vs Cancel): each path is a separate row
  [ ] P0 or P1 row: has a "FAILS if:" sentence in Expected Results
  [ ] If the row can ONLY be verified programmatically (unit test / curl): it is in
      the AUTO sub-section, not in a manual QA table
```

**Self-healing flow**:
1. Run checklist → if any row fails, annotate violations (e.g., `⚠️ R1: "cmdMgr.reset()" → replace with user-facing equivalent`).
2. Apply fixes using the Translation Guide (§3.2.4); split multi-path rows; add FAILS if; move unit-only rows to AUTO.
3. Re-run checklist. If still failing after 2 iterations, emit soft warning to user with remaining violations and proceed (review gate will catch them).

#### 3.2.3 AUTO Sub-Section Rule

Add explicit guidance that Section 6 (Edge Cases & Negative Tests) must include a final sub-section:

```
### AUTO: Automation-Only Tests
Rows that cannot be verified manually (function return values, internal flag states,
network-layer-only checks, race condition injection, SDK embedding setup) belong here.
They are NOT removed from the plan — they are relocated so manual QA engineers
know these require automation and do not attempt to run them manually.
```

#### 3.2.4 Where the Info Comes From (Translation Guide)

**Location**: Embedded directly in the synthesize skill. Use as **reference or examples** — the agent may extend it with inferred mappings during Step 3b; new mappings can be added to the skill over time.

Add a translation guide teaching the agent how to convert the GitHub context (written in engineering language) into user-facing language:

| GitHub Context Pattern | → User-Facing Translation |
|------------------------|--------------------------|
| `cmdMgr.reset()` is called | Undo button becomes disabled (greyed out) |
| `isReCreateReportInstance = true` | Second recovery also completes without hanging |
| `mstrApp.appState set to DEFAULT` | Grid shows no data rows; Run button visible; no spinner |
| `recoverReportFromError returns { handled: false }` | (AUTO test only — not user-visible) |
| `PUT /model/reports returns error` | Grid does NOT go blank; error toast or dialog appears; user can still manipulate the report |
| `stid=-1, noActionMode=true` | Report returns to pause mode (empty grid); user is NOT navigated away |

#### 3.2.5 Step 3b: Translation Pass (Before Writing Test Key Points)

**Location**: Between Step 3 (Consolidate) and Step 4 (Generate).

Before generating any Test Key Points row:

1. **Scan GitHub context** for: function names, method names, flag names, class names.
2. **For each occurrence** that would appear in Test Key Points or Expected Results:
   - Look up in Translation Guide (§3.2.4)
   - Replace with the user-facing equivalent
3. **If no translation exists**: Infer the observable outcome (what the user sees/does) and add to Translation Guide for future use. Do NOT copy the code term into the row.
4. **Related Code Change column**: Code references are ALLOWED here only. Never in Test Key Points or Expected Results.

#### 3.2.6 Scope and E2E Routing (from GitHub Summary)

1. **Step 2 (Read and Parse)**: Extract `Test Scope` (COMP/XFUNC) and `E2E Scenarios to Add` from GitHub summary.
2. **Step 3 (Consolidate)**: Add rule:
   - Rows from COMP-only changes that are not user-observable → place in `### AUTO: Automation-Only Tests`.
   - Rows from XFUNC changes → ensure Test Key Points have numbered user steps; Expected Results are browser-observable.
   - Merge rows from "E2E Scenarios to Add" into the appropriate functional category; do not drop them.
   - **Multi-repo aggregation**: When one PR is COMP and another is XFUNC for the same scenario, one scenario can aggregate both. Use dominant scope (XFUNC if any part is XFUNC).
3. **Terminology**: Use "single-component or internal logic" instead of "component-level"; "end-to-end user flow" instead of "xfunc"; "test point" or "verification step" instead of "checkpoint".

---

### 3.3 Change 2 — `qa-plan-github/SKILL.md`

**Location**: After Step 5 "Generate QA Domain Summary".

#### 3.3a Step 5b: User-Facing Scenario Output (for Manual QA)

For each scenario that will feed into manual Test Key Points, output TWO representations:

1. **Code Reference** (for traceability): `file.ts → functionName()` — keep as-is for Related Code Change column.
2. **User-Facing Scenario** (for Test Key Points / Expected Results): Describe in observable, executable terms.

| Code Fact | User-Facing Equivalent |
|-----------|------------------------|
| `cancelRequests()` called | Pending requests cleared; no hanging loading state |
| `cmdMgr.reset()` called | Undo button greyed out; no undo history |
| `isReCreateReportInstance = true` | Report returns to pause mode (empty grid); Run button visible |
| `recoverReportFromError returns { handled: false }` | (AUTO only — not user-visible) |

**Rule**: The "Test Scenarios by Component" and "E2E Scenarios" sections MUST use user-facing language. Code references go in a separate traceability file (see §3.3d), not in scenario text.

#### 3.3b Test Scope Column

Add a **Test Scope** column to Code Changes Analysis tables:

| Scope | Definition | Where It Goes in QA Plan |
|-------|-------------|--------------------------|
| **COMP** (Component) | Single file/component; no cross-layer flow; verifiable by unit or narrow integration test | Manual table if user-observable; else AUTO |
| **XFUNC** (Cross-Functional / E2E) | Spans UI + API + state; user flow; requires browser or full stack | Manual Test Key Points (user-facing steps) |

**Rule**: If a change affects a user-visible flow (button click → API → UI update), mark **XFUNC**. If internal (e.g., `toHex()` utility, flag lifecycle), mark **COMP** and note "AUTO if not user-observable".

**Test Key Points table**: Add a **Test Scope** column (COMP/XFUNC) for QA visibility. One scenario can aggregate both when multi-repo features have one PR as COMP and another as XFUNC for the same flow — use the dominant scope (XFUNC if any part is XFUNC).

#### 3.3c E2E Scenarios to Add Section

Add a new section to the output template:

```markdown
## 🔗 E2E Scenarios to Add (from Code Analysis)

Scenarios derived from code changes that may not be explicitly in Jira ACs. Synthesize MUST consider adding these.

| Scenario | Trigger (User Action) | Observable Outcome | Related Code |
|----------|------------------------|---------------------|--------------|
| Second error immediately after recovery | Trigger error → recover → trigger another error | Second recovery completes; no stuck state | isReCreateReportInstance flag lifecycle |
| Cancel during reprompt after recovery | Recover → run report → reprompt → Cancel | Returns to pre-reprompt state; data visible | saveCancelPromptStateId |
```

**Rule**: For each XFUNC change, ask "What user flow exercises this?" If the flow is not covered by existing ACs, add a row here. Use **user-facing language** only.

#### 3.3d Separate Traceability File (Code References)

Output a separate file so the main summary stays 100% user-facing:

- **File**: `context/qa_plan_github_traceability_<feature-id>.md`
- **Content**: Code Traceability table — file paths, function names, method names, line refs. Used by synthesize for the "Related Code Change" column only.
- **Main summary**: `context/qa_plan_github_<feature-id>.md` — 100% user-facing; no code vocabulary in scenario text.
- **Synthesis**: Reads both; uses traceability file for Related Code Change column; uses main summary for Test Key Points and Expected Results.

---

### 3.4 Change 3 — `qa-plan-review/SKILL.md`

**Location to insert**: after `Step 6: Edge Case & Risk Review` (currently Step 6), before `Step 7: Generate Review Report`.

**What to add**: A new mandatory step titled `Step 6b: User Executability Check`.

#### 3.4.1 New Review Axis: User Executability

This step is **blocking** — the review cannot proceed to "Approved" if any violation is found.

```
Step 6b: User Executability Check

Scan every row in every Test Key Points table. For each row, answer:

Check UE-1 — No internal code vocabulary:
  FAIL if Test Key Points or Expected Results contains any of:
  - JavaScript/TypeScript function or method names (e.g., cmdMgr.reset(), hideWait())
  - Java method names (e.g., reCreateInstance(), rebuildDocument())
  - Redux flag or variable names (e.g., isModelingServiceManipulation, applyReportPromptAnswersFailure)
  - Function return value syntax (e.g., "returns { handled: false }")
  - Internal class or component names used as verification targets (e.g., "ReCreateErrorCatcher not rendered")
  EXCEPTION: names are allowed in the "Related Code Change" column only.

Check UE-2 — Expected Results are browser-observable:
  FAIL if any Expected Results sentence cannot be confirmed from browser UI
  or the browser Network tab.
  FAIL if verification requires breakpoints, console.log injection, source-code reading,
  or internal runtime state inspection.

Check UE-3 — Action sequence present:
  FAIL if any P0 or P1 Test Key Point is a label (noun phrase with no verb steps)
  or has no numbered sequence or Given/When/Then format.

Check UE-4 — Multi-path rows are split:
  FAIL if a single row's Expected Results describes two distinct user paths separated
  by "OR" or shows two different button outcomes without separate rows.

Check UE-5 — FAIL criteria present:
  FAIL if any P0 or P1 Expected Results has no sentence starting with "FAILS if:"

Check UE-6 — Unit/API tests are segregated:
  FAIL if any row in a manual test table requires calling a function directly,
  crafting an HTTP request, or injecting a race condition to verify.
```

#### 3.4.2 Scoring Impact

Update the scoring rubric to include User Executability:

| Criterion | Weight | Previous | New |
|-----------|--------|----------|-----|
| Structural Integrity | 1x | ✅ present | ✅ unchanged |
| Technical Depth | 1x | ✅ present | ✅ unchanged |
| Edge Case Coverage | 1x | ✅ present | ✅ unchanged |
| Risk Authenticity | 1x | ✅ present | ✅ unchanged |
| Traceability | 1x | ✅ present | ✅ unchanged |
| Completeness | 1x | ✅ present | ✅ unchanged |
| **User Executability** | **1x** | ❌ missing | ✅ **add** |

Any UE-1 through UE-6 violation must be listed as a **P0 gap** (blocks approval).

#### 3.4.3 Review Report Template Update

Add a new section to the review report output template:

```markdown
## 🔍 User Executability Check

| Check | Status | Failing Rows |
|-------|--------|--------------|
| UE-1: No internal code vocabulary | ✅ / ❌ | e.g., 1.5, 2.1, 2.3 |
| UE-2: Expected Results browser-observable | ✅ / ❌ | ... |
| UE-3: Action sequence present | ✅ / ❌ | ... |
| UE-4: Multi-path rows split | ✅ / ❌ | ... |
| UE-5: FAIL criteria on P0/P1 rows | ✅ / ❌ | ... |
| UE-6: Unit/API tests in AUTO section | ✅ / ❌ | ... |

**Verdict**: ✅ PASS — ready for publication  
            ❌ FAIL — return to synthesize with failing rows listed
```

---

### 3.5 Change 4 — `feature-qa-planning.md`

#### 3.5.1 Phase 1 Step 1b: GitHub Diff Validation (Empty Diff Guard)

**Placement**: After Phase 1 Step 1 (Parallel CLI Execution), before Step 2 (Figma Context).

**Rule**: GitHub diff is **required** when a GitHub PR URL is provided. If the diff is empty, the workflow must **STOP and notify the user** — do not proceed to Phase 2a or Phase 2b.

```
1b. GitHub Diff Validation (if GitHub PR URL was provided):
   - Build expected repo list from all provided PR URLs.
     Parse each URL as .../<owner>/<repo>/pull/<id> and extract <repo>.
   - Filename contract (deterministic): expected diff path per PR is
     context/github_<repo>.diff (repo is the URL repo segment, lowercased).
   - Single-PR compatibility: context/github_diff.md is allowed as a legacy alias.
     If alias exists, map it to that PR's repo and still treat it as that repo's required diff.
   - Validate each expected repo diff file:
       missing OR 0 bytes => FAIL for that repo
   - If any expected repo fails => STOP. Notify user:
     "GitHub diff(s) empty or missing for: [repo list]. The PR may be inaccessible, the URL
      may be wrong, or repo auth may be insufficient. Please verify PR URLs/access and retry.
      Cannot proceed without code changes."
   - Guard against silent partial execution:
     number of non-empty expected diffs MUST equal number of provided PR URLs.
   - Do NOT spawn qa-plan-github or proceed to Phase 2b until diff(s) are non-empty.
```

**When to skip**: If the user did not provide a GitHub PR URL, skip this check (GitHub is optional).

**Multi-repo example**: For BCIN-6709 URLs ending with `/biweb/pull/...`, `/mojojs/pull/...`, `/react-report-editor/pull/...`, `/web-dossier/pull/...`, expected files are `github_biweb.diff`, `github_mojojs.diff`, `github_react-report-editor.diff`, `github_web-dossier.diff`. **ALL required** — if any expected diff is empty/missing when PRs were provided, STOP. Do not proceed.

#### 3.5.2 Phase 2b Step 4: Synthesis Intent (Enhanced)

**Location**: Phase 2b Step 4 "Direct the skill to synthesize...".

**Current text** (line 77):
> Map Jira ACs to GitHub Code Changes to build the final `Test Key Points` table.

**What to change**: Expand Phase 2b Step 4 to:

> Map Jira ACs to GitHub Code Changes to build the final `Test Key Points` table. Use GitHub's **Test Scope** (COMP/XFUNC) to route: XFUNC → manual user-facing rows; COMP + not user-observable → AUTO section. Incorporate GitHub's **E2E Scenarios to Add** into the plan. Write Test Key Points and Expected Results in **user-facing language only** (no function names, flags, or internal state).

**Phase 2b Step 2 (Strategy Display)** — expand to:
1. Explicitly name the 6 quality rules the agent is committing to follow
2. Require the agent to state it will apply the quality rules before the user approves synthesis

```
Before synthesis, the agent must declare:
   "I will write Test Key Points following these rules:
   - R1: No JS/Java function or flag names in Test Key Points or Expected Results
   - R2: Every Expected Result must be verifiable from browser UI or Network tab, without debugger/console injection
   - R3: Every P0/P1 row has numbered steps 
   - R4: Each distinct user path (e.g., OK vs Cancel) is a separate row
   - R5: Every P0/P1 row has a FAILS if: sentence
   - R6: Unit/API-only rows go in an AUTO sub-section
   I will apply these rules during synthesis. Proceed?"
User must approve before Phase 2b synthesis executes.
```

#### 3.5.3 Phase 1 Hardening Addendum: PR URL Normalization + Diff Retry

**Context (post-design review updates)**: Multi-PR orchestration exposed two additional reliability gaps:
1. brittle PR URL parsing (`awk` offsets only),
2. non-retried `gh pr diff` fetch causing flaky empty-diff failures.

These requirements are appended to the original workflow design and are **mandatory**.

**A) Canonical PR URL Normalization / Validation**

Before extracting owner/repo/pull-number from each GitHub URL:

1. Normalize input URL:
   - trim whitespace
   - remove query and fragment (`?`, `#`)
   - remove trailing slash(es)
2. Validate canonical pattern:
   - must match `https://github.com/<owner>/<repo>/pull/<id>`
   - allow tab suffixes after pull id (e.g. `/files`, `/commits`) by parsing `<owner>/<repo>/pull/<id>` prefix only
3. If parsing fails, STOP with actionable error:
   - `"Invalid GitHub PR URL format: <url>. Expected https://github.com/<owner>/<repo>/pull/<id>. Please correct and retry."`
4. Derive per-PR filenames from normalized `<owner>_<repo>_pr<id>` (lowercased owner/repo) to avoid collisions.

**B) Retry Diff Fetches**

Per-PR diff fetch must use the same retry helper as other network calls:

```bash
../scripts/retry.sh 3 2 gh pr diff "$PR_URL" > "$DIFF_FILE"
```

Do **not** call raw `gh pr diff` directly in the workflow fetch phase.
This ensures transient network/API failures do not create false empty-diff blockers.

**C) Deterministic Synchronization Rule**

Phase 1 must always `wait` for background fetch jobs (Jira/Confluence and optional GitHub jobs) before moving to Phase 2.
This prevents partial context reads in no-GitHub paths.

---

### 3.6 Change 5 — Wire `qa-plan-refactor` as Post-Review Fix Step

**Decision**: Re-use the existing `qa-plan-refactor` skill. Wire it into the workflow as a post-review fix step when review returns FAIL.

#### 3.6.1 Workflow Integration

**Location**: `feature-qa-planning.md` — Phase 3 (Review/Refactor).

**Current flow**: Review → if FAIL → manual refactor loop (user edits, re-run review).

**New flow**:
```
Phase 3: Review
  → qa-plan-review runs
  → If PASS → proceed to Phase 4 (Publication)
  → If FAIL → invoke qa-plan-refactor with:
      - Input: draft QA plan path
      - Input: review report (failing rows, UE-1..UE-6 violations)
      - qa-plan-refactor addresses action items from the report
  → Re-run qa-plan-review on refactored draft
  → If PASS → proceed to Phase 4
  → If FAIL again → present to user (max 2 refactor rounds)
```

#### 3.6.2 qa-plan-refactor Skill Update

Ensure `qa-plan-refactor/SKILL.md` can:
- Accept review report as input (failing rows, UE check IDs)
- Map UE violations to refactor actions (e.g., UE-1 → apply translation guide; UE-4 → split row)
- Output updated draft for re-review

**No structural change to the skill** — the skill already supports systematic refactor from review feedback. Add explicit mapping: UE-1..UE-6 → refactor action types.

---

## 4. What Is NOT Changing

| Item | Reason |
|------|--------|
| `AGENTS.md` | Already routes correctly to the workflow. The quality rules belong in the skill files, not in the agent config. |
| `qa-plan-atlassian/SKILL.md` | Jira/Confluence extraction is correct. The problem is how synthesis uses the output. |
| Background, QA Goals, Risk & Mitigation sections of the plan template | These sections are not flawed. Test Key Points is the only broken section. |
| Test priority assignments (P0/P1/P2) | Not flagged in gap analysis. |

---

## 5. Verification Plan

After implementing the changes, re-run the workflow on BCIN-6709 with option `(C) Full Regenerate` and verify:

### 5.1 Synthesize Self-Check (Phase 2b)
- [ ] The agent's strategy declaration mentions all 6 rules explicitly
- [ ] The generated draft has zero occurrences of: `cmdMgr`, `isReCreateReportInstance`, `isModelingServiceManipulation`, `recoverReportFromError`, `applyReportPromptAnswersFailure`, `{ handled:` in Test Key Points and Expected Results columns
- [ ] Rows 4.1 and 4.2 are each split into two sub-rows (OK path + Cancel path)
- [ ] Rows 3.2, 5.2, 5.5, 5.7, 6.6, 6.12, 6.13 appear under `### AUTO: Automation-Only Tests`
- [ ] Every P0/P1 row has a `FAILS if:` sentence in Expected Results
- [ ] Rows referencing BCIN-6706, BCIN-974, BCIN-6485, BCEN-4129 have `⚙️ Setup:` prefix

### 5.2 Review Gate (Phase 3)
- [ ] The review report includes a `## 🔍 User Executability Check` section
- [ ] If any of the above synthesis checks fail, the review returns ❌ FAIL and lists the specific rows
- [ ] Review does NOT approve publication until all 6 UE checks pass

### 5.3 Regression Check
- [ ] Other sections of the generated plan (Background, QA Goals, Risk) are unchanged in quality
- [ ] The plan's technical depth (code file references in "Related Code Change" column) is preserved
- [ ] Total row count is >= the original (splitting rows adds rows, not removes them)

### 5.4 GitHub and Workflow Guards
- [ ] **Empty diff guard**: When GitHub PR URL provided, workflow derives expected repos from PR URLs and validates `context/github_<repo>.diff` (with `github_diff.md` single-PR alias); if **any expected diff** empty/missing → STOP, notify user, do not proceed to Phase 2a/2b
- [ ] PR URL normalization/validation accepts common URL variants (`/pull/<id>/`, `/pull/<id>/files`) and still extracts canonical `<owner>/<repo>/<id>` correctly; invalid URLs fail fast with clear message
- [ ] Diff fetch uses retry wrapper (`../scripts/retry.sh 3 2 gh pr diff ...`), not raw `gh pr diff`
- [ ] Phase 1 synchronization always waits for in-flight fetch jobs even when GitHub PR URLs are not provided
- [ ] qa-plan-github outputs `context/qa_plan_github_traceability_<id>.md`; main summary 100% user-facing
- [ ] qa-plan-github output has Test Scope column and E2E Scenarios to Add section
- [ ] Synthesize Step 3b runs before writing; no function names in Test Key Points or Expected Results
- [ ] COMP + not user-observable → AUTO; XFUNC → manual with user steps
- [ ] E2E Scenarios to Add rows appear in final plan
- [ ] Test Key Points table includes Test Scope column (COMP/XFUNC)

### 5.5 Self-Healing and Refactor Loop
- [ ] Synthesize self-check: on violation, agent attempts fix (max 2 iterations); soft warning if still failing
- [ ] On review FAIL: qa-plan-refactor invoked with draft + report; refactored draft re-reviewed (max 2 rounds)

---

## 6. File Change Summary

```
workspace-planner/
  skills/
    qa-plan-synthesize/
      SKILL.md          ← ADD: §"Test Key Points Quality Rules" (rules R1-R6, soft-warning
                                 self-healing, AUTO section rule, translation guide embedded)
                          ADD: Step 3b "Translation Pass" (before writing)
                          ADD: Scope/E2E routing (consume COMP/XFUNC, E2E Scenarios to Add)
                          ADD: Test Scope column (COMP/XFUNC) to Test Key Points table
    qa-plan-github/
      SKILL.md          ← ADD: Step 5b "User-Facing Scenario Output"
                          ADD: Test Scope column (COMP/XFUNC) to Code Changes tables
                          ADD: "E2E Scenarios to Add" section in output template
                          ADD: Output context/qa_plan_github_traceability_<id>.md (code refs)
    qa-plan-review/
      SKILL.md          ← ADD: Step 6b "User Executability Check"
                                 (checks UE-1 to UE-6, scoring weight, report template)
    qa-plan-refactor/
      SKILL.md          ← ADD: UE-1..UE-6 → refactor action mapping
  .agents/
    workflows/
      feature-qa-planning.md  ← ADD: Phase 1 Step 1b "GitHub Diff Validation"
                                          (ALL required; if any empty, STOP)
                               ADD: Phase 1 URL normalization/validation before owner/repo/id parse
                               ADD: Phase 1 diff fetch retry wrapper for `gh pr diff`
                               ADD: unconditional Phase 1 job synchronization (`wait`) before Phase 2
                               MODIFY: Phase 2b Step 4 (scope routing, E2E incorporation)
                               MODIFY: Phase 2b Step 2 (strategy declaration, 6 rules)
                               ADD: Phase 3 — on review FAIL → invoke qa-plan-refactor
                                    (max 2 rounds); re-run review
  AGENTS.md             ← NO CHANGE
```

---

## 7. Terminology Simplification

| Current (Confusing) | Replace With |
|--------------------|--------------|
| checkpoint | test point, verification step |
| component-level | single-component / internal (for AUTO) |
| xfunc | end-to-end (E2E) user flow |
| Related Code Change | Keep — traceability column; code refs allowed here only |
| cmdMgr.reset(), isReCreateReportInstance | Undo button greyed out; report returns to pause mode |

---

## 8. Resolved Open Questions

| # | Question | Decision |
|---|----------|----------|
| Q1 | Synthesize self-check: hard abort vs soft warning? | **Soft warning + self-healing**. Agent annotates violations, attempts to fix automatically (Translation Guide, split rows, add FAILS if, move to AUTO). Max 2 iterations; if still failing, emit warning and proceed (review gate will catch). |
| Q2 | Wire `qa-plan-refactor` as post-review fix step? | **Yes.** Re-use qa-plan-refactor skill. On review FAIL → invoke with draft + review report → refactor → re-run review. Max 2 refactor rounds. |
| Q3 | Translation guide: shared file vs embedded in skill? | **Embed directly** in synthesize skill. Use as reference or examples; agent may extend with inferred mappings during Step 3b. |
| Q4 | Separate traceability file for code refs? | **Yes.** qa-plan-github outputs `context/qa_plan_github_traceability_<id>.md`; main summary stays 100% user-facing. Synthesize reads both. |
| Q5 | COMP/XFUNC as third column in Test Key Points table? | **Yes.** Add Test Scope column for QA visibility. |
| Q6 | Multi-repo: one PR COMP, another XFUNC for same scenario? | **One scenario can aggregate both.** Use dominant scope (XFUNC if any part is XFUNC). |
| Q7 | Multi-repo empty diff: STOP all or allow partial? | **ALL required; if any empty, STOP.** Do not proceed when any expected diff is empty. |
