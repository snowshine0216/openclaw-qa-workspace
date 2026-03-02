import DossierPage from '../dossier/DossierPage.js';
import { getInputValue , getAttributeValue} from '../../utils/getAttributeValue.js';
import BaseComponent from '../base/BaseComponent.js';

export default class Calendar extends BaseComponent {
    constructor(container) {
        super(container, '.Attr-Qual-InputBox');
        this.dossierPage = new DossierPage();
        this.calendarIcon = '.mstrmojo-DateTextBox-icon';
        this.calendarTextBox = '.mstrmojo-DateTextBox-input';
    }

    getFromBox() {
        return this.getElement().$('.mstrmojo-Box.from-box');
    }

    getToBox() {
        return this.getElement().$('.mstrmojo-Box.to-box');
    }

    getDateTimePickerIcon() {
        return this.getElement().$('.mstr-date-time-range-picker-with-input-input-calendar-icon');
    }

    getDateTimeInputBox() {
        return this.getElement().$('.mstr-date-time-range-picker-with-input-input');
    }

    getFromCalendarIcon() {
        return this.getFromBox().$(this.calendarIcon);
    }

    getToCalendarIcon() {
        return this.getToBox().$(this.calendarIcon);
    }

    getFromTextBox() {
        return this.getFromBox().$(this.calendarTextBox);
    }

    getToTextBox() {
        return this.getToBox().$(this.calendarTextBox);
    }

    async getFromDate() {
        return getInputValue(this.getFromTextBox());
    }

    async getToDate() {
        return getInputValue(this.getToTextBox());
    }

    async getInputDate() {
        // if getInputValue = '', fetch value from placeholder
        const el = this.getDateTimeInputBox();
        let value = await getInputValue(el);
        if (value === '') {
            value = await getAttributeValue(el, 'placeholder');
        }
        return value;
    }

    getCalendarWidget() {
        return this.$$('.mstrmojo-Popup.mstrmojo-DateTextBox-calendar').filter((item) => item.isDisplayed())[0];
    }

    getCalendarHeader() {
        return this.getCalendarWidget().$('.mstrmojo-Calendar-header');
    }

    getCalendarBody() {
        return this.getCalendarWidget().$('.mstrmojo-Calendar-body');
    }

    getCalendarAdvanced() {
        return this.getCalendarWidget().$('.mstrmojo-Calendar-advanced');
    }

    getCalendarButton() {
        return this.getCalendarWidget().$('.mstrmojo-Calendar-buttons');
    }

    getNextIcon() {
        return this.getCalendarHeader().$('.mstrmojo-Calendar-increase');
    }

    getLastIcon() {
        return this.getCalendarHeader().$('.mstrmojo-Calendar-decrease');
    }

    getCalendarYearHeader() {
        return this.getCalendarHeader().$('.mstrmojo-Calendar-yearLabel');
    }

    getCalendarMonthHeader() {
        return this.getCalendarHeader().$('.mstrmojo-Calendar-monthLabel');
    }

    getCalendarYearView() {
        return this.getCalendarBody().$('.mstrmojo-Calendar-yearView');
    }

    getCalendarMonthView() {
        return this.getCalendarBody().$('.mstrmojo-Calendar-monthView');
    }

    getCalendarDayView() {
        return this.getCalendarBody().$('.mstrmojo-Calendar-dayView');
    }

    getCalendarYearValues() {
        return this.getCalendarYearView().$$('.mstrmojo-Calendar-year');
    }

    getCalendarMonthValues() {
        return this.getCalendarMonthView().$$('.mstrmojo-Calendar-month');
    }

    getCalendarDayValues() {
        return this.getCalendarDayView().$$('.mstrmojo-Calendar-day-cur');
    }

    getDynamicDateBox() {
        return this.getCalendarAdvanced().$('.mstrmojo-ui-Checkbox');
    }

    getDynamicDateAdjustBox() {
        return this.getCalendarAdvanced().$$('.mstrmojo-HBox.dateAdjustBox');
    }

    getDynamicDateDropdown(index) {
        return this.getDynamicDateAdjustBox()[index - 1].$('.mstrmojo-ui-Pulldown');
    }

    getDynamicCalendarDropdownList() {
        const dorpdownLists = this.$$('.mstrmojo-PopupList.ctrl-popup-list.mstrmojo-scrollbar-host');
        return dorpdownLists.filter((item) => item.isDisplayed())[0];
    }

    getDynamicCalendarDropdownListItems() {
        return this.getDynamicCalendarDropdownList().$$('.item');
    }

    getDynamicDateStepper(index) {
        return this.getDynamicDateAdjustBox()[index - 1].$('.mstrmojo-Stepper');
    }

    getDynamicDateStepperNext(index) {
        return this.getDynamicDateStepper(index).$('.next');
    }

    getDynamicDateStepperPrev(index) {
        return this.getDynamicDateStepper(index).$('.prev');
    }

    getDynamicCalendarButtons() {
        return this.getCalendarButton().$$('.mstrmojo-Button.mstrmojo-WebButton');
    }

    getCalendarTime() {
        return this.getCalendarWidget().$('.mstrmojo-Calendar-timePart');
    }

    getCalendarHour() {
        return this.getCalendarTime().$('.mstrmojo-Calendar-hourLabel');
    }

    getCalendarMinute() {
        return this.getCalendarTime().$('.mstrmojo-Calendar-minuteLabel');
    }

    getCalendarSecond() {
        return this.getCalendarTime().$('.mstrmojo-Calendar-secondLabel');
    }

    getCalendarHourView() {
        return this.getCalendarBody().$('.mstrmojo-Calendar-hourView');
    }

    getCalendarMinuteView() {
        return this.getCalendarBody().$('.mstrmojo-Calendar-minuteView');
    }

    getCalendarSecondView() {
        return this.getCalendarBody().$('.mstrmojo-Calendar-secondView');
    }

    getCalendarHourValues() {
        return this.getCalendarHourView().$$('.mstrmojo-Calendar-hour');
    }

    getCalendarMinuteValues() {
        return this.getCalendarMinuteView().$$('.mstrmojo-Calendar-minute');
    }

    getCalendarSecondValues() {
        return this.getCalendarSecondView().$$('.mstrmojo-Calendar-second');
    }

    getOkBtn() {
        return this.getCalendarButton().$('.mstrmojo-Button.mstrmojo-WebButton.hot');
    }

    // action  helper
    async inputDate(dimension, date) {
        let dateTextbox;
        switch (dimension) {
            case 'from':
                dateTextbox = await this.getFromTextBox();
                break;
            case 'to':
                dateTextbox = await this.getToTextBox();
                break;
            default:
                throw new Error(`Please input either 'from' or 'to' to define dimension`);
        }
        // await dateTextbox.clear().sendKeys(date);
        await this.clear({ elem: dateTextbox });
        await dateTextbox.setValue(date);
        await this.enter();
        await this.waitForCurtainDisappear();
    }

    async openFromCalendar() {
        await this.click({ elem: this.getFromCalendarIcon() });
        await this.waitForElementVisible(this.getCalendarWidget());
    }

    async openDateTimePicker() {
        await this.click({ elem: this.getDateTimePickerIcon() });

    }

    async openToCalendar() {
        await this.click({ elem: this.getToCalendarIcon() });
        await this.waitForElementVisible(this.getCalendarWidget());
    }

    async selectYear(year) {
        await this.waitForElementVisible(this.getCalendarWidget());
        await this.click({ elem: this.getCalendarYearHeader() });
        await this.waitForElementInvisible(this.getCalendarDayView());
        const el = await this.getCalendarYearView()
            .$$('.mstrmojo-Calendar-year')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === year;
            })[0];

        // await this.click({elem: el, offset: { x: 17, y: 10 }});
        await this.click({ elem: el });
        await this.waitForElementInvisible(this.getCalendarYearView());
    }

    async selectMonth(month) {
        await this.waitForElementVisible(this.getCalendarWidget());
        await this.click({ elem: this.getCalendarMonthHeader() });
        await this.waitForElementInvisible(this.getCalendarDayView());
        const el = await this.getCalendarMonthView()
            .$$('.mstrmojo-Calendar-month')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === month;
            })[0];
        await this.click({ elem: el });
        await this.waitForElementInvisible(this.getCalendarMonthView());
    }

    async selectDay(day) {
        await this.waitForElementVisible(this.getCalendarWidget());
        await this.waitForElementVisible(this.getCalendarDayView());
        const el = await this.getCalendarDayView()
            .$$('.mstrmojo-Calendar-day-cur')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === day;
            })[0];

        await this.click({ elem: el });
    }

    async selectDate(year, month, day) {
        await this.selectYear(year);
        await this.selectMonth(month);
        await this.selectDay(day);
        await this.waitForElementInvisible(this.getCalendarWidget());
        await this.dossierPage.waitForPageLoading();
    }

    async selectDateWithOKBtn(year, month, day) {
        await this.selectYear(year);
        await this.selectMonth(month);
        await this.selectDay(day);
        await this.clickOkButton();
        await this.waitForElementInvisible(this.getCalendarWidget());
        await this.dossierPage.waitForPageLoading();
    }

    async selectHour(hour, meridiem) {
        await this.waitForElementVisible(this.getCalendarWidget());
        await this.waitForElementEnabled(this.getCalendarHour());
        await this.clickAndNoWait({ elem: this.getCalendarHour() });
        await this.waitForElementVisible(this.getCalendarHourView());
        const el = this.getCalendarHourView()
            .$$('.mstrmojo-Calendar-hour')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(hour);
            });

        if (meridiem === 'AM') {
            await this.waitForElementVisible(el[0]);
            await this.waitForElementEnabled(el[0]);
            await this.clickAndNoWait({ elem: el[0] });
        } else {
            await this.waitForElementVisible(el[1]);
            await this.waitForElementEnabled(el[1]);
            await this.clickAndNoWait({ elem: el[1] });
        }
        await this.waitForElementInvisible(this.getCalendarHourView());
    }

    async selectMinute(minute) {
        await this.waitForElementVisible(this.getCalendarWidget());
        await this.click({ elem: this.getCalendarMinute() });
        await this.waitForElementVisible(this.getCalendarMinuteView());
        const el = await this.getCalendarMinuteView()
            .$$('.mstrmojo-Calendar-minute')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === minute;
            })[0];
        const size = await el.getSize();
        // await this.click({elem: el, offset:{ x: size.width / 2, y: size.height / 2 - 4 }});
        await this.click({ elem: el });
        await this.waitForElementInvisible(this.getCalendarMinuteView());
    }

    async selectSecond(second) {
        await this.waitForElementVisible(this.getCalendarWidget());
        await this.click({ elem: this.getCalendarSecond() });
        await this.waitForElementVisible(this.getCalendarSecondView());
        const el = await this.getCalendarSecondView()
            .$$('.mstrmojo-Calendar-second')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === second;
            })[0];

        const size = await el.getSize();
        // await this.click({elem: el, offset: { x: size.width / 2, y: size.height / 2 - 1 }});
        await this.click({ elem: el });
        await this.waitForElementInvisible(this.getCalendarSecondView());
    }

    async selectDayTime(year, month, day, hour, minute, second, meridiem = 'AM') {
        await this.selectYear(year);
        await this.selectMonth(month);
        await this.selectDay(day);
        await this.selectHour(hour, meridiem);
        await this.selectMinute(minute);
        await this.selectSecond(second);
    }

    async clickOkButton() {
        await this.click({ elem: this.getOkBtn() });
        await this.waitDataLoaded();
    }

    async clickDynamicDateCheckBox() {
        await this.click({ elem: this.getDynamicDateBox() });
    }

    async openDynamicDayDropdown() {
        await this.click({ elem: this.getDynamicDateDropdown(1) });
        return this.waitForElementVisible(this.getDynamicCalendarDropdownListItems()[0]);
    }

    async openDynamicMonthDropdown() {
        await this.getDynamicDateDropdown(2).click();
        return this.waitForElementVisible(this.getDynamicCalendarDropdownList());
    }

    async selectDynamicCalendarDropdownItem(index, text) {
        await this.openDynamicDayDropdown();
        return this.getDynamicCalendarDropdownListItems()[index - 1].click();
    }

    async selectDynamicDayDropdownItem(index, text) {
        await this.openDynamicDayDropdown();
        return this.click({ elem: this.getDynamicCalendarDropdownListItems()[index - 1] });
    }

    async selectDynamicMonthDropdownItem(index, text) {
        await this.openDynamicMonthDropdown();
        return this.click({ elem: this.getDynamicCalendarDropdownListItems()[index - 1] });
    }

    async clickDynamicDayStepperNext(times) {
        for (let i = 0; i < times; i++) {
            await this.click({ elem: this.getDynamicDateStepperNext(1) });
        }
    }

    async clickDynamicDayStepperPrev(times) {
        for (let i = 0; i < times; i++) {
            await this.click({ elem: this.getDynamicDateStepperPrev(1) });
        }
    }

    async clickDynamicMonthStepperNext(times) {
        for (let i = 0; i < times; i++) {
            await this.click({ elem: this.getDynamicDateStepperNext(2) });
        }
    }

    async clickDynamicMonthStepperPrev() {
        await this.click({ elem: this.getDynamicDateStepperPrev(2) });
    }

    async clickDynamicCalendarButton(btnName) {
        const button = await this.getCalendarButton()
            .$$('.mstrmojo-Button-text')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === btnName;
            })[0];
        await this.click({ elem: button });
        return this.dossierPage.waitForPageLoading();
    }

    async isDynamicDateChecked() {
        const value = await this.isChecked(this.getDynamicDateBox());
        return value;
    }
}
