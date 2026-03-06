# Exception Policy

This policy governs soft-gate exceptions for function length and mocks.

## A) Function Length (`<= 20` lines)

Default: split functions to stay at or below 20 logical lines.

Allowed exception categories:

1. Framework lifecycle/hook signatures where splitting harms readability.
2. Small orchestration functions that only compose named helpers.
3. Error-handling wrappers where extraction would duplicate branching.
4. Generated adapter glue where edits must stay close to interface contract.

Required exception log format:

```text
function: <name> (<path>)
line_count: <n>
reason: <category + concrete context>
attempted_split: <yes/no> - <summary>
follow_up: <none or TODO>
```

Do not grant exceptions for convenience or time pressure.

## B) Bare-Minimum Mocks

Default: test behavior with realistic fixtures and true module collaboration.

Allowed mocks:

1. Non-deterministic boundaries (time, random, UUID).
2. External network/payment/third-party APIs.
3. Process/system boundaries that are expensive or unsafe in tests.

Disallowed mocks:

1. Mocking the function under test.
2. Mocking internal helper chains to force green tests.
3. Replacing collaboration boundaries that can run in-process with fixtures.

If a broad mock is used, log:

```text
mock_target: <component>
why_needed: <determinism/safety/cost reason>
lighter_alternative_checked: <yes/no + note>
```
