import resetDossierState from '../../../api/resetDossierState.js';
import * as gridConstants from '../../../constants/grid.js';

describe('AG Grid - Advanced Sort Xfunc', () => {
    const tutorialProject = {
        id: 'B628A31F11E7BD953EAE0080EF0583BD',
        name: 'MicroStrategy Tutorial',
    };
    const sortGridTemplate = {
        id: 'FBF2E9B04B38FD33F5304C8823CBBF60',
        name: '(AUTO) AG Grid on Sort - Grid Template',
        project: tutorialProject,
    };
    const sortGridFormat = {
        id: '71CB1E144086573FCED3DDBC0E4F31CB',
        name: '(AUTO) AG Grid on Sort - Grid Format',
        project: tutorialProject,
    };
    const sortDerivedAttribute = {
        id: '053551B741CC1EC7FD49618CF5391A16',
        name: '(AUTO) AG Grid on Sort - Derived Attribute',
        project: tutorialProject,
    };
    const sortDerivedMetric = {
        id: 'F7058FA3434B38BA186E80B248221139',
        name: '(AUTO) AG Grid on Sort - Derived Metric',
        project: tutorialProject,
    };
    const sortGroup = {
        id: '06CF6B524E00EFD48E7B6390957DEAB0',
        name: '(AUTO) AG Grid on Sort - Group',
        project: tutorialProject,
    };
    const sortConsolidation = {
        id: '510F1C73443884769300238D81E1E250',
        name: '(AUTO) AG Grid on Sort - Consolidations',
        project: tutorialProject,
    };
    const sortCustomGroup = {
        id: 'A73289884B6D40054EF554A99DF2D309',
        name: '(AUTO) AG Grid on Sort - Custom Group',
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

    it('[TC76235] AG Grid - Advanced Sort - Xfunc with different grid template', async () => {
        await resetDossierState({
            credentials: gridConstants.gridTestUser,
            dossier: sortGridTemplate,
        });
        await libraryPage.openDossier(sortGridTemplate.name);

        // only columns on grid, with only metric
        await toc.openPageFromTocMenu({ chapterName: 'Only Columns' });
        await grid.selectGridContextMenuOption({
            title: 'only metric',
            headerName: 'Cost',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await advancedSort.openSortByDropdown(1);
        await since(
            'When only columns on grid with only metric, the sort by item count should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortByListItemsCount(1))
            .toBe(1);
        await advancedSort.switchToColumns();
        await since(
            'When only columns on grid with only metric, Columns tab disable should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.isSortByDisabled())
            .toBe(true);
        await advancedSort.cancel();

        // only columns on grid, with only attribute
        await since('When only columns on grid with only attribute, advanced sort option should NOT be appear')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Advanced Sort ...' }))
            .toBe(false);

        // only columns on grid, with both attribute and metric
        await grid.selectGridContextMenuOption({
            title: 'attribute and metric',
            headerName: 'Cost',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await advancedSort.openSortByDropdown(1);
        await since(
            'When only columns on grid with both attribute and metric, the sort by item count should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortByListItemsCount(1))
            .toBe(4);
        await advancedSort.switchToColumns();
        await advancedSort.openSortByDropdown(1);
        await since(
            'When only columns on grid with both attribute and metric, switch to columns tab, sort by item count should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortByListItemsCount(1))
            .toBe(2);
        await advancedSort.cancel();

        // only rows on grid
        await toc.openPageFromTocMenu({ chapterName: 'Only Rows' });
        await grid.selectGridContextMenuOption({
            title: 'AG Grid',
            headerName: 'Year ID',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await advancedSort.openSortByDropdown(1);
        await since('When only rows on grid, the sort by item count should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getSortByListItemsCount(1))
            .toBe(3);
        await advancedSort.switchToColumns();
        await since('When only rows on grid, Columns tab is disable due to no avaible item')
            .expect(await advancedSort.isSortByDisabled())
            .toBe(true);
        await advancedSort.cancel();
    });

    it('[TC76246] AG Grid - Advanced Sort - Xfunc with different grid format', async () => {
        await resetDossierState({
            credentials: gridConstants.gridTestUser,
            dossier: sortGridFormat,
        });
        await libraryPage.openDossier(sortGridFormat.name);

        // hide row header
        await toc.openPageFromTocMenu({ chapterName: 'Hide Row Header' });
        await grid.selectGridContextMenuOption({
            title: 'AG Grid',
            headerName: 'Profit',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await advancedSort.openAndselectSortByAndOrder(1, 'Books; Profit', 'Descending');
        await since('Hide row header, the selected sort by item should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe('Books; Profit');
        await advancedSort.save();

        // enable banding
        await toc.openPageFromTocMenu({ chapterName: 'Enable Banding' });
        await grid.selectGridContextMenuOption({
            title: 'AG Grid',
            headerName: 'Profit',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await advancedSort.openAndselectSortByAndOrder(1, 'Cost', 'Descending');
        await since('Enable banding, the selected sort by item should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe('Cost');
        await advancedSort.save();
        await since(
            'enable banding,The first element of Customer attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'AG Grid', headerName: 'Category', agGrid: true }))
            .toBe('Electronics');

        // enable outline
        await toc.openPageFromTocMenu({ chapterName: 'Enable Outline' });
        await grid.selectGridContextMenuOption({
            title: 'AG Grid',
            headerName: 'Profit',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await advancedSort.openAndselectSortByAndOrder(2, 'Category (DESC)', 'Descending');
        await since('Enable outline, the selected sort by item should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getSortBySelectedText(2))
            .toBe('Category (DESC)');
        await advancedSort.save();

        // merge repetive cells
        await toc.openPageFromTocMenu({ chapterName: 'Merge Repetive Cells' });
        await grid.selectGridContextMenuOption({
            title: 'AG Grid',
            headerName: 'Cost',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await advancedSort.openAndselectSortByAndOrder(2, 'Cost', 'Descending');
        await since('Merge repetive cells, the selected sort by item should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getSortBySelectedText(2))
            .toBe('Cost');
        await advancedSort.save();
        await since(
            'enable banding,The first element of Customer attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'AG Grid', headerName: 'Region', agGrid: true }))
            .toBe('Central');
    });

    it('[TC76247] AG Grid - Advanced Sort - Sort on derived attributes', async () => {
        await resetDossierState({
            credentials: gridConstants.gridTestUser,
            dossier: sortDerivedAttribute,
        });

        const item = 'DerivedAttributes(Category)';
        await libraryPage.openDossier(sortDerivedAttribute.name);

        // without column set
        await toc.openPageFromTocMenu({ chapterName: 'Without column set' });
        await grid.selectGridContextMenuOption({
            title: 'without column set',
            headerName: item,
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await advancedSort.openSortByDropdown(1);
        await since(
            'Derived attribute, without column set, the sort by item count should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortByListItemsCount(1))
            .toBe(2);
        await advancedSort.selectSortByDropdownItem(item);
        await since(
            'Derived attribute, without column set, the selected sort by item should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe(item);
        await advancedSort.save();
        await since(
            'withoutcolumne set,The first element of Customer attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(
                await grid.firstElmOfHeader({
                    title: 'without column set',
                    headerName: 'DerivedAttributes(Category)',
                    agGrid: true,
                })
            )
            .toBe('1');

        // with single column set
        await toc.openPageFromTocMenu({ chapterName: 'With column set' });
        await grid.selectGridContextMenuOption({
            title: 'with single column set',
            headerName: item,
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await advancedSort.openAndselectSortByAndOrder(1, item, 'Descending');
        await since(
            'Derived attribute, with single column set, the selected sort by item should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe(item);
        await advancedSort.save();
        await since(
            'with single column set,The first element of Customer attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(
                await grid.firstElmOfHeader({
                    title: 'with single column set',
                    headerName: 'DerivedAttributes(Category)',
                    agGrid: true,
                })
            )
            .toBe('4');

        // with multiple column set
        await grid.openGridElmContextMenu({ title: 'with multi column set', headerName: item, agGrid: true });
        await since('Derived attribute, with multiple column set, advanced sort option should NOT be appear')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Advanced Sort ...' }))
            .toBe(false);
    });

    it('[TC76248] AG Grid - Advanced Sort - Sort on derived metrics', async () => {
        await resetDossierState({
            credentials: gridConstants.gridTestUser,
            dossier: sortDerivedMetric,
        });
        const item = 'DerivedMetric(Cost)';
        await libraryPage.openDossier(sortDerivedMetric.name);

        // without column set
        await toc.openPageFromTocMenu({ chapterName: 'Without column set' });
        await grid.selectGridContextMenuOption({
            title: 'without column set',
            headerName: item,
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await advancedSort.openSortByDropdown(1);
        await since(
            'Derived metric, without column set, the sort by item count should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortByListItemsCount(1))
            .toBe(4);
        await advancedSort.selectSortByDropdownItem(item);
        await since(
            'Derived metric, without column set, the selected sort by item should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe(item);
        await advancedSort.save();
        await since(
            'without column set,The first element of Customer attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'without column set', headerName: 'Category', agGrid: true }))
            .toBe('Books');

        // with single column set
        await toc.openPageFromTocMenu({ chapterName: 'With column set' });
        await grid.selectGridContextMenuOption({
            title: 'with single column set',
            headerName: item,
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await advancedSort.openAndselectSortByAndOrder(1, item, 'Descending');
        await since(
            'Derived metric, with single column set, the selected sort by item should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe(item);
        await advancedSort.save();
        await since(
            'with single column set,The first element of Customer attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(
                await grid.firstElmOfHeader({ title: 'with single column set', headerName: 'Category', agGrid: true })
            )
            .toBe('Electronics');

        // with multiple column set
        await grid.openGridElmContextMenu({ title: 'with multi column set', headerName: item, agGrid: true });
        await since('Derived metric, with multiple column set, advanced sort option should NOT be appear')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Advanced Sort ...' }))
            .toBe(false);
    });

    it('[TC76249] AG Grid - Advanced Sort - Sort on group', async () => {
        await resetDossierState({
            credentials: gridConstants.gridTestUser,
            dossier: sortGroup,
        });
        const item = 'Quarter (Group)';
        const itemDes = 'Quarter (Group) (DESC)';
        await libraryPage.openDossier(sortGroup.name);

        // without column set
        await toc.openPageFromTocMenu({ chapterName: 'Without column set' });
        await grid.selectGridContextMenuOption({
            title: 'without column set',
            headerName: item,
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await advancedSort.openSortByDropdown(1);
        await since(
            'Group, without column set, the sort by item count should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortByListItemsCount(1))
            .toBe(6);
        await advancedSort.selectSortByDropdownItem(itemDes);
        await since(
            'Group, without column set, the selected sort by item should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe(itemDes);
        await advancedSort.save();
        await since(
            'without column set,The first element of Customer attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(
                await grid.firstElmOfHeader({
                    title: 'without column set',
                    headerName: 'Quarter (Group)',
                    agGrid: true,
                })
            )
            .toBe('Autumn');

        // with column set
        await toc.openPageFromTocMenu({ chapterName: 'With column set' });
        await grid.selectGridContextMenuOption({
            title: 'with single column set',
            headerName: item,
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await advancedSort.openAndselectSortByAndOrder(1, itemDes, 'Descending');
        await since(
            'Group, with single column set, the selected sort by item should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe(itemDes);
        await advancedSort.save();
        await since(
            'with single column set,The first element of Customer attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(
                await grid.firstElmOfHeader({
                    title: 'with single column set',
                    headerName: 'Quarter (Group)',
                    agGrid: true,
                })
            )
            .toBe('Winter');
    });

    it('[TC76258] AG Grid - Advanced Sort - Sort on consolidation', async () => {
        await resetDossierState({
            credentials: gridConstants.gridTestUser,
            dossier: sortConsolidation,
        });
        const item = 'Cost';
        await libraryPage.openDossier(sortConsolidation.name);

        // without column set
        await toc.openPageFromTocMenu({ chapterName: 'Without column set' });
        await grid.selectGridContextMenuOption({
            title: 'without column set',
            headerName: item,
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await advancedSort.openSortByDropdown(1);
        await since(
            'Consolidation, without column set, the sort by item count should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortByListItemsCount(1))
            .toBe(1);
        await advancedSort.selectSortByDropdownItem(item);
        await since(
            'Consolidation, without column set, the selected sort by item should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe(item);
        await advancedSort.save();
        await since(
            'without column set,The first element of Customer attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'without column set', headerName: 'Season', agGrid: true }))
            .toBe('Spring');

        // with column set
        await toc.openPageFromTocMenu({ chapterName: 'With column set' });
        await grid.selectGridContextMenuOption({
            title: 'single - on column',
            headerName: item,
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await advancedSort.openAndselectSortByAndOrder(1, item, 'Descending');
        await since(
            'Consolidation, with single column set, the selected sort by item should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe(item);
        await advancedSort.save();
        await since(
            'with single column set,The first element of Customer attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'single - on column', headerName: 'Season', agGrid: true }))
            .toBe('Autumn');
    });

    it('[TC76259] AG Grid - Advanced Sort - Sort on custom group', async () => {
        await resetDossierState({
            credentials: gridConstants.gridTestUser,
            dossier: sortCustomGroup,
        });
        const item = 'Cost';
        await libraryPage.openDossier(sortCustomGroup.name);

        // without column set
        await toc.openPageFromTocMenu({ chapterName: 'Without column set' });
        await grid.selectGridContextMenuOption({
            title: 'without column set',
            headerName: item,
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await advancedSort.openSortByDropdown(1);
        await since(
            'Custom Group, without column set, the sort by item count should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortByListItemsCount(1))
            .toBe(1);
        await advancedSort.selectSortByDropdownItem(item);
        await since(
            'Custom Group, without column set, the selected sort by item should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe(item);
        await advancedSort.save();
        await since(
            'without column set,The first element of Customer attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(
                await grid.firstElmOfHeader({ title: 'without column set', headerName: 'Age Groups', agGrid: true })
            )
            .toBe('25-35');

        // with column set
        await toc.openPageFromTocMenu({ chapterName: 'With column set' });
        await grid.selectGridContextMenuOption({
            title: 'single - on column',
            headerName: item,
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await advancedSort.openAndselectSortByAndOrder(1, item, 'Descending');
        await since(
            'Custom Group, with single column set, the selected sort by item should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe(item);
        await advancedSort.save();
        await since(
            'with single column set,The first element of Customer attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(
                await grid.firstElmOfHeader({ title: 'single - on column', headerName: 'Age Groups', agGrid: true })
            )
            .toBe('> 60');
    });

    it('[TC76260] AG Grid - Advanced Sort - XFunc with normal sort', async () => {
        await resetDossierState({
            credentials: gridConstants.gridTestUser,
            dossier: sortGridTemplate,
        });
        await libraryPage.openDossier(sortGridTemplate.name);
        await toc.openPageFromTocMenu({ chapterName: 'Both Columns and Rows' });

        // select advanced sort
        await grid.selectGridContextMenuOption({
            title: 'AG Grid',
            headerName: 'Region DESC',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await advancedSort.openAndselectSortByAndOrder(1, 'Region DESC', 'Descending');
        await advancedSort.openAndselectSortByAndOrder(2, 'Books; Profit', 'Ascending');
        await advancedSort.save();
        await since(
            'select advanced sort,The first element of Customer attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'AG Grid', headerName: 'Region DESC', agGrid: true }))
            .toBe('Web');

        // check normal sort
        await grid.openGridElmContextMenu({ title: 'AG Grid', headerName: 'Region DESC', agGrid: true });
        await since('XFunc with normal sort, Sort Descending should be selected')
            .expect(await grid.isContextMenuItemSelected('Sort Descending'))
            .toBe(true);

        // select normal sort
        await grid.clickMenuOptionInLevel({ level: 0, option: 'Sort Ascending' });
        await grid.sleep(1000); // wait till grid loading
        await since(
            'select normal sort,The first element of Customer attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'AG Grid', headerName: 'Region DESC', agGrid: true }))
            .toBe('Central');

        // check advanced sort
        await grid.selectGridContextMenuOption({
            title: 'AG Grid',
            headerName: 'Region DESC',
            firstOption: 'Advanced Sort ...',
            agGrid: true,
        });
        await since(
            'XFunc with normal sort, the selected sort by item should be #{expected}, instead we have #{actual}'
        )
            .expect(await advancedSort.getSortBySelectedText(1))
            .toBe('Region DESC');
        await since('XFunc with normal sort, the selected order item should be #{expected}, instead we have #{actual}')
            .expect(await advancedSort.getOrderSelectedText(1))
            .toBe('Ascending');
        await advancedSort.cancel();
    });
});
