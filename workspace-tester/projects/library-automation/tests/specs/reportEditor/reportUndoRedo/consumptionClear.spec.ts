/**
 * Migrated from WDIO: Report_undoredo_consumptionClear.spec.js
 */
import { test, expect, reportUndoRedoData } from '../../../fixtures';
import { resetReportState } from '../../../api/resetReportState';
import { getReportEnv } from '../../../config/env';

test.describe('Report Editor Undo/Redo Functionality In Consumption Mode With Clear Stack', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test('[TC97485_04] FUN | Report Editor | Undo/Redo stack should be cleared after linking and back', async ({
    libraryPage,
    reportGridView,
    reportToolbar,
  }) => {
    const env = getReportEnv();
    await resetReportState({
      credentials: {
        username: env.reportTestUser || reportUndoRedoData.undoUser.username,
        password: env.reportTestPassword ?? reportUndoRedoData.undoUser.password,
      },
      report: { id: reportUndoRedoData.dossiers.LinkForCost.id, project: { id: reportUndoRedoData.dossiers.LinkForCost.projectId } },
    });
    const d = reportUndoRedoData.dossiers.LinkForCost;
    await libraryPage.openReportByUrl({ projectId: d.projectId, documentId: d.id });

    await reportGridView.sortAscendingBySortIcon('Profit');
    await reportGridView.clickGridColumnHeader('Cost');
    await reportGridView.sortDescendingBySortIcon('Cost');

    await reportToolbar.clickUndo();
    expect(await reportGridView.getGridCellTextByPos(1, 1), 'Sort cleared').toBe('$2,070,816');

    await reportToolbar.clickRedo();
    expect(await reportGridView.getGridCellTextByPos(1, 1), 'Sort descending').toBe('$20,101,700');

    await reportToolbar.clickBack();
    expect(await reportToolbar.isUndoDisabled(), 'Undo disabled after back').toBe(true);
    expect(await reportToolbar.isRedoDisabled(), 'Redo disabled after back').toBe(true);

    await reportGridView.clearSortBySortIcon('Profit');
    expect(await reportToolbar.isUndoEnabled(), 'Undo enabled after clear sort').toBe(true);
  });
});
