import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import resetUserLanguage from '../../../api/resetUserLanguage.js';
import setLanguage from '../../../api/setLanguage.js';
import { getStringOfDayTime } from '../../../utils/DateUtil.js';

const specConfiguration = { ...customCredentials('_deat') };

describe('Language Customer Issue', () => {
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
        width: 1600,
        height: 1200,
    };

    let {
        libraryPage,
        loginPage,
        filterPanel,
        calendarFilter,
        filterSummary,
        grid,
        mqFilter,
        mqSliderFilter,
        filterSummaryBar,
        promptEditor,
        rsdPage,
        rsdGrid,
        selector,
        promptObject,
        dossierPage,
        browserInstance,
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

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC88166] Verify German translation of dynamic calandar filter', async () => {
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();
        await calendarFilter.openSecondaryPanel('Daytime');
        await calendarFilter.dynamicPanel.selectCustomOperatorOption('Am');
        await calendarFilter.dynamicPanel.setCustomOperatorInput('01.02.2014');
        await filterPanel.apply();
        await since(
            'After apply, the filter summary of [Daytime] and value should be "#{expected}", instead we have "#{actual}" '
        )
            .expect(await filterSummary.filterItems('Daytime'))
            .toContain('01.02.2014 12:00:00 AM - 01.02.2014 11:59:59 PM');
    });

    it('[TC89144] Verify functionality of German(Austrian) locale for library', async () => {
        // check library homepage
        await libraryPage.openSortMenu();
        await libraryPage.selectSortOption('Aktualisierungsdatum');
        const shareByInfo = await libraryPage.itemSharedByTimeInfo('(AUTO) Lock Filter');
        await since(`The share by info of (Auto)Lock Filter should be #{expected} but is #{actual}`)
            .expect(shareByInfo === '01.04.2022' || shareByInfo === '31.03.2022')
            .toEqual(true);

        // check dossier
        const mqProfit = 4414.54;
        const sliderLower = 24453.63;
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();
        await calendarFilter.openSecondaryPanel('Daytime');
        await calendarFilter.dynamicPanel.setFromInputValue('01.02.2014');
        await calendarFilter.dynamicPanel.setToInputValue('31.03.2014');
        await since('The capsule name of Daytime is suppoesed to be "#{expected}", instead we have "#{actual}" ')
            .expect(await calendarFilter.capsuleDateTime('Daytime'))
            .toContain('01.02.2014 12:00:00 AM');
        await filterPanel.apply();
        await since(
            'After apply calendar filter, The first element of Profit is suppoesed to be "#{expected}", instead we have "#{actual}" '
        )
            .expect(await grid.firstElmOfHeader({ title: 'Grid', headerName: 'Daytime' }))
            .toBe('01.02.2014 00:00:00');

        await filterPanel.openFilterPanel();
        await mqFilter.updateValue({ filterName: 'Profit', valueLower: '4.414,54' });
        await mqSliderFilter.updateLowerInput('Cost', '24454,65');
        await filterPanel.apply();

        await since(
            'After apply calendar filter, The first element of Profit is suppoesed to be "#{expected}", instead we have "#{actual}" '
        )
            .expect(await grid.firstElmOfHeader({ title: 'Grid', headerName: 'Cost' }))
            .toBe('28.809,50');
        await filterSummaryBar.viewAllFilterItems();
        // issue
        await since(
            'After apply, the filter summary of [Daytime] and value should be "#{expected}", instead we have "#{actual}" '
        )
            .expect(await filterSummaryBar.filterPanelItems('Daytime'))
            .toContain('01.02.2014 12:00:00 AM - 31.03.2014 11:59:59 PM');
        await since(
            'After apply, the filter summary of [Profit] and value should be "#{expected}", instead we have "#{actual}" '
        )
            .expect(await filterSummaryBar.filterPanelItems('Profit'))
            .toContain(mqProfit);
        await since(
            'After apply, the filter summary of [Cost] and value should be "#{expected}", instead we have "#{actual}" '
        )
            .expect(await filterSummaryBar.filterPanelItems('Cost'))
            .toContain('28.809,50');

        // prompt
        await promptEditor.reprompt();
        const calendarPrompt = await promptObject.getPromptByName('Date');
        await promptObject.calendar.openCalendar(calendarPrompt);

        await promptObject.calendar.clearAndInputYear(calendarPrompt, '2014');
        await promptObject.calendar.openMonthDropDownMenu(calendarPrompt);
        await promptObject.calendar.selectMonth(calendarPrompt, 'Feb');
        await promptObject.calendar.selectDay(calendarPrompt, '18');
        await promptEditor.run();
        await since(
            'After apply prompt, the filter summary of [Cost] and value should be "#{expected}", instead we have "#{actual}" '
        )
            .expect(await grid.firstElmOfHeader({ title: 'Grid', headerName: 'Cost' }))
            .toBe('26.075,38');
        await dossierPage.goToLibrary();

        // check rsd
        await libraryPage.openDossier(document.name);
        const calendarSelector = rsdPage.findSelectorByName('daytime-calendar');
        await since('From date should be #{expected}, while we get #{actual}')
            .expect(await calendarSelector.calendar.getFromDate())
            .toBe('01.01.2014 00:00:00');
        await calendarSelector.calendar.openFromCalendar();

        await calendarSelector.calendar.selectDayTime('2014', 'Jan', '2', '3', '20', '20');
        await calendarSelector.calendar.clickDynamicCalendarButton('OK');
        await since('Exclude mode: From date should be #{expected}, while we get #{actual}')
            .expect(await calendarSelector.calendar.getFromDate())
            .toBe('02.01.2014 03:20:20');
        const grid1 = rsdGrid.getRsdGridByKey('K44');
        await since('The second row should be #{expected}, instead we have #{actual}')
            .expect(await grid1.getOneRowData(2))
            .toEqual(['03.01.2014 00:00:00', '03.01.2014', 'Books', '801,06', '260,94']);

        const searchboxSelector = rsdPage.findSelectorByName('day-searchbox');
        await searchboxSelector.searchbox.input('2014-01-04');
        await since('Filtered by selector: Search result should be #{expected}, while we get #{actual}')
            .expect(await searchboxSelector.searchbox.getSuggestionListText())
            .toEqual(['04.01.2014']);

        await searchboxSelector.searchbox.selectNthItem(1, '04.01.2014');
        const grid2 = rsdGrid.getRsdGridByKey('K44');
        since('After apply search filter, The second row should be #{expected}, instead we have #{actual}')
            .expect(await grid2.getOneRowData(2))
            .toEqual(['04.01.2014 00:00:00', '04.01.2014', 'Books', '375,88', '121,12']);
        await searchboxSelector.searchbox.deleteItemByText('04.01.2014');
        const mqSelector = rsdPage.findSelectorByName('profit-metric qualification');
        await mqSelector.metricQualification.inputValue('1500,34');
        await mqSelector.metricQualification.apply();
        const grid3 = rsdGrid.getRsdGridByKey('K44');
        await since('After apply mq filter, The second row should be #{expected}, instead we have #{actual}')
            .expect(await grid3.getOneRowData(2))
            .toEqual(['03.01.2014 00:00:00', '03.01.2014', 'Electronics', '10.182,64', '2.589,36']);

        const metricSliderSelector = rsdPage.findSelectorByName('cost-metric slider');
        await metricSliderSelector.metricSlider.inputToStartPoint('12400,00');
        await rsdPage.waitAllToBeLoaded();
        await since('Input 12400,00, the start point tooltip should be #{expected}, while we get #{actual} ')
            .expect(await metricSliderSelector.metricSlider.getStartTooltipText())
            .toEqual('12.400,00');
        const grid4 = rsdGrid.getRsdGridByKey('K44');
        await since('After apply metric slider filter, The second row should be #{expected}, instead we have #{actual}')
            .expect(await grid4.getOneRowData(2))
            .toEqual(['06.01.2014 00:00:00', '06.01.2014', 'Electronics', '12.403,43', '3.097,57']);
    });

    it('[TC96526] Validate yyyy-MM-dd format for en_GB and fr_CH', async () => {
        const engbCredentials = {
            username: 'tester_auto_engb',
            password: '',
        };
        await libraryPage.switchUser(engbCredentials);
        await resetDossierState({
            credentials: engbCredentials,
            dossier: document,
        });
        await libraryPage.openDossier(document.name);
        const searchboxSelector1 = rsdPage.findSelectorByName('day-searchbox');
        await searchboxSelector1.searchbox.input('2014-01-31');
        await since('Filtered by selector: Search result should be #{expected}, while we get #{actual}')
            .expect(await searchboxSelector1.searchbox.getSuggestionListText())
            .toEqual(['31/01/2014']);

        const frchCredentials = {
            username: 'tester_auto_frch',
            password: '',
        };
        await libraryPage.switchUser(frchCredentials);
        await resetDossierState({
            credentials: frchCredentials,
            dossier: document,
        });
        await libraryPage.openDossier(document.name);
        const searchboxSelector2 = rsdPage.findSelectorByName('day-searchbox');
        await searchboxSelector2.searchbox.input('2014-12-31');
        await since('Filtered by selector: Search result should be #{expected}, while we get #{actual}')
            .expect(await searchboxSelector2.searchbox.getSuggestionListText())
            .toEqual(['31.12.2014']);
        await libraryPage.switchUser(specConfiguration.credentials);
    });
});

export const config = specConfiguration;
