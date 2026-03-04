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

### `robust-agent-design`

Use when:
- Designing new agents or orchestrator workflows
- Implementing tasks involving >30 items (e.g., Jira defects, PRs)
- Building multi-step APIs with external interactions

Focus:
- Scalability & parallel execution
- Progress monitoring (task.json) and heartbeats
- Checkpointing and intermediate artifacts
- Human-in-the-loop (HIL) approval gates

### `agent-idempotency`

Use when:
- An agent may be re-invoked for the same input it has already processed
- Designing Phase 0 of any workflow that produces output files
- A user asks to "re-run", "refresh", or "regenerate" an existing analysis
- Deciding what to re-fetch vs. reuse from a previous run

Focus:
- Tiered existence check (final → draft → context-only → fresh)
- Cache freshness display and Smart Refresh logic
- Report versioning via archive/ subfolder (no timestamp in active filenames)
- Error handling: API down, corrupted task.json, partial PR cache, release mixed states

### `openclaw-agent-design`

Use when:
- Designing new OpenClaw agents and workflows
- Defining resumable state-machine process flows
- Writing AGENTS/workflow contracts for OpenClaw

Focus:
- Robust Phase 0 design and idempotency alignment
- Explicit user confirmation gates and artifact contracts
- Completion notifications and recovery patterns

### `openclaw-agent-design-review`

Use when:
- Reviewing OpenClaw design drafts before finalization
- Verifying path validity and OpenClaw pathing practices
- Enforcing test evidence and documentation/README coverage

Focus:
- Blocking quality gate for P0/P1 design issues
- Deterministic markdown/json review artifact output
- Actionable remediation guidance for missing quality checks

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
