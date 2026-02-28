import { test as base } from '@playwright/test';
import { reportUndoRedoData } from '../test-data/report-editor/report-undo-redo';
import { reportShortcutMetricsData } from '../test-data/report-editor/report-shortcut-metrics';
import { reportPageBySortingData } from '../test-data/report-editor/report-page-by-sorting';
import { reportSubsetData } from '../test-data/report-editor/report-subset';
import { getReportEnv } from '../config/env';
import { LoginPage } from '../page-objects/library/login-page';
import { LibraryPage } from '../page-objects/library/library-page';
import { ReportToolbar } from '../page-objects/report/report-toolbar';
import { ReportEditorPanel } from '../page-objects/report/report-editor-panel';
import { ReportDatasetPanel } from '../page-objects/report/report-dataset-panel';
import { ReportPageBy } from '../page-objects/report/report-page-by';
import { ReportGridView } from '../page-objects/report/report-grid-view';
import { ReportFilterPanel } from '../page-objects/report/report-filter-panel';
import { ReportFilter } from '../page-objects/report/report-filter';
import { ReportTOC } from '../page-objects/report/report-toc';
import { ReportPromptEditor } from '../page-objects/report/report-prompt-editor';
import { NewFormatPanelForGrid } from '../page-objects/report/new-format-panel-for-grid';
import { ReportFormatPanel } from '../page-objects/report/report-format-panel';
import { ThresholdEditor } from '../page-objects/report/threshold-editor';
import { AdvancedFilter } from '../page-objects/report/advanced-filter';
import { ReportSubtotalsEditor } from '../page-objects/report/report-subtotals-editor';
import { BaseContainer } from '../page-objects/report/base-container';
import { ReportContextualLinkingDialog } from '../page-objects/report/report-contextual-linking-dialog';
import { ReportDerivedMetricEditor } from '../page-objects/report/report-derived-metric-editor';
import { ReportPageBySorting } from '../page-objects/report/report-page-by-sorting';
import { ReportPage } from '../page-objects/report/report-page';
import { ReportThemePanel } from '../page-objects/report/report-theme-panel';
import { ReportMenubar } from '../page-objects/report/report-menubar';
import { PromptEditor } from '../page-objects/common/prompt-editor';
import { AEPrompt } from '../page-objects/prompt/ae-prompt';
import { ValuePrompt } from '../page-objects/prompt/value-prompt';
import { DossierCreator } from '../page-objects/library/dossier-creator';
import { reportCreatorData } from '../test-data/report-editor/report-creator';
import { reportPageByData } from '../test-data/report-editor/report-page-by';
import { reportThresholdData } from '../test-data/report-editor/report-threshold';
import { reportThemeData } from '../test-data/report-editor/report-theme';
import { reportScopeFilterData } from '../test-data/report-editor/report-scope-filter';
import { reportFormattingData } from '../test-data/report-editor/report-formatting';
import { reportCancelData } from '../test-data/report-editor/report-cancel';
import { DossierPage } from '../page-objects/library/dossier-page';
import { Bookmark } from '../page-objects/dossier/bookmark';
import { FilterPanel } from '../page-objects/report/filter-panel';
import { ReportSummary } from '../page-objects/report/report-summary';
import { AttributeFilter } from '../page-objects/report/attribute-filter';
import { CustomInputbox } from '../page-objects/report/custom-inputbox';

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
  advancedFilter: AdvancedFilter;
  reportSubtotalsEditor: ReportSubtotalsEditor;
  baseContainer: BaseContainer;
  reportContextualLinkingDialog: ReportContextualLinkingDialog;
  reportDerivedMetricEditor: ReportDerivedMetricEditor;
  reportPageBySorting: ReportPageBySorting;
  reportPage: ReportPage;
  reportThemePanel: ReportThemePanel;
  reportMenubar: ReportMenubar;
  filterPanel: FilterPanel;
  reportSummary: ReportSummary;
  attributeFilter: AttributeFilter;
  customInputbox: CustomInputbox;
  promptEditor: PromptEditor;
  aePrompt: AEPrompt;
  valuePrompt: ValuePrompt;
  dossierCreator: DossierCreator;
  dossierPage: DossierPage;
  bookmark: Bookmark;
}>({
  authenticatedPage: async ({ page }, use) => {
    const env = getReportEnv();
    if (env.reportTestUrl && env.reportTestUser) {
      await page.goto(env.reportTestUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
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
      await page.waitForLoadState('domcontentloaded');
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
  advancedFilter: async ({ authenticatedPage }, use) => {
    await use(new AdvancedFilter(authenticatedPage));
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
  reportThemePanel: async ({ authenticatedPage }, use) => {
    await use(new ReportThemePanel(authenticatedPage));
  },
  reportMenubar: async ({ authenticatedPage }, use) => {
    await use(new ReportMenubar(authenticatedPage));
  },
  filterPanel: async ({ authenticatedPage }, use) => {
    await use(new FilterPanel(authenticatedPage));
  },
  reportSummary: async ({ authenticatedPage }, use) => {
    await use(new ReportSummary(authenticatedPage));
  },
  attributeFilter: async ({ authenticatedPage }, use) => {
    await use(new AttributeFilter(authenticatedPage));
  },
  customInputbox: async ({ authenticatedPage }, use) => {
    await use(new CustomInputbox(authenticatedPage));
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
  dossierPage: async ({ authenticatedPage }, use) => {
    await use(new DossierPage(authenticatedPage));
  },
  bookmark: async ({ authenticatedPage }, use) => {
    await use(new Bookmark(authenticatedPage));
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
  reportThresholdData,
  reportThemeData,
  reportScopeFilterData,
  reportFormattingData,
  reportCancelData,
};
