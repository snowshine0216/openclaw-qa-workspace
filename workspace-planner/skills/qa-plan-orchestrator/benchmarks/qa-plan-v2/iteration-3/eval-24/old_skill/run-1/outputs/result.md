# NE-P1-CONTEXT-INTAKE-001 — Phase 1 contract check (advisory)

**Benchmark feature:** BCED-1719  
**Feature family / knowledge pack:** native-embedding  
**Primary phase under test:** phase1  
**Evidence mode:** blind_pre_defect  
**Priority:** advisory  
**Focus:** context intake preserves **component-stack constraints**, **embedding lifecycle assumptions**, and **integration-sensitive customer expectations**.

## What Phase 1 is required to do (per skill snapshot)
Phase 1 is **spawn-only orchestration**:
- Generate **one spawn request per requested source family** plus **support-only Jira digestion** requests when provided.
- Output: `phase1_spawn_manifest.json`.
- Post-step: `phase1.sh --post` validates **spawn policy**, **evidence completeness**, **support relation map/summaries**, and **non-defect routing**; on failure exit `2` with `REMEDIATION_REQUIRED: <source_family>`.

Importantly, per orchestrator contract:
- The orchestrator **does not perform phase logic inline** and **does not write artifacts directly**; it only runs scripts, spawns subagents from the manifest, records Phase 1 spawn completion, then runs `--post`.

## Context-intake coverage expected for this benchmark focus (Phase 1 framing)
Because this case is **phase-contract / phase1**, the “context intake” expectation is satisfied if Phase 1 spawn planning would ensure capture of the following *inputs* (not analysis):

### 1) Component-stack constraints (embedding + integration surface)
From the available evidence, BCED-1719 is an Embedding/SDK + Library/Dashboards feature (`labels: Embedding_SDK, Library_and_Dashboards`). Phase 1 should therefore route evidence collection to source families that typically encode stack constraints (at minimum):
- **Jira** (primary requirement text, acceptance scope, integration constraints captured in the feature issue and related items)
- Potentially **GitHub** and/or **Confluence** if the request requires code/API contract or internal spec confirmation (cannot be asserted from the provided fixture alone; Phase 1 would decide based on `requested_source_families` in runtime state).

### 2) Embedding lifecycle assumptions
Phase 1 context intake must set up evidence collection such that later phases can map lifecycle behaviors (init/auth, load, render, refresh, session/state, teardown) into scenarios. With only the Jira fixture provided here, the Phase 1 obligation is to ensure Jira evidence is collected and persisted under `context/` for later coverage mapping.

### 3) Integration-sensitive customer expectations
This fixture contains explicit customer signals:
- `BCED-1719.customer-scope.json` indicates **customer_signal_present: true** and notes: *“Feature carries explicit customer references in Jira custom fields.”*
- Customer reference: **CVS Pharmacy, Inc. – CS0928640** appears in Jira custom fields.

Phase 1 context intake must therefore ensure customer-sensitive context is retained as evidence (not defect analysis), so it can influence expectations/coverage in later drafting.

## Evidence-based findings (limited to provided benchmark evidence)
Using only the provided fixture evidence:
- **BCED-1719 has explicit customer linkage signals** (CVS / CS0928640) and is in the **Embedding_SDK** and **Library_and_Dashboards** domain.
- No linked issues are present in the exported customer scope (`linked_issue_count: 0`), so **support-only Jira digestion** cannot be inferred from this fixture alone.

## Phase 1 alignment assessment (advisory)
**Can we confirm Phase 1 deliverables (spawn manifest + validations) were produced and correctly encoded?**
- **Not confirmable from provided evidence.** The benchmark bundle includes Jira/export fixtures but does **not** include `task.json`, `run.json`, or a produced `phase1_spawn_manifest.json`.

**What we *can* assess against the phase1 contract with current evidence:**
- The benchmark focus requires that Phase 1 context intake **preserve** customer expectations and integration/embedding context. The provided evidence demonstrates that such expectations exist (explicit customer reference, embedding-related labels).  
- However, whether the skill (in this run/config) would actually:
  - include Jira in `requested_source_families`,
  - spawn Jira collection/digestion tasks,
  - capture and persist customer-signal artifacts under `context/`,
  - keep support-only issues in `context_only_no_defect_analysis` mode,

cannot be demonstrated without Phase 1 runtime artifacts.

## Conclusion (phase1 contract / advisory)
- **Case focus is identifiable from evidence** (embedding/integration domain + explicit customer expectation signal).  
- **Demonstration that Phase 1 context intake preserves these constraints is blocked** because Phase 1 outputs (especially `phase1_spawn_manifest.json` and any `context/` artifacts produced by spawned tasks) are not part of the provided benchmark evidence.

## Minimal expected Phase 1 artifacts to satisfy this benchmark (for traceability)
To demonstrate compliance for NE-P1-CONTEXT-INTAKE-001, the evidence set would need to include (per contract):
- `phase1_spawn_manifest.json` showing spawns for at least the **Jira** source family (and any others requested), with tasks that would capture:
  - embedding/integration constraints (from feature issue)
  - customer expectation signals (CVS / CS0928640) as context
- `run.json` with `spawn_history` updated via `scripts/record_spawn_completion.sh phase1 ...`
- Any spawned output artifacts saved under `context/` (e.g., Jira digests), plus (if applicable) support relation map/summary files.