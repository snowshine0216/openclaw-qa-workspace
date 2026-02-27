import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';

describe('Report Editor Shortcut Metrics in Workstation', () => {
    let { loginPage, libraryPage, reportToolbar, reportEditorPanel, reportGridView, reportDerivedMetricEditor } =
        browsers.pageObj1;

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

    it('[TC85613_4] Step 4: Creating percent to total metrics (rows and columns - DE245912 could change results)', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ReportGridShortcutMxAttrInCols.id,
            projectId: reportConstants.ReportGridShortcutMxAttrInCols.project.id,
        });
        await reportToolbar.switchToDesignMode();

        // Then the grid cell at "0", "0" has text "Year"
        await since(
            'After switch to Design Mode, The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "1", "0" has text "Subcategory"
        await since(
            'After switch to Design Mode, The grid cell at "1", "0" should have text "Subcategory", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Subcategory');

        // And the grid cell at "2", "0" has text "Art & Architecture"
        await since(
            'After switch to Design Mode, The grid cell at "2", "0" should have text "Art & Architecture", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('Art & Architecture');

        // And the grid cell at "0", "1" has text "2015 DE"
        await since(
            'After switch to Design Mode, The grid cell at "0", "1" should have text "2015 DE", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('2015 DE');

        // And the grid cell at "1", "1" has text "Cost"
        await since(
            'After switch to Design Mode, The grid cell at "1", "1" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Cost');

        // And the grid cell at "2", "1" has text "-$36,780"
        await since(
            'After switch to Design Mode, The grid cell at "2", "1" should have text "-$36,780", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('-$36,780');

        // And the grid cell at "0", "2" has text "2016"
        await since(
            'After switch to Design Mode, The grid cell at "0", "2" should have text "2016", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('2016');

        // And the grid cell at "1", "2" has text "Cost"
        await since(
            'After switch to Design Mode, The grid cell at "1", "2" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Cost');

        // And the grid cell at "2", "2" has text "$44,810"
        await since(
            'After switch to Design Mode, The grid cell at "2", "2" should have text "$44,810", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('$44,810');
        await reportEditorPanel.createPercentToTotalForMetricInMetricsDropZone('Cost', 'Over Rows');
        // Then the grid cell at "0", "0" has text "Year"
        await since(
            'After create percent to total for metric "Cost" in "Over Rows", The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "1", "0" has text "Subcategory"
        await since(
            'After create percent to total for metric "Cost" in "Over Rows", The grid cell at "1", "0" should have text "Subcategory", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Subcategory');

        // And the grid cell at "2", "0" has text "Art & Architecture"
        await since(
            'After create percent to total for metric "Cost" in "Over Rows", The grid cell at "2", "0" should have text "Art & Architecture", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('Art & Architecture');

        // And the grid cell at "0", "1" has text "2015 DE"
        await since(
            'After create percent to total for metric "Cost" in "Over Rows", The grid cell at "0", "1" should have text "2015 DE", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('2015 DE');

        // And the grid cell at "1", "1" has text "Cost"
        await since(
            'After create percent to total for metric "Cost" in "Over Rows", The grid cell at "1", "1" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Cost');

        // And the grid cell at "2", "1" has text "-$36,780"
        await since(
            'After create percent to total for metric "Cost" in "Over Rows", The grid cell at "2", "1" should have text "-$36,780", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('-$36,780');

        // And the grid cell at "1", "2" has text "Percent to Total By Rows (Cost)"
        await since(
            'After create percent to total for metric "Cost" in "Over Rows", The grid cell at "1", "2" should have text "Percent to Total By Rows (Cost)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Percent to Total By Rows (Cost)');

        // And the grid cell at "2", "2" has text "-458.03%"
        await since(
            'After create percent to total for metric "Cost" in "Over Rows", The grid cell at "2", "2" should have text "-458.03%", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('-458.03%');

        // And the grid cell at "0", "3" has text "2016"
        await since(
            'After create percent to total for metric "Cost" in "Over Rows", The grid cell at "0", "3" should have text "2016", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('2016');

        // And the grid cell at "1", "3" has text "Cost"
        await since(
            'After create percent to total for metric "Cost" in "Over Rows", The grid cell at "1", "3" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('Cost');

        // And the grid cell at "2", "3" has text "$44,810"
        await since(
            'After create percent to total for metric "Cost" in "Over Rows", The grid cell at "2", "3" should have text "$44,810", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$44,810');

        // And the grid cell at "1", "4" has text "Percent to Total By Rows (Cost)"
        await since(
            'After create percent to total for metric "Cost" in "Over Rows", The grid cell at "1", "4" should have text "Percent to Total By Rows (Cost)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('Percent to Total By Rows (Cost)');

        // And the grid cell at "2", "4" has text "558.03%"
        await since(
            'After create percent to total for metric "Cost" in "Over Rows", The grid cell at "2", "4" should have text "558.03%", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toBe('558.03%');
        await reportEditorPanel.createPercentToTotalForMetricInMetricsDropZone('Cost', 'Over Columns');
        // Then the grid cell at "0", "0" has text "Year"
        await since(
            'After create percent to total for metric "Cost" in "Over Columns", The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "1", "0" has text "Subcategory"
        await since(
            'After create percent to total for metric "Cost" in "Over Columns", The grid cell at "1", "0" should have text "Subcategory", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Subcategory');

        // And the grid cell at "2", "0" has text "Art & Architecture"
        await since(
            'After create percent to total for metric "Cost" in "Over Columns", The grid cell at "2", "0" should have text "Art & Architecture", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('Art & Architecture');

        // And the grid cell at "0", "1" has text "2015 DE"
        await since(
            'After create percent to total for metric "Cost" in "Over Columns", The grid cell at "0", "1" should have text "2015 DE", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('2015 DE');

        // And the grid cell at "1", "1" has text "Cost"
        await since(
            'After create percent to total for metric "Cost" in "Over Columns", The grid cell at "1", "1" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Cost');

        // And the grid cell at "2", "1" has text "-$36,780"
        await since(
            'After create percent to total for metric "Cost" in "Over Columns", The grid cell at "2", "1" should have text "-$36,780", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('-$36,780');

        // And the grid cell at "1", "2" has text "Percent to Total By Columns (Cost)"
        await since(
            'After create percent to total for metric "Cost" in "Over Columns", The grid cell at "1", "2" should have text "Percent to Total By Columns (Cost)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Percent to Total By Columns (Cost)');

        // And the grid cell at "2", "2" has text "17.80%"
        await since(
            'After create percent to total for metric "Cost" in "Over Columns", The grid cell at "2", "2" should have text "17.80%", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('17.80%');

        // And the grid cell at "1", "3" has text "Percent to Total By Rows (Cost)"
        await since(
            'After create percent to total for metric "Cost" in "Over Columns", The grid cell at "1", "3" should have text "Percent to Total By Rows (Cost)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('Percent to Total By Rows (Cost)');

        // And the grid cell at "2", "3" has text "-458.03%"
        await since(
            'After create percent to total for metric "Cost" in "Over Columns", The grid cell at "2", "3" should have text "-458.03%", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('-458.03%');

        // And the grid cell at "0", "4" has text "2016"
        await since(
            'After create percent to total for metric "Cost" in "Over Columns", The grid cell at "0", "4" should have text "2016", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('2016');

        // And the grid cell at "1", "4" has text "Cost"
        await since(
            'After create percent to total for metric "Cost" in "Over Columns", The grid cell at "1", "4" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('Cost');

        // And the grid cell at "2", "4" has text "$44,810"
        await since(
            'After create percent to total for metric "Cost" in "Over Columns", The grid cell at "2", "4" should have text "$44,810", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toBe('$44,810');

        // And the grid cell at "1", "5" has text "Percent to Total By Columns (Cost)"
        await since(
            'After create percent to total for metric "Cost" in "Over Columns", The grid cell at "1", "5" should have text "Percent to Total By Columns (Cost)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 5))
            .toBe('Percent to Total By Columns (Cost)');

        // And the grid cell at "2", "5" has text "18.32%"
        await since(
            'After create percent to total for metric "Cost" in "Over Columns", The grid cell at "2", "5" should have text "18.32%", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 5))
            .toBe('18.32%');

        // And the grid cell at "1", "6" has text "Percent to Total By Rows (Cost)"
        await since(
            'After create percent to total for metric "Cost" in "Over Columns", The grid cell at "1", "6" should have text "Percent to Total By Rows (Cost)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 6))
            .toBe('Percent to Total By Rows (Cost)');
        // And the grid cell at "2", "6" has text "558.03%"
        await since(
            'After create percent to total for metric "Cost" in "Over Columns", The grid cell at "2", "6" should have text "558.03%", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 6))
            .toBe('558.03%');

        await reportEditorPanel.openObjectContextMenu('metrics', 'metric', 'Percent to Total By Rows (Cost)');
        await reportEditorPanel.clickContextMenuItem('Edit...');
        // Then The Metric Editor should be "displayed"
        // And "Cost/Sum<UseLookupForAttributes=False>(Cost){@rows}" is displayed on the "Input" section of the Metrics panel
        // await since(
        //     '"Cost/Sum<UseLookupForAttributes=False>(Cost){@rows}" should be displayed on the "Input" section of the Metrics panel, instead we have #{actual}'
        // )
        //     .expect(await reportDerivedMetricEditor.getInputSectionText())
        //     .toContain('Cost/Sum<UseLookupForAttributes=False>(Cost){@rows}');
        await takeScreenshotByElement(
            reportDerivedMetricEditor.metricDefn,
            'TC85613_4',
            'ReportEditor_createPercentToTotalForMetrics_1'
        );
        await reportDerivedMetricEditor.saveFormulaMetric();

        // When I open context menu for "metric" "Percent to Total By Columns (Cost)" in "metrics" dropzone from the Editor Panel in Report Editor
        await reportEditorPanel.openObjectContextMenu('metrics', 'metric', 'Percent to Total By Columns (Cost)');

        // And I click context menu item "Edit..." in Editor Panel
        await reportEditorPanel.clickContextMenuItem('Edit...');
        // And "Cost/Sum<UseLookupForAttributes=False>(Cost){@cols}" is displayed on the "Input" section of the Metrics panel
        // await since(
        //     '"Cost/Sum<UseLookupForAttributes=False>(Cost){@cols}" should be displayed on the "Input" section of the Metrics panel'
        // )
        //     .expect(await metricsPanel.isTextDisplayed('Cost/Sum<UseLookupForAttributes=False>(Cost){@cols}', 'Input'))
        //     .toBe(true);
        await takeScreenshotByElement(
            reportDerivedMetricEditor.metricDefn,
            'TC85613_4',
            'ReportEditor_createPercentToTotalForMetrics_2'
        );

        // When I click on the "Save" button of DM Editor in Formula mode
        await reportDerivedMetricEditor.saveFormulaMetric();
    });
});
