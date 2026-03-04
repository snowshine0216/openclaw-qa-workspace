# Site Knowledge: search

> Components: 5

### BaseSearch
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SearchIcon` | `.icon-search_tb_box` | element |
| `SearchContainer` | `.mstrd-SearchNavItemContainer-container .mstrd-SearchBox` | element |
| `SearchSuggestion` | `.mstrd-SearchSuggestionTextView` | element |
| `DeleteIcon` | `.icon-clearsearch` | element |
| `QuickSearchView` | `.mstrd-QuickSearchDropDownView` | dropdown |

**Actions**
| Signature |
|-----------|
| `openSearchSlider()` |
| `clickSearchSlider()` |
| `inputText(text)` |
| `inputTextWithoutWait(text)` |
| `inputTextAndSearch(text)` |
| `clearInput()` |
| `isSearchIconPresent()` |
| `isSearchBarPresent()` |

**Sub-components**
- getSearchContainer

---

### CalendarOnSearch
> Extends: `BaseSearch`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `CalendarPanel` | `.mstrd-FilterDetailPanelCalendar` | element |
| `CalendarPanelExpDropdown` | `.mstrd-FilterDetailPanelCalendar-expDropdown` | dropdown |
| `DynamicCalenderConditionPicker` | `.mstrd-DynamicCalendarConditionPicker` | element |

**Actions**
| Signature |
|-----------|
| `openCalendarTypeSelector()` |
| `selectCalendarFilterTypeOption(name)` |
| `openAndSelectCalendarType(option)` |
| `setInputDate({ partialDate, customValue })` |
| `setInputBoxDate({ customMonth, customDay, customYear, flag = 'from', dynamic = false })` |
| `clickHeaderIcon(el, times)` |
| `clickNextYear(times, option = { popover: false })` |
| `clickLastYear(times, option = { popover: false })` |
| `clickLastMonth(times, option = { popover: false })` |
| `clickNextMonth(times, option = { popover: false })` |
| `selectYearInWidget(year, option = { popover: false })` |
| `selectMonthInWidget(month, option = { popover: false })` |
| `selectDayInWidget(month, year, day, option = { popover: false })` |
| `selectDate(customMonth, customDay, customYear, option = { popover: false })` |
| `selectDynamicCalendarConditionBtn(name)` |
| `selectDynamicCalendarCustomCondition()` |
| `clickFixedDateCheckbox(flag = 'from')` |
| `openDynamicCalenderConditionPicker(flag = 'from')` |
| `closeDynamicCalenderConditionPicker(flag = 'from')` |
| `selectDynamicCalenderCondition({ option, direction })` |
| `inputDynamicCalendarConditionNumber(number, custom)` |
| `inputDynamicCalenderCondition({ leftOpt, number, rightOpt, custom = false, flag = 'to' })` |
| `openDynamicCustomDatePicker(flag = 'from')` |
| `closeDynamicCustomDatePicker(flag = 'from')` |
| `clearAll()` |
| `getCalendarSelectedOption()` |
| `getDynamicDateInputContent(flag = 'all')` |
| `getHeaderTitleText(option = { popover: false })` |
| `getHeaderTitleYear(option = { popover: false })` |
| `getHeaderTitleMonth(option = { popover: false })` |
| `whichConditionIsSelected()` |
| `getDynamicPreviewContent(flag)` |
| `getDynamicPreviewContentDate(flag)` |
| `isFixedDate(flag)` |
| `getWarningMsg()` |
| `getCalendarSelectedDaysCount()` |

**Sub-components**
- getCalendarPanel
- getDatePickerWidget
- getCalendarMonthDaysWidget
- getMonthYearInWidget
- getDayInWidget
- selectYearInWidget
- selectMonthInWidget
- selectDayInWidget

---

### FilterOnSearch
> Extends: `BaseSearch`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SearchFilterNavItem` | `.mstrd-SearchFilterNavItemContainer` | element |
| `SearchFilterDropdownPanel` | `.mstrd-DropdownMenu-main,.mstrd-SearchFilterMenuItemContainer` | dropdown |
| `FilterDetailsPanel` | `.mstrd-BaseFilterDetailPanel` | element |
| `BackInMobleView` | `.mstrd-MobileSliderOptionRow-menuOption--hasBackAction .mstrd-MobileSliderOptionRow-backArrow` | element |
| `FilterPanelInMobileView` | `.mstr-nav-icon.icon-tb_filter_n` | element |
| `ApplyBtnInMobileView` | `.mstrd-BaseFilterPanel-applyTxt` | element |
| `ApplyCount` | `.mstrd-SearchFilterNavItemContainer-applyCount` | element |

**Actions**
| Signature |
|-----------|
| `openSearchFilterPanel()` |
| `openFilterInMobileView()` |
| `openFilterDetailPanel(type)` |
| `applyFilterChanged()` |
| `clearAllFilters()` |
| `selectOptionInCheckbox(name)` |
| `clickCertifiedOnlyBtn()` |
| `selectAll()` |
| `clearAll()` |
| `keepOnly(name)` |
| `deleteFilterSummaryItem(type, item)` |
| `closeFilterPanel()` |
| `searchOnFilter(text)` |
| `clearSearchBox()` |
| `toggleViewSelected()` |
| `backInMobileView()` |
| `applyInMobileView()` |
| `isSummaryTextExisted(type, text)` |
| `isFilterPresent(type)` |
| `isCerififiedOnlyChecked()` |
| `isViewSelectedChecked()` |
| `isClearAllDisabled()` |
| `getCheckboxItemCount()` |
| `isFilterDisabled()` |
| `isWarningDisplayOnApply()` |
| `getSearchFilterItemsCount()` |
| `isFilterSummaryPresent(type)` |
| `isCheckboxOptionItemsPresent()` |
| `getSearchFilterItemsName()` |
| `getOptionsInCheckboxDetailPanelName()` |
| `getFilterCount()` |
| `isFilterCountPresent()` |
| `isOptionPresentInCheckboxPanel(name)` |

**Sub-components**
- getSearchFilterDropdownPanel
- getFilterDetailsPanel
- getFilterDetailPanel
- getOptionInCheckboxDetailPanel
- getFilterPanel
- getOptionsInCheckboxDetailPanel

---

### FullSearch
> Extends: `BaseSearch`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SearchResultsContainer` | `.mstrd-SearchResultsListContainer` | element |
| `BackIcon` | `.mstr-nav-icon.icon-back-lib` | element |
| `SearchResultsListContainerHead` | `.mstrd-SearchResultsListContainer-headContent` | element |
| `SearchSortContainer` | `.mstrd-SearchSortContainer` | element |
| `SearchSortBox` | `.mstrd-SearchSortBox` | element |
| `RecommendationContainer` | `.mstrd-RecommendationsContainer-content` | element |
| `BrowserAllDossierLink` | `.mstrd-NoSearchResults-link>button` | button |
| `NoSearchResultContainer` | `.mstrd-NoSearchResults` | element |
| `Tooltip` | `.ant-tooltip:not(.ant-tooltip-hidden)` | element |
| `SearchResultWaitingAnimation` | `.mstrd-WaitGlobalSearchResults` | element |

**Actions**
| Signature |
|-----------|
| `getSearchResultListItems()` |
| `getTooltipText()` |
| `getSearchResultLoadingIcon()` |
| `getSearchResultWaitingAnimation()` |
| `backToLibrary()` |
| `openSearchSortBox()` |
| `closeSearchSortBox()` |
| `clickNthOptionInSortDropdown(index)` |
| `clickSortOption(option)` |
| `clickMyLibraryTab()` |
| `clickAllTab()` |
| `clickTabByName(name)` |
| `openDossierFromSearchResults(name)` |
| `openDossierFromSearchResultsInNewTab(name)` |
| `clickMatchedContentIcon(name)` |
| `openDossierFromMatchedContent(name, index = 0)` |
| `clickMatchedContentText(name, text)` |
| `clickMatchedContentTextInNewTab(name, text)` |
| `openInfoWindow(name)` |
| `browserAllDossiers()` |
| `hoverOnCertifiedIcon(name)` |
| `hoverOnTemplateIcon(name)` |
| `waitForSearchLoading()` |
| `getMyLibraryCount()` |
| `getAllTabCount()` |
| `getTabCountByName(name)` |
| `getMatchContentCount(name)` |
| `isMatchedContentExisted(name, item)` |
| `isSortDisabled()` |
| `isSortDisplay()` |
| `isAllTabPresent()` |
| `isMyLibraryTabPresent()` |
| `isSortDropdownPresent()` |
| `getFirstResultItemTitle()` |
| `setUpdateTime(name, time)` |
| `getSortOptionCount()` |
| `isSortOptionPresent(option)` |
| `isDossierTimePresent()` |
| `isDossierOwnerPresent()` |
| `isBackButtonPresent()` |
| `getSearchSortSelectedText()` |
| `isNoResultPagePresent()` |
| `closeInfoWindow()` |
| `isObjectTypeIconInSearchResultsDisplayed(name)` |
| `isRunAsExcelIconPresentInSearchResults(name)` |
| `isRunAsPDFIconPresentInSearchResults(name)` |
| `getSearchTabNames()` |
| `getIDMatchText(name)` |

**Sub-components**
- dossierPage
- getSearchResultsContainer
- getRecommendationContainer
- getSearchSortContainer
- getNoSearchResultContainer

---

### QuickSearch
> Extends: `BaseSearch`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SearchSuggestionTextView` | `.mstrd-SearchSuggestionTextView` | element |
| `SearchSuggestionShortcuts` | `.mstrd-SearchSuggestionShortcuts` | element |
| `SearchResultsContainer` | `.mstrd-SearchResultsListContainer` | element |

**Actions**
| Signature |
|-----------|
| `openQuickSearchView()` |
| `clickViewAll()` |
| `clickSearchSuggestionText(index)` |
| `openDossierFromSearchSuggestion(index)` |
| `openDossierFromSearchSuggestionByName(name)` |
| `openDossierFromRecentlyViewedByName(name)` |
| `clearRencentlySearchedAndReviewed()` |
| `getRecentlySearchedKeywordsCount()` |
| `getRencentlyViewedShortcutCount()` |
| `isKeywordExisted(item)` |
| `waitForSuggestionResponse()` |
| `waitForSearchResultsContainer()` |
| `isSearchSuggestionObjectTypeIconDisplayed(name)` |
| `isSearchSuggestionRunAsIconDisplayed(name)` |
| `isQuickSearchShortcutItemCoverImageGrayedOut(index)` |
| `isSearchSuggestionDisplay()` |

**Sub-components**
- dossierPage
- getSearchContainer
- getSearchResultsContainer
