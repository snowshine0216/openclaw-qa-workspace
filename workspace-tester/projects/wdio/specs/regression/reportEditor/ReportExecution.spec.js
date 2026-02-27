import * as reportConstants from '../../../constants/report.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import resetReportState from '../../../api/reports/resetReportState.js';

describe('Report Editor in Workstation', () => {
    let { loginPage, libraryPage, reportToolbar, reportGridView, reportPromptEditor, reportPageBy } = browsers.pageObj1;

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

    it('[TC84709_1] FUN | Report Editor | Report Execution', async () => {
        await resetReportState({
            credentials: reportConstants.reportUser,
            report: reportConstants.NormalReport1,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.NormalReport1.id,
            projectId: reportConstants.NormalReport1.project.id,
        });
        // Then the grid cell at "0", "0" has text "Region"
        await since('The grid cell at "0", "0" should have text "Region", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Region');

        // And the grid cell at "0", "1" has text "2015 & 2016"
        await since('The grid cell at "0", "1" should have text "2015 & 2016", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('2015 & 2016');

        // And the grid cell at "0", "2" has text "Custom Categories"
        await since('The grid cell at "0", "2" should have text "Custom Categories", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Custom Categories');

        // And the grid cell at "1", "0" has text "Northeast"
        await since('The grid cell at "1", "0" should have text "Northeast", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Northeast');

        // And the grid cell at "1", "1" has text "2016 - 2015"
        await since('The grid cell at "1", "1" should have text "2016 - 2015", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('2016 - 2015');

        // And the grid cell at "1", "2" has text "Category Sales"
        await since('The grid cell at "1", "2" should have text "Category Sales", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Category Sales');

        // And the grid cell at "1", "3" has text ""
        await since('The grid cell at "1", "3" should have "", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('');

        // And the grid cell at "1", "4" has text "$478,169"
        await since('The grid cell at "1", "4" should have "$478,169", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('$478,169');

        // And the grid cell at "1", "5" has text "45"
        await since('The grid cell at "1", "5" should have "45", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 5))
            .toBe('45');
    });
    it('[TC84709_2] FUN | Report Editor | Report Execution', async () => {
        await resetReportState({
            credentials: reportConstants.reportUser,
            report: reportConstants.NormalReportMetricsInRow2,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.NormalReportMetricsInRow2.id,
            projectId: reportConstants.NormalReportMetricsInRow2.project.id,
        });
        // Then the grid cell at "0", "0" has text "Region"
        await since('The grid cell at "0", "0" should have text "Region", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Region');

        // And the grid cell at "0", "1" has text "Employee"
        await since('The grid cell at "0", "1" should have text "Employee", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Employee');

        // And the grid cell at "0", "2" has text ""
        await since('The grid cell at "0", "2" should have text "", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('');

        // And the grid cell at "0", "3" has text ""
        await since('The grid cell at "0", "3" should have text "", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('');

        // And the grid cell at "0", "4" has text ""
        await since('The grid cell at "0", "4" should have text "", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('');

        // And the grid cell at "1", "0" has text "Central"
        await since('The grid cell at "1", "0" should have text "Central", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Central');

        // And the grid cell at "1", "1" has text "Ellerkamp"
        await since('The grid cell at "1", "1" should have text "Ellerkamp", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Ellerkamp');

        // And the grid cell at "1", "2" has text "Nancy"
        await since('The grid cell at "1", "2" should have text "Nancy", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Nancy');

        // And the grid cell at "1", "3" has text "Revenue"
        await since('The grid cell at "1", "3" should have text "Revenue", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('Revenue');

        // And the grid cell at "1", "4" has text "$847,227"
        await since('The grid cell at "1", "4" should have text "$847,227", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('$847,227');

        // And the grid cell at "2", "3" has text "Cost"
        await since('The grid cell at "2", "3" should have text "Cost", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('Cost');

        // And the grid cell at "2", "4" has text "$720,449"
        await since('The grid cell at "2", "4" should have text "$720,449", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toBe('$720,449');

        // And the grid cell at "3", "3" has text "Derived Revenue (K)"
        await since('The grid cell at "3", "3" should have text "Derived Revenue (K)", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 3))
            .toBe('Derived Revenue (K)');

        // And the grid cell at "3", "4" has text "$847"
        await since('The grid cell at "3", "4" should have text "$847", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 4))
            .toBe('$847');
    });
    it('[TC84709_3] FUN | Report Editor | Report Execution', async () => {
        await resetReportState({
            credentials: reportConstants.reportUser,
            report: reportConstants.AttributeOnly3,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.AttributeOnly3.id,
            projectId: reportConstants.AttributeOnly3.project.id,
        });

        // Then the grid cell at "0", "0" has text "Category"
        await since('The grid cell at "0", "0" should have text "Category", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Category');

        // And the grid cell at "0", "1" has text "Region"
        await since('The grid cell at "0", "1" should have text "Region", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');

        // And the grid cell at "0", "2" has text "Year"
        await since('The grid cell at "0", "2" should have text "Year", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Year');

        // And the grid cell at "0", "3" has text "2015 & 2016"
        await since('The grid cell at "0", "3" should have text "2015 & 2016", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('2015 & 2016');

        // And the grid cell at "0", "4" has text "Custom Categories"
        await since('The grid cell at "0", "4" should have text "Custom Categories", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Custom Categories');

        // And the grid cell at "0", "5" has text ""
        await since('The grid cell at "0", "5" should have text "", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 5))
            .toBe('');

        // And the grid cell at "1", "0" has text "Books"
        await since('The grid cell at "1", "0" should have text "Books", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Books');

        // And the grid cell at "1", "1" has text "Northeast"
        await since('The grid cell at "1", "1" should have text "Northeast", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Northeast');

        // And the grid cell at "1", "2" has text "2015 DE"
        await since('The grid cell at "1", "2" should have text "2015 DE", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('2015 DE');

        // And the grid cell at "1", "3" has text "2016 - 2015"
        await since('The grid cell at "1", "3" should have text "2016 - 2015", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('2016 - 2015');

        // And the grid cell at "1", "4" has text "Category Sales"
        await since('The grid cell at "1", "4" should have text "Category Sales", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('Category Sales');

        // And the grid cell at "1", "5" has text ""
        await since('The grid cell at "1", "5" should have text "", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 5))
            .toBe('');

        // And the grid cell at "2", "5" has text "Books"
        await since('The grid cell at "2", "5" should have text "Books", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 5))
            .toBe('Books');
    });
    it('[TC84709_4] FUN | Report Editor | Report Execution', async () => {
        await resetReportState({
            credentials: reportConstants.reportUser,
            report: reportConstants.AttributeOnlyInColumn4,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.AttributeOnlyInColumn4.id,
            projectId: reportConstants.AttributeOnlyInColumn4.project.id,
        });

        await takeScreenshotByElement(reportGridView.grid, 'TC84709_1', 'grid');

        await resetReportState({
            credentials: reportConstants.reportUser,
            report: reportConstants.MetricOnly5,
        });

        await libraryPage.openReportByUrl({
            documentId: reportConstants.MetricOnly5.id,
            projectId: reportConstants.MetricOnly5.project.id,
        });
        // await reportToolbar.switchToDesignMode();

        // Then the grid cell at "0", "0" has text "DM = Derived Revenue *100"
        await since('The grid cell at "0", "0" should have text "DM = Derived Revenue *100", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('DM = Derived Revenue *100');

        // And the grid cell at "0", "1" has text "Cost"
        await since('The grid cell at "0", "1" should have text "Cost", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Cost');

        // And the grid cell at "0", "2" has text "Derived Revenue (K)"
        await since('The grid cell at "0", "2" should have text "Derived Revenue (K)", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Derived Revenue (K)');

        // And the grid cell at "1", "0" has text "3,502,371"
        await since('The grid cell at "1", "0" should have text "3,502,371", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('3,502,371');

        // And the grid cell at "1", "1" has text "$29,730,085"
        await since('The grid cell at "1", "1" should have text "$29,730,085", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('$29,730,085');

        // And the grid cell at "1", "2" has text "$35,024"
        await since('The grid cell at "1", "2" should have text "$35,024", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('$35,024');
    });
    it('[TC84709_5] FUN | Report Editor | Report Execution', async () => {
        await resetReportState({
            credentials: reportConstants.reportUser,
            report: reportConstants.MetricOnlyInRow6,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.MetricOnlyInRow6.id,
            projectId: reportConstants.MetricOnlyInRow6.project.id,
        });

        // Then the grid cell at "1", "0" has text "DM = Derived Revenue *100"
        await since('The grid cell at "1", "0" should have text "DM = Derived Revenue *100", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('DM = Derived Revenue *100');

        // And the grid cell at "1", "1" has text "3,502,371"
        await since('The grid cell at "1", "1" should have text "3,502,371", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('3,502,371');

        // And the grid cell at "2", "0" has text "Cost"
        await since('The grid cell at "2", "0" should have text "Cost", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('Cost');

        // And the grid cell at "2", "1" has text "$29,730,085"
        await since('The grid cell at "2", "1" should have text "$29,730,085", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('$29,730,085');

        // And the grid cell at "3", "0" has text "Derived Revenue (K)"
        await since('The grid cell at "3", "0" should have text "Derived Revenue (K)", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 0))
            .toBe('Derived Revenue (K)');

        // And the grid cell at "3", "1" has text "$35,024"
        await since('The grid cell at "3", "1" should have text "$35,024", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 1))
            .toBe('$35,024');
    });
    it('[TC84709_6] FUN | Report Editor | Report Execution', async () => {
        await resetReportState({
            credentials: reportConstants.reportUser,
            report: reportConstants.AttributePageBy7,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.AttributePageBy7.id,
            projectId: reportConstants.AttributePageBy7.project.id,
        });

        // Then The current selection for page by selector "2015 & 2016" should be "2016 - 2015"
        await since(
            'The current selection for page by selector "2015 & 2016" should be "2016 - 2015", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('2015 & 2016'))
            .toBe('2016 - 2015');

        // And The current selection for page by selector "Category" should be "Books"
        await since(
            'The current selection for page by selector "Category" should be "Books", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Category'))
            .toBe('Books');

        // And the grid cell at "0", "0" has text "Custom Categories"
        await since('The grid cell at "0", "0" should have text "Custom Categories", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Custom Categories');

        // And the grid cell at "0", "2" has text "Cost"
        await since('The grid cell at "0", "2" should have text "Cost", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Cost');

        // And the grid cell at "1", "0" has text "Category Sales"
        await since('The grid cell at "1", "0" should have text "Category Sales", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Category Sales');

        // And the grid cell at "1", "1" has text ""
        await since('The grid cell at "1", "1" should have text "", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('');

        // And the grid cell at "1", "2" has text "$198,218"
        await since('The grid cell at "1", "2" should have text "$198,218", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('$198,218');
    });
    it('[TC84709_7] FUN | Report Editor | Report Execution', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ObjectPrompts8.id,
            projectId: reportConstants.ObjectPrompts8.project.id,
        });

        await reportToolbar.switchToDesignMode(true);
        // When I double click available object "Custom Categories" in "Choose Custom Group" section with index "1." in prompt editor in Report Editor
        await reportPromptEditor.chooseItemInAvailableCart(1, 'Choose Custom Group', 'Custom Categories');

        // And I double click available object "Year" in "Choose from a list of attributes." section with index "2." in prompt editor in Report Editor
        await reportPromptEditor.chooseItemInAvailableCart(2, 'Choose from a list of attributes.', 'Year');

        // And I double click available object "Revenue" in "Choose from a list of metrics." section with index "3." in prompt editor in Report Editor
        await reportPromptEditor.chooseItemInAvailableCart(3, 'Choose from a list of metrics.', 'Revenue');

        // And I double click available object "Cost" in "Choose from a list of metrics." section with index "3." in prompt editor in Report Editor
        await reportPromptEditor.chooseItemInAvailableCart(3, 'Choose from a list of metrics.', 'Cost');

        // And I click Apply button in Report Prompt Editor
        await reportPromptEditor.clickApplyButtonInReportPromptEditor();

        // Then The current selection for page by selector "Custom Categories" should be "Category Sales"
        await since(
            'The current selection for page by selector "Custom Categories" should be "Category Sales", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Custom Categories'))
            .toBe('Category Sales');

        // And the grid cell at "0", "0" has text "Year"
        await since('The grid cell at "0", "0" should have text "Year", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "0", "1" has text "Revenue"
        await since('The grid cell at "0", "1" should have text "Revenue", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Revenue');
        // And the grid cell at "0", "2" has text "Cost"
        await since('The grid cell at "0", "2" should have text "Cost", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Cost');

        // And the grid cell at "1", "0" has text "2014"
        await since('The grid cell at "1", "0" should have text "2014", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2014');

        // And the grid cell at "1", "1" has text "$8,647,238"
        await since('The grid cell at "1", "1" should have text "$8,647,238", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('$8,647,238');

        // And the grid cell at "1", "2" has text "$7,343,097"
        await since('The grid cell at "1", "2" should have text "$7,343,097", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('$7,343,097');
    });
    it('[TC84709_8] FUN | Report Editor | Report Execution', async () => {
        await resetReportState({
            credentials: reportConstants.reportUser,
            report: reportConstants.Threshold12b,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.Threshold12b.id,
            projectId: reportConstants.Threshold12b.project.id,
        });
        // Then the grid cell at "0", "0" has text "Category"
        await since('The grid cell at "0", "0" should have text "Category", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Category');

        // And the grid cell at "0", "1" has text "Revenue"
        await since('The grid cell at "0", "1" should have text "Revenue", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Revenue');

        // And the grid cell at "0", "2" has text "Last Year's Revenue"
        await since('The grid cell at "0", "2" should have text "Last Year\'s Revenue", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe("Last Year's Revenue");

        // And the grid cell at "0", "3" has text "% Diff from TM LY - Revenue"
        await since(
            'The grid cell at "0", "3" should have text "% Diff from TM LY - Revenue", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('% Diff from TM LY - Revenue');

        // And the grid cell at "0", "4" has text "Trend"
        await since('The grid cell at "0", "4" should have text "Trend", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Trend');

        // And the grid cell at "1", "0" has text "Books"
        await since('The grid cell at "1", "0" should have text "Books", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Books');

        // And the grid cell at "1", "1" has text "$343,320"
        await since('The grid cell at "1", "1" should have text "$343,320", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('$343,320');

        // And the grid cell at "1", "3" has text "40.7%"
        await since('The grid cell at "1", "3" should have text "40.7%", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('40.7%');

        // And the grid cell at "1", "4" has text "●"
        await since('The grid cell at "1", "4" should have text "●", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('●');

        // And the grid cell at "1", "1" has style "background-color" with value "rgba(0,128,0,1)"
        await since(
            'The grid cell at "1", "1" should have style "background-color" with value "rgba(0,128,0,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'background-color'))
            .toBe('rgba(0,128,0,1)');

        // And the grid cell at "1", "1" has style "color" with value "rgba(255,255,255,1)"
        await since(
            'The grid cell at "1", "1" should have style "color" with value "rgba(255,255,255,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'color'))
            .toBe('rgba(255,255,255,1)');

        // And the grid cell at "1", "1" has style "font-style" with value "italic"
        await since(
            'The grid cell at "1", "1" should have style "font-style" with value "italic", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'font-style'))
            .toBe('italic');

        // And the grid cell at "1", "4" has style "color" with value "rgba(0,128,0,1)"
        await since(
            'The grid cell at "1", "4" should have style "color" with value "rgba(0,128,0,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(1, 4, 'color'))
            .toBe('rgba(0,128,0,1)');

        // And the grid cell at "2", "2" has style "color" with value "rgba(255,0,0,1)"
        await since(
            'The grid cell at "2", "2" should have style "color" with value "rgba(255,0,0,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 2, 'color'))
            .toBe('rgba(255,0,0,1)');

        // And the grid cell at "2", "2" has style "text-decoration-line" with value "underline"
        await since(
            'The grid cell at "2", "2" should have style "text-decoration-line" with value "underline", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(2, 2, 'text-decoration-line'))
            .toBe('underline');

        // And the grid cell at "5", "2" has style "background-color" with value "rgba(255,234,114,1)"
        await since(
            'The grid cell at "5", "2" should have style "background-color" with value "rgba(255,234,114,1)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByPos(5, 2, 'background-color'))
            .toBe('rgba(255,234,114,1)');
    });
    it('[TC84709_9] FUN | Report Editor | Report Execution', async () => {
        await resetReportState({
            credentials: reportConstants.reportUser,
            report: reportConstants.Hierarchy2,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.Hierarchy2.id,
            projectId: reportConstants.Hierarchy2.project.id,
        });

        // Then the grid cell at "0", "0" has text "Category"
        await since('The grid cell at "0", "0" should have text "Category", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Category');

        // And the grid cell at "0", "1" has text "Item"
        await since('The grid cell at "0", "1" should have text "Item", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Item');

        // And the grid cell at "0", "2" has text "Profit"
        await since('The grid cell at "0", "2" should have text "Profit", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Profit');

        // And the grid cell at "1", "0" has text "Books"
        await since('The grid cell at "1", "0" should have text "Books", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Books');

        // And the grid cell at "1", "1" has text "50 Favorite Rooms"
        await since('The grid cell at "1", "1" should have text "50 Favorite Rooms", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('50 Favorite Rooms');

        // And the grid cell at "1", "2" has text "$6,249"
        await since('The grid cell at "1", "2" should have text "$6,249", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('$6,249');
    });
    it('[TC84709_10] FUN | Report Editor | Report Execution', async () => {
        await resetReportState({
            credentials: reportConstants.reportUser,
            report: reportConstants.GridGraphForAutomation,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.GridGraphForAutomation.id,
            projectId: reportConstants.GridGraphForAutomation.project.id,
        });
        // Then the grid cell at "0", "0" has text "Year"
        await since('The grid cell at "0", "0" should have text "Year", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "0", "1" has text "2015 & 2016"
        await since('The grid cell at "0", "1" should have text "2015 & 2016", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('2015 & 2016');

        // And the grid cell at "0", "2" has text "Custom Categories"
        await since('The grid cell at "0", "2" should have text "Custom Categories", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Custom Categories');

        // And the grid cell at "0", "3" has text ""
        await since('The grid cell at "0", "3" should have text "", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('');

        // And the grid cell at "0", "4" has text "Cost"
        await since('The grid cell at "0", "4" should have text "Cost", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Cost');

        // And the grid cell at "1", "0" has text "2015"
        await since('The grid cell at "1", "0" should have text "2015", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2015');

        // And the grid cell at "1", "1" has text "2016 - 2015"
        await since('The grid cell at "1", "1" should have text "2016 - 2015", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('2016 - 2015');

        // And the grid cell at "1", "2" has text "Category Sales"
        await since('The grid cell at "1", "2" should have text "Category Sales", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Category Sales');

        // And the grid cell at "1", "3" has text ""
        await since('The grid cell at "1", "3" should have text "", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('');

        // And the grid cell at "1", "4" has text "-$9,777,521"
        await since('The grid cell at "1", "4" should have text "-$9,777,521", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('-$9,777,521');

        // And the grid cell at "1", "5" has text "15.11%"
        await since('The grid cell at "1", "5" should have text "15.11%", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 5))
            .toBe('15.11%');

        // And the grid cell at "1", "6" has text "($1,740,085)"
        await since('The grid cell at "1", "6" should have text "($1,740,085)", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 6))
            .toBe('($1,740,085)');
    });
    // it('[TC84709_11] FUN | Report Editor | Report Execution', async () => {
    //     await resetReportState({
    //         credentials: reportConstants.reportUser,
    //         report: reportConstants.MetricQualificationPromptOnReportFilterPB,
    //     });
    //     await libraryPage.openReportByUrl({
    //         documentId: reportConstants.MetricQualificationPromptOnReportFilterPB.id,
    //         projectId: reportConstants.MetricQualificationPromptOnReportFilterPB.project.id,
    //     });
    //     // When I input value "4000000" for "Revenue Value" section with index "1." in prompt editor in Report Editor
    //     await reportPromptEditor.enterMetricValue('1', 'Revenue Value', '4000000');

    //     // And I click Apply button in Report Prompt Editor
    //     await reportPromptEditor.clickApplyButtonInReportPromptEditor();

    //     // Then The current selection for page by selector "Metrics" should be "Cost"
    //     await since('The current selection for page by selector "Metrics" should be Cost, instead we have #{actual}')
    //         .expect(await reportPageBy.getPageBySelectorText('Metrics'))
    //         .toBe('Cost');

    //     // And the grid cell at "0", "0" has text "Region"
    //     await since('The grid cell at "0", "0" should have text Region, instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 0))
    //         .toBe('Region');

    //     // And the grid cell at "0", "1" has text "Call Center"
    //     await since('The grid cell at "0", "1" should have text Call Center, instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 1))
    //         .toBe('Call Center');

    //     // And the grid cell at "0", "2" has text "Cost"
    //     await since('The grid cell at "0", "2" should have text Cost, instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 2))
    //         .toBe('Cost');

    //     // And the grid cell at "1", "0" has text "Central"
    //     await since('The grid cell at "1", "0" should have text Central, instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 0))
    //         .toBe('Central');

    //     // And the grid cell at "1", "1" has text "Milwaukee"
    //     await since('The grid cell at "1", "1" should have text Milwaukee, instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 1))
    //         .toBe('Milwaukee');
    //     // And the grid cell at "1", "2" has text "$3,544,594"
    //     await since('The grid cell at "1", "2" should have text "$3,544,594", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 2))
    //         .toBe('$3,544,594');
    // });
    it('[TC84709_12] FUN | Report Editor | Report Execution', async () => {
        await resetReportState({
            credentials: reportConstants.reportUser,
            report: reportConstants.PageByMetricPB2,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.PageByMetricPB2.id,
            projectId: reportConstants.PageByMetricPB2.project.id,
        });

        // Then The current selection for page by selector "Metrics" should be "Cost"
        await since('The current selection for page by selector "Metrics" should be "Cost", instead we have #{actual}')
            .expect(await reportPageBy.getPageBySelectorText('Metrics'))
            .toBe('Cost');

        // And the grid cell at "0", "0" has text "Category"
        await since('The grid cell at "0", "0" should have text "Category", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Category');

        // And the grid cell at "0", "1" has text "Subcategory"
        await since('The grid cell at "0", "1" should have text "Subcategory", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Subcategory');

        // And the grid cell at "0", "2" has text "Item"
        await since('The grid cell at "0", "2" should have text "Item", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Item');

        // And the grid cell at "0", "3" has text "Cost"
        await since('The grid cell at "0", "3" should have text "Cost", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');

        // And the grid cell at "1", "0" has text "Books"
        await since('The grid cell at "1", "0" should have text "Books", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Books');

        // And the grid cell at "1", "1" has text "Art & Architecture"
        await since('The grid cell at "1", "1" should have text "Art & Architecture", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Art & Architecture');

        // And the grid cell at "1", "2" has text "100 Places to Go While Still Young at Heart"
        await since(
            'The grid cell at "1", "2" should have text "100 Places to Go While Still Young at Heart", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('100 Places to Go While Still Young at Heart');

        // And the grid cell at "1", "3" has text "$50,216"
        await since('The grid cell at "1", "3" should have text "$50,216", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$50,216');
    });
    it('[TC84709_13] FUN | Report Editor | Report Execution', async () => {
        // When I open report by its ID "BA2331B55F4FB4F1340A949171B3D0E4"
        await resetReportState({
            credentials: reportConstants.reportUser,
            report: reportConstants.SqlViewForAutomation,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SqlViewForAutomation.id,
            projectId: reportConstants.SqlViewForAutomation.project.id,
        });

        // Then the grid cell at "0", "0" has text "Year"
        await since('The grid cell at "0", "0" should have text "Year", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "0", "1" has text "2015 & 2016"
        await since('The grid cell at "0", "1" should have text "2015 & 2016", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('2015 & 2016');

        // And the grid cell at "0", "2" has text "Custom Categories"
        await since('The grid cell at "0", "2" should have text "Custom Categories", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Custom Categories');

        // And the grid cell at "0", "4" has text "Cost"
        await since('The grid cell at "0", "4" should have text "Cost", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Cost');

        // And the grid cell at "1", "0" has text "2015"
        await since('The grid cell at "1", "0" should have text "2015", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2015');

        // And the grid cell at "1", "1" has text "2016 - 2015"
        await since('The grid cell at "1", "1" should have text "2016 - 2015", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('2016 - 2015');

        // And the grid cell at "1", "2" has text "Category Sales"
        await since('The grid cell at "1", "2" should have text "Category Sales", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Category Sales');

        // And the grid cell at "1", "3" has text ""
        await since('The grid cell at "1", "3" should have text "", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('');

        // And the grid cell at "1", "4" has text "-$9,777,521"
        await since('The grid cell at "1", "4" should have text "-$9,777,521", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('-$9,777,521');

        // And the grid cell at "1", "5" has text "15.11%"
        await since('The grid cell at "1", "5" should have text "15.11%", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 5))
            .toBe('15.11%');

        // And the grid cell at "1", "6" has text "($1,740,085)"
        await since('The grid cell at "1", "6" should have text "($1,740,085)", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 6))
            .toBe('($1,740,085)');
    });
});
