import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_prompt') };

describe('SAP_HierarchyNodeVariableXFun', () => {
    const PromptName1 = 'Var_HierarchyNode_CallCtr_Optional';
    const PromptName2 = 'Var_HierarchyNode_CallCtr_Mandatory';

    const project = {
        id: '06F4B4424AF3D68156873CA7DBC777FF',
        name: 'SAP Project',
    };

    const dossier = {
        name: 'Linking Dossier',
        id: '65B0E0794D27C70AAAE79FB6BAD38664',
        project,
    };
    const rsd = {
        name: 'Linking Document',
        id: 'A23F56364BE86EFB978BE793FE4CC68D',
        project,
    };

    const browserWindow = {
        
        width: 1600,
        height: 1000,
    };
    let prompt;
    const { credentials } = specConfiguration;
    let { loginPage, dossierPage, libraryPage, promptEditor, textbox, promptObject } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC85330] Validate X-Func of Hierarchy Node Variable SAP prompt in Library Web - Dossier Linking', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        await libraryPage.openDossierNoWait(dossier.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(PromptName1);

        // Check source prompt
        await since('Selected items in source is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getSelectedConditionItemCount(prompt))
            .toBe(1);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(PromptName1);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC85330_01', 'Source prompt summary');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();

        // Link to dossier_Prompt user
        await textbox.navigateLink(1);
        await dossierPage.switchToTab(1);
        await promptEditor.waitForEditor();
        await since('Dossier linking with prompt user should show prompt window')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        // await since('Selected items with Prompt user is supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await promptObject.shoppingCart.getSelectedConditionItemCount(prompt))
        //     .toBe(1);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(PromptName1);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC85330_02', 'Target prompt user summary');
        await dossierPage.closeTab(1);

        // Link to dossier_Use the default answer
        await textbox.navigateLink(2);
        await dossierPage.switchToTab(1);
        await since('Dossier linking with use the default answer should not show prompt window')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        // await since(
        //     'Selected items with Use the default answer is supposed to be #{expected}, instead we have #{actual}'
        // )
        //     .expect(await promptObject.shoppingCart.getSelectedConditionItemCount(prompt))
        //     .toBe(1);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(PromptName1);
        await takeScreenshotByElement(
            promptEditor.getPromptEditor(),
            'TC85330_03',
            'Target Use the default answer summary'
        );
        await dossierPage.closeTab(1);

        // Link to dossier_Ignore prompt
        await textbox.navigateLink(3);
        await dossierPage.switchToTab(1);
        await since('Dossier linking with ignore prompt should not show prompt window')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        // await since('Selected items is supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await promptObject.shoppingCart.getSelectedConditionItemCount(prompt))
        //     .toBe(0);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(PromptName1);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC85330_03', 'Target ignore prompt summary');
        await dossierPage.closeTab(1);

        // Link to dossier_Same with source
        await textbox.navigateLink(6);
        await dossierPage.switchToTab(1);
        await since('Dossier linking with Same with source should not show prompt window')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        // await since('Selected items with Same with source is supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await promptObject.shoppingCart.getSelectedConditionItemCount(prompt))
        //     .toBe(1);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(PromptName1);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC85330_04', 'Target Same with source summary');
        await dossierPage.closeTab(1);
    });

    it('[TC85372] Validate X-Func of Hierarchy Node Variable SAP prompt in Library Web - RSD Linkdrill', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: rsd,
        });

        await libraryPage.openDossierNoWait(rsd.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(PromptName2);

        // Check source prompt
        await since('Selected items in source is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getSelectedConditionItemCount(prompt))
            .toBe(2);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(PromptName2);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC85372_01', 'Source prompt summary');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();

        // Link to report(having default answer)_Same from the source
        // await dossierPage.clickTextfieldByTitle('Link to report\\(having default answer\\)_Same from the source');
        // await dossierPage.switchToTab(1);
        // await dossierPage.waitForDossierLoading();
        // await since('RSD linkdrill with Same with source should not show prompt window')
        //     .expect(await promptEditor.isEditorOpen()).toBe(false);
        // await promptEditor.reprompt();
        // await since('Selected items with Same with source is supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await promptObject.shoppingCart.getSelectedConditionItemCount(prompt)).toBe(2);
        // await promptEditor.toggleViewSummary();
        // await promptEditor.waitForSummaryItem(PromptName2);
        // await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC85372_02', 'Target Same with source summary');
        // await dossierPage.closeTab(1);

        // Link to Dossier(having default answer)_Prompt user
        await dossierPage.clickTextfieldByTitle('Link to Dossier(having default answer)_Prompt user');
        await dossierPage.switchToTab(1);
        await promptEditor.waitForEditor();
        await since('RSD linkdrill with prompt user should show prompt window')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        prompt = await promptObject.getPromptByName(PromptName2);
        await since('Selected items with RSD linkdrill is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getSelectedConditionItemCount(prompt))
            .toBe(4);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(PromptName2);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC85372_03', 'Target prompt user summary');
        await dossierPage.closeTab(1);

        // Link to Report(No default answer)_Use default answer
        await dossierPage.clickTextfieldByTitle('Link to Report(No default answer)_Use default answer');
        await dossierPage.switchToTab(1);
        await promptEditor.waitForEditor();
        await since('RSD linkdrill with use the default answer should not show prompt window')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        prompt = await promptObject.getPromptByName(PromptName2);
        await since('Selected items with RSD linkdrill is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getSelectedConditionItemCount(prompt))
            .toBe(0);
        await dossierPage.closeTab(1);

        // Link to document(having default answer)_Use default answer
        await dossierPage.clickTextfieldByTitle('Link to document(having default answer)_Use default answer');
        await dossierPage.switchToTab(1);
        await since('RSD linkdrill with use the default answer should not show prompt window')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(PromptName2);
        await since('Selected items with RSD linkdrill is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getSelectedConditionItemCount(prompt))
            .toBe(2);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(PromptName2);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC85372_04', 'Target prompt user summary');
        await dossierPage.closeTab(1);
    });
});

export const config = specConfiguration;
