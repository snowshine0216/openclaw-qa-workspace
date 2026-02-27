import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_prompt') };
const project = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

describe('AE Prompt - Customer Issue', () => {
    const dossier = {
        id: '91E2DAE24CAD8DF306DD9BA2CBE1D7B4',
        name: 'DE202361-search ID form',
        project,
    };
    const dossier2 = {
        id: '9F8B6C484084D06F0C02C2A8BACF4512',
        name: 'DE203028',
        project,
    };

    const promptName = 'DE202361';
    const promptName2 = 'Item - de203028';

    const browserWindow = {
        
        width: 1600,
        height: 1000,
    };

    const { credentials } = specConfiguration;

    let prompt, cart;

    let { loginPage, grid, promptObject, libraryPage, promptEditor, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        cart = promptObject.shoppingCart;
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC78971_01] Validate search function in prompt for attribute with redefined form format in library web', async () => {
        await resetDossierState({ credentials, dossier: dossier });
        await libraryPage.openDossierNoWait(dossier.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(promptName);

        await since('The default element is supposed to be #{expected}, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(prompt))
            .toBe(3);
        // Search '0' to check no search result case
        await cart.searchFor(prompt, '0');
        await since('Search result of "0" is supposed to be #{expected}, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(prompt))
            .toBe(0);

        // Search "1" to check single search result case with match case checked
        await cart.clearSearch(prompt);
        await cart.searchFor(prompt, '1');
        await since('Search result of "1" is supposed to be #{expected}, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(prompt))
            .toBe(1);

        // Search "3" to check search result case with match case unchecked
        await cart.clickMatchCase(prompt);
        await cart.clearSearch(prompt);
        await cart.searchFor(prompt, '3');
        await since('Search result of "3" is supposed to be #{expected}, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(prompt))
            .toBe(1);

        // Add All and answer prompt
        await cart.addAll(prompt);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe('3');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('Prompt editor should be closed after clicking Run')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(2);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'DE202361' }))
            .toBe('3');
    });

    it('[TC78971_02] Validate search function in prompt for attribute with redefined form format in library web', async () => {
        await resetDossierState({ credentials, dossier: dossier2 });
        await libraryPage.openDossierNoWait(dossier2.name);
        await promptEditor.waitForEditor();
        // Search '2302' to check no search result case
        prompt = await promptObject.getPromptByName(promptName2);
        await cart.searchFor(prompt, '2302');
        await since('Search result of "2302" is supposed to be #{expected}, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(prompt))
            .toBe(0);

        // Search "230" to check single search result case with match case checked
        await cart.clearSearch(prompt);
        await cart.searchFor(prompt, '230');
        await since('Search result of "230" is supposed to be #{expected}, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(prompt))
            .toBe(1);

        // Search "DVD/CD/Video" to check single search result case with match case checked
        await cart.clearSearch(prompt);
        await cart.searchFor(prompt, 'DVD/CD/Video');
        await since('Search result of "DVD/CD/Video" is supposed to be #{expected}, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(prompt))
            .toBe(1);

        // Search "10" to check multi search result case with match case checked
        await cart.clearSearch(prompt);
        await cart.searchFor(prompt, '10');
        await since('Search result of "10" is supposed to be #{expected}, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(prompt))
            .toBe(5);

        // Search "br" to check multi search result case with match case checked
        await cart.clearSearch(prompt);
        await cart.searchFor(prompt, 'br');
        await since('Search result of "br" is supposed to be #{expected}, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(prompt))
            .toBe(7);

        // Search "br" to check search result case with match case unchecked
        await cart.clickMatchCase(prompt);
        await cart.clearSearch(prompt);
        await cart.searchFor(prompt, 'br');
        await since('Search result of "br" is supposed to be #{expected}, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(prompt))
            .toBe(7);

        // Add All and answer prompt
        await cart.addAll(prompt);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName2);
        await since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName2))
            .toBe(
                '26:Jump Start Your Brain, 37:Brave New World, 198:The Princess Bride, 297:Bryan White, 317:Bridge, 320:Live at the Bridge Vol 2, 353:Embrya'
            );
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('Prompt editor should be closed after clicking Run')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(8);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Item - de203028' }))
            .toBe('26');
    });
});

export const config = specConfiguration;
