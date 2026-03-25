# NE-P1-CONTEXT-INTAKE-001 — Phase 1 Contract Check (BCED-1719 / native-embedding)

## Benchmark intent (what Phase 1 must preserve)
Case focus to be explicitly covered during **Phase 1 (context intake / spawn planning)**:
- **Component-stack constraints** (what systems/components the feature touches; where evidence must be sourced)
- **Embedding lifecycle assumptions** (create/update/publish/embed/run-time flows implied by “native embedding”)
- **Integration-sensitive customer expectations** (explicit customer signal and related expectations captured as context inputs)

Primary checkpoint under test: **phase1** (spawn manifest generation + Phase 1 post-validation expectations).

## Evidence available in this benchmark bundle (blind pre-defect)
From fixture evidence:
- `BCED-1719.issue.raw.json`
  - Jira key: **BCED-1719**
  - Parent initiative: **PRD-125 “Enhance Embedding & Integration Capabilities”**
  - Labels: **Embedding_SDK**, **Library_and_Dashboards**
  - FixVersion: **26.04**
  - Customer reference fields present (e.g., `customfield_10355`, `customfield_10586` contain **“{ CVS Pharmacy, Inc. - CS0928640 }”**)
  - No linked issues in this snapshot (`issuelinks`: [])
- `BCED-1719.customer-scope.json`
  - `customer_signal_present: true`
  - Notes: “Feature carries explicit customer references in Jira custom fields.”

## Phase 1 contract alignment assessment (qa-plan-orchestrator)
Phase 1 (per `skill_snapshot/SKILL.md` + `skill_snapshot/reference.md`) is responsible for:
- Generating **one spawn request per requested source family** (e.g., Jira/Confluence/GitHub) plus **support-only Jira digestion** when supporting issues are provided.
- Ensuring any supporting issues are explicitly marked **`context_only_no_defect_analysis`**.

### What can be validated from the provided evidence
Because this benchmark is **blind_pre_defect** and provides only the skill snapshot + Jira fixture exports (not an actual run directory with `phase1_spawn_manifest.json`), we can only verify **whether the orchestrator’s Phase 1 contract *would* preserve the required context constraints** when given this input.

#### 1) Component-stack constraints — covered at Phase 1 level (routing)
- The skill snapshot mandates source routing by **source family** and disallows substituting generic web fetch for Jira/Confluence/GitHub.
- For BCED-1719, the available evidence indicates this feature belongs to **native-embedding** and is labeled **Embedding_SDK** and **Library_and_Dashboards** (Jira).
- Phase 1’s expected behavior therefore must at least plan to ingest Jira as a primary evidence source (and optionally additional families if requested).

**Result:** *Advisory PASS (contract supports preserving component-stack constraints via source-family routing), but cannot be proven executed without an actual Phase 1 manifest artifact.*

#### 2) Embedding lifecycle assumptions — not directly capturable in Phase 1 without additional sources
- The fixture evidence does not include detailed description text, acceptance criteria, or technical workflow narratives (the issue JSON is truncated and no Confluence/GitHub artifacts are provided).
- Phase 1 contract itself does not synthesize lifecycle assumptions; it only spawns evidence collection tasks.

**Result:** *Advisory PARTIAL (Phase 1 can only preserve this by ensuring the correct source families are scheduled; lifecycle assumptions require downstream evidence ingestion/research in later phases).*

#### 3) Integration-sensitive customer expectations — identifiable and preservable in Phase 1
- `BCED-1719.customer-scope.json` explicitly flags `customer_signal_present: true` and references **CVS Pharmacy, Inc. / CS0928640**.
- Phase 1 contract (as defined) does not explicitly mention “customer expectation intake,” but it does require capturing support context when supporting issues are provided.
- In this specific bundle, there are **no linked issues** and no `supporting_issue_keys` provided in the evidence. Therefore, the customer signal exists but **cannot be translated into support-only Jira spawn requests** unless the run input includes supporting issue keys.

**Result:** *Advisory PARTIAL (customer expectations are detectable in Jira fields, but Phase 1’s explicit support-digestion pathway depends on supporting_issue_keys, which are not present in the provided evidence).*

## Phase 1 output alignment (required artifact)
Phase 1’s required deliverable is:
- `phase1_spawn_manifest.json`

This benchmark bundle does **not** include a generated `phase1_spawn_manifest.json` (no run directory artifacts provided), so **phase1 output alignment cannot be directly verified**.

## Verdict for NE-P1-CONTEXT-INTAKE-001 (advisory)
- **Meets phase1 contract in design**: The skill snapshot clearly defines Phase 1 responsibilities (spawn-per-source-family, support-only Jira policy, non-defect routing).
- **Cannot be fully demonstrated with provided evidence**: No actual Phase 1 spawn manifest exists in the evidence, so we cannot confirm the concrete spawn planning for BCED-1719.
- **Case focus coverage**:
  - Component-stack constraints: **Advisory PASS (by contract)**
  - Embedding lifecycle assumptions: **Advisory PARTIAL (needs additional evidence sources beyond bundle)**
  - Integration-sensitive customer expectations: **Advisory PARTIAL (customer signal present; support-spawn depends on inputs not provided)**

## Recommendations (within Phase 1 contract scope)
If this benchmark were executed (not just assessed from static evidence), Phase 1 should ensure:
- Requested source families include at minimum **Jira** for BCED-1719.
- The Phase 1 spawn tasks explicitly capture the **customer signal** (CVS / CS0928640) as **context**, and if any supporting tickets exist, digest them under **`context_only_no_defect_analysis`**.
- Any additional evidence families needed to preserve “native embedding” integration assumptions (e.g., SDK docs in Confluence, code/API in GitHub) are represented as Phase 1 spawn requests.