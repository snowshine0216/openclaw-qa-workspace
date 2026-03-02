import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { autoAnswerUser, autoAnswerUserI18n } from '../../../constants/autoAnswer.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import { getCustomAppBody } from '../../../constants/customApp/customAppBody.js';
import * as appConsts from '../../../constants/customApp/bot.js';
import * as consts from '../../../constants/customApp/info.js';
import { checkDownloadedImage } from '../../../utils/compareImage.js';
import { mockChatResult, mockInterpretationContents } from '../../../api/mock/mock-response-utils.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('E2E workflow for Auto Answers', () => {
    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };
    const AA_E2E = {
        id: 'E7B15D236449AB345EDFFA8691569DB2',
        name: 'AutoAnswers_E2E',
        project,
    };
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const { loginPage, dossierPage, libraryPage, toc, aiAssistant, interpretation } = browsers.pageObj1;

    // dark theme
    const darkThemeBody = getCustomAppBody({
        version: 'v6',
        name: 'Auto_AutoAnswers_DarkTheme',
        theme: appConsts.darkTheme,
        aiSettings: {
            feedback: true,
            learning: true,
        },
    });
    const appIdsToDelete = [];

    let customAppId_colorTheme;
    let result =
        "Identify the country with the highest CO2 emissions from coal and display it in one grid, sorted by 'From Coal' in descending order.";

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        if (!(await loginPage.isLoginPageDisplayed())) {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
        await loginPage.login(autoAnswerUser);
        await setWindowSize(browserWindow);
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

    it('[TC95016_01] Auto Answers E2E - QA in auto answers', async () => {
        await resetDossierState({
            credentials: autoAnswerUser,
            dossier: AA_E2E,
        });
        await libraryPage.openDossier(AA_E2E.name);

        // open AI assistant
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.openAndPin();

        // post question by recommendation
        await since('By default, the recommendation item count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getRecommendationItems().length)
            .toBe(3);
        await aiAssistant.sendQuestionByRecommendation();
        await since('Send question by recommendation, total answers should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.totalAnswers())
            .toBe(1);

        // post question by input
        await aiAssistant.input('List all the Departure Hour');
        await aiAssistant.sendQuestionAndWaitForAnswer();
        await since('Send question by input, total answers should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.totalAnswers())
            .toBe(2);

        // see more , see less
        await aiAssistant.seeMoreFromLatestAnswer();
        await since('Click see more, see more button present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isSeeMoreBtnPresent())
            .toBe(false);
        await aiAssistant.seeLessFromLatestAnswer();
        await since('Click see less, see more button present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isSeeLessBtnPresent())
            .toBe(false);

        // clear history
        await aiAssistant.clickClearBtn();
        await aiAssistant.selectClearConfirmationBtn('No');
        await since('Clear History but select No, welcome page present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isWelcomePagePresent())
            .toBe(false);
        await aiAssistant.clickClearBtn();
        await aiAssistant.selectClearConfirmationBtn('Yes');
        await since('Clear History with Yes, clear button disabled should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isClearBtnDisabled())
            .toBe(true);
        await since('Clear History with Yes, welcome page present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isWelcomePagePresent())
            .toBe(true);

        // close AA
        await aiAssistant.close();
        await since('Close AA, AA present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isAIAssistantPresent())
            .toBe(false);
    });

    it('[TC95016_02] Auto Answers E2E - Recommendation in auto answer ', async () => {
        await resetDossierState({
            credentials: autoAnswerUser,
            dossier: AA_E2E,
        });
        await libraryPage.openDossier(AA_E2E.name);

        // open AI assistant
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.openAndPin();

        // by default
        await since('By default, the recommendation collapsed should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(false);
        await since('By default, the Recommendation refresh disabled should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isRecommendationRefreshDisabled())
            .toBe(false);

        // copy to query
        const text = await aiAssistant.getRecommendationText();
        await aiAssistant.copyToQuetyFromRecommendation();
        await since('Copy to query from recommendation, copied text should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getInputText())
            .toBe(text);
        await since(
            'Copy to query from recommendation,  recommendation collapsed should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(true);
        await since('Copy to query from recommendation, refresh disabled should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isRecommendationRefreshDisabled())
            .toBe(true);

        // expand recommendation
        await aiAssistant.expandRecommendation();
        await since('Expand recommendation, collapsed status should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(false);
        await since('Expand recommendation, refresh disabled should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isRecommendationRefreshDisabled())
            .toBe(false);

        // refresh recommendation by refresh icon
        await aiAssistant.refreshRecommendation();
        const text2 = await aiAssistant.getRecommendationText();
        await since('Refresh recommendation, recommendation text should not be #{expected}, while we get #{actual}')
            .expect(text2)
            .not.toBe(text);

        // refresh recommendation by switch page
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await aiAssistant.waitForAIReady();
        const text3 = await aiAssistant.getRecommendationText();
        await since('Switch page, recommendation text should not be #{expected}, while we get #{actual}')
            .expect(text3)
            .not.toBe(text2);

        // refresh recommendation by reset dossier
        await dossierPage.resetDossier();
        await aiAssistant.waitForAIReady();
        const text4 = await aiAssistant.getRecommendationText();
        await since('Reset recommendation, recommendation text should not be #{expected}, while we get #{actual}')
            .expect(text4)
            .not.toBe(text3);

        // send question by recommendation
        await aiAssistant.sendQuestionByRecommendation();
        await aiAssistant.cancelQuestion();
        await aiAssistant.waitForAIReady();
        const text5 = await aiAssistant.getRecommendationText();
        await since(
            'Send question by recommendation, recommendation text should not be #{expected}, while we get #{actual}'
        )
            .expect(text5)
            .not.toBe(text4);

        // collapse recommendation
        await aiAssistant.collapseRecommendation();
        await since('Collapse recommendation, collapsed status should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(true);
        await since('Collapse recommendation, refresh disabled should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isRecommendationRefreshDisabled())
            .toBe(true);
    });

    it('[TC95016_03] Auto Answers E2E - Auto answer general UI ', async () => {
        await resetDossierState({
            credentials: autoAnswerUser,
            dossier: AA_E2E,
        });
        await libraryPage.openDossier(AA_E2E.name);

        // open AI assistant
        await aiAssistant.open();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.sleep(1000);

        // unpin
        await aiAssistant.unpin();
        await aiAssistant.collapseRecommendation(); // to exlude dynamic content when take screenshot
        await takeScreenshotByElement(aiAssistant.getAssistantMainPanel(), 'TC95016_03', 'Unpin Auto Answers');
        // check welcome page should be disappeared after post question
        await aiAssistant.input('show the On-Time for Year 2010');
        await aiAssistant.sendQuestion();
        await since('welcome page present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isWelcomePagePresent())
            .toBe(false);
        //// -- switch TOC
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await since(
            'Unpin, switch TOC, AI assistant present should be pinned should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isAIAssistantPresent())
            .toBe(false);
        await aiAssistant.open();
        await since('Unpin, switch TOC, AA pinned should be pinned should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isAAPinned())
            .toBe(false);
        //// -- reopen dossier
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(AA_E2E.name);
        await aiAssistant.open();
        await since('Unpin, reopen dossier, AA pinned should be pinned should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isAAPinned())
            .toBe(false);

        // pin
        await aiAssistant.pin();
        await aiAssistant.collapseRecommendation(); // to exlude dynamic content when take screenshot
        await takeScreenshotByElement(aiAssistant.getAssistantMainPanel(), 'TC95016_03', 'Pin Auto Answers');

        // -- reset dossier
        await dossierPage.resetDossier();
        await since(
            'Pin, reset dossier, AI assistant present should be pinned should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isAIAssistantPresent())
            .toBe(true);
        //// -- reopen dossier
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(AA_E2E.name);
        await aiAssistant.open();
        await aiAssistant.sleep(1000);
        await since(
            'Pin, reopen dossier, AI assistant present should be pinned should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isAAPinned())
            .toBe(true);

        // maximize
        await aiAssistant.clickMaxMinBtn();
        await aiAssistant.collapseRecommendation(); // to exlude dynamic content when take screenshot
        await aiAssistant.sleep(1000);
        await takeScreenshotByElement(aiAssistant.getAssistantMainPanel(), 'TC95016_03', 'Max Auto Answers');
        await since('Max Auto Answers, AA max status should be pinned should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isAAMaximized())
            .toBe(true);

        // minimize
        await aiAssistant.clickMaxMinBtn();
        await since('Min Auto Answers, AA max status should be pinned should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isAAMaximized())
            .toBe(false);
    });

    // previous auto complete only display all attribute+ metric in current page, now display all attribute + all metric
    it('[TC95016_04] Auto Answers E2E - Auto complete in auto answer ', async () => {
        await resetDossierState({
            credentials: autoAnswerUser,
            dossier: AA_E2E,
        });
        await libraryPage.openDossier(AA_E2E.name);

        // open AI assistant
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Auto Complete - 1' });
        await aiAssistant.openAndPin();

        // attribute: in current page
        await aiAssistant.input('year');
        await since('Input year, auto complete popup present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isSuggestionPresent())
            .toBe(true);
        await since('Input year, auto complete suggestion count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getSuggestionCount())
            .toBe(2);

        // attribute: not in current page
        await aiAssistant.input('d');
        await since('Input d, auto complete suggestion count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getSuggestionCount())
            .toBe(7);
        await aiAssistant.input('day');
        await since('Input day, auto complete suggestion count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getSuggestionCount())
            .toBe(1);

        // metric: in current page
        await aiAssistant.input('flight');
        await since('Input flight, auto complete suggestion count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getSuggestionCount())
            .toBe(3);

        // metric: not in current page
        await aiAssistant.input('number');
        await since('Input number, auto complete present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isSuggestionPresent())
            .toBe(true);

        // alias - viz level
        await aiAssistant.input('viz');
        await since('Input dataset, auto complete present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isSuggestionPresent())
            .toBe(false);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Auto Complete - 2' });
        await aiAssistant.input('viz');
        await since('Input dataset, auto complete count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getSuggestionCount())
            .toBe(1);

        // alias - dataset level
        await aiAssistant.input('dataset');
        await since('Input dataset, auto complete suggestion count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getSuggestionCount())
            .toBe(1);
    });

    it('[TC95016_05] Auto Answers E2E - Interpretation in auto answer ', async () => {
        await resetDossierState({
            credentials: autoAnswerUser,
            dossier: AA_E2E,
        });
        await libraryPage.openDossier(AA_E2E.name);

        // open AI assistant
        await aiAssistant.open();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.sleep(1000);

        // post question by input
        /// -  to make sure the interpretation sql stable on different version, ask question with sql
        await aiAssistant.input('What is the total on-time in year 2010');
        await aiAssistant.sendQuestionAndWaitForAnswer();
        await since('Send question by input, total answers should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.totalAnswers())
            .toBe(1);

        // interpretation
        const initCount = await interpretation.getCIContentsCount();
        await interpretation.generateCIFromLatestAnswer();
        await since('Interpretation, interpretation active should be #{expected}, while we get #{actual}')
            .expect(await interpretation.isLatestCIBtnActive())
            .toBe(true);
        await since('Interpretation, interpretation count should be #{expected}, while we get #{actual}')
            .expect(await interpretation.getCIContentsCount())
            .toBe(initCount + 1);

        // ask again
        const text = await interpretation.getLatestCIText();
        await interpretation.askAgainFromLatestCI();
        await since('Ask agian, the text should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getInputText())
            .toBe(text);
        await aiAssistant.clearInput();

        // copy LLM instructions
        await interpretation.copyLLMFromLatestCI();
        await interpretation.inputByPaste();
        await since('Copy LLM instructions, the text should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getInputText())
            .toBe('SELECT COUNT(`On-Time`) as `On-Time Count` FROM `AutoAnswers_E2E` WHERE `Year@ID`=2010');

        //close interpretation
        const count = await interpretation.getCIContentsCount();
        await interpretation.closeLatestCI();
        await since('Close interpretation, interpretation active should be #{expected}, while we get #{actual}')
            .expect(await interpretation.isLatestCIBtnActive())
            .toBe(false);
        await since('Close interpretation, interpretation panel count should be #{expected}, while we get #{actual}')
            .expect(await interpretation.getCIContentsCount())
            .toBe(count - 1);
    });

    it('[TC95016_06] color theme in auto answer ', async () => {
        // create custom app for color theme
        customAppId_colorTheme = await createCustomApp({
            credentials: autoAnswerUser,
            customAppInfo: darkThemeBody,
        });
        appIdsToDelete.push(customAppId_colorTheme);
        // open custom app
        await libraryPage.openCustomAppById({ id: customAppId_colorTheme });

        // open AI assistant
        await libraryPage.openDossier(AA_E2E.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.openAndPin();

        // chat screenshot
        await aiAssistant.collapseRecommendation(); // to exlude dynamic content when take screenshot
        await takeScreenshotByElement(aiAssistant.getAssistantMainPanel(), 'TC95016_06', 'DarkTheme_Main');

        // tooltip for interpretation
        await aiAssistant.input('what is the total on-time by year');
        await aiAssistant.sendQuestionAndWaitForAnswer();
        await interpretation.generateCIFromLatestAnswer();
        await since('Dark theme, interpretation tooltip should be #{expected}, while we get #{actual}')
            .expect(await interpretation.getTooltipText())
            .toBe('Interpretation');
        await takeScreenshotByElement(interpretation.getLatestCIIcon(), 'TC95016_06', 'DarkTheme_Interpretation');

        // open default application
        await libraryPage.openDefaultApp();
    });

    it('[TC95016_07] I18n in auto answer - Chinese ', async () => {
        // open default application, in case last case failed to back to default app
        await libraryPage.openDefaultApp();

        // switch to chinese user
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.login(autoAnswerUserI18n);

        // open AI assistant
        await libraryPage.openDossier(AA_E2E.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.openAndPin();

        // header text
        await since('Chinese locale, panel header text should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getAssistantHeaderText())
            .toBe('Auto 应答');

        // welcome text
        await since('Chinese locale, welcome text should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getWelcomeText())
            .toBe('您可以询问有关此页面及其相关数据的问题。单击特定的可视化效果以缩小您的查询范围。');

        // button tooltip
        await aiAssistant.hoverLearMoreBtn();
        await since('Chinese locale, learn more tooltip text should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getTooltipText())
            .toBe('详细了解 Auto 应答');

        //recommendation title text
        await since('Chinese locale, recommendation title text should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getRecommendationTitleText())
            .toBe('我猜您可能想要找...');
        // recommendation suggestion text
        await since('Chinese locale, recommendation suggestion text should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isRecommendationListContainsChinese())
            .toBe(true);
        await aiAssistant.collapseRecommendation(); // to exlude dynamic content when take screenshot
        await takeScreenshotByElement(aiAssistant.getAssistantMainPanel(), 'TC95016_07', 'ChineseLolcale_Main');

        // placeholder in textbox
        await since('Chinese locale, placeholder text should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getPlacehoderTextInInputArea())
            .toContain('向我提问');

        // response of AI service
        await aiAssistant.expandRecommendation();
        await aiAssistant.sendQuestionByRecommendation();
        await since('Chinese locale, answers contains chinese should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isLatestAnswerContainsChinese())
            .toBe(true);
    });

    it('[TC95016_08] Auto Answers Copy answer as images', async () => {
        await resetDossierState({
            credentials: autoAnswerUser,
            dossier: AA_E2E,
        });

        await browser.execute(() => {
            navigatorClipboardWriteBackup = navigator.clipboard.write;
            navigator.clipboard.write = async ([clipboardItem]) => {
                // invoke the original navigator.clipboard.write so if it fails we can see the error
                navigatorClipboardWriteBackup([clipboardItem]);

                // get the blob from the clipboard item and download it. we can't get image from
                // clipboard on some automation environments, so we download it then do comparison.
                const blob = await clipboardItem.getType('image/png');
                const link = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.download = 'copiedAnswerImage.png';
                a.href = link;
                a.click();
            };
        });

        await libraryPage.openDossier(AA_E2E.name);

        // open AI assistant
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.openAndPin();

        // for chrome headless mode, copy / paste permission is denied by default, hence below is necessary.
        await browser.setPermissions({ name: 'clipboard-read' }, 'granted');
        await browser.setPermissions({ name: 'clipboard-write' }, 'granted');

        // mock answer text for next question.
        await browser.mockRestoreAll();
        await mockChatResult({ answerText: '[mocked text] 2010 has highest on-time value 151360.' });

        // post question by input
        await aiAssistant.input("What's the highest yearly on-time?");
        await aiAssistant.sendQuestionAndWaitForAnswer();

        // open interpretation and feedback
        await aiAssistant.sleep(1000);
        await mockInterpretationContents(result);
        await interpretation.generateCIFromLatestAnswer();
        const index = await aiAssistant.totalAnswers();
        await aiAssistant.clickThumbDown(index);
        await aiAssistant.waitForElementVisible(aiAssistant.getFeedbackContainer(index));

        // copy image from text answer
        await aiAssistant.copyImageFromLatestAnswer();
        await checkDownloadedImage('copiedAnswerImage', 'TC95016', 'CopiedTextAnswer.png');

        // mock answer text for next question.
        await browser.mockRestoreAll();
        await mockChatResult({ answerText: '[mocked text] here is the heatmap for total on-time of each year.' });
        // post question by input
        await aiAssistant.input('show me a heatmap for total on-time of each year.');
        await aiAssistant.sendQuestionAndWaitForAnswer();

        // copy image from Viz answer
        await aiAssistant.sleep(1000);
        await aiAssistant.copyImageFromLatestAnswer();
        await checkDownloadedImage('copiedAnswerImage', 'TC95016', 'CopiedVizAnswer.png');

        // open focus mode of viz answer, i.e. show viz in a large popup modal.
        await aiAssistant.maximizeChatbotVisualization(0);

        await mockInterpretationContents(result);
        // open interpretation
        await aiAssistant.showInterpretationInVizFocusModal();

        // click copy icon.
        await aiAssistant.copyAsImageInVizFocusModal();
        await checkDownloadedImage('copiedAnswerImage', 'TC95016', 'CopiedVizAnswerInFocusMode.png');
        await aiAssistant.closeChatbotVizFocusModal();

        await browser.execute(() => {
            // restore the original navigator.clipboard.write
            navigator.clipboard.write = navigatorClipboardWriteBackup;
        });
    });

    it('[TC91719] Auto Answers E2E - Sanity auto answer in mobile view', async () => {
        await libraryPage.closeSidebar();
        await setWindowSize({
            browserInstance: browsers.browser1,
            width: 550,
            height: 800,
        });

        await resetDossierState({
            credentials: autoAnswerUser,
            dossier: AA_E2E,
        });

        await libraryPage.openDossier(AA_E2E.name);
        await libraryPage.hamburgerMenu.openAutoAnswersInMobileView();
        await aiAssistant.waitForAIReady();

        // general GUI in mobile view
        await aiAssistant.collapseRecommendation(); // to exlude dynamic content when take screenshot
        await since('Recommendation collapsed state should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(true);
        await takeScreenshotByElement(aiAssistant.getAssistantMainPanel(), 'TC91719_01', 'MobileView_InitialGUI');
        await since('In mobile view, pin icon present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isPinIconPresented())
            .toBe(false);
        await since('In mobile view, max icon present should be pinned should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isMaxMinBtnDisplayed())
            .toBe(false);

        // post question by recommendation
        await aiAssistant.expandRecommendation();
        await aiAssistant.sendQuestionByRecommendation();
        await since('Post question by recommendation, total answer should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.totalAnswers())
            .toBe(1);

        // post question by input
        await aiAssistant.clickFollowUp(1);
        await aiAssistant.inputAndSendQuestion('what are the top 3 total airline On-Time in year 2010, show in grid');
        await since('Post question by recommendation, total answer should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.totalAnswers())
            .toBe(2);

        // action buttons
        await aiAssistant.collapseRecommendation();
        await aiAssistant.hoverAnswer(2);
        //// -- interpretion
        await interpretation.clickCIFromAnswer(2);
        await since('Interpreation, interpretation section visible should be #{expected}, while we get #{actual}')
            .expect(await interpretation.isInterpretationSectionVisible(2))
            .toBe(true);
        //// -- feedback
        await aiAssistant.clickThumbDown(2);
        await since('Thumb down, interpretation section visible should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFeedbackDialogVisible(2))
            .toBe(true);
        //// -- maximize
        await aiAssistant.maximizeLatestChatbotVisualization();
        await since('Maximum, focus modal present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFocuseModalPresent())
            .toBe(true);
        await takeScreenshotByElement(
            aiAssistant.getChatBotVizFocusModalHeader(),
            'TC91719_03',
            'MobileView_FocusMode'
        );
        await aiAssistant.closeChatbotVizFocusModal();

        // clear history
        await aiAssistant.clickClearBtn();
        await aiAssistant.sleep(500); // wait static GUI render before take screenshot
        await takeScreenshotByElement(
            aiAssistant.getClearConfirmationContainer(),
            'TC91719_04',
            'MobileView_ClearHistory'
        );
        await aiAssistant.selectClearConfirmationBtn();

        // close AI assistant
        await libraryPage.hamburgerMenu.closeHamburgerMenu();
        await since('Close AA, AA present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isAIAssistantPresent())
            .toBe(false);
    });
});
