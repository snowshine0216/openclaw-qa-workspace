# Report Editor Thresholds TC86548

**Seed:** `tests/seed.spec.ts`

## TC86548 — Show/hide thresholds

- Create new report by URL
- Add Country, Region to rows; Cost, Profit to columns (via dataset panel)
- Switch to design mode
- Open threshold for Cost, enable Allow Users (simple), save and close
- Assert grid cells (1,1), (2,2) background-color
- Open threshold for Country, new condition (Region=Web), Light Green 50% opacity, save
- Assert grid cell (8,0) background-color
- Clear thresholds for Country (rows), Cost (metrics)
- Assert grid cells (8,0), (2,2), (3,2), (4,2) background-color rgba(255,255,255,1)
