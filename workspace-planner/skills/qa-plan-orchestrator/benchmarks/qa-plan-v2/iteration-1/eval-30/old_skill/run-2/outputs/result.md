# EXPORT-P1-CONTEXT-INTAKE-001 — Phase 1 Contract Check (BCVE-6678)

## Benchmark intent (phase1 / advisory)
Validate that **Phase 1 context intake** (source-family spawn planning and guardrails) is sufficient to preserve, *before any scenario drafting*, the key **Google Sheets export** testing context for feature **BCVE-6678**:
- Export **entry points** (where the user triggers export / settings)
- **Scope boundaries** (what’s in/out based on available evidence)
- **Format constraints** (Google Sheets-specific output/config constraints)

## Evidence available (blind pre-defect bundle)
From the fixture bundle, the only concrete product-context signals are:
- Feature: **BCVE-6678** (labels include **Export** and **Library_and_Dashboards**) (from `BCVE-6678.issue.raw.json`)
- Adjacent (parented) issues frozen under the feature (from `BCVE-6678.adjacent-issues.summary.json`):
  - **BCIN-7106** (Story): *"[Report]Application Level Default value for Google Sheets Export"*
  - **BCIN-7636** (Defect): *"Update some strings under application's report export setting dialog"*
  - **BCIN-7595** (Defect): *"[Application editor] Refine UI to keep \"REPORT EXPORT SETTINGS\" header when scroll is triggered"*
- Customer scope export shows **no customer signals** (from `BCVE-6678.customer-scope.json`).

## Phase 1 contract alignment (what Phase 1 must do)
Per the skill snapshot contract (`skill_snapshot/SKILL.md`, `skill_snapshot/reference.md`):
- Phase 1 **only** generates `phase1_spawn_manifest.json` with **one spawn request per requested source family** (and support-only Jira digestion if supporting issues are provided).
- Phase 1 `--post` validates spawn policy and evidence completeness; remediation is printed as `REMEDIATION_REQUIRED: <source_family>` when incomplete.

## Assessment against benchmark focus (context preserved before drafting)
### 1) Google Sheets export entry points
**Partially preservable at Phase 1, but only if the spawn plan includes Jira evidence that captures UI/workflow entry points.**

In the available evidence, entry-point hints exist only indirectly via adjacent issue summaries referencing:
- **"report export setting dialog"** (BCIN-7636)
- **"Application editor"** and **"REPORT EXPORT SETTINGS" header** (BCIN-7595)

However, **these are not sufficient as-is** to preserve entry points, because Phase 1 has not yet (in this benchmark evidence) demonstrated that it will spawn Jira collection for:
- The main feature issue description/acceptance criteria (likely inside BCVE-6678 raw but truncated here)
- The adjacent story/defects’ detailed descriptions (where actual entry points are typically specified)

**Phase 1 requirement implied by benchmark:** ensure the Phase 1 spawn manifest includes **Jira** as a requested source family and explicitly captures adjacent issue details as part of Jira digestion so entry points are not lost.

### 2) Scope boundaries
**Preservable at Phase 1** from what’s available:
- Feature family: **export** (label `Export`)
- Product surface hint: **Library and Dashboards** (label `Library_and_Dashboards`)
- Export setting UI context (adjacent issue summaries mention application editor and export settings dialog)
- No customer/support-driven expansion (customer signal absent; no support signal keys in adjacency export)

**Phase 1 implication:** scope boundaries can be recorded as “export settings / report export settings UI + Google Sheets default export behavior” and constrained to the evidence-backed surfaces.

### 3) Format constraints (Google Sheets)
**Not preservable from the provided evidence alone at Phase 1.**

The only Google Sheets specific statement in evidence is the adjacent story title:
- **BCIN-7106**: *"Application Level Default value for Google Sheets Export"*

This does not specify any concrete format constraints (e.g., file type, sheet naming, limitations, formatting fidelity, size limits, locale/encoding behaviors). Therefore, **Phase 1 can only preserve that Google Sheets export is in scope**, but cannot preserve actual constraints without spawning more evidence (Jira details, docs, etc.).

## Verdict (phase_contract / advisory)
**Advisory: At risk / insufficient demonstration in the provided blind evidence.**

Reason: The benchmark expects Phase 1 context intake to preserve **entry points, scope boundaries, and format constraints** for Google Sheets export **before scenario drafting**. With only the fixture evidence:
- Scope boundaries are *partially* inferable.
- Entry points are only hinted and require Jira detail collection to preserve reliably.
- Format constraints are **not present** and therefore cannot be preserved without additional source-family evidence.

## What Phase 1 should output (to satisfy this case)
To meet the benchmark expectation under the Phase 1 model, the run must at minimum result in a `phase1_spawn_manifest.json` that drives collection of evidence sufficient to preserve the above context before drafting, specifically:
- **Requested source family: Jira** (primary) to ingest:
  - BCVE-6678 full content
  - Adjacent issue details for BCIN-7106 / BCIN-7636 / BCIN-7595 (since they contain the only explicit Google Sheets/export-settings hints)
- If there are docs/design references inside Jira, Phase 1 should also request the relevant source families (e.g., Confluence/GitHub) *as separate source families* in the manifest (consistent with “one per requested source family”).

Absent such a manifest in evidence, we cannot confirm Phase 1 preserves the Google Sheets export entry points and constraints prior to drafting.