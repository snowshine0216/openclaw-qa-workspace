import { customCredentials } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_prompt') };
const project = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

describe('Object Prompt - Standalone', () => {
    const promptName = 'Objects';

    const dossier_attribute = {
        id: '0DEC42AA43DBE4EF38C67BBE73123639',
        name: 'Object_Search all attributes_Tree',
        project,
    };

    const dossier_custom_group = {
        id: 'F19F11444E1FBD681F872384F1D34D1B',
        name: 'Object_Custom Group_Checkbox',
        project,
    };

    const dossier_fact = {
        id: 'FADA41E345CBFE0D79D7E9B5DE24A205',
        name: 'Object_Fact_Pull down',
        project,
    };

    const dossier_consolidation = {
        id: 'CBD9A93D436536252053A4BB139712FC',
        name: 'Object_Consolidation_List',
        project,
    };

    const dossier_report = {
        id: '667C0CBD4666AEFF1326A69BE0881C34',
        name: 'Object_Report',
        project,
    };

    const dossier_template = {
        id: '876BB3D24993FAFB3E048398F5CAB333',
        name: 'Object_Template_2Chapters',
        project,
    };

    const dossier_combination = {
        id: 'A3C7D9C049E4448CA58F38AE652030F4',
        name: 'Object_Combination_Checkbox_2Panels',
        project,
    };

    const browserWindow = {
        
        width: 1600,
        height: 1000,
    };
    const { credentials } = specConfiguration;
    let prompt;

    let { loginPage, promptObject, rsdGrid, grid, libraryPage, promptEditor, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC67045] Object prompt using attributes as object with tree style', async () => {
        await resetDossierState({ credentials, dossier: dossier_attribute });
        await libraryPage.openDossierNoWait(dossier_attribute.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(promptName);

        // Expand node and answer prompt
        await promptObject.tree.scrollTreeToBottom(prompt);
        await promptObject.tree.expandEle(prompt, 'Schema Objects. Folder for all schema objects');
        await promptObject.tree.expandEle(prompt, 'Attributes');
        await promptObject.tree.expandEle(prompt, 'Customers');
        // Add answer by select node
        await promptObject.tree.clickEleName(prompt, 'Age Range');
        await promptObject.shoppingCart.addSingle(prompt);
        await since('Add "Age Range", selected cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getSelectedCartItemCount(prompt))
            .toBe(1);
        await promptObject.tree.collapseEle(prompt, 'Customers');

        ///// Undo: DE170766
        // Search in different nodes
        await promptObject.tree.collapseEle(prompt, 'Attributes');
        await promptObject.tree.clickEleName(prompt, 'Attributes');
        await promptObject.shoppingCart.searchFor(prompt, 'Year');
        await dossierPage.sleep(3000); // wait for search result
        await promptObject.tree.scrollTreeToBottom(prompt);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC67045', 'SearchResultYear');
        await promptObject.tree.clickEleName(prompt, 'Facts');
        await promptObject.shoppingCart.clearAndSearch(prompt, 'Year');
        await promptObject.tree.scrollTreeToBottom(prompt);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC67045', 'SearchYearInFacts');

        // view summary and run
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toEqual('Age Range');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Age Range']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['24 and under']);
    });

    it('[TC66983] Object prompt using custom group as object', async () => {
        await resetDossierState({ credentials, dossier: dossier_custom_group });
        await libraryPage.openDossierNoWait(dossier_custom_group.name);
        await promptEditor.waitForEditor();
        // check the default UI
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC66983', 'ObjectCustomGroupUI');
        prompt = await promptObject.getPromptByName(promptName);

        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toEqual('Age Groups, Customers Deciling');
        // check data of default selection
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Age Groups', 'Customer Country', 'Customers Deciling', 'Metrics', 'Cost']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['< 25', 'USA', 'All Customers', '$2,591,647']);

        //re-prompt, change prompt answer
        await promptEditor.reprompt();
        await promptObject.checkBox.clickCheckboxByName(prompt, 'Age Groups');
        await promptObject.checkBox.clickCheckboxByName(prompt, 'Customers Deciling');

        // view summary and run dossier
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkEmptySummary(promptName))
            .toEqual('No Selection');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Customer Country', 'Metrics', 'Cost']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['USA', '$29,730,085']);
    });

    it('[TC66981] Object prompt using fact as object', async () => {
        await resetDossierState({ credentials, dossier: dossier_fact });
        await libraryPage.openDossierNoWait(dossier_fact.name);
        await promptEditor.waitForEditor();
        // check the default UI
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC66981', 'ObjectFactUI');
        prompt = await promptObject.getPromptByName(promptName);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toEqual('Cost');
        // check data of Cost fact
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(9);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Metric with Fact Prompt' }))
            .toBe('$4,265,043.48');

        //re-prompt, change prompt answer
        await promptEditor.reprompt();
        await promptObject.pulldown.selectPullDownItem(prompt, 'Revenue');

        // view summary and run dossier
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toEqual('Revenue');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(9);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Metric with Fact Prompt' }))
            .toBe('$5,029,366.25');
    });

    it('[TC66982] Object prompt using consolidation as object', async () => {
        await resetDossierState({ credentials, dossier: dossier_consolidation });
        await libraryPage.openDossierNoWait(dossier_consolidation.name);
        await promptEditor.waitForEditor();
        // check the default UI
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC66982', 'ObjectConsolidationUI');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Consolidation');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Consolidation'))
            .toEqual('2015 & 2016, Seasons');
        // check data of default selection
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Customer Country', '2015 & 2016', 'Seasons', 'Metrics', 'Cost']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['USA', '2016 - 2015', 'Winter', '$722,050']);

        //re-prompt, change prompt answer
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName('Consolidation');
        await promptObject.checkBox.clickCheckboxByName(prompt, '2015 & 2016');

        // view summary and run dossier
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Consolidation');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Consolidation'))
            .toEqual('Seasons');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Customer Country', 'Seasons', 'Metrics', 'Cost']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['USA', 'Winter', '$7,109,298']);
    });

    it('[TC66986] Object prompt using report as object', async () => {
        await resetDossierState({ credentials, dossier: dossier_report });
        await libraryPage.openDossierNoWait(dossier_report.name);
        await promptEditor.waitForEditor();
        // check the default UI and data
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC66986', 'ObjectReportUI');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toEqual('Region Contains North, Year=2015');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(3);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2015');

        //re-prompt, add/remove answers
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(promptName);
        await promptObject.shoppingCart.clickElmInSelectedList(prompt, 'Year=2015');
        await promptObject.shoppingCart.removeSingle(prompt);

        // view summary and run
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toEqual('Region Contains North');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(7);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2014');
    });

    it('[TC66985] Object prompt using template as object', async () => {
        await resetDossierState({ credentials, dossier: dossier_template });
        await libraryPage.openDossierNoWait(dossier_template.name);
        await promptEditor.waitForEditor();
        // check the default UI and data
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC66985', 'ObjectTemplateUI', {
            tolerance: 0.3,
        });
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(16);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Call Center' }))
            .toBe('Milwaukee');

        //re-prompt, add/remove answers
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(promptName);
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Inventory Analysis');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.clickElmInSelectedList(prompt, 'Call Center Analysis');
        await promptObject.shoppingCart.removeSingle(prompt);

        // view summary and run
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toEqual('Inventory Analysis');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.isTableExist('Visualization 1'))
            .toBe(false);
    });

    it('[TC66984] Object prompt using combination of attribute, consolidation and custom group as object', async () => {
        await resetDossierState({ credentials, dossier: dossier_combination });
        await libraryPage.openDossierNoWait(dossier_combination.name);
        await promptEditor.waitForEditor();
        // check data of default selection
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('Grid header count is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.getHeaderCount('Visualization 1'))
            .toBe(4);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Country' }))
            .toBe('USA');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Seasons' }))
            .toBe('Winter');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Top 5 Contributors vs. All' }))
            .toBe('Top 5 Customers');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$10,027');
        // re-prompt, change prompt answer to use different combination
        // attribute and custom group
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(promptName);
        await promptObject.checkBox.clickCheckboxByName(prompt, 'Seasons');
        // view summary and run dossier
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toEqual('Country, Top 5 Contributors vs. All');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('Grid header count is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.getHeaderCount('Visualization 1'))
            .toBe(3);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Country' }))
            .toBe('USA');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Top 5 Contributors vs. All' }))
            .toBe('Top 5 Customers');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$45,141');

        // consolidation and custom group
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(promptName);
        await promptObject.checkBox.clickCheckboxByName(prompt, 'Seasons');
        await promptObject.checkBox.clickCheckboxByName(prompt, 'Country');
        // view summary and run dossier
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toEqual('Top 5 Contributors vs. All, Seasons');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('Grid header count is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.getHeaderCount('Visualization 1'))
            .toBe(3);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Seasons' }))
            .toBe('Winter');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Top 5 Contributors vs. All' }))
            .toBe('Top 5 Customers');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$10,027');

        // consolidation and attribute
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(promptName);
        await promptObject.checkBox.clickCheckboxByName(prompt, 'Top 5 Contributors vs. All');
        await promptObject.checkBox.clickCheckboxByName(prompt, 'Country');
        // view summary and run dossier
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toEqual('Country, Seasons');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('Grid header count is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.getHeaderCount('Visualization 1'))
            .toBe(3);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Country' }))
            .toBe('USA');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Seasons' }))
            .toBe('Winter');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$6,330,348');
    });
});

export const config = specConfiguration;
