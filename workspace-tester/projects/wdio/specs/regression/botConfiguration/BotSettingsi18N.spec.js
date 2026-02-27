import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import resetUserLanguage from '../../../api/resetUserLanguage.js';
import setUserLanguage from '../../../api/setUserLanguage.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { createBotByAPI, deleteBotList } from '../../../api/bot/index.js';
import { browserWindow } from '../../../constants/index.js';
import { botConfigI18BotUser, getBotObjectInfo, languageIdMap, botSettings } from '../../../constants/bot.js';
import urlParser from '../../../api/urlParser.js';

describe('AI Bot General Settings i18N', () => {
    let { loginPage, libraryPage, libraryAuthoringPage, botAuthoring } = browsers.pageObj1;
    const botIdsToDelete = [];
    const botName = 'TC92521 Bot Settings i18N Test';
    const BotToCreate = getBotObjectInfo({ botName });
    const baseUrl = urlParser(browser.options.baseUrl);
    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetUserLanguage({ credentials: botConfigI18BotUser });
    });

    afterEach(async () => {
        await deleteBotList({
            credentials: botConfigI18BotUser,
            botList: [...botIdsToDelete],
            projectId: BotToCreate.project.id,
        });
        botIdsToDelete.length = 0;
        await logoutFromCurrentBrowser();
    });

    it('[TC92521_01] create bot without open general settings tab', async () => {
        const botNameToUpdate = `New Bot Name`;
        const objectName = 'TC92521_01';
        await libraryPage.openDefaultApp();
        await loginPage.login(botConfigI18BotUser);
        await libraryAuthoringPage.createBotWithNewData({});
        await botAuthoring.createBotBySampleData(languageIdMap.EnglishUnitedStates);
        await botAuthoring.saveAsBot({ name: objectName });
        const createdBotId = await botAuthoring.getBotIdFromUrl();
        botIdsToDelete.push(createdBotId);
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: createdBotId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateBotName(botNameToUpdate);
        await since('Bot name should update to #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(botNameToUpdate);
        const greetingMessageTextNew = await botAuthoring.generalSettings.getGreetingInputBox().getValue();
        await since('Bot name should update to #{expected} in greeting section in settings, instead we have #{actual}.')
            .expect(greetingMessageTextNew.includes(botNameToUpdate))
            .toBe(true);
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTitleBarBotName().getText())
            .toBe(botNameToUpdate);
        const welcomeMessage = await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts();
        await since(`Bot name should include ${botNameToUpdate} in welcome message of chat panel, instead it has.`)
            .expect(welcomeMessage.includes(botNameToUpdate))
            .toBe(true);
    });

    it('[TC92521_02] check UI under Chinese', async () => {
        await setUserLanguage({
            baseUrl,
            userId: botConfigI18BotUser.id,
            adminCredentials: botConfigI18BotUser,
            localeId: languageIdMap.ChineseSimplified,
        });
        let botId = await createBotByAPI({ credentials: botConfigI18BotUser, botInfo: BotToCreate });
        botIdsToDelete.push(botId);
        await libraryPage.openDefaultApp();
        await loginPage.login(botConfigI18BotUser);
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC92521_02_01',
            'General settings tab in Chinese'
        );
        await botAuthoring.generalSettings.updateBotName('[]');
        await botAuthoring.generalSettings.tabForward();
        await botAuthoring.generalSettings.hoverOnBotNameInvalidInputWarningIcon();
        await since('Warning message of invalid input on bot name should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.getTooltipFullText())
            .toBe(botSettings.botNameInvalidErrorMessageInChinese);
    });

    it('[TC92521_03] create bot without open general settings tab under Chinese', async () => {
        const botNameToUpdate = `中文`;
        const objectName = 'TC92521_03';
        await setUserLanguage({
            baseUrl,
            userId: botConfigI18BotUser.id,
            adminCredentials: botConfigI18BotUser,
            localeId: languageIdMap.ChineseSimplified,
        });
        await libraryPage.openDefaultApp();
        await loginPage.login(botConfigI18BotUser);
        await libraryAuthoringPage.createBotWithNewData({});
        await botAuthoring.createBotBySampleData(languageIdMap.ChineseSimplified);
        await botAuthoring.saveAsBot({ name: objectName });
        const createdBotId = await botAuthoring.getBotIdFromUrl();
        botIdsToDelete.push(createdBotId);
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: createdBotId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateBotName(botNameToUpdate);
        await since('Bot name should update to #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(botNameToUpdate);
        const greetingMessageTextNew = await botAuthoring.generalSettings.getGreetingInputBox().getValue();
        await since('Bot name should update to #{expected} in greeting section in settings, instead we have #{actual}.')
            .expect(greetingMessageTextNew.includes(botNameToUpdate))
            .toBe(true);
    });

    it('[TC92521_04] check general settings multilingual support', async () => {
        let botId = await createBotByAPI({ credentials: botConfigI18BotUser, botInfo: BotToCreate });
        botIdsToDelete.push(botId);
        await libraryPage.openDefaultApp();
        await setUserLanguage({
            baseUrl,
            userId: botConfigI18BotUser.id,
            adminCredentials: botConfigI18BotUser,
            localeId: languageIdMap.EnglishUnitedStates,
        });
        await loginPage.login(botConfigI18BotUser);
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.addExternalLink({
            iconIndex: 0,
            url: 'https://www.google.com/',
            title: '',
        });
        await botAuthoring.saveBot({});
        await botAuthoring.aibotChatPanel.goToLibrary();
        await logoutFromCurrentBrowser();
        await setUserLanguage({
            baseUrl,
            userId: botConfigI18BotUser.id,
            adminCredentials: botConfigI18BotUser,
            localeId: languageIdMap.ChineseSimplified,
        });
        await libraryPage.openDefaultApp();
        await loginPage.login(botConfigI18BotUser);
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC92521_04_01',
            'General settings tab in main language'
        );
        await botAuthoring.generalSettings.updateBotName('');
        await botAuthoring.generalSettings.updateGreetings('');
        await botAuthoring.generalSettings.updateQuestionInputHint('');
        await botAuthoring.generalSettings.addCustomSuggestion('自定义问题');
        await botAuthoring.generalSettings.setExternalLinkByIndex({
            iconIndex: 0,
            url: 'https://www.google.com/',
            title: '链接1',
        });
        await botAuthoring.saveBot({});
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC92521_04_02',
            'General settings tab in Chinese'
        );
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
        await setUserLanguage({
            baseUrl,
            userId: botConfigI18BotUser.id,
            adminCredentials: botConfigI18BotUser,
            localeId: languageIdMap.EnglishUnitedStates,
        });
        await loginPage.login(botConfigI18BotUser);
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC92521_04_03',
            'General settings tab in English'
        );
    });

    it('[TC92521_05] show default string in corresponding locale', async () => {
        const objectName = 'TC92521_05';
        await setUserLanguage({
            baseUrl,
            userId: botConfigI18BotUser.id,
            adminCredentials: botConfigI18BotUser,
            localeId: languageIdMap.EnglishUnitedStates,
        });
        await libraryPage.openDefaultApp();
        await loginPage.login(botConfigI18BotUser);
        await libraryAuthoringPage.createBotWithNewData({});
        await botAuthoring.createBotBySampleData(languageIdMap.EnglishUnitedStates);
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.toggleTopicSwitch();
        await botAuthoring.saveAsBot({ name: objectName });
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC92521_05_01',
            'General settings tab in main English'
        );
        const createdBotId = await botAuthoring.getBotIdFromUrl();
        botIdsToDelete.push(createdBotId);
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
        await setUserLanguage({
            baseUrl,
            userId: botConfigI18BotUser.id,
            adminCredentials: botConfigI18BotUser,
            localeId: languageIdMap.ChineseSimplified,
        });
        await loginPage.login(botConfigI18BotUser);
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: createdBotId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC92521_05_02',
            'General settings tab in Chinese'
        );
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
        await setUserLanguage({
            baseUrl,
            userId: botConfigI18BotUser.id,
            adminCredentials: botConfigI18BotUser,
            localeId: languageIdMap.Japanese,
        });
        await loginPage.login(botConfigI18BotUser);
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: createdBotId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC92521_05_03',
            'General settings tab in Japanese'
        );
    });

    it('[TC92521_06] modify settings on main language', async () => {
        const objectName = 'TC92521_06';
        await setUserLanguage({
            baseUrl,
            userId: botConfigI18BotUser.id,
            adminCredentials: botConfigI18BotUser,
            localeId: languageIdMap.EnglishUnitedStates,
        });
        await libraryPage.openDefaultApp();
        await loginPage.login(botConfigI18BotUser);
        await libraryAuthoringPage.createBotWithNewData({});
        await botAuthoring.createBotBySampleData(languageIdMap.EnglishUnitedStates);
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.toggleTopicSwitch();
        await botAuthoring.saveAsBot({ name: objectName });
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC92521_06_01',
            'General settings tab in main English'
        );
        const createdBotId = await botAuthoring.getBotIdFromUrl();
        botIdsToDelete.push(createdBotId);
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
        await setUserLanguage({
            baseUrl,
            userId: botConfigI18BotUser.id,
            adminCredentials: botConfigI18BotUser,
            localeId: languageIdMap.ChineseSimplified,
        });
        await loginPage.login(botConfigI18BotUser);
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: createdBotId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateBotName('中文名字');
        await botAuthoring.generalSettings.updateGreetings('中文问候');
        await botAuthoring.generalSettings.updateQuestionInputHint('中文提示');
        await botAuthoring.saveBot({});
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC92521_06_02',
            'Modify in Chinese'
        );
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
        await setUserLanguage({
            baseUrl,
            userId: botConfigI18BotUser.id,
            adminCredentials: botConfigI18BotUser,
            localeId: languageIdMap.Japanese,
        });
        await loginPage.login(botConfigI18BotUser);
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: createdBotId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC92521_06_03',
            'Default in Japanese',
            { tolerance: 0.2 }
        );
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
        await setUserLanguage({
            baseUrl,
            userId: botConfigI18BotUser.id,
            adminCredentials: botConfigI18BotUser,
            localeId: languageIdMap.EnglishUnitedStates,
        });
        await loginPage.login(botConfigI18BotUser);
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: createdBotId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateBotName('Bot name in English');
        await botAuthoring.generalSettings.updateGreetings('Greetings in English');
        await botAuthoring.generalSettings.updateQuestionInputHint('Question input hint in English');
        await botAuthoring.saveBot({});
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC92521_06_04',
            'Modify in main language English'
        );
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
        await setUserLanguage({
            baseUrl,
            userId: botConfigI18BotUser.id,
            adminCredentials: botConfigI18BotUser,
            localeId: languageIdMap.ChineseSimplified,
        });
        await loginPage.login(botConfigI18BotUser);
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: createdBotId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC92521_06_05',
            'Customized Chinese string after modify on main language'
        );
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
        await setUserLanguage({
            baseUrl,
            userId: botConfigI18BotUser.id,
            adminCredentials: botConfigI18BotUser,
            localeId: languageIdMap.Japanese,
        });
        await loginPage.login(botConfigI18BotUser);
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: createdBotId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC92521_06_06',
            'Fall back to default main language English',
            { tolerance: 0.2 }
        );
    });

    it('[TC92521_07] reset to default on main language', async () => {
        const objectName = 'TC92521_07';
        await setUserLanguage({
            baseUrl,
            userId: botConfigI18BotUser.id,
            adminCredentials: botConfigI18BotUser,
            localeId: languageIdMap.EnglishUnitedStates,
        });
        await libraryPage.openDefaultApp();
        await loginPage.login(botConfigI18BotUser);
        await libraryAuthoringPage.createBotWithNewData({});
        await botAuthoring.createBotBySampleData(languageIdMap.EnglishUnitedStates);
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.toggleTopicSwitch();
        await botAuthoring.generalSettings.updateBotName('Updated Bot Name');
        await botAuthoring.generalSettings.updateGreetings('Updated Greetings');
        await botAuthoring.generalSettings.updateQuestionInputHint('Updated hint');
        await botAuthoring.saveAsBot({ name: objectName });
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC92521_07_01',
            'Updated in main English'
        );
        const createdBotId = await botAuthoring.getBotIdFromUrl();
        botIdsToDelete.push(createdBotId);
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
        await setUserLanguage({
            baseUrl,
            userId: botConfigI18BotUser.id,
            adminCredentials: botConfigI18BotUser,
            localeId: languageIdMap.ChineseSimplified,
        });
        await loginPage.login(botConfigI18BotUser);
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: createdBotId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC92521_07_02',
            'Fall back to main English'
        );
        await botAuthoring.generalSettings.updateBotName('中文名字');
        await botAuthoring.generalSettings.updateGreetings('中文问候');
        await botAuthoring.generalSettings.updateQuestionInputHint('中文提示');
        await botAuthoring.saveBot({});
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
        await setUserLanguage({
            baseUrl,
            userId: botConfigI18BotUser.id,
            adminCredentials: botConfigI18BotUser,
            localeId: languageIdMap.EnglishUnitedStates,
        });
        await loginPage.login(botConfigI18BotUser);
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: createdBotId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.resetBotName();
        await botAuthoring.generalSettings.resetGreeting();
        await botAuthoring.generalSettings.resetQuestionInputHint();
        await botAuthoring.saveBot({});
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC92521_07_03',
            'Reset to default string in main English'
        );
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
        await setUserLanguage({
            baseUrl,
            userId: botConfigI18BotUser.id,
            adminCredentials: botConfigI18BotUser,
            localeId: languageIdMap.ChineseSimplified,
        });
        await loginPage.login(botConfigI18BotUser);
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: createdBotId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC92521_07_04',
            'Keep using customized Chinese string'
        );
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
        await setUserLanguage({
            baseUrl,
            userId: botConfigI18BotUser.id,
            adminCredentials: botConfigI18BotUser,
            localeId: languageIdMap.Japanese,
        });
        await loginPage.login(botConfigI18BotUser);
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: createdBotId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC92521_07_05',
            'Default string on Japanese',
            { tolerance: 0.2 }
        );
    });

    it('[TC92521_08] reset to default on non-main language', async () => {
        const objectName = 'TC92521_08';
        await setUserLanguage({
            baseUrl,
            userId: botConfigI18BotUser.id,
            adminCredentials: botConfigI18BotUser,
            localeId: languageIdMap.EnglishUnitedStates,
        });
        await libraryPage.openDefaultApp();
        await loginPage.login(botConfigI18BotUser);
        await libraryAuthoringPage.createBotWithNewData({});
        await botAuthoring.createBotBySampleData(languageIdMap.EnglishUnitedStates);
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.toggleTopicSwitch();
        await botAuthoring.generalSettings.updateBotName('Updated Bot Name');
        await botAuthoring.generalSettings.updateGreetings('Updated Greetings');
        await botAuthoring.generalSettings.updateQuestionInputHint('Updated hint');
        await botAuthoring.saveAsBot({ name: objectName });
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC92521_08_01',
            'Updated in main English'
        );
        const createdBotId = await botAuthoring.getBotIdFromUrl();
        botIdsToDelete.push(createdBotId);
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
        await setUserLanguage({
            baseUrl,
            userId: botConfigI18BotUser.id,
            adminCredentials: botConfigI18BotUser,
            localeId: languageIdMap.ChineseSimplified,
        });
        await loginPage.login(botConfigI18BotUser);
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: createdBotId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC92521_07_02',
            'Fall back to main English'
        );
        await botAuthoring.generalSettings.resetBotName();
        await botAuthoring.generalSettings.resetGreeting();
        await botAuthoring.generalSettings.resetQuestionInputHint();
        await botAuthoring.saveBot({});
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC92521_07_03',
            'Default string in Chinese'
        );
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
        await setUserLanguage({
            baseUrl,
            userId: botConfigI18BotUser.id,
            adminCredentials: botConfigI18BotUser,
            localeId: languageIdMap.EnglishUnitedStates,
        });
        await loginPage.login(botConfigI18BotUser);
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: createdBotId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC92521_07_04',
            'Customized string in English'
        );
    });
});
