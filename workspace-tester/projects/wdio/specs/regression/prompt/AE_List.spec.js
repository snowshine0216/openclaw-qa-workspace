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
 * https://microstrategy.atlassian.net/wiki/spaces/TTAWC/pages/821805216/AE+-+List
 */
describe('AE Prompt - List', () => {
    const promptName = 'Customer';
    const browserWindow = {
        
        width: 1600,
        height: 1000,
    };
    const { credentials } = specConfiguration;
    let prompt;
    let { loginPage, rsdGrid, grid, promptObject, libraryPage, promptEditor, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    /**
     * Check Points:
     * 1 initial rendering for prompt page (style for single list with default answer)
     * 2 check view summary and run dossier with default answer
     * 3 reprompt to check current prompt answer
     * 4 change prompt answer ,check view summary
     * 5 run dossier with new resolved prompt answer, check data
     */
    it('[TC58013] AE - List - Single selection', async () => {
        const dossier = {
            id: '9D0A569B490EB458C73BA282B9EF09AA',
            name: 'AE_Customer-list-min1max1',
            project,
        };
        const radio = promptObject.radioButton;
        await resetDossierState({ credentials, dossier });
        await libraryPage.openDossierNoWait(dossier.name);
        await promptEditor.waitForEditor();

        prompt = await promptObject.getPromptByName(promptName);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('The default prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe('Aalgaard:Kenney');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('The default prompt answer after reprompt is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe('Aalgaard:Kenney');
        await promptEditor.toggleViewSummary();
        prompt = await promptObject.getPromptByName(promptName);
        await radio.selectRadioButtonByName(prompt, 'Aaby:Alen');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('The default prompt answer after reprompt is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe('Aaby:Alen');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Aaby', 'Alen']);
    });

    /**
     * Check Points:
     * 1 initial rendering for dossier disable prompt(no prompt page pops out)
     * 2 re-prompt to change 0 prompt answers
     * 3 check view summary
     * 4 run dossier with new resolved answers, check data
     * 5 repeat step 2-4 with 1/3/4/6 prompt answers
     * 6 reset and check UI (no prompt page pops out)
     */
    it('[TC58014] AE - List - Multiple selection', async () => {
        const dossier = {
            id: '479B71AF4807F28A981198AEF3C487E7',
            name: 'AE_Customer-list-min1max4_discard current answer',
            project,
        };
        const checkbox = promptObject.checkBox;
        await resetDossierState({ credentials, dossier });
        await libraryPage.openDossier(dossier.name);
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(promptName);

        // Check 0 answer
        await checkbox.clickCheckboxByName(prompt, 'Aaron:Ferrell');
        await checkbox.clickCheckboxByName(prompt, 'Aaronson:Maxwell');
        await checkbox.clickCheckboxByName(prompt, 'Aasen:Beatrice');
        await promptEditor.run();
        await promptEditor.waitForMessageBox();
        await since('Run with 0 prompt answer should trigger error message')
            .expect(await promptEditor.isErrorPresent())
            .toBe(true);
        await promptEditor.dismissError();
        await since('Warning message of 0 answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe('You have made fewer selections than are required for this prompt. Please make more selections.');

        // Check 1 answer
        await checkbox.clickCheckboxByName(prompt, 'Aaby:Alen');
        await since('Warning message should be hidden for 1 prompt answer')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe('');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();

        // Check 3 answers
        prompt = await promptObject.getPromptByName(promptName);
        await checkbox.clickCheckboxByName(prompt, 'Aadland:Miko');
        await checkbox.clickCheckboxByName(prompt, 'Aadland:Warner');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();

        // Check 5 answers
        prompt = await promptObject.getPromptByName(promptName);
        await checkbox.clickCheckboxByName(prompt, 'Aadland:Constant');
        await checkbox.clickCheckboxByName(prompt, 'Aafedt:Wendy');
        await since('Warning message of 5 answers is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe('You have made more selections than are allowed for this prompt. Please remove some selections.');
        await promptEditor.run();
        await promptEditor.waitForMessageBox();
        await since('Run with 0 prompt answer should trigger error message')
            .expect(await promptEditor.isErrorPresent())
            .toBe(true);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC58014', 'Error_Answer_More_Than_Max', {
            tolerance: 0.1,
        });
        await promptEditor.dismissError();
        // Check 4 answers
        await checkbox.clickCheckboxByName(prompt, 'Aadland:Constant');
        await checkbox.clickCheckboxByName(prompt, 'Aafedt:Wendy');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe('Aaby:Alen, Aadland:Miko, Aadland:Warner');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(4);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer' }))
            .toBe('Aaby');
    });
});

export const config = specConfiguration;
