import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_prompt') };
const project = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

/**
 * Confluence Page:
 * https://microstrategy.atlassian.net/wiki/spaces/TTAWC/pages/822087946/Value+-+Text
 */
describe('Value Prompt - Text', () => {
    const dossier = {
        id: '55E23471469C16DC957D72A7EC08A53B',
        name: 'Value_Text Prompt_Not required',
        project,
    };
    const promptName = 'Text';
    const browserWindow = {
        
        width: 1600,
        height: 1000,
    };
    const { credentials } = specConfiguration;
    let prompt, textbox;
    let { loginPage, promptObject, rsdPage, rsdGrid, libraryPage, promptEditor, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        textbox = promptObject.textbox;
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    /**
     * Check Points:
     * 1 Intial rendering
     * 2 Resolve prompt /Re-prompt with value
     *      String
     *      Numeric
     *      Speicail characters
     * 3 Take screensort to check view summary
     * 4 Run dossier to check data
     */
    it('[TC60351] Value(Text) prompt - Answer prompt in different values', async () => {
        await resetDossierState({ credentials, dossier: dossier });
        await libraryPage.openDossier(dossier.name);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt summary of default answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary(promptName))
            .toBe('South');

        // Run with default value
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Region', 'Metrics', 'Profit']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['South', '$806,956']);

        // Run with empty value
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(promptName);
        await textbox.clearAndInputText(prompt, '');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt summary of empty answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkEmptySummary(promptName))
            .toBe('No Selection');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Region', 'Metrics', 'Profit']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Central', '$764,323']);

        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(promptName);
        await since('Previous answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await textbox.text(prompt))
            .toBe('South');
        // Run with South;North
        await textbox.clearAndInputText(prompt, 'South;North');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The rsd grid element display should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.isGridPresnt())
            .toBe(false);

        // Run with special chars
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(promptName);
        await textbox.clearAndInputText(prompt, '~!@#$%^&*("\>/');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The rsd grid element display should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.isGridPresnt())
            .toBe(false);
    });
});

export const config = specConfiguration;
