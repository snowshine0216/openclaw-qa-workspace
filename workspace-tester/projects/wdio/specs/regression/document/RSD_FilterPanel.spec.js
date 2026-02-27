import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import RsdFilterPanel from '../../../pageObjects/document/RsdFilterPanel.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_RSD') };

describe('RSD_FilterPanel', () => {
    const document = {
        id: '860E132246021BE12C6D48BB91D36F89',
        name: 'F_D1',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const documentFormat = {
        id: '852A88EB41212736625F2B99B910E5AC',
        name: 'F_D1_FormatAndProperty',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const documentWithSearchboxFilter = {
        id: '6023C97F4678AD7780105FAF343D6781',
        name: '(Auto) SearchBox Selector',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const { credentials } = specConfiguration;

    let slider, checkbox, radiobutton, dropdown, linkbar, buttonbar, listbox, searchbox;

    let { libraryPage, dossierPage, rsdGrid, selectorObject, userAccount, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        // reset rsd
        await resetDossierState({
            credentials: credentials,
            dossier: document,
        });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC71360_01] Validate multi selector in filter panel', async () => {
        slider = selectorObject.getSliderByName('Selector51');
        checkbox = selectorObject.checkbox;
        radiobutton = selectorObject.radiobutton;
        dropdown = selectorObject.dropdown;
        linkbar = selectorObject.linkbar;
        buttonbar = selectorObject.buttonbar;
        listbox = selectorObject.listbox;
        searchbox = selectorObject.searchbox;
        await libraryPage.openDossier(document.name);
        await slider.dragSlider({ x: 10, y: 0 });
        await checkbox.clickItems(['Books', 'Movies']);
        await radiobutton.selectItemByText('Computers');
        await dropdown.openDropdown();
        await dropdown.selectItemByText('Microsoft Natural Keyboard Elite V2.0');
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await dossierPage.waitForDossierLoading();
        await since('The first 6 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(2, 1, 6))
            .toEqual(['2015', 'Electronics', 'Computers', '$24,090', '$ 837', '$4,953']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71360_01', 'Change selector in filter panel46', {
            tolerance: 0.12,
        });
        await linkbar.multiSelectNth(['(All)', 'Mid-Atlantic']);
        await dossierPage.waitForDossierLoading();
        await buttonbar.multiSelectNth(['All', 'Books']);
        const filterPanel = RsdFilterPanel.createbyName('Filters47');
        await filterPanel.scrollFilterPanelToBottom();
        await dossierPage.waitForDossierLoading();
        await listbox.selectItemByText('Literature');
        await searchbox.input('b');
        await searchbox.selectItemByText('Brave New World');
        await dossierPage.waitForDossierLoading();
        const grid2 = rsdGrid.getRsdGridByKey('W49');
        await since('The first 6 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid2.selectCellInOneRow(2, 1, 6))
            .toEqual(['Mid-Atlantic', 'Books', 'Literature', '$1,805', '$ 94', '$445']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71360_02', 'Change selector in filter panel48', {
            tolerance: 0.14,
        });
    });

    it('[TC71360_02] Validate context menu in filter panel', async () => {
        // Change spec due to DE206740
        checkbox = selectorObject.checkbox;
        radiobutton = selectorObject.radiobutton;
        linkbar = selectorObject.linkbar;
        buttonbar = selectorObject.buttonbar;
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login(credentials);
        await libraryPage.openDossier(document.name);
        await checkbox.clickItems(['Movies', 'Music']);
        await since('The Movies and Music checked should be #{expected}, instead we get #{actual}')
            .expect(await checkbox.isItemsChecked(['Books', 'Electronics']))
            .toBe(true);
        await radiobutton.selectItemByText('Business');
        await since('Selected element on radio button should be #{expected}, while we get #{actual}')
            .expect(await radiobutton.getSelectedItemText())
            .toBe('Business');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71360_03', 'Change selector in filter panel46', {
            tolerance: 0.12,
        });
        // Unset All Filters in filter panel46
        const filterPanel = RsdFilterPanel.createbyName('Filters45');
        await filterPanel.openAndChooseMenuByText('Unset All Filters');
        await since('The All checked should be #{expected}, instead we get #{actual}')
            .expect(await checkbox.isItemsChecked(['(All)']))
            .toBe(true);
        await since('Selected element on radio button should be #{expected}, while we get #{actual}')
            .expect(await radiobutton.getSelectedItemText())
            .toBe('(All)');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71360_04', 'Unset all filters in filter panel46', {
            tolerance: 0.12,
        });
        // Collapse all in filter panel46
        await filterPanel.openAndChooseMenuByText('Collapse all');
        await takeScreenshotByElement(
            dossierPage.getDocView(),
            'TC71360_05',
            'Collapse all filters in filter panel46',
            { tolerance: 0.12 }
        );
        // Expand all in filter panel46
        await filterPanel.openAndChooseMenuByText('Expand all');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71360_06', 'Expand all filters in filter panel46', {
            tolerance: 0.12,
        });
        // Disable Auto-Apply changes
        const filterPanel2 = RsdFilterPanel.createbyName('Filters47');
        await filterPanel2.openAndChooseMenuByText('Auto-Apply changes');
        await linkbar.multiSelectNth(['(All)', 'Northeast']);
        await buttonbar.multiSelectNth(['All', 'Electronics']);
        await dossierPage.waitForDossierLoading();
        let grid = rsdGrid.getRsdGridByKey('W49');
        await since('The first 6 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(2, 1, 6))
            .toEqual(['Central', 'Books', 'Art & Architecture', '$53,293', '$ 2,042', '$15,967']);
        await filterPanel2.clickApply();
        grid = rsdGrid.getRsdGridByKey('W49');
        await since('The first 6 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(2, 1, 6))
            .toEqual(['Northeast', 'Electronics', 'Audio Equipment', '$763,190', '$ 26,392', '$154,948']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71360_07', 'Apply filters in filter panel48', {
            tolerance: 0.13,
        });
        await filterPanel2.clickUnset();
        grid = rsdGrid.getRsdGridByKey('W49');
        await since(
            'The first 6 cells of the 2nd row in grid should be #{expected} after unset, instead we get #{actual}'
        )
            .expect(await grid.selectCellInOneRow(2, 1, 6))
            .toEqual(['Central', 'Books', 'Art & Architecture', '$53,293', '$ 2,042', '$15,967']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71360_08', 'Unset filters in filter panel48', {
            tolerance: 0.12,
        });
        await linkbar.multiSelectNth(['(All)', 'South']);
        await filterPanel2.openAndChooseMenuByText('Apply Now');
        grid = rsdGrid.getRsdGridByKey('W49');
        await since('The first 6 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(2, 1, 6))
            .toEqual(['South', 'Books', 'Art & Architecture', '$57,277', '$ 2,438', '$16,878']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71360_09', 'Apply now filters in filter panel48', {
            tolerance: 0.12,
        });
    });

    it('[TC80300] Validate collapsed all and expanded all in filter panel', async () => {
        // Change spec due to DE206740
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login(credentials);
        await libraryPage.openDossier(document.name);
        // Collapse all when all selecctors expanded
        const filterPanel3 = RsdFilterPanel.createbyName('Filters45');
        await filterPanel3.openAndChooseMenuByText('Collapse all');
        await takeScreenshotByElement(
            dossierPage.getDocView(),
            'TC71360_10',
            'Collapse all filters when all selectors expanded',
            { tolerance: 0.12 }
        );

        await filterPanel3.clickSelectorMenu('Selector51');
        // Collapse all when partial selecctor expanded
        await filterPanel3.openAndChooseMenuByText('Collapse all');
        await takeScreenshotByElement(
            dossierPage.getDocView(),
            'TC71360_11',
            'Collapse all filters when partial expanded',
            { tolerance: 0.12 }
        );

        // Expand all when all selecctors collapsed
        await filterPanel3.openAndChooseMenuByText('Expand all');
        await takeScreenshotByElement(
            dossierPage.getDocView(),
            'TC71360_12',
            'Expand all filters when all selectors collapsed',
            { tolerance: 0.12 }
        );

        await filterPanel3.clickSelectorMenu('Selector53');
        // Expand all when partial selecctors collapsed
        await filterPanel3.openAndChooseMenuByText('Expand all');
        await takeScreenshotByElement(
            dossierPage.getDocView(),
            'TC71360_13',
            'Expand all filters when partial selectors collapsed',
            { tolerance: 0.12 }
        );
    });

    it('[TC80301] Validate Calendar selector in filter panel', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: documentFormat,
        });
        await libraryPage.openDossier(documentFormat.name);
        //select calendar in filter panel
        const calendarSelector = selectorObject.getCalendarByName('Selectorc2b');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71360_14', 'Initial render');
        await calendarSelector.openFromCalendar();
        await calendarSelector.selectDate('2014', 'Jan', '9');
        await calendarSelector.openToCalendar();
        await calendarSelector.selectDate('2014', 'Feb', '15');
        await takeScreenshotByElement(
            dossierPage.getDocView(),
            'TC71360_15',
            'Change calendar selector in filter panel'
        );
    });

    it('[TC80302] Validate MQ and MetricSlider selecctor in filter panel', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: documentFormat,
        });
        await libraryPage.openDossier(documentFormat.name);

        //change metric slider selector
        const metricSlider = selectorObject.getMetricSliderByName('Selector616');
        await metricSlider.dragSlider({ x: 100, y: 0 }, 'top');
        await metricSlider.inputToEndPoint(50000);
        await takeScreenshotByElement(
            dossierPage.getDocView(),
            'TC71360_16',
            'Change metric slider selector in filter panel'
        );

        //change metric qualification selector
        const metricQualification = selectorObject.getMetricQualificationByName('Selectore67');
        await metricQualification.openPatternDropdown();
        await metricQualification.selectNthItem(5, 'Less than');
        await metricQualification.inputValue(1000);
        await takeScreenshotByElement(
            dossierPage.getDocView(),
            'TC71360_17',
            'Change metric qualification selector in filter panel'
        );
    });

    it('[TC80302_01] Validate searchbox selector in filter panel', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: documentWithSearchboxFilter,
        });
        await libraryPage.openDossier(documentWithSearchboxFilter.name);

        // change search box filter panel with multiple selections
        let searchBox = selectorObject.getSearchboxByName('Customer Address');
        await searchBox.input('Flora');
        await searchBox.selectItemsByText(['(All search results)', '10 Flora Ave']);
        since('After search ave for customer address filter panel, the selected items should be #{expected}, instead we get #{actual}')
            .expect(await searchBox.getSelectedItemsText())
            .toEqual(['114 Floral Ave']);

        // change search box selector with multiple selections
        searchBox = selectorObject.getSearchboxByName('Customer');
        await searchBox.input('wendy');
        await searchBox.selectItemsByText(['Aafedt:Wendy']);
        await searchBox.input('wink');
        await searchBox.selectItemsByText(['Winkler:Dominick']);
        since('After search wendy for customer filter panel, the selected items should be #{expected}, instead we get #{actual}')
            .expect(await searchBox.getSelectedItemsText())
            .toEqual(['Aafedt:Wendy', 'Winkler:Dominick']);

        // change search box selector with single selection
        searchBox = selectorObject.getSearchboxByName('Item');
        await searchBox.input('100');
        await searchBox.selectItemsByText(['100 Places to Go While Still Young at Heart']);
        await searchBox.clearAllSelections();
        await searchBox.input('50');
        await searchBox.selectItemsByText(['50 Favorite Rooms']);
        since('After search 100 and 50 for item filter panel, the selected items should be #{expected}, instead we get #{actual}')
            .expect(await searchBox.getSelectedItemsText())
            .toEqual(['50 Favorite Rooms']);

    });
        
});

export const config = specConfiguration;
