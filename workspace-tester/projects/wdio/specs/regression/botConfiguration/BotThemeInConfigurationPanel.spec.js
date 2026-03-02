import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as consts from '../../../constants/bot.js';
import * as customAppConsts from '../../../constants/customApp/info.js';
import { darkTheme, getRequestBody } from '../../../constants/customApp/bot.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { createBotByAPI, deleteBotList } from '../../../api/bot/index.js';
import { browserWindow } from '../../../constants/index.js';
import _ from 'lodash';

describe('AI Bot Theme in configuration panel', () => {
    let { loginPage, libraryPage, libraryAuthoringPage, botAppearance, botAuthoring, botCustomInstructions } =
        browsers.pageObj1;

    let botToCreate, botId, customAppId;

    beforeAll(async () => {
        await loginPage.login(consts.botUser.credentials);
        await setWindowSize(browserWindow);
        botToCreate = consts.getBotToCreate({ botName: 'auto_bot_theme' });
    });

    beforeEach(async () => {
        botId = await createBotByAPI({ credentials: consts.botUser.credentials, botInfo: botToCreate });
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await deleteBotList({
            credentials: consts.botUser.credentials,
            botList: [botId],
        });
        customAppId &&
            (await deleteCustomAppList({
                credentials: customAppConsts.mstrUser.credentials,
                customAppIdList: [customAppId],
            }));
        customAppId = null;
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC92349_01] Configuratin panel should not apply bot theme', async () => {
        await libraryPage.openBotById({ botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        // check default light theme
        // custom instruction tab
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await takeScreenshotByElement(
            botAuthoring.getBotConfigContainer(),
            'TC92349_01_01',
            'Custom Instructions tab in light theme'
        );
        await botCustomInstructions.triggerBackgroundTooltip();
        await takeScreenshotByElement(
            await botCustomInstructions.getTooltip(),
            'TC92349_01_02',
            'Custom instruction background tooltip in light theme'
        );
        await botAuthoring.dismissTooltip();
        await botCustomInstructions.triggerFormatTooltip();
        await takeScreenshotByElement(
            await botCustomInstructions.getTooltip(),
            'TC92349_01_03',
            'Custom instruction format tooltip in light theme'
        );
        // general tab
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            botAuthoring.getBotConfigContainer(),
            'TC92349_01_06',
            'General tab in light theme'
        );
        await botAuthoring.generalSettings.openInterpretationTooltip();
        await takeScreenshotByElement(
            botAuthoring.getTooltip(),
            'TC92349_01_07',
            'Interpretation tooltip in light theme'
        );
        await botAuthoring.generalSettings.openLinkSettingsTooltip();
        await takeScreenshotByElement(botAuthoring.getTooltip(), 'TC92349_01_08', 'Link tooltip in light theme');
        await botAuthoring.generalSettings.addExternalLink({
            iconIndex: 0,
            url: 's',
            title: 'invalid link',
        });
        await botAuthoring.generalSettings.triggerDeleteLinkTooltip(0);
        await takeScreenshotByElement(
            botAuthoring.getTooltip(),
            'TC92349_01_09',
            'Delete button tooltip in light theme'
        );
        await botAuthoring.generalSettings.triggerInvalidUrlTooltip(0);
        await takeScreenshotByElement(botAuthoring.getTooltip(), 'TC92349_01_10', 'Error info in light theme');
        // appearance tab
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await takeScreenshotByElement(
            botAuthoring.getBotConfigContainer(),
            'TC92349_01_11',
            'Appearance tab in light theme'
        );
        await botAppearance.triggerThemeTooltip();
        await takeScreenshotByElement(botAuthoring.getTooltip(), 'TC92349_01_12', 'Theme tooltip in light theme');
        // check yellow theme
        await botAppearance.changeThemeTo('Yellow');
        // appearance tab
        await takeScreenshotByElement(
            botAuthoring.getBotConfigContainer(),
            'TC92349_01_13',
            'Appearance tab in yellow theme'
        );
        await botAppearance.triggerThemeTooltip();
        await takeScreenshotByElement(botAuthoring.getTooltip(), 'TC92349_01_14', 'Theme tooltip in yellow theme');
        // general tab
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            botAuthoring.getBotConfigContainer(),
            'TC92349_01_15',
            'General tab in yellow theme'
        );
        await botAuthoring.generalSettings.openCoverImageEditDialog();
        await botAuthoring.generalSettings.triggerCloseTooltip();
        await takeScreenshotByElement(
            botAuthoring.getTooltip(),
            'TC92349_01_16',
            'Close button tooltip in edit cover image dialog in yellow theme'
        );
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getEditCoverImageDialog(),
            'TC92349_01_17',
            'Edit cover image dialog in yellow theme'
        );
        await botAuthoring.generalSettings.saveAndCloseEditCoverImageDialog();
        await botAuthoring.waitForElementStaleness(botAuthoring.generalSettings.getEditCoverImageDialog());
        await botAuthoring.generalSettings.openInterpretationTooltip();
        await takeScreenshotByElement(
            botAuthoring.getTooltip(),
            'TC92349_01_18',
            'Interpretation tooltip in yellow theme'
        );
        await botAuthoring.generalSettings.openLinkSettingsTooltip();
        await takeScreenshotByElement(botAuthoring.getTooltip(), 'TC92349_1_19', 'Link tooltip in dark theme');
        await botAuthoring.generalSettings.triggerDeleteLinkTooltip(0);
        await takeScreenshotByElement(
            botAuthoring.getTooltip(),
            'TC92349_01_20',
            'Delete link tooltip in yellow theme'
        );
        await botAuthoring.generalSettings.triggerInvalidUrlTooltip(0);
        await takeScreenshotByElement(
            botAuthoring.getTooltip(),
            'TC92349_01_21',
            'Tooltip of invalid url in yellow theme'
        );
        // custom instruction tab
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await takeScreenshotByElement(
            botAuthoring.getBotConfigContainer(),
            'TC92349_01_22',
            'Custom instruction tab in yellow theme'
        );
        await botCustomInstructions.triggerBackgroundTooltip();
        await takeScreenshotByElement(
            await botCustomInstructions.getTooltip(),
            'TC92349_01_23',
            'Custom Instruction background tooltip in yellow theme'
        );
        await botAuthoring.dismissTooltip();
        await botCustomInstructions.triggerFormatTooltip();
        await takeScreenshotByElement(
            await botCustomInstructions.getTooltip(),
            'TC92349_01_24',
            'Custom Instruction format tooltip in yellow theme'
        );
    });

    it('[TC92349_02] custom app with color theme', async () => {
        const customAppObj = getRequestBody({
            name: `custom app dark theme`,
            useColorTheme: true,
            selectedTheme: darkTheme,
        });
        customAppId = await createCustomApp({
            credentials: customAppConsts.mstrUser.credentials,
            customAppInfo: customAppObj,
        });
        await libraryPage.openBotById({ botId });
        await takeScreenshotByElement(botAuthoring.aibotChatPanel.getTitleBar(), 'TC92349_02_01', 'bot toolbar');
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await botAppearance.changeThemeTo('Yellow');
        await botAuthoring.saveBot({});
        await libraryPage.editBotByUrl({ botId, appId: customAppId });
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await takeScreenshotByElement(
            botAuthoring.getBotConfigContainer(),
            'TC92349_02_02',
            'Appearance tab in light theme'
        );
        await botAppearance.changeThemeTo('Light');
        await takeScreenshotByElement(botAuthoring.getBotConfigContainer(), 'TC92349_02_03', 'theme select dropdown');
        await botAuthoring.saveBot({});
        await libraryPage.openBotById({ botId, appId: customAppId });
        await takeScreenshotByElement(botAuthoring.aibotChatPanel.getTitleBar(), 'TC92349_02_04', 'bot toolbar');
    });

    it('[TC92349_03] custom app with color theme', async () => {
        const selectedTheme = _.cloneDeep(darkTheme);
        selectedTheme.color.enableForBots = true;
        const customAppObj = getRequestBody({
            name: `custom app dark theme`,
            useColorTheme: true,
            selectedTheme,
        });
        customAppId = await createCustomApp({
            credentials: customAppConsts.mstrUser.credentials,
            customAppInfo: customAppObj,
        });
        await libraryPage.openBotById({ botId, appId: customAppId });
        await takeScreenshotByElement(
            botAuthoring.aibotChatPanel.getTitleBar(),
            'TC92349_03_01',
            'bot toolbar in dark'
        );
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await botAppearance.changeThemeTo('Yellow');
        await botAuthoring.saveBot({});
        await libraryPage.editBotByUrl({ botId, appId: customAppId });
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await takeScreenshotByElement(
            botAuthoring.getBotConfigContainer(),
            'TC92349_03_02',
            'custom app in dark theme apply to bot'
        );
        await botAppearance.changeThemeTo('Green');
        await takeScreenshotByElement(botAuthoring.getBotConfigContainer(), 'TC92349_03_03', 'theme select dropdown');
        await botAuthoring.saveBot({});
        await libraryPage.openBotById({ botId, appId: customAppId });
        await takeScreenshotByElement(
            botAuthoring.aibotChatPanel.getTitleBar(),
            'TC92349_03_04',
            'bot toolbar in dark'
        );
    });
});
