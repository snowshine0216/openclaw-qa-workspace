# Code Quality Orchestrator Checklist

## 1) Scope and Mapping

- [ ] Requirement/design-doc behaviors extracted.
- [ ] Behavior-to-test matrix created.
- [ ] Test levels selected (unit/integration).

## 2) Write (TDD)

- [ ] `function-test-coverage` invoked for test design.
- [ ] Failing tests added before implementation.
- [ ] Minimal implementation added to pass tests.
- [ ] `code-structure-quality` invoked during implementation.
- [ ] Mock use audited and minimized.

## 3) Review

- [ ] `requesting-code-review` invoked after initial green.
- [ ] Findings captured with severity.
- [ ] `receiving-code-review` invoked for technical validation.
- [ ] Blocking findings fixed and retested.
- [ ] Rejected findings documented with rationale.

## 4) Refactor

- [ ] `code-structure-quality` invoked for DRY and boundaries.
- [ ] Function length gate checked (`<= 20` lines).
- [ ] Exceptions logged when needed.
- [ ] Unit and integration tests rerun.
- [ ] `function-test-coverage` invoked for final gap check.

## 5) Final Output

- [ ] Behavior/Test Matrix included.
- [ ] Review Findings Disposition included.
- [ ] Refactor Summary included.
- [ ] Final Quality Gates checklist included.
