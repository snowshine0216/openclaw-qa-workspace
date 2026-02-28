# Report Editor Thresholds TC85267

**Seed:** `tests/seed.spec.ts`

## TC85267_1 — Report editor thresholds Case 1

- Edit ReportThreshold1 by URL
- Switch to design mode
- Assert: grid cell (5,1) has image containing `globe-showing-americas-on-white-keyboard-picture-id163942994`

## TC85267_2 — Report editor thresholds Case 2

- Edit ReportThreshold2 by URL
- Switch to design mode
- Assert grid cell styles (1,1), (1,4), (3,0), (4,4), (5,4) — text, background-color, color, font-style, font-weight, border-color, border-style
- Switch to Editor panel
- Hide/show thresholds for Revenue
- Clear thresholds for Revenue in metrics dropzone
- Assert cells (3,1), (2,4), (4,0) after clear
- Open threshold editor for Revenue
- Switch to Image-based, select Rounded Push Pin, Based on Revenue, Lowest
- Save and close simple threshold editor
- Assert cells (1,1), (2,1), (3,4), (4,0) after image-based threshold
- Remove Category from rows, add Category to rows
- Click Visualization 1, remove Trend from grid, add Trend to columns
- Open threshold for 2nd metric, switch adv→sim with clear, sim→adv with apply, save advanced editor
- Add Subcategory to rows, move Category to page by
- Open threshold for Subcategory, new condition (Category=Movies), Formatting Violet, save
- Assert visualizations (takeScreenshotByElement replaced with assertions)
