import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setUserLanguage from '../../../api/setUserLanguage.js';
import locales from '../../../testData/locales.json' assert { type: 'json' };
import { clearHistoryAPI } from '../../../api/bot/index.js';
import clearSnapshotsByAPI from '../../../api/bot/snapshots/clearSnapshots.js';
import forgetAllLearnings from '../../../api/bot/forgetLearnings.js';
import * as bot from '../../../constants/bot2.js';

describe('ABot1.0 GUI', () => {
    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };
    const Bot_E2E = {
        id: '0C8368082B41DB190232198FF10D33C8',
        name: 'AUTO_GUI_BOT1.0',
        project,
        chatId: '8A02AADC0746C59306DD5691C36A675F',
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
        it(`[Bot1.0_GUI_${test.case_id}]`, async () => {
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
            await clearSnapshotsByAPI({
                credentials: bot.botV2Premerge,
                projectId: Bot_E2E.project.id,
                chatsId: Bot_E2E.chatId,
            });

            // forget all learnings
            await forgetAllLearnings(bot.botV2Premerge);

            ////// manage my learning
            await libraryPage.openUserAccountMenu();
            await aibotChatPanel.openManageLearning();
            await takeScreenshotByElement(
                aibotChatPanel.getLearningManagerWindow(),
                `${test.case_id}`,
                'ManageLearningWindow'
            );
            await aibotChatPanel.closeDialogue();

            // open bot
            await libraryPage.openBotById({
                botId: Bot_E2E.id,
                projectId: Bot_E2E.project.id,
            });

            // clear history
            await aibotChatPanel.clearHistory();

            // set window size
            await setWindowSize(test.browserWindow);

            ////// consumption mode
            await takeScreenshotByElement(aibotChatPanel.getMainView(), `${test.case_id}`, 'Consumption_MainPanel');

            // ask about
            await aibotChatPanel.openAskAboutPanel();
            await takeScreenshotByElement(
                aibotChatPanel.getAskAboutPanel(),
                `${test.case_id}`,
                'Consumption_AskAboutPanel'
            );

            // snapshot - initial
            await aibotChatPanel.openSnapshot();
            await aibotSnapshotsPanel.clearSnapshot();
            await takeScreenshotByElement(
                aibotChatPanel.getSnapshotPanelContainer(),
                `${test.case_id}`,
                'Consumption_SnapshotPanel_Initial'
            );

            // Q&A
            await aibotChatPanel.askQuestion('list all the From Coal  by Year');
            await takeScreenshotByElement(
                aibotChatPanel.getAnswerbyIndex(0),
                `${test.case_id}`,
                'Consumption_QA_Answer'
            );

            // recommendation
            await aibotChatPanel.clickExpandRecommendation();
            await takeScreenshotByElement(
                aibotChatPanel.getRecommendations(),
                `${test.case_id}`,
                'Consumption_RecommendationPanel'
            );

            // interpretation
            await aibotChatPanel.openInterpretation();
            await takeScreenshotByElement(
                aibotChatPanel.getInterpretationComponent(),
                `${test.case_id}`,
                'Consumption_Interpretation'
            );

            // thumb down
            await aibotChatPanel.clickThumbDownButtonbyIndex(0);
            await takeScreenshotByElement(
                aibotChatPanel.getFeedbackPanel(),
                `${test.case_id}`,
                'Consumption_ThumbDown'
            );
            await aibotChatPanel.clickFeedbackCloseButtonbyIndex(0);

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

            /////// authoring mode
            await botConsumptionFrame.clickEditButton();

            // general
            await botAuthoring.selectBotConfigTabByIndex(0);
            await botAuthoring.scrollPageToTop();
            await takeScreenshotByElement(
                botAuthoring.getConfigTabContainerByIndex(0),
                `${test.case_id}`,
                'Authoring_General'
            );
            await botAuthoring.scrollPageToBottom();
            await takeScreenshotByElement(
                botAuthoring.generalSettings.getLinkSection(),
                `${test.case_id}`,
                'Authoring_General_LinkSection'
            );

            // appearance
            await botAuthoring.selectBotConfigTabByIndex(1);
            await takeScreenshotByElement(
                botAuthoring.getConfigTabContainerByIndex(1),
                `${test.case_id}`,
                'Authoring_Appearance'
            );
            await botAppearance.openPaletteDropdownList();
            await takeScreenshotByElement(
                botAppearance.getPaletteSelectPanel(),
                `${test.case_id}`,
                'Authoring_PaletteSelectPanel'
            );
            await libraryPage.refresh();

            //customization
            await botAuthoring.selectBotConfigTabByIndex(2);
            await botAuthoring.scrollPageToTop();
            await takeScreenshotByElement(
                botAuthoring.getConfigTabContainerByIndex(2),
                `${test.case_id}`,
                'Authoring_Customization'
            );
            await botAuthoring.scrollPageToBottom();
            await takeScreenshotByElement(
                botAuthoring.custommizationPanel.getKnowledgeSection(),
                `${test.case_id}`,
                'Authoring_KnowledgeSection'
            );

            // datasets
            await botAuthoring.selectBotConfigTabByIndex(3);
            await takeScreenshotByElement(
                botAuthoring.getConfigTabContainerByIndex(3),
                `${test.case_id}`,
                'Authoring_Datasets'
            );
            await aibotDatasetPanel.openMenu();
            await takeScreenshotByElement(
                aibotDatasetPanel.getMenuContainer(),
                `${test.case_id}`,
                'Authoring_DatasetMenu'
            );

            // advanced
            await aibotDatasetPanel.switchToAdvancedMode();
            await aibotDatasetPanel.sleep(3000); // wait for advanced panel to be loaded
            await takeScreenshot(`${test.case_id}`, 'Authoring_Advanced');
            await dossierAuthoringPage.actionOnToolbar('Cancel');
        });
    }
});
