import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import * as gridConstants from '../../../constants/grid.js';

describe('NormalGrid_Drill', () => {
    let {
        vizPanelForGrid,
        datasetPanel,
        libraryPage,
        loginPage,
        editorPanel,
        agGridVisualization,
        gridAuthoring,
        loadingDialog,
        editorPanelForGrid,
        dossierAuthoringPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    it('[TC4976] Drilling sanity test', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.Drilling.id,
            projectId: gridConstants.Drilling.project.id,
        });

        // When I drill from attribute header "City" to level "Supplier" in grid visualization "Visualization 1"
        await vizPanelForGrid.drillFromHeader('City', 'Supplier', 'Visualization 1');
        // When I drill from attribute header "Supplier" to level "Month" in grid visualization "Visualization 1"
        await vizPanelForGrid.drillFromHeader('Supplier', 'Month', 'Visualization 1');

        // When I add "attribute" named "Airline Name" from dataset "airline-sample-data.xls" to the current Viz by double click
        await editorPanel.switchToEditorPanel();
        await datasetPanel.addObjectToVizByDoubleClick('Airline Name', 'attribute', 'airline-sample-data.xls');

        // And I click on context menu of grid visualization "Visualization 1" and select Data Source "airline-sample-data.xls"
        await vizPanelForGrid.setDataSource('Visualization 1', 'airline-sample-data.xls');

        // When I drill from attribute header "Airline Name" to level "Day of Week" in grid visualization "Visualization 1"
        await vizPanelForGrid.drillFromHeader('Airline Name', 'Day of Week', 'Visualization 1');

        // And I drill from attribute header "Day of Week" to level "Departure Hour" in grid visualization "Visualization 1"
        await vizPanelForGrid.drillFromHeader('Day of Week', 'Departure Hour', 'Visualization 1');

        // And I drill from attribute header "Departure Hour" to level "Month" in grid visualization "Visualization 1"
        await vizPanelForGrid.drillFromHeader('Departure Hour', 'Month', 'Visualization 1');

        // And I drill from attribute header "Month" to level "Origin Airport" in grid visualization "Visualization 1"
        await vizPanelForGrid.drillFromHeader('Month', 'Origin Airport', 'Visualization 1');

        // And I drill from attribute header "Origin Airport" to level "Year" in grid visualization "Visualization 1"
        await vizPanelForGrid.drillFromHeader('Origin Airport', 'Year', 'Visualization 1');

        // When I click on context menu of grid visualization "Visualization 1" and select Data Source "retail-sample-data.xls"
        await vizPanelForGrid.setDataSource('Visualization 1', 'retail-sample-data.xls');

        // When I drill from attribute header "Item Category" to level "City" in grid visualization "Visualization 1"
        await vizPanelForGrid.drillFromHeader('Item Category', 'City', 'Visualization 1');

        // When I drill from attribute header "City" to level "Supplier" in grid visualization "Visualization 1"
        await vizPanelForGrid.drillFromHeader('City', 'Supplier', 'Visualization 1');
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'TC4976_01',
            'Drill to Supplier'
        );
    });

    it('[TC2923] Drill from an attribute to other attributes in another dataset', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.Drilling.id,
            projectId: gridConstants.Drilling.project.id,
        });

        await editorPanel.switchToEditorPanel();
        await datasetPanel.addObjectToVizByDoubleClick('Airline Name', 'attribute', 'airline-sample-data.xls');
        await datasetPanel.addObjectToVizByDoubleClick('Day of Week', 'attribute', 'airline-sample-data.xls');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // And the grid cell in Visualization 1 at "2", "3" has text "AirTran Airways Corporation"
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 3, 'Visualization 1'))
            .toBe('AirTran Airways Corporation');
        // And the grid cell in visualization "Visualization 1" at "2", "4" has text "Sunday"
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "4" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 4, 'Visualization 1'))
            .toBe('Sunday');
        // And the grid cell in visualization "Visualization 1" at "2", "5" has text "$760,697"
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "5" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 5, 'Visualization 1'))
            .toBe('$760,697');

        await vizPanelForGrid.setDataSource('Visualization 1', 'airline-sample-data.xls');
        // And I drill from attribute header "Day of Week" to level "Departure Hour" in grid visualization "Visualization 1"
        await vizPanelForGrid.drillFromHeader('City', 'Month', 'Visualization 1');

        // And the grid cell in visualization "Visualization 1" at "2", "1" has text "January"
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('January');
        // And the grid cell in visualization "Visualization 1" at "2", "5" has text "$10,719,702"
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "5" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 5, 'Visualization 1'))
            .toBe('$10,719,702');
    });

    it('[TC2924] Drill from attribute elements/attribute forms to other attributes', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.Drilling.id,
            projectId: gridConstants.Drilling.project.id,
        });

        await editorPanel.switchToEditorPanel();
        // When I multiselect display forms "Latitude,Longitude" for attribute "City" in the editor panel
        await editorPanelForGrid.multiSelectDisplayFormsFromEditorPanel('City', 'Latitude,Longitude');
        // When I drill from attribute header "City Latitude" to level "Month" in grid visualization "Visualization 1"
        await vizPanelForGrid.drillFromHeader('City Latitude', 'Month', 'Visualization 1');
        // Then the grid cell in visualization "Visualization 1" at "1", "1" has text "Month ID"
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 1, 'Visualization 1'))
            .toBe('Month ID');
        // And the grid cell in visualization "Visualization 1" at "2", "1" has text "Jan"
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Jan');
        // And the grid cell in visualization "Visualization 1" at "2", "3" has text "$907,249"
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 3, 'Visualization 1'))
            .toBe('$907,249');
        // When I select "Undo" from toolbar
        await dossierAuthoringPage.actionOnToolbar('Undo');
        // When I drill from elements "38.9785" to level "Month" in grid visualization "Visualization 1"
        await vizPanelForGrid.drillFromElements('38.9785', 'Month', 'Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then the grid cell in visualization "Visualization 1" at "1", "1" has text "Month ID"
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 1, 'Visualization 1'))
            .toBe('Month ID');
        // And the grid cell in visualization "Visualization 1" at "2", "1" has text "Jan"
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Jan');
        // And the grid cell in visualization "Visualization 1" at "2", "3" has text "$83,871"
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 3, 'Visualization 1'))
            .toBe('$83,871');

        // When I select "Undo" from toolbar
        await dossierAuthoringPage.actionOnToolbar('Undo');

        // When I rename "Attribute" named "Supplier" from dataset "retail-sample-data.xls" as "New Supplier"
        await datasetPanel.renameObject('Supplier', 'Attribute', 'retail-sample-data.xls', 'New Supplier');
        // When I drill from attribute header "City Latitude" to level "New Supplier" in grid visualization "Visualization 1"
        await vizPanelForGrid.drillFromHeader('City Latitude', 'New Supplier', 'Visualization 1');
        // Then the grid cell in visualization "Visualization 1" at "1", "1" has text "New Supplier ID"
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 1, 'Visualization 1'))
            .toBe('New Supplier ID');
        // And the grid cell in visualization "Visualization 1" at "7", "1" has text "A&E Entertainment"
        await since(
            'The grid cell in visualization "Visualization 1" at "7", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(7, 1, 'Visualization 1'))
            .toBe('A&E Entertainment');
        // And the grid cell in visualization "Visualization 1" at "7", "3" has text "$2,441,467"
        await since(
            'The grid cell in visualization "Visualization 1" at "7", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(7, 3, 'Visualization 1'))
            .toBe('$2,441,467');
    });

    it('[TC2925] Drill from a renamed attribute to another renamed attribute', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.Drilling.id,
            projectId: gridConstants.Drilling.project.id,
        });

        await editorPanel.switchToEditorPanel();
        await datasetPanel.addObjectToVizByDoubleClick('City', 'attribute', 'retail-sample-data.xls');
        await datasetPanel.addObjectToVizByDoubleClick('Item Category', 'attribute', 'retail-sample-data.xls');
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');
        await datasetPanel.addObjectToVizByDoubleClick('Revenue', 'metric', 'retail-sample-data.xls');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await datasetPanel.renameObject('City', 'Attribute', 'retail-sample-data.xls', 'New City');
        await datasetPanel.renameObject('Supplier', 'Attribute', 'retail-sample-data.xls', 'New Supplier');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await vizPanelForGrid.drillFromHeader('New City', 'New Supplier', 'Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await since(
            'The grid cell in visualization "Visualization 1" at "1", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 1, 'Visualization 1'))
            .toBe('New Supplier');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('20th Century Fox');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 3, 'Visualization 1'))
            .toBe('$969,712');

        await vizPanelForGrid.drillFromElements('Bantam Books,BMG', 'New City', 'Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await since(
            'The grid cell in visualization "Visualization 1" at "1", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 1, 'Visualization 1'))
            .toBe('New City');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Annapolis');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('Alternative Movies');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "3" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 3, 'Visualization 1'))
            .toBe('$164,291');
    });

    it('[TC2547] Drill from Project Schema Objects', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.TC2547.id,
            projectId: gridConstants.TC2547.project.id,
        });
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('$2,070,816');

        await vizPanelForGrid.drillFromHeader('Category', 'Subcategory', 'Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Art & Architecture');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('$370,161');
        await since(
            'The grid cell in visualization "Visualization 1" at "8", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(8, 2, 'Visualization 1'))
            .toBe('$3,149,663');

        await vizPanelForGrid.drillFromElements('Business', 'Item', 'Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Working With Emotional Intelligence');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('$20,819');
        await since(
            'The grid cell in visualization "Visualization 1" at "17", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(17, 2, 'Visualization 1'))
            .toBe('$28,469');
    });

    it('[TC5023] Drill from a derived element/derived attribute', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.TC5023.id,
            projectId: gridConstants.TC5023.project.id,
        });

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('Group 1');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "5" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 5, 'Visualization 1'))
            .toBe('$43,508');
        await since(
            'The grid cell in visualization "Visualization 1" at "9", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(9, 2, 'Visualization 1'))
            .toBe('Art & Architecture');
        await since(
            'The grid cell in visualization "Visualization 1" at "9", "5" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(9, 5, 'Visualization 1'))
            .toBe('$32,444');

        await vizPanelForGrid.drillFromHeader('Subcategory(Group)', 'Subcategory', 'Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('Art & Architecture');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "5" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 5, 'Visualization 1'))
            .toBe('$32,444');
        await since(
            'The grid cell in visualization "Visualization 1" at "9", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(9, 2, 'Visualization 1'))
            .toBe('Business');

        await since(
            'The grid cell in visualization "Visualization 1" at "9", "5" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(9, 5, 'Visualization 1'))
            .toBe('$26,465');

        await editorPanelForGrid.replaceObjectByName('Subcategory', 'attribute', 'Subcategory(Group)', 'attribute');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await vizPanelForGrid.drillFromElements('Group 1', 'Subcategory', 'Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('Business');

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "5" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 5, 'Visualization 1'))
            .toBe('$26,465');

        await since(
            'The grid cell in visualization "Visualization 1" at "9", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(9, 2, 'Visualization 1'))
            .toBe('Literature');

        await since(
            'The grid cell in visualization "Visualization 1" at "9", "5" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(9, 5, 'Visualization 1'))
            .toBe('$17,043');
    });
    it('[TC5032] Drill from a derived attribute', async () => {
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.TC5023.id,
            projectId: gridConstants.TC5023.project.id,
        });

        await editorPanelForGrid.replaceObjectByName('Subcategory(Group)', 'attribute', 'DA', 'attribute');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('1');

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "5" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 5, 'Visualization 1'))
            .toBe('$167,962');

        await since(
            'The grid cell in visualization "Visualization 1" at "9", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(9, 2, 'Visualization 1'))
            .toBe('2');

        await since(
            'The grid cell in visualization "Visualization 1" at "9", "5" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(9, 5, 'Visualization 1'))
            .toBe('$1,270,616');

        await vizPanelForGrid.drillFromHeader('DA', 'Subcategory', 'Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('Art & Architecture');

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "5" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 5, 'Visualization 1'))
            .toBe('$32,444');
        await since(
            'The grid cell in visualization "Visualization 1" at "9", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(9, 2, 'Visualization 1'))
            .toBe('Business');

        await since(
            'The grid cell in visualization "Visualization 1" at "9", "5" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(9, 5, 'Visualization 1'))
            .toBe('$26,465');

        await editorPanelForGrid.replaceObjectByName('Subcategory', 'attribute', 'DA', 'attribute');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await vizPanelForGrid.drillFromElements('2', 'Subcategory', 'Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await since(
            'The grid cell in visualization "Visualization 1" at "2", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('Audio Equipment');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "5" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 5, 'Visualization 1'))
            .toBe('$188,719');
        await since(
            'The grid cell in visualization "Visualization 1" at "9", "2" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(9, 2, 'Visualization 1'))
            .toBe('Cameras');
        await since(
            'The grid cell in visualization "Visualization 1" at "9", "5" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(9, 5, 'Visualization 1'))
            .toBe('$264,218');
    });
});
