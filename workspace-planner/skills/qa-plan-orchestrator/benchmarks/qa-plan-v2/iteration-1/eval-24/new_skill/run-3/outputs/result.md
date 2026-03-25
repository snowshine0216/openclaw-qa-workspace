# NE-P1-CONTEXT-INTAKE-001 — Phase 1 Contract Check (BCED-1719 / native-embedding)

## Benchmark focus coverage (Phase 1: context intake)
This benchmark case checks whether **Phase 1 context intake** (spawn planning, not drafting) preserves:
1) **component-stack constraints**
2) **embedding lifecycle assumptions**
3) **integration-sensitive customer expectations**

Based strictly on the provided evidence, Phase 1 can only be assessed for whether it **captures and routes** these constraints into the workflow via correct **source-family spawn planning** and **support/customer context handling** (not whether the constraints are *correctly tested* later).

---

## Evidence extracted (what Phase 1 must preserve in context)

### A) Component-stack constraints (integration surface)
From the Jira feature record:
- Feature family / labels strongly indicate an embedding + SDK integration surface:
  - Labels: `Embedding_SDK`, `Library_and_Dashboards` (fixture Jira JSON)
- The parent initiative is “Enhance Embedding & Integration Capabilities” (fixture Jira JSON parent summary).

**Phase 1 implication:** context intake must treat this as an integration-heavy feature and ensure the initial evidence collection is routed through approved source families (Jira; plus any additional requested families if present in runtime task state).

### B) Embedding lifecycle assumptions
From the same Jira feature metadata:
- No explicit lifecycle steps are provided in the fixture excerpt beyond the embedding/integration theme.

**Phase 1 implication:** lifecycle assumptions are not fully specified in the fixture bundle; therefore Phase 1 must at minimum preserve the signal that lifecycle concerns likely exist (via labels/initiative) and avoid losing it during intake.

### C) Integration-sensitive customer expectations
From `BCED-1719.customer-scope.json` and the Jira fields:
- Customer reference present and explicit:
  - `{ CVS Pharmacy, Inc. - CS0928640 }`
- `customer_signal_present: true`
- Note: “Feature carries explicit customer references in Jira custom fields.”

**Phase 1 implication:** context intake must preserve customer sensitivity as a first-class context signal and ensure downstream phases can incorporate it (e.g., keep it in context artifacts / lookup). In the orchestrator contract, this is done by proper evidence collection and persistence under `context/` (Phase 0/1 families).

---

## Phase 1 contract alignment (orchestrator expectations)

### What Phase 1 is allowed/required to do (per snapshot)
From `skill_snapshot/SKILL.md` and `skill_snapshot/reference.md`:
- Phase 1 work: **“generate one spawn request per requested source family plus support-only Jira digestion requests when provided”**.
- Output: `phase1_spawn_manifest.json`
- Phase 1 `--post`: validate spawn policy, evidence completeness, support relation map, support summaries, and non-defect routing. On failure: exit `2` with `REMEDIATION_REQUIRED: <source_family>`.

### What this benchmark can verify with provided evidence
The benchmark evidence bundle does **not** include any generated run artifacts (no `task.json`, no `run.json`, no `phase1_spawn_manifest.json`, no `context/` outputs). Therefore, we can only evaluate whether the **Phase 1 contract as defined** is capable of preserving the benchmark focus, and identify **what must be present** in a correct Phase 1 output for this feature.

---

## Required Phase 1 context-intake outcomes for BCED-1719 (advisory expectations)
To satisfy the benchmark focus for **BCED-1719** under the Phase 1 model, a correct Phase 1 implementation should ensure:

1) **Jira evidence is a requested/covered source family**
   - Because the only provided fixture evidence is Jira-derived, and customer context lives in Jira custom fields.
   - The Phase 1 spawn manifest should include at least one Jira evidence/digestion request.

2) **Customer expectation signal is not dropped**
   - Customer fields explicitly contain CVS/CS0928640.
   - Phase 1 should ensure this signal is preserved into `context/` artifacts later indexed by Phase 2 (`context/artifact_lookup_<feature-id>.md`).

3) **Embedding/integration component constraints are carried forward as context**
   - Labels (`Embedding_SDK`, `Library_and_Dashboards`) and parent initiative (“Enhance Embedding & Integration Capabilities”) must remain visible in the evidence collected in context.
   - Phase 1 should ensure the spawned Jira digestion captures at least: labels, parent summary, fixVersion, and any linked artifacts (none linked per `linked_issue_count: 0`).

4) **Support-only Jira policy is respected (if supporting issues exist)**
   - If `supporting_issue_keys` are provided in runtime state, Phase 1 must spawn support Jira digestions in `context_only_no_defect_analysis` mode and ensure the Phase 1 `--post` validations can build:
     - `context/supporting_issue_relation_map_<feature-id>.md`
     - `context/supporting_issue_summary_<issue-key>_<feature-id>.md` (or consolidated summary)

---

## Pass/Fail determination for this benchmark run

### Result: **BLOCKED (insufficient run artifacts to verify Phase 1 output)**
Reason: The provided evidence includes only:
- `BCED-1719.issue.raw.json`
- `BCED-1719.customer-scope.json`
- Orchestrator snapshot contracts

It does **not** include Phase 1 outputs (notably `phase1_spawn_manifest.json`) or runtime state (`task.json`) needed to verify:
- requested source families were translated into spawn requests
- customer context signals were persisted into `context/` artifacts
- Phase 1 `--post` validations passed

### Advisory note
This is a **phase contract** benchmark focused on context intake. To make this benchmark verifiable, the minimal additional evidence needed would be the generated:
- `phase1_spawn_manifest.json` for BCED-1719
- Phase 1 `--post` stdout (or validation history in `run.json`)

---

## Short execution summary
- Reviewed only the provided snapshot contracts and the BCED-1719 fixture bundle.
- Extracted integration/embedding and customer-sensitivity signals that Phase 1 must preserve.
- Could not verify actual Phase 1 spawn planning or validation because Phase 1 run artifacts were not provided.