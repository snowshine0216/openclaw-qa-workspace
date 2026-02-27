import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { autoAnswerUser } from '../../../constants/autoAnswer.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import { getCustomAppBody } from '../../../constants/customApp/customAppBody.js';
import * as appConsts from '../../../constants/customApp/bot.js';
import { mockChatResult, mockInterpretationContents } from '../../../api/mock/mock-response-utils.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('Auto Answers Panel', () => {
    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };
    const AA_GDC = {
        id: '67C1B20C37403CC79E982291F7AAF491',
        name: 'AutoAnswers_GDC',
        project,
    };
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const { loginPage, dossierPage, libraryPage, toc, aiAssistant, interpretation, aiViz } = browsers.pageObj1;

    // dark theme
    const disclaimer_default = 'AI can make mistakes. Consider checking important information for accuracy.';
    const disclaimer_customize1 = 'Customized disclaimer for testing';
    const disclaimer_customize2 = '<script>alert("")<script>';
    const disclaimer_customize3 =
        'Customized disclaimer text for testing to max length: long long long long  long long  long long  long long  long long  long long  long long  long long  long long  long long  long  long  long long text';

    const customApp_disclaimer_Default = getCustomAppBody({
        version: 'v6',
        name: 'Auto_AutoAnswers_Disclaimer_default',
        aiSettings: {
            feedback: true,
            learning: true,
            disclaimer: disclaimer_default,
        },
    });
    const customApp_disclaimer_customize1 = getCustomAppBody({
        version: 'v6',
        name: 'Auto_AutoAnswers_Disclaimer_cutomize1',
        aiSettings: {
            feedback: true,
            learning: true,
            disclaimer: disclaimer_customize1,
        },
    });
    const customApp_disclaimer_customize2 = getCustomAppBody({
        version: 'v6',
        name: 'Auto_AutoAnswers_Disclaimer_customize1',
        aiSettings: {
            feedback: true,
            learning: true,
            disclaimer: disclaimer_customize2,
        },
    });
    const customApp_disclaimer_customize3 = getCustomAppBody({
        version: 'v6',
        name: 'Auto_AutoAnswers_Disclaimer_customize3',
        theme: appConsts.darkTheme, // dark theme
        aiSettings: {
            feedback: true,
            learning: true,
            disclaimer: disclaimer_customize3,
        },
    });

    const appIdsToDelete = [];
    let customAppId_defaultDisclaimer;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        if (!(await loginPage.isLoginPageDisplayed())) {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
        await loginPage.login(autoAnswerUser);
        await libraryPage.openDefaultApp();

        // open auto answers
        await resetDossierState({
            credentials: autoAnswerUser,
            dossier: AA_GDC,
        });
        await libraryPage.openDossier(AA_GDC.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.openAndPin();
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
        await deleteCustomAppList({
            credentials: autoAnswerUser,
            customAppIdList: appIdsToDelete,
        });
        appIdsToDelete.length = 0;
        await logoutFromCurrentBrowser();
    });

    it('[TC91718_01] Auto Answers Focus Mode - Action buttons on focus mode widdow ', async () => {
        const question = 'what is the On-Time by year, show in grid';
        await aiAssistant.inputAndSendQuestion(question);

        // max icon
        await aiAssistant.hoverAnswer();
        await aiAssistant.sleep(500); // wait for UI static rendering
        await since('Hover, expand icon present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFocusMaxIconVisible())
            .toBe(true);
        await takeScreenshotByElement(aiAssistant.getAnswerActionsContainer(), 'TC91718_01', 'FocusMode_AnswerActions');

        // open focus mode
        await aiAssistant.maximizeChatbotVisualization();
        await since('Click, focus modal present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFocuseModalPresent())
            .toBe(true);
        await takeScreenshotByElement(aiAssistant.getChatBotVizFocusModalHeader(), 'TC91718_01', 'FocusMode_Header');

        // interpretation
        await interpretation.showInterpretationInVizFocusModal();
        await since('Show interpretaion, interpreation block present should be #{expected}, while we get #{actual}')
            .expect(await interpretation.isInterPretationPresentInFocusModal())
            .toBe(true);
        await takeScreenshotByElement(
            interpretation.getInterpretationIconInFocusMode(),
            'TC91718_01',
            'FocusMode_Interpretation'
        );
        //// -- hide interpretaion
        await interpretation.hideInterpretationInVizFocusModal();
        await since('Hide interpretaion, interpreation block present should be #{expected}, while we get #{actual}')
            .expect(await interpretation.isInterPretationPresentInFocusModal())
            .toBe(false);

        // copy as image
        await aiAssistant.copyAsImageInVizFocusModal();

        // see more,see less
        await since('See more button present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getSeeMoreOrLessBtnOnVizFocusModal().isDisplayed())
            .toBe(true);
        await aiAssistant.clickSeeMoreOrLessBtnOnVizFocusModal();
        await since('Click see more, expand should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isSeeMoreLessBtnExpandedOnFocusModal())
            .toBe(true);
        await aiAssistant.clickSeeMoreOrLessBtnOnVizFocusModal();
        await since('Click see less, expand should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isSeeMoreLessBtnExpandedOnFocusModal())
            .toBe(false);

        // close
        await aiAssistant.closeChatbotVizFocusModal();
        await since('close, focus modal present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFocuseModalPresent())
            .toBe(false);
    });

    it('[TC91718_02] Auto Answers Focus Mode - Maxmum icon hide/display in different scenarios ', async () => {
        const question1 = 'what is the On-Time by year, show in grid';
        const question2 = 'what is the total On-Time, show summary text only';
        const question3 = 'what is the On-Time by year, show in line chart';

        ///// compact mode
        // answer type: answer with gid - with max icon
        await aiAssistant.inputAndSendQuestion(question1);
        await aiAssistant.hoverAnswer();
        await aiAssistant.sleep(500); // wait for UI static rendering
        await since('answer with grid, max icon present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFocusMaxIconVisible())
            .toBe(true);
        await aiAssistant.clearHistory();

        // answer type: answer with pure text  - no max icon
        await aiAssistant.inputAndSendQuestion(question2);
        await aiAssistant.hoverAnswer();
        await aiAssistant.sleep(500); // wait for UI static rendering
        await since('answer with pure text, max icon present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFocusMaxIconVisible())
            .toBe(false);
        await aiAssistant.clearHistory();

        // answer type: answer with bar chart - with max icon
        await aiAssistant.inputAndSendQuestion(question3);
        await aiAssistant.hoverAnswer();
        await aiAssistant.sleep(500); // wait for UI static rendering
        await since('answer with bar chart, max icon present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFocusMaxIconVisible())
            .toBe(true);

        ///// focus mode
        // auto answer panel in maximized mode
        await aiAssistant.clickMaxMinBtn();
        await aiAssistant.hoverAnswer();
        await aiAssistant.sleep(500); // wait for UI static rendering
        await since('Maximum auto answer panel, max icon present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFocusMaxIconVisible())
            .toBe(true);
        await aiAssistant.clickMaxMinBtn();

        // auto answer panel in unpin mode
        await aiAssistant.unpin();
        await aiAssistant.hoverAnswer();
        await aiAssistant.sleep(500); // wait for UI static rendering
        await since('Unpin auto answer panel, max icon present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFocusMaxIconVisible())
            .toBe(true);
    });

    it('[TC91974] Auto Anwers Clear History - Clear auto answer history list ', async () => {
        const question = 'what is the On-Time by year, show in grid';

        // send questions
        await since('Inital open panel, message count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getMesseageCount())
            .toBe(0);
        await since('Inital open panel, clear history button disabled should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isClearBtnDisabled())
            .toBe(true);
        await aiAssistant.inputAndSendQuestion(question);
        await since('After post question, message count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getMesseageCount())
            .toBe(2);
        await since('After post question, clear history button disabled should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isClearBtnDisabled())
            .toBe(false);

        // check message status when switch page
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.waitForAIReady();
        await since('Switch page, message count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getMesseageCount())
            .toBe(2);

        // clear history
        await aiAssistant.clickClearBtn();
        await takeScreenshotByElement(
            aiAssistant.getClearConfirmationContainer(),
            'TC91974',
            'ClearHistory_Confirmation'
        );
        await aiAssistant.selectClearConfirmationBtn('No');
        await since('Clear History but select No, message count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getMesseageCount())
            .toBe(2);
        await aiAssistant.clickClearBtn();
        await aiAssistant.selectClearConfirmationBtn('Yes');
        await since('Clear History but select No, message count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getMesseageCount())
            .toBe(0);
        await since('Clear History with Yes, clear button disabled should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isClearBtnDisabled())
            .toBe(true);
        await since('Clear History with Yes, welcome page present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isWelcomePagePresent())
            .toBe(true);

        // check message status when switch page
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.waitForAIReady();
        await since('Cleard, switch page, message count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getMesseageCount())
            .toBe(0);
    });

    it('[TC91975_01] Auto Answers Keep Content - Keep content when switch page', async () => {
        const question1 = 'what is the On-Time by year';
        const question2 = 'show summary only';

        // send questions
        await aiAssistant.inputAndSendQuestion(question1);
        await since('Send question, message count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getMesseageCount())
            .toBe(2);
        await aiAssistant.inputAndSendQuestion(question2);
        await since('Send question again, message count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getMesseageCount())
            .toBe(4);

        // swith page without more questions
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await aiAssistant.waitForAIReady();
        await since('Switch page , message count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getMesseageCount())
            .toBe(0);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.waitForAIReady();
        await since('Switch back , message count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getMesseageCount())
            .toBe(4);

        // switch page again with question send and answer returned
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await aiAssistant.waitForAIReady();
        await aiAssistant.inputAndSendQuestion(question1);
        await since('Switch page again, message count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getMesseageCount())
            .toBe(2);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.waitForAIReady();
        await since('Switch back again, message count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getMesseageCount())
            .toBe(4);

        // switch page again with question send, answer not returned
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await aiAssistant.waitForAIReady();
        await aiAssistant.input(question1);
        await aiAssistant.sendQuestion();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.waitForAIReady();
        await since('Switch back without answer renturned, message count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getMesseageCount())
            .toBe(4);

        // switch to another new page (new chapter new page)
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        await aiAssistant.waitForAIReady();
        await aiAssistant.expandRecommendation();
        await aiAssistant.sendQuestionByRecommendation();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await since('Switch first from another chapter, message count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getMesseageCount())
            .toBe(4);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await aiAssistant.waitForAIReady();
        await since('Switch second from another chapter , message count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getMesseageCount())
            .toBeGreaterThanOrEqual(2);
    });

    it('[TC91975_01] Auto Answers Keep Content - Keep content when undo, reset, re-open panel', async () => {
        const undoEnabled = await dossierPage.isUndoEnabled();
        const question1 = 'what is the On-Time by year';
        const question2 = 'show summary only';

        // send questions
        await aiAssistant.inputAndSendQuestion(question1);
        await since('Send question, message count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getMesseageCount())
            .toBe(2);
        await since('Send question again, undo enabled should be #{expected}, while we get #{actual}')
            .expect(await dossierPage.isUndoEnabled())
            .toBe(undoEnabled);
        await aiAssistant.clickFollowUp();
        await aiAssistant.inputAndSendQuestion(question2);
        await since('Send question again, message count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getMesseageCount())
            .toBe(4);

        //undo, keep messages
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await dossierPage.clickUndo();
        await aiAssistant.waitForAIReady();
        await since('Undo first time, message count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getMesseageCount())
            .toBe(0);
        await dossierPage.clickUndo();
        await aiAssistant.waitForAIReady();
        await since('Undo second time, message count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getMesseageCount())
            .toBe(4);

        // reset dossier, keep messages
        await dossierPage.resetDossier();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.waitForAIReady();
        await since('Reset dossier, message count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getMesseageCount())
            .toBe(4);

        // re-open auto answers, keep messages
        await aiAssistant.close();
        await aiAssistant.open();
        await since('Re-open auto answers, message count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getMesseageCount())
            .toBe(4);

        // re-open dossier, message will be cleared
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(AA_GDC.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.waitForAIReady();
        await aiAssistant.openAndPin();
        await since('Re-open dossier, message count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getMesseageCount())
            .toBe(0);
    });

    it('[TC91976] Auto Answers Data Limit when data points > 8', async () => {
        const message = 'show the Avg Delay (min) of Airline Name, show in bar chart';

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await aiAssistant.waitForAIReady();

        // data limit shows when at least 8 points are displayed (removed this limit in 24.12 )
        await aiAssistant.inputAndSendQuestion(message);
        await aiAssistant.sleep(1000); // wait for Viz static rendering
        await since('Data Limit displayed should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isDataLimitDisplayed())
            .toBe(false);
        await since('Bars point count should be greater than #{expected}, while we get #{actual}')
            .expect(await aiViz.getBarsCountInBarChart())
            .toBeGreaterThan(8);

        // maximum the answer
        await aiAssistant.maximizeChatbotVisualization();
        await since('Max, bars count should be greater than #{expected}, while we get #{actual}')
            .expect(await aiViz.getBarsCountInBarChart(1, true))
            .toBeGreaterThan(8);
        await aiAssistant.closeChatbotVizFocusModal();

        // questions with less than 8 points
        await aiAssistant.clickFollowUp();
        await aiAssistant.inputAndSendQuestion('show the top 2, show in bar chart');
        await aiAssistant.sleep(500); // wait for Viz static rendering
        await since('Again with less data, Data Limit displayed should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isDataLimitDisplayed(2))
            .toBe(false);
        await since('Again with less data, Bars count should be less than #{expected}, while we get #{actual}')
            .expect(await aiViz.getBarsCountInBarChart(2, false))
            .toBeLessThan(8);
    });

    it('[TC93089] Auto Answers selected viz and targeting indicator', async () => {
        const question1 = '0101 which year has the most On-Time';
        const question2 = '0101 which year has the most On-Time, show in grid';
        const question3 = '0101 describe the selected viz';

        // select viz, send question, show in text
        await aiAssistant.selectViz('Visualization 1');
        await aiAssistant.inputAndSendQuestion(question1);
        await since('Select viz, targeting indicator present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFilterIndicatorDisplayedInAnswer(1))
            .toBe(true);
        await takeScreenshotByElement(aiAssistant.getFilterIndicator(1), 'TC93089', 'TargetingIndicator');
        await aiAssistant.hoverFilterIndicatorInAnswer(1);
        await since('Hover targeting indicator, tooltip present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getTooltipText())
            .toBe('Answers based on your selection');

        // select viz, send question, show in grid
        await aiAssistant.inputAndSendQuestion(question2);
        await since('Select viz, targeting indicator present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFilterIndicatorDisplayedInAnswer(2))
            .toBe(true);

        // select viz, send question, no targeting indicator
        await aiAssistant.inputAndSendQuestion(question3);
        // Commented out due to DE312797
        // await since('Select viz, targeting indicator present should be #{expected}, while we get #{actual}')
        //     .expect(await aiAssistant.isFilterIndicatorDisplayedInAnswer(3))
        //     .toBe(true);

        // deselect viz, send questions
        await aiAssistant.deleteContext();
        await aiAssistant.inputAndSendQuestion(question1);
        await since('Deselect viz, targeting indicator present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFilterIndicatorDisplayedInAnswer(4))
            .toBe(false);
    });

    it('[TC94996_01] Auto Answers Disclaimer - Default disclaimer', async () => {
        customAppId_defaultDisclaimer = await createCustomApp({
            credentials: autoAnswerUser,
            customAppInfo: customApp_disclaimer_Default,
        });
        appIdsToDelete.push(customAppId_defaultDisclaimer);

        // open custom app
        await libraryPage.openCustomAppById({ id: customAppId_defaultDisclaimer });

        // open AI assistant
        await libraryPage.openDossier(AA_GDC.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.openAndPin();
        await aiAssistant.collapseRecommendation();

        // disclaimer in compact mode
        await since('Default disclaimer, disclaimer present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isDisclaimerPresent())
            .toBe(true);
        await since('Default disclaimer, disclaimer text should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getDisclaimerText())
            .toBe(disclaimer_default);
        await takeScreenshotByElement(aiAssistant.getAssistantMainPanel(), 'TC94996_01', 'Disclaimer_compact');

        // disclaimer in compact mode
        await aiAssistant.clickMaxMinBtn();
        await since('max mode, disclaimer present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isDisclaimerPresent())
            .toBe(true);
        await takeScreenshotByElement(aiAssistant.getAssistantMainPanel(), 'TC94996_01', 'Disclaimer_max');

        // disclaimer in unpin mode
        await aiAssistant.clickMaxMinBtn();
        await aiAssistant.unpin();
        await since('unpin, disclaimer present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isDisclaimerPresent())
            .toBe(true);
        await takeScreenshotByElement(aiAssistant.getAssistantMainPanel(), 'TC94996_01', 'Disclaimer_unpin');

        await aiAssistant.close();
    });

    it('[TC94996_02] Auto Answers Disclaimer - Customzied disclaimer', async () => {
        // customized disclaimer: 'Customized disclaimer for testing';
        const customAppId_customizeDisclaimer1 = await createCustomApp({
            credentials: autoAnswerUser,
            customAppInfo: customApp_disclaimer_customize1,
        });
        appIdsToDelete.push(customAppId_customizeDisclaimer1);
        await libraryPage.openCustomAppById({ id: customAppId_customizeDisclaimer1 });
        //// -- open AI assistant
        await libraryPage.openDossier(AA_GDC.name);
        await aiAssistant.openAndPin();
        //// -- disclaimer
        await since('Customize disclaimer 1, disclaimer present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isDisclaimerPresent())
            .toBe(true);
        await since('Customize disclaimer 1, disclaimer text should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getDisclaimerText())
            .toBe(disclaimer_customize1);

        // customized disclaimer: <script>alert("")<script>
        const customAppId_customizeDisclaimer2 = await createCustomApp({
            credentials: autoAnswerUser,
            customAppInfo: customApp_disclaimer_customize2,
        });
        appIdsToDelete.push(customAppId_customizeDisclaimer2);
        await libraryPage.openCustomAppById({ id: customAppId_customizeDisclaimer2 });
        //// -- open AI assistant
        await libraryPage.openDossier(AA_GDC.name);
        await aiAssistant.openAndPin();
        //// -- disclaimer
        await since('Customize disclaimer 2, disclaimer present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isDisclaimerPresent())
            .toBe(true);
        await since('Customize disclaimer 2, disclaimer text should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getDisclaimerText())
            .toBe(disclaimer_customize2);

        // customized disclaimer: max length with dark theme
        const customAppId_customizeDisclaimer3 = await createCustomApp({
            credentials: autoAnswerUser,
            customAppInfo: customApp_disclaimer_customize3,
        });
        appIdsToDelete.push(customAppId_customizeDisclaimer3);
        await libraryPage.openCustomAppById({ id: customAppId_customizeDisclaimer3 });
        //// -- open AI assistant
        await libraryPage.openDossier(AA_GDC.name);
        await aiAssistant.openAndPin();
        await aiAssistant.collapseRecommendation();
        //// -- disclaimer
        await since('Customize disclaimer 3, disclaimer present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isDisclaimerPresent())
            .toBe(true);
        await since('Customize disclaimer 3, disclaimer text should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getDisclaimerText())
            .toContain('Customized disclaimer text for testing to max length');
        await takeScreenshotByElement(aiAssistant.getAssistantMainPanel(), 'TC94996_02', 'Disclaimer_maxLength');
    });
});
