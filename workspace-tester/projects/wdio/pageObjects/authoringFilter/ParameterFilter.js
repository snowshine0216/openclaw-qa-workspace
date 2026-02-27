import BaseAuthoringFilter from './BaseAuthoringFilter.js';
import Calendar from '../selector/Calendar.js';
import LibraryAuthoringPage from '../library/LibraryAuthoringPage.js';

export default class ParameterFilter extends BaseAuthoringFilter {
    constructor() {
        super();
        this.calendar = new Calendar();
        this.libraryAuthoringPage = new LibraryAuthoringPage();
    }
    // element locator
    getValueParameterInputBox(filterName) {
        return this.getFilterByName(filterName).$('.mstrmojo-TextBox.mstrmojo-vi-sel-ValidationTextBox');
    }

    getDateTimeParameterIcon(filterName) {
        return this.getFilterByName(filterName).$('.mstrmojo-DateTextBox-icon');
    }

    getCalendarContainer() {
        return this.$('.mstrmojo-DateTextBox-calendar');
    }

    // action helper
    async inputValueParameter(filterName, value) {
        const inputBox = await this.getValueParameterInputBox(filterName);
        await this.clear({ elem: inputBox });
        await inputBox.setValue(value);
        await this.enter();
    }

    async chooseDateInParameter(filterName, year, month, day) {
        let calendarDisplayed = await this.getCalendarContainer().isDisplayed();
        for (let i = 0; i < 4; i++) {
            if (!calendarDisplayed) {
                console.log('click icon for calendar for ' + i + ' times');
                await this.click({ elem: this.getDateTimeParameterIcon(filterName) });
                calendarDisplayed = await this.getCalendarContainer().isDisplayed();
            }
        }
        await this.calendar.selectDate(year, month, day);
    }

    async chooseDateInParameterWithOkButton(filterName, year, month, day) {
        let calendarDisplayed = await this.getCalendarContainer().isDisplayed();
        for (let i = 0; i < 4; i++) {
            if (!calendarDisplayed) {
                console.log('click icon for calendar for ' + i + ' times');
                await this.click({ elem: this.getDateTimeParameterIcon(filterName) });
                calendarDisplayed = await this.getCalendarContainer().isDisplayed();
            }
        }
        await this.calendar.selectYear(year);
        await this.calendar.selectMonth(month);
        await this.calendar.selectDay(day);
        await this.calendar.clickOkButton();
    }

    async chooseDateTimeInParameter(filterName, year, month, day, hour, minute, second, meridiem) {
        await this.hover({ elem: this.libraryAuthoringPage.getLibraryHomeIconButton() });
        await this.click({ elem: this.getDateTimeParameterIcon(filterName) });
        let calendarDisplayed = await this.getCalendarContainer().isDisplayed();
        for (let i = 0; i < 3; i++) {
            if (!calendarDisplayed) {
                console.log('click icon for calendar for ' + i + ' times');
                await this.click({ elem: this.getDateTimeParameterIcon(filterName) });
                calendarDisplayed = await this.getCalendarContainer().isDisplayed();
            }
        }
        await this.calendar.selectDayTime(year, month, day, hour, minute, second, meridiem);
        await this.calendar.clickOkButton();
    }
}
