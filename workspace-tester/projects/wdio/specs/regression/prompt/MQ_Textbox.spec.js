import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_prompt') };
const specName = 'MQ_Textbox';

describe('MQ Prompt - Text Box', () => {
    const MQPromptName = 'Cost';
    const dossier = {
        id: '2F60626D418DB16F4474A29AA13FC019',
        name: 'MQ-Textbox-UseCurrentAnswerAsDefaultAnswer',
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

    let { loginPage, dossierPage, libraryPage, promptEditor, promptObject, rsdGrid } = browsers.pageObj1;

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

    /**
     * Check points:
     * 1. textbox style(GUI)
     * 2. run RSD with default answer
     * 3. re-prompt to check previous answer is kept
     * 4. answer prompt with new values(number/decimal/chars/blank/special chars)
     * 5. view summary to check prompt summary is consistant with what we answer
     * 6. run RSD with new answer
     */
    it('[TC59294]Metric Qualification Prompt with Textbox style- Check default answer and answer prompt', async () => {
        prompt = await promptObject.getPromptByName(MQPromptName);
        // view summary
        await promptEditor.toggleViewSummary();
        await since('Default prompt answer should be #{expected} but is #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName))
            .toEqual('CostGreater than7654321at levelDefault');
        // Run prompt with default selection
        //  a. Take a screenshot(RunPromptResultWithDefaultAnswer) to check the default UI
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Year', 'Cost']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['2015', '$9,777,521']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(3))
            .toEqual(['2016', '$12,609,467']);
        // Re-prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(MQPromptName);

        // CLear value and run prompt
        await promptObject.textbox.clickTextBoxInput(prompt);
        await promptObject.textbox.clearAndInputText(prompt, '');
        await promptEditor.run();
        await since('Run dossier with empty value, the message box should be #{expected} but is #{actual}')
            .expect(await promptEditor.isErrorPresent())
            .toEqual(true);
        // Close popup and check warning message
        await promptEditor.dismissError();
        await since('When input empty value, warning message should be #{expected} but is #{actual}')
            .expect(await promptObject.textbox.errorMsg(prompt))
            .toEqual('The condition for your answer is not completed.');

        // Input chars, check warning message
        await promptObject.textbox.clearAndInputText(prompt, 'abc!@#');
        // There is warning message showing, so use sleep
        await promptObject.textbox.sleep(5000);
        await since('When input invalid value, warning message should be #{expected} but is #{actual}')
            .expect(await promptObject.textbox.errorMsg(prompt))
            .toEqual('You have entered an invalid answer. Please enter a value of the correct data type.');

        // Input valid value, warning message disappears
        await promptObject.textbox.clearAndInputText(prompt, '9,876,543');
        // Check warning message disappear, so use sleep
        await promptObject.textbox.sleep(5000);
        await promptEditor.toggleViewSummary();
        await since('The prompt answer should be #{expected} but is #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName))
            .toEqual('CostGreater than9,876,543at levelDefault');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['2016', '$12,609,467']);

        // Reprompt
        //  a. check previous value
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(MQPromptName);
        await since('When value contains comma, reprompt, comma is removed.')
            .expect(await promptObject.textbox.text(prompt))
            .toEqual('9876543');
        // change metric and value
        await promptObject.qualPulldown.openDropDownList(prompt);
        await promptObject.qualPulldown.selectDropDownItem(prompt, 'Profit');
        await promptObject.textbox.clearAndInputText(prompt, '9876.543');
        await promptEditor.toggleViewSummary();
        await since('New prompt answer should be #{expected} but is #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName))
            .toEqual('ProfitGreater than9876.543at levelDefault');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['2014', '$7,343,097']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(4))
            .toEqual(['2016', '$12,609,467']);
    });
});

export const config = specConfiguration;
