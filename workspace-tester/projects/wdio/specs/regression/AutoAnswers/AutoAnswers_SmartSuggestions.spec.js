import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { smartSuggestionCredentials } from '../../../constants/autoAnswer.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import {
    mockAmbiguousAndFollowUpResponse,
    mockAlternativeSuggestionsIgnoreError,
} from '../../../api/mock/mock-response-utils.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import * as appConsts from '../../../constants/customApp/bot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';

describe('Auto Answer Smart Suggestion Test', () => {
    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };

    const AA_SmartSuggestions = {
        id: '4D5A9810EA461E197F625CB89FF9BB21',
        name: 'Smart Suggestion Dashboard',
        project,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const { loginPage, dossierPage, libraryPage, aiAssistant } = browsers.pageObj1;

    const appIdsToDelete = [];

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        if (!(await loginPage.isLoginPageDisplayed())) {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
        await loginPage.login(smartSuggestionCredentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
        await deleteCustomAppList({
            credentials: smartSuggestionCredentials,
            customAppIdList: appIdsToDelete,
        });
        appIdsToDelete.length = 0;
        await logoutFromCurrentBrowser();
    });

    it('[TC94333_1] Show smart suggestions for ambiguous question with text answer', async () => {
        await resetDossierState({
            credentials: smartSuggestionCredentials,
            dossier: AA_SmartSuggestions,
        });
        await libraryPage.openDossier(AA_SmartSuggestions.name);

        // open AI assistant
        await aiAssistant.openAndPin();

        // mock ambiguous response and smart suggestions
        await mockAmbiguousAndFollowUpResponse(true, false);
        const suggestions = [
            'What is the highest number of cancelled flights?',
            'What is the highest number of delayed flights?',
            'What is the highest number of on-time flights?',
        ];
        const alternatives = ['Flights Delayed', 'Flights Cancelled', 'Flights On-Time'];
        await mockAlternativeSuggestionsIgnoreError(alternatives, suggestions);
        await aiAssistant.input('Show me highest airline in text');
        await aiAssistant.sendQuestionAndWaitForAnswer();
        await since('DidYouMean existing status should be #{expected}, instead we have #{actual}')
            .expect(await aiAssistant.isDidYouMeanExisting())
            .toBe(true);
        await aiAssistant.waitTillDidYouMeanDataReady();
        await since('Smart suggestion number should be #{expected}, while the actual number is #{actual}')
            .expect(await aiAssistant.getNumberOfSmartSuggestions())
            .toBe(3);
        await aiAssistant.clickSmartSuggestion();
        await since(
            'DidYouMean existing status should be #{expected} after click smart suggestion, instead we have #{actual}'
        )
            .expect(await aiAssistant.isDidYouMeanExisting())
            .toBe(false);
        await aiAssistant.waitForElementInvisible(aiAssistant.getAnswerLoading());
    });

    it('[TC94333_2] Show smart suggestions for ambiguous question with viz answer', async () => {
        await resetDossierState({
            credentials: smartSuggestionCredentials,
            dossier: AA_SmartSuggestions,
        });
        await libraryPage.openDossier(AA_SmartSuggestions.name);

        // open AI assistant
        await aiAssistant.openAndPin();

        // mock ambiguous response and smart suggestions
        await mockAmbiguousAndFollowUpResponse(true, false);
        const suggestions = [
            'What is the highest number of cancelled flights?',
            'What is the highest number of delayed flights?',
        ];
        const alternatives = ['Flights Delayed', 'Flights Cancelled'];
        await mockAlternativeSuggestionsIgnoreError(alternatives, suggestions);
        await aiAssistant.input('Show me airline in bar chart');
        await aiAssistant.sendQuestionAndWaitForAnswer();
        await since('DidYouMean existing status should be #{expected}, instead we have #{actual}')
            .expect(await aiAssistant.isDidYouMeanExisting())
            .toBe(true);
        await aiAssistant.waitTillDidYouMeanDataReady();
        await since('Smart suggestion number should be #{expected}, while the actual number is #{actual}')
            .expect(await aiAssistant.getNumberOfSmartSuggestions())
            .toBe(2);
        await aiAssistant.clickSmartSuggestion();
        await since(
            'DidYouMean existing status should be #{expected} after click smart suggestion, instead we have #{actual}'
        )
            .expect(await aiAssistant.isDidYouMeanExisting())
            .toBe(false);
        await aiAssistant.waitForElementInvisible(aiAssistant.getAnswerLoading());
    });

    it('[TC94333_3] Check request for follow up questions', async () => {
        await resetDossierState({
            credentials: smartSuggestionCredentials,
            dossier: AA_SmartSuggestions,
        });
        await libraryPage.openDossier(AA_SmartSuggestions.name);

        // open AI assistant
        await aiAssistant.openAndPin();

        await mockAmbiguousAndFollowUpResponse(false, false);
        await aiAssistant.input('Show me airline in bar chart');
        await aiAssistant.sendQuestionAndWaitForAnswer();
        await mockAmbiguousAndFollowUpResponse(false, true);
        await aiAssistant.input('Top 1');
        await aiAssistant.sendQuestionAndWaitForAnswer();

        // mock ambiguous response and smart suggestions
        await mockAmbiguousAndFollowUpResponse(true, true);
        const suggestions = [
            'What is the highest number of cancelled flights?',
            'What is the highest number of delayed flights?',
        ];
        const alternatives = ['Flights Delayed', 'Flights Cancelled'];
        const mockAlternativeSuggestion = await mockAlternativeSuggestionsIgnoreError(alternatives, suggestions);
        await aiAssistant.input('How about the Flights Cancelled for them?');
        await aiAssistant.sendQuestionAndWaitForAnswer();
        await since('DidYouMean existing status should be #{expected}, instead we have #{actual}')
            .expect(await aiAssistant.isDidYouMeanExisting())
            .toBe(true);
        await aiAssistant.waitTillDidYouMeanDataReady();
        await since('AlternativeSuggestion request should be called #{expected}, instead we have #{actual}')
            .expect(mockAlternativeSuggestion.calls.length)
            .toBe(1);
        const postData = JSON.parse(mockAlternativeSuggestion.calls[0]?.postData);
        const firstAnswerAndNuggets = await aiAssistant.getAnswerTextAndNuggetsCollectionsFromState(1);
        const secondAnswerAndNuggets = await aiAssistant.getAnswerTextAndNuggetsCollectionsFromState(2);
        const requestData = postData?.context?.history;
        const expectedData = [
            {
                question: 'Show me airline in bar chart',
                answer: firstAnswerAndNuggets.answerText,
                nuggetsCollections: firstAnswerAndNuggets.nuggetsCollections,
            },
            {
                question: 'Top 1',
                answer: secondAnswerAndNuggets.answerText,
                nuggetsCollections: secondAnswerAndNuggets.nuggetsCollections,
            },
        ];

        await since('AlternativeSuggestion request payload history should be #{expected}, instead we have #{actual}')
            .expect(
                requestData
                    .map((element) => {
                        let newElement = { ...element };
                        // Remove the id field
                        delete newElement.id;
                        // Convert to JSON string with sorted keys
                        return JSON.stringify(newElement, Object.keys(newElement).sort());
                    })
                    .join(',')
            )
            .toBe(expectedData.map((element) => JSON.stringify(element, Object.keys(element).sort())).join(','));

        await since('Smart suggestion number should be #{expected}, while the actual number is #{actual}')
            .expect(await aiAssistant.getNumberOfSmartSuggestions())
            .toBe(2);
    });

    it('[TC94333_4] No smart suggestion for unambiguous question', async () => {
        await resetDossierState({
            credentials: smartSuggestionCredentials,
            dossier: AA_SmartSuggestions,
        });
        await libraryPage.openDossier(AA_SmartSuggestions.name);

        // open AI assistant
        await aiAssistant.openAndPin();

        await mockAmbiguousAndFollowUpResponse(false, false);
        await aiAssistant.input('show me Airline Name with the highest Flights Cancelled in 2011');
        await aiAssistant.sendQuestionAndWaitForAnswer();
        await since('DidYouMean existing status should be #{expected}, instead we have #{actual}')
            .expect(await aiAssistant.isDidYouMeanExisting())
            .toBe(false);
    });

    it('[TC94333_5] Copy smart suggestion to query box', async () => {
        await resetDossierState({
            credentials: smartSuggestionCredentials,
            dossier: AA_SmartSuggestions,
        });
        await libraryPage.openDossier(AA_SmartSuggestions.name);

        // open AI assistant
        await aiAssistant.openAndPin();

        await mockAmbiguousAndFollowUpResponse(true, false);
        const suggestions = [
            'What is the highest number of cancelled flights?',
            'What is the highest number of delayed flights?',
        ];
        const alternatives = ['Flights Delayed', 'Flights Cancelled'];
        await mockAlternativeSuggestionsIgnoreError(alternatives, suggestions);
        await aiAssistant.input('Show me airline in bar chart');
        await aiAssistant.sendQuestionAndWaitForAnswer();
        await since('DidYouMean existing status should be #{expected}, instead we have #{actual}')
            .expect(await aiAssistant.isDidYouMeanExisting())
            .toBe(true);
        await aiAssistant.waitTillDidYouMeanDataReady();
        await aiAssistant.copySmartSuggestionToQuery();
        await aiAssistant.sleep(1000);
        await since('The suggestion copied to query box should be #{expected}, instead we have #{actual}')
            .expect(await aiAssistant.getInputText())
            .toBe('What is the highest number of cancelled flights?');
    });

    it('[TC94333_6] Dismiss smart suggestion', async () => {
        await resetDossierState({
            credentials: smartSuggestionCredentials,
            dossier: AA_SmartSuggestions,
        });
        await libraryPage.openDossier(AA_SmartSuggestions.name);

        // open AI assistant
        await aiAssistant.openAndPin();

        await mockAmbiguousAndFollowUpResponse(true, false);
        const suggestions = [
            'What is the highest number of cancelled flights?',
            'What is the highest number of delayed flights?',
        ];
        const alternatives = ['Flights Delayed', 'Flights Cancelled'];
        await mockAlternativeSuggestionsIgnoreError(alternatives, suggestions);
        await aiAssistant.input('Show me airline in bar chart');
        await aiAssistant.sendQuestionAndWaitForAnswer();
        await since('DidYouMean existing status should be #{expected}, instead we have #{actual}')
            .expect(await aiAssistant.isDidYouMeanExisting())
            .toBe(true);
        await aiAssistant.waitTillDidYouMeanDataReady();
        await aiAssistant.closeDidYouMean();
        await aiAssistant.sleep(1000);
        await since('DidYouMean existing status should be #{expected} after closing it, instead we have #{actual}')
            .expect(await aiAssistant.isDidYouMeanExisting())
            .toBe(false);
    });

    it('[TC94333_7] Color theme for smart suggestion', async () => {
        const smartSuggestionAppWithDarkTheme = appConsts.getRequestBody({
            name: 'SmartSuggestion_AppWithRedTheme',
            useColorTheme: true,
            selectedTheme: appConsts.redTheme,
        });
        const customAppId = await createCustomApp({
            credentials: smartSuggestionCredentials,
            customAppInfo: smartSuggestionAppWithDarkTheme,
        });
        appIdsToDelete.push(customAppId);
        await libraryPage.openCustomAppById({ id: customAppId });

        await resetDossierState({
            credentials: smartSuggestionCredentials,
            dossier: AA_SmartSuggestions,
        });
        await libraryPage.openDossier(AA_SmartSuggestions.name);

        // open AI assistant
        await aiAssistant.openAndPin();

        await mockAmbiguousAndFollowUpResponse(
            true,
            false,
            'The highest airline is United Air Lines Inc. with a count of 6627.'
        );
        const suggestions = [
            'What is the highest number of cancelled flights?',
            'What is the highest number of delayed flights?',
        ];
        const alternatives = ['Flights Delayed', 'Flights Cancelled'];
        await mockAlternativeSuggestionsIgnoreError(alternatives, suggestions);
        await aiAssistant.input('Show me highest airline in text');
        await aiAssistant.sendQuestionAndWaitForAnswer();

        await since('DidYouMean existing status should be #{expected}, instead we have #{actual}')
            .expect(await aiAssistant.isDidYouMeanExisting())
            .toBe(true);
        await aiAssistant.waitTillDidYouMeanDataReady();
        await aiAssistant.sleep(3000);
        const didYouMeanContainer = await aiAssistant.getDidYouMeanContainer();
        await takeScreenshotByElement(didYouMeanContainer, 'TC94333_7', 'Did You Mean Container');

        const suggestionItem = await aiAssistant.getSmartSuggestionItem();
        await aiAssistant.hover({ elem: suggestionItem });
        await browser.pause(5000);
        await takeScreenshotByElement(suggestionItem, 'TC94333_7', 'Hover on Smart Suggestion Item');
        await aiAssistant.sleep(3000);
    });
});
