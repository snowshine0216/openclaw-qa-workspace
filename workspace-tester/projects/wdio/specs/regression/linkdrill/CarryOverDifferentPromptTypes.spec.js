import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';

const specConfiguration = { ...customCredentials('_LD') };

describe('CarryOverDifferentPromptTypes', () => {
    // CarryOverPromptAnswer/Source_Document Value+Element
    const rsd1 = {
        id: 'C2AB55914AEA8298DDA90C8F37FCDDCC',
        name: 'Source_Document Value+Element',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    // CarryOverPromptAnswer/Source_Document Value+Element
    const rsd2 = {
        id: '384C88FD43B967F581D54C81B2A3B864',
        name: 'Source_Document With Attribute Qualification Year',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    // CarryOverPromptAnswer/Source_Document With Attribute Qualification Year
    const rsd3 = {
        id: '010AC4704D2C6B76AC0395862C7AA8D3',
        name: 'Source_Document with Long Name Hierarchy',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    // CarryOverPromptAnswer/Source_Document With Metric Qualification Cost-Required-NoDefaultAnswer
    const rsd4 = {
        id: '3F046F0F46992987E0710487BC2DD848',
        name: 'Source_Document With Metric Qualification Cost-Required-NoDefaultAnswer',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    // CarryOverPromptAnswer/Source_RWD with Multiple Prompts
    const rsd5 = {
        id: '0E2C2E674774AD03A034CB81697BB009',
        name: 'Source_RWD with Multiple Prompts',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const documentWithObjectPrompt = {
        id: '6E1C9EDD4D8EEE47CE9747BDDEF3A36A',
        name: 'Source_Document with Multi Object Prompts',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;

    let cart;

    let { loginPage, dossierPage, libraryPage, promptEditor, reportGrid, rsdGrid, promptObject } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        cart = promptObject.shoppingCart;
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC66649] validate carry over prompt in prompt on Library RSD', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: rsd1,
        });

        //check same from source mode for carry over prompt in prompt
        await libraryPage.openDossier(rsd1.name);
        await promptEditor.run();
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickBtnByTitle('same from source');
        //await promptEditor.waitForEditor();
        let prompt_CallCenter = await promptObject.getPromptByName('Call Center');
        await cart.addSingle(prompt_CallCenter);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The carryover of Region value should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkTextSummary('Region Value'))
            .toEqual('1');
        await promptEditor.cancelEditor();
        await dossierPage.goToLibrary();

        await resetDossierState({
            credentials: credentials,
            dossier: rsd1,
        });

        //check prompt user mode for carry over prompt in prompt
        await libraryPage.openDossier(rsd1.name);
        await promptEditor.run();
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickBtnByTitle('prompt user');
        await promptEditor.waitForPromptLoading();
        await promptEditor.toggleViewSummary();
        since('The carryover of Region value should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkTextSummary('Region Value'))
            .toEqual('5');
        await promptEditor.run();
        await promptEditor.toggleViewSummary();
        since('The carryover value of Call Center should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Call Center'))
            .toEqual('San Diego, Berlin, San Francisco');
        await promptEditor.cancelEditor();
        await dossierPage.goToLibrary();

        await resetDossierState({
            credentials: credentials,
            dossier: rsd1,
        });

        //check empty mode for carry over prompt in prompt
        await libraryPage.openDossier(rsd1.name);
        await promptEditor.run();
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickBtnByTitle('empty');
        await promptEditor.waitForPromptLoading();
        await promptEditor.toggleViewSummary();
        since('The carryover value of Call Center should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Call Center'))
            .toEqual('San Diego, Berlin, San Francisco');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The carryover of Region value should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkTextSummary('Region Value'))
            .toEqual('1');
        await promptEditor.cancelEditor();
        await dossierPage.goToLibrary();

        await resetDossierState({
            credentials: credentials,
            dossier: rsd1,
        });

        //check defalt mode for carry over prompt in prompt
        await libraryPage.openDossier(rsd1.name);
        await promptEditor.run();
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickBtnByTitle('default');
        await promptEditor.waitForPromptLoading();
        await promptEditor.toggleViewSummary();
        since('The carryover value of Call Center should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Call Center'))
            .toEqual('San Diego, Berlin, San Francisco');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The carryover of Region value should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkTextSummary('Region Value'))
            .toEqual('5');
        await promptEditor.cancelEditor();
    });

    it('[TC66650] validate carry over AQ prompt on Library RSD', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: rsd2,
        });

        //check the same from source mode for carry over AQ prompt
        await libraryPage.openDossier(rsd2.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('The same from source');
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        // when run the spec entirely, the equals would be equal to.
        since('The carryover of Year value should be  #{expected}, instead we have #{actual} ')
            .expect(await promptEditor.checkMultiQualSummary('Year'))
            .toEqual('YearID Equals2014');
        await promptEditor.cancelEditor();
        await dossierPage.goToLibrary();

        await resetDossierState({
            credentials: credentials,
            dossier: rsd2,
        });

        // check default mode for carry over AQ prompt
        await libraryPage.openDossier(rsd2.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('Default');
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The carryover of Year value should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkMultiQualSummary('Year'))
            .toEqual('YearIn List2014, 2015, 2016');
        await promptEditor.cancelEditor();
        await dossierPage.goToLibrary();

        await resetDossierState({
            credentials: credentials,
            dossier: rsd2,
        });

        //check empty mode for carry over AQ prompt
        await libraryPage.openDossier(rsd2.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('Empty');
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The carryover of Year value should be  #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkEmptySummary('Year'))
            .toEqual('No Selection');
        await promptEditor.cancelEditor();
        await dossierPage.goToLibrary();

        await resetDossierState({
            credentials: credentials,
            dossier: rsd2,
        });

        //check prompt user for carry over AQ prompt
        await libraryPage.openDossier(rsd2.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await grid.clickCell('2014');
        await dossierPage.waitForDossierLoading();
        await promptEditor.toggleViewSummary();
        since('The carryover of Year value should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkMultiQualSummary('Year'))
            .toEqual('YearID Equals2014');
        await promptEditor.cancelEditor();
    });

    it('[TC66651] validate carry over Hierarchy prompt on Library RSD', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: rsd3,
        });

        //check the same from source mode for Hierarchy prompt
        await libraryPage.openDossier(rsd3.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('The same from source');
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The carryover of Hierarchies should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkMultiQualSummary('Hierarchies'))
            .toEqual('QuarterIn List2014 Q1');
        await promptEditor.cancelEditor();
        await dossierPage.goToLibrary();

        await resetDossierState({
            credentials: credentials,
            dossier: rsd3,
        });

        //check empty mode for carry over Hierarchy prompt
        await libraryPage.openDossier(rsd3.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickBtnByTitle('Empty Answer');
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The carryover of Hierarchies should be  #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkEmptySummary('Hierarchies'))
            .toEqual('No Selection');
        await promptEditor.cancelEditor();
        await dossierPage.goToLibrary();

        await resetDossierState({
            credentials: credentials,
            dossier: rsd3,
        });

        //check prompt user mode for carry over Hierarchy prompt
        await libraryPage.openDossier(rsd3.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickBtnByTitle('Prompt User');
        await dossierPage.waitForDossierLoading();
        await promptEditor.toggleViewSummary();
        since('The carryover of Hierarchies should be  #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkMultiQualSummary('Hierarchies'))
            .toEqual('YearIn List2015, 2016');
        await promptEditor.cancelEditor();
        await dossierPage.goToLibrary();

        await resetDossierState({
            credentials: credentials,
            dossier: rsd3,
        });

        //check default mode for carry over Hierarchy prompt
        await libraryPage.openDossier(rsd3.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickImageLinkByTitle('Hyperlink1');
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The carryover of Hierarchies should be  #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkMultiQualSummary('Hierarchies'))
            .toEqual('YearIn List2015, 2016');
        await promptEditor.cancelEditor();
        await dossierPage.goToLibrary();

        await resetDossierState({
            credentials: credentials,
            dossier: rsd3,
        });

        //check current unit mode for carry over Hierarchy prompt
        await libraryPage.openDossier(rsd3.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        let grid = rsdGrid.getRsdGridByKey('K44');
        await grid.clickCell('2014');
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The carryover of Hierarchies should be  #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkMultiQualSummary('Hierarchies'))
            .toEqual('YearIn List2014');
        await promptEditor.cancelEditor();
        await dossierPage.goToLibrary();

        await resetDossierState({
            credentials: credentials,
            dossier: rsd3,
        });

        //check all units mode for carry over Hierarchy prompt
        await libraryPage.openDossier(rsd3.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        grid = rsdGrid.getRsdGridByKey('K44');
        await grid.clickCell('Books');
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The carryover of Hierarchies should be  #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkMultiQualSummary('Hierarchies'))
            .toEqual('CategoryIn ListBooks\nAND\nYearIn List2014');
        await promptEditor.cancelEditor();
        await dossierPage.goToLibrary();
    });

    it('[TC66652] validate carry over MQ prompt on Library RSD', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: rsd4,
        });

        //check default mode for carry over MQ prompt
        await libraryPage.openDossier(rsd4.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await grid.clickCell('2014');
        await dossierPage.waitForDossierLoading();
        await promptEditor.toggleViewSummary();
        since('The carryover of MQ Prompt should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkEmptySummary('Cost'))
            .toEqual('No Selection');
        await promptEditor.cancelEditor();
        await dossierPage.goToLibrary();

        await resetDossierState({
            credentials: credentials,
            dossier: rsd4,
        });

        //check empty mode for carry over MQ prompt
        await libraryPage.openDossier(rsd4.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('Same from source');
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The carryover of MQ Prompt should be  #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkMultiQualSummary('Cost'))
            .toEqual('CostGreater than1000000at levelDefault');
        await promptEditor.cancelEditor();
        await dossierPage.goToLibrary();

        await resetDossierState({
            credentials: credentials,
            dossier: rsd4,
        });

        // check the same from source mode for carry over MQ prompt
        await libraryPage.openDossier(rsd4.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickBtnByTitle('Default');
        await dossierPage.waitForDossierLoading();
        await promptEditor.toggleViewSummary();
        since('The carryover of MQ Prompt should be  #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkEmptySummary('Cost'))
            .toEqual('No Selection');
        await promptEditor.cancelEditor();
        await dossierPage.goToLibrary();

        await resetDossierState({
            credentials: credentials,
            dossier: rsd4,
        });

        //check prompt user mode for carry over MQ prompt
        await libraryPage.openDossier(rsd4.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickImageLinkByTitle('Hyperlink1');
        await dossierPage.waitForDossierLoading();
        await promptEditor.toggleViewSummary();
        since('The carryover of MQ Prompt should be  #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkEmptySummary('Cost'))
            .toEqual('No Selection');
        await promptEditor.cancelEditor();
    });

    it('[TC79754] validate carry over object prompt on Library RSD', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: documentWithObjectPrompt,
        });

        // check the same from source mode for carry over AQ prompt
        await libraryPage.openDossier(documentWithObjectPrompt.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();

        await dossierPage.clickTextfieldByTitle('The same from source');
        await reportGrid.waitForGridRendring();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The same from source carryover of Object Prompt should be  #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Objects'))
            .toEqual('Year, Month');
        await promptEditor.cancelEditor();

        // check empty mode for carry over AQ prompt
        await dossierPage.goBackFromDossierLink();
        await dossierPage.clickTextfieldByTitle('Empty');
        await reportGrid.waitForGridRendring();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The empty carryover of Object Prompt should be  #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkEmptySummary('Objects'))
            .toEqual('No Selection');
        await promptEditor.cancelEditor();

        // check prompt user for carry over AQ prompt
        await dossierPage.goBackFromDossierLink();
        await dossierPage.clickTextfieldByTitle('Prompt User');
        await promptEditor.toggleViewSummary();
        since('The prompt user carryover of Object Prompt should be  #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Objects'))
            .toEqual('Year');
        await promptEditor.cancelEditor();

        // check default mode for carry over AQ prompt
        const sourceGrid = rsdGrid.getRsdGridByKey('K44');
        await rsdGrid.waitForGridLoaded();
        await rsdGrid.clickCell('USA');
        await reportGrid.waitForGridRendring();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The default carryover of Object Prompt should be  #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Objects'))
            .toEqual('Year');
        await promptEditor.cancelEditor();
    });

    it('[TC66653] validate carry over Value prompt on Library RSD', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: rsd5,
        });

        await libraryPage.openDossier(rsd5.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await grid.clickCell('South');
        await dossierPage.waitForDossierLoading();
        const prompt = await promptObject.getPromptByName('Subcategory');
        const checkbox = promptObject.checkBox;
        await checkbox.clickCheckboxByName(prompt, 'Business');
        await promptEditor.run();
        await reportGrid.waitForGridRendring();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The carryover of Date should be  #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkTextSummary('Date'))
            .toEqual('4/14/2016');
        since('The carryover of Text should be  #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkTextSummary('Text'))
            .toEqual('South');
        since('The carryover of Subcategory should be  #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Subcategory'))
            .toEqual('Business');
        since('The carryover of Number should be  #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkTextSummary('Number'))
            .toEqual('1.5');
        await promptEditor.cancelEditor();
    });
});

export const config = specConfiguration;
