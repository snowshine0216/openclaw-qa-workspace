# Feature QA Planning — Agent Design

> **Design ID:** `feature-qa-planning-redesign-2026-03-06`
> **Date:** 2026-03-06
> **Status:** Implemented
> **Scope:** Redesign `workspace-planner/.agents/workflows/feature-qa-planning.md` into a skill-first planner workflow, replace it with `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md`, and record the implemented migration state.
>
> **Constraint:** This is a design artifact. Do not implement until approved.

---

## 0. Environment Setup

- **Design-time inputs:** `workspace-planner/.agents/workflows/feature-qa-planning.md`, `workspace-planner/docs/qa-plan-fix/QA_PLAN_FIX_PLAN.md`, `workspace-planner/docs/qa-plan-fix/QA_PLAN_QUALITY_GATE_DESIGN.md`, `workspace-planner/docs/QA_PLAN_DEFECT_ANALYSIS_INTEGRATION_DESIGN.md`, `workspace-planner/docs/IDEMPOTENCY_REVIEW_QA_PLAN_WORKFLOW.md`, `workspace-planner/docs/QA_PLAN_WORKFLOW_ENHANCEMENT_2026-02-27.md`
- **OpenClaw references consulted:** `.agents/skills/openclaw-agent-design/SKILL.md`, `.agents/skills/openclaw-agent-design/reference.md`, `.agents/skills/openclaw-agent-design-review/SKILL.md`, `.agents/skills/agent-idempotency/SKILL.md`, `.agents/skills/code-structure-quality/SKILL.md`, `.agents/skills/clawddocs/SKILL.md`, `docs/bestpractice-openclaw.md`, `docs/SKILL_SHELL_WORKFLOW_ENHANCEMENT_DESIGN.md`
- **Validation commands used by this design:** `workspace-planner/projects/feature-plan/scripts/check_resume.sh`, `jq`, `rg`, `.agents/skills/openclaw-agent-design-review/scripts/check_design_evidence.sh`
- **Future implementation prerequisites:** `gh`, `jira`, `confluence`, `jq`, and the existing planner/reporter workspace layout.

No special setup is required to review this design artifact.

## 1. Design Deliverables

| Action | Path | Notes |
|--------|------|-------|
| CREATE | `workspace-planner/docs/FEATURE_QA_PLANNING_REDESIGN_2026-03-06.md` | canonical redesign artifact; now records the implemented migration from the legacy workflow to the orchestrator skill |
| CREATE | `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md` | implemented workspace-local entrypoint skill contract for the redesigned workflow |
| CREATE | `workspace-planner/skills/feature-qa-planning-orchestrator/reference.md` | implemented canonical phase/state notes for the planner workflow |
| REMOVE | `workspace-planner/.agents/workflows/feature-qa-planning.md` | completed; removed after `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md` became the canonical entrypoint |
| UPDATE | `workspace-planner/skills/qa-plan-synthesize/SKILL.md` | completed synthesis, translation-pass, self-healing, and dynamic-versioning updates |
| UPDATE | `workspace-planner/skills/qa-plan-github/SKILL.md` | completed user-facing scenario translation and Test Scope routing updates |
| UPDATE | `workspace-planner/skills/qa-plan-review/SKILL.md` | completed User Executability blocking gate and report contract updates |
| UPDATE | `workspace-planner/skills/qa-plan-refactor/SKILL.md` | completed bounded refactor-loop and UE-fix mapping updates |
| UPDATE | `workspace-planner/skills/qa-plan-confluence-review/SKILL.md` | completed live-page verification alignment with the redesigned publication loop |
| UPDATE | `workspace-planner/projects/feature-plan/scripts/check_resume.sh` | completed preservation of `REPORT_STATE` plus defect-analysis-aware resume support |
| UPDATE | `workspace-planner/AGENTS.md` | completed routing update to the new skill-first entrypoint and explicit removal of the legacy workflow after orchestrator setup |

### 1.1 Supersession and Reference Table

This design superseded `workspace-planner/.agents/workflows/feature-qa-planning.md` as the **target architecture**. The migration is now implemented: `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md` is the canonical entrypoint, and the legacy workflow file has been removed.

| Current Artifact / Phase | Related Fix Package Source | Recommended Design Action | Implementation Timing |
|---|---|---|---|
| `workspace-planner/.agents/workflows/feature-qa-planning.md` | `workspace-planner/docs/qa-plan-fix/QA_PLAN_QUALITY_GATE_DESIGN.md`, `workspace-planner/docs/IDEMPOTENCY_REVIEW_QA_PLAN_WORKFLOW.md` | replaced as the canonical design source with a workspace-local orchestrator skill; legacy workflow file removed | implemented |
| Phase 0 preparation / resume | `workspace-planner/docs/IDEMPOTENCY_REVIEW_QA_PLAN_WORKFLOW.md`, `.agents/skills/openclaw-agent-design/reference.md` | preserved `REPORT_STATE` and archive-before-overwrite rules; added additive resume metadata only | implemented |
| Phase 1 context acquisition | `workspace-planner/docs/QA_PLAN_WORKFLOW_ENHANCEMENT_2026-02-27.md`, `workspace-planner/docs/qa-plan-fix/QA_PLAN_QUALITY_GATE_DESIGN.md` | normalized PR handling, validated GitHub diff artifacts, and routed refresh behavior through freshness-aware rules | implemented |
| Phase 2 parallel analysis | `workspace-planner/docs/QA_PLAN_DEFECT_ANALYSIS_INTEGRATION_DESIGN.md` | kept planner-local orchestration, reused reporter defect-analysis capability directly, and blocked synthesis until required parallel tasks finish | implemented |
| Phase 3 synthesis | `workspace-planner/docs/qa-plan-fix/QA_PLAN_FIX_PLAN.md`, `workspace-planner/docs/qa-plan-fix/QA_PLAN_QUALITY_GATE_DESIGN.md` | added translation pass, AUTO routing, self-healing UE checks, and dynamic draft versioning | implemented |
| Phase 4 review / refactor | `workspace-planner/docs/qa-plan-fix/QA_PLAN_QUALITY_GATE_DESIGN.md` | enforced a blocking `qa-plan-review` gate with max 2 refactor loops and explicit report artifacts | implemented |
| Phase 5 publication / live review | `workspace-planner/docs/IDEMPOTENCY_REVIEW_QA_PLAN_WORKFLOW.md` | preserved archive-before-overwrite, versioned live review outputs, and persisted notification fallback in `run.json` | implemented |
| `workspace-planner/skills/qa-plan-github/SKILL.md` | `workspace-planner/docs/qa-plan-fix/QA_PLAN_QUALITY_GATE_DESIGN.md` | materially redesigned to emit user-facing scenarios plus separate traceability output | implemented |
| `workspace-planner/skills/qa-plan-synthesize/SKILL.md` | `workspace-planner/docs/qa-plan-fix/QA_PLAN_QUALITY_GATE_DESIGN.md`, `workspace-planner/docs/QA_PLAN_DEFECT_ANALYSIS_INTEGRATION_DESIGN.md` | materially redesigned to own translation, merge, self-check, and draft-version policy | implemented |
| `workspace-planner/skills/qa-plan-review/SKILL.md` | `workspace-planner/docs/qa-plan-fix/QA_PLAN_QUALITY_GATE_DESIGN.md` | materially redesigned to make User Executability violations blocking | implemented |
| `workspace-planner/skills/qa-plan-refactor/SKILL.md` | `workspace-planner/docs/qa-plan-fix/QA_PLAN_QUALITY_GATE_DESIGN.md` | materially redesigned to map UE failures to deterministic fixes and bounded loops | implemented |

## 2. AGENTS.md Sync

Sections updated in `workspace-planner/AGENTS.md` during implementation:

- **Core Workflow: Feature QA Planning** — route to `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md` as the canonical entrypoint and state that `workspace-planner/.agents/workflows/feature-qa-planning.md` is removed once orchestrator setup is complete.
- **Skills Reference** — add the new orchestrator skill and revise descriptions for `qa-plan-synthesize`, `qa-plan-github`, `qa-plan-review`, and `qa-plan-refactor` to match the new contracts.
- **Workflow/Design Routing** — add a pointer to `workspace-planner/docs/FEATURE_QA_PLANNING_REDESIGN_2026-03-06.md` as the superseding design record.
- **Shared vs Local Rules** — state explicitly that QA-plan orchestration remains workspace-local, while `jira-cli`, `confluence`, `feishu-notify`, and reporter-side defect-analysis utilities are reused directly as shared/cross-workspace dependencies rather than wrapped.

## 3. Skills Design

All new or materially redesigned skills below require `skill-creator` during implementation. Placement and boundaries below apply `code-structure-quality`: planner orchestration remains local, direct shared-skill reuse remains explicit, and shell helpers stay behind the skill contract.

### 3.1 `feature-qa-planning-orchestrator` skill

Planned path: `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md`

Classification:
- `workspace-local`

Why this placement:
- The workflow owns planner-specific orchestration, planner-local output paths, planner-local `task.json` semantics, and planner-local handoffs to `qa-plan-*` skills.
- It should not become a shared skill because the artifact layout (`workspace-planner/projects/feature-plan/<feature-id>/...`) and planner review/publish loop are specific to the planner workspace.

Inputs:
- `feature_id`: string, example `BCIN-6709`
- `jira_key`: string, example `BCIN-6709`
- `confluence_url`: string, example `https://.../pages/...`
- `github_pr_urls`: array<string>, example `["https://github.com/org/repo/pull/123"]`
- `figma_url`: string or null, example `https://www.figma.com/file/...`
- `qa_plan_background_path`: path or null, example `workspace-planner/projects/feature-plan/BCIN-6709/context/qa_plan_background_BCIN-6709.md`

Outputs:
- Planner work directory at `workspace-planner/projects/feature-plan/<feature-id>/`
- Draft artifacts `drafts/qa_plan_v<N>.md`
- Final artifact `qa_plan_final.md`
- Live review artifacts and handoff metadata in `task.json` / `run.json`

Existing skills reused directly:
- `jira-cli` — direct Jira fetches and issue context are already covered
- `confluence` — direct page read/update/create operations are already covered
- `feishu-notify` — final notification transport exists already; only fallback persistence is needed
- `workspace-planner/skills/qa-plan-atlassian/SKILL.md` — local domain summary generation remains sufficient
- `workspace-planner/skills/qa-plan-figma/SKILL.md` — local domain summary generation remains sufficient when Figma exists

### 3.2 `qa-plan-github` skill

Planned path: `workspace-planner/skills/qa-plan-github/SKILL.md`

Classification:
- `workspace-local`

Why this placement:
- The contract is optimized for planner-specific QA-plan outputs, including user-facing scenario translation, test-scope routing, and planner-local context filenames.

Inputs:
- Per-PR metadata files under `workspace-planner/projects/feature-plan/<feature-id>/context/`
- Per-PR diff files under `workspace-planner/projects/feature-plan/<feature-id>/context/`

Outputs:
- `workspace-planner/projects/feature-plan/<feature-id>/context/qa_plan_github_<feature-id>.md`
- `workspace-planner/projects/feature-plan/<feature-id>/context/qa_plan_github_traceability_<feature-id>.md`

Existing skills reused directly:
- `github` — direct PR and diff access is sufficient for underlying fetches

Design note:
- This skill is materially redesigned. `skill-creator` must revise the contract so code vocabulary remains in traceability outputs, while manual QA scenario text becomes user-facing and executable.

### 3.3 `qa-plan-synthesize` skill

Planned path: `workspace-planner/skills/qa-plan-synthesize/SKILL.md`

Classification:
- `workspace-local`

Why this placement:
- The synthesis contract owns the planner’s 9-section QA-plan format, test-key-point table layout, draft versioning, and merge rules across planner-local context artifacts.

Inputs:
- Atlassian, GitHub, Figma, background, and optional defect-analysis summaries from `workspace-planner/projects/feature-plan/<feature-id>/context/`

Outputs:
- Next draft file `workspace-planner/projects/feature-plan/<feature-id>/drafts/qa_plan_v<N+1>.md`
- Updated `latest_draft_version` in `task.json`

Existing skills reused directly:
- `workspace-planner/skills/qa-plan-atlassian/SKILL.md` — remains the owner of requirements/background extraction
- `workspace-planner/skills/qa-plan-github/SKILL.md` — remains the owner of GitHub-derived traceability and scenario inputs

Design note:
- This skill is materially redesigned. `skill-creator` must add the translation pass, User Executability self-healing loop, AUTO section routing, defect-analysis merge rules, and dynamic draft versioning.

### 3.4 `qa-plan-review` skill

Planned path: `workspace-planner/skills/qa-plan-review/SKILL.md`

Classification:
- `workspace-local`

Why this placement:
- The review rubric is specific to the planner’s QA-plan format, user-executability expectations, and feature-plan directory contracts.

Inputs:
- Latest draft plus planner context artifacts

Outputs:
- Review artifact `workspace-planner/projects/feature-plan/<feature-id>/qa_plan_review_<feature-id>_<date>.md`
- Structured review status `Approved | Requires Updates | Rejected`

Existing skills reused directly:
- None required beyond planner-local skill inputs

Design note:
- This skill is materially redesigned. `skill-creator` must codify UE-1..UE-6 as blocking review dimensions and preserve the current max-two refactor loop owned by the orchestrator.

### 3.5 `qa-plan-refactor` skill

Planned path: `workspace-planner/skills/qa-plan-refactor/SKILL.md`

Classification:
- `workspace-local`

Why this placement:
- Refactors planner-local drafts in planner-local format and is tightly coupled to `qa-plan-review` findings.

Inputs:
- Latest planner draft
- Review report path from `qa-plan-review`

Outputs:
- Next planner draft `workspace-planner/projects/feature-plan/<feature-id>/drafts/qa_plan_v<N+1>.md`

Existing skills reused directly:
- None required beyond planner-local review artifacts

Design note:
- This skill is materially redesigned. `skill-creator` must map UE findings to deterministic fix actions and align with dynamic draft versioning.

### 3.6 `qa-plan-confluence-review` skill

Planned path: `workspace-planner/skills/qa-plan-confluence-review/SKILL.md`

Classification:
- `workspace-local`

Why this placement:
- The review compares planner-specific QA-plan structure against the published Confluence rendering and planner context artifacts.

Inputs:
- Confluence page ID
- Final plan and planner context artifacts

Outputs:
- `workspace-planner/projects/feature-plan/<feature-id>/qa_plan_confluence_review_v<N>.md`

Existing skills reused directly:
- `confluence` — direct fetch/update behavior is already sufficient for the transport layer

Design note:
- This skill is adjusted, not fundamentally re-scoped. `skill-creator` is still required because its review artifact versioning and fail-loop contract change materially.

## 4. Workflow Design (Skill-First)

Entrypoint skill path: `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md`

### Phase 0: Existing-State Check and Run Preparation

Actions:
1. Run the existing Phase 0 check through `workspace-planner/projects/feature-plan/scripts/check_resume.sh <feature-id>`.
2. Preserve the canonical `REPORT_STATE` contract from `.agents/skills/openclaw-agent-design/reference.md`.
3. Present state-appropriate user choices without auto-selecting destructive options:
   - `FINAL_EXISTS` → `Use Existing | Smart Refresh | Full Regenerate`
   - `DRAFT_EXISTS` → `Resume | Smart Refresh | Full Regenerate`
   - `CONTEXT_ONLY` → `Generate from Cache | Re-fetch + Regenerate`
   - `FRESH` → initialize state and proceed
4. If overwrite or regenerate is selected, archive existing outputs before writing replacements.
5. Initialize or update `task.json` and `run.json` additively, preserving current semantics and the existing `defect_analysis` state machine.

User Interaction:
1. Done: existing status is classified, freshness is displayed, and safe choices are presented.
2. Blocked: waiting for user choice when prior final output, drafts, or cached context exist.
3. Questions: use existing output, smart refresh, full regenerate, resume, generate from cache, re-fetch + regenerate, and defect-analysis resume/skip when applicable.
4. Assumption policy: never auto-pick `Full Regenerate`, never auto-archive without explicit user intent, and stop if output freshness is ambiguous.

State Updates:
1. Preserve current `REPORT_STATE` handling.
2. `task.json.overall_status = "in_progress"` when work proceeds.
3. `task.json.current_phase = "phase_0_preparation"`.
4. `task.json.defect_analysis` remains additive with states `not_applicable | pending | in_progress | completed | skipped`.
5. `run.json.updated_at` is refreshed on each write.

Verification:
```bash
workspace-planner/projects/feature-plan/scripts/check_resume.sh <feature-id>
jq -r '.overall_status,.current_phase,.defect_analysis // "missing"' workspace-planner/projects/feature-plan/<feature-id>/task.json
jq -r '.data_fetched_at,.output_generated_at,.notification_pending,.updated_at' workspace-planner/projects/feature-plan/<feature-id>/run.json
```

### Phase 1: Context Acquisition and Normalization

Actions:
1. Normalize incoming Jira, Confluence, GitHub PR, and optional Figma/background inputs.
2. Fetch source artifacts concurrently using the existing CLI/tooling contracts.
3. For GitHub, validate that each expected `context/github_<owner>_<repo>_pr<id>.diff` and `context/github_pr_<owner>_<repo>_pr<id>.json` artifact exists before the phase completes.
4. On `Smart Refresh`, re-fetch only sources that are stale, missing, or explicitly requested; on `Full Regenerate`, archive output and clear stale context safely before re-fetching.
5. Persist source freshness timestamps in `run.json` and per-domain timestamps in `task.json.subtask_timestamps`.

User Interaction:
1. Done: normalized source list, fetched context, and validated GitHub artifacts.
2. Blocked: missing required feature identifiers, inaccessible core artifacts, or user confirmation required for stale-cache reuse.
3. Questions: whether to proceed using cached data when a source is temporarily unavailable.
4. Assumption policy: never silently continue with stale source data unless the user explicitly accepts a freshness warning.

State Updates:
1. `task.json.current_phase = "phase_1_context_acquisition"`
2. `task.json.phases.phase_1_context_acquisition.status = "completed"` when all required artifacts are present.
3. `run.json.data_fetched_at` is updated when source fetch completes.

Verification:
```bash
rg --files workspace-planner/projects/feature-plan/<feature-id>/context
test -f workspace-planner/projects/feature-plan/<feature-id>/context/jira.json
test -f workspace-planner/projects/feature-plan/<feature-id>/context/confluence.md
```

### Phase 2: Parallel Domain Analysis and Defect-Aware Enrichment

Actions:
1. Spawn planner-local domain skills in parallel: `qa-plan-atlassian`, `qa-plan-github`, and `qa-plan-figma` when Figma exists.
2. Check for existing defect-analysis outputs using the reporter-side contract described in `workspace-planner/docs/QA_PLAN_DEFECT_ANALYSIS_INTEGRATION_DESIGN.md`.
3. Reuse reporter outputs directly when available; otherwise offer `Use Existing | Re-run defect analysis | Skip defect analysis` and treat defect-analysis failure as non-fatal.
4. Do not begin synthesis until required domain summaries complete and any chosen defect-analysis path reaches `completed` or `skipped`.
5. Copy approved defect-analysis output into planner context as `qa_plan_defect_analysis_<feature-id>.md` when available.

User Interaction:
1. Done: all required domain summaries exist, and defect analysis is either completed or intentionally skipped.
2. Blocked: waiting for defect-analysis approval path or required domain-skill completion.
3. Questions: whether to reuse an existing defect report, re-run it, or skip it.
4. Assumption policy: defect analysis is optional but never silently assumed complete; if approval is pending, stop and ask.

State Updates:
1. `task.json.current_phase = "phase_2_parallel_analysis"`
2. `task.json.defect_analysis` transitions `not_applicable -> pending -> in_progress -> completed` or `skipped`.
3. `task.json.subtask_timestamps` captures each domain-analysis completion time.

Verification:
```bash
rg --files workspace-planner/projects/feature-plan/<feature-id>/context | rg 'qa_plan_(atlassian|github|figma|defect_analysis)'
jq -r '.defect_analysis,.subtask_timestamps' workspace-planner/projects/feature-plan/<feature-id>/task.json
```

### Phase 3: Synthesis, Translation Pass, and Draft Versioning

Actions:
1. Invoke `qa-plan-synthesize` using the domain summaries and optional defect-analysis context.
2. Apply the `workspace-planner/docs/qa-plan-fix/QA_PLAN_QUALITY_GATE_DESIGN.md` translation rules before any manual-row text is written.
3. Route code/internal-only checks into `### AUTO: Automation-Only Tests` and keep code vocabulary only in traceability or `Related Code Change` columns.
4. Run the User Executability self-check and self-healing loop for R1-R6 / UE-1..UE-6 before saving.
5. Determine the next draft version dynamically from `task.json.latest_draft_version` or existing `drafts/qa_plan_v*.md`, then write `qa_plan_v<N+1>.md`.

User Interaction:
1. Done: a new draft exists, UE rules were applied, and the draft version advanced cleanly.
2. Blocked: synthesis inputs are incomplete or required source clarity is missing.
3. Questions: approval to proceed with the explicit synthesis intent prompt when user-executability transformation is required.
4. Assumption policy: if an observable user-facing outcome cannot be inferred confidently, stop and ask instead of copying code vocabulary into manual QA rows.

State Updates:
1. `task.json.current_phase = "phase_3_synthesis"`
2. `task.json.latest_draft_version = <N+1>`
3. `task.json.phases.phase_3_synthesis.status = "completed"`

Verification:
```bash
ls workspace-planner/projects/feature-plan/<feature-id>/drafts/qa_plan_v*.md
jq -r '.latest_draft_version,.current_phase' workspace-planner/projects/feature-plan/<feature-id>/task.json
```

### Phase 4: Review and Bounded Refactor Loop

Actions:
1. Invoke `qa-plan-review` on the latest draft with the required planner context artifacts.
2. Treat User Executability findings and coverage gaps as blocking review findings.
3. If status is `Requires Updates`, invoke `qa-plan-refactor` and re-run `qa-plan-review`.
4. Limit automated refactor loops to 2 rounds; after round 2, return control to the user if approval is still blocked.
5. If status is `Rejected`, stop without publication.

User Interaction:
1. Done: review status is `Approved`, or the user receives a bounded unresolved-finding report.
2. Blocked: waiting for review or user decision after max refactor loops.
3. Questions: whether to continue after unresolved review findings beyond the automatic limit.
4. Assumption policy: never publish when review status is `Rejected` or unresolved after the bounded loop without explicit user direction.

State Updates:
1. `task.json.current_phase = "phase_4_review_refactor"`
2. `task.json.phases.phase_4_review_refactor.status = "in_progress" | "completed"`
3. On loopback from live review failures, reset `task.json.current_phase = "phase_4_review_refactor"` explicitly.

Verification:
```bash
test -f workspace-planner/projects/feature-plan/<feature-id>/qa_plan_review_<feature-id>_<date>.md
jq -r '.current_phase,.latest_draft_version' workspace-planner/projects/feature-plan/<feature-id>/task.json
```

### Phase 5: Publication, Live Review, and Notification Fallback

Actions:
1. Archive any existing `qa_plan_final.md` before copying the approved latest draft into place.
2. Write `qa_plan_final.md`, refresh `run.json.output_generated_at`, and generate a deterministic `changelog.md` policy (overwrite or idempotent append).
3. Publish to Confluence using direct `confluence` skill/CLI reuse.
4. Run `qa-plan-confluence-review` and version its artifacts as `qa_plan_confluence_review_v<N>.md`.
5. If live review fails for plan-generation reasons, loop back to Phase 4; if notification/publish confirmation cannot complete, store the retry payload in `run.json.notification_pending`.
6. Reuse `feishu-notify` directly for final notification; do not introduce a planner-specific wrapper.

User Interaction:
1. Done: final plan exists, publication is verified, and any pending notification is persisted for retry.
2. Blocked: Confluence page ID is missing, publication verification fails, or manual live-page fixes are required.
3. Questions: create vs update when no Confluence page ID exists, and whether to proceed with manual fixes.
4. Assumption policy: never create or update a live Confluence page without a resolvable page target or explicit user confirmation.

State Updates:
1. `task.json.current_phase = "phase_5_publication"` then `"completed"`
2. `task.json.overall_status = "completed"` only after live review completion or explicit accepted exception.
3. `run.json.output_generated_at` and `run.json.notification_pending` remain the canonical publication/notification freshness fields.

Verification:
```bash
test -f workspace-planner/projects/feature-plan/<feature-id>/qa_plan_final.md
ls workspace-planner/projects/feature-plan/<feature-id>/qa_plan_confluence_review_v*.md
jq -r '.output_generated_at,.notification_pending // empty' workspace-planner/projects/feature-plan/<feature-id>/run.json
```

### Status Transition Map

| From | Event | To |
|---|---|---|
| `FRESH` | user confirms new run | `phase_1_context_acquisition` |
| `FINAL_EXISTS` | Use Existing | `completed` |
| `FINAL_EXISTS` | Smart Refresh | `phase_1_context_acquisition` |
| `FINAL_EXISTS` | Full Regenerate | `phase_1_context_acquisition` |
| `DRAFT_EXISTS` | Resume | `phase_4_review_refactor` or saved `resume_from` phase |
| `DRAFT_EXISTS` | Smart Refresh | `phase_1_context_acquisition` |
| `DRAFT_EXISTS` | Full Regenerate | `phase_1_context_acquisition` |
| `CONTEXT_ONLY` | Generate from Cache | `phase_3_synthesis` |
| `CONTEXT_ONLY` | Re-fetch + Regenerate | `phase_1_context_acquisition` |
| `phase_4_review_refactor` | review approved | `phase_5_publication` |
| `phase_5_publication` | live review fails with generation fixes | `phase_4_review_refactor` |
| any | unrecoverable error | `failed` |

## 5. State Schemas

### `task.json`

Path: `workspace-planner/projects/feature-plan/<feature-id>/task.json`

Fields:
- `run_key`: string
- `overall_status`: string
- `current_phase`: string
- `created_at`: ISO8601
- `updated_at`: ISO8601
- `phases`: object
- `defect_analysis`: `not_applicable | pending | in_progress | completed | skipped`
- `latest_draft_version`: integer or null
- `subtask_timestamps`: object keyed by domain name
- `confluence_page_id`: string or null when already known

Write rule:
- Preserve existing semantics and existing phase detail.
- Add `defect_analysis`, `latest_draft_version`, and `subtask_timestamps` only as additive fields.
- Update `updated_at` on every write.
- If legacy runs lack these fields, infer safely and backfill without deleting older keys.

### `run.json`

Path: `workspace-planner/projects/feature-plan/<feature-id>/run.json`

Fields:
- `data_fetched_at`: ISO8601 or null
- `output_generated_at`: ISO8601 or null
- `notification_pending`: string or null
- `updated_at`: ISO8601

Write rule:
- Preserve current semantics by using `run.json` as the canonical freshness and notification-fallback file.
- Keep changes additive and backward-compatible.
- When cached content is used after source-fetch failure, retain the normal timestamps and surface the staleness warning in output artifacts rather than mutating the schema.

## 6. Implementation Layers

### Skill Placement Rules

- Shared reusable capability → `.agents/skills/<skill-name>/`
- Workspace-specific capability → `workspace-planner/skills/<skill-name>/`
- Shell/Node helpers for planner skills → `workspace-planner/skills/<skill-name>/scripts/`
- Existing project-state helpers that must remain stable during migration → `workspace-planner/projects/feature-plan/scripts/`

### Existing Shared Skills to Reuse Directly

Reuse existing shared skills directly by default:
- `jira-cli`
- `confluence`
- `feishu-notify`

Do not create planner-local wrappers for these skills unless a future implementation proves a real contract gap.

### Boundary Recommendations (`code-structure-quality`)

- Keep orchestration decisions in `feature-qa-planning-orchestrator`.
- Keep source-specific interpretation inside `qa-plan-atlassian`, `qa-plan-github`, and `qa-plan-figma`.
- Keep synthesis-only transformations in `qa-plan-synthesize`.
- Keep review criteria in `qa-plan-review` and fix application in `qa-plan-refactor`.
- Keep external publication and rendering verification in `confluence` plus `qa-plan-confluence-review`.
- Keep `workspace-planner/projects/feature-plan/scripts/check_resume.sh` as the canonical Phase 0 helper during migration rather than duplicating its logic in multiple skills.
- Reuse `workspace-reporter` defect-analysis outputs directly instead of creating a planner-side defect wrapper skill.

### `scripts/check_resume.sh`

Usage: `workspace-planner/projects/feature-plan/scripts/check_resume.sh <feature-id>`

Must preserve the current Phase 0 contract and emit:
- `REPORT_STATE=<FINAL_EXISTS|DRAFT_EXISTS|CONTEXT_ONLY|FRESH>`
- `TASK_STATE=<status>`

Additive support allowed by this design:
- defect-analysis-aware resume probing
- freshness display
- compatibility with dynamic draft version tracking

Validation evidence expected at implementation time:
- targeted shell smoke test for each `REPORT_STATE`
- targeted defect-analysis resume smoke test
- evidence that archive-before-overwrite still occurs

## 7. Files To Create / Update

1. `workspace-planner/docs/FEATURE_QA_PLANNING_REDESIGN_2026-03-06.md` — create now; canonical redesign artifact
2. `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md` — created; workspace-local entrypoint
3. `workspace-planner/skills/feature-qa-planning-orchestrator/reference.md` — created; state-machine and phase notes
4. `workspace-planner/.agents/workflows/feature-qa-planning.md` — removed after AGENTS routing switched to the new skill
5. `workspace-planner/skills/qa-plan-github/SKILL.md` — updated; user-facing translation and traceability split
6. `workspace-planner/skills/qa-plan-synthesize/SKILL.md` — updated; translation pass, self-healing UE checks, defect merge, dynamic versioning
7. `workspace-planner/skills/qa-plan-review/SKILL.md` — updated; blocking UE gate and structured review output
8. `workspace-planner/skills/qa-plan-refactor/SKILL.md` — updated; deterministic fix mapping and bounded loop
9. `workspace-planner/skills/qa-plan-confluence-review/SKILL.md` — updated; versioned live review outputs and loopback semantics
10. `workspace-planner/projects/feature-plan/scripts/check_resume.sh` — updated; preserves `REPORT_STATE` plus additive resume support
11. `workspace-planner/AGENTS.md` — updated; routes to the new orchestrator skill

### 7.1 Design-Only Recommendation Table

| File | Action in This Turn | Recommended Next Action |
|---|---|---|
| `workspace-planner/.agents/workflows/feature-qa-planning.md` | historical input | replaced as the canonical design source by the new orchestrator skill, then removed |
| `workspace-planner/docs/qa-plan-fix/QA_PLAN_FIX_PLAN.md` | historical input | used as fix-package rationale for manual-row rewrites and user-facing outcomes |
| `workspace-planner/docs/qa-plan-fix/QA_PLAN_QUALITY_GATE_DESIGN.md` | historical input | used as the normative source for synthesis translation, AUTO routing, UE checks, and post-review loop design |
| `workspace-planner/docs/QA_PLAN_DEFECT_ANALYSIS_INTEGRATION_DESIGN.md` | historical input | merged into Phase 2 of the new orchestrator design |
| `workspace-planner/docs/IDEMPOTENCY_REVIEW_QA_PLAN_WORKFLOW.md` | historical input | adopted as the Phase 0/Phase 5 idempotency baseline |
| `workspace-planner/skills/qa-plan-synthesize/SKILL.md` | implemented artifact | revised during implementation with redesign addenda |
| `workspace-planner/skills/qa-plan-github/SKILL.md` | implemented artifact | revised during implementation with redesign addenda |
| `workspace-planner/skills/qa-plan-review/SKILL.md` | implemented artifact | revised during implementation with redesign addenda |
| `workspace-planner/skills/qa-plan-refactor/SKILL.md` | implemented artifact | revised during implementation with redesign addenda |
| `workspace-planner/skills/qa-plan-confluence-review/SKILL.md` | implemented artifact | revised during implementation to match versioned live-review artifacts |

## 8. README Impact

User-facing README impact:
- `workspace-planner/README.md`: not applicable
- Reason: this redesign changes internal planner workflow architecture and skill routing, but no user-facing README has been identified as the canonical place for this contract today.

## 9. Quality Gates

- [x] Design defines workflow entrypoints as skills, not only prose or scripts
- [x] Shared vs workspace-local placement is explicit and justified
- [x] `.agents/skills/` is treated as canonical for shared skills
- [x] Existing `REPORT_STATE` / Phase 0 behavior is preserved
- [x] Existing `task.json` / `run.json` semantics are preserved unless additive changes are justified
- [x] `skill-creator` is required for new or materially redesigned skills
- [x] `code-structure-quality` is applied to placement and boundary design
- [x] Existing shared skills `jira-cli`, `confluence`, and `feishu-notify` are reused directly by default
- [x] AGENTS.md sync is explicit
- [x] README impact is explicitly addressed
- [x] Reviewer report artifacts are explicit: `projects/agent-design-review/feature-qa-planning-redesign-2026-03-06/design_review_report.md` and `projects/agent-design-review/feature-qa-planning-redesign-2026-03-06/design_review_report.json`
- [x] Reviewer status (`openclaw-agent-design-review`): pass

## 10. References

- `.agents/skills/openclaw-agent-design/SKILL.md`
- `.agents/skills/openclaw-agent-design/reference.md`
- `.agents/skills/openclaw-agent-design-review/SKILL.md`
- `.agents/skills/agent-idempotency/SKILL.md`
- `.agents/skills/code-structure-quality/SKILL.md`
- `.agents/skills/clawddocs/SKILL.md`
- `docs/SKILL_SHELL_WORKFLOW_ENHANCEMENT_DESIGN.md`
- `docs/bestpractice-openclaw.md`
- `workspace-planner/.agents/workflows/feature-qa-planning.md`
- `workspace-planner/docs/qa-plan-fix/QA_PLAN_FIX_PLAN.md`
- `workspace-planner/docs/qa-plan-fix/QA_PLAN_QUALITY_GATE_DESIGN.md`
- `workspace-planner/docs/QA_PLAN_DEFECT_ANALYSIS_INTEGRATION_DESIGN.md`
- `workspace-planner/docs/IDEMPOTENCY_REVIEW_QA_PLAN_WORKFLOW.md`
- `workspace-planner/docs/QA_PLAN_WORKFLOW_ENHANCEMENT_2026-02-27.md`
