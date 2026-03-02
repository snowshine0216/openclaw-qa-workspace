import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_prompt') };
const project = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

describe('Value Prompt - Big Decimal', () => {
    const dossier = {
        id: '66C7C6BD4920162935EBAB8A0CA27C6A',
        name: 'Value_Big Decimal Prompt_Fixed width:4',
        project,
    };
    const promptName = 'Big decimal';
    const browserWindow = {
        
        width: 1600,
        height: 1000,
    };
    const { credentials } = specConfiguration;
    let prompt, textbox;
    let { loginPage, promptObject, rsdGrid, libraryPage, promptEditor, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        textbox = promptObject.textbox;
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC66200] Value(Big decimal) prompt - Answer prompt in different values', async () => {
        await resetDossierState({ credentials, dossier: dossier });
        await libraryPage.openDossierNoWait(dossier.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(promptName);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt summary of default answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary(promptName))
            .toBe('500000');

        // Run with default value
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Category', 'Subcategory', 'Metrics', 'Cost', 'Profit']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Books', 'Science & Technology', '$627,512', '$184,275']);

        // Run with empty value
        await promptEditor.reprompt();
        await textbox.clearAndInputText(prompt, '');
        await promptEditor.run();
        await promptEditor.dismissError();
        await since('Error message for answer required is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe('This prompt requires an answer.');

        // Run with $500000
        await textbox.clearAndInputText(prompt, '$500000');
        await promptEditor.run();
        await promptEditor.dismissError();
        await since('Error message for invalid value is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe('You have entered an invalid answer. Please enter a value of the correct data type.');

        // Run with 500000.0000
        await textbox.clearAndInputText(prompt, '500000.0000');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Category', 'Subcategory', 'Metrics', 'Cost', 'Profit']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Books', 'Science & Technology', '$627,512', '$184,275']);

        // Run with -500000
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(promptName);
        await since('Previous answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await textbox.text(prompt))
            .toBe('500000.0000');
        await textbox.clearAndInputText(prompt, '-500000');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt summary of empty answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary(promptName))
            .toBe('-500000');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Category', 'Subcategory', 'Metrics', 'Cost', 'Profit']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Books', 'Art & Architecture', '$370,161', '$110,012']);
    });
});

export const config = specConfiguration;
