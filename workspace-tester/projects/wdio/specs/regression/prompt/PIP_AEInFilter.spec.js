import { customCredentials } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_prompt') };

describe('Prompt in Prompt - AE prompt in filter', () => {
    const category = 'Category';
    const subcategory = 'Subcategory';
    const item = 'Item';
    const year = 'Year';
    const month = 'Month';

    const dossier1 = {
        id: 'FF64CEAF4FFBE213997A0EB746ADA095',
        name: 'PromptInPrompt_2 to 1_Both have default answer',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier2 = {
        id: '65636AF547744E3C3A1C9CBD06A050A3',
        name: 'PromptInPrompt_1 to 2_First has default answer',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier3 = {
        id: 'ED6A6D754B0BE148A861E0809F434A58',
        name: 'PromptInPrompt_2 groups_NoDefaultAnswer',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier4 = {
        id: '763D759344348CD9D6D35BA4D2D522D3',
        name: 'PromptInPrompt_3 nested prompts',
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
    let cart, categoryPrompt, subcategoryPrompt, itemPrompt, yearPrompt, monthPrompt;

    let { loginPage, promptObject, rsdPage, rsdGrid, grid, libraryPage, promptEditor, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        cart = promptObject.shoppingCart;
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC67310] Prompt in prompt 2 prompts to 1 nested prompt', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossierNoWait(dossier1.name);
        await promptEditor.waitForEditor();

        // check the default UI and data
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC67310', 'InitialRender2Prompts');

        await promptEditor.run();
        await promptObject.waitForPromptDetail(item);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC67310', 'NestedDefaultAnswer', {
            tolerance: 0.2,
        });
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Category', 'Subcategory', 'Item']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Electronics', 'Audio Equipment', 'Harman Kardon Digital Surround Sound Receiver']);

        //re-prompt, choose different answers in Category and Subcategory, nested prompt should have no available item
        await promptEditor.reprompt();
        subcategoryPrompt = await promptObject.getPromptByName(subcategory);
        await cart.clickElmInAvailableList(subcategoryPrompt, 'Art & Architecture');
        await cart.addSingle(subcategoryPrompt);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(category);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC67310', 'DifferentInCategory&Subcategory');

        await promptEditor.run();
        await promptObject.waitForPromptDetail(item);
        itemPrompt = await promptObject.getPromptByName(item);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC67310', 'NoDefalutAnswer');

        await cart.searchFor(itemPrompt, '*');
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC67310', 'NoItem');

        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(item);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkEmptySummary(item))
            .toEqual('No Selection');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // First level prompt has answer while no answer for nested prompt, returns all data
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Category', 'Subcategory', 'Item']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Books', 'Art & Architecture', '100 Places to Go While Still Young at Heart']);

        //re-prompt, choose same answer in Category and Subcategory
        await promptEditor.reprompt();
        categoryPrompt = await promptObject.getPromptByName(category);
        await cart.clickElmInSelectedList(categoryPrompt, 'Electronics');
        await cart.removeSingle(categoryPrompt);
        await cart.clickElmInAvailableList(categoryPrompt, 'Books');
        await cart.addSingle(categoryPrompt);
        await promptEditor.run();
        await promptObject.waitForPromptDetail(item);
        itemPrompt = await promptObject.getPromptByName(item);
        await cart.searchFor(itemPrompt, '*');
        await cart.addAll(itemPrompt);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(item);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC67310', 'ItemSummary');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Category', 'Subcategory', 'Item']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Books', 'Art & Architecture', '100 Places to Go While Still Young at Heart']);
    });

    it('[TC67311] Prompt in prompt 1 prompt to 2 nested prompt', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossierNoWait(dossier2.name);
        await promptEditor.waitForEditor();

        // check the default UI and data
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(category);
        await since('Default prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(category))
            .toEqual('Books');
        await promptEditor.run();
        await promptObject.waitForPromptDetail(item);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC67311', 'NoDefaultAnswer');

        // choose different answers in Item and Subcategory
        subcategoryPrompt = await promptObject.getPromptByName(subcategory);
        itemPrompt = await promptObject.getPromptByName(item);
        await cart.clickElmInAvailableList(itemPrompt, '100 Places to Go While Still Young at Heart');
        await cart.addSingle(itemPrompt);
        await cart.clickElmInAvailableList(subcategoryPrompt, 'Sports & Health');
        await cart.addSingle(subcategoryPrompt);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The rsd grid element display should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.isGridPresnt())
            .toBe(false);

        //re-prompt, change answer in first level prompt, nested prompt answer is gone
        await promptEditor.reprompt();
        categoryPrompt = await promptObject.getPromptByName(category);
        await cart.clickElmInAvailableList(categoryPrompt, 'Electronics');
        await cart.addSingle(categoryPrompt);
        await promptEditor.run();
        await promptObject.waitForPromptDetail(item);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC67311', 'NoPreviousAnswer');

        // search for filtered item, nested prompt items are filtered
        subcategoryPrompt = await promptObject.getPromptByName(subcategory);
        await cart.clickElmInAvailableList(subcategoryPrompt, 'Business');
        await cart.addSingle(subcategoryPrompt);
        await cart.searchFor(subcategoryPrompt, 'Rock');
        await since('Search result for filtered item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await cart.getAvailableCartItemCount(subcategoryPrompt))
            .toEqual(0);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(item);
        await since('Item prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkEmptySummary(item))
            .toEqual('No Selection');
        await since('Subcategory prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(subcategory))
            .toEqual('Business');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Category', 'Subcategory', 'Item']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Books', 'Business', 'Working With Emotional Intelligence']);
    });

    it('[TC67312] Prompt in prompt 2 groups of prompt in prompt', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier3,
        });
        await libraryPage.openDossierNoWait(dossier3.name);
        await promptEditor.waitForEditor();
        yearPrompt = await promptObject.getPromptByName(year);
        categoryPrompt = await promptObject.getPromptByName(category);

        // check nested prompt for different groups
        await cart.clickElmInAvailableList(yearPrompt, '2014');
        await cart.addSingle(yearPrompt);
        await cart.clickElmInAvailableList(categoryPrompt, 'Music');
        await cart.addSingle(categoryPrompt);
        await promptEditor.run();
        await promptObject.waitForPromptDetail(month);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC67312', 'NestedPrompt');

        monthPrompt = await promptObject.getPromptByName(month);
        subcategoryPrompt = await promptObject.getPromptByName(subcategory);
        await cart.clickElmInAvailableList(monthPrompt, 'Feb 2014');
        await cart.addSingle(monthPrompt);
        await cart.clickElmInAvailableList(subcategoryPrompt, 'Country');
        await cart.addSingle(subcategoryPrompt);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(16);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Month' }))
            .toBe('Feb 2014');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Item' }))
            .toBe('Strong Enough');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$1,262');
        //re-prompt, change one prompt answer, the other group doesn't change
        await promptEditor.reprompt();
        yearPrompt = await promptObject.getPromptByName(year);
        await cart.clickElmInSelectedList(yearPrompt, '2014');
        await cart.removeSingle(yearPrompt);
        await cart.clickElmInAvailableList(yearPrompt, '2015');
        await cart.addSingle(yearPrompt);
        await promptEditor.run();
        await promptObject.waitForPromptDetail(month);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC67312', 'SubcategoryHasPreviousAnswer');

        subcategoryPrompt = await promptObject.getPromptByName(subcategory);
        await cart.clickElmInSelectedList(subcategoryPrompt, 'Country');
        await cart.removeSingle(subcategoryPrompt);
        await cart.clickElmInAvailableList(subcategoryPrompt, 'Rock');
        await cart.addSingle(subcategoryPrompt);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Month' }))
            .toBe('Jan 2014');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Item' }))
            .toBe('The Doors');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$342');
    });

    it('[TC67313] Prompt in prompt 3 tiers of prompts', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier4,
        });
        await libraryPage.openDossierNoWait(dossier4.name);
        await promptEditor.waitForEditor();
        categoryPrompt = await promptObject.getPromptByName(category);

        // answer first level prompt, 2nd level prompt is fitered, 3rd level prompt is not filtered
        await cart.clickElmInAvailableList(categoryPrompt, 'Books');
        await cart.addSingle(categoryPrompt);
        await promptEditor.run();
        await promptObject.waitForPromptDetail(subcategory);
        subcategoryPrompt = await promptObject.getPromptByName(subcategory);
        await since('Count of Subcategory is supposed to be "#{expected}", instead we get "#{actual}"')
            .expect(await promptObject.getItemCountText(subcategoryPrompt))
            .toBe('1 - 6 of 6');
        await promptEditor.run();
        await promptObject.waitForPromptDetail(item);
        itemPrompt = await promptObject.getPromptByName(item);
        await since('Count of Item is supposed to be "#{expected}", instead we get "#{actual}"')
            .expect(await promptObject.getItemCountText(itemPrompt))
            .toBe('1 - 30 of 360');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Subcategory' }))
            .toBe('Art & Architecture');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Item' }))
            .toBe('100 Places to Go While Still Young at Heart');

        // answer first and second level prompt, 3rd level prompt is filtered
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(category);
        await since('Previous prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(category))
            .toEqual('Books');
        await promptEditor.run();
        await promptObject.waitForPromptDetail(subcategory);
        subcategoryPrompt = await promptObject.getPromptByName(subcategory);
        await cart.addAll(subcategoryPrompt);
        await promptEditor.run();
        await promptObject.waitForPromptDetail(item);
        itemPrompt = await promptObject.getPromptByName(item);
        await since('Count of Item is supposed to be "#{expected}", instead we get "#{actual}"')
            .expect(await promptObject.getItemCountText(itemPrompt))
            .toBe('1 - 30 of 90');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Subcategory' }))
            .toBe('Art & Architecture');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Item' }))
            .toBe('100 Places to Go While Still Young at Heart');

        // only answer second level prompt, 3rd level prompt is filtered
        await promptEditor.reprompt();
        categoryPrompt = await promptObject.getPromptByName(category);
        await cart.clickElmInSelectedList(categoryPrompt, 'Books');
        await cart.removeSingle(categoryPrompt);
        await promptEditor.run();
        await promptObject.waitForPromptDetail(subcategory);
        subcategoryPrompt = await promptObject.getPromptByName(subcategory);
        await since('Count of Subcategory is supposed to be "#{expected}", instead we get "#{actual}"')
            .expect(await promptObject.getItemCountText(subcategoryPrompt))
            .toBe('1 - 24 of 24');
        await cart.clickElmInAvailableList(subcategoryPrompt, 'Business');
        await cart.addSingle(subcategoryPrompt);
        await promptEditor.run();
        await promptObject.waitForPromptDetail(item);
        itemPrompt = await promptObject.getPromptByName(item);
        await since('Count of Item is supposed to be "#{expected}", instead we get "#{actual}"')
            .expect(await promptObject.getItemCountText(itemPrompt))
            .toBe('1 - 16 of 16');
        await cart.clickElmInAvailableList(itemPrompt, 'Topgrading');
        await cart.addSingle(itemPrompt);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(2);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Subcategory' }))
            .toBe('Business');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Item' }))
            .toBe('Topgrading');
    });
});

export const config = specConfiguration;
