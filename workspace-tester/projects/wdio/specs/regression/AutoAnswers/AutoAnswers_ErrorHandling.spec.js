import setWindowSize from '../../../config/setWindowSize.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { errorHandlingUser } from '../../../constants/autoAnswer.js';
import {
    mockAlternativeSuggestionsIgnoreError,
    mockAmbiguousAndFollowUpResponse,
    mockRelatedSuggestion,
    mockInterpretationContents,
} from '../../../api/mock/mock-response-utils.js';

describe('Error cases and defects for Auto Answers', () => {
    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const AA_NotInMyLibrary = {
        id: 'E3869891F74DC939802B54A83856A119',
        name: 'AutoAnswers_NotAddedToMyLibrary',
        project,
    };

    const AA_ErrorHandling = {
        id: '67C1B20C37403CC79E982291F7AAF491',
        name: 'AutoAnswers_GDC',
        project,
    };

    const AA_AutoRefresh = {
        id: '48A9612AF24835C4CAD2A1B1D26217D9',
        name: 'AutoAnswers_AutoRefresh',
        project,
    };

    const AA_MaxDataPoints = {
        id: 'CD17587A2D4DE0CFD3BA53A3F4A9A059',
        name: 'AutoAnswers_MaxDataPoints',
        project,
    };

    const AA_XSS = {
        id: '3BA8691243948BC383D5F0BC3B71D1FE',
        name: 'AutoAnswers_XSS',
        project,
    };

    const checkRequestCount = async (requestMock, expectedCount) => {
        await browser.waitUntil(
            async () => {
                return requestMock.calls.length > 0 || requestMock.calls.length === expectedCount;
            },
            {
                timeout: 60000,
                timeoutMsg: 'No request is caught in 60000ms',
            }
        );
        return requestMock.calls.length === expectedCount;
    };

    const {
        loginPage,
        dossierPage,
        libraryPage,
        toc,
        aiAssistant,
        interpretation,
        inCanvasSelector,
        quickSearch,
        fullSearch,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(errorHandlingUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    // token expired, narrow down cases
    // viz context
    it('[TC95282_01] DE273584 viz context handle during retry', async () => {
        const dossierChatAssistant = {
            id: 'B1F4D6EC4F0CD1C39E723E87A030401B',
            dossier_name: 'Intelligence Center Dossier_modified',
            project,
        };
        await resetDossierState({
            credentials: errorHandlingUser,
            dossier: dossierChatAssistant,
        });
        await libraryPage.openDossier(dossierChatAssistant.dossier_name);
        // switch to page1
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        // open auto answer panel and pin
        await aiAssistant.openAndPin();
        // choose viz context
        let vizContext = 'Target';
        await aiAssistant.selectViz(vizContext);
        // post question by input
        await aiAssistant.input('list the account types in the selected visualization');
        await aiAssistant.sendQuestionAndWaitForAnswer();
        // generate interpretation
        await interpretation.generateCIFromLatestAnswer();
        // verfify interpretation text should contain viz info
        await since('Content in interpretation should be #{expected}, while we get #{actual}')
            .expect(await interpretation.getContentInComponents())
            .toEqual('TargetAccount Type');
    });

    // other client issues
    it('[TC95282_04] DE272158 when openning auto answer in the dossier that with empty dataset, the dossier will turn to be blank', async () => {
        const dossierChatAssistant = {
            id: 'BCFD15501D455F42D746FE9B78322335',
            dossier_name: 'Auto Answer Empty Dossier',
            project,
        };
        await resetDossierState({
            credentials: errorHandlingUser,
            dossier: dossierChatAssistant,
        });
        await libraryPage.openDossier(dossierChatAssistant.dossier_name);
        await aiAssistant.openAndPin();
        await aiAssistant.close();
    });

    it('[TC95282_05] DE274096 consolidation attribute type should be correctly recognized', async () => {
        const dossierChatAssistant = {
            id: '257ED874374056BF3BE71695432DBF53',
            dossier_name: 'Demo_DE_CG_CONSOLIDATION',
            project,
        };
        await resetDossierState({
            credentials: errorHandlingUser,
            dossier: dossierChatAssistant,
        });
        await libraryPage.openDossier(dossierChatAssistant.dossier_name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.openAndPin();
        // ask question against custom group attribute
        await aiAssistant.inputAndSendQuestion('show me the Custom Categories whose cost is the highest');
        await since('The answer should contanis one of the keywords should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isAnswerContainsOneOfKeywords(['Category Sales']))
            .toBe(true);
        // ask question against derived attribute
        await aiAssistant.sendQuestionWithTextAndObject([
            { content: 'the ', type: 'text' },
            { content: 'Group', type: 'object' },
            { content: 'with Cost higher than 2000000', type: 'text' },
        ]);
        await since('The answer should contanis one of the keywords should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isAnswerContainsOneOfKeywords(['Others', 'highest']))
            .toBe(true);
        // ask question against consolication attribute
        await aiAssistant.sendQuestionWithTextAndObject([
            { content: 'show me the ', type: 'text' },
            { content: 'Seasons', type: 'object' },
        ]);
        await since('The answer should contanis one of the keywords should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isAnswerContainsOneOfKeywords(['Winter', 'Season']))
            .toBe(true);
    });

    it('[TC95282_06] DE274407 existing metric limit lost when appending view filter ', async () => {
        const dossierChatAssistant = {
            id: '0A1F1C5D4DB6069358E4F0BFF4AB54D4',
            dossier_name: '04_CopyExistingViz',
            project,
        };
        await resetDossierState({
            credentials: errorHandlingUser,
            dossier: dossierChatAssistant,
        });
        await libraryPage.openDossier(dossierChatAssistant.dossier_name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'DE274407' });
        await aiAssistant.openAndPin();
        await aiAssistant.selectViz('Visualization 1');
        await aiAssistant.input('show me the Supplier with Revenue higher than 200');
        await aiAssistant.sendQuestionAndWaitForAnswer();
        // verify 'BMG', 'Virgin Records' should be filtered
        await since('The answer should contanis one of the keywords should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isAnswerContainsOneOfKeywords(['BMG', 'Virgin Records']))
            .toBe(false);
        await aiAssistant.input("show me the Revenue of Supplier 'BMG' ");
        await aiAssistant.sendQuestionAndWaitForAnswer();
        await since('The answer should contanis one of the keywords should be #{expected}, while we get #{actual}')
            .expect(
                await aiAssistant.isAnswerContainsOneOfKeywords([
                    'applied filter excludes all data',
                    'no data',
                    'no revenue data',
                    'no available data',
                ])
            )
            .toBe(true);
    });

    //this defect is about the request quene from client to iserver side
    it('[TC95282_07] DE271989 do manipulation after sending question', async () => {
        const dossierChatAssistant = {
            id: '892F6232344FB2B91359B5ABE56ACCF8',
            dossier_name: 'Retail DC General Store-defect',
            project,
        };
        await resetDossierState({
            credentials: errorHandlingUser,
            dossier: dossierChatAssistant,
        });
        await libraryPage.openDossier(dossierChatAssistant.dossier_name);
        await toc.openPageFromTocMenu({ chapterName: 'Store Comparison', pageName: 'Details' });
        await aiAssistant.openAndPin();
        // send question and don't wait for answer
        await aiAssistant.input('list the Category with highest Revenue');
        await aiAssistant.sendQuestion();
        // do manipulations after sending question
        await inCanvasSelector.multiSelect([
            'Fargo',
            'Atlanta',
            'Charleston',
            'Boston',
            'Memphis',
            'Miami',
            'Milwaukee',
        ]);
        await dossierPage.clickUndo();
        // check answer should be correct
        await aiAssistant.waitTillAnswerAppears();
        await since('The answer should contanis one of the keywords should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isAnswerContainsOneOfKeywords(['Electronics']))
            .toBe(true);
        // check no error dialog
        await expect(await dossierPage.isErrorPresent()).toBe(false);
    });

    it('[TC95282_08] DE273580 Invalid template unit key error for view filter cases ', async () => {
        const dossierChatAssistant = {
            id: '0A1F1C5D4DB6069358E4F0BFF4AB54D4',
            dossier_name: '04_CopyExistingViz',
            project,
        };
        await resetDossierState({
            credentials: errorHandlingUser,
            dossier: dossierChatAssistant,
        });
        await libraryPage.openDossier(dossierChatAssistant.dossier_name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.openAndPin();
        await aiAssistant.input('create grid to show me the Month with Cost higher than 4500000');
        await aiAssistant.sendQuestionAndWaitForAnswer();
        await aiAssistant.input('create barchart to show me the Month with Cost higher than 4500000');
        await aiAssistant.sendQuestionAndWaitForAnswer();
        await since('The answer should contanis one of the keywords should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isAnswerContainsOneOfKeywords(['Nov', 'November']))
            .toBe(true);
        await aiAssistant.waitForAIReady();
        await aiAssistant.sleep(300);
        await aiAssistant.selectViz('ICS targeted + ViewFilter+VizFilter');
        await aiAssistant.input('show me the Month with Cost less than 200000');
        await aiAssistant.sendQuestionAndWaitForAnswer();
        await since('The answer should contanis one of the keywords should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isAnswerContainsOneOfKeywords(['Nov', 'November']))
            .toBe(true);
        await aiAssistant.deleteContext();
    });

    it('[TC95282_09] DE280326_refresh instance after rbd error', async () => {
        const dossierChatAssistant = {
            id: '257ED874374056BF3BE71695432DBF53',
            dossier_name: 'Demo_DE_CG_CONSOLIDATION',
            project,
        };
        await resetDossierState({
            credentials: errorHandlingUser,
            dossier: dossierChatAssistant,
        });
        await libraryPage.openDossier(dossierChatAssistant.dossier_name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.openAndPin();
        const refreshRequestMock = await browser.mock('**/refresh');
        await aiAssistant.input('show the count of Custom Categories');
        await aiAssistant.sendQuestion();
        //check refresh request is sent when meeting rdb error
        await since('Reresh request send should be #{expected}, while we get #{actual}')
            .expect(await checkRequestCount(refreshRequestMock, 1))
            .toBe(true);
        // wait for answer to appear
        await aiAssistant.waitTillAnswerAppears();
        // ask again after refresh
        await aiAssistant.input('use barchart to show me the Cost with Custom Categories');
        await aiAssistant.sendQuestionAndWaitForAnswer();
        await since('The answer should contanis one of the keywords should be #{expected}, while we get #{actual}')
            .expect(
                await aiAssistant.isAnswerContainsOneOfKeywords(['Category Sales', 'Bottom 3 Suppliers by Revenue'])
            )
            .toBe(true);
    });

    it('[TC95282_10] Cancel handling case', async () => {
        const dossierChatAssistant = {
            id: 'E7B15D236449AB345EDFFA8691569DB2',
            dossier_name: 'AutoAnswers_E2E',
            project,
        };
        await resetDossierState({
            credentials: errorHandlingUser,
            dossier: dossierChatAssistant,
        });
        await libraryPage.openDossier(dossierChatAssistant.dossier_name);
        // open AI assistant
        await aiAssistant.openAndPin();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.sleep(1000);
        // cancel the qeustion before answer back
        await aiAssistant.input('what is the On-Time airline by year');
        await aiAssistant.sendQuestion();
        await aiAssistant.cancelQuestion();
        await since('Cancel question, total answers should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.totalAnswers())
            .toBe(0);
        // ask again after cancel
        await aiAssistant.input('what is the total On-Time airline');
        await aiAssistant.sendQuestionAndWaitForAnswer();
        // random missing thousand seperator due to aiservice issue DE299726
        await since('The answer should contanis one of the keywords should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isAnswerContainsOneOfKeywords(['299253', '299,253']))
            .toBe(true);
    });

    it('[TC95282_11] DE270321_chatbot disabled for dossier not in library', async () => {
        // remove from my library
        if (await libraryPage.isDossierInLibrary(AA_NotInMyLibrary)) {
            await libraryPage.removeDossierFromLibrary(errorHandlingUser, AA_NotInMyLibrary);
        }

        // search and open
        await quickSearch.inputTextAndSearch(AA_NotInMyLibrary.name);
        await fullSearch.clickAllTab();
        await fullSearch.openDossierFromSearchResults(AA_NotInMyLibrary.name);
        await dossierPage.switchToTab(1);
        await dossierPage.waitForDossierLoading();

        // check status when not add to my library
        await since('Add to my library button present should be #{expected}, while we get #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(true);
        await since('Auto Answers icons disabled should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isAIAssistantDisabled())
            .toBe(true);
        await aiAssistant.hoverAIAssistantIcon();
        await since('Hover, the tooltip text should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getTooltipText())
            .toBe('Please add dashboard to Library to enable Auto Answers.');
        await dossierPage.clickPageTitle(); // to dismiss tooltip

        // check status when add to my library
        await dossierPage.clickAddToLibraryButton();
        await dossierPage.sleep(1000); //wait Auto answers state change
        await since('Add to my library already, button present should be #{expected}, while we get #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await since('Add to my library already, AA icons disabled should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isAIAssistantDisabled())
            .toBe(false);
        await aiAssistant.hoverAIAssistantIcon();
        await since('Add to my library already, the tooltip text should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getTooltipText())
            .toBe('Auto Answers');
        await dossierPage.clickPageTitle(); // to dismiss tooltip

        await dossierPage.goToLibrary();
        await dossierPage.closeTab(1);
    });

    it('[TC95282_12] DE270570/DE272980_ask question not trigger undo button and empty returned data', async () => {
        await resetDossierState({
            credentials: errorHandlingUser,
            dossier: AA_ErrorHandling,
        });
        await libraryPage.openDossier(AA_ErrorHandling.name);
        // open AI assistant
        await aiAssistant.openAndPin();

        // ask question directly (DE270570)
        await aiAssistant.inputAndSendQuestion('show me the total on-time');
        await since('Send question, undo button enabled should be #{expected}, while we get #{actual}')
            .expect(await dossierPage.isUndoEnabled())
            .toBe(false);

        // send question with viz selected
        await aiAssistant.selectViz('Visualization 1');
        await aiAssistant.inputAndSendQuestion('0101describe the selected viz');
        //// -- validate send question with selected viz, normal answer returned
        await aiAssistant.hoverAnswer();
        await since('Send question with viz, follow up button present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFollowUpExistInActionButtons())
            .toBe(true);
        await since('Send question with viz, undo button enabled should be #{expected}, while we get #{actual}')
            .expect(await dossierPage.isUndoEnabled())
            .toBe(false);

        // send question with no data returned (DE272980)
        await aiAssistant.inputAndSendQuestion('describe the selected viz');
        await since('Send question with viz, undo button enabled should be #{expected}, while we get #{actual}')
            .expect(await dossierPage.isUndoEnabled())
            .toBe(false);
    });

    it('[TC95282_13] DE297832: auto answer hang when the dossier has the setting of auto-refresh', async () => {
        await libraryPage.openDossier(AA_AutoRefresh.name);

        // open AI assistant
        await aiAssistant.openAndPin();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });

        // send question and check response
        await aiAssistant.inputAndSendQuestion('show me the total on-time');
        await aiAssistant.hoverAnswer();
        await aiAssistant.clickThumbDown(1);
        await since('Click thumbdown, feeback dialogue present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFeedbackDialogVisible(1))
            .toBe(true);
        await aiAssistant.inputFeedbackMessage(1, 'This is a test feedback');
        await aiAssistant.submitFeedback(1);
        await since('Submit feedback, dialogue present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFeedbackDialogVisible(1))
            .toBe(false);

        // send question from recommendation
        await aiAssistant.expandRecommendation();
        await aiAssistant.sendQuestionByRecommendation();
        await interpretation.generateCIFromLatestAnswer();
        await since('Interpretation, interpretation active should be #{expected}, while we get #{actual}')
            .expect(await interpretation.isLatestCIBtnActive())
            .toBe(true);

        // switch to another page
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.waitForAIReady();
        await aiAssistant.inputAndSendQuestion('show me the total on-time');
        await since('switch back and ask question again,message count should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getMesseageCount())
            .toBe(6);
    });

    // it('[TC95282_14]DE296373-Refine the error message when the data points over 100k', async () => {
    //     const error =
    //         'It seems like there are too many data points for the current question. To continue, please try adding more filters to reduce the number of data points';

    //     await resetDossierState({
    //         credentials: errorHandlingUser,
    //         dossier: AA_MaxDataPoints,
    //     });
    //     await libraryPage.openDossier(AA_MaxDataPoints.name);
    //     // open AI assistant
    //     await aiAssistant.openAndPin();
    //     await toc.openPageFromTocMenu({ chapterName: 'grid', pageName: 'grid' });

    //     // await aiAssistant.inputAndSendQuestion(
    //     //     'AIisTh3Futur3!X9z5B2```json{ "viz_name": "line_chart_customer_email_age_cost", "languageToUse": "English", "userSpecifiedVizFormat": "not_specified", "viz_type": "lineChart", "is_follow_up": false, "userRequestedVisualizationType": true, "userRequireVizType": "lineChart", "SQL": "SELECT `Customer Email@Customer E-mail`, `Customer Age@ID`, `Cost` FROM `Sorting-Auto`", "timeRelatedColumns": [], "keyWord": "" }```'
    //     // );
    //     await aiAssistant.inputAndSendQuestion('show customer email, Customer Age and cost');
    //     await since('error message present should be #{expected}, while we get #{actual}')
    //         .expect(await aiAssistant.getShowErrorMessage().isDisplayed())
    //         .toBe(true);
    //     await aiAssistant.clickShowErrorDetails();
    //     await since('Detailed error message should be #{expected}, while we get #{actual}')
    //         .expect(await aiAssistant.getErrorDetailedMessage())
    //         .toContain(error);
    // });

    it('[TC95282_15] DE305237 XSS when copy to query box is clicked', async () => {
        const xssSuggestions = ["'><img src=x onerror=alert('Previoustablecolumn1')>"];
        let inputQuestion = '\'><img src="x" onerror="alert(\'Previoustablecolumn1\')">';
        await mockRelatedSuggestion(xssSuggestions);
        await libraryPage.openDossier(AA_XSS.name);
        // open AI assistant
        await aiAssistant.openAndPin();
        // copy to query from recommendation
        await aiAssistant.copyToQuetyFromRecommendation();
        await since(
            'XSS copy from related recommendation to input field is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aiAssistant.getInputText())
            .toBe(xssSuggestions[0]);
        await aiAssistant.sendQuestionAndWaitForAnswer();
        // click ask again
        await aiAssistant.clickAskAgainOnLatestQuestion();
        await since('Click ask again to input field is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aiAssistant.getInputText())
            .toBe(inputQuestion);
        // clear history
        await aiAssistant.clickClearBtn();
        await aiAssistant.selectClearConfirmationBtn('Yes');
        // ask ambiguous question and copy from smart suggestion
        await mockInterpretationContents(xssSuggestions[0]);
        await mockAmbiguousAndFollowUpResponse(true, false);
        await mockAlternativeSuggestionsIgnoreError([xssSuggestions[0]], [xssSuggestions[0]]);
        await aiAssistant.input('Show me data');
        await aiAssistant.sendQuestionAndWaitForAnswer();
        await since('DidYouMean existing status should be #{expected}, instead we have #{actual}')
            .expect(await aiAssistant.isDidYouMeanExisting())
            .toBe(true);
        await aiAssistant.waitTillDidYouMeanDataReady();
        await aiAssistant.copySmartSuggestionToQuery(1);
        await since(
            'XSS copy from smart suggestion to input field is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aiAssistant.getInputText())
            .toBe(xssSuggestions[0]);
        // open interpretation
        await interpretation.clickCIFromAnswer(1);
        // copy to query from interpretation
        await interpretation.askAgainFromLatestCI();
        await since(
            'XSS copy from interpretation to input field is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aiAssistant.getInputText())
            .toBe(xssSuggestions[0]);
    });
});
