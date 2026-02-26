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

## Jira Authentication

**CRITICAL: Always load credentials from .env file**

When running jira-cli commands, ALWAYS source credentials from workspace .env:
```bash
cd /Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-reporter
export JIRA_API_TOKEN="<token-from-.env>"
export JIRA_SERVER="https://strategyagile.atlassian.net"
jira issue view ISSUE-KEY
```

**Why this matters:**
- System bash_profile may not have current token
- .env file in workspace-reporter/ contains the working token
- Credentials are: JIRA_SERVER, JIRA_EMAIL, JIRA_API_TOKEN

**Lesson learned (2026-02-26):** Failed to fetch BCDE-4198 initially because I relied on bash_profile instead of workspace .env. Always check workspace-reporter/.env first.

## Jira CLI Tips

### Batch Operations
```bash
# Create multiple bugs from a list
for bug in bug-TC-02.md bug-TC-07.md; do
  jira issue create --project BCIN --type Bug --description "$(cat $bug)"
done

# Link multiple bugs to parent
for key in BCIN-1235 BCIN-1236; do
  jira issue link $key "is caused by" BCIN-1234
done
```

### Query for Recent Bugs
```bash
# Bugs filed today
jira issue list --jql "project = BCIN AND issuetype = Bug AND created >= startOfDay()"

# Bugs filed by me
jira issue list --jql "project = BCIN AND issuetype = Bug AND reporter = currentUser()"
```

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

Keep reports organized:
- `projects/test-reports/<issue-key>/summary-report.md`
- `projects/test-reports/<issue-key>/bugs/` (individual bug reports)
- `projects/test-reports/daily/` (daily summaries)

Archive old reports:
```bash
# Move old reports to archive (quarterly)
mkdir -p projects/archive/2026-Q1
mv projects/test-reports/BCIN-1[0-9][0-9][0-9] projects/archive/2026-Q1/
```

---

*Last updated: 2026-02-23*
