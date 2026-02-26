# MEMORY.md - QA Report Agent Long-Term Memory

_Reporting patterns and Jira best practices._

## Report Archive Strategy

Archive before any overwrite — run `scripts/archive_report.sh <KEY> FINAL` (exit 2 = nothing to archive, non-fatal). Never delete archived files.

| Artifact | Archive location |
|---|---|
| `<KEY>_REPORT_FINAL.md` | `projects/defects-analysis/<KEY>/archive/<KEY>_REPORT_FINAL_<YYYYMMDD>.md` |
| `<KEY>_REPORT_DRAFT.md` | `projects/defects-analysis/<KEY>/archive/<KEY>_REPORT_DRAFT_<YYYYMMDD>.md` |
| `<KEY>_QA_SUMMARY_FINAL.md` | `projects/qa-summaries/<KEY>/archive/<KEY>_QA_SUMMARY_FINAL_<YYYYMMDD>.md` |

Full design references: `projects/docs/REPORTER_AGENT_DESIGN.md` Section 3, `WORKSPACE_RULES.md`, `projects/docs/REPORTER_ENHANCEMENT_DESIGN.md` Section 3.

---

## Workflow Pipeline Rules

- `qa-summary` **MUST** have a valid `<KEY>_REPORT_FINAL.md` before generating a summary. No exceptions, no bypasses.
- `_REPORT_FINAL.md` is created after **Phase 4a self-review passes** in `defect-analysis` — not after Confluence publish. It means "AI-reviewed and ready for human gate".
- `qa-summary` reads exclusively from `_REPORT_FINAL.md`. Never from `_REPORT_DRAFT.md` or raw Jira cache.
- Phase 3 self-review in `qa-summary` must cross-check defect counts against `_REPORT_FINAL.md`.
- `task.json` fields: `report_final_at` = timestamp when draft promoted to final (Phase 4a); `report_approved_at` = timestamp of user approval (Phase 5).

---

## Confluence Safety Rules

These rules prevent accidental erasure of existing page content.

- **Surgical updates only.** Only the `QA Summary` section (1–9) is ever modified. All other sections on the page are untouched.
- **Never delete existing subsections** within `QA Summary` unless the user explicitly approves removal.
- **Preserve over placeholder.** If the new draft has `[PENDING]` for a subsection that already has real content on Confluence, keep the existing Confluence content and log a warning: *"⚠️ Section X has existing content on Confluence; new draft is [PENDING]. Keeping existing content."*
- **Always read before writing.** Run `confluence read <page-id>` first. Never write blind.
- **Never overwrite full page.** Always merge: add/replace the QA Summary section, preserve everything else.

---

## Jira Workflow Insights

### QA Owner Scope Default

- Release-level queries **default to `"QA Owner" = currentUser()`**. Always include this filter unless the user explicitly opts in to ALL features.
- Opt-in prompt: *"Fetch only my features [DEFAULT] or ALL features for this release?"*
- This prevents bulk processing of other QA engineers' features by accident.

### Cross-Project JQL Pattern

`jira issue list` without `project in (...)` silently returns only results from the configured default project. **Always use cross-project JQL.**

```bash
# Phase 0a: cache project keys (run once per session)
PROJECT_KEYS=$(cat projects/defects-analysis/.cache/project_keys.txt | awk '{printf "\"%s\",", $0}' | sed 's/,$//')

# Feature search (Phase 0a) — cross-project
jira issue list --jql "project in ($PROJECT_KEYS) AND \"QA Owner\" = currentUser() AND type = Feature ..."

# Defect/linked issue search (Phase 1) — cross-project
jira issue list --jql "project in ($PROJECT_KEYS) AND issuetype = Defect AND (parent=\"FEAT-KEY\" OR text ~ \"FEAT-KEY\")"
```

- Applies to BOTH feature search (Phase 0a) AND defect/linked-issue search (Phase 1).
- `linkedIssues()` fails across projects — use project list + text search instead.
- Reference: `skills/jira-cli/references/issue-search.md`.

### Common Transitions
- Open → In Testing
- In Testing → Testing Complete
- Testing Complete → Reopen (bugs found)
- Testing Complete → Closed (all passed)

### Required Fields (Project-Specific)
- Summary (always required)
- Description (always required)
- Priority (Critical, High, Medium, Low)
- Issue Type (Bug, Task, Story, Epic)
- Assignee (optional, often auto-assigned)

### Useful Labels
- `automation` - Found by automated tests
- `regression` - Reoccurring issue
- `ui` - UI-related
- `critical-path` - Affects core functionality
- `flaky` - Intermittent issue

---

*Last updated: 2026-02-26*

## Critical Lessons Learned

### Confluence Update Behavior (2026-02-26)

**Problem:** Used `confluence update <page-id> --file qa_summary_section.html` directly, which **replaced the entire page content** with only the QA Summary section. All original test planning content was erased.

**Root Cause:** The `confluence update` command with `--file` replaces the **entire page body**, not just a specific section. It does not perform surgical section merging.

**Correct Procedure:**
1. **Read** current page content: `confluence read <page-id> > current_page.html`
2. **Merge** new section with existing content: `cat current_page.html > merged.html && cat new_section.html >> merged.html`
3. **Update** with merged content: `confluence update <page-id> --file merged.html --format storage`

**Never** pass only the new section HTML to `confluence update` — always merge first.

**Fixed:** 2026-02-26 — Restored original content from version 6, appended QA Summary, updated successfully.

**Documentation Updated:**
- `projects/docs/QA_SUMMARY_AGENT_DESIGN.md` — Added critical warning in Phase 5
- Workflow steps updated to show explicit 3-step merge process

**Verification:** BCED-4198 page now contains both original test plan + QA Summary sections.

