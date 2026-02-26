# Defect Analysis & QA Summary Workflow Enhancement Plan

This document outlines the required updates to [.agents/workflows/defect-analysis.md](file:///Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-reporter/.agents/workflows/defect-analysis.md) and [.agents/workflows/qa-summary.md](file:///Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-reporter/.agents/workflows/qa-summary.md) based on four confirmed problems.

---

## 1. Release Fetching: Default to `currentUser()` Filter

**Problem:** When asked to create a QA Summary for all features in a release (e.g., 26.03), the agent fetches ALL features regardless of QA Owner. It should default to only the current user's features.

**Root Cause:**
- `defect-analysis.md` Phase 0a has `currentUser()` in the JQL, but this may be bypassed or ignored when `qa-summary` spawns `defect-analysis` as a sub-agent without passing the correct scope.
- `qa-summary.md` has no equivalent scope-selection step of its own.

**Required Changes:**

### `defect-analysis.md` Phase 0a
- Replace the hardcoded `currentUser()` with an **explicit scope-selection prompt at the start of Phase 0a**:
  > *"This is a release-level run. Fetch features for: (A) Only my features — `"QA Owner" = currentUser()` [DEFAULT] or (B) ALL features in this release — omit QA Owner filter?"*
- The default (no input, or pressing Enter) MUST apply `currentUser()`.
- Only omit `QA Owner` filter if the user explicitly chooses option B or says "all features".
- Document this default prominently so it is never silently bypassed.

### `qa-summary.md` Phase 0 / Phase 1
- When `qa-summary` is invoked for a release version (not a single feature key), it MUST present the same scope-selection step before spawning the `defect-analysis` sub-agent.
- Pass the resolved scope (currentUser or ALL) as an explicit input to the sub-agent.
- This prevents `qa-summary` from silently delegating without scoping.

---

## 2. Cross-Project Fetching: Mandatory for Both Features and Linked Issues

**Problem:** `jira issue list` without an explicit project scope defaults to the configured default project. This causes both feature search (Phase 0a) and defect/linked-issue search (Phase 1) to miss cross-project items.

**Root Cause:** The current Phase 0a JQL does not include cross-project scope. Phase 1 has cross-project JQL via Phase 0b cache, but Phase 0a does not. The `jira-cli` SKILL.md note says `linkedIssues()` fails across projects — this applies equally to feature-type searches.

**Required Changes:**

### `defect-analysis.md` Phase 0b — KEEP AND ENFORCE
- **Do NOT remove `project_keys.txt` caching.** Phase 0b is the correct mechanism for cross-project fetching.
- Phase 0b MUST run before Phase 0a (release feature search) AND Phase 1 (defect/linked issue search).
- Reorder if needed so Phase 0b runs first, even in release-discovery mode.

### `defect-analysis.md` Phase 0a — Add Cross-Project Scope
- Feature search must also use the project keys from Phase 0b cache:
  ```bash
  # Ensure project keys are properly quoted for Jira JQL
  PROJECT_KEYS=$(cat projects/defects-analysis/.cache/project_keys.txt | awk '{printf "\"%s\",", $0}' | sed 's/,$//')

  scripts/retry.sh 3 2 jira issue list \
    --jql "project in ($PROJECT_KEYS) AND \"QA Owner[User Picker (single user)]\" = currentUser() AND \"Release[Version Picker (single version)]\" = <VERSION> AND type = Feature" \
    --format json --paginate 50 \
    > projects/defects-analysis/release_<VERSION>/context/features_raw.json
  ```
- Without `project in (...)`, `jira issue list` defaults to the single project set in `jira init` and silently misses features in other projects.

### `defect-analysis.md` Phase 1 — Cross-Project Already Implemented, Must Verify
- Phase 1 already uses cross-project JQL. Verify it correctly references the Phase 0b cache and is not bypassed in any resume/refresh paths.
- Add a guard: if `project_keys.txt` is empty or missing, halt and re-run Phase 0b before continuing.

### Skill Reference
- Both Phase 0a and Phase 1 must reference `skills/jira-cli/references/issue-search.md` for the cross-project JQL pattern — not just Phase 1.

---

## 3. QA Summary MUST Be Based on Defect Analysis — No Skip Allowed

**Problem:** `qa-summary.md` Phase 1 has `*(Skip if "Use Existing" or "Resume" was selected)*`. This allows qa-summary to generate content without a valid, up-to-date `_REPORT_FINAL.md` from defect-analysis.

**Root Cause:** The "Use Existing" and "Resume" options in Phase 0 refer to the QA summary artifacts, but they were incorrectly being used to skip the defect-analysis dependency check entirely.

**Required Changes:**

### `qa-summary.md` Phase 0 — Add Final Report Prerequisite Check
Before Phase 0b workspace classification, add an explicit check:
1. Check whether `projects/defects-analysis/<KEY>/<KEY>_REPORT_FINAL.md` exists.
2. If it does NOT exist: inform the user and **require defect-analysis to run first**. Do not offer any path that skips this.
3. If it exists: check its age (from `task.json` → `report_approved_at`). If `report_approved_at` is missing/null, halt and inform the user: *"The defect analysis is awaiting human approval. Please approve it first."* If it exists but is stale (>7 days or user's threshold), recommend a refresh.
4. The "Use Existing" and "Resume" options ONLY apply to the QA summary's own draft/final artifacts (`_QA_SUMMARY_DRAFT.md` / `_QA_SUMMARY_FINAL.md`) — they NEVER skip the defect-analysis final report check.

### `qa-summary.md` Phase 1 — Remove Skip Condition
- Remove the line `*(Skip if "Use Existing" or "Resume" was selected)*` entirely.
- Replace with: the sub-agent spawn is skipped only when `_REPORT_FINAL.md` already exists AND is confirmed fresh by the user in Phase 0. The spawn must still verify the report exists before proceeding.
- Phase 2 (Summary Generation) MUST read exclusively from `<KEY>_REPORT_FINAL.md`. Never read from `_REPORT_DRAFT.md`.

---

## 4. Pipeline: Self-Review Promotes Draft to Final Report

**Problem:** `_REPORT_FINAL.md` is only created in Phase 6 (after user approval and Confluence publish). This means `qa-summary` cannot safely depend on `_REPORT_FINAL.md` existing unless the full defect-analysis pipeline has been run to completion including publishing.

**Root Cause:** The final report promotion is gated behind publishing, but the QA summary should be buildable as soon as the AI quality gate (self-review) passes — not just after Confluence publish.

**Required Changes:**

### `defect-analysis.md` Phase 4a — Promote to Final on Review Pass
After `report-quality-reviewer` skill passes (auto-fixes applied):
1. Archive any existing `_REPORT_FINAL.md`:
   ```bash
   scripts/archive_report.sh <FEATURE_KEY> FINAL || true
   ```
2. Promote the reviewed draft to final:
   ```bash
   cp projects/defects-analysis/<FEATURE_KEY>/<FEATURE_KEY>_REPORT_DRAFT.md \
      projects/defects-analysis/<FEATURE_KEY>/<FEATURE_KEY>_REPORT_FINAL.md
   ```
3. Update `task.json` → `current_phase: approval`, `report_final_at: <ISO timestamp>` (new field).
4. This makes `_REPORT_FINAL.md` mean "AI-reviewed and ready for human gate" — not "published".

### `defect-analysis.md` Phase 5 — User Reviews Final, Not Draft
- Update the approval message to present `_REPORT_FINAL.md`:
  > `"✅ Final report (AI-reviewed) is ready at: …<FEATURE_KEY>_REPORT_FINAL.md"`
  > `"🔍 Self-review summary is at: …<FEATURE_KEY>_REVIEW_SUMMARY.md"`
  > `"Please review and reply: APPROVE to publish, or REJECT to send via Feishu."`
- Make clear to the user that this is the AI-reviewed version, not the raw draft.

### `defect-analysis.md` Phase 6 — Publish Existing Final, No Re-Copy
- Phase 6 publishes the already-existing `_REPORT_FINAL.md` directly. Remove the `cp draft → final` step from Phase 6.
- The `archive + cp` must only happen in Phase 4a (on self-review pass). Phase 6 should never create `_REPORT_FINAL.md` — it only reads it.
- Update `task.json` → `report_approved_at: <ISO timestamp>` (user approval timestamp, separate from `report_final_at`).

### `qa-summary.md` Phase 1/2 — Read from `_REPORT_FINAL.md`
- Phase 2 must explicitly state: input is `<KEY>_REPORT_FINAL.md` (the AI-reviewed final). Never `_REPORT_DRAFT.md`.
- Phase 3 (self-review) must cross-check defect counts against `_REPORT_FINAL.md`, not the raw Jira cache.

---

## 5. MEMORY.md — Additions and Corrections

Review [MEMORY.md](file:///Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-reporter/MEMORY.md) for the following updates:

### Add: Confluence Surgical Update Safety Rules
Add a `## Confluence Safety Rules` section:
- Never overwrite content outside the `QA Summary` section.
- Never delete an existing subsection unless the user explicitly approves.
- If new draft has `[PENDING]` for a subsection that already has content on Confluence, **keep the existing Confluence content** and log a warning.
- Always read the page before writing. Never write blind.
- These rules prevent accidental erasure of Feature Summary, Test Plan, or other sections.

### Add: Pipeline Dependency Rule
Add to a `## Workflow Pipeline Rules` section:
- `qa-summary` MUST have a valid `_REPORT_FINAL.md` before it can generate a summary. No exceptions.
- `_REPORT_FINAL.md` is created after Phase 4a self-review passes in `defect-analysis`, not after publish.
- `qa-summary` reads exclusively from `_REPORT_FINAL.md`. Never from `_REPORT_DRAFT.md`.

### Add: QA Owner Scope Default
Add to `## Jira Workflow Insights`:
- Release-level queries default to `"QA Owner" = currentUser()`. This must be explicit in the JQL.
- To fetch ALL features in a release (no owner filter), the user must explicitly opt in.
- This default prevents accidental bulk processing of other QA engineers' features.

### Add: Cross-Project JQL Pattern
Add to `## Jira Workflow Insights`:
- `jira issue list` without `project in (...)` defaults to the configured project. Always use cross-project JQL.
- Cross-project pattern: load `project_keys.txt` from Phase 0b cache and inject into all JQL queries.
- This applies to BOTH feature search (Phase 0a) AND defect/linked-issue search (Phase 1).
- Reference: `skills/jira-cli/references/issue-search.md`.

### Correct: Report Archive Strategy
The current "Report Archive Strategy" section only points to other docs. Add the actual rules inline:
- Archive before any overwrite: run `scripts/archive_report.sh` with exit 2 = nothing to archive (non-fatal).
- Archive location: `projects/defects-analysis/<KEY>/archive/<KEY>_REPORT_FINAL_<YYYYMMDD>.md`
- QA summary archives: `projects/qa-summaries/<KEY>/archive/<KEY>_QA_SUMMARY_FINAL_<YYYYMMDD>.md`
- Never delete archived files.

---

## 6. Confluence Post-Update Formatting Self-Check

**Problem:** After publishing or updating a Confluence page, the agent has no feedback loop to confirm the rendered content looks correct. Markdown-to-Confluence storage format conversion can silently produce broken tables, misaligned bullets, or malformed macros that are invisible in the local draft but broken on the live page.

**Root Cause:** The current Phase 5 (`qa-summary.md`) and Phase 6 (`defect-analysis.md`) only verify that the `confluence update` command exits with success — they do not read back the page to confirm the rendered output is structurally valid.

**Required Changes:**

### `qa-summary.md` Phase 5 — Add Post-Update Read-Back & Formatting Check

After `confluence update` completes successfully, add a mandatory self-check step:

1. **Read back the page immediately:**
   ```bash
   confluence read <page-id> --format storage > /tmp/qa_confluence_readback.html
   ```
2. **Run a structural formatting check** against the read-back content:
   - Verify all expected section are present.
   - Verify that any table rendered (Code Changes Summary, Defect Status Summary, Resolved Defects) has at least a header row plus at least one data row — not an empty table shell.
   - Verify no raw Markdown syntax (e.g. `**bold**`, `| col |`, ` ``` `) leaked through unconverted.
   - Verify no `[PENDING]` placeholder is present in a table cell in a way that breaks table structure.
3. **On pass:** Log `✅ Confluence formatting self-check passed.` and proceed to Phase 6 (notification).
4. **On fail:** Log the specific issue(s), pause, and present the user with:
   > *"⚠️ Confluence formatting issue detected after publish: `<issue description>`.*
   > *(A) Attempt auto-fix and re-publish, or (B) Notify me to fix manually?"*
   - If the user picks (A): re-convert the local draft using an alternative conversion path and re-publish once. If it fails again, fall back to (B).
   - Never silently leave a broken Confluence page — always surface and log the issue, and append a clear warning to the resulting Feishu notification (e.g., `⚠️ Confluence formatting check failed. Manual adjustments needed on the page`).

### `defect-analysis.md` Phase 6 — Apply Same Read-Back Check

Mirror the same read-back + structural formatting check after the defect analysis report is published to Confluence. Minimum checks:
- Expected section headings are present (Phase 1–6 sections or equivalent).
- No raw Markdown syntax leaked through.
- No empty tables.

### Reference: Formatting Self-Check Criteria (shared, applies to both agents)

| Check | Pass Condition | Fail Action |
|---|---|---|
| Section headings present | All required headings found in read-back HTML | Log missing sections; surface to user |
| No raw Markdown syntax | No `**`, `\|`, ` ``` ` patterns in plain text nodes | Attempt re-conversion |
| Tables well-formed | Each table has `<thead>` + at least 1 `<tbody>` row | Log and surface to user |
| No broken `[PENDING]` in tables | `[PENDING]` only in designated placeholder cells, not splitting table structure | Auto-fix: move to adjacent text block |

---

## 7. QA Summary Confluence Page: Section Formatting Rules

**Problem:** The QA Summary Confluence page uses tables inconsistently — some sections that should be bullet lists are rendered as tables (which look cluttered and hard to read on Confluence), while sections that genuinely benefit from tables are not using them. Additionally, section headings use rigid numeric prefixes (e.g. `5.1`, `5.2`) that look bureaucratic and are hard to scan; subsections should start from `1.` not inherit the parent section number.

**Root Cause:** The current design and template in `QA_SUMMARY_AGENT_DESIGN.md` does not explicitly specify which sections must use tables vs. bullet lists, and mandates `5.x` numeric ordering inherited from the parent Confluence page section. The agent defaults to tables for most structured data and copies the parent numbering, both of which cause readability problems.

**Required Changes:**

### Formatting Rule 1: Default = Bullet List; Tables Only Where Specified

The general rule for the QA Summary Confluence page is:
> **Do NOT use tables unless the section is explicitly listed below as table-required.**
> Use bullet lists (`-`) for all other structured content.

### Sections That MUST Use Tables

| Section | Format | Reason |
|---|---|---|
| **Code Changes Summary** | Table | Structured comparison: component / change type / PR / risk level — needs column alignment |
| **Defect Status Summary** | Table | Numeric counts by status/priority need column alignment to be scannable |
| **Resolved Defects Detail** | Table | Per-defect rows with ID, summary, priority, resolution — structured tabular data |

### Sections That MUST Use Bullet Lists (NOT tables)

All other sections must use bullet lists or plain prose. This explicitly includes:
- Overall QA Status / Risk Assessment
- Test Coverage Summary
- Performance
- Security / Compliance
- Regression Testing
- Automation Coverage
- Notes / Observations
- Any pending placeholder sections

### Formatting Rule 2: Emoji Headings, No Numeric Prefix

Section headings in the QA Summary must use an emoji prefix instead of a numeric prefix. The `5.x` numbering inherited from the parent page section is dropped entirely. Subsection ordering starts from `1.` if local ordering is needed within a section.

**Heading format:**
```
## 🔍 QA Summary

### 1. Overall QA Status
### 2. Code Changes Summary
### 3. Defect Status Summary
### 4. Resolved Defects Detail
### 5. Test Coverage
### 6. Performance
### 7. Security / Compliance
### 8. Regression Testing
### 9. Automation Coverage
```

**Rules:**
- The top-level section heading uses an emoji: `## 🔍 QA Summary` (or equivalent agreed emoji).
- Each sub-section uses a simple local counter starting at `1.` — never `5.1`, `5.2`, etc.
- The emoji for the top-level heading is fixed. Sub-section headings do NOT individually add emojis — they use the numeric counter only (`### 1. Overall QA Status`, not `### 1. 📋 Overall QA Status`).
- If the Confluence page already has `5. QA Summary` as a heading, the agent must replace it with the emoji version on update.

### Formatting Rule 3: Resolved Defects — Highest Priority Issues Only

For the **Resolved Defects Detail** table specifically:
- **Only list the highest-priority resolved issues** in the table. Do not list every resolved defect.
- Priority filter: include only issues with priority **P0 / Critical** or **P1 / High**. Omit P2/Medium, P3/Low, and lower unless they have exceptional notes.
- After the table, add a brief summary line:
  > *"X additional resolved defects (P2/P3) not shown. Full list: [Jira Filter Link]."*
- This keeps the Confluence page focused and avoids table bloat on features with many minor resolved bugs.

### Changes Required in `QA_SUMMARY_AGENT_DESIGN.md`

In **Phase 4 — User Approval Gate**, update the prompt to remove all `5.1-5.9` references, replacing them with `1-9`.

In the **Target Structure (Confluence Template)** section, remove all `5.x` prefixes to correctly align with the new 1-based local numbering policy.

In **Phase 2 — Summary Generation**, add an explicit formatting policy block:

```
**Confluence Section Formatting Policy (MANDATORY):**

1. Section headings: use emoji prefix for the top-level QA Summary heading (## 🔍 QA Summary).
   Sub-sections use local numeric order starting at 1. (### 1. Overall QA Status, ### 2. Code Changes Summary, …).
   Never use 5.x numbering.

2. The following sections MUST use Markdown tables in the draft (they will render as Confluence tables):
   - Code Changes Summary
   - Defect Status Summary
   - Resolved Defects Detail

3. ALL other sections MUST use bullet lists (- item) or plain prose. No tables allowed.

4. Resolved Defects Detail table: include ONLY P0/Critical and P1/High priority resolved issues.
   Append a count line for omitted lower-priority items after the table.
```

In **Phase 3 — Self-Review** (`qa-summary-review` skill criteria), add:

```
7. **Section heading format compliant** — top-level heading uses emoji (🔍 QA Summary);
   sub-sections use local 1-based numeric order. No 5.x numbering anywhere.
8. **Section formatting compliant** — tables used ONLY for: Code Changes Summary,
   Defect Status Summary, Resolved Defects Detail. All other sections use bullet lists.
9. **Resolved Defects table contains only P0/P1 issues** — no P2/P3 rows in the table.
   A trailing count line must be present if any lower-priority resolved issues exist.
```

---

## 8. QA Summary Skill Split: `qa-summary` (Draft Generation) + `qa-summary-review` (Quality Gate)

**Problem:** The `summary-review` skill conflates two distinct responsibilities — draft structure guidance and post-draft quality review. Phase 2 (draft generation) invokes no skill at all, leaving draft structure entirely to the agent's judgment. Phase 3 applies `summary-review` as a review gate but it was never designed as a generation guide, resulting in inconsistent drafts.

**Root Cause:** There is no dedicated skill to guide the initial QA summary draft generation. The review skill (`summary-review`) only catches problems after the fact, instead of setting structure upfront.

**Required Changes:**

### Rename: `skills/summary-review/` → `skills/qa-summary/`

The existing `summary-review` skill is renamed to `qa-summary` and repurposed as the **draft generation guide** invoked in Phase 2. It defines:
- The required section structure with the new emoji heading and 1-based subsection numbering (from Enhancement 7).
- What data source to use for each section (from `_REPORT_FINAL.md`, Jira raw, PR impact files).
- The mandatory placeholder policy (`[PENDING — <reason>]` for missing data).
- Formatting rules: which sections use tables, which use bullet lists (from Enhancement 7).

**Updated `qa-summary` skill responsibility:** *"Given the defect-analysis output and context files, generate a well-structured QA Summary draft following the canonical section template."*

### New Skill: `skills/qa-summary-review/`

A dedicated **quality gate** skill invoked in Phase 3 after the draft exists. Focused exclusively on:

**1. Coverage Review** — Does the draft adequately cover all required testing dimensions?
- All 9 subsections present and non-empty (or correctly placeholdered).
- Defect counts cross-checked against `_REPORT_FINAL.md` — total logged, currently open, resolved counts must match exactly.
- Risk Assessment rationale is coherent with defect severity distribution.
- Open defects table contains correct entries (`Defect ID`, `Summary`, `Status`, `Notes`).
- All Jira issues and GitHub PRs referenced in the analysis are reflected in the summary.

**2. Formatting Review** — Does the draft comply with the Confluence formatting rules (Enhancement 7)?
- Top-level heading is `## 🔍 QA Summary` (emoji, no numeric prefix).
- Subsections use local 1-based numbering (`### 1.`, `### 2.`, etc.). No `5.x` anywhere.
- Tables used only for: Code Changes Summary, Defect Status Summary, Resolved Defects Detail.
- All other sections use bullet lists or plain prose — no tables.
- Resolved Defects table contains only P0/P1 issues; trailing count line present for omitted items.
- No raw Markdown syntax leakage (no `**`, `| |`, ` ``` ` in plain text).

**Output of `qa-summary-review`:** A structured `_QA_SUMMARY_REVIEW.md` file with:
- Pass/Fail verdict.
- Coverage checklist (9 subsections, defect count match, risk coherence, open defects table).
- Formatting checklist (heading format, section format, resolved defects filter).
- Actionable fixes for any failures (auto-fixed inline or listed for Phase 2 re-run).

### Updated Phase Responsibilities in `qa-summary.md`

| Phase | Skill | Role |
|---|---|---|
| Phase 2 — Draft Generation | `qa-summary` | Provides the section template, data source mapping, placeholder policy, and formatting rules. The agent builds the draft by following this skill. |
| Phase 3 — Self-Review | `qa-summary-review` | Reviews the draft against coverage completeness and formatting compliance. Auto-fixes minor issues; returns to Phase 2 for major gaps. |

### Changes Required in `QA_SUMMARY_AGENT_DESIGN.md`

- **Phase 2:** Add: *"Apply the `qa-summary` skill. This skill provides the canonical section template, data source mapping (from `_REPORT_FINAL.md`), and formatting rules. Build the draft by following the skill's output section-by-section."*
- **Phase 3:** Replace all references to `summary-review` with `qa-summary-review`. Update criteria numbering to match the 9-check list from Enhancement 7.

---

## Implementation Checklist

### `defect-analysis.md`
- [x] Phase 0a: Reorder — run Phase 0b (project key cache) BEFORE Phase 0a (feature search)
- [x] Phase 0a: Add scope-selection prompt (default = `currentUser()`; opt-in to ALL)
- [x] Phase 0a: Add cross-project JQL using `project_keys.txt` cache
- [x] Phase 0a: Reference `skills/jira-cli/references/issue-search.md`
- [x] Phase 0b: Keep as-is; verify it runs before both Phase 0a and Phase 1
- [x] Phase 1: Add guard — halt if `project_keys.txt` is empty; re-run Phase 0b
- [x] Phase 4a: After self-review passes, archive old final and promote draft → `_REPORT_FINAL.md`; add `report_final_at` to `task.json`
- [x] Phase 5: Update approval prompt to reference `_REPORT_FINAL.md`, not `_REPORT_DRAFT.md`
- [x] Phase 6: Remove `cp draft → final` step; publish the existing `_REPORT_FINAL.md` directly

### `qa-summary.md`
- [x] Phase 0 (new step): Check for `<KEY>_REPORT_FINAL.md` existence and freshness BEFORE workspace classification. If missing, require defect-analysis to run — no bypass.
- [x] Phase 0 (new step): Verify `report_approved_at` is NOT null. Halt if the report exists but is not yet approved by a human.
- [x] Phase 1: Remove `*(Skip if "Use Existing" or "Resume")*` line entirely
- [x] Phase 1: Clarify skip condition — only skip sub-agent spawn if `_REPORT_FINAL.md` confirmed fresh by user
- [x] Phase 2: Explicitly state input source is `_REPORT_FINAL.md` (not draft, not raw Jira cache)
- [x] Phase 0 (release scope): Add scope-selection step before spawning sub-agent for release runs
- [x] Phase 3: Cross-check defect counts against `_REPORT_FINAL.md`

### `MEMORY.md`
- [x] Add `## Confluence Safety Rules` section
- [x] Add `## Workflow Pipeline Rules` section
- [x] Add QA Owner scope default note to `## Jira Workflow Insights`
- [x] Add cross-project JQL pattern note to `## Jira Workflow Insights`
- [x] Expand `## Report Archive Strategy` with actual rules (not just pointers to other docs)

### Confluence Post-Update Formatting Self-Check (Enhancement 6)
- [x] `qa-summary.md` Phase 5: After `confluence update` succeeds, read back the page and run structural formatting checks
- [x] `qa-summary.md` Phase 5: On check failure, surface issue to user with auto-fix or manual options — never leave a broken page silently
- [x] `defect-analysis.md` Phase 6: Mirror the same read-back + structural formatting check after defect report publish
- [x] Both agents: Log `✅ Confluence formatting self-check passed` on success

### QA Summary Skill Split (Enhancement 8)
- [x] Rename `skills/summary-review/` → `skills/qa-summary/`; update SKILL.md as draft generation guide (section template, data source mapping, formatting rules)
- [x] Create `skills/qa-summary-review/SKILL.md` with Coverage and Formatting review checklists; output `_QA_SUMMARY_REVIEW.md`
- [x] `qa-summary.md` Phase 2: invoke `qa-summary` skill during draft generation
- [x] `qa-summary.md` Phase 3: replace `summary-review` reference with `qa-summary-review`
- [x] `QA_SUMMARY_AGENT_DESIGN.md` Phase 2 and Phase 3: update skill references accordingly
- [x] `AGENTS.md` Skills table: rename `summary-review` → `qa-summary` (Phase 2), add `qa-summary-review` (Phase 3)

### QA Summary Section Formatting Rules (Enhancement 7)
- [x] `QA_SUMMARY_AGENT_DESIGN.md` Phase 2: Add explicit Confluence formatting policy block (emoji heading, local 1-based subsection numbering, no 5.x; bullet list default; tables only for Code Changes Summary, Defect Status Summary, Resolved Defects Detail)
- [x] `QA_SUMMARY_AGENT_DESIGN.md` Phase 4 and Target Structure: Remove all 5.x references, ensuring prompts and templates match the 1-based structure.
- [x] `QA_SUMMARY_AGENT_DESIGN.md` Phase 3 self-review criteria: Add check 7 (heading format), check 8 (section formatting compliant), check 9 (Resolved Defects table P0/P1 only)
- [x] `qa-summary.md` Phase 2 (workflow): Generate headings with emoji prefix and local 1-based subsection order; enforce table/bullet-list rules
- [x] `qa-summary.md` Phase 3 (self-review): Enforce emoji heading + 1-based numbering; P0/P1 filter on Resolved Defects table; require trailing count line for omitted issues
- [x] `qa-summary.md` Phase 5 (Confluence update): If existing page has `5. QA Summary` numeric heading, replace with `🔍 QA Summary` emoji heading on update
