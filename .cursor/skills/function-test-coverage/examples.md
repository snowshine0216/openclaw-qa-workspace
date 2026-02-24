# Examples: Function Test Coverage

## Example 1: New exported parser helper

Input change:
- Add `extractMetadata(logText)` as exported function.

Action:
1. Add unit tests for valid, empty, malformed inputs.
2. Add fixture-based tests for representative real log snippets.
3. Assert output contract and error behavior.

Expected result:
- Exported behavior is fully validated at unit level.

## Example 2: Bug fix in retry deduplication

Input change:
- Fix bug where retry count under-reports when first attempt fails parsing.

Action:
1. Create fixture reproducing bug input.
2. Add regression test proving expected retry count.
3. Keep existing behavior tests to prevent side regressions.

Expected result:
- Bug does not reappear and prior behavior remains stable.

## Example 3: Entry-point smoke test

Input change:
- Update runtime startup wiring.

Action:
1. Add smoke test for successful startup path.
2. Add failure test for missing required config.
3. Verify error messaging is actionable.

Expected result:
- Startup regressions are caught quickly.
