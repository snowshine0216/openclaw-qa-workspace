# Report Editor Advanced Padding Formatting

**Seed:** `tests/seed.spec.ts`

Migrated from WDIO: `ReportEditor_advancedPadding.spec.js`

## Scenarios

### TC83061 - Functional [Workstation][Report Editor] Cell padding
1. Create report: Region, Category; Cost, Profit, Profit Margin
2. Format Panel > Spacing
3. Select padding small: verify Top 2.3, Right 4.5, Bottom 2.3, Left 4.5
4. Select medium: verify 5.2, 10.5, 5.2, 10.5
5. Select large: verify 6, 12, 6, 12
6. Set manual: Top 5, Right 7, Bottom 2.5, Left 19
7. Verify grid padding styles
8. Left arrow down 1 → 18
9. Left arrow up 2 → 20
10. Left arrow up again (max 20) → still 20
