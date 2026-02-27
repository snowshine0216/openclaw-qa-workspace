import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { relatedSuggestionsCredentials } from '../../../constants/autoAnswer.js';
import {
    mockAlternativeSuggestionsResponse,
    mockAmbiguousAndFollowUpResponse,
    mockChatResult,
} from '../../../api/mock/mock-response-utils.js';

describe('Context for Related Suggestions Enhancement', () => {
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

    const { loginPage, dossierPage, libraryPage, toc, aiAssistant } = browsers.pageObj1;

    const inputQuestion = 'Which year had the most flight cancellations?';
    const mockAnswer = 'Year 2009 had the most flight cancellations.';

    beforeAll(async () => {
        await loginPage.login(relatedSuggestionsCredentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
        await browser.mockRestoreAll();
    });

    const postQuestionWithSmartSuggestionsBack = async () => {
        // prepare to mock ambiguous and follow up response
        await mockAmbiguousAndFollowUpResponse(true, false);
        // prepare to mock suggestion questions
        const suggestions = [
            'What is the highest number of cancelled flights?',
            'What is the highest number of delayed flights?',
        ];
        const alternatives = ['Flights Delayed', 'Flights Cancelled'];
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aiAssistant.input('Show me highest airline in text');
        await aiAssistant.sendQuestionAndWaitForAnswer();
        await since('Recommendation should be collapsed after receive smart suggestion')
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(true);
        await aiAssistant.waitTillDidYouMeanDataReady();
    };

    const openAutoAnswer = async () => {
        await resetDossierState({
            credentials: relatedSuggestionsCredentials,
            dossier: AA_E2E,
        });
        await libraryPage.openDossier(AA_E2E.name);

        // open AI assistant
        await aiAssistant.openAndPin();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Auto Complete - 1' });

        await aiAssistant.sleep(1000);
        await since(
            'Open auto answer for the first time, recommendation collapsed should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(false);
    };

    it('[TC95422_01] collapse related suggestion when type question', async () => {
        await openAutoAnswer();

        await aiAssistant.waitForAIReady();
        const recommendationRound1 = await aiAssistant.getRecommendationText();

        // post question by input
        await mockChatResult({ answerText: mockAnswer });
        await aiAssistant.input(inputQuestion);
        await since('Recommendation should be collapsed after type question by default')
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(true);

        await aiAssistant.sendQuestionAndWaitForAnswer();
        await since('Recommendation should be expanded after send question')
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(false);

        await aiAssistant.waitForAIReady();
        const recommendationRound2 = await aiAssistant.getRecommendationText();
        await since(
            'Recommendation should be refreshed after send question, while we get the same recommendation #{actual}'
        )
            .expect(recommendationRound2)
            .not.toBe(recommendationRound1);

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await since('Recommendation should keep expanded after switch page')
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(false);

        await aiAssistant.waitForAIReady();
        const recommendationRound3 = await aiAssistant.getRecommendationText();
        await since(
            'Recommendation should be refreshed after switch page, while we get the same recommendation #{actual}'
        )
            .expect(recommendationRound3)
            .not.toBe(recommendationRound2);
    });

    it('[TC95422_02] collapse related suggestion when answer back with did you mean', async () => {
        await openAutoAnswer();

        await aiAssistant.waitForAIReady();
        const recommendationRound1 = await aiAssistant.getRecommendationText();

        await postQuestionWithSmartSuggestionsBack();

        await aiAssistant.clickSmartSuggestion();
        await since('Recommendation should be expanded after click smart suggestion')
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(false);

        await aiAssistant.waitForAIReady();
        const recommendationRound2 = await aiAssistant.getRecommendationText();
        await since(
            'Recommendation should be refreshed after click smart suggestion, while we get the same recommendation #{actual}'
        )
            .expect(recommendationRound2)
            .not.toBe(recommendationRound1);
    });

    it('[TC95422_03] keep related suggestion collapsed after user manually collapse it', async () => {
        await openAutoAnswer();
        await aiAssistant.collapseRecommendation();
        await since('Recommendation should be collapsed after manually collapse it')
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(true);

        await mockChatResult({ answerText: mockAnswer });
        await aiAssistant.input(inputQuestion);
        await since('Recommendation should be collapsed after type question by default')
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(true);

        await aiAssistant.sendQuestionAndWaitForAnswer();
        await since('Recommendation should be expanded after send question')
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(true);
        await browser.mockRestoreAll();

        await postQuestionWithSmartSuggestionsBack();
        await aiAssistant.clickSmartSuggestion();
        await since('Recommendation should keep collapsed after click smart suggestion if user manually collapse it')
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(true);

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await since('Recommendation should keep collapsed after switch page')
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(true);

        await aiAssistant.close();
        await aiAssistant.openAndPin();
        await since('Recommendation should keep collapsed after close and reopen')
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(true);

        await dossierPage.goToLibrary();
        await libraryPage.openDossier(AA_E2E.name);
        await aiAssistant.openAndPin();
        await since('Recommendation should expand by default after open first time')
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(false);
    });

    it('[TC95422_04] same with default state after user manually expand it', async () => {
        await openAutoAnswer();
        await aiAssistant.collapseRecommendation();
        await aiAssistant.expandRecommendation();
        await since('Recommendation should be expanded after manually expand it')
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(false);

        await postQuestionWithSmartSuggestionsBack();
        await browser.mockRestoreAll();

        await mockChatResult({ answerText: mockAnswer });
        await aiAssistant.input(inputQuestion);
        await aiAssistant.sendQuestionAndWaitForAnswer();
        await since('Recommendation should be expanded after type question if user manually expand it')
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(false);
    });
});
