# EXPORT-P1-CONTEXT-INTAKE-001 — Phase 1 Contract Check (Advisory)

Feature: **BCVE-6678**  
Feature family: **export**  
Primary phase under test: **phase1**  
Evidence mode: **blind_pre_defect**  
Benchmark focus: **context intake preserves Google Sheets export entry points, scope boundaries, and format constraints before scenario drafting**

## What Phase 1 must accomplish (per skill snapshot)
Phase 1 is limited to **generating a spawn request per requested source family** (plus support-only Jira digestion requests if provided), and producing **`phase1_spawn_manifest.json`**. It must set up downstream context intake so that:
- Evidence collection can cover **Google Sheets export entry points** (where the user initiates export).
- Evidence collection can preserve **scope boundaries** (what is in/out).
- Evidence collection can preserve **format constraints** (Google Sheets as a target, export settings/UI strings, defaults).

## Evidence available in this benchmark bundle (blind pre-defect)
Only the following evidence is available and must drive Phase 1 context intake planning:
- `BCVE-6678.issue.raw.json` (feature issue snapshot)
- `BCVE-6678.customer-scope.json` (customer signal summary)
- `BCVE-6678.adjacent-issues.summary.json` (adjacent issues list)

From adjacent issues, the feature has *parented* issues that clearly imply Google Sheets export entry points / settings surfaces:
- **BCIN-7106 (Story):** *"[Report]Application Level Default value for Google Sheets Export"*
- **BCIN-7636 (Defect):** *"Update some strings under application's report export setting dialog"*
- **BCIN-7595 (Defect):** *"Refine UI to keep \"REPORT EXPORT SETTINGS\" header when scroll is triggered"*

These titles alone indicate that correct context intake must preserve:
- Entry point(s) involving **Application Editor → Report Export Settings dialog**.
- The **Google Sheets export** option specifically.
- **UI/strings/scroll behavior** constraints that are part of the export settings surface.

## Phase 1 contract expectations vs. this benchmark focus
### Required for passing this benchmark (phase1-oriented)
To satisfy “context intake preserves Google Sheets export entry points, scope boundaries, and format constraints before scenario drafting”, Phase 1 must (at minimum):
1. Route evidence collection to **Jira** as a requested source family (because the only provided bundle evidence is Jira-derived, and adjacent issues are Jira keys).
2. Ensure the Phase 1 spawn plan is capable of capturing:
   - The feature epic/story context (BCVE-6678)
   - The adjacent issues (BCIN-7106/7636/7595) as part of context (even if defects are not analyzed as defects in this benchmark mode, they are still context evidence).
3. Preserve the “Google Sheets export” keyword and the “Report Export Settings dialog/header” surfaces as **explicit context intake targets** (i.e., not deferred to scenario drafting).

### Assessment (based on provided evidence only)
**Blocker: Phase 1 output artifact is not present in the benchmark evidence.**
- The required Phase 1 artifact `phase1_spawn_manifest.json` is not included in the fixture bundle.
- No `task.json` / `run.json` / `context/` artifacts are included to demonstrate that Phase 1 generated spawn requests that would capture Google Sheets export entry points / constraints.

Given the benchmark rules (“use only the benchmark evidence listed below”), we cannot confirm whether the orchestrator/phase1 script:
- requested the correct source family (Jira),
- included the adjacent issue keys in the intake plan,
- or encoded the necessary scope/format constraints for later phases.

## Advisory verdict (phase1)
**Result: INCONCLUSIVE / NOT DEMONSTRABLE from provided evidence**

Reason: The benchmark focus is about Phase 1 context-intake preservation *before scenario drafting*, which is evidenced primarily through **Phase 1 spawn planning artifacts** (e.g., `phase1_spawn_manifest.json` content and routing). Those artifacts are not present in the supplied bundle, so compliance cannot be evaluated.

## What would be needed to make this demonstrable (still phase1-aligned)
Include the Phase 1 artifact(s) in evidence, specifically:
- `phase1_spawn_manifest.json` showing at least a Jira source-family spawn request that ingests:
  - BCVE-6678
  - adjacent keys BCIN-7106, BCIN-7636, BCIN-7595
  - and preserves Google Sheets export + export settings dialog/header as explicit context targets (either in request metadata or in the subagent task text).