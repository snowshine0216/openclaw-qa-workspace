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
const actualImageFolder = path.resolve(__dirname, '../../../autodash/VizModify');

// npm run regression -- --spec=specs/regression/autoDashboard2/AutoDash2_VizModify.spec.js --baseUrl=https://tec-l-1280162.labs.microstrategy.com/MicroStrategyLibrary/
describe('Visualization modification related workflow for Auto Dashboard 2.0', () => {

    const AutoDash2 = {
        id: 'E1E88174DE407C1FB18D82854472B11A',
        name: 'AutoDash2_Auto',
        projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    };


    let { loginPage, dossierPage, libraryPage, libraryAuthoringPage, autoDashboard, editorPanelForGrid, baseVisualization, contentsPanel, baseContainer, vizPanelForGrid} = browsers.pageObj1;

    async function saveAutoDash2Result(caseName, element, actualImageFolder) {
        const imagePath = path.resolve(actualImageFolder, caseName);
        await saveElementScreenshotLocal(element, imagePath);
        return imagePath;
    }

    async function captureAndAttachScreenshotsToAllure(caseId, actualImageFolder, suffix = '') {

        const chatPanel = await autoDashboard.getAutoDashboard();
        const chatPanelImage = await saveAutoDash2Result(`${caseId}${suffix}_ChatOutput.png`, chatPanel, actualImageFolder);
        allureReporter.addAttachment(`ChatOutput${suffix}`, fs.readFileSync(chatPanelImage), 'image/png');
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
        await contentsPanel.goToPage({ chapterName: 'Employee Commuting Impact on Sales & Retention', pageName: 'Multi charts' });
    });

    afterEach(async () => {
        await autoDashboard.closeEditWithoutSaving();
        await dossierPage.goToLibrary();
    });
    
    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('AHIT-1669_01_Modify Grid', async () => {
        infoLog('Rename the grid title to "RenameGrid"');
        await autoDashboard.sendPromptInAutoDash2(
            'change the grid title to "RenameGrid"'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await since('I should see grid "RenameGrid", should be #{expected}, instead we have #{actual}')
            .expect(await (await baseVisualization.getContainerByTitle('RenameGrid')).isExisting())
            .toBe(true);

        infoLog('Remove Title and Title Code, add Country to Rows section');
        await baseContainer.clickContainer('RenameGrid');
        await autoDashboard.sendPromptInAutoDash2(
            'remove Title and Title Code, add Country to Rows section'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await takeScreenshotByElement(await editorPanelForGrid.editorPanel,'AHIT-1669_01','grid editor panel');

        infoLog('Make the grid container fill color as blue with opacity 40%, title fill color as red with opacity 40%');
        await autoDashboard.sendPromptInAutoDash2(
            'make the grid container fill color as blue with opacity 40%, title fill color as red with opacity 40%'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await takeScreenshotByElement(await baseVisualization.getContainerByTitle('RenameGrid'), 'AHIT-1669_01','Grid formatting');

        infoLog('duplicate the viz');
        await autoDashboard.sendPromptInAutoDash2(
            'duplicate the viz'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await since('I should see grid "RenameGrid (Copy)", should be #{expected}, instead we have #{actual}')
            .expect(await (await baseVisualization.getContainerByTitle('RenameGrid (Copy)')).isExisting())
            .toBe(true);
        
        infoLog('delete "RenameGrid (Copy)');
        await autoDashboard.sendPromptInAutoDash2(
            'delete "RenameGrid (Copy)"'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await since('I should not see grid "RenameGrid (Copy)", should be #{expected}, instead we have #{actual}')
            .expect(await (await baseContainer.getContainer('RenameGrid (Copy)')).isExisting())
            .toBe(false);

        infoLog('Take screenshots and attach to allure');
        await captureAndAttachScreenshotsToAllure('AHIT-1669_01', actualImageFolder);
    });

    it('AHIT-1669_02_Iconic KPI', async () => {
        infoLog('Replace the metric in KPI to # of Employee, add Commuting Method to trend');
        await autoDashboard.sendPromptInAutoDash2(
            'replace the metric in KPI to # of Employee, add Commuting Method to trend'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await takeScreenshotByElement(await baseVisualization.getContainerByTitle('Quarterly Items Sold KPI'), 'AHIT-1669_02','Iconic_KPI');
        await takeScreenshotByElement(await editorPanelForGrid.editorPanel,'AHIT-1669_02','Iconic KPI editor panel');

        infoLog('duplicate the KPI');
        await autoDashboard.sendPromptInAutoDash2(
            'duplicate the KPI'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await since('I should see grid "Quarterly Items Sold KPI (Copy)", should be #{expected}, instead we have #{actual}')
            .expect(await (await baseVisualization.getContainerByTitle('Quarterly Items Sold KPI (Copy)')).isExisting())
            .toBe(true);

        infoLog('convert the KPI to a grid');
        await baseContainer.clickContainer('Quarterly Items Sold KPI');
        await autoDashboard.sendPromptInAutoDash2(
            'convert the KPI to a grid'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await since(
            'The grid cell in normal grid "Quarterly Items Sold KPI" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Quarterly Items Sold KPI').getText())
            .toBe('Bus');
        await since(
            'The grid cell in normal grid "Quarterly Items Sold KPI" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Quarterly Items Sold KPI').getText())
            .toBe('152');

        infoLog('Take screenshots and attach to allure');
        await captureAndAttachScreenshotsToAllure('AHIT-1669_02', actualImageFolder);
    });

    it('AHIT-1669_03_Heatmap', async () => {
        infoLog('rename the heatmap to "Heatmap 1"');
        await autoDashboard.sendPromptInAutoDash2(
            'rename the heatmap to "Heatmap 1"'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await since('I should see heatmap "Heatmap 1", should be #{expected}, instead we have #{actual}')
            .expect(await (await baseVisualization.getContainerByTitle('Heatmap 1')).isExisting())
            .toBe(true);
        
        infoLog('add Commuting Method to grouping and color by sections');
        await autoDashboard.sendPromptInAutoDash2(
            'add Commuting Method to grouping and color by sections'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await takeScreenshotByElement(await baseVisualization.getContainerByTitle('Heatmap 1'), 'AHIT-1669_03','Heatmap');
        await takeScreenshotByElement(await editorPanelForGrid.editorPanel,'AHIT-1669_03','Heatmap editor panel');

        infoLog('delete "Heatmap 1"');
        await autoDashboard.sendPromptInAutoDash2(
            'delete "Heatmap 1"'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await since('I should not see heatmap "Heatmap 1", should be #{expected}, instead we have #{actual}')
            .expect(await (await baseContainer.getContainer('Heatmap 1')).isExisting())
            .toBe(false);

        infoLog('Take screenshots and attach to allure');
        await captureAndAttachScreenshotsToAllure('AHIT-1669_03', actualImageFolder);
    });

    it('AHIT-1669_04_Bar_Chart', async () => {
        infoLog('rename the bar chart title to "Sales Bar Chart"');
        await autoDashboard.sendPromptInAutoDash2(
            'rename the bar chart title to "Sales Bar Chart"'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await since('I should see bar chart "Sales Bar Chart", should be #{expected}, instead we have #{actual}')
            .expect(await (await baseVisualization.getContainerByTitle('Sales Bar Chart')).isExisting())
            .toBe(true);

        infoLog('replace the Merit Department in bar chart to Commuting Method ');
        await autoDashboard.sendPromptInAutoDash2(
            'replace the Merit Department in bar chart to Commuting Method'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();

        infoLog('add # of Employees to size by');
        await autoDashboard.sendPromptInAutoDash2(
            'add # of Employees to size by'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await takeScreenshotByElement(await editorPanelForGrid.editorPanel,'AHIT-1669_04','Bar chart editor panel');

        infoLog('duplicate the bar chart');
        await autoDashboard.sendPromptInAutoDash2(
            'duplicate the bar chart'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await since('I should see duplicated bar chart "Sales Bar Chart (Copy)", should be #{expected}, instead we have #{actual}')
            .expect(await (await baseVisualization.getContainerByTitle('Sales Bar Chart (Copy)')).isExisting())
            .toBe(true);
        await takeScreenshotByElement(await editorPanelForGrid.editorPanel,'AHIT-1669_04','Duplicated Bar chart editor panel');

        infoLog('delete the bar chart');
        await autoDashboard.sendPromptInAutoDash2(
            'delete the Sales Bar Chart (Copy)'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await since('I should not see bar chart "Sales Bar Chart (Copy)", should be #{expected}, instead we have #{actual}')
            .expect(await (await baseContainer.getContainer('Sales Bar Chart (Copy)')).isExisting())
            .toBe(false);

        infoLog('Take screenshots and attach to allure');
        await captureAndAttachScreenshotsToAllure('AHIT-1669_04', actualImageFolder);
    });

});
