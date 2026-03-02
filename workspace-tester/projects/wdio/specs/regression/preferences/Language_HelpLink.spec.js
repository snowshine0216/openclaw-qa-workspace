import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import resetUserLanguage from '../../../api/resetUserLanguage.js';
import setLanguage from '../../../api/setLanguage.js';
import { getAttributeValue } from '../../../utils/getAttributeValue.js';

const specConfiguration = { ...customCredentials('_language') };

describe('HelpLink test for Language', () => {
    const dossier = {
        id: '53EFB3A94FA899452E91E08522DB305C',
        name: '(Auto) Locale - dossier',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        
        width: 1600,
        height: 1200,
    };

    let { libraryPage, dossierPage, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.reload();
    });

    it('[TC87345_01] Validate the help link for different Languages on Library Web - with translation', async () => {
        // check language with help link - zh-cn
        const zhCN = {
            username: 'tester_auto_zhcn',
            password: '',
        };
        await libraryPage.switchUser(zhCN);
        await libraryPage.openUserAccountMenu();
        await libraryPage.clickAccountOption('帮助');
        await libraryPage.sleep(1000); // await for page load
        await dossierPage.switchToTab(1);
        const currentUrl = browser.getUrl();
        await since('Change to Chinese, Current URL should be #{expected}, instead we have #{actual}')
            .expect(await currentUrl)
            .toEqual('https://www2.microstrategy.com/producthelp/Current/Library/zh-cn/Content/home_library.htm');
        await dossierPage.switchToTab(0);
        await dossierPage.closeTab(1);
    });

    it('[TC87345_02] Validate the help link for different Languages on Library Web - fall back translation', async () => {
        // check language with help link fall back - de-AT
        const deAT = {
            username: 'tester_auto_deat',
            password: '',
        };
        await libraryPage.switchUser(deAT);
        await libraryPage.openUserAccountMenu();
        await libraryPage.clickAccountOption('Hilfe');
        await libraryPage.sleep(1000); // await for page load
        await dossierPage.switchToTab(1);
        const currentUrl = await browser.getUrl();
        await since('Change to DE-CH, Current URL should be #{expected}, instead we have #{actual}')
            .expect(currentUrl)
            .toEqual('https://www2.microstrategy.com/producthelp/Current/Library/de/Content/home_library.htm');
        await dossierPage.switchToTab(0);
        await dossierPage.closeTab(1);
    });

    it('[TC87345_03] Validate the help link for different Languages on Library Web - no translation', async () => {
        // check language with help link fall back to en - Albanian
        const sq = {
            username: 'tester_auto_sq',
            password: '',
        };
        await libraryPage.switchUser(sq);
        await libraryPage.openUserAccountMenu();
        await libraryPage.clickAccountOption('Help');
        await libraryPage.sleep(1000); // await for page load
        await dossierPage.switchToTab(1);
        const currentUrl = await browser.getUrl();
        await since('Change to DE-CH, Current URL should be #{expected}, instead we have #{actual}')
            .expect(currentUrl)
            .toEqual('https://www2.microstrategy.com/producthelp/Current/Library/en-us/Content/home_library.htm');
        await dossierPage.switchToTab(0);
        await dossierPage.closeTab(1);
    });
});

export const config = specConfiguration;
