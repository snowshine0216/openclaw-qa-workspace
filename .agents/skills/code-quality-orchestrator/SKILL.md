---
name: code-quality-orchestrator
description: Orchestrates high-discipline implementation work in a strict write-code -> review -> refactor loop with TDD first. Use whenever the user asks to implement from requirements or design docs, improve code quality, or refactor code while preserving behavior. This skill explicitly invokes function-test-coverage, code-structure-quality, requesting-code-review, and receiving-code-review. Enforces unit+integration coverage, minimal mocks, DRY, functional boundaries, and <=20-line functions (with explicit exceptions).
---

# Code Quality Orchestrator

Use this skill to run a deterministic quality workflow for implementation and refactor tasks.

## Mandatory Skill Calls

Call these skills in this order for every run:

1. `function-test-coverage` during test planning and red-green TDD loop.
2. `code-structure-quality` during implementation and refactor design.
3. `requesting-code-review` immediately after initial green tests.
4. `receiving-code-review` to process feedback before refactor completion.
5. `code-structure-quality` again for final refactor gates.
6. `function-test-coverage` again for final regression/coverage validation.

Do not skip calls. If a call cannot run, state the blocker and stop.

## Non-Negotiable Quality Gates

- TDD order is required: failing tests first, then implementation, then refactor.
- Every changed exported/public behavior must have unit or integration coverage.
- Integration tests are required for changed module collaboration or IO boundaries.
- Use bare-minimum mocks. Prefer realistic fixtures and real collaboration paths.
- Keep each function at `<= 20` logical lines unless exception criteria are met.
- Separate pure logic from side-effect orchestration code.
- Remove duplicated business rules and keep one canonical owner (DRY).
- All changed code must be testable through clear inputs/outputs.

Use the gate checklist in `references/workflow-checklist.md`.

## Directory Structure

Avoid flat layouts. Use layered structure so scripts, reusable logic, and tests have clear homes.

### Preferred Structure

```
<skill-or-project>/
├── scripts/           # Entry points, CLI, orchestration
│   ├── lib/           # Shared logic, helpers, pure functions
│   │   ├── foo.js
│   │   └── bar.js
│   ├── main.sh
│   └── run-foo.sh
├── tests/             # Test specs (mirror lib/ or scripts/)
│   ├── test-foo.js
│   └── test-bar.js
└── ...
```

Rules:

- **scripts/** — Entry points and orchestration only. Keep thin; delegate to `lib/`.
- **scripts/lib/** — Reusable logic, pure functions, helpers. Testable in isolation.
- **tests/** — Dedicated test folder. Do not colocate tests inside `scripts/` or `lib/` as flat siblings.

### Anti-Patterns (Flat Structure)

```
# BAD: everything in one flat folder
scripts/
├── main.sh
├── foo.js
├── bar.js
├── test-foo.js
└── test-bar.js
```

```
# BAD: tests mixed with implementation
scripts/
├── lib/
│   ├── foo.js
│   └── test-foo.js   # tests belong in tests/
```

### When to Apply

- Creating new skills or projects.
- Adding scripts to existing skills.
- Refactoring flat layouts into `scripts/` → `lib/` + `tests/`.

Invoke `code-structure-quality` to validate structure during implementation and refactor phases.

## Workflow

### Phase 0: Scope and Behavior Matrix

1. Read requirement/design-doc text and extract behavior statements.
2. Produce a behavior-to-test matrix before writing implementation code.
3. Classify each behavior as unit, integration, or both.

If design-doc input is involved, use `references/design-doc-to-tests.md`.

### Phase 1: TDD Write Loop (Red -> Green)

1. Invoke `function-test-coverage` to define tests for changed behaviors.
2. Write failing tests first.
3. Implement minimal code to make tests pass.
4. Keep mocks minimal and local. Replace broad mocks with fixtures or adapters.
5. Invoke `code-structure-quality` to keep module boundaries clean during code creation.

### Phase 2: Review Gate

1. Invoke `requesting-code-review` after initial test pass.
2. Capture findings and severity.
3. Invoke `receiving-code-review` for technical validation of each finding.
4. Fix blocking findings first; verify each fix with targeted tests.
5. Reject incorrect findings with explicit technical reasoning.

### Phase 3: Refactor Gate

1. Invoke `code-structure-quality` to refactor for DRY and functional boundaries.
2. Ensure each function is `<= 20` lines or log an explicit exception.
3. Preserve behavior and keep tests passing during refactor.
4. Re-run unit and integration suites.
5. Invoke `function-test-coverage` for final gap scan and regression checks.

## Function-Length Exception Policy

The `<= 20` line rule is a soft gate, not a silent bypass.

When a function exceeds 20 lines, you must log:

- `function`: function name and file
- `line_count`: current count
- `reason`: why split would reduce clarity or break framework constraints
- `attempted_split`: yes/no with short note
- `follow_up`: optional TODO if refactor deferred

Allowed reasons and examples are in `references/exception-policy.md`.

## Output Contract

Return these sections in the final response for each orchestrated run:

1. `Behavior/Test Matrix`
2. `Review Findings Disposition`
3. `Refactor Summary`
4. `Quality Gates`

Use this exact `Quality Gates` checklist:

- [ ] TDD order followed (red -> green -> refactor)
- [ ] Unit coverage for changed behaviors
- [ ] Integration coverage for changed collaboration/IO flows
- [ ] Bare-minimum mocks used
- [ ] DRY ownership and structure constraints satisfied
- [ ] Directory structure: scripts → lib, tests in dedicated folder (no flat layout)
- [ ] Function length policy satisfied or exceptions logged
- [ ] Final tests pass

## Anti-Patterns

- Flat directory layout: scripts, lib, and tests in one folder without separation.
- Writing production code before failing tests exist.
- Mocking internal implementation details instead of testing behavior.
- Skipping review and moving directly to refactor.
- Refactoring without rerunning integration tests.
- Allowing duplicated business logic across modules.

## Quick Start Prompt Pattern

Use this sequence when applying the skill:

1. "Apply `function-test-coverage` to build behavior-level unit+integration test plan."
2. "Apply `code-structure-quality` while implementing minimal code for green tests."
3. "Apply `requesting-code-review` and gather findings."
4. "Apply `receiving-code-review` to accept/reject findings with technical checks."
5. "Apply `code-structure-quality` for DRY/functional refactor."
6. "Apply `function-test-coverage` for final regression and coverage validation."
