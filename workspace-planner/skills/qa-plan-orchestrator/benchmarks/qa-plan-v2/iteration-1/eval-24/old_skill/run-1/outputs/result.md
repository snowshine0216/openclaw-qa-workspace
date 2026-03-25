# NE-P1-CONTEXT-INTAKE-001 — Phase 1 Phase-Contract Check (Advisory)

## Scope
Benchmark case: **NE-P1-CONTEXT-INTAKE-001**
- Primary feature: **BCED-1719**
- Feature family / knowledge pack: **native-embedding**
- Primary phase under test: **Phase 1**
- Evidence mode: **blind_pre_defect**
- Priority: **advisory**
- Focus: **context intake preserves (1) component-stack constraints, (2) embedding lifecycle assumptions, and (3) integration-sensitive customer expectations**

This benchmark evaluates whether the **qa-plan-orchestrator Phase 1 contract**, as defined in the provided skill snapshot, is sufficient and correctly aligned to preserve the required context categories during **context intake / evidence spawning**.

## Evidence reviewed (authoritative for this benchmark)
- skill_snapshot/SKILL.md
- skill_snapshot/reference.md
- skill_snapshot/README.md
- fixture: BCED-1719-blind-pre-defect-bundle/BCED-1719.issue.raw.json (partial; truncated)
- fixture: BCED-1719-blind-pre-defect-bundle/BCED-1719.customer-scope.json

## Phase 1 contract alignment (what Phase 1 must do)
From the snapshot:
- **Phase 1 Entry**: `scripts/phase1.sh`
- **Work**: “generate one spawn request per requested source family plus support-only Jira digestion requests when provided”
- **Output**: `phase1_spawn_manifest.json`
- **Post step (`--post`)**: validate spawn policy, evidence completeness, support relation map, support summaries, and **non-defect routing**. On failure exits `2` and prints `REMEDIATION_REQUIRED: <source_family>`.

This is consistent with a **Phase 1 = context intake & routing** checkpoint; it does not draft QA scenarios, but ensures the system spawns the right evidence collection tasks and enforces guardrails.

## Case focus coverage: preservation of critical context during intake
### 1) Component-stack constraints — preserved (contract-level)
The snapshot explicitly frames Phase 1 as source-family spawning with a spawn-policy and evidence-completeness validation.
- By requiring “one spawn request per requested source family” and validating evidence completeness in `--post`, Phase 1 is contractually positioned to intake artifacts that normally encode **component-stack constraints** (e.g., SDK vs UI vs platform, integration surfaces), assuming the run’s `requested_source_families` includes the relevant families.
- However, in the provided benchmark evidence, **the actual `requested_source_families` for BCED-1719 is not available** (no `task.json` / `run.json` fixture), so we cannot confirm the run would definitely include all necessary component families for native-embedding.

Advisory finding: **Contract supports preserving component-stack constraints, but this benchmark bundle lacks the phase inputs needed to verify the selection of requested source families for BCED-1719.**

### 2) Embedding lifecycle assumptions — partially covered (needs explicit Phase 1 intake mapping)
The Phase 1 contract ensures evidence collection occurs, but the snapshot does **not** explicitly call out “embedding lifecycle assumptions” as a required intake dimension in Phase 1.
- The workflow likely expects lifecycle details to emerge from evidence artifacts and later mapping (Phase 2/3), but this benchmark is specifically about **Phase 1 context intake preserving those assumptions**.
- Without a native-embedding knowledge-pack excerpt or a Phase 1 manifest example, we cannot confirm Phase 1 ensures lifecycle-specific sources (e.g., SDK docs, integration guides, lifecycle states like init/auth/embed/refresh/teardown) are always included.

Advisory finding: **Phase 1’s generic source-family spawning can preserve lifecycle assumptions if the correct sources are requested, but the evidence provided does not demonstrate lifecycle-specific intake requirements at Phase 1.**

### 3) Integration-sensitive customer expectations — covered via customer signal + support-only policy, but ingestion path not fully evidenced
Customer signal evidence is present in the fixture:
- `BCED-1719.customer-scope.json` states: `customer_signal_present: true` and notes explicit customer references: “{ CVS Pharmacy, Inc. - CS0928640 }”.
- `BCED-1719.issue.raw.json` also includes custom fields containing the same customer reference.

From the snapshot, Phase 1 explicitly supports:
- support-only Jira artifacts under `context/` (relation maps and summaries)
- strict **support-only policy**: `context_only_no_defect_analysis`

But the fixture shows:
- No linked issues (`linked_issue_count: 0`)
- No supporting issue keys provided in evidence

So while the **policy** is present and Phase 1 `--post` includes validation for relation map / summaries when applicable, this bundle does not show actual supporting issue ingestion for BCED-1719.

Advisory finding: **Customer expectation signal is detectable in Jira fields; Phase 1 contract has a mechanism for support-only digestion when supporting issues are provided, but this benchmark bundle does not contain supporting issue keys or a Phase 1 manifest to confirm they would be requested/ingested for this feature.**

## Phase 1 orchestration contract adherence (critical for phase_contract)
The orchestrator responsibilities are correctly constrained in the snapshot:
- Orchestrator only calls `phaseN.sh`, spawns subagents from `phaseN_spawn_manifest.json`, waits, records completion for Phase 1, then calls `phase1.sh --post`.
- It must pass `sessions_spawn` args **exactly as-is** (no `streamTo`).

This matches the Phase 1 phase-contract expectation for script-driven intake.

## Verdict (advisory)
**Phase 1 alignment: PASS (contract-level), with advisory gaps due to missing run-time inputs.**

- The provided snapshot evidence shows Phase 1 is the correct checkpoint for **context intake via evidence spawning**, including post-validation and non-defect routing.
- The benchmark focus areas are **supported in principle** by the Phase 1 model (source-family collection + support-only digestion policy), but the provided evidence set does not include the Phase 1 manifest, the requested source families, or any supporting issue keys for BCED-1719—so we cannot demonstrate feature-specific preservation beyond the existence of customer signal in Jira fields.

## What would be needed to fully demonstrate this benchmark (still Phase 1-scoped)
Within Phase 1 artifacts/evidence (not provided in this bundle), the following would conclusively demonstrate preservation of the case focus:
- A `phase1_spawn_manifest.json` for BCED-1719 showing spawn requests that cover:
  - component stack surfaces relevant to native-embedding (SDK, embedding host, library/dashboards, integration APIs)
  - lifecycle-relevant documentation sources
  - customer/support context digestion requests when customer signal/supporting keys exist
- Phase 1 `--post` validation output indicating evidence completeness satisfied (or remediation required by source family)

---

## Execution summary
- Reviewed the **Phase 1 contract** in `SKILL.md` and `reference.md` and checked it against the benchmark focus (component-stack constraints, lifecycle assumptions, customer expectations) using only the provided fixtures.
- Determined the workflow is Phase 1-aligned and policy-complete at the contract level, but the fixture bundle lacks Phase 1 run artifacts (e.g., `phase1_spawn_manifest.json`, `task.json`) needed to prove feature-specific intake coverage for BCED-1719.