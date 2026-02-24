# Cross-Project Skills + One Project-Specific Skill Plan

**Date:** 2026-02-24  
**Source:** `REFACTOR_PLAN.md`  
**Target:** Reusable skills for multiple projects, with one jenkins-analysis specific skill

---

## Goal

Create a skill set that is mostly reusable across projects:
- 3 generic skills usable in any codebase
- 1 project-specific skill for jenkins-analysis runtime and entrypoints

The core rule is:
- `SKILL.md` contains stable policy and workflow
- `reference.md` contains project snapshots and concrete mappings

---

## Design Principles

1. **Policy first, implementation second**
   - Keep `SKILL.md` focused on rules and decision criteria.
   - Put concrete migration details in `reference.md`.

2. **Generic by default**
   - Reusable skills avoid project names and hardcoded paths.
   - Project specifics live only in the project-specific skill.

3. **Contracts over file snapshots**
   - Prefer statements like "single canonical owner per concern" over "function X must always be in file Y".

4. **Evidence-based quality gates**
   - Use checklists and pass/fail conditions instead of fixed numeric targets where possible.

---

## Skill 1 (Generic): Documentation Organization

**Name:** `docs-organization-governance`  
**Path:** `.cursor/skills/docs-organization-governance/SKILL.md`

### Scope
Documentation architecture, consolidation, ownership, and archival lifecycle.

### Trigger Scenarios
- Creating or restructuring docs
- Adding release notes or operational guides
- Merging overlapping docs
- Archiving obsolete docs

### Core Rules (in SKILL.md)
- Keep a small canonical set of active docs with clear ownership.
- Avoid duplicate sources of truth for architecture, deployment, and testing.
- Archive outdated docs rather than deleting history.
- Record user-facing behavior changes in changelog/release history.

### Reference (in `reference.md`)
- Generic canonical doc taxonomy templates
- Archive strategy patterns
- Consolidation examples (without project coupling)

---

## Skill 2 (Generic): Code Structure and Quality (DRY, Modular, Functional)

**Name:** `code-structure-quality`  
**Path:** `.cursor/skills/code-structure-quality/SKILL.md`

### Scope
Code organization, duplication control, module boundaries, and functional design choices.

### Trigger Scenarios
- Adding modules or features
- Refactoring monolithic scripts
- Resolving duplicated logic
- Reviewing architecture consistency

### Core Rules (in SKILL.md)
- One concern per module; one canonical owner for shared logic.
- Keep orchestration/side effects separate from pure transformation logic.
- Expose stable module APIs and avoid leaking internal implementation details.
- Prefer composable functions and small units with explicit inputs/outputs.
- Enforce DRY by consolidating repeated behavior into shared components.

### Reference (in `reference.md`)
- Modular topology patterns (feature-based, layer-based, hybrid)
- Shared utility ownership patterns
- Refactor decision matrix for splitting monoliths

---

## Skill 3 (Generic): Function-Level Test Coverage

**Name:** `function-test-coverage`  
**Path:** `.cursor/skills/function-test-coverage/SKILL.md`

### Scope
Unit, integration, and fixture strategy to ensure every exported behavior is validated.

### Trigger Scenarios
- Adding or changing exported functions
- Refactoring module boundaries
- Debugging regressions
- Expanding fixtures

### Core Rules (in SKILL.md)
- Every exported/public behavior requires automated tests.
- Mirror production module structure in the test layout where practical.
- Cover happy path, edge cases, and failure modes for critical paths.
- Use fixtures for realistic inputs and deterministic expectations.
- Favor behavior assertions over implementation-coupled assertions.

### Reference (in `reference.md`)
- Test mapping templates (source-to-test mirroring variants)
- Framework-agnostic behavior checklist
- Example fixture strategies and anti-patterns

---

## Skill 4 (Project-Specific, Merged): Jenkins Runtime Boundaries and Entry Points

**Name:** `jenkins-runtime-entrypoints`  
**Path:** `.cursor/skills/jenkins-runtime-entrypoints/SKILL.md`

### Scope
Merged project-specific skill:
- jenkins-analysis architecture touchpoints
- canonical entrypoints
- wrapper script boundaries
- deployment/runtime invocation rules

### Trigger Scenarios
- Updating startup flow or CLI entrypoints
- Modifying package scripts or wrapper scripts
- Deployment/runtime process manager changes
- Fixing path/invocation breakages

### Core Rules (in SKILL.md)
- Define and maintain canonical service and CLI entrypoints.
- Wrapper scripts should call canonical entrypoints, not internal modules directly.
- Keep startup configuration centralized and environment-driven.
- Validate invocation paths when module structure changes.
- Preserve backward compatibility or document breaking entrypoint changes.

### Project-Specific Reference (in `reference.md`)
- Current jenkins-analysis entrypoint inventory
- Wrapper script call graph for this repo
- Runtime/deployment command examples for this repo
- Module ownership map specific to jenkins-analysis

---

## Skill Artifacts

Each skill directory should include:
- `SKILL.md` (policy, triggers, workflow, checklist)
- `reference.md` (project snapshot details and concrete mappings)
- `examples.md` (2-4 concise before/after examples)

Optional:
- `scripts/` helpers only when repeatable validation automation is required

---

## Implementation Order (Revised)

| Step | Action |
|------|--------|
| 1 | Create shared reusable skills: `docs-organization-governance`, `code-structure-quality`, `function-test-coverage` |
| 2 | Create project-specific merged skill: `jenkins-runtime-entrypoints` |
| 3 | Add `SKILL.md`, `reference.md`, `examples.md` for each skill |
| 4 | Validate reusable skills contain no jenkins-specific naming |
| 5 | Run quality checks below before finalizing |

---

## Quality Checks

- [ ] YAML frontmatter valid (`name`, `description`)
- [ ] Description states WHAT + WHEN in third person
- [ ] `SKILL.md` is concise and policy-first
- [ ] Generic skills contain no project-specific terms
- [ ] Project-specific details only appear in `jenkins-runtime-entrypoints`
- [ ] Version-specific details moved to `reference.md`
- [ ] Terminology is consistent across all four skills
- [ ] Paths and commands use repository conventions

---

## Acceptance Criteria

This plan is successful when:
- Three skills can be copied into another project with minimal edits.
- Only one skill is tied to jenkins-analysis runtime specifics.
- Agents can apply each skill from trigger conditions alone.
- Project-specific details are available without bloating core guidance.
- Responsibilities are clear with minimal overlap.
