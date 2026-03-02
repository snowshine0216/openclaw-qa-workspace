import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { createBotByAPI, publishBotByAPI } from '../../../api/bot/index.js';
import deleteBotList from '../../../api/bot/deleteBot.js';
import * as consts from '../../../constants/bot.js';
import { browserWindow } from '../../../constants/index.js';

describe('AI Bot Custom Instructions', () => {
    let { loginPage, libraryPage, libraryAuthoringPage, aibotChatPanel, botAuthoring, botCustomInstructions } =
        browsers.pageObj1;
    let botToCreate, botId;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(consts.botUser.credentials);
        botToCreate = consts.getBotToCreate({ botName: 'auto_bot_custom_instructions' });
    });

    beforeEach(async () => {
        botId = await createBotByAPI({ credentials: consts.botUser.credentials, botInfo: botToCreate });
        consts.publishInfo.id = botId;
        console.log(consts.publishInfo);
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
        await logoutFromCurrentBrowser();
    });

    //check custom instruction UI
    it('[TC91801_01] Check custom instruction UI', async () => {
        //create a new bot, custom instruction is disabled by default
        await libraryPage.openBotById({ botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await takeScreenshotByElement(
            botCustomInstructions.getCustomInstructionsSwitch(),
            'TC91801_01_01',
            'Disabled switch icon'
        );
        await since('Enabled Custom Instructions is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.isCustomInstructionsEnabled())
            .toBe(false);
        await since('Enabled Input box is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.isInputBoxEnabled())
            .toBe(false);
        //enable, input 500 characters
        await botCustomInstructions.enableCustomInstructions();
        await takeScreenshotByElement(
            botCustomInstructions.getCustomInstructionsSwitch(),
            'TC91801_01_02',
            'Enabled switch icon'
        );
        await botCustomInstructions.inputBackground(consts.message);
        await botCustomInstructions.inputFormat(consts.message);
        await botAuthoring.saveBot({});
        await botAuthoring.saveBot({});
        await aibotChatPanel.goToLibrary();
        //reopen bot, check enabled status
        await libraryPage.openDossier(botToCreate.data.name);
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await since('Enabled Custom Instruction is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.isCustomInstructionsEnabled())
            .toBe(true);
        await since('Enabled Input box is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.isInputBoxEnabled())
            .toBe(true);
        //disable, check UI 500/500
        await botCustomInstructions.disableCustomInstructions();
        await takeScreenshotByElement(
            botCustomInstructions.getBackgroundArea(),
            'TC91801_01_03',
            'Disabled background input box with 500 chars'
        );
        await takeScreenshotByElement(
            botCustomInstructions.getFormatArea(),
            'TC91801_01_04',
            'Disabled format input box with 500 chars'
        );
        // // resize browser
        // await setWindowSize({ width: 760, height: 1200 });
        // await takeScreenshotByElement(
        //     botAuthoring.getConfigTabsHeaderContainer(),
        //     'TC91801_01_05',
        //     'Resize browser_Check header UI'
        // );
        // await takeScreenshotByElement(
        //     botAuthoring.custommizationPanel.getBackgroundArea(),
        //     'TC91801_01_06',
        //     'Resize browser_Check input box UI'
        // );
        // // mobile view
        // await setWindowSize({ width: 560, height: 1200 });
        // await botAuthoring.scrollBotPanelHorizontally(200);
        // await takeScreenshotByElement(
        //     botAuthoring.getConfigTabsHeaderContainer(),
        //     'TC91801_01_07',
        //     'Resize to mobile view_Check header UI'
        // );
        // await takeScreenshotByElement(
        //     botAuthoring.custommizationPanel.getBackgroundArea(),
        //     'TC91801_01_08',
        //     'Resize mobile view_Check input box UI'
        // );
        // // resize configuration panel to minimum width
        // await setWindowSize(browserWindow);
        // await aibotChatPanel.resizeConfigurationPanel();
        // await takeScreenshotByElement(
        //     botAuthoring.getConfigTabsHeaderContainer(),
        //     'TC91801_01_09',
        //     'Resize to minimum config panel_Check header UI'
        // );
        // await takeScreenshotByElement(
        //     botAuthoring.custommizationPanel.getBackgroundArea(),
        //     'TC91801_01_10',
        //     'Resize to minimum config panel_Check input box UI'
        // );
    });

    it('[TC91801_02] Premerge_check custom instruction status', async () => {
        //create a new bot, custom instruction is disabled by default
        await libraryPage.openBotById({ botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await since('Enabled Custom Instructions is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.isCustomInstructionsEnabled())
            .toBe(false);
        await since('Enabled Input box is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.isInputBoxEnabled())
            .toBe(false);
        await since('Text is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.getCount(0))
            .toBe('0/2500');
        await since('Enabled Custom Instructions is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.getCount(1))
            .toBe('0/2500');
        //enable, input 2500 characters
        await botCustomInstructions.enableCustomInstructions();
        await since('Enabled Custom Instructions is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.isCustomInstructionsEnabled())
            .toBe(true);
        await botCustomInstructions.inputBackground(consts.message);
        await botCustomInstructions.inputFormat(consts.message);
        await since('Text is expected to be #{expected}, instead we have #{actual}}')
            .expect(await botCustomInstructions.getCount(0))
            .toBe('2500/2500');
        await since('Enabled Custom Instructions is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.getCount(1))
            .toBe('2500/2500');
        await botAuthoring.saveBot({});
        await aibotChatPanel.goToLibrary();
        //reopen bot, check enabled status
        await libraryPage.openDossier(botToCreate.data.name);
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await since('Enabled Custom Instructions is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.isCustomInstructionsEnabled())
            .toBe(true);
        await since('Enabled Custom Instruction is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.isCustomInstructionsEnabled())
            .toBe(true);
        await since('Enabled Input box is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.isInputBoxEnabled())
            .toBe(true);
        await botCustomInstructions.disableCustomInstructions();
        await since('Text is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.getCount(0))
            .toBe('2500/2500');
        await since('Enabled Custom Instructions is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.getCount(1))
            .toBe('2500/2500');
    });
});
