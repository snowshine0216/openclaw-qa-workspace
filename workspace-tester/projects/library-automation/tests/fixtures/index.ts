import { test as base } from '@playwright/test';
import { reportUndoRedoData } from '../test-data/reportUndoRedo';
import { getReportEnv } from '../config/env';
import { LoginPage } from '../page-objects/library/LoginPage';
import { LibraryPage } from '../page-objects/library/LibraryPage';
import { ReportToolbar } from '../page-objects/report/ReportToolbar';
import { ReportEditorPanel } from '../page-objects/report/ReportEditorPanel';
import { ReportDatasetPanel } from '../page-objects/report/ReportDatasetPanel';
import { ReportPageBy } from '../page-objects/report/ReportPageBy';
import { ReportGridView } from '../page-objects/report/ReportGridView';
import { ReportFilterPanel } from '../page-objects/report/ReportFilterPanel';
import { ReportTOC } from '../page-objects/report/ReportTOC';
import { ReportPromptEditor } from '../page-objects/report/ReportPromptEditor';
import { NewFormatPanelForGrid } from '../page-objects/report/NewFormatPanelForGrid';
import { ReportFormatPanel } from '../page-objects/report/ReportFormatPanel';
import { ThresholdEditor } from '../page-objects/report/ThresholdEditor';
import { ReportSubtotalsEditor } from '../page-objects/report/ReportSubtotalsEditor';
import { BaseContainer } from '../page-objects/report/BaseContainer';
import { ReportContextualLinkingDialog } from '../page-objects/report/ReportContextualLinkingDialog';
import { PromptEditor } from '../page-objects/common/PromptEditor';

export const test = base.extend<{
  authenticatedPage: import('@playwright/test').Page;
  loginPage: LoginPage;
  libraryPage: LibraryPage;
  reportToolbar: ReportToolbar;
  reportEditorPanel: ReportEditorPanel;
  reportDatasetPanel: ReportDatasetPanel;
  reportPageBy: ReportPageBy;
  reportGridView: ReportGridView;
  reportFilterPanel: ReportFilterPanel;
  reportTOC: ReportTOC;
  reportPromptEditor: ReportPromptEditor;
  newFormatPanelForGrid: NewFormatPanelForGrid;
  reportFormatPanel: ReportFormatPanel;
  thresholdEditor: ThresholdEditor;
  reportSubtotalsEditor: ReportSubtotalsEditor;
  baseContainer: BaseContainer;
  reportContextualLinkingDialog: ReportContextualLinkingDialog;
  promptEditor: PromptEditor;
}>({
  authenticatedPage: async ({ page }, use) => {
    const env = getReportEnv();
    if (env.reportTestUrl && env.reportTestUser) {
      await page.goto('/');
      const loginPage = new LoginPage(page);
      await loginPage.login({
        username: env.reportTestUser,
        password: env.reportTestPassword,
      });
      await page.waitForURL(/Library|Home|Dashboard/i, { timeout: 15000 }).catch(() => {});
    }
    await use(page);
  },
  loginPage: async ({ authenticatedPage }, use) => {
    await use(new LoginPage(authenticatedPage));
  },
  libraryPage: async ({ authenticatedPage }, use) => {
    await use(new LibraryPage(authenticatedPage));
  },
  reportToolbar: async ({ authenticatedPage }, use) => {
    await use(new ReportToolbar(authenticatedPage));
  },
  reportEditorPanel: async ({ authenticatedPage }, use) => {
    await use(new ReportEditorPanel(authenticatedPage));
  },
  reportDatasetPanel: async ({ authenticatedPage }, use) => {
    await use(new ReportDatasetPanel(authenticatedPage));
  },
  reportPageBy: async ({ authenticatedPage }, use) => {
    await use(new ReportPageBy(authenticatedPage));
  },
  reportGridView: async ({ authenticatedPage }, use) => {
    await use(new ReportGridView(authenticatedPage));
  },
  reportFilterPanel: async ({ authenticatedPage }, use) => {
    await use(new ReportFilterPanel(authenticatedPage));
  },
  reportTOC: async ({ authenticatedPage }, use) => {
    await use(new ReportTOC(authenticatedPage));
  },
  reportPromptEditor: async ({ authenticatedPage }, use) => {
    await use(new ReportPromptEditor(authenticatedPage));
  },
  newFormatPanelForGrid: async ({ authenticatedPage }, use) => {
    await use(new NewFormatPanelForGrid(authenticatedPage));
  },
  reportFormatPanel: async ({ authenticatedPage }, use) => {
    await use(new ReportFormatPanel(authenticatedPage));
  },
  thresholdEditor: async ({ authenticatedPage }, use) => {
    await use(new ThresholdEditor(authenticatedPage));
  },
  reportSubtotalsEditor: async ({ authenticatedPage }, use) => {
    await use(new ReportSubtotalsEditor(authenticatedPage));
  },
  baseContainer: async ({ authenticatedPage }, use) => {
    await use(new BaseContainer(authenticatedPage));
  },
  reportContextualLinkingDialog: async ({ authenticatedPage }, use) => {
    await use(new ReportContextualLinkingDialog(authenticatedPage));
  },
  promptEditor: async ({ authenticatedPage }, use) => {
    await use(new PromptEditor(authenticatedPage));
  },
});

export { expect } from '@playwright/test';
export { reportUndoRedoData };
