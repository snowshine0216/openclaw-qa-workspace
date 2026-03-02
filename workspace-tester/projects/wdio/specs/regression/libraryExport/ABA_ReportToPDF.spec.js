import { exportFrontendUser } from '../../../constants/bot.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { waitForFileExists, renameFile } from '../../../utils/compareImage.js';
import path from 'path';
import { reverse } from 'dns';
export const downloadDirectory = (() => path.join(process.cwd(), 'downloads'))();

describe('LibraryExport - Export Report to PDF', () => {
    let {
        loginPage,
        libraryPage,
        share,
        infoWindow,
        dossierPage,
        pdfExportWindow,
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
    const exportReportUncheckPageBy = '4FDEB086915C4970992A584BAC79EB38';
    const defaultAppID = 'C2B2023642F6753A2EF159A75E0CFF29';

    beforeAll(async () => {
        await browser.setWindowSize(1600, 1200);
        await loginPage.login({username: 'auto_report', password: 'newman1#'});
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC98620_1] Check PDF export settings of Report_PageBy for application exportReportDefault ', async () => {
        await dossierPage.openCustomAppById({ id: exportReportDefaultAppID });
        await libraryPage.waitForLibraryLoading();

        // Share menu
        await libraryPage.openReportNoWait(report_PageBy.name);
        await dossierPage.waitForDossierLoading();
        await share.openSharePanel();
        await share.openExportPDFSettingsWindow();
        const pdfExportDialog = pdfExportWindow.getReportExportPDFPanel();
        await checkElementByImageComparison(
            pdfExportDialog,
            'T4969/export/pdf',
            'TC98620_1-Share_Default',
            1
        );
        await pdfExportWindow.clickReportShareMenuExportButton();
        const filepath_SharePanel = path.join(downloadDirectory, `${report_PageBy.name}.pdf`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath_SharePanel, 15000);
        await renameFile(downloadDirectory, `${report_PageBy.name}.pdf`, `TC98620_1_${report_PageBy.name}_SharePanel_appDefault.pdf` )
        await dossierPage.goToLibrary();

        // Info window
        await libraryPage.moveDossierIntoViewPort(report_PageBy.name);
        await libraryPage.openDossierInfoWindow(report_PageBy.name);
        await infoWindow.exportRSD();
        const filepath_InfoWindow = path.join(downloadDirectory, `${report_PageBy.name}.pdf`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath_InfoWindow, 5000);
        await renameFile(downloadDirectory, `${report_PageBy.name}.pdf`, `TC98620_1_${report_PageBy.name}_InfoWindow_appDefault.pdf` )
        await dossierPage.goToLibrary();

        // list view
        await dossierPage.goToLibrary();
        await listView.selectListViewMode();
        await listView.openInfoWindowFromListView(report_PageBy.name);
        await listView.clickExportPDFIcon();
        const filepath_ListView = path.join(downloadDirectory, `${report_PageBy.name}.pdf`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath_ListView, 5000);
        await renameFile(downloadDirectory, `${report_PageBy.name}.pdf`, `TC98620_1_${report_PageBy.name}_ListView_appDefault.pdf` )
        await dossierPage.goToLibrary();
        await listView.deselectListViewMode();

    });

    it('[TC98620_2] Check PDF export settings of Report_NoPageBy for application exportReportDefault ', async () => {
        await dossierPage.openCustomAppById({ id: exportReportDefaultAppID });
        await libraryPage.waitForLibraryLoading();

        // Share menu
        await libraryPage.openReportNoWait(report_NoPageBy.name);
        await dossierPage.waitForDossierLoading();
        await share.openSharePanel();
        await share.openExportPDFSettingsWindow();
        const pdfExportDialog = pdfExportWindow.getReportExportPDFPanel();
        await checkElementByImageComparison(
            pdfExportDialog,
            'T4969/export/pdf',
            'TC98620_2-Share_Default',
            1
        );
        await pdfExportWindow.clickReportShareMenuExportButton();
        const filepath_SharePanel = path.join(downloadDirectory, `${report_NoPageBy.name}.pdf`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath_SharePanel, 15000);
        await renameFile(downloadDirectory, `${report_NoPageBy.name}.pdf`, `TC98620_2_${report_NoPageBy.name}_SharePanel_appDefault.pdf` )
        await dossierPage.goToLibrary();

        // Info window
        await libraryPage.moveDossierIntoViewPort(report_NoPageBy.name);
        await libraryPage.openDossierInfoWindow(report_NoPageBy.name);
        await infoWindow.exportRSD();
        const filepath_InfoWindow = path.join(downloadDirectory, `${report_NoPageBy.name}.pdf`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath_InfoWindow, 5000);
        await renameFile(downloadDirectory, `${report_NoPageBy.name}.pdf`, `TC98620_2_${report_NoPageBy.name}_InfoWindow_appDefault.pdf` )
        await dossierPage.goToLibrary();

        // list view
        await dossierPage.goToLibrary();
        await listView.selectListViewMode();
        await listView.openInfoWindowFromListView(report_NoPageBy.name);
        await listView.clickExportPDFIcon();
        const filepath_ListView = path.join(downloadDirectory, `${report_NoPageBy.name}.pdf`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath_ListView, 5000);
        await renameFile(downloadDirectory, `${report_NoPageBy.name}.pdf`, `TC98620_2_${report_NoPageBy.name}_ListView_appDefault.pdf` )
        await dossierPage.goToLibrary();
        await listView.deselectListViewMode();

    });

    it('[TC98620_3] Check PDF export settings of Report_PageBy for application uncheckPageBy ', async () => {
        await dossierPage.openCustomAppById({ id: exportReportUncheckPageBy });
        await libraryPage.waitForLibraryLoading();

        // Share menu
        await libraryPage.openReportNoWait(report_PageBy.name);
        await dossierPage.waitForDossierLoading();
        await share.openSharePanel();
        await share.openExportPDFSettingsWindow();
        const pdfExportDialog = pdfExportWindow.getReportExportPDFPanel();
        await checkElementByImageComparison(
            pdfExportDialog,
            'T4969/export/pdf',
            'TC98620_3-Share_Default',
            1
        );
        await pdfExportWindow.clickReportShareMenuExportButton();
        const filepath_SharePanel = path.join(downloadDirectory, `${report_PageBy.name}.pdf`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath_SharePanel, 15000);
        await renameFile(downloadDirectory, `${report_PageBy.name}.pdf`, `TC98620_3_${report_PageBy.name}_SharePanel_appUncheckPageBy.pdf` )
        await dossierPage.goToLibrary();

        // Info window
        await libraryPage.moveDossierIntoViewPort(report_PageBy.name);
        await libraryPage.openDossierInfoWindow(report_PageBy.name);
        await infoWindow.exportRSD();
        const filepath_InfoWindow = path.join(downloadDirectory, `${report_PageBy.name}.pdf`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath_InfoWindow, 5000);
        await renameFile(downloadDirectory, `${report_PageBy.name}.pdf`, `TC98620_3_${report_PageBy.name}_InfoWindow_appUncheckPageBy.pdf` )
        await dossierPage.goToLibrary();

        // list view
        await dossierPage.goToLibrary();
        await listView.selectListViewMode();
        await listView.openInfoWindowFromListView(report_PageBy.name);
        await listView.clickExportPDFIcon();
        const filepath_ListView = path.join(downloadDirectory, `${report_PageBy.name}.pdf`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath_ListView, 5000);
        await renameFile(downloadDirectory, `${report_PageBy.name}.pdf`, `TC98620_3_${report_PageBy.name}_ListView_appUncheckPageBy.pdf` )
        await dossierPage.goToLibrary();
        await listView.deselectListViewMode();

    });

    it('[TC98620_4] Check PDF export settings of Report_NoPageBy for application uncheckPageBy ', async () => {
        await dossierPage.openCustomAppById({ id: exportReportUncheckPageBy });
        await libraryPage.waitForLibraryLoading();

        // Share menu
        await libraryPage.openReportNoWait(report_NoPageBy.name);
        await dossierPage.waitForDossierLoading();
        await share.openSharePanel();
        await share.openExportPDFSettingsWindow();
        const pdfExportDialog = pdfExportWindow.getReportExportPDFPanel();
        await checkElementByImageComparison(
            pdfExportDialog,
            'T4969/export/pdf',
            'TC98620_4-Share_Default',
            1
        );
        await pdfExportWindow.clickReportShareMenuExportButton();
        const filepath_SharePanel = path.join(downloadDirectory, `${report_NoPageBy.name}.pdf`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath_SharePanel, 15000);
        await renameFile(downloadDirectory, `${report_NoPageBy.name}.pdf`, `TC98620_4_${report_NoPageBy.name}_SharePanel_appUncheckPageBy.pdf` )
        await dossierPage.goToLibrary();

        // Info window
        await libraryPage.moveDossierIntoViewPort(report_NoPageBy.name);
        await libraryPage.openDossierInfoWindow(report_NoPageBy.name);
        await infoWindow.exportRSD();
        const filepath_InfoWindow = path.join(downloadDirectory, `${report_NoPageBy.name}.pdf`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath_InfoWindow, 5000);
        await renameFile(downloadDirectory, `${report_NoPageBy.name}.pdf`, `TC98620_4_${report_NoPageBy.name}_InfoWindow_appUncheckPageBy.pdf` )
        await dossierPage.goToLibrary();

        // list view
        await dossierPage.goToLibrary();
        await listView.selectListViewMode();
        await listView.openInfoWindowFromListView(report_NoPageBy.name);
        await listView.clickExportPDFIcon();
        const filepath_ListView = path.join(downloadDirectory, `${report_NoPageBy.name}.pdf`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath_ListView, 5000);
        await renameFile(downloadDirectory, `${report_NoPageBy.name}.pdf`, `TC98620_4_${report_NoPageBy.name}_ListView_appUncheckPageBy.pdf` )
        await dossierPage.goToLibrary();
        await listView.deselectListViewMode();

    });

    it('[TC98620_5] Check PDF export settings of Report_PageBy with manipulations ', async () => {
        await dossierPage.openCustomAppById({ id: exportReportDefaultAppID });
        await libraryPage.waitForLibraryLoading();

        // Share menu
        await libraryPage.openReportNoWait(report_PageBy.name);
        await dossierPage.waitForDossierLoading();
        await share.openSharePanel();
        await share.openExportPDFSettingsWindow();
        const pdfExportDialog_Before = pdfExportWindow.getReportExportPDFPanel();
        await checkElementByImageComparison(
            pdfExportDialog_Before,
            'T4969/export/pdf',
            'TC98620_5-Share_Before',
            1
        );
        await pdfExportWindow.clickExpandPageBy();
        await share.openExportPDFSettingsWindow();
        await libraryPage.sleep(1000);
        await share.openExportPDFSettingsWindow();
        const pdfExportDialog_After = pdfExportWindow.getReportExportPDFPanel();
        await checkElementByImageComparison(
            pdfExportDialog_After,
            'T4969/export/pdf',
            'TC98620_5-Share_After',
            1
        );
        await pdfExportWindow.clickReportShareMenuExportButton();
        const filepath_SharePanel = path.join(downloadDirectory, `${report_PageBy.name}.pdf`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath_SharePanel, 15000);
        await renameFile(downloadDirectory, `${report_PageBy.name}.pdf`, `TC98620_5_${report_PageBy.name}_SharePanel.pdf` )
        await dossierPage.goToLibrary();

    });
    
});