# Review: QA_SUMMARY_SKILL_DESIGN.md — Self-Sufficiency & Coherence

**Reviewed:** 2026-03-16  
**Design ID:** `qa-summary-skill-redesign-2026-03-16`  
**Design doc:** `workspace-reporter/docs/QA_SUMMARY_SKILL_DESIGN.md`  
**Focus:** Self-sufficiency (implementability without external gaps) and coherence (internal consistency)  
**Status:** All P1/P2 recommendations addressed in design and qa-summary-review SKILL.md (2026-03-16)

---

## Executive Summary

The design is **self-sufficient and coherent**. Schemas, phase contracts, extraction rules, and implementation stubs are well specified. All review recommendations have been applied: merge deduplication, notify path resolution, and qa-summary-review C1/F2 clarifications.

---

## Self-Sufficiency Assessment

### Strengths

| Aspect | Evidence |
|--------|----------|
| **Schemas** | `defect_summary.json`, `no_defects.json`, `defect_context_state.json`, `review_result.json`, `phase2/phase4_spawn_manifest.json`, `run.json.notification_pending`, `feature_overview_source.json` are defined in references. |
| **Exact content** | SKILL.md, reference.md, config, and all `references/*.md` have exact content specified. |
| **Phase contracts** | Each phase has entry, work, outputs, and user interaction. |
| **Extraction rules** | `buildDefectSummary` extraction rules (lines 1178–1182) specify sources: `_REPORT_FINAL.md`, `jira_raw.json`, `context/prs/*`, planner seed; dedupe by PR URL; feature PRs from feature comments or planner/QA context. |
| **Implementation stubs** | Scripts and lib modules have concrete logic (phase0–6, orchestrate, resolveResumePhase, detectReportState, buildFeatureOverviewTable, buildDefectSummary, buildSummaryDraft, mergeConfluenceMarkdown, etc.). |
| **Test stubs** | Per-script test files and scenarios defined; smoke commands provided. |
| **Implementation checklist** | Covers all major artifacts including qa-summary-review SKILL.md update. |
| **Resume flow** | `resolveResumePhase.mjs` and phase4 implementation handle `awaiting_approval` (render draft, block; no respawn). |
| **planner_plan_resolved_path** | Phase 1 calls `persistPlannerResolution` to update `task.json`. |
| **check_runtime_env** | Design explicitly says "Copy" into skill; do not call shared examples at runtime. |
| **qa-summary-review** | Current `qa-summary-review/SKILL.md` already requires `context/review_result.json` per schema. |

### Gaps (Addressed)

1. ~~**Merge deduplication for `create_new`**~~ **Fixed.** `publish-and-notification.md` and `mergeConfluenceMarkdown.mjs` now specify: when planner contains `## 📊 QA Summary`, replace that block with the reporter summary (do not concatenate). Test added for deduplication.

2. ~~**`notify_feishu.sh` path**~~ **Fixed.** Notification contract and script implementation now document path resolution: `$CODEX_HOME/skills/feishu-notify` or `.agents/skills/feishu-notify` fallback.

---

## Coherence Assessment

### Strengths

| Aspect | Evidence |
|--------|----------|
| **Phase flow** | Phases 0–6, workflow chart, and status transitions align. |
| **Status vs schema** | Design explicitly states (lines 114, 576): `context_ready`, `analysis_in_progress`, `draft_ready` are derived (log-only), not persisted in `overall_status`. |
| **Section model** | Section 1 = planner-sourced, sections 2–10 = reporter-generated; consistent across summary-formatting, buildSummaryDraft, and qa-summary-review. |
| **Path conventions** | Run root `runs/<feature-key>/`, planner root, defects root, review output paths align. |
| **Spawn manifest paths** | Phase 4 uses run-dir-relative `drafts/<feature-key>_QA_SUMMARY_DRAFT.md`; spawn invoked with `--cwd run_dir`. |
| **Phase 4 awaiting_approval** | Implementation branches: when `overall_status === 'awaiting_approval'`, render draft and block; no spawn. |
| **Phase 6 source** | Comment states: "Phase 4 auto-fixes are applied in-place to drafts/... Copying from drafts guarantees final output is the reviewed draft." |
| **Shared vs local** | Confluence/Feishu shared; defects-analysis and qa-summary-review reporter-local; no duplication. |

### Inconsistencies (Addressed)

1. ~~**qa-summary-review C1 vs design**~~ **Fixed.** qa-summary-review C1 now states: "All 10 sections present"; section 1 is planner-sourced but materialized in the draft; reviewer verifies presence. Design section 3.7 documents the required C1/F2 wording.

2. ~~**F2 subsection numbering**~~ **Fixed.** qa-summary-review F2 now requires `### 1.` through `### 10.` numbering; draft is self-contained with 10 sections.

---

## Alignment Matrix

| Component | Design | qa-summary-review | Aligned? |
|-----------|--------|-------------------|----------|
| Draft path | `drafts/<feature-key>_QA_SUMMARY_DRAFT.md` | Same | ✓ |
| Defect report path | `<defects_run_root>/<feature-key>/_REPORT_FINAL.md` | Same | ✓ |
| Review output | `<feature-key>_QA_SUMMARY_REVIEW.md` | Same | ✓ |
| `review_result.json` | Required | Required (lines 188–206) | ✓ |
| Section 1 in draft | Yes (Phase 3 renders 1–10) | C1 checks section 1 | ✓ |
| Sections 2–10 | Reporter-owned | Checked | ✓ |
| No return to Phase 2 | Phase 4 owns loop | "Do NOT return to Phase 2" | ✓ |
| F2 numbering | 1–10 in draft | 1–10 (fixed) | ✓ |

---

## Recommendations (All Applied)

| Priority | Action | Status |
|----------|--------|--------|
| P1 | Add to `mergeConfluenceMarkdown.mjs` spec: when planner contains `## 📊 QA Summary`, replace that block with reporter summary (do not concatenate). | ✓ Done |
| P1 | Document `notify_feishu.sh` invocation path (shared skill resolution). | ✓ Done |
| P2 | Clarify qa-summary-review C1: section 1 is planner-sourced but materialized in the draft; reviewer verifies presence. | ✓ Done |
| P2 | Update qa-summary-review F2 to "1 through 10" when draft includes section 1. | ✓ Done |

---

## Verdict

- **Self-sufficiency:** Sufficient. All major schemas, extraction rules, phase logic, and resume behavior are specified. Merge deduplication and notify path documented.
- **Coherence:** Coherent. Phases, status, paths, and qa-summary-review integration align. C1/F2 wording updated in qa-summary-review.

**The design is implementable.** All review recommendations have been applied.
