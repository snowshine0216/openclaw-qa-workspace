import setWindowSize from '../../../config/setWindowSize.js';
import * as consts from '../../../constants/customApp/info.js';
import * as customApp from '../../../constants/customApp/customAppBody.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';

describe('Custom App - Error Handling', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let { loginPage, dossierPage, libraryPage, userAccount } = browsers.pageObj1;

    let customAppIdRSDDeleted, customAppIdPageDeleted, customAppIdCubeNotPublish, customAppIdMultiTab;

    beforeAll(async () => {
        await loginPage.login(consts.appUser.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [
                customAppIdRSDDeleted,
                customAppIdPageDeleted,
                customAppIdCubeNotPublish,
                customAppIdMultiTab,
            ],
        });
    });

    it('[TC76717] Error handling - RSD deleted', async () => {
        // create app
        let rsdDeletedBody = customApp.getCustomAppBody({
            version: 'v1',
            name: 'autoRSDDeleted',
            toolbarMode: 1,
            toolbarEnabled: true,
            dossierMode: 1,
            homeDocumentType: 'document',
            url: `/app/${consts.deleteRSD.projectId}/${consts.deleteRSD.dossierId}`,
        });
        customAppIdRSDDeleted = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: rsdDeletedBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdRSDDeleted, dossier: true });
        await libraryPage.waitForLibraryLoading();

        let errorTitle = await libraryPage.errorTitle();
        let errorMsg = await libraryPage.errorMsg();
        await since('Title of RSD deleted error is expected be #{expected}, instead we have #{actual}.')
            .expect(errorTitle)
            .toBe('Server Error');
        await since('RSD deleted error message is expected be be #{expected}, instead we have #{actual}.')
            .expect(errorMsg)
            .toBe('The item you are trying to access cannot be found. It may have been deleted.');
        await libraryPage.clickErrorActionButton('OK');
        await since(
            'After dismiss RSD deleted  error, tool bar shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getNavigationBar().isDisplayed())
            .toBe(false);
    });

    it('[TC78889] Error handling - Page deleted', async () => {
        // create app
        let pageDeletedBody = customApp.getCustomAppBody({
            version: 'v1',
            name: 'autoPageDeleted',
            dossierMode: 1,
            url: `/app/${consts.pageDeleteDossier.projectId}/${consts.pageDeleteDossier.dossierId}`,
        });
        customAppIdPageDeleted = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: pageDeletedBody,
        });
        await dossierPage.openCustomAppById({ id: customAppIdPageDeleted, dossier: true });
        await libraryPage.waitForLibraryLoading();
        let dossierTitle = await dossierPage.getPageTitle();
        let titleString = await dossierTitle.getText();
        await since('Page contains Page 2 is expected to be #{expected}, instead we have #{actual}.')
            .expect(titleString)
            .toContain('Page 2');
    });

    it('[TC78892] Error handling - Cube Unpublished', async () => {
        // create app
        let cubeNotPublishBody = customApp.getCustomAppBody({
            version: 'v1',
            name: 'autoCubeNotPublish',
            dossierMode: 1,
            toolbarMode: 1,
            toolbarEnabled: true,
            url: `/app/${consts.cubeNotPublishDossier.projectId}/${consts.cubeNotPublishDossier.dossierId}`,
        });
        customAppIdCubeNotPublish = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: cubeNotPublishBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdCubeNotPublish, dossier: true });
        await libraryPage.waitForLibraryLoading();

        let errorTitle = await libraryPage.errorTitle();
        let errorMsg = await libraryPage.errorMsg();
        await since('Title of Cube Unpublished error is expected be #{expected}, instead we have #{actual}.')
            .expect(errorTitle)
            .toBe('Server Error');
        await since('Cube Unpublished error message is expected be #{expected}, instead we have #{actual}.')
            .expect(errorMsg)
            .toBe('One or more datasets are not loaded for this item.');
        await libraryPage.clickErrorActionButton('OK');
        await since(
            'After dissmiss cube not publised error, tool bar shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getNavigationBar().isDisplayed())
            .toBe(false);
    });

    it('[TC78894] Error handling - Multi Tab', async () => {
        // create app
        let multiTabBody = customApp.getCustomAppBody({
            version: 'v1',
            name: 'autoMultiTab',
            sidebarsHomeLibrary: ['all', 'recents', 'my_groups'],
        });
        customAppIdMultiTab = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: multiTabBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdMultiTab });
        await libraryPage.waitForLibraryLoading();
        await libraryPage.switchToNewWindowWithUrl(new URL('auth/ui/loginPage', browser.options.baseUrl).toString());
        await libraryPage.sleep(2000);
        await loginPage.login(consts.app2User.credentials);
        await libraryPage.waitForLibraryLoading();

        await libraryPage.switchToTab(0);
        await libraryPage.openDossierInfoWindow(consts.testedDossier.name);
        let errorTitle = await libraryPage.errorTitle();
        await since('The first tab should throw error #{expected}, instead we have #{actual}.')
            .expect(errorTitle)
            .toBe('Existing Live Session');
        await libraryPage.clickErrorActionButton('Refresh');
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await since('User should be #{expected}, instead we have #{actual}.')
            .expect(await userAccount.getUserAccountName())
            .toBe(consts.app2User.credentials.username);
    });
});
