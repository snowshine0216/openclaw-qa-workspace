# Report Generation Rubric

This rubric governs how the report-generation subagent produces a QA Risk & Defect Analysis Report. Read this file before writing any report section.

## Data Contract

You receive raw facts only — do not fabricate data beyond what is provided:

**Defects** (per entry): `key`, `url`, `title` (summary), `priority`, `status`, `summary`
**PRs** (per entry): `number`, `url`, `title`, `repo`, `risk_level`, `summary`
**Feature metadata**: `feature_key`, `feature_title`, `release_version`

Do not invent defect keys, PR numbers, functional area names, or risk levels that are not derivable from the provided data.

---

## Required Sections (Feature Report)

All 12 sections are required with these exact headings:

### `## 1. Report Header`
- Feature title (from `feature_title`), feature key, release version, report date
- Format: `**Feature Title:** <title>` on its own line

### `## 2. Executive Summary`
Must contain ALL of:
- One sentence describing the feature scope (inferred from defect titles/summaries — not generic)
- A priority breakdown table: columns = Priority | Total | Resolved | Open
- A risk narrative sentence that names specific defect keys (e.g. "BCIN-7669 remains open and blocks the save-as flow")
- A release readiness verdict: **READY** / **NOT READY** / **CONDITIONAL**

### `## 3. Defect Breakdown by Status`
- Table: columns = Status | Count
- List all unique statuses present in the defect data

### `## 4. Risk Analysis by Functional Area`
- Infer functional areas from defect `title`/`summary` text — **do not use generic labels** like "General" or "Miscellaneous"
- Each area must be a domain-specific name (e.g. "Save / Save-As Flows", "Prompt Handling", "i18n / Localization")
- Table: columns = Functional Area | Total | Open | High-Priority Open
- At least one row per distinct area you can infer; collapse only truly unclassifiable defects into "Other"

### `## 5. Defect Analysis by Priority`
- Table: columns = Priority | Total | Open | Blocking keys
- List every open High or Critical defect key explicitly in the Blocking keys column

### `## 6. Code Change Analysis`
- Group PRs by repository
- For each PR: title, risk level, brief synthesis of what changed and why it matters for QA (do not write "See context/prs/")
- Flag high-churn PRs with `⚠️` if they touch files adjacent to open defects
- Risk levels must be **differentiated** — do not assign MEDIUM uniformly; reason from scope, change size, and adjacency to open bugs

### `## 7. Residual Risk Assessment`
- Table: columns = Risk | Severity | Likelihood | Mitigation
- At least one row per open High/Critical defect; name the specific defect key in the Risk column
- Severity and Likelihood must be distinct per row (reason from defect data)

### `## 8. Recommended QA Focus Areas`
- Prioritized list: P0 (must verify), P1 (should verify), P2 (nice to have)
- Each P0 item must map to a specific open defect key or PR
- Use concrete test scenario descriptions, not generic phrases like "test the feature thoroughly"

### `## 9. Test Environment Recommendations`
- Specific environment setup relevant to the feature (locale, browser version, data fixtures, etc.)
- Must reference at least one area from Section 4

### `## 10. Verification Checklist for Release`
- Checkbox list of must-pass items before release
- Each blocking defect from Section 5 must have a corresponding checklist item

### `## 11. Conclusion`
- Final release recommendation with explicit verdict: **HOLD** / **CONDITIONAL GO** / **GO**
- One sentence rationale referencing specific open defect keys if verdict is HOLD or CONDITIONAL

### `## 12. Appendix: Defect Reference List`
- Table: columns = Key | Title | Priority | Status | Assignee
- All defects, sorted: open first, then by priority (Critical > High > Medium > Low)

---

## Required Sections (Release Report)

All sections follow the same 12-section structure with these differences:

- **Section 1**: Release version, scope (feature count, total defects), report date
- **Section 2**: Cross-feature executive summary — identify shared hotspot areas across features, overall risk level, go/no-go recommendation
- **Section 4**: Cross-feature risk table — columns = Feature | Area | Open High | Risk Level; highlight features with HIGH/CRITICAL risk
- **Section 6**: Per-feature code change summary; identify repos that appear in multiple features
- **Section 8**: Release-level QA focus — which features need most attention and why
- **Each feature must include a packet reference link**: `[<feature-key> packet](features/<feature-key>/)`

---

## Quality Bar (All Reports)

These rules are hard requirements — violating any of them is grounds for review failure:

1. Every open High or Critical defect key must appear at least once in the report body (not just the appendix)
2. Functional areas in Section 4 must be domain-specific — "General" is not acceptable as a primary area
3. PR risk levels in Section 6 must not be uniformly MEDIUM — differentiate based on scope and adjacency
4. Executive summary must include a priority breakdown table (not just prose)
5. No filler sentences: do not write phrases like "Review open defects and prioritize testing", "Continue monitoring", or "Address remaining issues"
6. Section 6 must synthesize — do not write "See context/prs/ for details" or equivalent
7. Open defect count in Section 5 must match the actual count from provided data
8. Release report must include per-feature packet references in Section 2 or Section 4
