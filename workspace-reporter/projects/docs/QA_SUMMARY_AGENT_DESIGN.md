# QA Summary Agent Design

## Overview

The **QA Summary Agent** is an orchestration agent built on top of the existing **Defect Analysis Agent**. It automates the generation, review, and targeted publication of comprehensive QA summaries to Confluence. It acts as an orchestrator: delegating data gathering to the `defect-analysis` sub-agent, structuring the summary following a standardized template, self-reviewing the content, then **surgically updating the `QA Summary` section of an existing Confluence page** — never overwriting unrelated content. A notification is sent upon successful publication.

---

## Workflow

The process follows a sequential, human-gated workflow. **Never advance to the next phase without explicit user confirmation at each gate.**

---

### Phase 0 — Idempotency Check & Pre-Flight

> **Applies the [agent-idempotency skill](.cursor/skills/agent-idempotency/SKILL.md). All checks happen before any external API call.**

#### 0a. Identify the Target Confluence Page

The agent **must** resolve the exact Confluence page before any work begins. This is the single most important pre-flight check.

**Resolution priority:**
1. Check if a `run.json` for this Feature Key already stores a `confluence_page_id`. If yes, display it: *"Previously used page: [page title] (ID: `<id>`). Continue with this page?"*
2. If no stored page: prompt the user directly:
   > *"Which Confluence page should the QA Summary section be updated on? Please provide either:*
   > *(a) The page URL (e.g. `https://company.atlassian.net/wiki/spaces/SPACE/pages/12345/Title`), or*
   > *(b) The page title so I can search for it."*
3. If the user provides a title, run `confluence find "<title>"` and present matches for selection. If zero matches, escalate:
   > *"No page found matching `<title>`. Please confirm the exact title or provide the URL directly."*
4. **Never assume or default a page.** Do not proceed until the page ID is confirmed.
5. Persist the confirmed `confluence_page_id` to `run.json`.

#### 0b. Workspace State Classification

Classify the current workspace state for the given **run key** (Feature Key, e.g. `BCIN-789`):

| State | Condition | User Prompt |
|---|---|---|
| **Final exists** | `<KEY>_QA_SUMMARY_FINAL.md` present | Show date + Confluence page. Offer: **Use Existing** / **Smart Refresh** / **Full Regenerate** |
| **Draft exists, no final** | `<KEY>_QA_SUMMARY_DRAFT.md` present | Offer: **Resume to Approval** / **Smart Refresh** / **Full Regenerate** |
| **Cache only** | Defect analysis context exists, no summary output | Show data age. Offer: **Generate from Cache** / **Re-fetch + Regenerate** |
| **Fresh** | No artifacts | Proceed normally |

Display data freshness before presenting options:
> *"`BCIN-789` was last processed on 2026-01-28 (3 days ago). Defect context: 3 days old. PR analyses: 5/8 cached (oldest: 7 days)."*

**Option semantics:**

| Option | Re-fetches data? | Re-runs sub-tasks? | Archives old output? |
|---|---|---|---|
| Use Existing | No | No | No |
| Smart Refresh | Yes | Only missing/stale | Yes → `archive/` |
| Full Regenerate | Yes | Yes, all | Yes → `archive/` |
| Resume | No | No | No |
| Generate from Cache | No | No | Moves draft → `archive/` |

**Rule:** Never silently overwrite an existing final output. Always archive first (`archive/<KEY>_QA_SUMMARY_FINAL_<YYYYMMDD>.md`).

#### 0c. Missing Artifact Check

Before proceeding to Phase 1, audit what context is available and surface all gaps to the user:

```
Pre-flight artifact check for BCIN-789:
  ✅  jira_raw.json           (fetched 2026-02-24)
  ✅  jira_issues/            (12 issues parsed)
  ❌  prs/PR-441_impact.md    (missing)
  ❌  prs/PR-442_impact.md    (missing)
  ⚠️  prs/PR-443_impact.md    (older than 7 days)

2 PR analyses are missing and 1 is stale. Recommended action:
  (A) Fetch missing + refresh stale PRs, then continue
  (B) Continue with available data and mark missing sections as [PENDING]
  (C) Abort

Please choose A, B, or C.
```

**Never silently skip missing artifacts.** If the user picks (B), every section that depends on missing data must carry a `[PENDING — PR analysis not available]` placeholder — not be left blank or omitted.

---

### Phase 1 — Sub-Agent Spawning & Data Gathering

*(Skip if "Use Existing" or "Resume" selected in Phase 0.)*

- Initialize and spawn the `defect-analysis` sub-agent for the confirmed Feature Key.
- The sub-agent fetches all raw context: Jira issues, PR diffs, code changes, statuses.
- Returns the aggregated defect analysis and risk reports.
- On completion, update `run.json`:

```json
{
  "run_key": "BCIN-789",
  "confluence_page_id": "12345678",
  "confluence_page_title": "BCIN-789 Release QA Report",
  "data_fetched_at": "2026-02-24T10:30:00Z",
  "output_generated_at": null,
  "subtask_timestamps": {
    "jira": "2026-02-24T10:30:00Z",
    "PR-441": "2026-02-24T10:35:00Z",
    "PR-442": null
  }
}
```

---

### Phase 2 — Summary Generation

Construct the QA Summary document using gathered data. Output: `<KEY>_QA_SUMMARY_DRAFT.md`.

**Placeholder policy — MANDATORY:**
- Every sub-section (5.1 through 5.9) **must** be present in the draft.
- If data is unavailable for a section, write a clearly labeled sample/placeholder — **never skip or omit the section**.
- Placeholder format:

```markdown
### 5.3 Performance
| | |
|---|---|
| **Status** | [PENDING — No performance test results available. Sample: ✅ Pass — No regressions observed in load tests.] |
| **Notes** | [PENDING — Add performance test summary here.] |
```

Refer to the [Target Structure](#target-structure-confluence-template) below for all required subsections.

---

### Phase 3 — Self-Review

Apply the `summary-review` skill against the draft. Criteria enforced:

1. **All 9 subsections present** (5.1–5.9), populated or placeholdered.
2. **Defect counts accurate** — "Totally Logged defects" and "Currently Open Defects" match the `defect-analysis` output exactly.
3. **Risk Assessment logical** — rationale aligns with defect severity distribution.
4. **Open Defects table complete** — columns: `Defect ID`, `Summary`, `Status`, `Notes`.
5. **All Jira/GitHub references hyperlinked.**
6. **No empty sections** — every section has at minimum a placeholder.

If review **FAILS**: auto-apply minor fixes. For major gaps, log actionable fixes and return to Phase 2.

**Crucial Step:** After a successful self-review, the agent MUST explicitly write down (render/output) the final summarized version into the chat/console so the user can read the content directly without having to open the file.

---

### Phase 4 — User Approval Gate ⛔

**STOP. Present to user:**

```
📋 QA Summary draft is ready for review.

  Feature:         BCIN-789
  Sections:        5.1–5.9 (all present)
  Open defects:    3
  Risk:            Medium
  Confluence page: "BCIN-789 Release QA Report" (ID: 12345678)
  Draft file:      projects/qa-summaries/BCIN-789/BCIN-789_QA_SUMMARY_DRAFT.md

⚠️  Sections with placeholders: 5.3 Performance, 5.8 Automation
    These will be published as [PENDING] markers unless you provide data now.

Please review the draft, then reply:
  APPROVE   — publish to Confluence as-is
  REJECT    — provide feedback to revise
  FILL <section> <data> — provide missing data before publishing

**Rule:** You MUST print the the concise summary of the draft report directly to the console/chat here so the user can read it without navigating to the file.
```

**Never publish without explicit `APPROVE`.** If the user provides feedback, return to Phase 2 for targeted revision.

---

### Phase 5 — Confluence Section Update

**⚠️ CRITICAL WARNING ⚠️**

**The `confluence update` command REPLACES the entire page content by default.** It does **NOT** perform surgical section merging. To preserve existing content:

1. **MUST** read the current page content first via `confluence read <page-id>`
2. **MUST** manually merge the new QA Summary HTML into the existing page HTML
3. **MUST** save the merged HTML to a temporary file
4. **ONLY THEN** run `confluence update <page-id> --file merged_content.html --format storage`

**Never** call `confluence update` with only the new section HTML — this will erase all existing content.

This phase performs a **surgical update** of the `QA Summary` section only. It never touches the rest of the page.

#### 5a. Read Current Page

```bash
confluence read <page-id>
```

Parse the existing page content to locate the `QA Summary` (or equivalent `5. QA Summary`) section.

#### 5b. Section Presence Decision

| Condition | Action |
|---|---|
| Section **not found** | Insert the full `QA Summary` section at the correct position (after section 4, or at the end of the page if structure is ambiguous). Log: *"Section '5. QA Summary' not found — inserting."* |
| Section **found** | Merge/update content field by field. **Never delete existing sub-sections unless the user explicitly approves removal.** Preserve all content not covered by the new summary. Log: *"Section '5. QA Summary' found — updating in place."* |

#### 5c. Merge Rules

- **Add** any subsection (5.1–5.9) that is missing from the current page.
- **Replace** any subsection that exists with the newly generated content.
- **Preserve** any content in the page **outside** the `QA Summary` section — untouched.
- **Preserve** any subsection already on the page that is **not** covered by the new summary draft, unless the user explicitly removes it.
- If the current page has a subsection with data and the new summary has only a `[PENDING]` placeholder for that same subsection, **keep the existing data** and log a warning:
  > *"⚠️ Section 5.3 already has content on Confluence; new draft has only a placeholder. Keeping existing Confluence content for 5.3."*

#### 5d. Execute Update

**Step 1: Read current page content**
```bash
confluence read <page-id> > current_page.html
```

**Step 2: Merge new QA Summary with existing content**
```bash
cat current_page.html > merged_content.html
cat qa_summary_section.html >> merged_content.html
```

**Step 3: Update with merged content**
```bash
confluence update <page-id> --file merged_content.html --format storage
```

On success, record in `run.json`:

```json
{
  "output_generated_at": "2026-02-24T12:00:00Z",
  "confluence_published_at": "2026-02-24T12:01:00Z",
  "confluence_page_url": "https://company.atlassian.net/wiki/spaces/.../pages/12345678/..."
}
```

Copy draft → `<KEY>_QA_SUMMARY_FINAL.md`. Archive any previous final.

#### 5e. Failure Handling

| Failure | Recovery |
|---|---|
| Page read fails (network/auth) | Stop. Report error. Do **not** attempt partial writes. |
| Page update fails after successful read | Stop. Preserve draft. Report error with rollback note. |
| Merge produces unexpected diff | Show diff preview to user. Require re-approval before retrying. |

---

### Phase 6 — Notification

After successful Confluence update, send a notification via the `feishu` skill:

```
✅ QA Summary updated on Confluence

  Feature:   BCIN-789
  Page:      BCIN-789 Release QA Report
  URL:       https://company.atlassian.net/wiki/spaces/.../pages/12345678/...
  Updated:   2026-02-24 12:01 UTC
  Sections:  5.1–5.9 (⚠️ 5.3, 5.8 have placeholders — manual update needed)

Published by QA Summary Agent.
```

If Feishu is unavailable, attempt WhatsApp via the `wacli` skill as fallback. If both fail, log the notification text to `run.json` under `"notification_pending"` so it can be re-sent on next invocation.

---

## Target Structure (Confluence Template)

Every generated summary **must** contain all of the following. Sections may be placeholdered but never omitted.

### 5. QA Summary

#### 5.1 Code Changes Summary
A table with columns: `Repository`, `PR`, `Files Changed`, `Status`, `Notes`.

*Sample placeholder:*
```
| Repository | PR | Files Changed | Status | Notes |
|---|---|---|---|---|
| [repo-name](url) | [PR-441](url) | 12 | ✅ Merged | [PENDING — fill in notes] |
```

#### 5.2 E2E Testing & Functionality
- **Status**: Pass / Fail / Blocked
- **Totally Logged Defects**: Integer (from `defect-analysis` output)
- **Risk Assessment**: Low / Medium / High + written rationale
- **Currently Open Defects**: Table with `Defect ID`, `Summary`, `Status`, `Notes`
- **Limitations**: Bullet list of known constraints

*Sample placeholder for Risk Assessment:*
```
**Risk Assessment**: Medium — [PENDING — 3 open defects remain; 1 is P1. Risk level
subject to change before release. Sample rationale: All open defects are in non-critical
paths. No blocker-level issues.]
```

#### 5.3 Performance
| | |
|---|---|
| **Status** | Pass / Fail / N/A |
| **Notes** | Summary of performance test results or justification for N/A |

#### 5.4 Security
| | |
|---|---|
| **Status** | Pass / Fail / N/A |
| **Notes** | Summary of security scan results |

#### 5.5 Platform Certifications
| | |
|---|---|
| **Status** | Pass / Fail / Partial |
| **Platforms Tested** | e.g., Chrome 121, Safari 17, Firefox 122, Windows 11, macOS 14 |

#### 5.6 Upgrade and Compatibility
| | |
|---|---|
| **Status** | Pass / Fail / N/A |
| **Notes** | Upgrade path testing results or N/A justification |

#### 5.7 Internationalization
| | |
|---|---|
| **Status** | Pass / Fail / N/A |
| **Notes** | i18n/l10n testing summary |

#### 5.8 Automation
| | |
|---|---|
| **Status** | Pass / Fail / N/A |
| **Notes** | Automation test suite coverage and results |

#### 5.9 Accessibility
| | |
|---|---|
| **Status** | Pass / Fail / N/A |
| **Notes** | WCAG compliance level and test results |

---

## File Layout

```
projects/qa-summaries/
└── <FEATURE_KEY>/
    ├── run.json                              ← freshness, page ID, timestamps
    ├── archive/
    │   ├── <KEY>_QA_SUMMARY_FINAL_20260128.md
    │   └── <KEY>_QA_SUMMARY_DRAFT_20260210.md
    ├── <FEATURE_KEY>_QA_SUMMARY_DRAFT.md    ← current working draft
    └── <FEATURE_KEY>_QA_SUMMARY_FINAL.md    ← published final
```

Defect analysis context lives under `projects/defects-analysis/<FEATURE_KEY>/` (managed by the `defect-analysis` sub-agent).

---

## Idempotency Mapping

| Generic Concept | QA Summary Agent |
|---|---|
| Run key | Feature Key (e.g. `BCIN-789`) |
| Primary data source | `defect-analysis` sub-agent + Confluence page read |
| Primary cache | `projects/defects-analysis/<KEY>/context/jira_raw.json` |
| Sub-tasks | PR impact analyses |
| Sub-task cache | `context/prs/<PR_ID>_impact.md` |
| Final output | `<KEY>_QA_SUMMARY_FINAL.md` |
| Draft output | `<KEY>_QA_SUMMARY_DRAFT.md` |
| `data_fetched_at` | Jira + PR fetch timestamp |
| Smart Refresh trigger | Jira tickets changed / new PRs |
| Confluence target | `confluence_page_id` stored in `run.json` |

---

## Quality Gates

- [ ] Phase 0 confirms the exact Confluence page ID before any external call
- [ ] Phase 0 classifies workspace state and displays data freshness
- [ ] Phase 0c audits and surfaces all missing artifacts to the user
- [ ] All sections 5.1–5.9 are present in the draft (placeholders acceptable, blanks not)
- [ ] `[PENDING]` placeholders are used for any section with missing data
- [ ] Self-review via `summary-review` skill passes before user approval gate
- [ ] User explicitly types `APPROVE` before any Confluence write
- [ ] Confluence update is surgical — only the `QA Summary` section is modified
- [ ] Existing Confluence content outside the QA Summary section is never touched
- [ ] Existing subsection data is preserved if new draft only has a placeholder for it
- [ ] `run.json` is updated with `confluence_published_at` and page URL on success
- [ ] Previous final is archived before overwrite
- [ ] After self-review, the final version MUST be explicitly written down (rendered) for the user to confirm.
- [ ] Feishu notification sent after successful publish (with fallback to wacli)
- [ ] If notification fails, it is persisted in `run.json["notification_pending"]`

---

## Dependencies & Skills

| Skill | Phase | Purpose |
|---|---|---|
| `jira-cli` | 1 | Paginated JQL, issue details |
| `github` | 1 | PR diffs, file counts, statuses |
| `defect-analysis` (sub-agent) | 1 | Core data processor |
| `summary-review` | 3 | Structural + accuracy self-review |
| `confluence` | 0a, 5 | Page ID resolution, read, update |
| `feishu` | 6 | Post-publish notification |
| `wacli` | 6 | Notification fallback |

All skills in `skills/`. State managed via `run.json` per feature key.

---

## Mandatory Rules

- **Never proceed past a phase gate without explicit user confirmation** when it involves external API calls or publishing.
- **Never publish to Confluence without explicit `APPROVE`.**
- **Never overwrite existing page content outside the `QA Summary` section.**
- **Never delete existing Confluence content within `QA Summary` unless the user explicitly approves.**
- **Never skip a subsection (5.1–5.9)** — use a `[PENDING]` placeholder if data is unavailable.
- **Never assume a Confluence page** — confirm with the user if not stored in `run.json`.
- Raise clarifying questions for ambiguous input. Never assume.

---

## Workspace Integration

- **AGENTS.md Updates:** Following the creation or design update of this agent, the main workspace `AGENTS.md` file MUST be updated to reflect its capabilities, workflow, and interactions with the `defect-analysis` sub-agent.
- **Gap Analysis Review:** Continuous review of the design against existing workflows (e.g. comparing with `REPORTER_AGENT_DESIGN.md` and `REPORTER_ENHANCEMENT_DESIGN.md`) should be conducted to check for unaddressed gaps.

