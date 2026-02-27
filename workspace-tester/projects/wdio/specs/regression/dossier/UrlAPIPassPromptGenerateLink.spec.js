import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';

const specConfiguration = { ...customCredentials('_urlapi') };

describe('Url API pass Prompt Generate Link', () => {
    const pip = {
        id: '9E1335184EF67EDB41CAF4BF49806DE6',
        name: '(AUTO) prompt in prompt - 2 nested - not display prompt',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const pipinLibrary = {
        id: '34AD9AD0454D8467A52B03B0CF21B076',
        name: '(AUTO) prompt in prompt - 2 nested - not display prompt add to library',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const multiValue = {
        id: 'C2021C2649EFF70C5AD815A7E8D57E80',
        name: '(AUTO) 5 value + 1 AE',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const noValue = {
        id: 'C17174134766EDEBEDFF16ABEB77FA0F',
        name: 'URL API Dossier-with prompt need answer',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const AEWithAllStyle = {
        id: 'DF7503764288F69BA1CF36A888709C17',
        name: 'AE with all style',
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
        toolbar,
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
            width: 1600,
            height: 1200,
        });
        textbox = promptObject.textbox;
        cart = promptObject.shoppingCart;
        calendar = promptObject.calendar;
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC97814] Validate generate URL API pass Value prompt link Library Web - PIP with not display prompt', async () => {
        await libraryPage.editDossierByUrl({
            projectId: pip.project.id,
            dossierId: pip.id,
        });

        await since('Open PIP with not display prompt, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);

        await toolbar.clickURLGeneratorButton();
        await since('Select value prompt button should be #{expected}, instead we have #{actual}')
            .expect(await toolbar.isSelectValuePromptButtonDisplay())
            .toBe(true);
        await toolbar.clickSelectValuePromptButton();
        await promptEditor.waitForEditorSelectableMode();
        await promptEditor.selectPromptItems(['Big decimal','Country']);
        await promptEditor.clickSelectButton();
        await since('Generator Bar Text should be #{expected}, while we got #{actual}')
            .expect(await toolbar.generatorBarText())
            .toBe('Choose filters, selectors and/or\nselect value prompt\nto generate embedding URL\n1 prompt selected\nGenerate Link');
        await toolbar.clickGenerateLinkButton();
        await since('Clipboard Text should be #{expected}, while we got #{actual}')
            .expect(await dossierPage.getClipboardText())
            .toContain('prompts=%5B%5B%7B%22key%22%3A%2294EADED142FEFAC3C8581FB64E73FF0D%400%4010%22%2C%22values%22%3A%5B%5D%2C%22useDefault%22%3Afalse%7D%5D%5D');
        await toolbar.clickCloseURLGeneratorDialogButton();

        //Change prompt
        await toolbar.clickButtonFromToolbar('Re-prompt');
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName('Big decimal');
        await textbox.clearAndInputText(prompt, '99.99');
        prompt = await promptObject.getPromptByName('Country');
        await cart.addSingle(prompt);
        await promptEditor.run();
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName('Subcategory');
        await cart.addSingle(prompt);
        await promptEditor.run();
        await toolbar.clickURLGeneratorButton();
        await toolbar.clickSelectValuePromptButton();
        await promptEditor.waitForEditorSelectableMode();
        await promptEditor.selectPromptItems(['Big decimal','Country']);
        await takeScreenshotByElement(promptEditor.getPromprtEditorSelectableMode(), 'TC97814', 'select vale prompt', {
            tolerance: 0.1,
        });
        await promptEditor.clickSelectButton();
        await since('Generator Bar Text should be #{expected}, while we got #{actual}')
            .expect(await toolbar.generatorBarText())
            .toBe('Choose filters, selectors and/or\nselect value prompt\nto generate embedding URL\n1 prompt selected\nGenerate Link');
        await toolbar.clickGenerateLinkButton();
        const url =  await dossierPage.getClipboardText();
        await since('Clipboard Text should be #{expected}, while we got #{actual}')
            .expect(url)
            .toContain('prompts=%5B%5B%7B%22key%22%3A%2294EADED142FEFAC3C8581FB64E73FF0D%400%4010%22%2C%22values%22%3A%5B%2299.99%22%5D%2C%22useDefault%22%3Afalse%7D%5D%5D');
        //check selected status
        await toolbar.clickSelectValuePromptButton();
        await promptEditor.waitForEditorSelectableMode();
        await takeScreenshotByElement(promptEditor.getPromprtEditorSelectableMode(), 'TC97814_02', 'keep selected status', {
            tolerance: 0.1,
        });
        //unselect
        await promptEditor.selectPromptItems(['Big decimal','Country']);
        await takeScreenshotByElement(promptEditor.getPromprtEditorSelectableMode(), 'TC97814_03', 'unselected status', {
            tolerance: 0.1,
        });
        await promptEditor.clickSelectButton();
        await since('Generator Bar Text should be #{expected}, while we got #{actual}')
            .expect(await toolbar.generatorBarText())
            .toBe('Choose filters, selectors and/or\nselect value prompt\nto generate embedding URL\nGenerate Link');
        await toolbar.clickGenerateLinkButton();
        const noPromptUrl = await dossierPage.getClipboardText();
        await since('Clipboard Text include prompts should be #{expected}, while we got #{actual}')
            .expect(noPromptUrl.includes('prompts'))
            .toBe(false);

        //Apply url
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();
        await since('Pass value Prompt, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$1,841,231');
        await dossierPage.closeTab(1);
    });

    it('[TC97814_02] Validate generate URL API pass Value prompt link Library Web - multi value prompt', async () => {
        await libraryPage.editDossierByUrlwithPrompt({
            projectId: multiValue.project.id,
            dossierId: multiValue.id,
        });
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName('Date');
        await calendar.openCalendar(prompt);
        await calendar.clearAndInputYear(prompt, '2016');
        await calendar.openMonthDropDownMenu(prompt);
        await calendar.selectMonth(prompt, 'Jan');
        await calendar.selectDay(prompt, '10');
        prompt = await promptObject.getPromptByName('Big decimal');
        await textbox.clearAndInputText(prompt, '');
        prompt = await promptObject.getPromptByName('Country');
        await cart.addSingle(prompt);
        prompt = await promptObject.getPromptByName('Number');
        await textbox.clearAndInputText(prompt, '2016');
        prompt = await promptObject.getPromptByName('Text');
        await textbox.clearAndInputText(prompt, 'south');
        await promptEditor.run();
        await dossierPage.waitForItemLoading();

        await toolbar.clickURLGeneratorButton();
        await toolbar.clickSelectValuePromptButton();
        await promptEditor.waitForEditorSelectableMode();
        await promptEditor.selectPromptItems(['Big decimal','Country','Number','Text','Date','Time']);
        await promptEditor.clickSelectButton();
        await since('Generator Bar Text should be #{expected}, while we got #{actual}')
            .expect(await toolbar.generatorBarText())
            .toBe('Choose filters, selectors and/or\nselect prompts\nto generate embedding URL\n6 prompts selected\nGenerate Link');
        await toolbar.clickGenerateLinkButton();
        const url =  await dossierPage.getClipboardText();
        await since('Clipboard Text should be #{expected}, while we got #{actual}')
            .expect(url)
            .toContain('prompts=%5B%5B%7B%22key%22%3A%220D50AB5743AAC8B4E1BB079F2365B27B%400%4010%22%2C%22values%22%3A%5B%221%2F10%2F2016%22%5D%2C%22useDefault%22%3Afalse%7D%2C%7B%22key%22%3A%2217CBD4E44974AD51946DFC9EB89ADE29%400%4010%22%2C%22values%22%3A%5B%222016%22%5D%2C%22useDefault%22%3Afalse%7D%2C%7B%22key%22%3A%226F6CC40540691A89A527FB839F201339%400%4010%22%2C%22values%22%3A%5B%22south%22%5D%2C%22useDefault%22%3Afalse%7D%2C%7B%22key%22%3A%22AC6FAD1649CB3318DD1C79B7D2447E22%400%4010%22%2C%22values%22%3A%5B%2211%2F24%2F2016%2012%3A00%3A00%20AM%22%5D%2C%22useDefault%22%3Afalse%7D%2C%7B%22key%22%3A%2294EADED142FEFAC3C8581FB64E73FF0D%400%4010%22%2C%22values%22%3A%5B%5D%2C%22useDefault%22%3Afalse%7D%2C%7B%22key%22%3A%220C0404C043BBDFDC67CEB4B425A095E1%400%4010%22%2C%22values%22%3A%5B%228D679D3811D3E4981000E787EC6DE8A4%3A1~1048576~USA%22%2C%228D679D3811D3E4981000E787EC6DE8A4%3A2~1048576~Spain%22%2C%228D679D3811D3E4981000E787EC6DE8A4%3A3~1048576~England%22%5D%2C%22useDefault%22%3Afalse%7D%5D%5D');
        
        //Apply url
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();
        await since('Pass value Prompt, prompt editor present should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since(
            'The first element of Cost should be #{expected} after apply Big Decimal, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$108,755');

        //Validate prompt
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Big decimal');
        await since('Date prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkEmptySummary('Big decimal'))
            .toEqual('No Selection');
        await since('Nubmer prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Number'))
            .toBe('2016');
        await since('Text prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Text'))
            .toBe('south');
        await since('Time prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Date'))
            .toBe('1/10/2016');
        await since('Time prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary('Time'))
            .toBe('11/24/2016 12:00:00 AM');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Country'))
            .toEqual('USA, Spain, England');
        await dossierPage.closeTab(1);
    });

    it('[TC97814_03] Validate generate URL API pass Value prompt link Library Web - dynamic link', async () => {
        await libraryPage.editDossierByUrlwithPrompt({
            projectId: multiValue.project.id,
            dossierId: multiValue.id,
        });
        await promptEditor.waitForEditor();
        await promptEditor.run();
        await dossierPage.waitForItemLoading();

        await toolbar.clickURLGeneratorButton();
        await toolbar.clickSelectValuePromptButton();
        await promptEditor.waitForEditorSelectableMode();
        await promptEditor.selectPromptItems(['Big decimal','Number','Text','Date','Time']);
        await promptEditor.switchDynamicItems(['Big decimal','Text','Date']);
        await takeScreenshotByElement(promptEditor.getPromprtEditorSelectableMode(), 'TC97814_04', 'select dynamic', {
            tolerance: 0.1,
        });
        await promptEditor.clickSelectButton();
        await since('Generator Bar Text should be #{expected}, while we got #{actual}')
            .expect(await toolbar.generatorBarText())
            .toBe('Choose filters, selectors and/or\nselect prompts\nto generate embedding URL\n5 prompts selected\nGenerate Link');
        await toolbar.clickGenerateLinkButton();
        await since('Clipboard Text should be #{expected}, while we got #{actual}')
            .expect(await dossierPage.getClipboardText())
            .toContain('prompts=%5B%5B%7B%22key%22%3A%220D50AB5743AAC8B4E1BB079F2365B27B%400%4010%22%2C%22values%22%3A%5B%22DYNAMIC_PLACEHOLDER_Date%22%5D%2C%22useDefault%22%3Afalse%7D%2C%7B%22key%22%3A%2217CBD4E44974AD51946DFC9EB89ADE29%400%4010%22%2C%22values%22%3A%5B%222015%22%5D%2C%22useDefault%22%3Afalse%7D%2C%7B%22key%22%3A%226F6CC40540691A89A527FB839F201339%400%4010%22%2C%22values%22%3A%5B%22DYNAMIC_PLACEHOLDER_Text%22%5D%2C%22useDefault%22%3Afalse%7D%2C%7B%22key%22%3A%22AC6FAD1649CB3318DD1C79B7D2447E22%400%4010%22%2C%22values%22%3A%5B%2211%2F24%2F2016%2012%3A00%3A00%20AM%22%5D%2C%22useDefault%22%3Afalse%7D%2C%7B%22key%22%3A%2294EADED142FEFAC3C8581FB64E73FF0D%400%4010%22%2C%22values%22%3A%5B%22DYNAMIC_PLACEHOLDER_Big decimal%22%5D%2C%22useDefault%22%3Afalse%7D%5D%5D');
        //check selected status
        await toolbar.clickSelectValuePromptButton();
        await promptEditor.waitForEditorSelectableMode();
        await takeScreenshotByElement(promptEditor.getPromprtEditorSelectableMode(), 'TC97814_05', 'keep dynamic selected status', {
            tolerance: 0.1,
        });
        //change dynamic
        await promptEditor.switchDynamicItems(['Big decimal','Text','Date']);
        await takeScreenshotByElement(promptEditor.getPromprtEditorSelectableMode(), 'TC97814_05', 'no dynamic', {
            tolerance: 0.1,
        });
        await promptEditor.clickSelectButton();
        await since('Generator Bar Text should be #{expected}, while we got #{actual}')
            .expect(await toolbar.generatorBarText())
            .toBe('Choose filters, selectors and/or\nselect prompts\nto generate embedding URL\n5 prompts selected\nGenerate Link');
        await toolbar.clickGenerateLinkButton();
        await since('Clipboard Text should be #{expected}, while we got #{actual}')
            .expect(await dossierPage.getClipboardText())
            .toContain('prompts=%5B%5B%7B%22key%22%3A%220D50AB5743AAC8B4E1BB079F2365B27B%400%4010%22%2C%22values%22%3A%5B%222%2F11%2F2015%22%5D%2C%22useDefault%22%3Afalse%7D%2C%7B%22key%22%3A%2217CBD4E44974AD51946DFC9EB89ADE29%400%4010%22%2C%22values%22%3A%5B%222015%22%5D%2C%22useDefault%22%3Afalse%7D%2C%7B%22key%22%3A%226F6CC40540691A89A527FB839F201339%400%4010%22%2C%22values%22%3A%5B%5D%2C%22useDefault%22%3Afalse%7D%2C%7B%22key%22%3A%22AC6FAD1649CB3318DD1C79B7D2447E22%400%4010%22%2C%22values%22%3A%5B%2211%2F24%2F2016%2012%3A00%3A00%20AM%22%5D%2C%22useDefault%22%3Afalse%7D%2C%7B%22key%22%3A%2294EADED142FEFAC3C8581FB64E73FF0D%400%4010%22%2C%22values%22%3A%5B%2299.99%22%5D%2C%22useDefault%22%3Afalse%7D%5D%5D');
    });

    it('[TC97814_04] Validate generate URL API pass Value prompt link Library Web - edit without data', async () => {
        await libraryPage.openDossierContextMenu(pipinLibrary.name);
        await libraryPage.clickDossierContextMenuItem('Edit without Data');
        await dossierPage.waitForItemLoading();

        await toolbar.clickURLGeneratorButton();
        await since('Select value prompt button should be #{expected}, instead we have #{actual}')
            .expect(await toolbar.isSelectValuePromptButtonDisplay())
            .toBe(true);
        await toolbar.clickSelectValuePromptButton();
        await promptEditor.waitForEditorSelectableMode();
        await promptEditor.selectPromptItems(['Big decimal','Country']);
        await promptEditor.clickSelectButton();
        await since('Generator Bar Text should be #{expected}, while we got #{actual}')
            .expect(await toolbar.generatorBarText())
            .toBe('Choose filters, selectors and/or\nselect value prompt\nto generate embedding URL\n1 prompt selected\nGenerate Link');
        await toolbar.clickGenerateLinkButton();
        await since('Clipboard Text should be #{expected}, while we got #{actual}')
            .expect(await dossierPage.getClipboardText())
            .toContain('prompts=%5B%5B%7B%22key%22%3A%2294EADED142FEFAC3C8581FB64E73FF0D%400%4010%22%2C%22values%22%3A%5B%5D%2C%22useDefault%22%3Afalse%7D%5D%5D');
        await toolbar.clickCloseURLGeneratorDialogButton();
    });

    it('[TC97814_05] Validate generate URL API pass Value prompt link Library Web - no value prompt', async () => {
        await libraryPage.editDossierByUrlwithPrompt({
            projectId: noValue.project.id,
            dossierId: noValue.id,
        });
        await promptEditor.waitForEditor();
        await promptEditor.run();
        await dossierPage.waitForItemLoading();

        await toolbar.clickURLGeneratorButton();
        await since('Select value prompt button should be #{expected}, instead we have #{actual}')
            .expect(await toolbar.isSelectValuePromptButtonDisplay())
            .toBe(false);
    });
});

export const config = specConfiguration;
