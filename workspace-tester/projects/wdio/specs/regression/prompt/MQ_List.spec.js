import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_prompt') };
const specName = 'MQ_List';

describe('MQ Prompt - List', () => {
    const MQPromptName = 'Cost';
    const dossier = {
        id: '7F3C41F540A436142B013DADE92BF07C',
        name: 'MQ-List-AnswerRequired-MultiplePersonalAnswer',
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
     * 1. UI check:
     *      (1)List style
     *      (2)metric dropdown menu: when set answer required, there is no "none"
     * 2. answer prompt
     * 3. view summary
     * 4. re-prompt
     * 5. run with new value
     */
    it('[TC59423]Metric Qualification Prompt with List style- Check answer required and answer prompt', async () => {
        prompt = await promptObject.getPromptByName(MQPromptName);
        //  a. Take a screenshot(DefaultUI) to check the default UI and default answer
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC59423', 'DefaultUI');

        // open metric dropdown menu, take screenshot, no "-none-"
        await promptObject.qualPulldown.openDropDownList(prompt);
        await takeScreenshotByElement(promptObject.qualPulldown.getDropDownMenu(prompt), 'TC59423', 'NoNoneInDropDown');

        // choose "Profit", choose condition "Highest%", type in value "50"
        await promptObject.qualPulldown.selectDropDownItem(prompt, 'Profit');
        await promptObject.qualPulldown.openMQConditionList(prompt);
        await promptObject.qualPulldown.scrollDownConditionList(prompt, 400);
        await promptObject.qualPulldown.selectMQCondition(prompt, 'Highest%');
        await promptObject.qualPulldown.clearAndInputLowserValue(prompt, '50');
        // view summary, check summary text
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName))
            .toEqual('ProfitHighest%50at levelDefault');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // re-prompt, check previous answer
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(MQPromptName);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName);
        await since('Previous prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName))
            .toEqual('ProfitHighest%50%at levelDefault');
        await promptEditor.toggleViewSummary();
        // choose metric "Cost", "Highest%", "30%"
        await promptObject.qualPulldown.openDropDownList(prompt);
        await promptObject.qualPulldown.selectDropDownItem(prompt, 'Cost');
        await promptObject.qualPulldown.clearAndInputLowserValue(prompt, '30%');
        // view summary
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName);
        await since('New prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName))
            .toEqual('CostHighest%30%at levelDefault');
        // run RSD, take screenshot for final data
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The rsd grid element display should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.isGridPresnt())
            .toBe(false);
    });
});

export const config = specConfiguration;
