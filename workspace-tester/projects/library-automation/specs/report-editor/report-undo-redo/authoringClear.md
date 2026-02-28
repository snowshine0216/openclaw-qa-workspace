# Report Undo/Redo — Authoring Clear

**Seed:** `tests/seed.spec.ts`

## Application Overview

Report Editor Undo/Redo functionality covering join type changes, prompt application, attribute form updates, and reprompt flows.

## Test Scenarios

### 1. TC97485_20 — Undo/Redo for join and prompt

**Steps:**
1. Edit report by URL (dossier TC85614JoinOnMetric)
2. Open object context menu for Freight → Join Type | Inner Join
3. Switch to design mode, click Apply in prompt editor
4. Change number format for Freight to Fixed in metrics drop zone
5. Open object context menu for Freight → Join Type | Outer Join
6. Wait for undo/redo UI update
7. Verify undo/redo buttons are disabled

**Expected Results:**
- After updating join type for Freight, undo/redo buttons are disabled

### 2. TC97485_20 — Attribute form undo/redo

**Steps:**
8. Update attribute forms for Customer in Page By drop zone: "Show attribute name once"
9. Click Undo
10. Verify attribute form for Customer reverts to default
11. Click Redo
12. Verify attribute form for Customer shows "Show attribute name once"

### 3. TC97485_20 — Reprompt and undo/redo

**Steps:**
13. Click Re-prompt, apply in prompt editor
14. Wait for undo/redo UI update
15. Verify undo/redo buttons are disabled
16. Remove Page By "Customer Last Name"
17. Click Undo
18. Verify Page By restored
19. Click Redo
20. Verify Page By removed
