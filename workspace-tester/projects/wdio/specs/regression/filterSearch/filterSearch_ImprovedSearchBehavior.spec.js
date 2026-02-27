import { browserWindowCustom } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as consts from '../../../constants/visualizations.js';

describe('Chapter Filter', () => {
    let {
        authoringFilters,
        dossierPage,
        libraryAuthoringPage,
        libraryPage,
        loginPage,
        rsdPage,
    } = browsers.pageObj1;

    const twoWordTextBoth = "wonderful aroma";
    const twoWordTextEither = /wonderful|aroma/;
    const threeWordTextBoth = "takes the best";
    const threeWordTextBothNotInOrder = "the takes best";
    const threeWordTextBothUnfinished = "takes the bes";
    const threeWordTextEither = /takes|the|best/;
    const fourWordTextBoth = "the best of what";
    const fourWordTextEither = /the|best|of|what/;
    
    const testTextMatchTwoWords = async(selector) => {
        await selector.searchbox.inputAndWaitForFirstSuggestion(twoWordTextBoth);
        await since('Text should contain #{expected}, instead we have #{actual}')
            .expect(await selector.searchbox.getSuggestionListItems()[1].getText())
            .toContain(twoWordTextBoth);
        await since('Text should contain #{expected}, instead we have #{actual}')
            .expect(await selector.searchbox.getSuggestionListItems()[1].getText())
            .toMatch(twoWordTextEither);
        await since('Text should contain #{expected}, instead we have #{actual}')
            .expect(await selector.searchbox.getSuggestionListItems()[3].getText())
            .not.toContain(twoWordTextBoth);
        await since('Text should contain #{expected}, instead we have #{actual}')
            .expect(await selector.searchbox.getSuggestionListItems()[3].getText())
            .toMatch(twoWordTextEither);
    }

    const testTextMatchThreeWords = async(selector) => {
        await selector.searchbox.clearAndInputAndWaitForFirstSuggestion(threeWordTextBoth);
        await since('Text should contain #{expected}, instead we have #{actual}')
            .expect(await selector.searchbox.getSuggestionListItems()[1].getText())
            .toContain(threeWordTextBoth);
        await since('Text should contain #{expected}, instead we have #{actual}')
            .expect(await selector.searchbox.getSuggestionListItems()[1].getText())
            .toMatch(threeWordTextEither);
        await since('Text should contain #{expected}, instead we have #{actual}')
            .expect(await selector.searchbox.getSuggestionListItems()[2].getText())
            .not.toContain(threeWordTextBoth);
        await since('Text should contain #{expected}, instead we have #{actual}')
            .expect(await selector.searchbox.getSuggestionListItems()[2].getText())
            .toMatch(threeWordTextEither);
    }

    const testTextMatchThreeWordsNotInOrder = async(selector) => {
        await selector.searchbox.clearAndInputAndWaitForFirstSuggestion(threeWordTextBothNotInOrder);
        await since('Text should contain #{expected}, instead we have #{actual}')
            .expect(await selector.searchbox.getSuggestionListItems()[1].getText())
            .not.toContain(threeWordTextBoth);
        await since('Text should contain #{expected}, instead we have #{actual}')
            .expect(await selector.searchbox.getSuggestionListItems()[1].getText())
            .toMatch(threeWordTextEither);
    }

    const testTextMatchThreeWordsUnfinished = async(selector) => {
        await selector.searchbox.clearAndInputAndWaitForFirstSuggestion(threeWordTextBothUnfinished);
        await since('Text should contain #{expected}, instead we have #{actual}')
            .expect(await selector.searchbox.getSuggestionListItems()[1].getText())
            .toContain(threeWordTextBoth);
        await since('Text should contain #{expected}, instead we have #{actual}')
            .expect(await selector.searchbox.getSuggestionListItems()[1].getText())
            .toMatch(threeWordTextEither);
        await since('Text should contain #{expected}, instead we have #{actual}')
            .expect(await selector.searchbox.getSuggestionListItems()[2].getText())
            .not.toContain(threeWordTextBoth);
        await since('Text should contain #{expected}, instead we have #{actual}')
            .expect(await selector.searchbox.getSuggestionListItems()[2].getText())
            .toMatch(threeWordTextEither);
    }

    const testTextMatchFourWords = async(selector) => {
        await selector.searchbox.clearAndInputAndWaitForFirstSuggestion(fourWordTextBoth);
        await since('Text should contain #{expected}, instead we have #{actual}')
            .expect(await selector.searchbox.getSuggestionListItems()[1].getText())
            .toContain(fourWordTextBoth);
        await since('Text should contain #{expected}, instead we have #{actual}')
            .expect(await selector.searchbox.getSuggestionListItems()[1].getText())
            .toMatch(fourWordTextEither);
        await since('Text should contain #{expected}, instead we have #{actual}')
            .expect(await selector.searchbox.getSuggestionListItems()[8].getText())
            .not.toContain(fourWordTextBoth);
        await since('Text should contain #{expected}, instead we have #{actual}')
            .expect(await selector.searchbox.getSuggestionListItems()[8].getText())
            .toMatch(fourWordTextEither);
    }

    beforeAll(async () => {
        await loginPage.login(consts.analystUser.credentials);
        await setWindowSize(browserWindowCustom);
        await browser.execute(() => {
            localStorage.setItem('dontShowAIAssistantTooltip', '{"ts":-1,"data":true}');
        });
    });

    afterAll(async () => {
        await dossierPage.goToLibrary();
        await browser.execute(() => {
            localStorage.removeItem('dontShowAIAssistantTooltip');
        });
    });

    it("[TC95091_0] Create dashboard with dataset and search filter", async () => {
        await libraryAuthoringPage.createDashboardWithDataset({ dataset: 'C05.Wine' });
        await authoringFilters.addFilterToFilterPanel('description');
    });

    it("[TC95091_1] Test search behaviour in filter panel", async () => {
        const selector = rsdPage.findSelectorByName('description');
        await testTextMatchTwoWords(selector);
        await testTextMatchThreeWords(selector);
        await testTextMatchThreeWordsNotInOrder(selector);
        await testTextMatchThreeWordsUnfinished(selector);
        await testTextMatchFourWords(selector);
    });

    it("[TC95091_2] Test search behaviour in canvas", async () => {
        await authoringFilters.moveFilterToCanvas('description', 'Visualization 1');

        const selector = rsdPage.findSelectorByName('description');
        await testTextMatchTwoWords(selector);
        await testTextMatchThreeWords(selector);
        await testTextMatchThreeWordsNotInOrder(selector);
        await testTextMatchThreeWordsUnfinished(selector);
        await testTextMatchFourWords(selector);
    });

    it("[TC95091_3] Save and reopen a dashboard with search box filter applied.", async () => {
        await libraryAuthoringPage.saveDashboard('TC95091');
        await libraryAuthoringPage.goToHome();
        await libraryPage.openDossier('TC95091');
    });

    it("[TC95091_4] Test search behaviour in canvas in consumption", async () => {
        const selector = rsdPage.findSelectorByName('description');
        await testTextMatchTwoWords(selector);
        await testTextMatchThreeWords(selector);
        await testTextMatchThreeWordsNotInOrder(selector);
        await testTextMatchThreeWordsUnfinished(selector);
        await testTextMatchFourWords(selector);
    });
});
