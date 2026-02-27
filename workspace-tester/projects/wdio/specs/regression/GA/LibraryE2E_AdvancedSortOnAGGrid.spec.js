import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_sort') };
const { credentials } = specConfiguration;
describe('E2E Advanced Sort On AG Grid', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const sortGeneral = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: '(AUTO) AG Grid on Sort - General',
        project: tutorialProject,
    };
    const sortGridTemplate = {
        id: 'FBF2E9B04B38FD33F5304C8823CBBF60',
        name: '(AUTO) AG Grid on Sort - Grid Template',
        project: tutorialProject,
    };
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let { loginPage, dossierPage, libraryPage, toc, grid, advancedSort } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC76269_1] Validate E2E user journey for advanced sort with AG Grid on Web Library - Entries ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: sortGridTemplate,
        });
        await libraryPage.openDossier(sortGeneral.name);
        await toc.openPageFromTocMenu({ chapterName: 'AG Grid', pageName: 'Column Set' });

        // 0 column set
        await grid.openGridElmContextMenu({ title: 'Column Set - 0', headerName: 'Category', agGrid: true });
        await since('Open grid context menu on AG grid without column set, advanced sort option should be appear')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Advanced Sort ...' }))
            .toBe(true);
        await grid.clickMenuOptionInLevel({ level: 0, option: 'Advanced Sort ...' });
        await advancedSort.openAndselectSortByAndOrder(1, 'Category (DESC)', 'Descending');
        await since(
            'With 0 column set, select sort by, the selected item should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe('Category (DESC)');
        await since(
            'With 0 column set, select order, the selected item should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getOrderSelectedText(1))
            .toBe('Descending');
        await advancedSort.save();
        await since(
            '0 column set, first item of "Call Center" is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Column Set - 0', headerName: 'Category', agGrid: true }))
            .toBe('Music');

        // 1 column set
        await grid.openGridElmContextMenu({ title: 'Column Set - 1', headerName: 'Category', agGrid: true });
        await since('Open grid context menu on AG grid with only one column set, advanced sort option should be appear')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Advanced Sort ...' }))
            .toBe(true);
        await grid.clickMenuOptionInLevel({ level: 0, option: 'Advanced Sort ...' });
        await advancedSort.openAndselectSortByAndOrder(1, 'Category (DESC)', 'Descending');
        await since(
            'With 1 column set, select sort by, the selected item should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe('Category (DESC)');
        await since(
            'With 1 column set, select order, the selected item should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getOrderSelectedText(1))
            .toBe('Descending');
        await advancedSort.save();
        await since(
            '1 column set, first item of "Call Center" is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Column Set - 1', headerName: 'Category', agGrid: true }))
            .toBe('Music');

        // 2 column set
        await grid.openGridElmContextMenu({ title: 'Column Set - 2', headerName: 'Category', agGrid: true });
        await since('Open grid context menu on AG grid with 2 column set, advanced sort option should NOT be appear')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Advanced Sort ...' }))
            .toBe(false);
    });

    it('[TC76269_2] Validate E2E user journey for advanced sort with AG Grid on Web Library - Sort on Rows tab ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: sortGridTemplate,
        });
        await libraryPage.openDossier(sortGridTemplate.name);
        await toc.openPageFromTocMenu({ chapterName: 'Both Columns and Rows' });
        await grid.selectGridContextMenuOption({
            title: 'AG Grid',
            headerName: 'Region DESC',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });

        // Initial state on Rows panel
        await since('Sort on Rows, the Rows panel should be selected by default')
            .expect(await advancedSort.isRowsSelected())
            .toBe(true);
        await since('Sort on Rows, the sort by rows count should be #{expected} by default, instead we have #{actual}')
            .expect(await advancedSort.getSortRowsCount())
            .toBe(3);

        // Dropdown list item on Rows - check and select
        await advancedSort.openSortByDropdown(1);
        await since('Sort on Rows, the sort by item count should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getSortByListItemsCount())
            .toBe(6);
        await takeScreenshotByElement(advancedSort.getSortEditor(), 'TC76269', 'SortOnRows_SortbyItem');
        await advancedSort.selectDropdownItem('Books; Profit');
        await advancedSort.openOrderDropdown(1);
        await since('Sort on Rows, the order item count should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getOrderListItemsCount())
            .toBe(2);
        await takeScreenshotByElement(advancedSort.getSortEditor(), 'TC76269', 'SortOnRows_OrderItem');
        await advancedSort.selectDropdownItem('Descending');

        // Save and re-open to  check
        await advancedSort.save();
        await since('Save and re-open, first item of category is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'AG Grid', headerName: 'Region DESC', agGrid: true }))
            .toBe('Northeast');
        await grid.selectGridContextMenuOption({
            title: 'AG Grid',
            headerName: 'Region DESC',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await since(
            'Sort on Rows, save and re-open, the selected sort  by item should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe('Books; Profit');

        // cancel
        await advancedSort.cancel();
    });

    it('[TC76269_3] Validate E2E user journey for advanced sort with AG Grid on Web Library - Sort on Columns tab ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: sortGridTemplate,
        });
        await libraryPage.openDossier(sortGridTemplate.name);
        await toc.openPageFromTocMenu({ chapterName: 'Both Columns and Rows' });
        await grid.selectGridContextMenuOption({
            title: 'AG Grid',
            headerName: 'Region DESC',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });

        // Switch to Columns panel
        await advancedSort.switchToColumns();
        await since('Switch to Columns, the Columns panel should be selected')
            .expect(await advancedSort.isColumnsSelected())
            .toBe(true);
        await since(
            'Sort on Columns, the sort by rows count should be #{expected} by default, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortRowsCount())
            .toBe(3);

        // Dropdown list item on Columns - check and select
        await advancedSort.openSortByDropdown(1);
        await since('Sort on Columns, the sort by item count should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getSortByListItemsCount())
            .toBe(2);
        await advancedSort.selectDropdownItem('Category ID');
        await advancedSort.openOrderDropdown(1);
        await since('Sort on Columns, the order item count should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getOrderListItemsCount())
            .toBe(2);
        await advancedSort.selectDropdownItem('Descending');

        // Save and re-open to check
        await advancedSort.save();
        await since(
            'Save and re-open, first item of "Call Center" is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'AG Grid', headerName: 'Region DESC', agGrid: true }))
            .toBe('Central');
        await grid.selectGridContextMenuOption({
            title: 'AG Grid',
            headerName: 'Region DESC',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await advancedSort.switchToColumns();
        await since(
            'Sort on Columns, save and re-open, the selected sort  by item should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe('Category ID');
        await takeScreenshotByElement(advancedSort.getSortEditor(), 'TC76269', 'SortOnColumns_ReOpen');

        // cancel
        await advancedSort.cancel();
    });

    it('[TC76269_4] Validate E2E user journey for advanced sort with AG Grid on Web Library - Manipulation on sort  ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: sortGridTemplate,
        });
        await libraryPage.openDossier(sortGridTemplate.name);
        await toc.openPageFromTocMenu({ chapterName: 'Both Columns and Rows' });
        await grid.selectGridContextMenuOption({
            title: 'AG Grid',
            headerName: 'Region DESC',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });

        // Produce new row
        const totalRow = await advancedSort.getSortRowsCount();
        await advancedSort.openAndselectSortByAndOrder(totalRow, 'Region DESC', 'Descending');
        await since('Add and re-open, the selected sort by item should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getSortBySelectedText(totalRow))
            .toBe('Region DESC');
        //// --- new row will appear if add from the last row
        await since(
            'After add from the last row, the sort by rows count should be #{expected} by default, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortRowsCount())
            .toBe(totalRow + 1);
        //// --- save and re-open to check
        await advancedSort.save();
        await grid.selectGridContextMenuOption({
            title: 'AG Grid',
            headerName: 'Region DESC',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await since(
            'After add from the last row, the sort by rows count should be #{expected} by default, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortRowsCount())
            .toBe(totalRow + 1);

        // switch rows & columns tab
        await advancedSort.switchToColumns();
        await takeScreenshotByElement(advancedSort.getSortEditor(), 'TC76269', 'Manipulation_switchToColumns');
        await advancedSort.switchToRows();
        await takeScreenshotByElement(advancedSort.getSortEditor(), 'TC76269', 'Manipulation_switchToRows');

        // edit and save
        await advancedSort.openAndselectSortBy(1, 'Movies; Profit');
        await advancedSort.save();
        await grid.selectGridContextMenuOption({
            title: 'AG Grid',
            headerName: 'Region DESC',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await since('Edit and save, the selected sort by item should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe('Movies; Profit');

        // edit and cancel
        await advancedSort.openAndselectSortBy(1, 'Region DESC');
        await advancedSort.cancel();
        await grid.selectGridContextMenuOption({
            title: 'AG Grid',
            headerName: 'Region DESC',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await since('Edit and cancel, the selected sort by item should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe('Movies; Profit');

        // delete
        await advancedSort.delete(1);
        await advancedSort.save();
        await grid.selectGridContextMenuOption({
            title: 'AG Grid',
            headerName: 'Region DESC',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await since('Delete, the sort by rows count should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getSortRowsCount())
            .toBe(totalRow);
        await advancedSort.cancel();
    });
});
export const config = specConfiguration;
