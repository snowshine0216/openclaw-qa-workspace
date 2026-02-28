/**
 * Migrated from WDIO: Report_undoredo_consumption.spec.js
 */
import { test, expect, reportUndoRedoData } from '../../../fixtures';
import { resetReportState } from '../../../api/resetReportState';
import { getReportEnv } from '../../../config/env';

test.describe('Report Editor Undo/Redo Functionality In Consumption Mode', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test('[TC97485_01] FUN | Report Editor | Undo/Redo for page by manipulation in Report Consumption', async ({
    libraryPage,
    reportPageBy,
    reportGridView,
    reportToolbar,
  }) => {
    const env = getReportEnv();
    await resetReportState({
      credentials: {
        username: env.reportTestUser || reportUndoRedoData.undoUser.username,
        password: env.reportTestPassword ?? reportUndoRedoData.undoUser.password,
      },
      report: { id: reportUndoRedoData.dossiers.threshold.id, project: { id: reportUndoRedoData.dossiers.threshold.projectId } },
    });
    const d = reportUndoRedoData.dossiers.threshold;
    await libraryPage.openReportByUrl({ projectId: d.projectId, documentId: d.id });

    expect(await reportToolbar.isUndoDisabled(), 'Undo button should be disabled initially').toBe(true);
    expect(await reportToolbar.isRedoDisabled(), 'Redo button should be disabled initially').toBe(true);

    await reportGridView.moveGridHeaderToPageBy('Category');
    expect(await reportToolbar.isUndoEnabled(), 'Undo button should be enabled after adding attribute').toBe(true);

    await reportGridView.sortAscending('Subcategory');
    await reportPageBy.changePageByElement('Category', 'Music');

    await reportToolbar.clickUndo();
    expect(await reportPageBy.getPageBySelectorText('Category'), 'UNDO 1st: pageby Books').toBe('Books');

    await reportToolbar.clickUndo();
    expect(await reportGridView.getGridCellTextByPos(2, 0), 'UNDO 2nd: Subcategory not sorted').toBe('Business');

    await reportToolbar.clickUndo();
    expect(await reportGridView.getGridCellTextByPos(0, 0), 'UNDO 3rd: Category in rows').toBe('Category');

    await reportToolbar.clickRedo();
    await reportToolbar.clickRedo();
    await reportToolbar.clickRedo();
    expect(await reportPageBy.getPageBySelectorText('Category'), 'REDO 3rd: pageby Music').toBe('Music');
    expect(await reportToolbar.isRedoDisabled(), 'Redo should be disabled after all redos').toBe(true);
  });
});
