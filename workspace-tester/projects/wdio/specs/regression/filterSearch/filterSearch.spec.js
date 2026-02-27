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

    const twoWordText = "wonderful aroma";

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

    it("[TC94425_0] Create dashboard with dataset and search filter, save dashboard.", async () => {
        await libraryAuthoringPage.createDashboardWithDataset({ dataset: 'C05.Wine' });
        await authoringFilters.addFilterToFilterPanel('description');
        await authoringFilters.moveFilterToCanvas('description', 'Visualization 1');
        await libraryAuthoringPage.saveDashboard('TC94425');
        await libraryAuthoringPage.goToHome();
    });
    it("[TC94425_1] Open a dashboard with search box filter applied.", async () => {
        await libraryPage.openDossier('TC94425');

    });
    it("[TC94425_2] Open filter panel, click on the filter, search for a two-word phrase.", async () => {
        const selector = rsdPage.findSelectorByName('description');
        await selector.searchbox.inputAndWaitForFirstSuggestion('wonderful aroma');
        await since('Text should contain #{expected}, instead we have #{actual}')
            .expect(await selector.searchbox.getSuggestionListItems()[1].getText())
            .toContain(twoWordText);
        await since('Text should contain #{expected}, instead we have #{actual}')
            .expect(await selector.searchbox.getSuggestionListItems()[1].getText())
            .toMatch(/wonderful|aroma/);
        await since('Text should contain #{expected}, instead we have #{actual}')
            .expect(await selector.searchbox.getSuggestionListItems()[3].getText())
            .not.toContain(twoWordText);
        await since('Text should contain #{expected}, instead we have #{actual}')
            .expect(await selector.searchbox.getSuggestionListItems()[3].getText())
            .toMatch(/wonderful|aroma/);
    });
});
