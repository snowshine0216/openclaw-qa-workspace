import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Add prompt to subset report VF', () => {
    let {
        loginPage,
        libraryPage,
        reportPage,
        reportGridView,
        reportToolbar,
        reportTOC,
        reportFilterPanel,
        reportFilter,
        reportDatasetPanel,
    } = browsers.pageObj1;
    const testUser = reportConstants.reportSubsetTestUser;

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

    it('[BCIN-6460_01] not allow to add view filter by DnD multiple selection', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.subsetReportWithCubeFilter.id,
            projectId: reportConstants.subsetReportWithCubeFilter.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportFilterPanel.switchToViewFilterTab();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportDatasetPanel.dndByMultiSelectFromReportObjectsToViewFilter({
            objectNames: ['Category', 'Year'],
            target: 'filter data',
        });
        await takeScreenshotByElement(
            reportFilterPanel.getViewFilterTab(),
            'BCIN-6460_01_01',
            'not allow to add by dnd multiple selection'
        );
        await reportDatasetPanel.clickObjectInReportObjectsPanel('Category');
        await reportDatasetPanel.dndFromObjectPanelToContainer('Category', 'filter data');
        await reportFilterPanel.waitForElementVisible(reportFilterPanel.AttributeFormsPanel);
        await since('1. attribute filter subpanel is opened after dnd single selection, instead it is not show')
            .expect(await reportFilterPanel.getAttributeElementFilterSubpanel().isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            reportFilterPanel.getViewFilterTab(),
            'BCIN-6460_01_02',
            'add view filter by Dnd single selection'
        );
    });

    it('[BCIN-6460_02] adding attribute metric to view filter on existing subset report', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.subsetReportWithOlapCube.id,
            projectId: reportConstants.subsetReportWithOlapCube.project.id,
        });
        await reportToolbar.switchToDesignMode(false);
        // wait for profit of Audio Equipment to be $188,719
        await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '$188,719');
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportFilterPanel.switchToViewFilterTab();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportFilterPanel.getViewFilterTab(), 'BCIN-6460_02_01', 'existing view filter');
        await reportDatasetPanel.dndFromObjectPanelToContainer('Subcategory', 'view filters');
        await reportFilterPanel.selectElements(['Cameras', 'Computers']);
        await reportFilterPanel.newQual.done();
        await reportDatasetPanel.clickObjectInReportObjectsPanel('Cost');
        await reportDatasetPanel.dndFromObjectPanelToContainer('Cost', 'aggregation filters');
        await reportFilterPanel.metricFilter.openSelector('Operator');
        await reportFilterPanel.metricFilter.selectOption('Greater than');
        await reportFilterPanel.metricFilter.enterValue('500000');
        await reportFilterPanel.metricFilter.done();
        await reportFilterPanel.clickFilterApplyButton();
        await reportDatasetPanel.waitForStatusBarText('1 Rows');
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('1 Rows, 2 Columns');
        await since('2. Cost of Electronics should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(1, 2))
            .toBe('$1,217,778');
    });

    it('[BCIN-6460_03] DnD irrelevant qualification prompt to subset report', async () => {
        const qualificationPrompt = '01. Qualification prompt on year';
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.subsetReportWithOlapCube.id,
            projectId: reportConstants.subsetReportWithOlapCube.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportFilterPanel.switchToViewFilterTab();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportDatasetPanel.searchObjectInObjectBrowser(qualificationPrompt);
        await reportDatasetPanel.dndFromObjectBrowserToReportViewFilter({
            objectName: qualificationPrompt,
            options: { isWait: false },
        });
        await reportPage.waitForElementVisible(reportPage.getConfirmDialog());
        await since('1. Warning dialog should show when adding irrelevant prompt, instead warning dialog is not shown')
            .expect(await reportPage.getConfirmDialog().isDisplayed())
            .toBe(true);
        await since('2. The warning message should be #{expected}, instead we have #{actual}.')
            .expect(await reportPage.getConfirmMessage().getText())
            .toBe(`Failed to add. Only prompts relevant to this report's data can be added to the filter.`);
        await reportPage.clickOKInConfirmDialog();
    });

    it('[BCIN-6460_04] DnD valid attribute qualification prompt to subset report', async () => {
        const qualificationPrompt = '02. Qualification prompt on category';
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.subsetReportWithOlapCube.id,
            projectId: reportConstants.subsetReportWithOlapCube.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportFilterPanel.switchToViewFilterTab();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportDatasetPanel.searchObjectInObjectBrowser(qualificationPrompt);
        await reportDatasetPanel.dndFromObjectBrowserToReportViewFilter({
            objectName: qualificationPrompt,
            options: { isWait: false },
        });
        await takeScreenshotByElement(
            reportFilterPanel.getViewFilterTab(),
            'BCIN-6460_04_01',
            'add attribute qualification prompt to view filter'
        );
    });

    it('[BCIN-6460_05] DnD attribute elements prompt to subset report', async () => {
        const aePromptForYear = '03. Attribute elements prompt on year';
        const aePromptForCategory = '04. Attribute elements prompt on category';
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.subsetReportWithOlapCube.id,
            projectId: reportConstants.subsetReportWithOlapCube.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportFilterPanel.switchToViewFilterTab();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportDatasetPanel.searchObjectInObjectBrowser(aePromptForYear);
        await reportDatasetPanel.dndFromObjectBrowserToReportViewFilter({
            objectName: aePromptForYear,
            options: { isWait: false },
        });
        await reportPage.waitForElementVisible(reportPage.getConfirmDialog());
        await since(
            '1. Warning dialog should show when adding irrelevant ae prompt, instead warning dialog is not shown'
        )
            .expect(await reportPage.getConfirmDialog().isDisplayed())
            .toBe(true);
        await reportPage.clickOKInConfirmDialog();
        await reportDatasetPanel.searchObjectInObjectBrowser(aePromptForCategory);
        await reportDatasetPanel.dndFromObjectBrowserToReportViewFilter({
            objectName: aePromptForCategory,
            options: { isWait: false },
        });
        await takeScreenshotByElement(
            reportFilterPanel.getViewFilterTab(),
            'BCIN-6460_05_01',
            'add ae prompt to view filter'
        );
    });

    it('[BCIN-6460_06] DnD metric qualification prompt to subset report', async () => {
        const metricQualPromptForCostRevenue = '05. Metric qualification on cost and revenue';
        const metricQualPromptForUnitPrice = '06. Metric qualification on unit price';
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.subsetReportWithOlapCube.id,
            projectId: reportConstants.subsetReportWithOlapCube.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportFilterPanel.switchToViewFilterTab();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportDatasetPanel.searchObjectInObjectBrowser(metricQualPromptForUnitPrice);
        await reportDatasetPanel.dndFromObjectBrowserToReportViewFilter({
            objectName: metricQualPromptForUnitPrice,
            options: { isWait: false },
        });
        await reportPage.waitForElementVisible(reportPage.getConfirmDialog());
        await since(
            '1. Warning dialog should show when adding irrelevant ae prompt, instead warning dialog is not shown'
        )
            .expect(await reportPage.getConfirmDialog().isDisplayed())
            .toBe(true);
        await reportPage.clickOKInConfirmDialog();
        await reportDatasetPanel.searchObjectInObjectBrowser(metricQualPromptForCostRevenue);
        await reportDatasetPanel.dndFromObjectBrowserToReportViewFilter({
            objectName: metricQualPromptForCostRevenue,
            options: { isWait: false },
        });
        await takeScreenshotByElement(
            reportFilterPanel.getViewFilterTab(),
            'BCIN-6460_06_01',
            'add metric qualification prompt to view filter'
        );
    });

    it('[BCIN-6460_07] DnD value prompt to subset report', async () => {
        const valuePromptForNumber = '07. Value prompt for number';
        const valuePromptForText = '08. Value prompt for text';
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.subsetReportWithOlapCube.id,
            projectId: reportConstants.subsetReportWithOlapCube.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportFilterPanel.switchToViewFilterTab();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportDatasetPanel.searchObjectInObjectBrowser(valuePromptForText);
        const inlineVFItemForProfit = reportFilter.findInlineFilterItem({
            expType: reportConstants.reportFilterType.metricQualification,
            objectName: 'Profit',
        });
        await reportDatasetPanel.dndFromObjectBrowserToReportViewFilter({
            objectName: valuePromptForText,
            target: inlineVFItemForProfit.getConstValueInput(),
            options: { isWait: false },
        });
        await takeScreenshotByElement(
            reportFilterPanel.getViewFilterTab(),
            'BCIN-6460_07_01',
            'text value prompt cannot add'
        );
        await reportDatasetPanel.searchObjectInObjectBrowser(valuePromptForNumber);
        await reportDatasetPanel.dndFromObjectBrowserToReportViewFilter({
            objectName: valuePromptForNumber,
            target: inlineVFItemForProfit.getConstValueInput(),
            options: { isWait: false },
        });
        await takeScreenshotByElement(
            reportFilterPanel.getViewFilterTab(),
            'BCIN-6460_07_02',
            'number value prompt can add'
        );
    });

    it('[BCIN-6460_08] Check tooltip in view filter', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.subsetReportWithOlapCubeNoViewFilter.id,
            projectId: reportConstants.subsetReportWithOlapCubeNoViewFilter.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportFilterPanel.switchToViewFilterTab();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await since('1. The view filter tab is empty, instead it is not empty')
            .expect(await reportFilterPanel.getViewFilterEmptyPlaceholder().isDisplayed())
            .toBe(true);
        await since('2. The message in empty view filter should be #{expected}, instead we have #{actual}.')
            .expect(await reportFilterPanel.getViewFilterEmptyPlaceholder().getText())
            .toBe(
                'Drag an attribute, metric, or relevant prompt from the object panel or click to create a new filter.'
            );
        await takeScreenshotByElement(
            reportFilterPanel.getContainer(),
            'BCIN-6460_08_01',
            'empty view filter in subset report'
        );
    });
});
