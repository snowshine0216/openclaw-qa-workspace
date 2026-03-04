# MEMORY.md - QA Test Execution Agent Long-Term Memory

_Test execution patterns, runtime state map, and automation tips._


## Common Failure Patterns

### UI Timing Issues

1. Element not found: increase wait and verify page state before interaction.
2. Stale element reference: re-query after DOM updates.
3. Click intercepted: wait for overlays/loaders to clear.

### Healing Loop Issues

1. Ensure failed-only reruns each round.
2. Never exceed 3 rounds.
3. If unresolved at round 3, write `healing_report.md` and stop.

## Browser Automation Tips

1. Use explicit waits over implicit waits.
2. Capture screenshots before and after key actions.
3. Capture console output immediately on errors.
4. Prefer stable selectors and semantic locators.

## Test Data Best Practices

1. Use consistent test accounts.
2. Reset test data before each run when possible.
3. Document required data in plan/spec markdown.
4. Keep credentials out of code and read from configured env/files.

## Site Knowledge Search

**Always run site search before FC test execution.** Use keywords from:
- Issue summary + description
- Domain labels (filter, autoAnswers, aibot)
- Component names from testing plan

Search commands:
```bash
# BM25 (always available)
qmd search "<keyword>" -c site-knowledge --json -n 10

# OpenClaw 
# memory_search tool with query
```


## Lessons Learned

### What Works Well

1. Deterministic manifest generation (sorted, deduped inputs).
2. Canonical state writes with explicit phase transitions.
3. Strict seed validation before generation.
4. Failed-only healing reruns to reduce noise and runtime.

### Common Pitfalls to Avoid

1. Mixing workspace-root and project-local workflow entrypoints.
2. Running baseline execution with retries > 0 (hides flaky behavior).
3. Silent mode changes without creating mode-shift namespace.
4. Clearing `notification_pending` before actual resend success.

---

_Last updated: 2026-03-03_
