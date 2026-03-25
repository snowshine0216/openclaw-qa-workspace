# NE-P1-CONTEXT-INTAKE-001 — Phase 1 Contract Check (BCED-1719)

**Benchmark feature:** BCED-1719  
**Feature family / knowledge pack:** native-embedding / native-embedding  
**Primary phase under test:** Phase 1 (context intake via spawn-manifest generation)  
**Evidence mode:** blind_pre_defect  
**Priority:** advisory  
**Focus:** context intake preserves (1) component-stack constraints, (2) embedding lifecycle assumptions, (3) integration-sensitive customer expectations.

## What Phase 1 is required to do (per skill snapshot)
Phase 1 must:
- Generate **one spawn request per requested source family** plus **support-only Jira digestion** requests when provided.
- Output **`phase1_spawn_manifest.json`**.
- In `--post`, validate: **spawn policy**, **evidence completeness**, **support relation map**, **support summaries**, and **non-defect routing**. Failures exit `2` with `REMEDIATION_REQUIRED: <source_family>`.

## Available benchmark evidence (blind pre-defect bundle)
From the fixture evidence, BCED-1719 provides:
- Jira raw issue JSON (`BCED-1719.issue.raw.json`) including:
  - Labels: `Embedding_SDK`, `Library_and_Dashboards` (signals integration + embedding SDK surface)
  - Priority: Highest
  - FixVersion: 26.04
  - **No linked issues** (`issuelinks: []`) in the visible portion
- Customer scope export (`BCED-1719.customer-scope.json`) including:
  - **Customer signal present**: `true`
  - Customer references: `{ CVS Pharmacy, Inc. - CS0928640 }`
  - `customer_issue_policy`: `all_customer_issues_only`
  - `linked_issue_count: 0`, `subtask_count: 0`

## Phase 1 context-intake expectations mapped to this feature’s needs
To preserve the case focus during Phase 1 intake, the spawn manifest (and ensuing evidence collection) must be set up to retain these constraints *as first-class context inputs*:

### 1) Component-stack constraints
**Observed signals in evidence:**
- Labels: `Embedding_SDK`, `Library_and_Dashboards` strongly imply a cross-component stack spanning SDK embedding + library/dashboard surfaces.

**Phase 1 intake requirement (contract-aligned):**
- Ensure Phase 1 routes to the correct primary evidence families (at minimum **Jira**; optionally **GitHub/Confluence/Figma** only if requested/available in the run’s requested source families).
- Ensure any spawned Jira digestion captures fields needed to preserve component boundaries (labels/components/initiative parent, etc.) as context artifacts under `context/`.

### 2) Embedding lifecycle assumptions
**Observed signals in evidence:**
- Feature family `native-embedding` + label `Embedding_SDK` implies lifecycle-sensitive flows (initialization/auth/session, embed render, interactions, refresh, teardown) that must not be lost during intake.

**Phase 1 intake requirement (contract-aligned):**
- Spawn requests should be structured to collect lifecycle-relevant descriptions/acceptance expectations from primary evidence (Jira and any designated docs source families) and persist them in `context/` for later Phase 3 coverage ledger mapping.

### 3) Integration-sensitive customer expectations
**Observed signals in evidence:**
- `customer_signal_present: true`
- Explicit customer reference: **CVS Pharmacy, Inc. – CS0928640**
- Notes: “Feature carries explicit customer references in Jira custom fields.”

**Phase 1 intake requirement (contract-aligned):**
- Intake must preserve that customer context as a constraint for later scenario framing (compatibility expectations, integration risk, release sensitivity).
- If **supporting_issue_keys** are provided at runtime, they must be routed in **`context_only_no_defect_analysis`** mode with:
  - `context/supporting_issue_relation_map_<feature-id>.md`
  - `context/supporting_issue_summary_<issue-key>_<feature-id>.md` and/or rollup summary

## Contract compliance determination (Phase 1)
**Status: Not directly verifiable from provided evidence (artifact missing).**

Reasoning:
- The benchmark evidence does **not** include a produced `phase1_spawn_manifest.json`, any Phase 1 stdout, nor any Phase 1 `--post` validation outputs.
- Therefore we cannot confirm that:
  - spawn requests were generated for each requested source family,
  - customer/integration signals were preserved into context artifacts,
  - support-only Jira policy would be enforced if supporting issues were present,
  - or that Phase 1 `--post` would remediate missing evidence with `REMEDIATION_REQUIRED`.

## Advisory findings (what Phase 1 must not miss for this feature)
If the orchestrator skill satisfies this benchmark, Phase 1 should ensure—via its spawn manifest + post-validation—that context intake explicitly captures:
- **Cross-surface integration** implied by `Embedding_SDK` + `Library_and_Dashboards`
- **Customer constraint**: CVS / CS0928640 (kept as a context driver, not defect analysis)
- **Embedding lifecycle** assumptions (init → embed → interact → refresh → teardown) from the primary evidence sources

## Required Phase 1 outputs to prove compliance (missing in this bundle)
To demonstrate meeting NE-P1-CONTEXT-INTAKE-001, the following Phase 1 artifacts/logs would be required:
- `phase1_spawn_manifest.json` for BCED-1719 (showing correct source-family spawn coverage and support-only routing if applicable)
- Evidence artifacts under `context/` produced by those spawns
- Phase 1 `--post` validation result (or at least confirmation no `REMEDIATION_REQUIRED` occurred)

---

# Short execution summary
This benchmark checks **Phase 1 context intake** behavior. The provided fixture contains Jira + customer-scope evidence showing **integration/embedding stack signals** and **explicit customer expectations** (CVS/CS0928640), but it does not include the **Phase 1 spawn manifest** or any **Phase 1 post-validation output**, so Phase 1 compliance cannot be verified from the listed evidence alone.