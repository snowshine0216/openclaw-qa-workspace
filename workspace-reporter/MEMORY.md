# MEMORY.md - QA Report Agent Long-Term Memory

_Reporting patterns and Jira best practices._

## Common Bug Patterns

### Authentication Issues
- Missing error messages
- Incorrect redirects
- Session not persisting
- Token expiration not handled

### Form Validation
- Client-side validation bypassed
- Missing required field checks
- SQL injection vulnerabilities
- XSS vulnerabilities

### UI/UX Issues
- Elements not aligned
- Responsive design breaks
- Accessibility issues (WCAG)
- Loading states missing

## Effective Bug Report Structure

1. **Summary** - One-line description (clear, specific)
2. **Steps to Reproduce** - Numbered, specific, complete
3. **Expected Result** - From requirements
4. **Actual Result** - What actually happened
5. **Evidence** - Screenshots, logs, traces
6. **Environment** - Browser, OS, URL, test case ID
7. **Additional Notes** - Context, workarounds, related issues

## Jira Workflow Insights

### Common Transitions
- Open → In Testing
- In Testing → Testing Complete
- Testing Complete → Reopen (bugs found)
- Testing Complete → Closed (all passed)

### Required Fields (Project-Specific)
- Summary (always required)
- Description (always required)
- Priority (Critical, High, Medium, Low)
- Issue Type (Bug, Task, Story, Epic)
- Assignee (optional, often auto-assigned)

### Useful Labels
- `automation` - Found by automated tests
- `regression` - Reoccurring issue
- `ui` - UI-related
- `critical-path` - Affects core functionality
- `flaky` - Intermittent issue

## Summary Report Best Practices

### Executive Summary Template
```
Testing complete for [issue-key]. Executed [X] test cases: [Y] passed ([Z]%), [N] failed ([M]%). [P] bugs filed ([severity breakdown]). Recommend [action].
```

Example:
```
Testing complete for BCIN-1234. Executed 10 test cases: 8 passed (80%), 2 failed (20%). 2 bugs filed (1 High, 1 Medium). Recommend fixing High-priority bug before release.
```

### Test Coverage Breakdown
- Functional: X/Y test cases
- Edge Cases: X/Y test cases
- UI/UX: X/Y test cases
- Performance: X/Y test cases
- Security: X/Y test cases

## Lessons Learned

### What Works Well
- Clear bug titles (helps triage)
- Numbered reproduction steps (easy to follow)
- Evidence attached (reduces back-and-forth)
- Linked to parent issues (maintains context)

### Common Pitfalls to Avoid
- Vague bug descriptions ("it doesn't work")
- Missing reproduction steps
- No evidence attached
- Wrong severity assignment
- Not linking to parent issue

## Severity Assignment Guide

Ask these questions:
1. **Does it crash the system?** → Critical
2. **Does it block critical functionality?** → High
3. **Does it affect non-critical features?** → Medium
4. **Is it cosmetic or minor?** → Low

Edge cases:
- Security vulnerabilities → Always High or Critical
- Data loss → Always Critical
- Typos in user-facing text → Low (unless offensive)

## Attachment Guidelines

### What to Attach
- Screenshots (PNG format, < 5MB)
- Console logs (TXT format)
- Network traces (HAR format)
- Test reports (PDF or MD format)

### What NOT to Attach
- Credentials or API keys
- Large video files (use links instead)
- Duplicate screenshots
- Unrelated files

## Report Archive Strategy

**Defect analysis reports:** See `projects/docs/REPORTER_AGENT_DESIGN.md` Section 3 — per-feature `archive/` inside each `defects-analysis/<FEATURE_KEY>/`.

**Test reports:** See `WORKSPACE_RULES.md` — `projects/test-reports/<issue-key>/` with quarterly archive to `projects/archive/`.

**Gap reconciliation:** See `projects/docs/REPORTER_ENHANCEMENT_DESIGN.md` Section 3.

---

*Last updated: 2026-02-26*
