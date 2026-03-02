import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { createBotByAPI, publishBotByAPI, deleteBotList } from '../../../api/bot/index.js';
import { browserWindow } from '../../../constants/index.js';
import {
    configBotUser,
    getBotObjectInfo,
    getBotObjectToEdit,
    getPublishInfo,
    botSettings,
    languageIdMap,
} from '../../../constants/bot.js';
import { mockISAiSearchConfiguration } from '../../../api/mock/mock-response-utils.js';

describe('AI Bot General Settings on Authoring', () => {
    let { loginPage, libraryPage, libraryAuthoringPage, botAuthoring, aibotChatPanel, botAppearance } =
        browsers.pageObj1;
    let botId;
    const botIdsToDelete = [];
    const botName = 'TC91744 Bot Info Test';
    const BotToCreate = getBotObjectInfo({ botName });
    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(configBotUser);
    });

    beforeEach(async () => {
        botId = await createBotByAPI({ credentials: configBotUser, botInfo: BotToCreate });
        botIdsToDelete.push(botId);
        const publishInfo = getPublishInfo({ botId, projectId: BotToCreate.project.id });
        await publishBotByAPI({
            credentials: configBotUser,
            publishInfo: publishInfo,
        });
        await libraryPage.openDefaultApp();
    });

    afterEach(async () => {
        await deleteBotList({
            credentials: configBotUser,
            botList: [...botIdsToDelete],
            projectId: BotToCreate.project.id,
        });
        botIdsToDelete.length = 0;
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    //TC91744: [Chatbot] [General Settings] Verify cover image and bot name settings in general tab
    it('[TC91744_01] modify bot name in authoring mode', async () => {
        const botNameToUpdate = `End to End Test's Bot`;
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateBotName(botNameToUpdate);
        await since('Bot name should update to #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(botNameToUpdate);
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTitleBarBotName().getText())
            .toBe(botNameToUpdate);
        const welcomeMessage = await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts();
        await since(`Bot name should include ${botNameToUpdate} in welcome message of chat panel, instead it has.`)
            .expect(welcomeMessage.includes(botNameToUpdate))
            .toBe(true);
    });

    it('[TC91744_02] modify bot name and check in consumption', async () => {
        const botNameToUpdate = `End to End Test's Bot with long string with long string end`;
        const botNameToCheck = botNameToUpdate.substring(0, botSettings.botNameMaxLength);
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateBotName(botNameToUpdate);
        await since('Bot name should update to #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(botNameToCheck);
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTitleBarBotName().getText())
            .toBe(botNameToCheck);
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since('Chat bot title bar bot name should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarBotNameTexts())
            .toBe(botNameToCheck);
    });

    it('[TC91744_03] create bot by UI and check updated bot name', async () => {
        const botNameToUpdate = `!@#$%^&*()_+{}|:<>?;',./~\``;
        const objectName = 'Test special characters';
        await libraryAuthoringPage.createBotWithDataset({ dataset: 'byd_balance_ds_en' });
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateBotName(botNameToUpdate);
        await since('Bot name should update to #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(botNameToUpdate);
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTitleBarBotName().getText())
            .toBe(botNameToUpdate);
        await botAuthoring.saveAsBot({ name: objectName });
        const createdBotId = await botAuthoring.getBotIdFromUrl();
        botIdsToDelete.push(createdBotId);
        await botAuthoring.exitBotAuthoring();
        await libraryPage.openDossier(objectName);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since('Chat bot title bar bot name should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarBotNameTexts())
            .toBe(botNameToUpdate);
    });

    it('[TC91744_04] activate and deactivate bot', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Bot active switch should be on, instead we have off.')
            .expect(await botAuthoring.generalSettings.isActiveBotSwitchOn())
            .toBe(true);
        await botAuthoring.generalSettings.deactiveBot();
        await since('Bot active switch should be off, instead we have on.')
            .expect(await botAuthoring.generalSettings.isActiveBotSwitchOn())
            .toBe(false);
        await since('Bot inactive banner should not display, instead it does show.')
            .expect(await botAuthoring.getInActiveBanner().isDisplayed())
            .toBe(false);
        await botAuthoring.saveBot({});
        await since('Bot inactive banner should display, instead it does not show.')
            .expect(await botAuthoring.getInActiveBanner().isDisplayed())
            .toBe(true);
        await libraryPage.openDefaultApp();
        await libraryPage.openDossierInfoWindow(botName);
        await since('Bot active toggle in info window in Library home should be off, instead we have on.')
            .expect(await libraryPage.infoWindow.isActiveToggleButtonOn())
            .toBe(false);
        await takeScreenshotByElement(
            libraryPage.infoWindow.getCoverImage(),
            'TC91744_04_01',
            'Cover image shows as inactive in info window'
        );
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.activeBot();
        await since('Bot active switch should be on, instead we have off.')
            .expect(await botAuthoring.generalSettings.isActiveBotSwitchOn())
            .toBe(true);
        await botAuthoring.saveBot({});
        await libraryPage.openDefaultApp();
        await libraryPage.openDossierInfoWindow(botName);
        await since('Bot active toggle in info window in Library home should be on, instead we have off.')
            .expect(await libraryPage.infoWindow.isActiveToggleButtonOn())
            .toBe(true);
        await takeScreenshotByElement(
            await libraryPage.infoWindow.getCoverImage(),
            'TC91744_04_02',
            'Cover image shows as active in info window'
        );
    });

    it('[TC91744_05] modify cover image by url', async () => {
        const imageUrl = 'https://demo.microstrategy.com/MicroStrategy/images/Coverpages/16-9/26.jpg';
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getCoverImageContainer(),
            'TC91744_05_01',
            'Default bot cover image'
        );
        await botAuthoring.generalSettings.updateBotCoverImage({
            url: imageUrl,
        });
        await botAuthoring.generalSettings.openCoverImageEditDialog();
        await since('Bot cover image url should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.getCoverImageUrlInputBox().getValue())
            .toBe(imageUrl);
        await botAuthoring.generalSettings.closeCoverImageEditDialog();
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await takeScreenshotByElement(
            aibotChatPanel.getWelcomePageBotIcon(),
            'TC91744_05_02',
            'Updated bot cover image by url in welcome on consumption mode'
        );
        await libraryPage.openDefaultApp();
        await libraryPage.openDossierInfoWindow(botName);
        await since('Bot active toggle in info window in Library home should be on, instead we have off.')
            .expect(await libraryPage.infoWindow.isActiveToggleButtonOn())
            .toBe(true);
        await takeScreenshotByElement(
            await libraryPage.infoWindow.getCoverImage(),
            'TC91744_05_03',
            'Updated cover image by url in info window'
        );
    });

    it('[TC91744_06] view ootb cover images', async () => {
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.openCoverImageEditDialog();
        await takeScreenshotByElement(
            await botAuthoring.generalSettings.getEditCoverImageDialog(),
            'TC91744_06_01',
            'All tab of cover image editor'
        );
        await botAuthoring.generalSettings.switchBetweenImageCategory('Industry');
        await takeScreenshotByElement(
            await botAuthoring.generalSettings.getEditCoverImageDialog(),
            'TC91744_06_02',
            'Industry tab of cover image editor'
        );
        await botAuthoring.generalSettings.switchBetweenImageCategory('Color');
        await takeScreenshotByElement(
            await botAuthoring.generalSettings.getEditCoverImageDialog(),
            'TC91744_06_03',
            'Color tab of cover image editor'
        );
        await botAuthoring.generalSettings.closeCoverImageEditDialog();
    });

    it('[TC91744_07] update cover image by ootb images', async () => {
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateBotCoverImage({ index: 3 });
        await botAuthoring.generalSettings.openCoverImageEditDialog();
        await takeScreenshotByElement(
            await botAuthoring.generalSettings.getEditCoverImageDialog(),
            'TC91744_07_01',
            'Highlight selected cover image'
        );
        await botAuthoring.generalSettings.closeCoverImageEditDialog();
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getCoverImageContainer(),
            'TC91744_07_02',
            'Updated cover image in general settings'
        );
        await takeScreenshotByElement(
            botAuthoring.aibotChatPanel.getWelcomePageBotIcon(),
            'TC91744_07_03',
            'Updated bot cover image in chat welcome section'
        );
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await libraryPage.openDossierInfoWindow(botName);
        await since('Bot active toggle in info window in Library home should be on, instead we have off.')
            .expect(await libraryPage.infoWindow.isActiveToggleButtonOn())
            .toBe(true);
        await takeScreenshotByElement(
            await libraryPage.infoWindow.getCoverImage(),
            'TC91744_07_04',
            'Cover image shows as active in info window'
        );
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await takeScreenshotByElement(
            botAuthoring.aibotChatPanel.getWelcomePageBotIcon(),
            'TC91744_07_05',
            'Updated bot cover image in welcome section of consumption mode'
        );
    });

    it('[TC91744_08] update cover image by long url', async () => {
        const longImageUrl =
            'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Fdc2027bc-5b9f-401a-a366-b118eec61d11%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000q=a80&n=0&g=0n&fmt=auto?sec=1703387319';
        const invalidImageUrl = 'mstr.com';
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.openCoverImageEditDialog();
        await botAuthoring.generalSettings.updateCoverImageUrl(longImageUrl);
        await botAuthoring.generalSettings.tabForward();
        await botAuthoring.generalSettings.waitForElementVisible(
            botAuthoring.generalSettings.getCoverImageUrlWarningMessage()
        );
        await since('Invalid url warning message should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.getCoverImageUrlWarningMessage().getText())
            .toBe(botSettings.coverImageUrlNotAccessibleErrorMessage);
        await takeScreenshotByElement(
            await botAuthoring.generalSettings.getEditCoverImageDialog(),
            'TC91744_08_01',
            'image url invalid'
        );
        await botAuthoring.generalSettings.closeCoverImageEditDialog();
        await botAuthoring.saveBot({});
        await botAuthoring.aibotChatPanel.goToLibrary();
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.openCoverImageEditDialog();
        await takeScreenshotByElement(
            await botAuthoring.generalSettings.getEditCoverImageDialog(),
            'TC91744_08_02',
            'cover image reset to default'
        );
        await botAuthoring.generalSettings.updateCoverImageUrl(invalidImageUrl);
        await botAuthoring.generalSettings.tabForward();
        await botAuthoring.generalSettings.waitForElementVisible(
            botAuthoring.generalSettings.getCoverImageUrlWarningMessage()
        );
        await since('Invalid url prefix warning message should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.getCoverImageUrlWarningMessage().getText())
            .toBe(botSettings.coverImageUrlPrefixErrorMessage);
        await botAuthoring.generalSettings.closeCoverImageEditDialog();
        await botAuthoring.generalSettings.waitForElementVisible(
            botAuthoring.generalSettings.getCoverImageNotFoundIndicator()
        );
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getCoverImageContainer(),
            'TC91744_08_04',
            'default image with not found'
        );
    });

    it('[TC91744_09] string not allow in bot name', async () => {
        const botNameToUpdate = `[]"\\`;
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateBotName(botNameToUpdate);
        await botAuthoring.generalSettings.tabForward();
        await since('Bot name should update to #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(botNameToUpdate);
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTitleBarBotName().getText())
            .toBe(botSettings.defaultBotName);
        await takeScreenshotByElement(
            await botAuthoring.generalSettings.getBotInfoSection(),
            'TC91744_09_01',
            'Invalid input in bot name'
        );
        await botAuthoring.generalSettings.hoverOnBotNameInvalidInputWarningIcon();
        await since('Warning message of invalid input on bot name should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.getTooltipFullText())
            .toBe(botSettings.botNameInvalidInputCharactersErrorMessage);
        await botAuthoring.saveBot({});
        await botAuthoring.aibotChatPanel.goToLibrary();
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since('Chat bot title bar bot name should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarBotNameTexts())
            .toBe(botSettings.defaultBotName);
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Bot name should update to #{expected} after reopen, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(botSettings.defaultBotName);
        await takeScreenshotByElement(
            await botAuthoring.generalSettings.getBotInfoSection(),
            'TC91744_09_02',
            'Reset to default bot name after reopen'
        );
    });

    it('[TC91744_10] color theme should not take effect on settings panel', async () => {
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await botAppearance.changeThemeTo('Yellow');
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.openCoverImageEditDialog();
        await takeScreenshotByElement(
            await botAuthoring.generalSettings.getEditCoverImageDialog(),
            'TC91744_10_01',
            'cover image editor in yellow theme'
        );
        await botAuthoring.generalSettings.closeCoverImageEditDialog();
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await botAppearance.changeThemeTo('Dark');
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.openCoverImageEditDialog();
        await takeScreenshotByElement(
            await botAuthoring.generalSettings.getEditCoverImageDialog(),
            'TC91744_10_02',
            'cover image editor in dark theme'
        );
    });

    it('[TC91744_11] update cover image by copy and paste', async () => {
        const longImageUrl =
            'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Fdc2027bc-5b9f-401a-a366-b118eec61d11%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1703387319&t=f5e7e559bd7ffabdb6f6ea1870852107';

        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.setTextToClipboard(longImageUrl);
        await botAuthoring.generalSettings.openCoverImageEditDialog();
        await botAuthoring.generalSettings.click({ elem: botAuthoring.generalSettings.getCoverImageUrlInputBox() });
        await botAuthoring.generalSettings.paste();
        await botAuthoring.generalSettings.tabForward();
        await botAuthoring.generalSettings.waitForElementVisible(
            botAuthoring.generalSettings.getCoverImageUrlWarningMessage()
        );
        await since('Url too long warning message should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.getCoverImageUrlWarningMessage().getText())
            .toBe(botSettings.coverImageUrlTooLongErrorMessage);
        await botAuthoring.generalSettings.closeCoverImageEditDialog();
        await botAuthoring.saveBot({});
        await botAuthoring.aibotChatPanel.goToLibrary();
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.openCoverImageEditDialog();
        await since('Image url should be empty, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.getCoverImageUrlInputBox().getText())
            .toBe('');
        await since('Invalid image url message should not display, instead it is shown')
            .expect(await botAuthoring.generalSettings.getCoverImageUrlWarningMessage().isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            await botAuthoring.generalSettings.getEditCoverImageDialog(),
            'TC91744_11_01',
            'cover image reset to default'
        );
    });

    //TC91745: [Chatbot] [General Settings] Verify Bot greeting settings in general tab
    it('[TC91745_01] modify bot greeting', async () => {
        const greetingText = 'I am your bot, I can answer any of your questions about your data, just ask me!';
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');

        await botAuthoring.generalSettings.updateGreetings(greetingText);
        await since('Bot greeting should update to #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getGreetingInputBox().getValue())
            .toBe(greetingText);
        await since('Default Greeting message in chat should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
            .toBe(greetingText);
        await since('Greeting message count should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getGreetingCount().getText())
            .toBe(`${greetingText.length}/${botSettings.greetingMaxLength}`);
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since('Greeting message should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getWelcomePageMessageTexts())
            .toBe(greetingText);
        await libraryPage.openDefaultApp();
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await since('Bot greeting should update to #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getGreetingInputBox().getValue())
            .toBe(greetingText);
        await since('Default Greeting message in chat should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
            .toBe(greetingText);
        await since('Greeting message count should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getGreetingCount().getText())
            .toBe(`${greetingText.length}/${botSettings.greetingMaxLength}`);
    });

    it('[TC91745_02] modify bot greeting by long string', async () => {
        const greetingText =
            'I am your bot with long string with long string with long string with long string with long string with long string with long string with long string with long string with long string with long string with long string with long string with long string in end I am your bot with long string with long string with long string with long string with long string with long string with long string with long string with long string with long string with long string with long string with long with in the end';
        const actualGreeting = greetingText.substring(0, botSettings.greetingMaxLength);
        const maxCounterText = `${botSettings.greetingMaxLength}/${botSettings.greetingMaxLength}`;
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');

        await botAuthoring.generalSettings.updateGreetings(greetingText);
        await since('Greeting message count should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getGreetingCount().getText())
            .toBe(maxCounterText);
        await since('Bot greeting should update to #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getGreetingInputBox().getValue())
            .toBe(actualGreeting);
        await since('Default Greeting message in chat should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
            .toBe(actualGreeting);
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since('Greeting message should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getWelcomePageMessageTexts())
            .toBe(actualGreeting);
        await libraryPage.openDefaultApp();
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await since('Greeting message count should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getGreetingCount().getText())
            .toBe(maxCounterText);
        await since('Bot greeting should update to #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getGreetingInputBox().getValue())
            .toBe(actualGreeting);
        await since('Default Greeting message in chat should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
            .toBe(actualGreeting);
    });

    it('[TC91745_03] modify bot name should sync name in greeting', async () => {
        const botNameToUpdate = `Bot Javis`;
        const objectName = 'TC91745 Test bot name sync in greeting';
        await libraryAuthoringPage.createBotWithDataset({ dataset: 'byd_balance_ds_en' });
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateBotName(botNameToUpdate);
        await since('Bot name should update to #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(botNameToUpdate);
        const greetingMessageTextNew = await botAuthoring.generalSettings.getGreetingInputBox().getValue();
        await since('Bot name should update to #{expected} in greeting section in settings, instead we have #{actual}.')
            .expect(greetingMessageTextNew.includes(botNameToUpdate))
            .toBe(true);
        const welcomeMessageTextsNew = await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts();
        await since(
            'Bot name should update to #{expected} in welcome message of chat panel, instead we have #{actual}.'
        )
            .expect(welcomeMessageTextsNew.includes(botNameToUpdate))
            .toBe(true);
        await botAuthoring.saveAsBot({ name: objectName });
        const createdBotId = await botAuthoring.getBotIdFromUrl();
        botIdsToDelete.push(createdBotId);
    });

    it('[TC91745_04] default greeting when clear text input', async () => {
        const customGreeting = `I am Javis`;
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');

        await botAuthoring.generalSettings.updateGreetings(customGreeting);
        await since('Bot greeting should update to #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getGreetingInputBox().getValue())
            .toBe(customGreeting);
        await botAuthoring.generalSettings.updateGreetings('');
        await botAuthoring.generalSettings.tabForward();
        await since('Bot greeting should update to #{expected} after clear text, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getGreetingInputBox().getValue())
            .toBe(botSettings.defaultGreeting);
        await botAuthoring.saveBot({});
    });

    it('[TC91745_05] greeting message should always sync up with bot name field', async () => {
        const botNames = ['Bot Javis', 'Bot Javis 2', 'Bot Javis 3'];
        const greetingTemplate = botSettings.defaultGreeting.replace(`${botSettings.defaultBotName}`, 'placeholder');
        for (let botName of botNames) {
            await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
            await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
            await libraryAuthoringPage.waitForCurtainDisappear();
            await botAuthoring.selectBotConfigTabByName('General');
            await botAuthoring.generalSettings.updateBotName(botName);
            await botAuthoring.saveBot({});
            await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
            await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
            await libraryAuthoringPage.waitForCurtainDisappear();
            await botAuthoring.selectBotConfigTabByName('General');
            await since('Bot name should update to #{expected}, instead we have #{actual}.')
                .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
                .toBe(botName);
            const expectedGreeting = greetingTemplate.replace('placeholder', botName);
            await since('Bot greeting in settings should update to #{expected}, instead we have #{actual}.')
                .expect(await botAuthoring.generalSettings.getGreetingInputBox().getValue())
                .toBe(expectedGreeting);
            await since('Greeting message in chat panel should update to #{expected}, instead we have #{actual}.')
                .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
                .toBe(expectedGreeting);
        }
    });

    //DE288388 - AI Bot | Edit Data | When AI service is configured but AI Search Service is not configured, the components in the panel are pushed down
    it('[TC91745_06] bot configuration panel check with no search service', async () => {
        const objectName = 'TC91745_06';
        await mockISAiSearchConfiguration({ user: configBotUser });
        await libraryPage.openDefaultApp();
        await libraryAuthoringPage.createBotWithNewData({});
        await botAuthoring.createBotBySampleData(languageIdMap.EnglishUnitedStates);
        await takeScreenshotByElement(
            await botAuthoring.getBotConfigContainer(),
            'TC91745_06_01',
            'dataset panel with no search service'
        );
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.toggleTopicSwitch();
        await takeScreenshotByElement(
            await botAuthoring.getBotConfigContainer(),
            'TC91745_06_02',
            'general settings panel with no search service'
        );
        await botAuthoring.saveAsBot({ name: objectName });
        const newBotId = await botAuthoring.getBotIdFromUrl();
        botIdsToDelete.push(newBotId);
    });

    it('[TC95302_01] unify bot log with cover image', async () => {
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.toggleTopicSwitch();
        await takeScreenshotByElement(
            await botAuthoring.getBotConfigContainer(),
            'TC95302_01_01',
            'display logo checked by default'
        );
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await takeScreenshotByElement(
            await botAuthoring.getBotConfigContainer(),
            'TC95302_01_02',
            'remove bot logo in appearance tab'
        );
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.toggleDisplayBotLogo(false);
        await since('1. Bot logo setting checkbox status should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.isDisplayBotLogoSettingOn())
            .toBe(false);
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await botAuthoring.aibotChatPanel.goToLibrary();
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('General');
        await since(
            '2. Bot logo setting checkbox status should be #{expected} after reopen, instead we have #{actual}.'
        )
            .expect(await botAuthoring.generalSettings.isDisplayBotLogoSettingOn())
            .toBe(false);
    });

    it('[TC95302_02] show tooltip when bot logo has been saved', async () => {
        const botName = 'TC95302 Bot Logo Added';
        const botLogTestObj = getBotObjectToEdit({ botName, enableTopics: false });
        botLogTestObj.configuration.appearance = {
            logoUrl: 'https://demo.microstrategy.com/MicroStrategy/images/Coverpages/16-9/43.jpg',
            showLogo: true,
        };
        const id = await createBotByAPI({ credentials: configBotUser, botInfo: botLogTestObj });
        botIdsToDelete.push(id);
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId: id });
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            await botAuthoring.getBotConfigContainer(),
            'TC95302_02_01',
            'show info icon when bot logo set'
        );
        await botAuthoring.generalSettings.hoverOnBotLogoInfoIcon();
        await since('Tooltip message should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getTooltipDisplayedText())
            .toBe(botSettings.botLogoTooltipText);
    });
});
