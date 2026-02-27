import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_incanvas_selector') };
const { credentials } = specConfiguration;
const tutorialProject = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};
const tolerance = 0.2;
const browserWindow = {
    
    width: 1600,
    height: 1200,
};

describe('Incanvas Selector - Mandatory', () => {
    const dossier = {
        id: '1DB3630A41A725051C2A1D9B3A6EDE32',
        name: '(AUTO) In-canvas selector - mandatory',
        project: tutorialProject,
    };

    let { dossierPage, toc, libraryPage, inCanvasSelector, grid, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC97291_01] Validate mandatory InCanvas selector with different style on Library', async () => {

        // manupulate the linkbar selector
        await toc.openPageFromTocMenu({ chapterName: 'ICS', pageName: 'ICS LinkBar' });
        const callcenterSelector = InCanvasSelector.createByTitle('Call Center');
        const categorySelector = InCanvasSelector.createByTitle('Category');
        since('The initial warning message for call center ics is supposed to be #{expected}, instead we have #{actual}')
            .expect(await callcenterSelector.getMandatoryWarningMessageText()).toBe("Make at least one selection.");
        since('The initial warning message for category ics display is supposed to be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.isMandatoryWarningDisplayed()).toBe(false);
        await takeScreenshotByElement(callcenterSelector.getMandatoryWarningBorder(), 'TC97291', 'ICS LinkBar - CallCenter - WarningBorder');
        await takeScreenshotByElement(callcenterSelector.getMandatoryWarningMessage(), 'TC97291', 'ICS LinkBar - CallCenter - WarningMessage');   
        // select item
        await callcenterSelector.selectItem('Atlanta');
        await categorySelector.selectItem('Books');
        since('The warning message for call center ics display after manipulation is supposed to be #{expected}, instead we have #{actual}')
            .expect(await callcenterSelector.isMandatoryWarningDisplayed()).toBe(false);
        since('The warning message for category ics after manipulation is supposed to be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.getMandatoryWarningMessageText()).toBe('Make at least one selection.');
        await takeScreenshotByElement(categorySelector.getMandatoryWarningBorder(), 'TC97291', 'ICS LinkBar - Category - WarningBorder');
        await takeScreenshotByElement(categorySelector.getMandatoryWarningMessage(), 'TC97291', 'ICS LinkBar - Category - WarningMessage');

        await categorySelector.selectItem('Movies');
        await since('Target grid data is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['Movies', 'Action', 'Atlanta']);

        // unset ics
        await categorySelector.openContextMenu();
        await categorySelector.selectOptionInMenu('Reset');
        await since('Unset filter, item selected should be #{expected}, while we get #{actual}')
            .expect(await categorySelector.getSelectedItemsText())
            .toEqual(['Books']);
    });

    it('[TC97291_02] Validate mandatory InCanvas selector with different style on Library', async () => {
        // manupulate the checkbox selector
        await toc.openPageFromTocMenu({ chapterName: 'ICS', pageName: 'ICS CheckBox' });
        const callcenterSelector = InCanvasSelector.createByTitle('Call Center');
        const categorySelector = InCanvasSelector.createByTitle('Category');
        since('The initial warning message for call center ics is supposed to be #{expected}, instead we have #{actual}')
            .expect(await callcenterSelector.getMandatoryWarningMessageText()).toBe("Make at least one selection.");
        since('The initial warning message for category ics display is supposed to be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.isMandatoryWarningDisplayed()).toBe(false);
        await takeScreenshotByElement(callcenterSelector.getMandatoryWarningBorder(), 'TC97291', 'ICS CheckBox - CallCenter - WarningBorder');
        await takeScreenshotByElement(callcenterSelector.getMandatoryWarningMessage(), 'TC97291', 'ICS CheckBox - CallCenter - WarningMessage');   
        // select item
        await callcenterSelector.selectItem('Atlanta');
        await categorySelector.selectItem('Books');
        since('The warning message for call center ics display after manipulation is supposed to be #{expected}, instead we have #{actual}')
            .expect(await callcenterSelector.isMandatoryWarningDisplayed()).toBe(false);
        since('The warning message for category ics after manipulation is supposed to be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.getMandatoryWarningMessageText()).toBe('Make at least one selection.');
        await takeScreenshotByElement(categorySelector.getMandatoryWarningBorder(), 'TC97291', 'ICS CheckBox - Category - WarningBorder');
        await takeScreenshotByElement(categorySelector.getMandatoryWarningMessage(), 'TC97291', 'ICS CheckBox - Category - WarningMessage');

        await categorySelector.selectItem('Movies');
        await since('Target grid data is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['Movies', 'Action', 'Atlanta']);

        // unset ics
        await categorySelector.openContextMenu();
        await categorySelector.selectOptionInMenu('Reset');
        await since('Unset filter, item selected should be #{expected}, while we get #{actual}')
            .expect(await categorySelector.getSelectedItemsText())
            .toEqual(['Books']);
    });

    it('[TC97291_03] Validate mandatory InCanvas selector with different style on Library', async () => {
        
        // manupulate the checkbox selector
        await toc.openPageFromTocMenu({ chapterName: 'ICS', pageName: 'ICS Slider' });
        const callcenterSelector = InCanvasSelector.createByTitle('Call Center');
        const categorySelector = InCanvasSelector.createByTitle('Category');
        // due to DExxx, the warning message is not displayed
        // since('The initial warning message for call center ics is supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await callcenterSelector.getMandatoryWarningMessageText()).toBe("Make at least one selection.");
        since('The initial warning message for category ics display is supposed to be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.isMandatoryWarningDisplayed()).toBe(false);
        // await takeScreenshotByElement(callcenterSelector.getMandatoryWarningBorder(), 'TC97291', 'ICS CheckBox - CallCenter - WarningBorder');
        // await takeScreenshotByElement(callcenterSelector.getMandatoryWarningMessage(), 'TC97291', 'ICS CheckBox - CallCenter - WarningMessage');   
        // select item
        await callcenterSelector.dragSlider({ x: 50, y: 0 });
        await categorySelector.dragSlider({ x: 50, y: 0 });;
        since('The warning message for call center ics display after manipulation is supposed to be #{expected}, instead we have #{actual}')
            .expect(await callcenterSelector.isMandatoryWarningDisplayed()).toBe(false);
        // since('The warning message for category ics after manipulation is supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await categorySelector.getMandatoryWarningMessageText()).toBe('Make at least one selection.');
        // await takeScreenshotByElement(categorySelector.getMandatoryWarningBorder(), 'TC97291', 'ICS CheckBox - Category - WarningBorder');
        // await takeScreenshotByElement(categorySelector.getMandatoryWarningMessage(), 'TC97291', 'ICS CheckBox - Category - WarningMessage');

        await since('Target grid data is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['Books', 'Art & Architecture', 'Atlanta']);

        // unset ics
        await categorySelector.openContextMenu();
        await categorySelector.selectOptionInMenu('Reset');
        await since('Unset filter, item selected should be #{expected}, while we get #{actual}')
            .expect(await categorySelector.getSliderSelectedText())
            .toBe('Books');
    });

    it('[TC97291_04] Validate mandatory InCanvas selector with different style on Library', async () => {
        
        // manupulate the checkbox selector
        await toc.openPageFromTocMenu({ chapterName: 'ICS', pageName: 'ICS SearchBox' });
        const callcenterSelector = InCanvasSelector.createByTitle('Call Center');
        const categorySelector = InCanvasSelector.createByTitle('Category');
        since('The initial warning message for call center ics is supposed to be #{expected}, instead we have #{actual}')
            .expect(await callcenterSelector.getSearchBoxMandatoryWarningMessageText()).toBe("Make at least one selection.");
        since('The initial warning message for category ics display is supposed to be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.getSearchBoxMandatoryWarningMessageText()).toBe('Search Category');
        await takeScreenshotByElement(callcenterSelector.getSearchBoxMandatoryWarningBorder(), 'TC97291', 'ICS Searchbox - CallCenter - WarningBorder');
         // search & select
        await callcenterSelector.searchSearchbox('a');
        await callcenterSelector.selectSearchBoxItem('Atlanta');
        // then unset ics
        await callcenterSelector.openContextMenu();
        await callcenterSelector.selectOptionInMenu('Reset');
        since('After reset, the warning message for call center ics is supposed to be #{expected}, instead we have #{actual}')
            .expect(await callcenterSelector.getSearchBoxMandatoryWarningMessageText()).toBe("Make at least one selection.");
        await categorySelector.deleteSearchboxItems(['Books']);
         // search & select again   
        await callcenterSelector.searchSearchbox('a');
        await callcenterSelector.selectSearchBoxItem('Atlanta');
        //check data
        await since('Target grid data is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['Movies', 'Action', 'Atlanta']);
        
        await categorySelector.deleteSearchboxItems(['Movies']);

        since('The warning message for call center ics display after manipulation is supposed to be #{expected}, instead we have #{actual}')
            .expect(await callcenterSelector.getSearchBoxMandatoryWarningMessageText()).toBe('Search Call Center');
        since('The warning message for category ics after manipulation is supposed to be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.getSearchBoxMandatoryWarningMessageText()).toBe('Make at least one selection.');
        await takeScreenshotByElement(categorySelector.getSearchBoxMandatoryWarningBorder(), 'TC97291', 'ICS Searchbox - Category - WarningBorder');


        // unset ics
        await categorySelector.openContextMenu();
        await categorySelector.selectOptionInMenu('Reset');
        await since('Unset filter, item selected should be #{expected}, while we get #{actual}')
            .expect(await categorySelector.getSelectedItemsText(true))
            .toEqual(['Books', 'Movies']);
    });

    it('[TC97291_05] Validate mandatory InCanvas selector with different style on Library', async () => {

        // manupulate the linkbar selector
        await toc.openPageFromTocMenu({ chapterName: 'ICS', pageName: 'ICS ButtonBar' });
        const callcenterSelector = InCanvasSelector.createByTitle('Call Center');
        const categorySelector = InCanvasSelector.createByTitle('Category');
        since('The initial warning message for call center ics is supposed to be #{expected}, instead we have #{actual}')
            .expect(await callcenterSelector.getMandatoryWarningMessageText()).toBe("Make at least one selection.");
        since('The initial warning message for category ics display is supposed to be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.isMandatoryWarningDisplayed()).toBe(false);
        await takeScreenshotByElement(callcenterSelector.getMandatoryWarningBorder(), 'TC97291', 'ICS ButtonBar - CallCenter - WarningBorder');
        await takeScreenshotByElement(callcenterSelector.getMandatoryWarningMessage(), 'TC97291', 'ICS ButtonBar - CallCenter - WarningMessage');   
        // select item
        await callcenterSelector.selectItem('Atlanta');
        await categorySelector.multiSelect(['Books', 'Movies']);
        since('The warning message for call center ics display after manipulation is supposed to be #{expected}, instead we have #{actual}')
            .expect(await callcenterSelector.isMandatoryWarningDisplayed()).toBe(false);
        since('The warning message for category ics after manipulation is supposed to be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.getMandatoryWarningMessageText()).toBe('Make at least one selection.');
        await takeScreenshotByElement(categorySelector.getMandatoryWarningBorder(), 'TC97291', 'ICS ButtonBar - Category - WarningBorder');
        await takeScreenshotByElement(categorySelector.getMandatoryWarningMessage(), 'TC97291', 'ICS ButtonBar - Category - WarningMessage');

        await categorySelector.selectItem('Movies');
        await since('Target grid data is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['Movies', 'Action', 'Atlanta']);

        // unset ics
        await categorySelector.openContextMenu();
        await categorySelector.selectOptionInMenu('Reset');
        await since('Unset filter, item selected should be #{expected}, while we get #{actual}')
            .expect(await categorySelector.getSelectedItemsText())
            .toEqual(['Books', 'Movies']);
    });

    it('[TC97291_06] Validate mandatory InCanvas selector with different style on Library', async () => {

        // manupulate the linkbar selector
        await toc.openPageFromTocMenu({ chapterName: 'ICS', pageName: 'ICS RadioButton' });
        const callcenterSelector = InCanvasSelector.createByTitle('Call Center');
        const categorySelector = InCanvasSelector.createByTitle('Category');
        // Due to DExxx, the warning message is not displayed
        // since('The initial warning message for call center ics is supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await callcenterSelector.getMandatoryWarningMessageText()).toBe("Make at least one selection.");
        since('The initial warning message for category ics display is supposed to be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.isMandatoryWarningDisplayed()).toBe(false);
        // await takeScreenshotByElement(callcenterSelector.getMandatoryWarningBorder(), 'TC97291', 'ICS RadioButton - CallCenter - WarningBorder');
        // await takeScreenshotByElement(callcenterSelector.getMandatoryWarningMessage(), 'TC97291', 'ICS LinkBar - CallCenter - WarningMessage');   
        // select item
        await callcenterSelector.selectItem('Atlanta');
        // await categorySelector.selectItem('Books');
        // since('The warning message for call center ics display after manipulation is supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await callcenterSelector.isMandatoryWarningDisplayed()).toBe(false);
        // since('The warning message for category ics after manipulation is supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await categorySelector.getMandatoryWarningMessageText()).toBe('Make at least one selection.');
        // await takeScreenshotByElement(categorySelector.getMandatoryWarningBorder(), 'TC97291', 'ICS LinkBar - Category - WarningBorder');
        // await takeScreenshotByElement(categorySelector.getMandatoryWarningMessage(), 'TC97291', 'ICS LinkBar - Category - WarningMessage');

        await categorySelector.selectItem('Movies');
        await since('Target grid data is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['Movies', 'Action', 'Atlanta']);

        // unset ics
        await categorySelector.openContextMenu();
        await categorySelector.selectOptionInMenu('Reset');
        await since('Unset filter, item selected should be #{expected}, while we get #{actual}')
            .expect(await categorySelector.getSelectedItemsText())
            .toEqual(['Books']);
    });

    it('[TC97291_07] Validate mandatory InCanvas selector with different style on Library', async () => {

        // manupulate the linkbar selector
        await toc.openPageFromTocMenu({ chapterName: 'ICS', pageName: 'ICS Dropdown' });
        const callcenterSelector = InCanvasSelector.createByTitle('Call Center');
        const categorySelector = InCanvasSelector.createByTitle('Category');
        since('The initial warning message for call center ics is supposed to be #{expected}, instead we have #{actual}')
            .expect(await callcenterSelector.getMandatoryWarningMessageText()).toBe("Make at least one selection.");
        since('The initial warning message for category ics display is supposed to be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.isMandatoryWarningDisplayed()).toBe(false);
        await takeScreenshotByElement(callcenterSelector.getMandatoryWarningBorder(), 'TC97291', 'ICS Dropdown - CallCenter - WarningBorder');
        await takeScreenshotByElement(callcenterSelector.getMandatoryWarningMessage(), 'TC97291', 'ICS Dropdown - CallCenter - WarningMessage');   
        // select item
        await callcenterSelector.chooseDropdownItems(['Atlanta']);
        // await categorySelector.selectItem('Books');
        // since('The warning message for call center ics display after manipulation is supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await callcenterSelector.isMandatoryWarningDisplayed()).toBe(false);
        // since('The warning message for category ics after manipulation is supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await categorySelector.getMandatoryWarningMessageText()).toBe('Make at least one selection.');
        // await takeScreenshotByElement(categorySelector.getMandatoryWarningBorder(), 'TC97291', 'ICS Dropdown - Category - WarningBorder');
        // await takeScreenshotByElement(categorySelector.getMandatoryWarningMessage(), 'TC97291', 'ICS Dropdown - Category - WarningMessage');
        await categorySelector.chooseDropdownItems(['Movies']);
        await since('Target grid data is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['Movies', 'Action', 'Atlanta']);

        // unset ics
        await categorySelector.openContextMenu();
        await categorySelector.selectOptionInMenu('Reset');
        // Due to DE307826, update the script temporarily
        await since('Unset filter, item selected should be #{expected}, while we get #{actual}')
            .expect(await categorySelector.getDropdownSelectedText())
            .toBe('Books');
    });

    it('[TC97291_08] Validate mandatory InCanvas selector with different style on Library', async () => {

        // manupulate the linkbar selector
        await toc.openPageFromTocMenu({ chapterName: 'ICS', pageName: 'ICS ListBox' });
        const callcenterSelector = InCanvasSelector.createByTitle('Call Center');
        const categorySelector = InCanvasSelector.createByTitle('Category');
        // Due to DExxx, the warning message is not displayed
        // since('The initial warning message for call center ics is supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await callcenterSelector.getMandatoryWarningMessageText()).toBe("Make at least one selection.");
        since('The initial warning message for category ics display is supposed to be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.isMandatoryWarningDisplayed()).toBe(false);
        // await takeScreenshotByElement(callcenterSelector.getMandatoryWarningBorder(), 'TC97291', 'ICS LinkBar - CallCenter - WarningBorder');
        // await takeScreenshotByElement(callcenterSelector.getMandatoryWarningMessage(), 'TC97291', 'ICS LinkBar - CallCenter - WarningMessage');   
        // select item
        await callcenterSelector.selectItem('Atlanta');
        // await categorySelector.selectItem('Books');
        // since('The warning message for call center ics display after manipulation is supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await callcenterSelector.isMandatoryWarningDisplayed()).toBe(false);
        // since('The warning message for category ics after manipulation is supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await categorySelector.getMandatoryWarningMessageText()).toBe('Make at least one selection.');
        // await takeScreenshotByElement(categorySelector.getMandatoryWarningBorder(), 'TC97291', 'ICS LinkBar - Category - WarningBorder');
        // await takeScreenshotByElement(categorySelector.getMandatoryWarningMessage(), 'TC97291', 'ICS LinkBar - Category - WarningMessage');

        await categorySelector.selectItem('Movies');
        await since('Target grid data is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['Movies', 'Action', 'Atlanta']);

        // unset ics
        await categorySelector.openContextMenu();
        await categorySelector.selectOptionInMenu('Reset');

        await since('Unset filter, item selected should be #{expected}, while we get #{actual}')
            .expect(await categorySelector.getSelectedItemsText())
            .toEqual(['Books']);
    });

    it('[TC97308] Validate mandatory InCanvas selector for parameter', async () => {
        // manupulate the parameter selector
        await toc.openPageFromTocMenu({ chapterName: 'ICS', pageName: 'ICS Parameter' });
        const subcategorySelector = InCanvasSelector.createByTitle('Subcategory');
        const categorySelector = InCanvasSelector.createByTitle('Category');
        since('The initial warning message for call center ics is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subcategorySelector.getMandatoryWarningMessageText()).toBe("Make at least one selection.");
        since('The initial warning message for category ics display is supposed to be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.isMandatoryWarningDisplayed()).toBe(false);
        // select item
        await subcategorySelector.selectItem('Cameras');
        await categorySelector.selectItem('Books');
        since('The warning message for call center ics display after manipulation is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subcategorySelector.isMandatoryWarningDisplayed()).toBe(false);
        since('The warning message for category ics after manipulation is supposed to be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.getMandatoryWarningMessageText()).toBe('Make at least one selection.');

        await categorySelector.multiSelect(['Electronics', 'Movies', 'Music']);
        await since('Target grid data is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['Electronics', 'Cameras', 'Atlanta']);

        // unset ics
        await categorySelector.openContextMenu();
        await categorySelector.selectOptionInMenu('Reset');
        await since('Unset filter, item selected should be #{expected}, while we get #{actual}')
            .expect(await categorySelector.getSelectedItemsText())
            .toEqual(['Books']);
    });

    it('[TC97309] Validate mandatory InCanvas selector with GDDE', async () => {
        // check source M + target not M
        await toc.openPageFromTocMenu({ chapterName: 'ICS auto update target', pageName: 'Source M + Taregt Not M' });
        const subcategorySelector = InCanvasSelector.createByTitle('Subcategory');
        const categorySelector = InCanvasSelector.createByTitle('Category');
        since('The initial warning message for subcategory ics display is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subcategorySelector.isMandatoryWarningDisplayed()).toBe(false);
        since('The initial warning message for category ics display is supposed to be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.isMandatoryWarningDisplayed()).toBe(false);
        // change selections
        await categorySelector.selectItem('Electronics');
        await subcategorySelector.selectItem('(All)');
        since('The warning message for subcategory ics display after change is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subcategorySelector.isMandatoryWarningDisplayed()).toBe(false);
        since('The warning message for category ics display after change is supposed to be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.isMandatoryWarningDisplayed()).toBe(true);
        
        // check source M + target not M
        await toc.openPageFromTocMenu({ chapterName: 'ICS auto update target', pageName: 'Source not M + Target M + grid' });
        // const subcategorySelector = InCanvasSelector.createByTitle('Subcategory');
        // const categorySelector = InCanvasSelector.createByTitle('Category');
        since('The initial warning message for subcategory ics display is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subcategorySelector.isMandatoryWarningDisplayed()).toBe(true);
        since('The initial warning message for category ics display is supposed to be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.isMandatoryWarningDisplayed()).toBe(false);
        // change selections
        await categorySelector.selectItem('Electronics');
        since('The warning message for subcategory ics display after change is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subcategorySelector.isMandatoryWarningDisplayed()).toBe(false);
        since('The warning message for category ics display after change is supposed to be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.isMandatoryWarningDisplayed()).toBe(false);
        
        // change selections again
        await categorySelector.selectItem('Books');
        since('The warning message for subcategory ics display after 2nd source change is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subcategorySelector.isMandatoryWarningDisplayed()).toBe(true);
        await subcategorySelector.selectItem('Business');
        since('The warning message for subcategory ics display after 2nd change is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subcategorySelector.isMandatoryWarningDisplayed()).toBe(false);
        since('The target grid data is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['Books', 'Business', '$311,597']);
        
        // check source M + target dynamic M
        await toc.openPageFromTocMenu({ chapterName: 'ICS auto update target', pageName: 'Source M + Taregt dynamic M' });
        // const subcategorySelector = InCanvasSelector.createByTitle('Subcategory');
        // const categorySelector = InCanvasSelector.createByTitle('Category');
        since('The initial warning message for subcategory ics display is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subcategorySelector.isMandatoryWarningDisplayed()).toBe(false);
        since('The initial warning message for category ics display is supposed to be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.isMandatoryWarningDisplayed()).toBe(false);
        // change selections
        await categorySelector.selectItem('Music');
        since('The warning message for subcategory ics display after change is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subcategorySelector.isMandatoryWarningDisplayed()).toBe(false);
        since('The warning message for category ics display after change is supposed to be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.isMandatoryWarningDisplayed()).toBe(true);
        since('The subcategory ICS selection is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subcategorySelector.getSelectedItemsText())
            .toEqual([]);
        
        // change selections again
        await categorySelector.selectItem('Books');
        since('The warning message for subcategory ics display after 2nd source change is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subcategorySelector.isMandatoryWarningDisplayed()).toBe(false);
        since ('The subcategory ICS selection after source change is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subcategorySelector.getSelectedItemsText())
            .toEqual(['Art & Architecture', 'Books - Miscellaneous', 'Business']);
        since('The target grid data is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['Books', 'Art & Architecture', '$370,161']);
        
        // check source M + target dynamic not M
        await toc.openPageFromTocMenu({ chapterName: 'ICS auto update target', pageName: 'Source M + Taregt dynamic not M' });
        // const subcategorySelector = InCanvasSelector.createByTitle('Subcategory');
        // const categorySelector = InCanvasSelector.createByTitle('Category');
        since('The initial warning message for subcategory ics display is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subcategorySelector.isMandatoryWarningDisplayed()).toBe(false);
        since('The initial warning message for category ics display is supposed to be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.isMandatoryWarningDisplayed()).toBe(false);
        // change selections
        await categorySelector.selectItem('Books');
        since('The warning message for subcategory ics display after change is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subcategorySelector.isMandatoryWarningDisplayed()).toBe(false);
        since('The warning message for category ics display after change is supposed to be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.isMandatoryWarningDisplayed()).toBe(true);
        since('The subcategory ICS selection is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subcategorySelector.getSelectedItemsText())
            .toEqual([]);
        
        // change selections again
        await categorySelector.selectItem('Books');
        since('The warning message for subcategory ics display after 2nd source change is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subcategorySelector.isMandatoryWarningDisplayed()).toBe(false);
        since ('The subcategory ICS selection after source change is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subcategorySelector.getSelectedItemsText())
            .toEqual(['Art & Architecture', 'Business', 'Literature', 'Books - Miscellaneous']);
        since('The target grid data is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['Books', 'Art & Architecture', '$370,161']);
        
    });

});
export const config = specConfiguration;
