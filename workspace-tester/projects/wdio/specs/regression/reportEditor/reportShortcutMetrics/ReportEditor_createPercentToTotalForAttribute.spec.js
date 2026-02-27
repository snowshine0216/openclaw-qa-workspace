import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';

describe('Report Editor Shortcut Metrics in Workstation', () => {
    let {
        loginPage,
        libraryPage,
        reportToolbar,
        reportEditorPanel,
        reportGridView,
        reportPageBy,
        reportDerivedMetricEditor,
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
    it('[TC85613_3] Step 3: Creating percent to total for each attribute', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ReportGridShortcutMxAttrInCols.id,
            projectId: reportConstants.ReportGridShortcutMxAttrInCols.project.id,
        });

        await reportEditorPanel.expandSubmenuForPercentToTotalForMetricInMetricsDropZone('Cost');
        await reportEditorPanel.mouseOverSubMenuItem('Total for Each');
        // Then the submenu should not contain item "Category" in Editor Panel
        await since(
            'After expanding submenu for Cost, the submenu should not contain item "Category", instead we have #{actual}'
        )
            .expect(await reportEditorPanel.isSubmenuItemDisplayed('Category'))
            .toBe(false);

        // And the submenu should not contain item "2015 & 2016" in Editor Panel
        await since(
            'After expanding submenu for Cost, the submenu should not contain item "2015 & 2016", instead we have #{actual}'
        )
            .expect(await reportEditorPanel.isSubmenuItemDisplayed('2015 & 2016'))
            .toBe(false);

        // And the submenu should not contain item "Custom Categories" in Editor Panel
        await since(
            'After expanding submenu for Cost, the submenu should not contain item "Custom Categories", instead we have #{actual}'
        )
            .expect(await reportEditorPanel.isSubmenuItemDisplayed('Custom Categories'))
            .toBe(false);

        // And the submenu should contain item "Subcategory" in Editor Panel
        await since(
            'After expanding submenu for Cost, the submenu should contain item "Subcategory", instead we have #{actual}'
        )
            .expect(await reportEditorPanel.isSubmenuItemDisplayed('Subcategory'))
            .toBe(true);

        await reportEditorPanel.createTotalForeEachForAttributeInMetrics('Cost', 'Subcategory');
        // // Then "metric" object "Percent to Total (Cost)" should be added to "Metrics" dropzone in Editor Panel
        // await since(
        //     'After creating total for each attribute, The current selection for page by selector "Percent to Total (Cost)" is expected to be #{expected}, instead we have #{actual}'
        // )
        //     .expect(await reportPageBy.getPageBySelectorText('Percent to Total (Cost)'))
        //     .toContain('Metrics');
        // await takeScreenshotByElement(
        //     reportEditorPanel.metricsDropzone,
        //     'TC85613_3',
        //     'ReportEditor_createPercentToTotalForAttribute_1'
        // );
        await since(
            'After create total for each attribute, metrics dropzone should have "Percent to Total (Cost)" instead we have #{actual}'
        )
            .expect(await reportEditorPanel.getMetricsObjects())
            .toContain('Percent to Total (Cost)');

        await reportToolbar.switchToDesignMode();
        // Then the grid cell at "0", "0" has text "Year"
        await since(
            'After creating total for each attribute, the grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "1", "0" has text "Subcategory"
        await since(
            'After creating total for each attribute, The grid cell at "1", "0" should have text "Subcategory", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Subcategory');

        // And the grid cell at "2", "0" has text "Art & Architecture"
        await since(
            'After creating total for each attribute, The grid cell at "2", "0" should have text "Art & Architecture", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('Art & Architecture');

        // And the grid cell at "0", "1" has text "2015 DE"
        await since(
            'After creating total for each attribute, The grid cell at "0", "1" should have text "2015 DE", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('2015 DE');

        // And the grid cell at "1", "1" has text "Cost"
        await since(
            'After creating total for each attribute, The grid cell at "1", "1" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Cost');

        // And the grid cell at "2", "1" has text "-$36,780"
        await since('The grid cell at "2", "1" should have text "-$36,780", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('-$36,780');

        // And the grid cell at "1", "2" has text "Percent to Total (Cost)"
        await since(
            'After creating total for each attribute, The grid cell at "1", "2" should have text "Percent to Total (Cost)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Percent to Total (Cost)');

        // And the grid cell at "2", "2" has text "-13.47%"
        await since(
            'After creating total for each attribute, The grid cell at "2", "2" should have text "-13.47%", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('-13.47%');

        // And the grid cell at "0", "3" has text "2016"
        await since(
            'After creating total for each attribute, The grid cell at "0", "3" should have text "2016", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('2016');

        // And the grid cell at "1", "3" has text "Cost"
        await since(
            'After creating total for each attribute, The grid cell at "1", "3" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('Cost');

        // And the grid cell at "2", "3" has text "$44,810"
        await since(
            'After creating total for each attribute, The grid cell at "2", "3" should have text "$44,810", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$44,810');

        // And the grid cell at "1", "4" has text "Percent to Total (Cost)"
        await since(
            'After creating total for each attribute, The grid cell at "1", "4" should have text "Percent to Total (Cost)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('Percent to Total (Cost)');

        // And the grid cell at "2", "4" has text "16.41%"
        await since(
            'After creating total for each attribute, The grid cell at "2", "4" should have text "16.41%", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toBe('16.41%');

        await reportEditorPanel.createTotalForeEachForAttributeInMetrics('Cost', 'Year');
        // Then "metric" object "Percent to Total (Cost) 1" should be added to "Metrics" dropzone in Editor Panel
        await since(
            'After creating total for each attribute Year, The "metric" object "Percent to Total (Cost) 1" should be added to "Metrics" dropzone, instead we have #{actual}'
        )
            .expect(
                await reportEditorPanel
                    .getObjectInDropzone('Metrics', 'metric', 'Percent to Total (Cost) 1')
                    .isDisplayed()
            )
            .toBe(true);

        // And the grid cell at "0", "0" has text "Year"
        await since(
            'After creating total for each attribute Year, the grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "1", "0" has text "Subcategory"
        await since(
            'After creating total for each attribute Year, The grid cell at "1", "0" should have text "Subcategory", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Subcategory');

        // And the grid cell at "2", "0" has text "Art & Architecture"
        await since(
            'After creating total for each attribute Year, The grid cell at "2", "0" should have text "Art & Architecture", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('Art & Architecture');
        // And the grid cell at "0", "1" has text "2015 DE"
        await since(
            'After creating total for each attribute Year, The grid cell at "0", "1" should have text "2015 DE", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('2015 DE');

        // And the grid cell at "1", "1" has text "Cost"
        await since(
            'After creating total for each attribute Year,T he grid cell at "1", "1" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Cost');

        // And the grid cell at "2", "1" has text "-$36,780"
        await since(
            'After creating total for each attribute Year, The grid cell at "2", "1" should have text "-$36,780", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('-$36,780');

        // And the grid cell at "1", "2" has text "Percent to Total (Cost) 1"
        await since(
            'After creating total for each attribute Year, The grid cell at "1", "2" should have text "Percent to Total (Cost) 1", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Percent to Total (Cost) 1');

        // And the grid cell at "2", "2" has text ""
        await since(
            'After creating total for each attribute Year, The grid cell at "2", "2" should have text "", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('');

        // And the grid cell at "1", "3" has text "Percent to Total (Cost)"
        await since(
            'After creating total for each attribute Year, The grid cell at "1", "3" should have text "Percent to Total (Cost)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('Percent to Total (Cost)');

        // And the grid cell at "2", "3" has text "-13.47%"
        await since(
            'After creating total for each attribute Year, The grid cell at "2", "3" should have text "-13.47%", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('-13.47%');

        // And the grid cell at "0", "4" has text "2016"
        await since(
            'After creating total for each attribute Year, The grid cell at "0", "4" should have text "2016", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('2016');

        // And the grid cell at "1", "4" has text "Cost"
        await since(
            'After creating total for each attribute Year, The grid cell at "1", "4" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('Cost');

        // And the grid cell at "2", "4" has text "$44,810"
        await since(
            'After creating total for each attribute Year, The grid cell at "2", "4" should have text "$44,810", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toBe('$44,810');

        // And the grid cell at "1", "5" has text "Percent to Total (Cost) 1"
        await since(
            'After creating total for each attribute Year, The grid cell at "1", "5" should have text "Percent to Total (Cost) 1", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 5))
            .toBe('Percent to Total (Cost) 1');

        // And the grid cell at "2", "5" has text "1.12%"
        await since(
            'After creating total for each attribute Year, The grid cell at "2", "5" should have text "1.12%", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 5))
            .toBe('1.12%');

        // And the grid cell at "1", "6" has text "Percent to Total (Cost)"
        await since(
            'After creating total for each attribute Year, The grid cell at "1", "6" should have text "Percent to Total (Cost)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 6))
            .toBe('Percent to Total (Cost)');

        // And the grid cell at "2", "6" has text "16.41%"
        await since(
            'After creating total for each attribute Year, The grid cell at "2", "6" should have text "16.41%", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 6))
            .toBe('16.41%');

        // When I select element "Music" from Page by selector "Category"
        await reportPageBy.changePageByElement('Category', 'Music');

        // Then The current selection for page by selector "Category" should be "Music"
        await since(
            'After selecting element "Music" from Page by selector "Category", The current selection for page by selector "Category" should be "Music", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Category'))
            .toBe('Music');

        // And the grid cell at "0", "0" has text "Year"
        await since(
            'After selecting element "Music" from Page by selector "Category", The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "1", "0" has text "Subcategory"
        await since(
            'After selecting element "Music" from Page by selector "Category", The grid cell at "1", "0" should have text "Subcategory", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Subcategory');

        // And the grid cell at "2", "0" has text "Alternative"
        await since(
            'After selecting element "Music" from Page by selector "Category", The grid cell at "2", "0" should have text "Alternative", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('Alternative');

        // And the grid cell at "0", "1" has text "2015 DE"
        await since(
            'After selecting element "Music" from Page by selector "Category", The grid cell at "0", "1" should have text "2015 DE", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('2015 DE');

        // And the grid cell at "1", "1" has text "Cost"
        await since(
            'After selecting element "Music" from Page by selector "Category", The grid cell at "1", "1" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Cost');

        // And the grid cell at "2", "1" has text "-$69,879"
        await since(
            'After selecting element "Music" from Page by selector "Category", The grid cell at "2", "1" should have text "-$69,879", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('-$69,879');

        // And the grid cell at "1", "2" has text "Percent to Total (Cost) 1"
        await since(
            'After selecting element "Music" from Page by selector "Category", The grid cell at "1", "2" should have text "Percent to Total (Cost) 1", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Percent to Total (Cost) 1');

        // And the grid cell at "2", "2" has text ""
        await since(
            'After selecting element "Music" from Page by selector "Category", The grid cell at "2", "2" should have text "", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('');

        // And the grid cell at "1", "3" has text "Percent to Total (Cost)"
        await since(
            'After selecting element "Music" from Page by selector "Category", The grid cell at "1", "3" should have text "Percent to Total (Cost)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('Percent to Total (Cost)');

        // And the grid cell at "2", "3" has text "-14.79%"
        await since(
            'After selecting element "Music" from Page by selector "Category", The grid cell at "2", "3" should have text "-14.79%", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('-14.79%');

        // And the grid cell at "0", "4" has text "2016"
        await since(
            'After selecting element "Music" from Page by selector "Category", The grid cell at "0", "4" should have text "2016", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('2016');

        // And the grid cell at "1", "4" has text "Cost"
        await since(
            'After selecting element "Music" from Page by selector "Category", The grid cell at "1", "4" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('Cost');

        // And the grid cell at "2", "4" has text "$80,677"
        await since(
            'After selecting element "Music" from Page by selector "Category", The grid cell at "2", "4" should have text "$80,677", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toBe('$80,677');

        // And the grid cell at "1", "5" has text "Percent to Total (Cost) 1"
        await since(
            'After selecting element "Music" from Page by selector "Category", The grid cell at "1", "5" should have text "Percent to Total (Cost) 1", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 5))
            .toBe('Percent to Total (Cost) 1');
        // And the grid cell at "2", "5" has text "2.02%"
        await since(
            'After selecting element "Music" from Page by selector "Category", The grid cell at "2", "5" should have text "2.02%", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 5))
            .toBe('2.02%');

        // And the grid cell at "1", "6" has text "Percent to Total (Cost)"
        await since(
            'After selecting element "Music" from Page by selector "Category", The grid cell at "1", "6" should have text "Percent to Total (Cost)", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 6))
            .toBe('Percent to Total (Cost)');

        // And the grid cell at "2", "6" has text "17.07%"
        await since(
            'After selecting element "Music" from Page by selector "Category", The grid cell at "2", "6" should have text "17.07%", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 6))
            .toBe('17.07%');

        // When I open context menu for "metric" "Percent to Total (Cost)" in "metrics" dropzone from the Editor Panel in Report Editor
        await reportEditorPanel.openObjectContextMenu('metrics', 'metric', 'Percent to Total (Cost)');

        // And I click context menu item "Edit..." in Editor Panel
        await reportEditorPanel.clickContextMenuItem('Edit...');

        // // Then The Metric Editor should be "displayed"
        // await since(
        //     'After selecting element "Music" from Page by selector "Category", The Metric Editor should be displayed, instead we have #{actual}'
        // )
        //     .expect(await reportDerivedMetricEditor.isMetricEditorDisplayed())
        //     .toBe(true);

        // And "Cost/Sum<UseLookupForAttributes=False>(Cost){Subcategory}" is displayed on the "Input" section of the Metrics panel
        // await since(
        //     'After selecting element "Music" from Page by selector "Category", "Cost/Sum<UseLookupForAttributes=False>(Cost){Subcategory}" should be displayed on the "Input" section of the Metrics panel, instead we have #{actual}'
        // )
        //     .expect(
        //         await reportDerivedMetricEditor.isTextDisplayedInInputSection(
        //             'Cost/Sum<UseLookupForAttributes=False>(Cost){Subcategory}',
        //             'Input'
        //         )
        //     )
        //     .toBe(true);
        await takeScreenshotByElement(
            await reportDerivedMetricEditor.metricDefn,
            'TC85613_3',
            'ReportEditor_createPercentToTotalForAttribute_metricDefn_1'
        );

        // When I click on the "Save" button of DM Editor in Formula mode
        await reportDerivedMetricEditor.saveFormulaMetric();

        // Then The Metric Editor should be "hidden"
        await since(
            'After selecting element "Music" from Page by selector "Category", The Metric Editor should be hidden, instead we have #{actual}'
        )
            .expect(await reportDerivedMetricEditor.isMetricEditorDisplayed())
            .toBe(false);

        // When I open context menu for "metric" "Percent to Total (Cost) 1" in "metrics" dropzone from the Editor Panel in Report Editor
        await reportEditorPanel.openObjectContextMenu('metrics', 'metric', 'Percent to Total (Cost) 1');

        // And I click context menu item "Edit..." in Editor Panel
        await reportEditorPanel.clickContextMenuItem('Edit...');

        //  // Then The Metric Editor should be "displayed"
        //  await since('The Metric Editor should be displayed').expect(await reportDerivedMetricEditormetricEditor.isDisplayed()).toBe(true);

        // And "Cost/Sum<UseLookupForAttributes=False>(Cost){Year}" is displayed on the "Input" section of the Metrics panel
        // await since(
        //     'After selecting element "Music" from Page by selector "Category", "Cost/Sum<UseLookupForAttributes=False>(Cost){Year}" should be displayed on the "Input" section of the Metrics panel'
        // )
        //     .expect(
        //         await await metricsPanel.isTextDisplayedInSection(
        //             'Cost/Sum<UseLookupForAttributes=False>(Cost){Year}',
        //             'Input'
        //         )
        //     )
        //     .toBe(true);

        await takeScreenshotByElement(
            await reportDerivedMetricEditor.metricDefn,
            'TC85613_3',
            'ReportEditor_createPercentToTotalForAttribute_metricDefn_2'
        );
        // When I click on the "Save" button of DM Editor in Formula mode
        await reportDerivedMetricEditor.saveFormulaMetric();

        //  // Then The Metric Editor should be "hidden"
        //  await since('The Metric Editor should be hidden').expect(await metricEditor.isDisplayed()).toBe(false);
    });
});
