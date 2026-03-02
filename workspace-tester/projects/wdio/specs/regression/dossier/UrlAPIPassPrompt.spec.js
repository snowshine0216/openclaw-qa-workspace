import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';

const specConfiguration = { ...customCredentials('_urlapi') };

describe('Url API pass Prompt', () => {
    const dossier = {
        id: '346D328A401C7F7594CE4FB51EF04BF6',
        name: '(AUTO) URLAPI pass value prompt',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const targetDossierinLibrary = {
        id: '4F5B719E449FD4F971742BB6255A037F',
        name: '2 value prompt with default answer',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;
    let prompt, textbox, cart, calendar;

    let {
        adminPage,
        loginPage,
        dossierPage,
        libraryPage,
        filterSummary,
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
        calendar = promptObject.calendar;
    });

    afterEach(async () => {
        await dossierPage.closeTab(2);
        await dossierPage.goToLibrary();
    });

    it('[TC96789] Validate URL API pass Value prompt in Library Web - Big Decimal, Date', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({chapterName: 'Chapter 1', pageName: 'prompt'});

        //Pass Big Decimal Prompt
        await dossierPage.clickTextfieldByTitle('Pass Big Decimal Prompt: cost greater than or equal to 999.99');
        await dossierPage.switchToTab(2);
        await dossierPage.waitForDossierLoading();
        await since('Pass Big Decimal Prompt, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since('AddToLibrary is Present')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(true);
        await since(
            'The first element of Category should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Electronics');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$703,593');
        
        //Validate prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName('Big decimal');
        await since('Prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await textbox.text(prompt))
            .toBe('999.99');
        await dossierPage.closeTab(2);

        //Pass date Prompt
        await dossierPage.waitForDossierLoading();
        await dossierPage.hoverOnTextfieldByTitle('Pass Date Prompt: date greater than 6/9/2015');
        await dossierPage.clickTextfieldByTitle('Pass Date Prompt: date greater than 6/9/2015');
        await dossierPage.switchToTab(2);
        await dossierPage.waitForDossierLoading();
        await since('Pass empty Prompt, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since('AddToLibrary is Present')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(true);
        await since(
            'The first element of Category should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$26,912');
        
        //Validate prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName('Big decimal');
        await since('Prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await textbox.text(prompt))
            .toBe('343.7');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Date');
        await since('Date prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Date'))
            .toBe('6/9/2015');
        await dossierPage.closeTab(2);

        //Pass empty Big Decimal Prompt
        await dossierPage.waitForDossierLoading();
        await dossierPage.hoverOnTextfieldByTitle('Pass Big Decimal Prompt: cost greater than or equal to empty');
        await dossierPage.clickTextfieldByTitle('Pass Big Decimal Prompt: cost greater than or equal to empty');
        await dossierPage.switchToTab(2);
        await dossierPage.waitForDossierLoading();
        await since('Pass empty Prompt, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since('AddToLibrary is Present')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(true);
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
        prompt = await promptObject.getPromptByName('Big decimal');
        await since('Prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await textbox.text(prompt))
            .toBe('');
    });


    it('[TC96789_02] Validate URL API pass Value prompt in Library Web - Time, Numeric, Text Prompt', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({chapterName: 'Chapter 1', pageName: 'prompt'});

        //Pass Time, Numeric, Text Prompt
        await dossierPage.clickTextfieldByTitle('Pass Time, Numeric, Text Prompt: 11/25/2015 08:30:59, 2015, south');
        await dossierPage.switchToTab(2);
        await dossierPage.waitForDossierLoading();
        await since('Pass Time, Numeric, Text Prompt, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since('AddToLibrary is Present')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(true);
        await since(
            'The first element of year should be #{expected} after apply Big Decimal, instead we have #{actual}'
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
            .toBe('$39,054');
        
        //Validate prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName('Big decimal');
        await since('Prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await textbox.text(prompt))
            .toBe('343.7');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Date');
        await since('Date prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkEmptySummary('Date'))
            .toEqual('No Selection');
        await since('Nubmer prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Number'))
            .toBe('2015');
        await since('Text prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Text'))
            .toBe('south');
        await since('Time prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Time'))
            .toBe('11/25/2015 8:30:59 AM');
    });

    it('[TC96789_03] Validate URL API pass Value prompt in Library Web - dynamic date', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({chapterName: 'Chapter 1', pageName: 'prompt'});

        //Pass value in default value is dynamic date
        await dossierPage.clickTextfieldByTitle('Pass value in default value is dynamic date');
        await dossierPage.switchToTab(2);
        await dossierPage.waitForDossierLoading();
        await since('Pass value in default value is dynamic date, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since('AddToLibrary is Present')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(true);
        await since(
            'The first element of day should be #{expected} after apply Big Decimal, instead we have #{actual}'
            )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Day' }))
            .toBe('12/31/2015');
        await since(
            'The first element of profit should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Profit' }))
            .toBe('$2,765');
        
        //Validate prompt
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Date');
        await since('Date prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Date'))
            .toBe('12/31/2015');
    });

    it('[TC96789_04] Validate URL API pass Value prompt in Library Web - dynamic value', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({chapterName: 'Chapter 1', pageName: 'prompt'});

        //Pass dynamic value from grid to number and big decimal
        await grid.clickGridElementLink({
            title: 'Visualization 1',
            headerName: 'Year(Link) pass 2 value',
            elementName: '2015',
        });
        await dossierPage.switchToTab(2);
        await dossierPage.waitForDossierLoading();
        await since('Pass dynamic value, prompt editor present should be #{expected}, instead we have #{actual}')
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
            'The first element of profit should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$406,194');
        await since(
            'The first element of Category should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Electronics');
        //Validate prompt
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Date');
        await since('Date prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkEmptySummary('Date'))
            .toEqual('No Selection');
        await since('Nubmer prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Number'))
            .toBe('2015');
        await since('Text prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkEmptySummary('Text'))
            .toBe('No Selection');
        await since('Time prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkEmptySummary('Time'))
            .toBe('No Selection');
        await since('Big decimal prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Big decimal'))
            .toBe('2015');
        await dossierPage.closeTab(2);

        //Pass dynamic value from grid to text and big decimal
        await grid.clickGridElementLink({
            title: 'Visualization 1',
            headerName: 'Region(Link)',
            elementName: 'Northeast',
        });
        await dossierPage.switchToTab(2);
        await dossierPage.waitForDossierLoading();
        await since('Pass dynamic value, prompt editor present should be #{expected}, instead we have #{actual}')
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
            'The first element of profit should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$89,585');
        await since(
            'The first element of Category should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');
        //Validate prompt
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Date');
        await since('Date prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkEmptySummary('Date'))
            .toEqual('No Selection');
        await since('Nubmer prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkEmptySummary('Number'))
            .toBe('No Selection');
        await since('Text prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Text'))
            .toBe('Northeast');
        await since('Time prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkEmptySummary('Time'))
            .toBe('No Selection');
        await since('Big decimal prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Big decimal'))
            .toBe('333.33333');
    });

    it('[TC96789_05] Validate URL API pass Value prompt in Library Web - dashboard in library without default answer', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: targetDossierinLibrary,
        });
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({chapterName: 'Chapter 1', pageName: 'prompt'});

        //Pass date prompt without default answer
        await dossierPage.clickTextfieldByTitle('Pass date prompt without default answer');
        await dossierPage.switchToTab(2);
        await dossierPage.waitForDossierLoading();
        await since('Pass date prompt without default answer, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since('AddToLibrary is Present')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(false);
        await since(
            'The first element of Category should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Electronics');
        await since(
            'The first element of Year should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2016');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$11,127');
        
        //Validate prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName('Big decimal');
        await since('Prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await textbox.text(prompt))
            .toBe('9999.9999');
        //Change default prompt answer
        await textbox.clearAndInputText(prompt, '99.99');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Date');
        await since('Date prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Date'))
            .toBe('1/1/2016');
        await since('Big decimal prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Big decimal'))
            .toBe('99.99');
        await promptEditor.run();
        await since(
            'The first element of Category should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');
        await since(
            'The first element of Year should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2016');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$120,222');
        await dossierPage.closeTab(2);

        //Pass date prompt without default answer again
        await dossierPage.hoverOnTextfieldByTitle('Pass date prompt without default answer');
        await dossierPage.clickTextfieldByTitle('Pass date prompt without default answer');
        await dossierPage.switchToTab(2);
        await dossierPage.waitForDossierLoading();
        await since('Pass Prompt, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since('AddToLibrary is Present')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(false);
        await since(
            'The first element of Category should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');
        await since(
            'The first element of Year should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2016');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$120,222');
        
        //Validate prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName('Big decimal');
        await since('Prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await textbox.text(prompt))
            .toBe('99.99');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Date');
        await since('Date prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Date'))
            .toBe('1/1/2016');
        await promptEditor.run();

        await reset.selectReset();
        await reset.confirmReset();
        await dossierPage.closeTab(2);

        //Pass date prompt without default answer again
        await dossierPage.hoverOnTextfieldByTitle('Pass date prompt without default answer');
        await dossierPage.clickTextfieldByTitle('Pass date prompt without default answer');
        await dossierPage.switchToTab(2);
        await dossierPage.waitForDossierLoading();
        await since('Pass Prompt, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since('AddToLibrary is Present')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(false);
        await since(
            'The first element of Category should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Electronics');
        await since(
            'The first element of Year should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2016');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$11,127');
        
        //Validate prompt
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Date');
        await since('Big decimal prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Big decimal'))
            .toBe('9999.9999');
        await since('Date prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Date'))
            .toBe('1/1/2016');
        
        //change default prompt answer
        await promptEditor.toggleViewSummary();
        prompt = await promptObject.getPromptByName('Big decimal');
        await textbox.clearAndInputText(prompt, '');
        await promptEditor.run();
        await dossierPage.closeTab(2);

        //Pass date prompt without default answer again
        await dossierPage.hoverOnTextfieldByTitle('Pass date prompt without default answer');
        await dossierPage.clickTextfieldByTitle('Pass date prompt without default answer');
        await dossierPage.switchToTab(2);
        await dossierPage.waitForDossierLoading();
        await since('Pass Prompt, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since('AddToLibrary is Present')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(false);
        await since(
            'The first element of Category should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');
        await since(
            'The first element of Year should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2016');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$120,945');
        
        //Validate prompt
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Date');
        await since('Big decimal prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkEmptySummary('Big decimal'))
            .toBe('No Selection');
        await since('Date prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Date'))
            .toBe('1/1/2016');
    });
    
    it('[TC96789_06] Validate URL API pass Value prompt in Library Web - dashboard in library with default answer', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: targetDossierinLibrary,
        });
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({chapterName: 'Chapter 1', pageName: 'prompt'});

        //Pass big decimal prompt with default answer
        await dossierPage.clickTextfieldByTitle('Pass big decimal prompt with default answer');
        await dossierPage.switchToTab(2);
        await dossierPage.waitForDossierLoading();
        await since('Pass big decimal prompt with default answer, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since('AddToLibrary is Present')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(false);
        await since(
            'The first element of Category should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');
        await since(
            'The first element of Year should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2014');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$72,424');
        
        //Validate prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName('Big decimal');
        await since('Prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await textbox.text(prompt))
            .toBe('111.111');
        //Change prompt answer
        await textbox.clearAndInputText(prompt, '99.99');
        prompt = await promptObject.getPromptByName('Date');
        await calendar.openCalendar(prompt);
        await calendar.clearAndInputYear(prompt, '2016');
        await calendar.openMonthDropDownMenu(prompt);
        await calendar.selectMonth(prompt, 'Jan');
        await calendar.selectDay(prompt, '1');

        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Date');
        await since('Date prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Date'))
            .toBe('1/1/2016');
        await since('Big decimal prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Big decimal'))
            .toBe('99.99');
        await promptEditor.run();
        await since(
            'The first element of Category should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');
        await since(
            'The first element of Year should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2016');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$120,222');
        await dossierPage.closeTab(2);

        //Pass big decimal prompt with default answer
        await dossierPage.hoverOnTextfieldByTitle('Pass big decimal prompt with default answer');
        await dossierPage.clickTextfieldByTitle('Pass big decimal prompt with default answer');
        await dossierPage.switchToTab(2);
        await dossierPage.waitForDossierLoading();
        await since('Pass Prompt, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since('AddToLibrary is Present')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(false);
        await since(
            'The first element of Category should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');
        await since(
            'The first element of Year should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2016');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$119,910');
        
        //Validate prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName('Big decimal');
        await since('Prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await textbox.text(prompt))
            .toBe('111.111');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Date');
        await since('Date prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Date'))
            .toBe('1/1/2016');
        await promptEditor.run();
        
        await reset.selectReset();
        await reset.confirmReset();
        await dossierPage.closeTab(2);
        //Pass big decimal prompt with default answer
        await dossierPage.hoverOnTextfieldByTitle('Pass big decimal prompt with default answer');
        await dossierPage.clickTextfieldByTitle('Pass big decimal prompt with default answer');
        await dossierPage.switchToTab(2);
        await dossierPage.waitForDossierLoading();
        await since('Pass Prompt, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since('AddToLibrary is Present')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(false);
        await since(
            'The first element of Category should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');
        await since(
            'The first element of Year should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2014');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$72,424');
        
        //Validate prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName('Big decimal');
        await since('Prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await textbox.text(prompt))
            .toBe('111.111');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Date');
        await since('Date prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkEmptySummary('Date'))
            .toBe('No Selection');
    });

    it('[TC97696] Validate URL API pass Value prompt in PIP in Library Web - 2 nested PIP', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({chapterName: 'Chapter 1', pageName: 'prompt in prompt'});

        //Pass value prompt in 2 nested PIP
        await dossierPage.clickTextfieldByTitle('Prompt in prompt - 2 nested');
        await dossierPage.switchToTab(2);
        await promptEditor.waitForEditor();
        await since('Pass value, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        
        prompt = await promptObject.getPromptByName('Subcategory');
        await cart.searchFor(prompt, 'Audio');
        await cart.addSingle(prompt);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('Prompt editor should be closed after clicking Run')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since(
            'Does the error dialog popup should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.isErrorPresent())
            .toBe(false);
        await since('AddToLibrary is Present')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(true);
        await since(
            'The first element of profit should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$2,785,361');
        await since(
            'The first element of Category should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Electronics');
        await since(
            'The first element of Subcategory should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Subcategory' }))
            .toBe('Audio Equipment');
        //Validate prompt
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Big decimal');
        await since('Big decimal prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Big decimal'))
            .toBe('2014');
        await since('Country prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkEmptySummary('Country'))
            .toEqual('No Selection');
        await promptEditor.run();
        await promptEditor.waitForEditor();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Subcategory');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Subcategory'))
            .toEqual('Audio Equipment');
    });

    it('[TC97696_02] Validate URL API pass Value prompt in PIP in Library Web - 2 nested PIP and filter', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({chapterName: 'Chapter 1', pageName: 'prompt in prompt'});

        //Pass value prompt in 2 nested PIP and filter
        await dossierPage.clickTextfieldByTitle('Prompt in prompt - 2 nested+filter: prompt choose 2014 and filter choose web');
        await dossierPage.switchToTab(2);
        await promptEditor.waitForEditor();
        await since('Pass value, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        
        prompt = await promptObject.getPromptByName('Subcategory');
        await cart.searchFor(prompt, 'Audio');
        await cart.addSingle(prompt);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('Prompt editor should be closed after clicking Run')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since(
            'Does the error dialog popup should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.isErrorPresent())
            .toBe(false);
        await since('AddToLibrary is Present')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(true);
        await since(
            'The first element of profit should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$364,303');
        await since(
            'The first element of Region should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Country' }))
            .toBe('Web');
        await since(
            'The first element of Subcategory should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Subcategory' }))
            .toBe('Audio Equipment');
        
        //Validate filter
        await since('Dossier filter summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Country'))
            .toBe('(Web)');

        //Validate prompt
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Big decimal');
        await since('Big decimal prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Big decimal'))
            .toBe('2014');
        await since('Country prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkEmptySummary('Country'))
            .toEqual('No Selection');
        await promptEditor.run();
        await promptEditor.waitForEditor();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Subcategory');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Subcategory'))
            .toEqual('Audio Equipment');
    });

    it('[TC97696_03] Validate URL API pass Value prompt in PIP in Library Web - 3 nested PIP', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({chapterName: 'Chapter 1', pageName: 'prompt in prompt'});

        //Pass value prompt in 2 nested PIP and filter
        await dossierPage.clickTextfieldByTitle('Prompt in prompt - 3 nested');
        await dossierPage.switchToTab(2);
        await promptEditor.waitForEditor();
        await since('Pass value, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        
        prompt = await promptObject.getPromptByName('Subcategory');
        await cart.searchFor(prompt, 'Audio');
        await cart.addSingle(prompt);
        await promptEditor.run();
        await promptEditor.waitForEditor();
        await since('Prompt editor should be open after clicking Run')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        prompt = await promptObject.getPromptByName('Item');
        await cart.addSingle(prompt);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();

        await since(
            'Does the error dialog popup should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.isErrorPresent())
            .toBe(false);
        await since('AddToLibrary is Present')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(true);
        await since(
            'The first element of Year should be #{expected} after apply Big Decimal, instead we have #{actual}'
            )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2014');
        await since(
            'The first element of profit should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$1,625');
        await since(
            'The first element of Region should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('Mid-Atlantic');
        await since(
            'The first element of Category should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Electronics');

        //Validate prompt
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Big decimal');
        await since('Big decimal prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Big decimal'))
            .toBe('929.99');
        await since('Number prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Number'))
            .toBe('2015');
        await since('Country prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkEmptySummary('Country'))
            .toEqual('No Selection');
        await promptEditor.run();
        await promptEditor.waitForEditor();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Subcategory');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Subcategory'))
            .toEqual('Audio Equipment');
        await promptEditor.run();
        await promptEditor.waitForEditor();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Item');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Item'))
            .toEqual('Harman Kardon Digital Surround Sound Receiver');
    });

});

export const config = specConfiguration;
