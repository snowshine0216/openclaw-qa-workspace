import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_prompt') };

describe('SAP_FormulaVariable', () => {
    const PromptName1 = 'Sales Tax Manual';
    const PromptName2 = 'Income Tax Manual Optional';

    const project = {
        id: '06F4B4424AF3D68156873CA7DBC777FF',
        name: 'SAP Project',
    };

    const dossier1 = {
        name: 'Query_Formula_Manual',
        id: '273581B7424B3E8BA0B134985F8AE027',
        project,
    };

    const browserWindow = {
        
        width: 1600,
        height: 1000,
    };
    const { credentials } = specConfiguration;
    let prompt;
    let { loginPage, dossierPage, libraryPage, promptEditor, rsdGrid, promptObject } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC85327] Validate Formula Variable SAP prompt in Library Web', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossierNoWait(dossier1.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(PromptName1);

        // Check the default UI
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC85327_01', 'Default UI');
        // Run with empty value
        await promptObject.textbox.clearAndInputText(prompt, '');
        await promptEditor.run();
        await promptEditor.dismissError();
        await since('Error message for answer required is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe('This prompt requires an answer.');

        // Run with invalid value
        await promptObject.textbox.clearAndInputText(prompt, '500');
        prompt = await promptObject.getPromptByName(PromptName2);
        await promptObject.textbox.clearAndInputText(prompt, 'abc');
        await promptEditor.run();
        await promptEditor.dismissError();
        await since('Error message for answer required is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe('You have entered an invalid answer. Please enter a value of the correct data type.');

        // Run with valid value
        await promptObject.textbox.clearAndInputText(prompt, '500');

        // Check summary
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(PromptName1);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC85327_02', 'Prompt summary');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K46A43CAA4DE057256DA373B0488599BF');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Region', 'Year', 'Metrics', '']);
        await since('The second row should be #{expected}, instead we get #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Northeast', '2005', 'Cost', '67,923,352']);
    });
});

export const config = specConfiguration;
