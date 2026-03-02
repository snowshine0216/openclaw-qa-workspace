import * as reportConstants from '../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';

describe('Report Editor Grid View', () => {
    let { libraryPage, reportEditorPanel, reportGridView, reportDatasetPanel, reportToolbar, loginPage, reportGrid } =
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

    it('[TC86139_01] FUN | Report Editor | Grid View', async () => {
        //  https://mci-pq2sm-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/05B202B9999F4C1AB960DA6208CADF3D/K53--K46/edit?isNew=true&continue
        await libraryPage.createNewReportByUrl({});
        // await libraryAuthoringPage.createReportFromLibrary('New MicroStrategy Tutorials');

        // Add objects to grid
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Time']);
        await reportDatasetPanel.addObjectToColumns('Year');
        await reportDatasetPanel.clickFolderUpIcon();
        await reportDatasetPanel.selectItemInObjectList('Geography');
        await reportDatasetPanel.addObjectToRows('Region');
        await reportDatasetPanel.clickFolderUpIcon();
        await reportDatasetPanel.selectItemInObjectList('Products');
        await reportDatasetPanel.addObjectToRows('Category');
        await reportDatasetPanel.clickFolderUpMultipleTimes(3);
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);
        await reportDatasetPanel.addMultipleObjectsToColumns(['Cost', 'Profit']);

        // Unpause and validate
        await reportToolbar.switchToDesignMode();
        await since('The grid cell at "0", "0" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Region');
        await since('The grid cell at "0", "1" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Year');
        await since('The grid cell at "0", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('2014');
        await since('The grid cell at "0", "4" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('2015');
        await since('The grid cell at "0", "6" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 6))
            .toBe('2016');
        await since('The grid cell at "1", "1" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Category');
        await since('The grid cell at "1", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Cost');
        await since('The grid cell at "1", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('Profit');
        await since('The grid cell at "2", "0" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('Central');
        await since('The grid cell at "2", "1" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('Books');
        await since('The grid cell at "2", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('$77,012');
        await since('The grid cell at "2", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$21,190');
        await since('The grid cell at "0", "0" should have style #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'top'))
            .toBe('-26px');
        await since('The grid cell at "0", "0" should have style #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellStyleByPos(0, 0, 'height'))
            .toBe('52px');
        await since('The grid cell at "0", "1" should have style #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellStyleByPos(0, 1, 'height'))
            .toContain('26px');
        await since('The grid cell at "1", "1" should have style #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'height'))
            .toContain('26px');
    });

    it('[TC86139_02] FUN | Report Editor | Grid View', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.DE252153.id,
            projectId: reportConstants.DE252153.project.id,
        });

        await reportToolbar.switchToDesignMode();
        await since('The grid cell at "0", "0" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('');

        await reportGridView.openGridContextMenuByPos(0, 0);
        await reportGridView.clickContextMenuOption('Show "Metrics" Label');
        // await since('The grid cell at "0", "0" should be #{expected}, instead we have #{actual}')
        //     .expect(await reportGridView.getGridCellTextByPos(0, 0))
        //     .toBe('Metrics');
        await since('The grid cell at "0", "1" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');
        await since('The grid cell at "0", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Category');
        await since('The grid cell at "0", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('2014');
        await since('The grid cell at "0", "4" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('2015');
        await since('The grid cell at "0", "5" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 5))
            .toBe('2016');
        await since('Zone "Rows" should  should be #{expected}, instead we have #{actual}')
            .expect(JSON.stringify(await reportEditorPanel.getRowsObjects()))
            .toBe(JSON.stringify(['Metric Names', 'Region', 'Category']));
        await since('Zone "Columns" should be  #{expected}, instead we have #{actual}')
            .expect(JSON.stringify(await reportEditorPanel.getColumnsObjects()))
            .toBe(JSON.stringify(['Year']));

        await reportGrid.dragHeaderCellToRow('Metrics', 'left', 'Category');
        await since('The grid cell at "0", "0" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Region');
        await since('The grid cell at "0", "1" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Metrics');
        await since('The grid cell at "0", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Category');
        await since('The grid cell at "0", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('2014');
        await since('The grid cell at "0", "4" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('2015');
        await since('The grid cell at "0", "5" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 5))
            .toBe('2016');
        await since('Zone "Rows" should be #{expected}, instead we have #{actual}')
            .expect(JSON.stringify(await reportEditorPanel.getRowsObjects()))
            .toBe(JSON.stringify(['Region', 'Metric Names', 'Category']));
        await since(
            'After dragging "Metrics" to the left of Category, Zone "Columns" should be #{expected}, instead we have #{actual}'
        )
            .expect(JSON.stringify(await reportEditorPanel.getColumnsObjects()))
            .toBe(JSON.stringify(['Year']));

        await reportGrid.dragHeaderCellToRow('Metrics', 'left', '2014');
        await since(
            'After dragging "Metrics" to the left of 2014, Zone "Columns" should be #{expected}, instead we have #{actual}'
        )
            .expect(JSON.stringify(await reportEditorPanel.getColumnsObjects()))
            .toBe(JSON.stringify(['Year', 'Metric Names']));
    });
});
