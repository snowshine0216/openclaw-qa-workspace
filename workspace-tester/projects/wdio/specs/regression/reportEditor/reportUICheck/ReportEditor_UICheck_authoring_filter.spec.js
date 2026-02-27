import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Report UI - Report filter', () => {
    let {
        loginPage,
        libraryPage,
        reportTOC,
        reportFilterPanel,
        setFilter,
        reportFilter,
        reportDatasetPanel,
        reportGridView,
        reportToolbar,
        reportPage,
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

    it('[BCIN-6585_01] verify object path in report filter search results', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportFilterPanel.openNewReportFiltersPanel();
        await reportFilterPanel.newQual.waitForObjectSearchDropdown();
        await reportFilterPanel.newQual.searchBasedOn('Category');
        await takeScreenshotByElement(
            reportFilterPanel.newQual.getSearchDropdown(),
            'BCIN-6585_01_01',
            'Object with path in search results'
        );
        await reportFilterPanel.newQual.clickBasedOnCategory('Attribute');
        await takeScreenshotByElement(
            reportFilterPanel.newQual.getSearchDropdown(),
            'BCIN-6585_01_02',
            'only show attributes'
        );
        await reportFilterPanel.newQual.clickBasedOnCategory('Filter');
        await takeScreenshotByElement(
            reportFilterPanel.newQual.getSearchDropdown(),
            'BCIN-6585_01_03',
            'only show filters'
        );
        await reportFilterPanel.newQual.clickBasedOnCategory('Report');
        await reportFilterPanel.newQual.hoverOnBasedObject('Category');
        await since('1. Object path tooltip should be #{expected}, instead we have #{actual}')
            .expect(await reportFilterPanel.newQual.getObjectLocationText())
            .toBe(
                'MicroStrategy Tutorial > Public Objects > Reports > MicroStrategy Platform Capabilities > MicroStrategy SDK > Visualization Framework > Store Sales > Category'
            );
        await since('2. Object description tooltip should be #{expected}, instead we have #{actual}')
            .expect(await reportFilterPanel.newQual.getObjectDescText())
            .toBe('This report is used for MicroStrategy SDK samples.');
    });

    it('[BCIN-6585_02] verify object path in report limits search results', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportFilterPanel.openNewReportLimitsPanel();
        await reportFilterPanel.newQual.waitForObjectSearchDropdown();
        await reportFilterPanel.newQual.searchBasedOn('Cost');
        await takeScreenshotByElement(
            reportFilterPanel.newQual.getSearchDropdown(),
            'BCIN-6585_02_01',
            'Object with path report limit search results'
        );
    });

    it('[BCIN-6585_03] verify object path in report filter set search results', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.dndFromObjectPanelToContainer('Year', 'report filter');
        await reportFilterPanel.selectElements(['2020', '2021']);
        await reportFilterPanel.newQual.done();
        await reportFilter.selectExpressionContextMenu({ expType: 'Attribute Qualification', objectName: 'Year' });
        await reportFilter.selectContextMenuOption('Create a Set');
        await setFilter.waitForElementVisible(setFilter.getPopover());
        await setFilter.searchInAuthoring('Category');
        await takeScreenshotByElement(
            setFilter.getSetOfDropdown(),
            'BCIN-6585_03_01',
            'Object with path in filter set search results'
        );
    });

    // BCIN-6653: Unable to create "In List" filters locally in reports using Workstation and users can not manually type in the "List of Values" textbox.
    it('[BCIN-6653_01] type in input area when set filter for id form by operator is in', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.dndFromObjectPanelToContainer('Category', 'report filter');
        await reportFilterPanel.attributeFilter.clickQualifyOn();
        await reportFilterPanel.attributeFilter.selectAttributeFormOption('ID');
        await reportFilterPanel.attributeFilter.openOperatorDropdown();
        await reportFilterPanel.attributeFilter.selectAttributeFormOperator('In');
        await reportFilterPanel.customInputBox.clearByKeyboard();
        await reportFilterPanel.customInputBox.inputListOfValue('1');
        await reportFilterPanel.customInputBox.validate();
        await reportFilterPanel.newQual.done();
        await reportToolbar.switchToDesignMode();
        await reportPage.clickReportTitle();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$201,164');
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Books');
        await since('2. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('1 Rows, 3 Columns');
    });
});
