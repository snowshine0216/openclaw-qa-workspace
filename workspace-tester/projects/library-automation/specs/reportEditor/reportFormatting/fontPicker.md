# Replace Mono Type Font in Report Editor

**Seed:** `tests/seed.spec.ts`

Migrated from WDIO: `ReportEditor_fontPicker.spec.js`

## Scenarios

### TC99483_01 - Missing font dialog when entering authoring (feature flag off)
- mockFeatureFlagOfSuppressMissingFontDialog(false)
- Edit ReportWithMonoTypeFont
- Verify missing font popup shown
- Dismiss popup

### TC99483_02 - Missing font dialog not shown when feature flag on
- mockFeatureFlagOfSuppressMissingFontDialog(true)
- Edit ReportWithMonoTypeFont
- Verify popup not shown

### TC99483_03 - Missing font warning in format panel font picker
- Feature flag off, dismiss popup
- Format Panel > Subcategory/All
- Verify selected font Monotype Corsiva
- Click warning icon, verify tooltip
- Verify grid cell font fallback

### TC99483_04 - Missing font warning in threshold editor
- Edit threshold for Cost
- Verify Lucida Sans Unicode, click warning, verify tooltip
- Verify cell font

### TC99483_05 - Change to OOTB font in format panel
- Select Inter font for Subcategory
- Verify cell font

### TC99483_06 - Change to custom font in threshold editor
- Edit Cost threshold, select Big Shoulders
- Verify Art & Architecture (Lucida), Business (Big Shoulders)

### TC99483_07 - Fallback monotype font in consumption mode
- Open report in consumption
- Verify grid with fallback font

**Note:** Tests requiring mockFeatureFlagOfSuppressMissingFontDialog: use test.skip with note "requires mock" or implement localStorage stub.
