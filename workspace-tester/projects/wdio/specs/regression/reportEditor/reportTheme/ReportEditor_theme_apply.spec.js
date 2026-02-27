import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Report apply theme', () => {
    let {
        loginPage,
        libraryPage,
        reportPage,
        reportToolbar,
        reportTOC,
        reportFormatPanel,
        newFormatPanelForGrid,
        reportDatasetPanel,
        reportThemePanel,
    } = browsers.pageObj1;
    const testUser = reportConstants.reportThemeTestUser;
    const gridFormattingTheme = 't07. row and columns formatting';

    beforeAll(async () => {
        await loginPage.login(testUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
    });

    it('[BCIN-6490_01] apply theme with orange template and banding', async () => {
        const orangeThemeWithBanding = 't02. orange template with banding';
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductNoPageBy.id,
            projectId: reportConstants.UIReportProductNoPageBy.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6490_01_01', 'Before applying theme');
        await reportTOC.switchToThemePanel();
        await reportThemePanel.searchTheme(orangeThemeWithBanding);
        await reportThemePanel.applyTheme(orangeThemeWithBanding);
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6490_01_02',
            `After applying ${orangeThemeWithBanding} theme`
        );
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.expandTemplateSection();
        await newFormatPanelForGrid.expandLayoutSection();
        await takeScreenshotByElement(
            reportFormatPanel.FormatPanel,
            'BCIN-6490_01_03',
            'Updated settings in format panel'
        );
    });

    // outline cannot be saved to theme
    it('[BCIN-6490_02] apply outline theme', async () => {
        const outlineCompactTheme = 't03. enable outline compact';
        const outlineStandardTheme = 't03. enable outline standard';
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductNoPageBy.id,
            projectId: reportConstants.UIReportProductNoPageBy.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6490_02_01', 'Before applying theme');
        await reportTOC.switchToThemePanel();
        await reportThemePanel.searchTheme(outlineCompactTheme);
        await reportThemePanel.applyTheme(outlineCompactTheme);
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6490_02_02',
            `After applying ${outlineCompactTheme} theme`
        );
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.expandLayoutSection();
        await takeScreenshotByElement(reportFormatPanel.FormatPanel, 'BCIN-6490_02_03', 'outline compact mode');
        await reportTOC.switchToThemePanel();
        await reportThemePanel.searchTheme(outlineStandardTheme);
        await reportThemePanel.applyTheme(outlineStandardTheme);
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6490_02_04',
            `After applying ${outlineStandardTheme} theme`
        );
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.expandLayoutSection();
        await takeScreenshotByElement(reportFormatPanel.FormatPanel, 'BCIN-6490_02_05', 'outline standard mode');
    });

    it('[BCIN-6490_03] apply theme by hide row and column headers', async () => {
        const hideHeadersTheme = 't04. hide row and column headers';
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductNoPageBy.id,
            projectId: reportConstants.UIReportProductNoPageBy.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6490_03_01', 'Before applying theme');
        await reportTOC.switchToThemePanel();
        await reportThemePanel.searchTheme(hideHeadersTheme);
        await reportThemePanel.applyTheme(hideHeadersTheme);
        await since('1. Current theme should be #{expected}, instead of #{actual}')
            .expect(await reportThemePanel.getCurrentTheme())
            .toBe(hideHeadersTheme);
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6490_03_02',
            `After applying ${hideHeadersTheme} theme`
        );
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.expandLayoutSection();
        await takeScreenshotByElement(
            reportFormatPanel.FormatPanel,
            'BCIN-6490_03_03',
            'hide row and column headers mode'
        );
    });

    it('[BCIN-6490_04] apply theme with large spacing', async () => {
        const largeSpacingTheme = 't05. large spacing';
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductNoPageBy.id,
            projectId: reportConstants.UIReportProductNoPageBy.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6490_04_01', 'Before applying theme');
        await reportTOC.switchToThemePanel();
        await reportThemePanel.searchTheme(largeSpacingTheme);
        await reportThemePanel.applyTheme(largeSpacingTheme);
        await since('1. Current theme should be #{expected}, instead of #{actual}')
            .expect(await reportThemePanel.getCurrentTheme())
            .toBe(largeSpacingTheme);
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6490_04_02',
            `After applying ${largeSpacingTheme} theme`
        );
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.expandSpacingSection();
        await takeScreenshotByElement(
            reportFormatPanel.FormatPanel,
            'BCIN-6490_04_03',
            'large spacing settings in format panel'
        );
    });

    it('[BCIN-6490_05] apply theme with both axes formatting', async () => {
        const bothAxesFormattingTheme = 't06. both axis formatting';
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductNoPageBy.id,
            projectId: reportConstants.UIReportProductNoPageBy.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6490_05_01', 'Before applying theme');
        await reportTOC.switchToThemePanel();
        await reportThemePanel.searchTheme(bothAxesFormattingTheme);
        await reportThemePanel.applyTheme(bothAxesFormattingTheme);
        await since('1. Current theme should be #{expected}, instead of #{actual}')
            .expect(await reportThemePanel.getCurrentTheme())
            .toBe(bothAxesFormattingTheme);
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6490_05_02',
            `After applying ${bothAxesFormattingTheme} theme`
        );
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.switchToTextFormatTab();
        await newFormatPanelForGrid.selectGridSegment('Both Axes');
        await takeScreenshotByElement(
            reportFormatPanel.FormatPanel,
            'BCIN-6490_05_03',
            'both axes formatting settings in format panel'
        );
    });

    it('[BCIN-6490_06] apply certified theme', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductNoPageBy.id,
            projectId: reportConstants.UIReportProductNoPageBy.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6490_06_01', 'Before applying theme');
        await reportTOC.switchToThemePanel();
        await reportThemePanel.searchTheme(gridFormattingTheme);
        await reportThemePanel.applyTheme(gridFormattingTheme);
        await since('1. Current theme should be #{expected}, instead of #{actual}')
            .expect(await reportThemePanel.getCurrentTheme())
            .toBe(gridFormattingTheme);
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6490_06_02',
            `After applying ${gridFormattingTheme} theme`
        );
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.switchToTextFormatTab();
        await newFormatPanelForGrid.selectGridSegment('Rows');
        await newFormatPanelForGrid.selectGridColumns('Headers');
        await takeScreenshotByElement(
            reportFormatPanel.FormatPanel,
            'BCIN-6490_06_03',
            'row headers settings in format panel'
        );
        await newFormatPanelForGrid.selectGridColumns('Values');
        await takeScreenshotByElement(
            reportFormatPanel.FormatPanel,
            'BCIN-6490_06_04',
            'row values settings in format panel'
        );
        await newFormatPanelForGrid.selectGridColumns('Subtotal Headers');
        await takeScreenshotByElement(
            reportFormatPanel.FormatPanel,
            'BCIN-6490_06_05',
            'subtotal headers settings in format panel'
        );
        await newFormatPanelForGrid.selectGridColumns('Subtotal Values');
        await takeScreenshotByElement(
            reportFormatPanel.FormatPanel,
            'BCIN-6490_06_06',
            'subtotal values settings in format panel'
        );
        await newFormatPanelForGrid.selectGridSegment('Columns');
        await newFormatPanelForGrid.selectGridColumns('Values');
        await takeScreenshotByElement(
            reportFormatPanel.FormatPanel,
            'BCIN-6490_06_07',
            'column values settings in format panel'
        );
    });

    it('[BCIN-6490_07] switch between themes', async () => {
        const gridBorderTheme = 't08. grid border';
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductNoPageBy.id,
            projectId: reportConstants.UIReportProductNoPageBy.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportTOC.switchToThemePanel();
        await reportThemePanel.searchTheme(gridBorderTheme);
        await reportThemePanel.applyTheme(gridBorderTheme);
        await since('1. Current theme should be #{expected}, instead of #{actual}')
            .expect(await reportThemePanel.getCurrentTheme())
            .toBe(gridBorderTheme);
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6490_07_01',
            `After applying ${gridBorderTheme} theme`
        );
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.switchToTextFormatTab();
        await takeScreenshotByElement(
            reportFormatPanel.FormatPanel,
            'BCIN-6490_07_02',
            'Grid border settings in format panel'
        );
        await reportTOC.switchToThemePanel();
        await reportThemePanel.searchTheme(gridFormattingTheme);
        await reportThemePanel.applyTheme(gridFormattingTheme);
        await since('2. Current theme should be #{expected}, instead of #{actual}')
            .expect(await reportThemePanel.getCurrentTheme())
            .toBe(gridFormattingTheme);
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6490_07_03',
            `After applying ${gridBorderTheme} theme`
        );
    });

    it('[BCIN-6490_08] re-open report with theme applied', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportWithTheme.id,
            projectId: reportConstants.UIReportWithTheme.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportTOC.switchToThemePanel();
        await since('1. Current theme should be #{expected}, instead of #{actual}')
            .expect(await reportThemePanel.getCurrentTheme())
            .toBe(gridFormattingTheme);
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6490_08_01',
            're-open report with theme applied'
        );
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.switchToTextFormatTab();
        await newFormatPanelForGrid.selectGridSegment('Columns');
        await newFormatPanelForGrid.selectGridColumns('Headers');
        await takeScreenshotByElement(
            reportFormatPanel.FormatPanel,
            'BCIN-6490_08_02',
            'Column header settings in format panel'
        );
    });

    it('[BCIN-6490_09] apply theme on subset report', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.AirlineSubsetReport.id,
            projectId: reportConstants.AirlineSubsetReport.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6490_09_01', 'Before applying theme');
        await reportTOC.switchToThemePanel();
        await reportThemePanel.searchTheme(gridFormattingTheme);
        await reportThemePanel.applyTheme(gridFormattingTheme);
        await since('1. Current theme should be #{expected}, instead of #{actual}')
            .expect(await reportThemePanel.getCurrentTheme())
            .toBe(gridFormattingTheme);
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6490_09_02',
            `After applying ${gridFormattingTheme} theme`
        );
    });

    it('[BCIN-6490_10] undo redo after apply theme', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductNoPageBy.id,
            projectId: reportConstants.UIReportProductNoPageBy.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await reportTOC.switchToThemePanel();
        await reportThemePanel.searchTheme(gridFormattingTheme);
        await reportThemePanel.applyTheme(gridFormattingTheme);
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6490_10_01',
            `After applying ${gridFormattingTheme} theme`
        );
        await reportToolbar.clickUndo(true);
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6490_10_02', 'After undo applying theme');
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.switchToTextFormatTab();
        await newFormatPanelForGrid.selectGridSegment('Rows');
        await newFormatPanelForGrid.selectGridColumns('Subtotal Values');
        await takeScreenshotByElement(reportFormatPanel.FormatPanel, 'BCIN-6490_10_03', 'Settings in format panel');
        await reportToolbar.clickRedo(true);
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6490_10_04', 'After redo applying theme');
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.switchToTextFormatTab();
        await newFormatPanelForGrid.selectGridSegment('Rows');
        await newFormatPanelForGrid.selectGridColumns('Subtotal Values');
        await takeScreenshotByElement(reportFormatPanel.FormatPanel, 'BCIN-6490_10_05', 'After redo applying theme');
    });
});
