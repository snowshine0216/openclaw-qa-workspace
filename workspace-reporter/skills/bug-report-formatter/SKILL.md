---
name: bug-report-formatter
description: Standardized bug reporting with templates for Jira. Capture steps, expected/actual results, severity, screenshots, and environment details. Use when filing bugs from testing, reproducing issues, or improving bug report quality.
homepage: https://github.com/naodeng/awesome-qa-prompt
metadata: {"clawdbot":{"emoji":"🐛","requires":{"bins":["jira-cli","playwright-cli"]}}}
---

# Bug Report Formatter Skill

Create standardized, high-quality bug reports for Jira with all essential details.

## Bug Report Template

### Quick Report (Minimal)
```markdown
**Summary:** [Feature] Brief description of the bug
**Priority:** P0/P1/P2/P3
**Severity:** Critical/High/Medium/Low
**Steps:**
1. [Step to reproduce]
2. [Step 2]
3. [Step that causes bug]
**Expected:** [What should happen]
**Actual:** [What actually happens]
```

### Full Report (Detailed)
```markdown
**Summary:** [Feature] Brief description
**Ticket:** [Related Jira ID if exists]
**Priority:** P0 | **Severity:** High | **Type:** Bug

## Description
[Bug description in 2-3 sentences]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step that triggers bug]

## Expected Result
[What should happen]

## Actual Result
[What actually happens]

## Environment
- **URL:** [Production/Staging URL]
- **Browser:** [Chrome/Firefox/Safari]
- **OS:** [macOS/Windows/Linux]
- **Device:** [Desktop/Mobile]
- **Screen Resolution:** [1920x1080 etc.]

## Test Data
- **User:** [test user if applicable]
- **Data Set:** [specific records if applicable]

## Screenshots/Videos
![screenshot](path/to/screenshot.png)
![screenshot](path/to/screenshot2.png)

## Console Errors
```
[Copy console errors here]
```

## Root Cause Analysis
[Initial analysis of what might be causing the bug]

## Workaround
[If known, steps to bypass the issue]

## Impact Assessment
- **Users Affected:** [All/Some/Specific user group]
- **Business Impact:** [High/Medium/Low]
- **Frequency:** [Always/Sometimes/Rarely]
```

## Severity & Priority Guidelines

### Severity Levels
| Level | Description | Examples |
|-------|-------------|----------|
| **Critical** | System down, data loss, security breach | Site crashes, database corrupted |
| **High** | Major feature broken, no workaround | Login fails for all users |
| **Medium** | Feature broken, workaround exists | Search returns wrong results |
| **Low** | Minor issue, cosmetic | Misaligned text, typo |

### Priority Matrix
| Severity | Users Affected | Priority |
|----------|----------------|----------|
| Critical | All/Majority | P0 |
| Critical | Few | P1 |
| High | All/Majority | P1 |
| High | Few | P2 |
| Medium | All | P2 |
| Medium | Few | P3 |
| Low | All | P3 |
| Low | Few | P3 |

## Capture Checklist

### Before Filing
- [ ] Steps documented clearly
- [ ] Screenshot of bug state
- [ ] Console errors captured
- [ ] Environment noted
- [ ] Test data identified
- [ ] Severity assigned

### Browser DevTools
```bash
# Console errors
# Network failed requests
# LocalStorage/SessionStorage state
# Cookie issues
```

### Playwright CLI
```bash
# Screenshot before/after
playwright-cli screenshot --filename=bug-before.png
# Trigger bug
playwright-cli screenshot --filename=bug-after.png

# Console logs
playwright-cli console error
```

## Jira Integration

### Create Bug from CLI
```bash
jira issue create \
  --summary "[FEATURE] Bug: Login fails with valid credentials" \
  --type Bug \
  --priority High \
  --description "**Steps to Reproduce:**\n1. Navigate to /login\n2. Enter valid credentials\n3. Click login\n\n**Expected:** Dashboard loads\n**Actual:** Error page shown"
```

### Add Screenshot to Jira
```bash
# After creating issue, attach screenshot
jira issue attach ISSUE-123 /path/to/screenshot.png
```

### Transition Bug
```bash
# Move to In Progress
jira issue transition ISSUE-123 --to="In Progress"

# Mark as Resolved
jira issue transition ISSUE-123 --to="Done" --resolution="Fixed"

# Reopen if not fixed
jira issue transition ISSUE-123 --to="Open" --resolution="Unresolved"
```

## Bug Categories

### UI Bugs
- **Visual:** Misalignment, broken images, wrong colors
- **Responsive:** Mobile layout broken, overlapping elements
- **Interaction:** Button doesn't work, hover states missing

### Functional Bugs
- **Logic:** Wrong calculation, incorrect data displayed
- **Workflow:** Multi-step process fails
- **Permission:** Access control bypassed

### Performance Bugs
- **Slow:** Page takes >10s to load
- **Timeout:** Request times out
- **Memory:** Memory leak, high usage

### Data Bugs
- **Corrupted:** Data saved incorrectly
- **Missing:** Data not persisted
- **Duplicate:** Duplicate records created

### Security Bugs
- **Injection:** SQL/XSS vulnerability
- **Auth:** Authentication bypass
- **Session:** Session hijacking possible

## Example Bug Reports

### Example 1: Critical Bug
```markdown
**Summary:** [LOGIN] Users unable to authenticate

**Priority:** P0 | **Severity:** Critical | **Type:** Bug

**Description:**
All users unable to login to the application. Login page loads but 
authentication fails for all credentials.

**Steps to Reproduce:**
1. Navigate to https://app.example.com/login
2. Enter any valid username/password
3. Click "Login"

**Expected:** User redirected to dashboard

**Actual:** Error message "Authentication failed" displayed

**Environment:**
- URL: https://app.example.com
- Browser: Chrome 120
- OS: macOS 14.2
- Time: 2026-02-11 14:30 UTC

**Console Errors:**
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
POST https://api.example.com/auth 503 Service Unavailable
```

**Impact:**
- 100% of users affected
- Business impact: High - Cannot access application
```

### Example 2: Medium Bug
```markdown
**Summary:** [SEARCH] Wrong results displayed for date filters

**Priority:** P2 | **Severity:** Medium | **Type:** Bug

**Description:**
When filtering search results by date range, results include 
records outside the selected range.

**Steps to Reproduce:**
1. Go to Search page
2. Set date filter: 2026-01-01 to 2026-01-31
3. Click Search

**Expected:** Only records from January 2026 displayed

**Actual:** Records from December 2025 also shown

**Test Data:**
- User: testuser@example.com
- Date range: 2026-01-01 to 2026-01-31

**Screenshot:**
![date-filter-bug](screenshots/search-date-filter.png)

**Workaround:**
Manually filter results after search
```

## Best Practices

### Do
- ✅ Reproduce the bug 2-3 times before filing
- ✅ Include exact steps and test data
- ✅ Capture screenshots/videos
- ✅ Note environment details
- ✅ Assign appropriate severity
- ✅ Link to related issues

### Don't
- ❌ File without reproducing
- ❌ Use vague descriptions ("it doesn't work")
- ❌ Forget to check if similar bug exists
- ❌ Skip console errors
- ❌ Overstate/understate severity

## Automation Scripts

### Auto-Capture Bug Info
```bash
#!/bin/bash
# capture-bug.sh

echo "Bug Report Generator"
echo "==================="

read -p "Summary: " summary
read -p "Priority (P0/P1/P2/P3): " priority
read -p "Severity (Critical/High/Medium/Low): " severity

echo ""
echo "Steps to reproduce:"
cat > /tmp/steps.txt
echo ""

echo "Expected result:"
read expected

echo "Actual result:"
read actual

echo ""
echo "Environment:"
echo "- URL: $(pbpaste || echo 'N/A')"
echo "- Browser: $(playwright-cli --version 2>/dev/null || echo 'N/A')"

# Generate markdown report
cat > bug-report.md
```

### Generate from Console Errors
```javascript
// scripts/analyze-console.js
// Capture and format console errors

const errors = [];

// Collect console.error calls
const originalError = console.error;
console.error = (...args) => {
  errors.push(args.join(' '));
  originalError.apply(console, args);
};

// Export for bug report
function generateConsoleSection() {
  if (errors.length === 0) return '';
  
  return `## Console Errors
\`\`\`
${errors.join('\n')}
\`\`\`
`;
}
```

## Integration Points

- **qa-daily-workflow**: Log bugs during daily testing
- **test-case-generator**: File bugs found during test execution
- **playwright-cli**: Capture screenshots and console errors
- **jira-cli**: Create and update bug tickets

## Bug Report Checklist

### Before Submitting
- [ ] Title is clear and specific
- [ ] Severity accurately assigned
- [ ] Steps reproduce the bug
- [ ] Expected vs Actual clearly stated
- [ ] Screenshot attached
- [ ] Environment documented
- [ ] No duplicate bug exists
- [ ] Related tickets linked
