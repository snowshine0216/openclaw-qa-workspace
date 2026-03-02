/**
 * Migrated from WDIO: Report_undoredo_authoringClear.spec.js
 * Phase 1 AST-based conversion. POM methods need implementation (playwright-cli for dnd).
 */
import { test, expect, reportUndoRedoData } from '../../../fixtures';

test.describe('Report Editor Undo/Redo Functionality', () => {
  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test(
    '[TC97485_20] FUN | Report Editor | Undo/Redo for join and prompt',
    { tag: ['@tc97485_20'], timeout: 360000 },
    async ({
      page,
      libraryPage,
      reportEditorPanel,
      reportPageBy,
      reportDatasetPanel,
      reportToolbar,
      reportPromptEditor,
    }) => {
      const d = reportUndoRedoData.dossiers.TC85614JoinOnMetric;
      await libraryPage.editReportByUrl({ dossierId: d.id, projectId: d.projectId });

      await reportDatasetPanel.openObjectContextMenu('Freight');
      await reportDatasetPanel.selectSubmenuOption('Join Type|Inner Join', true);
      await reportToolbar.switchToDesignMode(true);
      await reportPromptEditor.clickApplyButtonInReportPromptEditor();

      await reportEditorPanel.changeNumberFormatForMetricInMetricsDropZone('Freight', 'Fixed');
      await reportDatasetPanel.openObjectContextMenu('Freight');
      await reportDatasetPanel.selectSubmenuOption('Join Type|Outer Join');

      await page.waitForTimeout(reportUndoRedoData.constants.sleepTimeForUndoRedo);
      const buttonDisabled =
        (await reportToolbar.isUndoDisabled(true)) && (await reportToolbar.isRedoDisabled(true));
      expect(buttonDisabled, 'After update join type for Freight, the undo/redo button should be disabled').toBe(true);

      await reportEditorPanel.updateAttributeFormsForAttributeInPageByDropZone('Customer', 'Show attribute name once');
      await reportToolbar.clickUndo(true);
      expect(
        await reportPageBy.getPageBySelectorText('Customer'),
        'After click undo, the attribute form for Customer should be the default form'
      ).toBe('Aadland:Warner');

      await reportToolbar.clickRedo(true);
      expect(
        await reportPageBy.getPageBySelectorText('Customer Last Name'),
        'After click redo, the attribute form for Customer should be "Show attribute name once"'
      ).toBe('Aadland');

      await reportToolbar.rePrompt();
      await reportPromptEditor.clickApplyButtonInReportPromptEditor();
      await page.waitForTimeout(reportUndoRedoData.constants.sleepTimeForUndoRedo);
      const buttonDisabled2 =
        (await reportToolbar.isUndoDisabled(true)) && (await reportToolbar.isRedoDisabled(true));
      expect(buttonDisabled2, 'After reprompt, the undo/redo button should be disabled').toBe(true);

      await reportPageBy.removePageBy('Customer Last Name');
      await reportToolbar.clickUndo(true);
      expect(
        await reportPageBy.getPageBySelectorText('Customer Last Name'),
        'After click undo, the pageby should be removed'
      ).toBe('Aadland');

      await reportToolbar.clickRedo(true);
      const pageByObjects = await reportEditorPanel.getPageByObjects();
      expect(pageByObjects.length, 'After click redo, the pageby should be removed').toBe(0);
    }
  );
});
