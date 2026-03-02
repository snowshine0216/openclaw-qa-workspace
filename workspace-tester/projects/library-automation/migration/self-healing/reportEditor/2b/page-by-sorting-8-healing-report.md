# page-by-sorting-8.spec.ts — Healing Report

**Date:** 2026-03-01
**Status:** ❌ Failed after 3 fix rounds
**Failure step:** Step 3 — add `Employee` to Page By from object browser (`page-by-sorting-8.spec.ts:48`)

---

## Failure Summary

The spec fails before opening the Sort dialog because it cannot resolve the expected object-browser path for `Employee` under `Geography` (or configured fallback names). Even direct add fallback could not locate `Employee` in the current object browser/report objects state.

**Root cause:** Environment/object-browser structure mismatch for dossier `ReportWS_PB_YearCategory2`; required hierarchy/object labels are absent or exposed differently than expected by test data.

---

## URLs to Verify Manually

- `{reportTestUrl}/app/B628A31F11E7BD953EAE0080EF0583BD/DD28BFCC4B4A15978F74CEB3C75E8447/edit`

---

## Fixes Attempted (Round 1–3)

1. **Round 1:** Baseline run failed on `Geography folder not found` in Step 3.
2. **Round 2:** Updated dataset panel fallback scan to reset scroll to top for each candidate name (`Geography`, `01. Geography`, `Locations`); failure persisted.
3. **Round 3:** Added spec-local direct-object fallback (`tryAddObjectToPageBy(['Employee'])`) when Geography folder is missing; still unable to locate object.

---

## Recommendations

1. Manually inspect object browser hierarchy in this environment for dossier `ReportWS_PB_YearCategory2` and document actual folder/object labels.
2. Update test data/spec with environment-accurate path (or approved alternate dossier) for attribute-form validation.
3. Add a precondition check step to fail fast with discovered object-browser labels for easier triage when hierarchy changes.
