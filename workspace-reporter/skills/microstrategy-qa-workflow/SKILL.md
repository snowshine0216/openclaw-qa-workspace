---
name: microstrategy-qa-workflow
description: QA workflow for MicroStrategy products. Covers dashboard testing, report validation, data integrity checks, and performance testing. Use when testing MicroStrategy features, validating BI reports, or performing user acceptance testing.
homepage: https://www.microstrategy.com
metadata: {"clawdbot":{"emoji":"📊","requires":{"bins":["playwright-cli","jira-cli"]}}}
---

# MicroStrategy QA Workflow Skill

Comprehensive QA testing workflow for MicroStrategy BI products.

## Test Coverage Areas

| Area | What to Test | Priority |
|------|--------------|----------|
| **Dashboards** | Layout, filters, visualizations, interactivity | P0 |
| **Reports** | Data accuracy, formatting, exports | P0 |
| **Dossiers** | Self-service creation, navigation, sharing | P1 |
| **Data Sources** | Connection, refresh, cache behavior | P1 |
| **Users/Roles** | Permissions, security, authentication | P0 |
| **Performance** | Load time, query performance, concurrency | P1 |

## Pre-Test Checklist

### Environment Setup
```bash
# Check MicroStrategy version
# - Library version
# - Intelligence Server version
# - Mobile version

# Verify test user access
# - Login credentials
# - Project permissions
# - Folder access
```

### Test Data Preparation
```bash
# Prepare test datasets
# - Small (< 1000 rows)
# - Medium (10K - 100K rows)
# - Large (> 1M rows)
# - Edge cases (nulls, duplicates)
```

### Baseline Metrics
```bash
# Record baseline performance
# - Page load time
# - Query execution time
# - Report generation time
```

## Dashboard Testing

### 1. Layout & Visualization Tests
```markdown
**Tests:**
- [ ] Dashboard opens without errors
- [ ] All visualizations display correctly
- [ ] Charts render with correct colors
- [ ] Text elements are readable
- [ ] Responsive design works on different screens
- [ ] No overlapping elements
```

### 2. Filter Functionality
```markdown
**Tests:**
- [ ] Filters apply correctly
- [ ] Filter dropdown opens
- [ ] Multi-select filters work
- [ ] Date filters handle ranges
- [ ] Filter persists on navigation
- [ ] Clear filters resets dashboard
```

### 3. Interactivity
```markdown
**Tests:**
- [ ] Click on data point shows details
- [ ] Hover tooltips display
- [ ] Drill-down navigation works
- [ ] Linked filters update correctly
- [ ] Export options available
- [ ] Print functionality works
```

### 4. Cross-Filtering
```markdown
**Tests:**
- [ ] Selection in one viz filters others
- [ ] No circular references
- [ ] Filter propagation delay acceptable
- [ ] Reset one viz doesn't reset others
```

## Report Testing

### Data Accuracy
```markdown
**Tests:**
- [ ] Numbers match source data
- [ ] Aggregations (sum, avg, count) correct
- [ ] Date formatting consistent
- [ ] Currency values display correctly
- [ ] Null/empty values handled properly
- [ ] No duplicate rows
```

### Formatting
```markdown
**Tests:**
- [ ] Column widths appropriate
- [ ] Header row visible
- [ ] Text alignment correct
- [ ] Grid lines display
- [ ] Footer with metadata (date, user)
```

### Export Functionality
```markdown
**Tests:**
- [ ] PDF export renders correctly
- [ ] Excel export maintains formatting
- [ ] CSV export includes all data
- [ ] Large exports don't timeout
- [ ] Password-protected PDFs work
```

## Test Execution with Playwright CLI

### Setup
```bash
# Open MicroStrategy
playwright-cli open https://your-mstr-instance/MicroStrategyLibrary --headed

# Login (if not authenticated)
playwright-cli type "[username]"
playwright-cli.type "[password]"
playwright-cli press Enter
```

### Navigate to Dashboard
```bash
# Navigate to specific dashboard
playwright-cli goto https://your-mstr-instance/MicroStrategyLibrary/dashboard/YOUR-ID

# Wait for load
playwright-cli wait 3000

# Take baseline screenshot
playwright-cli screenshot --filename=dashboard-baseline.png
```

### Test Filters
```bash
# Open filter panel
playwright-cli click "[data-testid='filter-toggle']"

# Select filter value
playwright-cli click "[data-testid='filter-option']"

# Apply filter
playwright-cli click "[data-testid='apply-filters']"

# Verify results updated
playwright-cli screenshot --filename=filter-applied.png
```

### Test Export
```bash
# Open export menu
playwright-cli click "[data-testid='export-button']"

# Select PDF export
playwright-cli click "[data-testid='export-pdf']"

# Verify download started
playwright-cli wait 2000
```

### Capture Console Errors
```bash
# Check for errors
playwright-cli console error

# Log any issues
playwright-cli eval "console.log('Test completed: ' + Date.now())"
```

## Test Spec Format (JSON)

```json
{
  "feature": "Sales Dashboard",
  "featureKey": "MSTR-123",
  "url": "https://instance/MicroStrategyLibrary/dashboard/sales",
  "testCases": [
    {
      "name": "Dashboard loads correctly",
      "steps": [
        {"action": "navigate", "target": "dashboard URL"},
        {"action": "wait", "value": 5000},
        {"action": "assert", "target": "[data-testid='chart-main']"}
      ],
      "checkpoints": [
        {"type": "element", "target": "[data-testid='chart-main']"},
        {"type": "console", "target": "error"}
      ]
    },
    {
      "name": "Filter by region works",
      "steps": [
        {"action": "click", "target": "[data-testid='region-filter']"},
        {"action": "click", "target": "[data-testid='option-APAC']"},
        {"action": "click", "target": "[data-testid='apply-filter']"}
      ],
      "checkpoints": [
        {"type": "text", "target": "APAC Sales"},
        {"type": "url", "target": "region=APAC"}
      ]
    }
  ]
}
```

## MicroStrategy-Specific Bugs

### Common Issues
```markdown
| Issue | Description | Severity |
|-------|-------------|----------|
| Visual Not Rendering | Charts/graphs blank | High |
| Filter Not Working | Data not filtered | High |
| Slow Load | >10s to load dashboard | Medium |
| Export Failed | PDF/Excel export errors | Medium |
| Session Timeout | Logged out unexpectedly | High |
| Incorrect Data | Numbers don't match source | Critical |
```

### Known Limitations
```markdown
- Large datasets (>1M rows) may cause timeouts
- Complex hierarchies may not drill correctly
- Custom visualizations may not render in exports
- Mobile view limited for complex dashboards
```

## Performance Benchmarks

### Acceptable Load Times
| Operation | Acceptable | Degraded | Unacceptable |
|-----------|-----------|----------|---------------|
| Dashboard open | < 5s | 5-10s | > 10s |
| Filter apply | < 2s | 2-5s | > 5s |
| Report export | < 10s | 10-30s | > 30s |
| Data refresh | < 30s | 30-60s | > 60s |

### Concurrency Limits
```markdown
- Standard: 50 concurrent users
- With caching: 100 concurrent users
- Enterprise: 500+ concurrent users
```

## Bug Reporting for MicroStrategy

### Specific Details to Include
```markdown
**Environment:**
- MicroStrategy version: [e.g., 2023.3]
- Library/ Web mode: [Library/Traditional]
- Browser: [Chrome/Firefox]
- OS: [Windows/macOS]

**Dashboard Details:**
- Dashboard name: [Name]
- Dashboard ID: [ID from URL]
- Number of visualizations: [Count]
- Dataset size: [Small/Medium/Large]

**Technical Info:**
- Intelligence Server: [Connected/Disconnected]
- Cache status: [Hit/Miss]
- Network request: [Capture HAR file]
```

### Capture Technical Details
```javascript
// In browser console
console.log('MSTR Version:', MSTRApp.version);
console.log('Project:', MSTRApp.projectId);
console.log('User:', MSTRApp.userName);
```

## Integration with Other Skills

- **qa-daily-workflow**: Daily MicroStrategy testing routine
- **test-case-generator**: Generate test cases for new features
- **bug-report-formatter**: File MicroStrategy bugs to Jira
- **performance-test-designer**: Performance testing for large dashboards

## Daily QA Checklist

### Morning
- [ ] Check Jira for assigned MicroStrategy issues
- [ ] Verify test environment is available
- [ ] Review yesterday's test results

### During Testing
- [ ] Document each test case result
- [ ] Capture screenshots for failures
- [ ] Note any performance issues
- [ ] Log all bugs to Jira

### End of Day
- [ ] Compile test results
- [ ] Update Jira issue statuses
- [ ] Document lessons learned
- [ ] Plan next day's testing

## Sample Test Summary Report

```markdown
# MicroStrategy QA Test Summary
**Date:** 2026-02-11
**Tester:** QA Engineer
**Feature:** Sales Dashboard v2.0

## Summary
- Total Tests: 25
- Passed: 20 (80%)
- Failed: 3 (12%)
- Blocked: 2 (8%)

## Failed Tests
1. TC-008: Export to PDF - **MSTR-456** - PDF rendering shows blank charts
2. TC-012: Filter by Region - **MSTR-457** - APAC filter returns wrong data
3. TC-018: Mobile View - **MSTR-458** - Layout broken on iPhone

## Performance Results
- Dashboard Load: 3.2s ✅ (< 5s)
- Filter Apply: 1.8s ✅ (< 2s)
- Report Export: 8.5s ✅ (< 10s)

## Recommendations
- Fix PDF export rendering issue before release
- Review data model for filter accuracy
- Add mobile breakpoint testing
```

## Useful Links

- MicroStrategy Documentation: https://www.microstrategy.com/producthelp
- Known Issues: Check MicroStrategy support portal
- Community Forum: https://community.microstrategy.com
