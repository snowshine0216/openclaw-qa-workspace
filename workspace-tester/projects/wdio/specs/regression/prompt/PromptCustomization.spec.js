import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_prompt') };

describe('Prompt Customization', () => {
    const AQPromptName = 'Attribute qualification';
    const MQPromptName = 'Metric qualification';

    const dossier = {
        id: 'E9C593324516DE55AE4AC08B92D1687C',
        name: 'Dossier with all kinds of prompt',
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

    let { loginPage, commentsPage, grid, dossierPage, libraryPage, promptEditor, promptObject, reset } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
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

    it('[TC92867] Prompt Customization in Library Web - Customization in UI', async () => {
        await promptObject.selectPromptByIndex({ index: '4', promptName: AQPromptName });
        prompt = await promptObject.getPromptByName(AQPromptName);
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await takeScreenshotByElement(
            promptObject.shoppingCart.getValuePart1Editor(prompt),
            'TC92867_01',
            'Customization in OK button',
            {
                tolerance: 0.1,
            }
        );
        await promptObject.shoppingCart.openTypeDropdown(prompt, 1);
        await promptObject.shoppingCart.selectType(prompt, 'Select');
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.selectCondition(prompt, 'Not In List');
        await promptObject.shoppingCart.openValueListEditor(prompt, 1);
        await takeScreenshotByElement(
            promptObject.shoppingCart.getValueListEditor(prompt),
            'TC92867_02',
            'No Customization in OK button',
            {
                tolerance: 0.1,
            }
        );
        await promptEditor.cancelEditor();
    });

    it('[TC92869_01] Prompt Customization in Library Web - Customization in actions in AQ prompt', async () => {
        await promptObject.selectPromptByIndex({ index: '4', promptName: AQPromptName });
        prompt = await promptObject.getPromptByName(AQPromptName);
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        // input value 1
        await promptObject.shoppingCart.inputValues(prompt, 1);
        await promptObject.shoppingCart.clickOKinCustomization('.mstrLQQButton', prompt);
        await since('Click OK button, the error display should be #{expected} but is #{actual}')
            .expect(await promptEditor.isErrorPresent())
            .toEqual(true);
        await since('Error message is expected to be #{expected}, instead we have #{actual}}')
            .expect(await commentsPage.getErrorMsg())
            .toBe('OK?');
        await promptEditor.dismissError();
        await since('Whether the item in selected list is supposed to be #{expected}, instead we have #{actual}')
            .expect(
                await promptObject.shoppingCart.isItemInSelectedListToEdit(prompt, 'Category\nQualify\nID\nEquals\n1')
            )
            .toBe(true);
        await promptObject.shoppingCart.openValuePart1Editor(prompt, 1);
        await promptObject.shoppingCart.inputValues(prompt, 100);
        await promptObject.shoppingCart.cancelValues(prompt);
        await since('Click Cancel button, the error display should be #{expected} but is #{actual}')
            .expect(await promptEditor.isErrorPresent())
            .toEqual(true);
        await since('Error message is expected to be #{expected}, instead we have #{actual}}')
            .expect(await commentsPage.getErrorMsg())
            .toBe('Do you want to cancel?');
        await promptEditor.dismissError();
        await since('Whether the item in selected list is supposed to be #{expected}, instead we have #{actual}')
            .expect(
                await promptObject.shoppingCart.isItemInSelectedListToEdit(prompt, 'Category\nQualify\nID\nEquals\n1')
            )
            .toBe(true);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Revenue' }))
            .toBe('$193,739');
        await promptEditor.reprompt();
        await promptEditor.waitForEditor();

        await promptObject.selectPromptByIndex({ index: '4', promptName: AQPromptName });
        prompt = await promptObject.getPromptByName(AQPromptName);
        // check in browse value dialog
        await promptObject.shoppingCart.openTypeDropdown(prompt, 1);
        await promptObject.shoppingCart.selectType(prompt, 'Select');
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.selectCondition(prompt, 'Not In List');
        await promptObject.shoppingCart.openValueListEditor(prompt, 1);
        await promptObject.shoppingCart.addSingle(prompt, true);
        await promptObject.shoppingCart.cancelValues(prompt);
        await since('Click Cancel button, the error display should be #{expected} but is #{actual}')
            .expect(await promptEditor.isErrorPresent())
            .toEqual(true);
        await since('Error message is expected to be #{expected}, instead we have #{actual}}')
            .expect(await commentsPage.getErrorMsg())
            .toBe('Do you want to cancel?');
        await promptEditor.dismissError();
        await since('Whether the item in selected list is supposed to be #{expected}, instead we have #{actual}')
            .expect(
                await promptObject.shoppingCart.isItemInSelectedListToEdit(
                    prompt,
                    'Category\nSelect\nNot In List\nEmpty'
                )
            )
            .toBe(true);
        await promptObject.shoppingCart.openValueListEditor(prompt, 1);
        await promptObject.shoppingCart.addSingle(prompt, true);
        await promptObject.shoppingCart.confirmValues(prompt);
        await since('Click OK button, the error display should be #{expected} but is #{actual}')
            .expect(await promptEditor.isErrorPresent())
            .toEqual(true);
        await since('Error message is expected to be #{expected}, instead we have #{actual}}')
            .expect(await commentsPage.getErrorMsg())
            .toBe('Do you want to cancel?');
        await promptEditor.dismissError();
        await since('Whether the item in selected list is supposed to be #{expected}, instead we have #{actual}')
            .expect(
                await promptObject.shoppingCart.isItemInSelectedListToEdit(
                    prompt,
                    'Category\nSelect\nNot In List\nBooks'
                )
            )
            .toBe(true);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Revenue' }))
            .toBe('$1,569,000');
    });

    it('[TC92869_02] Prompt Customization in Library Web - Customization in actions in MQ prompt', async () => {
        await promptObject.selectPromptByIndex({ index: '5', promptName: MQPromptName });
        prompt = await promptObject.getPromptByName(MQPromptName);
        // choose "Revenue"
        await promptObject.qualPulldown.openDropDownList(prompt);
        await promptObject.qualPulldown.selectDropDownItem(prompt, 'Revenue');
        // open level dropdown, choose "Choose attributes..."
        await promptObject.qualPulldown.openMQLevelList(prompt);
        await promptObject.qualPulldown.openChooseAttributesWindow(prompt);
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.cancelValues(prompt);
        await since('Click Cancel button, the error display should be #{expected} but is #{actual}')
            .expect(await promptEditor.isErrorPresent())
            .toEqual(true);
        await since('Error message is expected to be #{expected}, instead we have #{actual}}')
            .expect(await commentsPage.getErrorMsg())
            .toBe('Do you want to cancel?');
        await promptEditor.dismissError();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName))
            .toEqual('RevenueGreater than or equal toValueat levelDefault');
        await promptEditor.toggleViewSummary();

        await promptObject.qualPulldown.openMQLevelList(prompt);
        await promptObject.qualPulldown.openChooseAttributesWindow(prompt);
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.confirmValues(prompt);
        await since('Click OK button, the error display should be #{expected} but is #{actual}')
            .expect(await promptEditor.isErrorPresent())
            .toEqual(true);
        await since('Error message is expected to be #{expected}, instead we have #{actual}}')
            .expect(await commentsPage.getErrorMsg())
            .toBe('Do you want to cancel?');
        await promptEditor.dismissError();
        await promptObject.qualPulldown.clearAndInputLowserValue(prompt, '10000');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName))
            .toEqual('RevenueGreater than or equal to10000at level3rd party Customer ID (Amadeus)');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Revenue' }))
            .toBe('$1,762,739');
        await promptEditor.reprompt();
        await promptEditor.waitForEditor();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName))
            .toEqual('RevenueGreater than or equal to10000at level3rd party Customer ID (Amadeus)');
        await promptEditor.cancelEditor();
    });
});

export const config = specConfiguration;
