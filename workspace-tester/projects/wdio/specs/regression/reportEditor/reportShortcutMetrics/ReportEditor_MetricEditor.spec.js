import * as reportConstants from '../../../../constants/report.js';
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
        reportDerivedMetricEditor,
        reportDatasetPanel,
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

    it('[TC85613_6] Step 6: Metric Editor', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ReportGridContextMenu.id,
            projectId: reportConstants.ReportGridContextMenu.project.id,
        });

        // When I open context menu for "metric" "Cost" in "metrics" dropzone from the Editor Panel in Report Editor
        await reportEditorPanel.openObjectContextMenu('metrics', 'metric', 'Cost');

        // Then the context menu should not contain item "Edit..." in Editor Panel
        await since(
            'After open context menu for "metric" "Cost" in "metrics" dropzone from the Editor Panel in Report Editor, The context menu should not contain item "Edit...", instead we have #{actual}'
        )
            .expect(await reportEditorPanel.isEditContextMenuItemDisplayed())
            .toBe(false);

        // When I click context menu item "Create Metric..." in Editor Panel
        await reportEditorPanel.clickContextMenuItem('Create Metric...');
        // When I click on the Switch to "Formula" Editor button of DM Editor
        await reportDerivedMetricEditor.switchMode('Formula');

        // Then "Sum(Cost){~+}" is displayed on the "Input" section of the Metrics panel
        await since(
            'After click on the Switch to "Formula" Editor button of DM Editor, "Sum(Cost){~+}" should be displayed on the "Input" section of the Metrics panel, instead we have #{actual}'
        )
            .expect(await reportDerivedMetricEditor.getTextInInputSection())
            .toContain('Sum(Cost){~+}');

        // When I click on the "Save" button of DM Editor
        await reportDerivedMetricEditor.saveMetric();

        // When I switch to "In Report" tab in dataset panel in Report Editor
        // await reportDatasetPanel.switchToInReportTab();

        // When I switch to design mode in Report Editor
        await reportToolbar.switchToDesignMode();

        // Then I will see object "New Metric" in In Report tab in Report Editor
        await since(
            'After switch to "In Report" tab in dataset panel in Report Editor, The object "New Metric" should be present in the In Report tab'
        )
            .expect(await reportDatasetPanel.getObjectInReportTab('New Metric').isDisplayed())
            .toBe(true);

        // And "metric" object "New Metric" should be added to "Metrics" dropzone in Editor Panel
        await since(
            'After switch to "In Report" tab in dataset panel in Report Editor, The object "New Metric" should be present in the Metrics dropzone'
        )
            .expect(await reportEditorPanel.getObjectInDropzone('Metrics', 'metric', 'New Metric').isDisplayed())
            .toBe(true);

        // And the grid cell at "0", "0" has text "Year"
        await since(
            'After switch to "In Report" tab in dataset panel in Report Editor, The grid cell at "0", "0" should have text "Year"'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "1", "0" has text "2014"
        await since(
            'After switch to "In Report" tab in dataset panel in Report Editor, The grid cell at "1", "0" should have text "2014"'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2014');

        // And the grid cell at "1", "1" has text "Central"
        await since(
            'After switch to "In Report" tab in dataset panel in Report Editor, The grid cell at "1", "1" should have text "Central"'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Central');

        // And the grid cell at "1", "2" has text "Books"
        await since(
            'After switch to "In Report" tab in dataset panel in Report Editor, The grid cell at "1", "2" should have text "Books"'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Books');

        // And the grid cell at "0", "3" has text "Cost"
        await since(
            'After switch to "In Report" tab in dataset panel in Report Editor, The grid cell at "0", "3" should have text "Cost"'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');

        // And the grid cell at "1", "3" has text "$77,012"
        await since(
            'After switch to "In Report" tab in dataset panel in Report Editor, The grid cell at "1", "3" should have text "$77,012"'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$77,012');

        // And the grid cell at "0", "4" has text "New Metric"
        await since(
            'After switch to "In Report" tab in dataset panel in Report Editor, The grid cell at "0", "4" should have text "New Metric"'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('New Metric');

        // And the grid cell at "1", "4" has text "$77,012"
        await since(
            'After switch to "In Report" tab in dataset panel in Report Editor, The grid cell at "1", "4" should have text "$77,012"'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('$77,012');

        // When I open context menu for "metric" "New Metric" in "metrics" dropzone from the Editor Panel in Report Editor
        await reportEditorPanel.openObjectContextMenu('metrics', 'metric', 'New Metric');

        // And I click context menu item "Edit..." in Editor Panel
        await reportEditorPanel.clickContextMenuItem('Edit...');
        // When I click on the Switch to "Formula" Editor button of DM Editor
        await reportDerivedMetricEditor.switchToFormulaMode();

        // And I set the Metric Name value to "Test"
        await reportDerivedMetricEditor.setMetricName('Test');

        // And I click on the "Save" button of DM Editor
        await reportDerivedMetricEditor.saveFormulaMetric();
        // And I will see object "Test" in In Report tab in Report Editor
        await since(
            'After set the Metric Name value to "Test" and click on the "Save" button of DM Editor, The object "Test" should be in the In Report tab, instead we have #{actual}'
        )
            .expect(await reportDatasetPanel.getObjectInReportTab('Test').isDisplayed())
            .toBe(true);

        // And I will not see object "New Metric" in In Report tab in Report Editor
        await since(
            'After set the Metric Name value to "Test" and click on the "Save" button of DM Editor, The object "New Metric" should not be in the In Report tab, instead we have #{actual}'
        )
            .expect(await reportDatasetPanel.getObjectInReportTab('New Metric').isDisplayed())
            .toBe(false);

        // And "metric" object "Test" should be added to "Metrics" dropzone in Editor Panel
        await since(
            'After set the Metric Name value to "Test" and click on the "Save" button of DM Editor, "metric" object "Test" should be added to "Metrics" dropzone in Editor Panel'
        )
            .expect(await reportEditorPanel.getObjectInDropzone('Metrics', 'metric', 'Test').isDisplayed())
            .toBe(true);

        // And the grid cell at "0", "0" has text "Year"
        await since(
            'After set the Metric Name value to "Test" and click on the "Save" button of DM Editor, The grid cell at "0", "0" should have text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "1", "0" has text "2014"
        await since(
            'After set the Metric Name value to "Test" and click on the "Save" button of DM Editor, The grid cell at "1", "0" should have text "2014", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2014');

        // And the grid cell at "1", "1" has text "Central"
        await since(
            'After set the Metric Name value to "Test" and click on the "Save" button of DM Editor, The grid cell at "1", "1" should have text "Central", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Central');

        // And the grid cell at "1", "2" has text "Books"
        await since(
            'After set the Metric Name value to "Test" and click on the "Save" button of DM Editor, The grid cell at "1", "2" should have text "Books", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Books');

        // And the grid cell at "0", "3" has text "Cost"
        await since(
            'After set the Metric Name value to "Test" and click on the "Save" button of DM Editor, The grid cell at "0", "3" should have text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');

        // And the grid cell at "1", "3" has text "$77,012"
        await since(
            'After set the Metric Name value to "Test" and click on the "Save" button of DM Editor, The grid cell at "1", "3" should have text "$77,012", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$77,012');

        // And the grid cell at "0", "4" has text "Test"
        await since(
            'After set the Metric Name value to "Test" and click on the "Save" button of DM Editor, The grid cell at "0", "4" should have text "Test", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Test');

        // And the grid cell at "1", "4" has text "$77,012"
        await since(
            'After set the Metric Name value to "Test" and click on the "Save" button of DM Editor, The grid cell at "1", "4" should have text "$77,012", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('$77,012');

        // When I open context menu for "metric" "Test" in "metrics" dropzone from the Editor Panel in Report Editor
        await reportEditorPanel.openObjectContextMenu('metrics', 'metric', 'Test');

        // And I click context menu item "Edit..." in Editor Panel
        await reportEditorPanel.clickContextMenuItem('Edit...');

        // When I click on the "Functions Selection" dropdown of DM Editor
        await reportDerivedMetricEditor.selectFunctionsSelectionFromDMEditor();

        // When I select the "Avg" function from the Functions Selection list of DM Editor
        await reportDerivedMetricEditor.selectFunctionFromList('Avg');

        // And I click on the "Save" button of DM Editor when the Editor is triggered from "Edit..."
        await reportDerivedMetricEditor.saveMetricEditorOpenFromEdit();

        // And the grid cell at "0", "0" has text "Year"
        await since(
            'After click on the "Save" button of DM Editor when the Editor is triggered from "Edit...", The grid cell at "0", "0" should have text "Year"'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "1", "0" has text "2014"
        await since(
            'After click on the "Save" button of DM Editor when the Editor is triggered from "Edit...", The grid cell at "1", "0" should have text "2014"'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2014');

        // And the grid cell at "1", "1" has text "Central"
        await since(
            'After click on the "Save" button of DM Editor when the Editor is triggered from "Edit...", The grid cell at "1", "1" should have text "Central"'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Central');

        // And the grid cell at "1", "2" has text "Books"
        await since(
            'After click on the "Save" button of DM Editor when the Editor is triggered from "Edit...", The grid cell at "1", "2" should have text "Books"'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Books');

        // And the grid cell at "0", "3" has text "Cost"
        await since(
            'After click on the "Save" button of DM Editor when the Editor is triggered from "Edit...", The grid cell at "0", "3" should have text "Cost"'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');

        // And the grid cell at "1", "3" has text "$77,012"
        await since(
            'After click on the "Save" button of DM Editor when the Editor is triggered from "Edit...", The grid cell at "1", "3" should have text "$77,012"'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$77,012');

        // And the grid cell at "0", "4" has text "Test"
        await since(
            'After click on the "Save" button of DM Editor when the Editor is triggered from "Edit...", The grid cell at "0", "4" should have text "Test"'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Test');

        // And the grid cell at "1", "4" has text "$6,418"
        await since(
            'After click on the "Save" button of DM Editor when the Editor is triggered from "Edit...", The grid cell at "1", "4" should have text "$6,418"'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('$6,418');

        // When I open the object "Profit" context menu from Object Panel in Report Editor
        await reportDatasetPanel.openObjectContextMenu('Profit');

        // And I select the submenu "Create Metric..." from open menu in Report Editor
        await reportDatasetPanel.clickObjectContextSubmenuItem('Create Metric...');

        // And I click on the Switch to "Formula" Editor button of DM Editor
        await reportDerivedMetricEditor.switchMode('Formula');

        // And I set the Metric Name value to "New Profit"
        await reportDerivedMetricEditor.setMetricName('New Profit');

        // And I click on the "Save" button of DM Editor
        await reportDerivedMetricEditor.saveMetric();

        // And I will see object "New Profit" in In Report tab in Report Editor
        await since('After set Metric Name New Profit, Object "New Profit" should be visible in In Report tab')
            .expect(await reportDatasetPanel.getObjectInReportTab('New Profit').isDisplayed())
            .toBe(true);

        // And "metric" object "New Profit" should be added to "Metrics" dropzone in Editor Panel
        await since(
            'After set Metric Name New Profit, "metric" object "New Profit" should be added to "Metrics" dropzone'
        )
            .expect(await reportEditorPanel.getObjectInDropzone('Metrics', 'metric', 'New Profit').isDisplayed())
            .toBe(true);

        // And the grid cell at "0", "0" has text "Year"
        await since('After set Metric Name New Profit, The grid cell at "0", "0" should have text "Year"')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // And the grid cell at "1", "0" has text "2014"
        await since('After set Metric Name New Profit, The grid cell at "1", "0" should have text "2014"')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2014');

        // And the grid cell at "1", "1" has text "Central"
        await since('After set Metric Name New Profit, The grid cell at "1", "1" should have text "Central"')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Central');

        // And the grid cell at "1", "2" has text "Books"
        await since('After set Metric Name New Profit, The grid cell at "1", "2" should have text "Books"')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Books');

        // And the grid cell at "0", "3" has text "Cost"
        await since('After set Metric Name New Profit, The grid cell at "0", "3" should have text "Cost"')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');

        // And the grid cell at "1", "3" has text "$77,012"
        await since('After set Metric Name New Profit, The grid cell at "1", "3" should have text "$77,012"')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$77,012');

        // And the grid cell at "0", "4" has text "Test"
        await since('After set Metric Name New Profit, The grid cell at "0", "4" should have text "Test"')
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Test');

        // And the grid cell at "1", "4" has text "$6,418"
        await since('After set Metric Name New Profit, The grid cell at "1", "4" should have text "$6,418"')
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('$6,418');

        // And the grid cell at "0", "5" has text "New Profit"
        await since('After set Metric Name New Profit, The grid cell at "0", "5" should have text "New Profit"')
            .expect(await reportGridView.getGridCellTextByPos(0, 5))
            .toBe('New Profit');

        // And the grid cell at "1", "5" has text "$21,190"
        await since('After set Metric Name New Profit, The grid cell at "1", "5" should have text "$21,190"')
            .expect(await reportGridView.getGridCellTextByPos(1, 5))
            .toBe('$21,190');
    });
});
