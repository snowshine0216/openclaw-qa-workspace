# Report Editor Lock Headers in Workstation

**Seed:** `tests/seed.spec.ts`

Migrated from WDIO: `ReportEditor_lockHeaders.spec.js`

## Scenarios

### TC85742 - Lock columns and rows headers
1. Edit lock_headers_TC85742 report
2. Switch to design mode
3. Format Panel > Lock headers: check Column headers
4. Scroll grid to bottom
5. Verify grid cell (1,1) visible
6. Check Row headers
7. Scroll horizontally and vertically
8. Verify grid cell (35,0) visible
