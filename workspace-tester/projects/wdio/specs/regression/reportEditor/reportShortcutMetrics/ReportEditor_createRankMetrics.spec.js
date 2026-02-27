import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
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

    it('[TC85613_1] Step 1: Creating rank metrics', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ReportGridShortcutMx.id,
            projectId: reportConstants.ReportGridShortcutMx.project.id,
        });
        // # step 1a - create rank from default settings in pause mode
        await reportEditorPanel.createRankForMetricInMetricsDropZone('Cost');
        // await takeScreenshotByElement(reportEditorPanel.metricsDropzone, 'TC85613_1', 'Rank (Cost) Ascending');
        await since(
            'After create rank metric for "Cost", metrics dropzone should have #{expected} instead we have #{actual}'
        )
            .expect(await reportEditorPanel.getMetricsObjects())
            .toContain('Rank (Cost) Ascending');
        await reportToolbar.switchToDesignMode();
        await since(
            'After create rank from default settings in pause mode for Cost, Grid cell at "0", "0" should have text "Subcategory", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos('0', '0'))
            .toBe('Subcategory');
        await since(
            'After create rank from default settings in pause mode for Cost, Grid cell at "1", "0" should have text "Art & Architecture", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos('1', '0'))
            .toBe('Art & Architecture');
        await since(
            'After create rank from default settings in pause mode for Cost, Grid cell at "1", "1" should have text "2015 DE", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos('1', '1'))
            .toBe('2015 DE');
        await since(
            'After create rank from default settings in pause mode for Cost, Grid cell at "0", "2" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos('0', '2'))
            .toBe('Cost');
        await since(
            'After create rank from default settings in pause mode for Cost, Grid cell at "1", "2" should have text "-$36,780", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos('1', '2'))
            .toBe('-$36,780');
        await since(
            'After create rank from default settings in pause mode for Cost, Grid cell at "0", "3" should have text "Rank (Cost) Ascending", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos('0', '3'))
            .toBe('Rank (Cost) Ascending');
        await since(
            'After create rank from default settings in pause mode for Cost, Grid cell at "1", "3" should have text "15", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos('1', '3'))
            .toBe('15');
        // await reportEditorPanel.openRankSubMenuForMetricInMetricsDropZone('Cost');
        await reportEditorPanel.createRankForMetricInMetricsDropZone('Cost', 'Descending');
        // await takeScreenshotByElement(reportEditorPanel.metricsDropzone, 'TC85613_1', 'Rank (Cost) Descending');
        await since(
            'After create rank for Cost in Descending order, metrics dropzone should have #{expected} instead we have #{actual}'
        )
            .expect(await reportEditorPanel.getMetricsObjects())
            .toContain('Rank (Cost) Descending');
        await since(
            'After create rank for Cost in Descending order, Grid cell at "0", "0" should have text "Subcategory", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos('0', '0'))
            .toBe('Subcategory');
        await since(
            'After create rank for Cost in Descending order, Grid cell at "1", "0" should have text "Art & Architecture", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos('1', '0'))
            .toBe('Art & Architecture');
        await since(
            'After create rank for Cost in Descending order, Grid cell at "1", "1" should have text "2015 DE", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos('1', '1'))
            .toBe('2015 DE');
        await since(
            'After create rank for Cost in Descending order, Grid cell at "0", "2" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos('0', '2'))
            .toBe('Cost');
        await since(
            'After create rank for Cost in Descending order, Grid cell at "1", "2" should have text "-$36,780", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos('1', '2'))
            .toBe('-$36,780');
        await since(
            'After create rank for Cost in Descending order, Grid cell at "0", "3" should have text "Rank (Cost) Descending", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos('0', '3'))
            .toBe('Rank (Cost) Descending');
        await since(
            'After create rank for Cost in Descending order, Grid cell at "1", "3" should have text "233", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos('1', '3'))
            .toBe('233');
        await since(
            'After create rank for Cost in Descending order, Grid cell at "1", "4" should have text "15", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos('1', '4'))
            .toBe('15');
        // When I open rank submenu for metric "Cost" in "Metrics" dropzone in Report Editor
        await reportEditorPanel.openRankSubMenuForMetricInMetricsDropZone('Cost');

        await takeScreenshotByElement(reportEditorPanel.getRankSubMenu(), 'TC85613_1', 'Rank (Cost) Submenu');

        await reportEditorPanel.changeBreakByDropDownInRankSubmenuAndSubmit('Subcategory');

        await since(
            'After create break by subcategory metric for "Cost", metrics dropzone should have "Rank (Cost) Break by (Subcategory) Ascending" instead we have #{actual}'
        )
            .expect(await reportEditorPanel.getMetricsObjects())
            .toContain('Rank (Cost) Break by (Subcategory) Ascending');
        // await reportPageBy.selectElementfromSelector('Category', 'Music');
        await reportPageBy.changePageByElement('Category', 'Music');
        await since(
            'After change report page by selector "Category" to "Music" in Report Editor, Grid cell at "0", "0" should have text "Subcategory", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos('0', '0'))
            .toBe('Subcategory');
        await since(
            'After change report page by selector "Category" to "Music" in Report Editor,  Grid cell at "1", "0" should have text "Alternative", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos('1', '0'))
            .toBe('Alternative');
        await since(
            'After change report page by selector "Category" to "Music" in Report Editor, Grid cell at "1", "1" should have text "2015 DE", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos('1', '1'))
            .toBe('2015 DE');
        await since(
            'After change report page by selector "Category" to "Music" in Report Editor, Grid cell at "0", "2" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos('0', '2'))
            .toBe('Cost');
        await since(
            'After change report page by selector "Category" to "Music" in Report Editor, Grid cell at "1", "2" should have text "$69,879", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos('1', '2'))
            .toBe('-$69,879');
        await since(
            'After change report page by selector "Category" to "Music" in Report Editor, Grid cell at "0", "3" should have text "Rank (Cost) Break by (Subcategory) Ascending", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos('0', '3'))
            .toBe('Rank (Cost) Break by (Subcategory) Ascending');
        await since(
            'After change report page by selector "Category" to "Music" in Report Editor, Grid cell at "1", "3" should have text "1", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos('1', '3'))
            .toBe('1');

        await since(
            'After change report page by selector "Category" to "Music" in Report Editor, Grid cell at "1", "4" should have text "245", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos('1', '4'))
            .toBe('245');

        await since(
            'After change report page by selector "Category" to "Music" in Report Editor, The grid cell at "1", "5" should have text "15", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 5))
            .toBe('3');

        await reportEditorPanel.openRankSubMenuForMetricInMetricsDropZone('Rank (Cost) Ascending');

        await takeScreenshotByElement(reportEditorPanel.getRankSubMenu(), 'TC85613_1', 'Rank (Cost) Ascending Submenu');
        // When I change sort dropdown in rank submenu in Editor Panel to "Descending"
        await reportEditorPanel.changeRankDropdown('sorts', 'Descending');

        // And I cancel current selections in rank submenu in Editor Panel
        await reportEditorPanel.cancelRankSelections();

        // Then the grid cell at "0", "6" is not present
        await since(
            'After change sort dropdown in rank submenu in Editor Panel to "Descending" in Report Editor, The grid cell at "0", "6" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(0, 6).isDisplayed())
            .toBe(false);

        // When I select element "2015 + 2016" from Page by selector "2015 & 2016"
        await reportPageBy.changePageByElement('2015 & 2016', '2015 + 2016');

        // Then the grid cell at "0", "0" has text "Subcategory"
        await since(
            'After change pageby for 2015 & 2016 to 2015 + 2016, The grid cell at "0", "0" should have text "Subcategory", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Subcategory');

        // And the grid cell at "1", "0" has text "Art & Architecture"
        await since(
            'After change pageby for 2015 & 2016 to 2015 + 2016, The grid cell at "1", "0" should have text "Art & Architecture", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Alternative');
        // And the grid cell at "1", "1" has text "2015 DE"
        await since(
            'TAfter change pageby for 2015 & 2016 to 2015 + 2016, he grid cell at "1", "1" should have text "2015 DE", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('2015 DE');

        // And the grid cell at "0", "2" has text "Cost"
        await since(
            'After change pageby for 2015 & 2016 to 2015 + 2016, The grid cell at "0", "2" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Cost');

        // And the grid cell at "1", "2" has text "$36,780"
        await since(
            'After change pageby for 2015 & 2016 to 2015 + 2016, The grid cell at "1", "2" should have text "$36,780", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('$69,879');

        // And the grid cell at "0", "3" has text "Rank (Cost) Break by (Subcategory) Ascending"
        await since(
            'TAfter change pageby for 2015 & 2016 to 2015 + 2016, he grid cell at "0", "3" should have text "Rank (Cost) Break by (Subcategory) Ascending", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Rank (Cost) Break by (Subcategory) Ascending');

        // And the grid cell at "1", "3" has text "19"
        await since(
            'After change pageby for 2015 & 2016 to 2015 + 2016, The grid cell at "1", "3" should have text "19", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('15');

        // // And the grid cell at "0", "4" has text "Rank (Cost) Descending"
        // await since(
        //     'After change pageby for 2015 & 2016 to 2015 + 2016, The grid cell at "0", "4" should have text "Rank (Cost) Descending", instead we have #{actual}'
        // )
        //     .expect(await reportGridView.getGridCellTextByPos(0, 4))
        //     .toBe('Rank (Cost) Descending');

        // And the grid cell at "1", "4" has text "57"
        await since(
            'After change pageby for 2015 & 2016 to 2015 + 2016, The grid cell at "1", "4" should have text "57", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('23');
        await since(
            'After change pageby for 2015 & 2016 to 2015 + 2016, The grid cell at "1", "5" should have text "225", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 5))
            .toBe('225');

        // When I select element "Music" from Page by selector "Category"
        // await reportPageBy.selectElementfromSelector('Category', 'Music');
        await reportPageBy.changePageByElement('Category', 'Music');
        // Then The current selection for page by selector "Category" should be "Music"
        await since(
            'After change report page by selector "Category" to "Music" in Report Editor, The current selection for page by selector "Category" should be "Music", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Category'))
            .toBe('Music');

        // And the grid cell at "1", "0" has text "Alternative"
        await since(
            'After change report page by selector "Category" to "Music" in Report Editor, The grid cell at "1", "0" should have text "Alternative", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Alternative');

        // And the grid cell at "1", "1" has text "2015 DE"
        await since(
            'After change report page by selector "Category" to "Music" in Report Editor, The grid cell at "1", "1" should have text "2015 DE", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('2015 DE');

        // And the grid cell at "1", "2" has text "$69,879"
        await since(
            'After change report page by selector "Category" to "Music" in Report Editor, The grid cell at "1", "2" should have text "$69,879", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('$69,879');

        // And the grid cell at "0", "3" has text "Rank (Cost) Break by (Subcategory) Ascending"
        await since(
            'After change report page by selector "Category" to "Music" in Report Editor, The grid cell at "0", "3" should have text "Rank (Cost) Break by (Subcategory) Ascending", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Rank (Cost) Break by (Subcategory) Ascending');

        // And the grid cell at "1", "3" has text "15"
        await since(
            'After change report page by selector "Category" to "Music" in Report Editor, The grid cell at "1", "3" should have text "15", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('15');

        // And the grid cell at "1", "4" has text "23"
        await since(
            'After change report page by selector "Category" to "Music" in Report Editor, The grid cell at "1", "4" should have text "23", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('23');
        // And the grid cell at "1", "5" has text "225"
        await since(
            'After change report page by selector "Category" to "Music" in Report Editor, The grid cell at "1", "5" should have text "225", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 5))
            .toBe('225');
    });
});
