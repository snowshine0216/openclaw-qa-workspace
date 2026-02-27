import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_prompt') };
const specName = 'AQ_Textbox';

describe('AQ Prompt - Text Box', () => {
    const AQPromptName1 = 'Attribute qualification';
    const AQPromptName2 = 'Attribute qualification';
    const dossier1 = {
        id: '0AB8E7BD43B51939D78FBCA6B25825CE',
        name: 'AQ-textbox-choose attribute-required-discard answer',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const dossier2 = {
        id: '178C60B442D2684BDDD584B5790C11F6',
        name: 'AQ-textbox-predefined list-browser form-default: Not In list',
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

    let { loginPage, grid, dossierPage, libraryPage, promptEditor, promptObject, reset } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    // Dossier 1
    it('[TC58953]Validating Attribute Qualification Prompt with Textbox style- Check different value input in Library Web', async () => {
        // Reset prompt
        //  a. Take a screenshot(DefaultUI) to check the default UI
        await resetDossierState({
            credentials: credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossierNoWait(dossier1.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(AQPromptName1);
        await since('The current prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.textbox.checkTextPromptComplexAnswer(prompt))
            .toBe(
                'Customer (Last Name) In ("Aadland")\nOr\nCustomer (First Name) In ("Aadland")\nOr\nCustomer (Address) In ("Aadland")\nOr\nCustomer (Email) In ("Aadland")'
            );
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC58953', 'DefaultUI', { tolerance: 0.1 });

        // Run prompt with default selection
        //  a. Take a screenshot(RunPromptResultWithDefaultAnswer) to check the default UI
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(4);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer' }))
            .toBe('Aadland');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer Address' }))
            .toBe('415 Virginia Ave');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer Email' }))
            .toBe('maadland63@hotmail.demo');
        // Reset prompt
        await reset.selectReset();
        await reset.confirmReset(true);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(AQPromptName1);
        // Select your selection
        await promptObject.qualPulldown.selectYourSelection(prompt);

        // TODO: As for issue DE150421, Add this back once DE150421 is fixed
        // -----------------------------------------------------------------
        // // Check view summary
        // //  a. The view summary should be 'Customer (All) In Value'
        // await promptEditor.toggleViewSummary();
        // await promptEditor.waitForSummaryItem(AQPromptName1);
        // await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await promptEditor.checkMultiQualSummary(AQPromptName1)).toEqual('Customer(All) InValue');
        // await promptEditor.toggleViewSummary();
        // // Run prompt
        // //  a. Take screenshot for error message box
        // await promptEditor.run();
        // await takeScreenshot('TC0001', 'RunPromptWithEmptyErrorMessageBox', 3, specName);
        // // Confirm the error message box
        // //  a. There is error notification 'The condition for your answer is not completed.'
        // await promptEditor.dismissError();
        // await since('Error message for invalid action is supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await promptObject.pulldown.errorMsg(prompt)).toEqual('The condition for your answer is not completed.');
        // -----------------------------------------------------------------

        // Input 1 and run prompt
        await promptObject.textbox.clickTextBoxInput(prompt);
        await promptObject.textbox.clearAndInputText(prompt, 1);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // Re-prompt
        //  a. Take a screenshot(PromptDefaultWithPreviousSelectionWithID) to check the default selection always shows the last selected value
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName1);
        await since('The current prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.textbox.checkTextPromptComplexAnswer(prompt))
            .toBe(
                'Customer (ID) In (1)\nOr\nCustomer (Last Name) In ("1")\nOr\nCustomer (First Name) In ("1")\nOr\nCustomer (Address) In ("1")\nOr\nCustomer (Email) In ("1")'
            );

        // Input 'Aaby' and run prompt
        await promptObject.textbox.clickTextBoxInput(prompt);
        await promptObject.textbox.clearAndInputText(prompt, 'Aaby');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // Reprompt
        //  a. Take a screenshot(PromptDefaultWithPreviousSelectionWithString) to check the default selection always shows the last selected value
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName1);
        await since('The current prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.textbox.checkTextPromptComplexAnswer(prompt))
            .toBe(
                'Customer (Last Name) In ("Aaby")\nOr\nCustomer (First Name) In ("Aaby")\nOr\nCustomer (Address) In ("Aaby")\nOr\nCustomer (Email) In ("Aaby")'
            );

        // Input 'Aa\,b' and run prompt
        await promptObject.textbox.clickTextBoxInput(prompt);
        await promptObject.textbox.clearAndInputText(prompt, 'Aa,b');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // Reprompt
        //  a. Take a screenshot(PromptDefaultWithPreviousSelectionWithSpecialChars) to check the default selection always shows the last selected value
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName1);
        await since('The current prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.textbox.checkTextPromptComplexAnswer(prompt))
            .toBe(
                'Customer (Last Name) In ("Aa", "b")\nOr\nCustomer (First Name) In ("Aa", "b")\nOr\nCustomer (Address) In ("Aa", "b")\nOr\nCustomer (Email) In ("Aa", "b")'
            );

        // Input 'maaronson93@aol.demo' and run prompt
        await promptObject.textbox.clickTextBoxInput(prompt);
        await promptObject.textbox.clearAndInputText(prompt, 'maaronson93@aol.demo');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // Reprompt
        //  a. Take a screenshot(PromptDefaultWithPreviousSelectionWithEmail) to check the default selection always shows the last selected value
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName1);
        await since('The current prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.textbox.checkTextPromptComplexAnswer(prompt))
            .toBe(
                'Customer (Last Name) In ("maaronson93@aol.demo")\nOr\nCustomer (First Name) In ("maaronson93@aol.demo")\nOr\nCustomer (Address) In ("maaronson93@aol.demo")\nOr\nCustomer (Email) In ("maaronson93@aol.demo")'
            );

        // Input '1660 Park Ave.' and run prompt
        await promptObject.textbox.clickTextBoxInput(prompt);
        await promptObject.textbox.clearAndInputText(prompt, '1660 Park Ave.');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // Re-prompt
        //  a. Take a screenshot(PromptDefaultWithPreviousSelectionWithAddress) to check the default selection always shows the last selected value
        await promptEditor.reprompt();
        await since('The current prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.textbox.checkTextPromptComplexAnswer(prompt))
            .toBe(
                'Customer (Last Name) In ("1660 Park Ave.")\nOr\nCustomer (First Name) In ("1660 Park Ave.")\nOr\nCustomer (Address) In ("1660 Park Ave.")\nOr\nCustomer (Email) In ("1660 Park Ave.")'
            );

        await promptEditor.cancelEditor();
    });

    // Dossier 2: AQ-textbox-predefined list-browser form-default: Not In list
    it('[TC58954]Validating Attribute Qualification Prompt with Textbox style- Check default operator and browser form in Library Web', async () => {
        // Reset prompt
        //  a. Take a screenshot(DefaultUI) to check the default UI
        await resetDossierState({
            credentials: credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossierNoWait(dossier2.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(AQPromptName2);

        // Check view summary
        //  a. The view summary should be 'No selection'
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName2);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkEmptySummary(AQPromptName2))
            .toEqual('No Selection');
        await promptEditor.toggleViewSummary();
        // Run prompt
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // Re-prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName2);
        // Select attribute 'Customer'
        await promptObject.qualPulldown.openDropDownList(prompt);
        await promptObject.qualPulldown.selectDropDownItem(prompt, 'Customer');
        // Input 1 and run prompt
        await promptObject.textbox.clickTextBoxInput(prompt);
        await promptObject.textbox.clearAndInputText(prompt, 1);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // Re-prompt
        //  a. Take a screenshot(PromptDefaultWithPreviousSelectionWithSingleValue) to check the default selection always shows the last selected value
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName2);
        await since('The current prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.textbox.checkTextPromptComplexAnswer(prompt))
            .toBe('Customer (Last Name) Not In ("1")\nOr\nCustomer (First Name) Not In ("1")');

        // Select attribute 'Country'
        await promptObject.qualPulldown.openDropDownList(prompt);
        await promptObject.qualPulldown.selectDropDownItem(prompt, 'Country');
        // Input 'Spain; USA' and run prompt
        await promptObject.textbox.clickTextBoxInput(prompt);
        await promptObject.textbox.clearAndInputText(prompt, 'Spain; USA');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // Re-prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName2);
        // Check view summary
        //  a. Take a screenshot(PromptDefaultWithPreviousSelectionWithMultipleValue1) to check the default selection always shows the last selected value
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName2);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(AQPromptName2))
            .toEqual('CountryDESC Not InSpain; USA');
        await promptEditor.toggleViewSummary();
        // Input 'Spain; USA; Web'
        await promptObject.textbox.clickTextBoxInput(prompt);
        await promptObject.textbox.clearAndInputText(prompt, 'Spain; USA; Web');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // Re-prompt
        //  a. Take a screenshot(PromptDefaultWithPreviousSelectionWithMultipleValue2) to check the default selection always shows the last selected value
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName2);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(AQPromptName2))
            .toEqual('CountryDESC Not InSpain; USA; Web');
        // Close prompt
        await promptEditor.cancelEditor();
    });
});

export const config = specConfiguration;
