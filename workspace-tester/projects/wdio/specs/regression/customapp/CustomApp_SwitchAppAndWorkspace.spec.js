import setWindowSize from '../../../config/setWindowSize.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import resetObjectAcl from '../../../api/manageAccess/resetObjectAcl.js';
import setObjectAcl from '../../../api/manageAccess/setObjectAcl.js';
import { getUserIdByAPI } from '../../../api/getUserId.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement, takeScreenshot } from '../../../utils/TakeScreenshot.js';
import { scrollIntoView } from '../../../utils/scroll.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import * as consts from '../../../constants/customApp/info.js';
import { getCustomizedItems, getCustomAppBody } from '../../../constants/customApp/customAppBody.js';
import { darkTheme, redTheme, themeWithAppLogo, getRequestBody } from '../../../constants/customApp/bot.js';

describe('Custom app switch app and workspace tests', () => {
    const testCredentials = browsers.params.credentials;
    let { libraryPage, dossierPage, loginPage, userAccount, promptEditor, promptObject, hierarchyPrompt } =
        browsers.pageObj1;
    let customAppId;
    let testUserId;
    let appIdRedTheme;
    const dashboardWithHierarchyPrompt = {
        id: '4443832E4C493351C9F72AAB02469588',
        name: 'DE332568',
        project: { id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754', name: 'MicroStrategy Tutorial' },
    };

    const environments = {
        current: 'perbuild',
        other: [
            {
                id: '1765307197',
                name: 'vra1183620',
                url: 'https://tec-l-1183620.labs.microstrategy.com/MicroStrategyLibrary/',
            },
            {
                id: '1321198429',
                name: 'vra1174208',
                url: 'https://tec-l-1174208.labs.microstrategy.com/MicroStrategyLibrary/app/config/DBF63D6AE96E4C71BCF7F9411B832A85',
            },
        ],
    };

    beforeAll(async () => {
        await loginPage.login(testCredentials);
        testUserId = await getUserIdByAPI({});
    });

    beforeEach(async () => {
        await setWindowSize(browserWindow);
        await libraryPage.openDefaultApp();
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        customAppId &&
            (await deleteCustomAppList({
                credentials: consts.mstrUser.credentials,
                customAppIdList: [customAppId],
            }));
        appIdRedTheme &&
            (await deleteCustomAppList({
                credentials: consts.mstrUser.credentials,
                customAppIdList: [appIdRedTheme],
            }));
        customAppId = null;
        appIdRedTheme = null;
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
    });

    it('[TC97287_01] switch to application disable my applications', async () => {
        const customAppObj = consts.disableMyApplications;
        customAppId = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: customAppObj,
        });
        await libraryPage.openUserAccountMenu();
        await since(
            '1. My applications in account panel is expected to be #{expected} on default app, instead we have #{actual}.'
        )
            .expect(await userAccount.getSwitchApplicationBtn().isDisplayed())
            .toBe(true);
        await libraryPage.refresh();
        await libraryPage.waitForElementVisible(userAccount.getUserAccount());
        await userAccount.openUserAccountMenu();
        await userAccount.openMyApplicationPanel();
        await scrollIntoView(userAccount.getCustomAppByName(customAppObj.name));
        await since(
            `2. Custom app ${customAppObj.name} is expected to be displayed in my applications, instead it does not show.`
        )
            .expect(await userAccount.getCustomAppByName(customAppObj.name).isDisplayed())
            .toBe(true);
        await userAccount.click({ elem: userAccount.getUserAccount() });
        await userAccount.switchCustomApp(customAppObj.name);
        await libraryPage.openUserAccountMenu();
        await since('3. My application in account panel is expected to be #{expected}, instead we have #{actual}.')
            .expect(await userAccount.getSwitchApplicationBtn().isDisplayed())
            .toBe(false);
    });

    it('[TC97287_02] check current selected app when switch app', async () => {
        const customAppObj = consts.libraryHome;
        customAppId = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: customAppObj,
        });
        await libraryPage.openUserAccountMenu();
        await userAccount.openMyApplicationPanel();
        await since('1. Current custom app should be #{expected}, instead we have #{actual}.')
            .expect(await userAccount.getCurrentSelectedCustomAppItem().getText())
            .toBe('Strategy');
        await libraryPage.refresh();
        await userAccount.switchCustomApp(customAppObj.name);
        await libraryPage.openUserAccountMenu();
        await userAccount.openMyApplicationPanel();
        await scrollIntoView(userAccount.getCustomAppByName(customAppObj.name));
        await since('2. Current custom app should be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.userAccount.getCurrentSelectedCustomAppItem().getText())
            .toBe(customAppObj.name);
    });

    it('[TC97287_03] check current selected app when switch app', async () => {
        const customAppObj = getRequestBody({
            name: `custom app dark theme`,
            useColorTheme: true,
            selectedTheme: darkTheme,
        });
        customAppId = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: customAppObj,
        });
        await takeScreenshotByElement(libraryPage.getNavigationBar(), 'TC97287_03_01', 'navigation bar in default app');
        await libraryPage.openUserAccountMenu();
        await libraryPage.refresh();
        await userAccount.switchCustomApp(customAppObj.name);
        await takeScreenshotByElement(
            libraryPage.getNavigationBar(),
            'TC97287_03_02',
            'navigation bar in custom app with dark theme'
        );
    });

    it('[TC97287_04] switch app with app logo', async () => {
        const customAppObj = getRequestBody({
            name: `custom app with logo`,
            useColorTheme: true,
            selectedTheme: themeWithAppLogo,
        });
        customAppId = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: customAppObj,
        });
        await takeScreenshotByElement(libraryPage.getNavigationBar(), 'TC97287_04_01', 'default app logo');
        await libraryPage.openDossier(consts.homeDossier.name);
        await takeScreenshotByElement(libraryPage.getNavigationBar(), 'TC97287_04_02', 'default home logo');
        await libraryPage.openCustomAppById({ id: customAppId });
        await takeScreenshotByElement(libraryPage.getNavigationBar(), 'TC97287_04_03', 'custom app logo');
        await libraryPage.openDossier(consts.homeDossier.name);
        await takeScreenshotByElement(libraryPage.getNavigationBar(), 'TC97287_04_04', 'custom home logo');
    });

    it('[TC97288_01] no workspace entry when no environments added', async () => {
        const customAppObj = getRequestBody({
            name: `custom app workspace no env`,
        });
        customAppId = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: customAppObj,
        });
        await libraryPage.openCustomAppById({ id: customAppId });
        await libraryPage.openUserAccountMenu();
        await since('1. Switch workspace entry should not show, instead it is displayed.')
            .expect(await userAccount.getAccountMenuOption('Switch Workspace').isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(userAccount.getAccountDropdown(), 'TC97288_01_01', 'no workspace entry');
    });

    it('[TC97288_02] custom app with environments added', async () => {
        const customAppObj = getRequestBody({
            name: `custom app workspace with env`,
        });
        customAppObj.environments = environments;
        customAppId = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: customAppObj,
        });
        await libraryPage.openCustomAppById({ id: customAppId });
        await libraryPage.openUserAccountMenu();
        await since('1. Switch workspace entry should show, instead it does not show.')
            .expect(await userAccount.getAccountMenuOption('Switch Workspace').isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(userAccount.getAccountDropdown(), 'TC97288_02_01', 'workspace entry');
        await userAccount.openSwitchWorkspaceSubPanel();
        await takeScreenshotByElement(userAccount.getSwitchWorkspaceSubPanel(), 'TC97288_02_02', 'workspace view');
    });

    it('[TC97288_03] custom app with environments added but disable entry', async () => {
        const customAppObj = consts.disableSwitchWorkSpace;
        customAppObj.environments = environments;
        customAppId = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: customAppObj,
        });
        await libraryPage.openCustomAppById({ id: customAppId });
        await libraryPage.openUserAccountMenu();
        await since('1. Switch workspace entry should not show, instead it is displayed.')
            .expect(await userAccount.getAccountMenuOption('Switch Workspace').isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            userAccount.getAccountDropdown(),
            'TC97288_03_01',
            'no workspace entry when disable entry'
        );
    });

    it('[TC97288_04] custom app with environments added', async () => {
        const customAppObj = getRequestBody({
            name: `custom app workspace with env`,
        });
        customAppObj.environments = environments;
        customAppId = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: customAppObj,
        });
        await libraryPage.openCustomAppById({ id: customAppId });
        await libraryPage.openUserAccountMenu();
        await userAccount.openSwitchWorkspaceSubPanel();
        await since('1. Switch workspace entry should show, instead it does not show.')
            .expect(await userAccount.getCurrentSelectedWorkspaceItem().getText())
            .toContain(environments.current);
        await takeScreenshotByElement(userAccount.getSwitchWorkspaceSubPanel(), 'TC97288_04_01', 'workspace sub panel');
        await libraryPage.openCustomAppById({ id: customAppId });
        await userAccount.switchWorkspace(environments.other[1].name);
        const pieces = environments.other[1].url.split('/');
        const targetAppId = pieces.slice(-1)[0];
        const host = pieces.slice(0, 4).join('/');
        await since('2. Browser url should be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.currentURL())
            .toBe(`${host}/auth/ui/loginPage?applicationId=${targetAppId}`);
        await loginPage.login(consts.mstrUser.credentials);
        await takeScreenshotByElement(
            libraryPage.getNavigationBar(),
            'TC97288_04_02',
            'navigation bar in custom app with green theme'
        );
        await browsers.pageObj1.userAccount.openUserAccountMenu();
        await browsers.pageObj1.userAccount.logout();
    });

    // DE332568 - Library application appearance theme breaks hierarchy prompt icons.
    it('[TC97288_05] switch workspace and switch back', async () => {
        const customAppInfoRed = getRequestBody({
            name: `test custom app color theme - red`,
            useColorTheme: true,
            selectedTheme: redTheme,
        });
        appIdRedTheme = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: customAppInfoRed,
        });
        await libraryPage.openDossierById({
            projectId: dashboardWithHierarchyPrompt.project.id,
            dossierId: dashboardWithHierarchyPrompt.id,
            applicationId: appIdRedTheme,
        });
        await promptEditor.waitForEditor();
        const prompt = await promptObject.getPromptByName('Hierarchies');
        await hierarchyPrompt.tree.expandEle(prompt, 'Time');
        await hierarchyPrompt.tree.scrollTreeToBottom(prompt);
        await hierarchyPrompt.tree.expandEle(prompt, 'Day');
        await hierarchyPrompt.tree.scrollTreeToBottom(prompt);
        await takeScreenshotByElement(prompt, 'TC97288_05_01', 'hierarchy prompt in red theme app');
    });

    it('[TC76719_01] user does not have custom app acl', async () => {
        const customizedItems = getCustomizedItems('v5');
        const customAppObj = getRequestBody({
            name: `custom app without acl`,
            customizedItems: { ...customizedItems, use_application_name_as_library_title: true },
        });
        customAppId = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: customAppObj,
        });
        await libraryPage.openCustomAppById({ id: customAppId });
        await since(`1. library home title should be #{expected}, instead we have #{actual}.`)
            .expect(await libraryPage.getTitle().getText())
            .toBe(customAppObj.name);
        //remove acl for test user
        await setObjectAcl({
            credentials: consts.mstrUser.credentials,
            object: { id: customAppId, name: customAppObj.name, type: 78 },
            acl: [
                {
                    value: 'Denied All',
                    id: testUserId,
                    name: testCredentials.username,
                },
            ],
        });
        await libraryPage.openCustomAppById({ id: customAppId, check_flag: false });
        await since('no acl error should pop out, instead we have #{actual}')
            .expect(await libraryPage.errorTitle())
            .toContain('Need Permission');
        await dossierPage.dismissError();
        await since(`2. library home title should be #{expected} after remove app acl, instead we have #{actual}.`)
            .expect(await libraryPage.getTitle().getText())
            .toBe('Library');
        const currentUrl = await libraryPage.currentURL();
        await since(`3. It should redirect to available app, instead it is still under custom app ${customAppId}`)
            .expect(currentUrl)
            .not.toContain(customAppId);
    });
    it('[TC76719_02] user does not acl to home dashboard', async () => {
        const homeDossier = consts.homeDossierAclTest;
        let dossierAsHomeObj = getCustomAppBody({
            version: 'v5',
            name: 'auto_dossierhome',
            dossierMode: 1,
            url: 'app/' + homeDossier.project.id + '/' + homeDossier.id,
        });
        customAppId = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: dossierAsHomeObj,
        });
        await resetObjectAcl({
            credentials: consts.mstrUser.credentials,
            object: { id: homeDossier.id, name: homeDossier.name, project: homeDossier.project },
            acl: [
                {
                    value: 'Full Control',
                    id: testUserId,
                    name: testCredentials.username,
                },
            ],
        });
        await libraryPage.openCustomAppById({ id: customAppId });
        await takeScreenshotByElement(libraryPage.getNavigationBar(), 'TC76719_02_01', 'dossier as home');
        //remove acl for test user
        await setObjectAcl({
            credentials: consts.mstrUser.credentials,
            object: { id: homeDossier.id, name: homeDossier.name, project: homeDossier.project },
            acl: [
                {
                    value: 'Denied All',
                    id: testUserId,
                    name: testCredentials.username,
                },
            ],
        });
        await libraryPage.openCustomAppById({ id: customAppId });
        await dossierPage.waitForElementVisible(dossierPage.getErrorDialogue());
        await takeScreenshot('TC76719_02_01', 'no acl to home dashboard');
        await dossierPage.dismissError();
        const currentUrl = await libraryPage.currentURL();
        await since(`3. It should stay on current app, instead it goes to other custom app`)
            .expect(currentUrl)
            .toContain(customAppId);
        // await takeScreenshotByElement(
        //     dossierPage.getNavigationBar(),
        //     'TC76719_02_02',
        //     'dashboard toolbar after no redirect'
        // );
    });
});
