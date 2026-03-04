# Site Knowledge: Embedding Domain

## Overview

- **Domain key:** `embedding`
- **Components covered:** IframeEmbeddingPage, NativeEmbeddingPage
- **Spec files scanned:** 12
- **POM files scanned:** 2

## Components

### IframeEmbeddingPage
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `createDocConsumptionPage()`
  - `createEnvironment()`
  - `getIFrame()`
  - `loadScripts()`
  - `navigateToPage()`
  - `switchToIFrame()`
  - `switchToParentFrame()`
- **Related components:** _none_

### NativeEmbeddingPage
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `applyFilter(dossierKey, filter)`
  - `applyFilters(dossierKey, filters)`
  - `createBookmark(dossierKey, bookmarkName)`
  - `createEnvironment(loginConfig)`
  - `createNewDashboardInstance({dossier, credentials, visKey})`
  - `enableMultipleInstance()`
  - `listBookmarks(projectId, objectId, visKey, dossierKey)`
  - `loadDashboard(projectId, dashboardId)`
  - `loadScripts()`
  - `renderVisualizations(dossierKey, visKeys)`
  - `renderVisualizationsWithInfowindow(dossierKey, visKeys)`
- **Related components:** _none_

## Common Workflows (from spec.ts)

1. [BCED-4714] Embed Document Consumption Page with Component Selection Event (used in 2 specs)
2. [BCIN-6494_1] Support multiple instance by create bookmark (used in 2 specs)
3. [BCIN-6494_2] Support multiple instance by create new instance (used in 2 specs)
4. [TC98941] Apply multiple type of filters via a single call of ApplyFilters API (used in 2 specs)
5. [TC99119] Embed Library Project Filter (used in 2 specs)
6. [TC99385_1] Support info window in native embedding - Grid (used in 2 specs)
7. [TC99385_2] Support info window in native embedding - AG Grid (used in 2 specs)
8. [TC99385_3] Support info window in native embedding - Linechart (used in 2 specs)
9. [TC99385_4] Support info window in native embedding - Image&Shape&Text (used in 2 specs)
10. [TC99385_5] Support info window in native embedding - embedding vizs cross pages (used in 2 specs)
11. [TC99385_6] Support info window in native embedding - embedding vizs cross chapters (used in 2 specs)
12. [TC99385_7] Support info window in native embedding - manipulation in info window (used in 2 specs)
13. [TC99387_1] Apply Attribute Selector (used in 2 specs)
14. [TC99387_2] Apply Metric Selector (used in 2 specs)
15. [TC99387_3] Apply both Attribute and Metric Selectors (used in 2 specs)
16. [TC99387_4] X-func with chapter filter (used in 2 specs)
17. Iframe Embedding SDK Test - Project Filter (used in 2 specs)
18. Iframe Embedding SDK Test - RSD widget selection (used in 2 specs)
19. Native Embedding SDK Test - Apply Filters (used in 2 specs)
20. Native Embedding SDK Test - Attribute Metric Selector (used in 2 specs)
21. Native Embedding SDK Test - InfoWindow (used in 2 specs)
22. Native Embedding SDK Test - Multiple instance (used in 2 specs)

## Common Elements (from POM + spec.ts)

1. getOneColumnData -- frequency: 22
2. getOneColumnDataWithColSpan -- frequency: 8
3. getResultItemByName -- frequency: 8
4. getFilterOptions -- frequency: 6
5. getChangeProject -- frequency: 2
6. getDatasetListLoadingSpinner -- frequency: 2
7. getLoadingIcon -- frequency: 2

## Key Actions

- `waitForDossierLoading()` -- used in 78 specs
- `createEnvironment(loginConfig)` -- used in 46 specs
- `loadScripts()` -- used in 46 specs
- `loadDashboard(projectId, dashboardId)` -- used in 42 specs
- `url()` -- used in 42 specs
- `log()` -- used in 32 specs
- `every()` -- used in 30 specs
- `renderVisualizations(dossierKey, visKeys)` -- used in 28 specs
- `waitForInfoWindowLoading()` -- used in 28 specs
- `cdp()` -- used in 24 specs
- `applyFilters(dossierKey, filters)` -- used in 22 specs
- `getOneColumnData()` -- used in 22 specs
- `applyFilter(dossierKey, filter)` -- used in 18 specs
- `selectGridElement()` -- used in 18 specs
- `renderVisualizationsWithInfowindow(dossierKey, visKeys)` -- used in 14 specs
- `enableMultipleInstance()` -- used in 12 specs
- `isDossierInLibrary()` -- used in 12 specs
- `getOneColumnDataWithColSpan()` -- used in 8 specs
- `getResultItemByName()` -- used in 8 specs
- `includes()` -- used in 8 specs
- `isDisplayed()` -- used in 8 specs
- `clickDossierPanelStackSwitchTab()` -- used in 6 specs
- `closeInfoWindow()` -- used in 6 specs
- `getFilterOptions()` -- used in 6 specs
- `stringify()` -- used in 6 specs
- `clickAllTab()` -- used in 4 specs
- `clickElement()` -- used in 4 specs
- `clickFilterIcon()` -- used in 4 specs
- `clickMyLibraryTab()` -- used in 4 specs
- `clickSubscriptionFilter()` -- used in 4 specs
- `closeFilterPanel()` -- used in 4 specs
- `goToLibrary()` -- used in 4 specs
- `inputTextAndSearch()` -- used in 4 specs
- `isFilterPresent()` -- used in 4 specs
- `isProjectGrayedOut()` -- used in 4 specs
- `isSortOptionExist()` -- used in 4 specs
- `isSubscriptionExisted()` -- used in 4 specs
- `login()` -- used in 4 specs
- `navigateToPage()` -- used in 4 specs
- `openGroupSection()` -- used in 4 specs
- `openSearchFilterPanel()` -- used in 4 specs
- `openSortMenu()` -- used in 4 specs
- `toBeDefined()` -- used in 4 specs
- `waitForElementInvisible()` -- used in 4 specs
- `waitForItemLoading()` -- used in 4 specs
- `waitForLibraryLoading()` -- used in 4 specs
- `cancelEditor()` -- used in 2 specs
- `cancelSelectObjectPanel()` -- used in 2 specs
- `clickCloseButtonIfVisible()` -- used in 2 specs
- `clickNewDossierIcon()` -- used in 2 specs
- `clickOnYAxis()` -- used in 2 specs
- `clickOpenFolderButton()` -- used in 2 specs
- `clickWidgetSelectionCheckbox()` -- used in 2 specs
- `closeDossierWithoutSaving()` -- used in 2 specs
- `createBookmark(dossierKey, bookmarkName)` -- used in 2 specs
- `createContextualLink()` -- used in 2 specs
- `createDocConsumptionPage()` -- used in 2 specs
- `createNewDashboardInstance({dossier, credentials, visKey})` -- used in 2 specs
- `editDossierFromLibrary()` -- used in 2 specs
- `execute()` -- used in 2 specs
- `getChangeProject()` -- used in 2 specs
- `getDatasetListLoadingSpinner()` -- used in 2 specs
- `getLoadingIcon()` -- used in 2 specs
- `isProjectSlectorDisabled()` -- used in 2 specs
- `listBookmarks(projectId, objectId, visKey, dossierKey)` -- used in 2 specs
- `openContentDiscovery()` -- used in 2 specs
- `openDossier()` -- used in 2 specs
- `openFolderByPath()` -- used in 2 specs
- `openSearchSlider()` -- used in 2 specs
- `openSubscriptions()` -- used in 2 specs
- `pause()` -- used in 2 specs
- `selectGridContextMenuOption()` -- used in 2 specs
- `switchToParentFrame()` -- used in 2 specs
- `waitForElementVisible()` -- used in 2 specs
- `createEnvironment()` -- used in 0 specs
- `getIFrame()` -- used in 0 specs
- `switchToIFrame()` -- used in 0 specs

## Source Coverage

- `pageObjects/embedding/**/*.js`
- `specs/regression/config/embedding/**/*.{ts,js}`
- `specs/regression/embedding-sdk/**/*.{ts,js}`
- `specs/regression/embedding-sdk/iframeEmbedding/**/*.{ts,js}`
- `specs/regression/embedding-sdk/nativeEmbedding/**/*.{ts,js}`
