# Priority Assignment Rules for QA Test Cases

**Purpose**: Canonical reference for P1/P2/P3 assignment in XMind test cases

---

## Priority Definitions

| Priority | Rule |
|----------|------|
| **P1** | Direct code change — traced to GitHub PR diff |
| **P2** | Affected area / cross-functional / Jira AC / compatibility |
| **P3** | Edge case, template-retained, nice to have — can defer |

---

## Assignment Algorithm

1. **Load traceability**: Read `context/qa_plan_github_traceability_<feature>.md` — scenario → [files, functions, components changed].

2. **Assign per scenario**:
   - Traces to code in traceability file? → **P1**
   - Test Scope = XFUNC, or multi-repo/component, or in Jira ACs? → **P2**
   - Not in ACs, marked future/nice-to-have, or skippable? → **P3**
   - Otherwise → **P2** (conservative default)

3. **Placement**:
   - All scenarios in category same priority → place at **category** level (`## Functional - P1`)
   - All in sub-category same → place at **sub-category** level (`### Error Recovery - P1`)
   - Mixed → place at **step** level (`- Test max rows error - P1`)

---

## Distribution Guidelines

- **P1**: 40–60% | **P2**: 30–40% | **P3**: 10–20%

**Red flags**:
- All P1 → likely missing integration tests (P2)
- All P2/P3 → likely missing code traceability (P1)
- No P1 but PRs exist → traceability mapping failed

---

**Last Updated**: 2026-03-08
