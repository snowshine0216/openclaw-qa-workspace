# Site Knowledge: Search Domain

## Overview

- **Domain key:** `search`
- **Components covered:** BaseSearch, CalendarOnSearch, FilterOnSearch, FullSearch, QuickSearch
- **Spec files scanned:** 10
- **POM files scanned:** 5

## Components

### BaseSearch
- **CSS root:** `.mstrd-SearchNavItemContainer-container .mstrd-SearchBox`
- **User-visible elements:**
  - Delete Icon (`.icon-clearsearch`)
  - Quick Search View (`.mstrd-QuickSearchDropDownView`)
  - Search Container (`.mstrd-SearchNavItemContainer-container .mstrd-SearchBox`)
  - Search Icon (`.icon-search_tb_box`)
  - Search Suggestion (`.mstrd-SearchSuggestionTextView`)
- **Component actions:**
  - `clearInput()`
  - `clickSearchSlider()`
  - `inputText(text)`
  - `inputTextAndSearch(text)`
  - `inputTextWithoutWait(text)`
  - `isSearchBarPresent()`
  - `isSearchIconPresent()`
  - `openSearchSlider()`
- **Related components:** getSearchContainer

### CalendarOnSearch
- **CSS root:** `.mstrd-FilterDetailPanelCalendar`
- **User-visible elements:**
  - Calendar Panel (`.mstrd-FilterDetailPanelCalendar`)
  - Calendar Panel Exp Dropdown (`.mstrd-FilterDetailPanelCalendar-expDropdown`)
  - Dynamic Calender Condition Picker (`.mstrd-DynamicCalendarConditionPicker`)
- **Component actions:**
  - `clearAll()`
  - `clickFixedDateCheckbox(flag = 'from')`
  - `clickHeaderIcon(el, times)`
  - `clickLastMonth(times, option = { popover: false })`
  - `clickLastYear(times, option = { popover: false })`
  - `clickNextMonth(times, option = { popover: false })`
  - `clickNextYear(times, option = { popover: false })`
  - `closeDynamicCalenderConditionPicker(flag = 'from')`
  - `closeDynamicCustomDatePicker(flag = 'from')`
  - `getCalendarSelectedDaysCount()`
  - `getCalendarSelectedOption()`
  - `getDynamicDateInputContent(flag = 'all')`
  - `getDynamicPreviewContent(flag)`
  - `getDynamicPreviewContentDate(flag)`
  - `getHeaderTitleMonth(option = { popover: false })`
  - `getHeaderTitleText(option = { popover: false })`
  - `getHeaderTitleYear(option = { popover: false })`
  - `getWarningMsg()`
  - `inputDynamicCalendarConditionNumber(number, custom)`
  - `inputDynamicCalenderCondition({ leftOpt, number, rightOpt, custom = false, flag = 'to' })`
  - `isFixedDate(flag)`
  - `openAndSelectCalendarType(option)`
  - `openCalendarTypeSelector()`
  - `openDynamicCalenderConditionPicker(flag = 'from')`
  - `openDynamicCustomDatePicker(flag = 'from')`
  - `selectCalendarFilterTypeOption(name)`
  - `selectDate(customMonth, customDay, customYear, option = { popover: false })`
  - `selectDayInWidget(month, year, day, option = { popover: false })`
  - `selectDynamicCalendarConditionBtn(name)`
  - `selectDynamicCalendarCustomCondition()`
  - `selectDynamicCalenderCondition({ option, direction })`
  - `selectMonthInWidget(month, option = { popover: false })`
  - `selectYearInWidget(year, option = { popover: false })`
  - `setInputBoxDate({ customMonth, customDay, customYear, flag = 'from', dynamic = false })`
  - `setInputDate({ partialDate, customValue })`
  - `whichConditionIsSelected()`
- **Related components:** getCalendarMonthDaysWidget, getCalendarPanel, getDatePickerWidget, getDayInWidget, getMonthYearInWidget, selectDayInWidget, selectMonthInWidget, selectYearInWidget

### FilterOnSearch
- **CSS root:** `.mstrd-SearchFilterNavItemContainer-applyCount`
- **User-visible elements:**
  - Apply Btn In Mobile View (`.mstrd-BaseFilterPanel-applyTxt`)
  - Apply Count (`.mstrd-SearchFilterNavItemContainer-applyCount`)
  - Back In Moble View (`.mstrd-MobileSliderOptionRow-menuOption--hasBackAction .mstrd-MobileSliderOptionRow-backArrow`)
  - Filter Details Panel (`.mstrd-BaseFilterDetailPanel`)
  - Filter Panel In Mobile View (`.mstr-nav-icon.icon-tb_filter_n`)
  - Search Filter Dropdown Panel (`.mstrd-DropdownMenu-main,.mstrd-SearchFilterMenuItemContainer`)
  - Search Filter Nav Item (`.mstrd-SearchFilterNavItemContainer`)
- **Component actions:**
  - `applyFilterChanged()`
  - `applyInMobileView()`
  - `backInMobileView()`
  - `clearAll()`
  - `clearAllFilters()`
  - `clearSearchBox()`
  - `clickCertifiedOnlyBtn()`
  - `closeFilterPanel()`
  - `deleteFilterSummaryItem(type, item)`
  - `getCheckboxItemCount()`
  - `getFilterCount()`
  - `getOptionsInCheckboxDetailPanelName()`
  - `getSearchFilterItemsCount()`
  - `getSearchFilterItemsName()`
  - `isCerififiedOnlyChecked()`
  - `isCheckboxOptionItemsPresent()`
  - `isClearAllDisabled()`
  - `isFilterCountPresent()`
  - `isFilterDisabled()`
  - `isFilterPresent(type)`
  - `isFilterSummaryPresent(type)`
  - `isOptionPresentInCheckboxPanel(name)`
  - `isSummaryTextExisted(type, text)`
  - `isViewSelectedChecked()`
  - `isWarningDisplayOnApply()`
  - `keepOnly(name)`
  - `openFilterDetailPanel(type)`
  - `openFilterInMobileView()`
  - `openSearchFilterPanel()`
  - `searchOnFilter(text)`
  - `selectAll()`
  - `selectOptionInCheckbox(name)`
  - `toggleViewSelected()`
- **Related components:** getFilterDetailPanel, getFilterDetailsPanel, getFilterPanel, getOptionInCheckboxDetailPanel, getOptionsInCheckboxDetailPanel, getSearchFilterDropdownPanel

### FullSearch
- **CSS root:** `.mstrd-SearchResultsListContainer`
- **User-visible elements:**
  - Back Icon (`.mstr-nav-icon.icon-back-lib`)
  - Browser All Dossier Link (`.mstrd-NoSearchResults-link>button`)
  - No Search Result Container (`.mstrd-NoSearchResults`)
  - Recommendation Container (`.mstrd-RecommendationsContainer-content`)
  - Search Results Container (`.mstrd-SearchResultsListContainer`)
  - Search Results List Container Head (`.mstrd-SearchResultsListContainer-headContent`)
  - Search Result Waiting Animation (`.mstrd-WaitGlobalSearchResults`)
  - Search Sort Box (`.mstrd-SearchSortBox`)
  - Search Sort Container (`.mstrd-SearchSortContainer`)
  - Tooltip (`.ant-tooltip:not(.ant-tooltip-hidden)`)
- **Component actions:**
  - `backToLibrary()`
  - `browserAllDossiers()`
  - `clickAllTab()`
  - `clickMatchedContentIcon(name)`
  - `clickMatchedContentText(name, text)`
  - `clickMatchedContentTextInNewTab(name, text)`
  - `clickMyLibraryTab()`
  - `clickNthOptionInSortDropdown(index)`
  - `clickSortOption(option)`
  - `clickTabByName(name)`
  - `closeInfoWindow()`
  - `closeSearchSortBox()`
  - `getAllTabCount()`
  - `getFirstResultItemTitle()`
  - `getIDMatchText(name)`
  - `getMatchContentCount(name)`
  - `getMyLibraryCount()`
  - `getSearchResultListItems()`
  - `getSearchResultLoadingIcon()`
  - `getSearchResultWaitingAnimation()`
  - `getSearchSortSelectedText()`
  - `getSearchTabNames()`
  - `getSortOptionCount()`
  - `getTabCountByName(name)`
  - `getTooltipText()`
  - `hoverOnCertifiedIcon(name)`
  - `hoverOnTemplateIcon(name)`
  - `isAllTabPresent()`
  - `isBackButtonPresent()`
  - `isDossierOwnerPresent()`
  - `isDossierTimePresent()`
  - `isMatchedContentExisted(name, item)`
  - `isMyLibraryTabPresent()`
  - `isNoResultPagePresent()`
  - `isObjectTypeIconInSearchResultsDisplayed(name)`
  - `isRunAsExcelIconPresentInSearchResults(name)`
  - `isRunAsPDFIconPresentInSearchResults(name)`
  - `isSortDisabled()`
  - `isSortDisplay()`
  - `isSortDropdownPresent()`
  - `isSortOptionPresent(option)`
  - `openDossierFromMatchedContent(name, index = 0)`
  - `openDossierFromSearchResults(name)`
  - `openDossierFromSearchResultsInNewTab(name)`
  - `openInfoWindow(name)`
  - `openSearchSortBox()`
  - `setUpdateTime(name, time)`
  - `waitForSearchLoading()`
- **Related components:** dossierPage, getNoSearchResultContainer, getRecommendationContainer, getSearchResultsContainer, getSearchSortContainer

### QuickSearch
- **CSS root:** `.mstrd-SearchResultsListContainer`
- **User-visible elements:**
  - Search Results Container (`.mstrd-SearchResultsListContainer`)
  - Search Suggestion Shortcuts (`.mstrd-SearchSuggestionShortcuts`)
  - Search Suggestion Text View (`.mstrd-SearchSuggestionTextView`)
- **Component actions:**
  - `clearRencentlySearchedAndReviewed()`
  - `clickSearchSuggestionText(index)`
  - `clickViewAll()`
  - `getRecentlySearchedKeywordsCount()`
  - `getRencentlyViewedShortcutCount()`
  - `isKeywordExisted(item)`
  - `isQuickSearchShortcutItemCoverImageGrayedOut(index)`
  - `isSearchSuggestionDisplay()`
  - `isSearchSuggestionObjectTypeIconDisplayed(name)`
  - `isSearchSuggestionRunAsIconDisplayed(name)`
  - `openDossierFromRecentlyViewedByName(name)`
  - `openDossierFromSearchSuggestion(index)`
  - `openDossierFromSearchSuggestionByName(name)`
  - `openQuickSearchView()`
  - `waitForSearchResultsContainer()`
  - `waitForSuggestionResponse()`
- **Related components:** dossierPage, getSearchContainer, getSearchResultsContainer

## Common Workflows (from spec.ts)

1. Chapter Filter (used in 2 specs)
2. GlobalSearch_CalendarOnSearch (used in 2 specs)
3. [TC69970] Global Search - Search Suggestion - different search keyword on search suggestion (used in 1 specs)
4. [TC69971] Global Search - Search Suggestion - open search suggestion text on quick search and full screen search page (used in 1 specs)
5. [TC69972] Global Search - Search Suggestion - open search suggestion document/dossier on quick search and full screen search page (used in 1 specs)
6. [TC69973] Global Search - Recently Searched - Recently searched history list on quick search and full screen search page (used in 1 specs)
7. [TC69974] Global Search - Recently Viewed - Different entries to refresh recently reviewed list (used in 1 specs)
8. [TC70026] Global Search - Recently Viewed - Prompted dossier on recently viewed list (used in 1 specs)
9. [TC70027] Global Search - Recently Viewed - Prompted document on recently viewed list (used in 1 specs)
10. [TC70030] Global Search - Recently Viewed - Cover image on recently viewed list (used in 1 specs)
11. [TC70038] Global Search - Recently Searched - maximum recently searched history list (used in 1 specs)
12. [TC70049] Global Search - Recently Viewed - maximum recently viewed history list (used in 1 specs)
13. [TC70050] Global Search - Recently Viewed - Rencently viewed history list on quick search and full screen search page (used in 1 specs)
14. [TC70051] Global Search - NLP - Different search keyword on search results (used in 1 specs)
15. [TC70058] Global Search - NLP - Highlight keyword on search results of My Library Tab (used in 1 specs)
16. [TC70059] Global Search - NLP - Highlight keyword on search results of All Tab (used in 1 specs)
17. [TC70103] Global Search - Matched content - Different matched content object (chapter/page/viz/attribute/metric) (used in 1 specs)
18. [TC70108] Global Search - Matched content - Execute dossier from matched content link (used in 1 specs)
19. [TC70112] Global Search - Info Window - Share dossier and share document on My Library Tab (used in 1 specs)
20. [TC70124] Global Search - Info Window - Export dossier and export document on My Library Tab (used in 1 specs)
21. [TC70125] Global Search - Info Window - Download dossier on My Library Tab (used in 1 specs)
22. [TC70126] Global Search - Info Window - Reset dossier and reset document on My Library Tab (used in 1 specs)
23. [TC70129] Global Search - Info Window - Remove dossier on My Library Tab (used in 1 specs)
24. [TC70130] Global Search - Info Window - Edit dossier (used in 1 specs)
25. [TC70131] Global Search - Info Window - Share dossier and share document on ALL Tab (used in 1 specs)
26. [TC70132] Global Search - Info Window - Export dossier and export document on ALL Tab (used in 1 specs)
27. [TC70133] Global Search - Info Window - Download dossier on ALL Tab (used in 1 specs)
28. [TC70134] Global Search - Info Window - Edit dossier from all tab (used in 1 specs)
29. [TC70199] Global Search - Sort - Sort by Relevance on My Library and All tab (used in 1 specs)
30. [TC70200] Global Search - Sort - Sort by Content Name on My Library and All tab (used in 1 specs)
31. [TC70201] Global Search - Sort - Sort by Date Updated on My Library and All tab (used in 1 specs)
32. [TC70202] Global Search - Sort - Sort by Date Added on My Library tab (used in 1 specs)
33. [TC70203] Global Search - Sort - Sort by Date Viewed on My Library tab (used in 1 specs)
34. [TC70273] Global Search - Filter - Filter panel GUI and action buttons (used in 1 specs)
35. [TC70274] Global Search - Filter - Filter by CheckBox: search and view selected (used in 1 specs)
36. [TC70275] Global Search - Filter - Filter by Type on My Library tab and All tab (used in 1 specs)
37. [TC70276] Global Search - Filter - Filter by Certified Only on My Library tab and All tab (used in 1 specs)
38. [TC70282] Global Search - Filter - Filter by Owner on My Library tab and All tab (used in 1 specs)
39. [TC70287] Global Search - Search status when no results returned (used in 1 specs)
40. [TC70309] Global Search - Calendar Filter - Calendar filter Before (used in 1 specs)
41. [TC70310] Global Search - Calendar Filter - Calendar filter On (used in 1 specs)
42. [TC70311] Global Search - Calendar Filter - Calendar filter After (used in 1 specs)
43. [TC70312] Global Search - Calendar Filter - Calendar filter Between (used in 1 specs)
44. [TC74391] Global Search - Calendar Filter - Action on calendar header (Last/next month & year) (used in 1 specs)
45. [TC74393] Global Search - Calendar Filter - Select date from calendar widget (used in 1 specs)
46. [TC74468] Global Search - Calendar Filter - Action on calendar footer (X days selected, clear all) (used in 1 specs)
47. [TC74471] Global Search - Calendar Filter - Select Dynamic Today (used in 1 specs)
48. [TC74472] Global Search - Calendar Filter - Select Dynamic Yesterday (used in 1 specs)
49. [TC74473] Global Search - Calendar Filter - Select Dynamic MTD (used in 1 specs)
50. [TC74474] Global Search - Calendar Filter - Select Dynamic QTD (used in 1 specs)
51. [TC74476] Global Search - Calendar Filter - Select Dynamic Last /Next X days (used in 1 specs)
52. [TC74477] Global Search - Calendar Filter - Select Dynamic Custom Fixed date (used in 1 specs)
53. [TC74478] Global Search - Calendar Filter - Select Dynamic Custom Plus/Minus X days (used in 1 specs)
54. [TC74479] Global Search - Calendar Filter - Dynamic date error handling (used in 1 specs)
55. [TC74557] Global Search - Calendar Filter - Select Dynamic YTD (used in 1 specs)
56. [TC79821] Validate search hidden objects on Library Web (used in 1 specs)
57. [TC82221] Validate global search on Report in Library Web (used in 1 specs)
58. [TC86608] Validate search across multiple projects (used in 1 specs)
59. [TC86808] Validate different report types on global search (used in 1 specs)
60. [TC86837] Global Search - Validate search results with two or more empty space (used in 1 specs)
61. [TC86850] Global Search - Info Window - action buttons on report (used in 1 specs)
62. [TC87727] Global Search - Validate search keyword with different language (used in 1 specs)
63. [TC88070] Global Search - Mobile View - Sanity global search on mobile view (used in 1 specs)
64. [TC89466] Global Search - Validatte Relevance search order on My Libarary and All tab (used in 1 specs)
65. [TC90319] Global Search - Filter - Filter by Project on My Library tab and All tab (used in 1 specs)
66. [TC90320] Global Search - Filter - Different user access to x-projects (used in 1 specs)
67. [TC90644] Global Search - Custom App - Granual Control Timestamps for Filter and Sort (used in 1 specs)
68. [TC90645] Global Search - Custom App - Granual Control Project, Owner, Timestamps on Filter and Sort (used in 1 specs)
69. [TC90646] Global Search - Custom App - Switch custom app from search results page (used in 1 specs)
70. [TC91547] Global Search - Issue - Sort while switch All tab and My Library tab (used in 1 specs)
71. [TC94425_0] Create dashboard with dataset and search filter, save dashboard. (used in 1 specs)
72. [TC94425_1] Open a dashboard with search box filter applied. (used in 1 specs)
73. [TC94425_2] Open filter panel, click on the filter, search for a two-word phrase. (used in 1 specs)
74. [TC95091_0] Create dashboard with dataset and search filter (used in 1 specs)
75. [TC95091_1] Test search behaviour in filter panel (used in 1 specs)
76. [TC95091_2] Test search behaviour in canvas (used in 1 specs)
77. [TC95091_3] Save and reopen a dashboard with search box filter applied. (used in 1 specs)
78. [TC95091_4] Test search behaviour in canvas in consumption (used in 1 specs)
79. [TC97353_02] Global Search - Validate search object ID on My Library and All tab - suppoted report (used in 1 specs)
80. [TC97353_03] Global Search - Validate search object ID on My Library and All tab - not suppoted report (used in 1 specs)
81. [TC97353_04] Global Search - Validate search object ID on My Library and All tab - two project object (used in 1 specs)
82. [TC97353_05] Global Search - Validate search object ID on My Library and All tab - hidden report (used in 1 specs)
83. [TC97353_06] Global Search - Validate search object ID on My Library and All tab - object and text (used in 1 specs)
84. [TC97353_07] Global Search - Validate search object ID on My Library and All tab - id as name (used in 1 specs)
85. [TC97353_08] Global Search - Validate search object ID on My Library and All tab - invalid id (used in 1 specs)
86. [TC97353] Global Search - Validate search object ID on My Library and All tab - dashboard and document (used in 1 specs)
87. GlobalSearch_FilterOnSearch (used in 1 specs)
88. GlobalSearch_FullScreenSearch (used in 1 specs)
89. GlobalSearch_InfoWindowOnSearch (used in 1 specs)
90. GlobalSearch_QuickSearch (used in 1 specs)
91. GlobalSearch_SearchbyID (used in 1 specs)
92. GlobalSearch_SortOnSearch (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. getAllTabCount -- frequency: 45
2. getMyLibraryCount -- frequency: 36
3. getCalendarFilterSummary -- frequency: 33
4. getFirstResultItemTitle -- frequency: 32
5. getRencentlyViewedShortcutCount -- frequency: 26
6. getDynamicPreviewContent -- frequency: 24
7. getSuggestionListItems -- frequency: 22
8. getDossierSharedBySortText -- frequency: 19
9. getDynamicDateInputContent -- frequency: 17
10. getSearchSuggestionTextItems -- frequency: 16
11. getCalendarSelectedDaysCount -- frequency: 15
12. getRecentlySearchedKeywordsCount -- frequency: 10
13. getTabCountByName -- frequency: 10
14. getSearchSuggestionShortcutsItems -- frequency: 9
15. getCheckboxItemCount -- frequency: 8
16. getSearchFilterDropdownPanel -- frequency: 8
17. getSearchTabNames -- frequency: 8
18. getSearchSortDropdown -- frequency: 7
19. getSearchSortSelectedText -- frequency: 7
20. getFilterSummaryTexts -- frequency: 6
21. getHightlightTexts -- frequency: 6
22. getMatchContentCount -- frequency: 6
23. getCalendarSelectedOption -- frequency: 4
24. getFilterDetailsPanel -- frequency: 4
25. getHeaderTitleText -- frequency: 4
26. getRecentlyViewedShortcutName -- frequency: 4
27. getSearchFilterItemsCount -- frequency: 4
28. getShareDossierDialog -- frequency: 4
29. getSortOptionCount -- frequency: 4
30. getWarningMsg -- frequency: 4
31. getCalendarPanel -- frequency: 3
32. getIDMatchText -- frequency: 3
33. getQuickSearchView -- frequency: 3
34. getActionButtonsCount -- frequency: 2
35. getBrowserAllDossierLink -- frequency: 2
36. getDossierView -- frequency: 2
37. getDynamicPreviewContentDate -- frequency: 2
38. getFilterCount -- frequency: 2
39. getSearchResultsContainer -- frequency: 2
40. mstr -- frequency: 2
41. pdf -- frequency: 2
42. Search Results Container -- frequency: 2
43. Apply Btn In Mobile View -- frequency: 1
44. Apply Count -- frequency: 1
45. Back Icon -- frequency: 1
46. Back In Moble View -- frequency: 1
47. Browser All Dossier Link -- frequency: 1
48. Calendar Panel -- frequency: 1
49. Calendar Panel Exp Dropdown -- frequency: 1
50. Delete Icon -- frequency: 1
51. Dynamic Calender Condition Picker -- frequency: 1
52. Filter Details Panel -- frequency: 1
53. Filter Panel In Mobile View -- frequency: 1
54. getFilterApplyBtn -- frequency: 1
55. getFilterDetailPanelCheckbox -- frequency: 1
56. getLibraryIcon -- frequency: 1
57. getMatchContentInfo -- frequency: 1
58. getRecentlySearchedView -- frequency: 1
59. No Search Result Container -- frequency: 1
60. Quick Search View -- frequency: 1
61. Recommendation Container -- frequency: 1
62. Search Container -- frequency: 1
63. Search Filter Dropdown Panel -- frequency: 1
64. Search Filter Nav Item -- frequency: 1
65. Search Icon -- frequency: 1
66. Search Result Waiting Animation -- frequency: 1
67. Search Results List Container Head -- frequency: 1
68. Search Sort Box -- frequency: 1
69. Search Sort Container -- frequency: 1
70. Search Suggestion -- frequency: 1
71. Search Suggestion Shortcuts -- frequency: 1
72. Search Suggestion Text View -- frequency: 1
73. Tooltip -- frequency: 1

## Key Actions

- `openSearchSlider()` -- used in 117 specs
- `inputTextAndSearch(text)` -- used in 93 specs
- `clickMyLibraryTab()` -- used in 77 specs
- `openSearchFilterPanel()` -- used in 51 specs
- `getAllTabCount()` -- used in 45 specs
- `clickAllTab()` -- used in 41 specs
- `backToLibrary()` -- used in 38 specs
- `goToLibrary()` -- used in 37 specs
- `getMyLibraryCount()` -- used in 36 specs
- `applyFilterChanged()` -- used in 35 specs
- `openFilterDetailPanel(type)` -- used in 34 specs
- `getCalendarFilterSummary()` -- used in 33 specs
- `inputText(text)` -- used in 33 specs
- `getFirstResultItemTitle()` -- used in 32 specs
- `getRencentlyViewedShortcutCount()` -- used in 26 specs
- `getDynamicPreviewContent(flag)` -- used in 24 specs
- `openSearchSortBox()` -- used in 24 specs
- `toBeGreaterThan()` -- used in 24 specs
- `getSuggestionListItems()` -- used in 22 specs
- `getText()` -- used in 22 specs
- `clickNthOptionInSortDropdown(index)` -- used in 21 specs
- `clickViewAll()` -- used in 21 specs
- `selectOptionInCheckbox(name)` -- used in 21 specs
- `openDossierFromSearchResultsInNewTab(name)` -- used in 20 specs
- `getDossierSharedBySortText()` -- used in 19 specs
- `getDynamicDateInputContent(flag = 'all')` -- used in 17 specs
- `openInfoWindow(name)` -- used in 17 specs
- `getSearchSuggestionTextItems()` -- used in 16 specs
- `getCalendarSelectedDaysCount()` -- used in 15 specs
- `clearInput()` -- used in 14 specs
- `closeFilterPanel()` -- used in 14 specs
- `clickMatchedContentIcon(name)` -- used in 13 specs
- `selectDynamicCalendarConditionBtn(name)` -- used in 13 specs
- `closeAllTabs()` -- used in 12 specs
- `login()` -- used in 12 specs
- `isDisplayed()` -- used in 11 specs
- `setInputBoxDate({ customMonth, customDay, customYear, flag = 'from', dynamic = false })` -- used in 11 specs
- `clickSearchSlider()` -- used in 10 specs
- `close()` -- used in 10 specs
- `getRecentlySearchedKeywordsCount()` -- used in 10 specs
- `getTabCountByName(name)` -- used in 10 specs
- `isFixedDate(flag)` -- used in 10 specs
- `whichConditionIsSelected()` -- used in 10 specs
- `getSearchSuggestionShortcutsItems()` -- used in 9 specs
- `inputDynamicCalenderCondition({ leftOpt, number, rightOpt, custom = false, flag = 'to' })` -- used in 9 specs
- `isSearchSuggestionDisplay()` -- used in 9 specs
- `customCredentials()` -- used in 8 specs
- `getCheckboxItemCount()` -- used in 8 specs
- `getSearchFilterDropdownPanel()` -- used in 8 specs
- `getSearchTabNames()` -- used in 8 specs
- `shareDossier()` -- used in 8 specs
- `getSearchSortDropdown()` -- used in 7 specs
- `getSearchSortSelectedText()` -- used in 7 specs
- `isMatchedContentExisted(name, item)` -- used in 7 specs
- `isSummaryTextExisted(type, text)` -- used in 7 specs
- `clearAllFilters()` -- used in 6 specs
- `clickMatchedContentTextInNewTab(name, text)` -- used in 6 specs
- `getFilterSummaryTexts()` -- used in 6 specs
- `getHightlightTexts()` -- used in 6 specs
- `getMatchContentCount(name)` -- used in 6 specs
- `isKeywordExisted(item)` -- used in 6 specs
- `openCalendarTypeSelector()` -- used in 6 specs
- `selectCalendarFilterTypeOption(name)` -- used in 6 specs
- `toBeLessThan()` -- used in 6 specs
- `clearAll()` -- used in 5 specs
- `clickTabByName(name)` -- used in 5 specs
- `log()` -- used in 5 specs
- `switchToNewWindow()` -- used in 5 specs
- `title()` -- used in 5 specs
- `addMessage()` -- used in 4 specs
- `clearAndInputAndWaitForFirstSuggestion()` -- used in 4 specs
- `clickFixedDateCheckbox(flag = 'from')` -- used in 4 specs
- `closeSearchSortBox()` -- used in 4 specs
- `execute()` -- used in 4 specs
- `findSelectorByName()` -- used in 4 specs
- `getCalendarSelectedOption()` -- used in 4 specs
- `getFilterDetailsPanel()` -- used in 4 specs
- `getHeaderTitleText(option = { popover: false })` -- used in 4 specs
- `getRecentlyViewedShortcutName()` -- used in 4 specs
- `getSearchFilterItemsCount()` -- used in 4 specs
- `getShareDossierDialog()` -- used in 4 specs
- `getSortOptionCount()` -- used in 4 specs
- `getWarningMsg()` -- used in 4 specs
- `isIncludeBMPresent()` -- used in 4 specs
- `isShareButtonEnabled()` -- used in 4 specs
- `isWarningDisplayOnApply()` -- used in 4 specs
- `openAndSelectCalendarType(option)` -- used in 4 specs
- `openDynamicCalenderConditionPicker(flag = 'from')` -- used in 4 specs
- `searchRecipient()` -- used in 4 specs
- `selectRecipients()` -- used in 4 specs
- `toggleViewSelected()` -- used in 4 specs
- `waitForDownloadComplete()` -- used in 4 specs
- `getCalendarPanel()` -- used in 3 specs
- `getIDMatchText(name)` -- used in 3 specs
- `getQuickSearchView()` -- used in 3 specs
- `isCerififiedOnlyChecked()` -- used in 3 specs
- `isFilterCountPresent()` -- used in 3 specs
- `isFilterPresent(type)` -- used in 3 specs
- `isFilterSummaryPresent(type)` -- used in 3 specs
- `isSortOptionPresent(option)` -- used in 3 specs
- `openCustomAppById()` -- used in 3 specs
- `openQuickSearchView()` -- used in 3 specs
- `selectDate(customMonth, customDay, customYear, option = { popover: false })` -- used in 3 specs
- `addFilterToFilterPanel()` -- used in 2 specs
- `clearSearchBox()` -- used in 2 specs
- `clickAuthoringCloseBtn()` -- used in 2 specs
- `clickCertifiedOnlyBtn()` -- used in 2 specs
- `clickEditButton()` -- used in 2 specs
- `clickSearchSuggestionText(index)` -- used in 2 specs
- `clickSortOption(option)` -- used in 2 specs
- `createDashboardWithDataset()` -- used in 2 specs
- `downloadDossier()` -- used in 2 specs
- `exportRSD()` -- used in 2 specs
- `exportSubmitLibrary()` -- used in 2 specs
- `getActionButtonsCount()` -- used in 2 specs
- `getBrowserAllDossierLink()` -- used in 2 specs
- `getDossierView()` -- used in 2 specs
- `getDynamicPreviewContentDate(flag)` -- used in 2 specs
- `getFilterCount()` -- used in 2 specs
- `getSearchResultsContainer()` -- used in 2 specs
- `goToHome()` -- used in 2 specs
- `inputAndWaitForFirstSuggestion()` -- used in 2 specs
- `isAuthoringCloseButtonDisplayed()` -- used in 2 specs
- `isCheckboxOptionItemsPresent()` -- used in 2 specs
- `isClearAllDisabled()` -- used in 2 specs
- `isResetPresent()` -- used in 2 specs
- `logout()` -- used in 2 specs
- `moveFilterToCanvas()` -- used in 2 specs
- `openDossier()` -- used in 2 specs
- `openDossierFromSearchSuggestion(index)` -- used in 2 specs
- `openDynamicCustomDatePicker(flag = 'from')` -- used in 2 specs
- `openExportPDFSettingsWindow()` -- used in 2 specs
- `openUserAccountMenu()` -- used in 2 specs
- `refresh()` -- used in 2 specs
- `removeItem()` -- used in 2 specs
- `run()` -- used in 2 specs
- `saveDashboard()` -- used in 2 specs
- `searchOnFilter(text)` -- used in 2 specs
- `selectAll()` -- used in 2 specs
- `setItem()` -- used in 2 specs
- `sleep()` -- used in 2 specs
- `applyInMobileView()` -- used in 1 specs
- `backInMobileView()` -- used in 1 specs
- `browserAllDossiers()` -- used in 1 specs
- `clear()` -- used in 1 specs
- `clearRencentlySearchedAndReviewed()` -- used in 1 specs
- `clickLastMonth(times, option = { popover: false })` -- used in 1 specs
- `clickLastYear(times, option = { popover: false })` -- used in 1 specs
- `clickNextMonth(times, option = { popover: false })` -- used in 1 specs
- `clickNextYear(times, option = { popover: false })` -- used in 1 specs
- `clickOptionInMobileView()` -- used in 1 specs
- `confirmRemove()` -- used in 1 specs
- `ctrlF()` -- used in 1 specs
- `deleteFilterSummaryItem(type, item)` -- used in 1 specs
- `executeScript()` -- used in 1 specs
- `getFilterApplyBtn()` -- used in 1 specs
- `getFilterDetailPanelCheckbox()` -- used in 1 specs
- `getLibraryIcon()` -- used in 1 specs
- `getMatchContentInfo()` -- used in 1 specs
- `getRecentlySearchedView()` -- used in 1 specs
- `hover()` -- used in 1 specs
- `isBackButtonPresent()` -- used in 1 specs
- `isDossierOwnerPresent()` -- used in 1 specs
- `isDossierTimePresent()` -- used in 1 specs
- `isFilterDisabled()` -- used in 1 specs
- `isSearchBarPresent()` -- used in 1 specs
- `isSortDisplay()` -- used in 1 specs
- `isViewSelectedChecked()` -- used in 1 specs
- `keepOnly(name)` -- used in 1 specs
- `openDefaultApp()` -- used in 1 specs
- `openDossierFromMatchedContent(name, index = 0)` -- used in 1 specs
- `openDossierFromRecentlyViewedByName(name)` -- used in 1 specs
- `openDossierFromSearchResults(name)` -- used in 1 specs
- `openDossierFromSearchSuggestionByName(name)` -- used in 1 specs
- `openFilterInMobileView()` -- used in 1 specs
- `openHamburgerMenu()` -- used in 1 specs
- `openSortMenu()` -- used in 1 specs
- `reload()` -- used in 1 specs
- `selectRemove()` -- used in 1 specs
- `switchCustomApp()` -- used in 1 specs
- `switchUser()` -- used in 1 specs
- `waitForEditor()` -- used in 1 specs
- `waitForItemLoading()` -- used in 1 specs
- `clickHeaderIcon(el, times)` -- used in 0 specs
- `clickMatchedContentText(name, text)` -- used in 0 specs
- `closeDynamicCalenderConditionPicker(flag = 'from')` -- used in 0 specs
- `closeDynamicCustomDatePicker(flag = 'from')` -- used in 0 specs
- `closeInfoWindow()` -- used in 0 specs
- `getHeaderTitleMonth(option = { popover: false })` -- used in 0 specs
- `getHeaderTitleYear(option = { popover: false })` -- used in 0 specs
- `getOptionsInCheckboxDetailPanelName()` -- used in 0 specs
- `getSearchFilterItemsName()` -- used in 0 specs
- `getSearchResultListItems()` -- used in 0 specs
- `getSearchResultLoadingIcon()` -- used in 0 specs
- `getSearchResultWaitingAnimation()` -- used in 0 specs
- `getTooltipText()` -- used in 0 specs
- `hoverOnCertifiedIcon(name)` -- used in 0 specs
- `hoverOnTemplateIcon(name)` -- used in 0 specs
- `inputDynamicCalendarConditionNumber(number, custom)` -- used in 0 specs
- `inputTextWithoutWait(text)` -- used in 0 specs
- `isAllTabPresent()` -- used in 0 specs
- `isMyLibraryTabPresent()` -- used in 0 specs
- `isNoResultPagePresent()` -- used in 0 specs
- `isObjectTypeIconInSearchResultsDisplayed(name)` -- used in 0 specs
- `isOptionPresentInCheckboxPanel(name)` -- used in 0 specs
- `isQuickSearchShortcutItemCoverImageGrayedOut(index)` -- used in 0 specs
- `isRunAsExcelIconPresentInSearchResults(name)` -- used in 0 specs
- `isRunAsPDFIconPresentInSearchResults(name)` -- used in 0 specs
- `isSearchIconPresent()` -- used in 0 specs
- `isSearchSuggestionObjectTypeIconDisplayed(name)` -- used in 0 specs
- `isSearchSuggestionRunAsIconDisplayed(name)` -- used in 0 specs
- `isSortDisabled()` -- used in 0 specs
- `isSortDropdownPresent()` -- used in 0 specs
- `selectDayInWidget(month, year, day, option = { popover: false })` -- used in 0 specs
- `selectDynamicCalendarCustomCondition()` -- used in 0 specs
- `selectDynamicCalenderCondition({ option, direction })` -- used in 0 specs
- `selectMonthInWidget(month, option = { popover: false })` -- used in 0 specs
- `selectYearInWidget(year, option = { popover: false })` -- used in 0 specs
- `setInputDate({ partialDate, customValue })` -- used in 0 specs
- `setUpdateTime(name, time)` -- used in 0 specs
- `waitForSearchLoading()` -- used in 0 specs
- `waitForSearchResultsContainer()` -- used in 0 specs
- `waitForSuggestionResponse()` -- used in 0 specs

## Source Coverage

- `pageObjects/search/**/*.js`
- `specs/regression/filterSearch/**/*.{ts,js}`
- `specs/regression/globalSearch/**/*.{ts,js}`
