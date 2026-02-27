import * as reportConstants from '../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';

describe('Objects panel in report editor (Drag and Drop actions)', () => {
    let {
        loginPage,
        libraryPage,
        reportEditorPanel,
        reportDatasetPanel,
        reportToolbar,
        reportPageBy,
        reportGridView,
        reportFilterPanel,
        reportTOC,
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

    it('[TC85824_1] Step1: FUN | Object Panel | Report Objects | Drag and Drop to Grid', async () => {
        await libraryPage.createNewReportByUrl({});
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);
        await reportDatasetPanel.dndFromObjectPanelToContainer('Cost', 'grid');
        // await takeScreenshotByElement(reportEditorPanel.columnsDropzone, 'TC85824_1', 'metric_cost');
        // await takeScreenshotByElement(reportEditorPanel.metricsDropzone, 'TC85824_2', 'metric_cost');
        await since('After adding Cost to grid, "Columns" dropzone should have #{expected} instead we have #{actual}')
            .expect(JSON.stringify(await reportEditorPanel.getColumnsObjects()))
            .toBe(JSON.stringify(['Metric Names']));
        await since('After adding Cost to grid, "Metrics" dropzone should have #{expected} instead we have #{actual}')
            .expect(JSON.stringify(await reportEditorPanel.getMetricsObjects()))
            .toBe(JSON.stringify(['Cost']));

        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickFolderUpMultipleTimes(3);
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Products']);
        await reportDatasetPanel.dndFromObjectPanelToContainer('Category', 'pageby');
        await since(
            'After adding Category to page by, "PageBy" dropzone should have #{expected} instead we have #{actual}'
        )
            .expect(JSON.stringify(await reportEditorPanel.getPageByObjects()))
            .toBe(JSON.stringify(['Category']));

        await since(
            'The current selection for page by selector "Category" is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Category'))
            .toContain('Books');

        await reportEditorPanel.dndFromObjectBrowserToDropzone('Subcategory', 'Rows');
        await since(
            'After adding Subcategory to rows, "Rows" dropzone should have #{expected} instead we have #{actual}'
        )
            .expect(JSON.stringify(await reportEditorPanel.getRowsObjects()))
            .toBe(JSON.stringify(['Subcategory']));

        //  1.5 add years to columns
        await reportDatasetPanel.clickFolderUpMultipleTimes(1);
        await reportDatasetPanel.selectItemInObjectList('Time');
        await reportEditorPanel.dndFromObjectBrowserToDropzone('Year', 'Columns');
        await reportEditorPanel.sleep(reportConstants.sleepTimeForAssertion);
        await since(
            'After adding Year to columns, "Columns" dropzone should have #{expected} instead we have #{actual}'
        )
            .expect(JSON.stringify(await reportEditorPanel.getColumnsObjects()))
            .toBe(JSON.stringify(['Metric Names', 'Year']));
        await since('The grid cell at "0", "0"  should has no text, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('');
        await since('The grid cell at "0", "1" should has text "2014", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Cost');
        await since('The grid cell at "1", "0" should has text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Subcategory');
        await since('The grid cell at "1", "1" should has text #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('2014');
        await since('The grid cell at "1", "2" should has text "Cost", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('2015');
        await since('The grid cell at "1", "3" should has text "Cost", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('2016');
        await since('The grid cell at "2", "1" should has text "$88,179", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('$88,179');
        await since('The grid cell at "2", "2" should has text "$122,316", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('$122,316');
        await since('The grid cell at "2", "3" should has text "$159,666", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$159,666');
    });

    it('[TC85824_2] Step 2-4: FUN | Object Panel | Report Objects | Drag and Drop to Grid', async () => {
        //  may need to manually create the report 101F3D27DC41299D41993F8550EF1EE8
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ObjectsPanelTest1.id,
            projectId: reportConstants.ObjectsPanelTest1.project.id,
        });
        await reportToolbar.switchToDesignMode();
        // 11 move Subcategory from Row to page by
        await reportPageBy.moveGridHeaderToPageBy('Subcategory');
        await since(
            'After moving Subcategory to page by, "PageBy" dropzone should have #{expected} instead we have #{actual}'
        )
            .expect(JSON.stringify(await reportEditorPanel.getPageByObjects()))
            .toBe(JSON.stringify(['Category', 'Subcategory']));
        await since(
            'The current selection for page by selector "Subcategory" is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await reportPageBy.getPageBySelectorText('Subcategory'))
            .toEqual('Art & Architecture');

        // 12 move Custom categories to page by after category -----
        await reportPageBy.moveGridHeaderToPageBy('Custom Categories');
        await since(
            'After moving Custom Categories to page by, "PageBy" dropzone should have #{expected} instead we have #{actual}'
        )
            .expect(JSON.stringify(await reportEditorPanel.getPageByObjects()))
            .toBe(JSON.stringify(['Category', 'Subcategory', 'Custom Categories']));
        await since(
            'The current selection for page by selector "Custom Categories" is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await reportPageBy.getPageBySelectorText('Custom Categories'))
            .toEqual('Category Sales');
        // 13 move Subcategory from page by to row
        await reportEditorPanel.dndObjectBetweenDropzones('Subcategory', 'attribute', 'PageBy', 'Rows');
        await since(
            'After moving Subcategory to rows, "Rows" dropzone should have #{expected} instead we have #{actual}'
        )
            .expect(JSON.stringify(await reportEditorPanel.getRowsObjects()))
            .toBe(JSON.stringify(['Subcategory']));

        // 14 move metrics to page by
        await browser.pause(2000);
        await reportPageBy.moveGridHeaderToPageBy('Cost');
        await since('After moving Cost to page by, "PageBy" dropzone should have #{expected} instead we have #{actual}')
            .expect(JSON.stringify(await reportEditorPanel.getPageByObjects()))
            .toBe(JSON.stringify(['Category', 'Custom Categories', 'Metric Names']));
        await since(
            'The current selection for page by selector "Metrics" is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await reportPageBy.getPageBySelectorText('Metrics'))
            .toEqual('Cost');
        // Step 4 remove objects
        await reportPageBy.removePageBy('Category'); // drag action keeps failing in CI, replace with remove by context menu
        await since(
            'After removing Category from page by, "PageBy" dropzone should not have #{expected} instead we have #{actual}'
        )
            .expect(await reportEditorPanel.getPageByObjects())
            .not.toContain('Category');
        // DE253395: error when dragging metric to dataset panel
        // await reportDatasetPanel.dndFromGridToObjectsPanel('Cost');
        // await takeScreenshotByElement(reportEditorPanel.metricsDropzone, 'TC85824_22', 'profit_margin');
        // await takeScreenshotByElement(reportGridView.grid, 'TC85824_23', 'grid');
    });

    it('[TC85824_3] Additional test on drag and drop manipulations to containers pause mode', async () => {
        // A76E6DE3424C48AD871CD3A0FE2C5986
        //  # Report: 1. Test Users > GridAutomation > ReportAutomation >
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TC85616.id,
            projectId: reportConstants.TC85616.project.id,
        });

        // await reportDatasetPanel.switchToInReportTab();
        await reportDatasetPanel.dndFromObjectBrowserToGrid('Category');
        await since('After moving Category to grid, "Grid" dropzone should have #{expected} instead we have #{actual}')
            .expect(JSON.stringify(await reportEditorPanel.getRowsObjects()))
            .toBe(JSON.stringify(['Category']));

        await reportDatasetPanel.dndFromObjectBrowserToGrid('Subcategory');
        await since(
            'After moving Subcategory to grid, "Grid" dropzone should have #{expected} instead we have #{actual}'
        )
            .expect(JSON.stringify(await reportEditorPanel.getRowsObjects()))
            .toBe(JSON.stringify(['Category', 'Subcategory']));

        await reportDatasetPanel.dndFromObjectBrowserToGrid('Cost');
        await since('After moving Cost to grid, "Grid" dropzone should have #{expected} instead we have #{actual}')
            .expect(JSON.stringify(await reportEditorPanel.getMetricsObjects()))
            .toBe(JSON.stringify(['Cost']));

        await reportDatasetPanel.dndFromObjectBrowserToGrid('Profit');
        await since('After moving Profit to grid, "Metrics" dropzone should have #{expected} instead we have #{actual}')
            .expect(JSON.stringify(await reportEditorPanel.getMetricsObjects()))
            .toBe(JSON.stringify(['Cost', 'Profit']));

        // # adding metric to new zone will add it to existing zone (columns)
        await reportDatasetPanel.dndFromObjectBrowserToPageBy('Revenue');
        await since(
            'After moving Revenue to page by, "PageBy" dropzone should have #{expected} instead we have #{actual}'
        )
            .expect(JSON.stringify(await reportEditorPanel.getPageByObjects()))
            .toBe(JSON.stringify([]));
        await reportDatasetPanel.dndFromObjectBrowserToPageBy('Supplier');
        await since(
            'After moving Supplier to page by, "PageBy" dropzone should have #{expected} instead we have #{actual}'
        )
            .expect(JSON.stringify(await reportEditorPanel.getPageByObjects()))
            .toBe(JSON.stringify(['Supplier']));
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.dndFromObjectBrowserToReportFilter('Category');
        await reportFilterPanel.selectElements(['Books', 'Electronics']);
        await reportFilterPanel.saveAndCloseQualificationEditor();

        await reportToolbar.switchToDesignMode();
        await since('The grid cell at "0", "0" should has text "Category", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Category');
        await since('The grid cell at "0", "1" should has text "Subcategory", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Subcategory');
        await since('The grid cell at "0", "2" should has text "Cost", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Cost');
        await since('The grid cell at "0", "3" should has text "Profit", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Profit');
        await since('The grid cell at "1", "0" should has text "Books", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Books');
        await since('The grid cell at "1", "1" should has text "Art & Architecture", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Art & Architecture');
        await since('The grid cell at "1", "2" should has text "$88,162", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('$88,162');
        await since('The grid cell at "1", "3" should has text "$25,887", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$25,887');
        await since('The grid cell at "1", "4" should has text "$114,049", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('$114,049');

        await since(
            'The current selection for page by selector Supplier is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await reportPageBy.getPageBySelectorText('Supplier'))
            .toEqual('Bantam Books');
    });

    // it('[TC81132_1] Drag and drop manipulations from object browser and reordering within/moving from page by', async () => {
    //     await libraryPage.createNewReportByUrl({});
    //     await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Time']);
    //     await reportEditorPanel.dndMultipleObjectsFromObjectBrowserToPageBy(['Quarter', 'Year']);
    //     // await takeScreenshotByElement(reportEditorPanel.pageByDropzone, 'TC81132_1', 'attribute_year_quarter');
    //     await since(
    //         'After dnd Quarter and Year to page by, "PageBy" dropzone should have #{expected} instead we have #{actual}'
    //     )
    //         .expect(JSON.stringify(await reportEditorPanel.getPageByObjects()))
    //         .toBe(JSON.stringify(['Quarter', 'Year']));
    //     await reportDatasetPanel.clickFolderUpMultipleTimes(1);
    //     await reportDatasetPanel.selectItemInObjectList('Products');
    //     await reportEditorPanel.dndObjectFromObjectBrowserToRows('Category');
    //     await reportDatasetPanel.clickFolderUpMultipleTimes(3);
    //     await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);
    //     await reportEditorPanel.dndMultipleObjectsFromObjectBrowserToColumns(['Profit']);
    //     await reportEditorPanel.dndMultipleObjectsFromObjectBrowserToMetrics(['Cost']);
    //     // await reportAttributeFormsDialog.selectDisplayAttributeFormMode();
    //     await reportToolbar.switchToDesignMode();
    //     await since('The grid cell at "0", "0" should has text "Category", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 0))
    //         .toBe('Category');
    //     await since('The grid cell at "0", "1" should has text "Cost", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 1))
    //         .toBe('Cost');
    //     await since('The grid cell at "0", "2" should has text "Profit", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 2))
    //         .toBe('Profit');
    //     await since('The grid cell at "1", "0" should has text "Books", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 0))
    //         .toBe('Books');
    //     await since('The grid cell at "1", "1" should has text "$94,913", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 1))
    //         .toBe('$94,913');
    //     await since('The grid cell at "1", "2" should has text "$29,756", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 2))
    //         .toBe('$29,756');
    //     await since(
    //         'The current selection for page by selector "Year" is expected to be #{expected}, instead we have #{actual}.'
    //     )
    //         .expect(await reportPageBy.getPageBySelectorText('Year'))
    //         .toEqual('2014');
    //     await since(
    //         'The current selection for page by selector "Quarter" is expected to be #{expected}, instead we have #{actual}.'
    //     )
    //         .expect(await reportPageBy.getPageBySelectorText('Quarter'))
    //         .toEqual('2014 Q1');
    //     //  # reorder selectors by DnD
    //     await reportEditorPanel.dndAttributeWithinPageByDropzone('Quarter', 'Year');
    //     // await takeScreenshotByElement(reportEditorPanel.pageByDropzone, 'TC81132_3', 'attribute_quarter_year');
    //     await since(
    //         'After dnd Year to right of Quarter, "PageBy" dropzone should have #{expected} instead we have #{actual}'
    //     )
    //         .expect(JSON.stringify(await reportEditorPanel.getPageByObjects()))
    //         .toBe(JSON.stringify(['Quarter', 'Year']));
    //     await since(
    //         'The current selection for page by selector "Quarter" should be #{expected}, instead we have #{actual}.'
    //     )
    //         .expect(await reportPageBy.getPageBySelectorText('Quarter'))
    //         .toEqual('1');
    //     await since(
    //         'The current selection for page by selector "Year" should be #{expected}, instead we have #{actual}.'
    //     )
    //         .expect(await reportPageBy.getPageBySelectorText('Year'))
    //         .toEqual('2');
    //     await since('The grid cell at "0", "0" should has text "Category", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 0))
    //         .toBe('Category');
    //     await since('The grid cell at "0", "1" should has text "Cost", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 1))
    //         .toBe('Cost');
    //     await since('The grid cell at "0", "2" should has text "Profit", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 2))
    //         .toBe('Profit');
    //     await since('The grid cell at "1", "0" should has text "Books", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 0))
    //         .toBe('Books');
    //     await since('The grid cell at "1", "1" should has text "$94,913", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 1))
    //         .toBe('$94,913');
    //     await since('The grid cell at "1", "2" should has text "$29,756", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 2))
    //         .toBe('$29,756');

    //     // # move selectors to grid
    //     await reportDatasetPanel.dndFromObjectPanelToGridHeader('Quarter', 'Category');
    //     await reportDatasetPanel.dndFromObjectPanelToGridHeader('Year', 'Profit');
    //     // await takeScreenshotByElement(reportEditorPanel.rowsDropzone, 'TC81132_5', 'attribute_category_quarter');
    //     // await takeScreenshotByElement(reportEditorPanel.columnsDropzone, 'TC81132_6', 'attribute_metricNames_cost');
    //     await since(
    //         'After dnd Quarter to right of Category and Cost to bottom of Metric Names, "Rows" dropzone should have #{expected} instead we have #{actual}'
    //     )
    //         .expect(JSON.stringify(await reportEditorPanel.getRowsObjects()))
    //         .toBe(JSON.stringify(['Category', 'Quarter']));
    //     await since(
    //         'After dnd Year to bottom of Cost, "Columns" dropzone should have #{expected} instead we have #{actual}'
    //     )
    //         .expect(JSON.stringify(await reportEditorPanel.getColumnsObjects()))
    //         .toBe(JSON.stringify(['Cost', 'Metric Names']));
    //     await since('The grid cell at "0", "0" should has text "Category", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 0))
    //         .toBe('Category');
    //     await since('The grid cell at "0", "1" should has text "", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 1))
    //         .toBe('');
    //     await since('The grid cell at "0", "2" should has text "Cost", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 2))
    //         .toBe('Cost');
    //     await since('The grid cell at "0", "5" should has text "Profit", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 5))
    //         .toBe('Profit');
    //     await since('The grid cell at "1", "1" should has text "Quarter", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 1))
    //         .toBe('Quarter');
    //     await since('The grid cell at "1", "2" should has text "2014", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 2))
    //         .toBe('2014');
    //     await since('The grid cell at "1", "3" should has text "2015", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 3))
    //         .toBe('2015');
    //     await since('The grid cell at "2", "0" should has text "Books", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(2, 0))
    //         .toBe('Books');
    //     await since('The grid cell at "2", "1" should has text "2014 Q1", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(2, 1))
    //         .toBe('2014 Q1');
    //     await since('The grid cell at "2", "2" should has text "$94,913", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(2, 2))
    //         .toBe('$94,913');
    //     await since('The grid cell at "2", "4" should has text "", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(2, 4))
    //         .toBe('');
    //     await since('The grid cell at "2", "5" should has text "$29,756", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(2, 5))
    //         .toBe('$29,756');
    //     // # dragging metric to page by will move all metrics
    //     await reportEditorPanel.dndObjectFromObjectBrowserToPageBy('Cost');
    //     // await takeScreenshotByElement(reportEditorPanel.pageByDropzone, 'TC81132_7', 'attribute_cost_metricNames');
    //     await since(
    //         'After dnd Cost to right of Metric Names, "PageBy" dropzone should have #{expected} instead we have #{actual}'
    //     )
    //         .expect(JSON.stringify(await reportEditorPanel.getPageByObjects()))
    //         .toBe(JSON.stringify(['Cost', 'Metric Names']));
    //     await since('The grid cell at "0", "0" should has text "Category", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 0))
    //         .toBe('Category');
    //     await since('The grid cell at "0", "1" should has text "Quarter", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 1))
    //         .toBe('Quarter');
    //     await since('The grid cell at "0", "2" should has text "2014", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 2))
    //         .toBe('2014');
    //     await since('The grid cell at "0", "3" should has text "2015", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 3))
    //         .toBe('2015');
    //     await since('The grid cell at "0", "4" should has text "2016", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 4))
    //         .toBe('2016');
    //     await since('The grid cell at "1", "0" should has text "Books", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 0))
    //         .toBe('Books');
    //     await since('The grid cell at "1", "2" should has text "$94,913", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 2))
    //         .toBe('$94,913');
    //     await since('The grid cell at "1", "3" should has text "", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 3))
    //         .toBe('');
    //     await since('The grid cell at "1", "4" should has text "", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 4))
    //         .toBe('');
    //     await since(
    //         'Zone "PageBy" should have the "Metric Names" with type "metric_entity" should be #{expected}, instead we have #{actual}.'
    //     )
    //         .expect(await reportEditorPanel.getZoneObjectsInOrder('PageBy'))
    //         .toEqual(['Metric Names']);
    // });

    // it('[TC81132_2] Drag and drop manipulations from object list and reordering objects within grid', async () => {
    //     // A76E6DE3424C48AD871CD3A0FE2C5986
    //     await libraryPage.editReportByUrl({
    //         dossierId: reportConstants.ObjectsPanelTest.id,
    //         projectId: reportConstants.ObjectsPanelTest.project.id,
    //     });
    //     //  # add Category to filter for hierarchy to be able to execute report
    //     await reportDatasetPanel.switchToInReportTab();
    //     await reportTOC.switchToFilterPanel();
    //     await reportDatasetPanel.selectItemInObjectList('Category');
    //     // And I drag the object named "Category" from object list to "report filter"
    //     await reportDatasetPanel.dndFromObjectListToReportFilter('Category');
    //     await reportFilterPanel.selectElements(['Books', 'Electronics']);
    //     await reportFilterPanel.saveAndCloseQualificationEditor();
    //     await reportPromptEditor.clickApplyButtonInReportPromptEditor();
    //     //  # And I click Apply button to submit the Filters
    //     // await reportAttributeFormsDialog.saveAndCloseAttributeFormsDialog();
    //     await reportToolbar.switchToDesignMode();
    //     await reportTOC.switchToEditorPanel();
    //     // await reportEditorPanel.dndFromObjectListToRows('Item');
    //     // await reportEditorPanel.dndFromObjectListToRows('Category');
    //     await reportEditorPanel.dndMultipleObjectsFromObjectListToRows(['Item', 'Category']);
    //     // await reportEditorPanel.dndFromObjectListToColumns('Profit');
    //     // await reportEditorPanel.dndFromObjectListToMetrics('Cost');
    //     await reportEditorPanel.dndMultipleObjectsFromObjectListToColumns(['Profit', 'Cost']);
    //     await takeScreenshotByElement(reportEditorPanel.rowsDropzone, 'TC81132_7', 'rows_category_item');
    //     await takeScreenshotByElement(reportEditorPanel.metricsDropzone, 'TC81132_8', 'metric_cost_profit');
    //     // # reorder objects within grid
    //     await reportGrid.dragHeaderCellToRow('Item', 'left', 'Books');
    //     await takeScreenshotByElement(reportEditorPanel.rowsDropzone, 'TC81132_9', 'rows_item_category');
    //     await reportGrid.dragHeaderCellToRow('Category', 'left', '100 Places to Go While Still Young at Heart');
    //     await takeScreenshotByElement(reportEditorPanel.rowsDropzone, 'TC81132_10', 'rows_category_item');
    //     await reportGrid.dragHeaderCellToCol('Category', 'top', 'Cost');
    //     await takeScreenshotByElement(reportEditorPanel.columnsDropzone, 'TC81132_11', 'columns_category_metricNames');
    //     await since('The grid cell at "0", "0" should has text "Category", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 0))
    //         .toBe('Category');
    //     await since('The grid cell at "0", "1" should has text "Books", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 1))
    //         .toBe('Books');
    //     await since('The grid cell at "0", "2" should has text "Books", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 2))
    //         .toBe('Books');
    //     await since('The grid cell at "1", "0" should has text "Item", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 0))
    //         .toBe('Item');
    //     await since(
    //         'The grid cell at "2", "0" should has text "100 Places to Go While Still Young at Heart", instead we have #{actual}'
    //     )
    //         .expect(await reportGridView.getGridCellTextByPos(2, 0))
    //         .toBe('100 Places to Go While Still Young at Heart');
    //     await since('The grid cell at "2", "1" should has text "$50,216", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(2, 1))
    //         .toBe('$50,216');
    //     await since('The grid cell at "2", "2" should has text "$17,776", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(2, 2))
    //         .toBe('$17,776');

    //     await since('The grid cell at "0", "3" should has text "Electronics", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 3))
    //         .toBe('Electronics');
    //     await since('The grid cell at "0", "4" should has text "Electronics", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 4))
    //         .toBe('Electronics');
    //     await since('The grid cell at "1", "3" should has text "Cost", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 3))
    //         .toBe('Cost');
    //     await since('The grid cell at "1", "4" should has text "Profit", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 4))
    //         .toBe('Profit');
    //     // await reportDatasetPanel.selectItemInObjectList('Category');
    //     // await reportDatasetPanel.dndFromObjectPanelToContainer('bottom', 'col', 'Profit');
    //     await reportGrid.dragHeaderCellToCol('Category', 'bottom', 'Profit');
    //     await takeScreenshotByElement(reportEditorPanel.columnsDropzone, 'TC81132_13', 'columns_metricNames_category');
    //     await since('The grid cell at "0", "0" should has text "", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 0))
    //         .toBe('');
    //     await since('The grid cell at "0", "1" should has text "Cost", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 1))
    //         .toBe('Cost');
    //     await since('The grid cell at "0", "2" should has text "Cost", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 2))
    //         .toBe('Cost');
    //     await since('The grid cell at "0", "3" should has text "Profit", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 3))
    //         .toBe('Profit');
    //     await since('The grid cell at "1", "0" should has text "Item", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 0))
    //         .toBe('Item');
    //     await since('The grid cell at "1", "1" should has text "Books", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 1))
    //         .toBe('Books');
    //     await since('The grid cell at "1", "2" should has text "Electronics", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 2))
    //         .toBe('Electronics');
    //     await since('The grid cell at "1", "3" should has text "Books", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 3))
    //         .toBe('Books');
    //     await since('The grid cell at "2", "1" should has text "$50,216", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(2, 1))
    //         .toBe('$50,216');
    //     await since('The grid cell at "2", "2" should has text "", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(2, 2))
    //         .toBe('');
    //     await since('The grid cell at "2", "3" should has text "$17,776", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(2, 3))
    //         .toBe('$17,776');
    //     await since('The grid cell at "2", "4" should has text "", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(2, 4))
    //         .toBe('');
    // });
});
