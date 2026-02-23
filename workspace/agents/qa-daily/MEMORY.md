# MEMORY.md - QA Daily Agent Long-Term Memory

_Monitoring patterns and lessons learned._

## Common Jira Queries

```bash
# Ready for testing
jira issue list --status "Ready for Testing" --project BCIN

# Blockers
jira issue list --priority Blocker,Critical --project BCIN

# Recently fixed
jira issue list --jql "project = BCIN AND status = Fixed AND updated >= -1d"
```

## CI/Jenkins Patterns

*(To be filled when Jenkins integration is configured)*

## Common Issues

### Flaky Tests
- Track tests that fail intermittently
- Note: Pattern recognition after multiple occurrences

### Typical Blockers
- Missing test data
- Environment issues
- Deployment failures

## Reporting Best Practices

- Issue keys first (BCIN-1234)
- Priority indicators (🔴 critical, 🟡 medium)
- Concise summaries
- Action items at the end

## Daily Check History

- Average issues ready for testing: *(to be tracked)*
- Common failure patterns: *(to be tracked)*
- Typical response time: *(to be tracked)*

---

*Last updated: 2026-02-23*
