# Design Doc -> Tests Mapping

Use this template when implementation starts from a design doc.

## Step 1: Extract Behaviors

For each design-doc requirement, write one observable behavior statement:

`When <trigger>, the system should <observable outcome>.`

## Step 2: Map to Tests

Use this table:

| Req ID | Behavior | Unit Test | Integration Test | Notes |
| --- | --- | --- | --- | --- |
| R-01 | ... | yes/no | yes/no | ... |
| R-02 | ... | yes/no | yes/no | ... |

Rules:

- Unit tests validate local deterministic logic and branch behavior.
- Integration tests validate module collaboration and boundary behavior.
- A changed public behavior needs at least one test.
- Changed collaboration/IO behavior requires integration coverage.

## Step 3: Define TDD Order

1. Add failing tests for highest-risk behavior first.
2. Implement minimal code until tests pass.
3. Refactor after green with quality gates.

## Step 4: Traceability Notes

At closeout, include a short traceability block:

```text
R-01 -> unit:test_a, integration:test_b
R-02 -> unit:test_c
```

This prevents silent requirement gaps.
