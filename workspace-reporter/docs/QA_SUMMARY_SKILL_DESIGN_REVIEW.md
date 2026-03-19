# Review: QA_SUMMARY_SKILL_DESIGN.md

**Reviewed:** 2026-03-16  
**Design ID:** `qa-summary-skill-redesign-2026-03-16`  
**Design doc:** `workspace-reporter/docs/QA_SUMMARY_SKILL_DESIGN.md`

---

## Summary

The design is largely coherent and implementable, but has several gaps and inconsistencies that should be addressed before implementation.

---

## Self-Sufficiency

### Strengths

- Clear workflow (Phases 0–6), state transitions, and folder layout
- Explicit input/output contracts and phase responsibilities
- Concrete script paths, config, and reference content
- Test stubs and evals defined
- Implementation checklist is detailed

### Gaps

1. **`defect_summary.json` / `no_defects.json` schema**

   `buildSummaryDraft` and Phase 2 assume a defect summary structure, but the design does not define it. Add a schema, e.g.:

   ```json
   {
     "totalDefects": 0,
     "openDefects": 0,
     "resolvedDefects": 0,
     "noDefectsFound": true,
     "defects": [],
     "prs": []
   }
   ```

   and document how it maps to each summary section.

2. **Phase 4 spawn manifest format**

   Phase 4 emits `phase4_spawn_manifest.json` for `qa-summary-review`, but the manifest schema is not specified. The design should define the manifest format (e.g. `{ "requests": [{ "openclaw": { "args": [...] } }] }`) and how the orchestrator invokes the review subagent.

3. **`review_result.json` schema**

   Phase 4 expects `context/review_result.json` with a `verdict` field. The design should define the full schema (e.g. `verdict`, `autoFixesApplied`, `warnings`) and how it is produced by `qa-summary-review`.

4. **`FRESH` → `selected_mode` mapping**

   The Automated Resume Policy says `FRESH` → `proceed`, but `selected_mode` only lists `use_existing`, `resume`, `generate_from_cache`, `smart_refresh`, `full_regenerate`. Either add `proceed` or document that `FRESH` maps to one of these (e.g. `resume`).

5. **`check_runtime_env` canonical source**

   The design says to copy from "canonical OpenClaw design examples" but does not give the exact path. The implementation uses `.agents/skills/openclaw-agent-design/examples/check_runtime_env.sh`. Add this path to the design.

6. **Validation command**

   `publish-and-notification.md` uses `node --test workspace-reporter/skills/qa-summary/scripts/test/*.test.js`. Node's test runner may not expand globs. Prefer a concrete command, e.g. `node --test workspace-reporter/skills/qa-summary/scripts/test/` or a list of test files.

---

## Coherence

### Section naming mismatch

There is a conflict between the design and `qa-summary-review`:

| Source | Section 2 name |
|--------|----------------|
| Design `summary-formatting.md` | `### 2. Code Changes Summary` |
| Design test stub (`buildSummaryDraft.test.js`) | `### 2. Defects Code Changes` |
| `qa-summary-review` SKILL.md | `### 2. Defects Code Changes` |

The design's formatting spec uses "Code Changes Summary", but the test and the review skill use "Defects Code Changes". Pick one and align all three.

### Section 1 ownership

- Design: Section 1 is "Feature Overview" (planner-owned).
- `qa-summary-review`: Section 1 is "Code Changes" (plan's contribution).

These differ. The design should either:

- Align with the review skill (e.g. "Code Changes" as section 1), or
- Explicitly state that `qa-summary-review` will be updated to "Feature Overview" and adjust its SKILL.md accordingly.

### Path migration for `qa-summary-review`

The design moves artifacts from `projects/qa-summaries/<KEY>/` to `workspace-reporter/skills/qa-summary/runs/<feature-key>/`, but `qa-summary-review` still references:

- Input: `projects/qa-summaries/<KEY>/<KEY>_QA_SUMMARY_DRAFT.md`
- Input: `projects/defects-analysis/<KEY>/<KEY>_REPORT_FINAL.md`
- Output: `projects/qa-summaries/<KEY>/<KEY>_QA_SUMMARY_REVIEW.md`

The design mentions updating path resolution but does not spell out the new paths. Add a small "qa-summary-review path updates" section, e.g.:

- Draft: `<skill-root>/runs/<feature-key>/drafts/<feature-key>_QA_SUMMARY_DRAFT.md`
- Defect report: `<defects_run_root>/<feature-key>/<feature-key>_REPORT_FINAL.md`
- Review output: `<skill-root>/runs/<feature-key>/<feature-key>_QA_SUMMARY_REVIEW.md`

### Defect-analysis artifact path

Phase 2 uses `join(defectsRunDir, \`${featureKey}_REPORT_FINAL.md\`)`. `defects-analysis` uses `runs/<run-key>/<run-key>_REPORT_FINAL.md`. For feature-scoped runs, `run_key` equals `feature_key`, so this is consistent. The design should state that assumption explicitly.

### Phase 4 flow vs. `qa-summary-review` behavior

- Design: Phase 4 runs `qa-summary-review`, refactors on non-pass, and loops until pass.
- `qa-summary-review`: On FAIL, it says "Return to Phase 2" (draft generation).

The design's Phase 4 refactor loop is different from the review skill's "return to Phase 2". Clarify whether:

- Phase 4 applies auto-fixes and re-runs the review (no Phase 2), or
- On certain failures, the workflow returns to Phase 2/3.

---

## Minor issues

1. **`notify_feishu.sh` implementation**

   The design shows `persist_notification_pending` but does not define how `run.json.notification_pending` is written or its schema.

2. **`buildSummaryDraft` Feature Overview**

   The design says the reporter draft owns sections 2–10 and section 1 is planner-owned. `summary-formatting.md` still lists "### 1. Feature Overview" in the required structure. Clarify whether section 1 is always from the planner or whether `buildSummaryDraft` can generate it when the planner does not.

3. **`planner_summary_path` in `task.json`**

   The schema includes `planner_summary_path` (metadata companion). The example `task.json` omits it. Either add it to the example or document when it is optional.

---

## Recommendations

1. Add a "Data schemas" subsection for:
   - `defect_summary.json` / `no_defects.json`
   - `review_result.json`
   - `phase2_spawn_manifest.json` and `phase4_spawn_manifest.json`
   - `run.json.notification_pending`

2. Resolve section naming: choose "Code Changes Summary" or "Defects Code Changes" and update the design, tests, and `qa-summary-review` accordingly.

3. Add a "qa-summary-review integration" section with:
   - New input/output paths
   - Required SKILL.md changes
   - How Phase 4 maps to the review skill's pass/fail behavior

4. Document the `FRESH` → `selected_mode` mapping and the canonical path for `check_runtime_env`.

5. Fix the validation command in `publish-and-notification.md` to use a supported Node test invocation.

---

## Verdict

The design is implementable but not fully self-sufficient. The main blockers are:

- Undefined schemas for defect summary, review result, and spawn manifests
- Section naming and section 1 ownership inconsistencies with `qa-summary-review`
- Missing explicit path migration and integration details for `qa-summary-review`

Addressing these will make the design self-sufficient and coherent for implementation.
