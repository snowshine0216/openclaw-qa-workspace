/**
 * Migrated from WDIO: Report_authoring_cancel_execution.spec.js
 * Phase 2j - reportCancel: Cancel report execution in authoring mode.
 */
import { test, expect, reportCancelData } from '../../../fixtures';
import { resetReportState } from '../../../api/resetReportState';
import { getReportEnv } from '../../../config/env';

const { BigReportNoPrompt, BigReportWithPrompt, cancelReportExecutionUser } = reportCancelData;
const libraryTitle = 'Library';

test.describe('Cancel report execution on authoring mode', () => {
  test.beforeEach(async ({ page, libraryPage, loginPage }) => {
    await libraryPage.logout();
    await page.goto('/');
    const env = getReportEnv();
    const user = env.reportCancelUser || cancelReportExecutionUser.username;
    await loginPage.login({
      username: user,
      password: env.reportTestPassword ?? cancelReportExecutionUser.password,
    });
    await page.waitForURL(/Library|Home|Dashboard|app/i, { timeout: 15000 }).catch(() => {});
    await libraryPage.openDefaultApp();
  });

  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test('[TC99428_01] Cancel when resume data', async ({
    libraryPage,
    reportPage,
    reportToolbar,
  }) => {
    await resetReportState({
      credentials: cancelReportExecutionUser,
      report: BigReportNoPrompt,
    });
    await libraryPage.editReportByUrl({
      dossierId: BigReportNoPrompt.id,
      projectId: BigReportNoPrompt.project.id,
    });
    expect(
      await reportPage.isInPauseMode(),
      'Report should be in pause mode'
    ).toBe(true);
    await reportToolbar.actionOnToolbar('resume', { isWait: false });
    await reportPage.clickCancelButtonInTopLoadingBar({ isWait: true });
    expect(
      await reportPage.isInPauseMode(),
      'Report should still be in pause mode after cancel resume'
    ).toBe(true);
  });

  test.skip('[TC99428_02] Cancel when resume data on prompt report before prompt', async () => {
    // Disabled due to instability (WDIO xit)
  });

  test('[TC99428_03] Cancel when resume data on prompt report after apply prompt', async ({
    libraryPage,
    dossierPage,
    reportPage,
    reportToolbar,
    promptEditor,
  }) => {
    await resetReportState({
      credentials: cancelReportExecutionUser,
      report: BigReportWithPrompt,
    });
    await libraryPage.editReportByUrl({
      dossierId: BigReportWithPrompt.id,
      projectId: BigReportWithPrompt.project.id,
    });
    await reportToolbar.switchToDesignMode(true);
    expect(
      await promptEditor.isEditorOpen(),
      'Prompt editor should be open'
    ).toBe(true);
    await promptEditor.runNoWait();
    await dossierPage.clickCancelExecutionButton();
    await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
    expect(
      await promptEditor.isEditorOpen(),
      'Prompt editor should be open after cancel'
    ).toBe(true);
  });

  test('[TC99428_04] Cancel when re-prompt in authoring', async ({
    libraryPage,
    dossierPage,
    reportPage,
    reportToolbar,
    reportGridView,
    promptEditor,
    aePrompt,
  }) => {
    await resetReportState({
      credentials: cancelReportExecutionUser,
      report: BigReportWithPrompt,
    });
    await libraryPage.editReportByUrl({
      dossierId: BigReportWithPrompt.id,
      projectId: BigReportWithPrompt.project.id,
    });
    await reportToolbar.switchToDesignMode(true);
    expect(await promptEditor.isEditorOpen()).toBe(true);
    const yearPrompt = await promptEditor.findPrompt('Year');
    await aePrompt.shoppingCart.clickElmInAvailableList(yearPrompt, '2020');
    await aePrompt.shoppingCart.addSingle(yearPrompt);
    await promptEditor.run();
    await reportToolbar.rePrompt();
    await aePrompt.shoppingCart.addAll(yearPrompt);
    await promptEditor.runNoWait();
    await dossierPage.clickCancelExecutionButton();
    await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
    const selectedPrompts = await aePrompt.shoppingCart.getSelectedObjectListText(
      await promptEditor.findPrompt('Year')
    );
    expect(await promptEditor.isEditorOpen()).toBe(true);
    expect(selectedPrompts).toEqual(['2020', '2021', '2022', '2023']);
    await promptEditor.run();
    await reportGridView.waitForGridCellToBeExpectedValue(1, 5, '$22');
    const cellText = await reportGridView.getGridCellText(1, 5);
    expect(cellText, 'Cost cell should be $22').toBe('$22');
  });

  test('[TC99428_05] Cancel re-execute in authoring', async ({
    libraryPage,
    reportPage,
    reportToolbar,
    reportGridView,
  }) => {
    await resetReportState({
      credentials: cancelReportExecutionUser,
      report: BigReportNoPrompt,
    });
    await libraryPage.editReportByUrl({
      dossierId: BigReportNoPrompt.id,
      projectId: BigReportNoPrompt.project.id,
    });
    await reportToolbar.switchToDesignMode();
    await reportGridView.waitForGridCellToBeExpectedValue(1, 7, '$24');
    await reportGridView.sortByOption('Revenue', 'Sort All Values (Default)');
    await reportGridView.waitForGridCellToBeExpectedValue(1, 7, '$14,000');
    expect(
      await reportToolbar.isUndoEnabled(true),
      'After sort undo should be enabled'
    ).toBe(true);
    await reportToolbar.actionOnToolbar('re-execute', { isWait: false });
    await reportPage.clickCancelButtonInTopLoadingBar();
    await reportGridView.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    const cellText = await reportGridView.getGridCellText(1, 7);
    expect(cellText, 'Revenue cell should be $14,000').toBe('$14,000');
    expect(
      await reportToolbar.isUndoEnabled(true),
      'After cancel re-execute undo should still be enabled'
    ).toBe(true);
  });

  test('[TC99428_06] Cancel during linking in authoring', async ({
    libraryPage,
    dossierPage,
    reportPage,
    reportToolbar,
    reportGridView,
  }) => {
    const linkName = 'Link 1 - report no prompt';
    await resetReportState({
      credentials: cancelReportExecutionUser,
      report: BigReportNoPrompt,
    });
    await libraryPage.editReportByUrl({
      dossierId: BigReportNoPrompt.id,
      projectId: BigReportNoPrompt.project.id,
    });
    await reportToolbar.switchToDesignMode();
    await reportGridView.waitForGridCellToBeExpectedValue(1, 7, '$24');
    await reportGridView.sortByOption('Revenue', 'Sort All Values (Default)');
    await reportGridView.waitForGridCellToBeExpectedValue(1, 7, '$14,000');
    await reportGridView.openContextualLinkFromCellByPos(1, 6, { linkName, isWait: false });
    await reportPage.clickDoNotSaveButtonInConfirmSaveDialog();
    await dossierPage.clickCancelExecutionButton();
    await libraryPage.waitForCurtainDisappear();
    const title = await libraryPage.title();
    expect(title, 'After cancel user should be on Library').toContain(libraryTitle);
    await expect(dossierPage.getNavigationBar()).toBeVisible();
  });
});
