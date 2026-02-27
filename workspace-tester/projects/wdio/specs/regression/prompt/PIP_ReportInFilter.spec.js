import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_prompt') };

describe('Prompt in Prompt - Prompted report in filter', () => {
    const year = 'Year';
    const quarter = 'Quarter';

    const dossier = {
        id: '2C50CE3F47E3D27B3EF5899C73E767BE',
        name: 'PromptInPrompt_Prompted Report as filter_nested prompt has default answer',
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
    let cart, yearPrompt, quarterPrompt;

    let { loginPage, promptObject, grid, libraryPage, promptEditor, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        cart = promptObject.shoppingCart;
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

    it('[TC67314] Prompt in prompt using prompted report in filter', async () => {
        yearPrompt = await promptObject.getPromptByName(year);

        // check nested prompt can be filtered
        await cart.clickElmInAvailableList(yearPrompt, '2015');
        await cart.addSingle(yearPrompt);
        await promptEditor.run();
        await promptObject.waitForPromptDetail(quarter);
        quarterPrompt = await promptObject.getPromptByName(quarter);
        await since('The default available element is supposed to be #{expected}, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(quarterPrompt))
            .toBe(4);
        await cart.addAll(quarterPrompt);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(quarter);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(quarter))
            .toEqual('2015 Q1, 2015 Q2, 2015 Q3, 2015 Q4');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(5);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Quarter' }))
            .toBe('2015 Q1');

        //re-prompt, choose different answers in first prompt, nested prompt should be filtered
        await promptEditor.reprompt();
        yearPrompt = await promptObject.getPromptByName(year);
        await cart.clickElmInAvailableList(yearPrompt, '2016');
        await cart.addSingle(yearPrompt);
        await promptEditor.run();
        await promptObject.waitForPromptDetail(quarter);
        quarterPrompt = await promptObject.getPromptByName(quarter);
        await since('The available element is supposed to be #{expected}, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(quarterPrompt))
            .toBe(8);
        await cart.addAll(quarterPrompt);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(quarter);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(quarter))
            .toEqual('2015 Q1, 2015 Q2, 2015 Q3, 2015 Q4, 2016 Q1, 2016 Q2, 2016 Q3, 2016 Q4');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(9);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Quarter' }))
            .toBe('2015 Q1');
    });
});

export const config = specConfiguration;
