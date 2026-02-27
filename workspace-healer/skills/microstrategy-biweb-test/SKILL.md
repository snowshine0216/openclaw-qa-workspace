---
name: microstrategy-ui-test
description: |
  UI testing for MicroStrategy dashboards and reports using Playwright CLI.
  Use when testing MicroStrategy web interfaces, validating dashboard elements,
  checking widget visibility, or performing smoke tests on MicroStrategy visualizations.

  Supports: MicroStrategy Cloud, MicroStrategy Library, MicroStrategy Workstation.
  Prerequisites: playwright-cli must be installed (`npm install -g @playwright/cli@latest`).

  **IMPORTANT:**
  - If a Jira issue or link is provided, use the **jira-cli** skill first to fetch issue details
  - If login password is empty, directly click the login button without attempting to type
  - All reports and snapshots must be saved to `/Users/vizcitest/Documents/Repository/Features/Reports/<feature>` where `<feature>` is the issue key (e.g., BCIN-7313) or short name
  - **Element Not Found Protocol**: If a required button or element cannot be found, STOP the test immediately and notify the user. Explain why the element cannot be found (e.g., selector mismatch, element not visible, wrong page, application error). DO NOT terminate all tests unless explicitly approved by the user.
---

# MicroStrategy UI Testing Skill

## Quick Start

```bash
# Install Playwright CLI if not installed
npm install -g @playwright/cli@latest

# Install skills for agent context
playwright-cli install --skills

# Test MicroStrategy Library
playwright-cli open https://microstrategy.cloud.microstrategy.com
```

**Jira Integration:**
- If a Jira issue or link is provided → Use **jira-cli** skill first to fetch issue details

## Core Commands

### Navigation & Authentication

```bash
# Open MicroStrategy environment
playwright-cli open <url>
playwright-cli goto <url>

# Handle login if needed
playwright-cli type <email_ref> "your-email"

# Handle password
# If password is empty: directly click the login button (DO NOT type empty password)
# If password exists: type the password, then click login
if [ -z "$PASSWORD" ]; then
  playwright-cli click <login_button_ref>
else
  playwright-cli type <password_ref> "$PASSWORD"
  playwright-cli click <login_button_ref>
fi
```

### UI Interaction

```bash
# Click elements (use snapshot to get refs)
playwright-cli click <element_ref>
playwright-cli dblclick <widget_ref>

# Type in search/filter fields
playwright-cli type <search_ref> "search term"

# Select from dropdowns
playwright-cli select <filter_ref> "value"

# Hover over visualizations
playwright-cli hover <chart_ref>
```

### Validation & Screenshots

```bash
# Capture page/element screenshot
playwright-cli screenshot
playwright-cli screenshot --filename=dashboard.png

# Get page snapshot for element refs
playwright-cli snapshot

# Run Playwright code for assertions
playwright-cli run-code "await expect(page.locator('.widget')).toBeVisible()"
```

### Session Management

```bash
# List active sessions
playwright-cli list

# Use named session for MicroStrategy
playwright-cli -s=microstrategy open <url>

# Close all browsers when done
playwright-cli close-all
```

## Common Testing Patterns

### 1. Dashboard Load Test

```bash
playwright-cli open https://microstrategy.cloud.microstrategy.com/library
playwright-cli snapshot
playwright-cli screenshot --filename=dashboard-loaded.png
```

### 2. Filter Interaction

```bash
# Navigate to dashboard with filters
playwright-cli open <dashboard-url>

# Get filter element ref
playwright-cli snapshot

# Apply filter
playwright-cli type <filter_ref> "2024"
playwright-cli press Enter

# Verify results updated
playwright-cli screenshot --filename=filtered-view.png
```

### 3. Widget Validation

```bash
# Open specific visualization
playwright-cli open <widget-url>

# Check widget exists
playwright-cli run-code "const widgets = await page.locator('.widget-container').count(); console.log('Widgets found:', widgets);"

# Take screenshot of visualization
playwright-cli screenshot --filename=widget.png
```

### 4. Full Workflow Test

```bash
# 1. Open MicroStrategy
playwright-cli open <library-url>

# 2. Navigate to dashboard
playwright-cli click <dashboard_ref>
playwright-cli snapshot

# 3. Apply date filter
playwright-cli type <date_filter_ref> "Q1 2024"
playwright-cli press Enter

# 4. Wait for refresh
playwright-cli run-code "await page.waitForTimeout(3000)"

# 5. Verify charts loaded
playwright-cli run-code "const charts = await page.locator('.chart').count(); console.log('Charts:', charts);"

# 6. Take final screenshot
playwright-cli screenshot --filename=final-dashboard.png
```

## Test Id Attribute

MicroStrategy often uses custom test ids. Configure in `playwright-cli.json`:

```json
{
  "testIdAttribute": "data-mstr-test-id"
}
```

## Network Mocking (Optional)

Mock API responses for isolated testing:

```bash
playwright-cli route "/api/analytics/*" --mock=response.json
playwright-cli route-list
```

## Video Recording

Record test sessions for debugging:

```bash
# Start recording (saves to output dir)
playwright-cli video-start

# Perform test actions
playwright-cli open <dashboard>
playwright-cli snapshot

# Stop and save
playwright-cli video-start my-test.mp4
```

## Troubleshooting

### Element Not Found

1. Use `playwright-cli snapshot` to get fresh refs
2. Wait for page load: `playwright-cli run-code "await page.waitForLoadState('networkidle')"`
3. Try headed mode: `playwright-cli open <url> --headed`

**Critical Protocol**: If a required element cannot be found after these steps:
- STOP the test immediately
- Notify the user with a clear explanation:
  - Which element was being searched
  - What selector/identifier was used
  - Why it could not be found (not visible, not in DOM, wrong page, etc.)
  - Current page URL and title
  - Suggestions for resolution
- DO NOT terminate all tests or proceed further without user approval

### Slow Loading Dashboards

```bash
# Increase timeout
playwright-cli run-code "page.setDefaultTimeout(60000)"

# Or via config
# Add to playwright-cli.json: { "timeouts": { "navigation": 60000 } }
```

### Session Issues

```bash
# Kill all sessions and start fresh
playwright-cli kill-all
playwright-cli close-all

# Or delete user data
playwright-cli delete-data
```

## Jira Integration

When a Jira issue or link is provided:
1. **First**: Use the **jira-cli** skill to fetch issue details and test requirements
2. **Then**: Create test cases based on the Jira issue specifications
3. **After**: Execute MicroStrategy UI tests against the target environment
4. **Finally**: Update the Jira issue with test results and attach screenshots

## Report & Snapshot Output

All reports and snapshots must be saved to:
```
/Users/vizcitest/Documents/Repository/Features/Reports/<feature>
```

Where `<feature>` is:
- The issue key (e.g., `BCIN-7313`, `BCIN-9999`)
- Or a short descriptive name (e.g., `content-group-editor`, `dashboard-filters`)

Example:
```bash
# Take screenshot and save to feature-specific folder
playwright-cli screenshot --filename=/Users/vizcitest/Documents/Repository/Features/Reports/BCIN-7313/dashboard.png

# Generate test report
playwright-cli screenshot --filename=/Users/vizcitest/Documents/Repository/Features/Reports/BCIN-7313/test-result.png

# Full test report
playwright-cli screenshot --filename=/Users/vizcitest/Documents/Repository/Features/Reports/content-group-editor/final-result.png
```

**Required Output Files:**
- `<feature>-Test-Report.md` - Detailed test report with findings
- `<feature>-<timestamp>-screenshot.png` - Visual evidence of test results
- `<feature>-<timestamp>-error.png` - Screenshots of errors if any

## References

- Playwright CLI commands: `playwright-cli --help`
- MicroStrategy Library API: See [references/mstr-api.md](references/mstr-api.md)
- Common selectors: See [references/selectors.md](references/selectors.md)

---

## Verified Login Workflow (Tested Feb 2026)

### Empty Password Login (bxu user on tec-l-1183620)

The MicroStrategy environment at `tec-l-1183620.labs.microstrategy.com` uses SSO with empty password:

**Direct Login Steps (SUCCESSFUL):**
1. Navigate directly to Admin & Modeling URL
2. Username field is pre-filled with `bxu`
3. **Leave password field EMPTY** (critical - do NOT type anything)
4. Click **"Log in with Credentials"** button
5. Land on Applications list page

**Key Learning:** Do NOT attempt to type empty string in password field - directly click the login button.

### Browser Control Tool Workflow

For complex MicroStrategy testing, use the **browser** tool directly:

```bash
# Start browser session
browser action=start profile=openclaw

# Navigate to Admin & Modeling
browser action=navigate targetUrl="https://tec-l-1183620.labs.microstrategy.com/MicroStrategyLibrary/apps/admin-modeling/#/application"

# Get fresh element refs after page load
browser action=snapshot refs=aria

# Click elements using refs from snapshot
browser action=act request='{"kind": "click", "ref": "f11e10"}'  # New Application button

# Capture screenshots
browser action=screenshot fullPage=true
```

### Common Admin & Modeling Workflows

#### Critical Rule: Always Get Fresh Refs!

**Refs change on every page load!** Never reuse refs from previous snapshots.

**CORRECT Workflow:**
```bash
# 1. Navigate to page
browser action=navigate targetUrl="https://.../#/application"

# 2. Wait for content to load
exec command="sleep 3"

# 3. GET FRESH SNAPSHOT (MOST IMPORTANT STEP!)
browser action=snapshot refs=aria

# 4. Look for your element in the snapshot output
# Example: button "New Application" [ref=f11e10] [cursor=pointer]:

# 5. Use the NEW ref from this snapshot
browser action=act request='{"kind": "click", "ref": "f11e10"}'
```

**INCORRECT (what I did wrong initially):**
```bash
# Using stale refs from previous snapshot - WILL FAIL!
browser action=act request='{"kind": "click", "ref": "f9e10"}'  # OLD REF!
```

#### Creating New Application (BCIN-7314 test path)

```bash
# 1. Navigate to Applications page
browser action=navigate targetUrl="https://tec-l-1183620.labs.microstrategy.com/MicroStrategyLibrary/apps/admin-modeling/#/application"

# 2. Click "New Application" button (ref=f11e10)
browser action=act request='{"kind": "click", "ref": "f11e10"}'

# 3. Wait for form to load
exec command="sleep 3"

# 4. Click "Appearance" tab (ref=f12e28)
browser action=act request='{"kind": "click", "ref": "f12e28"}'

# 5. Select Dark theme (ref=f12e181)
browser action=act request='{"kind": "click", "ref": "f12e181"}'

# 6. Screenshot preview
browser action=screenshot fullPage=true

# 7. Click "Reset to Default" (ref=f12e94)
browser action=act request='{"kind": "click", "ref": "f12e94"}'

# 8. Screenshot to verify preview restored
browser action=screenshot fullPage=true
```

**Verified Feb 2026:** BCIN-7314 - Reset to Default properly restores preview with all UI elements visible.

#### Testing Content Groups (BCIN-7313 test path)

```bash
# 1. Navigate to Content Groups
browser action=navigate targetUrl="https://tec-l-1183620.labs.microstrategy.com/MicroStrategyLibrary/apps/admin-modeling/#/content-group"

# 2. GET FRESH SNAPSHOT
exec command="sleep 2"
browser action=snapshot refs=aria

# 3. Verify "New Content Group" button is visible in snapshot
# Look for: button "New Content Group" [ref=...]

# 4. Use the ref from THIS snapshot
browser action=act request='{"kind": "click", "ref": "<ref_from_snapshot>"}'
```

**Verified Feb 2026:** BCIN-7313 - "New Content Group" button works; content grid displays correctly after adding content.

---

## Troubleshooting Guide

### Problem: "Can't find the button I want to click"

**Symptoms:**
- Click fails with error
- Element not found
- Wrong element clicked

**Root Cause:** You're using stale refs from a previous snapshot.

**Solution:**
1. **Navigate to the page again**
2. **Wait for load**: `exec command="sleep 3"`
3. **Take fresh snapshot**: `browser action=snapshot refs=aria`
4. **Find your element** in the new snapshot output
5. **Use the NEW ref** in your click command

**Example Fix:**
```bash
# WRONG - Using old ref
browser action=act request='{"kind": "click", "ref": "f9e10"}'

# RIGHT - Get fresh ref
browser action=navigate targetUrl="https://.../#/application"
exec command="sleep 3"
browser action=snapshot refs=aria
# Find button "New Application" [ref=f11e10] in output
browser action=act request='{"kind": "click", "ref": "f11e10"}'
```

### Why Refs Change

- MicroStrategy is a **Single Page Application (SPA)**
- Each navigation triggers a new render
- React/Vue assigns new element IDs on each render
- **Refs are session-specific and page-specific**

### Prevention

**Always follow this pattern:**
```
Navigate → Wait → Snapshot → Click (with fresh ref)
```
