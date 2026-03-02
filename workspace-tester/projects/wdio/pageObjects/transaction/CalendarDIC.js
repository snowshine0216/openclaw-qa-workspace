import BaseComponent from '../base/BaseComponent.js';

export default class CalendarDIC extends BaseComponent {
    constructor(container) {
        super(container, '.mstrmojo-Calendar', 'Calendar DIC for TXN');
    }

    // element locator
    getPreviousArrow() {
        return this.locator.$('.mstrmojo-Calendar-decrease');
    }

    getNextArrow() {
        return this.locator.$('.mstrmojo-Calendar-increase');
    }

    getDayCell(day) {
        return this.locator.$$('.mstrmojo-Calendar-dayView .mstrmojo-Calendar-day-cur').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === day.toString();
        })[0];
    }

    getYearLabel() {
        return this.locator.$('.mstrmojo-Calendar-header .mstrmojo-Calendar-yearLabel');
    }

    getMonthLabel() {
        return this.locator.$('.mstrmojo-Calendar-header .mstrmojo-Calendar-monthLabel');
    }

    getYearView() {
        return this.locator.$('.mstrmojo-Calendar-yearView');
    }

    getYearCell(year) {
        return this.locator.$$('.mstrmojo-Calendar-yearView .mstrmojo-Calendar-year').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === year.toString();
        })[0];
    }

    getMonthCell(month) {
        return this.locator.$$('.mstrmojo-Calendar-monthView .mstrmojo-Calendar-month').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === month;
        })[0];
    }

    getHourLabel() {
        return this.locator.$('.mstrmojo-Calendar-hourLabel');
    }

    getHourCell(hour, meridiem) {
        const el = this.$$('.mstrmojo-Calendar-hour').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === hour.toString();
        });
        let cell;
        if (meridiem === 'AM') {
            cell = el[0];
        } else if (meridiem === 'PM') {
            cell = el[1];
        }
        return cell;
    }

    getMinuteLabel() {
        return this.locator.$('.mstrmojo-Calendar-minuteLabel');
    }

    getMinuteCell(minute) {
        return this.locator.$$('.mstrmojo-Calendar-minute').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === minute.toString();
        })[0];
    }

    getSecondLabel() {
        return this.locator.$('.mstrmojo-Calendar-secondLabel');
    }

    getSecondCell(second) {
        return this.locator.$$('.mstrmojo-Calendar-second').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === second.toString();
        })[0];
    }

    getOkBtn() {
        return this.locator.$('.mstrmojo-Button.mstrmojo-WebButton.hot');
    }

    getInputBox() {
        return this.$('.mstrmojo-DateTextBox .mstrmojo-DateTextBox-input');
    }

    getDateIcon() {
        return this.$('.mstrmojo-DateTextBox .mstrmojo-DateTextBox-icon');
    }

    // actionHelper
    async chooseCalendar(year, month, day) {
        if (this.isWeb()) {
            const yearLabel = this.getYearLabel();
            await this.click({ elem: yearLabel });
            await this.waitForElementVisible(this.getYearView());
            await this.sleep(2000);
            await this.click({ elem: this.getYearCell(year) });
            const monthLabel = this.getMonthLabel();
            await this.click({ elem: monthLabel });
            const isMonthCellVisible = await this.getMonthCell(month).isDisplayed();
            if (!isMonthCellVisible) {
                console.log('month cell is not visible, click month label again');
                await this.click({ elem: monthLabel });
            }
            await this.click({ elem: this.getMonthCell(month) });
            await this.sleep(2000);
            await this.click({ elem: this.getDayCell(day) });
            await this.waitDataLoaded();
        } else {
            // const { year, month, day } = option;
            const title = this.locator.$('.mstrmojo-Calendar-title');
            const yearLabel = this.getYearLabel();
            await this.click({ elem: yearLabel });
            await this.waitForElementVisible(this.getYearView());
            // add sleep here to wait for year view to be loaded 
            await this.sleep(500);
            await this.click({ elem: this.getYearCell(year) });
            const monthLabel = this.getMonthLabel();
            await this.click({ elem: monthLabel });
            const isMonthCellVisible = await this.getMonthCell(month).isDisplayed();
            if (!isMonthCellVisible) {
                console.log('month cell is not visible, click month label again');
                await this.click({ elem: monthLabel });
            }
            await this.click({ elem: this.getMonthCell(month) });
            await this.click({ elem: this.getDayCell(day) });
            await this.waitDataLoaded();
        }
    }

    async chooseTime(hour, meridiem, minute, second) {
        await this.click({ elem: this.getHourLabel() });
        await this.waitForElementVisible(this.getHourCell(12, 'AM'));
        await this.click({ elem: this.getHourCell(hour, meridiem) });
        await this.click({ elem: this.getMinuteLabel() });
        await this.waitForElementVisible(this.getMinuteLabel(59));
        await this.click({ elem: this.getMinuteCell(minute) });
        await this.click({ elem: this.getSecondLabel() });
        await this.waitForElementVisible(this.getSecondCell(59));
        await this.click({ elem: this.getSecondCell(second) });
    }

    async confirm() {
        await this.click({ elem: this.getOkBtn() });
        await this.click({ elem: this.getDocView(), offset: { x: 700, y: 0 } });
        await this.waitDataLoaded();
    }

    async setTimeWithInput(dateTime) {
        const input = this.getInputBox();
        await this.clear({ elem: input });
        await input.setValue(dateTime);
    }

    async showCalendarByDateIcon() {
        await this.click({ elem: this.getDateIcon() });
        await this.waitForElementVisible(this.getElement());
    }
}
