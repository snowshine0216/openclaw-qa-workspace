import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { createBotByAPI, publishBotByAPI, deleteBotList } from '../../../api/bot/index.js';
import { browserWindow } from '../../../constants/index.js';
import { configBotUser, botSettings, languageIdMap } from '../../../constants/bot.js';

describe('AI Bot Premerge Test of General Settings', () => {
    const BotToTest = {
        name: 'TC92132. Bot-To-Test',
        defaultName: botSettings.defaultBotName,
        modifiedName: `TC92132's - modified name`,
        defaultGreeting: botSettings.defaultGreeting,
        modifiedGreeting: 'I am Javis. I will tell you anything you are insterested in.',
        defaultHint: 'Ask me a question',
        modifiedHint: 'Ask anything here..',
        imageUrl: 'https://demo.microstrategy.com/MicroStrategy/images/Coverpages/16-9/26.jpg',
        customSuggestions: [
            'Show me stocks by type in grid',
            'Show me the index by Data sources',
            'Show me all the data',
            'Show me Total Assets by Data sources',
            'Show me Capital reserve trend by Index',
        ],
        externalLinks: [
            {
                iconIndex: 0,
                url: 'https://www.microstrategy.com/en',
                title: 'MSTR',
            },
            {
                iconIndex: 1,
                url: 'https://www.google.com',
                title: 'Google',
            },
            {
                iconIndex: 2,
                url: 'https://www.apple.com/',
                title: 'Apple',
            },
        ],
    };

    const BotToCreate = {
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        },
        data: {
            datasets: [
                {
                    id: '2F4F0B6753429DF701EB65AA27B63068',
                    name: 'byd_balance_ds_en', //02_Users > xuyin > byd_balance_ds_en
                },
            ],
            isBot: true,
            overwrite: true,
            name: 'TC92132, Bot General Settings Premerge Test',
            description: '',
            folderId: 'D3C7D461F69C4610AA6BAA5EF51F4125', //Tutorial > Public Objects > Reports
        },
    };

    const publishInfo = {
        type: 'document_definition',
        recipients: [
            {
                id: '9A424D5159437DCE24326998A3CF0D76',
            },
        ],
        projectId: BotToCreate.project.id,
    };

    let { loginPage, libraryPage, libraryAuthoringPage, botAuthoring, dossierPage, aibotChatPanel } = browsers.pageObj1;
    let botId;
    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(configBotUser);
    });

    beforeEach(async () => {
        botId = await createBotByAPI({ credentials: configBotUser, botInfo: BotToCreate });
        publishInfo.id = botId;
        await publishBotByAPI({
            credentials: configBotUser,
            publishInfo: publishInfo,
        });
        await libraryPage.openDefaultApp();
    });

    afterEach(async () => {
        await deleteBotList({
            credentials: configBotUser,
            botList: [botId],
            projectId: BotToCreate.project.id,
        });
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    //TC92132: [Chatbot] [General Settings] [Premerge Test] Verify bot settings under general tab
    it('[TC92132_01] edit bot info and check in authoring and consumption mode', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        const welcomeMessageTextsOld = await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts();
        // check default values
        await since(
            `Bot name should not include ${BotToTest.modifiedName} in welcome message of chat panel, instead it has.`
        )
            .expect(welcomeMessageTextsOld.includes(BotToTest.modifiedName))
            .toBe(false);
        await since('Default Bot name should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(BotToTest.defaultName);
        await since('Default Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTitleBarBotName().getText())
            .toBe(BotToTest.defaultName);
        await since('Default Greeting message in settings should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getGreetingInputBox().getText())
            .toBe(BotToTest.defaultGreeting);
        await since('Default Greeting message in chat should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
            .toBe(BotToTest.defaultGreeting);
        // modify bot settings
        await botAuthoring.generalSettings.updateBotName(BotToTest.modifiedName);
        // check in authoring mode
        await since('Bot name should update to #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(BotToTest.modifiedName);
        const welcomeMessageTextsNew = await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts();
        await since(
            'Bot name should update to #{expected} in welcome message of chat panel, instead we have #{actual}.'
        )
            .expect(welcomeMessageTextsNew.includes(BotToTest.modifiedName))
            .toBe(true);
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTitleBarBotName().getText())
            .toBe(BotToTest.modifiedName);
        await botAuthoring.generalSettings.updateGreetings(BotToTest.modifiedGreeting);
        await since('Default Greeting message in chat should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
            .toBe(BotToTest.modifiedGreeting);
        await since('Default Greeting message in settings should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getGreetingInputBox().getText())
            .toBe(BotToTest.modifiedGreeting);
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        // check in consumption mode
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since('Chat bot title bar bot name should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarBotNameTexts())
            .toBe(BotToTest.modifiedName);
        await since('Greeting message should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getWelcomePageMessageTexts())
            .toBe(BotToTest.modifiedGreeting);
        await since('Chat bot input hint should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getHintText())
            .toBe(BotToTest.defaultHint);
        await since('Default Greeting message in chat should be #{expected}, instead we have #{actual}.')
            .expect(await aibotChatPanel.getWelcomePageMessageTexts())
            .toBe(BotToTest.modifiedGreeting);
        await libraryPage.openDefaultApp();
        // re-open bot
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: botId });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since('Chat bot title bar bot name should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarBotNameTexts())
            .toBe(BotToTest.modifiedName);
        await since('Greeting message should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getWelcomePageMessageTexts())
            .toBe(BotToTest.modifiedGreeting);
        await since('Chat bot input hint should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getHintText())
            .toBe(BotToTest.defaultHint);
        await since('Default Greeting message in chat should be #{expected}, instead we have #{actual}.')
            .expect(await aibotChatPanel.getWelcomePageMessageTexts())
            .toBe(BotToTest.modifiedGreeting);
    });

    it('[TC92132_02] edit bot cover image', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getCoverImageContainer(),
            'TC92132_02',
            'Default bot cover image'
        );
        await botAuthoring.generalSettings.updateBotCoverImage({ index: 15 });
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getCoverImageContainer(),
            'TC92132_02',
            'Updated bot cover image in settings'
        );
        await takeScreenshotByElement(
            botAuthoring.aibotChatPanel.getWelcomePageBotIcon(),
            'TC92132_02',
            'Updated bot cover image in welcome'
        );
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await takeScreenshotByElement(
            aibotChatPanel.getWelcomePageBotIcon(),
            'TC92132_02',
            'Updated bot cover image in welcome on consumption mode'
        );
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');

        await botAuthoring.generalSettings.updateBotCoverImage({
            url: BotToTest.imageUrl,
        });
        await botAuthoring.generalSettings.openCoverImageEditDialog();
        await since('Bot cover image url should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.getCoverImageUrlInputBox().getValue())
            .toBe(BotToTest.imageUrl);
        await botAuthoring.generalSettings.getSaveButtonInCoverImageDialog().click();
        await botAuthoring.waitForElementStaleness(botAuthoring.generalSettings.getEditCoverImageDialog());
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await takeScreenshotByElement(
            aibotChatPanel.getWelcomePageBotIcon(),
            'TC92132_02',
            'Updated bot cover image by url in welcome on consumption mode'
        );
    });

    it('[TC92132_03] edit bot features and check in both authoring and consumption mode', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Default value of active status should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.isActiveBotSwitchOn())
            .toBe(true);
        await since('Default value of allow snapshot should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.isAllowSnapshotSwitchOn())
            .toBe(true);
        await since('Default value of enable question suggestion should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.isEnableSuggestionSwitchOn())
            .toBe(true);
        await since('Default value of auto suggestion should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.getTotalAutoGenerateSuggestionLimit().getText())
            .toBe('3');
        await since('Default value of question limit should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.getQuestionLimitInputBox().getValue())
            .toBe('');
        await since('The placeholder of question limit should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.getQuestionLimitPlaceHolder())
            .toBe('No limit');
        await botAuthoring.generalSettings.turnOffAllowSnapshot();
        await botAuthoring.generalSettings.turnOffEnableSuggestion();
        await botAuthoring.generalSettings.setQuestionLimit(100);
        await since('Allow snapshot setting should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.isAllowSnapshotSwitchOn())
            .toBe(false);
        await since('Enable question suggestion should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.isEnableSuggestionSwitchOn())
            .toBe(false);
        await since('isDisplay of question suggestion section should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.getQuestionSugestionsSection().isDisplayed())
            .toBe(false);
        await since('Question limit should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.getQuestionLimitInputBox().getValue())
            .toBe('100');
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Allow snapshot setting should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.isAllowSnapshotSwitchOn())
            .toBe(false);
        await since('Enable question suggestion should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.isEnableSuggestionSwitchOn())
            .toBe(false);
        await since('isDisplay of question suggestion section should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.getQuestionSugestionsSection().isDisplayed())
            .toBe(false);
        await since('Question limit should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.getQuestionLimitInputBox().getValue())
            .toBe('100');
        await botAuthoring.saveBot({});
    });

    it('[TC92132_04] verify custom suggestion settings', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.turnOnEnableSuggestion();
        await since('isDisplay of question suggestion section should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.getQuestionSugestionsSection().isDisplayed())
            .toBe(true);
        await botAuthoring.generalSettings.setAutoSuggestionLimit('0');
        await botAuthoring.generalSettings.addCustomSuggestion(BotToTest.customSuggestions[0]);
        await botAuthoring.generalSettings.addCustomSuggestion(BotToTest.customSuggestions[1]);
        await botAuthoring.generalSettings.addCustomSuggestion(BotToTest.customSuggestions[2]);
        await botAuthoring.generalSettings.addCustomSuggestion(BotToTest.customSuggestions[3]);
        await since('isDisplay of add custom suggestion button should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.getAddNewCustomSuggestionButton().isEnabled())
            .toBe(true);
        await botAuthoring.generalSettings.addCustomSuggestion(BotToTest.customSuggestions[4]);
        await since('isDisplay of add custom suggestion button should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.getAddNewCustomSuggestionButton().isEnabled())
            .toBe(false);
        for (const index in BotToTest.customSuggestions) {
            await since(
                `The #${index} custom suggestion in authoring chat panel should be #{expected}, instead we have #{actual}`
            )
                .expect(await botAuthoring.aibotChatPanel.getRecommendationTextsByIndex(index))
                .toBe(BotToTest.customSuggestions[index]);
        }
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        for (const index in BotToTest.customSuggestions) {
            await since(
                `The #${index} custom suggestion in consumpation chat panel should be #{expected}, instead we have #{actual}`
            )
                .expect(await aibotChatPanel.getRecommendationTextsByIndex(index))
                .toBe(BotToTest.customSuggestions[index]);
        }
    });

    it('[TC92132_05] verify external links', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.addExternalLink(BotToTest.externalLinks[0]);
        await botAuthoring.generalSettings.addExternalLink(BotToTest.externalLinks[1]);
        await since('isDisplay of Add link button should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.getAddLinkButton().isDisplayed())
            .toBe(true);
        await botAuthoring.generalSettings.addExternalLink(BotToTest.externalLinks[2]);
        await since(
            'isDisplay of Add link button should be #{expected} after adding 3 links, instead we have #{actual}'
        )
            .expect(await botAuthoring.generalSettings.getAddLinkButton().isDisplayed())
            .toBe(false);
        await since('Total external links should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getLinkItems().length)
            .toBe(3);
        for (const index in BotToTest.externalLinks) {
            await since(`The #${index} external links name should be #{expected}, instead we have #{actual}.`)
                .expect(await botAuthoring.generalSettings.getLinkItemNameByIndex(index).getValue())
                .toBe(BotToTest.externalLinks[index].title);
            await since(`The #${index} external links url should be #{expected}, instead we have #{actual}.`)
                .expect(await botAuthoring.generalSettings.getLinkItemUrlByIndex(index).getValue())
                .toBe(BotToTest.externalLinks[index].url);
        }
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.openExternalLinkOnChatTitleBarByIndex(2);
        await aibotChatPanel.switchToNewWindow();
        await since('The url of external link should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.currentURL())
            .toBe(BotToTest.externalLinks[2].url);
        await aibotChatPanel.switchToTab(0);
        await aibotChatPanel.closeTab(1);
    });

    it('[TC92132_06] create bot from UI and reopen it', async () => {
        const botNameToUpdate = `New Bot Name`;
        const objectName = 'TC92132_06';
        await libraryPage.openDefaultApp();
        await libraryAuthoringPage.createBotWithNewData({});
        await botAuthoring.createBotBySampleData(languageIdMap.EnglishUnitedStates);
        await botAuthoring.saveAsBot({ name: objectName });
        botId = await botAuthoring.getBotIdFromUrl();
        await botAuthoring.exitBotAuthoring();
        await dossierPage.goToLibrary();
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateBotName(botNameToUpdate);
        await since('Bot name should update to #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(botNameToUpdate);
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await dossierPage.goToLibrary();
    });
});
