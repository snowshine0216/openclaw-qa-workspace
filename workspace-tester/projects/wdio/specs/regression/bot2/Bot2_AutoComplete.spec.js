import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { deleteBotV2ChatByAPI } from '../../../api/bot2/chatAPI.js';
import { botUser3 } from '../../../constants/bot2.js';
import * as bot from '../../../constants/bot2.js';
import urlParser from '../../../api/urlParser.js';

import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Bot 2.0 Auto Complete', () => {
    const { loginPage, libraryPage, aibotChatPanel, bot2Chat, botConsumptionFrame } = browsers.pageObj1;
    const aibot = {
        id: 'A24864D4AD3F492FBECD1A9D99145098',
        name: 'AUTO_Hide_multiform',
        projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    };
    const aibot_cn = {
        id: '2E3D80E55869407BB72B6412BAB0FD53',
        name: 'AUTO_Chinese_movie',
        projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    };
    const aibot_item = {
        id: '847038F06F484AA7B55BF44A25D7A19E',
        name: 'AUTO_ElementSearch_Item',
        projectId: bot.project_applicationTeam.id,
    };
    const aibot_hrs = {
        id: '89EDF0103D3B4C64A1941401573F39F7',
        name: 'AUTO_ElementSearch_HRS',
        projectId: bot.project_applicationTeam.id,
    };
    const aibot_multiDS = {
        id: 'BC1796860D0C41F1AB06138F6C7F59BD',
        name: 'AUTO_ElementSearch_MultiDS',
        projectId: bot.project_applicationTeam.id,
    };
    const aibot_viewFilter = {
        id: '1BB120CE7DC24B63970D06D31C4593EB',
        name: 'AUTO_ElementSearch_ViewFilter',
        projectId: bot.project_applicationTeam.id,
    };
    const aibot_korean = {
        id: '4D6DF8582E70403EBB7FBE3CBC3988C5',
        name: 'AUTO_Store_Korean',
        projectId: bot.project_applicationTeam.id,
    };
    const aibot_german = {
        id: '82F5B90293214DF3B022588DEB876D66',
        name: 'AUTO_QA_dmTech',
        projectId: bot.project_applicationTeam.id,
    };
    const aibot_universal = {
        id: 'DDE8E8AAED9548DD8A76B86C605DFB86',
        name: 'Auto_Universal_AutoComplete',
        projectId: bot.project_applicationTeam.id,
    };

    const baseUrl = urlParser(browser.options.baseUrl);
    const searchRequest = `${baseUrl}/api/v2/bots/*/nerElements/searches?conversationId=**`;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(botUser3);
        await libraryPage.waitForLibraryLoading();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99018_1] match English and tab ', async () => {
        //clear all chats
        await deleteBotV2ChatByAPI({
            botId: aibot.id,
            projectId: aibot.projectId,
            credentials: botUser3,
        });
        await libraryPage.openBotById({ projectId: aibot.projectId, botId: aibot.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();

        // auto complete profit
        let input = 'p';
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(input);
        await since(`no suggestions for one charactor, suggestion display should be false, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);
        // continue input for profit
        input = 'ro';
        await aibotChatPanel.typeKeyboard(input);
        //check image
        await takeScreenshotByElement(
            await aibotChatPanel.getAutoCompleteArea(),
            'TC99018_1',
            'suggestion displayed with pr prefix columns',
            { tolerance: 0.4 }
        );

        // use up/down to select suggestions
        await aibotChatPanel.navigateUpWithArrow();
        await takeScreenshotByElement(
            await aibotChatPanel.getAutoCompleteArea(),
            'TC99018_1',
            'highlight long name columns'
        );
        await aibotChatPanel.navigateDownWithArrow();
        await aibotChatPanel.tab();

        input = 'by qua';
        await aibotChatPanel.typeKeyboard(input);
        //check image
        await takeScreenshotByElement(
            await aibotChatPanel.getAutoCompleteArea(),
            'TC99018_1',
            'quarter without form shows in suggestion'
        );

        await aibotChatPanel.tab();
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementStaleness(aibotChatPanel.getDisabledNewChatButton());
        const expectedKeywords = 'quarter;profit';
        await since(`Answer should contain expected keywords: ${expectedKeywords}`)
            .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords))
            .toBe(true);
        // ask again
        await aibotChatPanel.copyQuestionToQuery(0);
        await takeScreenshotByElement(
            await aibotChatPanel.getInputBox(),
            'TC99018_1',
            'ask again the strong words in input'
        );
    });

    it('[TC99018_2] match Chinese characters ', async () => {
        //clear all chats
        await deleteBotV2ChatByAPI({
            botId: aibot_cn.id,
            projectId: aibot_cn.projectId,
            credentials: botUser3,
        });
        await libraryPage.openBotById({ projectId: aibot_cn.projectId, botId: aibot_cn.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();

        let input = '排名';
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(input);
        await since(`no suggestions for hidden column, suggestion display should be false, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);

        await aibotChatPanel.clearInputbox();
        input = '什么电';
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(input);
        await takeScreenshotByElement(
            await aibotChatPanel.getAutoCompleteArea(),
            'TC99018_2',
            'suggestion displayed with Chinese charactors'
        );
        await aibotChatPanel.tab();

        input = '有最高的全';
        await aibotChatPanel.typeKeyboard(input);
        await since(`suggestion display should be true, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await aibotChatPanel.tab();
        await takeScreenshotByElement(
            await aibotChatPanel.getInputBox(),
            'TC99018_2',
            'check question with strong words'
        );
        await libraryPage.clickLibraryIcon();
    });

    it('[TC99018_3] hide form ', async () => {
        await libraryPage.openBotById({ projectId: aibot.projectId, botId: aibot.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();

        // category hidden in 2 datasets
        let input = 'cat';
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(input);
        await since(
            `no suggestions for hidden attribute, suggestion display should be false, instead we have #{actual}`
        )
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);
        await aibotChatPanel.clearInputbox();

        // quarter enabled in one dataset, and only one form is there, form won't show
        input = 'qua';
        await aibotChatPanel.typeKeyboard(input);
        await since(`text of attribute name Quarter should be in suggestion, instead we have #{actual}`)
            .expect(await aibotChatPanel.getTextOfAutoCompleteionItem(0))
            .toBe('Quarter');
        await since(`text of attribute name Quarter should be in suggestion, instead we have #{actual}`)
            .expect(await aibotChatPanel.getHighlightedTextOfAutoCompleteionItem(0))
            .toBe('Qua');
        await aibotChatPanel.clearInputbox();

        // Subcategory 2 forms enable in one datasets, one form enable in another datasets, show 2 seperate form
        input = 'Su';
        await aibotChatPanel.typeKeyboard(input);
        await since(`should only display 2 items with ID and DESC in suggestion, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(2);
        await since(`first item in suggestion should be subcategory ID form, instead we have #{actual}`)
            .expect(await aibotChatPanel.getTextOfAutoCompleteionItem(0))
            .toBe('Subcategory (ID)');
        await since(`second item in suggestion should be subcategory DESC form, instead we have #{actual}`)
            .expect(await aibotChatPanel.getTextOfAutoCompleteionItem(1))
            .toBe('Subcategory (DESC)');
        await aibotChatPanel.clearInputbox();

        // matching rule: seperated by space. type Magin, can matching profit margin
        input = 'ma';
        await aibotChatPanel.typeKeyboard(input);
        await since(`text of profit margin should be in suggestion, instead we have #{actual}`)
            .expect(await aibotChatPanel.getTextOfAutoCompleteionItem(0))
            .toBe('Profit Margin renamed to long name');
        await since(`Highlighted word is Ma, instead we have #{actual}`)
            .expect(await aibotChatPanel.getHighlightedTextOfAutoCompleteionItem(0))
            .toBe('Ma');

        // continue typing, matching more characters
        input = 'r';
        await aibotChatPanel.typeKeyboard(input);
        await since(`Highlighted word is Mar, instead we have #{actual}`)
            .expect(await aibotChatPanel.getHighlightedTextOfAutoCompleteionItem(0))
            .toBe('Mar');

        // continue typing, no matching words, suggestion disappear
        input = 'r';
        await aibotChatPanel.typeKeyboard(input);
        await since(`continue typing, suggestion display should be false, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);

        // delete unmached characters, suggestion displayed
        await aibotChatPanel.delete();
        await aibotChatPanel.sleep(1000);
        await since(`suggestion display is true when delete last unmatching char, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`Highlighted word is Mar, instead we have #{actual}`)
            .expect(await aibotChatPanel.getHighlightedTextOfAutoCompleteionItem(0))
            .toBe('Mar');
        await libraryPage.clickLibraryIcon();
    });

    it('[TC99018_4] element search - search basic rule', async () => {
        //// Search on bot consumption mode
        await libraryPage.openBotById({ projectId: aibot_item.projectId, botId: aibot_item.id });
        const getSearchMock = await browser.mock(searchRequest);

        ////// search rule: 'begin with' at least 2 letters
        // input 1 letter, no request sent
        await aibotChatPanel.typeInChatBox('m');
        await since('input 1 letter and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(0);
        await since(`input 1 letter and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);

        // input 2 letters, which in the beginning of the elements, request sent, results displayed
        await aibotChatPanel.typeInChatBox('mu');
        await since('input 2 letter and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(1);
        await since(`input 2 letter and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`input 2 letter and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(6);

        ////  Search on bot authoring mode
        await botConsumptionFrame.clickEditButton();
        // search with element search and local search
        await aibotChatPanel.typeInChatBox('CAT');
        await since('input 3 letter and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(2);
        await since(`input 3 letter and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`input 3 letter and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(7);
        await takeScreenshotByElement(await aibotChatPanel.getInputBox(), 'TC99018_4', 'localSearch+elementSearch');
    });

    it('[TC99018_5] element search - search with different search keywords ', async () => {
        await libraryPage.openBotById({ projectId: aibot_item.projectId, botId: aibot_item.id });
        const getSearchMock = await browser.mock(searchRequest);

        // search with space
        await aibotChatPanel.typeInChatBox(' ');
        await since('input space and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(0);
        await since(`input space and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);

        // search string
        await aibotChatPanel.typeInChatBox('art');
        await since('input string and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(1);
        await since(`input string and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`input string and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(3);

        // search number
        await aibotChatPanel.typeInChatBox('50');
        await since('input number and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(2);
        await since(`input number and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`input number and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(2);

        // search string with space before and after
        await aibotChatPanel.typeInChatBox(' blue ');
        await since('input word around space and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(3);
        await since(
            `input word around space and suggestion list present should be #{expected}, instead we have #{actual}`
        )
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(
            `input word around space and suggestion item count should be #{expected}, instead we have #{actual}`
        )
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(2);

        // search with special chars
        await aibotChatPanel.typeInChatBox('L.A.');
        await since('input special chars and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(4);
        await since(`input special chars and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`input special chars and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(1);

        // search with stopwords
        await aibotChatPanel.typeInChatBox('but');
        await since('input stopwords and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(5);
        await since(`input stopwords and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);

        // search with XSS script
        await aibotChatPanel.typeInChatBox('<script>alert("XSS")</script>');
        await since('input XSS script and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(6);
        await since(`input XSS script and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);
    });

    it('[TC99018_6] element search - search when hide attribute ', async () => {
        await libraryPage.openBotById({ projectId: aibot.projectId, botId: aibot.id });
        const getSearchMock = await browser.mock(searchRequest);

        // search on hidden attribute, no request sent, no suggestion
        await aibotChatPanel.typeInChatBox('movie');
        await since('search on hidden attribute, search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(1);
        await since(`search on hidden attribute and suggestion present should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);

        // search with keyword which exists in hidden attribute and visible attribute, request sent, suggestion displayed
        await aibotChatPanel.typeInChatBox('books');
        await since('search books and search request count should be #{expected}, instead  we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(2);
        await since(`search books and suggestion present should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`search books and suggestion item count should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(1);
    });

    it('[TC99018_7] element search - search elements among different dataset ', async () => {
        // elements from different attributes within one dataset
        await libraryPage.editBotByUrl({ projectId: aibot_hrs.projectId, botId: aibot_hrs.id });
        const getSearchMock1 = await browser.mock(searchRequest);
        await aibotChatPanel.typeInChatBox('matias ravizzoli');
        await since(
            'search matias from multi attributes and search request count should be #{expected}, instead  we have #{actual}'
        )
            .expect(getSearchMock1.calls.length)
            .toBe(1);
        await since(
            `search matias from multi attributes and suggestion present should be #{expected}, while we get #{actual}`
        )
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(
            `search matias from multi attributes and suggestion item count should be #{expected}, while we get #{actual}`
        )
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(3);
        await takeScreenshotByElement(await aibotChatPanel.getAutoCompleteArea(), 'TC99018_7', 'elements_from_HRS', {
            tolerance: 2.0,
        });

        // elements from same attribute from different datasets
        await libraryPage.editBotByUrl({ projectId: aibot_multiDS.projectId, botId: aibot_multiDS.id });
        const getSearchMock2 = await browser.mock(searchRequest);
        await aibotChatPanel.typeInChatBox('books');
        await since('search books and search request count should be #{expected}, instead  we have #{actual}')
            .expect(getSearchMock2.calls.length)
            .toBe(1);
        await since(`search books and suggestion present should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`search books and suggestion item count should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(2);
        await takeScreenshotByElement(await aibotChatPanel.getAutoCompleteArea(), 'TC99018_7', 'elements_from_MultiDS');

        // local search + element search from different datasets
        await aibotChatPanel.typeInChatBox('ca');
        await since('search books and search request count should be #{expected}, instead  we have #{actual}')
            .expect(getSearchMock2.calls.length)
            .toBe(2);
        await since(`search books and suggestion present should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`search books and suggestion item count should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(5);
        await takeScreenshotByElement(
            await aibotChatPanel.getAutoCompleteArea(),
            'TC99018_7',
            'elements_from_MultiDS_allSearch'
        );
    });

    it('[TC99018_8] element search - search on attributes with view filter ', async () => {
        await libraryPage.openBotById({ projectId: aibot_viewFilter.projectId, botId: aibot_viewFilter.id });
        const getSearchMock = await browser.mock(searchRequest);

        // search on attribute whose view filters is created in subset report
        await aibotChatPanel.typeInChatBox('20');
        await since('input 20 and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(1);
        await since(`input 20 and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`input 20 and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(4);

        // search on attribute whose security filter is created in cube
        await aibotChatPanel.typeInChatBox('movie');
        await since('input movie and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(2);
        await since(`input movie and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);
        await aibotChatPanel.typeInChatBox('book');
        await since('input book and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(3);
        await since(`input book and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`input book and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(1);
    });

    it('[TC99018_9] element search - search with Chinese ', async () => {
        ///// chinese use contains, and start to search from 1 charactor
        await libraryPage.openBotById({ projectId: aibot_cn.projectId, botId: aibot_cn.id });
        const getSearchMock = await browser.mock(searchRequest);

        // start to search from 1 charactor
        await aibotChatPanel.typeInChatBox('星');
        await since('input 星 and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(1);
        await since(`input 星 and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`input 星 and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(7);

        // use contains instead of start with to match on Chinese
        await aibotChatPanel.typeInChatBox('前传');
        await since('input 前传 and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(2);
        await since(`input 前传 and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`input 前传 and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(4);

        // chinese word segmentation
        await aibotChatPanel.typeInChatBox('英雄归来');
        await since('input 英雄归来 and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(3);
        await since(`input 英雄归来 and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`input 英雄归来 and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(3);
    });

    it('[TC99018_10] element search - search with Korean ', async () => {
        await libraryPage.openBotById({ projectId: aibot_korean.projectId, botId: aibot_korean.id });
        const getSearchMock = await browser.mock(searchRequest);

        // start to search from 1 charactor
        await aibotChatPanel.typeInChatBox('서');
        await since('input Korean and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(1);
        await since(`input Korean and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`input Korean and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(4);

        // search with at least 2 charactors
        await aibotChatPanel.typeInChatBox('서울');
        await since('input Korean and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(2);
        await since(`input Korean and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`input Korean and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(4);
        await takeScreenshotByElement(await aibotChatPanel.getAutoCompleteArea(), 'TC99018_10', 'korean_suggestion');

        // search with contains keywords
        await aibotChatPanel.typeInChatBox('마포구');
        await since('input Korean and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(3);
        await since(`input Korean and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`input Korean and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(1);
    });

    it('[TC99018_11] element search - search with diacritic languages : German, Russia ', async () => {
        await libraryPage.openBotById({ projectId: aibot_german.projectId, botId: aibot_german.id });
        const getSearchMock = await browser.mock(searchRequest);

        // keyword: german
        await aibotChatPanel.typeInChatBox('Ernährung');
        await since('input German and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(1);
        await since(`input German and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`input German and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(1);

        // keyword: russian
        await aibotChatPanel.typeInChatBox('Медовый');
        await since('input Russian and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(2);
        await since(`input Russian and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`input Russian and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(1);
    });

    it('[TC99018_12] universal bot - different search keywords', async () => {
        await libraryPage.openBotById({ projectId: aibot_universal.projectId, botId: aibot_universal.id });
        const getSearchMock = await browser.mock(searchRequest);

        // search string
        await aibotChatPanel.typeInChatBox('co');
        await since('input string and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(1);
        await since(`input string and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`input string and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(6);

        // search number & time
        await aibotChatPanel.typeInChatBox('2020');
        await since('input number and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(2);
        await since(`input number and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`input number and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(3);

        // search with korean
        await aibotChatPanel.typeInChatBox('서울');
        await since('input Korean and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(3);
        await since(`input Korean and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`input Korean and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(4);

        // search with chinese
        await aibotChatPanel.typeInChatBox('演员');
        await since('input Chinese and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(4);
        await since(`input Chinese and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`input Chinese and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(5);
    });

    it('[TC99018_13] universal bot - search hidden attribute and metrics', async () => {
        await libraryPage.openBotById({ projectId: aibot_universal.projectId, botId: aibot_universal.id });
        const getSearchMock = await browser.mock(searchRequest);

        // search hidden attribute
        await aibotChatPanel.typeInChatBox('Year');
        await since('input hidden attribute and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(1);
        await since(`input hidden attribute and list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);
        await aibotChatPanel.typeInChatBox('排名');
        await since(
            'input hidden attribute element and search request count should be #{expected}, instead we have #{actual}'
        )
            .expect(getSearchMock.calls.length)
            .toBe(2);
        await since(`input hidden attribute element and list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);

        // search hidden metric
        await aibotChatPanel.typeInChatBox('cost');
        await since(`input hidden metric and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);
    });

    it('[TC99018_14] universal bot - search when sub bot is inactive', async () => {
        await libraryPage.openBotById({ projectId: aibot_universal.projectId, botId: aibot_universal.id });
        const getSearchMock = await browser.mock(searchRequest);

        // type @ to trigger sub bot list
        await aibotChatPanel.typeInChatBox('@');
        await since(`type @ and sub bot list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`type @ and sub bot list item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(3);

        // search attribute and metric in inactive bot
        await aibotChatPanel.typeInChatBox('air');
        await since('input attribute and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(1);
        await since(`input attribute and list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);
        await aibotChatPanel.typeInChatBox('flights');
        await since('input metric and search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(2);
        await since(`input metric and list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);
    });

    it('[TC99018_15] universal bot - @sub bot to search', async () => {
        const subBot = 'Auto_SubBot_OLAP_EnableNER';
        await libraryPage.openBotById({ projectId: aibot_universal.projectId, botId: aibot_universal.id });
        const getSearchMock = await browser.mock(searchRequest);

        // @sub bot
        await aibotChatPanel.typeKeyboard(`@${subBot}`);
        await since(`type @ and sub bot list item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(1);
        await aibotChatPanel.tab();

        // search in sub bot
        await aibotChatPanel.typeKeyboard('co');
        await since('search request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(2);
        await since(`auto complete present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`auto complete item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(3);

        await aibotChatPanel.typeKeyboard(' add');
        await since('search other bot attribute and request count should be #{expected}, instead we have #{actual}')
            .expect(getSearchMock.calls.length)
            .toBe(3);
        await since(
            `search other bot attribute and auto complete present should be #{expected}, instead we have #{actual}`
        )
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);
    });
});
