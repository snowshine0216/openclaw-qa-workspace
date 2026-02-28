import { test as base } from '@playwright/test';
import { reportUndoRedoData } from '../test-data/reportUndoRedo';
import { reportShortcutMetricsData } from '../test-data/reportShortcutMetrics';
import { reportPageBySortingData } from '../test-data/reportPageBySorting';
import { reportSubsetData } from '../test-data/reportSubset';
import { getReportEnv } from '../config/env';
import { LoginPage } from '../page-objects/library/LoginPage';
import { LibraryPage } from '../page-objects/library/LibraryPage';
import { ReportToolbar } from '../page-objects/report/ReportToolbar';
import { ReportEditorPanel } from '../page-objects/report/ReportEditorPanel';
import { ReportDatasetPanel } from '../page-objects/report/ReportDatasetPanel';
import { ReportPageBy } from '../page-objects/report/ReportPageBy';
import { ReportGridView } from '../page-objects/report/ReportGridView';
import { ReportFilterPanel } from '../page-objects/report/ReportFilterPanel';
import { ReportFilter } from '../page-objects/report/ReportFilter';
import { ReportTOC } from '../page-objects/report/ReportTOC';
import { ReportPromptEditor } from '../page-objects/report/ReportPromptEditor';
import { NewFormatPanelForGrid } from '../page-objects/report/NewFormatPanelForGrid';
import { ReportFormatPanel } from '../page-objects/report/ReportFormatPanel';
import { ThresholdEditor } from '../page-objects/report/ThresholdEditor';
import { ReportSubtotalsEditor } from '../page-objects/report/ReportSubtotalsEditor';
import { BaseContainer } from '../page-objects/report/BaseContainer';
import { ReportContextualLinkingDialog } from '../page-objects/report/ReportContextualLinkingDialog';
import { ReportDerivedMetricEditor } from '../page-objects/report/ReportDerivedMetricEditor';
import { ReportPageBySorting } from '../page-objects/report/ReportPageBySorting';
import { ReportPage } from '../page-objects/report/ReportPage';
import { PromptEditor } from '../page-objects/common/PromptEditor';
import { AEPrompt } from '../page-objects/prompt/AEPrompt';
import { ValuePrompt } from '../page-objects/prompt/ValuePrompt';
import { DossierCreator } from '../page-objects/library/DossierCreator';
import { reportCreatorData } from '../test-data/reportCreator';
import { reportPageByData } from '../test-data/reportPageBy';

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
  reportFilter: ReportFilter;
  reportTOC: ReportTOC;
  reportPromptEditor: ReportPromptEditor;
  newFormatPanelForGrid: NewFormatPanelForGrid;
  reportFormatPanel: ReportFormatPanel;
  thresholdEditor: ThresholdEditor;
  reportSubtotalsEditor: ReportSubtotalsEditor;
  baseContainer: BaseContainer;
  reportContextualLinkingDialog: ReportContextualLinkingDialog;
  reportDerivedMetricEditor: ReportDerivedMetricEditor;
  reportPageBySorting: ReportPageBySorting;
  reportPage: ReportPage;
  promptEditor: PromptEditor;
  aePrompt: AEPrompt;
  valuePrompt: ValuePrompt;
  dossierCreator: DossierCreator;
}>({
  authenticatedPage: async ({ page }, use) => {
    const env = getReportEnv();
    if (env.reportTestUrl && env.reportTestUser) {
      await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
      // Fail fast if Library shows configuration error (Intelligence Server not connected)
      const configError = page.getByText(/Configuration Error|Intelligence Server is not connected/i);
      if (await configError.isVisible().catch(() => false)) {
        throw new Error(
          'MicroStrategy Library shows "Configuration Error - Intelligence Server not connected". ' +
            'Configure a valid reportTestUrl in tests/config/.env.report pointing to a running Library instance.'
        );
      }
      const loginPage = new LoginPage(page);
      await loginPage.login({
        username: env.reportTestUser,
        password: env.reportTestPassword,
      });
      await page.waitForURL(/Library|Home|Dashboard|app/i, { timeout: 30000 }).catch(() => {});
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
  reportFilter: async ({ authenticatedPage }, use) => {
    await use(new ReportFilter(authenticatedPage));
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
  reportDerivedMetricEditor: async ({ authenticatedPage }, use) => {
    await use(new ReportDerivedMetricEditor(authenticatedPage));
  },
  reportPageBySorting: async ({ authenticatedPage }, use) => {
    await use(new ReportPageBySorting(authenticatedPage));
  },
  reportPage: async ({ authenticatedPage }, use) => {
    await use(new ReportPage(authenticatedPage));
  },
  promptEditor: async ({ authenticatedPage }, use) => {
    await use(new PromptEditor(authenticatedPage));
  },
  aePrompt: async ({ authenticatedPage }, use) => {
    await use(new AEPrompt(authenticatedPage));
  },
  valuePrompt: async ({ authenticatedPage }, use) => {
    await use(new ValuePrompt(authenticatedPage));
  },
  dossierCreator: async ({ authenticatedPage }, use) => {
    await use(new DossierCreator(authenticatedPage));
  },
});

export { expect } from '@playwright/test';
export {
  reportUndoRedoData,
  reportShortcutMetricsData,
  reportPageBySortingData,
  reportCreatorData,
  reportSubsetData,
  reportPageByData,
};
