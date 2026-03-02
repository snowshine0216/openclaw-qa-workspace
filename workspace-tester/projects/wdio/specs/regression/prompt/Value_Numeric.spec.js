import { customCredentials } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_prompt') };
const project = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

/**
 * Confluence Page:
 * https://microstrategy.atlassian.net/wiki/spaces/TTAWC/pages/822153414/Value+-+Numeric
 */
describe('Value Prompt - Numeric', () => {
    const dossier1 = {
        id: '8DC29A164965B4EE351FE18B6AF714ED',
        name: 'Value_Numeric_Region ID_Stepper_Discard current answer',
        project,
    };
    const dossier2 = {
        id: '56AC0805418DB31D039644A01715A7B4',
        name: 'Value_Numeric_Region ID_Text Box_MinMax',
        project,
    };
    const dossier3 = {
        id: '7C135AED4AC26CAE235FF0A4813E4EAC',
        name: 'Value_Numeric_Region ID_Wheel_Max100',
        project,
    };
    const dossier4 = {
        id: '82EAC27243A1DA820FB6BFBB49B92779',
        name: 'Value_Numeric_Region ID_Slider_PersonalAnswerAllowed',
        project,
    };
    const dossier5 = {
        id: '2A9DEDF8402B77E475B69F8F61D1EE91',
        name: 'Value_Numeric_Region ID_Switch_Disable Prompt',
        project,
    };

    const promptName = 'Number';
    const browserWindow = {
        
        width: 1600,
        height: 1000,
    };
    const { credentials } = specConfiguration;
    let prompt, textbox;
    let { loginPage, promptObject, grid, rsdGrid, libraryPage, promptEditor, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        textbox = promptObject.textbox;
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC66079] Value(Numeric) prompt with Stepper style', async () => {
        await resetDossierState({ credentials, dossier: dossier1 });
        await libraryPage.openDossierNoWait(dossier1.name);
        await promptEditor.waitForEditor();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC66079', 'Stepper');
        prompt = await promptObject.getPromptByName(promptName);

        // Answer prompt with valid value
        await textbox.clearAndInputText(prompt, '1');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(2);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('Northeast');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Revenue' }))
            .toBe('$8,554,415');

        // Clear prompt answer
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(promptName);
        await textbox.clearAndInputText(prompt, '');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt summary of empty answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkEmptySummary(promptName))
            .toBe('No Selection');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(9);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('Central');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Revenue' }))
            .toBe('$5,029,366');

        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(promptName);
        await since('Previous answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await textbox.text(prompt))
            .toBe('');

        // Answer prompt with invalid value
        await textbox.clearAndInputText(prompt, 'abc');
        await since('Error message for invalid value is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe('You have entered an invalid answer. Please enter a value of the correct data type.');
        await textbox.clearAndInputText(prompt, '1,2');
        await promptObject.qualPulldown.sleep(5000);
        await since('Error message for invalid action is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.isErrorPresent(prompt))
            .toEqual(false);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt summary of empty answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary(promptName))
            .toBe('1,2');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(2);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('Web');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Revenue' }))
            .toBe('$3,902,762');
    });

    it('[TC66081] Value(Numeric) prompt with textbox style set Min0Max100', async () => {
        await resetDossierState({ credentials, dossier: dossier2 });
        await libraryPage.openDossierNoWait(dossier2.name);
        await promptEditor.waitForEditor();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC66081', 'textbox', {
            tolerance: 0.2,
        });
        prompt = await promptObject.getPromptByName(promptName);

        // Check minmax setting
        await textbox.clearAndInputText(prompt, '0');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.isTableExist('Visualization 1'))
            .toBe(false);
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(promptName);
        await textbox.clearAndInputText(prompt, '-1');
        await promptEditor.run();
        await promptEditor.waitForMessageBox();
        await promptEditor.dismissError();
        await since('Warning message of input -1 is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe(
                'You have entered a value that is less than the one allowed for this prompt. Please enter a greater value.'
            );
        await textbox.clearAndInputText(prompt, '102');
        await promptEditor.run();
        await promptEditor.waitForMessageBox();
        await promptEditor.dismissError();
        await since('Warning message of input 102 is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe(
                'You have entered a value that is greater than the one allowed for this prompt. Please enter a lesser value.'
            );
        await textbox.clearAndInputText(prompt, '5');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt summary of empty answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary(promptName))
            .toBe('5');
        await promptEditor.toggleViewSummary();
        await since('Error message for invalid action is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.isErrorPresent(prompt))
            .toEqual(false);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(2);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('South');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Revenue' }))
            .toBe('$5,389,280');
    });

    it('[TC66082] Value(Numeric) prompt with wheel style set max100', async () => {
        await resetDossierState({ credentials, dossier: dossier3 });
        await libraryPage.openDossierNoWait(dossier3.name);
        await promptEditor.waitForEditor();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC66082', 'wheel', {
            tolerance: 0.2,
        });
        prompt = await promptObject.getPromptByName(promptName);

        // Check minmax setting
        await textbox.clearAndInputText(prompt, '110');
        await promptEditor.run();
        await promptEditor.waitForMessageBox();
        await promptEditor.dismissError();
        await since('Warning message of input 110 is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe(
                'You have entered a value that is greater than the one allowed for this prompt. Please enter a lesser value.'
            );
        await textbox.clearAndInputText(prompt, '-1');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt summary of empty answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary(promptName))
            .toBe('-1');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.isTableExist('Visualization 1'))
            .toBe(false);
    });

    it('[TC66083] Value(Numeric) prompt with slider style', async () => {
        await resetDossierState({ credentials, dossier: dossier4 });
        await libraryPage.openDossierNoWait(dossier4.name);
        await promptEditor.waitForEditor();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC66083', 'slider', {tolerance: 0.2});

        // Run with default value
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Region', 'Metrics', 'Revenue']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Northeast', '$8,554,415']);
    });

    it('[TC66084] Value(Numeric) prompt with switch style disable prompt', async () => {
        await resetDossierState({ credentials, dossier: dossier5 });
        await libraryPage.openDossier(dossier5.name);
        await promptEditor.reprompt();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC66084', 'switch');
        prompt = await promptObject.getPromptByName(promptName);

        // Run with value(numeric) prompt in switch style
        await textbox.clearAndInputText(prompt, '5');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('Prompt summary of empty answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary(promptName))
            .toBe('5');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Region', 'Metrics', 'Revenue']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['South', '$5,389,280']);
    });
});

export const config = specConfiguration;
