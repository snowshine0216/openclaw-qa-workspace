# Evals — defects-analysis

Skill-creator compatible evals for the defects-analysis skill.

## Structure

- **`evals.json`** — Test prompts and expectations for routing, feature-report richness, release fan-out, reviewer rejection of shallow output, and notification behavior

## Eval Prompt Families

1. **Delegation** — Single Jira key resolving to Issue/Bug/Defect delegates to single-defect-analysis
2. **Reporter-local** — Single Jira key resolving to Feature stays in reporter scope without blocking
3. **Release + mixed states** — Release version with FINAL_EXISTS/DRAFT_EXISTS/CONTEXT_ONLY/FRESH and automatic default plan selection
4. **JQL + PR spawn** — JQL input with PR links triggers phase4 spawn/post and final Feishu notification
5. **Feature richness parity** — Rich feature report includes feature title, functional-area analysis, blocking defects, repo-aware PR synthesis, and release recommendation
6. **Generic fallback rejection** — Heading-only or filler-heavy drafts fail review and are not promoted to final
7. **Release fan-out** — Release run materializes one overall release report plus one feature packet per feature
8. **Reuse behavior** — Mixed-state feature runs map to `use_existing`, `resume`, `generate_from_cache`, and `proceed`
9. **Reviewer regression guard** — Reviewer fails shallow output even if all 12 headings exist

## Running evals

Use skill-creator or run prompts manually:

```bash
# Run orchestrate with test fixtures
TEST_SKIP_DELEGATE_SPAWN=1 TEST_JIRA_ISSUE_TYPE=Issue bash scripts/orchestrate.sh BCIN-9000
TEST_JIRA_ISSUE_TYPE=Feature TEST_RUNTIME_SETUP_OK=1 bash scripts/orchestrate.sh BCIN-5809
```

## Acceptance criteria

- Phase 0 route classification proves both delegated and reporter-local branches
- Feature reports are rich enough to support release decisions, not just structural completeness
- Release runs produce feature packet directories under `features/`
- Phase 5 orchestrator generates report and invokes report-quality-reviewer
- No Confluence publish step
- Every script has matching `scripts/test/` stub
