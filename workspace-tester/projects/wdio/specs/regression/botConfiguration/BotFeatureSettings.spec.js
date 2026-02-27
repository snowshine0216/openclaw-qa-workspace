import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { createBotByAPI, publishBotByAPI, deleteBotList } from '../../../api/bot/index.js';
import { browserWindow } from '../../../constants/index.js';
import {
    configBotUser,
    getBotObjectInfo,
    getBotConfigurationObject,
    getPublishInfo,
    customSuggestionsSamples,
    botSettings,
    botInProjectDefaultPaletteCategorical,
} from '../../../constants/bot.js';

describe('AI Bot Feature settings on Authoring', () => {
    let { loginPage, libraryPage, libraryAuthoringPage, botAuthoring, aibotChatPanel } = browsers.pageObj1;
    let botId;
    const botIdsToDelete = [];
    const botName = 'TC91746 Bot Features Setting Test';
    const BotToCreate = getBotObjectInfo({ botName });
    BotToCreate.configuration = getBotConfigurationObject({
        enableTopics: false,
        enableQuestionSuggestions: true,
        enableInterpretation: true,
    });
    const question = 'What are the top 5 items in terms of Accounts receivable? Show in bar chart';
    const question2 = 'What are the lowest 4 items in terms of Accounts receivable? Show in bar chart';
    const question3 = 'What are the top 3 items in terms of Accounts payable? Show in bar chart';
    const question4 = 'What are the lowest 2 items in terms of Accounts payable? Show in bar chart';
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

    //TC91746: [Chatbot] [General Settings] Verify Bot optional features settings (allow snapshot) in general tab
    it('[TC91746_01] verify allow snapshot setting', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await since('1. Allow bot snapshot switch should be on, instead we have off.')
            .expect(await botAuthoring.generalSettings.isAllowSnapshotSwitchOn())
            .toBe(true);
        await since('2. Snapshot panel should not display in chat panel, instead it does show.')
            .expect(await botAuthoring.aibotChatPanel.getSnapshotPanelContainer().isDisplayed())
            .toBe(false);
        await since('3. Snapshot button in chat title bar should display, instead it does not show.')
            .expect(await botAuthoring.aibotChatPanel.getOpenSnapshotPanelButton().isDisplayed())
            .toBe(true);
        await botAuthoring.generalSettings.turnOffAllowSnapshot();
        await since('4. Allow bot snapshot switch should be off, instead we have on.')
            .expect(await botAuthoring.generalSettings.isAllowSnapshotSwitchOn())
            .toBe(false);
        await since('5. Snapshot panel should not display in chat panel, instead it does show.')
            .expect(await botAuthoring.aibotChatPanel.getSnapshotPanelContainer().isDisplayed())
            .toBe(false);
        await since('6. Snapshot button in chat title bar should not display, instead it does show.')
            .expect(await botAuthoring.aibotChatPanel.getOpenSnapshotPanelButton().isDisplayed())
            .toBe(false);
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since('7. Snapshot panel should not display in comsumption, instead it does show.')
            .expect(await aibotChatPanel.getSnapshotPanelContainer().isDisplayed())
            .toBe(false);
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await since('8. Allow bot snapshot switch should be off, instead we have on.')
            .expect(await botAuthoring.generalSettings.isAllowSnapshotSwitchOn())
            .toBe(false);
        await since('9. Snapshot button in chat title bar should not display, instead it does show.')
            .expect(await botAuthoring.aibotChatPanel.getOpenSnapshotPanelButton().isDisplayed())
            .toBe(false);
        await since('10. Snapshot panel should not display in chat panel, instead it does show.')
            .expect(await botAuthoring.aibotChatPanel.getSnapshotPanelContainer().isDisplayed())
            .toBe(false);
        await botAuthoring.generalSettings.turnOnAllowSnapshot();
        await since('10. Allow bot snapshot switch should be on, instead we have off.')
            .expect(await botAuthoring.generalSettings.isAllowSnapshotSwitchOn())
            .toBe(true);
        await since('11. Snapshot panel should not display in chat panel, instead it does show.')
            .expect(await botAuthoring.aibotChatPanel.getSnapshotPanelContainer().isDisplayed())
            .toBe(false);
        await since('12. Snapshot button in chat title bar should display, instead it does not show.')
            .expect(await botAuthoring.aibotChatPanel.getOpenSnapshotPanelButton().isDisplayed())
            .toBe(true);
        await botAuthoring.saveBot({});
        await libraryPage.openDefaultApp();
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.generalSettings.turnOnAllowSnapshot();
        await since('13. Allow bot snapshot switch should be on, instead we have off.')
            .expect(await botAuthoring.generalSettings.isAllowSnapshotSwitchOn())
            .toBe(true);
        await since('14. Snapshot panel should not display in chat panel, instead it does show.')
            .expect(await botAuthoring.aibotChatPanel.getSnapshotPanelContainer().isDisplayed())
            .toBe(false);
        await since('15. Snapshot button in chat title bar should display, instead it does not show.')
            .expect(await botAuthoring.aibotChatPanel.getOpenSnapshotPanelButton().isDisplayed())
            .toBe(true);
    });

    //TC93238: [Chatbot] [General Settings] Verify Bot optional features settings (enable interpretation) in general tab
    it('[TC93238_01] verify enable interpretation setting', async () => {
        //check new bot, default on
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Enable bot interpretation should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.isEnableInterpretationSwitchOn())
            .toBe(true);
        await botAuthoring.generalSettings.openInterpretationTooltip();
        await since('Tooltip of enable interpretation should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getTooltipDisplayedText())
            .toBe(botSettings.interpretationTooltipText);
        await aibotChatPanel.askQuestion(question);
        await aibotChatPanel.hoverOnLatestAnswer();
        await aibotChatPanel.waitForElementExsiting(aibotChatPanel.getInterpretationIcon());
        await since('1 Interpretation icon should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getCountOfInterpretation())
            .toBe(1);
        //turn off
        await botAuthoring.generalSettings.turnOffEnableInterpretation();
        await botAuthoring.aibotChatPanel.askQuestion(question2);
        //interpretation not exist
        await aibotChatPanel.waitForElementExsiting(aibotChatPanel.getChatBotPinIcon());
        await since('2 Interpretation icon should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getCountOfInterpretation())
            .toBe(0);
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        // consumption mode
        await aibotChatPanel.askQuestion(question3);
        await aibotChatPanel.waitForElementExsiting(aibotChatPanel.getChatBotPinIcon());
        await since('3 Interpretation icon should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getCountOfInterpretation())
            .toBe(0);
        // turn on again
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.turnOnEnableInterpretation();
        await aibotChatPanel.askQuestion(question4);
        await aibotChatPanel.scrollChatPanelToTop();
        await aibotChatPanel.scrollChatPanelToTop();
        await since('4 Interpretation icon should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getCountOfInterpretation())
            .toBe(4);
        // check existing bot, default on
        await libraryPage.editBotByUrl({
            projectId: botInProjectDefaultPaletteCategorical.project.id,
            botId: botInProjectDefaultPaletteCategorical.id,
        });
        await botAuthoring.selectBotConfigTabByName('General');
        await since('5 Enable bot interpretation should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.isEnableInterpretationSwitchOn())
            .toBe(true);
        await aibotChatPanel.clearHistoryAndAskQuestion('which brand has the highest revenue?');
        await since('6 Interpretation icon should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.isInterpretationIconDisplayedInAnswer(0))
            .toBe(true);
    });

    //TC91747: [Chatbot] [General Settings] Verify Bot question input settings (hint, question suggestion) in general tab
    it('[TC91747_01] verify question input hint setting', async () => {
        const customHint = 'Ask question here...';
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateQuestionInputHint(customHint);
        await since('Updated question input hint should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getQuestionInputHintInputBox().getValue())
            .toBe(customHint);
        await since('Input hint in chat panel should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.aibotChatPanel.getHintText())
            .toBe(customHint);
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since('Input hint in chat panel on consumption mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.aibotChatPanel.getHintText())
            .toBe(customHint);
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await since('Updated question input hint should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getQuestionInputHintInputBox().getValue())
            .toBe(customHint);
        await since('Input hint in chat panel should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.aibotChatPanel.getHintText())
            .toBe(customHint);
        await botAuthoring.saveBot({});
    });

    it('[TC91747_02] long string in questin input hint', async () => {
        const customHintWithLongString =
            'Ask me a question with a long string with with a long string with a long string with with a long string a long string with with a long string Ask me a question with a long string with a long in the end';
        const actualHint = customHintWithLongString.substring(0, botSettings.hintMaxLength);
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateQuestionInputHint(customHintWithLongString);
        await since('Updated question input hint should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getQuestionInputHintInputBox().getValue())
            .toBe(actualHint);
        await since('Input hint in chat panel should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.aibotChatPanel.getHintText())
            .toBe(actualHint);
        await botAuthoring.saveBot({});
    });

    it('[TC91747_03] default questin input hint when clear text input', async () => {
        const customHint = 'say something here..';
        const defaultHint = 'Ask me a question';
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateQuestionInputHint(customHint);
        await since('Updated question input hint should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getQuestionInputHintInputBox().getValue())
            .toBe(customHint);
        await botAuthoring.generalSettings.updateQuestionInputHint('');
        await botAuthoring.generalSettings.tabForward();
        await since('Updated question input hint should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getQuestionInputHintInputBox().getValue())
            .toBe(defaultHint);
        await botAuthoring.saveBot({});
    });

    it('[TC91747_04] verify enable suggestion setting', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Default status of enable suggestion should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.isEnableSuggestionSwitchOn())
            .toBe(true);
        await botAuthoring.generalSettings.turnOffEnableSuggestion();
        await since('Enable suggestion should be #{expected} after turn it off, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.isEnableSuggestionSwitchOn())
            .toBe(false);
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getQuestionInputSection(),
            'TC91747_04_01',
            'Turn off suggestion'
        );
        await since('Question suggestion should display in chat panel, instead it does not.')
            .expect(await botAuthoring.aibotChatPanel.getRecommendations().isDisplayed())
            .toBe(false);
        await botAuthoring.saveBot({});
        await libraryPage.openDefaultApp();
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Enable suggestion after reopen the bot should be off, instead it is on.')
            .expect(await botAuthoring.generalSettings.isEnableSuggestionSwitchOn())
            .toBe(false);
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getQuestionInputSection(),
            'TC91747_04_02',
            'Reopen when suggestion is off'
        );
        await since('Question suggestion should display in chat panel, instead it does not.')
            .expect(await botAuthoring.aibotChatPanel.getRecommendations().isDisplayed())
            .toBe(false);
        await botAuthoring.generalSettings.turnOnEnableSuggestion();
        await since('Enable suggestion should be #{expected} after turn it on, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.isEnableSuggestionSwitchOn())
            .toBe(true);
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getQuestionInputSection(),
            'TC91747_04_03',
            'Turn on suggestion'
        );
        await since('Question suggestion should display in chat panel, instead it does not.')
            .expect(await botAuthoring.aibotChatPanel.getRecommendations().isDisplayed())
            .toBe(true);
        await botAuthoring.saveBot({});
    });

    it('[TC91747_05] verify auto suggestion limit setting', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Default auto suggestion limit should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getTotalAutoGenerateSuggestionLimit().getText())
            .toBe('3');
        await since('Default auto suggestion count in chat panel should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getRecommendationQuestionItems().length)
            .toBe(3);
        await botAuthoring.generalSettings.setAutoSuggestionLimit('1');
        await botAuthoring.aibotChatPanel.waitForRecommendationLoading();
        await since('Auto suggestion limit should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getTotalAutoGenerateSuggestionLimit().getText())
            .toBe('1');
        await since('Auto suggestion count in chat panel should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getRecommendationQuestionItems().length)
            .toBe(1);
        await botAuthoring.saveBot({});
    });

    it('[TC91747_06] turn off auto suggestion by set auto suggestion to 0', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.setAutoSuggestionLimit('5');
        await botAuthoring.aibotChatPanel.waitForRecommendationLoading();
        await since('Auto suggestion limit should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getTotalAutoGenerateSuggestionLimit().getText())
            .toBe('5');
        await since('Auto suggestion count in chat panel should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getRecommendationQuestionItems().length)
            .toBe(5);
        await botAuthoring.generalSettings.setAutoSuggestionLimit('0');
        await since('Auto suggestion limit should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getTotalAutoGenerateSuggestionLimit().getText())
            .toBe('0');
        await since('Auto suggestion should not show in chat panel authoring mode, instead it display')
            .expect(await botAuthoring.aibotChatPanel.getRecommendations().isDisplayed())
            .toBe(false);
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since('Auto suggestion should not show in chat panel consumption mode, instead it display')
            .expect(await aibotChatPanel.getRecommendations().isDisplayed())
            .toBe(false);
    });

    it('[TC91747_07] verify add custom suggestion', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.getAddNewCustomSuggestionButton().click();
        await since('Default custom suggestion should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getNewCustomSuggestionInputBoxByIndex(0).getValue())
            .toBe('');
        await botAuthoring.generalSettings.setCustomSuggestionByIndex(0, customSuggestionsSamples[0]);
        await since('The first custom suggestion should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getNewCustomSuggestionInputBoxByIndex(0).getValue())
            .toBe(customSuggestionsSamples[0]);
        await since('Total of custom suggestion should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getCustomSuggestions().length)
            .toBe(1);
        await botAuthoring.generalSettings.addCustomSuggestion(customSuggestionsSamples[1]);
        await since('The Second custom suggestion should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getNewCustomSuggestionInputBoxByIndex(1).getValue())
            .toBe(customSuggestionsSamples[1]);
        await since('Total of custom suggestion should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getCustomSuggestions().length)
            .toBe(2);
        await since('Add new custom suggestion button should be hidden, instead it is shown')
            .expect(await botAuthoring.generalSettings.getAddNewCustomSuggestionButton().isEnabled())
            .toBe(false);
        await botAuthoring.aibotChatPanel.waitForRecommendationLoading();
        await since('Auto suggestion count in chat panel should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getRecommendationQuestionItems().length)
            .toBe(5);
        await botAuthoring.saveBot({});
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await since('Total of custom suggestion should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getCustomSuggestions().length)
            .toBe(2);
        await since('Add new custom suggestion button should be hidden, instead it is shown')
            .expect(await botAuthoring.generalSettings.getAddNewCustomSuggestionButton().isEnabled())
            .toBe(false);
        await botAuthoring.aibotChatPanel.waitForRecommendationLoading();
        await since('Auto suggestion count in chat panel should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getRecommendationQuestionItems().length)
            .toBe(5);
    });

    it('[TC91747_08] verify delete custom suggestion', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.addCustomSuggestion(customSuggestionsSamples[2]);
        await botAuthoring.generalSettings.addCustomSuggestion(customSuggestionsSamples[3]);
        await since('Total of custom suggestion should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getCustomSuggestions().length)
            .toBe(2);
        await botAuthoring.aibotChatPanel.waitForRecommendationLoading();
        await since('Auto suggestion count in chat panel should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getRecommendationQuestionItems().length)
            .toBe(5);
        await botAuthoring.generalSettings.deleteCustomSuggestionByIndex(1);
        await since('Total of custom suggestion should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getCustomSuggestions().length)
            .toBe(1);
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getQuestionInputSection(),
            'TC91747_08_01',
            'Delete one of the custom suggestion and left one'
        );
        await botAuthoring.aibotChatPanel.waitForRecommendationLoading();
        await since('Auto suggestion count in chat panel should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getRecommendationQuestionItems().length)
            .toBe(4);
        await botAuthoring.generalSettings.deleteCustomSuggestionByIndex(0);
        await since('Total of custom suggestion should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getCustomSuggestions().length)
            .toBe(0);
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getQuestionInputSection(),
            'TC91747_08_02',
            'Delete all custom suggestion'
        );
        await botAuthoring.aibotChatPanel.waitForRecommendationLoading();
        await since('Auto suggestion count in chat panel should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getRecommendationQuestionItems().length)
            .toBe(3);
    });

    it('[TC91747_09] total suggestion is 5 thus auto suggestion limit is restrict', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.addCustomSuggestion(customSuggestionsSamples[2]);
        await botAuthoring.generalSettings.addCustomSuggestion(customSuggestionsSamples[3]);
        await since('Add new custom suggestion button should be disabled, instead it is enabled')
            .expect(await botAuthoring.generalSettings.getAddNewCustomSuggestionButton().isEnabled())
            .toBe(false);
        await botAuthoring.generalSettings.openAutoSuggestionLimitSelectionDropdown();
        await since('Add new custom suggestion button should be enabled, instead it is disabled')
            .expect(await botAuthoring.generalSettings.isAutoSuggestionLimitOptionEnabled('3'))
            .toBe(true);
        await since('Add new custom suggestion button should be disabled, instead it is enabled')
            .expect(await botAuthoring.generalSettings.isAutoSuggestionLimitOptionEnabled('4'))
            .toBe(false);
        await since('Add new custom suggestion button should be disabled, instead it is enabled')
            .expect(await botAuthoring.generalSettings.isAutoSuggestionLimitOptionEnabled('5'))
            .toBe(false);
        await since('Option 3 should be selected, instead it is not selected')
            .expect(await botAuthoring.generalSettings.isAutoSuggestionLimitOptionSelected('3'))
            .toBe(true);
        await botAuthoring.generalSettings.click({ elem: botAuthoring.generalSettings.getPopupItemByText('3') });
        await botAuthoring.generalSettings.deleteCustomSuggestionByIndex(1);
        await botAuthoring.generalSettings.deleteCustomSuggestionByIndex(0);
        await botAuthoring.generalSettings.openAutoSuggestionLimitSelectionDropdown();
        await since('Add new custom suggestion button should be enabled, instead it is disabled')
            .expect(await botAuthoring.generalSettings.isAutoSuggestionLimitOptionEnabled('4'))
            .toBe(true);
        await since('Add new custom suggestion button should be enabled, instead it is disabled')
            .expect(await botAuthoring.generalSettings.isAutoSuggestionLimitOptionEnabled('5'))
            .toBe(true);
        await botAuthoring.generalSettings.click({ elem: botAuthoring.generalSettings.getPopupItemByText('4') });
        await botAuthoring.saveBot({});
    });

    it('[TC91747_10] total suggestion is 5 thus add custom suggestion is restrict', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.addCustomSuggestion(customSuggestionsSamples[2]);
        await botAuthoring.generalSettings.addCustomSuggestion(customSuggestionsSamples[3]);
        await since('Add new custom suggestion button should be disabled, instead it is enabled')
            .expect(await botAuthoring.generalSettings.getAddNewCustomSuggestionButton().isEnabled())
            .toBe(false);
        await botAuthoring.generalSettings.setAutoSuggestionLimit('1');
        await since('Add new custom suggestion button should be enabled, instead it is disabled')
            .expect(await botAuthoring.generalSettings.getAddNewCustomSuggestionButton().isEnabled())
            .toBe(true);
        await botAuthoring.saveBot({});
    });

    //TC91748: [Chatbot] [General Settings] Verify Bot limits question settings in general tab
    it('[TC91748_01] verify question limit setting', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Default question limit should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getQuestionLimitInputBox().getValue())
            .toBe('');
        await since('Default question limit should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getQuestionLimitInputBox().getAttribute('placeholder'))
            .toBe('No limit');
        await botAuthoring.generalSettings.setQuestionLimit(1000);
        await since('Question limit should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getQuestionLimitInputBox().getValue())
            .toBe('1000');
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Question limit should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getQuestionLimitInputBox().getValue())
            .toBe('1000');
    });

    it('[TC91748_02] no restriction in authoring', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Default question limit should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getQuestionLimitInputBox().getValue())
            .toBe('');
        await since('Default question limit should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getQuestionLimitInputBox().getAttribute('placeholder'))
            .toBe('No limit');
        await botAuthoring.generalSettings.setQuestionLimit(1);
        await since('Question limit should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getQuestionLimitInputBox().getValue())
            .toBe('1');
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.aibotChatPanel.askQuestion(customSuggestionsSamples[0]);
        await botAuthoring.aibotChatPanel.askQuestion(customSuggestionsSamples[1]);
        await botAuthoring.aibotChatPanel.getInputBox().setValue(customSuggestionsSamples[2]);
        await since('isEnabled() of send message icon should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getSendIcon().isEnabled())
            .toBe(true);
        await since('Question in input box should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getInputBox().getText())
            .toBe(customSuggestionsSamples[2]);
    });

    it('[TC91748_03] hit question limit in consumption mode', async () => {
        const hitLimitMessage =
            'You have asked the maximum of questions for this month cycle. The new cycle will start on';
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Default question limit should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getQuestionLimitInputBox().getValue())
            .toBe('');
        await since('Default question limit should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getQuestionLimitInputBox().getAttribute('placeholder'))
            .toBe('No limit');
        await botAuthoring.generalSettings.setQuestionLimit(1);
        await since('Question limit should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getQuestionLimitInputBox().getValue())
            .toBe('1');
        await botAuthoring.saveBot({});
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getInputBox());
        await since('Chat bot hit question limit message is expected to be #{expected}, instead we have #{actual}.')
            .expect(await aibotChatPanel.getHintText())
            .toBe(`Ask me a question. (0/1 question asked)`);
        await aibotChatPanel.askQuestion(customSuggestionsSamples[0]);
        await since('isEnabled() of send message icon should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getSendIcon().isEnabled())
            .toBe(false);
        const actualMessage = await aibotChatPanel.getHintText();
        await since(`Chat bot input hint text is expected to include message ${hitLimitMessage}, instead it does not`)
            .expect(actualMessage.includes(hitLimitMessage))
            .toBe(true);
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.setQuestionLimit(2);
        await botAuthoring.saveBot({});
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await since('Chat bot hit question limit message is expected to be #{expected}, instead we have #{actual}.')
            .expect(await aibotChatPanel.getHintText())
            .toBe(`Ask me a question. (1/2 questions asked)`);
        await aibotChatPanel.getInputBox().setValue(customSuggestionsSamples[2]);
        await since('isEnabled() of send message icon should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getSendIcon().isEnabled())
            .toBe(true);
    });

    it('[TC91748_04] maximum value of question limit is 999999', async () => {
        const bigValue = 123456789;
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.setQuestionLimit(bigValue);
        await since('Question limit should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getQuestionLimitInputBox().getValue())
            .toBe(botSettings.maxQuestionLimit);
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await since('Question limit should be #{expected} after reopen, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getQuestionLimitInputBox().getValue())
            .toBe(botSettings.maxQuestionLimit);
    });
});
