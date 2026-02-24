---
name: code-structure-quality
description: Enforces DRY, modular, and functional code structure with clear boundaries between pure logic and side effects. Use when adding features, refactoring modules, resolving duplication, or reviewing architecture quality.
---

# Code Structure Quality

## Purpose

Keep code easy to change, test, and reason about by enforcing module boundaries and ownership.

## When To Use

Use this skill when:
- Adding new modules or major features
- Refactoring large files
- Resolving duplicated logic
- Reviewing architectural consistency

## Core Principles

1. One concern per module; one canonical owner per shared behavior.
2. Separate pure logic from orchestration and IO side effects.
3. Keep public APIs intentional and stable.
4. Prefer composition over monolithic flows.
5. Apply DRY by extracting reusable behavior with clear contracts.

## Module Design Rules

- Modules should expose small, explicit interfaces.
- Internal helpers should stay private unless reused by multiple modules.
- Shared utilities must have clear ownership and import direction.
- Avoid cyclic dependencies between top-level modules.

## Functional Quality Rules

- Prefer functions with explicit inputs/outputs.
- Minimize hidden global state and implicit mutation.
- Isolate side effects in adapters, handlers, or pipeline/orchestration layers.
- Keep transformation functions deterministic where practical.

## Refactor Workflow

1. Identify current mixed concerns and duplication hotspots.
2. Define target boundaries (domain logic vs infra/IO).
3. Extract reusable logic into canonical owners.
4. Introduce thin orchestration layer to wire modules.
5. Update imports and public interfaces.
6. Validate with tests and integration checks.

## Quality Gates

- [ ] No duplicated business logic across active modules
- [ ] Side effects isolated from core logic
- [ ] Public APIs are explicit and documented
- [ ] Dependencies are directional and acyclic
- [ ] Module names reflect responsibility

## Anti-Patterns

- Utility dumping grounds with unclear ownership
- Feature logic duplicated in CLI, server, and data layers
- Mixed parsing/DB/network logic in a single file
- Hidden side effects in low-level helpers

## Additional Resources

- Detailed patterns: [reference.md](reference.md)
- Before/after examples: [examples.md](examples.md)
