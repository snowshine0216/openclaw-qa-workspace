# EXPORT-P1-CONTEXT-INTAKE-001 — Phase 1 Contract Check (Advisory)

## Benchmark intent (phase1)
Verify that **Phase 1 context intake** (i.e., the Phase 1 spawn-manifest generation + Phase 1 contract notes) is capable of **preserving Google Sheets export entry points, scope boundaries, and format constraints** for feature **BCVE-6678 (export family)** *before* any scenario drafting begins.

This benchmark is **blind_pre_defect** and **phase_contract** (advisory): we assess whether the orchestrator’s Phase 1 contract/workflow, as defined by the provided skill snapshot and fixture evidence, would preserve the required context without performing drafting.

## Evidence available (from fixture bundle)
From the provided fixture evidence for **BCVE-6678**:
- BCVE-6678 is labeled **Export** and is under **Google Workspace (GWS) Integration** parent initiative (PRD-75). (See `BCVE-6678.issue.raw.json` and `BCVE-6678.customer-scope.json`.)
- Adjacent (parented) issues include:
  - **BCIN-7106 (Story)**: *"[Report]Application Level Default value for Google Sheets Export"*
  - **BCIN-7636 (Defect)**: *"Update some strings under application's report export setting dialog"*
  - **BCIN-7595 (Defect)**: *"[Application editor] Refine UI to keep \"REPORT EXPORT SETTINGS\" header when scroll is triggered"*
  (See `BCVE-6678.adjacent-issues.summary.json`.)

These artifacts strongly indicate the feature area involves **Report export settings** and specifically **Google Sheets export** default behavior, which implies the need to preserve:
- Entry points (where users reach Google Sheets export settings/actions)
- Scope boundaries (application-level default vs report-level behavior; what is and is not part of this feature)
- Format constraints (Google Sheets export format/behavior expectations)

## Phase 1 contract vs benchmark focus
Per `skill_snapshot/SKILL.md` and `skill_snapshot/reference.md`, **Phase 1** is responsible for:
- Generating **one spawn request per requested source family** (and support-only Jira digestion requests when provided)
- Producing `phase1_spawn_manifest.json`
- Enforcing that **supporting issue summaries are explicitly marked** `context_only_no_defect_analysis` and are **not defect-analysis triggers**
- Running `--post` validation to ensure spawn policy and evidence completeness

### What Phase 1 must preserve for this benchmark
To preserve Google Sheets export entry points, scope boundaries, and format constraints *before drafting*, Phase 1 must ensure that the spawned context collection covers at least:
1. **Primary feature issue context** for BCVE-6678 (to identify intended scope)
2. **Adjacent issue context** (especially BCIN-7106) to capture Google Sheets export default behavior/entry points/scope constraints implied by related work
3. Any referenced product doc/design sources if they are part of requested source families (not present in fixture evidence, but Phase 1 should route based on request)

## Assessment (advisory) against the phase1 contract
### Pass/Fail determination
**Result: PARTIAL / AT-RISK** (phase1 contract supports the goal, but the provided evidence does not demonstrate that Phase 1 would concretely preserve Google Sheets export entry points/scope/format constraints).

### Rationale (bounded to provided evidence)
- The **Phase 1 contract** is structurally correct for context intake (it spawns source-family collectors and validates policy). This aligns with the requirement to do context intake *before* drafting.
- However, in the provided benchmark evidence we do **not** have:
  - `task.json` showing the **requested_source_families**
  - an actual `phase1_spawn_manifest.json` for BCVE-6678
  - any Phase 1-produced context artifacts (e.g., `context/*` summaries, relation maps)
- Therefore, we cannot verify that Phase 1 would actually spawn the **specific Jira digestions** needed to preserve:
  - **Google Sheets export entry points** (e.g., from “Report export settings” dialogs, report/application settings)
  - **scope boundaries** (application-level default vs report-level export behavior)
  - **format constraints** (Google Sheets output constraints)

### Specific risk surfaced by fixture evidence
- The presence of adjacent issues (notably **BCIN-7106**) suggests critical context lives outside the epic itself. If Phase 1 only spawns digestion for the primary issue and not adjacent issues (or fails to include them in context intake), the resulting context may miss the **Google Sheets export default** details and therefore fail the benchmark focus.

## Phase 1 alignment statement (what “good” would look like)
Under the phase1 contract, meeting this benchmark would require that Phase 1 spawn manifest requests (at minimum) drive context collection that captures:
- BCVE-6678 issue details (scope + intent)
- BCIN-7106 story details (Google Sheets export default behavior and entry point implications)
- Any export settings dialog behavior relevant to entry points and constraints (BCIN-7636/BCIN-7595 may contain relevant UI context)

And that any supporting/adjacent issue summaries are explicitly labeled:
- `context_only_no_defect_analysis`

## Conclusion
The skill’s **Phase 1 contract** is compatible with the benchmark goal, but with the evidence provided (blind pre-defect fixture bundle only) we cannot confirm that context intake actually preserves the **Google Sheets export entry points, scope boundaries, and format constraints** prior to drafting. The case is therefore **at-risk** pending inspection of the Phase 1 spawn manifest and resulting context artifacts.

---

## Short execution summary
Reviewed only the provided skill snapshot contracts for Phase 1 and the BCVE-6678 fixture bundle. Determined Phase 1 is structurally aligned (spawn-based context intake), but the benchmark evidence does not include Phase 1 outputs (spawn manifest / context artifacts) to prove Google Sheets export entry points/scope/format constraints were preserved; marked advisory result as **PARTIAL / AT-RISK**.