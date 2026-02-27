import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { deleteBotV2ChatByAPI } from '../../../api/bot2/chatAPI.js';
import * as bot from '../../../constants/bot2.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { clearBotV2SnapshotsByAPI } from '../../../api/bot2/snapshotAPI.js';

describe('Bot 2.0 Feedback', () => {
    const { loginPage, libraryPage, aibotChatPanel, aibotSnapshotsPanel, snapshotDialog, bot2Chat, historyPanel } =
        browsers.pageObj1;

    const aibot = {
        id: '82F5B90293214DF3B022588DEB876D66',
        name: 'AUTO_QA_dmTech',
        projectId: bot.project_applicationTeam.id,
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(bot.botUser3);
        await libraryPage.waitForLibraryLoading();
    });

    beforeEach(async () => {
        // clear chats
        await deleteBotV2ChatByAPI({
            botId: aibot.id,
            projectId: aibot.projectId,
            credentials: bot.botUser3,
        });
        // clear snapshots
        await clearBotV2SnapshotsByAPI({
            projectId: aibot.projectId,
            botId: aibot.id,
            credentials: bot.botUser3,
        });
        await libraryPage.openBotById({ projectId: aibot.projectId, botId: aibot.id });
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
    });

    afterAll(async () => {
        // clear chats
        await deleteBotV2ChatByAPI({
            botId: aibot.id,
            projectId: aibot.projectId,
            credentials: bot.botUser3,
        });
        // clear snapshots
        await clearBotV2SnapshotsByAPI({
            projectId: aibot.projectId,
            botId: aibot.id,
            credentials: bot.botUser3,
        });
        await logoutFromCurrentBrowser();
    });

    it('[TC99026_01] Feedback - Thumb up', async () => {
        const question = 'list the menge by land';

        // thumb up
        await aibotChatPanel.askQuestion(question, true);
        await aibotChatPanel.hoverOnLatestAnswer();
        await since(`Hover and thumb up button present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getThumbUpIconbyIndex(0).isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            aibotChatPanel.getAnswerBubbleButtonIconContainerbyIndex(0),
            'TC99026_01',
            'ThumbUp_ActionBar'
        );
        await aibotChatPanel.thumbUpByIndex(0);
        await aibotChatPanel.sleep(500);
        await takeScreenshotByElement(
            aibotChatPanel.getAnswerBubbleButtonIconContainerbyIndex(0),
            'TC99026_01',
            'ThumbUp_Checked'
        );

        // snapshot view
        await aibotChatPanel.takeSnapshot(0);
        await aibotChatPanel.openSnapshot();
        await takeScreenshotByElement(
            aibotSnapshotsPanel.getSnapshotActionBar(0),
            'TC99026_01',
            'ThumbUp_SnapshotView'
        );

        // focus view
        await aibotSnapshotsPanel.clickMaximizeButton(0);
        await takeScreenshotByElement(snapshotDialog.getSnapshotDialogActionBar(), `TC99026_01`, 'ThumbUp_FocusView');
        await aibotSnapshotsPanel.clickCloseFocusViewButton();
    });

    it('[TC99026_02] Feedback - Thumb down', async () => {
        const question = 'list the menge by monat';

        await aibotChatPanel.askQuestion(question, true);
        await aibotChatPanel.hoverOnLatestAnswer();
        await aibotChatPanel.thumbDownByIndex(0);
        await since(`Thumb down and feedback panel present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getFeedbackPanel(0).isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(aibotChatPanel.getFeedbackPanel(0), 'TC99026_02', 'ThumbDown_feedbackPanel');
        await aibotChatPanel.clickFeedbackCloseButtonbyIndex(0);
        await since(`close thumb down and feedback panel present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getFeedbackPanel(0).isDisplayed())
            .toBe(false);
        await aibotChatPanel.sleep(500);
        await takeScreenshotByElement(
            aibotChatPanel.getAnswerBubbleButtonIconContainerbyIndex(0),
            'TC99026_02',
            'ThumbDown_Checked'
        );

        // snapshot view
        await aibotChatPanel.takeSnapshot(0);
        await aibotChatPanel.openSnapshot();
        await takeScreenshotByElement(
            aibotSnapshotsPanel.getSnapshotActionBar(0),
            'TC99026_02',
            'ThumbDown_SnapshotView'
        );

        // focus view
        await aibotSnapshotsPanel.clickMaximizeButton(0);
        await takeScreenshotByElement(snapshotDialog.getSnapshotDialogActionBar(), `TC99026_02`, 'ThumbDown_FocusView');
        await aibotSnapshotsPanel.clickCloseFocusViewButton();
    });

    it('[TC99026_03] Feedback - Different response when thumb down', async () => {
        const question = 'list the menge by monat';
        const feedback_type = 'Response speed';
        const feedback_text = 'For Testing: The answer is not relevant to my question';
        const feedback_result = 'Thanks for your feedback'

        // thumb down -> select predefined type
        await aibotChatPanel.askQuestion(question, true);
        await aibotChatPanel.thumbDownByIndex(0);
        await since(`click thumb down and feedback panel present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getFeedbackPanel(0).isDisplayed())
            .toBe(true);
        await aibotChatPanel.clickFeedbackTabByName(feedback_type);
        await takeScreenshotByElement(aibotChatPanel.getFeedbackPanel(0), 'TC99026_03', 'ThumbDown_selectType');
        await aibotChatPanel.clickFeedbackSubmitButton();
        await since(`submit thumb down and feedback panel present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getFeedbackPanel(0).isDisplayed())
            .toBe(false);

        // thumb down -> input feedback
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.askQuestion(question, true);
        await aibotChatPanel.thumbDownByIndex(0);
        await since(`click thumb down and feedback panel present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getFeedbackPanel(0).isDisplayed())
            .toBe(true);
        await aibotChatPanel.inputFeedbackContents(feedback_text);
        await aibotChatPanel.clickFeedbackSubmitButton();
        await since(`submit thumb down and feedback panel present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getFeedbackPanel(0).isDisplayed())
            .toBe(false);
        await since('Feedback result should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getFeedbackResultsText(0))
            .toContain(feedback_result);
    });
});
