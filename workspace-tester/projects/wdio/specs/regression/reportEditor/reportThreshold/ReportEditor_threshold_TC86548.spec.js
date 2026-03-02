import * as reportConstants from '../../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';

describe('Report Editor Thresholds', () => {
    let {
        loginPage,
        libraryPage,
        reportDatasetPanel,
        reportToolbar,
        reportGridView,
        thresholdEditor,
        advancedFilter,
        reportEditorPanel,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(reportConstants.reportUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC86548] Report editor thresholds TC86548 show/hide thresholds', async () => {
        await libraryPage.createNewReportByUrl({});
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Geography']);
        await reportDatasetPanel.addMultipleObjectsToRows(['Country', 'Region']);
        await reportDatasetPanel.clickFolderUpMultipleTimes(3);
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);
        await reportDatasetPanel.addMultipleObjectsToColumns(['Cost', 'Profit']);

        // And I switch to design mode in Report Editor
        await reportToolbar.switchToDesignMode();

        // And I open context menu from the column header "Cost" from grid view in Report Editor
        await reportEditorPanel.openThresholdInDropZoneForMetric('Cost');

        // And I click Enable Allow Users option check box for the "simple" threshold
        await thresholdEditor.clickOnEnableAllowUsersCheckBox('simple');

        // // And I click Enable Allow Users option check box for the "simple" threshold
        // await thresholdEditor.clickOnEnableAllowUsersCheckBox('simple');

        // And I save and close Simple Thresholds Editor
        await thresholdEditor.saveAndCloseSimThresholdEditor();

        // Then the grid cell at "1", "1" has style "background-color" with value "rgba(255,255,255,1)"
        // getCellStyleByPos
        await since(
            'The grid cell at "1", "1" should have background-color with value "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        // And the grid cell at "2", "2" has style "background-color" with value "rgba(246,219,127,1)"
        await since(
            'The grid cell at "2", "2" should have style "background-color" with value "rgba(246,219,127,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 2, 'background-color'))
            .toBe('rgba(75,201,149,1)');

        // When I open context menu from the column header "Country" from grid view in Report Editor
        await reportEditorPanel.openThresholdInDropZoneForAttribute('Country');

        // And I click New Threshold button to open the new threshold condition editor in advanced threshold editor
        await thresholdEditor.openNewThresholdCondition();

        // And I choose attribute "Region" from dropdown
        await thresholdEditor.selectOptionAttributeFromDropdown('Region');

        // And I check attribute "Web" from attributes list
        await thresholdEditor.checkAttributeName('Web');

        // And I click OK Button on New Qualification editor
        await advancedFilter.clickOnNewQualificationEditorOkButton();

        // And I select option Sample under Format Preview
        await thresholdEditor.selectOptionSample();

        // And I set fill color to "Light Green" in the format preview panel
        await thresholdEditor.setFillColor('Light Green');

        // And I set opacity to "50" percent in the format preview panel
        await thresholdEditor.setOpacityPercentage('50');

        // And I click ok on Format Preview panel
        await thresholdEditor.clickFormatPreviewPanelOkButton();

        // And I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();

        // Then the grid cell at "1", "2" has style "background-color" with value "rgba(132,200,123,1)"
        await since(
            'The grid cell at "8", "0" should have background-color with value "#{expected}", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(8, 0, 'background-color'))
            .toBe('rgba(204,255,204,0.5)');
        // // When I open context menu from the column header "Country" from grid view in Report Editor
        // await reportGridView.openGridColumnHeaderContextMenu('Country');

        // // And I click "Clear Thresholds" option from grid view context menu in Report Editor
        // await reportGridView.clickContextMenuOption('Clear Thresholds');

        await reportEditorPanel.clearThresholdsForAttributeInRowsDropzone('Country');

        // Then the grid cell at "8", "0" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'The grid cell at "8", "0" should have background-color with value "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(8, 0, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        // // When I open context menu from the column header "Cost" from grid view in Report Editor
        // await reportGridView.openGridColumnHeaderContextMenu('Cost');

        // // And I click "Clear Thresholds" option from grid view context menu in Report Editor
        // await reportGridView.clickContextMenuOption('Clear Thresholds');

        await reportEditorPanel.clearThresholdsForMetricInMetricsDropZone('Cost');

        // Then the grid cell at "2", "2" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'The grid cell at "2", "2" should have background-color with value "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 2, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        // And the grid cell at "3", "2" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'The grid cell at "3", "2" should have background-color with value "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(3, 2, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        // And the grid cell at "4", "2" has style "background-color" with value "rgba(255,255,255,1)"
        await since(
            'The grid cell at "4", "2" should have background-color with value "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(4, 2, 'background-color'))
            .toBe('rgba(255,255,255,1)');
    });
});
