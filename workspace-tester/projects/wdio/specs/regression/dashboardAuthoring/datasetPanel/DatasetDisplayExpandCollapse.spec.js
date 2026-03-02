import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import ExistingObjectsDialog from '../../../../pageObjects/authoring/ExistingObjectsDialog.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import Toolbar from '../../../../pageObjects/dossierEditor/Toolbar.js';
import resetDossierState from '../../../../api/resetDossierState.js';
import * as consts from '../../../../constants/visualizations.js';

const SCREENSHOT_OPTIONS = { tolerance: 0.2 };

describe('Dataset Display: Expand/Collapse, Flat/Table View', () => {
    const combinedDatasetName = 'airline-sample-data.xls retail-sample-data.xls (2 tables)';
    const airlineDatasetName = 'airline-sample-data.xls';
    const newDatasetName = 'New Dataset 1';

    const tutorialProject = {
        id: 'B628A31F11E7BD953EAE0080EF0583BD',
        name: 'New MicroStrategy Tutorials',
    };
    const dossier = {
        id: '87E68C2DFA4D5D61955FEBA16437D951',
        name: 'TC60987',
        project: tutorialProject,
    };

    let { loginPage, libraryPage, libraryAuthoringPage, dossierPage, dossierAuthoringPage, datasetsPanel } =
        browsers.pageObj1;

    let existingObjectsDialog = new ExistingObjectsDialog();
    let toolbar = new Toolbar();

    async function screenshotDatasetPanel(testId, stepName, option = SCREENSHOT_OPTIONS) {
        await takeScreenshotByElement(datasetsPanel.getDatasetsPanel(), testId, stepName, option);
    }

    beforeAll(async () => {
        await loginPage.login(consts.tqmsUser.credentials);
        await loginPage.disableTutorial();
        await loginPage.disablePendoTutorial();
        await setWindowSize(browserWindowCustom);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    describe('[TC60987] Dataset Display: Expand/Collapse, Flat/Table View - Acceptance', () => {
        beforeAll(async () => {
            // Reset and reopen dossier
            console.log('Resetting dossier state...');
            await resetDossierState({
                credentials: browsers.params.credentials,
                dossier,
            });
        });

        it('[TC60987-1] should switch between Table View and Flat View', async () => {
            // Empty dataset panel
            await libraryAuthoringPage.createBlankDashboardFromLibrary();
            await datasetsPanel.getDatasetsPanel().waitForDisplayed({ timeout: 50000 });
            await dossierPage.sleep(500);
            await screenshotDatasetPanel('TC60987', '00_EmptyDatasetPanel');

            // Import sample data
            await datasetsPanel.clickNewDataBtnUntilShowDataSource();
            await datasetsPanel.clickDataSourceByIndex(5);
            await datasetsPanel.importSampleFiles([0, 6]);
            await dossierPage.sleep(500);
            await screenshotDatasetPanel('TC60987', '00_AfterImport_FlatView');

            // Change to Table View
            await datasetsPanel.selectContextMenuOption('Table View');
            await dossierPage.sleep(500);
            await screenshotDatasetPanel('TC60987-1', '01_TableView');

            // Switch back to Flat View
            await datasetsPanel.selectContextMenuOption('Flat View');
            await dossierPage.sleep(500);
            await screenshotDatasetPanel('TC60987-1', '02_FlatView');

            // Undo to Table View
            await dossierAuthoringPage.actionOnToolbar('Undo');
            await dossierPage.sleep(500);
            await screenshotDatasetPanel('TC60987-1', '03_UndoToTableView');
        });

        it('[TC60987-2] should collapse and expand all datasets', async () => {
            await libraryPage.editDossierByUrl({
                projectId: tutorialProject.id,
                dossierId: dossier.id,
            });
            await datasetsPanel.getDatasetsPanel().waitForDisplayed({ timeout: 50000 });

            // Ensure we're in Table View
            await datasetsPanel.selectContextMenuOption('Table View');
            await dossierPage.sleep(500);

            // Test Collapse All
            await datasetsPanel.selectContextMenuOption('Collapse All');
            await dossierPage.sleep(500);
            await screenshotDatasetPanel('TC60987-2', '01_CollapseAll');

            // Test Expand All
            await datasetsPanel.selectContextMenuOption('Expand All');
            await dossierPage.sleep(500);
            await screenshotDatasetPanel('TC60987-2', '02_ExpandAll');

            // Collapse parent dataset
            await datasetsPanel.collapseDataset(combinedDatasetName);
            await dossierPage.sleep(500);
            await screenshotDatasetPanel('TC60987-2', '03_CollapseParent');

            // Undo collapse
            await dossierAuthoringPage.actionOnToolbar('Undo');
            await dossierPage.sleep(500);
            await screenshotDatasetPanel('TC60987-2', '04_UndoCollapse');

            // Collapse single dataset (airline)
            await datasetsPanel.collapseDataset(airlineDatasetName);
            await dossierPage.sleep(500);
            await screenshotDatasetPanel('TC60987-2', '05_CollapseSingleDataset');

            // Collapse parent, then expand parent
            await datasetsPanel.collapseDataset(combinedDatasetName);
            await dossierPage.sleep(500);
            await datasetsPanel.expandDataset(combinedDatasetName);
            await dossierPage.sleep(500);
            await screenshotDatasetPanel('TC60987-2', '06_ReExpandParent');

            // Expand airline dataset
            await datasetsPanel.expandDataset(airlineDatasetName);
            await dossierPage.sleep(500);
            await screenshotDatasetPanel('TC60987-2', '07_ExpandSingleDataset');
        });

        it('[TC60987-3] should handle multiple datasets collapse/expand behavior', async () => {
            await libraryPage.editDossierByUrl({
                projectId: tutorialProject.id,
                dossierId: dossier.id,
            });

            // Ensure we're in Table View
            await datasetsPanel.selectContextMenuOption('Table View');

            // Add new dataset from Existing Objects
            await datasetsPanel.selectContextMenuOptionWithHover('Add Data');
            await datasetsPanel.selectSecondaryContextMenuOption('Existing Objects...');

            // Wait for Existing Objects dialog
            await datasetsPanel.waitForElementVisible(existingObjectsDialog.ActiveEditor, { timeout: 10000 });
            await screenshotDatasetPanel('TC60987-4', '01_ExistingObjectsDialog');

            // Expand Time folder and add Month attribute
            await existingObjectsDialog.expandFolder('Time');
            await dossierPage.sleep(500);
            await existingObjectsDialog.doubleClickOnObject('Month');
            await dossierPage.sleep(500);
            await existingObjectsDialog.clickOnBtn('Add');
            await dossierPage.sleep(500);

            // Wait for new dataset to appear
            await browser.waitUntil(
                async () => {
                    return await datasetsPanel.isDatasetPresentByName(newDatasetName);
                },
                { timeout: 15000, timeoutMsg: 'New Dataset 1 not found after 15s' }
            );
            await screenshotDatasetPanel('TC60987-4', '02_NewDatasetAdded');

            // Collapse All with multiple datasets
            await datasetsPanel.selectContextMenuOption('Collapse All');
            await dossierPage.sleep(500);
            await screenshotDatasetPanel('TC60987-4', '03_CollapseAll_MultipleDatasets');

            // Expand parent dataset
            await datasetsPanel.expandDataset(combinedDatasetName);
            await dossierPage.sleep(500);
            await screenshotDatasetPanel('TC60987-4', '04_ExpandParentDataset');

            // Expand New Dataset 1
            await datasetsPanel.expandDataset(newDatasetName);
            await dossierPage.sleep(500);
            await screenshotDatasetPanel('TC60987-4', '05_ExpandNewDataset');
        });
    });

    describe('[TC4992] Dataset Display: Expand/Collapse with Pause Mode - Regression', () => {
        it('[TC4992] should handle Table/Flat View with pause mode and undo/redo operations', async () => {
            await libraryPage.editDossierByUrl({
                projectId: tutorialProject.id,
                dossierId: dossier.id,
            });

            // Step 1: Create Derived Attribute from "Flights Cancelled" metric
            await datasetsPanel.rightClickAttributeMetricAndSelectOption(
                'Flights Cancelled',
                'metric',
                'Duplicate as Attribute'
            );

            // Step 2: Create Derived Metric from "Year" attribute
            await datasetsPanel.rightClickAttributeMetricAndSelectOption('Year', 'attribute', 'Duplicate as Metric');
            await dossierPage.sleep(2000);
            await screenshotDatasetPanel('TC4992', '01_DA_DM');

            // Step 3: Change to Table View and verify
            await datasetsPanel.selectContextMenuOption('Table View');
            await screenshotDatasetPanel('TC4992', '02_TableView');

            // Step 4: Test Undo to Flat View
            await dossierAuthoringPage.actionOnToolbar('Undo');
            await screenshotDatasetPanel('TC4992', '03_UndoToFlatView');

            // Step 5: Test Redo to Table View
            await dossierAuthoringPage.actionOnToolbar('Redo');
            await screenshotDatasetPanel('TC4992', '04_RedoToTableView');

            // Step 6: Activate Pause Mode
            await toolbar.clickButtonFromToolbar('Pause Data Retrieval');

            // Verify Pause Mode is active
            let isPauseMode = await toolbar.isPauseModeActive();
            console.log(`  - Pause Mode active: ${isPauseMode}`);
            await expect(isPauseMode).toBe(true);

            // Step 7: Change to Flat View in Pause Mode
            await datasetsPanel.selectContextMenuOption('Flat View');
            await screenshotDatasetPanel('TC4992', '06_FlatView_PauseMode');

            // Step 8: Undo to Table View in Pause Mode
            await dossierAuthoringPage.actionOnToolbar('Undo');
            await screenshotDatasetPanel('TC4992', '07_UndoToTableView_PauseMode');

            // Step 9: Redo to Flat View in Pause Mode
            await dossierAuthoringPage.actionOnToolbar('Redo');
            await screenshotDatasetPanel('TC4992', '08_RedoToFlatView_PauseMode');

            // Step 10: Resume Data Retrieval
            await toolbar.clickButtonFromToolbar('Resume Data Retrieval');
            await screenshotDatasetPanel('TC4992', '09_ResumeDataRetrieval', { tolerance: 0.5 });
        });
    });
});
