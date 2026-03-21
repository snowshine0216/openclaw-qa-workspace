# Grading Rubric

## Blocking case policy

A contender fails the benchmark if any blocking case fails.

Blocking cases cover:

1. phase contracts that must not regress
2. replay cases based on known misses
3. checkpoint enforcement for Phase 5a, Phase 5b, and Phase 7
4. holdout regression cases

## Case families

### Defect replay

Pass only when the generated plan or derivative artifact would have exposed the known failure mode.

### Phase contract

Pass only when the skill preserves required orchestrator semantics for that phase.

### Checkpoint enforcement

Pass only when the relevant review/finalization checkpoint would force the expected gate, audit, or artifact.

### Holdout regression

Pass only when unrelated feature planning quality does not regress.
