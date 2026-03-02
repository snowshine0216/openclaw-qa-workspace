import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_prompt') };

describe('SAP_CharacteristicValueVariable', () => {
    const PromptName1 = 'Var_CharacteristicValue_Region_Mandatory';
    const PromptName2 = 'Cat_customer_exit';
    const PromptName3 = 'HN_Authorization';

    const project = {
        id: '06F4B4424AF3D68156873CA7DBC777FF',
        name: 'SAP Project',
    };

    const dossier1 = {
        name: 'Query_CharacteristicValue_Mandatory',
        id: '3198D3324C3C23074924BBA8CF471241',
        project,
    };
    const dossier2 = {
        name: 'CharacteristicValue and hierarchy node',
        id: '961E419F41451B90D2AD57A330EBC036',
        project,
    };
    const dossier3 = {
        name: 'Authentication Combined with Characteristic variable',
        id: 'FA05B4EB468B8F4089760BB6E2B8BD90',
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

    it('[TC85325] Validate Characteristic Value Variable SAP prompt in Library Web', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossierNoWait(dossier1.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(PromptName1);

        // Check the default UI
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC85325_01', 'Default UI');
        // Add Southeast
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Southeast');
        await promptObject.shoppingCart.addSingle(prompt);
        await since('Add two selection, show error message is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.isMessagePresent(prompt))
            .toBe(true);
        await since('Warning message of 2 answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe('You have made more selections than are allowed for this prompt. Please remove some selections.');
        // Remove Northeast
        await promptObject.shoppingCart.clickElmInSelectedList(prompt, 'Northeast');
        await promptObject.shoppingCart.removeSingle(prompt);
        await since('Add one selection, show error message is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.isMessagePresent(prompt))
            .toBe(false);
        // Check summary
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(PromptName1);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC85325_02', 'Prompt summary');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The first element of Region attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('Southeast');
    });

    it('[TC85326_01] Validate Characteristic Value Variable SAP prompt with Hierarchy Node SAP prompt in Library Web', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossierNoWait(dossier2.name);
        await promptEditor.waitForEditor();

        // Check the default UI
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC85326_01', 'Default UI');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(PromptName1);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC85326_02', 'Prompt summary');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The first element of Level 01 attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Level 01' }))
            .toBe('USA');
    });

    it('[TC85326_02] Validate Characteristic Value Variable SAP prompt with Authentication Hierarchy Node SAP prompt in Library Web', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier3,
        });
        await libraryPage.openDossierNoWait(dossier3.name);
        await promptEditor.waitForEditor();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC85326_03', 'Default UI');

        // Add Movies remove Books
        prompt = await promptObject.getPromptByName(PromptName2);
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Movies');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.clickElmInSelectedList(prompt, 'Books');
        await promptObject.shoppingCart.removeSingle(prompt);
        // Add Not Assigned Call Center (s)
        prompt = await promptObject.getPromptByName(PromptName3);
        await promptObject.shoppingCart.openValueListEditor(prompt, 1);
        await promptObject.shoppingCart.addSingle(prompt, true);
        await promptObject.shoppingCart.confirmValues(prompt);

        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(PromptName2);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC85326_04', 'Prompt summary');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The first element of Level 03 DESC attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Level 03 DESC' }))
            .toBe('Atlanta');
        await since('The first element of Region attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category DESC' }))
            .toBe('Movies');
    });
});

export const config = specConfiguration;
