import * as reportConstants from '../../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';

describe('Report Editor Undo/Redo Functionality In Authoring Mode By Editing Existing Report', () => {
    let {
        libraryPage,
        reportEditorPanel,
        reportGridView,
        reportDatasetPanel,
        reportToolbar,
        loginPage,
        thresholdEditor,
        reportSubtotalsEditor,
        baseContainer,
        reportPromptEditor,
        reportPageBy,
        reportContextualLinkingDialog,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(reportConstants.undoUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC97485_10] FUN | Report Editor | Undo/Redo adding objects in Report Authoring in Paused mode', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.LinkForCost.id,
            projectId: reportConstants.LinkForCost.project.id,
        });

        // Check initial state - Undo/Redo should be disabled
        await since('Undo button should be disabled initially, instead we have #{actual}')
            .expect(await reportToolbar.isUndoDisabled(true))
            .toBe(true);
        await since('Redo button should be disabled initially, instead we have #{actual}')
            .expect(await reportToolbar.isRedoDisabled(true))
            .toBe(true);

        // ACTION 1 Remove Region from Rows - undo should be enabled
        await reportEditorPanel.removeAttributeInRowsDropZone('Region');
        await since('After remove Region from Rows, the undo button should be enabled, instead we have #{actual}')
            .expect(await reportToolbar.isUndoEnabled(true))
            .toBe(true);

        // ACTION 2 Add Year from object browser to Report Objects
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Time']);
        await reportDatasetPanel.addObjectToRows('Year');

        // Check undo / redo button should be disabled
        const buttonDisabled1 =
            (await reportToolbar.isUndoDisabled(true)) && (await reportToolbar.isRedoDisabled(true));
        await since('After add Year to Rows, the undo/redo button should be disabled, instead we have #{actual}')
            .expect(buttonDisabled1)
            .toBe(true);

        // await reportDatasetPanel.switchToInReportTab();
        // ACTION 3 Add Region to Rows from Report tab
        await reportDatasetPanel.addObjectToRows('Region');

        // Check undo / redo button should be enable
        await since(
            'After add Region to Rows in Report tab, the undo button should be enabled, instead we have #{actual}'
        )
            .expect(await reportToolbar.isUndoEnabled(true))
            .toBe(true);

        await reportToolbar.clickUndo(true);
        await since('After click undo, the Region should be removed from Rows, instead we have #{actual}')
            .expect(await reportEditorPanel.getRowsObjects())
            .not.toContain('Region');

        await reportToolbar.clickRedo(true);
        await since('After click redo, the Region should be added back to Rows, instead we have #{actual}')
            .expect(await reportEditorPanel.getRowsObjects())
            .toContain('Region');

        // ACTION DND Quarter To Grid Container
        // await reportDatasetPanel.switchToAllTab();
        await reportDatasetPanel.dndFromObjectBrowserToGrid('Quarter');

        const buttonDisabled2 =
            (await reportToolbar.isUndoDisabled(true)) && (await reportToolbar.isRedoDisabled(true));

        await since(
            'After dnd Quarter from All tab to Grid container, the undo/redo button should be enabled, instead we have #{actual}'
        )
            .expect(buttonDisabled2)
            .toBe(false);

        // await reportDatasetPanel.switchToInReportTab();
        // await reportDatasetPanel.dndFromObjectBrowserToGrid('Year');
        await reportEditorPanel.removeAttributeInRowsDropZone('Year');

        await since(
            'After dnd Year from Report Panel to Grid container, the undo/redo button should be disabled, instead we have #{actual}'
        )
            .expect(await reportToolbar.isUndoEnabled(true))
            .toBe(true);

        await reportToolbar.clickUndo(true);
        await since('After click undo, the Year should be removed from Rows dropzone, instead we have #{actual}')
            .expect(await reportEditorPanel.getRowsObjects())
            .toContain('Year');

        await reportToolbar.clickRedo(true);
        await since('After click redo, the Year should be added back to Rows dropzone, instead we have #{actual}')
            .expect(await reportEditorPanel.getRowsObjects())
            .not.toContain('Year');
    });

    it('[TC97485_11] FUN | Report Editor | Undo/Redo In Report Tab', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.SimpleReport.id,
            projectId: reportConstants.SimpleReport.project.id,
        });

        // Ensure the report is in design mode
        await reportToolbar.switchToDesignMode();
        // Check initial state - Undo/Redo should be disabled
        await since('After switch to design mode, Undo button should be disabled, instead we have #{actual}')
            .expect(await reportToolbar.isUndoDisabled(true))
            .toBe(true);
        await since('After switch to design mode, Redo button should be disabled, instead we have #{actual}')
            .expect(await reportToolbar.isRedoDisabled(true))
            .toBe(true);

        // switch to report tab
        // await reportDatasetPanel.switchToInReportTab();

        // rename Year to YearUpdated
        await reportDatasetPanel.renameObjectInReportTab('Year', 'YearUpdated');

        // // remove Profit from Report
        // await reportDatasetPanel.removeItemInReportTab('Profit');

        // dnd YearUpdated to Page By
        await reportEditorPanel.dndAttributeFromRowsToPageBy('YearUpdated');

        // undo move YearUpdated to Page By
        await reportToolbar.clickUndo(true);
        await since('Undo 1, YearUpdated should be added back to Report, instead we have #{actual}')
            .expect(await reportEditorPanel.getRowsObjects())
            .toContain('YearUpdated');
        await since('Undo 1, YearUpdated should be removed from Page By, instead we have #{actual}')
            .expect(await reportEditorPanel.getPageByObjects())
            .not.toContain('YearUpdated');

        // // undo remove Profit from Report
        // await reportToolbar.clickUndo(true);
        // await since('Undo 2, Profit should be added back to Report, instead we have #{actual}')
        //     .expect(await reportEditorPanel.getMetricsObjects())
        //     .toContain('Profit');

        // undo rename YearUpdated to Year
        await reportToolbar.clickUndo(true);
        await since('Undo 3, YearUpdated should be renamed back to Year, instead we have #{actual}')
            .expect(await reportEditorPanel.getRowsObjects())
            .toContain('Year');

        // redoe rename Year to YearUpdated
        await reportToolbar.clickRedo(true);
        await since('Redo 1, YearUpdated should be renamed back to Year, instead we have #{actual}')
            .expect(await reportEditorPanel.getRowsObjects())
            .toContain('YearUpdated');

        // // redo remove Profit from Report
        // await reportToolbar.clickRedo(true);
        // await since('Redo 2, Profit should be removed from Report, instead we have #{actual}')
        //     .expect(await reportEditorPanel.getMetricsObjects())
        //     .not.toContain('Profit');
        // redo move YearUpdated to Page By
        await reportToolbar.clickRedo(true);
        await since('Redo 3, YearUpdated should be moved back to Page By, instead we have #{actual}')
            .expect(await reportEditorPanel.getPageByObjects())
            .toContain('YearUpdated');
    });

    it('[TC97485_12] FUN | Report Editor | Undo/Redo In Report Editor Panel', async () => {
        // Open a report with prompts
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ReportThreshold2.id,
            projectId: reportConstants.ReportThreshold2.project.id,
        });

        // Complete the prompts if needed
        // This would depend on the specific prompt types

        // Ensure the report is in design mode
        await reportToolbar.switchToDesignMode();

        // Action 1: Clear threshold
        await reportEditorPanel.clearThresholdForMetricInMetricsDropZone('Revenue');

        // Action 2: update threshold for Revenue
        await reportEditorPanel.openThresholdInDropZoneForMetric('Revenue');
        await thresholdEditor.switchSimpleThresholdsTypeI18N('Image-based');
        await thresholdEditor.openSimpleThresholdImageBandDropDownMenu();
        await thresholdEditor.selectSimpleThresholdImageBand('Rounded Push Pin');
        await thresholdEditor.selectSimpleThresholdBasedOnObject('Revenue');
        await thresholdEditor.selectSimpleThresholdBasedOnOption('Lowest');
        await thresholdEditor.saveAndCloseSimThresholdEditor();
        // Action 3: remove Tren
        await baseContainer.clickContainerByScript('Visualization 1');
        // When I remove object "Trend" from grid view in Report Editor
        await reportGridView.openGridColumnHeaderContextMenu('Trend');
        await reportGridView.clickContextMenuOption('Remove');

        // Action 4: update threshold for Last Year's Revenue
        await reportEditorPanel.openObjectContextMenuByIndex('Metrics', 2);
        await reportDatasetPanel.clickObjectContextMenuItem('Edit Thresholds...');

        // When I switch from advanced threshold editor to simple threshold editor and clear the thresholds in Report Editor
        await reportEditorPanel.switchAdvToSimThresholdWithClear();

        // When I switch from simple threshold editor to advanced threshold editor and apply the thresholds in threshold editor
        await thresholdEditor.switchSimToAdvThresholdWithApply();

        // And I save and close Advanced Thresholds Editor
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();

        // Action 5: create shortcut metric for Revenue
        await reportEditorPanel.createRankForMetricInMetricsDropZone('Revenue');

        // Action 6 : Edit Totals for Revenue
        await reportEditorPanel.openMectricContextMenuInMetricsDropzone('Revenue');
        await reportDatasetPanel.clickObjectContextMenuItem('Edit Totals');
        await reportSubtotalsEditor.selectTypeCheckbox('Average');
        await reportSubtotalsEditor.saveAndCloseSubtotalsEditor();

        // UNDO 6: edit totals for revenue
        await reportToolbar.clickUndo(true);
        await since('Undo 6, Average should be removed from grid cell, instead we have #{actual}')
            .expect(await reportGridView.isGridCellDisplayed(0, 6))
            .toBe(false);

        // UNDO 5: create shortcut metric for Revenue
        await reportToolbar.clickUndo(true);
        await since('Undo 5, Shortcut metric should be removed, instead we have #{actual}')
            .expect(await reportEditorPanel.getMetricsObjects())
            .not.toContain('Rank (Revenue) Ascending');

        // UNDO 4: update threshold for Last Year's Revenue (this snould no change since clicking ok button is undoe)
        await reportToolbar.clickUndo(true);
        await since('Undo 4, Threshold should not be removed, instead we have #{actual}')
            .expect(await reportGridView.getGridCellStyleByPos(1, 2, 'background-color'))
            .toBe('rgba(250,102,15,1)');

        // UNDO 4:  update threshold for Last Year's Revenue (rever apply manipulation)
        await reportToolbar.clickUndo(true);
        await since('Undo 4-1, Threshold should be not applied, instead we have #{actual}')
            .expect(await reportGridView.getGridCellStyleByPos(1, 2, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        // UNDO 3: remove Trend
        await reportToolbar.clickUndo(true);
        await since('Undo 3, Trend should be added bacl, instead we have #{actual}')
            .expect(await reportEditorPanel.getMetricsObjects())
            .toContain('Trend');

        // UNDO 2: update threshold for Revenue
        await reportToolbar.clickUndo(true);
        await since('Undo 2, Threshold should be removed, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('$343,320');

        // UNDO 1: clear threshold for Revenue
        await reportToolbar.clickUndo(true);
        await since('Undo 1, Threshold should be added back, instead we have #{actual}')
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'background-color'))
            .toBe('rgba(0,128,0,1)');

        // REDO 1: clear threshold for Revenue
        await reportToolbar.clickRedo(true);
        await since('Redo 1, Threshold should be removed, instead we have #{actual}')
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        // REDO 2: update threshold for Revenue
        await reportToolbar.clickRedo(true);
        await since('Redo 2, Threshold should be applied, instead we have #{actual}')
            .expect(await reportGridView.getGridCellStyleByPos(1, 1, 'background-color'))
            .toBe('rgba(255,255,255,1)');

        // REDO 3: remove Trend
        await reportToolbar.clickRedo(true);
        await since('Redo 3, Trend should be removed, instead we have #{actual}')
            .expect(await reportEditorPanel.getMetricsObjects())
            .not.toContain('Trend');

        // REDO 4: update threshold for Last Year's Revenue
        await reportToolbar.clickRedo(true);
        await since('Redo 4, Threshold should be applied, instead we have #{actual}')
            .expect(await reportGridView.getGridCellStyleByPos(1, 2, 'background-color'))
            .toBe('rgba(250,102,15,1)');
        // REDO 4-1: update threshold for Last Year's Revenue
        await reportToolbar.clickRedo(true);
        await since('Redo 4-1, Threshold should be not applied, instead we have #{actual}')
            .expect(await reportGridView.getGridCellStyleByPos(1, 2, 'background-color'))
            .toBe('rgba(250,102,15,1)');

        // REDO 5: create shortcut metric for Revenue
        await reportToolbar.clickRedo(true);
        await since('Redo 5, Shortcut metric should be created, instead we have #{actual}')
            .expect(await reportEditorPanel.getMetricsObjects())
            .toContain('Rank (Revenue) Ascending');

        // REDO 6: edit totals for revenue
        await reportToolbar.clickRedo(true);
        await since('Redo 6, Average should be added to grid cell, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(6, 0))
            .toBe('Average');
    });

    it('[TC97485_13] FUN | Report Editor | Undo/Redo for contextual link', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TC85614JoinOnMetric.id,
            projectId: reportConstants.TC85614JoinOnMetric.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await reportPromptEditor.clickApplyButtonInReportPromptEditor();

        // Action 1: Create contextual link
        await reportPageBy.openSelectorContextMenu('Customer');
        await reportGridView.clickContextMenuOption('Create Contextual Link');
        await reportContextualLinkingDialog.clickOpenInNewWindowCheckbox();
        await reportContextualLinkingDialog.clickLinkToButton();
        await reportContextualLinkingDialog.selectTargetObject('Supplier Sales Report');
        await reportContextualLinkingDialog.clickDoneButtonInContextualLinkingEditor();

        // Action 2: Show "Metrics" Label
        await reportGridView.showMetricsLabel('Freight');

        // Undo 1: Show "Metrics" Label
        await reportToolbar.clickUndo(true);
        await reportGridView.openGridColumnHeaderContextMenu('Freight');
        // Hide "Metrics" Label should show up in context menu
        await since('Undo 1, Hide "Metrics" Label should show up in context menu, instead we have #{actual}')
            .expect(await reportGridView.contextMenuContainsOption('Show "Metrics" Label'))
            .toBe(true);

        // Undo 2: Create contextual link
        await reportToolbar.clickUndo(true);
        await reportPageBy.openSelectorContextMenu('Customer');
        await since('Undo 2, Contextual link should be removed, instead we have #{actual}')
            .expect(await reportGridView.contextMenuContainsOption('Create Contextual Link'))
            .toBe(true);

        // Redo 1: Create contextual link
        await reportToolbar.clickRedo(true);
        await reportPageBy.openSelectorContextMenu('Customer');
        await since('Redo 1, Contextual link should be created, instead we have #{actual}')
            .expect(await reportGridView.contextMenuContainsOption('Edit Contextual Link'))
            .toBe(true);

        // Redo 2: Show "Metrics" Label
        await reportToolbar.clickRedo(true);
        await reportGridView.openGridColumnHeaderContextMenu('Freight');
        await since('Redo 2, "Metrics" Label should be shown, instead we have #{actual}')
            .expect(await reportGridView.contextMenuContainsOption('Hide "Metrics" Label'))
            .toBe(true);
    });

    it('[TC97485_14] FUN | Report Editor | Undo/Redo for short cut metric', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.LinkForCost.id,
            projectId: reportConstants.LinkForCost.project.id,
        });

        await reportToolbar.switchToDesignMode();

        // Action 1: create shortcut metric for Profit
        await reportEditorPanel.createRankForMetricInMetricsDropZone('Profit');

        // Action 2: Sort on Rank (Profit) Ascending In Grid
        await reportGridView.sortAscendingBySortIcon('Rank (Profit) Ascending');

        // Undo 2: Sort
        await reportToolbar.clickUndo(true);
        const cellDisplayed = await reportGridView.getGridCellByPos(0, 4).isDisplayed();
        await since('Undo 2, Rank (Profit) Ascending should be still in grid, instead we have #{actual}')
            .expect(cellDisplayed)
            .toBe(true);
        if (!cellDisplayed) {
            console.log('cellDisplayed  for grid 0, 4 is false exit remaining test');
            return;
        }
        await since('Undo 2, Rank (Profit) Ascending , grid cell 1, 4 should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('5');

        // Undo 1: create shortcut metric for Profit
        await reportToolbar.clickUndo(true);
        await since('Undo 1, Rank (Profit) Ascending should be removed, instead we have #{actual}')
            .expect(await reportEditorPanel.getMetricsObjects())
            .not.toContain('Rank (Profit) Ascending');

        // Redo 1: create shortcut metric for Profit
        await reportToolbar.clickRedo(true);
        await since('Redo 1, Rank (Profit) Ascending should be added, instead we have #{actual}')
            .expect(await reportEditorPanel.getMetricsObjects())
            .toContain('Rank (Profit) Ascending');

        // Redo 2: Sort
        await reportToolbar.clickRedo(true);
        await since('Redo 2, Rank (Profit) Ascending should be sorted, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('1');
    });
});
