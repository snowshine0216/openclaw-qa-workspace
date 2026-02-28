/**
 * Migrated from WDIO: Report_consumption_cancel_execution.spec.js
 * Phase 2j - reportCancel: Cancel report execution in consumption mode.
 */
import { test, expect, reportCancelData } from '../../../fixtures';
import { resetReportState } from '../../../api/resetReportState';
import { getReportEnv } from '../../../config/env';

const { BigReportNoPrompt, BigReportWithPrompt, cancelReportExecutionUser } = reportCancelData;
const libraryTitle = 'Library';

test.describe('Cancel report execution on consumption mode', () => {
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

  test('[TC99427_01] Cancel initial execution', async ({
    libraryPage,
    dossierPage,
  }) => {
    await resetReportState({
      credentials: cancelReportExecutionUser,
      report: BigReportNoPrompt,
    });
    await libraryPage.openDossierNoWait(BigReportNoPrompt.name);
    await dossierPage.clickCancelExecutionButton();
    await libraryPage.waitForCurtainDisappear();
    const title = await libraryPage.title();
    expect(title, 'After click cancel user should be on Library page').toContain(libraryTitle);
    await expect(dossierPage.getNavigationBar()).toBeVisible();
  });

  test('[TC99427_02] Cancel initial execution on prompt report', async ({
    libraryPage,
    dossierPage,
  }) => {
    await resetReportState({
      credentials: cancelReportExecutionUser,
      report: BigReportWithPrompt,
    });
    await libraryPage.openDossierNoWait(BigReportWithPrompt.name);
    await dossierPage.clickCancelExecutionButton();
    await libraryPage.waitForCurtainDisappear();
    const title = await libraryPage.title();
    expect(title, 'After click cancel user should be on Library page').toContain(libraryTitle);
    await expect(dossierPage.getNavigationBar()).toBeVisible();
  });

  test('[TC99427_03] Cancel apply prompt on report', async ({
    libraryPage,
    dossierPage,
    promptEditor,
    aePrompt,
  }) => {
    await resetReportState({
      credentials: cancelReportExecutionUser,
      report: BigReportWithPrompt,
    });
    await libraryPage.openReportByUrl({
      projectId: BigReportWithPrompt.project.id,
      documentId: BigReportWithPrompt.id,
      prompt: true,
    });
    await promptEditor.runNoWait();
    await dossierPage.clickCancelExecutionButton();
    expect(
      await promptEditor.isEditorOpen(),
      'After cancel during apply prompt should go back to prompt editor'
    ).toBe(true);
    const year = await promptEditor.findPrompt('Year');
    const selectedPrompts = await aePrompt.shoppingCart.getSelectedObjectListText(year);
    expect(selectedPrompts.length, 'Selected object list should be empty').toBe(0);
    await promptEditor.closeEditor();
  });

  test('[TC99427_04] Cancel re-prompt', async ({
    libraryPage,
    dossierPage,
    promptEditor,
    aePrompt,
  }) => {
    await resetReportState({
      credentials: cancelReportExecutionUser,
      report: BigReportWithPrompt,
    });
    await libraryPage.openReportByUrl({
      projectId: BigReportWithPrompt.project.id,
      documentId: BigReportWithPrompt.id,
      prompt: true,
    });
    const yearPrompt = await promptEditor.findPrompt('Year');
    await aePrompt.shoppingCart.clickElmInAvailableList(yearPrompt, '2020');
    await aePrompt.shoppingCart.addSingle(yearPrompt);
    await promptEditor.run();
    await promptEditor.reprompt();
    await aePrompt.shoppingCart.addAll(yearPrompt);
    await promptEditor.runNoWait();
    await dossierPage.clickCancelExecutionButton();
    expect(
      await promptEditor.isEditorOpen(),
      'After cancel during apply prompt should go back to prompt editor'
    ).toBe(true);
    const selectedPrompts = await aePrompt.shoppingCart.getSelectedObjectListText(
      await promptEditor.findPrompt('Year')
    );
    expect(selectedPrompts, 'Selected should be 2020-2023').toEqual(['2020', '2021', '2022', '2023']);
    await promptEditor.closeEditor();
  });

  test('[TC99427_05] Reset report and cancel', async ({
    libraryPage,
    dossierPage,
    reportGridView,
  }) => {
    await resetReportState({
      credentials: cancelReportExecutionUser,
      report: BigReportNoPrompt,
    });
    await libraryPage.openReportByUrl({
      projectId: BigReportNoPrompt.project.id,
      documentId: BigReportNoPrompt.id,
    });
    await reportGridView.sortByOption('Cost', 'Sort All Values (Default)');
    await reportGridView.waitForGridCellToBeExpectedValue(1, 5, '$11,297');
    await dossierPage.resetDossierNoWait();
    await dossierPage.clickCancelExecutionButton();
    const title = await libraryPage.title();
    expect(title, 'After cancel when reset user should be on Library').toContain(libraryTitle);
    await expect(dossierPage.getNavigationBar()).toBeVisible();
  });

  test('[TC99427_06] Apply bookmark and cancel', async ({
    libraryPage,
    dossierPage,
    reportGridView,
    bookmark,
  }) => {
    const bookmarkName = 'TC99427_06 Base view';
    await resetReportState({
      credentials: cancelReportExecutionUser,
      report: BigReportNoPrompt,
    });
    await libraryPage.openReportByUrl({
      projectId: BigReportNoPrompt.project.id,
      documentId: BigReportNoPrompt.id,
    });
    await reportGridView.sortByOption('Cost', 'Sort All Values (Default)');
    await reportGridView.waitForGridCellToBeExpectedValue(1, 5, '$11,297');
    await reportGridView.moveGridHeaderToPageBy('Year');
    await bookmark.openPanel();
    await bookmark.applyBookmark(bookmarkName, 'MY BOOKMARKS', { isWait: false });
    await bookmark.clickAndNoWait({ elem: bookmark.getContinueOnSaveDialog() });
    await dossierPage.clickCancelExecutionButton();
    const title = await libraryPage.title();
    expect(title, 'After cancel when apply bookmark user should be on Library').toContain(libraryTitle);
    await expect(dossierPage.getNavigationBar()).toBeVisible();
  });

  test('[TC99427_07] Cancel linking to target report no prompt', async ({
    libraryPage,
    dossierPage,
    reportGridView,
  }) => {
    const linkName = 'Link 1 - report no prompt';
    await resetReportState({
      credentials: cancelReportExecutionUser,
      report: BigReportNoPrompt,
    });
    await libraryPage.openReportByUrl({
      projectId: BigReportNoPrompt.project.id,
      documentId: BigReportNoPrompt.id,
    });
    await reportGridView.waitForGridCellToBeExpectedValue(1, 7, '$24');
    await reportGridView.sortByOption('Revenue', 'Sort All Values (Default)');
    await reportGridView.waitForGridCellToBeExpectedValue(1, 7, '$14,000');
    await reportGridView.openContextualLinkFromCellByPos(1, 6, { linkName, isWait: false });
    await dossierPage.clickCancelExecutionButton();
    await dossierPage.waitForCurtainDisappear();
    const cellText = await reportGridView.getGridCellText(1, 7);
    expect(cellText, 'Keep manipulation on source, Revenue cell should be $14,000').toBe('$14,000');
  });

  test('[TC99427_08] Cancel linking to target report with prompt', async ({
    libraryPage,
    dossierPage,
    reportGridView,
    promptEditor,
    aePrompt,
  }) => {
    const linkName = 'Link  2 - prompt report';
    await resetReportState({
      credentials: cancelReportExecutionUser,
      report: BigReportNoPrompt,
    });
    await libraryPage.openReportByUrl({
      projectId: BigReportNoPrompt.project.id,
      documentId: BigReportNoPrompt.id,
    });
    await reportGridView.waitForGridCellToBeExpectedValue(1, 7, '$24');
    await reportGridView.sortByOption('Revenue', 'Sort All Values (Default)');
    await reportGridView.waitForGridCellToBeExpectedValue(1, 7, '$14,000');
    await reportGridView.openContextualLinkFromCellByPos(1, 6, { linkName });
    await promptEditor.waitForEditor();
    const yearPrompt = await promptEditor.findPrompt('Year');
    await aePrompt.shoppingCart.addAll(yearPrompt);
    await promptEditor.runNoWait();
    await dossierPage.clickCancelExecutionButton();
    await promptEditor.waitForEditor();
    expect(
      await promptEditor.isEditorOpen(),
      'After cancel should go back to prompt editor'
    ).toBe(true);
    const selectedPrompts = await aePrompt.shoppingCart.getSelectedObjectListText(
      await promptEditor.findPrompt('Year')
    );
    expect(selectedPrompts).toEqual(['2020', '2021', '2022', '2023']);
    await promptEditor.closeEditor();
    const cellText = await reportGridView.getGridCellText(1, 7);
    expect(cellText, 'Keep manipulation on source').toBe('$14,000');
  });

  test('[TC99427_09] Cancel re-execute', async ({
    libraryPage,
    reportPage,
    reportToolbar,
    reportGridView,
  }) => {
    await resetReportState({
      credentials: cancelReportExecutionUser,
      report: BigReportNoPrompt,
    });
    await libraryPage.openReportByUrl({
      projectId: BigReportNoPrompt.project.id,
      documentId: BigReportNoPrompt.id,
    });
    await reportGridView.waitForGridCellToBeExpectedValue(1, 7, '$24');
    await reportGridView.sortByOption('Revenue', 'Sort All Values (Default)');
    await reportGridView.waitForGridCellToBeExpectedValue(1, 7, '$14,000');
    expect(
      await reportToolbar.isUndoEnabled(),
      'After sort undo button should be enabled'
    ).toBe(true);
    await reportPage.getReExecuteButton().click();
    await reportPage.clickCancelButtonInTopLoadingBar();
    await reportGridView.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    const cellText = await reportGridView.getGridCellText(1, 7);
    expect(cellText, 'Revenue cell should be $14,000').toBe('$14,000');
    expect(
      await reportToolbar.isUndoEnabled(),
      'After cancel re-execute undo should still be enabled'
    ).toBe(true);
  });
});
