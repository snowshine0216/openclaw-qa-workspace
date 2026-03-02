import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { waitForFileExists, deleteFile } from '../../../utils/compareImage.js';
const downloadDirectory = 'downloads';
const specName = 'ExportToPDFDossier';
import path from 'path';

describe('Export - Export a Dossier to PDF', () => {
    const dossier = {
        id: '59DB5DB4A442FA7EA01D34BC21215D8A',
        name: '(AUTO) Export - Dossier',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };


    const dossierWithPrompt = {
        id: 'E20AD04345C6B07C35F30C9D377A678D',
        name: '(AUTO) Export - Dossier with prompt',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const RSD = {
        id: 'C6170D284606E65E982F5E93AD180CF5',
        name: '(AUTO) Export - RSD',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const dossierForSmartDefault = {
        id: '384EB9E143C2EB7EA60D90A1AA98E974',
        name: '(Auto) SmartDefault_PageLink',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const dossierFile = {
        name: dossier.name,
        fileType: '.pdf'
    };

    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1500,
        height: 1200
    };

    const dossier_DE = {
        id: '329C514843E7AFDCD83770813DD31536',
        name: 'Viz_NonViz',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    let {
        loginPage,
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
        excelExportPanel,
    } = browsers.pageObj1;
    let mockedPdfRequest;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login({username: 'nee_auto', password: ''});
        mockedPdfRequest = await browser.mock('https://**/pdf');
    });

    beforeEach(async () => {
        mockedPdfRequest.clear();
        await resetDossierState({
            credentials: {username: 'nee_auto', password: ''},
            dossier: dossier,
        });
    });

    {

    //Entry point: info window

    // [TC56909] Check export icon enabled and show tooltip
    // 1. Open info window of the dossier
    // 2. Check if Export icon exists and is enabled
    // 3. Hover on Export icon
    // 4. Check tooltip text
    // 5. Close info window

    xit('[TC56909] Export to PDF - Check for Export icon enabled and show tooltip', async () => {
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        since('Export to PDF enabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isExportPDFEnabled()).toBe(true);
        since('Tooltip is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.showTooltipOfExportPDFIcon()).toBe('Export to PDF');
        await takeScreenshotByElement(infoWindow.getMainInfo(), 'TC56909_m2021', 'ShowTooltip', {tolerance: 0.8});
        await infoWindow.close();
    });

    // [TC00002] Check for GUI of Export panel and cancel exporting
    // 1. Open info window of the dossier
    // 2. Click Export icon
    // 3. Check if the Export panel display
    // 4. Click Cancel button
    // 5. Check if the Export panel dismiss
    // 6. Close info window

    xit('[TC56910] Export to PDF - Check fo GUI of Export panel and cancel exporting', async () => {
        // await dossierPage.goToLibrary();
        await libraryPage.reload();
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        await infoWindow.openExportPDFSettingsWindow();
        since('Exporting panel displayed is supposed to be #{expected}, instead we have #{actual}')
            .expect(await pdfExportWindow.isLibraryExportPDFSettingsWindowOpen()).toBe(true);
        await takeScreenshotByElement(infoWindow.getInfoWindowExportDetails(), 'TC56910_m2021', 'ExportPanel', {tolerance: 0.8});
        await pdfExportWindow.close();
        since('Exporting panel dismissed is supposed to be #{expected}, instead we have #{actual}')
            .expect(await pdfExportWindow.isLibraryExportPDFSettingsWindowOpen()).toBe(false);
        await infoWindow.close();
    });

    // [TC00003] Check for default export settings and directly export
    // 1. Open info window of the dossier
    // 2. Click Export icon
    // 3. Check the default selections in GUI
    // 4. Click Export button
    // 5. Check if the Export panel dismiss
    // 6. Close info window
    // 7. Check RestAPI request parameters

    xit('[TC56911] Export to PDF - Check for default export settings and directly export', async () => {
        await deleteFile(dossierFile);
        // await dossierPage.goToLibrary();
        await libraryPage.reload();
        //Open Info window
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);

        //Open PDF setting window and export with default settings
        await infoWindow.openExportPDFSettingsWindow();
        since('Exporting panel displayed is supposed to be #{expected}, instead we have #{actual}')
            .expect(await pdfExportWindow.isLibraryExportPDFSettingsWindowOpen()).toBe(true);
        await takeScreenshotByElement(infoWindow.getInfoWindowExportDetails(), 'TC56911_m2021', 'ExportPanel', {tolerance: 0.8});
        await pdfExportWindow.exportSubmitLibrary();
        await infoWindow.waitForDownloadComplete(dossierFile);
        since(`The pdf file for ${dossier.name} was not downloaded`)
            .expect(await isFileNotEmpty(dossierFile)).toBe(true);

        //check API request
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        since('The default setting of Filter Summary is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.filterSummary).toBe('page');
        since('The default setting of Fit to Page is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.fitToPage).toBe(true);
        since('The default setting of Include Detailed Pages is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeDetailedPages).toBe(false);
        since('The default setting of Page Numbers is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeFooter).toBe(true);
        since('The default setting of Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeHeader).toBe(true);
        since('The default setting of Include Overview is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeOverview).toBe(true);
        since('The default setting of Orientation is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.orientation).toBe('NONE');
        since('The default setting of Height of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageHeight).toBe(8.5);
        since('The default setting of Page Option is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toBe('all');
        since('The default setting of Width of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageWidth).toBe(11);
        since('The default setting of Repeat Column Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.repeatColumnHeader).toBe(true);

        await infoWindow.close();

    });


    // [TC00004] Modify settings to check controllers functionality, and then export (By mouse clicking)
    // 1. Open info window of the dossier
    // 2. Click Export icon
    // 3. Modify settings
    // 3a) Detail level
    // 3b) Grid settings
    // 3c) Page size
    // 3d) Orientation
    // 3e) Content settings
    // 4. Click Export button
    // 5. Check if the Export panel dismiss
    // 6. Close info window
    // 7. Check RestAPI request parameters

    xit('[TC56912] Export to PDF - Modify settings to check controllers functionality, and then export', async () => {
        await deleteFile(dossierFile);
        // await dossierPage.goToLibrary();
        await libraryPage.reload();
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);

        //Open PDF setting window and export with default settings
        await infoWindow.openExportPDFSettingsWindow();
        since('Exporting panel displayed is supposed to be #{expected}, instead we have #{actual}')
            .expect(await pdfExportWindow.isLibraryExportPDFSettingsWindowOpen()).toBe(true);
        await takeScreenshotByElement(infoWindow.getInfoWindowExportDetails(), 'TC56912_m2021', 'ExportPanel', {tolerance: 0.3});

        await pdfExportWindow.selectDetailLevel('All visualizations together');
        await pdfExportWindow.selectDetailLevel('Each visualization separately');
        since('The setting of Detail Level is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.detailLevelSelectedItem()).toBe('Each visualization separately');


        // //TODO: Check whether grid setting is enabled

        await pdfExportWindow.selectGridSettings('Extend columns over pages');
        await pdfExportWindow.toggleRepeatAttributeColumnsCheckBox();

        await pdfExportWindow.selectPageSize('B4 13.9" x 9.8"');
        await pdfExportWindow.selectPageSize('Letter 8.5" x 11"');
        since('The setting of Page size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.pageSizeSelectedItem()).toBe('Letter 8.5" x 11"');


        await pdfExportWindow.selectLandscapeOrientation();
        await pdfExportWindow.selectPortraitOrientation();
        since('The setting of Orientation is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isPortraitOrientationButtonSelected()).toBe(true);

        await pdfExportWindow.toggleHeaderCheckBox();
        await pdfExportWindow.togglePageNumbersCheckBox();

        await pdfExportWindow.selectFilterSummary('Both');
        await takeScreenshotByElement(infoWindow.getInfoWindowExportDetails(), 'TC56912_m2021', 'ExportSettings', {tolerance: 0.3});
        await pdfExportWindow.exportSubmitLibrary();


        //check API request
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        since('The setting of Filter Summary is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.filterSummary).toBe('all');
        since('The setting of Fit to Page is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.fitToPage).toBe(false);
        since('The setting of Include Detailed Pages is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeDetailedPages).toBe(true);
        since('The setting of Page Numbers is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeFooter).toBe(false);
        since('The setting of Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeHeader).toBe(false);
        since('The setting of Include Overview is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeOverview).toBe(false);
        since('The setting of Orientation is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.orientation).toBe('NONE');
        since('The setting of Height of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageHeight).toBe(11);
        since('The setting of Page Option is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toBe('all');
        since('The setting of Width of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageWidth).toBe(8.5);
        since('The setting of Repeat Column Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.repeatColumnHeader).toBe(false);

        since(`The pdf file for ${dossier.name} was not downloaded`)
            .expect(await isFileNotEmpty(dossierFile)).toBe(true);

        await infoWindow.close();

        // Reload for initialization customized settings
        await libraryPage.reload();

    });
}

    // entry point: dossier

    // [TC00006] Check for GUI of Export panel and cancel exporting
    // 1. Open dossier
    // 2. Click share icon
    // 3. Open export panel
    // 4. Check if Export panel display
    // 5. Click Export to PDF button again to dismiss Export panel
    // 6. Check if Export Panel dismiss
    // 7. Open export panel
    // 8. Export with default settings
    // 9 Go back to Library
    // 10. Check RestAPI request parameters

    xit('[TC56914] Export to PDF - Check for GUI of Export panel, cancel, and export with default settings', async() => {
        await deleteFile(dossierFile);
        await dossierPage.goToLibrary();
        await libraryPage.reload();
        //Open dossier
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();

        //Open share menu, open export to PDF settings window, and dismiss export panel
        await dossierPage.openShareDropDown();
        await share.openExportPDFSettingsWindow();
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(),'TC56914_m2021', 'OpenExportPDFSettingsWindow', {tolerance: 0.3});
        await share.closeExportPDFSettingsWindow();
        await dossierPage.sleep(1000);
        since('The export panel should dismiss supposed to be #{expected}, instead we have #{actual}. ')
            .expect(await pdfExportWindow.isDossierExportPDFSettingsWindowOpen()).toBe(false);

        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.exportSubmitDossier();
        const filepath = path.join(downloadDirectory, `${dossier.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        await dossierPage.goToLibrary();

        //check API request
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        since('The default setting of Filter Summary is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.filterSummary).toBe('page');
        since('The default setting of Fit to Page is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.fitToPage).toBe(true);
        since('The default setting of Include Detailed Pages is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeDetailedPages).toBe(false);
        since('The default setting of Page Numbers is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeFooter).toBe(true);
        since('The default setting of Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeHeader).toBe(true);
        since('The default setting of Include Overview is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeOverview).toBe(true);
        since('The default setting of Orientation is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.orientation).toBe('NONE');
        since('The default setting of Height of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageHeight).toBe(8.5);
        since('The default setting of Page Option is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toBe('default');
        since('The default setting of Width of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageWidth).toBe(11);
        since('The default setting of Repeat Column Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.repeatColumnHeader).toBe(true);

    });

    // [TC63892] Modify settings to check controllers functionality, and then export
    // 1. Open dossier
    // 2. Click share icon
    // 3. Open export panel
    // 4. Modify settings
    // 5. Go back to Library
    // 6. Open info window > Export panel
    // 7. Export with the settings
    // 8. Check RestAPI request parameters to meet the customized settings

    xit('[TC63892] Export to PDF - Modify settings and check if the customized settings remembered', async() => {
        await deleteFile(dossierFile);
        // Reload for initialization customized settings
        await dossierPage.goToLibrary();
        await libraryPage.reload();

        //Open dossier
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();

        //Open share menu, open export to PDF settings window, and expand advanced settings window
        await dossierPage.openShareDropDown();
        await share.openExportPDFSettingsWindow();
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(),'TC63892_m2021', 'Default settings', {tolerance: 0.3});

        await pdfExportWindow.selectRange('This chapter');
        await pdfExportWindow.selectRange('Entire dashboard');

        await pdfExportWindow.selectDetailLevel('Each visualization separately');
        await pdfExportWindow.clickMoreSettings();

        await pdfExportWindow.selectPageSize('Statement 5.5" x 8.5"');
        await pdfExportWindow.selectPortraitOrientation();

        // To be modified to "All filters at the end" once fix code are merged.
        await pdfExportWindow.selectFilterSummary('All filters after each chapter');
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(),'TC63892_m2021', 'Modify settings', {tolerance: 0.3});
        await dossierPage.goToLibrary();

        //Open info window and check whether the settings are memorized
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);

        //Open PDF setting window and export with default settings
        await infoWindow.openExportPDFSettingsWindow();
        await takeScreenshotByElement(infoWindow.getInfoWindow(), 'TC63892_m2021', 'Customized setting should be memorized', {tolerance: 0.3});
        await pdfExportWindow.exportSubmitLibrary();
        await infoWindow.close();

        //check API request
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        since('The default setting of Filter Summary is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.filterSummary).toBe('page');
        since('The default setting of Fit to Page is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.fitToPage).toBe(true);
        since('The default setting of Include Detailed Pages is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeDetailedPages).toBe(false);
        since('The default setting of Page Numbers is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeFooter).toBe(true);
        since('The default setting of Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeHeader).toBe(true);
        since('The default setting of Include Overview is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeOverview).toBe(true);
        since('The default setting of Orientation is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.orientation).toBe('NONE');
        since('The default setting of Height of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageHeight).toBe(8.5);
        since('The default setting of Page Option is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toBe('all');
        since('The default setting of Width of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageWidth).toBe(5.5);
        since('The default setting of Repeat Column Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.repeatColumnHeader).toBe(true);

        since(`The pdf file for ${dossier.name} was not downloaded`)
            .expect(await isFileNotEmpty(dossierFile)).toBe(true);
    });

    //Export RSD
    xit('[TC58930] Export to PDF - Verify Export RSD from info Window', async() => {
        await dossierPage.goToLibrary();
        await libraryPage.reload();
        //Open Info window
        await libraryPage.moveDossierIntoViewPort(RSD.name);
        await libraryPage.openDossierInfoWindow(RSD.name);

        //Open PDF setting window and export with default settings
        await infoWindow.exportRSD();
        await infoWindow.close();

        //check API request
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        since('The default setting of Page Option is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toBe('all');
    });

    xit('[TC58931] Export to PDF - Verify Export RSD from dossier', async() => {
        await dossierPage.goToLibrary();
        await libraryPage.reload();
        //Open RSD
        await libraryPage.openDossier(RSD.name);
        await dossierPage.waitForDossierLoading();

        //Open share menu, open export to PDF settings window, and expand advanced settings window
        await dossierPage.openShareDropDown();
        // since('The privilege of export PDF is supposed to be #{expected}, instead we have #{actual}.')
        //     .expect(await share.isExportPDFEnabled()).toBe(true);
        await share.openExportPDFSettingsWindow();
        await takeScreenshotByElement(pdfExportWindow.getRSDExportDialog(),'TC58931_m2021', 'OpenExportPDFSettingsWindow', {tolerance: 0.3});

        //Click export
        await pdfExportWindow.exportSubmitDossier();
        await share.closeSharePanel();

        //Check API request
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        since('The default setting of Page Option is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toBe('current');


        await dossierPage.goToLibrary();
    });

    xit('[TC61449] Export to PDF - the selector of exporting pdf range in RSD cannot draw back after clicking at the blank space or itself', async() => {
        await dossierPage.goToLibrary();
        await libraryPage.reload();
        //Open RSD
        await libraryPage.openDossier(RSD.name);
        await dossierPage.openShareDropDown();
        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.openRangeDialog();
        since('The range setting dropdown opened is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isRangeDropDownListOpen()).toBe(true);
        await takeScreenshotByElement(pdfExportWindow.getRSDExportDialog(),'TC61449', 'RangeShouldBeOpen', {tolerance: 0.3});
        await pdfExportWindow.getDossierExportPDFPanel().click();
        await dossierPage.sleep(1000);
        //since('The range setting dropdown opened is supposed to be #{expected}, instead we have #{actual}.')
        //    .expect(await pdfExportWindow.isRangeDropDownListOpen()).toBe(false);
        await takeScreenshotByElement(pdfExportWindow.getRSDExportDialog(),'TC61449', 'RangeShouldBeClosed', {tolerance: 0.3});
        await dossierPage.goToLibrary();
    });

    // TC63338] Validation of DE163594: [Library][Export Dialog] Inconsistent string between the selected one and string in list in Info Window of Library
    // 1. Find dossier.
    // 2. Open export Info Window.
    // 3. Select option "All filters after each chapter" for filter summary.
    // 4. Check if the string for selected option is corresponding to the the string in drop-down list.

    xit('[TC63338] Validation of DE163594: [Library][Export Dialog] Inconsistent string between the selected one and string in list in Info Window of Library', async() => {
        //await loginPage.login({username: 'nee_auto', password: 'newman1#'});
        await dossierPage.goToLibrary();
        await libraryPage.reload();
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        await infoWindow.openExportPDFSettingsWindow();
        await pdfExportWindow.selectFilterSummary('All filters after each chapter');
        since('The filter summary setting is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.FilterSummarySelectedItem()).toBe('All filters after each chapter');
        await takeScreenshotByElement(infoWindow.getInfoWindowExportDetails(), 'TC63338_m2021', 'CheckFilter', {tolerance: 0.3});
        await infoWindow.close();
    });


    xit('[TC31788] No Privilege - Ensure Export Button is not displayed', async () => {
        //Logout and login using account without export privilege
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'NoExportPrivilege', password: ''});

        //Open a Dossier and try to export from share panel
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();
        await dossierPage.openShareDropDown();
        await takeScreenshot('TC31788_m2021', 'Export to PDF button should be disabled from Share panel', {tolerance: 0.3});
        since('User do not have export privilege, the Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoPDFPresent()).toBe(false);
        await share.closeSharePanel();

        //Export from single visualization entry - check show data export
        await baseVisualization.selectShowDataOnVisualizationMenu('Attribute > 50%');
        //This icon has been removed from 11.3.1.1390
        //await baseVisualization.showDataDialog.clickShowDataExportButtonNoPrivilege();
        await takeScreenshot('TC31788_m2021', 'Show Data Export button should not exist', {tolerance: 0.3});
        //since('User do not have export privilege, the Show Data Export button is supposed to be #{expected}, instead we have #{actual}.')
        //    .expect(await baseVisualization.isShowDataExportButtonAvailable()).toBe(false);
        await baseVisualization.showDataDialog.clickShowDataCloseButton();

        //Export from single visualization entry - check single viz export
        await baseVisualization.getVisualizationMenuButton('Atrtribute < 50%');
        await takeScreenshot('TC31788_m2021', 'Export button should be disabled from the Single visualization entry', {tolerance: 0.3});
        since('User do not have export privilege, the Export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.isSingleVisualizationExportSpinnerPresent('Attribute > 50%')).toBe(false);

        //Logout and login using admin account to check if export privilege is enabled
        await dossierPage.goToLibrary();
        await dossierPage.openUserAccountMenu();
        await dossierPage.logout();
        await loginPage.login({username: 'administrator', password: ''});
        });


    xit('[TC20889] Export to PDF - Verify Export RSD to PDF with Watermark in Library', async() => {
        await dossierPage.goToLibrary();
        await libraryPage.reload();
        //Open RSD
        await libraryPage.openDossier(RSD.name);
        await dossierPage.waitForDossierLoading();

        //Open share menu, open export to PDF settings window, and expand advanced settings window
        await dossierPage.openShareDropDown();
        await share.openExportPDFSettingsWindow();
        await takeScreenshotByElement(pdfExportWindow.getRSDExportDialog(),'TC20889_m2021', 'OpenExportPDFSettingsWindow', {tolerance: 0.3});

        //Click export
        await pdfExportWindow.exportSubmitDossier();
        await share.closeSharePanel();

        //Check API request
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        since('The default setting of Page Option is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toBe('current');


        await dossierPage.goToLibrary();
    });


    xit('[TC20650] Export to PDF - Verify Export Document from title bar of grid and graph in Library Web', async() => {
        await deleteFile({name: RSD.name,fileType:'.pdf'});
        await dossierPage.goToLibrary();
        await libraryPage.reload();
        //Open RSD
        await libraryPage.openDossier(RSD.name);
        await dossierPage.waitForDossierLoading();

        //Export single visualization to PDF
        await pdfExportWindow.openRSDVisualizationMenu();
        await pdfExportWindow.ExportDocumentSingleVisualization('Export to PDF');
        //await dossierPage.sleep(1000);
        //Check API request
        const filepath = path.join(downloadDirectory, `${RSD.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        since('The default setting of node key is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.nodeKey).toBe('K89');
        since('The default setting of orientation is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.orientation).toBe('AUTO');
        await dossierPage.goToLibrary();
    });


    xit('[TC63944] Background exporting and enhance export status feedback', async() => {
        await dossierPage.goToLibrary();
        await libraryPage.reload();
        //Open dossier
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();

        await dossierPage.openShareDropDown();

        // Export to PDF from share panel
        await share.openExportPDFSettingsWindow();
        // Change default settings and export
        await pdfExportWindow.selectRange('Entire dashboard');
        await pdfExportWindow.selectDetailLevel('Both');
        await pdfExportWindow.clickMoreSettings();
        await pdfExportWindow.selectPageSize('Statement 5.5" x 8.5"');
        await pdfExportWindow.selectPortraitOrientation();
        await pdfExportWindow.selectFilterSummary('Both');
        await pdfExportWindow.getExportButton().click();
        // Check "Exporting..." string and loading spinner, then close Share panel
        since('PDF exporting starts, the Export string is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.getMenuContent(await share.getExportPDFButton())).toBe("Exporting ...");
        since('PDF exporting starts, the Export loading spinner is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExportLoadingSpinnerPresent()).toBe(true);
        await takeScreenshot('TC63944_m2021', 'Export PDF from Share panel', {tolerance: 0.3});
        await share.closeSharePanel();
        //Check exporting spinning icon and make sure icon disappear when export completed
        await pdfExportWindow.waitForExportComplete(dossierFile);
        since(`The pdf file for ${dossier.name} was not downloaded`)
            .expect(await isFileNotEmpty(dossierFile)).toBe(true);
        // Check notification, Open share dropdown and check the string returns to "Export to PDF"
        since('PDF exporting completes, the Notification is supposed to be #{expected}, instead we have {#actual}')
            .expect(await pdfExportWindow.isExportCompleteNotificationPresent()).toBe(true);
        await takeScreenshot('TC63944_m2021', 'Notification: PDF exporting completed', {tolerance: 0.3});
        await dossierPage.openShareDropDown();
        since('PDF exporting completes, the Export string is supposed to be #{expected}, instead we have #{actual}')
            .expect(await pdfExportWindow.getMenuContent(await share.getExportPDFButton())).toBe("Export to PDF");

        // Export to Excel from share panel
        await share.clickExportToExcel();
        await excelExportPanel.selectExcelRange('Grids on this page');
        await excelExportPanel.clickExportButton();

        // check "exporting ..." string
        since('Excel exporting starts, the Export string is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.getMenuContent(await share.getExportExcelButton())).toBe("Exporting ...");
        await share.closeSharePanel();
        await pdfExportWindow.waitForExportComplete(dossierFile);
        since(`The excel file for ${dossier.name} was not downloaded`)
            .expect(await isFileNotEmpty(dossierFile)).toBe(true);
        since('Excel exporting completes, the Notification is supposed to be #{expected}, instead we have #{actual}')
            .expect(await pdfExportWindow.isExportCompleteNotificationPresent()).toBe(true);
        await takeScreenshot('TC63944_m2021', 'Notification: Excel exporting completed', {tolerance: 0.3});
        await dossierPage.openShareDropDown();
        since('Excel exporting finished, the Export string is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.getMenuContent(await share.getExportExcelButton())).toBe("Export to Excel");
        await share.closeSharePanel();

        // Export single visualization to PDF
        await baseVisualization.selectExportToPDFOnVisualizationMenu('Attribute < 50%');
        await pdfExportWindow.getMojoPDFExportButton().click();
        since('Single visualization PDF exporting starts, the loading spinner is supposed to be #{expected}, instead we have #{actual}')
            .expect(await baseVisualization.isSingleVisualizationExportSpinnerPresent('Attribute < 50%')).toBe(true);
        await pdfExportWindow.waitForExportComplete(dossierFile);
        since(`The pdf file for ${dossier.name} was not downloaded`)
            .expect(await isFileNotEmpty(dossierFile)).toBe(true);
        since('Excel exporting completes, the Notification is supposed to be #{expected}, instead we have {#actual}')
            .expect(await pdfExportWindow.isExportCompleteNotificationPresent()).toBe(true);
        // await pdfExportWindow.closeExportCompleteNotification();
        await takeScreenshot('TC63944_m2021', 'Export single visualization');

        // Export single visualization to csv from Show Data entry
        await dossierPage.waitForDossierLoading();
        await baseVisualization.selectShowDataOnVisualizationMenu('Area Chart');
        //await baseVisualization.clickShowDataExportButton();
        await baseVisualization.showDataDialog.clickShowDataExportButton();
        //await baseVisualization.exportDataset('Data');
        await baseVisualization.showDataDialog.exportShowData('Data');
        // Check spinning icon and notification
        await pdfExportWindow.waitForExportComplete(dossierFile);
        since(`The excel file for ${dossier.name} was not downloaded`)
            .expect(await isFileNotEmpty(dossierFile)).toBe(true);
        since ('csv exporting completes, the Notification is supposed to be #{expected}, instead we have #{actual}')
            .expect(await pdfExportWindow.isExportCompleteNotificationPresent()).toBe(true);
        // Close notification
        await pdfExportWindow.closeExportCompleteNotification();
        await baseVisualization.showDataDialog.clickShowDataCloseButton();


        // Backgournd exporting
        await dossierPage.waitForDossierLoading();
        await dossierPage.openShareDropDown();
        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.getExportButton().click();
        since('PDF exporting starts, the Export string is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.getMenuContent(await share.getExportPDFButton())).toBe("Exporting ...");
        await share.clickExportToExcel();
        await excelExportPanel.selectExcelRange('Grids on this page');
        await excelExportPanel.clickExportButton();
        since('Excel exporting starts, the Export string is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.getMenuContent(await share.getExportExcelButton())).toBe("Exporting ...");
        await takeScreenshot('TC63944_m2021', 'Notification: Export PDF and Excel together');

        // Close notification
        await dossierPage.sleep(1000);
        //await pdfExportWindow.closeExportCompleteNotification();
        await dossierPage.sleep(1000);
        //await pdfExportWindow.closeExportCompleteNotification();
        await share.closeSharePanel();
        await dossierPage.goToLibrary();

    });


    xit('[TC82679] Check PDF smart default settings after linking to other page', async() => {
        await resetDossierState({
            credentials: {username: 'nee_auto', password: ''},
            dossier: dossierForSmartDefault
        });
        //Open dossier
        await libraryPage.openDossier(dossierForSmartDefault.name);
        await dossierPage.waitForDossierLoading();

        //Link to C2 P1 - 1 grid
        await textbox.navigateLink(0);
        await dossierPage.openShareDropDown();
        // Check export option
        await share.openExportPDFSettingsWindow();
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(),'TC82679', 'C2P1-1grid', {tolerance: 0.3});
        await share.closeSharePanel();
        // Go back and check export option for no grid/viz
        await dossierPage.clickUndo();
        await dossierPage.waitForItemLoading();
        await dossierPage.openShareDropDown();
        await share.openExportPDFSettingsWindow();
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(),'TC82679', 'C1P1-nogrid/viz', {tolerance: 0.3});
        await share.closeSharePanel();

        //Link to C2 P2 - 1 grid + other
        await dossierPage.sleep(1000);
        await textbox.navigateLink(1);
        /*
        await dossierPage.openShareDropDown();
        // Check export option
        await share.openExportPDFSettingsWindow();
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(),'TC82679', 'C2P2-1grid+other', {tolerance: 0.3});
        await share.closeSharePanel();
       
        // Go back to C1P1
        await dossierPage.clickUndo();
        await dossierPage.waitForItemLoading();
        */
/*

        //Link to C2 P3 - 1 viz
        await textbox.navigateLink(2);
        await dossierPage.openShareDropDown();
        // Check export option
        await share.openExportPDFSettingsWindow();
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(),'TC82679', 'C2P3-1viz', {tolerance: 0.3});
        await share.closeSharePanel();
        // Go back to C1P1
        await dossierPage.clickUndo();
        await dossierPage.waitForItemLoading();

        //Link to C2 P4 - 1 viz + other
        await textbox.navigateLink(3);
        await dossierPage.openShareDropDown();
        // Check export option
        await share.openExportPDFSettingsWindow();
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(),'TC82679', 'C2P4-1viz+other', {tolerance: 0.3});
        await share.closeSharePanel();


        //Click the text box to C4 P1 - Panel Stack grid hidden
        await textbox.navigateLink(0);
        await dossierPage.openShareDropDown();
        // Check export option
        await share.openExportPDFSettingsWindow();
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(),'TC82679', 'C24P1-panelstack-grid-hidden', {tolerance: 0.3});
        await share.closeSharePanel();

        //Click the text box to go back to C1 P1 and check settings again
        await textbox.navigateLink(0);
        await dossierPage.openShareDropDown();
        await share.openExportPDFSettingsWindow();
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(),'TC82679', 'C1P1-nogrid/viz-2', {tolerance: 0.3});
        await share.closeSharePanel();


        //Click the text box to C4 P3 - Panel Stack 1 grid + other
        await textbox.navigateLink(6);
        await dossierPage.openShareDropDown();
        // Check export option
        await share.openExportPDFSettingsWindow();
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(),'TC82679', 'C4P3-panelstack-1grid+other', {tolerance: 0.3});
        await share.closeSharePanel();



        //Click the text box to C4 P5 - Panel Stack 1 viz + other
        await textbox.navigateLink(0);
        await dossierPage.openShareDropDown();
        // Check export option
        await share.openExportPDFSettingsWindow();
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(),'TC82679', 'C4P5-panelstack-1viz+other', {tolerance: 0.3});
        await share.closeSharePanel();

        await dossierPage.goToLibrary();

        */
    });



});
