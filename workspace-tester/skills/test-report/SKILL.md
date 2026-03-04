---
name: test-report
description: Format test execution results into a standardized report. When failures occur, document bugs via bug-report-formatter and optionally log to Jira after user confirmation. Use when test execution completes, documenting test outcomes, or reporting bugs from automated/manual testing.
---

# Test Report Skill

Format test execution results into a standardized execution report. For any FAIL cases, produce standardized bug documents and optionally create Jira issues after explicit user confirmation.

## Inputs

| Input | Type | Description |
|-------|------|--------------|
| `key` | string | Issue key (e.g., BCIN-1234) |
| `result` | object | Per-test-case outcomes: PASS/FAIL/BLOCKED, screenshots paths, expected vs actual |
| `evidence_path` | string | Path to reports/ and screenshots/ directory |
| `plan_path` | string (optional) | Path to test plan (e.g., projects/test-cases/BCIN-1234/test-plan.md) |

## Output

**Path:** `workspace-tester/projects/test-cases/<key>/reports/execution-summary.md`

## Report Format

```markdown
# Test Execution Report: [Issue Key]

**Date:** YYYY-MM-DD
**Tester:** Atlas Tester (automated)
**Test Plan:** [plan_path]
**Environment:** Staging/Production

## Summary
- **Total Test Cases:** N
- **Passed:** N
- **Failed:** N
- **Blocked:** N
- **Overall Result:** PASS | FAIL

## Test Results

### TC-01: [Test Case Name] ✅ PASS
**Actual Result:** [brief]
**Screenshot:** [path]
**Notes:** [optional]

### TC-02: [Test Case Name] ❌ FAIL
**Expected:** [expected]
**Actual:** [actual]
**Screenshot:** [path]
**Console Log:** [path if captured]
**Notes:** [optional]

### TC-03: [Test Case Name] ⏸️ BLOCKED
**Reason:** [why blocked]
**Notes:** [optional]
```

## Bug Handling Flow

| Step | Action |
|------|--------|
| 1 | If any test case FAIL, invoke **bug-report-formatter** skill to produce a standardized bug document per failure |
| 2 | Confirm with user: "Bug(s) detected. Log to Jira? (Y/N)" — **do NOT auto-log without confirmation** |
| 3 | If user confirms (Y): use **jira-cli** skill to create Jira issue(s) from the bug report(s) |
| 4 | If user declines (N): leave bug documented in execution-summary.md only; do not create Jira tickets |

## Skill References

### bug-report-formatter
- **Use when:** Documenting FAIL cases
- **Read:** `workspace-tester/skills/bug-report-formatter/SKILL.md`
- Produces standardized bug reports with steps, expected/actual, severity, screenshots, environment

### jira-cli
- **Use when:** Only after user confirms logging (Y)
- **Read:** `workspace-tester/skills/jira-cli/SKILL.md`
- Create issues: `jira issue create -tBug -s"<summary>" -b"<description>" -y<priority> --no-input`
- Attach screenshots: `jira issue attach <ISSUE-KEY> <path/to/screenshot.png>`

## Workflow

1. **Build report:** Iterate over `result` object; for each test case, emit the appropriate section (PASS/FAIL/BLOCKED).
2. **Compute summary:** Count passed, failed, blocked; set Overall Result to FAIL if any failed.
3. **On FAIL:** For each failed case, invoke bug-report-formatter to produce a bug document; include reference in execution-summary.md.
4. **Ask user:** "Bug(s) detected. Log to Jira? (Y/N)"
5. **If Y:** For each bug document, use jira-cli to create issue and attach screenshots.
6. **Write output:** Save execution-summary.md to `projects/test-cases/<key>/reports/execution-summary.md`.

## Notes

- Ensure `projects/test-cases/<key>/reports/` exists before writing.
- Use relative paths for screenshots/console logs within evidence_path.
- Link bug documents (or inline them) in the FAIL sections of the report.
