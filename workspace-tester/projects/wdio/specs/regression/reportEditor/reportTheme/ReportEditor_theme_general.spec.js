import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Report theme general', () => {
    let {
        loginPage,
        libraryPage,
        reportPage,
        dossierCreator,
        reportToolbar,
        reportMenubar,
        reportTOC,
        reportFormatPanel,
        newFormatPanelForGrid,
        reportDatasetPanel,
        reportThemePanel,
    } = browsers.pageObj1;
    const testUser = reportConstants.reportThemeTestUser;
    const autoStyleAccounting = 'Accounting';
    const autoStyleBase = 'Base';
    const certifiedTheme = 't01. blue template';

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

    it('[BCIN-6488_01] show hide report theme panel', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportTOC.switchToThemePanel();
        await since('1. Theme panel should be displayed, instead it is not shown')
            .expect(await reportThemePanel.isThemePanelDisplayed())
            .toBe(true);
        await reportMenubar.clickMenuItem('View');
        await takeScreenshotByElement(reportMenubar.getActiveMenuDropdown(), 'BCIN-6488_01_01', 'Theme panel checked');
        await reportMenubar.clickMenuItem('View');
        await reportMenubar.clickSubMenuItem('View', 'Themes Panel');
        await since('2. Theme panel should be hidden, instead it is shown')
            .expect(await reportThemePanel.isThemePanelDisplayed())
            .toBe(false);
        await reportMenubar.clickMenuItem('View');
        await takeScreenshotByElement(
            reportMenubar.getActiveMenuDropdown(),
            'BCIN-6488_01_02',
            'Theme panel unchecked'
        );
        await reportMenubar.clickMenuItem('View');
        await reportMenubar.clickSubMenuItem('View', 'Themes Panel');
        await since('3. Theme panel should be displayed, instead it is not shown')
            .expect(await reportThemePanel.isThemePanelDisplayed())
            .toBe(true);
    });

    it('[BCIN-6488_02] apply auto style with banding', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6488_02_01',
            `Before applying ${autoStyleAccounting} auto style`
        );
        await reportTOC.switchToThemePanel();
        await reportThemePanel.searchTheme(autoStyleAccounting);
        await reportThemePanel.applyTheme(autoStyleAccounting);
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6488_02_02',
            `After applying ${autoStyleAccounting} auto style`
        );
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.expandLayoutSection();
        await takeScreenshotByElement(
            reportFormatPanel.FormatPanel,
            'BCIN-6488_02_03',
            `Updated settings in format panel`
        );
    });

    it('[BCIN-6488_03] apply auto style with formatting on row and columns', async () => {
        const autoStyleAgent = 'Agent';
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6488_03_01',
            `Before applying ${autoStyleAgent} auto style`
        );
        await reportTOC.switchToThemePanel();
        await reportThemePanel.searchTheme(autoStyleAgent);
        await reportThemePanel.applyTheme(autoStyleAgent);
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6488_03_02',
            `After applying ${autoStyleAgent} auto style`
        );
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.switchToTextFormatTab();
        await newFormatPanelForGrid.selectGridSegment('Rows');
        await newFormatPanelForGrid.selectGridColumns('Values');
        await takeScreenshotByElement(
            reportFormatPanel.FormatPanel,
            'BCIN-6488_03_03',
            `Updated row settings in format panel`
        );
        await newFormatPanelForGrid.selectGridSegment('Columns');
        await newFormatPanelForGrid.selectGridColumns('Values');
        await takeScreenshotByElement(
            reportFormatPanel.FormatPanel,
            'BCIN-6488_03_04',
            `Updated column settings in format panel`
        );
        await newFormatPanelForGrid.selectGridSegment('All Metrics');
        await newFormatPanelForGrid.selectGridColumns('Values');
        await takeScreenshotByElement(
            reportFormatPanel.FormatPanel,
            'BCIN-6488_03_05',
            `Updated all metric settings in format panel`
        );
    });

    it('[BCIN-6488_04] apply auto style formatting on border', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6488_04_01',
            `Before applying ${autoStyleBase} auto style`
        );
        await reportTOC.switchToThemePanel();
        await reportThemePanel.searchTheme(autoStyleBase);
        await reportThemePanel.applyTheme(autoStyleBase);
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6488_04_02',
            `After applying ${autoStyleBase} auto style`
        );
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.switchToTextFormatTab();
        await newFormatPanelForGrid.selectGridSegment('Rows');
        await takeScreenshotByElement(
            reportFormatPanel.FormatPanel,
            'BCIN-6488_04_03',
            `Updated border settings on row`
        );
        await newFormatPanelForGrid.selectGridSegment('Columns');
        await takeScreenshotByElement(
            reportFormatPanel.FormatPanel,
            'BCIN-6488_04_04',
            `Updated border settings on column`
        );
        await newFormatPanelForGrid.selectGridSegment('All Metrics');
        await takeScreenshotByElement(
            reportFormatPanel.FormatPanel,
            'BCIN-6488_04_05',
            `Updated border settings on all metrics`
        );
    });

    it('[BCIN-6488_05] apply auto style with formatting on subtotal', async () => {
        const autoStyleColorful = 'Colorful';
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6488_05_01',
            `Before applying ${autoStyleColorful} auto style`
        );
        await reportTOC.switchToThemePanel();
        await reportThemePanel.searchTheme(autoStyleColorful);
        await reportThemePanel.applyTheme(autoStyleColorful);
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6488_05_02',
            `After applying ${autoStyleColorful} auto style`
        );
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.switchToTextFormatTab();
        await newFormatPanelForGrid.selectGridSegment('Rows');
        await newFormatPanelForGrid.selectGridColumns('Subtotal Headers');
        await takeScreenshotByElement(
            reportFormatPanel.FormatPanel,
            'BCIN-6488_05_03',
            `Updated subtotal header settings in format panel`
        );
        await newFormatPanelForGrid.selectGridColumns('Subtotal Values');
        await takeScreenshotByElement(
            reportFormatPanel.FormatPanel,
            'BCIN-6488_05_04',
            `Updated subtotal header value settings in format panel`
        );
        await newFormatPanelForGrid.selectGridSegment('Columns');
        await newFormatPanelForGrid.selectGridColumns('Subtotal Headers');
        await takeScreenshotByElement(
            reportFormatPanel.FormatPanel,
            'BCIN-6488_05_05',
            `Updated subtotal value settings in format panel`
        );
        await newFormatPanelForGrid.selectGridColumns('Subtotal Values');
        await takeScreenshotByElement(
            reportFormatPanel.FormatPanel,
            'BCIN-6488_05_06',
            `Updated subtotal value settings in format panel`
        );
    });

    it('[BCIN-6488_06] filter certified theme', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportTOC.switchToThemePanel();
        await since('1. Current theme should be #{expected}, instead of #{actual}')
            .expect(await reportThemePanel.getCurrentTheme())
            .toBe('Light Grid');
        await since('2. Current theme should not be certified, instead it is certified')
            .expect(await reportThemePanel.isCurrentThemeCertified())
            .toBe(false);
        await reportThemePanel.toggleCertifiedThemes();
        await takeScreenshotByElement(
            reportThemePanel.getThemePanel(),
            'BCIN-6488_06_01',
            'Certified themes are filtered'
        );
        await reportThemePanel.searchTheme(certifiedTheme);
        await reportThemePanel.applyTheme(certifiedTheme);
        await since('3. Current theme should be #{expected}, instead of #{actual}')
            .expect(await reportThemePanel.getCurrentTheme())
            .toBe(certifiedTheme);
        await since('4. Current theme should not be certified, instead it is certified')
            .expect(await reportThemePanel.isCurrentThemeCertified())
            .toBe(true);
    });

    it('[BCIN-6488_07] check theme cover image', async () => {
        const autoStyleBusinessGreen = 'Business Green';
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportTOC.switchToThemePanel();
        await reportThemePanel.searchTheme(autoStyleAccounting);
        await since('1. Cover image url should contains #{expected}, instead is not since the url is #{actual}')
            .expect(await reportThemePanel.getCoverImageUrlByName(autoStyleAccounting))
            .toContain('dossierreact/dist/assets/images/accounting');
        await reportThemePanel.searchTheme(autoStyleBusinessGreen);
        await since('2. Cover image url should contains #{expected}, instead is not since the url is #{actual}')
            .expect(await reportThemePanel.getCoverImageUrlByName(autoStyleBusinessGreen))
            .toContain('dossierreact/dist/assets/images/business_green');
        await reportThemePanel.searchTheme(certifiedTheme);
        await since('3. Cover image url should contains #{expected}, instead is not since the url is #{actual}')
            .expect(await reportThemePanel.getCoverImageUrlByName(certifiedTheme))
            .toBe('https://demo.microstrategy.com/MicroStrategy/images/Coverpages/16-9/24.jpg');
    });

    it('[BCIN-6488_08] check theme tooltip when hovering on info icon', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportTOC.switchToThemePanel();
        await reportThemePanel.searchTheme(autoStyleAccounting);
        await reportThemePanel.hoverOnThemeInfoIcon(autoStyleAccounting);
        await since('1. Tooltip should be #{expected}, instead it is #{actual}')
            .expect(await reportThemePanel.getTooltipContent())
            .toBe('Updated 08/06/2015');
        await reportThemePanel.searchTheme(autoStyleBase);
        await reportThemePanel.hoverOnThemeInfoIcon(autoStyleBase);
        await since('2. Tooltip should be #{expected}, instead it is #{actual}')
            .expect(await reportThemePanel.getTooltipContent())
            .toBe('Updated 07/19/2024');
    });

    it('[BCIN-6488_09] resize editor panel to re-order theme cards', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportTOC.switchToThemePanel();
        await reportThemePanel.searchTheme('bl');
        const cardSize = await reportThemePanel.getCurrentThemeCardSize();
        await reportPage.resizeEditorPanel(cardSize.x);
        await takeScreenshotByElement(
            reportThemePanel.getThemePanel(),
            'BCIN-6488_09_01',
            're-order theme cards after resizing'
        );
    });

    it('[BCIN-6488_10] choose select theme from top menu when theme panel is not show', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportTOC.switchToThemePanel();
        await since('1. Theme panel should be displayed, instead it is not shown')
            .expect(await reportThemePanel.isThemePanelDisplayed())
            .toBe(true);
        await reportMenubar.clickSubMenuItem('View', 'Themes Panel');
        await since('2. Theme panel should be hidden, instead it is shown')
            .expect(await reportThemePanel.isThemePanelDisplayed())
            .toBe(false);
        await reportMenubar.clickSubMenuItem('Format', 'Select Theme');
        await since(
            '3. Theme panel should be displayed after choose Select Theme from menu bar, instead it is not shown'
        )
            .expect(await reportThemePanel.isThemePanelDisplayed())
            .toBe(true);
    });

    it('[BCIN-6488_11] check current theme for newly created report from blank template', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(reportConstants.tutorialProject.name);
        await dossierCreator.selectTemplate('Blank');
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportTOC.switchToThemePanel();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6488_11_01', 'select blank template');
        await since('1. Current theme should be #{expected}, instead of #{actual}')
            .expect(await reportThemePanel.getCurrentTheme())
            .toBe('Light Grid');
    });

    it('[BCIN-6488_12] check current theme when creating report by template', async () => {
        const template = 'report template subset';
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(reportConstants.tutorialProject.name);
        await dossierCreator.searchTemplate(template);
        await dossierCreator.selectTemplate(template);
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportTOC.switchToThemePanel();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6488_12_01', 'select blank template');
        await since('1. Current theme should be #{expected}, instead of #{actual}')
            .expect(await reportThemePanel.getCurrentThemeContainer().isDisplayed())
            .toBe(true);
    });
});
