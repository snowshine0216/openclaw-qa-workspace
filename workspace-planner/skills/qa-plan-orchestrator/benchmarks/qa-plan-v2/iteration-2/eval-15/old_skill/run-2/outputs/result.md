# Benchmark Evaluation — NE-P4A-COMPONENT-STACK-001 (qa-plan-orchestrator)

## Scope
- **Primary benchmark feature:** BCED-1719
- **Feature family / knowledge pack:** native-embedding
- **Primary phase under test:** **Phase 4a**
- **Evidence mode:** blind_pre_defect
- **Priority:** advisory
- **Case family:** phase contract
- **Focus requirement:** *single embedding component planning covers panel-stack composition, embedding lifecycle, and regression-sensitive integration states*

## What Phase 4a is required to do (contract check)
From the skill snapshot, Phase 4a is strictly:
- produce a **subcategory-only** QA plan draft (XMindMark)
- with structure: **central topic → subcategory → scenario → atomic action chain → observable verification leaves**
- and **must not** introduce canonical top-layer grouping (e.g., Security/Compatibility/E2E/i18n)

Key Phase 4a contract references in evidence:
- `skill_snapshot/references/phase4a-contract.md`
- `skill_snapshot/SKILL.md` and `skill_snapshot/reference.md` (orchestrator responsibilities + phase gating)

## Benchmark focus coverage vs Phase 4a contract
The benchmark focus demands that the Phase 4a output planning explicitly covers:
1. **Panel-stack composition**
2. **Embedding lifecycle**
3. **Regression-sensitive integration states**

### Determination (advisory)
- **Not verifiable from provided evidence.**
- The provided benchmark evidence set does **not** include:
  - `context/artifact_lookup_BCED-1719.md`
  - `context/coverage_ledger_BCED-1719.md`
  - `drafts/qa_plan_phase4a_r1.md` (or any Phase 4a draft)
  - `phase4a_spawn_manifest.json` for BCED-1719

Without the Phase 4a draft (or its spawn/validation artifacts), we cannot check whether the Phase 4a plan actually includes scenarios addressing panel-stack composition, embedding lifecycle, and regression-sensitive integration states.

## Phase alignment check (Phase 4a)
### Requirement
Output should align with **Phase 4a** (subcategory-only draft planning).

### Determination
- **Cannot be confirmed** because no Phase 4a output artifact is present in the evidence bundle.
- We can only restate the Phase 4a alignment rules from the contract, but we cannot verify execution/output conformance.

## Orchestrator-contract adherence (what can be assessed here)
Given the snapshot, the orchestrator must:
- call `scripts/phase4a.sh <feature-id> <run-dir>`
- if `SPAWN_MANIFEST:` is emitted, spawn per manifest exactly as-is, wait, then run `scripts/phase4a.sh ... --post`
- not write artifacts or perform phase logic inline

**Cannot be evaluated** in this benchmark submission because there are no run logs, manifests, or produced artifacts showing those steps.

## Overall benchmark verdict (advisory)
- **Result:** **BLOCKED / NOT DEMONSTRATED**
- **Reason:** The evidence bundle contains Jira issue metadata for BCED-1719, but contains **no Phase 4a artifacts** (draft plan, spawn manifest, or validation outputs). Therefore, the benchmark’s Phase 4a focus and alignment expectations cannot be demonstrated.

## What evidence would be required to pass this benchmark
To demonstrate satisfaction for NE-P4A-COMPONENT-STACK-001 (Phase 4a), the evidence set would minimally need:
- `drafts/qa_plan_phase4a_r1.md` for **BCED-1719**, showing subcategory-only scenarios that explicitly cover:
  - panel-stack composition (stacking, z-order, resize/layout, nested panels, host container interactions)
  - embedding lifecycle (init/load/render, re-render, dispose/unmount, navigation, session/connection transitions)
  - regression-sensitive integration states (host app state changes, partial failures, reloads, token/auth refresh, caching, cross-version behaviors)
- plus Phase 4a prerequisites and traceability artifacts:
  - `context/artifact_lookup_BCED-1719.md`
  - `context/coverage_ledger_BCED-1719.md`
- optional but strongly supportive for orchestrator verification:
  - `phase4a_spawn_manifest.json`
  - `scripts/phase4a.sh` stdout excerpt with `SPAWN_MANIFEST:` and the subsequent `--post` validation success