import setWindowSize from '../../../config/setWindowSize.js';
import { AGGridShowData, AGGridShowData2, gridUser } from '../../../constants/grid.js';
import { existingObjectsDialog } from '../../../pageObjects/dossierEditor/ExistingObjectsDialog.js';
import { expectResult } from '../../../utils/ExpectUtils.js';

describe('Modern (AG) grid show data dialog', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const {
        loginPage,
        libraryPage,
        agGridVisualization,
        loadingDialog,
        showDataDialog,
        dossierMojo,
        vizPanelForGrid,
        dossierAuthoringPage,
        datasetPanel,
        datasetsPanel,
        editorPanelForGrid,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridUser);
        await setWindowSize(browserWindow);
        agGridVisualization.containerNameMatchMethod = 'exact';
    });

    afterAll(async () => {
        agGridVisualization.containerNameMatchMethod = 'contains';
    });

    afterEach(async () => {});

    it('[TC71085_1] Show data in modern grid (AG) Acceptance - basic column set and Microchart', async () => {
        await libraryPage.editDossierByUrl({
            projectId: AGGridShowData.project.id,
            dossierId: AGGridShowData.id,
        });

        // When I right click on value "2015 Q1" and select "Show Data..." from ag-grid "Visualization 1"
        await agGridVisualization.openContextMenuItemForValue('2015 Q1', 'Show Data...', 'Visualization 1');

        // Then An editor shows up with title "Show Data"
        await since('An editor with title "Show Data" should be displayed')
            .expect(await dossierMojo.getMojoEditorWithTitle('Show Data').isDisplayed())
            .toBe(true);

        // And It shows there are "21" rows of data in the show data dialog
        await since('The show data dialog should have 21 rows of data')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(21);

        // And The show data grid has element "2015 Q1"
        await since('The show data grid should have element "2015 Q1"')
            .expect(await showDataDialog.getObjectForShowDataGrid('2015 Q1').isDisplayed())
            .toBe(true);

        // And The show data grid does not have element "2016 Q1"
        await since('The show data grid should not have element "2016 Q1"')
            .expect(await showDataDialog.getObjectForShowDataGrid('2016 Q1').isDisplayed())
            .toBe(false);

        // When I close the show data dialog
        await showDataDialog.closeShowDataDialog();
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // Then The editor with title "Show Data" is closed
        await since('The editor with title "Show Data" should be closed')
            .expect(await dossierMojo.getMojoEditorWithTitle('Show Data').isExisting())
            .toBe(false);

        // When I right click on value "$177,781" and select "Show Data..." from ag-grid "Visualization 1"
        await agGridVisualization.openContextMenuItemForValue('$177,781', 'Show Data...', 'Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then An editor shows up with title "Show Data"
        await since('An editor should show up with title "Show Data" 1')
            .expect(await dossierMojo.getMojoEditorWithTitle('Show Data').isDisplayed())
            .toBe(true);

        // And It shows there are "1" rows of data in the show data dialog
        await since('It should show there are "1" rows of data in the show data dialog')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(1);

        // Then The show data grid has element "2015 Q1"
        await since('The show data grid should have element "2015 Q1"')
            .expect(await showDataDialog.getObjectForShowDataGrid('2015 Q1').isDisplayed())
            .toBe(true);

        // And The show data grid does not have element "2016"
        await since('The show data grid should not have element "2016"')
            .expect(await showDataDialog.getObjectForShowDataGrid('2016').isDisplayed())
            .toBe(false);

        // When I close the show data dialog
        await showDataDialog.closeShowDataDialog();
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // Then The editor with title "Show Data" is closed
        await since('The editor with title "Show Data" should be closed')
            .expect(await dossierMojo.getMojoEditorWithTitle('Show Data').isExisting())
            .toBe(false);

        // When I click on show data of the context menu of the grid visualization "Visualization 1"
        await vizPanelForGrid.openShowDataDiagFromViz('Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then An editor shows up with title "Show Data"
        await since('An editor should show up with title "Show Data" 2')
            .expect(await dossierMojo.getMojoEditorWithTitle('Show Data').isDisplayed())
            .toBe(true);

        // Then It shows there are "168" rows of data in the show data dialog
        await since('It should show there are "168" rows of data in the show data dialog')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(168);

        // When I select AG grid column set "Cost Trend by Month" to display its data
        await showDataDialog.changeColumnSetInAgGrid('Cost Trend by Month');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then It shows there are "24" rows of data in the show data dialog
        await since('Row count should be 24, instead we have #{actual}')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(24);

        // Then The show data grid has element "2016 Q2"
        await since('Show data grid should have element "2016 Q2"')
            .expect(await showDataDialog.getObjectForShowDataGrid('2016 Q2').isExisting())
            .toBe(true);

        // And The show data grid has element "$1,092,368"
        await since('Show data grid should have element "$1,092,368"')
            .expect(await showDataDialog.getObjectForShowDataGrid('$1,092,368').isExisting())
            .toBe(true);

        // And The show data grid at row "1" and column "0" has element "Jan 2015"
        await since('Show data grid at row 1 and column 0 should have element "Jan 2015", instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 0).getText())
            .toBe('Jan 2015');

        // When I sort the show data grid by clicking on header "Quarter"
        await showDataDialog.sortShowDataGridbyClickingHeader('Quarter');

        // Then The show data grid at row "1" and column "0" has element "Jan 2015"
        await since('Show data grid at row 1 and column 0 should have element "Jan 2015", instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 0).getText())
            .toBe('Jan 2015');

        // When I sort the show data grid by clicking on header "Quarter"
        await showDataDialog.sortShowDataGridbyClickingHeader('Quarter');

        // Then The show data grid at row "1" and column "0" has element "Oct 2016"
        await since('Show data grid at row 1 and column 0 should have element "Oct 2016"')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 0).getText())
            .toBe('Oct 2016');

        // When I add the show data grid as visualization
        await showDataDialog.addGridToViz();

        // Then The editor with title "Show Data" is closed
        await since('Editor with title "Show Data" should be closed')
            .expect(await dossierMojo.getMojoEditorWithTitle('Show Data').isExisting())
            .toBe(false);
        // And the grid cell in ag-grid "Visualization" at "1", "2" has text "2016 Q4"
        const actualText = await agGridVisualization.getGridCellByPosition(2, 3, 'Visualization').getText();
        await since('Grid cell text should be "2016 Q4", instead we have #{actual}').expect(actualText).toBe('2016 Q4');
    });

    it('[TC71085_2] Show data in modern grid (AG) Acceptance - Trendbar and Bullet chart', async () => {
        // When I open dossier by its ID "A3A288BFEE4CD9882C382DACACF1121C"
        await libraryPage.editDossierByUrl({
            projectId: AGGridShowData.project.id,
            dossierId: AGGridShowData.id,
        });

        // When I click on show data of the context menu of the grid visualization "Visualization 1"
        await vizPanelForGrid.openShowDataDiagFromViz('Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then An editor shows up with title "Show Data"
        await since('An editor with title "Show Data" should be displayed')
            .expect(await dossierMojo.getMojoEditorWithTitle('Show Data').isDisplayed())
            .toBe(true);

        // And It shows there are "168" rows of data in the show data dialog
        await since('The show data dialog should display 168 rows of data')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(168);

        // When I select AG grid column set "Profit Comparison by Region" to display its data
        await showDataDialog.changeColumnSetInAgGrid('Profit Comparison by Region');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // And It shows there are "168" rows of data in the show data dialog
        await since('The show data dialog should display 168 rows of data')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(168);

        // Then The show data grid has element "July"
        await since('The show data grid should have element "July"')
            .expect(await showDataDialog.getObjectForShowDataGrid('July').isExisting())
            .toBe(true);

        // When I select these "Month,Cost" units in add data option
        await showDataDialog.selectUnitsInUnitSelectionPopup('Month,Cost');

        // And I apply and close add data option
        await showDataDialog.applyAndCloseUnitSelectionPopup();
        // Then The show data grid has header "Month"
        await since('The show data grid should have header "Month"')
            .expect(await showDataDialog.getHeaderInShowDataGrid('Month').isDisplayed())
            .toBe(true);

        // And The show data grid at row "1" and column "6" has element "$87,415"
        await since('The show data grid at row "1" and column "6" should have element "$87,415"')
            .expect(await showDataDialog.getCellInshowDataGrid('1', '6').getText())
            .toBe('$87,415');

        // When I sort the show data grid by clicking on header "Cost"
        await showDataDialog.sortShowDataGridbyClickingHeader('Cost');

        // Then The show data grid at row "1" and column "6" has element "$30,468"
        await since('The show data grid at row "1" and column "6" should have element "$30,468"')
            .expect(await showDataDialog.getCellInshowDataGrid('1', '6').getText())
            .toBe('$30,468');

        // And The show data grid has element "Jan 2015"
        await since('The show data grid should have element "Jan 2015"')
            .expect(await showDataDialog.getObjectForShowDataGrid('Jan 2015').isDisplayed())
            .toBe(true);

        // When I select AG grid column set "Percent Growth Performance" to display its data
        await showDataDialog.changeColumnSetInAgGrid('Percent Growth Performance');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // And It shows there are "24" rows of data in the show data dialog
        await since('The show data dialog should show "24" rows of data')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(24);

        // Then The show data grid has element "July"
        await since('The show data grid should have element "July"')
            .expect(await showDataDialog.getObjectForShowDataGrid('July').isDisplayed())
            .toBe(true);

        // And The show data grid has element "1,584,549"
        await since('The show data grid should have element "1,584,549"')
            .expect(await showDataDialog.getObjectForShowDataGrid('1,584,549').isExisting())
            .toBe(true);

        // And The show data grid at row "1" and column "5" has element "$700,579"
        await since(
            'The show data grid at row "1" and column "5" should have element "$700,579", instead we have #{actual}'
        )
            .expect(await showDataDialog.getCellInshowDataGrid('1', '5').getText())
            .toBe('$700,579');
        // When I sort the show data grid by clicking on header "Revenue"
        await showDataDialog.sortShowDataGridbyClickingHeader('Revenue');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then The show data grid at row "1" and column "5" has element "$700,579"
        await since('The show data grid at row "1" and column "5" should have $700,579')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 5).getText())
            .toBe('$700,579');

        // When I close the show data dialog
        await showDataDialog.closeShowDataDialog();

        // Then The editor with title "Show Data" is closed
        await since('The editor with title "Show Data" should be closed')
            .expect(await dossierMojo.getMojoEditorWithTitle('Show Data').isExisting())
            .toBe(false);
    });

    it('[TC71085_3] Data display when scrolling in show data dialog', async () => {
        await libraryPage.createNewDashboardByUrl({});
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // Then The Dossier Editor is displayed
        await since('The Dossier Editor should be displayed')
            .expect(await dossierAuthoringPage.getDossierView().isDisplayed())
            .toBe(true);

        // When I add "Existing Objects" from datasets panel
        await datasetsPanel.addDataFromDatasetsPanel('Existing Objects');

        // Then An editor shows up with title "Add Existing Objects"
        await since('An editor with title "Add Existing Objects" should be displayed')
            .expect(await dossierMojo.getMojoEditorWithTitle('Add Existing Objects').isDisplayed())
            .toBe(true);

        // When I expand the "Time" folder
        await existingObjectsDialog.expandFolder('Time');

        // And I double click on "Month" from the object browse container
        await existingObjectsDialog.doubleClickOnObject('Month');

        // Then Object "Month" is added to the dataset container
        await since('Object "Month" should be added to the dataset container')
            .expect(await existingObjectsDialog.getObjectFromDatasetContainer('Month').isDisplayed())
            .toBe(true);

        // When I click button "Add" on the existing objects dialog
        await existingObjectsDialog.clickOnBtn('Add');
        await browser.pause(2000);
        // Then The editor with title "Add Existing Objects" is closed
        const res = await dossierMojo.getMojoEditorWithTitle('Add Existing Objects').isDisplayed();
        await since('The editor with title "Add Existing Objects" should be closed').expect(res).toBe(false);

        // And The datasets panel should have dataset "New Dataset 1" after 5 seconds
        // await browser.pause(5000);
        await datasetsPanel.getDatasetByName('New Dataset 1').waitForDisplayed();
        // await since('The datasets panel should have dataset "New Dataset 1"')
        //     .expect(await datasetsPanel.getDatasetByName('New Dataset 1').isDisplayed())
        //     .toBe(true);

        // And The datasets panel should have "attribute" named "Month" in dataset "New Dataset 1"
        await since('The datasets panel should have "attribute" named "Month" in dataset "New Dataset 1"')
            .expect(await datasetsPanel.getObjectFromDataset('Month', 'attribute', 'New Dataset 1').isDisplayed())
            .toBe(true);
        // And The datasets panel should have unused "derived metric" named "Row Count" in dataset "New Dataset 1"
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await datasetsPanel.getUnusedObjectFromDataset('Row Count', 'derived metric', 'New Dataset 1');

        // When I rename "New Dataset 1" as "New Dataset 2"
        await datasetPanel.renameDataset('New Dataset 1', 'New Dataset 2');

        // Then The datasets panel should have dataset "New Dataset 2"
        await since('The datasets panel should have dataset "New Dataset 2"')
            .expect(await datasetsPanel.getDatasetByName('New Dataset 2').isDisplayed())
            .toBe(true);

        // When I select "Add Data" from datasets panel context menu
        await datasetPanel.selectFromDatasetsPanelContextMenu('Add Data');

        // And I select secondary option "Existing Objects..." from the context menu
        await agGridVisualization.selectSecondaryContextMenuOption('Existing Objects...');

        // Then An editor shows up with title "Add Existing Objects"
        await since('An editor should show up with title "Add Existing Objects", instead we have')
            .expect(await dossierMojo.getMojoEditorWithTitle('Add Existing Objects').isDisplayed())
            .toBe(true);

        // When I expand the "Products" folder
        await existingObjectsDialog.expandFolder('Products');

        // And I double click on "Item" from the object browse container
        await existingObjectsDialog.doubleClickOnObject('Item');

        // And I double click on "Category" from the object browse container
        await existingObjectsDialog.doubleClickOnObject('Category');

        // Then Object "Item" is added to the dataset container
        await since('Object "Item" should be added to the dataset container, instead we have')
            .expect(await existingObjectsDialog.getObjectFromDatasetContainer('Item').isDisplayed())
            .toBe(true);
        // And Object "Category" is added to the dataset container
        await existingObjectsDialog.getObjectFromDatasetContainer('Category');

        // When I click button "Add" on the existing objects dialog
        await existingObjectsDialog.clickOnBtn('Add');

        // Then The editor with title "Add Existing Objects" is closed
        await since('The editor with title "Add Existing Objects" should be closed')
            .expect(await dossierMojo.getMojoEditorWithTitle('Add Existing Objects').isDisplayed())
            .toBe(false);

        // And The datasets panel should have dataset "New Dataset 1" after 5 seconds
        // await browser.pause(5000);
        await since('The datasets panel should have dataset "New Dataset 1"')
            .expect(await datasetsPanel.getDatasetByName('New Dataset 1').isDisplayed())
            .toBe(true);

        // And The datasets panel should have "attribute" named "Item" in dataset "New Dataset 1"
        await since('The datasets panel should have "attribute" named "Item" in dataset "New Dataset 1"')
            .expect(await datasetsPanel.getObjectFromDataset('Item', 'attribute', 'New Dataset 1').isDisplayed())
            .toBe(true);

        // When I add "attribute" named "Item" from dataset "New Dataset 1" to the current Viz by double click
        await datasetsPanel.addObjectToVizByDoubleClick('Item', 'attribute', 'New Dataset 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then The editor panel should have "attribute" named "Item" on "Rows" section
        await since('The editor panel should have "attribute" named "Item" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Item', 'attribute', 'Rows').isDisplayed())
            .toBe(true);

        // When I add "attribute" named "Month" from dataset "New Dataset 2" to the current Viz by double click
        await datasetsPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'New Dataset 2');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then The editor panel should have "attribute" named "Month" on "Rows" section
        await since('The editor panel should have "attribute" named "Month" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Month', 'attribute', 'Rows').isDisplayed())
            .toBe(true);

        // When I click on the context menu of "Visualization 1"
        await agGridVisualization.openContextMenu('Visualization 1');
        // And I select option "Show Data" from the context menu
        await agGridVisualization.selectContextMenuOption('Show Data');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then An editor shows up with title "Show Data"
        await dossierMojo.getMojoEditorWithTitle('Show Data').waitForDisplayed();
        await since('An editor should show up with title "Show Data" 3')
            .expect(await dossierMojo.getMojoEditorWithTitle('Show Data').isDisplayed())
            .toBe(true);

        // And It shows there are "17280" rows of data in the show data dialog
        await since('The show data dialog should show 17280 rows of data, instead we have #{actual}')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(17280);

        // When I scroll the show data grid down to the "middle"
        await showDataDialog.moveShowDataVerticalScrollBarToBottom('middle');
        await showDataDialog.getCellInshowDataGrid(8645, 0).waitForDisplayed();
        // Then The show data grid at row "8645" and column "0" has element "Small Soldiers"
        await since(
            'The show data grid at row 8645 and column 0 should have element "Small Soldiers", instead we have #{actual}'
        )
            .expect(await showDataDialog.getCellInshowDataGrid(8645, 0).getText())
            .toBe('Small Soldiers');

        // And The show data grid at row "8645" and column "1" has element "May 2014"
        await since(
            'The show data grid at row 8645 and column 1 should have element "May 2014", instead we have #{actual}'
        )
            .expect(await showDataDialog.getCellInshowDataGrid(8645, 1).getText())
            .toBe('May 2014');

        // When I scroll the show data grid down to the "bottom"
        await showDataDialog.moveShowDataVerticalScrollBarToBottom('bottom');
        await showDataDialog.getCellInshowDataGrid(17276, 0).waitForDisplayed();
        // Then The show data grid at row "17276" and column "0" has element "Never Say Never"
        await since(
            'The show data grid at row 17276 and column 0 should have element "Never Say Never", instead we have #{actual}'
        )
            .expect(await showDataDialog.getCellInshowDataGrid(17276, 0).getText())
            .toBe('Never Say Never');

        // And The show data grid at row "17276" and column "1" has element "Aug 2017"
        await since(
            'The show data grid at row 17276 and column 1 should have element "Aug 2017", instead we have #{actual}'
        )
            .expect(await showDataDialog.getCellInshowDataGrid(17276, 1).getText())
            .toBe('Aug 2017');

        // When I close the show data dialog
        await showDataDialog.closeShowDataDialog();
        // Then The editor with title "Show Data" is closed
        await since('The editor with title "Show Data" should not be existing')
            .expect(await dossierMojo.getMojoEditorWithTitle('Show Data').isExisting())
            .toBe(false);

        // When I change the selected visualization to "Compound Grid" from context menu
        await agGridVisualization.changeViz('Compound Grid');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // When I click on the context menu of "Visualization 1"
        await agGridVisualization.openContextMenu('Visualization 1');

        // And I select option "Show Data" from the context menu
        await agGridVisualization.selectContextMenuOption('Show Data');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then An editor shows up with title "Show Data"
        await since('An editor with title "Show Data" should be displayed')
            .expect(await dossierMojo.getMojoEditorWithTitle('Show Data').isDisplayed())
            .toBe(true);

        // And It shows there are "17280" rows of data in the show data dialog
        await since('The show data dialog should display 17280 rows of data, instead we have #{actual}')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(17280);

        // When I scroll the show data grid down to the "middle"
        await showDataDialog.moveShowDataVerticalScrollBarToBottom('middle');
        await showDataDialog.getCellInshowDataGrid(8645, 0).waitForDisplayed();
        // Then The show data grid at row "8645" and column "0" has element "Small Soldiers"
        await since(
            'The show data grid at row 8645 and column 0 should have element "Small Soldiers", instead we have #{actual}'
        )
            .expect(await showDataDialog.getCellInshowDataGrid(8645, 0).getText())
            .toBe('Small Soldiers');

        // And The show data grid at row "8645" and column "1" has element "May 2014"
        await since('The show data grid at row 8645 and column 1 should have element "May 2014"')
            .expect(await showDataDialog.getCellInshowDataGrid(8645, 1).getText())
            .toBe('May 2014');

        // When I scroll the show data grid down to the "bottom"
        await showDataDialog.moveShowDataVerticalScrollBarToBottom('bottom');
        await showDataDialog.getCellInshowDataGrid(17276, 0).waitForDisplayed();
        // Then The show data grid at row "17276" and column "0" has element "Never Say Never"
        await since(
            'The show data grid at row "17276" and column "0" should have element "Never Say Never", instead we have #{actual}'
        )
            .expect(await showDataDialog.getCellInshowDataGrid(17276, 0).getText())
            .toBe('Never Say Never');

        // And The show data grid at row "17276" and column "1" has element "Aug 2017"
        await since(
            'The show data grid at row "17276" and column "1" should have element "Aug 2017", instead we have #{actual}'
        )
            .expect(await showDataDialog.getCellInshowDataGrid(17276, 1).getText())
            .toBe('Aug 2017');

        // When I close the show data dialog
        await showDataDialog.closeShowDataDialog();

        // Then The editor with title "Show Data" is closed
        await since('The editor with title "Show Data" should be closed, instead we have #{actual}')
            .expect(await dossierMojo.getMojoEditorWithTitle('Show Data').isExisting())
            .toBe(false);

        // When I change the selected visualization to "Grid (Modern)" from context menu
        await agGridVisualization.changeViz('Grid (Modern)');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // When I click on the context menu of "Visualization 1"
        await agGridVisualization.openContextMenu('Visualization 1');

        // And I select option "Show Data" from the context menu
        await agGridVisualization.selectContextMenuOption('Show Data');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then An editor shows up with title "Show Data"
        await since('An editor should show up with title "Show Data" 4')
            .expect(await dossierMojo.getMojoEditorWithTitle('Show Data').isDisplayed())
            .toBe(true);

        // And It shows there are "17280" rows of data in the show data dialog
        await since('It should show there are "17280" rows of data in the show data dialog, instead we have #{actual}')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(17280);

        // When I scroll the show data grid down to the "middle"
        await showDataDialog.moveShowDataVerticalScrollBarToBottom('middle');
        await showDataDialog.getCellInshowDataGrid(8645, 0).waitForDisplayed();
        // Then The show data grid at row "8645" and column "0" has element "Small Soldiers"
        await since(
            'The show data grid at row "8645" and column "0" should have element "Small Soldiers", instead we have #{actual}'
        )
            .expect(await showDataDialog.getCellInshowDataGrid(8645, 0).getText())
            .toBe('Small Soldiers');

        // And The show data grid at row "8645" and column "1" has element "May 2014"
        await since(
            'The show data grid at row "8645" and column "1" should have element "May 2014", instead we have #{actual}'
        )
            .expect(await showDataDialog.getCellInshowDataGrid(8645, 1).getText())
            .toBe('May 2014');

        // When I scroll the show data grid down to the "bottom"
        await showDataDialog.moveShowDataVerticalScrollBarToBottom('bottom');
        await showDataDialog.getCellInshowDataGrid(17276, 0).waitForDisplayed();
        // Then The show data grid at row "17276" and column "0" has element "Never Say Never"
        await since(
            'The show data grid at row "17276" and column "0" should have element "Never Say Never", instead we have #{actual}'
        )
            .expect(await showDataDialog.getCellInshowDataGrid(17276, 0).getText())
            .toBe('Never Say Never');

        // And The show data grid at row "17276" and column "1" has element "Aug 2017"
        await since(
            'The show data grid at row "17276" and column "1" should have element "Aug 2017", instead we have #{actual}'
        )
            .expect(await showDataDialog.getCellInshowDataGrid(17276, 1).getText())
            .toBe('Aug 2017');

        // When I close the show data dialog
        await showDataDialog.closeShowDataDialog();

        // Then The editor with title "Show Data" is closed
        await since('The editor with title "Show Data" should be closed, instead it is still open')
            .expect(await dossierMojo.getMojoEditorWithTitle('Show Data').isExisting())
            .toBe(false);
    });

    it('[TC71097] Functional validation of Show Data in Modern (AG) Grid authoring and consumption modes | Regression', async () => {
        // When I open dossier by its ID "5758C80ECD49243BCCE5E4A40DBF902D"
        await libraryPage.editDossierByUrl({
            projectId: AGGridShowData2.project.id,
            dossierId: AGGridShowData2.id,
        });

        // When I right click on value "EMEA" and select "Show Data..." from ag-grid "Visualization 1"
        await agGridVisualization.openContextMenuItemForValue('EMEA', 'Show Data...', 'Visualization 1');

        // Then An editor shows up with title "Show Data"
        await since('An editor with title "Show Data" should be displayed')
            .expect(await dossierMojo.getMojoEditorWithTitle('Show Data').isDisplayed())
            .toBe(true);

        // And It shows there are "3" rows of data in the show data dialog
        await since('The show data dialog should have 3 rows of data, instead we have #{actual}')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(3);

        // Then The show data grid has element "Chairs"
        await since('The show data grid should have element "Chairs"')
            .expect(await showDataDialog.getObjectForShowDataGrid('Chairs').isDisplayed())
            .toBe(true);

        // And The show data grid has element "EMEA"
        await since('The show data grid should have element "EMEA"')
            .expect(await showDataDialog.getObjectForShowDataGrid('EMEA').isDisplayed())
            .toBe(true);

        // And The show data grid does not have element "NAM"
        await since('The show data grid should not have element "NAM"')
            .expect(await showDataDialog.getObjectForShowDataGrid('NAM').isDisplayed())
            .toBe(false);

        // And the show data grid cell at "1", "1" has text "2019"
        await since('The show data grid cell at "1", "1" should have text "2019"')
            .expect(await showDataDialog.getGridCellByPosition('1', '1').getText())
            .toBe('2019');

        // When I sort the show data grid by clicking on header "Year"
        await showDataDialog.sortShowDataGridbyClickingHeader('Year');
        // And I sort the show data grid by clicking on header "Year"
        await showDataDialog.sortShowDataGridbyClickingHeader('Year');

        // Then the show data grid cell at "1", "1" has text "2021"
        await since('the show data grid cell at "1", "1" should have 2021, instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 1).getText())
            .toBe('2021');

        // When I select these "Category" units in add data option
        await showDataDialog.selectUnitsInUnitSelectionPopup('Category');

        // And I apply and close add data option
        await showDataDialog.applyAndCloseUnitSelectionPopup();

        // Then The show data grid does not have element "Chairs"
        await since('The show data grid should not have element "Chairs"')
            .expect(await showDataDialog.getObjectForShowDataGrid('Chairs').isDisplayed())
            .toBe(false);

        // When I add the show data grid as visualization
        await showDataDialog.addGridToViz();

        // Then the grid cell in ag-grid "Visualization" at "1", "0" has text "2021"
        await since('the grid cell in ag-grid "Visualization" at "2", "1" should have 2021, instead we have #{actual}')
            .expect(await agGridVisualization.getGridCellByPosition(2, 1, 'Visualization').getText())
            .toBe('2021');

        // When I rename the visualization "Visualization" to "Step 3" by double clicking the title
        await vizPanelForGrid.renameVisualizationByDoubleClick('Visualization', 'Step 3');

        // Then The container "Step 3" should be selected
        await since('The container "Step 3" should be selected')
            .expect(await agGridVisualization.getSelectedContainer('Step 3').isExisting())
            .toBe(true);

        // When I right click on value "$505,042" and select "Show Data..." from ag-grid "Visualization 1"
        await agGridVisualization.openContextMenuItemForValue('$505,042', 'Show Data...', 'Visualization 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then An editor shows up with title "Show Data"
        await since('An editor should show up with title "Show Data"')
            .expect(await dossierMojo.getMojoEditorWithTitle('Show Data').isExisting())
            .toBe(true);

        // And It shows there are "1" rows of data in the show data dialog
        await since('It should show there are "1" rows of data in the show data dialog, instead we have #{actual}')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(1);

        // And the show data grid cell at "1", "0" has text "2019"
        await since('The show data grid cell at "1", "0" should have text "2019", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 0).getText())
            .toBe('2019');

        // And the show data grid cell at "1", "1" has text "Calculation 1"
        await since('The show data grid cell at "1", "1" should have text "Calculation 1", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 1).getText())
            .toBe('Calculation 1');

        // And the show data grid cell at "1", "2" has text "$505,042"
        await since('The show data grid cell at "1", "2" should have text "$505,042", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 2).getText())
            .toBe('$505,042');

        // When I select these "Profit" units in add data option
        await showDataDialog.selectUnitsInUnitSelectionPopup('Profit');

        // And I apply and close add data option
        await showDataDialog.applyAndCloseUnitSelectionPopup();

        // Then The show data grid has element "$1,268,951"
        await since('The show data grid should have element "$1,268,951"')
            .expect(await showDataDialog.getObjectForShowDataGrid('$1,268,951').isExisting())
            .toBe(true);

        // When I add the show data grid as visualization
        await showDataDialog.addGridToViz();

        // Then the grid cell in ag-grid "Visualization" at "1", "3" has text "$1,268,951"
        await since('The grid cell in ag-grid "Visualization" at "2", "4" should have text "$1,268,951"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 4, 'Visualization').getText())
            .toBe('$1,268,951');
        // When I rename the visualization "Visualization" to "Step 5" by double clicking the title
        await vizPanelForGrid.renameVisualizationByDoubleClick('Visualization', 'Step 5');

        // Then The container "Step 5" should be selected
        await since('The container "Step 5" should be selected')
            .expect(await agGridVisualization.getSelectedContainer('Step 5').isExisting())
            .toBe(true);

        // When I right click on microchart cell at "2", "5" and select "Show Data..." from ag-grid "Visualization 1"
        await agGridVisualization.openRMCMenuForMicrochartAtPositionAndSelectFromCM(
            2,
            5,
            'Visualization 1',
            'Show Data...'
        );

        // Then It shows there are "5" rows of data in the show data dialog
        await since('It shows there are "5" rows of data in the show data dialog')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(5);

        // And the show data grid cell at "1", "0" has text "Finance"
        await since('the show data grid cell at "1", "0" has text "Finance"')
            .expect(await showDataDialog.getGridCellByPosition(1, 0).getText())
            .toBe('Finance');

        // And the show data grid cell at "1", "1" has text "2019"
        await since('the show data grid cell at "1", "1" has text "2019"')
            .expect(await showDataDialog.getGridCellByPosition(1, 1).getText())
            .toBe('2019');

        // And the show data grid cell at "1", "2" has text "Calculation 1"
        await since('the show data grid cell at "1", "2" has text "Calculation 1"')
            .expect(await showDataDialog.getGridCellByPosition(1, 2).getText())
            .toBe('Calculation 1');

        // And the show data grid cell at "1", "3" has text "$0"
        await since('the show data grid cell at "1", "3" has text "$0"')
            .expect(await showDataDialog.getGridCellByPosition(1, 3).getText())
            .toBe('$0');

        // When I close the show data dialog
        await showDataDialog.closeShowDataDialog();

        // And I right click on microchart cell at "4", "5" and select "Show Data..." from ag-grid "Visualization 1"
        await agGridVisualization.openRMCMenuForMicrochartAtPositionAndSelectFromCM(
            4,
            5,
            'Visualization 1',
            'Show Data...'
        );

        // Then It shows there are "3" rows of data in the show data dialog
        await since('It shows there are "3" rows of data in the show data dialog')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(3);

        // And the show data grid cell at "1", "0" has text "Entertainment and Media"
        await since('the show data grid cell at "1", "0" has text "Entertainment and Media", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 0).getText())
            .toBe('Entertainment and Media');
        // And the show data grid cell at "1", "1" has text "2020"
        await since('showDataDialog.getGridCellByPosition(1, 1) should have 2020, instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 1).getText())
            .toBe('2020');

        // And the show data grid cell at "1", "2" has text "Calculation 1"
        await since('showDataDialog.getGridCellByPosition(1, 2) should have Calculation 1, instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 2).getText())
            .toBe('Calculation 1');

        // And the show data grid cell at "1", "3" has text "$200,000"
        await since('showDataDialog.getGridCellByPosition(1, 3) should have $200,000, instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 3).getText())
            .toBe('$200,000');

        // When I select these "Industry,Product ($)" units in add data option
        await showDataDialog.selectUnitsInUnitSelectionPopup('Industry,Product ($)');

        // And I apply and close add data option
        await showDataDialog.applyAndCloseUnitSelectionPopup();

        // Then the show data grid cell at "1", "0" has text "2020"
        await since('showDataDialog.getGridCellByPosition(1, 0) should have 2020, instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 0).getText())
            .toBe('2020');

        // And the show data grid cell at "1", "1" has text "Calculation 1"
        await since('showDataDialog.getGridCellByPosition(1, 1) should have Calculation 1, instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 1).getText())
            .toBe('Calculation 1');

        // And the show data grid cell at "1", "2" has text "$200,000"
        await since('showDataDialog.getGridCellByPosition(1, 2) should have $200,000, instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 2).getText())
            .toBe('$200,000');

        // And the show data grid cell at "1", "3" has text "$4,336,235"
        await since('showDataDialog.getGridCellByPosition(1, 3) should have $4,336,235, instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 3).getText())
            .toBe('$4,336,235');

        // When I close the show data dialog
        await showDataDialog.closeShowDataDialog();

        // When I right click on microchart cell at "2", "6" and select "Show Data..." from ag-grid "Visualization 1"
        await agGridVisualization.openRMCMenuForMicrochartAtPositionAndSelectFromCM(
            2,
            6,
            'Visualization 1',
            'Show Data...'
        );

        // Then It shows there are "4" rows of data in the show data dialog
        await since('Row count should be 4')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(4);

        // And the show data grid cell at "1", "0" has text "2019 Q1"
        await since('Grid cell at (1, 0) should have text "2019 Q1", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 0).getText())
            .toBe('2019 Q1');

        // And the show data grid cell at "1", "1" has text "2019"
        await since('Grid cell at (1, 1) should have text "2019", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 1).getText())
            .toBe('2019');

        // And the show data grid cell at "1", "2" has text "Calculation 1"
        await since('Grid cell at (1, 2) should have text "Calculation 1", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 2).getText())
            .toBe('Calculation 1');

        // And the show data grid cell at "1", "3" has text "$180,000"
        await since('Grid cell at (1, 3) should have text "$180,000", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 3).getText())
            .toBe('$180,000');

        // And the show data grid cell at "2", "3" has text "$86,542"
        await since('Grid cell at (2, 3) should have text "$86,542", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(2, 3).getText())
            .toBe('$86,542');

        // And the show data grid cell at "3", "3" has text "$135,000"
        await since('Grid cell at (3, 3) should have text "$135,000", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(3, 3).getText())
            .toBe('$135,000');

        // And the show data grid cell at "4", "3" has text "$103,500"
        await since('Grid cell at (4, 3) should have text "$103,500", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(4, 3).getText())
            .toBe('$103,500');

        // When I sort the show data grid by clicking on header "Maintenance ($)"
        await showDataDialog.sortShowDataGridbyClickingHeader('Maintenance ($)');
        await since('Grid cell at (1, 3) should have text "$86,542" after sorting, instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 3).getText())
            .toBe('$86,542');
        // And the show data grid cell at "4", "3" has text "$180,000"
        await since('Grid cell at row 4, col 3 should have text $180,000, instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(4, 3).getText())
            .toBe('$180,000');

        // When I close the show data dialog
        await showDataDialog.closeShowDataDialog();

        // When I right click on microchart cell at "2", "7" and select "Show Data..." from ag-grid "Visualization 1"
        await agGridVisualization.openRMCMenuForMicrochartAtPositionAndSelectFromCM(
            2,
            7,
            'Visualization 1',
            'Show Data...'
        );

        // Then It shows there are "1" rows of data in the show data dialog
        await since('There should be 1 row of data in the show data dialog, instead we have #{actual}')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(1);

        // And the show data grid cell at "1", "0" has text "2019"
        await since('Grid cell at row 1, col 0 should have text 2019, instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 0).getText())
            .toBe('2019');

        // And the show data grid cell at "1", "1" has text "Calculation 1"
        await since('Grid cell at row 1, col 1 should have text Calculation 1, instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 1).getText())
            .toBe('Calculation 1');

        // And the show data grid cell at "1", "2" has text "$505,042"
        await since('Grid cell at row 1, col 2 should have text $505,042, instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 2).getText())
            .toBe('$505,042');

        // And the show data grid cell at "1", "3" has text "$165,279"
        await since('Grid cell at row 1, col 3 should have text $165,279, instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 3).getText())
            .toBe('$165,279');

        // And the show data grid cell at "1", "4" has text "$1,268,951"
        await since('Grid cell at row 1, col 4 should have text $1,268,951, instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 4).getText())
            .toBe('$1,268,951');

        // When I select these "Maintenance ($),Forecast ($),Profit,Product ($)" units in add data option
        await showDataDialog.selectUnitsInUnitSelectionPopup('Maintenance ($),Forecast ($),Profit,Product ($)');

        // And I apply and close add data option
        await showDataDialog.applyAndCloseUnitSelectionPopup();
        // Then the show data grid cell at "1", "2" has text "$3,075,000"
        await since('the show data grid cell at "1", "2" should have text "$3,075,000"')
            .expect(await showDataDialog.getGridCellByPosition(1, 2).getText())
            .toBe('$3,075,000');

        // When I add the show data grid as visualization
        await showDataDialog.addGridToViz();

        // Then the grid cell in ag-grid "Visualization" at "1", "2" has text "$3,075,000"
        await since('the grid cell in ag-grid "Visualization" at "2", "3" should have text "$3,075,000"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 3, 'Visualization').getText())
            .toBe('$3,075,000');

        // When I rename the visualization "Visualization" to "Step 11" by double clicking the title
        await vizPanelForGrid.renameVisualizationByDoubleClick('Visualization', 'Step 11');

        // Then The container "Step 11" should be selected
        await since('The container "Step 11" should be selected')
            .expect(await agGridVisualization.getSelectedContainer('Step 11').isExisting())
            .toBe(true);

        // When I click on the context menu of contaier "Visualization 1" and select option "Show Data"
        await agGridVisualization.openContextMenu('Visualization 1');
        await agGridVisualization.selectContextMenuOption('Show Data');

        // Then It shows there are "11" rows of data in the show data dialog
        await since('It shows there are "11" rows of data in the show data dialog')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(11);

        // And the show data grid cell at "1", "0" has text "Chairs"
        await since('the show data grid cell at "1", "0" should have text "Chairs"')
            .expect(await showDataDialog.getGridCellByPosition(1, 0).getText())
            .toBe('Chairs');

        // And the show data grid cell at "1", "1" has text "2019"
        await since('the show data grid cell at "1", "1" should have text "2019"')
            .expect(await showDataDialog.getGridCellByPosition(1, 1).getText())
            .toBe('2019');

        // And the show data grid cell at "1", "2" has text "Calculation 1"
        await expectResult(
            'the show data grid cell at "1", "2" should have text "Calculation 1"',
            await showDataDialog.getGridCellByPosition(1, 2).getText()
        ).toBe('Calculation 1');
        // And the show data grid cell at "1", "3" has text "$165,279"
        await expectResult(
            'show data grid cell at "1", "3" should have $165,279',
            await showDataDialog.getGridCellByPosition(1, 3).getText()
        ).toBe('$165,279');

        // And the show data grid cell at "1", "4" has text "$3,580,042"
        await expectResult(
            'show data grid cell at "1", "4" should have $3,580,042',
            await showDataDialog.getGridCellByPosition(1, 4).getText()
        ).toBe('$3,580,042');

        // When I select AG grid column set "Column Set 2" to display its data
        await showDataDialog.changeColumnSetInAgGrid('Column Set 2');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then It shows there are "11" rows of data in the show data dialog
        await expectResult('show data dialog should have 11 rows', await showDataDialog.getDatasetRowCount()).toBe(11);

        // And the show data grid cell at "1", "0" has text "2019"
        await expectResult(
            'show data grid cell at "1", "0" should have 2019',
            await showDataDialog.getGridCellByPosition(1, 0).getText()
        ).toBe('2019');

        // And the show data grid cell at "1", "1" has text "Calculation 1"
        await expectResult(
            'show data grid cell at "1", "1" should have Calculation 1',
            await showDataDialog.getGridCellByPosition(1, 1).getText()
        ).toBe('Calculation 1');

        // And the show data grid cell at "1", "2" has text "$505,042"
        await expectResult(
            'show data grid cell at "1", "2" should have $505,042',
            await showDataDialog.getGridCellByPosition(1, 2).getText()
        ).toBe('$505,042');

        // When I select AG grid column set "Parts ($) Trend by Industry" to display its data
        await showDataDialog.changeColumnSetInAgGrid('Parts ($) Trend by Industry');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then It shows there are "37" rows of data in the show data dialog
        await expectResult('show data dialog should have 37 rows', await showDataDialog.getDatasetRowCount()).toBe(37);

        // And the show data grid cell at "1", "0" has text "Consulting"
        await since('show data grid cell at "1", "0" should have Consulting, instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 0).getText())
            .toBe('Consulting');
        // And the show data grid cell at "1", "1" has text "2020"
        await since('Grid cell at row 1, col 1 should have text "2020", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 1).getText())
            .toBe('2020');

        // And the show data grid cell at "1", "2" has text "Calculation 2"
        await since('Grid cell at row 1, col 2 should have text "Calculation 2", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 2).getText())
            .toBe('Calculation 2');

        // And the show data grid cell at "1", "3" has text "$0"
        await since('Grid cell at row 1, col 3 should have text "$0", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 3).getText())
            .toBe('$0');

        // And the show data grid cell at "5", "0" has text "Entertainment and Media"
        await since('Grid cell at row 5, col 0 should have text "Entertainment and Media", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(5, 0).getText())
            .toBe('Entertainment and Media');

        // And the show data grid cell at "5", "1" has text "2020"
        await since('Grid cell at row 5, col 1 should have text "2020", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(5, 1).getText())
            .toBe('2020');

        // And the show data grid cell at "5", "2" has text "Calculation 1"
        await since('Grid cell at row 5, col 2 should have text "Calculation 1", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(5, 2).getText())
            .toBe('Calculation 1');

        // And the show data grid cell at "5", "3" has text "$200,000"
        await since('Grid cell at row 5, col 3 should have text "$200,000", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(5, 3).getText())
            .toBe('$200,000');

        // When I select these "Parts ($),Product ($)" units in add data option
        await showDataDialog.selectUnitsInUnitSelectionPopup('Parts ($),Product ($)');

        // And I apply and close add data option
        await showDataDialog.applyAndCloseUnitSelectionPopup();

        // And the show data grid cell at "1", "3" has text "$642,000"
        await since('Grid cell at row 1, col 3 should have text "$642,000", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 3).getText())
            .toBe('$642,000');
        // And the show data grid cell at "5", "3" has text "$1,235,672"
        await since('show data grid cell at "5", "3" should have "$1,235,672", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(5, 3).getText())
            .toBe('$1,235,672');

        // When I select AG grid column set "Column Set 2" to display its data
        await showDataDialog.changeColumnSetInAgGrid('Column Set 2');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then It shows there are "11" rows of data in the show data dialog
        await since('show data dialog should have "11" rows of data, instead we have #{actual}')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(11);

        // When I select AG grid column set "Parts ($) Trend by Industry" to display its data
        await showDataDialog.changeColumnSetInAgGrid('Parts ($) Trend by Industry');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then It shows there are "37" rows of data in the show data dialog
        await since('show data dialog should have "37" rows of data, instead we have #{actual}')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(37);

        // And the show data grid cell at "1", "3" has text "$0"
        await since('show data grid cell at "1", "3" should have "$0", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 3).getText())
            .toBe('$0');

        // And the show data grid cell at "5", "3" has text "$200,000"
        await since('show data grid cell at "5", "3" should have "$200,000", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(5, 3).getText())
            .toBe('$200,000');

        // When I sort the show data grid by clicking on header "Parts ($)"
        await showDataDialog.sortShowDataGridbyClickingHeader('Parts ($)');

        // And I sort the show data grid by clicking on header "Parts ($)"
        await showDataDialog.sortShowDataGridbyClickingHeader('Parts ($)');

        // And I sort the show data grid by clicking on header "Parts ($)"
        await showDataDialog.sortShowDataGridbyClickingHeader('Parts ($)');
        // Then the show data grid cell at "1", "0" has text "Manufacturing"
        await since('Grid cell at row 1, col 0 should have text "Manufacturing", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 0).getText())
            .toBe('Manufacturing');

        // And the show data grid cell at "1", "1" has text "2021"
        await since('Grid cell at row 1, col 1 should have text "2021", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 1).getText())
            .toBe('2021');

        // And the show data grid cell at "1", "2" has text "Calculation 2"
        await since('Grid cell at row 1, col 2 should have text "Calculation 2", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 2).getText())
            .toBe('Calculation 2');

        // And the show data grid cell at "1", "3" has text "($100,000)"
        await since('Grid cell at row 1, col 3 should have text "($100,000)", instead we have #{actual}')
            .expect(await showDataDialog.getGridCellByPosition(1, 3).getText())
            .toBe('($100,000)');

        // When I sort the show data grid by clicking on header "Year"
        await showDataDialog.sortShowDataGridbyClickingHeader('Year');

        // Then the show data grid cell at "1", "0" has text "Finance"
        await expectResult(
            'Grid cell at row 1, col 0 should have text "Finance"',
            await showDataDialog.getGridCellByPosition(1, 0).getText()
        ).toBe('Finance');

        // And the show data grid cell at "1", "1" has text "2019"
        await expectResult(
            'Grid cell at row 1, col 1 should have text "2019"',
            await showDataDialog.getGridCellByPosition(1, 1).getText()
        ).toBe('2019');

        // And the show data grid cell at "1", "2" has text "Calculation 1"
        await expectResult(
            'Grid cell at row 1, col 2 should have text "Calculation 1"',
            await showDataDialog.getGridCellByPosition(1, 2).getText()
        ).toBe('Calculation 1');

        // And the show data grid cell at "1", "3" has text "$0"
        await expectResult(
            'Grid cell at row 1, col 3 should have text "$0"',
            await showDataDialog.getGridCellByPosition(1, 3).getText()
        ).toBe('$0');

        // When I add the show data grid as visualization
        await showDataDialog.addGridToViz();
        // Then the grid cell in ag-grid "Visualization" at "1", "0" has text "Finance"
        await expectResult(
            'Grid cell in ag-grid "Visualization" at "2", "1" should have text "Finance"',
            await agGridVisualization.getGridCellByPosition(2, 1, 'Visualization').getText()
        ).toBe('Finance');

        // And the grid cell in ag-grid "Visualization" at "1", "1" has text "2019"
        await expectResult(
            'Grid cell in ag-grid "Visualization" at "2", "2" should have text "2019"',
            await agGridVisualization.getGridCellByPosition(2, 2, 'Visualization').getText()
        ).toBe('2019');

        // And the grid cell in ag-grid "Visualization" at "1", "2" has text "Calculation 1"
        await expectResult(
            'Grid cell in ag-grid "Visualization" at "1", "2" should have text "Calculation 1"',
            await agGridVisualization.getGridCellByPosition(2, 3, 'Visualization').getText()
        ).toBe('Calculation 1');

        // And the grid cell in ag-grid "Visualization" at "1", "3" has text "$0"
        await expectResult(
            'Grid cell in ag-grid "Visualization" at "1", "3" should have text "$0"',
            await agGridVisualization.getGridCellByPosition(2, 4, 'Visualization').getText()
        ).toBe('$0');

        // When I rename the visualization "Visualization" to "Step 13" by double clicking the title
        await vizPanelForGrid.renameVisualizationByDoubleClick('Visualization', 'Step 13');

        // Then The container "Step 13" should be selected
        await since('The container "Step 13" should be selected')
            .expect(await agGridVisualization.getSelectedContainer('Step 13').isExisting())
            .toBe(true);
    });
});
