import { AGGridNumberFormatting, AGGridHideShowNull, AGGrid_WeirdValues, gridUser } from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import DatasetPanel from '../../../pageObjects/authoring/DatasetPanel.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Modern (AG) grid number formatting', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const {
        loginPage,
        libraryPage,
        dossierAuthoringPage,
        loadingDialog,
        datasetsPanel,
        editorPanel,
        agGridVisualization,
        editorPanelForGrid,
        microchartConfigDialog,
        contentsPanel,
        baseContainer,
        moreOptions,
        vizPanelForGrid,
    } = browsers.pageObj1;
    const dsPanel = new DatasetPanel();

    beforeAll(async () => {
        await loginPage.login(gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    it('[TC80450] Validating enabling, moving attribute forms in AG Grid | Acceptance', async () => {
        // Open dossier in editr mode
        await libraryPage.editDossierByUrl({
            projectId: AGGridNumberFormatting.project.id,
            dossierId: AGGridNumberFormatting.id,
        });

        // 1. verify "Number Format" option is showing up from Dataset panel and editor panel drop zones, but not the metric header on Ag grid
        // Dataset part
        await datasetsPanel.rightClickAttributeMetricByName('Airline Name');
        const menuOptionTexts = await datasetsPanel.getMenuOptions().map(async (elem) => await elem.getText());
        await since('The "Number Format" option should not be displayed in the context menu')
            .expect(menuOptionTexts)
            .not.toContain('Number Format');
        await agGridVisualization.clickContainer('Visualization 1'); // Cancel the context menu

        await datasetsPanel.rightClickAttributeMetricByName('Number of Flights');
        const numberFormatMenuOption2 = await datasetsPanel.getMenuOption('Number Format');
        await since('The "Number Format" option should be displayed in the context menu')
            .expect(numberFormatMenuOption2)
            .toBeDefined();
        await agGridVisualization.clickContainer('Visualization 1');

        // Editor part
        await editorPanel.switchToEditorPanel();
        const objectInDropZone = await editorPanelForGrid.getObjectInDropZone('Number of Flights', 'Columns');
        await dossierAuthoringPage.rightClick({ elem: objectInDropZone });
        await since(
            'The "Number Format" option is expected to be displayed in the context menu of the selected element'
        )
            .expect(await editorPanelForGrid.getContextMenuOption('Number Format').isDisplayed())
            .toBeTrue();
        await agGridVisualization.clickContainer('Visualization 1');

        const objectInDropZone2 = await editorPanelForGrid.getObjectInDropZone(
            'Flights Delayed Trend by Origin Airport',
            'Columns'
        );
        await dossierAuthoringPage.rightClick({ elem: objectInDropZone2 });
        await since(
            'The "Number Format" option is expected to not be displayed in the context menu of the selected element'
        )
            .expect(await editorPanelForGrid.getContextMenuOption('Number Format').isDisplayed())
            .toBeFalse();
        await agGridVisualization.clickContainer('Visualization 1');

        // metric column header on Ag grid
        await agGridVisualization.RMConColumnHeaderElement('Number of Flights', 'Visualization 1');
        await since(
            'The "Number Format" option is expected to be displayed in the context menu of the selected element'
        )
            .expect(await agGridVisualization.getContextMenuItem('Number Format').isDisplayed())
            .toBeTrue();
        await dossierAuthoringPage.clickTopLeftCorner();

        await agGridVisualization.RMConColumnHeaderElement(
            'Flights Delayed Trend by Origin Airport',
            'Visualization 1'
        );
        await since(
            'The "Number Format" option is expected to be displayed in the context menu of the selected element'
        )
            .expect(await agGridVisualization.getContextMenuItem('Number Format'))
            .toBeDefined();
        await dossierAuthoringPage.clickTopLeftCorner();

        // 2. change number format for metrics
        // 2.1 fixed --> from dataset panel
        await datasetsPanel.rightClickAttributeMetricByName('Number of Flights');
        await datasetsPanel.actionOnMenu('Number Format');
        const nfsShortcutsIcon = await agGridVisualization.visualizationForGrid.getNfShortcutsIcon('fixed');
        await dossierAuthoringPage.clickOnElement(nfsShortcutsIcon);
        await agGridVisualization.clickOnElementByInjectingScript(
            await agGridVisualization.common.getContextMenuButton('OK')
        );
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "3" should have text "22,381.00", instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellByPosition(2, 3, 'Visualization 1').getText())
            .toBe('22,381.00');
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "4" should have text "68,257.42", instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('68,257.42');
        // Decrease decimal places
        await datasetsPanel.rightClickAttributeMetricByName('Number of Flights');
        await datasetsPanel.actionOnMenu('Number Format');
        const nfDecimalMoverBtn = await agGridVisualization.visualizationForGrid.getNfDecimalMoverBtn('left');
        await dossierAuthoringPage.clickOnElement(nfDecimalMoverBtn);
        // Set thousand separator
        await dossierAuthoringPage.clickOnElement(
            await agGridVisualization.visualizationForGrid.getNfThousandSeparator()
        );
        await agGridVisualization.clickOnElementByInjectingScript(
            await agGridVisualization.common.getContextMenuButton('OK')
        );
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "3" should have text "22381.000", instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellByPosition(2, 3, 'Visualization 1').getText())
            .toBe('22381.000');
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "4" should have text "68,257.42", instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('68,257.42');

        // 2.2 currency --> from dataset panel
        await datasetsPanel.rightClickAttributeMetricByName('Number of Flights');
        await datasetsPanel.actionOnMenu('Number Format');
        await agGridVisualization.visualizationForGrid.clickNfShortcutIcon('$');
        await expect(
            await agGridVisualization.visualizationForGrid.getNfCurrencySymbolPulldown().isDisplayed()
        ).toBeTrue();
        await expect(
            await agGridVisualization.visualizationForGrid.getNfCurrencyPositionPulldown().isDisplayed()
        ).toBeTrue();
        await agGridVisualization.clickOnElementByInjectingScript(
            await agGridVisualization.common.getContextMenuButton('OK')
        );
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "3" should have text "$22,381.000", instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellByPosition(2, 3, 'Visualization 1').getText())
            .toBe('$22,381.000');
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "4" should have text "68,257.42", instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('68,257.42');

        await datasetsPanel.rightClickAttributeMetricByName('Number of Flights');
        await datasetsPanel.actionOnMenu('Number Format');
        await agGridVisualization.visualizationForGrid.selectNfCurrencySymbolFromDropdown('€');
        await agGridVisualization.visualizationForGrid.moveNfDecimalPlace('decrease', 1);
        await agGridVisualization.visualizationForGrid.selectNfCurrencyPositionFromDropdown('Right with space');
        await agGridVisualization.clickOnElementByInjectingScript(
            await agGridVisualization.common.getContextMenuButton('OK')
        );
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "3" should have text "22,381.00 €", instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellByPosition(2, 3, 'Visualization 1').getText())
            .toBe('22,381.00 €');
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "4" should have text "68,257.42", instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('68,257.42');

        // 2.3 percentage --> from dataset panel
        await datasetsPanel.rightClickAttributeMetricByName('Avg Delay (min)');
        await datasetsPanel.actionOnMenu('Number Format');
        await agGridVisualization.visualizationForGrid.clickNfShortcutIcon('%');
        await agGridVisualization.visualizationForGrid.moveNfDecimalPlace('decrease', 2);
        await agGridVisualization.clickOnElementByInjectingScript(
            await agGridVisualization.common.getContextMenuButton('OK')
        );
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "3" should have text "22,381.00 €", instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellByPosition(2, 3, 'Visualization 1').getText())
            .toBe('22,381.00 €');
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "4" should have text "6825742%", instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('6825742%');

        // 2.4 date format + undo/redo --> from dataset panel
        await datasetsPanel.rightClickAttributeMetricByName('Avg Delay (min)');
        await datasetsPanel.actionOnMenu('Number Format');
        await agGridVisualization.visualizationForGrid.selectNumberFormatFromDropdown('Date');
        await since('The value format drop down should be displayed in the Number Format context menu')
            .expect(await agGridVisualization.visualizationForGrid.getNfValueFormatPulldown().isDisplayed())
            .toBe(true);
        await agGridVisualization.visualizationForGrid.selectNfValueFormatFromDropdown('4/16/2020');
        await agGridVisualization.clickOnElementByInjectingScript(
            await agGridVisualization.common.getContextMenuButton('OK')
        );
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "3" should have text "22,381.00 €", instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellByPosition(2, 3, 'Visualization 1').getText())
            .toBe('22,381.00 €');
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "4" should have text "11/16/2086", instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('11/16/2086');
        // Undo
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "4" should have text "6825742%", instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('6825742%');
        // Redo
        await dossierAuthoringPage.actionOnToolbar('Redo');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "4" should have text "11/16/2086", instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('11/16/2086');

        // 2.5 time --> from dataset panel
        // const objectInDropZone = await editorPanelForGrid.getObjectInDropZone('Number of Flights', 'Columns');
        // await dossierAuthoringPage.rightClick({ elem: objectInDropZone });
        await agGridVisualization.visualizationForGrid.selectContextMenuOptionFromObjectinDZ(
            'Avg Delay (min)',
            'Columns',
            'Number Format'
        );
        await agGridVisualization.visualizationForGrid.selectNumberFormatFromDropdown('Time');
        await since('The value format drop down should be displayed in the Number Format context menu')
            .expect(await agGridVisualization.visualizationForGrid.getNfValueFormatPulldown().isDisplayed())
            .toBe(true);
        await agGridVisualization.visualizationForGrid.selectNfValueFormatFromDropdown('3:41 PM');
        await agGridVisualization.visualizationForGrid.moveNfDecimalPlace('increase', 5);
        await agGridVisualization.clickOnElementByInjectingScript(
            await agGridVisualization.common.getContextMenuButton('OK')
        );
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "3" should have text "22,381.00 €", instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellByPosition(2, 3, 'Visualization 1').getText())
            .toBe('22,381.00 €');
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "4" should have text "10:11 AM", instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('10:11 AM');

        // 2.6 fraction --> from dataset panel
        await agGridVisualization.visualizationForGrid.selectContextMenuOptionFromObjectinDZ(
            'Avg Delay (min)',
            'Columns',
            'Number Format'
        );
        await agGridVisualization.visualizationForGrid.selectNumberFormatFromDropdown('Fraction');
        await since('The value format drop down is expected to be displayed in the Number Format context menu')
            .expect(await agGridVisualization.visualizationForGrid.getNfValueFormatPulldown().isDisplayed())
            .toBe(true);
        await agGridVisualization.visualizationForGrid.selectNfValueFormatFromDropdown('37/3');
        await agGridVisualization.visualizationForGrid.moveNfDecimalPlace('increase', 2);
        await agGridVisualization.visualizationForGrid.clickContextMenuButton('OK');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since('The grid cell in ag-grid "Visualization 1" at "2", "3" is expected to have text "22,381.00 €"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 3, 'Visualization 1').getText())
            .toBe('22,381.00 €');
        await since('The grid cell in ag-grid "Visualization 1" at "2", "4" is expected to have text "477802/7"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('477802/7');

        // 2.7 scientific --> from dataset panel
        await agGridVisualization.visualizationForGrid.selectContextMenuOptionFromObjectinDZ(
            'Avg Delay (min)',
            'Columns',
            'Number Format'
        );
        await agGridVisualization.visualizationForGrid.selectNumberFormatFromDropdown('Scientific');
        await agGridVisualization.visualizationForGrid.moveNfDecimalPlace('increase', 1);
        await agGridVisualization.visualizationForGrid.clickContextMenuButton('OK');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "3" should have text "22,381.00 €", instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellByPosition(2, 3, 'Visualization 1').getText())
            .toBe('22,381.00 €');
        await since(
            'The grid cell in ag-grid "Visualization 1" at "2", "4" should have text "6.8E+04", instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('6.8E+04');

        // 2.8 custom --> from dataset panel, then add the metric to Ag grid, add a microchart that contains the formatted metric
        await datasetsPanel.rightClickAttributeMetricByName('Flights Delayed');
        await datasetsPanel.actionOnMenu('Number Format');
        await agGridVisualization.visualizationForGrid.selectNumberFormatFromDropdown('Custom');
        await agGridVisualization.visualizationForGrid.clickNfCondense();
        await agGridVisualization.visualizationForGrid.moveNfDecimalPlace('increase', 1);
        await agGridVisualization.visualizationForGrid.clickContextMenuButton('OK');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await dsPanel.addObjectToVizByDoubleClick('Flights Delayed', 'metric', 'airline-sample-data.xls');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since('The editor panel should have "metric" named "Flights Delayed" on "Columns" section')
            .expect(await editorPanel.getObjectFromSection('Flights Delayed', 4, 'Columns').isDisplayed())
            .toBe(true);
        await since('the grid cell in ag-grid "Visualization 1" at "2", "5" has text "9.5K"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 5, 'Visualization 1').getText())
            .toBe('9.5K');

        // Add case for DE327706, input customzied number format
        await datasetsPanel.rightClickAttributeMetricByName('Flights Delayed');
        await datasetsPanel.actionOnMenu('Number Format');
        await agGridVisualization.visualizationForGrid.selectNumberFormatFromDropdown('Custom');
        await vizPanelForGrid.inputNfCustomTextBox('#,###');
        await agGridVisualization.visualizationForGrid.clickContextMenuButton('OK');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since('the grid cell in ag-grid "Visualization 1" at "2", "5" has text "9,461", while we get #{actual}')
            .expect(await agGridVisualization.getGridCellByPosition(2, 5, 'Visualization 1').getText())
            .toBe('9,461');

        // When I add a new microchart set to the ag-grid
        await agGridVisualization.addMicrochartSet();
        await microchartConfigDialog.selectType('Trend Bars');
        await microchartConfigDialog.selectObject(1, 'Flights Delayed');
        await since(
            'the object named "Flights Delayed" is selected from pulldown at position "1" in the microchart config dialog'
        )
            .expect(await microchartConfigDialog.getObjectPulldownSelection(1).getText())
            .toBe('Flights Delayed');
        await microchartConfigDialog.selectObject(2, 'Origin Airport');
        await since(
            'the object named "Origin Airport" is selected from pulldown at position "2" in the microchart config dialog'
        )
            .expect(await microchartConfigDialog.getObjectPulldownSelection(2).getText())
            .toBe('Origin Airport');

        // Then the microchart is named "Flights Delayed Comparison by Origin Airport" in the microchart config dialog
        await microchartConfigDialog
            .getNameInputFieldWithText('Flights Delayed Comparison by Origin Airport')
            .waitForDisplayed();
        await microchartConfigDialog.confirmDialog();
        // Then The editor panel should have microchart with type "Trend Bars" named "Flights Delayed Comparison by Origin Airport" on "Flights Delayed Comparison by Origin Airport" section
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since(
            'The editor panel should have microchart with type "Trend Bars" named "Flights Delayed Comparison by Origin Airport" on "Flights Delayed Comparison by Origin Airport" section'
        )
            .expect(
                await editorPanel
                    .getObjectFromSection(
                        'Flights Delayed Comparison by Origin Airport',
                        'mc',
                        'Flights Delayed Comparison by Origin Airport'
                    )
                    .isDisplayed()
            )
            .toBe(true);
    });

    it('[TC5487] Hide/Show Null or Zero for Grid', async () => {
        // #Dossier location: New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Number Format > Hide/Show Null or Zero
        // When I open dossier by its ID "6DDE7C6411EAB4BE76E70080EFD50D21"
        await libraryPage.editDossierByUrl({
            projectId: AGGridHideShowNull.project.id,
            dossierId: AGGridHideShowNull.id,
        });
        // When I switch to page "Normal Grid" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Normal Grid' });
        // And I change visualization "Normal Grid 1" to "Grid (Modern)" from context menu
        await baseContainer.changeViz('Grid (Modern)', 'Normal Grid 1', true);
        // Then the grid cell in ag-grid "Normal Grid 1" at "1", "0" has text "Admin Services"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "1", "0" should be #{expected},instead we have #{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 0, 'Normal Grid 1'))
            .toBe('Admin Services');
        // And the grid cell in ag-grid "Normal Grid 1" at "1", "2" has text "1/31/2015"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "1", "2" should be #{expected},instead we have #{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 2, 'Normal Grid 1'))
            .toBe('1/31/2015');
        // And the grid cell in ag-grid "Normal Grid 1" at "1", "3" has text ""
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "1", "3" should be #{expected},instead we have #{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 3, 'Normal Grid 1'))
            .toBe('');
        // Then the grid cell in ag-grid "Normal Grid 1" at "4", "0" has text "Analytic Services"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "4", "0" should be #{expected},instead we have #{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(4, 0, 'Normal Grid 1'))
            .toBe('Analytic Services');
        // And the grid cell in ag-grid "Normal Grid 1" at "5", "2" has text "2/1/2015"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "5", "2" should be #{expected},instead we have #{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(5, 2, 'Normal Grid 1'))
            .toBe('2/1/2015');
        // And the grid cell in ag-grid "Normal Grid 1" at "5", "3" has text "0"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "5", "3" should be #{expected},instead we have #{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(5, 3, 'Normal Grid 1'))
            .toBe('0');

        // Then the grid cell in ag-grid "Normal Grid 1" at "10", "0" has text "Analytics Web"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "10", "0" should be #{expected},instead we have #{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(10, 0, 'Normal Grid 1'))
            .toBe('Analytics Web');
        // And the grid cell in ag-grid "Normal Grid 1" at "11", "2" has text "2/1/2015"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "11", "2" should be #{expected},instead we have #{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(11, 2, 'Normal Grid 1'))
            .toBe('2/1/2015');
        // And the grid cell in ag-grid "Normal Grid 1" at "11", "3" has text "1"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "11", "3" should be #{expected},instead we have #{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(11, 3, 'Normal Grid 1'))
            .toBe('1');

        // # step 2: Click on More Options
        // When I open the More Options dialog for the visualization "Normal Grid 1" through the visualization context menu
        await agGridVisualization.openMoreOptionsDialog('Normal Grid 1');
        // Then Current Hide metric nulls and zeros is set to "Show both nulls and zeros"
        await since('Current Hide metric nulls and zeros is set to #{expected}, instead we have #{actual}')
            .expect(await moreOptions.getCurrentHideMetricNullZerosSetting().getText())
            .toBe('Show both nulls and zeros');

        // # step 3: Hide both nulls and zeros
        // When I select "Hide both nulls and zeros" from Hide metric nulls and zeros pull down list in More Options dialog
        await moreOptions.selectHideShowNullZerosOption('Hide both nulls and zeros');
        // And I save and close More Options dialog
        await moreOptions.saveAndCloseMoreOptionsDialog();

        // # Admin Services and other cells were hidden
        // Then the grid cell in ag-grid "Normal Grid 1" at "1", "0" has text "Analytics Web"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "1", "0" should be #{expected},instead we have #{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 0, 'Normal Grid 1'))
            .toBe('Analytics Web');
        // And the grid cell in ag-grid "Normal Grid 1" at "1", "2" has text "2/1/2015"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "1", "2" should be #{expected},instead we have #{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 2, 'Normal Grid 1'))
            .toBe('2/1/2015');
        // And the grid cell in ag-grid "Normal Grid 1" at "1", "3" has text "1"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "1", "3" should be #{expected},instead we have #{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 3, 'Normal Grid 1'))
            .toBe('1');

        // # step 4: Hide nulls only
        // When I open the More Options dialog for the visualization "Normal Grid 1" through the visualization context menu
        await agGridVisualization.openMoreOptionsDialog('Normal Grid 1');
        // And I select "Hide nulls only" from Hide metric nulls and zeros pull down list in More Options dialog
        await moreOptions.selectHideShowNullZerosOption('Hide nulls only');
        // And I save and close More Options dialog
        await moreOptions.saveAndCloseMoreOptionsDialog();

        // Then the grid cell in ag-grid "Normal Grid 1" at "1", "0" has text "Analytic Services"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "1", "0" should be #{expected},instead we have #{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 0, 'Normal Grid 1'))
            .toBe('Analytic Services');
        // And the grid cell in ag-grid "Normal Grid 1" at "1", "2" has text "2/1/2015"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "1", "2" should be #{expected},instead we have #{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 2, 'Normal Grid 1'))
            .toBe('2/1/2015');
        // And the grid cell in ag-grid "Normal Grid 1" at "1", "3" has text "0"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "1", "3" should be #{expected},instead we have #{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 3, 'Normal Grid 1'))
            .toBe('0');

        // Then the grid cell in ag-grid "Normal Grid 1" at "5", "0" has text "Analytics Web"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "5", "0" should be #{expected},instead we have #{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(5, 0, 'Normal Grid 1'))
            .toBe('Analytics Web');
        // And the grid cell in ag-grid "Normal Grid 1" at "6", "2" has text "2/1/2015"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "6", "2" should be #{expected},instead we have #{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(6, 2, 'Normal Grid 1'))
            .toBe('2/1/2015');
        // And the grid cell in ag-grid "Normal Grid 1" at "6", "3" has text "1"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "6", "3" should be #{expected},instead we have #{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(6, 3, 'Normal Grid 1'))
            .toBe('1');

        // # step 5: Hide zeros only
        // When I open the More Options dialog for the visualization "Normal Grid 1" through the visualization context menu
        await agGridVisualization.openMoreOptionsDialog('Normal Grid 1');
        // And I select "Hide zeros only" from Hide metric nulls and zeros pull down list in More Options dialog
        await moreOptions.selectHideShowNullZerosOption('Hide zeros only');
        // And I save and close More Options dialog
        await moreOptions.saveAndCloseMoreOptionsDialog();

        // Then the grid cell in ag-grid "Normal Grid 1" at "1", "0" has text "Admin Services"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "1", "0" should be #{expected},instead we have #{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 0, 'Normal Grid 1'))
            .toBe('Admin Services');
        // And the grid cell in ag-grid "Normal Grid 1" at "1", "2" has text "1/31/2015"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "1", "2" should be #{expected},instead we have #{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 2, 'Normal Grid 1'))
            .toBe('1/31/2015');
        // And the grid cell in ag-grid "Normal Grid 1" at "1", "3" has text ""
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "1", "3" should be #{expected},instead we have #{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(1, 3, 'Normal Grid 1'))
            .toBe('');

        // Then the grid cell in ag-grid "Normal Grid 1" at "6", "0" has text "Analytics Web"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "6", "0" should be #{expected},instead we have #{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(6, 0, 'Normal Grid 1'))
            .toBe('Analytics Web');
        // And the grid cell in ag-grid "Normal Grid 1" at "6", "2" has text "2/1/2015"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "6", "2" should be #{expected},instead we have #{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(6, 2, 'Normal Grid 1'))
            .toBe('2/1/2015');
        // And the grid cell in ag-grid "Normal Grid 1" at "6", "3" has text "1"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "6", "3" should be #{expected},instead we have #{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(6, 3, 'Normal Grid 1'))
            .toBe('1');
    });

    it('[BCIN-6594] Weird values instead of null values are displayed in a Grid (Modern) dashboard ', async () => {
        // #Dossier location: New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > Defects > GECO almacenes Soporte
        // When I open dossier by its ID "97ED750D0E41FDDF3205CD9112D62641"
        await libraryPage.editDossierByUrl({
            projectId: AGGrid_WeirdValues.project.id,
            dossierId: AGGrid_WeirdValues.id,
        });
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(1, 0, 'Visualization 1'));
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'BCIN-6594_1',
            'Checking the expanded row with null values');
    });
});
