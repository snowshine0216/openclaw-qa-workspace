import setWindowSize from '../../../config/setWindowSize.js';
import urlParser from '../../../api/urlParser.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { browserWindow } from '../../../constants/index.js';
import { createBotByAPI, deleteBotList } from '../../../api/bot/index.js';
import {
    botCustomizationUser,
    getBotObjectToEdit,
    languageIdMap,
    messageAdvancedConfiguration,
} from '../../../constants/bot.js';
import resetUserLanguage from '../../../api/resetUserLanguage.js';
import setUserLanguage from '../../../api/setUserLanguage.js';

describe('AI Bot Customizations', () => {
    let { loginPage, libraryPage, libraryAuthoringPage, botAuthoring, botCustomInstructions, botConsumptionFrame } =
        browsers.pageObj1;
    let botId;
    const botIdsToDelete = [];
    const botName = 'Bot Customization Test' + new Date().getTime();
    const BotToCreate = getBotObjectToEdit({
        botName: botName,
        version: 'v2',
        datasets: [{ id: 'F75D33638248CE1CAE0AE5B825A28139', name: 'Airline Data' }],
        enableInterpretation: true,
    });
    const adminUser = {
        username: 'mstr1',
        password: 'newman1#',
        id: '86A002474C1A18F1F92F2B8150A43741',
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(botCustomizationUser);
        await libraryPage.waitForLibraryLoading();
    });

    // beforeEach(async () => {
    //     botId = await createBotByAPI({ credentials: botCustomizationUser, botInfo: BotToCreate });
    //     botIdsToDelete.push(botId);
    //     // await libraryPage.openDefaultApp();
    // });

    afterEach(async () => {
        if (botIdsToDelete.length > 0) {
            await deleteBotList({
                credentials: adminUser,
                botList: [...botIdsToDelete],
                projectId: BotToCreate.project.id,
            });
            botIdsToDelete.length = 0;
        }
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await resetUserLanguage({ credentials: botCustomizationUser });
        await logoutFromCurrentBrowser();
    });

    it('[TC97710_01] create bot from GUI and check advanced configurations', async () => {
        // also covers TC97801
        await libraryAuthoringPage.createBotWithNewData({});
        await botAuthoring.createBotBySampleData(languageIdMap.EnglishUnitedStates);
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        // scroll to bottom
        await botCustomInstructions.scrollToBottom();

        const englishTitle = (await botCustomInstructions.getAdvancedConfigurationTitleText()).split('\n')[0];
        const englishSendObject = await botCustomInstructions.getSendObjectDescriptionSwitchLabelText();
        const englishApplyTimeFilter = await botCustomInstructions.getApplyTimeFilterSwitchLabelText();
        await since('Advanced Configuration title is expected to be #{expected}, instead we have #{actual}')
            .expect(englishTitle)
            .toBe(messageAdvancedConfiguration.English.title);
        await since('send object description content is expected to be #{expected}, instead we have #{actual}')
            .expect(englishSendObject)
            .toBe(messageAdvancedConfiguration.English.sendObjectDescription);
        await since('apply time filter content is expected to be #{expected}, instead we have #{actual}')
            .expect(englishApplyTimeFilter)
            .toBe(messageAdvancedConfiguration.English.applyTimeFilter);
        // by default, the switch should be off for send object description
        await since(
            'create a new bot, send object descriptions is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await botCustomInstructions.isSendObjectDescriptionEnabled())
            .toBe(false);
        // by default, the switch should be on for apply time filter
        await since('create a new bot, apply time filter is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.isApplyTimeFilterEnabled())
            .toBe(true);
        // hover on tooltip and check the content
        await botCustomInstructions.hoverOnSendObjectDescriptionInfoIcon();
        await takeScreenshotByElement(
            await botCustomInstructions.getTooltip(),
            'TC97710_01_SendObjectDescriptionTooltip'
        );
        await botAuthoring.dismissTooltip();
        await botCustomInstructions.hoverOnApplyTimeFilterInfoIcon();
        await takeScreenshotByElement(await botCustomInstructions.getTooltip(), 'TC97710_01_ApplyTimeFilterTooltip');

        // disable apply time filter, enable sendObjectDescription and save bot, reopen it, it should be kept
        await botCustomInstructions.disableApplyTimeFilter();
        await botCustomInstructions.enableSendObjectDescription();
        await botAuthoring.saveAsBot({ name: botName });
        botId = await botAuthoring.getBotIdFromUrl();
        botIdsToDelete.push(botId);
        // await botAuthoring.exitBotAuthoring();
        // await botConsumptionFrame.clickEditButton();
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId: botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        // scroll to bottom
        await botCustomInstructions.scrollToBottom();
        await since(
            'after save bot and reopen it, apply time filter is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await botCustomInstructions.isApplyTimeFilterEnabled())
            .toBe(false);
        await since(
            'after save bot and reopen it, send object descriptions is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await botCustomInstructions.isSendObjectDescriptionEnabled())
            .toBe(true);
    });

    it('[TC97710_02] edit existing bot from GUI and check advanced configurations', async () => {
        botId = await createBotByAPI({ credentials: botCustomizationUser, botInfo: BotToCreate });
        botIdsToDelete.push(botId);
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId: botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botCustomInstructions.scrollToBottom();

        // by default, the send object description should be off
        await since(
            'edit an existing bot, send object descriptions is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await botCustomInstructions.isSendObjectDescriptionEnabled())
            .toBe(false);
        // by default, the apply time filter should be off
        await since('edit an existing bot, apply time filter is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.isApplyTimeFilterEnabled())
            .toBe(false);

        // enable the send object description and time filter and save bot, reopen it, it should be kept
        await botCustomInstructions.enableSendObjectDescription();
        await botCustomInstructions.enableApplyTimeFilter();
        await botAuthoring.saveBot({});
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId: botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botCustomInstructions.scrollToBottom();
        await since(
            'after save bot and reopen it, send object descriptions is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await botCustomInstructions.isSendObjectDescriptionEnabled())
            .toBe(true);
        await since(
            'after save bot and reopen it, apply time filter is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await botCustomInstructions.isApplyTimeFilterEnabled())
            .toBe(true);
    });

    it('[TC97710_03] advanced configurations i18n', async () => {
        await setUserLanguage({
            baseUrl: urlParser(browser.options.baseUrl),
            userId: botCustomizationUser.id,
            adminCredentials: adminUser,
            localeId: languageIdMap.ChineseSimplified,
        });
        await libraryPage.switchUser(botCustomizationUser);
        botId = await createBotByAPI({ credentials: botCustomizationUser, botInfo: BotToCreate });
        botIdsToDelete.push(botId);
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId: botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botCustomInstructions.scrollToBottom();
        const chineseTitle = (await botCustomInstructions.getAdvancedConfigurationTitleText()).split('\n')[0];
        const chineseContent = await botCustomInstructions.getSendObjectDescriptionSwitchLabelText();
        const chineseApplyTimeFilter = await botCustomInstructions.getApplyTimeFilterSwitchLabelText();
        await since(
            'in Chinese, send object description title is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(chineseTitle)
            .toBe(messageAdvancedConfiguration.ChineseSimplified.title);
        await since(
            'in Chinese, send object description content is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(chineseContent)
            .toBe(messageAdvancedConfiguration.ChineseSimplified.sendObjectDescription);
        await since('in Chinese, apply time filter content is expected to be #{expected}, instead we have #{actual}')
            .expect(chineseApplyTimeFilter)
            .toBe(messageAdvancedConfiguration.ChineseSimplified.applyTimeFilter);
        await botCustomInstructions.hoverOnSendObjectDescriptionInfoIcon();
        await takeScreenshotByElement(
            await botCustomInstructions.getTooltip(),
            'TC97710_03_SendObjectDescriptionTooltipi18n'
        );
        await botAuthoring.dismissTooltip();
        await botCustomInstructions.hoverOnApplyTimeFilterInfoIcon();
        await takeScreenshotByElement(
            await botCustomInstructions.getTooltip(),
            'TC97710_03_ApplyTimeFilterTooltipi18n'
        );
    });
});
