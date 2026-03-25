# DOC-SYNC-001 — DOCS phase contract alignment check (qa-plan-orchestrator)

## Scope (per benchmark focus)
Check that these doc artifacts are mutually aligned and continue to express the same orchestrator contract and phase model:

- `SKILL.md`
- `README.md`
- `reference.md`
- AGENTS docs (not provided in evidence bundle)

Primary phase/checkpoint under test: **docs** (documentation synchronization / contract coherence).

## Evidence inspected
- `skill_snapshot/SKILL.md`
- `skill_snapshot/README.md`
- `skill_snapshot/reference.md`
- `fixture:DOCS-blind-pre-defect-bundle/README.md`
- `fixture:DOCS-blind-pre-defect-bundle/reference.md`

No AGENTS documentation was included in the provided benchmark evidence.

## Alignment results

### 1) Orchestrator responsibilities & “script-driven only” contract
**SKILL.md states** the orchestrator has exactly three responsibilities:
1) call `phaseN.sh`
2) interact with user only when approval / `REPORT_STATE` choice is required
3) spawn subagents from `phaseN_spawn_manifest.json`, wait, then run `phaseN.sh --post`

**reference.md reinforces** that phase gates/validators are script-facing and the orchestrator consumes spawn manifests by passing `requests[].openclaw.args` to `sessions_spawn` **exactly as-is**.

**README.md is consistent** with the “entrypoint + contract + references” split and does not contradict the “no inline phase logic” rule.

**Status:** aligned across `SKILL.md` / `reference.md` / `README.md`.

### 2) Phase model consistency (0–7), artifacts, and gating
Across `SKILL.md` and `reference.md`, the phase list and responsibilities match:

- **Phase 0**: initialization + `REPORT_STATE` + request normalization; writes runtime setup + request fulfillment artifacts.
- **Phase 1**: spawn per source family; `--post` validates evidence completeness and support-only routing; Phase 1 special step to record spawn completion.
- **Phase 2**: build `context/artifact_lookup_<feature-id>.md`.
- **Phase 3**: Tavily-first deep research + coverage ledger; knowledge pack retrieval/indexing; `--post` validates ledger + research ordering + sync.
- **Phases 4a/4b/5a/5b/6**: draft/review/refactor/final quality passes with bounded supplemental research constraints.
- **Phase 7**: promote final after explicit approval; archive previous final; generate final plan summary; attempt notification.

Artifact family lists in `reference.md` are consistent with `README.md`’s “What this produces” section (context artifacts, drafts, manifests, final promotion).

**Status:** aligned across `SKILL.md` / `reference.md` / `README.md`.

### 3) Spawn manifest & sessions_spawn contract consistency
**reference.md explicitly defines**:
- manifest JSON shape
- orchestrator behavior: spawn each `requests[].openclaw.args`
- **do not add `streamTo`** (only for `runtime:"acp"`, manifests are `runtime:"subagent"`)

**SKILL.md repeats** the same “pass args as-is; do not add streamTo” instruction.

**Status:** aligned across `SKILL.md` / `reference.md`.

### 4) Support-only Jira and deep research ordering guardrails
**SKILL.md / README.md / reference.md agree** on:
- supporting issues are **context-only**, `context_only_no_defect_analysis`
- report-editor deep research is **Tavily-first**, Confluence only as recorded fallback
- supplemental research is bounded and only allowed after prerequisites

**Status:** aligned.

### 5) Docs-set synchronization check (snapshot vs fixture)
The provided fixture copies of `README.md` and `reference.md` are consistent with the `skill_snapshot` versions in all sections shown.

**Status:** aligned.

## Gaps / blockers relative to benchmark focus

### AGENTS docs not verifiable from provided evidence
The benchmark focus explicitly includes **“AGENTS docs stay aligned”**, but no AGENTS documentation content/path was provided in the evidence bundle.

- In blind evidence mode, we must not assume additional files exist beyond the evidence.
- Therefore, we cannot confirm cross-document alignment that includes AGENTS docs.

**Impact:** partial completion of the benchmark focus; alignment verified for `SKILL.md`, `README.md`, and `reference.md`, but **AGENTS alignment is unverified**.

## Conclusion (advisory)
- **PASS (partial)** for the docs phase contract check: `SKILL.md`, `README.md`, and `reference.md` are mutually consistent and preserve the orchestrator’s script-driven phase model and spawn/validator contract.
- **BLOCKED** for the “AGENTS docs stay aligned” portion due to missing AGENTS evidence in the provided bundle.