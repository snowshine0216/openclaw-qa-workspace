# Skills Index

This folder contains reusable and project-specific skills for the jenkins-analysis project.

## Generic Skills (Reusable Across Projects)

### `docs-organization-governance`

Use when:
- Creating, moving, or consolidating docs
- Defining canonical docs and archive lifecycle
- Reducing documentation duplication

Focus:
- Documentation ownership
- Consolidation workflow
- Archive policy and quality gates

### `code-structure-quality`

Use when:
- Refactoring module boundaries
- Removing duplicated logic
- Improving DRY/modular/functional quality

Focus:
- Clear module ownership
- Side-effect isolation
- Stable public interfaces

### `function-test-coverage`

Use when:
- Adding/changing exported functions
- Writing regression tests
- Expanding fixtures or integration checks

Focus:
- Behavior-first tests
- Unit/integration coverage strategy
- Flakiness prevention and quality gates

## Project-Specific Skill (jenkins-analysis)

### `jenkins-runtime-entrypoints`

Use when:
- Updating startup and CLI entry paths
- Modifying wrapper scripts (`.sh`, `.mjs`)
- Changing package scripts or PM2 runtime config

Focus:
- Canonical service/CLI entrypoints
- Runtime boundary enforcement
- Deployment invocation consistency

## File Layout Per Skill

Each skill includes:
- `SKILL.md` for policy, triggers, workflow
- `reference.md` for concrete mappings and project details
- `examples.md` for quick, practical patterns
