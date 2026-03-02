import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Report UI - Authoring DnD', () => {
    let {
        loginPage,
        libraryPage,
        reportPage,
        reportGridView,
        reportToolbar,
        reportPromptEditor,
        reportEditorPanel,
        reportFilterPanel,
        reportTOC,
        reportDatasetPanel,
    } = browsers.pageObj1;
    const testUser = reportConstants.reportUICheckUser;
    const attrRegion = 'SF-Region';
    const metricMinRevenue = 'MIN_Revenue';
    const objectPrompt = 'Region or Category';
    const metricCost = 'Cost';

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

    it('[TC99679_01] Show both report objects and folder browser in authoring', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportDatasetPanel.ObjectsPanel,
            'TC99679_01_01',
            'object panel view in pause mode'
        );
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportGridView.waitForGridCellToBeExpectedValue(7, 4, '$1,254,030');
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'TC99679_01_02',
            'report authoring view in design mode'
        );
    });

    it('[TC99679_02] Adding attribute to report objects by D&D from object browser', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportDatasetPanel.searchObjectInObjectBrowser(attrRegion);
        await reportDatasetPanel.dndFromObjectBrowserToReportObjectsPanel(attrRegion);
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'TC99679_02_01',
            'D&D to add attribute to report objects panel'
        );
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$330,208');
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'TC99679_02_02',
            'report authoring view in design mode'
        );
    });

    it('[TC99679_03] Adding metric to report objects by D&D from object browser', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportDatasetPanel.searchObjectInObjectBrowser(metricMinRevenue);
        await reportDatasetPanel.dndFromObjectBrowserToReportObjectsPanel(metricMinRevenue);
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'TC99679_03_01',
            'D&D to add metric to report objects panel'
        );
    });

    it('[TC99679_04] Adding object prompt to report objects by D&D from object browser', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportDatasetPanel.searchObjectInObjectBrowser(objectPrompt);
        await reportDatasetPanel.dndFromObjectBrowserToReportObjectsPanel(objectPrompt);
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'TC99679_04_01',
            'D&D to add object prompt to report objects panel'
        );
        await reportToolbar.switchToDesignMode(true);
        await takeScreenshotByElement(
            reportPromptEditor.promptEditor,
            'TC99679_04_02',
            'prompt editor after run report with object prompt'
        );
        await reportPromptEditor.clickApplyButtonInReportPromptEditor();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'TC99679_04_03',
            'report authoring view in design mode'
        );
    });

    it('[TC99679_05] D&D object from object browser while already in report', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportRegionOnly.id,
            projectId: reportConstants.UIReportRegionOnly.project.id,
        });
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'TC99679_05_01', 'Default report view before D&D ');
        await reportDatasetPanel.searchObjectInObjectBrowser(attrRegion);
        await reportDatasetPanel.dndFromObjectBrowserToReportObjectsPanel(attrRegion, { isWait: false });
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'TC99679_05_02',
            'D&D to add region while already in report'
        );
    });

    it('[TC99679_06] try to D&D other object types', async () => {
        const reportObject = 'reportWithPrompt';
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportRegionOnly.id,
            projectId: reportConstants.UIReportRegionOnly.project.id,
        });
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportDatasetPanel.searchObjectInObjectBrowser(reportObject);
        await reportDatasetPanel.dndFromObjectBrowserToReportObjectsPanel(reportObject, { isWait: false });
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'TC99679_06_01', 'D&D to add other objects in report');
    });

    it('[TC99679_07] D&D to remove attribute from dropzone', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportRegionOnly.id,
            projectId: reportConstants.UIReportRegionOnly.project.id,
        });
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportEditorPanel.dndFromDropzoneToReportObjectsPanelToRemove({
            objName: attrRegion,
            srcZone: 'Rows',
        });
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'TC99679_07_01', 'D&D to attribute from dropzone');
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 2, '$35,023,708');
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'TC99679_07_02',
            'execute report after remove attribute from dropzone'
        );
    });

    it('[TC99679_08] D&D to remove metric from dropzone', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportRegionOnly.id,
            projectId: reportConstants.UIReportRegionOnly.project.id,
        });
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportEditorPanel.dndFromDropzoneToReportObjectsPanelToRemove({
            objName: metricCost,
            srcZone: 'Metrics',
        });
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'TC99679_08_01', 'D&D to remove metric from dropzone');
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 2, '$5,029,366');
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'TC99679_08_02',
            'execute report after remove metric from dropzone'
        );
    });

    it('[TC99679_09] multiple select and D&D by object browser to report objects', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportRegionOnly.id,
            projectId: reportConstants.UIReportRegionOnly.project.id,
        });
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportDatasetPanel.searchObjectInObjectBrowser('SF-Category');
        await reportDatasetPanel.dndByMultiSelectFromObjectBrowserToReportObjectsPanel(
            ['SF-Category', 'SF-Category1', 'SF-Category2'],
            { dragOption: 'byPixel' }
        );
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'TC99679_09_01', 'D&D to add multiple objects');
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 2, '$81,331');
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'TC99679_09_02',
            'execute report after add multiple objects'
        );
    });

    //BCIN-5354 [Report editor] When D&D slowly to move subset report attribute/metric to dropzone, it would do nothing
    it('[TC99679_10] D&D object to dropzone for subset report', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.AirlineSubsetReport.id,
            projectId: reportConstants.AirlineSubsetReport.project.id,
        });
        await reportDatasetPanel.dndFromObjectBrowserToGrid('Month');
        await since('1. Month should in report rows after D&D month to report, instead it does not show.')
            .expect(JSON.stringify(await reportEditorPanel.getRowsObjects()))
            .toContain('Month');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'TC99679_10_01',
            'D&D month to dropzone in subset report'
        );
    });

    it('[TC99679_11] Multiple select attributes to D&D objects to dropzone', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.AirlineSubsetReport.id,
            projectId: reportConstants.AirlineSubsetReport.project.id,
        });
        await reportEditorPanel.dndByMultiSelectFromReportObjectsToDropzone({
            objectNames: ['Month', 'Origin Airport', 'Day of Week'],
            dropzone: 'Rows',
        });
        await since('1. Month should in report rows after D&D them to report, instead it does not show.')
            .expect(JSON.stringify(await reportEditorPanel.getRowsObjects()))
            .toContain('Month');
        await since('2. Origin Airport should in report rows after D&D them to report, instead it does not show.')
            .expect(JSON.stringify(await reportEditorPanel.getRowsObjects()))
            .toContain('Origin Airport');
        await since('3. Day of Week should in report rows after D&D them to report, instead it does not show.')
            .expect(JSON.stringify(await reportEditorPanel.getRowsObjects()))
            .toContain('Day of Week');
        await since('4. Airline Name should in report rows after D&D them to report, instead it does not show.')
            .expect(JSON.stringify(await reportEditorPanel.getRowsObjects()))
            .toContain('Airline Name');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'TC99679_11_01',
            'D&D multiple objects to rows dropzone in subset report'
        );
    });

    it('[TC99679_12] Multiple select metrics to D&D objects to dropzone', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.AirlineSubsetReport.id,
            projectId: reportConstants.AirlineSubsetReport.project.id,
        });
        await reportEditorPanel.dndByMultiSelectFromReportObjectsToDropzone({
            objectNames: ['Avg Delay (min)', 'Flights Cancelled'],
            dropzone: 'Metrics',
        });
        await since('1. Avg Delay (min) should in report metrics after D&D them to report, instead it does not show.')
            .expect(JSON.stringify(await reportEditorPanel.getMetricsObjects()))
            .toContain('Avg Delay (min)');
        await since('2. Flights Cancelled should in report metrics after D&D them to report, instead it does not show.')
            .expect(JSON.stringify(await reportEditorPanel.getMetricsObjects()))
            .toContain('Flights Cancelled');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'TC99679_12_01',
            'D&D multiple objects to metrics dropzone in subset report'
        );
        await reportToolbar.switchToDesignMode();
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('29 Rows, 4 Columns');
        await reportEditorPanel.dndByMultiSelectFromDropzoneToReportObjectsPanelToRemove({
            objects: ['Avg Delay (min)', 'Flights Cancelled'],
            dropzone: 'metrics',
            type: 'metric',
        });
        await reportDatasetPanel.waitForStatusBarText('29 Rows, 2 Columns');
        await since('2. Total row count should be #{expected} after remove 2 metrics, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('29 Rows, 2 Columns');
    });

    // BCIN-5312 DnD Multiple Objects | Use ctrl to choose multiple objects in the editor, try to move to another dropzone, only 1 object is moved and other objects are removed incorrectly.
    it('[TC99679_13] Multiple select to D&D objects to move among dropzones', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TemplateProductReport.id,
            projectId: reportConstants.TemplateProductReport.project.id,
        });
        await reportEditorPanel.dndByMultiSelectToMoveBetweenDropzones({
            objects: ['Category', 'Subcategory'],
            dropzone: 'Rows',
            type: 'attribute',
            destZone: 'Columns',
        });
        const columns = await reportEditorPanel.getColumnsObjects();
        await since('1. Total objects in report columns after D&D should be #{expected}, instead it is #{actual}.')
            .expect(columns.length)
            .toBe(3);
        await reportEditorPanel.multipleSelectObjectsInDropzone({
            objects: ['Metric Names'],
            dropzone: 'Columns',
            type: 'metric',
        });
        await reportEditorPanel.dndByMultiSelectToMoveBetweenDropzones({
            objects: ['Category'],
            dropzone: 'Columns',
            type: 'attribute',
            destZone: 'Rows',
        });
        const rows = await reportEditorPanel.getRowsObjects();
        await since('2. Total objects in report rows after D&D should be #{expected}, instead it is #{actual}.')
            .expect(rows.length)
            .toBe(2);
        const columnsNew = await reportEditorPanel.getColumnsObjects();
        await since('3. Total objects in report columns after D&D should be #{expected}, instead it is #{actual}.')
            .expect(columnsNew.length)
            .toBe(1);
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'TC99679_13_01', 'Move attributes to columns');
    });

    // BCIN-5313 DnD Multiple Objects | DnD multiple objects in the dropzone to the same dropzone to try to change the order, the final order is incorrect.
    it('[TC99679_14] Multiple select to D&D objects to re-order within dropzones', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.AirlineSubsetReport.id,
            projectId: reportConstants.AirlineSubsetReport.project.id,
        });
        await reportEditorPanel.dndByMultiSelectFromReportObjectsToDropzone({
            objectNames: ['Month', 'Origin Airport', 'Day of Week'],
            dropzone: 'Rows',
        });
        await reportEditorPanel.dndByMultiSelectToReOrderWithinDropzone({
            objects: ['Month', 'Origin Airport', 'Year'],
            dropzone: 'Rows',
            type: 'attribute',
            targetName: 'Airline Name',
        });
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'TC99679_14_01', 'Re-order attributes within rows');
    });

    it('[TC99679_15] Multiple select and add to report by RMC context menu', async () => {
        const attributesToRows = ['Month', 'Origin Airport', 'Day of Week'];
        const attributesToPageBy = ['Month', 'Year'];
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.AirlineSubsetReport.id,
            projectId: reportConstants.AirlineSubsetReport.project.id,
        });
        await reportEditorPanel.multipleSelectObjects(attributesToRows);
        await reportDatasetPanel.addObjectToRows(attributesToRows[0]);
        await reportEditorPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since('1. Month should in report rows after D&D them to report, instead it does not show.')
            .expect(JSON.stringify(await reportEditorPanel.getRowsObjects()))
            .toContain(attributesToRows[0]);
        await since('2. Origin Airport should in report rows after D&D them to report, instead it does not show.')
            .expect(JSON.stringify(await reportEditorPanel.getRowsObjects()))
            .toContain(attributesToRows[1]);
        await since('3. Day of Week should in report rows after D&D them to report, instead it does not show.')
            .expect(JSON.stringify(await reportEditorPanel.getRowsObjects()))
            .toContain(attributesToRows[2]);
        await since('4. Airline Name should in report rows after D&D them to report, instead it does not show.')
            .expect(JSON.stringify(await reportEditorPanel.getRowsObjects()))
            .toContain('Airline Name');
        // clear previous selection
        await reportEditorPanel.multipleSelectObjects(attributesToRows);
        await reportEditorPanel.multipleSelectObjects(attributesToPageBy);
        await reportDatasetPanel.addObjectToPageBy(attributesToPageBy[0]);
        await since('5. Month should in report page by after D&D them to report, instead it does not show.')
            .expect(JSON.stringify(await reportEditorPanel.getPageByObjects()))
            .toContain(attributesToPageBy[0]);
        await since('6. Year should in report page by after D&D them to report, instead it does not show.')
            .expect(JSON.stringify(await reportEditorPanel.getPageByObjects()))
            .toContain(attributesToPageBy[1]);
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'TC99679_15_01', 'Multiple add by context menu');
    });

    it('[TC99679_16] Multiple select attribute and metric to dropzones', async () => {
        const objectsToAdd = ['Year', 'Revenue'];
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TemplateProductReport.id,
            projectId: reportConstants.TemplateProductReport.project.id,
        });
        await reportEditorPanel.multipleSelectObjects(objectsToAdd);
        await reportDatasetPanel.addObjectToRows(objectsToAdd[0]);
        await since('1. Year should in report rows after D&D them to report, instead it does not show.')
            .expect(JSON.stringify(await reportEditorPanel.getRowsObjects()))
            .toContain(objectsToAdd[0]);
        const rows = await reportEditorPanel.getRowsObjects();
        await since('2. Total objects in report rows after D&D should be #{expected}, instead it is #{actual}.')
            .expect(rows.length)
            .toBe(3);
        await reportDatasetPanel.addObjectToColumns(objectsToAdd[0]);
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'TC99679_16_01', 'Move attributes to columns');
    });

    it('[TC99679_17] DnD objects to view filter on normal report', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductNoPageBy.id,
            projectId: reportConstants.UIReportProductNoPageBy.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportFilterPanel.switchToViewFilterTab();
        await reportDatasetPanel.dndFromObjectPanelToContainer('Subcategory', 'filter data');
        await reportFilterPanel.selectElements(['Business', 'Literature']);
        await reportFilterPanel.newQual.done();
        await reportDatasetPanel.dndFromObjectPanelToContainer('Cost', 'filter data');
        await reportFilterPanel.metricFilter.openSelector('Operator');
        await reportFilterPanel.metricFilter.selectOption('Greater than');
        await reportFilterPanel.metricFilter.enterValue('100');
        await reportFilterPanel.metricFilter.done();
        await reportDatasetPanel.dndFromObjectPanelToContainer('Category', 'view filters');
        await reportFilterPanel.attributeFilter.selectInView();
        await reportFilterPanel.attributeFilter.done();
        await reportDatasetPanel.dndFromObjectPanelToContainer('Revenue', 'aggregation filters');
        await reportFilterPanel.metricFilter.openSelector('Operator');
        await reportFilterPanel.metricFilter.selectOption('Less than');
        await reportFilterPanel.metricFilter.enterValue('100000');
        await reportFilterPanel.metricFilter.done();
        await reportFilterPanel.sleep(3000);
        await takeScreenshotByElement(reportFilterPanel.getContainer(), 'TC99679_17_01', 'View filter panel');
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        // wait for total revenue to be $98,868
        await reportGridView.waitForGridCellToBeExpectedValue(3, 4, '$98,868');
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('3 Rows, 3 Columns');
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'TC99679_17_02',
            'report after apply view filter and aggregation filter'
        );
    });
});
