import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import * as bot from '../../../constants/bot2.js';
import { deleteBotV2ChatByAPI } from '../../../api/bot2/chatAPI.js';
import { infoLog } from '../../../config/consoleFormat.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

// npm run regression -- --spec=specs/regression/bot2/Bot2_AskAbout.spec.js --baseUrl=https://tec-l-1280162.labs.microstrategy.com/MicroStrategyLibrary/
describe('Bot 2.0 Ask about panel', () => {
    let {loginPage, libraryPage, aibotChatPanel, bot2Chat, libraryAuthoringPage, botAuthoring, aibotDatasetPanel,} = browsers.pageObj1;

    const generalSettings = botAuthoring.generalSettings;

    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };

    const multiDatasetBot = {
        id: '56E833F270FB4FBC9CEDFDC6AC3FB1C1',
        name: 'AUTO_2Datasets_DA_DM',
        project: project,
        objectList: [
            { name: 'Airline Name', keywords: 'airline name' },
            { name: 'Number of Flights', keywords: '473435' },
            { name: 'Category_DA', keywords: '1Books' },
            { name: 'Avg (Profit)', keywords: '$73,523' },
            { name: 'Flights Cancelled', keywords: 'flights cancelled' },
        ]
    };

    const universalBot = {
        id: '7285545C79DE49CCA8287B45589856BA',
        name: 'Auto_UniversalBot',
        project: project,
        subBots: {
            MTDI: {
                name: 'Auto_SubBot_MTDI',
                keywords: 'auto_subbot_mtdi',
            },
            OLAP: { name: 'Auto_SubBot_OLAP' },
            newBot: { name: 'Auto_SubBot_AddNewBot' },
            addBot: { name: 'AUTO_Prompts' },
        }
    };

    const unstructureOnlyBot = {
        id: '7EBA39BA625E4CA49487618F3A4D7781',
        name: 'AUTO_Unstructure_Only',
        project: project,
        objectList: [
            { name: 'AUTO_Employee_Handbook', keywords: 'handbook;employee' },
        ]
    };

    const unstructureMixedBot = {
        id: '2527C2DC15EB4CB1A24501FE48738224',
        name: 'AUTO_Unstructure_Mixed',
        project: project,
        objectList: [
            { name: 'Country', keywords: 'country' },
            { name: 'Years With MicroStrategy', keywords: 'MicroStrategy' },
        ]
    };

    async function testAskAboutSummary(obj, index, type = 'column') {
        infoLog(`Ask about - ${obj.name}`);
        await aibotChatPanel.clickStartConversationInAskAboutPanel2(obj.name);

        const queryText = await aibotChatPanel.getQueryTextByIndex(index);
        const expectedMap = {
            column: `Show a summary of the column: ${obj.name}`,
            file: `Show me a summary of the file: ${obj.name}`,
            bot: `Show a summary of the agent: ${obj.name}`,
        };
        const expectedText = expectedMap[type];
        await since(`The question sent should be "${expectedText}", but got "${queryText}"`)
            .expect(queryText)
            .toBe(expectedText);

        await aibotChatPanel.waitForElementStaleness(aibotChatPanel.getDisabledNewChatButton());
        await since(`Answer should contain expected keywords`)
            .expect(await bot2Chat.verifyAnswerContainsKeywords(obj.keywords))
            .toBe(true);
        await since(`The recommendation list title should contains #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getRecommendationTitleObjectName())
            .toBe(obj.name);
        await aibotChatPanel.waitForRecommendationLoading();
        await since('The number of recommended question should be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(3);
    }

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(bot.botUser2);
        await libraryPage.waitForLibraryLoading();
        // clear chats in bots
        await deleteBotV2ChatByAPI({
            botId: multiDatasetBot.id,
            projectId: multiDatasetBot.project.id,
            credentials: bot.botUser2,
        });
        await deleteBotV2ChatByAPI({
            botId: universalBot.id,
            projectId: universalBot.project.id,
            credentials: bot.botUser2,
        });
        await deleteBotV2ChatByAPI({
            botId: unstructureOnlyBot.id,
            projectId: unstructureOnlyBot.project.id,
            credentials: bot.botUser2,
        });
        await deleteBotV2ChatByAPI({
            botId: unstructureMixedBot.id,
            projectId: unstructureMixedBot.project.id,
            credentials: bot.botUser2,
        });
    });

    beforeEach(async () => {
        await libraryPage.resetToLibraryHome();
        await libraryPage.waitForLibraryLoading();
    });

    afterEach(async () => {
            await libraryPage.openDefaultApp();
        });
    
    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99395_1] Ask about in Multi-datasets bot with attribute, metric, DA, DM', async () => {
        infoLog('Open bot, open ask about panel');
        await libraryPage.editBotByUrl({ projectId:project.id, botId:multiDatasetBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotChatPanel.openAskAboutPanel();
        await since('Ask about panel object list display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isAskAboutPanelObjectListDisplayed())
            .toBe(true);

        infoLog('Check/uncheck object in dataset panel');
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.toggleCheckboxForDatasetObject("Airline Name");
        await since('The attribute should be unchecked in dataset panel, instead it is checked')
            .expect(await aibotDatasetPanel.isDatasetObjectSelected("Airline Name"))
            .toBe(false);
        await since('The attribute should not be displayed in ask about panel, instead it is')
            .expect(await aibotChatPanel.isAskAboutPanelObjectByNameDisplayed("Airline Name"))
            .toBe(false);
        await aibotDatasetPanel.toggleCheckboxForDatasetObject("Airline Name");
        await since('The attribute should be checked in dataset panel, instead it is unchecked')
            .expect(await aibotDatasetPanel.isDatasetObjectSelected("Airline Name"))
            .toBe(true);
        await since('The attribute should be displayed in ask about panel, instead it is not')
            .expect(await aibotChatPanel.isAskAboutPanelObjectByNameDisplayed("Airline Name"))
            .toBe(true);

        infoLog('Test attribute, metric, derived attribute, derived metric in ask about panel');
        // 25.08 DE330589: [bot 2.0] Click derived metric or derived attribute in ASK ABOUT panel, no suggestions available
        for (let i = 0; i < multiDatasetBot.objectList.length; i++) {
            await testAskAboutSummary(multiDatasetBot.objectList[i], i);
        }
    });

    it('[TC99395_2] Disable/enable ask about panel, search in ask about panel', async () => {
        infoLog('Open bot, disable ask about');
        await libraryPage.editBotByUrl({ projectId:project.id, botId:multiDatasetBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await since('Ask about button is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isAskAboutBtnDisplayed())
            .toBe(true);
        await generalSettings.turnOffAskAbout();
        await since('Ask about button is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isAskAboutBtnDisplayed())
            .toBe(false);

        infoLog('Enable ask about, search in ask about panel');
        await generalSettings.turnOnAskAbout();
        await aibotChatPanel.openAskAboutPanel();
        await since('Ask about panel object list display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isAskAboutPanelObjectListDisplayed())
            .toBe(true);
        await aibotChatPanel.searchInAskAbout('flights');
        await since('The object count in ask about panel should be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getObjectCountInAskAboutPanel())
            .toBe(3);
        
        infoLog('Start conversation in search result');
        const flightCancelledObj = multiDatasetBot.objectList.find(obj => obj.name === 'Flights Cancelled');
        await testAskAboutSummary(flightCancelledObj, 0);

        infoLog('Clear search, search again');
        await aibotChatPanel.clearAskAboutSearch();
        await aibotChatPanel.searchInAskAbout('avg');
        await since('The object count in ask about panel should be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getObjectCountInAskAboutPanel())
            .toBe(2);
    });

    it('[TC99395_3] Ask about panel in Unstructured only bot', async () => {
        infoLog('Open bot, open ask about panel');
        await libraryPage.editBotByUrl({ projectId:project.id, botId:unstructureOnlyBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotChatPanel.openAskAboutPanel();
        await since('Ask about panel object list display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isAskAboutPanelObjectListDisplayed())
            .toBe(true);

        infoLog('Test attribute, metric, derived attribute, derived metric in ask about panel');
        const unstructuredObj = unstructureOnlyBot.objectList.find(obj => obj.name === 'AUTO_Employee_Handbook');
        await testAskAboutSummary(unstructuredObj, 0, 'file');
    });

    it('[TC99395_4] Ask about panel in Unstructured and structured mixed bot', async () => {
        infoLog('Open bot, open ask about panel');
        await libraryPage.editBotByUrl({ projectId:project.id, botId:unstructureMixedBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotChatPanel.openAskAboutPanel();
        await since('Ask about panel object list display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isAskAboutPanelObjectListDisplayed())
            .toBe(true);

        infoLog('Ask about structured data');
        for (let i = 0; i < unstructureMixedBot.objectList.length; i++) {
            await testAskAboutSummary(unstructureMixedBot.objectList[i], i);
        }

        infoLog('Ask about unstructured data');
        const unstructuredObj = unstructureOnlyBot.objectList.find(obj => obj.name === 'AUTO_Employee_Handbook');
        await testAskAboutSummary(unstructuredObj, 2, 'file');
    });

    it('[TC99395_5] Ask about panel in Universal bot', async () => {
        infoLog('Open bot, open ask about panel');
        await libraryPage.editBotByUrl({ projectId:project.id, botId:universalBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotChatPanel.openAskAboutPanel();

        const { MTDI, OLAP, newBot, addBot } = universalBot.subBots;
        for (const subBot of [MTDI, OLAP, newBot]) {
            await since(`SubBot "${subBot.name}" should be displayed in ask about panel`)
                .expect(await aibotChatPanel.isAskAboutPanelObjectByNameDisplayed(subBot.name))
                .toBe(true);
        }
        
        infoLog('Expand subbots in ask about panel');
        for (const subBot of [MTDI, OLAP, newBot]) {
            await (await aibotChatPanel.getAskAboutPanelObjectByName(subBot.name)).click();
        }
        await takeScreenshotByElement(
            aibotChatPanel.getAskAboutPanelObjectList(),
            'TC99395_5',
            'Ask about panel in universal bot'
        );

        infoLog('Ask about subbot');
        await testAskAboutSummary(MTDI, 0, 'bot');

        infoLog('Delete a subbot, verify ask about');
        await aibotDatasetPanel.openDatasetContextMenuV2(newBot.name, true);
        await aibotDatasetPanel.clickDatasetContextMenuItem('Delete Agent');
        await since('Delete bot, the bot count should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getSubBotCount())
            .toBe(2);
        await since(`SubBot "${newBot.name}" should not be displayed in ask about panel`)
            .expect(await aibotChatPanel.isAskAboutPanelObjectByNameDisplayed(newBot.name))
            .toBe(false);

        infoLog('Add a subbot, verify ask about');
        await aibotDatasetPanel.clickNewBotButton();
        await libraryAuthoringPage.waitForProjectSelectionWindowAppear();
        await libraryAuthoringPage.selectSubBotInUnversalBot([addBot.name]);
        await since('Add bot, the bot count should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getSubBotCount())
            .toBe(3);
        await since(`SubBot "${addBot.name}" should be displayed in ask about panel`)
            .expect(await aibotChatPanel.isAskAboutPanelObjectByNameDisplayed(addBot.name))
            .toBe(true);
    });

});
