import * as reportConstants from '../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';

describe('Report Editor in Workstation', () => {
    let { loginPage, libraryPage, reportToolbar, reportDatasetPanel, reportEditorPanel, reportGridView } =
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

    it('[TC83059] Test basic workflow in report editor in workstation', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TC83059_METRICS_IN_ROWS.id,
            projectId: reportConstants.TC83059_METRICS_IN_ROWS.project.id,
        });
        await reportToolbar.switchToDesignMode();
        // await reportDatasetPanel.switchToInReportTab();
        await reportDatasetPanel.addMultipleObjectsToColumns(['Cost', 'Profit', 'Profit Margin']);
        //  I drag the object named "Metric Names" of type "metric_entity" from zone "Columns" to zone "Rows" below object named "Manager" of type "attribute" from the Editor Panel in the Report Editor
        await reportEditorPanel.dndMetricsFromColumnsToRowsRelatesToAttribute('Manager');
        // await takeScreenshotByElement(reportEditorPanel.rowsDropzone, 'TC83059_1', 'metric_entity_Metric_Names');
        await since('after dnd Metric Names to rows, "Rows" dropzone should have #{expected} instead we have #{actual}')
            .expect(JSON.stringify(await reportEditorPanel.getRowsObjects()))
            .toBe(JSON.stringify(['Manager', 'Metric Names']));
        await since('Grid cell at  "2", "2" is expected to have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('Profit');
        await since('Grid cell at "2", "3" is expected to have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$62,469');
        await since('Grid cell at "3", "3" is expected to have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 3))
            .toBe('15.35%');
        await since('Grid cell at "1", "4" is expected to have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('$431,899');
        await since('Grid cell at "2", "4" is expected to have text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toBe('$76,011');
        await reportEditorPanel.dndMetricsFromRowsToColumnsRelatesToAttribute('Year');
        await since(
            'after dnd Metric Names to columns, "Columns" dropzone should have #{expected} instead we have #{actual}'
        )
            .expect(JSON.stringify(await reportEditorPanel.getColumnsObjects()))
            .toBe(JSON.stringify(['Year', 'Metric Names']));
    });
});
