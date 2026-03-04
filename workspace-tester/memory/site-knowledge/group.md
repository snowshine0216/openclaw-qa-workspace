# Site Knowledge: group

> Components: 2

### Group
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `GroupDialog` | `.ant-modal-content` | element |
| `GroupBar` | `.mstrd-MultiSelectionToolbar` | dropdown |
| `GroupBarSecondaryMenu` | `.ant-dropdown-menu-submenu-popup` | dropdown |

**Actions**
| Signature |
|-----------|
| `inputGroupName(name)` |
| `selectGroupColor(color)` |
| `clickGroupSaveBtnNoWait()` |
| `clickGroupSaveBtn()` |
| `clickGroupCancelBtn()` |
| `clickGroupBarSelectAllBtn()` |
| `clickGroupBarActionBtn()` |
| `selectGroupBarContextMenu(item1, item2 = '')` |
| `hoverGroupBarContextMenu(item)` |
| `clickGroupBarDoneBtn()` |
| `isGroupDialoguePresent()` |
| `isGroupColorSelected(color)` |
| `isGroupColorPresent(color)` |
| `isGroupBarPresent()` |
| `isGroupBarActionBtnPresent()` |
| `getGroupBarSelectionCount()` |
| `isGroupNameInputFocused()` |
| `isColorFocused(color)` |
| `isSaveButtonFocused()` |

**Sub-components**
_none_

---

### Sidebar
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SidebarContainer` | `.mstrd-SidebarContainer` | element |
| `MobileSidebarContainer` | `.mstrd-SidebarContainer-content` | element |
| `PredefinedMenuSection` | `.mstrd-PredefinedMenuSection` | element |
| `AllToggleButton` | `.mstrd-AllMenuSection-toggleButton` | button |
| `DefaultGroups` | `.mstrd-GroupMenuSection-titleText` | element |
| `GroupCollapseButton` | `.mstrd-GroupMenuSection-toggleButton` | button |
| `DeleteConfirmation` | `.mstrd-ConfirmationDialog` | element |
| `SubscriptionLoadingIcon` | `.mstrd-SubscriptionLoadingStatus` | element |

**Actions**
| Signature |
|-----------|
| `getDefaultGroupsTitle()` |
| `hoverOnContentBundleTitle()` |
| `clickPredefinedSection(item)` |
| `clickAllSection(hasSubmenu = false)` |
| `expandAllSection()` |
| `clickBotSecion()` |
| `clickAnalysisSection()` |
| `clickAllSubSection(text)` |
| `openFavoriteSectionList()` |
| `openAllSectionList(hasSubmenu = false)` |
| `openRecentsSectionList()` |
| `openMyContentSectionList()` |
| `openBookmarkSectionList()` |
| `openSnapshotsSectionList()` |
| `openContentDiscovery(locale = 'en')` |
| `openDataSection(name = 'Data')` |
| `openInsightsList()` |
| `clickAddGroupBtn()` |
| `clickGroupOptions(name)` |
| `selectGroupEditOption()` |
| `selectGroupDeleteOption()` |
| `confirmDelete()` |
| `cancelDelete()` |
| `deleteGroup()` |
| `openGroupSection(name)` |
| `getGroupColor(name)` |
| `clickGroupCollapseButton()` |
| `dragSidebarWidth(offset)` |
| `getGroupCount()` |
| `isGroupExisted(name)` |
| `isGroupEmpty()` |
| `openSubscriptions()` |
| `waitForSubscriptionLoading()` |
| `isGroupClickable(name)` |
| `sidebarWidth()` |
| `isPredefinedSectionItemPresent(item)` |
| `isAllExpanded()` |
| `isAllSubsectionVisible(text)` |
| `getGrayedSectionNames()` |
| `getSelectedSectionName()` |
| `getPredefinedSectionItemsCount()` |
| `getPredefinedSectionItemsTexts()` |
| `isAddGroupBtnForSaaSHidden()` |
| `isAddGroupBtnForSaaSDisplayed()` |
| `isAllSectionSelected()` |
| `isDataSectionPresent()` |
| `isSnapshotsSectionPresent()` |
| `isBookmarksSectionPresent()` |

**Sub-components**
- getSidebarContainer
- getTooltipContainer
