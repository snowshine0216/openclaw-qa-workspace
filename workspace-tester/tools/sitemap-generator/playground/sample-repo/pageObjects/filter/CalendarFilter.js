class CalendarFilter extends BaseContainer {
  getApplyButton() {
    return this.$('.mstrd-Apply-btn');
  }

  async applyFilter() {
    await this.getApplyButton().click();
  }
}

export default new CalendarFilter();
