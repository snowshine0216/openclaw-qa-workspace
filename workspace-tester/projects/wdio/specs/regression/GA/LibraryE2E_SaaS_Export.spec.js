import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import { deleteFile, isFileNotEmpty, findDownloadedFile } from '../../../config/folderManagement.js';

describe('Saas E2E - Check Export Function', () => {
    const dashboard_forExport = {
        id: '2408B9E65B4B71831D8FD2AA48E73301',
        name: 'Marketing Campaigns AI',
        project: {
            id: '69D4DA35264BAA98CC2BF68356064C35',
            name: 'MicroStrategy Tutorial',
        },
    };

    const pdfFile= {
        name: dashboard_forExport.name,
        fileType: '.pdf'
    };
    let { libraryPage, loginPage, infoWindow, excelExportPanel, pdfExportWindow, dossierPage } = browsers.pageObj1;
    let credentials = browsers.params.credentials;

    beforeAll(async () => {
        if (browsers.params.credentials.isPredefined && browsers.params.credentials.isPredefined === 'true') {
            credentials = {
                username: 'saastest.bot@microstrategy.com',
                id: '32BB63B9FF48E38B1531C2AD92057AD2',
                password: 'newman1#',
            };
        }
        console.log(credentials);
        await loginPage.saasLogin(credentials);
        await loginPage.waitForLibraryLoading();
        await setWindowSize(browserWindow);
        await libraryPage.executeScript('window.pendo.stopGuides();');
    });


    it('[TC95116_01] Sanity - Export Dashboard to Excel', async () => {
        await deleteFile({name:'Marketing Campaigns AI',fileType:'.xlsx'});
        await libraryPage.moveDossierIntoViewPort(dashboard_forExport.name);
        await libraryPage.openDossierInfoWindow(dashboard_forExport.name);
        await infoWindow.clickExportExcelButton();
        await excelExportPanel.clickExportButton();
        await infoWindow.waitForDownloadComplete({name:'Marketing Campaigns AI',fileType:'.xlsx'});
        since(`The excel file for ${dashboard_forExport.name} was not downloaded`)
            .expect(await isFileNotEmpty({name:'Marketing Campaigns AI',fileType:'.xlsx'})).toBe(true);
        await infoWindow.close();
        await dossierPage.goToLibrary();
    });

    it('[TC95116_02] Sanity - Export Dashboard to PDF', async () => {
        await deleteFile({name:'Marketing Campaigns AI',fileType:'pdf'});
        await libraryPage.moveDossierIntoViewPort(dashboard_forExport.name);
        await libraryPage.openDossierInfoWindow(dashboard_forExport.name);
        await infoWindow.openExportPDFSettingsWindow();  
        await pdfExportWindow.exportSubmitLibrary();
        await infoWindow.waitForDownloadComplete(pdfFile);
        since(`The pdf file for ${dashboard_forExport.name} was not downloaded`)
            .expect(await isFileNotEmpty(pdfFile)).toBe(true);
        await infoWindow.close();       
        await dossierPage.goToLibrary();
    });

});
