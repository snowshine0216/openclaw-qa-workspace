# Function Test Coverage Reference

## Source-to-Test Mapping Templates

Common mappings:

- `src/module/foo.js` -> `tests/module/foo.test.js`
- `scripts/parsing/parser.js` -> `tests/parsing/parser.test.js`
- `services/bar/index.ts` -> `services/bar/index.test.ts`

Choose one convention and apply consistently.

## Coverage Matrix Template

| Behavior | Test Level | Input Type | Expected Outcome |
|----------|------------|------------|------------------|
| Normal success flow | Unit | Valid fixture | Correct result |
| Edge condition | Unit | Boundary fixture | Safe handling |
| Upstream/downstream integration | Integration | Combined fixture | Correct wiring |
| Known bug regression | Unit/Integration | Bug reproduction fixture | Bug prevented |

## Fixture Guidance

- Keep fixtures small but realistic.
- Separate canonical fixtures from one-off bug fixtures.
- Name fixtures by behavior, not by ticket number.
- Avoid embedding environment-specific secrets or IDs.

## Flakiness Prevention

- Stub time, randomness, and network dependencies.
- Avoid shared mutable global state between tests.
- Reset state between tests.
- Keep asynchronous assertions explicit and awaited.

## Review Checklist

- [ ] All changed exports mapped to tests
- [ ] Regression test added for bug fixes
- [ ] No flaky or timing-sensitive assertions
- [ ] Fixture names and intent are clear
