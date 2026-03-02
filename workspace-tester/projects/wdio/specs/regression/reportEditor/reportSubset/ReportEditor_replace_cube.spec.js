import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Replace subset report cube', () => {
    let {
        loginPage,
        libraryPage,
        reportPage,
        reportGridView,
        dossierCreator,
        reportToolbar,
        reportTOC,
        reportFilterPanel,
        reportDatasetPanel,
    } = browsers.pageObj1;
    const testUser = reportConstants.reportSubsetTestUser;
    const airlineDataCube = 'Airline Data';
    const productOlapCube = 'Product OLAP cube';
    const templateWithSubsetReport = 'report template subset';

    beforeAll(async () => {
        await loginPage.login(testUser);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await dossierCreator.resetLocalStorage();
        await libraryPage.openDefaultApp();
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
    });

    it('[BCIN-6422_01] UI entry only show in subset report', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.AirlineSubsetReport.id,
            projectId: reportConstants.AirlineSubsetReport.project.id,
        });
        await since('1. Verify cube menu is shown in object panel for subset report, instead it is not shown')
            .expect(await reportDatasetPanel.getThreeDotsToOpenCubeMenu().isDisplayed())
            .toBe(true);
        await reportDatasetPanel.openSelectCubeDialog();
        await since('2. Verify Replace Cube dialog is shown, instead it is not shown')
            .expect(await reportPage.selectCubeDialog.getDatasetSelectContainer().isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            reportPage.selectCubeDialog.getDatasetSelectContainer(),
            'BCIN-6422_01_01',
            'replace cube dialog'
        );
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await since('3. Verify cube menu is not shown in object panel for non-subset report, instead it is shown')
            .expect(await reportDatasetPanel.getThreeDotsToOpenCubeMenu().isDisplayed())
            .toBe(false);
    });

    it('[BCIN-6422_02] Replace by MTDI cube in subset report', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.AirlineSubsetReport.id,
            projectId: reportConstants.AirlineSubsetReport.project.id,
        });
        await reportDatasetPanel.openSelectCubeDialog();
        await reportPage.selectCubeDialog.searchObject(airlineDataCube);
        await reportPage.selectCubeDialog.selectObjectInFlatView(airlineDataCube);
        await reportPage.selectCubeDialog.clickDoneButton();
        await reportPage.replaceObjectDialog.waitForLoading();
        await takeScreenshotByElement(
            reportPage.replaceObjectDialog.getReplaceObjectDialog(),
            'BCIN-6422_02_01',
            'replace object dialog default'
        );
        await reportPage.replaceObjectDialog.selectNewObjects([
            { name: 'Airline Name', opt: 'Year' },
            { name: 'Year', opt: 'Remove from report' },
            { name: 'Number of Flights', opt: 'Flights Cancelled' },
            { name: 'On-Time', opt: 'Number of Flights' },
        ]);
        await takeScreenshotByElement(
            reportPage.replaceObjectDialog.getReplaceObjectDialog(),
            'BCIN-6422_02_02',
            'replace object dialog after selection'
        );
        await reportPage.replaceObjectDialog.clickOkButton();
        await reportPage.waitForReportLoading(true);
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6422_02_01', 'Replace by MTDI cube');
    });

    it('[BCIN-6422_03] Replace by subset cube when creating report', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(reportConstants.tutorialProject.name);
        await dossierCreator.selectExecutionMode();
        await dossierCreator.searchTemplate(templateWithSubsetReport);
        await dossierCreator.selectTemplate(templateWithSubsetReport);
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '$28,192');
        await since(
            '1. Verify cube menu is shown in object panel for subset report when creating, instead it is not shown'
        )
            .expect(await reportDatasetPanel.getThreeDotsToOpenCubeMenu().isDisplayed())
            .toBe(true);
        await reportDatasetPanel.openSelectCubeDialog();
        await reportPage.selectCubeDialog.searchObject(airlineDataCube);
        await reportPage.selectCubeDialog.selectObjectInFlatView(airlineDataCube);
        await reportPage.selectCubeDialog.clickDoneButton();
        await reportPage.replaceObjectDialog.waitForLoading();
        await reportPage.replaceObjectDialog.selectNewObjects([{ name: 'Average Rate', opt: 'Flights Cancelled' }]);
        await takeScreenshotByElement(
            reportPage.replaceObjectDialog.getReplaceObjectDialog(),
            'BCIN-6422_03_01',
            'replace object dialog after selection'
        );
        await reportPage.replaceObjectDialog.clickOkButton();
        await reportPage.waitForReportLoading(true);
        await reportGridView.waitForGridCellToBeExpectedValue(1, 1, '3952');
        await since('2. Flights Cancelled on year 2010 should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('6842');
        await since('3. Flights Cancelled on year 2011 should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 1))
            .toBe('982');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6422_03_02', 'Replace by MTDI cube');
    });

    it('[BCIN-6422_04] Replace by olap cube', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.AirlineSubsetReport.id,
            projectId: reportConstants.AirlineSubsetReport.project.id,
        });
        await reportToolbar.switchToDesignMode(false);
        // wait for number of flights for AirTran Airways Corporation in year 2009 to be 22381
        await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '22381');
        await reportDatasetPanel.openSelectCubeDialog();
        await reportPage.selectCubeDialog.navigateInObjectBrowserFlatView(['Public Objects']);
        await reportPage.selectCubeDialog.searchObject('06. Dataset');
        await reportPage.selectCubeDialog.navigateInObjectBrowserFlatView(['06. Dataset']);
        await reportPage.selectCubeDialog.selectObjectInFlatView(productOlapCube);
        await reportPage.selectCubeDialog.clickDoneButton();
        await reportPage.replaceObjectDialog.waitForLoading();
        await reportPage.replaceObjectDialog.selectNewObjects([
            { name: 'Airline Name', opt: 'Category' },
            { name: 'Year', opt: 'Subcategory' },
            { name: 'Number of Flights', opt: 'Profit' },
        ]);
        await reportPage.replaceObjectDialog.toggleClearSettingsCheckbox();
        await takeScreenshotByElement(
            reportPage.replaceObjectDialog.getReplaceObjectDialog(),
            'BCIN-6422_04_01',
            'replace object dialog after selection'
        );
        await reportPage.replaceObjectDialog.clickOkButton();
        await reportPage.waitForReportLoading(true);
        await reportGridView.waitForGridCellToBeExpectedValue(1, 2, '$110,012');
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('24 Rows, 1 Columns');
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6422_04_02', 'Replace by olap cube');
    });

    it('[BCIN-6422_05] Replace cube when having cube filter', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.subsetReportWithCubeFilter.id,
            projectId: reportConstants.subsetReportWithCubeFilter.project.id,
        });
        await reportToolbar.switchToDesignMode(false);
        // wait for total Electronics to be 48,782,606
        await reportGridView.waitForGridCellToBeExpectedValue(1, 1, '48,782,606');
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportFilterPanel.getContainer(), 'BCIN-6422_05_01', 'cube filter by default');
        await reportTOC.switchToEditorPanel();
        await reportDatasetPanel.openSelectCubeDialog();
        await reportPage.selectCubeDialog.searchObject(productOlapCube);
        await reportPage.selectCubeDialog.selectObjectInFlatView(productOlapCube);
        await reportPage.selectCubeDialog.clickDoneButton();
        await reportPage.replaceObjectDialog.waitForLoading();
        await reportPage.replaceObjectDialog.clickOkButton();
        await reportGridView.waitForGridCellToBeExpectedValue(2, 1, '8,197,887');
        await reportTOC.switchToEditorPanel();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6422_05_02', 'remove cube filter');
    });

    it('[BCIN-6422_06] Replace cube when having derived metric and keep definition', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.subsetReportWithCubeFilter.id,
            projectId: reportConstants.subsetReportWithCubeFilter.project.id,
        });
        await reportToolbar.switchToDesignMode(false);
        // wait for total Electronics to be 48,782,606
        await reportGridView.waitForGridCellToBeExpectedValue(1, 1, '48,782,606');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportDatasetPanel.openSelectCubeDialog();
        await reportPage.selectCubeDialog.searchObject(productOlapCube);
        await reportPage.selectCubeDialog.selectObjectInFlatView(productOlapCube);
        await reportPage.selectCubeDialog.clickDoneButton();
        await reportPage.replaceObjectDialog.waitForLoading();
        await takeScreenshotByElement(
            reportPage.replaceObjectDialog.getReplaceObjectDialog(),
            'BCIN-6422_06_01',
            'keep derived metric definition'
        );
        await reportPage.replaceObjectDialog.clickOkButton();
        await reportGridView.waitForGridCellToBeExpectedValue(2, 1, '8,197,887');
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportFilterPanel.switchToViewFilterTab();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6422_06_02', 'remove cube filter');
    });

    it('[BCIN-6422_07] Replace cube when having derived metric and remove', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.subsetReportWithCubeFilter.id,
            projectId: reportConstants.subsetReportWithCubeFilter.project.id,
        });
        await reportToolbar.switchToDesignMode(false);
        // wait for total Electronics to be 48,782,606
        await reportGridView.waitForGridCellToBeExpectedValue(1, 1, '48,782,606');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportDatasetPanel.openSelectCubeDialog();
        await reportPage.selectCubeDialog.searchObject(productOlapCube);
        await reportPage.selectCubeDialog.selectObjectInFlatView(productOlapCube);
        await reportPage.selectCubeDialog.clickDoneButton();
        await reportPage.replaceObjectDialog.waitForLoading();
        await reportPage.replaceObjectDialog.selectNewObjects([{ name: 'Total', opt: 'Remove from report' }]);
        await takeScreenshotByElement(
            reportPage.replaceObjectDialog.getReplaceObjectDialog(),
            'BCIN-6422_07_01',
            'Remove derived metric'
        );
        await reportPage.replaceObjectDialog.clickOkButton();
        // wait for cost of Books to be $2,070,816
        await reportGridView.waitForGridCellToBeExpectedValue(1, 1, '$2,070,816');
        await since('1. The cost of music should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 1))
            .toBe('$3,713,323');
        await since('2. The profit of music should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 2))
            .toBe('$180,044');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6422_07_02', 'execute after removing DM');
    });

    it('[BCIN-6422_08] Replace cube when having view filter ', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.subsetReportWithCubeFilter.id,
            projectId: reportConstants.subsetReportWithCubeFilter.project.id,
        });
        await reportToolbar.switchToDesignMode(false);
        // wait for total Electronics to be 48,782,606
        await reportGridView.waitForGridCellToBeExpectedValue(1, 1, '48,782,606');
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportFilterPanel.switchToViewFilterTab();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportFilterPanel.getContainer(), 'BCIN-6422_08_01', 'view filter by default');
        await reportTOC.switchToEditorPanel();
        await reportDatasetPanel.openSelectCubeDialog();
        await reportPage.selectCubeDialog.searchObject(productOlapCube);
        await reportPage.selectCubeDialog.selectObjectInFlatView(productOlapCube);
        await reportPage.selectCubeDialog.clickDoneButton();
        await reportPage.replaceObjectDialog.waitForLoading();
        await reportPage.replaceObjectDialog.selectNewObjects([
            { name: 'Cost', opt: 'Remove from report' },
            { name: 'Profit', opt: 'Remove from report' },
            { name: 'Total', opt: 'Revenue' },
        ]);
        await takeScreenshotByElement(
            reportPage.replaceObjectDialog.getReplaceObjectDialog(),
            'BCIN-6422_08_01',
            'Replace view filter'
        );
        await reportPage.replaceObjectDialog.clickOkButton();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 1, '$24,391,303');
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('1 Rows, 1 Columns');
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportFilterPanel.switchToViewFilterTab();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6422_08_02', 'remove cube filter');
    });

    it('[BCIN-6422_09] Replace cube by removing all', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.AirlineSubsetReport.id,
            projectId: reportConstants.AirlineSubsetReport.project.id,
        });
        await reportToolbar.switchToDesignMode(false);
        // wait for number of flights for AirTran Airways Corporation in year 2009 to be 22381
        await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '22381');
        await reportDatasetPanel.openSelectCubeDialog();
        await reportPage.selectCubeDialog.searchObject(productOlapCube);
        await reportPage.selectCubeDialog.selectObjectInFlatView(productOlapCube);
        await reportPage.selectCubeDialog.clickDoneButton();
        await reportPage.replaceObjectDialog.waitForLoading();
        await takeScreenshotByElement(
            reportPage.replaceObjectDialog.getReplaceObjectDialog(),
            'BCIN-6422_09_01',
            'remove all objects'
        );
        await reportPage.replaceObjectDialog.clickOkButton();
        await reportPage.waitForReportLoading(true);
        await reportDatasetPanel.waitForStatusBarText('0 Rows');
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('0 Rows, 0 Columns');
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6422_09_02', 'remove all objects');
    });

    it('[BCIN-6422_10] undo redo after replace cube', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.AirlineSubsetReport.id,
            projectId: reportConstants.AirlineSubsetReport.project.id,
        });
        await reportToolbar.switchToDesignMode(false);
        // wait for number of flights for AirTran Airways Corporation in year 2009 to be 22381
        await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '22381');
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('29 Rows, 2 Columns');
        await reportDatasetPanel.openSelectCubeDialog();
        await reportPage.selectCubeDialog.searchObject(productOlapCube);
        await reportPage.selectCubeDialog.selectObjectInFlatView(productOlapCube);
        await reportPage.selectCubeDialog.clickDoneButton();
        await reportPage.replaceObjectDialog.waitForLoading();
        await reportPage.replaceObjectDialog.selectNewObjects([
            { name: 'Airline Name', opt: 'Category' },
            { name: 'Year', opt: 'Subcategory' },
            { name: 'Number of Flights', opt: 'Profit' },
        ]);
        await reportPage.replaceObjectDialog.clickOkButton();
        await reportPage.waitForReportLoading(true);
        await reportGridView.waitForGridCellToBeExpectedValue(1, 2, '$110,012');
        await since('2. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('24 Rows, 1 Columns');
        await reportToolbar.clickUndo(true);
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await since('3. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('29 Rows, 2 Columns');
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6422_10_02', 'undo replace cube');
        await reportToolbar.clickRedo(true);
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await since('4. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('24 Rows, 1 Columns');
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6422_10_03', 'redo replace cube');
    });
});
