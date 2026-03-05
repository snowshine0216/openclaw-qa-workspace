/**
 * Migrated from WDIO: Report_undoredo_authoringNewReport.spec.js
 * Phase 1 AST-based conversion. Uses newFormatPanelForGrid, reportFormatPanel, reportTOC.
 */
import { test, expect, reportUndoRedoData } from '../../../fixtures';

test.describe('Report Editor Undo/Redo Functionality In Authoring Mode By Creating New Report', () => {
  test.beforeEach(async ({ libraryPage, reportToolbar }) => {
    const d = reportUndoRedoData.dossiers.FormattingUndoTest;
    await libraryPage.editReportByUrl({ dossierId: d.id, projectId: d.projectId });
    await reportToolbar.switchToDesignMode();
  });

  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test('[TC97485_17] FUN | Report Editor | Undo/Redo in Format Panel 1', async ({
    reportTOC,
    newFormatPanelForGrid,
    reportFormatPanel,
    reportGridView,
    reportToolbar,
  }) => {
    const columnWithInitialWidth = await reportGridView.getGridCellStyleByPos(0, 1, 'width');
    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.expandTemplateSection();
    await newFormatPanelForGrid.selectGridTemplateStyle('classic');
    await newFormatPanelForGrid.selectGridTemplateColor('Blue');
    await reportToolbar.clickRedo(true);
    await reportToolbar.clickRedo(true);
  });
});
