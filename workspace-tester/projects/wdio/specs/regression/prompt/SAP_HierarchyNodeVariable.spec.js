import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_prompt') };

describe('SAP_HierarchyNodeVariable', () => {
    const PromptName1 = 'Var_HierarchyNode_CallCtr_HierarchyVar';
    const PromptName2 = 'Var_HierarchyNode_CallCtr_Mandatory';
    const PromptName3 = 'Var_HierarchyNode_CallCtr_Optional';

    const project = {
        id: '06F4B4424AF3D68156873CA7DBC777FF',
        name: 'SAP Project',
    };

    const dossier1 = {
        name: 'Combine_2_SAP_Variables_Dossier',
        id: 'DF4E840749371765851BED80F3FB4ED3',
        project,
    };
    const dossier2 = {
        name: 'Dimension_Multiple Condition_Required_In List_Default Answer_Dossier',
        id: '1D9C2B3148C33FA162D00A923E6E2729',
        project,
    };
    const dossier3 = {
        name: 'Dimension_Single Condition_Not Required_No Default Answer_Dossier',
        id: 'FC47E90549B2E1B709418CABDCC777F4',
        project,
    };
    const dossier4 = {
        name: 'Search_Multiple Condition_Required_No Default Answer_Dossier',
        id: '02B0DF924A17B8AF7CDE3385BEF52EDB',
        project,
    };

    const browserWindow = {
        
        width: 1600,
        height: 1000,
    };

    const { credentials } = specConfiguration;
    let prompt;
    let { loginPage, dossierPage, libraryPage, promptEditor, grid, promptObject } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC85329] Validate Hierarchy Node Variable SAP prompt in Library Web', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossierNoWait(dossier1.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(PromptName1);

        // Check the default UI
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC85329_01', 'Default UI');
        // Check summary
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(PromptName1);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC85329_02', 'Prompt summary');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The first element of Region attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Level 01' }))
            .toBe('USA');

        //Reprompt and check required
        await promptEditor.reprompt();
        await promptObject.shoppingCart.clickNthSelectedItem(prompt, 1);
        await promptObject.shoppingCart.deleteSingle(prompt, 1);
        await promptEditor.run();
        await promptEditor.dismissError();
        await since('Error message for answer required is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe('This prompt requires an answer.');
        await promptEditor.closeEditor();
        await dossierPage.waitForDossierLoading();
    });

    it('[TC84903_01] Validate Hierarchy node variable SAP prompt with different settings Library Web - multi condition', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossierNoWait(dossier2.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(PromptName2);

        // Check the default UI
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC84903_01', 'Default UI');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(PromptName2);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC84903_02', 'Prompt summary');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The first element of Level 01 attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Level 02' }))
            .toBe('Northeast');
    });

    it('[TC84903_02] Validate Hierarchy node variable SAP prompt with different settings Library Web - single condition and hierarchy', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier3,
        });
        await libraryPage.openDossierNoWait(dossier3.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(PromptName3);

        // Check the default UI
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC84903_03', 'Default UI');
        // Add two condition
        await promptObject.tree.clickEleName(
            prompt,
            'Level 01. [A_CCTR                        GEO_UNBALANCED].[LEVEL00]'
        );
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.tree.clickEleName(
            prompt,
            'Level 01. [A_CCTR                        GEO_UNBALANCED].[LEVEL00]'
        );
        await promptObject.shoppingCart.addSingle(prompt);
        await since('Warning message of 2 answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe('You have made more selections than are allowed for this prompt. Please remove some selections.');
        // Delete two condition
        await promptObject.shoppingCart.clickNthSelectedItem(prompt, 1);
        await promptObject.shoppingCart.deleteSingle(prompt, 1);
        await since(
            'Add remove one selection, show error message is supposed to be #{expected}, instead we get #{actual}'
        )
            .expect(await promptObject.isMessagePresent(prompt))
            .toBe(false);
        await promptObject.shoppingCart.clickNthSelectedItem(prompt, 1);
        await promptObject.shoppingCart.deleteSingle(prompt, 1);
        // Add Level 02 in list Mid-Atlantic
        await promptObject.tree.expandEle(prompt, 'USA');
        await promptObject.tree.clickEleName(prompt, 'Mid-Atlantic');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(PromptName3);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC84903_04', 'Prompt summary');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The first element of Level 01 attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Level 02' }))
            .toBe('Mid-Atlantic');
    });

    it('[TC84903_03] Validate Hierarchy node variable SAP prompt with different settings Library Web - multi hierarchy', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier4,
        });
        await libraryPage.openDossierNoWait(dossier4.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(PromptName1);

        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC84903_05', 'Default UI');
        // Add Level 01 in list France
        await promptObject.tree.expandEle(prompt, 'Balanced GEO. [A_CCTR                        GEO_BALANCED]');
        await promptObject.tree.expandEle(prompt, 'Level 01. [A_CCTR                        GEO_BALANCED].[LEVEL00]');
        await promptObject.tree.clickEleName(prompt, 'France');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();

        // Add Level 02 in list New Orleans
        await promptObject.tree.expandEle(prompt, 'Ban_hie. [A_CCTR                        BALANCED HIERARCHY]');
        await promptObject.tree.expandEle(
            prompt,
            'Level 01. [A_CCTR                        BALANCED HIERARCHY].[LEVEL00]'
        );
        await promptObject.tree.expandEle(prompt, 'USA');
        await promptObject.tree.clickEleName(prompt, 'Level 02. Drill Down');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.clickNthSelectedItem(prompt, 2);
        await promptObject.shoppingCart.openValueListEditor(prompt, 2);
        await promptObject.shoppingCart.addSingle(prompt, true);
        await promptObject.shoppingCart.confirmValues(prompt);

        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(PromptName1);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC84903_06', 'Prompt summary');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The first element of Level 03 DESC attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Level 02' }))
            .toBe('New Orleans');
        await since('The first element of Region attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Level 03' }))
            .toBe('New Orleans');
    });
});

export const config = specConfiguration;
