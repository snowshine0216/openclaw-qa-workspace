import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';

const specConfiguration = { ...customCredentials('_urlapi') };

describe('Url API pass Prompt XFun', () => {
    const dossier = {
        id: '346D328A401C7F7594CE4FB51EF04BF6',
        name: '(AUTO) URLAPI pass value prompt',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const parameterDossier = {
        id: 'F924F1FE42465D85FC8DCE8D68A5160E',
        name: '(Auto) UrlAPI pass Parameter',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;
    let prompt, textbox, cart;

    let {
        loginPage,
        dossierPage,
        libraryPage,
        adminPage,
        filterSummaryBar,
        filterPanel,
        checkboxFilter,
        infoWindow,
        promptEditor,
        promptObject,
        grid,
        inCanvasSelector,
        reset,
        toc,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await adminPage.openAdminPage();
        await adminPage.chooseTab('Library Server');
        await adminPage.inputMicroStrategyWebLink('');
        await adminPage.clickSaveButton();
        await adminPage.clickLaunchButton();
        await adminPage.switchToTab(1);
        await loginPage.login(credentials);
        await setWindowSize({
            width: 1000,
            height: 800,
        });
        textbox = promptObject.textbox;
        cart = promptObject.shoppingCart;
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC97705] Validate URL API pass Value prompt with different setting in Library Web', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({chapterName: 'Chapter 1', pageName: 'prompt setting'});

        //Pass Prompt: books
        const textList = [
            'prompt required',
            'display prompt and discard current answer',
            'not display prompt and use current answer',
        ];
        for await (const text of textList) {
            console.log('Prompt setting ' + text);
            await dossierPage.hoverOnTextfieldByTitle(text);
            await dossierPage.clickTextfieldByTitle(text);
            await dossierPage.switchToTab(2);
            await dossierPage.waitForDossierLoading();
            await since('Pass number Prompt, prompt editor present should be #{expected}, instead we have #{actual}')
                .expect(await promptEditor.isEditorOpen())
                .toBe(false);
            await since('AddToLibrary is Present')
                .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(true);
            await since(
                'The first element of Year should be #{expected} after apply Big Decimal, instead we have #{actual}'
            )
                .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
                .toBe('2014');
            await since(
                'The first element of Category should be #{expected} after apply Big Decimal, instead we have #{actual}'
            )
                .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
                .toBe('Books');
            await since(
                'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
            )
                .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
                .toBe('$77,012');
            
            //Validate prompt
            await promptEditor.reprompt();
            await promptEditor.toggleViewSummary();
            await promptEditor.waitForSummaryItem('Text');
            await since('Text prompt answer is supposed to be #{expected}, instead we get #{actual}')
                .expect(await promptEditor.checkTextSummary('Text'))
                .toBe('books');
            await dossierPage.closeTab(2);
        }
    });

    it('[TC97705_02] Validate URL API pass Value prompt with different setting in Library Web - value prompt required', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({chapterName: 'Chapter 1', pageName: 'prompt setting'});

        //Pass not required Prompt
        await dossierPage.clickTextfieldByTitle('choose not required prompt');
        await dossierPage.switchToTab(2);
        await promptEditor.waitForEditor();
        await since('Pass not required Prompt, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        prompt = await promptObject.getPromptByName('Text');
        await textbox.clearAndInputText(prompt, 'books');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('AddToLibrary is Present')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(true);
        await since(
            'The first element of Year should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2015');
        await since(
            'The first element of Category should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$97,277');
        
        //Validate prompt
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Text');
        await since('Text prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Text'))
            .toBe('books');
        await since('Number prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Number'))
            .toBe('2015');
        await dossierPage.closeTab(2);

        //Pass required and not required Prompt
        await dossierPage.hoverOnTextfieldByTitle('choose required and not required prompt');
        await dossierPage.clickTextfieldByTitle('choose required and not required prompt');
        await dossierPage.switchToTab(2);
        await dossierPage.waitForDossierLoading();
        await since('Pass not required Prompt, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since('AddToLibrary is Present')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(true);
        await since(
            'The first element of Year should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2015');
        await since(
            'The first element of Category should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$97,277');
        
        //Validate prompt
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Text');
        await since('Text prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Text'))
            .toBe('books');
        await since('Number prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Number'))
            .toBe('2015');
        await dossierPage.closeTab(2);

    });

    it('[TC97705_03] Validate URL API pass Value prompt with different setting in Library Web - AE prompt required', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({chapterName: 'Chapter 1', pageName: 'prompt setting'});

        //Pass value when AE required
        await dossierPage.clickTextfieldByTitle('AE required');
        await dossierPage.switchToTab(2);
        await promptEditor.waitForEditor();
        await since('Pass value when AE required, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        prompt = await promptObject.getPromptByName('Country');
        await cart.searchFor(prompt, 'Web');
        await cart.addSingle(prompt);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('AddToLibrary is Present')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(true);
        await since(
            'The first element of Year should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2015');
        await since(
            'The first element of Country should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Country' }))
            .toBe('Web');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$62,411');
        
        //Validate prompt
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Country');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Country'))
            .toEqual('Web');
        await since('Number prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Number'))
            .toBe('2015');
        await dossierPage.closeTab(2);

        //Pass value when AE not required
        await dossierPage.hoverOnTextfieldByTitle('AE not required');
        await dossierPage.clickTextfieldByTitle('AE not required');
        await dossierPage.switchToTab(2);
        await dossierPage.waitForDossierLoading();
        await since('Pass value when AE not required, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since('AddToLibrary is Present')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(true);
        await since(
            'The first element of Year should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2015');
        await since(
            'The first element of Category should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$97,277');
        
        //Validate prompt
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Country');
        await since('Text prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkEmptySummary('Country'))
            .toBe('No Selection');
        await since('Number prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Number'))
            .toBe('2015');
        await dossierPage.closeTab(2);

        //Pass value when AE required with default answer
        await dossierPage.hoverOnTextfieldByTitle('AE required with default answer');
        await dossierPage.clickTextfieldByTitle('AE required with default answer');
        await dossierPage.switchToTab(2);
        await dossierPage.waitForDossierLoading();
        await since('Pass value when AE required with default answer, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since('AddToLibrary is Present')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(true);
        await since(
            'The first element of Year should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2015');
        await since(
            'The first element of Category should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$97,277');

        //Validate prompt
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Country');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Country'))
            .toEqual('USA');
        await since('Number prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Number'))
            .toBe('2015');
        await dossierPage.closeTab(2);
    });

});

export const config = specConfiguration;
