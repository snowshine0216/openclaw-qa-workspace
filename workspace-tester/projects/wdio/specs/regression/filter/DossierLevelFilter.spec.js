import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_filter') };

const project = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

const browserWindow = {
    
    width: 1200,
    height: 1200,
};

let {
    loginPage,
    filterPanel,
    libraryPage,
    attributeSlider,
    searchBoxFilter,
    radiobuttonFilter,
    checkboxFilter,
    calendarFilter,
    mqSliderFilter,
    mqFilter,
    filterSummaryBar,
    toc,
    grid,
    dossierPage,
} = browsers.pageObj1;

describe('Dossier level filter', () => {
    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC67833_01] Validate dossier level filter in same style can sync in Library - checkbox', async () => {
        const dossier = {
            id: '18EA3B7D4A68232D0903CAB881F3281C',
            name: 'Dossier level filter - multiple filters - same style',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();

        /***** check filter in checkbox style can sync *****/
        // check dossier level icon and default selection
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC67833', 'DossierLevelFilter');
        await await since(
            'Default summary for Customer in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Customer'))
            .toBe('(exclude Aaby:Alen, Aadland:Miko, +8)');

        // switch to other chapters, edit filter, filter selections can sync
        await toc.openPageFromTocMenu({ chapterName: 'Checkbox2' });
        await await since(
            'Switch to Checkbox2, the summary for Customer in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Customer'))
            .toBe('(exclude Aaby:Alen, Aadland:Miko, +8)');
        await filterPanel.openFilterPanel();
        await checkboxFilter.openContextMenu('Customer');
        await checkboxFilter.selectContextMenuOption('Customer', 'Include');
        await filterPanel.apply();
        await await since(
            'Change to Inlucde, the summary for Customer in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Customer'))
            .toBe('(Aaby:Alen, Aadland:Miko, +8)');
        await toc.openPageFromTocMenu({ chapterName: 'Checkbox1' });
        await await since(
            'Switch to Checkbox1, the summary for Customer in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Customer'))
            .toBe('(Aaby:Alen, Aadland:Miko, +8)');
    });

    it('[TC67833_02] Validate dossier level filter in same style can sync in Library - slider', async () => {
        const dossier = {
            id: '18EA3B7D4A68232D0903CAB881F3281C',
            name: 'Dossier level filter - multiple filters - same style',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();

        /***** check filter in slider style can sync *****/
        await toc.openPageFromTocMenu({ chapterName: 'Slider1' });
        await since(
            'Default summary for Customer Address in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Customer Address'))
            .toBe('(exclude 0n231 Calvin Ct - 2103 23rd Ave S)');
        await toc.openPageFromTocMenu({ chapterName: 'Slider2' });
        await since(
            'Default summary for Customer Address in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Customer Address'))
            .toBe('(exclude 0n231 Calvin Ct - 2103 23rd Ave S)');
        await filterPanel.openFilterPanel();
        await attributeSlider.dragAndDropLowerHandle('Customer Address', 50);
        await filterPanel.apply();
        await since(
            'Edit filter in Slider2, the summary for Customer Address in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Customer Address'))
            .toBe('(exclude 177 High St - 2103 23rd Ave S)');
        await toc.openPageFromTocMenu({ chapterName: 'Slider1' });
        await since(
            'Switch to Slider1, the summary for Customer Address in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Customer Address'))
            .toBe('(exclude 177 High St - 2103 23rd Ave S)');
    });

    it('[TC67833_03] Validate dossier level filter in same style can sync in Library - radio button', async () => {
        const dossier = {
            id: '18EA3B7D4A68232D0903CAB881F3281C',
            name: 'Dossier level filter - multiple filters - same style',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();

        /***** check filter in radio button style can sync *****/
        await toc.openPageFromTocMenu({ chapterName: 'Radio button1' });
        await since(
            'Default summary for Customer Email in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Customer Email'))
            .toBe('(aaaby54@yahoo.demo)');
        await toc.openPageFromTocMenu({ chapterName: 'Radio button2' });
        await since(
            'Default summary for Customer Email in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Customer Email'))
            .toBe('(aaaby54@yahoo.demo)');
        await filterPanel.openFilterPanel();
        await checkboxFilter.openContextMenu('Customer Email');
        await checkboxFilter.selectContextMenuOption('Customer Email', 'Clear');
        await filterPanel.apply();
        await since(
            'Clear filter in Radio button2, the summary for Customer Email in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('No filter selections');
        await toc.openPageFromTocMenu({ chapterName: 'Radio button1' });
        await since(
            'Switch to Radio button1, the summary for Customer Email in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('No filter selections');
    });

    it('[TC67833_04] Validate dossier level filter in same style can sync in Library - searchbox', async () => {
        const dossier = {
            id: '18EA3B7D4A68232D0903CAB881F3281C',
            name: 'Dossier level filter - multiple filters - same style',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();

        /***** check filter in searchbox style can sync *****/
        await toc.openPageFromTocMenu({ chapterName: 'Searchbox1' });
        await since(
            'Default summary for Category in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Category'))
            .toBe('(Books, Electronics, +1)');
        await toc.openPageFromTocMenu({ chapterName: 'Searchbox2' });
        await since(
            'Default summary for Category in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Category'))
            .toBe('(Books, Electronics, +1)');
        await filterPanel.openFilterPanel();
        await searchBoxFilter.removeCapsuleByName({ filterName: 'Category', capsuleName: 'Books' });
        await filterPanel.apply();
        await since(
            'Edit filter in Searchbox2, the summary for Category in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Category'))
            .toBe('(Electronics, Movies)');
        await toc.openPageFromTocMenu({ chapterName: 'Searchbox1' });
        await since(
            'Switch to Searchobox1, the summary for Category in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Category'))
            .toBe('(Electronics, Movies)');
    });

    it('[TC67833_05] Validate dossier level filter in same style can sync in Library - dropdown', async () => {
        const dossier = {
            id: '18EA3B7D4A68232D0903CAB881F3281C',
            name: 'Dossier level filter - multiple filters - same style',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();

        /***** check filter in drop down style can sync *****/
        await toc.openPageFromTocMenu({ chapterName: 'Drop down1', pageName: 'Set Year as global filter' });
        await since('Default summary for Year in filter summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Year'))
            .toBe('(2014)');
        await toc.openPageFromTocMenu({ chapterName: 'Drop down2', pageName: 'Set Year as global filter' });
        await since('Default summary for Year in filter summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Year'))
            .toBe('(2014)');
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('Year');
        await radiobuttonFilter.selectElementByName('2015');
        await filterPanel.apply();
        await since(
            'Edit filter in drop down2, the summary for Year in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Year'))
            .toBe('(2015)');
        await toc.openPageFromTocMenu({ chapterName: 'Drop down multiple selection' });
        await since(
            'Switch to Drop down multiple selection, the summary for Year in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Year'))
            .toBe('(2015)');
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('Year');
        await checkboxFilter.selectElementByName('2016');
        await filterPanel.apply();
        await since(
            'Edit filter in drop down for multiple selection, the summary for Year in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Year'))
            .toBe('(2015, 2016)');
        await toc.openPageFromTocMenu({ chapterName: 'Drop down1', pageName: 'Set Year as global filter' });
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC67833', 'RadioButtonMultipleSelection');
    });

    it('[TC67833_06] Validate dossier level filter in same style can sync in Library - calendar', async () => {
        const dossier = {
            id: '18EA3B7D4A68232D0903CAB881F3281C',
            name: 'Dossier level filter - multiple filters - same style',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();

        /***** check filter in calendar style can sync *****/
        await toc.openPageFromTocMenu({ chapterName: 'Calendar1' });
        await since(
            'Default summary for First Order Date in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('First Order Date'))
            .toBe('(1/1/2014 - 1/1/2015)');
        await toc.openPageFromTocMenu({ chapterName: 'Calendar2' });
        await since(
            'Default summary for First Order Date in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('First Order Date'))
            .toBe('(1/1/2014 - 1/1/2015)');
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('First Order Date');
        await calendarFilter.selectDynamicDateOptions('Between');
        await calendarFilter.dynamicPanel.openFromDatePicker();
        await calendarFilter.calendarPicker.selectYearAndMonth('2014', 'May');
        await calendarFilter.calendarPicker.selectDay('4');
        
        await calendarFilter.dynamicPanel.openToDatePicker();
        await calendarFilter.calendarPicker.selectYearAndMonth('2015', 'January');
        await calendarFilter.calendarPicker.selectDay('13');
        
        await filterPanel.apply();
        await since(
            'Edit filter in calendar2, the summary for First Order Date in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('First Order Date'))
            .toBe('(5/4/2014 - 1/13/2015)');
        await toc.openPageFromTocMenu({ chapterName: 'Calendar1' });
        await since(
            'Switch to calendar1, the summary for First Order Date in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('First Order Date'))
            .toBe('(5/4/2014 - 1/13/2015)');
    });

    it(
        '[TC67834] Validate dossier level filter in different styles can sync in Library',
        async () => {
            const dossier = {
                id: '3724CD1F46E21AB9E9496598515F26EA',
                name: 'Dossier level filter - multiple filters - different styles',
                project,
            };
            await resetDossierState({
                credentials: specConfiguration.credentials,
                dossier: dossier,
            });
            await libraryPage.openDossier(dossier.name);

            // edit filter in checkbox style
            await toc.openPageFromTocMenu({ chapterName: 'Checkbox' });
            await filterPanel.openFilterPanel();
            await checkboxFilter.openSecondaryPanel('Customer');
            await checkboxFilter.selectElementByName('Aaby:Alen');
            await checkboxFilter.selectElementByName('Aadland:Miko');
            await checkboxFilter.selectElementByName('Aadland:Warner');
            await checkboxFilter.selectElementByName('Aadland:Constant');
            await filterPanel.apply();
            // edit filter in slider style
            await toc.openPageFromTocMenu({ chapterName: 'Slider' });
            await filterPanel.openFilterPanel();
            await attributeSlider.openContextMenu('Customer Address');
            await attributeSlider.selectContextMenuOption('Customer Address', 'Exclude');
            await filterPanel.apply();
            // edit filter in radio button style
            await toc.openPageFromTocMenu({ chapterName: 'Radio button' });
            await filterPanel.openFilterPanel();
            await radiobuttonFilter.openContextMenu('Customer Email');
            await attributeSlider.selectContextMenuOption('Customer Email', 'Clear');
            await filterPanel.apply();
            // edit filter in searchbox style
            await toc.openPageFromTocMenu({ chapterName: 'Searchbox' });
            await filterPanel.openFilterPanel();
            await filterPanel.scrollFilterPanelContentToBottom();
            await searchBoxFilter.removeCapsuleByName({ filterName: 'Category', capsuleName: 'Books' });
            await filterPanel.apply();
            // edit filter in drop down style
            await toc.openPageFromTocMenu({ chapterName: 'Drop down' });
            await filterPanel.openFilterPanel();
            await filterPanel.scrollFilterPanelContentToBottom();
            await radiobuttonFilter.openSecondaryPanel('Year');
            await radiobuttonFilter.selectElementByName('2015');
            await filterPanel.apply();
            console.log('edit filter');

            // after edit filters in different styles, check all these filters can sync in different chapters
            await toc.openPageFromTocMenu({ chapterName: 'Checkbox' });
            await filterPanel.openFilterPanel();
            await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC67834', 'ApplyFilterCheckbox');
            await toc.openPageFromTocMenu({ chapterName: 'Slider' });
            await filterPanel.openFilterPanel();
            await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC67834', 'ApplyFilterSlider');
            await toc.openPageFromTocMenu({ chapterName: 'Radio button' });
            await filterPanel.openFilterPanel();
            await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC67834', 'ApplyFilterRadioButton');
            await toc.openPageFromTocMenu({ chapterName: 'Searchbox' });
            await filterPanel.openFilterPanel();
            await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC67834', 'ApplyFilterSearchbox');
            await toc.openPageFromTocMenu({ chapterName: 'Drop down' });
            await filterPanel.openFilterPanel();
            await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC67834', 'ApplyFilterDropDown');
        },
        8 * 60 * 1000
    );

    it('[TC67835] Validate dossier level filter-metric filter can sync in Library', async () => {
        const dossier = {
            id: '22D9765F45072C16A40A649554CA623E',
            name: 'Dossier level filter - Metric filter',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);

        // edit filter
        await toc.openPageFromTocMenu({ chapterName: 'MQ filter same style' });
        await filterPanel.openFilterPanel();
        await mqFilter.openDropdownMenu('Cost');
        await mqFilter.selectOption('Cost', 'Greater than');
        await mqFilter.updateValue({ filterName: 'Cost', valueLower: 150000 });
        await mqSliderFilter.moveLowerFilterHandle('Discount', 3);
        await mqFilter.updateValue({ filterName: 'Profit', valueLower: 15 });
        await mqFilter.updateValue({ filterName: 'Profit Margin', valueLower: 90 });
        await filterPanel.apply();

        // after edit filters, check all these filters check can sync
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC67835', 'ApplyFilterMetric');
        await toc.openPageFromTocMenu({ chapterName: 'MQ filter' });
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC67835', 'ApplyFilterMetricSynced');
    });

    it('[TC67843] Validate dossier level filter can be passed in dossier linking', async () => {
        const dossier = {
            id: '18EA3B7D4A68232D0903CAB881F3281C',
            name: 'Dossier level filter - multiple filters - same style',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);

        // edit filter
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Customer');
        await checkboxFilter.selectElementByName('Aaby:Alen');
        await checkboxFilter.selectElementByName('Aadland:Miko');
        await filterPanel.apply();

        // link to same dossier
        await grid.linkToTargetByGridContextMenu({
            title: 'Link to this dossier',
            headerName: 'Customer',
            elementName: 'Aaby',
        });
        await since('Summary for Customer in target chapter should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Customer'))
            .toBe('(exclude Aadland:Warner, Aadland:Constant, +6)');
        await dossierPage.goBackFromDossierLink();

        // link to different dossier and check filter selection can sync
        await dossierPage.clickTextfieldByTitle('Link to another dossier with global filter');
        await dossierPage.waitForDossierLoading();
        await since('Summary for Customer in target dossier should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Customer'))
            .toBe('(exclude Aadland:Warner, Aadland:Constant, +6)');
        await toc.openPageFromTocMenu({ chapterName: 'Radio button' });
        await since(
            'Summary for dossier level filter Customer in other chapter should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Customer'))
            .toBe('(exclude Aadland:Warner, Aadland:Constant, +6)');
    });

    it('[TC67840] Validate dossier level filter as target filter in GDDE', async () => {
        const dossier = {
            id: '7547F61F482EA6E6097CDF81B28E2222',
            name: 'Dossier level filter - Custom groups, consolidations',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);

        // check dossier level filter selection in normal filter and GDDE
        await since('Default summary for Season in filter summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Season'))
            .toBe('(Winter, Spring, +2)');
        await toc.openPageFromTocMenu({ chapterName: 'GDDE' });
        await since('Default summary for Season in GDDE should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Season'))
            .toBe('(Winter, Spring)');

        // edit dossier level filter in GDDE
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Month of Year');
        await checkboxFilter.selectElementByName('August');
        await filterPanel.waitForGDDE();
        await since('Filter selection info for Season is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Season'))
            .toBe('(3/3)');
        await filterPanel.apply();
        await since('The summary for Season in GDDE should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Season'))
            .toBe('(Winter, Spring, +1)');
        await toc.openPageFromTocMenu({ chapterName: 'CGB' });
        await since('The summary for Season in filter summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Season'))
            .toBe('(Winter, Spring, +2)');
    });
});

export const config = specConfiguration;
