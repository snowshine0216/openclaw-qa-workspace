import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';

const specConfiguration = { ...customCredentials('_urlapi') };

describe('Url API pass Prompt and Filter', () => {
    const dossier = {
        id: '346D328A401C7F7594CE4FB51EF04BF6',
        name: '(AUTO) URLAPI pass value prompt',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const targetDossierinLibrary = {
        id: 'CFE7FF374BF69B208D06448E45CE3FF8',
        name: '2 value prompt with default answer for pass filter',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;
    let prompt, textbox, cart, calendar;

    let {
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
        await dossierPage.goToLibrary();
    });

    it('[TC97704] Validate URL API pass Value prompt and filter in Library Web', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({chapterName: 'Chapter 1', pageName: 'filter+prompt'});

        //Pass Prompt and filter
        await dossierPage.clickTextfieldByTitle('Pass Prompt and filter');
        await dossierPage.switchToTab(1);
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
            .toBe('2015');
        await since(
            'The first element of Category should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Movies');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$35,106');
        
        //Validate filter
        await since('Dossier filter summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Category'))
            .toBe('(Movies, Music)');
        
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
            .toBe('343.7');
        await dossierPage.closeTab(1);
    });

    it('[TC97704_02] Validate URL API pass Value prompt and filter in Library Web - prompt not required', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({chapterName: 'Chapter 1', pageName: 'filter+prompt'});

        //Pass filter in prompt NOT required
        await dossierPage.clickTextfieldByTitle('Pass filter in prompt NOT required');
        await dossierPage.switchToTab(1);
        await promptEditor.waitForEditor();
        await since('Pass filter in prompt NOT required, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
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
            .toBe('Movies');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$93,912');
        
        //Validate filter
        await since('Dossier filter summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Category'))
            .toBe('(Movies, Music)');
        
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
            .expect(await promptEditor.checkEmptySummary('Text'))
            .toBe('No Selection');
        await since('Time prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkEmptySummary('Time'))
            .toBe('No Selection');
        await since('Big decimal prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Big decimal'))
            .toBe('343.7'); //has issue when dossier is in library
        await dossierPage.closeTab(1);
    });

    it('[TC97704_03] Validate URL API pass Value prompt and filter in Library Web - prompt required and discard current answer', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({chapterName: 'Chapter 1', pageName: 'filter+prompt'});

        //Pass filter in prompt required and discard current answer
        await dossierPage.clickTextfieldByTitle('Pass filter in prompt required and discard current answer');
        await dossierPage.switchToTab(1);
        await promptEditor.waitForEditor();
        await since('Pass filter prompt required and discard current answer, prompt editor present should be #{expected}, instead we have #{actual}')
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
            .toBe('2014');
        await since(
            'The first element of Category should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Books');
        await since(
            'The first element of Region should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('Web');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$30,483');
        
        //Validate filter
        await since('Dossier filter summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Country'))
            .toBe('(Web)');
        
        //Validate prompt
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Text');
        await since('Text prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Text'))
            .toBe('books');
        await dossierPage.closeTab(1);
    });

    it('[TC97704_04] Validate URL API pass Value prompt and filter in Library Web - prompt required and display prompt and use current answer', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({chapterName: 'Chapter 1', pageName: 'filter+prompt'});

        //Pass filter in prompt required and display prompt and use current answer
        await dossierPage.clickTextfieldByTitle('Pass filter in prompt required and display prompt and use current answer');
        await dossierPage.switchToTab(1);
        await promptEditor.waitForEditor();
        await since('Pass filter prompt required and discard current answer, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
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
            'The first element of Region should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('Web');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$30,483');
        
        //Validate filter
        await since('Dossier filter summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Country'))
            .toBe('(Web)');
        
        //Validate prompt
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Text');
        await since('Text prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Text'))
            .toBe('books');
        await dossierPage.closeTab(1);
    });

    it('[TC97704_05] Validate URL API pass Value prompt and filter in Library Web - prompt required not display prompt and use current answer', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({chapterName: 'Chapter 1', pageName: 'filter+prompt'});

        //Pass filter in prompt required and not display prompt and use current answer
        await dossierPage.clickTextfieldByTitle('Pass filter in prompt required not display prompt and use current answer');
        await dossierPage.switchToTab(1);
        await dossierPage.waitForDossierLoading();
        await since('Pass filter prompt required and discard current answer, prompt editor present should be #{expected}, instead we have #{actual}')
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
            'The first element of Region should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('Web');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$30,483');
        
        //Validate filter
        await since('Dossier filter summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Country'))
            .toBe('(Web)');
        
        //Validate prompt
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Text');
        await since('Text prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Text'))
            .toBe('books');
        await dossierPage.closeTab(1);
    });

    it('[TC97704_06] Validate URL API pass Value prompt and filter in Library Web - old filter format', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({chapterName: 'Chapter 1', pageName: 'issue case'});

        //Pass filter with prompt dialog
        await dossierPage.clickTextfieldByTitle('pass filter with prompt dialog');
        await dossierPage.switchToTab(1);
        await promptEditor.waitForEditor();
        await since('Pass Pass filter with prompt dialog, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('AddToLibrary is Present')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(true);
        await since(
            'The first element of Day should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Day' }))
            .toBe('11/2/2015');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$33,392');
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(3);
        
        //Validate filter
        await since('Dossier filter summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Day'))
            .toBe('(1/9/2015 - 11/3/2015)');
        
        //Validate prompt
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Day Value');
        await since('Day Value prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Day Value'))
            .toBe('11/1/2015');
        await dossierPage.closeTab(1);

        //Pass filter without prompt dialog
        const textList = [
            'pass filter without prompt dialog',
            'pass filter and prompt with default answer',
            'pass filter and prompt without default answer',
        ];
        for await (const text of textList) {
            console.log('Prompt setting ' + text);
            await dossierPage.hoverOnTextfieldByTitle(text);
            await dossierPage.clickTextfieldByTitle(text);
            await dossierPage.switchToTab(1);
            await dossierPage.waitForDossierLoading();
            await since('Pass Pass filter without prompt dialog, prompt editor present should be #{expected}, instead we have #{actual}')
                .expect(await promptEditor.isEditorOpen())
                .toBe(false);
            await since('AddToLibrary is Present')
                .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(true);
            await since(
                'The first element of Day should be #{expected} after apply Big Decimal, instead we have #{actual}'
            )
                .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Day' }))
                .toBe('11/2/2015');
            await since(
                'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
            )
                .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
                .toBe('$33,392');
            await since('The number of row should be #{expected}, instead we have #{actual}')
                .expect(await grid.getRowsCount('Visualization 1'))
                .toEqual(3);
            
            //Validate filter
            await since('Dossier filter summary should be #{expected}, while we got #{actual}')
                .expect(await filterSummary.filterItems('Day'))
                .toBe('(1/9/2015 - 11/3/2015)');
            
            //Validate prompt
            await promptEditor.reprompt();
            await promptEditor.toggleViewSummary();
            await promptEditor.waitForSummaryItem('Day Value');
            await since('Day Value prompt answer is supposed to be #{expected}, instead we get #{actual}')
                .expect(await promptEditor.checkTextSummary('Day Value'))
                .toBe('11/1/2015');
            await dossierPage.closeTab(1);
        }
    });

    it('[TC97704_07] Validate URL API pass Value prompt and filter in Library Web - dashboard in library with default answer', async () => {
        await libraryPage.openDossier(targetDossierinLibrary.name);
        await reset.selectReset();
        await reset.confirmReset();
        await promptEditor.waitForEditor();
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.goToLibrary();

        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({chapterName: 'Chapter 1', pageName: 'filter+prompt'});

        //Pass filter in prompt with default answer
        await dossierPage.clickTextfieldByTitle('Pass filter in prompt with default answer');
        await dossierPage.switchToTab(1);
        await dossierPage.waitForDossierLoading();
        await since('Pass filter, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since('AddToLibrary is Present')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(false);
        await since(
            'The first element of Year should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2015');
        await since(
            'The first element of Region should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('Northeast');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$10,129');
        
        //Validate filter
        await since('Dossier filter summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Region'))
            .toBe('(Northeast)');
        
        //Validate prompt
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Date');
        await since('Date prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkEmptySummary('Date'))
            .toEqual('No Selection');
        await since('Big decimal prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Big decimal'))
            .toBe('9999.9999'); 

        //change prompt
        await promptEditor.toggleViewSummary();
        prompt = await promptObject.getPromptByName('Date');
        await calendar.openCalendar(prompt);
        await calendar.clearAndInputYear(prompt, '2016');
        await calendar.openMonthDropDownMenu(prompt);
        await calendar.selectMonth(prompt, 'Jan');
        await calendar.selectDay(prompt, '1');
        prompt = await promptObject.getPromptByName('Big decimal');
        await textbox.clearAndInputText(prompt, '111.111');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since(
            'The first element of Year should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2016');
        await since(
            'The first element of Region should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('Northeast');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$205,307');
        await dossierPage.closeTab(1);

        //Pass filter in prompt with default answer again
        await dossierPage.hoverOnTextfieldByTitle('Pass filter in prompt with default answer');
        await dossierPage.clickTextfieldByTitle('Pass filter in prompt with default answer');
        await dossierPage.switchToTab(1);
        await dossierPage.waitForDossierLoading();
        await since('Dossier filter summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Region'))
            .toBe('(Northeast)');
        await since('Pass filter, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since(
            'The first element of Year should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2016');
        await since(
            'The first element of Region should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('Northeast');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$205,307');
        await reset.selectReset();
        await reset.confirmReset();
        await dossierPage.closeTab(1);

        //Pass filter in prompt with default answer again
        await dossierPage.hoverOnTextfieldByTitle('Pass filter in prompt with default answer');
        await dossierPage.clickTextfieldByTitle('Pass filter in prompt with default answer');
        await dossierPage.switchToTab(1);
        await dossierPage.waitForDossierLoading();
        await since('Dossier filter summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Region'))
            .toBe('(Northeast)');
        await since('Pass filter, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since(
            'The first element of Year should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2014');
        await since(
            'The first element of Region should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('Northeast');
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$129,566');
        
        //Validate prompt
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Date');
        await since('Date prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkEmptySummary('Date'))
            .toEqual('No Selection');
        await since('Big decimal prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkEmptySummary('Big decimal'))
            .toBe('No Selection'); // DE309800
    });

});

export const config = specConfiguration;
