import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import * as gridConstants from '../../../constants/grid.js';

describe('AG Grid - Advanced Sort General', () => {
    const tutorialProject = {
        id: 'B628A31F11E7BD953EAE0080EF0583BD',
        name: 'MicroStrategy Tutorial',
    };
    const sortGeneral = {
        id: 'B98CF10E41ACD2C6430C2982905A002B',
        name: '(AUTO) AG Grid on Sort - General',
        project: tutorialProject,
    };
    const sortGridTemplate = {
        id: 'FBF2E9B04B38FD33F5304C8823CBBF60',
        name: '(AUTO) AG Grid on Sort - Grid Template',
        project: tutorialProject,
    };
    const sortLongList = {
        id: '4080C91A4DAA80AFBFDE6CBC401CF877',
        name: '(AUTO) AG Grid on Sort - Long List',
        project: tutorialProject,
    };
    const sortCache = {
        id: 'B521F3DB4BBA3DBA8FBE47827E0306D9',
        name: '(AUTO) AG Grid on Sort - Cache',
        project: tutorialProject,
    };

    let { dossierPage, libraryPage, toc, grid, advancedSort, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridTestUser);
        await browser.execute(() => {
            mstrmojo.vi.enums.DefaultFeatureValues["features.react-integration-enabled"] = true;
        });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC76229] AG Grid - Advanced Sort - Advanced sort only exposed on AG Grid ', async () => {
        await libraryPage.openDossier(sortGeneral.name);
        // Normal grid
        await toc.openPageFromTocMenu({ chapterName: 'Other Grid', pageName: 'Normal Grid' });
        await grid.openGridElmContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await since('Open grid context menu on normal grid, advanced sort option should NOT be appear')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Advanced Sort ...' }))
            .toBe(false);

        // Compund grid
        await toc.openPageFromTocMenu({ chapterName: 'Other Grid', pageName: 'Compund Grid' });
        await grid.openGridElmContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await since('Open grid context menu on compund grid, advanced sort option should NOT be appear')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Advanced Sort ...' }))
            .toBe(false);
        // AG grid with microcharts
        await toc.openPageFromTocMenu({ chapterName: 'AG Grid', pageName: 'Microchart Cell' });
        await grid.openGridElmContextMenu({ title: 'Microchart Cell - 1', headerName: 'Category', agGrid: true });
        await since('Open grid context menu on AG grid with microcharts, advanced sort option should NOT be appear')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Advanced Sort ...' }))
            .toBe(false);

        // AG grid with column set
        await toc.openPageFromTocMenu({ chapterName: 'AG Grid', pageName: 'Column Set' });
        await grid.openGridElmContextMenu({ title: 'Column Set - 0', headerName: 'Category', agGrid: true });
        await since('Open grid context menu on AG grid, advanced sort option should be appear')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Advanced Sort ...' }))
            .toBe(true);
    });

    it('[TC76230] AG Grid - Advanced Sort - Advanced Sort only appear when less than two column set ', async () => {
        await resetDossierState({
            credentials: gridConstants.gridTestUser,
            dossier: sortGeneral,
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
            '0 column set,The first element of Customer attribute should be #{expected}, instead we have #{actual}'
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
            '1 column set,The first element of Customer attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Column Set - 1', headerName: 'Category', agGrid: true }))
            .toBe('Music');

        // 2 column set
        await grid.openGridElmContextMenu({ title: 'Column Set - 2', headerName: 'Category', agGrid: true });
        await since('Open grid context menu on AG grid with 2 column set, advanced sort option should NOT be appear')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Advanced Sort ...' }))
            .toBe(false);
    });

    it('[TC76231] AG Grid - Advanced Sort - Advanced Sort only accessible from grid header ', async () => {
        await libraryPage.openDossier(sortGridTemplate.name);
        await toc.openPageFromTocMenu({ chapterName: 'Both Columns and Rows' });

        // grid row header - attribute
        await grid.openGridElmContextMenu({ title: 'AG Grid', headerName: 'Region DESC', agGrid: true });
        await since('Open grid context menu on attribute row header, advanced sort option should be appear')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Advanced Sort ...' }))
            .toBe(true);

        // grid column header - metric
        await grid.openGridElmContextMenu({ title: 'AG Grid', headerName: 'Profit', agGrid: true });
        await since('Open grid context menu on metric column header, advanced sort option should be appear')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Advanced Sort ...' }))
            .toBe(true);

        //     // grid column header - attribute element
        //     await grid.openGridElmContextMenu({ title: 'AG Grid', headerName: 'Books', agGrid: true});
        //     await since('Open grid context menu on attribute element on  column header, advanced sort option should NOT be appear')
        //         .expect(await grid.isContextMenuOptionPresent({level: 0, option: 'Advanced Sort ...'})).toBe(false);
    });

    it('[TC76232] AG Grid - Advanced Sort - Sort on Rows tab ', async () => {
        await resetDossierState({
            credentials: gridConstants.gridTestUser,
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
        await takeScreenshotByElement(advancedSort.getSortEditor(), 'TC76232', 'SortOnRows_Initial');

        // Dropdown list item on Rows - check and select
        await advancedSort.openSortByDropdown(1);
        await since('Sort on Rows, the sort by item count should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getSortByListItemsCount())
            .toBe(6);
        await takeScreenshotByElement(advancedSort.getSortEditor(), 'TC76232', 'SortOnRows_SortbyItem');
        await advancedSort.selectSortByDropdownItem('Books; Profit');
        await advancedSort.openOrderDropdown(1);
        await since('Sort on Rows, the order item count should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getOrderListItemsCount())
            .toBe(2);
        await takeScreenshotByElement(advancedSort.getSortEditor(), 'TC76232', 'SortOnRows_OrderItem');
        await advancedSort.selectOrderDropdownItem('Descending');

        // Save and re-open to  check
        await advancedSort.save();
        await since(
            'save and re-open,The first element of Customer attribute should be #{expected}, instead we have #{actual}'
        )
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

    it('[TC76233] AG Grid - Advanced Sort - Sort on Columns tab ', async () => {
        await resetDossierState({
            credentials: gridConstants.gridTestUser,
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
        await advancedSort.selectSortByDropdownItem('Category ID');
        await advancedSort.openOrderDropdown(1);
        await since('Sort on Columns, the order item count should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getOrderListItemsCount())
            .toBe(2);
        await advancedSort.selectOrderDropdownItem('Descending');

        // Save and re-open to check
        await advancedSort.save();
        await since(
            'save and re-open,The first element of Customer attribute should be #{expected}, instead we have #{actual}'
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

        // cancel
        await advancedSort.cancel();
    });

    it('[TC76234] AG Grid - Advanced Sort - Manipulation on sort  ', async () => {
        await resetDossierState({
            credentials: gridConstants.gridTestUser,
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

        // switch rows & columns tab
        await advancedSort.switchToColumns();
        await takeScreenshotByElement(advancedSort.getSortEditor(), 'TC76234', 'Manipulation_switchToColumns');
        await advancedSort.switchToRows();
        await takeScreenshotByElement(advancedSort.getSortEditor(), 'TC76234', 'Manipulation_switchToRows');

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

    it('[TC76262]AG Grid - Advanced Sort - Long sort item list ', async () => {
        await resetDossierState({
            credentials: gridConstants.gridTestUser,
            dossier: sortLongList,
        });
        await libraryPage.openDossier(sortLongList.name);

        await grid.selectGridContextMenuOption({
            title: 'AG Grid',
            headerName: 'Region DESC',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });

        // scroll down the list and select
        await advancedSort.scrollListToBottom();
        await takeScreenshotByElement(advancedSort.getSortEditor(), 'TC76262', 'SortLongList_bottom');
        await advancedSort.openAndselectSortByAndOrder(9, 'Movies; Profit', 'Descending');
        await since('Long sort item list, the selected sort by item should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getSortBySelectedText(9))
            .toBe('Movies; Profit');
        await since('Xong sort item list, the selected order item should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getOrderSelectedText(9))
            .toBe('Descending');
        await advancedSort.save();
        await since(
            'save and re-open,The first element of Customer attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'AG Grid', headerName: 'Region DESC', agGrid: true }))
            .toBe('Central');
    });

    it('[TC76351] AG Grid - Advanced Sort - Generate new cache when open advanced sort', async () => {
        await resetDossierState({
            credentials: gridConstants.gridTestUser,
            dossier: sortCache,
        });
        await libraryPage.openDossier(sortCache.name);

        // open page 1
        await toc.openPageFromTocMenu({ chapterName: 'Grid Template', pageName: 'Only Columns' });

        // open page 2, click advanced sort, cancel
        await toc.openPageFromTocMenu({ chapterName: 'Grid Template', pageName: 'Only Rows' });
        await grid.selectGridContextMenuOption({
            title: 'AG Grid',
            headerName: 'Year ID',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await since('Open page Only Rows, the advanced sort editor should be appear')
            .expect(await advancedSort.isAdvancedSortEditorPresent())
            .toBe(true);
        await since('Open page Only Rows, the 1st advanced sort text should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe('Year');
        await advancedSort.cancel();

        // open page 3, click advanced sort, cancel
        await toc.openPageFromTocMenu({ chapterName: 'Grid Template', pageName: 'Both Columns and Rows' });
        await grid.selectGridContextMenuOption({
            title: 'AG Grid',
            headerName: 'Profit',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await since('Open page Both Columns and Rows, the advanced sort editor should be appear')
            .expect(await advancedSort.isAdvancedSortEditorPresent())
            .toBe(true);
        await since(
            'Open page Both Columns and Rows, the 1st advanced sort text should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe('Year');
        await since(
            'Open page Both Columns and Rows, the 2nd advanced sort text should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortBySelectedText(2))
            .toBe('Books; Profit');
        await advancedSort.cancel();

        // open another chapter - page 1, click advnced sort, select and save
        await toc.openPageFromTocMenu({ chapterName: 'Grid Format', pageName: 'Enable Banding' });
        await grid.selectGridContextMenuOption({
            title: 'AG Grid',
            headerName: 'Profit',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await since('Open page Enable Banding, the advanced sort editor should be appear')
            .expect(await advancedSort.isAdvancedSortEditorPresent())
            .toBe(true);
        await advancedSort.openAndselectSortBy(1, 'Cost');
        await since(
            'Open page Enable Banding, the 1st advanced sort text should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe('Cost');
        await since(
            'Open page Enable Banding, the 2nd advanced sort text should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortBySelectedText(2))
            .toBe('Category (DESC)');
        await advancedSort.save();

        // open another chapter page 2, click advnced sort, select and save
        await toc.openPageFromTocMenu({ chapterName: 'Grid Format', pageName: 'Enable Banding copy' });
        await grid.selectGridContextMenuOption({
            title: 'AG Grid',
            headerName: 'Profit',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await since('Open page Enable Banding copy, the advanced sort editor should be appear')
            .expect(await advancedSort.isAdvancedSortEditorPresent())
            .toBe(true);
        await advancedSort.openAndselectSortBy(1, 'Cost');
        await advancedSort.save();

        // back to page 1 and click advanced sort
        await toc.openPageFromTocMenu({ chapterName: 'Grid Template', pageName: 'Only Columns' });
        await grid.selectGridContextMenuOption({
            title: 'AG Grid',
            headerName: 'Profit',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await since('Open page Only Columns, the advanced sort editor should be appear')
            .expect(await advancedSort.isAdvancedSortEditorPresent())
            .toBe(true);
        await advancedSort.cancel();
    });
});
