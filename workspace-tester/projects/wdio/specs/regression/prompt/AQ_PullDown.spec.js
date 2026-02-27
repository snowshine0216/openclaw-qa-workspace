import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';
import { addDays, getStringOfDate, addMonths, getToday, addBusinessDays, getYearOfDate, getDayPriorToEndOfDate } from '../../../utils/DateUtil.js';

const specConfiguration = { ...customCredentials('_prompt') };


describe('AQ Prompt - Pull Down', () => {
    const AQPromptName = 'Attribute qualification';
    const dossier1 = {
        id: 'C3D6C6A74F3E39B43E20D9999D39376D',
        name: 'AQ-pulldown-required-qualify-with default answer',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const dossier2 = {
        id: '247ED01C44012767A9874B953B78C190',
        name: 'AQ-pulldown-select-default:In list-max:4',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const dossier3 = {
        id: '106684594504F49BD8D8539C20672F09',
        name: 'AQ-pulldown(radiobutton)-report form',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier4 = {
        id: 'EF434CB842873A48E10848984F37631F',
        name: '(Auto) AQ Prompt_with Calendar Prompt_Dynamic as default',
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
    const dayPromtName = 'Day';
    const daytimePromptName = 'AQ for Daytime';

    let { loginPage, rsdGrid, grid, dossierPage, libraryPage, promptEditor, promptObject, reset } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    // Dossier 1: AQ-pulldown-required-qualify-with default answer
    it('[TC58007]Validating Attribute Qualification Prompt with Pull Down style - Check default answer and customized answer in Library Web', async () => {
        // Open prompt
        await resetDossierState({
            credentials: credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossierNoWait(dossier1.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(AQPromptName);

        // Open 'View summary' (Check the summary)
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName);
        await since('Use default condition, prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummaryOfDefault(AQPromptName))
            .toEqual(
                'The default selection is:Age Range (DESC) Greater than "24 and under"\nand\nCustomer (Last Name) In ("Aaby", "Aadland", "Aaby", "Aadland")'
            );
        await promptEditor.toggleViewSummary();
        // Run prompt(Check the result)
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(33);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Country' }))
            .toBe('USA');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer' }))
            .toBe('Aaby');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Age Range' }))
            .toBe('55 and over');

        // TODO: As for issue DE150421, Add this back once DE150421 is fixed
        // -----------------------------------------------------------------
        // // Reprompt
        // await promptEditor.reprompt();
        // prompt = await promptObject.getPromptByName(AQPromptName);
        // //Select 'Your selection'
        // await promptObject.pulldown.selectYourSelection(prompt);
        // // Input '1' in value input box
        // await promptObject.pulldown.inputLowerValue(prompt, 1);
        // await promptEditor.toggleViewSummary();
        // // Open 'View summary' (Check the summary)
        // await since('Use default condition, prompt answer is supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await promptEditor.toggleAndcheckQualSummary(AQPromptName)).toEqual('CountryID Equals1'); //Country ID Equals 1
        // await promptEditor.toggleViewSummary();
        // // Run prompt(Check the result)
        // await promptEditor.run();
        // await dossierPage.waitForDossierLoading();
        // screenshotResult = await takeScreenshot('TC58007', 'RunPromptResultWithCustermizedSelection', 3, specName);
        // -----------------------------------------------------------------

        // Reset
        await reset.selectReset();
        await reset.confirmReset(true);
        await promptEditor.waitForEditor();
        // Open 'View summary' (Check the summary)
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName);
        await since('Use default condition, prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummaryOfDefault(AQPromptName))
            .toEqual(
                'The default selection is:Age Range (DESC) Greater than "24 and under"\nand\nCustomer (Last Name) In ("Aaby", "Aadland", "Aaby", "Aadland")'
            );
        // Cancel
        await promptEditor.cancelEditor();
    });

    // Dossier 1: AQ-pulldown-required-qualify-with default answer
    it('[TC58008] Validating Attribute Qualification Prompt with Pulldown style - Manipulation on prompt selection in Library Web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossierNoWait(dossier1.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(AQPromptName);
        // Select 'Your selection'
        await promptObject.qualPulldown.selectYourSelection(prompt);
        // Open Attribute dropdown
        await promptObject.qualPulldown.openDropDownList(prompt);
        // Select 'Customer' (Check current selection)
        await promptObject.qualPulldown.selectDropDownItem(prompt, 'Customer');
        await since('Current drop down selection is supposed to be #{expected}, instead we have #{actual} ')
            .expect(await promptObject.qualPulldown.currentDropdownSelection(prompt))
            .toEqual('Customer');
        // Open Attribute Form dropdown
        await promptObject.qualPulldown.openAttrFormList(prompt);
        // Select 'Last Name' (Check current selection)
        await promptObject.qualPulldown.selectAttrForm(prompt, 'Last Name');
        // Open Expression dropdown
        await promptObject.qualPulldown.openAQCondotion(prompt);
        // Select 'In' (Check current selection)
        await promptObject.qualPulldown.scrollDownConditionList(prompt, 500);
        await promptObject.qualPulldown.selectAQCondition(prompt, 'In');
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC58008', 'CustomeizedSelectionUI', {
            tolerance: 0.1,
        });

        // Keep value input box empty and run prompt (Check validation msg)
        await promptEditor.run();
        await promptEditor.waitForMessageBox();
        await promptEditor.dismissError();
        await since('Error message for invalid action is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.errorMsg(prompt))
            .toEqual('The condition for your answer is not completed.');
        // Input '12' in value input box
        await promptObject.qualPulldown.inputLowerValue(prompt, 12);
        // Run prompt (The result should be empty)
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.isTableExist('Visualization 1'))
            .toBe(false);
        // Re-prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName);
        // Input '\a\b&c' in value input box
        await promptObject.qualPulldown.clearInputLowerValue(prompt);
        await promptObject.qualPulldown.inputLowerValue(prompt, '\\a\\b&c');
        // Run prompt (The result should be empty)
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.isTableExist('Visualization 1'))
            .toBe(false);
        // Re-prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName);
        //Input 'Aaby' in value input box
        await promptObject.qualPulldown.clearInputLowerValue(prompt);
        await promptObject.qualPulldown.inputLowerValue(prompt, 'Aaby');
        // Open 'View summary' (Check the summary)
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(AQPromptName))
            .toEqual('CustomerLast Name InAaby'); //Customer ID In Aaby
        // Run prompt (Check the result)
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(9);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Country' }))
            .toBe('USA');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer' }))
            .toBe('Aaby');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Age Range' }))
            .toBe('55 and over');
    });

    // Dossier 1: AQ-pulldown-required-qualify-with default answer
    it('[TC58009] Validating Attribute Qualification Prompt with Pulldown style - Check browser value window in Library Web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossierNoWait(dossier1.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(AQPromptName);
        // Select 'Your selection'
        await promptObject.qualPulldown.selectYourSelection(prompt);
        await promptObject.qualPulldown.openDropDownList(prompt);
        await promptObject.qualPulldown.selectDropDownItem(prompt, 'Country');
        // Open Attribute Form dropdown
        await promptObject.qualPulldown.openAttrFormList(prompt);
        // Select 'DESC'
        await promptObject.qualPulldown.selectAttrForm(prompt, 'DESC');
        await promptObject.qualPulldown.openAQCondotion(prompt);
        await promptObject.qualPulldown.selectAQCondition(prompt, 'Equals');
        // Click 'Browse values'
        await promptObject.qualPulldown.openBrowseValuesWindow(prompt);
        await promptObject.shoppingCart.waitForShoppingCart(prompt);
        // Search '\a' (Check the search result)
        await promptObject.shoppingCart.searchFor(prompt, '\\a');
        await since('Available searched items is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getAvailableCartItemCount(prompt))
            .toBe(0);
        // Search 'us' (Check the search result)
        await promptObject.shoppingCart.clearSearch(prompt);
        await promptObject.shoppingCart.searchFor(prompt, 'us');
        await since('Available searched items is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getAvailableCartItemCount(prompt))
            .toBe(1);

        // There is Issue for 'Match case' add this code back once the issue is fixed
        // -----------------------------------------------------------------
        // // // Check 'Match case' checkbox
        // // await promptObject.shoppingCart.clickMatchCase(prompt);
        // // // Search 'C' (Check the search result)
        // // await promptObject.shoppingCart.clearSearch(prompt);
        // // await promptObject.shoppingCart.searchFor(prompt, 'C');
        // // await since('Available searched items is supposed to be #{expected}, instead we have #{actual}')
        // //     .expect(await promptObject.shoppingCart.getAvailableCartItemCount(prompt)).toBe(1);
        // // // Un-check 'Match case' checkbox
        // // await promptObject.shoppingCart.clickMatchCase(prompt);
        // // // Search 'C' (Check the search result)
        // // await promptObject.shoppingCart.clearSearch(prompt);
        // // await promptObject.shoppingCart.searchFor(prompt, 'C');
        // // await since('Available searched items is supposed to be #{expected}, instead we have #{actual}')
        // //     .expect(await promptObject.shoppingCart.getAvailableCartItemCount(prompt)).toBe(1);
        // -----------------------------------------------------------------

        // Search 'n'
        await promptObject.shoppingCart.clearSearch(prompt);
        await promptObject.shoppingCart.searchFor(prompt, 'n');
        await since('Available searched items is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getAvailableCartItemCount(prompt))
            .toBe(6);
        // Click Add button (The first item will be selected by defalt, which is 'Spain')
        await promptObject.shoppingCart.addSingle(prompt);
        // Click 'Spain'
        await promptObject.shoppingCart.clickElmInSelectedList(prompt, 'Spain');
        // Click Remove button
        await promptObject.shoppingCart.removeSingle(prompt);
        // Click 'Germany'
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Germany');
        // Click Add buton ('Germany' added to selected list)
        await promptObject.shoppingCart.addSingle(prompt);
        await since('The item added to selected item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.isItemInSelectedList(prompt, 'Germany'))
            .toBe(true);
        // Click Remove All button ('Germany' removed back to available list)
        await promptObject.shoppingCart.removeAll(prompt);
        await since('Selected items is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getSelectedCartItemCount(prompt))
            .toBe(0);

        // There is issue for 'Add All', add this code back once the issue was fixed
        // // Click Add All button ('Germany' added to selected list))
        // await promptObject.shoppingCart.addAll(prompt);
        // await since('The item added to selected item is supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await promptObject.shoppingCart.isItemInAvailableList(prompt, 'Germany')).toBe(true);
        // await promptObject.shoppingCart.removeAll(prompt);

        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Germany');
        await promptObject.shoppingCart.addSingle(prompt);
        // Click 'ok' ('Germany' displayed in value input box)
        await promptObject.shoppingCart.confirmValues(prompt);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(AQPromptName))
            .toEqual('CountryDESC EqualsGermany'); //Country DESC Equals Germany
        await promptEditor.toggleViewSummary();
        // Click 'Browse values'
        await promptObject.qualPulldown.openBrowseValuesWindow(prompt);
        await promptObject.shoppingCart.waitForShoppingCart(prompt);
        // Click Add button (The first item will be selected by defalt, which is 'USA')
        await promptObject.shoppingCart.addSingle(prompt);
        // Click 'Cancel'  ('Germany' still displayed in value input box)
        await promptObject.shoppingCart.cancelValues(prompt);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(AQPromptName))
            .toEqual('CountryDESC EqualsGermany'); //Country DESC Equals Germany
        await promptEditor.toggleViewSummary();
        // Run prompt
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
    });

    // Dossier 2: AQ-pulldown-select-default:In list-max:4
    it('[TC58010] Validating Attribute Qualification Prompt with Pulldown style- Check default operator and MinMax answer in Library Web', async () => {
        // Open prompt
        await resetDossierState({
            credentials: credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossierNoWait(dossier2.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(AQPromptName);
        await since('The default selection is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.getValueSelectionListCount(prompt))
            .toBe(0);
        await since('The default selection for condition is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.getAQConditionTextNoAttr(prompt))
            .toEqual('In List');

        // Open Attribute dropdown
        await promptObject.qualPulldown.openDropDownList(prompt);
        // Select 'Customer'
        // a. Condition default should be 'In List'
        await promptObject.qualPulldown.selectDropDownItem(prompt, 'Customer');
        await since('The default selection for condition is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.getAQConditionTextNoAttr(prompt))
            .toEqual('In List');
        // Open Attribute dropdown
        await promptObject.qualPulldown.openDropDownList(prompt);
        // Select 'Country'
        // a. Condition default should be 'In List'
        await promptObject.qualPulldown.selectDropDownItem(prompt, 'Country');
        await since('The default selection for condition is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.getAQConditionTextNoAttr(prompt))
            .toEqual('In List');
        // Click view summary (summary shown)
        // a. The summary should be 'CountryIn ListEmpty'
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(AQPromptName))
            .toEqual('CountryIn ListEmpty');
        // Run prompt(Error message box will shown)
        await promptEditor.run();
        // Click OK of error message box
        await promptEditor.waitForMessageBox();
        await promptEditor.dismissError();
        // Click view summary (Attribute selection shown)
        // a. There should be error message displayed
        await promptEditor.toggleViewSummary();
        await since('Error message for invalid action is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.errorMsg(prompt))
            .toEqual('The condition for your answer is not completed.');
        // Click 'Edit'
        await promptObject.qualPulldown.editAttrSelection(prompt);
        // Click Add all
        await promptObject.shoppingCart.addAll(prompt);
        // Click OK
        // a. USA/Spain/England/France will be added to the value box
        await promptObject.shoppingCart.confirmValues(prompt);
        await since('Error message for invalid action is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.getValueSelectionListCount(prompt))
            .toBe(4);

        // Run prompt
        // a. Take a screenshot(RunPromptResultWith4Answers) to check the result
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['USA', 'Aaby', 'Alen', '55 and over']);

        // Reprompt
        // a. Add button can't be click
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName);
        // Click 'Edit'
        await promptObject.qualPulldown.editAttrSelection(prompt);
        await promptObject.shoppingCart.addSingle(prompt);
        await since('Error message for invalid action is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.getValueSelectionListCount(prompt))
            .toBe(4);
        // Run prompt
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
    });

    // Dossier 1: AQ-pulldown-required-qualify-with default answer
    it('[TC58956]Validating Attribute Qualification Prompt with Pulldown style- Check different qualification expressions in Library Web', async () => {
        // Reset prompt
        await resetDossierState({
            credentials: credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossierNoWait(dossier1.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(AQPromptName);
        await promptObject.qualPulldown.openDropDownList(prompt);
        await promptObject.qualPulldown.selectDropDownItem(prompt, 'Country');
        // Select 'DESC' of attribute
        await promptObject.qualPulldown.openAttrFormList(prompt);
        await promptObject.qualPulldown.selectAttrForm(prompt, 'DESC');
        // Select 'Contains' of attribute
        await promptObject.qualPulldown.openAQCondotion(prompt);
        await promptObject.qualPulldown.scrollDownConditionList(prompt, 200);
        await promptObject.qualPulldown.selectAQCondition(prompt, 'Contains');
        // Input 'an'
        await promptObject.qualPulldown.inputLowerValue(prompt, 'an');
        // Check view summary and run prompt
        //  a. The view summary should be 'Country DESC Contains an'
        //  b. Take a screenshot(RunPromptResultWithContains) to check the result
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName);
        await since('Use default condition, prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(AQPromptName))
            .toEqual('CountryDESC Containsan');
        await promptEditor.toggleViewSummary();
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer' }))
            .toBe('Aaby');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Country' }))
            .toBe('England');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Age Range' }))
            .toBe('55 and over');
        // Reprompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName);
        // Select 'Does not contain' of attribute
        await promptObject.qualPulldown.openAQCondotion(prompt);
        await promptObject.qualPulldown.scrollDownConditionList(prompt, 200);
        await promptObject.qualPulldown.selectAQCondition(prompt, 'Does not contain');
        // Check view summary and run prompt
        //  a. The view summary should be 'Country DESC Does not contain an'
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName);
        await since('Use default condition, prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(AQPromptName))
            .toEqual('CountryDESC Does not containan');
        await promptEditor.toggleViewSummary();
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // Reprompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName);
        // Select 'Begins with' of attribute
        await promptObject.qualPulldown.openAQCondotion(prompt);
        await promptObject.qualPulldown.scrollDownConditionList(prompt, 200);
        await promptObject.qualPulldown.selectAQCondition(prompt, 'Begins with');
        // Check view summary and run prompt
        //  a. The view summary should be 'Country DESC Does not contain an'
        //  b. Take a screenshot(RunPromptResultWithBeginsWith) to check the result
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName);
        await since('Use default condition, prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(AQPromptName))
            .toEqual('CountryDESC Begins withan');
        await promptEditor.toggleViewSummary();
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.isTableExist('Visualization 1'))
            .toBe(false);
        // Reprompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName);
        // Select 'Does not begin with' of attribute
        await promptObject.qualPulldown.openAQCondotion(prompt);
        await promptObject.qualPulldown.scrollDownConditionList(prompt, 200);
        await promptObject.qualPulldown.selectAQCondition(prompt, 'Does not begin with');
        // Check view summary and run prompt
        //  a. The view summary should be 'Country DESC Does not begin with an'
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName);
        await since('Use default condition, prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(AQPromptName))
            .toEqual('CountryDESC Does not begin withan');
        await promptEditor.toggleViewSummary();
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // Reprompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName);
        // Select 'Like' of attribute
        await promptObject.qualPulldown.openAQCondotion(prompt);
        await promptObject.qualPulldown.scrollDownConditionList(prompt, 300);
        await promptObject.qualPulldown.selectAQCondition(prompt, 'Like');
        // Check view summary and run prompt
        //  a. The view summary should be 'Country DESC Like an'
        //  b. Take a screenshot(RunPromptResultWithLike) to check the result
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName);
        await since('Use default condition, prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(AQPromptName))
            .toEqual('CountryDESC Likean');
        await promptEditor.toggleViewSummary();
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.isTableExist('Visualization 1'))
            .toBe(false);
        // Reprompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName);
        // Select 'Not Like' of attribute
        await promptObject.qualPulldown.openAQCondotion(prompt);
        await promptObject.qualPulldown.scrollDownConditionList(prompt, 300);
        await promptObject.qualPulldown.selectAQCondition(prompt, 'Not Like');
        // Check view summary and run prompt
        //  a. The view summary should be 'Country DESC Not Like an'
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName);
        await since('Use default condition, prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(AQPromptName))
            .toEqual('CountryDESC Not Likean');
        await promptEditor.toggleViewSummary();
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // Reprompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName);
        // Select 'Ends with' of attribute
        await promptObject.qualPulldown.openAQCondotion(prompt);
        await promptObject.qualPulldown.scrollDownConditionList(prompt, 300);
        await promptObject.qualPulldown.selectAQCondition(prompt, 'Ends with');
        // Check view summary and run prompt
        //  a. The view summary should be 'Country DESC Ends an'
        //  b. Take a screenshot(RunPromptResultWithEndsWith) to check the result
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName);
        await since('Use default condition, prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(AQPromptName))
            .toEqual('CountryDESC Ends withan');
        await promptEditor.toggleViewSummary();
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.isTableExist('Visualization 1'))
            .toBe(false);
        // Reprompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName);
        // Select 'Does not end with' of attribute
        await promptObject.qualPulldown.openAQCondotion(prompt);
        await promptObject.qualPulldown.scrollDownConditionList(prompt, 300);
        await promptObject.qualPulldown.selectAQCondition(prompt, 'Does not end with');
        // Check view summary and run prompt
        //  a. The view summary should be 'Country DESC Does not end with an'
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName);
        await since('Use default condition, prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(AQPromptName))
            .toEqual('CountryDESC Does not end withan');
        await promptEditor.toggleViewSummary();
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
    });

    // Dossier 3: AQ-pulldown(radiobutton)-report form
    it('[TC58957]Validating Attribute Qualification Prompt with Pull Down style- Check radio button style will be changed to pull down style', async () => {
        // Reset prompt
        await resetDossierState({
            credentials: credentials,
            dossier: dossier3,
        });
        await libraryPage.openDossierNoWait(dossier3.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(AQPromptName);
        // click attribute form dropdown icon
        //  a. Take screenshot to check only first name and last name on the list
        await promptObject.qualPulldown.openAttrFormList(prompt);

        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC58957', 'PromptDefaultAttibuteFormList', {
            tolerance: 0.32,
        });
        // Select 'Is Null' of attribute
        //  a. Take a screenshot to check the result UI
        await promptObject.qualPulldown.openAQCondotion(prompt);
        await promptObject.qualPulldown.scrollDownConditionList(prompt, 500);
        await promptObject.qualPulldown.selectAQCondition(prompt, 'Is Null');
        await since('The selection for condition is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.getAQConditionTextNoAttr(prompt))
            .toEqual('Last Name');

        // Check view summary and run prompt
        //  a. The view summary should be 'Country ID Is Null an'
        //  b. Take a screenshot(RunPromptResultWithIsNull) to check the result
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName);
        await since('Use default condition, prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(AQPromptName))
            .toEqual('CustomerLast Name Is Null');
        await promptEditor.toggleViewSummary();
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.isTableExist('Visualization 1'))
            .toBe(false);
        // Reprompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName);
        // Select 'Is Not Null' of attribute
        // a. Take a screenshot to check the result UI
        await promptObject.qualPulldown.openAQCondotion(prompt);
        await promptObject.qualPulldown.scrollDownConditionList(prompt, 500);
        await promptObject.qualPulldown.selectAQCondition(prompt, 'Is Not Null');
        await since('The selection for condition is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.getAQConditionTextNoAttr(prompt))
            .toEqual('Last Name');
        // Check view summary and run prompt
        //  a. The view summary should be 'Country ID Is Not Null an'
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName);
        await since('Use default condition, prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(AQPromptName))
            .toEqual('CustomerLast Name Is Not Null');
        await promptEditor.toggleViewSummary();
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // Reprompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName);
        // Select 'In' of attribute
        await promptObject.qualPulldown.openAQCondotion(prompt);
        await promptObject.qualPulldown.scrollDownConditionList(prompt, 500);
        await promptObject.qualPulldown.selectAQCondition(prompt, 'In');
        await since('The selection for condition is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.getAQConditionTextNoAttr(prompt))
            .toEqual('Last Name');
        // Input 'Aaby; Aba'
        await promptObject.qualPulldown.clearInputLowerValue(prompt);
        await promptObject.qualPulldown.inputLowerValue(prompt, 'Aaby; Aba');
        // Check view summary and run prompt
        //  a. The view summary should be 'Country ID In Aaby; Aba'
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName);
        await since('Use default condition, prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(AQPromptName))
            .toEqual('CustomerLast Name InAaby; Aba');
        await promptEditor.toggleViewSummary();
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // Reprompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName);
        // Select 'Not In' of attribute
        await promptObject.qualPulldown.openAQCondotion(prompt);
        await promptObject.qualPulldown.scrollDownConditionList(prompt, 500);
        await promptObject.qualPulldown.selectAQCondition(prompt, 'Not In');
        // Check view summary and run prompt
        //  a. The view summary should be 'Country ID Not In Aaby; Aba'
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName);
        await since('Use default condition, prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(AQPromptName))
            .toEqual('CustomerLast Name Not InAaby; Aba');
        await promptEditor.toggleViewSummary();
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // Reprompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName);
        // Select 'Between' of attribute
        await promptObject.qualPulldown.openAQCondotion(prompt);
        await promptObject.qualPulldown.scrollDownConditionList(prompt, 500);
        await promptObject.qualPulldown.selectAQCondition(prompt, 'Between');
        // Input Aaa and Aae
        await promptObject.qualPulldown.clearInputLowerValue(prompt);
        await promptObject.qualPulldown.inputLowerValue(prompt, 'Aaa');
        await promptObject.qualPulldown.inputUpperValue(prompt, 'Aae');
        // Check view summary and run prompt
        //  a. The view summary should be 'Country ID Between Aaa and Aae'
        //  b. Take a screenshot(RunPromptResultWithBetween) to check the result
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName);
        await since('Use default condition, prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(AQPromptName))
            .toEqual('CustomerLast Name BetweenAaa and Aae');
        await promptEditor.toggleViewSummary();
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(33);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Country' }))
            .toBe('USA');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer' }))
            .toBe('Aaby');
        // Reprompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName);
        // Select 'Not between' of attribute
        await promptObject.qualPulldown.openAQCondotion(prompt);
        await promptObject.qualPulldown.scrollDownConditionList(prompt, 500);
        await promptObject.qualPulldown.selectAQCondition(prompt, 'Not between');
        // Check view summary and run prompt
        //  a. The view summary should be 'Country ID Not between Aaa and Aae'
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName);
        await since('Use default condition, prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(AQPromptName))
            .toEqual('CustomerLast Name Not betweenAaa and Aae');
        await promptEditor.toggleViewSummary();
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
    });

     // Dossier 4: (Auto) AQ Prompt_with Calendar Prompt_Dynamic as default
    it('[TC58957_01]Validating Attribute Qualification Prompt with dynamic date as default answer_pull down', async () => {
        // Reset prompt
        await resetDossierState({
            credentials: credentials,
            dossier: dossier4,
        });
        const todayPlus2Days_Plus1Month = getStringOfDate(addDays(2, getStringOfDate(addMonths(1, getToday()))));
        const calendar =promptObject.calendar;
        await libraryPage.openDossierNoWait(dossier4.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(dayPromtName);
        // check dynamic icon and prompt summary
        since('The dynamic icon for lower input is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.isDynamicIconVisibleInLowerInput(prompt))
            .toBe(false);
        since('The dynamic icon for upper input is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.isDynamicIconVisibleInUpperInput(prompt))
            .toBe(true);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Day');
        since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkMultiQualSummary(dayPromtName))
            .toContain('10/23/2025');
        since ('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkMultiQualSummary(dayPromtName))
            .toContain('Today plus 2 days plus 1 month');
        await promptEditor.toggleViewSummary();
        // change the prompt answer to static + static with between
        await promptObject.qualPulldown.openLowerInputCalendar(prompt);
        await calendar.selectYearAndMonth(prompt, '2014', 'January');
        await calendar.selectDay(prompt, '1');
        
        await promptObject.qualPulldown.openUpperInputCalendar(prompt);
        await calendar.toggleDynamicCalendar(prompt)
        await calendar.selectYearAndMonth(prompt, '2014', 'March');
        await calendar.selectDay(prompt, '15');
        // run prompt and check summary
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkMultiQualSummary(dayPromtName))
            .toEqual('DayID Not between1/1/2014 and 3/15/2014');
        await promptEditor.toggleViewSummary();

        //change the prompt answer to dynamic + dynamic
        await promptObject.qualPulldown.openLowerInputCalendar(prompt);
        await calendar.toggleDynamicCalendar(prompt)
        const today_Minus3Days = getStringOfDate(addBusinessDays(-3, getToday()), false);
        const today_Minus3Days_Offset = getStringOfDate(addBusinessDays(-3, addDays(1, getToday())), false);
        await calendar.setOffsetInDynamicCalendar(prompt, {
            period: 'Day',
            offsetOperator: 'Minus',
            directions: 'Up',
            times: '3',
        });
        await calendar.checkExcludeWeekendsInDynamicCalendar(prompt);
        since('the resolved date should be #{expected}, instead we get #{actual}', )
            .expect(['The date would be resolved to: ' + today_Minus3Days, 'The date would be resolved to: ' + today_Minus3Days_Offset])
            .toContain(await calendar.getNewResolvedDateInDynamicCalendar(prompt));
        await calendar.clickDoneButtonInDynamicCalendar(prompt);
        since('the prompt textbox value should be #{expected}, instead we get #{actual}', )
            .expect([today_Minus3Days, today_Minus3Days_Offset])
            .toContain(await promptObject.qualPulldown.getLowerValueInputValue(prompt));
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        since('The dynamic icon for lower input is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.isDynamicIconVisibleInLowerInput(prompt))
            .toBe(true);
        await promptEditor.toggleViewSummary();
        since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkMultiQualSummary(dayPromtName))
            .toContain('DayID Not betweenToday minus 3 days');
        await promptEditor.toggleViewSummary();

        // change operator to 'In' and set multiple selections
        await promptObject.qualPulldown.openAQCondotion(prompt);
        await promptObject.qualPulldown.scrollDownConditionList(prompt, 500);
        await promptObject.qualPulldown.selectAQCondition(prompt, 'In');
        since('The dynamic icon for lower input is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.isDynamicIconVisibleInLowerInput(prompt))
            .toBe(false);
        since('the prompt textbox value should be #{expected}, instead we get #{actual}', )
            .expect([today_Minus3Days, today_Minus3Days_Offset])
            .toContain(await promptObject.qualPulldown.getLowerValueInputValue(prompt));
        // check prompt summary
        await promptEditor.toggleViewSummary();
        since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkMultiQualSummary(dayPromtName))
            .toContain('DayID InToday minus 3 days');
        await promptEditor.toggleViewSummary();
        await promptObject.qualPulldown.openLowerInputCalendar(prompt);
        since('the calendar lower input should show dynamic calendar should be #{expected}, instead we get #{actual}', )
            .expect( await calendar.isDynamicToggleShow(prompt))
            .toBe(false);
        // do multiple selections
        await calendar.selectYearAndMonth(prompt, '2014', 'January');
        await calendar.selectDay(prompt, '1');
        await promptObject.qualPulldown.openLowerInputCalendar(prompt);
        await calendar.selectYearAndMonth(prompt, '2014', 'February');
        await calendar.selectDay(prompt, '14');
        await promptObject.qualPulldown.openLowerInputCalendar(prompt);
        await calendar.selectYearAndMonth(prompt, '2014', 'March');
        await calendar.selectDay(prompt, '17');

        // open the calendar lower input again
        await promptObject.qualPulldown.openLowerInputCalendar(prompt);
        since('the selected dates count should be #{expected}, instead we get #{actual}', )
            .expect( await calendar.getYearValue(prompt))
            .toBe('2026');
        await promptObject.qualPulldown.clickInputValueInput(prompt);
        // run and check summary
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(['DayID In'+ today_Minus3Days+'; 1/1/2014; 2/14/2014; 3/17/2014', 'DayID In'+ today_Minus3Days_Offset+'; 1/1/2014; 2/14/2014; 3/17/2014'])
            .toContain(await promptEditor.checkMultiQualSummary(dayPromtName));
        await promptEditor.toggleViewSummary();
        // Run prompt
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
    });

    // Dossier 4: (Auto) AQ Prompt_with Calendar Prompt_Dynamic as default
    it('[TC58957_02]Validating Attribute Qualification Prompt with static date as default answer_shoppingcart', async () => {
        // Reset prompt
        await resetDossierState({
            credentials: credentials,
            dossier: dossier4,
        });
        const calendar =promptObject.calendar;
        await libraryPage.openDossierNoWait(dossier4.name);
        await promptEditor.waitForEditor();
        await promptObject.selectPromptByIndex({ index: '3', promptName: daytimePromptName });
        prompt = await promptObject.getPromptByName(daytimePromptName);
        // check dynamic icon and prompt summary
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(daytimePromptName);
        since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkMultiQualSummary(dayPromtName))
            .toContain('10/23/2025');
        since ('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkMultiQualSummary(dayPromtName))
            .toContain('Today plus 2 days plus 1 month');
        await promptEditor.toggleViewSummary();

        // change the first prompt answer to static date   
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        since('The dynamic icon for first input is supposed to be #{expected}, instead we have #{actual}')
            .expect(await calendar.isDynamicSelection(prompt))
            .toBe(true);
        await promptObject.shoppingCart.openValuePart1Calendar(prompt);
        await calendar.toggleDynamicCalendar(prompt);
        await calendar.selectYearAndMonth(prompt, '2014', 'January');
        await calendar.selectDay(prompt, '1');
        since('The dynamic icon for first input is supposed to be #{expected}, instead we have #{actual}')
            .expect(await calendar.isDynamicSelection(prompt))
            .toBe(false);
        await promptObject.shoppingCart.confirmValues(prompt);

        // change the second prompt answer to dynamic date
        await promptObject.shoppingCart.openValuePart2Editor(prompt, 1);
        since('The dynamic icon for second input is supposed to be #{expected}, instead we have #{actual}')
            .expect(await calendar.isDynamicSelection(prompt))
            .toBe(false);
        await promptObject.shoppingCart.openValuePart2Calendar(prompt);
        await calendar.toggleDynamicCalendar(prompt);
        const today_EndOfMonth_3Days  = getDayPriorToEndOfDate( {
            period: 'Month',
            days: 2,
            date: getToday(),
        }, false);
        await calendar.checkAdjustmentInDynamicCalendar(prompt);
        await calendar.selectAdjustmentSubtypeInDynamicCalendar(prompt, 'A day prior to the end');
        await calendar.selectAdjustmentPeriodInDynamicCalendar(prompt, 'Month');
        await calendar.inputAdjustmentDaysInDynamicCalendar(prompt, '3');
        await calendar.clickDoneButtonInDynamicCalendar(prompt);
        await promptObject.shoppingCart.confirmValues(prompt);
        await since('The text for selected date is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toContain(today_EndOfMonth_3Days);

        // run prompt and check summary
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkMultiQualSummary(daytimePromptName))
            .toContain('Day 3 to last day of previous month of Today');
        await promptEditor.toggleViewSummary();


        // change operator to 'is Null'
        await promptObject.selectPromptByIndex({ index: '3', promptName: daytimePromptName });
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.selectCondition(prompt, 'Is Null');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkMultiQualSummary(daytimePromptName))
            .toContain('DaytimeID Is Null');
        await promptEditor.toggleViewSummary();

        // change operator to 'is greater than'
        await promptObject.selectPromptByIndex({ index: '3', promptName: daytimePromptName });
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.selectCondition(prompt, 'Greater than');

        // change the first prompt answer to dynamic date 'the date of the year'
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await promptObject.shoppingCart.openValuePart1Calendar(prompt);
        await calendar.toggleDynamicCalendar(prompt);
        const today_ExcludeWeekends = getStringOfDate(addBusinessDays(0, getToday()));
        const today_ExcludeWeekends_YearOfDate = getYearOfDate( {
            month: 10,
            day: 31,
            date: today_ExcludeWeekends,
        }, false);
        await calendar.checkExcludeWeekendsInDynamicCalendar(prompt);
        await calendar.checkAdjustmentInDynamicCalendar(prompt);
        await calendar.selectAdjustmentSubtypeInDynamicCalendar(prompt, 'A date of the year');
        since ('the days options in date of the year pop over is supposed to be #{expected}, instead we get #{actual}')
            .expect( await calendar.getAdjustmentDaysOptionsCountInDynamicCalendar(prompt))
            .toEqual([
                {month: 'January', days: 31}, 
                {month: 'February', days: 28}, 
                {month: 'March', days: 31},
                {month: 'April', days: 30},
                {month: 'May', days: 31},
                {month: 'June', days: 30},
                {month: 'July', days: 31},
                {month: 'August', days: 31},
                {month: 'September', days: 30},
                {month: 'October', days: 31},
                {month: 'November', days: 30},
                {month: 'December', days: 31},
            ]);
        await calendar.selectMonthAndDayInAdjustmentDateInputInDynamicCalendar(prompt, 'October', '31');
        await calendar.clickDoneButtonInDynamicCalendar(prompt);
        await promptObject.shoppingCart.confirmValues(prompt);
        since('The text for selected date is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toContain(today_ExcludeWeekends_YearOfDate);
        // run prompt and check summary
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkMultiQualSummary(daytimePromptName))
            .toContain('DaytimeID Greater thanOctober 31 of this year (' + today_ExcludeWeekends_YearOfDate + ')');
        await promptEditor.toggleViewSummary();

    });
});

export const config = specConfiguration;
