import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_prompt') };
const specName = 'Level Prompt';

describe('Level Prompt', () => {
    const LevelPromptName1 = 'level prompt';
    const dossier1 = {
        id: '76510CF346996DDBDAA235ADD6263352',
        name: 'Level-default answer-allow single personal answer',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const LevelPromptName2 = 'Level prompt - search for all attributes';
    const dossier2 = {
        id: '1DA664FD4A73294EFE4B48801C3DDF26',
        name: 'Level-all attributes-allow multiple personal answer-min1max3',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const LevelPromptName3 = 'Choose from a list of attributes/hierarchies to define level.';
    const dossier3 = {
        id: '092826A9473B23EB39FBE3AC25AA4819',
        name: 'Level-attribute&hierarchy-required',
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

    let { loginPage, dossierPage, grid, rsdGrid, libraryPage, promptEditor, promptObject } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC65001] Level prompt - check default answer and answer prompt with different levels', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossierNoWait(dossier1.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(LevelPromptName1);

        // check the default UI and default answer
        // await since('Default prompt answer is supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt,1)).toEqual('Call Center');
        await since('Default Available list is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getAvailableCartItemCount(prompt))
            .toBe(3);
        await since('Default Available list is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getSelectedCartItemCount(prompt))
            .toBe(1);
        // check prompt summary and run for default answer
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(LevelPromptName1);
        await since('Prompt summary of default answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(LevelPromptName1))
            .toBe('Call Center');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(16);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Profit with level prompt 1' }))
            .toBe('637545');

        // run with empty answer
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(LevelPromptName1);
        await promptObject.shoppingCart.removeAll(prompt);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(LevelPromptName1);
        await since('Prompt summary of empty answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkEmptySummary(LevelPromptName1))
            .toBe('No Selection');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(16);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Profit with level prompt 1' }))
            .toBe('5292786');

        // run with report level
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(LevelPromptName1);
        await since(
            'Previous answer is none, selected cart is supposed to have #{expected} elements, instead we get #{actual}'
        )
            .expect(await promptObject.shoppingCart.getSelectedCartItemCount(prompt))
            .toBe(0);
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Report Level');
        await promptObject.shoppingCart.addSingle(prompt);
        await since(
            'After "Add single", selected cart is supposed to have #{expected} elements, instead we get #{actual}'
        )
            .expect(await promptObject.shoppingCart.getSelectedCartItemCount(prompt))
            .toBe(1);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(LevelPromptName1);
        await since('Prompt summary is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(LevelPromptName1))
            .toBe('Report Level');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(16);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Profit with level prompt 1' }))
            .toBe('637545');

        // run with Country level
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(LevelPromptName1);
        await promptObject.shoppingCart.removeAll(prompt);
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Country');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(16);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Profit with level prompt 1' }))
            .toBe('4630374');

        // run with Country&Region&Report level
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(LevelPromptName1);
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Report Level');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Region');
        await promptObject.shoppingCart.addSingle(prompt);
        await since(
            'After add 2 elements, selected cart is supposed to have #{expected} elements, instead we get #{actual}'
        )
            .expect(await promptObject.shoppingCart.getSelectedCartItemCount(prompt))
            .toBe(3);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(LevelPromptName1);
        await since('Prompt summary is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(LevelPromptName1))
            .toBe('Country, Report Level, Region');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(16);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Profit with level prompt 1' }))
            .toBe('764376');
    });

    it('[TC65002] Level prompt - search for different attributes', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossierNoWait(dossier2.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(LevelPromptName2);
        const attrCount = await promptObject.getItemCountText(prompt);
        await since('The default selected in cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getSelectedCartItemCount(prompt))
            .toBe(1);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(LevelPromptName2);
        await since('Prompt summary is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(LevelPromptName2))
            .toBe('Report Level');
        await promptEditor.toggleViewSummary();
        // search with different values
        await promptObject.shoppingCart.clearAndSearch(prompt, 'Category');
        const searchResult = await promptObject.getItemCountText(prompt);
        await promptObject.shoppingCart.clearAndSearch(prompt, 'category');
        await since('Search result of category is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getItemCountText(prompt))
            .toBe(searchResult);
        await promptObject.shoppingCart.clearAndSearch(prompt, '*');
        await since('Search result of category is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getItemCountText(prompt))
            .toBe(attrCount);
        await promptObject.shoppingCart.clearAndSearch(prompt, ' ');
        await since('Search result of category is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getItemCountText(prompt))
            .toBe(attrCount);
        await promptObject.shoppingCart.clearAndSearch(prompt, "~!@#$%^&*(\\;</'");
        await since(
            'The Available list after Search Special Chars supposed to be #{expected}, instead we get #{actual}'
        )
            .expect(await promptObject.shoppingCart.getAvailableCartItemCount(prompt))
            .toBe(0);
        await promptObject.shoppingCart.clearAndSearch(prompt, '4/3/2020');
        await since('The Available list after Search Date supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getAvailableCartItemCount(prompt))
            .toBe(0);
        await promptObject.shoppingCart.clearAndSearch(prompt, 'Channel');
        await since('Search result of Channel is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getItemCountText(prompt))
            .toBe('1 - 12 of 12');
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Channel');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Country', 'Region', 'Call Center', 'Metrics', 'Profit', 'Profit with level prompt 2']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['USA', 'Central', 'Milwaukee', '$637,545', '637,545']);
    });

    it('[TC65003] Level prompt - check answer count limitation', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossierNoWait(dossier2.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(LevelPromptName2);

        // run with 0 answer
        await promptObject.shoppingCart.removeAll(prompt);
        await promptEditor.run();
        // click OK to close popup
        await promptEditor.dismissError();
        await since('Warning message of 0 answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe('You have made fewer selections than are required for this prompt. Please make more selections.');

        // run with 3 answers
        // add all can only add 3 elements
        await promptObject.shoppingCart.addAll(prompt);
        await since('After "Add all", selected cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getSelectedCartItemCount(prompt))
            .toBe(3);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute of DataInFirst3Levels should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Country', 'Region', 'Call Center', 'Metrics', 'Profit', 'Profit with level prompt 2']);
        await since('The attribute of DataInFirst3Levels should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['USA', 'Central', 'Milwaukee', '$637,545', '637,545']);

        // run with 1 answer
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(LevelPromptName2);
        // remove 2 elements
        await promptObject.shoppingCart.clickElmInSelectedList(prompt, '1 compound ID form');
        await promptObject.shoppingCart.removeSingle(prompt);
        await promptObject.shoppingCart.removeSingle(prompt);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The attribute of DataInThirdLevel should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Country', 'Region', 'Call Center', 'Metrics', 'Profit', 'Profit with level prompt 2']);
        await since('The attribute of DataInThirdLevel should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['USA', 'Central', 'Milwaukee', '$637,545', '5,293,624']);
    });

    it('[TC65004] Level prompt - switch page and check answers in different pages', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossierNoWait(dossier2.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(LevelPromptName2);

        // remove 'Report Level' and check 'Report Level' shows in every page
        await promptObject.shoppingCart.removeAll(prompt);
        await promptObject.goToNextPage(prompt);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC65004', 'ReportLevelInNextPage', {
            tolerance: 0.15,
        });
        await promptObject.goToLastPage(prompt);

        // answer prompt in different pages and run
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.goToFirstPage(prompt);
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, '111');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(LevelPromptName2);
        await since('Prompt summary is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(LevelPromptName2))
            .toBe('Report Level, 111');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute of ReportLevel&111 should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Country', 'Region', 'Call Center', 'Metrics', 'Profit', 'Profit with level prompt 2']);
        await since('The attribute of ReportLevel&111 should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['USA', 'Central', 'Milwaukee', '$637,545', '637,545']);
    });

    it('[TC65005] Level prompt - check answer required and answer prompt with hierarchy', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier3,
        });
        await libraryPage.openDossierNoWait(dossier3.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(LevelPromptName3);
        await promptEditor.run();
        // click OK to close popup
        await promptEditor.dismissError();
        await since('Error message for invalid action is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.pulldown.errorMsg(prompt))
            .toEqual('This prompt requires an answer.');

        // answer prompt with hierarchy
        await promptObject.shoppingCart.clearAndSearch(prompt, 'hierarchy with');
        await since('Search result of hierarchy with is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getItemCountText(prompt))
            .toBe('1 - 1 of 1');
        await promptObject.shoppingCart.clickElmInAvailableList(
            prompt,
            'This is a Hierarchy with a very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very Long Name'
        );
        await promptObject.shoppingCart.addSingle(prompt);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC65005', 'SelectedItemLongName');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(LevelPromptName3);
        await since('Prompt summary answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(LevelPromptName3))
            .toBe(
                'This is a Hierarchy with a very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very Long Name'
            );
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(16);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Profit with level prompt 3' }))
            .toBe('5,293,624');

        // answer prompt with hierarchy and attribute
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(LevelPromptName3);
        await promptObject.shoppingCart.clearAndSearch(prompt, 'country');
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Billing Coordinator Country/Territory');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(LevelPromptName3);
        await since('Prompt summary answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(LevelPromptName3))
            .toBe(
                'This is a Hierarchy with a very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very Long Name, Billing Coordinator Country/Territory'
            );
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(16);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Profit with level prompt 3' }))
            .toBe('5,293,624');
    });
});

export const config = specConfiguration;
