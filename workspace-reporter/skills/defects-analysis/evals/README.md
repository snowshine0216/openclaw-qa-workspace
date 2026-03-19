# Evals — defects-analysis

Skill-creator compatible evals for the defects-analysis skill.

## Structure

- **`evals.json`** — Test prompts and expectations for Phase 0 routing, reporter-local flow, self-review loop, and Feishu notification

## Planned Eval Prompts

1. **Delegation** — Single Jira key resolving to Issue/Bug/Defect delegates to single-defect-analysis
2. **Reporter-local** — Single Jira key resolving to Feature stays in reporter scope without blocking
3. **Release + mixed states** — Release version with FINAL_EXISTS/DRAFT_EXISTS/CONTEXT_ONLY/FRESH and automatic default plan selection
4. **JQL + PR spawn** — JQL input with PR links triggers phase4 spawn/post and final Feishu notification
5. **Self-review loop** — Auto-fix, re-review until pass, then finalize and Feishu

## Running evals

Use skill-creator or run prompts manually:

```bash
# Run orchestrate with test fixtures
TEST_SKIP_DELEGATE_SPAWN=1 TEST_JIRA_ISSUE_TYPE=Issue bash scripts/orchestrate.sh BCIN-9000
TEST_JIRA_ISSUE_TYPE=Feature TEST_RUNTIME_SETUP_OK=1 bash scripts/orchestrate.sh BCIN-5809
```

## Acceptance criteria

- Phase 0 route classification proves both delegated and reporter-local branches
- Phase 5 orchestrator generates report and invokes report-quality-reviewer
- No Confluence publish step
- Every script has matching `scripts/test/` stub
