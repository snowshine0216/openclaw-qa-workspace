# Docs Governance Reference

## Canonical Ownership Template

Use this table to define active doc ownership:

| Topic | Canonical File | Owner | Update Trigger |
|------|------------------|-------|----------------|
| Onboarding | README | Maintainers | Setup flow changes |
| Architecture | ARCHITECTURE | Tech lead | Boundary/data flow changes |
| Deployment | DEPLOYMENT | Ops/dev owner | Runtime/infra changes |
| Testing | TESTING | QA/dev owner | Test strategy/tooling changes |
| Change History | CHANGELOG | Release owner | User-visible behavior changes |

## Archive Lifecycle

When deprecating docs:
1. Move file into `docs/archive/` (or project-equivalent archive path).
2. Add a one-line note at top:
   - why superseded
   - where canonical replacement lives
   - date archived
3. Update links from README/docs index.

Template note:

```markdown
> Archived: superseded by `docs/ARCHITECTURE.md` on 2026-02-24.
```

## Consolidation Heuristics

Consolidate when any of the following are true:
- Two active docs answer the same "how to deploy/test/operate" question.
- A doc mostly duplicates another with only small delta notes.
- Version docs are used as permanent references instead of changelog entries.

Keep separate only when:
- Audience differs materially (operator vs end-user)
- Ownership and update cadence are independent
- Information is stable and non-overlapping

## Naming Guidance

Prefer stable topic names over phase/version names:
- Good: `ARCHITECTURE.md`, `DEPLOYMENT.md`, `TESTING.md`
- Avoid: `V2.3_FINAL.md`, `IMPLEMENTATION_COMPLETE.md`

## Review Checklist

- [ ] Canonical map updated
- [ ] Duplicate content removed or archived
- [ ] New doc linked from index
- [ ] Archive note added to moved docs
- [ ] Changelog updated if behavior changed
