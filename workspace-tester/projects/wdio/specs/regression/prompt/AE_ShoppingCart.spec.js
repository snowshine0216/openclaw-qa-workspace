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
 * https://microstrategy.atlassian.net/wiki/spaces/TTAWC/pages/821803896/AE+-+Shopping+Cart
 */
describe('AE Prompt - Shopping Cart', () => {
    const dossier = {
        id: '954DEC6843EDC34D3AEF478A2A55D254',
        name: 'AE_Customer-shoppingcart-min1max4-search required',
        project,
    };

    const dossier2 = {
        id: '5834A1734488C11351F02F9D3961931B',
        name: 'DS',
        project,
    };

    const RSD = {
        id: 'A35875E04103603CDEC2968B928C3314',
        name: 'Customer-shoppingcart-multiform',
        project,
    };

    const promptName = 'Customer';
    const promptName2 = "Choose from all elements of 'Employee'.";
    const promptName3 = 'Customer-multiform';

    const browserWindow = {
        
        width: 1600,
        height: 1000,
    };
    const { credentials } = specConfiguration;
    let prompt, cart;

    let { loginPage, rsdGrid, grid, promptObject, libraryPage, promptEditor, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        cart = promptObject.shoppingCart;
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    /**
     * Check Points:
     * 1. initial rendering for search required prompt
     * 2. single/multiple/no search result
     * 3. add/add all/remove/remove all for search results
     * 4. uncheck/check match case
     * 5. UI check for search result page
     */
    it('[TC58011] AE - Shopping Cart - Search', async () => {
        await resetDossierState({ credentials, dossier });
        await libraryPage.openDossierNoWait(dossier.name);
        await promptEditor.waitForEditor();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC58011', 'Initial_Rendering', {
            tolerance: 0.1,
        });
        // Search '$$$' to check no search result case
        prompt = await promptObject.getPromptByName(promptName);
        await cart.searchFor(prompt, '$$$');
        await since('Search result of "$$$" is supposed to be #{expected}, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(prompt))
            .toBe(0);

        // Search "Arabchyan" to check single search result case with match case checked.
        await cart.clearSearch(prompt);
        await cart.searchFor(prompt, 'Arabchyan');
        await since('Search result of "Arabchyan" is supposed to be #{expected}, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(prompt))
            .toBe(1);

        // Search "ABAD" to check multiple search result case with match case unchecked.
        await cart.clickMatchCase(prompt);
        await cart.clearSearch(prompt);
        await cart.searchFor(prompt, 'ABAD');
        await since('Search result of "ABAD" is supposed to be #{expected}, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(prompt))
            .toBe(3);

        // Check 'Add All', 'Remove All', 'Add', 'Remove'
        await cart.addAll(prompt);
        await since('After "Add All", available cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(prompt))
            .toBe(0);
        await since('After "Add All", selected cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await cart.getSelectedCartItemCount(prompt))
            .toBe(3);
        await since('After "Add All", the "Add" button is supposed to be disabled')
            .expect(await cart.isButtonEnabled(prompt, 'Add'))
            .toBe(false);
        await since('After "Add All", the "Add All" button is supposed to be disabled')
            .expect(await cart.isButtonEnabled(prompt, 'AddAll'))
            .toBe(false);
        await since('After "Add All", the "Remove" button is supposed to be disabled')
            .expect(await cart.isButtonEnabled(prompt, 'Remove'))
            .toBe(false);
        await since('After "Add All", the "Add All" button is supposed to be enabled')
            .expect(await cart.isButtonEnabled(prompt, 'RemoveAll'))
            .toBe(true);

        await cart.removeAll(prompt);
        await since('After "Remove All", available cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(prompt))
            .toBe(3);
        await since('After "Remove All", selected cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await cart.getSelectedCartItemCount(prompt))
            .toBe(0);
        await since('After "Remove All", the "Add" button is supposed to be disabled')
            .expect(await cart.isButtonEnabled(prompt, 'Add'))
            .toBe(false);
        await since('After "Remove All", the "Add All" button is supposed to be enabled')
            .expect(await cart.isButtonEnabled(prompt, 'AddAll'))
            .toBe(true);
        await since('After "Remove All", the "Remove" button is supposed to be disabled')
            .expect(await cart.isButtonEnabled(prompt, 'Remove'))
            .toBe(false);
        await since('After "Remove All", the "Add All" button is supposed to be disabled')
            .expect(await cart.isButtonEnabled(prompt, 'RemoveAll'))
            .toBe(false);

        await cart.clickElmInAvailableList(prompt, 'Abad:Geoffrey');
        await cart.addSingle(prompt);
        await since('After "Add single", available cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(prompt))
            .toBe(2);
        await since('After "Add single", selected cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await cart.getSelectedCartItemCount(prompt))
            .toBe(1);
        await since('After "Add single", the "Add" button is supposed to be enabled')
            .expect(await cart.isButtonEnabled(prompt, 'Add'))
            .toBe(true);
        await since('After "Add single", the "Add All" button is supposed to be enabled')
            .expect(await cart.isButtonEnabled(prompt, 'AddAll'))
            .toBe(true);
        await since('After "Add single", the "Remove" button is supposed to be disabled')
            .expect(await cart.isButtonEnabled(prompt, 'Remove'))
            .toBe(false);
        await since('After "Add single", the "Add All" button is supposed to be enabled')
            .expect(await cart.isButtonEnabled(prompt, 'RemoveAll'))
            .toBe(true);

        await cart.clickElmInSelectedList(prompt, 'Abad:Geoffrey');
        await cart.removeSingle(prompt);
        await since('After "Remove", available cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(prompt))
            .toBe(3);
        await since('After "Remove", selected cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await cart.getSelectedCartItemCount(prompt))
            .toBe(0);

        await cart.addAll(prompt);
        // Add All and answer prompt
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toEqual('Abad:Geoffrey, Abad:Bekir, Abadilla:Lennie');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('Prompt editor should be closed after clicking Run')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(4);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer' }))
            .toBe('Abad');
    });

    /**
     * Check Points:
     * 1. resolve prompt answer with 0/1/4/5 numbers and run dossier
     * 2. re-prompt with different prompt answer numbers
     */
    it('[TC58012] AE - Shopping Cart - MinMax prompt answer required', async () => {
        // Check 0 answer
        await resetDossierState({ credentials, dossier });
        await libraryPage.openDossierNoWait(dossier.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(promptName);
        await promptEditor.run();
        await promptEditor.waitForMessageBox();
        await since('Run with 0 prompt answer should trigger error message')
            .expect(await promptEditor.isErrorPresent())
            .toBe(true);
        await promptEditor.dismissError();
        await since('Error message box should be closed after clicking OK')
            .expect(await promptEditor.isErrorPresent())
            .toBe(false);
        await since('Warning message of 0 answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe('You have made fewer selections than are required for this prompt. Please make more selections.');

        // Check 1 answer
        await cart.searchFor(prompt, 'aba');
        await cart.addSingle(prompt);
        await since('Warning message should disappear after we select one answer, instead we get #{actual}')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe('');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('Prompt editor should be closed after clicking Run')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        // Check 5 answers
        await promptEditor.reprompt();

        prompt = await promptObject.getPromptByName(promptName);
        await cart.searchFor(prompt, 'aba');
        for (let i = 0; i < 4; i++) {
            await cart.addSingle(prompt);
        }
        await promptEditor.run();
        await promptEditor.waitForMessageBox();
        await since('Run with 5 prompt answer should trigger error message')
            .expect(await promptEditor.isErrorPresent())
            .toBe(true);
        await promptEditor.dismissError();
        await since('Error message box should be closed after clicking OK')
            .expect(await promptEditor.isErrorPresent())
            .toBe(false);
        await since('Warning message of 5 answers is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe('You have made more selections than are allowed for this prompt. Please remove some selections.');

        // Check 4 answers
        await cart.clickElmInSelectedList(prompt, 'Aba:Blain');
        await cart.removeSingle(prompt);
        await since('Warning message should disappear after we remove one answer, instead we get #{actual}')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe('');

        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toEqual('Aba-Bulgu:Leslie, Abad:Geoffrey, Abad:Bekir, Abadilla:Lennie');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(5);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer' }))
            .toBe('Aba-Bulgu');
    });

    it('[TC80232] Validating the search in the prompt of sub set report (reports based on Intelligent Cube) in Library Web', async () => {
        await libraryPage.openDossier(dossier2.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(promptName2);

        // Search in the prompt of sub set dossier
        await cart.searchFor(prompt, 'B');
        await since('Search result of "B" is supposed to be #{expected}, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(prompt))
            .toBe(6);
        await cart.clickElmInAvailableList(prompt, 'Bell');
        await cart.addSingle(prompt);
        await promptEditor.run();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(2);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Employee' }))
            .toBe('Bell');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$883,441');
        // Search when reprompt
        await promptEditor.reprompt();
        await cart.searchFor(prompt, 'b');
        await since('Search result of "b" is supposed to be #{expected}, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(prompt))
            .toBe(0);

        // Uncheck match case
        await cart.clickMatchCase(prompt);
        await cart.clearSearch(prompt);
        await cart.searchFor(prompt, 'b');
        await since('Search result of "b" is supposed to be #{expected}, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(prompt))
            .toBe(5);
        await cart.addAll(prompt);
        await promptEditor.run();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(7);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Employee' }))
            .toBe('Bates');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$904,996');
    });

    it('[TC80251] Validate search function for attribute element prompt with multi forms', async () => {
        await resetDossierState({ credentials, dossier: RSD });
        await libraryPage.openDossierNoWait(RSD.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(promptName3);
        // Search '111'
        await cart.searchFor(prompt, '111');
        await since('Search result of "111" is supposed to be #{expected}, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(prompt))
            .toBe(1);
        await cart.addAll(prompt);
        await promptEditor.run();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['111', 'Brown', 'Otto']);

        // Search 'otta'
        await promptEditor.reprompt();
        await cart.searchFor(prompt, 'otta');
        await since('Search result of "otta" is supposed to be #{expected}, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(prompt))
            .toBe(2);
        await cart.addAll(prompt);
        await promptEditor.run();
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['111', 'Brown', 'Otto']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(3))
            .toEqual(['1430', 'Trotta', 'Randy']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(4))
            .toEqual(['9176', 'Trotta', 'Dallas']);
    });
});

export const config = specConfiguration;
