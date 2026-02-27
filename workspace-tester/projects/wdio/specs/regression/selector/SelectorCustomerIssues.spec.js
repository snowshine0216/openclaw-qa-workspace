import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_selector') };
const { credentials } = specConfiguration;

const tutorialProject = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

describe('Library Selector Customer Issues', () => {
    const docTC80380TC80381 = {
        id: 'CB6E4F1A4DE4811C58EC14BAB1E4CD40',
        name: 'TC80380/TC80381 multi-selector on filter panel (initial total, unset)',
        project: tutorialProject,
    };
    const docTC80382TC80382 = {
        id: 'A692CAC94B28C4C17427549702AC2448',
        name: 'TC80382/TC80382 standalone selector and template selector (disable drill, grid quick switch)',
        project: tutorialProject,
    };
    const docTC80384 = {
        id: '3EFAAA8048781958454ECA9F8263F6C8',
        name: 'TC80384 grid selector when grid element has special chars',
        project: tutorialProject,
    };
    const docTC80385 = {
        id: '1021DEA3422F9A18757019BD1B2C78F3',
        name: 'TC80385 Grid selector highlight when attribute on row',
        project: tutorialProject,
    };
    const docTC80379 = {
        id: '8082C43245E0D9F9EC2E7C88627DD1B8',
        name: 'TC80379 selector not cut off when document height can shrink',
        project: tutorialProject,
    };
    const docTC80387 = {
        id: 'B8D08A23432E1DBFE16457B097A21CB2',
        name: 'TC80387 empty data on selector',
        project: tutorialProject,
    };
    const docTC80388 = {
        id: '568F84CF499AE5A01AF094B6BEDBB8E3',
        name: 'TC80388 search box suggestion box for long name',
        project: tutorialProject,
    };
    const docTC80389 = {
        id: 'A00113CE487E84FD1CDE2A83CBDA43D0',
        name: 'TC80389 Grid font size changed after filtered by selector',
        project: tutorialProject,
    };
    const docTC80386 = {
        id: '20C965EF44CF44704BC5A0BF3D126522',
        name: 'TC80386 Selector with grid on fixed size',
        project: tutorialProject,
    };
    const docTC80390 = {
        id: '2C027E9C4A7AFABC3D769DA4D1DA6AE8',
        name: 'Selector XSS Attack - Converted from Dossier',
        project: tutorialProject,
    };
    const tolerance = 0.5;

    let { loginPage, selector, libraryPage, dossierPage, rsdPage, toc, rsdGrid, rsdGraph } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC80379] Customer issue - Document and Selector | 045.003: Verify selectors not cut of when document height can shrink', async () => {
        await resetDossierState({ credentials, dossier: docTC80379 });
        await libraryPage.openUrl(tutorialProject.id, docTC80379.id);
        // Check document height can shrink and grow
        await toc.openPageFromTocMenu({ chapterName: 'Height can shrink' });
        const selector1 = rsdPage.findSelectorByName('SelectorNotCutOff');
        await since('Document height cannot shrink and grow, selector last elemnt should be existed')
            .expect(await selector1.checkbox.isItemExisted('Rock'))
            .toBe(true);

        // Uncheck document height can shrink and grow
        await toc.openPageFromTocMenu({ chapterName: 'Height CANNOT shrink' });
        const selector2 = rsdPage.findSelectorByName('SelectorCutOff');
        await since('Document height cannot shrink and grow, selector last elemnt should NOT be existed')
            .expect(await selector2.checkbox.isItemExisted('Rock'))
            .toBe(false);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80379',
            'CustomerIssues_DocumentAndSelector_heightCannotShrink'
        );
    });

    it('[TC80380] Customer issue - FilterPanel and Selector | 045.003: Filters (selectors) in a filter panel do not display the initial total number of selections', async () => {
        await resetDossierState({ credentials, dossier: docTC80380TC80381 });
        await libraryPage.openUrl(tutorialProject.id, docTC80380TC80381.id);
        const title1 = await selector.buttonbar.getTitle();
        const title2 = await selector.checkbox.getTitle();

        // inital title element count when not select any elements
        await since('Buttonbarr title on filter panel: Initial title should be #{expected}, while we get #{actual}')
            .expect(await title1.getTitleText())
            .toBe('Category (4)');
        await since('Checkbox title on filter panel: Initial title should be #{expected}, while we get #{actual}')
            .expect(await title2.getTitleText())
            .toBe('Category (4)');
        await since('Checkbox title on filter panel: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Books');

        // title element count when select some element
        await selector.checkbox.clickItems(['Books']);
        await since('Books should be excluded')
            .expect(await selector.checkbox.isItemsChecked(['Books']))
            .toBe(false);
        await since(
            'Checkbox title on filter panel: After deselect some elements, title should be #{expected}, while we get #{actual}'
        )
            .expect(await title2.getTitleText())
            .toBe('Category (3 of 4)');
    });

    it('[TC80381] Customer issue - FilterPanel and Selector | Using the filter panel option to clear all filters', async () => {
        await resetDossierState({ credentials, dossier: docTC80380TC80381 });
        await libraryPage.openUrl(tutorialProject.id, docTC80380TC80381.id);

        // select element for all the selector
        await selector.checkbox.clickItems(['Books']);
        await since('Select element on checkbox, selected element total should be #{expected}, while we get #{actual}')
            .expect(await selector.checkbox.getSelectedItemsCount())
            .toBe(3);
        await selector.buttonbar.selectItemByText('Electronics');
        await since(
            'Select element on button bar, selected element total should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.buttonbar.getSeletedItemsCount())
            .toBe(3);
        await takeScreenshotByElement(
            selector.checkbox.getElement(),
            'TC80381',
            'CustomerIssues_FilterPanelAndSelector_unset_select'
        );

        // Unset all filter on filter panel
        const filterPanel = rsdPage.findFilterPanelByName('FiltersPanelWithMultiSelector');
        await filterPanel.openMenu();
        await filterPanel.clickMenuNthItem(1, 'Unset All Filters');
        await since('Unset all filters, checkbox selected element total should be #{expected}, while we get #{actual}')
            .expect(await selector.checkbox.getSelectedItemsCount())
            .toBe(5);
        await since(
            'Unset all filters, button bar selected element total should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.buttonbar.getSeletedItemsCount())
            .toBe(5);
        await since('Unset all filters, first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Books');
    });

    it('[TC80382] Customer issue - Grid and Selector | Quick Switch unresponsive after selection on Selector Targeting a Dataset', async () => {
        await resetDossierState({ credentials, dossier: docTC80382TC80382 });
        await libraryPage.openUrl(tutorialProject.id, docTC80382TC80382.id);

        // select element on selector
        await selector.checkbox.clickItems(['Books']);
        await since(
            'Select element on checkbox selector, selected element total should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.checkbox.getSelectedItemsCount())
            .toBe(2);
        await since(
            'Select element on checkbox selector, first grid element should be #{expected}, while we get #{actual}'
        )
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Books');

        // click quick switch
        const gridAndGraph = rsdPage.findGridAndGraphByName('targetGridGraph');
        await gridAndGraph.showQuickSwitch();
        await gridAndGraph.switchModeToGraph(false);
        await since('click quick switch, graph present should be #{expected}, while we get #{actual}')
            .expect(await rsdGraph.isRsdGraphPresent())
            .toBe(true);
    });

    it('[TC80383] Customer issue - Grid and Selector | Grid selector is not working in Presentation mode when disable drill in specific document', async () => {
        await resetDossierState({ credentials, dossier: docTC80382TC80382 });
        await libraryPage.openUrl(tutorialProject.id, docTC80382TC80382.id);

        // select element on selector
        await selector.checkbox.clickItems(['Books']);
        await since(
            'Select element on checkbox selector, selected element total should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.checkbox.getSelectedItemsCount())
            .toBe(2);
        await since(
            'Select element on checkbox selector, first grid element should be #{expected}, while we get #{actual}'
        )
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Books');

        // filter on grid (grid selector)
        const grid = rsdPage.findGridById('W979B4B6D1581461BA49C088AB2F96FAE');
        await grid.clickCell('Cameras');
        // await grid.waitForCurtainDisappear();
        // await since('filter on grid (grid selector), first grid element should be #{expected}, while we get #{actual}')
        //     .expect(await rsdGrid.getFirstGridCell()).toBe('Electronics');
    });

    it('[TC80384] Customer issue - Grid and Selector | 045.003: Special characters in attribute ID form grid selectors', async () => {
        await resetDossierState({ credentials, dossier: docTC80384 });
        await libraryPage.openUrl(tutorialProject.id, docTC80384.id);
        const grid = rsdPage.findGridById('WFF4B74365E3D45068C408D6F939D440C');

        await selector.radiobutton.selectItemByText('Books');
        await since(
            'Select element on radio button selector, selected element should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.radiobutton.getSelectedItemText())
            .toBe('Books');

        // Filter with special chars &
        await grid.clickCell('Art & Architecture');
        await rsdPage.waitAllToBeLoaded();
        await since('Select element on grid, text on the textfield should be #{expected}, while we get #{actual}')
            .expect(await rsdPage.textField.getFiledText())
            .toBe('Art & Architecture');

        // Filter with special chars -
        await grid.clickCell('Books - Miscellaneous');
        await rsdPage.waitAllToBeLoaded();
        await since('Select element on grid, text on the textfield should be #{expected}, while we get #{actual}')
            .expect(await rsdPage.textField.getFiledText())
            .toBe('Books - Miscellaneous');

        await selector.radiobutton.selectItemByText('Electronics');
        await since(
            'Select element on radio button selector, selected element should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.radiobutton.getSelectedItemText())
            .toBe('Electronics');

        // Filter with special chars '
        await grid.clickCell(`TV's`);
        await rsdPage.waitAllToBeLoaded();
        await since('Select element on grid, text on the textfield should be #{expected}, while we get #{actual}')
            .expect(await rsdPage.textField.getFiledText())
            .toBe(`TV's`);

        await selector.radiobutton.selectItemByText('Music');
        await since(
            'Select element on radio button selector, selected element should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.radiobutton.getSelectedItemText())
            .toBe('Music');

        // Filter with special chars /Music
        await grid.clickCell('Soul / R&B');
        await rsdPage.waitAllToBeLoaded();
        await since('Select element on grid, text on the textfield should be #{expected}, while we get #{actual}')
            .expect(await rsdPage.textField.getFiledText())
            .toBe('Soul / R&B');
    });

    it('[TC80385] Customer issue - Grid and Selector | Grid selections are not highlighted in a report service document when there are attribute selectors in the rows and columns.', async () => {
        await resetDossierState({ credentials, dossier: docTC80385 });
        await libraryPage.openUrl(tutorialProject.id, docTC80385.id);
        const tolerance = 0.3;
        const grid1 = rsdPage.findGridById('WF3BAFAE256A9431884AB76A3AA413BC5');
        const grid2 = rsdPage.findGridById('W5065F9DB49B4474EA9E5716AB8867852');

        // attribute both on column and row - row
        await grid1.clickCell('2016');
        await grid1.waitForCurtainDisappear();
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80385',
            'CustomerIssues_Grid_highlighe_attribueOnRow',
            {
                tolerance: tolerance,
            }
        );

        // attribute both on column and row - column
        await grid1.clickCell('Movies');
        await grid1.waitForCurtainDisappear();
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80385',
            'CustomerIssues_Grid_highlighe_attribueOnColumn',
            {
                tolerance: tolerance,
            }
        );

        // attribute only on row
        await grid2.clickCell('Electronics');
        await grid2.waitForCurtainDisappear();
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80385',
            'CustomerIssues_Grid_highlighe_attribueOnRowOnly',
            {
                tolerance: tolerance,
            }
        );
    });

    it('[TC80386] Customer issue - Grid and Selector | RS grids shift (with fixed column) when change the selector after column resized on Non 100% zoom', async () => {
        await resetDossierState({ credentials, dossier: docTC80386 });
        await libraryPage.openUrl(tutorialProject.id, docTC80386.id);

        const grid = rsdPage.findGridByKey('W47');

        // change grid width (Zoom = Fit Page)
        await grid.adjustColumnWidth(1, 30);

        // Select 'Books' to filter
        let preWidth = await grid.getTableWidth();
        await selector.dropdown.openDropdown();
        await selector.dropdown.selectItemByText('Books');
        await since('Change selector, the selected element should be #{expected}, while we get #{actual}')
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('Books');
        await since('Change selector, the grid table width should be greater than #{expected}, while we get #{actual}')
            .expect(await grid.getTableWidth())
            .toBeGreaterThan(preWidth - 3);
        await since('Change selector, the grid table width should be less than #{expected}, while we get #{actual}')
            .expect(await grid.getTableWidth())
            .toBeLessThan(preWidth + 3);
    });

    it('[TC80387] Customer issue - Selector | Null data on different types of selector', async () => {
        const tolerance = 0.2;
        await resetDossierState({ credentials, dossier: docTC80387 });
        await libraryPage.openUrl(tutorialProject.id, docTC80387.id);

        // check null data are displayed as empty
        await since('Empty data on listbox should be existed and display as empty')
            .expect(await selector.listbox.isItemExisted(''))
            .toBe(true);
        await since('Empty data on checkbox should be existed and display as empty')
            .expect(await selector.checkbox.isItemExisted(''))
            .toBe(true);
        await since('Empty data on button bar should be existed and display as empty')
            .expect(await selector.buttonbar.isItemExisted(''))
            .toBe(true);

        // select null data to filter
        await selector.linkbar.selectNthItem(2, '');
        await since(
            'Empty data on link bar should be deselected, thus selected element count should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.linkbar.getSeletedItemsCount())
            .toBe(2);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80387',
            'CustomerIssues_Selector_emptyData_deselect',
            {
                tolerance: tolerance,
            }
        );
    });

    it('[TC80388] Customer issue - Selector | Search box suggested box work fine for attributes with long names', async () => {
        await resetDossierState({ credentials, dossier: docTC80388 });
        await libraryPage.openUrl(tutorialProject.id, docTC80388.id);

        // search for long element
        await selector.searchbox.input('Work');
        await selector.searchbox.moveToSuggetionItem(
            2,
            'Working With Emotional Intelligence:16:Working With Emotional Intelligence'
        );
        await since('search for long element: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toContain('Networking');

        // select long name
        await selector.searchbox.selectNthItem(
            2,
            'Working With Emotional Intelligence:16:Working With Emotional Intelligence'
        );
        await since('The selected element total count should be #{expected}, while we get #{actual} ')
            .expect((await selector.searchbox.getSelectedItems()).length)
            .toBe(3);
        await since('sselect long name: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toContain('Emotional');
    });

    it('[TC80389] Customer issue - Grid and Selector |  After upgrade from 10.7 to 10.11 grid font increases in size when changing selector on filter panel that targets grid for multiple documents', async () => {
        const tolerance = 0.3;
        await resetDossierState({ credentials, dossier: docTC80389 });
        await libraryPage.openUrl(tutorialProject.id, docTC80389.id);

        // change group
        await rsdPage.groupBy.changeGroupBy('Electronics');
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80389',
            'CustomerIssues_Selector_gridFont_changeGroup',
            {
                tolerance: tolerance,
            }
        );
        // change selector
        await selector.radiobutton.selectItemByText('2016');
        await since('The selected element should be #{expected}, while we get #{actual} ')
            .expect(await selector.radiobutton.getSelectedItemText())
            .toBe('2016');
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80389',
            'CustomerIssues_Selector_gridFont_changeSelector',
            {
                tolerance: tolerance,
            }
        );
    });

    it('[TC80390] Customer issue - Selector | Validate XSS code is encoded on attribute when using as Selector', async () => {
        await resetDossierState({ credentials, dossier: docTC80390 });
        await libraryPage.openUrl(tutorialProject.id, docTC80390.id);

        const selector1 = rsdPage.findSelectorByName('Attack_Script_1');
        const selector2 = rsdPage.findSelectorByName('Attack_Script_2');

        await selector1.linkbar.selectNthItem(2, '><img />');
        await since('Deselecct ><img />: The deselected element central should NOT be selected')
            .expect(await selector1.linkbar.isItemSelected(2, '><img />'))
            .toBe(false);
        await selector2.linkbar.selectNthItem(2, '<script />');
        await since('Deselecct <script />: The deselected element central should NOT be selected')
            .expect(await selector2.linkbar.isItemSelected(2, '<script />'))
            .toBe(false);
        await since('first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toContain('Previoustablerow11');
    });
});
export const config = specConfiguration;
