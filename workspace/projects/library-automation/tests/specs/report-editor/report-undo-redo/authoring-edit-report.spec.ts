/**
 * Migrated from WDIO: Report_undoredo_authoringEditReport.spec.js
 * Phase 1 AST-based conversion. Uses thresholdEditor, reportSubtotalsEditor, baseContainer, reportContextualLinkingDialog.
 */
import { test, expect, reportUndoRedoData } from '../../../fixtures';

test.describe('Report Editor Undo/Redo Functionality In Authoring Mode By Editing Existing Report', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test('[TC97485_10] FUN | Report Editor | Undo/Redo adding objects in Report Authoring in Paused mode', async ({
    libraryPage,
    reportEditorPanel,
    reportDatasetPanel,
    reportToolbar,
  }) => {
    const d = reportUndoRedoData.dossiers.LinkForCost;
    await libraryPage.editReportByUrl({ dossierId: d.id, projectId: d.projectId });

    expect(await reportToolbar.isUndoDisabled(true), 'Undo should be disabled initially').toBe(true);
    expect(await reportToolbar.isRedoDisabled(true), 'Redo should be disabled initially').toBe(true);

    await reportEditorPanel.removeAttributeInRowsDropZone('Region');
    expect(await reportToolbar.isUndoEnabled(true), 'Undo should be enabled after remove Region').toBe(true);

    await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Time']);
    await reportDatasetPanel.addObjectToRows('Year');
    const buttonDisabled1 =
      (await reportToolbar.isUndoDisabled(true)) && (await reportToolbar.isRedoDisabled(true));
    expect(buttonDisabled1, 'Undo/redo disabled after add Year').toBe(true);

    await reportDatasetPanel.addObjectToRows('Region');
    expect(await reportToolbar.isUndoEnabled(true), 'Undo enabled after add Region').toBe(true);

    await reportToolbar.clickUndo(true);
    expect(await reportEditorPanel.getRowsObjects(), 'Undo removes Region').not.toContain('Region');

    await reportToolbar.clickRedo(true);
    expect(await reportEditorPanel.getRowsObjects(), 'Redo adds Region').toContain('Region');

    await reportDatasetPanel.dndFromObjectBrowserToGrid('Quarter');
    const buttonDisabled2 =
      (await reportToolbar.isUndoDisabled(true)) && (await reportToolbar.isRedoDisabled(true));
    expect(buttonDisabled2, 'Undo/redo enabled after dnd Quarter').toBe(false);

    await reportEditorPanel.removeAttributeInRowsDropZone('Year');
    await reportToolbar.clickUndo(true);
    expect(await reportEditorPanel.getRowsObjects(), 'Undo restores Year').toContain('Year');

    await reportToolbar.clickRedo(true);
    expect(await reportEditorPanel.getRowsObjects(), 'Redo removes Year').not.toContain('Year');
  });
});
