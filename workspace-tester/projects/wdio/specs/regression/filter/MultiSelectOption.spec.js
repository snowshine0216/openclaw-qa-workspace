import { customCredentials, browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';

const specConfiguration = { ...customCredentials('_filter') };

describe('Function test for Multi Select Option', () => {
    const { credentials } = specConfiguration;

    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const dossier = {
        id: 'EB97C7F8486D0DF1C70D9183D9F1CF17',
        name: '(Auto) Multi Selection',
        project: project,
    };

    let {
        loginPage,
        libraryPage,
        toc,
        grid,
        filterPanel,
        searchBoxFilter,
        checkboxFilter,
        dossierPage,
        filterSummaryBar,
        attributeSlider,
    } = browsers.pageObj1;

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

    it('[TC99124_01] Verify Functionality of Multi Select Option - Normal Grid', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'E2E', pageName: 'Normal Grid' });
        await filterPanel.openFilterPanel();
        await filterPanel.clickAddFilterButton();
        await takeScreenshotByElement(filterPanel.getAddFilterMenu(), 'TC9999_01', 'Add Filter Menu');
        await filterPanel.selectFilterItems(['Category', 'Category(Link)']);
        await filterPanel.clickAddFilterMenuButton('Add');
        await since('Filter Panel should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterContainers())
            .toEqual(['Category', 'Category(Link)']);
        await checkboxFilter.openSecondaryPanel('Category');
        let isSearchBox = await searchBoxFilter.fSearch.getEmptySearchImage().isDisplayed();
        console.log('isSearchBox', isSearchBox);
        if (isSearchBox) {
            await searchBoxFilter.search('Music');
            await searchBoxFilter.selectElementByName('Music');
        } else {
            await checkboxFilter.selectElementByName('Music');
        }
        await filterPanel.apply();
        await since('First Row in Grid should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('AttributeOnRow', 2))
            .toEqual(['Music', 'Alternative', '$696,977']);
        await grid.selectGridContextMenuOption({
            title: 'AttributeOnRow',
            headerName: 'Subcategory',
            firstOption: 'Add as Filter Option',
        });
        await filterPanel.openFilterPanel();
        await since('Filter Panel should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterContainers())
            .toEqual(['Category', 'Category(Link)', 'Subcategory']);
        await checkboxFilter.openSecondaryPanel('Subcategory');
        await checkboxFilter.selectElementByName('Pop');
        await filterPanel.apply();
        await since('First Row in Grid should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('AttributeOnRow', 2))
            .toEqual(['Music', 'Pop', '$668,083']);
    });

    it('[TC99124_02] Verify Functionality of Multi Select Option - Compound Grid', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'E2E', pageName: 'Compound Grid' });
        await grid.openGridElmContextMenu({
            title: 'AttributeOnRow',
            headerName: 'Category',
        });
        await since('Add as Filter Option Context Menu Present should be #{expected}, instead we have #{actual}')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Add as Filter Option' }))
            .toBe(true);
        await grid.openGridElmContextMenu({
            title: 'AttributeOnRow',
            headerName: 'Profit',
        });
        await since('Add as Filter Option Context Menu Present should be #{expected}, instead we have #{actual}')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Add as Filter Option' }))
            .toBe(false);
        await grid.openGridElmContextMenu({
            title: 'MetricOnRow',
            headerName: 'Metrics',
            elementName: 'Profit',
        });
        await since('Add as Filter Option Context Menu Present should be #{expected}, instead we have #{actual}')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Add as Filter Option' }))
            .toBe(false);
    });

    it('[TC99124_03] Verify Functionality of Multi Select Option - Modern Grid', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'E2E', pageName: 'Modern Grid' });
        await grid.openGridElmContextMenu({
            title: 'AttributeOnRow',
            headerName: 'Category',
            agGrid: true,
        });
        await since('Add as Filter Option Context Menu Present should be #{expected}, instead we have #{actual}')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Add as Filter Option' }))
            .toBe(true);
        await grid.openGridElmContextMenu({
            title: 'AttributeOnRow',
            headerName: 'Profit Trend by Subcategory',
            agGrid: true,
        });
        await since('Add as Filter Option Context Menu Present should be #{expected}, instead we have #{actual}')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Add as Filter Option' }))
            .toBe(false);
        await grid.selectGridContextMenuOption({
            title: 'MetricOnRow',
            headerName: 'Category',
            firstOption: 'Add as Filter Option',
            agGrid: true,
        });
        await filterPanel.openFilterPanel();
        await since('Filter Panel should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterContainers())
            .toEqual(['Category']);
    });

    it('[TC99124_04] Verify Functionality of Multi Select Option - UndoRedo', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'E2E', pageName: 'Modern Grid' });
        await toc.openPageFromTocMenu({ chapterName: 'E2E', pageName: 'Normal Grid' });
        await filterPanel.openFilterPanel();
        await filterPanel.clickAddFilterButton();
        await filterPanel.selectFilterItems(['Category', 'Category(Link)']);
        await filterPanel.clickAddFilterMenuButton('Add');
        await since('Filter Panel should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterContainers())
            .toEqual(['Category', 'Category(Link)']);
        await dossierPage.clickUndo();
        await since('Filter Panel Empty should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterPanelEmpty())
            .toBe(true);
        await dossierPage.clickRedo();
        await since('Filter Panel should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterContainers())
            .toEqual(['Category', 'Category(Link)']);
        await checkboxFilter.openSecondaryPanel('Category');
        let isSearchBox = await searchBoxFilter.fSearch.getEmptySearchImage().isDisplayed();
        console.log('isSearchBox', isSearchBox);
        if (isSearchBox) {
            await searchBoxFilter.search('Electronics');
            await searchBoxFilter.selectElementByName('Electronics');
        } else {
            await checkboxFilter.selectElementByName('Electronics');
        }
        await filterPanel.apply();
        await since('Filter Summary should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Category'))
            .toBe('(Electronics)');
        await grid.selectGridContextMenuOption({
            title: 'AttributeOnRow',
            headerName: 'Subcategory',
            firstOption: 'Add as Filter Option',
        });
        await filterPanel.openFilterPanel();
        await since('Filter Panel should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterContainers())
            .toEqual(['Category', 'Category(Link)', 'Subcategory']);
        await dossierPage.clickUndo();
        await since('Filter Panel should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterContainers())
            .toEqual(['Category', 'Category(Link)']);
        await dossierPage.clickUndo();
        await since('Clear All Filters, filter summary should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('No filter selections');
        await dossierPage.clickUndo();
        await since('Filter Panel should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterPanelEmpty())
            .toBe(true);
    });

    it('[TC99124_05] Verify Functionality of Multi Select Option - Object Parameter', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Regression', pageName: 'Object Parameter' });
        await filterPanel.openFilterPanel();
        await filterPanel.clickAddFilterButton();
        await filterPanel.selectFilterItems(['Category', 'Year']);
        await filterPanel.clickAddFilterMenuButton('Add');
        await since('Filter Panel should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterContainers())
            .toEqual(['Cost', 'Category', 'Year']);
        await checkboxFilter.openSecondaryPanel('Category');
        let isSearchBox = await searchBoxFilter.fSearch.getEmptySearchImage().isDisplayed();
        console.log('isSearchBox', isSearchBox);
        if (isSearchBox) {
            await searchBoxFilter.search('Electronics');
            await searchBoxFilter.selectElementByName('Electronics');
        } else {
            await checkboxFilter.selectElementByName('Electronics');
        }
        await attributeSlider.dragAndDropHandle('Year', 50);
        await filterPanel.apply();
        await since('Filter Summary should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Category'))
            .toBe('(Electronics)');
        await since('Filter Summary should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Year'))
            .toBe('(2014 - 2016)');
        const dashboardAttribute = InCanvasSelector.createByTitle('Dashboard Attribute');
        await dashboardAttribute.selectItem('Category');
        const datasetAttribute = InCanvasSelector.createByTitle('Attr');
        await datasetAttribute.selectItem('Year');
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();
        await since('Filter Panel should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterContainers())
            .toEqual(['Cost', 'Category']);
    });

    it('[TC99124_06] Verify Functionality of Multi Select Option - Mobile View', async () => {
        await setWindowSize({
            browserInstance: browsers.browser1,
            width: 400,
            height: 800,
        });
        await libraryPage.hamburgerMenu.openHamburgerMenu();
        await libraryPage.hamburgerMenu.clickOptionInMobileView('Filter');
        await takeScreenshotByElement(
            libraryPage.hamburgerMenu.getSliderMenuContainer(),
            'TC99124_05',
            'Mobile View - No Filters'
        );
        await libraryPage.hamburgerMenu.clickAddFilterButtonInMobileView();
        await takeScreenshotByElement(
            libraryPage.hamburgerMenu.getSliderMenuContainer(),
            'TC99124_05',
            'Mobile View - Attribute List'
        );
        await libraryPage.hamburgerMenu.closeHamburgerMenu();

        await setWindowSize(browserWindow);
        await toc.openPageFromTocMenu({ chapterName: 'E2E', pageName: 'Normal Grid' });
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(
            filterPanel.getFilterPanelWrapper(),
            'TC99124_05',
            'Web View - Filter Panel With No Filter'
        );
        await filterPanel.clickAddFilterButton();
        await takeScreenshotByElement(filterPanel.getAddFilterMenu(), 'TC99124_05', 'Web View - Add Filter Menu');
    });
});
