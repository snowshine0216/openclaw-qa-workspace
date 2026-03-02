import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { captureRequestPayload } from '../../../api/browserDevTools/network.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import createBotByAPIV2 from '../../../api/bot2/createBotAPIV2.js';
import deleteBotList from '../../../api/bot/deleteBot.js';
import { autoChatInfo } from '../../../constants/bot2.js';
import { clearBotV2HistoryByAPI } from '../../../api/bot2/chatAPI.js';

describe('Bot 2.0 General Settings', () => {
    const { loginPage, libraryPage, aibotChatPanel, botAuthoring, aibotSnapshotsPanel } = browsers.pageObj1;
    const generalSettings = botAuthoring.generalSettings;

    let botId, botName;

    const { projectId, folderId, adcId, userId } = autoChatInfo;

    const adminCredentials = {
        username: 'admin',
        password: '',
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(autoChatInfo);
        await libraryPage.waitForLibraryLoading();
        botName = 'AutoBot_' + Math.random().toString().slice(2, 10);
        try {
            botId = await createBotByAPIV2({
                credentials: adminCredentials,
                aiDatasetCollections: [adcId],
                projectId,
                folderId,
                botName,
                publishedToUsers: [userId],
            });
        } catch (e) {
            console.error(e);
        }
    });

    beforeEach(async () => {
        await libraryPage.editBotByUrl({ projectId, botId });
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
    });

    afterEach(async () => {
        //clear history
        await clearBotV2HistoryByAPI({
            botId: botId,
            projectId: projectId,
            credentials: { username: autoChatInfo.username, password: autoChatInfo.password },
        });
    });

    afterAll(async () => {
        await deleteBotList({
            credentials: adminCredentials,
            botList: [botId],
        });
        await logoutFromCurrentBrowser();
    });

    it('[TC99003_1] test cover image/name/greeting modification', async () => {
        await generalSettings.selectCoverImage(1);
        const originalBotName = await generalSettings.getBotNameInput().getValue();
        const originalBotGreeting = await generalSettings.getGreetingInputBox().getValue();
        await generalSettings.changeBotName(`${originalBotName}+`);
        await generalSettings.changeGreeting(`${originalBotGreeting}+`);

        // ui assertion
        await since('Cover image should be updated')
            .expect(await generalSettings.getCoverImageSrc())
            .toContain('IT-Tech-Dev');
        await since('Bot name should be updated')
            .expect(await aibotChatPanel.getTitleBarBotName().getText())
            .toBe(`${originalBotName}+`);
        await since('Bot greeting should be updated')
            .expect(await aibotChatPanel.getWelcomePageMessage().getText())
            .toBe(`${originalBotGreeting}+`);

        // payload assertion
        const payloadPromise = captureRequestPayload('api/v2/bots', { method: 'PATCH' });
        await generalSettings.saveConfig();
        const payload = await payloadPromise;
        const coverImageChanged = payload.operationList.some((operation) => {
            return operation.value.includes('IT-Tech-Dev');
        });
        await since('Cover image should be changed').expect(coverImageChanged).toBe(true);
        const botNameChanged = payload.operationList.some((operation) => {
            return operation.value.includes(`${originalBotName}+`);
        });
        await since('Bot name should be changed').expect(botNameChanged).toBe(true);
        const botGreetingChanged = payload.operationList.some((operation) => {
            return operation.value.includes(`${originalBotGreeting}+`);
        });
        await since('Bot greeting should be changed').expect(botGreetingChanged).toBe(true);

        // reset
        await generalSettings.selectCoverImage(0);
        await generalSettings.changeBotName(originalBotName);
        await generalSettings.changeGreeting(originalBotGreeting);
        await generalSettings.saveConfig();
    });

    it('[TC99003_2] test panel theme', async () => {
        let bgColor = await browser.execute(() => {
            return window
                .getComputedStyle(document.documentElement)
                .getPropertyValue('--mstr-chatbot-theme-panel-bg')
                .trim();
        });
        await since('Panel theme should be default').expect(bgColor).toBe('#FFFFFF');
        await generalSettings.changePanelTheme();
        bgColor = await browser.execute(() => {
            return window
                .getComputedStyle(document.documentElement)
                .getPropertyValue('--mstr-chatbot-theme-panel-bg')
                .trim();
        });
        await since('Panel theme should be dark').expect(bgColor).toBe('#23262A');

        const payloadPromise = captureRequestPayload('api/v2/bots', { method: 'PATCH' });
        await generalSettings.saveConfig();
        const payload = await payloadPromise;
        await since('Panel theme should be saved').expect(payload.operationList[0].value.selectedTheme).toBe('dark');

        // reset
        await generalSettings.resetPanelTheme();
        await generalSettings.saveConfig();
        bgColor = await browser.execute(() => {
            return window
                .getComputedStyle(document.documentElement)
                .getPropertyValue('--mstr-chatbot-theme-panel-bg')
                .trim();
        });
        await since('Panel theme should be reset').expect(bgColor).toBe('#FFFFFF');
    });

    it('[TC99003_3] test visualization palette', async () => {
        await aibotChatPanel.askQuestion('show top 5 airline with most flights delayed in bar chart', true);
        // we only care about color here, so we set tolerance to 5
        await takeScreenshotByElement(
            await aibotChatPanel.getVizBubble(),
            'visualization palette',
            'viz in light theme',
            {
                tolerance: 5,
            }
        );
        await generalSettings.changeVizPalette();
        const payloadPromise = captureRequestPayload('api/v2/bots', { method: 'PATCH' });
        await generalSettings.saveConfig();
        const payload = await payloadPromise;
        await since('viz palette id should be correct')
            .expect(payload.operationList[0].value)
            .toBe('F9B26D484659B3AA8D489F99A2B2DF1E');
        // we only care about color here, so we set tolerance to 5
        await takeScreenshotByElement(
            await aibotChatPanel.getVizBubble(),
            'visualization palette',
            'viz in dark theme',
            {
                tolerance: 5,
            }
        );

        await generalSettings.resetVizPalette();
        await generalSettings.saveConfig();
    });

    it('[TC99003_4] test snapshot', async () => {
        await generalSettings.turnOffSnapshot();
        await since('Snapshot button should be hidden')
            .expect(await aibotChatPanel.getOpenSnapshotPanelButton().isDisplayed())
            .toBe(false);

        const payloadPromise = captureRequestPayload('api/v2/bots', { method: 'PATCH' });
        await generalSettings.saveConfig();
        const payload = await payloadPromise;
        await since('Operation path should be correct')
            .expect(payload.operationList[0].path)
            .toBe('/config/general/features/enableSavingToSnapshots');
        await since('Snapshot should be turned off').expect(payload.operationList[0].value).toBe(false);

        await generalSettings.turnOnSnapshot();
        await generalSettings.saveConfig();
    });

    it('[TC99003_5] test interpretation', async () => {
        await aibotChatPanel.askQuestionNoWaitViz('show top 5 airline with most flights delayed in bar chart');
        await aibotChatPanel.hoverOnLatestAnswer();
        await since('Interpretation should be displayed')
            .expect(await aibotChatPanel.getInterpretationIcon().isDisplayed())
            .toBe(true);
        await generalSettings.turnOffInterpretation();
        await aibotChatPanel.hoverOnLatestAnswer();
        await since('Interpretation should be hidden')
            .expect(await aibotChatPanel.getInterpretationIcon().isDisplayed())
            .toBe(false);

        const payloadPromise = captureRequestPayload('api/v2/bots', { method: 'PATCH' });
        await generalSettings.saveConfig();
        const payload = await payloadPromise;
        await since('Operation path should be correct')
            .expect(payload.operationList[0].path)
            .toBe('/config/general/features/enableQuestionInterpretation');
        await since('Interpretaion should be turned off').expect(payload.operationList[0].value).toBe(false);

        await generalSettings.turnOnInterpretation();
        await generalSettings.saveConfig();
    });

    it('[TC99003_6] test question hint', async () => {
        const originalHint = await generalSettings.getQuestionHint().getValue();
        await since('Question hint should be default')
            .expect(await aibotChatPanel.getInputBox().getAttribute('placeholder'))
            .toBe(originalHint);
        await generalSettings.changeQuestionHint(`${originalHint} please`);
        await since('Question hint should be updated')
            .expect(await aibotChatPanel.getInputBox().getAttribute('placeholder'))
            .toBe(`${originalHint} please`);

        const payloadPromise = captureRequestPayload('api/v2/bots', { method: 'PATCH' });
        await generalSettings.saveConfig();
        const payload = await payloadPromise;
        await since('Question hint should be correct')
            .expect(payload.operationList[0].value)
            .toBe(`${originalHint} please`);

        await generalSettings.changeQuestionHint(originalHint);
        await generalSettings.saveConfig();
    });

    it('[TC99003_7] test suggestion switch', async () => {
        await generalSettings.turnOffSuggestions();
        await since('Suggestions should be turned off')
            .expect(await aibotChatPanel.getRecommendations().isDisplayed())
            .toBe(false);

        const payloadPromise = captureRequestPayload('api/v2/bots', { method: 'PATCH' });
        await generalSettings.saveConfig();
        const payload = await payloadPromise;
        await since('Operation path should be correct')
            .expect(payload.operationList[0].path)
            .toBe('/config/general/questionInput/enableQuestionSuggestions');
        await since('Suggestions should be turned off').expect(payload.operationList[0].value).toBe(false);

        await generalSettings.turnOnSuggestions();
        await generalSettings.saveConfig();
    });

    it('[TC99003_8] test insights switch', async () => {
        await aibotChatPanel.askQuestionNoWaitViz('show top 5 airline with most flights delayed in bar chart');
        await since('Insights section should be displayed')
            .expect(await aibotChatPanel.isInsightsSectionDisplayed())
            .toBe(true);

        await generalSettings.turnOffInsights();
        await since('Insights section should be hidden')
            .expect(await aibotChatPanel.isInsightsSectionDisplayed())
            .toBe(false);

        const payloadPromise = captureRequestPayload('api/v2/bots', { method: 'PATCH', timeout: 10000 });
        await generalSettings.saveConfig();
        const payload = await payloadPromise;
        await since('Operation path should be correct')
            .expect(payload.operationList[0].path)
            .toBe('/config/general/features/enableAnswerInsights');
        await since('Insights should be turned off').expect(payload.operationList[0].value).toBe(false);

        await generalSettings.turnOnInsights();
        await generalSettings.saveConfig();
    });

    it('[TC99003_9] test custom suggestions', async () => {
        await since('Add custom suggestions should be enabled')
            .expect(await generalSettings.getAddNewCustomSuggestionButton().isEnabled())
            .toBe(true);
        await generalSettings.changeSuggestionNumber(5);
        await since('Add custom suggestions should be disabled')
            .expect(await generalSettings.getAddNewCustomSuggestionButton().isEnabled())
            .toBe(false);
        await generalSettings.changeSuggestionNumber(3);
        const customSuggestion = 'test custom suggestion';
        await generalSettings.addCustomSuggestion(customSuggestion);
        await since('Custom suggestion should be added')
            .expect(await aibotChatPanel.isCustomSuggestionDisplayed(customSuggestion))
            .toBe(true);

        const payloadPromise = captureRequestPayload('api/v2/bots', { method: 'PATCH' });
        await generalSettings.saveConfig();
        const payload = await payloadPromise;
        await since('Custom suggestion should be present')
            .expect(payload.operationList[0].value)
            .toContain(customSuggestion);

        await generalSettings.deleteCustomSuggestionByIndex();
        await generalSettings.saveConfig();
    });

    it('[TC99003_10] test external links', async () => {
        const links = Array.from({ length: 3 }, (_, i) => ({
            iconIndex: i,
            title: `test link ${i + 1}`,
            url: 'https://www.google.com',
        }));
        for (const link of links) {
            await generalSettings.addExternalLink(link);
        }
        await since('Add link button should be hidden')
            .expect(await generalSettings.getAddLinkButton().isDisplayed())
            .toBe(false);
        await since('Link count should be #{expected} in title bar, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarExternalLinkCount())
            .toBe(3);
        await since('Text only is external link default style, the first link title should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarExternalLinkTextByIndex(0))
            .toBe(links[0].title);
        await since('Text only is external link default style, the first link icon displayed should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarExternalLinkIconByIndex(0).isDisplayed())
            .toBe(false);
        // change to icon only
        await generalSettings.selectLinkDisplayFormat('Icon only');
        await since('Icon only is selected, the first link icon displayed should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarExternalLinkIconByIndex(0).isDisplayed())
            .toBe(true);
        await since('Icon only is selected, the first link icon displayed should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarExternalLinkTextFieldByIndex(0).isDisplayed())
            .toBe(false);
        // change to icon + text
        await generalSettings.selectLinkDisplayFormat('Icon + text');
        await since('Icon + text is selected, the first link icon displayed should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarExternalLinkIconByIndex(0).isDisplayed())
            .toBe(true);
        await since('Icon + text is selected, the first link text field displayed should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarExternalLinkTextFieldByIndex(0).isDisplayed())
            .toBe(true);

        let payloadPromise = captureRequestPayload('api/v2/bots', { method: 'PATCH' });
        await generalSettings.saveConfig();
        let payload = await payloadPromise;
        // 4 operations: add link * 3 + replace link format
        await since('Link count should be 4, instead we have #{actual}').expect(payload.operationList.length).toBe(4);
        for (const [index, link] of links.entries()) {
            await since(`Link ${index + 1} should be #{expected} but is #{actual}`)
                .expect(payload.operationList[index].value.name)
                .toBe(link.title);
        }

        await generalSettings.setExternalLinkByIndex({
            iconIndex: 0,
            title: 'test link 1 updated',
            url: 'https://www.google.com',
        });
        await since('Modified Link 1, the first link title should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarExternalLinkTextByIndex(0))
            .toBe('test link 1 updated');

        payloadPromise = captureRequestPayload('api/v2/bots', { method: 'PATCH' });
        await generalSettings.saveConfig();
        payload = await payloadPromise;
        await since('Operation should be replace').expect(payload.operationList[0].op).toBe('replace');
        await since('Link 1 should be updated').expect(payload.operationList[0].value.name).toBe('test link 1 updated');

        // delete all links    
        for (let i = 0; i < links.length; i++) {
            await generalSettings.deleteExternalLinkByIndex();
        }
        payloadPromise = captureRequestPayload('api/v2/bots', { method: 'PATCH' });
        await generalSettings.saveConfig();
        payload = await payloadPromise;
        await since('Op count should be 3').expect(payload.operationList.length).toBe(3);
        await since('Operation should be remove').expect(payload.operationList[0].op).toBe('remove');
    });

    it('[TC99003_11] test active switch', async () => {
        await generalSettings.deactiveBot();

        const payloadPromise = captureRequestPayload('api/v2/bots', { method: 'PATCH' });
        await generalSettings.saveConfig();
        const payload = await payloadPromise;
        await since('Op path should be correct').expect(payload.operationList[0].path).toBe('/config/general/active');
        await since('Bot should be deactivated').expect(payload.operationList[0].value).toBe(false);

        await since('Inactive banner should displayed')
            .expect(await botAuthoring.getInActiveBanner().isDisplayed())
            .toBe(true);
        await generalSettings.activeBot();
        await generalSettings.saveConfig();
    });

    it('[TC99003_12] test auto complete', async () => {
        // on by default
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('air');
        await since('AutoCompleteArea display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);

        // turn off auto complete
        await aibotChatPanel.clearInputbox();
        await generalSettings.turnOffAutoComplete();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('air');
        await since('OFF and AutoCompleteArea display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);

        const payloadPromise = captureRequestPayload('api/v2/bots', { method: 'PATCH', timeout: 10000 });
        await generalSettings.saveConfig();
        const payload = await payloadPromise;
        await since('Operation path should be correct')
            .expect(payload.operationList[0].path)
            .toBe('/config/general/features/enableAutoComplete');
        await since('AutoComplete should be turned on').expect(payload.operationList[0].value).toBe(false);

        await generalSettings.turnOffAutoComplete();
        await generalSettings.saveConfig();
    });

    it('[TC99003_13] test enable research setting', async () => {
        const question = 'what is the number of flights by year';
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Deep research button present by default is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isResearchDisplayed())
            .toBe(true);

        // turn off deep research when research is disabled
        await generalSettings.turnOffResearch();
        const payloadPromise = captureRequestPayload('api/v2/bots', { method: 'PATCH', timeout: 10000 });
        await generalSettings.saveConfig();
        const payload = await payloadPromise;
        await since('Operation path should be correct')
            .expect(payload.operationList[0].path)
            .toBe('/config/general/features/enableResearch');
        await since('Insights should be turned off').expect(payload.operationList[0].value).toBe(false);
        await since('turn off and research button present is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isResearchDisplayed())
            .toBe(false);

        // turn off research when research is enabled
        await generalSettings.turnOnResearch();
        await since('Turn on research and button present is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isResearchDisplayed())
            .toBe(true);
        await aibotChatPanel.enableResearch();
        await generalSettings.turnOffResearch();
        await generalSettings.saveConfig();
        await since('enable but turn off, button present is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isResearchDisplayed())
            .toBe(false);
        // Q&A
        await aibotChatPanel.askQuestion(question, true);
        await since('Turn off research and Report section should be displayed')
            .expect(await aibotChatPanel.getReportSection().isDisplayed())
            .toBe(false);
    });

    it('[TC99003_14] test disable export setting', async () => {
        await since('Export button Enabled by default is expected to be #{expected}, instead we have #{actual}')
            .expect(await generalSettings.isExportSwitchOn())
            .toBe(true);
        await since('Export full data button Enabled by default is expected to be #{expected}, instead we have #{actual}')
            .expect(await generalSettings.isExportFullDataSwitchOn())
            .toBe(true);
        await generalSettings.turnOffExport();
        const payloadPromise = captureRequestPayload('api/v2/bots', { method: 'PATCH', timeout: 10000 });
        await generalSettings.saveConfig();
        const payload = await payloadPromise;
        await since('Operation path enable full data export should be correct')
            .expect(payload.operationList[0].path)
            .toBe('/config/general/features/enableFullDataExport');
        await since('Export full data should be turned off').expect(payload.operationList[0].value).toBe(false);
        await since('Operation path enable export should be correct')
            .expect(payload.operationList[1].path)
            .toBe('/config/general/features/enableExport');
        await since('Export should be turned off').expect(payload.operationList[1].value).toBe(false);
        await since('Export button should be disabled is expected to be #{expected}, instead we have #{actual}')
            .expect(await generalSettings.isExportSwitchOn())
            .toBe(false);
        await since('Export full data button should be disabled is expected to be #{expected}, instead we have #{actual}')
            .expect(await generalSettings.isExportFullDataSwitchOn())
            .toBe(false);

        await aibotChatPanel.askQuestionNoWaitViz('show top 5 airline with most flights delayed in bar chart');
        await aibotChatPanel.hoverOnLatestAnswer();
        await since('Export Disabled, Export CSV Button displayed is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isExportToCsvIconDisplayedByLatestAnswer())
            .toBe(false);
        await since('Export Disabled, Export Excel Button displayed is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isExportToExcelIconDisplayedByLatestAnswer())
            .toBe(false);
        // add snapshot and check snapshot export button disabled
        await aibotChatPanel.hoverNthChatAnswerFromEndtoAddSnapshot(1);
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        await aibotSnapshotsPanel.waitForSnapshotCardLoaded(0);
        const snapshotCard = aibotSnapshotsPanel.getSnapshotCardByIndex(0);
        await since('Export Disabled, Snapshot export CSV button displayed is expected to be #{expected}, instead we have #{actual}')
            .expect(await snapshotCard.getExportCSVButton().isDisplayed())
            .toBe(false);
        await since('Export Disabled, Snapshot export Excel button displayed is expected to be #{expected}, instead we have #{actual}')
            .expect(await snapshotCard.getExportExcelButton().isDisplayed())
            .toBe(false);   

        await generalSettings.turnOnExport();
        await since('enable export, export switch enabled is expected to be #{expected}, instead we have #{actual}')
            .expect(await generalSettings.isExportSwitchOn())
            .toBe(true);
        await since('enable export, export full data switch enabled is expected to be #{expected}, instead we have #{actual}')
            .expect(await generalSettings.isExportFullDataSwitchOn())
            .toBe(true);
        await generalSettings.saveConfig(); 
        await aibotChatPanel.hoverOnLatestAnswer();
        await since('Export Enabled, Export CSV Button displayed is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isExportToCsvIconDisplayedByLatestAnswer())
            .toBe(true);
        await since('Export Enabled, Export Excel Button displayed is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isExportToExcelIconDisplayedByLatestAnswer())
            .toBe(true);
        // check snapshot export button enabled
        await since('Export Enabled, Snapshot export CSV button displayed is expected to be #{expected}, instead we have #{actual}')
            .expect(await snapshotCard.getExportCSVButton().isDisplayed())
            .toBe(true);
        await since('Export Enabled, Snapshot export Excel button displayed is expected to be #{expected}, instead we have #{actual}')
            .expect(await snapshotCard.getExportExcelButton().isDisplayed())
            .toBe(true);  
    });

    it('[TC99003_15] test enable sqler template setting', async () => {
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Sqler template OFF, rules panel displayed should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.getConfigTabByName('Rule').isDisplayed())
            .toBe(false);
        await generalSettings.turnOnSqlTemplate();
        await since('Sqler template ON, rules panel displayed should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.getConfigTabByName('Rule').isDisplayed())
            .toBe(true);
        const payloadPromise = captureRequestPayload('api/v2/bots', { method: 'PATCH', timeout: 10000 });
        await generalSettings.saveConfig();
        const payload = await payloadPromise;
        await since('Operation path should be correct')
            .expect(payload.operationList[0].path)
            .toBe('/config/general/features/enableSqlTemplate');
        await since('Sqler template should be turned on').expect(payload.operationList[0].value).toBe(true);
        
        await generalSettings.turnOffSqlTemplate();
        await generalSettings.saveConfig();
    });
});
