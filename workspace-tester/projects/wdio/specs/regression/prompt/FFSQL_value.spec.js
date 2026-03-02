import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_prompt') };
const specName = 'FFSQL Prompt-value';

describe('FFSQL Prompt - value', () => {
    const FFSQLPromptName = 'Prompt1';
    const dossier = {
        id: 'E735E4FC4E9E862272CA59950F5CAD51',
        name: 'FFSQL Prompt-value-customer',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const browserWindow = {
        width: 1600,
        height: 1000,
    };
    const { credentials } = specConfiguration;
    let prompt;

    let { loginPage, dossierPage, grid, libraryPage, promptEditor, promptObject } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        await libraryPage.openDossierNoWait(dossier.name);
        await promptEditor.waitForEditor();
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC59770]FFSQL - value prompt with multiple answers', async () => {
        prompt = await promptObject.getPromptByName(FFSQLPromptName);
        // view summary
        await promptEditor.toggleViewSummary();
        await since('Default prompt answer should be #{expected} but is #{actual}')
            .expect(await promptEditor.checkTextSummary(FFSQLPromptName))
            .toEqual('12345,54321');
        // Run prompt with default selection
        //  a. Take a screenshot(RunPromptResultWithDefaultAnswer) to check the default UI
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(3);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer_Name' }))
            .toBe('DOGTAS_C');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer_ID' }))
            .toBe('54321');
        // Re-prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(FFSQLPromptName);

        // CLear value and input single value
        await promptObject.textbox.clickTextBoxInput(prompt);
        await promptObject.textbox.clearAndInputText(prompt, '12345');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(2);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer_Name' }))
            .toBe('DOĞTAŞ_C');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer_ID' }))
            .toBe('12345');

        // Reprompt
        //  a. check previous value
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(FFSQLPromptName);
        await since('Previous prompt answer should be #{expected} but is #{actual}')
            .expect(await promptObject.textbox.text(prompt))
            .toEqual('12345');
        // Input value with blank
        await promptObject.textbox.clearAndInputText(prompt, '12345, 54321');
        await promptEditor.toggleViewSummary();
        await since('New prompt answer should be #{expected} but is #{actual}')
            .expect(await promptEditor.checkTextSummary(FFSQLPromptName))
            .toEqual('12345, 54321');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(3);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer_Name' }))
            .toBe('DOGTAS_C');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer_ID' }))
            .toBe('54321');
    });
});

export const config = specConfiguration;
