import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { chatPanelUser, conEduProId } from '../../../constants/bot.js';
import { checkScreenByImageComparison } from '../../../utils/TakeScreenshot.js';

describe('Chat Panel Ask Question History Scroll', () => {
    const aibot = {
        id: '2769A7191147D57B6BC1F28BD1710AB3',
        name: '16. Ask Question History Scroll',
    };

    let { loginPage, libraryPage, aibotChatPanel } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(chatPanelUser);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibot.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
    });

    it('[TC92549_2] After scroll, position does not change when the answer load out', async () => {
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(2));
        await aibotChatPanel.clickRecommendationByIndex(2);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('List all countries with their fertility rates.');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.scrollChatPanelToTop();
        await browser.waitUntil(
            async () => {
                return (await aibotChatPanel.getCountOfTextAnswer()) === 2;
            },
            {
                timeout: 30000,
                timeoutMsg: 'Recommendation not exist',
            }
        );
        await checkScreenByImageComparison(
            'dashboardctc/ChatPanel/TC92549_2',
            'Position does not change when the answer load out'
        );
    });

    it('[TC92549_4] incrementally load chat history', async () => {
        //Test incrementally load chat history
        for (let i = 0; i < 8; i++) {
            await aibotChatPanel.getInputBox().click();
            await aibotChatPanel.typeKeyboard('List all countries with their fertility rates.');
            await aibotChatPanel.clickSendIcon();
            await aibotChatPanel.waitForAnswerLoading();
        }
        await aibotChatPanel.goToLibrary();
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibot.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since('The amount of answer is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getCountOfTextAnswer())
            .toBe(2);
        await since('The amount of question is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getQueryCount())
            .toBe(1);
        await aibotChatPanel.scrollChatPanelToTop();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTextAnswerByIndex(2));
        await since(
            'Scroll to incremental load1 the amount of answer is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getCountOfTextAnswer())
            .toBe(3);
        await since(
            'Scroll to incremental load1 the amount of question is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getQueryCount())
            .toBe(3);
        await aibotChatPanel.scrollChatPanelToTop();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTextAnswerByIndex(4));
        await since(
            'Scroll to incremental load2 the amount of answer is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getCountOfTextAnswer())
            .toBe(5);
        await since(
            'Scroll to incremental load2 the amount of question is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getQueryCount())
            .toBe(4);
    });

    afterEach(async () => {
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        await aibotChatPanel.goToLibrary();
    });
});
