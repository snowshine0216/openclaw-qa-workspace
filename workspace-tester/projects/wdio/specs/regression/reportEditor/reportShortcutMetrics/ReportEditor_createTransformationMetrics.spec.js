import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';

describe('Report Editor Shortcut Metrics in Workstation', () => {
    let { loginPage, libraryPage, reportToolbar, reportEditorPanel, reportGridView } = browsers.pageObj1;

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

    it('[TC85613_5] Step 5: Creating Transformation Metrics', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ReportGridContextMenu.id,
            projectId: reportConstants.ReportGridContextMenu.project.id,
        });
        // When I switch to design mode in Report Editor
        await reportToolbar.switchToDesignMode();
        await reportEditorPanel.createTransformationForMetricInMetricsDropZone("Last Year's", 'Normal', 'Cost');
        await takeScreenshotByElement(
            await reportEditorPanel.metricsDropzone,
            'TC85613_5',
            'ReportEditor_createTransformationMetrics_1',
            { tolerance: 0.14 }
        );

        // And the grid cell at "0", "0" has text "Year"
        await since(
            'After create "Normal" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "1", "0" has text "2015"
        await since(
            'After create "Normal" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "0" should have text "2015", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2015');

        // And the grid cell at "1", "1" has text "Central"
        await since(
            'After create "Normal" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "1" should have text "Central", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Central');

        // And the grid cell at "1", "2" has text "Books"
        await since(
            'After create "Normal" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "2" should have text "Books", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Books');

        // And the grid cell at "0", "3" has text "Cost"
        await since(
            'After create "Normal" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "0", "3" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');
        // And the grid cell at "1", "3" has text "$97,277"
        await since(
            'After create "Normal" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "3" should have text "$97,277", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$97,277');

        // // And the grid cell at "0", "4" has text "Last Year's (Cost)"
        // await since(
        //     'After create "Normal" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "0", "4" should have text "Last Year\'s (Cost)", instead we have #{actual}'
        // )
        //     .expect(await reportGridView.getGridCellTextByPos(0, 4))
        //     .toBe("Last Year's (Cost)");

        // And the grid cell at "1", "4" has text "$77,012"
        await since(
            'After create "Normal" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "4" should have text "$77,012", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('$77,012');

        // When I create "Variance" transformation of "Last Year's" for metric "Cost" in "Metrics" dropzone in Report Editor
        // await reportEditorPanel.expandSubmenuForTransformationForMetricInMetricsDropZone('Cost');
        // await reportEditorPanel.mouseOverSubMenuItem('Variance');
        // await reportEditorPanel.clickSubMenuItem("Last Year's");
        await reportEditorPanel.createTransformationForMetricInMetricsDropZone("Last Year's", 'Variance', 'Cost');

        // Then the grid cell at "0", "0" has text "Year"
        await since(
            'After create "Variance" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "1", "0" has text "2015"
        await since(
            'After create "Variance" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "0" should have text "2015", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2015');

        // And the grid cell at "1", "1" has text "Central"
        await since(
            'After create "Variance" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "1" should have text "Central", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Central');

        // And the grid cell at "1", "2" has text "Books"
        await since(
            'After create "Variance" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "2" should have text "Books", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Books');

        // And the grid cell at "0", "3" has text "Cost"
        await since(
            'After create "Variance" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "0", "3" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');

        // And the grid cell at "1", "3" has text "$97,277"
        await since(
            'After create "Variance" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "3" should have text "$97,277", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$97,277');

        // // And the grid cell at "0", "4" has text "(Cost) - (Last Year's (Cost))"
        // await since(
        //     'After create "Variance" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "0", "4" should have text "(Cost) - (Last Year\'s (Cost))", instead we have #{actual}'
        // )
        //     .expect(await reportGridView.getGridCellTextByPos(0, 4))
        //     .toBe("(Cost) - (Last Year's (Cost))");

        // And the grid cell at "1", "4" has text "$20,266"
        await since(
            'After create "Variance" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "4" should have text "$20,266", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('$20,266');

        // // And the grid cell at "0", "5" has text "Last Year's (Cost)"
        // await since(
        //     'After create "Variance" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "0", "5" should have text "Last Year\'s (Cost)", instead we have #{actual}'
        // )
        //     .expect(await reportGridView.getGridCellTextByPos(0, 5))
        //     .toBe("Last Year's (Cost)");

        // And the grid cell at "1", "5" has text "$77,012"
        await since(
            'After create "Variance" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "5" should have text "$77,012", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 5))
            .toBe('$77,012');

        // When I create "Variance Percentage" transformation of "Last Year's" for metric "Cost" in "Metrics" dropzone in Report Editor
        // await reportEditorPanel.expandSubmenuForTransformationForMetricInMetricsDropZone('Cost');
        // await reportEditorPanel.mouseOverSubMenuItem('Variance Percentage');
        // await reportEditorPanel.clickSubMenuItem("Last Year's");
        await reportEditorPanel.createTransformationForMetricInMetricsDropZone(
            "Last Year's",
            'Variance Percentage',
            'Cost'
        );

        // Then the grid cell at "0", "0" has text "Year"
        await since(
            'After create "Variance Percentage" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "1", "0" has text "2015"
        await since(
            'After create "Variance Percentage" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "0" should have text "2015", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2015');

        // And the grid cell at "1", "1" has text "Central"
        await since(
            'After create "Variance Percentage" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "1" should have text "Central", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Central');

        // And the grid cell at "1", "2" has text "Books"
        await since(
            'After create "Variance Percentage" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "2" should have text "Books", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Books');

        // And the grid cell at "0", "3" has text "Cost"
        await since(
            'After create "Variance Percentage" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "0", "3" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');

        // And the grid cell at "1", "3" has text "$97,277"
        await since(
            'After create "Variance Percentage" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "3" should have text "$97,277", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$97,277');

        // And the grid cell at "0", "4" has text "((Cost) - (Last Year's (Cost))) / (Last Year's (Cost))"
        await since(
            'After create "Variance Percentage" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "0", "4" should have text "((Cost) - (Last Year\'s (Cost))) / (Last Year\'s (Cost))", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe("((Cost) - (Last Year's (Cost))) / (Last Year's (Cost))");

        // And the grid cell at "1", "4" has text "26.32%"
        await since(
            'After create "Variance Percentage" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "4" should have text "26.32%", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('26.32%');

        // And the grid cell at "0", "5" has text "(Cost) - (Last Year's (Cost))"
        await since(
            'After create "Variance Percentage" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "0", "5" should have text "(Cost) - (Last Year\'s (Cost))", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 5))
            .toBe("(Cost) - (Last Year's (Cost))");

        // And the grid cell at "1", "5" has text "$20,266"
        await since(
            'After create "Variance Percentage" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "5" should have text "$20,266", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 5))
            .toBe('$20,266');

        // // And the grid cell at "0", "6" has text "Last Year's (Cost)"
        // await since(
        //     'After create "Variance Percentage" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "0", "6" should have text "Last Year\'s (Cost)", instead we have #{actual}'
        // )
        //     .expect(await reportGridView.getGridCellTextByPos(0, 6))
        //     .toBe("Last Year\'s (Cost)");

        // And the grid cell at "1", "6" has text "$77,012"
        await since(
            'After create "Variance Percentage" transformation of "Last Year\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "6" should have text "$77,012", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 6))
            .toBe('$77,012');

        // When I create "Variance" transformation of "Last Quarter's" for metric "Cost" in "Metrics" dropzone in Report Editor
        // await reportEditorPanel.expandSubmenuForTransformationForMetricInMetricsDropZone('Cost');
        // await reportEditorPanel.mouseOverSubMenuItem('Variance');
        // await reportEditorPanel.clickSubMenuItem("Last Quarter's");
        await reportEditorPanel.createTransformationForMetricInMetricsDropZone("Last Quarter's", 'Variance', 'Cost');
        await takeScreenshotByElement(
            reportEditorPanel.metricsDropzone,
            'TC85613_5',
            'Create variance transformation for Last Quarter',
            { tolerance: 0.14 }
        );

        // And the grid cell at "0", "0" has text "Year"
        await since(
            'After create "Variance" transformation of "Last Quarter\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "1", "0" has text "2015"
        await since(
            'After create "Variance" transformation of "Last Quarter\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "0" should have text "2015", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2015');

        // And the grid cell at "1", "1" has text "Central"
        await since(
            'After create "Variance" transformation of "Last Quarter\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "1" should have text "Central", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Central');

        // And the grid cell at "1", "2" has text "Books"
        await since(
            'After create "Variance" transformation of "Last Quarter\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "2" should have text "Books", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Books');

        // And the grid cell at "0", "3" has text "Cost"
        await since(
            'After create "Variance" transformation of "Last Quarter\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "0", "3" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');

        // And the grid cell at "1", "3" has text "$97,277"
        await since(
            'After create "Variance" transformation of "Last Quarter\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "3" should have text "$97,277", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$97,277');
        // And the grid cell at "0", "4" has text "Last Quarter\'s (Cost)"
        await since(
            'After create "Variance" transformation of "Last Quarter\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "0", "4" should have text "Last Quarter\'s (Cost)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe("(Cost) - (Last Quarter's (Cost))");

        // And the grid cell at "1", "4" has text "$95,634"
        await since(
            'After create "Variance" transformation of "Last Quarter\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "4" should have text "$1,643", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('$1,643');

        // And the grid cell at "0", "5" has text "((Cost) - (Last Year\'s (Cost))) / (Last Year\'s (Cost))"
        await since(
            'After create "Variance" transformation of "Last Quarter\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "0", "5" should have text "((Cost) - (Last Year\'s (Cost))) / (Last Year\'s (Cost))", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 5))
            .toBe("((Cost) - (Last Year's (Cost))) / (Last Year's (Cost))");

        // And the grid cell at "1", "5" has text "26.32%"
        await since(
            'After create "Variance" transformation of "Last Quarter\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "5" should have text "26.32%", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 5))
            .toBe('26.32%');

        // // And the grid cell at "0", "6" has text "(Cost) - (Last Year's (Cost))"
        // await since(
        //     'After create "Variance" transformation of "Last Quarter\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "0", "6" should have text "(Cost) - (Last Year\'s (Cost))", instead we have #{actual}'
        // )
        //     .expect(await reportGridView.getGridCellTextByPos(0, 6))
        //     .toBe("(Cost) - (Last Year's (Cost))");

        // And the grid cell at "1", "6" has text "$20,266"
        await since(
            'After create "Variance" transformation of "Last Quarter\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "6" should have text "$20,266", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 6))
            .toBe('$20,266');

        // // And the grid cell at "0", "7" has text "Last Year's (Cost)"
        // await since(
        //     'After create "Variance" transformation of "Last Quarter\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "0", "7" should have text "Last Year\'s (Cost)", instead we have #{actual}'
        // )
        //     .expect(await reportGridView.getGridCellTextByPos(0, 7))
        //     .toBe("Last Year's (Cost)");

        // // And the grid cell at "1", "7" has text "$77,012"
        // await since(
        //     'After create "Variance" transformation of "Last Quarter\'s" for metric "Cost" in "Metrics" dropzone in Report Editor, The grid cell at "1", "7" should have text "$77,012", instead we have #{actual}'
        // )
        //     .expect(await reportGridView.getGridCellTextByPos(1, 7))
        //     .toBe('$77,012');
    });
});
