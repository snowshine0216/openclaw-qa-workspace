import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';

describe('Export - Test privileges of export functions', () => {

    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1000,
        height: 800
    };

    const dossier = {
        id: '59DB5DB4A442FA7EA01D34BC21215D8A',
        name: '(AUTO) Export - Dossier',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const dossierFile = {
        name: dossier.name,
        fileType: '.pdf'
    };

    const RSD = {
        id: 'C6170D284606E65E982F5E93AD180CF5',
        name: '(AUTO) Export - RSD',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    let baseVisualization, dossierPage, grid, infoWindow, libraryPage, pdfExportWindow, search, share, toc,checkboxFilter, filterPanel, userAccount, loginPage, showDataDialog;
    let dockMode = false;

    beforeAll(async () => {
        ({
            baseVisualization,
            dossierPage,
            grid,
            libraryPage,
            infoWindow,
            pdfExportWindow,
            search,
            toc,
            share,
            filterPanel,
            checkboxFilter,
            userAccount,
            loginPage,
            showDataDialog

        } = browsers.pageObj1);
        await setWindowSize(browserWindow);
    });

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login({username: 'nee_auto', password: ''});
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: {username: 'nee_auto', password: ''},
            dossier: dossier,
        });
   });

    it('[TC31788_exportAll] Check Privileges for Exporting in All Formats in Library', async () => {
        //Logout and login using account nee_auto
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'nee_auto', password: ''});

        //Check export privilege from info window
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        since('User have PDF export privilege, Export to PDF enabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isExportPDFEnabled()).toBe(true);
        since('User have Google Sheets export privilege, Export to Google Sheets enabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isExportGoogleSheetsEnabled()).toBe(true);
        since('User have Excel export privilege, Export to Excel enabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isExportExcelEnabled()).toBe(true);
        since('User have CSV export privilege, Export to CSV enabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isExportCSVEnabled()).toBe(true);
        await infoWindow.close();

        //Open a Dossier
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();

        //Check export privilege from share panel
        await dossierPage.openShareDropDown();
        //await takeScreenshot('TC31788_exportAll', 'Entry_Share panel');
        since('User have PDF export privilege, the PDF Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoPDFPresent()).toBe(true);
        since('User have Excel export privilege, the Excel Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoExcelPresent()).toBe(true);
        since('User have Google Sheets export privilege, the Google Sheets Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoGoogleSheetsPresent()).toBe(true);
        since('User have CSV export privilege, the CSV Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoCSVPresent()).toBe(true);
        await share.closeSharePanel();

        //Check export privilege from single visualization entry
        await baseVisualization.selectExportOnVisualizationMenu('Attribute < 50%');
        //await takeScreenshot('TC31788_exportAll', 'Entry_Visualization');
        since('User have Excel export privilege, the Excel export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.isVisualizationExportTypePresent('Excel')).toBe(true);
        since('User have PDF export privilege, the PDF export button is supposed to be #{expected}, instead we have #{actual}.')
           .expect(await baseVisualization.isVisualizationExportTypePresent('PDF')).toBe(true);
        since('User have Data export privilege, the Data export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.isVisualizationExportTypePresent('Data')).toBe(true);
        since('User have Data export privilege, the Data export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.isVisualizationExportTypePresent('Google Sheets')).toBe(true);
        //Check export privilege from entry Show Data
        await baseVisualization.selectShowDataOnVisualizationMenu('Attribute > 50%');
        await baseVisualization.showDataDialog.clickShowDataExportButton();
        await dossierPage.sleep(1000);
        //await takeScreenshot('TC31788_exportAll', 'Entry_ShowData');
        since('User have Data export privilege, the Data export button is supposed to be #{expected}, instead we have #{actual}.')
             .expect(await baseVisualization.showDataDialog.isShowDataExportTypePresent('Data')).toBe(true);
        since('User have Excel export privilege, the Excel export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.showDataDialog.isShowDataExportTypePresent('Excel')).toBe(true);
        since('User have PDF export privilege, the PDF export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.showDataDialog.isShowDataExportTypePresent('PDF')).toBe(true);
        await baseVisualization.showDataDialog.clickShowDataCloseButton();

        await dossierPage.goToLibrary();
        await libraryPage.reload();


    });

    it('[TC31788_exportExcel] Check Privileges for Exporting Excel in Library', async () => {
        //Logout and login using account exportExcel
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'exportExcel', password: ''});

        //Check export privilege from info window
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        since('User do not have PDF export privilege, Export to PDF enabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isExportPDFEnabled()).toBe(false);
        since('User do not have CSV export privilege, Export to CSV enabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isExportCSVEnabled()).toBe(false);
        since('User do not have Google Sheets export privilege, Export to Google Sheets enabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isExportGoogleSheetsEnabled()).toBe(false);
        since('User have Excel export privilege, Export to Excel enabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isExportExcelEnabled()).toBe(true);                    
        await infoWindow.close();

        //Open a Dossier
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();

        //Check export privilege from share panel
        await dossierPage.openShareDropDown();
        //await takeScreenshot('TC31788_exportExcel', 'Entry_Share panel');
        since('User do not have PDF export privilege, the PDF Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoPDFPresent()).toBe(false);
        since('User have Excel export privilege, the Excel Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoExcelPresent()).toBe(true);
        since('User do not have CSV export privilege, the CSV Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoCSVPresent()).toBe(false);
        since('User do not have Google Sheets export privilege, the Google Sheets Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoGoogleSheetsPresent()).toBe(false);
        await share.closeSharePanel();

        //Check export privilege from entry single visualization
        await baseVisualization.selectExportOnVisualizationMenu('Attribute < 50%');
        //await takeScreenshot('TC31788_exportExcel', 'Entry_Visualization');
        since('User have Excel export privilege, the Excel export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.isVisualizationExportTypePresent('Excel')).toBe(true);
        since('User do not have PDF export privilege, the PDF export button is supposed to be #{expected}, instead we have #{actual}.')
           .expect(await baseVisualization.isVisualizationExportTypePresent('PDF')).toBe(false);
        since('User do not have Data export privilege, the Data export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.isVisualizationExportTypePresent('Data')).toBe(false);
        since('User do not have Google Sheets export privilege, the Google Sheets export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.isVisualizationExportTypePresent('Google Sheets')).toBe(false);
        //Check export privilege from entry Show Data
        await baseVisualization.selectShowDataOnVisualizationMenu('Attribute > 50%');
        await baseVisualization.showDataDialog.clickShowDataExportButton();
        //await takeScreenshot('TC31788_exportExcel', 'Entry_ShowData');
        since('User have Excel export privilege, the Excel export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.showDataDialog.isShowDataExportTypePresent('Excel')).toBe(true);
        since('User do not have PDF export privilege, the PDF export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.showDataDialog.isShowDataExportTypePresent('PDF')).toBe(false);
        since('User do not have Data export privilege, the Data export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.showDataDialog.isShowDataExportTypePresent('Data')).toBe(false);
        await baseVisualization.showDataDialog.clickShowDataCloseButton();

        await dossierPage.goToLibrary();
        await libraryPage.reload();


    });

    it('[TC31788_exportPDF] Check Privileges for Exporting PDF in Library', async () => {
        //Logout and login using account exportPDF
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'exportPDF', password: ''});

        //Check export privilege from info window
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        since('User have PDF export privilege, Export to PDF enabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isExportPDFEnabled()).toBe(true);
        await infoWindow.close();

        //Open a Dossier
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();

        //Check export privilege from share panel
        await dossierPage.openShareDropDown();
        //await takeScreenshot('TC31788_exportPDF', 'Entry_Share panel');
        since('User have PDF export privilege, the PDF Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoPDFPresent()).toBe(true);
        since('User do not have Excel export privilege, the Excel Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoExcelPresent()).toBe(false);
        since('User do not have CSV export privilege, the CSV Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoCSVPresent()).toBe(false);
        since('User do not have Google Sheets export privilege, the Google Sheets Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoGoogleSheetsPresent()).toBe(false);
        await share.closeSharePanel();

        //Check export privilege from entry single visualization
        await baseVisualization.selectExportOnVisualizationMenu('Attribute < 50%');
        //await takeScreenshot('TC31788_exportPDF', 'Entry_Visualization');
        since('User do not have Excel export privilege, the Excel export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.isVisualizationExportTypePresent('Excel')).toBe(false);
        since('User have PDF export privilege, the PDF export button is supposed to be #{expected}, instead we have #{actual}.')
           .expect(await baseVisualization.isVisualizationExportTypePresent('PDF')).toBe(true);
        since('User do not have Data export privilege, the Data export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.isVisualizationExportTypePresent('Data')).toBe(false);
        since('User do not have Google Sheets export privilege, the Google Sheets export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.isVisualizationExportTypePresent('Google Sheets')).toBe(false);
        //Check export privilege from entry Show Data
        await baseVisualization.selectShowDataOnVisualizationMenu('Area Chart');
        await baseVisualization.showDataDialog.clickShowDataExportButton();
        //await takeScreenshot('TC31788_exportPDF', 'Entry_ShowData');

        since('User do not have Excel export privilege, the Excel export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.showDataDialog.isShowDataExportTypePresent('Excel')).toBe(false);
        since('User have PDF export privilege, the PDF export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.showDataDialog.isShowDataExportTypePresent('PDF')).toBe(true);
        since('User do not have Data export privilege, the Data export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.showDataDialog.isShowDataExportTypePresent('Data')).toBe(false);
        await baseVisualization.showDataDialog.clickShowDataCloseButton();

        await dossierPage.goToLibrary();
        await libraryPage.reload();


    });

    it('[TC31788_exportText] Check Privileges for Exporting Text in Library', async () => {
        //Logout and login using account exportText
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'exportText', password: ''});

        //Check export privilege from info window
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        since('User do not have PDF export privilege, the PDF Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoPDFPresent()).toBe(false);
        since('User do not have Excel export privilege, the Excel Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoExcelPresent()).toBe(false);
        since('User have CSV export privilege, the CSV Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoCSVPresent()).toBe(true);
        since('User do not have Google Sheets export privilege, the Google Sheets Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoGoogleSheetsPresent()).toBe(false);
        await infoWindow.close();

        //Open a Dossier
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();

        //Check export privilege from share panel
        await dossierPage.openShareDropDown();
        //await takeScreenshot('TC31788_exportText', 'Entry_Share panel');
        since('User do not have PDF export privilege, the PDF Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoPDFPresent()).toBe(false);
        since('User do not have Excel export privilege, the Excel Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoExcelPresent()).toBe(false);
        since('User do have CSV export privilege, the CSV Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoCSVPresent()).toBe(true);   
        since('User do not have Google Sheets export privilege, the Google Sheets Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoGoogleSheetsPresent()).toBe(false);                     
        await share.closeSharePanel();

        //Check export privilege from entry single visualization
        await baseVisualization.selectExportOnVisualizationMenu('Attribute < 50%');
        //await takeScreenshot('TC31788_exportText', 'Entry_Visualization');
        since('User do not have Excel export privilege, the Excel export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.isVisualizationExportTypePresent('Excel')).toBe(false);
        since('User do not have PDF export privilege, the PDF export button is supposed to be #{expected}, instead we have #{actual}.')
           .expect(await baseVisualization.isVisualizationExportTypePresent('PDF')).toBe(false);
        since('User have Data export privilege, the Data export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.isVisualizationExportTypePresent('Data')).toBe(true);
        since('User do not have Google Sheets export privilege, the Google Sheets export button is supposed to be #{expected}, instead we have #{actual}.')
           .expect(await baseVisualization.isVisualizationExportTypePresent('Google Sheets')).toBe(false);
        //Check export privilege from entry Show Data
        await baseVisualization.selectShowDataOnVisualizationMenu('Attribute > 50%');
        await baseVisualization.showDataDialog.clickShowDataExportButton();
        await dossierPage.sleep(1000);
        //await takeScreenshot('TC31788_exportText', 'Entry_ShowData');
        since('User have Data export privilege, the Data export button is supposed to be #{expected}, instead we have #{actual}.')
             .expect(await baseVisualization.showDataDialog.isShowDataExportTypePresent('Data')).toBe(true);
        since('User do not have Excel export privilege, the Excel export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.showDataDialog.isShowDataExportTypePresent('Excel')).toBe(false);
        since('User do not have PDF export privilege, the PDF export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.showDataDialog.isShowDataExportTypePresent('PDF')).toBe(false);
        await baseVisualization.showDataDialog.clickShowDataCloseButton();

        await dossierPage.goToLibrary();
        await libraryPage.reload();


    });

    it('[TC31788_exportGoogleSheets] Check Privileges for Exporting Google Sheets in Library', async () => {
        //Logout and login using account exportGoogleSheets
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'exportGoogleSheets', password: 'newman1#'});

        //Check export privilege from info window
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        since('User do not have PDF export privilege, the PDF Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoPDFPresent()).toBe(false);
        since('User do not have Excel export privilege, the Excel Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoExcelPresent()).toBe(false);
        since('User do not have CSV export privilege, the CSV Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoCSVPresent()).toBe(false);
        since('User have Google Sheets export privilege, the Google Sheets Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoGoogleSheetsPresent()).toBe(true);
        await infoWindow.close();

        //Open a Dossier
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();

        //Check export privilege from share panel
        await dossierPage.openShareDropDown();
        //await takeScreenshot('TC31788_exportText', 'Entry_Share panel');
        since('User do not have PDF export privilege, the PDF Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoPDFPresent()).toBe(false);
        since('User do not have Excel export privilege, the Excel Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoExcelPresent()).toBe(false);
        since('User do not have CSV export privilege, the CSV Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoCSVPresent()).toBe(false);   
        since('User have Google Sheets export privilege, the Google Sheets Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoGoogleSheetsPresent()).toBe(true);                     
        await share.closeSharePanel();

        //Check export privilege from entry single visualization
        await baseVisualization.selectExportOnVisualizationMenu('Attribute < 50%');
        //await takeScreenshot('TC31788_exportText', 'Entry_Visualization');
        since('User do not have Excel export privilege, the Excel export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.isVisualizationExportTypePresent('Excel')).toBe(false);
        since('User do not have PDF export privilege, the PDF export button is supposed to be #{expected}, instead we have #{actual}.')
           .expect(await baseVisualization.isVisualizationExportTypePresent('PDF')).toBe(false);
        since('User do not have Data export privilege, the Data export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.isVisualizationExportTypePresent('Data')).toBe(false);
        since('User have Google Sheets export privilege, the Google Sheets export button is supposed to be #{expected}, instead we have #{actual}.')
           .expect(await baseVisualization.isVisualizationExportTypePresent('Google Sheets')).toBe(true);
        //Check export privilege from entry Show Data
        await baseVisualization.selectShowDataOnVisualizationMenu('Attribute > 50%');
        await dossierPage.sleep(1000);
        since('User do not have available export privilege, the Show Data Export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.showDataDialog.isShowDataExportButtonAvailable()).toBe(false);
        await baseVisualization.showDataDialog.clickShowDataCloseButton();
        await dossierPage.goToLibrary();
        await libraryPage.reload();


    });

    it('[TC31788_NoExportPrivilege] Check Privileges for NoExportPrivilege user in Library', async () => {
        //Logout and login using account NoExportPrivilege
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'NoExportPrivilege', password: ''});

        //Check export privilege from info window
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        since('User do not have PDF export privilege, the PDF Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoPDFPresent()).toBe(false);
        since('User do not have Excel export privilege, the Excel Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoExcelPresent()).toBe(false);
        since('User do not have CSV export privilege, the CSV Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoCSVPresent()).toBe(false);
        since('User do not have Google Sheets export privilege, the Google Sheets Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoGoogleSheetsPresent()).toBe(false);
        await infoWindow.close();

        //Open a Dossier
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();

        //Check export privilege from share panel
        await dossierPage.openShareDropDown();
        //await takeScreenshot('TC31788_NoExportPrivilege', 'Entry_Share panel');
        since('User do not have PDF export privilege, the PDF Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoPDFPresent()).toBe(false);
        since('User do not have Excel export privilege, the Excel Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoExcelPresent()).toBe(false);
        since('User do not have CSV export privilege, the CSV Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoCSVPresent()).toBe(false);
        since('User do not have Google Sheets export privilege, the Google Sheets Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoGoogleSheetsPresent()).toBe(false);
        await share.closeSharePanel();

        //Check export privilege from entry single visualization
        await baseVisualization.openMenuOnVisualization('Attribute < 50%');
        //await takeScreenshot('TC31788_NoExportPrivilege', 'Entry_Visualization');
        since('User do not have Excel export privilege, the Excel export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.isVisualizationExportTypePresent('Excel')).toBe(false);
        since('User do not have PDF export privilege, the PDF export button is supposed to be #{expected}, instead we have #{actual}.')
           .expect(await baseVisualization.isVisualizationExportTypePresent('PDF')).toBe(false);
        since('User do not have Data export privilege, the Data export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.isVisualizationExportTypePresent('Data')).toBe(false);
        since('User do not have Google Sheets export privilege, the Google Sheets export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.isVisualizationExportTypePresent('Google Sheets')).toBe(false);
        //Check export privilege from entry Show Data
        await baseVisualization.selectShowDataOnVisualizationMenu('Attribute > 50%');
        await dossierPage.sleep(1000);
        //await takeScreenshot('TC31788_NoExportPrivilege', 'Entry_ShowData');
        since('User do not have export privilege, the Show Data Export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.showDataDialog.isShowDataExportButtonAvailable()).toBe(false);
        await baseVisualization.showDataDialog.clickShowDataCloseButton();

        await dossierPage.goToLibrary();
        await libraryPage.reload();

    });

    it('[TC56136_RSD_exportAll] Check Privileges for RSD Exporting in Library', async () => {
        //Logout and login using account nee_auto
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'nee_auto', password: ''});

        //Check export privilege from info window
        await libraryPage.moveDossierIntoViewPort(RSD.name);
        await libraryPage.openDossierInfoWindow(RSD.name);
        //await takeScreenshot('TC56136_RSD_exportAll', 'Entry_InfoWindow');
        since('User have PDF export privilege, Export to PDF enabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isExportPDFEnabled()).toBe(true);
        await infoWindow.close();

        //Open a Document
        await libraryPage.openDossier(RSD.name);
        await dossierPage.waitForDossierLoading();

        //Check export privilege from single visualization entry
        await pdfExportWindow.OpenDocumentSingleVisualizationMenuButton('Simple Report Display Sample Report');
        await dossierPage.sleep(1000);
        //await takeScreenshot('TC56136_RSD_exportAll', 'Entry_Visualization');
        since('User have Excel export privilege, the Excel export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isRSDExportTypePresent('Export to Excel')).toBe(true);
        since('User have PDF export privilege, the PDF export button is supposed to be #{expected}, instead we have #{actual}.')
           .expect(await pdfExportWindow.isRSDExportTypePresent('Export to PDF')).toBe(true);

        //Check export privilege from share panel
        await dossierPage.openShareDropDown();
        //await takeScreenshot('TC56136_RSD_exportAll', 'Entry_Share panel');
        since('User have PDF export privilege, the PDF Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoPDFPresent()).toBe(true);

        await dossierPage.goToLibrary();
        await libraryPage.reload();

    });

    it('[TC56136_RSD_exportExcel] Check Privileges for RSD Exporting in Library', async () => {
        //Logout and login using account exportExcel
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'exportExcel', password: ''});

        //Check export privilege from info window
        await libraryPage.moveDossierIntoViewPort(RSD.name);
        await libraryPage.openDossierInfoWindow(RSD.name);
        //await takeScreenshot('TC56136_RSD_exportExcel', 'Entry_InfoWindow');
        since('User do not have PDF export privilege, Export to PDF enabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isExportPDFEnabled()).toBe(false);
        await infoWindow.close();

        //Open a Document
        await libraryPage.openDossier(RSD.name);
        await dossierPage.waitForDossierLoading();

        //Check export privilege from single visualization entry
        await pdfExportWindow.OpenDocumentSingleVisualizationMenuButton('Simple Report Display Sample Report');
        await dossierPage.sleep(1000);
        //await takeScreenshot('TC56136_RSD_exportExcel', 'Entry_Visualization');
        since('User have Excel export privilege, the Excel export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isRSDExportTypePresent('Export to Excel')).toBe(true);
        since('User do not have PDF export privilege, the PDF export button is supposed to be #{expected}, instead we have #{actual}.')
           .expect(await pdfExportWindow.isRSDExportTypePresent('Export to PDF')).toBe(false);

        //Check export privilege from share panel
        await dossierPage.openShareDropDown();
        //await takeScreenshot('TC56136_RSD_exportExcel', 'Entry_Share panel');
        since('User do not have PDF export privilege, the PDF Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoPDFPresent()).toBe(false);

        await dossierPage.goToLibrary();
        await libraryPage.reload();

    });

    it('[TC56136_RSD_exportPDF] Check Privileges for RSD Exporting in Library', async () => {
        //Logout and login using account exportPDF
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'exportPDF', password: ''});

        //Check export privilege from info window
        await libraryPage.moveDossierIntoViewPort(RSD.name);
        await libraryPage.openDossierInfoWindow(RSD.name);
        //await takeScreenshot('TC56136_RSD_exportPDF', 'Entry_InfoWindow');
        since('User have PDF export privilege, Export to PDF enabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isExportPDFEnabled()).toBe(true);
        await infoWindow.close();

        //Open a Document
        await libraryPage.openDossier(RSD.name);
        await dossierPage.waitForDossierLoading();

        //Check export privilege from single visualization entry
        await pdfExportWindow.OpenDocumentSingleVisualizationMenuButton('Simple Report Display Sample Report');
        await dossierPage.sleep(1000);
        //await takeScreenshot('TC56136_RSD_exportPDF', 'Entry_Visualization');
        since('User do not have Excel export privilege, the Excel export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isRSDExportTypePresent('Export to Excel')).toBe(false);
        since('User have PDF export privilege, the PDF export button is supposed to be #{expected}, instead we have #{actual}.')
           .expect(await pdfExportWindow.isRSDExportTypePresent('Export to PDF')).toBe(true);

        //Check export privilege from share panel
        await dossierPage.openShareDropDown();
        //await takeScreenshot('TC56136_RSD_exporPDF', 'Entry_Share panel');
        since('User have PDF export privilege, the PDF Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoPDFPresent()).toBe(true);

        await dossierPage.goToLibrary();
        await libraryPage.reload();

    });

    it('[TC56136_RSD_NoExportPrivilege] Check Privileges for RSD Exporting in Library', async () => {
        //Logout and login using account NoExportPrivilege
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'NoExportPrivilege', password: ''});

        //Check export privilege from info window
        await libraryPage.moveDossierIntoViewPort(RSD.name);
        await libraryPage.openDossierInfoWindow(RSD.name);
        //await takeScreenshot('TC56136_RSD_NoExportPrivilege', 'Entry_InfoWindow');
        since('User do not have PDF export privilege, Export to PDF enabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isExportPDFEnabled()).toBe(false);
        await infoWindow.close();

        //Open a Document
        await libraryPage.openDossier(RSD.name);
        await dossierPage.waitForDossierLoading();

        //Check export privilege from single visualization entry
        await dossierPage.sleep(1000);
        //await takeScreenshot('TC56136_RSD_NoExportPrivilege', 'Entry_Visualization');
        since('User do not have export privilege, the export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isRSDExportButtonPresent('Simple Report Display Sample Report')).toBe(false);

        //Check export privilege from share panel
        await dossierPage.openShareDropDown();
        //await takeScreenshot('TC56136_RSD_NoExportPrivilege', 'Entry_Share panel');
        since('User do not have PDF export privilege, the PDF Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoPDFPresent()).toBe(false);

        await dossierPage.goToLibrary();
        await libraryPage.reload();

    });
});
