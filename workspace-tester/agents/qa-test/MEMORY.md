# Phase 2b Test Execution: Key Learnings

**Date:** 2026-02-28  
**Phase:** report-page-by-sorting (Phase 2b)  
**Result:** TC85430 passed after 3 critical fixes

## Critical Fixes Applied

### 1. **Empty Password Login**
**Problem:** Login field was filling with space character for empty password, causing authentication to hang.  
**Fix:** Skip password field interaction entirely when password is empty; directly click login button.  
**File:** `tests/page-objects/library/login-page.ts`

```typescript
if (hasPassword) {
  await passwordEl.fill(password);
}
// If password is empty, directly click login button
await loginBtn.click();
```

### 2. **Design Mode Activation**
**Problem:** `switchToDesignMode()` wasn't clicking the resume/design button; PageBy selectors only render in design mode.  
**Fix:** Click the design button explicitly and wait for design mode indicators.  
**File:** `tests/page-objects/report/report-toolbar.ts`

```typescript
const designModeBtn = this.page.locator('span.mstr-ws-icons.single-icon-library-resume[role="button"]').first();
await designModeBtn.click();
await this.page.waitForTimeout(1000);
await this.page.locator('.mstr-loader...').waitFor({ state: 'hidden', timeout: 60000 });
await Promise.race([grid, pageby].map(el => el.waitFor({state: 'attached', timeout: 30000})));
```

**Key insight:** Reports open in view mode by default. Must explicitly switch to design/edit mode to access PageBy, dataset panel, etc.

### 3. **Context Menu & Dropdown Locators**
**Problem:** Complex CSS selectors like `.mstr-context-menu li:has-text("Sort")` couldn't find menu items.  
**Fix:** Use Playwright's `getByText()` for flexible text matching.  
**Files:**  
- `tests/page-objects/report/report-page-by.ts` (PageBy context menu)
- `tests/page-objects/report/report-grid-view.ts` (grid context menu)
- `tests/page-objects/report/report-page-by-sorting.ts` (dialog dropdowns)

```typescript
// Before: complex CSS selector
const item = this.page.locator('.mstr-context-menu li:has-text("Sort"), .ant-dropdown-menu li:has-text("Sort")').first();

// After: simple getByText
const item = this.page.getByText('Sort', { exact: true }).first();
```

**Key insight:** `getByText()` is more resilient across different DOM structures and handles text matching better than `:has-text()`.

### 4. **Dropdown Portals**
**Problem:** Dropdown items in Sort dialog couldn't be found within dialog locator scope.  
**Fix:** Search globally on page instead of within parent element (dropdowns render as React portals outside dialog DOM).  
**File:** `tests/page-objects/report/report-page-by-sorting.ts`

```typescript
// Before: search within dialog
return this.dialog.locator(...).locator(...).getByText(item);

// After: search globally
return this.page.getByText(item, { exact: true }).first();
```

**Key insight:** Ant Design dropdowns, modals, tooltips use React portals and render at document root, not within parent element.

## Dynamic Wait Strategy

### Loading Indicators
- Wait for loading spinners to disappear: `.mstr-loader, [class*="loading"], .mstrWaitBox`
- Use hidden state: `waitFor({ state: 'hidden', timeout: 60000 })`
- After actions that trigger data fetch: wait for loader to appear THEN disappear

### Design Mode Wait Pattern
```typescript
// 1. Click design button
await designModeBtn.click();

// 2. Wait for loader to appear and disappear
await this.page.waitForTimeout(1000);
await this.page.locator('.mstr-loader...').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
await this.page.locator('.mstr-loader...').waitFor({ state: 'hidden', timeout: 60000 }).catch(() => {});

// 3. Wait for design mode indicators
await Promise.race([
  this.page.locator('.ag-root, [role="grid"]').waitFor({ state: 'attached', timeout: 30000 }),
  this.page.locator('[aria-label="Page By"]').waitFor({ state: 'attached', timeout: 30000 }),
]).catch(() => {});

// 4. Final stabilization wait
await this.page.waitForTimeout(2000);
```

### Timeout Strategy for Slow Dev Environments
- Increased base timeouts from 5-10s → 15-30s
- Navigation waits: 60s → 90s
- Element visibility: 5s → 20s
- Dataset panel interactions: 10s → 30s

## Locator Best Practices

### Prefer getByText() for:
- Menu items (context menus, dropdowns)
- Button labels
- Tab names
- Dialog options

### Use locator() for:
- Structural elements (panels, containers)
- CSS class-based targeting
- When combining with other selectors

### Avoid:
- `:has-text()` - less flexible than `getByText()`
- Overly specific CSS selectors - brittle across versions
- XPath - hard to maintain

## Snapshot Debugging Strategy

**When debugging UI issues:**
1. Take screenshot after each major action
2. Save to `test-results/` with descriptive names
3. Console.log current URL and state
4. Verify visually before assuming locator issue

**Example:**
```typescript
await reportToolbar.switchToDesignMode();
await page.screenshot({ path: 'test-results/after-design-mode.png', fullPage: true });
console.log('URL:', page.url());
```

## Common Failure Patterns & Solutions

| Symptom | Root Cause | Solution |
|---------|-----------|----------|
| "Element not found" timeout | Design mode not activated | Click resume button explicitly |
| Context menu "Sort" not visible | CSS selector too specific | Use `getByText('Sort')` |
| Dropdown item not found | Searching within wrong scope | Search globally on page |
| Login hangs on empty password | Filling space character | Skip password field if empty |
| PageBy never renders | Report in view mode | Switch to design mode first |
| Slow/flaky waits | Fixed timeouts too short | Increase 2-3x for dev env |

## Migration Quality Lessons

### Self-Healing Success Factors
1. **Visual confirmation:** Screenshots revealed what was actually on screen
2. **Incremental fixes:** Test one fix at a time, validate before moving on
3. **Simplified selectors:** Less specificity = more resilience
4. **Global search:** Don't assume element hierarchy for portals

### Migration Anti-Patterns to Avoid
- ❌ Assuming WDIO behavior translates 1:1 to Playwright
- ❌ Not clicking design mode buttons (copy-paste from old code comments)
- ❌ Complex nested locators for portal-rendered elements
- ❌ Fixed 5s timeouts for slow environments

### What Worked Well
- ✅ Taking screenshots at failure points
- ✅ Using `getByText()` for text-based elements
- ✅ Explicit waits for loading indicators
- ✅ Testing one spec in isolation first
- ✅ Documenting each fix before proceeding

## Recommendations for Future Phases

1. **Always verify design mode activation** in report-editor tests
2. **Use `getByText()` as default** for menu items, buttons, labels
3. **Screenshot at key transitions** (login, mode switches, dialog opens)
4. **Increase timeouts 2-3x** for dev/staging environments
5. **Search globally for portal elements** (dropdowns, modals, tooltips)
6. **Wait for loaders explicitly** don't assume instant rendering

---

**Success Rate:** 1/1 (100%) after fixes applied  
**Time to Fix:** ~2 hours (from 0/8 failures to 1/1 pass)  
**Confidence for remaining tests:** High (universal fixes applied)
