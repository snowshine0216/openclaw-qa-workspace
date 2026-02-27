import { exportFrontendUser } from '../../../constants/bot.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.ts';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { waitForFileExists } from '../../../utils/compareImage.js';
import path from 'path';
export const downloadDirectory = (() => path.join(process.cwd(), 'downloads'))();

describe('LibraryExport - Export Dashboard to PDF', () => {
    let { loginPage, libraryPage, share, dossierPage, pdfExportWindow, toc, hamburgerMenu } = browsers.pageObj1;

    const dossier_Auto_Mix_checkDefault = {
        id: 'A5E0596841E9EDAC7DF6C88C035E7EED',
        name: 'Auto_Mix_checkDefault',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier_Auto_Grids_Graphs = {
        id: '063677844446953B6205398A6DD50FD2',
        name: 'Auto_Grids_Graphs',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier_Auto_Freeform = {
        id: '956237E6406A32D9C88B1C97C4D5A93B',
        name: 'Auto_Freeform',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier_Auto_NonVizOnly = {
        id: '4A18A5AE4E8AB3270E53B08BDFF1DEFA',
        name: 'Auto_NonVizOnly',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier_Auto_SingleGrid = {
        id: 'F67E46BB4695115421664CB6BE098976',
        name: 'Auto_SingleGrid',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier_Auto_Export_3 = {
        id: 'B195767E45D39403CD49F881E2304014',
        name: 'Auto_Export_3',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    beforeAll(async () => {
        await browser.setWindowSize(1200, 800);
        await loginPage.login(exportFrontendUser);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC94328_1] Check PDF export setting from Share Menu_Auto_GridsGraphs', async () => {
        await libraryPage.openUrl(dossier_Auto_Grids_Graphs.project.id, dossier_Auto_Grids_Graphs.id);
        await share.openSharePanel();
        await share.openExportPDFSettingsWindow();
        await since('The default Contents is expected to be #{expected}, instead we have #{actual}')
            .expect(await pdfExportWindow.getPDFRange().getText())
            .toBe('(All)');
        const exportPDFSettingsWindow = pdfExportWindow.getDossierExportPDFPanel();
        await checkElementByImageComparison(
            exportPDFSettingsWindow,
            'T4969/export/pdf',
            'TC94328_1-Auto_GridsGraphs_Default',
            1
        );
        await pdfExportWindow.exportSubmitLibrary();
        const filepath = path.join(downloadDirectory, `${dossier_Auto_Grids_Graphs.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        await dossierPage.goToLibrary();
    });

    it('[TC94328_2] Check PDF export setting from Share Menu_Auto_Freeform', async () => {
        await libraryPage.openUrl(dossier_Auto_Freeform.project.id, dossier_Auto_Freeform.id);
        await share.openSharePanel();
        await share.openExportPDFSettingsWindow();
        await since('The default Contents is expected to be #{expected}, instead we have #{actual}')
            .expect(await pdfExportWindow.getPDFRange().getText())
            .toBe('(All)');
        const exportPDFSettingsWindow = pdfExportWindow.getDossierExportPDFPanel();
        await checkElementByImageComparison(
            exportPDFSettingsWindow,
            'T4969/export/pdf',
            'TC94328_2-Auto_Freeform_Default',
            1
        );
        await pdfExportWindow.exportSubmitLibrary();
        const filepath = path.join(downloadDirectory, `${dossier_Auto_Freeform.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        await dossierPage.goToLibrary();
    });

    it('[TC94328_3] Check PDF export setting from Share Menu_Auto_NonVizOnly', async () => {
        await libraryPage.openUrl(dossier_Auto_NonVizOnly.project.id, dossier_Auto_NonVizOnly.id);
        await share.openSharePanel();
        await share.openExportPDFSettingsWindow();
        await since('The default Contents is expected to be #{expected}, instead we have #{actual}')
            .expect(await pdfExportWindow.getPDFRange().getText())
            .toBe('(All)');
        const exportPDFSettingsWindow = pdfExportWindow.getDossierExportPDFPanel();
        await checkElementByImageComparison(
            exportPDFSettingsWindow,
            'T4969/export/pdf',
            'TC94328_3-Auto_NonVizOnly_Default',
            1
        );
        await pdfExportWindow.exportSubmitLibrary();
        const filepath = path.join(downloadDirectory, `${dossier_Auto_NonVizOnly.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        await dossierPage.goToLibrary();
    });

    it('[TC94328_4] Check PDF export setting from Share Menu_Auto_SingleGrid', async () => {
        await libraryPage.openUrl(dossier_Auto_SingleGrid.project.id, dossier_Auto_SingleGrid.id);
        await share.openSharePanel();
        await share.openExportPDFSettingsWindow();
        await since('The default Contents is expected to be #{expected}, instead we have #{actual}')
            .expect(await pdfExportWindow.getPDFRange().getText())
            .toBe('(All)');
        const exportPDFSettingsWindow = pdfExportWindow.getDossierExportPDFPanel();
        await checkElementByImageComparison(
            exportPDFSettingsWindow,
            'T4969/export/pdf',
            'TC94328_4-Auto_SingleGrid_Default',
            1
        );
        await pdfExportWindow.exportSubmitLibrary();
        const filepath = path.join(downloadDirectory, `${dossier_Auto_SingleGrid.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        await dossierPage.goToLibrary();
    });

    it('[TC94328_5] Switch page and check PDF export setting from Share Menu_Auto_Export_3', async () => {
        await resetDossierState({
            credentials: exportFrontendUser,
            dossier: dossier_Auto_Export_3,
        });
        await libraryPage.openUrl(dossier_Auto_Export_3.project.id, dossier_Auto_Export_3.id);
        await share.openSharePanel();
        await share.openExportPDFSettingsWindow();
        await since('The default Contents is expected to be #{expected}, instead we have #{actual}')
            .expect(await pdfExportWindow.getPDFRange().getText())
            .toBe('Grid');
        const exportPDFSettingsWindow_default = pdfExportWindow.getDossierExportPDFPanel();
        await checkElementByImageComparison(
            exportPDFSettingsWindow_default,
            'T4969/export/pdf',
            'TC94328_5-Auto_Export_3(Grid)',
            1
        );

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Graph' });
        await share.openSharePanel();
        await share.openExportPDFSettingsWindow();
        const exportPDFSettingsWindow_Graph = pdfExportWindow.getDossierExportPDFPanel();
        await checkElementByImageComparison(
            exportPDFSettingsWindow_Graph,
            'T4969/export/pdf',
            'TC94328_5-Auto_Export_3(Graph)',
            1
        );

        await dossierPage.goToLibrary();
    });

    it('[TC94328_6] Do manipulation and check PDF export setting from Share Menu_Auto_Mix', async () => {
        await resetDossierState({
            credentials: exportFrontendUser,
            dossier: dossier_Auto_Mix_checkDefault,
        });

        await libraryPage.openUrl(dossier_Auto_Mix_checkDefault.project.id, dossier_Auto_Mix_checkDefault.id);

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'one grid_shape' });
        await share.openSharePanel();
        await share.openExportPDFSettingsWindow();
        const exportPDFSettingsWindow_gridShape = pdfExportWindow.getDossierExportPDFPanel();
        await checkElementByImageComparison(
            exportPDFSettingsWindow_gridShape,
            'T4969/export/pdf',
            'TC94328_6-Auto_Mix_gridShape',
            1
        );

        await pdfExportWindow.clickPDFRangeSetting();
        const rangeList = await pdfExportWindow.getRangeDropDownContents();
        await checkElementByImageComparison(rangeList, 'T4969/export/pdf', 'TC94328_6-Auto_Mix_RangeList_1', 1);

        await pdfExportWindow.clickArrowByChapterName('Chapter 1');
        await pdfExportWindow.clickCheckboxByPageName('panelstack');
        await pdfExportWindow.clickCheckboxByPageName('panelstack_freeform');
        await pdfExportWindow.clickCheckboxByChapterName('Chapter 3');
        await pdfExportWindow.clickCheckboxByChapterName('Chapter 4');
        await checkElementByImageComparison(rangeList, 'T4969/export/pdf', 'TC94328_6-Auto_Mix_RangeList_2', 1);

        await pdfExportWindow.clickArrowByChapterName('Chapter 3');
        await pdfExportWindow.clickOnlyByPageName('non vizs');
        await checkElementByImageComparison(rangeList, 'T4969/export/pdf', 'TC94328_6-Auto_Mix_RangeList_3', 1);
        await pdfExportWindow.clickPDFRangeSetting();
        const exportPDFSettingsWindow_freeform = pdfExportWindow.getDossierExportPDFPanel();
        await checkElementByImageComparison(
            exportPDFSettingsWindow_freeform,
            'T4969/export/pdf',
            'TC94328_6-Auto_Mix_nonViz',
            1
        );
        await pdfExportWindow.clickPDFRangeSetting();
        // Uncheck all
        await pdfExportWindow.clickRangeAll();
        // Select all
        await pdfExportWindow.clickRangeAll();
        await pdfExportWindow.clickPDFRangeSetting();
        await pdfExportWindow.exportSubmitLibrary();
        const filepath = path.join(downloadDirectory, `${dossier_Auto_Mix_checkDefault.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        await dossierPage.goToLibrary();
    });

    it('[TC94328_7] Check PDF Export Settings from Share Panel in Mobile View', async () => {
        await browser.setWindowSize(400, 1000);
        await libraryPage.openUrl(dossier_Auto_SingleGrid.project.id, dossier_Auto_SingleGrid.id);
        await dossierPage.clickHamburgerMenu();
        await hamburgerMenu.clickShare();
        await hamburgerMenu.clickExportToPDF();
        await checkElementByImageComparison(
            hamburgerMenu.getExportToPDFSettingsPanel(),
            'T4969/export/pdf',
            'TC94328_7-PDF_MobileView',
            1
        );
    });
});
