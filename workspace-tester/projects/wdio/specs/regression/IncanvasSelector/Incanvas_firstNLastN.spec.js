import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';
import SelectorObject from '../../../pageObjects/selector/SelectorObject.js';

const specConfiguration = { ...customCredentials('_incanvas_selector') };
const tolerance = 0.3;
const { credentials } = specConfiguration;

const project = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

describe('In-canvas selector', () => {
    const dossier1 = {
        id: '94AB41A24965961587DA2097E005A257',
        name: '(AUTO) In-canvas selector - different status',
        project,
    };
    const dossier2 = {
        id: 'EB670E1744321A8F63EC2C94DD007938',
        name: '(AUTO) In-canvas selector- FirstN/LastN',
        project,
    };
    const browserWindow = {
        
        width: 1600,
        height: 1200,
    };

    let { libraryPage, toc, grid, inCanvasSelector, dossierPage, loginPage, libraryAuthoringPage, contentsPanel, formatPanel} = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it(
        '[TC25967] Verify In-canvas Selector in different styles and status in Library Web',
        async () => {
            await resetDossierState({
                credentials: specConfiguration.credentials,
                dossier: dossier1,
            });
            await libraryPage.openDossier(dossier1.name);

            // check rendering for checkbox selector and make selection
            await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC25967', 'InitialRenderingCheckbox', {
                tolerance: 0.6,
            });

            await inCanvasSelector.selectItem('Atlanta');
            await since(
                'Uncheck Atlanta, first item of "Call Center" is supposed to be #{expected}, instead we have #{actual}'
            )
                .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Call Center' }))
                .toBe('San Francisco');

            // check rendering for other selector types
            await toc.openPageFromTocMenu({ chapterName: 'Include default', pageName: 'Slider' });
            await toc.openPageFromTocMenu({ chapterName: 'Include default', pageName: 'Search box' });
            await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC25967', 'InitialRenderingSearchbox', {
                tolerance: tolerance,
            });

            await toc.openPageFromTocMenu({ chapterName: 'Include default', pageName: 'Drop down' });
            await inCanvasSelector.initial();
            await inCanvasSelector.openDropdownMenu();

            // check selector allowed multiple selection
            await toc.openPageFromTocMenu({ chapterName: 'All alias - multi select', pageName: 'Link bar' });
            await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC25967', 'MultiSelectionLinkbar', {
                tolerance: 1.5,
            });

            await toc.openPageFromTocMenu({ chapterName: 'All alias - multi select', pageName: 'Button bar' });
            await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC25967', 'MultiSelectionButtonbar', {
                tolerance: 1, //image diff between CTC CI and HQ CI
            });

            await toc.openPageFromTocMenu({ chapterName: 'Include default', pageName: 'Drop down' });
            await inCanvasSelector.initial();
            await inCanvasSelector.openDropdownMenu();
            await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC25967', 'MultiSelectionDropdown', {
                tolerance: tolerance,
            });

            await toc.openPageFromTocMenu({ chapterName: 'All alias - multi select', pageName: 'List box' });
            await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC25967', 'MultiSelectionListbox', {
                tolerance: tolerance,
            });

            // check selector in exclude mode
            await toc.openPageFromTocMenu({ chapterName: 'Exclude- multi select', pageName: 'Button bar' });
            await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC25967', 'ExcludeButtonbar', {
                tolerance: tolerance,
            });

            // check metric selector
            await toc.openPageFromTocMenu({ chapterName: 'Metric selector', pageName: 'Slider' });
            await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC25967', 'MetricSlider', {
                tolerance: tolerance,
            });

            await toc.openPageFromTocMenu({ chapterName: 'Metric selector', pageName: 'Qualify' });
            await takeScreenshotByElement(inCanvasSelector.getInstance(), 'TC25967', 'MetricQualify', {
                tolerance: tolerance,
            });
        },
        8 * 60 * 1000
    );

    it('[TC72039] Verify context menu for in-canvas selector in Library', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossier(dossier1.name);

        // Make selection and then unset filter to all
        await toc.openPageFromTocMenu({ chapterName: 'Include default', pageName: 'Link bar' });
        await inCanvasSelector.selectItem('San Diego');
        await since(
            'Check San Diego, first item of "Call Center" is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Call Center' }))
            .toBe('San Diego');
        // Move mouse to other place and then hover on in-canvas selector
        await libraryPage.hover({ elem: libraryPage.getLibraryIcon() });
        await inCanvasSelector.openContextMenu();
        await inCanvasSelector.selectOptionInMenu('Unset Filter');
        await since(
            'Unset filter, first item of "Call Center" is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Call Center' }))
            .toBe('Atlanta');

        // Unset filter in exclude mode
        await toc.openPageFromTocMenu({ chapterName: 'Exclude- multi select', pageName: 'Link bar' });
        await inCanvasSelector.initial();
        await inCanvasSelector.openContextMenu();
        await inCanvasSelector.selectOptionInMenu('Unset Filter');
        await since(
            'Unset filter, first item of "Call Center" is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Call Center' }))
            .toBe('Atlanta');
    });

    it('[TC72038] Verify in-canvas selector with dynamic selection in Library', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossier(dossier2.name);
        await toc.openPageFromTocMenu({ chapterName: 'Attribute selector with dynamic selection', pageName: 'Linkbar' });

        // Check selector rendering in dynamic on/off status
        const selectorDyamicLast = InCanvasSelector.createByTitle(
            'Category-do not allow multiple selection-last element'
        );
        const selectorDyamicFirst = InCanvasSelector.createByTitle('Region-first2');
        const selectorDyamicOff = InCanvasSelector.createByTitle('Subcategory-last5(off)');
        await selectorDyamicLast.selectItem('Movies');
        await selectorDyamicFirst.selectItem('(All)');
        await selectorDyamicOff.selectItem('Horror');
        await since('Check selecctor, first item of  is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('Central');

        // Check context menu in dynamic on/off status
        await selectorDyamicLast.openContextMenu();
        await selectorDyamicLast.selectOptionInMenu('Reset to');
        await selectorDyamicFirst.openContextMenu();
        await selectorDyamicFirst.selectOptionInMenu('Reset to');
        await selectorDyamicOff.openContextMenu();
        await selectorDyamicOff.selectOptionInMenu('Reset to');
        await since('Page slider, first item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('Central');

        // Check other selector styles rendering in dynamic on/off status
        await toc.openPageFromTocMenu({ chapterName: 'Attribute selector with dynamic selection', pageName: 'Slider' });
        await since('Page slider, first item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('Central');

        await toc.openPageFromTocMenu({
            chapterName: 'Attribute selector with dynamic selection',
            pageName: 'Checkbox',
        });
        await since('Page Checkbox, first item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('Southwest');

        await toc.openPageFromTocMenu({
            chapterName: 'Attribute selector with dynamic selection',
            pageName: 'Searchbox',
        });
        await since('Page Searchbox, first item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('Central');

        await toc.openPageFromTocMenu({
            chapterName: 'Attribute selector with dynamic selection',
            pageName: 'Buttonbar',
        });
        await since('Page Buttonbar, first item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('Central');

        await toc.openPageFromTocMenu({
            chapterName: 'Attribute selector with dynamic selection',
            pageName: 'Radiobutton',
        });
        await since('Page Radiobutton, first item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('Web');

        await toc.openPageFromTocMenu({
            chapterName: 'Attribute selector with dynamic selection',
            pageName: 'Drop-down',
        });
        await since('Page Drop-down, first item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('Web');

        await toc.openPageFromTocMenu({
            chapterName: 'Attribute selector with dynamic selection',
            pageName: 'Listbox',
        });
        await since('Page Listbox, first item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Region' }))
            .toBe('Southwest');
    });

    it('[TC72038_01] Verify in-canvas selector with new format in Library - Linkbar', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossier(dossier2.name);

        // check Linkbar
        await toc.openPageFromTocMenu({ chapterName: 'New Selector Format', pageName: 'Linkbar' });
        const linkbarSelector1 = InCanvasSelector.createByTitle('Horizontal-Single Selection');
        const linkbarSelector2 = InCanvasSelector.createByTitle('Horizontal-Multi Selection');
        const linkbarSelector3 = InCanvasSelector.createByTitle('Vertical-Single Selection');
        const linkbarSelector4 = InCanvasSelector.createByTitle('Vertical-Multi Selection');
        await takeScreenshotByElement(linkbarSelector1.getElement(), 'TC72038_01', 'Linkbar-Horizontal-Single Selection', {
            tolerance: tolerance,
        });
        await takeScreenshotByElement(linkbarSelector2.getElement(), 'TC72038_01', 'Linkbar-Horizontal-Multi Selection', {
            tolerance: tolerance,
        });
        await takeScreenshotByElement(linkbarSelector3.getElement(), 'TC72038_01', 'Linkbar-Vertical-Single Selection', {
            tolerance: tolerance,
        });
        await takeScreenshotByElement(linkbarSelector4.getElement(), 'TC72038_01', 'Linkbar-Vertical-Multi Selection', {
            tolerance: tolerance,
        });

        // check authoring format panel settings

        await libraryAuthoringPage.editDossierFromLibrary();
        await contentsPanel.goToPage({
            chapterName: 'New Selector Format',
            pageName: 'Linkbar',
        });
        // click on the ICS
        await linkbarSelector1.getElement().click();
        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToTextAndFormTab();
        await takeScreenshotByElement(formatPanel.getTextAndFormContent(), 'TC72038_01', 'Format panel - Linkbar settings', {
            tolerance: tolerance,
        });
        await contentsPanel.dossierAuthoringPage.closeDossierWithoutSaving();
    });

    it('[TC72038_02] Verify in-canvas selector with new format in Library - Slider', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossier(dossier2.name);


        // check slider
        await toc.openPageFromTocMenu({ chapterName: 'New Selector Format', pageName: 'Slider' });
        const sliderSelector1 = InCanvasSelector.createByTitle('Single selection - exclude');
        const sliderSelector2 = InCanvasSelector.createByTitle('Single selection - include');
        const sliderSelector3 = InCanvasSelector.createByTitle('Multi selection - include');
        const sliderSelector4 = InCanvasSelector.createByTitle('Multi selection - exclude');

        await takeScreenshotByElement(sliderSelector1.getElement(), 'TC72038_01', 'Slider-Single selection-exclude', {
            tolerance: tolerance,
        });
        await takeScreenshotByElement(sliderSelector2.getElement(), 'TC72038_01', 'Slider-Single selection-include', {
            tolerance: tolerance,
        });
        await sliderSelector3.dragSlider({ x: 50, y: 0 });
        await takeScreenshotByElement(sliderSelector3.getElement(), 'TC72038_01', 'Slider-Multi selection-include', {
            tolerance: tolerance,
        });
        await takeScreenshotByElement(sliderSelector4.getElement(), 'TC72038_01', 'Slider-Multi selection-exclude', {
            tolerance: tolerance,
        });

        // check authoring format panel settings
        await libraryAuthoringPage.editDossierFromLibrary();
        await contentsPanel.goToPage({
            chapterName: 'New Selector Format',
            pageName: 'Slider',
        });
        // click on the ICS
        await sliderSelector4.getElement().click();
        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToTextAndFormTab();
        await takeScreenshotByElement(formatPanel.getTextAndFormContent(), 'TC72038_01', 'Format panel - Slider settings', {
            tolerance: tolerance,
        });
        await contentsPanel.dossierAuthoringPage.closeDossierWithoutSaving();
    });

    it('[TC72038_03] Verify in-canvas selector with new format in Library - Checkbox', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossier(dossier2.name);

        // Check checkbox
        await toc.openPageFromTocMenu({ chapterName: 'New Selector Format', pageName: 'Checkbox' });
        const checkboxSelector1 = InCanvasSelector.createByTitle('Category - exclude');
        const checkboxSelector2 = InCanvasSelector.createByTitle('Subcategory - include');
        await takeScreenshotByElement(checkboxSelector1.getElement(), 'TC72038_01', 'Checkbox-exclude', {
            tolerance: tolerance,
        });
        await takeScreenshotByElement(checkboxSelector2.getElement(), 'TC72038_01', 'Checkbox-include', {
            tolerance: tolerance,
        });

        // do search on checkbox and check rendering
        await checkboxSelector2.search('L');
        await takeScreenshotByElement(checkboxSelector2.getElement(), 'TC72038_01', 'Checkbox-include-search', {
            tolerance: tolerance,
        });

        // check authoring format panel settings
        await libraryAuthoringPage.editDossierFromLibrary();
        await contentsPanel.goToPage({
            chapterName: 'New Selector Format',
            pageName: 'Checkbox',
        });
        // click on the ICS
        await checkboxSelector1.getElement().click();
        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToTextAndFormTab();
        await takeScreenshotByElement(formatPanel.getTextAndFormContent(), 'TC72038_01', 'Format panel - Checkbox settings', {
            tolerance: tolerance,
        });
        await contentsPanel.dossierAuthoringPage.closeDossierWithoutSaving();
    });

    it('[TC72038_04] Verify in-canvas selector with new format in Library - Searchbox', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossier(dossier2.name);
        
        // check searchbox
        await toc.openPageFromTocMenu({ chapterName: 'New Selector Format', pageName: 'Searchbox' });
        const searchboxSelector1 = InCanvasSelector.createByTitle('Region - custom hint');  
        const searchboxSelector2 = InCanvasSelector.createByTitle('Subcategory - mandatory');
        await takeScreenshotByElement(searchboxSelector1.getElement(), 'TC72038_01', 'Searchbox-custom hint', {
            tolerance: tolerance,
        });
        await takeScreenshotByElement(searchboxSelector2.getElement(), 'TC72038_01', 'Searchbox-mandatory', {
            tolerance: tolerance,
        });

        // change selection and check rendering 
        await searchboxSelector1.searchSearchbox('a');
        await searchboxSelector1.selectSearchBoxItems(['Central'], false);
        await takeScreenshotByElement(searchboxSelector1.getSearchSuggest(), 'TC72038_01', 'Searchbox-search suggestion after selection', {   
            tolerance: tolerance,
        });
        await searchboxSelector1.dismissSuggestionList();
        await takeScreenshotByElement(searchboxSelector1.getElement(), 'TC72038_01', 'Searchbox-after selection', {
            tolerance: tolerance,
        });
        // check authoring format panel settings
        await libraryAuthoringPage.editDossierFromLibrary();
        await contentsPanel.goToPage({
            chapterName: 'New Selector Format',
            pageName: 'Searchbox',
        });
        // click on the ICS
        await searchboxSelector1.getElement().click();
        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToTextAndFormTab();
        await takeScreenshotByElement(formatPanel.getTextAndFormContent(), 'TC72038_01', 'Format panel - Searchbox settings', {
            tolerance: tolerance,
        });
        await contentsPanel.dossierAuthoringPage.closeDossierWithoutSaving();
    });

    it('[TC72038_05] Verify in-canvas selector with new format in Library - Radiobutton', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossier(dossier2.name);

        // check radiobutton
        await toc.openPageFromTocMenu({ chapterName: 'New Selector Format', pageName: 'Radiobutton' });
        const radiobuttonSelector1 = InCanvasSelector.createByTitle('Region - horizontal - exclude');
        const radiobuttonSelector2 = InCanvasSelector.createByTitle('Subcategory - vertical - include');
        await takeScreenshotByElement(radiobuttonSelector1.getElement(), 'TC72038_01', 'Radiobutton-include', {
            tolerance: tolerance,
        });
        await takeScreenshotByElement(radiobuttonSelector2.getElement(), 'TC72038_01', 'Radiobutton-exclude', {
            tolerance: tolerance,
        });

        await radiobuttonSelector2.search('b');
        await takeScreenshotByElement(radiobuttonSelector2.getElement(), 'TC72038_01', 'Radiobutton-exclude-search', {
            tolerance: tolerance,
        });

        // check authoring format panel settings
        await libraryAuthoringPage.editDossierFromLibrary();
        await contentsPanel.goToPage({
            chapterName: 'New Selector Format',
            pageName: 'Radiobutton',
        });
        // click on the ICS
        await radiobuttonSelector1.getElement().click();
        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToTextAndFormTab();
        await takeScreenshotByElement(formatPanel.getTextAndFormContent(), 'TC72038_01', 'Format panel - Radiobutton settings', {
            tolerance: tolerance,
        });
        await contentsPanel.dossierAuthoringPage.closeDossierWithoutSaving();
    });

    it('[TC72038_06] Verify in-canvas selector with new format in Library - Drop-down', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossier(dossier2.name);

        // check dropdown
        await toc.openPageFromTocMenu({ chapterName: 'New Selector Format', pageName: 'Drop-down' });
        const dropdownSelector1 = InCanvasSelector.createByTitle('Multi selection + fixed');
        const dropdownSelector2 = InCanvasSelector.createByTitle('Single selection + fixed 200');
        const dropdownSelector3 = InCanvasSelector.createByTitle('Multi selection + auto');
        const dropdownSelector4 = InCanvasSelector.createByTitle('Single selection + fixed 300');
        await takeScreenshotByElement(dropdownSelector1.getElement(), 'TC72038_01', 'Dropdown-Multi selection + fixed_selection', {
            tolerance: tolerance,
        });
        await takeScreenshotByElement(dropdownSelector2.getElement(), 'TC72038_01', 'Dropdown-Single selection + fixed_selection', {
            tolerance: tolerance,
        });
        await takeScreenshotByElement(dropdownSelector3.getElement(), 'TC72038_01', 'Dropdown-Multi selection + auto_selection', {
            tolerance: tolerance,
        });
        await takeScreenshotByElement(dropdownSelector4.getElement(), 'TC72038_01', 'Dropdown-Single selection + auto_selection', {
            tolerance: tolerance,
        });

        // take screenshot of the opened dropdown list
        await dropdownSelector1.openDropdownMenu();
        await takeScreenshotByElement(dropdownSelector1.getDropdownWidget(), 'TC72038_01', 'Dropdown-Multi selection + fixed_selection- dropdown list', {
            tolerance: tolerance,
        });
        await dropdownSelector1.clickDropdownBtn('Cancel');
        await dropdownSelector2.openDropdownMenu();
        await takeScreenshotByElement(dropdownSelector2.getDropdownWidget(), 'TC72038_01', 'Dropdown-Single selection + fixed_selection- dropdown list', {
            tolerance: tolerance,
        });
        await dropdownSelector2.openDropdownMenu();

        await dropdownSelector3.openDropdownMenu();
        await takeScreenshotByElement(dropdownSelector3.getDropdownWidget(), 'TC72038_01', 'Dropdown-Multi selection + auto_selection- dropdown list', {
            tolerance: tolerance,
        });
        await dropdownSelector3.clickDropdownBtn('Cancel');

        await dropdownSelector4.openDropdownMenu();
        await takeScreenshotByElement(dropdownSelector4.getDropdownWidget(), 'TC72038_01', 'Dropdown-Single selection + auto_selection- dropdown list', {
            tolerance: tolerance,
        });
        await dropdownSelector4.openDropdownMenu();

        // do search in dropdown and check rendering
        await dropdownSelector1.openDropdownMenu();
        await dropdownSelector1.searchInDropdown('b');
        await takeScreenshotByElement(dropdownSelector1.getDropdownWidget(), 'TC72038_01', 'Dropdown-Multi selection + fixed_selection- search in dropdown', {
            tolerance: tolerance,
        });
        await dropdownSelector1.clickDropdownBtn('Cancel');

        // check authoring format panel settings
        await libraryAuthoringPage.editDossierFromLibrary();
        await contentsPanel.goToPage({
            chapterName: 'New Selector Format',
            pageName: 'Drop-down',
        });
        // click on the ICS
        await dropdownSelector1.getElement().click();
        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToTextAndFormTab();
        await takeScreenshotByElement(formatPanel.getTextAndFormContent(), 'TC72038_01', 'Format panel - Drop-down settings', {
            tolerance: tolerance,
        });
        await contentsPanel.dossierAuthoringPage.closeDossierWithoutSaving();
    });

    it('[TC72038_07] Verify in-canvas selector with new format in Library - Metric Qualification and Metric Slider', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossier(dossier2.name);


        await toc.openPageFromTocMenu({ chapterName: 'New Selector Format', pageName: 'Metric Qualification' });
        const selector1 = SelectorObject.createByName('Profit with auto width big');
        const selector2 = SelectorObject.createByName('Cost with fixed width');
        const selector3 = SelectorObject.createByName('Revenue with auto width');
        const selector4 = SelectorObject.createByName('Profit with auto width small');

        await takeScreenshotByElement(selector1.metricQualification.getElement(), 'TC72038_01', 'Metric Qualification-auto width big_initial rendering', {
            tolerance: tolerance,
        });
        await takeScreenshotByElement(selector2.metricQualification.getElement(), 'TC72038_01', 'Metric Qualification-fixed width_initial rendering', {
            tolerance: tolerance,
        });
        await takeScreenshotByElement(selector3.metricQualification.getElement(), 'TC72038_01', 'Metric Qualification-auto width_initial rendering', {
            tolerance: tolerance,
        });
        await takeScreenshotByElement(selector4.metricQualification.getElement(), 'TC72038_01', 'Metric Qualification-auto width small_initial rendering', {
            tolerance: tolerance,
        });

        // change the operator to 'Does not equal' for selector2 and check rendering
        await selector2.metricQualification.selectDropdownOperation('Does not equal', false);
        await selector2.metricQualification.inputValueDirectly('45');
        await takeScreenshotByElement(selector2.metricQualification.getElement(), 'TC72038_01', 'Metric Qualification-fixed width_after changing operator and value', {
            tolerance: tolerance,
        });
        // change the operator to 'Between' for selector2 and check rendering
        await selector2.metricQualification.selectDropdownOperation('Between', false);
        await selector2.metricQualification.inputValueDirectly('1500000', 1);
        await selector2.metricQualification.inputValueDirectly('3000000', 2);
        await takeScreenshotByElement(selector2.metricQualification.getElement(), 'TC72038_01', 'Metric Qualification-fixed width_after changing operator to Between and values', {
            tolerance: tolerance,
        });

        // check the operator dropdown list items   
        await selector1.metricQualification.openDropdownOperation();
        await takeScreenshotByElement(selector1.metricQualification.getDropdown(), 'TC72038_01', 'Metric Qualification-auto width big_operator dropdown list', {
            tolerance: tolerance,
        });
        await selector3.metricQualification.openDropdownOperation();
        await takeScreenshotByElement(selector3.metricQualification.getDropdown(), 'TC72038_01', 'Metric Qualification-auto width_operator dropdown list', {
            tolerance: tolerance,
        });
        await selector4.metricQualification.openDropdownOperation();
        await takeScreenshotByElement(selector4.metricQualification.getDropdown(), 'TC72038_01', 'Metric Qualification-auto width small_operator dropdown list', {
            tolerance: tolerance,
        });

        // check authoring format panel settings
        await libraryAuthoringPage.editDossierFromLibrary();
        await contentsPanel.goToPage({
            chapterName: 'New Selector Format',
            pageName: 'Metric Qualification',
        });
        // click on the ICS
        await selector1.getElement().click();
        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToTextAndFormTab();
        await takeScreenshotByElement(formatPanel.getTextAndFormContent(), 'TC72038_01', 'Format panel - Metric Qualification settings', {
            tolerance: tolerance,
        });
        await contentsPanel.dossierAuthoringPage.closeDossierWithoutSaving(); 
    });

    it('[TC72038_08] Verify in-canvas selector with new format in Library - Metric Slider', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossier(dossier2.name);

        // check metric slider 
        await toc.openPageFromTocMenu({ chapterName: 'New Selector Format', pageName: 'Metric Slider' });
        const metricSliderSelector1 = InCanvasSelector.createByTitle('Cost_Value_Include');
        const metricSliderSelector2 = InCanvasSelector.createByTitle('Profit_Rank_Exclude');
        await takeScreenshotByElement(metricSliderSelector1.getElement(), 'TC72038_01', 'Metric Slider-Cost_Value_Include_initial rendering', {
            tolerance: tolerance,
        });
        await takeScreenshotByElement(metricSliderSelector2.getElement(), 'TC72038_01', 'Metric Slider-Profit_Rank_Exclude_initial rendering', {
            tolerance: tolerance,
        });

        await metricSliderSelector2.openDropdownMenu();
        await metricSliderSelector2.selectDropdownItems(['Highest %']);
        await metricSliderSelector2.openDropdownMenu();
        await takeScreenshotByElement(metricSliderSelector2.getDropdownWidget(), 'TC72038_01', 'Metric Slider-Profit_Rank_Exclude_operator dropdown list', {
            tolerance: tolerance,
        });
        // check authoring format panel settings
        await libraryAuthoringPage.editDossierFromLibrary();
        await contentsPanel.goToPage({
            chapterName: 'New Selector Format',
            pageName: 'Metric Slider',
        });
        // click on the ICS
        await metricSliderSelector1.getElement().click();
        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToTextAndFormTab();
        await takeScreenshotByElement(formatPanel.getTextAndFormContent(), 'TC72038_01', 'Format panel - Metric Slider value settings', {
            tolerance: tolerance,
        });
        await metricSliderSelector2.getElement().click();
        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToTextAndFormTab();
        await takeScreenshotByElement(formatPanel.getTextAndFormContent(), 'TC72038_01', 'Format panel - Metric Slider rank settings', {
            tolerance: tolerance,
        });
        await contentsPanel.dossierAuthoringPage.closeDossierWithoutSaving();
    });
});

export const config = specConfiguration;
