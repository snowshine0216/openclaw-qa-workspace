import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_prompt') };
const specName = 'HQ_ShoppingCart';

describe('HQ Prompt - Shopping Cart', () => {
    const HQPromptName1 = 'All Hierarchies';
    const HQPromptName2 = 'Predefined Hierarchies';
    const HQPromptName3 = 'Time';
    const AQPromptName1 = 'Attribute qualification';
    const MQPromptName1 = 'Metric qualification';
    const dossier1 = {
        id: '07348515420341B530C442A2DEB5B9C7',
        name: 'All hierarchies-ShoppingCart-FolderStructure-DefaultOR-SinglePersonalAnswer',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const dossier2 = {
        id: '90A660E0470C56B5ACCA83840CCD471E',
        name: 'Predefined Hierarchy-ShoppingCart-SearchRequired-MaxPerList2',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const dossier3 = {
        id: 'E496CB3D472006448253A4B7E24C20A8',
        name: 'DE283313',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const browserWindow = {
        width: 1600,
        height: 1000,
    };
    let prompt;
    const { credentials } = specConfiguration;
    let { loginPage, grid, dossierPage, libraryPage, promptEditor, promptObject } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC65393]HQ with Shopping Cart style - Answer prompt in all hierarchies ', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossierNoWait(dossier1.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(HQPromptName1);

        // check the default UI
        await since('The default hierarchies is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getAvailableCartItemCount(prompt))
            .toBe(4);
        // Click 'Customers' name to enter Customers folder
        await promptObject.shoppingCart.clickElmLinkInAvailableList(prompt, 'Customers');
        await since('The available element of Customers is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getAvailableCartItemCount(prompt))
            .toBe(7);
        // Click 'Customer Age' name to enter Customers folder
        await promptObject.shoppingCart.clickElmLinkInAvailableList(prompt, 'Customer Age');
        await since('The available element of Customers Age is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getAvailableCartItemCount(prompt))
            .toBe(7);
        await promptObject.shoppingCart.searchFor(prompt, '2');
        await since('Search result of "2" is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getAvailableCartItemCount(prompt))
            .toBe(0);
        await promptObject.shoppingCart.clearAndSearch(prompt, '20');
        await since('Search result of "20" is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getAvailableCartItemCount(prompt))
            .toBe(1);
        // Answer prompt using 'select'
        // Click 20 to add
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, '20');
        await promptObject.shoppingCart.addSingle(prompt);
        await since('The text for Nth item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toEqual('Customer Age\nSelect\nIn List\n20');
        // Open folder dropdown
        await promptObject.pulldown.togglePullDownList(prompt);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC65393', 'FolderDropDown', { tolerance: 0.2 });
        // Switch to Customers folder
        await promptObject.tree.clickEleName(prompt, 'Customers');
        // Answer prompt using 'qualify'
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Customer');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.openFormDropdown(prompt, 2);
        await promptObject.shoppingCart.selectForm(prompt, 'Last Name');
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 2);
        await promptObject.shoppingCart.inputValues(prompt, 'Wendy');
        await promptObject.shoppingCart.confirmValues(prompt);
        // check prompt summary and run
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(HQPromptName1);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkMultiQualSummary(HQPromptName1))
            .toEqual('Customer AgeIn List20\nOR\nCustomerLast Name Greater than or equal toWendy');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer' }))
            .toBe('Abriyelyan');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Discount %' }))
            .toBe('2.0%');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Profit' }))
            .toBe('$502');
    });

    it('[TC65394]HQ with Shopping Cart style - Check search required', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossierNoWait(dossier2.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(HQPromptName2);

        // check the default UI
        await since('The default hierarchies is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getAvailableCartItemCount(prompt))
            .toBe(3);
        // Enter Customers -> Customer folder
        await promptObject.shoppingCart.clickElmLinkInAvailableList(prompt, 'Customers');
        await promptObject.shoppingCart.clickElmLinkInAvailableList(prompt, 'Customer');
        await since('The element of search required is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getAvailableCartItemCount(prompt))
            .toBe(0);
        // Answer prompt
        await promptObject.shoppingCart.clearAndSearch(prompt, 'alen');
        await since('Current page index should be #{expected} but is #{actual}')
            .expect(await promptObject.getItemCountText(prompt))
            .toBe('1 - 28 of 28');
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Aaby:Alen');
        await promptObject.shoppingCart.addSingle(prompt);
        // clear search
        await promptObject.shoppingCart.clearAndSearch(prompt, '');
        await since('The element of clear search required is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getAvailableCartItemCount(prompt))
            .toBe(0);
        await since('The text for Nth item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toEqual('Customer\nIn List\nAaby:Alen');

        // check prompt summary and run
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(HQPromptName2);
        await since('Prompt summary is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkQualSummary(HQPromptName2))
            .toBe('CustomerIn ListAaby:Alen');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(2);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer Age' }))
            .toBe('73');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer Email' }))
            .toBe('aaaby54@yahoo.demo');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Discount %' }))
            .toBe('0.1%');
    });

    it('[TC92864_01]AQ/HQ/MQ with Shopping Cart style - Check delete group condition in Library prompt', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier3,
        });
        await libraryPage.openDossierNoWait(dossier3.name);
        await promptEditor.waitForEditor();
        // Check delete group condition in HQ
        prompt = await promptObject.getPromptByName(HQPromptName3);
        await promptObject.shoppingCart.clickNthSelectedObj(prompt, 1);
        await promptObject.shoppingCart.deleteSingle(prompt, 1);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC92864_01', 'remove expression in HQ prompt', {
            tolerance: 0.1,
        });
        await promptObject.shoppingCart.clickNthSelectedObj(prompt, 1);
        await promptObject.shoppingCart.deleteSingle(prompt, 1);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC92864_02', 'remove expression in HQ prompt', {
            tolerance: 0.1,
        });
        await promptObject.shoppingCart.clickNthSelectedObj(prompt, 1);
        await promptObject.shoppingCart.deleteSingle(prompt, 1);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC92864_03', 'remove expression in HQ prompt', {
            tolerance: 0.1,
        });
        await promptObject.shoppingCart.clickNthSelectedObj(prompt, 1, true);
        await promptObject.shoppingCart.deleteSingle(prompt, 1, true);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC92864_04', 'remove expression in HQ prompt', {
            tolerance: 0.1,
        });

        // Check delete group condition in AQ
        prompt = await promptObject.getPromptByName(AQPromptName1);
        await promptObject.selectPromptByIndex({ index: '2', promptName: AQPromptName1 });
        await promptEditor.waitForEditor();
        await promptObject.shoppingCart.clickNthSelectedObj(prompt, 3, true);
        await promptObject.shoppingCart.deleteSingle(prompt, 3);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC92864_05', 'remove expression in AQ prompt', {
            tolerance: 0.1,
        });
        await promptObject.shoppingCart.clickNthSelectedObj(prompt, 2, true);
        await promptObject.shoppingCart.deleteSingle(prompt, 2);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC92864_06', 'remove expression in AQ prompt', {
            tolerance: 0.1,
        });
        await promptObject.shoppingCart.clickNthSelectedObj(prompt, 2, true);
        await promptObject.shoppingCart.deleteSingle(prompt, 2);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC92864_07', 'remove expression in AQ prompt', {
            tolerance: 0.1,
        });
        await promptObject.shoppingCart.clickNthSelectedObj(prompt, 1, true);
        await promptObject.shoppingCart.deleteSingle(prompt, 1, true);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC92864_08', 'remove expression in AQ prompt', {
            tolerance: 0.1,
        });

        // Check delete group condition in MQ
        prompt = await promptObject.getPromptByName(MQPromptName1);
        await promptObject.selectPromptByIndex({ index: '3', promptName: MQPromptName1 });
        await promptEditor.waitForEditor();
        await promptObject.shoppingCart.clickNthSelectedObj(prompt, 2, true);
        await promptObject.shoppingCart.deleteSingle(prompt, 2);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC92864_09', 'remove expression in MQ prompt', {
            tolerance: 0.1,
        });
        await promptObject.shoppingCart.clickNthSelectedObj(prompt, 2, true);
        await promptObject.shoppingCart.deleteSingle(prompt, 2);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC92864_10', 'remove expression in MQ prompt', {
            tolerance: 0.1,
        });
        await promptObject.shoppingCart.clickNthSelectedObj(prompt, 2, true);
        await promptObject.shoppingCart.deleteSingle(prompt, 2);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC92864_11', 'remove expression in MQ prompt', {
            tolerance: 0.1,
        });
        await promptObject.shoppingCart.clickNthSelectedObj(prompt, 1, true);
        await promptObject.shoppingCart.deleteSingle(prompt, 1, true);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC92864_12', 'remove expression in MQ prompt', {
            tolerance: 0.1,
        });

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(HQPromptName3);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC92864_13', 'remove all expression', {
            tolerance: 0.1,
        });
        await promptEditor.cancelEditor();
    });

    it('[TC92864_02]AQ/HQ/MQ with Shopping Cart style - Check delete group condition in Library prompt', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier3,
        });
        await libraryPage.openDossierNoWait(dossier3.name);
        await promptEditor.waitForEditor();
        // Check delete group condition in HQ
        prompt = await promptObject.getPromptByName(HQPromptName3);
        await promptObject.shoppingCart.clickNthSelectedObj(prompt, 2, true);
        await promptObject.shoppingCart.deleteSingle(prompt, 2);
        // Add new expression
        await promptObject.shoppingCart.clickNthSelectedObj(prompt, 2, true);
        await promptObject.tree.clickEleName(prompt, 'Year');
        await promptObject.shoppingCart.addSingle(prompt);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC92864_14', 'add expression in HQ prompt', {
            tolerance: 0.1,
        });
        // Delete all group condition in HQ
        await promptObject.shoppingCart.clickNthSelectedObj(prompt, 2, true);
        await promptObject.shoppingCart.deleteSingle(prompt, 2);
        await promptObject.shoppingCart.clickNthSelectedObj(prompt, 2, true);
        await promptObject.shoppingCart.deleteSingle(prompt, 2);
        await promptObject.shoppingCart.clickNthSelectedObj(prompt, 2, true);
        await promptObject.shoppingCart.deleteSingle(prompt, 2);
        await promptObject.shoppingCart.clickNthSelectedObj(prompt, 1, true);
        await promptObject.shoppingCart.deleteSingle(prompt, 1, true);
        // Add new expression
        await promptObject.tree.clickEleName(prompt, 'Year');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.openNthExprMenu(prompt, 2);
        await promptObject.shoppingCart.chooseNthExpr(prompt, 4);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC92864_15', 'add expression in HQ prompt', {
            tolerance: 0.1,
        });
        await promptEditor.cancelEditor();
    });
});

export const config = specConfiguration;
