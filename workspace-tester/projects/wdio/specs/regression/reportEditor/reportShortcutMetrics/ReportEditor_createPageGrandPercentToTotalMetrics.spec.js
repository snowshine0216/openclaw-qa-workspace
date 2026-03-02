import * as reportConstants from '../../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';

describe('Report Editor Shortcut Metrics in Workstation', () => {
    let { loginPage, libraryPage, reportToolbar, reportEditorPanel, reportGridView, reportPageBy } = browsers.pageObj1;

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
    it('[TC85613_2] Step 2: Creating page and grand percent to total metrics', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ReportGridShortcutMxAttrInCols.id,
            projectId: reportConstants.ReportGridShortcutMxAttrInCols.project.id,
        });

        // Open context menu and verify submenu items
        await reportEditorPanel.expandSubmenuForPercentToTotalForMetricInMetricsDropZone('Cost');

        // Verify all submenu items are displayed
        await since(
            'After expand submenu for percent to total for metric "Cost" in Report Editor, Submenu item "Over Rows" should be displayed, instead we have #{actual}'
        )
            .expect(await reportEditorPanel.isSubmenuItemDisplayed('Over Rows'))
            .toBe(true);
        await since(
            'After expand submenu for percent to total for metric "Cost" in Report Editor, Submenu item "Over Columns" should be displayed, instead we have #{actual}'
        )
            .expect(await reportEditorPanel.isSubmenuItemDisplayed('Over Columns'))
            .toBe(true);
        await since(
            'After expand submenu for percent to total for metric "Cost" in Report Editor, Submenu item "Page Total" should be displayed, instead we have #{actual}'
        )
            .expect(await reportEditorPanel.isSubmenuItemDisplayed('Page Total'))
            .toBe(true);
        await since(
            'After expand submenu for percent to total for metric "Cost" in Report Editor, Submenu item "Grand Total" should be displayed, instead we have #{actual}'
        )
            .expect(await reportEditorPanel.isSubmenuItemDisplayed('Grand Total'))
            .toBe(true);
        await since(
            'After expand submenu for percent to total for metric "Cost" in Report Editor, Submenu item "Total for Each" should be displayed, instead we have #{actual}'
        )
            .expect(await reportEditorPanel.isSubmenuItemDisplayed('Total for Each'))
            .toBe(true);

        await reportToolbar.switchToDesignMode();
        // Then the grid cell at "0", "0" has text "Year"
        await since(
            'After switch to design mode, The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "1", "0" has text "Subcategory"
        await since(
            'After switch to design mode, The grid cell at "1", "0" should have text "Subcategory", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Subcategory');

        // And the grid cell at "2", "0" has text "Art & Architecture"
        await since(
            'After switch to design mode, The grid cell at "2", "0" should have text "Art & Architecture", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('Art & Architecture');

        // And the grid cell at "0", "1" has text "2015 DE"
        await since(
            'After switch to design mode, The grid cell at "0", "1" should have text "2015 DE", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('2015 DE');

        // And the grid cell at "1", "1" has text "Cost"
        await since(
            'After switch to design mode, The grid cell at "1", "1" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Cost');

        // And the grid cell at "2", "1" has text "-$36,780"
        await since(
            'After switch to design mode, The grid cell at "2", "1" should have text "-$36,780", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('-$36,780');

        // And the grid cell at "0", "2" has text "2016"
        await since(
            'After switch to design mode, The grid cell at "0", "2" should have text "2016", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('2016');

        // And the grid cell at "1", "2" has text "Cost"
        await since(
            'After switch to design mode, The grid cell at "1", "2" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Cost');

        // And the grid cell at "2", "2" has text "$44,810"
        await since(
            'After switch to design mode, The grid cell at "2", "2" should have text "$44,810", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('$44,810');

        // When I create percent to total "Grand Total" for metric "Cost" in "Metrics" dropzone in Report Editor
        await reportEditorPanel.createPercentToTotalForMetricInMetricsDropZone('Cost', 'Grand Total');
        await since(
            'After create percent to total "Grand Total" for metric "Cost" in "Metrics" dropzone in Report Editor, Metrics dropzone should contain "Percent to Grand Total (Cost)", instead we have #{actual}'
        )
            .expect(await reportEditorPanel.metricsDropzone.isDisplayed())
            .toBe(true);
        // And the grid cell at "0", "0" has text "Year"
        await since(
            'After create percent to total "Grand Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "1", "0" has text "Subcategory"
        await since(
            'After create percent to total "Grand Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "0" should have text "Subcategory", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Subcategory');

        // And the grid cell at "2", "0" has text "Art & Architecture"
        await since(
            'After create percent to total "Grand Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "2", "0" should have text "Art & Architecture", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('Art & Architecture');

        // And the grid cell at "0", "1" has text "2015 DE"
        await since(
            'After create percent to total "Grand Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "0", "1" should have text "2015 DE", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('2015 DE');

        // And the grid cell at "1", "1" has text "Cost"
        await since(
            'After create percent to total "Grand Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "1" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Cost');

        // And the grid cell at "2", "1" has text "-$36,780"
        await since(
            'After create percent to total "Grand Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "2", "1" should have text "-$36,780", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('-$36,780');

        // And the grid cell at "1", "2" has text "Percent to Grand Total (Cost)"
        await since(
            'After create percent to total "Grand Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "2" should have text "Percent to Grand Total (Cost)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Percent to Grand Total (Cost)');

        // And the grid cell at "2", "2" has text "-0.92%"
        await since(
            'After create percent to total "Grand Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "2", "2" should have text "-0.92%", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('-0.92%');

        // And the grid cell at "0", "3" has text "2016"
        await since(
            'After create percent to total "Grand Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "0", "3" should have text "2016", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('2016');

        // And the grid cell at "1", "3" has text "Cost"
        await since(
            'After create percent to total "Grand Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "3" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('Cost');

        // And the grid cell at "2", "3" has text "$44,810"
        await since(
            'After create percent to total "Grand Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "2", "3" should have text "$44,810", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$44,810');

        // And the grid cell at "1", "4" has text "Percent to Grand Total (Cost)"
        await since(
            'After create percent to total "Grand Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "4" should have text "Percent to Grand Total (Cost)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('Percent to Grand Total (Cost)');

        // And the grid cell at "2", "4" has text "1.12%"
        await since(
            'After create percent to total "Grand Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "2", "4" should have text "1.12%", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toBe('1.12%');

        // Create Page Total metric
        await reportEditorPanel.createPercentToTotalForMetricInMetricsDropZone('Cost', 'Page Total');
        await since(
            'After create percent to total "Page Total" for metric "Cost" in "Metrics" dropzone in Report Editor, Metrics dropzone should contain "Percent to Page Total (Cost)", instead we have #{actual}'
        )
            .expect(await reportEditorPanel.metricsDropzone.isDisplayed())
            .toBe(true);
        // And the grid cell at "0", "0" has text "Year"
        await since(
            'After create percent to total "Page Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "1", "0" has text "Subcategory"
        await since(
            'After create percent to total "Page Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "0" should have text "Subcategory", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Subcategory');

        // And the grid cell at "2", "0" has text "Art & Architecture"
        await since(
            'After create percent to total "Page Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "2", "0" should have text "Art & Architecture", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('Art & Architecture');

        // And the grid cell at "0", "1" has text "2015 DE"
        await since(
            'After create percent to total "Page Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "0", "1" should have text "2015 DE", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('2015 DE');

        // And the grid cell at "1", "1" has text "Cost"
        await since(
            'After create percent to total "Page Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "1" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Cost');

        // And the grid cell at "2", "1" has text "-$36,780"
        await since(
            'After create percent to total "Page Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "2", "1" should have text "-$36,780", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('-$36,780');

        // And the grid cell at "1", "2" has text "Percent to Page Total (Cost)"
        await since(
            'After create percent to total "Page Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "2" should have text "Percent to Page Total (Cost)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Percent to Page Total (Cost)');

        // And the grid cell at "2", "2" has text "-96.89%"
        await since(
            'After create percent to total "Page Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "2", "2" should have text "-96.89%", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('-96.89%');

        // And the grid cell at "1", "3" has text "Percent to Grand Total (Cost)"
        await since(
            'After create percent to total "Page Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "3" should have text "Percent to Grand Total (Cost)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('Percent to Grand Total (Cost)');

        // And the grid cell at "2", "3" has text "-0.92%"
        await since(
            'After create percent to total "Page Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "2", "3" should have text "-0.92%", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('-0.92%');

        // And the grid cell at "0", "4" has text "2016"
        await since(
            'After create percent to total "Page Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "0", "4" should have text "2016", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('2016');

        // And the grid cell at "1", "4" has text "Cost"
        await since(
            'After create percent to total "Page Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "4" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('Cost');

        // And the grid cell at "2", "4" has text "$44,810"
        await since(
            'After create percent to total "Page Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "2", "4" should have text "$44,810", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toBe('$44,810');

        // And the grid cell at "1", "5" has text "Percent to Page Total (Cost)"
        await since(
            'After create percent to total "Page Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "5" should have text "Percent to Page Total (Cost)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 5))
            .toBe('Percent to Page Total (Cost)');

        // And the grid cell at "2", "5" has text "118.04%"
        await since(
            'After create percent to total "Page Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "2", "5" should have text "118.04%", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 5))
            .toBe('118.04%');

        // And the grid cell at "1", "6" has text "Percent to Grand Total (Cost)"
        await since(
            'After create percent to total "Page Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "6" should have text "Percent to Grand Total (Cost)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 6))
            .toBe('Percent to Grand Total (Cost)');

        // And the grid cell at "2", "6" has text "1.12%"
        await since(
            'After create percent to total "Page Total" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "2", "6" should have text "1.12%", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 6))
            .toBe('1.12%');

        // Remove Subcategory and verify
        await reportEditorPanel.removeAttributeInRowsDropZone('Subcategory');

        // Open Percent to Total submenu again
        await reportEditorPanel.expandSubmenuForPercentToTotalForMetricInMetricsDropZone('Cost');

        // Update page selector and verify
        await reportPageBy.changePageByElement('2015 & 2016', '2015 + 2016');
        // And the grid cell at "0", "0" has text "Year"
        await since(
            'After remove Subcategory from "Rows" dropzone in Report Editor, The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "0", "1" has text "2015 DE"
        await since(
            'After remove Subcategory from "Rows" dropzone in Report Editor, The grid cell at "0", "1" should have text "2015 DE", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('2015 DE');

        // And the grid cell at "1", "1" has text "Cost"
        await since(
            'After remove Subcategory from "Rows" dropzone in Report Editor, The grid cell at "1", "1" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Cost');
    });
});
