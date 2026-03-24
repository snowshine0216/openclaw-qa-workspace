# NE-P1-CONTEXT-INTAKE-001 — Phase 1 Contract Check (BCED-1719 / native-embedding)

## Scope
Benchmark focus (phase_contract, advisory): verify that **Phase 1 context intake** preserves:
1) **component-stack constraints**
2) **embedding lifecycle assumptions**
3) **integration-sensitive customer expectations**

Primary feature: **BCED-1719**
Feature family / knowledge pack: **native-embedding**
Evidence mode: **blind_pre_defect**

## Phase 1 expectations (from orchestrator contract)
Phase 1 is limited to:
- generating **one spawn request per requested source family**, plus **support-only Jira digestion** when supporting issues are provided
- producing `phase1_spawn_manifest.json`
- (post) validating spawn policy/evidence completeness/support summaries and enforcing **support-only = context_only_no_defect_analysis**

## Context-intake signals found in provided evidence (what Phase 1 must preserve)

### A) Component-stack constraints (native embedding + integration surface)
Evidence indicates this feature is about **embedding/integration capabilities** and specifically an **Embedding SDK** surface:
- Jira labels: `Embedding_SDK`, `Library_and_Dashboards` (BCED-1719.issue.raw.json)
- Parent initiative summary: **"Enhance Embedding & Integration Capabilities"** (BCED-1719.issue.raw.json)

Phase 1 intake implication (advisory): spawn/evidence collection must be compatible with an embedding stack that typically spans:
- client SDK (Embedding SDK)
- library/dashboard embedding endpoints and/or UI integration points
- REST API documentation as an expected evidence source family (see `customfield_10045` includes `REST API Doc` in BCED-1719.issue.raw.json)

### B) Embedding lifecycle assumptions
Only high-level lifecycle context is present in the blind bundle (no detailed lifecycle steps or acceptance criteria are included in the provided evidence). The available lifecycle-adjacent assumptions that Phase 1 should preserve are:
- This is a **New Feature** (BCED-1719.issue.raw.json `customfield_10041`: "New Feature")
- It is planned against a target release line `26.04` (BCED-1719.issue.raw.json fixVersions)

Phase 1 intake implication (advisory): ensure evidence routing does not prematurely narrow scope; Phase 1 should collect enough primary sources (e.g., Jira + REST API doc sources) so later phases can derive lifecycle scenarios (init/configure/embed/render/refresh/auth/permissions/upgrade compatibility, etc.).

### C) Integration-sensitive customer expectations
Strong explicit customer signal is present and must be preserved as first-class context:
- Customer reference: **CVS Pharmacy, Inc. – CS0928640** appears in multiple Jira custom fields (BCED-1719.customer-scope.json; also visible in BCED-1719.issue.raw.json)
- Fixture notes: **"Feature carries explicit customer references"** and `customer_signal_present: true` (BCED-1719.customer-scope.json)

Phase 1 intake implication (advisory): the spawn plan must treat customer-linked context as a key driver for source collection and later scenario framing (integration expectations, compatibility, rollout constraints), without doing defect analysis.

## Phase 1 alignment assessment (based only on provided evidence)

### What can be asserted
- The orchestrator’s Phase 1 contract (from SKILL snapshot) explicitly supports context intake by spawning per source family and (if present) support-only Jira digestion, with a strict **context_only_no_defect_analysis** policy for supporting issues.
- The fixture evidence provides concrete context signals that Phase 1 must carry forward:
  - embedding/integration scope (labels + parent initiative)
  - REST API doc as a likely evidence family
  - explicit customer expectation signal (CVS / CS0928640)

### What cannot be verified in blind-pre-defect mode with provided evidence
- No `phase1_spawn_manifest.json` output is provided in the fixture bundle, so we cannot verify:
  - which source families were requested
  - whether the manifest includes appropriate Jira/doc evidence requests
  - whether any support-only Jira requests (if any) are marked/handled per policy
  - whether Phase 1 `--post` validations were executed and passed

## Advisory conclusions (phase1 contract focus)
To satisfy this benchmark case, Phase 1 context intake must (at minimum) ensure the spawn manifest/evidence routing:
- keeps **Embedding_SDK** and **Library_and_Dashboards** component-stack constraints visible through evidence selection (Jira + API doc sources)
- does not lose the explicit **customer expectation signal (CVS / CS0928640)** during intake; it should be retained in `context/` artifacts and inform later coverage mapping
- avoids embedding-lifecycle narrowing until later phases have sufficient primary evidence; Phase 1 should prioritize broad, integration-relevant source capture

Given the absence of Phase 1 produced artifacts in the provided evidence, this check is **inconclusive for execution**, but the **required preserved constraints** are clearly identifiable from the fixture and must be reflected by any Phase 1 spawn/evidence plan.