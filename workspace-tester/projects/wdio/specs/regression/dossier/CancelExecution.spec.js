import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { mockNetworkThrottling, restoreRequestSpeedMocks } from '../../../api/mock/mock-network-throttle.js';

const specConfiguration = { ...customCredentials('_cancel') };

describe('CancelExecution', () => {
    const dossier = {
        id: '8CDF3DFF4034D57B004D27B11037DA9D',
        name: 'Bookmark',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const dossierWithPrompt = {
        id: '77BA7DED4AF3F7C775087692281EAE19',
        name: 'VI with Multiple Prompts',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossierWithPIP = {
        id: 'E324288A47634D16CBD267B1F20808D6',
        name: 'VI with Prompt in Prompt Prompt',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossierWithFilter = {
        id: 'FB1D8F9C47C57231E3FAD487598176DB',
        name: '(Auto) GDDE Limit',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document = {
        id: 'A85A782F49A2DF897B37D6A3850BD488',
        name: 'RWD',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const promptName = 'Category';
    const objectPromptName = 'Objects';
    const subcategoryPromptName = 'Subcategory';
    let {
        loginPage,
        toc,
        checkboxFilter,
        libraryPage,
        dossierPage,
        filterPanel,
        promptEditor,
        promptObject,
        filterSummaryBar,
    } = browsers.pageObj1;
    let cart = promptObject.shoppingCart;
    const mockedNetwork = 'Regular3G';
    const { credentials } = specConfiguration;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
        await restoreRequestSpeedMocks();
    });

    it('[TC56654_01] CancelExecution -- WithoutPrompt', async () => {
        // mock network throttling
        await mockNetworkThrottling(mockedNetwork);

        // cancel execution without prompt
        await libraryPage.openDossierNoWait(dossier.name);
        await dossierPage.clickCancelExecutionButton();
        since(
            'User should be redirected to library page after cancel execution when apply bookmark should be #{expected}, instead we have #{actual}'
        ).expect(await libraryPage.title()).toBe('Library');

        // // cancel RWD
        // await libraryPage.openDossierNoWait(document.name);
        // since('Cancel execution button for RWD should be #{expected}, instead we have #{actual}')
        //     .expect(await dossierPage.isCancelButtonDisplayed()).toBe(false);
    });
    
    it('[TC56654_02] CancelExecution -- WithPrompt', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossierWithPrompt,
        });
        await libraryPage.openDossierNoWait(dossierWithPrompt.name);
        await promptEditor.waitForEditor();

        // change prompt value and cancel
        await mockNetworkThrottling('GPRS');
        let prompt = await promptObject.getPromptByName(promptName);
        await cart.clickElmInAvailableList(prompt, 'Music');
        await cart.addSingle(prompt);


        await promptEditor.runNoWait();
        await promptEditor.cancelResolvePrompt();

        // check prompt value after cancel
        await promptEditor.toggleViewSummary();
        since('MQ prompt answer should be #{expected} but is #{actual}')
            .expect(await promptEditor.checkListSummary('Category')).toEqual('Books, Music');
        
        await promptEditor.runWithWaitForCancel();
        await dossierPage.clickCancelExecutionButtonInCurrentPage();
        since(
            'User should be redirected to library page after cancel execution when apply bookmark should be #{expected}, instead we have #{actual}'
        ).expect(await libraryPage.title()).toBe('Library');

    })

    it('[TC56654_03] CancelExecution -- WithPIP', async () => {
        // check PIP prompt
        await resetDossierState({
            credentials: credentials,
            dossier: dossierWithPIP,
        });
        await libraryPage.openDossierNoWait(dossierWithPIP.name);

        // cancel the first level prompt
        await promptEditor.waitForEditor(); 
        await mockNetworkThrottling('GPRS');
        await promptEditor.runNoWait();
        await promptEditor.cancelResolvePrompt(); 
        // check prompt value after cancel
        await promptEditor.toggleViewSummary();
        since('Object prompt answer should be #{expected} but is #{actual}')
            .expect(await promptEditor.checkListSummary(objectPromptName)).toEqual('Prompt-in-prompt Filter');

        // cancel the second level prompt
        await promptEditor.runWithPIP();
        await promptObject.waitForPromptDetail(promptName);
        let prompt = await promptObject.getPromptByName(promptName);
        await cart.clickElmInSelectedList(prompt, 'Music');
        await cart.removeSingle(prompt);

        //mock network throttling and run prompt again
        await mockNetworkThrottling('GPRS');
        await promptEditor.runNoWait();
        await promptEditor.cancelResolvePrompt();   
        // check prompt value after cancel
        await promptEditor.toggleViewSummary();
        since('Object prompt answer should be #{expected} but is #{actual}')
            .expect(await promptEditor.checkListSummary(objectPromptName)).toEqual('Prompt-in-prompt Filter');

        // cancel the third level prompt
        await promptEditor.runWithPIP();
        await promptObject.waitForPromptDetail(promptName);
        await promptEditor.runWithPIP();
        await promptObject.waitForPromptDetail(subcategoryPromptName);
        let subcategoryPrompt = await promptObject.getPromptByName(subcategoryPromptName);
        await cart.clickElmInAvailableList(subcategoryPrompt, 'Business');
        await cart.addSingle(subcategoryPrompt);

        await promptEditor.runNoWait();
        await promptEditor.cancelResolvePrompt();
        // check prompt value after cancel
        await promptEditor.toggleViewSummary();
        since('Subcategory prompt answer should be #{expected} but is #{actual}')
            .expect(await promptEditor.checkListSummary(objectPromptName)).toEqual('Prompt-in-prompt Filter');

        // run the dashboard
        await promptEditor.runWithPIP();
        await promptObject.waitForPromptDetail(promptName);
        await promptEditor.runWithPIP();
        await promptObject.waitForPromptDetail(subcategoryPromptName);
        await promptEditor.runWithWaitForCancel();
        await dossierPage.clickCancelExecutionButtonInCurrentPage();
        since(
            'User should be redirected to library page after cancel execution when apply bookmark should be #{expected}, instead we have #{actual}'
        ).expect(await libraryPage.title()).toBe('Library');
    });

    it('[TC56654_04] CancelExecution -- Filter', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossierWithFilter,
        });
        await libraryPage.openDossier(dossierWithFilter.name);

        // do some filter operations
        await toc.openPageFromTocMenu({ chapterName: 'Searchbox-multi select' });
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Status');
        await checkboxFilter.selectElementsByNames(['New', 'Lost New']);

        // mock network throttling and apply filter
        await mockNetworkThrottling('GPRS');
        await filterPanel.applyWithoutWaiting(false);

        // cancel execution
        await dossierPage.clickCancelExecutionButtonInCurrentPage();
        since ('Filter summary should be #{expected}, instead it is #{actual}')
            .expect(await filterSummaryBar.filterItems('Status')).toBe('(Active)')
        await dossierPage.goToLibrary();
    })
});
export const config = specConfiguration;
