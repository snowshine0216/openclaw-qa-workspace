import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { getAttributeValue } from '../../../utils/getAttributeValue.js';

const specConfiguration = { ...customCredentials('_prompt') };

describe('Accessibility test of AE prompt', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const dossier = {
        id: 'DF7503764288F69BA1CF36A888709C17',
        name: 'AE with all style',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, libraryPage, dossierPage, grid, promptObject, promptEditor, quickSearch, fullSearch } = browsers.pageObj1;
    let promptName, prompt;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossierNoWait(dossier.name);
        await promptEditor.waitForEditor();
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC92085] Validate the accessibility of prompt summary in AE Prompt', async () => {
        await promptEditor.tabForward(2);
        await promptEditor.enter();
        const promptName = 'Year - Check box';
        await promptEditor.waitForSummaryItem(promptName);
        // check view summary icon
        await since('Role of view summary icon is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptEditor.getSwitchSummaryButton(), 'role'))
            .toBe('switch');
        await since('TabIndex of view summary icon is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptEditor.getToggleViewSummary(), 'tabIndex'))
            .toEqual(0);
        // check prompt summary
        await since('Check box prompt summary is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkQualSummaryOfDefault(promptName))
            .toBe('The default selection is:Item = Fitness for Dummies or Olympus LT Zoom Compact Camera');
        await since('Role of check box prompt summary is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptEditor.getAllPromptSummary()[0], 'role'))
            .toBe('listitem');
        await since('Role of check box prompt summary header is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptEditor.getSummaryTitleBar()[0], 'role'))
            .toBe('heading');
        await since(
            'AriaLabel of check box prompt summary header is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await getAttributeValue(await promptEditor.getSummaryTitleBar()[0], 'ariaLabel'))
            .toBe('Required 1.Year - Check box');
        await since('Role of check box prompt complex answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptEditor.getComplexAnswer()[0], 'role'))
            .toBe('text');
        await since(
            'Role of check box prompt complex answer value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await getAttributeValue(await promptEditor.getComplexAnswerValue()[0], 'role'))
            .toBe('text');
        await promptEditor.f6();
        await promptEditor.tab();
        // check run button
        await since('Role of run button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptEditor.getRunButton(), 'role'))
            .toBe('button');
        await since('TabIndex of run button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptEditor.getRunButton(), 'tabIndex'))
            .toEqual(0);
        await promptEditor.enter();
        await dossierPage.waitForDossierLoading();
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2015');
    });

    it('[TC89830] Validate the accessibility of List Style in AE Prompt', async () => {
        await promptEditor.tab();
        await promptEditor.arrowDown();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC89830_01', 'focus on List prompt index');

        await promptEditor.enter();
        await promptEditor.waitForEditor();
        // check prompt index
        await since('Role of prompt index is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptEditor.getSelectedPrompt(), 'role'))
            .toBe('menuitem');
        await since('TabIndex of prompt index is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptEditor.getSelectedPrompt(), 'tabIndex'))
            .toEqual(-1);

        promptName = 'Year - List';
        prompt = await promptObject.getPromptByName(promptName);
        // check search box
        await since('AriaLabel of search box is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptObject.shoppingCart.getSearchBoxContainer(prompt), 'ariaLabel'))
            .toBe('Search for:');
        // uncheck match case
        await promptEditor.tab();
        await promptEditor.enter();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC89830_02', 'match case');
        await since('AriaLabel of List is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptObject.checkBox.getCheckListContainer(prompt), 'ariaLabel'))
            .toBe('Choose elements of Year.');
        await since('Role of List is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptObject.checkBox.getCheckListContainer(prompt), 'role'))
            .toBe('listbox');
        await since('TabIndex of List is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptObject.checkBox.getCheckListContainer(prompt), 'tabIndex'))
            .toEqual(0);
        // check 2014, uncheck 2015
        await promptEditor.tab();
        await promptEditor.enter();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC89830_03', 'check 2014');
        await promptEditor.arrowDown();
        await promptEditor.enter();
        // check prompt summary
        await promptEditor.f6(3);
        await promptEditor.enter();
        await promptEditor.waitForSummaryItem(promptName);
        await since('The list prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe('2014');
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC89830_04', 'prompt summary');
        await promptEditor.tabForward(2);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC89830_05', 'run button');
        await promptEditor.enter();
        await dossierPage.waitForDossierLoading();
        await since('The grid display is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.isTableExist('Visualization 1'))
            .toBe(false);
    });

    it('[TC89831] Validate the accessibility of Pull Down Style in AE Prompt', async () => {
        await promptEditor.tab();
        await promptEditor.navigateDownWithArrow(2);
        await promptEditor.enter();
        promptName = 'Year - Pull down';
        prompt = await promptObject.getPromptByName(promptName);
        // seclect 2017
        await promptEditor.tabForward(2);
        await promptEditor.enter();
        await promptEditor.navigateDownWithArrow(2);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC89831', 'select 2017');
        await since('AriaLabel of pull down is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptObject.pulldown.getPullDownContainer(prompt), 'ariaLabel'))
            .toBe('Choose elements of Year.');
        await since('Role of pull down is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptObject.pulldown.getPullDownContainer(prompt), 'role'))
            .toBe('listbox');
        await since('TabIndex of pull down is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptObject.pulldown.getPullDownContainer(prompt), 'tabIndex'))
            .toEqual(0);
        await promptEditor.enter();
        // check prompt summary
        await promptEditor.f6(3);
        await promptEditor.enter();
        await promptEditor.waitForSummaryItem(promptName);
        await since('The list prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe('2017');
        await promptEditor.tabForward(2);
        await promptEditor.enter();
        await dossierPage.waitForDossierLoading();
        await since('The grid display is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.isTableExist('Visualization 1'))
            .toBe(false);
    });

    it('[TC89832] Validate the accessibility of Radio button Style in AE Prompt', async () => {
        await promptEditor.tab();
        await promptEditor.navigateDownWithArrow(3);
        await promptEditor.enter();
        promptName = 'Year - Radio button';
        prompt = await promptObject.getPromptByName(promptName);
        await since('AriaLabel of Radio button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptObject.checkBox.getCheckListContainer(prompt), 'ariaLabel'))
            .toBe('Choose elements of Year.');
        await since('Role of Radio button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptObject.checkBox.getCheckListContainer(prompt), 'role'))
            .toBe('listbox');
        await since('TabIndex of Radio button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptObject.checkBox.getCheckListContainer(prompt), 'tabIndex'))
            .toEqual(0);
        // secect 2017
        await promptObject.radioButton.searchFor(prompt, '2017');
        await promptEditor.tabForward(3);
        await promptEditor.navigateDownWithArrow(3);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC89832', 'select 2017');
        await promptEditor.enter();
        // check prompt summary
        await promptEditor.f6(3);
        await promptEditor.enter();
        await promptEditor.waitForSummaryItem(promptName);
        await since('The Radio button prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe('2017');
        await promptEditor.tabForward(2);
        await promptEditor.enter();
        await dossierPage.waitForDossierLoading();
        await since('The grid display is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.isTableExist('Visualization 1'))
            .toBe(false);
    });

    it('[TC89833] Validate the accessibility of Shopping Cart Style in AE Prompt', async () => {
        await promptEditor.tab();
        await promptEditor.navigateDownWithArrow(4);
        await promptEditor.enter();
        promptName = 'Year - Shopping Cart';
        prompt = await promptObject.getPromptByName(promptName);
        await since('AriaLabel of Shopping Cart is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptObject.shoppingCart.getListContainer(prompt)[0], 'ariaLabel'))
            .toBe('Available:');
        await since('Role of Shopping Cart is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptObject.shoppingCart.getListContainer(prompt)[0], 'role'))
            .toBe('listbox');
        await since('TabIndex of Shopping Cart is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptObject.shoppingCart.getListContainer(prompt)[0], 'tabIndex'))
            .toEqual(0);
        await since('Role of Add button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptObject.shoppingCart.getAddButton(prompt), 'role'))
            .toBe('button');
        await since('TabIndex of Add button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptObject.shoppingCart.getAddButton(prompt), 'tabIndex'))
            .toEqual(0);
        // Add 2017
        await promptEditor.tabForward(2);
        await promptEditor.navigateDownWithArrow(1);
        await promptEditor.enter();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC89833', 'select 2017');
        await promptEditor.tab();
        await promptEditor.enter();
        await since('Warning message of 3 answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe('You have made more selections than are allowed for this prompt. Please remove some selections.');
        // remove 2015,2017
        await promptEditor.tabForward(3);
        await promptEditor.navigateDownWithArrow(1);
        await promptEditor.enter();
        await promptEditor.navigateDownWithArrow(1);
        await promptEditor.shiftEnter();
        await promptEditor.tabBackward(2);
        await promptEditor.enter();
        // check prompt summary
        await promptEditor.f6(3);
        await promptEditor.enter();
        await promptEditor.waitForSummaryItem(promptName);
        await since('The Shopping Cart prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe('2014');
        await promptEditor.tabForward(2);
        await promptEditor.enter();
        await dossierPage.waitForDossierLoading();
        await since('The grid display is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.isTableExist('Visualization 1'))
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.waitForEditor();
        await since('prompt dialog should be open')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await promptEditor.esc();
        await since('ESC can close prompt dialog')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
    });

    it('[TC92110] Validate the accessibility of Check Box Style in AE Prompt', async () => {
        await promptEditor.tabForward(5);
        promptName = 'Year - Check box';
        prompt = await promptObject.getPromptByName(promptName);
        await promptEditor.waitForEditor();
        await since('AriaLabel of Check Box is supposed to be #{expected}, instead we have #{actual}')
            .expect(
                await getAttributeValue(await promptObject.checkBox.getCheckListTableContainer(prompt), 'ariaLabel')
            )
            .toBe('Choose elements of Year.');
        await since('Role of Check Box is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptObject.checkBox.getCheckListTableContainer(prompt), 'role'))
            .toBe('grid');
        await since('TabIndex of Check Box is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await promptObject.checkBox.getCheckListTableContainer(prompt), 'tabIndex'))
            .toEqual(0);
        // choose Art As Experience
        await promptEditor.navigateDownWithArrow(2);
        await promptEditor.enter();
        // switch to next page
        await promptEditor.tabForward(2);
        await promptEditor.enter();
        await promptEditor.waitForEditor();
        await promptEditor.tabBackward(4);
        await promptEditor.navigateDownWithArrow(1);
        // choose end element of first row
        await promptEditor.end();
        await promptEditor.enter();
        // choose end element of last row
        await promptEditor.ctrlEnd();
        await promptEditor.enter();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC92110_01', 'check end element of last row');
        // choose first element of last row
        await promptEditor.home();
        await promptEditor.enter();
        // choose first element of first row
        await promptEditor.ctrlHome();
        await promptEditor.enter();
        // check prompt summary
        await promptEditor.f6(3);
        await promptEditor.enter();
        await promptEditor.waitForSummaryItem(promptName);
        await since('The Check Box prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName))
            .toBe(
                'Art As Experience, The Prince, The Catcher in the Rye, Games for the Superintelligent, How to Live with a Neurotic Dog'
            );
        await promptEditor.tabForward(2);
        await promptEditor.enter();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.waitForEditor();
        // choose your selection
        await promptEditor.tabForward(9);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC92110_02', 'focus default selection');
        await promptEditor.navigateUpWithArrow(1);
        await promptEditor.tabBackward(1);
        await promptEditor.enter();
        await promptEditor.waitForSummaryItem(promptName);
        await since('The Check Box prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkEmptySummary(promptName))
            .toBe('No Selection');
        await promptEditor.tabForward(2);
        // run with no selsetion
        await promptEditor.enter();
        await since('Run dossier with empty value, the message box should be #{expected} but is #{actual}')
            .expect(await promptEditor.isErrorPresent())
            .toEqual(true);
        await promptEditor.enter();
        await promptEditor.tabForward(2);
        await promptEditor.enter();
        await since('Error message for answer required is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe('This prompt requires an answer.');

        await promptEditor.tabForward(2);
        await promptEditor.navigateDownWithArrow(1);
        // check summary
        await promptEditor.f6(3);
        await promptEditor.enter();
        await promptEditor.waitForSummaryItem(promptName);
        await since('The Check Box prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkQualSummaryOfDefault(promptName))
            .toBe(
                'The default selection is:Item = Art As Experience or The Prince or The Catcher in the Rye or Games for the Superintelligent or How to Live with a Neurotic Dog'
            );
        await promptEditor.tabForward(1);
        await promptEditor.enter();
    });
});

export const config = specConfiguration;
