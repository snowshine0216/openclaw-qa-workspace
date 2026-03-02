import { exportFrontendUser } from '../../../constants/bot.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { waitForFileExists } from '../../../utils/compareImage.js';
import path from 'path';
import { reverse } from 'dns';
export const downloadDirectory = (() => path.join(process.cwd(), 'downloads'))();
import { isFileNotEmpty, getFileSize, deleteFile } from '../../../config/folderManagement.js';
import { dossier } from '../../../constants/teams.js';

describe('Export - Export Report to CSV', () => {
    let {
        loginPage,
        libraryPage,
        share,
        infoWindow,
        dossierPage,
        librarySearch,
        fullSearch,
        listView,
        toc,
        hamburgerMenu,
        csvExportPanel,
        listViewAGGrid,
    } = browsers.pageObj1;

    let mockedCSVRequest;

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
 
    beforeAll(async () => {
        await browser.setWindowSize(1600, 1200);
        await loginPage.login({username: 'auto_report', password: 'newman1#'});
        mockedCSVRequest = await browser.mock('http://**/csv');
    });

    afterEach(async() =>{
        mockedCSVRequest.clear();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[F38421_1] Export Report_PageBy to CSV from Info Window', async () => {
        await deleteFile({name: report_PageBy.name,fileType:'.csv'});
        await libraryPage.waitForLibraryLoading();
        await libraryPage.moveDossierIntoViewPort(report_PageBy.name);
        await libraryPage.openDossierInfoWindow(report_PageBy.name);
        await infoWindow.clickExportCSVButton();
        const csvExportPanel_default = csvExportPanel.getInfoWindowCSVExportDialog();
        await checkElementByImageComparison(
            csvExportPanel_default,
            'T4969/export/csv',
            'F38421_1-InfoWindow_Default',
            1
        );
        await csvExportPanel.clickExportPageByInfoCheckbox();
        await csvExportPanel.clickCSVDelimiterDropdown();
        await csvExportPanel.clickDelimiterOption('Colon');
        const csvExportPanel_update = csvExportPanel.getInfoWindowCSVExportDialog();
        await checkElementByImageComparison(
            csvExportPanel_update,
            'T4969/export/csv',
            'F38421_2-InfoWindow_Update',
            1
        );
        await csvExportPanel.clickInfoWindowExportButton();
        const filepath = path.join(downloadDirectory, `${report_PageBy.name}.csv`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath, 15000);
        since(`The csv file for ${report_PageBy.name} was not downloaded`)
            .expect(await isFileNotEmpty({name:report_PageBy.name,fileType:'.csv'})).toBe(true);
        const postData = csvExportPanel.getRequestPostData(mockedCSVRequest.calls[0]);
        since('Entire report is exported, it is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toEqual("ALL"); 
        since('Separator is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.separator).toEqual(":");
        await dossierPage.goToLibrary();   
    });

    it('[F38421_2] Modify export option and export Report_PageBy to CSV from Share Panel', async () => {
        await libraryPage.openReportNoWait(report_PageBy.name);
        await dossierPage.waitForDossierLoading();
        await share.openSharePanel();
        await share.openExportCSVSettingsWindow();
        const csvExportPanel_default = csvExportPanel.getReportCsvPanel();
        await checkElementByImageComparison(
            csvExportPanel_default,
            'T4969/export/csv',
            'F38421_2-Share-Default',
            1
        );  
        await csvExportPanel.clickExportPageByInfoCheckbox();
        await csvExportPanel.clickExpandPageByCheckbox();
        await csvExportPanel.clickCSVDelimiterDropdown();
        await csvExportPanel.clickDelimiterOption('Tab');
        const csvExportPanel_update = csvExportPanel.getReportCsvPanel();
        await checkElementByImageComparison(
            csvExportPanel_update,
            'T4969/export/csv',
            'F38421_2-Share-Update',
            1
        );
        await csvExportPanel.clickReportExportButton();
        await libraryPage.sleep(3000);
        const postData = csvExportPanel.getRequestPostData(mockedCSVRequest.calls[0]);
        since('Current page is exported, the pageOption is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toEqual("CURRENT"); 
        since('IncludePageByInfo is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includePageByInfo).toEqual(false);  
        since('Separator is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.separator).toEqual("\t");    
        await dossierPage.goToLibrary();
    });

    it('[F38421_3]  Modify export option and export Report_NoPageBy to CSV from Share Panel', async () => {
        await libraryPage.openReportNoWait(report_NoPageBy.name);
        await dossierPage.waitForDossierLoading();
        await share.openSharePanel();
        await share.openExportCSVSettingsWindow();
        const csvExportPanel_default = csvExportPanel.getReportCsvPanel();
        await checkElementByImageComparison(
            csvExportPanel_default,
            'T4969/export/csv',
            'F38421_3-Share-Default',
            1
        );  
        await csvExportPanel.clickCSVDelimiterDropdown();
        await csvExportPanel.clickDelimiterOption('Other');
        await csvExportPanel.inputDelimiter('H');
        const csvExportPanel_update = csvExportPanel.getReportCsvPanel();
        await checkElementByImageComparison(
            csvExportPanel_update,
            'T4969/export/csv',
            'F38421_3-Share-Update',
            1
        );
        await csvExportPanel.clickReportExportButton();
        await libraryPage.sleep(3000);
        const postData = csvExportPanel.getRequestPostData(mockedCSVRequest.calls[0]);
        since('Current page is exported, the pageOption is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toEqual("ALL"); 
        since('IncludePageByInfo is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includePageByInfo).toEqual(true);  
        since('Separator is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.separator).toEqual("H");    
        await dossierPage.goToLibrary();
    });

    it('[F38421_4] Export Report_NoPageBy to CSV from List View Info Window', async () => {
        await deleteFile({name: report_NoPageBy.name,fileType:'.csv'});
        await listView.selectListViewMode();
        await listViewAGGrid.moveDossierIntoViewPortAGGrid(report_NoPageBy.name);
        await listViewAGGrid.clickInfoWindowIconInGrid(report_NoPageBy.name);
        await csvExportPanel.clickExportCSVButton();
        const csvExportPanel_default = csvExportPanel.getInfoWindowCSVExportDialog();
        await checkElementByImageComparison(
            csvExportPanel_default,
            'T4969/export/csv',
            'F38421_4-ListView_IW_Default',
            1
        );
        await csvExportPanel.clickExportPageByInfoCheckbox();
        await csvExportPanel.clickCSVDelimiterDropdown();
        await csvExportPanel.clickDelimiterOption('Space');
        const csvExportPanel_update = csvExportPanel.getInfoWindowCSVExportDialog();
        await checkElementByImageComparison(
            csvExportPanel_update,
            'T4969/export/csv',
            'F38421_4-ListView_IW_Update',
            1
        );
        await csvExportPanel.clickInfoWindowExportButton();
        const filepath = path.join(downloadDirectory, `${report_NoPageBy.name}.csv`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath, 15000);
        since(`The csv file for ${report_NoPageBy.name} was not downloaded`)
            .expect(await isFileNotEmpty({name:report_NoPageBy.name,fileType:'.csv'})).toBe(true);
        const postData = csvExportPanel.getRequestPostData(mockedCSVRequest.calls[0]);
        since('Entire report is exported, it is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toEqual("ALL"); 
        since('IncludePageByInfo is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includePageByInfo).toEqual(false);  
        since('Separator is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.separator).toEqual(" ");
        await dossierPage.goToLibrary();   
    });

    it('[F38421_5] Export Report_PageBy to CSV from Context Menu in List View', async () => {
        await deleteFile({name: report_PageBy.name,fileType:'.csv'});
        await listView.selectListViewMode();
        await listView.selectListViewMode();
        await listViewAGGrid.moveDossierIntoViewPortAGGrid(report_PageBy.name);
        await listViewAGGrid.clickContextMenuIconInGrid(report_PageBy.name);
        await csvExportPanel.hoverOnContextMenuShareItem();
        await listView.sleep(1000);
        await csvExportPanel.clickExportToCsvItemInContextMenu();
        await checkElementByImageComparison(
            csvExportPanel.getInfoWindowCSVExportDialog(),
            'T4969/export/csv',
            'F38421_5-ContextMenu_IW_Default',
            1
        );
        await csvExportPanel.clickExportPageByInfoCheckbox();
        await csvExportPanel.sleep(1000);
        await csvExportPanel.clickExportPageByInfoCheckbox();
        const csvExportPanel_update = csvExportPanel.getInfoWindowCSVExportDialog();
        await checkElementByImageComparison(
            csvExportPanel_update,
            'T4969/export/csv',
            'F38421_5-ContextMenu_IW_Update',
            1
        );
        await csvExportPanel.clickInfoWindowExportButton();
        const filepath = path.join(downloadDirectory, `${report_PageBy.name}.csv`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath, 15000);
        since(`The csv file for ${report_PageBy.name} was not downloaded`)
            .expect(await isFileNotEmpty({name:report_PageBy.name,fileType:'.csv'})).toBe(true);
        const postData = csvExportPanel.getRequestPostData(mockedCSVRequest.calls[0]);
        since('Entire report is exported, it is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toEqual("ALL");
        since('IncludePageByInfo is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includePageByInfo).toEqual(true);  
        since('Separator is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.separator).toEqual(",");
        await dossierPage.goToLibrary(); 

    });

});