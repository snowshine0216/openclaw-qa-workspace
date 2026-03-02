import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_prompt') };

describe('AQ Prompt - Customer Issue', () => {
    const AQPromptName = 'DE202361';
    const AQPromptName2 = 'Item - de203028';
    const AQPromptName3 = 'Customer with long form name';
    const AQPromptName4 = 'Attribute qualification';
    const AQPromptName5 = 'Attribute qualification - select';
    const AQBrowse = 'Attribute qualification - Browse';
    const AQImport = 'Attribute qualification - Import';
    const AQNo = 'Attribute qualification - no';
    const DayNo = 'Day-no';

    const dossier = {
        id: '204AE1AC4976EDBF5FCC44967B4E3DC2',
        name: 'AQ-shoppingcart-datatype',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const dossier2 = {
        id: 'AFC027DF450F6276883E4EB379D48300',
        name: 'AQ prompt with long attribute form name',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const dossier3 = {
        id: '7CC7E3E74664D1EF62E35E9C93E8B27C',
        name: '(AUTO)-AQ-DE246021',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const dossier4 = {
        id: 'DC0855004400FEA2E9081AA31AD26C17',
        name: '(AUTO)-AQ-DE246021-normal answer',
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

    let { loginPage, dossierPage, grid, libraryPage, promptEditor, promptObject } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC79197]Validate search function in AQ prompt for attribute with redefined form format in library web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        await libraryPage.openDossierNoWait(dossier.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(AQPromptName);
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'DE202361');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.openValueListEditor(prompt, 1);
        // Search '2' (Check the search result)
        await promptObject.shoppingCart.searchFor(prompt, '2');
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC79197_01', 'search result');
        await promptObject.shoppingCart.addSingle(prompt, true);
        await promptObject.shoppingCart.confirmValues(prompt);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(AQPromptName))
            .toEqual('DE202361In List2');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Item - de203028' }))
            .toBe('1');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'DE202361' }))
            .toBe('2');
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(AQPromptName2);
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Item - de203028');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.openValueListEditor(prompt, 1);
        // Search '22' (Check the search result)
        await promptObject.shoppingCart.searchFor(prompt, '22');
        await promptObject.shoppingCart.addAll(prompt, true);
        await promptObject.shoppingCart.confirmValues(prompt);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName2);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(AQPromptName2))
            .toEqual('Item - de203028In List22:Cubicle Warfare, 41:Catch-22');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(3);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Item - de203028' }))
            .toBe('22');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'DE202361' }))
            .toBe('2');
    });

    it('[TC76805]Validate Attribute Qualification and Hierarchy Qualification prompt with long attribute form in Library', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossierNoWait(dossier2.name);
        await promptEditor.waitForEditor();
        // choose answer of Age Range
        prompt = await promptObject.getPromptByName(AQPromptName3);
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Age Range');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.openFormDropdown(prompt, 1);
        await promptObject.shoppingCart.selectForm(prompt, 'DESC');
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.selectCondition(prompt, 'Less than or equal to');
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await promptObject.shoppingCart.inputValues(prompt, '25 to 34');
        await promptObject.shoppingCart.confirmValues(prompt);
        // choose answer of Customer with long form name
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Customer with long form name');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.openFormDropdown(prompt, 1);
        await promptObject.shoppingCart.selectForm(prompt, 'WithlonglonglonglonglonglonglonglonglonglongAddress');
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.selectCondition(prompt, 'Greater than or equal to');
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await promptObject.shoppingCart.inputValues(prompt, 'WithlonglonglonglonglonglonglonglonglonglongAddress');
        await promptObject.shoppingCart.confirmValues(prompt);
        await takeScreenshotByElement(
            promptEditor.getPromptEditor(),
            'TC76805_01',
            'UI Check With Customer with long form name Selections',
            { tolerance: 2.1 }
        );
        // change answer of Customer with long form name
        await promptObject.shoppingCart.openFormDropdown(prompt, 1);
        await promptObject.shoppingCart.selectForm(prompt, 'Last Name Last Name Last');
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.selectCondition(prompt, 'Does not equal');
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await promptObject.shoppingCart.inputValues(prompt, 'Last Name Last Name Last');
        await promptObject.shoppingCart.confirmValues(prompt);
        await takeScreenshotByElement(
            promptEditor.getPromptEditor(),
            'TC76805_02',
            'UI Check With Customer with long form name Selections',
            { tolerance: 2.1 }
        );
        // change answer of Customer with long form name
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.selectCondition(prompt, 'Greater than or equal to');
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await promptObject.shoppingCart.inputValues(prompt, 'Last Name Last Name LastLast Name Last Name Last');
        await promptObject.shoppingCart.confirmValues(prompt);
        await takeScreenshotByElement(
            promptEditor.getPromptEditor(),
            'TC76805_03',
            'UI Check With Customer with long form name Selections',
            { tolerance: 2.1 }
        );
        // change answer of Customer with long form name
        await promptObject.shoppingCart.openTypeDropdown(prompt, 1);
        await promptObject.shoppingCart.selectType(prompt, 'Select');
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.selectCondition(prompt, 'Not In List');
        await promptObject.shoppingCart.openValueListEditor(prompt, 1);
        await promptObject.shoppingCart.addSingle(prompt, true);
        await promptObject.shoppingCart.confirmValues(prompt);
        // choose answer of Attribute qualification
        prompt = await promptObject.getPromptByName(AQPromptName4);
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Customer with long form name');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.openFormDropdown(prompt, 1);
        await promptObject.shoppingCart.selectForm(prompt, 'First Name First Name First Name First Name');
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.selectCondition(prompt, 'Does not equal');
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await promptObject.shoppingCart.inputValues(prompt, 'First Name First Name First Name First Name');
        await promptObject.shoppingCart.confirmValues(prompt);
        // choose answer of Call Center
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Call Center');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.openFormDropdown(prompt, 1);
        await promptObject.shoppingCart.selectForm(prompt, 'Hyperlink');
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.selectCondition(prompt, 'Does not equal');
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await promptObject.shoppingCart.inputValues(prompt, 'First Name First Name First Name First Name');
        await promptObject.shoppingCart.confirmValues(prompt);
        // choose answer of Attribute qualification - select
        prompt = await promptObject.getPromptByName(AQPromptName5);
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Customer with long form name');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.openValueListEditor(prompt, 1);
        await promptObject.shoppingCart.addAll(prompt, true);
        await promptObject.shoppingCart.confirmValues(prompt);
        await takeScreenshotByElement(
            promptEditor.getPromptEditor(),
            'TC76805_06',
            'UI Check With Attribute qualification - select Selections',
            { tolerance: 2.6 }
        );
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(AQPromptName5);
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC76805_07', 'Prompt Summary', {
            tolerance: 2.3,
        });
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(6);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(
                await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer with long form name' })
            )
            .toBe('Aafedt');
    });

    it('[TC87658_01]Validating the browse and import elements option setting of Prompt in Library Web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier3,
        });
        await libraryPage.openDossierNoWait(dossier3.name);
        await promptEditor.waitForEditor();
        // check browse value in complex default prompt answer
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC87658_01', 'Only browse', { tolerance: 0.1 });
        prompt = await promptObject.getPromptByName(AQPromptName4);
        await promptObject.qualPulldown.selectYourSelection(prompt);
        await promptObject.qualPulldown.openDropDownList(prompt);
        await promptObject.qualPulldown.selectDropDownItem(prompt, 'Year');
        await promptObject.qualPulldown.openBrowseValuesWindow(prompt);
        await promptObject.shoppingCart.waitForShoppingCart(prompt);
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.confirmValues(prompt);

        prompt = await promptObject.getPromptByName(AQBrowse);
        await promptObject.qualPulldown.selectYourSelection(prompt);
        await promptObject.qualPulldown.openDropDownList(prompt);
        await promptObject.qualPulldown.selectDropDownItem(prompt, 'Year');
        await promptObject.qualPulldown.openBrowseValuesWindow(prompt);
        await promptObject.shoppingCart.waitForShoppingCart(prompt);
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.confirmValues(prompt);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();

        await promptObject.selectPromptByIndex({ index: '3', promptName: AQImport });
        prompt = await promptObject.getPromptByName(AQImport);
        await since(`The Browse Value Visible of ${AQImport} should be #{expected}, instead we have #{actual}`)
            .expect(await promptObject.qualPulldown.isBrowseValueVisible(prompt))
            .toBe(false);
        prompt = await promptObject.getPromptByName(AQNo);
        await since(`The Browse Value Visible of ${AQNo} should be #{expected}, instead we have #{actual}`)
            .expect(await promptObject.qualPulldown.isBrowseValueVisible(prompt))
            .toBe(false);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC87658_01', 'No browse and import', {
            tolerance: 0.1,
        });

        await promptObject.selectPromptByIndex({ index: '5', promptName: DayNo });
        prompt = await promptObject.getPromptByName(DayNo);
        await promptObject.qualPulldown.openDropDownList(prompt);
        await promptObject.qualPulldown.selectDropDownItem(prompt, 'Day');
        await promptObject.qualPulldown.clearInputLowerValue(prompt);
        await promptObject.qualPulldown.inputLowerValue(prompt, '1/5/2014');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(2);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Day' }))
            .toBe('1/5/2014');
    });

    it('[TC87658_02]Validating the browse and import elements option setting of Prompt in Library Web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier4,
        });
        await libraryPage.openDossierNoWait(dossier4.name);
        await promptEditor.waitForEditor();
        // check browse value in normal default prompt answer
        prompt = await promptObject.getPromptByName(AQPromptName4);
        await since(`The Browse Value Visible of ${AQPromptName4} should be #{expected}, instead we have #{actual}`)
            .expect(await promptObject.qualPulldown.isBrowseValueVisible(prompt))
            .toBe(true);
        prompt = await promptObject.getPromptByName(AQBrowse);
        await since(`The Browse Value Visible of ${AQBrowse} should be #{expected}, instead we have #{actual}`)
            .expect(await promptObject.qualPulldown.isBrowseValueVisible(prompt))
            .toBe(true);
        await promptObject.selectPromptByIndex({ index: '3', promptName: AQImport });
        prompt = await promptObject.getPromptByName(AQImport);
        await since(`The Browse Value Visible of ${AQImport} should be #{expected}, instead we have #{actual}`)
            .expect(await promptObject.qualPulldown.isBrowseValueVisible(prompt))
            .toBe(false);
        prompt = await promptObject.getPromptByName(AQNo);
        await since(`The Browse Value Visible of ${AQNo} should be #{expected}, instead we have #{actual}`)
            .expect(await promptObject.qualPulldown.isBrowseValueVisible(prompt))
            .toBe(false);
        await promptObject.selectPromptByIndex({ index: '5', promptName: DayNo });
        prompt = await promptObject.getPromptByName(DayNo);
        await since(`The Browse Value Visible of ${DayNo} should be #{expected}, instead we have #{actual}`)
            .expect(await promptObject.qualPulldown.isBrowseValueVisible(prompt))
            .toBe(false);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(5);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Day' }))
            .toBe('1/3/2014');
    });
});

export const config = specConfiguration;
