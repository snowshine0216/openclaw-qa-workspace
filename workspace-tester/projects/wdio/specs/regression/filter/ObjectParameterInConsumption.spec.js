import { customCredentials, browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_authoring') };

describe('Function test for Object Parameter', () => {
    const { credentials } = specConfiguration;

    const dossierConsumption = {
        id: '7F3774464A335876B32BA88380852EF3',
        name: '(Auto) Object Parameter In Consumption',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    let {
        loginPage,
        libraryPage,
        dossierPage,
        toc,
        filterPanel,
        checkboxFilter,
        radiobuttonFilter,
        filterSummaryBar,
        advancedSort,
        grid,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossierConsumption,
        });
        await libraryPage.openDossier(dossierConsumption.name);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC99381_01] Verify Functionality of Object Parameter in Consumption - Incanvas Selector', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Grid Template', pageName: 'Normal Grid' });
        const datasetAttribute = InCanvasSelector.createByTitle('DatasetAttribute');
        await datasetAttribute.selectItem('Subcategory');
        const datasetMetric = InCanvasSelector.createByTitle('DatasetMetric');
        await datasetMetric.selectItem('Unit Cost');
        const dashboardAttribute = InCanvasSelector.createByTitle('DashboardAttribute');
        await dashboardAttribute.selectItem('Quarter');
        const dashboardMetric = InCanvasSelector.createByTitle('DashboardMetric');
        await dashboardMetric.selectItem('Cost');
        await since('For Normal Grid with Dataset OP, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneColumnData('Normal Grid - Dataset OP', 'Category'))
            .toEqual(['Subcategory', 'Unit Cost', 'Revenue']);
        await since('For Normal Grid with Dashboard OP, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Normal Grid - Dashboard OP', 1))
            .toEqual(['Year', 'Quarter', 'Cost']);
        await since('For Normal Grid with No OP, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Normal Grid - No OP', 1))
            .toEqual(['Year', '2014', '2015', '2016']);

        await toc.openPageFromTocMenu({ chapterName: 'Grid Template', pageName: 'Compound Grid' });
        await since('For dashboardAttribute OP, selected item should be #{expected}, instead we have #{actual}')
            .expect(await dashboardAttribute.getSelectedItemsText())
            .toEqual(['Quarter', 'Year']);
        await since('For dashboardMetric OP, selected item should be #{expected}, instead we have #{actual}')
            .expect(await dashboardMetric.getSelectedItemsText())
            .toEqual(['Cost']);
        await since('For Compound Grid with Dataset OP, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Compound Grid - Dataset OP', 1))
            .toEqual(['Year', 'Category', 'Subcategory', 'Unit Cost', 'Revenue']);
        await since(
            'For CompoundGrid with Dashboard OP, OneColumndata should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.getOneColumnData('Compound Grid - Dashboard OP', 'Quarter'))
            .toEqual(['Year', 'Cost']);
        await since('For Compound Grid with No OP, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Compound Grid - No OP', 1))
            .toEqual(['Year', 'Profit']);

        await toc.openPageFromTocMenu({ chapterName: 'Grid Template', pageName: 'Modern Grid' });
        await since('For datasetAttribute OP, selected item should be #{expected}, instead we have #{actual}')
            .expect(await datasetAttribute.getSelectedItemsText())
            .toEqual(['Category', 'Subcategory']);
        await since('For datasetMetric OP, selected item should be #{expected}, instead we have #{actual}')
            .expect(await datasetMetric.getSelectedItemsText())
            .toEqual(['Unit Cost', 'Revenue']);
        await since('For Modern Grid with Dataset OP, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getHeaderText('Modern Grid - Dataset OP', 1, true))
            .toEqual(['Year', 'Category', 'Subcategory', 'Unit Cost', 'Revenue']);
        await since('For Modern Grid with Dashboard OP, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getHeaderText('Modern Grid - Dashboard OP', 1, true))
            .toEqual(['Quarter', 'Year', 'Cost']);
        await since('For Modern Grid with No OP, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getHeaderText('Modern Grid - No OP', 1, true))
            .toEqual(['Year', 'Profit']);

        await toc.openPageFromTocMenu({ chapterName: 'Grid Template', pageName: 'Normal Grid' });
        // unset ics
        await dashboardAttribute.openContextMenu();
        await dashboardAttribute.selectOptionInMenu('Reset');
        await since('After reset to default, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Normal Grid - Dashboard OP', 1))
            .toEqual(['Year', 'Cost']);
        await since('After reset to default, Unit Cost Selected should be #{expected}, instead we have #{actual}')
            .expect(await dashboardAttribute.isItemSelected('Quarter'))
            .toBe(false);
        await since('After reset to default, Revenue Selected should be #{expected}, instead we have #{actual}')
            .expect(await dashboardAttribute.isItemSelected('Year'))
            .toBe(false);
    });

    it('[TC99381_02] Verify Functionality of Object Parameter in Consumption - Filter Panel', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Global Filter', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('DashboardAttribute');
        await checkboxFilter.selectAll();
        await checkboxFilter.openSecondaryPanel('DashboardMetric');
        await radiobuttonFilter.selectElementByName('Cost');
        await checkboxFilter.openSecondaryPanel('DatasetAttribute');
        await checkboxFilter.selectElementByName('Subcategory');
        await checkboxFilter.openContextMenu('DatasetMetric');
        await since('For OP, Exclude context menu exist should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.isContextMenuOptionPresent('Exclude'))
            .toBe(false);
        await checkboxFilter.selectContextMenuOption('DatasetMetric', 'Clear');
        await filterPanel.apply();

        // filter summary bar
        await since('DashboardAttribute Filter is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DashboardAttribute'))
            .toBe('(Day, Quarter, +2)');
        await since('DashboardMetric Filter is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DashboardMetric'))
            .toBe('(Cost)');
        await since('DatasetAttribute Filter is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DatasetAttribute'))
            .toBe('(Category, Subcategory)');

        // Grid
        await since('For Normal Grid, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Normal Grid', 1))
            .toEqual(['Day', 'Quarter', 'Year', 'Year(Group)', 'Category', 'Subcategory', 'Cost']);
        await since('For Compound Grid, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Compound Grid', 1))
            .toEqual(['Day', 'Quarter', 'Year', 'Year(Group)', 'Category', 'Subcategory', 'Cost']);
        await since('For Compound Grid, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getHeaderText('Modern Grid', true))
            .toEqual(['Day', 'Quarter', 'Year', 'Year(Group)', 'Category', 'Subcategory', 'Cost']);

        // Global Filter
        await toc.openPageFromTocMenu({ chapterName: 'Grid Template', pageName: 'Modern Grid' });
        await since('For GridTemplate, DashboardAttribute is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DashboardAttribute'))
            .toBe('(Day, Quarter, +2)');
        await since('For GridTemplate, DashboardMetric is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DashboardMetric'))
            .toBe('(Cost)');
        await since('For GridTemplate, DatasetAttribute is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DatasetAttribute'))
            .toBe('(Category, Subcategory)');

        await filterPanel.openFilterPanel();
        await filterPanel.clearAllFilters();
        await filterPanel.apply();
        await since('After clear all filters, filter summary is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('No filter selections');
    });

    it('[TC99381_03] Verify Functionality of Object Parameter in Consumption - Add the newly added objects into filter panel', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Grid Template', pageName: 'Normal Grid' });
        const datasetAttribute = InCanvasSelector.createByTitle('DatasetAttribute');
        await datasetAttribute.selectItem('Subcategory');
        const datasetMetric = InCanvasSelector.createByTitle('DatasetMetric');
        await datasetMetric.selectItem('Unit Cost');

        await filterPanel.openFilterPanel();
        await filterPanel.clickAddFilterButton();
        await since('Filter Item should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.filterItemText())
            .toEqual(['Category', 'Day', 'Quarter', 'Subcategory', 'Year']);
        await filterPanel.selectFilterItems(['Subcategory']);
        await filterPanel.clickAddFilterMenuButton('Add');
        await dossierPage.hoverOnLibraryIcon();
        await checkboxFilter.openSecondaryPanel('Subcategory');
        await checkboxFilter.selectElementByName('Business');
        await filterPanel.apply();

        await since('For Normal Grid, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Normal Grid - Dataset OP', 1))
            .toEqual(['Category', 'Books']);
        await since('For Normal Grid, Second row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Normal Grid - Dataset OP', 2))
            .toEqual(['Subcategory', 'Business']);

        await datasetAttribute.selectItem('Subcategory');
        await since('After unselect, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Normal Grid - Dataset OP', 1))
            .toEqual(['Category', 'Books', 'Electronics', 'Movies', 'Music']);
        await since('For GridTemplate, DashboardAttribute is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Subcategory'))
            .toBe('(Business)');
        await dossierPage.reload();
        await filterPanel.openFilterPanel();
        await since('Filter Item should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterDisplayedInFilterPanel('Subcategory'))
            .toBe(false);
        await filterPanel.closeFilterPanelByCloseIcon();
    });

    it('[TC99381_04] Verify Functionality of Object Parameter in Consumption - Sort on Attribute OP in Modern Grid', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Grid Template', pageName: 'Modern Grid' });

        // sort on attribute OP
        await grid.selectGridContextMenuOption({
            title: 'Modern Grid - Dataset OP',
            headerName: 'Category',
            firstOption: 'Sort Descending',
            agGrid: true,
        });
        await since('After sort, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Modern Grid - Dataset OP', 1, true))
            .toEqual(['2014', 'Music', '$956,610']);
        // when there are multiple selections for an OP, sort on grid will only sort itself instead of the OP.
        // For example, an OP has Year and Quarter selected, in Grid, sort on Year will sort on Year itself.
        // But if it only has Year selected, sort on Year will sort on the OP, which means if it changes selection to Quarter, Quarter will still have the sort.
        // Advanced sort is not affected, we just sort on the one we choose.
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('DatasetAttribute');
        await checkboxFilter.uncheckElementByName('Category');
        await checkboxFilter.selectElementByName('Subcategory');
        await filterPanel.apply();
        await since('After add OP selection, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Modern Grid - Dataset OP', 1, true))
            .toEqual(['2014', 'Video Equipment', '$1,254,030']);

        // advanced sort
        await grid.selectGridContextMenuOption({
            title: 'Modern Grid - Dataset OP',
            headerName: 'Subcategory',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await since('Sort by item should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe('DatasetAttribute');
        await advancedSort.openSortByDropdown(1);
        await since('Sort on Columns, the sort by item count should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getSortByListItemsCount())
            .toBe(6);
        await advancedSort.selectSortByDropdownItem('DatasetMetric');
        await advancedSort.openOrderDropdown(1);
        await advancedSort.save();
        await since('After Advanced sort, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Modern Grid - Dataset OP', 1, true))
            .toEqual(['Video Equipment', '$2,149,710']);

        const dashboardAttribute = InCanvasSelector.createByTitle('DashboardAttribute');
        await dashboardAttribute.selectItem('Quarter');
        await grid.selectGridContextMenuOption({
            title: 'Modern Grid - Dashboard OP',
            headerName: 'Year',
            firstOption: 'Sort Descending',
            agGrid: true,
        });
        await since('After sort, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Modern Grid - Dashboard OP', 1, true))
            .toEqual(['2016 Q1', '2016', '$549,010']);
        await grid.selectGridContextMenuOption({
            title: 'Modern Grid - Dashboard OP',
            headerName: 'Year',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await since('Sort by item should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe('Year');
        await advancedSort.save();
        await dashboardAttribute.selectItem('Year(Group)');
        await since('After sort, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Modern Grid - Dashboard OP', 1, true))
            .toEqual(['2016 Q1', '2016', '2016', '$549,010']);
        await grid.selectGridContextMenuOption({
            title: 'Modern Grid - Dashboard OP',
            headerName: 'Year(Group)',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await since('Sort by item should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe('Year');
        await advancedSort.save();
    });

    it('[TC99381_05] Verify Functionality of Object Parameter in Consumption - Sort on Metric OP in Modern Grid', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Grid Template', pageName: 'Modern Grid' });
        // single select
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('DashboardAttribute');
        await checkboxFilter.selectElementByName('Quarter');
        await filterPanel.apply();

        await grid.selectGridContextMenuOption({
            title: 'Modern Grid - Dashboard OP',
            headerName: 'Profit',
            firstOption: 'Sort Within',
            agGrid: true,
        });
        await since('After sort within, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Modern Grid - Dashboard OP', 1, true))
            .toEqual(['2016 Q4', '2016', '$615,823']);
        await since('After Sort within, second row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Modern Grid - Dashboard OP', 2, true))
            .toEqual(['2016 Q3', '2016', '$571,770']);

        await grid.selectGridContextMenuOption({
            title: 'Modern Grid - Dashboard OP',
            headerName: 'Profit',
            firstOption: 'Sort All Values',
            agGrid: true,
        });
        await since('After Sort All Values, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Modern Grid - Dashboard OP', 1, true))
            .toEqual(['2016 Q4', '2016', '$615,823']);
        await since('After Sort All Values, second row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Modern Grid - Dashboard OP', 2, true))
            .toEqual(['2016 Q3', '2016', '$571,770']);

        await grid.selectGridContextMenuOption({
            title: 'Modern Grid - Dashboard OP',
            headerName: 'Profit',
            firstOption: 'Sort Within an Attribute',
            secondOption: 'Quarter',
            agGrid: true,
        });
        await since('After Sort Within, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Modern Grid - Dashboard OP', 1, true))
            .toEqual(['2014 Q1', '2014', '$297,427']);
        await since('After Sort Within, second row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Modern Grid - Dashboard OP', 2, true))
            .toEqual(['2014 Q2', '2014', '$294,232']);

        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('DashboardMetric');
        await radiobuttonFilter.selectElementByName('Cost');
        await filterPanel.apply();
        await since('After change op selection, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Modern Grid - Dashboard OP', 1, true))
            .toEqual(['2014 Q1', '2014', '$1,385,229']);
        await grid.selectGridContextMenuOption({
            title: 'Modern Grid - Dashboard OP',
            headerName: 'Cost',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await since('Sort by item should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe('DashboardMetric');
        await advancedSort.save();

        // multi selection
        const datasetMetric = InCanvasSelector.createByTitle('DatasetMetric');
        await datasetMetric.selectItem('Unit Cost');
        await grid.selectGridContextMenuOption({
            title: 'Modern Grid - Dataset OP',
            headerName: 'Revenue',
            firstOption: 'Sort Within',
            agGrid: true,
        });
        await since('After sort within, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Modern Grid - Dataset OP', 1, true))
            .toEqual(['Electronics', '$ 242', '$6,027,843']);
        await since('After sort within, second row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Modern Grid - Dataset OP', 2, true))
            .toEqual(['Movies', '$ 13', '$1,012,594']);

        await grid.selectGridContextMenuOption({
            title: 'Modern Grid - Dataset OP',
            headerName: 'Revenue',
            firstOption: 'Sort All Values',
            agGrid: true,
        });
        await since('After Sort All Values, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Modern Grid - Dataset OP', 1, true))
            .toEqual(['2016', 'Electronics', '$ 242', '$10,342,798']);
        await since('After Sort All Values, second row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Modern Grid - Dataset OP', 2, true))
            .toEqual(['2015', 'Electronics', '$ 243', '$8,020,662']);

        await grid.selectGridContextMenuOption({
            title: 'Modern Grid - Dataset OP',
            headerName: 'Revenue',
            firstOption: 'Sort Within an Attribute',
            secondOption: 'Year',
            agGrid: true,
        });
        await since('After Sort Within, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Modern Grid - Dataset OP', 1, true))
            .toEqual(['Electronics', '$ 242', '$6,027,843']);
        await since('After Sort Within, second row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Modern Grid - Dataset OP', 2, true))
            .toEqual(['Movies', '$ 13', '$1,012,594']);

        await grid.selectGridContextMenuOption({
            title: 'Modern Grid - Dataset OP',
            headerName: 'Unit Cost',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await since('Sort by item should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe('Revenue');
        await advancedSort.save();

        await grid.selectGridContextMenuOption({
            title: 'Modern Grid - Dataset OP',
            headerName: 'Unit Cost',
            firstOption: 'Sort with Subtotals',
            agGrid: true,
        });
        await since('After Sort with Subtotals, One row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Modern Grid - Dataset OP', 1, true))
            .toEqual(['Electronics', '$ 242', '$6,027,843']);
        await since('After Sort with Subtotals, second row data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Modern Grid - Dataset OP', 2, true))
            .toEqual(['Movies', '$ 13', '$1,012,594']);
    });

    it('[TC99381_06] Verify Functionality of Object Parameter in Consumption - Show Data', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Grid Template', pageName: 'Normal Grid' });
        await grid.selectShowDataOnVisualizationMenu('Normal Grid - No OP');
        await grid.showDataDialog.clickAddDataButton();
        await since('For Normal Grid with no OP, Attr Add data list should be #{expected}, instead we have #{actual}')
            .expect(await grid.showDataDialog.getAddDataList('Attributes'))
            .toEqual(['(All)', 'Day', 'Quarter', 'Year(Group)']);
        await since('For Normal Grid with no OP, Metr Add data list should be #{expected}, instead we have #{actual}')
            .expect(await grid.showDataDialog.getAddDataList('Metrics'))
            .toEqual(['(All)', 'Cost', 'Profit', 'Row Count']);
        await grid.showDataDialog.addElementToDataset({ title: 'Metrics', elem: 'Profit' });
        await grid.showDataDialog.clickAddDataOkButton();
        await dossierPage.waitForPageLoading();
        await since('For Normal Grid, Column Header should be #{expected}, instead we have #{actual}')
            .expect(await grid.showDataDialog.getHeadersInshowDataGrid())
            .toEqual(['Year', 'Revenue', 'Profit']);
        await grid.showDataDialog.clickShowDataCloseButton();

        await toc.openPageFromTocMenu({ chapterName: 'Grid Template', pageName: 'Compound Grid' });
        await grid.selectShowDataOnVisualizationMenu('Compound Grid - No OP');
        await grid.showDataDialog.clickAddDataButton();
        await grid.showDataDialog.addElementToDataset({ title: 'Attributes', elem: 'Year(Group)' });
        await since('For Compound Grid with Dataset OP, Attr list should be #{expected}, instead we have #{actual}')
            .expect(await grid.showDataDialog.getAddDataList('Attributes'))
            .toEqual(['(All)', 'Day', 'Quarter', 'Year(Group)']);
        await since('For Compound Grid with Dataset OP, Metr list should be #{expected}, instead we have #{actual}')
            .expect(await grid.showDataDialog.getAddDataList('Metrics'))
            .toEqual(['(All)', 'Cost', 'Profit', 'Revenue', 'Row Count']);
        await grid.showDataDialog.clickAddDataOkButton();
        await dossierPage.waitForPageLoading();
        await since('Show data grid Header should be #{expected}, instead we have #{actual}')
            .expect(await grid.showDataDialog.getHeadersInshowDataGrid())
            .toEqual(['Year', 'Year(Group)', 'Profit']);
        await grid.showDataDialog.clickShowDataCloseButton();

        await toc.openPageFromTocMenu({ chapterName: 'Grid Template', pageName: 'Modern Grid' });
        await grid.selectShowDataOnVisualizationMenu('Modern Grid - No OP');
        await grid.showDataDialog.clickAddDataButton();
        await since('For Modern Grid with Dashboard OP, Attr list should be #{expected}, instead we have #{actual}')
            .expect(await grid.showDataDialog.getAddDataList('Attributes'))
            .toEqual(['(All)', 'Day', 'Quarter', 'Year(Group)']);
        await since('For Modern Grid with Dashboard OP, Metr list should be #{expected}, instead we have #{actual}')
            .expect(await grid.showDataDialog.getAddDataList('Metrics'))
            .toEqual(['(All)', 'Cost', 'Profit', 'Revenue', 'Row Count']);
        await grid.showDataDialog.addElementToDataset({ title: 'Attributes', elem: 'Quarter' });
        await grid.showDataDialog.addElementToDataset({ title: 'Metrics', elem: 'Cost' });
        await grid.showDataDialog.clickAddDataOkButton();
        await dossierPage.waitForPageLoading();
        await since('Show data grid Header should be #{expected}, instead we have #{actual}')
            .expect(await grid.showDataDialog.getHeadersInshowDataGrid())
            .toEqual(['Year', 'Quarter', 'Profit', 'Cost']);
        await grid.showDataDialog.clickShowDataCloseButton();
    });

    it('[TC99381_07] Verify Functionality of Object Parameter in Consumption - Replace With', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Grid Template', pageName: 'Normal Grid' });
        await grid.openGridElmContextMenu({
            title: 'Normal Grid - Dataset OP',
            headerName: 'Category',
        });
        await since('Is Replace with context menu exist should be #{expected}, instead we have #{actual}')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Replace With' }))
            .toBe(false);
        await grid.selectGridContextMenuOption({
            title: 'Normal Grid - Dashboard OP',
            headerName: 'Year',
            firstOption: 'Replace With',
        });
        await since('Is Replace with context menu exist should be #{expected}, instead we have #{actual}')
            .expect(await grid.isContextMenuOptionPresent({ level: 1, option: 'DatasetAttribute' }))
            .toBe(false);

        await toc.openPageFromTocMenu({ chapterName: 'Grid Template', pageName: 'Compound Grid' });
        await grid.openGridElmContextMenu({
            title: 'Compound Grid - Dataset OP',
            headerName: 'Category',
        });
        await since('Is Replace with context menu exist should be #{expected}, instead we have #{actual}')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Replace With' }))
            .toBe(false);
        await grid.openGridElmContextMenu({
            title: 'Compound Grid - Dataset OP',
            headerName: 'Revenue',
        });
        await since('Is Replace with context menu exist should be #{expected}, instead we have #{actual}')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Replace With' }))
            .toBe(false);

        await grid.openGridElmContextMenu({
            title: 'Compound Grid - Dashboard OP',
            headerName: 'Year',
        });
        await since('Is Replace with context menu exist should be #{expected}, instead we have #{actual}')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Replace With' }))
            .toBe(false);

        await grid.openGridElmContextMenu({
            title: 'Compound Grid - Dashboard OP',
            headerName: 'Year',
            elementName: 'Profit',
        });
        await since('Is Replace with context menu exist should be #{expected}, instead we have #{actual}')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Replace With' }))
            .toBe(false);

        await toc.openPageFromTocMenu({ chapterName: 'Grid Template', pageName: 'Modern Grid' });
        await grid.openGridElmContextMenu({
            title: 'Modern Grid - Dataset OP',
            headerName: 'Year',
            agGrid: true,
        });
        await grid.openGridElmContextMenu({
            title: 'Modern Grid - Dataset OP',
            headerName: 'Category',
            agGrid: true,
        });
        await since('Is Replace with context menu exist should be #{expected}, instead we have #{actual}')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Replace With' }))
            .toBe(false);

        await grid.openGridElmContextMenu({
            title: 'Modern Grid - Dataset OP',
            headerName: 'Revenue',
            agGrid: true,
        });
        await since('Is Replace with context menu exist should be #{expected}, instead we have #{actual}')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Replace With' }))
            .toBe(false);

        await grid.openGridElmContextMenu({
            title: 'Modern Grid - Dashboard OP',
            headerName: 'Profit',
            agGrid: true,
        });
        await since('Is Replace with context menu exist should be #{expected}, instead we have #{actual}')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Replace With' }))
            .toBe(false);

        await grid.openGridElmContextMenu({
            title: 'Modern Grid - Dashboard OP',
            headerName: 'Year',
            agGrid: true,
        });
        await since('Is Replace with context menu exist should be #{expected}, instead we have #{actual}')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Replace With' }))
            .toBe(false);
    });
});
