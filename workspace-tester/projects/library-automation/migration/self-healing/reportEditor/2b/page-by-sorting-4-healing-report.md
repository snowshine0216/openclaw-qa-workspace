# page-by-sorting-4.spec.ts — Healing Report

**Date:** 2026-03-01
**Status:** ✅ Fixed (re-investigation with actual DOM)
**Failure step:** Step 4 — `changePageByElement('Year', '2015')` at page-by-sorting-4.spec.ts:35

---

## Summary

Test now passes after ensuring the dropdown popup is open before interacting with items. The Year dropdown uses MicroStrategy `.mstrmojo-PopupList` with `div.item` elements (2014, 2015, 2016, Total, Median). The failure was due to **timing** — the test tried to find items before the popup was visible.

**Root cause:** Timing — The test did not wait for the dropdown popup (`.mstrmojo-PopupList`) to be visible before calling `getElementFromPopupList`. The 500ms post-click wait was insufficient; the popup needed an explicit visibility wait.

---

## URLs to Verify Manually

- **DeveloperPBMetrics:** `{reportTestUrl}/app/B628A31F11E7BD953EAE0080EF0583BD/288708A946718529881298AFC09808DC/edit`
- Example: `https://mci-pq2sm-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/288708A946718529881298AFC09808DC/edit`

---

## Fixes Applied

### 1. report-page-by.ts — `changePageByElement`
- **Wait for dropdown to be open:** Added explicit wait for `.mstrmojo-PopupList:visible` (or `[style*="display: block"]`) before interacting with items. Ensures the popup is rendered before `getElementFromPopupList` runs.
- **Post-click wait:** Increased from 500ms to 800ms in `openDropdownFromSelector` to allow the popup to render.

### 2. report-page-by.ts — `getElementFromPopupList`
- **MicroStrategy containers:** Added `.mstrmojo-PopupList:visible` as primary container.
- **MicroStrategy items:** Added `div.item:has-text("...")` to match the actual DOM structure (`div.item` with `role="menuitem"`).
