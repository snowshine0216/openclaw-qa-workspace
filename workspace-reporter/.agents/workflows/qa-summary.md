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

2. **Final Report Prerequisite Check:**
   - If running for a release version (e.g. 26.03), first ask scope: *"Fetch features for: (A) Only my features (default) or (B) ALL features?"* Pass the choice to the sub-agent.
   - For each feature, check if `projects/defects-analysis/<KEY>/<KEY>_REPORT_FINAL.md` exists.
   - If missing: halt and **require `defect-analysis` to run first**. No bypass allowed.
   - If exists: Verify `task.json` → `report_approved_at` is NOT null. If missing/null, halt and block with: *"The defect analysis is awaiting human approval. Please approve it first."*
   - If approved but stale (>7 days), recommend a refresh.

3. **Workspace State Classification:**
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

*(Skip sub-agent spawn ONLY if `_REPORT_FINAL.md` exists and was confirmed fresh by user in Phase 0. You must still verify the report exists before proceeding.)*

1. Spawn the `defect-analysis` sub-agent for `<FEATURE_KEY>`.
   - Run workflow `.agents/workflows/defect-analysis.md`.
2. Wait for completion.
3. Update `projects/qa-summaries/<FEATURE_KEY>/run.json` with `data_fetched_at` and `subtask_timestamps`.

---

## 2. Summary Generation

1. Apply the `qa-summary` skill. Follow its section template, data source mapping, placeholder policy, and formatting rules to construct the draft section-by-section.
   - Input: `projects/defects-analysis/<FEATURE_KEY>/<FEATURE_KEY>_REPORT_FINAL.md` (never `_REPORT_DRAFT.md`).
   - Structure: `## 🔍 QA Summary` with subsections `### 1.` through `### 9.` (local 1-based numbering, no `5.x`).
   - Tables required only for: Code Changes Summary, Defect Status Summary, Resolved Defects Detail.
   - All other sections use bullet lists or plain prose.
   - Resolved Defects table: P0/P1 issues only; append trailing count line for omitted P2/P3 items.
2. Output file: `projects/qa-summaries/<FEATURE_KEY>/<FEATURE_KEY>_QA_SUMMARY_DRAFT.md`
3. **MANDATORY Placeholders Policy:** All 9 subsections must be present. Use `[PENDING — <reason>]` for any section with missing data. Never omit a section.

---

## 3. Self-Review

1. Apply the `qa-summary-review` skill against `<FEATURE_KEY>_QA_SUMMARY_DRAFT.md`.
   - **Coverage checks:** All 9 subsections present, defect counts match `_REPORT_FINAL.md`, risk assessment coherent, open defects table complete, PR coverage reflected.
   - **Formatting checks:** Emoji heading, 1-based subsection numbering, table/bullet-list compliance, Resolved Defects P0/P1 filter, hyperlink completeness, no raw Markdown in tables.
2. Review output saved to `projects/qa-summaries/<FEATURE_KEY>/<FEATURE_KEY>_QA_SUMMARY_REVIEW.md`.
3. Auto-fixes are applied inline for eligible checks. Checks requiring Phase 2 return are logged as actionable failures.
4. If FAILS (Phase 2 return required): log the actionable fix list and return to Phase 2. Do NOT render to console.
5. **Crucial Step:** Once self-review PASSES, you MUST explicitly write down (render) the final summarized version into the chat/console so the user can read the content without having to open the file. Surface any warnings from the review in the rendered output.

---

## 4. User Approval Gate ⛔

**STOP. Present to user:**
```
📋 QA Summary draft is ready for review.

  Feature:         <FEATURE_KEY>
  Sections:        1–9 (all present)
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
2. Locate `QA Summary` section (if the existing page has a `5. QA Summary` numeric heading, replace it heavily with the `🔍 QA Summary` emoji heading).
3. **Merge Rules:**
   - Add/replace sub-sections 1-9.
   - Preserve all content outside of `QA Summary`.
   - Preserve existing subsection data if the new draft only has a `[PENDING]` placeholder for it.
4. Convert merged content to Confluence storage format and execute update:
   `confluence update <page-id> --file qa_summary_section.html --format storage` (Or use skill).
5. **Post-Update Confluence Formatting Self-Check:**
   - Immediately read back the page to verify structural formatting: `confluence read <page-id> --format storage > /tmp/qa_confluence_readback.html`
   - Verify all 9 sections present, tables well-formed (at least 1 data row, no empty shells), no raw Markdown leakage.
   - On pass: Log `✅ Confluence formatting self-check passed.` proceed.
   - On fail: Present issue to user and ask: *(A) Attempt auto-fix and re-publish, or (B) Notify me to fix manually?*
6. On success, save `run.json` with `output_generated_at` and `confluence_published_at`.
7. Copy draft to `projects/qa-summaries/<FEATURE_KEY>/<FEATURE_KEY>_QA_SUMMARY_FINAL.md`. Archive old final.

---

## 6. Notification

1. Use the `feishu` skill to send notification:
```
✅ QA Summary updated on Confluence
  Feature:   <FEATURE_KEY>
  Page:      <Title>
  URL:       <URL>
  Updated:   <UTC TIME>
  Sections:  1–9 (⚠️ <List with placeholders> have placeholders)
Published by QA Summary Agent.
```
*(If the formatting self-check failed and user chose manual fix, append: `⚠️ Confluence formatting check failed. Manual adjustments needed on the page.`)*
2. If Feishu fails, log to `run.json` -> `notification_pending`.