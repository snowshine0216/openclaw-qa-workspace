# Review: QA_SUMMARY_SKILL_DESIGN.md — Self-Coherence & Self-Efficacy

**Reviewed:** 2026-03-16  
**Design ID:** `qa-summary-skill-redesign-2026-03-16`  
**Design doc:** `workspace-reporter/docs/QA_SUMMARY_SKILL_DESIGN.md`  
**Focus:** Self-coherence (internal consistency) and self-efficacy (implementability without external gaps)

---

## Summary

The design is largely coherent and implementable. Schemas, phase contracts, and functional stubs are well specified. Remaining gaps center on: (1) status-transition vs schema alignment, (2) orchestrator resume behavior when `awaiting_approval`, (3) `qa-summary-review` output contract vs current SKILL.md, (4) spawn manifest path resolution, and (5) a few minor clarifications.

---

## Self-Coherence

### Strengths

- **Phase flow:** Phases 0–6, workflow chart, and status transitions are internally consistent.
- **Section model:** Section 1 = planner-owned, sections 2–10 = reporter-owned; consistent across summary-formatting, qa-summary-review integration, and buildSummaryDraft.
- **Path conventions:** Run root `runs/<feature-key>/`, planner root, defects root, and review output paths align across sections.
- **Shared vs local:** Confluence/Feishu remain shared; defects-analysis and qa-summary-review remain reporter-local; no duplication.

### Inconsistencies

#### 1. Status transitions vs `task.json.overall_status`

The status transition table (lines 98–113) uses:

- `context_ready`
- `analysis_in_progress`
- `draft_ready`

These are **not** in the allowed `overall_status` values (lines 551–560):

- `not_started`, `in_progress`, `blocked`, `review_in_progress`, `awaiting_approval`, `approved`, `completed`, `failed`

**Recommendation:** Either (a) add `context_ready`, `analysis_in_progress`, `draft_ready` to the schema and ensure phases persist them, or (b) state explicitly that these are conceptual workflow states and that `current_phase` + `overall_status` are the persisted representation (e.g. `context_ready` ≈ `current_phase=phase2`, `overall_status=in_progress`).

#### 2. Automated Resume Policy vs `selected_mode`

The Automated Resume Policy maps:

- `FRESH` -> `proceed`

The `selected_mode` values include `proceed` but the REPORT_STATE table uses `proceed` only for FRESH. The Resume Flow says "`FRESH` -> continue with `selected_mode = proceed`". This is consistent. However, the policy says "`FRESH` -> `proceed`" while the REPORT_STATE table says "continue with `selected_mode = proceed`" — the term `proceed` is used for both the mode and the implied action. Minor: ensure the design consistently uses `proceed` as the `selected_mode` value for FRESH.

#### 3. `qa-summary-review` section checklist vs reporter draft scope

`qa-summary-review` SKILL.md (C1) checks for "1. Feature Overview" through "10. Automation Coverage" and states "reporter draft contains sections **2–10** (section 1 is planner-owned and may be merged separately)".

The design says `buildSummaryDraft` produces sections 2–10 only. So the draft under review does **not** include section 1. The reviewer checklist listing "1. Feature Overview" can imply either:

- (a) Section 1 is optional in the draft (if merged from planner before review), or  
- (b) The reviewer should only enforce sections 2–10.

**Recommendation:** Clarify in section 3.7 that when the draft is reviewed, it contains sections 2–10 only; section 1 is merged at publish time. The reviewer should not require section 1 in the draft. Align qa-summary-review SKILL.md to state "check sections 2–10; section 1 is merged at publish and not part of the draft under review."

#### 4. Phase 4 spawn manifest path

The `phase4_spawn_manifest.json` schema (lines 614–615) uses:

```json
"--draft", "runs/BCIN-7289/drafts/BCIN-7289_QA_SUMMARY_DRAFT.md"
```

`spawn_from_manifest.mjs` is invoked with `--cwd "$run_dir"` where `run_dir` = `runs/<feature-key>/`. A path `runs/BCIN-7289/drafts/...` would be resolved relative to run_dir, yielding `runs/BCIN-7289/runs/BCIN-7289/drafts/...` — incorrect.

**Recommendation:** Use paths relative to run_dir. For example: `runs/<feature-key>/drafts/<feature-key>_QA_SUMMARY_DRAFT.md` when cwd is project root, or `drafts/<feature-key>_QA_SUMMARY_DRAFT.md` when cwd is run_dir. Specify the spawn convention explicitly.

---

## Self-Efficacy

### Strengths

- **Schemas:** `defect_summary.json`, `no_defects.json`, `review_result.json`, spawn manifests, `run.json.notification_pending` are defined.
- **Exact content:** SKILL.md, reference.md, config, and all `references/*.md` are specified.
- **Phase contracts:** Each phase has entry, work, outputs, and user interaction.
- **Implementation stubs:** Scripts and lib modules have concrete logic.
- **Extraction rules:** `buildDefectSummary` extraction rules (lines 1178–1182) specify sources and dedupe behavior.
- **Test stubs:** Test files and scenarios are defined.
- **Implementation checklist:** Covers major artifacts.

### Gaps

#### 1. Orchestrator resume when `awaiting_approval`

`resolveResumePhase` returns `4` when `overall_status === 'awaiting_approval'`. The orchestrator would then run `phase4.sh`. The phase4 implementation always emits a spawn manifest on the first run (no `--post`). When resuming from `awaiting_approval`, we must **not** spawn again — we must render the draft and wait for user approval.

**Recommendation:** Add to the phase4 contract or orchestrate.sh logic: when `task.json.overall_status === 'awaiting_approval'`, phase4 must skip spawn, render the reviewed draft, print "Awaiting APPROVE or revision feedback", and return exit code 2 (blocked). The design’s phase4 implementation should include this branch.

#### 2. `qa-summary-review` must produce `review_result.json`

Section 3.7 requires qa-summary-review to write `context/review_result.json`. The current `qa-summary-review/SKILL.md` only specifies output to `_QA_SUMMARY_REVIEW.md`. The design correctly states "Required SKILL.md changes for qa-summary-review" and "The skill must write both...".

**Recommendation:** Add to the Implementation Checklist: "Update `workspace-reporter/skills/qa-summary-review/SKILL.md` to require production of `context/review_result.json` per schema in section 3.3."

#### 3. `defect_context_state.json` schema

Phase 2 writes `defect_context_state.json` from `classifyDefectContext`. The design references `state.kind` (`defect_final_exists`, `no_defect_artifacts`) and `state.userChoice` but does not define the schema for `defect_context_state.json`.

**Recommendation:** Add a `defect_context_state.json` schema to `references/planner-and-defects.md` or `references/runtime-and-state.md`.

#### 4. `check_resume.sh` implementation

The design shows `detectReportState` as JavaScript, but the script path is `check_resume.sh`. The function uses `featureKey` in paths; the signature only has `runDir`. `featureKey` can be derived from the last path component of `runDir` (`runs/<feature-key>/`).

**Recommendation:** Clarify that `check_resume.sh` invokes a Node helper (e.g. `scripts/lib/detectReportState.mjs`) or inline `node -e`. Add `detectReportState.mjs` to the lib/ folder structure if it is a separate module.

#### 5. Phase 6 final artifact source

Phase 6 implementation (lines 1370–1382) copies from `drafts/<feature-key>_QA_SUMMARY_DRAFT.md` to `<feature-key>_QA_SUMMARY_FINAL.md`. After Phase 4, the draft may have been updated by the review refactor loop. The design should confirm that the **reviewed** draft (with auto-fixes applied) is the source for the final, not the pre-review draft.

**Recommendation:** State explicitly: "Phase 6 copies the reviewed draft (post–Phase 4 auto-fixes) to the final artifact path."

---

## Alignment with qa-summary-review

| Aspect | Design | qa-summary-review SKILL.md | Aligned? |
|--------|--------|----------------------------|----------|
| Draft path | `runs/<feature-key>/drafts/<feature-key>_QA_SUMMARY_DRAFT.md` | Same | ✓ |
| Defect report path | `<defects_run_root>/<feature-key>/<feature-key>_REPORT_FINAL.md` | Same | ✓ |
| Review output | `runs/<feature-key>/<feature-key>_QA_SUMMARY_REVIEW.md` | Same | ✓ |
| `review_result.json` | Required in design | Not mentioned | ✗ |
| Section 1 | Planner-owned | "may be merged separately" | ✓ |
| Sections 2–10 | Reporter-owned | Checked | ✓ |
| No return to Phase 2 | Phase 4 owns loop | "Do NOT return to Phase 2" | ✓ |

---

## Recommendations

| Priority | Action |
|----------|--------|
| P0 | Add phase4 branch: when `overall_status === 'awaiting_approval'`, render draft and block instead of spawning. |
| P0 | Add Implementation Checklist item: update qa-summary-review SKILL.md to produce `review_result.json`. |
| P1 | Align status transitions with schema: document whether `context_ready`, `analysis_in_progress`, `draft_ready` are persisted or derived. |
| P1 | Specify spawn manifest path convention (relative to run_dir or project root). |
| P1 | Add `defect_context_state.json` schema. |
| P2 | Clarify Phase 6 copies the reviewed draft (post–Phase 4). |
| P2 | Clarify check_resume.sh invocation (shell wrapper → Node helper). |
| P2 | Clarify qa-summary-review checks sections 2–10 only; section 1 is merged at publish. |

---

## Verdict

- **Self-coherence:** Mostly coherent. Main issues: status-transition vs schema alignment, phase4 spawn manifest path, and section-1 scope in review.
- **Self-efficacy:** Mostly sufficient. Main gaps: phase4 resume behavior when `awaiting_approval`, qa-summary-review `review_result.json` contract, and `defect_context_state.json` schema.

The design is implementable after addressing the P0 items. P1 items improve clarity and reduce implementation risk.
