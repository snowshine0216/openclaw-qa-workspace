import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as consts from '../../../constants/bot.js';
import * as postBody from '../../../constants/customApp/customAppBody.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import deleteBotList from '../../../api/bot/deleteBot.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { createBotByAPI, publishBotByAPI } from '../../../api/bot/index.js';
import { browserWindow } from '../../../constants/index.js';

describe('AI Bot Color Palettes Premerge', () => {
    let { loginPage, dossierPage, libraryPage, libraryAuthoringPage, botAppearance, botAuthoring } = browsers.pageObj1;

    let appWithDefaultPalettes;
    let customAppIdWithAppDefaultPalettes;
    let botToCreate, botId;

    beforeAll(async () => {
        await loginPage.login(consts.botUser.credentials);
        await setWindowSize(browserWindow);
        appWithDefaultPalettes = postBody.getCustomAppBody({
            version: 'v5',
            name: 'appWithAppDefaultPalettes',
            applicationPalettes: [consts.paletteSunsetId, consts.paletteHummingBirdId],
            applicationDefaultPalette: consts.paletteSunsetId,
            useConfigPalettes: true,
        });
        customAppIdWithAppDefaultPalettes = await createCustomApp({
            credentials: consts.botUser.credentials,
            customAppInfo: appWithDefaultPalettes,
        });
        botToCreate = consts.getBotToCreate({ botName: 'auto_bot_palette_premerge' });
    });

    beforeEach(async () => {
        botId = await createBotByAPI({ credentials: consts.botUser.credentials, botInfo: botToCreate });
        consts.publishInfo.id = botId;
        await publishBotByAPI({
            credentials: consts.botUser.credentials,
            publishInfo: consts.publishInfo,
        });
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await deleteBotList({
            credentials: consts.botUser.credentials,
            botList: [botId],
        });
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: consts.botUser.credentials,
            customAppIdList: [customAppIdWithAppDefaultPalettes],
        });
        await logoutFromCurrentBrowser();
    });

    it('[TC91729_01] Premerge_Check default palette is selected and correctly shown', async () => {
        await dossierPage.openCustomAppById({ id: customAppIdWithAppDefaultPalettes });
        await libraryPage.openBotById({
            appId: customAppIdWithAppDefaultPalettes,
            botId: botId,
        });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Appearance');
        // await takeScreenshotByElement(botAppearance.getPalettesSelector(), 'TC91729_01_01', 'Sunset as default');
        await botAppearance.openPaletteDropdownList();
        await takeScreenshotByElement(
            botAppearance.getPaletteSelectPanel(),
            'TC91729_01_02',
            'Sunset is selected in dropdown list',
            { tolerance: 1.0 }
        );
    });
});
