# Skill Workflow Enhancement — OpenClaw Skill-First Design

> **Design ID:** `skill-shell-workflow-v2`
> **Date:** 2026-03-06
> **Status:** Draft
> **Scope:** Refactor OpenClaw workflow design from a shell-script-centric enhancement into a canonical skill-first architecture for `openclaw-agent-design` and `openclaw-agent-design-review`.
>
> **Constraint:** This is a design artifact only. Do not implement until approved by user.

---

## 0. Problem Statement

### Current State

The existing design in this file focuses on one narrow improvement: replacing natural-language workflow prose with concrete shell orchestration for `openclaw-agent-design` and `openclaw-agent-design-review`.

That solved part of the execution ambiguity, but it still leaves the larger OpenClaw design problem under-specified:

- workflow intent is still framed around scripts rather than reusable skills,
- shared capabilities are not consistently modeled as shared skills,
- new-agent design and existing-agent function redesign are not covered by one portable rule set,
- reviewer gates focus on shell compliance more than OpenClaw skill architecture,
- path conventions:  `.agents/skills/...` as primary
### Pain Points

| # | Problem |
|---|---------|
| 1 | Shell scripts improve determinism, but shell alone is not the right abstraction boundary for OpenClaw workflows. |
| 2 | Reusable behaviors such as Jira lookup, Confluence publishing, and Feishu notification risk being embedded per workflow instead of shared as skills. |
| 3 | There is no single canonical rule for where a capability should live: `.agents/skills/` vs `<workspace>/skills/`. |
| 4 | Existing-agent function redesign is not clearly treated as the same class of design work as new-agent design. |
| 5 | The review model does not yet fully enforce OpenClaw principles: skill accumulation, reuse, idempotent workflow design, and reviewer-gated architecture quality. |
| 6 | `.cursor/skills/...` references in the older design obscure the canonical shared-skill layout expected by current OpenClaw practice. |

### Target State

Refactor this design so that OpenClaw workflows are modeled as **skills first** and **shell second**:

1. **All workflow entrypoints are skills**.
   - New workflows must be represented by a skill entrypoint.
   - Existing-agent functions being redesigned must be re-expressed as skills or as compositions of skills.

2. **Shared vs local placement is explicit**.
   - Shared, reusable capabilities go in `.agents/skills/<skill-name>/`.
   - Agent- or workspace-specific capabilities go in `<workspace>/skills/<skill-name>/`.

3. **Shell scripts remain internal implementation details**.
   - Shell and Node helpers live under a skill's `scripts/` directory.
   - They support the skill contract; they do not replace the skill abstraction.

4. **OpenClaw design and review stay the canonical pattern**.
   - `openclaw-agent-design` defines how to design new or existing agent workflows in a skill-first way.
   - `openclaw-agent-design-review` validates path placement, reuse, OpenClaw compatibility, and implementation discipline.

5. **Existing shared skills are reused directly where possible**.
   - Use `jira-cli`, `confluence`, and `feishu-notify` as existing shared capabilities instead of inventing wrapper skills by default.

6. **The design stays compatible with OpenClaw guidance**.
   - Follow `clawddocs`, `agent-idempotency`, skill accumulation, explicit reviewer gates, and modular reusable capability design.

---

## 1. Design Principles

### 1.1 Canonical OpenClaw Compatibility Rules

This design must remain compatible with the current OpenClaw skill model described by `clawddocs`, `openclaw-agent-design`, and `docs/bestpractice-openclaw.md`:

- **Skill-first accumulation** — durable value should be stored in reusable skills, not hidden inside one-off workflow prose or scripts.
- **Error → rule → skill** — recurring patterns should be encoded once in a skill and reused.
- **Idempotent workflows** — workflow entrypoints must remain compatible with `agent-idempotency` Phase 0 thinking.
- **Agent as orchestrator** — OpenClaw workflows should decompose work and assign specialized responsibilities to reusable skills.
- **Review-gated evolution** — design changes are not final until `openclaw-agent-design-review` returns `pass` or `pass_with_advisories`.

### 1.2 Canonical Path Rules

Treat these locations as canonical for this design:

| Kind | Canonical Location | Rule |
|------|--------------------|------|
| Shared OpenClaw skill | `.agents/skills/<skill-name>/` | Use when the capability is reusable across agents or workspaces |
| Workspace-local skill | `<workspace>/skills/<skill-name>/` | Use when the capability is tightly bound to one workspace or agent family |
| Skill implementation helpers | `<skill-root>/scripts/` | Shell/Node execution details that support the skill contract |
| Skill references/examples | `<skill-root>/reference.md`, `references/`, `examples.md` | Human-readable design guidance and review criteria |

`.cursor/skills/...` may still exist as compatibility or legacy implementation detail during migration, but this design must present `.agents/skills/...` as the source-of-truth location for shared OpenClaw skills.

### 1.3 Applicability

This design applies to both of the following:

1. **New agent or workflow design**
   - Example: introducing a new OpenClaw agent capability with one or more entrypoint skills.

2. **Existing agent function redesign**
   - Example: taking a large monolithic workflow or one-off automation path and refactoring it into skill entrypoints plus reusable shared or local skills.

---

## 2. Skill-First Architecture

### 2.1 Skill Classes

All workflow logic in this design belongs to one of these classes:

1. **Entrypoint Skills**
   - The user- or agent-facing workflow contract.
   - Responsible for orchestration, state transitions, and delegating to other skills.
   - For OpenClaw design work, `openclaw-agent-design` and `openclaw-agent-design-review` are canonical examples.

2. **Shared Building-Block Skills**
   - Reusable capabilities that serve multiple agents.
   - Must live under `.agents/skills/`.
   - Existing examples to reuse directly when applicable:
     - `jira-cli`
     - `confluence`
     - `feishu-notify`

3. **Workspace-Local Skills**
   - Skills whose assumptions are specific to a single workspace, project family, or agent domain.
   - Must live under `<workspace>/skills/`.

### 2.2 Placement Decision Rules

Use these rules during design and review:

| Question | If Yes | If No |
|----------|--------|-------|
| Is this capability reusable by multiple agents or workspaces? | Put it in `.agents/skills/` | Continue evaluating |
| Is this capability tightly coupled to one workspace's data, outputs, or process? | Put it in `<workspace>/skills/` | Continue evaluating |
| Does the workflow need only an orchestration contract while reusing existing shared capabilities? | Create or update an entrypoint skill only | Do not create duplicate shared wrappers |
| Is the proposed new skill duplicating an existing shared skill such as `jira-cli`, `confluence`, or `feishu-notify`? | Reject or justify as a real contract gap | Proceed |

### 2.3 Shell and Node Role

Shell and Node remain valid implementation tools, but only at the skill implementation layer:

- `SKILL.md` defines the public workflow contract.
- `scripts/` implements executable helpers and orchestration.
- `scripts/lib/` contains pure or near-pure reusable helpers.
- `scripts/test/` contains focused test coverage for the script layer.

A design is non-compliant if it describes a workflow primarily as a shell script bundle without also defining the skill contract, placement, and reuse model.

---

## 3. OpenClaw Design Workflow Requirements

### 3.1 `openclaw-agent-design` Mandatory Process

Refactor the design expectations for `openclaw-agent-design` so every design run follows this order:

1. **Consult `clawddocs`**
   - Confirm current OpenClaw conventions, workspace structure, and integration expectations.

2. **Apply `agent-idempotency`**
   - Define Phase 0 state handling, resume behavior, archive-before-overwrite policy, and task/run state artifacts where persistent outputs are produced.
   - Every entrypoint skill must start by checking existing status using the current Phase 0 / `REPORT_STATE` model before creating new artifacts or advancing workflow phases. Use `.agents/skills/openclaw-agent-design/reference.md` as the canonical source for the current `REPORT_STATE` contract and state-machine expectations.
   - Existing `task.json` and `run.json` semantics are preserved by default; any design change must be additive, backward-compatible, and explicitly justified in the design doc and corresponding reviewer report.

3. **Use `skill-creator` for all new or materially reworked skills**
   - Any newly introduced shared or local skill must be designed through `skill-creator`.
   - This applies to both new-agent design and existing-agent function redesign.

4. **Use `code-structure-quality` during design**
   - Enforce clear ownership boundaries.
   - Separate skill contract, orchestration logic, and side-effect adapters.
   - Keep shared behaviors DRY with one canonical owner.

5. **Invoke `openclaw-agent-design-review`**
   - P0/P1 findings block finalization.
   - The design is not complete until reviewer output is `pass` or `pass_with_advisories`.

### 3.2 Required Design Outputs

Every OpenClaw workflow design should describe:

- the entrypoint skill or skills,
- whether each capability is shared or workspace-local,
- which existing shared skills are reused directly,
- where shell/Node helpers live inside the skill,
- how idempotent state or resume behavior works when persistent artifacts exist,
- how the workflow begins with existing-status detection and preserves current `task.json` / `run.json` semantics unless an additive schema change is justified in the design doc and reviewer report,
- what reviewer gates apply before finalization,
- what `AGENTS.md` updates are needed to keep routing and skill references synchronized.

### 3.3 Direct Reuse of Existing Shared Skills

By default, designs should reuse these existing shared capabilities directly:

| Capability | Existing Shared Skill | Default Design Rule |
|-----------|-----------------------|---------------------|
| Jira issue search/update/transition | `jira-cli` | Reuse directly unless a new domain-specific contract is truly needed |
| Confluence read/publish/navigation | `confluence` | Reuse directly for documentation publishing or retrieval |
| Feishu completion/alert messaging | `feishu-notify` | Reuse directly for notification phases and fallback messaging design |

Do not create wrapper skills for these by default. A wrapper is allowed only when the workflow needs a stable higher-level contract that cannot be expressed cleanly by direct reuse.

---

## 4. Reviewer Model for `openclaw-agent-design-review`

### 4.1 Reviewer Scope Expansion

Refactor the review model so `openclaw-agent-design-review` validates not only shell-script discipline, but also OpenClaw skill architecture quality.

The reviewer must check:

1. **Canonical placement**
   - Shared capabilities are placed in `.agents/skills/`.
   - Workspace-specific capabilities are placed in `<workspace>/skills/`.

2. **Skill-first workflow definition**
   - The workflow is defined through skill entrypoints, not only NLG or shell artifacts.

3. **Existing skill reuse**
   - The design reuses `jira-cli`, `confluence`, and `feishu-notify` directly when they fit.

4. **OpenClaw compatibility**
   - The design aligns with `clawddocs`, skill accumulation, idempotency thinking, and reviewer-gated finalization.

5. **State-machine non-regression**
   - The design preserves the current Phase 0 existing-status check and does not break current `task.json` / `run.json` semantics unless an additive change is explicitly justified in the design doc and reviewer report.

6. **Implementation discipline**
   - Shell/Node helpers are modular and subordinate to the skill contract.
   - Side effects are isolated from reusable helpers.
   - Tests are planned for non-trivial script behavior.

### 4.2 Reviewer Findings

Add reviewer findings that cover the new design contract:

| ID | Severity | Description |
|----|----------|-------------|
| `SKILL-001` | P0 | Workflow is not modeled as a skill entrypoint |
| `SKILL-002` | P1 | Shared capability is placed outside `.agents/skills/` without justification |
| `SKILL-003` | P1 | Workspace-specific capability is incorrectly proposed as a shared skill |
| `SKILL-004` | P1 | Existing shared skill reuse was skipped without justified contract gap |
| `SKILL-005` | P1 | `skill-creator` was not required for new or materially redesigned skills |
| `SKILL-006` | P1 | `code-structure-quality` was not applied to skill boundary design |
| `SKILL-007` | P1 | Design ignores OpenClaw compatibility expectations from `clawddocs` or `agent-idempotency` |
| `SKILL-008` | P1 | Design bypasses the current Phase 0 existing-status check or breaks `task.json` / `run.json` semantics without additive change justification recorded in the design doc and reviewer report |
| `SHELL-001` | P1 | Shell or Node scripts are treated as the primary workflow abstraction instead of skill internals |
| `SHELL-002` | P1 | Script design mixes orchestration, data transformation, and side effects without clear boundaries |
| `SHELL-003` | P2 | Script test strategy is missing for non-trivial helper or orchestration behavior |

### 4.3 Review Artifacts

The reviewer output contract remains:

- review report markdown artifact path,
- review report JSON artifact path,
- final status: `pass`, `pass_with_advisories`, or `fail`.

The review is blocking for P0/P1 findings.

---

## 5. Shell Implementation Pattern Inside Skills

### 5.1 When Shell Is Appropriate

Shell should be used when a skill needs deterministic local orchestration, filesystem coordination, CLI composition, or a small executable pipeline.

Examples:
- preparing manifest/state files,
- collecting inputs for a skill run,
- coordinating local CLI tools,
- writing resumable execution checkpoints,
- invoking existing shared skills from a stable wrapper script inside the skill.

### 5.2 Script Structure Rules

When a skill includes shell or Node helpers, use this structure:

| Path | Purpose |
|------|---------|
| `<skill-root>/scripts/run-*.sh` | thin entrypoint driver |
| `<skill-root>/scripts/lib/*.sh` | pure or narrowly scoped reusable helpers |
| `<skill-root>/scripts/*.js` | Node helpers for structured JSON or multi-step CLI orchestration |
| `<skill-root>/scripts/test/` | focused tests for helpers and drivers |

### 5.3 Script Quality Rules

These rules remain valid from the earlier v1 shell design, but they now apply inside the skill architecture:

- use `set -euo pipefail` in shell entrypoints,
- keep helpers small and composable,
- isolate side effects from data transformation logic,
- write state artifacts atomically where practical,
- define resumable behavior when persistent outputs matter,
- include focused tests for non-trivial scripts,
- avoid monolithic script bundles that become the de facto workflow definition.

### 5.4 Feishu, Jira, and Confluence Integration

Script helpers must not hard-code workflow-local copies of shared integrations when the shared skill already exists.

Use design contracts that point to:
- `jira-cli` for Jira interaction,
- `confluence` for Confluence interaction,
- `feishu-notify` for Feishu notification.

If a local script adapts one of these capabilities, the script should be a thin adapter owned by the entrypoint skill, not a new duplicate integration layer.

---

## 6. Design Deliverables

Refactor the deliverables expected from this design as follows:

| Action | Path | Notes |
|--------|------|-------|
| UPDATE | `.agents/skills/openclaw-agent-design/SKILL.md` | Make skill-first workflow design the default contract |
| UPDATE | `.agents/skills/openclaw-agent-design/reference.md` | Add placement rules, skill classes, and shell-inside-skill conventions |
| UPDATE | `.agents/skills/openclaw-agent-design-review/SKILL.md` | Expand review gates to cover skill placement, reuse, and OpenClaw compatibility |
| UPDATE | `.agents/skills/openclaw-agent-design-review/reference.md` | Keep reviewer rubric aligned until review internals are fully migrated |
| UPDATE | `.agents/skills/openclaw-agent-design-review/scripts/check_design_evidence.sh` | Extend checks to cover skill-first architecture evidence |
| UPDATE | `AGENTS.md` | Sync canonical shared/local skill placement and required design/review process |
| UPDATE | `docs/SKILL_WORKFLOW_V2_PORTABLE_DESIGN.md` | Keep high-level portable design language aligned with this canonical OpenClaw-focused version |

If future implementation introduces script assets under `openclaw-agent-design`, those scripts belong under the relevant skill directory in `.agents/skills/.../scripts/`.

---

## 7. AGENTS.md Sync Requirements

Root `AGENTS.md` and relevant workspace guidance should stay aligned with this design:

- state that workflow entrypoints are skills,
- state that shared skills live in `.agents/skills/`,
- state that workspace-local skills live in `<workspace>/skills/`,
- require `skill-creator` and `code-structure-quality` for design work,
- require `openclaw-agent-design-review` before finalization,
- list reusable shared skills such as `jira-cli`, `confluence`, and `feishu-notify` as default building blocks where applicable.

---

## 8. README Impact

- `.agents/skills/openclaw-agent-design/README.md`: **not applicable** — the skill currently does not include a separate README and the canonical contract lives in `SKILL.md` and `reference.md`.
- `.agents/skills/openclaw-agent-design-review/README.md`: **not applicable** — the reviewer contract is documented in `SKILL.md` and `reference.md`.
- Root `README.md`: **no change** — this design only changes OpenClaw skill contracts and review rules.

---

## 9. Quality Gates

- [ ] Design defines workflow entrypoints as skills, not only scripts or prose
- [ ] Shared vs workspace-local skill placement is explicit and justified
- [ ] `.agents/skills/` is treated as the canonical shared-skill location
- [ ] Both new-agent design and existing-agent function redesign are covered
- [ ] `clawddocs` compatibility is explicitly addressed
- [ ] `agent-idempotency` Phase 0 expectations are preserved where persistent outputs exist
- [ ] Workflow starts with existing-status detection using current Phase 0 / `REPORT_STATE` semantics
- [ ] Existing `task.json` / `run.json` semantics are preserved unless additive changes are explicitly justified in the design doc and reviewer report
- [ ] `skill-creator` is required for new or materially redesigned skills
- [ ] `code-structure-quality` is required for skill boundary and ownership design
- [ ] Existing shared skills `jira-cli`, `confluence`, and `feishu-notify` are reused directly by default
- [ ] Reviewer findings cover placement, reuse, OpenClaw compatibility, and shell-inside-skill discipline
- [ ] Shell implementation guidance is retained as an internal skill-layer rule, not the primary architecture

---

## 10. References

- Canonical OpenClaw design skill: `.agents/skills/openclaw-agent-design/SKILL.md`
- Canonical OpenClaw design reference: `.agents/skills/openclaw-agent-design/reference.md`
- Review wrapper skill: `.agents/skills/openclaw-agent-design-review/SKILL.md`
- Canonical review skill: `.agents/skills/openclaw-agent-design-review/SKILL.md`
- OpenClaw best practices: `docs/bestpractice-openclaw.md`
- Portable supporting design: `docs/SKILL_WORKFLOW_V2_PORTABLE_DESIGN.md`
- Shared documentation skill: `.agents/skills/clawddocs/SKILL.md`
