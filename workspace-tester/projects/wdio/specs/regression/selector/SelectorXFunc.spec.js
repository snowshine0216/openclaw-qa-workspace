import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_selector') };
const { credentials } = specConfiguration;

const tutorialProject = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

describe('Selector X-Func', () => {
    const docConsolidation = {
        id: '650498A946A1E670A36BC4A2631B5EFF',
        name: 'Consolidation',
        project: tutorialProject,
    };
    const doccustomGroup = {
        id: '634F9A6546EF29BDA0AB8B9AC9DC6297',
        name: 'custom group',
        project: tutorialProject,
    };
    const docFilterPanel = {
        id: '37A96FEB4C51B8FF540C0BA628094217',
        name: 'Filter Panel',
        project: tutorialProject,
    };
    const docInfoWindow = {
        id: '6372733E4E158D9D80419B8281C51E9A',
        name: 'Info Window',
        project: tutorialProject,
    };
    const docPanelStack = {
        id: 'D2AD02C045BD6618CE9BE090B776F0A9',
        name: 'PanelStack',
        project: tutorialProject,
    };
    const docFilterPanelAndPanelStack = {
        id: '555A252E429EB97DA7E891A0002E62F5',
        name: 'FilterPanel and PanelStack',
        project: tutorialProject,
    };
    const docInfoWindowWithNSelector = {
        id: 'EA4E299045DB51D6ECA29CB2AF5CF6B2',
        name: '(AUTO) InfoWindow with multiple selector',
        project: tutorialProject,
    };
    const docDynamicText = {
        id: '2A49C2DE4407C2C12EE8B1894B47F855',
        name: '(AUTO) Dynamic text',
        project: tutorialProject,
    };
    const docSwitchPage = {
        id: 'F0BA09CD41693E78CBDFD2BAC3064A59',
        name: '(AUTO) Library Switch Page',
        project: tutorialProject,
    };

    let { loginPage, selector, libraryPage, dossierPage, rsdPage, toc, rsdGrid, panelStack, rsdGraph } =
        browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC80391] Library  | X-Func:  Validate selectors works with consolidation', async () => {
        const tolerance = 0.2;
        await resetDossierState({ credentials, dossier: docConsolidation });
        await libraryPage.openUrl(tutorialProject.id, docConsolidation.id);

        // radio button
        await selector.radiobutton.selectItemByText('Spring');
        await since(
            'X-Func on consolidation: [Radio button] Selected item should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.radiobutton.getSelectedItemText())
            .toBe('Spring');

        // dropdown
        await since('X-Func on consolidation: [Dropdown] Selected item should be #{expected}, while we get #{actual}')
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('Spring');

        // slider
        await since('X-Func on consolidation: [Slider] Tooltip shoud be #{expected}, while we get #{actual}')
            .expect(await selector.slider.getSingleTooltipText())
            .toBe(`'Spring'`);
        await since('Single select: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Spring');
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80391',
            'SelectorXFunc_consolidation_singleSelect',
            {
                tolerance: tolerance,
            }
        );

        // checkbox
        await selector.checkbox.clickItems(['Winter']);
        await since(
            'X-Func on consolidation: [Checkbox] Selected item count should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.checkbox.getSelectedItemsCount())
            .toBe(2);

        // button bar
        await since(
            'X-Func on consolidation: [Linkbar] Selected item count should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.buttonbar.getSeletedItemsCount())
            .toBe(2);

        // list box
        await since(
            'X-Func on consolidation: [Listbox] Selected item count should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.listbox.getSeletedItemsCount())
            .toBe(2);
        await since('Multi select: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Winter');
    });

    it('[TC80392] Library  | X-Func: Validate selectors works with custom group', async () => {
        const tolerance = 0.2;

        await resetDossierState({ credentials, dossier: doccustomGroup });
        await libraryPage.openUrl(tutorialProject.id, doccustomGroup.id);

        // dropdown
        await selector.dropdown.openDropdown();
        await selector.dropdown.selectItemByText('All the rest');
        await since('X-Func on custom group: [Dropdown] Selected item should be #{expected}, while we get #{actual}')
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('All the rest');

        // radio button
        await since(
            'X-Func on custom group: [Radio button] Selected item should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.radiobutton.getSelectedItemText())
            .toBe('All the rest');

        // slider
        await since('X-Func on custom group: [Slider] Tooltip shoud be #{expected}, while we get #{actual}')
            .expect(await selector.slider.getSingleTooltipText())
            .toBe(`'All the rest'`);
        await since('Single select: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('All the rest');

        // button bar
        await selector.buttonbar.selectItemByText('South');
        await since(
            'X-Func on custom group: [Buttonbar] Selected item count should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.buttonbar.getSeletedItemsCount())
            .toBe(2);

        // checkbox
        await since(
            'X-Func on custom group: [Checkbox] Selected item count should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.checkbox.getSelectedItemsCount())
            .toBe(2);

        // list box
        await since(
            'X-Func on custom group: [Listbox] Selected item count should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.listbox.getSeletedItemsCount())
            .toBe(2);
        await since('Multi select: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('South');
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80391',
            'SelectorXFunc_customGroup_multiSelect',
            {
                tolerance: tolerance,
            }
        );
    });

    it('[TC80393] Library  | X-Func:  Validate selectors works with panel stack', async () => {
        await resetDossierState({ credentials, dossier: docPanelStack });
        await libraryPage.openUrl(tutorialProject.id, docPanelStack.id);

        // standalone listbox - target panel stack
        await selector.listbox.selectItemByText('PanelSelector');
        await since('X-Func on panel stack: [listbox] Selected item should be #{expected}, while we get #{actual}')
            .expect(await selector.listbox.getSelectedItemText())
            .toEqual(['PanelSelector']);
        await since('X-Func on panel stack: panel present should be #{expected}, while we get #{actual}')
            .expect(await panelStack.isPanelPresent())
            .toBe(true);

        // button bar on panel stack - target to all the grid and graph inside and outside panel stack
        await selector.buttonbar.selectItemByText('2015');
        await since(
            'X-Func on panel stack: [ButtonBar] Selected item count should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.buttonbar.getSeletedItemsCount())
            .toBe(2);
        await since('X-Func on panel stack:2015 display should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.isCellDisplayed('2015'))
            .toBe(true);

        // check the grid and graph inside panel stack which should be filtered
        const title = rsdPage.findPanelStackByName('PanelStack1').getTitle();
        await title.clickLeftArrow();
        await since('click left arrow, graph present should be #{expected}, while we get #{actual}')
            .expect(await rsdGraph.isRsdGraphPresent())
            .toBe(true);
    });

    it('[TC80394] Library  | X-Func: Validate selectors works with filter panel', async () => {
        await resetDossierState({ credentials, dossier: docFilterPanel });
        await libraryPage.openUrl(tutorialProject.id, docFilterPanel.id);

        // checkbox on filter panel - target another filter panel
        // Auto-Apply changes
        await selector.checkbox.clickItems(['Music']);
        await since(
            'X-Func on filter panel: [Checkbox] Selected item count should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.checkbox.getSelectedItemsCount())
            .toBe(2);
        await since(
            'X-Func on filter panel: [Listbox] Displayed item count should be #{expected}, while we get #{actual}'
        )
            .expect((await selector.listbox.getListBoxListItems()).length)
            .toBe(13);
        await since('X-Func on filter panel: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toContain('Audio');

        // listbox on filter panel - target grid
        // NOT Auto-Apply changes
        await selector.listbox.multiSelect(['Country', 'Alternative']);
        await since(
            'X-Func on filter panel: [Listbox] Before apply, seletected item count should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.listbox.getSeletedItemsCount())
            .toBe(2);
        await takeScreenshotByElement(
            selector.listbox.getElement(),
            'TC80394',
            'SelectorXFunc_FilterPanel_BeforeManualApply'
        );

        // click apply
        const filterPanel = rsdPage.findFilterPanelByName('ListBoxFilterPanel');
        await filterPanel.clickApply();
        await since(
            'X-Func on filter panel: [Listbox] After apply, seletected item count should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.listbox.getSeletedItemsCount())
            .toBe(2);
        await since('X-Func on filter panel: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Alternative');

        // unset All filters
        await filterPanel.openMenu();
        await filterPanel.clickUnset();
        await since(
            'X-Func on filter panel: [Listbox] After unset, seletected item count should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.listbox.getSeletedItemsCount())
            .toBe(13);
        await since('X-Func on filter panel: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Art & Architecture');
        await takeScreenshotByElement(
            selector.listbox.getElement(),
            'TC80394',
            'SelectorXFunc_FilterPanel_AfterManualApply'
        );
    });

    it('[TC80395] Library  | X-Func: Validate selectors works with information window', async () => {
        await resetDossierState({ credentials, dossier: docInfoWindow });
        await libraryPage.openUrl(tutorialProject.id, docInfoWindow.id);

        // standalone radio button - target grid
        await selector.radiobutton.selectItemByText('Books');
        await since(
            'X-Func on information window: [Radio button] Selected item should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.radiobutton.getSelectedItemText())
            .toBe('Books');

        // template selctor on grid - target infomation window
        const grid1 = rsdPage.findGridById('W060B51BA656C419188130597D5BA9931');
        await grid1.clickCell('Business');
        const infoWindow = rsdPage.findPanelStackByName('InfoWindowWithGraph');
        await since('X-Func on information window: [Grid selector] Information window should appear')
            .expect(await infoWindow.isPanelPresent())
            .toBe(true);
    });

    it('[TC80396] Library  | X-Func: Validate selector check and uncheck All with filter panel', async () => {
        await resetDossierState({ credentials, dossier: docFilterPanelAndPanelStack });
        await libraryPage.openUrl(tutorialProject.id, docFilterPanelAndPanelStack.id);
        await rsdPage.waitAllToBeLoaded();
        const filterPanel = rsdPage.findFilterPanelByName('CheckboxPanel');
        const selector = rsdPage.findSelectorByName('SubcategorySelector');
        // Uncheck '(All)'
        await selector.checkbox.clickItemByText('(All)');
        await since('Check All :  grid present should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.isGridPresnt())
            .toBe(false);
        // -- check selector
        await since('X-Func on filter panel: Unselect All, All should Not be selected')
            .expect(await selector.checkbox.isItemsChecked(['(All)']))
            .toBe(false);
        // -- scroll and check filtere panel
        await filterPanel.scrollFilterPanelToBottom();
        await filterPanel.scrollFilterPanelToTop();

        // Check '(All)'
        await selector.checkbox.clickItemByText('(All)');
        await since('Check All :  grid present should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.isGridPresnt())
            .toBe(true);
        // -- check selector
        await since(
            'X-Func on filter panel: Select All, selected item count should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.checkbox.getSelectedItemsCount())
            .toBe(25);
        // -- scroll and check filtere panel
        await filterPanel.scrollFilterPanelToBottom();
        await takeScreenshotByElement(
            selector.checkbox.getElement(),
            'TC80396',
            'SelectorXFunc_FilterPanel_CheckAll_Scroll'
        );
    });

    // DE45243
    it('[TC80397] Library  | X-Func: Validate selector with filter panel unset all filters', async () => {
        // -Check: 'Movies' and 'Music' is checked
        await resetDossierState({ credentials, dossier: docFilterPanelAndPanelStack });
        await libraryPage.openUrl(tutorialProject.id, docFilterPanelAndPanelStack.id);
        await rsdPage.waitAllToBeLoaded();
        const filterPanel = rsdPage.findFilterPanelByName('CheckboxPanel');
        const selector = rsdPage.findSelectorByName('CategorySelector');
        await since('X-Func on filter panel: Movies, Music should be selected')
            .expect(await selector.checkbox.isItemsChecked(['Movies', 'Music']))
            .toBe(true);

        // Select element
        await selector.checkbox.clickItemByText('Books');
        await since('X-Func on filter panel: Select elemnt, Books should be selected')
            .expect(await selector.checkbox.isItemsChecked(['Books']))
            .toBe(true);

        // Unset All Filters
        await filterPanel.openMenu();
        await filterPanel.clickMenuNthItem(1, 'Unset All Filters');
        await rsdPage.waitAllToBeLoaded();
        // -Check: 'Movies' and 'Music' is checked
        await since('X-Func on filter panel: After Unset, Movies, Music should be selected')
            .expect(await selector.checkbox.isItemsChecked(['Movies', 'Music']))
            .toBe(true);
        // -Check: 'Books' is  not checked
        await since('X-Func on filter panel: After Unset, Books should NOT be selected')
            .expect(await selector.checkbox.isItemsChecked(['Books']))
            .toBe(false);
    });

    it('[TC80398] Library  | X-Func: Validate selectors works with information window when there are two selectors', async () => {
        await resetDossierState({ credentials, dossier: docInfoWindowWithNSelector });
        await libraryPage.openUrl(tutorialProject.id, docInfoWindowWithNSelector.id);
        await rsdPage.waitAllToBeLoaded();
        const infoWindow = rsdPage.findPanelStackByName('InfoPanel');

        // select drodpwon element
        await selector.dropdown.openDropdown();
        await selector.dropdown.selectItemByText('2014');
        await rsdPage.waitAllToBeLoaded();
        await since(
            'X-Func on information window with multiple selector, select dropdown, selected items should be #{expected}, while we get #{actual}'
        )
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('2014');
        await since(
            'X-Func on information window with multiple selector, select dropdown, Information window should appear'
        )
            .expect(await infoWindow.isPanelPresent())
            .toBe(true);

        await infoWindow.close();
        // select radio button
        await selector.radiobutton.selectItemByText('2016');
        await rsdPage.waitAllToBeLoaded();
        await since(
            'X-Func on information window with multiple selector, select radio button, Information window should appear'
        )
            .expect(await infoWindow.isPanelPresent())
            .toBe(true);
    });

    it('[TC80400] Library  | X-Func: Validate selectors works with dynamic text', async () => {
        const { selector, textField } = rsdPage;
        await resetDossierState({ credentials, dossier: docDynamicText });
        await libraryPage.openUrl(tutorialProject.id, docDynamicText.id);
        await rsdPage.waitAllToBeLoaded();

        await since('X-Func on dynamic text, Central on text filed should be present by default')
            .expect(await textField.isTextPresent('Central'))
            .toBe(true);

        // change element
        await selector.dropdown.openDropdown();
        await selector.dropdown.selectItemByText('Northeast');
        await since('X-Func on dynamic text, selected items should be #{expected}, while we get #{actual}')
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('Northeast');
        await since('X-Func on dynamic text, Northeast on text filed should be present')
            .expect(await textField.isTextPresent('Northeast'))
            .toBe(true);
        await since(
            'X-Func on dynamic text, Northeast text filed title(tooltip) should be #{expected}, while we get #{actual} '
        )
            .expect(await textField.getTextFiledTitle('Northeast'))
            .toBe('Northeast');
    });

    it('[TC79941] Library | X-Func: Validate selection works fine wen switch page back on library', async () => {
        await resetDossierState({ credentials, dossier: docSwitchPage });
        await libraryPage.openUrl(tutorialProject.id, docSwitchPage.id);

        // select element in page Customzied
        await toc.openPageFromTocMenu({ chapterName: 'Customized' });
        const verticalSelector1 = rsdPage.findSelectorByName('customizedCategory');
        await verticalSelector1.checkbox.clickItems(['Books']);
        await rsdPage.waitAllToBeLoaded();
        await since('Do selection on Page Customized: Books should be selected')
            .expect(await verticalSelector1.checkbox.isItemsChecked(['Books', 'Music']))
            .toBe(true);
        await since('Do selection on Page Customized: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Books');

        // Switch page, and do selection on Page Default
        await toc.openPageFromTocMenu({ chapterName: 'Default' });
        const verticalSelector2 = rsdPage.findSelectorByName('defaultRegion');
        await verticalSelector2.checkbox.clickItems(['CustomizedAll']);
        await rsdPage.waitAllToBeLoaded();
        await since('Do selection on Page Default: Option for all should be selected')
            .expect(await verticalSelector2.checkbox.isItemsChecked(['CustomizedAll']))
            .toBe(true);

        // Switch page back to Customized, changge selection
        await toc.openPageFromTocMenu({ chapterName: 'Customized' });
        await verticalSelector1.checkbox.clickItems(['Books']);
        await rsdPage.waitAllToBeLoaded();
        await since('Switch page back: Books should NOT be selected')
            .expect(await verticalSelector1.checkbox.isItemsChecked(['Books']))
            .toBe(false);
        await since('Switch page back: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Music');
    });
});
export const config = specConfiguration;
