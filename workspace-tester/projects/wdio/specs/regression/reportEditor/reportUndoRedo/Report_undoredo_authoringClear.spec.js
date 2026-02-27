import * as reportConstants from '../../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';

describe('Report Editor Undo/Redo Functionality', () => {
    let {
        libraryPage,
        reportEditorPanel,
        reportPageBy,
        reportGridView,
        reportPromptEditor,
        reportDatasetPanel,
        reportToolbar,
        loginPage,
        reportFilterPanel,
        reportTOC,
        reportAttributeFormsDialog,
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

    it('[TC97485_20] FUN | Report Editor | Undo/Redo for join and prompt', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TC85614JoinOnMetric.id,
            projectId: reportConstants.TC85614JoinOnMetric.project.id,
        });
        // await reportDatasetPanel.switchToInReportTab();
        await reportDatasetPanel.openObjectContextMenu('Freight');
        await reportDatasetPanel.selectSubmenuOption('Join Type|Inner Join', true);
        await reportToolbar.switchToDesignMode(true);
        await reportPromptEditor.clickApplyButtonInReportPromptEditor();

        // update number foramt for Freight
        await reportEditorPanel.changeNumberFormatForMetricInMetricsDropZone('Freight', 'Fixed');
        // update join type for Freight
        await reportDatasetPanel.openObjectContextMenu('Freight');
        await reportDatasetPanel.selectSubmenuOption('Join Type|Outer Join');

        // assert undo/redo is disabled
        await browser.pause(reportConstants.sleepTimeForUndoRedo);
        const buttonDisabled = (await reportToolbar.isUndoDisabled(true)) && (await reportToolbar.isRedoDisabled(true));
        await since('After update join type for Freight, the undo/redo button should be disabled')
            .expect(buttonDisabled)
            .toBe(true);

        // display attribute forms for Customer
        await reportEditorPanel.updateAttributeFormsForAttributeInPageByDropZone(
            'Customer',
            'Show attribute name once'
        );

        // click undo
        await reportToolbar.clickUndo(true);
        await since(
            'After click undo, the attribute form for Customer should be the default form, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Customer'))
            .toBe('Aadland:Warner');

        // click redo
        await reportToolbar.clickRedo(true);
        await since(
            'After click redo, the attribute form for Customer should be the attribute form "Show attribute name once", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Customer Last Name'))
            .toBe('Aadland');

        // click reprompt
        await reportToolbar.rePrompt();
        await reportPromptEditor.clickApplyButtonInReportPromptEditor();

        // undo will be disabled
        await browser.pause(reportConstants.sleepTimeForUndoRedo);
        const buttonDisabled2 =
            (await reportToolbar.isUndoDisabled(true)) && (await reportToolbar.isRedoDisabled(true));
        await since('After reprompt, the undo/redo button should be disabled, instead we have #{actual}')
            .expect(buttonDisabled2)
            .toBe(true);

        // remove pageby
        await reportPageBy.removePageBy('Customer Last Name');

        // click undo
        await reportToolbar.clickUndo(true);
        await since('After click undo, the pageby should be removed, instead we have #{actual}')
            .expect(await reportPageBy.getPageBySelectorText('Customer Last Name'))
            .toBe('Aadland');

        // click redo
        await reportToolbar.clickRedo(true);
        const pageByObjects = await reportEditorPanel.getPageByObjects();
        await since('After click redo, the pageby should be removed, instead we have #{actual}')
            .expect(pageByObjects.length)
            .toBe(0);
    });

    it('[TC97485_21] FUN | Report Editor | Undo/Redo update filter', async () => {
        // A76E6DE3424C48AD871CD3A0FE2C5986
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ObjectsPanelTest.id,
            projectId: reportConstants.ObjectsPanelTest.project.id,
        });
        //  # add Category to filter for hierarchy to be able to execute report
        // await reportDatasetPanel.switchToInReportTab();
        // await reportDatasetPanel.addObjectToRows('Category');
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.selectItemInObjectList('Category');
        // And I drag the object named "Category" from object list to "report filter"
        await reportDatasetPanel.dndFromObjectBrowserToReportFilter('Category');
        await reportFilterPanel.selectElements(['Books', 'Electronics']);
        await reportFilterPanel.saveAndCloseQualificationEditor(false);
        await browser.pause(reportConstants.sleepTimeForUndoRedo);

        await since('After add Category to filter in design mode, the undo button should be disabled')
            .expect(await reportToolbar.isUndoDisabled(true))
            .toBe(true);
        await reportTOC.switchToEditorPanel();
        await reportEditorPanel.removeAttributeInRowsDropZone('Subcategory');

        // click undo
        await reportToolbar.clickUndo(true);
        await since('After click undo, the Subcategory should be retained, instead we have #{actual}')
            .expect(await reportEditorPanel.getRowsObjects())
            .toContain('Subcategory');

        // click redo
        await reportToolbar.clickRedo(true);
        await since('After click redo, the Subcategory should be removed, instead we have #{actual}')
            .expect(await reportEditorPanel.getRowsObjects())
            .not.toContain('Subcategory');

        await reportToolbar.switchToDesignMode();
        // undo will be disabled
        await since('After switch to design mode, the undo/redo button should be disabled, instead we have #{actual}')
            .expect(await reportToolbar.isUndoDisabled(true))
            .toBe(true);

        // await reportToolbar.reExecute();
        // await since('After re-execute, the undo button should be enabled, instead we have #{actual}')
        //     .expect(await reportToolbar.isUndoEnabled(true))
        //     .toBe(true);

        await reportEditorPanel.dndMetricsFromColumnsToRows();
        // click undo
        await reportToolbar.clickUndo(true);
        await since('After click undo, the Metric Names should be in columns, instead we have #{actual}')
            .expect(await reportEditorPanel.getColumnsObjects())
            .toContain('Metric Names');
        // undo will be disabled
        await since('After click undo once, the undo/redo button should be disabled, instead we have #{actual}')
            .expect(await reportToolbar.isUndoDisabled(true))
            .toBe(true);
        // click redo
        await reportToolbar.clickRedo(true);
        await since('After click redo, the Metrics should not be in columns, instead we have #{actual}')
            .expect(await reportEditorPanel.getColumnsObjects())
            .not.toContain('Metric Names');
        await since('After click redo, the Metric Names should be in rows, instead we have #{actual}')
            .expect(await reportEditorPanel.getRowsObjects())
            .toContain('Metric Names');

        await reportTOC.switchToFilterPanel();
        await reportFilterPanel.removeAllFilter();

        // undo is disabled
        await browser.pause(reportConstants.sleepTimeForUndoRedo);
        await since('After remove all filter, the undo/redo button should be disabled, instead we have #{actual}')
            .expect(await reportToolbar.isUndoDisabled(true))
            .toBe(true);
        //  reorder objects within grid
        await reportGridView.removeObject('Year');

        // click undo
        await reportToolbar.clickUndo(true);
        await since('After click undo, the Year should be back, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // undo will be disabled
        await since('After click undo, the undo/redo button should be disabled, instead we have #{actual}')
            .expect(await reportToolbar.isUndoDisabled(true))
            .toBe(true);

        // click redo
        await reportToolbar.clickRedo(true);
        await since('After click redo, the Year should be removed, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Category');
    });

    it('[TC97485_22] FUN | Report Editor | add to / remove from report', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ObjectsPanelTest.id,
            projectId: reportConstants.ObjectsPanelTest.project.id,
        });

        // 1. remove region from rows
        await reportEditorPanel.removeAttributeInRowsDropZone('Year');

        // 2. add Country to rows
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Geography']);
        await reportDatasetPanel.addObjectToRows('Country');

        const buttonDisabled = (await reportToolbar.isUndoDisabled(true)) && (await reportToolbar.isRedoDisabled(true));

        // assert undo is disabled
        await since('After add Country to rows, the undo button should be disabled, instead we have #{actual}')
            .expect(buttonDisabled)
            .toBe(true);

        await reportToolbar.switchToDesignMode();
        // await reportDatasetPanel.switchToInReportTab();

        // 3 add Region to rows
        await reportDatasetPanel.addObjectToRows('Category');

        // UNDO 1 add Region to rows
        await reportToolbar.clickUndo(true);
        await since('After click undo, the Region should not show up in Rows dropzone, instead we have #{actual}')
            .expect(await reportEditorPanel.getRowsObjects())
            .not.toContain('Category');

        /// REDO 1 add Region to rows
        await reportToolbar.clickRedo(true);
        await since('After click redo, the Region should show up in Rows dropzone, instead we have #{actual}')
            .expect(await reportEditorPanel.getRowsObjects())
            .toContain('Category');

        // remove Country from report
        await reportDatasetPanel.removeItemInReportTab('Country');

        // the undo and redo button should be disabled
        const buttonDisabled2 =
            (await reportToolbar.isUndoDisabled(true)) && (await reportToolbar.isRedoDisabled(true));
        await since(
            'After remove Country from report, the undo/redo button should be disabled, instead we have #{actual}'
        )
            .expect(buttonDisabled2)
            .toBe(true);

        // 4 add Profit from dataset panel to columns dropzone
        await reportDatasetPanel.addObjectToColumns('Profit');

        // UNDO 2 add Profit to columns
        await reportToolbar.clickUndo(true);
        await since('After click undo, the Profit should not show up in Metrics dropzone, instead we have #{actual}')
            .expect(await reportEditorPanel.getMetricsObjects())
            .not.toContain('Profit');

        /// REDO 2 add Profit to columns
        await reportToolbar.clickRedo(true);
        await since('After click redo, the Profit should show up in Metrics dropzone, instead we have #{actual}')
            .expect(await reportEditorPanel.getMetricsObjects())
            .toContain('Profit');

        // await reportDatasetPanel.switchToAllTab();

        // 5. add Country to Report Objects
        await reportDatasetPanel.addObjectToReport('Country');

        const buttonDisabled3 =
            (await reportToolbar.isUndoDisabled(true)) && (await reportToolbar.isRedoDisabled(true));
        await since(
            'After add Country to Report Objects, the undo/redo button should be disabled, instead we have #{actual}'
        )
            .expect(buttonDisabled3)
            .toBe(true);

        // await reportDatasetPanel.switchToInReportTab();

        // 6. add Country to Page-by
        await reportDatasetPanel.addObjectToPageBy('Country');

        // 7. remove Page-by
        await reportPageBy.removePageBy('Country');

        // UNDO 3 remove Page-by
        await reportToolbar.clickUndo(true);
        await since('After click undo, the Country should show up in Page-by dropzone, instead we have #{actual}')
            .expect(await reportEditorPanel.getPageByObjects())
            .toContain('Country');

        /// UNDO 4 add Country to Page-by
        await reportToolbar.clickUndo(true);
        await since('After click undo, the Country should not show up in Page-by dropzone, instead we have #{actual}')
            .expect(await reportEditorPanel.getPageByObjects())
            .not.toContain('Country');

        // REDO 3 add Country to Page-by
        await reportToolbar.clickRedo(true);
        await since('After click redo, the Country should show up in Page-by dropzone, instead we have #{actual}')
            .expect(await reportEditorPanel.getPageByObjects())
            .toContain('Country');

        // REDO 4 remove Page-by
        await reportToolbar.clickRedo(true);
        await since('After click redo, the Page-by should be removed from Page-by dropzone, instead we have #{actual}')
            .expect(await reportEditorPanel.getPageByObjects())
            .not.toContain('Country');
    });

    it('[TC97485_23] FUN | Report Editor | display attribute forms', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ObjectsPanelTest.id,
            projectId: reportConstants.ObjectsPanelTest.project.id,
        });

        await reportToolbar.switchToDesignMode();

        // 1. add Subcategory to Page-by
        await reportEditorPanel.dndAttributeFromRowsToPageBy('Subcategory');

        // 2. display attribute forms for Subcategory
        await reportPageBy.openDisplayAttributeFormsDialog('Subcategory');
        await reportAttributeFormsDialog.enableDisplayAttributeForms(['ID', 'DESC']);

        const buttonDisabled = (await reportToolbar.isUndoDisabled(true)) && (await reportToolbar.isRedoDisabled(true));
        await since(
            'After update display attribute forms to show ID for Region, the undo/redo button should be disabled, instead we have #{actual}'
        )
            .expect(buttonDisabled)
            .toBe(true);

        // 3. update show attribute form name to On
        await reportPageBy.openDisplayAttributeFormsDialog('Subcategory');
        await reportAttributeFormsDialog.selectDisplayAttributeFormMode('On', true);

        // UNDO 1 update show attribute form name to On
        await reportToolbar.clickUndo(true);
        await since('After click undo, the show attribute form name should be ID for Region, instead we have #{actual}')
            .expect(await reportPageBy.getSelectorNameByIdx(1))
            .toBe('Subcategory');

        // REDO 1 update show attribute form name to On
        await reportToolbar.clickRedo(true);
        await since('After click redo, the show attribute form name should be ID for Region, instead we have #{actual}')
            .expect(await reportPageBy.getSelectorNameByIdx(1))
            .toBe('Subcategory ID');

        // 4. update display attribute form to use default list of forms
        await reportPageBy.openDisplayAttributeFormsDialog('Subcategory ID');
        await reportAttributeFormsDialog.clickDefaultFormCheckBox();
        await reportAttributeFormsDialog.saveAndCloseAttributeFormsDialog();

        const buttonDisabled2 =
            (await reportToolbar.isUndoDisabled(true)) && (await reportToolbar.isRedoDisabled(true));
        await since(
            'After update display attribute form to use default list of forms, the undo/redo button should be disabled, instead we have #{actual}'
        )
            .expect(buttonDisabled2)
            .toBe(true);
        // 5. remove Subcategory from Page-by
        await reportPageBy.removePageBy('Subcategory DESC');

        // UNDO 2 remove Subcategory from Page-by
        await reportToolbar.clickUndo(true);
        await since('After click undo, the Region should show up in Page-by dropzone, instead we have #{actual}')
            .expect(await reportEditorPanel.getPageByObjects())
            .toContain('Subcategory');

        // REDO 2 remove Subcategory from Page-by
        await reportToolbar.clickRedo(true);
        await since('After click redo, the Region should be removed from Page-by dropzone, instead we have #{actual}')
            .expect(await reportEditorPanel.getPageByObjects())
            .not.toContain('Subcategory');
    });

    it('[TC97485_24] FUN | Report Editor | re-execute', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.LinkForCost.id,
            projectId: reportConstants.LinkForCost.project.id,
        });

        await reportToolbar.switchToDesignMode();

        await reportEditorPanel.dndMetricsFromColumnsToRows();

        await reportToolbar.reExecute();

        const buttonDisabled = (await reportToolbar.isUndoDisabled(true)) && (await reportToolbar.isRedoDisabled(true));
        await since('After re-execute, the undo/redo button should be disabled, instead we have #{actual}')
            .expect(buttonDisabled)
            .toBe(true);

        await reportEditorPanel.dndMetricFromRowsToColumns();

        await reportToolbar.clickUndo(true);
        await since('After click undo, the Metric Names should be in columns, instead we have #{actual}')
            .expect(await reportEditorPanel.getRowsObjects())
            .toContain('Metric Names');

        await reportToolbar.clickRedo(true);
        await since('After click redo, the Metric Names should be in rows, instead we have #{actual}')
            .expect(await reportEditorPanel.getColumnsObjects())
            .toContain('Metric Names');
    });
});
