import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_prompt') };
const specName = 'AQ_ShoppingCart';

describe('AQ Prompt - Shopping Cart', () => {
    const AQPromptName1 = 'Customized Title -Attribute qualification';
    const AQPromptName2 = 'Attribute qualification';
    const AQPromptName3 = 'Daytime';
    const AQPromptName4 = 'AttrDE102292';
    const AQPromptName5 = 'Customer-multiform';

    const dossier1 = {
        id: '6A3F5AFE461CB2B91F290FB76A2ABF59',
        name: 'AQ-shoppingcart-required-min1max4',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const dossier2 = {
        id: '56786E7B4BC9A7D333E725BDA5F3D007',
        name: 'AQ-shoppingcart-default:qualify-default:In-default:OR',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const dossier3 = {
        id: 'D0495238485DF0C427C43D8D9231FAFE',
        name: 'AQ-shoppingcart-datetime',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const dossier4 = {
        id: '2DF0A3704E030BF665ED3CBB48644D7A',
        name: 'AQ-shoppingcart-special data',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const RSD = {
        id: '9CFBEC1D4C68CD6F0F27C7841C99F7FC',
        name: 'AQ-shoppingcart-multi form',
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

    let { loginPage, rsdGrid, grid, dossierPage, libraryPage, promptEditor, promptObject, reset } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    // Dossier 1
    it('[TC58922]Validating Attribute Qualification Prompt with Shopping Cart style- Check answer required and MinMax answer in Library Web ', async () => {
        // Open prompt
        //  a. There is default selected item:Age range. Take screenshot
        await resetDossierState({
            credentials: credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossierNoWait(dossier1.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(AQPromptName1);
        await since('Default prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(
                await promptObject.shoppingCart.isItemInSelectedListToEdit(
                    prompt,
                    'Age Range\nQualify\nDESC\nEquals\n25 to 34'
                )
            )
            .toBe(true);

        // Click 'Country' to add
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Country');
        // Continue to add antoher 4 times
        //  a. There is error mesage displayed on UI (more selectiong than allowed)
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.addSingle(prompt);
        await since('Error message for invalid action is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.pulldown.errorMsg(prompt))
            .toEqual('You have made more selections than are allowed for this prompt. Please remove some selections.');
        // Remove one item
        //  a. error msg disappear
        await promptObject.shoppingCart.clickNthSelectedItem(prompt, 2); //await prompt.shoppingCart.clickElmInSelectedListToEdit(prompt, 'CountryQualifyIDEqualsValue');
        await promptObject.shoppingCart.removeSingle(prompt);
        await since('Error message for invalid action is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.pulldown.errorMsg(prompt))
            .toEqual('');
        // Click Run directly
        //  a. check error dialog. Take screenshot
        await promptEditor.run();
        await since('Not complete prompt answer should trigger error message')
            .expect(await promptEditor.isErrorPresent())
            .toBe(true);
        // Click Ok in error message
        //  a. there is another error message displayed (answer not completed)
        await promptEditor.dismissError();
        await since('Error message for invalid action is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.pulldown.errorMsg(prompt))
            .toEqual('The condition for your answer is not completed.');
        // Click Country item1: Click Value link
        // Country item1: Input 1
        await promptObject.shoppingCart.clickNthSelectedItem(prompt, 2);
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 2);
        await promptObject.shoppingCart.inputValues(prompt, 1);
        await promptObject.shoppingCart.confirmValues(prompt);
        // Country item2: Click Value link
        // Country item2: Input 2
        await promptObject.shoppingCart.clickNthSelectedItem(prompt, 3);
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 3);
        await promptObject.shoppingCart.inputValues(prompt, 2);
        await promptObject.shoppingCart.confirmValues(prompt);
        // Country item3: Click Value link
        // Country item3: Input 3
        await promptObject.shoppingCart.clickNthSelectedItem(prompt, 4);
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 4);
        await promptObject.shoppingCart.inputValues(prompt, 3);
        await promptObject.shoppingCart.confirmValues(prompt);
        // view summary
        //  a. check selected item. Take screenshot
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName1);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkMultiQualSummary(AQPromptName1))
            .toEqual(
                'Age RangeDESC Equals25 to 34\nOR\nCountryID Equals1\nOR\nCountryID Equals2\nOR\nCountryID Equals3'
            );
        await promptEditor.toggleViewSummary();
        // Run prompt
        //  a. Take a screenshot(RunPromptResultWith4Answers) to check the resultClick 'Country'
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(21);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Age Range' }))
            .toBe('24 and under');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Country' }))
            .toBe('USA');
        // Re-prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName1);
        // Remove selected item (Age range)
        await promptObject.shoppingCart.clickNthSelectedItem(prompt, 1);
        await promptObject.shoppingCart.removeSingle(prompt);
        // Remove selected item (country=1)
        await promptObject.shoppingCart.clickNthSelectedItem(prompt, 1);
        await promptObject.shoppingCart.removeSingle(prompt);
        // Run prompt
        //  a. Take a screenshot(RunPromptResultWith2Answers) to check the result
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(11);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Age Range' }))
            .toBe('24 and under');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Country' }))
            .toBe('Spain');
        // Re-prommpt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName1);
        // Remove one selected item (country=2)
        await promptObject.shoppingCart.clickNthSelectedItem(prompt, 1);
        await promptObject.shoppingCart.removeSingle(prompt);
        // Remove another selected item (country=3)
        //await promptObject.shoppingCart.clickNthSelectedItem(prompt, 1);
        await promptObject.shoppingCart.removeSingle(prompt);
        // Run prompt(Error message box will shown)
        //  a. check error dialog. Take screenshot
        await promptEditor.run();
        await promptEditor.waitForMessageBox();
        // Click OK in error message box
        //  a. There is error mesage displayed on UI (prompt answer required
        await promptEditor.dismissError();
        await since('Error message for invalid action is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.pulldown.errorMsg(prompt))
            .toEqual('This prompt requires an answer.');
        // Cancel prompt
        await promptEditor.cancelEditor();
    });

    // Dossier 1
    it('[TC58923]Validating Attribute Qualification Prompt with Shopping Cart style- Check answer required and MinMax answer in Library Web', async () => {
        // Open prompt (Reset state)
        await resetDossierState({
            credentials: credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossierNoWait(dossier1.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(AQPromptName1);
        // Click Add to add 'Age Range' to selected list
        //  a. 'Age Range Qualify ID Equals Value' is added to selected list
        await promptObject.shoppingCart.addSingle(prompt);
        await since('Whether the item in selected list is supposed to be #{expected}, instead we have #{actual}')
            .expect(
                await promptObject.shoppingCart.isItemInSelectedListToEdit(
                    prompt,
                    'Age Range\nQualify\nID\nEquals\nValue'
                )
            )
            .toBe(true);
        // Select 'Age Range Qualify ID Equals Value'
        // Click Remove to remove 'Age Range Qualify ID Equals Value' from selected list
        //  a. 'Age Range Qualify ID Equals Value' is not in selected list
        await promptObject.shoppingCart.clickNthSelectedItem(prompt, 2);
        await promptObject.shoppingCart.removeSingle(prompt);
        await since('Whether the item added is supposed to be #{expected}, instead we have #{actual}')
            .expect(
                await promptObject.shoppingCart.isItemInSelectedListToEdit(
                    prompt,
                    'Age Range\nQualify\nID\nEquals\nValue',
                    true
                )
            )
            .toBe(false);
        // Delete 'Age Range Qualify DESC Equals 24 and under' by X
        //  a. 'Qualify DESC Equals 24 and under' is not in selected list
        await promptObject.shoppingCart.deleteSingle(prompt, 1, true);
        await since('Whether the item in selected list is supposed to be #{expected}, instead we have #{actual}')
            .expect(
                await promptObject.shoppingCart.isItemInSelectedListToEdit(
                    prompt,
                    'Age Range\nQualify\nID\nEquals\nValue'
                )
            )
            .toBe(false);
        // Click Add to add Customer to selected list
        await promptObject.shoppingCart.addSingle(prompt);
        // Customer item: Click qualifier button and select 'Select'
        await promptObject.shoppingCart.openTypeDropdown(prompt, 1);
        await promptObject.shoppingCart.selectType(prompt, 'Select');
        // Customer item: Click condition button and select 'Not In List'
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.selectCondition(prompt, 'Not In List');
        // Customer item: Click value link
        // Customer item: Click Add to add 'Aaby:Alen' and confirm the selection
        //  a. the item expression shoule be 'Customer Select Not In List Aaby:Alen'
        await promptObject.shoppingCart.openValueListEditor(prompt, 1);
        await promptObject.shoppingCart.addSingle(prompt, true);
        await promptObject.shoppingCart.confirmValues(prompt);
        await since('Whether the item in selected list is supposed to be #{expected}, instead we have #{actual}')
            .expect(
                await promptObject.shoppingCart.isItemInSelectedListToEdit(
                    prompt,
                    'Customer\nSelect\nNot In List\nAaby:Alen'
                )
            )
            .toBe(true);
        // Click Add to add Country to selected list
        await promptObject.shoppingCart.addSingle(prompt);
        // Country item: Click attribute form button and select 'DESC'
        await promptObject.shoppingCart.openFormDropdown(prompt, 1);
        await promptObject.shoppingCart.selectForm(prompt, 'DESC');
        // Country item: Click value link
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        // Country item: Click 'Browse values...'
        // Click Add to add  'USA' and confirm the selection
        await promptObject.shoppingCart.openBrowseValuesWindow(prompt);
        await promptObject.shoppingCart.addSingle(prompt, true);
        await promptObject.shoppingCart.confirmValues(prompt);
        // Click value link
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        // Input 'Spain' and confirm the input
        //  a. Take a screenshot(UICheckWith2Selections) to check current selection
        await promptObject.shoppingCart.clearValues(prompt);
        await promptObject.shoppingCart.inputValues(prompt, 'Spain');
        await promptObject.shoppingCart.confirmValues(prompt);
        await since('Whether the item in selected list is supposed to be #{expected}, instead we have #{actual}')
            .expect(
                await promptObject.shoppingCart.isItemInSelectedListToEdit(
                    prompt,
                    'Country\nQualify\nDESC\nEquals\nSpain'
                )
            )
            .toBe(true);
        await since('Whether the item in selected list is supposed to be #{expected}, instead we have #{actual}')
            .expect(
                await promptObject.shoppingCart.isItemInSelectedListToEdit(
                    prompt,
                    'Customer\nSelect\nNot In List\nAaby:Alen'
                )
            )
            .toBe(true);
        // Check view summary (Check Any selection expression)
        //  a. the view summary should be 'CustomerNot In ListAaby:Alen\nOR\nCountryDESC EqualsSpain'
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName1);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkMultiQualSummary(AQPromptName1))
            .toEqual('CountryDESC EqualsSpain\nOR\nCustomerNot In ListAaby:Alen');
        // Back to selection panel and select 'All selections'
        await promptEditor.toggleViewSummary();
        await promptObject.shoppingCart.chooseAllSelections(prompt);
        // Check view summary (Check All selections expression)
        //  a. the view summary should be 'CustomerNot In ListAaby:Alen\nAND\nCountryDESC EqualsSpain'
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName1);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkMultiQualSummary(AQPromptName1))
            .toEqual('CountryDESC EqualsSpain\nAND\nCustomerNot In ListAaby:Alen');
        // Run prompt
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // Reset prompt
        //  a.The default selected item should be 'Age RangeQualify DESC Equals24 and under'
        await reset.selectReset();
        await reset.confirmReset(true);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(AQPromptName1);
        await since('Default rompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toEqual('Age Range\nQualify\nDESC\nEquals\n25 to 34');
        // Run prompt
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
    });

    // Dossier 2: AQ-shoppingcart-default:qualify-default:In-default:OR
    it('[TC58925]Validating Attribute Qualification Prompt with Shopping Cart style- Check different qualification expression in Library Web', async () => {
        // Open prompt (Reset state)
        await resetDossierState({
            credentials: credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossierNoWait(dossier2.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(AQPromptName2);
        // Click Add to add 'Customer' to selected list
        await promptObject.shoppingCart.addSingle(prompt);
        // Click condition button to open condition dropdown and select 'Equals'
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.selectCondition(prompt, 'Equals');
        // Click value link to open value editor and input 3
        //  a. Check expression
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await promptObject.shoppingCart.inputValues(prompt, 3);
        await promptObject.shoppingCart.confirmValues(prompt);
        await since('The text for Nth item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toEqual('Customer\nQualify\nID\nEquals\n3');
        // Run prompt
        //  a. Take a screenshot(RunPromptResultWithEquals) to check the result
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Abelson', 'Hazel']);
        // Re-prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName2);
        // Click condition button to open condition dropdown and select 'Does not equal'
        //  a.Check expression
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.selectCondition(prompt, 'Does not equal');
        await since('The text for Nth item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toEqual('Customer\nQualify\nID\nDoes not equal\n3');
        // Run prompt
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // Re-prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName2);
        // Click condition button to open condition dropdown and select 'Greater than'
        //  a. Check expression
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.selectCondition(prompt, 'Greater than');
        await since('The text for Nth item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toEqual('Customer\nQualify\nID\nGreater than\n3');
        // Run prompt
        //  a. Take a screenshot(RunPromptResultWithGreaterThan) to check the result
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Aaby', 'Alen']);
        // Re-prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName2);
        // Click condition button to open condition dropdown and select 'Greater than or equal to'
        //  a. Check expression
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.selectCondition(prompt, 'Greater than or equal to');
        await since('The text for Nth item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toEqual('Customer\nQualify\nID\nGreater than or equal to\n3');
        // Run prompt
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // Re-prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName2);
        // Click condition button to open condition dropdown and select 'Less than'
        //  a. Check expression
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.selectCondition(prompt, 'Less than');
        await since('The text for Nth item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toEqual('Customer\nQualify\nID\nLess than\n3');
        // Run prompt
        //  a. Take a screenshot(RunPromptResultWithLessThan) to check the result
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Aaronson', 'Maxwell']);
        // Re-prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName2);
        // Click condition button to open condition dropdown and select 'Less than or equal to'
        //  a.Check expression
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.selectCondition(prompt, 'Less than or equal to');
        await since('The text for Nth item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toEqual('Customer\nQualify\nID\nLess than or equal to\n3');
        // Run prompt
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
    });

    // Dossier 2: AQ-shoppingcart-default:qualify-default:In-default:OR
    it('[TC58927]Validating Attribute Qualification Prompt with Shopping Cart style- Check different select expression in Library Web', async () => {
        // Open prompt (Reset state)
        await resetDossierState({
            credentials: credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossierNoWait(dossier2.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(AQPromptName2);
        // Click Add to add 'Customer' to selected list
        //  a.'Customer Qualify ID In Value' should be added to selected list
        await promptObject.shoppingCart.addSingle(prompt);
        await since('The text for Nth item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toEqual('Customer\nQualify\nID\nIn\nValue');
        // Click type button to select 'Select'
        await promptObject.shoppingCart.openTypeDropdown(prompt, 1);
        await promptObject.shoppingCart.selectType(prompt, 'Select');
        // Click value link to open value editor shopping cart
        await promptObject.shoppingCart.openValueListEditor(prompt, 1);
        // Click Add 3 times to add 'Aaby:Alen, Aadland:Miko, Aadland:Warner'
        //  a.check the expression
        await promptObject.shoppingCart.addSingle(prompt, true);
        await promptObject.shoppingCart.addSingle(prompt, true);
        await promptObject.shoppingCart.addSingle(prompt, true);
        await promptObject.shoppingCart.confirmValues(prompt);
        await since('The text for Nth item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toEqual('Customer\nSelect\nIn List\nAaby:Alen, Aadland:Miko, Aadland:Warner');
        // Run prompt
        //  a.Take a screenshot(RunPromptResultWithInList) to check the result
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Aaby', 'Alen']);
        // Re-prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName2);
        // Click condition button to select 'Not in list'
        //  a. check the expression
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.selectCondition(prompt, 'Not In List');
        await since('The text for Nth item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toEqual('Customer\nSelect\nNot In List\nAaby:Alen, Aadland:Miko, Aadland:Warner');
        // Run prompt
        //  a. Take a screenshot(RunPromptResultWithNotInList) to check the result
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
    });

    // Dossier 2: AQ-shoppingcart-default:qualify-default:In-default:OR
    it('[TC67985]AQ with Shopping Cart style- Edit/Remove answer when answer is not completed', async () => {
        // Open prompt (Reset state)
        await resetDossierState({
            credentials: credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossierNoWait(dossier2.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(AQPromptName2);

        // Add 'Customer', open dropdown menu
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.openTypeDropdown(prompt, 1);

        // Remove answer when answer is not completed
        await promptObject.shoppingCart.removeSingle(prompt);

        // Edit another prompt answer when answer is not complete
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.openTypeDropdown(prompt, 2);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC67985', 'Open2ndType', { tolerance: 0.4 });
        await promptEditor.cancelEditor();
    });

    it('[TC63940]Validating qualification prompt with datetime format in Library', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier3,
        });
        await libraryPage.openDossierNoWait(dossier3.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(AQPromptName3);

        // check UI for datime input
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await takeScreenshot('TC63940', 'DatetimeInQualification', { tolerance: 0.2 });

        // input date, no time
        await promptObject.shoppingCart.inputValues(prompt, '3/14/2014');
        await promptObject.shoppingCart.confirmValues(prompt);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName3);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(AQPromptName3))
            .toEqual('DaytimeID Equals3/14/2014');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(2);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Daytime' }))
            .toBe('3/14/2014 12:00:00 AM');
        await promptEditor.reprompt();
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(AQPromptName3);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName3);
        await since('Re-prompt, time is automatically added to prompt answer')
            .expect(await promptEditor.checkQualSummary(AQPromptName3))
            .toEqual('DaytimeID Equals3/14/2014 12:00:00 AM');
        await promptEditor.toggleViewSummary();

        // input time, no date
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await promptObject.shoppingCart.clearValues(prompt);
        await promptObject.calendar.clearAndInputHour(prompt, '20');
        await promptObject.shoppingCart.confirmValues(prompt);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName3);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(AQPromptName3))
            .toEqual('DaytimeID Equals8:00:00 PM');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(AQPromptName3);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName3);
        await since('Re-prompt, date is automatically added to prompt answer')
            .expect(await promptEditor.checkQualSummary(AQPromptName3))
            .toEqual('DaytimeID Equals12/30/1899 8:00:00 PM');
        await promptEditor.toggleViewSummary();

        // choose condition "In" to input multiple datetimes
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.scrollDownConditionList(prompt, 200);
        await promptObject.shoppingCart.selectCondition(prompt, 'In');
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await promptObject.calendar.openCalendar(prompt);
        // For different dates, user can choose different times
        await promptObject.calendar.clearAndInputYear(prompt, '2014');
        await promptObject.calendar.openMonthDropDownMenu(prompt);
        await promptObject.calendar.selectMonth(prompt, 'January');
        await promptObject.calendar.selectDay(prompt, '3');
        await promptObject.calendar.clearAndInputHour(prompt, '8');
        await promptObject.calendar.clickMinute(prompt);
        // It will use previous time if use only choose date
        await promptObject.calendar.openCalendar(prompt);
        await promptObject.calendar.selectDay(prompt, '4');
        await promptObject.shoppingCart.confirmValues(prompt);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName3);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(AQPromptName3))
            .toEqual('DaytimeID In12/30/1899 8:00:00 PM; 1/3/2014 8:00:00 AM; 12/4/1899 8:00:00 AM');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.isTableExist('Visualization 1'))
            .toBe(false);
    });

    it('[TC80238] Validate Attribute Qualification Prompt with attribute elements that have special chars', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier4,
        });
        await libraryPage.openDossierNoWait(dossier4.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(AQPromptName4);

        // Answer prompt by selecting elements
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'AttrDE102292');
        await promptObject.shoppingCart.addSingle(prompt);
        // Click type button to select 'Select'
        await promptObject.shoppingCart.openTypeDropdown(prompt, 1);
        await promptObject.shoppingCart.selectType(prompt, 'Select');
        // Click value link to open value editor shopping cart
        await promptObject.shoppingCart.openValueListEditor(prompt, 1);
        await promptObject.shoppingCart.addAll(prompt, true);
        await promptObject.shoppingCart.confirmValues(prompt);
        await since('The text for Nth item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toEqual(
                'AttrDE102292\nSelect\nIn List\na,a, a;a, b,b, a\\,a, a\\a, a\\;a, a,a\\,a, a;a\\,a, 1;01, 2\\;02, 3;03;03, 4\\;4:4, 5;;05, 2\\2\\2, 1\\2, 1\\\\1, 1\\\\\\1, 6\\;\\;6, 7\\;\\;\\7, 8;\\;8, Bücher, test, t est, t est , , a~, a&*, winky, a^, %'
            );
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['a,a']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(3))
            .toEqual(['a;a']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(4))
            .toEqual(['b,b']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(5))
            .toEqual(['a\\,a']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(6))
            .toEqual(['a\\a']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(7))
            .toEqual(['a\\;a']);

        // Answer prompt by qualify on attribute: single expression - Equals
        await promptEditor.reprompt();
        await promptObject.shoppingCart.openTypeDropdown(prompt, 1);
        await promptObject.shoppingCart.selectType(prompt, 'Qualify');
        await promptObject.shoppingCart.openFormDropdown(prompt, 1);
        await promptObject.shoppingCart.selectForm(prompt, 'DESC');
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await promptObject.shoppingCart.openBrowseValuesWindow(prompt);
        await promptObject.shoppingCart.addSingle(prompt, true);
        await promptObject.shoppingCart.confirmValues(prompt);
        await since('The text for AttrDE102292 is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toEqual('AttrDE102292\nQualify\nDESC\nEquals\na,a');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();

        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['a,a']);

        // Answer prompt by qualify on attribute: multiple expression - In
        await promptEditor.reprompt();
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.scrollDownConditionList(prompt, 200);
        await promptObject.shoppingCart.selectCondition(prompt, 'In');
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await promptObject.shoppingCart.openBrowseValuesWindow(prompt);
        await promptObject.shoppingCart.removeAll(prompt, true);
        await promptObject.shoppingCart.confirmValues(prompt);
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await promptObject.shoppingCart.openBrowseValuesWindow(prompt);
        await promptObject.shoppingCart.addSingle(prompt, true);
        await promptObject.shoppingCart.addSingle(prompt, true);
        await promptObject.shoppingCart.confirmValues(prompt);
        await since('The text for AttrDE102292 is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toEqual('AttrDE102292\nQualify\nDESC\nIn\na,a; a\\;a');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['a,a']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(3))
            .toEqual(['a;a']);
    });

    it('[TC80253] Validate search function for attribute qualification prompt with multi forms', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: RSD,
        });
        await libraryPage.openDossierNoWait(RSD.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(AQPromptName5);

        // Search in qualify
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Customer-multiform');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await promptObject.shoppingCart.openBrowseValuesWindow(prompt);
        await promptObject.shoppingCart.searchFor(prompt, '1111');
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC80238_01', 'Search1111', { tolerance: 0.1 });
        await promptObject.shoppingCart.addSingle(prompt, true);
        await promptObject.shoppingCart.confirmValues(prompt);
        await since('The text for Customer-multiform is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toEqual('Customer-multiform\nQualify\nID\nEquals\n1111');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Hall', 'Debby', '1111', 'Hall', 'Debby']);

        // Search in select
        await promptEditor.reprompt();
        await promptObject.shoppingCart.openTypeDropdown(prompt, 1);
        await promptObject.shoppingCart.selectType(prompt, 'Select');
        await promptObject.shoppingCart.openValueListEditor(prompt, 1);
        await promptObject.shoppingCart.searchFor(prompt, '1111');
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC80238_03', 'Search1111', { tolerance: 0.1 });
        await promptObject.shoppingCart.addSingle(prompt, true);
        await promptObject.shoppingCart.confirmValues(prompt);
        await since('The text for Customer-multiform is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toEqual('Customer-multiform\nSelect\nIn List\n9350:Bruyn:Marcel');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Bruyn', 'Marcel', '9350', 'Bruyn', 'Marcel']);
    });
});

export const config = specConfiguration;
