# page-by-sorting-4.spec.ts — Healing Report

**Date:** 2026-03-01
**Status:** ❌ Failed after 3 fix rounds
**Failure step:** Step 4 — change Page By Year value (`page-by-sorting-4.spec.ts:46`)

---

## Failure Summary

The spec fails while trying to switch the `Year` Page By selector before opening the Sort dialog. The expected `2015` entry is not available in the active dropdown, and fallback attempts (`2014`, `2016`) also fail.

**Root cause:** Environment/data mismatch in Page By Year dropdown values for dossier `DeveloperPBMetrics` in the current test environment. The expected WDIO-era values are not discoverable with current DOM/options at runtime.

---

## URLs to Verify Manually

- `{reportTestUrl}/app/B628A31F11E7BD953EAE0080EF0583BD/288708A946718529881298AFC09808DC/edit`

---

## Fixes Attempted (Round 1–3)

1. **Round 1:** Baseline run identified timeout waiting for `2015` in Page By popup (`report-page-by.ts:105`).
2. **Round 2:** Hardened dropdown interaction in page object (`changePageByElement`) with popup re-open + retry and exact-text fallback lookup; failure persisted (`"2015" not found`).
3. **Round 3:** Added spec-local fallback values (`2015/2014/2016`) while preserving sequence; none were available in runtime dropdown.

---

## Recommendations

1. Manually verify current Year options for `DeveloperPBMetrics` and update the expected target value list to match live data.
2. If this dossier is no longer stable for Year switching, replace with a validated equivalent fixture dossier for TC85430 metrics sorting.
3. Capture a trace/screenshot at dropdown-open step in target env to lock a durable locator/value contract.
