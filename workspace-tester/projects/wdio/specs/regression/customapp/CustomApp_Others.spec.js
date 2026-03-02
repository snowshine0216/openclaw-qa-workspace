import setWindowSize from '../../../config/setWindowSize.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import * as consts from '../../../constants/customApp/info.js';

describe('Custom App - Granular Control - Filter,TOC,recipient in email, new dossier/report', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let { loginPage, dossierPage, libraryPage, toc, tocMenu, libraryAuthoringPage, dossierAuthoringPage } =
        browsers.pageObj1;

    let customAppIdDisableTocHeader,
        customAppIdDisableTocContentInfo,
        customAppIdDisableTocChapterPageName,
        customAppIdDisableNewDossier,
        customAppIdDisableNewReport,
        customAppIdCustomizedEmailAddress;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(consts.appUser.credentials);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [
                customAppIdDisableTocHeader,
                customAppIdDisableTocContentInfo,
                customAppIdDisableTocChapterPageName,
                customAppIdDisableNewDossier,
                customAppIdDisableNewReport,
                customAppIdCustomizedEmailAddress,
            ],
        });
    });

    // verify disable toc header in dossier
    it('[TC90192_01] Check disalbe toc header in dossier', async () => {
        // create app
        customAppIdDisableTocHeader = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableTocHeader,
        });
        await libraryPage.openCustomAppById({ id: customAppIdDisableTocHeader });
        //  run consts.financialAnalysisDossier
        await libraryPage.openDossier(consts.financialAnalysisDossier.name);
        await dossierPage.waitForDossierLoading();
        await toc.openMenu();
        await since('Toc header in dossier is expected to be #{expected}, instead we have #{actual}.')
            .expect(await toc.getTOCTitleName().isDisplayed())
            .toBe(false);
    });

    // verify disable content info in dossier
    it('[TC90192_02] Check disalbe content info in toc', async () => {
        // create app
        customAppIdDisableTocContentInfo = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableTocContentInfo,
        });
        await libraryPage.openCustomAppById({ id: customAppIdDisableTocContentInfo });
        //  run consts.financialAnalysisDossier
        await libraryPage.openDossier(consts.financialAnalysisDossier.name);
        await dossierPage.waitForDossierLoading();
        await toc.openMenu();
        await since('Toc Content info in dossier is expected to be #{expected}, instead we have #{actual}.')
            .expect(await toc.getTocHeader().isDisplayed())
            .toBe(false);
    });

    // verify disable chapter and page name in dossier
    it('[TC90192_03] Check disalbe chapter and page name in toc', async () => {
        // create app
        customAppIdDisableTocChapterPageName = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableTocChapterPageName,
        });
        await libraryPage.openCustomAppById({ id: customAppIdDisableTocChapterPageName });
        //  run consts.financialAnalysisDossier
        await libraryPage.openDossier(consts.financialAnalysisDossier.name);
        await dossierPage.waitForDossierLoading();
        await toc.openMenu();
        await since('Chapter name and page name in dossier is expected to be #{expected}, instead we have #{actual}.')
            .expect(await tocMenu.getMenuList().isDisplayed())
            .toBe(false);
    });

    // verify disable new dossier in library
    it('[TC90192_04] Check disalbe new dossier in library', async () => {
        // create app
        customAppIdDisableNewDossier = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableNewDossier,
        });
        await libraryPage.openCustomAppById({ id: customAppIdDisableNewDossier });

        // click the add buton in library home page will bring you to create new report window
        await libraryAuthoringPage.clickNewDossierIcon();
        // check pop windows's title to be Select Project when new report
        // let title = await libraryAuthoringPage.getProjectSelectionWindowTitle();
        await since('New report window shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryAuthoringPage.getProjectSelectionWindowTitle())
            .toBe('New Report');

        // click cancel button in pop window
        await libraryPage.openCustomAppById({ id: customAppIdDisableNewDossier });
        await libraryPage.waitForLibraryLoading();

        // run dossier and edit it
        await libraryPage.openDossier(consts.financialAnalysisDossier.name);
        // verify edit button exist in dossier page
        await since('Edit button in dossier page is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryAuthoringPage.isEditIconPresent())
            .toBe(true);
        await libraryAuthoringPage.editDossierFromLibrary();

        await dossierAuthoringPage.actionOnMenubar('File');
        await since('Save as in dossier authoring page is expected to be #{expected}, instead we have #{actual}.')
            .expect(await dossierAuthoringPage.getSaveAsDossierButton().isDisplayed())
            .toBe(false);

        await dossierAuthoringPage.goToLibrary();
    });

    // verify disable new report in library
    it('[TC90192_05] Check disalbe new report in library', async () => {
        // create app
        customAppIdDisableNewReport = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableNewReport,
        });
        await libraryPage.openCustomAppById({ id: customAppIdDisableNewReport });

        // click the add buton in library home page will bring you to create new dossier window
        await libraryAuthoringPage.clickNewDossierIcon();
        // check pop windows's title to be Select Project when new dossier
        // let title = await libraryAuthoringPage.getProjectSelectionWindowTitle();
        await since('New dossier window shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryAuthoringPage.getProjectSelectionWindowTitle())
            .toBe('New Dashboard');

        // click cancel button in pop window
        await libraryAuthoringPage.clickCancelButton();

        // run dossier and edit it
        await libraryPage.openDossier(consts.financialAnalysisDossier.name);
        // verify edit button exist in dossier page
        await since('Edit button in dossier page is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryAuthoringPage.isEditIconPresent())
            .toBe(true);
        await libraryAuthoringPage.editDossierFromLibrary();

        await dossierAuthoringPage.actionOnMenubar('File');
        await since('Save as in dossier authoring page is expected to be #{expected}, instead we have #{actual}.')
            .expect(await dossierAuthoringPage.getSaveAsDossierButton().isDisplayed())
            .toBe(true);

        await dossierAuthoringPage.goToLibrary();
    });

    // // verify customized report address
    // it('[TC90192_06] Check customized report address', async () => {
    //     // check share email address in dossier
    //      customAppIdCustomizedEmailAddress = await createCustomApp({
    //          credentials: consts.mstrUser.credentials,
    //          customAppInfo: consts.customizedEmailAddressBody,
    //      });
    //     await libraryPage.openCustomAppById(customAppIdCustomizedEmailAddress);
    //     await libraryPage.openDossier(consts.financialAnalysisDossier.name);
    //     await dossierPage.waitForDossierLoading();
    //     await dossierPage.openSharePanel();
    //     await share.openShareDossierDialog();
    //     // verify email address in share dossier dialog is empty ----
    //     since ('Share email address in dossier is expected to be #{expected}, instead we have #{actual}.')
    //         .expect(await share.getShareEmailAddress()).toBe('');

    //     // close share dialog
    //     await share.closeShareDialog();
    //     await dossierPage.goToLibrary();

    //     // // check share email address in error window - didn't check it because unable to check sender in email client
    //     // await libraryPage.openDossier(errorDossier.name);

    // });
});
