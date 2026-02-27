import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_prompt') };

describe('Prompt in Prompt - Value prompt in filter', () => {
    const valuePromptName = 'Region Value';
    const nestedPromptName = 'Call Center';

    const dossier = {
        id: 'AC4BB77B4269322F8887D8A18F7CA5FA',
        name: 'PromptInPrompt_Value prompt in filter',
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
    let cart, textbox, valuePrompt, nestedPrompt;

    let { loginPage, promptObject, rsdGrid, libraryPage, promptEditor, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        cart = promptObject.shoppingCart;
        textbox = promptObject.textbox;
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
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

    it('[TC67315] Prompt in prompt using value prompt in filter', async () => {
        // check initial UI
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(valuePromptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkTextSummary(valuePromptName))
            .toEqual('1');

        await promptEditor.run();
        await promptObject.waitForPromptDetail(nestedPromptName);
        nestedPrompt = await promptObject.getPromptByName(nestedPromptName);
        await since('Count of Subcategory is supposed to be "#{expected}", instead we get "#{actual}"')
            .expect(await promptObject.getItemCountText(nestedPrompt))
            .toBe('1 - 17 of 17');
        await since('Selected cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await cart.getSelectedCartItemCount(nestedPrompt))
            .toBe(0);
        // answer nested prompt
        await cart.clickElmInAvailableList(nestedPrompt, 'Atlanta');
        await cart.addSingle(nestedPrompt);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Call Center', 'Metrics', 'Cost']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Atlanta', '$894,145']);

        //re-prompt, change prompt answers in first prompt, nested prompt should be filtered
        await promptEditor.reprompt();
        valuePrompt = await promptObject.getPromptByName(valuePromptName);
        await textbox.clearAndInputText(valuePrompt, '3');
        await promptEditor.run();
        await promptObject.waitForPromptDetail(nestedPromptName);
        nestedPrompt = await promptObject.getPromptByName(nestedPromptName);
        await since('Count of Call Center is supposed to be "#{expected}", instead we get "#{actual}"')
            .expect(await promptObject.getItemCountText(nestedPrompt))
            .toBe('1 - 13 of 13');
        await cart.addAll(nestedPrompt);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['San Diego', '$2,513,166']);
        await promptEditor.reprompt();
        valuePrompt = await promptObject.getPromptByName(valuePromptName);
        await textbox.clearAndInputText(valuePrompt, '12');
        await promptEditor.run();
        await promptObject.waitForPromptDetail(nestedPromptName);
        nestedPrompt = await promptObject.getPromptByName(nestedPromptName);
        await since('Count of call center item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await cart.getAvailableCartItemCount(nestedPrompt))
            .toEqual(0);

        // cancel in prompt in prompt
        await promptEditor.cancelEditor();
        await dossierPage.waitForDossierLoading();
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['San Diego', '$2,513,166']);
    });
});

export const config = specConfiguration;
