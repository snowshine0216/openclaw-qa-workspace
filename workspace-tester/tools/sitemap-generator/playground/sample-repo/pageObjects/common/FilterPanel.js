class FilterPanel {
  getPanelContainer() {
    return this.$('.mstrd-filter-panel');
  }

  async open() {
    await this.getPanelContainer().click();
  }
}

export default new FilterPanel();
