# Code Structure Quality Reference

## Topology Options

Choose topology based on growth pattern:

1. Feature-based
   - Good when teams own vertical slices.
2. Layer-based
   - Good when infra concerns are complex.
3. Hybrid
   - Feature directories with shared infrastructure layers.

## Ownership Matrix Template

| Concern | Canonical Owner | Allowed Callers | Notes |
|--------|------------------|-----------------|-------|
| Parsing/transform | parsing module | pipeline/service | Keep pure where possible |
| Data persistence | database adapter | service/pipeline | No domain branching in adapter |
| Analysis/classification | analysis module | pipeline/service | Deterministic core logic |
| Reporting/output | reporting module | pipeline/service | Avoid business logic leakage |
| Runtime handlers | server/cli layer | entrypoints only | Wire dependencies only |

## Split Decision Matrix

Split a file when 2+ conditions hold:
- >1 major concern (e.g., parsing + DB + networking)
- Frequent cross-team edits causing merge conflicts
- Hard to test without environment setup
- Repeated helpers copied elsewhere

Keep as-is when:
- Responsibility is single and cohesive
- Tests are straightforward
- Interface is stable and small

## Dependency Direction Rules

- Entry/runtime layers depend on domain modules.
- Domain modules should not depend on runtime entry layers.
- Infra adapters should not own domain decisions.

## Review Checklist

- [ ] Boundaries are explicit
- [ ] Shared logic has one owner
- [ ] Side effects isolated
- [ ] No cyclic imports
- [ ] Refactor updated tests and docs
