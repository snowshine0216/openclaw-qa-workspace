import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { chatPanelUser, conEduProId } from '../../../constants/bot.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';

describe('ChatPanelMultiWordMatching', () => {
    const aibot = {
        id: 'C748A8D9E24F3E7CF35D8AA5AE090677',
        name: '36. MultiWord_Matching',
    };

    let { loginPage, libraryPage, aibotChatPanel } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(chatPanelUser);
        await setWindowSize(browserWindow);
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibot.id });
    });

    beforeEach(async () => {
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
    });

    it('[TC96757_1] ai bot suggestion panel _ multi word replacement', async () => {
        let inputQuestion = 'Give me a brief information about m n';
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(inputQuestion);
        await checkElementByImageComparison(
            aibotChatPanel.getAutoCompleteArea(),
            'dashboardctc/ChatPanel/TC96757_1',
            'Multi word replacement - double matching panel'
        );
        await aibotChatPanel.navigateUpWithArrow();
        await checkElementByImageComparison(
            aibotChatPanel.getAutoCompleteArea(),
            'dashboardctc/ChatPanel/TC96757_1',
            'Multi word replacement - change selection'
        );
        await aibotChatPanel.tab();
        await checkElementByImageComparison(
            aibotChatPanel.getInputBoxContainer(),
            'dashboardctc/ChatPanel/TC96757_1',
            'Multi word replacement - make selection'
        );
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await checkElementByImageComparison(
            aibotChatPanel.getQueryByIndex(0),
            'dashboardctc/ChatPanel/TC96757_1',
            'Multi word replacement - sent question'
        );
    });

    it('[TC96757_2] ai bot suggestion panel _ single word replacement', async () => {
        let inputQuestion = 'Give me a brief information about nt - w';
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(inputQuestion);
        await aibotChatPanel.navigateUpWithArrow(3);
        await checkElementByImageComparison(
            aibotChatPanel.getAutoCompleteArea(),
            'dashboardctc/ChatPanel/TC96757_2',
            'Single word replacement - change selection'
        );
        await aibotChatPanel.tab();
        await checkElementByImageComparison(
            aibotChatPanel.getInputBoxContainer(),
            'dashboardctc/ChatPanel/TC96757_2',
            'Single word replacement - make selection'
        );
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await checkElementByImageComparison(
            aibotChatPanel.getQueryByIndex(0),
            'dashboardctc/ChatPanel/TC96757_2',
            'Single word replacement - sent question'
        );
    });

    it('[TC96757_3] ai bot suggestion panel _ directly press enter', async () => {
        let inputQuestion = 'Give me brief summary about m n';
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(inputQuestion);
        await since('AutoCompleteArea display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await aibotChatPanel.enter();
        await aibotChatPanel.waitForAnswerLoading();
        await since('AutoCompleteArea display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);
        await since('Input question display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getQueryTextByIndex(0))
            .toBe(inputQuestion);
    });

    it('[TC96757_4] ai bot suggestion panel _ delete characters', async () => {
        let inputQuestion = 'Give me a brief introduction about From Petroluem';
        let completedQuestion = 'Give me a brief introduction about From Petroleum ';
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(inputQuestion);
        await since('AutoCompleteArea display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);
        await aibotChatPanel.deleteByTimes(3);
        await since('AutoCompleteArea display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since('Text of first row is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getTextOfAutoCompleteionItem(1))
            .toBe('From Petroleum');
        await since('Highlighted part of first row is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getHighlightedTextOfAutoCompleteionItem(1))
            .toBe('From Petrol');
        // Click on element
        await aibotChatPanel.getAutoCompleteItembyIndex(1).click();
        await since('Input box text is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getInputBoxText())
            .toBe(completedQuestion);
        await since('AutoCompleteArea display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.scrollChatPanelToTop();
        await since('Input question display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getQueryTextByIndex(0))
            .toBe(completedQuestion);
    });

    it('[TC96757_5] ai bot suggestion panel _ paste and then type space', async () => {
        let inputQuestion = 'Give me a brief introduction about nt';
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.askQuestionByPasteWithoutSending(inputQuestion);
        await since('AutoCompleteArea display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);
        await aibotChatPanel.space();
        await aibotChatPanel.sleep(1000); // wait auto-complete panel to refresh
        await since('AutoCompleteArea display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since('Text of first row is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getTextOfAutoCompleteionItem(0))
            .toContain('Count');
        await since('Highlighted part of first row is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getHighlightedTextOfAutoCompleteionItem(0))
            .toBe('nt');
        await aibotChatPanel.getWelcomePageBotImage().click();
        await since(
            'AutoCompleteArea display after clicking outside the panel is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);
        await aibotChatPanel.clearInputbox();
        await since(
            'AutoCompleteArea display after deleting all text is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);
    });

    it('[TC96757_6] ai bot suggestion panel _ delete whole token', async () => {
        let inputQuestion = 'Give me a brief introduction about nt net ch';
        let completedQuestion1 = 'Give me a brief introduction about nt Net Change ';
        let completedQuestion2 = 'Give me a brief introduction about nt';
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(inputQuestion);
        await since('AutoCompleteArea display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since('Text of first row is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getTextOfAutoCompleteionItem(1))
            .toBe('Net Change');
        await since('Highlighted part of first row is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getHighlightedTextOfAutoCompleteionItem(1))
            .toBe('Net Ch');
        await aibotChatPanel.tab();
        await since(
            'AutoCompleteArea display after tab to select element is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);
        await since('Input box text is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getInputBoxText())
            .toBe(completedQuestion1);
        await aibotChatPanel.deleteByTimes(3);
        await since('AutoCompleteArea display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since('Text of first row is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getTextOfAutoCompleteionItem(4))
            .toBe('Country');
        await since('Highlighted part of first row is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getHighlightedTextOfAutoCompleteionItem(4))
            .toBe('nt');
        await since('Input box text is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getInputBoxText())
            .toBe(completedQuestion2);
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await since('AutoCompleteArea display after sending is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);
    });

    it('[TC96757_7] ai bot suggestion panel _ truncated element', async () => {
        let inputQuestion = '.xls';
        let completedQuestion = 'Row Count - Worldwide-CO2-Emissions.xls ';
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(inputQuestion);
        await checkElementByImageComparison(
            aibotChatPanel.getAutoCompleteArea(),
            'dashboardctc/ChatPanel/TC96757_7',
            'Truncated Element - initial panel'
        );
        await aibotChatPanel.navigateUpWithArrow();
        await checkElementByImageComparison(
            aibotChatPanel.getAutoCompleteArea(),
            'dashboardctc/ChatPanel/TC96757_7',
            'Truncated Element - change selection'
        );
        await aibotChatPanel.tab();
        await since('Input box text is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getInputBoxText())
            .toBe(completedQuestion);
        await aibotChatPanel.deleteByTimes(2);
        await since('AutoCompleteArea display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);
    });

    afterEach(async () => {
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
    });
});
