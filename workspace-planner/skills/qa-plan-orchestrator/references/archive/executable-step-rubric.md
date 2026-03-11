# Executable Step Rubric

## Purpose

Make manual QA steps reproducible without code-reading.

## Pass Criteria

- action names a concrete user-visible step
- target object is named
- expected result is observable
- setup is explicit when needed
- technical checks stay in verification notes

## Fail Criteria

- vague wording without a reproducible action
- missing expected result
- implementation-heavy wording in main action steps
- unclear error triggers without research or explicit unresolved handling

## Banned Vague Phrases

- `verify correct behavior`
- `verify expected behavior`
- `ensure it works`
- `test parity`
- `perform another valid action`
- `confirm functionality`
- `validate integration`
- `check the feature`

## Allowed Technical Verification Notes

Use technical checks only as optional verification notes when user-visible confirmation is insufficient.

## One-Shot Research Fallback

- When a step is not executable because the trigger or product behavior is unclear, do one bounded research pass before rewriting.
- Prefer `confluence` for internal product documentation; use `tavily-search` when internal documentation is absent or insufficient.
- Save the research output under `context/` before reusing it.

## Preserve-With-Comment Rule

- If the step still cannot be made executable, preserve it with an explicit comment and next action.
- Do not silently remove it.

## Rewrite Examples

Bad:
- `Verify the main flow works correctly`

Good:
- `Open the feature from the primary entry point, complete the user action with fixture A, and confirm the expected completion result appears in the intended destination or state without extra manual recovery`
