---
description: Run QA Summary workflow to aggregate defect and PR analysis into a targeted Confluence QA Summary update. Always confirms with user before any external API calls or publishing.
---

# QA Summary Workflow

Builds on top of the Defect Analysis Agent. Automates generation, self-review, and surgical updates of QA Summary sections on Confluence.

**⚠️ User Confirmation Principle:** Before advancing to Phase 1 or Phase 5, always confirm with the user. Never publish without explicit `APPROVE`.

> **Design Reference:** See `projects/docs/QA_SUMMARY_AGENT_DESIGN.md`

---

## 0. Idempotency Check & Pre-Flight

1. **Identify Confluence Page:**
   - Read `projects/qa-summaries/<FEATURE_KEY>/run.json`.
   - If `confluence_page_id` exists: ask user "Continue with previously used page (ID: <id>)?"
   - If missing: ask user to provide URL or title. Use `confluence` skill (`confluence find "<title>"`) to resolve. Never proceed without an exact ID.
   - Save ID to `run.json`.

2. **Workspace State Classification:**
   Check for `projects/qa-summaries/<FEATURE_KEY>/` artifacts:
   - `<KEY>_QA_SUMMARY_FINAL.md` present → Ask: Use Existing / Smart Refresh / Full Regenerate
   - `<KEY>_QA_SUMMARY_DRAFT.md` present → Ask: Resume to Approval / Smart Refresh / Full Regenerate
   - `projects/defects-analysis/<KEY>/context/jira_raw.json` exists but no summary output → Ask: Generate from Cache / Re-fetch + Regenerate
   - Fresh → Proceed to Phase 1.
   **Always display data freshness (e.g. "Jira data is 3 days old") before asking.**

3. **Archive Check:** If user chooses an option that overwrites an existing final output, move it to `archive/<KEY>_QA_SUMMARY_FINAL_<YYYYMMDD>.md`.

4. **Missing Artifact Check:**
   Audits the `defects-analysis/<KEY>/context/prs/` directory against `jira_raw.json`. Surface any missing/stale PR impact files to the user:
   > "2 PR analyses are missing. (A) Fetch missing + refresh, (B) Continue and use [PENDING] placeholders, (C) Abort."
   If (B), use `[PENDING — PR analysis not available]` for missing data in the summary.

---

## 1. Sub-Agent Spawning & Data Gathering

*(Skip if "Use Existing" or "Resume" was selected)*

1. Spawn the `defect-analysis` sub-agent for `<FEATURE_KEY>`.
   - Run workflow `.agents/workflows/defect-analysis.md`.
2. Wait for completion.
3. Update `projects/qa-summaries/<FEATURE_KEY>/run.json` with `data_fetched_at` and `subtask_timestamps`.

---

## 2. Summary Generation

1. Use gathered data from `projects/defects-analysis/<FEATURE_KEY>/` to construct the QA Summary.
2. Output file: `projects/qa-summaries/<FEATURE_KEY>/<FEATURE_KEY>_QA_SUMMARY_DRAFT.md`
3. **MANDATORY Placeholders Policy:**
   - The draft MUST contain subsections 5.1 through 5.9.
   - If data is unavailable for a section, use a `[PENDING — <reason>]` placeholder. Never omit the section.

---

## 3. Self-Review

1. Apply the `summary-review` skill against `<FEATURE_KEY>_QA_SUMMARY_DRAFT.md`.
2. Criteria enforce presence of 5.1-5.9, correct defect counts, logical risk assessment, full open defects table, hyperlinks, and no empty sections.
3. If FAILS: auto-apply minor fixes. Log actionable fixes for major gaps and return to Phase 2.
4. **Crucial Step:** Once self-review PASSES, you MUST explicitly write down (render) the final summarized version into the chat/console so the user can read the content without having to open the file.

---

## 4. User Approval Gate ⛔

**STOP. Present to user:**
```
📋 QA Summary draft is ready for review.

  Feature:         <FEATURE_KEY>
  Sections:        5.1–5.9 (all present)
  Open defects:    <N>
  Risk:            <Level>
  Confluence page: "<Title>" (ID: <ID>)
  Draft file:      projects/qa-summaries/<KEY>/<KEY>_QA_SUMMARY_DRAFT.md

⚠️ Sections with placeholders: <List if any>
    These will be published as [PENDING] markers unless you provide data now.

Please review the draft above, then reply:
  APPROVE   — publish to Confluence as-is
  REJECT    — provide feedback to revise
  FILL <section> <data> — provide missing data before publishing
```
**Rule:** You MUST print the concise summary of the draft report directly to the console/chat here so the user can read it without navigating to the file.
Never publish without explicit `APPROVE`.

---

## 5. Confluence Section Update

Surgical update of `QA Summary` section only.
1. Read current page: `confluence read <page-id>` (use `confluence` skill).
2. Locate `QA Summary` section.
3. **Merge Rules:**
   - Add/replace sub-sections 5.1-5.9.
   - Preserve all content outside of `QA Summary`.
   - Preserve existing subsection data if the new draft only has a `[PENDING]` placeholder for it.
4. Convert merged content to Confluence storage format and execute update:
   `confluence update <page-id> --file qa_summary_section.html --format storage` (Or use skill).
5. On success, save `run.json` with `output_generated_at` and `confluence_published_at`.
6. Copy draft to `projects/qa-summaries/<FEATURE_KEY>/<FEATURE_KEY>_QA_SUMMARY_FINAL.md`. Archive old final.

---

## 6. Notification

1. Use the `feishu` skill to send notification:
```
✅ QA Summary updated on Confluence
  Feature:   <FEATURE_KEY>
  Page:      <Title>
  URL:       <URL>
  Updated:   <UTC TIME>
  Sections:  5.1–5.9 (⚠️ <List with placeholders> have placeholders)
Published by QA Summary Agent.
```
2. If Feishu fails, log to `run.json` -> `notification_pending`.