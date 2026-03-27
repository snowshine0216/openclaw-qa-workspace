# Defect Analysis Skill — Fix Plan

_Last updated: 2026-03-27_

This document consolidates all identified bugs and fix plans for the `defects-analysis` skill.
Issues are grouped by discovery round. Each entry has a root cause, affected files, and a concrete fix.

---


## Round 2 — Report content thinness vs reference quality (workspace-artifacts runs)

Comparison baseline: `workspace-reporter/skills/defects-analysis/runs/BCIN-976 copy` and `BCIN-7289 copy`.
Problem runs: `workspace-artifacts/skills/workspace-reporter/defects-analysis/runs/`.

---

### Bug R2-A — Feature title is always just the Jira key (e.g. `"BCIN-7289"` not the real title)

**Symptom:** Header, Section 2 narrative, and release roll-up all show `"BCIN-7289"` as the feature title instead of `"Embed Library Report Editor into the Workstation Report Authoring"`.

**Root cause:** `extract_feature_metadata.mjs → inferFeatureTitle()` looks for `issue.fields.parent.fields.summary` in `jira_raw.json`. But the Jira defect query response only includes `parent: { key: "BCIN-7289" }` — no `fields` object on the parent node, because the query does not request parent field expansion.

`inferFeatureTitle()` falls through all branches and returns the raw key.

**Affected files:** `scripts/phase2.sh` (Jira fetch), `scripts/lib/extract_feature_metadata.mjs`

**Fix:**
1. In `phase2.sh` (or a dedicated phase 0/1 step), issue `jira issue view <FEATURE_KEY> --plain` and write the result to `context/feature_jira.json`.
2. In `extract_feature_metadata.mjs`, after failing to find `parent.fields.summary`, read `context/feature_jira.json` and use its `fields.summary` as the feature title.
3. This title then propagates to `feature_metadata.json`, `feature_summary.json`, and all report sections automatically.

---

### Bug R2-B — Section 4 (Functional Area) massively misclassifies defects as "Layout & Positioning"

**Symptom:** 28 of 32 BCIN-7289 defects classified as "Layout & Positioning". Reference report shows 8 distinct areas.

**Root cause — two-layer problem:**

**Layer 1 (Phase 3):** `phase3.sh → detectArea()` assigns `area` from `fields.components[0].name ?? fields.labels[0] ?? fields.issuetype.name ?? 'General'`. Since BCIN-7289 defects have no Jira components and no meaningful labels, every defect gets `area = "General"`.

**Layer 2 (derive_functional_area.mjs):** Because `area = "General"`, `inferFunctionalArea()` falls through to regex matching on the defect summary. The `Layout & Positioning` rule contains `/\bsize\b/i` which is too broad and fires on summaries containing "file size", "text size", "screen size", etc. Rule ordering also means Layout fires before more specific rules like Save/Prompt.

**However — the regex fallback is not the intended primary classifier.** Phase 4 LLM subagents are supposed to classify functional areas from PR content + Jira summaries and write them back. The regex is a last-resort fallback that should rarely fire.

**Affected files:** `scripts/phase3.sh`, `scripts/phase4.sh`, `scripts/lib/derive_functional_area.mjs`, `scripts/lib/build_feature_summary.mjs`

**Fix (in priority order):**

1. **Phase 4 enrichment (primary fix):** Phase 4 PR analysis subagents already read Jira summaries and PR diffs. They should also emit a `functional_area_map.json` at `context/functional_area_map.json` mapping each Jira key → classified functional area (LLM-classified from defect summary + PR context). Format: `{ "BCIN-7667": "Save / Save-As Flows", ... }`.

2. **`build_feature_summary.mjs` (consume enrichment):** When reading defects, check `functional_area_map.json` first; use mapped area if present. Only fall back to `inferFunctionalArea()` when key is absent from the map.

3. **`derive_functional_area.mjs` (fallback tightening — safety net):**
   - Remove `/\bsize\b/i` from Layout & Positioning (too broad).
   - Move `Save / Save-As Flows` and `Prompt Handling` rules before `Layout & Positioning` in the ordered list (more specific signals should win).
   - Add missing patterns: `UI / Window State` → `/\bwindow title\b/i`, `/\bconfirm.*close\b/i`, `/\bloading.*forever\b/i`.

---

### Bug R2-C — Section 2 Executive Summary is a single mechanical sentence

**Symptom:** Section 2 reads: `"This feature BCIN-7289 introduces Layout & Positioning. 27 of 32 defects are resolved."` — no context, no breakdown, no risk explanation.

**Root cause:** `generate_feature_report.mjs → buildExecutiveNarrative()` is hardcoded to produce one sentence from `top_risk_areas[0]` + resolved count. This was a scaffold that was never expanded. The reference report has a full paragraph (feature description + priority breakdown table + open-rate risk rating).

**Affected file:** `scripts/lib/generate_feature_report.mjs`

**Fix:** Restructure `buildExecutiveNarrative()` to produce:
1. Feature description sentence (from `metadata.feature_title` + optionally a scope note derived from repos changed / defect themes).
2. Priority breakdown table (High/Low/Lowest × Done/Open) — data already available in `defects` array, just not rendered.
3. Open-rate risk statement: `"X of Y defects remain open (Z%). [Risk reasoning based on priority distribution]."`.
4. One sentence identifying the highest-risk open functional area.

All data is already in `summary` and `defects` — this is purely a rendering change.

---

### Bug R2-D — Section 6 (Code Change Analysis) degrades when PR titles are null

**Symptom:** Section 6 shows bare table rows with `null` titles and no narrative. Reference report has per-PR rows with change sizes, risk rationale, and `⚠️` callouts.

**Root cause:** `pr_impact_summary.json` entries sometimes have `"title": null` (e.g., `workstation-report-editor` PRs where GitHub API returned incomplete data). `mergePrEntries()` falls back to `entry.title ?? parsed.title ?? ...` but if all sources are null it emits `"PR #686"` as the title. `risk_note` is also often empty when the `summary` field in the JSON contains raw markdown instead of a synthesized sentence.

**Affected file:** `scripts/lib/generate_feature_report.mjs` → `mergePrEntries()`, `buildCodeChangeSectionFromImpactMd()`

**Fix:**
1. When `title === null`, parse the PR impact `.md` file header (`## PR Title` section) as the fallback — `parsePrImpactMd` already extracts this.
2. For `risk_note`: if empty, synthesize from `parsed.changed_files` count + line delta (available in `_impact.md` change size line) — e.g. `"+248/-66 across 3 files in ReportSaveAs.js"`.
3. Group PRs by repository and emit a per-repo subsection header.
4. Add `⚠️` callout for PRs with >100 lines changed or whose linked Jira key is still open.

---

### Bug R2-E — Release report Section 4 risk analysis is stats-only, no narrative

**Symptom:** `release_26.04__scope_30da81b1` Section 4 lists features with hotspot areas in a table but provides zero analytical context — no explanation of *why* a feature is risky or what the open defects actually affect.

**Root cause:** `generate_release_report.mjs → buildRiskAnalysisSection()` only pulls `top_risk_areas` from `feature_summary.json` (already mis-classified, per R2-B) and renders a flat table. No per-feature narrative block exists.

**Affected file:** `scripts/lib/generate_release_report.mjs`

**Fix:**
After the summary table, add a "Key Risk Notes" subsection:
- For each HIGH/CRITICAL feature: list the top 1–2 open High-priority defects with a one-sentence impact description (from defect summary).
- For LOW features with 0 open: one-liner confirming cleared.
- Data source: `feature.open_defect_details` already loaded via `normalizeFeature()` — purely a render change.

---

## Priority Order

| Priority | Bug | Effort | Impact |
|----------|-----|--------|--------|
| 🔴 P0 | R2-A — Feature title fetch | Medium | Fixes title propagation everywhere |
| 🔴 P0 | R2-B (Layer 1) — Phase 4 emits `functional_area_map.json` | Medium | Fixes area classification at source |
| 🔴 P0 | R2-C — Section 2 executive narrative | Medium | Biggest visible quality gap |
| 🟡 P1 | R1-A — Linked defect extraction | Medium | Fixes missed defects (BCIN-150 class) |
| 🟡 P1 | R1-B — ADF strip in `derive_functional_area` | Low | Fixes false Image Handling classification |
| 🟡 P1 | R2-D — Section 6 null PR title handling | Low | Fixes code change section |
| 🟡 P1 | R2-B (Layer 2) — Tighten regex fallback rules | Low | Safety net for unclassified defects |
| 🟢 P2 | R1-C — Sections 7–10 dynamic content | Medium | Removes boilerplate feel |
| 🟢 P2 | R1-C (sub) — Aggregation: open high count only | Low | Fixes misleading stats |
| 🟢 P2 | R2-E — Release Section 4 narrative | Low | Removes stats-only complaint |

---

## Files Affected Summary

| File | Bugs |
|------|------|
| `scripts/phase2.sh` | R1-A, R2-A |
| `scripts/phase3.sh` | R2-B (Layer 1) |
| `scripts/phase4.sh` | R2-B (Layer 1 — emit functional_area_map.json) |
| `scripts/lib/extract_feature_metadata.mjs` | R2-A |
| `scripts/lib/derive_functional_area.mjs` | R1-B, R2-B (Layer 2) |
| `scripts/lib/build_feature_summary.mjs` | R1-C (aggregation), R2-B (consume map) |
| `scripts/lib/generate_feature_report.mjs` | R1-C (sections 7–10), R2-C, R2-D |
| `scripts/lib/generate_release_report.mjs` | R2-E |
