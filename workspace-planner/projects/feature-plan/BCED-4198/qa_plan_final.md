# Comprehensive QA Plan: BCED-4198 WebStation Create and Edit Metrics

## 📊 Summary

| Field | Value |
|-------|-------|
| **Feature Link** | [BCED-4198](https://strategyagile.atlassian.net/browse/BCED-4198) |
| **Release Version** | 26.03 |
| **QA Owner** | QA Team (WebStation) |
| **Feature Title** | [WebStation] Create and Edit Metrics in Workstation Web |
| **UX Design Link** | [Figma Objects Blade - Metric Editor](https://www.figma.com/design/EHmNq6ZFHtMsN6dIp60ffB/Objects-Blade?node-id=1-2) |
| **Status** | ✅ Done (Validated) |
| **Demo Video** | [Metric Editor in Webstation.webm](https://microstrategy-my.sharepoint.com/:v:/p/qiwu/IQDCsjzpyrJLRIk_8NgQBwBbAQWujYxV7anIRIQ-FNiD_io) |
| **UX Review** | [Confluence UX Review](https://microstrategy.atlassian.net/wiki/spaces/TECCTC/pages/5849907462/) |
| **Date Generated** | 2026-02-25 |
| **Plan Status** | Draft |

## 📝 Background

### Key Problem Statement

WebStation users need the ability to create and edit metrics directly in the web interface without switching to Workstation Desktop. This brings metric authoring capabilities to a cloud-first, web-based experience.

### Solution

Port the Metric Editor from Workstation Desktop to Workstation Web with full UI parity, including:
- Formula editor with auto-complete and syntax validation
- Function catalog and object browser
- Advanced metric features (levels, conditions, transformations)
- Nested metric support
- Base formula integration
- Data type configuration and formatting

### Business Context

- **User Impact**: Enables web-first workflows for data modelers and analysts. Critical for cloud adoption.
- **Technical Scope**: Web UI implementation of metric editor, parallel to existing desktop feature
- **Dependencies**: 
  - Workstation Web platform
  - Metric Editor API/backend services
  - Base Formula objects
  - Function catalog metadata
- **Related Features**: Part of "Objects Blade" initiative (Filter Editor BCED-85, Attribute Editor BCGM-5070, Fact Editor BCGM-5072)

## 🎯 QA Goals

### E2E (End-to-End Testing)
**Goal**: Validate complete create/edit metric workflows from web UI<br />
**Priority**: 🔴 Critical

### FUN (Functional Testing)
**Goal**: Verify formula editor functionality (validation, auto-complete, syntax)<br />
**Priority**: 🔴 Critical

### UX (User Experience)
**Goal**: Confirm UI parity with Desktop Workstation<br />
**Priority**: 🟠 High

### INT (Integration Testing)
**Goal**: Verify integration with base formulas, functions catalog, objects<br />
**Priority**: 🟠 High

### CERT (Certification Testing)
**Goal**: Browser compatibility (Chrome, Firefox, Safari, Edge)<br />
**Priority**: 🟠 High

### ACC (Accessibility Testing)
**Goal**: Accessibility compliance (WCAG 2.1 AA)<br />
**Priority**: 🟡 Medium

### PERF (Performance Testing)
**Goal**: Performance with complex formulas and large catalogs<br />
**Priority**: 🟡 Medium

### AUTO (Automation)
**Goal**: Regression test automation coverage<br />
**Priority**: 🟡 Medium


## 🔍 Test Key Points

### 1. Metric Creation Workflow

| Test Area | Key Points | Risk Level |
|-----------|------------|------------|
| **New Metric** | File menu → New Metric, environment/project selection, metric editor opens | 🔴 Critical |
| **Naming** | Click name field, type new name, press Enter, validate persistence | 🟠 High |
| **Data Type** | Select from dropdown (Default, Binary, Decimal, etc.), verify formatting options appear | 🟠 High |
| **Description** | Type description, validate character limit and special chars | 🟡 Medium |
| **Save** | Click Save, verify metric persists, can be reopened and edited | 🔴 Critical |

### 2. Formula Editor - Guided Experience

| Test Area | Key Points | Risk Level |
|-----------|------------|------------|
| **Functions Pane** | Search functions, browse by category, view syntax/description | 🟠 High |
| **Objects Pane** | Search objects, browse folders, view base formulas/facts/metrics/attributes | 🟠 High |
| **Double-Click Add** | Double-click function → adds to formula pane with syntax popup | 🔴 Critical |
| **Double-Click Object** | Double-click object → adds to formula pane at cursor | 🔴 Critical |
| **Syntax Help** | Function popup shows parameters, example, Details link | 🟡 Medium |

### 3. Formula Editor - Direct Typing

| Test Area | Key Points | Risk Level |
|-----------|------------|------------|
| **Auto-Complete** | Type text, dropdown shows matching objects/functions | 🔴 Critical |
| **Function Selection** | Select function from dropdown, syntax popup appears | 🟠 High |
| **Parameter Copy** | Copy/paste parameter syntax from popup into formula | 🟡 Medium |
| **Level Prompts** | Type `?{prompt_name}` syntax, validate prompt reference | 🟡 Medium |
| **Operators** | Type +, -, *, / operators, validate formula parsing | 🔴 Critical |

### 4. Formula Validation

| Test Area | Key Points | Risk Level |
|-----------|------------|------------|
| **Validate Button** | Click Validate, formula checked for syntax errors | 🔴 Critical |
| **Auto-Fill Parameters** | Validation auto-fills missing parameters (NTile example) | 🟠 High |
| **Report Level** | Validation adds report level `{...}` notation | 🟠 High |
| **Error Messages** | Invalid syntax shows clear error message with line/column | 🔴 Critical |
| **Formula Repair** | Edit formula after validation error, re-validate | 🟠 High |

### 5. Breakdown Tab - Levels

| Test Area | Key Points | Risk Level |
|-----------|------------|------------|
| **Add Level** | Click Level button, select target attribute, level added | 🟠 High |
| **Nested Metric Levels** | Expand Base Formula → inner formula, add level to inner formula | 🟡 Medium |
| **Filtering Options** | Select Standard/Absolute/Ignore/None filtering | 🟠 High |
| **Aggregation Options** | Select Standard/None aggregation | 🟠 High |
| **Reset Levels** | Click Reset, all levels removed, report level restored | 🟡 Medium |
| **Multiple Levels** | Add multiple levels to same metric, validate calculation | 🟡 Medium |

### 6. Breakdown Tab - Conditions

| Test Area | Key Points | Risk Level |
|-----------|------------|------------|
| **Add Condition** | Click Condition, search/navigate to filter, select | 🟠 High |
| **Nested Metric Conditions** | Apply condition to inner formula in nested metric | 🟡 Medium |
| **Multiple Conditions** | Add multiple conditions, verify AND/OR logic | 🟠 High |
| **Advanced Options** | Configure filter interaction options | 🟡 Medium |

### 7. Breakdown Tab - Transformations

| Test Area | Key Points | Risk Level |
|-----------|------------|------------|
| **Add Transformation** | Click Transformation, search/navigate, select | 🟠 High |
| **Time-Based Transforms** | Apply "last year", "4 months ago" transformations | 🟠 High |
| **Nested Metric Transforms** | Apply transformation to inner formula | 🟡 Medium |
| **Multiple Transforms** | Add multiple transformations, verify chaining | 🟡 Medium |

### 8. Nested Metrics

| Test Area | Key Points | Risk Level |
|-----------|------------|------------|
| **Create Nested Metric** | Build formula with function inside function (e.g., RunningAvg(Sum(Revenue))) | 🟠 High |
| **Expand Base Formula** | Expand Base Formula node to show inner formulas | 🟡 Medium |
| **Inner Formula Settings** | Apply separate level/condition/transformation to inner formula | 🟠 High |
| **Validation** | Validate nested metric, verify parameter auto-fill | 🟠 High |

### 9. Base Formula Integration

| Test Area | Key Points | Risk Level |
|-----------|------------|------------|
| **Browse Base Formulas** | Objects pane shows base formulas, can browse | 🟠 High |
| **Add Base Formula** | Double-click or select base formula, adds to metric | 🟠 High |
| **Reusable Definitions** | Verify base formula references work correctly in metric calculation | 🔴 Critical |

### 10. Formatting

| Test Area | Key Points | Risk Level |
|-----------|------------|----------||
| **Column Header Format** | Configure column header formatting options | 🟡 Medium |
| **Value Format** | Configure value formatting (decimal places, currency, etc.) | 🟠 High |
| **Number Format** | Set precision, scale for Decimal data type | 🟠 High |

### 11. Metric Options

| Test Area | Key Points | Risk Level |
|-----------|------------|------------|
| **Subtotal Functions** | Select functions for totaling on report | 🟡 Medium |
| **Dynamic Aggregation** | Configure dynamic aggregation function | 🟡 Medium |
| **Joins** | Specify metric join type | 🟡 Medium |
| **VLDB Properties** | Set null checking and other VLDB properties | 🟡 Medium |

### 12. Edit Existing Metric

| Test Area | Key Points | Risk Level |
|-----------|------------|------------|
| **Find Metric** | Search/browse to existing metric, double-click | 🔴 Critical |
| **Load Formula** | Metric editor opens with formula, name, description loaded | 🔴 Critical |
| **Edit Formula** | Modify formula, validate, save | 🔴 Critical |
| **Edit Breakdown** | Modify levels/conditions/transformations, save | 🟠 High |
| **Versioning** | Verify metric version history (if applicable) | 🟡 Medium |

### 13. UI/UX - Web-Specific

| Test Area | Key Points | Risk Level |
|-----------|------------|------------|
| **Responsive Design** | Test on 1920px, 1366px, 1024px screen widths | 🟠 High |
| **Sidebar Collapse** | Collapse/expand Functions and Objects panes | 🟡 Medium |
| **Tab Navigation** | Tab between formula editor, breakdown tab, formatting tab, options tab | 🟠 High |
| **Keyboard Shortcuts** | Test common shortcuts (Ctrl+S save, Ctrl+Enter validate) | 🟡 Medium |
| **Loading States** | Verify loading spinners for functions/objects load | 🟡 Medium |
| **Error Feedback** | Clear error messages with actionable guidance | 🔴 Critical |

### 14. Browser Compatibility

| Test Area | Key Points | Risk Level |
|-----------|------------|------------|
| **Chrome** | Full workflow on latest Chrome | 🔴 Critical |
| **Firefox** | Full workflow on latest Firefox | 🟠 High |
| **Safari** | Full workflow on latest Safari | 🟠 High |
| **Edge** | Full workflow on latest Edge | 🟠 High |
| **Browser-Specific Issues** | Test auto-complete dropdowns, syntax popups, modals | 🟠 High |

### 15. Accessibility

| Test Area | Key Points | Risk Level |
|-----------|------------|------------|
| **Keyboard Navigation** | Navigate entire editor with keyboard only | 🟠 High |
| **Screen Reader** | Test with NVDA/JAWS, verify ARIA labels | 🟡 Medium |
| **Focus Indicators** | Visible focus outline on all interactive elements | 🟠 High |
| **Color Contrast** | WCAG 2.1 AA contrast ratios (4.5:1 text, 3:1 UI) | 🟠 High |
| **Alt Text** | Icons and images have descriptive alt text | 🟡 Medium |

### 16. Performance

| Test Area | Key Points | Risk Level |
|-----------|------------|------------|
| **Editor Load Time** | p50 < 1s, p95 < 2s, p99 < 3s (from click to fully interactive) | 🟠 High |
| **Formula Validation** | p50 < 500ms, p95 < 1s, p99 < 2s for complex formulas | 🟡 Medium |
| **Auto-Complete Latency** | p50 < 200ms, p95 < 300ms, p99 < 500ms for suggestions to appear | 🟠 High |
| **Large Object Catalog** | Browse/scroll through 1000+ functions/objects with <16ms frame time (60 FPS) | 🟡 Medium |
| **Memory Usage** | Monitor for leaks during 1-hour editing session; <50MB increase acceptable | 🟡 Medium |
| **Concurrent Users** | Performance targets maintained under 50 concurrent metric editors | 🟡 Medium |

### 17. Integration

| Test Area | Key Points | Risk Level |
|-----------|------------|------------|
| **Use on Report** | Create metric, add to report, verify calculation | 🔴 Critical |
| **Use in Dashboard** | Create metric, add to dashboard, verify visualization | 🔴 Critical |
| **Use in Filter** | Create metric, use in metric-based filter | 🟠 High |
| **Use in Other Metrics** | Create metric A, reference in metric B formula | 🟠 High |
| **Cross-Environment** | Create metric in Dev, deploy to UAT/Prod, verify | 🟡 Medium |

### 18. Security

| Test Area | Key Points | Risk Level |
|-----------|------------|------------|
| **SQL Injection** | Metric name/description with `'; DROP TABLE metrics;--`, verify sanitization | 🔴 Critical |
| **XSS in Names** | Metric name/description with `<script>alert('xss')</script>`, verify HTML escaping | 🔴 Critical |
| **XSS in Formulas** | Formula with HTML/JavaScript, verify sandbox/sanitization | 🔴 Critical |
| **Authorization** | User A tries to edit User B's private metric, verify 403 Forbidden | 🟠 High |
| **Formula Injection** | Malicious formula like `System.exit()` or ` DROP TABLE`, verify validation rejects | 🔴 Critical |
| **Path Traversal** | Metric name with `../../config`, verify no file system access | 🟠 High |

### 19. Error Recovery & Resilience

| Test Area | Key Points | Risk Level |
|-----------|------------|------------|
| **Network Loss During Save** | Disconnect network mid-save, verify error message and draft preservation | 🟠 High |
| **Browser Crash Recovery** | Close browser during edit (no save), reopen, verify auto-save/draft recovery | 🟡 Medium |
| **Server Error (500)** | Mock 500 error during validation, verify graceful error display with retry option | 🟠 High |
| **Partial Save Failure** | Save fails after metric created but before formula saved, verify rollback/consistency | 🟠 High |
| **API Timeout** | Mock slow API response (>30s), verify loading state and timeout handling | 🟡 Medium |
| **Invalid Session** | Session expires during editing, verify re-authentication without data loss | 🟠 High |

## ⚠️ Risk & Mitigation

| Risk Area | Description | Mitigation | Priority |
|-----------|-------------|------------|----------|
| **Formula Parsing Differences** | Web parser may differ from desktop, causing formula errors | Compare parsing behavior between web and desktop; test edge cases (nested functions, complex operators) | 🔴 Critical |
| **Auto-Complete Performance** | Large catalogs may cause dropdown lag or browser freeze | Load test with 1000+ objects; implement pagination/virtualization; monitor memory | 🟠 High |
| **Browser Inconsistencies** | Formula editor may behave differently across browsers (caret position, syntax highlighting) | Test all major browsers early; isolate browser-specific issues | 🟠 High |
| **Accessibility Gaps** | Complex nested metric UI may be hard to navigate with keyboard/screen reader | Conduct accessibility audit; test with assistive tech; ensure ARIA labels | 🟠 High |
| **Base Formula Synchronization** | Base formula changes may not propagate to metrics using them | Test base formula update scenarios; verify metric recalculation | 🟠 High |
| **UX Review Issues** | UX review document lists several UI issues identified post-development | Address UX review findings before release; re-test affected areas | 🔴 Critical |
| **Nested Metric Complexity** | UI for applying levels/conditions/transformations to inner formulas may be confusing | Usability testing; clear visual hierarchy; tooltips/help text | 🟡 Medium |
| **Validation Auto-Fill** | Auto-filled parameters may be incorrect for certain function signatures | Test all function categories; verify parameter defaults; allow manual override | 🟠 High |

## 📋 QA Summary Table

| Category | Details |
|----------|---------|
| **Code Changes** | N/A (Development complete) |
| **New Files** | Metric Editor web UI components |
| **Modified Files** | N/A |
| **Deleted Files** | N/A |
| **Test Coverage** | TBD - Automation coverage to be determined |
| **Testing Status** | ✅ Feature marked as "Validated" by development team on 2026-02-24 |
| **Known Issues** | UX review identified several UI issues (see UX Review link) |

## 🧪 Test Scenarios

### Scenario 1: Create Simple Metric (Happy Path)

**Goal**: Verify end-to-end creation of a simple metric

**Steps**:
1. Open Workstation Web
2. File menu → New Metric
3. Select environment and project
4. Name metric: "Total Revenue"
5. Data type: Default
6. Description: "Sum of all revenue"
7. Functions pane → Search "Sum"
8. Double-click Sum function
9. Objects pane → Search "Revenue" (fact)
10. Double-click Revenue
11. Formula should read: `Sum(Revenue)`
12. Click Validate
13. Verify validation success, report level added
14. Click Save

**Expected Result**:
- Metric created successfully
- Can reopen metric and see formula
- Metric appears in project object list
- Metric can be added to report and calculates correctly

**Priority**: 🔴 Critical

---

### Scenario 2: Create Compound Metric

**Goal**: Verify metric with multiple metrics in formula

**Steps**:
1. Create new metric: "Total Profit"
2. Formula: `Sum(Revenue - Cost)`
3. Validate and save

**Expected Result**:
- Formula validates successfully
- Metric calculates: sum of (Revenue minus Cost) per row, then aggregate

**Priority**: 🟠 High

---

### Scenario 3: Create Metric with Level

**Goal**: Verify level metric (regional revenue regardless of report attributes)

**Steps**:
1. Create new metric: "Regional Revenue"
2. Formula: `Sum(Revenue)`
3. Validate
4. Breakdown tab → Click Level
5. Add New → Select "Region" attribute
6. Filtering: Standard
7. Aggregation: Standard
8. Save
9. Add to report with City attribute
10. Verify metric shows regional totals, not city-level

**Expected Result**:
- Metric calculates at Region level even on City report
- Contribution metrics can use this to calculate city % of regional total

**Priority**: 🟠 High

---

### Scenario 4: Create Conditional Metric

**Goal**: Verify metric with filter condition

**Steps**:
1. Create new metric: "Q1 Revenue"
2. Formula: `Sum(Revenue)`
3. Validate
4. Breakdown tab → Click Condition
5. Add New → Search "Q1 Filter"
6. Select Q1 Filter
7. Save
8. Add to report
9. Verify metric only includes Q1 data

**Expected Result**:
- Metric filtered to Q1 only
- Other metrics on report not affected by filter

**Priority**: 🟠 High

---

### Scenario 5: Create Transformation Metric

**Goal**: Verify metric with time transformation

**Steps**:
1. Create new metric: "Last Year Revenue"
2. Formula: `Sum(Revenue)`
3. Validate
4. Breakdown tab → Click Transformation
5. Add New → Search "Last Year" transformation
6. Select transformation
7. Save
8. Add to report with current year filter
9. Verify metric shows last year's values

**Expected Result**:
- Metric displays revenue from one year ago
- Can compare current year vs last year in same report

**Priority**: 🟠 High

---

### Scenario 6: Create Nested Metric

**Goal**: Verify nested metric with multiple function layers

**Steps**:
1. Create new metric: "Running Average Revenue"
2. Formula: `RunningAvg(Sum(Revenue))`
3. Validate (should auto-fill parameters)
4. Expand Base Formula to see inner Sum(Revenue)
5. Click on inner formula → Click Level
6. Add Region level to inner Sum
7. Save
8. Add to report
9. Verify running average calculated correctly

**Expected Result**:
- Nested formula validated
- Inner formula level applied correctly
- Running average calculation correct

**Priority**: 🟠 High

---

### Scenario 7: Edit Existing Metric

**Goal**: Verify editing and re-saving metric

**Steps**:
1. Search for existing metric "Total Revenue"
2. Double-click to open
3. Verify formula loads: `Sum(Revenue)`
4. Change formula to: `Sum(Revenue) * 1.1` (10% markup)
5. Validate
6. Save
7. Reopen metric
8. Verify updated formula persists
9. Add to report, verify calculation includes 10% markup

**Expected Result**:
- Metric opens with existing formula
- Edit saves successfully
- Reports using metric reflect updated calculation

**Priority**: 🔴 Critical

---

### Scenario 8: Auto-Complete Functions

**Goal**: Verify auto-complete during typing

**Steps**:
1. Create new metric
2. Type in formula pane: "Su"
3. Verify dropdown appears with Sum, Subtract, etc.
4. Select Sum from dropdown
5. Verify syntax popup appears showing Sum(expression)
6. Type "Reven"
7. Verify dropdown shows Revenue (fact)
8. Select Revenue
9. Formula should read: `Sum(Revenue)`

**Expected Result**:
- Auto-complete suggestions accurate
- Syntax help popup helpful
- Dropdown performance smooth

**Priority**: 🔴 Critical

---

### Scenario 9: Formula Validation Error

**Goal**: Verify validation error handling

**Steps**:
1. Create new metric
2. Type invalid formula: `Sum(Revenue`  (missing closing parenthesis)
3. Click Validate
4. Verify error message displays
5. Error should indicate missing ")"
6. Add closing parenthesis
7. Validate again
8. Verify validation success

**Expected Result**:
- Clear error message with position
- User can fix formula based on error
- Re-validation works after fix

**Priority**: 🔴 Critical

---

### Scenario 10: Browser Compatibility - Chrome vs Firefox

**Goal**: Verify metric editor works identically in different browsers

**Steps**:
1. Create metric in Chrome: `Sum(Revenue)` with Region level
2. Save
3. Open same metric in Firefox
4. Verify formula displays correctly
5. Edit formula in Firefox, save
6. Open in Safari, verify edit persisted
7. Add to report in Edge, verify calculation

**Expected Result**:
- Metric editor UI consistent across browsers
- Formula editing works in all browsers
- Saved metrics portable across browsers

**Priority**: 🟠 High

---

### Scenario 11: Accessibility - Keyboard Navigation

**Goal**: Verify metric editor accessible via keyboard only

**Steps**:
1. Open metric editor
2. Use Tab key to navigate all fields (name, data type, description, formula pane)
3. Use arrow keys in Functions pane
4. Press Enter to select function
5. Tab to Objects pane, navigate with arrows
6. Press Enter to add object
7. Tab to Validate button, press Enter
8. Tab to Save button, press Enter

**Expected Result**:
- All interactive elements reachable via keyboard
- Focus indicators visible
- No keyboard traps
- Logical tab order

**Priority**: 🟠 High

---

### Scenario 12: Performance - Large Catalog

**Goal**: Verify editor performance with 1000+ objects

**Steps**:
1. Connect to project with 1000+ metrics/facts
2. Open metric editor
3. Time editor load
4. Type in formula pane, trigger auto-complete
5. Measure dropdown response time
6. Browse Objects pane, scroll through list
7. Measure scroll lag/memory usage

**Expected Result**:
- Editor loads in < 3 seconds
- Auto-complete appears in < 500ms
- Scrolling smooth (no lag)
- Memory usage stable

**Priority**: 🟡 Medium

---

### Scenario 13: Integration - Use Metric on Report

**Goal**: Verify metric created in web editor works on report

**Steps**:
1. Create metric in web editor: `Sum(Revenue)`
2. Save metric
3. Create new report
4. Add Region attribute
5. Add "Sum(Revenue)" metric
6. Run report
7. Verify metric calculates correctly
8. Compare to desktop-created metric

**Expected Result**:
- Web-created metric available in report
- Calculation matches expected values
- No difference from desktop-created metric

**Priority**: 🔴 Critical

---

### Scenario 14: Data Type Formatting

**Goal**: Verify data type configuration options

**Steps**:
1. Create new metric
2. Data Type → Select "Decimal"
3. Click More Settings (three dots)
4. Set Precision: 10
5. Set Scale: 2
6. Formula: `Sum(Revenue)`
7. Save
8. Add to report
9. Verify metric displays with 2 decimal places

**Expected Result**:
- Decimal formatting options available
- Precision and scale applied correctly
- Report respects data type settings

**Priority**: 🟠 High

---

### Scenario 15: Base Formula in Metric

**Goal**: Verify base formula can be used in metric

**Steps**:
1. Assume base formula exists: "Profit Margin" = `(Revenue - Cost) / Revenue`
2. Create new metric: "Average Profit Margin"
3. Objects pane → Search "Profit Margin" (base formula)
4. Double-click to add
5. Formula: `Avg([Profit Margin])`
6. Validate and save
7. Add to report
8. Verify calculation correct

**Expected Result**:
- Base formula appears in Objects pane
- Can be added to metric formula
- Calculation uses base formula definition

**Priority**: 🟠 High

---

### Scenario 16: Base Formula Update Propagation

**Goal**: Verify metrics using base formulas update when base formula changes

**Steps**:
1. Create base formula "Profit" with definition: `Revenue - Cost`
2. Create new metric "Average Profit"
3. Formula: `Avg([Profit])`  (references base formula)
4. Validate and save
5. Add "Average Profit" metric to report
6. Note calculated values (e.g., Avg = $150)
7. Edit base formula "Profit" to new definition: `(Revenue - Cost) * 0.9` (10% reduction)
8. Save base formula
9. Reopen report with "Average Profit" metric
10. Verify metric recalculates automatically (e.g., Avg now = $135)

**Expected Result**:
- Metric automatically uses updated base formula definition
- No manual metric edit required
- Report values reflect new calculation
- No data integrity issues

**Priority**: 🔴 Critical

---

### Scenario 17: Formula Length and Complexity Limits

**Goal**: Verify editor handles very long/complex formulas

**Steps**:
1. Create new metric "Complex Calculation"
2. Build deeply nested formula with 20+ function layers:
   ```
   Sum(
     Avg(
       RunningSum(
         Rank(
           NTile(...
           )
         )
       )
     )
   )
   ```
3. Continue adding nesting until formula exceeds 1000 characters
4. Attempt to validate
5. Attempt to save
6. Monitor browser console for errors
7. Monitor browser memory usage

**Expected Result**:
- Editor doesn't freeze or crash
- Either:
  - Formula validates and saves successfully (if supported), OR
  - Clear error message: "Formula too complex" or "Maximum nesting depth exceeded"
- Browser remains responsive
- Memory usage stable

**Priority**: 🔴 Critical

---

### Scenario 18: Special Characters in Object Names

**Goal**: Verify formula editor handles objects with special characters

**Steps**:
1. Assume test environment has objects with special char names:
   - Fact: `Revenue (USD)`
   - Fact: `Cost/Unit`
   - Metric: `Year's Total`
   - Attribute: `Region [Primary]`
2. Create new metric
3. Type "Reven" in formula pane
4. Verify auto-complete shows `Revenue (USD)` correctly
5. Select from dropdown
6. Verify formula displays object correctly (with escaping if needed)
7. Add operator and second object with special chars
8. Formula example: `Sum([Revenue (USD)]) / Avg([Cost/Unit])`
9. Validate formula
10. Save and test on report

**Expected Result**:
- Objects with special characters appear in auto-complete
- Formula parser correctly handles parentheses, slashes, apostrophes, brackets
- Validation succeeds
- Metric calculates correctly on report

**Priority**: 🟠 High

---

### Scenario 19: Concurrent Edit Conflict

**Goal**: Verify behavior when multiple users edit same metric

**Steps**:
1. User A logs in, opens metric "Total Revenue"
2. User B logs in (different browser/session), opens same metric "Total Revenue"
3. User A edits formula to: `Sum(Revenue) * 1.1`
4. User A saves successfully
5. User B (still has old version open) edits formula to: `Sum(Revenue) - Cost`
6. User B attempts to save
7. Observe behavior

**Expected Result** (depends on product requirements):
- **Option A (Optimistic Locking)**: User B sees warning: "Metric modified by another user. Reload to see latest version?"
- **Option B (Last-Write-Wins)**: User B's save succeeds, overwrites User A's changes (with or without warning)
- **Option C (Pessimistic Locking)**: User B sees "Metric locked by User A" when attempting to edit

**Priority**: 🟠 High  
**Note**: Clarify expected behavior with product team before testing

---

### Scenario 20: Security - SQL Injection and XSS

**Goal**: Verify metric editor sanitizes malicious input

**Steps**:

**SQL Injection Test**:
1. Create new metric
2. Metric name: `Test'; DROP TABLE metrics; --`
3. Description: `1' OR '1'='1`
4. Formula: `Sum(Revenue)`
5. Save
6. Verify database not corrupted
7. Verify metric saves safely with escaped name

**XSS Test**:
8. Create new metric
9. Metric name: `<script>alert('XSS')</script>`
10. Description: `<img src=x onerror=alert('XSS')>`
11. Save
12. View metric in object browser
13. View metric on report
14. Verify no JavaScript executes
15. Verify HTML is escaped (displays as text)

**Formula Injection Test**:
16. Create new metric
17. Attempt malicious formula: `System.exit(); DROP TABLE users;`
18. Validate formula
19. Verify validation rejects malicious code
20. Verify no server-side execution

**Expected Result**:
- SQL injection attempts safely escaped/sanitized
- XSS payloads displayed as plain text (HTML escaped)
- Malicious formulas rejected by validation
- No security vulnerabilities exploitable

**Priority**: 🔴 Critical

---

## 📌 Additional Notes

### Demo Video Available

Development team provided a demo video showing the feature in action:
[Metric Editor in Webstation.webm](https://microstrategy-my.sharepoint.com/:v:/p/qiwu/IQDCsjzpyrJLRIk_8NgQBwBbAQWujYxV7anIRIQ-FNiD_io)

**Recommendation**: Review demo video before testing to understand expected behavior and UI flow.

### UX Review Findings

A UX review was completed on 2026-02-10 identifying several UI issues:
[UX Review Document](https://microstrategy.atlassian.net/wiki/spaces/TECCTC/pages/5849907462/)

**Recommendation**: 
1. Obtain access to UX review document
2. Incorporate UX issues into test cases
3. Verify all UX issues resolved before release

### Test Data Requirements

**Required Test Objects**:
- ✅ Facts: Revenue, Cost, Quantity (minimum)
- ✅ Attributes: Region, Category, Year, Quarter, Month, City (minimum)
- ✅ Existing Metrics: (for reference/comparison)
- ✅ Base Formulas: (for integration testing)
- ✅ Filters: Q1 Filter, Region Filter (for conditional metrics)
- ✅ Transformations: Last Year, Last Quarter, Month Ago (for transformation metrics)

**Test Environments**:
- Development: For initial testing
- UAT: For integration and E2E testing
- Production: For smoke testing post-deployment

### Testing Tools

**Recommended**:
- Browser DevTools (for performance monitoring)
- Accessibility Checker (axe DevTools, WAVE)
- Screen Reader (NVDA for Windows, VoiceOver for Mac)
- BrowserStack / Sauce Labs (for cross-browser testing)
- JMeter / K6 (for performance/load testing if needed)

### Automation Considerations

**High-Priority Automation**:
1. Create simple metric (Scenario 1)
2. Edit existing metric (Scenario 7)
3. Formula validation success/error (Scenarios 1, 9)
4. Auto-complete basic test (Scenario 8)
5. Use metric on report (Scenario 13)

**Medium-Priority Automation**:
- Level/Condition/Transformation scenarios (Scenarios 3-5)
- Nested metric creation (Scenario 6)
- Browser compatibility smoke tests (Scenario 10)

**Low-Priority Automation** (manual recommended):
- Accessibility testing (Scenario 11)
- Performance testing (Scenario 12)
- UX/visual regression testing

### Definition of Done

**Feature is considered fully tested when**:
- ✅ All 🔴 Critical test scenarios pass
- ✅ All 🟠 High-priority test scenarios pass
- ✅ All identified UX review issues resolved and verified
- ✅ Browser compatibility confirmed (Chrome, Firefox, Safari, Edge)
- ✅ Accessibility audit passed (WCAG 2.1 AA)
- ✅ Performance benchmarks met (editor load < 2s, validation < 1s)
- ✅ Integration verified (metrics work on reports/dashboards)
- ✅ Automation coverage for critical paths implemented
- ✅ No P1/P2 bugs open

### Timeline Estimate

**Assuming 2 QA engineers**:
- Context gathering & test plan review: 1 day
- Functional testing (Scenarios 1-15): 3-4 days
- Browser compatibility: 1 day
- Accessibility testing: 1 day
- Integration testing: 1 day
- Performance testing: 0.5 day
- Bug fixing and retesting: 2-3 days
- **Total: ~10-12 days**

**Risks to Timeline**:
- UX review issues require significant rework
- Base formula integration issues
- Browser-specific bugs difficult to reproduce/fix
- Accessibility gaps require UI redesign

---

**Plan prepared by**: QA Planner Agent (Atlas)  
**Review required by**: QA Lead, WebStation Team Lead  
**Next steps**: Review plan → Approval → Test execution → Bug triage → Sign-off
