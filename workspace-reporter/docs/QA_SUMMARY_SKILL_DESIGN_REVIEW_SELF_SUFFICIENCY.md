# Review: QA_SUMMARY_SKILL_DESIGN.md — Self-Sufficiency & Self-Coherence

**Reviewed:** 2026-03-16  
**Design ID:** `qa-summary-skill-redesign-2026-03-16`  
**Design doc:** `workspace-reporter/docs/QA_SUMMARY_SKILL_DESIGN.md`  
**Focus:** Self-sufficiency and self-coherence

---

## Summary

The design is largely self-sufficient and internally coherent. Schemas for `defect_summary.json`, `review_result.json`, and spawn manifests are present. Section naming and Phase 4 behavior align with `qa-summary-review`. Remaining gaps center on extraction logic, the `review_result.json` contract for `qa-summary-review`, and a few clarifications.

---

## Self-Sufficiency

### Strengths

- **Schemas present:** `defect_summary.json`, `no_defects.json`, `review_result.json`, `phase2_spawn_manifest.json`, `phase4_spawn_manifest.json`, and `run.json.notification_pending` are defined in the design.
- **Exact content:** SKILL.md, reference.md, config, and all `references/*.md` are specified.
- **Phase contracts:** Each phase has entry, work, outputs, and user interaction.
- **Implementation stubs:** Scripts and lib modules have concrete logic.
- **Test stubs:** Test files and scenarios are defined.
- **Implementation checklist:** Covers all major artifacts.

### Gaps

1. **`buildDefectSummary` extraction logic**

   Phase 2 calls `buildDefectSummary(defectsRunDir, featureKey)` to produce `defect_summary.json`, but the design does not specify how to derive it from defects-analysis output (`_REPORT_FINAL.md`, `jira_raw.json`, `context/prs/`). The schema is defined; the extraction rules are not.

2. **`review_result.json` vs qa-summary-review**

   The design expects `qa-summary-review` to write `context/review_result.json` with `verdict`, `requiresRefactor`, etc. The current `qa-summary-review` SKILL.md only specifies output to `_QA_SUMMARY_REVIEW.md`. Section 3.7 should explicitly require `qa-summary-review` to produce `review_result.json` and define its contract.

3. **`check_runtime_env` source**

   Functional Design 4 shows `check_runtime_env.sh` calling `.agents/skills/openclaw-agent-design/examples/check_runtime_env.sh`, while the checklist says to "Copy" it. Clarify whether the skill should copy these scripts into the skill or call the shared examples.

4. **Orchestrator resume flow**

   When the orchestrator returns 2 (blocked) at the approval gate, the next run starts from phase 0. It is not specified how phases detect "already done" and skip or resume (e.g. `awaiting_approval` → skip phases 0–4 and go to phase 5).

5. **`task.json.planner_plan_resolved_path`**

   The schema includes `planner_plan_resolved_path`, but no phase is explicitly responsible for setting it. Phase 1 writes `planner_artifact_lookup.json`; either Phase 1 should update `task.json` or the schema should state this field is optional/derived.

---

## Self-Coherence

### Internal consistency

- Phases 0–6, status transitions, and folder layout are consistent.
- Section naming is consistent: Section 1 = "Feature Overview", Section 2 = "Code Changes Summary".
- `qa-summary-review` integration (3.7) matches Phase 4 behavior and the "no return to Phase 2" rule.

### Alignment with qa-summary-review

- **Section names:** Design and `qa-summary-review` both use "Feature Overview" and "Code Changes Summary".
- **Paths:** Design and `qa-summary-review` both use `<skill-root>/runs/<feature-key>/` and `<defects_run_root>/<feature-key>/`.
- **Phase 4 loop:** Design and `qa-summary-review` both say "do not return to Phase 2" and "Phase 4 applies fixes and re-invokes".

### Minor inconsistencies

1. **Planner lookup order**

   `planner-and-defects.md` lists three lookup steps, with step 2 as "metadata companion" (optional). The `resolvePlannerArtifact.mjs` stub only checks `plannerPlanPath` and `qa_plan_final.md`. Clarify that the metadata companion is optional enrichment, not part of the plan path resolution.

2. **Merge logic for create_new**

   `mergeConfluenceMarkdown` for `create_new` does `planner + summary`. If the planner already contains `## 📊 QA Summary` and `### 1. Feature Overview`, concatenation could duplicate the heading. Specify whether the planner is assumed to exclude the QA Summary block or how deduplication works.

3. **Phase script language**

   Phase implementations are shown in JavaScript, but paths use `.sh`. Clarify that phase scripts are shell wrappers that invoke Node modules (e.g. `phase0.sh` → `node scripts/phase0.mjs`).

---

## Recommendations

| Priority | Action |
|----------|--------|
| P0 | Add extraction rules for `buildDefectSummary` (how to derive `defect_summary.json` from defects-analysis artifacts). |
| P0 | Extend section 3.7 to require `qa-summary-review` to produce `review_result.json` and update its SKILL.md accordingly. |
| P1 | Clarify `check_runtime_env`: copy into skill vs call shared examples. |
| P1 | Document orchestrator resume behavior (how phases skip when resuming from `awaiting_approval`). |
| P2 | Clarify planner lookup order (metadata companion as optional enrichment). |
| P2 | Specify merge logic for `create_new` when planner already has QA Summary content. |
| P2 | State that phase `.sh` scripts invoke Node modules. |

---

## Verdict

- **Self-sufficiency:** Mostly sufficient. Main gaps are `buildDefectSummary` extraction logic and the `review_result.json` contract for `qa-summary-review`.
- **Self-coherence:** Coherent. Section naming, paths, and Phase 4 behavior are consistent with `qa-summary-review`.

The design is implementable after addressing the P0 items above.
