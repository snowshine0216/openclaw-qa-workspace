import { exportFrontendUser } from '../../../constants/bot.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.ts';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { waitForFileExists } from '../../../utils/compareImage.js';
import path from 'path';
import { reverse } from 'dns';
export const downloadDirectory = (() => path.join(process.cwd(), 'downloads'))();

describe('LibraryExport - Export Dashboard to Excel_CheckExportSettings', () => {
    let {
        loginPage,
        libraryPage,
        share,
        infoWindow,
        dossierPage,
        excelExportPanel,
        librarySearch,
        fullSearch,
        listView,
        toc,
        hamburgerMenu,
    } = browsers.pageObj1;

    const dossier_Auto_Mix = {
        id: '5E39858640B089CA01D358984C711974',
        name: 'Auto_Mix',
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

    beforeAll(async () => {
        await browser.setWindowSize(1200, 800);
        await loginPage.login(exportFrontendUser);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC93946_1] Check Excel export setting from Info Window', async () => {
        await libraryPage.moveDossierIntoViewPort(dossier_Auto_SingleGrid.name);
        await libraryPage.openDossierInfoWindow(dossier_Auto_SingleGrid.name);
        await infoWindow.clickExportExcelButton();
        const exportExcelPanel = excelExportPanel.getExportExcelPanelContent();
        await since('The default Contents is expected to be #{expected}, instead we have #{actual}')
            .expect(await excelExportPanel.getExcelContents().getText())
            .toBe('Entire page to worksheet');
        await checkElementByImageComparison(
            exportExcelPanel,
            'T4969/export/excel',
            'TC93946_1-InfoWindow_ExportToExcel_Default',
            1
        );
        
        await excelExportPanel.clickInfoWindowExportButton();
        const filepath = path.join(downloadDirectory, `${dossier_Auto_SingleGrid.name}.xlsx`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath, 15000);
        await dossierPage.goToLibrary();
    });

    it('[TC93946_2] Check Excel export setting from Share Menu_Auto_GridsGraphs', async () => {
        await libraryPage.openUrl(dossier_Auto_Grids_Graphs.project.id, dossier_Auto_Grids_Graphs.id);
        await share.openSharePanel();
        await share.clickExportToExcel();
        await since('The default Contents is expected to be #{expected}, instead we have #{actual}')
            .expect(await excelExportPanel.getExcelRange().getText())
            .toBe('(All)');
        await since('The default Contents is expected to be #{expected}, instead we have #{actual}')
            .expect(await excelExportPanel.getExcelContents().getText())
            .toBe('Entire page to worksheet');
        const exportExcelSettingsPanel = excelExportPanel.getExportExcelSettingsPanel();
        await checkElementByImageComparison(
            exportExcelSettingsPanel,
            'T4969/export/excel',
            'TC93946_2-Auto_GridsGraphs_Default',
            1
        );
        await excelExportPanel.selectExcelContents('Each visualization separately');
        await checkElementByImageComparison(
            exportExcelSettingsPanel,
            'T4969/export/excel',
            'TC93946_2-Auto_GridsGraphs_VizSeparately',
            1
        );
        const vizList = excelExportPanel.getVizList();
        await vizList.waitForExist();
        await checkElementByImageComparison(vizList, 'T4969/export/excel', 'TC93946_2-Auto_GridsGraphs_VizList', 1);
        await excelExportPanel.selectExcelContents('Entire page to worksheet');
        await checkElementByImageComparison(
            exportExcelSettingsPanel,
            'T4969/export/excel',
            'TC93946_2-Auto_GridsGraphs_EntirePage',
            1
        );
        await excelExportPanel.openExcelRangeSetting();
        await excelExportPanel.clickArrowByChapterName('Chapter 1');
        const rangeList = await excelExportPanel.getExcelDropDownContents();
        await checkElementByImageComparison(rangeList, 'T4969/export/excel', 'TC93946_2-Auto_GridsGraphs_rangeList', 1);
        await excelExportPanel.clickShareMenuExportButton();
        const filepath = path.join(downloadDirectory, `${dossier_Auto_Grids_Graphs.name}_Page 1.xlsx`);
        await waitForFileExists(filepath, 10000);
        await dossierPage.goToLibrary();
    });

    it('[TC93946_3] Check Excel export setting from Share Menu_Auto_NonVizOnly', async () => {
        await libraryPage.openUrl(dossier_Auto_NonVizOnly.project.id, dossier_Auto_NonVizOnly.id);
        await share.openSharePanel();
        await share.clickExportToExcel();
        const exportExcelSettingsPanel = excelExportPanel.getExportExcelSettingsPanel();
        await checkElementByImageComparison(
            exportExcelSettingsPanel,
            'T4969/export/excel',
            'TC93946_3-Auto_NonVizOnly_Default',
            1
        );
        await excelExportPanel.selectExcelContents('Each visualization separately');
        await checkElementByImageComparison(
            exportExcelSettingsPanel,
            'T4969/export/excel',
            'TC93946_3-Auto_NonVizOnly_VizSeparately',
            1
        );
        const vizList = excelExportPanel.getVizList();
        await vizList.waitForExist({ reverse: true });
        //await checkElementByImageComparison(vizList, 'T4969/export/excel', 'TC93946_3-Auto_NonVizOnly_VizList', 1);
        await excelExportPanel.clickShareMenuExportButton();
        const filepath = path.join(downloadDirectory, `${dossier_Auto_NonVizOnly.name}_Page 1.xlsx`);
        await waitForFileExists(filepath, 10000);
        await dossierPage.goToLibrary();
    });

    it('[TC93946_4] Check Excel export setting from Share Menu_Auto_Freeform', async () => {
        await libraryPage.openUrl(dossier_Auto_Freeform.project.id, dossier_Auto_Freeform.id);
        await share.openSharePanel();
        await share.clickExportToExcel();
        const exportExcelSettingsPanel = excelExportPanel.getExportExcelSettingsPanel();
        await excelExportPanel.selectExcelContents('Each visualization separately');
        await checkElementByImageComparison(
            exportExcelSettingsPanel,
            'T4969/export/excel',
            'TC93946_4-Auto_Freeform_VizSeparately',
            1
        );
        const vizList = excelExportPanel.getVizList();
        await vizList.waitForExist();
        await checkElementByImageComparison(vizList, 'T4969/export/excel', 'TC93946_4-Auto_Freeform_VizList', 1);
        await excelExportPanel.clickShareMenuExportButton();
        const filepath = path.join(downloadDirectory, `${dossier_Auto_Freeform.name}_Page 1.xlsx`);
        await waitForFileExists(filepath, 10000);
        await dossierPage.goToLibrary();
    });

    it('[TC93946_5] Check Excel export setting from Share Menu_Auto_Mix', async () => {
        await resetDossierState({
            credentials: exportFrontendUser,
            dossier: dossier_Auto_Mix,
        });
        await libraryPage.openUrl(dossier_Auto_Mix.project.id, dossier_Auto_Mix.id);
        await share.openSharePanel();
        await share.clickExportToExcel();
        await since('The default Contents is expected to be #{expected}, instead we have #{actual}')
            .expect(await excelExportPanel.getExcelRange().getText())
            .toBe('Chapter 4');
        await since('The default Contents is expected to be #{expected}, instead we have #{actual}')
            .expect(await excelExportPanel.getExcelContents().getText())
            .toBe('Entire page to worksheet');
        const exportExcelSettingsPanel = excelExportPanel.getExportExcelSettingsPanel();
        await checkElementByImageComparison(exportExcelSettingsPanel, 'T4969/export/excel', 'TC93946_5-Auto_Mix_Default', 1);
        await excelExportPanel.selectExcelContents('Each visualization separately');
        await checkElementByImageComparison(
            exportExcelSettingsPanel,
            'T4969/export/excel',
            'TC93946_5-Auto_Mix_VizSeparately',
            1
        );
        const vizList = excelExportPanel.getVizList();
        await vizList.waitForExist();
        await checkElementByImageComparison(vizList, 'T4969/export/excel', 'TC93946_5-Auto_Mix_VizList', 1);
        await excelExportPanel.openExcelRangeSetting();
        const rangeList = await excelExportPanel.getExcelDropDownContents();
        await checkElementByImageComparison(rangeList, 'T4969/export/excel', 'TC93946_5-Auto_Mix_DefaultRangeList', 1);
        await excelExportPanel.clickArrowByChapterName('Chapter 2');
        await excelExportPanel.clickCheckboxByPageName('one grid_shape');
        await excelExportPanel.clickCheckboxByPageName('grids_graphs_shape_text');
        await checkElementByImageComparison(
            exportExcelSettingsPanel,
            'T4969/export/excel',
            'TC93946_5-Auto_Mix_Range_Pages_Chapter4',
            1
        );
        await excelExportPanel.clickCheckboxByPageName('one graph_shape');
        await checkElementByImageComparison(
            exportExcelSettingsPanel,
            'T4969/export/excel',
            'TC93946_5-Auto_Mix_Range_Chapter2_Chapter4',
            1
        );
        await excelExportPanel.clickCheckboxByChapterName('Chapter 1');
        await excelExportPanel.clickCheckboxByChapterName('Chapter 3');
        await checkElementByImageComparison(
            exportExcelSettingsPanel,
            'T4969/export/excel',
            'TC93946_5-Auto_Mix_Range_All',
            1
        );
        await excelExportPanel.clickArrowByChapterName('Chapter 2');
        await excelExportPanel.clickOnlyByChapterName('Chapter 2');
        await checkElementByImageComparison(
            exportExcelSettingsPanel,
            'T4969/export/excel',
            'TC93946_5-Auto_Mix_Range_Chapter2',
            1
        );
        await excelExportPanel.clickArrowByChapterName('Chapter 3');
        await excelExportPanel.clickOnlyByPageName('non vizs');
        await checkElementByImageComparison(
            exportExcelSettingsPanel,
            'T4969/export/excel',
            'TC93946_5-Auto_Mix_Range_Chapter3',
            1
        );
        await excelExportPanel.openExcelRangeSetting();
        await excelExportPanel.clickShareMenuExportButton();
        const filepath = path.join(downloadDirectory, `${dossier_Auto_Mix.name}.xlsx`);
        await waitForFileExists(filepath, 10000);
        await dossierPage.goToLibrary();
    });

    xit('[TC93946_6] Check Excel export setting from List View', async () => {
        await libraryPage.openUrl(dossier_Auto_Grids_Graphs.project.id, dossier_Auto_Grids_Graphs.id);
        await dossierPage.goToLibrary();
        await listView.selectListViewMode();
        await listView.openInfoWindowFromListView(dossier_Auto_Mix.name);
        await listView.clickExportExcelFromIW();
        const exportExcelPanel = excelExportPanel.getExportExcelPanelContent();
        await checkElementByImageComparison(
            exportExcelPanel,
            'T4969/export/excel',
            'TC93946_6-ListView_ExportToExcel_Default',
            1
        );
        await dossierPage.goToLibrary();
    });

    xit('[TC93946_7] Check Excel export setting from Search Window', async () => {
        await librarySearch.search(dossier_Auto_Mix.name);
        await librarySearch.pressEnter();
        await fullSearch.waitForSearchLoading();
        await fullSearch.clickAllTab();
        await fullSearch.openInfoWindow(dossier_Auto_Mix.name);
        await infoWindow.clickExportExcelButton();
        const exportExcelPanel = excelExportPanel.getExportExcelPanelContent();
        await checkElementByImageComparison(
            exportExcelPanel,
            'T4969/export/excel',
            'TC93946_7-SearchWindow_ExportToExcel_Default',
            1
        );
    });

    it('[TC93946_8] Switch dashboard page and check Excel export setting from Share Menu', async () => {
        await resetDossierState({
            credentials: exportFrontendUser,
            dossier: dossier_Auto_Mix,
        });
        await libraryPage.openUrl(dossier_Auto_Mix.project.id, dossier_Auto_Mix.id);
        await share.openSharePanel();
        await share.clickExportToExcel();
        const exportExcelSettingsPanel_origin = excelExportPanel.getExportExcelSettingsPanel();
        await checkElementByImageComparison(
            exportExcelSettingsPanel_origin,
            'T4969/export/excel',
            'TC93946_8-Auto_Mix_Original_Chapter4',
            1
        );
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'panelstack' });
        await share.openSharePanel();
        await share.clickExportToExcel();
        const exportExcelSettingsPanel_1 = excelExportPanel.getExportExcelSettingsPanel();
        await checkElementByImageComparison(
            exportExcelSettingsPanel_1,
            'T4969/export/excel',
            'TC93946_8-Auto_Mix_one_grid',
            1
        );
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 3', pageName: 'non vizs' });
        await share.openSharePanel();
        await share.clickExportToExcel();
        const exportExcelSettingsPanel_2 = excelExportPanel.getExportExcelSettingsPanel();
        await checkElementByImageComparison(
            exportExcelSettingsPanel_2,
            'T4969/export/excel',
            'TC93946_8-Auto_Mix_Chapter3',
            1
        );
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2' });
        await share.openSharePanel();
        await share.clickExportToExcel();
        const exportExcelSettingsPanel_3 = excelExportPanel.getExportExcelSettingsPanel();
        await checkElementByImageComparison(
            exportExcelSettingsPanel_3,
            'T4969/export/excel',
            'TC93946_8-Auto_Mix_one grid_shape',
            1
        );
    });

    it('[TC93946_9] Check Excel Export Settings from Share Panel in Mobile View', async () => {
        await browser.setWindowSize(400, 1000);
        await libraryPage.openUrl(dossier_Auto_Grids_Graphs.project.id, dossier_Auto_Grids_Graphs.id);
        await dossierPage.clickHamburgerMenu();
        await hamburgerMenu.clickShare();
        await hamburgerMenu.clickExportToExcel();
        await checkElementByImageComparison(
            hamburgerMenu.getExportToExcelSettingsPanel(),
            'T4969/export/excel',
            'TC93946_9-Excel_MobileView',
            1
        );
    });
});
