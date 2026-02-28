# Page By - Part 3: Show Totals (TC81156_6)

**Seed:** `tests/seed.spec.ts`

## Scenario: FUN | Page by with show totals

- Open report by URL (PageByMultiplePBShowTotal dossier)
- Select Total for Category page-by selector
- Verify 2nd page-by selector (Subcategory) shows "Art & Architecture"
- Select Business for Subcategory
- Verify grid cells: (1,0) "Working With Emotional Intelligence", (1,1) "$20,819", (2,1) "$5,914"
