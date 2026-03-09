# QA Plan Contract (Simple)

Who obeys: Write, review, and refactor all obey this contract.

## MUST use skill: markxmind

Output must be valid XMindMark. Use `markxmind` for generation and validation.

## Structure

- **Scenario** → Step 1 → (optional Step 2) → expected result (XMindMark)
- Step 2 is optional.

## Write Phase 1

List all scenarios and test steps (each step is a bullet) and expected result.

## Write Phase 2

Group scenarios into top categories; mark P1/P2/P3; highlight risky parts. Leave top categories as-is if scenarios do not fit.

## Top priority (hard rule)

Must be obeyed; do not remove or ignore priority markers:

- **P1** — directly relates to code change
- **P2** — maybe influenced
- **P3** — nice to have

## Risk

Clearly mark risky areas.

## Template

`templates/qa-plan-template.md` is the soft contract — structure is flexible, but top priority must be obeyed.
