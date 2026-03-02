//npm run regression -- --baseUrl=https://SaaS-STG.trial.cloud.microstrategy.com/MicroStrategyLibrary/ --params.credentials.username=tester_auto --params.credentials.webServerUsername= --params.credentials.webServerPassword= --params.credentials.isPredefined=true  --tcList=TC93410_01
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';

describe('Run Bot on SaaS', () => {
    let { libraryPage, loginPage, aibotChatPanel, pendoGuide, aibotSnapshotsPanel } = browsers.pageObj1;
    const saasProjectId = '69D4DA35264BAA98CC2BF68356064C35';
    const companyBot = {
        id: 'BF481DF5BF43E5524AAE44BE1FE606B7',
        name: 'Top Companies Bot',
    };
    const retailBot = {
        id: 'A81721DEC24012C1C40522B8A8EC36DE',
        name: 'Retail Analysis Bot',
    };
    let credentials = browsers.params.credentials;

    beforeAll(async () => {
        if (browsers.params.credentials.isPredefined && browsers.params.credentials.isPredefined === 'true') {
            credentials = {
                username: 'saastest.bot@microstrategy.com',
                id: '32BB63B9FF48E38B1531C2AD92057AD2',
                // username: 'wxyy_giizz50@euriv.com',
                // id: '937DE1D5C247A7F3804D03BDDEACECCB',
                password: 'newman1#',
            };
        }
        console.log(credentials);
        await loginPage.saasLogin(credentials);
        await loginPage.waitForLibraryLoading();
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await pendoGuide.goToLibrary();
        await libraryPage.executeScript('window.pendo.stopGuides();');
        await libraryPage.waitForLibraryLoading();
    });

    it('[TC93410_01] run bot on SaaS', async () => {
        const quotaRequest = await browser.mock('**/quota');
        await libraryPage.openBotById({ projectId: saasProjectId, botId: companyBot.id });
        let quotaRequestBody = quotaRequest.calls[0].body;
        let remainingQuota = quotaRequestBody.questionQuota.remaining;
        console.log(`Remaining Quota: ${remainingQuota}`);
        const getChatBotInputHint = () => `Ask me Company-related questions. (Questions remaining: ${remainingQuota})`;

        await libraryPage.executeScript('window.pendo.stopGuides();');

        //Check welcome page component
        await clearHistoryAndSnapshot(aibotChatPanel, aibotSnapshotsPanel);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        await since('#1 Chat bot title bar bot logo display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isTitleBarBotLogoDisplayed())
            .toBe(true);
        await since('#1 Chat bot title bar bot name text is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarBotNameTexts())
            .toBe(companyBot.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotIcon());
        await since('#1 Welcome page bot image display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isWelcomePageBotImageDisplayed())
            .toBe(true);
        await since('#1 Welcome page message display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isWelcomePageMessageDisplayed())
            .toBe(true);
        await since('#1 Welcome page separator display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isWelcomePageSeparatorDisplayed())
            .toBe(true);
        await since('#1 Topic title display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isChatPanelTopicsTitleDisplayed())
            .toBe(true);
        await since('#1 The topic item is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getChatPanelTopicItemCount())
            .toBe(3);
        await since('#1 Chat bot input hint text is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getHintText())
            .toBe(getChatBotInputHint());
        await since('#1 Input area - topic icon display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isTopicsIconDisplayed())
            .toBe(true);
        await since('#1 Empty Snapshot Panel display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotSnapshotsPanel.isEmptySnapshotPanelDisplayed())
            .toBe(true);

        //Ask freeform question
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('show me a grid for the top 1 ');
        await aibotChatPanel.askQuestionByAutoComplete('Compa', 0);
        await aibotChatPanel.typeKeyboard(' with related information');
        await aibotChatPanel.clickSendBtn();
        await since('#2 Question generating, topic display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isDisabledTopicsIconDisplayed())
            .toBe(true);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getBubbleLoadingIcon());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getMarkDownByIndex(0));
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getVIVizPanel(0), {
            timeout: 60 * 1000,
            msg: 'fail to load getVIVizPanel',
        });
        await since('#2 The answer is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getMarkDownByIndex(0).isDisplayed())
            .toBe(true);
        await since('#2 The viz answer is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getVIVizPanel(0).isDisplayed())
            .toBe(true);
        await since('#2 Grid chart is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isChatBotVizDisplayed('Grid'))
            .toBe(true);

        //Click on one of the Recommended Question
        await aibotChatPanel.clickExpandRecommendation();
        await aibotChatPanel.waitForRecommendationLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getBubbleLoadingIcon());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getMarkDownByIndex(1), {
            timeout: 60 * 1000,
        });
        await since('#3 The answer is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getMarkDownByIndex(1).isDisplayed())
            .toBe(true);
        remainingQuota -= 2;
        console.log(`After question, Remaining Quota: ${remainingQuota}`);
        await since('#3 Chat bot input hint text is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getHintText())
            .toBe(getChatBotInputHint());

        //Add 2 answer to snapshot
        await aibotChatPanel.takeSnapshot(1);
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getSnapshotsLoadingIcon());
        await aibotChatPanel.scrollChatPanelToTop();
        await aibotChatPanel.takeSnapshot(0);
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getSnapshotsLoadingIcon());
        await aibotChatPanel.openSnapshot();
        await aibotSnapshotsPanel.waitForSnapshotCardLoaded(0);
        await since('#4 Number of snapshots in chat bot is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.numberOfSnapshotsInChatbot())
            .toEqual(2);

        //Reopen Bot
        await pendoGuide.goToLibrary();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.executeScript('window.pendo.stopGuides();');
        await libraryPage.openBotById({ projectId: saasProjectId, botId: companyBot.id });
        await libraryPage.executeScript('window.pendo.stopGuides();');
        await aibotChatPanel.scrollChatPanelToTop();
        await aibotChatPanel.openSnapshot();
        await aibotSnapshotsPanel.waitForSnapshotCardLoaded(0);
        let queryCount = await aibotChatPanel.getQueryCount();
        await since('#5 The question count is expected to be #{expected}, instead we have #{actual}}')
            .expect(queryCount)
            .toBe(2);
        await since('#5 The answer is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getChatAnswerNumber())
            .toBe(2);
        await since('#5 Chat bot input hint text is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getHintText())
            .toBe(getChatBotInputHint());
        await since('#5 Number of snapshots in chat bot is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.numberOfSnapshotsInChatbot())
            .toEqual(2);

        //Click on topic suggestion
        await aibotChatPanel.clickTopicsBtn();
        await since('#6 Topic title display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getChatPanelTopics().isDisplayed())
            .toBe(true);
        await since(
            '#6 When topic panel opened, disabled topic icon is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.isDisabledTopicsIconDisplayed())
            .toBe(true);
        await aibotChatPanel.clickChatPanelTopicByIndex(1);
        await aibotChatPanel.waitForTopicAnswerLoading();
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getBubbleLoadingIcon());
        let msgCount = await aibotChatPanel.getChatAnswerNumber();
        let topicCount = await aibotChatPanel.getChatPanelTopicsCount();
        let answerCount = msgCount - topicCount;
        await since('#6 The answer is expected to be greater than #{expected}, instead we have #{actual}}')
            .expect(answerCount)
            .toBeGreaterThan(2);
        //DE312244: [Topic] Topic question is counted in the Bot question limit on 24.12.
        remainingQuota -= 1;
        console.log(`After topic, Remaining Quota: ${remainingQuota}`);
        await since('#6 Chat bot input hint text is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getHintText())
            .toBe(getChatBotInputHint());

        //Clear snapshots
        await aibotSnapshotsPanel.clickClearSnapshots();
        await aibotSnapshotsPanel.clickConfirmClearSnapshotsButton();
        await since('#7 Empty Snapshot Panel display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotSnapshotsPanel.isEmptySnapshotPanelDisplayed())
            .toBe(true);

        //Clear History
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotIcon());
        await since('#8 Welcome page bot image display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isWelcomePageBotImageDisplayed())
            .toBe(true);
        await since('#8 Topic title display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isChatPanelTopicsTitleDisplayed())
            .toBe(true);
    });

    it('[TC95951_01] Ask viz question _ bar _ on SaaS Bot', async () => {
        await libraryPage.openBotById({ projectId: saasProjectId, botId: companyBot.id });
        await libraryPage.executeScript('window.pendo.stopGuides();');
        await clearHistoryAndSnapshot(aibotChatPanel, aibotSnapshotsPanel);

        //Ask question by auto complete - "show me a bar chart for {attributeName} and {metricName}"
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Show me a bar chart for the top 3 ');
        await aibotChatPanel.askQuestionByAutoComplete('Compa', 0);
        await aibotChatPanel.typeKeyboard(' and their average salary');
        await aibotChatPanel.clickSendBtn();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getBubbleLoadingIcon());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getMarkDownByIndex(0));
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getVIVizPanel(0), {
            timeout: 60 * 1000,
        });
        await since('The answer is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getMarkDownByIndex(0).isDisplayed())
            .toBe(true);
        await since('The viz answer is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getVIVizPanel(0).isDisplayed())
            .toBe(true);
        await since('Bar chart is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isChatBotVizDisplayed('Bar Chart'))
            .toBe(true);
    });

    it('[TC95951_02] Ask viz question _ insightViz _ on SaaS Bot', async () => {
        await libraryPage.openBotById({ projectId: saasProjectId, botId: retailBot.id });
        await libraryPage.executeScript('window.pendo.stopGuides();');
        await clearHistoryAndSnapshot(aibotChatPanel, aibotSnapshotsPanel);

        //Ask freeform question - show me the top 3 key drivers for {metricName} based on {attributeName}
        await aibotChatPanel.askQuestion('show me the top 3 key drivers for GROSS PROFIT', { timeout: 120 * 10000 });
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getBubbleLoadingIcon());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getVIVizPanel(0), {
            timeout: 60 * 1000,
        });
        await since('The key driver answer is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getMarkDownByIndex(0).isDisplayed())
            .toBe(true);
        await since('The key driver answer is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getVIVizPanel(0).isDisplayed())
            .toBe(true);
        await since('Key driver is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isChatBotVizDisplayed('Visualization'))
            .toBe(true);
        await since('Key driver viz label is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isCustomVizDisplayedByType('keydriver'))
            .toBe(true);

        //Ask question -- show me the trend of SALES vs DATE
        await clearHistoryAndSnapshot(aibotChatPanel, aibotSnapshotsPanel);
        await aibotChatPanel.askQuestion('show me the trend for sales over DATE ', { timeout: 120 * 10000 });
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getBubbleLoadingIcon());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getVIVizPanel(0), {
            timeout: 60 * 1000,
        });
        await since('The Trend answer is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getMarkDownByIndex(0).isDisplayed())
            .toBe(true);
        await since('The Trend answer is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getVIVizPanel(0).isDisplayed())
            .toBe(true);
        await since('Trend viz label is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isCustomVizDisplayedByType('insightlinechart'))
            .toBe(true);
        let trendline = await aibotChatPanel.getAnswerList().$('//*[@id="trendline"]');
        await since('Trend viz data id=trendline is expected to be #{expected}, instead we have #{actual}}')
            .expect(await trendline.isDisplayed())
            .toBe(true);

        //Ask question -- show me the forecast of SALES  vs DATE
        await clearHistoryAndSnapshot(aibotChatPanel, aibotSnapshotsPanel);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('show me the forecast of ');
        await aibotChatPanel.askQuestionByAutoComplete('SALES', 1);
        await aibotChatPanel.typeKeyboard(' for ');
        await aibotChatPanel.askQuestionByAutoComplete('DATE', 0);
        await aibotChatPanel.clickSendBtn();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getBubbleLoadingIcon());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getVIVizPanel(0), {
            timeout: 60 * 1000,
        });
        await since('The Forcast answer is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getMarkDownByIndex(0).isDisplayed())
            .toBe(true);
        await since('The Forcast answer is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getVIVizPanel(0).isDisplayed())
            .toBe(true);
        await since('Forcast viz label is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isCustomVizDisplayedByType('insightlinechart'))
            .toBe(true);
        let forecastArea = await aibotChatPanel.getAnswerList().$('//*[@id="forecastArea"]');
        await since('Forcast viz data is expected to be #{expected}, instead we have #{actual}}')
            .expect(await forecastArea.isDisplayed())
            .toBe(true);
    });

    afterAll(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.executeScript('window.pendo.stopGuides();');
        if (await browsers.pageObj1.userAccount.getUserAccount().isDisplayed()) {
            await browsers.pageObj1.userAccount.openUserAccountMenu();
            await browsers.pageObj1.userAccount.logout({ SSO: true });
        }
    });
});

async function clearHistoryAndSnapshot(aibotChatPanel, aibotSnapshotsPanel) {
    await aibotChatPanel.waitForElementClickable(aibotChatPanel.getClearHistoryButton());
    await aibotChatPanel.clearHistory();
    await aibotChatPanel.openSnapshot();
    if (await aibotSnapshotsPanel.isClearSnapshotButtonDisplayed()) {
        await aibotSnapshotsPanel.clickClearSnapshots();
        await aibotSnapshotsPanel.clickConfirmClearSnapshotsButton();
    }
}
