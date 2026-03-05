# Critical Fix: switchToDesignMode() Not Clicking Resume Button

**Date:** 2026-02-28  
**Issue:** PageBy selectors never visible because Design Mode was never activated  
**Root Cause:** `switchToDesignMode()` was not clicking the resume/design mode button

## Problem

The original `switchToDesignMode()` implementation from WDIO migration **did not click the design mode button**. It only waited for loading to finish:

```typescript
// WRONG - doesn't actually switch to design mode
async switchToDesignMode(inAuthoring?: boolean): Promise<void> {
  await this.page.locator('.mstr-loader, ...').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  // In Library Playwright, the report already loads into the correct state.
  // Clicking the pause/resume button manually here causes the template to unload.
  await this.page.waitForTimeout(2000);
  ...
}
```

**Comment was misleading:** "report already loads into the correct state" - but PageBy only shows in **Design Mode**, not View Mode.

## Button Selector

The design mode button has this structure:
```html
<span class="mstr-ws-icons mstr-icons-single-icon single-icon-library-resume single-icon-library-resume--91453ad3" 
      role="button" 
      tabindex="0">
</span>
```

Key attributes:
- `class*="single-icon-library-resume"`
- `role="button"`
- `tabindex="0"`

## Solution

Fixed `switchToDesignMode()` to:
1. Locate the resume/design mode button with multiple fallback selectors
2. Check if button is visible (may already be in design mode)
3. Click the button if visible
4. Wait for design mode UI to load
5. Wait for loading indicators to disappear

```typescript
async switchToDesignMode(inAuthoring?: boolean): Promise<void> {
  await this.page.locator('.mstr-loader, ...').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  
  // Click the resume/design mode button
  const designModeBtn = this.page.locator(
    '[class*="single-icon-library-resume"][role="button"], ' +
    '.mstr-ws-icons[class*="resume"][role="button"], ' +
    '[class*="pause"][role="button"], ' +
    'span[class*="resume"][tabindex="0"]'
  ).first();
  
  const isVisible = await designModeBtn.isVisible({ timeout: 5000 }).catch(() => false);
  if (isVisible) {
    await designModeBtn.click();
    await this.page.waitForTimeout(2000);
    await this.page.locator('.mstr-loader, ...').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  } else {
    // Already in design mode
    await this.page.waitForTimeout(2000);
  }
  ...
}
```

## Expected Impact

After this fix:
- ✅ Design mode will be activated when `switchToDesignMode()` is called
- ✅ PageBy selectors will render and become visible
- ✅ All 8 Phase 2b tests should progress past the "selector not found" errors
- ✅ Tests can now interact with PageBy dropdowns, sorting dialogs, etc.

## Why This Wasn't Caught Earlier

1. WDIO implementation may have had different behavior
2. Migration comment suggested clicking was unnecessary
3. No visual verification during initial migration
4. Tests never ran until now to validate the behavior

---

**This fix is critical for all report-editor tests that require Design Mode!**
