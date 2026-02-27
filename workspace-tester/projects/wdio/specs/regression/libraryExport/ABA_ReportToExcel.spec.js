import { exportFrontendUser } from '../../../constants/bot.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.ts';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { waitForFileExists, renameFile } from '../../../utils/compareImage.js';
import path from 'path';
import { reverse } from 'dns';
export const downloadDirectory = (() => path.join(process.cwd(), 'downloads'))();

describe('LibraryExport - Export Report to Excel', () => {
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

    const report_PageBy = {
        id: 'DA4D0785411D072E7486318CADD7988F',
        name: 'Report_PageBy_Simple',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const report_NoPageBy = {
        id: 'F18BA4CB42BBF9E6C56B5295CF49AA35',
        name: 'Report_NoPageBy',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };
    

    const exportReportDefaultAppID = '525F338052DF493684E3A76C12001159';
    const exportReportCheckAllAppID = '7DE770D4AF494C21855912620A843C23';
    const defaultAppID = 'C2B2023642F6753A2EF159A75E0CFF29';

    beforeAll(async () => {
        await browser.setWindowSize(1600, 1200);
        await loginPage.login({username: 'auto_report', password: 'newman1#'});
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC97618_1] Check Excel export settings of Report_PageBy for application exportReportDefault ', async () => {
        await dossierPage.openCustomAppById({ id: exportReportDefaultAppID });
        await libraryPage.waitForLibraryLoading();

        // Share menu
        await libraryPage.openReportNoWait(report_PageBy.name);
        await dossierPage.waitForDossierLoading();
        await share.openSharePanel();
        await share.clickReportExportToExcel();
        await excelExportPanel.clickReportMoreSettings();
        const excelExportDialog = excelExportPanel.getReportExportToExcelDialog();
        await checkElementByImageComparison(
            excelExportDialog,
            'T4969/export/excel',
            'TC97618_1-Share_Default',
            1
        );
        await excelExportPanel.clickReportShareMenuExportButton();
        const filepath_SharePanel = path.join(downloadDirectory, `${report_PageBy.name}.xlsx`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath_SharePanel, 15000);
        await renameFile(downloadDirectory, `${report_PageBy.name}.xlsx`, `TC97618_1_${report_PageBy.name}_SharePanel_appDefault.xlsx` )
        await dossierPage.goToLibrary();

        // Info window
        await libraryPage.moveDossierIntoViewPort(report_PageBy.name);
        await libraryPage.openDossierInfoWindow(report_PageBy.name);
        await infoWindow.clickExportExcelButton();
        const exportExcelPanel = excelExportPanel.getExportExcelPanelContent();
        await checkElementByImageComparison(
            exportExcelPanel,
            'T4969/export/excel',
            'TC97618_1-InfoWindow_Default',
            1
        );
        await excelExportPanel.clickInfoWindowReportExportButton();
        const filepath_InfoWindow = path.join(downloadDirectory, `${report_PageBy.name}.xlsx`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath_InfoWindow, 15000);
        await renameFile(downloadDirectory, `${report_PageBy.name}.xlsx`, `TC97618_1_${report_PageBy.name}_InfoWindow_appDefault.xlsx` )
        await dossierPage.goToLibrary();
        
        // list view
        await dossierPage.goToLibrary();
        await listView.selectListViewMode();
        await listView.openInfoWindowFromListView(report_PageBy.name);
        await listView.clickExportExcelFromIW();
        const listViewExportExcelPanel = excelExportPanel.getExportExcelPanelContent();
        await checkElementByImageComparison(
            listViewExportExcelPanel,
            'T4969/export/excel',
            'TC97618_1-ListView_Default',
            1
        );
        await dossierPage.goToLibrary();
        await listView.deselectListViewMode();

    });

    it('[TC97618_2] Check Excel export settings of Report_NoPageBy for application exportReportDefault ', async () => {
        await dossierPage.openCustomAppById({ id: exportReportDefaultAppID });
        await libraryPage.waitForLibraryLoading();

        // Share menu
        await libraryPage.openReportNoWait(report_NoPageBy.name);
        await dossierPage.waitForDossierLoading();
        await share.openSharePanel();
        await share.clickReportExportToExcel();
        await excelExportPanel.clickReportMoreSettings();
        const excelExportDialog = excelExportPanel.getReportExportToExcelDialog();
        await checkElementByImageComparison(
            excelExportDialog,
            'T4969/export/excel',
            'TC97618_2-Share_Default',
            1
        );
        await excelExportPanel.clickReportShareMenuExportButton();
        const filepath_SharePanel = path.join(downloadDirectory, `${report_NoPageBy.name}.xlsx`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath_SharePanel, 15000);
        await renameFile(downloadDirectory, `${report_NoPageBy.name}.xlsx`, `TC97618_2_${report_NoPageBy.name}_SharePanel_appDefault.xlsx` )
        await dossierPage.goToLibrary();

        // Info window
        await libraryPage.moveDossierIntoViewPort(report_NoPageBy.name);
        await libraryPage.openDossierInfoWindow(report_NoPageBy.name);
        await infoWindow.clickExportExcelButton();
        const exportExcelPanel = excelExportPanel.getExportExcelPanelContent();
        await checkElementByImageComparison(
            exportExcelPanel,
            'T4969/export/excel',
            'TC97618_2-InfoWindow_Default',
            1
        );
        await excelExportPanel.clickInfoWindowReportExportButton();
        const filepath_InfoWindow = path.join(downloadDirectory, `${report_NoPageBy.name}.xlsx`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath_InfoWindow, 15000);
        await renameFile(downloadDirectory, `${report_NoPageBy.name}.xlsx`, `TC97618_2_${report_NoPageBy.name}_InfoWindow_appDefault.xlsx` )
        await dossierPage.goToLibrary();
        
        // list view
        await dossierPage.goToLibrary();
        await listView.selectListViewMode();
        await listView.openInfoWindowFromListView(report_NoPageBy.name);
        await listView.clickExportExcelFromIW();
        const listViewExportExcelPanel = excelExportPanel.getExportExcelPanelContent();
        await checkElementByImageComparison(
            listViewExportExcelPanel,
            'T4969/export/excel',
            'TC97618_2-ListView_Default',
            1
        );
        await dossierPage.goToLibrary();
        await listView.deselectListViewMode();

    });

    it('[TC97618_3] Check Excel export settings of Report_PageBy for application exportReportCheckAll ', async () => {
        await dossierPage.openCustomAppById({ id: exportReportCheckAllAppID });
        await libraryPage.waitForLibraryLoading();

        // Share menu
        await libraryPage.openReportNoWait(report_PageBy.name);
        await dossierPage.waitForDossierLoading();
        await share.openSharePanel();
        await share.clickReportExportToExcel();
        await excelExportPanel.clickReportMoreSettings();
        const excelExportDialog = excelExportPanel.getReportExportToExcelDialog();
        await checkElementByImageComparison(
            excelExportDialog,
            'T4969/export/excel',
            'TC97618_3-Share_Default',
            1
        );
        await excelExportPanel.clickReportShareMenuExportButton();
        const filepath_SharePanel = path.join(downloadDirectory, `${report_PageBy.name}.xlsx`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath_SharePanel, 15000);
        await renameFile(downloadDirectory, `${report_PageBy.name}.xlsx`, `TC97618_3_${report_PageBy.name}_SharePanel_appCheckAll.xlsx` )
        await dossierPage.goToLibrary();

        // Info window
        await libraryPage.moveDossierIntoViewPort(report_PageBy.name);
        await libraryPage.openDossierInfoWindow(report_PageBy.name);
        await infoWindow.clickExportExcelButton();
        const exportExcelPanel = excelExportPanel.getExportExcelPanelContent();
        await checkElementByImageComparison(
            exportExcelPanel,
            'T4969/export/excel',
            'TC97618_3-InfoWindow_Default',
            1
        );
        await excelExportPanel.clickInfoWindowReportExportButton();
        const filepath_InfoWindow = path.join(downloadDirectory, `${report_PageBy.name}.xlsx`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath_InfoWindow, 15000);
        await renameFile(downloadDirectory, `${report_PageBy.name}.xlsx`, `TC97618_3_${report_PageBy.name}_InfoWindow_appCheckAll.xlsx` )
        await dossierPage.goToLibrary();
        
        // list view
        await dossierPage.goToLibrary();
        await listView.selectListViewMode();
        await listView.openInfoWindowFromListView(report_PageBy.name);
        await listView.clickExportExcelFromIW();
        const listViewExportExcelPanel = excelExportPanel.getExportExcelPanelContent();
        await checkElementByImageComparison(
            listViewExportExcelPanel,
            'T4969/export/excel',
            'TC97618_3-ListView_Default',
            1
        );
        await dossierPage.goToLibrary();
        await listView.deselectListViewMode();


    });

    it('[TC97618_4] Check Excel export settings of Report_NoPageBy for application exportReportCheckAll ', async () => {
        await dossierPage.openCustomAppById({ id: exportReportCheckAllAppID });
        await libraryPage.waitForLibraryLoading();

        // Share menu
        await libraryPage.openReportNoWait(report_NoPageBy.name);
        await dossierPage.waitForDossierLoading();
        await share.openSharePanel();
        await share.clickReportExportToExcel();
        await excelExportPanel.clickReportMoreSettings();
        const excelExportDialog = excelExportPanel.getReportExportToExcelDialog();
        await checkElementByImageComparison(
            excelExportDialog,
            'T4969/export/excel',
            'TC97618_4-Share_Default',
            1
        );
        await excelExportPanel.clickReportShareMenuExportButton();
        const filepath_SharePanel = path.join(downloadDirectory, `${report_NoPageBy.name}.xlsx`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath_SharePanel, 15000);
        await renameFile(downloadDirectory, `${report_NoPageBy.name}.xlsx`, `TC97618_4_${report_NoPageBy.name}_SharePanel_appCheckAll.xlsx` )
        await dossierPage.goToLibrary();

        // Info window
        await libraryPage.moveDossierIntoViewPort(report_NoPageBy.name);
        await libraryPage.openDossierInfoWindow(report_NoPageBy.name);
        await infoWindow.clickExportExcelButton();
        const exportExcelPanel = excelExportPanel.getExportExcelPanelContent();
        await checkElementByImageComparison(
            exportExcelPanel,
            'T4969/export/excel',
            'TC97618_4-InfoWindow_Default',
            1
        );
        await excelExportPanel.clickInfoWindowReportExportButton();
        const filepath_InfoWindow = path.join(downloadDirectory, `${report_NoPageBy.name}.xlsx`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath_InfoWindow, 15000);
        await renameFile(downloadDirectory, `${report_NoPageBy.name}.xlsx`, `TC97618_4_${report_NoPageBy.name}_InfoWindow_appCheckAll.xlsx` )
        await dossierPage.goToLibrary();
        
        // list view
        await dossierPage.goToLibrary();
        await listView.selectListViewMode();
        await listView.openInfoWindowFromListView(report_NoPageBy.name);
        await listView.clickExportExcelFromIW();
        const listViewExportExcelPanel = excelExportPanel.getExportExcelPanelContent();
        await checkElementByImageComparison(
            listViewExportExcelPanel,
            'T4969/export/excel',
            'TC97618_4-ListView_Default',
            1
        );
        await dossierPage.goToLibrary();
        await listView.deselectListViewMode();

    });

    it('[TC97618_5] Check Excel export settings of Report_PageBy with manipulations ', async () => {
        await dossierPage.openCustomAppById({ id: exportReportCheckAllAppID });
        await libraryPage.waitForLibraryLoading();

        // Share menu
        await libraryPage.openReportNoWait(report_PageBy.name);
        await dossierPage.waitForDossierLoading();
        await share.openSharePanel();
        await share.clickReportExportToExcel();
        await excelExportPanel.clickReportMoreSettings();
        const excelExportDialog_before = excelExportPanel.getReportExportToExcelDialog();
        await checkElementByImageComparison(
            excelExportDialog_before,
            'T4969/export/excel',
            'TC97618_5-Share_Before',
            1
        );
        await excelExportPanel.clickReportExportPageByInfoCheckbox();
        await excelExportPanel.clickExportReportTitleCheckbox();

        await share.clickReportExportToExcel();
        await libraryPage.sleep(1000);
        await share.clickReportExportToExcel();
        await excelExportPanel.clickReportMoreSettings();
        const excelExportDialog_after = excelExportPanel.getReportExportToExcelDialog();
        await checkElementByImageComparison(
            excelExportDialog_after,
            'T4969/export/excel',
            'TC97618_5-Share_After',
            1
        );
        await excelExportPanel.clickReportShareMenuExportButton();
        const filepath_SharePanel = path.join(downloadDirectory, `${report_PageBy.name}.xlsx`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath_SharePanel, 15000);
        await renameFile(downloadDirectory, `${report_PageBy.name}.xlsx`, `TC97618_5_${report_PageBy.name}_SharePanel_Manipulation.xlsx` )
        await dossierPage.goToLibrary();

        // Info window
        await libraryPage.moveDossierIntoViewPort(report_PageBy.name);
        await libraryPage.openDossierInfoWindow(report_PageBy.name);
        await infoWindow.clickExportExcelButton();
        const exportExcelPanel_Before = excelExportPanel.getExportExcelPanelContent();
        await checkElementByImageComparison(
            exportExcelPanel_Before,
            'T4969/export/excel',
            'TC97618_5-InfoWindow_Before',
            1
        );
        await excelExportPanel.clickReportExportPageByInfoCheckbox();
        await excelExportPanel.clickExportReportTitleCheckbox();
        await excelExportPanel.clickReportIWExportCancelButton();
        await infoWindow.clickExportExcelButton();
        const exportExcelPanel_After = excelExportPanel.getExportExcelPanelContent();
        await checkElementByImageComparison(
            exportExcelPanel_After,
            'T4969/export/excel',
            'TC97618_5-InfoWindow_After',
            1
        );
        await infoWindow.close();

        await libraryPage.moveDossierIntoViewPort(report_PageBy.name);
        await libraryPage.openDossierInfoWindow(report_PageBy.name);
        await infoWindow.clickExportExcelButton();
        const exportExcelPanel_Reset = excelExportPanel.getExportExcelPanelContent();
        await checkElementByImageComparison(
            exportExcelPanel_Reset,
            'T4969/export/excel',
            'TC97618_5-InfoWindow_Reset',
            1
        );
        await excelExportPanel.clickInfoWindowReportExportButton();
        const filepath_InfoWindow = path.join(downloadDirectory, `${report_PageBy.name}.xlsx`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath_InfoWindow, 15000);
        await renameFile(downloadDirectory, `${report_PageBy.name}.xlsx`, `TC97618_5_${report_PageBy.name}_InfoWindow_Manipulation.xlsx` )
        await dossierPage.goToLibrary();

    });
    

});