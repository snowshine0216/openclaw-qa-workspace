import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { addDays, getStringOfDate, getToday } from '../../../utils/DateUtil.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('E2E Selector', () => {
    const document = {
        id: 'E0A287A543C415BDE985778B5CFD7764',
        name: 'Sample RSD with selector and link drill',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let {
        libraryPage,
        dossierPage,
        toc,
        loginPage,
        rsdGrid,
        selector,
        selectorObject,
        panelSelector,
        slider,
        rsdPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(browsers.params.credentials);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: document,
        });

        // open selector page
        await libraryPage.openDossier(document.name);
        await toc.openPageFromTocMenu({ chapterName: 'Selector' });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    // 1. switch to Overview Panel (button list selector)
    //     - check all the panel names are listed (action type=Select Panel)
    //     - select 'Overview' to filter
    // 2. verify Check Box selector:
    //     - select Music to filter
    //     - deselect Books, Movies to filter
    // 3. verify Metric Slider selector
    //     - drag left button to 40% directly
    //     - click on right button, input 80 to the box, and apply
    // --------takeScreenshot to check selector property, format and filter results

    it('[TC65590_01] Selector property, format and manipulation - button bar, checkbox, metric slider', async () => {
        // Switch to Overview panel (Button list selector)
        panelSelector = selectorObject.getButtonbarByName('panelSelector');
        await panelSelector.selectNthItem(1, 'Overview');
        await since('Current slected panel(button bar selector) should be the first one: Overview')
            .expect(await panelSelector.isItemSelected(1, 'Overview'))
            .toBe(true);

        // Checkbox selector
        await selector.checkbox.clickItems(['Music', 'Books', 'Electronics']);
        await since('Items in checkbox selector - [Music] should be checked')
            .expect(await selector.checkbox.isItemsChecked(['Music']))
            .toBe(true);
        await since('Items in checkbox selector - [Books, Electronics] should be unchecked')
            .expect(await selector.checkbox.isItemsChecked(['Books', 'Electronics']))
            .toBe(false);
        await takeScreenshotByElement(selector.checkbox.getElement(), 'TC58942_27', 'DragMetricSliderSelector-Top');

        // Metric slider selector
        await selector.metricSlider.dragSlider({ x: 100, y: 0 }, 'top');
        await since('Drag slider, selector summary  should be #{expected}, instead we have #{actual}')
            .expect(await selector.metricSlider.getSliderSummary())
            .toBe('Between 35% and 52%');
        await selector.metricSlider.inputToEndPoint(80);
        await since('Input slider, selector summary  should be #{expected}, instead we have #{actual}')
            .expect(await selector.metricSlider.getSliderSummary())
            .toBe('Between 35% and 80%');
    });

    // 1.switch to Details- By Date panel
    // 2.verify Calendar selector
    //     - click From calendar icon, and select year 2014, month Jan, day 1
    //     - click To calendar icon, and select year 2014, month Jan, day 15
    //     - click to calendar icon, select dynamic date, select plus, click next stepper 2 times, and OK
    //  ---------getStringofDate() to format date to  avoid I18N differnet date format issues
    // 3. verify Searchbox selector
    //     - input keyword 'b' to search, check the search results
    //     - select 'Business' to filter
    //     - delete 'Cameras' from selected elements to filter
    // 4. verify Metric Qualification selector:
    //     - ppen qualification pattern dropdown, check the dropdown list item
    //     - select Greaterthan pattern, input 100, and apply
    // --------takeScreenshot to check selector property, format and filter results

    it('[TC65590_02] Selector general property, format and manipulation - calendar,searchbox and metric qualicaton', async () => {
        // Switch to another panel
        panelSelector = selectorObject.getButtonbarByName('panelSelector');
        await panelSelector.selectNthItem(4, 'Details- By Date');
        await since('Current selected panel should be the last one: Details- By Date')
            .expect(await panelSelector.isItemSelected(4, 'Details- By Date'))
            .toBe(true);

        // Calendar selector - calendar selection
        await selector.calendar.openFromCalendar();
        await selector.calendar.selectDate('2014', 'Jan', '1');
        // getStringOfDate() to unify format to avoid I18N date format issues
        await since('From date in calendar selector should be #{actural} while we expected #{expected}')
            .expect(getStringOfDate(await selector.calendar.getFromDate()))
            .toBe(getStringOfDate('1/1/2014'));
        await selector.calendar.openToCalendar();
        await selector.calendar.selectDate('2014', 'Jan', '15');
        await since('To date in calendar selector should be #{actural} while we expected #{expected}')
            .expect(getStringOfDate(await selector.calendar.getToDate()))
            .toBe(getStringOfDate('1/15/2014'));
        // Calendar selector - Dynamic calendar
        await selector.calendar.openToCalendar();
        await selector.calendar.clickDynamicDateCheckBox();
        await selector.calendar.selectDynamicCalendarDropdownItem(1, 'Plus');
        await selector.calendar.clickDynamicDayStepperNext(2);
        await selector.calendar.clickDynamicCalendarButton('OK');
        const expectedDate = getStringOfDate(addDays(2, getToday())); // dynamic date is changed based on Today
        await since('Dynamic date in calendar selector should be #{actural} while we expected #{expected}')
            .expect(getStringOfDate(await selector.calendar.getToDate()))
            .toBe(expectedDate);
        await takeScreenshotByElement(selector.calendar.getElement(), 'TC58942_28', 'AddSearchboxSelector-Business');

        // Searchbox selector
        await selector.searchbox.input('b');
        await since('Search results count in searchbox selector should be #{actural} while we expected #{expected}')
            .expect((await selector.searchbox.getSuggestionListItems()).length)
            .toBe(4);
        await selector.searchbox.selectItemByText('Business');
        await since('Selected items count in searchbox selector should be #{actural} while we expected #{expected}')
            .expect(await selector.searchbox.getSelectedItems().length)
            .toBe(2);
        await selector.searchbox.deleteItemByText('Cameras');
        await since('Selected items count in searchbox selector should be #{actural} while we expected #{expected}')
            .expect(await selector.searchbox.getSelectedItems().length)
            .toBe(1);
        await takeScreenshotByElement(selector.searchbox.getElement(), 'TC61856', 'DeleteSearchboxSelector-Cameras');

        // Metric qualification selector
        const selector1 = rsdPage.findSelectorByName('Selector0af');
        await selector1.metricQualification.openPatternDropdown();
        await since(
            'Patterns count in metric qualification selector should be #{actural} while we expected #{expected}'
        )
            .expect(await selector1.metricQualification.getDropdownListItems().length)
            .toBe(12);
        await selector1.metricQualification.selectNthItem(3, 'Greater than');
        await selector1.metricQualification.inputValue(100);
        await takeScreenshotByElement(
            selector1.metricQualification.getElement(),
            'TC58942_28',
            'SelectMetricQualificationPattern-GreaterThan'
        );
    });

    // 1. switch to 'Details- Subcategory' panel
    // 2. verify Link Bar selector
    //     - exclude Music to filter
    //     - not exclude 'Books' to filter
    // 3.verify Dropdown list selector:
    //     - open dropdown list, check the list items are filtered by 'Exclude Music and Electronics'
    //     - select 'Cameras' to filter
    // 4.verify Slider selector:
    //     - check all the metric names are listed (action type=Select Metric)
    //     - drag slider to ’Cost‘ to filter
    // -------takeScreenshot to check selector property, format and filter results

    it('[TC65590_03] Selector general property, format and manipulation - link bar, dropdown list and slider', async () => {
        // Switch  to another panel
        panelSelector = selectorObject.getButtonbarByName('panelSelector');
        await panelSelector.selectNthItem(2, 'Details- Subcategory');
        await rsdPage.waitAllToBeLoaded();
        await since('Current selected panel should be the second one: Details- Subcategory')
            .expect(await panelSelector.isItemSelected(2, 'Details- Subcategory'))
            .toBe(true);

        // Link bar selector
        await selector.linkbar.selectNthItem(4, 'Music');
        await since('Item in link bar selector - Music should be excluded')
            .expect(await selector.linkbar.isItemSelected(4, 'Music'))
            .toBe(true);
        await selector.linkbar.selectNthItem(1, 'Books');
        await since('Item in link bar selector - Books should NOT be excluded')
            .expect(await selector.linkbar.isItemSelected(1, 'Books'))
            .toBe(false);
        await takeScreenshotByElement(selector.linkbar.getElement(), 'TC58942_29', 'NotExcludeLinkBarSelector-Books');

        // Dropdown selector
        await selector.dropdown.openDropdown();
        await since('Items count in dropdown list selector should be #{expected}')
            .expect(await selector.dropdown.dropdownItemsCount())
            .toBe(13);
        await takeScreenshotByElement(
            selector.dropdown.getDropdownList(),
            'TC58942_29',
            'SelectDropdownSelector-Business'
        );
        await selector.dropdown.selectNthItem(3, 'Business');
        await rsdPage.waitAllToBeLoaded();
        await since('Current selected item in dropdown list selector should be Business')
            .expect(await selector.dropdown.getShownSelectedText())
            .toBe('Business');

        // Slider selector
        slider = selectorObject.getSliderByName('Slider');
        await slider.dragSlider({ x: 50, y: 0 });
        await since('Slider tooltip shoud be #{expected}, while we get #{actual}')
            .expect(await selector.slider.getSingleTooltipText())
            .toBe(`'Cost'`);
    });

    // 1. switch to 'Details- By Month' panel
    // 2. check Radio Button selector:
    //     - select 'All' to filter
    //     - select '2014' to filter
    // 3. check List Box selector:
    //     - single select 'Jan 2014' to filter
    //     - multiple select 'Mar 2014' , 'April 2014', 'Jun 2014' to filter
    // 4. verify Button List Selector on grid:
    //     - check all the attribute names are listed(action type=Select Attribute)
    //     - check vertical orientation
    //     - select 'Category' to filter
    // -------takeScreenshot to check selector property, format and filter results

    it('[TC65590_04] Selector general property, format and manipulation - radio button, listbox and button bar', async () => {
        // Switch to another panel
        panelSelector = selectorObject.getButtonbarByName('panelSelector');
        await panelSelector.selectNthItem(3, 'Details- By Month');
        await since('Current slected panel should be the third one: Details- By Month')
            .expect(await panelSelector.isItemSelected(3, 'Details- By Month'))
            .toBe(true);

        // Radio button selector
        await selector.radiobutton.selectNthItem(1, 'All');
        await since('All is displayed on radio button selector, and All should be selected')
            .expect(await selector.radiobutton.isItemSelected(1, 'All'))
            .toBe(true);
        await selector.radiobutton.selectNthItem(2, '2014');
        await since('Item in rardio button selector- 2014 should be selected')
            .expect(await selector.radiobutton.isItemSelected(2, '2014'))
            .toBe(true);
        await takeScreenshotByElement(selector.radiobutton.getElement(), 'TC58942_30', 'SelectRadiobutton-2014');

        // Listbox selector
        await selector.listbox.selectNthItem(2, 'Jan 2014');
        await since('Item in listbox selector- Jan 2014 should be selected')
            .expect(await selector.listbox.isItemSelected(2, 'Jan 2014'))
            .toBe(true);
        await selector.listbox.multiSelect(['Mar', 'Apr', 'Jun']);
        await since('After multi-select,items in listbox selector-[Mar 2014,Apr 2014, Jun 2014] should be selected')
            .expect(await selector.listbox.isItemSelected(7, 'Jun 2014'))
            .toBe(true);

        // Button list selector - action type: Select Attribute
        let attributeSelector = selectorObject.getButtonbarByName('attributeSelector');
        await attributeSelector.selectItemByText('Category');
        await attributeSelector.sleep(3000);
        await since('Item in button list selector - Category should be selected')
            .expect(await attributeSelector.isItemTextSelected('Category'))
            .toBe(true);
        await takeScreenshotByElement(
            attributeSelector.getElement(),
            'TC58942_30',
            'SelectButtonList-SelectAttribute-Category'
        );
    });

    // 1. switch to 'Details- By Month' panel
    // 2. verify Template Selector on grid:
    //     - select grid element 'Movies' under category column to filter
    // -------takeScreenshot to check selector property, format and filter results

    it('[TC65590_05] Template selector on grid', async () => {
        panelSelector = selectorObject.getButtonbarByName('panelSelector');
        await panelSelector.selectNthItem(4, 'Details- By Date');

        // Switch to another panel and select Category attribute
        await panelSelector.selectNthItem(3, 'Details- By Month');
        await since('Current slected panel should be the third one: Details- By Month')
            .expect(await panelSelector.isItemSelected(3, 'Details- By Month'))
            .toBe(true);
        let attributeSelector = selectorObject.getButtonbarByName('attributeSelector');
        await attributeSelector.selectItemByText('Category');
        await attributeSelector.sleep(3000);
        await since('Item in button list selector - Category should be selected')
            .expect(await attributeSelector.isItemTextSelected('Category'))
            .toBe(true);

        // Template selector
        let grid = rsdGrid.getRsdGridByKey('WFE8F32E1AD6746B9AB988DCB493147A1');
        await grid.clickCell('Movies');
        await rsdPage.waitAllToBeLoaded();
    });
});
