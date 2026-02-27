import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';
import { customCredentials } from '../../../constants/index.js';
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

describe('Incanvas Selector - LimitSource', () => {
    const dossier = {
        id: '7BAE05CB044CE7259D8D9DB325CAEBEF',
        name: '(AUTO) LimitElementSource_DifferentDS',
        project: tutorialProject,
    };

    let { libraryPage, toc, dossierPage, inCanvasSelector, grid, loginPage, filterPanel, checkboxFilter } = browsers.pageObj1;

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

    it('[TC97311_01] Validate LimitSource for ICS and Chapter Filter_No limit', async () => {

        // Check no limit source for ICS and filter
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'All' });
        const subcategorySelector = InCanvasSelector.createByTitle('Subcategory');
        const categorySelector = InCanvasSelector.createByTitle('Category');
        const yearSelector = InCanvasSelector.createByTitle('year');
        
        // check category and year ics options
        since('Category ICS options should be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.getItemsText())
            .toEqual(['(All)', 'Books', 'Electronics', 'Movies', 'Music']);
        since('Year ICS options should be #{expected}, instead we have #{actual}')
            .expect(await yearSelector.getItemsText())
            .toEqual(['2014', '2015', '2016', '2017']);
        await subcategorySelector.openDropdownMenu();
        since('subcategory ICS options number should be #{expected}, instead we have #{actual}')
            .expect(await subcategorySelector.getDropdownItemsCount())
            .toBe(25);
        await subcategorySelector.clickDropdownBtn('Cancel');

        // check filter options
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Year');
        await checkboxFilter.selectElementByName('2015');
        since('Year filter options count should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.getCheckBoxElementsCount())
            .toBe(2);
        await checkboxFilter.openSecondaryPanel('Quarter');
        since('Quarter filter options count should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.getCheckBoxElementsCount())
            .toBe(8);
        await checkboxFilter.selectElementByName('2015 Q1');
        await checkboxFilter.openSecondaryPanel('Subcategory');
        since('Subcategory filter options count should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.getCheckBoxElementsCount())
            .toBe(12);
        await filterPanel.apply();

        // check grid data
        since('Grid_allYear data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('DataSet_allYear', 2))
            .toEqual(['2015 Q2', 'Books', 'Art & Architecture', '$29,294']);
        since('Grid_2016 data should be #{expected}, instead we have #{actual}')
            .expect(await grid.isVizEmpty('DataSet_2016'))
            .toBe(true);
    

    });

    it('[TC97311_02] Validate LimitSource for ICS and Chapter Filter_limit allYear Dataset', async () => {

        // Check no limit source for ICS and filter
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Limit 2015' });
        const subcategorySelector = InCanvasSelector.createByTitle('Subcategory');
        const categorySelector = InCanvasSelector.createByTitle('Category');
        const yearSelector = InCanvasSelector.createByTitle('year');
        
        // check category and year ics options
        since('Category ICS options should be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.getItemsText())
            .toEqual(['(All)', 'Books', 'Electronics']);
        since('Year ICS options should be #{expected}, instead we have #{actual}')
            .expect(await yearSelector.getItemsText())
            .toEqual(['2014', '2015', '2016', '2017']);
        await subcategorySelector.openDropdownMenu();
        since('subcategory ICS options number should be #{expected}, instead we have #{actual}')
            .expect(await subcategorySelector.getDropdownItemsCount())
            .toBe(13);
        await subcategorySelector.clickDropdownBtn('Cancel');

        // change dataset parameter ics
        await yearSelector.selectItem('2016');

        // check filter options
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Year');
        await checkboxFilter.selectElementByName('2015');
        since('Year filter options count should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.getCheckBoxElementsCount())
            .toBe(1);
        await checkboxFilter.openSecondaryPanel('Quarter');
        since('Quarter filter options count should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.getCheckBoxElementsCount())
            .toBe(4);
        await checkboxFilter.selectElementByName('2015 Q1');
        await checkboxFilter.openSecondaryPanel('Subcategory');
        since('Subcategory filter options count should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.getCheckBoxElementsCount())
            .toBe(12);
        await checkboxFilter.selectElementByName('Cameras');
        await filterPanel.apply();
        await categorySelector.selectItem('Electronics');

        // check grid data
        since('Grid_allYear data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('DataSet_allYear', 2))
            .toEqual(['2015 Q2', 'Electronics', 'Audio Equipment', '$232,901']);
        since('Grid_2016 data should be #{expected}, instead we have #{actual}')
            .expect(await grid.isVizEmpty('DataSet_2016'))
            .toBe(true);
        
        // make changes to show 2016 data
        await yearSelector.selectItem('2016');
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Year');
        await checkboxFilter.selectElementByName('2016');
        await checkboxFilter.openSecondaryPanel('Quarter');
        await checkboxFilter.selectElementByName('2016 Q1');
        await filterPanel.apply();
        since('Grid_2016 data after show year 2016 should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('DataSet_2016', 2))
            .toEqual(['2016 Q1', 'Electronics', 'Cameras', '$341,833']);
        
        // check allYear source for ICS and filter
        await yearSelector.multiSelect(['2014', '2015', '2016']);
        // check category and year ics options
        since('Category ICS options should be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.getItemsText())
            .toEqual(['(All)']);
        await subcategorySelector.openDropdownMenu();
        since('subcategory ICS options number should be #{expected}, instead we have #{actual}')
            .expect(await subcategorySelector.getDropdownItemsCount())
            .toBe(1);
        await subcategorySelector.clickDropdownBtn('Cancel');
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Year');
        since('Year filter options should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.getCheckBoxElementsText())
            .toEqual(['2014']);
        await checkboxFilter.openSecondaryPanel('Quarter');
        since('Quarter filter options should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.getCheckBoxElementsText())
            .toEqual(['2014 Q1', '2014 Q2', '2014 Q3', '2014 Q4']);
        await checkboxFilter.openSecondaryPanel('Subcategory');
        since('Subcategory filter options should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.getCheckBoxElementsText())
            .toEqual(['Art & Architecture', 'Business', 'Literature', 'Books - Miscellaneous', 'Science & Technology',
            'Sports & Health', 'Audio Equipment', 'Cameras' , 'Computers', 'Electronics - Miscellaneous', "TV's", 'Video Equipment']);


    });

    it('[TC97311_03] Validate LimitSource for ICS and Chapter Filter_limit 2016 Dataset', async () => {

        // Check no limit source for ICS and filter
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 3', pageName: 'Limit 2016' });
        const subcategorySelector = InCanvasSelector.createByTitle('Subcategory');
        const categorySelector = InCanvasSelector.createByTitle('Category');
        const yearSelector = InCanvasSelector.createByTitle('year');
        
        // check category and year ics options
        since('Category ICS options should be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.getItemsText())
            .toEqual(['(All)', 'Books', 'Electronics', 'Movies', 'Music']); 
        since('Year ICS options should be #{expected}, instead we have #{actual}')
            .expect(await yearSelector.getItemsText())
            .toEqual(['2014', '2015', '2016', '2017']);
        await subcategorySelector.openDropdownMenu();
        since('subcategory ICS options number should be #{expected}, instead we have #{actual}')
            .expect(await subcategorySelector.getDropdownItemsCount())
            .toBe(25);
        await subcategorySelector.clickDropdownBtn('Cancel');

        // change dataset parameter ics
        await yearSelector.selectItem('2016');

        // check filter options
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Year');
        await checkboxFilter.selectElementByName('2015');
        await checkboxFilter.openSecondaryPanel('Quarter');
        since('Quarter filter options count should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.getCheckBoxElementsText())
            .toEqual(['2016 Q1', '2016 Q2', '2016 Q3', '2016 Q4']);
        await filterPanel.apply();
        
        // check grid data and ICS options
        since('Category ICS options should be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.getItemsText())
            .toEqual(['(All)']);
        await subcategorySelector.openDropdownMenu();
        since('subcategory ICS options number should be #{expected}, instead we have #{actual}')
            .expect(await subcategorySelector.getDropdownItemsCount())
            .toBe(1);
        await subcategorySelector.clickDropdownBtn('Cancel');
        since('Grid_2016 data should be #{expected}, instead we have #{actual}')
            .expect(await grid.isVizEmpty('DataSet_2016'))
            .toBe(true);
        
        // make changes to show 2016 data
        await yearSelector.multiSelect([ '2015', '2016']);
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Year');
        await checkboxFilter.selectElementByName('2016');
        await checkboxFilter.openSecondaryPanel('Subcategory');
        await checkboxFilter.selectElementByName('Computers');
        await filterPanel.apply();
        since('Grid_2016 data after show year 2016 should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('DataSet_2016', 2))
            .toEqual(['2016 Q1', 'Electronics', 'Computers', '$136,683']);
        since('Grid_allYear data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('DataSet_allYear', 2))
            .toEqual(['2016 Q1', 'Books', 'Art & Architecture', '$31,689']);

        
        // check parameter ICS and filter selections are global
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Limit 2015' });
        since('year ICS selected options should be #{expected}, instead we have #{actual}')
            .expect(await yearSelector.getSelectedItemsText())
            .toEqual(['2016']);
        since('category selected ICS options should be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.getSelectedItemsText())
            .toEqual([]);
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Year');
        await checkboxFilter.toggleViewSelectedOptionOn();
        since ('Year filter selected options should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.getCheckBoxElementsText())
            .toEqual(['2016']);
        await checkboxFilter.openSecondaryPanel('Subcategory');
        await checkboxFilter.toggleViewSelectedOptionOn();
        since ('Subcategory filter selected options should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.getCheckBoxElementsText())
            .toEqual(['Computers']);
        await filterPanel.closeFilterPanel();
        
        // swith to chapter1 
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'All' });
        since('year ICS selected options in chapter1 should be #{expected}, instead we have #{actual}')
            .expect(await yearSelector.getSelectedItemsText())
            .toEqual(['2016']);
        since('category selected ICS options in chapter1 should be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.getSelectedItemsText())
            .toEqual(['Books', 'Electronics']);

    });

    it('[TC97311_04] Validate LimitSource for ICS and Chapter Filter_Linking', async () => {

        // change filter panel options
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 4', pageName: 'Limit 2016_Linking' });
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Year');
        await checkboxFilter.selectElementByName('2016');
        await checkboxFilter.openSecondaryPanel('Quarter');
        await checkboxFilter.selectElementByName('2016 Q1');
        await checkboxFilter.openSecondaryPanel('Subcategory');
        await checkboxFilter.selectElementByName('Computers');
        await filterPanel.apply();
        
        // do linking and check filter options
        await grid.linkToTargetByGridContextMenu({
            title: 'DataSet_2016',
            headerName: 'Category',
            elementName: 'Electronics',
        });
        await dossierPage.switchToTab(1);
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Year');
        await checkboxFilter.toggleViewSelectedOptionOn();
        since('Year filter selected options should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.getCheckBoxElementsText())
            .toEqual(['2016']);
        await checkboxFilter.openSecondaryPanel('Quarter');
        await checkboxFilter.toggleViewSelectedOptionOn();
        since('Quarter filter selected options should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.getCheckBoxElementsText())
            .toEqual(['2016 Q1']);
        await checkboxFilter.openSecondaryPanel('Subcategory');
        await checkboxFilter.toggleViewSelectedOptionOn();
        since('Subcategory filter selected options should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.getCheckBoxElementsText())
            .toEqual(['Computers']);
        await filterPanel.closeFilterPanel();
        await dossierPage.closeTab(1);


    });

    
});
export const config = specConfiguration;
