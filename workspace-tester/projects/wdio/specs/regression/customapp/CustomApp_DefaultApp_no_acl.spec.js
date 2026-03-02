import setWindowSize from '../../../config/setWindowSize.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import { browserWindow } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import * as consts from '../../../constants/customApp/info.js';
import { humanResourceAnalysis } from '../../../constants/snapshot.js';
import { getCustomizedItems } from '../../../constants/customApp/customAppBody.js';
import { getRequestBody } from '../../../constants/customApp/bot.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('No permission to default app', () => {
    let { libraryPage, dossierPage, loginPage } = browsers.pageObj1;
    const testCredentials = consts.noDefaultAppAclTestUser.credentials;
    let customAppId;
    // redirect to first available app by alphabetical order case-sensitive
    const appName = `---AAA-TC99496`;

    beforeAll(async () => {
        await loginPage.login(testCredentials);
        const customizedItems = getCustomizedItems('v5');
        const customAppObj = getRequestBody({
            name: appName,
            customizedItems: { ...customizedItems, use_application_name_as_library_title: true },
        });
        customAppId = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: customAppObj,
        });
    });

    beforeEach(async () => {
        await setWindowSize(browserWindow);
    });

    afterAll(async () => {
        customAppId &&
            (await deleteCustomAppList({
                credentials: consts.mstrUser.credentials,
                customAppIdList: [customAppId],
            }));
        customAppId = null;
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
    });

    it('[TC99496_01] navigate to default app by no acl', async () => {
        await libraryPage.openDefaultApp();
        const currentUrl = await libraryPage.currentURL();
        await since(
            `1. It should redirect to available app ${customAppId} by name ${appName} , instead it does not redirect to it.`
        )
            .expect(currentUrl)
            .toContain(customAppId);
        await since(`2. library home title should be #{expected} after remove app acl, instead we have #{actual}.`)
            .expect(await libraryPage.getTitle().getText())
            .toContain(appName);
    });

    it('[TC99496_02] navigate to dashboard by default app by no acl', async () => {
        await libraryPage.openDossierById(
            {
                projectId: humanResourceAnalysis.project.id,
                dossierId: humanResourceAnalysis.id,
            },
            false
        );
        await dossierPage.waitForCurtainDisappear();
        const currentUrl = await libraryPage.currentURL();
        await since(
            `1. It should redirect to available app ${customAppId} by name ${appName} , instead it does not redirect to it.`
        )
            .expect(currentUrl)
            .toContain(customAppId);
        await takeScreenshotByElement(dossierPage.getNavigationBar(), 'TC99496_02_01', 'HR dashboard toolbar');
    });
});
