import BasePage from '../base/BasePage.js';
import { scrollElementToBottom } from '../../utils/scroll.js';

export default class CalendarWidget extends BasePage {
    // element locator

    getWidgetContainer() {
        return this.$('.mstrd-Calendar-widget-container');
    }

    getWidgetCalendarList() {
        return this.getWidgetContainer().$('.mstrd-Calendar-list');
    }

    getMonthYearInWidget(monthYear) {
        return this.getWidgetContainer()
            .$$('.mstrd-rc-Month')
            .filter(async (elem) => {
                const mmyyValue = await elem.$('.mstrd-rc-Month-header').getText();
                return monthYear === mmyyValue;
            })[0];
    }

    getDateInWidget({ monthYear, day }) {
        return this.getMonthYearInWidget(monthYear)
            .$$(`.mstrd-rc-Day:not(.mstrd-rc-Day--outside)`)
            .filter(async (elem) => {
                const dayValue = await elem.$('.mstrd-rc-Day-day-label').getText();
                return day === dayValue;
            })[0];
    }

    getLeftHeaderInWidget() {
        return this.getWidgetContainer().$('.mstrd-DatePickerHeader-left');
    }

    getRightHeaderInWidget() {
        return this.getWidgetContainer().$('.mstrd-DatePickerHeader-right');
    }

    getHeaderTextInWidget() {
        return this.getWidgetContainer().$('.mstrd-DatePickerHeader-title');
    }

    getWidgetPreviousMonth() {
        return this.getLeftHeaderInWidget().$('.icon-chevron-left');
    }

    getWidgetPreviousYear() {
        return this.getLeftHeaderInWidget().$('.icon-last_year');
    }

    getWidgetNextMonth() {
        return this.getRightHeaderInWidget().$('.icon-chevron-right');
    }

    getWidgetNextYear() {
        return this.getRightHeaderInWidget().$('.icon-next_year');
    }

    getWidgetMonthYearHeader() {
        return this.getWidgetContainer().$$('.mstrd-rc-Month-header')[0];
    }

    getWidgetMonthOfFrom() {
        return this.getWidgetContainer()
            .$$('.mstrd-rc-Month')
            .filter(async (elem) => {
                const isPresent = await elem.$('.mstrd-rc-Day--from').isDisplayed();
                return isPresent;
            })[0]
            .$('header');
    }

    getWidgetDayOfFrom() {
        return this.$('.mstrd-rc-Day--from');
    }

    getWidgetMonthOfTo() {
        return this.getWidgetContainer()
            .$$('.mstrd-rc-Month')
            .filter(async (elem) => {
                const isPresent = await elem.$('.mstrd-rc-Day--to').isDisplayed();
                return isPresent;
            })[0]
            .$('header');
    }

    getWidgetDayOfTo() {
        return this.$('.mstrd-rc-Day--to');
    }

    getWidgetDaySelected() {
        return this.$('.mstrd-rc-Day--selected');
    }

    getWidgetMonth() {
        return this.getWidgetContainer().$('.mstrd-Calendar-list').$$('.mstrd-rc-Month')[0];
    }

    getWidgetMonthWeek() {
        return this.getWidgetMonth().$('.mstrd-rc-Month-weekdays');
    }

    getWidgetMonthStartWeekDay() {
        return this.getWidgetMonthWeek().$$('.mstrd-rc-Month-weekdays-weekday')[0];
    }

    // action helper

    async goToPreviousMonth() {
        await this.waitForElementClickable(this.getWidgetPreviousMonth(), {
            timeout: 2000,
            msg: 'Go to previous month is not clickable.',
        });
        await this.getWidgetPreviousMonth().click();
        await this.waitForElementVisible(this.getWidgetMonthYearHeader(), {
            timeout: 5000,
            msg: 'Loading Month takes too long.',
        });
        await this.waitForElementVisible(this.getWidgetDaySelected(), {
            timeout: 5000,
            msg: 'Loading Month takes too long.',
        });
    }

    async goToNextMonth() {
        await this.waitForElementClickable(this.getWidgetNextMonth(), {
            timeout: 2000,
            msg: 'Go to next month is not clickable.',
        });
        await this.getWidgetNextMonth().click();
        await this.waitForElementVisible(this.getWidgetMonthYearHeader(), {
            timeout: 5000,
            msg: 'Loading Month takes too long.',
        });
    }

    async goToPreviousYear() {
        await this.waitForElementClickable(this.getWidgetPreviousYear(), {
            timeout: 2000,
            msg: 'Go to previous year is not clickable.',
        });
        await this.getWidgetPreviousYear().click();
        await this.waitForElementVisible(this.getWidgetMonthYearHeader(), {
            timeout: 5000,
            msg: 'Loading Year takes too long.',
        });
        await this.waitForElementVisible(this.getWidgetDaySelected(), {
            timeout: 5000,
            msg: 'Loading Year takes too long.',
        });
    }

    async goToNextYear() {
        await this.waitForElementClickable(this.getWidgetNextYear(), {
            timeout: 2000,
            msg: 'Go to next year is not clickable.',
        });
        await this.getWidgetNextYear().click();
        await this.waitForElementVisible(this.getWidgetMonthYearHeader(), {
            timeout: 5000,
            msg: 'Loading Year takes too long.',
        });
    }

    async selectDateInWidget({ monthYear, day }) {
        await this.waitForElementVisible(this.getWidgetContainer(), {
            timeout: 2000,
            msg: 'It takes too long to load calendar widget.',
        });
        await this.getDateInWidget({ monthYear, day }).click();
        return this.sleep(1000);
    }

    async scrollWidgetToBottom() {
        // let offsetHeight = (await this.getWidgetCalendarList().$$('div')[0].getCSSProperty('height')).value;
        // offsetHeight = offsetHeight.split('p')[0];
        // await this.executeScript(
        //     'arguments[0].scrollTop = arguments[1];',
        //     await this.getWidgetCalendarList(),
        //     offsetHeight
        // );
        await scrollElementToBottom(this.getWidgetCalendarList());
        return this.sleep(1000); // Wait for animation to complete
    }

    // Assertion helper

    async widgetMonthOfFrom() {
        return this.getWidgetMonthOfFrom().getText();
    }

    async widgetDayOfFrom() {
        return this.getWidgetDayOfFrom().$('.mstrd-rc-Day-day-label').getText();
    }

    async widgetMonthOfTo() {
        return this.getWidgetMonthOfTo().getText();
    }

    async widgetDayOfTo() {
        return this.getWidgetDayOfTo().$('.mstrd-rc-Day-day-label').getText();
    }

    async widgetDayOfSelected() {
        return this.getWidgetDaySelected().$('.mstrd-rc-Day-day-label').getText();
    }

    async widgetTextAsSelected() {
        return this.getWidgetDaySelected().$('.mstrd-rc-Day-cal-type').getText();
    }

    async isDateSelectedInWidget({ monthYear, day }) {
        const className = await this.getDateInWidget({ monthYear, day }).getAttribute('class');
        return className.includes('mstrd-rc-Day-selected');
    }

    async isSingleDateSelected() {
        const dayFrom = await this.widgetDayOfFrom();
        const dayTo = await this.widgetDayOfTo();
        const daySelected = await this.widgetDayOfSelected();
        const selected = await this.widgetTextAsSelected();
        return selected === 'Selected' && daySelected === dayTo && dayFrom === dayTo;
    }

    async getWidgetHeaderMonthYear() {
        return this.getHeaderTextInWidget().getText();
    }
}
