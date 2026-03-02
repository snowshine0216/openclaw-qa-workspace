import { takeScreenshotByElement, takeScreenshot } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import resetUserLanguage from '../../../api/resetUserLanguage.js';
import setLanguage from '../../../api/setLanguage.js';
import resetDossierState from '../../../api/resetDossierState.js';
import moment from 'moment';
import { getStringOfDayTime } from '../../../utils/DateUtil.js';

const specConfiguration = { ...customCredentials('_interfacelanguage') };
const languageUserID = '13690FDE460906BDCF3BDEB36B6AA86B';

describe('Functionality test for Interface Language', () => {
    const dossier = {
        id: '53EFB3A94FA899452E91E08522DB305C',
        name: '(Auto) Locale - dossier',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document = {
        id: 'CC71FCD445691F4191978A9FE70506D8',
        name: '(Auto) Locale - RSD',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1200,
        height: 1200,
    };

    let {
        libraryPage,
        toc,
        adminPage,
        loginPage,
        dossierPage,
        selector,
        grid,
        filterPanel,
        calendarFilter,
        mqFilter,
        mqSliderFilter,
        filterSummary,
        filterSummaryBar,
        promptObject,
        promptEditor,
        calendar,
        rsdPage,
        rsdGrid,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: document,
        });
    });

    it('[TC89840_01] Validate Functionality of Interface Language on Library Web - Main page,dossier page and prompt page', async () => {
        await libraryPage.librarySort.openSortMenu();
        await libraryPage.librarySort.selectSortOption('更新日期');

        // check library homepage date format
        moment.locale('fr');
        const dateUpdated = moment('04/01/2022').format('L');
        const dateUpdatedHQ = moment('03/31/2022').format('L');
        const sharedByInfo = await libraryPage.itemSharedByTimeInfo('(AUTO) Lock Filter');
        console.log('Library Homepage Format:' + moment(dateUpdated).format('L'));
        await since(`The share by info of (Auto)Lock Filter should be #{expected} but is #{actual}`)
            .expect(sharedByInfo === dateUpdated || sharedByInfo === dateUpdatedHQ)
            .toEqual(true);

        // check library homepage interface language
        await libraryPage.librarySort.openSortMenu();
        await libraryPage.librarySort.selectSortOption('名称');

        // check dossier number format
        const mqProfit = 4414.54;
        const sliderLower = 24453.63;
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();
        await calendarFilter.openSecondaryPanel('Daytime');
        await calendarFilter.setInputDateOfFrom({ customMonth: '2', customDay: '1', customYear: '2014' });
        await calendarFilter.setInputDateOfTo({ customMonth: '3', customDay: '31', customYear: '2014' });
        await since('The capsule name of Daytime is suppoesed to be "#{expected}", instead we have "#{actual}" ')
            .expect(await calendarFilter.capsuleDateTime('Daytime'))
            .toContain('01/02/2014 12:00:00 AM');
        await filterPanel.apply();
        await since(
            'After apply calendar filter, The first element of Profit is suppoesed to be "#{expected}", instead we have "#{actual}" '
        )
            .expect(await grid.firstElmOfHeader({ title: 'Grid', headerName: 'Daytime' }))
            .toBe('01/02/2014 00:00:00');

        await filterPanel.openFilterPanel();
        // check dossier interface language
        await mqFilter.openDropdownMenu('Profit');
        await mqFilter.selectOption('Profit', '大于');
        await mqFilter.updateValue({ filterName: 'Profit', valueLower: '4414,54' });
        await mqSliderFilter.updateLowerInput('Cost', '24454,65');
        await filterPanel.apply();

        await since(
            'After apply calendar filter, The first element of Profit is suppoesed to be "#{expected}", instead we have "#{actual}" '
        )
            .expect(await grid.firstElmOfHeader({ title: 'Grid', headerName: 'Cost' }))
            .toBe('28 809,50');
        await filterSummaryBar.viewAllFilterItems();
        // issue
        await since(
            'After apply, the filter summary of [Daytime] and value should be "#{expected}", instead we have "#{actual}" '
        )
            .expect(await filterSummaryBar.filterPanelItems('Daytime'))
            .toContain('01/02/2014 12:00:00 AM - 31/03/2014 11:59:59 PM');
        await since(
            'After apply, the filter summary of [Profit] and value should be "#{expected}", instead we have "#{actual}" '
        )
            .expect(await filterSummaryBar.filterPanelItems('Profit'))
            .toContain(mqProfit);

        await dossierPage.sleep(2000);
        const filterItem = await filterSummaryBar.filterPanelItems('Cost');
        const includes = filterItem.includes('28 809,50') || filterItem.includes('28\u00A0809,50');
        await since(
            'After apply, the filter summary of [Cost] and value should be "#{expected}", instead we have "#{actual}" '
        )
            .expect(includes)
            .toBe(true);

        // prompt
        await promptEditor.reprompt();
        const calendarPrompt = await promptObject.getPromptByName('Date');
        await promptObject.calendar.openCalendar(calendarPrompt);
        // await promptObject.calendar.selectYearAndMonth(calendarPrompt, '2014', 'février');
        await promptObject.calendar.selectYearAndMonth(calendarPrompt, '2014', '二月');
        await promptObject.calendar.selectDay(calendarPrompt, '18');

        // check prompt page Interface Language
        const shoppingCartPrompt = await promptObject.getPromptByName('Profit');
        await promptObject.shoppingCart.addSingle(shoppingCartPrompt);
        await since('The MQ value part should be "#{expected}", instead we have "#{actual}" ')
            .expect(await promptObject.shoppingCart.getMQValuePartText(shoppingCartPrompt, 1))
            .toBe('值');
        await promptObject.shoppingCart.openMQFirstValue(shoppingCartPrompt, 1);
        await promptObject.shoppingCart.inputValues(shoppingCartPrompt, '5\u00A0698,62');
        await promptObject.shoppingCart.clickButton(shoppingCartPrompt, '确定');

        await promptEditor.run();
        await since('After apply prompt, the viz error message should be "#{expected}", instead we have "#{actual}" ')
            .expect(await grid.getVizErrorContent('Grid'))
            .toBe('没有数据支持。这可能是因为已应用的筛选器排除了所有数据。');
        await dossierPage.goToLibrary();
    });

    it('[TC89840_02] Validate Functionality of Interface Language on Library Web - RSD', async () => {
        // check rsd
        await libraryPage.openDossier(document.name);
        const calendarSelector = rsdPage.findSelectorByName('daytime-calendar');
        await since('From date should be #{expected}, while we get #{actual}')
            .expect(getStringOfDayTime(await calendarSelector.calendar.getFromDate()))
            .toBe('01/01/2014 0:0:0');
        await calendarSelector.calendar.openFromCalendar();

        await calendarSelector.calendar.selectDayTime('2014', '1月', '2', '3', '20', '20');
        // check selector Interface language
        await calendarSelector.calendar.clickDynamicCalendarButton('确定');
        await since('Exclude mode: From date should be #{expected}, while we get #{actual}')
            .expect(getStringOfDayTime(await calendarSelector.calendar.getFromDate()))
            .toBe('02/01/2014 3:20:20');
        const grid1 = rsdGrid.getRsdGridByKey('K44');
        await since('The second row should be #{expected}, instead we have #{actual}')
            .expect(await grid1.getOneRowData(2))
            .toEqual(['03/01/2014 00:00:00', '03/01/2014', 'Books', '801,06', '260,94']);

        const searchboxSelector = rsdPage.findSelectorByName('day-searchbox');
        await searchboxSelector.searchbox.input('2014-01-04');
        await since('Filtered by selector: Search result should be #{expected}, while we get #{actual}')
            .expect(await searchboxSelector.searchbox.getSuggestionListText())
            .toEqual(['04/01/2014']);

        await searchboxSelector.searchbox.selectNthItem(1, '04/01/2014');
        const grid2 = rsdGrid.getRsdGridByKey('K44');
        await since('After apply search filter, The second row should be #{expected}, instead we have #{actual}')
            .expect(await grid2.getOneRowData(2))
            .toEqual(['04/01/2014 00:00:00', '04/01/2014', 'Books', '375,88', '121,12']);
        await searchboxSelector.searchbox.deleteItemByText('04/01/2014');

        const mqSelector = rsdPage.findSelectorByName('profit-metric qualification');
        await mqSelector.metricQualification.inputValue('1 500,34');
        await mqSelector.metricQualification.apply();
        const grid3 = rsdGrid.getRsdGridByKey('K44');
        await since('After apply mq selector, The second row should be #{expected}, instead we have #{actual}')
            .expect(await grid3.getOneRowData(2))
            .toEqual(['03/01/2014 00:00:00', '03/01/2014', 'Electronics', '10 182,64', '2 589,36']);

        const metricSliderSelector = rsdPage.findSelectorByName('cost-metric slider');
        await metricSliderSelector.metricSlider.inputToStartPoint('12 400,00');
        await rsdPage.waitAllToBeLoaded();
        await since('Input 12400,00, the start point tooltip should be #{expected}, while we get #{actual} ')
            .expect(await metricSliderSelector.metricSlider.getStartTooltipText())
            .toEqual('12 400,00');
        const grid4 = rsdGrid.getRsdGridByKey('K44');
        await since('After apply metric slider filter, The second row should be #{expected}, instead we have #{actual}')
            .expect(await grid4.getOneRowData(2))
            .toEqual(['06/01/2014 00:00:00', '06/01/2014', 'Electronics', '12 403,43', '3 097,57']);
    });

    it('[TC89840_03] Validate Functionality of Interface Language on Library Web - Admin Page', async () => {
        // check interface lanuage in admin page
        await adminPage.openAdminPage();
        await adminPage.chooseTab('Library Server');
        await adminPage.clickHelpButton();
        await libraryPage.sleep(1000); // await for page load
        await adminPage.switchToTab(1);
        const helplink =
            'https://www2.microstrategy.com/producthelp/Current/InstallConfig/zh-cn/Content/library_admin_control_panel.htm';
        await since('For Chinese Interface LanguageHelp Url should contain config id')
            .expect(await browser.getUrl())
            .toBe(helplink);
        await libraryPage.switchToTab(0);
        await adminPage.clickLibraryUrl();
    });

    it('[TC89840_04] Validate Functionality of Interface Language on Library Web - Filter Summary', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'FilterSummary', pageName: 'Page 1' });
        await since('The filter summary in summary bar should be "#{expected}", instead we have "#{actual}" ')
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('Cost[非空]Profit[排除 最高 60%]');
        await filterSummaryBar.viewAllFilterItems();
        await since(
            'The filter summary for cost in summary panel should be "#{expected}", instead we have "#{actual}" '
        )
            .expect(await filterSummaryBar.filterPanelItems('Cost'))
            .toBe('非空');
        await since(
            'The filter summary for profit in summary panel should be "#{expected}", instead we have "#{actual}" '
        )
            .expect(await filterSummaryBar.filterPanelItems('Profit'))
            .toBe('最高 60%');
        await since('isExcluded in summary panel should be "#{expected}", instead we have "#{actual}" ')
            .expect(await filterSummaryBar.isFilterExcludedinExpandedView('Profit'))
            .toBe(true);
    });
});

export const config = specConfiguration;
