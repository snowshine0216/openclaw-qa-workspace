class CalendarFilter extends BaseContainer {
  root() {
    return this.$('.mstrd-CalendarWidget');
  }

  getApplyButton() {
    return this.$('.mstrd-Apply-btn');
  }

  getDateInput() {
    return this.$('.mstrd-Date-input');
  }

  async applyFilter() {
    await this.getApplyButton().click();
  }

  async selectDate(year, month, day) {
    this.CalendarWidget.select(year, month, day);
  }
}

export default new CalendarFilter();
