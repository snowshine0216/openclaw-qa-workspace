# Site Knowledge: snapshots

> Components: 4

### SnapshotsAction
> Extends: `SnapshotsGrid`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `openSnapshotByName(name, waitForLoading = false)` |
| `openSnapshotByIndex(index, waitForLoading = false)` |
| `renameSnapshotByName(currentName, newName)` |
| `deleteSnapshotByName(name, confirmDelete = true)` |
| `deleteSnapshotByIndex(index, confirmDelete = true)` |
| `addSnapshotToFavorites(name)` |
| `removeSnapshotFromFavorites(name)` |
| `addSnapshotToFavoritesByIndex(index)` |
| `hoverOnSnapshotByName(name)` |
| `selectSnapshotByName(name)` |
| `selectSnapshotByIndex(index)` |
| `selectMultipleSnapshotsByNames(snapshotNames)` |
| `selectMultipleSnapshotsByIndices(indices)` |
| `hoverOnErrorStatus(snapshotsGrid)` |
| `getErrorTooltipText()` |
| `getSnapShotErrorMsgByName(snapshotsGrid, name)` |
| `deleteMultipleSnapshotsByNames(snapshotsGrid, snapshotNames, confirmDelete = true)` |
| `addMultipleSnapshotsToFavorites(snapshotsGrid, snapshotNames)` |
| `expandCollapseSnapshotsGroup(snapshotsGrid)` |
| `refreshSnapshotsGrid()` |
| `waitForSnapshotStatusChange(snapshotsGrid, name, expectedStatus, timeoutMs = 30000)` |
| `waitForSnapshotToAppear(snapshotsGrid, name, timeoutMs = 10000)` |
| `waitForSnapshotToDisappear(snapshotsGrid, name, timeoutMs = 10000)` |
| `getFavoritesCount()` |
| `isFavoriteButtonDisplayed(name)` |

**Sub-components**
- dossierPage

---

### SnapshotsGrid
> Extends: `BaseLibrary`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `CenterColsContainer` | `.ag-center-cols-container` | element |
| `FullWidthContainer` | `.ag-full-width-container` | element |

**Actions**
| Signature |
|-----------|
| `getGroupRow()` |
| `getGroupTitleText(group)` |
| `getFavoritesGroupTitleText()` |
| `getSnapshotsGroupTitleText()` |
| `getFavoritesGroup()` |
| `getSnapshotsGroup()` |
| `getSnapshotRowByName(name)` |
| `getSnapshotsCount(section = 'Snapshots')` |
| `getSnapshotNames()` |
| `getSnapshotUnreadStatusByName(name)` |
| `getSnapshotStatuses()` |
| `getSnapshotDates()` |
| `getSnapshotContentTypes()` |
| `getSnapshotContentByName(name)` |
| `getSnapshotStatusByName(name)` |
| `getSnapshotTypeByName(name)` |
| `getSnapshotNamesByStatus(status)` |
| `hoverOnSnapshotStatusIcon(name)` |
| `isSnapshotInFavorites(name)` |
| `isGridEmpty()` |
| `isSnapshotVisible(snapshotName)` |

**Sub-components**
- getFullWidthContainer

---

### SnapshotsPage
> Extends: `BaseLibrary`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getSnapshotRowByName(name)` |
| `getSnapshotsCount(section = 'Snapshots')` |
| `getSnapshotNames()` |
| `getSnapshotStatuses()` |
| `getSnapshotDates()` |
| `getSnapshotContentTypes()` |
| `getSnapshotContentByName(name)` |
| `getSnapShotStatusByName(name)` |
| `getSnapshotTypeByName(name)` |
| `hasUnreadIndicator(rowIndex)` |
| `hasUnreadIndicatorByName(name)` |
| `getSnapshotWithRunningStatus()` |
| `getSnapshotWithErrorStatus()` |
| `hasSnapshotWithStatus(status)` |
| `getSnapshotNamesByStatus(status)` |
| `isSnapshotOrderedByCreationTimeDesc()` |
| `verifySnapshotDetails(index, expectedName, expectedContentType, expectedStatus)` |
| `isSnapshotInFavorites(name)` |
| `isGridEmpty()` |
| `isSnapshotVisible(snapshotName)` |
| `openSnapshotByName(name, waitForLoading = false)` |
| `renameSnapshotByName(currentName, newName)` |
| `deleteSnapshotByName(name, confirmDelete = true)` |
| `addSnapshotToFavorites(name)` |
| `removeSnapshotFromFavorites(name)` |
| `hoverOnErrorStatus()` |
| `getErrorTooltipText()` |
| `getSnapShotErrorMsgByName(name)` |
| `getFavoritesCount()` |
| `getSnapshotItemByName(name)` |
| `getSnapShotContentByName(name)` |

**Sub-components**
_none_

---

### SnapshotsToolbar
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `openFilterDetailPanel(type)` |
| `ensureFilterPanelOpen()` |
| `filterBy({ filterType, items, apply = true, clearAll = true })` |
| `filterByProject(items, apply = true, clearAll = true)` |
| `filterByContentType(items, apply = true, clearAll = true)` |
| `filterByContent(items, apply = true, clearAll = true)` |
| `clearAllFilters()` |
| `composeFilter(updateFn, apply = false)` |
| `updateSort(func, option)` |
| `selectSortOption(option)` |
| `selectSortOrder(order)` |
| `currentSortOption()` |
| `currentSortOrder()` |
| `openSortMenu()` |
| `isSortMenuOpen()` |
| `currentSortStatus()` |
| `isSortDisplayed()` |
| `isFilterIconDisplayed()` |

**Sub-components**
- ensureFilterPanel
- openFilterDetailPanel
