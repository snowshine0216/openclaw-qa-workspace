import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import resetReportState from '../../../../api/reports/resetReportState.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { financialAnalysisDossier } from '../../../../constants/customApp/info.js';

describe('Report UI - Authoring General', () => {
    let {
        loginPage,
        libraryPage,
        dossierPage,
        reportPage,
        reportGridView,
        reportToolbar,
        reportTOC,
        reportFilterPanel,
        setFilter,
        reportFilter,
        promptEditor,
        promptObject,
        infoWindow,
        baseVisualization,
        attributeFilter,
        metricFilter,
        reportDatasetPanel,
    } = browsers.pageObj1;
    const testUser = reportConstants.reportUICheckUser;

    beforeAll(async () => {
        await loginPage.login(testUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
    });

    it('[TC99684_01] Show both report objects and folder browser in authoring', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'TC99684_01_01',
            'report authoring view in pause mode'
        );
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportGridView.waitForGridCellToBeExpectedValue(7, 4, '$1,254,030');
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'TC99684_01_02',
            'report authoring view in design mode'
        );
    });

    it('[TC99684_02] Report with style and show total', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductNoPageBy.id,
            projectId: reportConstants.UIReportProductNoPageBy.project.id,
        });
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'TC99684_02_01', 'report with style in pause mode');
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('29 Rows, 3 Columns');
        await since('2. The total value of revenue should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(29, 4))
            .toBe('$11,517,606');
        await since('3. The total value of cost should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(29, 2))
            .toBe('$9,777,521');
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC99684_02_02',
            'report with style and show total'
        );
    });

    it('[TC99684_03] Navigate in object browser by attribute shortcuts', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportRegionOnly.id,
            projectId: reportConstants.UIReportRegionOnly.project.id,
        });
        await reportDatasetPanel.openFolderBrowserPopover();
        await takeScreenshotByElement(
            reportDatasetPanel.getFolderBrowserPopover(),
            'TC99684_03_01',
            'Folder browser popover'
        );
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportDatasetPanel.ObjectBrowserPanel, 'TC99684_03_02', 'Object browser panel');
        await reportDatasetPanel.navigateInObjectBrowser(['Attributes', '5.0 Time Calendar']);
        await takeScreenshotByElement(
            reportDatasetPanel.ObjectBrowserPanel,
            'TC99684_03_03',
            'Object browser under Time Calendar'
        );
    });

    it('[TC99684_04] Navigate in object browser by metrics shortcuts', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportRegionOnly.id,
            projectId: reportConstants.UIReportRegionOnly.project.id,
        });
        await reportDatasetPanel.navigateInObjectBrowser(['Metrics', 'Sales Metrics']);
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportDatasetPanel.ObjectBrowserPanel,
            'TC99684_04_01',
            'Object browser under Sales Metrics'
        );
    });

    it('[TC99684_05] Navigate in object browser by hierarchies shortcuts', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportRegionOnly.id,
            projectId: reportConstants.UIReportRegionOnly.project.id,
        });
        await reportDatasetPanel.navigateInObjectBrowser(['Hierarchies', 'Geography']);
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportDatasetPanel.ObjectBrowserPanel,
            'TC99684_05_01',
            'Object browser under Geography hierarchy'
        );
    });

    it('[TC99684_06] Navigate in object browser by data explorer shortcuts', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportRegionOnly.id,
            projectId: reportConstants.UIReportRegionOnly.project.id,
        });
        await reportDatasetPanel.navigateInObjectBrowser(['Data Explorer']);
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportDatasetPanel.ObjectBrowserPanel,
            'TC99684_06_01',
            'Object browser under Data Explorer'
        );
        await reportDatasetPanel.navigateInObjectBrowser(['Time']);
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportDatasetPanel.ObjectBrowserPanel,
            'TC99684_06_02',
            'Object browser under Time of Data Explorer'
        );
        await reportDatasetPanel.openFolderBrowserPopover();
        await reportDatasetPanel.scrollObjectBrowserPopoverToTop();
        await reportDatasetPanel.navigateInObjectBrowserPopover(['MicroStrategy Tutorial']);
        await takeScreenshotByElement(
            reportDatasetPanel.ObjectBrowserPanel,
            'TC99684_06_03',
            'Folder browser under MicroStrategy Tutorial'
        );
        await reportDatasetPanel.openFolderBrowserPopover();
        await reportDatasetPanel.navigateInObjectBrowserPopover(['Data Explorer']);
        await takeScreenshotByElement(
            reportDatasetPanel.ObjectBrowserPanel,
            'TC99684_06_04',
            'Folder browser after navigate by popover'
        );
    });

    it('[TC99684_07] empty filter panel', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportRegionOnly.id,
            projectId: reportConstants.UIReportRegionOnly.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await takeScreenshotByElement(
            reportFilterPanel.getContainer(),
            'TC99684_07_01',
            'Empty filter panel in authoring mode'
        );
        await reportFilterPanel.openNewQualicationEditorAtNonAggregationLevel();
        await attributeFilter.waitForElementVisible(attributeFilter.getSearchDropdown());
        await reportFilterPanel.sleep(2000); // wait for dropdown animation finish
        await takeScreenshotByElement(metricFilter.getQualificationEditor(), 'TC99684_07_02', 'auto popup dropdown');
    });

    it('[TC99684_08] click cancel to remove filter', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportRegionOnly.id,
            projectId: reportConstants.UIReportRegionOnly.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportFilterPanel.openNewQualicationEditorAtNonAggregationLevel();
        await attributeFilter.waitForElementVisible(attributeFilter.getSearchDropdown());
        await reportFilterPanel.attributeFilter.cancel();
        await takeScreenshotByElement(
            reportFilterPanel.getContainer(),
            'TC99684_08_01',
            'Empty filter panel in authoring mode'
        );
    });

    it('[TC99684_09] valid filter set', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportByYear.id,
            projectId: reportConstants.UIReportByYear.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportFilter.selectExpressionContextMenu({ expType: 'Attribute Qualification', objectName: 'Year' });
        await reportFilter.selectContextMenuOption('Create a Set');
        await setFilter.waitForElementVisible(setFilter.getPopover());
        await takeScreenshotByElement(
            setFilter.getPopover(),
            'TC99684_09_01',
            'pop out set filter dropdown automatically'
        );
        await setFilter.searchInAuthoring('Category');
        await setFilter.selectOptionsInAuthoring([{ selection: 'Category' }]);
        await setFilter.searchInAuthoring('Region');
        await setFilter.selectOptionsInAuthoring([{ selection: 'Region' }]);
        await setFilter.closeFilterSetPopopver();
        await takeScreenshotByElement(reportPage.getContainer(), 'TC99684_09_02', 'filter set in authoring mode');
    });

    it('[TC99684_10] invalid filter set', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportByYear.id,
            projectId: reportConstants.UIReportByYear.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportFilter.selectExpressionContextMenu({ expType: 'Attribute Qualification', objectName: 'Year' });
        await reportFilter.selectContextMenuOption('Create a Set');
        await setFilter.waitForElementVisible(setFilter.getPopover());
        await setFilter.closeFilterSetPopopver();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'TC99684_10_01',
            'filter set with warning in authoring mode'
        );
        await reportFilter.selectExpressionContextMenu({ expType: 'Attribute Qualification', objectName: 'Year' });
        await reportFilter.selectContextMenuOption('Create a Set');
        await setFilter.waitForElementVisible(setFilter.getPopover());
        await setFilter.closeFilterSetPopopver();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'TC99684_10_02',
            'nested filter set with warning in authoring mode'
        );
    });

    // BCIN-3487: Workstation UI fails to display error message and hangs when syntactical errors are introduced in certain Freeform SQL Reports
    it('[BCIN-3487] execute ffsql report with syntactical errors in sql', async () => {
        const errorMessage = 'One or more datasets are not loaded for this item.';
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.FfsqlReportWithSQLSyntacticalErrors.id,
            projectId: reportConstants.FfsqlReportWithSQLSyntacticalErrors.project.id,
        });
        await reportToolbar.switchToDesignMode(true);
        let prompt = await promptObject.getPromptByName('Number');
        await promptObject.textbox.clearAndInputText(prompt, '50');
        await promptEditor.run();
        await reportPage.waitForElementVisible(reportPage.getErrorDialogMainContainer());
        await since('1. Error message should be #{expected} in authoring, instead we have #{actual}')
            .expect(await reportPage.errorMsg())
            .toBe(errorMessage);
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-3487_01', 'error message');
        await libraryPage.openReportByUrl({
            documentId: reportConstants.FfsqlReportWithSQLSyntacticalErrors.id,
            projectId: reportConstants.FfsqlReportWithSQLSyntacticalErrors.project.id,
            prompt: true,
        });
        prompt = await promptObject.getPromptByName('Number');
        await promptObject.textbox.clearAndInputText(prompt, '10');
        await promptEditor.run();
        await reportPage.waitForElementVisible(reportPage.getErrorDialogMainContainer());
        await since('2. Error message should be #{expected} in consumption, instead we have #{actual}')
            .expect(await reportPage.errorMsg())
            .toBe(errorMessage);
    });

    // BCIN-6567: Issue detected in WorkStation on September 25 when importing lists from files into filters.
    it('[BCIN-6567] upload file to report filter as selection', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.dndFromObjectPanelToContainer('Category', 'report filters');
        await reportFilterPanel.selectElements(['Electronics', 'Movies', 'Music']);
        await reportFilterPanel.attributeFilter.done();
        await reportDatasetPanel.dndFromObjectPanelToContainer('Subcategory', 'report filters');
        await reportFilterPanel.attributeFilter.clickQualifyOn();
        await reportFilterPanel.attributeFilter.selectAttributeFormOption('ID');
        await reportFilterPanel.attributeFilter.openOperatorDropdown();
        await reportFilterPanel.attributeFilter.selectAttributeFormOperator('In');
        await reportFilterPanel.customInputBox.importValuesFromFile({ fileName: 'BCIN-6567.xlsx' });
        await takeScreenshotByElement(
            reportFilterPanel.attributeFilter.getDetailedPanel(),
            'BCIN-6567_01',
            'import file to report filter as selection'
        );
        await reportFilterPanel.attributeFilter.done();
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$487,359');
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('4 Rows, 3 Columns');
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6567_02',
            'report data view after applying filter imported from file'
        );
    });

    // BCIN-6864: When edit report first and then edit dashboard on library, 'edit filter' option is missed for viz context menu
    it('[BCIN-6864_01] verify dashboard context menu after edit report first', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$201,164');
        // RMC on Category
        await reportGridView.openGridContextMenuByPos(0, 0);
        await takeScreenshotByElement(
            baseVisualization.getSettingMenu(),
            'BCIN-6864_01_01',
            'report attribute header context menu'
        );
        // RMC on Revenue
        await reportGridView.openGridContextMenuByPos(0, 4);
        await takeScreenshotByElement(
            baseVisualization.getSettingMenu(),
            'BCIN-6864_01_02',
            'report metric header context menu'
        );
        await reportPage.closeReportAuthoringWithoutSave();
        await libraryPage.openDossierInfoWindow(financialAnalysisDossier.name);
        await infoWindow.clickEditButton();
        await baseVisualization.openMenuOnVisualization('Revenue Detail');
        await takeScreenshotByElement(
            baseVisualization.getSettingMenu(),
            'BCIN-6864_01_03',
            'viz context menu in authoring'
        );
    });

    it('[BCIN-6864_02] verify report context menu in consumption', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.UIReportProductWithPageBy,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$201,164');
        // RMC on Category
        await reportGridView.openGridContextMenuByPos(0, 0);
        await takeScreenshotByElement(
            baseVisualization.getSettingMenu(),
            'BCIN-6864_02_01',
            'report attribute header context menu in consumption'
        );
        // RMC on Revenue
        await reportGridView.openGridContextMenuByPos(0, 4);
        await takeScreenshotByElement(
            baseVisualization.getSettingMenu(),
            'BCIN-6864_02_02',
            'report metric header context menu in consumption'
        );
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(reportConstants.UIReportProductWithPageBy.name);
        await infoWindow.clickEditButton();
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$201,164');
        // RMC on Category
        await reportGridView.openGridContextMenuByPos(0, 0);
        await takeScreenshotByElement(
            baseVisualization.getSettingMenu(),
            'BCIN-6864_02_03',
            'report attribute header context menu in authoring'
        );
        // RMC on Revenue
        await reportGridView.openGridContextMenuByPos(0, 4);
        await takeScreenshotByElement(
            baseVisualization.getSettingMenu(),
            'BCIN-6864_02_04',
            'report metric header context menu in authoring'
        );
    });
});
