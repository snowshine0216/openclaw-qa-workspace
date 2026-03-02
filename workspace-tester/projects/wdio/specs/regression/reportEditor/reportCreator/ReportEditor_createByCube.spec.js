import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as template from '../../../../constants/template.js';

describe('Create Report by Cube', () => {
    let {
        loginPage,
        libraryPage,
        dossierCreator,
        reportPage,
        reportEditorPanel,
        reportGridView,
        reportToolbar,
        reportDatasetPanel,
    } = browsers.pageObj1;
    const testUser = reportConstants.reportSubsetTestUser;
    const tutorialProject = reportConstants.tutorialProject;
    const hierarchiesProject = reportConstants.hierarchiesProject;

    beforeAll(async () => {
        await loginPage.login(testUser);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await dossierCreator.resetLocalStorage();
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
    });

    it('[BCIN-6908_01] Cubes tab in report creator', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToCubesTab();
        await dossierCreator.searchData('airline');
        await dossierCreator.sortDataByHeaderName('Date Created');
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanel(),
            'BCIN-6908_01_01',
            'Airline cubes in search result'
        );
        await dossierCreator.selectReportCube({ name: 'Airline Data' });
        await since('1. Create button should be enabled after selecting a cube, instead it is still disabled')
            .expect(await dossierCreator.isCreateButtonEnabled())
            .toBe(true);
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanel(),
            'BCIN-6908_01_02',
            'Select cube in creator'
        );
    });

    it('[BCIN-6908_02] Create button is disabled when no cube selected', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToCubesTab();
        await dossierCreator.searchData('airline');
        await since('1. Create button should be disabled when no cube selected, instead it is enabled')
            .expect(await dossierCreator.isCreateButtonEnabled())
            .toBe(false);
        await dossierCreator.selectReportCube({ name: 'Airline Data' });
        await since('2. Create button should be enabled after selecting a cube, instead it is still disabled')
            .expect(await dossierCreator.isCreateButtonEnabled())
            .toBe(true);
        await dossierCreator.selectReportCube({ name: 'Airline Data' });
        await since('3. Create button should be disabled after deselecting a cube, instead it is still enabled')
            .expect(await dossierCreator.isCreateButtonEnabled())
            .toBe(false);
        await dossierCreator.closeNewDossierPanel();
    });

    it('[BCIN-6908_03] Switch project when no cube selected', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToCubesTab();
        await dossierCreator.switchProjectByName(hierarchiesProject.name);
        await since('1. After switch project the popup should not display without select cube, instead it is shown.')
            .expect(await dossierCreator.getConfirmSwitchProjectPopup().isDisplayed())
            .toBe(false);
        await dossierCreator.closeNewDossierPanel();
    });

    it('[BCIN-6908_04] Switch project when cube selected', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToCubesTab();
        await dossierCreator.searchData('airline');
        await dossierCreator.selectReportCube({ name: 'Airline Data' });
        await dossierCreator.switchProjectByName(hierarchiesProject.name);
        await since('1. After switch project the popup should display when cube selected, instead it is not shown.')
            .expect(await dossierCreator.getConfirmSwitchProjectPopup().isDisplayed())
            .toBe(true);
        await since('The popup message should be #{expected}, instead we have #{actual}.')
            .expect(await dossierCreator.getConfirmSwitchProjectPopup().getText())
            .toContain(template.templateMessage.English.switchProject);
        await dossierCreator.cancelSwitchProject();
        await since(`2. Current project should be #{expected}, instead we have #{actual}`)
            .expect(await dossierCreator.getCurrentProject().getText())
            .toBe(tutorialProject.name);
        await dossierCreator.switchProjectByName(hierarchiesProject.name);
        await dossierCreator.confirmSwitchProject();
        await since(`3. Current project should be #{expected}, instead we have #{actual}`)
            .expect(await dossierCreator.getCurrentProject().getText())
            .toBe(hierarchiesProject.name);
        await dossierCreator.closeNewDossierPanel();
    });

    it('[BCIN-6908_05] Select MDTI cube and create report', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToCubesTab();
        await dossierCreator.searchData('airline');
        await dossierCreator.selectReportCube({ name: 'Airline Data' });
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportToolbar.switchToDesignMode();
        await reportPage.clickReportTitle();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6908_05_01', 'Report created by MTDI cube');
        await reportEditorPanel.dndByMultiSelectFromReportObjectsToDropzone({
            objectNames: ['Year', 'Airline Name'],
            dropzone: 'Rows',
        });
        await reportGridView.waitForGridCellToBeExpectedValue(1, 0, 'AirTran Airways Corporation');
        await reportPage.clickReportTitle();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6908_05_02', 'Add attributes to report');
    });

    it('[BCIN-6908_06] Select OLAP cube and create report', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToCubesTab();
        await dossierCreator.searchData('Product olap');
        await dossierCreator.selectReportCube({ name: 'Product OLAP cube' });
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportToolbar.switchToDesignMode();
        await reportPage.clickReportTitle();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6908_06_01', 'Report created by OLAP cube');
        await reportEditorPanel.dndByMultiSelectFromReportObjectsToDropzone({
            objectNames: ['Category'],
            dropzone: 'Rows',
        });
        await reportDatasetPanel.addObjectToColumns('Cost');
        await reportGridView.waitForGridCellToBeExpectedValue(1, 1, '$2,070,816');
        await reportPage.clickReportTitle();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6908_06_02', 'Add attributes metric to report');
    });

    it('[BCIN-6908_07] show last tab when re-open report creator', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await since('1. Current selected tab should be #{expected}, instead it is #{actual}.')
            .expect(await dossierCreator.getActiveTabHeaderText())
            .toBe('Select Template');
        await dossierCreator.switchToCubesTab();
        await since('2. Current selected tab should be #{expected}, instead it is #{actual}.')
            .expect(await dossierCreator.getActiveTabHeaderText())
            .toBe('Cubes');
        await dossierCreator.closeNewDossierPanel();
        await dossierCreator.createNewReport();
        await since('3. After re-open, current selected tab should be #{expected}, instead it is #{actual}.')
            .expect(await dossierCreator.getActiveTabHeaderText())
            .toBe('Cubes');
        await dossierCreator.switchProjectByName(hierarchiesProject.name);
        await since('4. Current selected tab should be #{expected}, instead it is #{actual}.')
            .expect(await dossierCreator.getActiveTabHeaderText())
            .toBe('Cubes');
        await dossierCreator.switchToMdxSourceTab();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await since('5. Current selected tab should be #{expected}, instead it is #{actual}.')
            .expect(await dossierCreator.getActiveTabHeaderText())
            .toBe('MDX Sources');
        await dossierCreator.closeNewDossierPanel();
    });

    it('[BCIN-6908_08] hide mosaic and dda cube', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToCubesTab();
        await dossierCreator.searchData('mosaic');
        await takeScreenshotByElement(
            dossierCreator.getCubeFlatGrid(),
            'BCIN-6908_08_01',
            'No data when search mosaic cube'
        );
        await dossierCreator.searchData('dda');
        await takeScreenshotByElement(
            dossierCreator.getCubeFlatGrid(),
            'BCIN-6908_08_02',
            'No data when search dda cube'
        );
        await dossierCreator.closeNewDossierPanel();
    });

    it('[BCIN-6908_09] switch to folder mode will clear selection', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToCubesTab();
        await dossierCreator.searchData('airline');
        await dossierCreator.selectReportCube({ name: 'Airline Data' });
        await since('1. Create button should be enabled after selecting a cube, instead it is still disabled')
            .expect(await dossierCreator.isCreateButtonEnabled())
            .toBe(true);
        await dossierCreator.switchToTreeMode();
        await dossierCreator.waitTemplateLoading();
        await dossierCreator.dismissTooltipsByClickTitle();
        await since('2. Create button should be disabled after switching to folder mode, instead it is still enabled')
            .expect(await dossierCreator.isCreateButtonEnabled())
            .toBe(false);
        await takeScreenshotByElement(
            dossierCreator.getActiveTab(),
            'BCIN-6908_09_01',
            'Clear selection after switch to folder mode'
        );
        await since('3. The first row should be #{expected}, instead we have #{actual}.')
            .expect(await dossierCreator.getRowDataInAddDataTab(0))
            .toContain('00_Old folders');
        await dossierCreator.expandTreeView('Public Objects', 'Reports');
        await dossierCreator.doubleClickOnTreeView('Reports');
        await dossierCreator.searchData('Datasets');
        await dossierCreator.doubleClickOnAgGrid('Datasets');
        await dossierCreator.searchData('airline');
        await dossierCreator.selectReportCube({ name: 'Airline Data' });
        await since('4. Create button should be enabled after selecting a cube, instead it is still disabled')
            .expect(await dossierCreator.isCreateButtonEnabled())
            .toBe(true);
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportPage.clickReportTitle();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6908_09_02',
            'Report created by cube in folder mode'
        );
    });
});
