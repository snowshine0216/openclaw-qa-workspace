import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { fileURLToPath } from 'url';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import allureReporter from '@wdio/allure-reporter';
import fs from 'fs';
import path from 'path';
import * as bot from '../../../constants/bot2.js';
import { infoLog } from '../../../config/consoleFormat.js';
import { saveElementScreenshotLocal, cleanFileInFolder, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const actualImageFolder = path.resolve(__dirname, '../../../autodash/VizAdd');

// npm run regression -- --spec=specs/regression/autoDashboard2/AutoDash2_VizAdd.spec.js --baseUrl=https://tec-l-1280162.labs.microstrategy.com/MicroStrategyLibrary/
describe('Visualization creation related workflow for Auto Dashboard 2.0', () => {

    const AutoDash2 = {
        id: 'E1E88174DE407C1FB18D82854472B11A',
        name: 'AutoDash2_Auto',
        projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    };


    let { loginPage, dossierPage, libraryPage, libraryAuthoringPage, autoDashboard, editorPanelForGrid, dossierAuthoringPage, baseVisualization} = browsers.pageObj1;

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

        const editorPanel = await editorPanelForGrid.editorPanel;
        const editorPanelImage = await saveAutoDash2Result(`${caseId}${suffix}_EditorPanel.png`, editorPanel, actualImageFolder);
        allureReporter.addAttachment(`EditorPanel${suffix}`, fs.readFileSync(editorPanelImage), 'image/png');
    }

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        if (!(await loginPage.isLoginPageDisplayed())) {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
        await loginPage.login(bot.autoDashUser);
        await cleanFileInFolder(actualImageFolder);
        
    });

    beforeEach(async () => {
        await libraryPage.editDossierByUrl({
            projectId: AutoDash2.projectId,
            dossierId: AutoDash2.id,
        });
        await autoDashboard.openAutoDashboard(false);
    });

    afterEach(async () => {
        await autoDashboard.closeEditWithoutSaving();
        await dossierPage.goToLibrary();
    });
    
    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('AHIT-1668_01_Add a line chart to this page with # of Items Sold This Quarter by Commuting Method, name it as "Line"', async () => {
        infoLog('Send command in auto dash chat panel');
        await dossierAuthoringPage.actionOnToolbar('Add Chapter');
        await autoDashboard.sendPromptInAutoDash2(
            'Add a line chart to this page with **# of Items Sold This Quarter** by **Commuting Method**, name it as "Line"' // With auto complete
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();

        infoLog('Verify the chart and attribute/metric on editor panel');
        await takeScreenshotByElement(libraryAuthoringPage.getVizDoc(),'AHIT-1668_01','Create a line chart', { tolerance: 1 });
        await since('The editor panel should have "attribute" named "Commuting Method" on "Horizontal" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Commuting Method', 'attribute', 'Horizontal').isExisting())
            .toBe(true);
        await since('The editor panel should have "metric" named "# of Items Sold This Quarter" on "Vertical" section')
            .expect(await editorPanelForGrid.getObjectFromSection('# of Items Sold This Quarter', 'metric', 'Vertical').isExisting())
            .toBe(true);

        infoLog('Take screenshots and attach to allure');
        await captureAndAttachScreenshotsToAllure('AHIT-1668_01', actualImageFolder);
    });

    it('AHIT-1668_02_Create a vertical stacked bar chart named as "Stacked Bar" with Country, Commuting Method and # of Employees, color by Commuting Method', async () => {
        infoLog('Send command in auto dash chat panel');
        await dossierAuthoringPage.actionOnToolbar('Add Chapter');
        await autoDashboard.sendPromptInAutoDash2(
            'Create a vertical stacked bar chart named as "Stacked Bar" with Country, Commuting Method and # of Employees, color by Commuting Method'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();

        infoLog('Verify the chart and attribute/metric on editor panel');
        await takeScreenshotByElement(libraryAuthoringPage.getVizDoc(),'AHIT-1668_02','Create a stacked bar chart', { tolerance: 2 });
        await since('The editor panel should have "attribute" named "Country" on "Horizontal" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Country', 'attribute', 'Horizontal').isExisting())
            .toBe(true);
        await since('The editor panel should have "metric" named "# of Employees" on "Vertical" section')
            .expect(await editorPanelForGrid.getObjectFromSection('# of Employees', 'metric', 'Vertical').isExisting())
            .toBe(true);
        await since('The editor panel should have "attribute" named "Commuting Method" on "Color By" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Commuting Method', 'attribute', 'Color By').isExisting())
            .toBe(true);
        await since('The editor panel should have "attribute" named "Commuting Method" on "Break By" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Commuting Method', 'attribute', 'Break By').isExisting())
            .toBe(true);

        infoLog('Take screenshots and attach to allure');
        await captureAndAttachScreenshotsToAllure('AHIT-1668_02', actualImageFolder);
    });

    // AHSC-992: Create a map with metric in color by and size by, the metric didn't added to the size by
    it('AHIT-1668_03_Add a map visualization displaying City as the attribute, # of Employees as the color by and size by, name as "City Employee Map"', async () => {
        infoLog('Send command in auto dash chat panel');
        await dossierAuthoringPage.actionOnToolbar('Add Chapter');
        await autoDashboard.sendPromptInAutoDash2(
            'Add a map visualization displaying City as the attribute, # of Employees as the color by and size by, name as "City Employee Map"'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();

        infoLog('Verify the chart and attribute/metric on editor panel');
        await browser.pause(2000);
        await takeScreenshotByElement(libraryAuthoringPage.getVizDoc(),'AHIT-1668_03','map visualization', { tolerance: 2 });
        await takeScreenshotByElement(editorPanelForGrid.editorPanel,'AHIT-1668_03','map editor panel');

        infoLog('Take screenshots and attach to allure');
        await captureAndAttachScreenshotsToAllure('AHIT-1668_03', actualImageFolder);
    });

    it('AHIT-1668_04_create a pie chart with Merit Department and Avg (Customer Retention Rating), Customer Retention Rating, name is as Pie Chart', async () => {
        infoLog('Send command in auto dash chat panel');
        await dossierAuthoringPage.actionOnToolbar('Add Chapter');
        await autoDashboard.sendPromptInAutoDash2(
            'create a pie chart with Merit Department and Avg (Customer Retention Rating), Customer Retention Rating, name is as Pie Chart'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();

        infoLog('Verify the chart and attribute/metric on editor panel');
        await takeScreenshotByElement(libraryAuthoringPage.getVizDoc(),'AHIT-1668_04','pie visualization', { tolerance: 1 });
        await takeScreenshotByElement(editorPanelForGrid.editorPanel,'AHIT-1668_04','pie editor panel');

        infoLog('Take screenshots and attach to allure');
        await captureAndAttachScreenshotsToAllure('AHIT-1668_04', actualImageFolder);
    });

    // AHSC-994: Create enhanced KPI, attribute can not be added to "Break by"
    it('AHIT-1668_05_create an enhanced KPI', async () => {
        infoLog('Send command in auto dash chat panel');
        await dossierAuthoringPage.actionOnToolbar('Add Chapter');
        await autoDashboard.sendPromptInAutoDash2(
            'create an enhanced KPI for # of Employees, Country in Break By, name as "KPI1"'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();

        infoLog('Enhanced KPI with break by, verify the chart and attribute/metric in editor panel');
        await takeScreenshotByElement(await baseVisualization.getContainerByTitle('KPI1'), 'AHIT-1668_05_01','Enhanced KPI with break by', { tolerance: 1 });

        await since('The editor panel should have "metric" named "Country" on "Break By" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Country', 'attribute', 'Break By').isExisting())
            .toBe(true);
        await since('The editor panel should have "metric" named "# of Employees" on "Metric" section')
            .expect(await editorPanelForGrid.getObjectFromSection('# of Employees', 'metric', 'Metric').isExisting())
            .toBe(true);

        infoLog('Send command in auto dash chat panel');
        await dossierAuthoringPage.actionOnToolbar('Add Chapter');
        await autoDashboard.sendPromptInAutoDash2(
            'create an enhanced KPI for # of Employees, Country in Break By, Commuting Method in Trend, name as "KPI2"'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();

        infoLog('Enhanced KPI with break by and trend, verify the chart and attribute/metric in editor panel');
        await takeScreenshotByElement(await baseVisualization.getContainerByTitle('KPI2'), 'AHIT-1668_05_02','Enhanced KPI with break by and trend');

        await since('The editor panel should have "metric" named "Country" on "Break By" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Country', 'attribute', 'Break By').isExisting())
            .toBe(true);
        await since('The editor panel should have "metric" named "Commuting Method" on "Trend" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Commuting Method', 'attribute', 'Trend').isExisting())
            .toBe(true);
        await since('The editor panel should have "metric" named "# of Employees" on "Metric" section')
            .expect(await editorPanelForGrid.getObjectFromSection('# of Employees', 'metric', 'Metric').isExisting())
            .toBe(true);

        infoLog('Take screenshots and attach to allure');
        const canvas = await libraryAuthoringPage.getVizDoc();
        const canvasImage = await saveAutoDash2Result(`AHIT-1668_05_Canvas.png`, canvas, actualImageFolder);
        allureReporter.addAttachment(`Canvas`, fs.readFileSync(canvasImage), 'image/png');
        const chatPanel = await autoDashboard.getAutoDashboard();
        const chatPanelImage = await saveAutoDash2Result(`AHIT-1668_05_ChatOutput.png`, chatPanel, actualImageFolder);
        allureReporter.addAttachment(`ChatOutput`, fs.readFileSync(chatPanelImage), 'image/png');
    });

    it('AHIT-1668_06_create a grid with Country, Employee, Hire Date, Merit Department, # of Items Sold This Quarter and Customer Retention Rating, name it as "Employee Sales & Retention Grid"', async () => {
        infoLog('Send command in auto dash chat panel');
        await dossierAuthoringPage.actionOnToolbar('Add Chapter');
        await autoDashboard.sendPromptInAutoDash2(
            'create a grid with Country, Employee, Hire Date, Merit Department, # of Items Sold This Quarter and Customer Retention Rating, name it as "Employee Sales & Retention Grid"'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();

        infoLog('Verify the chart and attribute/metric on editor panel');
        await takeScreenshotByElement(libraryAuthoringPage.getVizDoc(),'AHIT-1668_06','grid', { tolerance: 2 });
        await takeScreenshotByElement(editorPanelForGrid.editorPanel,'AHIT-1668_06','grid editor panel');

        infoLog('Take screenshots and attach to allure');
        await captureAndAttachScreenshotsToAllure('AHIT-1668_06', actualImageFolder);
    });

    it('AHIT-1668_07_create a heatmap with Location, commuting method and # of Employees, name as "Heatmap""', async () => {
        infoLog('Send command in auto dash chat panel');
        await dossierAuthoringPage.actionOnToolbar('Add Chapter');
        await autoDashboard.sendPromptInAutoDash2(
            'create a heatmap with Location, commuting method and # of Employees, name as "Heatmap"'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();

        infoLog('Verify the chart and attribute/metric on editor panel');
        await takeScreenshotByElement(libraryAuthoringPage.getVizDoc(),'AHIT-1668_07','heatmap', { tolerance: 2 });
        await takeScreenshotByElement(editorPanelForGrid.editorPanel,'AHIT-1668_07','heatmap editor panel');

        infoLog('Take screenshots and attach to allure');
        await captureAndAttachScreenshotsToAllure('AHIT-1668_07', actualImageFolder);
    });

    it('AHIT-1668_08_create a bubble chart named "City Employee bubble chart", with # of Employees and City, color by City, Size by # of Items Sold This Quarter', async () => {
        infoLog('Send command in auto dash chat panel');
        await dossierAuthoringPage.actionOnToolbar('Add Chapter');
        await autoDashboard.sendPromptInAutoDash2(
            'create a bubble chart named "City Employee bubble chart", with # of Employees and City, color by City, Size by # of Items Sold This Quarter'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();

        infoLog('Verify the chart and attribute/metric on editor panel');
        await takeScreenshotByElement(libraryAuthoringPage.getVizDoc(),'AHIT-1668_08','Bubble chart', { tolerance: 2 });
        await takeScreenshotByElement(editorPanelForGrid.editorPanel,'AHIT-1668_08','Bubble chart editor panel');

        infoLog('Take screenshots and attach to allure');
        await captureAndAttachScreenshotsToAllure('AHIT-1668_08', actualImageFolder);
    });

    it('AHIT-1668_09_Add a donut chart for Commuting Method and # of Employees, name it as "Donut"', async () => {
        infoLog('Add a donut chart for Commuting Method and # of Employees, name it as "Donut"');
        await dossierAuthoringPage.actionOnToolbar('Add Chapter');
        await autoDashboard.sendPromptInAutoDash2(
            'add a donut chart for Commuting Method and # of Employees, name it as "Donut"'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();

        infoLog('Verify the chart and attribute/metric on editor panel');
        await takeScreenshotByElement(libraryAuthoringPage.getVizDoc(),'AHIT-1668_09','Donut chart', { tolerance: 1 });
        await takeScreenshotByElement(editorPanelForGrid.editorPanel,'AHIT-1668_09','Donut chart editor panel');

        infoLog('Take screenshots and attach to allure');
        await captureAndAttachScreenshotsToAllure('AHIT-1668_09', actualImageFolder);
    });
});
