import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Create embedded prompt to subset report VF', () => {
    let {
        loginPage,
        libraryPage,
        reportPage,
        reportGridView,
        promptEditor,
        aePrompt,
        valuePrompt,
        reportToolbar,
        reportTOC,
        reportFilterPanel,
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

    it('[BCIN-6468_01] create attribute element in list prompt on view filter', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.subsetReportWithOlapCubeNoViewFilter.id,
            projectId: reportConstants.subsetReportWithOlapCubeNoViewFilter.project.id,
        });
        await reportToolbar.switchToDesignMode(false);
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        // wait for profit of milwaukee to be $637,545
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$637,545');
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('15 Rows, 2 Columns');
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportFilterPanel.switchToViewFilterTab();
        await reportFilterPanel.openNewViewFilterPanel();
        await reportFilterPanel.newQual.waitForObjectSearchDropdown();
        await reportFilterPanel.newQual.selectBasedOnObject('Region');
        await since('2. Create Embedded Prompt button should be visible, but it is not shown.')
            .expect(await reportFilterPanel.newQual.getCreateEmbeddedPromptButton().isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            reportFilterPanel.getAttributeElementFilterSubpanel(),
            'BCIN-6468_01_01',
            'AE sub panel with embed prompt button'
        );
        await reportFilterPanel.newQual.clickCreateEmbeddedPrompt();
        await reportPage.embedPromptEditor.waitForLoading();
        await takeScreenshotByElement(
            reportPage.embedPromptEditor.getPromptSummaryContainer(),
            'BCIN-6468_01_02',
            'AE prompt in prompt editor'
        );
        await reportPage.embedPromptEditor.clickDoneButton();
        await takeScreenshotByElement(
            reportFilterPanel.newQual.getDetailedPanel(),
            'BCIN-6468_01_03',
            'AE prompt in filter detailed panel'
        );
        await reportFilterPanel.saveAndCloseQualificationEditor();
        await takeScreenshotByElement(
            reportFilterPanel.getViewFilterTab(),
            'BCIN-6468_01_04',
            'view filter panel with AE prompt'
        );
    });

    it('[BCIN-6468_02] create attribute element not in list prompt on view filter', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.subsetReportWithOlapCubeNoViewFilter.id,
            projectId: reportConstants.subsetReportWithOlapCubeNoViewFilter.project.id,
        });
        await reportToolbar.switchToDesignMode(false);
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        // wait for profit of milwaukee to be $637,545
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$637,545');
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('15 Rows, 2 Columns');
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportFilterPanel.switchToViewFilterTab();
        await reportFilterPanel.openNewViewFilterPanel();
        await reportFilterPanel.newQual.waitForObjectSearchDropdown();
        await reportFilterPanel.newQual.selectBasedOnObject('Region');
        await since('2. Create Embedded Prompt button should be visible, but it is not shown.')
            .expect(await reportFilterPanel.newQual.getCreateEmbeddedPromptButton().isDisplayed())
            .toBe(true);
        // switch to not in list mode
        await reportFilterPanel.attributeFilter.toggleElementListMode();
        await reportFilterPanel.newQual.clickCreateEmbeddedPrompt();
        await reportPage.embedPromptEditor.waitForLoading();
        await reportPage.embedPromptEditor.clickDoneButton();
        await reportFilterPanel.saveAndCloseQualificationEditor();
        await takeScreenshotByElement(
            reportFilterPanel.getViewFilterTab(),
            'BCIN-6468_02_01',
            'view filter panel with AE prompt'
        );
    });

    it('[BCIN-6468_03] run report with attribute element in list prompt on view filter', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.subsetReportWithOlapCubeNoViewFilter.id,
            projectId: reportConstants.subsetReportWithOlapCubeNoViewFilter.project.id,
        });
        await reportToolbar.switchToDesignMode(false);
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        // wait for profit of milwaukee to be $637,545
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$637,545');
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('15 Rows, 2 Columns');
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportFilterPanel.switchToViewFilterTab();
        await reportFilterPanel.openNewViewFilterPanel();
        await reportFilterPanel.newQual.waitForObjectSearchDropdown();
        await reportFilterPanel.newQual.selectBasedOnObject('Call Center');
        await reportFilterPanel.newQual.clickCreateEmbeddedPrompt();
        await reportPage.embedPromptEditor.waitForLoading();
        await reportPage.embedPromptEditor.clickDoneButton();
        await reportFilterPanel.saveAndCloseQualificationEditor();
        await reportFilterPanel.clickFilterApplyButton();
        await promptEditor.waitForRepromptLoading();
        const callCenterPrompt = await promptEditor.findPrompt('Call Center');
        await aePrompt.shoppingCart.clickElmInAvailableList(callCenterPrompt, 'San Diego');
        await aePrompt.shoppingCart.addSingle(callCenterPrompt);
        await promptEditor.run();
        // wait for profit of San Diego to be $449,553
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$449,553');
        await since('2. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('1 Rows, 2 Columns');
    });

    it('[BCIN-6468_04] run report with attribute element not in list prompt on view filter', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.subsetReportWithOlapCubeNoViewFilter.id,
            projectId: reportConstants.subsetReportWithOlapCubeNoViewFilter.project.id,
        });
        await reportToolbar.switchToDesignMode(false);
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        // wait for profit of milwaukee to be $637,545
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$637,545');
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('15 Rows, 2 Columns');
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportFilterPanel.switchToViewFilterTab();
        await reportFilterPanel.openNewViewFilterPanel();
        await reportFilterPanel.newQual.waitForObjectSearchDropdown();
        await reportFilterPanel.newQual.selectBasedOnObject('Call Center');
        await reportFilterPanel.attributeFilter.toggleElementListMode();
        await reportFilterPanel.newQual.clickCreateEmbeddedPrompt();
        await reportPage.embedPromptEditor.waitForLoading();
        await reportPage.embedPromptEditor.clickDoneButton();
        await reportFilterPanel.saveAndCloseQualificationEditor();
        await reportFilterPanel.clickFilterApplyButton();
        await promptEditor.waitForRepromptLoading();
        const callCenterPrompt = await promptEditor.findPrompt('Call Center');
        await aePrompt.shoppingCart.clickElmInAvailableList(callCenterPrompt, 'Atlanta');
        await aePrompt.shoppingCart.addSingle(callCenterPrompt);
        await promptEditor.run();
        // wait for profit of Miami to be $178,713
        await reportGridView.waitForGridCellToBeExpectedValue(11, 4, '$178,713');
        await since('2. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('14 Rows, 2 Columns');
    });

    it('[BCIN-6468_05] create value prompt in metric filter', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.subsetReportWithOlapCubeNoViewFilter.id,
            projectId: reportConstants.subsetReportWithOlapCubeNoViewFilter.project.id,
        });
        await reportToolbar.switchToDesignMode(false);
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        // wait for profit of milwaukee to be $637,545
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$637,545');
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportFilterPanel.switchToViewFilterTab();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportFilterPanel.openNewViewFilterPanel();
        await reportFilterPanel.newQual.waitForObjectSearchDropdown();
        await reportFilterPanel.newQual.selectBasedOnObject('Cost');
        await reportFilterPanel.metricFilter.openSelector('Operator');
        await reportFilterPanel.metricFilter.selectOption('Greater than');
        await reportFilterPanel.newQual.clickCreateEmbeddedPrompt();
        await reportPage.embedPromptEditor.waitForLoading();
        await takeScreenshotByElement(
            reportPage.embedPromptEditor.getPromptSummaryContainer(),
            'BCIN-6468_06_01',
            'value prompt for number'
        );
        await reportPage.embedPromptEditor.clickDoneButton();
        await reportFilterPanel.saveAndCloseQualificationEditor();
        await reportFilterPanel.clickFilterApplyButton();
        await promptEditor.waitForRepromptLoading();
        const valuePromptForCost = await promptEditor.findPrompt('Number');
        await valuePrompt.textbox.clearAndInputText(valuePromptForCost, '2000000');
        await promptEditor.run();
        await reportGridView.waitForGridCellToBeExpectedValue(6, 4, '$583,538');
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('6 Rows, 2 Columns');
    });

    it('[BCIN-6468_06] no prompt icon for MDTI cube report', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.AirlineSubsetReport.id,
            projectId: reportConstants.AirlineSubsetReport.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportFilterPanel.switchToViewFilterTab();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportFilterPanel.openNewViewFilterPanel();
        await reportFilterPanel.newQual.waitForObjectSearchDropdown();
        await reportFilterPanel.newQual.selectBasedOnObject('Airline Name');
        await since(
            '1. Create Embedded Prompt button should not be visible for attribute view filter, but it is shown.'
        )
            .expect(await reportFilterPanel.newQual.getCreateEmbeddedPromptButton().isDisplayed())
            .toBe(false);
        await reportFilterPanel.clickCancelQualificationEditor();
        await reportFilterPanel.openNewViewFilterPanel();
        await reportFilterPanel.newQual.waitForObjectSearchDropdown();
        await reportFilterPanel.newQual.selectBasedOnObject('Number of Flights');
        await since('2. Create Embedded Prompt button should not be visible for metric view filter, but it is shown.')
            .expect(await reportFilterPanel.newQual.getCreateEmbeddedPromptButton().isDisplayed())
            .toBe(false);
    });

    it('[BCIN-6468_07] create embedded attribute prompt in normal report', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TemplateProductReport.id,
            projectId: reportConstants.TemplateProductReport.project.id,
        });
        await reportToolbar.switchToDesignMode(false);
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '$5,293,624');
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('29 Rows, 2 Columns');
        await reportTOC.switchToFilterPanel();
        await reportFilterPanel.openNewQualicationEditorAtNonAggregationLevel();
        await reportFilterPanel.newQual.waitForObjectSearchDropdown();
        await reportFilterPanel.newQual.searchBasedOn('Year');
        await reportFilterPanel.newQual.selectBasedOnObject('Year');
        await since(
            '2. Create Embedded Prompt button should be visible for attribute report filter, but it is not shown.'
        )
            .expect(await reportFilterPanel.newQual.getCreateEmbeddedPromptButton().isDisplayed())
            .toBe(true);
        await reportFilterPanel.newQual.clickCreateEmbeddedPrompt();
        await reportPage.embedPromptEditor.waitForLoading();
        await reportPage.embedPromptEditor.clickDoneButton();
        await reportFilterPanel.saveAndCloseQualificationEditor();
        await reportFilterPanel.clickFilterApplyButton();
        await promptEditor.waitForRepromptLoading();
        const yearPrompt = await promptEditor.findPrompt('Year');
        await aePrompt.shoppingCart.clickElmInAvailableList(yearPrompt, '2020');
        await aePrompt.shoppingCart.addSingle(yearPrompt);
        await promptEditor.run();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '$1,304,141');
        await since('3. Total profit should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(1, 3))
            .toBe('$1,304,141');
    });

    it('[BCIN-6468_08] run subset report with prompt in view filter on consumption mode', async () => {
        await libraryPage.openReportByUrl({
            documentId: reportConstants.subsetReportWithPromptInViewFilter.id,
            projectId: reportConstants.subsetReportWithPromptInViewFilter.project.id,
            prompt: true,
        });
        const callCenterPrompt = await promptEditor.findPrompt('Category');
        await aePrompt.shoppingCart.clickElmInAvailableList(callCenterPrompt, 'Books');
        await aePrompt.shoppingCart.addSingle(callCenterPrompt);
        await aePrompt.shoppingCart.clickElmInAvailableList(callCenterPrompt, 'Electronics');
        await aePrompt.shoppingCart.addSingle(callCenterPrompt);
        const valuePromptForRevenue = await promptEditor.findPrompt('Number');
        await valuePrompt.textbox.clearAndInputText(valuePromptForRevenue, '3000000');
        await promptEditor.run();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '$24,391,303');
        await since('3. Total profit should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(2, 3))
            .toBe('$24,391,303');
    });
});
