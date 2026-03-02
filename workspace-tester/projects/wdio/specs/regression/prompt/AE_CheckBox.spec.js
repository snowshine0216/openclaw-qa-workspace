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
 * https://microstrategy.atlassian.net/wiki/spaces/TTAWC/pages/822217698/AE+-+Check+Box
 */
describe('AE Prompt - Checkbox', () => {
    const dossier1 = {
        id: 'F7AD04D44101070D0A023A8C422B165F',
        name: 'AE_Customer-checkbox-min1max4-disable prompt',
        project,
    };
    const dossier2 = {
        id: 'A6369726465E797EC698C2B2673586A8',
        name: 'AE_Customer-checkbox-search required-with first selection',
        project,
    };
    const dossier3 = {
        id: 'DF7503764288F69BA1CF36A888709C17',
        name: 'AE with all style',
        project,
    };
    const promptName = 'Customer';
    const browserWindow = {
        width: 1600,
        height: 1000,
    };
    const { credentials } = specConfiguration;
    let prompt, checkbox;
    let { loginPage, grid, promptObject, libraryPage, promptEditor, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        checkbox = promptObject.checkBox;
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    /**
     * Check Points:
     * 1 initial rendering check
     * 2 re-prompt and input 'b' in the search box to check the previous selection is kept
     * 3 input 'bc' in the search box the check the selections
     * 4 empty the search box and check the result
     * 5 do selections on page 1 and then go to next page do selection
     * 6 go back to check the previous selection are kept
     * 7 run dossier and check data
     */
    it('[TC58018] AE - Check Box - Check previous selections are kept via search and switch page', async () => {
        await resetDossierState({ credentials, dossier: dossier1 });
        await libraryPage.openDossier(dossier1.name);

        await since('There should be no prompt editor in initial state.')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();

        prompt = await promptObject.getPromptByName(promptName);
        await checkbox.searchFor(prompt, 'b');
        await since('Aaby:Alen should still be checked after search.')
            .expect(await checkbox.isItemSelected(prompt, 'Aaby:Alen'))
            .toBe(true);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('current prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe('Aaby:Alen');
        await promptEditor.toggleViewSummary();

        await checkbox.clearSearch(prompt);
        await checkbox.searchFor(prompt, 'bc');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('current prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe('Aaby:Alen');
        await promptEditor.toggleViewSummary();

        await checkbox.clearSearch(prompt);
        await checkbox.searchFor(prompt, '');
        await since('Aaby:Alen should still be checked after clear search.')
            .expect(await checkbox.isItemSelected(prompt, 'Aaby:Alen'))
            .toBe(true);
        await checkbox.clickCheckboxByName(prompt, 'Aadland:Warner');
        await promptObject.goToNextPage(prompt);
        await checkbox.clickCheckboxByName(prompt, 'Abdala:Vivian');
        await promptObject.goToPreviousPage(prompt);
        await since('Aadland:Warner should still be checked after switching page')
            .expect(await checkbox.isItemSelected(prompt, 'Aadland:Warner'))
            .toBe(true);

        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe('Abdala:Vivian, Aaby:Alen, Aadland:Warner');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(4);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer' }))
            .toBe('Aaby');
    });

    /**
     * Check Points
     * 1 re-prompt and choose 0 prompt answer, run dossier to check error dialog
     * 2 change prompt answer to be 1/3/5 to check the warning msg on prompt page
     * 3 deselect and change prompt number to be 4 to check warning msg disappears
     * 4 run dossier and check data
     */
    it('[TC58019] AE - Check Box – Check prompt answer numbers with min/max limitation', async () => {
        await resetDossierState({ credentials, dossier: dossier1 });
        await libraryPage.openDossier(dossier1.name);
        await promptEditor.reprompt();

        prompt = await promptObject.getPromptByName(promptName);
        await checkbox.clickCheckboxByName(prompt, 'Aaby:Alen');
        await promptEditor.run();
        await promptEditor.dismissError();
        await since('Warning message of 0 answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe('You have made fewer selections than are required for this prompt. Please make more selections.');

        await checkbox.clickCheckboxByName(prompt, 'Aafedt:Wendy');
        await since('Warning message should be hidden for 1 prompt answer')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe('');
        await checkbox.clickCheckboxByName(prompt, 'Aagesen:Bink');
        await checkbox.clickCheckboxByName(prompt, 'Aalgaard:Kenney');
        await checkbox.clickCheckboxByName(prompt, 'Aamodt:Stacy');
        await since('Warning message should be hidden for 4 prompt answer')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe('');

        await checkbox.clickCheckboxByName(prompt, 'Aarestad:Benjamine');
        await since('Warning message of 5 answers is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe('You have made more selections than are allowed for this prompt. Please remove some selections.');
        await checkbox.clickCheckboxByName(prompt, 'Aarestad:Benjamine');
        await since('Warning message should be hidden for 4 prompt answer')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe('');

        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe('Aafedt:Wendy, Aagesen:Bink, Aalgaard:Kenney, Aamodt:Stacy');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(5);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer' }))
            .toBe('Aafedt');
    });

    /**
     * Check Points:
     * 1 Initial rendering
     * 2 input 'k' in search box and go to next page, check the first item is checked,
     * 3 go back to previous page, check the previous selection is selected
     * 4 input 'a' in search box, check the previous selection is selected but the first item is unselected
     * 5 go to last page, check the first item is checked
     * 6 go to view summary, UI check
     * 7 Click cancel and go back to library
     */
    it('[TC58020] AE - Check Box – Check first selection in search box', async () => {
        await resetDossierState({ credentials, dossier: dossier2 });
        await libraryPage.openDossierNoWait(dossier2.name);
        await promptEditor.waitForEditor();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC58020', 'Initial_Rendering', {
            tolerance: 0.1,
        });
        prompt = await promptObject.getPromptByName(promptName);
        await checkbox.searchFor(prompt, 'k');
        await promptObject.goToNextPage(prompt);
        await since('First element should be selected.')
            .expect(await checkbox.isFirstItemSelected(prompt))
            .toBe(true);
        await promptObject.goToPreviousPage(prompt);
        await since('First element should be selected.')
            .expect(await checkbox.isFirstItemSelected(prompt))
            .toBe(true);

        await checkbox.clearSearch(prompt);
        await checkbox.searchFor(prompt, 'a');
        await since('First element should not be selected.')
            .expect(await checkbox.isFirstItemSelected(prompt))
            .toBe(false);
        await since('Aadland:Miko should still be checked after search.')
            .expect(await checkbox.isItemSelected(prompt, 'Aadland:Miko'))
            .toBe(true);

        await promptObject.goToLastPage(prompt);
        await since('First element should be selected.')
            .expect(await checkbox.isFirstItemSelected(prompt))
            .toBe(true);

        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe('Adrian:Jackie, Aadland:Miko, Zion:Abner');

        await promptEditor.cancelEditor();
        await libraryPage.waitForItemLoading();
        await libraryPage.openSortMenu();
        await libraryPage.selectSortOption('Date Viewed');
        await since(`The presence of dossier ${dossier2.name} is supposed to be #{expected}, instead we have #{actual}`)
            .expect(await libraryPage.isItemViewable(dossier2.name))
            .toBe(true);
    });

    it('[TC58020_02] AE - Check Box – Check your selection', async () => {
        await resetDossierState({ credentials, dossier: dossier3 });
        await libraryPage.openDossierNoWait(dossier3.name);
        await promptEditor.waitForEditor();
        const promptName = 'Year - Check box';
        prompt = await promptObject.getPromptByName(promptName);
        await promptObject.qualPulldown.selectYourSelection(prompt);
        await promptEditor.run();
        await since('Run dossier with your selection, the message box should be #{expected} but is #{actual}')
            .expect(await promptEditor.isErrorPresent())
            .toEqual(true);
        await promptEditor.dismissError();
        await promptEditor.cancelEditor();
        await libraryPage.waitForItemLoading();
        await libraryPage.openDossierNoWait(dossier3.name);
        await promptEditor.waitForEditor();
        await promptObject.qualPulldown.selectYourSelectionIcon(prompt);
        await promptEditor.run();
        await since('Run dossier with your selection, the message box should be #{expected} but is #{actual}')
            .expect(await promptEditor.isErrorPresent())
            .toEqual(true);
        await promptEditor.dismissError();
        await promptEditor.cancelEditor();
    });
});

export const config = specConfiguration;
