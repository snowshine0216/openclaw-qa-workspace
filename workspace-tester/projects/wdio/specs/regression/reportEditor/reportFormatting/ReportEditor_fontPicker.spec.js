import * as reportConstants from '../../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { FONTS } from '../../../../pageObjects/common/FontPicker.js';
import { mockFeatureFlagOfSuppressMissingFontDialog } from '../../../../api/mock/mock-response-utils.js';
import resetReportState from '../../../../api/reports/resetReportState.js';

describe('Replace mono type font in report editor', () => {
    let {
        loginPage,
        libraryPage,
        reportPage,
        reportToolbar,
        reportGridView,
        reportTOC,
        reportFormatPanel,
        newFormatPanelForGrid,
        reportEditorPanel,
        thresholdEditor,
    } = browsers.pageObj1;
    const testUser = reportConstants.reportFontUser;

    beforeAll(async () => {
        await loginPage.login(testUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
    });

    it('[TC99483_01] Missing font dialog should pop up when entering report authoring mode using monotype font', async () => {
        await mockFeatureFlagOfSuppressMissingFontDialog(false);
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ReportWithMonoTypeFont.id,
            projectId: reportConstants.ReportWithMonoTypeFont.project.id,
        });
        await since(`1. Missing font dialog should be shown, instead it is not shown`)
            .expect(await reportPage.getMissingFontPopup().isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(reportPage.getMissingFontPopup(), 'TC99483_01_01', 'Missing font dialog');
        await reportPage.dismissMissingFontPopup();
    });

    it('[TC99483_02] Missing font dialog should not pop up when feature flag is on', async () => {
        await mockFeatureFlagOfSuppressMissingFontDialog(true);
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ReportWithMonoTypeFont.id,
            projectId: reportConstants.ReportWithMonoTypeFont.project.id,
        });
        await since(`1. Missing font dialog should not popout, instead it is shown`)
            .expect(await reportPage.getMissingFontPopup().isDisplayed())
            .toBe(false);
    });

    it('[TC99483_03] Missing font warning in format panel font picker', async () => {
        await mockFeatureFlagOfSuppressMissingFontDialog(false);
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ReportWithMonoTypeFont.id,
            projectId: reportConstants.ReportWithMonoTypeFont.project.id,
        });
        await reportPage.dismissMissingFontPopup();
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.switchToTextFormatTab();
        await reportFormatPanel.selectGridSegment('Subcategory', 'All');
        await since(`1. Selected font should be #{expected}, instead we have #{actual}`)
            .expect(await newFormatPanelForGrid.fontPicker.getCurrentSelectedFont())
            .toBe(FONTS.MonotypeCorsiva);
        await newFormatPanelForGrid.fontPicker.clickWarningIcon();
        await since(`2. Missing font tooltip should be shown in format panel font picker`)
            .expect(await newFormatPanelForGrid.fontPicker.getMissingFontTooltip().isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            newFormatPanelForGrid.fontPicker.getMissingFontTooltip(),
            'TC99483_03_01',
            'Missing font tooltip in format panel'
        );
        await reportToolbar.switchToDesignMode(false);
        // get the font family of grid cell Subcategory = Art & Architecture
        const fontFamily = await reportGridView.getGridCellStyleByPos(1, 1, 'font-family');
        await since(`3. Cell font should be #{expected}, instead we have #{actual}`)
            .expect(fontFamily)
            .toContain(FONTS.MonotypeCorsiva.toLowerCase());
        await takeScreenshotByElement(reportGridView.gridView, 'TC99483_03_02', 'report grid view with fallback font');
    });

    it('[TC99483_04] Missing font warning in threshold editor font picker', async () => {
        await mockFeatureFlagOfSuppressMissingFontDialog(false);
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ReportWithMonoTypeFont.id,
            projectId: reportConstants.ReportWithMonoTypeFont.project.id,
        });
        await reportPage.dismissMissingFontPopup();
        await reportToolbar.switchToDesignMode(false);
        await reportEditorPanel.editThresholdInDropZoneForMetric('Cost');
        await thresholdEditor.openFormatPreviewPanelByOrderNumber('1');
        await since(`1. Selected font should be #{expected}, instead we have #{actual}`)
            .expect(await thresholdEditor.fontPicker.getCurrentSelectedFont())
            .toBe(FONTS.LucidaSansUnicode);
        await thresholdEditor.fontPicker.clickWarningIcon();
        await since(`2. Missing font tooltip should be shown in format panel font picker`)
            .expect(await thresholdEditor.fontPicker.getMissingFontTooltip().isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            thresholdEditor.fontPicker.getMissingFontTooltip(),
            'TC99483_04_01',
            'Missing font tooltip in threshold editor'
        );
        await thresholdEditor.closeThresholdEditor();
        // get the font family of grid cell Subcategory = Art & Architecture under cost
        const fontFamily = await reportGridView.getGridCellStyleByPos(1, 2, 'font-family');
        await since(`3. Cell font should be #{expected}, instead we have #{actual}`)
            .expect(fontFamily)
            .toContain(FONTS.LucidaSansUnicode.toLowerCase());
        await takeScreenshotByElement(reportGridView.gridView, 'TC99483_04_02', 'report grid view with fallback font');
    });

    it('[TC99483_05] change to OOTB font in format panel', async () => {
        await mockFeatureFlagOfSuppressMissingFontDialog(false);
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ReportWithMonoTypeFont.id,
            projectId: reportConstants.ReportWithMonoTypeFont.project.id,
        });
        await reportPage.dismissMissingFontPopup();
        await reportToolbar.switchToDesignMode(false);
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.switchToTextFormatTab();
        await reportFormatPanel.selectGridSegment('Subcategory', 'All');
        // select a OOTB font
        await newFormatPanelForGrid.fontPicker.selectFontByName(FONTS.Inter);
        await newFormatPanelForGrid.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since(`1. Selected font should be #{expected}, instead we have #{actual}`)
            .expect(await newFormatPanelForGrid.fontPicker.getCurrentSelectedFont())
            .toBe(FONTS.Inter);
        // get the font family of grid cell Subcategory = Art & Architecture
        const fontFamily = await reportGridView.getGridCellStyleByPos(1, 1, 'font-family');
        await since(`2. Cell font should be #{expected}, instead we have #{actual}`)
            .expect(fontFamily)
            .toContain(FONTS.Inter.toLowerCase());
        await takeScreenshotByElement(
            reportGridView.gridView,
            'TC99483_05_01',
            'report grid view by set inter on subcategory'
        );
    });

    it('[TC99483_06] change to custom font in threshold editor', async () => {
        await mockFeatureFlagOfSuppressMissingFontDialog(false);
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ReportWithMonoTypeFont.id,
            projectId: reportConstants.ReportWithMonoTypeFont.project.id,
        });
        await reportPage.dismissMissingFontPopup();
        await reportToolbar.switchToDesignMode(false);
        await reportEditorPanel.editThresholdInDropZoneForMetric('Cost');
        await thresholdEditor.openFormatPreviewPanelByOrderNumber('1');
        await thresholdEditor.fontPicker.selectFontByName(FONTS.BigShoulders);
        await since(`1. Selected font should be #{expected}, instead we have #{actual}`)
            .expect(await thresholdEditor.fontPicker.getCurrentSelectedFont())
            .toBe(FONTS.BigShoulders);
        await thresholdEditor.clickFormatPreviewPanelOkButton();
        await thresholdEditor.saveAndCloseAdvancedThresholdEditor();
        // get the font family of grid cell Subcategory = Art & Architecture under cost
        const fontFamilyOfArt = await reportGridView.getGridCellStyleByPos(1, 2, 'font-family');
        await since(`2. Cell font should be #{expected}, instead we have #{actual}`)
            .expect(fontFamilyOfArt)
            .toContain(FONTS.LucidaSansUnicode.toLowerCase());
        // get the font family of grid cell Subcategory = Business under cost
        const fontFamilyOfBusiness = await reportGridView.getGridCellStyleByPos(2, 2, 'font-family');
        await since(`3. Cell font should be #{expected}, instead we have #{actual}`)
            .expect(fontFamilyOfBusiness)
            .toContain(FONTS.BigShoulders.toLowerCase());
        await takeScreenshotByElement(
            reportGridView.gridView,
            'TC99483_06_01',
            'report grid view by threshold on cost with BigShoulders'
        );
    });

    it('[TC99483_07] fallback monotype font report in consumption mode', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.ReportWithMonoTypeFont,
        });
        await mockFeatureFlagOfSuppressMissingFontDialog(false);
        await libraryPage.openReportByUrl({
            documentId: reportConstants.ReportWithMonoTypeFont.id,
            projectId: reportConstants.ReportWithMonoTypeFont.project.id,
        });
        // get the font family of grid cell Subcategory = Art & Architecture under Revenue
        await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '$480,173');
        await takeScreenshotByElement(
            reportGridView.gridView,
            'TC99483_07_01',
            'report grid view in consumption mode with fallback font'
        );
    });
});
