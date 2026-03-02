import { autoDashBrowserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import getProjectInfo from '../../../api/getProjectInfo.js';
import deleteObjectByNames from '../../../api/folderManagement/deleteObjectByNames.js';
import { getMyReportsFolderInfo } from '../../../api/folderManagement/getPredefinedFolder.js';
import createMosaicModelWithSampleFile from '../../../api/dataModel/createDataModelWithSampleFile.js';
import allureReporter from '@wdio/allure-reporter';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { saveElementScreenshotLocal, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { validateAutoDash2Page } from '../../../utils/openAI_autoDash2validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const actualImageFolder = path.resolve(__dirname, '../../../autodash/AutoDash2_E2ESanity');

const project = {
    id: '',
    name: browsers.params.project || 'MicroStrategy Tutorial',
};

const tester = {
    credentials: {
        username: browsers.params.credentials.username || 'admin',
        password: browsers.params.credentials.password || '',
    },
};

const deleteObjectsAfterTest = browsers.params.deleteObjectsAfterTest?.toLowerCase() === 'true';

const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').replace(/\..+/, '').slice(0, 15);

const myReportsFolder = {
    id: '',
};

const mosaicModelInfo = {
    sampleFileName: 'airline-sample-data.xls',
    name: `E2E_AutoDash_MosaicModel_${timestamp}`,
    id: '',
};

const dashboard = {
    name: `E2E_Sanity_AutoDash_${timestamp}`,
};

const mosaicdashboard = {
    name: `E2E_Sanity_AutoDash_Mosaic_${timestamp}`,
};

describe('Auto Dash 2.0 E2E Sanity Test', () => {

    const testState = {
        dashboardReady: false,
        mosaicModelReady: false,
        mosaicDashboardReady: false,
    };

    const dashboardRuns = [
        {
            label: 'Dashboard',
            ready: () => testState.dashboardReady,
            getName: () => dashboard.name,
            datasetName: 'airline-sample-data.xls',
        },
        {
            label: 'Mosaic Dashboard',
            ready: () => testState.mosaicDashboardReady,
            getName: () => mosaicdashboard.name,
            datasetName: () => mosaicModelInfo.name,
        },
    ];

    let {
        loginPage,
        onboardingTutorial,
        libraryPage,
        libraryAuthoringPage,
        datasetsPanel,
        autoDashboard,
        quickSearch,
        fullSearch,
        baseVisualization,
        editorPanelForGrid,
        dossierAuthoringPage,
        inCanvasSelector_Authoring,
        datasetPanel,
        vizPanelForGrid,
        contentsPanel,
    } = browsers.pageObj1;

    async function preparation() {
        // Get project id by name
        const projectInfo = await getProjectInfo({ credentials: tester.credentials });
        const projectDetails = projectInfo.find((p) => p.name === project.name);
        if (!projectDetails) {
            throw new Error(`Project '${project.name}' not found.`);
        }
        project.id = projectDetails.id;
        console.log(`Using project '${project.name}' with ID: ${project.id}`);

        // Get 'My Reports' folder id
        const myReportsFolderResponse = await getMyReportsFolderInfo({
            credentials: tester.credentials,
            projectId: project.id,
        });
        if (!myReportsFolderResponse) {
            throw new Error(`'My Reports' folder not found for project '${project.name}'.`);
        }
        myReportsFolder.id = myReportsFolderResponse.id;
        console.log(`'My Reports' folder ID: ${myReportsFolder.id}`);
    }

    async function deleteCreatedObjects() {
        if (!project.id || !myReportsFolder.id) {
            console.log('Project ID or My Reports folder ID is missing. Skipping deletion of created objects.');
            return;
        }

        console.log('Deleting created objects...');
        await deleteObjectByNames({
            credentials: tester.credentials,
            projectId: project.id,
            parentFolderId: myReportsFolder.id,
            names: [dashboard.name],
        });

        await deleteObjectByNames({
            credentials: tester.credentials,
            projectId: project.id,
            parentFolderId: myReportsFolder.id,
            names: [mosaicdashboard.name],
        });

        await deleteObjectByNames({
            credentials: tester.credentials,
            projectId: project.id,
            parentFolderId: myReportsFolder.id,
            names: [mosaicModelInfo.name],
        });
    }

    async function saveAutoDash2Result(caseName, element, actualImageFolder) {
        const imagePath = path.resolve(actualImageFolder, caseName);
        await saveElementScreenshotLocal(element, imagePath);
        return imagePath;
    }

    async function captureAndAttachScreenshotsToAllure(caseId, actualImageFolder, suffix = '') {
        const canvas = await libraryAuthoringPage.getVizDoc();
        const canvasImage = await saveAutoDash2Result(`${caseId}${suffix}_Canvas.png`, canvas, actualImageFolder);
        allureReporter.addAttachment(`Canvas${suffix}`, fs.readFileSync(canvasImage), 'image/png');

        const chatPanel = await autoDashboard.getAutoDashboard();
        const chatPanelImage = await saveAutoDash2Result(`${caseId}${suffix}_ChatOutput.png`, chatPanel, actualImageFolder);
        allureReporter.addAttachment(`ChatOutput${suffix}`, fs.readFileSync(chatPanelImage), 'image/png');

        return {
        canvasImage,
        chatPanelImage,
    };
    }

    beforeAll(async () => {
        try {
            await preparation();
            await setWindowSize(autoDashBrowserWindow);
            await loginPage.login(tester.credentials);
            await libraryPage.waitForLibraryLoading();
            await libraryPage.openDefaultApp();
            await onboardingTutorial.skip();
        } catch (error) {
            console.error('❌ Test preparation failed:', error.message);
            throw error;
        }
    });

    afterAll(async () => {
        try {
            await logoutFromCurrentBrowser();
            if (deleteObjectsAfterTest) {
                await deleteCreatedObjects();
            }
        } catch (error) {
            console.error('❌ Test cleanup failed:', error.message);
            throw error;
        }
    });

    it('[AHIT-2011_Pre_01] Create dashboard with sample dataset and enable auto dash 2.0', async () => {

        try {
            allureReporter.addStep('🚀 Starting creation of new dashboard with sample dataset');
            console.log('Creating new dashboard with sample dataset');
            await libraryAuthoringPage.createDossierFromLibrary();
            await datasetsPanel.clickNewDataBtn();
            await autoDashboard.waitForElementVisible(datasetsPanel.getDIContainer());
            await autoDashboard.waitForElementVisible(datasetsPanel.getDataSourceByIndex(1));
            await datasetsPanel.clickDataSourceByIndex(5);
            await datasetsPanel.importSampleFiles([0]); // Airline Sample

            console.log('Enable Auto Dashboard 2.0');
            allureReporter.addStep('✅ Enable Auto Dashboard 2.0');
            await autoDashboard.toggleAutoDashboard2();
            
            console.log('Save the dashboard with timestamp');
            allureReporter.addStep('✅ Save the dashboard with timestamp');
            await libraryAuthoringPage.saveDashboardInMyReports(dashboard.name);
            await dossierAuthoringPage.closeDossierWithoutSaving();

            console.log('Search and open the created dashboard from library');
            allureReporter.addStep('✅ Search and open the created dashboard from library');
            await quickSearch.openSearchSlider();
            await quickSearch.inputTextAndSearch(dashboard.name);
            await fullSearch.waitForSearchLoading();
            await fullSearch.openDossierFromSearchResults(dashboard.name);
            await fullSearch.switchToNewWindow();

            console.log('Verify the new dashboard is in library home');
            allureReporter.addStep('✅ Verify the new dashboard is in library home');
            await fullSearch.closeCurrentTab();
            await fullSearch.switchToTab(0);
            await libraryPage.resetToLibraryHome();
            await since('Back to library page, the new dashboard in library should be "#{expected}", instead we have "#{actual}"')
                .expect(await libraryPage.isDossierInLibrary(dashboard))
                .toBe(true);

            testState.dashboardReady = true;
        } catch (err) {
            testState.dashboardReady = false;
            fail(err);
        }
    });

    it('[AHIT-2011_Pre_02] Create mosaic model with airline sample dataset by API', async () => {
        try {
            allureReporter.addStep('🚀 Starting mosaic model creation');

            console.log(
                `Creating mosaic model '${mosaicModelInfo.name}' from sample file: ${mosaicModelInfo.sampleFileName}`
            );

            const cubeId = await createMosaicModelWithSampleFile(
                tester.credentials,
                project.id,
                mosaicModelInfo.sampleFileName,
                mosaicModelInfo.name,
                myReportsFolder.id
            );

             if (!cubeId) {
                    throw new Error(
                        `Failed to create mosaic model from sample file: ${mosaicModelInfo.sampleFileName}`
                    );
                }
                mosaicModelInfo.id = cubeId;

                // Wait for a while
                await browser.pause(5000);

                console.log('✅ Mosaic model created successfully');
                allureReporter.addStep('✅ Mosaic model created successfully');
                testState.mosaicModelReady = true;
        } catch (error) {
            console.error('❌ Failed to create mosaic model:', error.message);
            allureReporter.addStep(
                `❌ Failed to create mosaic model: ${error.message}`,
                {},
                'failed'
            );
            testState.mosaicModelReady = false;
            throw error;
        }
    });

    it('[AHIT-2011_Pre_03] Create dashboard with newly created mosaic model', async () => {

        if (!testState.mosaicModelReady) {
            pending('Mosaic model was not created, skipping mosaic dashboard creation');
            return;
        }

        try {
            allureReporter.addStep('🚀 Starting creation of new dashboard with the mosaic model');
            console.log('Creating new dashboard with the mosaic model');
            await libraryAuthoringPage.createDashboardWithDataset({ dataset: mosaicModelInfo.name});

            console.log('Enable Auto Dashboard 2.0');
            allureReporter.addStep('✅ Enable Auto Dashboard 2.0');
            await autoDashboard.toggleAutoDashboard2();
            
            console.log('Save the dashboard with timestamp');
            allureReporter.addStep('✅ Save the dashboard with timestamp');
            await libraryAuthoringPage.saveDashboardInMyReports(mosaicdashboard.name);
            await dossierAuthoringPage.closeDossierWithoutSaving();

            console.log('Search and open the created dashboard from library');
            allureReporter.addStep('✅ Search and open the created dashboard from library');
            await quickSearch.openSearchSlider();
            await quickSearch.inputTextAndSearch(mosaicdashboard.name);
            await fullSearch.waitForSearchLoading();
            await fullSearch.openDossierFromSearchResults(mosaicdashboard.name);
            await fullSearch.switchToNewWindow();

            console.log('Verify the new dashboard is in library home');
            allureReporter.addStep('✅ Verify the new dashboard is in library home');
            await fullSearch.closeCurrentTab();
            await fullSearch.switchToTab(0);
            await libraryPage.resetToLibraryHome();
            await since('Back to library page, the new dashboard in library should be "#{expected}", instead we have "#{actual}"')
                .expect(await libraryPage.isDossierInLibrary(mosaicdashboard))
                .toBe(true);
            
            testState.mosaicDashboardReady = true;
        } catch (err) {
            testState.mosaicDashboardReady = false;
            fail(err);
        }
    });

    dashboardRuns.forEach(({ label, ready, getName, datasetName }) => {

        describe(`AHIT-2011 E2E - ${label}`, () => {

            beforeEach(async () => {
                if (!ready()) {
                    pending(`${label} not ready, skipping AHIT-2011 E2E cases`);
                    return;
                }

                await libraryPage.openDefaultApp();
                await onboardingTutorial.skip();
                await libraryPage.openDossier(getName());
                await libraryAuthoringPage.editDossierFromLibrary();
                await browser.pause(2000);
            });

            it('AHIT-2011_01_Add a Bar Chart showing Number of Flights by Airline Name, name is "Flights by Airline"', async () => {

                console.log('Send command in auto dash chat panel');
                await autoDashboard.sendPromptInAutoDash2(
                    'Add a Bar Chart showing Number of Flights by Airline Name, name is "Flights by Airline"'
                );
                await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
                await autoDashboard.showErrorDetailsAndFail();

                console.log('Verify the chart and attribute/metric on editor panel');
                await since('I should see bar chart "Flights by Airline", should be #{expected}, instead we have #{actual}')
                    .expect(await (await baseVisualization.getContainerByTitle('Flights by Airline')).isExisting())
                    .toBe(true);
                await since('The editor panel should have "attribute" named "Airline Name" on "Horizontal" section')
                    .expect(await editorPanelForGrid.getObjectFromSection('Airline Name', 'attribute', 'Horizontal').isExisting())
                    .toBe(true);
                await since('The editor panel should have "metric" named "Number of Flights" on "Vertical" section')
                    .expect(await editorPanelForGrid.getObjectFromSection('Number of Flights', 'metric', 'Vertical').isExisting())
                    .toBe(true);

                console.log('Take screenshots and attach to allure');
                await captureAndAttachScreenshotsToAllure('AHIT-2011_01', actualImageFolder);
            });

            it('AHIT-2011_02_Create an enhanced KPI for number of flights, Original Airport in Break By, name as "KPI1"', async () => {
            
                console.log('create an enhanced KPI for number of flights, Original Airport in Break By, name as "KPI1"');
                await autoDashboard.sendPromptInAutoDash2(
                    'Create an enhanced KPI for number of flights, Origin Airport in Break By, name is "KPI1"'
                );
                await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
                await autoDashboard.showErrorDetailsAndFail();

                await since('I should see bar chart "KPI1", should be #{expected}, instead we have #{actual}')
                    .expect(await (await baseVisualization.getContainerByTitle('KPI1')).isExisting())
                    .toBe(true);
                await since('The editor panel should have "attribute" named "Origin Airport" on "Break By" section')
                    .expect(await editorPanelForGrid.getObjectFromSection('Origin Airport', 'attribute', 'Break By').isExisting())
                    .toBe(true);
                await since('The editor panel should have "metric" named "Number of Flights" on "Metric" section')
                    .expect(await editorPanelForGrid.getObjectFromSection('Number of Flights', 'metric', 'Metric').isExisting())
                    .toBe(true);

                console.log('Take screenshots and attach to allure');
                await captureAndAttachScreenshotsToAllure('AHIT-2011_02', actualImageFolder);
            });

            it('AHIT-2011_03_Add a Grid showing Number of Flights, On-Time, and Flights Delayed by Month for a monthly performance summary. Then rename the grid"', async () => {

                console.log('Add a Grid showing Number of Flights, On-Time, and Flights Delayed by Month for a monthly performance summary.');
                await autoDashboard.sendPromptInAutoDash2(
                    'Add a Grid showing Number of Flights, On-Time, and Flights Delayed by Month for a monthly performance summary.'
                );
                await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
                await autoDashboard.showErrorDetailsAndFail();

                await since('The editor panel should have "attribute" named "Month" on "Rows" section')
                    .expect(await editorPanelForGrid.getObjectFromSection('Month', 'attribute', 'Rows').isExisting())
                    .toBe(true);
                await since('The editor panel should have "metric" named "Number of Flights" on "Metrics" section')
                    .expect(await editorPanelForGrid.getObjectFromSection('Number of Flights', 'metric', 'Metrics').isExisting())
                    .toBe(true);
                await since('The editor panel should have "metric" named "Flights Delayed" on "Metrics" section')
                    .expect(await editorPanelForGrid.getObjectFromSection('Flights Delayed', 'metric', 'Metrics').isExisting())
                    .toBe(true);

                console.log('rename the grid to "Monthly Performance Grid"');
                await autoDashboard.sendPromptInAutoDash2(
                    'rename the grid to "Monthly Performance Grid"'
                );
                await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
                await autoDashboard.showErrorDetailsAndFail();
                await since('I should see grid "Monthly Performance Grid", should be #{expected}, instead we have #{actual}')
                    .expect(await (await baseVisualization.getContainerByTitle('Monthly Performance Grid')).isExisting())
                    .toBe(true);

                console.log('Take screenshots and attach to allure');
                await captureAndAttachScreenshotsToAllure('AHIT-2011_03', actualImageFolder);
            });

            it('AHIT-2011_04_Create attribute filter, select target and change the filter style"', async () => {

                console.log('Create a Origin Airport filter and name it as Airport_Filter');
                await autoDashboard.sendPromptInAutoDash2(
                    'Create a Origin Airport filter and name it as Airport_Filter, select Visualization 1 as the target for Airport_Filter'
                );
                await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
                await autoDashboard.showErrorDetailsAndFail();

                await since('The selector named "Airport_Filter" should have style Link Bar')
                    .expect(await inCanvasSelector_Authoring.getLinkBarStyleSelectorByDisplayTitle('Airport_Filter').isExisting())
                    .toBe(true);
                await since('The selector named "Airport_Filter" should not have Select Target button')
                    .expect(await inCanvasSelector_Authoring.getSelectTargetButton('Airport_Filter').isExisting())
                    .toBe(false);

                console.log('Change the Display Style of Airport_Filter to Drop-down');
                await autoDashboard.sendPromptInAutoDash2(
                    'Change the Display Style of Airport_Filter to Drop-down'
                );
                await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
                await autoDashboard.showErrorDetailsAndFail();
                await since('The selector named "Airport_Filter" should have style Drop-down')
                    .expect(await inCanvasSelector_Authoring.getDropDownStyleSelectorByDisplayTitle('Airport_Filter').isExisting())
                    .toBe(true);

                console.log('Take screenshots and attach to allure');
                await captureAndAttachScreenshotsToAllure('AHIT-2011_04', actualImageFolder);
            });

            it('AHIT-2011_05_Change to Harmony palette, change to Classic Theme"', async () => {

                console.log('Create a grid, and convert to line chart');
                const dataset =
                    typeof datasetName === 'function'
                        ? datasetName()
                        : datasetName;
                await datasetPanel.addObjectToVizByDoubleClick('Airline Name', 'attribute', dataset);
                await datasetPanel.addObjectToVizByDoubleClick('Origin Airport', 'attribute', dataset);
                await datasetPanel.addObjectToVizByDoubleClick('Number of Flights', 'metric', dataset);
                await since(
                    'The grid cell in normal grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
                )
                    .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getText())
                    .toBe('AirTran Airways Corporation');
                await since(
                    'The grid cell in normal grid "Visualization 1" at row 2, col 3 should be #{expected}, instead it is #{actual}'
                )
                    .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Visualization 1').getText())
                    .toBe('Number of Flights');
                await baseVisualization.changeVizType('Visualization 1', 'Line', 'Line Chart');

                console.log('Change to Harmony palette');
                await autoDashboard.sendPromptInAutoDash2(
                    'Change to Harmony palette'
                );
                await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
                await autoDashboard.showErrorDetailsAndFail();

                await dossierAuthoringPage.actionOnMenubar('Format');
                await browser.pause(2000);
                await since('The Harmony palette should be checked, instead we have #{actual}.')
                    .expect(await dossierAuthoringPage.isPaletteChecked('Harmony'))
                    .toBe(true);
                await dossierAuthoringPage.actionOnMenubar('Format');
                await takeScreenshotByElement(
                    await baseVisualization.getContainerByTitle('Visualization 1'),
                    'AHIT-2011_05',
                    'Line chart in Harmony palette',
                    {tolerance: 1.0}
                );

                console.log('Change to Classic Theme');
                await autoDashboard.sendPromptInAutoDash2(
                    'Change to Classic Theme'
                );
                await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
                await autoDashboard.showErrorDetailsAndFail();

                await takeScreenshotByElement(
                    await baseVisualization.getContainerByTitle('Visualization 1'),
                    'AHIT-2011_05',
                    'Line chart in Classic theme',
                    {tolerance: 1.0}
                );

                console.log('Take screenshots and attach to allure');
                await captureAndAttachScreenshotsToAllure('AHIT-2011_05', actualImageFolder);
            });

            it('AHIT-2011_06_Suggest a page based on the dataset, rename the page"', async () => {

                console.log('Suggest a page based on the dataset');
                await autoDashboard.sendPromptInAutoDash2(
                    'Suggest a page based on the dataset'
                );
                await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
                await autoDashboard.showErrorDetailsAndFail();

                await since('Page count should be #{expected}, instead we have #{actual}')
                    .expect(await contentsPanel.getPagesCount())
                    .toBe(2);

                console.log('Rename the page to "AutoDash2_SuggestedPage"');
                await autoDashboard.sendPromptInAutoDash2(
                    'Rename the page to "AutoDash2_SuggestedPage"'
                );
                await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
                await autoDashboard.showErrorDetailsAndFail();
                await since('Page "AutoDash2_SuggestedPage" in chapter "Chapter 1" is the current page, instead we have #{actual}')
                    .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 1', pageName: 'AutoDash2_SuggestedPage' })).isDisplayed())
                    .toBe(true);

                console.log('AI validation for generated page');
                const { canvasImage } = await captureAndAttachScreenshotsToAllure(
                    'AHIT-2011_06',
                    actualImageFolder
                );
                const validationResult = await validateAutoDash2Page(
                    'Suggest a page based on the dataset', 
                    canvasImage
                );
                
                // Extract output from AI validation
                const alignMatch = validationResult.match(/Is the dashboard page aligned with the user prompt\?:\s*(Yes|No)/i);
                const reasonMatch = validationResult.match(/Reasoning:\s*([\s\S]*?)(?:Missing|$)/i);
                const missingMatch = validationResult.match(/Missing or Incorrect Elements \(if any\):\s*([\s\S]*)/i);

                const isAligned = alignMatch && alignMatch[1].toLowerCase() === 'yes';
                const reasoning = reasonMatch ? reasonMatch[1].trim() : 'N/A';
                const missingElements = missingMatch ? missingMatch[1].trim() : 'None';

                // Attach output to Allure report
                allureReporter.addStep(`✅ Is the dashboard page aligned with the user prompt: ${isAligned ? 'Yes' : 'No'}`);
                allureReporter.addStep(`💬 Reasoning: ${reasoning}`);
                allureReporter.addStep(`⚠️ Missing or Incorrect Elements: ${missingElements}`);

                // Pass or fail
                const isAlignedYes = alignMatch && alignMatch[1].toLowerCase() === 'yes';
                const hasNoMissing = missingElements && ['none', '**none**', 'n/a', ''].includes(missingElements.toLowerCase().trim());
                const pass = isAlignedYes || (!isAlignedYes && hasNoMissing);
                
                await since(
                    `AI validation passed.
                Alignment: ${isAlignedYes ? 'Yes' : 'No'}
                Missing: ${missingElements}
                Reasoning: ${reasoning}`
                ).expect(pass).toBe(true);
            });

            it('AHIT-2011_07_Create a new chapter with 2 pages analyze the flights in different airports. Then delete the chapter', async () => {

                console.log('Create a new chapter with 2 pages analyze the flights in different airports');
                await autoDashboard.sendPromptInAutoDash2(
                    'Create a new chapter with 2 pages analyze the flights in different airports'
                );
                await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
                await autoDashboard.showErrorDetailsAndFail();

                console.log('Verify chapter count and page count');
                await since('Chapter count should be #{expected}, instead we have #{actual}')
                    .expect(await contentsPanel.getChapterCount())
                    .toBe(2);
                await since('Page count should be #{expected}, instead we have #{actual}')
                    .expect(await contentsPanel.getPagesCount())
                    .toBe(3);
                
                console.log('AI validation for each page in the generated chapter');
                const pages = await contentsPanel.getAllPagesInCurrentChapterEL();
                const pageImages = [];

                // Step 1: Capture all page screenshot in the generated chapter
                for (let i = 0; i < pages.length; i++) {
                    await pages[i].click();
                    await libraryAuthoringPage.waitLoadingDataPopUpIsNotDisplayed();
                    await browser.pause(2000);

                    const canvas = await libraryAuthoringPage.getVizDoc();
                    const canvasImage = await saveAutoDash2Result(
                        `Chapter_Page_${i + 1}.png`,
                        canvas,
                        actualImageFolder
                    );
                    allureReporter.addAttachment(`Page ${i + 1} Canvas`, fs.readFileSync(canvasImage), 'image/png');
                    pageImages.push(canvasImage);
                }
                // Step 2: Send all images together for AI validation
                const result = await validateAutoDash2Page("Create a new chapter with 2 pages analyze the flights in different airports", pageImages);

                // Step 3: Extract AI validation results
                const alignMatch = result.match(/Is the dashboard page aligned with the user prompt\?:\s*(Yes|No)/i);
                const reasonMatch = result.match(/Reasoning:\s*([\s\S]*?)(?:Missing|$)/i);
                const missingMatch = result.match(/Missing or Incorrect Elements \(if any\):\s*([\s\S]*)/i);

                const allAligned = alignMatch && alignMatch[1].toLowerCase() === 'yes';
                const reasoning = reasonMatch ? reasonMatch[1].trim() : 'N/A';
                const missing = missingMatch ? missingMatch[1].trim() : 'None';
                
                // Step 4: Attach output to Allure report
                const reasoningFormatted = reasoning.replace(/\n\s*/g, '\n\n');
                const missingFormatted = missing.replace(/\n\s*/g, '\n\n');

                allureReporter.addStep(`✅ Overall Alignment: ${allAligned ? 'Yes' : 'No'}`);
                allureReporter.addStep(`💬 Reasoning Summary:\n${reasoningFormatted}`);
                allureReporter.addStep(`⚠️ Missing or Incorrect Elements Summary:\n${missingFormatted}`);

                // Pass or fail
                const hasNoMissing = missing && ['none', '**none**', 'n/a', ''].includes(missing.toLowerCase().trim());
                const pass = allAligned || (!allAligned && hasNoMissing);
                
                await since(
                    `AI validation passed.
                Alignment: ${allAligned ? 'Yes' : 'No'}
                Missing: ${missing}
                Reasoning: ${reasoning}`
                ).expect(pass).toBe(true);

                console.log('Delete the current chapter');
                await autoDashboard.sendPromptInAutoDash2(
                    'Delete the current chapter'
                );
                await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
                await autoDashboard.showErrorDetailsAndFail();

                console.log('Verify chapter count and page count');
                await since('Chapter count should be #{expected}, instead we have #{actual}')
                    .expect(await contentsPanel.getChapterCount())
                    .toBe(1);
                await since('Page count should be #{expected}, instead we have #{actual}')
                    .expect(await contentsPanel.getPagesCount())
                    .toBe(1);
            });

            it('AHIT-2011_08_Image upload to create a page', async () => {

                console.log('verify no Custom Palettes before upload');
                await dossierAuthoringPage.actionOnMenubar('Format');
                await since('The submenu should Not have "Custom Palettes"')
                    .expect(await dossierAuthoringPage.getSubOptionFromMenubar('Custom Palettes').isExisting())
                    .toBe(false);
                await dossierAuthoringPage.actionOnMenubar('Format');
                
                console.log('upload image in auto dash chat panel');
                await autoDashboard.uploadAutoDashImage('AHIT-1670_01.png');
                await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
                await autoDashboard.showErrorDetailsAndFail();
                await since('Page count should be #{expected}, instead we have #{actual}')
                    .expect(await contentsPanel.getPagesCount())
                    .toBe(2);

                console.log('verify Custom Palette is created after upload');
                await dossierAuthoringPage.actionOnMenubar('Format');
                await since('The submenu should have "Custom Palettes"')
                    .expect(await dossierAuthoringPage.getSubOptionFromMenubar('Custom Palettes').isExisting())
                    .toBe(true);
                await dossierAuthoringPage.actionOnMenubar('Format');

                const grid = await $('//*[@aria-roledescription="Grid"]');
                const KPIs = await $$('.ImageEnhancedKPIContainer');
                const line = await $('//*[@aria-roledescription="Dual Axis Line Chart"]');
            
                await since('Grid should exist on the new page, expected=#{expected}, instead gridExists=#{actual}')
                    .expect(await grid.isExisting())
                    .toBe(true);
                await since('There should be at least one Ikonic KPI, expected >=#{expected}, instead found #{actual}')
                    .expect(KPIs.length)
                    .toBeGreaterThan(0);
                await since('Line chart should exist on the new page, expected=#{expected}, instead lineExists=#{actual}')
                    .expect(await line.isExisting())
                    .toBe(true);

                console.log('Take screenshots and attach to allure');
                await captureAndAttachScreenshotsToAllure('AHIT-2011_08', actualImageFolder);
            });
        });
    });
});
