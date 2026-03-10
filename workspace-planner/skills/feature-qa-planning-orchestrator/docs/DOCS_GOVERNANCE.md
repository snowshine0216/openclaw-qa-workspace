# Docs Governance

## Docs Freshness

| File | Role | Owner trigger |
| --- | --- | --- |
| `SKILL.md` | workflow entrypoint | any phase change |
| `reference.md` | runtime/artifact contract | any artifact or state change |
| `templates/qa-plan-template.md` | output scaffold | any section or shape change |
| `references/qa-plan-contract.md` | hard planning contract | any write or review rule change |
| `evals/evals.json` | behavior checks | any contract change |

## Update Rule

Any future change to plan structure, write instructions, review instructions, runtime state, or validators is incomplete unless the matching docs and eval entries are updated in the same change.

## Ownership model

- `SKILL.md` owns the workflow summary.
- `reference.md` owns runtime state, artifact naming, and validator inventory.
- `references/*.md` own detailed writer, reviewer, and schema contracts.
- `docs/*.md` own design docs, reviews, governance, and implementation summaries.
