import { takeScreenshotByElement, takeScreenshot } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import resetUserLanguage from '../../../api/resetUserLanguage.js';
import setLanguage from '../../../api/setLanguage.js';
import resetDossierState from '../../../api/resetDossierState.js';
import moment from 'moment';
import { getStringOfDayTime } from '../../../utils/DateUtil.js';

const specConfiguration = { ...customCredentials('_language') };
const languageUserID = 'BEC61A66488490107BA9AF930EA66419';

describe('E2E test for Language', () => {
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
        userPreference,
        timezone,
        quickSearch,
        fullSearch,
        filterOnSearch,
        calendarOnSearch,
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
        await resetUserLanguage({
            userId: [languageUserID],
            credentials: specConfiguration.credentials,
        });
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.login(specConfiguration.credentials);
    });

    it('[TC84487_01] Validate E2E workflow of Language on Library Web - Chinese', async () => {
        // change sort option
        await libraryPage.librarySort.openSortMenu();
        await libraryPage.librarySort.selectSortOption('Date Updated');

        // change language
        await libraryPage.openUserAccountMenu();
        await libraryPage.openPreferencePanel();
        await takeScreenshotByElement(userPreference.getPreferenceSecondaryPanel(), 'TC84487_01', 'preference panel');
        await userPreference.openPreferenceList('My Language');
        await userPreference.changePreference('My Language', 'Chinese (Simplified)');
        await since('Change description present should be #{expected}, instead we have #{actual}')
            .expect(await userPreference.isChangeDescPresent())
            .toBe(true);
        await userPreference.savePreference();
        await libraryPage.logout();
        await loginPage.login(specConfiguration.credentials);

        // check library homepage
        moment.locale('zh_CN');
        const dateUpdated = moment('04/01/2022').format('L');
        const dateUpdatedHQ = moment('03/31/2022').format('L');
        const sharedByInfo = await libraryPage.itemSharedByTimeInfo('(AUTO) Lock Filter');
        console.log('Library Homepage Format:' + moment(dateUpdated).format('L'));
        await since(`The share by info of (Auto)Lock Filter should be #{expected} but is #{actual}`)
            .expect(sharedByInfo === dateUpdated || sharedByInfo === dateUpdatedHQ)
            .toEqual(true);

        // check global search
        const keyword = 'auto';
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('上次更新');
        await calendarOnSearch.setInputBoxDate({ customMonth: '2', customDay: '28', customYear: '2021' });
        const searchCalendarDate = new Date(2021, 1, 28);
        await since('Select aftBetweener, selected date should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toContain(moment(searchCalendarDate).format('L'));
        await calendarOnSearch.openCalendarTypeSelector();
        await calendarOnSearch.selectCalendarFilterTypeOption('动态');
        await calendarOnSearch.selectDynamicCalendarConditionBtn('自定义');
        await calendarOnSearch.clickFixedDateCheckbox('自');
        const today = moment(new Date());
        await since('Custom Date Preview (from) should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicPreviewContent('自'))
            .toContain(moment(today).format('L'));
        await fullSearch.backToLibrary();

        // check dossier
        const mqProfit = 4414.54;
        const sliderLower = 24453.63;
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();
        await calendarFilter.openSecondaryPanel('Daytime');
        await calendarFilter.setInputDateOfFrom({ customMonth: '2', customDay: '1', customYear: '2014' });
        await calendarFilter.setInputDateOfTo({ customMonth: '3', customDay: '31', customYear: '2014' });
        await since('The capsule name of Daytime is suppoesed to be "#{expected}", instead we have "#{actual}" ')
            .expect(await calendarFilter.capsuleDateTime('Daytime'))
            .toContain('2014/02/01 12:00:00 凌晨');
        await filterPanel.apply();
        const calendarFilterValue = await grid.firstElmOfHeader({ title: 'Grid', headerName: 'Daytime' });
        const calendarFilterCTC = '2014/2/1 0:00:00';
        const calendarFilterHQ = '2014-2-1 0:00:00';
        await since(
            'After apply calendar filter, The first element of Profit is suppoesed to be "#{expected}", instead we have "#{actual}" '
        )
            .expect(calendarFilterValue === calendarFilterCTC || calendarFilterValue === calendarFilterHQ)
            .toBe(true);

        await filterPanel.openFilterPanel();
        await mqFilter.updateValue({ filterName: 'Profit', valueLower: mqProfit });
        await mqSliderFilter.updateLowerInput('Cost', sliderLower);
        await filterPanel.apply();
        await since(
            'After apply metric filter, The first element of Profit is suppoesed to be "#{expected}", instead we have "#{actual}" '
        )
            .expect(await grid.firstElmOfHeader({ title: 'Grid', headerName: 'Cost' }))
            .toBe('28,809.50');
        await filterSummaryBar.viewAllFilterItems();
        await since(
            'After apply, the filter summary of [Daytime] and value should be "#{expected}", instead we have "#{actual}" '
        )
            .expect(await filterSummaryBar.filterPanelItems('Daytime'))
            .toContain('2014/02/01 12:00:00 凌晨 - 2014/03/31 11:59:59 晚上');
        await since(
            'After apply, the filter summary of [Profit] and value should be "#{expected}", instead we have "#{actual}" '
        )
            .expect(await filterSummaryBar.filterPanelItems('Profit'))
            .toContain(mqProfit);
        await since(
            'After apply, the filter summary of [Cost] and value should be "#{expected}", instead we have "#{actual}" '
        )
            .expect(await filterSummaryBar.filterPanelItems('Cost'))
            .toContain('28,809.50');

        // prompt
        await promptEditor.reprompt();
        const calendarPrompt = await promptObject.getPromptByName('Date');
        await promptObject.calendar.openCalendar(calendarPrompt);
        await promptObject.calendar.selectYearAndMonth(calendarPrompt, '2014', '二月');
        await promptObject.calendar.selectDay(calendarPrompt, '18');
        await promptEditor.run();
        await since(
            'After apply prompt, the filter summary of [Cost] and value should be "#{expected}", instead we have "#{actual}" '
        )
            .expect(await grid.firstElmOfHeader({ title: 'Grid', headerName: 'Cost' }))
            .toBe('26,075.38');
        await dossierPage.goToLibrary();

        // check rsd
        await libraryPage.openDossier(document.name);
        const calendarSelector = rsdPage.findSelectorByName('daytime-calendar');
        await since('From date should be #{expected}, while we get #{actual}')
            .expect(getStringOfDayTime(await calendarSelector.calendar.getFromDate()))
            .toBe(getStringOfDayTime('2014-01-01 上午 12:00:00'));
        await calendarSelector.calendar.openFromCalendar();
        await calendarSelector.calendar.selectDayTime('2014', '1月', '2', '3', '20', '20');
        await calendarSelector.calendar.clickDynamicCalendarButton('确定');
        await since('Exclude mode: From date should be #{expected}, while we get #{actual}')
            .expect(getStringOfDayTime(await calendarSelector.calendar.getFromDate()))
            .toBe(getStringOfDayTime('2014-01-02 上午 3:20:20'));
        const grid1 = rsdGrid.getRsdGridByKey('K44');
        const oneRowData = await grid1.getOneRowData(2);
        const oneRowDataZHCTC = ['2014/1/3 0:00:00', '2014/1/3', 'Books', '801.06', '260.94'];
        const oneRowDataZHHQ = ['2014-1-3 0:00:00', '2014-1-3', 'Books', '801.06', '260.94'];
        await since('The second row should be #{expected}, instead we have #{actual}')
            .expect(
                oneRowData.toString() === oneRowDataZHCTC.toString() ||
                    oneRowData.toString() === oneRowDataZHHQ.toString()
            )
            .toBe(true);

        const searchboxSelector = rsdPage.findSelectorByName('day-searchbox');
        await searchboxSelector.searchbox.input('2014-01-04');
        const searchboxDate = await searchboxSelector.searchbox.getSuggestionListText();
        const searchboxDateCTC = '2014/1/4';
        const searchboxDateHQ = '2014-1-4';
        await since('Filtered by selector: Search result should be #{expected}, while we get #{actual}')
            .expect(
                searchboxDate.toString() === searchboxDateCTC.toString() ||
                    searchboxDate.toString() === searchboxDateHQ.toString()
            )
            .toBe(true);
        await searchboxSelector.searchbox.selectNthItem(1, '2014/1/4');
        const grid2 = rsdGrid.getRsdGridByKey('K44');
        const oneRowData2 = await grid2.getOneRowData(2);
        const oneRowData2ZHCTC = ['2014/1/4 0:00:00', '2014/1/4', 'Books', '375.88', '121.12'];
        const oneRowData2ZHHQ = ['2014-1-4 0:00:00', '2014-1-4', 'Books', '375.88', '121.12'];
        await since('After apply search filter, The second row should be #{expected}, instead we have #{actual}')
            .expect(
                oneRowData2.toString() === oneRowData2ZHCTC.toString() ||
                    oneRowData2.toString() === oneRowData2ZHHQ.toString()
            )
            .toBe(true);
        if (searchboxDate.toString() === searchboxDateCTC.toString()) {
            await searchboxSelector.searchbox.deleteItemByText('2014/1/4');
        } else {
            await searchboxSelector.searchbox.deleteItemByText('2014-1-4');
        }

        const mqSelector = rsdPage.findSelectorByName('profit-metric qualification');
        await mqSelector.metricQualification.inputValue('1,500.34');
        await mqSelector.metricQualification.apply();
        const grid3 = rsdGrid.getRsdGridByKey('K44');
        const oneRowData3 = await grid3.getOneRowData(2);
        const oneRowData3ZHCTC = ['2014/1/3 0:00:00', '2014/1/3', 'Electronics', '10,182.64', '2,589.36'];
        const oneRowData3ZHHQ = ['2014-1-3 0:00:00', '2014-1-3', 'Electronics', '10,182.64', '2,589.36'];
        await since('After apply mq filter, The second row should be #{expected}, instead we have #{actual}')
            .expect(
                oneRowData3.toString() === oneRowData3ZHCTC.toString() ||
                    oneRowData3.toString() === oneRowData3ZHHQ.toString()
            )
            .toBe(true);

        const metricSliderSelector = rsdPage.findSelectorByName('cost-metric slider');
        await metricSliderSelector.metricSlider.inputToStartPoint('12,400.00');
        await rsdPage.waitAllToBeLoaded();
        await since('Input 12,400.00, the start point tooltip should be #{expected}, while we get #{actual} ')
            .expect(await metricSliderSelector.metricSlider.getStartTooltipText())
            .toEqual('12,400.00');
        const grid4 = rsdGrid.getRsdGridByKey('K44');
        const oneRowData4 = await grid4.getOneRowData(2);
        const oneRowData4ZHCTC = ['2014/1/6 0:00:00', '2014/1/6', 'Electronics', '12,403.43', '3,097.57'];
        const oneRowData4ZHHQ = ['2014-1-6 0:00:00', '2014-1-6', 'Electronics', '12,403.43', '3,097.57'];
        await since('After apply metric slider filter, The second row should be #{expected}, instead we have #{actual}')
            .expect(
                oneRowData4.toString() === oneRowData4ZHCTC.toString() ||
                    oneRowData4.toString() === oneRowData4ZHHQ.toString()
            )
            .toBe(true);
    });

    it('[TC84487_02] Validate E2E workflow of Language on Library Web - Albanian', async () => {
        // change sort option
        await libraryPage.librarySort.openSortMenu();
        await libraryPage.librarySort.selectSortOption('Date Updated');

        // change language
        await libraryPage.openUserAccountMenu();
        await libraryPage.openPreferencePanel();
        await userPreference.openPreferenceList('My Language');
        await userPreference.changePreference('My Language', 'Albanian (Albania)');
        await since('Change description present should be #{expected}, instead we have #{actual}')
            .expect(await userPreference.isChangeDescPresent())
            .toBe(true);
        await userPreference.savePreference();
        await libraryPage.logout();
        await loginPage.login(specConfiguration.credentials);

        // check library homepage
        moment.locale('sq');
        const dateUpdatedCTC = moment('04/01/2022').format('L');
        const dateUpdatedHQ = moment('03/31/2022').format('L');
        const dateUpdated = await libraryPage.itemSharedByTimeInfo('(AUTO) Lock Filter');
        console.log('Library Homepage Format:' + moment(dateUpdated).format('L'));
        await since(`The share by info of (Auto)Lock Filter should be #{expected} but is #{actual}`)
            .expect(dateUpdated === dateUpdatedCTC || dateUpdated === dateUpdatedHQ)
            .toBe(true);

        //check dossier
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
        const calendarTime = await grid.firstElmOfHeader({ title: 'Grid', headerName: 'Daytime' });
        const calendarTimeCTC = '1.2.2014 12:00:00 p.d.';
        const calendarTimeHQ = '2014-02-01 12:00:00.e paradites';
        await since(
            'After apply calendar filter, The first element of Profit is suppoesed to be "#{expected}", instead we have "#{actual}" '
        )
            .expect(calendarTime === calendarTimeCTC || calendarTime === calendarTimeHQ)
            .toBe(true);

        await filterPanel.openFilterPanel();
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
        const calendarFilterSummary = await filterSummaryBar.filterPanelItems('Daytime');
        const calendarFilterSummaryCTC = '01/02/2014 12:00:00 PM - 31/03/2014 11:59:59 AM';
        const calendarFilterSummaryHQ = '01/02/2014 12:00:00 AM - 31/03/2014 11:59:59 PM';
        await since(
            'After apply, the filter summary of [Daytime] and value should be "#{expected}", instead we have "#{actual}" '
        )
            .expect(
                calendarFilterSummary.includes(calendarFilterSummaryCTC) ||
                    calendarFilterSummary.includes(calendarFilterSummaryHQ)
            )
            .toBe(true);
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
        await promptObject.calendar.selectYearAndMonth(calendarPrompt, '2014', 'February');
        await promptObject.calendar.selectDay(calendarPrompt, '18');
        await promptEditor.run();
        await since(
            'After apply prompt, the filter summary of [Cost] and value should be "#{expected}", instead we have "#{actual}" '
        )
            .expect(await grid.firstElmOfHeader({ title: 'Grid', headerName: 'Cost' }))
            .toBe('26 075,38');
        await dossierPage.goToLibrary();

        // check rsd
        await libraryPage.openDossier(document.name);
        const calendarSelector = rsdPage.findSelectorByName('daytime-calendar');
        await since('From date should be #{expected}, while we get #{actual}')
            .expect(getStringOfDayTime(await calendarSelector.calendar.getFromDate()))
            .toBe('01/01/2014 0:0:0');
        await calendarSelector.calendar.openFromCalendar();

        await calendarSelector.calendar.selectDayTime('2014', 'Jan', '2', '3', '20', '20');
        await calendarSelector.calendar.clickDynamicCalendarButton('OK');
        await since('Exclude mode: From date should be #{expected}, while we get #{actual}')
            .expect(getStringOfDayTime(await calendarSelector.calendar.getFromDate()))
            .toBe('01/02/2014 3:20:20');
        const grid1 = rsdGrid.getRsdGridByKey('K44');
        const oneRowData = await grid1.getOneRowData(2);
        const oneRowDataCTC = ['3.1.2014 12:00:00 p.d.', '3.1.2014', 'Books', '801,06', '260,94'];
        const oneRowDataHQ = ['2014-01-03 12:00:00.e paradites', '2014-01-03', 'Books', '801,06', '260,94'];
        await since('The second row should be #{expected}, instead we have #{actual}')
            .expect(
                oneRowData.toString() === oneRowDataCTC.toString() || oneRowData.toString() === oneRowDataHQ.toString()
            )
            .toBe(true);

        const searchboxSelector = rsdPage.findSelectorByName('day-searchbox');
        await searchboxSelector.searchbox.input('2014-01-04');
        await since('Filtered by selector: Search result should be #{expected}, while we get #{actual}')
            .expect(await searchboxSelector.searchbox.getSuggestionListText())
            .toEqual(['1/4/2014']);

        await searchboxSelector.searchbox.selectNthItem(1, '1/4/2014');
        const grid2 = rsdGrid.getRsdGridByKey('K44');
        const oneRowData2 = await grid2.getOneRowData(2);
        const oneRowData2CTC = ['4.1.2014 12:00:00 p.d.', '4.1.2014', 'Books', '375,88', '121,12'];
        const oneRowData2HQ = ['2014-01-04 12:00:00.e paradites', '2014-01-04', 'Books', '375,88', '121,12'];
        await since('After apply search filter, The second row should be #{expected}, instead we have #{actual}')
            .expect(
                oneRowData2.toString() === oneRowData2CTC.toString() ||
                    oneRowData2.toString() === oneRowData2HQ.toString()
            )
            .toBe(true);
        await searchboxSelector.searchbox.deleteItemByText('1/4/2014');

        const mqSelector = rsdPage.findSelectorByName('profit-metric qualification');
        await mqSelector.metricQualification.inputValue('1500,34');
        await mqSelector.metricQualification.apply();
        const grid3 = rsdGrid.getRsdGridByKey('K44');
        await since('After apply mq filter, The second row should be #{expected}, instead we have #{actual}').expect(
            await grid3.getOneRowData(2)
        ).toBe[('3.1.2014 12:00:00 p.d.', '3.1.2014', 'Electronics', '10 182,64', '2 589,36')];

        const metricSliderSelector = rsdPage.findSelectorByName('cost-metric slider');
        // await metricSliderSelector.metricSlider.inputToStartPoint('12\u00a0400,00');
        await metricSliderSelector.metricSlider.inputToStartPoint('12400,00');
        await rsdPage.waitAllToBeLoaded();
        await since('Input 12400,00, the start point tooltip should be #{expected}, while we get #{actual} ')
            .expect(await metricSliderSelector.metricSlider.getStartTooltipText())
            .toEqual('12.400,00');
        const grid4 = rsdGrid.getRsdGridByKey('K44');
        await since(
            'After apply metric slider filter, The second row should be #{expected}, instead we have #{actual}'
        ).expect(await grid4.getOneRowData(2)).toBe[
            ('6.1.2014 12:00:00 p.d.', '6.1.2014', 'Electronics', '12 403,43', '3 097,57')
        ];
    });
});

export const config = specConfiguration;
