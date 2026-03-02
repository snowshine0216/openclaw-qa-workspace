# Comprehensive QA Plan: BCIN-TEST

## 📊 Summary

A compact summary block.

## 🧪 Test Key Points

### 1. Recovery Flow

| # | Priority | Related Code Change | Acceptance Criteria | Test Key Points | Expected Results |
|---|---|---|---|---|---|
| 1.1 | P0 | `shared.ts` | Given recoverable error | Trigger resume flow and confirm recovery dialog | Pause mode restored |
| 1.2 | P1 | `ui.tsx` | Given repeat retry | Trigger second resume flow and verify no stuck spinner | Retry completes |

### 2. Prompt Flow

| # | Priority | Related Code Change | Acceptance Criteria | Test Key Points | Expected Results |
|---|---|---|---|---|---|
| 2.1 | P0 | `prompt.js` | Given prompt error | Trigger prompt max rows and click cancel | Return to prompt dialog |

## ⚠️ Risk & Mitigation

Unrelated content after the target section.
