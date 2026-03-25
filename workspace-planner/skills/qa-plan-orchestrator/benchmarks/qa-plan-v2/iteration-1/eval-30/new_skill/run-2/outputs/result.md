# EXPORT-P1-CONTEXT-INTAKE-001 — Phase 1 (Context Intake) Contract Check

Feature: **BCVE-6678**  
Feature family: **export**  
Primary phase under test: **phase1**  
Evidence mode: **blind_pre_defect**  
Priority: **advisory**  
Focus: **Context intake preserves Google Sheets export entry points, scope boundaries, and format constraints *before* scenario drafting.**

## What Phase 1 Must Do (per skill snapshot)
Phase 1 is **spawn-only**:
- Generate **one spawn request per requested source family**, plus **support-only Jira digestion** requests when provided.
- Output: `phase1_spawn_manifest.json`
- `--post`: validate spawn policy + evidence completeness and block with `REMEDIATION_REQUIRED: <source_family>` if missing.

**Key benchmark requirement:** during context intake (Phase 1), the workflow must preserve and route evidence needed to later capture **Google Sheets export entry points**, **scope boundaries**, and **format constraints**, without drafting scenarios yet.

## Evidence Available in This Benchmark Bundle (blind pre-defect)
From the fixture bundle, the only explicit, authoritative inputs about the feature are:
- Jira feature issue export: `BCVE-6678.issue.raw.json`
- Customer scope snapshot: `BCVE-6678.customer-scope.json`
- Adjacent issues list: `BCVE-6678.adjacent-issues.summary.json`

Notable context signals present in evidence:
- Feature labels include **Export** (supports correct feature family routing).
- Adjacent/parented issues include:
  - **BCIN-7106 (Story):** *"[Report]Application Level Default value for Google Sheets Export"*
  - **BCIN-7636 (Defect):** strings under report export setting dialog
  - **BCIN-7595 (Defect):** UI header behavior in export settings dialog

## Phase 1 Contract Fit vs. Benchmark Focus
### 1) Preserving Google Sheets export entry points
- The fixture indicates Google Sheets export is central via adjacent story **BCIN-7106**.
- **Phase 1 contract** supports this by spawning Jira evidence collection/digestion for the feature and any relevant adjacent issues.
- **However:** The provided evidence does not include any Phase 1 spawn manifest output, nor any captured Jira digestion artifacts under `context/`.

**Assessment:** *Cannot verify in this benchmark run output.* The evidence suggests Phase 1 should route Jira collection that would preserve Google Sheets export entry points, but the actual Phase 1 artifact (`phase1_spawn_manifest.json`) is not provided.

### 2) Preserving scope boundaries
- The bundle includes a customer scope snapshot indicating no customer-linked issues at export time.
- Scope boundaries for the feature itself would normally be derived from the feature issue description/AC and related Jira items.
- **Phase 1 contract** would preserve this by capturing Jira issue content into `context/` via spawned source-family collection.

**Assessment:** *Cannot verify.* No Phase 1 outputs are present to confirm the collection happened or that related issues (e.g., BCIN-7106) were included.

### 3) Preserving format constraints (Google Sheets export)
- Format constraints typically require product specs, UI/export settings rules, file/output constraints, etc.
- In blind pre-defect mode, those constraints would be expected to come from Jira story/feature text and possibly Confluence/design artifacts—**but** Phase 1 is only responsible for spawning the correct source-family evidence pulls.

**Assessment:** *Cannot verify.* The fixture suggests where constraints likely live (Jira issues around export settings), but there is no manifest proving those sources were requested.

## Contract Alignment to Phase 1 (Advisory)
What would demonstrate compliance (but is not present in provided evidence):
- A `phase1_spawn_manifest.json` that includes Jira-source spawns sufficient to:
  - ingest BCVE-6678
  - ingest adjacent issue BCIN-7106 at minimum (Google Sheets export default / entry point context)
  - optionally ingest adjacent UI/string defects as context (still Jira evidence; defects are allowed as evidence)
- If any supporting issues were specified, they must be marked **context-only/no defect analysis**. (No supporting_issue_keys are provided in fixture evidence.)

## Benchmark Verdict (based only on provided evidence)
- **Output alignment with phase1:** **Not verifiable** (Phase 1 deliverable `phase1_spawn_manifest.json` not included in evidence).
- **Case focus explicitly covered (Google Sheets entry points, scope boundaries, format constraints preserved before drafting):** **Not verifiable** from Phase 1 artifacts because no Phase 1 artifacts are provided; only raw fixture context exists.

## Advisory Remediation (what Phase 1 should output)
To satisfy this benchmark case, Phase 1 evidence collection should, at minimum, ensure the spawn plan explicitly targets Jira items that encode Google Sheets export behavior:
- **BCVE-6678** (feature)
- **BCIN-7106** (story) because it explicitly references **Google Sheets Export** defaults and likely defines entry points/constraints
- plus any export-settings dialog-related adjacent issues for UI entry points (BCIN-7636, BCIN-7595) as supporting context

---

## Short execution summary
Reviewed the skill snapshot Phase 1 contract and the BCVE-6678 blind pre-defect fixture bundle. The bundle provides Jira exports and adjacency context indicating Google Sheets export relevance (BCIN-7106), but does not include Phase 1 runtime artifacts (notably `phase1_spawn_manifest.json`), so Phase 1 compliance with the benchmark focus cannot be verified from provided evidence alone.