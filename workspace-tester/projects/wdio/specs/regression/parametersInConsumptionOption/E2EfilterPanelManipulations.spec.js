import { browserWindowCustom } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

describe('Parameters', () => {
    let { dossierPage, libraryPage, grid, loginPage, filterPanel, searchBoxFilter, calendarFilter, filterSummaryBar } =
        browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(browsers.params.credentials);
        await setWindowSize(browserWindowCustom);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    const dossiers = {
        projectId: '060ED74A48F4992BA084F7BF6C9A652A',
        pageId: 'K53--K46',
        dossier1: {
            id: '8FC9923FAB4237162AE04096C5966F8D',
            name: 'E2E Open Filter Panel',
        },
    };

    it('[TC93132] E2E - Open Filter Panel, perform manipulations and save changes', async () => {
        const verifyVizDataWithoutFilters = async () => {
            since('Second Year in Visualization 1 without filters should be #{expected}, instead it is #{actual}')
                .expect(await grid.getCellValue('Visualization 1', 3, 1))
                .toBe('2010');
            since('First Name in Visualization 2 without filters should be #{expected}, instead it is #{actual}')
                .expect(await grid.getCellValue('Visualization 2', 2, 1))
                .toBe('Brandon');
            since('18th Name in Visualization 2 without filters should be #{expected}, instead it is #{actual}')
                .expect(await grid.getCellValue('Visualization 2', 19, 1))
                .toBe('William');
        };
        const verifyVizDataWithAllFilters = async () => {
            since('Second Year in Visualization 2 with filters should be #{expected}, instead it is #{actual}')
                .expect(await grid.getCellValue('Visualization 1', 3, 1))
                .toBe('2011');
            since('First Name in Visualization 2 with filters should be #{expected}, instead it is #{actual}')
                .expect(await grid.getCellValue('Visualization 2', 2, 1))
                .toBe('Earl');
            since('18th Name in Visualization 2 with filters should be #{expected}, instead it is #{actual}')
                .expect(await grid.getCellValue('Visualization 2', 19, 1))
                .toBe('Miguel');
        };
        const verifyFilterPanelSelections = async () => {
            since(
                'Selection for Year Parameter when option Exclude is enabled should be #{expected}, instead it is #{actual}'
            )
                .expect(await searchBoxFilter.filterSelectionInfo('Year Parameter'))
                .toBe('(exclude 1/3)');
            since('On selecting context menu option Exclude, Capsules for Year Parameter are expected to be excluded')
                .expect(await searchBoxFilter.isCapsuleExcluded({ filterName: 'Year Parameter', capsuleName: '2010' }))
                .toBe(true);
            since('Selected date range for Date Parameter should be "#{expected}", instead it is "#{actual}" ')
                .expect(await calendarFilter.capsuleDateTime('Date Parameter'))
                .toBe('01/01/1980 - 01/01/1990');
        };

        // 1. Open a dossier containing visualizations and parameter filters.
        await libraryPage.openUrlWithPage(dossiers.projectId, dossiers.dossier1.id, dossiers.pageId);
        await dossierPage.resetDossierIfPossible();
        await verifyVizDataWithoutFilters();

        // 2. Open Filter Panel and see the list of available filters.
        await filterPanel.openFilterPanel();

        // 3. Click the Element List filter and wait for the search panel to open.
        await filterPanel.click({ elem: filterPanel.getFilterItemContainerByName('Year Parameter') });

        // 4. In search box, type the name of one of the elements.
        await searchBoxFilter.search('2010');

        // 5. Select this element by clicking the check box.
        await searchBoxFilter.selectCheckboxByName('2010');

        // 6. Click "Apply".
        await filterPanel.apply();

        // 7. Observe that the visualizations change and display the data corresponding to your selection.
        since('Year value in Visualization 1 with filter should be #{expected}, instead it is #{actual}')
            .expect(await grid.getCellValue('Visualization 1', 2, 1))
            .toBe('2010');

        // 8. Below the Library ribbon, a filter summary is displayed and lists selected elements.
        since('Year Parameter in filter summary bar should be #{expected}, instead it is #{actual}')
            .expect(await filterSummaryBar.filterItems('Year Parameter'))
            .toBe('(2010)');

        // 9. Open Filter Panel.
        await filterPanel.openFilterPanel();

        // 10. Click the three-dot menu on the right of the filter name and select "Exclude".
        await searchBoxFilter.openContextMenu('Year Parameter');
        await searchBoxFilter.selectContextMenuOption('Year Parameter', 'Exclude');

        // 11. The names of the elements are now crossed out.
        since(
            'Selection for Year Parameter when option Exclude is enabled should be #{expected}, instead it is #{actual}'
        )
            .expect(await searchBoxFilter.filterSelectionInfo('Year Parameter'))
            .toBe('(exclude 1/3)');
        since('On selecting context menu option Exclude, Capsules for Year Parameter are expected to be excluded')
            .expect(await searchBoxFilter.isCapsuleExcluded({ filterName: 'Year Parameter', capsuleName: '2010' }))
            .toBe(true);

        // 12. Click "Apply".
        await filterPanel.apply();

        // 13. Observe that the visualizations change and previously selected elements are now excluded.
        since('Second Year in Visualization 2 with filters should be #{expected}, instead it is #{actual}')
            .expect(await grid.getCellValue('Visualization 1', 3, 1))
            .toBe('2011');

        // 14. Open Filter Panel.
        await filterPanel.openFilterPanel();

        // 15. Click the Date filter, a calendar will be displayed.
        await filterPanel.click({ elem: filterPanel.getFilterItemContainerByName('Date Parameter') });

        // 16. Select a new date range and click "Apply".
        await calendarFilter.setInputDateOfFrom({ customMonth: '1', customDay: '1', customYear: '1980' });
        await calendarFilter.setInputDateOfTo({ customMonth: '1', customDay: '1', customYear: '1990' });
        await since('Selected date range for Date Parameter should be "#{expected}", instead it is "#{actual}" ')
            .expect(await calendarFilter.capsuleDateTime('Date Parameter'))
            .toBe('01/01/1980 - 01/01/1990');
        await filterPanel.apply();

        // 17. Observe that the visualizations change and display the data corresponding to your selection.
        await verifyVizDataWithAllFilters();

        // 18. Close the dossier.
        await dossierPage.goToLibrary();

        // 19. Open the dossier again.
        await libraryPage.openUrlWithPage(dossiers.projectId, dossiers.dossier1.id, dossiers.pageId);

        // 20. Verify that your selections from steps 5 and 11 are still present in the dossier data and in Filter Panel.
        await verifyVizDataWithAllFilters();
        await filterPanel.openFilterPanel();
        await verifyFilterPanelSelections();

        // 21. Click "Clear All Filters", all filters should reset.
        await filterPanel.clearAllFilters();

        // 22. Click "Apply".
        await filterPanel.apply();

        // 23. Observe that the visualizations change and display the data corresponding to your selection.
        await verifyVizDataWithoutFilters();

        // 24. Click "Undo" on Library ribbon.
        await dossierPage.clickUndo();

        // 25. Verify that your selections from steps 5 and 11 are again present in the dossier data and in Filter Panel.
        await verifyVizDataWithAllFilters();
        await filterPanel.openFilterPanel();
        await verifyFilterPanelSelections();
    });
});
