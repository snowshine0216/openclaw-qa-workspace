import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { waitForFileExists, deleteFile } from '../../../utils/compareImage.js';
const downloadDirectory = 'downloads';
const specName = 'ExportToPDFDossier';
import path from 'path';

describe('Library Authoring - Manipulations related to PDF export', () => {
    const dossier = {
        id: '0072E676CF45D71774B5D3B174889540',
        name: '(AUTO) Customized Header and Footer',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossierFile = {
        name: dossier.name,
        fileType: '.pdf',
    };

    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1000,
    };

    let {
        loginPage,
        dossierAuthoringPage,
        dossierPage,
        grid,
        libraryPage,
        infoWindow,
        pdfExportWindow,
        search,
        toc,
        share,
        filterPanel,
        formatPanel,
        libraryAuthoringPage,
        libraryAuthoringPDFExport,
    } = browsers.pageObj1;
    let mockedPdfRequest;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login({ username: 'nee_auto', password: '' });
        await loginPage.enableABAlocator();
        mockedPdfRequest = await browser.mock('https://**/pdf');
    });

    beforeEach(async () => {
        mockedPdfRequest.clear();
        await resetDossierState({
            credentials: { username: 'nee_auto', password: '' },
            dossier: dossier,
        });
    });

    it('[F43170_01] Check PDF export options: Dashboard Properties -> Advanced Mode', async () => {
        await libraryPage.openUrl(dossier.project.id, dossier.id);
        await libraryAuthoringPage.editDossierFromLibrary();

        await libraryAuthoringPage.openFileMenu();
        await libraryAuthoringPage.openDashboardPropertiesMenu();
        await libraryAuthoringPage.clickExportToPDFTab();
        const dashboardPropertiesExportToPDFDialog = libraryAuthoringPage.getDashboardPropertiesExportToPDFDialog();
        await takeScreenshotByElement(
            dashboardPropertiesExportToPDFDialog,
            'F43170_01',
            'DashboardProperties_defaultPdfSettings',
            { tolerance: 0.3 }
        );

        await libraryAuthoringPDFExport.clickReactDropdownOption('Range', 'Entire dashboard');
        await libraryAuthoringPDFExport.clickReactDropdownOption('Contents', 'Both');
        await libraryAuthoringPDFExport.clickReactPaperSizeDropdownOption('Paper Size', 'B5 9.8" x 6.9"');
        await libraryAuthoringPDFExport.clickReactShowTableOfContentsCheckbox();
        await takeScreenshotByElement(
            dashboardPropertiesExportToPDFDialog,
            'F43170_01',
            'DashboardProperties_customizedPdfSettings_1',
            { tolerance: 0.3 }
        );

        await libraryAuthoringPDFExport.clickReactLockButton('header');

        await libraryAuthoringPDFExport.openReactShowFilterDropdown();
        await libraryAuthoringPDFExport.selectReactFilteroption('Both');
        await libraryAuthoringPDFExport.clickReactAdjustMarginCheckbox();
        await libraryAuthoringPDFExport.setReactMarginLeft(0.66);
        await libraryAuthoringPDFExport.setReactMarginRight(0.77);
        await libraryAuthoringPDFExport.setReactMarginTop(0.88);
        await libraryAuthoringPDFExport.setReactMarginBottom(0.99);
        await takeScreenshotByElement(
            dashboardPropertiesExportToPDFDialog,
            'F43170_01',
            'DashboardProperties_customizedPdfSettings_2',
            { tolerance: 0.3 }
        );

        await libraryAuthoringPDFExport.clickReactAdvanceMode();
        await libraryAuthoringPDFExport.sleep();
        const advancedModePdfExportSettings = libraryAuthoringPDFExport.getMojoPdfExportSettings();
        await takeScreenshotByElement(
            advancedModePdfExportSettings,
            'F43170_01',
            'AdvancedMode_customizedPdfSettings',
            { tolerance: 0.3 }
        );
        const exportPreview = libraryAuthoringPDFExport.getExportPreview();
        await takeScreenshotByElement(exportPreview, 'F43170_01', 'AdvancedMode_customizedPreview', { tolerance: 0.3 });
        await libraryAuthoringPDFExport.clickAdvanceModeOkButton();
        await libraryAuthoringPDFExport.clickOKButton();

        await libraryAuthoringPDFExport.selectExportToPDFOnVisualizationMenu('Grid1');
        await libraryAuthoringPDFExport.sleep(2000);
        await libraryAuthoringPDFExport.clickReactVizExportButton();
        await libraryAuthoringPDFExport.sleep(2000);
        // Check API request
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        await libraryPage.sleep(1000);
        since('The setting of Filter Summary is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.filterSummary)
            .toBe('ALL');
        since('The setting of Fit to Page is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.fitToPage)
            .toBe(true);
        since('The setting of Include Detailed Pages is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeDetailedPages)
            .toBe(true);
        since('The setting of Page Numbers is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeFooter)
            .toBe(1);
        since('The setting of Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeHeader)
            .toBe(1);
        since('The setting of Include Overview is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeOverview)
            .toBe(false);
        since('The setting of Orientation is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.orientation)
            .toBe('NONE');
        since('The setting of Height of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageHeight)
            .toBe(6.9);
        since('The setting of Page Option is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption)
            .toBe('DEFAULT');
        since('The setting of Width of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageWidth)
            .toBe(9.8);
        since('The setting of Repeat Column Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.repeatColumnHeader)
            .toBe(true);
        await dossierPage.goToLibrary();
        
    });

    it('[F43170_02] Check PDF export options: Advanced Mode -> Dashboard Properties', async () => {
        await libraryPage.openUrl(dossier.project.id, dossier.id);
        await libraryAuthoringPage.editDossierFromLibrary();
        await libraryAuthoringPage.openFileMenu();
        await libraryAuthoringPage.openDashboardPropertiesMenu();
        await libraryAuthoringPage.clickExportToPDFTab();
        const dashboardPropertiesExportToPDFDialog = libraryAuthoringPage.getDashboardPropertiesExportToPDFDialog();
        await takeScreenshotByElement(
            dashboardPropertiesExportToPDFDialog,
            'F43170_02',
            'DashboardProperties_defaultPdfSettings',
            { tolerance: 0.3 }
        );

        await libraryAuthoringPDFExport.clickReactAdvanceMode();
        await libraryAuthoringPDFExport.sleep();
        const advancedModePdfExportSettings = libraryAuthoringPDFExport.getMojoPdfExportSettings();
        await takeScreenshotByElement(advancedModePdfExportSettings, 'F43170_02', 'AdvancedMode_defaultPdfSettings', {
            tolerance: 0.3,
        });
        const defaultPreview = libraryAuthoringPDFExport.getExportPreview();
        await takeScreenshotByElement(defaultPreview, 'F43170_02', 'AdvancedMode_defaultPreview', { tolerance: 0.3 });

        await libraryAuthoringPDFExport.clickDropdownOption('Range', 'Entire dashboard');
        await libraryAuthoringPDFExport.clickDropdownOption('Contents', 'Both');
        await libraryAuthoringPDFExport.clickDropdownOption('Paper Size', 'B5 9.8" x 6.9"');
        await libraryAuthoringPDFExport.clickShowTableOfContentsCheckbox();
        await libraryAuthoringPDFExport.clickCustomizedDropdown('Show header');
        await libraryAuthoringPDFExport.selectCustomizedSetting('Customize');
        await libraryAuthoringPDFExport.clickCustomizedDropdown('Show footer');
        await libraryAuthoringPDFExport.arrowDown();
        await libraryAuthoringPDFExport.enter();
        await libraryAuthoringPDFExport.sleep(1000);
        await libraryAuthoringPDFExport.clickLockButton('header');
        await libraryAuthoringPDFExport.openShowFilterDropdown();
        await libraryAuthoringPDFExport.selectFilteroption('Both');
        await libraryAuthoringPDFExport.clickAdjustMarginCheckbox();
        await libraryAuthoringPDFExport.setMarginLeft(1);
        await libraryAuthoringPDFExport.setMarginRight(1);
        await libraryAuthoringPDFExport.setMarginTop(2);
        await libraryAuthoringPDFExport.setMarginBottom(2);
        await takeScreenshotByElement(
            advancedModePdfExportSettings,
            'F43170_02',
            'AdvancedMode_customizeddPdfSettings',
            { tolerance: 0.3 }
        );
        const customizedPreview = libraryAuthoringPDFExport.getExportPreview();
        await takeScreenshotByElement(customizedPreview, 'F43170_02', 'AdvancedMode_customizedPreview', {
            tolerance: 0.3,
        });
        await libraryAuthoringPDFExport.clickAdvanceModeOkButton();
        const dashboardPropertiesCustomizedSettings = libraryAuthoringPage.getDashboardPropertiesExportToPDFDialog();
        await takeScreenshotByElement(
            dashboardPropertiesCustomizedSettings,
            'F43170_02',
            'DashboardProperties_customizedPdfSettings',
            { tolerance: 0.3 }
        );
        await libraryAuthoringPDFExport.clickOKButton();

        await libraryAuthoringPDFExport.selectExportToPDFOnVisualizationMenu('Grid1');
        await libraryAuthoringPDFExport.sleep(2000);
        await libraryAuthoringPDFExport.clickReactVizExportButton();
        await libraryAuthoringPDFExport.sleep(2000);
        // Check API request
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        await libraryPage.sleep(1000);
        since('The setting of Filter Summary is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.filterSummary)
            .toBe('ALL');
        since('The setting of Fit to Page is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.fitToPage)
            .toBe(true);
        since('The setting of Include Detailed Pages is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeDetailedPages)
            .toBe(true);
        since('The setting of Page Numbers is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeFooter)
            .toBe(1);
        since('The setting of Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeHeader)
            .toBe(1);
        since('The setting of Include Overview is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeOverview)
            .toBe(false);
        since('The setting of Orientation is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.orientation)
            .toBe('NONE');
        since('The setting of Height of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageHeight)
            .toBe(6.9);
        since('The setting of Page Option is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption)
            .toBe('DEFAULT');
        since('The setting of Width of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageWidth)
            .toBe(9.8);
        since('The setting of Repeat Column Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.repeatColumnHeader)
            .toBe(true);
        await dossierPage.goToLibrary();
    });

    it('[F43170_03] Format Header & Footer in PDF export options: Advanced Mode -> Dashboard Properties', async () => {
        await libraryPage.openUrl(dossier.project.id, dossier.id);
        await libraryAuthoringPage.editDossierFromLibrary();
        await libraryAuthoringPage.openFileMenu();
        await libraryAuthoringPage.openDashboardPropertiesMenu();
        await libraryAuthoringPage.clickExportToPDFTab();
        await libraryAuthoringPDFExport.clickReactAdvanceMode();
        await libraryAuthoringPDFExport.sleep();
        await libraryAuthoringPDFExport.clickDropdownOption('Paper Size', 'B5 9.8" x 6.9"');
        await libraryAuthoringPDFExport.clickCustomizedDropdown('Show header');
        await libraryAuthoringPDFExport.selectCustomizedSetting('Customize');
        await libraryAuthoringPDFExport.clickCustomizedDropdown('Show footer');
        await libraryAuthoringPDFExport.arrowDown();
        await libraryAuthoringPDFExport.enter();
        await libraryAuthoringPDFExport.customizeHeaderFooterWithText(0, 'Header Left');
        await formatPanel.selectFontType('Oleo Script');
        await libraryAuthoringPDFExport.setFontSize(18);
        await libraryAuthoringPDFExport.setFontColor(23); // Royal blue
        await libraryAuthoringPDFExport.setFontStyle(0); // Bold
        await libraryAuthoringPDFExport.setFontStyle(1); // Italic
        await libraryAuthoringPDFExport.setFontStyle(2); // Underline
        await libraryAuthoringPDFExport.setFontStyle(3); // Strikethrough
        await libraryAuthoringPDFExport.setFontHorizontalAlignment(1); // Align left
        await libraryAuthoringPDFExport.setFontVerticalAlignment(0); // Align top
        await libraryAuthoringPDFExport.customizeHeaderFooterWithImage(1);
        await libraryAuthoringPDFExport.customizeHeaderFooterWithText(2, '{&TotalPageNumber} | {&PageName}');
        await libraryAuthoringPDFExport.customizeHeaderFooterWithText(3, 'Footer Left');
        await formatPanel.selectFontType('Oleo Script');
        await libraryAuthoringPDFExport.setFontSize(18);
        await libraryAuthoringPDFExport.setFontColor(23); // Royal blue
        await libraryAuthoringPDFExport.setFontStyle(0); // Bold
        await libraryAuthoringPDFExport.setFontStyle(1); // Italic
        await libraryAuthoringPDFExport.setFontStyle(2); // Underline
        await libraryAuthoringPDFExport.setFontStyle(3); // Strikethrough
        await libraryAuthoringPDFExport.setFontHorizontalAlignment(2); // Align center
        await libraryAuthoringPDFExport.setFontVerticalAlignment(2); // Align center
        await libraryAuthoringPDFExport.customizeHeaderFooterWithText(4, 'Footer Center');
        await libraryAuthoringPDFExport.customizeHeaderFooterWithImage(5);
        const exportPreview = libraryAuthoringPDFExport.getExportPreview();
        await takeScreenshotByElement(exportPreview, 'F43170_03', 'AdvancedMode_CustomizedHeaderFooter', {
            tolerance: 0.3,
        });

        await libraryAuthoringPDFExport.clickZoomOutIcon();
        await takeScreenshotByElement(exportPreview, 'F43170_03', 'PreView_ZoomOut', {
            tolerance: 0.3,
        });
        const advancedModePdfExportSettings = libraryAuthoringPDFExport.getMojoPdfExportSettings();
        await takeScreenshotByElement(advancedModePdfExportSettings, 'F43170_03', 'AdvancedMode_ZoomOut', {
            tolerance: 0.3,
        });

        await libraryAuthoringPDFExport.clickZoomInIcon();
        await takeScreenshotByElement(exportPreview, 'F43170_03', 'PreView_ZoomIn', {
            tolerance: 0.3,
        });
        await takeScreenshotByElement(advancedModePdfExportSettings, 'F43170_03', 'AdvancedMode_ZoomIn', {
            tolerance: 0.3,
        });
        await libraryAuthoringPDFExport.inputZoomValue('50');
        await takeScreenshotByElement(exportPreview, 'F43170_03', 'PreView_ZoomValue50', {
            tolerance: 0.3,
        });
        await takeScreenshotByElement(advancedModePdfExportSettings, 'F43170_03', 'AdvancedMode_ZoomValue50', {
            tolerance: 0.3,
        });
        await libraryAuthoringPDFExport.dragZoomSlider('Right', 30);
        await takeScreenshotByElement(exportPreview, 'F43170_03', 'PreView_DragRight30', {
            tolerance: 0.3,
        });
        await takeScreenshotByElement(advancedModePdfExportSettings, 'F43170_03', 'AdvancedMode_DragRight30', {
            tolerance: 0.3,
        });

        await libraryAuthoringPDFExport.dragZoomSlider('Left', 60);
        await takeScreenshotByElement(exportPreview, 'F43170_03', 'PreView_DragLeft60', {
            tolerance: 0.3,
        });
        await takeScreenshotByElement(advancedModePdfExportSettings, 'F43170_03', 'AdvancedMode_DragLeft60', {
            tolerance: 0.3,
        });

        await libraryAuthoringPDFExport.clickAdvanceModeOkButton();
        const dashboardPropertiesCustomizedSettings = libraryAuthoringPage.getDashboardPropertiesExportToPDFDialog();
        await takeScreenshotByElement(
            dashboardPropertiesCustomizedSettings,
            'F43170_03',
            'DashboardProperties_customizedPdfSettings',
            { tolerance: 0.3 }
        );
        await libraryAuthoringPDFExport.clickOKButton();
        await dossierPage.goToLibrary();
    });
});
