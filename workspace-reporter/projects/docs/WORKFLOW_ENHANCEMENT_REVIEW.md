# WORKFLOW_ENHANCEMENT_PLAN — Design Compliance Review

**Review date:** 2026-02-26  
**Status:** All gaps identified in initial review have been fixed.

---

## Summary

| Area | Status | Notes |
|------|--------|-------|
| `defect-analysis.md` | ✅ Fixed | Scope B JQL documented; Phase 1 cache comment corrected |
| `qa-summary.md` | ✅ Compliant | All requirements met |
| `MEMORY.md` | ✅ Compliant | All sections added correctly |
| `QA_SUMMARY_AGENT_DESIGN.md` | ✅ Fixed | Phase 0 prerequisite added; Phase 1 skip updated; 5.x → 1–9 |
| `skills/qa-summary/` | ✅ Compliant | Draft generation guide correctly implemented |
| `skills/qa-summary-review/` | ✅ Compliant | Coverage + Formatting checklists implemented |
| `AGENTS.md` | ✅ Fixed | Phase 6 summary updated (promotion in Phase 4a) |

---

## 1. defect-analysis.md

### ✅ Satisfied
- Phase 0a (Project Discovery) runs first and populates `project_keys.txt`
- Phase 0b (Release Discovery) runs after 0a; scope-selection prompt present
- Cross-project JQL uses `project in ($PROJECT_KEYS)` from cache
- References `skills/jira-cli/references/issue-search.md`
- Phase 1 guard: halt if `project_keys.txt` empty, re-run Phase 0a
- Phase 4a: archive old final, promote draft → `_REPORT_FINAL.md`, add `report_final_at`
- Phase 5: approval prompt references `_REPORT_FINAL.md` and review summary
- Phase 6: publish existing `_REPORT_FINAL.md`; no `cp draft → final`; post-update read-back check

### ✅ Fixed (2026-02-26)
1. **Phase 0b JQL for option B:** Added inline comment with the alternative JQL when user chooses ALL features.
2. **Phase 1 cache comment:** Corrected "Phase 0b cache" → "Phase 0a cache".

---

## 2. qa-summary.md

### ✅ Satisfied
- Phase 0: Final Report Prerequisite Check before workspace classification
- Phase 0: Verify `report_approved_at`; halt if report exists but not approved
- Phase 1: Skip condition updated — no "Use Existing" / "Resume" bypass of defect-analysis
- Phase 2: Input is `_REPORT_FINAL.md`; qa-summary skill; emoji heading + 1-based subsections
- Phase 3: qa-summary-review skill; defect counts cross-checked against `_REPORT_FINAL.md`
- Phase 5: Post-update Confluence formatting self-check; replace `5. QA Summary` with emoji heading
- Release scope: scope-selection step before spawning sub-agent

---

## 3. MEMORY.md

### ✅ Satisfied
- `## Confluence Safety Rules` added (surgical updates, never delete, preserve over placeholder, read before write)
- `## Workflow Pipeline Rules` added (qa-summary requires `_REPORT_FINAL.md`, created in Phase 4a, read-only from final)
- QA Owner scope default in `## Jira Workflow Insights`
- Cross-project JQL pattern in `## Jira Workflow Insights`
- Report Archive Strategy expanded with inline rules (archive location, never delete)

---

## 4. QA_SUMMARY_AGENT_DESIGN.md

### ✅ Satisfied
- Phase 2: Confluence formatting policy block (emoji heading, 1-based numbering, tables for 2/3/4, bullet lists elsewhere, P0/P1 for Resolved Defects)
- Phase 3: qa-summary-review skill; criteria 7–9 (heading, section format, Resolved Defects P0/P1)
- Target Structure: uses emoji heading and 1-based numbering (no 5.x)

### ✅ Fixed (2026-02-26)
1. **Phase 0:** Added **0a.5 Final Report Prerequisite Check** before workspace classification.
2. **Phase 1:** Replaced old skip condition with new logic (skip only when `_REPORT_FINAL.md` confirmed fresh).
3. **Quality Gates:** Updated "5.1–5.9" → "1–9".
4. **Mandatory Rules:** Updated "5.1–5.9" → "1–9".

---

## 5. skills/qa-summary/ & skills/qa-summary-review/

### ✅ Satisfied
- `qa-summary` skill: section template, data source mapping, placeholder policy, formatting rules (tables vs bullet lists, P0/P1 filter)
- `qa-summary-review` skill: Coverage (C1–C5) and Formatting (F1–F6) checklists; outputs `_QA_SUMMARY_REVIEW.md`
- Old `summary-review` folder removed

---

## 6. AGENTS.md

### ✅ Satisfied
- Skills table: `qa-summary` (Phase 2), `qa-summary-review` (Phase 3)
- QA Summary Phase summary references correct skills
- File organization includes `_REPORT_FINAL.md`

### ✅ Fixed (2026-02-26)
- **Defect Analysis Phase 6:** Updated to "Final report already exists (promoted in Phase 4a)".
