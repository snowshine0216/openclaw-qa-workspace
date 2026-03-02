import { exportFrontendUser } from '../../../constants/bot.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.ts';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { waitForFileExists } from '../../../utils/compareImage.js';
import path from 'path';
import { reverse } from 'dns';
export const downloadDirectory = (() => path.join(process.cwd(), 'downloads'))();
import { isFileNotEmpty, getFileSize, deleteFile } from '../../../config/folderManagement.js';
import { dossier } from '../../../constants/teams.js';

describe('Export - Export Dashboard to CSV', () => {
    let {
        loginPage,
        libraryPage,
        share,
        infoWindow,
        dossierPage,
        csvExportPanel,
        librarySearch,
        fullSearch,
        listView,
        toc,
        hamburgerMenu,
    } = browsers.pageObj1;

    let mockedCSVRequest;

    const dossier_Auto_Mix = {
        id: '5E39858640B089CA01D358984C711974',
        name: 'Auto_Mix',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };
 
    const dossier_Auto_TitleBarExport = {
        id: '06E7258048E33F77B3CECF88CE98DE99',
        name: 'Auto_TitleBarExport',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    beforeAll(async () => {
        await browser.setWindowSize(1200, 800);
        await resetDossierState({
            credentials: {
                username: 'auto_frontend',
                password: 'newman1#',
            },
            dossier: dossier_Auto_Mix,
        });
        await loginPage.login(exportFrontendUser);
        mockedCSVRequest = await browser.mock('http://**/csv');
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: {
                username: 'auto_frontend',
                password: 'newman1#',
            },
            dossier: dossier_Auto_Mix,
        });
    });

    afterEach(async() =>{
        mockedCSVRequest.clear();
    });

    it('[F41877] Export visualization to CSV from title bar export button', async () => {
        await browser.setWindowSize(1600, 1200);
        await libraryPage.openDossier(dossier_Auto_TitleBarExport.name);
        await dossierPage.waitForDossierLoading();
        await csvExportPanel.clickTitlebarExportCSVButton('Grid');
        await dossierPage.sleep(1000);
        // Check API request
       const postData = csvExportPanel.getRequestPostData(mockedCSVRequest.calls[0]);
        since('Range is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.displayAttributeForms).toEqual(false); 
        since('Level is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.separator).toEqual(","); 
        since('filterDetails is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.trimSpace).toEqual(false);     
        await dossierPage.goToLibrary();
    });

    it('[TC99102_1] Export dashboard to CSV from Info Window', async () => {
        await libraryPage.moveDossierIntoViewPort(dossier_Auto_Mix.name);
        await libraryPage.openDossierInfoWindow(dossier_Auto_Mix.name);
        await infoWindow.clickExportCSVButton();
        await checkElementByImageComparison(
            csvExportPanel.getInfoWindowCSVExportDialog(),
            'T4969/export/csv',
            'TC99102_1-InfoWindow-CSVExportDialog-Default',
            1
        );

        await csvExportPanel.clickCSVDelimiterDropdown();
        await csvExportPanel.clickDelimiterOption('Colon');
        await checkElementByImageComparison(
            csvExportPanel.getInfoWindowCSVExportDialog(),
            'T4969/export/csv',
            'TC99102_2-InfoWindow-CSVExportDialog_Update',
            1
        );
        await csvExportPanel.clickInfoWindowExportButton();
        const filepath = path.join(downloadDirectory, `${dossier_Auto_Mix.name}.zip`);
        await libraryPage.sleep(3000);
        await waitForFileExists(filepath, 15000);
        since(`The csv file for ${dossier_Auto_Mix.name} was not downloaded`)
            .expect(await isFileNotEmpty({name:dossier_Auto_Mix.name,fileType:'.zip'})).toBe(true);
        const postData = csvExportPanel.getRequestPostData(mockedCSVRequest.calls[0]);
        since('Entire dashboard is exported, it is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toEqual("ALL"); 
        since('Separator is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.separator).toEqual(":");       
        
        await dossierPage.goToLibrary();   
    });

    it('[TC99102_2] Switch page and check CSV export settings from Share Panel', async () => {
        await libraryPage.openUrl(dossier_Auto_Mix.project.id, dossier_Auto_Mix.id);
        await share.openSharePanel();
        await share.openExportCSVSettingsWindow();
        const exportCSVPanel_Ch4 = csvExportPanel.getExportCSVPanel();
        await checkElementByImageComparison(
            exportCSVPanel_Ch4,
            'T4969/export/csv',
            'TC99102_2-Share-Default-Chapter4',
            1
        );
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 3', pageName: 'non vizs' });
        await share.openSharePanel();
        await share.openExportCSVSettingsWindow();
        const exportCSVPanel_Ch3 = csvExportPanel.getExportCSVPanel();
        await checkElementByImageComparison(
            exportCSVPanel_Ch3,
            'T4969/export/csv',
            'TC99102_2-Share-SwitchToChapter3',
            1
        );
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'grids_graphs_shape_text' });
        await share.openSharePanel();
        await share.openExportCSVSettingsWindow();
        await csvExportPanel.clickCSVDelimiterDropdown();
        await csvExportPanel.clickDelimiterOption('Tab');
        const exportCSVPanel_Ch2 = csvExportPanel.getExportCSVPanel();
        await checkElementByImageComparison(
            exportCSVPanel_Ch2,
            'T4969/export/csv',
            'TC99102_2-Share-SwitchToChapter2',
            1
        );
        
        await csvExportPanel.clickExportButton();
        await libraryPage.sleep(3000);
        const postData = csvExportPanel.getRequestPostData(mockedCSVRequest.calls[0]);
        since('The selected page is exported, the pageOption is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toEqual("DEFAULT"); 
        since('The selected page is exported, the page key is supposed to be #{expected}, instead we have #{actual}.')
			.expect(postData.nodeKeys).toEqual(['K186']);
        since('Separator is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.separator).toEqual("\t");    
          
        await dossierPage.goToLibrary();
    });

    it('[TC99102_3] Modify range and export dashboard to CSV from Share Panel', async () => {
        await libraryPage.openUrl(dossier_Auto_Mix.project.id, dossier_Auto_Mix.id);
        await share.openSharePanel();
        await share.openExportCSVSettingsWindow();
        const exportCSVPanel_Ch4 = csvExportPanel.getExportCSVPanel();
        await checkElementByImageComparison(
            exportCSVPanel_Ch4,
            'T4969/export/csv',
            'TC99102_3-Share-Default-Chapter4',
            1
        );
        await csvExportPanel.clickCSVRangeSetting();
        await csvExportPanel.clickArrowByChapterName('Chapter 1');
        await dossierPage.sleep(1000);
        await csvExportPanel.clickCheckboxByPageName('panelstack');
        await dossierPage.sleep(1000);
        await csvExportPanel.clickArrowByChapterName('Chapter 1');
        await dossierPage.sleep(1000);
        await csvExportPanel.clickCheckboxByChapterName('Chapter 3');
        await dossierPage.sleep(1000);
        await csvExportPanel.clickCheckboxByChapterName('Chapter 4');
        await dossierPage.sleep(1000);
        const rangeList = await csvExportPanel.getRangeDropDownContents();
        await checkElementByImageComparison(rangeList, 'T4969/export/csv', 'TC99102_3-RangeList', 1);
        await csvExportPanel.clickCSVRangeSetting();
        await csvExportPanel.clickCSVDelimiterDropdown();
        await csvExportPanel.clickDelimiterOption('Other');
        await csvExportPanel.inputDelimiter('A');
        const exportCSVPanel_update = csvExportPanel.getExportCSVPanel();
        await checkElementByImageComparison(
            exportCSVPanel_update,
            'T4969/export/csv',
            'TC99102_3-Share-UpdatedRange',
            1
        );
        await csvExportPanel.clickExportButton();
        await libraryPage.sleep(3000);
        const postData = csvExportPanel.getRequestPostData(mockedCSVRequest.calls[0]);
        since('The selected page is exported, the pageOption is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toEqual("DEFAULT"); 
        since('The selected page is exported, the page key is supposed to be #{expected}, instead we have #{actual}.')
			.expect(postData.nodeKeys).toEqual(['W96','W82']) 
        since('Separator is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.separator).toEqual("A");            
        await dossierPage.goToLibrary();await dossierPage.goToLibrary(); 
    });

    it('[TC99102_4] Check default range and export dashboard to CSV in Mobile View', async () => {
        await browser.setWindowSize(400, 1000);
        await libraryPage.openUrl(dossier_Auto_Mix.project.id, dossier_Auto_Mix.id);
        await dossierPage.clickHamburgerMenu();
        await hamburgerMenu.clickShare();
        await hamburgerMenu.clickExportToCSV();
        await checkElementByImageComparison(
            hamburgerMenu.getExportToCSVSettingsPanel(),
            'T4969/export/csv',
            'TC99102_4-MobileView',
            1
        );
        await csvExportPanel.clickExportButton();
        await dossierPage.sleep(3000);
        const postData = csvExportPanel.getRequestPostData(mockedCSVRequest.calls[0]);
        since('The selected page is exported, the pageOption is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toEqual("DEFAULT"); 
        since('The selected page is exported, the page key is supposed to be #{expected}, instead we have #{actual}.')
			.expect(postData.nodeKeys).toEqual(['W83']);
        since('Separator is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.separator).toEqual(","); 
    });

});