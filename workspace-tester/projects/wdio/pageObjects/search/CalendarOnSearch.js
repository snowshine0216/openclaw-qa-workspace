import BaseSearch from './BaseSearch.js';
import { getMonthFromString, addDays, addMonths, getStringOfDate } from '../../utils/DateUtil.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';
import { multiElements } from '../../utils/index.js';

export default class CalendarOnSearch extends BaseSearch {
    constructor() {
        super();
    }

    // Element locator
    getCalendarPanel() {
        return this.$('.mstrd-FilterDetailPanelCalendar');
    }

    // Header
    getCalendarHeader() {
        return this.getCalendarPanel().$('.mstrd-FilterDetailPanelCalendar-header');
    }

    getCalendarTypeSelector() {
        return this.getCalendarHeader().$('.mstrd-CalFilterTypeSelect');
    }

    getCalendarPanelExpDropdown() {
        return this.$('.mstrd-FilterDetailPanelCalendar-expDropdown');
    }

    getCalendarExpDropdownOption(name) {
        // return this.getCalendarPanelExpDropdown().element(by.cssContainingText('li', multiElements(name)));
        const typeRegExp = multiElements(name);
        return this.getCalendarPanelExpDropdown()
            .$$('li')
            .filter(async (elem) => {
                const dropdownOption = await elem.getText();
                return typeRegExp.test(dropdownOption);
            })[0];
    }

    getFromInput() {
        return this.getCalendarHeader().$('.mstrd-FilterDetailPanelCalendar-from');
    }

    getToInput() {
        return this.getCalendarHeader().$('.mstrd-FilterDetailPanelCalendar-to');
    }

    getDynamicInput() {
        return this.getCalendarHeader().$('.mstrd-FilterDetailPanelCalendar-text');
    }

    getCalendarDateInput(flag = 'from') {
        switch (flag.toLowerCase()) {
            case 'from':
                return this.getDateInput(this.getFromInput());
            case 'to':
                return this.getDateInput(this.getToInput());
        }
    }

    // Body
    getCalendarBody() {
        return this.getCalendarPanel().$('.mstrd-FilterDetailPanelCalendar-body');
    }

    // DateInput Wrapper
    getDateInput(EntryElement) {
        return EntryElement.$('.mstrd-DateInput');
    }

    getInputMonth(inputElement) {
        return inputElement.$('.mstrd-DateInput-month');
    }

    getInputDay(inputElement) {
        return inputElement.$('.mstrd-DateInput-day');
    }

    getInputYear(inputElement) {
        return inputElement.$('.mstrd-DateInput-year');
    }

    // Calendar Widget
    getDatePickerWidget(option = { popover: false }) {
        return option.popover
            ? this.$('.mstrd-DynamicCalendarContentPreview-popupCalendar .mstrd-PopUpDatePicker')
            : this.getCalendarBody().$('.mstrd-Calendar-widget-container');
    }

    getDatePickerHeader(option = { popover: false }) {
        return this.getDatePickerWidget({ popover: option.popover }).$('.mstrd-DatePickerHeader');
    }

    getLastYear(option = { popover: false }) {
        return this.getDatePickerHeader({ popover: option.popover }).$('.mstrd-DatePickerHeader-left .icon-last_year');
    }

    getLastMonth(option = { popover: false }) {
        return this.getDatePickerHeader({ popover: option.popover }).$('.icon-chevron-left');
    }

    getNextYear(option = { popover: false }) {
        return this.getDatePickerHeader({ popover: option.popover }).$('.mstrd-DatePickerHeader-right .icon-next_year');
    }

    getNextMonth(option = { popover: false }) {
        return this.getDatePickerHeader({ popover: option.popover }).$('.icon-chevron-right');
    }

    getHeaderTitle(option = { popover: false }) {
        return this.getDatePickerHeader({ popover: option.popover }).$('.mstrd-DatePickerHeader-title');
    }

    getCalendarMonthDaysWidget(option = { popover: false }) {
        return this.getDatePickerWidget({ popover: option.popover }).$$('.mstrd-rc-Month');
    }

    getMonthYearInWidget(monthYear) {
        return this.getCalendarMonthDaysWidget().filter(async (elem) => {
            const headerMonth = await elem.$('.mstrd-rc-Month-header').getText();
            return monthYear === headerMonth;
        })[0];
    }

    getDayInWidget(monthYear, day, option = { popover: false }) {
        const widget = option.popover
            ? this.getCalendarMonthDaysWidget({ popover: true })[0]
            : this.getMonthYearInWidget(monthYear);
        return widget.$$('.mstrd-rc-Day-day-label').filter(async (elem) => {
            const dayValue = Number(await elem.getText());
            return day === dayValue;
        })[0];
    }

    // Dynamic Calendar
    getDynamicCalendarContentCondition() {
        return this.getCalendarBody().$('.mstrd-DynamicCalendarContent-condition');
    }

    getDynamicCalendarConditionRadioBtn(name) {
        return this.getDynamicCalendarContentCondition().$(`input[value=${name}]`);
    }

    getCustomCondition() {
        const radios = this.getDynamicCalendarContentCondition().$$('.mstrd-DynamicCalendarContent-radios');
        return radios.last();
    }

    getDynamicCalendarConditionLastDay() {
        return this.getDynamicCalendarContentCondition().$('.mstrd-DynamicCalendarContent-lastNext');
    }

    getDynamicPreviewDate(flag) {
        const flagRegExp = multiElements(flag.toLowerCase());
        return this.getCalendarPanel()
            .$$('.mstrd-DynamicCalendarContentPreview')
            .filter(async (elem) => {
                const text = await elem.$('.mstrd-DynamicCalendarContentPreview-title').getText();
                return flagRegExp.test(text.toLowerCase());
            })[0];
    }

    // Dynamic Calendar Condition Picker
    getDynamicCalenderConditionPicker() {
        return this.$('.mstrd-DynamicCalendarConditionPicker');
    }

    getLeftDynamicCalenderConditionPicker() {
        return this.getDynamicCalenderConditionPicker().$('.mstrd-DynamicCalendarConditionPicker-left');
    }

    getRightDynamicCalenderConditionPicker() {
        return this.getDynamicCalenderConditionPicker().$('.mstrd-DynamicCalendarConditionPicker-right');
    }

    getInputDynamicCalenderConditionPicker() {
        return this.getDynamicCalenderConditionPicker().$('.mstrd-NumberInput input');
    }

    getPickerValue() {
        return this.getInputDynamicCalenderConditionPicker().getAttribute('value');
    }

    getDynamicCalenderConditionPickerOption(option) {
        return this.$$('.mstrd-DynamicCalendarConditionPicker-dropdown .ant-select-item-option-content').filter(
            async (elem) => {
                return option === (await elem.getText());
            }
        )[0];
    }

    getFixedDateCheckbox(flag = 'from') {
        return this.getDynamicPreviewDate(flag).$(`input[type ="checkbox"]`);
    }

    getCalendarIcon(flag = 'from') {
        return this.getDynamicPreviewDate(flag).$('.icon-calendar');
    }

    getDynamicCalendarDateInput(flag = 'from') {
        return this.getDateInput(this.getDynamicPreviewDate(flag));
    }

    getDynamicCustomButton(flag = 'from') {
        return this.getDynamicPreviewDate(flag).$('.ant-btn');
    }

    getWarning() {
        return this.getCalendarBody().$('.icon-warning');
    }

    // Footer
    getCalendarFooter() {
        return this.getCalendarPanel().$('.mstrd-FilterDetailPanelCalendar-footer');
    }

    getCalendarSelectedDays() {
        return this.getCalendarFooter().$('.mstrd-FilterDetailPanelCalendar-count');
    }

    getCalendarClearAll() {
        return this.getCalendarFooter().$('.mstrd-Button');
    }

    // Action  helper
    // Header
    async openCalendarTypeSelector() {
        await this.click({ elem: this.getCalendarTypeSelector() });
    }

    async selectCalendarFilterTypeOption(name) {
        if (this.isSafari()) {
            await this.clickForSafari(this.getCalendarExpDropdownOption(name));
        } else {
            await this.click({ elem: this.getCalendarExpDropdownOption(name) });
        }
    }

    async openAndSelectCalendarType(option) {
        await this.openCalendarTypeSelector();
        return this.selectCalendarFilterTypeOption(option);
    }

    // DateInput Wrapper
    async setInputDate({ partialDate, customValue }) {
        await partialDate.click();
        await this.hover({ elem: partialDate });
        await this.input(customValue);
        return this.waitForTextPresentInElementValue(partialDate, customValue);
    }

    async setInputBoxDate({ customMonth, customDay, customYear, flag = 'from', dynamic = false }) {
        const el = dynamic ? await this.getDynamicCalendarDateInput(flag) : await this.getCalendarDateInput(flag);
        await this.setInputDate({ partialDate: this.getInputMonth(el), customValue: String(customMonth) });
        await this.setInputDate({ partialDate: this.getInputDay(el), customValue: String(customDay) });
        await this.setInputDate({ partialDate: this.getInputYear(el), customValue: String(customYear) });
        return this.sleep(1000);
    }

    // Date Picker
    async clickHeaderIcon(el, times) {
        for (let i = 0; i < times; i++) {
            await this.click({ elem: el });
        }
    }

    async clickNextYear(times, option = { popover: false }) {
        return this.clickHeaderIcon(this.getNextYear({ popover: option.popover }), times);
    }

    async clickLastYear(times, option = { popover: false }) {
        return this.clickHeaderIcon(this.getLastYear({ popover: option.popover }), times);
    }

    async clickLastMonth(times, option = { popover: false }) {
        return this.clickHeaderIcon(this.getLastMonth({ popover: option.popover }), times);
    }

    async clickNextMonth(times, option = { popover: false }) {
        return this.clickHeaderIcon(this.getNextMonth({ popover: option.popover }), times);
    }

    async selectYearInWidget(year, option = { popover: false }) {
        const headerYear = Number(await this.getHeaderTitleYear({ popover: option.popover }));
        const times = Math.abs(year - headerYear);
        if (year > headerYear) {
            await this.clickNextYear(times, { popover: option.popover });
        } else if (year < headerYear) {
            await this.clickLastYear(times, { popover: option.popover });
        }
    }

    async selectMonthInWidget(month, option = { popover: false }) {
        // convert string month to number
        const headerMonth = getMonthFromString(await this.getHeaderTitleMonth({ popover: option.popover }));
        const expectMonth = getMonthFromString(month);
        const times = Math.abs(expectMonth - headerMonth);
        if (expectMonth > headerMonth) {
            await this.clickNextMonth(times, { popover: option.popover });
        } else if (expectMonth < headerMonth) {
            await this.clickLastMonth(times, { popover: option.popover });
        }
    }

    async selectDayInWidget(month, year, day, option = { popover: false }) {
        const monthYear = month + ' ' + year;
        return this.click({ elem: this.getDayInWidget(monthYear, day, { popover: option.popover }) });
    }

    async selectDate(customMonth, customDay, customYear, option = { popover: false }) {
        await this.selectYearInWidget(customYear, { popover: option.popover });
        await this.selectMonthInWidget(customMonth, { popover: option.popover });
        await this.selectDayInWidget(customMonth, customYear, customDay, { popover: option.popover });
    }

    // Dynamic Calendar
    /**
     * Select Dynamic Calendar Condition Type
     * @param name The string on the condition type, such as 'Today', 'Yesterday', 'Last 7 Days', 'Next 10 Years'
     * @returns {Promise<void>}
     */
    async selectDynamicCalendarConditionBtn(name) {
        const leftCondition = ['Last', 'Next'];
        const rightCondition = ['Days', 'Weeks', 'Months', 'Quarters', 'Years'];
        if (leftCondition.includes(name.split(' ')[0]) && rightCondition.includes(name.split(' ')[2])) {
            return this.click({ elem: this.getDynamicCalendarConditionLastDay() });
        }
        return this.click({ elem: this.getDynamicCalendarConditionRadioBtn(name) });
    }

    async selectDynamicCalendarCustomCondition() {
        return this.click({ elem: this.getCustomCondition() });
    }

    async clickFixedDateCheckbox(flag = 'from') {
        return this.click({ elem: this.getFixedDateCheckbox(flag) });
    }

    async openDynamicCalenderConditionPicker(flag = 'from') {
        await this.click({ elem: this.getDynamicCustomButton(flag) });
        return this.waitForElementVisible(this.getDynamicCalenderConditionPicker());
    }

    async closeDynamicCalenderConditionPicker(flag = 'from') {
        await this.click({ elem: this.getDynamicCustomButton(flag) });
        return this.waitForElementInvisible(this.getDynamicCalenderConditionPicker());
    }

    async selectDynamicCalenderCondition({ option, direction }) {
        switch (direction && direction.toLowerCase()) {
            case 'left':
                await this.click({ elem: this.getLeftDynamicCalenderConditionPicker() });
                break;
            case 'right':
                await this.click({ elem: this.getRightDynamicCalenderConditionPicker() });
                break;
        }
        await this.click({ elem: this.getDynamicCalenderConditionPickerOption(option) });
        return this.sleep(1000);
    }

    async inputDynamicCalendarConditionNumber(number, custom) {
        const textBox = this.getInputDynamicCalenderConditionPicker();
        const length = this.getPickerValue().length;
        await this.doubleClick({ elem: textBox });
        if (custom) {
            await this.hover({ elem: textBox });
        } else {
            await this.navigateRightWithArrow(length);
            await this.delete();
        }
        await this.input(number.toString());
        await this.sleep(500);
    }

    async inputDynamicCalenderCondition({ leftOpt, number, rightOpt, custom = false, flag = 'to' }) {
        if (leftOpt) {
            await this.selectDynamicCalenderCondition({ option: leftOpt, direction: 'left' });
        }
        if (number) {
            await this.inputDynamicCalendarConditionNumber(number, custom);
        }
        if (rightOpt) {
            await this.selectDynamicCalenderCondition({ option: rightOpt, direction: 'right' });
        }
        if (custom) {
            await this.click({ elem: this.getDynamicCustomButton(flag) });
        } else {
            await this.click({ elem: this.getDynamicCalendarConditionLastDay() });
        }
        return this.waitForElementStaleness(this.getDynamicCalenderConditionPicker());
    }

    async openDynamicCustomDatePicker(flag = 'from') {
        await this.click({ elem: this.getCalendarIcon(flag) });
        return this.waitForElementVisible(this.getDatePickerWidget({ popover: true }));
    }

    async closeDynamicCustomDatePicker(flag = 'from') {
        await this.click({ elem: this.getCalendarIcon(flag) });
        return this.waitForElementStaleness(this.getDatePickerWidget({ popover: true }));
    }

    // Footer
    async clearAll() {
        return this.click({ elem: this.getCalendarClearAll() });
    }

    // Assertion helper
    // Header
    async getCalendarSelectedOption() {
        return this.getCalendarTypeSelector().$('.mstrd-CalFilterTypeSelect-label').getText();
    }

    async getDynamicDateInputContent(flag = 'all') {
        const txt = await this.getDynamicInput().getText();
        switch (flag) {
            case 'from':
                return txt.toString().split(' ')[0];
            case 'to':
                return txt.toString().split(' ')[2];
            case 'all':
                return txt;
        }
    }

    // Date Picker
    async getHeaderTitleText(option = { popover: false }) {
        return this.getHeaderTitle({ popover: option.popover }).getText();
    }

    async getHeaderTitleYear(option = { popover: false }) {
        const el = await this.getHeaderTitleText({ popover: option.popover });
        return Number(el.match(/\d+/g));
    }

    async getHeaderTitleMonth(option = { popover: false }) {
        const el = await this.getHeaderTitleText({ popover: option.popover });
        return String(el.match(/[a-zA-Z]+/g));
    }

    // Dynamic Calendar
    async whichConditionIsSelected() {
        const elemList = await this.getDynamicCalendarContentCondition().$$('./input');
        for (const elem of elemList) {
            if (await this.isSelected(elem)) {
                const value = await getAttributeValue(elem, 'value');
                return value;
            }
        }
        return this.getDynamicCalendarContentCondition()
            .$('.mstrd-DynamicCalendarContent-lastNext .mstrd-DynamicCalendarContent-radios')
            .getAttribute('value');
    }

    async getDynamicPreviewContent(flag) {
        if ((await this.whichConditionIsSelected()) === 'Custom') {
            if (await this.isFixedDate(flag)) {
                const day = await this.getInputDay(await this.getDynamicCalendarDateInput(flag)).getAttribute('value');
                const month = await this.getInputMonth(await this.getDynamicCalendarDateInput(flag)).getAttribute(
                    'value'
                );
                const year = await this.getInputYear(await this.getDynamicCalendarDateInput(flag)).getAttribute(
                    'value'
                );
                switch (flag.toLowerCase()) {
                    case 'from':
                        return 'Fixed Date: ' + (await this.getI18NFormattedDate(day, month, year));
                    case 'to':
                        return 'Fixed Date: ' + (await this.getI18NFormattedDate(day, month, year));
                }
            } else {
                let date = '';
                const txt = await this.getDynamicPreviewDate(flag)
                    .$('.mstrd-DynamicCalendarContentPreview-text')
                    .getText();
                date = txt.toString().split(' ')[1];
                const buttonText = await this.getDynamicCustomButton(flag).getText();
                const buttonTextArray = buttonText.toString().split(' ');
                switch (buttonTextArray[0]) {
                    case 'Plus':
                        if (buttonTextArray[2] === 'Months') {
                            date = await addMonths(Number(buttonTextArray[1]), date);
                        } else {
                            date = await addDays(Number(buttonTextArray[1]), date);
                        }
                        break;
                    case 'Minus':
                        if (buttonTextArray[2] === 'Months') {
                            date = await addMonths(-Number(buttonTextArray[1]), date);
                        } else {
                            date = await addDays(-Number(buttonTextArray[1]), date);
                        }
                        break;
                }
                return `${txt.toString().split(':')[0]} ${buttonText}: ${await getStringOfDate(date)}`;
            }
        }
        return this.getDynamicPreviewDate(flag).$('.mstrd-DynamicCalendarContentPreview-text').getText();
    }

    async getDynamicPreviewContentDate(flag) {
        const txt = await this.getDynamicPreviewContent(flag);
        return txt.split(': ')[1];
    }

    async isFixedDate(flag) {
        return this.getDynamicCalendarDateInput(flag).isDisplayed();
    }

    async getWarningMsg() {
        await this.waitForElementVisible(this.getWarning());
        return this.getWarning().getText();
    }

    // Footer
    async getCalendarSelectedDaysCount() {
        const el = await this.getCalendarSelectedDays().getText();
        return Number(el.match(/\d+/g));
    }
}
