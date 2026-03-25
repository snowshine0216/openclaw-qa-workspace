# GRID-P1-CONTEXT-INTAKE-001 — Phase 1 (Context intake) Contract Check

Primary feature: **BCIN-7231**  
Feature family / knowledge pack: **modern-grid**  
Primary phase under test: **phase1**  
Evidence mode: **blind_pre_defect**  
Priority: **advisory**

## What Phase 1 is required to do (per skill snapshot)
Phase 1 is **spawn-only orchestration**:
- Run `scripts/phase1.sh <feature-id> <run-dir>`
- Produce `phase1_spawn_manifest.json` that contains **one spawn request per requested source family** (and supporting-issue Jira digestion spawns when provided)
- Orchestrator then spawns `requests[].openclaw.args` **as-is** via `sessions_spawn`, waits, records completion (`record_spawn_completion.sh`), then runs `scripts/phase1.sh ... --post`
- Phase 1 `--post` validates evidence completeness + support-only routing; failures exit `2` with `REMEDIATION_REQUIRED: <source_family>`

## Benchmark focus (must be preserved before scenario drafting)
This benchmark checks that **context intake** captures and preserves, *before any scenario drafting*, the requirements/assumptions for:
1) **Banding requirements** (rows/columns, header-based banding, color formatting)  
2) **Style constraints** (format/colors)  
3) **Rendering assumptions** (Modern Grid in dashboards; readability enhancement; parity with Report)

## Evidence available in this benchmark bundle (blind pre-defect)
From the provided fixture evidence for **BCIN-7231**:
- The feature description states Modern Grid currently:
  - can only enable banding in **rows**
  - cannot **format the colors**
  - cannot enable banding in **columns**
  - cannot apply banding color by **row/column header**
  - motivation: banding improves grid readability; these functions exist in **Report** and should be brought to **Modern Grid in dashboards**

## Phase 1 alignment assessment (advisory)
### What can be concluded from the provided evidence
- The **requirements to preserve** during context intake are clearly present in the Jira issue JSON (feature description).

### What cannot be demonstrated from the provided evidence
- There is **no Phase 1 runtime output** included (e.g., no `phase1_spawn_manifest.json`, no `context/` evidence artifacts produced by spawned source-family digestions).
- Therefore, we cannot verify that Phase 1 actually:
  - routed to the correct source families (e.g., Jira digestion at minimum)
  - captured banding/style/rendering statements into `context/` artifacts
  - enforced support-only policy (not applicable here unless supporting issues were supplied)

## Contract verdict for this benchmark case
**Inconclusive (insufficient runtime artifacts provided).**

Reason: The benchmark requires demonstrating Phase 1 context-intake preservation *before drafting*. With only the raw Jira fixture and no Phase 1 outputs (spawn manifest + generated context artifacts), we can confirm the *input contains* the needed banding/style/rendering requirements, but we cannot confirm the orchestrator/phase1 workflow preserved them in the expected Phase 1 artifacts.

## Minimal artifacts that would be needed to pass this benchmark (for Phase 1)
To demonstrate the skill satisfies the benchmark focus, the evidence set would need to include at least:
- `phase1_spawn_manifest.json` for BCIN-7231 showing a Jira source-family digestion spawn (and any other requested families)
- The resulting Phase 1 `context/` artifacts produced by those spawns (source evidence capture) that explicitly retain:
  - banding rows/columns capability requirements
  - color formatting/style constraints
  - header-based banding requirement
  - rendering context: Modern Grid dashboards + parity with Report

---

## Short execution summary
Checked the Phase 1 contract in the skill snapshot and compared it to the provided BCIN-7231 blind-pre-defect fixture. The fixture contains the needed banding/style/rendering requirements, but no Phase 1 spawn manifest or generated `context/` artifacts were provided, so Phase 1 context-intake preservation cannot be verified for this benchmark run.