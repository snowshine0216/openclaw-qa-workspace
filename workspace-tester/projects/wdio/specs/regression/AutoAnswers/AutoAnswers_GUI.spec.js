import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { resetHome } from '../../../utils/specHelper.js';
import setUserLanguage from '../../../api/setUserLanguage.js';
import resetUserLanguage from '../../../api/resetUserLanguage.js';
import locales from '../../../testData/locales.json' assert { type: 'json' };
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import * as bot from '../../../constants/bot2.js';

describe('Auto Answers GUI', () => {
    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };
    const AA_E2E = {
        id: 'E137B25E8541F9B97412CFA9E8195001',
        name: 'HRS',
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
        {
            case_id: 'MobileView',
            browserWindow: mobileView,
            locale: locales['default'],
        },
    ];

    const { loginPage, libraryPage, toc, dossierPage, aiAssistant, interpretation } = browsers.pageObj1;

    beforeEach(async () => {
        if (!(await loginPage.isLoginPageDisplayed())) {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
    });

    afterEach(async () => {
        await logoutFromCurrentBrowser();
    });

    for (const test of cases) {
        it(`[AutoAnswer_GUI_${test.case_id}]`, async () => {
            // set language
            await setUserLanguage({
                baseUrl: browser.options.baseUrl,
                adminCredentials: bot.botV2Premerge,
                userId: bot.botV2Premerge.id,
                localeId: test.locale,
            });

            // login
            await loginPage.login(bot.botV2Premerge);
            await setWindowSize(test.browserWindow);

            // reset dossier state
            await resetDossierState({
                credentials: bot.botV2Premerge,
                dossier: AA_E2E,
            });

            // open dossier
            await libraryPage.openDossierById({
                dossierId: AA_E2E.id,
                projectId: AA_E2E.project.id,
            });

            if (test.browserWindow != mobileView) {
                // open AI assistant
                await aiAssistant.open();
                await aiAssistant.sleep(1000);
                // whole panel - unpin
                await aiAssistant.unpin();
                await aiAssistant.collapseRecommendation(); // to exlude dynamic content when take screenshot
                await takeScreenshotByElement(
                    aiAssistant.getAssistantMainPanel(),
                    `${test.case_id}`,
                    'Unpin Auto Answers'
                );
                // whole panel - pin
                await aiAssistant.pin();
                await aiAssistant.collapseRecommendation(); // to exlude dynamic content when take screenshot
                await takeScreenshotByElement(
                    aiAssistant.getAssistantMainPanel(),
                    `${test.case_id}`,
                    'Pin Auto Answers'
                );
                // whole panel - maximize
                await aiAssistant.clickMaxMinBtn();
                await takeScreenshotByElement(
                    aiAssistant.getAssistantMainPanel(),
                    `${test.case_id}`,
                    'Max Auto Answers'
                );
                await aiAssistant.clickMaxMinBtn();
            } else {
                await libraryPage.hamburgerMenu.openAutoAnswersInMobileView();
                await aiAssistant.waitForAIReady();
            }

            // recommendation
            await aiAssistant.expandRecommendation();
            await aiAssistant.sleep(1000);
            await takeScreenshotByElement(
                aiAssistant.getRecommendationContainer(),
                `${test.case_id}`,
                'Recommendation'
            );
            await aiAssistant.collapseRecommendation();

            // learn more tooltip
            await aiAssistant.hoverLearMoreBtn();
            await takeScreenshotByElement(aiAssistant.getTooltip(), `${test.case_id}`, 'LearnMoreTooltip');

            // Q&A
            await aiAssistant.input('list the country by years with MicroStrategy');
            await aiAssistant.sendQuestionAndWaitForAnswer();
            await takeScreenshotByElement(aiAssistant.getAnswers()[0], `${test.case_id}`, 'Answer');

            //interpretation
            await interpretation.generateCIFromLatestAnswer();
            await aiAssistant.sleep(1000); // wait static GUI render before take screenshot
            await takeScreenshotByElement(aiAssistant.getAnswers()[0], `${test.case_id}`, 'Answer with interpretation');

            // bad response
            await aiAssistant.clickThumbDown(1);
            await aiAssistant.sleep(500); // wait static GUI render before take screenshot
            await takeScreenshotByElement(aiAssistant.getFeedbackContainer(1), `${test.case_id}`, 'Feedback Dialog');
            await aiAssistant.closeFeedbackDialog(1);

            // maximize
            //// open maximize modals
            await aiAssistant.maximizeChatbotVisualization();
            await aiAssistant.sleep(1000); // wait static GUI render before take screenshot
            await takeScreenshotByElement(
                aiAssistant.getChatBotVizFocusModal(),
                `${test.case_id}`,
                'Maximize with Q&A'
            );
            //// interpretation
            await interpretation.showInterpretationInVizFocusModal();
            await takeScreenshotByElement(
                aiAssistant.getChatBotVizFocusModal(),
                `${test.case_id}`,
                'Maximize with interpretation'
            );
            //// close modal
            await aiAssistant.closeChatbotVizFocusModal();

            // clear history
            await aiAssistant.clickClearBtn();
            await takeScreenshotByElement(
                aiAssistant.getClearConfirmationContainer(),
                `${test.case_id}`,
                'ClearHistory'
            );
        });
    }
});
