# QA Summary Skill - Reference

## Ownership

- `SKILL.md` defines how the orchestrator behaves
- `reference.md` is an index and ownership entrypoint only
- Atomic contracts live in:
  - `references/runtime-and-state.md`
  - `references/planner-and-defects.md`
  - `references/summary-formatting.md`
  - `references/publish-and-notification.md`

## Required References

Always read:

- `references/runtime-and-state.md`

Load phase-specific references only when needed:

- `references/planner-and-defects.md` for planner resolution and defect coordination
- `references/summary-formatting.md` for summary generation
- `references/publish-and-notification.md` for publish and notification behavior

## Boundary Rule

Do not duplicate normative rules in `reference.md`.
All runtime, schema, formatting, publish, and notification contracts are maintained in the atomic references listed above.
