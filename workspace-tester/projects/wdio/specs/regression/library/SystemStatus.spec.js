import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { getCustomAppBody } from '../../../constants/customApp/customAppBody.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';

const specConfiguration = { ...customCredentials('') };

describe('System Status', () => {
    const customAppWithSystemStatusTop = {
        id: null,
        name: 'Auto_SS_Top',
    };

    const customAppWithSystemStatusBoth = {
        id: null,
        name: 'Auto_SS_Both',
    };

    const createCustomAppForTop = async () => {
        // create custom app with system status enabled
        const enabledTopBody = getCustomAppBody({
            name: customAppWithSystemStatusTop.name,
            systemStatus: {
                enabled: true,
                range: 'all_screen',
                enableTopContent: true,
                topContent:
                    '<div id="htmleditor-container-bottom-editor" class="htmleditor-container-bottom-editor" style="padding: 10px 20px; background-color: rgb(221, 202, 255); color: rgb(41, 49, 59);"><p style="color: rgb(41, 49, 59);"><b><span style="color: rgb(131, 79, 189);">Update</span></b><span style="color: rgb(131, 79, 189);"> </span><i><b><span style="color: rgb(131, 79, 189);">Notice</span></b></i></p><p style=""><font color="#29313b"><u style="text-decoration: unset;"><span style="text-decoration: underline;">We will launch a system update</span></u> on<strike style="text-decoration: unset;"><span style="text-decoration: line-through;"> June 30, 2025 at 6 AM</span></strike>, during which time login access will be unavailable. Please be informed.</font></p></div>',
                enableBottomContent: false,
                bottomContent: '',
                allowClose: true,
            },
        });
        customAppWithSystemStatusTop.id = await createCustomApp({
            credentials: specConfiguration.credentials,
            customAppInfo: enabledTopBody,
        });
    };

    const createCustomAppForBoth = async () => {
        // create custom app with system status enabled
        const enabledBothBody = getCustomAppBody({
            name: customAppWithSystemStatusBoth.name,
            systemStatus: {
                enabled: true,
                range: 'home_screen',
                enableTopContent: true,
                topContent:
                    '<div id="htmleditor-container-bottom-editor" class="htmleditor-container-bottom-editor" style="padding: 10px 20px; background-color: rgb(221, 202, 255); color: rgb(41, 49, 59);"><p style="color: rgb(41, 49, 59);"><b><span style="color: rgb(131, 79, 189);">Update</span></b><span style="color: rgb(131, 79, 189);"> </span><i><b><span style="color: rgb(131, 79, 189);">Notice</span></b></i></p><p style=""><font color="#29313b"><u style="text-decoration: unset;"><span style="text-decoration: underline;">We will launch a system update</span></u> on<strike style="text-decoration: unset;"><span style="text-decoration: line-through;"> June 30, 2025 at 6 AM</span></strike>, during which time login access will be unavailable. Please be informed.</font></p></div>',
                enableBottomContent: true,
                bottomContent:
                    '<div class="htmleditor-container-bottom-editor" style="padding:10px 20px;background-color:rgb( 255 , 243 , 179 );color:rgb( 41 , 49 , 59 )"><div style="text-align:right"><ul style="text-align:left"><li style="text-align:right"><span style="text-align:left"><a href="https://www.google.com/" style="color:rgb( 41 , 49 , 59 );font-family:&#39;helvetica neue&#39; , &#39;segoe ui&#39; , &#39;segoe ui semibold&#39; , &#39;helvetica&#39; , &#39;arial&#39; , sans-serif" rel="nofollow">Link, Please click me</a><p>This is cat picture</p><p style="color:rgb( 41 , 49 , 59 );font-family:&#39;helvetica neue&#39; , &#39;segoe ui&#39; , &#39;segoe ui semibold&#39; , &#39;helvetica&#39; , &#39;arial&#39; , sans-serif"><span style="width:25%;height:auto"><img src="https://img1.baidu.com/it/u&#61;2072860749,2890978709&amp;fm&#61;253&amp;fmt&#61;auto&amp;app&#61;120&amp;f&#61;JPEG?w&#61;843&amp;h&#61;800" alt="Placeholder Image" style="width:25%;height:auto" /></span></p></span></li></ul></div></div>',
                allowClose: false,
                bottomContentBackgroundColor: '#FFF3B3',
            },
        });
        customAppWithSystemStatusBoth.id = await createCustomApp({
            credentials: specConfiguration.credentials,
            customAppInfo: enabledBothBody,
        });
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { libraryPage, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
        await createCustomAppForTop();
        await createCustomAppForBoth();
    });

    afterEach(async () => {
        await libraryPage.logoutClearCacheAndLogin(specConfiguration.credentials);
    });

    afterAll(async () => {
        await libraryPage.openDefaultApp();
        await deleteCustomAppList({
            credentials: specConfiguration.credentials,
            customAppIdList: [customAppWithSystemStatusTop.id, customAppWithSystemStatusBoth.id],
        });
    });

    it('[TC99551_01] Validate system Status On Library Web - Top', async () => {
        await libraryPage.openCustomAppById({ id: customAppWithSystemStatusTop.id });
        await since('SystemStatusBar Exist should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isSystemStatusBarDisplayed(0))
            .toBe(true);
        await libraryPage.libraryItem.openItemByIndex(0);
        await since('SystemStatusBar Exist should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isSystemStatusBarDisplayed(0))
            .toBe(true);
        await libraryPage.closeSystemStatusBar(0);
        await since('SystemStatusBar Exist should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isSystemStatusBarDisplayed(0))
            .toBe(false);
        await libraryPage.refresh();
        await since('After refresh, SystemStatusBar Exist should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isSystemStatusBarDisplayed(0))
            .toBe(false);
    });

    it('[TC99551_02] Validate system Status On Library Web - Top and Bottom', async () => {
        await libraryPage.openCustomAppById({ id: customAppWithSystemStatusBoth.id });
        await since('SystemStatusBar Exist should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isSystemStatusBarDisplayed(0))
            .toBe(true);
        await since('SystemStatusBar Exist should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isSystemStatusBarDisplayed(1))
            .toBe(true);
        await since('SystemStatusBar close btn Exist should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isSystemStatusCloseBtnDisplayed(1))
            .toBe(false);
        await libraryPage.hideDossierListContainer();
        await takeScreenshotByElement(await libraryPage.getViewContainer(), 'TC99551', 'System Status');
        await libraryPage.showDossierListContainer();
        await libraryPage.libraryItem.openItemByIndex(0);
        await since('SystemStatusBar Exist should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isSystemStatusBarDisplayed(0))
            .toBe(false);
    });
});

export const config = specConfiguration;
