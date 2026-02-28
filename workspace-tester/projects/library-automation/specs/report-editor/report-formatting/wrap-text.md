# Wrap Text And Metrics Prompt Formatting

**Seed:** `tests/seed.spec.ts`

Migrated from WDIO: `ReportEditor_wrapText.spec.js`

## Scenarios

### TC86195 - Wrap Text in report editor
1. Edit TC86195_wrap_text report
2. Switch to design mode, Format Panel, Spacing > Fit to Container
3. Text format tab: select Rows/Headers, enable Wrap text
4. Rename Category to long name
5. Verify grid cell text and white-space: normal
6. Disable Wrap text, verify white-space: nowrap
7. Enable Wrap text, rename Subcategory to long name
8. Select All Metrics/Headers, enable Wrap text
9. Verify metric header white-space: normal/nowrap

### TC86195_1 - Apply format for Metric prompts
1. Edit reportWithMetricPrompt
2. Select Metrics prompt Values, update font, bold, size, align
3. Select Headers, set color
4. Switch to design, apply prompt
5. Verify grid cell styles (color, text-align, font-family, font-size, font-weight)
