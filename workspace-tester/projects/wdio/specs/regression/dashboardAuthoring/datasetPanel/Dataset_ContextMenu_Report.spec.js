import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';
import * as gridConstants from '../../../../constants/grid.js';
import { dossier } from '../../../../constants/teams.js';

describe('Dataset_ContextMenu_Report', () => {
    const Dataset_ContextMenu_Report = {
        id: 'E224424FA4484D4321C81893F5B4C009',
        name: 'Auto_DatasetContextMenu_Report',
        project: {
            id: 'B628A31F11E7BD953EAE0080EF0583BD',
            name: 'New MicroStrategy Tutorial',
        },
    };
    let {
        datasetPanel,
        libraryPage,
        loginPage,
        dossierAuthoringPage,
        dossierPage,
        dossierMojo,
        grid,
        baseContainer,
        datasetsPanel,
        derivedMetricEditor,
        existingObjectsDialog,
        agGridVisualization,
        showDataDialog,
        editorPanelForGrid,
        vizPanelForGrid,
        derivedAttributeEditor,
        libraryAuthoringPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC60993_1] Test the context menu of Report dataset_Edit, Show data, Join, Replace', async () => {
        // Create dashboard with Report dataset
        await libraryPage.editDossierByUrl({
            projectId: Dataset_ContextMenu_Report.project.id,
            dossierId: Dataset_ContextMenu_Report.id,
        });

        // 1.1 Edit dataset - Normal Mode
        await datasetPanel.chooseDatasetContextMenuOption('Report_01_Simple', 'Edit Dataset...');
        await since(
            'The editor shows up with title "Edit Dataset - Report_01_Simple", should be #{expected},instead we have #{actual}'
        )
            .expect(await dossierMojo.isMoJoEditorWithTitleDisplayed('Edit Dataset - Report_01_Simple'))
            .toBe(true);
        await existingObjectsDialog.sleep(5000);
        await existingObjectsDialog.expandFolder('Geography');
        await existingObjectsDialog.doubleClickOnObject('Region');
        await since(
            'The object "Region" is added to the dataset container, should be #{expected},instead we have #{actual}'
        )
            .expect(await existingObjectsDialog.isObjectDisplayedinDSContainer('Region'))
            .toBe(true);

        await existingObjectsDialog.selectMetricsFromDropdown();
        await existingObjectsDialog.expandFolder('Sales Metrics');
        await existingObjectsDialog.expandFolder('Conditional Sales Metrics');
        await existingObjectsDialog.doubleClickOnObject('Non-Web Sales');
        await since(
            'The object "Non-Web Sales" is added to the dataset container, should be #{expected},instead we have #{actual}'
        )
            .expect(await existingObjectsDialog.isObjectDisplayedinDSContainer('Non-Web Sales'))
            .toBe(true);
        await existingObjectsDialog.clickOnBtn('Update Dataset');
        await datasetPanel.editDatasetNotification('Keep Changes Local');
        await dossierAuthoringPage.waitForAuthoringPageLoading();

        // Verify objects were added
        await since(
            'The editor shows up with title "Edit Dataset - Report_01_Simple", should be #{expected},instead we have #{actual}'
        )
            .expect(await dossierMojo.isMoJoEditorWithTitleDisplayed('Edit Dataset - Report_01_Simple'))
            .toBe(false);
        await since('Region attribute should be in Report_01_Simple dataset')
            .expect(await datasetPanel.isObjectFromDSdisplayed('Region', 'attribute', 'Report_01_Simple'))
            .toBe(true);
        await since('Non-Web Sales metric should be in Report_01_Simple dataset')
            .expect(await datasetPanel.isObjectFromDSdisplayed('Non-Web Sales', 'metric', 'Report_01_Simple'))
            .toBe(true);

        // Test Undo
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since('Region attribute should not be in dataset after undo')
            .expect(await datasetPanel.isObjectFromDSdisplayed('Region', 'attribute', 'Report_01_Simple'))
            .toBe(false);
        await since('Non-Web Sales metric should not be in dataset after undo')
            .expect(await datasetPanel.isObjectFromDSdisplayed('Non-Web Sales', 'metric', 'Report_01_Simple'))
            .toBe(false);

        // Test Redo
        await dossierAuthoringPage.actionOnToolbar('Redo');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since('Region attribute should be in dataset after redo')
            .expect(await datasetPanel.isObjectFromDSdisplayed('Region', 'attribute', 'Report_01_Simple'))
            .toBe(true);
        await since('Non-Web Sales metric should be in dataset after redo')
            .expect(await datasetPanel.isObjectFromDSdisplayed('Non-Web Sales', 'metric', 'Report_01_Simple'))
            .toBe(true);

        // 1.2 Show Data in normal mode and Undo/redo
        await datasetPanel.chooseDatasetContextMenuOption('Report_01_Simple', 'Show Data...');
        await since(
            'There are "84" rows of data in the show data dialog, should be #{expected},instead we have #{actual}'
        )
            .expect(await showDataDialog.isRowCountEqual('84'))
            .toBe(true);
        // add show data to visualization
        await showDataDialog.addGridToViz();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since('The editor shows up with title "Show Data", should be #{expected},instead we have #{actual}')
            .expect(await dossierMojo.isMoJoEditorWithTitleDisplayed('Show Data'))
            .toBe(false);
        await since('The ag-grid cell in "Visualization" at "2", "2" should have text "USA", instead we have #{actual}')
            .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 2, 'Visualization', 'USA'))
            .toBe(true);

        // Test Undo
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since('The container "Visualization 1" should be selected after undo')
            .expect(await grid.isContainerSelected('Visualization 1'))
            .toBe(true);

        // Test Redo
        await dossierAuthoringPage.actionOnToolbar('Redo');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since('The grid cell in "Visualization" at "2", "2" should have text "USA", instead we have #{actual}')
            .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 2, 'Visualization', 'USA'))
            .toBe(true);

        // 1.3 Join Behavior
        await datasetPanel.chooseDatasetContextMenuOption('Report_01_Simple', 'Join Behavior');
        await since('The current selected join behavior is #{expected}, instead we have #{actual}')
            .expect(await datasetPanel.getCheckedItemFromCM().getText())
            .toBe('Primary (outer join)');
        await baseContainer.selectSecondaryContextMenuOption('Secondary (inner join)');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await datasetPanel.chooseDatasetContextMenuOption('Report_01_Simple', 'Join Behavior');
        await since('The current selected join behavior is #{expected}, instead we have #{actual}')
            .expect(await datasetPanel.getCheckedItemFromCM().getText())
            .toBe('Secondary (inner join)');

        // 1.4 Replace Dataset With
        await datasetPanel.chooseDatasetContextMenuOption(
            'Report_01_Simple',
            'Replace Dataset With -> Existing Dataset...'
        );
        await dossierMojo.changeFolderPath('Shared Reports');
        await browser.pause(2000);
        await dossierMojo.selectObject('DossierAuthoring');
        await browser.pause(2000);
        await dossierMojo.selectObject('DossierDatasets');
        await browser.pause(2000);
        await dossierMojo.selectObject('Report_01');
        await browser.pause(2000);
        await dossierMojo.clickBtnOnMojoEditor('Select');
        await dossierMojo.clickBtnOnMojoEditor('OK');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since(
            'The dataset "Report_01" is displayed in datasets panel should be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await datasetPanel.isDatasetDisplayed('Report_01'))
            .toBe(true);
        await since(
            'The dataset "Report_01_Simple" is not displayed in datasets panel should be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await datasetPanel.isDatasetDisplayed('Report_01_Simple'))
            .toBe(false);

        // Test Undo
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since(
            'The dataset "Report_01_Simple" is displayed in datasets panel should be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await datasetPanel.isDatasetDisplayed('Report_01_Simple'))
            .toBe(true);
        await since(
            'The dataset "Report_01" is not displayed in datasets panel should be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await datasetPanel.isDatasetDisplayed('Report_01'))
            .toBe(false);

        // Test Redo
        await dossierAuthoringPage.actionOnToolbar('Redo');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since(
            'The dataset "Report_01" is displayed in datasets panel should be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await datasetPanel.isDatasetDisplayed('Report_01'))
            .toBe(true);
        await since(
            'The dataset "Report_01_Simple" is not displayed in datasets panel should be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await datasetPanel.isDatasetDisplayed('Report_01_Simple'))
            .toBe(false);

        // Undo to get back to Report_01_Simple for next steps
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
    });

    it('[TC60993_2] Test the context menu of Report dataset_Add Metric, Attribute', async () => {
        // Create dashboard with Report dataset
        await libraryPage.editDossierByUrl({
            projectId: Dataset_ContextMenu_Report.project.id,
            dossierId: Dataset_ContextMenu_Report.id,
        });

        // 1.5 Create Metric
        await datasetPanel.createDMorDA('Report_01_Simple', 'Metric');
        await browser.pause(2000);
        await since('The derived metric editor is displayed, should be #{expected}, instead we have #{actual}')
            .expect(await (await derivedMetricEditor.derivedMetricEditor).isDisplayed())
            .toBe(true);
        await derivedMetricEditor.switchMode('Formula');
        await datasetsPanel.clickClearFormulaEditorButton();
        await derivedMetricEditor.addFunctionByDoubleClick('Count');
        await dossierPage.sleep(2000);
        await derivedMetricEditor.addObjectByDoubleClick('Profit');
        await since('"Count(Profit)" is displayed on the "Input" section of the Metrics panel')
            .expect(await derivedMetricEditor.getMetricDefinition())
            .toEqual('Count(Profit)');
        await derivedMetricEditor.validateMetric();
        await since('"Valid metric formula." is displayed on the "Validation" section of the Metrics panel')
            .expect(await derivedMetricEditor.validationStatusText)
            .toEqual('Valid metric formula.');
        await derivedMetricEditor.saveMetric();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since('New Metric should be present in dataset')
            .expect(await datasetPanel.isObjectFromDSdisplayed('New Metric', 'derived metric', 'Report_01_Simple'))
            .toBe(true);

        // Test Undo
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since('New Metric should not be present after undo')
            .expect(await datasetPanel.isObjectFromDSdisplayed('New Metric', 'derived metric', 'Report_01_Simple'))
            .toBe(false);

        // Test Redo
        await dossierAuthoringPage.actionOnToolbar('Redo');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since('New Metric should be present after redo')
            .expect(await datasetPanel.isObjectFromDSdisplayed('New Metric', 'derived metric', 'Report_01_Simple'))
            .toBe(true);

        // Add metric to visualization
        await datasetPanel.addObjectToVizByDoubleClick('Category', 'attribute', 'Report_01_Simple');
        await datasetPanel.addObjectToVizByDoubleClick('New Metric', 'metric', 'Report_01_Simple');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since('The editor panel should have "metric" named "New Metric" on "Metrics" section')
            .expect(await editorPanelForGrid.getObjectFromSection('New Metric', 'derived metric', 'Metrics').isExisting())
            .toBe(true);
        await since('the grid cell in visualization "Visualization 1" at "2", "2" has text "6"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('6');

        // 1.6 Create Attribute
        await datasetPanel.createDMorDA('Report_01_Simple', 'Attribute');
        await browser.pause(2000);
        await since('The derived attribute editor is displayed, should be #{expected}, instead we have #{actual}')
            .expect(await (await derivedAttributeEditor.derivedAttributeEditor).isDisplayed())
            .toBe(true);
        await derivedAttributeEditor.addObjectByDoubleClick('Category');
        await derivedAttributeEditor.selectFormFromDropdown('ID');
        await since(
            'The derived attribute definition in "Input" section should be #{expected}, instead we have #{actual}'
        )
            .expect(await derivedAttributeEditor.getAttributeFormDefinition())
            .toBe('Category@ID');
        await derivedAttributeEditor.validateForm();
        await since('The string displayed in "Validation" section should be #{expected}, instead we have #{actual}')
            .expect(await derivedAttributeEditor.validationStatusText)
            .toBe('Valid Formula.');
        await derivedAttributeEditor.setAttributeName('New Category');
        await derivedAttributeEditor.saveAttribute();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since(
            'Derived attribute "New Category" displays on dataset panel under "Report_01_Simple", should be #{expected}, instead we have #{actual}'
        )
            .expect(await datasetPanel.isObjectFromDSdisplayed('New Category', 'derived attribute', 'Report_01_Simple'))
            .toBe(true);

        // Test Undo
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since('New Category should not be present after undo')
            .expect(await datasetPanel.isObjectFromDSdisplayed('New Category', 'derived attribute', 'Report_01_Simple'))
            .toBe(false);

        // Test Redo
        await dossierAuthoringPage.actionOnToolbar('Redo');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since('New Category should be present after redo')
            .expect(await datasetPanel.isObjectFromDSdisplayed('New Category', 'derived attribute', 'Report_01_Simple'))
            .toBe(true);
    });

    it('[TC60993_3] Test the context menu of Report dataset_Rename, Delete', async () => {
        // Create dashboard with Report dataset
        await libraryPage.editDossierByUrl({
            projectId: Dataset_ContextMenu_Report.project.id,
            dossierId: Dataset_ContextMenu_Report.id,
        });
        await datasetPanel.chooseDatasetContextMenuOption('Report_01_Simple', 'Edit Dataset...');
        await since(
            'The editor shows up with title "Edit Dataset - Report_01_Simple", should be #{expected},instead we have #{actual}'
        )
            .expect(await dossierMojo.isMoJoEditorWithTitleDisplayed('Edit Dataset - Report_01_Simple'))
            .toBe(true);
        await existingObjectsDialog.sleep(5000);
        await existingObjectsDialog.expandFolder('Geography');
        await existingObjectsDialog.doubleClickOnObject('Region');
        await since(
            'The object "Region" is added to the dataset container, should be #{expected},instead we have #{actual}'
        )
            .expect(await existingObjectsDialog.isObjectDisplayedinDSContainer('Region'))
            .toBe(true);
        await existingObjectsDialog.clickOnBtn('Update Dataset');
        await datasetPanel.editDatasetNotification('Keep Changes Local');
        await dossierAuthoringPage.waitForAuthoringPageLoading();

        // 1.7 Rename - only managed dataset has rename option
        await datasetPanel.renameDataset('Report_01_Simple', 'DossierDS_Report');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since(
            'The dataset "DossierDS_Report" is displayed in datasets panel should be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await datasetPanel.isDatasetDisplayed('DossierDS_Report'))
            .toBe(true);
        await since(
            'The dataset "Report_01_Simple" is displayed in datasets panel should be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await datasetPanel.isDatasetDisplayed('Report_01_Simple'))
            .toBe(false);
        // Test Undo
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since(
            'The dataset "Report_01_Simple" is displayed in datasets panel should be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await datasetPanel.isDatasetDisplayed('Report_01_Simple'))
            .toBe(true);
        await since(
            'The dataset "DossierDS_Report" is displayed in datasets panel should be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await datasetPanel.isDatasetDisplayed('DossierDS_Report'))
            .toBe(false);
        // Test Redo
        await dossierAuthoringPage.actionOnToolbar('Redo');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since(
            'The dataset "DossierDS_Report" is displayed in datasets panel should be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await datasetPanel.isDatasetDisplayed('DossierDS_Report'))
            .toBe(true);
        await since(
            'The dataset "Report_01_Simple" is displayed in datasets panel should be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await datasetPanel.isDatasetDisplayed('Report_01_Simple'))
            .toBe(false);

        // 1.8 Delete
        await datasetPanel.chooseDatasetContextMenuOption('DossierDS_Report', 'Delete');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await takeScreenshotByElement(datasetsPanel.getDatasetsPanel(), 'TC60993_3_1', 'Empty_Dataset is deleted');

        // Test Undo
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since('DossierDS_Report dataset should be present after undo')
            .expect(await datasetPanel.isDatasetDisplayed('DossierDS_Report'))
            .toBe(true);

        // Test Redo
        await dossierAuthoringPage.actionOnToolbar('Redo');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since('Datasets panel should be empty after redo')
            .expect(await datasetPanel.isDatasetDisplayed('DossierDS_Report'))
            .toBe(false);

        // Undo to restore dataset for save test
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since('DossierDS_Report dataset should be restored for save test')
            .expect(await datasetPanel.isDatasetDisplayed('DossierDS_Report'))
            .toBe(true);
    });

    it('[TC60993_4] Test the context menu of Report dataset_Save as', async () => {
        // Create dashboard with Report dataset
        await libraryPage.editDossierByUrl({
            projectId: Dataset_ContextMenu_Report.project.id,
            dossierId: Dataset_ContextMenu_Report.id,
        });
        // 1.9 Save Dataset
        await datasetPanel.chooseDatasetContextMenuOption('DossierDS_Report', 'Save Dataset...');
        await browser.pause(2000);
        await datasetPanel.changeNameInDatasetSaveAsDialog('DossierDS_Report_Save');
        await datasetPanel.saveAsDataset();
        // Verify success and close success dialog if it appears
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since('DossierDS_Report_Save dataset should be present after save')
            .expect(await datasetPanel.isDatasetDisplayed('DossierDS_Report_Save'))
            .toBe(true);
    });
});
