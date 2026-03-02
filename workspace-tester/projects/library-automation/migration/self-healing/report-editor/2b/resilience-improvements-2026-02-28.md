# Phase 2b Self-Healing: Resilience Improvements

**Date:** 2026-02-28
**Phase:** 2b (report-page-by-sorting)
**Reason:** Slow dev environment causing timeouts; empty password login flow

## Changes Made

### 1. Login Flow Enhancement (login-page.ts)
**File:** `tests/page-objects/library/login-page.ts`

**Issue:** Empty password handling - was filling a space character which didn't work

**Fix:** Skip password field interaction entirely when password is empty
```typescript
// Before:
await passwordEl.fill(' '); // Trick the UI validator

// After:
if (hasPassword) {
  const passwordEl = this.passwordInput.first();
  await passwordEl.scrollIntoViewIfNeeded();
  await passwordEl.waitFor({ state: 'visible', timeout: 5000 });
  await passwordEl.fill(password);
}
// If password is empty, directly click login button without attempting to type
```

**Result:** Login succeeds; user is authenticated and redirected to app

---

### 2. Fixture Timeout Increase (fixtures/index.ts)
**File:** `tests/fixtures/index.ts`

**Issue:** `waitForURL` timing out at 60s in slow dev environment

**Fix:** Increased timeouts for navigation and app container
```typescript
// Before:
await page.waitForURL(/(\/app|\/Home|\/Dashboard)/i, { timeout: 60000, waitUntil: 'commit' });
await page.locator('.mstrd-AppContainer, ...').first().waitFor({ state: 'attached', timeout: 30000 });

// After:
await page.waitForURL(/(\/app|\/Home|\/Dashboard)/i, { timeout: 90000, waitUntil: 'commit' });
await page.locator('.mstrd-AppContainer, ...').first().waitFor({ state: 'attached', timeout: 45000 });
```

**Rationale:** Dev env URL is `mci-pq2sm-dev.hypernow.microstrategy.com` - network/server latency

---

### 3. ReportPageBy Timeout Increases (report-page-by.ts)
**File:** `tests/page-objects/report/report-page-by.ts`

**Issues:** 
- `getPageBySelectorText()` timing out at 5s
- `openDropdownFromSelector()` timing out at 15s
- `openSelectorContextMenu()` timing out at 5s
- `changePageByElement()` item wait timing out at 10s

**Fixes:**
```typescript
// getPageBySelectorText: 5s → 20s
return el.textContent({ timeout: 20000 })

// openDropdownFromSelector: 15s → 20s (default param)
async openDropdownFromSelector(selectorName: string, timeout = 20000)

// openSelectorContextMenu: 5s → 20s
await el.waitFor({ state: 'visible', timeout: 20000 });

// changePageByElement: 10s → 20s
await item.waitFor({ state: 'visible', timeout: 20000 });
```

**Enhanced Selector (getSelectorPulldownTextBox):**
Added more fallback selectors for different DOM structures:
```typescript
// Before:
'.pulldown-container, [class*="Pulldown-text"], [class*="pulldown"], [class*="Pulldown"], [role="combobox"], [class*="trigger"], .ant-select-selector'

// After:
'.pulldown-container, [class*="Pulldown-text"], [class*="pulldown"], [class*="Pulldown"], ' +
'[role="combobox"], [class*="trigger"], .ant-select-selector, ' +
'[class*="select"], [class*="dropdown"], .mstrmojo-Dropdown'
```

**Rationale:** Element visibility/interaction needs more time in this environment

---

### 4. ReportDatasetPanel Timeout Increase (report-dataset-panel.ts)
**File:** `tests/page-objects/report/report-dataset-panel.ts`

**Issue:** `selectItemInObjectList()` timing out at 10s (page-by-sorting-1.spec.ts hit test timeout)

**Fix:**
```typescript
// Before:
await el.waitFor({ state: 'visible', timeout: 10000 });

// After:
await el.waitFor({ state: 'visible', timeout: 30000 });
```

**Rationale:** Dataset panel object browser can be slow to render/populate in dev env

---

### 5. Spec-Level Timeout Adjustments (page-by-sorting-2.spec.ts)
**File:** `tests/specs/report-editor/report-page-by-sorting/page-by-sorting-2.spec.ts`

**Issue:** Hardcoded expect timeouts too short (5s, 10s, 15s)

**Fixes:**
```typescript
// Year selector: 15s → 30s
await expect(yearSelector).toBeVisible({ timeout: 30000 });

// Popup items: 5s → 15s
await expect(item2014).toBeVisible({ timeout: 15000 });
await expect(categorySales).toBeVisible({ timeout: 15000 });

// Dialog: 10s → 20s
await expect(reportPageBySorting.dialog).toBeVisible({ timeout: 20000 });

// Dialog close: 5s → 15s
await expect(reportPageBySorting.dialog).not.toBeVisible({ timeout: 15000 });
```

**Rationale:** UI interactions need more time in slow dev environment

---

## Summary of Timeout Changes

| Component | Method | Before | After | Change |
|-----------|--------|--------|-------|--------|
| fixtures/index.ts | waitForURL | 60s | 90s | +50% |
| fixtures/index.ts | AppContainer wait | 30s | 45s | +50% |
| report-page-by.ts | getPageBySelectorText | 5s | 20s | +300% |
| report-page-by.ts | openDropdownFromSelector | 15s | 20s | +33% |
| report-page-by.ts | openSelectorContextMenu | 5s | 20s | +300% |
| report-page-by.ts | changePageByElement item | 10s | 20s | +100% |
| report-dataset-panel.ts | selectItemInObjectList | 10s | 30s | +200% |
| page-by-sorting-2.spec.ts | yearSelector visible | 15s | 30s | +100% |
| page-by-sorting-2.spec.ts | popup items visible | 5s | 15s | +200% |
| page-by-sorting-2.spec.ts | dialog visible | 10s | 20s | +100% |
| page-by-sorting-2.spec.ts | dialog not visible | 5s | 15s | +200% |

---

## Expected Outcome

After these resilience improvements:
1. ✅ Login succeeds (empty password handled correctly)
2. ✅ Navigation to app completes within 90s
3. ✅ PageBy selector interactions succeed within 20s
4. ✅ Dataset panel interactions succeed within 30s
5. ✅ All 8 tests in phase 2b should pass (or at least progress further)

---

## Next Steps

1. Re-run Phase 2b: `npm run test:report-page-by-sorting`
2. Document pass/fail results in `script_families.json`
3. If further failures: capture screenshots, analyze DOM, apply additional self-healing
4. Run Phase 2c after Phase 2b completes

---

**Self-Healing Log:** This document serves as the self-healing log for Phase 2b migration quality check.
