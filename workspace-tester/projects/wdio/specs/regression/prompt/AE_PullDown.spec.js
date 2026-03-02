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
 * https://microstrategy.atlassian.net/wiki/spaces/TTAWC/pages/822153281/AE+-+Pull+Down
 */
describe('AE Prompt - Pulldown', () => {
    const dossier1 = {
        id: 'FCECD9214936DD389D4FAA964D04D917',
        name: 'AE_Customer-pulldown',
        project,
    };
    const dossier2 = {
        id: '9A696BAE4FBE962C3DDD01A954722A53',
        name: 'AE_Customer-pulldown-predefined list-required',
        project,
    };
    const dossier3 = {
        id: '0DCD18284A57703BF4561DA7C1E63497',
        name: 'AE_Customer-pulldown-search required',
        project,
    };
    const dossier4 = {
        id: 'ED0B85144453F9A5FE3519B6B23742C3',
        name: 'AE_Customer-pulldown-search required-with default answer',
        project,
    };
    const dossier5 = {
        id: 'E793ECDB4665FD9E00153198197ED281',
        name: 'AE_Customer-pulldown-search required-with first selection',
        project,
    };
    const dossier6 = {
        id: 'A08C4F2A444F1DAB4AB29D86BDA8B44C',
        name: 'AE_Customer-pulldown-search required-with last selection',
        project,
    };
    const promptName = 'Customer';
    const browserWindow = {
        
        width: 1600,
        height: 1000,
    };
    const { credentials } = specConfiguration;
    let prompt, pulldown;
    let { loginPage, rsdGrid, grid, promptObject, libraryPage, promptEditor, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        pulldown = promptObject.pulldown;
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    /**
     * Check Points:
     * 1 initial rendering check
     * 2 change selection on pull-down list
     * 3 go to the last page to check current selection
     * 4 go back to the first page to check current selection
     * 5 check view summary and run dossier
     * 6 re-prompt to change answer and check data
     */
    it('[TC58829] AE - Pull Down - Check "all" option for pull down list with searchbox disabled and prompt not-required', async () => {
        await resetDossierState({ credentials, dossier: dossier1 });
        await libraryPage.openDossierNoWait(dossier1.name);
        await promptEditor.waitForEditor();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC58829', 'Initial_Rendering', {
            tolerance: 0.1,
        });

        prompt = await promptObject.getPromptByName(promptName);
        await pulldown.selectPullDownItem(prompt, 'Aaby:Alen');
        await since('The selected item is supposed to be #{expected}, instead we get #{actual}')
            .expect(await pulldown.getSelectedItem(prompt))
            .toBe('Aaby:Alen');

        await promptObject.goToLastPage(prompt);
        await since('After go to last page, the selected item is supposed to be #{expected}, instead we get #{actual}')
            .expect(await pulldown.getSelectedItem(prompt))
            .toBe('- all -');

        await promptObject.goToFirstPage(prompt);
        await since('After go to first page, the selected item is supposed to be #{expected}, instead we get #{actual}')
            .expect(await pulldown.getSelectedItem(prompt))
            .toBe('- all -');

        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('current prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkEmptySummary(promptName))
            .toBe('No Selection');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();

        prompt = await promptObject.getPromptByName(promptName);
        await pulldown.selectPullDownItem(prompt, 'Aaby:Alen');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();

        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Aaby', 'Alen']);
    });

    /**
     * Check Points:
     * 1 Initial rendering check
     * 2 check 'all' option is not in the list
     * 3 change selection on pull-down list
     * 4 check view summary and run dossier
     */
    it('[TC58830] AE - Pull Down - Check "all" option for pull down list with searchbox disabled and prompt required', async () => {
        await resetDossierState({ credentials, dossier: dossier2 });
        await libraryPage.openDossierNoWait(dossier2.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(promptName);
        await since('"All" option should not in the list')
            .expect(await pulldown.isItemInList(prompt, 'Aadland:Miko'))
            .toBe(true);

        await pulldown.selectPullDownItem(prompt, 'Aaby:Alen');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('the prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe('Aaby:Alen');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(2);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer' }))
            .toBe('Aaby');
    });

    /**
     * Check Points:
     * 1 Initial rendering check
     * 2 search 'ab' and check current selection should be 'all'
     * 3 chosse 'Aba:Blain' and search 'bl' again
     * 4 check current selection
     * 5 search 'abc' and check current selection should be 'all'
     * 6 do selection in the list and check view summary
     * 7 run dossier
     */
    it('[TC58831] AE - Pull Down - Check "all" option for pull down list with searchbox enabled and no default selection', async () => {
        await resetDossierState({ credentials, dossier: dossier3 });
        await libraryPage.openDossierNoWait(dossier3.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(promptName);

        await since('the default selected item is supposed to be #{expected}, instead we get #{actual}')
            .expect(await pulldown.getSelectedItem(prompt))
            .toBe('- all -');

        await pulldown.searchFor(prompt, 'ab');
        await since('After search "ab", the selected item is supposed to be #{expected}, instead we get #{actual}')
            .expect(await pulldown.getSelectedItem(prompt))
            .toBe('- all -');

        await pulldown.selectPullDownItem(prompt, 'Aba:Blain');

        await pulldown.clearSearch(prompt);
        await pulldown.searchFor(prompt, 'bl');
        await since('After search "bl", the selected item is supposed to be #{expected}, instead we get #{actual}')
            .expect(await pulldown.getSelectedItem(prompt))
            .toBe('Aba:Blain');

        await pulldown.clearSearch(prompt);
        await pulldown.searchFor(prompt, 'abc');
        await since('After search "ab", the selected item is supposed to be #{expected}, instead we get #{actual}')
            .expect(await pulldown.getSelectedItem(prompt))
            .toBe('- all -');

        await pulldown.selectPullDownItem(prompt, 'Babcock:Joanna');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('the prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe('Babcock:Joanna');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Babcock', 'Joanna']);
    });

    /**
     * Check Points:
     * 1 Initial rendering check
     * 2 search 'ab' and check current selection should be 'all'
     * 3 chosse 'Aba:Blain' and search 'a' again
     * 4 check current selection should go back to default one
     * 5 search 'abc' and check current selection should be 'all'
     * 6 search 'a' and check current selection should go back to default one
     * 7 change selection and check view summary
     * 8 run dossier
     */
    it('[TC58832] AE - Pull Down - Check "all" option for pull down list with searchbox enabled and default answer but no default selection', async () => {
        await resetDossierState({ credentials, dossier: dossier4 });
        await libraryPage.openDossierNoWait(dossier4.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(promptName);
        await since('the default selected item is supposed to be #{expected}, instead we get #{actual}')
            .expect(await pulldown.getSelectedItem(prompt))
            .toBe('Aadland:Miko');

        await pulldown.searchFor(prompt, 'ab');
        await since('After search "ab", the selected item is supposed to be #{expected}, instead we get #{actual}')
            .expect(await pulldown.getSelectedItem(prompt))
            .toBe('- all -');

        await pulldown.selectPullDownItem(prompt, 'Aba:Blain');
        await pulldown.clearSearch(prompt);
        await pulldown.searchFor(prompt, 'a');
        await since('After search "a", the selected item is supposed to be #{expected}, instead we get #{actual}')
            .expect(await pulldown.getSelectedItem(prompt))
            .toBe('Aadland:Miko');

        await pulldown.clearSearch(prompt);
        await pulldown.searchFor(prompt, 'abc');
        await since('After search "abc", the selected item is supposed to be #{expected}, instead we get #{actual}')
            .expect(await pulldown.getSelectedItem(prompt))
            .toBe('- all -');

        await pulldown.clearSearch(prompt);
        await pulldown.searchFor(prompt, 'a');
        await since('After search "a", the selected item is supposed to be #{expected}, instead we get #{actual}')
            .expect(await pulldown.getSelectedItem(prompt))
            .toBe('Aadland:Miko');

        await pulldown.selectPullDownItem(prompt, 'Aaby:Alen');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('the prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe('Aaby:Alen');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(2);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer' }))
            .toBe('Aaby');
    });

    /**
     * Check Points
     * 1 Show the pull down list and then do initial rendering check to make sure current selection should be the first one
     * 2 search 'bo' and check current selection to be the first one
     * 3 go to next page to check current selection to be the first one
     * 4 choose 'all' and go back to previous page to check current selection to be 'all'
     * 5 search 'mo' and check current selection to be still 'all'
     * 6 change selection to be non-first one and go to last page to check current selection to be the first one
     * 7 go back to the first page and check current selection to be first one other than the one selected on step 6
     * 8 search 'abedfr' and check current selection to be 'all' with empty list
     * 9 search 'm' and check current selection to be still 'all'
     * 10 change selection and check view summary
     * 11 run dossier
     */
    it('[TC58833] AE - Pull Down - Check "all" option for pull down list with searchbox enabled and default first selection', async () => {
        await resetDossierState({ credentials, dossier: dossier5 });
        await libraryPage.openDossierNoWait(dossier5.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(promptName);
        await since('the default selected item is supposed to be #{expected}, instead we get #{actual}')
            .expect(await pulldown.getSelectedItem(prompt))
            .toBe('Aaby:Alen');
        await since('First element should be selected')
            .expect(await pulldown.isFirstSelected(prompt))
            .toBe(true);

        await pulldown.searchFor(prompt, 'bo');
        await since('After search "bo", the first element should be selected')
            .expect(await pulldown.isFirstSelected(prompt))
            .toBe(true);

        await promptObject.goToNextPage(prompt);
        await since('After go to next page, the first element should be selected')
            .expect(await pulldown.isFirstSelected(prompt))
            .toBe(true);

        await pulldown.selectPullDownItem(prompt, '- all -');
        await promptObject.goToPreviousPage(prompt);
        await since('After go to previous page, "all" should still be selected')
            .expect(await pulldown.getSelectedItem(prompt))
            .toBe('- all -');

        await pulldown.clearSearch(prompt);
        await pulldown.searchFor(prompt, 'mo');
        await since('After search "mo", "all" should still be selected')
            .expect(await pulldown.getSelectedItem(prompt))
            .toBe('- all -');

        await pulldown.selectPullDownItem(prompt, 'Achmoody:Lois');
        await promptObject.goToLastPage(prompt);
        await since('After go to last page, the first element should be selected')
            .expect(await pulldown.isFirstSelected(prompt))
            .toBe(true);

        await promptObject.goToFirstPage(prompt);
        await since('After go to first page, the first element should be selected')
            .expect(await pulldown.isFirstSelected(prompt))
            .toBe(true);

        await pulldown.clearSearch(prompt);
        await pulldown.searchFor(prompt, 'abedfr');
        await since('After search "abedfr", only all is in the list')
            .expect(await pulldown.isOnlyAllInList(prompt))
            .toBe(true);

        await pulldown.selectPullDownItem(prompt, '- all -');
        await pulldown.clearSearch(prompt);
        await pulldown.searchFor(prompt, 'm');
        await since('After search "m", "all" should still be selected')
            .expect(await pulldown.getSelectedItem(prompt))
            .toBe('- all -');

        await pulldown.selectPullDownItem(prompt, 'Aamodt:Stacy');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('the prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe('Aamodt:Stacy');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();

        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Aamodt', 'Stacy']);
    });

    /**
     * Check Points
     * 1 Show the pull down list and then do initial rendering check to make sure current selection should be the last one
     * 2 search 'bo' and check current selection to be the last one
     * 3 go to next page to check current selection to be the last one
     * 4 choose 'all' and go back to previous page to check current selection to be 'all'
     * 5 search 'mo' and check current selection to be still 'all'
     * 6 change selection to be non-first one and go to last page to check current selection to be the last one
     * 7 go back to the first page and check current selection to be first one other than the one selected on step 6
     * 8 search 'abedfr' and check current selection to be 'all' with empty list
     * 9 search 'm' and check current selection to be still 'all'
     * 10 change selection and check view summary
     * 11 run dossier
     */
    it('[TC58834] AE - Pull Down - Check "all" option for pull down list with searchbox enabled and default first selection', async () => {
        await resetDossierState({ credentials, dossier: dossier6 });
        await libraryPage.openDossierNoWait(dossier6.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(promptName);
        await since('the default selected item is supposed to be #{expected}, instead we get #{actual}')
            .expect(await pulldown.getSelectedItem(prompt))
            .toBe('Abbruscato:Shaun');
        await since('Last element should be selected')
            .expect(await pulldown.isLastSelected(prompt))
            .toBe(true);

        await pulldown.searchFor(prompt, 'bo');
        await since('After search "bo", the last element should be selected')
            .expect(await pulldown.isLastSelected(prompt))
            .toBe(true);

        await promptObject.goToNextPage(prompt);
        await since('After go to next page, the last element should be selected')
            .expect(await pulldown.isLastSelected(prompt))
            .toBe(true);

        await pulldown.selectPullDownItem(prompt, '- all -');
        await promptObject.goToPreviousPage(prompt);
        await since('After go to previous page, "all" should still be selected')
            .expect(await pulldown.getSelectedItem(prompt))
            .toBe('- all -');

        await pulldown.clearSearch(prompt);
        await pulldown.searchFor(prompt, 'mo');
        await since('After search "mo", "all" should still be selected')
            .expect(await pulldown.getSelectedItem(prompt))
            .toBe('- all -');

        await pulldown.selectPullDownItem(prompt, 'Abromovich:Tim');
        await promptObject.goToLastPage(prompt);
        await since('After go to last page, the last element should be selected')
            .expect(await pulldown.isLastSelected(prompt))
            .toBe(true);

        await promptObject.goToFirstPage(prompt);
        await since('After go to first page, the last element should be selected')
            .expect(await pulldown.isLastSelected(prompt))
            .toBe(true);

        await pulldown.clearSearch(prompt);
        await pulldown.searchFor(prompt, 'abedfr');
        await since('After search "abedfr", only all is in the list')
            .expect(await pulldown.isOnlyAllInList(prompt))
            .toBe(true);

        await pulldown.selectPullDownItem(prompt, '- all -');
        await pulldown.clearSearch(prompt);
        await pulldown.searchFor(prompt, 'm');
        await since('After search "m", "all" should still be selected')
            .expect(await pulldown.getSelectedItem(prompt))
            .toBe('- all -');

        await pulldown.selectPullDownItem(prompt, 'Aamodt:Stacy');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('the prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe('Aamodt:Stacy');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(2);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer' }))
            .toBe('Aamodt');
    });
});

export const config = specConfiguration;
