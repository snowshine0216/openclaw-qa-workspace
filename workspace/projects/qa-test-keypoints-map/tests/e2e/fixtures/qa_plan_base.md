# Comprehensive QA Plan: BCIN-E2E

## 📊 Summary

E2E smoke test fixture.

## 🧪 Test Key Points

### 1. Recovery Flow

| # | Priority | Related Code Change | Acceptance Criteria | Test Key Points | Expected Results |
|---|---|---|---|---|---|
| 1.1 | P0 | `shared.ts` | Given recoverable error | Open report\nTrigger resume data retrieval\nConfirm dialog appears | Pause mode restored |

### 2. Prompt Flow

| # | Priority | Related Code Change | Acceptance Criteria | Test Key Points | Expected Results |
|---|---|---|---|---|---|
| 2.1 | P1 | `prompt.ts` | Given prompt error | Open prompted report\nSubmit prompt values | Prompt returns with preserved answers |

## ⚠️ Risk & Mitigation

Unrelated trailing content that must not be rewritten.
