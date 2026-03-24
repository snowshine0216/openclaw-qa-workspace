# NE-P1-CONTEXT-INTAKE-001 — Phase 1 (Advisory) Contract Check

## Benchmark intent (Phase 1)
Validate that **Phase 1 context intake** (spawn planning for evidence collection) preserves:
1) **Component-stack constraints** (what systems/clients are implicated)
2) **Embedding lifecycle assumptions** (setup → auth → load → render → interaction → refresh/error)
3) **Integration-sensitive customer expectations** (explicit customer signal must influence what evidence is requested/collected)

Primary feature: **BCED-1719**  
Feature family / knowledge pack: **native-embedding**  
Evidence mode: **blind_pre_defect**  
Priority: **advisory**  

## Evidence available in this benchmark bundle
From fixture evidence, we can only assert the following context inputs:
- **BCED-1719** is labeled **Embedding_SDK** and **Library_and_Dashboards** (implies SDK embedding + library/dashboard surfaces are in component stack).
- There is **explicit customer signal**: `{ CVS Pharmacy, Inc. - CS0928640 }` in Jira customer custom fields; fixture states `customer_issue_policy: all_customer_issues_only` and `customer_signal_present: true`.
- No linked issues/subtasks are present in the export (`linked_issue_count: 0`, `subtask_count: 0`).

## Phase 1 contract alignment (what Phase 1 must do)
Per skill snapshot, **Phase 1 work** is:
- “generate one spawn request per requested source family plus support-only Jira digestion requests when provided”
- Output: `phase1_spawn_manifest.json`
- `--post`: validate spawn policy + evidence completeness + support relation map/summaries + non-defect routing

For this benchmark focus, Phase 1 must at minimum ensure the **spawn manifest plans evidence collection** that will later allow drafting to respect:
- the **embedding SDK + library/dashboard** integration surface
- **customer-driven expectations** (CVS referenced) by ensuring customer context is captured as context evidence (still non-defect)

## Pass/Fail assessment for this benchmark case
### What can be verified with provided evidence
- The snapshot’s Phase 1 contract **recognizes** support-only Jira ingestion and explicitly enforces **context_only_no_defect_analysis** routing for supporting issues.
- The fixture shows **customer signal is present** and should be treated as integration-sensitive expectation input.

### What cannot be verified (blocker)
This benchmark is specifically Phase 1 output/behavior, but the bundle does **not** include any of the Phase 1 runtime artifacts (no run directory contents), in particular:
- `phase1_spawn_manifest.json`
- `task.json` fields such as `requested_source_families`, `supporting_issue_keys`, `request_requirements/materials/commands`
- any generated `context/` artifacts produced by Phase 1 spawn completions

Without the **actual Phase 1 spawn manifest (or task.json inputs)**, we cannot determine whether context intake *actually preserved*:
- component-stack constraints (e.g., did it request evidence from correct source families such as Jira + GitHub + docs/Confluence, if applicable?)
- embedding lifecycle assumptions (e.g., did it request SDK/API docs, integration guides, or code references?)
- customer expectations (e.g., did it ensure customer-linked support context was requested when present?)

## Advisory verdict (Phase 1)
**Status: NOT DEMONSTRABLE from provided blind_pre_defect evidence.**

This is not a claim that the orchestrator fails Phase 1; only that this benchmark run cannot confirm compliance because the **Phase 1 deliverable artifact (`phase1_spawn_manifest.json`) is not included** in the evidence bundle.

## Minimal evidence needed to satisfy this benchmark (Phase 1)
To evaluate this case, the evidence bundle would need at least one of:
1) The generated `phase1_spawn_manifest.json` for **BCED-1719**, showing spawn requests that reflect:
   - embedding SDK + library/dashboard surface area
   - any customer-context capture steps warranted by the presence of `CS0928640`
2) Or the Phase 1 stdout/trace plus `task.json` showing `requested_source_families` and any `supporting_issue_keys`/customer-context requirements.