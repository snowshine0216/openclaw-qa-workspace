import { customCredentials } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_prompt') };
const project = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

/**
 * Confluence Page:
 * https://microstrategy.atlassian.net/wiki/spaces/TTAWC/pages/822217641/AE+-+Radio+Button
 */
describe('AE Prompt - Radio Button', () => {
    const dossier = {
        id: 'B7E0A17742B1527FDBD551B4FFEE0A5C',
        name: 'AE_Customer-radiobutton-filter list-search required-with first selection',
        project,
    };
    const promptName = 'Customer';
    const browserWindow = {
        
        width: 1600,
        height: 1000,
    };
    const { credentials } = specConfiguration;
    let prompt, radio;
    let { loginPage, rsdGrid, promptObject, libraryPage, promptEditor, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        radio = promptObject.radioButton;
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetDossierState({ credentials, dossier });
        await libraryPage.openDossierNoWait(dossier.name);
        await promptEditor.waitForEditor();
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    /**
     * Check Points:
     * 1 Initial rendering for prompt page
     * 2 input 'abc' to check search result(should only show 'all')
     * 3 empty input field to check UI
     * 4 input 'k' to check search result
     * 5 input 'a' to check search result
     * 6 empty input field and input 'a' again to check search result
     * 7 go to next page to check view summary
     * 8 go back to previous page to check view summary
     * 9 select 'all' to check view summary
     * 10 run dossier and check data
     */
    it('[TC58016] AE - Radio Button - Check "all" for search with default first selection', async () => {
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC58016', 'Initial_Rendering', {
            tolerance: 0.1,
        });
        prompt = await promptObject.getPromptByName(promptName);
        await radio.searchFor(prompt, 'abc');
        await since('Search "abc" should only return "all" option')
            .expect(await radio.getAllItemCount(prompt))
            .toBe(1);

        await radio.clearSearch(prompt);
        await radio.searchFor(prompt, 'k');
        await since('Search result of "k" is supposed to be #{expected} options, instead we get #{actual}')
            .expect(await radio.getAllItemCount(prompt))
            .toBe(22);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('the prompt answer for searching "k" is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe('Aadland:Miko');
        await promptEditor.toggleViewSummary();

        await radio.clearSearch(prompt);
        await radio.searchFor(prompt, 'a');
        await since('Search result of "a" is supposed to be "#{expected}", instead we get "#{actual}"')
            .expect(await promptObject.getItemCountText(prompt))
            .toBe('1 - 30 of 120');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('the prompt answer for searching "a" is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe('Aadland:Miko');
        await promptEditor.toggleViewSummary();

        await radio.clearSearch(prompt);
        await radio.searchFor(prompt, '');
        await radio.searchFor(prompt, 'a');
        await since('Search result of "a" is supposed to be "#{expected}", instead we get "#{actual}"')
            .expect(await promptObject.getItemCountText(prompt))
            .toBe('1 - 30 of 120');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('the prompt answer for searching "a" again is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe('Aadland:Miko');
        await promptEditor.toggleViewSummary();

        await promptObject.goToNextPage(prompt);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('the default prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe('Abdala:Stacy');
        await promptEditor.toggleViewSummary();

        await promptObject.goToPreviousPage(prompt);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('the default prompt answer after switching pages is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe('Aaby:Alen');
        await promptEditor.toggleViewSummary();

        await radio.selectRadioButtonByName(prompt, '- all -');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('the default prompt answer after switching pages is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkEmptySummary(promptName))
            .toBe('No Selection');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Aaby', 'Alen']);
    });

    /**
     * Check Points:
     * 1 reset and check view summary with default prompt answer
     * 2 run dossier and check data
     * 3 re-prompt and change prompt answer
     * 4 run dossier and check data
     */
    it('[TC58017] AE - Radio Button - Re-prompt with different answers', async () => {
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('The default prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkEmptySummary(promptName))
            .toBe('No Selection');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Aaby', 'Alen']);

        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(promptName);
        await radio.searchFor(prompt, 'Aba');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('the prompt answer for searching "Aba" is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe('Aba:Blain');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Aba', 'Blain']);
    });
});

export const config = specConfiguration;
