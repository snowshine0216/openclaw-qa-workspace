import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setUserLanguage from '../../../api/setUserLanguage.js';
import locales from '../../../testData/locales.json' assert { type: 'json' };
import { clearBotV2SnapshotsByAPI } from '../../../api/bot2/snapshotAPI.js';
import { deleteBotV2ChatByAPI } from '../../../api/bot2/chatAPI.js';
import * as bot from '../../../constants/bot2.js';

describe('ABot2.0 GUI', () => {
    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };
    const Bot_E2E = {
        id: '3414C5ACE79A4B1B8BB5BB5A4385C4CE',
        name: 'AUTO_GUI_BOT2.0',
        project,
    };
    const SubBot_MTDI = {
        id: 'C968A35453584B3F960378401C02E15D',
        name: 'AUTO_SubBot_MTDI',
        project,
    };
    const SubBot_Unstructured = {
        id: '597B776A26194DA1909658D673D1DACB',
        name: 'AUTO_UnstrucuturedOnly',
        project,
    };

    const webView = {
        width: 1600,
        height: 1200,
    };
    const mobileView = {
        width: 550,
        height: 800,
    };

    let {
        loginPage,
        libraryPage,
        botConsumptionFrame,
        aibotSnapshotsPanel,
        snapshotDialog,
        aibotChatPanel,
        botAuthoring,
        botAppearance,
        aibotDatasetPanel,
        dossierAuthoringPage,
        historyPanel,
        aiBotPromptPanel,
        libraryAuthoringPage,
        adc,
        datasetsPanel,
    } = browsers.pageObj1;

    const cases = [
        {
            case_id: 'English',
            browserWindow: webView,
            locale: locales['default'],
        },
        {
            case_id: 'Chinese',
            browserWindow: webView,
            locale: locales['Chinese (Simplified)'],
        },
        {
            case_id: 'German',
            browserWindow: webView,
            locale: locales['German (Germany)'],
        },
        {
            case_id: 'French',
            browserWindow: webView,
            locale: locales['French (France)'],
        },
    ];

    beforeEach(async () => {
        if (!(await loginPage.isLoginPageDisplayed())) {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
    });

    afterEach(async () => {
        await logoutFromCurrentBrowser();
    });

    for (const test of cases) {
        it(`[Bot2.0_GUI_${test.case_id}]`, async () => {
            // set language
            await setUserLanguage({
                baseUrl: browser.options.baseUrl,
                adminCredentials: bot.botV2Premerge,
                userId: bot.botV2Premerge.id,
                localeId: test.locale,
            });

            // login
            await loginPage.login(bot.botV2Premerge);

            // clear snapshots
            await clearBotV2SnapshotsByAPI({
                projectId: Bot_E2E.project.id,
                botId: Bot_E2E.id,
                credentials: bot.botV2Premerge,
            });

            // clear chats
            await deleteBotV2ChatByAPI({
                botId: Bot_E2E.id,
                projectId: Bot_E2E.project.id,
                credentials: bot.botV2Premerge,
            });

            /////////////////////////////////////////////////
            /* ------------- Universal bot -------------  */

            // open bot
            await libraryPage.openBotById({
                botId: Bot_E2E.id,
                projectId: Bot_E2E.project.id,
            });

            // set window size
            await setWindowSize(test.browserWindow);

            ////////// consumption mode

            // welcome page
            await aibotChatPanel.sleep(3000); // wait for prompt to be loaded
            await takeScreenshotByElement(aibotChatPanel.getMainView(), `${test.case_id}`, 'Consumption_MainPanel');

            // ask about
            await aibotChatPanel.openAskAboutPanel();
            await takeScreenshotByElement(
                aibotChatPanel.getAskAboutPanel(),
                `${test.case_id}`,
                'Consumption_AskAboutPanel'
            );

            // chats
            await aibotChatPanel.clickHistoryChatButton();
            await takeScreenshotByElement(historyPanel.historyPanel, `${test.case_id}`, 'Consumption_HistoryChatPanel');
            await historyPanel.clickChatContextMenuBtn('New Chat');
            await takeScreenshotByElement(
                historyPanel.chatContextMenu,
                `${test.case_id}`,
                'Consumption_HistoryChatContextMenu'
            );
            await historyPanel.closeChatHistoryPanel();

            // snapshot - initial
            await aibotChatPanel.openSnapshot();
            await takeScreenshotByElement(
                aibotChatPanel.getSnapshotPanelContainer(),
                `${test.case_id}`,
                'Consumption_SnapshotPanel_Initial'
            );

            // Q&A
            await aibotChatPanel.askQuestion('list the number of flights by Year', true);
            await takeScreenshotByElement(
                aibotChatPanel.getAnswerbyIndex(0),
                `${test.case_id}`,
                'Consumption_QA_Answer'
            );

            // recommendation & prompts
            await aibotChatPanel.openRecommendationPanel();
            await takeScreenshotByElement(
                aibotChatPanel.getRecommendations(),
                `${test.case_id}`,
                'Consumption_RecommendationPanel'
            );
            await aiBotPromptPanel.clickPromptQuickRepliesBtn();
            await takeScreenshotByElement(
                aiBotPromptPanel.getPromptGalleryPanel(),
                `${test.case_id}`,
                'Consumption_PromptPanel'
            );

            // interpretation
            await aibotChatPanel.hoverOnLatestAnswer();
            await aibotChatPanel.clickInterpretation();
            await takeScreenshotByElement(
                aibotChatPanel.getInterpretationComponent(),
                `${test.case_id}`,
                'Consumption_Interpretation'
            );
            await aibotChatPanel.clickInterpretationAdvancedOption();
            await takeScreenshotByElement(
                aibotChatPanel.getInterpretationComponent(),
                `${test.case_id}`,
                'Consumption_InterpretationAdvancedPanel'
            );
            await aibotChatPanel.clickInterpretationSwitchBtn(0);
            await takeScreenshotByElement(
                aibotChatPanel.getInterpretationComponent(),
                `${test.case_id}`,
                'Consumption_InterpretationSQL'
            );

            // follow up
            await aibotChatPanel.clickFollowUpIconbyIndex(0);
            await takeScreenshotByElement(
                aibotChatPanel.getQuotedQuestionInInpuxBox(),
                `${test.case_id}`,
                'Consumption_FollowUp'
            );
            await aibotChatPanel.clickCloseQuotedMessageIcon();

            // take snapshot
            await aibotChatPanel.takeSnapshot(0);
            await aibotChatPanel.sleep(1000); // wait for snapshot to be created
            await takeScreenshotByElement(
                aibotChatPanel.getSnapshotPanelContainer(),
                `${test.case_id}`,
                'Consumption_SnapshotPanel_AfterSnapshot'
            );

            // focus modal
            await aibotSnapshotsPanel.clickMaximizeButton(0);
            await aibotSnapshotsPanel.clickInterpretationFromMaximizeView();
            await takeScreenshotByElement(
                snapshotDialog.getSnapshotDialog(),
                `${test.case_id}`,
                'Consumption_FocusModal'
            );
            await aibotSnapshotsPanel.clickCloseFocusViewButton();

            /////////// authoring mode
            await botConsumptionFrame.clickEditButton();

            // general
            await botAuthoring.selectBotConfigTabByIndex(0);
            await botAuthoring.scrollPageToTop();
            await takeScreenshotByElement(
                botAuthoring.getConfigTabContainerByIndex(0),
                `${test.case_id}`,
                'Authoring_General'
            );
            await takeScreenshotByElement(
                botAuthoring.generalSettings.getLinkSection(),
                `${test.case_id}`,
                'Authoring_General_LinkSection'
            );
            await botAuthoring.generalSettings.openPanelTheme();
            await takeScreenshotByElement(
                botAuthoring.generalSettings.getPopupContainer(),
                `${test.case_id}`,
                'Authoring_General_Palette'
            );
            await libraryPage.refresh();

            // prompts
            await botAuthoring.selectBotConfigTabByIndex(1);
            await takeScreenshotByElement(
                botAuthoring.getConfigTabContainerByIndex(1),
                `${test.case_id}`,
                'Authoring_Prompts'
            );

            // advanced settings
            await botAuthoring.selectBotConfigTabByIndex(2);
            await takeScreenshotByElement(
                botAuthoring.getConfigTabContainerByIndex(2),
                `${test.case_id}`,
                'Authoring_AdvancedSettings'
            );

            // data
            await botAuthoring.selectBotConfigTabByIndex(3);
            await takeScreenshotByElement(
                botAuthoring.getConfigTabContainerByIndex(3),
                `${test.case_id}`,
                'Authoring_Datasets'
            );
            await aibotDatasetPanel.openDatasetContextMenuV2(SubBot_MTDI.name, true);
            await takeScreenshotByElement(
                aibotDatasetPanel.getMenuContainer(),
                `${test.case_id}`,
                'Authoring_DatasetMenu'
            );

            // advanced -> universal bot: add new bot
            await aibotDatasetPanel.clickNewBotButton();
            await libraryAuthoringPage.waitForProjectSelectionWindowAppear();
            await libraryAuthoringPage.sleep(1000); // wait for project selection window to be loaded
            await takeScreenshotByElement(
                await libraryAuthoringPage.getProjectSelectionWindowSideMenu(),
                `${test.case_id}`,
                'Authoring_AddNewBot'
            );
            await libraryAuthoringPage.clickCancelButton();
            await libraryAuthoringPage.goToHome();

            /////////////////////////////////////////////////
            /* ------------- Structured bot -------------  */
            await libraryPage.editBotByUrl({
                botId: SubBot_MTDI.id,
                projectId: SubBot_MTDI.project.id,
            });
            // welcome page
            await takeScreenshotByElement(
                aibotChatPanel.getMainView(),
                `${test.case_id}`,
                'Structured_Authoring_MainPanel'
            );
            // auto complete
            await aibotChatPanel.typeKeyboard('air');
            await takeScreenshotByElement(
                await aibotChatPanel.getAutoCompleteArea(),
                `${test.case_id}`,
                'Structured_Authoring_AutoComplete'
            );
            // Q&A
            await aibotChatPanel.tab();
            await aibotChatPanel.clickSendIcon();
            await aibotChatPanel.waitForAnswerLoading();
            await takeScreenshotByElement(
                aibotChatPanel.getAnswerbyIndex(0),
                `${test.case_id}`,
                'Structured_Authoring_QA'
            );
            // advanced settings
            await botAuthoring.selectBotConfigTabByIndex(2);
            await takeScreenshotByElement(
                botAuthoring.getConfigTabContainerByIndex(2),
                `${test.case_id}`,
                'Structured_Authoring_AdvancedSettings'
            );
            // data
            await botAuthoring.selectBotConfigTabByIndex(3);
            await takeScreenshotByElement(
                botAuthoring.getConfigTabContainerByIndex(3),
                `${test.case_id}`,
                'Structured_Authoring_Datasets'
            );
            // update dataset -> structured bot: open ADC
            await aibotDatasetPanel.clickUpdateDatasetButton();
            await takeScreenshot(`${test.case_id}`, 'Structured_Authoring_ADC');
            // ADC dataset context menu
            await datasetsPanel.rightClickAttributeMetricByName('Year');
            await takeScreenshotByElement(
                datasetsPanel.getMenuContainer(),
                `${test.case_id}`,
                'Structured_Authoring_DatasetContextMenu'
            );
            await adc.cancel();

            /////////////////////////////////////////////////
            /* ------------- Unstructured bot -------------  */
            await libraryPage.editBotByUrl({
                botId: SubBot_Unstructured.id,
                projectId: SubBot_Unstructured.project.id,
            });
            // Q&A
            await aibotChatPanel.askQuestion(
                `Who is considered a 'family member' according to the provided definitions?`
            );
            await takeScreenshotByElement(
                aibotChatPanel.getAnswerbyIndex(0),
                `${test.case_id}`,
                'Unstructured_Authoring_QA'
            );
            // unstrucured indicator
            await aibotChatPanel.hoverOnUnstructuredDataIndicator();
            await takeScreenshotByElement(
                aibotChatPanel.getUnstructuredDataTooltip(),
                `${test.case_id}`,
                'Unstructured_Authoring_IndicatorTooltip'
            );
            // data setting
            await botAuthoring.selectBotConfigTabByIndex(3);
            await takeScreenshotByElement(
                botAuthoring.getConfigTabContainerByIndex(3),
                `${test.case_id}`,
                'Unstructured_Authoring_Datasets'
            );
            // update dataset -> unstructured bot: open ADC
            await aibotDatasetPanel.clickUpdateDatasetButton();
            await takeScreenshot(`${test.case_id}`, 'Unstructured_Authoring_ADC');
            await adc.cancel();
        });
    }
});
