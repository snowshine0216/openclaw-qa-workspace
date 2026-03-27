# Defect Analysis Skill — Fix Plan

_Session: 2026-03-27_

Comparison baseline: `workspace-reporter/skills/defects-analysis/runs/BCIN-976 copy` and `BCIN-7289 copy`.
Problem runs: `workspace-artifacts/skills/workspace-reporter/defects-analysis/runs/`.

---

## Bug 1 — Feature title is always just the Jira key

**Symptom:** Header, Section 2 narrative, and release roll-up all show `"BCIN-7289"` instead of `"Embed Library Report Editor into the Workstation Report Authoring"`.

**Root cause:** `extract_feature_metadata.mjs → inferFeatureTitle()` looks for `issue.fields.parent.fields.summary` in `jira_raw.json`. The Jira defect query response only includes `parent: { key: "BCIN-7289" }` — no `fields` on the parent node because the query does not request parent field expansion. All branches fall through and the raw key is returned.

**Affected files:** `scripts/phase2.sh`, `scripts/lib/extract_feature_metadata.mjs`

**Fix:**
1. In `phase2.sh`, issue `jira issue view <FEATURE_KEY> --plain` and write the result to `context/feature_jira.json`.
2. In `extract_feature_metadata.mjs`, after failing to find `parent.fields.summary`, read `context/feature_jira.json` and use its `fields.summary` as the feature title.
3. Title propagates to `feature_metadata.json`, `feature_summary.json`, and all report sections automatically.

---

## Bug 2 — Section 4 massively misclassifies defects as "Layout & Positioning"

**Symptom:** 28 of 32 BCIN-7289 defects classified as "Layout & Positioning". Reference report shows 8 distinct meaningful areas.

**Root cause — two-layer problem:**

**Layer 1 (Phase 3):** `phase3.sh → detectArea()` assigns `area` from `fields.components[0].name ?? fields.labels[0] ?? fields.issuetype.name ?? 'General'`. BCIN-7289 defects have no Jira components and no meaningful labels, so every defect gets `area = "General"`.

**Layer 2 (derive_functional_area.mjs):** Because `area = "General"`, `inferFunctionalArea()` falls to regex matching on the defect summary. The `Layout & Positioning` rule contains `/\bsize\b/i` which fires broadly on summaries containing "file size", "text size", etc.

**Key correction:** The regex fallback is not the intended primary classifier. Phase 4 LLM subagents are supposed to classify functional areas from PR content + Jira summaries. The regex is last-resort only.

**Affected files:** `scripts/phase3.sh`, `scripts/phase4.sh`, `scripts/lib/derive_functional_area.mjs`, `scripts/lib/build_feature_summary.mjs`

**Fix (in priority order):**

1. **Phase 4 (primary fix):** PR analysis subagents should also emit `context/functional_area_map.json` mapping each Jira key → LLM-classified functional area from defect summary + PR context. Format: `{ "BCIN-7667": "Save / Save-As Flows", ... }`.
2. **`build_feature_summary.mjs`:** Check `functional_area_map.json` first; only fall back to `inferFunctionalArea()` when a key is absent.
3. **`derive_functional_area.mjs` (fallback tightening):** Remove `/\bsize\b/i` from Layout & Positioning. Move `Save / Save-As Flows` and `Prompt Handling` rules before `Layout & Positioning`. Add `UI / Window State` patterns: `/\bwindow title\b/i`, `/\bconfirm.*close\b/i`, `/\bloading.*forever\b/i`.

---

## Bug 3 — Section 2 Executive Summary is a single mechanical sentence

**Symptom:** Section 2 reads: `"This feature BCIN-7289 introduces Layout & Positioning. 27 of 32 defects are resolved."` — no context, no breakdown, no risk explanation.

**Root cause:** `generate_feature_report.mjs → buildExecutiveNarrative()` is a one-sentence scaffold that was never expanded. It uses only `top_risk_areas[0]` + resolved count.

**Affected file:** `scripts/lib/generate_feature_report.mjs`

**Fix:** Restructure `buildExecutiveNarrative()` to produce:
1. Feature description sentence from `metadata.feature_title` + scope note (repos changed / defect themes).
2. Priority breakdown table (High/Low/Lowest × Done/Open) — data already in `defects` array, not rendered.
3. Open-rate risk statement: `"X of Y defects remain open (Z%). [Risk reasoning based on priority distribution]."`.
4. One sentence identifying the highest-risk open functional area.

All data is already available — this is a rendering-only change.

---

## Bug 4 — Section 6 degrades when PR titles are null

**Symptom:** Section 6 shows bare table rows with `null` titles and no narrative. Reference has per-PR rows with change sizes, risk rationale, and `⚠️` callouts.

**Root cause:** `pr_impact_summary.json` entries sometimes have `"title": null` (e.g., `workstation-report-editor` PRs where GitHub API returned incomplete data). `mergePrEntries()` exhausts all fallbacks and emits `"PR #686"`. `risk_note` is also empty when the `summary` field contains raw markdown.

**Affected file:** `scripts/lib/generate_feature_report.mjs` → `mergePrEntries()`, `buildCodeChangeSectionFromImpactMd()`

**Fix:**
1. When `title === null`, parse the `## PR Title` section from the `_impact.md` file — `parsePrImpactMd` already extracts this.
2. For empty `risk_note`: synthesize from change size + file list in `_impact.md` (e.g. `"+248/-66 across 3 files in ReportSaveAs.js"`).
3. Group PRs by repository with a subsection header per repo.
4. Add `⚠️` callout for PRs with >100 lines changed or whose linked Jira key is still open.

---

## Bug 5 — Release report Section 4 risk analysis is stats-only

**Symptom:** `release_26.04__scope_30da81b1` Section 4 lists features + hotspot areas in a table but no analytical context — no explanation of why a feature is risky or what the open defects actually affect.

**Root cause:** `generate_release_report.mjs → buildRiskAnalysisSection()` only renders `top_risk_areas` (already mis-classified per Bug 2) as a flat table. No per-feature narrative block exists.

**Affected file:** `scripts/lib/generate_release_report.mjs`

**Fix:** After the summary table, add a "Key Risk Notes" subsection:
- HIGH/CRITICAL features: list top 1–2 open High-priority defects with a one-sentence impact description.
- LOW features with 0 open: one-liner confirming cleared.
- Data source: `feature.open_defect_details` already loaded via `normalizeFeature()` — purely a render change.

---

## Priority Order

| Priority | Bug | Effort | Impact |
|----------|-----|--------|--------|
| 🔴 P0 | Bug 1 — Feature title fetch | Medium | Fixes title everywhere |
| 🔴 P0 | Bug 2 (Layer 1) — Phase 4 emits `functional_area_map.json` | Medium | Fixes area classification at source |
| 🔴 P0 | Bug 3 — Section 2 executive narrative | Medium | Biggest visible quality gap |
| 🟡 P1 | Bug 4 — Null PR title handling | Low | Fixes Section 6 |
| 🟡 P1 | Bug 2 (Layer 2) — Tighten regex fallback rules | Low | Safety net for unclassified defects |
| 🟢 P2 | Bug 5 — Release Section 4 narrative | Low | Removes stats-only complaint |

---

## Files Affected

| File | Bugs |
|------|------|
| `scripts/phase2.sh` | Bug 1 |
| `scripts/phase4.sh` | Bug 2 (emit functional_area_map.json) |
| `scripts/lib/extract_feature_metadata.mjs` | Bug 1 |
| `scripts/lib/derive_functional_area.mjs` | Bug 2 (Layer 2) |
| `scripts/lib/build_feature_summary.mjs` | Bug 2 (consume map) |
| `scripts/lib/generate_feature_report.mjs` | Bug 3, Bug 4 |
| `scripts/lib/generate_release_report.mjs` | Bug 5 |
