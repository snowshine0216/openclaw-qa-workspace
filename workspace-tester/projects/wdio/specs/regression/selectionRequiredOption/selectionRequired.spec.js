import { browserWindowCustom } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

describe('AG Grid - Advanced Sort General', () => {
    let {
        dossierPage,
        libraryAuthoringPage,
        datasetsPanel,
        authoringFilters,
        baseVisualization,
        libraryPage,
        grid,
        loginPage,
        filterPanel,
        filterElement,
        baseFilter,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(browsers.params.credentials);
        await setWindowSize(browserWindowCustom);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    const dossiers = {
        projectId: '060ED74A48F4992BA084F7BF6C9A652A',
        pageId: 'K53--K46',
        dossier1: {
            id: '94545402EC4BBA4DA81504A0DBB9A076',
            name: 'Selection_Required_Dossier1',
        },
        dossier2: {
            id: '683C3AE8694BFB8B07AA49932C289F8A',
            name: 'Selection_Required_Dossier2',
        },
    };

    const TC92780 = async (
        displayStyle = 'Check Boxes',
        inCanvasDisplayStyle = 'Link Bar',
        filterCanBeEmpty = true,
        inCanvasCanBeEmpty = true,
        shouldSave = true,
        saveName = 'TC92780'
    ) => {
        // 1. Create a dossier with some attributes and metrics.
        await authoringFilters.createDossierAndImportSampleFiles();
        await datasetsPanel.addDatasetElementToVisualization('Year');
        await datasetsPanel.addDatasetElementToVisualization('Month');
        await datasetsPanel.addDatasetElementToVisualization('Airline Name');
        await datasetsPanel.addDatasetElementToVisualization('On-Time');
        await datasetsPanel.addDatasetElementToVisualization('Flights Cancelled');
        await datasetsPanel.addDatasetElementToVisualization('Flights Delayed');
        // 2. Add an attribute to Filter Panel. Verify: Elements are not shown/expand in the panel.
        await authoringFilters.addFilterToFilterPanel('Airline Name');

        await authoringFilters.selectDisplayStyleForFilterItem('Airline Name', displayStyle);

        since('Airline Name filter should be existing expected to be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getFilterLabelName('Airline Name').isExisting())
            .toBe(true);
        // 3. Open Filter Panel context menu. Verify:
        // a "Show Option for All" is checked.

        if (displayStyle !== 'Search Box') {
            await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuButton('Airline Name') });

            since(
                'Show Option for All context menu show visible on it should be #{expected}, instead we have #{actual}'
            )
                .expect(await authoringFilters.getContextMenuOptionChecked('Show Option for All').isDisplayed())
                .toBe(true);
        }
        // b "Disable clearing this filter" is not displayed on Dynamic Selection.
        await authoringFilters.openFilterContextMenu('Airline Name'); //
        await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuOption('Dynamic Selection') });

        since('disable clearing this filter option show visible on it should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getDynamicModeDisableClearingOption().isDisplayed())
            .toBe(false);
        // c Selection Required" is unchecked.
        since('Selection required context menu show visible on it should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getContextMenuOptionChecked('Selection Required').isDisplayed())
            .toBe(false);
        // 4. Uncheck "Show option for All": Value (All) will disappear in the filter panel.
        if (displayStyle !== 'Search Box') {
            await authoringFilters.clickFilterContextMenuOption('Airline Name', ['Show Option for All']);
            since('Airline Name all was disabled expected to be #{expected}, instead we have #{actual}')
                .expect(await authoringFilters.getFilterMenuItemCheckOption('Airline Name', '(All)').isExisting())
                .toBe(false);
            since('Airline Name all was enabled expected to be #{expected}, instead we have #{actual}')
                .expect(await authoringFilters.getFilterMenuItemCheckOption('Airline Name', '(All)').isExisting())
                .toBe(false);
        }
        // 5. Check "Selection Required". Verify:
        await authoringFilters.clickFilterContextMenuOption('Airline Name', ['Selection Required']);
        // a, First option will be selected by default.
        since(
            'Selection required turns on first option its checked status should be #{expected}, instead we have #{actual}'
        )
            .expect(
                await authoringFilters.checkFilterMenuItemSelectedByDisplayStyle(
                    displayStyle,
                    'Airline Name',
                    'AirTran Airways Corporation'
                )
            )
            .toBe('true');
        since(
            'Selection required disabled all option, second option status should be #{expected}, instead we have #{actual}'
        )
            .expect(
                await authoringFilters.checkFilterMenuItemSelectedByDisplayStyle(
                    displayStyle,
                    'Airline Name',
                    'American Airlines Inc.'
                )
            )
            .toBe('false');
        // b. Show option for All" is greyed out on the context menu
        await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuButton('Airline Name') });
        if (displayStyle !== 'Search Box') {
            since(
                'Selection required disabled all option, second option status should be #{expected}, instead we have #{actual}'
            )
                .expect(
                    await (
                        await authoringFilters.getFilterContextMenuOption('Show Option for All')
                    ).getAttribute('class')
                )
                .toContain('disabled');
        }
        // c. "Exclude" option is greyed out on the context menu.
        since(
            'Selection required disabled all option, second option status should be #{expected}, instead we have #{actual}'
        )
            .expect(await authoringFilters.getFilterContextMenuOption('Exclude').getAttribute('class'))
            .toContain('disabled');
        // d. "(All)" option is removed in the filter panel.
        since(
            'Selection required disables "all" option, all option existing should be #{expected}, instead we have #{actual}'
        )
            .expect(await authoringFilters.getFilterMenuItemCheckOption('Airline Name', '(All)').isExisting())
            .toBe(false);
        // e. "*" is displayed on the filter name with a tooltip "Selection Required".
        since('Selection required turns on icon, icon visibility should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getSelectionRequiredFilterPanelIcon('Airline Name').isExisting())
            .toBe(true);
        await authoringFilters.click({ elem: authoringFilters.getSelectionRequiredFilterPanelIcon('Airline Name') });
        since(
            'Selection required was hovered, tooltip content visibility should be #{expected}, instead we have #{actual}'
        )
            .expect(await authoringFilters.getTooltipContent().isDisplayed())
            .toBe(true);
        since('Selection required was hoevered, tooltip content should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getTooltipContent().getText())
            .toBe('Selection Required');
        await datasetsPanel.click({ elem: datasetsPanel.getAttributeMetric('Month') });
        // f. Uncheck the option will return no data and a warning.
        if (filterCanBeEmpty) {
            await authoringFilters.selectFilterPanelOptionByDisplayStyle(
                displayStyle,
                'Airline Name',
                'AirTran Airways Corporation'
            );
            since(
                'Selection required element is empty, icon visibility should be #{expected}, instead we have #{actual}'
            )
                .expect(
                    await (
                        await authoringFilters.getSelectionRequiredWarningFilterPanelIcon('Airline Name')
                    ).isDisplayed()
                )
                .toBe(true);
            since(
                'Selection required element is empty, empty content message visible should be #{expected}, instead we have #{actual}'
            )
                .expect(await baseVisualization.isVizEmpty('Visualization 1'))
                .toBe(true);
        }
        // 6. Uncheck  "Selection Required" and check Exclude. Verify.
        await authoringFilters.clickFilterContextMenuOption('Airline Name', ['Selection Required', 'Exclude']);
        await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuButton('Airline Name') });
        since('Exclude mode is on, selection required should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getFilterContextMenuOption('Selection Required').getAttribute('class'))
            .toContain('disabled');
        // 7. Add an ICS and add an attribute.
        await authoringFilters.createInCanvasFilter('Month');
        await authoringFilters.selectInCanvasContextOption('Month', 'Display Style', 1);
        await authoringFilters.clickDisplayStyleOption(inCanvasDisplayStyle);

        // 8. Open ICS context menu. Verify:
        const elToHoverMonth = await authoringFilters.getInCanvasAncestorContainer('Month', 1);
        await authoringFilters.hover({ elem: elToHoverMonth });

        await authoringFilters.click({ elem: authoringFilters.getThreeDotsButtonInFilterInCanvas() });
        // a. "Disable clearing this filter" is not displayed on Dynamic Selection.
        await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuOption('Dynamic Selection') });
        since(
            'selection required is off, dynamic mode disable clearing option visibility should be #{expected}, instead we have #{actual}'
        )
            .expect(await authoringFilters.getDynamicModeDisableClearingOption().isDisplayed())
            .toBe(false);
        // b. "Selection Required" is unchecked.
        since('Selection required context menu show visible on it should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getContextMenuOptionChecked('Selection Required').isDisplayed())
            .toBe(false);
        //9. Check "Selection Required". Verify:
        await authoringFilters.selectInCanvasContextOption('Month', 'Selection Required', 1);
        // a. First option will be selected by default.

        since(
            'selection required was turned on, first option selected should be #{expected}, instead we have #{actual}'
        )
            .expect(
                await authoringFilters.getInCanvasElementSelectedByDisplayStyle(
                    inCanvasDisplayStyle,
                    'Month',
                    'January'
                )
            )
            .toBe('true');
        // b. "Show option for All" is disabled

        if (displayStyle !== 'Search Box') {
            since(
                'selection required is on, fact that change option for all class should contain disabled should be #{expected}, instead we have #{actual}'
            )
                .expect(await authoringFilters.getShowOptionForAll().getAttribute('class'))
                .toContain('disabled');
        }
        // c. "Exclude" option is greyed out on the context menu.
        await authoringFilters.click({ elem: authoringFilters.getThreeDotsButtonInFilterInCanvas() });
        since(
            'Selection required disabled all option, second option status should be #{expected}, instead we have #{actual}'
        )
            .expect(await authoringFilters.getFilterContextMenuOption('Exclude').getAttribute('class'))
            .toContain('disabled');
        // d. "(All)" option is removed in the ICS Filter.
        since('Selection required is on, all option existance is expected to be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getFilterMenuItemCheckOption('Month', '(All)').isExisting())
            .toBe(false);
        // e. Uncheck the option will return no data and message "Make at least one selection."
        if (inCanvasCanBeEmpty) {
            await authoringFilters.removeInCanvasElementByDisplayStyle(inCanvasDisplayStyle, 'Month', 'January');
            since(
                'Selection required element is empty, empty content message visible should be #{expected}, instead we have #{actual}'
            )
                .expect(await baseVisualization.isVizEmpty('Visualization 1'))
                .toBe(true);
            await authoringFilters.selectInCanvasPanelFilterCheckboxOptionByDisplayStyle(
                inCanvasDisplayStyle,
                'Month',
                'January'
            );
        }
        // f. All display styles have one option selected by default except Search Box which returns no data.

        const displayStyleOptions = [
            'Check Boxes',
            'Slider',
            'Search Box',
            'Button Bar',
            'Radio Buttons',
            'Drop-down',
            'List Box',
        ];
        for (const displayStyleOption of displayStyleOptions) {
            await authoringFilters.selectInCanvasContextOption('Month', 'Display Style', 1);
            await authoringFilters.clickDisplayStyleOption(displayStyleOption);

            since(`After changing display style to ${displayStyleOption}, first option should be January`)
                .expect(await authoringFilters.getInCanvasItemCheckOption(null, 'January').isDisplayed())
                .toBe(true);
        }
        if (shouldSave) {
            await libraryAuthoringPage.saveDashboard(saveName);
        }
        await libraryAuthoringPage.goToHome();
    };

    const TC92778 = async (
        displayStyle = 'Check Boxes',
        canBeEmpty = true,
        inCanvasDisplayStyle,
        inCanvasCanBeEmpty = true
    ) => {
        const isSearchBox = inCanvasDisplayStyle === 'Search Box';
        const checkFilterElementFn = authoringFilters.checkElementByType(displayStyle);
        // Open a dossier with a mandatory filter and dynamic filter applied to Chapter and ICS.
        await libraryPage.openUrlWithPage(dossiers.projectId, dossiers.dossier1.id, dossiers.pageId);
        await dossierPage.resetDossierIfPossible();
        await dossierPage.click({ elem: dossierPage.getEditIcon() });
        await authoringFilters.switchToFilterPanel();

        await authoringFilters.selectDisplayStyleForFilterItem('Airline Name', displayStyle);
        await authoringFilters.selectDisplayStyleForFilterItem('Year', displayStyle);

        await authoringFilters.selectDisplayStyleForInCanvasItem('Origin Airport', 3, 2, inCanvasDisplayStyle);
        await authoringFilters.selectDisplayStyleForInCanvasItem('Month', 2, 1, inCanvasDisplayStyle);

        await libraryAuthoringPage.simpleSaveDashboard('TC92777');
        await libraryAuthoringPage.goToHome();
        await libraryPage.openUrlWithPage(dossiers.projectId, dossiers.dossier1.id, dossiers.pageId);
        await dossierPage.resetDossierIfPossible();
        // Open Filter menu and expand the current filter.
        await filterPanel.openFilterPanel();

        await filterPanel.clickAndNoWait({ elem: filterPanel.getFilterItemContainerByName('Airline Name') });

        await authoringFilters.selectItemOptionByDisplayStyle(displayStyle, 'American Airlines Inc.', {
            filterObjectName: 'Airline Name',
            sliderOffset: 20,
        });
        // unselect all besides one
        // a. For Mandatory Filter
        // Select some options and apply.
        await filterPanel.apply();
        // Unselect all. Error message "Make at least one selection." Apply button is greyout.
        await filterPanel.waitForElementStaleness(filterPanel.getPageLoading());

        await filterPanel.openFilterPanel();
        await filterPanel.click({ elem: filterPanel.getFilterItemContainerByName('Airline Name') });
        if (canBeEmpty) {
            await authoringFilters.selectItemOptionByDisplayStyle(displayStyle, 'American Airlines Inc.', {
                searchWord: 'a',
            });
            await authoringFilters.selectItemOptionByDisplayStyle(displayStyle, 'AirTran Airways Corporation', {
                searchWord: 'a',
            });

            since(
                'Selections were clear on selection required item, error message displayed status should be #{expected}, instead we have #{actual}'
            )
                .expect(await filterPanel.isWarningMessagePresent('Airline Name'))
                .toBe(true);
            since(
                'Selections were clear on selection required item, apply button disabled existance should be #{expected}, instead we have #{actual}'
            )
                .expect(await filterPanel.getDisabledApplyButton().isExisting())
                .toBe(true);
        }

        // Expand secondary menu for each filter. Select Reset

        if (displayStyle === 'Slider') {
            await baseFilter.click({ elem: baseFilter.getContextMenuDots('Airline Name') });
            await baseFilter.click({ elem: baseFilter.getContextMenuOption('Reset') });
        } else {
            filterElement.clickFooterButton('Reset');
        }
        // Even though there is no any wait popup, We still need to wait for reset to take place
        await browser.pause(1500);

        // Optional for search-box

        if (displayStyle === 'Slider') {
            since('Filter was resetted, it should be #{expected}, instead we have #{actual}')
                .expect(await checkFilterElementFn('AirTran Airways Corporation', 'Airline Name', true))
                .toBe(true);
        } else {
            // Default options is selected.
            since('Filter was cleared, its first checked element should be #{expected}, instead we have #{actual}')
                .expect(await checkFilterElementFn('AirTran Airways Corporation', 'Airline Name'))
                .toBe(true);
            since('Filter was cleared, its second checked element should be #{expected}, instead we have #{actual}')
                .expect(await checkFilterElementFn('American Airlines Inc.', 'Airline Name'))
                .toBe(false);
            since('Filter was cleared, its third checked element should be #{expected}, instead we have #{actual}')
                .expect(await checkFilterElementFn('Comair Inc.', 'Airline Name'))
                .toBe(false);
            since('Filter was cleared, its fourth checked element should be #{expected}, instead we have #{actual}')
                .expect(await checkFilterElementFn('Mesa Airlines Inc.', 'Airline Name'))
                .toBe(false);
        }

        // Apply
        await filterPanel.apply();
        // b. For Dynamic Filter:
        await filterPanel.openFilterPanel();
        await filterPanel.click({ elem: filterPanel.getFilterItemContainerByName('Year') });
        // Select some options and apply.
        await authoringFilters.selectItemOptionByDisplayStyle(displayStyle, '2010', {
            searchWord: '2',
            filterObjectName: 'Year',
            sliderOffset: 150,
        });
        await filterPanel.apply();
        // Unselect all. Error message " Make at least one selection.
        await filterPanel.openFilterPanel();

        await filterPanel.click({ elem: filterPanel.getFilterItemContainerByName('Year') });
        if (canBeEmpty) {
            await authoringFilters.selectItemOptionByDisplayStyle(displayStyle, '2010', { searchWord: '2' });
            await authoringFilters.selectItemOptionByDisplayStyle(displayStyle, '2009', { searchWord: '2' });

            since(
                'Selections were clear on selection required item, error message displayed status should be #{expected}, instead we have #{actual}'
            )
                .expect(await filterPanel.isWarningMessagePresent('Year'))
                .toBe(true);
        }
        // Expand secondary menu for each filter. Select Rest to First/Last N.
        await baseFilter.click({ elem: baseFilter.getContextMenuDots('Year') });
        await baseFilter.click({ elem: baseFilter.getContextMenuOption('Reset to First 1') });

        // Default options is selected.

        // Search box & Slider is exception, as there are no items after 'reset to n'
        if (displayStyle === 'Slider' || isSearchBox) {
            since('Filter was cleared, its first checked element should be #{expected}, instead we have #{actual}')
                .expect(await baseFilter.filterSelectionInfo('Year'))
                .toBe('(First 1)');
        } else {
            since('Filter was cleared, its first checked element should be #{expected}, instead we have #{actual}')
                .expect(await checkFilterElementFn('2009', 'Year'))
                .toBe(true);
            since('Filter was cleared, its second checked element should be #{expected}, instead we have #{actual}')
                .expect(await checkFilterElementFn('2010', 'Year'))
                .toBe(false);
            since('Filter was cleared, its third checked element should be #{expected}, instead we have #{actual}')
                .expect(await checkFilterElementFn('2011', 'Year'))
                .toBe(false);
        }
        // Apply
        await filterPanel.apply();
        // 3. From filter on ICS. - WE do it only for elements that can be deslected
        // a. for Mandatory Filter
        if (inCanvasCanBeEmpty) {
            await authoringFilters.removeInCanvasElementByDisplayStyle(
                inCanvasDisplayStyle,
                { name: 'Month', id: 'W67' },
                'January'
            );

            since(
                'In canvas filter was cleared, content error visibility should be #{expected}, instead we have #{actual}'
            )
                .expect(await baseVisualization.isVizEmpty('Visualization 1'))
                .toBe(true);
            const elToHover = await authoringFilters.getInCanvasAncestorContainer('Origin Airport', 1);
            const elToHoverMonth = await authoringFilters.getInCanvasAncestorContainer('Month', 1);

            await authoringFilters.hover({ elem: elToHover });

            await authoringFilters.hover({ elem: elToHoverMonth });

            await authoringFilters.click({ elem: authoringFilters.getThreeDotsButtonInFilterInCanvas(1) });
            await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuOption('Reset') });

            if (!isSearchBox) {
                await dossierPage.waitForPageLoading();
                since(
                    'In canvas filter was resetted, its first checked element should be #{expected}, instead we have #{actual}'
                )
                    .expect(
                        await authoringFilters.getInCanvasElementSelectedByDisplayStyle(
                            inCanvasDisplayStyle,
                            'Month',
                            'January'
                        )
                    )
                    .toBe('true');
                since(
                    'In canvas filter was resetted, its second checked element should be #{expected}, instead we have #{actual}'
                )
                    .expect(
                        await authoringFilters.getInCanvasElementSelectedByDisplayStyle(
                            inCanvasDisplayStyle,
                            'Month',
                            'February'
                        )
                    )
                    .toBe('false');
                since(
                    'In canvas filter was resetted, its third checked element should be #{expected}, instead we have #{actual}'
                )
                    .expect(
                        await authoringFilters.getInCanvasElementSelectedByDisplayStyle(
                            inCanvasDisplayStyle,
                            'Month',
                            'March'
                        )
                    )
                    .toBe('false');
            }

            // b. For Dynamic Filter:
            // Unselect all. Error message " Make at least one selection.
            await authoringFilters.removeInCanvasElementByDisplayStyle(
                inCanvasDisplayStyle,
                { name: 'Origin Airport', id: 'W69' },
                'IAD'
            );

            await dossierPage.waitForPageLoading();

            since(
                'In canvas filter was cleared, content error visibility should be #{expected}, instead we have #{actual}'
            )
                .expect(await baseVisualization.isVizEmpty('Visualization 1'))
                .toBe(true);
            // Open context menu: Click on "Reset to First/Last N."
            const originAirportHover = await authoringFilters.getInCanvasAncestorContainer('Origin Airport', 1);
            await authoringFilters.hover({ elem: originAirportHover });

            await authoringFilters.clickAndNoWait({ elem: authoringFilters.getThreeDotsButtonInFilterInCanvas(2) });
            await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuOption('Reset to Last 1') });

            if (!isSearchBox) {
                // Default options is selected.
                since(
                    'In canvas filter was resetted, its first checked element should be #{expected}, instead we have #{actual}'
                )
                    .expect(
                        await authoringFilters.getInCanvasElementSelectedByDisplayStyle(
                            inCanvasDisplayStyle,
                            'Origin Airport',
                            'BWI'
                        )
                    )
                    .toBe('false');
                since(
                    'In canvas filter was resetted, its second checked element should be #{expected}, instead we have #{actual}'
                )
                    .expect(
                        await authoringFilters.getInCanvasElementSelectedByDisplayStyle(
                            inCanvasDisplayStyle,
                            'Origin Airport',
                            'DCA'
                        )
                    )
                    .toBe('false');
                since(
                    'In canvas filter was resetted, its third checked element should be #{expected}, instead we have #{actual}'
                )
                    .expect(
                        await authoringFilters.getInCanvasElementSelectedByDisplayStyle(
                            inCanvasDisplayStyle,
                            'Origin Airport',
                            'IAD'
                        )
                    )
                    .toBe('true');
            }
        }
    };

    const TC92782 = async (displaystyle, inCanvasDisplayStyle) => {
        await libraryPage.openUrlWithPage(dossiers.projectId, dossiers.dossier1.id, dossiers.pageId);
        await dossierPage.resetDossierIfPossible();
        await dossierPage.click({ elem: dossierPage.getEditIcon() });
        await authoringFilters.selectDisplayStyleForFilterItem('Airline Name', displaystyle);
        await authoringFilters.selectDisplayStyleForInCanvasItem('Month', 2, 1, inCanvasDisplayStyle);
        // conditionally allow multiple selections
        if (displaystyle === 'Drop-down') {
            await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuButton('Airline Name') });
            await authoringFilters.clickFilterContextMenuOption('Airline Name', ['Allow Multiple Selections']);
            await authoringFilters.waitForCurtainDisappear();
        }
        await authoringFilters.removeInCanvasElementByDisplayStyle(
            inCanvasDisplayStyle,
            { name: 'Month', id: 'W67' },
            'January'
        );
        await authoringFilters.waitLoadingDataPopUpIsNotDisplayed();

        since(
            'Manually deselected all in canvas option, error message displayed status should be #{expected}, instead we have #{actual}'
        )
            .expect(await authoringFilters.getInCanvasEmptyWarningByDisplayStyle(inCanvasDisplayStyle, 'Month'))
            .toBe(true);

        since(
            'Manually deselected all in canvas option, viz empty status should be #{expected}, instead we have #{actual}'
        )
            .expect(await baseVisualization.isVizEmpty('Visualization 1'))
            .toBe(true);

        await authoringFilters.selectInCanvasPanelFilterCheckboxOptionByDisplayStyle(
            inCanvasDisplayStyle,
            'Month',
            'January',
            { isMultiDropdown: true, idx: 2 }
        );

        since(
            'Manually selected one option, error message displayed status should be #{expected}, instead we have #{actual}'
        )
            .expect(await authoringFilters.getInCanvasEmptyWarningByDisplayStyle(inCanvasDisplayStyle, 'Month'))
            .toBe(false);

        since('Selection required element is empty, icon visibility should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getSelectionRequiredWarningFilterPanelIcon('Airline Name').isDisplayed())
            .toBe(false);

        // Check filter panel now
        await authoringFilters.selectFilterPanelOptionByDisplayStyle(
            displaystyle,
            'Airline Name',
            'AirTran Airways Corporation',
            2
        );

        since('Selection required element is empty, icon visibility should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getSelectionRequiredWarningFilterPanelIcon('Airline Name').isDisplayed())
            .toBe(true);

        await authoringFilters.hover({
            elem: authoringFilters.getSelectionRequiredWarningFilterPanelIcon('Airline Name'),
        });

        await authoringFilters.waitForElementVisible(await authoringFilters.getTooltipContent());

        since(
            'Selection required element is empty, after hover, empty selection required tooltip should be #{expected}, instead we have #{actual}'
        )
            .expect(await authoringFilters.getTooltipContent().getText())
            .toBe('Make at least one selection.');

        await libraryAuthoringPage.goToHome();
    };

    it('TC92778 - Mandatory Filter - Configuration in Dossier Consumption - Check Boxes )', async () => {
        await TC92778('Check Boxes', true, 'Check Boxes', true, true);
    });

    it('TC92778 - Mandatory Filter - Configuration in Dossier Consumption) - Drop downs ', async () => {
        await TC92778('Drop-down', true, 'Drop-down', true);
    });

    it('TC92778 - Mandatory Filter - Configuration in Dossier Consumption) - Radio Buttons ', async () => {
        await TC92778('Radio Buttons', false, 'Radio Buttons', false);
    });

    it('TC92778 - Mandatory Filter - Configuration in Dossier Consumption) - Search Boxes', async () => {
        await TC92778('Search Box', true, 'Search Box', true);
    });

    it('TC92778 - Mandatory Filter - Configuration in Dossier Consumption) - Radio Buttons ', async () => {
        await TC92778('Radio Buttons', false, 'Radio Buttons', false);
    });

    it('TC92778 - Mandatory Filter - Configuration in Dossier Consumption) - Sliders ', async () => {
        await TC92778('Slider', false, 'Slider', false);
    });

    it('TC92778 - Mandatory Filter - Configuration in Dossier Consumption) - Radio Buttons & Link Bar', async () => {
        await TC92778('Radio Buttons', false, 'Link Bar', false);
    });

    it('TC92778 - Mandatory Filter - Configuration in Dossier Consumption) - In Canvas Button Bar', async () => {
        await TC92778('Radio Buttons', false, 'Button Bar', false);
    });

    it('TC92778 - Mandatory Filter - Configuration in Dossier Consumption) - In Canvas - List Box', async () => {
        await TC92778('Radio Buttons', false, 'List Box', false);
    });

    it('TC92780 - Chapter and in-canvas Filter FUN - Library (Mac / Windows) Authoring:.', async () => {
        await TC92780();
    });

    it('TC92785 - Chapter and in-canvas Filter FUN - Library (Mac / Windows) Authoring:. - Check Boxes', async () => {
        await TC92780('Check Boxes', 'Check Boxes', true, true, false);
    });

    it('TC92785 - Chapter and in-canvas Filter FUN - Library (Mac / Windows) Authoring:. - Drop-downs', async () => {
        await TC92780('Drop-down', 'Drop-down', true, false, false);
    });

    it('TC92785 - Chapter and in-canvas Filter FUN - Library (Mac / Windows) Authoring:. - Search Boxes', async () => {
        await TC92780('Search Box', 'Search Box', true, true, false);
    });

    it('TC92785 - Chapter and in-canvas Filter FUN - Library (Mac / Windows) Authoring:. - Sliders', async () => {
        await TC92780('Slider', 'Slider', false, false, false);
    });

    it('TC92785 - Chapter and in-canvas Filter FUN - Library (Mac / Windows) Authoring:. - In Canvas Link Bar', async () => {
        await TC92780('Radio Buttons', 'Link Bar', false, false, false);
    });

    it('TC92785 - Chapter and in-canvas Filter FUN - Library (Mac / Windows) Authoring:. - In Canvas Button Bar', async () => {
        await TC92780('Radio Buttons', 'Button Bar', false, false, false);
    });

    it('TC92785 - Chapter and in-canvas Filter FUN - Library (Mac / Windows) Authoring:. - In Canvas List Box', async () => {
        await TC92780('Radio Buttons', 'List Box', false, false, false);
    });

    it('TC92786 - Mandatory Filter - Configuration in Dossier Consumption - Check Boxes )', async () => {
        // 1. Create a dossier with some attributes and metrics.
        await authoringFilters.createDossierAndImportSampleFiles();
        await datasetsPanel.addDatasetElementToVisualization('Year');
        await datasetsPanel.addDatasetElementToVisualization('On-Time');
        await authoringFilters.createBasicCustomGroup('Year', '2009');
        await authoringFilters.switchToFilterPanel();
        await authoringFilters.addFilterToFilterPanel('Year(Group)');
        await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuButton('Year(Group)') });
        since('Custom group selection required option existance should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getFilterContextMenuOption('Selection Required').isExisting())
            .toBe(true);
        await authoringFilters.addVisualizationFilterToFilterPanel('Year');
        await authoringFilters.click({
            elem: authoringFilters.getVisualizationFilterContextMenuButton('Visualization Filter 1'),
        });
        since(
            'Visualization filter selection required option existance should be #{expected}, instead we have #{actual}'
        )
            .expect(await authoringFilters.getFilterContextMenuOption('Selection Required').isExisting())
            .toBe(false);
        await authoringFilters.createSimpleObjectSelector('Year');
        const objectSelector = await authoringFilters.getInCanvasUnitContainerWithLabel('Year(Group)');
        await authoringFilters.hoverWithoutWait({ elem: objectSelector });
        await authoringFilters.click({ elem: authoringFilters.getThreeDotsButtonInFilterInCanvas(1) });
        since(
            'Visualization filter selection required option existance should be #{expected}, instead we have #{actual}'
        )
            .expect(await authoringFilters.getFilterContextMenuOption('Selection Required').isExisting())
            .toBe(false);
        await authoringFilters.createPanelStack();
        await authoringFilters.getThreeDotsButtonInFilterInCanvas(3);
        since(
            'Visualization filter selection required option existance should be #{expected}, instead we have #{actual}'
        )
            .expect(await authoringFilters.getFilterContextMenuOption('Selection Required').isExisting())
            .toBe(false);
        await libraryAuthoringPage.goToHome();
        // TODO: check Consolidation
    });

    it('TC92782 - Mandatory Filter - Configuration in Dossier Consumption - Check Boxes )', async () => {
        await TC92782('Check Boxes', 'Check Boxes');
    });
    it('TC92782 - Mandatory Filter - Configuration in Dossier Consumption - Search Boxes )', async () => {
        await TC92782('Search Box', 'Search Box');
    });
    it('TC92782 - Mandatory Filter - Configuration in Dossier Consumption - Drop-downs )', async () => {
        await TC92782('Drop-down', 'Drop-down');
    });
    it('TC92782 - Mandatory Filter - Configuration in Dossier Consumption - Link Bars)', async () => {
        await TC92782('Check Boxes', 'Link Bar');
    });
    it('TC92782 - Mandatory Filter - Configuration in Dossier Consumption - Button bars )', async () => {
        await TC92782('Check Boxes', 'Button Bar');
    });

    it('TC92777 - Mandatory Filters - Configuration in Dossier Authoring.', async () => {
        // 1. Create a dossier with some attributes and metrics.
        await authoringFilters.createDossierAndImportSampleFiles();
        await datasetsPanel.addDatasetElementToVisualization('Year');
        await datasetsPanel.addDatasetElementToVisualization('Month');
        await datasetsPanel.addDatasetElementToVisualization('Airline Name');
        await datasetsPanel.addDatasetElementToVisualization('On-Time');
        await datasetsPanel.addDatasetElementToVisualization('Flights Cancelled');
        await datasetsPanel.addDatasetElementToVisualization('Flights Delayed');
        since('Element was created expected was #{expected}, instead we have #{actual}')
            .expect(await grid.getCellValue('Visualization 1', 3, 3))
            .toBe('45');
        // 2. Add some attributes to Filter Panel and select some options.
        await authoringFilters.switchToFilterPanel();
        await authoringFilters.addFilterToFilterPanel('Airline Name');
        since('Airline Name filter should be existing expected to be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getFilterLabelName('Airline Name').isExisting())
            .toBe(true);
        await authoringFilters.addFilterToFilterPanel('Year');
        since('Year filter should be existing expected to be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getFilterLabelName('Year').isExisting())
            .toBe(true);
        // 3. Open Filter context menu for the first attribute.
        // a. Uncheck/Check “Show Option for All”
        await authoringFilters.clickFilterContextMenuOption('Airline Name', ['Show Option for All']);
        since('Airline Name all was disabled expected to be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getFilterMenuItemCheckOption('Airline Name', '(All)').isExisting())
            .toBe(false);
        await authoringFilters.clickFilterContextMenuOption('Airline Name', ['Show Option for All']);
        since('Airline Name all was enabled expected to be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getFilterMenuItemCheckOption('Airline Name', '(All)').isExisting())
            .toBe(true);
        // b. Check Selection Required.
        await authoringFilters.clickFilterContextMenuOption('Airline Name', ['Selection Required']);
        since(
            'Selection required disables all option, all option existing should be #{expected}, instead we have #{actual}'
        )
            .expect(await authoringFilters.getFilterMenuItemCheckOption('Airline Name', '(All)').isExisting())
            .toBe(false);
        await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuButton('Airline Name') });
        since('Selection required context menu show visible on it should be #{expected}, instead we have #{actual}f')
            .expect(await authoringFilters.getContextMenuOptionChecked('Selection Required').isDisplayed())
            .toBe(true);
        // c.Select some elements.
        await authoringFilters.selectFilterPanelFilterCheckboxOption('Airline Name', 'American Airlines Inc.');
        since('Airline name checkbox checked status should be #{expected}, instead we have #{actual}')
            .expect(
                await (
                    await authoringFilters.getFilterMenuItemCheckOption('Airline Name', 'American Airlines Inc.')
                ).getAttribute('aria-checked')
            )
            .toBe('true');
        await authoringFilters.selectFilterPanelFilterCheckboxOption('Airline Name', 'Comair Inc.');
        since('Airline name checkbox checked status should be #{expected}, instead we have #{actual}')
            .expect(
                await (
                    await authoringFilters.getFilterMenuItemCheckOption('Airline Name', 'Comair Inc.')
                ).getAttribute('aria-checked')
            )
            .toBe('true');
        await authoringFilters.selectFilterPanelFilterCheckboxOption('Airline Name', 'Mesa Airlines Inc.');
        since('Airline name checkbox checked status should be #{expected}, instead we have #{actual}')
            .expect(
                await (
                    await authoringFilters.getFilterMenuItemCheckOption('Airline Name', 'Mesa Airlines Inc.')
                ).getAttribute('aria-checked')
            )
            .toBe('true');
        // 4. Open Filter context menu for the second attribute.
        await authoringFilters.selectDynamicSelectionMode('Year', 'First N', '2');
        // check selection required
        await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuButton('Year') });
        since('dynamic status was turned on sekection required status should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getContextMenuOptionChecked('Selection Required').isDisplayed())
            .toBe(true);
        // dismiss context menu
        await authoringFilters.click({ elem: authoringFilters.getSelectionRequiredFilterPanelIcon('Airline Name') });
        // 5 .Add in canvas filter
        await authoringFilters.createInCanvasFilter('Month');
        since('Month in canvas filter was created it should be be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getInCanvasFilterContainer('Month', 1).isDisplayed())
            .toBe(true);
        // 6 .Open ICS context menu.
        await authoringFilters.changeShowOptionForAll();
        since('change option for all was changed, new status should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getShowOptionForAll().getAttribute('aria-checked'))
            .toBe('false');
        await authoringFilters.changeShowOptionForAll();
        since('change option for all was changed, new status should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getShowOptionForAll().getAttribute('aria-checked'))
            .toBe('true');
        // Turn all off & on
        await authoringFilters.selectInCanvasFilterCheckboxOption('Month', '(All)');
        await authoringFilters.selectInCanvasFilterCheckboxOption('Month', '(All)');
        await authoringFilters.selectInCanvasContextOption('Month', 'Selection Required', 1);
        since(
            'selection required was turned on, first option selected should be #{expected}, instead we have #{actual}'
        )
            .expect(await authoringFilters.getInCanvasItemCheckOption('Month', 'January').getAttribute('aria-selected'))
            .toBe('true');
        since(
            'selection required was turned on, second option selected should be #{expected}, instead we have #{actual}'
        )
            .expect(
                await authoringFilters.getInCanvasItemCheckOption('Month', 'February').getAttribute('aria-selected')
            )
            .toBe('false');
        await authoringFilters.click({ elem: authoringFilters.getThreeDotsButtonInFilterInCanvas(1) });
        since('dynamic status was turned on sekection required status should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getContextMenuOptionChecked('Selection Required').isDisplayed())
            .toBe(true);
        await authoringFilters.selectInCanvasFilterCheckboxOption('Month', 'February');
        since('Year was seected, year checked status should be #{expected}, instead we have #{actual}')
            .expect(
                await authoringFilters.getInCanvasItemCheckOption('Month', 'February').getAttribute('aria-selected')
            )
            .toBe('true');
        await authoringFilters.selectInCanvasContextOption('Month', 'Display Style', 1);
        await authoringFilters.clickDisplayStyleOption('Check Boxes');
        since('Year was seected, year checked status should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getInCanvasFilteryStyle('Month', 'Check Boxes').isExisting())
            .toBe(true);
        // 7. Add Element / Value Filter and add another attribute.
        await authoringFilters.createInCanvasFilter('Origin Airport');
        await authoringFilters.selectInCanvasDynamicSelectionMode('Origin Airport', 'Last N', '2', 2);
        since('All manipulations were done, grid cell below on time should be #{expected}, instead we have #{actual}')
            .expect(await grid.getCellValue('Visualization 1', 3, 2))
            .toBe('757');
        // 8. Save Dossier
        await libraryAuthoringPage.saveDashboard('TC92777');
    });

    it('TC92781 - Chapter and in-canvas Filter FUN - Library (Mac / Windows) Consumption', async () => {
        const displayStyleUsed = 'Check Boxes';
        const checkFilterElementFn = authoringFilters.checkElementByType(displayStyleUsed);

        // Open a dossier with a mandatory filter applied to Chapter and ICS.

        await libraryPage.openUrlWithPage(dossiers.projectId, dossiers.dossier2.id, dossiers.pageId);
        await dossierPage.resetDossierIfPossible();

        // First let's set check boxes for everything
        await dossierPage.click({ elem: dossierPage.getEditIcon() });
        await authoringFilters.switchToFilterPanel();

        await authoringFilters.selectDisplayStyleForFilterItem('Airline Name', displayStyleUsed);
        await authoringFilters.selectDisplayStyleForFilterItem('Year', displayStyleUsed);

        // Set selection required to initial status

        // If below will keep failing, maybe some func
        await authoringFilters.openFilterContextMenu('Origin Airport');
        const isSelectionRequiredTurnedOn = await authoringFilters
            .getContextMenuOptionChecked('Selection Required')
            .isExisting();

        if (!isSelectionRequiredTurnedOn) {
            await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuOption('Selection Required') });
            await authoringFilters.openFilterContextMenu('Origin Airport');
        }
        await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuOption('Display Style') });
        await authoringFilters.clickDisplayStyleOption(displayStyleUsed);

        const elToHover = await authoringFilters.getInCanvasAncestorContainer('Origin Airport', 1);
        await authoringFilters.hover({ elem: elToHover });
        await authoringFilters.click({ elem: authoringFilters.getThreeDotsButtonInFilterInCanvas(2) });
        await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuOption('Display Style') });

        await authoringFilters.clickDisplayStyleOption(displayStyleUsed);
        const elToHoverMonth = await authoringFilters.getInCanvasAncestorContainer('Month', 1);
        await authoringFilters.hover({ elem: elToHoverMonth });

        await authoringFilters.click({ elem: authoringFilters.getThreeDotsButtonInFilterInCanvas(1) });
        await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuOption('Display Style') });

        await authoringFilters.clickDisplayStyleOption(displayStyleUsed);

        await libraryAuthoringPage.simpleSaveDashboard('TC92777');
        await libraryAuthoringPage.goToHome();
        await libraryPage.openUrlWithPage(dossiers.projectId, dossiers.dossier2.id, dossiers.pageId);

        await dossierPage.resetDossierIfPossible();
        // Open Filter menu and expand the current filter.
        await filterPanel.openFilterPanel();
        await filterPanel.click({ elem: filterPanel.getFilterItemContainerByName('Airline Name') });

        await since(
            'Selection required is on on filter, Select all disabled status should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterElement.isFooterButtonDisabled('Select All'))
            .toBe(true);

        await authoringFilters.selectItemOptionByDisplayStyle(displayStyleUsed, 'AirTran Airways Corporation');
        await authoringFilters.selectItemOptionByDisplayStyle(displayStyleUsed, 'American Airlines Inc.');

        await filterPanel.click({ elem: filterPanel.getFilterItemContainerByName('Year') });
        await authoringFilters.selectItemOptionByDisplayStyle(displayStyleUsed, '2009');
        await authoringFilters.selectItemOptionByDisplayStyle(displayStyleUsed, '2010');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();

        // Check initial selections
        await filterPanel.click({ elem: filterPanel.getFilterItemContainerByName('Airline Name') });
        since('Filter was changed, its first checked element should be #{expected}, instead we have #{actual}')
            .expect(await checkFilterElementFn('AirTran Airways Corporation', 'Airline Name'))
            .toBe(false);

        since('Filter was changed, its scond checked element should be #{expected}, instead we have #{actual}')
            .expect(await checkFilterElementFn('American Airlines Inc.', 'Airline Name'))
            .toBe(true);

        await filterPanel.click({ elem: filterPanel.getFilterItemContainerByName('Year') });
        since('Filter was changed, its first checked element should be #{expected}, instead we have #{actual}')
            .expect(await checkFilterElementFn('2009', 'Year'))
            .toBe(false);
        since('Filter was changed, its first checked element should be #{expected}, instead we have #{actual}')
            .expect(await checkFilterElementFn('2010', 'Year'))
            .toBe(true);

        // Reset
        await filterPanel.resetAllFilters();
        // Check selections after reset all

        since('Filter was changed, its first checked element should be #{expected}, instead we have #{actual}')
            .expect(await checkFilterElementFn('2009', 'Year'))
            .toBe(true);
        since('Filter was changed, its first checked element should be #{expected}, instead we have #{actual}')
            .expect(await checkFilterElementFn('2010', 'Year'))
            .toBe(false);

        await filterPanel.click({ elem: filterPanel.getFilterItemContainerByName('Airline Name') });
        since('Filter was changed, its first checked element should be #{expected}, instead we have #{actual}')
            .expect(await checkFilterElementFn('AirTran Airways Corporation', 'Airline Name'))
            .toBe(true);

        since('Filter was changed, its scond checked element should be #{expected}, instead we have #{actual}')
            .expect(await checkFilterElementFn('American Airlines Inc.', 'Airline Name'))
            .toBe(false);

        // Clear all the selections manually. Verify:
        since(
            'Selections were clear on selection required item, error message displayed status should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isWarningMessagePresent('Year'))
            .toBe(false);

        await filterPanel.click({ elem: filterPanel.getFilterItemContainerByName('Year') });
        await authoringFilters.selectItemOptionByDisplayStyle(displayStyleUsed, '2009');
        since(
            'Selections were clear on selection required item, error message displayed status should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isWarningMessagePresent('Year'))
            .toBe(true);
        await filterPanel.click({ elem: filterPanel.getFilterItemContainerByName('Airline Name') });
        await authoringFilters.selectItemOptionByDisplayStyle(displayStyleUsed, 'AirTran Airways Corporation');

        // Error message is displayed in the panel.

        since(
            'Selections were clear on selection required item, error message displayed status should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isWarningMessagePresent('Airline Name'))
            .toBe(true);

        // User cannot click the “Apply” button.
        since(
            'Selections were clear on selection required item, apply button disabled existance should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getDisabledApplyButton().isExisting())
            .toBe(true);

        // reset and apply
        await filterPanel.resetAllFilters();
        await filterPanel.apply();
        await authoringFilters.hover({ elem: elToHoverMonth });

        await authoringFilters.click({ elem: authoringFilters.getThreeDotsButtonInFilterInCanvas() });

        since(
            'Selections required is turn on on in canvas selector, its context reset option existance should be #{expected}, instead we have #{actual}'
        )
            .expect(await authoringFilters.getContextMenuOption('Reset').isExisting())
            .toBe(true);

        since(
            'Selections required is turn on on in canvas selector, its context include option existance should be #{expected}, instead we have #{actual}'
        )
            .expect(await authoringFilters.getContextMenuOption('Include)').isExisting())
            .toBe(false);

        since(
            'Selections required is turn on on in canvas selector, its context exclude option existance should be #{expected}, instead we have #{actual}'
        )
            .expect(await authoringFilters.getContextMenuOption('Exclude').isExisting())
            .toBe(false);

        // Disable selection required and check if clear all filters exist
        await dossierPage.click({ elem: dossierPage.getEditIcon() });
        await authoringFilters.switchToFilterPanel();
        await authoringFilters.openFilterContextMenu('Origin Airport');

        await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuOption('Selection Required') });
        await libraryAuthoringPage.simpleSaveDashboard();
        await libraryAuthoringPage.goToHome();
        await libraryPage.openUrlWithPage(dossiers.projectId, dossiers.dossier2.id, dossiers.pageId);

        // Open Filter menu and expand the current filter.
        await filterPanel.openFilterPanel();

        since(
            'one element is not selection required now, clear all filter existance should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getClearFilter().isExisting())
            .toBe(true);

        since(
            'one element is not selection required now, reset all filter existance should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getResetAllFiltersButton().isExisting())
            .toBe(false);

        await filterPanel.click({ elem: filterPanel.getFilterItemContainerByName('Origin Airport') });
        await filterPanel.clearAllFilters();

        since('Filter was cleared, its first checked element should be #{expected}, instead we have #{actual}')
            .expect(await checkFilterElementFn('BWI', 'Origin Airport'))
            .toBe(false);
        since('Filter was changed, its first checked element should be #{expected}, instead we have #{actual}')
            .expect(await checkFilterElementFn('DCA', 'Origin Airport'))
            .toBe(false);
        since('Filter was changed, its first checked element should be #{expected}, instead we have #{actual}')
            .expect(await checkFilterElementFn('IAD', 'Origin Airport'))
            .toBe(false);

        since(
            'Selections were clear on standard item, error message displayed status should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isWarningMessagePresent('Origin Airport'))
            .toBe(false);
    });
});
