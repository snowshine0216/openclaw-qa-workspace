import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_prompt') };
const specName = 'MQ_RadioButton';

describe('MQ Prompt - Radio Button', () => {
    const MQPromptName = 'Cost';
    const dossier = {
        id: '979D83DD4E7AACFB0AF93AAB7354E615',
        name: 'MQ-RadioButton-FixedWidthHeight',
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

    beforeEach(async () => {
        // reset and open dossier
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

    it('[TC59618]Metric Qualification Prompt with Radio Button style- answer prompt', async () => {
        prompt = await promptObject.getPromptByName(MQPromptName);
        //  a. Take a screenshot(DefaultUI) to check the default UI and default answer
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC59618', 'DefaultUI');

        // Answer prompt
        await promptObject.qualPulldown.openDropDownList(prompt);
        await promptObject.qualPulldown.selectDropDownItem(prompt, 'Cost');
        await promptObject.textbox.clearAndInputText(prompt, '7343097');
        await promptEditor.toggleViewSummary();
        await since('Prompt summary should be #{expected} but is #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName))
            .toEqual('CostGreater than or equal to7343097at levelDefault');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(4);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2014');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$7,343,097.059599990');
        // Reprompt, change metric and value
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(MQPromptName);
        await promptObject.qualPulldown.openDropDownList(prompt);
        await promptObject.qualPulldown.selectDropDownItem(prompt, 'Revenue');
        await promptObject.qualPulldown.openMQConditionList(prompt);
        await promptObject.qualPulldown.scrollDownConditionList(prompt, 200);
        await promptObject.qualPulldown.selectMQCondition(prompt, 'Is Not Null');
        await promptEditor.toggleViewSummary();
        await since('New prompt answer should be #{expected} but is #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName))
            .toEqual('RevenueIs Not Nullat levelDefault');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(4);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2014');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$7,343,097.059599990');
    });
});

export const config = specConfiguration;
