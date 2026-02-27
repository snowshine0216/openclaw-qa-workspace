import { customCredentials } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_prompt') };

describe('Object Prompt - Filter', () => {
    const promptName = 'Objects';

    const dossier1 = {
        id: '00F4F4F0476A59EB5CFBB6812F655034',
        name: 'Object_Filter_radio button',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const dossier2 = {
        id: '0C5390D744EABDDE37F8D780E1B4E267',
        name: 'Object(filter with prompt) prompt in Metric Conditionality',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const dossier3 = {
        id: 'CADF8F2C45C925EA2C935CBC7E6362B0',
        name: 'Object_Prompt in Prompt filter',
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

    let { loginPage, rsdGrid, grid, promptObject, libraryPage, promptEditor, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC66978] Object prompt using filter as object', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossierNoWait(dossier1.name);
        await promptEditor.waitForEditor();

        // check the default data
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toEqual('Quarter=Q3 Filter');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Region', 'Quarter', 'Metrics', 'Cost']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Central', '2014 Q3', '$284,970']);

        //re-prompt, add/remove answers
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(promptName);
        await promptObject.radioButton.selectRadioButtonByName(prompt, 'Region Contains South Filter');
        // view summary and run
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toEqual('Region Contains South Filter');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['South', '2014 Q1', '$216,604']);
    });

    it('[TC66979] Object prompt - Validate filter prompt used in Metric Conditionality', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossierNoWait(dossier2.name);
        await promptEditor.waitForEditor();

        // check the default UI and data
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC66979', 'DefaultUI');
        await promptEditor.run();
        await promptObject.waitForPromptDetail('Quarter selection');
        const nest1 = await promptObject.getPromptByName('Quarter selection');
        await since('Count of quarter selection is supposed to be "#{expected}", instead we get "#{actual}"')
            .expect(await promptObject.getItemCountText(nest1))
            .toBe('1 - 16 of 16');
        await since('Selected cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getSelectedCartItemCount(nest1))
            .toBe(1);
        // edit nested prompt answer
        await promptObject.shoppingCart.clickElmInSelectedList(nest1, '2016 Q3');
        await promptObject.shoppingCart.removeSingle(nest1);
        await promptObject.shoppingCart.clickElmInAvailableList(nest1, '2014 Q1');
        await promptObject.shoppingCart.addSingle(nest1);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Quarter selection');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Quarter selection'))
            .toEqual('2014 Q1');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(9);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(
                await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost with Conditionality Prompt' })
            )
            .toBe('214,763');

        //re-prompt, choose another filter
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(promptName);
        await promptObject.shoppingCart.clickElmInSelectedList(prompt, 'Select a Quarter');
        await promptObject.shoppingCart.removeSingle(prompt);
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Product = ?');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toEqual('Product = ?');
        await promptEditor.run();
        await promptObject.waitForPromptDetail('Customers segmentation by shopping cart content');
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC66979', 'NestedHierarchyPrompt');
        const nest2 = await promptObject.getPromptByName('Customers segmentation by shopping cart content');
        await promptObject.shoppingCart.clickElmLinkInAvailableList(nest2, 'Category');
        await promptObject.shoppingCart.clickElmInAvailableList(nest2, 'Books');
        await promptObject.shoppingCart.addSingle(nest2);
        await promptObject.shoppingCart.clickElmInAvailableList(nest2, 'Electronics');
        await promptObject.shoppingCart.addSingle(nest2);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Customers segmentation by shopping cart content');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary('Customers segmentation by shopping cart content'))
            .toEqual('CategoryIn ListBooks, Electronics');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(9);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(
                await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost with Conditionality Prompt' })
            )
            .toBe('3,181,853');

        //re-prompt, choose another filter
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(promptName);
        await promptObject.shoppingCart.clickElmInSelectedList(prompt, 'Product = ?');
        await promptObject.shoppingCart.removeSingle(prompt);
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Age = ?');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptEditor.run();
        await promptObject.waitForPromptDetail('Customers segmentation by age');
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC66979', 'NestedValuePrompt');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(9);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(
                await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost with Conditionality Prompt' })
            )
            .toBe('3,894,868');
    });

    it('[TC66980] Object prompt using filter with prompt in prompt as object', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier3,
        });
        await libraryPage.openDossierNoWait(dossier3.name);
        await promptEditor.waitForEditor();

        // run with default data
        await promptEditor.run();
        await promptEditor.run();
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Cameras', '$900,830']);

        //re-prompt, remove answers
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(promptName);
        await promptObject.shoppingCart.clickElmInSelectedList(prompt, 'Prompt-in-prompt Filter');
        await promptObject.shoppingCart.removeSingle(prompt);
        // view summary and run
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkEmptySummary(promptName))
            .toEqual('No Selection');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Art & Architecture', '$110,012']);
    });
});

export const config = specConfiguration;
