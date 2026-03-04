# Site Knowledge: Telemetry Domain

## Overview

- **Domain key:** `telemetry`
- **Components covered:** Telemetry
- **Spec files scanned:** 5
- **POM files scanned:** 1

## Components

### Telemetry
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `closeTabByScript(index)`
  - `deleteSession()`
  - `getEnabledProjects()`
  - `getExecutionBuffer()`
  - `getExecutionRecord()`
  - `getManipulationBuffer()`
  - `getManipulationRecord()`
  - `getRecordsBuffer()`
  - `getTelemetry()`
  - `isEnabled()`
  - `isEnabledAssersion()`
  - `isSupported()`
- **Related components:** _none_

## Common Workflows (from spec.ts)

1. [TC84922] Test edit execution from info window (used in 1 specs)
2. [TC84923_01] Client Action Type ID for different Filter Selector (used in 1 specs)
3. [TC84923_02] Test Client Action Type ID for different Grid Manipulation (used in 1 specs)
4. [TC84923_03] Test Client Action Type for manipulation in filter panel (used in 1 specs)
5. [TC84924_01] Test data recorded after clicking on Library Home button (used in 1 specs)
6. [TC84924_02] Test data recorded after pressing back button (used in 1 specs)
7. [TC84924_03] Test data recorded after open dossier from URL (used in 1 specs)
8. [TC84924_04] Test data recorded after close tab (used in 1 specs)
9. [TC84924_05] Test data recorded after refresh page (used in 1 specs)
10. [TC84924_06] Test data recorded after hitting enter in address bar (used in 1 specs)
11. [TC84924_07] Test data recorded after session timeout and login (used in 1 specs)
12. [TC84925_01] Test successful dossier execution (used in 1 specs)
13. [TC84925_02] Test failed dossier execution (used in 1 specs)
14. [TC84925_03] Test aborted dossier execution (used in 1 specs)
15. [TC84926_01] Test prompted case (used in 1 specs)
16. [TC84926_02] Test cached case (used in 1 specs)
17. [TC84926_03] Test custom app (used in 1 specs)
18. [TC84927_01] Test multiple execution (used in 1 specs)
19. [TC84927_02] Test short/long time execution (used in 1 specs)
20. [TC87880_01] Test undo/redo selector manipulation (used in 1 specs)
21. [TC87880_02] Test undo/redo panel selector manipulation (used in 1 specs)
22. [TC87880_03] Test undo/redo sort manipulation (used in 1 specs)
23. [TC87880_04] Test undo/redo keep only/exclude manipulation (used in 1 specs)
24. [TC87880_05] Test undo/redo show totals manipulation (used in 1 specs)
25. [TC87880_06] Test undo/redo drill manipulation (used in 1 specs)
26. [TC87880_07] Test undo/redo switch page manipulation (used in 1 specs)
27. [TC87880_08] Test undo/redo apply filter manipulation (used in 1 specs)
28. [TC87880_09] Test 3 undos in a row, 3 redos in a row (used in 1 specs)
29. [TC87880_10] Test alternate between undo/redo (used in 1 specs)
30. [TC87881_01] Timeout after no activity in browser (used in 1 specs)
31. [TC87881_02] Timeout after switch to another tab (used in 1 specs)
32. [TC87881_03] Idle time not long enough to trigger resume viewing (used in 1 specs)
33. [TC89157_01] Link to dossier (used in 1 specs)
34. [TC89157_02] Link to two dossiers (used in 1 specs)
35. [TC89157_03] Link to dossier and go back (used in 1 specs)
36. [TC89157_04] Link to two dossiers and go back (used in 1 specs)
37. [TC95259] Test no telemetry data for Bot (used in 1 specs)
38. Test Client Action Type ID Manipulation (used in 1 specs)
39. Test executions record (used in 1 specs)
40. Test resume viewing manipulation | linking | Bot (used in 1 specs)
41. Test telemetry data recorded for different scenarios (used in 1 specs)
42. Test undo/redo manipulations (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. getManipulationRecord -- frequency: 61
2. getExecutionRecord -- frequency: 30
3. getCustomAppBody -- frequency: 1

## Key Actions

- `getManipulationRecord()` -- used in 61 specs
- `openDossier()` -- used in 35 specs
- `getExecutionRecord()` -- used in 30 specs
- `goToLibrary()` -- used in 30 specs
- `selectGridContextMenuOption()` -- used in 18 specs
- `resetIfEnabled()` -- used in 17 specs
- `clickRedo()` -- used in 15 specs
- `clickUndo()` -- used in 15 specs
- `waitForDossierLoading()` -- used in 15 specs
- `selectItem()` -- used in 13 specs
- `openMenu()` -- used in 12 specs
- `queryTelemetry()` -- used in 10 specs
- `goToPage()` -- used in 9 specs
- `apply()` -- used in 6 specs
- `log()` -- used in 6 specs
- `login()` -- used in 6 specs
- `navigateLink()` -- used in 6 specs
- `openFilterPanel()` -- used in 6 specs
- `toBeTruthy()` -- used in 6 specs
- `closeTabByScript(index)` -- used in 5 specs
- `sleep()` -- used in 5 specs
- `switchToNewWindowWithUrl()` -- used in 5 specs
- `waitForLibraryLoading()` -- used in 5 specs
- `openSecondaryPanel()` -- used in 4 specs
- `selectElementByName()` -- used in 4 specs
- `back()` -- used in 3 specs
- `closeMenu()` -- used in 3 specs
- `formUrl()` -- used in 3 specs
- `toBeNull()` -- used in 3 specs
- `clickEditButton()` -- used in 2 specs
- `openDefaultApp()` -- used in 2 specs
- `openDossierInfoWindow()` -- used in 2 specs
- `openDossierNoWait()` -- used in 2 specs
- `previousPage()` -- used in 2 specs
- `refresh()` -- used in 2 specs
- `selectShowTotalsOption()` -- used in 2 specs
- `switchToTab()` -- used in 2 specs
- `applyShowTotalsSelection()` -- used in 1 specs
- `clearFilter()` -- used in 1 specs
- `clickCloseDossierButton()` -- used in 1 specs
- `clickCreateWithNewDataButton()` -- used in 1 specs
- `clickDataImportDialogCreateButton()` -- used in 1 specs
- `clickDataImportDialogImportButton()` -- used in 1 specs
- `clickDataImportDialogSampleFiles()` -- used in 1 specs
- `clickHomeIcon()` -- used in 1 specs
- `clickNewDossierIcon()` -- used in 1 specs
- `deleteSession()` -- used in 1 specs
- `dismissError()` -- used in 1 specs
- `executeScript()` -- used in 1 specs
- `getCustomAppBody()` -- used in 1 specs
- `moveDossierIntoViewPort()` -- used in 1 specs
- `open()` -- used in 1 specs
- `openBot()` -- used in 1 specs
- `openContextMenu()` -- used in 1 specs
- `openCreateNewBotDialog()` -- used in 1 specs
- `openCustomAppById()` -- used in 1 specs
- `openDropdownMenu()` -- used in 1 specs
- `openUrl()` -- used in 1 specs
- `selectContextMenuOption()` -- used in 1 specs
- `selectDropdownItems()` -- used in 1 specs
- `selectSampleFileByIndex()` -- used in 1 specs
- `switchUser()` -- used in 1 specs
- `toBeDefined()` -- used in 1 specs
- `updateUpperInput()` -- used in 1 specs
- `url()` -- used in 1 specs
- `waitForEditor()` -- used in 1 specs
- `getEnabledProjects()` -- used in 0 specs
- `getExecutionBuffer()` -- used in 0 specs
- `getManipulationBuffer()` -- used in 0 specs
- `getRecordsBuffer()` -- used in 0 specs
- `getTelemetry()` -- used in 0 specs
- `isEnabled()` -- used in 0 specs
- `isEnabledAssersion()` -- used in 0 specs
- `isSupported()` -- used in 0 specs

## Source Coverage

- `pageObjects/telemetry/**/*.js`
- `specs/regression/telemetry/**/*.{ts,js}`
