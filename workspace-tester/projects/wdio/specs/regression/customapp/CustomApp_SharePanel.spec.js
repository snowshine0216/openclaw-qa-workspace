import setWindowSize from '../../../config/setWindowSize.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import * as consts from '../../../constants/customApp/info.js';
import resetBookmarks from '../../../api/resetBookmarks.js';

describe('Custom App - Granular Control - Share Panel', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    const mobileWindow = {
        browserInstance: browsers.browser1,
        width: 599,
        height: 640,
    };

    let { loginPage, dossierPage, libraryPage, share, bookmark, toc, infoWindow, baseVisualization, hamburgerMenu } =
        browsers.pageObj1;

    let customAppIdDisableExport,
        customAppIdDisableExportPDF,
        customAppIdDisableSharePanel,
        customAppIdDisableDownload,
        customAppIdDisableSubscribe;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(consts.appUser.credentials);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await setWindowSize(browserWindow);
        await libraryPage.waitForItemLoading();
    });

    afterAll(async () => {
        // await libraryPage.openDefaultApp();
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [
                customAppIdDisableExport,
                customAppIdDisableExportPDF,
                customAppIdDisableSharePanel,
                customAppIdDisableDownload,
                customAppIdDisableSubscribe,
            ],
        });
    });

    // verify disable export data
    it('[TC90087_01] Check disable export data and excel', async () => {
        // create app
        customAppIdDisableExport = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableExport,
        });

        await libraryPage.openCustomAppById({ id: customAppIdDisableExport });
        // dossier / rsd / report -> info window -> export data, export to excel
        await libraryPage.openDossierInfoWindow(consts.testedDossier.name);
        await since(
            'Export to excel button in dossier info window is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.isExportExcelButtonPresent())
            .toBe(false);
        await infoWindow.close();

        await libraryPage.openDossierInfoWindow(consts.customVizRSD.name);
        await since(
            'Export to excel button in RSD info window is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.isExportExcelButtonPresent())
            .toBe(false);
        await infoWindow.close();

        await libraryPage.openDossierInfoWindow(consts.simpleReport.name);
        await since(
            'Export to excel button in Report info window is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.isExportExcelButtonPresent())
            .toBe(false);
        await infoWindow.close();

        // share panel -> export to excel
        await libraryPage.openDossier(consts.testedDossier.name);
        await dossierPage.waitForDossierLoading();
        await share.openSharePanel();
        await since('Export to excel button in share panel is expected to be #{expected}, instead we have #{actual}.')
            .expect(await share.getExportExcelButton().isDisplayed())
            .toBe(false);
        await share.closeSharePanel();

        // viz -> export data
        await toc.openPageFromTocMenu({ chapterName: 'link to itself', pageName: 'link to current page' });
        await baseVisualization.hoverWithoutWait({
            elem: baseVisualization.getVisualizationMenuButton('open in this tab'),
        });
        await baseVisualization.openVisualizationMenu({
            elem: baseVisualization.getVisualizationMenuButton('open in this tab'),
        });
        // expand export menu
        await baseVisualization.clickMenuOptionInLevel({
            level: 0,
            option: 'Export',
        });
        // assert export type 'data' is disabled
        await since('Export button in viz context menu is expected to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.getVisuazliationExportTypeButton('Data').isDisplayed())
            .toBe(false);

        // open show data panel
        await baseVisualization.clickMenuOptionInLevel({
            level: 0,
            option: 'Show Data',
        });
        await dossierPage.waitForDossierLoading();
        // open share button in show data diagloue
        await baseVisualization.showDataDialog.clickShowDataExportButton();
        // assert export data and export to excel are disabled
        await since('Export button in viz-show data is expected to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.showDataDialog.getShowDataExportTypeButton('Data').isDisplayed())
            .toBe(false);
        await since('Export Excel button in viz-show data should to #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.showDataDialog.getShowDataExportTypeButton('Excel').isDisplayed())
            .toBe(false);
        await baseVisualization.showDataDialog.clickShowDataCloseButton();

        // mobile view -> share panel -> export to excel
        // set windows size to be mobile view
        await setWindowSize(mobileWindow);
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickHamburgerMenu();
        await hamburgerMenu.clickShare();
        await since(
            'Export to excel button disabled in mobile view is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await hamburgerMenu.getButtonInMobileView('Export to Excel').isDisplayed())
            .toBe(false);
    });

    //  verify disable export pdf
    it('[TC90087_02] Check disable export pdf', async () => {
        customAppIdDisableExportPDF = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableExportPDF,
        });

        await libraryPage.openCustomAppById({ id: customAppIdDisableExportPDF });
        // dossier / rsd / report -> info window -> export pdf
        await libraryPage.openDossierInfoWindow(consts.testedDossier.name);
        await since(
            'Export to pdf button in dossier info wdinow is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.getExportPDFButton().isDisplayed())
            .toBe(false);
        await infoWindow.close();

        await libraryPage.openDossierInfoWindow(consts.customVizRSD.name);
        await since('Export to pdf button in RSD info window is expected to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.getExportPDFButton().isDisplayed())
            .toBe(false);
        await infoWindow.close();

        await libraryPage.openDossierInfoWindow(consts.simpleReport.name);
        await since(
            'Export to pdf button in Report info window is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.getExportPDFButton().isDisplayed())
            .toBe(false);
        await infoWindow.close();

        // // share panel -> export to excel
        await libraryPage.openDossier(consts.testedDossier.name);
        await dossierPage.waitForDossierLoading();
        await share.openSharePanel();
        await since('Export to pdf button in share panel is expected to be #{expected}, instead we have #{actual}.')
            .expect(await share.isExportPDFPresent())
            .toBe(false);
        await share.closeSharePanel();

        // viz -> export data
        await toc.openPageFromTocMenu({ chapterName: 'link to itself', pageName: 'link to current page' });
        await baseVisualization.hover({ elem: baseVisualization.getVisualizationMenuButton('open in this tab') });
        await baseVisualization.openVisualizationMenu({
            elem: baseVisualization.getVisualizationMenuButton('open in this tab'),
        });
        // expand export menu
        await baseVisualization.clickMenuOptionInLevel({
            level: 0,
            option: 'Export',
        });
        // assert export to pdf is disabled
        await since('Export to pdf in viz context menu is expected to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.getVisuazliationExportTypeButton('PDF').isDisplayed())
            .toBe(false);

        // open show data panel
        await baseVisualization.clickMenuOptionInLevel({
            level: 0,
            option: 'Show Data',
        });
        // open share button in show data diagloue
        await baseVisualization.showDataDialog.clickShowDataExportButton();
        // assert export data and export to excel are disabled
        await since('Export pdf in viz-show data is expected to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.showDataDialog.getShowDataExportTypeButton('PDF').isDisplayed())
            .toBe(false);
        await baseVisualization.showDataDialog.clickShowDataCloseButton();

        // mobile view -> share panel -> export to pdf
        // set windows size to be mobile view
        await setWindowSize(mobileWindow);
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickHamburgerMenu();
        await hamburgerMenu.clickShare();
        await since(
            'Export to PDF button disabled in mobile view is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await hamburgerMenu.getButtonInMobileView('Export to PDF').isDisplayed())
            .toBe(false);
    });

    // verify disable share
    it('[TC90087_03] Check disable share', async () => {
        customAppIdDisableSharePanel = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableSharePanel,
        });

        await resetBookmarks({
            credentials: consts.appUser.credentials,
            dossier: consts.financialAnalysisDossier,
        });

        await libraryPage.openCustomAppById({ id: customAppIdDisableSharePanel });
        // dossier / rsd / report -> info window -> disable share
        await libraryPage.openDossierInfoWindow(consts.testedDossier.name);
        await since('Share button in dossier info window is expected to be #{expected}, instead we have #{actual}.')
            .expect(await share.getShareDossierButton().isDisplayed())
            .toBe(false);
        await infoWindow.close();

        await libraryPage.openDossierInfoWindow(consts.customVizRSD.name);
        await since('Share button in RSD info window is expected to be #{expected}, instead we have #{actual}.')
            .expect(await share.getShareDossierButton().isDisplayed())
            .toBe(false);
        await infoWindow.close();

        await libraryPage.openDossierInfoWindow(consts.simpleReport.name);
        await since('Share button in Report info window is expected to be #{expected}, instead we have #{actual}.')
            .expect(await share.getShareDossierButton().isDisplayed())
            .toBe(false);
        await infoWindow.close();

        await libraryPage.openDossier(consts.testedDossier.name);
        await dossierPage.waitForDossierLoading();
        await share.openSharePanel();
        await since('Share dossier button in share panel is expected to be #{expected}, instead we have #{actual}.')
            .expect(await share.getShareDossierButton().isDisplayed())
            .toBe(false);
        await share.closeSharePanel();

        // create bookmark and check share button is disable
        await bookmark.openPanel();
        await bookmark.addNewBookmark('test disable share');
        await bookmark.hover({ elem: bookmark.getBookmark('test disable share', 'MY BOOKMARKS') });
        // verify share button is disable
        await since('Share button in bookmark panel is expected to be #{expected}, instead we have #{actual}.')
            .expect(await bookmark.getShareByName('test disable share', 'MY BOOKMARKS').isDisplayed())
            .toBe(false);
        await bookmark.closePanel();

        // add mobile view -> share panel -> share button
        await setWindowSize(mobileWindow);
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickHamburgerMenu();
        await hamburgerMenu.clickShare();
        await since(
            'Share Dossier button disabled in mobile view is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await hamburgerMenu.getButtonInMobileView('Share Dashboard').isDisplayed())
            .toBe(false);
    });

    it('[TC90087_04] Check disable download', async () => {
        customAppIdDisableDownload = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableDownload,
        });

        await libraryPage.openCustomAppById({ id: customAppIdDisableDownload });
        // dossier / rsd / report -> info window -> disable download
        await libraryPage.openDossierInfoWindow(consts.testedDossier.name);
        await since('Download button in dossier info window is expected to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.getDownloadDossierButton().isDisplayed())
            .toBe(false);
        await infoWindow.close();

        await libraryPage.openDossier(consts.testedDossier.name);
        await dossierPage.waitForDossierLoading();
        await share.openSharePanel();
        await since('Download button in share panel is expected to be #{expected}, instead we have #{actual}.')
            .expect(await share.getDownloadDossierButton().isDisplayed())
            .toBe(false);
        // await share.closeSharePanel();

        // add mobile view -> share panel -> download button
        await setWindowSize(mobileWindow);
        await dossierPage.waitForDossierLoading();
        // await dossierPage.clickHamburgerMenu();
        // await hamburgerMenu.clickShare();
        await since(
            'Download Dossier button disabled in mobile view is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await hamburgerMenu.getButtonInMobileView('Download Dashboard').isDisplayed())
            .toBe(false);
    });

    it('[TC90087_05] Check disable subscription', async () => {
        customAppIdDisableSubscribe = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableSubscribe,
        });

        await libraryPage.openCustomAppById({ id: customAppIdDisableSubscribe });
        await libraryPage.openDossier(consts.testedDossier.name);
        await share.openSharePanel();
        await since('Subscribe button in share panel is expected to be #{expected}, instead we have #{actual}.')
            .expect(await share.getSubscribeButton().isDisplayed())
            .toBe(false);

        // add mobile view -> share panel -> download button
        await setWindowSize(mobileWindow);
        await dossierPage.waitForDossierLoading();
        await since(
            'Subscribe to Dossier button disabled in mobile view is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await hamburgerMenu.getButtonInMobileView('Subscribe to Dashboard').isDisplayed())
            .toBe(false);
    });
});
