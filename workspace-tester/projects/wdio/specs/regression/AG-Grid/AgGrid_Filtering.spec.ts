import setWindowSize from '../../../config/setWindowSize.js';
import { AGGrid_AdvancedFilter, AGGridFiltering, gridUser } from '../../../constants/grid.js';
import { SelectTargetInLayersPanel } from '../../../pageObjects/authoring/SelectTargetInLayersPanel.js';
import { FilterPanel } from '../../../pageObjects/dossierEditor/FilterPanel.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Modern (AG) grid Filtering', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const {
        loginPage,
        libraryPage,
        agGridVisualization,
        dossierAuthoringPage,
        baseContainer,
        advancedFilter,
        inCanvasSelector_Authoring,
        layerPanel,
        toolbar,
        loadingDialog,
    } = browsers.pageObj1;

    const filterPanel = new FilterPanel();
    const selectTargetInLayersPanel = new SelectTargetInLayersPanel();

    beforeAll(async () => {
        await loginPage.login(gridUser);
        await setWindowSize(browserWindow);
        agGridVisualization.containerNameMatchMethod = 'exact';
    });

    afterAll(async () => {
        agGridVisualization.containerNameMatchMethod = 'contains';
    });

    afterEach(async () => {});

    it('[TC71095] Validating enabling, moving attribute forms in AG Grid', async () => {
        await libraryPage.editDossierByUrl({
            projectId: AGGridFiltering.project.id,
            dossierId: AGGridFiltering.id,
        });

        // Then The Dossier Editor is displayed
        // await since('Dossier Editor should be displayed').expect(dossierAuthoringPage.isDossierEditorDisplayed()).toBe(true);

        // When I click on container "Grid2" to select it
        await agGridVisualization.clickContainer('Grid2');

        // And I open advanced filter editor for "Grid2" by clicking visualization context menu and clicking Edit Filter
        await advancedFilter.openAdvancedFilterEditor('Grid2');
        await dossierAuthoringPage.sleep(1000);

        // And I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();

        // And I choose attribute "Year" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Year');

        // And I select "In List" radio button
        await advancedFilter.selectInListOrNotInList('In List');

        // And I select elements "2020,2021" from the element list in the Advanced Filter Editor
        await advancedFilter.doElementSelectionForAttributeFilter(['2020', '2021']);

        // Then I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();

        // When I open "Opportunity Age Trend by Industry" advanced filter editor by clicking its button
        await advancedFilter.changeToAnotherColumnSetAdvancedFilterEditor('Opportunity Age Trend by Industry');
        // And I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();

        // And I choose metric "Opportunity Age" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Opportunity Age');

        // And I select by value "Less than" as the metric filter operator
        await advancedFilter.selectMetricFilterOperatorByValue('Less than');

        // And I type "10" for Value input
        await advancedFilter.typeValueInput('10');

        // Then I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();

        // When I open "Product ($) Comparison by Industry" advanced filter editor by clicking its button
        await advancedFilter.changeToAnotherColumnSetAdvancedFilterEditor('Product ($) Comparison by Industry');

        // And I click New Qualification Button to open New Qualification editor
        await advancedFilter.openNewQualificationEditor();

        // And I choose attribute "Industry" as object from Based On dropdown
        await advancedFilter.selectObjectFromBasedOnDropdown('Industry');

        // And I select "Not In List" radio button
        await advancedFilter.selectInListOrNotInList('Not In List');

        // And I select elements "Automotive,Consulting,Education,Finance" from the element list in the Advanced Filter Editor
        await advancedFilter.doElementSelectionForAttributeFilter(['Automotive', 'Consulting', 'Education', 'Finance']);
        // Then I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();

        // When I click Save to save the change and close advanced filter editor
        await advancedFilter.clickSaveOnAdvancedFilterEditor();

        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // Then the grid cell in ag-grid "Grid2" at "2", "2" has text ""
        const cellText1 = await agGridVisualization.getGridCellByPosition(2, 3, 'Grid2').getText();
        await since('Grid cell in ag-grid "Grid2" at "2", "2" should have "", instead we have ' + cellText1)
            .expect(cellText1)
            .toBe('');

        // And the grid cell in ag-grid "Grid2" at "3", "2" has text ""
        const cellText2 = await agGridVisualization.getGridCellByPosition(3, 3, 'Grid2').getText();
        await since('Grid cell in ag-grid "Grid2" at "3", "2" should have "", instead we have ' + cellText2)
            .expect(cellText2)
            .toBe('');

        // And the grid cell in ag-grid "Grid2" at "4", "2" has text ""
        const cellText3 = await agGridVisualization.getGridCellByPosition(4, 3, 'Grid2').getText();
        await since('Grid cell in ag-grid "Grid2" at "4", "2" should have "", instead we have ' + cellText3)
            .expect(cellText3)
            .toBe('');

        // When I create a new element filter
        await inCanvasSelector_Authoring.createNewElementFilter();

        // Then Dossier should have an ElementOrValue filter-box at index "0"
        await inCanvasSelector_Authoring.checkForEleOrValueFilterBox(1);

        // When I drag "group" named "Region(Group)" from dataset "Accounts (office-royale-sales.xlsx) Forecast (offi... (3 tables)" into element filter "0"
        await inCanvasSelector_Authoring.dragDSObjectToSelector(
            'group',
            'Region(Group)',
            'Accounts (office-royale-sales.xlsx) Forecast (offi... (3 tables)',
            '1'
        );

        // Then A select target button appears on the selector "Region(Group)"
        await inCanvasSelector_Authoring.checkPresenceOfSelectTrgtBtn('Region(Group)');

        // When I select following visualization "Grid3" as targets for selector "Region(Group)"
        await inCanvasSelector_Authoring.selectTargetVizFromWithinSelector('Grid3', 'Region(Group)');

        // And I select following elements "(All),NAM-LATAM,LATAM" in selector "Region(Group)"
        await inCanvasSelector_Authoring.checkElementList('Region(Group)', '(All),NAM-LATAM,LATAM');

        // Then the grid cell in ag-grid "Grid3" at "2", "1" has text "NAM-LATAM"
        await since(
            'the grid cell in ag-grid "Grid3" at "2", "1" should have text "NAM-LATAM", instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellByPosition(3, 2, 'Grid3').getText())
            .toBe('NAM-LATAM');

        // And the grid cell in ag-grid "Grid3" at "3", "1" has text "LATAM"
        await since('the grid cell in ag-grid "Grid3" at "3", "1" should have text "LATAM", instead we have #{actual}')
            .expect(await agGridVisualization.getGridCellByPosition(4, 2, 'Grid3').getText())
            .toBe('LATAM');

        // And the grid cell in ag-grid "Grid3" at "2", "2" has text "$1,810,000"
        await since(
            'the grid cell in ag-grid "Grid3" at "2", "2" should have text "$1,810,000", instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellByPosition(3, 3, 'Grid3').getText())
            .toBe('$1,810,000');

        // When I switch to Filter Panel tab
        await filterPanel.switchToFilterPanel();

        // When I add "Forecast ($)" into Filter Panel from Add Filter menu
        await filterPanel.addFromAddFilters('Forecast ($)');

        // // When I set the metric slider selector "Forecast ($)" range from "default" to "2500000" in the Filter Panel
        await filterPanel.metricSliderSelector('Forecast ($)', 'default', '2500000');

        // // And The ag-grid "Grid1" should have 6 rows of data
        await since('The ag-grid "Grid1" should have 6 rows of data, instead we have #{actual}')
            .expect(await agGridVisualization.getAllAgGridObjectCount('Grid1'))
            .toBe(6);

        // // And The ag-grid "Grid2" should have 16 rows of data
        await since('The ag-grid "Grid2" should have 16 rows of data, instead we have #{actual}')
            .expect(await agGridVisualization.getAllAgGridObjectCount('Grid2'))
            .toBe(16);
        // // And The ag-grid "Grid3" should have 4 rows of data
        await since('The ag-grid "Grid3" should have 4 rows of data, instead we have #{actual}')
            .expect(await agGridVisualization.getAllAgGridObjectCount('Grid3'))
            .toBe(4);

        // // When I click on the context menu of "Grid1"
        await agGridVisualization.openContextMenu('Grid1');

        // // And I select option "Select Target Visualizations" from the context menu
        await agGridVisualization.selectContextMenuOption('Select Target Visualizations');

        // // Then A select source button appears on the Viz "Grid1"
        await selectTargetInLayersPanel.getSourceButton('Grid1').waitForDisplayed();

        // // And A source icon appears on the viz "Grid1" in layers panel
        await since('A source icon appears on the viz "Grid1" in layers panel')
            .expect(await selectTargetInLayersPanel.getSourceIconInLayersPanel('Grid1').isDisplayed())
            .toBe(true);

        // // When I click on container "Grid4" to select it
        await baseContainer.clickContainer('Grid4');

        // // Then A target button appears on the viz "Grid4"
        await selectTargetInLayersPanel.getTargetButton('Grid4').waitForDisplayed();

        // // And A target icon appears on the viz "Grid4" in layers panel
        await since('A target icon appears on the viz "Grid4" in layers panel, instead we have #{actual}')
            .expect(await selectTargetInLayersPanel.getTargetIconInLayersPanel('Grid4').isDisplayed())
            .toBe(true);

        // // When I click on apply button
        await selectTargetInLayersPanel.applyButtonForSelectTarget();

        // // And I click on grid cells "2021" from ag-grid "Grid1"
        await dossierAuthoringPage.clickOnElement(await agGridVisualization.getGridCell('2021', 'Grid1'));
        // // Then The ag-grid "Grid4" should have 3 rows of data
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // await browser.debug();
        const gridCount1 = await agGridVisualization.getAllAgGridObjectCount('Grid4');
        await since('The ag-grid "Grid4" should have 3 rows of data, instead we have #{actual}')
            .expect(gridCount1)
            .toBe(3);

        // // And the grid cell in ag-grid "Grid4" at "2", "0" has text "2021"
        await since('the grid cell in ag-grid "Grid4" at "2", "1" has text "2021", instead we have #{actual}')
            .expect(await agGridVisualization.getGridCellByPosition(2, 1, 'Grid4').getText())
            .toBe('2021');

        // // When I duplicate container "Grid4" through the context menu
        await agGridVisualization.duplicateContainer('Grid4');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // await browser.debug();
        // // Then The container "Grid4 copy" should be selected
        await since('The container "Grid4 copy" should be selected')
            .expect(await agGridVisualization.getSelectedContainer('Grid4 copy').isDisplayed())
            .toBe(true);

        // // And The ag-grid "Grid4" should have 3 rows of data
        const gridCount2 = await agGridVisualization.getAllAgGridObjectCount('Grid4');
        await since('The ag-grid "Grid4" should have 3 rows of data, instead we have #{actual}')
            .expect(gridCount2)
            .toBe(3);

        // // And the grid cell in ag-grid "Grid4" at "2", "0" has text "2021"
        await since('the grid cell in ag-grid "Grid4" at "2", "1" has text "2021", instead we have #{actual}')
            .expect(await agGridVisualization.getGridCellByPosition(2, 1, 'Grid4').getText())
            .toBe('2021');

        // // When I click on the context menu of "Grid1"
        await baseContainer.openContextMenu('Grid1');

        // // And I select option "Edit Target Visualizations" from the context menu
        await baseContainer.selectContextMenuOption('Edit Target Visualizations');

        // // And A target button appears on the viz "Grid4 copy"
        await since('A target button appears on the viz "Grid4 copy"')
            .expect(await selectTargetInLayersPanel.getTargetButton('Grid4 copy').isDisplayed())
            .toBe(true);

        // // And A target icon appears on the viz "Grid4 copy" in layers panel
        await since('A target icon appears on the viz "Grid4 copy" in layers panel')
            .expect(await selectTargetInLayersPanel.getTargetIconInLayersPanel('Grid4 copy').isDisplayed())
            .toBe(true);
        // // And I click on cancel button
        await selectTargetInLayersPanel.cancelButtonForSelectTarget();

        // // When I select "Filter" from toolbar
        await dossierAuthoringPage.actionOnToolbar('Filter');

        // // And I select "Attribute / Metric Selector" from toolbar pulldown
        await toolbar.selectOptionFromToolbarPulldown('Attribute / Metric Selector');

        // // Then The container "Selector 1" should be selected
        await baseContainer.getSelectedContainer('Selector 1').waitForExist();
        // await since('The container "Selector 1" should be selected')
        //     .expect(await baseContainer.getSelectedContainer('Selector 1').isExisting())
        //     .toBe(true);

        // // When I drag "metric" named "Total ($)" from dataset "Accounts (office-royale-sales.xlsx) Forecast (offi... (3 tables)" to the selected in-canvas-selector
        await inCanvasSelector_Authoring.dragDSObjectToSelector(
            'metric',
            'Total ($)',
            'Accounts (office-royale-sales.xlsx) Forecast (offi... (3 tables)'
        );

        // // And I click on select target as source for selector "Selector 1"
        await selectTargetInLayersPanel.selectTargetButton('Selector 1');

        // // Then A source icon appears on the viz "Selector 1" in layers panel
        await since('Source icon should appear on the viz Selector 1 in layers panel')
            .expect(await selectTargetInLayersPanel.getSourceIconInLayersPanel('Selector 1').isDisplayed())
            .toBe(true);

        // // When I click on container "Grid2" from layers panel
        await layerPanel.clickOnContainerFromLayersPanel('Grid2');

        // // Then I click on Select an Attribute or Metrics from AM list of object to replace window and select "Forecast ($)"
        await selectTargetInLayersPanel.objectToReplace('Forecast ($)');

        // // And I click on apply button
        await selectTargetInLayersPanel.applyButtonForSelectTarget();
        // // When I select element "Total ($)" from the selected link bar attribute-metric selector
        await inCanvasSelector_Authoring.selectFromLinkBarAttributeMetricSelector('Total ($)');

        // // Then the grid cell in ag-grid "Grid2" at "1", "3" has text "Total ($)"
        await since('Grid cell in ag-grid "Grid2" at "1", "3" should have text "Total ($)", instead we have #{actual}')
            .expect(await agGridVisualization.getGridCellByPosition(1, 3, 'Grid2').getText())
            .toBe('Total ($)');

        // // When I select "Filter" from toolbar
        await dossierAuthoringPage.actionOnToolbar('Filter');

        // // And I select "Attribute / Metric Selector" from toolbar pulldown
        await toolbar.selectOptionFromToolbarPulldown('Attribute / Metric Selector');

        // // Then The container "Selector 2" should be selected
        await baseContainer.getSelectedContainer('Selector 2').waitForExist();
        // await since('The container "Selector 2" should be selected')
        //     .expect(await baseContainer.getSelectedContainer('Selector 2').isExisting())
        //     .toBeTrue();

        // // When I drag "attribute" named "Category" from dataset "Accounts (office-royale-sales.xlsx) Forecast (offi... (3 tables)" to the selected in-canvas-selector
        await inCanvasSelector_Authoring.dragDSObjectToSelector(
            'attribute',
            'Category',
            'Accounts (office-royale-sales.xlsx) Forecast (offi... (3 tables)'
        );
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // // And I click on select target as source for selector "Selector 2"
        await selectTargetInLayersPanel.selectTargetButton('Selector 2');

        // // Then A source icon appears on the viz "Selector 2" in layers panel
        await since('A source icon should appear on the viz "Selector 2" in layers panel')
            .expect(await selectTargetInLayersPanel.getSourceIconInLayersPanel('Selector 2').isDisplayed())
            .toBeTrue();

        // // When I click on container "Grid4" from layers panel
        await layerPanel.clickOnContainerFromLayersPanel('Grid4');

        // // Then I click on Select an Attribute or Metrics from AM list of object to replace window and select "Region(Group)"
        await selectTargetInLayersPanel.objectToReplace('Region(Group)');
        // // And I click on apply button
        await selectTargetInLayersPanel.applyButtonForSelectTarget();

        // // When I select element "Category" from the selected link bar attribute-metric selector
        await inCanvasSelector_Authoring.selectFromLinkBarAttributeMetricSelector('Category');

        // // Then the grid cell in ag-grid "Grid4" at "1", "2" has text "Category"
        await since('Grid cell in ag-grid "Grid4" at "1", "2" should have "Category", instead we have #{actual}')
            .expect(await agGridVisualization.getGridCellByPosition(1, 2, 'Grid4').getText())
            .toBe('Category');

        // // And the grid cell in ag-grid "Grid4" at "3", "2" has text "Break room"
        await since('Grid cell in ag-grid "Grid4" at "2", "2" should have "Break room", instead we have #{actual}')
            .expect(await agGridVisualization.getGridCellByPosition(2, 2, 'Grid4').getText())
            .toBe('Break room');
    });

    it('[BCIN-5279] Scroll bar is disappearing in Advanced Filter Editor when it has multiple Column Sets with multiple qualifications', async () => {
        await libraryPage.editDossierByUrl({
            projectId: AGGrid_AdvancedFilter.project.id,
            dossierId: AGGrid_AdvancedFilter.id,
        });
        await agGridVisualization.clickContainer('Visualization 1');
        await advancedFilter.openAdvancedFilterEditor('Visualization 1');
        await dossierAuthoringPage.sleep(1000);
        await advancedFilter.hoverOnFilterItemByIndex(1);
        //hover over the scroll bar to make it appear
        //take screenshot
        await takeScreenshotByElement(advancedFilter.AdvancedFilterEditor, 'Scroll bar should appear when hover', 'BCIN-5279_01');
        await advancedFilter.changeToAnotherColumnSetAdvancedFilterEditor('Column Set 1');
        await dossierAuthoringPage.sleep(1000);
        await advancedFilter.hoverOnFilterItemByIndex(1);
        await takeScreenshotByElement(advancedFilter.AdvancedFilterEditor, 'Scroll bar should still appear when switch to Column Set 1', 'BCIN-5279_02');
    });
});
