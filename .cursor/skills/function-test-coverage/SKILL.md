---
name: function-test-coverage
description: Ensures function-level test coverage for exported behavior using unit and integration tests, realistic fixtures, and regression checks. Use when adding/changing functions, refactoring modules, or fixing production bugs.
---

# Function Test Coverage

## Purpose

Ensure code changes are validated at the behavior level with reliable, maintainable tests.

## When To Use

Use this skill when:
- Adding or changing exported/public functions
- Refactoring existing modules
- Fixing regressions or production defects
- Introducing new fixtures or test harnesses

## Core Principles

1. Every exported/public behavior should have tests.
2. Test behavior, not implementation details.
3. Include happy paths, edge cases, and failure modes.
4. Keep tests deterministic and isolated.
5. Add regression tests for every confirmed bug.
6. Should use minimal fixtures to test the behaviors and use real-case as much as possible

## Coverage Rules

- Unit tests for pure functions and local logic branches.
- Integration tests for module collaboration and IO boundaries.
- Contract tests for parsers/adapters where data shape matters.
- Entrypoint smoke tests for startup and critical workflows.

## Test Design Workflow

1. Identify changed behavior and affected interfaces.
2. Map each behavior to test level (unit/integration/contract/smoke).
3. Add/refresh fixtures for representative input.
4. Write assertions for outcomes and error handling.
5. Run tests and confirm no flaky behavior.
6. Ensure bug fixes include permanent regression tests.

## Quality Gates

- [ ] Changed exported behavior has test coverage
- [ ] Edge and error cases are covered for critical flows
- [ ] Fixtures are realistic and minimal
- [ ] Assertions verify outcomes, not internals
- [ ] Regressions are encoded as tests

## Anti-Patterns

- Snapshot-only tests with weak semantic assertions
- Tests tightly coupled to private implementation details
- No fixture strategy for parser/network/data-heavy code
- Relying on manual verification for repeatable scenarios

## Additional Resources

- Coverage mapping templates: [reference.md](reference.md)
- Example test patterns: [examples.md](examples.md)
